// Voice screen + name respelling, with a fake Android bridge that records what would be spoken.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../app/src/main/assets/www'); const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
(async () => {
  await new Promise(r => srv.listen(8767, r));
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load/.test(m.text())) errors.push(m.text()); });
  await page.addInitScript(() => {
    window.__spoken = [];
    const ok = id => setTimeout(() => window.__native(id, { ok: true }), 30);
    const voices = (lang, cc) => [{ name: lang + '-' + cc.toLowerCase() + '-x-aaa-local', country: cc, quality: 400, network: false, installed: true },
      { name: lang + '-' + cc.toLowerCase() + '-x-bbb-local', country: cc, quality: 400, network: false, installed: false },
      { name: lang + '-' + cc.toLowerCase() + '-x-ccc-network', country: cc, quality: 500, network: true, installed: true }];
    window.NativeBridge = {
      info: () => JSON.stringify({ version: 'test', speech: true, tts: true, notifications: true, sdk: 34 }), ready: () => '',
      speak: (t, l, r, id) => { window.__spoken.push(l + ' | ' + t); ok(id); }, stopSpeak() {}, installVoices() {},
      voiceInfo: () => JSON.stringify({ ready: true, engine: 'com.samsung.SMT', engineLabel: 'Samsung text-to-speech engine', google: true, online: true,
        engines: [{ pkg: 'com.samsung.SMT', label: 'Samsung text-to-speech engine' }, { pkg: 'com.google.android.tts', label: 'Speech Services by Google' }],
        de: { voices: voices('de', 'DE'), chosen: '', auto: 'de-de-x-aaa-local' }, en: { voices: voices('en', 'GB'), chosen: '', auto: 'en-gb-x-aaa-local' } }),
      setVoice() {}, setEngine: (p, id) => ok(id), haptic() {}, setBars() {}, keepAwake() {}, setReminder() {}, open: () => true, share() {},
      modelStatus: id => setTimeout(() => window.__native(id, { ok: true, ready: true }), 10), downloadModel: id => ok(id), askNotifications: id => ok(id),
      httpGet: id => setTimeout(() => window.__native(id, { ok: false }), 10)
    };
  });
  await page.goto('http://localhost:8767/index.html');
  await page.evaluate(() => { const S = MW.state; S.onboarded = true; S.profile.name = 'Chilufya'; S.profile.surname = 'Mwila'; MW.saveNow(); });
  await page.reload(); await page.waitForTimeout(500);
  await page.evaluate(() => MW.push('voice')); await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'voice1.png') });
  await page.evaluate(() => document.querySelector('.scroll').scrollTo(0, 900)); await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, 'voice2.png') });
  // speak a lesson sentence with {name}, an English sentence, and the custom spelling
  await page.evaluate(async () => {
    await MW.say('Ich heiße {name} Banda.', 'de');
    await MW.say('My name is {name}.', 'en');
    MW.state.profile.nameSay = 'Tschiluufja'; await MW.say('Hallo {name}!', 'de');
  });
  console.log((await page.evaluate(() => window.__spoken)).join('\n'));
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO CONSOLE ERRORS');
  await browser.close(); srv.close();
})().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
