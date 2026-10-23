/* ---------- The town map: 7 districts, roads, sea & harbour, trees… (design doc 13.3 + 6.1b) ----------
 * Data-driven: every building is a spec (district, road it faces, size, colours, decorations, the lesson that opens
 * it). The builder turns everything static into a few merged meshes (scenery, windows that glow at night, shadows)
 * and returns colliders (boxes/circles), doors, NPC waypoints and a description for the minimap.
 * Coordinates: x → east, z → south (towards the camera), y up. 1 unit ≈ 1 m. All doors face south (the camera). */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Builder, sceneryMat, blobMesh, bend, type V3 } from "./kit";
import { fbm, seeded } from "../galaxy/planet";
import { glowTex } from "../galaxy/sky";
import type { T } from "../i18n/i18n";

export type ZoneId = "personal" | "corporate" | "markets" | "public" | "intl" | "museum" | "macro";
type Deco = "columns" | "pediment" | "dome" | "glass" | "awning" | "cross" | "boba" | "antenna" | "ticker" | "arch" | "flag" | "banners" | "floors" | "gold" | "fxboard";
export interface BuildingSpec {
  id: string; zone: ZoneId;
  name: T;
  ic: string; // UI icon on the action button
  x: number; road: number; // the road (z) it faces; z is computed
  z?: number;
  w: number; d: number; h: number;
  wall: string; roof: string; trim?: string;
  roofKind?: "gable" | "flat" | "none";
  deco?: Deco[];
  lesson?: string; // lesson that opens it (13.2d "Game" column)
  lot?: boolean; // empty lot for a future branch (no walls)
}
export interface Door { id: string; x: number; z: number; b: BuildingSpec }
export interface Box { x0: number; z0: number; x1: number; z1: number }
export interface Circle { x: number; z: number; r: number }
export interface Zone { id: ZoneId; name: T; x0: number; z0: number; x1: number; z1: number; color: string }
export interface World {
  group: THREE.Group; boxes: Box[]; circles: Circle[]; doors: Door[];
  bounds: Box; spawn: [number, number];
  nodes: [number, number][]; // road points NPCs walk between
  roads: [number, number, number, number, number][];
  buildings: BuildingSpec[]; zones: Zone[]; seaZ: number;
  windows: THREE.MeshLambertMaterial; // glows at night
  water: THREE.Mesh;
  lampGlow: THREE.MeshBasicMaterial; // pools of light under street lamps, opacity follows the night
  fall: THREE.Texture | null; // waterfall texture (scrolled by the town)
  ticker: { tex: THREE.CanvasTexture; ctx: CanvasRenderingContext2D } | null;
  signs: { mat: THREE.MeshLambertMaterial; draw(lang: "vi" | "en"): void }; // name boards on the façades
}

const T2 = (vi: string, en: string) => ({ vi, en });
const tx2 = (v: T, lg: "vi" | "en") => (typeof v === "string" ? v : (v as Record<string, string>)[lg]);
/* Roads [x0, z0, x1, z1, width]. Rows of buildings sit just north of R1 (z 23.5), R0 (z 4), R2 (z −18), R3 (z −31). */
export const ROADS: [number, number, number, number, number][] = [
  [-46, 4, 46, 4, 2.8], [0, -31, 0, 23.5, 2.6], [-40, 23.5, 42, 23.5, 2.4], [-46, -18, 46, -18, 2.6],
  [-36, -31, 44, -31, 2.4], [-36, -31, -36, 23.5, 2.2], [32, -31, 32, 23.5, 2.2],
];
const PLAZA: [number, number] = [0, 4];
const SEA_Z = -40; // north of this line: sand then the sea
/** Pond under a small two-step rock hill: a spring on top falls in two little waterfalls facing the camera
 * (13.3 "sông/suối có thác nhỏ"). */
export const POND = { x: 18, z: 10.9, r: 3.2 };
const HILL = { x0: 13, x1: 23, z0: 5.9, z1: 8.2, h1: 1.6, x2: 15.5, x3: 20.5, z2: 7.0, h2: 3.0 };
const FALL_W = 1.5;
const inWater = (x: number, z: number) => Math.hypot(x - POND.x, z - POND.z) < POND.r;

export const ZONES: Zone[] = [
  { id: "personal", name: T2("Khu dân cư", "Neighbourhood"), x0: -36, z0: -6, x1: -4, z1: 30, color: "#F7867A" },
  { id: "museum", name: T2("Bảo tàng Lịch sử", "History Museum"), x0: -48, z0: -10, x1: -36, z1: 12, color: "#8A5A44" },
  { id: "corporate", name: T2("Phố kinh doanh", "Business Street"), x0: 4, z0: 10, x1: 48, z1: 30, color: "#F5A524" },
  { id: "markets", name: T2("Khu tài chính", "Finance District"), x0: 4, z0: -10, x1: 48, z1: 10, color: "#1BB0C2" },
  { id: "macro", name: T2("NHTW & Tòa tin tức", "Central Bank & News"), x0: -48, z0: -31, x1: -4, z1: -10, color: "#8B6CF0" },
  { id: "public", name: T2("Trung tâm hành chính", "Civic Centre"), x0: 4, z0: -31, x1: 48, z1: -10, color: "#3D7BF5" },
  { id: "intl", name: T2("Cảng biển", "Harbour"), x0: -48, z0: -44, x1: 48, z1: -31, color: "#2FAE73" },
];

export const BUILDINGS: BuildingSpec[] = [
  // ① Personal — the neighbourhood
  { id: "home", zone: "personal", name: T2("Nhà của bạn", "Your home"), ic: "house", x: -14, road: 23.5, w: 5, d: 4.4, h: 3, wall: "#FFF3DE", roof: "#F7867A", trim: "#C98B5E" },
  { id: "office", zone: "personal", name: T2("Công ty đầu tiên", "Your first job"), ic: "banknote", x: -27, road: 23.5, w: 6, d: 5, h: 5.4, wall: "#E6F0FF", roof: "#5A6B8C", trim: "#3D7BF5", roofKind: "flat", deco: ["floors"], lesson: "p-salary" },
  { id: "clinic", zone: "personal", name: T2("Phòng khám & Bảo hiểm", "Clinic & Insurance"), ic: "umbrella", x: -43, road: 23.5, w: 6, d: 4.6, h: 3.6, wall: "#FFFFFF", roof: "#E5484D", trim: "#F2A3A6", roofKind: "flat", deco: ["cross"], lesson: "p-salary" },
  { id: "bank", zone: "personal", name: T2("Ngân hàng", "Bank"), ic: "bank", x: -16, road: 4, w: 7, d: 5, h: 4.2, wall: "#EDEBFF", roof: "#5B5BD6", trim: "#FFC93C", roofKind: "flat", deco: ["columns"], lesson: "p-inflation" },
  { id: "dealer", zone: "personal", name: T2("Nhà & xe", "Homes & rides"), ic: "house", x: -8.6, road: 4, w: 4.8, d: 4.2, h: 3.3, wall: "#EEF5FF", roof: "#3D7BF5", trim: "#9DB8E8", deco: ["awning"] },
  { id: "market", zone: "personal", name: T2("Chợ", "Market"), ic: "basket", x: -28, road: 4, w: 6, d: 4.4, h: 3.2, wall: "#FFE9C7", roof: "#2FAE73", trim: "#F5A524", deco: ["awning"], lesson: "p-budget" },
  // ⑥ History museum — door to the Crisis mode
  { id: "museum", zone: "museum", name: T2("Bảo tàng Khủng hoảng", "Crisis Museum"), ic: "trophy", x: -43, road: 4, w: 7, d: 6, h: 4.6, wall: "#F3E9DC", roof: "#8A5A44", trim: "#C9B8A3", roofKind: "none", deco: ["columns", "pediment", "banners"], lesson: "x-1997" },
  // ② Business street — your shop, lots for branches, the supplier's warehouse
  { id: "shop", zone: "corporate", name: T2("Quán trà sữa của bạn", "Your milk-tea shop"), ic: "shop", x: 12, road: 23.5, w: 5.5, d: 4.4, h: 3.2, wall: "#FFF0E0", roof: "#F5A524", trim: "#C98B5E", deco: ["awning", "boba"], lesson: "c-breakeven" },
  { id: "lot1", zone: "corporate", name: T2("Lô đất trống", "Empty lot"), ic: "pin", x: 20.5, road: 23.5, w: 5, d: 4.4, h: 0, wall: "#D9B98C", roof: "#F5A524", lot: true, lesson: "c-growth" },
  { id: "lot2", zone: "corporate", name: T2("Lô đất trống", "Empty lot"), ic: "pin", x: 27, road: 23.5, w: 5, d: 4.4, h: 0, wall: "#D9B98C", roof: "#F5A524", lot: true, lesson: "c-growth" },
  { id: "warehouse", zone: "corporate", name: T2("Kho nhà cung cấp", "Supplier's warehouse"), ic: "doc", x: 40, road: 23.5, w: 7, d: 5, h: 3.4, wall: "#E9E4F2", roof: "#7A8BA6", trim: "#5A6B8C", roofKind: "none", deco: ["arch"], lesson: "c-cash" },
  // ③ Finance district
  { id: "exchange", zone: "markets", name: T2("Sàn giao dịch", "Stock exchange"), ic: "chart", x: 14, road: 4, w: 8, d: 5.5, h: 4.6, wall: "#F2F5FF", roof: "#1BB0C2", trim: "#9FB4C9", roofKind: "none", deco: ["columns", "pediment", "ticker"], lesson: "i-stocks" },
  { id: "gold", zone: "markets", name: T2("Tiệm vàng & đổi ngoại tệ", "Gold & currency shop"), ic: "coin", x: 25, road: 4, w: 5, d: 4.2, h: 3.2, wall: "#FFF6DA", roof: "#E0A800", trim: "#B8860B", deco: ["awning", "gold"], lesson: "i-bubbles" },
  { id: "fund", zone: "markets", name: T2("Tòa nhà quỹ đầu tư", "Investment fund tower"), ic: "pie", x: 40, road: 4, w: 5.5, d: 5, h: 10, wall: "#BFE3F2", roof: "#1BB0C2", trim: "#6FA3B8", roofKind: "flat", deco: ["glass"], lesson: "i-stocks" },
  // ⑦ Macro — central bank + news tower
  { id: "cbank", zone: "macro", name: T2("Ngân hàng Trung ương", "Central Bank"), ic: "percent", x: -16, road: -18, w: 8.5, d: 6, h: 5, wall: "#EEE8FF", roof: "#8B6CF0", trim: "#C9BCF7", roofKind: "flat", deco: ["columns", "dome"], lesson: "m-centralbank" },
  { id: "news", zone: "macro", name: T2("Tòa tin tức", "News tower"), ic: "doc", x: -29, road: -18, w: 4.6, d: 4.6, h: 8.5, wall: "#F7F2FF", roof: "#5B5BD6", trim: "#8B6CF0", roofKind: "flat", deco: ["antenna", "floors"], lesson: "m-news" },
  // ④ Civic centre
  { id: "cityhall", zone: "public", name: T2("Tòa thị chính", "City hall"), ic: "bank", x: 14, road: -18, w: 9, d: 6, h: 5, wall: "#F4F7FF", roof: "#3D7BF5", trim: "#A9C2F5", roofKind: "flat", deco: ["columns", "dome", "flag"], lesson: "g-tax" },
  { id: "treasury", zone: "public", name: T2("Bộ Tài chính", "Finance ministry"), ic: "scale", x: 27, road: -18, w: 6, d: 5, h: 4.4, wall: "#EAF0FA", roof: "#2C5DC2", trim: "#A9C2F5", roofKind: "none", deco: ["columns", "pediment"], lesson: "g-debt" },
  { id: "school", zone: "public", name: T2("Trường học (đầu tư công)", "School (public investment)"), ic: "cap", x: 40, road: -18, w: 6.5, d: 4.6, h: 3.4, wall: "#FFF4E0", roof: "#E5484D", trim: "#C98B5E", deco: ["flag"], lesson: "g-tax" },
  // ⑤ Harbour
  { id: "port", zone: "intl", name: T2("Cảng & quầy đổi tiền", "Harbour & exchange desk"), ic: "ship", x: 14, road: -31, w: 6, d: 4.2, h: 3.6, wall: "#E6FFF2", roof: "#2FAE73", trim: "#1E8456", roofKind: "flat", deco: ["fxboard"], lesson: "x-fx" },
];
for (const b of BUILDINGS) b.z = b.road - 3.3 - b.d / 2;

/** Short names painted on the façade boards (the full name is on the action button). */
const SIGN: Record<string, T> = {
  home: T2("NHÀ MÌNH", "HOME"), office: T2("CÔNG TY", "OFFICE"), bank: T2("NGÂN HÀNG", "BANK"), dealer: T2("NHÀ & XE", "HOMES & RIDES"),
  market: T2("CHỢ", "MARKET"), museum: T2("BẢO TÀNG KHỦNG HOẢNG", "CRISIS MUSEUM"), shop: T2("TRÀ SỮA", "MILK TEA"),
  warehouse: T2("KHO HÀNG", "WAREHOUSE"), exchange: T2("SÀN GIAO DỊCH", "STOCK EXCHANGE"), gold: T2("VÀNG · NGOẠI TỆ", "GOLD · FX"),
  fund: T2("QUỸ ĐẦU TƯ", "FUND"), cbank: T2("NGÂN HÀNG TRUNG ƯƠNG", "CENTRAL BANK"), cityhall: T2("TÒA THỊ CHÍNH", "CITY HALL"),
  treasury: T2("BỘ TÀI CHÍNH", "FINANCE MINISTRY"), school: T2("TRƯỜNG HỌC", "SCHOOL"),
};
/** Places the demo video walks past get the richer façade (window boxes, shutters, door canopy). */
const SHOWCASE = new Set(["home", "office", "bank", "market", "shop", "museum", "dealer", "clinic"]);

const P = {
  grass: "#9ED46F", grass2: "#86C65A", grass3: "#B5E07E", sand: "#F3E2B3", sandW: "#BFD9C9", path: "#EED9A8", plaza: "#E9E1D2", plaza2: "#D9CFBD",
  trunk: "#9A6B4A", leaf: "#6CC15A", leaf2: "#4FA84A", leaf3: "#8AD36A", pine: "#3E9A5C", fence: "#E7C79A", stone: "#C9C3D9", water: "#7FD3F0",
  glass: "#FFF1B8", lamp: "#FFE7A3", pole: "#5B5470", cliff: "#B9A88F", cliffTop: "#94C766",
};

/** Triangular-prism roof: length along x, apex up, base at y = 0. */
function prism(len: number, width: number, height: number) {
  const r = width / Math.sqrt(3), g = new THREE.CylinderGeometry(r, r, len, 3);
  g.rotateZ(Math.PI / 2); g.rotateX(-Math.PI / 2); g.translate(0, r / 2, 0); g.scale(1, height / (1.5 * r), 1);
  return g;
}
const rbox = (w: number, h: number, d: number, r = 0.12, seg = 1) => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 0.01, h / 2 - 0.01, d / 2 - 0.01));

let fallTex: THREE.Texture | null = null;
export function buildWorld(potato: boolean): World {
  const rich0 = !potato;
  const rnd = seeded(2024), B = new Builder(rnd), W = new Builder(rnd), group = new THREE.Group();
  const boxes: Box[] = [], circles: Circle[] = [], doors: Door[] = [], blobs: { x: number; z: number; rx: number; rz?: number }[] = [];
  const GX = 64, GZ0 = -64, GZ1 = 46; // ground extent: beyond the walkable area so the curved horizon is green / blue
  const bounds: Box = { x0: -47.5, z0: SEA_Z - 0.6, x1: 47.5, z1: 30 };

  const allPaths = [...ROADS];
  for (const b of BUILDINGS) allPaths.push([b.x, b.z! + b.d / 2 + 0.3, b.x, b.road, b.lot ? 2.6 : 1.9]);
  /** Distance from (x, z) to the nearest path edge (< 0 = on a path). */
  const pathDist = (x: number, z: number, list = allPaths) => {
    let best = 1e9;
    for (const [ax, az, bx, bz, w] of list) {
      const vx = bx - ax, vz = bz - az, L = vx * vx + vz * vz || 1, k = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / L));
      best = Math.min(best, Math.hypot(x - ax - vx * k, z - az - vz * k) - w / 2);
    }
    return best;
  };

  /* ---- ground: 1-unit cells, colour patches from noise; sand along the sea ----
   * Three layers keep the big lawns from looking flat: small patches (fbm 0.09), a broad drift between sunny
   * yellow-green and deep blue-green (fbm 0.035), and drier, trodden grass in a band along every path. */
  const GA = new THREE.Color(P.grass), GB2 = new THREE.Color(P.grass2), GB3 = new THREE.Color(P.grass3), SAND = new THREE.Color(P.sand), WET = new THREE.Color(P.sandW);
  const WARM = new THREE.Color("#BEDB78"), LUSH = new THREE.Color("#78BC62"), DRY = new THREE.Color("#B9D47E");
  const groundCol = (cx: number, cz: number, c: THREE.Color) => {
    const f = fbm(cx * 0.09, 0.5, cz * 0.09), shore = SEA_Z + 4 + (fbm(cx * 0.2, 2, 0) - 0.5) * 2;
    const pd = Math.hypot(cx - POND.x, cz - POND.z);
    if (cz < SEA_Z + 0.5 || inWater(cx, cz)) return c.copy(WET);
    if (pd < POND.r + 0.9) return c.copy(SAND).lerp(GA, 0.35);
    if (cz < shore) return c.copy(SAND);
    c.copy(GA); if (f > 0.58) c.lerp(GB3, Math.min(1, (f - 0.58) * 6)); else if (f < 0.4) c.lerp(GB2, Math.min(1, (0.4 - f) * 6));
    const h = fbm(cx * 0.035 + 7, 1.5, cz * 0.035 - 3);
    if (h > 0.54) c.lerp(WARM, Math.min(0.6, (h - 0.54) * 3.5)); else if (h < 0.44) c.lerp(LUSH, Math.min(0.55, (0.44 - h) * 3.5));
    if (cz > SEA_Z + 3) { const e = pathDist(cx, cz); if (e < 1.3) c.lerp(DRY, (1 - Math.max(0, e) / 1.3) * 0.5); }
    return c;
  };
  {
    const w = GX * 2, d = GZ1 - GZ0, g = new THREE.PlaneGeometry(w, d, w, d).toNonIndexed(); g.rotateX(-Math.PI / 2); g.translate(0, 0, (GZ0 + GZ1) / 2);
    const pos = g.getAttribute("position"), col = new Float32Array(pos.count * 3), c = new THREE.Color();
    for (let i = 0; i < pos.count; i += 3) {
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3, cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      groundCol(cx, cz, c);
      c.multiplyScalar(0.96 + rnd() * 0.08);
      for (let v = i; v < i + 3; v++) { col[v * 3] = c.r; col[v * 3 + 1] = c.g; col[v * 3 + 2] = c.b; }
    }
    // the sea floor dips so the water surface sits above it
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      if (z < SEA_Z) pos.setY(i, -Math.min(1.2, (SEA_Z - z) * 0.25));
      else if (inWater(x, z)) pos.setY(i, -0.45); // pond & creek bed
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aSway", new THREE.BufferAttribute(new Float32Array(pos.count), 1));
    g.deleteAttribute("uv");
    B.addRaw(g);
  }
  boxes.push({ x0: -80, z0: -90, x1: 80, z1: SEA_Z - 0.3 }); // the sea
  circles.push({ x: POND.x, z: POND.z, r: POND.r + 0.1 });
  boxes.push({ x0: HILL.x0, z0: HILL.z0, x1: HILL.x1, z1: HILL.z1 });

  /* ---- terraced cliffs behind the south-west and south-east corners + along the west/east edges (decor, 2 levels) ---- */
  const cliff = (x0: number, z0: number, x1: number, z1: number, h: number) => {
    const w = x1 - x0, d = z1 - z0;
    B.add(rbox(w, h, d, 0.5, 2), P.cliff, { p: [x0 + w / 2, h / 2 - 0.05, z0 + d / 2] }, 0, 0.06);
    B.add(rbox(w + 0.2, 0.35, d + 0.2, 0.15, 1), P.cliffTop, { p: [x0 + w / 2, h + 0.1, z0 + d / 2] }, 0, 0.05);
  };
  cliff(-64, -38, -50, 46, 2.2); cliff(-64, -30, -56, 40, 4.2); cliff(50, -38, 64, 46, 2.2); cliff(56, -30, 64, 40, 4.2);
  cliff(-50, 32, 50, 46, 2.2);

  /* ---- roads (subdivided strips so they follow the curve) + round joints ---- */
  const roadTint = (x: number, z: number) => 0.95 + fbm(x * 0.17, 3.3, z * 0.17) * 0.1; // sun-bleached / damp patches
  const strip = (x0: number, z0: number, x1: number, z1: number, w: number, color: string, y = 0.02) => {
    const len = Math.hypot(x1 - x0, z1 - z0), g = new THREE.PlaneGeometry(w, len, 2, Math.max(1, Math.ceil(len)));
    g.rotateX(-Math.PI / 2);
    B.add(g, color, { p: [(x0 + x1) / 2, y, (z0 + z1) / 2], r: [0, Math.atan2(x1 - x0, z1 - z0), 0] }, 0, 0.015, roadTint);
    for (const [x, z] of [[x0, z0], [x1, z1]]) { const c = new THREE.CircleGeometry(w / 2, 14); c.rotateX(-Math.PI / 2); B.add(c, color, { p: [x, y + 0.001, z] }, 0, 0.03, roadTint); }
  };
  const BRICK = ["#EBBE9B", "#E2AC88", "#F2CDAE", "#E8B48F"];
  /** Brick walk from a door to the road: mortar bed + staggered pastel bricks. */
  const pavers = (x: number, z0: number, z1: number, w: number) => {
    const g = new THREE.PlaneGeometry(w, z1 - z0, 2, Math.max(1, Math.ceil(z1 - z0))); g.rotateX(-Math.PI / 2);
    B.add(g, "#D8C3A6", { p: [x, 0.022, (z0 + z1) / 2] }, 0, 0.03);
    const cols = Math.round(w / 0.48), bw = w / cols;
    for (let r = 0, z = z0 + 0.17; z < z1 - 0.12; r++, z += 0.32) {
      for (let i = 0; i < cols + (r % 2); i++) {
        const lx = -w / 2 + bw * (i + (r % 2 ? 0 : 0.5)), x0 = Math.max(-w / 2, lx - bw / 2 + 0.03), x1 = Math.min(w / 2, lx + bw / 2 - 0.03);
        if (x1 - x0 < 0.12) continue;
        const q = new THREE.PlaneGeometry(x1 - x0, 0.26); q.rotateX(-Math.PI / 2);
        B.add(q, BRICK[Math.floor(rnd() * BRICK.length)], { p: [x + (x0 + x1) / 2, 0.04, z] }, 0, 0.03);
      }
    }
  };
  for (const [x0, z0, x1, z1, w] of ROADS) strip(x0, z0, x1, z1, w, P.path);
  for (const b of BUILDINGS) {
    const z0 = b.z! + b.d / 2 + 0.3, rw = ROADS.find((r) => r[1] === b.road && r[3] === b.road)?.[4] ?? 2.4;
    if (potato || b.lot) strip(b.x, z0, b.x, b.road, b.lot ? 2.6 : 1.9, P.path);
    else pavers(b.x, z0, b.road - rw / 2 + 0.05, 1.9);
  }
  /* ragged grass edges, grass growing in the dirt roads, pebbles (not in Potato Mode) */
  if (!potato) {
    const c = new THREE.Color();
    for (const [x0, z0, x1, z1, w] of ROADS) {
      const len = Math.hypot(x1 - x0, z1 - z0), ux = (x1 - x0) / len, uz = (z1 - z0) / len, ang = Math.atan2(x1 - x0, z1 - z0);
      const others = ROADS.filter((r) => r[0] !== x0 || r[1] !== z0 || r[2] !== x1 || r[3] !== z1);
      for (let k = 0.3; k < len; k += 0.5) {
        for (const side of [-1, 1]) {
          if (rnd() < 0.55) continue;
          const off = w / 2 - 0.04 - rnd() * 0.16, x = x0 + ux * k - uz * off * side, z = z0 + uz * k + ux * off * side;
          if (pathDist(x + -uz * side * 0.7, z + ux * side * 0.7, others) < 0.2 || Math.hypot(x - PLAZA[0], z - PLAZA[1]) < 6.8 || z < SEA_Z + 4) continue;
          const r = 0.16 + rnd() * 0.2, g = new THREE.CircleGeometry(r, 5 + Math.floor(rnd() * 3)); g.rotateX(-Math.PI / 2);
          groundCol(x, z, c).lerp(DRY, 0.15);
          B.add(g, c.getStyle(), { p: [x, 0.034, z], r: [0, ang + (rnd() - 0.5) * 0.6, 0], s: [1, 1, 1.5 + rnd()] }, 0, 0.02);
        }
      }
      for (let k = 2; k < len - 2; k += 2.2) {
        const lat = (rnd() - 0.5) * w * 0.55, x = x0 + ux * k - uz * lat, z = z0 + uz * k + ux * lat;
        if (Math.hypot(x - PLAZA[0], z - PLAZA[1]) < 6.8 || pathDist(x, z, others) < 0.3) continue;
        const roll = rnd();
        if (roll < 0.3) { // a streak of grass along the road, a few blades sticking up
          const g = new THREE.CircleGeometry(0.3, 6); g.rotateX(-Math.PI / 2);
          B.add(g, groundCol(x, z, c).lerp(DRY, 0.25).getStyle(), { p: [x, 0.033, z], r: [0, ang, 0], s: [0.6 + rnd() * 0.5, 1, 2.5 + rnd() * 2.5] }, 0, 0.04);
          for (let i = 0; i < 3; i++) B.add(new THREE.ConeGeometry(0.05, 0.26, 3, 1, true), P.grass2, { p: [x + ux * (i - 1) * 0.4, 0.12, z + uz * (i - 1) * 0.4], r: [(i - 1) * 0.3, 0, (i - 1) * 0.3] }, 0.7);
        } else if (roll < 0.55) { // pebbles
          for (let i = 0; i < 3; i++) B.add(new THREE.DodecahedronGeometry(0.07 + rnd() * 0.06, 0), rnd() < 0.5 ? "#D9CBB0" : "#C8BBA2", { p: [x + (rnd() - 0.5) * 0.6, 0.04, z + (rnd() - 0.5) * 0.6], s: [1, 0.5, 1] }, 0, 0.04);
        }
      }
    }
  }

  /* ---- plaza + fountain ---- */
  {
    const [px, pz] = PLAZA;
    const c = new THREE.CircleGeometry(6.2, 28); c.rotateX(-Math.PI / 2); B.add(c, P.plaza, { p: [px, 0.03, pz] }, 0, 0.04);
    const r = new THREE.RingGeometry(4.6, 5.0, 28); r.rotateX(-Math.PI / 2); B.add(r, P.plaza2, { p: [px, 0.035, pz] }, 0, 0.02);
    B.add(new THREE.CylinderGeometry(2.4, 2.6, 0.6, 14), P.stone, { p: [px, 0.3, pz] });
    B.add(new THREE.CylinderGeometry(2.05, 2.05, 0.1, 14), P.water, { p: [px, 0.56, pz] }, 0, 0.02);
    B.add(new THREE.CylinderGeometry(0.35, 0.5, 1.4, 8), P.stone, { p: [px, 1.0, pz] });
    B.add(new THREE.CylinderGeometry(0.9, 0.6, 0.25, 10), P.stone, { p: [px, 1.75, pz] });
    B.add(new THREE.IcosahedronGeometry(0.35, 1), P.water, { p: [px, 2.05, pz] }, 0, 0.02);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; bench(px + Math.cos(a) * 5.4, pz + Math.sin(a) * 5.4, -a + Math.PI / 2); }
    circles.push({ x: px, z: pz, r: 2.7 });
    blobs.push({ x: px, z: pz, rx: 3.3 });
  }
  /** One flower: open 3-sided stem + octahedron head (14 triangles — there are hundreds of them). */
  function flower(x: number, y: number, z: number, col: string) {
    B.add(new THREE.CylinderGeometry(0.02, 0.02, 0.28, 3, 1, true), P.leaf2, { p: [x, y + 0.14, z] }, 0.5);
    B.add(new THREE.OctahedronGeometry(0.115, 0), col, { p: [x, y + 0.31, z], r: [0, x * 3.1, 0] }, 0.6);
  }
  function bench(x: number, z: number, ry: number) {
    B.add(rbox(1.6, 0.12, 0.5, 0.04), "#C98B5E", { p: [x, 0.45, z], r: [0, ry, 0] });
    B.add(rbox(1.6, 0.4, 0.1, 0.04), "#C98B5E", { p: [x - Math.sin(ry) * 0.22, 0.72, z - Math.cos(ry) * 0.22], r: [0, ry, 0] });
    for (const s of [-0.65, 0.65]) B.add(new THREE.BoxGeometry(0.1, 0.45, 0.4), P.pole, { p: [x + Math.cos(ry) * s, 0.22, z - Math.sin(ry) * s], r: [0, ry, 0] });
    circles.push({ x, z, r: 0.7 });
  }

  /* ---- buildings ---- */
  let ticker: World["ticker"] = null;
  const signs: { id: string; x: number; y: number; z: number; w: number; h: number; bg: string; fg: string; rx?: number }[] = [];
  for (const b of BUILDINGS) {
    const { x, w, d, h } = b, z = b.z!, front = z + d / 2;
    const at = (lx: number, ly: number, lz: number): V3 => [x + lx, ly, z + lz];
    doors.push({ id: b.id, x, z: front + 1.3, b });
    if (b.lot) { // empty lot: dirt patch, little fence, "for sale" sign
      const g = new THREE.PlaneGeometry(w, d, 4, 4); g.rotateX(-Math.PI / 2); B.add(g, b.wall, { p: [x, 0.025, z] }, 0, 0.08);
      for (const sx of [-1, 1]) B.add(rbox(0.16, 0.6, d, 0.05), P.fence, { p: [x + sx * w / 2, 0.3, z] });
      B.add(rbox(w, 0.6, 0.16, 0.05), P.fence, { p: [x, 0.3, z - d / 2] });
      B.add(new THREE.CylinderGeometry(0.07, 0.07, 1.5, 6), P.trunk, { p: [x - 0.9, 0.75, front - 0.5] });
      B.add(new THREE.CylinderGeometry(0.07, 0.07, 1.5, 6), P.trunk, { p: [x + 0.9, 0.75, front - 0.5] });
      B.add(rbox(2.2, 0.9, 0.1, 0.05), "#FFFFFF", { p: [x, 1.25, front - 0.45] });
      B.add(rbox(1.9, 0.25, 0.04, 0.03), "#E5484D", { p: [x, 1.42, front - 0.39] });
      B.add(rbox(1.3, 0.12, 0.04, 0.02), "#5A6B8C", { p: [x, 1.08, front - 0.39] });
      continue;
    }
    const deco = new Set(b.deco || []);
    B.add(rbox(w, h, d, 0.22, 2), b.wall, { p: [x, h / 2, z] });
    B.add(rbox(w + 0.2, 0.35, d + 0.2, 0.1), b.trim || "#D9CFBD", { p: [x, 0.17, z] }); // plinth
    const kind = b.roofKind || "gable";
    if (kind === "gable") {
      B.add(prism(w + 0.7, d + 0.9, h * 0.62), b.roof, { p: [x, h - 0.05, z] });
      B.add(rbox(w + 0.8, 0.14, 0.3, 0.05), new THREE.Color(b.roof).multiplyScalar(0.78).getStyle(), { p: [x, h - 0.02, z + d / 2 + 0.38] }); // eave
      B.add(new THREE.BoxGeometry(0.5, 1.1, 0.5), "#B8A79A", { p: at(w * 0.25, h + 0.75, -d * 0.12) }); // chimney
    } else if (kind === "flat") {
      B.add(rbox(w + 0.5, 0.45, d + 0.5, 0.15, 2), b.roof, { p: [x, h + 0.2, z] });
      if (!deco.has("dome") && !deco.has("antenna") && !deco.has("glass")) B.add(rbox(w * 0.55, 0.8, d * 0.5, 0.15, 2), b.roof, { p: [x, h + 0.7, z] });
    }
    if (deco.has("floors")) for (let f = 1; f < Math.floor(h / 2.6); f++) B.add(rbox(w + 0.12, 0.16, d + 0.12, 0.05), b.trim || "#D9CFBD", { p: [x, f * 2.6 + 0.2, z] });
    if (deco.has("pediment")) {
      B.add(rbox(w + 0.6, 0.4, d + 0.6, 0.1), b.trim || "#D9CFBD", { p: [x, h + 0.2, z] });
      B.add(prism(w + 0.6, 1.6, 1.4), b.roof, { p: [x, h + 0.4, z + d / 2 - 0.5], r: [0, 0, 0] });
      B.add(prism(w + 0.4, d - 0.6, 1.1), b.roof, { p: [x, h + 0.4, z - 0.3] });
    }
    if (deco.has("columns")) {
      const n = Math.max(2, Math.round(w / 1.9)), cw = w - 1.2;
      const eh = SIGN[b.id] ? 0.62 : 0.35; // a taller entablature carries the name
      B.add(rbox(w + 0.4, eh, 0.3, 0.06), b.trim || "#FFFFFF", { p: [x, h - 0.1, front + 0.85] });
      if (SIGN[b.id]) signs.push({ id: b.id, x, y: h - 0.1, z: front + 1.012, w: Math.min(w - 0.6, 5.2), h: 0.5, bg: new THREE.Color(b.roof).multiplyScalar(0.62).getStyle(), fg: "#FFE6A3" });
      for (let i = 0; i < n; i++) { const cx = -cw / 2 + (cw * i) / (n - 1); if (Math.abs(cx) < 0.9) continue; B.add(new THREE.CylinderGeometry(0.2, 0.24, h - 0.5, 8), "#FFFFFF", { p: at(cx, (h - 0.5) / 2 + 0.3, d / 2 + 0.85) }); circles.push({ x: x + cx, z: front + 0.85, r: 0.3 }); }
      B.add(rbox(w + 0.4, 0.3, 1.2, 0.08), b.trim || "#D9CFBD", { p: [x, 0.15, front + 0.6] });
    }
    if (deco.has("dome")) {
      B.add(new THREE.CylinderGeometry(1.7, 1.9, 0.9, 12), b.trim || "#FFFFFF", { p: [x, h + 0.85, z] });
      B.add(new THREE.SphereGeometry(1.65, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), b.roof, { p: [x, h + 1.25, z] });
      B.add(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 5), "#FFC93C", { p: [x, h + 3.2, z] });
      B.add(new THREE.IcosahedronGeometry(0.16, 0), "#FFC93C", { p: [x, h + 3.65, z] });
    }
    if (deco.has("glass")) { // tower: stepped glass blocks with bands
      B.add(rbox(w * 0.78, 3.2, d * 0.78, 0.15, 2), b.wall, { p: [x, h + 1.8, z] });
      B.add(rbox(w * 0.82, 0.25, d * 0.82, 0.08), b.roof, { p: [x, h + 3.45, z] });
      for (let f = 1; f < Math.floor(h / 1.6); f++) W.add(rbox(w + 0.04, 0.55, d + 0.04, 0.05), P.glass, { p: [x, f * 1.6 + 0.3, z] }, 0, 0.02);
      for (let f = 0; f < 2; f++) W.add(rbox(w * 0.78 + 0.04, 0.5, d * 0.78 + 0.04, 0.05), P.glass, { p: [x, h + 0.9 + f * 1.3, z] }, 0, 0.02);
    }
    if (deco.has("antenna")) {
      B.add(new THREE.CylinderGeometry(0.1, 0.18, 3.2, 6), P.pole, { p: [x, h + 2, z] });
      B.add(new THREE.IcosahedronGeometry(0.22, 0), "#E5484D", { p: [x, h + 3.7, z] });
      B.add(new THREE.TorusGeometry(0.7, 0.07, 4, 12), P.pole, { p: [x, h + 2.4, z], r: [Math.PI / 2, 0, 0] });
      W.add(rbox(w - 0.8, 1.4, 0.1, 0.05), "#BFD8FF", { p: [x, h - 1.4, front + 0.06] }, 0, 0.02); // news screen
    }
    if (deco.has("arch")) {
      const g = new THREE.CylinderGeometry(d / 2 + 0.2, d / 2 + 0.2, w + 0.3, 12, 1, false, 0, Math.PI); g.rotateZ(Math.PI / 2);
      B.add(g, b.roof, { p: [x, h, z], s: [1, 0.55, 1] });
      B.add(rbox(2.4, 2.2, 0.12, 0.05), "#B8A79A", { p: [x - w * 0.22, 1.2, front + 0.04] }); // loading door
      for (let i = 0; i < 3; i++) B.add(rbox(0.9, 0.7, 0.9, 0.05), ["#C98B5E", "#E7C79A", "#B8860B"][i], { p: [x + w / 2 + 0.9, 0.35 + (i === 2 ? 0.7 : 0), z + d / 2 - 0.6 - (i % 2) * 1] });
      boxes.push({ x0: x + w / 2, z0: z + d / 2 - 2.2, x1: x + w / 2 + 1.5, z1: z + d / 2 });
    }
    if (deco.has("awning")) {
      const cols = deco.has("gold") ? ["#FFC93C", "#FFFFFF"] : [b.roof, "#FFFFFF"], n = Math.round((w - 0.2) / 0.55);
      for (let i = 0; i < n; i++) B.add(new THREE.BoxGeometry((w - 0.2) / n, 0.08, 1.2), cols[i % 2], { p: [x - (w - 0.2) / 2 + ((w - 0.2) / n) * (i + 0.5), 2.55, front + 0.5], r: [0.35, 0, 0] }, 0, 0.02);
    }
    if (deco.has("boba")) { // giant milk-tea cup on the roof
      B.add(new THREE.CylinderGeometry(0.75, 0.55, 1.5, 10), "#F3D9B1", { p: [x - w * 0.18, h + 1.6, z + 0.4] });
      B.add(new THREE.CylinderGeometry(0.8, 0.8, 0.14, 10), "#FFFFFF", { p: [x - w * 0.18, h + 2.4, z + 0.4] });
      B.add(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 5), "#E5484D", { p: [x - w * 0.18 + 0.2, h + 2.9, z + 0.4], r: [0, 0, -0.25] });
      for (let i = 0; i < 6; i++) B.add(new THREE.IcosahedronGeometry(0.12, 0), "#4A2E22", { p: [x - w * 0.18 + Math.cos(i) * 0.45, h + 1.05, z + 0.4 + Math.sin(i) * 0.45 + 0.3] });
    }
    if (deco.has("cross")) { B.add(rbox(1.2, 0.36, 0.14, 0.05), "#E5484D", { p: [x, h - 0.75, front + 0.08] }); B.add(rbox(0.36, 1.2, 0.14, 0.05), "#E5484D", { p: [x, h - 0.75, front + 0.08] }); }
    if (deco.has("flag")) {
      B.add(new THREE.CylinderGeometry(0.06, 0.06, 3, 5), P.pole, { p: [x + w / 2 - 0.5, h + 1.6 + (deco.has("dome") ? 0.4 : 0), z] });
      B.add(new THREE.BoxGeometry(1.1, 0.7, 0.04), "#E5484D", { p: [x + w / 2 + 0.05, h + 2.7 + (deco.has("dome") ? 0.4 : 0), z] }, 0.6);
      B.add(new THREE.IcosahedronGeometry(0.13, 0), "#FFC93C", { p: [x + w / 2 + 0.05, h + 2.7 + (deco.has("dome") ? 0.4 : 0), z + 0.03] }, 0.6);
    }
    if (deco.has("banners")) [["#8A5A44", -w / 2 + 0.7], ["#E07B22", -w / 2 + 1.5], ["#3D5AFE", w / 2 - 0.7]].forEach(([c, bx]) => B.add(new THREE.BoxGeometry(0.6, 1.6, 0.05), c as string, { p: at(bx as number, h - 1.4, d / 2 + 0.06) }, 0.3)); // 1929 · 1973 · 2008
    if (deco.has("fxboard")) W.add(rbox(w - 1, 1, 0.1, 0.05), "#CFF5DF", { p: [x, h - 0.9, front + 0.06] }, 0, 0.02);
    if (deco.has("ticker")) { // stock prices running on the façade (canvas texture, updated by the town)
      const c = document.createElement("canvas"); c.width = 512; c.height = 64;
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w - 1.4, 0.75, 6, 1), bend(new THREE.MeshBasicMaterial({ map: tex })));
      m.position.set(x, h - 0.75, front + 0.92); m.frustumCulled = false; group.add(m);
      ticker = { tex, ctx: c.getContext("2d")! };
    }
    // door + step + sign
    if (!deco.has("arch")) {
      B.add(rbox(1.15, 1.9, 0.2, 0.08), b.trim || "#C98B5E", { p: [x, 1.2, front + 0.04] });
      B.add(new THREE.SphereGeometry(0.07, 6, 4), "#FFC93C", { p: [x + 0.35, 1.2, front + 0.16] });
    }
    B.add(rbox(1.9, 0.18, 0.9, 0.06), "#D9CFBD", { p: [x, 0.09, front + 0.6] });
    if (!deco.has("columns") && !deco.has("antenna") && !deco.has("cross") && !deco.has("fxboard") && b.id !== "home") { // the house's name is on a board by the gate (the eave would hide it)
      const sy = Math.min(h - 0.35, 2.75) + (deco.has("awning") ? 0.25 : 0), sw = Math.min(w - 0.6, 3);
      B.add(rbox(sw, 0.55, 0.12, 0.05), b.roof, { p: [x, sy, front + 0.08] });
      if (SIGN[b.id]) signs.push({ id: b.id, x, y: sy, z: front + 0.145, w: sw - 0.14, h: 0.42, bg: b.roof, fg: "#FFF8EC" });
    }
    if (SHOWCASE.has(b.id) && !deco.has("awning") && !deco.has("columns") && !deco.has("arch")) { // little canopy over the door on two brackets
      const cy = 2.17, roofDark = new THREE.Color(b.roof).multiplyScalar(0.85).getStyle();
      B.add(rbox(1.9, 0.1, 0.95, 0.04), roofDark, { p: [x, cy, front + 0.42], r: [0.32, 0, 0] });
      B.add(rbox(1.94, 0.06, 0.12, 0.03), b.trim || "#FFFFFF", { p: [x, cy - 0.14, front + 0.86], r: [0.32, 0, 0] });
      for (const sx of [-0.8, 0.8]) B.add(new THREE.BoxGeometry(0.07, 0.07, 0.6), b.trim || "#C98B5E", { p: [x + sx, cy - 0.28, front + 0.3], r: [-0.6, 0, 0] });
    }
    // windows (warm glass + white frame) either side of the door, per floor
    const floors = deco.has("glass") ? 0 : Math.max(1, Math.floor((h - 0.4) / 2.6));
    for (let f = 0; f < floors; f++) {
      const y = 1.55 + f * 2.6, nw = Math.max(1, Math.floor((w - 2) / 2.2));
      for (let i = 0; i < nw; i++) for (const sx of [-1, 1]) {
        const wx = sx * (Math.min(2.0, w / 2 - 0.95) + i * 2.0); if (Math.abs(wx) > w / 2 - 0.65 || Math.abs(wx) < 1.35) continue;
        B.add(rbox(1.15, 1.05, 0.14, 0.05), "#FFFFFF", { p: [x + wx, y, front + 0.03] });
        W.add(new THREE.BoxGeometry(0.9, 0.8, 0.1), P.glass, { p: [x + wx, y, front + 0.07] }, 0, 0.02);
        if (f === 0) B.add(new THREE.BoxGeometry(1.25, 0.12, 0.3), b.trim || "#C98B5E", { p: [x + wx, y - 0.57, front + 0.12] });
        if (SHOWCASE.has(b.id)) { // window cross bars; ground floor: a flower box (and shutters on the house)
          B.add(new THREE.BoxGeometry(0.07, 0.8, 0.04), "#FFFFFF", { p: [x + wx, y, front + 0.135] }, 0, 0.02);
          B.add(new THREE.BoxGeometry(0.9, 0.07, 0.04), "#FFFFFF", { p: [x + wx, y + 0.05, front + 0.135] }, 0, 0.02);
          if (f === 0) {
            B.add(rbox(1.08, 0.26, 0.3, 0.05), b.id === "home" ? "#C98B5E" : b.trim || "#C98B5E", { p: [x + wx, y - 0.72, front + 0.24] });
            B.add(new THREE.IcosahedronGeometry(0.17, 0), P.leaf, { p: [x + wx - 0.35, y - 0.55, front + 0.26], s: [1.3, 0.8, 1] }, 0.3);
            B.add(new THREE.IcosahedronGeometry(0.17, 0), P.leaf2, { p: [x + wx + 0.35, y - 0.55, front + 0.26], s: [1.3, 0.8, 1] }, 0.3);
            if (rich0) for (let k = 0; k < 4; k++) flower(x + wx - 0.33 + k * 0.22, y - 0.86, front + 0.24 + (k % 2) * 0.05, ["#FF8FA3", "#FFC93C", "#FFFFFF", "#FF7A6B"][(k + i) % 4]);
          }
          if (b.id === "home") for (const ss of [-1, 1]) B.add(rbox(0.36, 1.0, 0.07, 0.03), b.roof, { p: [x + wx + ss * 0.78, y, front + 0.1] });
        }
      }
      if (f > 0) { // upper-floor window above the door
        B.add(rbox(1.15, 1.05, 0.14, 0.05), "#FFFFFF", { p: [x, y, front + 0.03] });
        W.add(new THREE.BoxGeometry(0.9, 0.8, 0.1), P.glass, { p: [x, y, front + 0.07] }, 0, 0.02);
      }
    }
    boxes.push({ x0: x - w / 2 - 0.15, z0: z - d / 2 - 0.15, x1: x + w / 2 + 0.15, z1: front + 0.15 });
    blobs.push({ x, z: z + 0.25, rx: w / 2 + 1, rz: d / 2 + 1 });
  }

  /* ---- home garden fence ---- */
  const home = BUILDINGS[0], hz = home.z!;
  const fence = (x0: number, z0: number, x1: number, z1: number) => {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(len / 1.2)), ang = Math.atan2(x1 - x0, z1 - z0);
    for (let i = 0; i <= n; i++) { const k = i / n; B.add(rbox(0.18, 0.75, 0.18, 0.05), P.fence, { p: [x0 + (x1 - x0) * k, 0.38, z0 + (z1 - z0) * k] }); }
    for (const y of [0.3, 0.58]) B.add(new THREE.BoxGeometry(0.08, 0.1, len), P.fence, { p: [(x0 + x1) / 2, y, (z0 + z1) / 2], r: [0, ang, 0] });
    boxes.push({ x0: Math.min(x0, x1) - 0.15, z0: Math.min(z0, z1) - 0.15, x1: Math.max(x0, x1) + 0.15, z1: Math.max(z0, z1) + 0.15 });
  };
  const fz0 = hz - 3.5, fz1 = hz + home.d / 2 + 2;
  fence(home.x - 6, fz0, home.x - 6, fz1); fence(home.x - 6, fz1, home.x - 1.3, fz1); fence(home.x + 1.3, fz1, home.x + 6, fz1); fence(home.x + 6, fz1, home.x + 6, fz0);
  // a wooden name board by the gate
  {
    const sx = home.x - 1.95, sz = fz1 + 0.5;
    for (const dx of [-0.55, 0.55]) B.add(new THREE.CylinderGeometry(0.05, 0.06, 1.15, 5), P.trunk, { p: [sx + dx, 0.58, sz] });
    B.add(rbox(1.4, 0.55, 0.1, 0.04), "#C98B5E", { p: [sx, 0.98, sz] });
    signs.push({ id: "home", x: sx, y: 0.98, z: sz + 0.056, w: 1.26, h: 0.42, bg: "#B97F4C", fg: "#FFF8EC" });
    circles.push({ x: sx, z: sz, r: 0.3 });
  }
  // mailbox + flower bed in the garden
  B.add(new THREE.CylinderGeometry(0.06, 0.06, 1, 5), P.pole, { p: [home.x + 2.2, 0.5, fz1 - 0.6] });
  B.add(rbox(0.5, 0.36, 0.34, 0.08), "#E5484D", { p: [home.x + 2.2, 1.1, fz1 - 0.6] });

  /* ---- street furniture & garden details around the demo places (home, office, bank, market, museum, shop) ----
   * Everything is merged into the same static mesh; Potato Mode keeps the furniture but drops the small stuff
   * (flowers in beds, stools, fruit, extra rocks). Front-of-door strips (± 1 m around each path) stay clear. */
  const rich = !potato;
  const extraLamps: [number, number][] = [];
  const FLW = ["#FF8FA3", "#FFFFFF", "#FFC93C", "#B39DFF", "#FF7A6B"];
  const posy = (x: number, z: number, y: number, col: string, n: number, sx: number, sz: number) => { // little flowers
    if (!rich) return;
    for (let i = 0; i < n; i++) {
      const fx = x + (rnd() - 0.5) * sx, fz = z + (rnd() - 0.5) * sz;
      flower(fx, y, fz, i % 3 === 2 ? FLW[(i + 1) % FLW.length] : col);
    }
  };
  const rock = (x: number, z: number, s2: number) => B.add(new THREE.DodecahedronGeometry(0.34 * s2, 0), rnd() < 0.5 ? P.stone : "#B7B0C8", { p: [x, 0.1 * s2, z], r: [rnd(), rnd() * 6, rnd() * 0.3], s: [1.25, 0.65, 1] }, 0, 0.06);
  /** Wooden planter with soil, a bush at one end and flowers. */
  const bed = (x: number, z: number, w: number, d: number, col: string) => {
    B.add(rbox(w, 0.32, d, 0.06), "#C98B5E", { p: [x, 0.16, z] });
    const soil = new THREE.PlaneGeometry(w - 0.16, d - 0.16); soil.rotateX(-Math.PI / 2); B.add(soil, "#7A5A44", { p: [x, 0.325, z] }, 0, 0.04);
    B.add(new THREE.IcosahedronGeometry(Math.min(0.42, d * 0.55), 1), P.leaf, { p: [x - w / 2 + 0.4, 0.5, z], s: [1.15, 0.85, 1] }, 0.4);
    posy(x + 0.2, z, 0.3, col, Math.round(w * 4), w - 0.9, d - 0.25);
    boxes.push({ x0: x - w / 2, z0: z - d / 2, x1: x + w / 2, z1: z + d / 2 });
  };
  /** Terracotta pot with a clipped round shrub (topiary). */
  const pot = (x: number, z: number, leaf = P.leaf2) => {
    B.add(new THREE.CylinderGeometry(0.34, 0.26, 0.5, 8), "#D9825B", { p: [x, 0.25, z] });
    B.add(new THREE.CylinderGeometry(0.37, 0.37, 0.08, 8), "#C46F4A", { p: [x, 0.5, z] });
    B.add(new THREE.IcosahedronGeometry(0.42, 1), leaf, { p: [x, 0.92, z] }, 0.3);
    if (rich) for (let i = 0; i < 3; i++) { const a = rnd() * 6.28; B.add(new THREE.IcosahedronGeometry(0.07, 0), "#FF8FA3", { p: [x + Math.cos(a) * 0.36, 0.95 + (rnd() - 0.5) * 0.3, z + Math.sin(a) * 0.36] }, 0.3); }
    circles.push({ x, z, r: 0.38 }); blobs.push({ x, z: z + 0.1, rx: 0.55 });
  };
  /** Wooden signpost with two arrow boards. */
  const signpost = (x: number, z: number, c1: string, c2: string) => {
    B.add(new THREE.CylinderGeometry(0.07, 0.08, 2, 6), P.trunk, { p: [x, 1, z] });
    B.add(rbox(1.1, 0.3, 0.07, 0.04), c1, { p: [x + 0.35, 1.65, z], r: [0, 0.15, 0] });
    B.add(new THREE.ConeGeometry(0.17, 0.25, 3), c1, { p: [x + 0.97, 1.65, z + 0.09], r: [0, 0.15, -Math.PI / 2] });
    B.add(rbox(1.1, 0.3, 0.07, 0.04), c2, { p: [x - 0.35, 1.25, z], r: [0, -0.2, 0] });
    B.add(new THREE.ConeGeometry(0.17, 0.25, 3), c2, { p: [x - 0.97, 1.25, z + 0.12], r: [0, -0.2, Math.PI / 2] });
    circles.push({ x, z, r: 0.2 });
  };
  const mailbox = (x: number, z: number, col: string) => {
    B.add(new THREE.CylinderGeometry(0.06, 0.06, 1, 5), P.pole, { p: [x, 0.5, z] });
    B.add(rbox(0.36, 0.34, 0.5, 0.08), col, { p: [x, 1.1, z] });
    B.add(new THREE.BoxGeometry(0.04, 0.22, 0.1), "#FFC93C", { p: [x + 0.2, 1.25, z - 0.12] });
    circles.push({ x, z, r: 0.2 });
  };
  const bin = (x: number, z: number) => {
    B.add(new THREE.CylinderGeometry(0.26, 0.22, 0.7, 8), "#5FA78A", { p: [x, 0.35, z] });
    B.add(new THREE.CylinderGeometry(0.29, 0.29, 0.07, 8), "#4A8A70", { p: [x, 0.72, z] });
    circles.push({ x, z, r: 0.28 });
  };
  /** Café table with a striped umbrella and two stools. */
  const cafe = (x: number, z: number, c1: string, c2: string) => {
    B.add(new THREE.CylinderGeometry(0.05, 0.05, 2.1, 5), "#FFFFFF", { p: [x, 1.05, z] });
    B.add(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 10), "#FFFFFF", { p: [x, 0.72, z] });
    B.add(new THREE.CylinderGeometry(0.07, 0.12, 0.7, 6), P.pole, { p: [x, 0.36, z] });
    for (let i = 0; i < 8; i++) B.add(new THREE.ConeGeometry(1.05, 0.45, 3, 1, true, (i / 8) * Math.PI * 2, Math.PI / 4), i % 2 ? c1 : c2, { p: [x, 2.2, z] }, 0.15, 0.02);
    if (rich) for (const sx of [-0.75, 0.75]) { B.add(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 8), c2 === "#FFFFFF" ? c1 : c2, { p: [x + sx, 0.46, z + 0.1] }); B.add(new THREE.CylinderGeometry(0.04, 0.04, 0.44, 4), P.pole, { p: [x + sx, 0.22, z + 0.1] }); }
    circles.push({ x, z, r: 0.95 }); blobs.push({ x, z, rx: 1.1 });
  };
  /** Wooden crate of fruit (market). */
  const crate = (x: number, z: number, fruit: string, y = 0) => {
    B.add(rbox(0.8, 0.42, 0.6, 0.04), "#D9A066", { p: [x, y + 0.21, z] });
    B.add(new THREE.BoxGeometry(0.82, 0.06, 0.62), "#B97F4C", { p: [x, y + 0.3, z] });
    if (rich) for (let i = 0; i < 6; i++) B.add(new THREE.IcosahedronGeometry(0.12, 0), fruit, { p: [x - 0.24 + (i % 3) * 0.24, y + 0.46, z - 0.12 + Math.floor(i / 3) * 0.24] }, 0, 0.08);
    else B.add(new THREE.BoxGeometry(0.7, 0.1, 0.5), fruit, { p: [x, y + 0.44, z] });
  };
  /** Low clipped hedge with a few flowers (frames the road without hiding the player). */
  const hedge = (x0: number, x1: number, z: number) => {
    B.add(rbox(x1 - x0, 0.6, 0.75, 0.25, 2), P.leaf2, { p: [(x0 + x1) / 2, 0.3, z] }, 0.15);
    posy((x0 + x1) / 2, z, 0.5, FLW[Math.floor(rnd() * FLW.length)], Math.round((x1 - x0) * 1.2), x1 - x0 - 0.4, 0.5);
    boxes.push({ x0, z0: z - 0.4, x1, z1: z + 0.4 }); blobs.push({ x: (x0 + x1) / 2, z: z + 0.2, rx: (x1 - x0) / 2 + 0.3, rz: 0.7 });
  };
  const lamp = (x: number, z: number) => extraLamps.push([x, z]);

  // ① your home: flower beds behind the fence, vegetable patch beside the house, stepping stones
  bed(home.x - 4.1, fz1 - 0.75, 2.8, 0.7, "#FF8FA3"); bed(home.x + 4.4, fz1 - 0.75, 2.0, 0.7, "#FFC93C");
  {
    const vx = home.x - 4.5, vz = hz - 0.4;
    B.add(rbox(2.2, 0.16, 3.4, 0.06), "#8A6248", { p: [vx, 0.08, vz] }, 0, 0.05);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 5; i++) B.add(new THREE.IcosahedronGeometry(rich ? 0.17 : 0.2, 0), r === 1 ? "#E5484D" : P.leaf, { p: [vx - 0.65 + r * 0.65, 0.25, vz - 1.3 + i * 0.65] }, 0.4);
    boxes.push({ x0: vx - 1.1, z0: vz - 1.7, x1: vx + 1.1, z1: vz + 1.7 });
    if (rich) for (let i = 0; i < 4; i++) B.add(new THREE.CylinderGeometry(0.28, 0.3, 0.06, 7), "#D8D2E3", { p: [home.x + 3.2 + (i % 2) * 0.2, 0.03, hz + home.d / 2 - 0.2 - i * 0.75] });
  }
  // the first job: potted shrubs by the door, bike rack, post box, bench & signpost at the corner
  {
    const o = BUILDINGS.find((b) => b.id === "office")!, fz = o.road - 3.3;
    pot(o.x - 2.1, fz + 0.75); pot(o.x + 2.1, fz + 0.75);
    const bx = o.x - o.w / 2 - 1.3;
    for (let i = 0; i < 3; i++) B.add(new THREE.TorusGeometry(0.32, 0.04, 4, 10, Math.PI), "#8C93A8", { p: [bx - 0.6 + i * 0.6, 0, fz + 1.1] });
    B.add(new THREE.BoxGeometry(1.6, 0.05, 0.05), "#8C93A8", { p: [bx, 0.15, fz + 1.1] });
    boxes.push({ x0: bx - 0.9, z0: fz + 0.95, x1: bx + 0.9, z1: fz + 1.25 });
    mailbox(o.x + o.w / 2 + 0.7, fz + 1.4, "#3D7BF5");
    lamp(o.x + o.w / 2 + 2.6, fz + 1.7);
    bench(-38.6, fz + 1.1, 0); signpost(-34.1, fz + 1.4, "#F7867A", "#5B5BD6");
    rock(-33.2, fz + 0.4, 1); rock(-32.7, fz + 0.9, 0.6);
  }
  // the bank: topiary pots, a cash machine, bench + lamp towards the market
  {
    const b = BUILDINGS.find((x) => x.id === "bank")!, fz = b.road - 3.3;
    pot(b.x - b.w / 2 - 0.75, fz + 0.9, "#4FA84A"); pot(b.x + b.w / 2 + 0.75, fz + 0.9, "#4FA84A");
    const ax = b.x - b.w / 2 - 1.1;
    B.add(rbox(0.8, 1.5, 0.55, 0.08), "#5B5BD6", { p: [ax, 0.75, fz - 0.5] });
    W.add(new THREE.BoxGeometry(0.5, 0.36, 0.05), "#BFD8FF", { p: [ax, 1.12, fz - 0.21] }, 0, 0.02);
    B.add(new THREE.BoxGeometry(0.5, 0.06, 0.2), "#FFC93C", { p: [ax, 0.8, fz - 0.15] });
    boxes.push({ x0: ax - 0.45, z0: fz - 0.8, x1: ax + 0.45, z1: fz - 0.2 });
    bench(b.x - b.w / 2 - 3.1, fz + 1.0, 0); lamp(b.x - b.w / 2 - 4.8, fz + 1.4);
  }
  // the market: fruit crates either side of the door, a produce cart
  {
    const m = BUILDINGS.find((x) => x.id === "market")!, fz = m.road - 3.3;
    for (const [dx, f1, f2] of [[-2.2, "#FF9F5A", "#E5484D"], [2.2, "#8BD35A", "#FFC93C"]] as [number, string, string][]) {
      crate(m.x + dx - 0.3, fz + 0.75, f1); crate(m.x + dx + 0.5, fz + 0.75, f2); crate(m.x + dx + 0.1, fz + 0.75, f1, 0.43);
      boxes.push({ x0: m.x + dx - 0.75, z0: fz + 0.4, x1: m.x + dx + 0.95, z1: fz + 1.1 });
    }
    const cx = m.x - m.w / 2 - 1.5, cz = fz + 0.9;
    B.add(rbox(1.5, 0.5, 0.9, 0.05), "#C98B5E", { p: [cx, 0.65, cz] });
    for (const sx of [-0.5, 0.5]) B.add(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 10), P.pole, { p: [cx + sx, 0.3, cz + 0.48], r: [Math.PI / 2, 0, 0] });
    B.add(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 4), P.trunk, { p: [cx - 0.95, 0.5, cz], r: [0, 0, 1.1] });
    for (let i = 0; i < (rich ? 8 : 3); i++) B.add(new THREE.IcosahedronGeometry(0.16, 0), ["#E5484D", "#FFC93C", "#8BD35A", "#FF9F5A"][i % 4], { p: [cx - 0.5 + (i % 4) * 0.33, 0.98, cz - 0.18 + Math.floor(i / 4) * 0.36] }, 0, 0.08);
    boxes.push({ x0: cx - 1.1, z0: cz - 0.5, x1: cx + 0.8, z1: cz + 0.6 });
  }
  // the crisis museum: a bronze bull on a plinth, queue posts with a red rope
  {
    const m = BUILDINGS.find((x) => x.id === "museum")!, fz = m.road - 3.3, sx = m.x + m.w / 2 + 1.25, sz = fz + 0.8;
    B.add(rbox(1.3, 0.8, 1.3, 0.06), "#E9E1D2", { p: [sx, 0.4, sz] });
    B.add(rbox(1.4, 0.1, 1.4, 0.04), "#C9B8A3", { p: [sx, 0.82, sz] });
    const br = "#9C6A36", th = -0.9, dx = Math.cos(th), dz = -Math.sin(th), px = Math.sin(th), pz = Math.cos(th); // bronze bull (the stock market's symbol), head towards the camera
    const along = (k: number, side: number, y: number): V3 => [sx + dx * k + px * side, y, sz + dz * k + pz * side];
    B.add(rbox(1.25, 0.6, 0.66, 0.24, 2), br, { p: along(0, 0, 1.42), r: [0, th, 0.08] });
    B.add(rbox(0.5, 0.46, 0.46, 0.18, 2), br, { p: along(0.72, 0, 1.6), r: [0, th, -0.25] });
    for (const sd of [-1, 1]) B.add(new THREE.ConeGeometry(0.07, 0.5, 5), "#F3E2B3", { p: along(0.78, sd * 0.3, 1.92), r: [sd * 0.9 * pz, 0, -sd * 0.9 * px] });
    B.add(new THREE.CylinderGeometry(0.04, 0.02, 0.5, 4), br, { p: along(-0.75, 0, 1.45), r: [0, th, 0.9] }); // tail
    for (const [k, sd] of [[-0.42, -0.2], [-0.42, 0.2], [0.42, -0.2], [0.42, 0.2]]) B.add(new THREE.CylinderGeometry(0.09, 0.07, 0.48, 5), br, { p: along(k, sd, 1.06) });
    circles.push({ x: sx, z: sz, r: 0.8 }); blobs.push({ x: sx, z: sz + 0.2, rx: 1 });
    // a red carpet to the door, brass lanterns either side, a potted palm and a poster easel for the open rooms
    const front = m.z! + m.d / 2, cp = new THREE.PlaneGeometry(1.25, 2.3, 1, 3); cp.rotateX(-Math.PI / 2);
    B.add(cp, "#B8323A", { p: [m.x, 0.3, front + 1.2] }, 0, 0.02);
    for (const side of [-1, 1]) {
      const lx = m.x + side * (m.w / 2 + 0.45), lz = front + 1.55;
      B.add(new THREE.CylinderGeometry(0.06, 0.09, 1.9, 6), "#4A3A30", { p: [lx, 0.95, lz] });
      B.add(new THREE.CylinderGeometry(0.2, 0.16, 0.08, 6), "#D4A72C", { p: [lx, 1.92, lz] });
      W.add(rbox(0.3, 0.38, 0.3, 0.05), P.lamp, { p: [lx, 2.15, lz] }, 0, 0.02);
      B.add(new THREE.ConeGeometry(0.26, 0.2, 6), "#D4A72C", { p: [lx, 2.44, lz] });
      circles.push({ x: lx, z: lz, r: 0.22 }); extraLamps.push([lx, lz + 0.05]);
    }
    pot(m.x - m.w / 2 - 1.2, fz + 0.75, P.pine);
    const ex = m.x - 2.1, ez = fz + 1.45; // poster easel
    for (const t of [-0.22, 0.22]) B.add(rbox(0.9, 1.25, 0.06, 0.02), "#6B4A36", { p: [ex, 0.62, ez + t * 0.6], r: [t, 0, 0] });
    signs.push({ id: "poster", x: ex, y: 0.78, z: ez + 0.175, w: 0.76, h: 0.95, bg: "#F4ECDD", fg: "#5A3A2C", rx: 0.22 });
    circles.push({ x: ex, z: ez, r: 0.4 });
    for (const side of [-1, 1]) {
      const x0 = m.x + side * 1.3, x1 = m.x + side * 2.9, z = fz + 1.95;
      for (const x of [x0, x1]) { B.add(new THREE.CylinderGeometry(0.05, 0.08, 0.85, 6), "#D4A72C", { p: [x, 0.42, z] }); B.add(new THREE.SphereGeometry(0.08, 6, 4), "#D4A72C", { p: [x, 0.88, z] }); }
      B.add(new THREE.CylinderGeometry(0.03, 0.03, Math.abs(x1 - x0), 4), "#C0392B", { p: [(x0 + x1) / 2, 0.72, z], r: [0, 0, Math.PI / 2] });
      boxes.push({ x0: Math.min(x0, x1) - 0.1, z0: z - 0.1, x1: Math.max(x0, x1) + 0.1, z1: z + 0.1 });
    }
  }
  // your milk-tea shop: café tables, menu board, bin, bench + signpost towards the plaza
  {
    const sh = BUILDINGS.find((x) => x.id === "shop")!, fz = sh.road - 3.3;
    cafe(sh.x - sh.w / 2 - 1.4, fz + 1.0, "#F5A524", "#FFFFFF"); cafe(sh.x + sh.w / 2 + 1.6, fz + 1.0, "#FF8FA3", "#FFFFFF");
    const mx = sh.x + 1.9, mz = fz + 1.55; // A-frame menu board
    for (const t of [-0.22, 0.22]) B.add(rbox(0.6, 0.8, 0.06, 0.02), "#C98B5E", { p: [mx, 0.4, mz + t * 0.5], r: [t, 0, 0] });
    B.add(new THREE.BoxGeometry(0.48, 0.62, 0.02), "#3E4A45", { p: [mx, 0.42, mz + 0.15], r: [0.22, 0, 0] }, 0, 0.01); // chalkboard
    B.add(new THREE.BoxGeometry(0.34, 0.05, 0.02), "#FFFFFF", { p: [mx, 0.58, mz + 0.13], r: [0.22, 0, 0] }, 0, 0.01);
    B.add(new THREE.BoxGeometry(0.26, 0.05, 0.02), "#FFC93C", { p: [mx, 0.44, mz + 0.16], r: [0.22, 0, 0] }, 0, 0.01);
    B.add(new THREE.BoxGeometry(0.3, 0.05, 0.02), "#FF8FA3", { p: [mx, 0.3, mz + 0.19], r: [0.22, 0, 0] }, 0, 0.01);
    circles.push({ x: mx, z: mz, r: 0.3 });
    bin(sh.x + sh.w / 2 + 3.3, fz + 1.7);
    bench(3.4, fz + 1.1, 0); lamp(5.4, fz + 1.6); signpost(1.9, fz + 1.4, "#F5A524", "#2FAE73");
    pot(sh.x - 1.6, fz + 0.75, P.leaf);
  }
  // low hedges, flower beds and rocks along the roadside south of the two demo streets (open meadow stays open)
  for (const [x0, x1] of [[-45, -40], [-33, -27.5], [-24, -18.5], [-11, -6], [4, 8.5], [15.5, 21]] as [number, number][]) hedge(x0, x1, ROADS[2][1] + 2.1);
  for (const [x0, x1] of [[-45.5, -40.5], [-33, -29], [-22, -17.5], [-12.5, -8.5]] as [number, number][]) hedge(x0, x1, ROADS[0][1] + 2.4);
  if (rich) for (const [x, z] of [[-37.5, 26.2], [-25.5, 26.6], [-15.6, 26.3], [-4.4, 26.4], [11.5, 26.1], [23.5, 26.4], [-38.5, 7.1], [-26.8, 7.3], [-14.8, 7.0], [-6.5, 7.2]] as [number, number][]) { rock(x, z, 0.9 + rnd() * 0.5); rock(x + 0.6, z + 0.3, 0.5); posy(x + 0.4, z - 0.3, 0, FLW[Math.floor(rnd() * 5)], 4, 1, 0.6); }

  /* ---- harbour: pier, cranes, containers, a ship, buoys ---- */
  {
    const pz = SEA_Z; // pier from the beach into the sea
    B.add(rbox(3, 0.3, 12, 0.08), "#C98B5E", { p: [30, 0.35, pz - 5] });
    for (let i = 0; i < 6; i++) for (const sx of [-1.3, 1.3]) B.add(new THREE.CylinderGeometry(0.15, 0.15, 1.6, 6), "#8A5A44", { p: [30 + sx, -0.4, pz - 0.5 - i * 2.1] });
    // ship moored next to the pier
    B.add(rbox(4, 1.6, 11, 0.6, 2), "#3D5AFE", { p: [35.5, 0.4, pz - 7] });
    B.add(rbox(4.1, 0.35, 11.1, 0.15), "#FFFFFF", { p: [35.5, 1.15, pz - 7] });
    B.add(rbox(3, 1.8, 3, 0.2), "#FFFFFF", { p: [35.5, 2.2, pz - 10] });
    B.add(new THREE.CylinderGeometry(0.45, 0.5, 1.6, 8), "#E5484D", { p: [35.5, 3.8, pz - 10.5] });
    for (let i = 0; i < 4; i++) B.add(rbox(1.6, 1, 2.4, 0.06), ["#F5A524", "#2FAE73", "#E5484D", "#1BB0C2"][i], { p: [35.5 + (i % 2 ? 0.85 : -0.85), 1.85 + (i > 1 ? 1 : 0), pz - 4.5] });
    // cranes on the quay
    for (const cx of [20, 25]) {
      for (const sx of [-0.8, 0.8]) B.add(new THREE.BoxGeometry(0.25, 6, 0.25), "#F5A524", { p: [cx + sx, 3, pz + 2] });
      B.add(new THREE.BoxGeometry(2, 0.35, 0.4), "#F5A524", { p: [cx, 6, pz + 2] });
      B.add(new THREE.BoxGeometry(0.4, 0.4, 8), "#F5A524", { p: [cx, 6.3, pz - 1] });
      B.add(new THREE.BoxGeometry(0.05, 2.5, 0.05), P.pole, { p: [cx, 4.9, pz - 3.5] });
      B.add(rbox(1.2, 0.9, 2.2, 0.05), cx === 20 ? "#E5484D" : "#1BB0C2", { p: [cx, 3.2, pz - 3.5] });
      circles.push({ x: cx - 0.8, z: pz + 2, r: 0.4 }, { x: cx + 0.8, z: pz + 2, r: 0.4 });
    }
    // container stack on the quay
    const CC = ["#E5484D", "#2FAE73", "#1BB0C2", "#F5A524", "#8B6CF0", "#3D7BF5"];
    for (let i = 0; i < 6; i++) B.add(rbox(2.6, 1.15, 1.2, 0.05), CC[i], { p: [-6 + (i % 3) * 2.8, 0.58 + (i > 2 ? 1.17 : 0), SEA_Z + 2.4] });
    boxes.push({ x0: -7.5, z0: SEA_Z + 1.7, x1: 0, z1: SEA_Z + 3.1 });
    for (const [bx, bz, c] of [[6, -48, "#E5484D"], [-14, -50, "#FFC93C"], [44, -52, "#E5484D"]] as [number, number, string][]) B.add(new THREE.ConeGeometry(0.4, 0.9, 6), c, { p: [bx, 0.3, bz] }, 0.3);
    blobs.push({ x: 35.5, z: pz - 7, rx: 2.6, rz: 6 });
  }

  /* ---- street lamps along the roads (glass heads glow at night) ---- */
  const lamps: [number, number][] = [...extraLamps];
  for (const [x0, z0, x1, z1, w] of ROADS) {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(len / 13), ux = (x1 - x0) / len, uz = (z1 - z0) / len;
    for (let i = 1; i < n; i++) {
      const k = (i * len) / n, x = x0 + ux * k - uz * (w / 2 + 0.5), z = z0 + uz * k + ux * (w / 2 + 0.5);
      if (Math.hypot(x - PLAZA[0], z - PLAZA[1]) < 7.5 || x > 46 || x < -46) continue;
      if (BUILDINGS.some((b) => Math.abs(x - b.x) < b.w / 2 + 1.2 && z > b.z! - b.d / 2 - 0.5 && z < b.road + 3)) continue;
      if (boxes.some((b) => x > b.x0 - 0.5 && x < b.x1 + 0.5 && z > b.z0 - 0.5 && z < b.z1 + 0.5) || Math.hypot(x - POND.x, z - POND.z) < POND.r + 1) continue;
      lamps.push([x, z]);
    }
  }
  for (const [x, z] of lamps) {
    B.add(new THREE.CylinderGeometry(0.07, 0.11, 2.8, 6), P.pole, { p: [x, 1.4, z] });
    B.add(new THREE.ConeGeometry(0.32, 0.28, 6), P.pole, { p: [x, 3.0, z] });
    W.add(new THREE.IcosahedronGeometry(0.22, 1), P.lamp, { p: [x, 2.78, z] }, 0, 0.02);
    circles.push({ x, z, r: 0.25 });
  }

  /* ---- trees, bushes, flowers, grass (kept off roads, buildings, the plaza and the beach) ----
   * Faces the high camera never sees (trunk caps, the undersides of pine tiers and grass blades) are left open:
   * there are hundreds of each, and the triangles go to the street details instead. */
  const nearRoad = (x: number, z: number, r: number) => {
    for (const [ax, az, bx, bz, w] of allPaths) {
      const vx = bx - ax, vz = bz - az, L = vx * vx + vz * vz || 1, k = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / L));
      if (Math.hypot(x - ax - vx * k, z - az - vz * k) < w / 2 + 0.6 + r) return true;
    }
    return false;
  };
  const inside = (x: number, z: number) => x > bounds.x0 && x < bounds.x1 && z > bounds.z0 && z < bounds.z1;
  /* the camera looks north from the south: nothing tall just south of a road (it would hide you), and the strip
     south of the last road stays open meadow */
  const blocksView = (x: number, z: number) => z > 24.5 && z < 36 || ROADS.some(([x0, z0, x1, z1]) => z0 === z1 && z > z0 && z < z0 + 7 && x > Math.min(x0, x1) - 2 && x < Math.max(x0, x1) + 2);
  const free = (x: number, z: number, r: number) => {
    if (z < SEA_Z + 5 + r) return false;
    if (Math.hypot(x - PLAZA[0], z - PLAZA[1]) < 7 + r) return false;
    if (!inside(x, z)) return true; // beyond the edge: forest ring
    for (const b of boxes) if (x > b.x0 - r - 1.2 && x < b.x1 + r + 1.2 && z > b.z0 - r - 1.2 && z < b.z1 + r + 1.6) return false;
    for (const c of circles) if (Math.hypot(x - c.x, z - c.z) < c.r + r + 0.3) return false;
    if (BUILDINGS.some((b) => Math.abs(x - b.x) < b.w / 2 + r + 1 && z > b.z! && z < b.road + 2)) return false; // keep the front yards open
    return !nearRoad(x, z, r);
  };
  const cliffTop = (x: number, z: number) => ((x < -56 || x > 56) && z > -30 && z < 40 ? 4.4 : x < -50 || x > 50 || z > 32 ? 2.4 : 0);
  const tree = (x: number, z: number, kind: number, s: number) => {
    const y0 = cliffTop(x, z);
    if (kind === 0) { // round, tiered crown
      B.add(new THREE.CylinderGeometry(0.2 * s, 0.28 * s, 1.3 * s, 6, 1, true), P.trunk, { p: [x, y0 + 0.65 * s, z] });
      const leaf = [P.leaf, P.leaf2, P.leaf3][Math.floor(rnd() * 3)];
      B.add(new THREE.IcosahedronGeometry(1.25 * s, 1), leaf, { p: [x, y0 + 2.0 * s, z], s: [1, 0.92, 1] }, 1);
      B.add(new THREE.IcosahedronGeometry(0.8 * s, 1), leaf, { p: [x + 0.25 * s, y0 + 2.85 * s, z - 0.1 * s] }, 1.2);
      if (rnd() < 0.35) for (let i = 0; i < 4; i++) { const a = rnd() * 6.28; B.add(new THREE.IcosahedronGeometry(0.12 * s, 0), "#FF7A6B", { p: [x + Math.cos(a) * 1.05 * s, y0 + 2 * s + (rnd() - 0.3) * 0.8 * s, z + Math.sin(a) * 1.05 * s] }, 1); }
    } else if (kind === 1) { // pine, stacked cones
      B.add(new THREE.CylinderGeometry(0.16 * s, 0.22 * s, 0.9 * s, 6, 1, true), P.trunk, { p: [x, y0 + 0.45 * s, z] });
      for (let i = 0; i < 3; i++) B.add(new THREE.ConeGeometry((1.3 - i * 0.32) * s, 1.3 * s, 7, 1, true), P.pine, { p: [x, y0 + (1.25 + i * 0.75) * s, z], r: [0, rnd(), 0] }, 0.6 + i * 0.4);
    } else { // palm on the beach side
      for (let i = 0; i < 4; i++) B.add(new THREE.CylinderGeometry(0.14 * s, 0.17 * s, 0.75 * s, 6), P.trunk, { p: [x + i * 0.08 * s, y0 + (0.37 + i * 0.72) * s, z], r: [0, 0, -0.08 * i] });
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; B.add(new THREE.BoxGeometry(1.7 * s, 0.06, 0.45 * s), P.leaf2, { p: [x + 0.3 * s + Math.cos(a) * 0.75 * s, y0 + 3 * s - 0.2 * s, z + Math.sin(a) * 0.75 * s], r: [0, -a, -0.35] }, 1.2); }
    }
    if (inside(x, z)) circles.push({ x, z, r: 0.45 * s });
    blobs.push({ x: x + 0.2, z: z + 0.25, rx: 1.35 * s });
  };
  const freeTall = (x: number, z: number, r: number) => !blocksView(x, z) && free(x, z, r);
  const treeN = potato ? 150 : 300;
  for (let i = 0, tries = 0; i < treeN && tries < 8000; tries++) {
    const ring = rnd() < 0.5; // dense ring around the edge, sparser inside
    let x: number, z: number;
    if (ring) { x = (rnd() * 2 - 1) * 60; z = -36 + rnd() * 78; if (inside(x, z) && rnd() < 0.85) continue; }
    else { x = (rnd() * 2 - 1) * 46; z = SEA_Z + 4 + rnd() * (bounds.z1 - SEA_Z - 4); }
    const s = 0.85 + rnd() * 0.45;
    if (!freeTall(x, z, 1.3 * s)) continue;
    tree(x, z, z < SEA_Z + 12 && rnd() < 0.6 ? 2 : rnd() < 0.3 ? 1 : 0, s); i++;
  }
  for (const [x, z] of [[-44, -34], [-30, -35], [-20, -36], [6, -35], [42, -35]] as [number, number][]) if (freeTall(x, z, 0.8)) tree(x, z, 2, 1); // palms on the beach
  for (let i = 0, tries = 0; i < (potato ? 40 : 90) && tries < 3000; tries++) {
    const x = (rnd() * 2 - 1) * 46, z = SEA_Z + 5 + rnd() * (bounds.z1 - SEA_Z - 6);
    if (!free(x, z, 0.7)) continue;
    B.add(new THREE.IcosahedronGeometry(0.6, 1), P.leaf2, { p: [x, 0.4, z], s: [1.2, 0.8, 1] }, 0.4);
    B.add(new THREE.IcosahedronGeometry(0.42, 1), P.leaf, { p: [x + 0.45, 0.35, z + 0.15], s: [1.1, 0.8, 1] }, 0.4);
    blobs.push({ x, z: z + 0.1, rx: 1 }); circles.push({ x: x + 0.2, z, r: 0.7 }); i++;
  }
  const FL = ["#FF8FA3", "#FFFFFF", "#FFC93C", "#B39DFF", "#FF7A6B"];
  for (let p = 0, tries = 0; p < (potato ? 22 : 60) && tries < 2000; tries++) {
    const cx = (rnd() * 2 - 1) * 46, cz = SEA_Z + 6 + rnd() * (bounds.z1 - SEA_Z - 6), col = FL[Math.floor(rnd() * FL.length)];
    if (!free(cx, cz, 1)) continue;
    p++;
    for (let i = 0; i < 9; i++) {
      const x = cx + (rnd() - 0.5) * 2.6, z = cz + (rnd() - 0.5) * 2.6;
      flower(x, 0.02, z, col);
    }
  }
  for (let i = 0; i < (potato ? 140 : 520); i++) {
    const x = (rnd() * 2 - 1) * 52, z = SEA_Z + 5 + rnd() * 40;
    if (!free(x, z, 0.2)) continue;
    for (let k = 0; k < 3; k++) B.add(new THREE.ConeGeometry(0.07, 0.38, 3, 1, true), rnd() < 0.5 ? P.grass2 : P.leaf2, { p: [x + (k - 1) * 0.12, 0.17, z + (rnd() - 0.5) * 0.15], r: [(k - 1) * 0.3, 0, (k - 1) * 0.35] }, 0.8);
  }

  /* ---- sea: one subdivided plane, gentle waves in the vertex shader ---- */
  const wg = new THREE.PlaneGeometry(GX * 2 + 40, 60, 60, 30); wg.rotateX(-Math.PI / 2); wg.translate(0, -0.12, SEA_Z - 30 + 0.4);
  const wm = new THREE.MeshLambertMaterial({ color: "#6CCBEF", transparent: true, opacity: 0.88, flatShading: true });
  bend(wm);
  const prev = wm.onBeforeCompile;
  wm.onBeforeCompile = (sh, r) => { prev(sh, r); sh.vertexShader = sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n{ vec4 wp0 = modelMatrix * vec4(position, 1.); transformed.y += sin(wp0.x * 0.55 + uTime * 1.3) * 0.07 + cos(wp0.z * 0.7 + uTime * 0.9) * 0.06; }"); };
  wm.customProgramCacheKey = () => "sea";
  const water = new THREE.Mesh(wg, wm); water.frustumCulled = false;
  // pond (same wavy water) + rock hill with a spring on top, two waterfalls with a scrolling texture, foam
  {
    const H = HILL;
    B.add(rbox(H.x1 - H.x0, H.h1, H.z1 - H.z0, 0.35, 2), P.cliff, { p: [(H.x0 + H.x1) / 2, H.h1 / 2 - 0.05, (H.z0 + H.z1) / 2] }, 0, 0.06);
    B.add(rbox(H.x1 - H.x0 + 0.2, 0.3, H.z1 - H.z0 + 0.2, 0.12), P.cliffTop, { p: [(H.x0 + H.x1) / 2, H.h1 + 0.08, (H.z0 + H.z1) / 2] }, 0, 0.05);
    B.add(rbox(H.x3 - H.x2, H.h2, H.z2 - H.z0, 0.35, 2), P.cliff, { p: [(H.x2 + H.x3) / 2, H.h2 / 2 - 0.05, (H.z0 + H.z2) / 2] }, 0, 0.06);
    B.add(rbox(H.x3 - H.x2 + 0.2, 0.3, H.z2 - H.z0 + 0.2, 0.12), P.cliffTop, { p: [(H.x2 + H.x3) / 2, H.h2 + 0.08, (H.z0 + H.z2) / 2] }, 0, 0.05);
    for (const [x, y, z, s2] of [[13.8, H.h1 + 0.3, 7.4, 0.8], [22.2, H.h1 + 0.3, 6.8, 0.7], [16.2, H.h2 + 0.3, 6.2, 0.6]] as number[][]) {
      B.add(new THREE.IcosahedronGeometry(0.7 * s2, 1), P.leaf2, { p: [x, y, z], s: [1.2, 0.8, 1] }, 0.4);
    }
    const pg = new THREE.CircleGeometry(POND.r + 0.15, 28); pg.rotateX(-Math.PI / 2); pg.translate(POND.x, -0.08, POND.z);
    const s1 = new THREE.PlaneGeometry(FALL_W, H.z1 - H.z2 + 0.1, 1, 2); s1.rotateX(-Math.PI / 2); s1.translate(POND.x, H.h1 + 0.25, (H.z1 + H.z2) / 2);
    const s2 = new THREE.PlaneGeometry(FALL_W * 0.9, H.z2 - H.z0 - 0.3, 1, 2); s2.rotateX(-Math.PI / 2); s2.translate(POND.x, H.h2 + 0.25, (H.z0 + H.z2) / 2 + 0.15);
    for (const g of [pg, s1, s2]) { const m = new THREE.Mesh(g, wm); m.frustumCulled = false; group.add(m); }
    const fc = document.createElement("canvas"); fc.width = 32; fc.height = 64;
    const fx = fc.getContext("2d")!; fx.fillStyle = "#8FDCF5"; fx.fillRect(0, 0, 32, 64);
    for (let i = 0; i < 14; i++) { fx.fillStyle = `rgba(255,255,255,${0.35 + (i % 3) * 0.2})`; fx.fillRect((i * 7) % 30, (i * 13) % 64, 2 + (i % 2), 10 + (i % 4) * 4); }
    const ft = new THREE.CanvasTexture(fc); ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(1.5, 1); ft.colorSpace = THREE.SRGBColorSpace;
    fallTex = ft;
    const fm = bend(new THREE.MeshBasicMaterial({ map: ft, transparent: true, opacity: 0.93 }));
    for (const [fz, y0, y1, fw] of [[H.z1, -0.1, H.h1 + 0.25, FALL_W], [H.z2, H.h1 + 0.2, H.h2 + 0.25, FALL_W * 0.9]]) {
      const g = new THREE.PlaneGeometry(fw, y1 - y0, 1, 3); g.translate(POND.x, (y0 + y1) / 2, fz + 0.07);
      const m = new THREE.Mesh(g, fm); m.frustumCulled = false; group.add(m);
      for (let i = 0; i < 5; i++) B.add(new THREE.IcosahedronGeometry(0.2 + (i % 2) * 0.1, 0), "#FFFFFF", { p: [POND.x - 0.6 + i * 0.3, y0 + 0.14, fz + 0.35 + (i % 3) * 0.15] }, 0.4, 0.02);
    }
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; if (Math.sin(a) < -0.55) continue; B.add(new THREE.IcosahedronGeometry(0.32 + ((i * 7) % 3) * 0.08, 0), P.stone, { p: [POND.x + Math.cos(a) * (POND.r + 0.25), 0.05, POND.z + Math.sin(a) * (POND.r + 0.25)], s: [1, 0.6, 1] }); }
    for (let i = 0; i < 3; i++) B.add(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 8), "#6CC15A", { p: [POND.x - 1.6 + i * 1.5, -0.02, POND.z + 0.8 + (i % 2) * 0.9] }); // lily pads
    blobs.push({ x: (H.x0 + H.x1) / 2, z: H.z1 + 0.3, rx: (H.x1 - H.x0) / 2 + 0.6, rz: 1.6 });
  }


  /* ---- name boards: one canvas atlas (64-px rows) + one mesh; repainted when the language changes ---- */
  const atlas = document.createElement("canvas"); atlas.width = 512; atlas.height = 64 * signs.length;
  const signTex = new THREE.CanvasTexture(atlas); signTex.colorSpace = THREE.SRGBColorSpace; signTex.anisotropy = 4;
  const signMat = bend(new THREE.MeshLambertMaterial({ map: signTex, emissive: new THREE.Color("#FFFFFF"), emissiveMap: signTex, emissiveIntensity: 0 }));
  {
    const parts = signs.map((sg, i) => {
      const g = new THREE.PlaneGeometry(sg.w, sg.h, 3, 1), uv = g.getAttribute("uv") as THREE.BufferAttribute;
      for (let k = 0; k < uv.count; k++) uv.setY(k, 1 - (i + 1 - uv.getY(k)) / signs.length);
      if (sg.rx) g.rotateX(-sg.rx);
      g.translate(sg.x, sg.y, sg.z); return g;
    });
    const m = new THREE.Mesh(mergeGeometries(parts, false)!, signMat); m.frustumCulled = false; group.add(m);
    parts.forEach((g) => g.dispose());
  }
  const drawSigns = (lg: "vi" | "en") => {
    const x = atlas.getContext("2d")!;
    signs.forEach((sg, i) => {
      const y0 = i * 64, stretch = (sg.w / sg.h) / 8; // the row is 8:1; the board may be wider/narrower — draw text pre-squeezed
      x.save(); x.beginPath(); x.rect(0, y0, 512, 64); x.clip();
      x.fillStyle = sg.bg; x.fillRect(0, y0, 512, 64);
      if (sg.id === "poster") { // museum poster: "1929 · 1997", the rooms you can play
        x.translate(256, y0 + 32); x.scale(1 / stretch, 1); x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = sg.fg;
        x.font = "900 26px Nunito, sans-serif"; x.fillText("1929", 0, -12); x.font = "900 13px Nunito, sans-serif"; x.fillText(lg === "vi" ? "PHÒNG MỞ CỬA" : "ROOMS OPEN", 0, 6); x.fillText("1997", 0, 20);
      } else {
        x.strokeStyle = "rgba(255,255,255,.55)"; x.lineWidth = 3; x.strokeRect(5, y0 + 5, 502, 54);
        const txt = tx2(SIGN[sg.id], lg);
        x.translate(256, y0 + 33); x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = sg.fg;
        let fs = 50; x.font = `900 ${fs}px Nunito, sans-serif`;
        const maxW = 470 * stretch; // measured in squeezed units
        while (x.measureText(txt).width > maxW && fs > 16) { fs -= 2; x.font = `900 ${fs}px Nunito, sans-serif`; }
        x.scale(1 / stretch, 1); x.fillText(txt, 0, 0);
      }
      x.restore();
    });
    signTex.needsUpdate = true;
  };

  /* ---- assemble ---- */
  group.add(B.build(sceneryMat()));
  const windows = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, emissive: new THREE.Color("#000000") });
  group.add(W.build(bend(windows, true)));
  group.add(water);
  group.add(blobMesh(blobs));
  const pools = blobMesh(lamps.map(([x, z]) => ({ x, z, rx: 2.4 })));
  const lampGlow = new THREE.MeshBasicMaterial({ map: glowTex(), color: "#FFD98A", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  pools.material = bend(lampGlow); pools.position.y = 0.01; pools.renderOrder = 2;
  group.add(pools);
  // NPC waypoints: road ends and crossings, inside the walkable area
  const nodes: [number, number][] = [];
  const addN = (x: number, z: number) => { if (Math.hypot(x - PLAZA[0], z - PLAZA[1]) < 6) { for (const [dx, dz] of [[6.8, 0], [-6.8, 0], [0, 6.8], [0, -6.8]]) addN(PLAZA[0] + dx, PLAZA[1] + dz); return; } if (inside(x, z) && !nodes.some(([a, b]) => Math.hypot(a - x, b - z) < 3)) nodes.push([x, z]); };
  for (const [x0, z0, x1, z1] of ROADS) { addN(x0, z0); addN(x1, z1); addN((x0 + x1) / 2, (z0 + z1) / 2); }
  for (const xs of [-36, 0, 32]) for (const zs of [-31, -18, 4, 23.5]) addN(xs, zs);
  return { group, boxes, circles, doors, bounds, spawn: [home.x, home.z! + home.d / 2 + 1.6], nodes, roads: allPaths, buildings: BUILDINGS, zones: ZONES, seaZ: SEA_Z, windows, water, ticker, lampGlow, fall: fallTex, signs: { mat: signMat, draw: drawSigns } };
}
