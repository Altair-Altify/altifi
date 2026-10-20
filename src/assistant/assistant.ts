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
  const rank = typeof (S.game as any)?.rank === "number" ? (S.game as any).rank : 0;
  const place = S.placement ? { n: 0, l: 3, p: 6 }[S.placement.lvl] : 0;
  const sc = lessonsDone() + rank * 1.5 + place;
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

export interface Reply { t: string; lv: Lvl; bumped?: boolean }
/** Swap this for a real AI call later (same inputs: question, level, screen context). */
export type AnswerEngine = (q: string, lv: Lvl, ctx: Ctx | null) => Reply;

const demoEngine: AnswerEngine = (q, lv0, ctx) => {
  const low = norm(q);
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
type Msg = { me?: boolean; t: string; lv?: Lvl; bumped?: boolean; typing?: boolean };
const chats: Record<string, { answered: boolean; msgs: Msg[] }> = {};
function chatFor(c: Ctx) {
  let ch = chats[c.key];
  const tip = c.question && !c.answered;
  if (!ch) ch = chats[c.key] = { answered: !tip, msgs: [{ t: tip ? t("as.greetHint") : t("as.greet") }] };
  else if (!tip && !ch.answered) { ch.answered = true; ch.msgs.push({ t: t("as.unlocked") }); }
  return ch;
}
export function clearChats() { for (const k of Object.keys(chats)) delete chats[k]; }

/* ---------- floating button ---------- */
export function refreshFab() {
  const phone = $(".phone");
  if (!phone) return;
  let fab = $("#lionfab");
  if (!fab) {
    fab = document.createElement("button");
    fab.id = "lionfab";
    fab.className = "lionfab";
    fab.onclick = () => openAssistant();
    phone.appendChild(fab);
  }
  const label = t("as.open", { name: S.m.name });
  fab.setAttribute("aria-label", label);
  fab.title = label;
  fab.innerHTML = `${lionFor(curLvl(), 52)}<span class="fabq">?</span>`;
  placeFab();
}
/** Keep the button above the nav bar / the lesson's footer, whatever its height. */
export function placeFab() {
  const fab = $("#lionfab"), phone = $(".phone");
  if (!fab || !phone) return;
  const ov = $("#overlay");
  let bottom = 12;
  if (ov?.classList.contains("show")) {
    const foot = ov.querySelector<HTMLElement>(".ofoot");
    const result = ov.querySelector(".resultbg");
    bottom = result ? 12 : foot ? foot.offsetHeight + 10 : 14;
  } else {
    bottom = ($(".nav")?.offsetHeight || 64) + 12 + ($("#chatbarSlot")?.offsetHeight || 0);
  }
  fab.style.bottom = bottom + "px";
}
new ResizeObserver(() => placeFab()).observe(document.documentElement);

/** Where answer pop-ups sit: just above the floating button. */
function popBottom() {
  const fab = $("#lionfab");
  return parseInt(fab?.style.bottom || "80") + 66;
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
      <p class="muted center" style="font-size:11px;font-weight:700">🤖 ${t("as.demoNote")}</p>
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
    return `<div><div style="display:flex;gap:8px;align-items:flex-end">${lionFor(lv, 34)}<div class="msg bot ${lv === "p" ? "pro" : ""}">${txt}</div></div>${tag}</div>`;
  }).join("");
  const b = $("#ifbody");
  if (b) b.scrollTop = b.scrollHeight;
}

function askLion(q?: string) {
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
    const r = engine(text, curLvl(), c);
    ch.msgs.push({ t: r.t, lv: r.lv, bumped: r.bumped });
    if (getCtx()?.key === key) drawChat();
  }, 700);
}

reg({
  openAssistant, closeAssistant, askLion,
  cycleLvl() {
    const order = ["auto", "n", "l", "p"] as const;
    S.set.lvl = order[(order.indexOf(S.set.lvl) + 1) % order.length];
    save();
    minitoast(S.set.lvl === "auto" ? `${t("as.lvl.auto")}: ${t("as.lvl." + autoLvl())}` : t("as.mode", { l: t("as.lvl." + S.set.lvl) }));
    refreshFab();
    openAssistant();
  },
});
