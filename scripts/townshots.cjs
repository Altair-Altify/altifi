/* Town screenshots + frame-rate sample at 390×844 (the demo phone size).
 * Usage: npm run dev  (in another terminal), then  node scripts/townshots.cjs <out-dir> [label]
 * Saves <out-dir>/<label>-<spot>-day.png and -night.png (?hour=10 / ?hour=20) for the demo spots
 * (home, bank, office, market, milk-tea shop, museum), runs "My Life" so the life HUD is visible, then prints
 * frames per second standing still and walking (headless WebGL = SwiftShader on the CPU: compare runs on the
 * same machine, not with a phone) plus draw calls / triangles. POTATO=1 turns Potato Mode on first.
 * Weather is turned off so before/after shots compare the town itself.
 * Quick look: SPOTS=home,bank ONLY=day NOFPS=1.
 * Needs the dev server (it uses the dev-only window.__town hook). */
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node-tools/node_modules/playwright'); } })();
const OUT = (process.argv[2] || 'dev/screens').replace(/\/$/, '') + '/';
const LABEL = process.argv[3] || 'shot';
const BASE = process.env.BASE_URL || 'http://localhost:5173/';
const SPOTS = process.env.SPOTS ? process.env.SPOTS.split(',') : ['home', 'bank', 'office', 'market', 'shop', 'museum'];
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = [];
  for (const [tag, hour] of [['day', 10], ['night', 20]].filter(([t]) => !process.env.ONLY || process.env.ONLY === t)) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'en-US', hasTouch: true, isMobile: true });
    p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/wikimedia|Failed to load resource/i.test(m.text())) errs.push('console: ' + m.text()); });
    await p.goto(BASE + '?hour=' + hour, { waitUntil: 'networkidle' });
    await p.evaluate((po) => { localStorage.clear(); localStorage.setItem('altifi-app-v1', JSON.stringify({ set: { potato: po, wx: false, lang: 'en' } })); }, !!process.env.POTATO);
    await p.reload({ waitUntil: 'networkidle' });
    await p.evaluate(() => A.playLife());
    await p.waitForFunction(() => !!window.__town, null, { timeout: 15000 });
    await p.waitForTimeout(2600);
    await p.evaluate(() => { A.lifeStart(); A.lifeJobGo(); A.townTalkClose(); });
    await p.waitForTimeout(600);
    for (const id of SPOTS) {
      await p.evaluate((id) => { const t = window.__town, d = t.map.doors.find((x) => x.id === id); t.teleport(d.x, d.z + 0.6); }, id);
      await p.waitForTimeout(1500);
      await p.evaluate(() => { for (const s of ['#twHint', '#twZone']) { const e = document.querySelector(s); if (e) e.style.visibility = 'hidden'; } });
      await p.screenshot({ path: `${OUT}${LABEL}-${id}-${tag}.png` });
      await p.evaluate(() => { for (const s of ['#twHint', '#twZone']) { const e = document.querySelector(s); if (e) e.style.visibility = ''; } });
    }
    if (tag === 'day' && !process.env.NOFPS) {
      const fps = async (walk) => p.evaluate(async (walk) => {
        const t = window.__town, d = t.map.doors.find((x) => x.id === 'home'); t.teleport(d.x, d.z + 0.6);
        t.input.set(walk ? 1 : 0, 0);
        await new Promise((r) => setTimeout(r, 800));
        let n = 0, worst = 0, last = performance.now(); const t0 = last;
        await new Promise((r) => { const f = (now) => { n++; worst = Math.max(worst, now - last); last = now; if (now - t0 < 5000) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); });
        t.input.set(0, 0);
        const info = t.renderer.info.render;
        return { fps: +(n / ((last - t0) / 1000)).toFixed(1), worstMs: Math.round(worst), calls: info.calls, tris: info.triangles };
      }, walk);
      const still = await fps(false), walk = await fps(true);
      // steadier than fps: the loop is paused and the same frame is drawn 40× (each followed by a 1-pixel read so
      // the GPU work is finished); median ms per frame
      const ms = await p.evaluate(async () => {
        const t = window.__town, r = t.renderer, gl = r.getContext(), px = new Uint8Array(4), d = t.map.doors.find((x) => x.id === 'home');
        t.teleport(d.x, d.z + 0.6); await new Promise((res) => setTimeout(res, 1200)); t.stop();
        const out = [];
        for (let i = 0; i < 45; i++) { const a = performance.now(); r.render(t.scene, t.camera); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); if (i >= 5) out.push(performance.now() - a); }
        t.start(); out.sort((a, b) => a - b); return out[out.length >> 1].toFixed(1);
      });
      console.log(`${LABEL}${process.env.POTATO ? ' (potato)' : ''}: draw ${ms} ms/frame (median) · still ${still.fps} fps (worst ${still.worstMs}ms) · walking ${walk.fps} fps (worst ${walk.worstMs}ms) · ${still.calls} draw calls · ${still.tris} triangles`);
    }
    await p.close();
  }
  await b.close();
  console.log(errs.length ? errs.join('\n') : 'no console errors');
})();
