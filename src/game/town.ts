/* ---------- The low-poly town: renderer, camera rig, movement, NPCs, time of day (design doc 13.3) ----------
 * Camera: high, tilted ~44°, follows the player without rotating (no tap-to-walk — joystick / keys only).
 * The world curves down in the distance (kit.bend). Movement input comes from the UI (joystick or WASD/arrows);
 * collisions against building boxes, tree circles, NPCs and the sea, with sliding along walls.
 * Sky follows the real clock (morning – noon – pink sunset – blue night with lit windows and street lamps).
 * The loop skips rendering while the town is hidden (overlay closed, app in background). */
import * as THREE from "three";
import { U, mat } from "./kit";
import { buildWorld, POND, type World, type Door, type Zone } from "./world";
import { makeAvatar, type Avatar, type Look, type Stage } from "./avatar";
import { makeNpcs, graph, type Npc } from "./npc";
import { makeRide } from "./rides";

export type Target = { kind: "door"; door: Door; x: number; z: number } | { kind: "npc"; npc: Npc; x: number; z: number };
export interface TownHooks {
  hidden(): boolean;
  near(t: Target | null): void; // what the action button points at
  zone(z: Zone | null): void; // entered a district
  frame?(): void;
}
const SPEED = 4.6, RUN = 7, R = 0.42, NPC_SPEED = 1.9;
const CAM = new THREE.Vector3(0, 14, 14.5); // offset from the player: ~44° down
const LEAD = 2.2; // look a little ahead (north) so the player sits just below the centre
const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/* Sky keyframes by hour: [hour, sky, hemi sky, hemi ground, hemi intensity, sun colour, sun intensity, window glow 0..1] */
type Key = [number, string, string, string, number, string, number, number];
const SKY: Key[] = [
  [0, "#22305E", "#8C9BE0", "#3B4A6B", 0.85, "#9FB0FF", 0.35, 1],
  [5, "#2C3A6E", "#9AA6E6", "#45557A", 0.9, "#AFC0FF", 0.4, 1],
  [6.5, "#FFC9B5", "#FFE3C9", "#A7B98F", 1.5, "#FFC69A", 1.2, 0.5],
  [8, "#BFE6FF", "#FFF6E5", "#8FB7A0", 1.9, "#FFF1D6", 1.7, 0],
  [16, "#BFE6FF", "#FFF6E5", "#8FB7A0", 1.9, "#FFF1D6", 1.7, 0],
  [17.5, "#FFB49A", "#FFD7C2", "#B79A8F", 1.6, "#FF9F7A", 1.4, 0.35],
  [18.6, "#8E7BD6", "#C9B6F0", "#6B5E8F", 1.15, "#C69AFF", 0.7, 0.85],
  [20, "#22305E", "#8C9BE0", "#3B4A6B", 0.85, "#9FB0FF", 0.35, 1],
  [24, "#22305E", "#8C9BE0", "#3B4A6B", 0.85, "#9FB0FF", 0.35, 1],
];
const cA = new THREE.Color(), cB = new THREE.Color();
const mix = (a: string, b: string, k: number) => cA.set(a).lerp(cB.set(b), k).clone();

export class Town {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(38, 1, 0.5, 160);
  private world: World;
  private player!: Avatar;
  readonly pos = new THREE.Vector2();
  heading = 0;
  private camPos = new THREE.Vector3();
  private raf = 0; private running = false; private last = 0; private t = 0;
  private near: Target | null = null;
  private zoneNow: Zone | null = null;
  private intro0 = 0;
  private hemi: THREE.HemisphereLight; private sun: THREE.DirectionalLight;
  private hourOverride: number | null = null; private lastSky = -1; private glow = 0;
  readonly npcs: Npc[]; private links: [number, number][][];
  private bugs: { g: THREE.Group; c: THREE.Vector3; a: number; s: number }[] = [];
  private dust: { m: THREE.Mesh; v: THREE.Vector3; life: number }[] = []; private dustT = 0;
  private tick = { v: 1284.6, ch: 0.4, x: 0, t: 0 };
  private fish: { m: THREE.Mesh; t: number; a: number; x: number; z: number } | null = null; private fishT = 4;
  /** movement input, x = east, y = south, length ≤ 1 (set by the joystick / keys) */
  readonly input = new THREE.Vector2();
  run = false;
  motion = true;
  frozen = false; // dialogue open → no walking
  lift = 0; // 1 = frame the player in the top half (a sheet covers the bottom)
  private liftK = 0;

  constructor(private host: HTMLElement, private hooks: TownHooks, potato: boolean, look: Look, stage: Stage) {
    this.renderer = new THREE.WebGLRenderer({ antialias: !potato, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, potato ? 1 : 1.5));
    this.canvas = this.renderer.domElement;
    this.canvas.className = "tw-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.scene.background = new THREE.Color("#BFE6FF");
    this.scene.fog = new THREE.Fog("#FFF6E5", 40, 86);
    this.hemi = new THREE.HemisphereLight("#FFF6E5", "#8FB7A0", 1.9); this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight("#FFF1D6", 1.7); this.sun.position.set(-6, 10, 7); this.scene.add(this.sun);
    this.world = buildWorld(potato);
    this.scene.add(this.world.group);
    this.pos.set(...this.world.spawn);
    this.setLook(look, stage);
    this.npcs = makeNpcs(this.world.nodes, potato ? 4 : 7);
    this.links = graph(this.world.nodes);
    for (const n of this.npcs) { n.av.group.position.set(n.pos.x, 0, n.pos.y); this.scene.add(n.av.group); this.retarget(n); }
    if (!potato) this.makeButterflies();
    const q = /[?&]hour=(\d+(?:\.\d+)?)/.exec(location.search); // ?hour=20 → night (demo video / testing)
    if (q) this.hourOverride = +q[1] % 24;
    this.applySky(true);
    this.snapCamera();
  }

  setLook(look: Look, stage: Stage) {
    if (this.player) { this.scene.remove(this.player.group); this.player.dispose(); }
    this.player = makeAvatar(look, stage);
    this.player.group.position.set(this.pos.x, 0, this.pos.y);
    this.player.group.rotation.y = this.heading;
    this.scene.add(this.player.group);
  }
  get map() { return this.world; }
  /** Park what you ride in your garden (13.4); its collider moves with it. */
  private ride: THREE.Group | null = null; private rideId = ""; private rideC: { x: number; z: number; r: number }[] = [];
  setRide(id: string) {
    if (id === this.rideId) return;
    this.rideId = id;
    if (this.ride) { this.scene.remove(this.ride); this.ride.traverse((o) => (o as THREE.Mesh).geometry?.dispose()); this.ride = null; }
    this.world.circles = this.world.circles.filter((c) => !this.rideC.includes(c)); this.rideC = [];
    const g = makeRide(id); if (!g) return;
    const home = this.world.buildings.find((b) => b.id === "home")!, x = home.x + home.w / 2 + 1.55, z = home.z! + 0.9;
    g.position.set(x, 0, z); g.rotation.y = 0.12; this.scene.add(g); this.ride = g;
    this.rideC = id.startsWith("car") ? [{ x, z, r: 1 }, { x, z: z - 1.2, r: 0.9 }, { x, z: z + 1.2, r: 0.9 }] : [{ x, z, r: 0.6 }];
    this.world.circles.push(...this.rideC);
  }
  get zone() { return this.zoneNow; }
  /** Put the player somewhere (e.g. in front of the shop when Business mode starts). */
  teleport(x: number, z: number) { this.pos.set(x, z); this.heading = Math.PI; this.snapCamera(); }
  setHour(h: number | null) { this.hourOverride = h; this.applySky(true); }

  resize() {
    const r = this.host.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.6 ? 52 : w / h < 1 ? 46 : 38; // narrow phones need a wider view to see the street
    this.camera.updateProjectionMatrix();
  }
  start() {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    const loop = (now: number) => { if (!this.running) return; this.raf = requestAnimationFrame(loop); this.frame(now); };
    this.raf = requestAnimationFrame(loop);
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  /** Arriving from the home planet: the camera drops from high above onto the player (~0.9 s). */
  arrive() { this.applySky(true); if (this.motion) this.intro0 = performance.now(); else this.snapCamera(); }
  dispose() { this.stop(); this.renderer.dispose(); this.renderer.forceContextLoss(); }
  private snapCamera() { this.camPos.set(this.pos.x, 0, this.pos.y).add(CAM); }

  /* ---- time of day ---- */
  hour() { if (this.hourOverride != null) return this.hourOverride; const d = new Date(); return d.getHours() + d.getMinutes() / 60; }
  get night() { return this.glow > 0.5; }
  private applySky(force = false) {
    const h = this.hour();
    if (!force && Math.abs(h - this.lastSky) < 0.02) return;
    this.lastSky = h;
    let i = 0; while (i < SKY.length - 2 && SKY[i + 1][0] <= h) i++;
    const a = SKY[i], b = SKY[i + 1], k = THREE.MathUtils.clamp((h - a[0]) / (b[0] - a[0]), 0, 1);
    const sky = mix(a[1], b[1], k);
    (this.scene.background as THREE.Color).copy(sky);
    (this.scene.fog as THREE.Fog).color.copy(sky).lerp(mix(a[2], b[2], k), 0.35);
    this.hemi.color.copy(mix(a[2], b[2], k));
    this.hemi.groundColor.copy(mix(a[3], b[3], k));
    this.hemi.intensity = a[4] + (b[4] - a[4]) * k;
    this.sun.color.copy(mix(a[5], b[5], k));
    this.sun.intensity = a[6] + (b[6] - a[6]) * k;
    this.glow = a[7] + (b[7] - a[7]) * k;
    this.world.windows.emissive.set("#FFC46B").multiplyScalar(this.glow * 0.95);
    this.world.lampGlow.opacity = this.glow * 0.55;
  }

  /* ---- movement ---- */
  private collide(x: number, z: number, r: number, self?: Npc) {
    const w = this.world, bb = w.bounds;
    x = THREE.MathUtils.clamp(x, bb.x0, bb.x1); z = THREE.MathUtils.clamp(z, bb.z0, bb.z1);
    for (let it = 0; it < 2; it++) {
      for (const c of w.circles) {
        const ex = x - c.x, ez = z - c.z, d = Math.hypot(ex, ez), m = c.r + r;
        if (d < m && d > 1e-4) { x = c.x + (ex / d) * m; z = c.z + (ez / d) * m; }
      }
      for (const b of w.boxes) {
        const cx = THREE.MathUtils.clamp(x, b.x0, b.x1), cz = THREE.MathUtils.clamp(z, b.z0, b.z1), ex = x - cx, ez = z - cz, d = Math.hypot(ex, ez);
        if (d < r) {
          if (d > 1e-4) { x = cx + (ex / d) * r; z = cz + (ez / d) * r; }
          else { // inside the box: push out the shortest way
            const o = [x - b.x0, b.x1 - x, z - b.z0, b.z1 - z], k = o.indexOf(Math.min(...o));
            if (k === 0) x = b.x0 - r; else if (k === 1) x = b.x1 + r; else if (k === 2) z = b.z0 - r; else z = b.z1 + r;
          }
        }
      }
      // people don't walk through each other
      for (const n of this.npcs) {
        if (n === self) continue;
        const ex = x - n.pos.x, ez = z - n.pos.y, d = Math.hypot(ex, ez), m = r + 0.38;
        if (d < m && d > 1e-4) { x = n.pos.x + (ex / d) * m; z = n.pos.y + (ez / d) * m; }
      }
      if (self) { const ex = x - this.pos.x, ez = z - this.pos.y, d = Math.hypot(ex, ez), m = r + R; if (d < m && d > 1e-4) { x = this.pos.x + (ex / d) * m; z = this.pos.y + (ez / d) * m; } }
    }
    return [x, z] as const;
  }

  private retarget(n: Npc) {
    let bi = 0, bd = 1e9;
    this.world.nodes.forEach(([x, z], i) => { const d = Math.hypot(x - n.target.x, z - n.target.y); if (d < bd) { bd = d; bi = i; } });
    const opts = this.links[bi].length ? this.links[bi] : this.world.nodes;
    const [x, z] = opts[Math.floor(Math.random() * opts.length)];
    n.target.set(x + (Math.random() - 0.5) * 1.6, z + (Math.random() - 0.5) * 1.2);
    n.stuck = 0;
  }
  private updateNpcs(dt: number) {
    for (const n of this.npcs) {
      const toP = Math.hypot(this.pos.x - n.pos.x, this.pos.y - n.pos.y);
      let speed = 0;
      if (n.talking || toP < 2.6) { // stop and look at the player
        const want = Math.atan2(this.pos.x - n.pos.x, this.pos.y - n.pos.y);
        let dh = want - n.heading; dh = Math.atan2(Math.sin(dh), Math.cos(dh)); n.heading += dh * Math.min(1, dt * 6);
      } else if (n.wait > 0) n.wait -= dt;
      else {
        const dx = n.target.x - n.pos.x, dz = n.target.y - n.pos.y, d = Math.hypot(dx, dz);
        if (d < 0.5) { n.wait = 1 + Math.random() * 4; this.retarget(n); }
        else {
          const step = Math.min(d, NPC_SPEED * dt);
          const [x, z] = this.collide(n.pos.x + (dx / d) * step, n.pos.y + (dz / d) * step, 0.38, n);
          const moved = Math.hypot(x - n.pos.x, z - n.pos.y);
          n.stuck = moved < step * 0.3 ? n.stuck + dt : 0;
          if (n.stuck > 1.2) { n.wait = 0.5; this.retarget(n); }
          n.pos.set(x, z); speed = moved / Math.max(dt, 1e-3) / RUN;
          const want = Math.atan2(dx, dz); let dh = want - n.heading; dh = Math.atan2(Math.sin(dh), Math.cos(dh)); n.heading += dh * Math.min(1, dt * 8);
        }
      }
      n.av.group.position.set(n.pos.x, 0, n.pos.y);
      n.av.group.rotation.y = n.heading;
      n.av.update(dt, speed, this.motion);
    }
  }

  /* ---- little life: butterflies over the meadows, dust puffs when running ---- */
  private makeButterflies() {
    const cols = ["#FFC93C", "#FF8FA3", "#FFFFFF", "#B39DFF"];
    for (let i = 0; i < 8; i++) {
      const g = new THREE.Group();
      for (const s of [-1, 1]) {
        const w = new THREE.Mesh(new THREE.CircleGeometry(0.16, 5), mat(cols[i % 4]));
        w.geometry.translate(s * 0.13, 0, 0); w.rotation.x = -Math.PI / 2; w.frustumCulled = false; g.add(w);
      }
      const n = this.world.nodes[(i * 3) % this.world.nodes.length];
      const c = new THREE.Vector3(n[0] + 4, 1.2, n[1] - 4);
      g.position.copy(c); this.scene.add(g);
      this.bugs.push({ g, c, a: i * 1.7, s: 0.6 + (i % 3) * 0.2 });
    }
  }
  private updateLife(dt: number, running: boolean) {
    for (const b of this.bugs) {
      b.a += dt * b.s;
      b.g.position.set(b.c.x + Math.sin(b.a) * 2.2, b.c.y + Math.sin(b.a * 3.1) * 0.35, b.c.z + Math.sin(b.a * 0.7) * 1.8);
      b.g.rotation.y = b.a + Math.PI / 2;
      const f = Math.sin(this.t * 22 + b.a) * 0.9;
      b.g.children[0].rotation.y = f; b.g.children[1].rotation.y = -f;
    }
    if (this.world.fall) this.world.fall.offset.y += dt * 1.6;
    // a fish jumps out of the pond now and then
    this.fishT -= dt;
    if (this.fishT <= 0 && !this.fish) {
      const m = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 5), mat("#FF9F5A")); m.frustumCulled = false; this.scene.add(m);
      const a = Math.random() * 6.28, r = Math.random() * (POND.r - 1.2);
      this.fish = { m, t: 0, a: Math.random() * 6.28, x: POND.x + Math.cos(a) * r, z: POND.z + Math.sin(a) * r };
    }
    if (this.fish) {
      const f = this.fish; f.t += dt / 0.9;
      const k = Math.min(1, f.t);
      f.m.position.set(f.x + Math.cos(f.a) * (k - 0.5) * 1.2, -0.1 + Math.sin(k * Math.PI) * 1.1, f.z + Math.sin(f.a) * (k - 0.5) * 1.2);
      f.m.rotation.set(0, -f.a, Math.PI / 2 - (k - 0.5) * 2.4);
      if (k >= 1) { this.scene.remove(f.m); f.m.geometry.dispose(); this.fish = null; this.fishT = 4 + Math.random() * 6; }
    }
    this.dustT -= dt;
    if (running && this.dustT <= 0) {
      this.dustT = 0.09;
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 0), new THREE.MeshBasicMaterial({ color: "#F6EBD6", transparent: true, opacity: 0.8 }));
      m.position.set(this.pos.x - Math.sin(this.heading) * 0.35 + (Math.random() - 0.5) * 0.2, 0.12, this.pos.y - Math.cos(this.heading) * 0.35);
      m.frustumCulled = false; this.scene.add(m);
      this.dust.push({ m, v: new THREE.Vector3((Math.random() - 0.5) * 0.6, 0.9, (Math.random() - 0.5) * 0.6), life: 0.5 });
    }
    for (let i = this.dust.length - 1; i >= 0; i--) {
      const d = this.dust[i]; d.life -= dt;
      d.m.position.addScaledVector(d.v, dt); d.m.scale.setScalar(1 + (0.5 - d.life) * 2.2);
      (d.m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, d.life * 1.6);
      if (d.life <= 0) { this.scene.remove(d.m); d.m.geometry.dispose(); (d.m.material as THREE.Material).dispose(); this.dust.splice(i, 1); }
    }
  }

  /* ---- the stock ticker on the exchange (a simulated index, not real data) ---- */
  private updateTicker(dt: number) {
    const tk = this.world.ticker; if (!tk) return;
    const s = this.tick; s.t -= dt; s.x -= dt * 60;
    if (s.t <= 0) { s.t = 2.5; const d = (Math.random() - 0.48) * 6; s.v += d; s.ch = (d / s.v) * 100 + s.ch * 0.6; }
    const c = tk.ctx, up = s.ch >= 0;
    c.fillStyle = "#1E2433"; c.fillRect(0, 0, 512, 64);
    c.font = "bold 34px Nunito, sans-serif"; c.textBaseline = "middle";
    const txt = `VNX ${s.v.toFixed(1)} ${up ? "▲" : "▼"} ${Math.abs(s.ch).toFixed(2)}%   ·   ALT ${(52.3 + s.v / 400).toFixed(1)} ▲   ·   TRS ${(18.4 - s.ch).toFixed(1)} ${up ? "▼" : "▲"}   ·   `;
    const wTxt = c.measureText(txt).width; if (s.x < -wTxt) s.x += wTxt;
    c.fillStyle = up ? "#4BE38A" : "#FF6B6B";
    c.fillText(txt, s.x, 34); c.fillText(txt, s.x + wTxt, 34);
    tk.tex.needsUpdate = true;
  }

  private frame(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (this.hooks.hidden()) return;
    this.t += dt;
    U.time.value = this.t;
    U.wind.value = this.motion ? 1 : 0;
    if (Math.floor(this.t) !== Math.floor(this.t - dt)) this.applySky();
    // walk
    let speed = 0;
    const len = Math.min(1, this.input.length());
    if (len > 0.08 && !this.frozen) {
      const v = (this.run || len > 0.92 ? RUN : SPEED) * len;
      const dir = this.input.clone().normalize();
      const [x, z] = this.collide(this.pos.x + dir.x * v * dt, this.pos.y + dir.y * v * dt, R);
      this.pos.set(x, z);
      speed = v / RUN;
      const target = Math.atan2(dir.x, dir.y);
      let dh = target - this.heading; dh = Math.atan2(Math.sin(dh), Math.cos(dh));
      this.heading += dh * Math.min(1, dt * 14);
    }
    const g = this.player.group;
    g.position.set(this.pos.x, 0, this.pos.y);
    g.rotation.y = this.heading;
    this.player.update(dt, speed, this.motion);
    if (this.motion) { this.updateNpcs(dt); this.updateLife(dt, speed > 0.8); this.updateTicker(dt); }
    else { this.updateNpcs(0); if (this.t < 0.2) this.updateTicker(0.016); } // reduced motion: classmates stand still
    // nearest door / person → action button
    let best: Target | null = null, bd = 2.0;
    for (const d of this.world.doors) { const dd = Math.hypot(d.x - this.pos.x, d.z - this.pos.y); if (dd < bd) { bd = dd; best = { kind: "door", door: d, x: d.x, z: d.z }; } }
    for (const n of this.npcs) { const dd = Math.hypot(n.pos.x - this.pos.x, n.pos.y - this.pos.y); if (dd < Math.min(bd, 2.2)) { bd = dd; best = { kind: "npc", npc: n, x: n.pos.x, z: n.pos.y }; } }
    const key = (x: Target | null) => (x ? (x.kind === "door" ? "d:" + x.door.id : "n:" + x.npc.p.id) : "");
    if (key(best) !== key(this.near)) { this.near = best; this.hooks.near(best); }
    // district banner
    const zn = this.world.zones.find((z) => this.pos.x >= z.x0 && this.pos.x < z.x1 && this.pos.y >= z.z0 && this.pos.y < z.z1) || null;
    if (zn !== this.zoneNow) { this.zoneNow = zn; this.hooks.zone(zn); }
    // camera: smooth follow (+ arrival drop)
    const want = new THREE.Vector3(this.pos.x, 0, this.pos.y).add(CAM);
    this.camPos.lerp(want, this.motion ? Math.min(1, dt * 5) : 1);
    const cam = this.camera.position.copy(this.camPos);
    let lookY = 0.6;
    if (this.intro0) {
      const k = Math.min(1, (now - this.intro0) / 900), e = ease(k);
      cam.y += (1 - e) * 26; cam.z -= (1 - e) * 8; lookY += (1 - e) * 2;
      if (k >= 1) this.intro0 = 0;
    }
    this.liftK += (this.lift - this.liftK) * (this.motion ? Math.min(1, dt * 6) : 1);
    this.camera.lookAt(this.camPos.x - CAM.x, lookY, this.camPos.z - CAM.z - LEAD + this.liftK * 7);
    this.renderer.render(this.scene, this.camera);
    this.hooks.frame?.();
  }
}
