/* =====================================================================
   VARIANTEN
   ===================================================================== */
const full = (m) => (id, len, H) => [{ a0: 0, a1: len, v0: 0, v1: H, mat: m }];

function trimLine(B, id, a0, a1, v, m, ops = []) { // Abschlussschiene (Messing) über Fliesen
  let pieces = [{ a0, a1, v0: v - 0.004, v1: v + 0.006 }];
  ops.forEach(op => { pieces = pieces.flatMap(p => subtractRect(p, op)); });
  const f = wallFrame(id, B.D);
  pieces.forEach(p => { const a = f.p(p.a0, p.v0, 0), b = f.p(p.a1, p.v1, 0.007); B.walls[id].add(slab(Math.min(a.x, b.x), p.v0, Math.min(a.z, b.z), Math.max(a.x, b.x), p.v1, Math.max(a.z, b.z), m)); });
}
function stdZones(B, { wcFront = 0.58, tub = true, shower = null }) {
  const { L, W } = B.D;
  B.zone('WC', 0.05, wcFront, 0.85, wcFront + 0.75);
  if (tub) B.zone('Wanne', W - 1.5, 0.7, W - 0.75, 1.6);
  if (shower) B.zone('Dusche', ...shower);
}

/* ------------------------------------------------------------------ */
function buildBestand(B) {
  const { W, L, H } = B.D;
  const wallTile = M.tile('bestWall', { tw: 0.2, th: 0.25, cols: 5, rows: 4, base: '#f0ece3', vary: 0.018, grout: '#b9b1a3', gw: 0.003, rt: 0.11, bevel: 0.007 });
  const floorTile = M.tile('bestFloor', { tw: 0.33, layout: 'diag', colors: ['#d5c7b0', '#d9ccb6', '#cfc0a8'], vary: 0.025, grout: '#9e927b', gw: 0.004, rt: 0.3, bevel: 0.006 });
  const doorWood = M.wood('door', WOOD.door);
  buildShell(B, {
    walls: (id, len) => [{ a0: 0, a1: len, v0: 0, v1: H, mat: wallTile }],
    floor: floorTile, reveal: M.plaster('#f1eee8'),
    door: { leafMat: doorWood, innerMat: doorWood },
  });
  addLights(B);

  // Wanne + Dusche
  const tub = bathtub({}); tub.position.set(W - 0.375, 0, 0); B.add(tub, { name: 'Badewanne 75 × 160' }); B.foot(W - 0.75, 0, W, 1.6);
  B.add(B.mount(showerSetBestand(), 'right', 0.65, 0), { name: 'Brausestange & Aufputz-Mischer' });
  const bk = wireBasket(bottlesRow([{ r: 0.03, h: 0.16, c: '#f4efe2', cap: '#d8b25a' }, { r: 0.022, h: 0.13, c: '#3f6f5c', cap: '#222' }, { r: 0.024, h: 0.11, c: '#a52a3a', cap: '#ddd' }], 0.075));
  bk.children[1].position.set(0.07, 0.003, 0.06);
  const glove = rbox(0.12, 0.05, 0.06, 0.02, M.fabric('glove', '#e4b6b0')); glove.position.set(0.3, 0.08, 0.08); glove.rotation.z = 0.5; bk.add(glove);
  B.add(B.mount(bk, 'right', 0.03, 1.64), { name: 'Gitterkorb Duschecke' });
  // Vorhang
  const rodX = W - 0.72, ch = M.chrome();
  B.add(rod([rodX, 2.02, 0.0], [rodX, 2.02, 1.62], 0.011, ch), { name: 'Vorhangstange' });
  for (const z of [0.35, 1.3]) B.add(rod([rodX, 2.02, z], [rodX, H, z], 0.007, ch), { ceil: true });
  const cg = new THREE.Group(), cm = curtainMesh({ flat: 1.9, h: 1.38, folds: 30, span: 0.3 });
  cg.add(cm); cg.rotation.y = -PI / 2; cg.position.set(rodX, 1.995, 1.6 - 0.3);
  for (let i = 0; i < 8; i++) { const ring = mesh(new THREE.TorusGeometry(0.018, 0.0025, 6, 16), ch); ring.position.set(i * 0.04, 0.02, 0); cg.add(ring); }
  B.add(cg, { name: 'Duschvorhang · Klick zum Zuziehen', click: () => toggle(cg, 'cur', { a: 0.3, b: 1.55, dur: 1100, fn: v => { setCurtain(cm, v); cg.position.z = 1.6 - v; cg.children.forEach((c, i) => { if (i) c.position.x = (i - 1) * (v / 7); }); } }) });
  // Caddy, Kabel, Steckdosen
  B.add(B.mount(ovalCaddy(), 'right', 1.9, 0.9), { name: 'Duschregal (hängt neben der Wanne)' });
  B.add(tube([[W - 0.05, 0.9, 1.9], [W - 0.07, 0.75, 1.94], [W - 0.04, 0.62, 1.88], [W - 0.012, 0.56, 1.86]], 0.003, M.blackPlastic(), 40), { name: 'Ladekabel' });
  B.add(B.mount(rbox(0.12, 0.12, 0.008, 0.004, M.steel()), 'right', 1.86, 0.56, 0.004), { wall: 'right', name: 'Anschlussdose' });
  B.add(B.mount(socket(), 'right', 1.7, 0.3), { wall: 'right' });
  // WC
  const wc = toilet({}); B.add(B.mount(wc, 'back', 0.45, 0), { name: 'Stand-WC · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.foot(0.27, 0, 0.63, 0.58, 'WC');
  B.add(B.mount(flushPlate(M.whitePlastic()), 'back', 0.45, 1.0), { wall: 'back' });
  // Waschtisch
  const vz = L - 0.36; B.vz = vz;
  B.add(B.mount(vanityBestand(), 'left', vz, 0), { name: 'Waschtisch-Unterschrank (stehend)' });
  B.foot(0, L - 0.67, 0.41, L - 0.05, 'WT');
  B.add(B.mount(basin({ w: 0.52, d: 0.45, h: 0.055, bw: 0.4, bd: 0.3, bz: 0.035 }), 'left', vz, 0.86), { name: 'Waschbecken' });
  B.add(B.mount(faucetDeck(ch), 'left', vz, 0.86, 0.055));
  const soap = bottle({ r: 0.03, h: 0.14, c: '#d6a24a', cap: '#d9dde0', pump: true, gloss: 0.05 }); B.add(B.mount(soap, 'left', vz + 0.17, 0.86, 0.06));
  B.add(B.mount(rbox(0.06, 0.025, 0.04, 0.01, M.paint('#d77a8a')), 'left', L - 0.08, 0.8125, 0.3));
  B.add(B.mount(mirrorCabBestand(B), 'left', vz, 1.5), { name: 'Spiegelschrank (ohne Licht)' });
  // Heizkörper + Handtücher
  const rad = ladderRadiator({ w: 0.5, h: 1.55 });
  rad.add(at(towelOver({ w: 0.46, front: 0.42, back: 0.34, m: M.fabric('beige', '#e3d3bb', '#8b7a66'), seed: 3 }), 0, 1.5, 0.055));
  rad.add(at(towelOver({ w: 0.22, front: 0.18, back: 0.12, r: 0.012, m: M.fabric('lila', '#9a86c6'), seed: 8, wave: 0.006 }), 0.1, 0.42, 0.055));
  B.add(B.mount(rad, 'left', 1.22, 0.17), { name: 'Handtuchheizkörper' });
  const bar = towelRail(0.5, ch); bar.add(at(towelOver({ w: 0.62, front: 0.85, back: 0.7, r: 0.012, m: M.fabric('green', '#9fb43a'), seed: 5, wave: 0.02 }), 0, 0, 0.065));
  B.add(B.mount(bar, 'left', 0.55, 1.88), { name: 'Handtuchstange' });
  const hk = hook(ch); hk.add(at(clothHang({ w: 0.2, h: 0.5, m: M.fabric('black', '#22262c'), seed: 6 }), 0, 0.02, 0.045));
  B.add(B.mount(hk, 'front', 0.2, 1.58), { name: 'Haken' });
  B.add(B.mount(exhaustFan(), 'left', 0.12, 2.12), { wall: 'left', name: 'Lüfter' });
  B.add(at(domeLamp(0.16), W / 2, H, L / 2), { ceil: true, name: 'Deckenleuchte' });
  // Boden-Kram
  B.add(at(bathScale(), W - 0.4, 0, L - 0.6), { name: 'Waage' }); B.foot(W - 0.55, L - 0.75, W - 0.25, L - 0.45, 'Waage');
  B.add(at(swingBin(), W - 0.17, 0, L - 0.2), { name: 'Mülleimer' }); B.foot(W - 0.28, L - 0.3, W - 0.06, L - 0.1);
  B.add(at(bathMat(0.45, 0.7, '#77736d', 'g1'), 0.72, 0.01, 1.05), { name: 'Hochflor-Vorleger' });
  B.add(at(bathMat(0.4, 0.62, '#77736d', 'g1'), 0.66, 0.01, L - 0.36), { name: 'Hochflor-Vorleger' });
  const sl = slippers(); sl.position.set(0.24, 0, 1.73); sl.rotation.y = 0.4; B.add(sl, { name: 'Plüsch-Schlappen' });

  // Analyse
  B.hot(1, [W - 0.76, 1.45, 1.42], 'Duschvorhang', 'Klebt beim Duschen am Körper, lässt Spritzwasser durch und wird am Saum schnell stockig.', 'issue');
  B.hot(2, [W - 0.06, 1.5, 1.9], 'Zwei Ablagen an zwei Wänden', 'Gitterkorb in der Ecke plus ovales Regal, das neben der Wanne hängt: Flaschen tropfen auf die Fliesen.', 'issue');
  B.hot(3, [W - 0.06, 0.74, 1.92], 'Ladekabel im Spritzbereich', 'Das Kabel hängt vom Duschregal zur Dose. Kabelsalat in der Nasszone ist unpraktisch und nicht ideal.', 'issue');
  B.hot(4, [W - 0.4, 0.12, L - 0.6], 'Alles steht auf dem Boden', 'Waage, Mülleimer, Schlappen: jede freie Fliese ist belegt, Wischen wird zum Slalom.', 'issue');
  B.hot(5, [0.72, 0.1, 1.05], 'Zwei Hochflor-Vorleger', 'Fusseln, trocknen langsam und verrutschen auf glatten Fliesen.', 'issue');
  B.hot(6, [0.42, 0.45, vz], 'Stehender Unterschrank', 'Kein Fußraum, Staubkante am Sockel, nur rund 110 Liter Stauraum.', 'issue');
  B.hot(7, [0.17, 1.82, vz], 'Spiegelschrank ohne Licht & Steckdose', 'Licht kommt nur von oben (Schatten im Gesicht), die offene Ablage darunter wird zur Kabel-Ecke.', 'issue');
  B.hot(8, [0.06, 1.6, 0.75], 'Handtuch-Stau', 'Stange und Heizkörper sind doppelt behängt, nichts trocknet richtig.', 'issue');
  B.hot(9, [0.45, 1.45, 0.04], 'Wand über dem WC', 'Rund 0,6 m² Wand ohne jede Funktion: kein Regal, kein Vorrat.', 'issue');
  B.hot('+', [(B.win.a0 + B.win.a1) / 2, 1.55, 0.0], 'Fenster + Lüfter', 'Die beste Nachricht: echtes Fenster und Abluft. Damit ist Schimmel gut beherrschbar.', 'plus');
  stdZones(B, { wcFront: 0.58 });
  B.zone('Waschtisch', 0.45, L - 0.81, 1.2, L);
  B.dim([W - 0.75, 0.6, 1.66], [W, 0.6, 1.66], '75');
  B.dim([W - 0.82, 0.6, 0], [W - 0.82, 0.6, 1.6], '160');
}

/* ------------------------------------------------------------------ */
function buildA(B) { // Skandi Sage
  const { W, L, H } = B.D;
  const wallTile = M.tile('bestWall', { tw: 0.2, th: 0.25, cols: 5, rows: 4, base: '#f0ece3', vary: 0.018, grout: '#b9b1a3', gw: 0.003, rt: 0.11, bevel: 0.007 });
  const hb = herringboneSet('aFloor', { w: 0.09, l: 0.54, base: '#d6b98f', alt: '#cdae83', dark: '#9b7a52', gap: '#8f7150' });
  const floor = mat('aFloor', () => std({ map: hb.map, bumpMap: hb.bump, bumpScale: 1.2, roughness: 0.5, envMapIntensity: 0.6 }));
  const doorWood = M.wood('door', WOOD.door), sage = '#8fa58e', black = M.black(), oak = M.wood('oakLight', WOOD.oakLight);
  buildShell(B, { walls: full(wallTile), floor, reveal: M.plaster('#f1eee8'), skirting: { h: 0.05, mat: M.paint('#f3f2ee') }, door: { leafMat: doorWood, innerMat: doorWood } });
  addLights(B);
  // Wanne mit Glas-Faltwand
  const tub = bathtub({}); tub.position.set(W - 0.375, 0, 0); B.add(tub, { name: 'Badewanne (bleibt)' }); B.foot(W - 0.75, 0, W, 1.6);
  const gx = W - 0.725, gm = M.glass();
  B.add(slab(gx - 0.004, 0.57, 0.012, gx + 0.004, 1.97, 0.56, gm, { cast: false }), { name: 'Glas-Faltwand 110 cm' });
  B.add(slab(gx - 0.004, 0.57, 0.565, gx + 0.004, 1.97, 1.1, gm, { cast: false }), { name: 'Glas-Faltwand 110 cm' });
  B.add(slab(gx - 0.012, 0.57, 0, gx + 0.012, 1.97, 0.016, black));
  for (const y of [0.75, 1.75]) B.add(slab(gx - 0.012, y - 0.04, 0.55, gx + 0.012, y + 0.04, 0.575, black));
  B.add(slab(gx - 0.008, 0.57, 1.1, gx + 0.008, 1.97, 1.112, black));
  B.add(B.mount(showerSetBestand({ rail: black, hand: black, hose: black, scrub: false }), 'right', 0.65, 0), { name: 'Handbrause & Stange in Mattschwarz' });
  for (const v of [1.32, 1.62]) {
    const sh = new THREE.Group(); sh.add(slab(0, 0, 0, 0.3, 0.012, 0.12, black), slab(0, 0.012, 0.115, 0.3, 0.04, 0.12, black));
    const bt = bottlesRow([{ r: 0.026, h: 0.15, c: sage, cap: '#f1efe9' }, { r: 0.024, h: 0.13, c: '#f1efe9', cap: '#2a2a2a' }, { r: 0.022, h: 0.1, c: '#c9d2c4', cap: '#2a2a2a' }], 0.07);
    bt.position.set(0.06, 0.012, 0.06); sh.add(bt); B.add(B.mount(sh, 'right', 0.04, v), { name: 'Duschablage (bohrfrei)' });
  }
  // WC + Überbauregal
  const wc = toilet({}); B.add(B.mount(wc, 'back', 0.45, 0), { name: 'WC · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.foot(0.27, 0, 0.63, 0.58, 'WC');
  B.add(B.mount(flushPlate(M.whitePlastic()), 'back', 0.45, 1.0), { wall: 'back' });
  const sh = new THREE.Group(), sx0 = 0.07, sx1 = 0.69, sd = 0.25;
  for (const [x, z] of [[sx0, 0.015], [sx1, 0.015], [sx0, sd], [sx1, sd]]) sh.add(slab(x - 0.009, 0, z - 0.009, x + 0.009, 1.86, z + 0.009, black));
  for (const y of [1.12, 1.43, 1.74]) { sh.add(slab(sx0, y, 0.005, sx1, y + 0.022, sd + 0.01, oak)); sh.add(slab(sx0, y - 0.03, sd - 0.004, sx1, y - 0.022, sd + 0.004, black)); }
  const tp = tpRolls(3); tp.position.set(0.38, 1.142, 0.13); sh.add(tp);
  const sp = snakePlant({ n: 7, h: 0.32 }); const spp = pot({ r: 0.065, h: 0.11, m: M.ceramicMatte('#f1efe9') }); spp.position.set(0.2, 1.762, 0.13); sp.position.set(0.2, 1.862, 0.13); sh.add(spp, sp);
  const cd = candle(); cd.position.set(0.55, 1.762, 0.12); sh.add(cd);
  const bs = rbox(0.24, 0.16, 0.18, 0.02, M.fabric('basket', '#cdb894')); bs.position.set(0.48, 1.452 + 0.08, 0.13); sh.add(bs);
  const bt2 = bottlesRow([{ r: 0.03, h: 0.12, c: '#efe9dd', cap: '#3a3a3a' }, { r: 0.025, h: 0.16, c: sage, cap: '#3a3a3a' }], 0.07); bt2.position.set(0.14, 1.452, 0.12); sh.add(bt2);
  B.add(sh, { name: 'WC-Überbauregal Eiche/Schwarz' });
  // Waschtisch hängend + Spiegelschrank
  const vz = L - 0.36; B.vz = vz;
  const van = new THREE.Group(), vw = 0.6, vd = 0.46;
  const wA = M.paint('#f3f2ee');
  van.add(slab(-vw / 2, 0.42, 0, vw / 2, 0.7, vd - 0.02, wA), slab(-vw / 2, 0.7, 0, -vw / 2 + 0.018, 0.82, vd - 0.02, wA), slab(vw / 2 - 0.018, 0.7, 0, vw / 2, 0.82, vd - 0.02, wA), slab(-vw / 2, 0.7, 0, vw / 2, 0.82, 0.016, wA));
  van.add(slab(-vw / 2 + 0.002, 0.422, vd - 0.02, vw / 2 - 0.002, 0.6, vd, oak), slab(-vw / 2 + 0.002, 0.604, vd - 0.02, vw / 2 - 0.002, 0.795, vd, oak));
  for (const y of [0.6, 0.795]) van.add(slab(-vw / 2 + 0.04, y - 0.016, vd, vw / 2 - 0.04, y - 0.012, vd + 0.004, M.paint('#3a3330')));
  const ledA = slab(-vw / 2 + 0.03, 0.414, vd - 0.06, vw / 2 - 0.03, 0.42, vd - 0.05, M.lamp('#ffd7a0', 3, 0.0), { cast: false });
  van.add(ledA);
  const bas = basin({ w: 0.61, d: 0.47, h: 0.045, r: 0.02, bw: 0.44, bd: 0.3, br: 0.08, bz: 0.04, m: M.ceramicMatte('#f4f3ef') }); bas.position.y = 0.865; van.add(bas);
  const fA = faucetDeck(black, { h: 0.15 }); fA.position.set(0, 0.865, 0.05); van.add(fA);
  B.add(B.mount(van, 'left', vz, 0), { name: 'Hänge-Waschtisch 60 cm mit Nachtlicht' });
  const nl = new THREE.PointLight(0xffc98a, 0, 1.4, 2); nl.position.set(0.3, 0.3, vz); nl.userData.on = 0.9; B.led(ledA, nl);
  B.add(at(bathScale(), 0.2, 0, vz), { name: 'Waage (parkt unterm Waschtisch)' });
  // LED-Spiegelschrank
  const mc = new THREE.Group(), mw = 0.6, mh = 0.72, md = 0.16, wM = M.paint('#f3f2ee');
  const cab = cabinet({ w: mw, h: mh, d: md, carcass: wM, plinth: 0, shelves: [0.26, 0.5], fronts: [{ y0: 0, y1: mh, x0: -mw / 2, x1: 0, door: 'l', mat: wM }, { y0: 0, y1: mh, x0: 0, x1: mw / 2, door: 'r', mat: wM }] });
  cab.userData.doors.forEach(({ piv, side }) => { const m = makeMirror(B, new THREE.PlaneGeometry(mw / 2 - 0.012, mh - 0.012)); m.position.set(side === 'l' ? mw / 4 : -mw / 4, 0, 0.0195); piv.add(m); });
  const ledM = slab(-mw / 2 + 0.02, -0.006, md - 0.05, mw / 2 - 0.02, 0.0, md - 0.02, M.lamp('#fff1dc', 3, 0.9), { cast: false }); cab.add(ledM);
  const be = beardStation(); be.position.set(-0.1, 0.268, 0.07); cab.add(be);
  const so = socket(); so.position.set(0.17, 0.08, 0.009); cab.add(so);
  const cup = lathe([[0, 0], [0.03, 0], [0.032, 0.09], [0, 0.09]], M.ceramicMatte(sage)); cup.position.set(0.15, 0.51, 0.07); cab.add(cup);
  cab.add(at(bottlesRow([{ r: 0.022, h: 0.1, c: '#efe9dd', cap: '#555' }, { r: 0.018, h: 0.12, c: '#2f3a33', cap: '#c9a052' }], 0.06), -0.2, 0.51, 0.07));
  mc.add(cab);
  B.add(B.mount(mc, 'left', vz, 1.33), { name: 'LED-Spiegelschrank · Klick zum Öffnen', click: () => openDoors(cab, 'mc', 1.9) });
  const pl = new THREE.PointLight(0xfff1dc, 0, 1.3, 2); pl.position.set(0.25, 1.25, vz); pl.userData.on = 0.6; pl.userData.day = 0.25; B.led(ledM, pl);
  // Heizkörper, Stange, Haken
  const rad = ladderRadiator({ w: 0.5, h: 1.55 });
  rad.add(at(towelOver({ w: 0.46, front: 0.42, back: 0.34, m: M.fabric('sage', sage, '#f1efe9'), seed: 3 }), 0, 1.5, 0.055));
  rad.add(at(towelOver({ w: 0.42, front: 0.3, back: 0.24, m: M.fabric('linen', '#e9e2d4', sage), seed: 9 }), 0, 0.93, 0.055));
  B.add(B.mount(rad, 'left', 1.22, 0.17), { name: 'Heizkörper (bleibt)' });
  const bar = towelRail(0.45, black); bar.add(at(towelOver({ w: 0.5, front: 0.55, back: 0.45, r: 0.012, m: M.fabric('sage2', '#a7b7a2', '#f1efe9'), seed: 5 }), 0, 0, 0.065));
  B.add(B.mount(bar, 'left', 0.55, 1.8), { name: 'Handtuchstange schwarz' });
  const hk = new THREE.Group(); hk.add(slab(-0.14, -0.02, 0, 0.14, 0.02, 0.018, oak)); [-0.08, 0.08].forEach(x => { const h = hook(black); h.position.set(x, 0, 0.018); hk.add(h); });
  hk.add(at(clothHang({ w: 0.26, h: 0.55, m: M.fabric('sage', sage, '#f1efe9'), seed: 11 }), -0.08, 0.02, 0.065));
  B.add(B.mount(hk, 'front', 0.2, 1.62), { name: 'Hakenleiste' });
  B.add(B.mount(exhaustFan(), 'left', 0.12, 2.12), { wall: 'left' });
  // Hochschrank
  const hs = cabinet({ w: 0.3, h: 1.8, d: 0.3, carcass: M.paint('#f3f2ee'), fronts: [{ y0: 0.06, y1: 0.66, mat: oak }, { y0: 0.66, y1: 1.8, door: 'r', mat: oak }], shelves: [1.0, 1.35], handle: (fw, fh, f) => { const g = new THREE.Group(); g.add(slab(-0.06, fh / 2 - 0.035, 0, 0.06, fh / 2 - 0.025, 0.012, black)); if (f.door) g.position.y = 0; return g; } });
  B.add(B.mount(hs, 'right', L - 0.17, 0), { name: 'Hochschrank 30 cm mit Wäschekippe', tall: 'right' }); B.foot(W - 0.3, L - 0.32, W, L - 0.02);
  B.add(at(pedalBin(sage), W - 0.13, 0, L - 0.5), { name: 'Treteimer' }); B.foot(W - 0.24, L - 0.61, W - 0.02, L - 0.39);
  // Textil, Pflanzen, Licht
  B.add(at(rug(0.46, 1.3, 'sage', { base: '#9db09a', border: 'rgba(255,255,255,0.35)' }), 0.71, 0.006, 1.5), { name: 'Badläufer, waschbar' });
  const hp = hangingPlant({ len: 0.3, potR: 0.075, potM: M.ceramicMatte('#efebe3'), plant: trailing({ n: 9, minL: 0.25, maxL: 0.7, seed: 4 }) });
  hp.position.set(0.82, H, 0.27); B.add(hp, { name: 'Efeutute in der Ampel' });
  B.add(at(domeLamp(0.17), W / 2, H, L / 2), { ceil: true, name: 'Deckenleuchte Opalglas' });

  B.hot(1, [gx, 1.5, 0.6], 'Glas-Faltwand statt Vorhang', 'Klappt zur Wand, wenn du badest. Kein Kleben, kein Stockfleck. Vier Schrauben in die Fugen, beim Auszug wieder raus.');
  B.hot(2, [0.38, 1.58, 0.13], 'WC-Überbauregal', 'Drei Eichenböden für Klopapier-Vorrat, Körbe und eine Pflanze. Steht auf dem Boden, null Bohren.');
  B.hot(3, [0.18, 1.72, vz], 'LED-Spiegelschrank mit Steckdose', 'Bart-Station: Trimmer lädt im Schrank, Öl und Kamm stehen griffbereit. Kein Kabel mehr am Duschregal. Klick auf den Schrank öffnet ihn.');
  B.hot(4, [0.44, 0.5, vz], 'Hängender Waschtisch', 'Boden darunter bleibt frei, die Waage parkt hier. LED mit Bewegungsmelder als Nachtlicht.');
  B.hot(5, [W - 0.15, 1.25, L - 0.17], 'Hochschrank mit Wäschekippe', '30 cm schmal, rund 150 Liter Stauraum, unten Wäschekorb. Der Treteimer zieht daneben ein.');
  B.hot(6, [0.72, 0.04, 0.9], 'Klick-Vinyl Fischgrät', 'Wasserfestes SPC, schwimmend auf die alten Fliesen gelegt. Beim Auszug kommt es wieder raus.');
  B.hot(7, [0.82, 1.9, 0.27], 'Efeutute am Fenster', 'Mag Feuchtigkeit und wenig Licht, rankt von allein. Pflegeleichter geht Grün nicht.');
  stdZones(B, { wcFront: 0.58 });
  B.zone('Waschtisch', 0.46, L - 0.81, 1.21, L);
}

/* ------------------------------------------------------------------ */
function buildB(B) { // Japandi Spa
  const { W, L, H } = B.D;
  const mcFloor = M.cloud('bFloor', { base: '#bcae9b', light: '#e2d7c6', dark: '#8a7e6d', contrast: 0.08, rough: 0.42, world: 2.2, env: 0.55 });
  const mcWall = M.cloud('bWallMC', { base: '#cdc1b0', light: '#ebe2d4', dark: '#9f927f', contrast: 0.08, rough: 0.48, world: 2.0, env: 0.5 });
  const lime = M.cloud('bLime', { base: '#ebe4d8', light: '#fbf8f2', dark: '#c9bead', contrast: 0.07, rough: 0.92, strokes: 140, world: 2.4, env: 0.25, bumpScale: 0.4 });
  const oakB = M.wood('oakB', WOOD.oak), black = M.black(), doorL = M.wood('doorLight', WOOD.doorLight);
  buildShell(B, {
    walls: (id, len) => {
      if (id === 'right') return [{ a0: 0, a1: 1.38, v0: 0, v1: H, mat: mcWall }, { a0: 1.38, a1: len, v0: 0, v1: H, mat: lime }];
      if (id === 'back') return [{ a0: 0, a1: 0.9, v0: 0, v1: H, mat: lime }, { a0: 0.9, a1: len, v0: 0, v1: H, mat: mcWall }];
      return [{ a0: 0, a1: len, v0: 0, v1: H, mat: lime }];
    },
    floor: mcFloor, ceiling: M.plaster('#f3efe8'), reveal: M.plaster('#ece5d9'),
    niches: [{ wall: 'right', a0: 0.3, a1: 0.66, v0: 1.12, v1: 1.42, depth: 0.09, mat: mcWall }],
    door: { leafMat: doorL, innerMat: doorL, handleMat: black },
  });
  addLights(B, { mainColor: 0xffecd2 });
  // Vorwand + Ablage
  B.add(slabW(0, 0, 0, W, 1.0, 0.2, mcWall), { name: 'Vorwand mit Ablage' }); B.foot(0, 0, W, 0.2);
  B.add(slab(0, 1.0, 0, 0.9, 1.03, 0.22, oakB), { name: 'Ablage Eiche' });
  B.add(slabW(0.9, 1.0, 0, W, 1.025, 0.21, mcWall));
  // Lamellen hinter WC
  const fx1 = B.win.a0 - 0.03;
  B.add(slab(0, 1.03, 0, fx1, H, 0.012, M.paint('#2b2621')), { wall: 'back' });
  const slats = []; for (let x = 0.015; x + 0.034 <= fx1; x += 0.052) slats.push(slab(x, 1.03, 0.012, x + 0.034, H - 0.002, 0.034, oakB));
  B.add(mergeInto(slats, oakB), { wall: 'back', name: 'Eichen-Lamellen' });
  const cove = slab(0.02, H - 0.03, 0.035, fx1 - 0.02, H - 0.024, 0.04, M.lamp('#ffcf94', 2.4, 0.0), { cast: false }); B.add(cove, { wall: 'back' });
  const cl = new THREE.PointLight(0xffcf94, 0, 1.6, 2); cl.position.set(fx1 / 2, H - 0.25, 0.25); cl.userData.on = 0.55; B.led(cove, cl);
  // Wand-WC
  const wc = toilet({ wall: true, cer: M.ceramicMatte('#f3f2ee') });
  B.add(B.mount(wc, 'back', 0.45, 0, 0.2), { name: 'Wand-WC spülrandlos · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.add(B.mount(flushPlate(black, black, true), 'back', 0.45, 0.8, 0.2), { name: 'Drückerplatte' });
  // Walk-in
  const gx = 0.9, gz1 = 1.14, gm = M.glass();
  B.add(slab(gx - 0.004, 0.0, 0.2, gx + 0.004, 2.0, gz1, gm, { cast: false }), { name: 'Walk-in-Glaswand 8 mm' });
  B.add(slab(gx - 0.004, 1.03, 0.0, gx + 0.004, 2.0, 0.2, gm, { cast: false }));
  B.add(slab(gx - 0.012, 0.0, 0.2, gx + 0.012, 1.0, 0.214, black), slab(gx - 0.012, 1.03, 0.0, gx + 0.012, 2.0, 0.014, black), slab(gx - 0.012, 0, 0.2, gx + 0.012, 0.012, gz1, black));
  B.add(rod([gx, 1.98, gz1 - 0.02], [W, 1.98, gz1 - 0.02], 0.009, black));
  B.add(slab(W - 0.1, 0, 0.32, W - 0.04, 0.003, 1.15, M.steel(), { cast: false }), { name: 'Duschrinne' });
  B.foot(gx, 0.2, W, 1.25, 'Dusche');
  B.add(rod([W, 2.1, 0.72], [W - 0.36, 2.1, 0.72], 0.01, black));
  B.add(at(rbox(0.3, 0.012, 0.3, 0.005, black), W - 0.4, 2.088, 0.72), { name: 'Regendusche 30 × 30' });
  const th = new THREE.Group(); th.add(at(rbox(0.16, 0.16, 0.012, 0.004, black), 0, 0, 0.006));
  for (const y of [0.035, -0.035]) { const k = cyl(0.022, 0.022, 0.03, black, 24); k.rotation.x = PI / 2; k.position.set(0, y, 0.025); th.add(k); }
  B.add(B.mount(th, 'right', 0.92, 1.05), { name: 'Unterputz-Thermostat' });
  B.add(B.mount((() => { const g = new THREE.Group(); g.add(at(rbox(0.04, 0.05, 0.04, 0.008, black), 0, 0, 0.02)); const hh = cyl(0.016, 0.02, 0.24, black); hh.position.set(0, 0.06, 0.045); hh.rotation.x = -0.15; g.add(hh); return g; })(), 'right', 1.08, 1.3), { name: 'Handbrause' });
  B.add(tube([[W - 0.03, 0.97, 0.92], [W - 0.06, 0.7, 0.98], [W - 0.07, 0.65, 1.06], [W - 0.06, 0.9, 1.09], [W - 0.05, 1.18, 1.08]], 0.008, black, 50));
  const ni = bottlesRow([{ r: 0.028, h: 0.17, c: '#3a342f', cap: '#c7b9a3', pump: true }, { r: 0.028, h: 0.17, c: '#d9cfc0', cap: '#3a342f', pump: true }, { r: 0.022, h: 0.12, c: '#8a6a4b', cap: '#3a342f' }], 0.085);
  B.add(B.mount(ni, 'right', 0.38, 1.12, -0.05), { wall: 'right' });
  const st = stool(); st.position.set(W - 0.33, 0, 0.9); st.rotation.y = PI / 2; B.add(st, { name: 'Teak-Hocker' });
  // Ablage-Deko
  for (let i = 0; i < 3; i++) B.add(at(rolledTowel(0.22, 0.045, M.fabric('linen', '#e9e2d4', '#8f846f')), 0.2, 1.075 + (i === 2 ? 0.075 : 0), 0.09 + (i === 2 ? 0.04 : i * 0.085)));
  B.add(at(vaseBranch(), 0.55, 1.03, 0.1), { name: 'Steinzeug-Vase' });
  B.add(at(rbox(0.12, 0.02, 0.08, 0.01, M.ceramicMatte('#3b3734')), 1.25, 1.035, 0.1));
  // Heizkörper schwarz
  const rad = ladderRadiator({ w: 0.45, h: 1.4, m: black, groups: [6, 6, 5], valveM: black });
  rad.add(at(towelOver({ w: 0.42, front: 0.4, back: 0.32, m: M.fabric('linen', '#e9e2d4', '#8f846f'), seed: 2 }), 0, 1.36, 0.055));
  B.add(B.mount(rad, 'left', 1.22, 0.22), { name: 'Handtuchheizkörper schwarz' });
  // Waschtisch schwebend
  const vz = L - 0.55, vw = 0.8, vd = 0.46; B.vz = vz;
  const van = new THREE.Group();
  van.add(slab(-vw / 2, 0.4, 0, vw / 2, 0.78, vd - 0.02, oakB));
  const fl = M.flutedWood('oakB', WOOD.oak, 26);
  van.add(slab(-vw / 2 + 0.002, 0.402, vd - 0.02, -0.002, 0.776, vd, fl), slab(0.002, 0.402, vd - 0.02, vw / 2 - 0.002, 0.776, vd, fl));
  const stone = M.cloud('bStone', { base: '#d8d0c3', light: '#efe9df', dark: '#b2a795', contrast: 0.06, rough: 0.55, world: 1.2, env: 0.5 });
  van.add(slabW(-vw / 2, 0.78, 0, vw / 2, 0.8, vd + 0.005, stone));
  const ledB = slab(-vw / 2 + 0.03, 0.394, vd - 0.07, vw / 2 - 0.03, 0.4, vd - 0.06, M.lamp('#ffcf94', 2.6, 0.0), { cast: false }); van.add(ledB);
  const ves = vessel({ w: 0.44, d: 0.34, h: 0.12, m: M.ceramicMatte('#efebe4') }); ves.position.set(0, 0.8, 0.27); van.add(ves);
  const fw = faucetWall(black, { reach: 0.21 }); fw.position.set(0, 1.04, 0); van.add(fw);
  B.add(B.mount(van, 'left', vz, 0), { name: 'Waschtisch Eiche gerillt, schwebend' });
  const ul = new THREE.PointLight(0xffcf94, 0, 1.4, 2); ul.position.set(0.3, 0.25, vz); ul.userData.on = 0.9; B.led(ledB, ul);
  const mg = new THREE.Group(), R = 0.33;
  const halo = mesh(new THREE.RingGeometry(R - 0.02, R + 0.03, 64), M.lamp('#ffe2bb', 2.2, 0.35), { cast: false }); halo.position.z = 0.006; mg.add(halo);
  mg.add(at(cyl(R - 0.01, R - 0.01, 0.02, M.paint('#2a2724'), 64), 0, 0, 0.018)).children.at(-1).rotation.x = PI / 2;
  const mirB = makeMirror(B, new THREE.CircleGeometry(R, 64)); mirB.position.z = 0.03; mg.add(mirB);
  const ring = mesh(new THREE.TorusGeometry(R, 0.006, 8, 96), black); ring.position.z = 0.03; mg.add(ring);
  B.add(B.mount(mg, 'left', vz, 1.56), { name: 'LED-Rundspiegel Ø 66' });
  const ml = new THREE.PointLight(0xffe2bb, 0, 1.2, 2); ml.position.set(0.15, 1.56, vz); ml.userData.on = 0.5; ml.userData.day = 0.15; B.led(halo, ml);
  // Einbauschrank
  const cab = cabinet({ w: 0.5, h: H - 0.004, d: 0.36, carcass: oakB, inner: M.paint('#efe9df'), plinth: 0.08, shelves: [0.62, 1.2, 1.55, 1.98], plinthM: M.paint('#3a332c'),
    fronts: [{ y0: 0.08, y1: 1.98, door: 'l', mat: M.flutedWood('oakB', WOOD.oak, 16) }, { y0: 1.98, y1: H - 0.004, door: 'l', mat: M.flutedWood('oakB2', WOOD.oak, 16) }],
    handle: (fw, fh) => { const g = new THREE.Group(); g.add(slab(fw / 2 - 0.03, -0.12, 0, fw / 2 - 0.018, 0.12, 0.016, black)); return g; } });
  const inn = new THREE.Group();
  inn.add(at(rbox(0.38, 0.4, 0.28, 0.03, M.fabric('basket', '#cdb894')), 0, 0.3, 0.17));
  for (let i = 0; i < 3; i++) inn.add(at(rolledTowel(0.3, 0.05, M.fabric('linen', '#e9e2d4', '#8f846f')), 0, 1.255 + i * 0.0, 0.07 + i * 0.1));
  inn.add(at(towelStack(4, 0.36, 0.26, [M.fabric('linen', '#e9e2d4', '#8f846f'), M.fabric('stone', '#b9ad9a')]), 0, 0.638, 0.15));
  const bsB = beardStation(M.wood('teak', WOOD.teak)); bsB.position.set(0, 1.565, 0.16); inn.add(bsB);
  const soB = socket(); soB.position.set(0.12, 1.66, 0.009); inn.add(soB);
  inn.add(at(bottlesRow([{ r: 0.03, h: 0.2, c: '#ffffff', cap: '#2a2a2a', pump: true }, { r: 0.028, h: 0.16, c: '#7f8c7a', cap: '#2a2a2a' }], 0.09), -0.12, 1.989, 0.15));
  cab.add(inn);
  const cabLower = { userData: { doors: [cab.userData.doors[0]] } };
  B.add(B.mount(cab, 'right', L - 0.27, 0), { name: 'Einbauschrank deckenhoch · Klick zum Öffnen', click: () => openDoors(cabLower, 'cabB', 1.8), tall: 'right' });
  B.foot(W - 0.36, L - 0.52, W, L - 0.02, 'Schrank');
  const bar = towelRail(0.38, black); bar.add(at(towelOver({ w: 0.46, front: 0.5, back: 0.42, r: 0.012, m: M.fabric('linen', '#e9e2d4', '#8f846f'), seed: 7 }), 0, 0, 0.065));
  B.add(B.mount(bar, 'right', 1.64, 1.3), { name: 'Handtuch am Ausstieg' });
  B.add(at(rug(0.68, 0.95, 'linen', { base: '#d6ccbb', border: 'rgba(90,70,50,0.22)' }), 0.88, 0.006, 1.82), { name: 'Leinen-Teppich' });
  for (const [x, z] of [[0.45, 0.55], [W - 0.4, 0.72], [0.85, 1.75], [0.85, L - 0.35]]) B.add(at(spot(), x, H, z), { ceil: true, name: 'Einbauspot' });
  B.add(B.mount(exhaustFan(), 'left', 0.12, 2.12), { wall: 'left' });

  B.hot(1, [W - 0.42, 1.45, 0.75], 'Walk-in-Dusche 80 × 105', 'Bodengleich, ohne Wanne und Vorhang. Regendusche plus Handbrause, die Glaswand schützt das WC vor Spritzwasser.');
  B.hot(2, [W - 0.02, 1.27, 0.48], 'Beleuchtete Nische', 'Shampoo wohnt in der Wand statt auf einem Gitterkorb. Abends mit warmem LED.');
  B.hot(3, [0.45, 1.1, 0.14], 'Vorwand mit Eichen-Ablage', 'Wand-WC, Spülkasten unsichtbar, durchgehende Ablage bis in die Dusche. Unter dem WC lässt sich durchwischen.');
  B.hot(4, [W - 0.18, 1.5, L - 0.27], 'Einbauschrank bis zur Decke', 'Rund 430 Liter: Wäschekorb, Handtücher, Vorrat und ein Fach mit Steckdose für die Bart-Station. Klick auf den Schrank öffnet ihn.');
  B.hot(5, [0.25, 0.98, vz], 'Schwebender Eichen-Waschtisch', 'Aufsatzbecken, Wandarmatur, 80 cm Ablage und LED-Rundspiegel. Darunter LED als Nachtlicht.');
  B.hot(6, [0.9, 0.03, 1.5], 'Mikrozement fugenlos', 'Boden und Dusche aus einem Guss: keine Fugen, die grau werden.');
  B.hot(7, [W - 0.33, 0.5, 0.9], 'Teak-Hocker', 'Spa-Gefühl und praktisch: Füße hochstellen, Bart in Ruhe waschen.');
  B.hot(8, [0.33, 1.7, 0.03], 'Eichen-Lamellen mit Lichtfuge', 'Warme Holzwand hinter dem WC, oben indirektes Licht für abends.');
  B.zone('WC', 0.05, 0.76, 0.85, 1.51);
  B.zone('Dusche', 0.9, 1.25, W, 2.0);
  B.zone('Waschtisch', 0.46, vz - 0.45, 1.21, vz + 0.45);
  B.dim([gx, 0.6, 1.3], [W, 0.6, 1.3], '80');
  B.dim([0.5, 0.82, vz - 0.4], [0.5, 0.82, vz + 0.4], '80');
}

/* ------------------------------------------------------------------ */
function archShape(w, h, cy = 0) { const s = new THREE.Shape(), r = w / 2; s.moveTo(-r, cy); s.lineTo(r, cy); s.lineTo(r, cy + h - r); s.absarc(0, cy + h - r, r, 0, PI, false); s.lineTo(-r, cy); return s; }
function buildC(B) { // Grand Hotel
  const { W, L, H } = B.D;
  const zel = M.tile('zellige', { tw: 0.1, th: 0.1, cols: 10, rows: 10, colors: ['#1e4a3c', '#245746', '#18402f', '#2b5f4c', '#1a4436', '#2f6652'], vary: 0.07, grout: '#c8c0ad', gw: 0.0022, zellige: true, rt: 0.06, bevel: 0.01, bumpScale: 2.4, env: 1.1 });
  const lime = M.cloud('cLime', { base: '#d7c9b6', light: '#ece2d3', dark: '#b4a38c', contrast: 0.08, rough: 0.9, strokes: 140, world: 2.4, env: 0.25, bumpScale: 0.4 });
  const tz = terrazzoSet('cTz', { base: '#ebe5d9', chips: [['#2c5a49', 3, 0.018], ['#1b1b1b', 2, 0.012], ['#ffffff', 2, 0.02], ['#c49a52', 1, 0.01], ['#b8ae9f', 3, 0.015], ['#7f9b8c', 2, 0.014]] });
  const floor = mat('cFloor', () => std({ map: tz.map, roughnessMap: tz.rough, roughness: 1, envMapIntensity: 0.8 }));
  const brass = M.brass(), walnut = M.wood('walnut', WOOD.walnut), green = M.lacquer('#24493c'), doorWood = M.wood('door', WOOD.door);
  const WS = 1.25, fullTo = W - 0.78;
  buildShell(B, {
    walls: (id, len) => {
      if (id === 'right') return [{ a0: 0, a1: 1.66, v0: 0, v1: H, mat: zel }, { a0: 1.66, a1: len, v0: 0, v1: WS, mat: zel }, { a0: 1.66, a1: len, v0: WS, v1: H, mat: lime }];
      if (id === 'back') return [{ a0: 0, a1: fullTo, v0: 0, v1: WS, mat: zel }, { a0: 0, a1: fullTo, v0: WS, v1: H, mat: lime }, { a0: fullTo, a1: len, v0: 0, v1: H, mat: zel }];
      return [{ a0: 0, a1: len, v0: 0, v1: WS, mat: zel }, { a0: 0, a1: len, v0: WS, v1: H, mat: lime }];
    },
    floor, ceiling: M.plaster('#ece4d8'), reveal: M.plaster('#e2d6c6'),
    niches: [{ wall: 'right', a0: 1.0, a1: 1.45, v0: 0.7, v1: 1.0, depth: 0.09, mat: zel }],
    door: { leafMat: doorWood, innerMat: green, handleMat: brass },
    window: { sillMat: M.ceramic('#efe9df') },
  });
  addLights(B, { mainColor: 0xffe6c4 });
  const win = { a0: B.win.a0, a1: B.win.a1, v0: B.win.v0, v1: B.win.v1 };
  trimLine(B, 'left', 0, L, WS, brass); trimLine(B, 'front', 0, W, WS, brass, [{ a0: B.door.a0 - 0.07, a1: B.door.a1 + 0.07, v0: 0, v1: 2.2 }]);
  trimLine(B, 'back', 0, fullTo, WS, brass, [win]); trimLine(B, 'right', 1.66, L, WS, brass);
  // Wanne mit Zellige-Schürze + Glaswand
  const tub = bathtub({ apronMat: zel, worldApron: true }); tub.position.set(W - 0.375, 0, 0); B.add(tub, { name: 'Wanne mit Zellige-Schürze' }); B.foot(W - 0.75, 0, W, 1.6);
  const gx = W - 0.725;
  B.add(slab(gx - 0.004, 0.565, 0.012, gx + 0.004, 1.98, 0.86, M.glass(), { cast: false }), { name: 'Feste Glaswand, Messingprofil' });
  B.add(slab(gx - 0.012, 0.565, 0, gx + 0.012, 1.98, 0.016, brass), slab(gx - 0.01, 0.565, 0.016, gx + 0.01, 0.585, 0.86, brass));
  B.add(rod([gx, 1.96, 0.85], [W, 1.96, 0.85], 0.008, brass));
  // Messing-Thermostat-Set
  const sh = new THREE.Group();
  const body = cyl(0.028, 0.028, 0.32, brass); body.rotation.z = PI / 2; body.position.set(0, 1.05, 0.07); sh.add(body);
  for (const x of [-0.17, 0.17]) { const k = cyl(0.03, 0.03, 0.04, brass); k.rotation.z = PI / 2; k.position.set(x, 1.05, 0.07); sh.add(k); sh.add(rod([x * 0.6, 1.05, 0], [x * 0.6, 1.05, 0.07], 0.012, brass)); }
  sh.add(rod([0, 1.08, 0.07], [0, 2.02, 0.07], 0.012, brass), rod([0, 2.02, 0.07], [0, 2.04, 0.36], 0.011, brass), rod([0, 1.9, 0], [0, 1.9, 0.07], 0.008, brass));
  const rh = cyl(0.125, 0.125, 0.012, brass, 48); rh.position.set(0, 2.03, 0.36); sh.add(rh);
  sh.add(at(cyl(0.11, 0.11, 0.002, M.paint('#3a3326'), 48), 0, 2.023, 0.36));
  const hh = cyl(0.016, 0.02, 0.24, brass); hh.position.set(0.0, 1.5, 0.11); sh.add(hh); sh.add(at(rbox(0.04, 0.04, 0.05, 0.01, brass), 0, 1.4, 0.09));
  sh.add(tube([[0.0, 1.0, 0.07], [0.06, 0.78, 0.11], [0.12, 0.72, 0.13], [0.06, 0.95, 0.12], [0.0, 1.37, 0.11]], 0.007, brass, 50));
  B.add(B.mount(sh, 'right', 0.62, 0), { name: 'Thermostat-Brauseset Messing' });
  B.add(B.mount(bottlesRow([{ r: 0.03, h: 0.18, c: '#7a3d1a', cap: '#c9a052', pump: true, gloss: 0.05 }, { r: 0.03, h: 0.18, c: '#2a2a28', cap: '#c9a052', pump: true }, { r: 0.022, h: 0.12, c: '#efe7d8', cap: '#c9a052' }], 0.09), 'right', 1.1, 0.7, -0.05), { wall: 'right' });
  // WC + Regal + Kunstdruck
  const wc = toilet({ seat: walnut }); B.add(B.mount(wc, 'back', 0.45, 0), { name: 'WC mit Nussbaum-Sitz · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.foot(0.27, 0, 0.63, 0.58, 'WC');
  B.add(B.mount(flushPlate(brass, brass, true), 'back', 0.45, 0.98), { wall: 'back', name: 'Drückerplatte Messing' });
  const shelf = new THREE.Group();
  shelf.add(slab(0.1, 1.4, 0, 0.62, 1.432, 0.19, walnut));
  for (const x of [0.16, 0.56]) shelf.add(slab(x - 0.008, 1.32, 0.0, x + 0.008, 1.4, 0.012, brass), slab(x - 0.008, 1.392, 0.0, x + 0.008, 1.4, 0.16, brass));
  const tp = trailing({ n: 7, minL: 0.15, maxL: 0.4, size: 0.04, seed: 9, out: 0.06 }); const tpp = pot({ r: 0.06, h: 0.09, m: brass }); tpp.position.set(0.22, 1.432, 0.1); tp.position.set(0.22, 1.51, 0.1); shelf.add(tpp, tp);
  const cdl = candle(0.03, 0.09); cdl.position.set(0.5, 1.432, 0.1); shelf.add(cdl);
  shelf.add(at(rbox(0.12, 0.03, 0.15, 0.004, M.paint('#9a3b2c')), 0.37, 1.447, 0.1), at(rbox(0.11, 0.025, 0.14, 0.004, M.paint('#e7dcc6')), 0.37, 1.475, 0.1));
  const fr = new THREE.Group(); fr.add(slab(-0.17, -0.24, 0, 0.17, 0.24, 0.025, walnut)); const pr = mesh(new THREE.PlaneGeometry(0.28, 0.4), std({ map: printTex(), roughness: 0.8, envMapIntensity: 0.3 })); pr.position.z = 0.0255; fr.add(pr);
  fr.position.set(0.36, 1.82, 0); shelf.add(fr);
  B.add(shelf, { name: 'Nussbaum-Regal & Kunstdruck' });
  // Waschtisch Nussbaum gerillt
  const vz = L - 0.4, vw = 0.6, vd = 0.46; B.vz = vz;
  const van = new THREE.Group(), flW = M.flutedWood('walnut', WOOD.walnut, 22);
  van.add(slab(-vw / 2, 0.4, 0, vw / 2, 0.62, vd - 0.02, walnut), slab(-vw / 2, 0.62, 0, -vw / 2 + 0.018, 0.8, vd - 0.02, walnut), slab(vw / 2 - 0.018, 0.62, 0, vw / 2, 0.8, vd - 0.02, walnut), slab(-vw / 2, 0.62, 0, vw / 2, 0.8, 0.016, walnut));
  van.add(slab(-vw / 2 + 0.002, 0.402, vd - 0.02, vw / 2 - 0.002, 0.598, vd, flW), slab(-vw / 2 + 0.002, 0.602, vd - 0.02, vw / 2 - 0.002, 0.798, vd, flW));
  for (const y of [0.5, 0.7]) { const k = knob(brass); k.position.set(0, y, vd); van.add(k); }
  const marble = mat('marbleTop', () => phys({ map: marbleTex('top'), roughness: 0.12, clearcoat: 0.6, envMapIntensity: 0.8 }));
  van.add(at(mesh(plateGeo(vw + 0.01, vd + 0.01, 0.006, 0.03, { w: 0.42, d: 0.3, r: 0.06, z: 0.03 }), marble), 0, 0.8, (vd + 0.01) / 2));
  van.add(at(mesh(loftGeo([{ w: 0.42, d: 0.3, r: 0.06, y: 0.805, z: vd / 2 + 0.035 }, { w: 0.38, d: 0.26, r: 0.06, y: 0.74, z: vd / 2 + 0.04 }, { w: 0.2, d: 0.14, r: 0.05, y: 0.68, z: vd / 2 + 0.045 }], { capBottom: true }), M.ceramic()), 0, 0, 0));
  van.add(at(cyl(0.02, 0.02, 0.004, brass), 0, 0.683, vd / 2 + 0.045));
  const ft = faucetTall(brass); ft.position.set(0, 0.83, 0.07); van.add(ft);
  B.add(B.mount(van, 'left', vz, 0), { name: 'Waschtisch Nussbaum gerillt, Marmor-Optik' });
  // Bogenspiegel + Leuchte
  const mg = new THREE.Group();
  const frameS = archShape(0.5, 0.92); frameS.holes.push(archShape(0.44, 0.89, 0.015));
  mg.add(mesh(new THREE.ExtrudeGeometry(frameS, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 32 }), brass));
  const mirC = makeMirror(B, new THREE.ShapeGeometry(archShape(0.445, 0.892, 0.014), 32)); mirC.position.z = 0.012; mg.add(mirC);
  mg.add(at(mesh(new THREE.ShapeGeometry(archShape(0.46, 0.9, 0.01), 24), M.paint('#2a2622')), 0, 0, 0.004));
  B.add(B.mount(mg, 'left', vz, 1.12), { name: 'Bogenspiegel Messing' });
  const lampG = new THREE.Group(), opal = M.lamp('#fff3e0', 2.6, 0.9);
  lampG.add(at(rbox(0.1, 0.05, 0.016, 0.006, brass), 0, 0, 0.008), rod([0, 0, 0.016], [0, 0, 0.1], 0.008, brass), rod([-0.2, 0, 0.1], [0.2, 0, 0.1], 0.009, brass));
  for (const x of [-0.18, 0.18]) { lampG.add(rod([x, 0, 0.1], [x, -0.05, 0.1], 0.006, brass)); const gl = sph(0.055, opal, 28); gl.position.set(x, -0.1, 0.1); gl.castShadow = false; lampG.add(gl); }
  B.add(B.mount(lampG, 'left', vz, 2.2), { name: 'Messing-Leuchte mit Opalglas' });
  const lp = new THREE.PointLight(0xffe0b8, 0, 1.8, 2); lp.position.set(0.18, 2.06, vz); lp.userData.on = 1.2; lp.userData.day = 0.5; B.led(lampG, lp);
  // Apothekerschrank
  const ap = cabinet({ w: 0.6, h: 1.95, d: 0.32, carcass: green, inner: M.paint('#e9e1d2'), plinth: 0.1, plinthM: green, shelves: [0.96, 1.32, 1.64],
    fronts: [{ y0: 0.1, y1: 0.95, x0: -0.3, x1: 0, door: 'l', mat: green }, { y0: 0.1, y1: 0.95, x0: 0, x1: 0.3, door: 'r', mat: green },
      { y0: 0.96, y1: 1.9, x0: -0.3, x1: 0, door: 'l', glass: true, frameM: green }, { y0: 0.96, y1: 1.9, x0: 0, x1: 0.3, door: 'r', glass: true, frameM: green }],
    handle: (fw, fh, f) => { const k = knob(brass, 0.011); k.position.set(f.door === 'l' ? fw / 2 - 0.04 : -fw / 2 + 0.04, f.y1 < 1 ? fh / 2 - 0.08 : -fh / 2 + 0.08, 0); return k; } });
  ap.add(slab(-0.32, 1.95, -0.0, 0.32, 1.99, 0.34, green));
  const apIn = new THREE.Group();
  apIn.add(at(bottlesRow([{ r: 0.03, h: 0.16, c: '#7a3d1a', cap: '#c9a052', gloss: 0.05 }, { r: 0.025, h: 0.12, c: '#efe7d8', cap: '#24493c' }, { r: 0.03, h: 0.18, c: '#2a2a28', cap: '#c9a052' }, { r: 0.022, h: 0.1, c: '#c49a52', cap: '#2a2a28' }], 0.12), -0.18, 1.33, 0.14));
  apIn.add(at(towelStack(4, 0.3, 0.22, [M.fabric('creamG', '#efe7d8', '#24493c'), M.fabric('greenT', '#2b5a49')]), -0.08, 0.97, 0.13));
  apIn.add(at(bottlesRow([{ r: 0.035, h: 0.1, c: '#f3eee3', cap: '#c9a052' }, { r: 0.035, h: 0.1, c: '#f3eee3', cap: '#c9a052' }], 0.09), 0.12, 0.97, 0.13));
  const bsC = beardStation(M.paint('#24493c')); bsC.position.set(0.0, 1.65, 0.14); apIn.add(bsC);
  ap.add(apIn);
  const apUpper = { userData: { doors: ap.userData.doors.slice(2) } };
  B.add(B.mount(ap, 'right', L - 0.47, 0), { name: 'Apothekerschrank · Klick zum Öffnen', click: () => openDoors(apUpper, 'apC', 1.7), tall: 'right' });
  B.foot(W - 0.32, L - 0.77, W, L - 0.17, 'Schrank');
  // Heizkörper Messing
  const rad = ladderRadiator({ w: 0.48, h: 1.5, m: brass, valveM: brass });
  rad.add(at(towelOver({ w: 0.44, front: 0.42, back: 0.34, m: M.fabric('creamG', '#efe7d8', '#24493c'), seed: 3 }), 0, 1.46, 0.055));
  rad.add(at(towelOver({ w: 0.4, front: 0.3, back: 0.24, m: M.fabric('greenT', '#2b5a49'), seed: 4 }), 0, 0.9, 0.055));
  B.add(B.mount(rad, 'left', 1.22, 0.18), { name: 'Handtuchheizkörper Messing' });
  const hk = new THREE.Group(); [-0.07, 0.07].forEach(x => { const h = hook(brass); h.position.x = x; hk.add(h); });
  hk.add(at(clothHang({ w: 0.26, h: 0.55, m: M.fabric('greenT', '#2b5a49'), seed: 12 }), -0.07, 0.02, 0.045));
  B.add(B.mount(hk, 'front', 0.2, 1.62), { name: 'Messinghaken' });
  B.add(B.mount(exhaustFan(), 'left', 0.12, 2.12), { wall: 'left' });
  B.add(at(rug(0.44, 1.35, 'kilim', { base: '#8f3a24', kilim: ['#8f3a24', '#e9dcc4', '#23395b', '#c98e3a'] }), 0.71, 0.006, 1.5), { name: 'Kelim-Läufer' });
  const hp = hangingPlant({ len: 0.28, potR: 0.08, potM: brass, ropeM: brass, plant: fern({ n: 20, len: 0.38 }) });
  hp.position.set(0.7, H, 0.3); B.add(hp, { name: 'Boston-Farn' });
  for (const [x, z] of [[W / 2, 0.75], [W / 2, 1.85]]) B.add(at(spot(M.brass()), x, H, z), { ceil: true, name: 'Einbauspot' });

  B.hot(1, [gx, 1.55, 0.45], 'Feste Glaswand + Thermostat', 'Duschen in der Wanne ohne Vorhang. Regenbrause und Handbrause aus gebürstetem Messing mit Thermostat.');
  B.hot(2, [W - 0.02, 0.85, 1.22], 'Beleuchtete Wannennische', 'Flaschen in der Wand, abends warmes Licht auf den Zellige-Fliesen.');
  B.hot(3, [W - 0.02, 1.75, 1.3], 'Zellige-Fliesen flaschengrün', 'Jede Fliese ein bisschen anders, das Licht spielt darauf. Bis 1,25 m, im Nassbereich raumhoch. Fliese auf Fliese verlegt, kein Abriss.');
  B.hot(4, [0.25, 0.7, vz], 'Nussbaum-Waschtisch gerillt', 'Marmor-Optik-Platte, Unterbaubecken, Messing-Armatur. Zwei Schubladen mit Einteilung für Bartpflege.');
  B.hot(5, [W - 0.16, 1.55, L - 0.47], 'Apothekerschrank', 'Oben Glas für das Schöne, unten zu für den Vorrat. Die Bart-Station steht im Glasfach. Klick öffnet die Glastüren.');
  B.hot(6, [0.72, 0.03, 2.3], 'Terrazzo-Boden', '60er-Platten mit grünen und messingfarbenen Splittern, auf die alten Fliesen verlegt.');
  B.hot(7, [0.06, 1.2, 1.22], 'Messing-Heizkörper', 'Handtücher hängen nebeneinander statt übereinander und trocknen schneller.');
  B.hot(8, [0.36, 1.85, 0.03], 'Regal & Kunstdruck über dem WC', 'Die tote Wand wird zur kleinen Galerie mit Ablage.');
  stdZones(B, { wcFront: 0.58 });
  B.zone('Waschtisch', 0.46, vz - 0.45, 1.21, Math.min(L, vz + 0.45));
}

/* ------------------------------------------------------------------ */
const VARIANTS = [
  {
    key: 'bestand', hash: 'bestand', label: 'Bestand', sub: 'So ist es jetzt', build: buildBestand, sw: ['#efebe2', '#d5c7b0', '#2f7d90'],
    info: {
      eyebrow: 'Bestand · rekonstruiert aus 13 Fotos', title: 'Das Bad heute',
      pitch: 'Rund 4,3 m², hell gefliest, mit Fenster und Lüfter. Die Substanz passt. Das Problem ist die Organisation: vieles steht auf dem Boden oder hängt irgendwo dazwischen.',
      tenant: null, budget: null, effort: '—', storage: 180,
      good: ['Fenster und Abluft: beste Voraussetzung gegen Schimmel', 'Fliesen sauber verlegt, hell und intakt', 'Heizkörper mit Thermostat am richtigen Platz'],
      palette: [['Fliese creme', '#efebe2'], ['Boden beige', '#d5c7b0'], ['Tür Eiche rot', '#b0592e'], ['Vorhang petrol', '#2f7d90'], ['Handtuch grün', '#9fb43a']],
    },
  },
  {
    key: 'a', hash: 'skandi', label: 'Skandi Sage', sub: 'Refresh ohne Stemmen', build: buildA, sw: ['#8fa58e', '#d6b98f', '#efebe2'],
    info: {
      eyebrow: 'Variante A · Refresh ohne Stemmen', title: 'Skandi Sage',
      pitch: 'Alles, was nervt, ist in zwei Wochenenden weg, ohne eine Fliese abzuschlagen. Glas statt Vorhang, Stauraum über dem WC und im Hochschrank, ein hängender Waschtisch, unter dem die Waage parkt. Salbeigrün und helle Eiche machen die weißen Fliesen plötzlich gewollt.',
      tenant: { ok: true, text: 'Mietwohnung: komplett rückbaubar' }, effort: '2 Wochenenden · DIY', storage: 380,
      costs: [['Glas-Faltwand für die Wanne, 110 cm', 189], ['Hänge-Waschtisch 60 cm mit Mineralguss-Becken', 349], ['LED-Spiegelschrank 60 cm mit Steckdose', 229], ['WC-Überbauregal Eiche/Schwarz', 119], ['Hochschrank 30 cm mit Wäschekippe', 149], ['Klick-Vinyl Fischgrät, 5 m² inkl. Leisten', 230], ['Handbrause, Stange & Duschablagen schwarz', 85], ['Handtücher, Läufer, Hakenleiste', 140], ['LED-Nachtlicht mit Bewegungsmelder, Deckenleuchte', 75], ['Efeutute, Bogenhanf, Ampel', 45]],
      palette: [['Salbei', '#8fa58e'], ['Eiche hell', '#d6b98f'], ['Mattschwarz', '#1e1f21'], ['Fliese creme', '#efebe2'], ['Leinen', '#e9e2d4']],
    },
  },
  {
    key: 'b', hash: 'japandi', label: 'Japandi Spa', sub: 'Walk-in statt Wanne', build: buildB, sw: ['#cdc1b0', '#c79d68', '#2b2621'],
    info: {
      eyebrow: 'Variante B · Walk-in statt Wanne', title: 'Japandi Spa',
      pitch: 'Die Wanne fliegt raus, dafür gibt es eine bodengleiche Walk-in-Dusche mit Regenbrause. Fugenloser Mikrozement, Eiche, Kalkputz: ruhig wie ein japanisches Gästehaus. Ein deckenhoher Einbauschrank schluckt Wäsche, Vorrat, Handtücher und die Bart-Station.',
      tenant: { ok: false, text: 'Nur als Eigentum oder mit Vermieter-OK' }, effort: '3–4 Wochen · Fachbetrieb', storage: 590,
      costs: [['Demontage & Entsorgung', 1200], ['Sanitär: Vorwand, Wand-WC, bodengleiche Dusche', 4800], ['Abdichtung + Mikrozement Boden & Dusche', 4200], ['Elektro: Spots, Steckdosen, LED', 1300], ['Glaswand 8 mm, Profile schwarz', 750], ['Einbauschrank Eiche gerillt (Schreiner)', 1900], ['Waschtisch Eiche, Aufsatzbecken, Wandarmatur', 1100], ['LED-Rundspiegel Ø 66', 260], ['Handtuchheizkörper schwarz', 290], ['Kalkputz Wände & Decke', 450], ['Leuchten', 380], ['Hocker, Textilien, Deko', 300]],
      palette: [['Mikrozement', '#bcae9b'], ['Kalkputz', '#ebe4d8'], ['Eiche', '#c79d68'], ['Mattschwarz', '#1e1f21'], ['Leinen', '#e9e2d4']],
    },
  },
  {
    key: 'c', hash: 'hotel', label: 'Grand Hotel', sub: 'Grün, Messing, Terrazzo', build: buildC, sw: ['#245746', '#c8a052', '#ebe5d9'],
    info: {
      eyebrow: 'Variante C · Fliese auf Fliese', title: 'Grand Hotel',
      pitch: 'Kein Abriss: flaschengrüne Zellige-Fliesen, Terrazzo-Boden und gebürstetes Messing kommen direkt auf den alten Belag. Die Wanne bleibt, bekommt aber eine feste Glaswand und eine beleuchtete Nische. Fühlt sich an wie ein kleines Boutique-Hotel.',
      tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 2 Wochen · Fliesenleger + Sanitär', storage: 440,
      costs: [['Fliese auf Fliese: Zellige-Look Wand + Terrazzo Boden inkl. Verlegung', 4300], ['Wannenschürze neu verfliest + beleuchtete Nische', 380], ['Feste Glaswand Wanne, Messingprofil', 520], ['Thermostat-Brauseset + WT-Armatur, Messing gebürstet', 980], ['Waschtisch Nussbaum gerillt + Marmor-Optik-Platte', 1150], ['Bogenspiegel + Messing-Leuchte', 400], ['Apothekerschrank grün lackiert', 330], ['Handtuchheizkörper Messing', 340], ['WC-Keramik spülrandlos, Nussbaum-Sitz, Drückerplatte', 420], ['Maler: Kalkputz-Optik oben + Decke', 520], ['Tür innen foliert, Drücker Messing', 140], ['Elektro: Leuchtenanschlüsse', 450], ['Farn, Kelim-Läufer, Handtücher', 260]],
      palette: [['Flaschengrün', '#245746'], ['Messing', '#c8a052'], ['Terrazzo', '#ebe5d9'], ['Nussbaum', '#5d3a24'], ['Champignon', '#d7c9b6']],
    },
  },
];
VARIANTS.forEach(v => { if (v.info.costs) v.info.budget = v.info.costs.reduce((a, c) => a + c[1], 0); });
