/* ---------- Play tab (design doc section 6) — replaces the base demo's "Crisis Game" tab ----------
 * Day 18: navigation + mode overview. Low-poly town (20/10), Personal (21/10), Business (22/10), one crisis (23/10) — design doc 13.6. */
import { shortVnd, esc } from "../core/util";
import { S, PO, noMotion, lessonsDone } from "../core/state";
import { reg } from "../core/actions";
import { openTown } from "./town";
import { HomeSpace } from "../galaxy/home";
import { t, tx, lang } from "../i18n/i18n";
import { DOMAINS } from "../content/domains";
import { icon, IC } from "./icons";
import { illus } from "./scenes";
import { realImage } from "./realimage";

/* Crisis Museum rooms (design doc 6.4) — real archive photos via RealImage.
 * No spoilers: the room card shows a neutral "before" photo (imageQuery); the photo of what happened next
 * (revealQuery, the queries from design doc 10c.8) is for the "What really happened" step of the crisis mode (22/10). */
const ROOMS = [
  { year: 1929, c: "#8A5A44", ic: "chart", imageQuery: "New York Stock Exchange 1920s", revealQuery: "1931 soup kitchen line Chicago", imageFile: "", sub: { vi: "Phố Wall, mùa thu — cổ phiếu đã tăng gấp đôi", en: "Wall Street, autumn — stocks have doubled" } },
  { year: 1973, c: "#E07B22", ic: "drop", imageQuery: "1970s delivery truck", revealQuery: "1973 gas station no gas sign", imageFile: "", sub: { vi: "Một công ty giao hàng chạy bằng xăng", en: "A delivery company that runs on fuel" } },
  { year: 2008, c: "#3D5AFE", ic: "house", imageQuery: "suburban houses United States 2000s", revealQuery: "Lehman Brothers headquarters", imageFile: "", sub: { vi: "Một ngân hàng cho vay mua nhà rất nhiều", en: "A bank with lots of home loans" } },
];

const MODES: Record<string, { name: { vi: string; en: string }; role: { vi: string; en: string }; day: string }> = {
  personal: { name: { vi: "Cuộc sống của tôi", en: "My Life" }, role: { vi: "Đi làm, lập ngân sách, tiết kiệm, tín dụng, bảo hiểm", en: "Work, budget, save, credit, insurance" }, day: "21/10" },
  corporate: { name: { vi: "Doanh nghiệp của tôi", en: "My Business" }, role: { vi: "Mở & điều hành doanh nghiệp, mở chi nhánh trên bản đồ", en: "Start & run a business, open branches on the map" }, day: "22/10" },
  macro: { name: { vi: "Thống đốc NHTW", en: "Central Bank Governor" }, role: { vi: "Xoay núm lãi suất khi lạm phát tăng mà vẫn giữ việc làm", en: "Turn the interest-rate dial to tame inflation without killing jobs" }, day: "23/10" },
  markets: { name: { vi: "Nhà đầu tư", en: "The Investor" }, role: { vi: "Quản lý danh mục trong thị trường mô phỏng", en: "Manage a portfolio in a simulated market" }, day: "24–26/10" },
  public: { name: { vi: "Bộ trưởng Tài chính", en: "Finance Minister" }, role: { vi: "Chia ngân sách, chỉnh thuế khi kinh tế nóng/lạnh", en: "Split the budget, set taxes as the economy heats or cools" }, day: "24–26/10" },
  intl: { name: { vi: "Xuất nhập khẩu", en: "Import–Export" }, role: { vi: "Sống sót qua biến động tỷ giá", en: "Survive exchange-rate swings" }, day: "24–26/10" },
};
const RATING = [["!!", "#1BADA6"], ["!", "#2BB673"], ["★", "#7CB342"], ["!?", "#8E9BFF"], ["?!", "#F2A33A"], ["??", "#EF4E4E"]];

export function playView() {
  const nw = S.game ? `<b class="nwbig">${shortVnd(S.game.netWorth, lang())}</b>` : `<span class="muted" style="font-weight:800">${t("pl.nwNone")}</span>`;
  return `<section class="homesp"><div class="hs-stage" id="hsStage" role="button" tabindex="0" onclick="A.goTown()" onkeydown="if(event.key==='Enter')A.goTown()" aria-label="${esc(t("pl.homeAria"))}"></div>
    <div class="hs-cap"><div class="hs-k">${t("gx.home")}</div><h2 class="title">${t("pl.homeT")}</h2><button class="btn sun hs-go" onclick="A.goTown()">${icon("rocket", { size: 20, tint: 0.35 })} ${t("pl.goTown")}</button></div></section>
  <p class="muted onsky" style="font-weight:700">${t("pl.sub")}</p>
  <div class="card nwcard"><div class="muted" style="font-size:12px;font-weight:900;letter-spacing:.5px;display:flex;align-items:center;gap:6px">${icon("wallet", { size: 18, color: IC.wallet })} ${t("pl.nw").toUpperCase()}</div>${nw}</div>
  <div class="sub onsky">${t("pl.modes")}</div>
  ${DOMAINS.map((d) => { const m = MODES[d.id]; return `<div class="card modecard soonc"><div class="exic" style="background:${d.color}">${icon(d.ic, { size: 28, color: "#fff", tint: 0.35 })}</div><div style="flex:1;min-width:0"><div class="pill">${tx(d.title)}</div><h3 style="margin-top:6px">${tx(m.name)}</h3><div class="muted" style="font-size:13px;font-weight:700">${tx(m.role)}</div><span class="soonpill">${t("c.soon")} · ${m.day}</span></div></div>`; }).join("")}
  <div class="sub museum-h onsky">${icon("bank", { size: 18 })} ${t("pl.crisis")}</div><p class="muted onsky" style="font-size:13px;font-weight:700;margin-top:-4px">${t("pl.crisisSub")}</p>
  <div class="rooms">${ROOMS.map((r) => `<article class="card room">${realImage({ query: r.imageQuery, file: r.imageFile || undefined }, illus(icon(r.ic, { size: 44, color: "#fff", tint: 0.35 }), r.c), { ratio: "4/3", cls: "roomimg" })}<div class="roomyr" style="background:${r.c}">${r.year}</div><div class="exbody"><div class="muted" style="font-size:12.5px;font-weight:800">${tx(r.sub)}</div><span class="soonpill">${t("c.soon")} · 22/10</span></div></article>`).join("")}</div>
  <div class="card" style="background:var(--sunbg);border-color:var(--sunline)"><h3>${t("pl.rating")}</h3><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">${RATING.map(([s, c]) => `<span class="badge mini" style="background:${c}">${s}</span>`).join("")}</div></div>`;
}

/* ---------- home planet in space → dive → town (design doc 13.1b-6) ---------- */
let hs: HomeSpace | null = null, hsFailed = false;
const hsHost = document.createElement("div");
hsHost.className = "hs-host";
/** Called by the shell after the Play tab's HTML is in the page. */
export function afterPlayRender() {
  if (!document.getElementById("hsStage") || hsFailed) return;
  // WebGL setup (context + planet mesh) is the heavy part: do it after the pane has faded in, never inside the tab switch
  clearTimeout(setupTimer);
  setupTimer = setTimeout(setupHome, hs ? 0 : 320);
}
let setupTimer: ReturnType<typeof setTimeout> | undefined;
function setupHome() {
  const stage = document.getElementById("hsStage");
  if (!stage || hsFailed) return;
  if (!hs) {
    try {
      hs = new HomeSpace(hsHost, () => !hsHost.isConnected || !hsHost.closest(".pane.on") || document.hidden || !!document.querySelector(".phone.ov"), PO());
      hsHost.appendChild(hs.canvas);
      new ResizeObserver(() => hs?.resize()).observe(hsHost);
    } catch { hsFailed = true; stage.classList.add("nogl"); return; }
    if (!noMotion()) hs.approach(); // first visit: the camera glides in as the planet appears
  }
  stage.appendChild(hsHost);
  hs.set(document.body.classList.contains("night"), PO(), !noMotion(), Math.min(16, 2 + lessonsDone() * 2 + (S.game ? 2 : 0)));
  hs.resize();
  hs.start();
}
let nearTimer: ReturnType<typeof setTimeout> | undefined;
/** Called by the shell whenever the Play pane becomes visible. The camera approach starts only once the pane has
 * finished fading in (~300ms), so the tab switch itself never waits on WebGL. */
export function playShown(entering: boolean) {
  if (!hs) return;
  hs.wake(); // size is kept by the ResizeObserver
  clearTimeout(nearTimer);
  if (entering && !noMotion()) nearTimer = setTimeout(() => { if (hsHost.closest(".pane.on")) hs?.approach(); }, 300);
}
function goTown() {
  if (hs && !hsFailed) hs.dive(openTown); else openTown();
}
reg({ goTown });
