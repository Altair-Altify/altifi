/* ---------- Illustrated scene pieces (pastel, rounded, soft shadows — same style as the game map, design doc 6.1b & 10c) ----------
 * Shared by the home hero, the learning-path regions, profile covers and photo fallbacks,
 * so Learn and Play look like one world. All functions return SVG fragments in the caller's coordinates. */

const sh = (x: number, y: number, rx: number) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${(rx * 0.28).toFixed(1)}" fill="rgba(30,27,58,.12)"/>`;

export function tree(x: number, y: number, s = 1, tone = 0) {
  const g = [["#4FAE5A", "#5DBB63", "#7ACF79"], ["#3FA06E", "#52B47F", "#78CC98"], ["#7BBF4A", "#8FCC5C", "#B2DE7D"]][tone % 3];
  return `<g transform="translate(${x} ${y}) scale(${s})">${sh(0, 1, 13)}<rect x="-3" y="-13" width="6" height="14" rx="2.5" fill="#A0714F"/><circle cx="0" cy="-24" r="14" fill="${g[0]}"/><circle cx="-7.5" cy="-18.5" r="9.5" fill="${g[1]}"/><circle cx="7.5" cy="-19.5" r="9.5" fill="${g[1]}"/><circle cx="-4" cy="-29" r="6.5" fill="${g[2]}"/></g>`;
}
export function bush(x: number, y: number, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">${sh(0, 1, 11)}<circle cx="-6" cy="-5" r="6.5" fill="#5DBB63"/><circle cx="5" cy="-6" r="7.5" fill="#4FAE5A"/><circle cx="0" cy="-9" r="6" fill="#7ACF79"/><circle cx="-3" cy="-8" r="1.6" fill="#FF8FB1"/><circle cx="5" cy="-10" r="1.6" fill="#FFE066"/></g>`;
}
export function flowers(x: number, y: number) {
  const f = (dx: number, dy: number, c: string) => `<g transform="translate(${x + dx} ${y + dy})"><circle cx="-2" r="2" fill="${c}"/><circle cx="2" r="2" fill="${c}"/><circle cy="-2" r="2" fill="${c}"/><circle cy="2" r="2" fill="${c}"/><circle r="1.3" fill="#FFE066"/></g>`;
  return f(0, 0, "#FF8FB1") + f(8, 3, "#FFFFFF") + f(-7, 4, "#B49CFF");
}
export function house(x: number, y: number, s = 1, wall = "#FFF7E6", roof = "#EF7B6B") {
  return `<g transform="translate(${x} ${y}) scale(${s})">${sh(0, 2, 24)}<rect x="-19" y="-26" width="38" height="28" rx="4" fill="${wall}" stroke="rgba(30,27,58,.08)" stroke-width="1.5"/><path d="M-24 -24 L0 -44 L24 -24 Z" fill="${roof}" stroke="${roof}" stroke-width="5" stroke-linejoin="round"/><rect x="-5" y="-14" width="10" height="16" rx="5" fill="#B9825A"/><rect x="-15" y="-19" width="7" height="7" rx="2" fill="#9ED3FF"/><rect x="8" y="-19" width="7" height="7" rx="2" fill="#9ED3FF"/><rect x="10" y="-44" width="6" height="11" rx="1.5" fill="#C98A6A"/></g>`;
}
export function shop(x: number, y: number, s = 1, aw = "#5B5BD6", sign = "") {
  const stripes = [0, 1, 2, 3, 4].map((i) => `<rect x="${-25 + i * 10}" y="-36" width="10" height="11" fill="${i % 2 ? "#fff" : aw}"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">${sh(0, 2, 28)}<rect x="-23" y="-34" width="46" height="36" rx="4" fill="#FFF7E6" stroke="rgba(30,27,58,.08)" stroke-width="1.5"/>${stripes}<path d="M-25 -25 q5 5 10 0 q5 5 10 0 q5 5 10 0 q5 5 10 0 q5 5 10 0" fill="${aw}"/><rect x="-18" y="-18" width="16" height="12" rx="2" fill="#9ED3FF"/><rect x="3" y="-18" width="13" height="20" rx="3" fill="#B9825A"/>${sign ? `<circle cx="0" cy="-43" r="7" fill="#fff" stroke="${aw}" stroke-width="2"/><text x="0" y="-39.5" text-anchor="middle" font-size="9">${sign}</text>` : ""}</g>`;
}
export function tower(x: number, y: number, w = 30, h = 80, c = "#8EC5FF") {
  let win = "";
  for (let r = 0; r < Math.floor((h - 16) / 12); r++) for (let k = 0; k < Math.floor((w - 8) / 9); k++) win += `<rect x="${x - w / 2 + 5 + k * 9}" y="${y - h + 8 + r * 12}" width="6" height="7" rx="1.5" fill="#fff" opacity=".55"/>`;
  return `${sh(x, y + 2, w * 0.7)}<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="5" fill="${c}"/><rect x="${x - w / 2}" y="${y - h}" width="${w * 0.35}" height="${h}" rx="5" fill="#fff" opacity=".22"/>${win}`;
}
export function ticker(x: number, y: number, w = 70) {
  return `<g transform="translate(${x} ${y})"><rect x="${-w / 2 - 3}" y="-4" width="5" height="22" rx="2" fill="#6B6890"/><rect x="${w / 2 - 2}" y="-4" width="5" height="22" rx="2" fill="#6B6890"/><rect x="${-w / 2}" y="-22" width="${w}" height="20" rx="5" fill="#1E1B3A"/><text x="${-w / 2 + 6}" y="-8" font-family="Nunito,sans-serif" font-size="9" font-weight="900" fill="#5FE0A0">▲ VNI +1.2%</text></g>`;
}
export function hall(x: number, y: number, s = 1) {
  const cols = [-16, -6, 4, 14].map((c) => `<rect x="${c}" y="-28" width="5" height="26" rx="2" fill="#fff"/>`).join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">${sh(0, 2, 32)}<rect x="-26" y="-4" width="52" height="6" rx="2" fill="#E3E3F2"/><rect x="-23" y="-31" width="46" height="29" fill="#E9E6FF"/>${cols}<path d="M-28 -31 L0 -46 L28 -31 Z" fill="#B49CFF"/><path d="M-9 -46 a9 9 0 0 1 18 0 Z" fill="#FFC93C"/><rect x="-1" y="-62" width="2" height="12" fill="#6B6890"/><path d="M1 -62 h9 l-2 3 2 3 h-9z" fill="#EF4E4E"/></g>`;
}
export function ship(x: number, y: number, s = 1) {
  const box = (bx: number, c: string) => `<rect x="${bx}" y="-20" width="11" height="9" rx="1.5" fill="${c}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 -11 H34 L27 2 H-27 Z" fill="#EF4E4E"/><path d="M-30 -5 H30" stroke="#fff" stroke-width="2"/>${box(-26, "#FFC93C")}${box(-14, "#2BB673")}${box(-2, "#5B5BD6")}<rect x="12" y="-30" width="14" height="19" rx="2" fill="#fff"/><rect x="15" y="-27" width="8" height="4" rx="1" fill="#9ED3FF"/><rect x="17" y="-38" width="4" height="8" fill="#6B6890"/></g>`;
}
export function crane(x: number, y: number, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-60" width="6" height="60" fill="#F2A33A"/><path d="M-3 -58 H30 M-3 -48 L28 -58" stroke="#F2A33A" stroke-width="4" stroke-linecap="round"/><path d="M24 -58 V-40" stroke="#6B6890" stroke-width="1.5"/><rect x="19" y="-40" width="10" height="7" rx="1.5" fill="#3D5AFE"/></g>`;
}
export function water(x: number, y: number, w: number, h: number) {
  let waves = "";
  for (let i = 0; i < w / 40; i++) waves += `<path d="M${x + 10 + i * 40} ${y + 10 + (i % 2) * 8} q5 -4 10 0 t10 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#8EC5FF"/>${waves}`;
}
export function cloud(x: number, y: number, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><rect x="-26" y="-8" width="52" height="16" rx="8"/><circle cx="-8" cy="-9" r="11"/><circle cx="9" cy="-6" r="8"/></g>`;
}
export function sun(x: number, y: number, r = 16) {
  return `<circle cx="${x}" cy="${y}" r="${r + 9}" fill="#FFE27A" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFD54F"/>`;
}
export function coinIc(x: number, y: number, r = 7) {
  return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#FFC93C" stroke="#E0A800" stroke-width="2"/><text y="${r * 0.42}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="${r * 1.2}" fill="#8A5A00">₫</text></g>`;
}

/** Wide scenery strip (sky + hills + buildings) — home hero and the "town" profile cover. */
export function townScene(w = 360, h = 190, night = false) {
  const sky = night ? ["#2B2E52", "#3D3A5C"] : ["#D9E3FF", "#FFF4D6"];
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#hsky)"/>
    ${night ? `<circle cx="${w - 52}" cy="40" r="15" fill="#FFF2B3"/><circle cx="${w - 46}" cy="35" r="13" fill="${sky[0]}"/>` : sun(w - 52, 42)}
    <g class="drift">${cloud(70, 38, 0.9)}${cloud(220, 26, 0.7)}</g>
    <path d="M0 ${h - 58} Q ${w * 0.22} ${h - 92} ${w * 0.45} ${h - 66} T ${w} ${h - 74} V ${h} H0Z" fill="${night ? "#3E6B4C" : "#BFE8A0"}"/>
    ${tower(w * 0.63, h - 64, 22, 62, night ? "#4C5FA8" : "#A9C8F5")}${tower(w * 0.7, h - 62, 18, 44, night ? "#5B4FA0" : "#C9B6FF")}
    <path d="M0 ${h - 40} Q ${w * 0.3} ${h - 62} ${w * 0.6} ${h - 44} T ${w} ${h - 46} V ${h} H0Z" fill="${night ? "#4E8A5C" : "#A5DC86"}"/>
    ${house(w * 0.52, h - 48, 0.85, "#FFF7E6", "#5B5BD6")}${shop(w * 0.82, h - 46, 0.85, "#F2A33A", "🧋")}${tree(w * 0.36, h - 42, 0.9)}${tree(w * 0.95, h - 50, 0.75, 1)}${bush(w * 0.68, h - 36, 0.9)}
    <path d="M${w * 0.18} ${h} C ${w * 0.3} ${h - 20}, ${w * 0.6} ${h - 14}, ${w * 0.74} ${h - 32}" stroke="#F1E3C4" stroke-width="16" fill="none" stroke-linecap="round"/>
    ${flowers(w * 0.6, h - 14)}${coinIc(w * 0.45, h - 22, 6)}
  </svg>`;
}

/** Profile cover presets (design doc 10c.5). The user can also upload a photo. */
export const COVERS = ["town", "market", "harbor", "sunset"] as const;
export function coverScene(id: string, night = false) {
  const W = 360, H = 130;
  const wrap = (bg: [string, string], body: string) => `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="cv-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#cv-${id})"/>${body}</svg>`;
  switch (id) {
    case "market":
      return wrap(night ? ["#26284A", "#4A3F6B"] : ["#FFD9B8", "#FFF1DE"], `${sun(300, 34, 13)}${tower(60, 120, 30, 96, "#A9C8F5")}${tower(96, 120, 26, 70, "#C9B6FF")}${tower(250, 120, 34, 104, "#8EC5FF")}${tower(288, 120, 24, 60, "#B3B2CC")}${ticker(172, 92, 110)}<rect y="118" width="${W}" height="12" fill="#A5DC86"/>${bush(140, 122, 0.7)}${bush(215, 122, 0.7)}`);
    case "harbor":
      return wrap(night ? ["#22284A", "#2D3F6B"] : ["#CFE6FF", "#EAF4FF"], `${cloud(70, 30, 0.8)}${cloud(250, 22, 0.6)}${water(0, 84, W, 46)}${ship(150, 98, 1.1)}${crane(300, 86, 1)}${crane(330, 86, 0.8)}<rect x="270" y="80" width="90" height="8" fill="#B9825A"/>`);
    case "sunset":
      return wrap(night ? ["#2B2350", "#5B3A6B"] : ["#FFB3C7", "#FFE7A8"], `${sun(180, 96, 30)}<path d="M0 100 Q90 70 180 96 T360 88 V130 H0Z" fill="#E8418C" opacity=".55"/><path d="M0 112 Q120 92 220 110 T360 104 V130 H0Z" fill="#B81E66" opacity=".6"/>${coinIc(60, 40, 9)}${coinIc(300, 30, 7)}${coinIc(250, 60, 5)}`);
    default:
      return townScene(W, H, night);
  }
}

/** Small area chart (net worth by month). */
export function areaChart(vals: number[], w = 300, h = 90, color = "#2BB673") {
  const mx = Math.max(...vals), mn = Math.min(0, ...vals);
  const X = (i: number) => 6 + (i / Math.max(1, vals.length - 1)) * (w - 12), Y = (v: number) => 8 + (1 - (v - mn) / (mx - mn || 1)) * (h - 16);
  const line = vals.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" aria-hidden="true"><defs><linearGradient id="nwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <polygon points="${X(0)},${h - 4} ${line} ${X(vals.length - 1)},${h - 4}" fill="url(#nwg)"/><polyline points="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="ch-line"/>
    <circle cx="${X(vals.length - 1)}" cy="${Y(vals[vals.length - 1])}" r="4.5" fill="${color}" stroke="#fff" stroke-width="2"/></svg>`;
}

/** Generic illustration (used while a real photo loads, or when there is none): soft gradient + big icon. */
export function illus(iconSvg: string, color: string) {
  return `<div class="illus" style="--ic:${color}"><span class="b1"></span><span class="b2"></span>${iconSvg}</div>`;
}
