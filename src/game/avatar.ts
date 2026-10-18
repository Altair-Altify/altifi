/* ---------- Chibi low-poly characters, built from shapes in code (design doc 13.3 "Nhân vật người chơi") ----------
 * Head ≈ 40% of the height, short body and legs, oval black eyes with a highlight, pink cheeks, small smile;
 * hair = cap + fringe made of polyhedra. The outfit follows the career stage:
 * student (T-shirt + yellow backpack) → staff (shirt + purple tie) → owner (apron + green cap) → tycoon (dark suit +
 * red tie + gold crown). Animation: breathing when idle, swinging arms/legs + bounce when walking, head tilt. */
import * as THREE from "three";
import { mat, blobGeo, blobMat } from "./kit";

export type Stage = "student" | "staff" | "owner" | "tycoon";
export interface Look { skin: string; hair: string; style: 0 | 1 | 2; top: string; bottom: string; shoes: string }
export const SKINS = ["#FFE0C7", "#F5C9A3", "#E3A87C", "#C98B5E", "#9A6440", "#6E4630"];
export const HAIRS = ["#2B2233", "#5A3A2A", "#A0522D", "#E8B04A", "#E86A92", "#5B5BD6"];
export const TOPS = ["#FF8FA3", "#5AA9E6", "#7CCB8A", "#FFC93C", "#B39DFF", "#FF9F5A"];
export const BOTTOMS = ["#3D4A7A", "#5A6B8C", "#2E2A57", "#7A5A44"];
export const defaultLook = (): Look => ({ skin: SKINS[1], hair: HAIRS[0], style: 0, top: TOPS[0], bottom: BOTTOMS[0], shoes: "#FFFFFF" });

const ico = (r: number, d = 1) => new THREE.IcosahedronGeometry(r, d);
function part(g: THREE.BufferGeometry, color: string, p: [number, number, number] = [0, 0, 0], s: [number, number, number] | number = 1, r: [number, number, number] = [0, 0, 0]) {
  const m = new THREE.Mesh(g, mat(color));
  m.position.set(...p); m.rotation.set(...r);
  if (typeof s === "number") m.scale.setScalar(s); else m.scale.set(...s);
  m.frustumCulled = false;
  return m;
}

export interface Avatar {
  group: THREE.Group;
  /** speed 0..1 of max walking speed; dt seconds */
  update(dt: number, speed: number, motion: boolean): void;
  dispose(): void;
}

export function makeAvatar(look: Look, stage: Stage, scale = 1): Avatar {
  const g = new THREE.Group(), body = new THREE.Group();
  g.add(body);
  const outfit = {
    student: { top: look.top, bottom: look.bottom },
    staff: { top: "#F7F7FF", bottom: "#3B3F5C" },
    owner: { top: look.top, bottom: look.bottom },
    tycoon: { top: "#2E2A57", bottom: "#2E2A57" },
  }[stage];

  // legs (pivot at the hip)
  const legs: THREE.Group[] = [];
  for (const sx of [-1, 1]) {
    const L = new THREE.Group(); L.position.set(0.11 * sx, 0.36, 0);
    L.add(part(new THREE.CapsuleGeometry(0.095, 0.16, 3, 6), outfit.bottom, [0, -0.17, 0]));
    L.add(part(new THREE.BoxGeometry(0.17, 0.1, 0.25), look.shoes, [0, -0.33, 0.04]));
    body.add(L); legs.push(L);
  }
  // torso
  const torso = new THREE.Group(); torso.position.y = 0.36; body.add(torso);
  torso.add(part(new THREE.CylinderGeometry(0.2, 0.27, 0.46, 8), outfit.top, [0, 0.22, 0]));
  if (stage === "staff" || stage === "tycoon") torso.add(part(new THREE.BoxGeometry(0.07, 0.3, 0.03), stage === "staff" ? "#5B5BD6" : "#E5484D", [0, 0.24, 0.235], 1, [-0.12, 0, 0]));
  if (stage === "tycoon") { torso.add(part(new THREE.BoxGeometry(0.16, 0.14, 0.03), "#F7F7FF", [0, 0.38, 0.2], 1, [-0.2, 0, 0])); }
  if (stage === "owner") torso.add(part(new THREE.BoxGeometry(0.36, 0.38, 0.04), "#2FAE73", [0, 0.17, 0.235], 1, [-0.12, 0, 0]));
  if (stage === "student") torso.add(part(new THREE.CapsuleGeometry(0.17, 0.12, 3, 6), "#FFC93C", [0, 0.25, -0.26], [1, 1, 0.55]));
  // arms (pivot at the shoulder)
  const arms: THREE.Group[] = [];
  for (const sx of [-1, 1]) {
    const A = new THREE.Group(); A.position.set(0.25 * sx, 0.4, 0); A.rotation.z = 0.18 * sx;
    A.add(part(new THREE.CapsuleGeometry(0.07, 0.2, 3, 6), outfit.top, [0, -0.15, 0]));
    A.add(part(ico(0.075, 0), look.skin, [0, -0.32, 0]));
    torso.add(A); arms.push(A);
  }
  // head
  const head = new THREE.Group(); head.position.y = 0.52 + 0.36; torso.add(head);
  head.add(part(ico(0.38, 2), look.skin, [0, 0, 0], [1, 0.94, 0.92]));
  for (const sx of [-1, 1]) {
    head.add(part(new THREE.SphereGeometry(0.055, 8, 6), "#1E1B2E", [0.13 * sx, -0.01, 0.325], [0.85, 1.35, 0.5]));
    head.add(part(new THREE.SphereGeometry(0.018, 6, 4), "#FFFFFF", [0.13 * sx + 0.015, 0.03, 0.352]));
    head.add(part(new THREE.SphereGeometry(0.05, 8, 6), "#FF9DAA", [0.22 * sx, -0.1, 0.29], [1, 0.6, 0.35]));
    head.add(part(new THREE.SphereGeometry(0.06, 6, 5), look.skin, [0.36 * sx, -0.02, 0], [0.5, 1, 0.8])); // ears
  }
  head.add(part(new THREE.TorusGeometry(0.045, 0.014, 4, 10, Math.PI), "#7A3B3B", [0, -0.12, 0.33], 1, [0, 0, Math.PI]));
  // hair: cap + fringe (+ long back / bun)
  head.add(part(new THREE.SphereGeometry(0.405, 10, 7, 0, Math.PI * 2, 0, Math.PI * 0.52), look.hair, [0, 0.02, -0.03], [1, 0.98, 1]));
  for (let i = -2; i <= 2; i++) head.add(part(ico(0.11, 0), look.hair, [i * 0.1, 0.2 - Math.abs(i) * 0.025, 0.28 - Math.abs(i) * 0.04], [1, 0.75, 0.7], [0.3, 0, i * 0.2]));
  if (look.style === 1) head.add(part(new THREE.CylinderGeometry(0.34, 0.3, 0.45, 8, 1, true), look.hair, [0, -0.14, -0.08], 1, [0.15, 0, 0]));
  if (look.style === 2) head.add(part(ico(0.15, 1), look.hair, [0, 0.4, -0.08]));
  // hats by stage
  if (stage === "owner") { head.add(part(new THREE.CylinderGeometry(0.33, 0.36, 0.16, 10), "#2FAE73", [0, 0.3, -0.02])); head.add(part(new THREE.BoxGeometry(0.42, 0.03, 0.22), "#2FAE73", [0, 0.24, 0.3])); }
  if (stage === "tycoon") {
    head.add(part(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 8), "#FFC93C", [0, 0.42, 0]));
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; head.add(part(new THREE.ConeGeometry(0.05, 0.13, 4), "#FFC93C", [Math.sin(a) * 0.18, 0.53, Math.cos(a) * 0.18])); }
  }
  // soft shadow
  const sh = new THREE.Mesh(blobGeo(0.42), blobMat()); sh.position.y = 0.04; sh.renderOrder = 1; sh.frustumCulled = false; g.add(sh);
  g.scale.setScalar(scale);

  let ph = 0, t = 0, amt = 0;
  return {
    group: g,
    update(dt, speed, motion) {
      t += dt;
      amt += ((speed > 0.05 ? 1 : 0) - amt) * Math.min(1, dt * 10);
      if (!motion) { legs.forEach((l) => (l.rotation.x = 0)); arms.forEach((a) => (a.rotation.x = 0)); body.position.y = 0; return; }
      ph += dt * (6 + speed * 7);
      const s = Math.sin(ph) * amt;
      legs[0].rotation.x = s * 0.7; legs[1].rotation.x = -s * 0.7;
      arms[0].rotation.x = -s * 0.6; arms[1].rotation.x = s * 0.6;
      body.position.y = Math.abs(Math.cos(ph)) * 0.06 * amt;
      torso.scale.y = 1 + Math.sin(t * 2.2) * 0.012 * (1 - amt); // breathing
      head.rotation.z = Math.sin(t * 0.7) * 0.05 * (1 - amt) + s * 0.04;
      head.rotation.x = -0.04 * amt;
    },
    dispose() { g.traverse((o) => (o as THREE.Mesh).geometry?.dispose()); },
  };
}
