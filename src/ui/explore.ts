/* ---------- Explore tab (design doc section 4) ----------
 * Articles live in content/explore.ts. Layout: one big hero card + a 2-column grid of smaller cards (10c.4: varied card sizes).
 * Reading an article opens the overlay: summary → what happened → why it matters → every side → quiz → sources → Ask Alti Lion. */
import { t, tx, type TL } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import { icon } from "./icons";
import { illus } from "./scenes";
import { realImage } from "./realimage";
import { reg } from "../core/actions";
import { openO, closeO, setOvRerender } from "./shell";
import { setCtx } from "../assistant/context";
import { ARTICLES, PLANNED_EX, type Article } from "../content/explore";

type Card = { ic: string; c: string; imageQuery: string; imageFile?: string; title: TL; tag: TL };

const photo = (a: Card, ratio: string) =>
  realImage({ query: a.imageQuery, file: a.imageFile || undefined }, illus(icon(a.ic, { size: 56, color: "#fff", tint: 0.35 }), a.c), { ratio, cls: "excover" });

const meta = (a: Article) => `<span class="exmeta">${icon("clock", { size: 13 })} ${t("gx.minutes", { n: a.minutes })}</span>`;

export function exploreView() {
  const [first, ...rest] = ARTICLES;
  const card = (a: Article) => `<article class="card exsmall tap" role="button" tabindex="0" onclick="A.exOpen('${a.id}')">${photo(a, "4/3")}<div class="exbody"><span class="pill">${tx(a.tag)}</span><h3>${tx(a.title)}</h3>${meta(a)}</div></article>`;
  const soon = (a: Card) => `<article class="card exsmall exsoon">${photo(a, "4/3")}<div class="exbody"><span class="pill">${tx(a.tag)}</span><h3>${tx(a.title)}</h3><span class="soonpill">${icon("clock", { size: 13 })} ${t("c.soon")}</span></div></article>`;
  return `<h2 class="title">${t("ex.title")}</h2><p class="muted" style="font-weight:700">${t("ex.sub")}</p>
  <div class="hello" style="margin:12px 0 14px">${lion(56, "wow")}<div class="bubble">${t("ex.hello")} 🗞️</div></div>
  <article class="card exhero tap" role="button" tabindex="0" onclick="A.exOpen('${first.id}')">${photo(first, "16/10")}<div class="exbody"><span class="pill">${tx(first.tag)}</span><h3>${tx(first.title)}</h3><p class="exsumm">${tx(first.summary)}</p>${meta(first)}</div></article>
  <div class="exgrid">${rest.map(card).join("")}${PLANNED_EX.map(soon).join("")}</div>`;
}

/* ---------- reading an article ---------- */
let cur: Article | null = null;
let picks: (number | undefined)[] = [];

function readHTML(a: Article) {
  const quiz = a.quiz.map((q, qi) => {
    const p = picks[qi];
    return `<div class="card exq"><b>${qi + 1}. ${tx(q.q)}</b><div class="exopts">${q.o.map((o, oi) => {
      const cls = p === undefined ? "" : oi === q.a ? "right" : oi === p ? "wrong" : "dim";
      return `<button class="exopt ${cls}" ${p !== undefined ? "disabled" : ""} onclick="A.exAns(${qi},${oi})">${tx(o)}</button>`;
    }).join("")}</div>${p !== undefined ? `<p class="exwhy ${p === q.a ? "ok" : "no"}"><b>${p === q.a ? t("ex.ok") : t("ex.no")}</b> ${tx(q.why)}</p>` : ""}</div>`;
  }).join("");
  return `<div class="ohead"><button class="x" onclick="A.exClose()" aria-label="${t("c.close")}">${icon("close", { size: 26 })}</button><b class="exhead">${t("ex.title")}</b></div>
  <div class="obody exread">
    ${photo(a, "16/9")}
    <span class="pill">${tx(a.tag)}</span>${meta(a)}
    <h2 class="extitle">${tx(a.title)}</h2>
    <div class="card exsum"><div class="exlbl">⏱️ ${t("ex.sum30")}</div><p>${tx(a.summary)}</p></div>
    <h3>${t("ex.happened")}</h3>${a.happened.map((p) => `<p>${tx(p)}</p>`).join("")}
    <h3>${t("ex.matters")}</h3>${a.matters.map((p) => `<p>${tx(p)}</p>`).join("")}
    <h3>${t("ex.sides")}</h3><div class="exsides">${a.sides.map(([e, who, view]) => `<div class="card exside"><span class="e">${e}</span><div><b>${tx(who)}</b><p>${tx(view)}</p></div></div>`).join("")}</div>
    <h3>${t("ex.quiz")}</h3>${quiz}
    <h3>${t("ex.sources")}</h3><ul class="exsrc">${a.sources.map((s) => `<li>${tx(s)}</li>`).join("")}</ul>
    <p class="muted exdraft">${t("ex.draft")}</p>
    <div class="exbtns"><button class="btn good" onclick="A.openAssistant()">${t("ex.ask")}</button>${a.lesson ? `<button class="btn" onclick="A.exLesson()">${t("ex.lesson")}</button>` : ""}</div>
  </div>`;
}

function show() {
  if (!cur) return;
  const top = document.querySelector<HTMLElement>("#overlay .obody")?.scrollTop ?? 0;
  openO(readHTML(cur));
  const b = document.querySelector<HTMLElement>("#overlay .obody");
  if (b) b.scrollTop = top;
}

function exOpen(id: string) {
  const a = ARTICLES.find((x) => x.id === id);
  if (!a) return;
  if (cur?.id !== id) picks = [];
  cur = a;
  openO(readHTML(a));
  setOvRerender(show);
  setCtx({ key: "ex:" + a.id, where: t("as.whereExplore"), title: tx(a.title), short: tx(a.summary), long: [...a.happened, ...a.matters].map((p) => tx(p)).join(" "), answered: true, kb: a.kb });
}

reg({
  exOpen,
  exAns(qi: number, oi: number) { if (!cur || picks[qi] !== undefined) return; picks[qi] = oi; show(); },
  exClose() { cur = null; closeO(); },
  exLesson() { const id = cur?.lesson; if (!id) return; cur = null; (window as any).A.startLesson(id); },
});
