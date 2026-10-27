/* ---------- ?demo=1 — only for recording the demo video ----------
 * Weather off, the town at golden hour unless ?hour= says otherwise, and on-screen "demo" / "to be verified" notes
 * hidden (CSS: html.demo .dnote). The notes stay in the code and come back without the parameter; normal use is
 * untouched.
 * Shortcuts for recording (work with or without demo=1):
 *   ?lang=en|vi          app language
 *   ?scene=job           My Life starts over → the "first job" card
 *   ?scene=car           My Life at month 4, at the Office → the scooter case (5 options + type your own idea)
 *   ?scene=promo         My Life after the scooter case → end the month → PROMOTED card
 *   ?scene=news          Explore tab → "Today's news" card (ask Alti Lion) */
import { S } from "./state";

export const DEMO = /[?&]demo=1(?:&|$)/.test(location.search);
/** Town hour in demo mode: warm sunset (see SKY in src/game/town.ts). */
export const DEMO_HOUR = 17.6;
if (DEMO) document.documentElement.classList.add("demo");
const qLang = /[?&]lang=(vi|en)(?:&|$)/.exec(location.search);
if (qLang) { S.set.lang = qLang[1] as "vi" | "en"; document.documentElement.lang = S.set.lang; }
export const SCENE = /[?&]scene=([a-z]+)/.exec(location.search)?.[1] || "";
