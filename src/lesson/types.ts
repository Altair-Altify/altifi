/* ---------- Lesson data format ----------
 * A lesson is pure data: adding a lesson = adding a file in src/content/lessons and listing it in content/domains.ts.
 * All text is { vi, en } (or a plain string when it is the same in both languages, e.g. emoji). */
import type { TL } from "../i18n/i18n";
import type { VideoDef } from "./video";

export type DomainId = "personal" | "corporate" | "markets" | "public" | "intl";

export interface Img { src: string; alt: TL; credit: TL } // real photos must carry a credit (see assets/CREDITS.md)

interface Graded {
  why: TL; // explanation shown after checking
  hint?: TL; // Alti Lion's nudge in tip mode (never the answer)
}

export type Step =
  | { t: "learn"; title: TL; text: TL; art?: string; img?: Img; photo?: { query?: string; file?: string }; cap?: TL; items?: [string, TL][]; lion?: TL; fs?: number }
  | { t: "video"; video: VideoDef }
  | ({ t: "pick"; q: TL; opts: [string, TL][]; a: number } & Graded)
  | ({ t: "mcq"; q: TL; o: TL[]; a: number } & Graded)
  | ({ t: "sort"; q: TL; buckets: [string, TL][]; items: [string, TL, number][]; allow?: number } & Graded)
  | ({ t: "match"; q: TL; pairs: [TL, TL][] } & Graded)
  | ({ t: "order"; q: TL; items: [string, TL][] } & Graded)
  | ({ t: "slider"; q: TL; art?: string; min: number; max: number; step: number; start?: number; a: number; tol: number; unit?: Unit } & Graded)
  | ({ t: "jars"; q: TL; total: number; step: number; jars: [TL, string, number][] } & Graded)
  | ({ t: "spot"; q: TL; post: { user: string; av: string; parts: [TL, boolean][] } } & Graded)
  | ({ t: "tap"; q: TL; head: TL; items: [string, TL, string, boolean][] } & Graded)
  /* new for deeper content (design doc 3.3) */
  | ({ t: "chart"; q: TL; chart: ChartDef; o: TL[]; a: number } & Graded)
  | ({ t: "calc"; q: TL; art?: string; parts: CalcPart[] } & Graded)
  | ({ t: "statement"; q: TL; sheets: Sheet[]; o?: TL[]; a?: number } & Graded) // with o/a: multiple choice, without: tap the rows marked flag
  | ({ t: "explain"; q: TL; keys: ExplainKey[]; need: number; model: TL } & Graded)
  | { t: "predict"; q: TL; art?: string; min: number; max: number; step: number; start?: number; actual: number; unit?: Unit; reveal: TL };

export type Unit = "vnd" | "pct" | "num" | "yr" | "cups" | "mvnd";

export interface ChartDef {
  kind: "line" | "bar";
  labels: TL[]; // x axis
  series: { name: TL; color: string; data: number[] }[];
  y?: TL; // y-axis caption, e.g. "triệu ₫"
  source?: TL;
}
export interface CalcPart { label: TL; a: number; tol: number; unit?: TL; hint?: TL }
export interface Sheet { title: TL; rows: { l: TL; v: number | string; bold?: boolean; sub?: boolean; flag?: boolean }[]; note?: TL }
export interface ExplainKey { label: TL; words: { vi: string[]; en: string[] } }

export interface Lesson {
  id: string;
  domain: DomainId;
  icon: string; // emoji, used inside content (result pop-up subtitle)
  ic: string; // UI icon name (src/ui/icons.ts) for the path node
  kind?: "placement"; // placement test: no hearts lost, sets S.placement instead of lesson progress
  title: TL;
  desc: TL;
  minutes: number;
  prereq?: TL; // "Nên biết trước: …"
  review: { title: TL; points: TL[] }; // "Ôn nhanh 1 phút" card (also refills hearts)
  info: { s: TL; l: TL }; // what Alti Lion says about this lesson (short / long)
  kb: string[]; // knowledge-base topics for the assistant
  steps: Step[]; // "Cơ bản"
  deep?: Step[]; // "Đào sâu" (optional)
}

/** Lessons not written yet still appear on the path so the 5-area structure is visible. */
export interface LessonStub { id: string; domain: DomainId; icon: string; ic: string; title: TL; soon: true }
