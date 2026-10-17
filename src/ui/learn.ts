/* ---------- Learn tab (design doc 10c.2 & 10c.3) ----------
 * Hero: little illustrated town + full-body Alti Lion (talks & emotes as in the base demo), today's goal ring,
 * streak, and a big "Continue" card (placement test for new users).
 * Path: a winding road through 5 illustrated regions — one per area of finance, styled like its district on the game map.
 * Milestones: a reward chest after 3 lessons, a badge at the end of each region.
 * No forced order (3.2): every written lesson is open; "START" only marks a suggestion. */
import { esc } from "../core/util";
import { S, PO, defaultM, save, addXP, noMotion } from "../core/state";
import { reg } from "../core/actions";
import { t, tx } from "../i18n/i18n";
import { lion, lionFull } from "../mascot/lion";
import { DOMAINS, isReal, findLesson, ALL_LESSONS, type Domain } from "../content/domains";
import { checkBadges, domainDone } from "../content/badges";
import { sheet, closeSheet, minitoast, confetti } from "./fx";
import { setCtx } from "../assistant/context";
import { reviewCard } from "../lesson/player";
import { icon, IC } from "./icons";
import { townScene, tree, bush, house, shop, tower, ticker, hall, ship, crane, water, flowers } from "./scenes";
import type { Lesson, LessonStub } from "../lesson/types";

export function homeFirst(isStatic: boolean) {
  if (JSON.stringify(S.m) === JSON.stringify(defaultM())) return t("home.firstDefault", { name: S.m.name });
  const pep = t("home.pep").split("|");
  return isStatic ? pep[Object.keys(S.lessons).length % pep.length] : t("home.first", { name: S.m.name });
}

const suggested = () => ALL_LESSONS.find((l) => !S.lessons[l.id]);
const night = () => document.body.classList.contains("night");

/* ---------- hero ---------- */
function ring(val: number, goal: number) {
  const r = 27, C = 2 * Math.PI * r, k = Math.min(1, val / goal);
  return `<svg class="goalring" width="72" height="72" viewBox="0 0 72 72" role="img" aria-label="${val}/${goal} XP">
    <circle cx="36" cy="36" r="${r}" fill="none" stroke="var(--track)" stroke-width="8"/>
    <circle class="gr-arc" cx="36" cy="36" r="${r}" fill="none" stroke="${k >= 1 ? "var(--good)" : "var(--sun)"}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" style="--off:${(C * (1 - k)).toFixed(1)};--c:${C.toFixed(1)}" transform="rotate(-90 36 36)"/>
    <foreignObject x="14" y="14" width="44" height="44"><div class="gr-ic">${icon(k >= 1 ? "check" : "target", { size: 24, color: k >= 1 ? "var(--good)" : "#E0A800" })}</div></foreignObject></svg>`;
}

function continueCard() {
  const ip = S.inprog && findLesson(S.inprog.id);
  if (ip && S.inprog) {
    const pct = Math.round((S.inprog.s / Math.max(1, S.inprog.n)) * 100), d = DOMAINS.find((x) => x.id === ip.domain)!;
    return contCard(d, ip, t("hm.continue"), pct, `${t("hm.step", { n: S.inprog.s + 1, m: S.inprog.n })}${S.inprog.deep ? " · " + t("lp.deepTag") : ""}`, `A.startLesson('${ip.id}',${S.inprog.deep},${S.inprog.s})`);
  }
  if (!Object.keys(S.lessons).length && !S.placement) {
    const sug = suggested();
    return `<div class="contcard place"><div class="cc-ic">${icon("target", { size: 34, color: "#fff", tint: 0.35 })}</div><div class="cc-body"><div class="cc-kicker">${t("hm.placeT")}</div><div class="cc-sub">${t("hm.placeS")}</div></div>
      <button class="btn sun" onclick="A.pushThen(this,'startLesson','placement')">${t("hm.placeBtn")}</button>${sug ? `<button class="linkbtn" onclick="A.startLesson('${sug.id}')">${t("hm.skip")}</button>` : ""}</div>`;
  }
  const sug = suggested();
  if (!sug) return `<div class="contcard"><div class="cc-body"><div class="cc-sub">${t("hm.allDone")}</div></div></div>`;
  const d = DOMAINS.find((x) => x.id === sug.domain)!;
  const real = d.lessons.filter(isReal), pct = Math.round((real.filter((l) => S.lessons[l.id]).length / real.length) * 100);
  return contCard(d, sug, t("hm.next"), pct, tx(d.title), `A.openLessonCard('${sug.id}')`);
}
function contCard(d: Domain, l: Lesson, kicker: string, pct: number, sub: string, go: string) {
  return `<div class="contcard" style="--dc:${d.color}"><div class="cc-row"><div class="cc-ic" style="background:${d.color}">${icon(l.ic, { size: 34, color: "#fff", tint: 0.35 })}</div>
    <div class="cc-body"><div class="cc-kicker">${kicker}</div><div class="cc-title">${esc(tx(l.title))}</div><div class="cc-sub">${esc(sub)}</div></div></div>
    <div class="cc-prog"><i style="width:${pct}%;background:${d.color}"></i></div><div class="cc-pct">${pct}%</div>
    <button class="btn good" onclick="${go}">${icon("playTri", { size: 18, color: "#fff", tint: 1 })} ${t("hm.cont")}</button></div>`;
}

function hero() {
  const talk = S.set.inter ? (PO() ? `<div class="bubble hero-bubble">${esc(homeFirst(true))}</div>` : `<div class="bubble talk hero-bubble" id="homeTalk"></div>`) : "";
  const k = Math.min(1, S.today.xp / S.goal);
  return `<section class="hero">
    <div class="hero-scene">${townScene(360, 190, night())}</div>
    <button class="hero-lion mascotbtn${noMotion() ? "" : " waving"}" onclick="A.openCustom()" aria-label="${t("bd.customizeAria")}">${lionFull(104)}<span class="editdot">${icon("pencil", { size: 15, color: "var(--pri)" })}</span></button>
    ${talk}
  </section>
  <div class="hero-row">
    <div class="tile2 goal">${ring(S.today.xp, S.goal)}<div><div class="t2-k">${t("hm.today")}</div><div class="t2-v"><b data-ck="today" data-to="${S.today.xp}">${S.today.xp}</b><small>/${S.goal} XP</small></div><div class="t2-s">${k >= 1 ? t("hm.goalDone") : ""}</div></div></div>
    <div class="tile2 streak">${icon("flame", { size: 40, color: IC.flame, tint: 0.35 })}<div><div class="t2-v big"><b data-ck="streak2" data-to="${S.streak}">${S.streak}</b></div><div class="t2-k">${t("hm.streak")}</div></div></div>
  </div>
  ${continueCard()}`;
}

/* ---------- the winding road ---------- */
type Item = { kind: "lesson"; l: Lesson | LessonStub; i: number } | { kind: "chest"; id: string; before: (Lesson | LessonStub)[] } | { kind: "badge"; d: Domain };
const W = 360, GAP = 112, TOP = 92;
const XS = [180, 100, 180, 260];
const TINT: Record<string, string> = { personal: "#E1F5D4", corporate: "#F0E4FA", markets: "#FFEEDB", public: "#DCF3F0", intl: "#DFE8FF" };

function itemsOf(d: Domain): Item[] {
  const out: Item[] = [];
  d.lessons.forEach((l, i) => {
    out.push({ kind: "lesson", l, i });
    if (i === 2 && d.lessons.length > 3) out.push({ kind: "chest", id: `${d.id}-chest-1`, before: d.lessons.slice(0, 3) });
  });
  out.push({ kind: "badge", d });
  return out;
}
/** Smooth road through the points (Catmull-Rom → cubic Bézier). */
function roadPath(pts: [number, number][]) {
  let p = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    p += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return p;
}
/** Region scenery: the district of this area on the game map. */
function decor(d: Domain, k: number, x: number, y: number) {
  const v = k % 3;
  switch (d.id) {
    case "personal": return v === 1 ? tree(x, y, 1, k % 2) + flowers(x + 22, y - 2) : house(x, y, 0.95, "#FFF7E6", ["#EF7B6B", "#5B5BD6", "#F2A33A"][k % 3]) + bush(x + 30, y + 4, 0.7);
    case "corporate": return v === 2 ? tree(x, y, 0.95, 1) : shop(x, y, 0.95, ["#8E44AD", "#F2A33A", "#2BB673"][k % 3], ["🧋", "🥖", "📚"][k % 3]);
    case "markets": return v === 1 ? ticker(x, y - 6, 74) + bush(x + 30, y + 4, 0.7) : tower(x - 12, y, 26, 82, "#A9C8F5") + tower(x + 16, y, 22, 58, "#C9B6FF");
    case "public": return v === 0 ? hall(x, y, 1) : tree(x, y, 0.95, 2) + flowers(x - 20, y);
    default: return v === 1 ? crane(x + 6, y, 0.9) : ship(x, y - 4, 0.9);
  }
}

function region(d: Domain, di: number) {
  const items = itemsOf(d);
  const H = TOP + (items.length - 1) * GAP + 64;
  const pts: [number, number][] = items.map((_, i) => [XS[i % 4], TOP + i * GAP]);
  const road = roadPath([[180, -10], ...pts, [180, H + 10]]);
  let deco = "";
  if (d.id === "intl") deco += water(268, 0, 92, H);
  pts.forEach(([x, y], i) => {
    const side = x < 180 ? 296 : x > 180 ? 64 : i % 2 ? 300 : 60;
    if (d.id === "intl" && side > 180) deco += i % 2 ? ship(312, y + 26, 0.75) : "";
    else deco += decor(d, i + di, side, y + 26);
    if (i % 2 === 0) deco += bush(side > 180 ? 30 : 330, y + 70, 0.6);
  });
  const sug = suggested();
  const nodes = items.map((it, i) => {
    const [x, y] = pts[i], pos = `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
    if (it.kind === "lesson") return lessonNode(it.l, d, pos, sug?.id === it.l.id);
    if (it.kind === "chest") return chestNode(it.id, it.before, pos);
    return badgeNode(d, pos);
  }).join("");
  const real = d.lessons.filter(isReal), done = real.filter((l) => S.lessons[l.id]).length;
  return `<section class="region" aria-label="${esc(tx(d.title))}">
    <div class="rhead" style="--dc:${d.color}"><div class="rh-ic">${icon(d.ic, { size: 28, color: "#fff", tint: 0.35 })}</div><div style="flex:1;min-width:0"><small>${t("learn.domain", { n: di + 1 })} · ${t("learn.lessons", { done, total: d.lessons.length })}</small><h3>${tx(d.title)}</h3><div class="rh-desc">${tx(d.desc)}</div></div></div>
    <div class="rmap" style="aspect-ratio:${W}/${H}">
      <svg class="rscene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><rect width="${W}" height="${H}" rx="28" fill="${TINT[d.id]}"/>
        <path d="${road}" stroke="#E5D3AC" stroke-width="38" fill="none" stroke-linecap="round"/><path d="${road}" stroke="#F4E7C9" stroke-width="30" fill="none" stroke-linecap="round"/><path d="${road}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="2 14" stroke-linecap="round" opacity=".9"/>
        ${deco}</svg>
      ${nodes}
    </div></section>`;
}

function lessonNode(l: Lesson | LessonStub, d: Domain, pos: string, isSug: boolean) {
  const real = isReal(l), rec = S.lessons[l.id];
  const st = !real ? "soon" : rec ? "done" : isSug ? "current" : "open";
  const label = esc(tx(l.title));
  const stars = rec ? `<span class="nstars" aria-hidden="true">${[0, 1, 2].map((k) => icon("star", { size: 13, color: k < rec.stars ? IC.star : "var(--lockd)", tint: k < rec.stars ? 1 : 0.3 })).join("")}</span>` : "";
  const inner = st === "done" ? icon("check", { size: 30, color: "#fff" }) : icon(l.ic, { size: 30, color: st === "soon" ? "var(--lockd)" : "#fff", tint: st === "soon" ? 0.25 : 0.35 });
  const pre = real && (l as Lesson).prereq ? `<span class="ntag">${icon("pin", { size: 12 })}${t("ms.prereqTag")}</span>` : "";
  const stateTxt = st === "done" ? t("learn.done") : st === "soon" ? t("ms.soonTag") : st === "current" ? t("learn.recommended") : "";
  return `<div class="pnode ${st}" style="${pos};--dc:${d.color}">
    ${st === "current" ? `<span class="tag">${t("c.start")}</span>` : ""}
    <button class="pbtn" onclick="A.openLessonCard('${l.id}')" aria-label="${label}${stateTxt ? " — " + stateTxt : ""}">${inner}${rec?.deep ? `<span class="ndeep">${icon("deep", { size: 16, color: "#7E5BE0", tint: 1 })}</span>` : ""}</button>
    ${stars}<div class="nlabel">${label}</div>${pre}${st === "soon" ? `<span class="ntag soon">${t("ms.soonTag")}</span>` : ""}</div>`;
}
const chestReady = (before: (Lesson | LessonStub)[]) => { const r = before.filter(isReal); return r.length > 0 && r.every((l) => S.lessons[l.id]); };
function chestNode(id: string, before: (Lesson | LessonStub)[], pos: string) {
  const opened = S.chests.includes(id), ready = !opened && chestReady(before);
  const st = opened ? "opened" : ready ? "ready" : "locked";
  return `<div class="pnode chest ${st}" style="${pos}"><button class="pbtn" onclick="A.openChest('${id}')" aria-label="${t("ms.chest")}">${icon(opened ? "chestOpen" : "chest", { size: 34, color: opened ? "#C97A06" : ready ? "#8A5A00" : "var(--lockd)", tint: ready || opened ? 0.45 : 0.2 })}${st === "locked" ? `<span class="nlock">${icon("lock", { size: 14, color: "var(--muted)" })}</span>` : ""}</button><div class="nlabel">${opened ? t("ms.chestDone") : t("ms.chest")}</div></div>`;
}
function badgeNode(d: Domain, pos: string) {
  const got = S.badges.includes("dom-" + d.id);
  return `<div class="pnode badge ${got ? "got" : "locked"}" style="${pos};--dc:${d.color}"><button class="pbtn" onclick="A.openBadge('dom-${d.id}')" aria-label="${t("ms.badge", { d: esc(tx(d.title)) })}">${icon("medal", { size: 34, color: got ? "#fff" : "var(--lockd)", tint: got ? 0.4 : 0.2 })}</button><div class="nlabel">${t("ms.badge", { d: esc(tx(d.title)) })}</div></div>`;
}

export function learnView() {
  const fresh = checkBadges(S);
  if (fresh.length) { save(); setTimeout(() => minitoast(t("ms.newBadge", { b: tx(fresh[0].name) })), 400); }
  return hero() + `<div class="lhead"><h2 class="title">${t("hm.pathTitle")}</h2><p class="muted">${t("learn.sub")}</p></div>` + DOMAINS.map(region).join("");
}

export function learnCtx() {
  setCtx({ key: "tab:learn", where: t("as.whereLearn"), title: t("learn.title"), short: t("learn.sub"), answered: true, kb: ["budget", "inflation", "compound", "breakeven"] });
}

/** Bottom sheet when a node is tapped: what's inside, "Good to know first", 1-minute refresher, Basic / Deep dive. */
function openLessonCard(id: string) {
  const les = findLesson(id);
  if (!les) {
    const stub = DOMAINS.flatMap((d) => d.lessons).find((l) => l.id === id);
    return sheet(`<div style="display:inline-block">${lion(70, "wow")}</div><h2>${stub ? esc(tx(stub.title)) : ""}</h2><p class="muted" style="font-weight:700">${t("learn.soonDay")}</p>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
  }
  const rec = S.lessons[id], d = DOMAINS.find((x) => x.id === les.domain);
  const hasVideo = les.steps.some((s) => s.t === "video");
  const meta = `${icon("clock", { size: 15 })} ${les.minutes} min · ${t("learn.steps", { n: les.steps.length })}${hasVideo ? ` · ${icon("video", { size: 15 })} ${t("learn.hasVideo")}` : ""}`;
  const prereq = les.prereq ? `<div class="prereq">${icon("pin", { size: 16, color: "#C97A06" })} <b>${t("learn.prereq")}:</b> ${tx(les.prereq)} <button class="linkbtn inline" onclick="A.openReview('${id}')">${icon("bolt", { size: 14 })} ${t("learn.review")}</button></div>` : `<button class="linkbtn" onclick="A.openReview('${id}')">${icon("bolt", { size: 14 })} ${t("learn.review")}</button>`;
  const btns: Array<[string, string, string?]> = [[`${rec ? "↻ " : ""}${t("learn.startBasic")}`, `A.startLesson('${id}')`, "good"]];
  if (les.deep) btns.push([`${icon(rec ? "deep" : "lock", { size: 18, tint: 0.3 })} ${rec ? t("learn.deep") : t("learn.deepLocked")}`, rec ? `A.startLesson('${id}',true)` : "", rec ? "sun" : "ghost lockedbtn"]);
  sheet(`<div class="lcard"><div class="lc-ic" style="background:${d?.color || "var(--pri)"}">${icon(les.ic, { size: 32, color: "#fff", tint: 0.35 })}</div><div style="flex:1;min-width:0;text-align:left"><h2 style="margin:0">${tx(les.title)}</h2><div class="muted lc-meta">${meta}</div></div></div>
    <p class="muted" style="font-weight:700;text-align:left">${tx(les.desc)}</p>${prereq}`, btns);
  document.querySelector(".lockedbtn")?.setAttribute("disabled", "");
}
function openReview(id: string) {
  const les = findLesson(id);
  if (!les) return;
  sheet(reviewCard(les), [[t("learn.gotIt"), `A.openLessonCard('${id}')`, "good"]]);
}
function openChest(id: string) {
  const it = DOMAINS.flatMap(itemsOf).find((x) => x.kind === "chest" && x.id === id) as Extract<Item, { kind: "chest" }> | undefined;
  if (!it) return;
  if (S.chests.includes(id)) return sheet(`<div class="chestbig">${icon("chestOpen", { size: 84, color: "#C97A06", tint: 0.45 })}</div><h2>${t("ms.chestDone")}</h2>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
  if (!chestReady(it.before)) return sheet(`<div class="chestbig">${icon("chest", { size: 84, color: "var(--lockd)", tint: 0.25 })}</div><h2>${t("ms.chest")}</h2><p class="muted" style="font-weight:700">${t("ms.chestLocked")}</p>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
  S.chests.push(id);
  addXP(20);
  sheet(`<div class="chestbig opening">${icon("chestOpen", { size: 92, color: "#C97A06", tint: 0.5 })}<span class="xpfly">+20 XP</span></div><h2>${t("ms.chestOpen")}</h2><p class="muted" style="font-weight:800">${t("ms.chestGot", { xp: 20 })}</p>`, [[t("c.continue"), "A.closeSheet();A.go('learn')", "good"]]);
  confetti(document.querySelector<HTMLElement>(".phone"));
}
function openBadge(id: string) {
  const d = DOMAINS.find((x) => "dom-" + x.id === id);
  if (!d) return;
  const got = S.badges.includes(id) || domainDone(S, d.id);
  sheet(`<div class="badgebig" style="background:${got ? d.color : "var(--lock)"}">${icon("medal", { size: 64, color: "#fff", tint: 0.4 })}</div><h2>${t("ms.badge", { d: esc(tx(d.title)) })}</h2><p class="muted" style="font-weight:700">${got ? t("ms.badgeGot") : t("ms.badgeHow")}</p>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
}

reg({ openLessonCard, openReview, openChest, openBadge, closeLessonCard: () => closeSheet() });
