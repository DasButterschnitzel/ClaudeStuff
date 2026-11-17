/* =====================================================================
   BESTAND + VARIANTEN A–F
   ===================================================================== */
function framedMirror(B, w, h, r, frameM, t = 0.025) {
  const g = new THREE.Group(), s = rrectShape(w + 2 * t, h + 2 * t, r + t); s.holes.push(rrectShape(w, h, r));
  g.add(mesh(new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 16 }), frameM));
  const m = makeMirror(B, new THREE.ShapeGeometry(rrectShape(w + 0.004, h + 0.004, r), 16)); m.position.z = 0.012; g.add(m);
  return g;
}
const T_BEST_WALL = () => M.tile('bestWall', { tw: 0.2, th: 0.25, cols: 5, rows: 4, base: '#f0ece3', vary: 0.018, grout: '#b9b1a3', gw: 0.003, rt: 0.11, bevel: 0.007 });
const T_BEST_FLOOR = () => M.tile('bestFloor', { tw: 0.33, layout: 'diag', colors: ['#d5c7b0', '#d9ccb6', '#cfc0a8'], vary: 0.025, grout: '#9e927b', gw: 0.004, rt: 0.3, bevel: 0.006 });

/* ------------------------------------------------------------------ */
function buildBestand(B, mini = false) {
  const { W, L, H } = B.D, { tray, rz, vz } = B.lay;
  const wallTile = T_BEST_WALL(), ch = M.chrome(), oak = M.wood('oakLight', WOOD.oakLight), black = M.black();
  shellKit(B, { walls: full(wallTile), floor: T_BEST_FLOOR(), door: { leafMat: M.wood('door', WOOD.door), innerMat: M.wood('door', WOOD.door) } });
  B.add(showerTray(B, { s: tray, h: 0.5, apron: wallTile }), { name: 'Duschtasse 78 × 78, tief, Schürze gefliest' });
  // Vorhang an Eckstange
  const cmap = mini ? stripeTex('linen', '#ece6da', '#e3dccd', 24, true) : undefined;
  const cur = cornerCurtain(B, { s: tray, span: 0.36, rodM: mini ? black : ch, map: cmap });
  B.add(cur, { name: (mini ? 'Waffelpiqué-Vorhang, beschwerter Saum' : 'Duschvorhang an Eckstange') + ' · Klick zum Zuziehen', click: () => toggle(cur, 'cv', { a: 0.36, b: cur.userData.total, dur: 1100, fn: cur.userData.setCurtain }) });
  B.add(B.mount(showerSetBestand({ scrub: !mini }), 'right', 0.25, 0), { name: 'Brausestange & Aufputz-Mischer' });
  if (!mini) {
    const bk = wireBasket(bottlesRow([{ r: 0.03, h: 0.16, c: '#7a1f3d', cap: '#e8e2d6' }, { r: 0.028, h: 0.13, c: '#d8a24a', cap: '#3a3a3a', flat: true }, { r: 0.022, h: 0.15, c: '#f2efe6', cap: '#2a2a2a' }, { r: 0.024, h: 0.17, c: '#2e2e33', cap: '#ccc' }], 0.075));
    bk.children[1].position.set(0.06, 0.003, 0.06);
    const glove = rbox(0.12, 0.05, 0.06, 0.02, M.fabric('glove', '#e4b6b0')); glove.position.set(0.33, 0.06, 0.1); glove.rotation.z = 0.6; bk.add(glove);
    B.add(B.mount(bk, 'back', W - 0.42, 1.6), { name: 'Gitterkorb über der Duschtasse' });
    B.add(B.mount(ovalCaddy(), 'right', tray + 0.27, 0.9), { name: 'Ovales Regal (hängt außerhalb der Dusche)' });
    B.add(tube([[W - 0.05, 0.9, tray + 0.27], [W - 0.07, 0.75, tray + 0.3], [W - 0.04, 0.62, tray + 0.24], [W - 0.012, 0.56, tray + 0.22]], 0.003, M.blackPlastic(), 40), { name: 'Ladekabel' });
  } else {
    const sh = new THREE.Group(); sh.add(slab(0, 0, 0, 0.36, 0.012, 0.11, black), slab(0, 0.012, 0.105, 0.36, 0.04, 0.11, black));
    sh.add(at(bottlesRow([{ r: 0.026, h: 0.15, c: '#e9e2d4', cap: '#2a2a2a', pump: true }, { r: 0.026, h: 0.15, c: '#9fae9c', cap: '#2a2a2a', pump: true }, { r: 0.026, h: 0.15, c: '#3b3f44', cap: '#e9e2d4', pump: true }], 0.11), 0.07, 0.012, 0.055));
    B.add(B.mount(sh, 'back', W - 0.4, 1.45), { name: 'Klebe-Duschablage (eine statt zwei)' });
  }
  B.add(B.mount(rbox(0.12, 0.12, 0.008, 0.004, M.steel()), 'right', tray + 0.2, 0.56, 0.004), { wall: 'right', name: 'Anschlussdose' });
  B.add(B.mount(socket(), 'right', tray + 0.08, 0.3), { wall: 'right' });
  kWcKeep(B, { lid: mini ? null : FUR('lid', '#7c7873'), seat: mini ? M.wood('oakLight', WOOD.oakLight) : null, name: 'Stand-WC · Klick: Deckel', brushM: mini ? black : undefined, tpM: mini ? black : undefined });
  if (!mini) { B.add(at(uMat(), B.lay.wcX, 0, 0.14), { name: 'WC-Vorleger (Plüsch)' }); const rag = rbox(0.18, 0.006, 0.26, 0.003, M.fabric('rag', '#e2d6c2')); rag.position.set(0.6, 0.004, 0.66); rag.rotation.y = 0.4; B.add(rag); }
  // Waschbecken + Kommode + Spiegelaufsatz
  B.add(B.mount(vanityDrawers(oak), 'left', vz + 0.02, 0), { name: 'Schubladen-Kommode unterm Becken' }); B.foot(0, vz - 0.21, 0.45, vz + 0.25, 'Kommode');
  B.add(B.mount(basin({ w: 0.6, d: 0.47, h: 0.15, r: 0.03, bw: 0.46, bd: 0.32, br: 0.08, bz: 0.03, depth: 0.13, cap: true }), 'left', vz, 0.86), { name: 'Wandwaschbecken 60 cm' });
  B.add(B.mount(faucetDeck(ch), 'left', vz, 0.86, 0.055));
  B.add(B.mount(bottle({ r: 0.032, h: 0.15, c: '#d6a24a', cap: '#d9dde0', pump: true, gloss: 0.05 }), 'left', vz - 0.2, 0.86, 0.06));
  B.add(B.mount(mirrorUnitBestand(B), 'left', vz, 1.2), { name: 'Spiegelaufsatz mit offenen Fächern' });
  if (mini) { const cl = new THREE.Group(); cl.add(at(rbox(0.42, 0.03, 0.06, 0.012, black), 0, 0, 0.03)); const led = slab(-0.19, -0.016, 0.02, 0.19, -0.012, 0.055, M.lamp('#fff3e2', 3, 1.2), { cast: false }); cl.add(led); B.add(B.mount(cl, 'left', vz, 2.24), { name: 'LED-Aufsatzleuchte (Klemme)' }); const pl = new THREE.PointLight(0xfff3e2, 0, 1.3, 2); pl.position.set(0.3, 2.0, vz); pl.userData.on = 0.6; pl.userData.day = 0.3; B.led(led, pl); }
  // Heizkörper, Stange
  const rad = kRadiator(B, { towels: mini ? [M.fabric('waffleS', '#e7e2d8', '#9fae9c')] : [], name: 'Handtuchheizkörper' });
  rad.add(at(towelOver({ w: 0.26, front: 0.2, back: 0.14, r: 0.012, m: M.fabric('lila', '#9a86c6'), seed: 8, wave: 0.006 }), 0.12, 0.1, 0.055));
  const bar = towelRail(0.58, ch);
  if (mini) bar.add(at(towelOver({ w: 0.5, front: 0.75, back: 0.6, r: 0.012, m: M.fabric('waffleS2', '#9fae9c', '#e7e2d8'), seed: 5 }), 0, 0, 0.065));
  else { bar.add(at(towelOver({ w: 0.42, front: 0.85, back: 0.7, r: 0.012, m: M.fabric('green', '#a9b93c'), seed: 5, wave: 0.02 }), -0.12, 0, 0.065)); bar.add(at(towelOver({ w: 0.26, front: 0.7, back: 0.55, r: 0.016, m: M.fabric('beige', '#e3d3bb', '#8b7a66'), seed: 3 }), 0.17, 0, 0.065)); }
  B.add(B.mount(bar, 'left', rz, 1.86), { name: 'Handtuchstange' });
  const hk = hook(mini ? black : ch); hk.add(at(clothHang({ w: 0.2, h: 0.5, m: M.fabric('black', '#22262c'), seed: 6 }), 0, 0.02, 0.045));
  B.add(B.mount(hk, 'front', 0.2, 1.58), { name: 'Haken' });
  kFan(B); B.add(at(domeLamp(0.16), W / 2, H, L / 2), { ceil: true, name: 'Deckenleuchte' });
  // Boden
  B.add(at(bathScale(), 1.0, 0, L - 0.78), { name: 'Waage' }); B.foot(0.85, L - 0.93, 1.15, L - 0.63, 'Waage');
  B.add(at(mini ? pedalBin('#3b3f44') : swingBin(), W - 0.14, 0, L - 0.17), { name: 'Mülleimer' }); B.foot(W - 0.25, L - 0.28, W - 0.03, L - 0.06);
  if (mini) { B.add(at(rug(0.5, 0.75, 'quick', { base: '#9fae9c', border: 'rgba(255,255,255,0.3)' }), 0.92, 0.006, tray + 0.48), { name: 'Schnelltrocknender Badläufer' }); }
  else {
    B.add(at(bathMat(0.42, 0.62, '#77736d', 'g1'), 0.98, 0.01, tray + 0.36), { name: 'Hochflor-Vorleger' });
    B.add(at(bathMat(0.4, 0.58, '#77736d', 'g1'), 0.7, 0.01, vz), { name: 'Hochflor-Vorleger' });
    const sl = slippers(); sl.position.set(0.22, 0, rz + 0.48); sl.rotation.y = 0.4; B.add(sl, { name: 'Plüsch-Schlappen' });
  }
  if (mini) {
    const pl = trailing({ n: 7, minL: 0.2, maxL: 0.5, size: 0.045, seed: 9 }), pp = pot({ r: 0.07, h: 0.11, m: M.ceramicMatte('#efebe3') });
    const tg = new THREE.Group(); pp.position.set(0, 0, 0); pl.position.set(0, 0.1, 0); tg.add(pp, pl); tg.position.set(0.04, 2.2, 0.0);
    B.add(B.mount(tg, 'left', vz + 0.1, 2.2, 0.08), { name: 'Efeutute auf dem Spiegelaufsatz' });
    const cb = rbox(0.24, 0.1, 0.12, 0.02, M.paint('#f2f1ec')); B.add(B.mount(cb, 'left', vz + 0.02, 0.67, 0.2), { name: 'Kabelbox für Föhn & Trimmer' });
  }
  B.anc.shower = [W - tray / 2, 1.45, tray / 2]; B.anc.floor = [1.0, 0.1, L - 0.78];
}
function hotBestand(B) {
  const { W, L } = B.D, { tray, rz, vz, wcX } = B.lay;
  B.hot(1, [W - tray + 0.02, 1.45, tray - 0.02], 'Duschvorhang', 'Klebt beim Duschen am Körper, lässt Spritzwasser durch und wird am Saum schnell stockig.', 'issue');
  B.hot(2, [W - 0.06, 1.35, tray + 0.27], 'Zwei Ablagen, eine davon draußen', 'Gitterkorb über der Duschtasse plus ovales Regal neben der Dusche: Flaschen tropfen auf die Fliesen.', 'issue');
  B.hot(3, [W - 0.06, 0.74, tray + 0.25], 'Ladekabel im Spritzbereich', 'Das Kabel hängt vom Duschregal zur Dose. Kabelsalat in der Nasszone ist unpraktisch und nicht ideal.', 'issue');
  B.hot(4, [1.0, 0.12, L - 0.78], 'Alles steht auf dem Boden', 'Waage, Mülleimer, Schlappen, WC-Bürste: jede freie Fliese ist belegt, Wischen wird zum Slalom.', 'issue');
  B.hot(5, [wcX, 0.1, 0.7], 'Plüsch überall', 'Zwei Hochflor-Vorleger, ein WC-Vorleger und ein Deckelbezug: Fusselmagneten, die schlecht trocknen.', 'issue');
  B.hot(6, [0.42, 0.45, vz], 'Mini-Kommode unterm Becken', 'Die kleine Kommode passt nicht zum 60er-Becken. Oben drauf landet ein Korb mit Föhn und Kabeln.', 'issue');
  B.hot(7, [0.17, 1.85, vz], 'Spiegelaufsatz ohne Licht', 'Licht kommt nur von der Deckenleuchte, also Schatten im Gesicht. Oben drauf stapeln sich Fenstersauger und Kartons.', 'issue');
  B.hot(8, [0.06, 1.62, rz], 'Handtuch-Stau', 'Zwei große Handtücher teilen sich eine Stange über dem Heizkörper, der selbst nackt bleibt.', 'issue');
  B.hot(9, [wcX, 1.12, 0.06], 'Spülkasten & Rohre auf Putz', 'Sichtbarer Spülkasten, Eckventil und Heizungsrohre an der Wand: unruhig und schwer zu putzen.', 'issue');
  B.hot('+', [(B.win.a0 + B.win.a1) / 2, 1.55, 0.0], 'Fenster + Lüfter', 'Die beste Nachricht: echtes Fenster und Abluft. Damit ist Schimmel gut beherrschbar.', 'plus');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildA(B) { // Skandi Sage
  const { W, L, H } = B.D, { tray, rz, vz } = B.lay, sage = '#8fa58e', black = M.black(), oak = M.wood('oakLight', WOOD.oakLight);
  const wallTile = T_BEST_WALL(), hb = herringboneSet('aFloor', { w: 0.09, l: 0.54, base: '#d6b98f', alt: '#cdae83', dark: '#9b7a52', gap: '#8f7150' });
  shellKit(B, { walls: full(wallTile), floor: mat('aFloor', () => std({ map: hb.map, bumpMap: hb.bump, bumpScale: 1.2, roughness: 0.5, envMapIntensity: 0.6 })), skirting: { h: 0.05, mat: M.paint('#f3f2ee') }, door: { leafMat: M.wood('door', WOOD.door), innerMat: M.wood('door', WOOD.door) } });
  kTray(B, { apron: wallTile, metal: black, profile: black, glassName: 'Eck-Glasabtrennung mit Pendeltür (geklemmt)' });
  const sh = new THREE.Group(); sh.add(slab(0, 0, 0, 0.32, 0.012, 0.11, black), slab(0, 0.012, 0.105, 0.32, 0.04, 0.11, black));
  sh.add(at(bottlesRow([{ r: 0.026, h: 0.15, c: sage, cap: '#f1efe9', pump: true }, { r: 0.026, h: 0.15, c: '#f1efe9', cap: '#2a2a2a', pump: true }], 0.1), 0.08, 0.012, 0.055));
  B.add(B.mount(sh, 'back', W - 0.38, 1.45), { name: 'Duschablage schwarz (bohrfrei)' });
  const wc = kWcKeep(B, { seat: oak, brushM: black, tpM: black, name: 'WC mit Eichen-Sitz · Klick: Deckel' });
  const shf = new THREE.Group(), x0 = 0.04, x1 = Math.min(B.win.a0 - 0.02, 0.6), sd = 0.25;
  for (const [x, z] of [[x0, 0.015], [x1, 0.015], [x0, sd], [x1, sd]]) shf.add(slab(x - 0.009, 0, z - 0.009, x + 0.009, 2.0, z + 0.009, black));
  for (const y of [1.38, 1.66, 1.94]) shf.add(slab(x0, y, 0.005, x1, y + 0.022, sd + 0.01, oak));
  const tp = tpRolls(3); tp.position.set((x0 + x1) / 2, 1.402, 0.13); shf.add(tp);
  const sp = snakePlant({ n: 7, h: 0.32 }), spp = pot({ r: 0.06, h: 0.1, m: M.ceramicMatte('#f1efe9') }); spp.position.set(x0 + 0.12, 1.962, 0.13); sp.position.set(x0 + 0.12, 2.06, 0.13); shf.add(spp, sp);
  shf.add(at(rbox(0.22, 0.15, 0.18, 0.02, M.fabric('basket', '#cdb894')), (x0 + x1) / 2, 1.682 + 0.075, 0.13));
  B.add(shf, { name: 'WC-Überbauregal Eiche/Schwarz' }); B.anc.shelf = [(x0 + x1) / 2, 1.7, 0.13];
  kVanity(B, { body: M.paint('#f3f2ee'), front: oak, w: 0.6, led: '#ffd7a0', metal: black, name: 'Hänge-Waschtisch 60 cm mit Nachtlicht' });
  B.add(at(bathScale(), 0.22, 0, vz - 0.1), { name: 'Waage (parkt unterm Waschtisch)' }); B.add(at(pedalBin(sage), 0.13, 0, vz + 0.2), { name: 'Treteimer unterm Waschtisch' });
  kMirror(B, { type: 'cabinet', name: 'LED-Spiegelschrank' });
  kRadiator(B, { towels: [M.fabric('sage', sage, '#f1efe9'), M.fabric('linen', '#e9e2d4', sage)] });
  kBar(B, black, M.fabric('sage2', '#a7b7a2', '#f1efe9'));
  kTall(B, { carcass: M.paint('#f3f2ee'), front: oak, name: 'Hochschrank 32 cm mit Wäschekippe', fill: (c, { w }) => { c.add(at(towelStack(4, w - 0.08, 0.22, [M.fabric('sage', sage, '#f1efe9'), M.fabric('linen', '#e9e2d4', sage)]), 0, 0.97, 0.13)); c.add(at(rbox(w - 0.06, 0.4, 0.22, 0.02, M.fabric('basket', '#cdb894')), 0, 0.3, 0.13)); } });
  kRug(B, 'sage', { base: '#9db09a', border: 'rgba(255,255,255,0.35)' });
  kHang(B, trailing({ n: 9, minL: 0.25, maxL: 0.65, seed: 4 }), { potM: M.ceramicMatte('#efebe3'), name: 'Efeutute in der Ampel' });
  kLamp(B, domeLamp(0.17), 'Deckenleuchte Opalglas'); kFan(B);
  B.hot(1, B.anc.shower, 'Eckglas statt Vorhang', 'Geklemmtes Eck-Glas mit Pendeltür auf der Duschtasse. Kein Kleben mehr, und beim Auszug kommt es wieder ab.');
  B.hot(2, B.anc.shelf, 'Regal über dem Spülkasten', 'Drei Eichenböden über dem WC: Klopapier-Vorrat, Korb, Pflanze. Steht auf dem Boden, kein Bohren.');
  B.hot(3, B.anc.mirror, 'LED-Spiegelschrank mit Steckdose', 'Bart-Station: Trimmer lädt im Schrank, Öl und Kamm sind griffbereit. Kein Kabel mehr am Duschregal.');
  B.hot(4, B.anc.vanity, 'Hängender Waschtisch', 'Boden bleibt frei, die Waage parkt darunter. LED mit Bewegungsmelder als Nachtlicht.');
  B.hot(5, B.anc.tall, 'Hochschrank an der Tür', 'Wo heute der Mülleimer steht: 32 cm schmal, unten Wäschekorb, oben Handtücher.');
  B.hot(6, [0.9, 0.03, L - 0.6], 'Klick-Vinyl Fischgrät', 'Wasserfestes SPC, schwimmend auf die alten Fliesen gelegt. Beim Auszug kommt es wieder raus.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildB(B) { // Japandi Spa
  const { W, L, H } = B.D, { vz } = B.lay; B.walkin = true;
  const mcFloor = M.cloud('bFloor', { base: '#bcae9b', light: '#e2d7c6', dark: '#8a7e6d', contrast: 0.08, rough: 0.42, world: 2.2, env: 0.55 });
  const mcWall = M.cloud('bWallMC', { base: '#cdc1b0', light: '#ebe2d4', dark: '#9f927f', contrast: 0.08, rough: 0.48, world: 2.0, env: 0.5 });
  const lime = M.cloud('bLime', { base: '#ebe4d8', light: '#fbf8f2', dark: '#c9bead', contrast: 0.07, rough: 0.92, strokes: 140, world: 2.4, env: 0.25, bumpScale: 0.4 });
  const oakB = M.wood('oakB', WOOD.oak), black = M.black(), linen = M.fabric('linen', '#e9e2d4', '#8f846f');
  shellKit(B, { walls: wallSpec(B, { base: lime, wet: mcWall, wetLen: 1.3, wetW: 0.82 }), floor: mcFloor, ceiling: M.plaster('#f3efe8'), reveal: M.plaster('#ece5d9'), niches: [nicheWalk(B, mcWall)], door: { leafMat: M.wood('doorLight', WOOD.doorLight), innerMat: M.wood('doorLight', WOOD.doorLight), handleMat: black }, light: 0xffecd2 });
  kWalkin(B, { vorwand: mcWall, ledge: oakB, wcName: 'Wand-WC spülrandlos · Klick: Deckel' });
  const fx1 = B.win.a0 - 0.03, slats = []; for (let x = 0.015; x + 0.034 <= fx1; x += 0.052) slats.push(slab(x, 1.03, 0.012, x + 0.034, H - 0.002, 0.034, oakB));
  B.add(slab(0, 1.03, 0, fx1, H, 0.012, M.paint('#2b2621')), { wall: 'back' }); B.add(mergeInto(slats, oakB), { wall: 'back', name: 'Eichen-Lamellen' });
  nicheItems(B, 0.36, 1.12, [{ r: 0.028, h: 0.17, c: '#3a342f', cap: '#c7b9a3', pump: true }, { r: 0.028, h: 0.17, c: '#d9cfc0', cap: '#3a342f', pump: true }, { r: 0.022, h: 0.12, c: '#8a6a4b', cap: '#3a342f' }]);
  const st = stool(); st.position.set(W - 0.33, 0, 0.85); st.rotation.y = PI / 2; B.add(st, { name: 'Teak-Hocker' });
  for (let i = 0; i < 2; i++) B.add(at(rolledTowel(0.22, 0.045, linen), 0.16, 1.075, 0.08 + i * 0.09));
  B.add(at(vaseBranch(), Math.max(0.3, B.win.a0 - 0.08), 1.03, 0.1), { name: 'Steinzeug-Vase' });
  kVanity(B, { body: oakB, front: M.flutedWood('oakB', WOOD.oak, 24), w: 0.6, basin: 'vessel', faucet: 'wall', metal: black, led: '#ffcf94', name: 'Waschtisch Eiche gerillt, schwebend', extra: (g, { w, d }) => g.add(slabW(-w / 2, 0.82, 0, w / 2, 0.84, d + 0.005, M.cloud('bStone', { base: '#d8d0c3', light: '#efe9df', dark: '#b2a795', contrast: 0.06, rough: 0.55, world: 1.2, env: 0.5 }))) });
  kMirror(B, { type: 'round', r: 0.28, halo: '#ffe2bb', name: 'LED-Rundspiegel Ø 56' });
  kRadiator(B, { wall: 'right', m: black, valveM: black, h: 1.3, towels: [linen], name: 'Heizkörper schwarz am Duschausgang' });
  kWallCab(B, { carcass: oakB, front: M.flutedWood('oakB2', WOOD.oak, 12), name: 'Hängeschrank Eiche über dem WC', led: '#ffcf94' });
  B.add(at(rug(0.5, 0.8, 'linen', { base: '#d6ccbb', border: 'rgba(90,70,50,0.22)' }), 0.85, 0.006, 1.75), { name: 'Leinen-Teppich' });
  kLamp(B, paperLantern(0.17), 'Papierleuchte', L / 2 + 0.2); kFan(B);
  B.hot(1, B.anc.shower, 'Walk-in statt Duschtasse', 'Bodengleich, 80 × 100 cm, Regenbrause und Handbrause. Keine Stolperkante mehr.');
  B.hot(2, [W - 0.02, 1.27, 0.5], 'Beleuchtete Nische', 'Shampoo wohnt in der Wand, abends mit warmem LED.');
  B.hot(3, B.anc.wc, 'Vorwand + Wand-WC', 'Der Aufputz-Spülkasten verschwindet in der Vorwand. Oben eine durchgehende Ablage, unter dem WC kann man wischen.');
  B.hot(4, B.anc.wcab, 'Hängeschrank über dem WC', 'Stauraum ohne Bodenfläche: Handtücher, Vorrat, Bart-Station. Klick öffnet ihn.');
  B.hot(5, B.anc.vanity, 'Eichen-Waschtisch mit Aufsatzbecken', 'Gerillte Front, Steinplatte, Wandarmatur. Darunter LED als Nachtlicht.');
  B.hot(6, B.anc.rad, 'Heizkörper am Duschausgang', 'Das Handtuch hängt warm genau da, wo du aus der Dusche kommst.');
  B.hot(7, [0.3, 1.75, 0.03], 'Eichen-Lamellen', 'Warme Holzwand hinter dem WC, dazu Papierleuchte und Kalkputz.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildC(B) { // Grand Hotel
  const { W, L, H } = B.D, { tray, vz } = B.lay;
  const zel = M.tile('zellige', { tw: 0.1, th: 0.1, cols: 10, rows: 10, colors: ['#1e4a3c', '#245746', '#18402f', '#2b5f4c', '#1a4436', '#2f6652'], vary: 0.07, grout: '#c8c0ad', gw: 0.0022, zellige: true, rt: 0.06, bevel: 0.01, bumpScale: 2.4, env: 1.1 });
  const lime = M.cloud('cLime', { base: '#d7c9b6', light: '#ece2d3', dark: '#b4a38c', contrast: 0.08, rough: 0.9, strokes: 140, world: 2.4, env: 0.25, bumpScale: 0.4 });
  const tz = terrazzoSet('cTz', { base: '#ebe5d9', chips: [['#2c5a49', 3, 0.018], ['#1b1b1b', 2, 0.012], ['#ffffff', 2, 0.02], ['#c49a52', 1, 0.01], ['#b8ae9f', 3, 0.015], ['#7f9b8c', 2, 0.014]] });
  const brass = M.brass(), walnut = M.wood('walnut', WOOD.walnut), green = M.lacquer('#24493c');
  shellKit(B, { walls: wallSpec(B, { base: lime, wain: { mat: zel, h: 1.25 }, wet: zel, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: mat('cFloor', () => std({ map: tz.map, roughnessMap: tz.rough, roughness: 1, envMapIntensity: 0.8 })), ceiling: M.plaster('#ece4d8'), reveal: M.plaster('#e2d6c6'), niches: [nicheTray(B, zel)], door: { leafMat: M.wood('door', WOOD.door), innerMat: green, handleMat: brass }, window: { sillMat: M.ceramic('#efe9df') }, light: 0xffe6c4 });
  kTray(B, { apron: zel, metal: brass, profile: brass, glass: 'frame', fixtures: 'round', glassName: 'Eck-Glas mit Messingrahmen' });
  nicheItems(B, 0.46, 0.95, [{ r: 0.03, h: 0.18, c: '#7a3d1a', cap: '#c9a052', pump: true, gloss: 0.05 }, { r: 0.03, h: 0.18, c: '#2a2a28', cap: '#c9a052', pump: true }]);
  kWcKeep(B, { cover: 'vormauer', boxMat: zel, ledgeMat: walnut, plateM: brass, seat: walnut, brushM: brass, tpM: brass, name: 'WC mit Nussbaum-Sitz · Klick: Deckel' });
  const fr = new THREE.Group(); fr.add(slab(-0.15, -0.21, 0, 0.15, 0.21, 0.025, walnut)); const pr = mesh(new THREE.PlaneGeometry(0.24, 0.35), std({ map: printTex(), roughness: 0.8, envMapIntensity: 0.3 })); pr.position.z = 0.0255; fr.add(pr);
  fr.position.set(Math.min(0.3, B.win.a0 / 2), 1.68, 0); B.add(fr, { name: 'Kunstdruck' });
  const tp = trailing({ n: 6, minL: 0.15, maxL: 0.35, size: 0.04, seed: 9, out: 0.05 }), tpp = pot({ r: 0.055, h: 0.08, m: brass }); tpp.position.set(0.09, 1.19, 0.12); tp.position.set(0.09, 1.26, 0.12); B.add(tpp, tp);
  kVanity(B, { body: walnut, front: M.flutedWood('walnut', WOOD.walnut, 22), knobs: brass, basin: 'under', topM: mat('marbleTop', () => phys({ map: marbleTex('top'), roughness: 0.12, clearcoat: 0.6, envMapIntensity: 0.8 })), faucet: 'tall', metal: brass, name: 'Waschtisch Nussbaum gerillt, Marmor-Optik' });
  kMirror(B, { type: 'arch', frame: brass, v: 1.12, name: 'Bogenspiegel Messing' });
  const lampG = new THREE.Group(), opal = M.lamp('#fff3e0', 2.6, 0.9);
  lampG.add(at(rbox(0.1, 0.05, 0.016, 0.006, brass), 0, 0, 0.008), rod([0, 0, 0.016], [0, 0, 0.1], 0.008, brass), rod([-0.2, 0, 0.1], [0.2, 0, 0.1], 0.009, brass));
  for (const x of [-0.18, 0.18]) { lampG.add(rod([x, 0, 0.1], [x, -0.05, 0.1], 0.006, brass)); const gl = sph(0.05, opal, 24); gl.position.set(x, -0.1, 0.1); gl.castShadow = false; lampG.add(gl); }
  B.add(B.mount(lampG, 'left', vz, 2.2), { name: 'Messing-Leuchte' });
  kRadiator(B, { m: brass, valveM: brass, pipeM: brass, towels: [M.fabric('creamG', '#efe7d8', '#24493c'), M.fabric('greenT', '#2b5a49')], name: 'Handtuchheizkörper Messing' });
  kTall(B, { w: 0.5, h: 1.95, d: 0.3, carcass: green, plinthM: green, plinth: 0.1, shelves: [0.96, 1.32, 1.64], fronts: [{ y0: 0.1, y1: 0.95, x0: -0.25, x1: 0, door: 'l', mat: green }, { y0: 0.1, y1: 0.95, x0: 0, x1: 0.25, door: 'r', mat: green }, { y0: 0.96, y1: 1.9, x0: -0.25, x1: 0, door: 'l', glass: true, frameM: green }, { y0: 0.96, y1: 1.9, x0: 0, x1: 0.25, door: 'r', glass: true, frameM: green }],
    handle: (fw, fh, f) => { const k = knob(brass, 0.011); k.position.set(f.door === 'l' ? fw / 2 - 0.04 : -fw / 2 + 0.04, f.y1 < 1 ? fh / 2 - 0.08 : -fh / 2 + 0.08, 0); return k; }, name: 'Apothekerschrank',
    fill: (c) => { c.add(at(bottlesRow([{ r: 0.03, h: 0.16, c: '#7a3d1a', cap: '#c9a052', gloss: 0.05 }, { r: 0.025, h: 0.12, c: '#efe7d8', cap: '#24493c' }, { r: 0.03, h: 0.18, c: '#2a2a28', cap: '#c9a052' }], 0.12), -0.12, 1.33, 0.13)); c.add(at(towelStack(4, 0.26, 0.2, [M.fabric('creamG', '#efe7d8', '#24493c'), M.fabric('greenT', '#2b5a49')]), 0, 0.97, 0.13)); c.add(at(beardStation(green), 0, 1.65, 0.13)); } });
  kRug(B, 'kilim', { base: '#8f3a24', kilim: ['#8f3a24', '#e9dcc4', '#23395b', '#c98e3a'] });
  kHang(B, fern({ n: 18, len: 0.34 }), { potM: brass, ropeM: brass, r: 0.07, name: 'Boston-Farn' });
  for (const z of [0.9, 1.8]) B.add(at(spot(brass), W / 2, H, z), { ceil: true, name: 'Einbauspot' }); kFan(B);
  B.hot(1, B.anc.shower, 'Eck-Glas mit Messingrahmen', 'Duschtasse bleibt, bekommt Glas mit Messingprofil und eine runde Regenbrause.');
  B.hot(2, [W - 0.02, 1.1, 0.58], 'Beleuchtete Nische', 'Flaschen in der Wand, abends warmes Licht auf den Zellige-Fliesen.');
  B.hot(3, B.anc.wc, 'Vormauerung statt Spülkasten', 'Ein gefliester Kasten versteckt Spülkasten und Rohre, oben Nussbaum-Ablage, darüber ein Kunstdruck.');
  B.hot(4, B.anc.vanity, 'Nussbaum-Waschtisch', 'Gerillte Front, Marmor-Optik, Unterbaubecken, Messing-Armatur.');
  B.hot(5, B.anc.tall, 'Apothekerschrank', 'In der Ecke an der Tür: oben Glas für das Schöne, unten zu für den Vorrat.');
  B.hot(6, [0.9, 0.03, L - 0.5], 'Terrazzo & Zellige', 'Fliese auf Fliese verlegt: flaschengrüne Zellige bis 1,25 m, im Nassbereich raumhoch.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildD(B) { // Terrakotta
  const { W, L, H } = B.D, { tray, rz } = B.lay;
  const hx = hexSet('dFloor', { w: 0.2, colors: ['#b5603d', '#c06b45', '#a9573a', '#c97a52'], vary: 0.06, grout: '#d9ccb6', gw: 0.004 });
  const mj = majolicaSet('dMaj', { t: 0.15, base: '#f2e8d5', grout: '#e1d6c2', gw: 0.002, ink: ['#22508c', '#d39a2c', '#2f6b55'] });
  const maj = mat('dMaj', () => std({ map: mj.map, bumpMap: mj.bump, bumpScale: 1.4, roughness: 0.2, envMapIntensity: 0.95 }));
  const lime = M.cloud('dLime', { base: '#efe5d3', light: '#fbf6ec', dark: '#d6c6ad', contrast: 0.08, rough: 0.92, strokes: 150, world: 2.4, env: 0.25, bumpScale: 0.5 });
  const tad = M.cloud('dTad', { base: '#e3cfb2', light: '#f2e4cf', dark: '#c2a582', contrast: 0.1, rough: 0.35, world: 1.6, env: 0.6 });
  const teak = M.wood('teak', WOOD.teak), bronze = mat('bronze', () => std({ color: 0x8c5a32, metalness: 1, roughness: 0.35, envMapIntensity: 1.1 }));
  shellKit(B, { walls: wallSpec(B, { base: lime, wet: maj, wetH: 1.9, wetLen: tray + 0.05, wetW: tray + 0.05 }), floor: mat('dFloor', () => std({ map: hx.map, bumpMap: hx.bump, bumpScale: 1.5, roughness: 0.78, envMapIntensity: 0.4 })), ceiling: M.plaster('#f3ece0'), reveal: M.plaster('#eee3d0'), niches: [nicheTray(B, maj)], door: { leafMat: M.wood('door', WOOD.door), innerMat: M.paint('#6f8794'), handleMat: bronze }, window: { sillMat: M.ceramicMatte('#efe3cf') }, light: 0xffe2bd });
  kTray(B, { apron: tad, metal: bronze, profile: M.black(), fixtures: 'pipe', glassName: 'Eck-Glas, dünnes schwarzes Profil' });
  const ni = new THREE.Group(); ni.add(bottlesRow([{ r: 0.03, h: 0.17, c: '#6b7a3a', cap: '#8c5a32', pump: true }], 0.09)); const sponge = sph(0.045, M.paint('#d6b56d'), 14); sponge.scale.set(1.2, 0.8, 1); sponge.position.set(0.14, 0.035, 0); ni.add(sponge); B.add(B.mount(ni, 'right', 0.48, 0.95, -0.05), { wall: 'right' });
  kWcKeep(B, { cover: 'box', boxMat: teak, slats: M.wood('teakD', { ...WOOD.teak, base: '#7d5530', seed: 33 }), seat: teak, brushM: M.paint('#b8673f'), tpM: bronze, name: 'WC mit Teak-Sitz · Klick: Deckel' });
  const pl = trailing({ n: 6, minL: 0.12, maxL: 0.35, size: 0.04, seed: 14, out: 0.06 }), pp = pot({ r: 0.06, h: 0.1, m: M.paint('#b8673f') }); pp.position.set(B.lay.wcX - 0.12, 1.36, 0.12); pl.position.set(B.lay.wcX - 0.12, 1.45, 0.12); B.add(pp, pl);
  kVanity(B, { type: 'console', body: teak, w: 0.6, d: 0.46, basin: 'round', faucet: 'wall', metal: bronze, baskets: [WICKER(), WICKER()], name: 'Teak-Konsole mit Aufsatzbecken & Rattan-Körben' });
  kMirror(B, { type: 'rattan', r: 0.24, v: 1.58, name: 'Rattan-Spiegel' });
  kRadiator(B, { towels: [M.fabric('fouta', '#efe4d0', '#b8673f')] });
  const peg = new THREE.Group(); peg.add(slab(-0.28, -0.035, 0, 0.28, 0.035, 0.02, teak)); [-0.18, 0, 0.18].forEach(x => peg.add(rod([x, 0, 0.02], [x, 0.01, 0.08], 0.011, teak)));
  peg.add(at(clothHang({ w: 0.28, h: 0.6, m: M.fabric('fouta2', '#d9c7aa', '#2f4f6b'), seed: 4 }), -0.18, 0, 0.07), at(clothHang({ w: 0.24, h: 0.5, m: M.fabric('fouta', '#efe4d0', '#b8673f'), seed: 9 }), 0.18, 0, 0.07));
  B.add(B.mount(peg, 'left', rz, 1.82), { name: 'Teak-Hakenleiste mit Fouta-Tüchern' }); B.anc.peg = [0.06, 1.82, rz];
  const ol = oliveTree(); ol.position.set(W - 0.18, 0, L - 0.2); B.add(ol, { name: 'Olivenbaum im Terrakottatopf' }); B.foot(W - 0.34, L - 0.36, W - 0.02, L - 0.04);
  const rb = new THREE.Group(); rb.add(lathe([[0, 0], [0.1, 0], [0.11, 0.3], [0, 0.3]], WICKER(), 28)); rb.position.set(W - 0.14, 0, tray + 0.62); B.add(rb, { name: 'Rattan-Korb als Mülleimer' });
  kRug(B, 'berber', { base: '#ece3d2', kilim: ['#ece3d2', '#3b3530', '#c27a4f', '#3b3530'] });
  const pd = rattanPendant(0.14, 0.26); pd.position.set(0.8, H - 0.26, L / 2 + 0.1); B.add(pd, { name: 'Rattan-Pendelleuchte' }); kFan(B);
  B.hot(1, B.anc.shower, 'Majolika im Nassbereich', 'Handbemaltes Muster in Kobalt, Ocker und Grün rund um die Duschtasse, dazu Bronze-Armaturen mit Kreuzgriffen.');
  B.hot(2, B.anc.wc, 'Teak-Kasten über dem Spülkasten', 'Spülkasten bleibt, verschwindet aber hinter Lamellen. Oben entsteht eine Ablage. DIY für rund 90 €.');
  B.hot(3, B.anc.vanity, 'Teak-Konsole', 'Offene Konsole mit zwei Rattan-Körben für Föhn und Bartpflege, rundes Aufsatzbecken.');
  B.hot(4, B.anc.peg, 'Hakenleiste statt Stange', 'Jedes Fouta-Tuch bekommt einen eigenen Haken und trocknet schneller.');
  B.hot(5, [W - 0.18, 1.1, L - 0.2], 'Olivenbaum', 'Mediterraner Hingucker. Mag das Milchglas-Licht ehrlich gesagt nicht: im Sommer raus, oder Kunst-Olive.');
  B.hot(6, [0.9, 0.03, L - 0.5], 'Terrakotta-Sechsecke', 'Warmer Boden, versiegelt und pflegeleicht. Verlegt als Fliese auf Fliese.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildE(B) { // Loft
  const { W, L, H } = B.D, { vz } = B.lay; B.walkin = true;
  const cd = slabTileSet('eFloor', { base: '#62645f', light: '#7c7e79', dark: '#40423f', contrast: 0.12, rough: 0.55, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(28,28,28,0.55)' });
  const cl = slabTileSet('eWall', { base: '#b3b1aa', light: '#cecbc4', dark: '#8d8b84', contrast: 0.1, rough: 0.6, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(70,70,70,0.45)' });
  const conc = mat('eWall', () => std({ map: cl.map, bumpMap: cl.bump, bumpScale: 0.6, roughnessMap: cl.rough, roughness: 1, envMapIntensity: 0.5 }));
  const metro = M.tile('eMetro', { tw: 0.15, th: 0.075, cols: 8, rows: 16, layout: 'brick', base: '#f1f0eb', vary: 0.02, grout: '#2b2b2b', gw: 0.0035, rt: 0.08, bevel: 0.012, bumpScale: 2.4, env: 1 });
  const oak = M.wood('oakB', WOOD.oak), black = M.black();
  shellKit(B, { walls: (id, len, H) => [{ a0: 0, a1: len, v0: 0, v1: H, mat: id === 'left' ? metro : conc }], floor: mat('eFloor', () => std({ map: cd.map, bumpMap: cd.bump, bumpScale: 0.6, roughnessMap: cd.rough, roughness: 1, envMapIntensity: 0.5 })), ceiling: M.paint('#3a3e40'), reveal: M.plaster('#c9c7c0'), door: { leafMat: M.wood('door', WOOD.door), innerMat: M.paint('#2f3335'), handleMat: black }, light: 0xffdcae });
  kWalkin(B, { vorwand: conc, glass: 'frame', fixtures: 'pipe', metal: black });
  kVanity(B, { type: 'console', body: oak, legs: black, steel: true, w: 0.6, d: 0.48, basin: 'vessel', faucet: 'wall', metal: black, baskets: [M.fabric('felt', '#6d6f6e'), M.fabric('felt', '#6d6f6e')], name: 'Stahl-Konsole mit Eichenplatte' });
  kMirror(B, { type: 'rect', w: 0.46, h: 0.66, frame: black, name: 'Spiegel mit Stahlrahmen' });
  for (const s of [-1, 1]) { const sc = cageSconce(); B.add(B.mount(sc, 'left', vz + s * 0.32, 1.66), { name: 'Käfigleuchte' }); const pl = new THREE.PointLight(0xffc380, 0, 1.4, 2); pl.position.set(0.18, 1.64, vz + s * 0.32); pl.userData.on = 0.6; pl.userData.day = 0.2; B.led(sc, pl); }
  kRadiator(B, { wall: 'right', m: black, valveM: black, h: 1.3, towels: [M.fabric('waffle', '#d8d6d0', '#3a3a3a')], name: 'Heizkörper schwarz am Duschausgang' });
  for (const y of [1.36, 1.66]) { B.add(slab(0.03, y, 0, B.win.a0 - 0.05, y + 0.035, 0.2, oak), { name: 'Eichenbrett mit Stahlwinkel' }); for (const x of [0.08, B.win.a0 - 0.1]) B.add(slab(x - 0.005, y - 0.08, 0, x + 0.005, y, 0.16, black)); }
  const tpE = tpRolls(2); tpE.position.set(0.2, 1.395, 0.1); B.add(tpE); B.anc.shelf = [0.25, 1.55, 0.1];
  const plE = trailing({ n: 8, minL: 0.2, maxL: 0.55, size: 0.045, seed: 17 }), ppE = pot({ r: 0.065, h: 0.11, m: M.ceramicMatte('#2f3133') }); ppE.position.set(0.36, 1.695, 0.1); plE.position.set(0.36, 1.795, 0.1); B.add(ppE, plE);
  B.add(at(duckboard(0.6, 0.45, M.wood('teak', WOOD.teak)), W - 0.42, 0, 1.45), { name: 'Holzrost' });
  for (const [z, len] of [[0.95, 0.5], [1.75, 0.62]]) B.add(at(edisonPendant(len), 0.72, H, z), { ceil: true, name: 'Edison-Pendelleuchte' }); kFan(B);
  B.hot(1, B.anc.shower, 'Glaswand mit Stahlsprossen', 'Werkstatt-Look, schützt das WC, darunter eine Aufputz-Rohrdusche mit Kreuzgriffen.');
  B.hot(2, [0.02, 1.2, 1.2], 'Metro-Fliesen, schwarze Fuge', 'Kachelwand hinter Waschtisch: die dunkle Fuge sieht auch nach Jahren sauber aus.');
  B.hot(3, B.anc.vanity, 'Stahl-Konsole', 'Eichenplatte auf schwarzem Stahl, Filzkörbe, eckiges Aufsatzbecken.');
  B.hot(4, B.anc.shelf, 'Regalbretter über dem WC', 'Spülkasten steckt in der Vorwand, darüber Eiche für Vorrat und Grün.');
  B.hot(5, [0.72, 1.85, 0.95], 'Edison-Licht', 'Warme Glühfaden-Pendel plus Käfigleuchten links und rechts vom Spiegel.');
  B.hot(6, [0.9, 0.03, L - 0.5], 'Betonoptik 60 × 120', 'Dunkel am Boden, hell an der Wand, kaum Fugen.');
  kZones(B);
}

/* ------------------------------------------------------------------ */
function buildF(B) { // Smart Spa
  const { W, L, H } = B.D, { vz } = B.lay; B.walkin = true;
  const pf = slabTileSet('fFloor', { base: '#d9d5cd', light: '#e9e6df', dark: '#bdb7ad', contrast: 0.06, rough: 0.3, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(150,145,138,0.5)', veins: 6 });
  const pw = slabTileSet('fWall', { base: '#eeebe6', light: '#f8f6f2', dark: '#d8d3ca', contrast: 0.05, rough: 0.25, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(170,165,158,0.5)', veins: 9 });
  const pg = slabTileSet('fGraph', { base: '#4a4d51', light: '#5d6065', dark: '#36383b', contrast: 0.08, rough: 0.3, world: 2.4, tw: 0.6, th: 1.2, grout: 'rgba(25,25,25,0.5)', veins: 7 });
  const porc = mat('fWall', () => std({ map: pw.map, bumpMap: pw.bump, bumpScale: 0.25, roughness: 0.15, envMapIntensity: 0.9 })), graph = mat('fGraph', () => std({ map: pg.map, bumpMap: pg.bump, bumpScale: 0.25, roughness: 0.18, envMapIntensity: 0.9 }));
  const paint = M.plaster('#f2f0ec'), gloss = M.lacquer('#f6f6f4');
  shellKit(B, { walls: wallSpec(B, { base: paint, wet: porc, wetLen: 1.3, wetW: 0.82, per: { back: (len, H) => [{ a0: 0, a1: W - 0.82, v0: 0, v1: H, mat: graph }, { a0: W - 0.82, a1: len, v0: 0, v1: H, mat: porc }] } }), floor: mat('fFloor', () => std({ map: pf.map, bumpMap: pf.bump, bumpScale: 0.3, roughness: 0.22, envMapIntensity: 0.8 })), ceiling: M.plaster('#f6f5f2'), niches: [nicheWalk(B, porc)], door: { leafMat: M.lacquer('#f2f1ee'), innerMat: M.lacquer('#f2f1ee'), frameMat: M.lacquer('#f2f1ee'), handleMat: M.steel() }, light: 0xfff4e6 });
  const fp = new THREE.Group(); fp.add(at(rbox(0.22, 0.14, 0.01, 0.005, M.glassTint('#14171a')), 0, 0, 0.005)); const fr = mesh(new THREE.RingGeometry(0.03, 0.036, 40), M.lamp('#9fd4ff', 2.5, 1.2), { cast: false }); fr.position.z = 0.0112; fp.add(fr);
  const wc = kWalkin(B, { vorwand: graph, wcMat: M.ceramic('#f7f7f5'), metal: M.chrome(), plate: fp, wcName: 'Dusch-WC mit Föhn & Fernbedienung · Klick: Deckel', fixtures: 'custom' });
  wc.add(at(rbox(0.05, 0.08, 0.14, 0.02, M.ceramic('#f7f7f5')), 0.2, 0.39, 0.28));
  const ll = slab(0.02, 0.985, 0.212, B.win.a0 - 0.02, 0.992, 0.218, M.lamp('#bfe2ff', 2.6, 0), { cast: false }); B.add(ll); const lp = new THREE.PointLight(0xbfe2ff, 0, 1.4, 2); lp.position.set(0.3, 0.8, 0.45); lp.userData.on = 0.35; B.led(ll, lp);
  const rain = new THREE.Group(); rain.add(at(box(0.4, 0.012, 0.4, M.chrome()), 0, -0.006, 0)); const rr = mesh(new THREE.RingGeometry(0.14, 0.16, 4, 1), M.lamp('#cfe8ff', 2.2, 0.4), { cast: false }); rr.rotation.set(PI / 2, 0, PI / 4); rr.position.y = -0.013; rain.add(rr);
  B.add(at(rain, W - 0.4, H, 0.66), { ceil: true, name: 'LED-Deckenbrause 40 × 40' });
  const th = new THREE.Group(); th.add(at(rbox(0.13, 0.24, 0.012, 0.006, M.glassTint('#101317')), 0, 0, 0.006));
  const dtex = displayTex('thermo', [['38,0°', 120, 150, '#ffffff', 256, 'center'], ['REGEN · 7 MIN', 34, 214, '#7fc4ff', 256, 'center']]);
  const dsp = mesh(new THREE.PlaneGeometry(0.11, 0.06), std({ map: dtex, emissive: 0xffffff, emissiveMap: dtex, emissiveIntensity: 1, roughness: 0.3 }), { cast: false }); dsp.position.set(0, 0.05, 0.0125); th.add(dsp);
  B.add(B.mount(th, 'right', 0.9, 1.18), { name: 'Digitales Thermostat' });
  B.add(B.mount((() => { const g = new THREE.Group(); g.add(rod([0, -0.35, 0.03], [0, 0.35, 0.03], 0.01, M.chrome())); const hh = cyl(0.016, 0.022, 0.24, M.chrome()); hh.position.set(0, 0.25, 0.07); g.add(hh); return g; })(), 'right', 1.08, 1.3), { name: 'Handbrause an Stange' });
  nicheItems(B, 0.36, 1.12, [{ r: 0.028, h: 0.17, c: '#e9e6df', cap: '#2a2a2a', pump: true }, { r: 0.028, h: 0.17, c: '#3b3f44', cap: '#c9c9c9', pump: true }, { r: 0.028, h: 0.17, c: '#b9c7cf', cap: '#2a2a2a', pump: true }], 0.11);
  const sf = (g) => { const f = new THREE.Group(); f.add(at(cyl(0.022, 0.026, 0.012, M.chrome()), 0, 0.006, 0), at(cyl(0.02, 0.022, 0.16, M.chrome()), 0, 0.08, 0)); f.add(rod([0, 0.15, 0], [0, 0.15, 0.13], 0.014, M.chrome())); f.add(at(sph(0.006, M.lamp('#ff5a4a', 2, 1.2), 8), 0, 0.12, 0.022)); f.position.set(0, 0.865, 0.06); g.add(f); };
  kVanity(B, { body: gloss, front: gloss, w: 0.6, led: '#bfe2ff', faucet: 'none', extra: sf, name: 'Waschtisch hochglanz mit Sensor-Armatur' });
  kMirror(B, { type: 'cabinet', body: M.lacquer('#f4f4f2'), trayM: M.paint('#d9dadb'), display: displayTex('mirror', [['07:12', 92, 96, '#ffffff'], ['4 °C · Regen ab 9 Uhr', 30, 150, '#b9d8ff'], ['Bartöl ✓ · Trimmen: 3 Tage', 26, 200, '#9fe0b4']]), name: 'Spiegelschrank mit Display & Antibeschlag' });
  kRadiator(B, { wall: 'right', glass: true, w: 0.42, h: 1.1, towels: [M.fabric('fGray', '#e3e1dc', '#8aa0b0')], name: 'Glas-Heizkörper am Duschausgang' });
  kWallCab(B, { carcass: gloss, front: gloss, led: '#bfe2ff', towelM: M.fabric('fGray', '#e3e1dc', '#8aa0b0'), trayM: M.paint('#d9dadb'), name: 'Grifflose Hängeschrank mit Licht' });
  const cM = M.lamp('#fff1de', 2.4, 0.35); let cov;
  for (const id of WALLS) { const f = wallFrame(id, B.D), a = f.p(0.05, H - 0.07, 0.01), b = f.p(f.len - 0.05, H - 0.064, 0.03); const s = slab(Math.min(a.x, b.x), a.y, Math.min(a.z, b.z), Math.max(a.x, b.x), b.y, Math.max(a.z, b.z), cM, { cast: false }); B.add(s, { wall: id }); cov = s; }
  const cvl = new THREE.PointLight(0xfff1de, 0, 3, 2); cvl.position.set(W / 2, H - 0.25, L / 2); cvl.userData.on = 0.8; cvl.userData.day = 0.2; B.led(cov, cvl);
  const spk = new THREE.Group(); spk.add(at(cyl(0.085, 0.085, 0.006, M.paint('#f2f2f0'), 32), 0, -0.003, 0), at(cyl(0.07, 0.07, 0.004, M.paint('#cfcfcd'), 32), 0, -0.006, 0)); B.add(at(spk, 0.75, H, 1.5), { ceil: true, name: 'Decken-Lautsprecher' });
  B.add(at(spot(), 0.75, H, 2.0), { ceil: true, name: 'Einbauspot' }); kFan(B);
  B.hot(1, B.anc.wc, 'Dusch-WC', 'Mit Unterdusche, Föhn und Fernbedienung. Spülung berührungslos, Nachtlicht unter der Ablage.');
  B.hot(2, B.anc.mirror, 'Spiegelschrank mit Display', 'Uhrzeit, Wetter, Bart-Routine. Beheizte Spiegelfläche: kein Beschlagen. Klick öffnet ihn.');
  B.hot(3, B.anc.shower, 'LED-Deckenbrause + Thermostat', 'Deckenbündige Regenbrause, Temperatur und Dauer am digitalen Panel.');
  B.hot(4, B.anc.vanity, 'Sensor-Armatur', 'Wasser nur, solange die Hände drunter sind. Darunter blaues Nachtlicht.');
  B.hot(5, [0.75, 0.03, L - 0.5], 'Fußbodenheizung', 'Elektrische Heizmatte unter den 60 × 120-Platten: warme Füße, Boden trocknet schneller.');
  B.hot(6, [0.05, H - 0.1, 1.2], 'Lichtszenen', 'Lichtband an der Decke, Nischen-LED, Nachtlicht-Pfad. Szenen: Morgen, Spa, Nacht.');
  kZones(B);
}
