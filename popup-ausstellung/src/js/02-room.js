/* =====================================================================
   RAUM: Pop-up³, Offenbacher Straße 1, Erdgeschoss
   Quelle: Exposé der Stadt Dreieich, Bestandsplan M 1:100 (Planstand 15.04.2025).
   Aus dem Scan abgegriffen und an den Planmaßen 8,05⁵ m (rechter Raumteil) und
   9,83⁵ m (Tiefe) geeicht. Genauigkeit etwa ±15 cm – vor dem Bau nachmessen.
   ===================================================================== */
const R = {
  W: 19.45, H: 2.5, SILL: 0.42, BENCH: 0.5,
  zG: 10.7,            // Glas der langen Fensterfront
  xG: -0.5,            // Glas der kurzen Fensterfront (links)
  zWW: 3.65,           // bis hier ist die linke Wand massiv (Naturstein), danach Fenster
  lager: { x0: 5.55, x1: 8.15, z1: 3.1 },
  core: { x0: 8.15, x1: 11.4, z1: 5.2 },      // Treppenhaus
  door: { x0: 16.6, x1: 18.85, z: 9.35 },      // Eingang, zurückgesetzt
  xRet: 16.55,
  sq: [[2.74, 4.93], [5.52, 4.93]],            // Vierkantstützen
  rd: [[13.92, 5.07], [16.73, 5.03]],          // Rundstützen
  frontX: [3.9, 7.93, 11.58, 15.22], westZ: [6.97],
  fenster: { west: ['3,25', '3,61'], sued: ['4,33', '3,91', '3,57', '3,63'], eingang: '2,35' },
};
R.colZ = R.zG - 0.42; R.colX = R.xG + 0.42;

function roomShape() {
  const P = [[0, 0], [R.lager.x0, 0], [R.lager.x0, R.lager.z1], [R.core.x0, R.lager.z1], [R.core.x0, R.core.z1], [R.core.x1, R.core.z1], [R.core.x1, 0],
    [R.W, 0], [R.W, R.door.z], [R.xRet, R.door.z], [R.xRet, R.zG], [R.xG, R.zG], [R.xG, R.zWW], [0, R.zWW]];
  const s = new THREE.Shape();
  P.forEach(([x, z], i) => (i ? s.lineTo(x, -z) : s.moveTo(x, -z)));
  s.closePath();
  return s;
}

function buildRoom() {
  const g = new THREE.Group(), dims = new THREE.Group(), tags = [];
  const mWall = M('#f3f1ed', { roughness: 0.95 }), mWhite = M('#f6f5f2', { roughness: 0.6 }), mCut = M('#3b3344', { roughness: 1 });
  const mFrame = M('#2f2a35', { roughness: 0.5 }), mDoor = M('#e4e1db', { roughness: 0.7 }), mGold = new THREE.MeshStandardMaterial({ color: '#b9973a', metalness: 0.85, roughness: 0.35 });
  const foilMat = new THREE.MeshBasicMaterial({ color: '#ededed', transparent: true, side: THREE.DoubleSide, depthWrite: false, visible: false });
  const mGlass = new THREE.MeshStandardMaterial({ color: '#cfe4ee', transparent: true, opacity: 0.09, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false });

  /* Gehweg / Umgebung */
  const pflaster = ctex(256, 256, (c, w) => { const r = rng(17); c.fillStyle = '#bdb8c4'; c.fillRect(0, 0, w, w); for (let y = 0; y < 8; y++) for (let x = -1; x < 4; x++) { c.fillStyle = `hsl(265, 6%, ${72 + r() * 9}%)`; c.fillRect((x + (y % 2) * 0.5) * 64 + 1.5, y * 32 + 1.5, 61, 29); } }, [24 / 1.6, 14.4 / 1.6]);
  g.add(box(24, 0.06, 14.4, M('#ffffff', { map: pflaster, roughness: 1 }), R.W / 2 - 0.9, -0.08, 6.2, false));

  /* Boden + Decke (Decke nur von innen sichtbar) */
  const fGeo = new THREE.ShapeGeometry(roomShape()); fGeo.rotateX(-PI / 2);
  const floor = new THREE.Mesh(fGeo, M('#efe9de', { map: TEX.holz, roughness: 0.62 })); floor.receiveShadow = true; floor.name = 'floor';
  g.add(floor);
  const ceil = new THREE.Mesh(fGeo, M('#f7f6f3', { side: THREE.BackSide, roughness: 1 })); ceil.position.y = R.H; g.add(ceil);

  /* Wände: Innenflächen einseitig, damit man von außen hineinsieht */
  const { W, H, zG, xG, zWW, lager: L, core: K, door: D, xRet } = R;
  /* Außenwände massiv: innen Putz bzw. Naturstein, außen Fassade, oben die dunkle Schnittfläche */
  const mAussen = M('#dcd8d2', { roughness: 1 }), mStein = M('#ffffff', { map: TEX.stein, roughness: 1 });
  const mauer = (x0, z0, x1, z1, innen) => { const m = [mAussen, mAussen, mCut, mAussen, mAussen, mAussen]; for (const i in innen) m[i] = innen[i]; g.add(box(x1 - x0, H, z1 - z0, m, (x0 + x1) / 2, 0, (z0 + z1) / 2, false)); };
  mauer(xG, -0.3, L.x0, 0, { 4: mWall });           // Rückwand links, Innenseite zeigt nach +z
  mauer(K.x1, -0.3, W + 0.3, 0, { 4: mWall });      // Rückwand rechts
  mauer(W, 0, W + 0.3, D.z, { 1: mWall });          // Brandmauer, Innenseite zeigt nach −x
  mauer(xG, 0, 0, zWW, { 0: mStein, 4: mWall });    // Natursteinwand, Innenseite zeigt nach +x
  /* Mauerstreifen am Boden (Grundriss-Lesbarkeit) */
  const strip = (x0, z0, x1, z1) => g.add(box(x1 - x0, 0.02, z1 - z0, mCut, (x0 + x1) / 2, 0, (z0 + z1) / 2, false));
  /* Lager, Treppenhaus, Pfeiler am Eingang: massive Körper mit dunkler Schnittfläche oben */
  const solid = (x0, z0, x1, z1) => { const b = box(x1 - x0, H, z1 - z0, [mWall, mWall, mCut, mWall, mWall, mWall], (x0 + x1) / 2, 0, (z0 + z1) / 2); g.add(b); return b; };
  solid(L.x0, -0.3, L.x1, L.z1); solid(K.x0, -0.3, K.x1, K.z1); solid(D.x1, D.z, W + 0.3, zG);

  /* Fensterfronten: Glas, Bank mit Lamellenfront, Stützen */
  const glass = (x0, z0, x1, z1, y0 = R.SILL, h = H - y0) => { const o = wall(x0, z0, x1, z1, mGlass, { h, y0 }); o.userData.noAO = true; o.receiveShadow = false; g.add(o); };
  glass(xRet, zG, xG, zG); glass(xG, zG, xG, zWW); glass(xRet, D.z, xRet, zG, 0);
  const mBench = M('#ffffff', { map: TEX.lamellen, roughness: 0.6 }), mTop = M('#d8d0c2', { roughness: 0.5 });
  const bench = (x0, z0, x1, z1) => {
    g.add(box(x1 - x0, R.SILL - 0.03, z1 - z0, mBench, (x0 + x1) / 2, 0, (z0 + z1) / 2));
    g.add(box(x1 - x0 + 0.04, 0.03, z1 - z0 + 0.04, mTop, (x0 + x1) / 2, R.SILL - 0.03, (z0 + z1) / 2));
  };
  bench(xG, zG - R.BENCH, xRet, zG); bench(xG, zWW, xG + R.BENCH, zG - R.BENCH);
  g.add(box(xRet - xG, 0.05, 0.05, mGold, (xRet + xG) / 2, H - 0.05, zG, false), box(0.05, 0.05, zG - zWW, mGold, xG, H - 0.05, (zG + zWW) / 2, false));
  for (const x of [R.colX, ...R.frontX]) g.add(cyl(0.11, H, mWhite, x, 0, R.colZ), box(0.05, H - R.SILL, 0.06, mGold, x, R.SILL, zG, false));
  for (const z of R.westZ) g.add(cyl(0.11, H, mWhite, R.colX, 0, z), box(0.06, H - R.SILL, 0.05, mGold, xG, R.SILL, z, false));
  g.add(box(0.07, H, 0.07, mGold, xG, 0, zG, false), box(xRet - xG, 0.04, 0.05, mGold, (xRet + xG) / 2, R.SILL, zG, false), box(0.05, 0.04, zG - zWW, mGold, xG, R.SILL, (zG + zWW) / 2, false));
  /* Dauerhafte Schaufensterfolierung nach der Vorlage: Skyline-Band, POP-UP, milchige Fläche, klares Oval */
  new THREE.TextureLoader().load(FOIL_SRC, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; foilMat.map = t; foilMat.visible = true; foilMat.needsUpdate = true; invalidate(3); });
  const foil = (x0, z0, x1, z1) => { const o = wall(x0, z0, x1, z1, foilMat, { h: H - R.SILL - 0.04, y0: R.SILL + 0.04 }); o.userData.noAO = true; o.receiveShadow = false; o.renderOrder = 2; g.add(o); };
  const fxs = [R.colX, ...R.frontX], fzs = [zWW, ...R.westZ, zG];
  for (let i = 0; i < fxs.length - 1; i++) foil(fxs[i] + 0.04, zG + 0.008, fxs[i + 1] - 0.04, zG + 0.008);
  for (let i = 0; i < fzs.length - 1; i++) foil(xG - 0.008, fzs[i] + 0.04, xG - 0.008, fzs[i + 1] - 0.04);
  /* Sockel außen: blaugraue Riemchen */
  const riem = (len) => M('#ffffff', { roughness: 0.6, map: ctex(128, 64, (c, w, h) => { c.fillStyle = '#c9ccd2'; c.fillRect(0, 0, w, h); c.fillStyle = '#5d6b7c'; for (let y = 0; y < 4; y++) for (let x = -1; x < 2; x++) c.fillRect((x + (y % 2) * 0.5) * 64 + 2, y * 16 + 2, 60, 12); }, [len / 0.48, 2]) });
  g.add(wall(xG, zG + 0.03, xRet, zG + 0.03, riem(xRet - xG), { h: R.SILL }), wall(xG - 0.03, zWW, xG - 0.03, zG + 0.03, riem(zG - zWW), { h: R.SILL }));
  /* Einbaustrahler in der Decke */
  const spots = []; for (let x = 1.2; x < W; x += 2.25) for (let z = 1.1; z < zG - 0.6; z += 2.25) if (!(x > L.x0 - 0.2 && x < K.x1 + 0.2 && z < (x < L.x1 ? L.z1 : K.z1) + 0.2) && !(x > xRet && z > D.z)) spots.push([x, z]);
  const sg = new THREE.CircleGeometry(0.07, 18); sg.rotateX(PI / 2);
  const sim = new THREE.InstancedMesh(sg, new THREE.MeshBasicMaterial({ color: '#fff6e2' }), spots.length), so = new THREE.Object3D();
  spots.forEach(([x, z], i) => { so.position.set(x, H - 0.004, z); so.updateMatrix(); sim.setMatrixAt(i, so.matrix); }); g.add(sim);
  g.add(box(0.07, H, 0.07, mFrame, xRet, 0, zG, false));
  for (const [x, z] of R.sq) g.add(box(0.3, H, 0.3, mWhite, x, 0, z));
  for (const [x, z] of R.rd) g.add(cyl(0.125, H, mWhite, x, 0, z));

  /* Eingang: Doppeltür aus Glas, Fußmatte, Pfeil */
  const dw = D.x1 - D.x0, dx = (D.x0 + D.x1) / 2;
  glass(D.x1, D.z, D.x0, D.z, 0, 2.1);
  for (const s of [-1, 1]) g.add(cyl(0.014, 0.9, M('#d5d9de', { metalness: 1, roughness: 0.2 }), dx + s * 0.09, 0.75, D.z - 0.05, 10));
  g.add(box(dw, H - 2.1, 0.08, mFrame, dx, 2.1, D.z, false), box(0.06, 2.1, 0.06, mFrame, dx, 0, D.z, false), box(0.06, 2.1, 0.06, mFrame, D.x0, 0, D.z, false), box(0.06, 2.1, 0.06, mFrame, D.x1, 0, D.z, false));
  g.add(box(1.9, 0.012, 1.1, M('#4a4553', { roughness: 1 }), dx, 0, D.z - 0.75, false));
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 3), M(C.orange)); arrow.rotation.x = -PI / 2; arrow.position.set(dx, 0.03, D.z + 0.85); arrow.scale.y = 1; g.add(arrow);

  /* Rückwand: Glasbaustein-Fenster mit Heizkörper, Türen, Klimagerät */
  const mGB = new THREE.MeshStandardMaterial({ map: TEX.glasbaustein, emissive: '#6aa6c9', emissiveIntensity: 0.25, roughness: 0.3, side: THREE.DoubleSide });   // auch von außen sichtbar
  const win = (x0, x1) => {
    const p = wall(x0, 0.012, x1, 0.012, mGB, { h: 1.2, y0: 1.0 }), cx = (x0 + x1) / 2, w = x1 - x0;
    g.add(p, box(w - 0.1, 0.55, 0.1, mWhite, cx, 0.22, 0.08));
    g.add(wall(x1, -0.306, x0, -0.306, mGB, { h: 1.2, y0: 1.0 }), box(w + 0.1, 1.3, 0.03, mWhite, cx, 0.95, -0.3, false));   // dasselbe Fenster in der Außenansicht
    /* Rahmen und Sprosse, von beiden Seiten zu sehen */
    g.add(box(w + 0.08, 0.05, 0.08, mWhite, cx, 0.96, -0.012), box(w + 0.08, 0.05, 0.08, mWhite, cx, 2.19, -0.012), box(0.05, 1.28, 0.08, mWhite, x0 - 0.015, 0.96, -0.012), box(0.05, 1.28, 0.08, mWhite, x1 + 0.015, 0.96, -0.012), box(0.035, 1.2, 0.06, mWhite, cx, 1.0, -0.012));
  };
  win(1.5, 2.7); win(11.9, 13.05);
  const doorLeaf = (x0, x1) => g.add(box(x1 - x0, 2.05, 0.05, mDoor, (x0 + x1) / 2, 0, 0.03, false), box(0.03, 0.12, 0.05, mFrame, x1 - 0.12, 1.02, 0.07, false), box(x1 - x0, 2.05, 0.03, mDoor, (x0 + x1) / 2, 0, -0.305, false));
  doorLeaf(4.5, 5.5); doorLeaf(17.1, 17.95);
  g.add(box(0.05, 2.05, 0.9, mDoor, L.x0 - 0.03, 0, 1.05, false));                         // Tür zum Lager
  g.add(box(0.85, 0.28, 0.2, mWhite, 3.6, 2.05, 0.1), box(0.1, 0.6, 0.8, mWhite, W - 0.06, 0.15, 8.75));   // Klimagerät, Heizkörper an der Brandmauer
  /* Pendelleuchten an der Fensterfront */
  const mLamp = M('#eeeae2', { roughness: 0.4 });
  for (const x of [2.1, 9.9, 13.3]) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 12, 0, PI * 2, 0, PI / 2), mLamp); d.position.set(x, 1.98, 8.85); g.add(d);
    g.add(box(0.01, 0.3, 0.01, mFrame, x, 2.2, 8.85, false));
  }

  /* Raumnamen (HTML-Marken) */
  tags.push({ p: [dx, 0.1, D.z + 1.5], t: 'Eingang' }, { p: [(L.x0 + L.x1) / 2, H, 1.4], t: 'Lager 6,3 m²' }, { p: [(K.x0 + K.x1) / 2, H, 2.4], t: 'Treppenhaus' },
    { p: [0.05, 1.6, 1.8], t: 'Naturstein' });

  /* Maße aus dem Bestandsplan */
  const mLine = new THREE.LineBasicMaterial({ color: '#3a3145' });
  const dim = (x0, z0, x1, z1, text) => {
    const pts = [new V3(x0, 0.02, z0), new V3(x1, 0.02, z1)], horiz = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    const tk = 0.14, t = horiz ? [0, tk] : [tk, 0];
    for (const [x, z] of [[x0, z0], [x1, z1]]) pts.push(new V3(x - t[0], 0.02, z - t[1]), new V3(x + t[0], 0.02, z + t[1]));
    dims.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), mLine));
    const lab = flatText(text, { size: 0.3 });
    lab.position.set((x0 + x1) / 2 + (horiz ? 0 : (x0 < 5 ? -0.28 : 0.28)), 0.03, (z0 + z1) / 2 + (horiz ? 0.28 : 0));
    if (!horiz) lab.rotation.y = x0 < 5 ? PI / 2 : -PI / 2;
    dims.add(lab);
  };
  const fx = [R.colX, ...R.frontX, xRet];
  R.fenster.sued.forEach((t, i) => dim(fx[i] + 0.11, zG + 0.45, fx[i + 1] - 0.11, zG + 0.45, t));
  dim(xRet, zG + 0.45, D.x1, zG + 0.45, R.fenster.eingang + ' (Eingang)');
  const fz = [zWW, ...R.westZ, zG];
  R.fenster.west.forEach((t, i) => dim(xG - 0.45, fz[i] + 0.08, xG - 0.45, fz[i + 1] - 0.08, t));
  dim(xG, zG + 1.25, W, zG + 1.25, 'Laden innen ≈ 19,9 m · Fensterfront gesamt 24,65 m');
  dim(W + 0.75, 0, W + 0.75, 9.84, '9,83⁵ (2,90 + 6,93⁵)');
  dim(K.x1, 5.75, W, 5.75, '8,05⁵');
  dim(0, 4.3, K.x0, 4.3, '≈ 8,15');
  const info = flatText('Raumhöhe ca. 2,50 m · Fensterhöhe rund 2,08 m · Brüstung ≈ 0,42 m', { size: 0.3 }); info.position.set(7.2, 0.03, zG + 2.0); dims.add(info);
  dims.visible = false;
  g.add(dims);
  return { g, dims, tags, floor, foil: foilMat, floorMat: floor.material, wallMat: mWall, ceilMat: ceil.material };
}
