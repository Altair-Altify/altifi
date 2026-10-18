/* ---------- Light galaxy background for Explore · Me · Settings · Play (design doc 13.1b-6) ----------
 * One 2D canvas, no WebGL. A static layer (sky gradient, faint spiral-arm dust, a soft veil behind the text column)
 * is painted once per theme/size; on top, every frame (≤ 30 fps):
 *   · 3 star layers drifting at different speeds — scrolling the page moves the near layer more (parallax)
 *   · every star twinkles on its own rhythm (random phase + speed)
 *   · nebulae in the app's area colours "breathe" (opacity + a slight turn, 20–30 s cycles)
 *   · a shooting star every 10–20 s at a random spot, a few small far-away planets drifting sideways
 * Stars and nebulae are strongest at the edges and the top, faint in the middle where the text sits.
 * Paused when hidden (other tab, lesson open, app in background); a single still frame with Potato Mode or
 * "reduce motion". The "My photo" theme hides it (photo wins). */
import { DOMAINS } from "../content/domains";
import { noMotion } from "../core/state";

const el = document.createElement("div");
el.className = "skybg";
el.setAttribute("aria-hidden", "true");
const cv = document.createElement("canvas");
el.appendChild(cv);
const ctx = cv.getContext("2d")!;
const base = document.createElement("canvas"); // static layer

interface Star { x: number; y: number; r: number; layer: number; ph: number; sp: number; a: number; sparkle: boolean }
interface Neb { x: number; y: number; r: number; color: string; a: number; ph: number; per: number; img: HTMLCanvasElement }
interface Planet { x: number; y: number; r: number; c1: string; c2: string; ring: boolean; v: number }
const S = { w: 0, h: 0, dpr: 1, night: false, key: "", stars: [] as Star[], nebs: [] as Neb[], planets: [] as Planet[], shoot: null as null | { x: number; y: number; dx: number; dy: number; t0: number }, nextShoot: 0, raf: 0, last: 0, scroll: 0, on: false };
const LAYER_SPEED = [1.2, 2.6, 4.8]; // px/s sideways drift: far → near
const LAYER_SCROLL = [0.03, 0.07, 0.14]; // share of the page scroll each layer follows

function prng(seed: number) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
const hexA = (hex: string, a: number) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
/** 0 in the text column (middle), 1 at the edges and the top of the screen. */
function edge(x: number, y: number) {
  const nx = (x - S.w / 2) / (S.w / 2), ny = (y - S.h * 0.58) / (S.h * 0.5);
  const d = Math.sqrt(nx * nx * 1.15 + ny * ny * 0.55);
  const top = y < S.h * 0.28 ? 1 - y / (S.h * 0.28) : 0;
  return Math.min(1, Math.max(smooth(0.35, 1, d), top));
}
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** Show/hide the background for the current tab; repaint if theme or size changed; start/stop the animation. */
export function syncSky(show: boolean) {
  const phone = document.querySelector<HTMLElement>(".phone");
  if (!phone) return;
  if (!el.isConnected) phone.prepend(el);
  document.body.classList.toggle("sky", show);
  if (!show) { stop(); return; }
  const night = document.body.classList.contains("night"), w = phone.clientWidth, h = phone.clientHeight;
  const key = `${night}|${w}|${h}`;
  if (key !== S.key && w > 0) { S.key = key; build(night, w, h); }
  watchScroll();
  start();
}
new ResizeObserver(() => { if (document.body.classList.contains("sky")) syncSky(true); }).observe(document.documentElement);
document.addEventListener("visibilitychange", () => { if (!document.hidden && document.body.classList.contains("sky")) start(); });

let scroller: HTMLElement | null = null;
function watchScroll() {
  const scr = document.getElementById("screen");
  if (!scr || scr === scroller) return;
  scroller = scr;
  scr.addEventListener("scroll", () => { S.scroll = scr.scrollTop; if (noMotion()) return; if (!S.raf) draw(performance.now()); }, { passive: true });
}

function build(night: boolean, w: number, h: number) {
  S.w = w; S.h = h; S.night = night; S.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  for (const c of [cv, base]) { c.width = Math.round(w * S.dpr); c.height = Math.round(h * S.dpr); }
  const rnd = prng(23);
  // stars: denser and brighter toward the edges / top
  S.stars = [];
  for (let i = 0; i < 260; i++) {
    const x = rnd() * w, y = rnd() * h, e = edge(x, y);
    if (rnd() > 0.25 + 0.75 * e) continue; // thin out the middle
    const layer = rnd() < 0.5 ? 0 : rnd() < 0.65 ? 1 : 2;
    S.stars.push({ x, y, layer, r: [0.6, 0.95, 1.4][layer] * (0.8 + rnd() * 0.6), ph: rnd() * 6.28, sp: 0.6 + rnd() * 1.8, a: 0.35 + 0.65 * e, sparkle: layer === 2 && rnd() < 0.45 });
  }
  // nebulae hugging the edges and the top corners, in the area colours + brand violet
  const spots: [number, number, number][] = [[0.05, 0.08, 0.55], [0.95, 0.14, 0.5], [0.0, 0.45, 0.42], [1.0, 0.58, 0.45], [0.12, 0.92, 0.42], [0.9, 0.95, 0.4], [0.5, -0.04, 0.5]];
  const cols = [...DOMAINS.map((d) => d.color), "#5B5BD6"];
  S.nebs = spots.map(([fx, fy, fr], i) => {
    const r = fr * Math.max(w, h) * 0.55, color = i === 6 ? "#5B5BD6" : cols[i % cols.length];
    return { x: fx * w, y: fy * h, r, color, a: night ? 0.75 : 0.9, ph: rnd() * 6.28, per: 20 + rnd() * 10, img: nebulaImg(r, color, prng(31 + i)) };
  });
  // a few small far-away planets drifting sideways
  const pc = [["#F7C59F", "#E8956B"], ["#BFD9FA", "#6F7BE6"], ["#C9DDA0", "#2FAE73"]];
  S.planets = [0, 1, 2].map((i) => ({ x: rnd() * w, y: h * [0.12, 0.3, 0.86][i], r: [7, 4.5, 6][i], c1: pc[i][0], c2: pc[i][1], ring: i === 0, v: (i % 2 ? -1 : 1) * (2 + rnd() * 2.5) }));
  S.nextShoot = performance.now() / 1000 + 3 + rnd() * 6;
  paintBase();
  draw(performance.now(), true);
}

function nebulaImg(r: number, color: string, rnd: () => number) {
  const c = document.createElement("canvas"), s = Math.ceil(r * 2);
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  for (let k = 0; k < 9; k++) { // a few overlapping soft blobs → cloudy, not a perfect disc
    const x = r + (rnd() - 0.5) * r * 0.8, y = r + (rnd() - 0.5) * r * 0.8, rr = r * (0.35 + rnd() * 0.5);
    const gr = g.createRadialGradient(x, y, 0, x, y, rr);
    gr.addColorStop(0, hexA(color, 0.5)); gr.addColorStop(1, hexA(color, 0));
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
  }
  return c;
}

function paintBase() {
  const g = base.getContext("2d")!, { w, h, night } = S;
  g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  let bg: CanvasGradient;
  if (night) {
    bg = g.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.max(w, h) * 0.8);
    bg.addColorStop(0, "#1E1740"); bg.addColorStop(0.6, "#140F2C"); bg.addColorStop(1, "#090716");
  } else {
    bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#B3A5FF"); bg.addColorStop(0.3, "#D6CCFF"); bg.addColorStop(0.62, "#F1E3F8"); bg.addColorStop(1, "#FFE3D6");
  }
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  // faint spiral-arm dust, mostly toward the edges
  const rnd = prng(7), cx = w / 2, cy = h * 0.5, R = w * 0.75;
  const armAt = (arm: number, r: number) => -Math.PI / 2 + (arm * 2 * Math.PI) / 3 + Math.log(Math.max(r, 4) / (R * 0.12));
  g.globalCompositeOperation = night ? "lighter" : "source-over";
  for (let i = 0; i < 1800; i++) {
    const arm = i % 3, r = R * (0.1 + Math.pow(rnd(), 0.8) * 0.95), a = armAt(arm, r), off = (rnd() + rnd() + rnd() - 1.5) * (5 + r * 0.05);
    const x = cx + Math.cos(a) * r - Math.sin(a) * off, y = cy + (Math.sin(a) * r + Math.cos(a) * off) * 1.5;
    const al = (0.25 + rnd() * 0.45) * (0.3 + 0.7 * edge(x, y));
    g.fillStyle = night ? `rgba(190,186,255,${al})` : `rgba(110,100,215,${al * 0.5})`;
    g.beginPath(); g.arc(x, y, 0.5 + rnd() * 0.9, 0, Math.PI * 2); g.fill();
  }
  g.globalCompositeOperation = "source-over";
}

function veil(g: CanvasRenderingContext2D) { // keeps the text column calm and readable
  const { w, h, night } = S, gr = g.createRadialGradient(w / 2, h * 0.58, 0, w / 2, h * 0.58, Math.max(w, h) * 0.55);
  gr.addColorStop(0, night ? "rgba(20,15,44,.55)" : "rgba(244,238,255,.62)");
  gr.addColorStop(0.55, night ? "rgba(20,15,44,.3)" : "rgba(244,238,255,.34)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  // and behind the page title block (top-left); the top-right corner keeps its colour
  g.save(); g.translate(w * 0.38, 118); g.scale(1, 0.42);
  const hb = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.62);
  hb.addColorStop(0, night ? "rgba(20,15,44,.72)" : "rgba(246,241,255,.8)"); hb.addColorStop(0.6, night ? "rgba(20,15,44,.5)" : "rgba(246,241,255,.55)"); hb.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = hb; g.fillRect(-w, -w, w * 2, w * 2); g.restore();
}

function draw(now: number, still = false) {
  const g = ctx, { w, h, night } = S, t = still ? 4 : now / 1000;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(base, 0, 0);
  g.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
  // nebulae breathe: opacity and a very slight turn
  g.globalCompositeOperation = night ? "lighter" : "source-over";
  for (const n of S.nebs) {
    const k = Math.sin((t * 2 * Math.PI) / n.per + n.ph);
    g.save(); g.globalAlpha = n.a * (0.72 + 0.28 * k); g.translate(n.x, n.y); g.rotate(0.06 * k); g.scale(1 + 0.04 * k, 1 + 0.04 * k);
    g.drawImage(n.img, -n.r, -n.r); g.restore();
  }
  g.globalCompositeOperation = "source-over";
  veil(g);
  // far planets drift sideways
  for (const p of S.planets) {
    const x = ((p.x + p.v * t) % (w + 40) + w + 40) % (w + 40) - 20, y = p.y - S.scroll * 0.02;
    g.globalAlpha = night ? 0.85 : 0.75;
    const gr = g.createRadialGradient(x - p.r * 0.4, y - p.r * 0.4, p.r * 0.1, x, y, p.r);
    gr.addColorStop(0, p.c1); gr.addColorStop(1, p.c2);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, p.r, 0, Math.PI * 2); g.fill();
    if (p.ring) { g.strokeStyle = hexA(p.c1, 0.8); g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, p.r * 1.8, p.r * 0.5, -0.35, 0, Math.PI * 2); g.stroke(); }
  }
  g.globalAlpha = 1;
  // stars: 3 drifting layers, each star twinkles on its own rhythm
  for (const s of S.stars) {
    const x = ((s.x + LAYER_SPEED[s.layer] * t) % w + w) % w, y = (((s.y - S.scroll * LAYER_SCROLL[s.layer]) % h) + h) % h;
    const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)), a = s.a * tw;
    if (!night) { g.fillStyle = `rgba(120,108,230,${a * 0.5})`; g.beginPath(); g.arc(x, y, s.r * 2.6, 0, Math.PI * 2); g.fill(); } // violet halo so white stars show on a pale sky
    g.fillStyle = `rgba(255,255,255,${Math.min(1, a + (night ? 0.1 : 0.25))})`;
    g.beginPath(); g.arc(x, y, s.r, 0, Math.PI * 2); g.fill();
    if (s.sparkle) { // 4-point glint on the brightest ones
      const L = s.r * 4 * tw; g.strokeStyle = `rgba(255,255,255,${a * 0.8})`; g.lineWidth = 0.8;
      g.beginPath(); g.moveTo(x - L, y); g.lineTo(x + L, y); g.moveTo(x, y - L); g.lineTo(x, y + L); g.stroke();
    }
  }
  // shooting star every 10–20 s
  if (!still) {
    if (!S.shoot && t > S.nextShoot) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      S.shoot = { x: Math.random() * w, y: Math.random() * h * 0.45, dx: dir * (w * 0.55), dy: h * 0.22, t0: t };
      S.nextShoot = t + 10 + Math.random() * 10;
    }
    if (S.shoot) {
      const k = (t - S.shoot.t0) / 0.9;
      if (k >= 1) S.shoot = null;
      else {
        const hx = S.shoot.x + S.shoot.dx * k, hy = S.shoot.y + S.shoot.dy * k, tx = hx - S.shoot.dx * 0.22, ty = hy - S.shoot.dy * 0.22;
        const gr = g.createLinearGradient(tx, ty, hx, hy), al = Math.sin(k * Math.PI);
        gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, `rgba(255,255,255,${al})`);
        g.strokeStyle = gr; g.lineWidth = 1.8; g.lineCap = "round";
        g.beginPath(); g.moveTo(tx, ty); g.lineTo(hx, hy); g.stroke();
        if (!night) { g.strokeStyle = `rgba(120,108,230,${al * 0.35})`; g.lineWidth = 4; g.beginPath(); g.moveTo(tx, ty); g.lineTo(hx, hy); g.stroke(); }
      }
    }
  }
}

/* ---------- loop: ≤ 30 fps, only while visible ---------- */
const hidden = () => document.hidden || !document.body.classList.contains("sky") || !!document.querySelector(".phone.ov");
function start() {
  if (noMotion()) { stop(); draw(0, true); return; } // Potato / reduce motion: one still frame
  if (S.raf) return;
  S.last = 0;
  const loop = (now: number) => {
    if (hidden()) { S.raf = 0; return; } // resumes on the next syncSky / visibilitychange
    S.raf = requestAnimationFrame(loop);
    if (now - S.last < 33) return;
    S.last = now;
    draw(now);
  };
  S.raf = requestAnimationFrame(loop);
}
function stop() { cancelAnimationFrame(S.raf); S.raf = 0; }
