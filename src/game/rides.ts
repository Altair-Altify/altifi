/* ---------- What you ride, parked in your garden (design doc 13.4) — built from shapes in code ---------- */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mat, blobGeo, blobMat } from "./kit";

const add = (g: THREE.Group, geo: THREE.BufferGeometry, color: string, p: [number, number, number], r: [number, number, number] = [0, 0, 0], s: [number, number, number] = [1, 1, 1]) => {
  const m = new THREE.Mesh(geo, mat(color)); m.position.set(...p); m.rotation.set(...r); m.scale.set(...s); m.frustumCulled = false; g.add(m); return m;
};
const wheel = (g: THREE.Group, r: number, tube: number, x: number, z: number, color = "#2E2A3A") => add(g, new THREE.TorusGeometry(r, tube, 6, 14), color, [x, r + tube, z], [0, Math.PI / 2, 0]);

/** Model of a ride, facing +z (south, towards the camera). null = walking / bus pass. */
export function makeRide(id: string): THREE.Group | null {
  const g = new THREE.Group();
  if (id === "bike") {
    wheel(g, 0.32, 0.04, 0, -0.55); wheel(g, 0.32, 0.04, 0, 0.55);
    add(g, new THREE.CylinderGeometry(0.035, 0.035, 1.05, 5), "#5AA9E6", [0, 0.55, 0], [Math.PI / 2 - 0.25, 0, 0]);
    add(g, new THREE.CylinderGeometry(0.035, 0.035, 0.55, 5), "#5AA9E6", [0, 0.62, -0.25], [0.3, 0, 0]);
    add(g, new RoundedBoxGeometry(0.16, 0.06, 0.26, 1, 0.03), "#3A2F28", [0, 0.9, -0.3]);
    add(g, new THREE.CylinderGeometry(0.03, 0.03, 0.5, 5), "#5B5470", [0, 0.92, 0.48], [0, 0, Math.PI / 2]);
    add(g, new RoundedBoxGeometry(0.3, 0.16, 0.22, 1, 0.04), "#FFC93C", [0, 0.82, 0.62]); // basket
  } else if (id === "scooter") {
    wheel(g, 0.26, 0.09, 0, -0.6); wheel(g, 0.26, 0.09, 0, 0.6);
    add(g, new RoundedBoxGeometry(0.5, 0.42, 1.0, 2, 0.15), "#FF8FA3", [0, 0.58, -0.15]);
    add(g, new RoundedBoxGeometry(0.42, 0.12, 0.6, 1, 0.05), "#3A2F28", [0, 0.86, -0.25]);
    add(g, new RoundedBoxGeometry(0.46, 0.9, 0.18, 2, 0.08), "#FF8FA3", [0, 0.75, 0.52], [-0.25, 0, 0]);
    add(g, new THREE.CylinderGeometry(0.035, 0.035, 0.7, 5), "#5B5470", [0, 1.22, 0.62], [0, 0, Math.PI / 2]);
    add(g, new THREE.SphereGeometry(0.09, 8, 6), "#FFF1B8", [0, 1.08, 0.66]);
  } else if (id === "carSmall" || id === "carSport") {
    const sport = id === "carSport", c = sport ? "#E5484D" : "#FFC93C", h = sport ? 0.55 : 0.75;
    for (const x of [-0.75, 0.75]) for (const z of [-1.1, 1.1]) wheel(g, 0.3, 0.13, x, z);
    add(g, new RoundedBoxGeometry(1.7, h, 3.5, 2, 0.25), c, [0, 0.35 + h / 2, 0]);
    add(g, new RoundedBoxGeometry(1.45, sport ? 0.45 : 0.65, sport ? 1.5 : 1.9, 2, 0.2), "#BDE7F5", [0, 0.35 + h + (sport ? 0.2 : 0.3), sport ? -0.2 : -0.15]);
    add(g, new RoundedBoxGeometry(1.5, 0.08, sport ? 1.3 : 1.7, 1, 0.04), c, [0, 0.35 + h + (sport ? 0.43 : 0.63), sport ? -0.2 : -0.15]);
    for (const x of [-0.55, 0.55]) add(g, new THREE.SphereGeometry(0.12, 8, 6), "#FFF1B8", [x, 0.35 + h * 0.6, 1.72]);
    if (sport) add(g, new RoundedBoxGeometry(1.6, 0.08, 0.35, 1, 0.03), "#2E2A3A", [0, 0.35 + h + 0.25, -1.6]);
  } else return null;
  const sh = new THREE.Mesh(blobGeo(id.startsWith("car") ? 1.2 : 0.55, id.startsWith("car") ? 2.1 : 0.9), blobMat()); sh.position.y = 0.035; sh.renderOrder = 1; sh.frustumCulled = false; g.add(sh);
  return g;
}
