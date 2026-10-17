/* ---------- Faint money & economy pattern behind the content (design doc 10c.7) ----------
 * Built from the same icon set (coin, banknote, piggy bank, rising chart, bank, %, scale, globe), thin strokes.
 * Exposed as CSS variables --pat / --pat-n used by .bgpat (opacity is set in CSS: ~6% light, ~4.5% night). */
import { icon } from "./icons";

const SPOTS: [string, number, number, number][] = [
  ["coin", 18, 16, -12], ["banknote", 98, 10, 8], ["piggy", 140, 70, -6], ["chart", 30, 92, 0],
  ["bank", 96, 104, 0], ["percent", 156, 146, 14], ["scale", 48, 150, -8], ["globe", 116, 162, 0],
];
function tile(color: string) {
  const parts = SPOTS.map(([n, x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r} 14 14)">${icon(n, { size: 28, color, tint: 0 }).replace("<svg ", '<svg x="0" y="0" ')}</g>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">${parts}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
export function installPattern() {
  const r = document.documentElement.style;
  r.setProperty("--pat", tile("#3B3A8C"));
  r.setProperty("--pat-n", tile("#D7D6FF"));
}
