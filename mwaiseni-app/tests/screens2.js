// Extra screens that the main smoke run does not reach: single exercise types, dialogue, onboarding with languages.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../app/src/main/assets/www'); const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
(async () => {
  await new Promise(r => srv.listen(8766, r));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  const shot = async (name) => { await page.waitForTimeout(500); await page.screenshot({ path: path.join(OUT, 'z-' + name + '.png') }); };
  await page.goto('http://localhost:8766/index.html');
  await page.locator('.onb .btn').click(); await page.fill('.onb input', 'Natasha'); await page.locator('.onb .btn').click(); await shot('onb-lang');
  await page.evaluate(() => { const S = MW.state; S.onboarded = true; S.profile.name = 'Natasha'; S.profile.note = 'Ich liebe dich. You are doing great, one day at a time.'; S.profile.partnerName = 'Thomas'; S.profile.partnerPhone = '+49 170 0000000'; S.profile.address = 'Musterstraße 1, 63303 Dreieich'; MW.saveNow(); });
  await page.reload(); await page.waitForTimeout(600); await shot('today-note');
  const U = 'MW.D.units[12]';
  for (const [name, ex] of [['type', `[{type:'type',u:${U},w:${U}.words[0],pool:${U}.words}]`], ['hear', `[{type:'hear_s',u:${U},s:${U}.sentences[0]}]`], ['speak', `[{type:'speak',u:${U},s:${U}.sentences[1]}]`], ['listen', `[{type:'listen',u:${U},w:${U}.words[3],pool:${U}.words}]`], ['en_de', `[{type:'en_de',u:${U},w:${U}.words[5],pool:${U}.words}]`]]) {
    await page.evaluate((e) => { Learn.startLesson({ exercises: eval(e), xp: 1 }); }, ex); await shot('ex-' + name);
    await page.evaluate(() => { document.querySelector('.lesson .iconbtn').click(); });
  }
  await page.evaluate(() => MW.push('dialogue', { id: 'u13' })); await shot('dialogue'); await page.evaluate(() => window.__back());
  await page.evaluate(() => MW.push('sos')); await shot('sos-full'); await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 700)); await shot('sos-2'); await page.evaluate(() => window.__back());
  await page.evaluate(() => MW.showBig(MW.D.showcards.find(c => c.id === 'call-husband').de, 'x', 'Thomas: +49 170 0000000')); await shot('card-husband'); await page.evaluate(() => window.__back());
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO CONSOLE ERRORS');
  await browser.close(); srv.close();
})().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
