/* =====================================================================
   BAUKASTEN für Varianten – alles relativ zum vermessenen Raster B.lay
   ===================================================================== */
const full = (m) => (id, len, H) => [{ a0: 0, a1: len, v0: 0, v1: H, mat: m }];
// Wandaufteilung: base, optional Sockelband (wain) und Nassbereich (wet) an Dusch- und Fensterwand
function wallSpec(B, { base, wain = null, wet = null, wetH = null, wetLen = 0.9, wetW = 0.84, per = {} }) {
  const { W } = B.D;
  return (id, len, H) => {
    if (per[id]) return per[id](len, H);
    const regs = [], band = (a0, a1) => { if (a1 - a0 < 1e-4) return; if (wain) regs.push({ a0, a1, v0: 0, v1: wain.h, mat: wain.mat }, { a0, a1, v0: wain.h, v1: H, mat: base }); else regs.push({ a0, a1, v0: 0, v1: H, mat: base }); };
    const top = wetH ?? H, wetSeg = (a0, a1) => { regs.push({ a0, a1, v0: 0, v1: top, mat: wet }); if (top < H) regs.push({ a0, a1, v0: top, v1: H, mat: base }); };
    if (wet && id === 'right') { wetSeg(0, wetLen); band(wetLen, len); }
    else if (wet && id === 'back') { band(0, W - wetW); wetSeg(W - wetW, len); }
    else band(0, len);
    return regs;
  };
}
function shellKit(B, o) {
  buildShell(B, { walls: o.walls, floor: o.floor, ceiling: o.ceiling || M.plaster('#f4f3ef'), reveal: o.reveal || M.plaster('#f1eee8'), niches: o.niches, door: o.door, window: o.window, skirting: o.skirting });
  addLights(B, { mainColor: o.light });
}
const nicheTray = (B, mat) => ({ wall: 'right', a0: 0.42, a1: 0.74, v0: 0.95, v1: 1.25, depth: 0.09, mat });
const nicheWalk = (B, mat) => ({ wall: 'right', a0: 0.3, a1: 0.7, v0: 1.12, v1: 1.4, depth: 0.09, mat });
function nicheItems(B, along, v, specs, gap = 0.085) { B.add(B.mount(bottlesRow(specs, gap), 'right', along, v, -0.05), { wall: 'right' }); }

/* ---------- Dusche ---------- */
function kTray(B, o = {}) { // Duschtasse bleibt (78 × 78), neue Abtrennung + Armaturen
  const s = B.lay.tray, { W } = B.D, metal = o.metal || M.chrome();
  B.add(showerTray(B, { s, h: 0.5, apron: o.apron || M.ceramic(), rimMat: o.rim || M.ceramic(), innerMat: o.inner || M.ceramic() }), { name: o.trayName || 'Duschtasse 78 × 78 (bleibt)' });
  if (o.glass !== 'none' && o.glass !== 'curtain') B.add(cornerGlass(B, { s, profile: o.profile || metal, frame: o.glass === 'frame', rows: o.rows || 0 }), { name: o.glassName || 'Eck-Glasabtrennung mit Pendeltür' });
  if (o.glass === 'curtain') { const c = cornerCurtain(B, { s, map: o.curtainMap, rodM: metal, span: 0.4 }); B.add(c, { name: o.curtainName || 'Duschvorhang · Klick', click: () => toggle(c, 'cv', { a: 0.4, b: c.userData.total, dur: 1000, fn: c.userData.setCurtain }) }); }
  trayFixtures(B, s, metal, o.fixtures || 'rail');
  B.anc.shower = [W - s / 2, 1.5, s * 0.5];
}
function kWalkin(B, o = {}) { // Duschtasse raus: Vorwand, Wand-WC, bodengleiche Dusche
  const { W, H } = B.D, metal = o.metal || M.black(), gx = W - 0.8;
  B.add(slabW(0, 0, 0, W, 1.0, 0.2, o.vorwand), { name: 'Vorwand mit Ablage' }); B.foot(0, 0, W, 0.2);
  B.add(slabW(0, 1.0, 0, gx, 1.03, 0.22, o.ledge || o.vorwand)); B.add(slabW(gx, 1.0, 0, W, 1.025, 0.21, o.vorwand));
  const wc = toilet({ wall: true, cer: o.wcMat || M.ceramicMatte('#f3f2ee'), seat: o.seat });
  B.add(B.mount(wc, 'back', B.lay.wcX, 0, 0.2), { name: o.wcName || 'Wand-WC · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.add(B.mount(o.plate || flushPlate(metal, metal, true), 'back', B.lay.wcX, 0.8, 0.2), { name: 'Drückerplatte' });
  if (o.glass === 'frame') { const cp = crittallPanel({ len: 0.8, h: 2.0, rows: 4, cols: 1, frame: metal }); cp.position.set(gx, 0, 0.2); B.add(cp, { name: 'Glaswand mit Sprossen' }); const cp2 = crittallPanel({ len: 0.2, h: 0.97, rows: 2, cols: 0, frame: metal }); cp2.position.set(gx, 1.03, 0); B.add(cp2); }
  else { B.add(slab(gx - 0.004, 0, 0.2, gx + 0.004, 2.0, 1.0, M.glass(), { cast: false }), { name: 'Walk-in-Glaswand 8 mm' }); B.add(slab(gx - 0.004, 1.03, 0, gx + 0.004, 2.0, 0.2, M.glass(), { cast: false })); B.add(slab(gx - 0.012, 0, 0.2, gx + 0.012, 1.0, 0.214, metal), slab(gx - 0.012, 1.03, 0, gx + 0.012, 2.0, 0.014, metal)); B.add(rod([gx, 1.98, 0.98], [W, 1.98, 0.98], 0.008, metal)); }
  B.add(slab(W - 0.1, 0, 0.3, W - 0.04, 0.003, 1.1, M.steel(), { cast: false }), { name: 'Duschrinne' });
  B.foot(gx, 0.2, W, 1.2, 'Dusche');
  if (o.fixtures === 'pipe') B.add(B.mount(pipeShower(metal), 'right', 0.62, 0), { name: 'Aufputz-Brausesystem' });
  else if (o.fixtures !== 'custom') {
    B.add(rod([W, 2.12, 0.66], [W - 0.36, 2.12, 0.66], 0.01, metal));
    B.add(at(o.round ? cyl(0.14, 0.14, 0.012, metal, 40) : rbox(0.3, 0.012, 0.3, 0.005, metal), W - 0.4, 2.1, 0.66), { name: 'Regenbrause' });
    const th = new THREE.Group(); th.add(at(rbox(0.15, 0.15, 0.012, 0.004, metal), 0, 0, 0.006)); for (const y of [0.035, -0.035]) { const k = cyl(0.02, 0.02, 0.03, metal, 24); k.rotation.x = PI / 2; k.position.set(0, y, 0.025); th.add(k); }
    B.add(B.mount(th, 'right', 0.86, 1.05), { name: 'Unterputz-Thermostat' });
    B.add(B.mount((() => { const g = new THREE.Group(); g.add(at(rbox(0.04, 0.05, 0.04, 0.008, metal), 0, 0, 0.02)); const hh = cyl(0.016, 0.02, 0.24, metal); hh.position.set(0, 0.06, 0.045); hh.rotation.x = -0.15; g.add(hh); return g; })(), 'right', 1.02, 1.3), { name: 'Handbrause' });
  }
  B.anc.shower = [W - 0.4, 1.45, 0.7]; B.anc.wc = [B.lay.wcX, 1.05, 0.2];
  return wc;
}
function kWcKeep(B, o = {}) { // Stand-WC bleibt am alten Anschluss
  const { wcX } = B.lay;
  const wc = toilet({ seat: o.seat, lidM: o.lid, cer: o.cer || M.ceramic() });
  const d = o.cover === 'vormauer' ? 0.22 : 0.06;
  B.add(B.mount(wc, 'back', wcX, 0, d), { name: o.name || 'WC · Klick: Deckel', click: () => toggle(wc.userData.lid, 'lid', { prop: 'rotation.x', a: 0, b: -1.75, dur: 700 }) });
  B.foot(wcX - 0.18, d, wcX + 0.18, d + 0.58, 'WC');
  if (o.cover === 'vormauer') {
    const x1 = B.win.a0 - 0.02;
    B.add(slabW(0, 0, 0, x1, 1.16, 0.22, o.boxMat), { name: 'Vormauerung (versteckt den Spülkasten)' }); B.foot(0, 0, x1, 0.22);
    B.add(slab(0, 1.16, 0, x1 + 0.01, 1.19, 0.245, o.ledgeMat || o.boxMat), { name: 'Ablage' });
    B.add(B.mount(flushPlate(o.plateM || M.chrome(), o.plateM || M.chrome(), true), 'back', wcX, 0.9, 0.22), { name: 'Drückerplatte' });
    B.anc.wc = [wcX, 1.25, 0.22];
  } else {
    B.add(B.mount(cisternExposed(o.cisternM), 'back', wcX, 0.95), { name: 'Spülkasten (bleibt)' });
    if (o.cover === 'box') {
      const bx = new THREE.Group(), x0 = wcX - 0.25, x1 = wcX + 0.25, m = o.boxMat;
      bx.add(slab(x0, 0.9, 0.2, x1, 1.32, 0.22, m), slab(x0, 0.9, 0, x0 + 0.02, 1.32, 0.2, m), slab(x1 - 0.02, 0.9, 0, x1, 1.32, 0.2, m), slab(x0 - 0.02, 1.32, 0, x1 + 0.02, 1.36, 0.25, m));
      if (o.slats) for (let i = 0; i < 8; i++) bx.add(slab(x0 + 0.03 + i * 0.058, 0.93, 0.22, x0 + 0.06 + i * 0.058, 1.29, 0.226, o.slats));
      B.add(bx, { name: 'Spülkasten-Verkleidung' });
    }
    B.anc.wc = [wcX, 1.2, 0.08];
  }
  if (o.brush !== false) B.add(at(brushHolder(o.brushM), wcX + 0.33, 0, 0.1), { name: 'WC-Bürste' });
  if (o.tp !== false) B.add(B.mount(tpHolder(o.tpM), 'left', 0.62, 0.8), { name: 'Klopapierhalter' });
  return wc;
}

/* ---------- Heizkörper & Handtücher ---------- */
function kRadiator(B, o = {}) {
  const walk = o.wall === 'right', w = o.w ?? (walk ? 0.45 : 0.6), h = o.h ?? 1.2;
  const rad = o.glass ? (() => { const g = new THREE.Group(); g.add(at(rbox(w, h, 0.025, 0.01, M.ceramic('#f6f6f4')), 0, h / 2, 0.045)); for (const y of [h * 0.3, h * 0.65]) g.add(rod([-w / 2 - 0.02, y, 0.09], [w / 2 + 0.02, y, 0.09], 0.009, M.chrome()), rod([-w / 2 - 0.02, y, 0.03], [-w / 2 - 0.02, y, 0.09], 0.008, M.chrome()), rod([w / 2 + 0.02, y, 0.03], [w / 2 + 0.02, y, 0.09], 0.008, M.chrome())); return g; })()
    : ladderRadiator({ w, h, m: o.m || M.paint('#f4f4f1'), groups: o.groups || (h > 1.3 ? [6, 6, 5] : [5, 5, 5]), valveM: o.valveM });
  const towels = o.towels || [];
  towels.forEach((m, i) => rad.add(at(towelOver({ w: w - 0.08, front: i ? 0.3 : 0.42, back: i ? 0.24 : 0.34, m, seed: 3 + i * 6 }), 0, (o.glass ? [h * 0.65, h * 0.3] : [h - 0.04, h * 0.52])[i] ?? h * 0.3, o.glass ? 0.09 : 0.055)));
  if (walk) B.add(B.mount(rad, 'right', 1.62, 0.25), { name: o.name || 'Handtuchheizkörper am Duschausgang' });
  else { B.add(B.mount(rad, 'left', B.lay.rz, 0.24), { name: o.name || 'Handtuchheizkörper' }); if (o.pipes !== false) bestandRadPipes(B, B.lay.rz, o.pipeM); }
  B.anc.rad = walk ? [B.D.W - 0.06, 1.0, 1.62] : [0.06, 1.0, B.lay.rz];
  return rad;
}
function bestandRadPipes(B, rz, m = M.paint('#f2f2ee')) {
  B.add(rod([0.045, 0.11, rz + 0.3], [0.045, 0.11, 0.03], 0.011, m), rod([0.075, 0.18, rz - 0.3], [0.075, 0.18, 0.03], 0.011, m));
  B.add(rod([0.045, 0.11, rz + 0.3], [0.045, 0.22, rz + 0.3], 0.011, m), rod([0.075, 0.18, rz - 0.3], [0.075, 0.22, rz - 0.3], 0.011, m));
}
function kBar(B, m, towelM, z = B.lay.rz, v = 1.84, len = 0.5) {
  const bar = towelRail(len, m); if (towelM) bar.add(at(towelOver({ w: len, front: 0.55, back: 0.45, r: 0.012, m: towelM, seed: 5 }), 0, 0, 0.065));
  return B.add(B.mount(bar, 'left', z, v), { name: 'Handtuchstange' });
}

/* ---------- Waschtisch ---------- */
function kVanity(B, o = {}) {
  const vz = B.lay.vz, w = o.w ?? 0.6, d = o.d ?? 0.47, g = new THREE.Group(), body = o.body, metal = o.metal || M.chrome();
  const type = o.type || 'float';
  if (type === 'float' || type === 'retro') {
    const y0 = type === 'retro' ? 0.12 : 0.42, top = 0.82;
    g.add(slab(-w / 2, y0, 0, w / 2, 0.66, d - 0.02, body), slab(-w / 2, 0.66, 0, -w / 2 + 0.018, top, d - 0.02, body), slab(w / 2 - 0.018, 0.66, 0, w / 2, top, d - 0.02, body), slab(-w / 2, 0.66, 0, w / 2, top, 0.016, body));
    const fr = o.front || body, n = o.drawers ?? 2, fh = (top - 0.004 - y0) / n;
    for (let i = 0; i < n; i++) { const a = y0 + 0.002 + i * fh, b = a + fh - 0.004; g.add(slab(-w / 2 + 0.002, a, d - 0.02, w / 2 - 0.002, b, d, fr)); if (o.knobs) { const k = knob(o.knobs); k.position.set(0, (a + b) / 2, d); g.add(k); } else if (o.handle) { const hd = handleBar(o.handle, 0.18); hd.position.set(0, b - 0.04, d); g.add(hd); } else g.add(slab(-w / 2 + 0.05, b - 0.016, d, w / 2 - 0.05, b - 0.012, d + 0.003, M.paint('#3a3330'))); }
    if (type === 'retro') for (const x of [-w / 2 + 0.04, w / 2 - 0.04]) g.add(at(cyl(0.015, 0.01, 0.12, o.legs || metal, 12), x, 0.06, d - 0.06));
    if (o.led) { const led = slab(-w / 2 + 0.03, y0 - 0.006, d - 0.07, w / 2 - 0.03, y0, d - 0.06, M.lamp(o.led, 2.8, 0), { cast: false }); g.add(led); const pl = new THREE.PointLight(o.led, 0, 1.4, 2); pl.position.set(0.3, 0.25, vz); pl.userData.on = 0.9; B.led(led, pl); }
  } else if (type === 'console') {
    const ct = o.consoleTop || body, legM = o.legs || body;
    g.add(slab(-w / 2, 0.8, 0, w / 2, 0.84, d, ct));
    for (const x of [-w / 2 + 0.03, w / 2 - 0.03]) { g.add(slab(x - 0.018, 0, d - 0.06, x + 0.018, 0.8, d - 0.024, legM)); if (o.steel) g.add(slab(x - 0.015, 0.77, 0, x + 0.015, 0.8, d - 0.02, legM)); }
    g.add(slab(-w / 2, 0.22, 0.02, w / 2, 0.245, d - 0.03, o.shelf || ct));
    (o.baskets || []).forEach((m, i, arr) => g.add(at(rbox(w / arr.length - 0.05, 0.18, d - 0.12, 0.025, m), -w / 2 + (i + 0.5) * w / arr.length, 0.335, d / 2)));
  }
  const yTop = type === 'console' ? 0.84 : 0.82;
  if (o.basin === 'vessel' || o.basin === 'round') { const vs = vessel({ w: o.basin === 'round' ? 0.4 : 0.48, d: o.basin === 'round' ? 0.4 : 0.36, h: 0.13, r: o.basin === 'round' ? undefined : (o.vr ?? 0.06), m: o.basinM || M.ceramicMatte('#f2f1ee') }); vs.position.set(0, yTop, 0.27); g.add(vs); }
  else if (o.basin === 'under') {
    g.add(at(mesh(plateGeo(w + 0.01, d + 0.01, 0.006, 0.03, { w: 0.42, d: 0.3, r: 0.06, z: 0.03 }), o.topM), 0, yTop, (d + 0.01) / 2));
    g.add(mesh(loftGeo([{ w: 0.42, d: 0.3, r: 0.06, y: yTop + 0.005, z: d / 2 + 0.035 }, { w: 0.38, d: 0.26, r: 0.06, y: yTop - 0.06, z: d / 2 + 0.04 }, { w: 0.2, d: 0.14, r: 0.05, y: yTop - 0.12, z: d / 2 + 0.045 }], { capBottom: true }), M.ceramic()));
  } else { const bs = basin({ w: w + 0.01, d: d + 0.01, h: 0.045, r: 0.02, bw: Math.min(0.46, w - 0.14), bd: 0.3, br: 0.07, bz: 0.04, m: o.basinM || M.ceramicMatte('#f4f3ef') }); bs.position.y = yTop + 0.045; g.add(bs); }
  const ft = o.faucet === 'none' ? new THREE.Group() : o.faucet === 'wall' ? faucetWall(metal, { reach: 0.22 }) : o.faucet === 'tall' ? faucetTall(metal) : faucetDeck(metal, { h: 0.15 });
  ft.position.set(0, o.faucet === 'wall' ? 1.07 : (o.basin === 'vessel' || o.basin === 'round' ? yTop : yTop + 0.045), o.faucet === 'wall' ? 0 : 0.06); g.add(ft);
  if (o.extra) o.extra(g, { w, d, yTop });
  B.add(B.mount(g, 'left', vz, 0), { name: o.name || 'Waschtisch' });
  if (type !== 'float') B.foot(0, vz - w / 2, d, vz + w / 2, 'Waschtisch');
  B.anc.vanity = [0.26, 0.98, vz];
  return g;
}
/* ---------- Spiegel ---------- */
function kMirror(B, o = {}) {
  const vz = B.lay.vz; let g, v = o.v ?? 1.55, name = o.name || 'Spiegel';
  switch (o.type) {
    case 'round': { g = new THREE.Group(); const R = o.r ?? 0.3; if (o.halo) { const hl = mesh(new THREE.RingGeometry(R - 0.02, R + 0.03, 64), M.lamp(o.halo, 2.2, 0.35), { cast: false }); hl.position.z = 0.006; g.add(hl); const ml = new THREE.PointLight(o.halo, 0, 1.2, 2); ml.position.set(0.15, v, vz); ml.userData.on = 0.5; ml.userData.day = 0.15; B.led(hl, ml); } g.add(at(cyl(R - 0.01, R - 0.01, 0.02, M.paint('#2a2724'), 64), 0, 0, 0.018)).children.at(-1).rotation.x = PI / 2; const m = makeMirror(B, new THREE.CircleGeometry(R, 64)); m.position.z = 0.03; g.add(m); const ring = mesh(new THREE.TorusGeometry(R, o.ring ?? 0.008, 8, 96), o.frame || M.black()); ring.position.z = 0.03; g.add(ring); break; }
    case 'rect': g = framedMirror(B, o.w ?? 0.5, o.h ?? 0.7, o.cr ?? 0.04, o.frame || M.black(), o.ft ?? 0.025); break;
    case 'arch': { g = new THREE.Group(); const fs = archShape((o.w ?? 0.46) + 0.04, (o.h ?? 0.9) + 0.02); fs.holes.push(archShape(o.w ?? 0.46, o.h ?? 0.9, 0.012)); g.add(mesh(new THREE.ExtrudeGeometry(fs, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 32 }), o.frame || M.brass())); const m = makeMirror(B, new THREE.ShapeGeometry(archShape((o.w ?? 0.46) + 0.004, (o.h ?? 0.9) + 0.002, 0.011), 32)); m.position.z = 0.012; g.add(m); break; }
    case 'rattan': g = rattanMirror(B, o.r ?? 0.26); break;
    case 'porthole': g = porthole(B, o.r ?? 0.25, o.frame); break;
    case 'bulbs': g = bulbMirror(B, o.w ?? 0.52, o.h ?? 0.72, o.frame); break;
    case 'wavy': g = wavyMirror(B, o.w ?? 0.5, o.h ?? 0.72, o.frame); break;
    case 'fan': g = fanMirror(B, o.w ?? 0.6, o.h ?? 0.82, o.frame); v = o.v ?? 1.15; break;
    case 'cabinet': {
      const mw = o.w ?? 0.6, mh = o.h ?? 0.72, md = 0.16, wM = o.body || M.paint('#f3f2ee');
      const cab = cabinet({ w: mw, h: mh, d: md, carcass: wM, plinth: 0, shelves: [0.26, 0.5], fronts: [{ y0: 0, y1: mh, x0: -mw / 2, x1: 0, door: 'l', mat: wM }, { y0: 0, y1: mh, x0: 0, x1: mw / 2, door: 'r', mat: wM }] });
      cab.userData.doors.forEach(({ piv, side }) => { const m = makeMirror(B, new THREE.PlaneGeometry(mw / 2 - 0.012, mh - 0.012)); m.position.set(side === 'l' ? mw / 4 : -mw / 4, 0, 0.0195); piv.add(m); if (side === 'l' && o.display) { const d = mesh(new THREE.PlaneGeometry(0.24, 0.12), std({ map: o.display, emissive: 0xffffff, emissiveMap: o.display, emissiveIntensity: 0.9, roughness: 0.2, transparent: true, opacity: 0.92 }), { cast: false }); d.position.set(mw / 4, -0.2, 0.0205); piv.add(d); } });
      if (o.led !== false) { const ledM = slab(-mw / 2 + 0.02, -0.006, md - 0.05, mw / 2 - 0.02, 0.0, md - 0.02, M.lamp('#fff1dc', 3, 0.9), { cast: false }); cab.add(ledM); const pl = new THREE.PointLight(0xfff1dc, 0, 1.3, 2); pl.position.set(0.25, 1.25, vz); pl.userData.on = 0.6; pl.userData.day = 0.25; B.led(ledM, pl); }
      cab.add(at(beardStation(o.trayM), -0.1, 0.268, 0.07)); cab.add(at(socket(), 0.17, 0.08, 0.009));
      g = new THREE.Group(); g.add(cab); v = o.v ?? 1.33;
      B.add(B.mount(g, 'left', vz, v), { name: (o.name || 'Spiegelschrank mit Licht & Steckdose') + ' · Klick zum Öffnen', click: () => openDoors(cab, 'mc' + B.key, 1.9) });
      B.anc.mirror = [0.18, v + 0.4, vz]; return g;
    }
  }
  B.add(B.mount(g, 'left', vz, v), { name });
  B.anc.mirror = [0.08, v + 0.15, vz];
  return g;
}
/* ---------- Stauraum ---------- */
function kTall(B, o = {}) { // schmaler Schrank direkt neben der Duschtasse (Wannenwand)
  const w = o.w ?? 0.32, z = B.D.L - 0.04 - w / 2, h = o.h ?? 1.8, d = Math.min(o.d ?? 0.26, B.D.W - B.door.a1 - 0.02);
  const c = cabinet({ w, h, d, carcass: o.carcass, inner: o.inner || M.paint('#efebe4'), plinth: o.plinth ?? 0.06, plinthM: o.plinthM, shelves: o.shelves || [0.95, 1.3], fronts: o.fronts || [{ y0: o.plinth ?? 0.06, y1: 0.66, mat: o.front }, { y0: 0.66, y1: h, door: 'r', mat: o.front, glass: o.glass, frameM: o.front }], handle: o.handle });
  if (o.fill) o.fill(c, { w, h, d });
  const upper = { userData: { doors: c.userData.doors.filter(dd => true) } };
  B.add(B.mount(c, 'right', z, 0), { name: (o.name || 'Hochschrank') + ' · Klick zum Öffnen', click: () => openDoors(upper, 'tall' + B.key, 1.7), tall: 'right' });
  B.foot(B.D.W - d, z - w / 2, B.D.W, z + w / 2, 'Schrank');
  B.anc.tall = [B.D.W - d / 2, 1.3, z];
  return c;
}
function kWallCab(B, o = {}) { // Hängeschrank über dem WC (Walk-in-Varianten)
  const x1 = B.win.a0 - 0.03, w = Math.min(0.56, x1 - 0.02), cx = 0.02 + w / 2, h = 0.75, d = 0.26;
  const c = cabinet({ w, h, d, carcass: o.carcass, inner: o.inner || M.paint('#efebe4'), plinth: 0, shelves: [0.36], fronts: [{ y0: 0, y1: h, x0: -w / 2, x1: 0, door: 'l', mat: o.front }, { y0: 0, y1: h, x0: 0, x1: w / 2, door: 'r', mat: o.front }], handle: o.handle });
  c.add(at(towelStack(3, w / 2 - 0.06, 0.2, o.towelM || M.fabric('linen', '#e9e2d4', '#8f846f')), -w / 4, 0.02, 0.12));
  c.add(at(tpRolls(2), w / 4, 0.02, 0.1)); c.add(at(beardStation(o.trayM), 0, 0.378, 0.12));
  if (o.led) { const l = slab(-w / 2 + 0.02, -0.006, d - 0.06, w / 2 - 0.02, 0, d - 0.03, M.lamp(o.led, 2.6, 0.1), { cast: false }); c.add(l); }
  B.add(B.mount(c, 'back', cx, 1.32, 0), { name: (o.name || 'Hängeschrank über dem WC') + ' · Klick zum Öffnen', click: () => openDoors(c, 'wcab' + B.key, 1.8) });
  B.anc.wcab = [cx, 1.7, 0.27];
  return c;
}
/* ---------- Deko ---------- */
function kRug(B, key, o, w = 0.46, l = 1.15) { B.add(at(rug(w, l, key, o), 0.9, 0.006, B.lay.tray + 0.12 + l / 2), { name: 'Teppich' }); }
function kHang(B, plant, o = {}) { const hp = hangingPlant({ len: o.len ?? 0.3, potR: o.r ?? 0.075, potM: o.potM, ropeM: o.ropeM, plant }); hp.position.set(o.x ?? (B.win.a0 + 0.02), B.D.H, o.z ?? 0.3); B.add(hp, { name: o.name || 'Hängepflanze' }); }
function kLamp(B, obj, name, z = B.D.L / 2) { obj.position.set(B.D.W / 2, B.D.H, z); B.add(obj, { ceil: true, name }); }
function kFan(B) { B.add(B.mount(exhaustFan(), 'left', 0.14, 2.12), { wall: 'left', name: 'Lüfter' }); }
function kZones(B) {
  const { W, L } = B.D, { wcX, vz } = B.lay;
  B.zone('WC', Math.max(0.02, wcX - 0.4), 0.66, Math.min(wcX + 0.4, W - (B.walkin ? 0.8 : B.lay.tray) - 0.02), 1.41);
  B.zone('Dusche', W - 0.8, (B.walkin ? 1.2 : B.lay.tray) + 0.02, W, (B.walkin ? 1.2 : B.lay.tray) + 0.77);
  B.zone('Waschtisch', 0.48, Math.max(0, vz - 0.45), 1.23, Math.min(L, vz + 0.45));
}
function archShape(w, h, cy = 0) { const s = new THREE.Shape(), r = w / 2; s.moveTo(-r, cy); s.lineTo(r, cy); s.lineTo(r, cy + h - r); s.absarc(0, cy + h - r, r, 0, PI, false); s.lineTo(-r, cy); return s; }
