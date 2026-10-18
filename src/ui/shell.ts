/* ---------- App shell: top bar, 5-tab nav, overlay, result pop-up (from altifi-base.html) ---------- */
import { $, esc, shortVnd } from "../core/util";
import { S, save, PO, BG_KEY } from "../core/state";
import { reg } from "../core/actions";
import { t, lang, setLang } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { pageAnim, stopTalk, startTalk, paintTalk, talkId, LINES, confetti, countAttrs, runCounts } from "./fx";
import { icon, IC } from "./icons";
import { hydrateImages } from "./realimage";
import { syncSky } from "./skybg";
import { setCtx } from "../assistant/context";
import { refreshFab, placeFab } from "../assistant/assistant";
import { learnView, homeFirst, learnCtx, afterLearnRender } from "./learn";
import { exploreView } from "./explore";
import { playView, afterPlayRender } from "./play";
import { meView } from "./me";
import { settingsView, getSetSub, clearSetSub } from "./settings";

export type Tab = "learn" | "explore" | "play" | "me" | "settings";
export const NAVORD: Tab[] = ["learn", "explore", "play", "me", "settings"];
const ICONS: Record<Tab, string> = { learn: "learn", explore: "explore", play: "play", me: "me", settings: "settings" };
export let tab: Tab = "learn";

export const BN = () => esc(S.m.name || "Alti Lion");

export function go(to: Tab) {
  const d = NAVORD.indexOf(to) - NAVORD.indexOf(tab), hadSub = !!getSetSub();
  tab = to;
  clearSetSub();
  render(true);
  const scr = $("#screen");
  if (scr) scr.scrollTop = 0;
  if (d) pageAnim(d); else if (hadSub) pageAnim(-1);
}

export const ovShown = () => !!$("#overlay")?.classList.contains("show");

export const fmtCount = (n: number, fmt: string) => (fmt === "vnd" ? shortVnd(n, lang()) : n.toLocaleString(lang() === "vi" ? "vi-VN" : "en-US"));
function topBar() {
  const nw = S.game ? `<span class="hud" title="${t("top.netWorth")}">${icon("wallet", { size: 20, color: IC.wallet, label: t("top.netWorth") })}<b ${countAttrs("nw", S.game.netWorth, "vnd", (n) => shortVnd(n, lang()))}</b></span>` : "";
  return `<div class="logo">altifi</div><div class="stats"><span class="hud" title="${t("me.streak")}">${icon("flame", { size: 20, color: IC.flame, label: t("me.streak") })}<b ${countAttrs("streak", S.streak)}</b></span><span class="hud" title="XP">${icon("star", { size: 20, color: IC.star, label: "XP" })}<b ${countAttrs("xp", S.xp)}</b></span>${nw}<button class="langpill" onclick="A.toggleLang()" aria-label="${t("top.lang")}">${lang() === "vi" ? "VI" : "EN"}</button></div>`;
}

function tabCtx() {
  if (tab === "learn") return learnCtx();
  const where = { explore: t("as.whereExplore"), play: t("as.wherePlay"), me: t("as.whereMe"), settings: t("as.whereSettings") }[tab]!;
  setCtx({ key: "tab:" + tab, where, title: t("nav." + tab), answered: true, kb: tab === "play" ? ["crisis1929", "crisis1973", "crisis2008", "fixedfloat"] : tab === "explore" ? ["fx", "crisis2008", "stocks"] : [] });
}

/** `enter` = we just navigated here → cards appear one after another (stagger). */
export function render(enter = false) {
  $("#top")!.innerHTML = topBar();
  const views: Record<Tab, () => string> = { learn: learnView, explore: exploreView, play: playView, me: meView, settings: settingsView };
  const scr = $("#screen")!;
  scr.innerHTML = views[tab]();
  scr.classList.toggle("gxmode", !!$("#gxHost"));
  syncSky(tab !== "learn" && !document.body.classList.contains("imgbg")); // light galaxy behind Explore / Me / Settings / Play
  if (tab === "learn") afterLearnRender();
  if (tab === "play") afterPlayRender();
  scr.classList.toggle("enter", enter);
  if (enter) setTimeout(() => scr.classList.remove("enter"), 900);
  document.querySelectorAll<HTMLButtonElement>(".nav button").forEach((b) => {
    const k = b.dataset.t as Tab, on = k === tab;
    b.innerHTML = `<span class="navic">${icon(ICONS[k], { size: 26, active: on, tint: on ? 0.28 : 0 })}</span>${t("nav." + k)}`;
    b.setAttribute("aria-current", on ? "page" : "false");
    b.classList.toggle("on", on);
  });
  runCounts(document, fmtCount);
  hydrateImages(scr);
  if (!ovShown()) tabCtx();
  refreshFab();
  if (tab === "learn" && S.set.inter && !PO() && !ovShown() && document.getElementById("homeTalk")) {
    if (talkId() === "homeTalk") paintTalk(false);
    else startTalk("homeTalk", LINES.home, homeFirst(false));
  }
}

/* ---------- Full-screen overlay (lessons, profile, buddy, results) ---------- */
/** Whoever owns the overlay can register how to redraw it (used when the language changes). */
let ovRerender: (() => void) | null = null;
export function setOvRerender(fn: (() => void) | null) { ovRerender = fn; }
export function rerenderAll() {
  render();
  if (ovShown() && ovRerender) ovRerender();
}
export function openO(html: string, opts?: { cls?: string }) {
  const o = $("#overlay")!, isNew = !o.classList.contains("show");
  o.innerHTML = html; // lessons keep a plain background (13.1b-6)
  o.className = "overlay show" + (opts?.cls ? " " + opts.cls : "");
  $(".phone")!.classList.add("ov");
  if (isNew) pageAnim(1, o);
  requestAnimationFrame(placeFab);
  hydrateImages(o);
  runCounts(o, fmtCount);
}
export function closeO() {
  ovRerender = null;
  $("#overlay")!.classList.remove("show");
  $(".phone")!.classList.remove("ov");
  render();
  pageAnim(-1);
}
export function backHome() {
  ovRerender = null;
  stopTalk();
  $("#overlay")!.classList.remove("show");
  $(".phone")!.classList.remove("ov");
  tab = "learn";
  clearSetSub();
  render();
  pageAnim(-1);
}

/* ---------- Result pop-up: big Alti Lion whose mood follows your score ---------- */
export function moodFor(p: number): [string, number, string] {
  return p >= 0.99 ? ["cheer", 100, t("res.m.cheer")] : p >= 0.66 ? ["happy", 78, t("res.m.happy")] : p >= 0.33 ? ["wow", 48, t("res.m.wow")] : ["sad", 14, t("res.m.sad")];
}
export function resultPopup(o: { title: string; sub: string; stats: Array<[string | number, string]>; pct: number; extra?: string; buttons: Array<[string, string, string?]>; }) {
  const [mood, lvl, label] = moodFor(o.pct);
  openO(`<div class="resultbg"><div class="resultcard" role="dialog" aria-label="${esc(o.title)}">
    <div class="rc-face m-${mood}">${lion(118, mood)}</div>
    <h2>${o.title}</h2><div class="muted rc-sub">${o.sub}</div>
    <div class="rc-stats">${o.stats.map(([v, l], i) => `<div>${icon(["check", "clock", "star"][i] || "star", { size: 22, color: ["var(--good)", "var(--pri)", IC.star][i] || IC.star, tint: 0.3 })}<b>${v}</b><span>${l}</span></div>`).join("")}</div>
    <div class="happy"><div class="hrow"><span>${t("res.happiness", { name: BN() })}</span><b>${label}</b></div><div class="hbar"><i style="width:${lvl}%"></i></div></div>
    ${o.extra || ""}
    <div class="rc-btns">${o.buttons.map(([l, f, c]) => `<button class="btn ${c || ""}" onclick="${f}">${l}</button>`).join("")}</div>
  </div></div>`);
  if (o.pct >= 0.66) confetti();
}

/* ---------- Notification preview (Me → daily reminder) ---------- */
export function toast() {
  const el = $("#toast")!;
  el.innerHTML = `<div class="ic">${lion(30)}</div><div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:var(--muted)"><span>ALTIFI</span><span>${t("me.now")}</span></div><div style="font-weight:900;font-size:14px">${t("me.toastTitle", { name: BN() })}</div><div style="font-size:13px;font-weight:700">${t("me.toastBody", { n: S.streak })}</div></div>`;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3500);
}

/* ---------- Theme ---------- */
export let bgImg: string | null = null;
try { bgImg = localStorage.getItem(BG_KEY); } catch { /* blocked */ }
export function setBgImg(v: string | null) { bgImg = v; }
export function applyTheme() {
  const b = document.body;
  let th = S.set.theme;
  if (th === "image" && !bgImg) th = "light";
  b.classList.toggle("night", th === "night");
  b.classList.toggle("imgbg", th === "image");
  if (th === "image") b.style.setProperty("--bgimg", `url('${bgImg}')`); else b.style.removeProperty("--bgimg");
  b.classList.toggle("potato", PO());
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", th === "night" ? "#1F2128" : "#5B5BD6");
}

export function toggleLang() {
  setLang(lang() === "vi" ? "en" : "vi");
}

reg({ go, closeO, backHome, toast, toggleLang, save });
