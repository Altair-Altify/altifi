/* The demo-video loop (design doc section 8) in English with ?demo=1, at the two phone sizes we record on:
 * lesson M2 (every step + result) → Play › Crisis Museum › 1929 as a saver (4 moments + "what really happened")
 * → My Life for 2 months (Office → Market → Bank → Home → report) → ask Alti Lion in the town.
 * Usage: npm run dev (in another terminal), then  node scripts/demoloop.cjs [out-dir]   (SIZES=375x812,412x915)
 * Saves a screenshot per stage (<out-dir>/<w>-<nn>-<stage>.png), prints horizontal overflow (elements sticking out
 * of the screen) and console errors (Wikimedia photos blocked by the network are ignored). */
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node-tools/node_modules/playwright'); } })();
const OUT = (process.argv[2] || 'dev/screens/demoloop').replace(/\/$/, '') + '/';
const BASE = process.env.BASE_URL || 'http://localhost:5173/';
const SIZES = (process.env.SIZES || '375x812,412x915').split(',').map((s) => s.split('x').map(Number));
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  let bad = 0;
  for (const [W, H] of SIZES) {
    const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2, locale: 'en-US', hasTouch: true, isMobile: true });
    const errs = [], over = [];
    p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/wikimedia|Failed to load resource/i.test(m.text())) errs.push('console: ' + m.text()); });
    let n = 0;
    const shot = async (name) => {
      await p.waitForTimeout(350);
      const o = await p.evaluate((W) => {
        const out = [];
        if (document.documentElement.scrollWidth > W + 1) out.push('page scrollWidth ' + document.documentElement.scrollWidth);
        for (const el of document.querySelectorAll('.phone *')) {
          const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
          if (!r.width || cs.visibility === 'hidden' || cs.display === 'none' || el.closest('svg,.tw-gl,.gx,.hs-host,canvas,.wx,.skybg')) continue;
          if (r.right > W + 1.5 || r.left < -1.5) {
            let a = el.parentElement, clipped = false; // inside a scroller / clipped box that is itself on screen → fine
            while (a && a !== document.body) { const s = getComputedStyle(a); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= W + 1.5 && ar.left >= -1.5) { clipped = true; break; } } a = a.parentElement; }
            if (!clipped && r.width < W * 3) out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} [${Math.round(r.left)}…${Math.round(r.right)}] "${(el.textContent || '').trim().slice(0, 30)}"`);
          }
        }
        return out.slice(0, 6);
      }, W);
      if (o.length) over.push(`${name}: ${o.join(' | ')}`);
      await p.screenshot({ path: `${OUT}${W}-${String(n++).padStart(2, '0')}-${name}.png` });
    };
    await p.goto(BASE + '?demo=1', { waitUntil: 'networkidle' });
    await p.evaluate(() => { localStorage.clear(); localStorage.setItem('altifi-app-v1', JSON.stringify({ set: { lang: 'en', intel: true }, galaxy: { seen: true } })); });
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(1500); await shot('learn');
    // 1 · lesson M2
    await p.evaluate(() => A.startLesson('m-centralbank', false)); await p.waitForTimeout(500);
    for (let guard = 0; guard < 40; guard++) {
      const info = await p.evaluate(() => { const L = window.__lesson(); if (!L) return null; const st = L.steps[L.s]; return { s: L.s, t: st.t }; });
      if (!info) break;
      const tag = `m2-${String(info.s).padStart(2, '0')}-${info.t}`;
      if (info.t === 'learn') { await shot(tag); await p.evaluate(() => A.nextStep()); continue; }
      if (info.t === 'video') { await p.waitForTimeout(1500); await shot(tag); await p.evaluate(() => A.vSkip()); continue; }
      await shot(tag + '-q');
      if (info.t === 'calc') {
        const parts = await p.evaluate(() => window.__lesson().steps[window.__lesson().s].parts.map((x) => x.a));
        const inputs = await p.$$('.cin input');
        for (let i = 0; i < parts.length; i++) await inputs[i].fill(Number.isInteger(parts[i]) && Math.abs(parts[i]) >= 1000 ? parts[i].toLocaleString('en-US') : String(parts[i]));
        await p.click('.ofoot .btn.good');
      } else if (info.t === 'explain') {
        await p.fill('#exin', await p.evaluate(() => { const L = window.__lesson(); return L.steps[L.s].model.en; }));
        await p.click('.ofoot .btn.good');
      } else if (info.t === 'sort') {
        const k = await p.evaluate(() => window.__lesson().st.items.length);
        for (let i = 0; i < k; i++) { await p.evaluate(() => { const L = window.__lesson(); A.sortPick(L.st.items[L.st.idx][2]); }); await p.waitForTimeout(800); }
      } else {
        await p.evaluate(() => {
          const L = window.__lesson(), st = L.steps[L.s];
          switch (st.t) {
            case 'pick': A.lsSet('sel', st.a); break;
            case 'mcq': case 'chart': A.lsSet('sel', L.st.order.indexOf(st.a)); break;
            case 'statement': if (st.o) A.lsSet('sel', L.st.order.indexOf(st.a)); break;
            case 'match': st.pairs.forEach((_, k) => { A.matchTap('l', k); A.matchTap('r', k); }); return;
            case 'order': st.items.forEach((_, k) => A.orderPick(k)); break;
            case 'slider': case 'dial': L.st.v = st.a; break;
            case 'jars': L.st.vals = st.jars.map((j) => j[2]); break;
            case 'spot': L.st.sel = st.post.parts.map((x, k) => x[1] ? k : -1).filter((k) => k >= 0); break;
            case 'tap': L.st.sel = st.items.map((x, k) => x[3] ? k : -1).filter((k) => k >= 0); break;
            case 'predict': A.lsPredict(); return;
          }
          A.checkStep();
        });
      }
      await p.waitForTimeout(500); await shot(tag + '-a');
      await p.evaluate(() => A.nextStep());
    }
    await p.waitForTimeout(800); await shot('m2-result');
    await p.evaluate(() => A.backHome()); await p.waitForTimeout(500);
    // 2 · the 1929 room as a saver
    await p.evaluate(() => A.go('play')); await p.waitForTimeout(1200); await shot('play');
    await p.evaluate(() => A.playCrisis()); await p.waitForFunction(() => !!window.__town, null, { timeout: 15000 }); await p.waitForTimeout(2600); await shot('museum');
    await p.evaluate(() => A.crisisStart('saver')); await p.waitForTimeout(1300); await shot('1929-1');
    for (let i = 0; i < 4; i++) {
      await p.evaluate(() => A.crisisChoose(1)); await p.waitForTimeout(500); await shot(`1929-${i + 1}-rated`);
      await p.evaluate(() => A.crisisNext()); await p.waitForTimeout(1300); await shot(i < 3 ? `1929-${i + 2}` : '1929-end');
    }
    await p.evaluate(() => { const s = document.querySelector('#twSheet'); s.scrollTop = s.scrollHeight; }); await shot('1929-end-bottom');
    await p.evaluate(() => A.crisisQuit()); await p.waitForTimeout(800);
    // 3 · My Life, 2 months
    await p.evaluate(() => { A.exitTown(); }); await p.waitForTimeout(600);
    await p.evaluate(() => A.playLife()); await p.waitForTimeout(2600); await shot('life-intro');
    await p.evaluate(() => A.lifeStart()); await p.waitForTimeout(600); await shot('life-started');
    await p.evaluate(() => A.townTalkClose());
    const door = async (id) => { await p.evaluate((id) => { const t = window.__town, d = t.map.doors.find((x) => x.id === id); t.teleport(d.x, d.z + 0.4); }, id); await p.waitForTimeout(700); await p.evaluate(() => A.townAct()); await p.waitForTimeout(700); };
    for (let m = 1; m <= 2; m++) {
      await door('office'); await shot(`life-m${m}-office`);
      await p.evaluate(() => A.lifeChoose(0)); await p.waitForTimeout(600); await shot(`life-m${m}-office-rated`);
      await p.evaluate(() => A.townSheetClose());
      await door('market'); await shot(`life-m${m}-market`); await p.evaluate(() => A.lifePlan('balanced')); await p.waitForTimeout(300);
      await door('bank'); await shot(`life-m${m}-bank`); await p.evaluate(() => A.townSheetClose());
      await door('home'); await shot(`life-m${m}-home`);
      await p.evaluate(() => A.lifeEnd()); await p.waitForTimeout(700); await shot(`life-m${m}-report`);
      await p.evaluate(() => A.townSheetClose()); await p.waitForTimeout(500); await shot(`life-m${m}-hud`);
    }
    // 4 · ask Alti Lion in the town
    await p.evaluate(() => A.openAssistant()); await p.waitForTimeout(700); await shot('lion-open');
    await p.fill('#ifin', 'Fixed or floating rate: which is safer?'); await p.evaluate(() => A.askLion()); await p.waitForTimeout(2200); await shot('lion-answer');
    const demoNotes = await p.evaluate(() => [...document.querySelectorAll('.dnote')].filter((e) => e.getBoundingClientRect().height > 0).length);
    console.log(`${W}×${H}: ${n} screenshots · overflow: ${over.length ? '\n  ' + over.join('\n  ') : 'none'} · visible demo notes: ${demoNotes} · errors: ${errs.length ? '\n  ' + errs.join('\n  ') : 'none'}`);
    bad += over.length + errs.length;
    await p.close();
  }
  await b.close();
  process.exitCode = bad ? 1 : 0;
})();
