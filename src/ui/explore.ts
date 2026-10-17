/* ---------- Explore tab (design doc section 4) ----------
 * Day 18: the tab exists in the new navigation with the planned stories; the articles themselves come on 23/10. */
import { t, tx } from "../i18n/i18n";
import { lion } from "../mascot/lion";

const PLANNED = [
  { e: "🚀", c: "#3D5AFE", title: { vi: "SpaceX: vì sao công ty chưa niêm yết vẫn được định giá rất cao?", en: "SpaceX: how can an unlisted company be valued so highly?" }, tag: { vi: "Công ty · Định giá", en: "Company · Valuation" } },
  { e: "🏦", c: "#0E9F9A", title: { vi: "Ngân hàng trung ương tăng lãi suất: người vay & người gửi được – mất gì?", en: "A central bank hikes rates: who wins, who loses?" }, tag: { vi: "Vĩ mô · Lãi suất", en: "Macro · Rates" } },
  { e: "🌏", c: "#EF4E4E", title: { vi: "Khủng hoảng tài chính châu Á 1997", en: "The 1997 Asian financial crisis" }, tag: { vi: "Khủng hoảng · Tỷ giá", en: "Crisis · FX" } },
  { e: "🥇", c: "#F2A33A", title: { vi: "Vì sao giá vàng tăng khi thị trường bất ổn?", en: "Why does gold rise when markets get scary?" }, tag: { vi: "Đầu tư · Tài sản", en: "Investing · Assets" } },
  { e: "🇻🇳", c: "#2BB673", title: { vi: "Một câu chuyện doanh nghiệp Việt Nam", en: "A Vietnamese business story" }, tag: { vi: "Doanh nghiệp · Việt Nam", en: "Business · Vietnam" } },
];

export function exploreView() {
  return `<h2>${t("ex.title")}</h2><p class="muted" style="font-weight:700">${t("ex.sub")}</p>
  <div class="hello" style="margin:12px 0 14px">${lion(56, "wow")}<div class="bubble">${t("ex.soon")} 🗞️</div></div>
  ${PLANNED.map((a) => `<div class="card excard soonc"><div class="exic" style="background:${a.c}">${a.e}</div><div style="flex:1;min-width:0"><div class="pill">${tx(a.tag)}</div><h3 style="margin-top:6px">${tx(a.title)}</h3><span class="soonpill">${t("c.soon")}</span></div></div>`).join("")}`;
}
