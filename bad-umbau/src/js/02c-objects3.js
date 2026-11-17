/* =====================================================================
   OBJEKTE III – Duschtasse, Eckvorhang, Eckglas, Stil-Bausteine
   ===================================================================== */

/* ---------- Duschtasse (quadratisch, tief) in der Ecke Fenster-/Wannenwand ---------- */
function showerTray(B, { s = 0.8, h = 0.5, apron, rimMat = M.ceramic(), innerMat = M.ceramic(), worldApron = true } = {}) {
  const { W } = B.D, g = new THREE.Group(), rim = 0.06, hw = s - 2 * rim;
  g.add(at(mesh(plateGeo(s, s, 0.012, 0.035, { w: hw, d: hw, r: 0.09 }, 0.008), rimMat), 0, h - 0.035, s / 2));
  g.add(at(mesh(loftGeo([{ w: hw, d: hw, r: 0.09, y: 0 }, { w: hw - 0.03, d: hw - 0.03, r: 0.1, y: -0.12 }, { w: hw - 0.08, d: hw - 0.08, r: 0.1, y: -0.27 }, { w: hw - 0.12, d: hw - 0.12, r: 0.08, y: -0.32 }], { capBottom: true }), innerMat), 0, h - 0.006, s / 2));
  const S = worldApron ? slabW : slab, am = apron || M.ceramic();
  g.add(S(-s / 2, 0, 0, -s / 2 + 0.025, h - 0.035, s, am), S(-s / 2, 0, s - 0.025, s / 2, h - 0.035, s, am));
  g.add(at(cyl(0.032, 0.032, 0.004, M.chrome()), -0.12, h - 0.325, s - 0.2));
  const ov = cyl(0.03, 0.03, 0.006, M.chrome()); ov.rotation.x = PI / 2; ov.position.set(-0.12, h - 0.11, s - rim - 0.012); g.add(ov);
  g.position.set(W - s / 2, 0, 0);
  B.foot(W - s, 0, W, s, 'Dusche');
  return g;
}
/* Eck-Vorhangstange (L mit Radius) + Vorhang, der entlang der Stange läuft */
function cornerPath(B, s, r = 0.18) { // Start an der Wannenwand (x=W, z=s) → Ecke → Fensterwand (x=W-s, z=0)
  const { W } = B.D, x0 = W - s + 0.02, z0 = s - 0.02;
  const a = Math.max(0, (W - (x0 + r))), b = Math.max(0, z0 - r), arc = PI * r / 2, total = a + arc + b;
  const at_ = (u) => {
    u = clamp(u, 0, total);
    if (u <= a) return { x: W - u, z: z0, nx: 0, nz: 1 };
    if (u <= a + arc) { const t = (u - a) / r, cx = x0 + r, cz = z0 - r; return { x: cx - Math.sin(t) * r, z: cz + Math.cos(t) * r, nx: -Math.sin(t), nz: Math.cos(t) }; }
    return { x: x0, z: z0 - r - (u - a - arc), nx: -1, nz: 0 };
  };
  return { total, at: at_ };
}
function cornerCurtain(B, { s = 0.8, y = 2.0, h = 1.4, flat = 2.2, folds = 34, span = 0.32, rodM = M.chrome(), map } = {}) {
  const P = cornerPath(B, s), g = new THREE.Group();
  const pts = []; for (let i = 0; i <= 40; i++) { const p = P.at((i / 40) * P.total); pts.push([p.x, y + 0.025, p.z]); }
  g.add(tube(pts, 0.011, rodM, 80, false, 0));
  for (const u of [0.02, P.total - 0.02]) { const p = P.at(u); g.add(rod([p.x, y + 0.025, p.z], [p.x, B.D.H, p.z], 0.007, rodM)); }
  const geo = new THREE.PlaneGeometry(flat, h, 200, 18), orig = new Float32Array(geo.attributes.position.array);
  const m = map ? mat('curtainM' + map.uuid, () => std({ map, roughness: 0.8, side: THREE.DoubleSide, envMapIntensity: 0.3 })) : mat('curtain', () => std({ map: curtainTex(), roughness: 0.75, side: THREE.DoubleSide, envMapIntensity: 0.3 }));
  const cm = mesh(geo, m); g.add(cm);
  const rings = new THREE.Group(); g.add(rings);
  for (let i = 0; i < 10; i++) rings.add(mesh(new THREE.TorusGeometry(0.018, 0.0025, 6, 14), rodM));
  const set = (sp) => {
    const p = geo.attributes.position, lam = flat / folds, ratio = clamp(sp / flat, 0.05, 1), A = (lam / PI) * Math.sqrt(Math.max(0, 1 - ratio * ratio)) * 0.85;
    for (let i = 0; i < p.count; i++) {
      const xf = orig[i * 3], yf = orig[i * 3 + 1], t = (h / 2 - yf) / h, u = ((xf + flat / 2) / flat) * sp;
      const q = P.at(u), off = A * Math.sin((2 * PI * (xf + flat / 2)) / lam) * (1 + t * 0.25);
      p.setXYZ(i, q.x + q.nx * off, y - t * h, q.z + q.nz * off);
    }
    p.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
    rings.children.forEach((r, i) => { const q = P.at((i / 9) * sp); r.position.set(q.x, y + 0.025, q.z); r.rotation.y = Math.atan2(-q.nz, q.nx); });
  };
  set(span);
  g.userData.setCurtain = set; g.userData.span = span; g.userData.total = P.total;
  return g;
}
/* Eck-Glas für Duschtasse: zwei Paneele auf dem Rand (Süd- und Westseite), optional Pendeltür */
function cornerGlass(B, { s = 0.8, y0 = 0.5, h = 1.45, profile = M.chrome(), frame = false, rows = 0, round = 0 } = {}) {
  const { W } = B.D, g = new THREE.Group(), gm = M.glass(), x = W - s + 0.03, z = s - 0.03, t = 0.004;
  g.add(slab(x, y0, z - t, W - 0.012, y0 + h, z + t, gm, { cast: false }));
  g.add(slab(x - t, y0, 0.012, x + t, y0 + h, z, gm, { cast: false }));
  const pw = frame ? 0.022 : 0.012;
  g.add(slab(x - pw, y0, z - pw, x + pw, y0 + h, z + pw, profile));
  g.add(slab(W - 0.014, y0, z - pw, W, y0 + h, z + pw, profile), slab(x - pw, y0, 0, x + pw, y0 + h, 0.014, profile));
  if (frame) {
    g.add(slab(x, y0 + h - pw, z - pw, W, y0 + h, z + pw, profile), slab(x - pw, y0 + h - pw, 0, x + pw, y0 + h, z, profile));
    g.add(slab(x, y0, z - pw, W, y0 + pw, z + pw, profile), slab(x - pw, y0, 0, x + pw, y0 + pw, z, profile));
    for (let i = 1; i < rows; i++) { const yy = y0 + (h * i) / rows; g.add(slab(x, yy - 0.008, z - 0.01, W, yy + 0.008, z + 0.01, profile), slab(x - 0.01, yy - 0.008, 0, x + 0.01, yy + 0.008, z, profile)); }
  } else {
    for (const yy of [y0 + 0.25, y0 + h - 0.25]) g.add(at(cyl(0.014, 0.014, 0.05, profile, 16), (x + W) / 2 - 0.12, yy, z));
    g.add(slab((x + W) / 2 - 0.05, y0 + h / 2 - 0.12, z - 0.02, (x + W) / 2 - 0.035, y0 + h / 2 + 0.12, z + 0.02, profile));
  }
  return g;
}
function trayFixtures(B, s, m, style = 'rail') { // Armaturen an der Wannenwand über der Duschtasse
  if (style === 'pipe') return B.add(B.mount(pipeShower(m), 'right', s * 0.5, 0), { name: 'Aufputz-Brausesystem' });
  const g = new THREE.Group();
  g.add(rod([0, 1.15, 0.035], [0, 2.0, 0.035], 0.011, m));
  for (const y of [1.15, 2.0]) g.add(rod([0, y, 0], [0, y, 0.035], 0.008, m));
  g.add(rod([0, 2.0, 0.035], [0, 2.02, 0.3], 0.01, m));
  if (style === 'round') { g.add(at(cyl(0.12, 0.12, 0.012, m, 40), 0, 2.02, 0.3)); }
  else g.add(at(rbox(0.25, 0.012, 0.25, 0.01, m), 0, 2.02, 0.3));
  const th = new THREE.Group(); th.position.set(0.18, 1.05, 0);
  const body = cyl(0.026, 0.026, 0.26, m); body.rotation.z = PI / 2; body.position.z = 0.06; th.add(body);
  for (const x of [-0.13, 0.13]) { const k = cyl(0.03, 0.03, 0.035, m); k.rotation.z = PI / 2; k.position.set(x, 0, 0.06); th.add(k); th.add(rod([x * 0.5, 0, 0], [x * 0.5, 0, 0.06], 0.012, m)); }
  g.add(th);
  const hh = cyl(0.016, 0.02, 0.22, m); hh.position.set(0, 1.62, 0.08); g.add(hh); g.add(at(rbox(0.035, 0.04, 0.04, 0.008, m), 0, 1.52, 0.055));
  g.add(tube([[0.18, 1.0, 0.06], [0.14, 0.8, 0.09], [0.04, 0.78, 0.1], [0.0, 1.0, 0.09], [0.0, 1.5, 0.08]], 0.007, m, 40));
  return B.add(B.mount(g, 'right', s * 0.32, 0), { name: 'Brausestange mit Kopfbrause & Thermostat' });
}

/* ---------- Ofuro (Hinoki-Holzwanne) ---------- */
function ofuro(B, { s = 0.8, h = 0.62 } = {}) {
  const { W } = B.D, g = new THREE.Group(), hin = M.wood('hinoki', { base: '#e2c49a', dark: '#b9935f', light: '#f0dcb8', seed: 41, rough: 0.6 }), t = 0.045;
  g.add(slab(-s / 2, 0.06, 0, s / 2, 0.1, s, hin));
  g.add(slab(-s / 2, 0.06, 0, -s / 2 + t, h, s, hin), slab(s / 2 - t, 0.06, 0, s / 2, h, s, hin), slab(-s / 2, 0.06, 0, s / 2, h, t, hin), slab(-s / 2, 0.06, s - t, s / 2, h, s, hin));
  for (let i = 0; i < 8; i++) g.add(slab(-s / 2 - 0.002, 0.06 + i * 0.07, s - 0.004, s / 2 + 0.002, 0.062 + i * 0.07, s + 0.002, M.paint('#9c7a4c')));
  for (const y of [0.15, h - 0.1]) { g.add(slab(-s / 2 - 0.006, y, s, s / 2 + 0.006, y + 0.025, s + 0.006, M.paint('#3b3632'))); g.add(slab(-s / 2 - 0.006, y, 0, -s / 2, y + 0.025, s, M.paint('#3b3632'))); }
  const wtr = mesh(new THREE.PlaneGeometry(s - 2 * t, s - 2 * t), M.water(), { cast: false }); wtr.rotation.x = -PI / 2; wtr.position.set(0, h - 0.12, s / 2); g.add(wtr);
  g.add(slab(-0.15, h - 0.01, s / 2 - 0.1, 0.15, h + 0.02, s / 2 + 0.1, hin)); // Deckelbrett
  for (const [x, z] of [[-s / 2, 0], [s / 2, 0], [-s / 2, s], [s / 2, s]]) g.add(slab(x - 0.03, 0, z - 0.03, x + 0.03, 0.06, z + 0.03, M.paint('#3b3632')));
  g.position.set(W - s / 2, 0, 0); B.foot(W - s, 0, W, s, 'Ofuro');
  return g;
}

/* ---------- Spiegel-Varianten ---------- */
function bulbMirror(B, w = 0.6, h = 0.8, frameM = M.black()) { // Garderoben-/Barbier-Spiegel mit Glühbirnen
  const g = new THREE.Group(), f = 0.07;
  const s = rrectShape(w + 2 * f, h + 2 * f, 0.02); s.holes.push(rrectShape(w, h, 0.005));
  g.add(mesh(new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false }), frameM));
  const m = makeMirror(B, new THREE.PlaneGeometry(w, h)); m.position.z = 0.02; g.add(m);
  const bm = M.lamp('#fff1d6', 3.4, 1.4), pts = [];
  for (let i = 0; i < 4; i++) { pts.push([-w / 2 - f / 2, -h / 2 + (i + 0.5) * h / 4], [w / 2 + f / 2, -h / 2 + (i + 0.5) * h / 4]); }
  for (let i = 0; i < 3; i++) pts.push([-w / 2 + (i + 0.5) * w / 3, h / 2 + f / 2]);
  pts.forEach(([x, y]) => { const b = sph(0.024, bm, 12); b.position.set(x, y, 0.055); b.castShadow = false; g.add(b); g.add(at(cyl(0.014, 0.014, 0.02, M.brass(), 10), x, y, 0.04)).children.at(-1).rotation.x = PI / 2; });
  return g;
}
function porthole(B, R = 0.26, m = M.brass()) {
  const g = new THREE.Group();
  const ring = mesh(new THREE.TorusGeometry(R + 0.03, 0.035, 14, 64), m); ring.position.z = 0.03; g.add(ring);
  const ring2 = mesh(new THREE.TorusGeometry(R + 0.005, 0.012, 10, 64), m); ring2.position.z = 0.055; g.add(ring2);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * PI * 2; g.add(at(sph(0.012, m, 10), Math.cos(a) * (R + 0.03), Math.sin(a) * (R + 0.03), 0.065)); }
  const mr = makeMirror(B, new THREE.CircleGeometry(R, 48)); mr.position.z = 0.04; g.add(mr);
  return g;
}
function wavyMirror(B, w = 0.5, h = 0.75, frameM) {
  const sh = new THREE.Shape(), N = 60;
  for (let i = 0; i <= N; i++) { const t = (i / N) * PI * 2, rx = w / 2 + Math.sin(t * 6) * 0.025, ry = h / 2 + Math.sin(t * 6 + 1) * 0.025; const x = Math.cos(t) * rx * 0.98, y = Math.sin(t) * ry; i ? sh.lineTo(x, y) : sh.moveTo(x, y); }
  const g = new THREE.Group();
  const back = mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.03, bevelSegments: 3 }), frameM); g.add(back);
  const m = makeMirror(B, new THREE.ShapeGeometry(sh, 4)); m.scale.set(0.9, 0.9, 1); m.position.z = 0.032; g.add(m);
  return g;
}
function fanMirror(B, w = 0.62, h = 0.85, m = M.brass()) { // Art-Deco-Fächer
  const g = new THREE.Group(), s = new THREE.Shape(), r = w / 2;
  s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, h - r); s.absarc(0, h - r, r, 0, PI, false); s.lineTo(-r, 0);
  const fr = s.clone ? s : s; const outer = archShape(w + 0.06, h + 0.03, -0.03); outer.holes.push(archShape(w, h));
  g.add(mesh(new THREE.ExtrudeGeometry(outer, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 32 }), m));
  const mr = makeMirror(B, new THREE.ShapeGeometry(fr, 32)); mr.position.z = 0.01; g.add(mr);
  for (let i = 1; i < 7; i++) { const a = (i / 7) * PI; g.add(rod([0, h - r, 0.016], [Math.cos(a) * r, h - r + Math.sin(a) * r, 0.016], 0.004, m, 6)); }
  g.add(rod([-r, h - r, 0.016], [r, h - r, 0.016], 0.004, m, 6));
  return g;
}
function neonSign(text, color = '#ff3df2', w = 0.7) {
  const key = 'neon' + text + color;
  const tex = cached(key, () => {
    const cv = mkCanvas(1024, 256), c = cv.getContext('2d');
    c.font = 'italic 700 150px "Bricolage Grotesque", "Brush Script MT", cursive'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.shadowColor = color; c.shadowBlur = 30; c.strokeStyle = color; c.lineWidth = 10; c.strokeText(text, 512, 132);
    c.shadowBlur = 8; c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.strokeText(text, 512, 132);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  });
  const m = mat('neonM' + key, () => { const mm = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }); return mm; });
  const p = mesh(new THREE.PlaneGeometry(w, w / 4), m, { cast: false, recv: false }); p.position.z = 0.02; p.renderOrder = 3;
  const g = new THREE.Group(); g.add(p); g.add(at(box(w * 0.92, w / 4.6, 0.008, M.glassTint('#cfd6dc')), 0, 0, 0.008));
  return g;
}
function globeLight(r = 0.11, stem = 0.25, m = M.brass()) {
  const g = new THREE.Group(); g.add(rod([0, 0, 0], [0, -stem, 0], 0.006, m)); g.add(at(cyl(0.035, 0.035, 0.02, m, 20), 0, -0.01, 0));
  const gl = sph(r, M.lamp('#fff2dd', 2.8, 1.0), 28); gl.position.y = -stem - r * 0.9; gl.castShadow = false; g.add(gl); return g;
}
function paperLantern(r = 0.2) {
  const g = new THREE.Group(), pm = M.lamp('#fff1d8', 2.2, 1.0);
  const l = mesh(new THREE.SphereGeometry(r, 32, 20), pm, { cast: false }); l.scale.y = 1.15; g.add(l);
  for (let i = -3; i <= 3; i++) { const y = i * r * 0.3, rr = Math.sqrt(Math.max(0, r * r - (y / 1.15) ** 2)); const t = mesh(new THREE.TorusGeometry(rr + 0.001, 0.0015, 4, 40), M.paint('#d8cdb8'), { cast: false }); t.rotation.x = PI / 2; t.position.y = y; g.add(t); }
  g.add(rod([0, r * 1.15, 0], [0, r * 1.15 + 0.4, 0], 0.003, M.blackPlastic()));
  return g;
}
function towelLadder(m, h = 1.6, w = 0.45) { // angelehnte Leiter, lokal an Wand
  const g = new THREE.Group(), tilt = 0.12;
  for (const x of [-w / 2, w / 2]) g.add(rod([x, 0, tilt * h], [x, h, 0.02], 0.018, m, 10));
  for (let i = 1; i <= 5; i++) { const y = (h * i) / 6, z = tilt * h * (1 - y / h) + 0.02 * (y / h); g.add(rod([-w / 2, y, z], [w / 2, y, z], 0.012, m, 10)); }
  return g;
}
function plantRail(B, x0, x1, z, y, m = M.black()) { const g = new THREE.Group(); g.add(rod([x0, y, z], [x1, y, z], 0.01, m)); for (const x of [x0 + 0.05, x1 - 0.05]) g.add(rod([x, y, z], [x, B.D.H, z], 0.006, m)); return g; }

/* ---------- Oberflächen ---------- */
function stripeTex(key, a, b, n = 8, vertical = false) {
  return cached('stripe' + key, () => { const W = 256, cv = mkCanvas(W, W), c = cv.getContext('2d'); for (let i = 0; i < n; i++) { c.fillStyle = i % 2 ? b : a; vertical ? c.fillRect((i * W) / n, 0, W / n, W) : c.fillRect(0, (i * W) / n, W, W / n); } grain(c, W, W, 0.15); const t = toTex(cv); t.repeat.set(1, 1); return t; });
}
function boardSet(key, o) { // Nut-und-Feder / Holzpaneele, vertikal
  return cached('board:' + key, () => {
    const worldW = o.bw * 8, W = 1024, s = W / worldW, H = W;
    const cv = mkCanvas(W, H), bm = mkCanvas(W, H), c = cv.getContext('2d'), b = bm.getContext('2d');
    const src = o.wood ? woodCanvas({ ...o.wood, w: 512, h: 1024 }) : null;
    for (let i = 0; i < 8; i++) {
      const x = i * o.bw * s, w = o.bw * s;
      if (src) { c.drawImage(src, (i * 61) % 256, 0, 256, 1024, x, 0, w, H); } else { c.fillStyle = css(vary(o.base, rng(i + 3), 0.02)); c.fillRect(x, 0, w, H); }
      const gr = c.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, 'rgba(0,0,0,0.18)'); gr.addColorStop(0.08, 'rgba(0,0,0,0)'); gr.addColorStop(0.92, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,0.08)');
      c.fillStyle = gr; c.fillRect(x, 0, w, H);
      b.fillStyle = '#fff'; b.fillRect(x + 2, 0, w - 4, H); b.fillStyle = '#000'; b.fillRect(x, 0, 2, H);
      if (o.bead) { b.fillStyle = gray(0.5); b.fillRect(x + w * 0.5 - 1, 0, 2, H); c.fillStyle = 'rgba(0,0,0,0.08)'; c.fillRect(x + w * 0.5 - 1, 0, 2, H); }
    }
    grain(c, W, H, 0.06);
    return { map: toTex(cv, { ww: worldW, wh: worldW }), bump: toTex(bm, { srgb: false, ww: worldW, wh: worldW }) };
  });
}
function scaleSet(key, o) { // Fischschuppen / Fächer-Fliesen
  return cached('scale:' + key, () => {
    const r = o.r, worldW = r * 2 * 4, W = 1024, s = W / worldW, cv = mkCanvas(W, W), bm = mkCanvas(W, W), c = cv.getContext('2d'), b = bm.getContext('2d');
    c.fillStyle = o.grout; c.fillRect(0, 0, W, W); b.fillStyle = '#000'; b.fillRect(0, 0, W, W);
    const rows = Math.ceil(W / (r * s)) + 2;
    for (let j = rows; j >= -1; j--) for (let i = -1; i <= 4; i++) {
      const cx = (i * 2 + (j % 2 ? 1 : 0)) * r * s, cy = j * r * s, rr = r * s - o.gw * s, rnd = rng(((i % 4) + 4) % 4 * 31 + ((j % 8) + 8) % 8 * 7);
      const col = vary(o.colors[Math.floor(rnd() * o.colors.length)], rnd, 0.05);
      for (const dx of [0, W, -W]) {
        const gr = c.createRadialGradient(cx + dx, cy - rr * 0.2, rr * 0.1, cx + dx, cy, rr);
        gr.addColorStop(0, css(col.map(v => Math.min(255, v * 1.15)))); gr.addColorStop(1, css(col.map(v => v * 0.85)));
        c.fillStyle = gr; c.beginPath(); c.arc(cx + dx, cy, rr, PI, 0); c.lineTo(cx + dx + rr, cy + rr); c.arc(cx + dx, cy + rr, rr, 0, PI, true); c.closePath(); c.fill();
        if (o.gold) { c.strokeStyle = o.gold; c.lineWidth = 2; c.beginPath(); c.arc(cx + dx, cy, rr * 0.72, PI * 1.05, PI * 1.95); c.stroke(); }
        b.fillStyle = gray(0.9); b.beginPath(); b.arc(cx + dx, cy, rr, PI, 0); b.lineTo(cx + dx + rr, cy + rr); b.arc(cx + dx, cy + rr, rr, 0, PI, true); b.closePath(); b.fill();
      }
    }
    grain(c, W, W, 0.06);
    return { map: toTex(cv, { ww: worldW, wh: worldW }), bump: toTex(bm, { srgb: false, ww: worldW, wh: worldW }) };
  });
}
function pennySet(key, o) { // Penny-Rund-Mosaik
  return cached('penny:' + key, () => {
    const d = o.d, worldW = d * 16, W = 1024, s = W / worldW, cv = mkCanvas(W, W), c = cv.getContext('2d'), bm = mkCanvas(W, W), b = bm.getContext('2d');
    c.fillStyle = o.grout; c.fillRect(0, 0, W, W); b.fillStyle = '#000'; b.fillRect(0, 0, W, W);
    const step = d * s, rows = Math.round(W / (step * 0.866));
    for (let j = 0; j < rows; j++) for (let i = -1; i <= 16; i++) {
      const cx = (i + (j % 2 ? 0.5 : 0)) * step, cy = (j + 0.5) * (W / rows), rnd = rng((((i % 16) + 16) % 16) * 97 + j * 13);
      c.fillStyle = css(vary(o.colors[Math.floor(rnd() * o.colors.length)], rnd, 0.06)); c.beginPath(); c.arc(cx, cy, step * 0.42, 0, PI * 2); c.fill();
      b.fillStyle = '#fff'; b.beginPath(); b.arc(cx, cy, step * 0.42, 0, PI * 2); b.fill();
    }
    return { map: toTex(cv, { ww: worldW, wh: worldW }), bump: toTex(bm, { srgb: false, ww: worldW, wh: worldW }) };
  });
}
function checkerSet(key, o) {
  return cached('chk:' + key, () => {
    const t = o.t, worldW = t * 4, W = 1024, s = W / worldW, cv = mkCanvas(W, W), c = cv.getContext('2d');
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const rnd = rng(i * 7 + j * 3 + 1); c.fillStyle = css(vary((i + j) % 2 ? o.a : o.b, rnd, o.vary ?? 0.03)); c.fillRect(i * t * s, j * t * s, t * s, t * s); }
    if (o.marble) { c.globalAlpha = 0.35; const r = rng(5); for (let k = 0; k < 18; k++) { let x = r() * W, y = r() * W, a = r() * PI * 2; c.strokeStyle = (r() < 0.5 ? '#9a948c' : '#d8d2c8'); c.lineWidth = 1 + r() * 2; c.beginPath(); c.moveTo(x, y); for (let q = 0; q < 40; q++) { x += Math.cos(a) * 12; y += Math.sin(a) * 12; a += (r() - 0.5) * 0.6; c.lineTo(x, y); } c.stroke(); } c.globalAlpha = 1; }
    c.fillStyle = o.grout || 'rgba(0,0,0,0.25)'; for (let i = 0; i <= 4; i++) { c.fillRect(i * t * s - 1, 0, 2, W); c.fillRect(0, i * t * s - 1, W, 2); }
    grain(c, W, W, 0.05);
    return { map: toTex(cv, { ww: worldW, wh: worldW }) };
  });
}
function leafPaperSet(key, o) { // Botanik-Tapete (feuchtraumgeeignet)
  return cached('leafp:' + key, () => {
    const worldW = 0.9, W = 1024, cv = mkCanvas(W, W), c = cv.getContext('2d'), r = rng(77);
    c.fillStyle = o.base; c.fillRect(0, 0, W, W);
    for (let i = 0; i < 70; i++) {
      const x = r() * W, y = r() * W, sz = 60 + r() * 120, a = r() * PI * 2, col = o.leaves[Math.floor(r() * o.leaves.length)];
      wrapDraw(W, W, x, y, sz * 1.2, (xx, yy) => {
        c.save(); c.translate(xx, yy); c.rotate(a); c.fillStyle = col; c.globalAlpha = 0.85;
        c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(sz * 0.5, -sz * 0.1, sz * 0.55, -sz * 0.75, 0, -sz); c.bezierCurveTo(-sz * 0.55, -sz * 0.75, -sz * 0.5, -sz * 0.1, 0, 0); c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -sz * 0.95); c.stroke();
        for (let k = 1; k < 6; k++) { c.beginPath(); c.moveTo(0, -sz * k / 6.5); c.lineTo(sz * 0.3, -sz * (k / 6.5 + 0.1)); c.moveTo(0, -sz * k / 6.5); c.lineTo(-sz * 0.3, -sz * (k / 6.5 + 0.1)); c.stroke(); }
        c.restore();
      });
    }
    grain(c, W, W, 0.08);
    return { map: toTex(cv, { ww: worldW, wh: worldW }) };
  });
}
const tm = (key, set, o = {}) => mat('tm-' + key, () => std({ map: set.map, bumpMap: set.bump || null, bumpScale: o.bumpScale ?? 1.4, roughness: o.rough ?? 0.3, roughnessMap: set.rough || null, metalness: o.metal ?? 0, envMapIntensity: o.env ?? 0.8 }));
