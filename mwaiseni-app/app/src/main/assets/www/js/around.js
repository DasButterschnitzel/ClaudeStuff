/* Dreieich tab: real places around her + "How Germany works" guide. */
(function () {
  'use strict';
  const { D, h, icon, em, N, sayBtn, toast, screens, push, page, P, norm, save } = MW;
  const S = MW.state;
  let cat = 'all', gq = '';

  function mapsUrl(p) {
    if (p.lat && p.lon) return 'https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lon + '&travelmode=transit';
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + (p.address || ''));
  }
  function placeCard(p) {
    const c = D.placeCats.find(x => x.id === p.cat) || { emoji: '📍', title: '' };
    const acts = h('div', { class: 'acts' });
    if (p.address || p.lat) acts.appendChild(h('button', { class: 'btn small', onclick: () => N.open(mapsUrl(p)) }, icon('route'), 'Route'));
    if (p.phone) acts.appendChild(h('button', { class: 'btn small ghost', onclick: () => N.open('tel:' + String(p.phone).replace(/[^+\d]/g, '')) }, icon('phone'), 'Call'));
    if (p.web) acts.appendChild(h('button', { class: 'btn small ghost', onclick: () => N.open(p.web) }, icon('web'), 'Website'));
    return h('div', { class: 'card place' },
      h('div', { class: 'row', style: { alignItems: 'flex-start' } }, h('div', { class: 'badge sm' }, em(c.emoji)), h('div', { class: 'grow' }, h('h3', null, p.name), h('div', { class: 'what' }, p.what))),
      p.address ? h('div', { class: 'meta' }, icon('map'), h('span', { class: 'selectable' }, p.address)) : null,
      p.phone ? h('div', { class: 'meta' }, icon('phone'), h('span', { class: 'selectable' }, p.phone)) : null,
      p.hours ? h('div', { class: 'meta' }, icon('cal'), h('span', null, p.hours)) : null,
      p.tip ? h('div', { class: 'ptip' }, em('💡'), ' ' + p.tip) : null,
      p.de ? h('div', { class: 'psay' }, h('div', { class: 'grow' }, h('div', { style: { fontWeight: 800 } }, P(p.de)), h('div', { class: 'muted' }, P(p.deEn || ''))), sayBtn(p.de, 'de', 'sm')) : null,
      acts.children.length ? acts : null);
  }

  screens.around = function () {
    const sub = MW.tabState.around || 'places';
    const setSub = s => { MW.tabState.around = s; MW.render(); };
    const seg = h('div', { class: 'seg' }, [['places', '📍 Places'], ['guide', '🇩🇪 How Germany works']].map(([k, l]) => h('button', { class: sub === k ? 'on' : '', onclick: () => setSub(k) }, l)));
    const head = h('div', { class: 'bighead', style: { paddingBottom: '8px' } }, h('div', null, h('div', { class: 'de' }, 'DEINE STADT'), h('h1', null, 'Dreieich')));
    return h('div', { class: 'view' }, head, seg, sub === 'places' ? placesView() : guideView());
  };

  function placesView() {
    const wrap = h('div', { class: 'scroll' }); const list = h('div');
    const chips = h('div', { class: 'chips' });
    function draw() {
      chips.innerHTML = '';
      [{ id: 'all', title: 'All', emoji: '✨' }].concat(D.placeCats).forEach(c => {
        if (c.id !== 'all' && !D.places.some(p => p.cat === c.id)) return;
        chips.appendChild(h('button', { class: 'chip' + (cat === c.id ? ' on' : ''), onclick: () => { cat = c.id; draw(); } }, em(c.emoji), c.title));
      });
      list.innerHTML = '';
      if (cat === 'all') {
        D.placeCats.forEach(c => {
          const ps = D.places.filter(p => p.cat === c.id); if (!ps.length) return;
          list.appendChild(h('button', { class: 'card tap row', style: { width: '100%' }, onclick: () => { cat = c.id; draw(); wrap.scrollTop = 0; } }, h('div', { class: 'badge' }, em(c.emoji)),
            h('div', { class: 'grow' }, h('h3', null, c.title), h('div', { class: 'muted', style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, ps.slice(0, 3).map(p => p.name).join(' · '))), h('div', { class: 'muted' }, ps.length), icon('chev', 'chev')));
        });
        if (!D.places.length) list.appendChild(h('div', { class: 'empty' }, h('p', null, 'No places yet.')));
      } else {
        D.places.filter(p => p.cat === cat).forEach(p => list.appendChild(placeCard(p)));
        list.appendChild(h('p', { class: 'muted', style: { margin: '14px 6px 0', fontSize: '13.5px' } }, 'Opening times change. Check the website or call before you go.'));
      }
    }
    draw();
    MW.add(wrap, [chips, list]);
    return wrap;
  }

  function guideView() {
    const wrap = h('div', { class: 'scroll' }); const list = h('div');
    const inp = h('input', { class: 'input', placeholder: 'Search: Pfand, doctor, rubbish…', value: gq, autocomplete: 'off' });
    inp.addEventListener('input', () => { gq = inp.value; draw(); });
    function draw() {
      list.innerHTML = ''; const q = norm(gq);
      const items = D.guide.filter(g => !q || norm(g.title + ' ' + g.summary + ' ' + (g.words || []).map(w => w.de).join(' ') + ' ' + g.sections.map(s => s.h + ' ' + s.p).join(' ')).indexOf(q) >= 0);
      if (!items.length) { list.appendChild(h('div', { class: 'empty' }, h('div', { class: 'em emoji' }, '🔎'), h('p', null, 'Nothing found.'))); return; }
      list.appendChild(h('div', { class: 'list' }, items.map(g => h('button', { class: 'item', onclick: () => push('guide', { id: g.id }) }, h('div', { class: 'badge sm ' + (S.seenGuide[g.id] ? 'g' : 'y') }, em(g.emoji)),
        h('div', { class: 'grow' }, h('div', { class: 't' }, g.title), h('div', { class: 's' }, g.summary)), icon('chev', 'chev')))));
    }
    draw();
    MW.add(wrap, [h('div', { class: 'search' }, icon('search'), inp), list]);
    return wrap;
  }

  screens.guide = function ({ id }) {
    const g = D.guide.find(x => x.id === id); S.seenGuide[id] = 1; save();
    const body = [h('div', { class: 'article' },
      h('div', { class: 'bigem emoji' }, g.emoji), h('h1', { style: { fontSize: '27px', fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.15, marginTop: '4px' } }, g.title),
      h('p', { class: 'lead' }, g.summary),
      g.sections.map(s => [h('h2', null, s.h), h('p', { class: 'selectable' }, s.p)]))];
    if (g.say) body.push(h('div', { class: 'tip', style: { background: 'var(--brand-soft)' } }, h('h3', null, em('🗣️'), 'Say it'), h('div', { class: 'row', style: { marginTop: '6px' } }, h('div', { class: 'grow' }, h('div', { style: { fontWeight: 900, fontSize: '18px' } }, P(g.say.de)), h('div', { class: 'muted' }, P(g.say.en))), sayBtn(g.say.de, 'de'))));
    if (g.words && g.words.length) {
      body.push(h('div', { class: 'sect' }, 'Words you will see'));
      body.push(h('div', { class: 'list' }, g.words.map(w => h('div', { class: 'item' }, h('div', { class: 'grow' }, h('div', { class: 't' }, w.de), h('div', { class: 's' }, w.en)), sayBtn(w.de, 'de', 'sm')))));
    }
    const i = D.guide.indexOf(g); const nx = D.guide[(i + 1) % D.guide.length];
    body.push(h('button', { class: 'card tap row', style: { width: '100%', marginTop: '20px' }, onclick: () => MW.replace('guide', { id: nx.id }) }, h('div', { class: 'badge sm y' }, em(nx.emoji)), h('div', { class: 'grow' }, h('div', { class: 'muted' }, 'Next'), h('h3', null, nx.title)), icon('chev', 'chev')));
    return page('How Germany works', '', body);
  };

  function tipOfDay() {
    if (!D.guide.length) return null;
    // heavy topics stay in the guide but are not pushed onto the home screen
    const light = D.guide.filter(g => !/violence|safety|racism|discrimination|scam/i.test(g.id + ' ' + g.title));
    const unseen = light.filter(g => !S.seenGuide[g.id]); const pool = unseen.length ? unseen : (light.length ? light : D.guide);
    const day = Math.floor(Date.now() / 864e5); return pool[day % pool.length];
  }
  window.Around = { placeCard, tipOfDay, mapsUrl };
})();
