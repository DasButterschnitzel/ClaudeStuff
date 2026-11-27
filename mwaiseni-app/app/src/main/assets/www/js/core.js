/* Mwaiseni core: DOM helper, storage, native bridge, voice, router. */
(function () {
  'use strict';
  const D = window.DATA = window.DATA || {};
  D.units = [].concat(D.unitsA || [], D.unitsB || []);
  D.phrasebook = D.phrasebook || []; D.showcards = D.showcards || []; D.emergency = D.emergency || [];
  D.guide = D.guide || []; D.glossary = D.glossary || []; D.senders = D.senders || [];
  D.places = D.places || []; D.placeCats = D.placeCats || [];
  D.home = D.home || {}; ['greetings', 'cities', 'foods', 'links', 'holidaysZM', 'holidaysDE'].forEach(k => { D.home[k] = D.home[k] || []; });

  // ───────────────────────── DOM helper
  function h(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (let i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) c.forEach(x => add(el, x));
    else el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  const ICONS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-9"/><path d="M12 17.2c-2.2-1.7-2.7-2.8-2.7-3.7a1.5 1.5 0 0 1 2.7-.9 1.5 1.5 0 0 1 2.7.9c0 .9-.5 2-2.7 3.700"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.500 3H20v15H6.500A2.500 2.500 0 0 0 4 20.500z"/><path d="M4 20.500A2.500 2.500 0 0 0 6.500 23H20"/><path d="M8.500 8h7M8.500 12h5"/>',
    chat: '<path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z"/><path d="M8.500 10.500h7M8.500 14h4.500"/>',
    map: '<path d="M12 21s7-5.600 7-11.500A7 7 0 0 0 5 9.500C5 15.400 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.600"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.800 2.700 2.800 15.300 0 18M12 3c-2.800 2.700-2.800 15.300 0 18"/>',
    speaker: '<path d="M4 9.500v5h3.500L12 19V5L7.500 9.500z"/><path d="M15.500 9a4 4 0 0 1 0 6M18 6.500a7.500 7.500 0 0 1 0 11"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3"/>',
    camera: '<path d="M4 8h3l1.500-2.500h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.600"/>',
    image: '<rect x="3.500" y="4.500" width="17" height="15" rx="2.500"/><circle cx="9" cy="10" r="1.700"/><path d="m5 18 5-5 3.500 3.500 2.500-2.500 3 3"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    gear: '<path d="M4 7h9M19 7h1M4 12h3M13 12h7M4 17h10M20 17h0"/><circle cx="16" cy="7" r="2.4"/><circle cx="10" cy="12" r="2.4"/><circle cx="17" cy="17" r="2.4"/>',
    phone: '<path d="M6.500 3.500h3l1.500 4-2 1.500a11 11 0 0 0 6 6l1.500-2 4 1.500v3a2 2 0 0 1-2 2A15.500 15.500 0 0 1 4.500 5.500a2 2 0 0 1 2-2z"/>',
    route: '<circle cx="6" cy="18" r="2.500"/><circle cx="18" cy="6" r="2.500"/><path d="M8.500 18H15a3.500 3.500 0 0 0 0-7H9a3.500 3.500 0 0 1 0-7h6.500"/>',
    web: '<path d="M14 5h5v5M19 5l-8 8"/><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"/>',
    copy: '<rect x="8.500" y="8.500" width="11" height="11" rx="2"/><path d="M15.500 5.500v-1a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1"/>',
    share: '<circle cx="6" cy="12" r="2.500"/><circle cx="17.500" cy="6" r="2.500"/><circle cx="17.500" cy="18" r="2.500"/><path d="m8.200 10.800 7-3.600M8.200 13.200l7 3.600"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    star: '<path d="m12 3.500 2.600 5.400 5.900.8-4.300 4.100 1 5.900L12 16.900l-5.200 2.800 1-5.900L3.500 9.700l5.900-.8z"/>',
    search: '<circle cx="11" cy="11" r="6.500"/><path d="m16 16 4.500 4.500"/>',
    play: '<path d="M7 4.500v15l12-7.500z"/>',
    send: '<path d="M12 19V5M5.500 11.500 12 5l6.500 6.500"/>',
    swap: '<path d="M7 4v15M7 19l-3.500-3.500M7 19l3.500-3.500M17 20V5M17 5l-3.500 3.500M17 5l3.500 3.500"/>',
    cal: '<rect x="4" y="5.500" width="16" height="15" rx="2.500"/><path d="M4 10h16M8.500 3.500v4M15.500 3.500v4"/>',
    trash: '<path d="M5 7h14M10 7V4.500h4V7M7 7l1 12.500h8L17 7"/>',
    heart: '<path d="M12 20c-5.500-4.300-8-7.200-8-10.300A4.200 4.200 0 0 1 12 7.300a4.200 4.200 0 0 1 8 2.400c0 3.100-2.500 6-8 10.300z"/>',
    turtle: '<path d="M4 14a7 7 0 0 1 14 0z"/><path d="M18 13h2.500a1.500 1.500 0 0 0 0-3H18M6.500 14v3M15.500 14v3"/>'
  };
  function icon(name, cls) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = ICONS[name] || '';
    return s;
  }
  const em = (e, cls) => h('span', { class: 'emoji ' + (cls || '') }, e);

  // ───────────────────────── storage
  const KEY = 'mwaiseni.v1';
  const defaults = () => ({
    onboarded: false,
    profile: { name: '', surname: '', lang: 'bem', city: 'Lusaka', partnerName: '', partnerPhone: '', address: '', note: '', arrived: '', permit: '' },
    settings: { rate: 0.9, theme: 'auto', accent: 'en-ZA', remind: false, remindH: 9, remindM: 0, goal: 30, speakOut: true },
    xp: { total: 0, days: {} }, streak: { n: 0, last: '' },
    units: {}, srs: {}, checks: {}, favs: [], talk: [], scans: [], seenGuide: {}, rateCache: null, wxCache: null
  });
  let S = defaults();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw) { const d = defaults(); S = Object.assign(d, raw); S.profile = Object.assign(d.profile, raw.profile); S.settings = Object.assign(d.settings, raw.settings); S.xp = Object.assign({ total: 0, days: {} }, raw.xp); S.streak = Object.assign({ n: 0, last: '' }, raw.streak); }
  } catch (e) { S = defaults(); }
  let saveT = null;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }, 60); }
  function saveNow() { clearTimeout(saveT); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  window.addEventListener('pagehide', saveNow);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });

  // ───────────────────────── dates, xp, streak
  const pad = n => (n < 10 ? '0' : '') + n;
  const dayKey = (d) => { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  function addXp(n) {
    const k = dayKey();
    S.xp.total += n; S.xp.days[k] = (S.xp.days[k] || 0) + n;
    if (S.streak.last !== k) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      S.streak.n = (S.streak.last === dayKey(y)) ? S.streak.n + 1 : 1;
      S.streak.last = k;
    }
    const keys = Object.keys(S.xp.days).sort(); while (keys.length > 60) delete S.xp.days[keys.shift()];
    save();
  }
  function streakNow() {
    if (!S.streak.last) return 0;
    const y = new Date(); y.setDate(y.getDate() - 1);
    return (S.streak.last === dayKey() || S.streak.last === dayKey(y)) ? S.streak.n : 0;
  }
  const xpToday = () => S.xp.days[dayKey()] || 0;

  // ───────────────────────── text helpers
  const myName = () => (S.profile.name || '').trim() || 'Natasha';
  const mySurname = () => (S.profile.surname || '').trim() || 'Banda';
  // lessons are written for "{name} Banda": swap in her own first and family name
  const P = (t) => String(t == null ? '' : t).replace(/\{name\}/g, myName()).replace(/\bBanda\b/g, mySurname());
  function norm(s) {
    return String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    if (a === b) return 0; const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = []; for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function similar(a, b) { a = norm(a); b = norm(b); const L = Math.max(a.length, b.length) || 1; return 1 - lev(a, b) / L; }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ───────────────────────── native bridge
  const NB = window.NativeBridge || null;
  const waiting = {}; let seq = 0; const listeners = {};
  window.__native = function (id, payload) { const f = waiting[id]; if (f) { delete waiting[id]; try { f(payload || {}); } catch (e) { console.error(e); } } };
  window.__nativeEvent = function (name, payload) { (listeners[name] || []).forEach(f => { try { f(payload); } catch (e) { console.error(e); } }); };
  function ncall(method) {
    const args = [].slice.call(arguments, 1);
    return new Promise(resolve => {
      if (!NB || typeof NB[method] !== 'function') return resolve({ ok: false, error: 'nonative' });
      const id = 'r' + (++seq); waiting[id] = resolve;
      try { NB[method].apply(NB, args.concat(id)); } catch (e) { delete waiting[id]; resolve({ ok: false, error: 'failed' }); }
    });
  }
  let info = { version: 'web', speech: false, tts: true, notifications: false, sdk: 0 };
  try { if (NB) info = Object.assign(info, JSON.parse(NB.info())); } catch (e) { }

  const N = {
    native: !!NB, info,
    on(name, f) { (listeners[name] = listeners[name] || []).push(f); },
    haptic(kind) { try { NB && NB.haptic(kind || 'tap'); } catch (e) { } },
    open(url) { try { if (NB) return NB.open(url); } catch (e) { } window.open(url, '_blank'); return true; },
    share(text) { try { if (NB) return NB.share(text); } catch (e) { } if (navigator.share) navigator.share({ text }).catch(() => { }); },
    calendar(title, ms, desc) { try { NB && NB.calendar(title, String(ms), desc || ''); } catch (e) { } },
    keepAwake(on) { try { NB && NB.keepAwake(!!on); } catch (e) { } },
    setBars(bg, light) { try { NB && NB.setBars(bg, !!light); } catch (e) { } },
    installVoices() { try { NB && NB.installVoices(); } catch (e) { } },
    listen(lang, prompt) { return ncall('listen', lang, prompt || ''); },
    scan(source) { return ncall('scan', source); },
    ocr(file) { return ncall('ocr', file); },
    modelStatus() { return ncall('modelStatus'); },
    downloadModel() { return ncall('downloadModel'); },
    askNotifications() { return ncall('askNotifications'); },
    setReminder(on, hr, min, words) { try { NB && NB.setReminder(!!on, hr | 0, min | 0, JSON.stringify(words || [])); } catch (e) { } },
    async translate(texts, src, tgt) {
      const one = !Array.isArray(texts); const arr = one ? [texts] : texts;
      if (!NB) {                               // browser preview: no engine available
        if (window.__mockTranslate) { const out = arr.map(t => window.__mockTranslate(t, src, tgt)); return { ok: true, out: one ? out[0] : out }; }
        return { ok: false, error: 'nonative' };
      }
      const r = await ncall('translate', JSON.stringify(arr), src, tgt);
      if (r.ok) r.out = one ? r.out[0] : r.out;
      return r;
    },
    async http(url) {
      if (NB) { const r = await ncall('httpGet', url); if (!r.ok) return null; try { return JSON.parse(r.body); } catch (e) { return null; } }
      try { const r = await fetch(url); if (!r.ok) return null; return await r.json(); } catch (e) { return null; }
    },
    copy(text) {
      try { navigator.clipboard.writeText(text).then(() => toast('Copied'), () => fallbackCopy(text)); } catch (e) { fallbackCopy(text); }
    }
  };
  function fallbackCopy(text) {
    const t = h('textarea', { style: { position: 'fixed', opacity: 0 } }); t.value = text; document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); toast('Copied'); } catch (e) { } t.remove();
  }

  // ───────────────────────── voice out
  let curBtn = null, sayToken = 0, voiceWarned = false;
  function stopSay() {
    sayToken++;
    try { NB ? NB.stopSpeak() : (window.speechSynthesis && speechSynthesis.cancel()); } catch (e) { }
    if (curBtn) { curBtn.classList.remove('playing'); curBtn = null; }
  }
  /** Speak text. lang: 'de' | 'en'. Resolves when finished (or failed). */
  function say(text, lang, opts) {
    opts = opts || {};
    text = P(text).replace(/…/g, ' ').trim();
    stopSay();
    const token = sayToken;
    const tag = (lang === 'en') ? 'en-GB' : 'de-DE';
    const rate = (opts.slow ? 0.6 : 1) * (S.settings.rate || 0.9);
    if (opts.btn) { curBtn = opts.btn; curBtn.classList.add('playing'); }
    const fin = () => { if (token === sayToken && curBtn) { curBtn.classList.remove('playing'); curBtn = null; } };
    if (!text) { fin(); return Promise.resolve(false); }
    if (NB) {
      return ncall('speak', text, tag, String(rate)).then(r => {
        fin();
        if (!r.ok && (r.error === 'novoice' || r.error === 'notts') && !voiceWarned) { voiceWarned = true; voiceHelp(); }
        return !!r.ok;
      });
    }
    return new Promise(resolve => {
      try {
        if (!window.speechSynthesis) { setTimeout(() => { fin(); resolve(false); }, 350); return; }
        const u = new SpeechSynthesisUtterance(text); u.lang = tag; u.rate = rate;
        u.onend = () => { fin(); resolve(true); }; u.onerror = () => { fin(); resolve(false); };
        speechSynthesis.speak(u);
        setTimeout(() => { fin(); resolve(true); }, 400 + text.length * 90);
      } catch (e) { fin(); resolve(false); }
    });
  }
  function voiceHelp() {
    sheet(close => [
      h('h2', null, 'German voice is missing'),
      h('p', null, 'Your phone has no German voice installed yet. Install "Deutsch (Deutschland)" once, then every word can be spoken to you.'),
      h('div', { class: 'gap' }),
      h('button', { class: 'btn', onclick: () => { N.installVoices(); close(); } }, 'Install the voice'),
      h('button', { class: 'link', style: { width: '100%', textAlign: 'center' }, onclick: close }, 'Later')
    ]);
  }
  /** Round speaker button. Long-press = slow. */
  function sayBtn(text, lang, cls) {
    let timer = null, long = false;
    const b = h('button', { class: 'say ' + (cls || ''), 'aria-label': 'Listen' }, icon('speaker'));
    const start = () => { long = false; timer = setTimeout(() => { long = true; N.haptic(); say(typeof text === 'function' ? text() : text, lang, { btn: b, slow: true }); }, 480); };
    const end = () => clearTimeout(timer);
    b.addEventListener('touchstart', start, { passive: true }); b.addEventListener('touchend', end); b.addEventListener('touchcancel', end);
    b.addEventListener('click', (e) => { e.stopPropagation(); if (long) { long = false; return; } if (b.classList.contains('playing')) return stopSay(); say(typeof text === 'function' ? text() : text, lang, { btn: b }); });
    return b;
  }

  // ───────────────────────── toast, sheet, show-big
  function toast(msg) {
    const r = document.getElementById('toast-root'); r.innerHTML = '';
    const t = h('div', { class: 'toast' }, msg); r.appendChild(t);
    setTimeout(() => { if (t.parentNode) t.remove(); }, 2200);
  }
  const overlays = []; // functions that close the top-most overlay (for the Android back button)
  function pushOverlay(closeFn) { overlays.push(closeFn); return () => { const i = overlays.indexOf(closeFn); if (i >= 0) overlays.splice(i, 1); }; }
  function sheet(build) {
    const root = document.getElementById('sheet-root');
    let off;
    const close = () => { if (bg.parentNode) bg.remove(); off && off(); };
    const box = h('div', { class: 'sheet', onclick: e => e.stopPropagation() }, h('div', { class: 'grab' }));
    const bg = h('div', { class: 'sheet-bg', onclick: close }, box);
    add(box, build(close));
    root.appendChild(bg); off = pushOverlay(close);
    return close;
  }
  /** Full-screen, huge text to show to another person. */
  function showBig(de, en, extra) {
    stopSay();
    const txt = P(de) + (extra ? '\n' + extra : '');
    const len = txt.length;
    const size = len < 30 ? 50 : len < 60 ? 42 : len < 110 ? 34 : len < 180 ? 28 : 23;
    let off;
    const close = () => { stopSay(); N.keepAwake(false); if (el.parentNode) el.remove(); off && off(); };
    const sb = h('button', { class: 'btn', onclick: () => say(txt, 'de', {}) }, icon('speaker'), 'Play aloud');
    const el = h('div', { class: 'show' },
      h('div', { class: 'hint' }, 'Bitte lesen · please read'),
      h('div', { class: 'txt selectable', style: { fontSize: size + 'px', whiteSpace: 'pre-line' } }, txt),
      en ? h('div', { class: 'en' }, P(en)) : null,
      h('div', { class: 'acts' }, sb, h('button', { class: 'btn ghost', style: { flex: '0 0 110px', background: '#fff', color: '#111' }, onclick: close }, 'Close')));
    document.body.appendChild(el); N.keepAwake(true); off = pushOverlay(close);
  }
  function confetti() {
    const c = h('div', { class: 'confetti' }); const cols = ['#198A00', '#DE2010', '#111', '#FFC247', '#E8590C', '#fff'];
    for (let i = 0; i < 46; i++) c.appendChild(h('i', { style: { left: Math.random() * 100 + '%', background: pick(cols), animationDuration: (1.6 + Math.random() * 1.8) + 's', animationDelay: (Math.random() * .5) + 's', transform: 'rotate(' + Math.random() * 360 + 'deg)' } }));
    document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
  }

  // ───────────────────────── router
  const TABS = [
    { id: 'today', label: 'Today', icon: 'home' },
    { id: 'learn', label: 'Learn', icon: 'book' },
    { id: 'speak', label: 'Speak', icon: 'chat' },
    { id: 'around', label: 'Dreieich', icon: 'map' },
    { id: 'zambia', label: 'Zambia', icon: 'globe' }
  ];
  const screens = {};       // name -> (params) => element
  let tab = 'today'; let stack = [];   // pushed screens above the tab root
  const appEl = () => document.getElementById('app');
  function render() {
    stopSay();
    const app = appEl(); app.innerHTML = '';
    const top = stack[stack.length - 1];
    let view;
    try { view = top ? screens[top.name](top.params || {}) : screens[tab]({}); }
    catch (e) { console.error(e); view = h('div', { class: 'view' }, h('div', { class: 'scroll pad-top' }, h('div', { class: 'card' }, h('h3', null, 'Something went wrong'), h('p', { class: 'muted' }, String(e && e.message || e))))); }
    if (!top) view.classList.add('root-view');
    app.appendChild(view);
    if (!top || top.nav) app.appendChild(navBar());
  }
  function navBar() {
    const due = (window.Learn && window.Learn.dueCount) ? window.Learn.dueCount() : 0;
    return h('nav', { class: 'nav' }, TABS.map(t => h('button', { class: t.id === tab ? 'on' : '', onclick: () => { N.haptic(); go(t.id); } },
      h('span', { class: 'pill' }, icon(t.icon)), t.label, (t.id === 'learn' && due > 0) ? h('span', { class: 'dot' }, due > 99 ? '99' : due) : null)));
  }
  function go(t, sub) { tab = t; stack = []; if (sub) tabState[t] = sub; render(); }
  function push(name, params) { stack.push({ name, params }); render(); }
  function pop() { if (stack.length) { stack.pop(); render(); return true; } return false; }
  function replace(name, params) { stack.pop(); stack.push({ name, params }); render(); }
  const tabState = {};
  window.__back = function () {
    if (overlays.length) { overlays[overlays.length - 1](); return true; }
    if (pop()) return true;
    if (tab !== 'today') { go('today'); return true; }
    return false;
  };
  function topbar(title, sub, right) {
    return h('div', { class: 'topbar' },
      h('button', { class: 'iconbtn', 'aria-label': 'Back', onclick: () => window.__back() }, icon('back')),
      h('div', { class: 'grow' }, h('h1', null, title), sub ? h('div', { class: 'sub' }, sub) : null), right || null);
  }
  function page(title, sub, body, right) {
    return h('div', { class: 'view' }, topbar(title, sub, right), h('div', { class: 'scroll' }, body));
  }

  // ───────────────────────── theme
  function applyTheme() {
    const pref = S.settings.theme;
    const dark = pref === 'dark' || (pref === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    N.setBars(dark ? '#17120E' : '#FFF7EC', !dark);
  }
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme); } catch (e) { }

  window.MW = { D, S: () => S, state: S, save, saveNow, h, add, icon, em, N, say, stopSay, sayBtn, toast, sheet, showBig, confetti, pushOverlay,
    screens, go, push, pop, replace, render, tabState, topbar, page, applyTheme, addXp, streakNow, xpToday, dayKey, pad,
    P, myName, norm, similar, shuffle, pick, esc, defaults,
    reset() { const d = defaults(); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, d); saveNow(); } };
})();
