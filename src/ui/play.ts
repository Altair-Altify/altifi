/* ---------- Play tab (design doc section 6) — replaces the base demo's "Crisis Game" tab ----------
 * Day 18: navigation + mode overview. World map (19/10), Personal (20/10), Business (21/10), Crisis Museum (22/10). */
import { shortVnd } from "../core/util";
import { S } from "../core/state";
import { t, tx, lang } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { DOMAINS } from "../content/domains";

const MODES: Record<string, { name: { vi: string; en: string }; role: { vi: string; en: string }; day: string }> = {
  personal: { name: { vi: "Cuộc sống của tôi", en: "My Life" }, role: { vi: "Đi làm, lập ngân sách, tiết kiệm, tín dụng, bảo hiểm", en: "Work, budget, save, credit, insurance" }, day: "20/10" },
  corporate: { name: { vi: "Doanh nghiệp của tôi", en: "My Business" }, role: { vi: "Mở & điều hành doanh nghiệp, mở chi nhánh trên bản đồ", en: "Start & run a business, open branches on the map" }, day: "21/10" },
  markets: { name: { vi: "Nhà đầu tư", en: "The Investor" }, role: { vi: "Quản lý danh mục trong thị trường mô phỏng", en: "Manage a portfolio in a simulated market" }, day: "22/10" },
  public: { name: { vi: "Bộ trưởng Tài chính", en: "Finance Minister" }, role: { vi: "Chia ngân sách, chỉnh thuế khi kinh tế nóng/lạnh", en: "Split the budget, set taxes as the economy heats or cools" }, day: "22/10" },
  intl: { name: { vi: "Xuất nhập khẩu", en: "Import–Export" }, role: { vi: "Sống sót qua biến động tỷ giá", en: "Survive exchange-rate swings" }, day: "22/10" },
};
const RATING = [["!!", "#1BADA6"], ["!", "#2BB673"], ["★", "#7CB342"], ["!?", "#8E9BFF"], ["?!", "#F2A33A"], ["??", "#EF4E4E"]];

export function playView() {
  const nw = S.game ? `<b class="nwbig">${shortVnd(S.game.netWorth, lang())}</b>` : `<span class="muted" style="font-weight:800">${t("pl.nwNone")}</span>`;
  return `<h2>${t("pl.title")}</h2><p class="muted" style="font-weight:700">${t("pl.sub")}</p>
  <div class="card nwcard"><div class="muted" style="font-size:12px;font-weight:900;letter-spacing:.5px">💰 ${t("pl.nw").toUpperCase()}</div>${nw}</div>
  <div class="hello" style="margin-bottom:14px">${lion(56)}<div class="bubble">${t("pl.mapSoon")}</div></div>
  <div class="sub">${t("pl.modes")}</div>
  ${DOMAINS.map((d) => { const m = MODES[d.id]; return `<div class="card modecard soonc"><div class="exic" style="background:${d.color}">${d.icon}</div><div style="flex:1;min-width:0"><div class="pill">${tx(d.title)}</div><h3 style="margin-top:6px">${tx(m.name)}</h3><div class="muted" style="font-size:13px;font-weight:700">${tx(m.role)}</div><span class="soonpill">${t("c.soon")} · ${m.day}</span></div></div>`; }).join("")}
  <div class="card modecard soonc museum"><div class="exic" style="background:#8A5A44">🏛️</div><div style="flex:1;min-width:0"><h3>${t("pl.crisis")}</h3><div class="muted" style="font-size:13px;font-weight:700">${t("pl.crisisSub")}</div><span class="soonpill">${t("c.soon")} · 22/10</span></div></div>
  <div class="card" style="background:var(--sunbg);border-color:var(--sunline)"><h3>${t("pl.rating")}</h3><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">${RATING.map(([s, c]) => `<span class="badge mini" style="background:${c}">${s}</span>`).join("")}</div></div>`;
}
