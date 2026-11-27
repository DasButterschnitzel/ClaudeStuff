/* Today (home screen), SOS, settings, onboarding. */
(function () {
  'use strict';
  const { D, h, icon, em, N, say, sayBtn, toast, sheet, showBig, screens, push, page, P, save } = MW;
  const S = MW.state;

  function greeting() {
    const hr = new Date().getHours(); const g = Zambia.langG();
    const part = hr >= 4 && hr < 11 ? 'morning' : hr >= 11 && hr < 18 ? 'afternoon' : 'evening';
    const de = part === 'morning' ? 'Guten Morgen' : part === 'afternoon' ? 'Guten Tag' : 'Guten Abend';
    const zm = g ? (g[part] || g.welcome || '') : '';
    return { de, zm };
  }

  // ───────────────────────── Today
  screens.today = function () {
    const g = greeting(); const body = h('div', { class: 'scroll' });
    const hol = Zambia.holidayToday();
    const dateDe = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    MW.add(body, h('div', { class: 'hero' },
      h('div', { class: 'top' },
        h('div', { class: 'grow' }, h('div', { class: 'hello' }, g.zm || 'Hello'), h('h1', null, g.de + ', ' + MW.myName() + '!')),
        h('div', { class: 'row', style: { gap: '8px' } },
          h('button', { class: 'sos', onclick: () => push('sos') }, 'SOS'),
          h('button', { class: 'hbtn', 'aria-label': 'Settings', onclick: () => push('settings') }, icon('gear')))),
      h('div', { class: 'date' }, 'Heute ist ' + dateDe + (hol.length ? ' · ' + hol.map(x => x.flag + ' ' + x.name).join(' · ') : '')),
      h('div', { class: 'flagbar' }, h('i'), h('i'), h('i'), h('i'))));

    const goal = S.settings.goal || 30; const xp = MW.xpToday();
    MW.add(body, h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', null, em('🔥'), ' ' + MW.streakNow()), h('span', null, 'DAY STREAK')),
      h('div', { class: 'stat' }, h('b', null, em(xp >= goal ? '🌟' : '⭐'), ' ' + xp + '/' + goal), h('span', null, 'POINTS TODAY')),
      h('div', { class: 'stat' }, h('b', null, em('📚'), ' ' + Learn.learnedCount()), h('span', null, 'WORDS'))));

    const u = Learn.nextUnit();
    if (u) {
      const p = Learn.prog(u.id); const step = Math.min(2, p.stars); const idx = D.units.indexOf(u) + 1;
      MW.add(body, h('button', { class: 'card continue tap', style: { width: '100%', display: 'block' }, onclick: () => push('unit', { id: u.id }) },
        h('div', { class: 'row' }, h('div', { class: 'grow' }, h('div', { class: 'muted' }, (p.stars || idx > 1 ? 'Continue' : 'Start here') + ' · Unit ' + idx), h('h3', { style: { fontSize: '23px' } }, u.title), h('div', { class: 'muted' }, u.titleDe + ' · ' + Learn.STEPS[step].t)), h('div', { class: 'big emoji' }, u.emoji)),
        h('span', { class: 'go' }, icon('play'), '5 minutes of German')));
    }

    MW.add(body, h('div', { class: 'quick' },
      h('button', { class: 'tile c1', onclick: () => MW.go('speak', 'talk') }, h('div', { class: 'ic emoji' }, '🎤'), h('div', { class: 't' }, 'Talk for me'), h('div', { class: 's' }, 'English ↔ Deutsch, with voice')),
      h('button', { class: 'tile c2', onclick: () => push('scan') }, h('div', { class: 'ic emoji' }, '📬'), h('div', { class: 't' }, 'Read a letter'), h('div', { class: 's' }, 'Photo → English + what to do')),
      h('button', { class: 'tile c3', onclick: () => MW.go('speak', 'phrases') }, h('div', { class: 'ic emoji' }, '💬'), h('div', { class: 't' }, 'Phrases'), h('div', { class: 's' }, 'Doctor, shop, office, bus…')),
      h('button', { class: 'tile c4', onclick: () => MW.go('speak', 'cards') }, h('div', { class: 'ic emoji' }, '🪪'), h('div', { class: 't' }, 'Show a card'), h('div', { class: 's' }, 'Big German text to show')))) ;

    const stepsDone = STEPS.filter(x => S.checks[x.id]).length;
    if (stepsDone < STEPS.length) {
      const cd = countdowns().filter(c => c.days != null).sort((a, b) => a.days - b.days)[0];
      MW.add(body, h('button', { class: 'card tap', style: { width: '100%', display: 'block' }, onclick: () => push('steps') },
        h('div', { class: 'row' }, h('div', { class: 'badge g' }, em('🧭')), h('div', { class: 'grow' }, h('h3', null, 'My first steps in Germany'), h('div', { class: 'muted' }, stepsDone + ' of ' + STEPS.length + ' done' + (cd ? ' · ' + cd.short : ''))), icon('chev', 'chev')),
        h('div', { class: 'progress g', style: { marginTop: '12px' } }, h('i', { style: { width: Math.round(stepsDone / STEPS.length * 100) + '%' } }))));
    }

    const due = Learn.dueCount();
    if (due) MW.add(body, h('button', { class: 'card tap row', style: { width: '100%' }, onclick: () => Learn.startLesson({ exercises: Learn.buildReview(), xp: 10 }) }, h('div', { class: 'badge y' }, em('🔁')), h('div', { class: 'grow' }, h('h3', null, due + ' word' + (due > 1 ? 's' : '') + ' to refresh'), h('div', { class: 'muted' }, 'A quick review keeps them in your head')), icon('chev', 'chev')));

    const w = Learn.wordOfDay();
    if (w) MW.add(body, [h('div', { class: 'sect' }, 'Wort des Tages · word of the day'), h('div', { class: 'card wod' },
      h('div', { class: 'row' }, h('div', { class: 'badge y', style: { width: '58px', height: '58px', fontSize: '32px' } }, em(w.w.emoji || '💬')), h('div', { class: 'grow' }, h('div', { class: 'w' }, P(w.w.de)), h('div', { class: 'e' }, P(w.w.en))), sayBtn(w.w.de, 'de')),
      w.ex ? h('div', { class: 'ex row' }, h('div', { class: 'grow' }, h('div', { style: { fontWeight: 800 } }, P(w.ex.de)), h('div', { class: 'muted' }, P(w.ex.en))), sayBtn(w.ex.de, 'de', 'sm')) : null)]);

    if ((S.profile.note || '').trim()) MW.add(body, h('div', { class: 'card note' }, h('div', { class: 'muted', style: { marginBottom: '4px' } }, '❤️ ' + (S.profile.partnerName ? 'From ' + S.profile.partnerName : 'For you')), h('p', null, S.profile.note)));

    MW.add(body, [h('div', { class: 'sect' }, 'Here & home'), Zambia.clocksCard()]);

    const tip = Around.tipOfDay();
    if (tip) MW.add(body, [h('div', { class: 'sect' }, 'Good to know in Germany', h('button', { onclick: () => MW.go('around', 'guide') }, 'All')),
      h('button', { class: 'card tap row', style: { width: '100%' }, onclick: () => push('guide', { id: tip.id }) }, h('div', { class: 'badge' }, em(tip.emoji)), h('div', { class: 'grow' }, h('h3', null, tip.title), h('div', { class: 'muted' }, tip.summary)), icon('chev', 'chev'))]);
    return h('div', { class: 'view' }, body);
  };
  // the hero bleeds to the screen edge: no top padding on Today's scroll area
  // (handled by .hero negative margins)

  // ───────────────────────── first steps checklist with two legal clocks
  const STEPS = [
    { id: 'anmeldung', e: '🏠', t: 'Register your address', de: 'die Anmeldung', s: 'At the Bürgerbüro Dreieich, within two weeks of moving in.', g: 'first-steps' },
    { id: 'permit', e: '🪪', t: 'Residence permit appointment', de: 'der Aufenthaltstitel', s: 'At the Ausländerbehörde of Kreis Offenbach in Dietzenbach. Ask early.', g: 'residence-permit' },
    { id: 'insurance', e: '💳', t: 'Health insurance card', de: 'die Versichertenkarte', s: 'You need it for every doctor visit.', g: 'health-doctor' },
    { id: 'bank', e: '🏦', t: 'Your own bank account', de: 'das Girokonto', s: 'For your own money, salary and transfers home.', g: 'money-banking' },
    { id: 'course', e: '📚', t: 'Sign up for the integration course', de: 'der Integrationskurs', s: 'German A1 → B1 plus life in Germany. Places can have waiting lists, so ask soon.', g: 'integration-course', clock: 'course' },
    { id: 'doctor', e: '🩺', t: 'Find a family doctor', de: 'der Hausarzt', s: 'Register with one practice before you are ill.', g: 'health-doctor' },
    { id: 'licence', e: '🚗', t: 'Decide about your driving licence', de: 'der Führerschein', s: 'A Zambian licence is only valid here for a short time.', g: 'on-the-road', clock: 'licence' },
    { id: 'phone', e: '📱', t: 'German SIM card and internet', de: 'die SIM-Karte', s: 'A German number makes appointments much easier.', g: 'phone-internet' },
    { id: 'ticket', e: '🚆', t: 'Ride to Frankfurt on your own once', de: 'die Fahrkarte', s: 'S3 or S4 from Dreieich-Buchschlag. After the first time it is easy.', g: 'public-transport' },
    { id: 'work', e: '💼', t: 'Check your qualifications', de: 'die Anerkennung', s: 'You are usually allowed to work. See if your Zambian certificates can be recognised.', g: 'working' },
    { id: 'people', e: '🤝', t: 'Meet one new person', de: 'neue Leute kennenlernen', s: 'Course, church, women\'s group or a neighbour. One is enough to start.', g: 'making-friends' },
    { id: 'sos', e: '🆘', t: 'Add your address and husband\'s number', de: 'der Notfall', s: 'So the SOS screen in this app is ready when you need it.', go: 'settings' }
  ];
  function addMonths(iso, n) { const d = new Date(iso + 'T12:00:00'); if (isNaN(d)) return null; d.setMonth(d.getMonth() + n); return d; }
  function countdowns() {
    const pr = S.profile; const mk = (id, end, label) => { if (!end) return { id, days: null }; const days = Math.ceil((end - Date.now()) / 864e5); return { id, end, days, short: days >= 0 ? label + ': ' + days + ' days left' : label + ': time is over' }; };
    return [mk('licence', pr.arrived ? addMonths(pr.arrived, 6) : null, 'Driving licence'), mk('course', pr.permit ? addMonths(pr.permit, 12) : null, 'Course right')];
  }
  screens.steps = function () {
    const pr = S.profile; const cds = countdowns(); const body = [];
    const done = STEPS.filter(x => S.checks[x.id]).length;
    body.push(h('div', { class: 'card', style: { marginTop: '4px' } }, h('h3', null, done === STEPS.length ? 'All done. Ausgezeichnet! 🎉' : done + ' of ' + STEPS.length + ' done'), h('div', { class: 'muted' }, 'One step at a time is enough. Tap a step to read how it works.'),
      h('div', { class: 'progress g', style: { marginTop: '10px' } }, h('i', { style: { width: Math.round(done / STEPS.length * 100) + '%' } }))));
    const dateIn = (key) => { const el = h('input', { class: 'input', type: 'date', value: pr[key] || '' }); el.addEventListener('change', () => { pr[key] = el.value; save(); MW.render(); }); return el; };
    const clock = (c, title, text) => h('div', { class: 'tip', style: { background: c.days == null ? 'var(--bg2)' : c.days < 45 ? 'var(--red-soft)' : 'var(--gold-soft)' } }, h('h3', null, em('⏳'), title), h('p', null, c.days == null ? text : (c.days >= 0 ? c.days + ' days left (until ' + c.end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '). ' : 'This date has passed. ') + text));
    body.push(h('div', { class: 'sect' }, 'Two clocks nobody tells you about'));
    body.push(h('div', { class: 'card' },
      field('The day you moved to Germany', dateIn('arrived')),
      clock(cds[0], 'Zambian driving licence', 'It is usually valid for 6 months after you move here. After that you need the German theory and driving test, so plan early.'),
      field('The date your first residence permit was issued', dateIn('permit')),
      clock(cds[1], 'Your right to an integration course', 'The legal right to a course place usually ends one year after your first permit. Register in time.'),
      h('p', { class: 'muted', style: { marginTop: '10px', fontSize: '13.5px' } }, 'These are general rules, not legal advice. Your own dates can differ: ask the Ausländerbehörde or the free Migrationsberatung.')));
    body.push(h('div', { class: 'sect' }, 'Your steps'));
    body.push(h('div', { class: 'list' }, STEPS.map(x => {
      const on = !!S.checks[x.id]; const cd = x.clock ? cds.find(c => c.id === x.clock) : null;
      const box = h('button', { class: 'say sm', style: on ? { background: 'var(--green)', color: '#fff' } : { background: 'var(--bg2)', color: 'var(--ink3)' }, 'aria-label': 'Done', onclick: (e) => { e.stopPropagation(); S.checks[x.id] = !on; save(); N.haptic(on ? 'tap' : 'ok'); if (!on && STEPS.every(y => S.checks[y.id])) MW.confetti(); MW.render(); } }, icon('check'));
      return h('div', { class: 'item', onclick: () => x.go ? push(x.go) : (D.guide.some(g => g.id === x.g) ? push('guide', { id: x.g }) : null) }, box,
        h('div', { class: 'grow' }, h('div', { class: 't', style: on ? { textDecoration: 'line-through', opacity: .55 } : null }, em(x.e), ' ' + x.t), h('div', { class: 's' }, h('b', { style: { color: 'var(--brand-deep)' } }, x.de), ' · ' + x.s + (cd && cd.days != null && !on ? ' ⏳ ' + cd.short.split(': ')[1] : ''))), icon('chev', 'chev'));
    })));
    return page('My first steps', 'Meine ersten Schritte', body);
  };

  // ───────────────────────── SOS
  screens.sos = function () {
    const pr = S.profile; const body = [];
    const call = (num) => () => N.open('tel:' + num);
    body.push(h('button', { class: 'sosbtn r', style: { marginTop: '4px' }, onclick: call('112') }, h('div', { class: 'num' }, '112'), h('div', null, h('div', { class: 't' }, 'Ambulance & fire'), h('div', { class: 's' }, 'Notruf · life in danger · free, 24 h'))));
    body.push(h('button', { class: 'sosbtn b', onclick: call('110') }, h('div', { class: 'num' }, '110'), h('div', null, h('div', { class: 't' }, 'Police'), h('div', { class: 's' }, 'Polizei · danger, crime, accident'))));
    body.push(h('button', { class: 'sosbtn g', onclick: call('116117') }, h('div', { class: 'num', style: { fontSize: '22px' } }, '116 117'), h('div', null, h('div', { class: 't' }, 'Doctor at night & weekend'), h('div', { class: 's' }, 'Ärztlicher Bereitschaftsdienst · sick, but not life-threatening'))));
    body.push(h('button', { class: 'sosbtn p', onclick: call('116016') }, h('div', { class: 'num', style: { fontSize: '22px' } }, '116 016'), h('div', null, h('div', { class: 't' }, 'Help line for women'), h('div', { class: 's' }, 'Hilfetelefon · free, 24 h, confidential, also in English'))));
    if (pr.partnerPhone) body.push(h('button', { class: 'sosbtn o', onclick: call(String(pr.partnerPhone).replace(/[^+\d]/g, '')) }, h('div', { class: 'num', style: { fontSize: '34px' } }, em('❤️')), h('div', null, h('div', { class: 't' }, 'Call ' + (pr.partnerName || 'my husband')), h('div', { class: 's' }, pr.partnerPhone))));

    const addrDe = pr.address ? 'Meine Adresse ist: ' + pr.address : '';
    body.push(h('div', { class: 'sect' }, 'On the phone, say'));
    body.push(h('div', { class: 'list' },
      h('div', { class: 'item' }, h('div', { class: 'badge sm r' }, em('📍')), h('div', { class: 'grow' }, h('div', { class: 't' }, 'Wo? · Where?'), h('div', { class: 's selectable' }, pr.address ? addrDe : 'Add your address in Settings so you can read it here.')), pr.address ? sayBtn(addrDe, 'de', 'sm') : h('button', { class: 'btn small soft', onclick: () => push('settings') }, 'Add')),
      h('div', { class: 'item' }, h('div', { class: 'badge sm r' }, em('❓')), h('div', { class: 'grow' }, h('div', { class: 't' }, 'Was? · What happened?'), h('div', { class: 's' }, 'Use a sentence from the list below.'))),
      h('div', { class: 'item' }, h('div', { class: 'badge sm r' }, em('👥')), h('div', { class: 'grow' }, h('div', { class: 't' }, 'Wie viele? · How many people?'), h('div', { class: 's' }, 'Eine Person. / Zwei Personen.')), sayBtn('Eine Person ist verletzt.', 'de', 'sm')),
      h('div', { class: 'item' }, h('div', { class: 'badge sm r' }, em('⏳')), h('div', { class: 'grow' }, h('div', { class: 't' }, 'Warten · Wait'), h('div', { class: 's' }, 'Do not hang up. Wait for questions. Many operators understand English: speak slowly.')))));

    body.push(h('div', { class: 'sect' }, 'Emergency sentences'));
    body.push(h('div', { class: 'list' }, D.emergency.map(p => {
      const isAddr = /Adresse/.test(p.de); const de = isAddr && pr.address ? p.de.replace(/\s*…\s*$/, ' ') + pr.address : p.de;
      return h('button', { class: 'item phrase', onclick: () => showBig(de, p.en) }, h('div', { class: 'grow' }, h('div', { class: 't' }, p.en), h('div', { class: 's de' }, de)), sayBtn(de, 'de', 'sm'));
    })));
    body.push(h('p', { class: 'muted', style: { margin: '14px 6px 0', fontSize: '13.5px' } }, 'Tap a sentence to show it in very large letters. 112 and 110 work from every phone, even without credit.'));
    return page('SOS · Notfall', 'Help, fast', body);
  };

  // ───────────────────────── settings
  function field(label, input) { return h('label', { class: 'field' }, h('span', null, label), input); }
  function bind(obj, key, attrs, onchange) {
    const el = h(attrs && attrs.rows ? 'textarea' : 'input', Object.assign({ class: 'input', value: obj[key] || '' }, attrs || {}));
    if (attrs && attrs.rows) el.value = obj[key] || '';
    el.addEventListener('input', () => { obj[key] = el.value; save(); onchange && onchange(); });
    return el;
  }
  function select(obj, key, options, onchange) {
    const el = h('select', { class: 'input' }, options.map(o => h('option', { value: o[0], selected: String(obj[key]) === String(o[0]) }, o[1])));
    el.addEventListener('change', () => { obj[key] = el.value; save(); onchange && onchange(); });
    return el;
  }
  function toggle(obj, key, onchange) {
    const el = h('button', { class: 'switch' + (obj[key] ? ' on' : ''), role: 'switch', onclick: async () => { obj[key] = !obj[key]; el.classList.toggle('on', !!obj[key]); save(); onchange && onchange(el); } });
    return el;
  }
  function syncReminder() { N.setReminder(S.settings.remind, +S.settings.remindH, +S.settings.remindM, S.settings.remind ? Learn.reminderWords() : []); }
  const langOptions = () => D.home.greetings.map(g => [g.id, g.lang]).concat([['en', 'English only']]);
  const cityOptions = () => (D.home.cities.length ? D.home.cities : [{ name: 'Lusaka' }]).map(c => [c.name, c.name]);

  screens.settings = function () {
    const pr = S.profile, st = S.settings; const body = [];
    body.push(h('div', { class: 'sect', style: { marginTop: '8px' } }, 'About you'));
    body.push(h('div', { class: 'card' }, field('Your first name', bind(pr, 'name', { placeholder: 'Your name', autocapitalize: 'words' })),
      field('Your family name (used in the lessons)', bind(pr, 'surname', { placeholder: 'Family name', autocapitalize: 'words' })),
      field('Language of home', select(pr, 'lang', langOptions())), field('Your home town in Zambia (clock & weather)', select(pr, 'city', cityOptions(), () => { S.wxCache = null; save(); }))));
    body.push(h('div', { class: 'sect' }, 'For emergencies'));
    body.push(h('div', { class: 'card' }, field("Husband's name", bind(pr, 'partnerName', { placeholder: 'Name', autocapitalize: 'words' })), field("Husband's phone number", bind(pr, 'partnerPhone', { placeholder: '+49 …', type: 'tel', inputmode: 'tel' })),
      field('Your home address in Germany', bind(pr, 'address', { rows: 2, placeholder: 'Street and number, 63303 Dreieich' })),
      h('p', { class: 'muted', style: { marginTop: '8px' } }, 'Used only on this phone: on the SOS screen and on the "I am lost" card.')));
    body.push(h('div', { class: 'sect' }, 'A note for the home screen'));
    body.push(h('div', { class: 'card' }, bind(pr, 'note', { rows: 3, placeholder: 'A few loving words that she sees every day…' })));

    body.push(h('div', { class: 'sect' }, 'Learning'));
    const timeSel = select(st, 'remindH', Array.from({ length: 16 }, (_, i) => [i + 7, MW.pad(i + 7) + ':00']), syncReminder);
    body.push(h('div', { class: 'list' },
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'Daily word reminder'), h('div', { class: 's' }, 'One German word as a notification')), toggle(st, 'remind', async (el) => {
        if (st.remind) { const r = await N.askNotifications(); if (!r.ok && N.native) { st.remind = false; el.classList.remove('on'); save(); toast('Please allow notifications in the phone settings.'); } }
        syncReminder();
      })),
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'Reminder time')), h('div', { style: { width: '130px' } }, timeSel)),
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'Daily goal')), h('div', { style: { width: '130px' } }, select(st, 'goal', [[15, 'Easy · 15'], [30, 'Normal · 30'], [50, 'Serious · 50'], [80, 'Intense · 80']]))),
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'Speaking speed'), h('div', { class: 's' }, 'Tip: hold a speaker button for extra slow')), h('div', { style: { width: '130px' } }, select(st, 'rate', [[0.7, 'Slow'], [0.9, 'Normal'], [1.05, 'Fast']], () => { st.rate = +st.rate; save(); say('Guten Tag! Wie geht es Ihnen?', 'de'); }))),
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'Speak translations aloud')), toggle(st, 'speakOut')),
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'My English sounds most like')), h('div', { style: { width: '178px' } }, select(st, 'accent', [['en-ZA', 'Southern Africa'], ['en-KE', 'East Africa'], ['en-NG', 'West Africa'], ['en-GB', 'British'], ['en-US', 'American']])))));

    body.push(h('div', { class: 'sect' }, 'Phone'));
    const trStatus = h('div', { class: 's' }, N.native ? 'Checking…' : 'Available in the Android app');
    const trBtn = h('button', { class: 'btn small soft hide', onclick: async () => { trBtn.disabled = true; trStatus.textContent = 'Downloading…'; const r = await N.downloadModel(); trStatus.textContent = r.ok ? 'Ready. Works without internet ✓' : 'Download failed. Check the internet.'; trBtn.disabled = false; if (r.ok) trBtn.classList.add('hide'); } }, 'Download');
    if (N.native) N.modelStatus().then(r => { trStatus.textContent = r.ok && r.ready ? 'Ready. Works without internet ✓' : 'Not downloaded yet (about 30 MB)'; if (!(r.ok && r.ready)) trBtn.classList.remove('hide'); });
    body.push(h('div', { class: 'list' },
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'Offline translator'), trStatus), trBtn),
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'German voice'), h('div', { class: 's' }, 'No sound? Install the German voice.')), h('button', { class: 'btn small soft', onclick: () => say('Hallo ' + MW.myName() + '! Schön, dass du da bist.', 'de') }, 'Test'), N.native ? h('button', { class: 'btn small ghost', onclick: () => N.installVoices() }, 'Install') : null),
      h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, 'Design')), h('div', { style: { width: '130px' } }, select(st, 'theme', [['auto', 'Automatic'], ['light', 'Light'], ['dark', 'Dark']], MW.applyTheme)))));

    body.push(h('div', { class: 'tip', style: { background: 'var(--blue-soft)' } }, h('h3', null, em('✨'), 'Hidden helpers'), h('p', null, 'In WhatsApp or any app: mark a German text, tap "Share" or "Mwaiseni: translate", and it opens here in English. You can also share a photo of a letter to Mwaiseni.')));
    body.push(h('div', { class: 'tip', style: { background: 'var(--green-soft)' } }, h('h3', null, em('🔒'), 'Private'), h('p', null, 'No account, no adverts, no tracking. Your name, address, progress and letters stay on this phone. Only weather and the exchange rate are loaded from the internet.')));
    body.push(h('button', { class: 'link', style: { color: 'var(--red)', marginTop: '10px' }, onclick: () => sheet(close => [h('h2', null, 'Start again from zero?'), h('p', null, 'This deletes your progress, saved phrases and letters on this phone.'), h('div', { class: 'gap' }), h('button', { class: 'btn red', onclick: () => { MW.reset(); close(); location.reload(); } }, 'Delete everything'), h('button', { class: 'link', style: { width: '100%', textAlign: 'center' }, onclick: close }, 'Cancel')]) }, 'Reset the app'));
    body.push(h('p', { class: 'muted center', style: { marginTop: '6px', fontSize: '13px' } }, 'Mwaiseni ' + N.info.version + ' · made with love in Dreieich'));
    return page('Settings', 'Einstellungen', body);
  };

  // ───────────────────────── onboarding
  function onboarding(done) {
    let step = 0; const pr = S.profile, st = S.settings; let remind = true;
    const root = h('div', { class: 'onb' }); document.body.appendChild(root);
    function draw() {
      root.innerHTML = '';
      const pg = h('div', { class: 'pg' }); const ft = h('div', { class: 'ft' });
      const dots = h('div', { class: 'dots' }, [0, 1, 2, 3].map(i => h('i', { class: i === step ? 'on' : '' })));
      const next = (label, fn) => h('button', { class: 'btn', onclick: () => { N.haptic(); if (fn && fn() === false) return; step++; draw(); } }, label);
      if (step === 0) {
        MW.add(pg, [h('div', { class: 'logo emoji' }, '🏡'), h('h1', null, 'Mwaiseni!'), h('p', null, 'Welcome. This little app is your friend in Germany. It helps you speak, understand and feel at home in Dreieich.'),
          h('div', { style: { marginTop: '14px' } },
            h('div', { class: 'feat' }, h('i', null, '🎤'), 'Speak English, the phone speaks German'),
            h('div', { class: 'feat' }, h('i', null, '📬'), 'Photograph a letter and understand it'),
            h('div', { class: 'feat' }, h('i', null, '🇩🇪'), 'Learn German in 5 minutes a day'),
            h('div', { class: 'feat' }, h('i', null, '📍'), 'Find offices, shops and people near you'),
            h('div', { class: 'feat' }, h('i', null, '🇿🇲'), 'Keep Zambia close'))]);
        MW.add(ft, [dots, next('Let\'s start')]);
      } else if (step === 1) {
        const inp = h('input', { class: 'input', placeholder: 'Your first name', value: pr.name, autocapitalize: 'words', autocomplete: 'off' });
        inp.addEventListener('input', () => { pr.name = inp.value; });
        const sur = h('input', { class: 'input', style: { marginTop: '10px' }, placeholder: 'Family name (optional)', value: pr.surname || '', autocapitalize: 'words', autocomplete: 'off' });
        sur.addEventListener('input', () => { pr.surname = sur.value.trim(); });
        MW.add(pg, [h('h2', null, 'What is your name?'), h('p', null, 'In German: "Wie heißt du?"'), h('div', { style: { marginTop: '22px' } }, inp, sur),
          h('p', { style: { fontSize: '15.5px', marginTop: '18px' } }, 'The lessons use your name, so you learn to introduce yourself.')]);
        MW.add(ft, [dots, next('Continue', () => { pr.name = inp.value.trim(); save(); })]);
        setTimeout(() => inp.focus(), 350);
      } else if (step === 2) {
        MW.add(pg, [h('h2', null, 'Which language feels like home?'), h('p', { style: { fontSize: '16px' } }, 'I will greet you in it every day.')]);
        const box = h('div', { style: { marginTop: '10px' } });
        const opts = D.home.greetings.map(g => ({ id: g.id, t: g.lang, s: [g.welcome, g.thanks].filter(Boolean).join(' · ') })).concat([{ id: 'en', t: 'English only', s: 'Welcome · Thank you' }]);
        opts.forEach(o => { const b = h('button', { class: 'choice' + (pr.lang === o.id ? ' on' : ''), onclick: () => { pr.lang = o.id; save(); [...box.children].forEach(c => c.classList.remove('on')); b.classList.add('on'); N.haptic(); } }, h('span', { class: 'grow' }, o.t, h('small', null, o.s))); box.appendChild(b); });
        const citySel = h('select', { class: 'input', style: { fontSize: '18px' } }, cityOptions().map(o => h('option', { value: o[0], selected: pr.city === o[0] }, o[1])));
        citySel.addEventListener('change', () => { pr.city = citySel.value; save(); });
        MW.add(pg, [box, h('p', { style: { fontSize: '16px', marginTop: '18px', marginBottom: '8px' } }, 'Your home town (for the clock and weather):'), citySel]);
        MW.add(ft, [dots, next('Continue')]);
      } else {
        const sw = h('button', { class: 'switch on', onclick: () => { remind = !remind; sw.classList.toggle('on', remind); } });
        const phone = h('input', { class: 'input', style: { fontSize: '17px' }, placeholder: "Husband's phone number (optional)", type: 'tel', value: pr.partnerPhone }); phone.addEventListener('input', () => { pr.partnerPhone = phone.value; });
        const addr = h('input', { class: 'input', style: { fontSize: '17px', marginTop: '10px' }, placeholder: 'Home address in Germany (optional)', value: pr.address }); addr.addEventListener('input', () => { pr.address = addr.value; });
        MW.add(pg, [h('h2', null, 'Almost done, ' + MW.myName() + '!'),
          h('div', { class: 'choice', style: { marginTop: '20px' } }, h('span', { class: 'grow' }, 'A German word every day', h('small', null, 'A friendly reminder in the morning')), sw),
          h('p', { style: { fontSize: '16px', marginTop: '22px', marginBottom: '10px' } }, 'For the SOS screen. It stays on this phone only:'), phone, addr]);
        MW.add(ft, [dots, h('button', { class: 'btn', onclick: async () => {
          save(); st.remind = remind; S.onboarded = true; MW.saveNow();
          if (remind) { const r = await N.askNotifications(); if (!r.ok) st.remind = false; }
          syncReminder(); save();
          if (N.native) N.downloadModel();
          root.remove(); done();
          MW.confetti(); const g = Zambia.langG(); say('Herzlich willkommen, ' + MW.myName() + '!', 'de'); toast((g && g.welcome ? g.welcome + '! ' : '') + 'Herzlich willkommen!');
        } }, 'Open my app')]);
      }
      root.appendChild(pg); root.appendChild(ft);
    }
    draw();
  }
  window.Today = { onboarding, syncReminder };
})();
