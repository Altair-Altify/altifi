/* ===== Alti Lion — the lion mascot (from alti-lion.html), drop-in replacement for the old coin tiko() =====
 * lion(size, mood, cfg)  — same signature as the base demo's tiko().
 * Moods: happy · cheer · wow · sad · laugh (laugh is new; the base UI uses it when you get one wrong).
 * The eyes and mane are wrapped in groups so CSS can blink the eyes and wiggle the mane (off in Potato Mode). */
import type { Buddy } from "../core/state";
import { defaultM } from "../core/state";

type LionColor = { n: string; mane: string; maneD: string; face: string; muzzle: string; spot: string; ear: string; nose: string };
export const LION_COLORS: Record<string, LionColor> = {
  pink: { n: "Rose", mane: "#E8418C", maneD: "#B81E66", face: "#FF7EB3", muzzle: "#FFE0EC", spot: "#C2185B", ear: "#FFB3CF", nose: "#6E1A42" },
  gold: { n: "Gold", mane: "#F29F1F", maneD: "#C97A06", face: "#FFC94D", muzzle: "#FFF3D1", spot: "#D98306", ear: "#FFE08A", nose: "#5C3300" },
  coral: { n: "Coral", mane: "#F4683C", maneD: "#C4461F", face: "#FF9A76", muzzle: "#FFE6DC", spot: "#D24E26", ear: "#FFC4AE", nose: "#5E2312" },
  grape: { n: "Grape", mane: "#7E5BE0", maneD: "#5838B8", face: "#B49CFF", muzzle: "#EEE8FF", spot: "#6744CC", ear: "#D6C9FF", nose: "#2E1A6B" },
  mint: { n: "Mint", mane: "#2FB98A", maneD: "#1E8E68", face: "#7EE0B5", muzzle: "#E3FAEF", spot: "#24A276", ear: "#B5F0D6", nose: "#0F4A36" },
  sky: { n: "Sky", mane: "#3F8CE8", maneD: "#2667B8", face: "#8EC5FF", muzzle: "#E6F2FF", spot: "#2F76CF", ear: "#C4E0FF", nose: "#163A6B" },
};
const LINK = "#2A1608";
const lln = (d: string, c: string, w = 3.2) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const amberEye = (x: number, y: number, big?: boolean) => {
  const rx = big ? 6.6 : 5.8, ry = big ? 7.2 : 6.4;
  return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#FFC23D" stroke="#C98A00" stroke-width="1.2"/><ellipse cx="${x}" cy="${y + 0.6}" rx="${big ? 3.6 : 3.1}" ry="${big ? 4.4 : 3.9}" fill="${LINK}"/><circle cx="${x + 1.6}" cy="${y - 1.8}" r="${big ? 2.1 : 1.7}" fill="#fff"/>${big ? `<circle cx="${x - 1.8}" cy="${y + 2.6}" r="1" fill="#fff"/>` : ""}`;
};
type Part = { n: string; svg: (c: LionColor) => string };
export const LION_EYES: Record<string, Part> = {
  amber: { n: "Amber", svg: (c) => amberEye(39, 52) + amberEye(61, 52) + lln("M34 44.5 Q39 42.5 44 44.5", c.maneD, 2) + lln("M56 44.5 Q61 42.5 66 44.5", c.maneD, 2) },
  sparkly: { n: "Sparkly", svg: () => amberEye(39, 52, true) + amberEye(61, 52, true) },
  happy: { n: "Happy", svg: () => lln("M33 54 Q39 46 45 54", LINK) + lln("M55 54 Q61 46 67 54", LINK) },
  sleepy: { n: "Sleepy", svg: () => lln("M33 51 Q39 57 45 51", LINK) + lln("M55 51 Q61 57 67 51", LINK) },
  wink: { n: "Wink", svg: () => amberEye(39, 52) + lln("M55 54 Q61 46 67 54", LINK) },
  cool: { n: "Cool", svg: () => `<path d="M31 48 H47 Q47 57 39 57 Q31 57 31 48Z" fill="${LINK}"/><path d="M53 48 H69 Q69 57 61 57 Q53 57 53 48Z" fill="${LINK}"/>${lln("M47 49 H53", LINK, 2.4)}${lln("M35 50.5 H39", "#fff", 1.6)}${lln("M57 50.5 H61", "#fff", 1.6)}` },
};
export const LION_MOUTHS: Record<string, Part> = {
  cat: { n: "Kitty", svg: (c) => lln("M42 72 Q46 76 50 72 Q54 76 58 72", c.nose, 2.6) },
  smile: { n: "Smile", svg: (c) => lln("M50 68 V71", c.nose, 2.4) + lln("M41 71 Q50 80 59 71", c.nose, 2.8) },
  grin: { n: "Big grin", svg: (c) => lln("M50 68 V70", c.nose, 2.4) + `<path d="M40 71 L60 71 Q59 83 50 83 Q41 83 40 71Z" fill="${c.nose}"/><ellipse cx="50" cy="79.5" rx="5.5" ry="3" fill="#FF7B8F"/><path d="M43 71 L44.5 74 L46 71Z M54 71 L55.5 74 L57 71Z" fill="#fff"/>` },
  silly: { n: "Silly", svg: (c) => lln("M42 72 Q46 76 50 72 Q54 76 58 72", c.nose, 2.6) + `<path d="M47.5 74 Q47 82 51 82 Q55 82 54.5 74Z" fill="#FF7B8F"/>` },
  ooh: { n: "Ooh", svg: (c) => lln("M50 68 V70", c.nose, 2.4) + `<ellipse cx="50" cy="76" rx="4.4" ry="5.2" fill="${c.nose}"/>` },
  calm: { n: "Calm", svg: (c) => lln("M50 68 V71", c.nose, 2.4) + lln("M44 73 Q50 75 56 73", c.nose, 2.6) },
};
type Mood = { eyes?: string; mouth?: (c: LionColor) => string; brow?: (c: LionColor) => string; extra?: string };
const tear = (x: number, y: number) => `<path d="M${x} ${y} Q${x - 3.5} ${y + 6} ${x} ${y + 8} Q${x + 3.5} ${y + 6} ${x} ${y}Z" fill="#7CC4FF"/>`;
const LION_MOOD: Record<string, Mood> = {
  sad: {
    mouth: (c) => lln("M50 68 V71", c.nose, 2.4) + lln("M42 78 Q50 71 58 78", c.nose, 2.8),
    brow: () => lln("M32 45 Q38 44 44 47", LINK, 2.2) + lln("M56 47 Q62 44 68 45", LINK, 2.2),
    extra: tear(33, 58),
  },
  wow: { mouth: LION_MOUTHS.ooh.svg, eyes: "sparkly" },
  cheer: { mouth: LION_MOUTHS.grin.svg, eyes: "happy" },
  // laughing: squeezed ">  <" eyes + happy tears
  laugh: { mouth: LION_MOUTHS.grin.svg, eyes: "_laugh", extra: tear(27, 52) + tear(73, 52) },
};
const LAUGH_EYES = lln("M33 48 L43 52 L33 56", LINK, 3) + lln("M67 48 L57 52 L67 56", LINK, 3);

function maneSVG(c: LionColor) {
  let under = "", top = "";
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 - Math.PI / 2, x = 50 + 35 * Math.cos(a), y = 56 + 33 * Math.sin(a), r = i % 2 ? 12.5 : 14;
    under += `<circle cx="${x.toFixed(1)}" cy="${(y + 3).toFixed(1)}" r="${r}" fill="${c.maneD}"/>`;
    top += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${c.mane}"/>`;
  }
  const spots = [[-2.2, 1], [-1.6, 0.85], [-0.6, 1], [0.35, 0.9], [1.15, 1], [1.9, 0.85], [2.6, 1], [3.4, 0.9], [4.15, 1], [5.0, 0.85], [5.6, 1]]
    .map(([a, s]) => {
      const x = 50 + 37 * Math.cos(a), y = 56 + 35 * Math.sin(a);
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(3.2 * s).toFixed(1)}" ry="${(2.3 * s).toFixed(1)}" transform="rotate(${(a * 57.3 + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c.spot}" opacity=".55"/>`;
    }).join("");
  return under + `<circle cx="50" cy="59" r="36" fill="${c.maneD}"/>` + top + `<circle cx="50" cy="56" r="34" fill="${c.mane}"/>` + spots;
}

/* ---- Accessories (from the base demo), re-positioned for the lion's head ----
 * The coin's top was at y≈18 and its eyes at y=47; the lion's mane top is y≈7 and its eyes y=52.
 * `at` is the transform that moves each piece from coin coordinates onto the lion. */
const ln = (d: string, c: string, w = 4) => lln(d, c, w);
const heart = (cx: number, cy: number, s: number) => `M${cx} ${cy + 7 * s} C${cx - 13 * s} ${cy - s} ${cx - 7 * s} ${cy - 11 * s} ${cx} ${cy - 4 * s} C${cx + 7 * s} ${cy - 11 * s} ${cx + 13 * s} ${cy - s} ${cx} ${cy + 7 * s}Z`;
const star = (x: number, y: number, r: number) => `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`;
const petals = [0, 72, 144, 216, 288].map((a) => `<circle cx="${(79 + 6.5 * Math.cos((a * Math.PI) / 180)).toFixed(1)}" cy="${(28 + 6.5 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" r="5.5" fill="#FF8FB1"/>`).join("");
export type Acc = { id: string; n: string; vb: string; svg: string; tile?: string; at: string };
export const ACC: Record<"hat" | "glasses" | "extra", Acc[]> = {
  hat: [
    { id: "party", n: "Party hat", vb: "24 -18 52 48", at: "translate(0 -14)", svg: `<g transform="rotate(8 50 20)"><polygon points="36,26 64,26 50,-8" fill="#FF6FA5"/>${ln("M41 16 H59", "#fff", 3)}${ln("M45 6 H55", "#fff", 3)}<circle cx="50" cy="-9" r="5" fill="#FFE066"/></g>` },
    { id: "crown", n: "Crown", vb: "24 -2 52 34", at: "translate(0 -14)", svg: `<polygon points="30,28 30,8 40,17 50,2 60,17 70,8 70,28" fill="#FFD54F" stroke="#C99400" stroke-width="2.5" stroke-linejoin="round"/><circle cx="40" cy="23" r="2.8" fill="#EF4E4E"/><circle cx="50" cy="22" r="3.2" fill="#5B5BD6"/><circle cx="60" cy="23" r="2.8" fill="#2BB673"/>` },
    { id: "cap", n: "Cap", vb: "20 0 76 36", at: "translate(-5 -12) scale(1.1)", svg: `<path d="M24 29 C24 4 76 4 76 29 Z" fill="#3D5AFE"/><path d="M62 27 Q88 23 93 32 Q76 34 62 31Z" fill="#2A3FC0"/><circle cx="50" cy="8" r="3" fill="#2A3FC0"/>` },
    { id: "beanie", n: "Beanie", vb: "16 -8 68 46", at: "translate(-5 -12) scale(1.1)", svg: `<path d="M22 32 C22 2 78 2 78 32 Z" fill="#EF4E4E"/><rect x="19" y="25" width="62" height="11" rx="5.5" fill="#C53333"/>${ln("M36 12 V24", "#D84444", 2.5)}${ln("M50 7 V24", "#D84444", 2.5)}${ln("M64 12 V24", "#D84444", 2.5)}<circle cx="50" cy="1" r="7" fill="#fff" stroke="#E3E3F2" stroke-width="1.5"/>` },
    { id: "grad", n: "Graduate", vb: "6 -4 90 40", at: "translate(0 -12)", svg: `<path d="M30 14 L30 27 Q50 34 70 27 L70 14Z" fill="#2C2850"/><polygon points="50,0 90,12 50,24 10,12" fill="#1E1B3A"/>${ln("M50 12 L82 14 L82 29", "#FFC93C", 2.5)}<circle cx="82" cy="31" r="3.5" fill="#FFC93C"/><circle cx="50" cy="12" r="2.5" fill="#FFC93C"/>` },
  ],
  glasses: [
    { id: "round", n: "Round", vb: "14 32 72 30", at: "translate(0 5)", svg: `<circle cx="38" cy="47" r="10" fill="rgba(255,255,255,.35)" stroke="#1E1B3A" stroke-width="3"/><circle cx="62" cy="47" r="10" fill="rgba(255,255,255,.35)" stroke="#1E1B3A" stroke-width="3"/>${ln("M48 46 Q50 43 52 46", "#1E1B3A", 3)}${ln("M28 45 L18 42", "#1E1B3A", 3)}${ln("M72 45 L82 42", "#1E1B3A", 3)}` },
    { id: "sun", n: "Shades", vb: "14 34 72 26", at: "translate(0 5)", svg: `<path d="M24 40 H48 V47 Q48 56 37 56 Q26 56 24 47Z" fill="#1E1B3A"/><path d="M52 40 H76 V47 Q74 56 63 56 Q52 56 52 47Z" fill="#1E1B3A"/>${ln("M48 43 H52", "#1E1B3A", 3)}${ln("M24 41 L17 39", "#1E1B3A", 3)}${ln("M76 41 L83 39", "#1E1B3A", 3)}${ln("M29 44 H34", "#fff", 2)}${ln("M57 44 H62", "#fff", 2)}` },
    { id: "heart", n: "Hearts", vb: "18 30 64 32", at: "translate(0 5)", svg: `<path d="${heart(38, 47, 1.25)}" fill="#FF4F8B" stroke="#D6336C" stroke-width="2"/><path d="${heart(62, 47, 1.25)}" fill="#FF4F8B" stroke="#D6336C" stroke-width="2"/>${ln("M48 45 H52", "#D6336C", 2.5)}` },
  ],
  extra: [
    { id: "bow", n: "Bow tie", vb: "28 76 44 30", at: "translate(0 -2)", svg: `<path d="M50 91 L35 83 Q32 91 35 99Z" fill="#5B5BD6"/><path d="M50 91 L65 83 Q68 91 65 99Z" fill="#5B5BD6"/><circle cx="50" cy="91" r="4.5" fill="#4342B0"/>` },
    { id: "flower", n: "Flower", vb: "62 11 34 34", at: "translate(6 -8)", svg: `${petals}<circle cx="79" cy="28" r="4.5" fill="#FFE680"/>` },
    { id: "phones", n: "Headphones", vb: "4 4 92 66", at: "translate(50 54) scale(1.22) translate(-50 -50)", svg: `<path d="M16 52 C16 4 84 4 84 52" stroke="#1E1B3A" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="8" y="42" width="15" height="24" rx="7" fill="#5B5BD6"/><rect x="77" y="42" width="15" height="24" rx="7" fill="#5B5BD6"/>` },
    { id: "sparkle", n: "Sparkles", vb: "0 0 60 50", at: "", tile: `<path d="${star(22, 22, 14)}" fill="#FFD54F"/><path d="${star(46, 14, 8)}" fill="#8EC5FF"/><path d="${star(44, 38, 7)}" fill="#FF8FB1"/>`, svg: `<path d="${star(2, 22, 8)}" fill="#FFD54F"/><path d="${star(100, 70, 7)}" fill="#FFD54F"/><path d="${star(94, 6, 5)}" fill="#8EC5FF"/><path d="${star(0, 82, 5)}" fill="#FF8FB1"/>` },
  ],
};
export const accOf = (part: keyof typeof ACC, id: string | null) => (id ? ACC[part].find((a) => a.id === id) : undefined);
const place = (a?: Acc) => (a ? `<g transform="${a.at}">${a.svg}</g>` : "");

let cfgSource: () => Buddy = defaultM;
/** The shell tells the mascot where the user's saved buddy lives (avoids an import cycle with state). */
export function setBuddySource(fn: () => Buddy) { cfgSource = fn; }

export function lion(size = 80, mood = "happy", cfg?: Partial<Buddy>): string {
  const b: Buddy = { ...defaultM(), ...(cfg || cfgSource()) };
  const c = LION_COLORS[b.color] || LION_COLORS.pink;
  const md = LION_MOOD[mood] || {};
  const eyesKey = md.eyes || b.eyes || "amber";
  const eyes = eyesKey === "_laugh" ? LAUGH_EYES : (LION_EYES[eyesKey] || LION_EYES.amber).svg(c);
  const mouth = md.mouth ? md.mouth(c) : (LION_MOUTHS[b.mouth] || LION_MOUTHS.cat).svg(c);
  const brow = md.brow ? md.brow(c) : "";
  const hat = accOf("hat", b.hat), gl = accOf("glasses", b.glasses), ex = accOf("extra", b.extra);
  const pendant = ex?.id === "bow" ? "" :
    `<path d="M44 84.5 Q50 87 56 84.5" stroke="${c.maneD}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="50" cy="91" r="7" fill="#FFC93C" stroke="#E0A800" stroke-width="2"/><text x="50" y="94.4" text-anchor="middle" font-family="Nunito,sans-serif" font-size="8.5" font-weight="900" fill="#8A5A00">₫</text>`;
  const blinks = eyesKey === "amber" || eyesKey === "sparkly";
  return `<svg class="lion" width="${size}" height="${size}" viewBox="-10 -12 120 120" aria-hidden="true" style="flex:none;overflow:visible">
   <g class="lion-mane">${maneSVG(c)}</g>
   <circle cx="29" cy="31" r="8.5" fill="${c.face}"/><circle cx="29" cy="31.5" r="4.6" fill="${c.ear}"/>
   <circle cx="71" cy="31" r="8.5" fill="${c.face}"/><circle cx="71" cy="31.5" r="4.6" fill="${c.ear}"/>
   <ellipse cx="50" cy="59" rx="27" ry="26" fill="${c.face}"/>
   <path d="M50 36 Q46 41 50 45 Q54 41 50 36Z" fill="${c.spot}" opacity=".45"/><ellipse cx="43" cy="40" rx="2.2" ry="1.6" fill="${c.spot}" opacity=".45"/><ellipse cx="57" cy="40" rx="2.2" ry="1.6" fill="${c.spot}" opacity=".45"/>
   <ellipse cx="43" cy="70" rx="9.5" ry="7.5" fill="${c.muzzle}"/><ellipse cx="57" cy="70" rx="9.5" ry="7.5" fill="${c.muzzle}"/><ellipse cx="50" cy="77" rx="7" ry="5" fill="${c.muzzle}"/>
   <ellipse cx="28.5" cy="64" rx="5" ry="3" fill="#FF6F91" opacity=".45"/><ellipse cx="71.5" cy="64" rx="5" ry="3" fill="#FF6F91" opacity=".45"/>
   <g class="lion-eyes${blinks ? " blink" : ""}">${eyes}</g>${brow}
   <path d="M44.5 62.5 Q50 60.5 55.5 62.5 Q55 66.5 50 68.5 Q45 66.5 44.5 62.5Z" fill="${c.nose}"/><ellipse cx="48" cy="62.8" rx="1.8" ry=".9" fill="#fff" opacity=".5"/>
   ${mouth}${md.extra || ""}
   <g fill="${c.nose}" opacity=".5"><circle cx="38" cy="70" r=".9"/><circle cx="35" cy="72.5" r=".9"/><circle cx="38.5" cy="74" r=".9"/><circle cx="62" cy="70" r=".9"/><circle cx="65" cy="72.5" r=".9"/><circle cx="61.5" cy="74" r=".9"/></g>
   ${pendant}${place(gl)}${place(hat)}${place(ex)}
  </svg>`;
}

/** Full-body Alti Lion (home hero): the same head on a small body, waving paw and a tail with a mane-coloured tuft.
 *  CSS classes: .lion-wave (waving arm), .lion-tail. Same cfg/mood as lion(). */
export function lionFull(width = 120, mood = "happy", cfg?: Partial<Buddy>): string {
  const b: Buddy = { ...defaultM(), ...(cfg || cfgSource()) };
  const c = LION_COLORS[b.color] || LION_COLORS.pink;
  const head = lion(120, mood, b).replace("<svg ", '<svg x="0" y="0" ');
  const h = Math.round(width * 1.3);
  return `<svg class="lionfull" width="${width}" height="${h}" viewBox="-8 -10 136 176" aria-hidden="true" style="overflow:visible">
    <ellipse cx="60" cy="160" rx="34" ry="6" fill="rgba(30,27,58,.14)"/>
    <g class="lion-tail"><path d="M84 138 C104 140 112 120 104 106" stroke="${c.face}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="104" cy="103" r="8" fill="${c.mane}"/><circle cx="101" cy="100" r="3" fill="${c.spot}" opacity=".5"/></g>
    <rect x="42" y="134" width="14" height="22" rx="7" fill="${c.face}"/><rect x="64" y="134" width="14" height="22" rx="7" fill="${c.face}"/>
    <ellipse cx="49" cy="156" rx="10" ry="5.5" fill="${c.muzzle}"/><ellipse cx="71" cy="156" rx="10" ry="5.5" fill="${c.muzzle}"/>
    <ellipse cx="60" cy="124" rx="28" ry="24" fill="${c.face}"/><ellipse cx="60" cy="130" rx="16" ry="15" fill="${c.muzzle}"/>
    <ellipse cx="34" cy="128" rx="8" ry="13" fill="${c.face}" transform="rotate(14 34 128)"/><ellipse cx="32" cy="140" rx="7" ry="5" fill="${c.muzzle}"/>
    <g class="lion-wave"><ellipse cx="92" cy="104" rx="8" ry="15" fill="${c.face}" transform="rotate(32 92 104)"/><circle cx="99" cy="91" r="8" fill="${c.muzzle}"/><path d="M95 86v3M99 85v3M103 86v3" stroke="${c.nose}" stroke-width="1.4" stroke-linecap="round" opacity=".5"/></g>
    ${head}
  </svg>`;
}
