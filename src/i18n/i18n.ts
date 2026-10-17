/* ---------- i18n: every visible string goes through t() (UI) or tx() (content) ----------
 * UI strings live in ./strings.ts as  key: [vi, en]  so a reviewer sees both versions side by side.
 * Content (lessons, KB, videos…) uses  { vi: "...", en: "..." }  objects, read with tx(). */
import { S, save, type Lang } from "../core/state";
import { STRINGS } from "./strings";

export type T = { vi: string; en: string };
export type TL = T | string; // plain string = same in both languages (emoji, numbers, names)

export const lang = (): Lang => S.set.lang;

/** Translate a UI key. Vars: t("hi", { name: "Lan" }) replaces {name}. Missing key → the key itself (easy to spot). */
export function t(key: keyof typeof STRINGS | string, vars?: Record<string, string | number>): string {
  const row = (STRINGS as Record<string, readonly [string, string]>)[key];
  let s = row ? row[lang() === "vi" ? 0 : 1] : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

/** Pick the current language from a content object. */
export function tx(v: TL | undefined | null, vars?: Record<string, string | number>): string {
  if (v == null) return "";
  let s = typeof v === "string" ? v : v[lang()] ?? v.en ?? v.vi;
  if (vars) for (const [k, val] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(val));
  return s;
}

/** Same as tx() for arrays of lines. */
export const txa = (a: TL[]) => a.map((x) => tx(x));

const listeners: Array<() => void> = [];
export function onLangChange(fn: () => void) { listeners.push(fn); }
export function setLang(l: Lang) {
  if (S.set.lang === l) return;
  S.set.lang = l;
  save();
  document.documentElement.lang = l;
  listeners.forEach((f) => f());
}
document.documentElement.lang = lang();
