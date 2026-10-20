/* ---------- Effects & buddy talk (ported from altifi-base.html) ---------- */
import { $, esc, rand } from "../core/util";
import { S, noMotion } from "../core/state";
import { lion } from "../mascot/lion";
import { reg } from "../core/actions";
import { t } from "../i18n/i18n";

/** Show a sub-screen / overlay with the same fade-through as a tab change (galaxy.css .pane.on):
 * wait 60ms, fade in over 210ms and grow 98% → 100% over 300ms. Opacity/transform only; off in Potato Mode / reduce motion. */
export function pageAnim(el?: HTMLElement | null) {
  if (noMotion()) return;
  el = el || document.querySelector<HTMLElement>(".pane.on");
  if (!el) return;
  el.classList.remove("ft-in");
  void el.offsetWidth;
  el.classList.add("ft-in");
  clearTimeout((el as any)._ft);
  (el as any)._ft = setTimeout(() => el!.classList.remove("ft-in"), 400);
}

/** Press animation, then run the action (buttons can't be double-fired). */
export function pushThen(btn: HTMLElement, fn: () => void) {
  if (btn.dataset.busy) return;
  btn.dataset.busy = "1";
  if (noMotion()) return fn();
  btn.classList.add("push");
  setTimeout(fn, 170);
}

export function confetti(host?: HTMLElement | null) {
  if (noMotion()) return;
  const o = host || $("#overlay")!, box = document.createElement("div");
  box.className = "confetti";
  const cols = ["#FFC93C", "#FF6FA5", "#5B5BD6", "#2BB673", "#8EC5FF", "#FF8A3D"];
  for (let i = 0; i < 42; i++) {
    const p = document.createElement("i"), w = (5 + Math.random() * 5) | 0;
    p.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;background:${cols[i % cols.length]};--dx:${(Math.random() * 140 - 70) | 0}px;--r:${(Math.random() * 720 - 360) | 0}deg;animation-delay:${(Math.random() * 0.25).toFixed(2)}s;animation-duration:${(1.1 + Math.random() * 0.8).toFixed(2)}s;width:${w}px;height:${w + 4}px;border-radius:${Math.random() < 0.4 ? "50%" : "2px"}`;
    box.appendChild(p);
  }
  o.appendChild(box);
  setTimeout(() => box.remove(), 2400);
}

export function minitoast(msg: string) {
  const host = $(".phone")!;
  const tEl = document.createElement("div");
  tEl.className = "minitoast";
  tEl.textContent = msg;
  host.appendChild(tEl);
  setTimeout(() => tEl.remove(), 1900);
}

/** Bottom sheet (base demo's "Leave without saving?" style). Buttons: [label, onclick-js, cls]. */
export function sheet(html: string, buttons: Array<[string, string, string?]>, host = "#pmodal") {
  const el = $(host);
  if (!el) return;
  el.innerHTML = `<div class="modalbg" onclick="if(event.target===this)A.closeSheet('${host}')"><div class="sheet">${html}${buttons.map(([l, f, c]) => `<button class="btn ${c || ""}" onclick="${f}">${l}</button>`).join("")}</div></div>`;
}
export function closeSheet(host = "#pmodal") {
  const el = $(host);
  if (el) el.innerHTML = "";
}

/* ---------- Buddy talk: typing dots → a line → pause → next line ---------- */
const split = (k: string) => t(k).split("|");
export const LINES = {
  home: () => split("home.talk").map((s) => s.replace("{name}", S.m.name)),
  lesson: () => split("lesson.talk"),
};
export const REACT = { ok: () => split("react.ok"), sad: () => split("react.sad"), laugh: () => split("react.laugh") };

const talk: { id: string | null; list: (() => string[]) | null; text: string; typing: boolean; timer: any } = { id: null, list: null, text: "", typing: false, timer: null };
const alive = () => talk.id && document.getElementById(talk.id);
export const talkId = () => talk.id;
export function paintTalk(anim: boolean) {
  const el = alive();
  if (!el) return;
  el.innerHTML = talk.typing ? '<span class="typing"><i></i><i></i><i></i></span>' : esc(talk.text);
  if (anim) { el.classList.remove("say"); void el.offsetWidth; el.classList.add("say"); }
}
export function startTalk(id: string, list: () => string[], first?: string) {
  clearTimeout(talk.timer);
  Object.assign(talk, { id, list, text: "", typing: true });
  paintTalk(true);
  talk.timer = setTimeout(() => say(first || rand(list())), 700);
}
function say(s: string) {
  if (!alive()) return stopTalk();
  talk.text = s; talk.typing = false; paintTalk(true);
  talk.timer = setTimeout(talkStep, 3800);
}
function talkStep() {
  if (!alive()) return stopTalk();
  talk.typing = true; paintTalk(true);
  talk.timer = setTimeout(() => {
    if (!alive()) return stopTalk();
    const l = talk.list!();
    let s: string;
    do { s = rand(l); } while (s === talk.text && l.length > 1);
    say(s);
  }, 900);
}
export function stopTalk() { clearTimeout(talk.timer); talk.id = null; }
export function react(s: string, ms = 2600) {
  if (!alive()) return;
  clearTimeout(talk.timer);
  talk.text = s; talk.typing = false; paintTalk(true);
  talk.timer = setTimeout(talkStep, ms);
}

/* ---------- Buddy emotions on the in-lesson lion (#bud) ---------- */
export const bud = { mood: "happy", t: null as any };
export function paintBud(anim: boolean) {
  const el = $("#bud");
  if (!el) return;
  el.innerHTML = lion(+(el.dataset.size || 60), bud.mood);
  el.classList.remove("m-sad", "m-laugh", "m-cheer");
  if (anim && bud.mood !== "happy") { void el.offsetWidth; el.classList.add("m-" + bud.mood); }
}
export function emote(m: string, ms: number) {
  bud.mood = m; paintBud(true);
  clearTimeout(bud.t);
  bud.t = setTimeout(() => { bud.mood = "happy"; paintBud(false); }, ms);
}

reg({ closeSheet, pushThen: (btn: HTMLElement, name: string, ...args: any[]) => pushThen(btn, () => (window.A as any)[name](...args)) });

/* ---------- Numbers that count up/down (XP, streak, net worth) — design doc 10c.4 ----------
 * Markup: <b data-ck="xp" data-to="120" data-fmt="num|vnd">120</b>. The last value shown for each key is
 * remembered, so after a re-render the number rolls from the old value to the new one. */
const lastShown: Record<string, number> = {};
export function countAttrs(key: string, to: number, fmt: "num" | "vnd" = "num", format: (n: number) => string = String) {
  const from = lastShown[key] ?? to;
  return `data-ck="${key}" data-to="${to}" data-fmt="${fmt}">${format(from)}`;
}
export function runCounts(root: ParentNode = document, format: (n: number, fmt: string) => string = (n) => String(n)) {
  root.querySelectorAll<HTMLElement>("[data-ck]").forEach((el) => {
    const key = el.dataset.ck!, to = +el.dataset.to!, fmt = el.dataset.fmt || "num";
    const from = lastShown[key] ?? to;
    lastShown[key] = to;
    if (from === to || noMotion()) { el.textContent = format(to, fmt); return; }
    const t0 = performance.now(), ms = 700;
    el.classList.add("counting");
    const step = (now: number) => {
      if (!el.isConnected) return;
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = format(Math.round(from + (to - from) * e), fmt);
      if (k < 1) requestAnimationFrame(step); else el.classList.remove("counting");
    };
    requestAnimationFrame(step);
  });
}
