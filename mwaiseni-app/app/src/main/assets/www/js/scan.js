/* Letter helper: photograph a German letter → read text → translate → explain what matters. */
(function () {
  'use strict';
  const { D, h, icon, em, N, say, stopSay, sayBtn, toast, sheet, screens, push, page, save, esc } = MW;
  const S = MW.state;

  const SAMPLE = {
    title: 'Sample letter',
    paras: [
      { de: 'Kreis Offenbach · Der Kreisausschuss · Ausländerbehörde · Werner-Hilpert-Straße 1 · 63128 Dietzenbach', en: 'Offenbach District · The District Committee · Immigration Office · Werner-Hilpert-Straße 1 · 63128 Dietzenbach' },
      { de: 'Aktenzeichen: 33.2-BN-2026/04711 · Datum: 20.11.2026', en: 'Reference number: 33.2-BN-2026/04711 · Date: 20 November 2026' },
      { de: 'Betreff: Verlängerung Ihrer Aufenthaltserlaubnis – Termin zur Vorsprache', en: 'Subject: Extension of your residence permit – appointment to come in person' },
      { de: 'Sehr geehrte Frau Banda,', en: 'Dear Mrs Banda,' },
      { de: 'Ihre Aufenthaltserlaubnis läuft am 15.01.2027 ab. Für die Verlängerung haben wir folgenden Termin für Sie reserviert: Dienstag, 15.12.2026 um 10:30 Uhr, Zimmer 2.14.', en: 'Your residence permit expires on 15 January 2027. For the extension we have reserved the following appointment for you: Tuesday, 15 December 2026 at 10:30 am, room 2.14.' },
      { de: 'Bitte bringen Sie folgende Unterlagen im Original mit: gültiger Reisepass, ein aktuelles biometrisches Passfoto, Meldebescheinigung, Nachweis über die Krankenversicherung, Teilnahmebescheinigung des Integrationskurses.', en: 'Please bring the following documents as originals: valid passport, a current biometric passport photo, registration certificate, proof of health insurance, certificate of attendance of the integration course.' },
      { de: 'Die Gebühr beträgt 93,00 € und ist beim Termin mit EC-Karte zu zahlen.', en: 'The fee is €93.00 and must be paid by debit card at the appointment.' },
      { de: 'Sollten Sie den Termin nicht wahrnehmen können, sagen Sie ihn bitte spätestens bis zum 08.12.2026 ab. Bitte beachten Sie Ihre Mitwirkungspflicht.', en: 'If you cannot attend the appointment, please cancel it by 8 December 2026 at the latest. Please note your duty to cooperate.' },
      { de: 'Mit freundlichen Grüßen · Im Auftrag · Müller', en: 'Kind regards · On behalf of · Müller' }
    ]
  };

  // ───────────────────────── analysis
  const MONTHS = { januar: 1, februar: 2, 'märz': 3, maerz: 3, april: 4, mai: 5, juni: 6, juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12 };
  const fmtDate = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  function sentenceAround(text, i, len) {
    let a = Math.max(text.lastIndexOf('. ', i - 1), text.lastIndexOf('\n', i - 1), text.lastIndexOf(': ', i - 30)); a = a < 0 || i - a > 160 ? Math.max(0, i - 90) : a + 1;
    let b = text.indexOf('. ', i + len); const nl = text.indexOf('\n', i + len); if (b < 0 || (nl >= 0 && nl < b)) b = nl; if (b < 0 || b - i > 170) b = Math.min(text.length, i + len + 90);
    return text.slice(a, b + 1).replace(/\s+/g, ' ').trim();
  }
  function analyse(text) {
    const low = text.toLowerCase(); const out = { sender: null, terms: [], dates: [], amounts: [], ibans: [], times: [], level: 'info' };
    out.sender = D.senders.find(s => s.match.some(m => low.indexOf(m.replace(/^\s+/, '')) >= 0)) || null;
    const order = { urgent: 0, important: 1, info: 2 };
    // a match that starts with whitespace means "only at the start of a word" (so Ankündigung does not hit Kündigung)
    const find = m => { const core = m.replace(/^\s+/, ''); if (core === m) return low.indexOf(m); let i = -1; while ((i = low.indexOf(core, i + 1)) >= 0) { if (i === 0 || !/[a-zäöüß]/.test(low[i - 1])) return i; } return -1; };
    D.glossary.forEach(g => { let at = -1; g.match.some(m => { at = find(m); return at >= 0; }); if (at >= 0) out.terms.push(Object.assign({ at }, g)); });
    out.terms.sort((a, b) => (order[a.level] - order[b.level]) || (a.at - b.at));
    // plain deadline words ("spätestens bis", "Frist") mean "there is a date to keep", not an alarm
    const soft = t => /sp[äa]testens|frist|innerhalb|unverz[üu]glich|bis zum|termin/i.test(t.de);
    if (out.terms.some(t => t.level === 'urgent' && !soft(t))) out.level = 'urgent'; else if (out.terms.some(t => t.level !== 'info')) out.level = 'important';
    const seen = {}; const today = new Date(); today.setHours(0, 0, 0, 0);
    const addDate = (d, i, len) => {
      if (isNaN(d) || d.getFullYear() < 2000 || d.getFullYear() > 2100) return; const k = d.toDateString(); if (seen[k]) return; seen[k] = 1;
      const ctx = sentenceAround(text, i, len); const c = ctx.toLowerCase(); const future = d >= today;
      let kind = 'Date';
      if (!future) kind = 'Past date';
      else if (/sp[äa]testens|\bbis\b|frist|innerhalb|läuft .*ab|laeuft .*ab|ablauf|fällig/.test(c)) kind = 'Deadline';
      else if (/termin|uhr|vorsprache|einladung|erscheinen/.test(c)) kind = 'Appointment';
      out.dates.push({ d, kind, ctx, future });
    };
    let m; const r1 = /\b(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4}|\d{2})\b/g;
    while ((m = r1.exec(text))) { const y = +m[3] < 100 ? 2000 + +m[3] : +m[3]; if (+m[2] >= 1 && +m[2] <= 12 && +m[1] >= 1 && +m[1] <= 31) addDate(new Date(y, +m[2] - 1, +m[1]), m.index, m[0].length); }
    const r2 = /\b(\d{1,2})\.\s?(Januar|Februar|März|Maerz|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s+(\d{4})\b/gi;
    while ((m = r2.exec(text))) addDate(new Date(+m[3], MONTHS[m[2].toLowerCase()] - 1, +m[1]), m.index, m[0].length);
    out.dates.sort((a, b) => (b.future - a.future) || (a.d - b.d));
    const r3 = /(?:(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)\s?(?:€|EUR\b|Euro\b))|(?:(?:€|EUR)\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?))/g; const seenA = {};
    while ((m = r3.exec(text))) { const v = (m[1] || m[2]); if (!v || seenA[v]) continue; seenA[v] = 1; out.amounts.push({ v: v + ' €', ctx: sentenceAround(text, m.index, m[0].length) }); }
    const r4 = /\bDE\d{2}(?:\s?\d{4}){4}\s?\d{2}\b/g; while ((m = r4.exec(text))) if (out.ibans.indexOf(m[0]) < 0) out.ibans.push(m[0]);
    const r5 = /\b(\d{1,2})[:.](\d{2})\s?Uhr\b/g; while ((m = r5.exec(text))) { const t = m[1] + ':' + m[2]; if (out.times.indexOf(t) < 0) out.times.push(t); }
    if (out.level === 'info' && (out.dates.some(d => d.kind === 'Deadline' || d.kind === 'Appointment') || out.amounts.length)) out.level = 'important';
    return out;
  }
  function blocksToParas(blocks, text) {
    let ps = (blocks || []).map(b => String(b.text || '').replace(/-\n(?=[a-zäöü])/g, '').replace(/\s*\n\s*/g, ' ').trim()).filter(t => t.length > 1);
    if (!ps.length && text) ps = text.split(/\n{2,}/).map(t => t.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
    const out = []; ps.forEach(p => { const last = out[out.length - 1]; if (last && (last.length < 28 || p.length < 14) && last.length + p.length < 240) out[out.length - 1] = last + ' · ' + p; else out.push(p); });
    return out;
  }

  // ───────────────────────── flow
  function busy(msg) {
    const t = h('p', { style: { fontWeight: 800, marginTop: '16px', fontSize: '18px' } }, msg);
    const el = h('div', { class: 'sheet-bg', style: { alignItems: 'center' } }, h('div', { class: 'card center', style: { width: '78%', maxWidth: '320px', padding: '28px 20px' } }, h('div', { class: 'spinner' }), t));
    document.body.appendChild(el);
    return { set: m => { t.textContent = m; }, close: () => el.remove() };
  }
  async function processFile(file) {
    const b = busy('Reading the letter…');
    try {
      const o = await N.ocr(file);
      if (!o.ok || !String(o.text || '').trim()) { b.close(); toast('I could not find any text. Try again with more light, flat paper and the whole page.'); return; }
      const de = blocksToParas(o.blocks, o.text);
      b.set('Translating to English…');
      const tr = await N.translate(de, 'de', 'en');
      const paras = de.map((d, i) => ({ de: d, en: tr.ok ? (tr.out[i] || '') : '' }));
      b.close();
      if (!tr.ok) toast('I read the text, but the translator is not ready yet. It downloads once (about 30 MB): check the internet and try again.');
      openResult({ t: Date.now(), file, title: guessTitle(de.join('\n')), paras });
    } catch (e) { b.close(); toast('Sorry, something went wrong.'); }
  }
  function guessTitle(text) {
    const a = analyse(text); if (a.sender) return a.sender.name;
    const m = text.match(/Betreff:?\s*([^\n·]{4,60})/i); if (m) return m[1].trim();
    return 'Letter';
  }
  function openResult(scan, keep) {
    if (keep !== false) { S.scans.unshift(scan); while (S.scans.length > 12) S.scans.pop(); save(); }
    push('scanResult', { scan });
  }
  async function startScan(source) {
    if (!N.native) { toast('The camera works inside the Android app. Showing a sample.'); return openResult(Object.assign({ t: Date.now(), sample: true }, SAMPLE), false); }
    const r = await N.scan(source);
    if (!r.ok) { if (r.error === 'unavailable') toast('No camera app found. Try "Choose a picture".'); return; }
    processFile(r.file);
  }
  function scanShared(file) { MW.go('today'); push('scan', {}); processFile(file); }
  /** Text shared from another app: treat it like a scanned letter if it is long German text. */
  async function analyseText(text) {
    const de = blocksToParas(null, text); const b = busy('Translating…');
    const tr = await N.translate(de, 'de', 'en'); b.close();
    openResult({ t: Date.now(), title: guessTitle(text), paras: de.map((d, i) => ({ de: d, en: tr.ok ? (tr.out[i] || '') : '' })) });
  }

  screens.scan = function () {
    const body = [
      h('div', { class: 'card center', style: { marginTop: '4px', padding: '22px 18px' } },
        h('div', { style: { fontSize: '58px', lineHeight: 1.1 } }, em('📬')),
        h('h3', { style: { fontSize: '22px', marginTop: '6px' } }, 'What does this letter say?'),
        h('p', { class: 'muted', style: { marginTop: '6px' } }, 'Take a photo of a German letter. I read it, translate it and show you dates, money and important words.'),
        h('button', { class: 'btn', style: { marginTop: '16px' }, onclick: () => startScan('camera') }, icon('camera'), 'Take a photo'),
        h('button', { class: 'btn ghost', style: { marginTop: '10px' }, onclick: () => startScan('gallery') }, icon('image'), 'Choose a picture'),
        h('button', { class: 'link', onclick: () => openResult(Object.assign({ t: Date.now(), sample: true }, SAMPLE), false) }, 'Try it with a sample letter')),
      h('div', { class: 'tip' }, h('h3', null, em('💡'), 'For a good photo'), h('p', null, 'Put the letter flat on a table. Use good light. Hold the phone straight above the page so the whole page is visible. One page per photo.')),
      h('div', { class: 'tip', style: { background: 'var(--blue-soft)' } }, h('h3', null, em('🔒'), 'Private'), h('p', null, 'Reading and translating happen on your phone. Your letters are not sent anywhere.'))
    ];
    if (S.scans.length) {
      body.push(h('div', { class: 'sect' }, 'Your letters'));
      body.push(h('div', { class: 'list' }, S.scans.map(sc => h('button', { class: 'item', onclick: () => push('scanResult', { scan: sc }) }, h('div', { class: 'badge sm b' }, em('✉️')),
        h('div', { class: 'grow' }, h('div', { class: 't' }, sc.title || 'Letter'), h('div', { class: 's' }, new Date(sc.t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))), icon('chev', 'chev')))));
    }
    return page('Letter helper', 'Briefe verstehen', body);
  };

  screens.scanResult = function ({ scan }) {
    const allDe = scan.paras.map(p => p.de).join('\n'); const allEn = scan.paras.map(p => p.en).filter(Boolean).join('\n');
    const a = analyse(allDe); const body = [];
    const V = { urgent: ['🚨', 'This looks urgent', 'There are words about money or legal deadlines. Do not ignore this letter. Show it to your husband or to an advice centre soon.'],
      important: ['📌', 'You need to do something', 'This letter asks for an action: an appointment, a payment or documents. Check the dates below and write them in your calendar.'],
      info: ['✅', 'Probably just information', 'I did not find deadlines or payment demands. Still, keep the letter in your folder.'] }[a.level];
    if (scan.sample) body.push(h('div', { class: 'banner', style: { margin: '4px 0 0' } }, em('🧪'), h('div', null, 'This is a sample letter so you can see how it works.')));
    if (scan.file && N.native) body.push(h('img', { class: 'scanimg', src: '/scans/' + scan.file, onerror: function () { this.remove(); } }));
    body.push(h('div', { class: 'verdict ' + a.level }, h('div', { class: 'em emoji' }, V[0]), h('div', null, h('h3', null, V[1]), h('p', null, V[2]))));
    if (a.sender) body.push(h('div', { class: 'card row' }, h('div', { class: 'badge b' }, em('🏛️')), h('div', { class: 'grow' }, h('div', { class: 'muted' }, 'From'), h('h3', null, a.sender.name + ' · ' + a.sender.en), h('div', { class: 'muted', style: { marginTop: '2px' } }, a.sender.explain))));

    const facts = [];
    a.dates.forEach(x => facts.push(h('div', { class: 'fact' }, h('div', { class: 'badge sm ' + (x.kind === 'Deadline' ? 'r' : x.kind === 'Appointment' ? 'y' : '') }, em(x.kind === 'Deadline' ? '⏰' : x.kind === 'Appointment' ? '📅' : '🗓️')),
      h('div', { class: 'grow' }, h('div', { class: 'k' }, fmtDate(x.d)), h('div', { class: 'c' }, h('b', null, x.kind + (x.kind === 'Appointment' && a.times.length === 1 ? ' at ' + a.times[0] : '')), ' · ' + x.ctx)),
      x.future ? h('button', { class: 'say sm', 'aria-label': 'Add to calendar', onclick: () => { N.calendar((x.kind === 'Deadline' ? 'Deadline: ' : '') + (scan.title || 'Letter'), x.d.getTime(), x.ctx); if (!N.native) toast('Opens your calendar in the Android app'); } }, icon('cal')) : null)));
    a.amounts.forEach(x => facts.push(h('div', { class: 'fact' }, h('div', { class: 'badge sm g' }, em('💶')), h('div', { class: 'grow' }, h('div', { class: 'k' }, x.v), h('div', { class: 'c' }, x.ctx)))));
    a.ibans.forEach(x => facts.push(h('div', { class: 'fact' }, h('div', { class: 'badge sm b' }, em('🏦')), h('div', { class: 'grow' }, h('div', { class: 'k selectable', style: { fontSize: '16px' } }, x), h('div', { class: 'c' }, 'Bank account (IBAN) for a payment')), h('button', { class: 'say sm', onclick: () => N.copy(x.replace(/\s/g, '')) }, icon('copy')))));
    if (facts.length) { body.push(h('div', { class: 'sect' }, 'Dates & money')); body.push(h('div', { class: 'list' }, facts)); }

    if (a.terms.length) {
      body.push(h('div', { class: 'sect' }, 'Important words in this letter'));
      const box = h('div', { class: 'list' }); const first = a.terms.slice(0, 8), rest = a.terms.slice(8);
      const row = t => h('div', { class: 'term' }, h('div', { class: 'row' }, h('div', { class: 'grow' }, h('span', { class: 'k' }, t.de), h('span', { class: 'lvl ' + t.level }, t.level), h('div', { class: 'g' }, t.en)), sayBtn(t.de, 'de', 'sm')), h('div', { class: 'x' }, t.explain));
      first.forEach(t => box.appendChild(row(t)));
      if (rest.length) { const more = h('button', { class: 'item', style: { justifyContent: 'center', color: 'var(--brand-deep)', fontWeight: 800 }, onclick: () => { more.remove(); rest.forEach(t => box.appendChild(row(t))); } }, 'Show ' + rest.length + ' more words'); box.appendChild(more); }
      body.push(box);
    }

    let showDe = true;
    const tbox = h('div', { class: 'list' });
    scan.paras.forEach(p => tbox.appendChild(h('div', { class: 'para selectable' }, p.en ? h('div', { class: 'en' }, p.en) : null, h('div', { class: 'ge' + (p.en ? '' : ' en') }, p.de))));
    const tgl = h('button', { onclick: () => { showDe = !showDe; tgl.textContent = showDe ? 'Hide German' : 'Show German'; tbox.querySelectorAll('.ge').forEach(e => { if (e.previousSibling) e.classList.toggle('hide', !showDe); }); } }, 'Hide German');
    body.push(h('div', { class: 'sect' }, 'The whole letter in English', allEn ? tgl : null));
    body.push(tbox);
    const readBtn = h('button', { class: 'btn ghost', onclick: () => say(allEn, 'en', { btn: readBtn }) }, icon('speaker'), 'Read to me');
    body.push(h('div', { class: 'btnrow', style: { marginTop: '14px' } }, allEn ? readBtn : null,
      h('button', { class: 'btn ghost', onclick: () => N.share((scan.title || 'Letter') + '\n\n' + allDe + (allEn ? '\n\n— English —\n' + allEn : '')) }, icon('share'), 'Send')));
    body.push(h('button', { class: 'btn soft', style: { marginTop: '10px' }, onclick: () => N.open('https://translate.google.com/?sl=de&tl=en&op=translate&text=' + encodeURIComponent(allDe.slice(0, 4500))) }, icon('web'), 'Check with Google Translate'));
    body.push(h('p', { class: 'muted', style: { margin: '16px 6px 0', fontSize: '13.5px' } }, 'This is a helper, not legal advice. Machine translation can make mistakes. For important letters ask your husband, the office that sent it, or the free Migrationsberatung (see Dreieich → Offices).'));
    if (!scan.sample) body.push(h('button', { class: 'link', style: { color: 'var(--red)' }, onclick: () => { const i = S.scans.indexOf(scan); if (i >= 0) S.scans.splice(i, 1); save(); MW.pop(); } }, 'Delete this letter'));
    return page(scan.title || 'Letter', new Date(scan.t).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }), body);
  };

  window.Scan = { scanShared, analyse, analyseText, startScan };
})();
