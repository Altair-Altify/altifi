/* Small shared helpers (ported from the base prototype) */
export const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T | null;
export const esc = (t: unknown) =>
  String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const shuffle = <T>(a: T[]): T[] => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o));
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const rand = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
export const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** Group digits with "." for VI and "," for EN; always "₫". */
export function vnd(n: number, lang: "vi" | "en" = "vi") {
  const sep = lang === "vi" ? "." : ",";
  return (n < 0 ? "−" : "") + Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep) + "₫";
}
export function shortVnd(n: number, lang: "vi" | "en" = "vi") {
  const a = Math.abs(n), s = n < 0 ? "−" : "";
  const dec = (x: number) => x.toFixed(1).replace(/\.0$/, "").replace(".", lang === "vi" ? "," : ".");
  if (a >= 1e9) return s + dec(a / 1e9) + (lang === "vi" ? " tỷ₫" : "B₫");
  if (a >= 1e6) return s + dec(a / 1e6) + (lang === "vi" ? " tr₫" : "M₫");
  if (a >= 1e3) return s + Math.round(a / 1e3) + "k₫";
  return s + Math.round(a) + "₫";
}
export function fmtNum(n: number, lang: "vi" | "en" = "vi", digits = 0) {
  return n.toLocaleString(lang === "vi" ? "vi-VN" : "en-US", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
