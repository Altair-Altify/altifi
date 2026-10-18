/* ---------- Where everything sits in the Altair galaxy (design doc 13.1) ----------
 * The galaxy lies in the XZ plane (y = up), Altair at the origin. 3 spiral arms; each area (system) sits on an arm,
 * Macroeconomics closest to the centre (13.2e). Planets orbit their system's star; a planet may be hand-placed with planet.at. */
import { Vector3 } from "three";
import type { DomainId } from "../lesson/types";
import type { Domain } from "../content/domains";

export const ARMS = 3;
const TWIST = 0.95, BASE = -Math.PI / 2 - TWIST * Math.log(20 / 8);
/** Angle of spiral arm `arm` at radius r (logarithmic spiral). */
export const armAngle = (arm: number, r: number) => BASE + (arm * 2 * Math.PI) / ARMS + TWIST * Math.log(Math.max(r, 1) / 8);

/* 6 systems spread evenly outward along the 3 arms (13.1b-2): each arm holds 2, radii step 12 apart. */
const SYS: Record<DomainId, { arm: number; r: number }> = {
  macro: { arm: 0, r: 22 },
  personal: { arm: 1, r: 34 },
  corporate: { arm: 2, r: 46 },
  markets: { arm: 0, r: 58 },
  public: { arm: 1, r: 70 },
  intl: { arm: 2, r: 82 },
};
/** The whole galaxy is an ellipse stretched along z (= screen vertical) so it fills a portrait phone screen. */
export const GZ = 1.55;
export const gpos = (angle: number, r: number) => new Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r * GZ);

export interface PlanetSpot { id: string; pos: Vector3; r: number; orbit: number }
export interface SystemSpot { id: DomainId; center: Vector3; radius: number; rx: number; rz: number; planets: PlanetSpot[] }
/** Orbits are ellipses stretched along z (screen vertical) so a system fills a portrait phone screen. */
export const ORBIT_Z = 1.4;

export const planetRadius = (size = 1) => 2.5 * size; // big enough to read at level 2 (13.1b-3)

export function layoutSystems(domains: Domain[]): SystemSpot[] {
  return domains.map((d) => {
    const s = SYS[d.id], a = armAngle(s.arm, s.r);
    const center = gpos(a, s.r);
    const planets = d.nodes.map((n, i): PlanetSpot => {
      const r = planetRadius(n.planet.size);
      const orbit = n.planet.at ? n.planet.at[1] : 4.4 + i * 2.5;
      const ang = n.planet.at ? (n.planet.at[0] * Math.PI) / 180 : a + 0.6 + i * 2.39996; // golden angle spreads them round the star
      return { id: n.id, r, orbit, pos: center.clone().add(new Vector3(Math.cos(ang) * orbit, 0, Math.sin(ang) * orbit * ORBIT_Z)) };
    });
    const rx = Math.max(...planets.map((p) => Math.abs(p.pos.x - center.x) + p.r * 1.5 + 1), 5);
    const rz = Math.max(...planets.map((p) => Math.abs(p.pos.z - center.z) + p.r * 1.5 + 2.5), 5);
    return { id: d.id, center, radius: Math.max(rx, rz), rx, rz, planets };
  });
}

/** The player's home planet (bridge to the Play tab) sits next to Altair, opposite the Macro system. */
export const HOME_POS = (() => { const a = armAngle(0, 22) + Math.PI * 0.95; return gpos(a, 11); })();
