/* ---------- Crisis mode: the Crisis Museum in the town (design doc 6.4) ----------
 * Museum door → rooms (1929 and 1997 playable; 1973 and 2008 "opening soon", 13.6). In a room you pick a role — an ordinary
 * saver or the Governor of the central bank — and live 3–4 moments in order, deciding BEFORE you know what comes
 * next. The town follows the story (src/game/town.ts setEra). Each move is rated like chess right after you make it;
 * the full "What really happened", every side's view and your result come at the end. */
import { esc } from "../core/util";
import { noMotion } from "../core/state";
import { reg } from "../core/actions";
import { t, tx, lang } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { confetti } from "./fx";
import { CRISIS_1929, SAVER, GOVERNOR, type CrisisStep, type SaverFx, type GovFx } from "../content/crisis1929";
import { CRISIS_1997, GOV97, gov97Result, type Gov97Fx } from "../content/crisis1997";
import type { Rating } from "../content/cases";
import { townHooks, townSheet, townSheetClose, getTown } from "./town";

const RCOL: Record<Rating, string> = { "!!": "#1BADA6", "!": "#2BB673", "★": "#7CB342", "!?": "#8E9BFF", "?!": "#F2A33A", "??": "#EF4E4E" };
const usd = (n: number) => "$" + Math.round(n).toLocaleString(lang() === "vi" ? "vi-VN" : "en-US");
const head = (title: string, sub = "") => `<div class="lf-h"><h3>${title}</h3>${sub ? `<span>${sub}</span>` : ""}<button class="lf-x" onclick="A.crisisQuit()" aria-label="${esc(t("c.close"))}">✕</button></div>`;

type Role = "saver" | "gov";
interface Saver { cash: number; stock: number; debt: number; bank: number; income: number; called: boolean; bankFailed: boolean }
type Room = "1929" | "1997";
let run: { room: Room; role: Role; i: number; moves: Rating[]; sv: Saver; gov: GovFx; g97: Gov97Fx; notes: string[] } | null = null;
const steps = () => (run?.room === "1997" ? GOV97 : run?.role === "gov" ? GOVERNOR : SAVER) as CrisisStep<SaverFx | GovFx | Gov97Fx>[];
const crisis = () => (run?.room === "1997" ? CRISIS_1997 : CRISIS_1929);
const roleName = () => t(run?.room === "1997" ? "cr.roleGov97" : run?.role === "gov" ? "cr.roleGov" : "cr.roleSaver");
const wealth = (s: Saver) => s.cash + s.stock + s.bank - s.debt;

/* ---- the museum ---- */
function museum() {
  townSheet(`${head(t("cr.museum"))}
    <div class="lf-tip">${lion(44, "wow")}<p>${t("cr.museumText")}</p></div>
    <div class="cr-room"><div class="cr-yr" style="background:#8A5A44">1929</div><div><b>${tx(CRISIS_1929.title)}</b><p>${tx(CRISIS_1929.intro)}</p>
      <div class="lf-btns"><button class="btn good" onclick="A.crisisStart('saver')">${t("cr.roleSaver")}</button><button class="btn" onclick="A.crisisStart('gov')">${t("cr.roleGov")}</button></div></div></div>
    <div class="cr-room soon"><div class="cr-yr" style="background:#E07B22">1973</div><div><b>${t("cr.r1973")}</b><p>${t("cr.soonRoom")}</p></div></div>
    <div class="cr-room"><div class="cr-yr" style="background:#4E6B5C">1997</div><div><b>${tx(CRISIS_1997.title)}</b><p>${tx(CRISIS_1997.intro)}</p>
      <div class="lf-btns"><button class="btn good" onclick="A.crisisStart('gov','1997')">${t("cr.roleGov97")}</button></div></div></div>
    <div class="cr-room soon"><div class="cr-yr" style="background:#3D5AFE">2008</div><div><b>${t("cr.r2008")}</b><p>${t("cr.soonRoom")}</p></div></div>`);
}
townHooks.doors.push((b) => { if (b.id !== "museum") return false; museum(); return true; });

function setScene() {
  const st = steps()[run!.i], tw = getTown();
  tw?.setEra({ year: crisis().year, scene: st.scene, index: st.index });
  document.getElementById("twRoot")?.classList.toggle("era-old", run!.room === "1929"); // old-photo vignette
}
const clearEra = () => { getTown()?.setEra(null); document.getElementById("twRoot")?.classList.remove("era-old"); };
function crisisStart(role: Role, room: Room = "1929") {
  run = { room, role, i: 0, g97: {}, moves: [], sv: { cash: 1000, stock: 1000, debt: 0, bank: 0, income: 0, called: false, bankFailed: false }, gov: {}, notes: [] };
  setScene();
  showStep();
}
function showStep() {
  if (!run) return;
  const st = steps()[run.i];
  const status = run.room === "1929" && run.role === "saver" ? saverStatus(run.sv) : "";
  townSheet(`${head(tx(crisis().title), roleName())}
    <div class="cr-paper"><span>${tx(st.date)}</span><b>${esc(tx(st.headline))}</b></div>
    ${status}
    <p class="lf-setup">${esc(tx(st.text))}</p>
    <div class="lf-opts">${st.opts.map((o, k) => `<button class="lf-opt" onclick="A.crisisChoose(${k})"><b>${"ABC"[k]}</b><span>${esc(tx(o.t))}</span></button>`).join("")}</div>
    <p class="tw-note">${t("cr.noSpoiler")}</p>`);
}
function saverStatus(s: Saver) {
  const row = (k: string, v: number, neg = false) => `<div class="lf-row"><span>${t(k)}</span><b class="${neg && v > 0 ? "neg" : ""}">${neg && v > 0 ? "−" : ""}${usd(v)}</b></div>`;
  return `<div class="cr-status">${row("cr.cash", s.cash)}${row("cr.stock", s.stock)}${row("cr.bank", s.bank)}${s.debt ? row("cr.debt", s.debt, true) : ""}<div class="lf-total"><span>${t("cr.wealth")}</span><b>${usd(wealth(s))}</b></div></div>`;
}

/* ---- the saver's money moves with the market between steps ---- */
function applySaver(fx: SaverFx, s: Saver) {
  if (fx.margin) { s.debt += fx.margin; s.stock += fx.margin; }
  if (fx.sellStock) {
    if (fx.sellStock > 9999) { s.cash += s.stock; s.stock = 0; const pay = Math.min(s.cash, s.debt); s.cash -= pay; s.debt -= pay; }
    else { const v = Math.min(s.stock, fx.sellStock); s.stock -= v; s.cash += v; }
  }
  if (fx.toBank) { const v = Math.min(s.cash, fx.toBank); s.cash -= v; s.bank += v; }
  if (fx.withdraw) { const v = s.bank * fx.withdraw; s.bank -= v; s.cash += v; }
  if (fx.job) s.income = fx.job === "keep" ? 600 : 0;
  if (fx.buyStock) { const v = s.cash * fx.buyStock; s.cash -= v; s.stock += v; }
}
function moveMarket(s: Saver, from: number, to: number) {
  s.stock *= to / from;
  if (s.debt > 0 && s.stock > 0 && s.debt > s.stock * 0.6) { // margin call: the broker sells you out
    const pay = Math.min(s.stock, s.debt);
    run!.notes.push(t("cr.marginCall", { v: usd(pay) }));
    s.stock -= pay; s.debt -= pay; s.called = true;
  }
}
function crisisChoose(k: number) {
  if (!run) return;
  const list = steps(), st = list[run.i], o = st.opts[k];
  run.moves.push(o.r);
  if (run.room === "1997") Object.assign(run.g97, o.fx as Gov97Fx);
  else if (run.role === "saver") applySaver(o.fx as SaverFx, run.sv);
  else Object.assign(run.gov, o.fx as GovFx);
  const last = run.i === list.length - 1;
  townSheet(`${head(tx(crisis().title), tx(st.date))}
    <div class="lf-rate"><span class="lf-badge" style="background:${RCOL[o.r]}">${o.r}</span><div><b>${t("lf.r." + o.r)}</b><p>${esc(tx(o.t))}</p></div></div>
    <p class="lf-why">${esc(tx(o.why))}</p>
    <button class="btn good" onclick="A.crisisNext()">${last ? t("cr.seeTruth") : t("cr.timePasses")}</button>`);
}
function crisisNext() {
  if (!run) return;
  const list = steps();
  if (run.room === "1929" && run.role === "saver") {
    const s = run.sv, from = list[run.i].index;
    if (run.i < list.length - 1) {
      moveMarket(s, from, list[run.i + 1].index);
      if (list[run.i].id === "s3" && s.bank > 0) { run.notes.push(t("cr.bankFailed", { v: usd(s.bank / 2) })); s.bank /= 2; s.bankFailed = true; } // your bank closes in 1931; depositors get half back, years later
    } else { moveMarket(s, from, 26); s.cash += s.income; } // mid-1933
  }
  if (run.i < list.length - 1) { run.i++; setScene(); showStep(); return; }
  finish();
}
function finish() {
  if (!run) return;
  const good = run.moves.filter((r) => r === "!!" || r === "!").length, bad = run.moves.filter((r) => r === "??").length;
  let result = "";
  if (run.room === "1997") {
    const r = gov97Result(run.g97);
    result = `<div class="cr-vs"><div><span>${t("cr.worstBaht")}</span><b>${r.worst}</b><em>${t("cr.realBaht")}</em></div><div><span>${t("cr.reservesLeft")}</span><b>~${r.reserves} ${t("cr.bnUsd")}</b><em>${t("cr.realReserves")}</em></div></div><p class="tw-note">${t("cr.model")}</p>`;
  } else if (run.role === "saver") {
    const w = wealth(run.sv), base = 1000 + 1000 * 0.26; // did nothing: cash + shares held to mid-1933
    result = `<div class="lf-total"><span>${t("cr.start")}</span><b>${usd(2000)}</b></div><div class="lf-total"><span>${t("cr.end")}</span><b class="${w >= base ? "pos" : "neg"}">${usd(w)}</b></div><p class="tw-note">${t("cr.base", { v: usd(base) })}</p>${run.notes.map((n) => `<p class="lf-warn">${esc(n)}</p>`).join("")}`;
  } else {
    const g = run.gov, u = Math.max(8, 25 - (g.lend ? 6 : 0) - (g.rateUp ? 0 : 4) - (g.pump ? 5 : 0) - (g.insure ? 3 : 0)), banks = Math.max(800, 9000 - (g.lend ? 3000 : 0) - (g.rateUp ? 0 : 1000) - (g.pump ? 2500 : 0) - (g.insure ? 2000 : 0));
    result = `<div class="cr-vs"><div><span>${t("cr.yourU")}</span><b>${u}%</b><em>${t("cr.realU")}</em></div><div><span>${t("cr.yourBanks")}</span><b>${banks.toLocaleString(lang() === "vi" ? "vi-VN" : "en-US")}</b><em>${t("cr.realBanks")}</em></div></div><p class="tw-note">${t("cr.model")}</p>`;
  }
  if (good >= 2 && bad === 0 && !noMotion()) confetti();
  const C = crisis(), again = run.room === "1997" ? `A.crisisStart('gov','1997')` : `A.crisisStart('${run.role === "gov" ? "saver" : "gov"}')`;
  townSheet(`${head(t(run.room === "1997" ? "cr.endT97" : "cr.endT"), roleName())}
    <div class="cr-moves">${run.moves.map((r, k) => `<span style="background:${RCOL[r]}" title="${esc(tx(steps()[k].date))}">${r}</span>`).join("")}</div>
    ${result}
    <h4>${t("lf.story")}</h4><p class="lf-story">${esc(tx(C.story))}</p>
    <h4>${t("lf.views")}</h4><div class="lf-views">${C.views.map(([w, s]) => `<div><b>${esc(tx(w))}</b><span>${esc(tx(s))}</span></div>`).join("")}</div>
    <p class="tw-note">${t("lf.aiNote")}</p>
    <div class="lf-btns"><button class="btn ghost" onclick="${again}">${t(run.room === "1997" ? "cr.again" : run.role === "gov" ? "cr.againSaver" : "cr.againGov")}</button><button class="btn good" onclick="A.crisisQuit()">${t("cr.back")}</button></div>`);
}
function crisisQuit() {
  run = null;
  clearEra();
  townSheetClose();
}
townHooks.leave.push(() => { if (run) { run = null; clearEra(); } });

/** Play tab → museum room card: fly down and stand at the museum door. */
let pending = false;
function playCrisis() { pending = true; (window as any).A.goTown(); }
townHooks.arrive.push(() => {
  if (!pending) return;
  pending = false;
  setTimeout(() => {
    const tw = getTown(), d = tw?.map.doors.find((x) => x.id === "museum");
    if (tw && d) tw.teleport(d.x, d.z + 0.4);
    museum();
  }, noMotion() ? 0 : 1000);
});

reg({ crisisStart, crisisChoose, crisisNext, crisisQuit, playCrisis, crisisMuseum: museum });
