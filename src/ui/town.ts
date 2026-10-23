/* ---------- Town screen UI: HUD, joystick, action button, dialogue, minimap, wardrobe (design doc 13.3) ----------
 * Opened from the Play tab after the dive from the home planet. The 5-tab nav is covered (full-screen overlay),
 * there is an exit button, the Alti Lion button moves to the top-right corner (.phone.ingame) so it never sits on
 * the action button. Joystick bottom-left (touch/mouse), WASD / arrow keys on a computer (Shift = run,
 * E / Space / Enter = action, M = map). No tap-to-walk (13.5-4).
 * Top-left HUD = one row (back · net worth, or in "My Life" one card: month · mood · net worth · next step, tap =
 * the in-game phone) + the minimap under the back button. */
import { $, esc, shortVnd } from "../core/util";
import { S, save, PO, noMotion, lessonsDone } from "../core/state";
import { reg } from "../core/actions";
import { openO, closeO, fmtCount } from "./shell";
import { wxOverlay } from "./weather";
import { t, tx, lang } from "../i18n/i18n";
import { icon, IC } from "./icons";
import { runCounts } from "./fx";
import { setCtx } from "../assistant/context";
import { DOMAINS } from "../content/domains";
import { Town, type Target } from "../game/town";
import { defaultLook, SKINS, HAIRS, TOPS, BOTTOMS, type Look, type Stage } from "../game/avatar";
import type { Zone, ZoneId, World, BuildingSpec } from "../game/world";
import { netWorth, type Life } from "../game/life";

/* ---- game state (design doc 13.4: net worth is what counts) ---- */
export interface TownSave { cash: number; history: number[]; stage: Stage; look: Look; life?: Life; netWorth: number }
/** First visit: start with 2,000,000₫ of saved lucky money (decision logged in PROGRESS.md). */
export function ensureGame(): TownSave {
  const g = (S.game ||= { netWorth: 0 }) as any;
  if (typeof g.cash !== "number") g.cash = typeof g.netWorth === "number" && g.netWorth > 0 ? g.netWorth : 2_000_000;
  if (!Array.isArray(g.history)) g.history = [g.cash];
  if (!g.stage) g.stage = "student";
  if (!g.look || typeof g.look !== "object") g.look = defaultLook();
  g.netWorth = g.life ? netWorth(g.life) : g.cash; // the Personal mode adds savings, what you own and what you owe (13.4)
  save();
  return g as TownSave;
}

const nodeOf = (id?: string) => (id ? DOMAINS.flatMap((d) => d.nodes).find((n) => n.id === id) : undefined);
/** When the playable part of each district arrives (design doc 13.6). */
const ZONE_DAY: Record<ZoneId, string> = { personal: "21/10", corporate: "22/10", macro: "22/10", museum: "23/10", markets: "24–26/10", public: "24–26/10", intl: "24–26/10" };

let town: Town | null = null, failed = false, near: Target | null = null;
/** The Personal mode (src/ui/life.ts) plugs in here: it handles doors while a life is running and adds HUD bits. */
export const townHooks: { doors: ((b: BuildingSpec) => boolean)[]; hud?: () => void; arrive: (() => void)[]; leave: (() => void)[] } = { doors: [], arrive: [], leave: [] };
export const getTown = () => town;
const host = document.createElement("div");
host.className = "tw-gl";
const shown = () => host.isConnected && !!$("#overlay")?.classList.contains("townov") && !document.hidden;

function hud() {
  const g = ensureGame();
  return `<div class="tw-top">
      <button class="tw-btn" onclick="A.exitTown()" aria-label="${esc(t("tw.exit"))}">${icon("back", { size: 22 })}</button>
      <div class="tw-nw" title="${esc(t("top.netWorth"))}">${icon("wallet", { size: 20, color: IC.wallet })}<span class="tw-nwk">${t("top.netWorth")}</span><b data-ck="twnw" data-to="${g.netWorth}" data-fmt="vnd">${shortVnd(g.netWorth, lang())}</b></div>
      <button class="tw-life" id="twLife" hidden onclick="A.lifePhone()"></button>
    </div>
    <button class="tw-map" id="twMap" onclick="A.townMap()" aria-label="${esc(t("tw.map"))}"><canvas width="184" height="144"></canvas></button>
    <div class="tw-zone" id="twZone" aria-live="polite"></div>`;
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
    <div class="tw-sheet" id="twSheet" hidden role="dialog"></div>
    <div class="tw-big" id="twBig" hidden role="dialog" onclick="A.townMap()"></div>
    <p class="tw-hint" id="twHint">${t(matchMedia("(pointer:fine)").matches ? "tw.hintKeys" : "tw.hintJoy")}</p>
  </div>`, { cls: "townov" });
  $(".phone")!.classList.add("ingame");
  setCtx({ key: "town", where: t("tw.where"), title: t("pl.homeT"), answered: true, kb: ["budget", "compound", "fixedfloat", "breakeven", "stocks"] });
  const stage = $("#twStage")!;
  if (failed) { stage.innerHTML = `<div class="tw-nogl">${t("tw.noGL")}</div>`; return; }
  const g = ensureGame();
  if (!town) {
    try {
      town = new Town(host, { hidden: () => !shown(), near: onNear, zone: onZone, frame: onFrame }, PO(), g.look, g.stage);
      host.appendChild(town.canvas);
      if (import.meta.env.DEV) (window as any).__town = town; // tests / screenshots
      new ResizeObserver(() => town?.resize()).observe(host);
    } catch { failed = true; stage.innerHTML = `<div class="tw-nogl">${t("tw.noGL")}</div>`; return; }
  }
  stage.appendChild(host);
  town.motion = !noMotion();
  town.frozen = false;
  town.input.set(0, 0);
  near = null; mapStatic = null; lastZone = "";
  town.setLang(lang());
  lastNW = g.netWorth;
  town.resize();
  town.arrive();
  town.start();
  bindJoystick();
  setTimeout(() => $("#twHint")?.classList.add("off"), 4200);
  townHooks.hud?.();
  townHooks.arrive.forEach((f) => f());
}

/* ---- district banner (shown when you walk into another district) ---- */
let lastZone = "", zoneTimer: ReturnType<typeof setTimeout> | undefined;
function onZone(z: Zone | null) {
  const el = $("#twZone");
  if (!el || !z || z.id === lastZone) return;
  lastZone = z.id;
  el.innerHTML = `<i style="background:${z.color}"></i>${esc(tx(z.name))}`;
  el.classList.add("on");
  clearTimeout(zoneTimer);
  zoneTimer = setTimeout(() => el.classList.remove("on"), 2400);
  setCtx({ key: "town", where: t("tw.where"), title: tx(z.name), answered: true, kb: ZONE_KB[z.id] });
}
const ZONE_KB: Record<ZoneId, string[]> = {
  personal: ["budget", "leaks", "compound", "emergency", "score"], corporate: ["breakeven", "profit", "debt"], markets: ["stocks", "bond", "fx"],
  macro: ["inflation", "realrate", "fixedfloat"], public: ["debt", "bond"], intl: ["fx"], museum: ["crisis1929", "crisis1973", "crisis2008"],
};

/* ---- action button + dialogue ---- */
function onNear(tg: Target | null) {
  near = tg;
  const b = $("#twAct");
  if (!b) return;
  if (!tg || town?.frozen) { b.hidden = true; return; }
  b.hidden = false;
  if (tg.kind === "door") b.innerHTML = `${icon(tg.door.b.ic, { size: 22, color: "#fff", tint: 0.3 })}<span>${esc(tg.door.b.lot ? t("tw.look", { place: tx(tg.door.b.name) }) : t("tw.enter", { place: tx(tg.door.b.name) }))}</span>`;
  else b.innerHTML = `${icon("chat", { size: 22, color: "#fff", tint: 0.3 })}<span>${esc(t("tw.talk", { name: tg.npc.p.name }))}</span>`;
}
let typeTimer: ReturnType<typeof setInterval> | undefined, talkingTo: Target | null = null;
export function say(name: string, text: string, buttons: [string, string][] = [], color = "#F5A524") {
  const box = $("#twTalk");
  if (!box || !town) return;
  town.frozen = true; town.input.set(0, 0); town.lift = 0;
  $("#twAct")!.hidden = true;
  const sh = $("#twSheet"); if (sh) sh.hidden = true; // a dialogue always replaces an open sheet
  box.hidden = false;
  box.innerHTML = `<div class="tw-name" style="background:${color}">${esc(name)}</div><p id="twText"></p><div class="tw-tbtns">${buttons.map(([l, f]) => `<button class="btn good" onclick="${f}">${l}</button>`).join("")}<button class="btn ghost" onclick="A.townTalkClose()">${t("tw.ok")}</button></div>`;
  const p = $("#twText")!;
  clearInterval(typeTimer);
  if (noMotion()) { p.textContent = text; return; }
  let i = 0; // letters appear one by one (13.3 "Giao diện trong game")
  typeTimer = setInterval(() => { i += 2; p.textContent = text.slice(0, i); if (i >= text.length) clearInterval(typeTimer); }, 22);
}
export function townTalkClose() {
  clearInterval(typeTimer);
  const box = $("#twTalk"); if (box) box.hidden = true;
  if (talkingTo?.kind === "npc") talkingTo.npc.talking = false;
  talkingTo = null;
  if (town) town.frozen = false;
  onNear(near);
}
function townAct() {
  const tg = near;
  if (!tg || !town || town.frozen) return;
  talkingTo = tg;
  if (tg.kind === "npc") { tg.npc.talking = true; say(`${tg.npc.p.name} · ${tx(tg.npc.p.style)}`, tx(tg.npc.p.line), [], "#B39DFF"); return; }
  const b = tg.door.b, n = nodeOf(b.lesson), place = tx(b.name), zc = town.map.zones.find((z) => z.id === b.zone)?.color;
  if (townHooks.doors.some((h) => h(b))) return;
  if (b.id === "home") { say(place, t("tw.home", { n: lessonsDone() }), [[t("tw.wardrobe"), "A.townWardrobe()"]], zc); return; }
  if (b.id === "museum") { say(place, t("tw.museum"), [], zc); return; }
  if (n) {
    const done = !!S.lessons[n.id];
    if (done) say(place, t("tw.open", { what: tx(n.unlock), day: ZONE_DAY[b.zone] }), [], zc);
    else if (n.lesson) say(place, t("tw.locked", { what: tx(n.unlock), code: n.code, hook: tx(n.hook) }), [[t("tw.learn"), `A.townLearn('${n.id}')`]], zc);
    else say(place, t("tw.lockedSoon", { what: tx(n.unlock), code: n.code, hook: tx(n.hook), day: n.day }), [], zc);
    return;
  }
  say(place, t("tw.soon"), [], zc);
}
export function townLearn(id: string) { leaveTown(); (window as any).A.startLesson(id); }

/* ---- bottom sheet used by the wardrobe and the Personal mode ---- */
export function townSheet(html: string, lift = true) {
  townTalkClose();
  const sh = $("#twSheet"); if (!sh || !town) return;
  town.frozen = true; town.input.set(0, 0); $("#twAct")!.hidden = true; if (lift) town.lift = 1;
  sh.innerHTML = html; sh.hidden = false; sh.scrollTop = 0;
}
export function townSheetClose() { const sh = $("#twSheet"); if (sh) sh.hidden = true; if (town) { town.frozen = false; town.lift = 0; town.focusOn(null); } $("#twRoot")?.classList.remove("museum-in"); onNear(near); townHooks.hud?.(); }

/* ---- wardrobe at home: skin, hair colour & style, top, trousers (the outfit style follows your career stage) ---- */
export function townWardrobe() {
  townTalkClose();
  const sh = $("#twSheet"); if (!sh || !town) return;
  town.frozen = true; town.input.set(0, 0); $("#twAct")!.hidden = true; town.lift = 1; town.heading = 0; // camera raises you above the sheet, you face the camera
  const g = ensureGame(), L = g.look;
  const row = (label: string, key: keyof Look, vals: string[]) => `<div class="tw-row"><span>${label}</span><div>${vals.map((v) => `<button class="tw-sw${L[key] === v ? " on" : ""}" style="background:${v}" onclick="A.townLook('${key}','${v}')" aria-label="${label} ${v}"></button>`).join("")}</div></div>`;
  const styles = [t("tw.hair0"), t("tw.hair1"), t("tw.hair2")];
  sh.innerHTML = `<h3>${t("tw.wardrobe")}</h3>
    ${row(t("tw.skin"), "skin", SKINS)}${row(t("tw.hairC"), "hair", HAIRS)}
    <div class="tw-row"><span>${t("tw.hairS")}</span><div>${styles.map((s, i) => `<button class="tw-chip${L.style === i ? " on" : ""}" onclick="A.townLook('style',${i})">${s}</button>`).join("")}</div></div>
    ${row(t("tw.top"), "top", TOPS)}${row(t("tw.bottom"), "bottom", BOTTOMS)}
    <p class="tw-note">${t("tw.stageNote", { stage: t("tw.st." + g.stage) })}</p>
    <button class="btn good" onclick="A.townWardrobeClose()">${t("tw.done")}</button>`;
  sh.hidden = false;
}
function townLook(key: keyof Look, v: string | number) {
  const g = ensureGame();
  (g.look as any)[key] = key === "style" ? +v : v;
  save();
  town?.setLook(g.look, g.stage);
  townWardrobe();
}
const townWardrobeClose = townSheetClose;

/* ---- minimap (top-left) + full map (tap it or press M) ---- */
let mapStatic: HTMLCanvasElement | null = null, mapT = 0;
const MAPX: [number, number] = [-50, 50], MAPZ: [number, number] = [-46, 32];
function drawMapStatic(w: World, W: number, H: number) {
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d")!, sx = W / (MAPX[1] - MAPX[0]), sz = H / (MAPZ[1] - MAPZ[0]);
  const X = (v: number) => (v - MAPX[0]) * sx, Z = (v: number) => (v - MAPZ[0]) * sz;
  x.fillStyle = "#A9DB82"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#F3E2B3"; x.fillRect(0, 0, W, Z(w.seaZ + 4));
  x.fillStyle = "#7CCDF0"; x.fillRect(0, 0, W, Z(w.seaZ));
  x.lineCap = "round"; x.strokeStyle = "#F4E6C3";
  for (const [x0, z0, x1, z1, rw] of w.roads) { x.lineWidth = Math.max(1.5, rw * sx); x.beginPath(); x.moveTo(X(x0), Z(z0)); x.lineTo(X(x1), Z(z1)); x.stroke(); }
  for (const b of w.buildings) {
    const zc = w.zones.find((z) => z.id === b.zone)!.color;
    x.fillStyle = b.lot ? "#D9B98C" : zc; x.globalAlpha = b.lot ? 0.8 : 1;
    const bx = X(b.x - b.w / 2), bz = Z(b.z! - b.d / 2), bw = b.w * sx, bd = b.d * sz;
    x.beginPath(); (x as any).roundRect ? (x as any).roundRect(bx, bz, bw, bd, Math.min(3, bw / 3)) : x.rect(bx, bz, bw, bd); x.fill();
  }
  x.globalAlpha = 1;
  x.fillStyle = "#E9E1D2"; x.beginPath(); x.arc(X(0), Z(4), 6 * sx, 0, 7); x.fill();
  x.fillStyle = "#7CCDF0"; x.beginPath(); x.arc(X(0), Z(4), 2.4 * sx, 0, 7); x.fill();
  return c;
}
function drawMap(cv: HTMLCanvasElement, big = false) {
  if (!town) return;
  const w = town.map, W = cv.width, H = cv.height, x = cv.getContext("2d")!;
  if (big || !mapStatic) { const st = drawMapStatic(w, W, H); if (!big) mapStatic = st; x.drawImage(st, 0, 0); } else x.drawImage(mapStatic, 0, 0);
  const sx = W / (MAPX[1] - MAPX[0]), sz = H / (MAPZ[1] - MAPZ[0]);
  for (const n of town.npcs) { x.fillStyle = "#B39DFF"; x.beginPath(); x.arc((n.pos.x - MAPX[0]) * sx, (n.pos.y - MAPZ[0]) * sz, big ? 5 : 3.5, 0, 7); x.fill(); }
  const px = (town.pos.x - MAPX[0]) * sx, pz = (town.pos.y - MAPZ[0]) * sz, r = big ? 11 : 8, a = town.heading;
  x.save(); x.translate(px, pz); x.rotate(-a + Math.PI);
  x.fillStyle = "#FFFFFF"; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill();
  x.fillStyle = "#E5484D"; x.beginPath(); x.moveTo(0, -r * 0.75); x.lineTo(r * 0.55, r * 0.5); x.lineTo(0, r * 0.2); x.lineTo(-r * 0.55, r * 0.5); x.closePath(); x.fill();
  x.restore();
}
function onFrame() {
  const now = performance.now();
  if (now - mapT < 140) return; // ~7 fps is plenty for a minimap
  mapT = now;
  const cv = $("#twMap canvas") as HTMLCanvasElement | null;
  if (cv) drawMap(cv);
}
function townMap() {
  const big = $("#twBig"); if (!big || !town) return;
  if (!big.hidden) { big.hidden = true; town.frozen = false; onNear(near); return; }
  townTalkClose();
  town.frozen = true; town.input.set(0, 0); $("#twAct")!.hidden = true;
  const W = 680, H = Math.round((W * (MAPZ[1] - MAPZ[0])) / (MAPX[1] - MAPX[0]));
  big.innerHTML = `<div class="tw-bigin"><h3>${t("tw.map")}</h3><div class="tw-bigmap"><canvas width="${W}" height="${H}"></canvas>${town.map.zones.map((z) => `<span class="tw-zl" style="left:${Math.min(84, Math.max(16, (((z.x0 + z.x1) / 2 - MAPX[0]) / (MAPX[1] - MAPX[0])) * 100))}%;top:${(((z.z0 + z.z1) / 2 - MAPZ[0]) / (MAPZ[1] - MAPZ[0])) * 100}%"><i style="background:${z.color}"></i>${esc(tx(z.name))}</span>`).join("")}</div><p class="tw-note">${t("tw.mapClose")}</p></div>`;
  big.hidden = false;
  drawMap(big.querySelector("canvas")!, true);
}

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
    if (!shown() || (e.target as HTMLElement)?.closest?.("input,textarea,.chat,.aspanel")) return;
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) { keys.add(k); applyKeys(); e.preventDefault(); $("#twHint")?.classList.add("off"); }
    if (k === "shift" && town) town.run = true;
    const sheet = !$("#twSheet")?.hidden, big = !$("#twBig")?.hidden, talk = !$("#twTalk")?.hidden;
    if (k === "m") townMap();
    if (k === "e" || k === " " || k === "enter") { e.preventDefault(); if (big) townMap(); else if (sheet) townWardrobeClose(); else if (talk) townTalkClose(); else townAct(); }
    if (k === "escape") { if (big) townMap(); else if (sheet) townWardrobeClose(); else if (talk) townTalkClose(); else exitTown(); }
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (keys.delete(k)) applyKeys();
    if (k === "shift" && town) town.run = false;
  });
  window.addEventListener("blur", () => { keys.clear(); town?.input.set(0, 0); });
}

function leaveTown() {
  townHooks.leave.forEach((f) => f());
  town?.stop();
  clearInterval(typeTimer);
  keys.clear();
  if (talkingTo?.kind === "npc") talkingTo.npc.talking = false;
  talkingTo = null;
  $(".phone")!.classList.remove("ingame");
}
function exitTown() { leaveTown(); closeO(); }
/** Re-draw the HUD numbers (net worth changes). */
let lastNW: number | null = null;
export function refreshTownHud() {
  const b = document.querySelector<HTMLElement>(".tw-nw b");
  if (b && S.game) { b.dataset.to = String(S.game.netWorth); runCounts($("#twRoot")!, fmtCount); }
  townHooks.hud?.();
  const nw = S.game?.netWorth;
  if (typeof nw === "number") { if (lastNW !== null && Math.abs(nw - lastNW) >= 1000) nwFx(lastNW, nw); lastNW = nw; }
}
/** Net worth went up or down: the HUD card pulses green / red, the number rolls to the new value and a "+1.2M₫"
 * chip floats up from it (gains also throw a few coins). Reduced motion: the chip just appears and fades. */
function nwFx(from: number, to: number) {
  const root = $("#twRoot"), life = $("#twLife");
  const card = life && !life.hidden ? life : $(".tw-nw"), num = life && !life.hidden ? life.querySelector<HTMLElement>(".lf-nw") : $(".tw-nw b");
  if (!root || !card || !num) return;
  const up = to > from, d = Math.abs(to - from), r0 = root.getBoundingClientRect(), r = num.getBoundingClientRect();
  card.classList.remove("nw-up", "nw-down"); void card.offsetWidth; card.classList.add(up ? "nw-up" : "nw-down");
  setTimeout(() => card.classList.remove("nw-up", "nw-down"), 900);
  const chip = document.createElement("div");
  chip.className = "tw-delta " + (up ? "up" : "down");
  chip.innerHTML = `${up ? "▲ +" : "▼ −"}${esc(shortVnd(d, lang()))}${up ? '<i></i><i></i><i></i><i></i>' : ""}`;
  chip.style.left = `${r.left - r0.left + r.width / 2}px`; chip.style.top = `${r.bottom - r0.top + 4}px`;
  root.appendChild(chip);
  setTimeout(() => chip.remove(), 2200);
  if (noMotion() || life?.hidden !== false) return;
  const tn = [...num.childNodes].reverse().find((n) => n.nodeType === 3); // roll the number in the life card
  if (!tn) return;
  const t0 = performance.now();
  const step = (now: number) => { const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 3); tn.textContent = shortVnd(from + (to - from) * e, lang()); if (k < 1 && tn.isConnected) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

reg({ exitTown, townAct, townTalkClose, townLearn, townWardrobe, townLook, townWardrobeClose, townMap });
