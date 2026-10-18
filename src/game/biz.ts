/* ---------- Business mode "My Business" — the milk-tea kiosk engine (design doc 6.3-2, 13.2d ② one running story) ----------
 * Pure logic. You open a kiosk (lesson B1 "your first stall"), fund it with a bank loan or an investor (B4), set a
 * price every month (B2-lite: demand falls as the price rises, customer love follows the price), make one decision
 * at the shop, and at month end see two different reports: profit & loss (B1) and cash flow (B3) — a big contract
 * paid in 60 days can make you profitable on paper and broke in cash. Loan rates follow the simulated central
 * bank (M2). Too much overdraft → bankruptcy (6.1: losing a lot = game over for that run, with a summary).
 * ⚠️ Costs, demand and rates are simplified game parameters ("near-real") — check before submission. */
import { policyRate, type Loan } from "./life";

export const OPEN_COST = 50_000_000; // kiosk: equipment 30M + deposit & fit-out 12M + working capital 8M
export const EQUIP = 30_000_000;
export const OWN_MIN = 10_000_000; // your own money in
export const BIZ_FIXED = 16_000_000; // rent 6M + two part-timers 8M + power, water, marketing 2M
export const VAR_COST = 15_000; // tea, milk, tapioca, cup, straw, delivery-app share
export const OWNER_PAY = 8_000_000; // what you pay yourself (replaces your old salary)
export const BIZ_FIXED_RATE = 11; // %/yr, business loan fixed
export const bizFloat = (m: number) => policyRate(m) + 5; // %/yr, business loan floating
export const OVERDRAFT_RATE = 20; // %/yr
export const BANKRUPT_AT = 30_000_000; // overdraft limit
export const PRICES = [25_000, 35_000, 45_000];
const BASE: Record<number, number> = { 25000: 1750, 35000: 1300, 45000: 900 }; // cups a month in a normal month
const LOVE: Record<number, number> = { 25000: 4, 35000: 1, 45000: -4 };

export interface PL { m: number; cups: number; contractCups: number; revenue: number; variable: number; fixed: number; dep: number; interest: number; ownerPay: number; profit: number;
  cashIn: number; collected: number; cashOut: number; loanPay: number; netCash: number; cashEnd: number; overdraft: boolean; bankrupt: boolean }
export interface Biz {
  open: number; cash: number; price: number; love: number; equip: number; varCost: number;
  loans: Loan[]; investor: number; // share owned by the investor (0–1)
  receivable: { amount: number; due: number }[];
  contract?: { cups: number; price: number; until: number };
  cases: string[]; decided: boolean; good: number;
  pls: PL[]; closed?: number;
}

export function openBiz(month: number, how: "fixed" | "float" | "investor"): Biz {
  const b: Biz = { open: month, cash: OPEN_COST - EQUIP - 12_000_000, price: 35_000, love: 55, equip: EQUIP, varCost: VAR_COST, loans: [], investor: 0, receivable: [], cases: [], decided: false, good: 0, pls: [] };
  const need = OPEN_COST - OWN_MIN;
  if (how === "investor") b.investor = 0.45; // 40M for 45% — the investor values the kiosk at ~89M before it sells a cup
  else b.loans.push({ id: "biz-" + month, what: "shop", left: need, kind: how, rate: how === "fixed" ? BIZ_FIXED_RATE : 0, months: 36 });
  return b;
}
export const bizRate = (l: Loan, m: number) => (l.kind === "float" ? bizFloat(m) : l.kind === "card" ? OVERDRAFT_RATE : l.rate);
export function bizPayment(l: Loan, m: number) {
  if (l.kind === "card") return Math.min(l.left, (l.left * OVERDRAFT_RATE) / 1200 + l.left * 0.1);
  const r = bizRate(l, m) / 1200, n = Math.max(1, l.months);
  return (l.left * r) / (1 - Math.pow(1 + r, -n));
}
export const bizDebt = (b: Biz) => b.loans.reduce((s, l) => s + l.left, 0);
/** What your share of the kiosk is worth (book value: cash + equipment + money owed to you − debt), for net worth. */
export const bizValue = (b: Biz) => (b.closed ? 0 : Math.round((b.cash + b.equip + b.receivable.reduce((s, r) => s + r.amount, 0) - bizDebt(b)) * (1 - b.investor)));
export const breakEven = (b: Biz) => Math.ceil(BIZ_FIXED / Math.max(1, b.price - b.varCost));

/** One month at the kiosk. Returns the P&L + cash flow, and what you could pay yourself. */
export function bizMonth(b: Biz, m: number, rnd: () => number = Math.random): { pl: PL; pay: number } {
  const age = m - b.open; // 0 = first month
  const ramp = age === 0 ? 0.55 : age === 1 ? 0.8 : 1; // new shops need time to be known
  const cups = Math.round((BASE[b.price] ?? 1300) * ramp * (0.7 + (0.6 * b.love) / 100) * (0.9 + rnd() * 0.2));
  const c = b.contract && m <= b.contract.until ? b.contract : undefined;
  const contractCups = c ? c.cups : 0;
  const revenue = cups * b.price + contractCups * (c?.price || 0);
  const variable = (cups + contractCups) * b.varCost;
  const dep = Math.round(b.equip * 0.015); b.equip -= dep;
  let interest = 0, loanPay = 0;
  for (const l of b.loans) {
    const p = Math.round(bizPayment(l, m)), i = Math.round((l.left * bizRate(l, m)) / 1200);
    interest += i; loanPay += p; l.left = Math.max(0, l.left - (p - i)); if (l.kind !== "card") l.months = Math.max(0, l.months - 1);
  }
  b.loans = b.loans.filter((l) => l.left > 1000);
  // cash: walk-in sales are paid now; the contract pays in 60 days (B3)
  if (c) b.receivable.push({ amount: contractCups * c.price, due: m + 2 });
  const collected = b.receivable.filter((r) => r.due <= m).reduce((s, r) => s + r.amount, 0);
  b.receivable = b.receivable.filter((r) => r.due > m);
  const cashIn = cups * b.price + collected;
  let cash = b.cash + cashIn - variable - BIZ_FIXED - loanPay;
  const pay = Math.max(0, Math.min(OWNER_PAY, cash)); // you only get paid if the shop has the cash
  cash -= pay;
  const profit = revenue - variable - BIZ_FIXED - dep - interest - OWNER_PAY;
  let overdraft = false, bankrupt = false;
  if (cash < 0) { // overdraft at 20%/yr
    overdraft = true;
    const od = b.loans.find((l) => l.kind === "card");
    if (od) od.left += -cash; else b.loans.push({ id: "overdraft", what: "overdraft", left: -cash, kind: "card", rate: OVERDRAFT_RATE, months: 0 });
    cash = 0;
    if ((b.loans.find((l) => l.kind === "card")?.left || 0) > BANKRUPT_AT) bankrupt = true;
  }
  b.cash = cash;
  b.love = Math.max(0, Math.min(100, b.love + (LOVE[b.price] ?? 0) + (c ? -1 : 0)));
  if (c && m >= c.until) b.contract = undefined;
  const pl: PL = { m, cups, contractCups, revenue, variable, fixed: BIZ_FIXED, dep, interest, ownerPay: OWNER_PAY, profit, cashIn, collected, cashOut: variable + BIZ_FIXED + loanPay + pay, loanPay, netCash: cashIn - variable - BIZ_FIXED - loanPay - pay, cashEnd: b.cash, overdraft, bankrupt };
  b.pls.push(pl); if (b.pls.length > 24) b.pls.shift();
  b.decided = false;
  if (bankrupt) b.closed = m;
  return { pl, pay };
}
/** The investor's cut when the shop is sold or closed is handled by bizValue (you only own 1 − investor). */
