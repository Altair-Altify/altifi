/* ---------- ?demo=1 — only for recording the demo video ----------
 * Weather off, the town at golden hour unless ?hour= says otherwise, and on-screen "demo" / "to be verified" notes
 * hidden (CSS: html.demo .dnote). The notes stay in the code and come back without the parameter; normal use is
 * untouched. */
export const DEMO = /[?&]demo=1(?:&|$)/.test(location.search);
/** Town hour in demo mode: warm sunset (see SKY in src/game/town.ts). */
export const DEMO_HOUR = 17.6;
if (DEMO) document.documentElement.classList.add("demo");
