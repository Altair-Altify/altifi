/* ---------- Learn tab = the Altair galaxy (design doc 13.1, replaces the winding road of 10c.3) ----------
 * The 3D scene lives in src/galaxy; this file is the HTML layer on top of it: labels that follow systems and planets,
 * the slim HUD (breadcrumb, today's goal, List button), zoom buttons + "Back to Altair", the planet card at level 3
 * with the "Land" button (Alti Lion's rocket → lesson), the floating Continue card, reward comets, and the
 * accessible List view (also the fallback when WebGL is missing).
 * No forced order (3.2): every written lesson can be opened; the beacon only marks a suggestion. */
import { esc } from "../core/util";
import { S, PO, defaultM, save, addXP, noMotion, lessonsDone } from "../core/state";
import { reg, A } from "../core/actions";
import { t, tx } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { DOMAINS, NODES, isReal, findLesson, findNode, domainOf, ALL_LESSONS, type Domain } from "../content/domains";
import { checkBadges, domainDone } from "../content/badges";
import { sheet, closeSheet, minitoast, confetti } from "./fx";
import { setCtx } from "../assistant/context";
import { reviewCard } from "../lesson/player";
import { icon, IC } from "./icons";
import { Galaxy, type GxModel, type Level } from "../galaxy/scene";
import type { PState } from "../galaxy/planet";
import type { CourseNode, DomainId, Lesson } from "../lesson/types";

export function homeFirst(isStatic: boolean) {
  if (JSON.stringify(S.m) === JSON.stringify(defaultM())) return t("home.firstDefault", { name: S.m.name });
  const pep = t("home.pep").split("|");
  return isStatic ? pep[Object.keys(S.lessons).length % pep.length] : t("home.first", { name: S.m.name });
}

const suggested = () => ALL_LESSONS.find((l) => !S.lessons[l.id]);
const night = () => document.body.classList.contains("night");

export function nodeState(n: CourseNode): PState {
  if (!isReal(n)) return "soon";
  const rec = S.lessons[n.id];
  if (rec?.deep) return "deep";
  if (rec) return "done";
  if (S.inprog?.id === n.id) return "progress";
  if (suggested()?.id === n.id) return "suggested";
  return "new";
}
const explored = (d: Domain) => Math.round((d.nodes.filter((n) => S.lessons[n.id]).length / d.nodes.length) * 100);
const cometsWaiting = () => Math.floor(lessonsDone() / 2) - S.chests.filter((c) => c.startsWith("comet-")).length;
const suggestedDomain = (): DomainId => (suggested()?.domain as DomainId) || "macro";

/* ---------- small pieces ---------- */
function ring(val: number, goal: number, size = 72) {
  const r = size * 0.375, C = 2 * Math.PI * r, k = Math.min(1, val / goal), sw = size / 9, c = size / 2;
  return `<svg class="goalring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${val}/${goal} XP">
    <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--track)" stroke-width="${sw}"/>
    <circle class="gr-arc" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${k >= 1 ? "var(--good)" : "var(--sun)"}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" style="--off:${(C * (1 - k)).toFixed(1)};--c:${C.toFixed(1)}" transform="rotate(-90 ${c} ${c})"/></svg>`;
}
const stLabel = (st: PState) => t("gx.st." + st);
function stars(id: string, size = 13) {
  const rec = S.lessons[id];
  return rec ? `<span class="gx-stars" aria-hidden="true">${[0, 1, 2].map((k) => icon("star", { size, color: k < rec.stars ? IC.star : "var(--lockd)", tint: k < rec.stars ? 1 : 0.3 })).join("")}</span>` : "";
}

/** "Continue" card: lesson left half-way → resume; new user → placement test; otherwise the suggested next planet. */
function continueCard(galaxy: boolean) {
  const ip = S.inprog && findLesson(S.inprog.id);
  if (ip && S.inprog) {
    const pct = Math.round((S.inprog.s / Math.max(1, S.inprog.n)) * 100);
    return contCard(ip, t("hm.continue"), pct, `${t("hm.step", { n: S.inprog.s + 1, m: S.inprog.n })}${S.inprog.deep ? " · " + t("lp.deepTag") : ""}`, `A.startLesson('${ip.id}',${S.inprog.deep},${S.inprog.s})`);
  }
  const sug = suggested();
  if (!Object.keys(S.lessons).length && !S.placement) {
    return `<div class="contcard place"><div class="cc-ic">${icon("target", { size: 30, color: "#fff", tint: 0.35 })}</div><div class="cc-body"><div class="cc-kicker">${t("hm.placeT")}</div><div class="cc-sub">${t("hm.placeS")}</div></div>
      <button class="btn sun" onclick="A.pushThen(this,'startLesson','placement')">${t("hm.placeBtn")}</button>${sug ? `<button class="linkbtn" onclick="${galaxy ? `A.gxPlanet('${sug.id}')` : `A.openLessonCard('${sug.id}')`}">${t("hm.skip")}</button>` : ""}</div>`;
  }
  if (!sug) return `<div class="contcard"><div class="cc-body"><div class="cc-sub">${t("hm.allDone")}</div></div></div>`;
  const d = domainOf(sug.domain as DomainId), real = d.nodes.filter(isReal), pct = Math.round((real.filter((n) => S.lessons[n.id]).length / real.length) * 100);
  return contCard(sug, t("hm.next"), pct, tx(d.title), galaxy ? `A.gxPlanet('${sug.id}')` : `A.openLessonCard('${sug.id}')`);
}
function contCard(l: Lesson, kicker: string, pct: number, sub: string, go: string) {
  const d = domainOf(l.domain as DomainId), n = findNode(l.id);
  return `<div class="contcard" style="--dc:${d.color}"><div class="cc-row"><div class="cc-ic" style="background:${d.color}">${icon(n?.ic || l.ic, { size: 30, color: "#fff", tint: 0.35 })}</div>
    <div class="cc-body"><div class="cc-kicker">${kicker}</div><div class="cc-title">${esc(n ? tx(n.hook) : tx(l.title))}</div><div class="cc-sub">${esc(sub)}</div></div></div>
    <div class="cc-prog"><i style="width:${pct}%;background:${d.color}"></i></div><div class="cc-pct">${pct}%</div>
    <button class="btn good" onclick="${go}">${icon("playTri", { size: 18, color: "#fff", tint: 1 })} ${t("hm.cont")}</button></div>`;
}

/** Galaxy version of the Continue card (13.1b-5): one low row at the bottom; swipe down / "Skip" tucks it into a pill. */
function miniCard() {
  const ip = S.inprog && findLesson(S.inprog.id);
  const row = (color: string, ic: string, kicker: string, title: string, go: string, goLabel: string, pct: number | null, extra = "") => `<div class="gxc" style="--dc:${color}">
    <div class="gxc-ic" style="background:${color}">${icon(ic, { size: 22, color: "#fff", tint: 0.35 })}</div>
    <div class="gxc-body"><div class="gxc-k">${kicker}${extra}</div><div class="gxc-t">${esc(title)}</div>${pct === null ? "" : `<div class="gxc-prog"><i style="width:${pct}%"></i></div>`}</div>
    <button class="gxc-go" onclick="${go}" aria-label="${esc(goLabel)}">${icon("playTri", { size: 18, color: "#fff", tint: 1 })}</button></div>`;
  if (ip && S.inprog) {
    const n = findNode(ip.id)!, d = domainOf(n.domain);
    return row(d.color, n.ic, `${t("hm.continue")} · ${t("hm.step", { n: S.inprog.s + 1, m: S.inprog.n })}`, tx(n.hook), `A.startLesson('${ip.id}',${S.inprog.deep},${S.inprog.s})`, t("hm.cont"), Math.round((S.inprog.s / Math.max(1, S.inprog.n)) * 100));
  }
  if (!Object.keys(S.lessons).length && !S.placement)
    return row("#5B5BD6", "target", "8 × ? · 3′", t("hm.placeT"), "A.pushThen(this,'startLesson','placement')", t("hm.placeBtn"), null, ` · <button class="gxc-skip" onclick="A.gxCont(true)">${t("gx.skip")}</button>`).replace('class="gxc"', 'class="gxc place"').replace("8 × ? · 3′", t("gx.placeMeta"));
  const sug = suggested();
  if (!sug) return `<div class="gxc"><div class="gxc-body"><div class="gxc-t">${t("hm.allDone")}</div></div></div>`;
  const n = findNode(sug.id)!, d = domainOf(n.domain);
  return row(d.color, n.ic, `${t("hm.next")} · ${n.code}`, tx(n.hook), `A.gxPlanet('${sug.id}')`, t("hm.cont"), null);
}
const pillText = () => (S.inprog ? t("hm.continue") : !Object.keys(S.lessons).length && !S.placement ? t("hm.placeT") : t("hm.next"));

/* ============================== the galaxy ============================== */
let G: Galaxy | null = null;
let glFailed = false;
const rootSize = { w: 0, h: 0 }; // kept by a ResizeObserver so label placement never reads layout per frame
const ui = { first: true, deep: false, labels: [] as HTMLElement[], sug: "", top: 56, bottom: 90 };
const root = document.createElement("div");
root.className = "gx";
root.innerHTML = `<div class="gx-labels"></div><div class="gx-hud"></div><div class="gx-ctrl"></div><div class="gx-cont"></div><div class="gx-card" role="dialog" aria-live="polite"></div><div class="gx-fx" aria-hidden="true"></div>`;
const part = (c: string) => root.querySelector<HTMLElement>(".gx-" + c)!;

function model(): GxModel {
  return {
    nodes: NODES.map((n) => ({ id: n.id, domain: n.domain, state: nodeState(n), planet: n.planet })),
    links: NODES.flatMap((n) => n.prereq.map((p) => ({ from: p, to: n.id, lit: !!S.lessons[p] }))),
    cons: DOMAINS.map((d) => ({ id: d.id, lit: d.nodes.map((n) => !!S.lessons[n.id]), complete: domainDone(S, d.id) })),
    homeLights: Math.min(16, 2 + lessonsDone() * 2 + (S.game ? 2 : 0)),
    comet: cometsWaiting() > 0,
    night: night(), potato: PO(), motion: !noMotion(),
  };
}

function hud() {
  const lv = G?.level || 1, dom = G?.focusDom ? domainOf(G.focusDom) : null, node = G?.focusNode ? findNode(G.focusNode) : null;
  const crumb = `<nav class="gx-crumbs" aria-label="${t("gx.title")}">
    <button onclick="A.gxGalaxy()" class="${lv === 1 ? "on" : ""}" aria-label="Altair">${icon("sparkle", { size: 15, color: "#E0A800", tint: 0.5 })}${dom ? "" : "<span>Altair</span>"}</button>
    ${dom ? `<i>›</i><button onclick="A.gxSys('${dom.id}')" class="${lv === 2 ? "on" : ""}" style="--dc:${dom.color}"><span class="gx-dot"></span><span>${esc(tx(dom.short))}</span></button>` : ""}
    ${node ? `<i>›</i><span class="gx-crumbcode">${node.code}</span>` : ""}</nav>`;
  const say = S.set.inter && !PO() && lv === 1 ? `<button class="gx-say" onclick="A.openCustom()" aria-label="${t("gx.lionAria", { name: esc(S.m.name) })}">${lion(34)}<span class="bubble talk" id="homeTalk"></span></button>` : "";
  return `${crumb}${say}<div class="gx-hudr"><div class="gx-goal" title="${t("hm.today")}">${ring(S.today.xp, S.goal, 26)}<b>${S.today.xp}</b><small>/${S.goal}</small></div>
    <button class="gx-listbtn" onclick="A.gxList(true)" aria-label="${t("gx.listAria")}">${icon("doc", { size: 16 })}<span>${t("gx.list")}</span></button></div>`;
}
function ctrl() {
  return `<button onclick="A.gxZoom(1)" aria-label="${t("gx.zoomIn")}">+</button><button onclick="A.gxZoom(-1)" aria-label="${t("gx.zoomOut")}">−</button>
    <button class="gx-home" onclick="A.gxGalaxy()" aria-label="${t("gx.toAltair")}" title="${t("gx.toAltair")}">${icon("sparkle", { size: 20, color: "#E0A800", tint: 0.5 })}</button>`;
}
function labels() {
  const sug = suggested()?.id || "";
  ui.sug = sug;
  let h = `<div class="gxl altair" data-k="altair"><button class="gx-lion mascotbtn" onclick="A.gxPick('altair')" aria-label="${t("gx.lionAria", { name: esc(S.m.name) })}">${lion(46)}</button><span class="gxl-name">Altair</span></div>`;
  h += `<button class="gxl home" data-k="home" onclick="A.gxPick('home')" aria-label="${t("gx.homeAria")}">${icon("house", { size: 14, color: "#2E9B6A", tint: 0.4 })}<span>${t("gx.home")}</span></button>`;
  DOMAINS.forEach((d) => { // small pill per area: colour dot · short name · % explored (✦ when the constellation is complete)
    const p = explored(d), done = domainDone(S, d.id);
    h += `<button class="gxl sys${done ? " done" : ""}" data-k="sys:${d.id}" style="--dc:${d.color}" onclick="A.gxPick('sys:${d.id}')" aria-label="${esc(tx(d.title))} — ${t("gx.explored", { p })}${done ? " — " + t("gx.con", { d: esc(tx(d.short)) }) : ""}"><span class="gx-dot"></span><b>${esc(tx(d.short))}</b><small>${p}%</small>${done ? "<i>✦</i>" : ""}</button>`;
  });
  NODES.forEach((n) => { // small pill under each planet: code · short title (details live in the level-3 card)
    const st = nodeState(n), d = domainOf(n.domain);
    h += `<button class="gxl pl st-${st}" data-k="pl:${n.id}" data-d="${n.domain}" style="--dc:${d.color}" onclick="A.gxPick('pl:${n.id}')" aria-label="${esc(`${n.code} — ${tx(n.hook)} — ${stLabel(st)}`)}"><span class="gx-code">${n.code}</span><span class="gx-t">${esc(tx(n.title))}</span></button>`;
  });
  if (cometsWaiting() > 0) h += `<button class="gxl comet" data-k="comet" onclick="A.gxPick('comet')" aria-label="${t("gx.comet")}"><span>+20 XP</span></button>`;
  if (sug) h += `<div class="gxl minilion" data-k="minilion" aria-hidden="true">${lion(26)}</div>`;
  return h;
}

/** Planet card (level 3): the mystery question, what you need first, what it unlocks, Basics / Deep dive, LAND. */
function card(id: string) {
  const n = findNode(id);
  if (!n) return "";
  const d = domainOf(n.domain), st = nodeState(n), les = n.lesson, rec = S.lessons[id];
  const meta = les
    ? `${icon("clock", { size: 15 })} ${t("gx.minutes", { n: les.minutes })} · ${t("learn.steps", { n: les.steps.length })}${les.steps.some((s) => s.t === "video") ? ` · ${icon("video", { size: 15 })} ${t("learn.hasVideo")}` : ""}`
    : `${icon("clock", { size: 15 })} ${t("gx.plannedMin")}`;
  const pre = n.prereq.length
    ? `<div class="gx-pre"><b>${icon("pin", { size: 15, color: "#C97A06" })} ${t("learn.prereq")}</b>${n.prereq.map((p) => { const q = findNode(p)!, qd = domainOf(q.domain); return `<button class="gx-chip st-${nodeState(q)}" style="--dc:${qd.color}" onclick="A.gxPlanet('${p}')" title="${t("gx.flyTo")}"><span class="gx-code">${q.code}</span>${esc(tx(q.title))}${S.lessons[p] ? icon("check", { size: 14, color: "var(--good)" }) : ""}</button>`; }).join("")}</div>`
    : `<div class="gx-pre none">${icon("sparkle", { size: 15, color: "#E0A800", tint: 0.5 })} ${t("gx.noPre")}</div>`;
  const deepOK = !!(les?.deep && rec);
  const tiers = les ? `<div class="gx-tiers" role="group" aria-label="${t("gx.basic")} / ${t("gx.deep")}">
      <button class="${!ui.deep ? "on" : ""}" onclick="A.gxTier(false)">${t("gx.basic")}${rec ? icon("check", { size: 14 }) : ""}</button>
      ${les.deep ? `<button class="${ui.deep ? "on" : ""}" ${deepOK ? `onclick="A.gxTier(true)"` : `disabled aria-disabled="true" title="${t("learn.deepLocked")}"`}>${icon(deepOK ? "deep" : "lock", { size: 14, tint: 0.3 })} ${t("gx.deep")}${rec?.deep ? icon("check", { size: 14 }) : ""}</button>` : ""}
    </div>` : "";
  const land = les
    ? `<button class="btn good gx-land" onclick="A.gxLand('${id}')">${icon("rocket", { size: 20, color: "#fff", tint: 0.35 })} ${ui.deep && deepOK ? t("gx.landDeep") : t("gx.land")}</button>`
    : `<button class="btn gx-land" disabled>${t("gx.soonBtn", { d: n.day })}</button>`;
  return `<div class="gx-card-in" style="--dc:${d.color}">
    <button class="gx-x" onclick="A.gxBack()" aria-label="${t("gx.close")}">${icon("close", { size: 20 })}</button>
    <div class="gx-kick"><span class="gx-code">${n.code}</span><span>${esc(tx(d.title))}</span><span class="gx-st st-${st}">${stLabel(st)}</span>${stars(id)}</div>
    <h2 class="gx-hook">${esc(tx(n.hook))}</h2>
    <div class="gx-topic">${esc(tx(n.title))} <span class="gx-meta">· ${meta}</span></div>
    ${les ? "" : `<p class="gx-soon">${t("gx.soonCard", { d: n.day })}</p>`}
    ${pre}
    <div class="gx-unlock">${icon("play", { size: 16, color: d.color, tint: 0.35 })} ${t("gx.unlock")}: <b>${esc(tx(n.unlock))}</b></div>
    ${tiers}
    <div class="gx-actions">${land}${les ? `<button class="linkbtn" onclick="A.openReview('${id}')">${icon("bolt", { size: 14 })} ${t("learn.review")}</button>` : ""}</div>
  </div>`;
}

function refreshUI() {
  if (!G) return;
  part("hud").innerHTML = hud();
  part("ctrl").innerHTML = ctrl();
  const lab = part("labels");
  lab.innerHTML = labels();
  ui.labels = [...lab.querySelectorAll<HTMLElement>(".gxl")];
  ui.labels.forEach((el) => { el.dataset.w = String(el.offsetWidth); el.dataset.h = String(el.offsetHeight); });
  const c = part("cont");
  const mini = S.galaxy.mini;
  c.innerHTML = mini
    ? `<button class="gx-pill" onclick="A.gxCont(false)" aria-label="${t("gx.show")}" aria-expanded="false">${icon("playTri", { size: 12, color: "var(--pri)", tint: 1 })} ${pillText()}</button>`
    : `<button class="gx-grab" onclick="A.gxCont(true)" aria-label="${t("gx.hide")}" aria-expanded="true"><i></i></button>${miniCard()}`;
  c.classList.toggle("collapsed", mini);
  const cd = part("card");
  if (G.level === 3 && G.focusNode) { if (cd.dataset.id !== G.focusNode + S.set.lang + ui.deep + JSON.stringify(S.lessons[G.focusNode] || 0)) { cd.innerHTML = card(G.focusNode); cd.dataset.id = G.focusNode + S.set.lang + ui.deep + JSON.stringify(S.lessons[G.focusNode] || 0); } }
  root.dataset.level = String(G.level);
  ui.top = part("hud").querySelector<HTMLElement>(".gx-crumbs")!.offsetHeight + 16;
  ui.bottom = c.offsetHeight + 16;
  G.setInsets(ui.top, ui.bottom);
  place();
}

/** Every frame the camera moves: put each label on its object (semantic zoom decides which ones show),
 * then nudge overlapping labels apart so names never sit on top of each other. */
type Box = { el: HTMLElement; x: number; y: number; w: number; h: number; mid: boolean; fixed: boolean; top: number };
function place() {
  if (!G) return;
  const lv = G.level, W = rootSize.w || root.clientWidth, H = rootSize.h || root.clientHeight, tm = performance.now() / 1000;
  const boxes: Box[] = [];
  for (const el of ui.labels) {
    const k = el.dataset.k!;
    let show = false, key = k, dy = 0;
    if (k === "altair") { show = lv === 1; dy = -10; }
    else if (k === "home") show = lv < 3;
    else if (k.startsWith("sys:")) { show = lv === 1; dy = 16; }
    else if (k.startsWith("pl:")) show = lv === 2 && el.dataset.d === G.focusDom;
    else if (k === "comet") show = lv < 3;
    else if (k === "minilion") { show = lv >= 2 && !!ui.sug && findNode(ui.sug)?.domain === G.focusDom; key = "pl:" + ui.sug; }
    if (!show) { el.classList.add("off"); continue; }
    const p = G.project(key);
    let x = p.x, y = p.y;
    if (k.startsWith("pl:")) y += p.ppu * 1.15 + 6;
    else if (k === "home") y += p.ppu * 1.3 + 4;
    else if (k === "minilion") { const a = noMotion() ? 0.8 : tm * 1.4, R = p.ppu * 1.9; x += Math.cos(a) * R; y += Math.sin(a) * R * 0.45 - p.ppu * 0.6; el.style.zIndex = Math.sin(a) > 0 ? "3" : "1"; }
    else y += dy;
    const off = !p.on || x < -60 || x > W + 60 || y < -40 || y > H + 20;
    el.classList.toggle("off", off);
    if (off) continue;
    const mid = k === "altair" || k === "minilion" || k === "comet";
    const w = +(el.dataset.w || el.offsetWidth), h = +(el.dataset.h || el.offsetHeight);
    let top = mid ? y - h / 2 : y;
    boxes.push({ el, x, y, w, h: mid ? y + h / 2 - top : h, mid, fixed: k === "altair" || k === "minilion" || k === "comet", top });
  }
  // de-clutter: fixed anchors stay, the others slide down below whatever they overlap
  const placed = boxes.filter((b) => b.fixed && b.el.dataset.k === "altair");
  const hitOf = (b: Box) => placed.find((o) => Math.abs(o.x - b.x) * 2 < o.w + b.w + 4 && b.top < o.top + o.h + 3 && b.top + b.h + 3 > o.top);
  boxes.filter((b) => !b.fixed).sort((a, b) => a.top - b.top).forEach((b) => {
    if (hitOf(b) && b.el.dataset.k!.startsWith("sys:")) { // area pill: try just above its star before sliding down
      const below = b.top; b.top = below - 32 - b.h;
      if (hitOf(b)) b.top = below;
    }
    for (let n = 0; n < 6; n++) {
      const hit = hitOf(b);
      if (!hit) break;
      b.top = hit.top + hit.h + 3;
    }
    b.y = b.top;
    placed.push(b);
  });
  for (const b of boxes) {
    if (b.mid) continue;
    b.x = Math.min(Math.max(b.x, b.w / 2 + 4), W - b.w / 2 - 4); // keep names on screen
    const k = b.el.dataset.k!, lo = ui.top, hi = H - ui.bottom - b.h;
    if (k.startsWith("sys:")) b.y = Math.min(Math.max(b.y, lo), hi); // area pills never hide behind the HUD or the bottom card
    else b.el.classList.toggle("off", b.y < lo || b.y > hi);
  }
  for (const b of boxes) b.el.style.transform = `translate3d(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px,0) ${b.mid ? "translate(-50%,-50%)" : "translateX(-50%)"}`;
}

function onLevel(lv: Level) {
  if (lv !== 3) ui.deep = false;
  refreshUI();
  learnCtx();
}

function mount() {
  const host = document.getElementById("gxHost");
  if (!host) return;
  if (!G && !glFailed) {
    try {
      G = new Galaxy(root, {
        frame: place,
        level: (lv) => onLevel(lv),
        pick: (k) => A.gxPick(k),
        hidden: () => !root.isConnected || !root.closest(".pane.on") || document.hidden || !!document.querySelector(".phone.ov"), // paused as soon as the Learn pane is not the visible one
      }, PO());
      root.prepend(G.canvas);
      new ResizeObserver((es) => { const r = es[0].contentRect; rootSize.w = r.width; rootSize.h = r.height; G?.resize(); }).observe(root);
      bindContSwipe();
    } catch (e) {
      console.warn("WebGL unavailable → list view", e);
      glFailed = true; G = null;
      host.outerHTML = listView();
      return;
    }
  }
  host.appendChild(root);
  G!.resize();
  G!.setModel(model());
  if (ui.first) {
    ui.first = false;
    const dom = suggestedDomain();
    if (!S.galaxy.seen && !noMotion()) G!.intro(dom); else G!.place(2, dom);
    if (!S.galaxy.seen) { S.galaxy.seen = true; save(); }
  }
  refreshUI();
  G!.start();
}

/** Drag the Continue card down to tuck it away (tap the handle to bring it back). */
function bindContSwipe() {
  let y0 = 0, on = false;
  const c = part("cont");
  c.addEventListener("pointerdown", (e) => { if ((e.target as HTMLElement).closest("button:not(.gx-grab):not(.gx-pill)")) return; y0 = e.clientY; on = true; });
  window.addEventListener("pointerup", (e) => {
    if (!on) return; on = false;
    const dy = e.clientY - y0;
    if (dy > 30 && !S.galaxy.mini) toggleCont(true); else if (dy < -30 && S.galaxy.mini) toggleCont(false);
  });
}
function toggleCont(mini?: boolean) { S.galaxy.mini = mini ?? !S.galaxy.mini; save(); refreshUI(); }

/* ---------- actions ---------- */
function pick(key: string) {
  if (!G || G.justDragged()) return;
  if (key.startsWith("sys:")) G.goSystem(key.slice(4) as DomainId);
  else if (key.startsWith("pl:")) goPlanet(key.slice(3));
  else if (key === "altair") { if (G.level === 1) A.openCustom(); else G.goGalaxy(); }
  else if (key === "home") A.go("play");
  else if (key === "comet") catchComet();
}
function goPlanet(id: string) {
  if (!G) return;
  ui.deep = false;
  G.goPlanet(id);
}
function catchComet() {
  if (cometsWaiting() <= 0) return;
  S.chests.push("comet-" + (S.chests.filter((c) => c.startsWith("comet-")).length + 1));
  addXP(20);
  checkBadges(S); save();
  G?.cometBurst();
  confetti(document.querySelector<HTMLElement>(".phone"));
  minitoast(t("gx.cometGot", { xp: 20 }));
  setTimeout(() => A.go("learn"), 250);
}
const ROCKET = `<svg viewBox="0 0 60 92" width="54" height="83" aria-hidden="true"><path class="gx-flame" d="M21 62 Q30 92 39 62Z" fill="#FFC93C"/><path d="M30 3C45 17 47 40 43 63H17C13 40 15 17 30 3Z" fill="#fff" stroke="#1E1B3A" stroke-width="3" stroke-linejoin="round"/><path d="M17 48 5 70l13-4Zm26 0 12 22-13-4Z" fill="#EF4E4E" stroke="#1E1B3A" stroke-width="3" stroke-linejoin="round"/><path d="M30 3c6 6 10 12 12 19H18c2-7 6-13 12-19Z" fill="#5B5BD6" stroke="#1E1B3A" stroke-width="3" stroke-linejoin="round"/><circle cx="30" cy="37" r="11" fill="#CFE6FF" stroke="#1E1B3A" stroke-width="3"/></svg>`;
/** LAND: Alti Lion's little rocket flies down onto the planet, then the lesson opens. */
function land(id: string) {
  if (!G || !findLesson(id)) return;
  const deep = ui.deep && !!S.lessons[id];
  if (noMotion()) return A.startLesson(id, deep);
  const p = G.project("pl:" + id), fx = part("fx");
  const x1 = p.x - 27, y1 = p.y - p.ppu * 1.0 - 70, x0 = root.clientWidth * 0.82, y0 = -110;
  fx.innerHTML = `<div class="gx-rocket" style="--x0:${x0}px;--y0:${y0}px;--x1:${x1}px;--y1:${y1}px">${ROCKET}<div class="gx-rl">${lion(20)}</div></div><div class="gx-puff" style="left:${p.x}px;top:${p.y - p.ppu}px"></div>`;
  root.classList.add("landing");
  setTimeout(() => { fx.innerHTML = ""; root.classList.remove("landing"); A.startLesson(id, deep); }, 1250);
}

/* ============================== list view (accessible / low-end / no WebGL) ============================== */
function listView() {
  const sub = glFailed ? `<p class="gx-nogl">${icon("info", { size: 16 })} ${t("gx.noGL")}</p>` : "";
  return `<div class="lhead gxlist-h"><div><h2 class="title">${t("gx.title")}</h2><p class="muted">${t("gx.sub")}</p></div>${glFailed ? "" : `<button class="btn ghost sm" onclick="A.gxList(false)">${icon("sparkle", { size: 16, color: "#E0A800", tint: 0.5 })} ${t("gx.galaxy")}</button>`}</div>${sub}
  <div class="tile2 goal gxlist-goal">${ring(S.today.xp, S.goal, 56)}<div><div class="t2-k">${t("hm.today")}</div><div class="t2-v"><b>${S.today.xp}</b><small>/${S.goal} XP</small></div></div><div class="gxlist-streak">${icon("flame", { size: 26, color: IC.flame, tint: 0.35 })}<b>${S.streak}</b></div></div>
  ${continueCard(false)}
  ${DOMAINS.map((d, i) => `<section class="lsys" aria-label="${esc(tx(d.title))}">
    <div class="rhead" style="--dc:${d.color}"><div class="rh-ic">${icon(d.ic, { size: 26, color: "#fff", tint: 0.35 })}</div><div style="flex:1;min-width:0"><small>${t("learn.domain", { n: i + 1 })} · ${t("gx.explored", { p: explored(d) })}</small><h3>${esc(tx(d.title))}</h3><div class="rh-desc">${d.tag ? `<b>${esc(tx(d.tag))}</b> · ` : ""}${esc(tx(d.desc))}</div></div></div>
    <ul class="lrows">${d.nodes.map((n) => { const st = nodeState(n); return `<li><button class="lrow st-${st}" style="--dc:${d.color}" onclick="A.openLessonCard('${n.id}')"><span class="lr-code">${n.code}</span><span class="lr-body"><b>${esc(tx(n.hook))}</b><small>${esc(tx(n.title))} · ${stLabel(st)}${n.prereq.length ? ` · ${t("learn.prereq")}: ${n.prereq.map((p) => findNode(p)!.code).join(", ")}` : ""}</small></span>${st === "soon" ? `<span class="gx-tag soon">${n.day}</span>` : stars(n.id) || icon("chevron", { size: 18, color: "var(--muted)" })}</button></li>`; }).join("")}</ul></section>`).join("")}`;
}

/* ============================== shell hooks ============================== */
export function learnView() {
  const fresh = checkBadges(S);
  if (fresh.length) { save(); setTimeout(() => minitoast(t("ms.newBadge", { b: tx(fresh[0].name) })), 400); }
  return S.galaxy.list || glFailed ? listView() : `<div class="gxhost" id="gxHost"></div>`;
}
/** Called by the shell whenever the Learn pane becomes visible again (no re-render): redraw once, refresh labels. */
export function learnShown() { G?.wake(); }
/** Called by the shell right after the Learn tab's HTML is in the page. */
export function afterLearnRender() { if (document.getElementById("gxHost")) mount(); }

export function learnCtx() {
  const n = G && !S.galaxy.list && G.level === 3 && G.focusNode ? findNode(G.focusNode) : null;
  if (n) {
    const les = n.lesson;
    return setCtx({ key: "gx:" + n.id, where: t("gx.where") + " · " + n.code, title: tx(n.hook), short: les ? tx(les.info.s) : tx(n.title), long: les ? tx(les.info.l) : undefined, answered: true, kb: les?.kb || [] });
  }
  const d = G && !S.galaxy.list && G.focusDom ? domainOf(G.focusDom) : null;
  setCtx({ key: "tab:learn", where: t("gx.where"), title: d ? tx(d.title) : t("gx.title"), short: d ? tx(d.desc) : t("gx.sub"), answered: true, kb: ["budget", "inflation", "compound", "breakeven"] });
}

/** Bottom sheet for the List view: what's inside, "Good to know first", 1-minute refresher, Basic / Deep dive. */
function openLessonCard(id: string) {
  const n = findNode(id), les = findLesson(id);
  if (!n) return;
  const d = domainOf(n.domain);
  if (!les) return sheet(`<div style="display:inline-block">${lion(70, "wow")}</div><div class="gx-code" style="--dc:${d.color}">${n.code}</div><h2>${esc(tx(n.hook))}</h2><p class="muted" style="font-weight:700">${t("gx.soonCard", { d: n.day })}</p>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
  const rec = S.lessons[id], hasVideo = les.steps.some((s) => s.t === "video");
  const meta = `${icon("clock", { size: 15 })} ${les.minutes} min · ${t("learn.steps", { n: les.steps.length })}${hasVideo ? ` · ${icon("video", { size: 15 })} ${t("learn.hasVideo")}` : ""}`;
  const pre = n.prereq.length ? `<div class="prereq">${icon("pin", { size: 16, color: "#C97A06" })} <b>${t("learn.prereq")}:</b> ${n.prereq.map((p) => `${findNode(p)!.code} · ${esc(tx(findNode(p)!.title))}`).join(", ")}</div>` : "";
  const btns: Array<[string, string, string?]> = [[`${rec ? "↻ " : ""}${t("learn.startBasic")}`, `A.startLesson('${id}')`, "good"]];
  if (les.deep) btns.push([`${icon(rec ? "deep" : "lock", { size: 18, tint: 0.3 })} ${rec ? t("learn.deep") : t("learn.deepLocked")}`, rec ? `A.startLesson('${id}',true)` : "", rec ? "sun" : "ghost lockedbtn"]);
  sheet(`<div class="lcard"><div class="lc-ic" style="background:${d.color}">${icon(n.ic, { size: 32, color: "#fff", tint: 0.35 })}</div><div style="flex:1;min-width:0;text-align:left"><div class="muted lc-meta"><b>${n.code}</b> · ${esc(tx(n.title))}</div><h2 style="margin:0">${esc(tx(n.hook))}</h2><div class="muted lc-meta">${meta}</div></div></div>
    <p class="muted" style="font-weight:700;text-align:left">${tx(les.desc)}</p>${pre}<button class="linkbtn" onclick="A.openReview('${id}')">${icon("bolt", { size: 14 })} ${t("learn.review")}</button>`, btns);
  document.querySelector(".lockedbtn")?.setAttribute("disabled", "");
}
function openReview(id: string) {
  const les = findLesson(id);
  if (!les) return;
  sheet(reviewCard(les), [[t("learn.gotIt"), S.galaxy.list || glFailed ? `A.openLessonCard('${id}')` : "A.closeSheet()", "good"]]);
}

reg({
  openLessonCard, openReview, closeLessonCard: () => closeSheet(),
  gxPick: pick,
  gxPlanet: (id: string) => { if (S.galaxy.list || glFailed) return openLessonCard(id); goPlanet(id); },
  gxSys: (id: DomainId) => G?.goSystem(id),
  gxGalaxy: () => G?.goGalaxy(),
  gxBack: () => G?.back(),
  gxZoom: (d: 1 | -1) => G?.zoomStep(d),
  gxTier: (deep: boolean) => { ui.deep = deep; refreshUI(); },
  gxLand: land,
  gxCont: toggleCont,
  gxList: (on: boolean) => { S.galaxy.list = on; save(); A.go("learn"); },
});
