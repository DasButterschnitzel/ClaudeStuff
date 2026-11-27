/* Learn: course path, unit pages, lesson player (exercise engine), spaced repetition. */
(function () {
  'use strict';
  const { D, h, icon, em, N, say, stopSay, sayBtn, toast, sheet, confetti, screens, push, pop, render, page, addXp, P, norm, similar, shuffle, pick, save } = MW;
  const S = MW.state;
  const U = () => D.units;
  const unitById = id => U().find(u => u.id === id);
  const prog = id => (S.units[id] = S.units[id] || { stars: 0 });
  const STEPS = [
    { e: '🌱', t: 'Words 1', s: 'first 6 words' },
    { e: '🌿', t: 'Words 2', s: '6 more words' },
    { e: '🌳', t: 'Sentences', s: 'build & speak' }
  ];

  // ───────────────────────── spaced repetition (Leitner boxes)
  const GAPS = [0, 1, 2, 4, 8, 16, 30]; // days until the next review, per box
  const wkey = (u, w) => u.id + '|' + w.de;
  function touchWord(u, w, ok) {
    const k = wkey(u, w); const r = S.srs[k] || { b: 0, d: 0 };
    if (ok) { r.b = Math.min(6, r.b + 1); r.d = Date.now() + GAPS[r.b] * 864e5 - 6 * 36e5; }
    else { r.b = 1; r.d = Date.now() + 10 * 6e4; }
    S.srs[k] = r; save();
  }
  function dueWords() {
    const now = Date.now(); const out = [];
    U().forEach(u => u.words.forEach(w => { const r = S.srs[wkey(u, w)]; if (r && r.d <= now) out.push({ u, w, r }); }));
    return out.sort((a, b) => a.r.d - b.r.d);
  }
  const dueCount = () => dueWords().length;
  const learnedCount = () => Object.keys(S.srs).length;
  function nextUnit() { return U().find(u => prog(u.id).stars < 3) || U()[U().length - 1]; }

  // ───────────────────────── exercise builders
  function wordEx(type, u, w, pool) {
    return { type, u, w, pool: pool || u.words };
  }
  function buildLesson(u, step) {
    const W = u.words, Sx = u.sentences; const ex = [];
    if (step < 2) {
      const ws = W.slice(step * 6, step * 6 + 6); const [a, b, c, d, e, f] = ws;
      ex.push({ type: 'intro', u, w: a }, { type: 'intro', u, w: b }, { type: 'intro', u, w: c },
        wordEx('de_en', u, a), wordEx('listen', u, c), wordEx('en_de', u, b),
        { type: 'intro', u, w: d }, { type: 'intro', u, w: e }, { type: 'intro', u, w: f },
        wordEx('en_de', u, d), wordEx('de_en', u, f), wordEx('listen', u, e),
        { type: 'match', u, ws: shuffle(ws).slice(0, 5) },
        { type: 'order', u, s: Sx[step * 2] }, wordEx('type', u, pick(ws)),
        { type: 'order', u, s: Sx[step * 2 + 1] });
      if (step === 1) { ex.push(wordEx('de_en', u, pick(W.slice(0, 6))), { type: 'speak', u, s: Sx[0] }); }
    } else {
      const rev = shuffle(W).slice(0, 4);
      ex.push({ type: 'hear_s', u, s: Sx[4] }, { type: 'order', u, s: Sx[4] }, wordEx('en_de', u, rev[0]),
        { type: 'order', u, s: Sx[5] }, { type: 'speak', u, s: Sx[1] }, wordEx('listen', u, rev[1]),
        { type: 'hear_s', u, s: Sx[6] }, { type: 'order', u, s: Sx[6] }, wordEx('type', u, rev[2]),
        { type: 'order', u, s: Sx[7] }, { type: 'speak', u, s: Sx[5] }, { type: 'match', u, ws: shuffle(W).slice(0, 5) },
        { type: 'order', u, s: Sx[2] }, wordEx('de_en', u, rev[3]), { type: 'speak', u, s: Sx[7] });
    }
    return ex.filter(x => (x.w || x.s || x.ws));
  }
  function buildReview() {
    const due = dueWords().slice(0, 12);
    return due.map(({ u, w, r }) => wordEx(r.b >= 3 ? pick(['type', 'en_de', 'listen']) : pick(['de_en', 'en_de', 'listen']), u, w));
  }
  function buildFree() { // practise without anything due: random learned words (or first unit)
    const pool = []; U().forEach(u => u.words.forEach(w => { if (S.srs[wkey(u, w)]) pool.push({ u, w }); }));
    const src = pool.length >= 8 ? pool : U()[0].words.map(w => ({ u: U()[0], w }));
    return shuffle(src).slice(0, 10).map(({ u, w }) => wordEx(pick(['de_en', 'en_de', 'listen']), u, w));
  }
  function distract(pool, w, n, field) {
    const seen = {}; seen[norm(w[field])] = 1; const out = [];
    shuffle(pool).forEach(x => { const k = norm(x[field]); if (out.length < n && !seen[k]) { seen[k] = 1; out.push(x); } });
    return out;
  }
  const bare = de => String(de).replace(/^(der|die|das|ein|eine)\s+/i, '');
  const PRAISE = ['Sehr gut!', 'Super!', 'Richtig!', 'Genau!', 'Prima!', 'Toll!', 'Perfekt!', 'Klasse!'];

  // ───────────────────────── lesson player
  function startLesson(opts) {
    let queue = opts.exercises.slice(); const total0 = queue.length;
    let idx = 0, right = 0, wrong = 0, retried = new Set(), off = null;
    const startT = Date.now();
    const bar = h('i', { style: { width: '0%' } });
    const body = h('div', { class: 'body' });
    const foot = h('div', { class: 'foot' });
    const root = h('div', { class: 'lesson' },
      h('div', { class: 'bar' }, h('button', { class: 'iconbtn', 'aria-label': 'Close', onclick: askQuit }, icon('close')), h('div', { class: 'progress' }, bar)),
      body, foot);
    document.body.appendChild(root);
    off = MW.pushOverlay(askQuit);
    function close() { stopSay(); off && off(); if (root.parentNode) root.remove(); render(); }
    function askQuit() {
      if (idx >= queue.length || idx === 0) return close();
      sheet(cl => [h('h2', null, 'Stop this lesson?'), h('p', null, 'Your progress in this lesson will not be saved.'), h('div', { class: 'gap' }),
        h('button', { class: 'btn', onclick: cl }, 'Keep learning'),
        h('button', { class: 'link', style: { width: '100%', textAlign: 'center' }, onclick: () => { cl(); close(); } }, 'Stop')]);
    }
    function setFoot(nodes, cls) { foot.className = 'foot ' + (cls || ''); foot.innerHTML = ''; MW.add(foot, nodes); }
    function next() { idx++; show(); }
    function result(ok, x, correctText, note) {
      if (ok) { right++; N.haptic('ok'); } else { wrong++; N.haptic('bad'); if (!retried.has(x)) { retried.add(x); queue.push(x); } }
      if (x.w && x.type !== 'intro') touchWord(x.u, x.w, ok);
      setFoot([
        h('div', { class: 'fb' }, ok ? '✓ ' + pick(PRAISE) : 'Not quite'),
        (!ok && correctText) ? h('div', { class: 'fbs' }, 'Correct: ', h('b', null, P(correctText))) : (note ? h('div', { class: 'fbs' }, note) : null),
        h('button', { class: 'btn ' + (ok ? 'green' : 'red'), onclick: next }, 'Continue')
      ], ok ? 'ok' : 'bad');
    }
    function show() {
      stopSay();
      bar.style.width = Math.min(100, Math.round(idx / queue.length * 100)) + '%';
      body.innerHTML = ''; body.scrollTop = 0;
      if (idx >= queue.length) return finish();
      const x = queue[idx];
      RENDER[x.type](x);
    }
    const RENDER = {
      intro(x) {
        const w = x.w;
        MW.add(body, h('div', { class: 'introcard' }, h('div', { class: 'new' }, 'NEW WORD'), h('div', { class: 'em emoji' }, w.emoji || '💬'),
          h('div', { class: 'd' }, P(w.de)), h('div', { class: 'e' }, P(w.en)),
          h('div', { style: { display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '18px' } }, sayBtn(w.de, 'de', 'lg'))));
        setFoot(h('button', { class: 'btn', onclick: next }, 'Got it'));
        say(w.de, 'de');
      },
      de_en(x) { mc(x, 'What does this mean?', P(x.w.de), true, 'en', x.w.en); say(x.w.de, 'de'); },
      en_de(x) { mc(x, 'How do you say this in German?', P(x.w.en), false, 'de', x.w.de, true); },
      listen(x) {
        MW.add(body, h('div', { class: 'ask' }, 'Listen. What do you hear?'));
        const sb = sayBtn(x.w.de, 'de', 'lg');
        MW.add(body, h('div', { style: { display: 'flex', justifyContent: 'center', margin: '20px 0 4px' } }, sb));
        options(x, 'en', x.w.en, false, true); say(x.w.de, 'de', { btn: sb });
      },
      hear_s(x) {
        MW.add(body, h('div', { class: 'ask' }, 'Listen. What does it mean?'));
        const sb = sayBtn(x.s.de, 'de', 'lg');
        MW.add(body, h('div', { style: { display: 'flex', justifyContent: 'center', margin: '20px 0 4px' } }, sb));
        const opts = shuffle([x.s].concat(distract(x.u.sentences, x.s, 2, 'en')));
        const box = h('div', { class: 'opts' }); let done = false;
        opts.forEach(o => { const b = h('button', { class: 'opt' }, P(o.en)); b.onclick = () => { if (done) return; done = true; const ok = o === x.s; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) [...box.children][opts.indexOf(x.s)].classList.add('right'); result(ok, x, x.s.de + ' = ' + x.s.en, P(x.s.de)); }; box.appendChild(b); });
        MW.add(body, box); setFoot(h('button', { class: 'btn ghost', onclick: () => say(x.s.de, 'de', { slow: true }) }, em('🐢'), 'Play slowly'));
        say(x.s.de, 'de', { btn: sb });
      },
      type(x) {
        const w = x.w;
        MW.add(body, [h('div', { class: 'ask' }, 'Write it in German'), h('div', { class: 'qrow' }, h('div', { class: 'em emoji', style: { fontSize: '44px' } }, w.emoji || ''), h('div', { class: 'q' }, P(w.en)))]);
        const inp = h('input', { class: 'input', style: { marginTop: '22px', fontSize: '22px' }, placeholder: 'Type here…', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
        const keys = h('div', { class: 'wrap', style: { marginTop: '12px' } }, ['ä', 'ö', 'ü', 'ß'].map(c => h('button', { class: 'chip', onclick: () => { inp.value += c; inp.focus(); check.disabled = false; } }, c)));
        const check = h('button', { class: 'btn', disabled: true, onclick: () => {
          const a = norm(inp.value), t = norm(P(w.de)), t2 = norm(bare(P(w.de)));
          const ok = a === t || a === t2 || (t.length > 5 && Math.min(similar(a, t), 1) >= 0.86) || (t2.length > 5 && similar(a, t2) >= 0.86);
          inp.blur(); inp.disabled = true; say(w.de, 'de');
          result(ok, x, w.de, (ok && a !== t && a !== t2) ? 'Almost perfect: ' + P(w.de) : P(w.de));
        } }, 'Check');
        inp.addEventListener('input', () => { check.disabled = !inp.value.trim(); });
        inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) check.click(); });
        MW.add(body, [inp, keys, h('button', { class: 'link', onclick: () => { queue.splice(idx, 1); idx--; next(); } }, "I can't type now")]);
        setFoot(check);
      },
      match(x) {
        MW.add(body, h('div', { class: 'ask' }, 'Tap the pairs'));
        const left = shuffle(x.ws), rightC = shuffle(x.ws); let selL = null, selR = null, gone = 0, errs = 0;
        const box = h('div', { class: 'pairs' });
        const mk = (w, side) => { const b = h('button', { class: 'opt' }, side === 'L' ? P(w.de) : P(w.en)); b.w = w; b.onclick = () => tap(b, side); return b; };
        const Ls = left.map(w => mk(w, 'L')), Rs = rightC.map(w => mk(w, 'R'));
        for (let i = 0; i < Ls.length; i++) { box.appendChild(Ls[i]); box.appendChild(Rs[i]); }
        function tap(b, side) {
          if (side === 'L') { if (selL) selL.classList.remove('sel'); selL = b; say(b.w.de, 'de'); } else { if (selR) selR.classList.remove('sel'); selR = b; }
          b.classList.add('sel'); N.haptic();
          if (selL && selR) {
            const a = selL, c = selR; selL = selR = null;
            if (a.w === c.w) { [a, c].forEach(e => { e.classList.remove('sel'); e.classList.add('gone'); }); gone++; touchWord(x.u, a.w, true);
              if (gone === x.ws.length) { right++; N.haptic('ok'); setFoot([h('div', { class: 'fb' }, '✓ ' + pick(PRAISE)), h('button', { class: 'btn green', onclick: next }, 'Continue')], 'ok'); } }
            else { errs++; [a, c].forEach(e => { e.classList.remove('sel'); e.classList.add('wrong'); setTimeout(() => e.classList.remove('wrong'), 420); }); N.haptic('bad'); }
          }
        }
        MW.add(body, box); setFoot(h('div', { class: 'muted center' }, 'German on the left, English on the right'));
      },
      order(x) {
        const target = P(x.s.de); const m = target.match(/^(.*?)([.!?]+)$/); const core = m ? m[1] : target; const punct = m ? m[2] : '';
        const words = core.split(/\s+/).filter(Boolean);
        const others = []; x.u.sentences.forEach(s => { if (s !== x.s) P(s.de).replace(/[.!?,]/g, '').split(/\s+/).forEach(t => { if (t && words.map(norm).indexOf(norm(t)) < 0 && others.map(norm).indexOf(norm(t)) < 0) others.push(t); }); });
        const tiles = shuffle(words.map((t, i) => ({ t, i })).concat(shuffle(others).slice(0, words.length <= 3 ? 3 : 2).map((t, i) => ({ t, i: 100 + i }))));
        const chosen = [];
        const line = h('div', { class: 'answerline' }); const bank = h('div', { class: 'tiles' });
        const check = h('button', { class: 'btn', disabled: true, onclick: () => {
          const ans = chosen.map(c => c.t).join(' '); const ok = norm(ans) === norm(core);
          [...bank.children].forEach(b => b.classList.add('used')); [...line.children].forEach(b => b.style.pointerEvents = 'none');
          say(target, 'de'); result(ok, x, target, P(x.s.en));
        } }, 'Check');
        function redraw() {
          line.innerHTML = ''; chosen.forEach((c, k) => line.appendChild(h('button', { class: 'tilew', onclick: () => { chosen.splice(k, 1); c.el.classList.remove('used'); N.haptic(); redraw(); } }, c.t)));
          if (punct && chosen.length) line.appendChild(h('span', { style: { alignSelf: 'center', fontSize: '22px', fontWeight: 900, marginLeft: '-4px' } }, punct));
          check.disabled = chosen.length === 0;
        }
        tiles.forEach(tl => { tl.el = h('button', { class: 'tilew', onclick: () => { chosen.push(tl); tl.el.classList.add('used'); N.haptic(); redraw(); } }, tl.t); bank.appendChild(tl.el); });
        MW.add(body, [h('div', { class: 'ask' }, 'Build the German sentence'), h('div', { class: 'q small' }, P(x.s.en)), line, bank]);
        setFoot(check);
      },
      speak(x) {
        const target = P(x.s.de);
        MW.add(body, [h('div', { class: 'ask' }, 'Say it out loud'),
          h('div', { class: 'qrow' }, sayBtn(target, 'de'), h('div', { class: 'grow' }, h('div', { class: 'q small' }, target), h('div', { class: 'muted', style: { marginTop: '4px' } }, P(x.s.en))))]);
        const heard = h('div', { class: 'heard' }, N.info.speech ? 'Tap the microphone and speak' : 'Listen, then say it aloud');
        let tries = 0;
        const skip = () => { queue.splice(idx, 1); idx--; next(); };
        if (!N.info.speech) {
          MW.add(body, [h('div', { style: { margin: 'auto 0', textAlign: 'center' } }, h('div', { style: { fontSize: '72px' } }, em('🗣️')), heard)]);
          setFoot(h('div', { class: 'btnrow' }, h('button', { class: 'btn ghost', onclick: () => say(target, 'de', { slow: true }) }, em('🐢'), 'Slowly'), h('button', { class: 'btn green', onclick: () => { right++; next(); } }, 'I said it')));
          say(target, 'de'); return;
        }
        const mic = h('button', { class: 'micbig', 'aria-label': 'Speak', onclick: async () => {
          stopSay(); heard.textContent = 'Listening…';
          const r = await N.listen('de-DE', target);
          if (!r.ok) { heard.textContent = r.error === 'unavailable' ? 'Voice input is not available on this phone.' : 'I did not hear anything. Try again.'; return; }
          let best = 0, bestT = r.results[0]; r.results.forEach(t => { const sc = similar(t, target); if (sc > best) { best = sc; bestT = t; } });
          tries++; heard.textContent = 'I heard: “' + bestT + '”';
          if (best >= 0.72) { result(true, x, null, best > 0.93 ? 'Perfect pronunciation! 🎯' : 'Good, people will understand you.'); }
          else if (tries >= 3) { result(false, x, target); }
          else { N.haptic('bad'); toast('Almost. Listen again and try once more.'); say(target, 'de', { slow: true }); }
        } }, icon('mic'));
        MW.add(body, [h('div', { style: { margin: 'auto 0' } }, mic, heard)]);
        setFoot(h('button', { class: 'btn ghost', onclick: skip }, "I can't speak right now"));
        say(target, 'de');
      }
    };
    function mc(x, ask, q, withAudio, field, correct, speakOnPick) {
      MW.add(body, [h('div', { class: 'ask' }, ask), h('div', { class: 'qrow' }, withAudio ? sayBtn(x.w.de, 'de') : (x.w.emoji ? h('div', { class: 'emoji', style: { fontSize: '44px' } }, x.w.emoji) : null), h('div', { class: 'q' }, q))]);
      options(x, field, correct, speakOnPick, false);
    }
    function options(x, field, correct, speakOnPick, emojiGrid) {
      const pool = x.pool.length >= 4 ? x.pool : x.u.words;
      const opts = shuffle([x.w].concat(distract(pool, x.w, 3, field)));
      const useGrid = field === 'en' && opts.every(o => o.emoji) && opts.every(o => P(o.en).length <= 22);
      const box = h('div', { class: 'opts' + (useGrid ? ' two' : '') }); let done = false;
      opts.forEach(o => {
        const b = h('button', { class: 'opt' }, useGrid ? h('span', { class: 'em emoji' }, o.emoji) : null, h('span', null, P(o[field])));
        b.onclick = () => {
          if (done) return; done = true; const ok = o === x.w;
          b.classList.add(ok ? 'right' : 'wrong'); [...box.children].forEach((c, i) => { if (opts[i] === x.w) c.classList.add('right'); else if (c !== b) c.classList.add('dim'); });
          if (speakOnPick || !ok) say(x.w.de, 'de');
          result(ok, x, P(x.w.de) + ' = ' + P(x.w.en), P(x.w.de) + ' = ' + P(x.w.en));
        };
        box.appendChild(b);
      });
      MW.add(body, box); setFoot(h('div', { class: 'muted center' }, 'Choose the right answer'));
    }
    function finish() {
      bar.style.width = '100%';
      const acc = Math.round(right / Math.max(1, right + wrong) * 100);
      const xp = (opts.xp || 15) + (acc >= 90 ? 5 : 0);
      addXp(xp); if (opts.onDone) opts.onDone(acc);
      const g = (D.home.greetings || []).find(x => x.id === S.profile.lang);
      const mins = Math.max(1, Math.round((Date.now() - startT) / 60000));
      MW.add(body, h('div', { class: 'done-screen' }, h('div', { class: 'em emoji' }, acc >= 90 ? '🏆' : '🎉'),
        h('h2', null, acc >= 90 ? 'Ausgezeichnet!' : 'Gut gemacht!'),
        h('div', { class: 'zm' }, (g && g.wellDone ? g.wellDone + ' · ' : '') + 'Well done, ' + MW.myName() + '!'),
        h('div', { class: 'stats' },
          h('div', { class: 'stat' }, h('b', null, '+' + xp), h('span', null, 'POINTS')),
          h('div', { class: 'stat' }, h('b', null, acc + '%'), h('span', null, 'CORRECT')),
          h('div', { class: 'stat' }, h('b', null, em('🔥'), ' ' + MW.streakNow()), h('span', null, 'DAY STREAK'))),
        h('p', { class: 'muted', style: { marginTop: '18px' } }, mins + ' min of German today. Every day a little: that is how it works.')));
      setFoot(h('button', { class: 'btn green', onclick: close }, 'Continue'));
      confetti(); N.haptic('ok');
    }
    show();
  }

  // ───────────────────────── screens
  function ring(emoji, frac, done) {
    const r = 25, c = 2 * Math.PI * r;
    const el = h('div', { class: 'ring' + (done ? ' done' : '') }); el.innerHTML = '<svg viewBox="0 0 58 58"><circle cx="29" cy="29" r="25"/><circle class="p" cx="29" cy="29" r="25" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - frac)) + '"/></svg>';
    el.appendChild(em(emoji)); return el;
  }
  screens.learn = function () {
    const due = dueCount(); const nx = nextUnit(); const totalStars = U().reduce((a, u) => a + prog(u.id).stars, 0);
    const list = h('div', { class: 'scroll' });
    MW.add(list, h('div', { class: 'card', style: { marginTop: '6px' } },
      h('div', { class: 'row' }, h('div', { class: 'grow' }, h('h3', null, 'Your German: A1'), h('div', { class: 'muted' }, totalStars + ' of ' + U().length * 3 + ' steps · ' + learnedCount() + ' words learned')), h('div', { style: { fontSize: '30px' } }, em('🇩🇪'))),
      h('div', { class: 'progress g', style: { marginTop: '10px' } }, h('i', { style: { width: Math.round(totalStars / Math.max(1, U().length * 3) * 100) + '%' } }))));
    MW.add(list, h('div', { class: 'btnrow', style: { marginTop: '14px' } },
      h('button', { class: 'btn' + (due ? '' : ' ghost'), onclick: () => { const ex = due ? buildReview() : buildFree(); startLesson({ exercises: ex, xp: 10 }); } }, em('🔁'), due ? 'Review ' + due + ' word' + (due > 1 ? 's' : '') : 'Quick practice')));
    MW.add(list, h('div', { class: 'sect' }, 'Your path'));
    U().forEach((u, i) => {
      const p = prog(u.id);
      list.appendChild(h('button', { class: 'unit' + (u === nx && p.stars < 3 ? ' next' : ''), onclick: () => push('unit', { id: u.id }) },
        (u === nx && p.stars < 3) ? h('span', { class: 'tag' }, p.stars ? 'CONTINUE' : 'NEXT') : null,
        ring(u.emoji, p.stars / 3, p.stars >= 3),
        h('div', { class: 'grow' }, h('div', { class: 'n' }, 'UNIT ' + (i + 1)), h('div', { class: 't' }, u.title), h('div', { class: 's' }, u.titleDe)),
        icon('chev', 'chev')));
    });
    if (!U().length) MW.add(list, h('div', { class: 'card' }, 'Course content is missing.'));
    return h('div', { class: 'view' }, h('div', { class: 'bighead' }, h('div', null, h('div', { class: 'de' }, 'DEUTSCH LERNEN'), h('h1', null, 'Learn German'))), list);
  };

  screens.unit = function ({ id }) {
    const u = unitById(id); const p = prog(id); const i = U().indexOf(u);
    const body = [];
    body.push(h('div', { class: 'card', style: { marginTop: '4px' } }, h('div', { class: 'row' }, h('div', { class: 'badge', style: { width: '62px', height: '62px', fontSize: '34px' } }, em(u.emoji)),
      h('div', { class: 'grow' }, h('div', { class: 'muted' }, 'After this unit you can'), h('div', { style: { fontWeight: 800, fontSize: '17px', lineHeight: 1.3 } }, u.goal)))));
    body.push(h('div', { class: 'steps' }, STEPS.map((st, k) => h('button', { class: 'step' + (p.stars > k ? ' done' : '') + (p.stars === k ? ' cur' : ''), onclick: () => startLesson({ exercises: buildLesson(u, k), xp: 20, onDone: () => { if (p.stars < k + 1) { p.stars = k + 1; save(); } } }) },
      h('span', { class: 'e emoji' }, p.stars > k ? '✅' : st.e), st.t, h('small', null, st.s)))));
    const cur = Math.min(2, p.stars);
    body.push(h('button', { class: 'btn', style: { marginTop: '14px' }, onclick: () => startLesson({ exercises: buildLesson(u, cur), xp: 20, onDone: () => { if (p.stars < cur + 1) { p.stars = cur + 1; save(); } } }) }, icon('play'), p.stars >= 3 ? 'Practise again' : (p.stars ? 'Continue: ' : 'Start: ') + STEPS[cur].t));
    if (u.tip) body.push(h('div', { class: 'tip' }, h('h3', null, em('💡'), u.tip.title), h('p', null, u.tip.text)));
    if (u.dialogue) body.push(h('button', { class: 'card tap row', style: { width: '100%' }, onclick: () => push('dialogue', { id }) }, h('div', { class: 'badge b' }, em('🎭')),
      h('div', { class: 'grow' }, h('h3', null, u.dialogue.title), h('div', { class: 'muted' }, 'Conversation · ' + u.dialogue.place)), icon('chev', 'chev')));
    body.push(h('div', { class: 'sect' }, 'Words'));
    body.push(h('div', { class: 'list' }, u.words.map(w => h('div', { class: 'item' }, h('div', { class: 'badge sm y' }, em(w.emoji || '💬')), h('div', { class: 'grow' }, h('div', { class: 't' }, P(w.de)), h('div', { class: 's' }, P(w.en))), sayBtn(w.de, 'de', 'sm')))));
    body.push(h('div', { class: 'sect' }, 'Sentences'));
    body.push(h('div', { class: 'list' }, u.sentences.map(s => h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, P(s.de)), h('div', { class: 's' }, P(s.en))), sayBtn(s.de, 'de', 'sm')))));
    return page(u.title, 'Unit ' + (i + 1) + ' · ' + u.titleDe, body);
  };

  screens.dialogue = function ({ id }) {
    const u = unitById(id); const dlg = u.dialogue; let showEn = true, playing = false, token = 0;
    const box = h('div', { class: 'bubbles' });
    const bubs = dlg.lines.map(l => {
      const en = h('div', { class: 'e' }, P(l.en));
      const b = h('button', { class: 'bub' + (l.me ? ' me' : ''), onclick: () => { token++; playing = false; setPlay(); mark(b); say(l.de, 'de').then(() => b.classList.remove('playing')); } },
        h('div', { class: 'who' }, l.me ? 'You' : l.who), h('div', { class: 'd' }, P(l.de)), en);
      b.en = en; box.appendChild(b); return b;
    });
    function mark(b) { bubs.forEach(x => x.classList.remove('playing')); if (b) { b.classList.add('playing'); b.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
    const playBtn = h('button', { class: 'btn', onclick: async () => {
      if (playing) { playing = false; token++; stopSay(); mark(null); return setPlay(); }
      playing = true; setPlay(); const my = ++token;
      for (let k = 0; k < dlg.lines.length; k++) { if (my !== token) return; mark(bubs[k]); await say(dlg.lines[k].de, 'de'); if (my !== token) return; await new Promise(r => setTimeout(r, 450)); }
      mark(null); playing = false; setPlay();
    } });
    function setPlay() { playBtn.innerHTML = ''; MW.add(playBtn, [icon(playing ? 'close' : 'play'), playing ? 'Stop' : 'Play the conversation']); }
    setPlay();
    const tgl = h('button', { class: 'chip on', onclick: () => { showEn = !showEn; tgl.classList.toggle('on', showEn); bubs.forEach(b => b.en.classList.toggle('hide', !showEn)); } }, 'English');
    return h('div', { class: 'view' }, MW.topbar(dlg.title, dlg.place, tgl),
      h('div', { class: 'scroll' }, h('div', { class: 'muted', style: { margin: '2px 4px 0' } }, 'Tap a line to hear it. Then try to say your lines aloud.'), box, h('div', { class: 'gap' })),
      h('div', { style: { padding: '10px 16px 16px', flex: 'none' } }, playBtn));
  };

  function wordOfDay() {
    const all = []; U().forEach(u => u.words.forEach(w => all.push({ u, w })));
    if (!all.length) return null;
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5);
    const x = all[(day * 7) % all.length]; const ex = x.u.sentences[day % x.u.sentences.length];
    return { w: x.w, u: x.u, ex };
  }
  function reminderWords() {
    const all = []; U().forEach(u => u.words.forEach(w => all.push(P(w.de) + ' — ' + P(w.en))));
    return shuffle(all).slice(0, 120);
  }

  window.Learn = { dueCount, learnedCount, nextUnit, prog, startLesson, buildLesson, buildReview, buildFree, wordOfDay, reminderWords, STEPS };
})();
