/* ---------- Personal mode "My Life" — screens inside the town (design doc 6.3-1, 13.4) ----------
 * The month loop happens in real places: Office (one decision a month, rated like chess, with the views of each
 * side and what really happened) → Market (spending plan) → Bank (save, borrow, credit score) → Clinic (insurance)
 * → Homes & rides dealer → Home (end the month: report, ranking against the 7 classmates, a tip from Alti Lion).
 * Nothing is hard-locked (design doc 3.2 "không ép thứ tự"): a place whose lesson you haven't done shows a
 * "Learn now" chip. The phone button shows your net worth breakdown and the ranking. */
import { $, esc, shortVnd, vnd, clamp } from "../core/util";
import { S, save, noMotion } from "../core/state";
import { reg } from "../core/actions";
import { t, tx, lang } from "../i18n/i18n";
import { icon } from "./icons";
import { lion } from "../mascot/lion";
import { minitoast, confetti } from "./fx";
import { DOMAINS } from "../content/domains";
import { CASES, BIZ_CASES, GOOD, type Case, type BizCase, type Rating } from "../content/cases";
import { openBiz, bizValue, bizRate, bizPayment, breakEven, bizFloat, OPEN_COST, OWN_MIN, EQUIP, BIZ_FIXED, BIZ_FIXED_RATE, PRICES, type PL } from "../game/biz";
import { PERSONAS } from "../game/npc";
import {
  newLife, endMonth, netWorth, paper, ownedValue, debt, buy, sell, deposit, withdraw, payOffCard, payment, loanRate, monthlyCosts,
  policyRate, depositRate, floatRate, FIXED_RATE, INSURANCE, ITEMS, PLANS, item, type Life, type Plan, type Report, type Item,
} from "../game/life";
import { townHooks, townSheet, townSheetClose, say, townTalkClose, ensureGame, refreshTownHud, getTown, townWardrobe } from "./town";

const life = (): Life | undefined => (S.game as any)?.life;
const money = (n: number) => vnd(n, lang());
const short = (n: number) => shortVnd(n, lang());
const sign = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "") + short(Math.abs(n));
const nodeOf = (id?: string) => (id ? DOMAINS.flatMap((d) => d.nodes).find((n) => n.id === id) : undefined);
const RCOL: Record<Rating, string> = { "!!": "#1BADA6", "!": "#2BB673", "★": "#7CB342", "!?": "#8E9BFF", "?!": "#F2A33A", "??": "#EF4E4E" };
const STAGE_N = { student: 0, staff: 0, owner: 1, tycoon: 3 } as Record<string, number>;

function persist() {
  const g = ensureGame(), L = life();
  if (L) { g.netWorth = netWorth(L); g.cash = L.cash; }
  save();
  refreshTownHud();
}
/** "Learn now" chip for a place whose lesson isn't done yet (soft lock). */
function learnChip(id?: string) {
  const n = nodeOf(id);
  if (!n || S.lessons[n.id]) return "";
  return `<div class="lf-learn">${icon("learn", { size: 18, color: "#5B5BD6" })}<span>${t("lf.learnChip", { code: n.code, hook: tx(n.hook) })}</span>${n.lesson ? `<button class="tw-chip" onclick="A.townLearn('${n.id}')">${t("tw.learn")}</button>` : `<em>${t("c.soon")} · ${n.day}</em>`}</div>`;
}
const head = (title: string, sub = "") => `<div class="lf-h"><h3>${title}</h3>${sub ? `<span>${sub}</span>` : ""}<button class="lf-x" onclick="A.townSheetClose()" aria-label="${esc(t("c.close"))}">${icon("close", { size: 20 })}</button></div>`;

/* ---- HUD: month + next step + mood, and the phone button ---- */
function hud() {
  const el = $("#twLife"), ph = $("#twPhone"), L = life();
  if (!el || !ph) return;
  el.hidden = !L; ph.hidden = !L;
  if (!L) return;
  const owner = !!L.biz && !L.biz.closed;
  const next = owner ? (!L.biz!.decided ? t("bz.next.shop") : !L.plan ? t("lf.next.market") : t("lf.next.home")) : !L.worked ? t("lf.next.work") : !L.plan ? t("lf.next.market") : t("lf.next.home");
  el.innerHTML = `<b>${t("lf.month", { m: L.month })}</b><span>${next}</span><i class="lf-mood" title="${esc(t("lf.mood"))}" style="--m:${L.mood}%">${icon("heart", { size: 14, color: L.mood < 30 ? "#EF4E4E" : "#F7867A" })}${Math.round(L.mood)}</i>`;
}
townHooks.hud = hud;

/* ---- starting a life ---- */
function intro() {
  say("Alti Lion", t("lf.intro"), [[t("lf.start"), "A.lifeStart()"]], "#5B5BD6");
}
function lifeStart() {
  const g = ensureGame();
  g.life = newLife(g.cash);
  g.stage = "staff"; // employee outfit: shirt + purple tie (13.3)
  g.history = [netWorth(g.life)];
  getTown()?.setLook(g.look, g.stage);
  persist();
  townTalkClose();
  say("Alti Lion", t("lf.started"), [], "#5B5BD6");
}
/** Play tab → "My Life": open the town (and offer to start if needed). */
let pendingIntro = false;
function playLife() { pendingIntro = !life(); (window as any).A.goTown(); }
townHooks.arrive = () => {
  const tw = getTown(); if (tw && life()) tw.setRide(life()!.vehicle);
  if (pendingBiz) { pendingBiz = false; setTimeout(startBizScenario, noMotion() ? 0 : 1000); return; }
  if (pendingIntro) { pendingIntro = false; setTimeout(intro, noMotion() ? 0 : 1000); }
};

/* ---- doors ---- */
townHooks.door = (b) => {
  const L = life();
  if (!L) { if (b.id === "office" || b.id === "dealer") { intro(); return true; } if (b.id === "shop") { say(tx(b.name), t("bz.needLife"), [[t("lf.start"), "A.lifeStart()"]], "#F5A524"); return true; } return false; }
  switch (b.id) {
    case "shop": shop(); return true;
    case "office": if (L.biz && !L.biz.closed) { say(t("lf.office"), t("bz.quit"), [], "#3D7BF5"); return true; } office(); return true;
    case "market": market(); return true;
    case "bank": bank(); return true;
    case "clinic": clinic(); return true;
    case "dealer": dealer(); return true;
    case "home": home(); return true;
  }
  return false;
};

/* ---- Office: this month's decision ---- */
const nextCase = (L: Life): Case | undefined => CASES.find((c) => !L.cases.includes(c.id));
function office() {
  const L = life()!;
  if (L.worked) { say(t("lf.office"), t("lf.worked"), [], "#3D7BF5"); return; }
  const c = nextCase(L);
  if (!c) { L.worked = true; persist(); say(t("lf.office"), t("lf.noCase"), [], "#3D7BF5"); return; }
  townSheet(`${head(tx(c.title), `${t("lf.month", { m: L.month })} · ${c.year}`)}
    ${learnChip(c.lesson)}
    <p class="lf-setup">${esc(tx(c.setup))}</p>
    <div class="lf-opts">${c.opts.map((o, i) => `<button class="lf-opt" onclick="A.lifeChoose(${i})"><b>${"ABC"[i]}</b><span>${esc(tx(o.t))}</span></button>`).join("")}</div>
    <p class="tw-note">${t("lf.chooseNote")}</p>`);
}
function lifeChoose(i: number) {
  const L = life(); if (!L) return;
  const c = nextCase(L); if (!c) return;
  const o = c.opts[i], fx = o.fx, notes: string[] = [];
  if (fx.autoSave != null) L.autoSave = fx.autoSave;
  if (fx.mood) L.mood = clamp(L.mood + fx.mood, 0, 100);
  const take = (amt: number) => { const a = Math.min(amt, L.cash + L.savings); if (L.cash < a) withdraw(L, a - L.cash); L.cash -= a; return a; };
  if (fx.cash) { if (fx.cash < 0) take(-fx.cash); else L.cash += fx.cash; }
  if (fx.scam) L.scam = { amount: take(fx.scam), at: L.month };
  if (fx.bond) L.bond = { amount: take(fx.bond), at: L.month };
  if (fx.buy) { const err = buy(L, fx.buy, fx.loan || null); if (err) notes.push(t("lf.err." + err)); else { getTown()?.setRide(L.vehicle); notes.push(t("lf.bought", { what: t("lf.it." + fx.buy) })); } }
  if (fx.bnpl) L.loans.push({ id: "bnpl-" + L.month, what: "phone", left: fx.bnpl, kind: "fixed", rate: 0, months: 4 });
  const good = GOOD.includes(o.r);
  if (good) L.good += 1;
  L.cases.push(c.id); L.worked = true;
  persist();
  if (good && !noMotion() && o.r === "!!") confetti();
  townSheet(`${head(tx(c.title), c.year)}
    <div class="lf-rate"><span class="lf-badge" style="background:${RCOL[o.r]}">${o.r}</span><div><b>${t("lf.r." + o.r)}</b><p>${esc(tx(o.t))}</p></div></div>
    <p class="lf-why">${esc(tx(o.why))}</p>
    ${notes.map((n) => `<p class="lf-noteok">${esc(n)}</p>`).join("")}
    <h4>${t("lf.views")}</h4>
    <div class="lf-views">${c.views.map(([w, s]) => `<div><b>${esc(tx(w))}</b><span>${esc(tx(s))}</span></div>`).join("")}</div>
    <h4>${t("lf.story")}</h4><p class="lf-story">${esc(tx(c.story))}</p>
    <p class="tw-note">${t("lf.aiNote")}</p>
    <button class="btn good" onclick="A.townSheetClose()">${t("lf.cont")}</button>`);
}

/* ---- Market: the month's spending plan ---- */
function market() {
  const L = life()!;
  const k = Math.pow(1.035, (L.month - 1) / 12);
  townSheet(`${head(t("lf.marketT"), t("lf.month", { m: L.month }))}
    ${learnChip("p-budget")}
    <p class="tw-note">${t("lf.marketNote")}</p>
    <div class="lf-plans">${(Object.keys(PLANS) as Plan[]).map((p) => { const P = PLANS[p]; return `<button class="lf-plan${L.plan === p ? " on" : ""}" onclick="A.lifePlan('${p}')"><b>${t("lf.plan." + p)}</b><span>${t("lf.needs")} ${short(P.needs * k)} · ${t("lf.wants")} ${short(P.wants * k)}</span><i>${t("lf.mood")} ${P.mood > 0 ? "+" : ""}${P.mood}</i></button>`; }).join("")}</div>
    <div class="lf-fixed">${t("lf.fixedCosts")}: <b>${short(monthlyCosts({ ...L, plan: L.plan || "balanced" }))}</b> / ${t("lf.salary")} <b>${short(L.salary)}</b></div>`);
}
function lifePlan(p: Plan) { const L = life(); if (!L) return; L.plan = p; persist(); townSheetClose(); minitoast(t("lf.planSet", { p: t("lf.plan." + p) })); }

/* ---- Bank: savings, auto-save, loans, credit score ---- */
function bank() {
  const L = life()!, m = L.month;
  const loans = L.loans.map((l) => `<div class="lf-row"><span>${t("lf.loanOf", { what: t("lf.it." + l.what) })} · ${t("lf.kind." + l.kind)} ${loanRate(l, m).toFixed(1)}%</span><b>${short(l.left)}</b><em>${t("lf.perMonth", { v: short(payment(l, m)) })}</em></div>`).join("") || `<p class="tw-note">${t("lf.noLoans")}</p>`;
  townSheet(`${head(t("lf.bankT"), t("lf.month", { m }))}
    ${learnChip("p-inflation")}
    <div class="lf-row"><span>${t("lf.cash")}</span><b>${money(L.cash)}</b></div>
    <div class="lf-row"><span>${t("lf.savings")} · ${depositRate(m).toFixed(1)}%/${t("lf.yr")}</span><b>${money(L.savings)}</b></div>
    <div class="lf-btns"><button class="tw-chip" onclick="A.lifeBank(1,1000000)">${t("lf.dep")} 1tr</button><button class="tw-chip" onclick="A.lifeBank(1,-1)">${t("lf.depAll")}</button><button class="tw-chip" onclick="A.lifeBank(-1,1000000)">${t("lf.wd")} 1tr</button><button class="tw-chip" onclick="A.lifeBank(-1,-1)">${t("lf.wdAll")}</button></div>
    <div class="tw-row"><span>${t("lf.autoSave")}</span><div>${[0, 0.1, 0.2, 0.3].map((a) => `<button class="tw-chip${Math.abs(L.autoSave - a) < 0.01 ? " on" : ""}" onclick="A.lifeAuto(${a})">${a * 100}%</button>`).join("")}</div></div>
    <h4>${t("lf.loans")}</h4>${loans}
    ${L.loans.some((l) => l.kind === "card") ? `<button class="tw-chip" onclick="A.lifeCard()">${t("lf.payCard")}</button>` : ""}
    <div class="lf-score"><span>${t("lf.score")}</span><div class="lf-bar"><i style="width:${((L.score - 300) / 550) * 100}%"></i></div><b>${L.score}</b></div>
    <p class="tw-note">${t("lf.scoreNote")}</p>
    <div class="lf-cb">${icon("percent", { size: 18, color: "#8B6CF0" })} ${t("lf.policy", { r: policyRate(m).toFixed(1), f: floatRate(m).toFixed(1), x: FIXED_RATE.toFixed(1) })}</div>`);
}
function lifeBank(dir: number, amt: number) {
  const L = life(); if (!L) return;
  if (dir > 0) deposit(L, amt < 0 ? L.cash : amt); else withdraw(L, amt < 0 ? L.savings : amt);
  persist(); bank();
}
function lifeAuto(a: number) { const L = life(); if (!L) return; L.autoSave = a; persist(); bank(); }
function lifeCard() { const L = life(); if (!L) return; payOffCard(L); persist(); bank(); }

/* ---- Clinic: insurance ---- */
function clinic() {
  const L = life()!;
  townSheet(`${head(t("lf.clinicT"))}
    ${learnChip("p-salary")}
    <p class="lf-setup">${t("lf.insText", { p: short(INSURANCE) })}</p>
    <button class="btn ${L.insured ? "ghost" : "good"}" onclick="A.lifeIns()">${L.insured ? t("lf.insOff") : t("lf.insOn")}</button>`);
}
function lifeIns() { const L = life(); if (!L) return; L.insured = !L.insured; persist(); clinic(); }

/* ---- Homes & rides (13.4: assets vs liabilities, unlock by career stage) ---- */
function dealer() {
  const L = life()!, g = ensureGame(), stage = STAGE_N[g.stage] ?? 0;
  const card = (it: Item) => {
    const cur = (it.kind === "home" ? L.housing : L.vehicle) === it.id, locked = it.stage > stage;
    const o = L.owned.find((x) => x.id === it.id);
    const price = it.price ? short(it.price) : it.rent ? `${short(it.rent)}/${t("lf.mo")}` : t("lf.free");
    const dep = it.dep ? `<i class="${it.dep < 0 ? "neg" : "pos"}">${it.dep < 0 ? "▼" : "▲"} ${Math.abs(it.dep * 100).toFixed(1)}%/${t("lf.mo")}</i>` : "";
    let btns = "";
    if (cur) btns = `<em>${t("lf.current")}${o ? " · " + t("lf.worth", { v: short(o.value) }) : ""}</em>${o ? `<button class="tw-chip" onclick="A.lifeSell('${it.kind}')">${t("lf.sell")}</button>` : ""}`;
    else if (locked) btns = `<em>${icon("lock", { size: 14 })} ${t("lf.lockStage." + it.stage)}</em>`;
    else if (!it.price) btns = `<button class="tw-chip" onclick="A.lifeBuy('${it.id}','')">${t(it.kind === "home" ? "lf.moveIn" : "lf.use")}</button>`;
    else btns = `<button class="tw-chip" onclick="A.lifeBuy('${it.id}','')">${t("lf.payCash")}</button><button class="tw-chip" onclick="A.lifeBuy('${it.id}','fixed')">${t("lf.instFixed", { r: FIXED_RATE.toFixed(1) })}</button><button class="tw-chip" onclick="A.lifeBuy('${it.id}','float')">${t("lf.instFloat", { r: floatRate(L.month).toFixed(1) })}</button>`;
    return `<div class="lf-item${cur ? " on" : ""}${locked ? " locked" : ""}"><div class="lf-it-h"><b>${t("lf.it." + it.id)}</b><span>${price}</span></div><div class="lf-it-m"><span>${t("lf.upkeep")} ${short(it.upkeep)}/${t("lf.mo")}</span>${dep}<span>${t("lf.mood")} ${it.mood > 0 ? "+" : ""}${it.mood}</span></div><div class="lf-it-b">${btns}</div></div>`;
  };
  townSheet(`${head(t("lf.dealerT"))}
    <div class="lf-tip">${lion(40, "wow")}<p>${t("lf.assetTip")}</p></div>
    <h4>${t("lf.homes")}</h4>${ITEMS.filter((i) => i.kind === "home").map(card).join("")}
    <h4>${t("lf.rides")}</h4>${ITEMS.filter((i) => i.kind === "ride").map(card).join("")}`);
}
let confirmFor = "";
function lifeBuy(id: string, loan: string, sure = false) {
  const L = life(); if (!L) return;
  const it = item(id);
  // Alti Lion warns before a purchase that eats more than 30% of the pay every month (13.4-2)
  const est = it.upkeep + (it.rent || 0) + (loan ? payment({ id: "x", what: id, left: Math.max(0, it.price - L.cash - L.savings), kind: loan as any, rate: FIXED_RATE, months: 24 }, L.month) : 0);
  if (!sure && confirmFor !== id + loan && est > L.salary * 0.3) {
    confirmFor = id + loan;
    townSheet(`${head(t("lf.it." + id))}<div class="lf-tip">${lion(52, "sad")}<p>${t("lf.warnBuy", { v: short(est), p: Math.round((est / L.salary) * 100) })}</p></div>
      <div class="lf-btns"><button class="btn ghost" onclick="A.lifeDealer()">${t("lf.cancel")}</button><button class="btn good" onclick="A.lifeBuy('${id}','${loan}',true)">${t("lf.buyAnyway")}</button></div>`);
    return;
  }
  confirmFor = "";
  const err = buy(L, id, (loan || null) as any);
  if (err) { minitoast(t("lf.err." + err)); dealer(); return; }
  if (it.kind === "ride") getTown()?.setRide(L.vehicle);
  persist();
  minitoast(t("lf.bought", { what: t("lf.it." + id) }));
  dealer();
}
function lifeSell(kind: "home" | "ride") { const L = life(); if (!L) return; sell(L, kind); if (kind === "ride") getTown()?.setRide(L.vehicle); persist(); dealer(); }

/* ---- Home: end the month ---- */
function home() {
  const L = life()!;
  const owner = !!L.biz && !L.biz.closed;
  const todo = [[owner ? t("bz.td.shop") : t("lf.td.work"), owner ? L.biz!.decided : L.worked], [t("lf.td.market"), !!L.plan]] as [string, boolean][];
  townSheet(`${head(t("lf.homeT"), t("lf.month", { m: L.month }))}
    <div class="lf-todo">${todo.map(([l, ok]) => `<span class="${ok ? "ok" : ""}">${icon(ok ? "check" : "clock", { size: 16 })} ${l}</span>`).join("")}</div>
    ${!owner && !L.worked ? `<p class="lf-warn">${t("lf.warnNoWork")}</p>` : ""}${!L.plan ? `<p class="tw-note">${t("lf.defaultPlan")}</p>` : ""}
    <div class="lf-btns"><button class="btn good" onclick="A.lifeEnd()">${t("lf.endMonth")}</button><button class="btn ghost" onclick="A.townWardrobe()">${t("tw.wardrobe")}</button></div>`);
}
function lifeEnd() {
  const L = life(); if (!L) return;
  const g = ensureGame(), prevRate = policyRate(L.month);
  const rep = endMonth(L);
  g.history = [...(g.history || []), rep.nw].slice(-36);
  (g as any).rank = rep.rank;
  persist();
  showReport(rep, policyRate(L.month) > prevRate || policyRate(rep.m) > policyRate(rep.m - 1));
}
function tipFor(L: Life, rep: Report, hike: boolean) {
  if (rep.bankrupt) return t("bz.tip.bankrupt");
  if (rep.pl) {
    if (rep.pl.profit > 0 && rep.pl.netCash < 0) return t("bz.tip.cash");
    if (rep.pl.profit < 0 && L.biz && L.biz.price <= 25_000) return t("bz.tip.cheap", { be: breakEven(L.biz) });
    if (hike && L.biz?.loans.some((l) => l.kind === "float")) return t("lf.tip.float", { r: policyRate(rep.m).toFixed(1) });
    if (rep.pl.profit < 0 && rep.m - (L.biz?.open || 0) < 2) return t("bz.tip.ramp");
  }
  if (rep.lines.some((l) => l.k === "lf.r.short")) return t("lf.tip.short");
  if (hike && L.loans.some((l) => l.kind === "float")) return t("lf.tip.float", { r: policyRate(rep.m).toFixed(1) });
  if (rep.event === "sick" && !L.insured) return t("lf.tip.noIns");
  if (rep.lines.some((l) => l.k === "lf.r.scam" || l.k === "lf.r.bond")) return t("lf.tip.lost");
  if (rep.burnout) return t("lf.tip.burnout");
  const dep = rep.lines.find((l) => l.k === "lf.r.dep");
  if (dep) return t("lf.tip.dep", { v: short(-dep.v) });
  if (L.autoSave === 0) return t("lf.tip.auto");
  return rep.dnw >= 0 ? t("lf.tip.good", { v: short(rep.dnw) }) : t("lf.tip.down");
}
function showReport(rep: Report, hike: boolean) {
  const L = life()!;
  const rows = rep.lines.map((l) => {
    const vars: Record<string, string | number> = { ...(l.vars || {}) };
    if (typeof vars.what === "string") vars.what = t("lf.it." + vars.what);
    if (typeof vars.amt === "number") vars.amt = short(vars.amt);
    return `<div class="lf-row"><span>${t(l.k, vars)}</span>${l.v ? `<b class="${l.v > 0 ? "pos" : "neg"}">${sign(l.v)}</b>` : ""}</div>`;
  }).join("");
  townSheet(`${head(t("lf.reportT", { m: rep.m }))}
    ${hike ? `<p class="lf-warn">${t("lf.hike", { r: policyRate(rep.m).toFixed(1) })}</p>` : ""}
    ${rep.pl ? plHTML(rep.pl) : ""}
    ${rep.pl ? `<h4>${t("bz.personal")}</h4>` : ""}
    ${rows}
    <div class="lf-total"><span>${t("top.netWorth")}</span><b>${money(rep.nw)}</b><i class="${rep.dnw >= 0 ? "pos" : "neg"}">${sign(rep.dnw)}</i></div>
    <div class="lf-total"><span>${t("lf.rank")}</span><b>#${rep.rank} / ${PERSONAS.length + 1}</b></div>
    ${rep.raise ? `<p class="lf-noteok">${t("lf.raise", { v: short(L.salary) })}</p>` : ""}
    <div class="lf-tip">${lion(48, rep.dnw >= 0 ? "happy" : "sad")}<p>${tipFor(L, rep, hike)}</p></div>
    <div class="lf-btns"><button class="btn ghost" onclick="A.lifePhone('rank')">${t("lf.seeRank")}</button><button class="btn good" onclick="A.townSheetClose()">${t("lf.nextMonth")}</button></div>`);
}

/* ---- the milk-tea kiosk (Business mode) ---- */
function plHTML(pl: PL) {
  const r = (k: string, v: number, cls = "") => `<div class="lf-row ${cls}"><span>${t(k)}</span><b class="${v > 0 ? "pos" : v < 0 ? "neg" : ""}">${sign(v)}</b></div>`;
  return `<h4>${t("bz.pl")}</h4>
    <p class="tw-note">${t("bz.cups", { n: pl.cups.toLocaleString(lang() === "vi" ? "vi-VN" : "en-US") })}${pl.contractCups ? " · " + t("bz.cupsC", { n: pl.contractCups }) : ""}</p>
    ${r("bz.revenue", pl.revenue)}${r("bz.variable", -pl.variable)}${r("bz.fixed", -pl.fixed)}${r("bz.dep", -pl.dep)}${r("bz.interest", -pl.interest)}${r("bz.ownerPay", -pl.ownerPay)}
    <div class="lf-total"><span>${t("bz.profit")}</span><b class="${pl.profit >= 0 ? "pos" : "neg"}">${sign(pl.profit)}</b></div>
    <h4>${t("bz.cf")}</h4>
    ${r("bz.cashIn", pl.cashIn - pl.collected)}${pl.collected ? r("bz.collected", pl.collected) : ""}${r("bz.cashOut", -(pl.cashOut))}
    <div class="lf-total"><span>${t("bz.netCash")}</span><b class="${pl.netCash >= 0 ? "pos" : "neg"}">${sign(pl.netCash)}</b><i>${t("bz.cashEnd", { v: short(pl.cashEnd) })}</i></div>
    ${pl.overdraft ? `<p class="lf-warn">${t("bz.overdraft")}</p>` : ""}${pl.bankrupt ? `<p class="lf-warn">${t("bz.bankrupt")}</p>` : ""}`;
}
function shop() {
  const L = life()!, b = L.biz;
  if (!b || b.closed) { openShop(); return; }
  const m = L.month, last = b.pls[b.pls.length - 1];
  const debtRows = b.loans.map((l) => `<div class="lf-row"><span>${t("bz.loan." + l.kind)} · ${bizRate(l, m).toFixed(1)}%</span><b>${short(l.left)}</b><em>${t("lf.perMonth", { v: short(bizPayment(l, m)) })}</em></div>`).join("") || `<p class="tw-note">${t("lf.noLoans")}</p>`;
  townSheet(`${head(t("bz.shopT"), t("lf.month", { m }))}
    ${learnChip("c-breakeven")}
    <div class="lf-row"><span>${t("bz.shopCash")}</span><b>${money(b.cash)}</b></div>
    <div class="lf-score"><span>${t("bz.love")}</span><div class="lf-bar"><i style="width:${b.love}%"></i></div><b>${Math.round(b.love)}</b></div>
    <h4>${t("bz.price")}</h4>
    <div class="lf-plans">${PRICES.map((p) => `<button class="lf-plan${b.price === p ? " on" : ""}" onclick="A.bizPrice(${p})"><b>${short(p)} / ${t("bz.cup")}</b><span>${t("bz.margin", { v: short(p - b.varCost) })} · ${t("bz.be", { n: Math.ceil(BIZ_FIXED / Math.max(1, p - b.varCost)).toLocaleString(lang() === "vi" ? "vi-VN" : "en-US") })}</span></button>`).join("")}</div>
    <p class="tw-note">${t("bz.priceNote")}</p>
    ${b.decided ? `<p class="lf-noteok">${t("bz.decided")}</p>` : `<button class="btn good" onclick="A.bizCase()">${t("bz.decide")}</button>`}
    ${b.contract ? `<p class="tw-note">${t("bz.contract", { n: b.contract.cups, until: b.contract.until })}</p>` : ""}
    ${b.receivable.length ? `<p class="tw-note">${t("bz.recv", { v: short(b.receivable.reduce((s2, r2) => s2 + r2.amount, 0)) })}</p>` : ""}
    <h4>${t("lf.loans")}</h4>${debtRows}
    ${b.investor ? `<p class="tw-note">${t("bz.investorNote", { p: Math.round(b.investor * 100) })}</p>` : ""}
    ${last ? plHTML(last) : ""}`);
}
function openShop() {
  const L = life()!, own = L.cash + L.savings, can = own >= OWN_MIN, m = L.month;
  const loan = OPEN_COST - OWN_MIN;
  const pay = (rate: number) => short((loan * rate / 1200) / (1 - Math.pow(1 + rate / 1200, -36)));
  townSheet(`${head(t("bz.openT"))}
    ${learnChip("c-breakeven")}${learnChip("c-funding")}
    <p class="lf-setup">${t("bz.openText", { c: short(OPEN_COST), e: short(EQUIP), own: short(OWN_MIN), f: short(BIZ_FIXED) })}</p>
    <div class="lf-row"><span>${t("bz.youHave")}</span><b class="${can ? "pos" : "neg"}">${short(own)}</b></div>
    ${can ? `<div class="lf-opts">
      <button class="lf-opt" onclick="A.bizOpen('fixed')"><b>A</b><span>${t("bz.fundFixed", { v: short(loan), r: BIZ_FIXED_RATE.toFixed(1), p: pay(BIZ_FIXED_RATE) })}</span></button>
      <button class="lf-opt" onclick="A.bizOpen('float')"><b>B</b><span>${t("bz.fundFloat", { v: short(loan), r: bizFloat(m).toFixed(1), p: pay(bizFloat(m)) })}</span></button>
      <button class="lf-opt" onclick="A.bizOpen('investor')"><b>C</b><span>${t("bz.fundInv", { v: short(loan) })}</span></button></div>
      <p class="tw-note">${t("bz.fundNote")}</p>` : `<p class="lf-warn">${t("bz.notEnough", { v: short(OWN_MIN) })}</p>`}`);
}
function bizOpen(how: "fixed" | "float" | "investor") {
  const L = life(); if (!L || (L.biz && !L.biz.closed)) return;
  if (L.cash < OWN_MIN) withdraw(L, OWN_MIN - L.cash);
  if (L.cash < OWN_MIN) return;
  L.cash -= OWN_MIN;
  L.biz = openBiz(L.month, how);
  const g = ensureGame(); g.stage = "owner"; getTown()?.setLook(g.look, g.stage); // apron + green cap
  persist();
  if (!noMotion()) confetti();
  townTalkClose();
  say(t("bz.shopT"), t(how === "investor" ? "bz.openedInv" : "bz.opened"), [[t("bz.goShop"), "A.bizShop()"]], "#F5A524");
}
function bizPrice(p: number) { const b = life()?.biz; if (!b) return; b.price = p; persist(); shop(); }
const nextBizCase = (b: NonNullable<Life["biz"]>): BizCase | undefined => BIZ_CASES.find((c) => !b.cases.includes(c.id));
function bizCase() {
  const L = life()!, b = L.biz; if (!b) return;
  const c = nextBizCase(b);
  if (!c) { b.decided = true; persist(); say(t("bz.shopT"), t("bz.noCase"), [], "#F5A524"); return; }
  townSheet(`${head(tx(c.title), t("lf.month", { m: L.month }))}
    ${learnChip(c.lesson)}
    <p class="lf-setup">${esc(tx(c.setup))}</p>
    <div class="lf-opts">${c.opts.map((o, i) => `<button class="lf-opt" onclick="A.bizChoose(${i})"><b>${"ABC"[i]}</b><span>${esc(tx(o.t))}</span></button>`).join("")}</div>
    <p class="tw-note">${t("bz.chooseNote")}</p>`);
}
function bizChoose(i: number) {
  const L = life(); const b = L?.biz; if (!L || !b) return;
  const c = nextBizCase(b); if (!c) return;
  const o = c.opts[i], fx = o.fx, m = L.month;
  if (fx.contract) b.contract = { cups: fx.contract.cups, price: fx.contract.price, until: m + fx.contract.months - 1 };
  if (fx.cash) b.cash += fx.cash;
  if (fx.love) b.love = clamp(b.love + fx.love, 0, 100);
  if (fx.varCost) b.varCost = fx.varCost;
  if (fx.price) b.price = fx.price;
  if (fx.loan) b.loans.push({ id: "biz-" + c.id, what: "shop", left: fx.loan.amount, kind: fx.loan.kind, rate: fx.loan.kind === "fixed" ? BIZ_FIXED_RATE : 0, months: 24 });
  if (fx.equip) b.equip += fx.equip;
  const good = o.r === "!!" || o.r === "!"; // business stage: you need excellent moves (6.1)
  if (good) b.good += 1;
  b.cases.push(c.id); b.decided = true; L.worked = true;
  persist();
  if (o.r === "!!" && !noMotion()) confetti();
  townSheet(`${head(tx(c.title))}
    <div class="lf-rate"><span class="lf-badge" style="background:${RCOL[o.r]}">${o.r}</span><div><b>${t("lf.r." + o.r)}</b><p>${esc(tx(o.t))}</p></div></div>
    <p class="lf-why">${esc(tx(o.why))}</p>
    <h4>${t("lf.views")}</h4>
    <div class="lf-views">${c.views.map(([w, s2]) => `<div><b>${esc(tx(w))}</b><span>${esc(tx(s2))}</span></div>`).join("")}</div>
    <h4>${t("lf.story")}</h4><p class="lf-story">${esc(tx(c.story))}</p>
    <p class="tw-note">${t("lf.aiNote")}</p>
    <button class="btn good" onclick="A.bizShop()">${t("lf.cont")}</button>`);
}
/** Play tab → "My Business": a ready-made start — 3 years into work with 30M saved — in front of the shop. */
let pendingBiz = false;
function playBiz() { pendingBiz = true; (window as any).A.goTown(); }
function startBizScenario() {
  const g = ensureGame();
  if (!life()) {
    g.life = newLife(30_000_000); // scenario: 25 years old, 30M saved after 3 years of work
    g.stage = "staff"; g.history = [netWorth(g.life)];
    persist();
  }
  const tw = getTown(), d = tw?.map.doors.find((x) => x.id === "shop");
  if (tw && d) tw.teleport(d.x, d.z + 0.6);
  shop();
}
function bizShop() { townTalkClose(); shop(); }

/* ---- phone: net worth breakdown + ranking (13.4-5: ranked by net worth, not by things) ---- */
function lifePhone(tab: "nw" | "rank" = "nw") {
  const L = life(); if (!L) return;
  const nw = netWorth(L);
  const tabs = `<div class="seg lf-seg"><button class="${tab === "nw" ? "on" : ""}" onclick="A.lifePhone('nw')">${t("top.netWorth")}</button><button class="${tab === "rank" ? "on" : ""}" onclick="A.lifePhone('rank')">${t("lf.rank")}</button></div>`;
  let body = "";
  if (tab === "nw") {
    const own = L.owned.map((o) => `<div class="lf-row"><span>${t("lf.it." + o.id)}</span><b>${short(o.value)}</b></div>`).join("")
      + (paper(L) ? `<div class="lf-row"><span>${t("lf.paper")}</span><b>${short(paper(L))}</b></div>` : "")
      + (L.biz && !L.biz.closed ? `<div class="lf-row"><span>${t("bz.value", { p: Math.round((1 - L.biz.investor) * 100) })}</span><b>${short(bizValue(L.biz))}</b></div>` : "");
    body = `<div class="lf-row"><span>${t("lf.cash")}</span><b>${short(L.cash)}</b></div><div class="lf-row"><span>${t("lf.savings")}</span><b>${short(L.savings)}</b></div>${own}
      <div class="lf-row"><span>${t("lf.debts")}</span><b class="neg">${debt(L) ? "−" + short(debt(L)) : "0"}</b></div>
      <div class="lf-total"><span>${t("top.netWorth")}</span><b>${money(nw)}</b></div>
      <p class="tw-note">${t("lf.nwNote", { a: short(ownedValue(L)) })}</p>
      <div class="lf-row"><span>${t("lf.salary")}</span><b>${short(L.salary)}</b></div><div class="lf-row"><span>${t("lf.score")}</span><b>${L.score}</b></div><div class="lf-row"><span>${t("lf.policyShort")}</span><b>${policyRate(L.month).toFixed(1)}%</b></div>`;
  } else {
    const rows = [...PERSONAS.map((p) => ({ n: p.name, s: tx(p.style), v: L.rivals[p.id], me: false })), { n: S.p.name || t("lf.you"), s: t("lf.you"), v: nw, me: true }].sort((a, b) => b.v - a.v);
    body = `<ol class="lf-rank">${rows.map((r) => `<li class="${r.me ? "me" : ""}"><b>${esc(r.n)}</b><span>${esc(r.s)}</span><i>${short(r.v)}</i></li>`).join("")}</ol><p class="tw-note">${t("lf.rankNote")}</p>`;
  }
  townSheet(`${head(t("lf.phone"), t("lf.month", { m: L.month }))}${tabs}${body}`);
}
function lifeDealer() { confirmFor = ""; dealer(); }

reg({ bizOpen, bizPrice, bizCase, bizChoose, playBiz, bizShop, lifeStart, lifeChoose, lifePlan, lifeBank, lifeAuto, lifeCard, lifeIns, lifeBuy, lifeSell, lifeEnd, lifePhone, lifeDealer, playLife, townSheetClose, townWardrobe });
