/* Automated play-through of every lesson (basic + deep dive), answering correctly.
 * Usage: npm run dev  (in another terminal), then  node scripts/playthrough.cjs [vi|en]
 * Optional: SHOTS=/some/dir/ to save a screenshot per step, BASE_URL=http://localhost:5173/
 * Needs the dev server (it uses the dev-only window.__lesson hook). Expect every graded step to print RIGHT;
 * "predict" steps are ungraded and print WRONG by design. */
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node-tools/node_modules/playwright'); } })();
const SH = process.env.SHOTS || '';
const LANG = process.argv[2] || 'vi';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 400, height: 820 }, locale: LANG === 'vi' ? 'vi-VN' : 'en-US' });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto((process.env.BASE_URL || 'http://localhost:5173/'), { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
  const results = [];
  for (const [id, deep] of [['p-budget', false], ['p-budget', true], ['p-inflation', false], ['p-inflation', true], ['c-breakeven', false], ['c-breakeven', true]]) {
    await p.evaluate(([id, deep]) => A.startLesson(id, deep), [id, deep]);
    await p.waitForTimeout(300);
    let guard = 0;
    while (guard++ < 40) {
      const info = await p.evaluate(() => { const L = window.__lesson(); if (!L) return null; const st = L.steps[L.s]; return { s: L.s, t: st.t, checked: L.checked }; });
      if (!info) break;
      const tag = `${id}${deep ? '-deep' : ''}-${String(info.s).padStart(2, '0')}-${info.t}`;
      if (info.t === 'learn') { if (SH) await p.screenshot({ path: SH + 'L-' + tag + '.png' }); await p.evaluate(() => A.nextStep()); await p.waitForTimeout(150); continue; }
      if (info.t === 'video') { await p.waitForTimeout(3500); if (SH) await p.screenshot({ path: SH + 'L-' + tag + '.png' }); await p.evaluate(() => A.vSkip()); await p.waitForTimeout(150); continue; }
      if (info.t === 'calc') {
        const parts = await p.evaluate(() => window.__lesson().steps[window.__lesson().s].parts.map(x => x.a));
        const inputs = await p.$$('.cin input');
        for (let i = 0; i < parts.length; i++) {
          const v = parts[i];
          const str = Number.isInteger(v) && Math.abs(v) >= 1000 ? v.toLocaleString(LANG === 'vi' ? 'vi-VN' : 'en-US') : String(v).replace('.', LANG === 'vi' ? ',' : '.');
          await inputs[i].fill(str);
        }
        await p.click('.ofoot .btn.good');
        await p.waitForTimeout(400);
      } else if (info.t === 'explain') {
        const model = await p.evaluate((lg) => { const st = window.__lesson().steps[window.__lesson().s]; return st.model[lg]; }, LANG);
        await p.fill('#exin', model);
        await p.click('.ofoot .btn.good'); await p.waitForTimeout(400);
      } else if (info.t === 'sort') {
        const n = await p.evaluate(() => window.__lesson().st.items.length);
        for (let i = 0; i < n; i++) { await p.evaluate(() => { const L = window.__lesson(); A.sortPick(L.st.items[L.st.idx][2]); }); await p.waitForTimeout(800); }
      } else {
        await p.evaluate(() => {
          const L = window.__lesson(), st = L.steps[L.s];
          switch (st.t) {
            case 'pick': A.lsSet('sel', st.a); break;
            case 'mcq': case 'chart': A.lsSet('sel', L.st.order.indexOf(st.a)); break;
            case 'statement': if (st.o) A.lsSet('sel', L.st.order.indexOf(st.a)); break;
            case 'match': st.pairs.forEach((_, k) => { A.matchTap('l', k); A.matchTap('r', k); }); return;
            case 'order': st.items.forEach((_, k) => A.orderPick(k)); break;
            case 'slider': L.st.v = st.a; break;
            case 'jars': L.st.vals = st.jars.map(j => j[2]); break;
            case 'spot': L.st.sel = st.post.parts.map((x, k) => x[1] ? k : -1).filter(k => k >= 0); break;
            case 'tap': L.st.sel = st.items.map((x, k) => x[3] ? k : -1).filter(k => k >= 0); break;
            case 'predict': A.lsPredict(); return;
          }
          A.checkStep();
        });
        await p.waitForTimeout(450);
      }
      const r = await p.evaluate(() => { const L = window.__lesson(); return L ? { checked: L.checked, right: L.right } : null; });
      results.push(`${tag}: ${r && r.checked ? (r.right ? 'RIGHT' : 'WRONG') : 'not-checked'}`);
      if (SH) await p.screenshot({ path: SH + 'L-' + tag + '.png' });
      await p.evaluate(() => A.nextStep()); await p.waitForTimeout(200);
    }
    await p.waitForTimeout(600);
    if (SH) await p.screenshot({ path: SH + `R-${id}${deep ? '-deep' : ''}.png` });
    await p.evaluate(() => A.backHome());
  }
  const state = await p.evaluate(() => JSON.parse(localStorage.getItem('altifi-app-v1')));
  if (SH) await p.screenshot({ path: SH + 'Z-home-after.png' });
  console.log(results.join('\n'));
  console.log('XP', state.xp, 'lessons', JSON.stringify(state.lessons), 'hearts', state.hearts);
  console.log('ERRORS', JSON.stringify(errs, null, 1));
  await b.close();
})();
