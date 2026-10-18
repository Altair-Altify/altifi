/* ---------- Lesson data format ----------
 * A lesson is pure data: adding a lesson = adding a file in src/content/lessons and listing it in content/domains.ts.
 * All text is { vi, en } (or a plain string when it is the same in both languages, e.g. emoji). */
import type { TL } from "../i18n/i18n";
import type { VideoDef } from "./video";

export type DomainId = "personal" | "corporate" | "macro" | "markets" | "public" | "intl";

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
  | { t: "predict"; q: TL; art?: string; min: number; max: number; step: number; start?: number; actual: number; unit?: Unit; reveal: TL }
  /* the Governor's dial (M2): turn the policy rate, watch inflation, unemployment and your own loan payment move */
  | ({ t: "dial"; q: TL; dial: DialModel; a: number } & Graded);

/** Simple linear economy for the dial: next year's inflation = pi0 − kPi·(r − r0); unemployment = u0 + kU·(r − r0);
 * your floating loan (amount, months) costs r + spread. Correct when inflation ≤ goalPi and unemployment ≤ goalU. */
export interface DialModel { min: number; max: number; step: number; start: number; r0: number; pi0: number; kPi: number; u0: number; kU: number; goalPi: number; goalU: number; loan: number; months: number; spread: number }

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

/* ---------- Course map (design doc 13.1 & 13.2d): every lesson is a planet in the Altair galaxy ----------
 * A node exists for all 20 lessons; `lesson` is set once the content is written (otherwise the planet is a dashed sketch). */
export type PlanetShape = "rocky" | "gas" | "ocean" | "ice";
export type PlanetFeature =
  | "leak" | "cardRing" | "shrink" | "flags" | "strata" | "boba" | "tagRing" | "craters" | "twin" | "cities"
  | "swell" | "dial" | "satellites" | "twinMoons" | "bars" | "crystals" | "pie" | "saturn" | "split" | "cracked";
export interface PlanetDef {
  shape: PlanetShape;
  palette: string[]; // 3–4 colors, low → high ground (or band colors for gas planets)
  feature: PlanetFeature; // the shape that hints at the topic (13.1 level 2)
  size?: number; // radius multiplier (default 1)
  at?: [number, number]; // hand-placed [angle in degrees, orbit radius] inside its system; default = automatic
}
export interface CourseNode {
  id: string;
  code: string; // P1, B3, M2… (13.2d)
  domain: DomainId;
  ic: string; // UI icon (src/ui/icons.ts)
  title: TL; // short topic — planet label
  hook: TL; // the mystery question (13.2b-1) — headline of the planet card
  prereq: string[]; // "good to know first" lesson ids, may point into another area (13.2f light bands)
  unlock: TL; // what finishing it unlocks in the game (13.2b-7)
  planet: PlanetDef;
  day: string; // when the (re)written content is scheduled (13.6)
  lesson?: Lesson;
}
