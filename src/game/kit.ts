/* ---------- Low-poly toolkit for the town (design doc 13.3) ----------
 * Everything in the town is built from primitive shapes in code (no downloaded models → no licence questions,
 * colours easy to change). Static scenery is merged into ONE vertex-coloured mesh per material, so the whole town
 * is a handful of draw calls even on a weak phone.
 * bend() patches a material with the "rolled-up world" (ground curving down in the distance) + wind sway. */
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Shared uniforms: time (wind, water), curve strength (0 = flat), wind on/off (Potato / reduced motion). */
export const U = { time: { value: 0 }, curve: { value: 0.0042 }, wind: { value: 1 } };

/** Curved world: in view space, everything further than BEND_NEAR from the camera drops by k·d² (the
 * Animal-Crossing-like horizon). wind: vertices with aSway > 0 sway (tree crowns, grass, flowers). */
const BEND_NEAR = 16;
export function bend<M extends THREE.Material>(m: M, wind = false): M {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = U.time; sh.uniforms.uCurve = U.curve; sh.uniforms.uWind = U.wind;
    sh.vertexShader = `uniform float uTime;\nuniform float uCurve;\nuniform float uWind;\n${wind ? "attribute float aSway;\n" : ""}` + sh.vertexShader.replace("#include <project_vertex>", `
      vec4 mvPosition = vec4( transformed, 1.0 );
      #ifdef USE_INSTANCING
        mvPosition = instanceMatrix * mvPosition;
      #endif
      ${wind ? `{ vec4 wp = modelMatrix * mvPosition; float s = aSway * uWind;
        mvPosition.x += s * sin(uTime * 1.7 + wp.x * 0.37 + wp.z * 0.23) * 0.07;
        mvPosition.z += s * cos(uTime * 1.3 + wp.x * 0.19 - wp.z * 0.31) * 0.05; }` : ""}
      mvPosition = modelViewMatrix * mvPosition;
      float bz = max(0., -mvPosition.z - ${BEND_NEAR.toFixed(1)});
      mvPosition.y -= bz * bz * uCurve;
      gl_Position = projectionMatrix * mvPosition;`);
  };
  m.customProgramCacheKey = () => "bend" + (wind ? "w" : "");
  return m;
}

const lamb = new Map<string, THREE.MeshLambertMaterial>();
/** Flat-shaded, curved-world material for a single colour (characters, moving things). Cached. */
export function mat(color: THREE.ColorRepresentation): THREE.MeshLambertMaterial {
  const k = new THREE.Color(color).getHexString();
  let m = lamb.get(k);
  if (!m) { m = bend(new THREE.MeshLambertMaterial({ color, flatShading: true })); lamb.set(k, m); }
  return m;
}

export type V3 = [number, number, number];
export interface Place { p?: V3; r?: V3; s?: V3 | number }
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3();
export function matrixOf(o?: Place) {
  const s = o?.s ?? 1;
  tmpP.set(...(o?.p ?? [0, 0, 0]));
  tmpQ.setFromEuler(tmpE.set(...(o?.r ?? [0, 0, 0])));
  if (typeof s === "number") tmpS.setScalar(s); else tmpS.set(...s);
  return tmpM.compose(tmpP, tmpQ, tmpS);
}

/** Collects coloured shapes and merges them into one mesh. Each triangle gets a tiny brightness jitter
 * (±jit) for the hand-made low-poly look. */
export class Builder {
  private parts: THREE.BufferGeometry[] = [];
  constructor(private rnd: () => number = Math.random) {}
  add(g: THREE.BufferGeometry, color: THREE.ColorRepresentation, at?: Place, sway = 0, jit = 0.05) {
    const geo = g.index ? g.toNonIndexed() : g.clone();
    g.dispose();
    for (const k of Object.keys(geo.attributes)) if (k !== "position" && k !== "normal") geo.deleteAttribute(k);
    geo.applyMatrix4(matrixOf(at));
    const n = geo.getAttribute("position").count, c = new THREE.Color(color), col = new Float32Array(n * 3), sw = new Float32Array(n);
    for (let i = 0; i < n; i += 3) {
      const j = 1 + (this.rnd() - 0.5) * 2 * jit;
      for (let v = i; v < i + 3 && v < n; v++) { col[v * 3] = c.r * j; col[v * 3 + 1] = c.g * j; col[v * 3 + 2] = c.b * j; }
    }
    sw.fill(sway);
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSway", new THREE.BufferAttribute(sw, 1));
    this.parts.push(geo);
    return this;
  }
  /** Geometry that already has its own position/normal/color/aSway attributes (e.g. the ground). */
  addRaw(geo: THREE.BufferGeometry) { this.parts.push(geo); return this; }
  get empty() { return !this.parts.length; }
  build(material: THREE.Material): THREE.Mesh {
    const g = mergeGeometries(this.parts, false)!;
    this.parts.forEach((p) => p.dispose()); this.parts = [];
    const m = new THREE.Mesh(g, material);
    m.frustumCulled = false; // the curved world moves vertices after culling
    return m;
  }
}

/** Material for merged scenery: per-vertex colour + wind. */
export const sceneryMat = () => bend(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }), true);

/* ---- soft blob shadows (purple-blue, never black — 13.3) ---- */
let blobT: THREE.Texture | null = null;
export function blobTex() {
  if (blobT) return blobT;
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const x = c.getContext("2d")!, g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(70,60,140,0.55)"); g.addColorStop(0.6, "rgba(70,60,140,0.35)"); g.addColorStop(1, "rgba(70,60,140,0)");
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  blobT = new THREE.CanvasTexture(c);
  return blobT;
}
export function blobMat() {
  return bend(new THREE.MeshBasicMaterial({ map: blobTex(), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
}
/** A flat shadow disc (subdivided so it follows the curved ground). */
export const blobGeo = (rx: number, rz = rx) => { const g = new THREE.PlaneGeometry(rx * 2, rz * 2, 2, 2); g.rotateX(-Math.PI / 2); return g; };
/** All static shadows of the town in one mesh. */
export function blobMesh(list: { x: number; z: number; rx: number; rz?: number }[]) {
  const parts = list.map((b) => { const g = blobGeo(b.rx, b.rz ?? b.rx); g.translate(b.x, 0.03, b.z); return g; });
  const m = new THREE.Mesh(mergeGeometries(parts, false)!, blobMat());
  parts.forEach((p) => p.dispose());
  m.frustumCulled = false; m.renderOrder = 1;
  return m;
}
