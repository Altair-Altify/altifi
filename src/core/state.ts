/* ---------- Saved state + migration from the two older demos ----------
 * altifi-demo-v1 = base (altifi-base.html):   S.set settings, S.p profile, S.m buddy, xp, streak, hearts
 *                  + background photo in "altifi-demo-v1-bg"
 * altifi-demo-v2 = v3 prototype:              S.m buddy, xp, streak, lvl, life (game character/progress)
 * Old keys are never deleted, so going back to an older file still works. */

export type Lang = "vi" | "en";
export type Lvl = "n" | "l" | "p";
export interface Settings {
  theme: "light" | "night" | "image";
  inter: boolean; // Alti Lion talks & emotes on the home page
  potato: boolean;
  intel: boolean; // smart tip after every answer
  photosOK: boolean;
  wx: boolean;
  lang: Lang;
  lvl: "auto" | Lvl; // how Alti Lion explains things
  voice: boolean; // read narration of animated videos aloud
}
export interface Profile { name: string; bio: string; country: string; age: number }
export interface Buddy {
  name: string; color: string; eyes: string; mouth: string;
  hat: string | null; glasses: string | null; extra: string | null;
}
export interface LessonRec { stars: number; ok: number; total: number; deep?: boolean; at: number }
export interface GameState { netWorth: number; [k: string]: unknown }
export interface State {
  v: 1;
  xp: number;
  streak: number;
  lastDay: string;
  lastOpen: number;
  hearts: number;
  set: Settings;
  p: Profile;
  m: Buddy;
  lessons: Record<string, LessonRec>;
  placement: { lvl: Lvl; score: number } | null;
  game: GameState | null;
  legacy: { life?: unknown; oldLessonsDone?: number; migratedFrom?: string[] };
}

export const KEY = "altifi-app-v1";
export const BG_KEY = KEY + "-bg";
const OLD_V1 = "altifi-demo-v1";
const OLD_V2 = "altifi-demo-v2";
export const MAX_HEARTS = 3;

export const DEFAULT_BUDDY_NAME = "Alti Lion";
export const defaultM = (): Buddy => ({ name: DEFAULT_BUDDY_NAME, color: "pink", eyes: "amber", mouth: "cat", hat: null, glasses: null, extra: null });
const guessLang = (): Lang => (/^vi\b/i.test(navigator.language || "") ? "vi" : "en");
export const defaultSet = (): Settings => ({ theme: "light", inter: true, potato: false, intel: false, photosOK: false, wx: true, lang: guessLang(), lvl: "auto", voice: true });
export const defaultP = (): Profile => ({ name: "Minh Hân", bio: "", country: "VN", age: 15 });

export const fresh = (): State => ({
  v: 1, xp: 0, streak: 1, lastDay: new Date().toDateString(), lastOpen: Date.now(), hearts: MAX_HEARTS,
  set: defaultSet(), p: defaultP(), m: defaultM(), lessons: {}, placement: null, game: null, legacy: {},
});

/* Coin "Tiko" → lion "Alti Lion". Eyes/mouth keys mostly match; colors differ. */
const OLD_COLOR: Record<string, string> = { gold: "gold", mint: "mint", sky: "sky", pink: "pink", grape: "grape", silver: "sky" };
export function migrateBuddy(o: any): Buddy {
  const d = defaultM();
  if (!o || typeof o !== "object") return d;
  const wasDefaultCoin = (!o.name || o.name === "Tiko") && (o.color || "gold") === "gold" && (o.eyes || "round") === "round" && (o.mouth || "smile") === "smile" && !o.hat && !o.glasses && !o.extra;
  if (wasDefaultCoin) return d;
  return {
    name: !o.name || o.name === "Tiko" ? DEFAULT_BUDDY_NAME : String(o.name).slice(0, 12),
    color: OLD_COLOR[o.color] || (["pink", "gold", "coral", "grape", "mint", "sky"].includes(o.color) ? o.color : d.color),
    eyes: o.eyes === "round" ? "amber" : o.eyes || d.eyes,
    mouth: o.mouth || d.mouth,
    hat: o.hat ?? null, glasses: o.glasses ?? null, extra: o.extra ?? null,
  };
}

function read(key: string): any {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}

/** Build a new save from v1 (base) and/or v2 (v3 prototype) without losing settings, profile, buddy or progress. */
export function migrateOld(v1: any, v2: any): State {
  const S = fresh();
  const from: string[] = [];
  if (v1 && typeof v1 === "object") {
    from.push(OLD_V1);
    if (v1.set) Object.assign(S.set, v1.set);
    if (v1.p) Object.assign(S.p, v1.p);
    if (v1.m) S.m = migrateBuddy(v1.m);
    S.xp = +v1.xp || 0;
    S.streak = +v1.streak || 1;
    S.lastDay = v1.lastDay || S.lastDay;
    S.lastOpen = +v1.lastOpen || S.lastOpen;
    if (typeof v1.done === "number") S.legacy.oldLessonsDone = v1.done;
  }
  if (v2 && typeof v2 === "object") {
    from.push(OLD_V2);
    const newer = !v1 || (+v2.lastOpen || 0) >= (+v1.lastOpen || 0);
    if (v2.m && newer) S.m = migrateBuddy(v2.m);
    S.xp = Math.max(S.xp, +v2.xp || 0);
    if (newer) { S.streak = +v2.streak || S.streak; S.lastDay = v2.lastDay || S.lastDay; S.lastOpen = +v2.lastOpen || S.lastOpen; }
    if (v2.lvl && ["auto", "n", "l", "p"].includes(v2.lvl)) S.set.lvl = v2.lvl;
    if (v2.life) {
      S.legacy.life = v2.life; // the day-19 character creator imports name + look from here
      const l = v2.life as any;
      if (typeof l.cash === "number") S.game = { netWorth: (l.cash || 0) + (l.save || 0) };
    }
    if (typeof v2.done === "number") S.legacy.oldLessonsDone = Math.max(S.legacy.oldLessonsDone || 0, v2.done);
  }
  S.legacy.migratedFrom = from;
  return S;
}

/** Fill in fields that a save written by an earlier build of THIS app may be missing. */
export function normalize(raw: any): State {
  const S = Object.assign(fresh(), raw) as State;
  S.set = Object.assign(defaultSet(), raw.set || {});
  S.p = Object.assign(defaultP(), raw.p || {});
  S.m = Object.assign(defaultM(), raw.m || {});
  if (!S.lessons || typeof S.lessons !== "object") S.lessons = {};
  if (!S.legacy) S.legacy = {};
  if (typeof S.hearts !== "number") S.hearts = MAX_HEARTS;
  S.hearts = Math.max(0, Math.min(MAX_HEARTS, S.hearts));
  if (!["vi", "en"].includes(S.set.lang)) S.set.lang = guessLang();
  return S;
}

function load(): State {
  const cur = read(KEY);
  if (cur && typeof cur === "object") return normalize(cur);
  const v1 = read(OLD_V1), v2 = read(OLD_V2);
  const S = v1 || v2 ? migrateOld(v1, v2) : fresh();
  // background photo from the base demo
  try {
    if (!localStorage.getItem(BG_KEY)) {
      const bg = localStorage.getItem(OLD_V1 + "-bg");
      if (bg) localStorage.setItem(BG_KEY, bg);
    }
  } catch { /* storage full or blocked */ }
  return S;
}

export let S: State = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode / full */ }
}
export function resetState() {
  const keep = { lang: S.set.lang };
  S = fresh();
  S.set.lang = keep.lang;
  save();
}

/* streak bookkeeping, same rule as the base demo */
(function onOpen() {
  const today = new Date().toDateString(), y = new Date(Date.now() - 864e5).toDateString();
  if (S.lastDay !== today) { S.streak = S.lastDay === y ? S.streak + 1 : 1; S.lastDay = today; }
  S.lastOpen = Date.now();
  save();
})();

export const PO = () => !!S.set.potato;
export const lessonsDone = () => Object.keys(S.lessons).length;
