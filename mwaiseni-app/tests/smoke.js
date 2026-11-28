// Drives the web UI in headless Chromium with a phone viewport and takes screenshots.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../app/src/main/assets/www');
const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
(async () => {
  await new Promise(r => srv.listen(8765, r));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: process.env.DARK ? 'dark' : 'light' });
  const page = await ctx.newPage(); const errors = [];
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  await page.addInitScript(() => { window.__mockTranslate = (t, s, g) => '[' + g + '] ' + t; });
  let n = 0; const shot = async (name) => { await page.waitForTimeout(450); await page.screenshot({ path: path.join(OUT, String(++n).padStart(2, '0') + '-' + name + '.png') }); };
  const tap = async (sel) => { await page.locator(sel).first().click(); };
  await page.goto('http://localhost:8765/index.html');
  await shot('onb0'); await tap('.onb .btn');
  await page.fill('.onb input', 'Natasha'); await shot('onb1'); await tap('.onb .btn');
  await shot('onb2'); await tap('.onb .btn');
  await shot('onb3'); await tap('.onb .btn');
  await page.waitForTimeout(4500); await shot('today');
  await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 700)); await shot('today2');
  await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 1500)); await shot('today3');
  // first steps checklist
  if (await page.locator('.card.tap:has-text("first steps")').count()) { await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 0)); await tap('.card.tap:has-text("first steps")'); await page.fill('input[type=date]', '2026-09-15'); await shot('steps'); await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 600)); await tap('.list .say'); await shot('steps2'); await page.evaluate(() => window.__back()); }
  // learn
  await tap('.nav button:nth-child(2)'); await shot('learn');
  await tap('.unit'); await shot('unit');
  await tap('.steps .step'); await shot('lesson-intro');
  // play through a full lesson, answering correctly where we can
  for (let i = 0; i < 60; i++) {
    const state = await page.evaluate(() => {
      const L = document.querySelector('.lesson'); if (!L) return 'closed';
      if (L.querySelector('.done-screen')) return 'done';
      const ask = (L.querySelector('.ask') || {}).textContent || '';
      if (L.querySelector('.introcard')) return 'intro';
      if (L.querySelector('.foot.ok, .foot.bad')) return 'feedback';
      if (L.querySelector('.pairs')) return 'match';
      if (L.querySelector('.answerline')) return 'order';
      if (L.querySelector('input.input')) return 'type';
      if (/Say it/.test(ask)) return 'speak';
      if (L.querySelector('.opts')) return 'mc';
      return 'unknown:' + ask;
    });
    if (state === 'closed') break;
    if (i < 22 && !fs.existsSync(path.join(OUT, 'x-' + state + '.png'))) { await page.waitForTimeout(350); await page.screenshot({ path: path.join(OUT, 'x-' + state + '.png') }); }
    if (state === 'done') { await shot('lesson-done'); await tap('.lesson .foot .btn'); break; }
    if (state === 'intro' || state === 'feedback') { await tap('.lesson .foot .btn'); }
    else if (state === 'mc') { await tap('.lesson .opt'); }
    else if (state === 'match') {
      await page.evaluate(() => { const bs = [...document.querySelectorAll('.pairs .opt')]; const L = bs.filter((b, i) => i % 2 === 0), R = bs.filter((b, i) => i % 2 === 1); L.forEach(l => { l.click(); R.find(r => r.w === l.w).click(); }); });
    }
    else if (state === 'order') { await page.evaluate(() => { [...document.querySelectorAll('.tiles .tilew')].slice(0, 3).forEach(b => b.click()); }); await page.waitForTimeout(200); await page.screenshot({ path: path.join(OUT, 'x-order2.png') }); await tap('.lesson .foot .btn'); }
    else if (state === 'type') { await page.fill('.lesson input.input', 'Hallo'); await tap('.lesson .foot .btn'); }
    else if (state === 'speak') { await tap('.lesson .foot .btn'); }
    else { console.log('STATE', state); break; }
    await page.waitForTimeout(120);
  }
  await shot('unit-after');
  await page.evaluate(() => window.__back()); await page.evaluate(() => window.__back());
  // speak
  await tap('.nav button:nth-child(3)'); await shot('talk-empty');
  await page.fill('.composer textarea', 'Where is the train station?'); await tap('.composer .send');
  await page.fill('.composer textarea', 'Der Bahnhof ist dort drüben, bitte gehen Sie geradeaus.'); await tap('.composer .send'); await shot('talk');
  await tap('.seg button:nth-child(2)'); await shot('phrases');
  await tap('.cat'); await shot('phrase-list'); await tap('.item.phrase'); await shot('phrase-sheet');
  await page.evaluate(() => window.__back()); await page.evaluate(() => window.__back());
  await tap('.seg button:nth-child(3)'); await shot('cards'); await tap('.cat'); await shot('card-big'); await page.evaluate(() => window.__back());
  // scan
  await tap('.nav button:nth-child(1)'); await tap('.tile.c2'); await shot('scan');
  await tap('.link'); await shot('scan-result');
  await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 650)); await shot('scan-result2');
  await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 1500)); await shot('scan-result3');
  await page.evaluate(() => window.__back()); await page.evaluate(() => window.__back());
  // around
  await tap('.nav button:nth-child(4)'); await shot('around');
  if (await page.locator('.scroll .card.tap').count()) { await tap('.scroll .card.tap'); await shot('places'); }
  await tap('.seg button:nth-child(2)'); await shot('guide-list'); await tap('.item'); await shot('guide'); await page.evaluate(() => window.__back());
  // zambia
  await tap('.nav button:nth-child(5)'); await page.waitForTimeout(1500); await shot('zambia');
  await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 800)); await shot('zambia2');
  if (await page.locator('.grid2 .cat').count()) { await tap('.grid2 .cat'); await shot('food'); await page.evaluate(() => window.__back()); }
  // sos + settings
  await tap('.nav button:nth-child(1)'); await tap('.sos'); await shot('sos'); await page.evaluate(() => window.__back());
  await tap('.hbtn'); await shot('settings'); await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 900)); await shot('settings2');
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO CONSOLE ERRORS');
  await browser.close(); srv.close();
})().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
