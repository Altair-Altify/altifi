/* ---------- Town screen UI: HUD, joystick, action button, dialogue (design doc 13.3) ----------
 * Opened from the Play tab after the dive from the home planet. The 5-tab nav is covered (full-screen overlay),
 * there is an exit button, the Alti Lion button moves to the top-right corner (.phone.ingame) so it never sits on
 * the action button. Joystick bottom-left (touch/mouse), WASD / arrow keys on a computer (Shift = run,
 * E / Space / Enter = action). No tap-to-walk (13.5-4). */
import { $, esc, shortVnd } from "../core/util";
import { S, save, PO, noMotion, lessonsDone } from "../core/state";
import { reg } from "../core/actions";
import { openO, closeO, fmtCount } from "./shell";
import { wxOverlay } from "./weather";
import { t, tx, lang } from "../i18n/i18n";
import { icon, IC } from "./icons";
import { runCounts } from "./fx";
import { DOMAINS } from "../content/domains";
import { Town } from "../game/town";
import { defaultLook, type Look, type Stage } from "../game/avatar";
import type { Door } from "../game/world";

/* ---- game state (design doc 13.4: net worth is what counts) ---- */
export interface TownSave { cash: number; history: number[]; stage: Stage; look: Look }
/** First visit: start with 2,000,000₫ of saved lucky money (decision logged in PROGRESS.md). */
export function ensureGame(): TownSave {
  const g = (S.game ||= { netWorth: 0 }) as any;
  if (typeof g.cash !== "number") g.cash = typeof g.netWorth === "number" && g.netWorth > 0 ? g.netWorth : 2_000_000;
  if (!Array.isArray(g.history)) g.history = [g.cash];
  if (!g.stage) g.stage = "student";
  if (!g.look || typeof g.look !== "object") g.look = defaultLook();
  g.netWorth = g.cash; // houses, cars and loans join the sum on 21/10 (13.4)
  save();
  return g as TownSave;
}

const nodeOf = (id?: string) => (id ? DOMAINS.flatMap((d) => d.nodes).find((n) => n.id === id) : undefined);

let town: Town | null = null, failed = false, nearDoor: Door | null = null;
const host = document.createElement("div");
host.className = "tw-gl";
const shown = () => host.isConnected && !!$("#overlay")?.classList.contains("townov") && !document.hidden;

function hud() {
  const g = ensureGame();
  return `<div class="tw-top">
      <button class="tw-btn" onclick="A.exitTown()" aria-label="${esc(t("tw.exit"))}">${icon("back", { size: 22 })}</button>
      <div class="tw-nw" title="${esc(t("top.netWorth"))}">${icon("wallet", { size: 20, color: IC.wallet })}<span class="tw-nwk">${t("top.netWorth")}</span><b data-ck="twnw" data-to="${g.cash}" data-fmt="vnd">${shortVnd(g.cash, lang())}</b></div>
    </div>`;
}
export function openTown() {
  ensureGame();
  openO(`<div class="tw" id="twRoot">
    <div class="tw-stage" id="twStage"></div>
    <div id="wxTown" class="town-wx">${wxOverlay()}</div>
    ${hud()}
    <div class="tw-joy" id="twJoy" aria-hidden="true"><div class="tw-ring"><div class="tw-knob" id="twKnob"></div></div></div>
    <button class="tw-act" id="twAct" hidden onclick="A.townAct()"></button>
    <div class="tw-talk" id="twTalk" hidden role="dialog" aria-live="polite"></div>
    <p class="tw-hint" id="twHint">${t(matchMedia("(pointer:fine)").matches ? "tw.hintKeys" : "tw.hintJoy")}</p>
  </div>`, { cls: "townov" });
  $(".phone")!.classList.add("ingame");
  const stage = $("#twStage")!;
  if (failed) { stage.innerHTML = `<div class="tw-nogl">${t("tw.noGL")}</div>`; return; }
  const g = ensureGame();
  if (!town) {
    try {
      town = new Town(host, { hidden: () => !shown(), near: onNear }, PO(), g.look, g.stage);
      host.appendChild(town.canvas);
      new ResizeObserver(() => town?.resize()).observe(host);
    } catch { failed = true; stage.innerHTML = `<div class="tw-nogl">${t("tw.noGL")}</div>`; return; }
  }
  stage.appendChild(host);
  town.motion = !noMotion();
  town.frozen = false;
  town.input.set(0, 0);
  nearDoor = null;
  town.resize();
  town.arrive();
  town.start();
  bindJoystick();
  setTimeout(() => $("#twHint")?.classList.add("off"), 4200);
}

/* ---- action button + dialogue ---- */
function onNear(d: Door | null) {
  nearDoor = d;
  const b = $("#twAct");
  if (!b) return;
  if (!d || town?.frozen) { b.hidden = true; return; }
  b.hidden = false;
  b.innerHTML = `${icon(d.b.ic, { size: 22, color: "#fff", tint: 0.3 })}<span>${esc(t("tw.enter", { place: tx(d.b.name) }))}</span>`;
}
let typeTimer: ReturnType<typeof setInterval> | undefined;
function say(name: string, text: string, buttons: [string, string][] = []) {
  const box = $("#twTalk");
  if (!box || !town) return;
  town.frozen = true; town.input.set(0, 0);
  $("#twAct")!.hidden = true;
  box.hidden = false;
  box.innerHTML = `<div class="tw-name">${esc(name)}</div><p id="twText"></p><div class="tw-tbtns">${buttons.map(([l, f]) => `<button class="btn good" onclick="${f}">${l}</button>`).join("")}<button class="btn ghost" onclick="A.townTalkClose()">${t("tw.ok")}</button></div>`;
  const p = $("#twText")!;
  clearInterval(typeTimer);
  if (noMotion()) { p.textContent = text; return; }
  let i = 0; // letters appear one by one (13.3 "Giao diện trong game")
  typeTimer = setInterval(() => { i += 2; p.textContent = text.slice(0, i); if (i >= text.length) clearInterval(typeTimer); }, 22);
}
function townTalkClose() {
  clearInterval(typeTimer);
  const box = $("#twTalk"); if (box) box.hidden = true;
  if (town) town.frozen = false;
  onNear(nearDoor);
}
function townAct() {
  const d = nearDoor;
  if (!d || !town || town.frozen) return;
  const b = d.b, n = nodeOf(b.lesson), place = tx(b.name);
  if (b.id === "home") { say(place, t("tw.home", { n: lessonsDone() })); return; }
  if (n) {
    const done = !!S.lessons[n.id];
    if (done) say(place, t("tw.open", { what: tx(n.unlock) }));
    else say(place, t("tw.locked", { what: tx(n.unlock), code: n.code, hook: tx(n.hook) }), n.lesson ? [[t("tw.learn"), `A.townLearn('${n.id}')`]] : []);
    return;
  }
  say(place, t("tw.soon"));
}
function townLearn(id: string) { leaveTown(); (window as any).A.startLesson(id); }

/* ---- joystick (touch / mouse) + keyboard ---- */
let joyBound = false;
const keys = new Set<string>();
function applyKeys() {
  if (!town) return;
  let x = 0, y = 0;
  if (keys.has("a") || keys.has("arrowleft")) x -= 1;
  if (keys.has("d") || keys.has("arrowright")) x += 1;
  if (keys.has("w") || keys.has("arrowup")) y -= 1;
  if (keys.has("s") || keys.has("arrowdown")) y += 1;
  const l = Math.hypot(x, y) || 1;
  town.input.set(x / l, y / l);
}
function bindJoystick() {
  const joy = $("#twJoy"), knob = $("#twKnob");
  if (!joy || !knob) return;
  let id = -1, cx = 0, cy = 0;
  const MAX = 42;
  const moveTo = (px: number, py: number) => {
    let dx = px - cx, dy = py - cy; const l = Math.hypot(dx, dy);
    if (l > MAX) { dx *= MAX / l; dy *= MAX / l; }
    knob.style.transform = `translate(${dx}px,${dy}px)`;
    town?.input.set(dx / MAX, dy / MAX);
  };
  joy.addEventListener("pointerdown", (e) => {
    if (id !== -1) return;
    id = e.pointerId; joy.setPointerCapture(id); joy.classList.add("on");
    const r = joy.querySelector(".tw-ring")!.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
    moveTo(e.clientX, e.clientY); $("#twHint")?.classList.add("off");
  });
  joy.addEventListener("pointermove", (e) => { if (e.pointerId === id) moveTo(e.clientX, e.clientY); });
  const end = (e: PointerEvent) => { if (e.pointerId !== id) return; id = -1; joy.classList.remove("on"); knob.style.transform = ""; town?.input.set(0, 0); };
  joy.addEventListener("pointerup", end); joy.addEventListener("pointercancel", end);
  if (joyBound) return;
  joyBound = true;
  window.addEventListener("keydown", (e) => {
    if (!shown() || (e.target as HTMLElement)?.closest?.("input,textarea,.chat")) return;
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) { keys.add(k); applyKeys(); e.preventDefault(); $("#twHint")?.classList.add("off"); }
    if (k === "shift" && town) town.run = true;
    if (k === "e" || k === " " || k === "enter") { if (town?.frozen) townTalkClose(); else townAct(); e.preventDefault(); }
    if (k === "escape") { if (town?.frozen) townTalkClose(); else exitTown(); }
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (keys.delete(k)) applyKeys();
    if (k === "shift" && town) town.run = false;
  });
  window.addEventListener("blur", () => { keys.clear(); town?.input.set(0, 0); });
}

function leaveTown() {
  town?.stop();
  clearInterval(typeTimer);
  keys.clear();
  $(".phone")!.classList.remove("ingame");
}
function exitTown() { leaveTown(); closeO(); }
/** Re-draw the HUD numbers (net worth changes). */
export function refreshTownHud() { const r = $("#twRoot"); if (r) runCounts(r, fmtCount); }

reg({ exitTown, townAct, townTalkClose, townLearn });
