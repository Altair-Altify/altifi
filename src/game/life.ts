/* ---------- Personal mode "My Life" — the monthly money engine (design doc 6.3-1, 6.6, 13.4) ----------
 * Pure logic, no UI. One month = go to work (one decision) → choose a spending plan at the market → bank
 * (save / borrow) → go home to end the month (pay everything, see the report and the classmates' ranking).
 * Net worth = cash + savings + market value of what you own − what you still owe (13.4: ranking by net worth,
 * a vehicle loses value and costs money every month, a home can gain value). Interest rates follow a simulated
 * central bank that raises rates mid-year (like 2022), so a floating-rate loan really costs more (lesson M2).
 * ⚠️ All prices, rates and wages are simplified "near-real" game parameters — to be checked before submission. */
import { PERSONAS } from "./npc";

export type Plan = "lean" | "balanced" | "loose";
export interface Loan { id: string; what: string; left: number; kind: "fixed" | "float" | "card"; rate: number; months: number }
export interface Owned { id: string; value: number }
export interface Line { k: string; v: number; vars?: Record<string, string | number> }
export interface Report { m: number; lines: Line[]; nw: number; dnw: number; event?: string; raise?: boolean; burnout?: boolean; rank: number }
export interface Life {
  month: number; // 1-based, the month you are living now
  cash: number; savings: number; mood: number; score: number;
  salary: number; // take-home pay per month
  plan: Plan | null; // spending plan chosen for this month
  worked: boolean; // went to work (made this month's decision)
  good: number; // good-or-better decisions so far
  cases: string[]; // decisions already made (case ids)
  autoSave: number; // share of pay moved to savings on payday (0–0.3)
  housing: string; vehicle: string; insured: boolean;
  owned: Owned[]; loans: Loan[];
  scam?: { amount: number; at: number }; // money put into a "never loses" fund
  bond?: { amount: number; at: number }; // a "savings product" that was really a corporate bond
  rivals: Record<string, number>;
  reports: Report[];
}

/* ---- market (simulated, 1 month per step) ---- */
/** Policy rate by month: low for 4 months, then two hikes (like the State Bank of Vietnam, Sep–Oct 2022). */
export const policyRate = (m: number) => (m <= 4 ? 4.0 : m <= 6 ? 5.0 : 6.0);
export const depositRate = (m: number) => policyRate(m) + 1.6; // 12-month savings, %/yr
export const floatRate = (m: number) => policyRate(m) + 6.5; // consumer loan, floating, %/yr
export const FIXED_RATE = 12.5; // consumer loan, fixed for the whole term, %/yr
export const CARD_RATE = 30; // credit card debt, %/yr
export const INFLATION = 3.5; // %/yr — prices of food & things go up a little every month
const priceK = (m: number) => Math.pow(1 + INFLATION / 100, (m - 1) / 12);

/* ---- what you can live in / ride (13.4 tiers; personal stage only, bigger ones unlock with your career) ---- */
export interface Item { id: string; kind: "home" | "ride"; price: number; rent?: number; upkeep: number; dep: number; mood: number; stage: 0 | 1 | 2 | 3 }
// dep = value change per month (negative = loses value); upkeep = fuel, repairs, parking, insurance… per month
export const ITEMS: Item[] = [
  { id: "room", kind: "home", price: 0, rent: 2_500_000, upkeep: 300_000, dep: 0, mood: 0, stage: 0 },
  { id: "flatRent", kind: "home", price: 0, rent: 5_500_000, upkeep: 400_000, dep: 0, mood: 8, stage: 0 },
  { id: "flat", kind: "home", price: 1_600_000_000, upkeep: 900_000, dep: 0.003, mood: 12, stage: 1 },
  { id: "townhouse", kind: "home", price: 4_500_000_000, upkeep: 2_000_000, dep: 0.004, mood: 16, stage: 2 },
  { id: "villa", kind: "home", price: 15_000_000_000, upkeep: 8_000_000, dep: 0.004, mood: 20, stage: 3 },
  { id: "walk", kind: "ride", price: 0, upkeep: 200_000, dep: 0, mood: -3, stage: 0 }, // bus pass
  { id: "bike", kind: "ride", price: 3_000_000, upkeep: 50_000, dep: -0.012, mood: 1, stage: 0 },
  { id: "scooter", kind: "ride", price: 35_000_000, upkeep: 900_000, dep: -0.015, mood: 5, stage: 0 },
  { id: "carSmall", kind: "ride", price: 550_000_000, upkeep: 6_000_000, dep: -0.012, mood: 9, stage: 1 },
  { id: "carSport", kind: "ride", price: 6_000_000_000, upkeep: 40_000_000, dep: -0.015, mood: 14, stage: 3 },
];
export const item = (id: string) => ITEMS.find((i) => i.id === id)!;
export const PLANS: Record<Plan, { needs: number; wants: number; mood: number }> = {
  lean: { needs: 3_000_000, wants: 500_000, mood: -4 },
  balanced: { needs: 3_000_000, wants: 1_500_000, mood: 3 },
  loose: { needs: 3_400_000, wants: 3_500_000, mood: 9 },
};
export const INSURANCE = 180_000; // health + accident, per month

/** Take-home pay: 10M gross − 10.5% compulsory insurance (8% social, 1.5% health, 1% unemployment); no personal
 * income tax at this level after the personal deduction. ⚠️ check the current PIT law (13.2d P5). */
export const START_SALARY = 8_950_000;

export function newLife(startCash: number): Life {
  return {
    month: 1, cash: startCash, savings: 0, mood: 70, score: 650, salary: START_SALARY, plan: null, worked: false, good: 0, cases: [],
    autoSave: 0, housing: "room", vehicle: "walk", insured: false, owned: [], loans: [],
    rivals: Object.fromEntries(PERSONAS.map((p) => [p.id, startCash])), reports: [],
  };
}

export const ownedValue = (L: Life) => L.owned.reduce((s, o) => s + o.value, 0);
export const debt = (L: Life) => L.loans.reduce((s, l) => s + l.left, 0);
/** Money in the "never-lose" fund or the counter bond counts at face value — on paper — until it collapses. */
export const paper = (L: Life) => (L.scam?.amount || 0) + (L.bond?.amount || 0);
export const netWorth = (L: Life) => Math.round(L.cash + L.savings + ownedValue(L) + paper(L) - debt(L));
export const loanRate = (l: Loan, m: number) => (l.kind === "float" ? floatRate(m) : l.rate);
/** Monthly instalment (annuity) at the current rate for the months left. Card debt: 5% minimum. */
export function payment(l: Loan, m: number) {
  if (l.kind === "card") return Math.min(l.left, Math.max(200_000, l.left * 0.05) + (l.left * CARD_RATE) / 1200);
  const r = loanRate(l, m) / 1200, n = Math.max(1, l.months);
  return r === 0 ? l.left / n : (l.left * r) / (1 - Math.pow(1 + r, -n));
}
export const monthlyCosts = (L: Life) => {
  const h = item(L.housing), v = item(L.vehicle), p = PLANS[L.plan || "balanced"];
  return Math.round((h.rent || 0) + h.upkeep + v.upkeep + (p.needs + p.wants) * priceK(L.month) + (L.insured ? INSURANCE : 0) + L.loans.reduce((s, l) => s + payment(l, L.month), 0));
};

/* ---- buying / selling / banking ---- */
export function canBuy(L: Life, it: Item, stage: number) { return it.stage <= stage; }
/** Buy with cash (+ savings), or borrow what that doesn't cover: needs a credit score ≥ 600; a loan covers up to
 * 100% of a vehicle (dealer "0-down" instalments) or 70% of a home. */
export function buy(L: Life, id: string, loan: "fixed" | "float" | null, months = 24): string | null {
  const it = item(id);
  if (it.price === 0) { sellCurrent(L, it.kind); if (it.kind === "home") L.housing = id; else L.vehicle = id; return null; }
  if ((it.kind === "home" ? L.housing : L.vehicle) === id) return "have";
  const need = it.price, cur = L.owned.find((x) => x.id === (it.kind === "home" ? L.housing : L.vehicle));
  const curNet = cur ? cur.value - L.loans.filter((l) => l.what === cur.id).reduce((s, l) => s + l.left, 0) : 0; // trade-in
  const have = L.cash + L.savings + curNet;
  let fromLoan = 0;
  if (loan) {
    if (L.score < 600) return "lowScore";
    fromLoan = Math.min(Math.round(need * (it.kind === "ride" ? 1 : 0.7)), Math.max(0, need - have));
    if (fromLoan <= 0) loan = null;
  }
  if (have + fromLoan < need) return "noCash";
  sellCurrent(L, it.kind);
  const pay = need - fromLoan;
  if (L.cash < pay) withdraw(L, pay - L.cash);
  L.cash -= pay;
  if (loan && fromLoan > 0) L.loans.push({ id: "loan-" + id + "-" + L.month, what: id, left: fromLoan, kind: loan, rate: loan === "fixed" ? FIXED_RATE : 0, months });
  L.owned.push({ id, value: need });
  if (it.kind === "home") L.housing = id; else L.vehicle = id;
  return null;
}
/** Selling: you get today's market value (a vehicle sells for less than you paid). Its loan is paid off first. */
function sellCurrent(L: Life, kind: "home" | "ride") {
  const cur = kind === "home" ? L.housing : L.vehicle;
  const o = L.owned.find((x) => x.id === cur);
  if (!o) return;
  L.cash += o.value;
  L.owned = L.owned.filter((x) => x !== o);
  for (const l of L.loans.filter((x) => x.what === cur)) { L.cash -= l.left; }
  L.loans = L.loans.filter((x) => x.what !== cur);
  if (kind === "home") L.housing = "room"; else L.vehicle = "walk";
}
export function sell(L: Life, kind: "home" | "ride") { sellCurrent(L, kind); }
export function deposit(L: Life, amt: number) { amt = Math.max(0, Math.min(amt, L.cash)); L.cash -= amt; L.savings += amt; }
export function withdraw(L: Life, amt: number) { amt = Math.max(0, Math.min(amt, L.savings)); L.savings -= amt; L.cash += amt; }
export function payOffCard(L: Life) { const c = L.loans.find((l) => l.kind === "card"); if (!c) return; const p = Math.min(c.left, L.cash); c.left -= p; L.cash -= p; if (c.left <= 0) L.loans = L.loans.filter((l) => l !== c); }

/* ---- classmates' net worth (13.4: the leaderboard teaches lifestyles) ---- */
function rivalStep(id: string, nw: number, m: number, rnd: () => number) {
  switch (id) {
    case "bao-anh": return nw + 600_000 - 900_000 * rnd(); // spends almost everything
    case "minh-khang": return nw * (1 + 0.065 / 12) + 2_200_000; // saves 20% first, deposit interest
    case "gia-huy": return m === 5 ? nw * 0.35 : nw + 3_000_000 * (rnd() - 0.2); // chases "guaranteed" returns… until the fund collapses
    case "thao-vy": return m < 4 ? nw - 1_500_000 : nw + 1_200_000 * (m - 3); // shop: losses first, then growing profit
    case "duc-tri": return nw * (1 + (0.1 + (rnd() - 0.5) * 0.6) / 12) + 1_800_000; // index fund: bumpy, grows
    case "ngoc-ha": return nw + 1_700_000; // careful, steady
    default: return nw + 300_000 - 700_000 * rnd(); // gamer: top-ups eat the savings
  }
}

/* ---- one month passes (at home) ---- */
export function endMonth(L: Life, rnd: () => number = Math.random): Report {
  const m = L.month, lines: Line[] = [], before = netWorth(L);
  const plan = PLANS[L.plan || "balanced"], h = item(L.housing), v = item(L.vehicle), pk = priceK(m);
  // income
  let pay = L.salary;
  const burnout = L.mood < 30;
  if (!L.worked) { pay = Math.round(pay * 0.5); lines.push({ k: "lf.r.noWork", v: 0 }); } // skipped work: half pay
  L.cash += pay; lines.push({ k: "lf.r.salary", v: pay });
  if (L.autoSave > 0) { const s = Math.round(pay * L.autoSave); L.cash -= s; L.savings += s; lines.push({ k: "lf.r.autoSave", v: -s, vars: { p: Math.round(L.autoSave * 100) } }); }
  // spending
  const needs = Math.round(plan.needs * pk), wants = Math.round(plan.wants * pk);
  L.cash -= needs; lines.push({ k: "lf.r.needs", v: -needs });
  L.cash -= wants; lines.push({ k: "lf.r.wants", v: -wants });
  if (h.rent) { L.cash -= h.rent; lines.push({ k: "lf.r.rent", v: -h.rent }); }
  const up = h.upkeep + v.upkeep; L.cash -= up; lines.push({ k: v.id === "walk" ? "lf.r.bus" : "lf.r.upkeep", v: -up });
  if (L.insured) { L.cash -= INSURANCE; lines.push({ k: "lf.r.insurance", v: -INSURANCE }); }
  // loans (floating ones follow the central bank)
  for (const l of L.loans) {
    const p = Math.round(payment(l, m)), interest = Math.round((l.left * (l.kind === "card" ? CARD_RATE : loanRate(l, m))) / 1200);
    L.cash -= p; l.left = Math.max(0, l.left - (p - interest)); l.months = Math.max(0, l.months - 1);
    lines.push({ k: l.kind === "card" ? "lf.r.card" : "lf.r.loan", v: -p, vars: { rate: (l.kind === "card" ? CARD_RATE : loanRate(l, m)).toFixed(1) } });
  }
  L.loans = L.loans.filter((l) => l.left > 1000);
  // savings interest
  const si = Math.round((L.savings * depositRate(m)) / 1200);
  if (si > 0) { L.savings += si; lines.push({ k: "lf.r.interest", v: si, vars: { rate: depositRate(m).toFixed(1) } }); }
  // things you own change value
  for (const o of L.owned) { const d = Math.round(o.value * item(o.id).dep); o.value += d; if (d) lines.push({ k: d < 0 ? "lf.r.dep" : "lf.r.app", v: d, vars: { what: o.id } }); }
  // surprises (from month 3): illness, broken phone… insurance pays 80% of medical bills
  let event: string | undefined;
  if (m >= 3 && rnd() < 0.3) {
    const ev = rnd() < 0.55 ? "sick" : "phone", cost = ev === "sick" ? 4_000_000 : 3_000_000, paid = ev === "sick" && L.insured ? Math.round(cost * 0.2) : cost;
    L.cash -= paid; event = ev; lines.push({ k: "lf.r.ev." + ev, v: -paid, vars: { cover: L.insured && ev === "sick" ? 80 : 0 } });
  }
  // a "never-loses" fund collapses two months later; the bond freezes
  if (L.scam && m >= L.scam.at + 2) { lines.push({ k: "lf.r.scam", v: -L.scam.amount }); L.scam = undefined; }
  if (L.bond && m >= L.bond.at + 3) { lines.push({ k: "lf.r.bond", v: -L.bond.amount }); L.bond = undefined; }
  // short of cash: emergency fund first, then the credit card (score drops)
  if (L.cash < 0 && L.savings > 0) { const w = Math.min(L.savings, -L.cash); L.savings -= w; L.cash += w; lines.push({ k: "lf.r.useSavings", v: 0, vars: { amt: w } }); }
  if (L.cash < 0) {
    const short = -L.cash; L.cash = 0;
    const card = L.loans.find((l) => l.kind === "card");
    if (card) card.left += short; else L.loans.push({ id: "card", what: "card", left: short, kind: "card", rate: CARD_RATE, months: 0 });
    L.score = Math.max(300, L.score - 45); lines.push({ k: "lf.r.short", v: 0, vars: { amt: short } });
  } else L.score = Math.min(850, L.score + (L.loans.length ? 12 : 6));
  // mood: −6 a month, + what you spend on fun, + where you live and how you get around
  L.mood = Math.max(0, Math.min(100, L.mood - 6 + plan.mood + h.mood * 0.5 + v.mood * 0.5 + (event ? -4 : 0)));
  // a raise every 6 months if you made good decisions and didn't burn out
  let raise = false;
  if (m % 6 === 0 && L.good >= Math.ceil(m / 2) && !burnout) { L.salary = Math.round(L.salary * 1.1 / 10000) * 10000; raise = true; }
  // classmates move too
  for (const p of PERSONAS) L.rivals[p.id] = Math.round(rivalStep(p.id, L.rivals[p.id], m, rnd));
  const nw = netWorth(L);
  const rank = 1 + PERSONAS.filter((p) => L.rivals[p.id] > nw).length;
  const rep: Report = { m, lines, nw, dnw: nw - before, event, raise, burnout, rank };
  L.reports.push(rep);
  if (L.reports.length > 24) L.reports.shift();
  L.month += 1; L.plan = null; L.worked = false;
  return rep;
}
