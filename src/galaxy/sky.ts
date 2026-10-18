/* ---------- Sky of the Altair galaxy (design doc 13.1 "Phong cách hình ảnh") ----------
 * 3 layers of stars at different depths (parallax comes from the real 3D distance), nebulae tinted by area colour,
 * star dust along the spiral arms, and the occasional shooting star. Light theme = pastel dawn, Night = deep violet. */
import * as THREE from "three";
import { ARMS, armAngle } from "./layout";
import { seeded } from "./planet";

/* ---- canvas textures (generated once) ---- */
let _glow: THREE.Texture | null = null;
export function glowTex() {
  if (_glow) return _glow;
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d")!, gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.22, "rgba(255,255,255,.55)"); gr.addColorStop(0.55, "rgba(255,255,255,.12)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  _glow = new THREE.CanvasTexture(c); _glow.colorSpace = THREE.SRGBColorSpace;
  return _glow;
}
const _neb: THREE.Texture[] = [];
export function nebulaTex(i: number) {
  if (_neb[i]) return _neb[i];
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d")!, rnd = seeded(31 + i * 7);
  for (let k = 0; k < 16; k++) { // overlapping soft blobs → cloudy shape
    const x = 128 + (rnd() - 0.5) * 120, y = 128 + (rnd() - 0.5) * 120, r = 30 + rnd() * 70;
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,255,255,${0.16 + rnd() * 0.14})`); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; _neb[i] = t;
  return t;
}
function streakTex() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 16;
  const g = c.getContext("2d")!, gr = g.createLinearGradient(0, 0, 256, 0);
  gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.85, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,1)");
  g.fillStyle = gr; g.fillRect(0, 5, 256, 6);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---- point clouds: round soft points, optional twinkle ---- */
const pointsVS = `attribute float size; attribute float phase; attribute vec3 color; uniform float uPR; uniform float uTime; uniform float uTw; uniform float uAtt; varying vec3 vC; varying float vA;
void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vC = color; vA = 1. - uTw * 0.45 * (0.5 + 0.5 * sin(uTime * (1.2 + phase) + phase * 6.28));
  float s = size * uPR; if (uAtt > 0.) s *= clamp(uAtt / -mv.z, 0.35, 3.); gl_PointSize = max(s, 1.); gl_Position = projectionMatrix * mv; }`;
const pointsFS = `uniform float uOp; varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, d); a = a * a; gl_FragColor = vec4(vC, a * vA * uOp); }`;
export function pointsMat(night: boolean, opacity: number, att: number) {
  return new THREE.ShaderMaterial({
    uniforms: { uPR: { value: 1 }, uTime: { value: 0 }, uTw: { value: 1 }, uOp: { value: opacity }, uAtt: { value: att } },
    vertexShader: pointsVS, fragmentShader: pointsFS, transparent: true, depthWrite: false,
    blending: night ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}
function cloud(pos: number[], col: number[], size: number[], phase: number[], mat: THREE.ShaderMaterial) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute("size", new THREE.Float32BufferAttribute(size, 1));
  g.setAttribute("phase", new THREE.Float32BufferAttribute(phase, 1));
  const p = new THREE.Points(g, mat); p.frustumCulled = false; return p;
}

export interface Sky { group: THREE.Group; mats: THREE.ShaderMaterial[]; update(t: number, motion: boolean, cam: THREE.Camera): void; dispose(): void }

/** 3 star shells (far → near) around the galaxy. */
function starShells(night: boolean, potato: boolean) {
  const rnd = seeded(5), group = new THREE.Group(), mats: THREE.ShaderMaterial[] = [];
  const layers = [{ R: 2600, n: 1400, s: [1.0, 2.0] }, { R: 1600, n: 700, s: [1.4, 2.6] }, { R: 950, n: 260, s: [2.0, 3.6] }];
  const pal = night ? ["#FFFFFF", "#DCD6FF", "#FFE9B8", "#BFD8FF"] : ["#FFFFFF", "#FFFFFF", "#FFF4D6", "#F0EBFF"];
  layers.forEach((L, li) => {
    const pos: number[] = [], col: number[] = [], size: number[] = [], ph: number[] = [];
    const n = potato ? L.n / 3 : L.n;
    for (let i = 0; i < n; i++) {
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      pos.push(Math.cos(th) * s * L.R, u * L.R * 0.8 - L.R * 0.15, Math.sin(th) * s * L.R);
      const c = new THREE.Color(pal[Math.floor(rnd() * pal.length)]); col.push(c.r, c.g, c.b);
      size.push(L.s[0] + rnd() * (L.s[1] - L.s[0]) * (rnd() < 0.08 ? 1.8 : 1)); ph.push(rnd());
    }
    const m = pointsMat(night, night ? 0.95 : 0.75 - li * 0.05, 0); mats.push(m);
    group.add(cloud(pos, col, size, ph, m));
  });
  return { group, mats };
}

/** Dust and young stars along the spiral arms + the bright bulge round Altair. */
function armDust(night: boolean, potato: boolean, sysColors: { angle: number; color: string }[]) {
  const rnd = seeded(17), pos: number[] = [], col: number[] = [], size: number[] = [], ph: number[] = [];
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const brand = new THREE.Color(night ? "#8E8CF5" : "#7B78E8"), gold = new THREE.Color("#FFD97A"), white = new THREE.Color("#FFFFFF");
  const N = potato ? 3000 : 11000;
  for (let i = 0; i < N; i++) {
    const bulge = i < N * 0.16;
    let x: number, z: number, y: number, c: THREE.Color;
    if (bulge) {
      const r = Math.abs(gauss()) * 11, a = rnd() * Math.PI * 2; x = Math.cos(a) * r; z = Math.sin(a) * r; y = gauss() * 2.2 * (1 - r / 14);
      c = gold.clone().lerp(white, rnd() * 0.6);
    } else {
      const arm = i % ARMS, r = 7 + Math.pow(rnd(), 0.85) * 92, a = armAngle(arm, r) + gauss() * 0.12;
      const spread = 1.2 + r * 0.06;
      x = Math.cos(a) * r + gauss() * spread; z = Math.sin(a) * r + gauss() * spread; y = gauss() * 1.2 * (1.1 - r / 110);
      // tint with the colour of the nearest system on the arm
      let best = sysColors[0], bd = 1e9;
      sysColors.forEach((s) => { const d = Math.abs(Math.atan2(Math.sin(a - s.angle), Math.cos(a - s.angle))); if (d < bd) { bd = d; best = s; } });
      c = brand.clone().lerp(new THREE.Color(best.color), 0.25 + rnd() * 0.4);
      if (rnd() < 0.12) c.lerp(white, 0.7);
    }
    if (!night) c.multiplyScalar(0.92);
    pos.push(x, y, z); col.push(c.r, c.g, c.b); size.push((bulge ? 2.6 : 2.0) + rnd() * 3); ph.push(rnd());
  }
  const m = pointsMat(night, night ? 0.9 : 0.7, 260);
  return { obj: cloud(pos, col, size, ph, m), mat: m };
}

export function buildSky(night: boolean, potato: boolean, systems: { center: THREE.Vector3; color: string }[]): Sky {
  const group = new THREE.Group();
  const shells = starShells(night, potato);
  group.add(shells.group);
  const dust = armDust(night, potato, systems.map((s) => ({ angle: Math.atan2(s.center.z, s.center.x), color: s.color })));
  group.add(dust.obj);
  const rnd = seeded(77);
  // nebulae: brand violet round the core, area colours round each system
  const neb = (pos: THREE.Vector3, color: string, scale: number, op: number, ti: number) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: nebulaTex(ti), color, transparent: true, opacity: op, depthWrite: false, blending: night ? THREE.AdditiveBlending : THREE.NormalBlending }));
    s.position.copy(pos); s.scale.set(scale, scale, 1); s.material.rotation = rnd() * 6.28; group.add(s); return s;
  };
  neb(new THREE.Vector3(0, -4, 0), "#5B5BD6", 120, night ? 0.5 : 0.32, 0);
  neb(new THREE.Vector3(0, -2, 0), "#FFC93C", 34, night ? 0.4 : 0.35, 1);
  systems.forEach((s, i) => {
    neb(s.center.clone().add(new THREE.Vector3((rnd() - 0.5) * 8, -3, (rnd() - 0.5) * 8)), s.color, 46 + rnd() * 14, night ? 0.38 : 0.3, (i + 1) % 3);
    neb(s.center.clone().multiplyScalar(1.12).add(new THREE.Vector3(0, -5, 0)), "#5B5BD6", 40, night ? 0.25 : 0.16, (i + 2) % 3);
  });
  // shooting stars
  const stex = streakTex();
  const shooters: { m: THREE.Mesh; t0: number; dur: number; from: THREE.Vector3; dir: THREE.Vector3 }[] = [];
  let next = 3;
  const mats = [...shells.mats, dust.mat];
  return {
    group, mats,
    update(t, motion, cam) {
      mats.forEach((m) => { m.uniforms.uTime.value = t; m.uniforms.uTw.value = motion ? 1 : 0; });
      if (!motion) { shooters.forEach((s) => (s.m.visible = false)); return; }
      if (t > next) { // spawn near what the camera looks at, scaled to the zoom level
        next = t + 4 + Math.random() * 6;
        const target = new THREE.Vector3(); cam.getWorldDirection(target);
        const camPos = (cam as THREE.PerspectiveCamera).position, d = camPos.y / Math.max(0.2, -target.y);
        const look = camPos.clone().add(target.multiplyScalar(d));
        const L = Math.max(4, d * 0.12), a = Math.random() * Math.PI * 2;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(L, L * 0.04), new THREE.MeshBasicMaterial({ map: stex, transparent: true, depthWrite: false, blending: night ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide, opacity: night ? 1 : 0.9 }));
        m.rotation.set(-Math.PI / 2, 0, a);
        const from = look.clone().add(new THREE.Vector3((Math.random() - 0.5) * d * 0.5, 2, (Math.random() - 0.5) * d * 0.5));
        group.add(m); shooters.push({ m, t0: t, dur: 0.9, from, dir: new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)).multiplyScalar(L * 1.6) });
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i], k = (t - s.t0) / s.dur;
        if (k >= 1) { group.remove(s.m); s.m.geometry.dispose(); (s.m.material as THREE.Material).dispose(); shooters.splice(i, 1); continue; }
        s.m.visible = true; s.m.position.copy(s.from).addScaledVector(s.dir, k); (s.m.material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI);
      }
    },
    dispose() {
      group.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose(); (m.material as THREE.Material | undefined)?.dispose?.(); });
      stex.dispose();
    },
  };
}
