// Food finder: search across languages/scripts and the item screen. Uses the real data/foods.js when present, else a small fixture.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../app/src/main/assets/www'); const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
const FIXTURE = !fs.existsSync(path.join(ROOT, 'data/foods.js'));
(async () => {
  await new Promise(r => srv.listen(8768, r));
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load/.test(m.text())) errors.push(m.text()); });
  if (FIXTURE) await page.addInitScript(() => {
    window.DATA = { foodCats: [{ id: 'greens', title: 'Greens & relish', emoji: '🥬' }, { id: 'fish', title: 'Fish & meat', emoji: '🐟' }],
      foodFinder: [
        { id: 'spinach', cat: 'greens', emoji: '🥬', zm: 'Spinach', what: 'Swiss chard.', de: 'Mangold', deAlt: ['Stielmangold'], shops: [{ shop: 'market', label: 'Mangold' }, { shop: 'turkish', label: 'Pazı' }, { shop: 'asian', label: 'Swiss chard', script: '莙荙菜', roman: 'jūndá cài' }], tip: 'Not Spinat.', ask: 'Haben Sie Mangold?', askEn: 'Do you have Swiss chard?' },
        { id: 'rape', cat: 'greens', emoji: '🥬', zm: 'Rape', what: 'Leafy brassica.', de: 'Schwarzkohl', shops: [{ shop: 'asian', label: 'Yu Choy', script: '油菜', roman: 'yóu cài' }], ask: 'Haben Sie Yu Choy?', askEn: 'Do you have yu choy?' },
        { id: 'kapenta', cat: 'fish', emoji: '🐟', zm: 'Kapenta', local: [{ lang: 'Bemba', w: 'Kapenta' }], what: 'Small dried fish.', de: 'getrocknete Sardellen', shops: [{ shop: 'asian', label: 'cá cơm khô', note: 'Vietnamese label' }, { shop: 'african', label: 'Dagaa' }], ask: 'Haben Sie getrocknete Sardellen?', askEn: 'Do you have dried anchovies?' }] };
  });
  await page.goto('http://localhost:8768/index.html');
  await page.evaluate(() => { const S = MW.state; S.onboarded = true; S.profile.name = 'Chilufya'; MW.saveNow(); });
  await page.reload(); await page.waitForTimeout(400);
  const n = await page.evaluate(() => MW.D.foodFinder.length); console.log((FIXTURE ? 'fixture' : 'real data') + ':', n, 'foods');
  for (const q of ['spinach', 'mangold', '油菜', 'ca com', 'yu choy', 'kapenta', 'dagaa', 'maize', 'süßkartoffel', 'groundnuts', 'xyzzy'])
    console.log('search', JSON.stringify(q).padEnd(16), '→', (await page.evaluate(q => Food.search(q).slice(0, 3).map(f => f.zm + '→' + f.de).join(' | '), q)) || '(none)');
  await page.locator('.nav button:nth-child(5)').click(); await page.waitForTimeout(500);
  await page.evaluate(() => { const c = [...document.querySelectorAll('.sect')].find(e => /Taste of home/.test(e.textContent)); c && c.scrollIntoView(); }); await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, 'food0-zambia.png') });
  await page.evaluate(() => MW.push('food', {})); await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, 'food1-list.png') });
  await page.fill('.search input', 'spinach'); await page.waitForTimeout(200); await page.screenshot({ path: path.join(OUT, 'food2-search.png') });
  await page.locator('.list .item').first().click(); await page.waitForTimeout(400); await page.screenshot({ path: path.join(OUT, 'food3-item.png') });
  await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 2000)); await page.waitForTimeout(200); await page.screenshot({ path: path.join(OUT, 'food4-item2.png') });
  await page.locator('button:has-text("Show this to the shop staff")').click(); await page.waitForTimeout(300); await page.screenshot({ path: path.join(OUT, 'food5-show.png') });
  await page.evaluate(() => window.__back());
  await page.locator('button:has-text("shopping list")').click(); await page.evaluate(() => MW.push('shoppingList')); await page.waitForTimeout(300); await page.screenshot({ path: path.join(OUT, 'food6-list.png') });
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO CONSOLE ERRORS');
  await browser.close(); srv.close();
})().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
