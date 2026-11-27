/* Zambia tab: time & weather at home, Euro ↔ Kwacha, greetings, food finder, links. */
(function () {
  'use strict';
  const { D, h, icon, em, N, sayBtn, toast, sheet, screens, push, page, P, save } = MW;
  const S = MW.state; const H = D.home;
  const DREIEICH = { name: 'Dreieich', lat: 50.02, lon: 8.69 };

  // ───────────────────────── time
  const fmtT = (tz) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date());
  const hourIn = (tz) => +new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: tz }).format(new Date()) % 24;
  function tzOffsetHours() { // Zambia minus Germany, in hours
    const d = new Date(); const f = tz => new Date(d.toLocaleString('en-US', { timeZone: tz })).getTime();
    return Math.round((f('Africa/Lusaka') - f('Europe/Berlin')) / 36e5);
  }
  const city = () => H.cities.find(c => c.name === S.profile.city) || H.cities[0] || { name: 'Lusaka', lat: -15.4167, lon: 28.2833 };
  const langG = () => H.greetings.find(g => g.id === S.profile.lang) || null;

  // ───────────────────────── weather
  const WX = [[0, '☀️', 'Clear'], [2, '🌤️', 'Partly cloudy'], [3, '☁️', 'Cloudy'], [48, '🌫️', 'Fog'], [57, '🌦️', 'Drizzle'], [67, '🌧️', 'Rain'], [77, '❄️', 'Snow'], [82, '🌧️', 'Showers'], [86, '🌨️', 'Snow showers'], [99, '⛈️', 'Thunderstorm']];
  const wx = code => { for (const w of WX) if (code <= w[0]) return w; return WX[2]; };
  let wxBusy = false;
  async function loadWeather(force) {
    const c = city(); const cache = S.wxCache;
    if (!force && cache && cache.city === c.name && Date.now() - cache.t < 30 * 6e4) return cache;
    if (wxBusy) return cache; wxBusy = true;
    const r = await N.http('https://api.open-meteo.com/v1/forecast?latitude=' + DREIEICH.lat + ',' + c.lat + '&longitude=' + DREIEICH.lon + ',' + c.lon + '&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto');
    wxBusy = false;
    if (Array.isArray(r) && r[0] && r[0].current && r[1] && r[1].current) {
      const mk = x => ({ t: Math.round(x.current.temperature_2m), c: x.current.weather_code, hi: x.daily ? Math.round(x.daily.temperature_2m_max[0]) : null, lo: x.daily ? Math.round(x.daily.temperature_2m_min[0]) : null });
      S.wxCache = { t: Date.now(), city: c.name, de: mk(r[0]), zm: mk(r[1]) }; save(); return S.wxCache;
    }
    return cache && cache.city === c.name ? cache : null;
  }
  /** Two clocks side by side. Updates itself while visible. */
  function clocksCard() {
    const c = city();
    const mkClock = (cls, label, tz) => { const tm = h('div', { class: 'tm' }, fmtT(tz)); const w = h('div', { class: 'wx' }, ' '); return { el: h('div', { class: 'clock ' + cls }, h('div', { class: 'c' }, label), tm, w), tm, w, tz }; };
    const a = mkClock('', '🇩🇪 Dreieich', 'Europe/Berlin'), b = mkClock('zm', '🇿🇲 ' + c.name, 'Africa/Lusaka');
    const off = tzOffsetHours(); const hz = hourIn('Africa/Lusaka');
    const callMsg = hz >= 22 || hz < 6 ? '😴 It is night in Zambia now.' : hz < 8 ? '🌅 Early morning in Zambia.' : hz >= 20 ? '🌙 Evening in Zambia: a good time to call.' : '☎️ A good time to call home.';
    const note = h('div', { class: 'muted', style: { marginTop: '10px' } }, (off === 0 ? 'Same time as Germany right now. ' : 'Zambia is ' + Math.abs(off) + ' hour' + (Math.abs(off) > 1 ? 's' : '') + (off > 0 ? ' ahead. ' : ' behind. ')) + callMsg);
    const el = h('div', { class: 'card' }, h('div', { class: 'clocks' }, a.el, b.el), note);
    const paint = d => { if (!d) return; [[a, d.de], [b, d.zm]].forEach(([k, v]) => { const x = wx(v.c); k.w.textContent = x[1] + ' ' + v.t + '°C · ' + x[2]; }); };
    paint(S.wxCache && S.wxCache.city === c.name ? S.wxCache : null); loadWeather().then(paint);
    const iv = setInterval(() => { if (!el.isConnected) return clearInterval(iv); a.tm.textContent = fmtT(a.tz); b.tm.textContent = fmtT(b.tz); }, 15000);
    return el;
  }

  // ───────────────────────── money
  async function loadRate() {
    const c = S.rateCache; if (c && Date.now() - c.t < 12 * 36e5) return c;
    const r = await N.http('https://open.er-api.com/v6/latest/EUR');
    if (r && r.rates && r.rates.ZMW) { S.rateCache = { t: Date.now(), zmw: r.rates.ZMW }; save(); return S.rateCache; }
    return c || null;
  }
  function converter() {
    const eur = h('input', { type: 'text', inputmode: 'decimal', value: '10' }), zmw = h('input', { type: 'text', inputmode: 'decimal', value: '' });
    const info = h('div', { class: 'muted', style: { marginTop: '10px' } }, 'Loading today\'s rate…'); let rate = S.rateCache ? S.rateCache.zmw : 0;
    const num = v => parseFloat(String(v).replace(',', '.')) || 0; const fmt = (n, d) => n ? (Math.round(n * Math.pow(10, d)) / Math.pow(10, d)).toString() : '';
    const fromE = () => { if (rate) zmw.value = fmt(num(eur.value) * rate, 2); }; const fromK = () => { if (rate) eur.value = fmt(num(zmw.value) / rate, 2); };
    eur.addEventListener('input', fromE); zmw.addEventListener('input', fromK);
    const setInfo = c => { if (!c) { info.textContent = 'No internet: the rate could not be loaded.'; return; } rate = c.zmw; fromE(); info.textContent = '1 € = K ' + (Math.round(c.zmw * 100) / 100) + ' · updated ' + new Date(c.t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '. Money transfer services give a slightly lower rate.'; };
    if (S.rateCache) setInfo(S.rateCache); loadRate().then(setInfo);
    return h('div', { class: 'card' }, h('h3', null, 'Euro ↔ Kwacha'),
      h('div', { class: 'conv' }, h('label', { class: 'box' }, h('span', null, '€ EURO'), eur), h('div', { class: 'eq' }, '='), h('label', { class: 'box' }, h('span', null, 'K KWACHA'), zmw)), info);
  }

  // ───────────────────────── holidays
  function easter(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), hh = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - hh - k) % 7, m = Math.floor((a + 11 * hh + 22 * l) / 451); const mo = Math.floor((hh + l - 7 * m + 114) / 31), da = ((hh + l - 7 * m + 114) % 31) + 1; return new Date(y, mo - 1, da); }
  function holidayDate(hd, y) {
    if (hd.m && hd.d) return new Date(y, hd.m - 1, hd.d);
    const rule = String(hd.rule || '').replace(/\s/g, '');
    const m = /^easter([+-]\d+)?$/.exec(rule); if (m) { const e = easter(y); e.setDate(e.getDate() + (+(m[1] || 0))); return e; }
    const f = /^first-mon([+-]\d+)?$/.exec(rule); // e.g. Heroes' Day: first Monday of July
    if (f && hd.m) { const d = new Date(y, hd.m - 1, 1); d.setDate(1 + ((8 - d.getDay()) % 7) + (+(f[1] || 0))); return d; }
    return null;
  }
  function upcoming(n) {
    const today = new Date(); today.setHours(0, 0, 0, 0); const out = [];
    [[H.holidaysZM, '🇿🇲'], [H.holidaysDE, '🇩🇪']].forEach(([list, flag]) => list.forEach(hd => {
      for (const y of [today.getFullYear(), today.getFullYear() + 1]) { const d = holidayDate(hd, y); if (d && d >= today) { out.push({ d, flag, name: hd.name, en: hd.en, note: hd.note }); break; } }
    }));
    return out.sort((a, b) => a.d - b.d).slice(0, n);
  }
  function holidayToday() { const t = new Date().toDateString(); return upcoming(40).filter(x => x.d.toDateString() === t); }

  // ───────────────────────── screen
  const KIND = { embassy: ['🇿🇲', 'Embassy & papers'], news: ['📰', 'News from home'], radio: ['📻', 'Radio & music'], community: ['🤝', 'Zambians & Africans in Germany'], money: ['💸', 'Send money home'], gov: ['🇩🇪', 'Official help in English'], learn: ['🎓', 'Free German learning'] };
  screens.zambia = function () {
    const g = langG(); const body = h('div', { class: 'scroll' });
    MW.add(body, clocksCard());
    const hol = upcoming(4);
    if (hol.length) { MW.add(body, [h('div', { class: 'sect' }, 'Next holidays'), h('div', { class: 'list' }, hol.map(x => h('div', { class: 'item' }, h('div', { class: 'badge sm ' + (x.flag === '🇿🇲' ? 'g' : 'y') }, em(x.flag)), h('div', { class: 'grow' }, h('div', { class: 't' }, x.name + (x.en && x.en !== x.name ? ' · ' + x.en : '')), h('div', { class: 's' }, x.d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + (x.flag === '🇩🇪' ? ' · shops closed' : ''))))))]); }
    MW.add(body, [h('div', { class: 'sect' }, 'Money'), converter()]);
    if (g) {
      const rows = [['welcome', 'Willkommen', 'Welcome'], ['hello', 'Hallo', 'Hello'], ['morning', 'Guten Morgen', 'Good morning'], ['afternoon', 'Guten Tag', 'Good afternoon'], ['evening', 'Guten Abend', 'Good evening'], ['howAreYou', 'Wie geht es dir?', 'How are you?'], ['thanks', 'Danke', 'Thank you'], ['fine', 'Mir geht es gut', 'I am fine'], ['goodNight', 'Gute Nacht', 'Good night'], ['goodbye', 'Auf Wiedersehen', 'Goodbye'], ['wellDone', 'Gut gemacht!', 'Well done!']].filter(r => g[r[0]] && !(r[0] === 'hello' && g.hello === g.howAreYou));
      MW.add(body, [h('div', { class: 'sect' }, g.lang + ' → Deutsch'), h('div', { class: 'list' }, rows.map(r => h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 's' }, g[r[0]] + ' · ' + r[2]), h('div', { class: 't' }, r[1])), sayBtn(r[1], 'de', 'sm'))))]);
    }
    if (H.foods.length) {
      MW.add(body, [h('div', { class: 'sect' }, 'Taste of home: find it in Germany'), h('div', { class: 'grid2' }, H.foods.map(f => h('button', { class: 'cat', onclick: () => foodSheet(f) }, h('span', { class: 'em emoji' }, f.emoji || '🍲'), h('span', { class: 't' }, f.name), h('span', { class: 's' }, f.german || ''))))]);
    }
    if ((H.shops || []).length) {
      MW.add(body, [h('div', { class: 'sect' }, 'Where to buy it'), h('div', { class: 'list' }, H.shops.map(sh => h(sh.url ? 'button' : 'div', { class: 'item', onclick: sh.url ? () => N.open(sh.url) : null }, h('div', { class: 'badge sm g' }, em('🛒')), h('div', { class: 'grow' }, h('div', { class: 't' }, sh.name), h('div', { class: 's' }, (sh.area ? sh.area + '. ' : '') + (sh.note || ''))), sh.url ? icon('web', 'chev') : null)))]);
    }
    const cer = (H.ceremoniesZM || []).filter(c => c.month === new Date().getMonth() + 1);
    if (cer.length) MW.add(body, h('div', { class: 'tip', style: { background: 'var(--green-soft)' } }, h('h3', null, em('🥁'), 'This month at home'), h('p', null, cer.map(c => c.name + ' (' + c.people + ', ' + c.where + ')').join(' · '))));
    Object.keys(KIND).forEach(k => {
      const ls = H.links.filter(l => l.kind === k); if (!ls.length) return;
      MW.add(body, [h('div', { class: 'sect' }, KIND[k][1]), h('div', { class: 'list' }, ls.map(l => h('button', { class: 'item', onclick: () => N.open(l.url) }, h('div', { class: 'badge sm' }, em(KIND[k][0])), h('div', { class: 'grow' }, h('div', { class: 't' }, l.title), l.note ? h('div', { class: 's' }, l.note) : null), icon('web', 'chev'))))]);
    });
    MW.add(body, h('p', { class: 'muted center', style: { margin: '26px 10px 0' } }, 'One Zambia, One Nation 🇿🇲 · und jetzt auch ein Zuhause in Dreieich.'));
    return h('div', { class: 'view' }, h('div', { class: 'bighead' }, h('div', null, h('div', { class: 'de' }, (g && g.welcome ? g.welcome.toUpperCase() + ' · ' : '') + 'HEIMAT'), h('h1', null, 'Zambia'))), body);
  };
  function foodSheet(f) {
    sheet(close => [
      h('div', { style: { fontSize: '54px', lineHeight: 1.1 } }, em(f.emoji || '🍲')), h('h2', null, f.name), h('p', null, f.what),
      f.german ? h('div', { class: 'tip' }, h('h3', null, em('🏷️'), 'In Germany look for'), h('p', { style: { fontSize: '19px', fontWeight: 900 } }, f.german)) : null,
      f.where ? h('div', { class: 'tip', style: { background: 'var(--green-soft)' } }, h('h3', null, em('🛒'), 'Where'), h('p', null, f.where)) : null,
      f.ask ? h('div', { class: 'tip', style: { background: 'var(--brand-soft)' } }, h('h3', null, em('🗣️'), 'Ask in the shop'), h('div', { class: 'row', style: { marginTop: '6px' } }, h('div', { class: 'grow' }, h('div', { style: { fontWeight: 900, fontSize: '18px' } }, f.ask), h('div', { class: 'muted' }, f.askEn || '')), sayBtn(f.ask, 'de'))) : null,
      f.tip ? h('p', { style: { marginTop: '12px' } }, '💡 ' + f.tip) : null,
      h('div', { class: 'gap' }), h('button', { class: 'btn ghost', onclick: () => { close(); MW.tabState.around = 'places'; MW.go('around'); } }, icon('map'), 'African shops near me')
    ]);
  }

  window.Zambia = { clocksCard, langG, city, holidayToday, upcoming, loadWeather };
})();
