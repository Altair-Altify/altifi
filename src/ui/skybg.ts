/* ---------- Light galaxy background for Explore · Me · Settings · Play (design doc 13.1b-6) ----------
 * One 2D canvas painted once per theme/size (same palette as the Three.js galaxy: pastel dawn / deep violet,
 * 3 spiral arms, area-coloured nebulae, faint stars). It only drifts with a very slow CSS animation, which
 * Potato Mode and "reduce motion" switch off. No WebGL here. The "My photo" theme hides it (photo wins). */
import { DOMAINS } from "../content/domains";

const el = document.createElement("div");
el.className = "skybg";
el.setAttribute("aria-hidden", "true");
const cv = document.createElement("canvas");
el.appendChild(cv);
let painted = "";

function prng(seed: number) { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }

/** Show/hide the background for the current tab and repaint if the theme or size changed. */
export function syncSky(show: boolean) {
  const phone = document.querySelector<HTMLElement>(".phone");
  if (!phone) return;
  if (!el.isConnected) phone.prepend(el);
  document.body.classList.toggle("sky", show);
  if (!show) return;
  const night = document.body.classList.contains("night"), w = phone.clientWidth, h = phone.clientHeight;
  const key = `${night}|${w}|${h}`;
  if (key !== painted && w > 0) { painted = key; paint(night, w, h); }
}
new ResizeObserver(() => { if (document.body.classList.contains("sky")) syncSky(true); }).observe(document.documentElement);

function paint(night: boolean, w: number, h: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = Math.round(w * 1.3), H = Math.round(h * 1.3);
  cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext("2d")!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const rnd = prng(23);
  // sky
  if (night) {
    const bg = g.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.75);
    bg.addColorStop(0, "#2A1F55"); bg.addColorStop(0.55, "#17112F"); bg.addColorStop(1, "#0B0919");
    g.fillStyle = bg;
  } else {
    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#E6E0FF"); bg.addColorStop(0.45, "#EEE2FA"); bg.addColorStop(0.75, "#FBE5EE"); bg.addColorStop(1, "#FFEBDD");
    g.fillStyle = bg;
  }
  g.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H * 0.45, R = W * 0.62, SZ = 1.5; // vertical stretch like the 3D galaxy
  const blob = (x: number, y: number, r: number, color: string, a: number) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, hexA(color, a)); gr.addColorStop(1, hexA(color, 0));
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  const armAt = (arm: number, r: number) => -Math.PI / 2 + (arm * 2 * Math.PI) / 3 + 1.0 * Math.log(Math.max(r, 4) / (R * 0.12));
  // nebulae in the area colours along the arms + brand violet + a warm core
  blob(cx, cy, R * 0.9, "#5B5BD6", night ? 0.22 : 0.12);
  DOMAINS.forEach((d, i) => { const r = R * (0.25 + 0.13 * i), a = armAt(i % 3, r); blob(cx + Math.cos(a) * r, cy + Math.sin(a) * r * SZ, R * 0.32, d.color, night ? 0.2 : 0.14); });
  blob(cx, cy, R * 0.22, "#FFC93C", night ? 0.3 : 0.22);
  // arms: soft haze + fine dust that fades outward
  g.globalCompositeOperation = night ? "lighter" : "source-over";
  for (let i = 0; i < 180; i++) {
    const arm = i % 3, r = R * (0.08 + Math.pow(rnd(), 0.8) * 0.9), a = armAt(arm, r);
    blob(cx + Math.cos(a) * r, cy + Math.sin(a) * r * SZ, 26 + rnd() * 30, night ? "#9B98FF" : "#FFFFFF", (night ? 0.05 : 0.12) * (1 - r / R));
  }
  for (let i = 0; i < 2600; i++) {
    const arm = i % 3, r = R * (0.05 + Math.pow(rnd(), 0.9) * 0.95), a = armAt(arm, r), off = (rnd() + rnd() + rnd() - 1.5) * (6 + r * 0.05);
    const x = cx + Math.cos(a) * r - Math.sin(a) * off, y = cy + (Math.sin(a) * r + Math.cos(a) * off) * SZ;
    const alpha = Math.pow(1 - r / (R * 1.05), 1.3) * (0.35 + rnd() * 0.5);
    g.fillStyle = night ? `rgba(${rnd() < 0.15 ? "255,255,255" : "190,186,255"},${alpha})` : `rgba(${rnd() < 0.2 ? "255,255,255" : "120,114,220"},${alpha * 0.55})`;
    const s = 0.5 + rnd() * 1.1;
    g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.fill();
  }
  g.globalCompositeOperation = "source-over";
  // distant stars
  for (let i = 0; i < 140; i++) {
    g.fillStyle = night ? `rgba(255,255,255,${0.25 + rnd() * 0.65})` : `rgba(255,255,255,${0.45 + rnd() * 0.45})`;
    g.beginPath(); g.arc(rnd() * W, rnd() * H, 0.4 + rnd() * (night ? 1.2 : 0.9), 0, Math.PI * 2); g.fill();
  }
}
function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
