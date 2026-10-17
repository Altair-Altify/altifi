/* ---------- "Video" = animated explainer made of scenes (HTML/CSS + optional Web Speech narration) ----------
 * One shared player; each video is just data: a list of scenes with timed elements and a narration line.
 * Narration uses the device's speech voices (Vietnamese voice quality depends on the device);
 * captions are always shown, so it also works muted. */
import type { TL } from "../i18n/i18n";
import { tx, t, lang } from "../i18n/i18n";
import { S, save, PO } from "../core/state";
import { esc, vnd, shortVnd, fmtNum } from "../core/util";
import { reg } from "../core/actions";
import { icon } from "../ui/icons";
const vic = (n: string) => icon(n, { size: 18, tint: 0.3 });

type Anim = "pop" | "up" | "fade" | "left" | "right";
type Base = { at?: number; anim?: Anim };
export type El =
  | (Base & { k: "h"; text: TL })
  | (Base & { k: "p"; text: TL })
  | (Base & { k: "emoji"; e: string; size?: number })
  | (Base & { k: "big"; text: TL; color?: string })
  | (Base & { k: "counter"; from: number; to: number; unit: "vnd" | "mvnd" | "pct" | "num"; color?: string; ms?: number; label?: TL })
  | (Base & { k: "bars"; bars: { label: TL; v: number; color: string; txt?: TL }[]; max?: number })
  | (Base & { k: "row"; els: El[] })
  | (Base & { k: "tag"; text: TL; color: string })
  | (Base & { k: "html"; html: string });
export interface Scene { dur: number; bg?: string; say?: TL; els: El[] }
export interface VideoDef { id: string; title: TL; scenes: Scene[] }

const V: { def: VideoDef | null; idx: number; playing: boolean; timer: any; spoke: boolean; elapsed: boolean; done: boolean; onDone: (() => void) | null; ticks: any[]; token: number } =
  { def: null, idx: 0, playing: false, timer: null, spoke: false, elapsed: false, done: false, onDone: null, ticks: [], token: 0 };

const fmt = (n: number, unit: string) =>
  unit === "vnd" ? vnd(n, lang()) : unit === "mvnd" ? shortVnd(n, lang()) : unit === "pct" ? fmtNum(n, lang(), 1) + "%" : fmtNum(n, lang());

function elHTML(e: El): string {
  const cls = (c: string, css = "") => `class="v-el v-${e.anim || "up"} ${c}" style="animation-delay:${e.at || 0}ms;${css}"`;
  switch (e.k) {
    case "h": return `<div ${cls("v-h")}>${tx(e.text)}</div>`;
    case "p": return `<div ${cls("v-p")}>${tx(e.text)}</div>`;
    case "emoji": return `<div ${cls("v-emoji", `font-size:${e.size || 56}px`)}>${e.e}</div>`;
    case "big": return `<div ${cls("v-big", `color:${e.color || "#5B5BD6"}`)}>${tx(e.text)}</div>`;
    case "tag": return `<span ${cls("v-tag", `background:${e.color}`)}>${tx(e.text)}</span>`;
    case "html": return `<div ${cls("")}>${e.html}</div>`;
    case "counter":
      return `<div ${cls("v-counter", `color:${e.color || "#1E8E58"}`)}><b data-from="${e.from}" data-to="${e.to}" data-unit="${e.unit}" data-at="${e.at || 0}" data-ms="${e.ms || 1600}">${fmt(e.from, e.unit)}</b>${e.label ? `<small>${tx(e.label)}</small>` : ""}</div>`;
    case "bars": {
      const max = e.max || Math.max(...e.bars.map((b) => b.v));
      return `<div ${cls("v-bars")}>${e.bars.map((b, i) => `<div class="v-bar"><span class="v-bv" style="animation-delay:${(e.at || 0) + 300 + i * 250}ms">${b.txt ? tx(b.txt) : ""}</span><i style="--h:${Math.max(3, (b.v / max) * 100)}%;background:${b.color};animation-delay:${(e.at || 0) + i * 250}ms"></i><em>${tx(b.label)}</em></div>`).join("")}</div>`;
    }
    case "row": return `<div ${cls("v-row")}>${e.els.map(elHTML).join("")}</div>`;
  }
}

function sceneHTML(sc: Scene) {
  return `<div class="v-scene" style="${sc.bg ? `background:${sc.bg}` : ""}">${sc.els.map(elHTML).join("")}</div>`;
}

export function videoHTML(def: VideoDef) {
  const segs = def.scenes.map((_, i) => `<button class="v-seg" onclick="A.vJump(${i})" aria-label="${i + 1}"><i></i></button>`).join("");
  return `<div class="vplayer${PO() ? " still" : ""}" id="vplayer">
    <div class="v-segs">${segs}</div>
    <div class="v-stage" id="vstage" onclick="A.vToggle()"></div>
    <div class="v-cap" id="vcap" aria-live="polite"></div>
    <div class="v-ctrl">
      <button onclick="A.vToggle()" id="vplay" aria-label="${t("vd.play")}">${vic("playTri")}</button>
      <button onclick="A.vReplay()" aria-label="${t("vd.replay")}">${vic("refresh")}</button>
      <span class="v-title">${icon("video", { size: 15 })} ${esc(tx(def.title))}</span>
      <button onclick="A.vVoice()" id="vvoice" aria-label="${S.set.voice ? t("vd.voiceOn") : t("vd.voiceOff")}">${vic(S.set.voice ? "speaker" : "mute")}</button>
    </div></div>`;
}

const alive = () => !!document.getElementById("vplayer");
function clearTicks() { V.ticks.forEach(clearInterval); V.ticks = []; }

function speak(text: string, after: () => void) {
  const synth = window.speechSynthesis;
  if (!S.set.voice || !synth || !text) return after();
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ""));
    const want = lang() === "vi" ? "vi" : "en";
    u.lang = want === "vi" ? "vi-VN" : "en-US";
    const v = synth.getVoices().find((x) => x.lang.toLowerCase().startsWith(want));
    if (v) u.voice = v;
    u.rate = 1.02;
    let fired = false;
    const fin = () => { if (!fired) { fired = true; after(); } };
    u.onend = fin; u.onerror = fin;
    synth.speak(u);
    setTimeout(fin, 20000); // some browsers never fire onend
  } catch { after(); }
}

function runCounters(stage: HTMLElement) {
  stage.querySelectorAll<HTMLElement>(".v-counter b").forEach((b) => {
    const from = +b.dataset.from!, to = +b.dataset.to!, unit = b.dataset.unit!, at = PO() ? 0 : +b.dataset.at!, ms = PO() ? 1 : +b.dataset.ms!;
    const t0 = performance.now() + at;
    const id = setInterval(() => {
      if (!b.isConnected) return clearInterval(id);
      const k = Math.min(1, Math.max(0, (performance.now() - t0) / ms));
      const e = 1 - Math.pow(1 - k, 3);
      b.textContent = fmt(from + (to - from) * e, unit);
      if (k >= 1) clearInterval(id);
    }, 40);
    V.ticks.push(id);
  });
}

function show(i: number) {
  if (!V.def || !alive()) return;
  clearTimeout(V.timer); clearTicks();
  V.idx = i; V.spoke = false; V.elapsed = false;
  const sc = V.def.scenes[i];
  const stage = document.getElementById("vstage")!;
  stage.innerHTML = sceneHTML(sc);
  document.getElementById("vcap")!.innerHTML = sc.say ? tx(sc.say) : "";
  document.querySelectorAll<HTMLElement>(".v-seg").forEach((s, k) => {
    s.classList.toggle("on", k === i); s.classList.toggle("past", k < i);
    const bar = s.querySelector("i") as HTMLElement;
    bar.style.animationDuration = sc.dur + "ms";
  });
  runCounters(stage);
  if (!V.playing) return;
  // each scene gets a token so late callbacks from an earlier scene (speech end, timers) are ignored
  const token = ++V.token;
  const maybeNext = () => { if (token === V.token && V.spoke && V.elapsed && V.playing && alive()) next(); };
  V.timer = setTimeout(() => { if (token !== V.token) return; V.elapsed = true; maybeNext(); }, sc.dur);
  speak(sc.say ? tx(sc.say) : "", () => { if (token !== V.token) return; V.spoke = true; maybeNext(); });
}
function next() {
  if (!V.def) return;
  if (V.idx + 1 < V.def.scenes.length) return show(V.idx + 1);
  V.playing = false; paintCtrl();
  document.getElementById("vplayer")?.classList.add("ended");
  if (!V.done) { V.done = true; V.onDone?.(); }
}
function paintCtrl() {
  const b = document.getElementById("vplay");
  if (b) { b.innerHTML = vic(V.playing ? "pause" : "playTri"); b.setAttribute("aria-label", V.playing ? t("vd.pause") : t("vd.play")); }
  document.getElementById("vplayer")?.classList.toggle("paused", !V.playing);
}

/** Start the player that videoHTML() just put on the page. */
export function mountVideo(def: VideoDef, onDone: () => void, alreadyDone = false) {
  stopVideo();
  Object.assign(V, { def, idx: 0, playing: true, done: alreadyDone, onDone });
  paintCtrl();
  show(0);
}
export function stopVideo() {
  V.token++;
  clearTimeout(V.timer); clearTicks();
  V.playing = false;
  try { window.speechSynthesis?.cancel(); } catch { /* not supported */ }
}

reg({
  vToggle() {
    if (!V.def) return;
    if (V.playing) { V.playing = false; V.token++; clearTimeout(V.timer); try { speechSynthesis.cancel(); } catch { /* */ } paintCtrl(); return; }
    const p = document.getElementById("vplayer"), ended = !!p?.classList.contains("ended");
    p?.classList.remove("ended");
    V.playing = true; paintCtrl();
    show(ended ? 0 : V.idx);
  },
  vReplay() { if (!V.def) return; document.getElementById("vplayer")?.classList.remove("ended"); V.playing = true; paintCtrl(); show(0); },
  vJump(i: number) { if (!V.def) return; V.playing = true; paintCtrl(); show(i); },
  vVoice() {
    S.set.voice = !S.set.voice; save();
    const b = document.getElementById("vvoice");
    if (b) { b.innerHTML = vic(S.set.voice ? "speaker" : "mute"); b.setAttribute("aria-label", S.set.voice ? t("vd.voiceOn") : t("vd.voiceOff")); }
    if (!S.set.voice) try { speechSynthesis.cancel(); } catch { /* */ }
  },
});
