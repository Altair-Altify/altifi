/* ---------- Alti Lion: floating assistant in the bottom-right corner of EVERY screen (design doc 5.1) ----------
 * Grown from the base demo's "Intelligence" info tips (i-button → quick pop-up → full sheet with a context chat):
 *  • knows what is on screen (assistant/context.ts) and explains that exact content;
 *  • tip mode while an exercise is unanswered — hints, never the answer;
 *  • answers at 3 levels (🌱 Newbie · 📘 Learner · 🎓 Pro), auto from progress, or set by the user;
 *    questions with expert terms are answered at Pro level, and Alti Lion wears a graduation cap in Pro mode.
 * Demo: pre-written answers + simple rules (no paid API, no keys). An `AnswerEngine` seam is left for real AI. */
import { $, esc } from "../core/util";
import { S, save, PO, lessonsDone, type Lvl } from "../core/state";
import { reg } from "../core/actions";
import { t, tx, lang } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { getCtx, type Ctx } from "./context";
import { KB, ADV, FALLBACK, type Topic } from "./kb";
import { minitoast } from "../ui/fx";

/* ---------- level ---------- */
export function autoLvl(): Lvl {
  // S.game.rank is your place in the class ranking (#1 = best of 8, set by "My Life"), not a level: only the top
  // places count (#1 → +6, #4 → +1.5, #5 or lower → 0)
  const rank = typeof (S.game as any)?.rank === "number" ? (S.game as any).rank : 0;
  const game = rank > 0 ? Math.max(0, 5 - rank) : 0;
  const place = S.placement ? { n: 0, l: 3, p: 6 }[S.placement.lvl] : 0;
  const sc = lessonsDone() + game * 1.5 + place;
  return sc >= 8 ? "p" : sc >= 3 ? "l" : "n";
}
export const curLvl = (): Lvl => (S.set.lvl !== "auto" ? S.set.lvl : autoLvl());
const lionFor = (lv: Lvl, size: number, mood = "happy") => lion(size, mood, lv === "p" ? { ...S.m, hat: "grad" } : S.m);
const BN = () => esc(S.m.name || "Alti Lion");

/* ---------- answering ---------- */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
const hasKey = (low: string, k: string) => (k.length <= 3 ? new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`).test(low) : low.includes(k));
export const findTopic = (q: string): Topic | undefined => { const low = norm(q); return KB.find((tp) => tp.keys.some((k) => hasKey(low, k))); };
export const topicById = (id: string) => KB.find((tp) => tp.id === id);

export interface Reply { t: string; lv: Lvl; bumped?: boolean; more?: boolean } // more: offer "Explain like a pro"
/** Swap this for a real AI call later (same inputs: question, level, screen context). */
export type AnswerEngine = (q: string, lv: Lvl, ctx: Ctx | null) => Reply;

const demoEngine: AnswerEngine = (q, lv0, ctx) => {
  const low = norm(q);
  // a screen with ready answers (Today's news): answer at the asked level, then offer the Pro version
  if (ctx?.answers && (!ctx.answerKeys || ctx.answerKeys.some((k) => low.includes(k)))) {
    const a = ctx.answers[lv0] || ctx.answers.n;
    return { t: a, lv: ctx.answers[lv0] ? lv0 : "n", more: lv0 !== "p" };
  }
  let lv = lv0, bumped = false;
  if (lv !== "p" && ADV.some((w) => hasKey(low, w))) { lv = "p"; bumped = true; }
  // Tip mode: an exercise is on screen and not answered yet → hints only (base demo's rule).
  if (ctx?.question && !ctx.answered) {
    if (/hint|tip|clue|stuck|help|goi y|bi |giup/.test(low)) return { t: `${t("as.hintPrefix")} ${ctx.hint || ctx.short || ""}`, lv };
    if (/question|asking|hoi gi|dang hoi|cau hoi/.test(low)) return { t: t("as.whatAsking"), lv };
    return { t: t("as.tooClose"), lv };
  }
  if (ctx) {
    if (/simpl|easier|don gian|de hieu/.test(low) && ctx.short) return { t: t("as.simpler", { s: ctx.short }), lv };
    if (/why.*matter|quan trong/.test(low)) return { t: t("as.whyMatter"), lv };
    if (/explain this|giai thich phan nay|this part|phan nay/.test(low) && (ctx.long || ctx.extra)) {
      const extra = ctx.extra ? " " + ctx.extra.replace(/<[^>]+>/g, "") : "";
      return { t: (ctx.long || "") + extra, lv };
    }
    if (/deeper|sau hon/.test(low)) {
      const tp = ctx.kb?.map(topicById).find(Boolean);
      if (tp) return { t: tx(tp.p), lv: "p", bumped: lv !== "p" };
    }
  }
  const hit = findTopic(q);
  if (hit) return { t: tx(hit[lv]), lv, bumped };
  return { t: tx(FALLBACK[lv]), lv };
};
let engine: AnswerEngine = demoEngine;
export function setAnswerEngine(e: AnswerEngine) { engine = e; }

/* ---------- chats, one per screen context ---------- */
type Msg = { me?: boolean; t: string; lv?: Lvl; bumped?: boolean; typing?: boolean; more?: boolean };
const chats: Record<string, { answered: boolean; msgs: Msg[] }> = {};
function chatFor(c: Ctx) {
  let ch = chats[c.key];
  const tip = c.question && !c.answered;
  if (!ch) ch = chats[c.key] = { answered: !tip, msgs: [{ t: tip ? t("as.greetHint") : t("as.greet") }] };
  else if (!tip && !ch.answered) { ch.answered = true; ch.msgs.push({ t: t("as.unlocked") }); }
  return ch;
}
export function clearChats() { for (const k of Object.keys(chats)) delete chats[k]; }
/** Open the panel on the current screen and ask q once (at level lv) — e.g. "Ask Alti Lion" on Today's news. */
export function askOnce(q: string, lv?: Lvl) {
  openAssistant();
  const c = getCtx(); if (!c) return;
  if (!chatFor(c).msgs.some((m) => m.me)) askLion(q, lv);
}

/* ---------- floating button ----------
 * Hold and drag it anywhere; on release it glides to the nearest edge of the free area (never over the top bar,
 * the tab bar or a footer) and the spot is remembered on this device. A quick tap still opens the chat.
 * Hidden during a lesson (the lesson header's ⓘ opens the assistant there). In the town it is pinned top-right
 * and can't be dragged: joystick, minimap and action button already take the other corners. */
type FabSpot = { e: "l" | "r" | "t" | "b"; f: number }; // edge + position along it (0..1)
const FAB_KEY = "altifi-fab-v1", FAB_M = 12;
let spot: FabSpot = { e: "r", f: 1 }; // default: bottom-right, just above the tab bar
try { const v = JSON.parse(localStorage.getItem(FAB_KEY) || "null"); if (v && "lrtb".includes(v.e) && v.f >= 0 && v.f <= 1) spot = v; } catch { /* storage blocked */ }
const saveSpot = () => { try { localStorage.setItem(FAB_KEY, JSON.stringify(spot)); } catch { /* storage blocked */ } };
const inLesson = () => !!$("#overlay.show.lessonov");
const pinned = () => !!$(".phone.ingame");

/** The rectangle the button's top-left corner may sit in (phone coordinates). */
function fabArea(fab: HTMLElement) {
  const phone = $(".phone")!, ov = $("#overlay");
  const W = phone.clientWidth, H = phone.clientHeight, size = fab.offsetWidth || 62;
  let top: number, bottom: number;
  if (ov?.classList.contains("show")) {
    const head = ov.querySelector<HTMLElement>(".ohead"), foot = ov.querySelector<HTMLElement>(".ofoot");
    top = head ? head.offsetHeight : 0;
    bottom = ov.querySelector(".resultbg") ? 0 : foot ? foot.offsetHeight : 0;
  } else {
    top = $("#top")?.offsetHeight || 0;
    bottom = ($(".nav")?.offsetHeight || 64) + ($("#chatbarSlot")?.offsetHeight || 0);
  }
  const x0 = FAB_M, x1 = Math.max(x0, W - FAB_M - size), y0 = top + FAB_M, y1 = Math.max(y0, H - bottom - FAB_M - size);
  return { x0, x1, y0, y1 };
}
const spotXY = (a: ReturnType<typeof fabArea>, sp: FabSpot) => ({
  x: sp.e === "l" ? a.x0 : sp.e === "r" ? a.x1 : a.x0 + sp.f * (a.x1 - a.x0),
  y: sp.e === "t" ? a.y0 : sp.e === "b" ? a.y1 : a.y0 + sp.f * (a.y1 - a.y0),
});
/** Nearest edge of the free area to a point. */
function nearestSpot(a: ReturnType<typeof fabArea>, x: number, y: number): FabSpot {
  const fx = a.x1 > a.x0 ? (x - a.x0) / (a.x1 - a.x0) : 0, fy = a.y1 > a.y0 ? (y - a.y0) / (a.y1 - a.y0) : 0;
  const d = [["l", x - a.x0, fy], ["r", a.x1 - x, fy], ["t", y - a.y0, fx], ["b", a.y1 - y, fx]] as Array<[FabSpot["e"], number, number]>;
  d.sort((p, q) => p[1] - q[1]);
  return { e: d[0][0], f: Math.max(0, Math.min(1, d[0][2])) };
}

let drag: null | { id: number; sx: number; sy: number; ox: number; oy: number; moved: boolean } = null;
let dragged = false; // swallow the click that follows a drag
function fabDown(e: PointerEvent) {
  const fab = e.currentTarget as HTMLElement;
  if (pinned() || e.button > 0) return;
  drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: fab.offsetLeft, oy: fab.offsetTop, moved: false };
  dragged = false;
  try { fab.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ } // fast flicks leave the button before the drag starts
}
function fabMove(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id) return;
  const fab = e.currentTarget as HTMLElement, dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
  if (!drag.moved) {
    if (Math.hypot(dx, dy) < 8) return; // still a tap
    drag.moved = true;
    fab.classList.add("dragging");
  }
  const a = fabArea(fab);
  fab.style.left = Math.max(a.x0, Math.min(a.x1, drag.ox + dx)) + "px";
  fab.style.top = Math.max(a.y0, Math.min(a.y1, drag.oy + dy)) + "px";
}
function fabUp(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id) return;
  const fab = e.currentTarget as HTMLElement, moved = drag.moved;
  drag = null;
  if (!moved) return;
  dragged = true;
  fab.classList.remove("dragging");
  spot = nearestSpot(fabArea(fab), fab.offsetLeft, fab.offsetTop);
  saveSpot();
  placeFab(); // the CSS transition on left/top makes it glide to the edge
}

export function refreshFab() {
  const phone = $(".phone");
  if (!phone) return;
  let fab = $("#lionfab");
  if (!fab) {
    fab = document.createElement("button");
    fab.id = "lionfab";
    fab.className = "lionfab";
    fab.onclick = () => { if (dragged) { dragged = false; return; } openAssistant(); };
    fab.addEventListener("pointerdown", fabDown);
    fab.addEventListener("pointermove", fabMove);
    fab.addEventListener("pointerup", fabUp);
    fab.addEventListener("pointercancel", fabUp);
    phone.appendChild(fab);
  }
  const label = t("as.open", { name: S.m.name });
  fab.setAttribute("aria-label", label);
  fab.title = label;
  fab.innerHTML = `${lionFor(curLvl(), 52)}<span class="fabq">?</span>`;
  placeFab();
}
/** Put the button at its remembered edge spot inside the current free area (or hide / pin it). */
export function placeFab() {
  const fab = $("#lionfab"), phone = $(".phone");
  if (!fab || !phone) return;
  fab.classList.toggle("gone", inLesson());
  if (pinned() || inLesson()) { fab.style.removeProperty("left"); fab.style.removeProperty("top"); return; }
  if (drag?.moved) return;
  const { x, y } = spotXY(fabArea(fab), spot);
  fab.style.left = x + "px";
  fab.style.top = y + "px";
}
new ResizeObserver(() => placeFab()).observe(document.documentElement);

/** Where answer pop-ups sit: just above the lesson footer (the floating button is hidden in lessons). */
function popBottom() {
  const foot = $("#overlay.show .ofoot") as HTMLElement | null;
  return (foot ? foot.offsetHeight : 80) + 10;
}

/* ---------- tip pop-up after an answer (Intelligence setting) ---------- */
export function showTipPop() {
  const c = getCtx();
  const phone = $(".phone");
  if (!c || !phone || !c.short) return;
  phone.querySelectorAll(".infopop").forEach((e) => e.remove());
  const p = document.createElement("div");
  p.className = "infopop fabpop";
  p.innerHTML = `<b>💡 ${esc(c.title)}</b><br>${esc(c.short)}<span class="tap">${t("as.tapMore")}</span>`;
  p.onclick = () => openAssistant();
  p.style.bottom = popBottom() + "px";
  phone.appendChild(p);
  setTimeout(() => { p.classList.add("out"); setTimeout(() => p.remove(), 400); }, 5500);
}

/** The tip / nudge belongs to the step it was shown on: gone when the step changes or the lesson ends. */
export function hideTipPop() {
  document.querySelectorAll(".phone .infopop.fabpop").forEach((p) => { p.classList.add("out"); setTimeout(() => p.remove(), 250); });
}

/** After a wrong answer (Intelligence setting): a calm, serious nudge — no jokes, no blame.
 * From the 2nd wrong answer in a row it also carries the question's hint. Shown even when the lesson has no tip text. */
export function showNudgePop(hint?: string) {
  const phone = $(".phone");
  if (!phone) return;
  phone.querySelectorAll(".infopop").forEach((e) => e.remove());
  const lines = t("as.nudge").split("|");
  const p = document.createElement("div");
  p.className = "infopop fabpop nudge";
  p.setAttribute("role", "status");
  p.innerHTML = `<b>${esc(lines[Math.floor(Math.random() * lines.length)])}</b>${hint ? `<span class="nhint"><b>${t("as.nudgeHint")}</b> ${esc(hint)}</span>` : ""}<span class="tap">${t("as.tapMore")}</span>`;
  p.onclick = () => openAssistant();
  p.style.bottom = popBottom() + "px";
  phone.appendChild(p);
  setTimeout(() => { p.classList.add("out"); setTimeout(() => p.remove(), 400); }, hint ? 8000 : 5000);
}

/* ---------- full panel ---------- */
let open = false;
export function openAssistant() {
  const phone = $(".phone"), c = getCtx();
  if (!phone) return;
  phone.querySelectorAll(".infopop,.aspanel").forEach((e) => e.remove());
  open = true;
  const ctx: Ctx = c || { key: "general", where: "Altifi", title: "Altifi", answered: true };
  chatFor(ctx);
  const lv = curLvl(), auto = S.set.lvl === "auto";
  const tip = ctx.question && !ctx.answered;
  const card = tip
    ? `<span class="tipmode">${t("as.tipMode")}</span><p style="margin:0">${t("as.tipModeText")}</p>`
    : ctx.long ? `<p style="margin:0">${ctx.long}</p>${ctx.extra ? `<p class="ifextra">${ctx.extra}</p>` : ""}` : ctx.short ? `<p style="margin:0">${ctx.short}</p>` : "";
  const topicChips = (ctx.kb || []).map(topicById).filter(Boolean).slice(0, 3).map((tp) => tx(tp!.q));
  const chips = tip ? [t("as.chip.hint"), t("as.chip.what")]
    : ctx.long ? [t("as.chip.explain"), t("as.chip.simpler"), t("as.chip.why"), t("as.chip.deeper"), ...topicChips]
    : [...topicChips, tx(topicById("about")!.q), lang() === "vi" ? "Giải thích hiệu ứng Fisher" : "Explain the Fisher effect"];
  const f = document.createElement("div");
  f.className = "infofull aspanel";
  f.setAttribute("role", "dialog");
  f.innerHTML = `<div class="ifhead"><span class="ashead">${lionFor(lv, 46)}</span><div style="flex:1;min-width:0"><b>${BN()}</b><div class="muted ifsub">${t("as.ctxNow")}: ${esc(ctx.where)}${ctx.sub ? " · " + esc(ctx.sub) : ""}</div></div><button class="x" onclick="A.closeAssistant()" aria-label="${t("c.close")}">✕</button></div>
    <div class="ifbody" id="ifbody">
      <div class="lvlbar"><div style="flex:1;line-height:1.3">${t("as.talksLike", { name: BN() })}<br><span style="color:var(--ink)">${t("as.lvlWho." + lv)}</span><br><span style="font-size:11px">${auto ? t("as.auto") : t("as.manual")}</span></div><button class="lvlbtn" onclick="A.cycleLvl()">${t("as.lvl." + lv)} ▾</button></div>
      ${card ? `<div class="ifcard"><div class="muted ifsub" style="margin-bottom:6px">📍 ${esc(ctx.title)}</div>${card}</div>` : ""}
      <div class="chatlog" id="ifchat"></div>
      <div class="chips" style="margin-top:12px">${chips.map((ch) => `<button class="chip" onclick="A.askLion(this.textContent)">${esc(ch)}</button>`).join("")}</div>
      <p class="muted center dnote" style="font-size:11px;font-weight:700">🤖 ${t("as.demoNote")}</p>
    </div>
    <div class="chatbar"><input id="ifin" placeholder="${tip ? t("as.phHint") : ctx.long ? t("as.phCtx", { name: S.m.name }) : t("as.ph", { name: S.m.name })}" onkeydown="if(event.key==='Enter')A.askLion()"><button onclick="A.askLion()">${t("c.send")}</button></div>`;
  phone.appendChild(f);
  $("#lionfab")?.classList.add("hide");
  drawChat();
  if (!PO()) setTimeout(() => ($("#ifin") as HTMLInputElement | null)?.focus({ preventScroll: true }), 50);
}
export function closeAssistant() {
  open = false;
  document.querySelectorAll(".aspanel").forEach((e) => e.remove());
  $("#lionfab")?.classList.remove("hide");
}
export const assistantOpen = () => open;

function drawChat() {
  const box = $("#ifchat"), c = getCtx();
  if (!box) return;
  const ch = chatFor(c || { key: "general", where: "", title: "", answered: true });
  box.innerHTML = ch.msgs.map((m) => {
    if (m.me) return `<div class="msg me">${esc(m.t)}</div>`;
    const lv = m.lv || curLvl();
    const txt = m.typing ? '<span class="typing"><i></i><i></i><i></i></span>' : esc(m.t);
    const tag = m.lv && !m.typing ? `<div class="mtag">${t("as.mode", { l: t("as.lvl." + m.lv) })}${m.bumped ? " · " + t("as.bumped") : ""}</div>` : "";
    const more = m.more && !m.typing ? `<button class="chip lionpro" onclick="A.lionPro()">🎓 ${t("as.proBtn")}</button>` : "";
    return `<div><div style="display:flex;gap:8px;align-items:flex-end">${lionFor(lv, 34)}<div class="msg bot ${lv === "p" ? "pro" : ""}">${txt}</div></div>${tag}${more}</div>`;
  }).join("");
  const b = $("#ifbody");
  if (b) b.scrollTop = b.scrollHeight;
}

/** "Explain like a pro": switch Alti Lion to the Pro level (graduation cap) and answer the same question again, deeper. */
function lionPro() {
  const c = getCtx(); if (!c) return;
  chatFor(c).msgs.forEach((m) => (m.more = false));
  S.set.lvl = "p"; save(); refreshFab();
  openAssistant(); // header lion now wears the cap
  askLion(t("as.proBtn"), "p");
}
export function askLion(q?: string, lvAsk?: Lvl) {
  const inp = $("#ifin") as HTMLInputElement | null;
  const text = (q || inp?.value || "").trim();
  if (!text) return;
  if (inp) inp.value = "";
  const c = getCtx() || { key: "general", where: "", title: "", answered: true };
  const ch = chatFor(c), key = c.key;
  ch.msgs.push({ me: true, t: text });
  ch.msgs.push({ t: "", typing: true });
  drawChat();
  setTimeout(() => {
    ch.msgs.pop();
    const r = engine(text, lvAsk || curLvl(), c);
    ch.msgs.push({ t: r.t, lv: r.lv, bumped: r.bumped, more: r.more });
    if (getCtx()?.key === key) drawChat();
  }, 700);
}

reg({
  openAssistant, closeAssistant, askLion: (q?: string) => askLion(q), lionPro,
  cycleLvl() {
    const order = ["auto", "n", "l", "p"] as const;
    S.set.lvl = order[(order.indexOf(S.set.lvl) + 1) % order.length];
    save();
    minitoast(S.set.lvl === "auto" ? `${t("as.lvl.auto")}: ${t("as.lvl." + autoLvl())}` : t("as.mode", { l: t("as.lvl." + S.set.lvl) }));
    refreshFab();
    openAssistant();
  },
});
