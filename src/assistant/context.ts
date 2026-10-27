/* What the user is looking at right now — Alti Lion reads this to answer "about this". */
export interface Ctx {
  key: string; // chats are kept per key
  where: string; // short label shown in the panel ("Lesson · Budget")
  title: string;
  sub?: string;
  short?: string; // one-line summary (tips pop-up, "explain simpler")
  long?: string; // full explanation, shown once the question is answered
  extra?: string; // e.g. "This question: …"
  hint?: string; // nudge without giving the answer away
  answered: boolean; // false → tip mode (no spoilers)
  question?: boolean; // true while a graded exercise is on screen
  kb?: string[]; // knowledge-base topics that fit this screen
  answers?: { n: string; l?: string; p: string }; // ready answers about this screen by level (e.g. Today's news)
  answerKeys?: string[]; // words that mean "a question about this screen" (accent-free, lower case)
}
let ctx: Ctx | null = null;
const subs: Array<(c: Ctx | null) => void> = [];
export const getCtx = () => ctx;
export function setCtx(c: Ctx | null) { ctx = c; subs.forEach((f) => f(c)); }
export function patchCtx(p: Partial<Ctx>) { if (ctx) setCtx({ ...ctx, ...p }); }
export function onCtx(f: (c: Ctx | null) => void) { subs.push(f); }
