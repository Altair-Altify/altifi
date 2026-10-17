/* ---------- Learn tab: Alti Lion greeting + Duolingo-style path for the 5 areas ----------
 * No forced order (design doc 3.2): every written lesson is open; the "START" tag marks a suggestion only. */
import { esc } from "../core/util";
import { S, PO, defaultM } from "../core/state";
import { reg } from "../core/actions";
import { t, tx } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { DOMAINS, isReal, findLesson, ALL_LESSONS } from "../content/domains";
import { sheet, closeSheet, minitoast } from "./fx";
import { setCtx } from "../assistant/context";
import { reviewCard } from "../lesson/player";

export function homeFirst(isStatic: boolean) {
  if (JSON.stringify(S.m) === JSON.stringify(defaultM())) return t("home.firstDefault", { name: S.m.name });
  const pep = t("home.pep").split("|");
  return isStatic ? pep[Object.keys(S.lessons).length % pep.length] : t("home.first", { name: S.m.name });
}

const suggested = () => ALL_LESSONS.find((l) => !S.lessons[l.id]);

export function learnView() {
  let h = "";
  if (S.set.inter) {
    const bubble = PO() ? `<div class="bubble">${esc(homeFirst(true))}</div>` : `<div class="bubble talk" id="homeTalk"></div>`;
    h = `<div class="hello"><button class="mascotbtn" onclick="A.openCustom()" aria-label="${t("bd.customizeAria")}">${lion(84)}<span class="editdot">✏️</span></button>${bubble}</div>`;
  }
  h += `<div class="lhead"><h2>${t("learn.title")}</h2><p class="muted">${t("learn.sub")}</p></div>`;
  const sug = suggested();
  DOMAINS.forEach((d, di) => {
    const real = d.lessons.filter(isReal), done = real.filter((l) => S.lessons[l.id]).length;
    h += `<div class="unit" style="background:${d.color}"><small>${t("learn.domain", { n: di + 1 })} · ${t("learn.lessons", { done, total: d.lessons.length })}</small><h3>${d.icon} ${tx(d.title)}</h3><div style="font-weight:700;font-size:13px;opacity:.9">${tx(d.desc)}</div></div><div class="path">`;
    d.lessons.forEach((l, k) => {
      const off = [0, -50, 50, 0][k % 4];
      const rec = S.lessons[l.id];
      const st = !isReal(l) ? "locked soon" : rec ? "done" : sug && sug.id === l.id ? "current" : "open";
      const stars = rec ? `<span class="nstars">${"★".repeat(rec.stars)}${"☆".repeat(3 - rec.stars)}</span>` : "";
      h += `<button class="node ${st}" style="margin-left:${off * 2}px;${st === "current" || st === "open" ? `background:${d.color}` : ""}" onclick="A.openLessonCard('${l.id}')" aria-label="${esc(tx(l.title))}">
        ${st === "current" ? `<span class="tag">${t("c.start")}</span>` : ""}${st.startsWith("locked") ? "🔜" : rec ? "⭐" : l.icon}${stars}${rec?.deep ? '<span class="ndeep">🔬</span>' : ""}</button>
        <div class="nlabel" style="margin-left:${off * 2}px">${esc(tx(l.title))}</div>`;
    });
    h += "</div>";
  });
  return h;
}

export function learnCtx() {
  setCtx({ key: "tab:learn", where: t("as.whereLearn"), title: t("learn.title"), short: t("learn.sub"), answered: true, kb: ["budget", "inflation", "compound", "breakeven"] });
}

/** Bottom sheet when a node is tapped: what's inside, "Good to know first", 1-minute refresher, Basic / Deep dive. */
function openLessonCard(id: string) {
  const les = findLesson(id);
  if (!les) {
    const stub = DOMAINS.flatMap((d) => d.lessons).find((l) => l.id === id);
    return minitoast(`${stub?.icon || ""} ${t("c.soon")}`), sheet(`<div style="display:inline-block">${lion(70, "wow")}</div><h2>${stub ? esc(tx(stub.title)) : ""}</h2><p class="muted" style="font-weight:700">${t("learn.soonDay")}</p>`, [[t("learn.gotIt"), "A.closeSheet()", "ghost"]]);
  }
  const rec = S.lessons[id];
  const hasVideo = les.steps.some((s) => s.t === "video");
  const meta = `${les.minutes} min · ${t("learn.steps", { n: les.steps.length })}${hasVideo ? ` · 🎬 ${t("learn.hasVideo")}` : ""}`;
  const prereq = les.prereq ? `<div class="prereq"><b>📌 ${t("learn.prereq")}:</b> ${tx(les.prereq)} <button class="linkbtn inline" onclick="A.openReview('${id}')">⚡ ${t("learn.review")}</button></div>` : `<button class="linkbtn" onclick="A.openReview('${id}')">⚡ ${t("learn.review")}</button>`;
  const btns: Array<[string, string, string?]> = [[`${rec ? "↻ " : ""}${t("learn.startBasic")}`, `A.startLesson('${id}')`, "good"]];
  if (les.deep) btns.push([rec ? t("learn.deep") : t("learn.deepLocked"), rec ? `A.startLesson('${id}',true)` : "", rec ? "sun" : "ghost lockedbtn"]);
  sheet(`<div class="lcard"><div class="lc-ic">${les.icon}</div><div style="flex:1;min-width:0;text-align:left"><h2 style="margin:0">${tx(les.title)}</h2><div class="muted" style="font-weight:800;font-size:13px">${meta}${rec ? ` · ${"★".repeat(rec.stars)}` : ""}</div></div></div>
    <p class="muted" style="font-weight:700;text-align:left">${tx(les.desc)}</p>${prereq}`, btns);
  document.querySelector(".lockedbtn")?.setAttribute("disabled", "");
}
function openReview(id: string) {
  const les = findLesson(id);
  if (!les) return;
  sheet(reviewCard(les), [[t("learn.gotIt"), `A.openLessonCard('${id}')`, "good"]]);
}

reg({ openLessonCard, openReview, closeLessonCard: () => closeSheet() });
