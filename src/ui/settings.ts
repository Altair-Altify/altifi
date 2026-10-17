/* ---------- Settings (from altifi-base.html) + language and Alti Lion level ---------- */
import { $ } from "../core/util";
import { S, save, BG_KEY, COVER_KEY } from "../core/state";
import { reg } from "../core/actions";
import { t, setLang, lang } from "../i18n/i18n";
import { BN, render, applyTheme, bgImg, setBgImg } from "./shell";
import { pageAnim } from "./fx";
import { countryName, updateWeather } from "./weather";
import { icon } from "./icons";
const wi = (n: string) => icon(n, { size: 24, color: "#fff", tint: 0.35 });

let setSub: string | null = null;
export const getSetSub = () => setSub;
export const clearSetSub = () => { setSub = null; };

function toggleRow(key: keyof typeof S.set, icon: string, color: string, title: string, sub: string) {
  const on = !!S.set[key];
  return `<button class="setrow" role="switch" aria-checked="${on}" onclick="A.flip('${key}')"><span class="si" style="background:${color}">${icon}</span><span class="st"><b>${title}</b><small>${sub}</small></span><span class="sw ${on ? "on" : ""}"><i></i></span></button>`;
}
function segRow(icon: string, color: string, title: string, opts: [string, string][], cur: string, fn: string) {
  return `<div class="setrow segrow"><span class="si" style="background:${color}">${icon}</span><span class="st"><b>${title}</b><span class="seg">${opts.map(([v, l]) => `<button class="${v === cur ? "on" : ""}" onclick="A.${fn}('${v}')">${l}</button>`).join("")}</span></span></div>`;
}

export function settingsView() {
  if (setSub === "theme") return themeView();
  const th = { light: t("st.light"), night: t("st.night"), image: t("st.image") }[S.set.theme === "image" && !bgImg ? "light" : S.set.theme];
  return `<h2 class="title">${t("st.title")}</h2><p class="muted" style="font-weight:700;margin-bottom:14px">${t("st.sub")}</p>
  <div class="setlist">
    ${segRow(wi("globe"), "#3D5AFE", t("st.lang"), [["vi", "🇻🇳 Tiếng Việt"], ["en", "🇬🇧 English"]], lang(), "setLangTo")}
    <button class="setrow" onclick="A.openSub('theme')"><span class="si" style="background:#5B5BD6">${wi("palette")}</span><span class="st"><b>${t("st.theme")}</b><small>${th}</small></span><span class="chev">${icon("chevron", { size: 22 })}</span></button>
    ${toggleRow("inter", wi("chat"), "#E8418C", t("st.inter", { name: BN() }), t("st.interSub", { name: BN() }))}
    ${segRow(wi("cap"), "#7E5BE0", t("st.lvl", { name: BN() }), [["auto", t("as.lvl.auto")], ["n", t("as.lvl.n")], ["l", t("as.lvl.l")], ["p", t("as.lvl.p")]], S.set.lvl, "setLvl")}
    ${toggleRow("wx", wi("weather"), "#4C93E6", t("st.wx"), t("st.wxSub", { c: countryName(S.p.country) }))}
    ${toggleRow("potato", wi("potato"), "#A0714F", t("st.potato"), t("st.potatoSub"))}
    ${toggleRow("intel", wi("bulb"), "#1BADA6", t("st.intel"), t("st.intelSub"))}
    ${toggleRow("voice", wi("speaker"), "#F2A33A", t("st.voice"), t("st.voiceSub"))}
  </div>`;
}

function flip(k: keyof typeof S.set) {
  const on = !S.set[k];
  (S.set as any)[k] = on; save(); applyTheme();
  if (k === "wx") {
    if (on) updateWeather();
    else { document.querySelectorAll(".wx").forEach((w) => w.classList.add("wipe")); setTimeout(() => { if (!S.set.wx) updateWeather(); }, 820); }
  }
  render();
}

function mock(kind: "light" | "night" | "image") {
  const c = { light: { bg: "background:#F2F3FF", bar: "#fff", card: "#fff" }, night: { bg: "background:#1F2128", bar: "#2A2D37", card: "#2A2D37" }, image: { bg: `background:url('${bgImg}') center/cover`, bar: "rgba(255,255,255,.45)", card: "#fff" } }[kind];
  return `<div class="mock" style="${c.bg}"><div class="mt" style="background:${c.bar}"></div><div class="mb"><div class="mc" style="background:#5B5BD6"></div><div class="mc" style="background:${c.card};width:80%"></div><div class="mc" style="background:${c.card};width:92%"></div><div class="mc" style="background:#2BB673;width:60%"></div></div><div class="mn" style="background:${c.bar}"></div></div>`;
}
function themeView() {
  const th = S.set.theme === "image" && !bgImg ? "light" : S.set.theme;
  return `<button class="backlink" onclick="A.closeSub()">${t("st.back")}</button><h2 class="title">${t("st.theme")}</h2><p class="muted" style="font-weight:700;margin-bottom:14px">${t("st.themeSub")}</p>
  <div class="themegrid">
    <button class="themecard ${th === "light" ? "on" : ""}" onclick="A.setTheme('light')">${mock("light")}☀️ ${t("st.light")}</button>
    <button class="themecard ${th === "night" ? "on" : ""}" onclick="A.setTheme('night')">${mock("night")}🌙 ${t("st.night")}</button>
  </div>
  <div class="sub">${t("st.ownPic")}</div>
  ${bgImg ? `<div class="themegrid"><button class="themecard ${th === "image" ? "on" : ""}" onclick="A.setTheme('image')">${mock("image")}🖼️ ${t("st.image")}</button><button class="upload" onclick="A.askPhotos('bg')"><span>${icon("camera", { size: 34, color: "var(--pri)" })}</span>${t("st.change")}<small>${t("st.changeSub")}</small></button></div>`
    : `<button class="upload" onclick="A.askPhotos('bg')"><span>${icon("camera", { size: 34, color: "var(--pri)" })}</span>${t("st.upload")}<small>${t("st.uploadSub")}</small></button>`}`;
}
function setTheme(k: "light" | "night" | "image") {
  if (k === "image" && !bgImg) return askPhotos();
  S.set.theme = k; save(); applyTheme(); render();
}
/** Same iOS-style permission flow for the app background and the profile cover (design doc 10c.5). */
let photoTarget: "bg" | "cover" = "bg";
function askPhotos(target: "bg" | "cover" = "bg") {
  photoTarget = target === "cover" ? "cover" : "bg";
  if (S.set.photosOK) return ($("#filein") as HTMLInputElement).click();
  $("#pmodal")!.innerHTML = `<div class="alertbg"><div class="permbox"><div class="pb"><div style="line-height:1;margin-bottom:8px">${icon("image", { size: 44, color: "#0A7AFF" })}</div><b>${t("st.permT")}</b><p>${t("st.permB")}</p></div><div class="permbtns"><button onclick="A.closePerm()">${t("st.deny")}</button><button onclick="A.allowPhotos()">${t("st.allow")}</button></div></div></div>`;
}
function gotPhoto(inp: HTMLInputElement) {
  const f = inp.files && inp.files[0];
  inp.value = "";
  if (!f) return;
  const url = URL.createObjectURL(f), img = new Image();
  img.onload = () => {
    const sc = Math.min(1, (photoTarget === "cover" ? 900 : 1400) / Math.max(img.width, img.height)), cv = document.createElement("canvas");
    cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
    cv.getContext("2d")!.drawImage(img, 0, 0, cv.width, cv.height);
    const data = cv.toDataURL("image/jpeg", 0.82);
    URL.revokeObjectURL(url);
    if (photoTarget === "cover") {
      try { localStorage.setItem(COVER_KEY, data); } catch { /* too big: kept for this session */ }
      setCoverImg(data);
      S.p.cover = "photo"; save(); closeSheetIfAny(); render();
      return;
    }
    setBgImg(data);
    try { localStorage.setItem(BG_KEY, data); } catch { /* too big for storage: still used this session */ }
    S.set.theme = "image"; save(); applyTheme(); render();
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

let coverImg: string | null = null;
try { coverImg = localStorage.getItem(COVER_KEY); } catch { /* blocked */ }
export const getCoverImg = () => coverImg;
function setCoverImg(v: string) { coverImg = v; }
function closeSheetIfAny() { const m = $("#pmodal"); if (m) m.innerHTML = ""; }

reg({
  flip, setTheme, askPhotos, gotPhoto,
  openSub(k: string) { setSub = k; render(); pageAnim(1); },
  closeSub() { setSub = null; render(); pageAnim(-1); },
  closePerm() { $("#pmodal")!.innerHTML = ""; },
  allowPhotos() { S.set.photosOK = true; save(); $("#pmodal")!.innerHTML = ""; ($("#filein") as HTMLInputElement).click(); },
  setLangTo(l: "vi" | "en") { setLang(l); },
  setLvl(v: "auto" | "n" | "l" | "p") { S.set.lvl = v; save(); render(); },
});
