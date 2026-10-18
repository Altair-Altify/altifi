/* ---------- Lesson player: reads lesson data and runs every exercise type ----------
 * Exercise engine from altifi-prototype.html (learn, pick, mcq, sort, match, order, slider, jars, spot, tap)
 * + new types for deeper content: video, chart, calc, statement, explain, predict.
 * Wrapped in the base demo's UX: talking Alti Lion, emotions, push/shake/wave effects, confetti, hearts, result pop-up. */
import { $, esc, shuffle, vnd, shortVnd, fmtNum, fmtTime, clamp, rand } from "../core/util";
import { S, save, PO, MAX_HEARTS, addXP } from "../core/state";
import { reg } from "../core/actions";
import { t, tx, lang, type TL } from "../i18n/i18n";
import { lion } from "../mascot/lion";
import type { Lesson, Step, Unit, ChartDef, Sheet } from "./types";
import { videoHTML, mountVideo, stopVideo } from "./video";
import { icon, IC } from "../ui/icons";
import { realImage } from "../ui/realimage";
import { openO, closeO, resultPopup, setOvRerender } from "../ui/shell";
import { bud, emote, react, startTalk, stopTalk, paintTalk, confetti, sheet, closeSheet, LINES, REACT, minitoast } from "../ui/fx";
import { setCtx } from "../assistant/context";
import { showTipPop } from "../assistant/assistant";
import { findLesson, ALL_LESSONS } from "../content/domains";

type St = Record<string, any>;
let L: null | {
  les: Lesson; deep: boolean; steps: Step[]; s: number; ok: number; graded: number;
  checked: boolean; right: boolean; st: St; t0: number; broke: number; outShown: boolean; videoDone: Record<number, boolean>;
} = null;

const cur = () => L!.steps[L!.s];
const isGraded = (st: Step) => !["learn", "video", "predict"].includes(st.t);

/* ---------- formatting ---------- */
export function fmtUnit(v: number, unit: Unit = "vnd") {
  const lg = lang();
  switch (unit) {
    case "vnd": return vnd(v, lg);
    case "mvnd": return shortVnd(v, lg);
    case "pct": return fmtNum(v, lg, 2) + "%";
    case "yr": return fmtNum(v, lg, 1) + (lg === "vi" ? " năm" : v === 1 ? " year" : " years");
    case "cups": return fmtNum(v, lg) + (lg === "vi" ? " ly" : " cups");
    default: return fmtNum(v, lg, 2);
  }
}
/** Accepts "1.800.000", "1,800,000", "1 800 000", "1,92", "1.92", "-0,3". */
export function parseNum(raw: string): number | null {
  let s = String(raw).trim().replace(/[\s₫%]|đ|vnd|tr|triệu|million|m/gi, "");
  if (!s) return null;
  const neg = /^[-−]/.test(s);
  s = s.replace(/^[-−+]/, "");
  if (/^\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, "");
  else if (/^\d+[.,]\d+$/.test(s)) s = s.replace(",", ".");
  else if (!/^\d+$/.test(s)) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : neg ? -n : n;
}
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");

/* ---------- hearts ---------- */
function heartsHTML(breaking: number) {
  if (L?.les.kind === "placement") return "";
  const full = icon("heart", { size: 22, color: IC.heart, tint: 1 });
  let h = full.repeat(S.hearts);
  const lost = MAX_HEARTS - S.hearts;
  for (let i = 0; i < lost; i++) h += i < breaking ? `<span class="breaking">${icon("heartBroken", { size: 22, color: IC.heart })}</span>` : `<span class="hgone">${icon("heart", { size: 22, color: "var(--lockd)", tint: 0.4 })}</span>`;
  return `<span class="lhearts" role="img" aria-label="${S.hearts}/${MAX_HEARTS} ♥">${h}</span>`;
}
/** Remember where the user is, so the home screen can offer "Continue". */
function trackProgress() {
  if (!L || L.les.kind === "placement") return;
  S.inprog = { id: L.les.id, deep: L.deep, s: L.s, n: L.steps.length };
  save();
}

/* ---------- start / intro ---------- */
/** from = step to resume at (the home "Continue" card). */
export function startLesson(id: string, deep = false, from = 0) {
  const les = findLesson(id);
  if (!les) return;
  closeSheet();
  const steps = deep && les.deep ? les.deep : les.steps;
  L = { les, deep: deep && !!les.deep, steps, s: Math.max(0, Math.min(from, steps.length - 1)), ok: 0, graded: 0, checked: false, right: false, st: {}, t0: Date.now(), broke: 0, outShown: false, videoDone: {} };
  bud.mood = "happy";
  initStep();
  trackProgress();
  lessonRender();
  setOvRerender(() => lessonRender());
  if (!PO()) startTalk("lessonTalk", LINES.lesson, t("lesson.letsgo"));
}

function initStep() {
  const st = cur();
  L!.checked = false; L!.right = false; L!.st = {}; L!.broke = 0;
  const s = L!.st;
  switch (st.t) {
    case "pick": s.sel = null; break;
    case "mcq": case "chart": s.order = shuffle(st.o.map((_, k) => k)); s.sel = null; break;
    case "statement": if (st.o) s.order = shuffle(st.o.map((_, k) => k)); s.sel = st.o ? null : []; break;
    case "sort": s.items = shuffle(st.items); s.idx = 0; s.res = []; s.busy = false; break;
    case "match": s.left = shuffle(st.pairs.map((_, k) => k)); s.rightO = shuffle(st.pairs.map((_, k) => k)); s.done = []; s.miss = 0; s.sl = null; s.sr = null; s.bad = null; break;
    case "order": s.pool = shuffle(st.items.map((_, k) => k)); s.picked = []; break;
    case "slider": case "predict": s.v = st.start ?? st.min; break;
    case "jars": s.vals = st.jars.map(() => 0); break;
    case "spot": case "tap": s.sel = []; break;
    case "calc": s.vals = st.parts.map(() => ""); break;
    case "explain": s.text = ""; break;
  }
}

/* ---------- charts (SVG, theme-aware) ---------- */
export function chartSVG(c: ChartDef, w = 320, h = 190) {
  const pad = { l: 34, r: 10, t: 12, b: 40 };
  const all = c.series.flatMap((s) => s.data);
  const max = Math.max(...all) * 1.08, min = Math.min(0, ...all);
  const X = (i: number, n: number) => pad.l + (c.kind === "bar" ? ((i + 0.5) / n) : n === 1 ? 0.5 : i / (n - 1)) * (w - pad.l - pad.r);
  const Y = (v: number) => pad.t + (1 - (v - min) / (max - min || 1)) * (h - pad.t - pad.b);
  const n = c.labels.length;
  let g = "";
  for (let k = 0; k <= 4; k++) {
    const v = min + ((max - min) * k) / 4, y = Y(v);
    g += `<line x1="${pad.l}" x2="${w - pad.r}" y1="${y}" y2="${y}" class="ch-grid"/><text x="${pad.l - 4}" y="${y + 3}" text-anchor="end" class="ch-ax">${fmtNum(Math.round(v * 10) / 10, lang(), 1)}</text>`;
  }
  c.labels.forEach((lb, i) => { g += `<text x="${X(i, n)}" y="${h - pad.b + 14}" text-anchor="middle" class="ch-ax">${esc(tx(lb))}</text>`; });
  if (c.kind === "bar") {
    const gw = (w - pad.l - pad.r) / n, bw = Math.min(22, (gw * 0.8) / c.series.length);
    c.series.forEach((s, si) => s.data.forEach((v, i) => {
      const x = X(i, n) - (bw * c.series.length) / 2 + si * bw, y = Y(v);
      g += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${(Y(min) - y).toFixed(1)}" rx="3" fill="${s.color}" class="ch-bar" style="animation-delay:${i * 80}ms"/>`;
    }));
  } else {
    c.series.forEach((s) => {
      const pts = s.data.map((v, i) => `${X(i, n).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
      g += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" class="ch-line"/>`;
      s.data.forEach((v, i) => { g += `<circle cx="${X(i, n).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.5" fill="${s.color}"/>`; });
    });
  }
  const legend = c.series.map((s) => `<span><i style="background:${s.color}"></i>${esc(tx(s.name))}</span>`).join("");
  return `<div class="chart"><svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(c.series.map((s) => tx(s.name)).join(", "))}">${g}</svg>
    <div class="ch-legend">${legend}${c.y ? `<span class="muted">· ${esc(tx(c.y))}</span>` : ""}</div>${c.source ? `<div class="ch-src">${esc(tx(c.source))}</div>` : ""}</div>`;
}

function sheetHTML(sh: Sheet, tappable: boolean) {
  const s = L!.st;
  return `<div class="fsheet"><div class="fs-title">${tx(sh.title)}</div>${sh.rows.map((r, k) => {
    const id = `${sh.title && tx(sh.title)}|${k}`;
    let c = "fs-row" + (r.bold ? " bold" : "") + (r.sub ? " fs-sub" : "");
    if (tappable) {
      const sel = s.sel.includes(id);
      if (L!.checked) { if (r.flag) c += " isflag"; else if (sel) c += " notflag"; } else if (sel) c += " sel";
    }
    const v = typeof r.v === "number" ? fmtNum(r.v, lang()) : esc(r.v);
    const inner = `<span>${tx(r.l)}</span><b>${v}</b>`;
    return tappable ? `<button class="${c}" onclick="A.lsTapRow('${esc(id).replace(/'/g, "\\'")}')">${inner}</button>` : `<div class="${c}">${inner}</div>`;
  }).join("")}${sh.note ? `<div class="fs-note">${tx(sh.note)}</div>` : ""}</div>`;
}

function optList(st: { o: TL[]; a: number }) {
  const s = L!.st;
  return s.order.map((k: number, pos: number) => {
    let c = "opt";
    if (s.sel === pos) c += " sel";
    if (L!.checked) { if (k === st.a) c += " right"; else if (s.sel === pos) c += " wrong"; }
    return `<button class="${c}" onclick="A.lsSet('sel',${pos})">${tx(st.o[k])}</button>`;
  }).join("");
}

/* ---------- render ---------- */
export function lessonRender(fx?: string) {
  if (!L) return;
  const st = cur(), s = L.st, pct = (L.s / L.steps.length) * 100;
  let body = "", ready = false, auto = false, hint = "";
  switch (st.t) {
    case "learn":
      body = (st.photo ? realImage(st.photo, `<div class="scene">${st.art || ""}</div>`, { ratio: "16/10", cls: "lphoto" }) + (st.cap ? `<div class="cap muted">${tx(st.cap)}</div>` : "")
        : st.img ? `<figure class="limg"><img src="${st.img.src}" alt="${esc(tx(st.img.alt))}" loading="lazy"><figcaption>${tx(st.img.credit)}</figcaption></figure>`
        : st.art ? `<div class="scene"${st.fs ? ` style="font-size:${st.fs}px"` : ""}>${st.art}${st.cap ? `<div class="cap">${tx(st.cap)}</div>` : ""}</div>` : "")
        + `<div class="learnt">${tx(st.title)}</div><div class="ltext">${tx(st.text)}</div>`
        + (st.items ? `<div class="icons3">${st.items.map(([e, l]) => `<div class="card"><div>${e}</div>${tx(l)}</div>`).join("")}</div>` : "")
        + (st.lion ? `<div class="hello" style="margin-top:14px">${lion(48)}<div class="bubble">${tx(st.lion)}</div></div>` : "");
      break;
    case "video":
      body = videoHTML(st.video);
      break;
    case "pick":
      body = `<div class="q">${tx(st.q)}</div><div class="picgrid">${st.opts.map(([e, l], k) => {
        let c = "pic";
        if (s.sel === k) c += " sel" + (fx === "pick" && !PO() ? " pop" : "");
        if (L!.checked) { if (k === st.a) c += " right"; else if (s.sel === k) c += " wrong"; }
        return `<button class="${c}" onclick="A.lsSet('sel',${k})"><div>${e}</div>${tx(l)}</button>`;
      }).join("")}</div>`;
      ready = s.sel !== null;
      break;
    case "mcq":
      body = `<div class="q">${tx(st.q)}</div>` + optList(st);
      ready = s.sel !== null;
      break;
    case "chart":
      body = `<div class="q">${tx(st.q)}</div>${chartSVG(st.chart)}` + optList(st);
      ready = s.sel !== null;
      break;
    case "sort": {
      auto = true; hint = t("lp.sortAll");
      const items = s.items as [string, TL, number][];
      if (!L.checked) {
        const it = items[s.idx];
        body = `<div class="q">${tx(st.q)}</div><div class="sortwrap"><div class="sortcount">${s.idx + 1} / ${items.length}</div><div class="sortcard" id="sc"><div>${it[0]}</div>${tx(it[1])}</div></div><div class="bucketrow">${st.buckets.map(([e, l], b) => `<button class="bucket" onclick="A.sortPick(${b})"><span>${e}</span>${tx(l)}</button>`).join("")}</div>`;
      } else {
        body = `<div class="q">${tx(st.q)}</div>` + items.map((it, k) => {
          const ok = s.res[k] === it[2];
          return `<div class="srow ${ok ? "ok" : "no"}"><span class="se">${it[0]}</span><span style="flex:1">${tx(it[1])}</span><b>${st.buckets[it[2]][0]} ${tx(st.buckets[it[2]][1])}</b><span>${ok ? "✓" : "✗"}</span></div>`;
        }).join("");
      }
      break;
    }
    case "match": {
      auto = true; hint = t("lp.matchAll");
      const mb = (side: "l" | "r", k: number, txt: string) => {
        let c = "mbtn";
        if (s.done.includes(k)) c += " gone";
        else if ((side === "l" && s.sl === k) || (side === "r" && s.sr === k)) c += " sel";
        if (s.bad && s.bad[side] === k) c += " bad";
        return `<button class="${c}" onclick="A.matchTap('${side}',${k})">${txt}</button>`;
      };
      body = `<div class="q">${tx(st.q)}</div><div class="matchgrid"><div class="mcol">${s.left.map((k: number) => mb("l", k, tx(st.pairs[k][0]))).join("")}</div><div class="mcol">${s.rightO.map((k: number) => mb("r", k, tx(st.pairs[k][1]))).join("")}</div></div>`
        + (L.checked ? `<p class="muted center" style="font-weight:800;margin-top:12px">${t("lp.mistakes", { n: s.miss })}</p>` : "");
      break;
    }
    case "order":
      body = `<div class="q">${tx(st.q)}</div><div class="oslots">${st.items.map((_, p) => {
        const k = s.picked[p];
        return k === undefined ? `<div class="oslot empty"><span class="num">${p + 1}</span>${t("lp.tapFill")}</div>`
          : `<button class="oslot ${L!.checked ? (k === p ? "right" : "wrong") : ""}" onclick="A.orderUn(${p})"><span class="num">${p + 1}</span><span class="e">${st.items[k][0]}</span>${tx(st.items[k][1])}</button>`;
      }).join("")}</div><div class="opool">${s.pool.filter((k: number) => !s.picked.includes(k)).map((k: number) => `<button class="pchip" onclick="A.orderPick(${k})">${st.items[k][0]} ${tx(st.items[k][1])}</button>`).join("")}</div>`
        + (L.checked && !L.right ? `<div class="card" style="margin-top:12px"><div class="muted" style="font-size:12px;font-weight:900">${t("lp.correctOrder")}</div>${st.items.map((it, p) => `<div style="font-weight:800;margin-top:4px">${p + 1}. ${it[0]} ${tx(it[1])}</div>`).join("")}</div>` : "");
      ready = s.picked.length === st.items.length;
      break;
    case "slider": case "predict": {
      const isP = st.t === "predict", unit = st.unit || "vnd";
      body = `<div class="q">${tx(st.q)}</div>${st.art ? `<div class="scene" style="font-size:32px;padding:14px">${st.art}</div>` : ""}<div class="sval" id="sv">${fmtUnit(s.v, unit)}</div>
        <input type="range" class="range" min="${st.min}" max="${st.max}" step="${st.step}" value="${s.v}" oninput="A.lsSlide(this.value)" ${L.checked ? "disabled" : ""} aria-label="${esc(tx(st.q))}">
        <div class="rlab"><span>${fmtUnit(st.min, unit)}</span><span>${fmtUnit(st.max, unit)}</span></div>`;
      if (L.checked) {
        const ans = isP ? st.actual : st.a;
        const pos = clamp(((ans - st.min) / (st.max - st.min)) * 100, 0, 100);
        body += `<div class="truemark"><i style="left:${pos}%"></i></div><div class="card center" style="margin-top:6px;font-weight:800">${isP ? `${t("lp.yourGuess")}: <b>${fmtUnit(s.v, unit)}</b><br>${t("lp.reality")}: <b style="color:var(--okt)">${fmtUnit(ans, unit)}</b>` : `${t("lp.answer")}: <b style="color:var(--okt)">${fmtUnit(ans, unit)}</b>`}</div>`;
      }
      ready = true;
      break;
    }
    case "jars": {
      const sum = s.vals.reduce((a: number, b: number) => a + b, 0), rem = st.total - sum;
      body = `<div class="q">${tx(st.q)}</div><div class="remain">${t("lp.leftToSplit")}: <b style="color:${rem ? "var(--pri)" : "var(--okt)"}">${vnd(rem, lang())}</b></div><div class="jars">${st.jars.map(([l, col, tg], k) => {
        const v = s.vals[k], h = (v / st.total) * 100;
        return `<div class="jar"><div class="jarval">${shortVnd(v, lang())}</div><div class="jarlid"></div><div class="jarbody"><i style="height:${h}%;background:${col}"></i><span class="pct">${Math.round(h)}%</span></div><div class="jarlab">${tx(l)}</div>${L!.checked ? `<div class="jart ${v === tg ? "ok" : "no"}">${t("lp.goal", { p: Math.round((tg / st.total) * 100) })}</div>` : `<div class="jstep"><button onclick="A.jarStep(${k},-1)" aria-label="−">−</button><button onclick="A.jarStep(${k},1)" aria-label="+">+</button></div>`}</div>`;
      }).join("")}</div>`;
      ready = rem === 0;
      break;
    }
    case "spot": {
      const n = st.post.parts.filter((p) => p[1]).length;
      body = `<div class="q">${tx(st.q)}</div><div class="post"><div class="phead"><span class="pav">${st.post.av}</span><div><b>${esc(st.post.user)}</b><div class="muted" style="font-size:12px;font-weight:700">${t("lp.sponsored")}</div></div></div><div class="pbody">${st.post.parts.map(([tt, f], k) => {
        const sel = s.sel.includes(k);
        let c = "flag";
        if (L!.checked) { if (f) c += " isflag"; else if (sel) c += " notflag"; } else if (sel) c += " sel";
        return `<span class="${c}" role="button" tabindex="0" onclick="A.tapToggle(${k})">${tx(tt)}</span>`;
      }).join(" ")}</div><div class="pfoot">❤️ 12,4k · 💬 892 · ↗️</div></div><p class="muted center" style="font-size:13px;font-weight:800;margin-top:10px">${t("lp.tapSuspicious", { n })}</p>`;
      ready = s.sel.length > 0;
      break;
    }
    case "tap":
      body = `<div class="q">${tx(st.q)}</div><div class="receipt"><div class="rhead">🧾 ${tx(st.head)}</div>${st.items.map(([e, l, amt, f], k) => {
        const sel = s.sel.includes(k);
        let c = "ritem";
        if (L!.checked) { if (f) c += " isflag"; else if (sel) c += " notflag"; } else if (sel) c += " sel";
        return `<button class="${c}" onclick="A.tapToggle(${k})"><span>${e}</span><span style="flex:1;text-align:left">${tx(l)}</span><b>${amt}</b></button>`;
      }).join("")}</div>`;
      ready = s.sel.length > 0;
      break;
    case "calc":
      body = `<div class="q">${tx(st.q)}</div>${st.art ? `<div class="scene" style="font-size:26px;padding:12px">${st.art}</div>` : ""}<div class="calc">${st.parts.map((p, k) => {
        const v = parseNum(s.vals[k]), ok = v !== null && Math.abs(v - p.a) <= p.tol;
        return `<label class="cpart ${L!.checked ? (ok ? "right" : "wrong") : ""}"><span class="cnum">${k + 1}</span><span class="clabel">${tx(p.label)}</span>
          <span class="cin"><input inputmode="decimal" autocomplete="off" value="${esc(s.vals[k])}" oninput="A.lsCalc(${k},this.value)" ${L!.checked ? "disabled" : ""} placeholder="?">${p.unit ? `<em>${tx(p.unit)}</em>` : ""}</span>
          ${L!.checked && !ok ? `<span class="cfix">→ ${fmtNum(p.a, lang(), 2)} ${p.unit ? tx(p.unit) : ""}</span>` : ""}</label>`;
      }).join("")}</div>`;
      ready = s.vals.every((v: string) => parseNum(v) !== null);
      break;
    case "statement":
      body = `<div class="q">${tx(st.q)}</div>${st.sheets.map((sh) => sheetHTML(sh, !st.o)).join("")}` + (st.o ? optList({ o: st.o, a: st.a! }) : "");
      ready = st.o ? s.sel !== null : s.sel.length > 0;
      break;
    case "explain": {
      body = `<div class="q">${tx(st.q)}</div><textarea id="exin" maxlength="300" placeholder="${t("lp.typeHere")}" oninput="A.lsExplain(this.value)" ${L.checked ? "disabled" : ""}>${esc(s.text)}</textarea><div class="count"><span id="excnt">${s.text.length}</span>/300</div><p class="muted" style="font-size:12px;font-weight:800">🤖 ${t("lp.keywordNote")}</p>`;
      if (L.checked) {
        const got = st.keys.map((k) => s.hits.includes(k));
        body += `<div class="card"><div class="exkeys">${st.keys.map((k, i) => `<span class="${got[i] ? "hit" : "miss"}">${got[i] ? "✓" : "○"} ${tx(k.label)}</span>`).join("")}</div><div class="muted" style="font-size:12px;font-weight:900;margin-top:10px">${t("lp.modelAnswer").toUpperCase()}</div><p style="font-weight:700;margin:4px 0 0">${tx(st.model)}</p></div>`;
      }
      ready = s.text.trim().length >= 8;
      break;
    }
  }

  // footer
  let foot: string;
  const fxin = (fx === "wave" || fx === "shake") && !PO() ? " fxin" : "";
  if (st.t === "learn") foot = `<div class="ofoot"><button class="btn" onclick="A.nextStep()">${t("c.continue")}</button></div>`;
  else if (st.t === "video") {
    const ok = L.videoDone[L.s];
    foot = `<div class="ofoot"><button class="btn" ${ok ? "" : "disabled"} onclick="A.nextStep()" id="vcont">${ok ? t("c.continue") : t("vd.watchFirst")}</button>${ok ? "" : `<button class="linkbtn" onclick="A.vSkip()">${t("vd.skip")}</button>`}</div>`;
  } else if (st.t === "predict") {
    foot = !L.checked ? `<div class="ofoot"><button class="btn sun" onclick="A.lsPredict()">${t("lp.predictLock")}</button></div>`
      : `<div class="ofoot neutral${fxin}"><div class="fb">🔎 ${t("lp.reality")}</div><p>${tx(st.reveal)}</p><p class="muted" style="font-size:12px;font-weight:800">${t("lp.noWrong")}</p><button class="btn" onclick="A.nextStep()">${t("c.continue")}</button></div>`;
  } else if (!L.checked) {
    foot = auto ? `<div class="ofoot"><button class="btn" disabled>${hint}</button></div>` : `<div class="ofoot"><button class="btn good" ${ready ? "" : "disabled"} onclick="A.pushThen(this,'checkStep')">${t("c.check")}</button></div>`;
  } else {
    const w = (st as any).why as TL;
    foot = `<div class="ofoot ${L.right ? "ok" : "no"}${fxin}"><div class="fb" style="color:${L.right ? "var(--okt)" : "var(--not)"}">${L.right ? t("lp.right").split("|")[L.s % 3] : t("lp.wrong")}</div><p>${tx(w)}</p><button class="btn ${L.right ? "good" : "bad"}" onclick="A.nextStep()">${t("c.continue")}</button></div>`;
  }

  const talkEl = PO() ? "" : `<div class="bubble sm talk" id="lessonTalk"></div>`;
  const tag = (L.deep ? `<span class="deeptag">${icon("deep", { size: 13, tint: 0 })} ${t("lp.deepTag")}</span> ` : "") + t("type." + st.t);
  const wave = (fx === "wave" || fx === "shake") && !PO() ? " " + fx : "";
  openO(`<div class="ohead"><button class="x" onclick="A.quitLesson()" aria-label="${t("lp.quit")}">${icon("close", { size: 26 })}</button><div class="prog"><i style="width:${pct}%"></i></div>${heartsHTML(L.broke)}${S.set.intel ? `<button class="infobtn" onclick="A.openAssistant()" aria-label="Tips">${icon("info", { size: 22, tint: 0 })}</button>` : ""}</div>
    <div class="obody${wave}" id="lbody"><div class="budrow"><div id="bud" class="bud" data-size="56">${lion(56, bud.mood)}</div>${talkEl}</div>
    <div class="ltag">${tag}</div>${body}</div>${foot}<div id="lmodal"></div>`);
  paintTalk(false);
  if (st.t === "video") mountVideo(st.video, () => { L!.videoDone[L!.s] = true; const b = $("#vcont") as HTMLButtonElement | null; if (b) { b.disabled = false; b.textContent = t("c.continue"); b.nextElementSibling?.remove(); } }, !!L.videoDone[L.s]);
  L.broke = 0;
  publishCtx();
}

/** Tell Alti Lion what is on screen (tip mode until the exercise is answered). */
function publishCtx() {
  if (!L) return;
  const st = cur(), q = isGraded(st) || st.t === "predict";
  const answered = !q || L.checked;
  setCtx({
    key: `L:${L.les.id}:${L.deep ? "d" : "b"}:${L.s}`,
    where: `${t("nav.learn")} · ${tx(L.les.title)}`,
    title: tx(L.les.title),
    sub: t("lp.step", { n: `${L.s + 1}/${L.steps.length}` }),
    short: tx(L.les.info.s),
    long: tx(L.les.info.l),
    extra: answered && "why" in st ? `<b>${lang() === "vi" ? "Câu này" : "This question"}:</b> ${tx((st as any).why)}` : st.t === "learn" ? `<b>${tx(st.title)}</b> — ${tx(st.text)}` : undefined,
    hint: "hint" in st && st.hint ? tx(st.hint) : undefined,
    answered,
    question: q,
    kb: L.les.kb,
  });
}

/* ---------- interactions ---------- */
function finishStep(right: boolean) {
  if (!L) return;
  L.checked = true; L.right = right; L.graded++;
  if (right) L.ok++;
  else if (S.hearts > 0 && L.les.kind !== "placement") { S.hearts--; L.broke = 1; save(); }
  lessonRender(right ? "wave" : "shake");
  if (right) { confetti(); emote("cheer", 1600); react(rand(REACT.ok())); }
  else { const m = Math.random() < 0.5 ? "sad" : "laugh"; emote(m, 2600); react(rand(m === "sad" ? REACT.sad() : REACT.laugh())); }
  if (S.set.intel) showTipPop();
}
function checkStep() {
  if (!L || L.checked) return;
  const st = cur(), s = L.st;
  let r = false;
  switch (st.t) {
    case "pick": r = s.sel === st.a; break;
    case "mcq": case "chart": r = s.order[s.sel] === st.a; break;
    case "statement":
      if (st.o) r = s.order[s.sel] === st.a;
      else {
        const want = st.sheets.flatMap((sh) => sh.rows.map((row, k) => (row.flag ? `${tx(sh.title)}|${k}` : null)).filter(Boolean)) as string[];
        r = want.length === s.sel.length && want.every((id) => s.sel.includes(id));
      }
      break;
    case "order": r = s.picked.every((k: number, p: number) => k === p); break;
    case "slider": r = Math.abs(s.v - st.a) <= st.tol; break;
    case "jars": r = st.jars.every((j, k) => s.vals[k] === j[2]); break;
    case "spot": case "tap": {
      const list = st.t === "spot" ? st.post.parts.map((p) => p[1]) : st.items.map((p) => p[3]);
      const want = list.map((f, k) => (f ? k : -1)).filter((k) => k >= 0);
      r = want.length === s.sel.length && want.every((k) => s.sel.includes(k));
      break;
    }
    case "calc": r = st.parts.every((p, k) => { const v = parseNum(s.vals[k]); return v !== null && Math.abs(v - p.a) <= p.tol; }); break;
    case "explain": {
      // Demo grading: a key idea counts when any of its words appears (accent-insensitive, both languages accepted).
      const txt = " " + norm(s.text).replace(/[^a-z0-9%/]+/g, " ") + " ";
      const has = (w: string) => txt.includes(" " + norm(w).replace(/[^a-z0-9%/]+/g, " ").trim() + " ");
      s.hits = st.keys.filter((k) => [...k.words.vi, ...k.words.en].some(has));
      r = s.hits.length >= st.need;
      break;
    }
  }
  finishStep(r);
}
function sortPick(b: number) {
  if (!L || L.checked || L.st.busy) return;
  const st = cur() as Extract<Step, { t: "sort" }>, s = L.st, it = s.items[s.idx], ok = b === it[2], c = $("#sc");
  s.busy = true; s.res.push(b);
  if (c) {
    c.classList.add(ok ? "ok" : "no");
    const dx = st.buckets.length === 2 ? (b === 0 ? -260 : 260) : (b - 1) * 260;
    setTimeout(() => { c.style.transform = `translate(${dx}px,${b === 1 && st.buckets.length === 3 ? 140 : 40}px) rotate(${dx / 14}deg)`; c.style.opacity = "0"; }, PO() ? 0 : 220);
  }
  setTimeout(() => {
    if (!L) return;
    s.busy = false; s.idx++;
    if (s.idx >= s.items.length) {
      const wrong = s.items.filter((x: any, k: number) => s.res[k] !== x[2]).length;
      finishStep(wrong <= (st.allow ?? (s.items.length >= 6 ? 1 : 0)));
    } else lessonRender();
  }, PO() ? 200 : 560);
}
function matchTap(side: "l" | "r", k: number) {
  if (!L || L.checked) return;
  const s = L.st;
  if (s.done.includes(k)) return;
  s.bad = null;
  if (side === "l") s.sl = k; else s.sr = k;
  if (s.sl !== null && s.sr !== null) {
    if (s.sl === s.sr) s.done.push(k);
    else { s.miss++; s.bad = { l: s.sl, r: s.sr }; }
    s.sl = null; s.sr = null;
    if (s.done.length === (cur() as any).pairs.length) return finishStep(s.miss <= 1);
  }
  lessonRender();
}

function nextStep() {
  if (!L) return;
  stopVideo();
  // out of hearts → refresher first
  if (S.hearts <= 0 && !L.outShown) { L.outShown = true; return outOfHearts(); }
  L.s++;
  if (L.s < L.steps.length) { initStep(); trackProgress(); lessonRender(); $("#lbody")?.scrollTo(0, 0); return; }
  lessonDone();
}

function reviewCard(les: Lesson) {
  return `<div class="review"><div class="rv-title">⚡ ${t("learn.review")}: ${tx(les.review.title)}</div><ul>${les.review.points.map((p) => `<li>${tx(p)}</li>`).join("")}</ul></div>`;
}
function outOfHearts() {
  if (!L) return;
  stopTalk();
  document.querySelectorAll(".infopop").forEach((e) => e.remove());
  sheet(`<div style="display:inline-block" class="m-sad">${lion(84, "sad")}</div><h2>${t("lp.heartsOut")}</h2><p class="muted" style="font-weight:700">${t("lp.heartsOutSub")}</p>${reviewCard(L.les)}`,
    [[t("lp.refill"), "A.refillHearts()", "good"], [t("lp.quitBtn"), "A.closeSheet('#lmodal');A.closeO()", "ghost"]], "#lmodal");
}
function refillHearts() {
  S.hearts = MAX_HEARTS; save();
  closeSheet("#lmodal");
  minitoast(t("lp.refilled"));
  if (L) { L.outShown = false; nextStep(); if (!PO()) startTalk("lessonTalk", LINES.lesson); }
}

function lessonDone() {
  if (!L) return;
  stopTalk(); stopVideo();
  const les = L.les, n = Math.max(1, L.graded), pct = L.graded ? L.ok / n : 1, xp = 10 + L.ok * 5, secs = Math.round((Date.now() - L.t0) / 1000);
  S.inprog = null;
  if (les.kind === "placement") return placementDone(pct, xp);
  addXP(xp);
  const prev = S.lessons[les.id];
  const stars = pct >= 0.99 ? 3 : pct >= 0.66 ? 2 : 1;
  // stars & score come from the basic part; finishing the deep dive only adds the 🔬 badge
  S.lessons[les.id] = L.deep && prev
    ? { ...prev, deep: true, at: Date.now() }
    : { stars: Math.max(stars, prev?.stars || 0), ok: L.ok, total: L.graded, deep: L.deep || !!prev?.deep, at: Date.now() };
  save();
  const nextLes = ALL_LESSONS.find((x) => !S.lessons[x.id] && x.id !== les.id);
  const title = L.deep ? t("res.deepDone") : pct === 1 ? t("res.perfect") : pct >= 0.66 ? t("res.complete") : pct > 0 ? t("res.madeIt") : t("res.tough");
  const buttons: Array<[string, string, string?]> = [];
  if (!L.deep && les.deep) buttons.push([`${icon("deep", { size: 20, tint: 0.3 })} ${t("res.deep")}`, `A.startLesson('${les.id}',true)`, "sun"]);
  if (nextLes) buttons.push([`${t("res.next")} · ${icon(nextLes.ic, { size: 20, color: "#fff", tint: 0.35 })}`, `A.startLesson('${nextLes.id}')`, "good"]);
  else if (pct < 0.66) buttons.push([t("res.retry"), `A.startLesson('${les.id}',${L.deep})`, "good"]);
  buttons.push([t("c.backHome"), "A.backHome()", "ghost"]);
  const wasDeep = L.deep;
  L = null;
  setOvRerender(null);
  resultPopup({
    title, sub: `${tx(les.title)}${wasDeep ? " · " + t("lp.deepTag") : ""}`, pct,
    stats: [[`${Math.round(pct * n)}/${n}`, t("res.correct")], [fmtTime(secs), t("res.time")], [`+${xp}`, "XP"]],
    buttons,
  });
}

/** Placement result → Alti Lion's level + a suggested first lesson (design doc 3.2). */
function placementDone(pct: number, xp: number) {
  const lvl = pct >= 0.75 ? "p" : pct >= 0.4 ? "l" : "n";
  S.placement = { lvl, score: Math.round(pct * 100) };
  addXP(xp);
  const pick = lvl === "p" ? findLesson("c-breakeven") : findLesson("p-budget");
  L = null;
  setOvRerender(null);
  resultPopup({
    title: t("pt.done"), sub: t("pt.level", { l: t("as.lvl." + lvl) }), pct: Math.max(pct, 0.7),
    stats: [[`${Math.round(pct * 8)}/8`, t("res.correct")], [t("as.lvl." + lvl).split(" ")[0], t("pt.lvlShort")], [`+${xp}`, "XP"]],
    extra: pick ? `<p class="muted" style="font-weight:800;margin:0 0 12px">${t("pt.suggest", { title: tx(pick.title) })}</p>` : "",
    buttons: [...(pick ? [[`${t("c.start")} · ${tx(pick.title)}`, `A.startLesson('${pick.id}')`, "good"] as [string, string, string]] : []), [t("c.backHome"), "A.backHome()", "ghost"]],
  });
}

function quitLesson() {
  if (!L) return closeO();
  if (L.s === 0 && !L.checked) { stopVideo(); stopTalk(); L = null; return closeO(); }
  sheet(`<div style="display:inline-block">${lion(80, "sad")}</div><h2>${t("lp.quitQ")}</h2><p class="muted" style="font-weight:700">${t("lp.quitSub")}</p>`,
    [[t("lp.keepGoing"), "A.closeSheet('#lmodal')", "good"], [t("lp.quitBtn"), "A.closeSheet('#lmodal');A.abortLesson()", "ghost"]], "#lmodal");
}

export const lessonActive = () => !!L;
// dev-only hook for the automated play-through test (scripts/ is not shipped)
if (import.meta.env.DEV) (window as any).__lesson = () => L;
export { reviewCard };

reg({
  startLesson, nextStep, checkStep, sortPick, matchTap, refillHearts, quitLesson,
  abortLesson() { stopVideo(); stopTalk(); L = null; closeO(); },
  lsSet(k: string, v: any) { if (!L || L.checked) return; L.st[k] = v; lessonRender("pick"); },
  lsSlide(v: string) { if (!L || L.checked) return; L.st.v = +v; const st = cur() as any; const el = $("#sv"); if (el) el.textContent = fmtUnit(L.st.v, st.unit || "vnd"); },
  lsPredict() { if (!L) return; L.checked = true; lessonRender("wave"); emote("wow", 1800); },
  lsCalc(k: number, v: string) {
    if (!L || L.checked) return;
    L.st.vals[k] = v;
    const btn = document.querySelector<HTMLButtonElement>(".ofoot .btn.good");
    if (btn) btn.disabled = !L.st.vals.every((x: string) => parseNum(x) !== null);
  },
  lsExplain(v: string) {
    if (!L || L.checked) return;
    L.st.text = v;
    const c = $("#excnt"); if (c) c.textContent = String(v.length);
    const btn = document.querySelector<HTMLButtonElement>(".ofoot .btn.good");
    if (btn) btn.disabled = v.trim().length < 8;
  },
  lsTapRow(id: string) { if (!L || L.checked) return; const s = L.st.sel as string[]; const i = s.indexOf(id); if (i >= 0) s.splice(i, 1); else s.push(id); lessonRender(); },
  orderPick(k: number) { if (!L || L.checked) return; L.st.picked.push(k); lessonRender(); },
  orderUn(p: number) { if (!L || L.checked) return; L.st.picked.splice(p, 1); lessonRender(); },
  jarStep(k: number, d: number) {
    if (!L || L.checked) return;
    const st = cur() as Extract<Step, { t: "jars" }>, sum = L.st.vals.reduce((a: number, b: number) => a + b, 0);
    if (d > 0 && sum + st.step > st.total) return;
    if (d < 0 && L.st.vals[k] <= 0) return;
    L.st.vals[k] += d * st.step;
    lessonRender();
  },
  tapToggle(k: number) { if (!L || L.checked) return; const s = L.st.sel as number[]; const i = s.indexOf(k); if (i >= 0) s.splice(i, 1); else s.push(k); lessonRender(); },
  vSkip() { if (!L) return; L.videoDone[L.s] = true; nextStep(); },
});
