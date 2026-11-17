/* =====================================================================
   OBJEKT-BIBLIOTHEK
   Wandobjekte: Rückseite bei z=0, ragen nach +z in den Raum, x entlang Wand.
   ===================================================================== */

/* ---------- Sanitär ---------- */
function toilet({ wall = false, seat = null, cer = M.ceramic() } = {}) {
  const g = new THREE.Group();
  const y0 = wall ? 0.22 : 0.0, top = wall ? 0.425 : 0.385;
  if (wall) g.add(rslab(-0.17, y0 + 0.01, 0, 0.17, top - 0.004, 0.2, 0.05, cer));
  else g.add(rslab(-0.165, 0, 0, 0.165, top - 0.004, 0.22, 0.05, cer));
  const lev = wall
    ? [{ w: 0.355, d: 0.5, r: 0.17, y: top, z: 0.31 }, { w: 0.34, d: 0.47, r: 0.165, y: top - 0.06, z: 0.31 }, { w: 0.3, d: 0.4, r: 0.14, y: y0 + 0.05, z: 0.29 }, { w: 0.25, d: 0.33, r: 0.12, y: y0, z: 0.27 }]
    : [{ w: 0.355, d: 0.5, r: 0.17, y: top, z: 0.33 }, { w: 0.335, d: 0.465, r: 0.16, y: top - 0.07, z: 0.33 }, { w: 0.26, d: 0.36, r: 0.12, y: 0.17, z: 0.31 }, { w: 0.215, d: 0.3, r: 0.1, y: 0.05, z: 0.3 }, { w: 0.235, d: 0.33, r: 0.11, y: 0.0, z: 0.3 }];
  g.add(mesh(loftGeo(lev, { capBottom: wall }), cer));
  const zc = lev[0].z;
  g.add(at(mesh(plateGeo(0.355, 0.5, 0.17, 0.014, { w: 0.27, d: 0.37, r: 0.13 }), cer), 0, top - 0.002, zc));
  g.add(mesh(loftGeo([{ w: 0.27, d: 0.37, r: 0.13, y: top + 0.004, z: zc }, { w: 0.22, d: 0.29, r: 0.1, y: top - 0.07, z: zc + 0.01 }, { w: 0.12, d: 0.13, r: 0.06, y: top - 0.17, z: zc + 0.05 }], { capBottom: true }), cer));
  const water = at(mesh(new THREE.CircleGeometry(0.068, 32), M.water(), { cast: false }), 0, top - 0.15, zc + 0.045);
  water.rotation.x = -PI / 2; water.scale.set(1, 1.25, 1); g.add(water);
  const sm = seat || cer, sy = top + 0.012;
  g.add(at(mesh(plateGeo(0.36, 0.45, 0.17, 0.022, { w: 0.225, d: 0.285, r: 0.11, z: 0.01 }), sm), 0, sy, zc + 0.015));
  const lid = new THREE.Group(); lid.position.set(0, sy + 0.023, 0.1);
  lid.add(at(mesh(plateGeo(0.355, 0.44, 0.17, 0.018), sm), 0, 0, zc + 0.015 - 0.1));
  g.add(lid);
  const hm = M.chrome();
  g.add(at(cyl(0.011, 0.011, 0.03, hm), -0.085, sy + 0.012, 0.1), at(cyl(0.011, 0.011, 0.03, hm), 0.085, sy + 0.012, 0.1));
  g.userData.lid = lid;
  return g;
}
function flushPlate(m, btn, round = false) {
  const g = new THREE.Group(), b = btn || m;
  g.add(at(rbox(0.245, 0.165, 0.012, 0.006, m), 0, 0, 0.006));
  if (round) { for (const [x, r] of [[-0.045, 0.034], [0.05, 0.026]]) { const c = cyl(r, r, 0.01, b, 32); c.rotation.x = PI / 2; c.position.set(x, 0, 0.014); g.add(c); } }
  else { g.add(at(rbox(0.105, 0.125, 0.006, 0.004, b), -0.056, 0, 0.0135), at(rbox(0.105, 0.125, 0.006, 0.004, b), 0.056, 0, 0.0135)); }
  return g;
}
function bathtub({ w = 0.75, l = 1.6, h = 0.56, rimMat = M.ceramic(), innerMat = M.ceramic(), apronMat = M.ceramic(), worldApron = false } = {}) {
  const g = new THREE.Group(), rim = 0.065, hw = w - 2 * rim, hl = l - 2 * rim;
  g.add(at(mesh(plateGeo(w, l, 0.012, 0.035, { w: hw, d: hl, r: 0.11 }, 0.008), rimMat), 0, h - 0.035, l / 2));
  g.add(at(mesh(loftGeo([{ w: hw, d: hl, r: 0.11, y: 0 }, { w: hw - 0.025, d: hl - 0.04, r: 0.12, y: -0.12 }, { w: hw - 0.09, d: hl - 0.16, r: 0.13, y: -0.3 }, { w: hw - 0.15, d: hl - 0.34, r: 0.11, y: -0.39 }], { capBottom: true }), innerMat), 0, h - 0.006, l / 2));
  const S = worldApron ? slabW : slab;
  g.add(S(-w / 2, 0, 0, -w / 2 + 0.025, h - 0.035, l, apronMat));
  g.add(S(-w / 2, 0, l - 0.025, w / 2, h - 0.035, l, apronMat));
  g.add(at(cyl(0.032, 0.032, 0.004, M.chrome()), 0, h - 0.394, 0.42));
  const ov = cyl(0.03, 0.03, 0.006, M.chrome()); ov.rotation.x = PI / 2; ov.position.set(0, h - 0.12, rim + 0.012); g.add(ov);
  return g;
}
function basin({ w = 0.5, d = 0.42, h = 0.06, r = 0.04, bw = 0.4, bd = 0.3, br = 0.1, bz = 0.03, depth = 0.13, m = M.ceramic(), cap = false } = {}) {
  const g = new THREE.Group();
  g.add(mesh(loftGeo([{ w, d, r, y: -0.008, z: d / 2 }, { w: w - 0.006, d: d - 0.006, r, y: -h, z: d / 2 }], { capBottom: cap }), m));
  g.add(at(mesh(plateGeo(w, d, r, 0.012, { w: bw, d: bd, r: br, z: bz }), m), 0, -0.012, d / 2));
  g.add(mesh(loftGeo([{ w: bw, d: bd, r: br, y: -0.006, z: d / 2 + bz }, { w: bw - 0.04, d: bd - 0.05, r: br, y: -depth * 0.55, z: d / 2 + bz + 0.005 }, { w: bw * 0.45, d: bd * 0.42, r: br * 0.6, y: -depth, z: d / 2 + bz + 0.01 }], { capBottom: true }), m));
  g.add(at(cyl(0.02, 0.02, 0.004, M.chrome()), 0, -depth + 0.004, d / 2 + bz + 0.012));
  return g;
}
function vessel({ w = 0.46, d = 0.34, h = 0.13, m }) { // auf Platte, y 0..h, zentriert
  const g = new THREE.Group(), r = Math.min(w, d) / 2;
  g.add(mesh(loftGeo([{ w, d, r, y: h }, { w: w * 0.985, d: d * 0.985, r: r * 0.985, y: h * 0.62 }, { w: w * 0.84, d: d * 0.8, r: r * 0.8, y: 0.012 }, { w: w * 0.8, d: d * 0.76, r: r * 0.76, y: 0 }], { capBottom: true }), m));
  g.add(at(mesh(plateGeo(w, d, r, 0.008, { w: w - 0.026, d: d - 0.026, r: r - 0.013 }), m), 0, h - 0.008, 0));
  g.add(mesh(loftGeo([{ w: w - 0.026, d: d - 0.026, r: r - 0.013, y: h - 0.002 }, { w: w * 0.8, d: d * 0.74, r: r * 0.74, y: h * 0.45 }, { w: w * 0.4, d: d * 0.36, r: r * 0.36, y: 0.03 }], { capBottom: true }), m));
  g.add(at(cyl(0.02, 0.02, 0.004, M.black()), 0, 0.033, 0));
  return g;
}
function faucetDeck(m, { h = 0.17, reach = 0.12 } = {}) {
  const g = new THREE.Group();
  g.add(at(cyl(0.027, 0.029, 0.012, m), 0, 0.006, 0), at(cyl(0.021, 0.023, h, m), 0, h / 2, 0));
  g.add(rod([0, h - 0.03, 0], [0, h - 0.03, reach], 0.012, m));
  g.add(at(cyl(0.013, 0.013, 0.014, m), 0, h - 0.042, reach - 0.006));
  const lv = rbox(0.014, 0.012, 0.075, 0.005, m); lv.position.set(0, h + 0.014, -0.025); lv.rotation.x = 0.22; g.add(lv);
  g.add(at(cyl(0.02, 0.021, 0.02, m), 0, h + 0.006, 0));
  return g;
}
function faucetTall(m) {
  const g = new THREE.Group();
  g.add(at(cyl(0.028, 0.03, 0.012, m), 0, 0.006, 0), at(cyl(0.017, 0.019, 0.25, m), 0, 0.125, 0));
  g.add(tube([[0, 0.24, 0], [0, 0.31, 0.02], [0, 0.315, 0.09], [0, 0.27, 0.14]], 0.011, m, 32));
  g.add(at(cyl(0.012, 0.012, 0.012, m), 0, 0.265, 0.14));
  const lv = rod([0.02, 0.17, 0], [0.085, 0.19, 0], 0.006, m); g.add(lv);
  g.add(at(cyl(0.019, 0.019, 0.03, m), 0.02, 0.17, 0));
  return g;
}
function faucetWall(m, { reach = 0.2 } = {}) {
  const g = new THREE.Group();
  const ro = cyl(0.03, 0.03, 0.008, m, 32); ro.rotation.x = PI / 2; ro.position.z = 0.004; g.add(ro);
  g.add(rod([0, 0, 0], [0, 0, reach], 0.011, m));
  const r2 = cyl(0.028, 0.028, 0.008, m, 32); r2.rotation.x = PI / 2; r2.position.set(0, 0.11, 0.004); g.add(r2);
  g.add(rod([0, 0.11, 0], [0, 0.11, 0.05], 0.012, m), rod([0, 0.11, 0.05], [0, 0.17, 0.06], 0.006, m));
  return g;
}

/* ---------- Möbel ---------- */
const WOOD = {
  oakLight: { base: '#d9bf95', dark: '#a8835a', light: '#ead6b3', seed: 4, figure: true, rough: 0.6 },
  oak: { base: '#c79d68', dark: '#8f6436', light: '#dcb98a', seed: 9, figure: true, rough: 0.55 },
  walnut: { base: '#5d3a24', dark: '#2f1b10', light: '#7c5235', seed: 13, figure: true, contrast: 0.22, rough: 0.45 },
  door: { base: '#b0592e', dark: '#7a3417', light: '#c9774a', seed: 21, figure: true, rough: 0.5, contrast: 0.2 },
  doorLight: { base: '#d5b88d', dark: '#a7845a', light: '#e6d1ae', seed: 22, figure: true, rough: 0.55 },
  teak: { base: '#9a6a3c', dark: '#5f3b1c', light: '#b98a58', seed: 31, rough: 0.6 },
};
function handleBar(m, len = 0.12, vertical = false) {
  const g = new THREE.Group();
  const a = vertical ? [0, -len / 2, 0.022] : [-len / 2, 0, 0.022], b = vertical ? [0, len / 2, 0.022] : [len / 2, 0, 0.022];
  g.add(rod(a, b, 0.006, m));
  const p1 = vertical ? [0, -len / 2 + 0.01, 0] : [-len / 2 + 0.01, 0, 0], p2 = vertical ? [0, len / 2 - 0.01, 0] : [len / 2 - 0.01, 0, 0];
  g.add(rod(p1, [p1[0], p1[1], 0.022], 0.005, m), rod(p2, [p2[0], p2[1], 0.022], 0.005, m));
  return g;
}
function vanityBestand() {
  const g = new THREE.Group(), W_ = 0.62, D = 0.4, H = 0.8;
  const white = M.paint('#f2f1ec'), oak = M.wood('oakLight', WOOD.oakLight), ch = M.chrome();
  g.add(slab(-W_ / 2 + 0.018, 0.06, 0, W_ / 2 - 0.018, 0.68, D - 0.02, white), slab(-W_ / 2 + 0.018, 0.68, 0, W_ / 2 - 0.018, H - 0.026, 0.016, white));
  g.add(slab(-W_ / 2, 0, 0, -W_ / 2 + 0.018, H - 0.026, D, oak), slab(W_ / 2 - 0.018, 0, 0, W_ / 2, H - 0.026, D, oak));
  g.add(at(mesh(plateGeo(W_ + 0.012, D + 0.012, 0.004, 0.026, { w: 0.4, d: 0.29, r: 0.09, z: 0.054 }, 0.002), oak), 0, H - 0.026, (D + 0.012) / 2));
  g.add(slab(-W_ / 2 + 0.018, 0, 0.03, W_ / 2 - 0.018, 0.06, D - 0.05, M.paint('#cfccc4')));
  const fr = (x0, x1, y0, y1) => g.add(slab(x0 + 0.002, y0 + 0.002, D - 0.019, x1 - 0.002, y1 - 0.002, D, white));
  fr(-0.292, 0.0, 0.065, H - 0.03);
  const hd = handleBar(ch, 0.1, true); hd.position.set(-0.03, 0.55, D); g.add(hd);
  [[0.065, 0.31], [0.31, 0.54], [0.54, H - 0.03]].forEach(([a, b]) => { fr(0.0, 0.292, a, b); const h = handleBar(ch, 0.1); h.position.set(0.146, b - 0.05, D); g.add(h); });
  return g;
}
function cabinet({ w, h, d, carcass, inner, plinth = 0.06, plinthM, fronts, handle, shelves = [], gap = 0.003, frontT = 0.019 }) {
  // Rückseite z=0, x zentriert, y 0..h. fronts: [{y0,y1,x0?,x1?,door:'l'|'r'|null,mat,glass,frameM}]
  const g = new THREE.Group(), t = 0.018, inM = inner || carcass, dd = d - frontT;
  g.add(slab(-w / 2, plinth, 0, -w / 2 + t, h, dd, carcass), slab(w / 2 - t, plinth, 0, w / 2, h, dd, carcass));
  g.add(slab(-w / 2, h - t, 0, w / 2, h, dd, carcass), slab(-w / 2, plinth, 0, w / 2, plinth + t, dd, carcass));
  g.add(slab(-w / 2 + t, plinth, 0, w / 2 - t, h - t, 0.008, inM));
  shelves.forEach(y => g.add(slab(-w / 2 + t, y - t / 2, 0.008, w / 2 - t, y + t / 2, dd - 0.012, inM)));
  if (plinth > 0) g.add(slab(-w / 2 + 0.02, 0, 0, w / 2 - 0.02, plinth, dd - 0.04, plinthM || M.paint('#33312e')));
  const doors = [];
  fronts.forEach(f => {
    const x0 = f.x0 ?? -w / 2, x1 = f.x1 ?? w / 2, fw = x1 - x0 - gap, fh = f.y1 - f.y0 - gap;
    const piv = new THREE.Group(), side = f.door;
    piv.position.set(side === 'r' ? x1 - gap / 2 : side === 'l' ? x0 + gap / 2 : (x0 + x1) / 2, (f.y0 + f.y1) / 2, dd);
    const cx = side === 'r' ? -fw / 2 : side === 'l' ? fw / 2 : 0;
    if (f.glass) {
      const fm = f.frameM || f.mat, b = 0.038;
      piv.add(slab(cx - fw / 2, -fh / 2, 0, cx + fw / 2, -fh / 2 + b, frontT, fm), slab(cx - fw / 2, fh / 2 - b, 0, cx + fw / 2, fh / 2, frontT, fm));
      piv.add(slab(cx - fw / 2, -fh / 2, 0, cx - fw / 2 + b, fh / 2, frontT, fm), slab(cx + fw / 2 - b, -fh / 2, 0, cx + fw / 2, fh / 2, frontT, fm));
      piv.add(slab(cx - fw / 2 + b, -fh / 2 + b, frontT * 0.4, cx + fw / 2 - b, fh / 2 - b, frontT * 0.4 + 0.004, M.glass(), { cast: false }));
    } else {
      const fm = box(fw, fh, frontT, f.mat); fm.castShadow = fm.receiveShadow = true; fm.position.set(cx, 0, frontT / 2); piv.add(fm);
    }
    if (handle) { const hd = handle(fw, fh, f); if (hd) { hd.position.x += cx; hd.position.z += frontT; piv.add(hd); } }
    g.add(piv); if (side) doors.push({ piv, side });
  });
  g.userData.doors = doors;
  return g;
}
function openDoors(g, key, amt = 1.75, dur = 900) {
  const ds = g.userData.doors || [];
  return toggle(g, key, { a: 0, b: 1, dur, fn: v => ds.forEach(({ piv, side }) => { piv.rotation.y = (side === 'r' ? 1 : -1) * amt * v; }) });
}
function knob(m, r = 0.013) { const g = new THREE.Group(); g.add(rod([0, 0, 0], [0, 0, 0.018], 0.005, m)); g.add(at(sph(r, m, 16), 0, 0, 0.024)); return g; }

/* ---------- Spiegel ---------- */
const MIRROR_BG = new THREE.Color(0xd3d5d0);
function makeMirror(B, geo) {
  const s = LOWQ ? 512 : 1024;
  const r = new Reflector(geo, { textureWidth: s, textureHeight: s, color: 0xa3a8a8, clipBias: 0.003 });
  const orig = r.onBeforeRender; // leerer Raum hinter ausgeblendeten Wänden: neutral statt schwarz spiegeln
  r.onBeforeRender = function (rd, sc, cam) { const bg = sc.background; sc.background = MIRROR_BG; orig.call(this, rd, sc, cam); sc.background = bg; };
  r.userData.name = 'Spiegel'; B.mirrors.push(r); return r;
}
function mirrorCabBestand(B) {
  const g = new THREE.Group(), W_ = 0.56, H_ = 0.62, D = 0.15, wM = M.paint('#f4f3ef');
  const lo = -0.2;
  g.add(slab(-W_ / 2, lo, 0, W_ / 2, H_, 0.012, wM));
  g.add(slab(-W_ / 2, lo, 0, -W_ / 2 + 0.016, H_, D, wM), slab(W_ / 2 - 0.016, lo, 0, W_ / 2, H_, D, wM));
  g.add(slab(-W_ / 2, H_ - 0.016, 0, W_ / 2, H_, D, wM), slab(-W_ / 2, -0.016, 0, W_ / 2, 0, D, wM), slab(-W_ / 2, lo, 0, W_ / 2, lo + 0.016, D, wM));
  // Türen
  g.add(slab(-W_ / 2, 0.002, D, W_ / 2, H_ - 0.002, D + 0.018, wM));
  const mir = makeMirror(B, new THREE.PlaneGeometry(W_ / 2 - 0.05, H_ - 0.07));
  const mir2 = makeMirror(B, new THREE.PlaneGeometry(W_ / 2 - 0.05, H_ - 0.07));
  mir.position.set(-W_ / 4 - 0.002, H_ / 2, D + 0.0185); mir2.position.set(W_ / 4 + 0.002, H_ / 2, D + 0.0185);
  g.add(mir, mir2);
  g.add(slab(-0.002, 0.002, D + 0.018, 0.002, H_ - 0.002, D + 0.02, M.paint('#d8d6d0')));
  // Kram unten + oben
  const cup = lathe([[0, 0], [0.032, 0], [0.034, 0.1], [0.031, 0.1], [0.029, 0.004], [0, 0.004]], M.glassTint('#d9e6e6'));
  cup.position.set(-0.15, lo + 0.016, 0.07); g.add(cup);
  for (let i = 0; i < 3; i++) g.add(rod([-0.15 + (i - 1) * 0.012, lo + 0.05, 0.07], [-0.15 + (i - 1) * 0.02, lo + 0.19, 0.07 + (i - 1) * 0.01], 0.004, M.paint(['#2b6cb0', '#e8e8e8', '#2c2c2c'][i])));
  g.add(at(rbox(0.07, 0.04, 0.06, 0.012, M.blackPlastic()), 0.1, lo + 0.036, 0.06));
  g.add(at(cyl(0.035, 0.035, 0.17, M.blackPlastic()), 0.14, H_ + 0.085, 0.07));
  g.add(at(rbox(0.11, 0.035, 0.04, 0.01, M.paint('#e7c23b')), -0.08, H_ + 0.018, 0.06));
  return g;
}

/* ---------- Heizkörper ---------- */
function ladderRadiator({ w = 0.5, h = 1.6, m = M.paint('#f4f4f1'), groups = [5, 5, 5, 4], valve = true, valveM } = {}) {
  const parts = [], zc = 0.055, gap = 0.11;
  parts.push(at(cyl(0.016, 0.016, h, m, 16), -w / 2, h / 2, zc), at(cyl(0.016, 0.016, h, m, 16), w / 2, h / 2, zc));
  const total = groups.reduce((a, n) => a + n, 0);
  const sp = (h - 0.08 - (groups.length - 1) * gap) / (total - groups.length);
  let y = 0.04;
  groups.forEach((n) => { for (let i = 0; i < n; i++) { const bar = cyl(0.011, 0.011, w, m, 12); bar.rotation.z = PI / 2; bar.position.set(0, y, zc); parts.push(bar); if (i < n - 1) y += sp; } y += gap; });
  const g = new THREE.Group(); g.add(mergeInto(parts, m));
  for (const yy of [0.3, h - 0.25]) for (const xx of [-w / 2, w / 2]) g.add(rod([xx, yy, 0], [xx, yy, zc], 0.007, M.steel()));
  if (valve) {
    const vm = valveM || M.chrome();
    g.add(at(cyl(0.012, 0.012, 0.06, vm), w / 2, -0.03, zc), at(cyl(0.012, 0.012, 0.06, vm), -w / 2, -0.03, zc));
    const th = cyl(0.024, 0.024, 0.07, M.whitePlastic()); th.rotation.z = PI / 2; th.position.set(w / 2 + 0.05, -0.055, zc); g.add(th);
  }
  g.userData.bars = { zc };
  return g;
}

/* ---------- Textilien ---------- */
function towelOver({ w = 0.5, front = 0.55, back = 0.45, r = 0.018, m, wave = 0.012, seed = 1 }) {
  const segW = 16, segL = 48, total = front + PI * r + back;
  const g = new THREE.PlaneGeometry(w, total, segW, segL), p = g.attributes.position, rnd = rng(seed);
  const ph = rnd() * 6, ph2 = rnd() * 6;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), s = total / 2 - p.getY(i);
    let y, z;
    if (s < front) { y = -(front - s); z = r; }
    else if (s < front + PI * r) { const a = (s - front) / r; y = Math.sin(a) * r; z = Math.cos(a) * r; }
    else { y = -(s - front - PI * r); z = -r; }
    const dpt = Math.min(1, Math.max(0, -y) * 3);
    const wv = (Math.sin(x * 23 + ph) + Math.sin(x * 9 + ph2) * 0.6) * wave * dpt;
    z += Math.sign(z || 1) * (Math.abs(wv) * 0.5 + 0.004 * dpt) + wv * 0.5;
    p.setXYZ(i, x * (1 - dpt * 0.03), y, z);
  }
  g.computeVertexNormals();
  return mesh(g, m);
}
function clothHang({ w = 0.3, h = 0.5, pinch = 0.25, m, seed = 2, wave = 0.016 }) {
  const g = new THREE.PlaneGeometry(w, h, 12, 26), p = g.attributes.position, rnd = rng(seed), ph = rnd() * 6;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), t = clamp((h / 2 - p.getY(i)) / h, 0, 1);
    const xs = x * (pinch + (1 - pinch) * Math.min(1, Math.pow(t * 2.2, 0.6)));
    const z = 0.012 + Math.sin(x * 30 + ph) * wave * t + t * 0.012 + Math.abs(Math.sin(x * 12 + ph)) * 0.01 * t;
    p.setXYZ(i, xs, -t * h, z);
  }
  g.computeVertexNormals();
  return mesh(g, m);
}
function curtainMesh({ flat = 1.8, h = 1.5, folds = 26, span = 0.3 }) {
  const g = new THREE.PlaneGeometry(flat, h, 160, 18);
  const p = g.attributes.position, orig = new Float32Array(p.array);
  g.userData = { orig, flat, h, folds };
  const m = mat('curtain', () => std({ map: curtainTex(), roughness: 0.75, side: THREE.DoubleSide, envMapIntensity: 0.3 }));
  const o = mesh(g, m); setCurtain(o, span); return o;
}
function setCurtain(o, span) { // lokal: X entlang Stange (0..span), Y nach unten, Z Falten
  const g = o.geometry, { orig, flat, h, folds } = g.userData, p = g.attributes.position;
  const lam = flat / folds, ratio = clamp(span / flat, 0.05, 1);
  const A = (lam / PI) * Math.sqrt(Math.max(0, 1 - ratio * ratio)) * 0.85;
  for (let i = 0; i < p.count; i++) {
    const xf = orig[i * 3], yf = orig[i * 3 + 1], t = (h / 2 - yf) / h;
    const X = ((xf + flat / 2) / flat) * span * (1 + t * 0.04) - span * t * 0.02;
    const Z = A * Math.sin((2 * PI * (xf + flat / 2)) / lam) * (1 + t * 0.25);
    p.setXYZ(i, X, -t * h, Z);
  }
  p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
}
function bathMat(w, d, hex, key) {
  const m = mat('mat' + key, () => std({ map: furTex(key, hex), bumpMap: furTex(key, hex), bumpScale: 2, roughness: 1, envMapIntensity: 0.15 }));
  return rbox(w, 0.02, d, 0.009, m);
}
function rug(w, d, key, o) {
  const m = mat('rug' + key, () => std({ map: rugTex(key, o), roughness: 0.95, envMapIntensity: 0.2 }));
  return rbox(w, 0.012, d, 0.005, m);
}

/* ---------- Dusche Bestand ---------- */
function showerSetBestand({ rail = M.chrome(), hand = rail, hose = M.steel(), scrub = true } = {}) {
  const g = new THREE.Group(), c = M.chrome(), rc = rail;
  g.add(rod([0, 1.18, 0.035], [0, 2.0, 0.035], 0.011, rc));
  for (const y of [1.18, 2.0]) g.add(rod([0, y, 0], [0, y, 0.035], 0.008, rc), at((() => { const k = cyl(0.022, 0.022, 0.01, rc); k.rotation.x = PI / 2; return k; })(), 0, y, 0.005));
  g.add(at(rbox(0.04, 0.05, 0.05, 0.01, rc), 0, 1.86, 0.045));
  const handG = new THREE.Group(); handG.position.set(0, 1.86, 0.07);
  handG.add(at(rbox(0.032, 0.17, 0.026, 0.012, hand), 0, 0.03, 0.0));
  const head = rbox(0.12, 0.12, 0.022, 0.012, hand); head.position.set(0, 0.17, 0.03); head.rotation.x = -0.5; handG.add(head);
  const face = box(0.1, 0.1, 0.002, M.paint('#9aa0a2')); face.position.set(0, 0.174, 0.043); face.rotation.x = -0.5; handG.add(face);
  g.add(handG);
  // Aufputz-Mischer
  const mix = new THREE.Group(); mix.position.set(0.3, 1.05, 0);
  for (const x of [-0.075, 0.075]) { const ro = cyl(0.03, 0.03, 0.01, c, 28); ro.rotation.x = PI / 2; ro.position.set(x, 0, 0.005); mix.add(ro); mix.add(rod([x, 0, 0], [x, 0, 0.05], 0.012, c)); }
  const body = cyl(0.026, 0.026, 0.19, c); body.rotation.z = PI / 2; body.position.set(0, 0, 0.06); mix.add(body);
  const lv = rbox(0.022, 0.016, 0.1, 0.006, c); lv.position.set(0.0, 0.03, 0.09); lv.rotation.x = -0.35; mix.add(lv);
  mix.add(at(cyl(0.012, 0.012, 0.035, M.paint('#b9d34a')), 0.02, 0.03, 0.1));
  mix.add(rod([0, -0.02, 0.06], [0, -0.05, 0.06], 0.011, c));
  g.add(mix);
  g.add(tube([[0.3, 0.99, 0.06], [0.3, 0.82, 0.08], [0.2, 0.68, 0.1], [0.06, 0.74, 0.1], [0.0, 1.0, 0.085], [0.0, 1.5, 0.07], [0.0, 1.79, 0.07]], 0.009, hose, 90));
  if (!scrub) return g;
  const scrubM = clothHang({ w: 0.11, h: 0.5, pinch: 0.7, m: M.fabric('scrub', '#4b4f4d'), seed: 4 });
  scrubM.position.set(0, 1.25, 0.04); g.add(scrubM);
  return g;
}
function wireBasket(items) { // lokal: x 0..0.4, Boden y=0, z 0..0.12
  const g = new THREE.Group(), m = M.paint('#efefeb'), parts = [], W_ = 0.4, D = 0.12, H = 0.09, r = 0.0028;
  const R = (a, b) => parts.push(rod(a, b, r, m, 6));
  for (const y of [0.002, H]) { R([0, y, D], [W_, y, D]); R([W_, y, 0.005], [W_, y, D]); R([0, y, 0.005], [W_, y, 0.005]); }
  for (let x = 0.01; x < W_; x += 0.025) { R([x, 0.002, 0.005], [x, 0.002, D]); R([x, 0.002, D], [x, H, D]); }
  for (let z = 0.03; z < D; z += 0.03) R([0, 0.002, z], [W_, 0.002, z]);
  g.add(mergeInto(parts, m));
  if (items) g.add(items);
  return g;
}
function bottle({ r = 0.025, h = 0.18, c = '#ffffff', cap = '#222222', flat = false, pump = false, gloss = 0.3 }) {
  const g = new THREE.Group(), m = mat('btl' + c + gloss, () => phys({ color: c, roughness: gloss, clearcoat: 0.6, envMapIntensity: 0.7 })), cm = M.paint(cap);
  if (flat) { g.add(at(rbox(r * 2.4, h, r * 1.3, r * 0.5, m), 0, h / 2, 0)); g.add(at(rbox(r * 1.4, 0.03, r * 0.9, 0.006, cm), 0, h + 0.012, 0)); }
  else {
    g.add(lathe([[0, 0], [r * 0.9, 0], [r, 0.01], [r, h * 0.78], [r * 0.55, h * 0.94], [r * 0.4, h], [0, h]], m, 24));
    g.add(at(cyl(r * 0.45, r * 0.45, 0.028, cm, 16), 0, h + 0.012, 0));
    if (pump) { g.add(at(cyl(r * 0.14, r * 0.14, 0.04, cm, 10), 0, h + 0.045, 0)); g.add(rod([0, h + 0.06, 0], [0, h + 0.06, 0.04], 0.005, cm)); }
  }
  return g;
}
function bottlesRow(specs, spacing = 0.06) {
  const g = new THREE.Group(); let x = 0;
  specs.forEach(s => { const b = bottle(s); b.position.x = x; x += spacing; g.add(b); });
  return g;
}
function ovalCaddy() { // lokal zentriert x, y 0..1.05
  const g = new THREE.Group(), st = M.chrome(), gl = M.glass();
  const pts = [], hw = 0.12, y0 = 0.12, y1 = 0.93;
  for (let i = 0; i <= 16; i++) { const a = PI + (i / 16) * PI; pts.push([Math.cos(a) * hw, y0 + Math.sin(a) * hw, 0.03]); }
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * PI; pts.push([Math.cos(a) * hw, y1 + Math.sin(a) * hw, 0.03]); }
  g.add(tube(pts, 0.008, st, 120, true, 0.1));
  g.add(rod([0, 1.05, 0], [0, 1.05, 0.03], 0.008, st), rod([0, 0.0, 0], [0, 0.0, 0.03], 0.008, st));
  for (const y of [0.86, 0.62, 0.36]) { g.add(at(mesh(plateGeo(0.25, 0.12, 0.04, 0.008), gl, { cast: false }), 0, y, 0.09)); g.add(rod([-hw, y + 0.004, 0.03], [-hw + 0.02, y + 0.004, 0.08], 0.004, st), rod([hw, y + 0.004, 0.03], [hw - 0.02, y + 0.004, 0.08], 0.004, st)); }
  const b1 = bottlesRow([{ r: 0.016, h: 0.07, c: '#2f6b5a', cap: '#d9d9d4' }, { r: 0.015, h: 0.06, c: '#f2efe6', cap: '#333' }], 0.045); b1.position.set(-0.04, 0.868, 0.09); g.add(b1);
  g.add(at(lathe([[0, 0], [0.07, 0], [0.075, 0.05], [0.0, 0.07]], M.paint('#f3eee4'), 24), 0.02, 0.628, 0.09));
  g.add(at(rbox(0.035, 0.04, 0.03, 0.01, M.paint('#c98a4b')), 0.06, 0.648, 0.08));
  g.add(at(rbox(0.2, 0.08, 0.1, 0.01, M.fabric('wick', '#efe7d6')), 0, 0.408, 0.09));
  g.add(at(cyl(0.01, 0.01, 0.03, st), 0, 0.0, 0.05));
  return g;
}

/* ---------- Türen & Fenster ---------- */
function doorUnit(B, { a0, a1, h = 2.01, leafMat, innerMat, frameMat, handleMat = M.chrome(), grille = true }) {
  const { L } = B.D, T = B.T, g = new THREE.Group();
  const fm = frameMat || leafMat;
  g.add(slab(a0, 0, L, a0 + 0.012, h, L + T, fm), slab(a1 - 0.012, 0, L, a1, h, L + T, fm), slab(a0, h - 0.012, L, a1, h, L + T, fm));
  g.add(slab(a0 - 0.065, 0, L - 0.012, a0, h + 0.065, L, fm), slab(a1, 0, L - 0.012, a1 + 0.065, h + 0.065, L, fm), slab(a0 - 0.065, h, L - 0.012, a1 + 0.065, h + 0.065, L, fm));
  const lw = a1 - a0 - 0.028, lh = h - 0.018;
  const piv = new THREE.Group(); piv.position.set(a0 + 0.013, 0.006, L + 0.002);
  const leaf = box(lw, lh, 0.04, [leafMat, leafMat, leafMat, leafMat, leafMat, innerMat || leafMat]);
  leaf.castShadow = leaf.receiveShadow = true; leaf.position.set(lw / 2, lh / 2, 0.02); piv.add(leaf);
  // Drücker
  const hx = lw - 0.075, hy = 1.04;
  const ros = cyl(0.026, 0.026, 0.01, handleMat, 28); ros.rotation.x = PI / 2; ros.position.set(hx, hy, -0.005); piv.add(ros);
  piv.add(rod([hx, hy, -0.005], [hx, hy, -0.05], 0.009, handleMat), rod([hx, hy, -0.05], [hx - 0.13, hy, -0.055], 0.01, handleMat));
  const key = cyl(0.016, 0.016, 0.008, handleMat, 20); key.rotation.x = PI / 2; key.position.set(hx, hy - 0.17, -0.004); piv.add(key);
  if (grille) {
    piv.add(at(box(0.44, 0.1, 0.004, M.paint('#3a2a20')), lw / 2, 0.14, -0.001));
    for (let i = 0; i < 6; i++) piv.add(at(box(0.44, 0.008, 0.008, leafMat === innerMat || !innerMat ? leafMat : innerMat), lw / 2, 0.1 + i * 0.016, -0.004));
  }
  for (const y of [0.25, 1.75]) g.add(at(cyl(0.008, 0.008, 0.09, handleMat), a0 + 0.006, y, L - 0.004));
  g.add(piv);
  named(g, 'Tür · Klick zum Öffnen', { click: () => toggle(piv, 'door', { prop: 'rotation.y', a: 0, b: 1.3, dur: 900 }) });
  return g;
}
function windowUnit(B, { a0, a1, v0, v1, frameMat = M.whitePlastic(), sillMat }) {
  const g = new THREE.Group(), p = 0.068, z0 = -0.1, z1 = -0.035;
  g.add(slab(a0, v0, z0, a1, v0 + p, z1, frameMat), slab(a0, v1 - p, z0, a1, v1, z1, frameMat), slab(a0, v0, z0, a0 + p, v1, z1, frameMat), slab(a1 - p, v0, z0, a1, v1, z1, frameMat));
  const piv = new THREE.Group(); piv.position.set(0, v0 + p * 0.6, z1);
  const sp = 0.06, sx0 = a0 + p - 0.012, sx1 = a1 - p + 0.012, sy0 = v0 + p - 0.012, sy1 = v1 - p + 0.012, by = sy0 - (v0 + p * 0.6);
  const S = (x0, y0, x1, y1) => piv.add(slab(x0, y0, 0, x1, y1, 0.055, frameMat));
  S(sx0, by, sx1, by + sp); S(sx0, sy1 - (v0 + p * 0.6) - sp, sx1, sy1 - (v0 + p * 0.6)); S(sx0, by, sx0 + sp, sy1 - (v0 + p * 0.6)); S(sx1 - sp, by, sx1, sy1 - (v0 + p * 0.6));
  const gl = slab(sx0 + sp, by + sp, 0.02, sx1 - sp, sy1 - (v0 + p * 0.6) - sp, 0.026, M.frosted(), { cast: false });
  gl.userData.frosted = true; piv.add(gl);
  const hy = (sy1 - sy0) / 2 + by;
  piv.add(at(rbox(0.03, 0.07, 0.014, 0.006, frameMat), sx1 - 0.03, hy, 0.062));
  const hl = rbox(0.022, 0.13, 0.016, 0.008, frameMat); hl.position.set(sx1 - 0.03, hy - 0.06, 0.08); piv.add(hl);
  g.add(piv);
  g.add(slab(a0 - 0.02, v0 - 0.022, -0.06, a1 + 0.02, v0 + 0.002, 0.03, sillMat || M.ceramicMatte('#f4f3ef')));
  named(g, 'Fenster · Klick zum Kippen', { click: () => toggle(piv, 'win', { prop: 'rotation.x', a: 0, b: 0.2, dur: 700 }) });
  return g;
}

/* ---------- Kleinkram ---------- */
function exhaustFan() {
  const g = new THREE.Group(), m = M.paint('#ece6d8');
  g.add(at(rbox(0.17, 0.17, 0.02, 0.01, m), 0, 0, 0.01));
  const ring = cyl(0.058, 0.058, 0.012, M.paint('#d9d2c2'), 32); ring.rotation.x = PI / 2; ring.position.z = 0.022; g.add(ring);
  for (let i = -3; i <= 3; i++) g.add(at(box(0.11, 0.006, 0.004, m), 0, i * 0.014, 0.03));
  return g;
}
function socket(m = M.whitePlastic()) {
  const g = new THREE.Group(); g.add(at(rbox(0.082, 0.082, 0.012, 0.008, m), 0, 0, 0.006));
  const c = cyl(0.026, 0.026, 0.006, m, 28); c.rotation.x = PI / 2; c.position.z = 0.014; g.add(c);
  for (const x of [-0.01, 0.01]) { const h = cyl(0.0025, 0.0025, 0.004, M.blackPlastic(), 8); h.rotation.x = PI / 2; h.position.set(x, 0, 0.017); g.add(h); }
  return g;
}
function domeLamp(r = 0.16) {
  const g = new THREE.Group();
  const dome = lathe([[0, -0.07], [r * 0.6, -0.06], [r * 0.92, -0.03], [r, 0]], M.lamp('#fff4e2', 2.2, 0.9), 40);
  dome.castShadow = false; dome.userData.lamp = true; g.add(dome);
  g.add(at(cyl(r + 0.01, r + 0.01, 0.012, M.paint('#e9e7e1'), 40), 0, -0.006, 0));
  return g;
}
function spot(m = M.paint('#efede8')) {
  const g = new THREE.Group();
  g.add(at(cyl(0.045, 0.045, 0.006, m, 28), 0, -0.003, 0));
  const e = at(cyl(0.028, 0.028, 0.004, M.lamp('#fff2dc', 3, 1.2), 20), 0, -0.006, 0); e.userData.lamp = true; g.add(e);
  return shadowOff(g);
}
function bathScale() {
  const g = new THREE.Group();
  g.add(at(rbox(0.3, 0.018, 0.3, 0.008, M.ceramic('#f2f4f3')), 0, 0.009, 0));
  for (const [x, z] of [[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]]) g.add(at(rbox(0.07, 0.003, 0.03, 0.002, M.paint('#5b5249')), x, 0.019, z));
  g.add(at(box(0.06, 0.002, 0.018, M.blackPlastic()), 0, 0.019, -0.02));
  return g;
}
function swingBin(c = '#24426d') {
  const g = new THREE.Group(), m = M.paint(c);
  g.add(mesh(loftGeo([{ w: 0.2, d: 0.17, r: 0.02, y: 0.34 }, { w: 0.18, d: 0.15, r: 0.02, y: 0.0 }], { capBottom: true }), m));
  g.add(at(rbox(0.21, 0.06, 0.18, 0.02, m), 0, 0.37, 0));
  const flap = rbox(0.14, 0.05, 0.012, 0.006, M.paint('#1c3558')); flap.position.set(0, 0.37, 0.09); flap.rotation.x = 0.25; g.add(flap);
  return g;
}
function pedalBin(c) {
  const g = new THREE.Group(), m = M.paint(c);
  g.add(lathe([[0, 0], [0.105, 0], [0.11, 0.01], [0.11, 0.28], [0, 0.28]], m, 36));
  g.add(lathe([[0, 0.28], [0.112, 0.28], [0.112, 0.29], [0.07, 0.31], [0, 0.312]], M.steel(), 36));
  g.add(at(rbox(0.07, 0.012, 0.05, 0.004, M.black()), 0, 0.01, 0.12));
  return g;
}
function slippers() {
  const g = new THREE.Group();
  const m = mat('slip', () => std({ map: furTex('slip', '#f1e3e6'), roughness: 1, envMapIntensity: 0.2 }));
  for (const [x, rot] of [[-0.06, 0.15], [0.06, -0.08]]) {
    const s = mesh(new THREE.CapsuleGeometry(0.045, 0.17, 6, 14), m); s.rotation.set(PI / 2, 0, rot); s.scale.set(1, 1, 0.7); s.position.set(x, 0.032, 0);
    g.add(s);
    const ear = mesh(new THREE.ConeGeometry(0.012, 0.035, 10), M.paint('#e7a3bd')); ear.position.set(x + 0.02, 0.07, -0.09); g.add(ear);
    for (const ex of [-0.016, 0.016]) g.add(at(sph(0.006, M.blackPlastic(), 10), x + ex, 0.062, -0.085));
  }
  return g;
}
function hook(m) { const g = new THREE.Group(); g.add(rod([0, 0, 0], [0, 0, 0.04], 0.006, m), rod([0, 0, 0.04], [0, 0.025, 0.05], 0.006, m)); return g; }
function towelRail(len, m) {
  const g = new THREE.Group();
  g.add(rod([-len / 2, 0, 0.065], [len / 2, 0, 0.065], 0.009, m));
  for (const x of [-len / 2, len / 2]) { g.add(rod([x, 0, 0], [x, 0, 0.065], 0.008, m)); const ro = cyl(0.022, 0.022, 0.012, m, 24); ro.rotation.x = PI / 2; ro.position.set(x, 0, 0.006); g.add(ro); }
  return g;
}
function towelStack(n, w, d, m, h = 0.045) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) { const t = rbox(w, h, d, h * 0.45, Array.isArray(m) ? m[i % m.length] : m); t.position.set((i % 2 ? 1 : -1) * 0.004, h / 2 + i * h * 0.98, 0); g.add(t); }
  return g;
}
function rolledTowel(len, r, m) { const t = cyl(r, r, len, m, 20); t.rotation.z = PI / 2; return t; }
function tpRolls(n) {
  const g = new THREE.Group(), w = M.paint('#fbfbf8'), c = M.paint('#b79f80');
  for (let i = 0; i < n; i++) { g.add(at(cyl(0.054, 0.054, 0.1, w, 24), i * 0.115 - (n - 1) * 0.0575, 0.05, 0)); g.add(at(cyl(0.022, 0.022, 0.101, c, 12), i * 0.115 - (n - 1) * 0.0575, 0.05, 0)); }
  return g;
}
function candle(r = 0.035, h = 0.08) { const g = new THREE.Group(); g.add(at(cyl(r, r, h, M.paint('#f3eee3'), 24), 0, h / 2, 0)); g.add(at(cyl(r + 0.004, r + 0.004, h * 0.6, M.glassTint('#d8c7a7'), 24), 0, h * 0.3, 0)); return g; }
function beardStation(tray = M.paint('#2d2d2b')) {
  const g = new THREE.Group();
  g.add(at(rbox(0.24, 0.015, 0.11, 0.006, tray), 0, 0.0075, 0));
  const amber = M.glassTint('#8a4b16');
  for (const x of [-0.09, -0.055]) { g.add(at(cyl(0.015, 0.015, 0.06, amber, 18), x, 0.045, -0.01)); g.add(at(cyl(0.008, 0.008, 0.02, M.black(), 12), x, 0.085, -0.01)); g.add(at(sph(0.009, M.blackPlastic(), 12), x, 0.1, -0.01)); }
  const comb = rbox(0.11, 0.004, 0.032, 0.002, M.wood('walnutSmall', WOOD.walnut)); comb.position.set(0.02, 0.02, 0.025); comb.rotation.y = 0.15; g.add(comb);
  g.add(at(rbox(0.07, 0.028, 0.04, 0.012, M.wood('oakSmall', WOOD.oak)), 0.035, 0.03, -0.022));
  g.add(at(rbox(0.06, 0.012, 0.034, 0.006, M.paint('#d8c9a8')), 0.035, 0.05, -0.022));
  const tr = rbox(0.034, 0.13, 0.026, 0.013, M.blackPlastic()); tr.position.set(0.098, 0.08, 0); g.add(tr);
  g.add(at(box(0.003, 0.004, 0.003, M.emit('#4dd07a', 3)), 0.098, 0.04, 0.014));
  g.add(at(rbox(0.05, 0.018, 0.04, 0.006, M.paint('#3a3a38')), 0.098, 0.017, 0));
  return g;
}

/* ---------- Pflanzen ---------- */
const LEAF = {};
function leafGeo(kind) {
  if (LEAF[kind]) return LEAF[kind];
  const s = new THREE.Shape();
  if (kind === 'heart') { s.moveTo(0, 0); s.bezierCurveTo(0.55, 0.0, 0.62, 0.62, 0, 1); s.bezierCurveTo(-0.62, 0.62, -0.55, 0.0, 0, 0); }
  else if (kind === 'lance') { s.moveTo(0, 0); s.quadraticCurveTo(0.2, 0.45, 0, 1); s.quadraticCurveTo(-0.2, 0.45, 0, 0); }
  else { s.moveTo(0, 0); s.bezierCurveTo(0.42, 0.15, 0.42, 0.85, 0, 1); s.bezierCurveTo(-0.42, 0.85, -0.42, 0.15, 0, 0); }
  const g = new THREE.ShapeGeometry(s, 6), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, -x * x * 0.5 + Math.sin(y * PI) * 0.06); }
  g.computeVertexNormals();
  return (LEAF[kind] = g);
}
function trailing({ n = 8, minL = 0.3, maxL = 0.8, r0 = 0.07, leaf = 'heart', size = 0.05, colors = ['#3e7b39', '#5d9b44', '#2e6a33', '#7fae4f'], seed = 3, density = 0.045, droop = 1, out = 0.12, up = 0.03 }) {
  const g = new THREE.Group(), rnd = rng(seed), mats = [], stemM = M.plant('#4d7a3a');
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + rnd() * 0.6, Ln = minL + rnd() * (maxL - minL), o = out * (0.6 + rnd() * 0.8);
    const P = (ang, rr, y) => new V3(Math.cos(ang) * rr, y, Math.sin(ang) * rr);
    const curve = new THREE.CatmullRomCurve3([P(a, r0 * 0.6, 0), P(a, r0 + o * 0.5, up), P(a + 0.15, r0 + o, -Ln * 0.3 * droop), P(a + 0.3, r0 + o * 1.1, -Ln * 0.7 * droop), P(a + 0.35, r0 + o * 1.05, -Ln * droop)]);
    g.add(mesh(new THREE.TubeGeometry(curve, 24, 0.0028, 5), stemM, { cast: false }));
    const cnt = Math.max(2, Math.floor(curve.getLength() / density));
    for (let k = 1; k <= cnt; k++) {
      const t = k / cnt, p = curve.getPointAt(t), s = size * (1.15 - t * 0.5) * (0.75 + rnd() * 0.45), side = k % 2 ? 1 : -1;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.5 + rnd() * 0.9, Math.atan2(p.x, p.z) + side * (0.5 + rnd() * 0.6), side * (0.3 + rnd() * 0.4)));
      mats.push([new THREE.Matrix4().compose(p, q, new V3(s, s, s)), colors[Math.floor(rnd() * colors.length)]]);
    }
  }
  const im = new THREE.InstancedMesh(leafGeo(leaf), M.plant('#ffffff'), mats.length);
  mats.forEach(([m4, c], i) => { im.setMatrixAt(i, m4); im.setColorAt(i, new THREE.Color(c)); });
  im.castShadow = true; g.add(im);
  return g;
}
function fern({ n = 22, len = 0.42, seed = 5 }) {
  const g = new THREE.Group(), rnd = rng(seed), mats = [], stemM = M.plant('#4f7d35');
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2 + rnd() * 0.4, Ln = len * (0.6 + rnd() * 0.5), lift = 0.05 + rnd() * 0.18;
    const P = (rr, y) => new V3(Math.cos(a) * rr, y, Math.sin(a) * rr);
    const curve = new THREE.CatmullRomCurve3([P(0.02, 0), P(Ln * 0.35, lift), P(Ln * 0.7, lift - Ln * 0.25), P(Ln * 0.85, -Ln * 0.65)]);
    g.add(mesh(new THREE.TubeGeometry(curve, 20, 0.0022, 4), stemM, { cast: false }));
    const cnt = 22;
    for (let k = 2; k <= cnt; k++) {
      const t = k / cnt, p = curve.getPointAt(t), tan = curve.getTangentAt(t), s = 0.06 * Math.sin(t * PI * 0.95 + 0.1) * (0.85 + rnd() * 0.3);
      const side = new V3().crossVectors(tan, new V3(0, 1, 0)).normalize();
      for (const sg of [1, -1]) {
        const dir = side.clone().multiplyScalar(sg).add(tan.clone().multiplyScalar(0.4)).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new V3(0, 1, 0), dir);
        q.multiply(new THREE.Quaternion().setFromAxisAngle(new V3(0, 1, 0), PI / 2));
        mats.push([new THREE.Matrix4().compose(p, q, new V3(s * 0.55, s, s)), ['#4f8a3c', '#5f9a44', '#3f7432'][Math.floor(rnd() * 3)]]);
      }
    }
  }
  const im = new THREE.InstancedMesh(leafGeo('lance'), M.plant('#ffffff'), mats.length);
  mats.forEach(([m4, c], i) => { im.setMatrixAt(i, m4); im.setColorAt(i, new THREE.Color(c)); });
  im.castShadow = true; g.add(im);
  return g;
}
function snakePlant({ n = 8, h = 0.5, seed = 7 }) {
  const g = new THREE.Group(), rnd = rng(seed);
  const m = mat('snake', () => std({ color: '#33613a', roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 0.6 }));
  const m2 = mat('snake2', () => std({ color: '#5f8a3e', roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 0.6 }));
  for (let i = 0; i < n; i++) {
    const hh = h * (0.55 + rnd() * 0.5), w = 0.05 + rnd() * 0.025, s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.quadraticCurveTo(-w * 0.62, hh * 0.6, 0, hh); s.quadraticCurveTo(w * 0.62, hh * 0.6, w / 2, 0); s.lineTo(-w / 2, 0);
    const geo = new THREE.ShapeGeometry(s, 8), p = geo.attributes.position;
    for (let k = 0; k < p.count; k++) { const x = p.getX(k), y = p.getY(k); p.setZ(k, -x * x * 8 + Math.sin(y * 6 + i) * 0.01); }
    geo.computeVertexNormals();
    const b = mesh(geo, i % 3 ? m : m2); const a = (i / n) * PI * 2 + rnd();
    b.position.set(Math.cos(a) * 0.03, 0, Math.sin(a) * 0.03); b.rotation.set((rnd() - 0.5) * 0.25, a + PI / 2, (rnd() - 0.5) * 0.25);
    g.add(b);
  }
  return g;
}
function pot({ r = 0.08, h = 0.12, m = M.ceramicMatte('#e9e4da'), soil = true }) {
  const g = new THREE.Group();
  g.add(lathe([[0, 0], [r * 0.78, 0], [r * 0.82, 0.006], [r, h], [r * 0.93, h], [r * 0.9, h * 0.15], [0, h * 0.15]], m, 36));
  if (soil) g.add(at(cyl(r * 0.92, r * 0.92, 0.006, M.paint('#3a2b20'), 24), 0, h - 0.015, 0));
  return g;
}
function hangingPlant({ top, len = 0.5, potR = 0.085, plant, potM, ropeM }) { // top: Höhe Deckenhaken relativ
  const g = new THREE.Group(), ph = 0.11;
  const p = pot({ r: potR, h: ph, m: potM }); p.position.y = -len - ph; g.add(p);
  const rm = ropeM || M.paint('#e7dcc6');
  for (let i = 0; i < 3; i++) { const a = (i / 3) * PI * 2; g.add(rod([0, 0, 0], [Math.cos(a) * potR * 0.95, -len - ph * 0.3, Math.sin(a) * potR * 0.95], 0.003, rm, 6)); }
  if (plant) { plant.position.y = -len - 0.01; g.add(plant); }
  return g;
}
function stool() { // Teak-Hocker
  const g = new THREE.Group(), m = M.wood('teak', WOOD.teak);
  for (let i = 0; i < 5; i++) g.add(slab(-0.2, 0.4, -0.15 + i * 0.062, 0.2, 0.425, -0.15 + i * 0.062 + 0.05, m));
  for (const x of [-0.17, 0.17]) { g.add(slab(x - 0.02, 0, -0.15, x + 0.02, 0.4, -0.11, m), slab(x - 0.02, 0, 0.11, x + 0.02, 0.4, 0.15, m), slab(x - 0.02, 0.12, -0.15, x + 0.02, 0.15, 0.15, m)); }
  return g;
}
function vaseBranch() {
  const g = new THREE.Group();
  g.add(lathe([[0, 0], [0.045, 0], [0.06, 0.06], [0.045, 0.16], [0.018, 0.2], [0.022, 0.22], [0, 0.22]], M.ceramicMatte('#3b3734'), 32));
  const br = M.paint('#5a4434');
  g.add(tube([[0, 0.2, 0], [0.02, 0.35, 0.01], [0.08, 0.5, 0.02], [0.12, 0.6, 0.0]], 0.004, br, 30));
  g.add(tube([[0.02, 0.35, 0.01], [-0.05, 0.47, 0.0], [-0.07, 0.55, -0.02]], 0.003, br, 20));
  const lm = M.plant('#7b8f4a');
  [[0.12, 0.6, 0], [0.08, 0.5, 0.02], [-0.07, 0.55, -0.02], [-0.05, 0.47, 0], [0.1, 0.56, 0.01]].forEach(([x, y, z], i) => { const l = mesh(leafGeo('oval'), lm); l.scale.setScalar(0.04); l.position.set(x, y, z); l.rotation.set(0.3 * i, i, 0.5); g.add(l); });
  return g;
}
