/* ---------- The low-poly town: renderer, camera rig, movement & collisions (design doc 13.3) ----------
 * Camera: high, tilted ~45°, follows the player without rotating (no tap-to-walk — joystick / keys only).
 * The world curves down in the distance (kit.bend). Movement input comes from the UI (joystick or WASD/arrows);
 * collisions against building boxes, tree circles and the world edge, with sliding along walls.
 * The loop stops by itself when the town is hidden (overlay closed, app in background). */
import * as THREE from "three";
import { U } from "./kit";
import { buildWorld, type World, type Door } from "./world";
import { makeAvatar, type Avatar, type Look, type Stage } from "./avatar";

export interface TownHooks {
  hidden(): boolean;
  near(d: Door | null): void; // the door the player stands next to (action button)
  frame?(): void;
}
const SPEED = 4.6, RUN = 7, R = 0.42;
const CAM = new THREE.Vector3(0, 14, 14.5); // offset from the player: ~44° down
const LEAD = 2.2; // look a little ahead (north) so the player sits just below the centre
const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

export class Town {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(38, 1, 0.5, 140);
  private world: World;
  private player!: Avatar;
  readonly pos = new THREE.Vector2();
  private heading = 0;
  private camPos = new THREE.Vector3();
  private raf = 0; private running = false; private last = 0; private t = 0;
  private near: Door | null = null;
  private intro0 = 0;
  /** movement input, x = east, y = south, length ≤ 1 (set by the joystick / keys) */
  readonly input = new THREE.Vector2();
  run = false;
  motion = true;
  frozen = false; // dialogue open → no walking

  constructor(private host: HTMLElement, private hooks: TownHooks, potato: boolean, look: Look, stage: Stage) {
    this.renderer = new THREE.WebGLRenderer({ antialias: !potato, alpha: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, potato ? 1 : 1.5));
    this.canvas = this.renderer.domElement;
    this.canvas.className = "tw-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    const sky = new THREE.Color("#BFE6FF");
    this.scene.background = sky;
    this.scene.fog = new THREE.Fog(sky, 38, 72);
    this.scene.add(new THREE.HemisphereLight("#FFF6E5", "#8FB7A0", 1.9)); // warm sky, green bounce
    const sun = new THREE.DirectionalLight("#FFF1D6", 1.7); sun.position.set(-6, 10, 7); this.scene.add(sun);
    this.world = buildWorld(potato);
    this.scene.add(this.world.group);
    this.pos.set(...this.world.spawn);
    this.setLook(look, stage);
    this.snapCamera();
  }

  setLook(look: Look, stage: Stage) {
    if (this.player) { this.scene.remove(this.player.group); this.player.dispose(); }
    this.player = makeAvatar(look, stage);
    this.player.group.position.set(this.pos.x, 0, this.pos.y);
    this.player.group.rotation.y = this.heading;
    this.scene.add(this.player.group);
  }
  get doors() { return this.world.doors; }
  get half() { return this.world.half; }

  resize() {
    const r = this.host.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep about the same width of world visible on narrow phones
    this.camera.fov = w / h < 0.6 ? 52 : w / h < 1 ? 46 : 38;
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
  arrive() { if (this.motion) this.intro0 = performance.now(); else this.snapCamera(); }
  dispose() { this.stop(); this.renderer.dispose(); this.renderer.forceContextLoss(); }

  private snapCamera() { this.camPos.set(this.pos.x, 0, this.pos.y).add(CAM); }

  /** Move with sliding collisions. */
  private move(dx: number, dz: number) {
    const w = this.world, H = w.half - 0.6;
    let x = THREE.MathUtils.clamp(this.pos.x + dx, -H, H), z = THREE.MathUtils.clamp(this.pos.y + dz, -H, H);
    for (let it = 0; it < 2; it++) {
      for (const c of w.circles) {
        const ex = x - c.x, ez = z - c.z, d = Math.hypot(ex, ez), m = c.r + R;
        if (d < m && d > 1e-4) { x = c.x + (ex / d) * m; z = c.z + (ez / d) * m; }
      }
      for (const b of w.boxes) {
        const cx = THREE.MathUtils.clamp(x, b.x0, b.x1), cz = THREE.MathUtils.clamp(z, b.z0, b.z1), ex = x - cx, ez = z - cz, d = Math.hypot(ex, ez);
        if (d < R) {
          if (d > 1e-4) { x = cx + (ex / d) * R; z = cz + (ez / d) * R; }
          else { // inside the box: push out the shortest way
            const o = [x - b.x0, b.x1 - x, z - b.z0, b.z1 - z], k = o.indexOf(Math.min(...o));
            if (k === 0) x = b.x0 - R; else if (k === 1) x = b.x1 + R; else if (k === 2) z = b.z0 - R; else z = b.z1 + R;
          }
        }
      }
    }
    this.pos.set(x, z);
  }

  private frame(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (this.hooks.hidden()) return;
    this.t += dt;
    U.time.value = this.t;
    U.wind.value = this.motion ? 1 : 0;
    // walk
    let speed = 0;
    const len = Math.min(1, this.input.length());
    if (len > 0.08 && !this.frozen) {
      const v = (this.run || len > 0.92 ? RUN : SPEED) * len;
      const dir = this.input.clone().normalize();
      this.move(dir.x * v * dt, dir.y * v * dt);
      speed = v / RUN;
      const target = Math.atan2(dir.x, dir.y);
      let dh = target - this.heading; dh = Math.atan2(Math.sin(dh), Math.cos(dh));
      this.heading += dh * Math.min(1, dt * 14);
    }
    const g = this.player.group;
    g.position.set(this.pos.x, 0, this.pos.y);
    g.rotation.y = this.heading;
    this.player.update(dt, speed, this.motion);
    // nearest door
    let best: Door | null = null, bd = 1.9;
    for (const d of this.world.doors) { const dd = Math.hypot(d.x - this.pos.x, d.z - this.pos.y); if (dd < bd) { bd = dd; best = d; } }
    if (best !== this.near) { this.near = best; this.hooks.near(best); }
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
    this.camera.lookAt(this.camPos.x - CAM.x, lookY, this.camPos.z - CAM.z - LEAD);
    this.renderer.render(this.scene, this.camera);
    this.hooks.frame?.();
  }

  /** World point → CSS px inside the host (for HTML labels). null if behind the camera. */
  project(x: number, y: number, z: number) {
    const v = new THREE.Vector3(x, y, z).project(this.camera);
    if (v.z > 1) return null;
    const r = this.canvas.getBoundingClientRect();
    return { x: (v.x * 0.5 + 0.5) * r.width, y: (-v.y * 0.5 + 0.5) * r.height };
  }
}
