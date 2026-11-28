/* Food finder: what a Zambian ingredient is called in German, Turkish, Asian, Indian and African shops. */
(function () {
  'use strict';
  const { D, h, icon, em, N, say, sayBtn, toast, showBig, screens, push, page, save } = MW;
  const S = MW.state;
  const F = () => D.foodFinder || [];
  const CATS = () => D.foodCats || [];

  const SHOPS = {
    supermarket: { e: '🛒', t: 'Supermarket', d: 'REWE, Edeka, Kaufland, Aldi, Lidl' },
    market: { e: '🧺', t: 'Weekly market', d: 'Wochenmarkt' },
    turkish: { e: '🇹🇷', t: 'Turkish supermarket', d: 'Türkischer Supermarkt' },
    asian: { e: '🥢', t: 'Asia shop', d: 'Asia-Markt' },
    indian: { e: '🇮🇳', t: 'Indian shop', d: 'Indischer Laden' },
    african: { e: '🌍', t: 'Afro shop', d: 'Afro-Shop' },
    butcher: { e: '🥩', t: 'Butcher', d: 'Metzgerei, halal butcher' },
    online: { e: '📦', t: 'Online', d: 'Delivered home' },
    drugstore: { e: '🧴', t: 'Drugstore', d: 'dm, Rossmann' },
    bio: { e: '🌿', t: 'Organic shop', d: 'Bioladen, Reformhaus' }
  };
  const shopMeta = id => SHOPS[id] || { e: '🏪', t: id, d: '' };
  const GERMAN_SHOPS = ['supermarket', 'market', 'butcher', 'bio', 'drugstore', 'online'];
  const short = f => String(f.zm).replace(/\s*\(.*?\)/g, '').split(/\s+[–-]\s+/)[0];

  // ───────────────────────── search
  // Fold accents so "ca com" finds "cá cơm" and "susskartoffel" finds "Süßkartoffel"; keep CJK/Thai/Devanagari as they are.
  function fold(s) {
    s = String(s || '').toLowerCase();
    const plain = s.replace(/ß/g, 'ss').replace(/đ/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '');
    const ue = s.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    return (plain + ' ' + ue).replace(/[^\p{L}\p{N}]+/gu, ' ');
  }
  function names(f) {
    const out = [f.zm, f.de].concat(f.deAlt || [], (f.local || []).map(l => l.w));
    (f.shops || []).forEach(s => out.push(s.label, s.script, s.roman));
    return out.filter(Boolean);
  }
  const index = new Map();
  function hay(f) {
    if (!index.has(f)) index.set(f, { names: ' ' + fold(names(f).join(' | ')) + ' ', text: ' ' + fold([f.what, f.tip].concat((f.shops || []).map(s => s.note)).join(' ')) + ' ' });
    return index.get(f);
  }
  function search(q) {
    const n = fold(q).trim().split(/\s+/).filter(Boolean).join(' ');
    if (!n) return F();
    const words = n.split(' ');
    const scored = [];
    F().forEach(f => {
      const x = hay(f); let score = 0;
      for (const w of words) {
        if (x.names.indexOf(' ' + w + ' ') >= 0) score += 30;
        else if (x.names.indexOf(' ' + w) >= 0) score += 20;
        else if (x.names.indexOf(w) >= 0) score += 10;
        else if (x.text.indexOf(w) >= 0) score += 3;
        else { score = 0; break; }
      }
      if (score) scored.push([score, f]);
    });
    return scored.sort((a, b) => b[0] - a[0]).map(x => x[1]);
  }

  // ───────────────────────── rows
  function shopLine(f) {
    return (f.shops || []).filter(s => GERMAN_SHOPS.indexOf(s.shop) < 0).slice(0, 3)
      .map(s => shopMeta(s.shop).e + ' ' + [s.label, s.script].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' ')).join('   ');
  }
  function row(f) {
    const local = (f.local || []).map(l => l.w).filter(w => w.toLowerCase() !== String(f.zm).toLowerCase()).join(', ');
    const line = shopLine(f);
    return h('button', { class: 'item', onclick: () => push('foodItem', { id: f.id }) },
      h('div', { class: 'badge sm y' }, em(f.emoji || '🍲')),
      h('div', { class: 'grow' },
        h('div', { class: 't' }, f.zm + (local ? ' · ' + local : '')),
        h('div', { class: 's', style: { color: 'var(--brand-deep)', fontWeight: 800 } }, '→ ' + f.de),
        line ? h('div', { class: 's', style: { fontSize: '13.5px' } }, line) : null),
      icon('chev', 'chev'));
  }

  // ───────────────────────── finder screen
  let cat = 'all';
  screens.food = function (params) {
    let q = params.q || '';
    const list = h('div');
    const inp = h('input', { class: 'input', placeholder: 'spinach, kapenta, Mangold, 油菜…', value: q, autocomplete: 'off', spellcheck: 'false' });
    const chips = h('div', { class: 'chips' });
    function draw() {
      chips.innerHTML = '';
      [{ id: 'all', title: 'All', emoji: '✨' }].concat(CATS()).forEach(c => {
        if (c.id !== 'all' && !F().some(f => f.cat === c.id)) return;
        chips.appendChild(h('button', { class: 'chip' + (cat === c.id && !q.trim() ? ' on' : ''), onclick: () => { cat = c.id; q = ''; inp.value = ''; draw(); } }, em(c.emoji), c.title));
      });
      list.innerHTML = '';
      let items = q.trim() ? search(q) : F().filter(f => cat === 'all' || f.cat === cat);
      if (!items.length) {
        list.appendChild(h('div', { class: 'empty' }, h('div', { class: 'em emoji' }, '🔎'), h('h3', null, 'Not in the list yet'),
          h('p', null, 'Try the English or German word, or ask in the shop with the translator.'),
          h('button', { class: 'btn small', style: { marginTop: '12px' }, onclick: () => window.Speak && Speak.translateShared(q) }, 'Translate “' + q + '”')));
        return;
      }
      if (!q.trim() && cat === 'all') {
        CATS().forEach(c => {
          const its = items.filter(f => f.cat === c.id); if (!its.length) return;
          list.appendChild(h('div', { class: 'sect' }, em(c.emoji), ' ' + c.title));
          list.appendChild(h('div', { class: 'list' }, its.map(row)));
        });
        const rest = items.filter(f => !CATS().some(c => c.id === f.cat));
        if (rest.length) list.appendChild(h('div', { class: 'list' }, rest.map(row)));
      } else {
        list.appendChild(h('div', { class: 'list' }, items.map(row)));
      }
    }
    inp.addEventListener('input', () => { q = inp.value; draw(); });
    draw();
    const body = [
      h('div', { class: 'tip', style: { marginTop: '4px' } }, h('h3', null, em('💡'), 'Same food, different name'),
        h('p', null, 'What Zambians call "spinach" is Mangold here, and "rape" is closest to Yu Choy in the Asia shop. Search in English, Bemba, Nyanja or German.')),
      h('div', { class: 'search', style: { marginTop: '12px' } }, icon('search'), inp), chips, list,
      h('button', { class: 'card tap row', style: { width: '100%', marginTop: '20px' }, onclick: () => { MW.tabState.around = 'places'; MW.go('around'); } }, h('div', { class: 'badge g' }, em('🛒')),
        h('div', { class: 'grow' }, h('h3', null, 'Shops near you'), h('div', { class: 'muted' }, 'African, Asian and Turkish shops with route and phone')), icon('chev', 'chev'))
    ];
    if (params.q) setTimeout(() => inp.focus(), 300);
    return page('Find your food', 'Zutaten finden', body);
  };

  // ───────────────────────── one ingredient
  screens.foodItem = function ({ id }) {
    const f = F().find(x => x.id === id);
    if (!f) return page('Food', '', h('div', { class: 'empty' }, h('p', null, 'Not found.')));
    const body = [];
    body.push(h('div', { class: 'card center', style: { marginTop: '4px' } },
      h('div', { class: 'emoji', style: { fontSize: '56px', lineHeight: 1.1 } }, f.emoji || '🍲'),
      h('div', { class: 'muted', style: { marginTop: '4px' } }, 'At home: ' + f.zm),
      (f.local || []).length ? h('div', { class: 'wrap', style: { justifyContent: 'center', marginTop: '6px' } }, f.local.map(l => h('span', { class: 'chip' }, l.lang + ': ' + l.w))) : null,
      h('div', { class: 'muted', style: { marginTop: '12px' } }, 'In Germany look for'),
      h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '2px' } }, h('div', { style: { fontSize: '30px', fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.15 } }, f.de), sayBtn(f.de, 'de')),
      (f.deAlt || []).length ? h('div', { class: 'muted', style: { marginTop: '4px' } }, 'also: ' + f.deAlt.join(', ')) : null));
    body.push(h('p', { style: { margin: '14px 6px 0', fontWeight: 700, fontSize: '16.5px', lineHeight: 1.45 } }, f.what));

    const shops = f.shops || [];
    if (shops.length) {
      body.push(h('div', { class: 'sect' }, 'Where to find it'));
      body.push(h('div', { class: 'list' }, shops.map(s => {
        const m = shopMeta(s.shop);
        return h('div', { class: 'item', style: { alignItems: 'flex-start' } }, h('div', { class: 'badge sm' }, em(m.e)),
          h('div', { class: 'grow' },
            h('div', { class: 's', style: { fontWeight: 900, letterSpacing: '.02em' } }, m.t.toUpperCase()),
            h('div', { class: 't selectable' }, s.label || f.de, s.script ? h('span', { style: { marginLeft: '8px', fontSize: '20px' } }, s.script) : null),
            s.roman && s.roman !== s.label ? h('div', { class: 's' }, s.roman) : null,
            s.note ? h('div', { class: 's' }, s.note) : null),
          GERMAN_SHOPS.indexOf(s.shop) >= 0 ? sayBtn(s.label || f.de, 'de', 'sm')
            : h('button', { class: 'say sm', 'aria-label': 'Show large', onclick: () => showBig([s.script, s.label].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join('\n') + (s.roman && s.roman !== s.label ? '\n' + s.roman : ''), m.t + ': ' + f.zm + ' (' + f.de + ')') }, icon('expand')));
      })));
    }
    if (f.tip) body.push(h('div', { class: 'tip' }, h('h3', null, em('💡'), 'Good to know'), h('p', null, f.tip)));
    if (f.ask) body.push(h('div', { class: 'tip', style: { background: 'var(--brand-soft)' } }, h('h3', null, em('🗣️'), 'Ask in the shop'),
      h('div', { class: 'row', style: { marginTop: '6px' } }, h('div', { class: 'grow' }, h('div', { style: { fontWeight: 900, fontSize: '18px' } }, f.ask), h('div', { class: 'muted' }, f.askEn || '')), sayBtn(f.ask, 'de'))));

    // a card to show the shop staff: German name plus the label in the shop's own script
    const labels = shops.filter(s => s.script || (s.label && s.label !== f.de && GERMAN_SHOPS.indexOf(s.shop) < 0))
      .map(s => [s.script, s.label].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join('  '));
    const showText = [f.de].concat(labels.filter((v, i, a) => a.indexOf(v) === i)).join('\n');
    body.push(h('button', { class: 'btn', style: { marginTop: '16px' }, onclick: () => showBig((f.ask ? f.ask + '\n' : '') + showText, f.askEn ? f.askEn + ' (' + f.zm + ')' : f.zm) }, icon('expand'), 'Show this to the shop staff'));
    const fav = (S.foodFavs = S.foodFavs || []);
    const on = fav.indexOf(f.id) >= 0;
    body.push(h('button', { class: 'btn ghost', style: { marginTop: '10px' }, onclick: () => { const i = fav.indexOf(f.id); if (i >= 0) fav.splice(i, 1); else fav.push(f.id); save(); toast(i >= 0 ? 'Removed from shopping list' : 'Added to shopping list 🛒'); MW.replace('foodItem', { id }); } }, em(on ? '✅' : '🛒'), on ? 'On my shopping list' : 'Add to my shopping list'));
    if ((f.sources || []).length) body.push(h('div', { class: 'muted', style: { margin: '18px 6px 0', fontSize: '13px' } }, 'Sources: ', f.sources.map((u, i) => h('button', { class: 'link', style: { padding: '2px 4px', fontSize: '13px' }, onclick: () => N.open(u) }, '[' + (i + 1) + ']'))));
    return page(f.zm, f.de, body);
  };

  // ───────────────────────── shopping list (German names, to show or read in the shop)
  screens.shoppingList = function () {
    const fav = (S.foodFavs = S.foodFavs || []);
    const items = fav.map(id => F().find(f => f.id === id)).filter(Boolean);
    const body = [];
    if (!items.length) body.push(h('div', { class: 'empty' }, h('div', { class: 'em emoji' }, '🛒'), h('h3', null, 'Your list is empty'), h('p', null, 'Open a food and tap "Add to my shopping list".')));
    else {
      body.push(h('div', { class: 'list', style: { marginTop: '4px' } }, items.map(row)));
      body.push(h('button', { class: 'btn', style: { marginTop: '14px' }, onclick: () => showBig(items.map(f => '• ' + f.de).join('\n'), items.map(f => f.zm).join(', ')) }, icon('expand'), 'Show the list in German'));
      body.push(h('button', { class: 'btn ghost', style: { marginTop: '10px' }, onclick: () => N.share('Einkaufsliste:\n' + items.map(f => '- ' + f.de + ' (' + f.zm + ')').join('\n')) }, icon('share'), 'Send the list'));
      body.push(h('button', { class: 'link', style: { color: 'var(--red)', marginTop: '6px' }, onclick: () => { S.foodFavs = []; save(); MW.render(); } }, 'Clear the list'));
    }
    return page('Shopping list', 'Einkaufsliste', body);
  };

  /** The block shown on the Zambia tab. */
  function finderCard() {
    const inp = h('input', { class: 'input', placeholder: 'What are you looking for?', autocomplete: 'off', enterkeyhint: 'search' });
    const go = () => push('food', { q: inp.value.trim() });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    const popularIds = ['spinach', 'rape', 'breakfast-meal', 'kapenta', 'pumpkin-leaves', 'sweet-potato-leaves', 'okra', 'groundnuts-raw'];
    let popular = popularIds.map(id => F().find(f => f.id === id)).filter(Boolean);
    if (popular.length < 4) popular = F().slice(0, 6);
    const n = (S.foodFavs || []).length;
    return h('div', { class: 'card' },
      h('div', { class: 'row' }, h('div', { class: 'badge y' }, em('🍲')), h('div', { class: 'grow' }, h('h3', null, 'Find your food in Germany'), h('div', { class: 'muted' }, F().length + ' Zambian ingredients and their names in German, Turkish, Asian and Afro shops'))),
      h('div', { class: 'search', style: { marginTop: '12px' } }, icon('search'), inp),
      h('div', { class: 'wrap', style: { marginTop: '10px' } }, popular.map(f => h('button', { class: 'chip', style: { whiteSpace: 'normal', maxWidth: '100%' }, onclick: () => push('foodItem', { id: f.id }) }, em(f.emoji || '🍲'), short(f) + ' → ' + f.de))),
      h('div', { class: 'btnrow', style: { marginTop: '12px' } },
        h('button', { class: 'btn small soft', onclick: () => push('food', {}) }, 'Browse all'),
        h('button', { class: 'btn small ghost', onclick: () => push('shoppingList') }, '🛒 My list' + (n ? ' (' + n + ')' : ''))));
  }

  window.Food = { finderCard, search, has: () => F().length > 0 };
})();
