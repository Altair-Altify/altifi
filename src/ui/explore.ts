/* ---------- Explore tab (design doc section 4) ----------
 * The articles themselves come on 23/10; the planned stories already show real photos (RealImage, design doc 10c.8).
 * Layout: one big hero card + a 2-column grid of smaller cards (10c.4: varied card sizes). */
import { t, tx } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { icon } from "./icons";
import { illus } from "./scenes";
import { realImage } from "./realimage";

/* imageQuery = Commons search words; imageFile = pin a specific file once the team has picked one (copy it with ?pick=1). */
const PLANNED = [
  { ic: "rocket", c: "#3D5AFE", imageQuery: "Falcon 9 launch", imageFile: "", title: { vi: "SpaceX: vì sao công ty chưa niêm yết vẫn được định giá rất cao?", en: "SpaceX: how can an unlisted company be valued so highly?" }, tag: { vi: "Công ty · Định giá", en: "Company · Valuation" } },
  { ic: "bank", c: "#0E9F9A", imageQuery: "Federal Reserve Eccles Building", imageFile: "", title: { vi: "Ngân hàng trung ương tăng lãi suất: ai được, ai mất?", en: "A central bank hikes rates: who wins, who loses?" }, tag: { vi: "Vĩ mô · Lãi suất", en: "Macro · Rates" } },
  { ic: "globe", c: "#EF4E4E", imageQuery: "Bangkok skyline 1990s", imageFile: "", title: { vi: "Khủng hoảng tài chính châu Á 1997", en: "The 1997 Asian financial crisis" }, tag: { vi: "Khủng hoảng · Tỷ giá", en: "Crisis · FX" } },
  { ic: "coin", c: "#F2A33A", imageQuery: "gold bars", imageFile: "", title: { vi: "Vì sao giá vàng tăng khi thị trường bất ổn?", en: "Why does gold rise when markets get scary?" }, tag: { vi: "Đầu tư · Tài sản", en: "Investing · Assets" } },
  { ic: "shop", c: "#2BB673", imageQuery: "Ho Chi Minh City skyline", imageFile: "", title: { vi: "Một câu chuyện doanh nghiệp Việt Nam", en: "A Vietnamese business story" }, tag: { vi: "Doanh nghiệp · Việt Nam", en: "Business · Vietnam" } },
];

const photo = (a: (typeof PLANNED)[number], ratio: string) =>
  realImage({ query: a.imageQuery, file: a.imageFile || undefined }, illus(icon(a.ic, { size: 56, color: "#fff", tint: 0.35 }), a.c), { ratio, cls: "excover" });

export function exploreView() {
  const [first, ...rest] = PLANNED;
  return `<h2 class="title">${t("ex.title")}</h2><p class="muted" style="font-weight:700">${t("ex.sub")}</p>
  <div class="hello" style="margin:12px 0 14px">${lion(56, "wow")}<div class="bubble">${t("ex.soon")} 🗞️</div></div>
  <article class="card exhero">${photo(first, "16/10")}<div class="exbody"><span class="pill">${tx(first.tag)}</span><h3>${tx(first.title)}</h3><span class="soonpill">${icon("clock", { size: 13 })} ${t("c.soon")}</span></div></article>
  <div class="exgrid">${rest.map((a) => `<article class="card exsmall">${photo(a, "4/3")}<div class="exbody"><span class="pill">${tx(a.tag)}</span><h3>${tx(a.title)}</h3></div></article>`).join("")}</div>`;
}
