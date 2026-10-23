/* Demo-video screenshots at sunset (390×844): the six demo places, the 1929 museum (entering, the boom, the bank
 * run), buying a scooter (it appears in the garden) and the HUD right after a month ends (net worth change).
 * Usage: npm run dev (in another terminal), then  node scripts/demoshots.cjs <out-dir> <label> [query]
 *   query defaults to "?demo=1"; for builds without demo mode use "?hour=17.75" (weather is switched off either way).
 * Saves <out-dir>/<label>-sunset-<spot>.png, <label>-museum-*.png, <label>-ride-*.png, <label>-networth.png.
 * Needs the dev server (dev-only window.__town hook). */
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node-tools/node_modules/playwright'); } })();
const OUT = (process.argv[2] || 'dev/screens').replace(/\/$/, '') + '/';
const LABEL = process.argv[3] || 'shot';
const Q = process.argv[4] || '?demo=1';
const BASE = process.env.BASE_URL || 'http://localhost:5173/';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = [];
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'en-US', hasTouch: true, isMobile: true });
  p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  p.on('console', (m) => { if (m.type() === 'error' && !/wikimedia|Failed to load resource/i.test(m.text())) errs.push('console: ' + m.text()); });
  await p.goto(BASE + Q, { waitUntil: 'networkidle' });
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('altifi-app-v1', JSON.stringify({ set: { wx: false, lang: 'en' } })); });
  await p.reload({ waitUntil: 'networkidle' });
  await p.evaluate(() => A.playLife());
  await p.waitForFunction(() => !!window.__town, null, { timeout: 15000 });
  await p.waitForTimeout(2600);
  await p.evaluate(() => { A.lifeStart(); A.townTalkClose(); });
  await p.waitForTimeout(600);
  const hide = (on) => p.evaluate((on) => { for (const s of ['#twHint', '#twZone']) { const e = document.querySelector(s); if (e) e.style.visibility = on ? 'hidden' : ''; } }, on);
  const go = (id, dz = 0.6) => p.evaluate(([id, dz]) => { const t = window.__town, d = t.map.doors.find((x) => x.id === id); t.teleport(d.x, d.z + dz); }, [id, dz]);
  const shot = async (name) => { await hide(true); await p.screenshot({ path: `${OUT}${LABEL}-${name}.png` }); await hide(false); };
  for (const id of ['home', 'office', 'bank', 'market', 'shop', 'museum']) { await go(id); await p.waitForTimeout(1500); await shot('sunset-' + id); }
  // buying a ride: it appears in the garden
  await go('home', 3.2); await p.waitForTimeout(1200);
  await p.evaluate(() => { A.lifeDealer(); A.lifeBuy('scooter', 'fixed', true); }); // after this build: the camera visits the garden
  await p.waitForTimeout(1000); await shot('ride-1.0s');
  await p.waitForTimeout(500); await shot('ride-1.5s');
  await p.waitForTimeout(2600); await shot('ride-after');
  await p.evaluate(() => A.townSheetClose());
  // a month ends: net worth on the HUD
  await p.evaluate(() => { A.lifeEnd(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => A.townSheetClose());
  await p.waitForTimeout(450); await shot('networth');
  // the museum: entering + the 1929 boom + the bank run
  await go('museum', 0.4); await p.waitForTimeout(900);
  await p.evaluate(() => A.townAct()); await p.waitForTimeout(500); await shot('museum-enter');
  await p.evaluate(() => A.crisisStart('saver')); await p.waitForTimeout(1200); await shot('museum-1929-boom');
  await p.evaluate(() => { A.crisisChoose(0); A.crisisNext(); A.crisisChoose(0); A.crisisNext(); }); await p.waitForTimeout(1500); await shot('museum-1929-run');
  await p.evaluate(() => A.crisisQuit());
  await p.close(); await b.close();
  console.log(errs.length ? errs.join('\n') : 'no console errors');
})();
