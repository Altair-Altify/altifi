/* ---------- The Altair galaxy: Three.js scene, camera rig and gestures (design doc 13.1) ----------
 * Semantic zoom with 3 levels: 1 = whole galaxy (systems), 2 = one system (planets), 3 = one planet (lesson card).
 * Camera = a target point on the galaxy plane + distance + elevation (+ a vertical view shift at level 3 so the planet
 * sits in the top half). Gestures: drag to pan (with inertia), pinch / wheel to zoom, double-tap to zoom in.
 * Labels and buttons are HTML (src/ui/learn.ts) placed every frame with project(); the canvas itself is decoration. */
import * as THREE from "three";
import type { DomainId, PlanetDef } from "../lesson/types";
import { DOMAINS } from "../content/domains";
import { layoutSystems, HOME_POS, ORBIT_Z, type SystemSpot } from "./layout";
import { makePlanet, seedOf, type PState, type PlanetObj } from "./planet";
import { buildSky, glowTex, type Sky } from "./sky";

export type Level = 1 | 2 | 3;
export interface GxNode { id: string; domain: DomainId; state: PState; planet: PlanetDef }
export interface GxModel {
  nodes: GxNode[];
  links: { from: string; to: string; lit: boolean }[];
  cons: { id: DomainId; lit: boolean[]; complete: boolean }[]; // one star per lesson, lit when done; complete = every lesson incl. "soon" (13.1b-1)
  homeLights: number;
  comet: boolean;
  night: boolean; potato: boolean; motion: boolean;
}
export interface GxHooks {
  frame(): void; // camera moved / animated → re-place HTML labels
  level(level: Level, dom: DomainId | null, node: string | null): void;
  pick(key: string): void; // tap on the canvas near an object ("pl:id", "sys:id", "altair", "home", "comet")
  hidden(): boolean; // covered (lesson open, other tab, background) → skip rendering
}
interface Rig { target: THREE.Vector3; dist: number; elev: number; shift: number }

const FOV = 50, TAN = Math.tan(((FOV / 2) * Math.PI) / 180);
const DEG = Math.PI / 180;
const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const lighten = (hex: string, k: number) => new THREE.Color(hex).lerp(new THREE.Color("#ffffff"), k);

/* ---- light bands between planets ("good to know first") — flat glowing ribbons with pulses flowing toward the lesson ---- */
function ribbons(list: { a: THREE.Vector3; b: THREE.Vector3; ca: string; cb: string; lit: boolean; ctrl: THREE.Vector3; w: number }[], night: boolean) {
  const P: number[] = [], N: number[] = [], S: number[] = [], AL: number[] = [], CA: number[] = [], CB: number[] = [], L: number[] = [], idx: number[] = [];
  const SEG = 32;
  list.forEach((r) => {
    const base = P.length / 3, ca = new THREE.Color(r.ca), cb = new THREE.Color(r.cb);
    const curve = new THREE.QuadraticBezierCurve3(r.a, r.ctrl, r.b);
    for (let i = 0; i <= SEG; i++) {
      const k = i / SEG, p = curve.getPoint(k), tg = curve.getTangent(k), n = new THREE.Vector3(-tg.z, 0, tg.x).normalize().multiplyScalar(r.w);
      for (const side of [-1, 1]) { P.push(p.x, p.y, p.z); N.push(n.x, n.y, n.z); S.push(side); AL.push(k); CA.push(ca.r, ca.g, ca.b); CB.push(cb.r, cb.g, cb.b); L.push(r.lit ? 1 : 0); }
      if (i < SEG) { const v = base + i * 2; idx.push(v, v + 1, v + 2, v + 1, v + 3, v + 2); }
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  g.setAttribute("nrm", new THREE.Float32BufferAttribute(N, 3));
  g.setAttribute("side", new THREE.Float32BufferAttribute(S, 1));
  g.setAttribute("along", new THREE.Float32BufferAttribute(AL, 1));
  g.setAttribute("ca", new THREE.Float32BufferAttribute(CA, 3));
  g.setAttribute("cb", new THREE.Float32BufferAttribute(CB, 3));
  g.setAttribute("lit", new THREE.Float32BufferAttribute(L, 1));
  g.setIndex(idx);
  const m = new THREE.ShaderMaterial({
    uniforms: { uW: { value: 1 }, uTime: { value: 0 }, uMotion: { value: 1 }, uNight: { value: night ? 1 : 0 } },
    vertexShader: `attribute vec3 nrm; attribute float side; attribute float along; attribute vec3 ca; attribute vec3 cb; attribute float lit; uniform float uW;
      varying float vS; varying float vA; varying vec3 vC; varying float vL;
      void main(){ vS = side; vA = along; vL = lit; vC = mix(ca, cb, along); vec3 p = position + nrm * side * uW * (0.7 + 0.5 * lit); gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,
    fragmentShader: `uniform float uTime; uniform float uMotion; uniform float uNight; varying float vS; varying float vA; varying vec3 vC; varying float vL;
      void main(){ float e = 1. - abs(vS); float a = pow(e, 1.5);
        float flow = 0.5 + 0.5 * sin(vA * 18. - uTime * 2.2); float pulse = mix(0.65, 1., mix(0.5, flow, uMotion));
        float ends = smoothstep(0., .06, vA) * smoothstep(1., .94, vA);
        vec3 c = mix(vC * 0.82, vC * 1.25 + 0.1, uNight);
        gl_FragColor = vec4(c, a * pulse * ends * mix(0.38, 0.95, vL)); }`,
    transparent: true, depthWrite: false, blending: night ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false;
  return mesh;
}

const sprite = (color: THREE.ColorRepresentation, scale: number, op: number, night: boolean) => {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color, transparent: true, opacity: op, depthWrite: false, blending: night ? THREE.AdditiveBlending : THREE.NormalBlending }));
  s.scale.setScalar(scale); return s;
};
function disposeTree(o: THREE.Object3D) {
  o.traverse((x) => { const m = x as THREE.Mesh; m.geometry?.dispose(); const mt = m.material as THREE.Material | THREE.Material[] | undefined; if (Array.isArray(mt)) mt.forEach((q) => q.dispose()); else mt?.dispose(); });
}

export class Galaxy {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 6000);
  private w = 1; private h = 1;
  private layout: SystemSpot[] = layoutSystems(DOMAINS);
  private sysById = new Map<DomainId, SystemSpot>(this.layout.map((s) => [s.id, s]));
  private planetSpot = new Map(this.layout.flatMap((s) => s.planets.map((p) => [p.id, p] as const)));
  private staticGroup = new THREE.Group();
  private dynGroup = new THREE.Group();
  private sky: Sky | null = null;
  private planets = new Map<string, PlanetObj>();
  private home: PlanetObj | null = null;
  private links: THREE.Mesh | null = null;
  private altair: THREE.Group | null = null;
  private comet: { g: THREE.Group; tail: THREE.Points; hist: THREE.Vector3[]; lastLevel: number } | null = null;
  private cons: { g: THREE.Group; stars: { s: THREE.Sprite; lit: boolean }[]; complete: boolean }[] = [];
  private insets = { top: 56, bottom: 90 };
  private themeKey = ""; private dynKey = "";
  readonly pos = new Map<string, THREE.Vector3>(); // label anchors
  level: Level = 1; focusDom: DomainId | null = null; focusNode: string | null = null;
  private rig: Rig = { target: new THREE.Vector3(), dist: 360, elev: 60 * DEG, shift: 0.03 };
  private tw: { from: Rig; to: Rig; t0: number; dur: number; hop: number; done?: () => void } | null = null;
  private vel = new THREE.Vector2(); private inertia = false;
  private running = false; private raf = 0; private last = 0; private t = 0; private dirty = true;
  private ptrs = new Map<number, { x: number; y: number }>();
  private gesture = { moved: 0, dragging: false, span: 0, dist0: 0, lastTap: 0, tapX: 0, tapY: 0, tm: 0 };
  private lastDragEnd = 0;
  motion = true;

  constructor(private host: HTMLElement, private hooks: GxHooks, potato: boolean) {
    this.renderer = new THREE.WebGLRenderer({ antialias: !potato, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    this.canvas.className = "gx-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.scene.add(new THREE.HemisphereLight("#EEE9FF", "#3B3270", 1.5));
    const sun = new THREE.DirectionalLight("#FFFFFF", 2.3); sun.position.set(-50, 80, 70); this.scene.add(sun);
    this.scene.add(this.staticGroup, this.dynGroup);
    this.pos.set("altair", new THREE.Vector3(0, 0, 0));
    this.pos.set("home", HOME_POS.clone());
    this.layout.forEach((s) => { this.pos.set("sys:" + s.id, s.center.clone()); s.planets.forEach((p) => this.pos.set("pl:" + p.id, p.pos.clone())); });
    this.bindInput();
  }

  /* ---------- building ---------- */
  setModel(m: GxModel) {
    this.motion = m.motion;
    const theme = `${m.night}|${m.potato}`;
    if (theme !== this.themeKey) { this.themeKey = theme; this.dynKey = ""; this.buildStatic(m); }
    const dyn = JSON.stringify([m.nodes.map((n) => n.state), m.links, m.cons, m.homeLights, m.comet]);
    if (dyn !== this.dynKey) { this.dynKey = dyn; this.buildDynamic(m); }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, m.potato ? 1 : 2));
    this.dirty = true;
  }

  private buildStatic(m: GxModel) {
    if (this.sky) { this.sky.dispose(); }
    disposeTree(this.staticGroup); this.staticGroup.clear();
    this.sky = buildSky(m.night, m.potato, this.layout.map((s) => ({ center: s.center, color: DOMAINS.find((d) => d.id === s.id)!.color })));
    this.staticGroup.add(this.sky.group);
    // Altair at the centre: where Alti Lion lives
    const a = new THREE.Group();
    a.add(new THREE.Mesh(new THREE.IcosahedronGeometry(2.3, 1), new THREE.MeshBasicMaterial({ color: "#FFF4C9" })));
    a.add(sprite("#FFC93C", 20, m.night ? 0.95 : 0.9, m.night), sprite("#FFFFFF", 7.5, 0.95, m.night), sprite("#FFB347", 46, m.night ? 0.35 : 0.3, m.night));
    this.altair = a; this.staticGroup.add(a);
    // each area's star + faint orbits
    this.layout.forEach((s) => {
      const d = DOMAINS.find((x) => x.id === s.id)!, g = new THREE.Group();
      g.position.copy(s.center);
      g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), new THREE.MeshBasicMaterial({ color: lighten(d.color, m.night ? 0.55 : 0.2) })));
      g.add(sprite(d.color, 11, m.night ? 0.85 : 0.75, m.night), sprite(m.night ? "#FFFFFF" : lighten(d.color, 0.5), 3.2, 0.9, m.night));
      s.planets.forEach((p) => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 96; i++) { const k = (i / 96) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(k) * p.orbit, 0, Math.sin(k) * p.orbit * ORBIT_Z)); }
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: m.night ? lighten(d.color, 0.2) : new THREE.Color(d.color).multiplyScalar(0.85), transparent: true, opacity: m.night ? 0.22 : 0.3 })));
      });
      this.staticGroup.add(g);
    });
  }

  private buildDynamic(m: GxModel) {
    this.planets.forEach((p) => p.dispose()); this.planets.clear();
    this.home?.dispose(); this.home = null;
    this.cons = [];
    disposeTree(this.dynGroup); this.dynGroup.clear();
    const detail = m.potato ? 1 : 2;
    const colorOf = (id: DomainId) => DOMAINS.find((d) => d.id === id)!.color;
    m.nodes.forEach((n) => {
      const spot = this.planetSpot.get(n.id)!;
      const p = makePlanet(n.planet, spot.r, seedOf(n.id), n.state, colorOf(n.domain), { night: m.night, detail });
      p.group.position.copy(spot.pos);
      p.spin.rotation.y = (seedOf(n.id) % 628) / 100;
      this.planets.set(n.id, p); this.dynGroup.add(p.group);
    });
    // home planet (bridge to the Play tab): more town lights as the player progresses
    const home = makePlanet({ shape: "rocky", palette: ["#5AA9E6", "#7CCB8A", "#A9DE8F", "#FFF3D6"], feature: "cities" }, 1.8, 4242, "done", "#7CCB8A", { night: m.night, detail, noRing: true });
    home.group.position.copy(HOME_POS);
    for (let i = 0; i < m.homeLights; i++) {
      const a = i * 2.39996, y = ((i * 0.37) % 1.6) - 0.8, n = new THREE.Vector3(Math.cos(a) * Math.sqrt(1 - y * y), y, Math.sin(a) * Math.sqrt(1 - y * y));
      const l = sprite("#FFD45A", 0.85, 1, m.night); l.position.copy(n.multiplyScalar(1.8 * 1.12)); home.spin.add(l);
    }
    this.home = home; this.dynGroup.add(home.group);
    // light bands
    const list = m.links.map((l) => {
      const A = this.planetSpot.get(l.from)!.pos, B = this.planetSpot.get(l.to)!.pos;
      const nf = m.nodes.find((n) => n.id === l.from)!, nt = m.nodes.find((n) => n.id === l.to)!;
      const mid = A.clone().add(B).multiplyScalar(0.5);
      let ctrl: THREE.Vector3;
      if (nf.domain === nt.domain) { const c = this.sysById.get(nf.domain)!.center; ctrl = mid.clone().add(mid.clone().sub(c).setY(0).normalize().multiplyScalar(1.8)); }
      else ctrl = mid.clone().multiplyScalar(0.55); // cross-area bands bow toward Altair: one connected economy
      ctrl.y = 0.4;
      return { a: A, b: B, ca: colorOf(nf.domain), cb: colorOf(nt.domain), lit: l.lit, ctrl, w: nf.domain === nt.domain ? 0.11 : 0.14 };
    });
    if (list.length) { this.links = ribbons(list, m.night); this.dynGroup.add(this.links); }
    // constellations (seen at level 1): each system's planets are its stars — a star lights up per finished lesson;
    // when every lesson of the area is done (incl. "soon" ones) the lines glow gold and the whole figure pulses
    m.cons.forEach((c) => {
      const s = this.sysById.get(c.id)!, g = new THREE.Group(), col = colorOf(c.id);
      const pts = s.planets.map((p) => p.pos.clone().setY(1.2));
      const stars = pts.map((p, i) => { const st = sprite(c.lit[i] ? (c.complete ? "#FFE08A" : "#FFFFFF") : lighten(col, 0.3), 1, c.lit[i] ? 1 : 0.45, m.night); st.position.copy(p); g.add(st); return { s: st, lit: c.lit[i] }; });
      const lineC = c.complete ? new THREE.Color("#FFD45A") : m.night ? lighten(col, 0.3) : new THREE.Color(col).multiplyScalar(0.8);
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: lineC, transparent: true, opacity: c.complete ? 0.95 : 0.28 })));
      if (c.complete) { const glow = sprite("#FFD45A", s.radius * 2.6, m.night ? 0.35 : 0.3, m.night); glow.position.copy(s.center); g.add(glow); }
      this.cons.push({ g, stars, complete: c.complete }); this.dynGroup.add(g);
    });
    // reward comet
    this.comet = null;
    if (m.comet) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), new THREE.MeshBasicMaterial({ color: "#E8F7FF" })));
      g.add(sprite("#9FE3FF", 3.6, 1, m.night), sprite("#FFFFFF", 1.4, 1, m.night));
      const N = 34, geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
      const tail = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.9, map: glowTex(), color: "#BFEFFF", transparent: true, opacity: 0.8, depthWrite: false, blending: m.night ? THREE.AdditiveBlending : THREE.NormalBlending }));
      tail.frustumCulled = false;
      this.comet = { g, tail, hist: [], lastLevel: 0 };
      this.dynGroup.add(g, tail);
    }
  }

  /* ---------- camera framing per level ---------- */
  private aspect() { return this.w / Math.max(1, this.h); }
  /** Room left for the scene between the HUD (top) and the floating card (bottom), in px — set by the HTML layer. */
  setInsets(top: number, bottom: number) {
    if (Math.abs(top - this.insets.top) < 2 && Math.abs(bottom - this.insets.bottom) < 2) return;
    this.insets = { top, bottom };
    if (!this.tw && this.level < 3) this.rig = this.rigFor(this.level, this.level === 2 ? this.focusDom : null);
    this.dirty = true;
  }
  /** Distance + vertical view shift so a box (half-sizes hx, hz on the plane) fills the free area of the screen. */
  private fit(hx: number, hz: number, elev: number) {
    const { top, bottom } = this.insets, avail = Math.max(0.35, (this.h - top - bottom) / this.h);
    const dist = Math.max(hx / (TAN * this.aspect()), (hz * Math.sin(elev)) / (TAN * avail)) * 1.04;
    return { dist, shift: (bottom - top) / (2 * this.h) };
  }
  private galBox() {
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    this.layout.forEach((s) => { x0 = Math.min(x0, s.center.x - 9); x1 = Math.max(x1, s.center.x + 9); z0 = Math.min(z0, s.center.z - 9); z1 = Math.max(z1, s.center.z + 9); });
    return { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, hx: (x1 - x0) / 2, hz: (z1 - z0) / 2 };
  }
  galDist() { const b = this.galBox(); return this.fit(b.hx, b.hz, 72 * DEG).dist; }
  private planetDist(id: string) { const r = this.planetSpot.get(id)!.r * 2.7; return r / (TAN * Math.min(this.aspect(), 1)) * 1.05; }
  private elevFor(dist: number) {
    const lo = 40, hi = this.galDist(), k = THREE.MathUtils.clamp(Math.log(dist / lo) / Math.log(hi / lo), 0, 1);
    return (60 + 12 * k) * DEG;
  }
  private rigFor(level: Level, id?: string | null): Rig {
    if (level === 1) { const b = this.galBox(), f = this.fit(b.hx, b.hz, 72 * DEG); return { target: new THREE.Vector3(b.cx, 0, b.cz), dist: f.dist, elev: 72 * DEG, shift: f.shift }; }
    if (level === 2) { const s = this.sysById.get(id as DomainId)!, e = 62 * DEG, f = this.fit(s.rx, s.rz, e); return { target: s.center.clone(), dist: f.dist, elev: e, shift: f.shift }; }
    return { target: this.planetSpot.get(id!)!.pos.clone(), dist: this.planetDist(id!), elev: 14 * DEG, shift: 0.235 };
  }

  private fly(to: Rig, dur: number, done?: () => void) {
    this.inertia = false;
    if (!this.motion || dur <= 0) { this.rig = to; this.tw = null; this.dirty = true; done?.(); return; }
    const from: Rig = { ...this.rig, target: this.rig.target.clone() };
    const travel = from.target.distanceTo(to.target);
    const hop = travel > Math.max(from.dist, to.dist) * 0.6 ? travel * 0.55 : 0; // long trips arc up over the galaxy
    this.tw = { from, to, t0: performance.now(), dur, hop, done };
  }
  private saved: Rig | null = null;
  /** Leaving the Learn tab: pull the camera back while the HTML layer fades out; restore() on the next visit. */
  recede() {
    if (!this.motion) return;
    this.saved = this.tw ? { ...this.tw.to, target: this.tw.to.target.clone() } : { ...this.rig, target: this.rig.target.clone() };
    this.fly({ ...this.saved, target: this.saved.target.clone(), dist: this.saved.dist * 1.7 }, 320);
  }
  restore() { if (this.saved) { this.rig = this.saved; this.saved = null; this.tw = null; this.dirty = true; } }
  /** Jump to the end of the current flight (e.g. the user taps during the intro). */
  skipFlight() { if (!this.tw) return; const d = this.tw.done; this.rig = this.tw.to; this.tw = null; this.dirty = true; d?.(); }
  get flying() { return !!this.tw; }

  private setLevel(l: Level, dom: DomainId | null, node: string | null) {
    const changed = l !== this.level || dom !== this.focusDom || node !== this.focusNode;
    this.level = l; this.focusDom = dom; this.focusNode = node;
    if (changed) this.hooks.level(l, dom, node);
  }
  goGalaxy(dur = 650) { this.setLevel(1, null, null); this.fly(this.rigFor(1), dur); }
  goSystem(id: DomainId, dur = 650) { this.setLevel(2, id, null); this.fly(this.rigFor(2, id), dur); }
  goPlanet(id: string, dur = 650) {
    const sys = this.layout.find((s) => s.planets.some((p) => p.id === id))!;
    const far = this.rig.target.distanceTo(this.planetSpot.get(id)!.pos) > 30;
    this.setLevel(3, sys.id, id); this.fly(this.rigFor(3, id), far ? Math.max(dur, 1000) : dur);
  }
  /** Set the camera without animation (first mount). */
  place(level: Level, id: string | null) {
    const dom = level === 3 ? this.layout.find((s) => s.planets.some((p) => p.id === id))!.id : (id as DomainId | null);
    this.setLevel(level, level === 1 ? null : dom, level === 3 ? id : null);
    this.rig = this.rigFor(level, id); this.tw = null; this.dirty = true;
  }
  /** First visit: glide in from the whole galaxy to the suggested system (≤ 1.2 s, skippable). */
  intro(dom: DomainId) {
    this.place(1, null);
    this.setLevel(2, dom, null);
    this.fly(this.rigFor(2, dom), 1150);
  }
  zoomStep(dir: 1 | -1) {
    if (this.level === 3) { if (dir < 0) this.goSystem(this.focusDom!); return; }
    if (dir > 0 && this.level === 1) { this.goSystem(this.nearestSystem(this.rig.target)); return; }
    if (dir < 0 && this.level === 2) { this.goGalaxy(); return; }
    const to = { ...this.rig, target: this.rig.target.clone(), dist: this.clampDist(this.rig.dist * (dir > 0 ? 0.62 : 1.6)) };
    to.elev = this.elevFor(to.dist);
    this.fly(to, 380, () => this.semantic());
  }
  back() { if (this.level === 3) this.goSystem(this.focusDom!); else if (this.level === 2) this.goGalaxy(); }

  private nearestSystem(p: THREE.Vector3): DomainId {
    let best = this.layout[0], bd = 1e9;
    this.layout.forEach((s) => { const d = s.center.distanceTo(p); if (d < bd) { bd = d; best = s; } });
    return best.id;
  }
  private clampDist(d: number) { return THREE.MathUtils.clamp(d, 16, this.galDist() * 1.25); }
  /** Semantic zoom: crossing a distance threshold switches what the labels show (with hysteresis). */
  private semantic() {
    if (this.level === 3 || this.tw) return;
    const g = this.galDist();
    if (this.level === 2 && this.rig.dist > g * 0.55) this.setLevel(1, null, null);
    else if (this.level === 1 && this.rig.dist < g * 0.4) this.setLevel(2, this.nearestSystem(this.rig.target), null);
    else if (this.level === 2) { const n = this.nearestSystem(this.rig.target); if (n !== this.focusDom && this.sysById.get(n)!.center.distanceTo(this.rig.target) < this.sysById.get(n)!.radius * 1.2) this.setLevel(2, n, null); }
  }

  /* ---------- gestures ---------- */
  justDragged() { return performance.now() - this.lastDragEnd < 120; }
  private bindInput() {
    const el = this.host;
    const onMove = (e: PointerEvent) => {
      const p = this.ptrs.get(e.pointerId); if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      const g = this.gesture;
      if (this.ptrs.size >= 2) {
        const [a, b] = [...this.ptrs.values()], span = Math.hypot(a.x - b.x, a.y - b.y);
        if (!g.span) { g.span = span; g.dist0 = this.rig.dist; }
        g.dragging = true;
        if (this.level === 3) { if (span < g.span * 0.7) this.back(); return; }
        this.rig.dist = this.clampDist((g.dist0 * g.span) / Math.max(20, span)); this.rig.elev = this.elevFor(this.rig.dist);
        this.dirty = true; this.semantic(); return;
      }
      g.moved += Math.abs(dx) + Math.abs(dy);
      if (g.moved > 7) g.dragging = true;
      if (!g.dragging) return;
      if (this.level === 3) { const pl = this.planets.get(this.focusNode!); if (pl) pl.spin.rotation.y += dx * 0.012; this.dirty = true; return; }
      this.pan(dx, dy);
      const now = performance.now(), dtm = Math.max(8, g.tm ? now - g.tm : 16); g.tm = now;
      this.vel.set(dx / dtm, dy / dtm);
    };
    const onUp = (e: PointerEvent) => {
      this.ptrs.delete(e.pointerId);
      if (this.ptrs.size) { this.gesture.span = 0; return; }
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp);
      const g = this.gesture;
      if (g.dragging) {
        this.lastDragEnd = performance.now();
        if (this.motion && this.level !== 3 && this.vel.length() > 0.05 && performance.now() - g.tm < 80) this.inertia = true;
        this.semantic();
      } else if (!(e.target as HTMLElement).closest?.("button,a,input,.gx-card,.gx-cont,.gx-hud")) this.tap(e.clientX, e.clientY);
    };
    el.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || (e.target as HTMLElement).closest(".gx-card,.gx-cont,.gx-hud,.gx-ctrl")) return;
      if (this.tw) this.skipFlight();
      this.inertia = false;
      if (!this.ptrs.size) { Object.assign(this.gesture, { moved: 0, dragging: false, span: 0, tm: 0 }); this.vel.set(0, 0); }
      this.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.ptrs.size === 1) { window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp); }
      else this.gesture.span = 0;
    });
    el.addEventListener("wheel", (e) => {
      if ((e.target as HTMLElement).closest(".gx-card,.gx-cont")) return;
      e.preventDefault();
      if (this.tw) this.skipFlight();
      if (this.level === 3) { if (e.deltaY > 0) this.back(); return; }
      this.rig.dist = this.clampDist(this.rig.dist * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))); this.rig.elev = this.elevFor(this.rig.dist);
      this.dirty = true; this.semantic();
    }, { passive: false });
  }
  private pan(dx: number, dy: number) {
    const wpp = (2 * this.rig.dist * TAN) / this.h;
    this.rig.target.x -= dx * wpp;
    this.rig.target.z -= (dy * wpp) / Math.sin(this.rig.elev);
    if (this.rig.target.length() > 100) this.rig.target.setLength(100);
    this.dirty = true;
    if (this.level === 2) this.semantic();
  }
  private tap(x: number, y: number) {
    const r = this.host.getBoundingClientRect(), lx = x - r.left, ly = y - r.top, now = performance.now(), g = this.gesture;
    const dbl = now - g.lastTap < 320 && Math.hypot(lx - g.tapX, ly - g.tapY) < 30;
    g.lastTap = dbl ? 0 : now; g.tapX = lx; g.tapY = ly;
    // nearest pickable object on screen
    let best = "", bd = 1e9;
    const consider = (key: string, radiusPx: number) => { const p = this.project(key); if (!p.on) return; const d = Math.hypot(p.x - lx, p.y - ly); if (d < radiusPx && d < bd) { bd = d; best = key; } };
    if (this.comet && this.level < 3) consider("comet", 34);
    if (this.level === 1) { this.layout.forEach((s) => consider("sys:" + s.id, 48)); consider("altair", 40); consider("home", 30); }
    else if (this.level === 2) { this.planets.forEach((p, id) => consider("pl:" + id, this.project("pl:" + id).ppu * p.radius + 16)); consider("home", this.project("home").ppu * 1.2 + 16); consider("altair", 40); }
    if (best) { this.hooks.pick(best); return; }
    if (dbl && this.level < 3) { // double-tap empty space: zoom in there
      const ray = new THREE.Raycaster(), ndc = new THREE.Vector2((lx / this.w) * 2 - 1, -(ly / this.h) * 2 + 1);
      ray.setFromCamera(ndc, this.camera);
      const hit = new THREE.Vector3();
      if (ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit)) {
        const d = this.clampDist(this.rig.dist * 0.5);
        this.fly({ target: hit.setLength(Math.min(hit.length(), 100)), dist: d, elev: this.elevFor(d), shift: this.rig.shift }, 420, () => this.semantic());
      }
    }
  }

  /* ---------- projection for HTML labels ---------- */
  private v = new THREE.Vector3();
  project(key: string): { x: number; y: number; on: boolean; ppu: number } {
    const p = this.pos.get(key);
    if (!p) return { x: 0, y: 0, on: false, ppu: 0 };
    this.v.copy(p).project(this.camera);
    const depth = this.v.z;
    const camD = p.clone().sub(this.camera.position).dot(this.camera.getWorldDirection(new THREE.Vector3()));
    return { x: ((this.v.x + 1) / 2) * this.w, y: ((1 - this.v.y) / 2) * this.h, on: depth < 1 && depth > -1 && camD > 0, ppu: this.h / (2 * Math.max(0.01, camD) * TAN) };
  }
  get dist() { return this.rig.dist; }

  /* ---------- loop ---------- */
  resize() {
    const r = this.host.getBoundingClientRect(), w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    if (!this.tw) { // keep the current level framed after a resize
      if (this.level === 3 && this.focusNode) this.rig = this.rigFor(3, this.focusNode);
      else if (this.level === 2 && this.focusDom) this.rig = this.rigFor(2, this.focusDom);
      else if (this.level === 1) this.rig = this.rigFor(1);
    }
    this.dirty = true;
  }
  start() {
    if (this.running) return;
    this.running = true; this.last = performance.now(); this.dirty = true;
    const loop = (now: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      this.frame(now);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  renderNow() { this.dirty = true; this.frame(performance.now()); }

  private frame(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (this.hooks.hidden()) return;
    if (this.w < 2) this.resize();
    if (this.tw) {
      const k = Math.min(1, (now - this.tw.t0) / this.tw.dur), e = ease(k), f = this.tw.from, to = this.tw.to;
      this.rig = {
        target: f.target.clone().lerp(to.target, e),
        dist: Math.exp(Math.log(f.dist) + (Math.log(to.dist) - Math.log(f.dist)) * e) + this.tw.hop * Math.sin(Math.PI * e),
        elev: f.elev + (to.elev - f.elev) * e + (this.tw.hop ? (58 * DEG - (f.elev + (to.elev - f.elev) * e)) * Math.sin(Math.PI * e) * 0.8 : 0),
        shift: f.shift + (to.shift - f.shift) * e,
      };
      this.dirty = true;
      if (k >= 1) { const d = this.tw.done; this.tw = null; d?.(); }
    } else if (this.inertia) {
      this.pan(this.vel.x * dt * 1000, this.vel.y * dt * 1000);
      this.vel.multiplyScalar(Math.pow(0.9, dt * 60));
      if (this.vel.length() < 0.02) { this.inertia = false; this.semantic(); }
    }
    const motion = this.motion;
    if (!motion && !this.dirty) return;
    this.t += dt;
    const { target, dist, elev, shift } = this.rig;
    this.camera.position.set(target.x, target.y + Math.sin(elev) * dist, target.z + Math.cos(elev) * dist);
    this.camera.lookAt(target);
    this.camera.setViewOffset(this.w, this.h, 0, shift * this.h, this.w, this.h);
    this.camera.updateProjectionMatrix();
    const t = this.t;
    this.planets.forEach((p) => p.update(t, dt, motion));
    this.home?.update(t, dt, motion);
    if (this.altair && motion) this.altair.children.slice(1).forEach((s, i) => s.scale.setScalar([20, 7.5, 46][i] * (1 + 0.05 * Math.sin(t * 1.6 + i))));
    if (this.links) { const u = (this.links.material as THREE.ShaderMaterial).uniforms; u.uTime.value = t; u.uMotion.value = motion ? 1 : 0; u.uW.value = Math.max(0.05, this.rig.dist / 40); }
    this.updateComet(t, motion);
    const conVis = this.level === 1 || (this.level === 2 && this.rig.dist > this.galDist() * 0.3);
    this.cons.forEach((c, i) => {
      c.g.visible = conVis;
      if (!conVis) return;
      const k = this.rig.dist * 0.011; // keep stars a few px wide at any zoom
      c.stars.forEach((st, j) => { st.s.scale.setScalar(k * (st.lit ? (c.complete ? 1.6 : 1.25) : 0.7) * (motion && c.complete ? 1 + 0.15 * Math.sin(t * 2.4 + j + i) : 1)); });
    });
    this.sky?.update(t, motion, this.camera);
    (this.sky?.mats || []).forEach((m) => (m.uniforms.uPR.value = this.renderer.getPixelRatio()));
    this.renderer.render(this.scene, this.camera);
    this.dirty = false;
    this.hooks.frame();
  }

  private updateComet(t: number, motion: boolean) {
    const c = this.comet;
    if (!c) { this.pos.delete("comet"); return; }
    const show = this.level < 3;
    c.g.visible = c.tail.visible = show;
    if (!show) { this.pos.delete("comet"); return; }
    if (c.lastLevel !== this.level + (this.focusDom ? this.focusDom.length : 0)) { c.hist = []; c.lastLevel = this.level + (this.focusDom ? this.focusDom.length : 0); }
    let center = new THREE.Vector3(), R = [50, 34], sp = 0.1;
    if (this.level === 2 && this.focusDom) { const s = this.sysById.get(this.focusDom)!; center = s.center; R = [s.rx + 1.5, s.rz + 1.5]; sp = 0.2; }
    const a = (motion ? t : 2) * sp + 1.2;
    const p = new THREE.Vector3(center.x + Math.cos(a) * R[0], 1.5, center.z + Math.sin(a) * R[1]);
    c.g.position.copy(p);
    this.pos.set("comet", p.clone());
    c.hist.unshift(p.clone()); if (c.hist.length > 34) c.hist.pop();
    const arr = (c.tail.geometry.getAttribute("position") as THREE.BufferAttribute);
    for (let i = 0; i < 34; i++) { const h = c.hist[Math.min(i, c.hist.length - 1)]; arr.setXYZ(i, h.x, h.y, h.z); }
    arr.needsUpdate = true;
    (c.tail.material as THREE.PointsMaterial).size = Math.max(0.6, this.rig.dist / 45);
  }

  /** Brief burst when the comet is collected; then it is removed by the next setModel. */
  cometBurst() { if (this.comet) { this.comet.g.scale.setScalar(2.5); this.dirty = true; } }
}
