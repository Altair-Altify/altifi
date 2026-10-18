/* ---------- Procedural low-poly planets (design doc 13.1) ----------
 * Icosphere + value-noise displacement, one flat colour per facet (the low-poly look shared with the 13.3 town),
 * a glowing rim atmosphere, and a "feature" that hints at the lesson topic (credit-card ring, boba moons, cracks…).
 * The planet's state changes how it looks: dark + misty (not learned), beacon (suggested), half-lit (in progress),
 * bright + ring (done), + golden moon (deep dive done), dashed sketch (no content yet). No asset files needed. */
import * as THREE from "three";
import type { PlanetDef } from "../lesson/types";
import { glowTex } from "./sky";

export type PState = "soon" | "new" | "suggested" | "progress" | "done" | "deep";
export interface PlanetObj {
  group: THREE.Group;
  spin: THREE.Group; // rotates with the planet (drag at level 3 spins this)
  radius: number;
  update(t: number, dt: number, motion: boolean): void;
  dispose(): void;
}

/* ---- tiny deterministic noise ---- */
const fract = (x: number) => x - Math.floor(x);
const hash3 = (x: number, y: number, z: number) => fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453);
const sm = (t: number) => t * t * (3 - 2 * t);
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = sm(x - xi), yf = sm(y - yi), zf = sm(z - zi);
  const l = (a: number, b: number, k: number) => a + (b - a) * k;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return l(l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf), l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf), zf);
}
export const fbm = (x: number, y: number, z: number) => (vnoise(x, y, z) * 0.5 + vnoise(x * 2.03, y * 2.03, z * 2.03) * 0.3 + vnoise(x * 4.1, y * 4.1, z * 4.1) * 0.2);
export function seeded(seed: number) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
export const seedOf = (id: string) => [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100003, 7);

/* ---- state → colour ---- */
const LUM = new THREE.Color();
function tint(c: THREE.Color, st: PState, x = 0): THREE.Color {
  const out = c.clone();
  const gray = (k: number) => { const l = out.r * 0.3 + out.g * 0.59 + out.b * 0.11; LUM.setRGB(l, l, l); out.lerp(LUM, k); };
  if (st === "new") { gray(0.5); out.multiplyScalar(0.4); }
  else if (st === "suggested") { gray(0.3); out.multiplyScalar(0.62); }
  else if (st === "progress") out.multiplyScalar(0.36 + 0.64 * THREE.MathUtils.smoothstep(x, -0.25, 0.25));
  return out;
}

/* ---- rim-light atmosphere (fresnel) ---- */
function atmosphere(r: number, color: THREE.Color, strength: number, night: boolean) {
  const m = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color }, uK: { value: strength } },
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `uniform vec3 uColor; uniform float uK; varying vec3 vN; void main(){ float i = pow(clamp(0.72 - dot(vN, vec3(0.,0.,1.)), 0., 1.), 2.2); gl_FragColor = vec4(uColor, i * uK); }`,
    side: THREE.BackSide, transparent: true, depthWrite: false,
    blending: night ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  return new THREE.Mesh(new THREE.IcosahedronGeometry(r * 1.24, 3), m);
}

/* ---- the body ---- */
function bodyGeometry(def: PlanetDef, r: number, seed: number, detail: number) {
  const g = new THREE.IcosahedronGeometry(r, detail); // non-indexed → flat facets
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3(), o = seed * 0.37;
  const amp = def.shape === "rocky" ? 0.24 : def.shape === "ice" ? 0.1 : def.shape === "gas" ? 0.025 : 0.3;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let h = fbm(v.x * 1.7 + o, v.y * 1.7 + o, v.z * 1.7 + o) - 0.5;
    if (def.shape === "ocean") h = Math.max(h - 0.02, 0) * 1.4;
    if (def.feature === "craters") for (let k = 0; k < 5; k++) {
      const c = new THREE.Vector3(Math.sin(k * 2.1 + seed), Math.cos(k * 1.3 + seed) * 0.8, Math.cos(k * 2.1 + seed)).normalize();
      const d = v.distanceTo(c); if (d < 0.42) h -= 0.16 * (1 - (d / 0.42) ** 2);
    }
    v.multiplyScalar(r * (1 + h * amp));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function colourFaces(g: THREE.BufferGeometry, def: PlanetDef, r: number, seed: number, st: PState) {
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const cols = new Float32Array(pos.count * 3), pal = def.palette.map((h) => new THREE.Color(h));
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), m = new THREE.Vector3();
  const rnd = seeded(seed);
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); c.fromBufferAttribute(pos, i + 2);
    m.copy(a).add(b).add(c).divideScalar(3);
    const h = m.length() / r - 1, n = m.clone().normalize();
    let idx: number;
    const P = pal.length;
    if (def.feature === "pie") idx = Math.floor(((Math.atan2(n.z, n.x) + Math.PI) / (2 * Math.PI)) * P) % P;
    else if (def.feature === "split") idx = (n.x > 0 ? 0 : 2) + (h > 0.0 ? 1 : 0);
    else if (def.feature === "strata") idx = Math.min(P - 1, Math.floor(((n.y + 1) / 2) * P));
    else if (def.shape === "gas") { const band = Math.sin(n.y * 9 + fbm(n.x * 2, n.y * 2, n.z * 2) * 3.2); idx = band > 0.55 ? 3 : band > 0 ? 1 : band > -0.5 ? 0 : 2; }
    else if (def.shape === "ocean") idx = h <= 0.001 ? (fbm(n.x * 3, n.y * 3, n.z * 3) > 0.5 ? 1 : 0) : h > 0.07 ? 3 : 2;
    else idx = h < -0.03 ? 0 : h < 0.015 ? 1 : h < 0.05 ? 2 : 3;
    if (def.shape === "ice" && Math.abs(n.y) > 0.82) idx = P - 1; // polar caps
    const col = pal[Math.min(idx, P - 1)].clone().multiplyScalar(0.93 + rnd() * 0.12);
    const out = tint(col, st, n.x);
    for (let k = 0; k < 3; k++) { cols[(i + k) * 3] = out.r; cols[(i + k) * 3 + 1] = out.g; cols[(i + k) * 3 + 2] = out.b; }
  }
  g.setAttribute("color", new THREE.BufferAttribute(cols, 3));
}

const std = (color: THREE.ColorRepresentation, st: PState, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color: tint(new THREE.Color(color), st), flatShading: true, roughness: 0.8, metalness: 0.05, ...extra });

/* ---- topic features: each returns an object (added to the spinning group or the fixed group) + optional animation ---- */
type Feat = { spin?: THREE.Object3D; fixed?: THREE.Object3D; update?: (t: number, dt: number) => void; hasRing?: boolean };
function feature(def: PlanetDef, r: number, st: PState, accent: THREE.Color, seed: number, body: THREE.Mesh): Feat {
  const rnd = seeded(seed + 11), G = () => new THREE.Group();
  switch (def.feature) {
    case "leak": { // coins slipping away from the planet (where did my pocket money go?)
      const g = G(), coins: THREE.Mesh[] = [], geo = new THREE.CylinderGeometry(0.13 * r, 0.13 * r, 0.04 * r, 10), mat = std("#FFC93C", st, { metalness: 0.4, roughness: 0.4, emissive: new THREE.Color("#7A5200"), emissiveIntensity: st === "done" || st === "deep" ? 0.4 : 0 });
      for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(geo, mat); c.userData.k = i / 9; coins.push(c); g.add(c); }
      return { fixed: g, update: (t) => coins.forEach((c) => { const k = fract(c.userData.k + t * 0.06), ang = k * 3.4 + 0.6, d = r * (1.15 + k * 1.9); c.position.set(Math.cos(ang) * d, (k - 0.3) * r * 0.9, Math.sin(ang) * d); c.rotation.set(t * 2 + c.userData.k * 9, t, 0); c.scale.setScalar(1 - k * 0.6); }) };
    }
    case "cardRing": case "tagRing": { // a ring of credit cards (13.1 "Bẫy 0 đồng") / price tags
      const g = G(), n = def.feature === "cardRing" ? 14 : 12, cols = def.feature === "cardRing" ? ["#5B5BD6", "#FFC93C", "#F7867A", "#2D2A4A"] : ["#FFFFFF", "#F5A524", "#EF4E4E"];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, m = new THREE.Mesh(def.feature === "cardRing" ? new THREE.BoxGeometry(0.42 * r, 0.03 * r, 0.27 * r) : new THREE.BoxGeometry(0.22 * r, 0.035 * r, 0.32 * r), std(cols[i % cols.length], st));
        m.position.set(Math.cos(a) * r * 1.75, 0, Math.sin(a) * r * 1.75); m.rotation.y = -a + (def.feature === "cardRing" ? 0 : Math.PI / 2); g.add(m);
      }
      g.rotation.set(0.38, 0, def.feature === "cardRing" ? 0.22 : -0.3);
      return { fixed: g, hasRing: true, update: (t) => { g.rotation.y = t * (def.feature === "cardRing" ? 0.25 : -0.2); } };
    }
    case "shrink": { // a dashed outline of the size it used to be + slow shrinking pulse
      const pts = []; for (let i = 0; i <= 64; i++) { const a = (i / 64) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r * 1.22, 0, Math.sin(a) * r * 1.22)); }
      const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: tint(accent, st), dashSize: r * 0.12, gapSize: r * 0.09, transparent: true, opacity: 0.75 }));
      ln.computeLineDistances();
      const holder = G(); holder.add(ln); holder.rotation.x = 0.3;
      return { fixed: holder, update: (t) => { body.scale.setScalar(0.92 + 0.08 * (0.5 + 0.5 * Math.cos(t * 0.5))); } };
    }
    case "flags": { // red flags sticking out (scam warning signs)
      const g = G();
      for (let i = 0; i < 6; i++) {
        const n = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), f = G();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02 * r, 0.02 * r, 0.55 * r, 5), std("#EDE7F6", st)); pole.position.y = 0.27 * r; f.add(pole);
        const flag = new THREE.Mesh(new THREE.ConeGeometry(0.12 * r, 0.3 * r, 3), std("#EF4E4E", st, { emissive: new THREE.Color("#5A0A0A"), emissiveIntensity: 0.6 })); flag.rotation.z = -Math.PI / 2; flag.position.set(0.15 * r, 0.46 * r, 0); flag.scale.z = 0.25; f.add(flag);
        f.position.copy(n).multiplyScalar(r * 0.98); f.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n); g.add(f);
      }
      return { spin: g };
    }
    case "strata": { // a slice of the crust floating off (the deductions taken from your pay)
      const shell = new THREE.Mesh(new THREE.SphereGeometry(r * 1.07, 10, 6, 0, Math.PI / 2, 0, Math.PI / 2.6), std(def.palette[3] || "#fff", st, { side: THREE.DoubleSide }));
      const g = G(); g.add(shell);
      return { spin: g, update: (t) => { const k = 0.12 + 0.1 * Math.sin(t * 0.8); shell.position.set(k * r, k * r * 0.8, k * r); } };
    }
    case "boba": { // milk tea planet: straw + tapioca-pearl moons
      const g = G(), f = G(), mat = std("#3B2418", st, { roughness: 0.3 }), pearls: THREE.Mesh[] = [];
      for (let i = 0; i < 7; i++) { const p = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 * r, 1), mat); p.userData = { a: rnd() * 6.28, d: r * (1.45 + rnd() * 0.5), s: 0.4 + rnd() * 0.5, tilt: (rnd() - 0.5) * 1.2 }; pearls.push(p); f.add(p); }
      const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * r, 0.09 * r, 1.3 * r, 8), std("#F7867A", st)); straw.position.set(0.25 * r, 1.05 * r, 0); straw.rotation.z = -0.3; g.add(straw);
      return { spin: g, fixed: f, update: (t) => pearls.forEach((p) => { const u = p.userData, a = u.a + t * u.s; p.position.set(Math.cos(a) * u.d, Math.sin(a) * u.d * u.tilt * 0.5, Math.sin(a) * u.d); }) };
    }
    case "craters": return {};
    case "twin": { // two worlds orbiting each other: debt & equity
      const twin = new THREE.Mesh(bodyGeometry({ ...def, feature: "craters" }, r * 0.55, seed + 5, 1), std("#5B5BD6", st)); const f = G(); f.add(twin);
      return { fixed: f, update: (t) => twin.position.set(Math.cos(t * 0.5) * r * 1.9, Math.sin(t * 0.5) * r * 0.35, Math.sin(t * 0.5) * r * 1.9) };
    }
    case "cities": { // many little branch buildings
      const g = G();
      for (let i = 0; i < 26; i++) {
        const n = new THREE.Vector3(rnd() - 0.5, (rnd() - 0.5) * 1.4, rnd() - 0.5).normalize(), h = (0.12 + rnd() * 0.26) * r;
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.13 * r, h, 0.13 * r), std(i % 4 ? "#FFF6E6" : "#F5A524", st, { emissive: new THREE.Color("#FFC93C"), emissiveIntensity: st === "done" || st === "deep" ? 0.25 : 0 }));
        b.position.copy(n).multiplyScalar(r * 0.97 + h / 2); b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n); g.add(b);
      }
      return { spin: g };
    }
    case "swell": return { update: (t) => body.scale.setScalar(1 + 0.07 * (0.5 + 0.5 * Math.sin(t * 0.9))) }; // inflating gas giant
    case "dial": { // the central bank's interest-rate dial
      const g = G(), ring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.55, r * 0.05, 6, 48), std("#FFC93C", st, { metalness: 0.5, roughness: 0.35 }));
      const knob = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.17, 1), std("#FFFFFF", st)); ring.add(knob); knob.position.set(r * 1.55, 0, 0);
      ring.rotation.x = Math.PI / 2.4; g.add(ring);
      return { fixed: g, hasRing: true, update: (t) => { ring.rotation.z = Math.sin(t * 0.4) * 1.4; } };
    }
    case "satellites": { // news satellites with blinking lights
      const f = G(), sats: THREE.Group[] = [];
      for (let i = 0; i < 3; i++) {
        const s = G(); s.add(new THREE.Mesh(new THREE.BoxGeometry(0.16 * r, 0.16 * r, 0.22 * r), std("#E8E6F5", st)));
        const pan = new THREE.Mesh(new THREE.BoxGeometry(0.6 * r, 0.02 * r, 0.16 * r), std("#3D5AFE", st, { metalness: 0.6, roughness: 0.3 })); s.add(pan);
        const blink = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: "#FF6B6B", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); blink.scale.setScalar(0.35 * r); blink.position.y = 0.12 * r; s.add(blink);
        s.userData = { a: i * 2.1, inc: (i - 1) * 0.7, blink }; sats.push(s); f.add(s);
      }
      return { fixed: f, update: (t) => sats.forEach((s, i) => { const u = s.userData, a = u.a + t * 0.35; s.position.set(Math.cos(a) * r * 1.65, Math.sin(a) * r * 1.65 * Math.sin(u.inc), Math.sin(a) * r * 1.65 * Math.cos(u.inc)); s.rotation.y = -a; (u.blink as THREE.Sprite).material.opacity = fract(t * 0.8 + i * 0.3) < 0.15 ? 1 : 0.15; }) };
    }
    case "twinMoons": { // two steering wheels: fiscal & monetary moons
      const f = G(), m1 = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.26, 1), std("#3D7BF5", st)), m2 = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.26, 1), std("#B79CFF", st)); f.add(m1, m2);
      return { fixed: f, update: (t) => { m1.position.set(Math.cos(t * 0.6) * r * 1.7, 0.2 * r, Math.sin(t * 0.6) * r * 1.7); m2.position.set(Math.cos(t * 0.6 + Math.PI) * r * 1.7, -0.2 * r, Math.sin(t * 0.6 + Math.PI) * r * 1.7); } };
    }
    case "bars": { // chart columns round the equator (up & down days)
      const g = G();
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2, h = (0.15 + Math.abs(Math.sin(i * 1.7 + seed)) * 0.5) * r, up = Math.sin(i * 2.3 + seed) > -0.2;
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.14 * r, h, 0.14 * r), std(up ? "#2BB673" : "#EF4E4E", st, { emissive: new THREE.Color(up ? "#0E5" : "#F33"), emissiveIntensity: st === "done" || st === "deep" ? 0.15 : 0 }));
        const n = new THREE.Vector3(Math.cos(a), 0, Math.sin(a)); b.position.copy(n).multiplyScalar(r * 0.96 + h / 2); b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n); g.add(b);
      }
      return { spin: g };
    }
    case "crystals": { // gold & crypto crystal shards
      const g = G();
      for (let i = 0; i < 11; i++) {
        const n = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(), s = (0.14 + rnd() * 0.16) * r;
        const c = new THREE.Mesh(new THREE.OctahedronGeometry(s, 0), std(i % 3 ? "#FFC93C" : "#9FE7F5", st, { metalness: 0.7, roughness: 0.25, emissive: new THREE.Color(i % 3 ? "#7A5200" : "#0A6E80"), emissiveIntensity: st === "done" || st === "deep" ? 0.5 : 0.1 }));
        c.scale.y = 2.2; c.position.copy(n).multiplyScalar(r * 1.02); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n); g.add(c);
      }
      return { spin: g };
    }
    case "pie": return {};
    case "saturn": { // a heavy ring of debt
      const geo = new THREE.RingGeometry(r * 1.4, r * 2.3, 64, 3), cols: number[] = [], p = geo.getAttribute("position") as THREE.BufferAttribute, pal = def.palette.map((h) => new THREE.Color(h));
      for (let i = 0; i < p.count; i++) { const d = Math.hypot(p.getX(i), p.getY(i)), k = Math.max(0, Math.floor(((d - r * 1.4) / (r * 0.9)) * 7)) % pal.length; const c = tint(pal[k], st); cols.push(c.r, c.g, c.b); }
      geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      const ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }));
      ring.rotation.set(-Math.PI / 2 + 0.45, 0, 0.2); const f = G(); f.add(ring);
      return { fixed: f, hasRing: true };
    }
    case "split": { // a bright seam between two currencies
      const seam = new THREE.Mesh(new THREE.TorusGeometry(r * 1.03, r * 0.035, 5, 40), std("#FFC93C", st, { emissive: new THREE.Color("#FFC93C"), emissiveIntensity: 0.5 }));
      seam.rotation.y = Math.PI / 2; const g = G(); g.add(seam); return { spin: g };
    }
    case "cracked": { // 1997: a planet breaking apart over a molten core
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.86, 1), new THREE.MeshBasicMaterial({ color: tint(new THREE.Color("#FF7A2F"), st === "new" ? "suggested" : st) }));
      const pos = body.geometry.getAttribute("position") as THREE.BufferAttribute, a = new THREE.Vector3(), m = new THREE.Vector3();
      for (let i = 0; i < pos.count; i += 3) {
        m.set(0, 0, 0); for (let k = 0; k < 3; k++) m.add(a.fromBufferAttribute(pos, i + k)); m.divideScalar(3).normalize();
        const cl = Math.floor(fbm(m.x * 1.3 + 9, m.y * 1.3, m.z * 1.3) * 6); const push = (0.04 + (cl % 3) * 0.05) * r;
        const dir = new THREE.Vector3(Math.sin(cl * 2.4), Math.cos(cl * 1.7), Math.sin(cl * 3.1)).normalize().multiplyScalar(push * 0.6).add(m.clone().multiplyScalar(push));
        for (let k = 0; k < 3; k++) { a.fromBufferAttribute(pos, i + k).add(dir); pos.setXYZ(i + k, a.x, a.y, a.z); }
      }
      pos.needsUpdate = true; body.geometry.computeVertexNormals();
      const g = G(); g.add(core); return { spin: g };
    }
  }
  return {};
}

/** Turn every mesh of a group into dashed outlines ("sketch" for lessons without content yet). */
function sketchify(root: THREE.Object3D, color: THREE.Color, r: number) {
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => { if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh); });
  meshes.forEach((m) => {
    const ln = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 12), new THREE.LineDashedMaterial({ color, dashSize: r * 0.1, gapSize: r * 0.08, transparent: true, opacity: 0.85 }));
    ln.computeLineDistances();
    ln.position.copy(m.position); ln.quaternion.copy(m.quaternion); ln.scale.copy(m.scale);
    m.parent!.add(ln);
    m.material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.06, depthWrite: false });
    ln.userData.sketchOf = m;
  });
}

export function makePlanet(def: PlanetDef, r: number, seed: number, st: PState, domainColor: string, opts: { night: boolean; detail: number; noRing?: boolean }): PlanetObj {
  const group = new THREE.Group(), spin = new THREE.Group(), fixed = new THREE.Group();
  group.add(spin, fixed);
  const accent = new THREE.Color(domainColor);
  const lit = st === "done" || st === "deep";
  const geo = bodyGeometry(def, r, seed, def.shape === "gas" ? opts.detail + 1 : opts.detail);
  colourFaces(geo, def, r, seed, st === "soon" ? "done" : st);
  const body = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.85, metalness: 0.04, emissive: lit ? accent.clone().multiplyScalar(0.12) : new THREE.Color(0) }));
  spin.add(body);
  const f = feature(def, r, st, accent, seed, body);
  if (f.spin) spin.add(f.spin);
  if (f.fixed) fixed.add(f.fixed);
  const ups: Array<(t: number, dt: number) => void> = [];
  if (f.update) ups.push(f.update);

  if (st === "soon") {
    const sk = opts.night ? accent.clone().lerp(new THREE.Color("#fff"), 0.35) : accent.clone().multiplyScalar(0.75);
    sketchify(group, sk, r);
  } else {
    const atmoK = { new: 0.35, suggested: 0.65, progress: 0.8, done: 1.1, deep: 1.2 }[st];
    const atmoC = accent.clone().lerp(new THREE.Color("#ffffff"), opts.night ? 0.15 : 0.3);
    group.add(atmosphere(r, atmoC, opts.night ? atmoK : atmoK * 0.42, opts.night));
  }
  if (st === "new" || st === "suggested") { // mist around planets you haven't visited
    const mist = new THREE.Group(), mc = opts.night ? "#7C6FB0" : "#FFFFFF";
    for (let i = 0; i < 7; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: mc, transparent: true, opacity: opts.night ? 0.22 : 0.32, depthWrite: false }));
      const a = (i / 7) * Math.PI * 2; s.position.set(Math.cos(a) * r * 1.05, Math.sin(a * 2) * r * 0.4, Math.sin(a) * r * 1.05); s.scale.setScalar(r * 1.7); mist.add(s);
    }
    fixed.add(mist);
    ups.push((t) => { mist.rotation.y = t * 0.08; });
  }
  if (lit && !opts.noRing) { // finished → a ring (thin halo if the planet already wears a ring)
    const ringR = f.hasRing ? [r * 2.45, r * 2.6] : [r * 1.5, r * 1.9];
    const ring = new THREE.Mesh(new THREE.RingGeometry(ringR[0], ringR[1], 64), new THREE.MeshBasicMaterial({ color: accent.clone().lerp(new THREE.Color("#FFE9A8"), 0.35), side: THREE.DoubleSide, transparent: true, opacity: 0.7, depthWrite: false }));
    ring.rotation.set(-Math.PI / 2 + 0.35, 0, -0.25); fixed.add(ring);
  }
  if (st === "deep") { // deep dive done → golden moon
    const moon = new THREE.Mesh(new THREE.IcosahedronGeometry(r * 0.24, 1), new THREE.MeshStandardMaterial({ color: "#FFC93C", flatShading: true, emissive: new THREE.Color("#B8860B"), emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.3 }));
    fixed.add(moon);
    ups.push((t) => moon.position.set(Math.cos(t * 0.7 + 1) * r * 2.25, Math.sin(t * 0.7) * r * 0.5, Math.sin(t * 0.7 + 1) * r * 2.25));
  }
  if (st === "suggested") { // blinking beacon
    const beacon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: "#FFC93C", transparent: true, depthWrite: false, blending: opts.night ? THREE.AdditiveBlending : THREE.NormalBlending }));
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.03, r * 0.03, r * 1.1, 6), new THREE.MeshBasicMaterial({ color: "#FFC93C", transparent: true, opacity: 0.8 }));
    beam.position.y = r * 1.45; beacon.position.y = r * 2.05; fixed.add(beam, beacon);
    ups.push((t) => { const k = 0.5 + 0.5 * Math.sin(t * 4); beacon.scale.setScalar(r * (0.7 + 0.7 * k)); beacon.material.opacity = 0.45 + 0.55 * k; });
  }
  const spinSpeed = 0.12 + (seed % 7) * 0.02;
  return {
    group, spin, radius: r,
    update(t, dt, motion) {
      if (!motion) return;
      spin.rotation.y += dt * spinSpeed;
      ups.forEach((u) => u(t, dt));
    },
    dispose() {
      group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose();
      });
    },
  };
}
