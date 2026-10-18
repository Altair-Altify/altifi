/* ---------- Play tab front page: the home planet floating in space (design doc 13.1b-6) ----------
 * A small Three.js scene (one planet, transparent canvas over the light galaxy background).
 * dive() flies the camera down to the surface before the town opens (town = next session, sunny pastel). */
import * as THREE from "three";
import { makePlanet, type PlanetObj } from "./planet";
import { glowTex } from "./sky";

const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

export class HomeSpace {
  readonly canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  private planet: PlanetObj | null = null;
  private key = "";
  private raf = 0; private running = false; private last = 0; private t = 0;
  private dive0 = 0; private onDive: (() => void) | null = null; private near0 = 0;
  motion = true;

  constructor(private host: HTMLElement, private hidden: () => boolean, potato: boolean) {
    this.renderer = new THREE.WebGLRenderer({ antialias: !potato, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    this.canvas.className = "hs-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.scene.add(new THREE.HemisphereLight("#EEE9FF", "#3B3270", 1.6));
    const sun = new THREE.DirectionalLight("#FFFFFF", 2.4); sun.position.set(-4, 5, 6); this.scene.add(sun);
  }

  /** (Re)build the planet when theme / Potato / number of town lights change. */
  set(night: boolean, potato: boolean, motion: boolean, lights: number) {
    this.motion = motion;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, potato ? 1 : 2));
    const key = `${night}|${potato}|${lights}`;
    if (key === this.key) return;
    this.key = key;
    if (this.planet) { this.scene.remove(this.planet.group); this.planet.dispose(); }
    const p = makePlanet({ shape: "rocky", palette: ["#5AA9E6", "#7CCB8A", "#A9DE8F", "#FFF3D6"], feature: "cities" }, 2, 4242, "done", "#7CCB8A", { night, detail: potato ? 2 : 3, noRing: true });
    for (let i = 0; i < lights; i++) { // one window light per step of progress
      const a = i * 2.39996, y = ((i * 0.37) % 1.6) - 0.8, n = new THREE.Vector3(Math.cos(a) * Math.sqrt(1 - y * y), y, Math.sin(a) * Math.sqrt(1 - y * y));
      const l = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: "#FFD45A", transparent: true, depthWrite: false, blending: night ? THREE.AdditiveBlending : THREE.NormalBlending }));
      l.scale.setScalar(0.5); l.position.copy(n.multiplyScalar(2.2)); p.spin.add(l);
    }
    this.planet = p; this.scene.add(p.group);
  }

  resize() {
    const r = this.host.getBoundingClientRect(), w = Math.max(1, r.width), h = Math.max(1, r.height);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  start() {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    const loop = (now: number) => { if (!this.running) return; this.raf = requestAnimationFrame(loop); this.frame(now); };
    this.raf = requestAnimationFrame(loop);
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }

  /** Entering the Play tab: the camera glides in toward the home planet (~0.65 s). */
  approach() { if (this.motion) this.near0 = performance.now(); }

  /** Camera dives to the surface, then `done` (opens the town). Instant with Potato / reduced motion. */
  dive(done: () => void) {
    if (!this.motion) { done(); return; }
    this.dive0 = performance.now(); this.onDive = done;
  }

  private frame(now: number) {
    const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    if (this.hidden()) return;
    if (!this.motion && !this.onDive && this.t > 0) return; // still picture when motion is off
    this.t += dt;
    let d = 12, y = 1.6;
    if (this.near0) { const k = Math.min(1, (now - this.near0) / 650); d = 22 - 10 * ease(k); y = 3 - 1.4 * ease(k); if (k >= 1) this.near0 = 0; }
    if (this.onDive) {
      const k = Math.min(1, (now - this.dive0) / 950), e = ease(k);
      d = 12 - (12 - 2.25) * e; y = 1.6 + 0.4 * e;
      if (k >= 1) { const f = this.onDive; this.onDive = null; setTimeout(f, 0); }
    }
    this.camera.position.set(0, y, d);
    this.camera.lookAt(0, this.onDive ? 0.9 : 0.25, 0);
    this.planet?.update(this.t, dt, this.motion);
    this.renderer.render(this.scene, this.camera);
  }
}
