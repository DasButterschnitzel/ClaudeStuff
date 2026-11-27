// Talks to the app's WebView on a running emulator/device over the Chrome DevTools Protocol (debug build only).
// Usage: adb forward tcp:9222 localabstract:webview_devtools_remote_$(adb shell pidof app.mwaiseni) && node device.js
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'shots'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
  const target = list.find(t => /appassets/.test(t.url)) || list[0];
  if (!target) throw new Error('no WebView page found');
  console.log('page:', target.url, '| WebView', (await (await fetch('http://127.0.0.1:9222/json/version')).json()).Browser);
  const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const wait = {};
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && wait[d.id]) { wait[d.id](d); delete wait[d.id]; } };
  const send = (method, params) => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr, timeout) => {
    const r = await Promise.race([send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }), new Promise(r => setTimeout(() => r({ result: { result: { value: 'TIMEOUT' } } }), timeout || 60000))]);
    if (r.result && r.result.exceptionDetails) return 'EXCEPTION ' + JSON.stringify(r.result.exceptionDetails.exception || r.result.exceptionDetails.text);
    return r.result && r.result.result ? r.result.result.value : r;
  };
  const shot = async name => { const r = await send('Page.captureScreenshot', { format: 'png' }); if (r.result) fs.writeFileSync(path.join(OUT, 'dev-' + name + '.png'), Buffer.from(r.result.data, 'base64')); };
  const steps = (process.argv[2] || 'info').split(',');
  for (const s of steps) {
    if (s === 'info') { console.log('info:', await ev('NativeBridge.info()')); console.log('state:', await ev('JSON.stringify({onboarded: MW.state.onboarded, units: MW.D.units.length, places: MW.D.places.length, native: MW.N.native, theme: document.documentElement.dataset.theme, size: innerWidth + "x" + innerHeight})')); }
    else if (s === 'shot') await shot('screen' + Date.now() % 100000);
    else if (s === 'onboard') { console.log(await ev(`(async()=>{const S=MW.state;S.onboarded=true;S.profile.name='Natasha';MW.saveNow();document.querySelector('.onb')&&document.querySelector('.onb').remove();MW.render();return 'ok'})()`)); }
    else if (s === 'tts') console.log('speak:', JSON.stringify(await ev(`new Promise(r=>{const id='t'+Date.now();const old=window.__native;window.__native=(i,p)=>{if(i===id){window.__native=old;r(p)}else old(i,p)};NativeBridge.speak('Guten Tag','de-DE','1.0',id)})`, 30000)));
    else if (s === 'translate') console.log('translate:', JSON.stringify(await ev(`MW.N.translate(['Guten Morgen, wie geht es Ihnen?','Bitte bringen Sie Ihren Pass mit.'],'de','en')`, 180000)));
    else if (s === 'model') console.log('model:', JSON.stringify(await ev(`MW.N.modelStatus()`, 30000)));
    else if (s === 'http') console.log('http:', JSON.stringify(await ev(`MW.N.http('https://open.er-api.com/v6/latest/EUR').then(r=>r&&r.rates?{zmw:r.rates.ZMW}:r)`, 30000)));
    else if (s === 'ocr') console.log('ocr:', JSON.stringify(await ev(`MW.N.ocr('test.jpg').then(r=>({ok:r.ok,error:r.error,blocks:(r.blocks||[]).length,text:(r.text||'').slice(0,400)}))`, 240000)));
    else if (s === 'misc') console.log('misc:', await ev(`(()=>{try{NativeBridge.haptic('ok');NativeBridge.keepAwake(true);NativeBridge.keepAwake(false);NativeBridge.setBars('#FFF7EC',true);NativeBridge.setReminder(true,9,0,JSON.stringify(['das Brot — bread']));NativeBridge.setReminder(false,9,0,'[]');return 'ok '+NativeBridge.ready()}catch(e){return 'ERR '+e}})()`));
    else if (s.startsWith('go:')) { console.log(await ev(`MW.go('${s.slice(3)}'),'ok'`)); await new Promise(r => setTimeout(r, 4000)); await shot(s.slice(3)); }
    else if (s.startsWith('push:')) { console.log(await ev(`MW.push('${s.slice(5)}'),'ok'`)); await new Promise(r => setTimeout(r, 4000)); await shot(s.slice(5)); }
    else if (s.startsWith('js:')) console.log(await ev(s.slice(3), 120000));
  }
  ws.close();
})().catch(e => { console.error('DEVICE TEST FAILED', e.message); process.exit(1); });
