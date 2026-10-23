/* ---------- Country weather (from altifi-base.html) — shown only inside the town since 13.1b-6 ---------- */
import { DEMO } from "../core/demo";
import { $, rand } from "../core/util";
import { S } from "../core/state";
import { t, lang } from "../i18n/i18n";

// code: [flag, English name, Vietnamese name, usual weather]
export const COUNTRIES: Record<string, [string, string, string, string[]]> = {
  VN: ["🇻🇳", "Vietnam", "Việt Nam", ["sunny", "rain"]], TH: ["🇹🇭", "Thailand", "Thái Lan", ["sunny", "rain"]], SG: ["🇸🇬", "Singapore", "Singapore", ["sunny", "rain"]],
  PH: ["🇵🇭", "Philippines", "Philippines", ["sunny", "rain"]], MY: ["🇲🇾", "Malaysia", "Malaysia", ["sunny", "rain"]], ID: ["🇮🇩", "Indonesia", "Indonesia", ["sunny", "rain"]],
  JP: ["🇯🇵", "Japan", "Nhật Bản", ["sunny", "rain", "snow", "leaves"]], KR: ["🇰🇷", "South Korea", "Hàn Quốc", ["sunny", "snow", "leaves"]], CN: ["🇨🇳", "China", "Trung Quốc", ["sunny", "cloudy", "snow"]],
  IN: ["🇮🇳", "India", "Ấn Độ", ["sunny", "rain"]], AU: ["🇦🇺", "Australia", "Úc", ["sunny"]], US: ["🇺🇸", "United States", "Hoa Kỳ", ["sunny", "cloudy", "snow", "leaves"]],
  CA: ["🇨🇦", "Canada", "Canada", ["snow", "leaves", "sunny"]], GB: ["🇬🇧", "United Kingdom", "Vương quốc Anh", ["rain", "cloudy"]], FR: ["🇫🇷", "France", "Pháp", ["sunny", "cloudy", "rain"]],
  DE: ["🇩🇪", "Germany", "Đức", ["cloudy", "rain", "snow"]], RU: ["🇷🇺", "Russia", "Nga", ["snow", "cloudy"]], AE: ["🇦🇪", "UAE", "UAE", ["sunny"]], BR: ["🇧🇷", "Brazil", "Brazil", ["sunny", "rain"]],
};
export const country = (code: string) => COUNTRIES[code] || COUNTRIES.VN;
export const countryName = (code: string) => (lang() === "vi" ? country(code)[2] : country(code)[1]);
export const wxName = (w: string) => t("wx." + w);

let wxNow = "sunny";
const wxCache: Record<string, string> = {};
export function pickWx() { wxNow = rand(country(S.p.country)[3]); }
function buildWx(kind: string) {
  const R = (a: number, b: number) => (a + Math.random() * (b - a)).toFixed(2);
  const cloud = (top: number, sc: number, dur: number, delay: number) => `<div class="cloud" style="top:${top}%;--s:${sc};animation-duration:${dur}s;animation-delay:-${delay}s"></div>`;
  let h = "";
  if (kind === "sunny") h = `<div class="wsun"></div><div class="hill wh1"></div><div class="hill wh2"></div>` + cloud(16, 0.8, 70, 12) + cloud(34, 0.6, 95, 55);
  if (kind === "rain") { h = cloud(5, 1.1, 80, 8) + cloud(11, 0.9, 95, 45); for (let i = 0; i < 46; i++) h += `<i class="drop" style="left:${R(0, 115)}%;animation-delay:-${R(0, 1.2)}s;animation-duration:${R(0.7, 1.1)}s;opacity:${R(0.35, 0.75)}"></i>`; }
  if (kind === "snow") { for (let i = 0; i < 34; i++) { const z = R(3, 7); h += `<i class="flake" style="left:${R(0, 100)}%;width:${z}px;height:${z}px;animation-delay:-${R(0, 12)}s;animation-duration:${R(8, 14)}s"></i>`; } }
  if (kind === "cloudy") h = cloud(6, 1.2, 70, 5) + cloud(18, 0.8, 90, 40) + cloud(32, 1, 110, 70) + cloud(48, 0.7, 85, 20) + cloud(64, 0.9, 100, 60);
  if (kind === "leaves") { for (let i = 0; i < 13; i++) h += `<i class="leaf" style="left:${R(0, 95)}%;animation-delay:-${R(0, 12)}s;animation-duration:${R(9, 15)}s;font-size:${R(14, 22)}px">${Math.random() < 0.5 ? "🍂" : "🍁"}</i>`; }
  return `<div class="wx wx-${kind}" aria-hidden="true">${h}</div>`;
}
export function wxHTML() { return wxCache[wxNow] || (wxCache[wxNow] = buildWx(wxNow)); }
export function wxOverlay() { return S.set.wx && !DEMO ? wxHTML() : ""; } // ?demo=1: no weather on the video
export function updateWeather() { const m = $("#wxTown"); if (m) m.innerHTML = wxOverlay(); }
