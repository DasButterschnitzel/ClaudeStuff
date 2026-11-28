/* Speak: two-way voice translator, situational phrasebook, show-cards. */
(function () {
  'use strict';
  const { D, h, icon, em, N, say, stopSay, sayBtn, toast, sheet, showBig, screens, push, page, P, norm, similar, save } = MW;
  const S = MW.state;

  // ───────────────────────── helpers
  const DE_HINT = /\b(der|die|das|und|ich|nicht|ist|sie|wir|ein|eine|bitte|danke|mit|für|auf|haben|können|ihre|ihren|sehr|geehrte|uhr|wie|wo|was|zu|den|dem|von|im|bis|oder|auch|noch|schon|heute|morgen)\b/g;
  const EN_HINT = /\b(the|and|is|are|you|not|have|please|thank|with|for|this|that|what|where|how|can|will|your|my|from|they|there|was|but|about|would|could)\b/g;
  function looksGerman(t) {
    const s = ' ' + t.toLowerCase() + ' ';
    const de = (s.match(DE_HINT) || []).length + (s.match(/[äöüß]/g) || []).length * 2;
    const en = (s.match(EN_HINT) || []).length;
    return de > en;
  }
  const isFav = p => S.favs.some(f => f.de === p.de);
  function toggleFav(p) {
    const i = S.favs.findIndex(f => f.de === p.de);
    if (i >= 0) { S.favs.splice(i, 1); toast('Removed from My phrases'); } else { S.favs.unshift({ de: P(p.de), en: P(p.en) }); toast('Saved to My phrases ⭐'); }
    save();
  }

  /** Bottom sheet for one phrase: listen, slow, show big, practise, save. */
  function phraseSheet(p, extra) {
    sheet(close => {
      const heard = h('div', { class: 'heard', style: { marginTop: '8px' } });
      const favB = h('button', { class: 'btn ghost', onclick: () => { toggleFav(p); favB.lastChild.textContent = isFav(p) ? 'Saved' : 'Save'; } }, em(isFav(p) ? '⭐' : '☆'), isFav(p) ? 'Saved' : 'Save');
      setTimeout(() => say(p.de, 'de'), 150);
      return [
        h('div', { class: 'muted' }, P(p.en)),
        h('div', { class: 'selectable', style: { fontSize: P(p.de).length > 60 ? '24px' : '30px', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-.015em', margin: '4px 0 16px' } }, P(p.de) + (extra ? ' ' + extra : '')),
        h('div', { class: 'btnrow' },
          h('button', { class: 'btn', onclick: () => say(p.de, 'de') }, icon('speaker'), 'Listen'),
          h('button', { class: 'btn ghost', onclick: () => say(p.de, 'de', { slow: true }) }, em('🐢'), 'Slowly')),
        h('div', { class: 'btnrow', style: { marginTop: '10px' } },
          h('button', { class: 'btn ghost', onclick: () => { close(); showBig(p.de, p.en, extra); } }, icon('expand'), 'Show'),
          favB),
        N.info.speech ? h('button', { class: 'btn soft', style: { marginTop: '10px' }, onclick: async () => {
          stopSay(); heard.textContent = 'Listening…';
          const r = await N.listen('de-DE', P(p.de));
          if (!r.ok) { heard.textContent = 'I did not hear anything.'; return; }
          let best = 0; r.results.forEach(t => { best = Math.max(best, similar(t, P(p.de))); });
          heard.textContent = best >= 0.9 ? '🎯 Perfect!' : best >= 0.72 ? '👍 Good, people will understand you.' : '🙂 Not yet: “' + r.results[0] + '”. Listen and try again.';
          N.haptic(best >= 0.72 ? 'ok' : 'bad');
        } }, icon('mic'), 'Practise saying it') : null,
        heard
      ];
    });
  }
  const phraseRow = (p, extra) => h('button', { class: 'item phrase', onclick: () => phraseSheet(p, extra) },
    h('div', { class: 'grow' }, h('div', { class: 't' }, P(p.en)), h('div', { class: 's de' }, P(p.de))), sayBtn(p.de, 'de', 'sm'));

  // ───────────────────────── tab root
  screens.speak = function () {
    const sub = MW.tabState.speak || 'talk';
    const setSub = s => { MW.tabState.speak = s; MW.render(); };
    const seg = h('div', { class: 'seg' }, [['talk', '🎤 Translate'], ['phrases', '💬 Phrases'], ['cards', '🪪 Cards']].map(([k, l]) => h('button', { class: sub === k ? 'on' : '', onclick: () => setSub(k) }, l)));
    const head = h('div', { class: 'bighead', style: { paddingBottom: '8px' } }, h('div', null, h('div', { class: 'de' }, 'SPRECHEN'), h('h1', null, 'Speak')));
    const body = sub === 'talk' ? talkView() : sub === 'phrases' ? phrasesView() : cardsView();
    return h('div', { class: 'view' }, head, seg, body);
  };

  // ───────────────────────── translator
  let pendingText = null; // text shared into the app
  function talkView() {
    const feed = h('div', { class: 'feed' });
    const bannerBox = h('div');
    const ta = h('textarea', { rows: 1, placeholder: 'Type English or German…' });
    ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(110, ta.scrollHeight) + 'px'; });

    function bubble(m) {
      const out = h('div', { class: 'out selectable' }, m.out || '…');
      const outLang = m.who === 'me' ? 'de' : 'en';
      const sp = h('button', { 'aria-label': 'Listen', onclick: () => say(m.out, outLang, { btn: sp }) }, icon('speaker'));
      const el = h('div', { class: 'tb ' + m.who + (m.out ? '' : ' wait') },
        h('div', { class: 'src' }, m.src), out,
        h('div', { class: 'acts' }, sp,
          h('button', { 'aria-label': 'Show large', onclick: () => m.who === 'me' ? showBig(m.out, m.src) : showBig(m.src, m.out) }, icon('expand')),
          h('button', { 'aria-label': 'Copy', onclick: () => N.copy(m.out) }, icon('copy')),
          m.who === 'me' ? h('button', { 'aria-label': 'Save', onclick: () => toggleFav({ de: m.out, en: m.src }) }, icon('star')) : null));
      el.setOut = t => { out.textContent = t; el.classList.remove('wait'); };
      return el;
    }
    function drawFeed() {
      feed.innerHTML = '';
      if (!S.talk.length) {
        feed.appendChild(h('div', { class: 'empty' }, h('div', { class: 'em emoji' }, '🗣️'), h('h3', null, 'I talk for you'),
          h('p', null, 'Tap the orange button and speak English. I say it in German. When the other person answers, tap the blue button.'),
          h('p', { style: { marginTop: '10px', fontSize: '14px' } }, 'Works without internet after the first download.')));
      } else {
        S.talk.forEach(m => feed.appendChild(bubble(m)));
        feed.appendChild(h('button', { class: 'link', style: { alignSelf: 'center', fontSize: '14px' }, onclick: () => { S.talk = []; save(); drawFeed(); } }, 'Clear conversation'));
      }
      requestAnimationFrame(() => { feed.scrollTop = feed.scrollHeight; });
    }
    async function translate(text, who) {
      text = String(text || '').trim(); if (!text) return;
      const m = { who, src: text, out: '', t: Date.now() };
      if (!S.talk.length) feed.innerHTML = '';
      const lastLink = feed.querySelector('.link'); if (lastLink) lastLink.remove();
      const el = bubble(m); feed.appendChild(el); feed.scrollTop = feed.scrollHeight;
      const r = who === 'me' ? await N.translate(text, 'en', 'de') : await N.translate(text, 'de', 'en');
      if (!r.ok) {
        el.remove();
        if (r.error === 'model') toast('The translator is still downloading (once, about 30 MB). Check the internet and try again in a minute.');
        else if (r.error === 'nonative') toast('The translator works inside the Android app.');
        else toast('Sorry, that did not work. Try again.');
        checkModel(); return;
      }
      m.out = r.out; el.setOut(m.out);
      S.talk.push(m); while (S.talk.length > 40) S.talk.shift(); save();
      feed.scrollTop = feed.scrollHeight;
      if (who === 'me' && S.settings.speakOut) say(m.out, 'de');
      bannerBox.innerHTML = '';
    }
    async function mic(who) {
      stopSay();
      if (!N.info.speech) { toast('Voice input is not available on this phone. Please type.'); ta.focus(); return; }
      const r = await N.listen(who === 'me' ? (S.settings.accent || 'en-ZA') : 'de-DE', who === 'me' ? 'Speak English' : 'Bitte sprechen Sie Deutsch');
      if (r.ok && r.results && r.results[0]) translate(r.results[0], who);
      else if (r.error === 'unavailable') toast('Voice input is not available on this phone. Please type.');
    }
    function sendTyped() { const t = ta.value.trim(); if (!t) return; ta.value = ''; ta.style.height = 'auto'; translate(t, looksGerman(t) ? 'them' : 'me'); }
    async function checkModel() {
      if (!N.native) return;
      const r = await N.modelStatus();
      bannerBox.innerHTML = '';
      if (r.ok && !r.ready) {
        const btn = h('button', { class: 'btn small', onclick: async () => {
          btn.disabled = true; btn.textContent = 'Downloading…';
          const d = await N.downloadModel();
          if (d.ok) { toast('Translator is ready. It now works offline ✓'); bannerBox.innerHTML = ''; } else { btn.disabled = false; btn.textContent = 'Try again'; toast('Download failed. Check your internet.'); }
        } }, 'Download');
        bannerBox.appendChild(h('div', { class: 'banner' }, em('⬇️'), h('div', { class: 'grow' }, 'Download the offline translator once (about 30 MB, Wi-Fi is best).'), btn));
      }
    }
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTyped(); } });
    drawFeed(); checkModel();
    if (pendingText) { const t = pendingText; pendingText = null; setTimeout(() => translate(t, looksGerman(t) ? 'them' : 'me'), 200); }
    return h('div', { class: 'talk' }, bannerBox, feed,
      h('div', { class: 'composer' },
        h('div', { class: 'inrow' }, ta, h('button', { class: 'send', 'aria-label': 'Translate', onclick: sendTyped }, icon('send'))),
        h('div', { class: 'mics' },
          h('button', { class: 'mic me', onclick: () => mic('me') }, icon('mic'), h('span', null, 'I speak', h('small', null, 'English → Deutsch'))),
          h('button', { class: 'mic them', onclick: () => mic('them') }, icon('mic'), h('span', null, 'Sie sprechen', h('small', null, 'Deutsch → English'))))));
  }
  function translateShared(text) { pendingText = text; MW.go('speak', 'talk'); }

  // ───────────────────────── phrasebook
  let query = '';
  function phrasesView() {
    const wrap = h('div', { class: 'scroll' });
    const results = h('div');
    const inp = h('input', { class: 'input', placeholder: 'Search: doctor, ticket, Termin…', value: query, autocomplete: 'off' });
    inp.addEventListener('input', () => { query = inp.value; draw(); });
    function draw() {
      results.innerHTML = '';
      const q = norm(query);
      if (q.length >= 2) {
        const hits = [];
        D.phrasebook.forEach(c => c.say.concat(c.hear || []).forEach(p => { if (norm(p.en).indexOf(q) >= 0 || norm(p.de).indexOf(q) >= 0) hits.push(p); }));
        D.units.forEach(u => u.sentences.forEach(p => { if (hits.length < 60 && (norm(p.en).indexOf(q) >= 0 || norm(p.de).indexOf(q) >= 0)) hits.push(p); }));
        results.appendChild(hits.length ? h('div', { class: 'list' }, hits.slice(0, 40).map(p => phraseRow(p)))
          : h('div', { class: 'empty' }, h('div', { class: 'em emoji' }, '🔎'), h('p', null, 'Nothing found. Try the translator.'),
            h('button', { class: 'btn small', style: { marginTop: '12px' }, onclick: () => translateShared(query) }, 'Translate “' + query + '”')));
        return;
      }
      if (S.favs.length) results.appendChild(h('button', { class: 'card tap row', style: { width: '100%' }, onclick: () => push('phrases', { id: '_fav' }) }, h('div', { class: 'badge y' }, em('⭐')), h('div', { class: 'grow' }, h('h3', null, 'My phrases'), h('div', { class: 'muted' }, S.favs.length + ' saved')), icon('chev', 'chev')));
      results.appendChild(h('div', { class: 'grid2' }, D.phrasebook.map(c => h('button', { class: 'cat', onclick: () => push('phrases', { id: c.id }) }, h('span', { class: 'em emoji' }, c.emoji), h('span', { class: 't' }, c.title), h('span', { class: 's' }, c.titleDe)))));
    }
    draw();
    MW.add(wrap, [h('div', { class: 'search' }, icon('search'), inp), results]);
    return wrap;
  }
  screens.phrases = function ({ id }) {
    if (id === '_fav') {
      return page('My phrases', 'Meine Sätze', S.favs.length ? h('div', { class: 'list', style: { marginTop: '4px' } }, S.favs.map(p => phraseRow(p)))
        : h('div', { class: 'empty' }, h('div', { class: 'em emoji' }, '⭐'), h('p', null, 'Save phrases with the star and find them here.')));
    }
    const c = D.phrasebook.find(x => x.id === id); let mode = 'say';
    const list = h('div');
    const seg = h('div', { class: 'seg', style: { margin: '0 0 6px' } });
    function draw() {
      seg.innerHTML = ''; [['say', 'I say'], ['hear', 'I hear']].forEach(([k, l]) => seg.appendChild(h('button', { class: mode === k ? 'on' : '', onclick: () => { mode = k; draw(); } }, l)));
      list.innerHTML = '';
      const items = mode === 'say' ? c.say : (c.hear || []);
      list.appendChild(h('div', { class: 'list', style: { marginTop: '6px' } }, items.map(p => mode === 'say' ? phraseRow(p)
        : h('button', { class: 'item phrase', onclick: () => phraseSheet(p) }, h('div', { class: 'grow' }, h('div', { class: 't' }, P(p.de)), h('div', { class: 's' }, P(p.en))), sayBtn(p.de, 'de', 'sm')))));
      if (mode === 'hear') list.appendChild(h('p', { class: 'muted', style: { margin: '12px 6px' } }, 'These are things people may say to you. Listen a few times so you recognise them.'));
    }
    draw();
    const foodLink = (window.Food && Food.has() && (c.id === 'shopping' || c.id === 'food')) ? h('button', { class: 'card tap row', style: { width: '100%', margin: '0 0 12px' }, onclick: () => push('food', {}) }, h('div', { class: 'badge y' }, em('🍲')),
      h('div', { class: 'grow' }, h('h3', null, 'Find Zambian ingredients'), h('div', { class: 'muted' }, 'German, Asian, Turkish and Afro shop names')), icon('chev', 'chev')) : null;
    return page(c.title, c.titleDe, [foodLink, (c.hear && c.hear.length) ? seg : null, list], h('div', { style: { fontSize: '28px', paddingRight: '10px' } }, em(c.emoji)));
  };

  // ───────────────────────── show-cards
  function cardExtra(c) {
    if (c.id === 'call-husband' && S.profile.partnerPhone) return (S.profile.partnerName ? S.profile.partnerName + ': ' : '') + S.profile.partnerPhone;
    if (c.id === 'lost' && S.profile.address) return S.profile.address;
    return '';
  }
  function cardsView() {
    const wrap = h('div', { class: 'scroll' });
    MW.add(wrap, h('p', { class: 'muted', style: { margin: '4px 4px 0' } }, 'When words fail: tap a card and show your phone. The German text appears very large.'));
    MW.add(wrap, h('div', { class: 'grid2' }, D.showcards.map(c => h('button', { class: 'cat', onclick: () => showBig(c.de, c.en, cardExtra(c)) }, h('span', { class: 'em emoji' }, c.emoji), h('span', { class: 't' }, c.title)))));
    const own = h('textarea', { class: 'input', rows: 2, placeholder: 'Write your own English sentence…' });
    MW.add(wrap, [h('div', { class: 'sect' }, 'Your own card'), h('div', { class: 'card' }, own,
      h('button', { class: 'btn', style: { marginTop: '10px' }, onclick: async () => {
        const t = own.value.trim(); if (!t) return;
        const r = await N.translate(t, 'en', 'de');
        if (r.ok) showBig(r.out, t); else toast(r.error === 'nonative' ? 'Works inside the Android app.' : 'The translator needs internet the first time.');
      } }, icon('expand'), 'Translate and show'))]);
    return wrap;
  }

  window.Speak = { translateShared, phraseRow, phraseSheet, looksGerman };
})();
