/* =====================================================================
   VARIANTEN G–P  (kreative Stile) + Register
   ===================================================================== */
function trimLine(B, id, a0, a1, v, m, ops = []) {
  let pieces = [{ a0, a1, v0: v - 0.004, v1: v + 0.006 }];
  ops.forEach(op => { pieces = pieces.flatMap(p => subtractRect(p, op)); });
  const f = wallFrame(id, B.D);
  pieces.forEach(p => { const a = f.p(p.a0, p.v0, 0), b = f.p(p.a1, p.v1, 0.007); B.walls[id].add(slab(Math.min(a.x, b.x), p.v0, Math.min(a.z, b.z), Math.max(a.x, b.x), p.v1, Math.max(a.z, b.z), m)); });
}
function trimAll(B, v, m) { const { W, L } = B.D; trimLine(B, 'left', 0, L, v, m); trimLine(B, 'front', 0, W, v, m, [{ a0: B.door.a0 - 0.07, a1: B.door.a1 + 0.07, v0: 0, v1: 2.2 }]); trimLine(B, 'back', 0, W - B.lay.tray - 0.05, v, m, [B.win]); trimLine(B, 'right', B.lay.tray + 0.05, L, v, m); }
function signTex(key, lines, bg, fg) { return cached('sign' + key, () => { const cv = mkCanvas(512, 256), c = cv.getContext('2d'); c.fillStyle = bg; c.fillRect(0, 0, 512, 256); c.strokeStyle = fg; c.lineWidth = 8; c.strokeRect(14, 14, 484, 228); c.fillStyle = fg; c.textAlign = 'center'; lines.forEach(([t, s, y]) => { c.font = `700 ${s}px Georgia, serif`; c.fillText(t, 256, y); }); grain(c, 512, 256, 0.15); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; }); }
function wallSign(B, tex, w, h, wall, along, v) { const p = mesh(new THREE.PlaneGeometry(w, h), std({ map: tex, roughness: 0.3, metalness: 0.1, envMapIntensity: 0.6 })); p.position.z = 0.006; const g = new THREE.Group(); g.add(p, at(box(w, h, 0.004, M.paint('#222')), 0, 0, 0.002)); return B.add(B.mount(g, wall, along, v), { name: 'Schild' }); }
function bonsai() { const t = oliveTree(55); t.scale.setScalar(0.32); const g = new THREE.Group(); g.add(t); g.add(at(cyl(0.11, 0.09, 0.05, M.ceramicMatte('#3b3734'), 28), 0, 0.025, 0)); return g; }

/* ------------------------------------------------------------------ */
function buildG(B) { // Onsen
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const slate = slabTileSet('gFloor', { base: '#3c3b38', light: '#4f4d49', dark: '#2a2927', contrast: 0.12, rough: 0.7, world: 2.4, tw: 0.4, th: 0.4, grout: 'rgba(15,15,15,0.6)' });
  const tad = M.cloud('gTad', { base: '#47423d', light: '#5b5550', dark: '#2f2b27', contrast: 0.1, rough: 0.4, world: 1.6, env: 0.7 });
  const clay = M.cloud('gClay', { base: '#d6c6b0', light: '#e8dccb', dark: '#b8a58b', contrast: 0.08, rough: 0.92, strokes: 160, world: 2.4, env: 0.25, bumpScale: 0.5 });
  const hin = M.wood('hinoki', { base: '#e2c49a', dark: '#b9935f', light: '#f0dcb8', seed: 41, rough: 0.6 }), black = M.black();
  shellKit(B, { walls: wallSpec(B, { base: clay, wet: tad, wetLen: tray + 0.7, wetW: tray + 0.05 }), floor: mat('gFloor', () => std({ map: slate.map, bumpMap: slate.bump, bumpScale: 0.8, roughnessMap: slate.rough, roughness: 1, envMapIntensity: 0.4 })), ceiling: M.plaster('#e6dccd'), reveal: M.plaster('#d6c6b0'), niches: [{ wall: 'right', a0: tray + 0.12, a1: tray + 0.5, v0: 1.1, v1: 1.35, depth: 0.09, mat: tad }], door: { leafMat: M.wood('door', WOOD.door), innerMat: hin, handleMat: black }, light: 0xffdfb8 });
  B.add(ofuro(B, { s: tray }), { name: 'Ofuro aus Hinoki-Holz (ersetzt die Duschtasse)' });
  B.add(at(duckboard(0.72, 0.62, hin), W - 0.4, 0, tray + 0.34), { name: 'Waschplatz mit Holzrost & Bodenablauf' }); B.foot(W - 0.78, tray, W, tray + 0.66, 'Waschplatz');
  const st = stool(); st.scale.setScalar(0.7); st.position.set(W - 0.42, 0.03, tray + 0.36); B.add(st, { name: 'Waschhocker' });
  const sh = new THREE.Group(); sh.add(rod([0, 0.85, 0.035], [0, 1.65, 0.035], 0.01, black)); sh.add(at(cyl(0.05, 0.05, 0.02, black, 24), 0, 1.68, 0.06)); const hh = cyl(0.016, 0.02, 0.22, black); hh.position.set(0, 1.25, 0.07); sh.add(hh); const tp = cyl(0.025, 0.025, 0.08, black); tp.rotation.z = PI / 2; tp.position.set(0.12, 0.85, 0.05); sh.add(tp);
  B.add(B.mount(sh, 'right', tray + 0.32, 0), { name: 'Sitzdusche am Waschplatz' });
  const bkt = lathe([[0, 0], [0.09, 0], [0.11, 0.12], [0.1, 0.12], [0.085, 0.01], [0, 0.01]], hin, 24); bkt.position.set(W - 0.2, 0.03, tray + 0.55); B.add(bkt, { name: 'Holzschale' });
  nicheItems(B, tray + 0.16, 1.1, [{ r: 0.026, h: 0.15, c: '#2f2b27', cap: '#c9b48a', pump: true }, { r: 0.026, h: 0.15, c: '#e2d6c2', cap: '#2f2b27', pump: true }]);
  kWcKeep(B, { cover: 'vormauer', boxMat: tad, ledgeMat: hin, plateM: black, seat: hin, brushM: black, tpM: black, name: 'WC mit Hinoki-Sitz · Klick: Deckel' });
  const bn = bonsai(); bn.position.set(0.12, 1.19, 0.12); B.add(bn, { name: 'Bonsai' });
  kVanity(B, { type: 'console', body: hin, w: 0.56, d: 0.44, basin: 'round', basinM: M.ceramicMatte('#3b3734'), faucet: 'wall', metal: black, baskets: [M.fabric('indigo', '#2b3a5c')], name: 'Hinoki-Konsole mit Steinschale' });
  kMirror(B, { type: 'round', r: 0.26, frame: hin, ring: 0.02, name: 'Runder Spiegel mit Holzrahmen' });
  kRadiator(B, { m: black, valveM: black, pipeM: black, towels: [M.fabric('indigo', '#2b3a5c', '#e2d6c2'), M.fabric('nat', '#e2d6c2', '#2b3a5c')] });
  const noren = new THREE.Group(); const nt = cached('noren', () => { const cv = mkCanvas(512, 512), c = cv.getContext('2d'); c.fillStyle = '#26365a'; c.fillRect(0, 0, 512, 512); c.fillStyle = '#efe6d6'; c.beginPath(); c.arc(256, 230, 110, 0, PI * 2); c.fill(); c.fillStyle = '#26365a'; c.beginPath(); c.arc(300, 200, 100, 0, PI * 2); c.fill(); c.fillStyle = '#1b2742'; c.fillRect(250, 0, 12, 512); grain(c, 512, 512, 0.2); const t = toTex(cv); t.repeat.set(1, 1); return t; });
  noren.add(clothHang({ w: 0.7, h: 0.55, pinch: 0.95, m: mat('noren', () => std({ map: nt, roughness: 0.9, side: THREE.DoubleSide })), seed: 3, wave: 0.01 })); noren.add(rod([-0.38, 0, 0.012], [0.38, 0, 0.012], 0.008, hin));
  B.add(B.mount(noren, 'front', (B.door.a0 + B.door.a1) / 2, 2.1, 0.02), { wall: 'front', name: 'Noren-Vorhang an der Tür' });
  kLamp(B, paperLantern(0.2), 'Papierlaterne', L / 2 + 0.15); kFan(B);
  B.hot(1, [W - tray / 2, 0.9, tray / 2], 'Ofuro statt Duschtasse', 'Die quadratische Ecke ist perfekt für eine japanische Holzwanne: 78 × 78, 60 cm tief, Hinoki duftet beim Baden.');
  B.hot(2, [W - 0.4, 0.5, tray + 0.36], 'Waschplatz wie im Onsen', 'Erst sitzend abduschen, dann einweichen. Holzrost, Hocker und Bodenablauf daneben.');
  B.hot(3, B.anc.wc, 'Vormauerung mit Hinoki-Ablage', 'Spülkasten verschwindet, oben steht ein Bonsai.');
  B.hot(4, B.anc.vanity, 'Steinschale auf Hinoki', 'Dunkle Steinschale, Wandarmatur, Indigo-Korb für die Bartpflege.');
  B.hot(5, [(B.door.a0 + B.door.a1) / 2, 1.9, L - 0.05], 'Noren an der Tür', 'Japanischer Stoffvorhang: Sichtschutz, wenn die Tür offen steht.');
  B.hot(6, [0.9, 2.0, L / 2 + 0.15], 'Papierlaterne & Tadelakt', 'Dunkler Kalkputz im Nassbereich, warmes Licht durch Washi-Papier.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildH(B) { // Bart-Lounge
  const { W, L, H } = B.D, { tray, rz, vz } = B.lay;
  const chk = checkerSet('hFloor', { t: 0.25, a: '#f1efe9', b: '#1d1d1f', vary: 0.02 });
  const metro = M.tile('hMetro', { tw: 0.15, th: 0.075, cols: 8, rows: 16, layout: 'brick', base: '#f4f2ec', vary: 0.015, grout: '#d7d2c8', gw: 0.003, rt: 0.06, bevel: 0.012, bumpScale: 2.4, env: 1 });
  const ox = M.paint('#6b1e22'), black = M.lacquer('#151516'), ch = M.chrome();
  shellKit(B, { walls: wallSpec(B, { base: ox, wain: { mat: metro, h: 1.25 }, wet: metro, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: tm('hFloor', chk, { rough: 0.15, env: 0.9 }), ceiling: M.plaster('#f2efe8'), door: { leafMat: M.wood('door', WOOD.door), innerMat: black, handleMat: ch }, light: 0xffe4c4 });
  trimAll(B, 1.25, M.black());
  kTray(B, { apron: metro, metal: ch, profile: M.black(), glass: 'frame', rows: 3, fixtures: 'round', glassName: 'Eck-Glas mit schwarzen Sprossen' });
  kWcKeep(B, { cover: 'box', boxMat: black, seat: black, brushM: ch, tpM: ch, name: 'WC mit schwarzem Sitz · Klick: Deckel' });
  wallSign(B, signTex('barb', [['BARBIER', 92, 120], ['SEIT HEUTE MORGEN', 30, 190]], '#f2ead8', '#6b1e22'), 0.42, 0.21, 'back', Math.min(0.28, B.win.a0 / 2), 1.62);
  kVanity(B, { type: 'retro', body: black, front: black, handle: ch, w: 0.6, faucet: 'tall', metal: ch, legs: ch, drawers: 2, name: 'Barbier-Waschtisch, Lack schwarz, Chrombeine' });
  kMirror(B, { type: 'bulbs', w: 0.5, h: 0.66, frame: black, v: 1.6, name: 'Barbier-Spiegel mit Glühbirnen' });
  const bulbsL = new THREE.PointLight(0xffe9c8, 0, 1.6, 2); bulbsL.position.set(0.3, 1.6, vz); bulbsL.userData.on = 0.9; bulbsL.userData.day = 0.35; B.led(new THREE.Group(), bulbsL);
  kRadiator(B, { m: ch, valveM: ch, pipeM: ch, towels: [M.fabric('bw', '#f4f2ec', '#151516'), M.fabric('bw2', '#151516', '#f4f2ec')] });
  const bar = new THREE.Group(); bar.add(slab(-0.3, 0, 0, 0.3, 0.03, 0.16, M.wood('walnut', WOOD.walnut))); for (const x of [-0.24, 0.24]) bar.add(slab(x - 0.005, -0.08, 0, x + 0.005, 0, 0.13, ch));
  bar.add(at(beardStation(M.paint('#2a2a2a')), -0.1, 0.03, 0.08)); bar.add(at(bottlesRow([{ r: 0.022, h: 0.11, c: '#8a4b16', cap: '#1a1a1a' }, { r: 0.025, h: 0.13, c: '#151516', cap: '#c9a052' }, { r: 0.03, h: 0.08, c: '#c9a052', cap: '#151516' }], 0.06), 0.12, 0.03, 0.08));
  B.add(B.mount(bar, 'left', rz, 1.5), { name: 'Bart-Bar: Öl, Balm, Kamm, Trimmer' }); B.anc.bar = [0.08, 1.58, rz];
  const pole = new THREE.Group(); const pt = cached('pole', () => { const cv = mkCanvas(128, 512), c = cv.getContext('2d'); c.fillStyle = '#f4f2ec'; c.fillRect(0, 0, 128, 512); c.save(); c.rotate(-0.5); for (let y = -200; y < 700; y += 90) { c.fillStyle = '#b3242b'; c.fillRect(-100, y, 400, 30); c.fillStyle = '#21407a'; c.fillRect(-100, y + 45, 400, 18); } c.restore(); const t = toTex(cv); t.repeat.set(1, 1); return t; });
  pole.add(at(cyl(0.045, 0.045, 0.42, std({ map: pt, roughness: 0.2, envMapIntensity: 0.8 }), 28), 0, 0, 0.07)); pole.add(at(sph(0.05, ch, 16), 0, 0.23, 0.07), at(sph(0.05, ch, 16), 0, -0.23, 0.07), rod([0, 0.2, 0], [0, 0.2, 0.07], 0.008, ch), rod([0, -0.2, 0], [0, -0.2, 0.07], 0.008, ch));
  B.add(B.mount(pole, 'left', vz - 0.42, 1.75), { name: 'Barbierstange' });
  kTall(B, { carcass: black, front: black, glass: true, name: 'Vitrine für Pflegeprodukte', fill: (c) => { c.add(at(bottlesRow([{ r: 0.025, h: 0.12, c: '#8a4b16', cap: '#151516' }, { r: 0.025, h: 0.15, c: '#f4f2ec', cap: '#151516' }, { r: 0.03, h: 0.1, c: '#c9a052', cap: '#151516' }], 0.08), -0.08, 1.31, 0.13)); c.add(at(towelStack(4, 0.24, 0.2, [M.fabric('bw', '#f4f2ec', '#151516'), M.fabric('bw2', '#151516', '#f4f2ec')]), 0, 0.96, 0.13)); } });
  kRug(B, 'barb', { base: '#1d1d1f', border: 'rgba(200,160,82,0.6)' });
  kLamp(B, globeLight(0.12, 0.15, ch), 'Opalglas-Kugel'); kFan(B);
  B.hot(1, B.anc.mirror, 'Barbier-Spiegel mit Glühbirnen', 'Licht von drei Seiten, ohne Schatten: perfekt, um die Bartkontur sauber zu trimmen.');
  B.hot(2, B.anc.bar, 'Bart-Bar', 'Eigenes Nussbaum-Bord nur für Bartöl, Balm, Kamm und Trimmer. Alles in Griffhöhe.');
  B.hot(3, [0.9, 0.03, L - 0.5], 'Schachbrett-Boden', 'Schwarz-weißes Feinsteinzeug, klassisch wie im alten Barbershop.');
  B.hot(4, [0.02, 1.9, vz - 0.42], 'Ochsenblut & Metro', 'Weiße Metro-Fliesen bis 1,25 m mit schwarzer Kante, darüber tiefes Rot.');
  B.hot(5, B.anc.tall, 'Vitrine statt Regal', 'Glastür-Schrank in der Türecke für Pflegeprodukte und gerollte Handtücher.');
  B.hot(6, B.anc.shower, 'Eck-Glas mit Sprossen', 'Duschtasse bleibt, dazu Glas im Werkstatt-Raster und eine runde Kopfbrause.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildI(B) { // Urban Jungle
  const { W, L, H } = B.D, { tray } = B.lay;
  const lp = leafPaperSet('iPaper', { base: '#1e3a2b', leaves: ['#2f6b47', '#3e8a57', '#5aa36a', '#24543a', '#7fb97a'] });
  const paper = mat('iPaper', () => std({ map: lp.map, roughness: 0.85, envMapIntensity: 0.25 }));
  const green = M.tile('iGreen', { tw: 0.075, th: 0.3, cols: 12, rows: 3, base: '#2f5a43', colors: ['#2f5a43', '#355f48', '#2a523d', '#3a664d'], vary: 0.05, grout: '#d9d4c4', gw: 0.002, rt: 0.06, bevel: 0.006, bumpScale: 1.8, env: 1.0 });
  const hb = herringboneSet('iFloor', { w: 0.09, l: 0.54, base: '#6b4a32', alt: '#5e412c', dark: '#3a2618', gap: '#2e1f14' });
  const teak = M.wood('teak', WOOD.teak), black = M.black();
  shellKit(B, { walls: wallSpec(B, { base: paper, wain: { mat: green, h: 1.2 }, wet: green, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: mat('iFloor', () => std({ map: hb.map, bumpMap: hb.bump, bumpScale: 1.2, roughness: 0.45, envMapIntensity: 0.6 })), ceiling: M.plaster('#eef0e8'), reveal: M.plaster('#e8eadf'), door: { leafMat: M.wood('door', WOOD.door), innerMat: M.paint('#24433a'), handleMat: black }, light: 0xfff0d8 });
  trimAll(B, 1.2, teak);
  kTray(B, { apron: green, metal: black, profile: black, fixtures: 'rail', glassName: 'Eck-Glas, Profil schwarz' });
  kWcKeep(B, { cover: 'box', boxMat: teak, slats: M.wood('teakD', { ...WOOD.teak, base: '#7d5530', seed: 33 }), seat: teak, brushM: black, tpM: black });
  const sp = snakePlant({ n: 8, h: 0.4 }), spp = pot({ r: 0.07, h: 0.12, m: M.ceramicMatte('#efebe3') }); spp.position.set(B.lay.wcX - 0.1, 1.36, 0.12); sp.position.set(B.lay.wcX - 0.1, 1.47, 0.12); B.add(spp, sp);
  kVanity(B, { type: 'console', body: teak, w: 0.58, d: 0.45, basin: 'round', faucet: 'deck', metal: black, baskets: [WICKER(), WICKER()], name: 'Teak-Konsole mit Rattan-Körben' });
  kMirror(B, { type: 'round', r: 0.26, frame: black, name: 'Runder Spiegel' });
  kRadiator(B, { m: black, valveM: black, pipeM: black, towels: [M.fabric('moss', '#6f8f5e', '#efe6d6'), M.fabric('ecru', '#efe6d6', '#2f5a43')] });
  const rail = plantRail(B, 0.25, W - 0.25, 1.25, 2.12); B.add(rail, { ceil: true, name: 'Pflanzenstange unter der Decke' });
  [[0.38, trailing({ n: 9, minL: 0.3, maxL: 0.8, seed: 31 })], [0.72, fern({ n: 16, len: 0.3, seed: 8 })], [1.06, trailing({ n: 8, minL: 0.25, maxL: 0.7, seed: 12, leaf: 'oval', size: 0.04 })]].forEach(([x, pl]) => { const hp = hangingPlant({ len: 0.06, potR: 0.07, potM: M.ceramicMatte('#efebe3'), ropeM: black, plant: pl }); hp.position.set(Math.min(x, W - 0.3), 2.12, 1.25); B.add(hp, { name: 'Hängepflanze' }); });
  const ms = monstera(); ms.position.set(W - 0.2, 0, L - 0.22); B.add(ms, { name: 'Monstera' }); B.foot(W - 0.34, L - 0.36, W - 0.06, L - 0.08);
  kHang(B, trailing({ n: 8, minL: 0.2, maxL: 0.6, seed: 4 }), { potM: M.ceramicMatte('#efebe3'), name: 'Efeutute am Fenster' });
  kRug(B, 'jute', { base: '#c9b48a', border: 'rgba(80,60,30,0.3)' });
  kLamp(B, globeLight(0.11, 0.12, black), 'Opalglas-Kugel', 1.95); kFan(B);
  B.hot(1, [0.75, 1.95, 1.25], 'Pflanzenstange unter der Decke', 'Drei Hängepflanzen über dem Laufweg: die feuchte Badluft lieben sie.');
  B.hot(2, [0.02, 1.8, 1.0], 'Botanik-Tapete', 'Feuchtraumgeeignete Vliestapete oberhalb der Fliesen, darunter tiefgrüne Stäbchenfliesen.');
  B.hot(3, [W - 0.2, 0.8, L - 0.22], 'Monstera an der Tür', 'Große Blätter, die mit dem Fensterlicht klarkommen.');
  B.hot(4, B.anc.wc, 'Teak-Kasten mit Bogenhanf', 'Spülkasten-Verkleidung als Pflanzenbank.');
  B.hot(5, B.anc.vanity, 'Teak & Rattan', 'Konsole mit Körben, dazu Fischgrät-Boden in dunkler Eiche.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildJ(B) { // Art Deco Noir
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const sc = scaleSet('jScale', { r: 0.075, colors: ['#151517', '#1c1c1f', '#121214'], grout: '#2b2b2b', gw: 0.003, gold: 'rgba(200,160,82,0.55)' });
  const scale = tm('jScale', sc, { rough: 0.08, env: 1.2, bumpScale: 2 });
  const blackT = M.tile('jBlack', { tw: 0.3, th: 0.6, cols: 4, rows: 2, base: '#18181a', vary: 0.02, grout: '#0f0f10', gw: 0.002, rt: 0.06, bevel: 0.004, env: 1.1 });
  const chk = checkerSet('jFloor', { t: 0.3, a: '#efece6', b: '#18181a', marble: true, vary: 0.01 });
  const brass = M.brass(), marble = mat('marbleTop', () => phys({ map: marbleTex('top'), roughness: 0.12, clearcoat: 0.6, envMapIntensity: 0.8 }));
  shellKit(B, { walls: wallSpec(B, { base: M.paint('#efe8dc'), wain: { mat: blackT, h: 1.2 }, wet: scale, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: tm('jFloor', chk, { rough: 0.1, env: 1.0 }), ceiling: M.plaster('#efe8dc'), door: { leafMat: M.wood('door', WOOD.door), innerMat: M.lacquer('#151516'), handleMat: brass }, light: 0xffe2b8 });
  trimAll(B, 1.2, brass);
  kTray(B, { apron: blackT, metal: brass, profile: brass, glass: 'frame', rows: 2, fixtures: 'round', glassName: 'Eck-Glas mit Messingrahmen' });
  kWcKeep(B, { cover: 'vormauer', boxMat: blackT, ledgeMat: marble, plateM: brass, seat: M.lacquer('#151516'), brushM: brass, tpM: brass, name: 'WC mit schwarzem Sitz · Klick: Deckel' });
  kVanity(B, { type: 'console', body: marble, consoleTop: marble, legs: brass, steel: true, shelf: marble, w: 0.6, d: 0.46, basin: 'under', topM: marble, faucet: 'tall', metal: brass, name: 'Marmor-Konsole mit Messingbeinen' });
  kMirror(B, { type: 'fan', frame: brass, name: 'Art-Deco-Fächerspiegel' });
  for (const s of [-1, 1]) { const g = globeLight(0.06, 0.04, brass); g.rotation.x = 0; const w = new THREE.Group(); w.add(rod([0, 0, 0], [0, 0, 0.1], 0.008, brass)); g.position.set(0, 0.1, 0.1); w.add(g); B.add(B.mount(w, 'left', vz + s * 0.38, 1.62), { name: 'Messing-Wandleuchte' }); const pl = new THREE.PointLight(0xffe2b8, 0, 1.3, 2); pl.position.set(0.15, 1.6, vz + s * 0.38); pl.userData.on = 0.6; pl.userData.day = 0.2; B.led(w, pl); }
  kRadiator(B, { m: brass, valveM: brass, pipeM: brass, towels: [M.fabric('emer', '#1f5a46', '#c8a052'), M.fabric('ivory', '#efe8dc', '#151516')] });
  kTall(B, { carcass: M.lacquer('#151516'), front: M.lacquer('#151516'), glass: true, name: 'Lackschrank mit Glastür', handle: (fw, fh, f) => { const k = knob(brass, 0.01); k.position.set(-fw / 2 + 0.04, 0, 0); return k; }, fill: (c) => c.add(at(towelStack(4, 0.24, 0.2, [M.fabric('emer', '#1f5a46', '#c8a052'), M.fabric('ivory', '#efe8dc', '#151516')]), 0, 0.97, 0.13)) });
  kHang(B, fern({ n: 18, len: 0.32 }), { potM: brass, ropeM: brass, r: 0.07, name: 'Farn in Messingampel' });
  kLamp(B, globeLight(0.13, 0.08, brass), 'Opalglas-Deckenleuchte'); kFan(B);
  B.hot(1, B.anc.shower, 'Fächerfliesen schwarz-gold', 'Glänzende Schuppenfliesen mit Goldkante im Nassbereich, Messingrahmen am Glas.');
  B.hot(2, B.anc.mirror, 'Fächerspiegel', 'Art-Deco-Bogen mit Messingstrahlen, flankiert von zwei Kugelleuchten.');
  B.hot(3, B.anc.vanity, 'Marmor auf Messing', 'Konsole mit Marmor-Optik und Unterbaubecken, offenes Bord darunter.');
  B.hot(4, [0.9, 0.03, L - 0.5], 'Marmor-Schachbrett', 'Schwarz-weiß im Diagonal-Look, 30er-Platten in Marmoroptik.');
  B.hot(5, B.anc.wc, 'Vormauerung schwarz', 'Spülkasten verschwindet hinter schwarzen Platten, Marmor-Ablage oben.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildK(B) { // Pastell Pop
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const pink = M.tile('kPink', { tw: 0.1, th: 0.1, cols: 10, rows: 10, base: '#f2b8c6', colors: ['#f2b8c6', '#f4c0cc', '#eeb0bf'], vary: 0.03, grout: '#fbeff1', gw: 0.003, rt: 0.06, bevel: 0.008, bumpScale: 1.8, env: 1.0 });
  const chk = checkerSet('kFloor', { t: 0.2, a: '#f3c6cf', b: '#fbf3ea', vary: 0.01, grout: 'rgba(200,170,170,0.4)' });
  const mint = M.lacquer('#9fd8c2'), brass = M.brass();
  shellKit(B, { walls: wallSpec(B, { base: M.paint('#c9ead9'), wain: { mat: pink, h: 1.2 }, wet: pink, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: tm('kFloor', chk, { rough: 0.2, env: 0.8 }), ceiling: M.plaster('#fbf3ea'), door: { leafMat: M.wood('door', WOOD.door), innerMat: M.lacquer('#f2b8c6'), handleMat: brass }, light: 0xfff0e6 });
  trimAll(B, 1.2, brass);
  kTray(B, { apron: pink, metal: brass, profile: brass, fixtures: 'round', glassName: 'Eck-Glas mit Goldprofil' });
  kWcKeep(B, { cover: 'box', boxMat: mint, seat: M.lacquer('#f2b8c6'), brushM: M.lacquer('#f2b8c6'), tpM: brass, name: 'WC mit rosa Sitz · Klick: Deckel' });
  const ns = neonSign('hey du', '#ff5fa8', 0.5); B.add(B.mount(ns, 'back', Math.min(0.26, B.win.a0 / 2), 1.72), { name: 'Neonschrift' }); const nl = new THREE.PointLight(0xff5fa8, 0, 1.4, 2); nl.position.set(0.26, 1.7, 0.2); nl.userData.on = 0.5; nl.userData.day = 0.2; B.led(ns, nl);
  kVanity(B, { body: mint, front: mint, knobs: brass, w: 0.6, faucet: 'deck', metal: brass, basinM: M.ceramic('#fbf3ea'), name: 'Mint-Waschtisch mit Messingknöpfen' });
  kMirror(B, { type: 'wavy', frame: M.lacquer('#f2b8c6'), name: 'Wellenspiegel' });
  kRadiator(B, { m: M.paint('#f2b8c6'), towels: [M.fabric('mintT', '#9fd8c2', '#fbf3ea'), M.fabric('peach', '#f6c9a8', '#fbf3ea')] });
  kTall(B, { carcass: M.lacquer('#fbf3ea'), front: mint, name: 'Mint-Hochschrank', handle: (fw, fh, f) => { const k = knob(brass, 0.014); k.position.set(f.door ? -fw / 2 + 0.05 : 0, f.door ? 0 : fh / 2 - 0.06, 0); return k; } });
  const sp = snakePlant({ n: 7, h: 0.32 }), spp = pot({ r: 0.065, h: 0.11, m: M.ceramicMatte('#f2b8c6') }); spp.position.set(0.02, 0, 0); sp.position.set(0.02, 0.1, 0); const sg = new THREE.Group(); sg.add(spp, sp); sg.position.set(W - 0.18, 0, L - 0.2); B.add(sg, { name: 'Bogenhanf im rosa Topf' });
  kRug(B, 'pop', { base: '#f6c9a8', border: 'rgba(255,255,255,0.6)' });
  kLamp(B, globeLight(0.12, 0.1, brass), 'Kugelleuchte'); kFan(B);
  B.hot(1, [0.02, 1.0, vz - 0.5], 'Rosa unten, Mint oben', 'Glänzende 10er-Fliesen in Rosa bis 1,20 m, darüber Mint, Goldkante dazwischen.');
  B.hot(2, B.anc.mirror, 'Wellenspiegel', 'Weicher, verspielter Rahmen in Lack-Rosa.');
  B.hot(3, [0.26, 1.72, 0.03], 'Neonschrift „hey du“', 'Begrüßt dich morgens. LED-Neon, verbraucht kaum Strom.');
  B.hot(4, [0.9, 0.03, L - 0.5], 'Schachbrett in Pastell', 'Rosa und Creme, 20er-Fliesen auf die alten verlegt.');
  B.hot(5, B.anc.vanity, 'Mint-Waschtisch', 'Hängend, mit Messingknöpfen und weißem Becken.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildL(B) { // Almhütte
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const bd = boardSet('lBoards', { bw: 0.12, wood: { base: '#d6b383', dark: '#a37a4a', light: '#e8cda2', seed: 61, figure: true } });
  const boards = mat('lBoards', () => std({ map: bd.map, bumpMap: bd.bump, bumpScale: 1.6, roughness: 0.6, envMapIntensity: 0.4 }));
  const slate = slabTileSet('lSlate', { base: '#3f3e3b', light: '#55534f', dark: '#2b2a28', contrast: 0.12, rough: 0.6, world: 2.4, tw: 0.3, th: 0.6, grout: 'rgba(20,20,20,0.6)' });
  const sl = mat('lSlate', () => std({ map: slate.map, bumpMap: slate.bump, bumpScale: 0.8, roughnessMap: slate.rough, roughness: 1, envMapIntensity: 0.5 }));
  const oak = M.wood('oakRustic', { base: '#8a6237', dark: '#5a3b1d', light: '#a87d4c', seed: 72, figure: true, contrast: 0.22, rough: 0.7 }), black = M.black();
  shellKit(B, { walls: wallSpec(B, { base: boards, wet: sl, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: sl, ceiling: boards, reveal: M.plaster('#e2d2b8'), door: { leafMat: M.wood('door', WOOD.door), innerMat: boards, handleMat: black }, light: 0xffd8a8 });
  kTray(B, { apron: sl, metal: black, profile: black, glass: 'frame', rows: 0, fixtures: 'pipe', glassName: 'Eck-Glas, Rahmen schwarz' });
  kWcKeep(B, { cover: 'box', boxMat: oak, seat: oak, brushM: black, tpM: black });
  const ant = new THREE.Group(); for (const s of [-1, 1]) ant.add(tube([[0, 0, 0], [s * 0.05, 0.06, 0.06], [s * 0.12, 0.1, 0.08], [s * 0.16, 0.16, 0.07]], 0.012, M.paint('#e8dcc4'), 16), tube([[s * 0.05, 0.06, 0.06], [s * 0.04, 0.16, 0.08]], 0.009, M.paint('#e8dcc4'), 10));
  ant.add(at(rbox(0.08, 0.1, 0.03, 0.02, oak), 0, 0, 0.015)); B.add(B.mount(ant, 'back', Math.min(0.28, B.win.a0 / 2), 1.7), { name: 'Geweih-Haken (Holz)' });
  kVanity(B, { type: 'console', body: oak, w: 0.58, d: 0.46, basin: 'round', basinM: M.ceramicMatte('#5b5955'), faucet: 'deck', metal: black, baskets: [M.fabric('felt', '#7a6e62')], name: 'Rustikale Eichen-Konsole mit Steinschale' });
  kMirror(B, { type: 'rect', w: 0.44, h: 0.62, frame: oak, ft: 0.05, cr: 0.01, name: 'Spiegel mit Eichenrahmen' });
  kRadiator(B, { m: black, valveM: black, pipeM: black, towels: [M.fabric('check', '#b8322e', '#f2ead8'), M.fabric('cream', '#f2ead8', '#b8322e')] });
  kTall(B, { carcass: oak, front: oak, name: 'Holzschrank', handle: (fw, fh, f) => { const g = new THREE.Group(); g.add(rod([0, -0.06, 0.02], [0, 0.06, 0.02], 0.007, black)); g.position.x = f.door ? -fw / 2 + 0.05 : 0; return g; } });
  B.add(at(bathMat(0.55, 0.75, '#f1ece2', 'sheep'), 0.9, 0.012, tray + 0.55), { name: 'Schaffell-Vorleger' });
  for (const s of [-1, 1]) { const sc = cageSconce(); B.add(B.mount(sc, 'left', vz + s * 0.34, 1.62), { name: 'Laternen-Wandleuchte' }); const pl = new THREE.PointLight(0xffc380, 0, 1.4, 2); pl.position.set(0.18, 1.6, vz + s * 0.34); pl.userData.on = 0.6; pl.userData.day = 0.2; B.led(sc, pl); }
  kLamp(B, edisonPendant(0.4), 'Glühfaden-Pendel', L / 2); kFan(B);
  B.hot(1, [0.02, 1.6, 1.4], 'Fichtenholz-Paneele', 'Nut-und-Feder-Holz an Wänden und Decke, im Nassbereich dunkler Schiefer.');
  B.hot(2, B.anc.shower, 'Schiefer & Rohrdusche', 'Duschtasse bleibt mit Schieferschürze, schwarze Aufputz-Brause, Glas mit Rahmen.');
  B.hot(3, B.anc.vanity, 'Eiche rustikal + Steinschale', 'Massive Konsole, Filzkorb, dunkle Steinschale.');
  B.hot(4, [0.9, 0.1, tray + 0.55], 'Schaffell-Vorleger', 'Weich und warm. Einmal im Monat auslüften, waschbar bei 30 °C.');
  B.hot(5, B.anc.mirror, 'Laternen am Spiegel', 'Zwei Käfigleuchten mit Glühfaden: Hüttenlicht, auch beim Bartpflegen gut.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildM(B) { // Maritim
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const bb = boardSet('mBead', { bw: 0.1, base: '#f4f2ec', bead: true }), bead = mat('mBead', () => std({ map: bb.map, bumpMap: bb.bump, bumpScale: 1.4, roughness: 0.35, envMapIntensity: 0.6 }));
  const blue = M.tile('mBlue', { tw: 0.1, th: 0.1, cols: 10, rows: 10, colors: ['#2d5f8a', '#f2f2ee', '#5a8fb8', '#f2f2ee', '#1f4a73'], vary: 0.03, grout: '#e8ebee', gw: 0.003, rt: 0.06, bevel: 0.008, bumpScale: 1.6, env: 1.0 });
  const hb = herringboneSet('mFloor', { w: 0.09, l: 0.54, base: '#d9d4c8', alt: '#cfc8b8', dark: '#a39b8a', gap: '#8d8577' });
  const navy = M.paint('#1f3a5f'), brass = M.brass();
  shellKit(B, { walls: wallSpec(B, { base: navy, wain: { mat: bead, h: 1.15 }, wet: blue, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: mat('mFloor', () => std({ map: hb.map, bumpMap: hb.bump, bumpScale: 1.2, roughness: 0.5, envMapIntensity: 0.6 })), ceiling: M.plaster('#f4f2ec'), door: { leafMat: M.wood('door', WOOD.door), innerMat: M.lacquer('#f4f2ec'), handleMat: brass }, light: 0xfff4e6 });
  trimAll(B, 1.15, M.paint('#f4f2ec'));
  kTray(B, { apron: blue, metal: brass, profile: brass, fixtures: 'round', glassName: 'Eck-Glas mit Messingprofil' });
  kWcKeep(B, { cover: 'box', boxMat: bead, seat: M.wood('teak', WOOD.teak), brushM: brass, tpM: brass });
  kVanity(B, { body: M.lacquer('#1f3a5f'), front: M.lacquer('#1f3a5f'), knobs: brass, w: 0.6, faucet: 'deck', metal: brass, name: 'Waschtisch Marineblau mit Messingknöpfen' });
  kMirror(B, { type: 'porthole', r: 0.24, frame: brass, name: 'Bullaugen-Spiegel' });
  kRadiator(B, { towels: [M.fabric('navyS', '#f4f2ec', '#1f3a5f'), M.fabric('navyS2', '#1f3a5f', '#f4f2ec')] });
  const rope = new THREE.Group(); const pts = []; for (let i = 0; i <= 24; i++) { const a = (i / 24) * PI * 2; pts.push([Math.cos(a) * 0.13, -0.15 + Math.sin(a) * 0.13, 0.03]); } rope.add(tube(pts, 0.012, M.paint('#c9a774'), 60, true)); rope.add(rod([0, 0, 0], [0, -0.02, 0.03], 0.012, M.paint('#c9a774'))); rope.add(at(clothHang({ w: 0.22, h: 0.42, pinch: 0.4, m: M.fabric('navyS', '#f4f2ec', '#1f3a5f'), seed: 5 }), 0, -0.02, 0.05));
  B.add(B.mount(rope, 'front', 0.2, 1.66), { name: 'Tau-Handtuchring' });
  const lamp = new THREE.Group(); lamp.add(at(cyl(0.05, 0.05, 0.02, brass, 20), 0, 0, 0)); const glb = sph(0.08, M.lamp('#fff2dd', 2.8, 1.0), 20); glb.position.y = -0.11; glb.castShadow = false; lamp.add(glb); for (let i = 0; i < 4; i++) { const a = (i / 4) * PI * 2; lamp.add(rod([Math.cos(a) * 0.05, 0, Math.sin(a) * 0.05], [Math.cos(a) * 0.085, -0.11, Math.sin(a) * 0.085], 0.004, brass, 6)); } lamp.add(mesh(new THREE.TorusGeometry(0.085, 0.006, 6, 24), brass).rotateX(PI / 2).translateZ(0.11));
  kLamp(B, lamp, 'Schiffslampe Messing');
  kTall(B, { carcass: M.lacquer('#f4f2ec'), front: bead, name: 'Schrank mit Nut-und-Feder-Front', handle: (fw, fh, f) => { const k = knob(brass, 0.012); k.position.x = f.door ? -fw / 2 + 0.05 : 0; return k; } });
  kRug(B, 'stripe', { base: '#f4f2ec', border: '#1f3a5f' });
  B.add(at(duckboard(0.5, 0.36, M.wood('teak', WOOD.teak)), W - 0.4, 0, tray + 0.24), { name: 'Teak-Rost' }); kFan(B);
  B.hot(1, B.anc.mirror, 'Bullaugen-Spiegel', 'Messingring mit Nieten, wie auf einem alten Dampfer.');
  B.hot(2, [0.02, 0.7, 1.4], 'Nut-und-Feder bis 1,15 m', 'Weißes Holzpaneel unten, Marineblau oben, im Nassbereich Fliesen in drei Blautönen.');
  B.hot(3, [0.2, 1.5, L - 0.05], 'Tau-Handtuchring', 'Ein Seilring statt Saughaken für das Gästehandtuch.');
  B.hot(4, [W / 2, 2.2, L / 2], 'Schiffslampe', 'Opalglas in Messingkäfig an der Decke.');
  B.hot(5, [W - 0.4, 0.05, tray + 0.24], 'Teak-Rost vor der Dusche', 'Statt Plüschvorleger: trocknet sofort, fühlt sich nach Bootsdeck an.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildN(B) { // Neon Nights
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const bt = M.tile('nBlack', { tw: 0.3, th: 0.6, cols: 4, rows: 2, base: '#141416', vary: 0.02, grout: '#0b0b0c', gw: 0.002, rt: 0.05, bevel: 0.004, env: 1.2 });
  const bf = M.tile('nFloor', { tw: 0.6, th: 0.6, cols: 2, rows: 2, base: '#1a1a1d', vary: 0.02, grout: '#0b0b0c', gw: 0.002, rt: 0.12, bevel: 0.004, env: 1.0 });
  const black = M.black(), lack = M.lacquer('#121214');
  shellKit(B, { walls: full(bt), floor: bf, ceiling: M.paint('#1a1a1d'), reveal: M.plaster('#2a2a2e'), door: { leafMat: M.wood('door', WOOD.door), innerMat: lack, handleMat: black }, light: 0xe8e4ff });
  kTray(B, { apron: bt, metal: black, profile: black, glass: 'frame', rows: 0, fixtures: 'rail', inner: M.ceramic('#2a2a2c'), rim: M.ceramic('#2a2a2c'), glassName: 'Eck-Glas, Rahmen schwarz' });
  kWcKeep(B, { cover: 'vormauer', boxMat: bt, ledgeMat: lack, plateM: black, cer: M.ceramic('#2a2a2c'), seat: lack, brushM: black, tpM: black, name: 'WC anthrazit · Klick: Deckel' });
  const ns = neonSign('STAY FRESH', '#ff3df2', 0.55); B.add(B.mount(ns, 'back', Math.min(0.29, B.win.a0 / 2), 1.62), { name: 'Neonschrift' }); const nl = new THREE.PointLight(0xff3df2, 0, 1.6, 2); nl.position.set(0.3, 1.6, 0.25); nl.userData.on = 0.9; nl.userData.day = 0.35; B.led(ns, nl);
  const strip = slab(0.02, 1.15, 0.222, B.win.a0 - 0.04, 1.157, 0.23, M.lamp('#ff3df2', 3, 1.0), { cast: false }); B.add(strip);
  kVanity(B, { body: lack, front: lack, w: 0.6, led: '#3ef0ff', faucet: 'deck', metal: black, basinM: M.ceramicMatte('#2a2a2c'), name: 'Waschtisch schwarz mit Cyan-Unterlicht' });
  const mr = framedMirror(B, 0.48, 0.66, 0.05, M.lamp('#3ef0ff', 3.2, 1.2), 0.012); B.add(B.mount(mr, 'left', vz, 1.55), { name: 'Spiegel mit Neon-Rahmen' }); B.anc.mirror = [0.08, 1.7, vz];
  const ml = new THREE.PointLight(0x3ef0ff, 0, 1.5, 2); ml.position.set(0.25, 1.55, vz); ml.userData.on = 0.8; ml.userData.day = 0.3; B.led(mr, ml);
  kRadiator(B, { m: black, valveM: black, pipeM: black, towels: [M.fabric('char', '#2e2f33', '#ff3df2'), M.fabric('char2', '#2e2f33', '#3ef0ff')] });
  kTall(B, { carcass: lack, front: lack, glass: true, name: 'Vitrine mit LED', fill: (c, { w }) => { c.add(slab(-w / 2 + 0.03, 1.6, 0.27, w / 2 - 0.03, 1.606, 0.28, M.lamp('#3ef0ff', 3, 1.2), { cast: false })); c.add(at(bottlesRow([{ r: 0.025, h: 0.14, c: '#151516', cap: '#3ef0ff' }, { r: 0.025, h: 0.14, c: '#151516', cap: '#ff3df2' }], 0.09), -0.04, 1.31, 0.13)); } });
  const cols = ['#ff3df2', '#3ef0ff']; WALLS.forEach((id, i) => { const f = wallFrame(id, B.D), a = f.p(0.05, H - 0.07, 0.01), b = f.p(f.len - 0.05, H - 0.064, 0.03); B.add(slab(Math.min(a.x, b.x), a.y, Math.min(a.z, b.z), Math.max(a.x, b.x), b.y, Math.max(a.z, b.z), M.lamp(cols[i % 2], 3, 1.4), { cast: false }), { wall: id }); });
  const c1 = new THREE.PointLight(0xff3df2, 0, 2.5, 2); c1.position.set(W * 0.3, H - 0.3, L * 0.3); c1.userData.on = 0.7; c1.userData.day = 0.25; B.led(new THREE.Group(), c1);
  const c2 = new THREE.PointLight(0x3ef0ff, 0, 2.5, 2); c2.position.set(W * 0.7, H - 0.3, L * 0.7); c2.userData.on = 0.7; c2.userData.day = 0.25; B.led(new THREE.Group(), c2);
  B.add(B.mount((() => { const g = new THREE.Group(); g.add(at(cyl(0.05, 0.05, 0.16, M.paint('#1d1d20'), 24), 0, 0.08, 0)); g.add(at(mesh(new THREE.TorusGeometry(0.05, 0.004, 6, 30), M.lamp('#3ef0ff', 3, 1.5)).rotateX(PI / 2), 0, 0.16, 0)); return g; })(), 'back', Math.min(0.12, B.win.a0 / 2 - 0.1), 1.19, 0.12), { name: 'Smart-Speaker' });
  for (const z of [0.9, 1.8]) B.add(at(spot(M.paint('#1a1a1d')), W / 2, H, z), { ceil: true, name: 'Einbauspot' }); kFan(B);
  B.hot(1, [0.29, 1.62, 0.03], 'Neonschrift „STAY FRESH“', 'Pink über dem WC, dazu ein LED-Streifen unter der Ablage.');
  B.hot(2, B.anc.mirror, 'Spiegel mit Neon-Rahmen', 'Cyanfarbener Leuchtrahmen, darunter schwebt der schwarze Waschtisch mit Unterlicht.');
  B.hot(3, [0.05, H - 0.1, 1.2], 'RGB-Lichtband an der Decke', 'Pink und Cyan im Wechsel. Am besten mit dem Abend-Schalter ausprobieren.');
  B.hot(4, [0.9, 0.03, L - 0.5], 'Schwarz glänzend', 'Großformatige schwarze Fliesen überall: der Raum verschwindet, das Licht bleibt.');
  B.hot(5, B.anc.tall, 'Vitrine mit LED', 'Pflegeprodukte als Ausstellungsstücke.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildO(B) { // Retro 70s
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const pn = pennySet('oPenny', { d: 0.025, colors: ['#c8642c', '#8a4a24', '#e09a3c', '#6b3b1e', '#d47a35'], grout: '#efe0c2' }), penny = tm('oPenny', pn, { rough: 0.15, env: 1.0, bumpScale: 1.8 });
  const brown = M.tile('oBrown', { tw: 0.15, th: 0.15, cols: 6, rows: 6, base: '#7a4a2a', colors: ['#7a4a2a', '#83512e', '#6f4426'], vary: 0.04, grout: '#d9c7a4', gw: 0.003, rt: 0.08, bevel: 0.01, bumpScale: 1.8, env: 1.0 });
  const chk = checkerSet('oFloor', { t: 0.2, a: '#b5652e', b: '#efe0c2', vary: 0.03 });
  const walnut = M.wood('walnut', WOOD.walnut), ch = M.chrome();
  shellKit(B, { walls: wallSpec(B, { base: M.paint('#d9a63a'), wain: { mat: brown, h: 1.2 }, wet: penny, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: tm('oFloor', chk, { rough: 0.3, env: 0.8 }), ceiling: M.plaster('#f2e6cc'), door: { leafMat: M.wood('door', WOOD.door), innerMat: M.lacquer('#c8642c'), handleMat: ch }, light: 0xffdcae });
  trimAll(B, 1.2, ch);
  kTray(B, { apron: brown, metal: ch, glass: 'curtain', curtainMap: stripeTex('70s', '#e07b2c', '#f2d08a', 14, true), fixtures: 'round', curtainName: 'Retro-Vorhang an Eckstange (waschbar) · Klick' });
  kWcKeep(B, { cover: 'box', boxMat: walnut, seat: walnut, brushM: ch, tpM: ch });
  kVanity(B, { type: 'retro', body: walnut, front: walnut, handle: ch, legs: ch, w: 0.6, faucet: 'deck', metal: ch, basinM: M.ceramic('#a3b061'), drawers: 2, name: 'Nussbaum-Waschtisch mit Avocado-Becken' });
  kMirror(B, { type: 'round', r: 0.27, frame: M.lacquer('#c8642c'), ring: 0.035, name: 'Runder Spiegel, Rahmen Orange' });
  for (const s of [-1, 1]) { const g = globeLight(0.07, 0.05, ch); const w = new THREE.Group(); w.add(rod([0, 0, 0], [0, 0, 0.1], 0.008, ch)); g.position.set(0, 0.1, 0.1); w.add(g); B.add(B.mount(w, 'left', vz + s * 0.38, 1.62), { name: 'Kugel-Wandleuchte' }); }
  kRadiator(B, { m: M.paint('#7a4a2a'), towels: [M.fabric('orangeT', '#e07b2c', '#f2d08a'), M.fabric('mustT', '#d9a63a', '#7a4a2a')] });
  B.add(at(bathMat(0.55, 0.7, '#d0702e', 'shag'), 0.92, 0.012, tray + 0.5), { name: 'Hochflor-Teppich in Orange (der darf hier)' });
  kHang(B, trailing({ n: 9, minL: 0.3, maxL: 0.7, seed: 44 }), { potM: M.ceramicMatte('#efe0c2'), ropeM: M.paint('#efe0c2'), name: 'Makramee-Ampel' });
  kTall(B, { carcass: walnut, front: walnut, name: 'Nussbaum-Hochschrank', handle: (fw, fh, f) => { const h = handleBar(ch, 0.1, true); h.position.x = f.door ? -fw / 2 + 0.05 : 0; return f.door ? h : null; } });
  kLamp(B, globeLight(0.14, 0.12, ch), 'Opalglas-Kugel'); kFan(B);
  B.hot(1, B.anc.shower, 'Penny-Mosaik', 'Runde Mini-Fliesen in Orange und Braun im Nassbereich: Seventies pur.');
  B.hot(2, B.anc.vanity, 'Avocado-Becken', 'Die Farbe, die jedes Bad 1974 hatte, auf Nussbaum mit Chrombeinen.');
  B.hot(3, [W - 0.4, 1.5, tray], 'Gestreifter Vorhang', 'Hier darf der Vorhang bleiben: waschbar, beschwerter Saum, Eckstange.');
  B.hot(4, [0.92, 0.1, tray + 0.5], 'Shag-Teppich', 'Ironie inklusive: der einzige Plüsch, der sich lohnt.');
  B.hot(5, [0.02, 1.8, 1.4], 'Senfgelb über Braun', 'Braune 15er-Fliesen bis 1,20 m, darüber Senfgelb, Chromkante dazwischen.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildP(B) { // Mini-Makeover 300 €
  buildBestand(B, true);
  const { W, L } = B.D, { tray, vz, rz } = B.lay;
  B.hot(1, [W - tray + 0.02, 1.45, tray - 0.02], 'Waffelpiqué-Vorhang', 'Schimmelresistenter Stoff mit beschwertem Saum an schwarzer Eckstange: klebt nicht mehr.');
  B.hot(2, [W - 0.2, 1.5, 0.03], 'Eine Ablage statt zwei', 'Klebe-Regal in der Dusche, ovales Regal und Gitterkorb fliegen raus.');
  B.hot(3, [0.12, 2.25, vz], 'LED-Leuchte auf dem Spiegel', 'Klemmleuchte mit Steckdosenkabel: Licht von vorn, kein Schatten im Gesicht.');
  B.hot(4, [0.42, 0.72, vz + 0.02], 'Kabelbox', 'Föhn und Trimmer verschwinden in einer Box statt im Korb.');
  B.hot(5, [0.92, 0.05, tray + 0.48], 'Ein Läufer statt drei Plüschteile', 'Schnelltrocknend, waschbar, rutschfest. WC-Vorleger und Deckelbezug fliegen raus.');
  B.hot(6, [0.06, 1.2, rz], 'Handtücher sortiert', 'Je ein Handtuch auf Heizkörper und Stange, in Salbei: trocknet schneller.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
const VARIANTS = [
  { key: 'bestand', hash: 'bestand', label: 'Bestand', sub: 'So ist es jetzt', build: (B) => { buildBestand(B); hotBestand(B); }, sw: ['#efebe2', '#d5c7b0', '#2f7d90'], tags: ['heute'],
    info: { eyebrow: 'Bestand · aus Video-Scan rekonstruiert', title: 'Das Bad heute', pitch: 'Rund 3,6 m², hell gefliest, Duschtasse 78 × 78 in der Ecke, dazu Fenster und Lüfter. Die Substanz passt. Das Problem ist die Organisation: vieles steht auf dem Boden oder hängt irgendwo dazwischen.', tenant: null, effort: '—', storage: 110,
      good: ['Fenster und Abluft: beste Voraussetzung gegen Schimmel', 'Fliesen sauber verlegt, hell und intakt', 'Duschtasse tief genug für ein Ofuro oder Fußbad'], palette: [['Fliese creme', '#efebe2'], ['Boden beige', '#d5c7b0'], ['Tür Eiche rot', '#b0592e'], ['Vorhang petrol', '#2f7d90'], ['Handtuch grün', '#9fb43a']] } },
  { key: 'p', hash: 'mini', label: 'Mini-Makeover', sub: 'Für 300 €, ab Samstag', build: buildP, sw: ['#9fae9c', '#efebe2', '#1e1f21'], tags: ['miete', 'budget'],
    info: { eyebrow: 'Variante · Sofort-Hilfe', title: 'Mini-Makeover', pitch: 'Alles bleibt, nur die Nervfaktoren fliegen raus: neuer Vorhang an einer Eckstange, eine Ablage statt zwei, eine LED-Leuchte auf dem Spiegelaufsatz, eine Kabelbox, ein Läufer statt drei Plüschteilen. Ein Einkauf, ein Nachmittag.', tenant: { ok: true, text: 'Mietwohnung: komplett rückbaubar' }, effort: '1 Nachmittag · DIY', storage: 125,
      costs: [['Waffelpiqué-Vorhang + Eckstange schwarz', 79], ['Klebe-Duschablage schwarz', 29], ['LED-Klemmleuchte für den Spiegel', 39], ['Kabelbox', 19], ['Schnelltrocknender Badläufer', 35], ['2 Handtücher Salbei, Holz-WC-Sitz', 69], ['Treteimer, Efeutute', 35]],
      palette: [['Salbei', '#9fae9c'], ['Creme', '#efebe2'], ['Schwarz', '#1e1f21'], ['Eiche', '#d9bf95'], ['Leinen', '#ece6da']] } },
  { key: 'a', hash: 'skandi', label: 'Skandi Sage', sub: 'Refresh ohne Stemmen', build: buildA, sw: ['#8fa58e', '#d6b98f', '#efebe2'], tags: ['miete', 'budget'],
    info: { eyebrow: 'Variante · Refresh ohne Stemmen', title: 'Skandi Sage', pitch: 'In zwei Wochenenden ist alles weg, was nervt, ohne eine Fliese abzuschlagen: Eck-Glas statt Vorhang, Regal über dem Spülkasten, Hochschrank neben der Dusche, hängender Waschtisch mit LED-Spiegelschrank. Salbei und helle Eiche machen die weißen Fliesen plötzlich gewollt.', tenant: { ok: true, text: 'Mietwohnung: komplett rückbaubar' }, effort: '2 Wochenenden · DIY', storage: 360,
      costs: [['Eck-Glasabtrennung mit Pendeltür (geklemmt)', 289], ['Hänge-Waschtisch 60 cm mit Becken', 349], ['LED-Spiegelschrank 60 cm mit Steckdose', 229], ['WC-Überbauregal Eiche/Schwarz', 119], ['Hochschrank 32 cm mit Wäschekippe', 149], ['Klick-Vinyl Fischgrät inkl. Leisten', 190], ['Brausestange & Handbrause schwarz', 85], ['Handtücher, Läufer, Haken', 120], ['LED-Nachtlicht, Deckenleuchte', 75], ['Pflanzen + Ampel', 45]],
      palette: [['Salbei', '#8fa58e'], ['Eiche hell', '#d6b98f'], ['Mattschwarz', '#1e1f21'], ['Fliese creme', '#efebe2'], ['Leinen', '#e9e2d4']] } },
  { key: 'k', hash: 'pastell', label: 'Pastell Pop', sub: 'Rosa, Mint, Neon', build: buildK, sw: ['#f2b8c6', '#9fd8c2', '#fbf3ea'], tags: ['mutig'],
    info: { eyebrow: 'Variante · Verspielt', title: 'Pastell Pop', pitch: 'Gute Laune ab der ersten Minute: rosa Glanzfliesen bis Schulterhöhe, Mint darüber, Schachbrett in Pastell am Boden, ein Wellenspiegel und eine Neonschrift, die dich morgens begrüßt.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 1,5 Wochen · Fliesenleger', storage: 300,
      costs: [['Fliese auf Fliese: Rosa-Wand + Pastell-Schachbrett', 3200], ['Eck-Glas mit Goldprofil', 420], ['Mint-Waschtisch + Becken', 520], ['Wellenspiegel', 180], ['Neonschrift LED', 140], ['Hochschrank Mint', 260], ['Maler Mint + Goldkante', 380], ['Armaturen Messing', 480], ['Spülkasten-Verkleidung', 90], ['Deko, Teppich, Handtücher', 160]],
      palette: [['Rosa', '#f2b8c6'], ['Mint', '#9fd8c2'], ['Creme', '#fbf3ea'], ['Pfirsich', '#f6c9a8'], ['Gold', '#c8a052']] } },
  { key: 'i', hash: 'jungle', label: 'Urban Jungle', sub: 'Pflanzen bis zur Decke', build: buildI, sw: ['#2f5a43', '#7fb97a', '#6b4a32'], tags: ['budget'],
    info: { eyebrow: 'Variante · Grün', title: 'Urban Jungle', pitch: 'Das Bad wird ein Gewächshaus: Botanik-Tapete, tiefgrüne Stäbchenfliesen, eine Pflanzenstange unter der Decke mit drei Hängepflanzen, Monstera neben der Dusche und Teak überall. Feuchte Luft und Fensterlicht sind für Pflanzen ein Geschenk.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 1 Woche · Fliesenleger + DIY', storage: 260,
      costs: [['Stäbchenfliesen grün (Fliese auf Fliese)', 1900], ['Botanik-Vliestapete feuchtraumgeeignet', 320], ['Fischgrät-Vinyl dunkle Eiche', 220], ['Teak-Konsole + Becken + Armatur', 690], ['Eck-Glas, Profil schwarz', 290], ['Pflanzenstange + 5 Pflanzen + Töpfe', 260], ['Spülkasten-Verkleidung Teak', 90], ['Leuchte, Jute-Läufer, Handtücher', 180]],
      palette: [['Waldgrün', '#2f5a43'], ['Blattgrün', '#7fb97a'], ['Teak', '#9a6a3c'], ['Eiche dunkel', '#6b4a32'], ['Ecru', '#efe6d6']] } },
  { key: 'd', hash: 'terrakotta', label: 'Terrakotta', sub: 'Mediterran, Majolika', build: buildD, sw: ['#b8673f', '#22508c', '#efe5d3'], tags: [],
    info: { eyebrow: 'Variante · Mediterran', title: 'Terrakotta & Kalk', pitch: 'Urlaub zu Hause: Terrakotta-Sechsecke am Boden, handbemalte Majolika rund um die Duschtasse, sonst warmer Kalkputz. Der Spülkasten verschwindet hinter einem Teak-Kasten, Bronze-Armaturen mit Kreuzgriffen, Rattan-Spiegel und ein Olivenbaum.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 2 Wochen · Fliesenleger + DIY', storage: 220,
      costs: [['Fliese auf Fliese: Terrakotta-Hex + Majolika', 3600], ['Kalkputz Wände & Decke', 620], ['Eck-Glas, Profil schwarz', 320], ['Retro-Armaturen Bronze', 780], ['Teak-Konsole + Aufsatzbecken', 690], ['Rattan-Spiegel + Pendelleuchte', 240], ['Spülkasten-Verkleidung Teak (DIY)', 90], ['Beleuchtete Nische', 380], ['Olivenbaum, Fouta-Tücher, Körbe', 260]],
      palette: [['Terrakotta', '#b8673f'], ['Kobalt', '#22508c'], ['Kalk', '#efe5d3'], ['Teak', '#9a6a3c'], ['Bronze', '#8c5a32']] } },
  { key: 'm', hash: 'maritim', label: 'Maritim', sub: 'Bullauge & Marineblau', build: buildM, sw: ['#1f3a5f', '#f4f2ec', '#c8a052'], tags: [],
    info: { eyebrow: 'Variante · Küste', title: 'Maritim', pitch: 'Nordsee statt Fliesenbad: weißes Nut-und-Feder-Paneel, Marineblau darüber, blau-weiße Fliesen in der Dusche, ein Bullaugen-Spiegel aus Messing, Schiffslampe und ein Teak-Rost statt Plüschvorleger.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 1,5 Wochen · Schreiner + Fliesenleger', storage: 300,
      costs: [['Nut-und-Feder-Paneel bis 1,15 m', 680], ['Blau-weiße Fliesen Nassbereich', 1400], ['Vinyl Fischgrät hell', 210], ['Waschtisch Marineblau + Becken', 560], ['Bullaugen-Spiegel Messing', 190], ['Eck-Glas Messingprofil + Armaturen', 820], ['Schiffslampe, Tau-Ring, Teak-Rost', 230], ['Hochschrank Paneelfront', 290], ['Maler Marineblau', 280]],
      palette: [['Marineblau', '#1f3a5f'], ['Weiß', '#f4f2ec'], ['Messing', '#c8a052'], ['Himmelblau', '#5a8fb8'], ['Teak', '#9a6a3c']] } },
  { key: 'l', hash: 'huette', label: 'Almhütte', sub: 'Holz, Schiefer, Schaffell', build: buildL, sw: ['#d6b383', '#3f3e3b', '#b8322e'], tags: [],
    info: { eyebrow: 'Variante · Hütte', title: 'Almhütte', pitch: 'Wie nach dem Skitag: Fichtenholz an Wänden und Decke, dunkler Schiefer in der Dusche und am Boden, eine rustikale Eichenkonsole mit Steinschale, Laternen am Spiegel und ein Schaffell vor der Dusche.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 2 Wochen · Schreiner + Fliesenleger', storage: 280,
      costs: [['Holzpaneele Fichte, Wände & Decke (feuchtraumlackiert)', 1600], ['Schiefer Boden + Nassbereich', 2900], ['Eck-Glas Rahmen schwarz', 480], ['Aufputz-Brause schwarz', 420], ['Eichenkonsole + Steinschale', 760], ['Spiegel Eichenrahmen + 2 Laternen', 290], ['Holzschrank', 320], ['Schaffell, Handtücher, Pendel', 210]],
      palette: [['Fichte', '#d6b383'], ['Schiefer', '#3f3e3b'], ['Eiche rustikal', '#8a6237'], ['Karo-Rot', '#b8322e'], ['Wollweiß', '#f1ece2']] } },
  { key: 'h', hash: 'barbier', label: 'Bart-Lounge', sub: 'Barbershop zu Hause', build: buildH, sw: ['#6b1e22', '#f4f2ec', '#151516'], tags: ['mutig'],
    info: { eyebrow: 'Variante · Für den Bart', title: 'Bart-Lounge', pitch: 'Dein Bart verdient einen eigenen Laden: Schachbrett-Boden, weiße Metro-Fliesen mit Ochsenblut darüber, ein Barbier-Spiegel mit Glühbirnen für schattenfreies Trimmen, eine Bart-Bar aus Nussbaum und natürlich die Barbierstange.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 1,5 Wochen · Fliesenleger + Maler', storage: 320,
      costs: [['Metro-Fliesen bis 1,25 m + Nassbereich', 1700], ['Schachbrett-Feinsteinzeug Boden', 1100], ['Barbier-Spiegel mit Glühbirnen', 290], ['Waschtisch Lack schwarz mit Chrombeinen', 690], ['Bart-Bar Nussbaum + Barbierstange', 210], ['Eck-Glas mit Sprossen + Kopfbrause', 760], ['Vitrine', 340], ['Maler Ochsenblut + schwarze Kante', 380], ['Spülkasten-Verkleidung, Handtücher, Läufer', 240]],
      palette: [['Ochsenblut', '#6b1e22'], ['Metro-Weiß', '#f4f2ec'], ['Lackschwarz', '#151516'], ['Chrom', '#d9dde0'], ['Nussbaum', '#5d3a24']] } },
  { key: 'o', hash: 'retro', label: 'Retro 70s', sub: 'Penny-Mosaik, Avocado', build: buildO, sw: ['#c8642c', '#d9a63a', '#7a4a2a'], tags: ['mutig'],
    info: { eyebrow: 'Variante · Seventies', title: 'Retro 70s', pitch: 'Ein Bad wie aus dem Partykeller deiner Eltern, nur in gut: Penny-Mosaik in Orange und Braun, senfgelbe Wände, ein Avocado-Waschbecken auf Nussbaum, Kugelleuchten und ein gestreifter Vorhang, der hier ausnahmsweise bleiben darf.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 1,5 Wochen · Fliesenleger', storage: 280,
      costs: [['Penny-Mosaik Nassbereich', 1400], ['Braune 15er-Fliesen bis 1,20 m', 1100], ['Schachbrett-Boden Orange/Creme', 900], ['Nussbaum-Waschtisch + Avocado-Becken', 720], ['Spiegel + 3 Kugelleuchten', 320], ['Vorhang + Eckstange', 90], ['Hochschrank Nussbaum', 290], ['Maler Senfgelb, Shag-Teppich, Makramee', 260]],
      palette: [['Orange', '#c8642c'], ['Senfgelb', '#d9a63a'], ['Schokobraun', '#7a4a2a'], ['Avocado', '#a3b061'], ['Creme', '#efe0c2']] } },
  { key: 'c', hash: 'hotel', label: 'Grand Hotel', sub: 'Zellige, Messing, Terrazzo', build: buildC, sw: ['#245746', '#c8a052', '#ebe5d9'], tags: [],
    info: { eyebrow: 'Variante · Boutique-Hotel', title: 'Grand Hotel', pitch: 'Fliese auf Fliese statt Abriss: flaschengrüne Zellige bis 1,25 m und im Nassbereich raumhoch, Terrazzo-Boden, gebürstetes Messing. Der Spülkasten verschwindet hinter einer gefliesten Vormauerung, neben der Dusche steht ein Apothekerschrank.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 2 Wochen · Fliesenleger + Sanitär', storage: 420,
      costs: [['Fliese auf Fliese: Zellige + Terrazzo inkl. Verlegung', 3900], ['Beleuchtete Nische', 380], ['Eck-Glas mit Messingrahmen', 690], ['Brause-Set + Armaturen Messing', 980], ['Waschtisch Nussbaum + Marmor-Optik', 1150], ['Bogenspiegel + Messing-Leuchte', 400], ['Apothekerschrank', 330], ['Heizkörper Messing', 340], ['Vormauerung + Unterputz-Spülkasten + WC', 1450], ['Maler, Tür foliert, Elektro', 1100], ['Farn, Kelim, Handtücher', 260]],
      palette: [['Flaschengrün', '#245746'], ['Messing', '#c8a052'], ['Terrazzo', '#ebe5d9'], ['Nussbaum', '#5d3a24'], ['Champignon', '#d7c9b6']] } },
  { key: 'g', hash: 'onsen', label: 'Onsen', sub: 'Ofuro statt Duschtasse', build: buildG, sw: ['#e2c49a', '#47423d', '#26365a'], tags: ['mutig'],
    info: { eyebrow: 'Variante · Japanisches Bad', title: 'Onsen', pitch: 'Die quadratische Ecke schreit nach einer Ofuro: eine 60 cm tiefe Holzwanne aus Hinoki, daneben ein Waschplatz mit Hocker und Holzrost wie im japanischen Badehaus. Dunkler Tadelakt, Lehmputz, Papierlaterne und ein Noren-Vorhang an der Tür.', tenant: { ok: false, text: 'Nur als Eigentum oder mit Vermieter-OK' }, effort: 'ca. 3 Wochen · Schreiner + Sanitär', storage: 260,
      costs: [['Ofuro Hinoki 78 × 78 × 60 nach Maß', 3900], ['Sanitär: Wannenablauf, Bodenablauf Waschplatz, Sitzdusche', 2100], ['Tadelakt Nassbereich', 1800], ['Lehmputz Wände', 650], ['Schiefer-Boden', 1300], ['Vormauerung + Unterputz-Spülkasten', 1100], ['Hinoki-Konsole + Steinschale', 820], ['Holzrost, Hocker, Schale', 260], ['Papierlaterne, Noren, Bonsai', 220]],
      palette: [['Hinoki', '#e2c49a'], ['Tadelakt', '#47423d'], ['Indigo', '#26365a'], ['Lehm', '#d6c6b0'], ['Schiefer', '#3c3b38']] } },
  { key: 'n', hash: 'neon', label: 'Neon Nights', sub: 'Schwarz, Pink, Cyan', build: buildN, sw: ['#141416', '#ff3df2', '#3ef0ff'], tags: ['mutig'],
    info: { eyebrow: 'Variante · Nachtmodus', title: 'Neon Nights', pitch: 'Ein Bad wie eine Bar um Mitternacht: alles schwarz glänzend, Lichtband in Pink und Cyan an der Decke, Neonschrift über dem WC, ein Spiegel mit leuchtendem Rahmen und ein Waschtisch, der über blauem Licht schwebt. Unbedingt mit dem Abend-Schalter ansehen.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 2 Wochen · Fliesenleger + Elektriker', storage: 300,
      costs: [['Schwarze Großformate Wand + Boden', 3400], ['Vormauerung + WC anthrazit', 1350], ['Eck-Glas Rahmen schwarz', 480], ['Waschtisch schwarz + LED', 640], ['Neon-Spiegel + Neonschrift', 380], ['RGB-Lichtband + Steuerung', 520], ['Vitrine mit LED', 340], ['Elektro', 650], ['Smart-Speaker, Handtücher', 180]],
      palette: [['Schwarz', '#141416'], ['Pink', '#ff3df2'], ['Cyan', '#3ef0ff'], ['Anthrazit', '#2a2a2c'], ['Graphit', '#2e2f33']] } },
  { key: 'j', hash: 'artdeco', label: 'Art Deco Noir', sub: 'Schwarz, Gold, Marmor', build: buildJ, sw: ['#151517', '#c8a052', '#efece6'], tags: ['mutig'],
    info: { eyebrow: 'Variante · Zwanziger', title: 'Art Deco Noir', pitch: 'Gatsby im Mini-Format: schwarze Fächerfliesen mit Goldkante in der Dusche, Marmor-Schachbrett am Boden, eine Marmorkonsole auf Messingbeinen, ein Fächerspiegel und Kugelleuchten. Klein, aber mit Auftritt.', tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 2 Wochen · Fliesenleger + Sanitär', storage: 330,
      costs: [['Fächerfliesen schwarz-gold Nassbereich', 1900], ['Schwarze Platten bis 1,20 m', 1300], ['Marmor-Schachbrett Boden', 1400], ['Vormauerung + Unterputz-Spülkasten', 1100], ['Marmorkonsole Messing + Becken + Armatur', 1250], ['Fächerspiegel + 3 Kugelleuchten', 520], ['Eck-Glas Messingrahmen', 690], ['Heizkörper Messing', 340], ['Lackschrank, Messingleisten, Farn', 520]],
      palette: [['Lackschwarz', '#151517'], ['Gold', '#c8a052'], ['Marmor', '#efece6'], ['Smaragd', '#1f5a46'], ['Elfenbein', '#efe8dc']] } },
  { key: 'b', hash: 'japandi', label: 'Japandi Spa', sub: 'Walk-in statt Duschtasse', build: buildB, sw: ['#cdc1b0', '#c79d68', '#2b2621'], tags: ['walkin'],
    info: { eyebrow: 'Variante · Walk-in', title: 'Japandi Spa', pitch: 'Die Duschtasse fliegt raus, dafür gibt es eine bodengleiche Walk-in-Dusche mit Regenbrause. Fugenloser Mikrozement, Eiche, Kalkputz und Papierleuchte: ruhig wie ein japanisches Gästehaus. Stauraum hängt über dem WC statt auf dem Boden.', tenant: { ok: false, text: 'Nur als Eigentum oder mit Vermieter-OK' }, effort: '3–4 Wochen · Fachbetrieb', storage: 420,
      costs: [['Demontage & Entsorgung', 1100], ['Sanitär: Vorwand, Wand-WC, bodengleiche Dusche', 4600], ['Abdichtung + Mikrozement', 3700], ['Elektro: Spots, LED', 1100], ['Glaswand 8 mm', 650], ['Hängeschrank Eiche gerillt (Schreiner)', 980], ['Waschtisch Eiche + Aufsatzbecken + Wandarmatur', 1050], ['LED-Rundspiegel', 240], ['Heizkörper schwarz am Duschausgang', 290], ['Kalkputz, Lamellen', 760], ['Hocker, Papierleuchte, Textilien', 290]],
      palette: [['Mikrozement', '#bcae9b'], ['Kalkputz', '#ebe4d8'], ['Eiche', '#c79d68'], ['Mattschwarz', '#1e1f21'], ['Leinen', '#e9e2d4']] } },
  { key: 'e', hash: 'loft', label: 'Loft', sub: 'Beton, Stahl, Walk-in', build: buildE, sw: ['#62645f', '#1e1f21', '#f1f0eb'], tags: ['walkin'],
    info: { eyebrow: 'Variante · Industrial', title: 'Loft', pitch: 'Werkstatt-Charme auf kleinem Raum: dunkle Betonoptik am Boden, Metro-Fliesen mit schwarzer Fuge, eine Glaswand mit Stahlsprossen und eine Rohrdusche auf Putz. Edison-Licht und Eiche halten es warm.', tenant: { ok: false, text: 'Nur als Eigentum oder mit Vermieter-OK' }, effort: '3–4 Wochen · Fachbetrieb', storage: 280,
      costs: [['Demontage & Entsorgung', 1100], ['Sanitär inkl. Rohrdusche', 4800], ['Feinsteinzeug Betonoptik 60 × 120', 3400], ['Metro-Fliesen Waschtischwand', 560], ['Glaswand mit Stahlsprossen', 1250], ['Stahl-Konsole + Becken + Armatur', 920], ['Spiegel, Käfigleuchten, Pendel', 420], ['Regalbretter, Heizkörper schwarz', 420], ['Elektro, Maler Decke', 1300], ['Holzrost, Pflanzen', 160]],
      palette: [['Beton dunkel', '#62645f'], ['Beton hell', '#b3b1aa'], ['Stahl', '#1e1f21'], ['Metro-Weiß', '#f1f0eb'], ['Eiche', '#c79d68']] } },
  { key: 'f', hash: 'smart', label: 'Smart Spa', sub: 'Dusch-WC, Display, Licht', build: buildF, sw: ['#eeebe6', '#4a4d51', '#8ec5ff'], tags: ['walkin'],
    info: { eyebrow: 'Variante · Bad 2030', title: 'Smart Spa', pitch: 'Das Technik-Bad: Dusch-WC, LED-Deckenbrause mit digitalem Thermostat, Sensor-Armatur, Fußbodenheizung und ein Spiegelschrank mit Display für Uhrzeit, Wetter und Bart-Routine. Helles Feinsteinzeug, Graphit hinter dem WC, Lichtband an der Decke.', tenant: { ok: false, text: 'Nur als Eigentum oder mit Vermieter-OK' }, effort: '4 Wochen · Fachbetrieb + Elektriker', storage: 400,
      costs: [['Demontage & Entsorgung', 1100], ['Sanitär: Vorwand, bodengleiche Dusche', 4600], ['Dusch-WC mit Föhn & Fernbedienung', 1900], ['Feinsteinzeug 60 × 120 + Graphit', 3900], ['Thermostat + LED-Deckenbrause', 1450], ['Elektrische Fußbodenheizung', 850], ['Elektro: Lichtszenen, Lautsprecher', 1700], ['Glaswand rahmenlos', 750], ['Waschtisch + Sensor-Armatur', 1150], ['Spiegelschrank mit Display', 890], ['Hängeschrank grifflos + Glas-Heizkörper', 1180]],
      palette: [['Feinsteinzeug', '#eeebe6'], ['Graphit', '#4a4d51'], ['Hochglanz', '#f6f6f4'], ['Lichtblau', '#8ec5ff'], ['Chrom', '#d9dde0']] } },
];
VARIANTS.forEach(v => { if (v.info.costs) v.info.budget = v.info.costs.reduce((a, c) => a + c[1], 0); });
