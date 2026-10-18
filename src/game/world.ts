/* ---------- The town map: ground, paths, buildings, trees… (design doc 13.3 + 6.1b) ----------
 * Data-driven: each building is a spec (zone, position, size, colours, door). The builder turns everything static
 * into one merged mesh + one shadow mesh, and returns colliders (boxes/circles) and doors for interaction.
 * Coordinates: x → east, z → south (towards the camera), y up. 1 unit ≈ 1 m. */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Builder, sceneryMat, blobMesh, type V3 } from "./kit";
import { fbm, seeded } from "../galaxy/planet";
import type { T } from "../i18n/i18n";

export type ZoneId = "personal" | "corporate" | "markets" | "public" | "intl" | "museum" | "macro";
export interface BuildingSpec {
  id: string; zone: ZoneId;
  name: T;
  ic: string; // UI icon on the action button
  x: number; z: number; w: number; d: number; h: number;
  wall: string; roof: string; trim?: string;
  roofKind?: "gable" | "flat" | "dome";
  face?: "s" | "e" | "w" | "n"; // side with the door (default south = towards the camera)
  lesson?: string; // lesson that unlocks it (13.2d "Game" column)
}
export interface Door { id: string; x: number; z: number; b: BuildingSpec }
export interface Box { x0: number; z0: number; x1: number; z1: number }
export interface Circle { x: number; z: number; r: number }
export interface World { group: THREE.Group; boxes: Box[]; circles: Circle[]; doors: Door[]; half: number; spawn: [number, number] }

export const HALF = 34; // the walkable world is [-HALF, HALF]²

/* Zone 1 (Personal finance) + the plaza: the minimal town of 20/10. More zones are added to this list. */
export const BUILDINGS: BuildingSpec[] = [
  { id: "home", zone: "personal", name: { vi: "Nhà của bạn", en: "Your home" }, ic: "house", x: -14, z: 16, w: 5, d: 4.4, h: 3, wall: "#FFF3DE", roof: "#F7867A", trim: "#C98B5E" },
  { id: "bank", zone: "personal", name: { vi: "Ngân hàng", en: "Bank" }, ic: "bank", x: -16, z: -2, w: 7, d: 5, h: 4.2, wall: "#EDEBFF", roof: "#5B5BD6", trim: "#FFC93C", roofKind: "flat", lesson: "p-inflation" },
  { id: "market", zone: "personal", name: { vi: "Chợ", en: "Market" }, ic: "basket", x: 12, z: -1, w: 6, d: 4.4, h: 3.2, wall: "#FFE9C7", roof: "#2FAE73", trim: "#F5A524", lesson: "p-budget" },
];

/* Paths [x0, z0, x1, z1, width]: main road (z = 4) through the plaza, the road to the houses (z = 23.5), connectors to doors. */
const PATHS: [number, number, number, number, number][] = [
  [-30, 4, 30, 4, 2.8], [0, 4, 0, -22, 2.6], [0, 4, 0, 23.5, 2.6], [-26, 23.5, 0, 23.5, 2.4],
  [-16, 0.8, -16, 4, 2], [12, 1.4, 12, 4, 2], [-14, 18.4, -14, 23.5, 1.8],
];
const PLAZA: [number, number] = [0, 4];

const PALETTE = { grass: "#9ED46F", grass2: "#86C65A", grass3: "#B5E07E", path: "#EED9A8", plaza: "#E9E1D2", plaza2: "#D9CFBD", trunk: "#9A6B4A", leaf: "#6CC15A", leaf2: "#4FA84A", leaf3: "#8AD36A", pine: "#3E9A5C", fence: "#E7C79A", stone: "#C9C3D9", water: "#7FD3F0" };

/** Triangular-prism roof: length along x, apex up, base at y = 0. */
function prism(len: number, width: number, height: number) {
  const r = width / Math.sqrt(3), g = new THREE.CylinderGeometry(r, r, len, 3);
  g.rotateZ(Math.PI / 2); g.rotateX(-Math.PI / 2); g.translate(0, r / 2, 0); g.scale(1, height / (1.5 * r), 1);
  return g;
}

export function buildWorld(potato: boolean): World {
  const rnd = seeded(2024), B = new Builder(rnd), group = new THREE.Group();
  const boxes: Box[] = [], circles: Circle[] = [], doors: Door[] = [], blobs: { x: number; z: number; rx: number; rz?: number }[] = [];
  const S = HALF + 14; // ground reaches beyond the walkable area so the curved horizon is green

  /* ---- ground: 1-unit cells, colour patches from noise (grass, lighter meadows, darker clumps) ---- */
  {
    const n = S * 2, g = new THREE.PlaneGeometry(n, n, n, n).toNonIndexed(); g.rotateX(-Math.PI / 2);
    const pos = g.getAttribute("position"), col = new Float32Array(pos.count * 3), c = new THREE.Color(), a = new THREE.Color(PALETTE.grass), b2 = new THREE.Color(PALETTE.grass2), b3 = new THREE.Color(PALETTE.grass3);
    for (let i = 0; i < pos.count; i += 3) {
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3, cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      const f = fbm(cx * 0.09, 0.5, cz * 0.09);
      c.copy(a); if (f > 0.58) c.lerp(b3, Math.min(1, (f - 0.58) * 6)); else if (f < 0.4) c.lerp(b2, Math.min(1, (0.4 - f) * 6));
      c.multiplyScalar(0.97 + rnd() * 0.06);
      for (let v = i; v < i + 3; v++) { col[v * 3] = c.r; col[v * 3 + 1] = c.g; col[v * 3 + 2] = c.b; }
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aSway", new THREE.BufferAttribute(new Float32Array(pos.count), 1));
    g.deleteAttribute("uv");
    B.addRaw(g);
  }

  /* ---- paths (subdivided strips so they follow the curve) + round joints ---- */
  const path = (x0: number, z0: number, x1: number, z1: number, w = 2.6, color = PALETTE.path) => {
    const len = Math.hypot(x1 - x0, z1 - z0), g = new THREE.PlaneGeometry(w, len, 1, Math.max(1, Math.ceil(len)));
    g.rotateX(-Math.PI / 2);
    B.add(g, color, { p: [(x0 + x1) / 2, 0.02, (z0 + z1) / 2], r: [0, Math.atan2(x1 - x0, z1 - z0), 0] }, 0, 0.03);
    for (const [x, z] of [[x0, z0], [x1, z1]]) { const c = new THREE.CircleGeometry(w / 2, 14); c.rotateX(-Math.PI / 2); B.add(c, color, { p: [x, 0.021, z] }, 0, 0.03); }
  };
  for (const [x0, z0, x1, z1, w] of PATHS) path(x0, z0, x1, z1, w);

  /* ---- plaza + fountain ---- */
  {
    const [px, pz] = PLAZA;
    const c = new THREE.CircleGeometry(6.2, 28); c.rotateX(-Math.PI / 2); B.add(c, PALETTE.plaza, { p: [px, 0.03, pz] }, 0, 0.04);
    const r = new THREE.RingGeometry(4.6, 5.0, 28); r.rotateX(-Math.PI / 2); B.add(r, PALETTE.plaza2, { p: [px, 0.035, pz] }, 0, 0.02);
    B.add(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 14), PALETTE.stone, { p: [px, 0.3, pz] });
    B.add(new THREE.CylinderGeometry(2.05, 2.05, 0.1, 14), PALETTE.water, { p: [px, 0.56, pz] }, 0, 0.02);
    B.add(new THREE.CylinderGeometry(0.35, 0.5, 1.4, 8), PALETTE.stone, { p: [px, 1.0, pz] });
    B.add(new THREE.CylinderGeometry(0.9, 0.6, 0.25, 10), PALETTE.stone, { p: [px, 1.75, pz] });
    B.add(new THREE.IcosahedronGeometry(0.35, 1), PALETTE.water, { p: [px, 2.05, pz] }, 0, 0.02);
    circles.push({ x: px, z: pz, r: 2.7 });
    blobs.push({ x: px, z: pz, rx: 3.3 });
  }

  /* ---- buildings ---- */
  for (const b of BUILDINGS) {
    const { x, z, w, d, h } = b, face = b.face || "s";
    const rotY = { s: 0, e: Math.PI / 2, n: Math.PI, w: -Math.PI / 2 }[face];
    const sideways = face === "e" || face === "w";
    const W = sideways ? d : w, D = sideways ? w : d; // footprint on the map
    const local = (lx: number, ly: number, lz: number): V3 => { const c = Math.cos(rotY), s = Math.sin(rotY); return [x + lx * c + lz * s, ly, z - lx * s + lz * c]; };
    B.add(new RoundedBoxGeometry(w, h, d, 2, 0.22), b.wall, { p: [x, h / 2, z], r: [0, rotY, 0] });
    B.add(new RoundedBoxGeometry(w + 0.2, 0.35, d + 0.2, 1, 0.1), b.trim || "#D9CFBD", { p: [x, 0.17, z], r: [0, rotY, 0] }); // plinth
    if ((b.roofKind || "gable") === "gable") {
      B.add(prism(w + 0.7, d + 0.9, h * 0.62), b.roof, { p: [x, h - 0.05, z], r: [0, rotY, 0] });
      B.add(new THREE.BoxGeometry(0.5, 1.1, 0.5), "#B8A79A", { p: local(w * 0.25, h + 0.75, -d * 0.12), r: [0, rotY, 0] }); // chimney
    } else {
      B.add(new RoundedBoxGeometry(w + 0.5, 0.45, d + 0.5, 2, 0.15), b.roof, { p: [x, h + 0.2, z], r: [0, rotY, 0] });
      B.add(new RoundedBoxGeometry(w * 0.55, 0.9, d * 0.5, 2, 0.15), b.roof, { p: [x, h + 0.75, z], r: [0, rotY, 0] });
      // columns in front (bank-like)
      for (let i = -1; i <= 1; i += 2) B.add(new THREE.CylinderGeometry(0.22, 0.26, h - 0.4, 8), "#FFFFFF", { p: local(i * (w * 0.32), (h - 0.4) / 2 + 0.3, d / 2 + 0.35) });
    }
    // door + step + sign
    B.add(new RoundedBoxGeometry(1.15, 1.9, 0.2, 2, 0.08), b.trim || "#C98B5E", { p: local(0, 1.2, d / 2 + 0.04), r: [0, rotY, 0] });
    B.add(new THREE.SphereGeometry(0.07, 6, 4), "#FFC93C", { p: local(0.35, 1.2, d / 2 + 0.16) });
    B.add(new RoundedBoxGeometry(1.9, 0.18, 0.9, 1, 0.06), "#D9CFBD", { p: local(0, 0.09, d / 2 + 0.6), r: [0, rotY, 0] });
    B.add(new RoundedBoxGeometry(Math.min(w - 0.6, 3), 0.55, 0.12, 1, 0.05), b.roof, { p: local(0, Math.min(h - 0.35, 2.75), d / 2 + 0.08), r: [0, rotY, 0] });
    // windows (warm glass + frame) on the door side, either side of the door
    const nw = Math.max(1, Math.floor((w - 2) / 2.4));
    for (let i = 0; i < nw; i++) for (const sx of [-1, 1]) {
      const wx = sx * (1.25 + 0.95 + i * 2.1); if (Math.abs(wx) > w / 2 - 0.6) continue;
      B.add(new RoundedBoxGeometry(1.15, 1.05, 0.14, 1, 0.05), "#FFFFFF", { p: local(wx, 1.55, d / 2 + 0.03), r: [0, rotY, 0] });
      B.add(new THREE.BoxGeometry(0.9, 0.8, 0.1), "#BDE7F5", { p: local(wx, 1.55, d / 2 + 0.07), r: [0, rotY, 0] }, 0, 0.02);
      B.add(new THREE.BoxGeometry(1.25, 0.12, 0.3), b.trim || "#C98B5E", { p: local(wx, 0.98, d / 2 + 0.12), r: [0, rotY, 0] });
    }
    boxes.push({ x0: x - W / 2 - 0.15, z0: z - D / 2 - 0.15, x1: x + W / 2 + 0.15, z1: z + D / 2 + 0.15 });
    blobs.push({ x, z: z + 0.2, rx: W / 2 + 1, rz: D / 2 + 1 });
    const dp = local(0, 0, d / 2 + 1.3);
    doors.push({ id: b.id, x: dp[0], z: dp[2], b });
  }

  /* ---- trees, bushes, flowers (kept off paths, buildings and the plaza) ---- */
  const free = (x: number, z: number, r: number) => {
    if (Math.hypot(x - PLAZA[0], z - PLAZA[1]) < 7 + r) return false;
    if (Math.abs(x) > HALF - 1 || Math.abs(z) > HALF - 1) return true; // beyond the edge: always fine (forest ring)
    for (const b of boxes) if (x > b.x0 - r - 1.4 && x < b.x1 + r + 1.4 && z > b.z0 - r - 1.4 && z < b.z1 + r + 2.6) return false;
    for (const c of circles) if (Math.hypot(x - c.x, z - c.z) < c.r + r) return false;
    const onPath = (ax: number, az: number, bx: number, bz: number) => { const vx = bx - ax, vz = bz - az, L = vx * vx + vz * vz, k = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / L)); return Math.hypot(x - ax - vx * k, z - az - vz * k) < 1.6 + r; };
    for (const [ax, az, bx, bz] of PATHS) if (onPath(ax, az, bx, bz)) return false;
    return true;
  };
  const tree = (x: number, z: number, kind: number, s: number) => {
    if (kind === 0) { // round, tiered crown
      B.add(new THREE.CylinderGeometry(0.2 * s, 0.28 * s, 1.3 * s, 6), PALETTE.trunk, { p: [x, 0.65 * s, z] });
      const leaf = [PALETTE.leaf, PALETTE.leaf2, PALETTE.leaf3][Math.floor(rnd() * 3)];
      B.add(new THREE.IcosahedronGeometry(1.25 * s, 1), leaf, { p: [x, 2.0 * s, z], s: [1, 0.92, 1] }, 1);
      B.add(new THREE.IcosahedronGeometry(0.8 * s, 1), leaf, { p: [x + 0.25 * s, 2.85 * s, z - 0.1 * s] }, 1.2);
      if (rnd() < 0.35) for (let i = 0; i < 4; i++) { const a = rnd() * 6.28; B.add(new THREE.IcosahedronGeometry(0.12 * s, 0), "#FF7A6B", { p: [x + Math.cos(a) * 1.05 * s, 2 * s + (rnd() - 0.3) * 0.8 * s, z + Math.sin(a) * 1.05 * s] }, 1); }
    } else { // pine, stacked cones
      B.add(new THREE.CylinderGeometry(0.16 * s, 0.22 * s, 0.9 * s, 6), PALETTE.trunk, { p: [x, 0.45 * s, z] });
      for (let i = 0; i < 3; i++) B.add(new THREE.ConeGeometry((1.3 - i * 0.32) * s, 1.3 * s, 7), PALETTE.pine, { p: [x, (1.25 + i * 0.75) * s, z], r: [0, rnd(), 0] }, 0.6 + i * 0.4);
    }
    if (Math.abs(x) < HALF && Math.abs(z) < HALF) circles.push({ x, z, r: 0.45 * s });
    blobs.push({ x: x + 0.2, z: z + 0.25, rx: 1.35 * s });
  };
  const treeN = potato ? 70 : 130;
  for (let i = 0, tries = 0; i < treeN && tries < 3000; tries++) {
    const ring = rnd() < 0.45; // dense ring around the edge, sparse inside
    let x: number, z: number;
    if (ring) { const a = rnd() * 6.283, r = HALF + 1 + rnd() * 10; x = Math.cos(a) * r; z = Math.sin(a) * r; x = Math.max(-S + 1, Math.min(S - 1, x)); z = Math.max(-S + 1, Math.min(S - 1, z)); }
    else { x = (rnd() * 2 - 1) * (HALF - 2); z = (rnd() * 2 - 1) * (HALF - 2); }
    const s = 0.85 + rnd() * 0.45;
    if (!free(x, z, 1.3 * s)) continue;
    tree(x, z, rnd() < 0.3 ? 1 : 0, s); i++;
  }
  // bushes along the houses and flower patches in the meadows
  for (let i = 0, tries = 0; i < (potato ? 20 : 45) && tries < 1500; tries++) {
    const x = (rnd() * 2 - 1) * (HALF - 2), z = (rnd() * 2 - 1) * (HALF - 2);
    if (!free(x, z, 0.7)) continue;
    B.add(new THREE.IcosahedronGeometry(0.6, 1), PALETTE.leaf2, { p: [x, 0.4, z], s: [1.2, 0.8, 1] }, 0.4);
    B.add(new THREE.IcosahedronGeometry(0.42, 1), PALETTE.leaf, { p: [x + 0.45, 0.35, z + 0.15], s: [1.1, 0.8, 1] }, 0.4);
    blobs.push({ x, z: z + 0.1, rx: 1 }); circles.push({ x: x + 0.2, z, r: 0.7 }); i++;
  }
  const FL = ["#FF8FA3", "#FFFFFF", "#FFC93C", "#B39DFF", "#FF7A6B"];
  for (let p = 0; p < (potato ? 10 : 28); p++) {
    const cx = (rnd() * 2 - 1) * (HALF - 3), cz = (rnd() * 2 - 1) * (HALF - 3), col = FL[Math.floor(rnd() * FL.length)];
    if (!free(cx, cz, 1)) continue;
    for (let i = 0; i < 9; i++) {
      const x = cx + (rnd() - 0.5) * 2.6, z = cz + (rnd() - 0.5) * 2.6;
      B.add(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 3), PALETTE.leaf2, { p: [x, 0.15, z] }, 0.5);
      B.add(new THREE.IcosahedronGeometry(0.11, 0), col, { p: [x, 0.33, z] }, 0.6);
    }
  }
  // grass tufts
  for (let i = 0; i < (potato ? 60 : 220); i++) {
    const x = (rnd() * 2 - 1) * (HALF + 6), z = (rnd() * 2 - 1) * (HALF + 6);
    if (!free(x, z, 0.2)) continue;
    for (let k = 0; k < 3; k++) B.add(new THREE.ConeGeometry(0.07, 0.38, 3), rnd() < 0.5 ? PALETTE.grass2 : PALETTE.leaf2, { p: [x + (k - 1) * 0.12, 0.17, z + (rnd() - 0.5) * 0.15], r: [(k - 1) * 0.3, 0, (k - 1) * 0.35] }, 0.8);
  }

  /* ---- low wooden fence around the home garden ---- */
  const fence = (x0: number, z0: number, x1: number, z1: number) => {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(len / 1.2)), ang = Math.atan2(x1 - x0, z1 - z0);
    for (let i = 0; i <= n; i++) { const k = i / n; B.add(new RoundedBoxGeometry(0.18, 0.75, 0.18, 1, 0.05), PALETTE.fence, { p: [x0 + (x1 - x0) * k, 0.38, z0 + (z1 - z0) * k] }); }
    for (const y of [0.3, 0.58]) B.add(new THREE.BoxGeometry(0.08, 0.1, len), PALETTE.fence, { p: [(x0 + x1) / 2, y, (z0 + z1) / 2], r: [0, ang, 0] });
    boxes.push({ x0: Math.min(x0, x1) - 0.15, z0: Math.min(z0, z1) - 0.15, x1: Math.max(x0, x1) + 0.15, z1: Math.max(z0, z1) + 0.15 });
  };
  fence(-20, 12, -20, 21); fence(-20, 21, -15.3, 21); fence(-12.7, 21, -8, 21); fence(-8, 21, -8, 12);

  /* ---- assemble ---- */
  group.add(B.build(sceneryMat()));
  group.add(blobMesh(blobs));
  return { group, boxes, circles, doors, half: HALF, spawn: [-14, 20.2] };
}
