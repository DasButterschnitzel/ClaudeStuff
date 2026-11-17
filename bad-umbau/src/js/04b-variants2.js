/* =====================================================================
   VARIANTEN D–F
   ===================================================================== */
function bestandRadPipes(B, rz, m = M.paint('#f2f2ee')) {
  B.add(rod([0.045, 0.11, rz + 0.3], [0.045, 0.11, 0.03], 0.011, m), rod([0.075, 0.18, rz - 0.3], [0.075, 0.18, 0.03], 0.011, m));
  B.add(rod([0.045, 0.11, rz + 0.3], [0.045, 0.22, rz + 0.3], 0.011, m), rod([0.075, 0.18, rz - 0.3], [0.075, 0.22, rz - 0.3], 0.011, m));
}
function linearDrain(B, z0, z1) { B.add(slab(B.D.W - 0.1, 0, z0, B.D.W - 0.04, 0.003, z1, M.steel(), { cast: false }), { name: 'Duschrinne' }); }
function framedMirror(B, w, h, r, frameM, t = 0.025) {
  const g = new THREE.Group();
  const s = rrectShape(w + 2 * t, h + 2 * t, r + t); s.holes.push(rrectShape(w, h, r));
  g.add(mesh(new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 16 }), frameM));
  const m = makeMirror(B, new THREE.ShapeGeometry(rrectShape(w + 0.004, h + 0.004, r), 16)); m.position.z = 0.012; g.add(m);
  return g;
}

/* ------------------------------------------------------------------ */
function buildD(B) { // Terrakotta & Kalk
  const { W, L, H } = B.D;
  const hx = hexSet('dFloor', { w: 0.2, colors: ['#b5603d', '#c06b45', '#a9573a', '#c97a52'], vary: 0.06, grout: '#d9ccb6', gw: 0.004 });
  const floor = mat('dFloor', () => std({ map: hx.map, bumpMap: hx.bump, bumpScale: 1.5, roughness: 0.78, envMapIntensity: 0.4 }));
  const mj = majolicaSet('dMaj', { t: 0.15, base: '#f2e8d5', grout: '#e1d6c2', gw: 0.002, ink: ['#22508c', '#d39a2c', '#2f6b55'] });
  const maj = mat('dMaj', () => std({ map: mj.map, bumpMap: mj.bump, bumpScale: 1.4, roughness: 0.2, envMapIntensity: 0.95 }));
  const lime = M.cloud('dLime', { base: '#efe5d3', light: '#fbf6ec', dark: '#d6c6ad', contrast: 0.08, rough: 0.92, strokes: 150, world: 2.4, env: 0.25, bumpScale: 0.5 });
  const tad = M.cloud('dTad', { base: '#e3cfb2', light: '#f2e4cf', dark: '#c2a582', contrast: 0.1, rough: 0.35, world: 1.6, env: 0.6 });
  const teak = M.wood('teak', WOOD.teak), doorWood = M.wood('door', WOOD.door);
  const bronze = mat('bronze', () => std({ color: 0x8c5a32, metalness: 1, roughness: 0.35, envMapIntensity: 1.1 }));
  const tw = W - 0.78, MH = 1.9;
  buildShell(B, {
    walls: (id, len, H) => {
      if (id === 'right') return [{ a0: 0, a1: 1.66, v0: 0, v1: MH, mat: maj }, { a0: 0, a1: 1.66, v0: MH, v1: H, mat: lime }, { a0: 1.66, a1: len, v0: 0, v1: H, mat: lime }];
      if (id === 'back') return [{ a0: 0, a1: tw, v0: 0, v1: H, mat: lime }, { a0: tw, a1: len, v0: 0, v1: MH, mat: maj }, { a0: tw, a1: len, v0: MH, v1: H, mat: lime }];
      return [{ a0: 0, a1: len, v0: 0, v1: H, mat: lime }];
    },
    floor, ceiling: M.plaster('#f3ece0'), reveal: M.plaster('#eee3d0'),
    niches: [{ wall: 'right', a0: 1.0, a1: 1.45, v0: 0.72, v1: 1.06, depth: 0.09, mat: maj }],
    door: { leafMat: doorWood, innerMat: M.paint('#6f8794'), handleMat: bronze },
    window: { sillMat: M.ceramicMatte('#efe3cf') },
  });
  addLights(B, { mainColor: 0xffe2bd });
  // Wanne mit Tadelakt-Schürze + Glasaufsatz mit Rundung
  const tub = bathtub({ apronMat: tad, worldApron: true }); tub.position.set(W - 0.375, 0, 0); B.add(tub, { name: 'Wanne mit Tadelakt-Schürze' }); B.foot(W - 0.75, 0, W, 1.6);
  const gx = W - 0.725, gw = 0.82, gh = 1.4, gr = 0.42;
  const gs = new THREE.Shape(); gs.moveTo(0, 0); gs.lineTo(gw, 0); gs.lineTo(gw, gh - gr); gs.absarc(gw - gr, gh - gr, gr, 0, PI / 2, false); gs.lineTo(0, gh); gs.lineTo(0, 0);
  const gpan = mesh(new THREE.ShapeGeometry(gs, 24), M.glass(), { cast: false }); gpan.rotation.y = -PI / 2; gpan.position.set(gx, 0.57, 0); B.add(gpan, { name: 'Wannenaufsatz mit Rundung' });
  const op = gs.getPoints(24).map(p => [gx, 0.57 + p.y, p.x]);
  B.add(tube(op, 0.006, M.black(), 80, false, 0));
  B.add(B.mount(pipeShower(bronze), 'right', 0.62, 0), { name: 'Retro-Brauseset Bronze mit Kreuzgriffen' });
  const ni = new THREE.Group(); ni.add(bottlesRow([{ r: 0.03, h: 0.17, c: '#6b7a3a', cap: '#8c5a32', pump: true }, { r: 0.026, h: 0.13, c: '#efe3cf', cap: '#8c5a32' }], 0.09));
  const sponge = sph(0.045, M.paint('#d6b56d'), 14); sponge.scale.set(1.2, 0.8, 1); sponge.position.set(0.24, 0.035, 0); ni.add(sponge);
  B.add(B.mount(ni, 'right', 1.08, 0.72, -0.05), { wall: 'right' });
  // WC: Spülkasten bekommt eine Teak-Verkleidung
  const wc = toilet({ seat: teak }); B.add(B.mount(wc, 'back', 0.45, 0, 0.06), { name: 'WC mit Teak-Sitz · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.foot(0.27, 0.06, 0.63, 0.64, 'WC');
  const bx = new THREE.Group(), x0 = 0.2, x1 = 0.7;
  bx.add(slab(x0, 0.9, 0.2, x1, 1.32, 0.22, teak), slab(x0, 0.9, 0, x0 + 0.02, 1.32, 0.2, teak), slab(x1 - 0.02, 0.9, 0, x1, 1.32, 0.2, teak), slab(x0 - 0.02, 1.32, 0, x1 + 0.02, 1.36, 0.25, teak));
  for (let i = 0; i < 8; i++) bx.add(slab(x0 + 0.03 + i * 0.058, 0.93, 0.22, x0 + 0.06 + i * 0.058, 1.29, 0.226, M.wood('teakD', { ...WOOD.teak, base: '#7d5530', seed: 33 })));
  const pl = trailing({ n: 6, minL: 0.12, maxL: 0.35, size: 0.04, seed: 14, out: 0.06 }); const pp = pot({ r: 0.06, h: 0.1, m: M.paint('#b8673f') }); pp.position.set(0.3, 1.36, 0.12); pl.position.set(0.3, 1.45, 0.12); bx.add(pp, pl);
  bx.add(at(candle(0.03, 0.08), 0.6, 1.36, 0.12));
  B.add(bx, { name: 'Spülkasten-Verkleidung aus Teak (DIY)' });
  B.add(at(brushHolder(M.paint('#b8673f')), 0.81, 0, 0.1), { name: 'WC-Bürste Terrakotta' });
  // Teak-Konsole, Aufsatzbecken, Rattan-Spiegel
  const vz = L - 0.36; B.vz = vz;
  const con = new THREE.Group(), cw = 0.64, cd = 0.48;
  con.add(slab(-cw / 2, 0.8, 0, cw / 2, 0.845, cd, teak));
  for (const x of [-cw / 2 + 0.03, cw / 2 - 0.03]) con.add(slab(x - 0.02, 0, cd - 0.06, x + 0.02, 0.8, cd - 0.02, teak));
  con.add(slab(-cw / 2, 0.2, 0.02, cw / 2, 0.225, cd - 0.02, teak));
  for (const x of [-0.15, 0.15]) con.add(at(rbox(0.26, 0.18, 0.34, 0.03, WICKER()), x, 0.315, 0.22));
  const ves = vessel({ w: 0.42, d: 0.42, h: 0.13, m: M.ceramicMatte('#f4ede2') }); ves.position.set(0, 0.845, 0.27); con.add(ves);
  const fw = faucetWall(bronze, { reach: 0.22 }); fw.position.set(0, 1.08, 0); con.add(fw);
  B.add(B.mount(con, 'left', vz, 0), { name: 'Teak-Konsole mit Aufsatzbecken & Rattan-Körben' });
  B.foot(0, vz - 0.32, 0.48, vz + 0.32, 'Konsole');
  B.add(B.mount(rattanMirror(B, 0.26), 'left', vz, 1.58), { name: 'Rattan-Spiegel' });
  // Heizkörper + Hakenleiste
  const rz = 1.58, rad = ladderRadiator({ w: 0.6, h: 1.2, groups: [5, 5, 5] });
  rad.add(at(towelOver({ w: 0.5, front: 0.42, back: 0.34, m: M.fabric('fouta', '#efe4d0', '#b8673f'), seed: 3 }), 0, 1.16, 0.055));
  B.add(B.mount(rad, 'left', rz, 0.24), { name: 'Heizkörper (bleibt)' });
  bestandRadPipes(B, rz);
  const peg = new THREE.Group(); peg.add(slab(-0.3, -0.035, 0, 0.3, 0.035, 0.02, teak));
  [-0.2, 0, 0.2].forEach(x => peg.add(rod([x, 0, 0.02], [x, 0.01, 0.08], 0.011, teak)));
  peg.add(at(clothHang({ w: 0.3, h: 0.6, m: M.fabric('fouta2', '#d9c7aa', '#2f4f6b'), seed: 4 }), -0.2, 0.0, 0.07));
  peg.add(at(clothHang({ w: 0.26, h: 0.5, m: M.fabric('fouta', '#efe4d0', '#b8673f'), seed: 9 }), 0.2, 0.0, 0.07));
  B.add(B.mount(peg, 'left', rz, 1.82), { name: 'Teak-Hakenleiste mit Fouta-Tüchern' });
  B.add(B.mount(tpHolder(bronze), 'left', 1.12, 0.8), { name: 'Klopapierhalter Bronze' });
  B.add(B.mount(exhaustFan(), 'left', 0.14, 2.12), { wall: 'left' });
  // Olivenbaum, Rattan, Läufer, Licht
  const ol = oliveTree(); ol.position.set(W - 0.2, 0, L - 0.22); B.add(ol, { name: 'Olivenbaum im Terrakottatopf' }); B.foot(W - 0.36, L - 0.38, W - 0.04, L - 0.06);
  const rb = new THREE.Group(); rb.add(lathe([[0, 0], [0.11, 0], [0.12, 0.32], [0, 0.32]], WICKER(), 28)); rb.position.set(W - 0.16, 0, L - 0.62); B.add(rb, { name: 'Rattan-Korb als Mülleimer' }); B.foot(W - 0.28, L - 0.74, W - 0.04, L - 0.5);
  B.add(at(rug(0.46, 1.3, 'berber', { base: '#ece3d2', kilim: ['#ece3d2', '#3b3530', '#c27a4f', '#3b3530'] }), 0.71, 0.006, 1.48), { name: 'Berber-Läufer' });
  const pd = rattanPendant(0.14, 0.26); pd.position.set(0.85, H - 0.26, 1.15); B.add(pd, { name: 'Rattan-Pendelleuchte' });

  B.hot(1, [gx, 1.55, 0.55], 'Wannenaufsatz mit Rundung', 'Statt Vorhang ein fest montiertes Glas mit weicher Rundung und dünnem schwarzem Rand. Schwenkbar, wenn du badest.');
  B.hot(2, [W - 0.02, 1.6, 1.3], 'Majolika-Fliesen im Nassbereich', 'Handbemaltes Muster in Kobalt, Ocker und Grün, nur hinter der Wanne. Der Rest bleibt ruhiger Kalkputz.');
  B.hot(3, [0.72, 0.03, 2.25], 'Terrakotta-Sechsecke', 'Warmer, lebendiger Boden. Versiegelt, damit er im Bad pflegeleicht bleibt. Verlegt als Fliese auf Fliese.');
  B.hot(4, [0.45, 1.36, 0.24], 'Teak-Kasten über dem Spülkasten', 'Der Aufputz-Spülkasten bleibt, verschwindet aber hinter Lamellen. Oben entsteht eine Ablage. Wochenend-Projekt für rund 90 €.');
  B.hot(5, [0.24, 0.95, vz], 'Teak-Konsole + Rattan-Spiegel', 'Offene Konsole statt Kommode: zwei Körbe für Föhn & Bartpflege, darüber ein runder Rattan-Spiegel.');
  B.hot(6, [0.06, 1.82, rz], 'Hakenleiste statt Stange', 'Jedes Fouta-Tuch bekommt einen eigenen Haken. Leichte Baumwolle trocknet schneller als Frottee.');
  B.hot(7, [W - 0.2, 1.2, L - 0.22], 'Olivenbaum', 'Mediterraner Hingucker. Ehrlich gesagt mag er das Milchglas-Licht nicht: im Sommer auf den Balkon, oder eine gute Kunst-Olive.');
  B.hot(8, [W - 0.02, 0.9, 1.22], 'Nische mit Majolika', 'Shampoo und Naturschwamm stehen in der Wand, abends mit warmem LED.');
  stdZones(B, { wcFront: 0.64 });
  B.zone('Waschtisch', 0.48, vz - 0.45, 1.23, Math.min(L, vz + 0.45));
}

/* ------------------------------------------------------------------ */
function walkInShell(B, o) { // gemeinsamer Grundriss für Walk-in-Varianten: Vorwand, Wand-WC, Duschbereich
  const { W } = B.D;
  B.add(slabW(0, 0, 0, W, 1.0, 0.2, o.vorwand), { name: 'Vorwand mit Ablage' }); B.foot(0, 0, W, 0.2);
  B.add(slabW(0, 1.0, 0, W, 1.025, 0.215, o.ledge || o.vorwand));
  const wc = toilet({ wall: true, cer: o.wcMat || M.ceramicMatte('#f3f2ee') });
  B.add(B.mount(wc, 'back', 0.45, 0, 0.2), { name: o.wcName || 'Wand-WC · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.foot(0.9, 0.2, W, 1.25, 'Dusche');
  linearDrain(B, 0.32, 1.15);
  return wc;
}
function buildE(B) { // Industrial Loft
  const { W, L, H } = B.D;
  const cd = slabTileSet('eFloor', { base: '#62645f', light: '#7c7e79', dark: '#40423f', contrast: 0.12, rough: 0.55, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(28,28,28,0.55)' });
  const floor = mat('eFloor', () => std({ map: cd.map, bumpMap: cd.bump, bumpScale: 0.6, roughnessMap: cd.rough, roughness: 1, envMapIntensity: 0.5 }));
  const cl = slabTileSet('eWall', { base: '#b3b1aa', light: '#cecbc4', dark: '#8d8b84', contrast: 0.1, rough: 0.6, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(70,70,70,0.45)' });
  const conc = mat('eWall', () => std({ map: cl.map, bumpMap: cl.bump, bumpScale: 0.6, roughnessMap: cl.rough, roughness: 1, envMapIntensity: 0.5 }));
  const metro = M.tile('eMetro', { tw: 0.15, th: 0.075, cols: 8, rows: 16, layout: 'brick', base: '#f1f0eb', vary: 0.02, grout: '#2b2b2b', gw: 0.0035, rt: 0.08, bevel: 0.012, bumpScale: 2.4, env: 1 });
  const oak = M.wood('oakB', WOOD.oak), black = M.black();
  buildShell(B, {
    walls: (id, len, H) => [{ a0: 0, a1: len, v0: 0, v1: H, mat: id === 'left' ? metro : conc }],
    floor, ceiling: M.paint('#3a3e40'), reveal: M.plaster('#c9c7c0'),
    door: { leafMat: M.wood('door', WOOD.door), innerMat: M.paint('#2f3335'), handleMat: black },
  });
  addLights(B, { mainColor: 0xffdcae });
  walkInShell(B, { vorwand: conc, wcName: 'Wand-WC matt · Klick: Deckel' });
  B.add(B.mount(flushPlate(black, black), 'back', 0.45, 0.8, 0.2), { name: 'Drückerplatte schwarz' });
  // Regalbretter über dem WC
  for (const y of [1.36, 1.66]) { B.add(slab(0.12, y, 0, 0.66, y + 0.035, 0.2, oak), { name: 'Eichenbrett mit Stahlwinkel' }); for (const x of [0.18, 0.6]) B.add(slab(x - 0.005, y - 0.08, 0, x + 0.005, y, 0.16, black)); }
  const tpE = tpRolls(2); tpE.position.set(0.3, 1.395, 0.1); B.add(tpE);
  const plE = trailing({ n: 8, minL: 0.2, maxL: 0.55, size: 0.045, seed: 17 }); const ppE = pot({ r: 0.07, h: 0.12, m: M.ceramicMatte('#2f3133') }); ppE.position.set(0.5, 1.695, 0.1); plE.position.set(0.5, 1.805, 0.1); B.add(ppE, plE);
  // Crittall-Glaswand + Rohrdusche
  const cp = crittallPanel({ len: 0.94, h: 2.0, rows: 4, cols: 1 }); cp.position.set(0.9, 0, 0.2); B.add(cp, { name: 'Stahlrahmen-Glaswand' });
  const cp2 = crittallPanel({ len: 0.2, h: 0.97, rows: 2, cols: 0 }); cp2.position.set(0.9, 1.03, 0); B.add(cp2);
  B.add(B.mount(pipeShower(black), 'right', 0.72, 0), { name: 'Aufputz-Rohrdusche schwarz' });
  B.add(at(duckboard(0.6, 0.45, M.wood('teak', WOOD.teak)), W - 0.42, 0, 1.5), { name: 'Holzrost' });
  // Waschtisch-Konsole
  const vz = L - 0.55; B.vz = vz;
  const con = new THREE.Group(), cw = 0.8, cdp = 0.48;
  con.add(slab(-cw / 2, 0.8, 0, cw / 2, 0.845, cdp, oak));
  for (const x of [-cw / 2 + 0.02, cw / 2 - 0.02]) { con.add(slab(x - 0.015, 0, cdp - 0.05, x + 0.015, 0.8, cdp - 0.02, black)); con.add(slab(x - 0.015, 0.77, 0, x + 0.015, 0.8, cdp - 0.02, black)); con.add(slab(x - 0.015, 0.22, 0, x + 0.015, 0.25, cdp - 0.02, black)); }
  con.add(slab(-cw / 2, 0.25, 0.02, cw / 2, 0.275, cdp - 0.03, oak));
  for (const x of [-0.18, 0.18]) con.add(at(rbox(0.3, 0.2, 0.34, 0.02, M.fabric('felt', '#6d6f6e')), x, 0.375, 0.22));
  const ves = vessel({ w: 0.5, d: 0.36, h: 0.12, r: 0.05, m: M.ceramicMatte('#f2f1ee') }); ves.position.set(0, 0.845, 0.26); con.add(ves);
  const fwE = faucetWall(black, { reach: 0.22 }); fwE.position.set(0, 1.08, 0); con.add(fwE);
  B.add(B.mount(con, 'left', vz, 0), { name: 'Stahl-Konsole mit Eichenplatte' });
  B.foot(0, vz - 0.4, 0.48, vz + 0.4, 'Konsole');
  B.add(B.mount(framedMirror(B, 0.5, 0.7, 0.06, black), 'left', vz, 1.58), { name: 'Spiegel mit Stahlrahmen' });
  for (const s of [-1, 1]) { const sc = cageSconce(); B.add(B.mount(sc, 'left', vz + s * 0.36, 1.68), { name: 'Käfigleuchte' }); const pl = new THREE.PointLight(0xffc380, 0, 1.4, 2); pl.position.set(0.18, 1.66, vz + s * 0.36); pl.userData.on = 0.6; pl.userData.day = 0.2; B.led(sc, pl); }
  // Heizkörper schwarz
  const rad = ladderRadiator({ w: 0.5, h: 1.4, m: black, groups: [6, 6, 5], valveM: black });
  rad.add(at(towelOver({ w: 0.46, front: 0.4, back: 0.32, m: M.fabric('waffle', '#d8d6d0', '#3a3a3a'), seed: 2 }), 0, 1.36, 0.055));
  B.add(B.mount(rad, 'left', 1.18, 0.22), { name: 'Handtuchheizkörper schwarz' });
  // offenes Stahlregal
  const sh = steelShelf({ w: 0.5, h: 1.95, d: 0.36, boards: [0.08, 0.5, 0.92, 1.34, 1.76], wood: oak });
  sh.add(at(rbox(0.4, 0.36, 0.3, 0.03, M.fabric('felt', '#6d6f6e')), 0, 0.29, 0.18));
  sh.add(at(towelStack(4, 0.38, 0.28, [M.fabric('waffle', '#d8d6d0', '#3a3a3a'), M.fabric('char', '#3e4143')]), 0, 0.53, 0.18));
  sh.add(at(rbox(0.36, 0.22, 0.28, 0.02, WICKER()), 0, 1.06, 0.18));
  sh.add(at(beardStation(M.black()), 0, 1.37, 0.18));
  const tpl = trailing({ n: 7, minL: 0.2, maxL: 0.5, size: 0.042, seed: 23 }); const tpp = pot({ r: 0.07, h: 0.12, m: M.ceramicMatte('#2f3133') }); tpp.position.set(0.05, 1.79, 0.18); tpl.position.set(0.05, 1.9, 0.18); sh.add(tpp, tpl);
  B.add(B.mount(sh, 'right', L - 0.27, 0), { name: 'Offenes Stahlregal', tall: 'right' }); B.foot(W - 0.36, L - 0.52, W, L - 0.02, 'Regal');
  for (const [z, len] of [[1.0, 0.5], [1.75, 0.65]]) B.add(at(edisonPendant(len), 0.85, H, z), { ceil: true, name: 'Edison-Pendelleuchte' });
  B.add(B.mount(exhaustFan(), 'left', 0.14, 2.12), { wall: 'left' });

  B.hot(1, [0.9, 1.6, 0.7], 'Stahlrahmen-Glaswand', 'Glas mit schwarzen Sprossen im Werkstatt-Look. Schützt das WC und gibt dem kleinen Raum Struktur.');
  B.hot(2, [W - 0.06, 1.45, 0.72], 'Aufputz-Rohrdusche', 'Schwarze Rohre mit Kreuzgriffen und großer Kopfbrause. Bewusst sichtbar statt versteckt.');
  B.hot(3, [0.95, 0.03, 1.9], 'Betonoptik 60 × 120', 'Großformatige Feinsteinzeug-Platten: kaum Fugen, robust, dunkel am Boden und hell an der Wand.');
  B.hot(4, [0.02, 1.2, 0.9], 'Metro-Fliesen, schwarze Fuge', 'Klassische Kachel-Wand hinter Waschtisch und Heizkörper. Dunkle Fuge sieht auch nach Jahren sauber aus.');
  B.hot(5, [0.24, 0.95, vz], 'Stahl-Konsole mit Eichenplatte', 'Offenes Gestell mit Filzkörben, eckiges Aufsatzbecken und schwarze Wandarmatur.');
  B.hot(6, [W - 0.18, 1.3, L - 0.27], 'Offenes Stahlregal', 'Statt Schrank: alles im Blick, Wäschekorb unten, Bart-Station auf Augenhöhe.');
  B.hot(7, [0.85, 1.75, 1.0], 'Edison-Pendel + Käfigleuchten', 'Warmes Glühfadenlicht. Am Spiegel kommen die Leuchten von beiden Seiten, also kein Schatten im Gesicht.');
  B.hot(8, [0.4, 1.5, 0.12], 'Wand-WC mit Regalbrettern', 'Spülkasten in der Vorwand, darüber zwei Eichenbretter für Vorrat und Grün.');
  B.zone('WC', 0.05, 0.76, 0.85, 1.51); B.zone('Dusche', 0.9, 1.25, W, 2.0); B.zone('Waschtisch', 0.48, vz - 0.45, 1.23, vz + 0.45);
  B.dim([0.9, 0.6, 1.3], [W, 0.6, 1.3], '80');
}

/* ------------------------------------------------------------------ */
function buildF(B) { // Smart Spa
  const { W, L, H } = B.D;
  const pf = slabTileSet('fFloor', { base: '#d9d5cd', light: '#e9e6df', dark: '#bdb7ad', contrast: 0.06, rough: 0.3, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(150,145,138,0.5)', veins: 6 });
  const floor = mat('fFloor', () => std({ map: pf.map, bumpMap: pf.bump, bumpScale: 0.3, roughness: 0.22, envMapIntensity: 0.8 }));
  const pw = slabTileSet('fWall', { base: '#eeebe6', light: '#f8f6f2', dark: '#d8d3ca', contrast: 0.05, rough: 0.25, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(170,165,158,0.5)', veins: 9 });
  const porc = mat('fWall', () => std({ map: pw.map, bumpMap: pw.bump, bumpScale: 0.25, roughness: 0.15, envMapIntensity: 0.9 }));
  const paint = M.plaster('#f2f0ec'), gloss = M.lacquer('#f6f6f4'), black = M.black();
  const pg = slabTileSet('fGraph', { base: '#4a4d51', light: '#5d6065', dark: '#36383b', contrast: 0.08, rough: 0.3, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(25,25,25,0.5)', veins: 7 });
  const graph = mat('fGraph', () => std({ map: pg.map, bumpMap: pg.bump, bumpScale: 0.25, roughness: 0.18, envMapIntensity: 0.9 }));
  buildShell(B, {
    walls: (id, len, H) => {
      if (id === 'right') return [{ a0: 0, a1: 1.38, v0: 0, v1: H, mat: porc }, { a0: 1.38, a1: len, v0: 0, v1: H, mat: paint }];
      if (id === 'back') return [{ a0: 0, a1: 0.9, v0: 0, v1: H, mat: graph }, { a0: 0.9, a1: len, v0: 0, v1: H, mat: porc }];
      return [{ a0: 0, a1: len, v0: 0, v1: H, mat: paint }];
    },
    floor, ceiling: M.plaster('#f6f5f2'), reveal: M.plaster('#f2f0ec'),
    niches: [{ wall: 'right', a0: 0.25, a1: 0.85, v0: 1.12, v1: 1.36, depth: 0.09, mat: porc }],
    door: { leafMat: M.lacquer('#f2f1ee'), innerMat: M.lacquer('#f2f1ee'), frameMat: M.lacquer('#f2f1ee'), handleMat: M.steel() },
  });
  addLights(B, { mainColor: 0xfff4e6 });
  const wc = walkInShell(B, { vorwand: graph, wcMat: M.ceramic('#f7f7f5'), wcName: 'Dusch-WC mit Föhn & Fernbedienung · Klick: Deckel' });
  wc.add(at(rbox(0.05, 0.08, 0.14, 0.02, M.ceramic('#f7f7f5')), 0.2, 0.39, 0.28));
  const fp = new THREE.Group(); fp.add(at(rbox(0.22, 0.14, 0.01, 0.005, M.glassTint('#14171a')), 0, 0, 0.005));
  const fr = mesh(new THREE.RingGeometry(0.03, 0.036, 40), M.lamp('#9fd4ff', 2.5, 1.2), { cast: false }); fr.position.z = 0.0112; fp.add(fr);
  B.add(B.mount(fp, 'back', 0.45, 0.8, 0.2), { name: 'Berührungslose Spülung' });
  B.add(B.mount(at(rbox(0.06, 0.11, 0.015, 0.008, M.whitePlastic()), 0, 0, 0.008), 'left', 0.55, 0.85), { name: 'Fernbedienung Dusch-WC' });
  // LED unter der Ablage (Nachtlicht-Pfad)
  const ll = slab(0.02, 0.985, 0.212, B.win.a0 - 0.02, 0.992, 0.218, M.lamp('#bfe2ff', 2.6, 0), { cast: false }); B.add(ll);
  const lp = new THREE.PointLight(0xbfe2ff, 0, 1.4, 2); lp.position.set(0.4, 0.8, 0.45); lp.userData.on = 0.35; B.led(ll, lp);
  // Glas + Deckenbrause + Thermostat
  B.add(slab(0.896, 0, 0.2, 0.904, 2.0, 1.14, M.glass(), { cast: false }), { name: 'Glaswand rahmenlos' }); B.add(slab(0.896, 1.03, 0, 0.904, 2.0, 0.2, M.glass(), { cast: false }));
  B.add(rod([0.9, 1.98, 1.12], [W, 1.98, 1.12], 0.008, M.chrome()));
  const rain = new THREE.Group(); rain.add(at(box(0.42, 0.012, 0.42, M.chrome()), 0, -0.006, 0)); const rr = mesh(new THREE.RingGeometry(0.15, 0.17, 4, 1), M.lamp('#cfe8ff', 2.2, 0.4), { cast: false }); rr.rotation.set(PI / 2, 0, PI / 4); rr.position.y = -0.013; rain.add(rr);
  B.add(at(rain, W - 0.42, H, 0.72), { ceil: true, name: 'LED-Deckenbrause 40 × 40' });
  const th = new THREE.Group(); th.add(at(rbox(0.13, 0.24, 0.012, 0.006, M.glassTint('#101317')), 0, 0, 0.006));
  const dsp = mesh(new THREE.PlaneGeometry(0.11, 0.06), std({ map: displayTex('thermo', [['38,0°', 120, 150, '#ffffff', 256, 'center'], ['REGEN · 7 MIN', 34, 214, '#7fc4ff', 256, 'center']]), emissive: 0xffffff, emissiveMap: displayTex('thermo', []), emissiveIntensity: 1, roughness: 0.3 }), { cast: false });
  dsp.material.emissiveMap = dsp.material.map; dsp.position.set(0, 0.05, 0.0125); th.add(dsp);
  B.add(B.mount(th, 'right', 1.03, 1.18), { name: 'Digitales Thermostat' });
  B.add(B.mount((() => { const g = new THREE.Group(); g.add(rod([0, -0.35, 0.03], [0, 0.35, 0.03], 0.01, M.chrome())); g.add(at(rbox(0.04, 0.05, 0.04, 0.008, M.chrome()), 0, 0.15, 0.05)); const hh = cyl(0.016, 0.022, 0.24, M.chrome()); hh.position.set(0, 0.25, 0.07); g.add(hh); return g; })(), 'right', 1.2, 1.3), { name: 'Handbrause an Stange' });
  B.add(B.mount(bottlesRow([{ r: 0.028, h: 0.17, c: '#e9e6df', cap: '#2a2a2a', pump: true }, { r: 0.028, h: 0.17, c: '#3b3f44', cap: '#c9c9c9', pump: true }, { r: 0.028, h: 0.17, c: '#b9c7cf', cap: '#2a2a2a', pump: true }], 0.11), 'right', 0.36, 1.12, -0.05), { wall: 'right' });
  // Waschtisch hochglanz + Sensorarmatur
  const vz = L - 0.55; B.vz = vz;
  const van = new THREE.Group(), vw = 0.8, vd = 0.47;
  van.add(slab(-vw / 2, 0.42, 0, vw / 2, 0.66, vd - 0.02, gloss), slab(-vw / 2, 0.66, 0, -vw / 2 + 0.018, 0.82, vd - 0.02, gloss), slab(vw / 2 - 0.018, 0.66, 0, vw / 2, 0.82, vd - 0.02, gloss), slab(-vw / 2, 0.66, 0, vw / 2, 0.82, 0.016, gloss));
  van.add(slab(-vw / 2 + 0.002, 0.422, vd - 0.02, vw / 2 - 0.002, 0.818, vd, gloss));
  van.add(slab(-vw / 2 + 0.04, 0.6, vd, vw / 2 - 0.04, 0.604, vd + 0.002, M.paint('#cfd0d0')));
  const led = slab(-vw / 2 + 0.03, 0.414, vd - 0.07, vw / 2 - 0.03, 0.42, vd - 0.06, M.lamp('#bfe2ff', 2.6, 0), { cast: false }); van.add(led);
  const bas = basin({ w: 0.81, d: 0.48, h: 0.045, r: 0.02, bw: 0.5, bd: 0.32, br: 0.06, bz: 0.04, m: M.ceramicMatte('#f6f6f4') }); bas.position.y = 0.865; van.add(bas);
  const sf = new THREE.Group(); sf.add(at(cyl(0.022, 0.026, 0.012, M.chrome()), 0, 0.006, 0), at(cyl(0.02, 0.022, 0.16, M.chrome()), 0, 0.08, 0)); sf.add(rod([0, 0.15, 0], [0, 0.15, 0.13], 0.014, M.chrome())); sf.add(at(sph(0.006, M.lamp('#ff5a4a', 2, 1.2), 8), 0, 0.12, 0.022)); sf.position.set(0, 0.865, 0.06); van.add(sf);
  B.add(B.mount(van, 'left', vz, 0), { name: 'Waschtisch hochglanz, Sensor-Armatur' });
  const ul = new THREE.PointLight(0xbfe2ff, 0, 1.4, 2); ul.position.set(0.3, 0.25, vz); ul.userData.on = 0.6; B.led(led, ul);
  // Spiegelschrank mit Display
  const mw = 0.8, mh = 0.74, md = 0.15, wM = M.lacquer('#f4f4f2');
  const cab = cabinet({ w: mw, h: mh, d: md, carcass: wM, plinth: 0, shelves: [0.25, 0.49], fronts: [{ y0: 0, y1: mh, x0: -mw / 2, x1: 0, door: 'l', mat: wM }, { y0: 0, y1: mh, x0: 0, x1: mw / 2, door: 'r', mat: wM }] });
  cab.userData.doors.forEach(({ piv, side }) => {
    const m = makeMirror(B, new THREE.PlaneGeometry(mw / 2 - 0.012, mh - 0.012)); m.position.set(side === 'l' ? mw / 4 : -mw / 4, 0, 0.0195); piv.add(m);
    if (side === 'l') {
      const dt = displayTex('mirror', [['07:12', 92, 96, '#ffffff'], ['4 °C · Regen ab 9 Uhr', 30, 150, '#b9d8ff'], ['Bartöl ✓ · Trimmen: 3 Tage', 26, 200, '#9fe0b4']]);
      const d = mesh(new THREE.PlaneGeometry(0.26, 0.13), std({ map: dt, emissive: 0xffffff, emissiveMap: dt, emissiveIntensity: 0.9, roughness: 0.2, transparent: true, opacity: 0.92 }), { cast: false });
      d.position.set(mw / 4, -0.2, 0.0205); piv.add(d);
    }
  });
  for (const y of [-0.004, mh]) cab.add(slab(-mw / 2 + 0.02, y, md - 0.05, mw / 2 - 0.02, y + 0.006, md - 0.02, M.lamp('#fff3e2', 3, 1.0), { cast: false }));
  cab.add(at(beardStation(M.paint('#d9dadb')), -0.15, 0.258, 0.07)); cab.add(at(socket(), 0.25, 0.08, 0.009));
  B.add(B.mount(cab, 'left', vz, 1.3), { name: 'Spiegelschrank mit Display & Antibeschlag · Klick zum Öffnen', click: () => openDoors(cab, 'mcF', 1.9) });
  const mlp = new THREE.PointLight(0xfff3e2, 0, 1.4, 2); mlp.position.set(0.3, 1.25, vz); mlp.userData.on = 0.6; mlp.userData.day = 0.25; B.led(cab, mlp);
  // Glas-Heizkörper
  const gr = new THREE.Group(); gr.add(at(rbox(0.5, 1.15, 0.025, 0.01, M.ceramic('#f6f6f4')), 0, 0.575, 0.045));
  for (const y of [0.35, 0.75]) gr.add(rod([-0.27, y, 0.09], [0.27, y, 0.09], 0.009, M.chrome()), rod([-0.27, y, 0.03], [-0.27, y, 0.09], 0.008, M.chrome()), rod([0.27, y, 0.03], [0.27, y, 0.09], 0.008, M.chrome()));
  gr.add(at(towelOver({ w: 0.46, front: 0.35, back: 0.28, r: 0.012, m: M.fabric('fGray', '#e3e1dc', '#8aa0b0'), seed: 6 }), 0, 0.75, 0.09));
  B.add(B.mount(gr, 'left', 1.2, 0.3), { name: 'Glas-Heizkörper mit Handtuchstangen' });
  // Schrankwand grifflos mit Innenlicht
  const cb = cabinet({ w: 0.5, h: H - 0.004, d: 0.36, carcass: gloss, inner: M.paint('#eceae6'), plinth: 0.08, shelves: [0.62, 1.2, 1.55, 1.98], plinthM: M.paint('#d8d8d6'),
    fronts: [{ y0: 0.08, y1: 1.98, door: 'l', mat: gloss }, { y0: 1.98, y1: H - 0.004, door: 'l', mat: gloss }] });
  const inn = new THREE.Group();
  inn.add(at(rbox(0.38, 0.4, 0.28, 0.03, M.fabric('fGray', '#e3e1dc', '#8aa0b0')), 0, 0.3, 0.17));
  inn.add(at(towelStack(5, 0.36, 0.26, [M.fabric('fGray', '#e3e1dc', '#8aa0b0'), M.fabric('fBlue', '#b9c7cf')]), 0, 0.638, 0.15));
  inn.add(at(bottlesRow([{ r: 0.03, h: 0.2, c: '#ffffff', cap: '#2a2a2a', pump: true }, { r: 0.028, h: 0.16, c: '#b9c7cf', cap: '#2a2a2a' }], 0.09), -0.12, 1.218, 0.15));
  inn.add(slab(-0.2, 1.97, 0.3, 0.2, 1.976, 0.31, M.lamp('#fff3e2', 3, 0.6), { cast: false }));
  cb.add(inn);
  const cbLower = { userData: { doors: [cb.userData.doors[0]] } };
  B.add(B.mount(cb, 'right', L - 0.27, 0), { name: 'Grifflose Schrankwand · Klick zum Öffnen', click: () => openDoors(cbLower, 'cbF', 1.8), tall: 'right' });
  B.foot(W - 0.36, L - 0.52, W, L - 0.02, 'Schrank');
  // Licht-Voute, Lautsprecher, Spots
  const cove = [], cM = M.lamp('#fff1de', 2.4, 0.35);
  for (const id of ['left', 'back', 'right', 'front']) { const f = wallFrame(id, B.D), a = f.p(0.05, H - 0.07, 0.01), b = f.p(f.len - 0.05, H - 0.064, 0.03); const s = slab(Math.min(a.x, b.x), a.y, Math.min(a.z, b.z), Math.max(a.x, b.x), b.y, Math.max(a.z, b.z), cM, { cast: false }); B.add(s, { wall: id }); cove.push(s); }
  const cvl = new THREE.PointLight(0xfff1de, 0, 3, 2); cvl.position.set(W / 2, H - 0.25, L / 2); cvl.userData.on = 0.8; cvl.userData.day = 0.2; B.led(cove[0], cvl);
  const spk = new THREE.Group(); spk.add(at(cyl(0.085, 0.085, 0.006, M.paint('#f2f2f0'), 32), 0, -0.003, 0)); spk.add(at(cyl(0.07, 0.07, 0.004, M.paint('#cfcfcd'), 32), 0, -0.006, 0));
  B.add(at(spk, 0.85, H, 1.55), { ceil: true, name: 'Decken-Lautsprecher' });
  for (const [x, z] of [[0.45, 0.55], [0.85, 1.95]]) B.add(at(spot(), x, H, z), { ceil: true, name: 'Einbauspot' });
  B.add(B.mount(exhaustFan(), 'left', 0.14, 2.12), { wall: 'left' });
  const sp = snakePlant({ n: 7, h: 0.3 }), spp = pot({ r: 0.06, h: 0.1, m: M.ceramic('#f6f6f4') }); spp.position.set(0.12, 1.025, 0.1); sp.position.set(0.12, 1.115, 0.1); B.add(spp, sp);

  B.hot(1, [0.45, 0.62, 0.55], 'Dusch-WC', 'Mit Unterdusche, Föhn und Fernbedienung an der Wand. Spülung berührungslos per Handbewegung.');
  B.hot(2, [0.2, 1.75, vz], 'Spiegelschrank mit Display', 'Zeigt Uhrzeit, Wetter und deine Bart-Routine. Beheizte Spiegelfläche: kein Beschlagen nach dem Duschen. Klick öffnet ihn.');
  B.hot(3, [W - 0.42, 2.05, 0.72], 'LED-Deckenbrause + Thermostat', 'Deckenbündige Regenbrause, Temperatur und Dauer am digitalen Panel. Einmal einstellen, jeden Tag gleich.');
  B.hot(4, [0.24, 0.95, vz], 'Sensor-Armatur', 'Wasser kommt nur, solange die Hände drunter sind. Spart Wasser, keine Kalkflecken am Hebel.');
  B.hot(5, [0.95, 0.03, 1.9], 'Elektrische Fußbodenheizung', 'Dünne Heizmatte unter den 60 × 120-Platten. Warme Füße, und der Boden trocknet schneller.');
  B.hot(6, [0.05, H - 0.1, 1.2], 'Lichtszenen', 'Lichtband an der Decke, Nischen-LED und ein blaues Nachtlicht unter Ablage und Waschtisch. Per Szene: Morgen, Spa, Nacht.');
  B.hot(7, [W - 0.18, 1.5, L - 0.27], 'Grifflose Schrankwand', 'Push-to-open, innen mit Licht. Wäsche, Handtücher und Vorrat verschwinden komplett.');
  B.hot(8, [0.06, 1.0, 1.2], 'Glas-Heizkörper', 'Weiße Glasplatte mit zwei Stangen. Schnell warm, Handtücher hängen einzeln.');
  B.zone('WC', 0.05, 0.76, 0.85, 1.51); B.zone('Dusche', 0.9, 1.25, W, 2.0); B.zone('Waschtisch', 0.48, vz - 0.45, 1.23, vz + 0.45);
  B.dim([0.9, 0.6, 1.3], [W, 0.6, 1.3], '80');
}

/* ------------------------------------------------------------------ */
VARIANTS.push(
  {
    key: 'd', hash: 'terrakotta', label: 'Terrakotta', sub: 'Mediterran, Wanne bleibt', build: buildD, sw: ['#b8673f', '#22508c', '#efe5d3'],
    info: {
      eyebrow: 'Variante D · Mediterran', title: 'Terrakotta & Kalk',
      pitch: 'Urlaub zu Hause: Terrakotta-Sechsecke am Boden, handbemalte Majolika hinter der Wanne, sonst warmer Kalkputz. Die Wanne bleibt und bekommt einen Glasaufsatz mit Rundung. Der Spülkasten verschwindet hinter einem Teak-Kasten, der gleichzeitig Ablage ist.',
      tenant: { ok: false, text: 'Mietwohnung nur mit Vermieter-OK' }, effort: 'ca. 2 Wochen · Fliesenleger + DIY', storage: 230,
      costs: [['Fliese auf Fliese: Terrakotta-Hex Boden + Majolika Nassbereich, inkl. Verlegung', 3900], ['Kalkputz Wände & Decke', 650], ['Wannenaufsatz Glas mit Rundung', 420], ['Retro-Armaturen Bronze (Wanne + Wandarmatur)', 780], ['Teak-Konsole + Aufsatzbecken', 690], ['Rattan-Spiegel + Pendelleuchte', 240], ['Spülkasten-Verkleidung Teak (DIY)', 90], ['Beleuchtete Nische', 380], ['Elektro', 300], ['Olivenbaum, Fouta-Tücher, Läufer, Körbe', 260]],
      palette: [['Terrakotta', '#b8673f'], ['Kobalt', '#22508c'], ['Kalk', '#efe5d3'], ['Teak', '#9a6a3c'], ['Bronze', '#8c5a32']],
    },
  },
  {
    key: 'e', hash: 'loft', label: 'Loft', sub: 'Beton, Stahl, Walk-in', build: buildE, sw: ['#62645f', '#1e1f21', '#f1f0eb'],
    info: {
      eyebrow: 'Variante E · Industrial', title: 'Loft',
      pitch: 'Werkstatt-Charme auf 4 m²: dunkle Betonoptik am Boden, Metro-Fliesen mit schwarzer Fuge, eine Glaswand mit Stahlsprossen und eine Rohrdusche auf Putz. Warmes Edison-Licht und Eiche halten es gemütlich, das offene Stahlregal ersetzt den Schrank.',
      tenant: { ok: false, text: 'Nur als Eigentum oder mit Vermieter-OK' }, effort: '3–4 Wochen · Fachbetrieb', storage: 390,
      costs: [['Demontage & Entsorgung', 1200], ['Sanitär: Vorwand, Wand-WC, bodengleiche Dusche, Rohrdusche', 5100], ['Abdichtung + Feinsteinzeug Betonoptik 60 × 120', 3900], ['Metro-Fliesen Waschtischwand', 650], ['Stahlrahmen-Glaswand', 1350], ['Stahl-Konsole Eiche + Aufsatzbecken + Armatur', 980], ['Spiegel, Käfigleuchten, Pendel', 420], ['Offenes Stahlregal Eiche', 380], ['Handtuchheizkörper schwarz', 290], ['Elektro', 1100], ['Maler: Decke dunkel', 300], ['Holzrost, Körbe, Pflanzen', 220]],
      palette: [['Beton dunkel', '#62645f'], ['Beton hell', '#b3b1aa'], ['Stahl schwarz', '#1e1f21'], ['Metro weiß', '#f1f0eb'], ['Eiche', '#c79d68']],
    },
  },
  {
    key: 'f', hash: 'smart', label: 'Smart Spa', sub: 'Dusch-WC, Licht, Display', build: buildF, sw: ['#eeebe6', '#8ec5ff', '#3b3f44'],
    info: {
      eyebrow: 'Variante F · Bad 2030', title: 'Smart Spa',
      pitch: 'Das Technik-Bad: Dusch-WC, Deckenbrause mit digitalem Thermostat, Sensor-Armatur, Fußbodenheizung und ein Spiegelschrank mit Display für Uhrzeit, Wetter und Bart-Routine. Helles Feinsteinzeug in Marmoroptik mit Graphit-Wand hinter dem WC, Lichtband an der Decke und blaues Nachtlicht für den Weg um drei Uhr nachts.',
      tenant: { ok: false, text: 'Nur als Eigentum oder mit Vermieter-OK' }, effort: '4 Wochen · Fachbetrieb + Elektriker', storage: 590,
      costs: [['Demontage & Entsorgung', 1200], ['Sanitär: Vorwand, bodengleiche Dusche', 4900], ['Dusch-WC mit Föhn & Fernbedienung', 1900], ['Abdichtung + Feinsteinzeug 60 × 120 Marmoroptik', 4300], ['Digitales Thermostat + LED-Deckenbrause', 1450], ['Elektrische Fußbodenheizung', 950], ['Elektro: Lichtszenen, Voute, Lautsprecher', 1800], ['Glaswand rahmenlos', 800], ['Waschtisch hochglanz + Sensor-Armatur', 1250], ['Spiegelschrank mit Display & Antibeschlag', 890], ['Schrankwand grifflos mit Innenlicht', 1700], ['Glas-Heizkörper', 420]],
      palette: [['Feinsteinzeug', '#eeebe6'], ['Graphit', '#4a4d51'], ['Hochglanz', '#f6f6f4'], ['Lichtblau', '#8ec5ff'], ['Chrom', '#d9dde0']],
    },
  },
);
VARIANTS.forEach(v => { if (v.info.costs) v.info.budget = v.info.costs.reduce((a, c) => a + c[1], 0); });
