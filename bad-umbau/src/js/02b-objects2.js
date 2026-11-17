/* =====================================================================
   OBJEKTE II – Bestandsdetails aus dem Video + Material für Varianten D–F
   ===================================================================== */

/* ---------- Bestand: WC-Umfeld ---------- */
const FUR = (key, hex) => mat('fur' + key, () => std({ map: furTex(key, hex), bumpMap: furTex(key, hex), bumpScale: 2.5, roughness: 1, envMapIntensity: 0.15 }));
function cisternExposed(m = M.ceramicMatte('#f2f1ed')) { // Aufputz-Spülkasten, Rückseite z=0, Unterkante y=0
  const g = new THREE.Group();
  g.add(rslab(-0.19, 0, 0, 0.19, 0.32, 0.16, 0.025, m));
  g.add(at(cyl(0.024, 0.024, 0.014, M.whitePlastic(), 24), 0.1, 0.327, 0.08));
  g.add(at(rbox(0.09, 0.11, 0.08, 0.01, m), 0, -0.36, 0.04)); // Anschlusskasten
  g.add(rod([0, 0, 0.05], [0, -0.55, 0.05], 0.022, m));
  const ev = cyl(0.012, 0.012, 0.05, M.chrome()); ev.rotation.x = PI / 2; ev.position.set(-0.07, -0.45, 0.025); g.add(ev);
  const kn = cyl(0.02, 0.02, 0.012, M.chrome(), 16); kn.rotation.x = PI / 2; kn.position.set(-0.07, -0.45, 0.055); g.add(kn);
  return g;
}
function uMat(hex = '#77736d', key = 'g1') { // WC-Vorleger mit Ausschnitt
  const s = new THREE.Shape(), r = 0.06, w = 0.26, d = 0.52, nw = 0.135, nd = 0.2;
  s.moveTo(-w, 0); s.lineTo(-nw, 0); s.lineTo(-nw, -nd); s.absarc(0, -nd, nw, PI, PI * 2, false); s.lineTo(nw, 0); s.lineTo(w, 0);
  s.lineTo(w, -d + r); s.absarc(w - r, -d + r, r, 0, -PI / 2, true); s.lineTo(-w + r, -d); s.absarc(-w + r, -d + r, r, -PI / 2, -PI, true); s.lineTo(-w, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.014, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 });
  g.rotateX(-PI / 2); g.translate(0, 0.004, 0);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2, uv.getY(i) * 2);
  return mesh(g, FUR(key, hex));
}
function tpHolder(m = M.chrome()) {
  const g = new THREE.Group();
  const ro = cyl(0.025, 0.025, 0.012, m, 20); ro.rotation.x = PI / 2; ro.position.z = 0.006; g.add(ro);
  g.add(rod([0, 0, 0], [0, 0, 0.06], 0.006, m), rod([0, 0, 0.06], [0.12, 0, 0.06], 0.006, m));
  const roll = cyl(0.055, 0.055, 0.1, M.paint('#fbfbf8'), 24); roll.rotation.z = PI / 2; roll.position.set(0.06, -0.01, 0.06); g.add(roll);
  return g;
}
function brushHolder(m = M.blackPlastic()) { const g = new THREE.Group(); g.add(at(rbox(0.09, 0.3, 0.09, 0.01, m), 0, 0.15, 0)); g.add(rod([0, 0.3, 0], [0.01, 0.42, 0], 0.006, m)); return g; }
function vanityDrawers(oak) { // kleine Kommode unterm Wandbecken (Video)
  const g = new THREE.Group(), W_ = 0.45, D = 0.44, H = 0.62, white = M.paint('#f2f1ec'), ch = M.chrome();
  g.add(slab(-W_ / 2, 0.05, 0, W_ / 2 - 0.018, H - 0.024, D - 0.02, white));
  g.add(slab(W_ / 2 - 0.018, 0, 0, W_ / 2, H - 0.024, D, oak), slab(-W_ / 2 - 0.004, H - 0.024, 0, W_ / 2 + 0.004, H, D + 0.01, oak));
  [[0.05, 0.24], [0.24, 0.42], [0.42, H - 0.026]].forEach(([a, b]) => { g.add(slab(-W_ / 2 + 0.002, a + 0.002, D - 0.02, W_ / 2 - 0.02, b - 0.002, D, white)); const h = handleBar(ch, 0.16); h.position.set(-0.01, b - 0.05, D); g.add(h); });
  // Korb mit Föhn
  const bk = new THREE.Group(); bk.add(at(rbox(0.26, 0.14, 0.2, 0.02, M.paint('#f4f4f1')), 0, 0.07, 0));
  bk.add(at(sph(0.07, M.blackPlastic(), 16), 0.03, 0.14, 0)); bk.add(at(rbox(0.06, 0.1, 0.04, 0.015, M.paint('#52565a')), -0.07, 0.16, 0.02));
  bk.add(tube([[0.1, 0.12, 0.1], [0.14, 0.05, 0.16], [0.18, 0.0, 0.12]], 0.004, M.blackPlastic(), 16));
  bk.position.set(0, H, 0.18); g.add(bk);
  return g;
}
function mirrorUnitBestand(B) { // hoher Spiegelaufsatz mit Rahmentüren und offenen Fächern (Video)
  const g = new THREE.Group(), W_ = 0.62, D = 0.16, wM = M.paint('#f4f3ef'), y0 = 0, y1 = 0.98;
  g.add(slab(-W_ / 2, y0, 0, -W_ / 2 + 0.02, y1, D, wM), slab(W_ / 2 - 0.02, y0, 0, W_ / 2, y1, D, wM));
  g.add(slab(-W_ / 2, y0, 0, W_ / 2, y1, 0.01, wM));
  for (const y of [y0, 0.17, 0.33]) g.add(slab(-W_ / 2, y, 0, W_ / 2, y + 0.018, D, wM));
  g.add(slab(-W_ / 2 - 0.02, y1 - 0.02, -0.0, W_ / 2 + 0.02, y1 + 0.02, D + 0.03, wM));
  // Türen mit Rahmen
  const dy0 = 0.35, dy1 = y1 - 0.025, dw = W_ / 2 - 0.004, fb = 0.045;
  for (const s of [-1, 1]) {
    const cx = s * W_ / 4;
    g.add(slab(cx - dw / 2, dy0, D, cx + dw / 2, dy0 + fb, D + 0.02, wM), slab(cx - dw / 2, dy1 - fb, D, cx + dw / 2, dy1, D + 0.02, wM));
    g.add(slab(cx - dw / 2, dy0, D, cx - dw / 2 + fb, dy1, D + 0.02, wM), slab(cx + dw / 2 - fb, dy0, D, cx + dw / 2, dy1, D + 0.02, wM));
    const mr = makeMirror(B, new THREE.PlaneGeometry(dw - 2 * fb + 0.004, dy1 - dy0 - 2 * fb + 0.004)); mr.position.set(cx, (dy0 + dy1) / 2, D + 0.012); g.add(mr);
  }
  // Inhalt offene Fächer + oben
  g.add(at(rbox(0.2, 0.025, 0.05, 0.008, M.blackPlastic()), 0.12, 0.19 + 0.012, 0.08));
  g.add(rod([-0.22, 0.2, 0.08], [-0.05, 0.215, 0.1], 0.012, M.blackPlastic()));
  g.add(at(rbox(0.07, 0.035, 0.07, 0.03, M.blackPlastic()), -0.24, 0.2, 0.09));
  const cup = lathe([[0, 0], [0.03, 0], [0.032, 0.09], [0.029, 0.09], [0.027, 0.004], [0, 0.004]], M.glassTint('#d9e6e6')); cup.position.set(0.0, 0.018, 0.08); g.add(cup);
  const top = new THREE.Group(); top.position.y = y1 + 0.02;
  const vac = new THREE.Group(); vac.add(at(rbox(0.26, 0.06, 0.08, 0.025, M.paint('#e8c228')), 0, 0.03, 0)); vac.add(at(rbox(0.1, 0.05, 0.05, 0.02, M.blackPlastic()), 0.15, 0.03, 0)); vac.add(at(rbox(0.04, 0.12, 0.06, 0.015, M.paint('#e8c228')), -0.1, 0.09, 0)); vac.rotation.y = 0.3; vac.position.set(-0.13, 0, 0.09); top.add(vac);
  top.add(at(rbox(0.2, 0.06, 0.11, 0.004, M.paint('#6b5aa0')), 0.08, 0.03, 0.06));
  top.add(at(cyl(0.035, 0.04, 0.2, M.paint('#45494b'), 20), 0.22, 0.1, 0.08));
  g.add(top);
  return g;
}

/* ---------- prozedurale Fliesen II ---------- */
function hexSet(key, o) { // Sechseck-Fliesen (spitz oben)
  return cached('hex:' + key, () => {
    const wf = o.w, s = wf / Math.sqrt(3), worldW = wf * 4, worldH = s * 3 * 2;
    const W = 1024, sc = W / worldW, H = Math.round(worldH * sc);
    const col = mkCanvas(W, H), bmp = mkCanvas(W, H), c = col.getContext('2d'), b = bmp.getContext('2d');
    c.fillStyle = o.grout; c.fillRect(0, 0, W, H); b.fillStyle = '#000'; b.fillRect(0, 0, W, H);
    const gw = o.gw * sc;
    for (let j = -1; j <= 4; j++) for (let i = -1; i <= 4; i++) {
      const cx = (i + (j % 2 ? 0.5 : 0)) * wf * sc, cy = j * 1.5 * s * sc;
      const ki = ((i % 4) + 4) % 4, kj = ((j % 4) + 4) % 4, r = rng(hashKey(key + ki + '_' + kj));
      const cc = vary(o.colors[Math.floor(r() * o.colors.length)], r, o.vary ?? 0.06, 0.02);
      const path = (ctx, inset) => { ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = PI / 6 + k * PI / 3, rr = s * sc - inset; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); };
      path(c, gw / 2); c.fillStyle = css(cc); c.fill();
      for (let k = 0; k < 4; k++) { const gx = cx + (r() - 0.5) * wf * sc * 0.6, gy = cy + (r() - 0.5) * wf * sc * 0.6, rr = wf * sc * (0.2 + r() * 0.3); const gr = c.createRadialGradient(gx, gy, 0, gx, gy, rr); gr.addColorStop(0, `rgba(${r() < 0.5 ? '255,235,210' : '90,40,20'},0.12)`); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.save(); path(c, gw / 2); c.clip(); c.fillStyle = gr; c.fillRect(gx - rr, gy - rr, rr * 2, rr * 2); c.restore(); }
      path(b, gw / 2); b.fillStyle = gray(0.75); b.fill(); path(b, gw / 2 + 3); b.fillStyle = gray(1); b.fill();
    }
    grain(c, W, H, 0.12);
    return { map: toTex(col, { ww: worldW, wh: worldH }), bump: toTex(bmp, { srgb: false, ww: worldW, wh: worldH }) };
  });
}
function majolicaSet(key, o) { // handbemalte Muster-Fliese
  return cached('maj:' + key, () => {
    const t = o.t, n = 4, worldW = t * n, W = 1024, sc = W / worldW;
    const col = mkCanvas(W, W), bmp = mkCanvas(W, W), c = col.getContext('2d'), b = bmp.getContext('2d');
    c.fillStyle = o.grout; c.fillRect(0, 0, W, W); b.fillStyle = '#000'; b.fillRect(0, 0, W, W);
    const ts = t * sc, gw = Math.max(1.5, o.gw * sc);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = i * ts + gw / 2, y = j * ts + gw / 2, w = ts - gw, r = rng(i * 13 + j * 7 + 3);
      c.fillStyle = css(vary(o.base, r, 0.03)); c.fillRect(x, y, w, w);
      c.save(); c.translate(x + w / 2, y + w / 2);
      const [c1, c2, c3] = o.ink;
      // Viertelkreise in den Ecken -> Kreismuster über 4 Fliesen
      c.fillStyle = c1; for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { c.beginPath(); c.moveTo(sx * w / 2, sy * w / 2); c.arc(sx * w / 2, sy * w / 2, w * 0.28, 0, PI * 2); c.fill(); }
      c.fillStyle = css(hex2rgb(o.base)); for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { c.beginPath(); c.arc(sx * w / 2, sy * w / 2, w * 0.19, 0, PI * 2); c.fill(); }
      c.fillStyle = c2; for (let k = 0; k < 4; k++) { c.save(); c.rotate(k * PI / 2); c.beginPath(); c.ellipse(0, -w * 0.19, w * 0.07, w * 0.16, 0, 0, PI * 2); c.fill(); c.restore(); }
      c.fillStyle = c3; c.beginPath(); c.arc(0, 0, w * 0.075, 0, PI * 2); c.fill();
      c.strokeStyle = c1; c.lineWidth = w * 0.025; c.beginPath(); c.arc(0, 0, w * 0.36, 0, PI * 2); c.stroke();
      c.restore();
      // Craquelé + Kissen
      c.strokeStyle = 'rgba(80,60,40,0.08)'; c.lineWidth = 1; for (let k = 0; k < 6; k++) { c.beginPath(); let px = x + r() * w, py = y + r() * w; c.moveTo(px, py); for (let q = 0; q < 5; q++) { px += (r() - 0.5) * w * 0.3; py += (r() - 0.5) * w * 0.3; c.lineTo(px, py); } c.stroke(); }
      for (let k = 0; k <= 4; k++) { const ins = (0.006 * sc * k) / 4; b.fillStyle = gray(0.55 + 0.45 * k / 4); b.fillRect(x + ins, y + ins, w - 2 * ins, w - 2 * ins); }
    }
    grain(c, W, W, 0.08);
    return { map: toTex(col, { ww: worldW, wh: worldW }), bump: toTex(bmp, { srgb: false, ww: worldW, wh: worldW }) };
  });
}
function slabTileSet(key, o) { // Großformat (Betonoptik / Feinsteinzeug): Wolken + Fugenraster
  return cached('slabt:' + key, () => {
    const base = cloudSet(key + 'c', o);
    const src = base.map.image, worldW = o.world || 2;
    const W = src.width, cv = mkCanvas(W, W), c = cv.getContext('2d'); c.drawImage(src, 0, 0);
    const sc = W / worldW; c.fillStyle = o.grout || 'rgba(60,60,60,0.5)';
    for (let x = 0; x <= worldW + 1e-6; x += o.tw) c.fillRect(x * sc - 1, 0, 2, W);
    for (let y = 0; y <= worldW + 1e-6; y += o.th) c.fillRect(0, y * sc - 1, W, 2);
    if (o.veins) { c.lineCap = 'round'; const r = rng(hashKey(key)); for (let i = 0; i < o.veins; i++) { let x = r() * W, y = r() * W, a = r() * PI * 2; c.strokeStyle = `rgba(120,115,108,${0.15 + r() * 0.2})`; for (let k = 0; k < 80; k++) { const nx = x + Math.cos(a) * 8, ny = y + Math.sin(a) * 8; c.lineWidth = 0.4 + r() * 1.6; wrapDraw(W, W, x, y, 12, (xx, yy) => { c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + nx - x, yy + ny - y); c.stroke(); }); x = nx; y = ny; a += (r() - 0.5) * 0.5; if (x < 0) x += W; if (x > W) x -= W; if (y < 0) y += W; if (y > W) y -= W; } } }
    return { map: toTex(cv, { ww: worldW, wh: worldW }), bump: base.bump, rough: base.rough };
  });
}
function wickerTex() {
  return cached('wicker', () => {
    const W = 256, cv = mkCanvas(W, W), c = cv.getContext('2d'); c.fillStyle = '#b48a55'; c.fillRect(0, 0, W, W);
    for (let y = 0; y < W; y += 16) for (let x = 0; x < W; x += 16) { const o = ((x + y) / 16) % 2; c.fillStyle = o ? '#d0a86f' : '#9c7443'; c.fillRect(x + 1, y + 1, o ? 14 : 6, o ? 6 : 14); c.fillStyle = 'rgba(60,35,10,0.35)'; c.fillRect(x, y, 16, 1); }
    grain(c, W, W, 0.2); const t = toTex(cv); t.repeat.set(3, 3); return t;
  });
}
const WICKER = () => mat('wicker', () => std({ map: wickerTex(), roughness: 0.85, envMapIntensity: 0.3, side: THREE.DoubleSide }));
function displayTex(key, lines) { // Spiegel-/Thermostat-Display
  return cached('disp:' + key, () => {
    const W = 512, H = 256, cv = mkCanvas(W, H), c = cv.getContext('2d');
    c.fillStyle = '#05070a'; c.fillRect(0, 0, W, H);
    lines.forEach(([txt, size, y, col, x = 24, align = 'left']) => { c.fillStyle = col; c.font = `500 ${size}px "IBM Plex Mono", ui-monospace, monospace`; c.textAlign = align; c.fillText(txt, x, y); });
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  });
}

/* ---------- Möbel & Leuchten II ---------- */
function rattanMirror(B, R = 0.3) {
  const g = new THREE.Group();
  const ring = mesh(new THREE.TorusGeometry(R + 0.04, 0.035, 12, 64), WICKER()); ring.scale.z = 0.5; ring.position.z = 0.02; g.add(ring);
  for (let i = 0; i < 28; i++) { const a = (i / 28) * PI * 2; const sp = rod([Math.cos(a) * (R + 0.06), Math.sin(a) * (R + 0.06), 0.018], [Math.cos(a) * (R + 0.16), Math.sin(a) * (R + 0.16), 0.012], 0.006, WICKER(), 6); g.add(sp); }
  const m = makeMirror(B, new THREE.CircleGeometry(R + 0.005, 48)); m.position.z = 0.03; g.add(m);
  return g;
}
function rattanPendant(r = 0.17, len = 0.5) {
  const g = new THREE.Group();
  const sh = mesh(new THREE.SphereGeometry(r, 28, 18, 0, PI * 2, 0, PI * 0.78), WICKER(), { cast: false }); sh.rotation.x = PI; g.add(sh);
  const bulb = sph(0.045, M.lamp('#ffd9a0', 4, 1.6), 16); bulb.position.y = -0.02; g.add(bulb);
  g.add(rod([0, 0, 0], [0, len, 0], 0.004, M.blackPlastic()));
  return g;
}
function edisonPendant(len = 0.55) {
  const g = new THREE.Group();
  g.add(at(cyl(0.04, 0.04, 0.02, M.black(), 20), 0, -0.01, 0));
  g.add(rod([0, 0, 0], [0, -len, 0], 0.004, M.blackPlastic()));
  g.add(at(cyl(0.018, 0.022, 0.06, M.brass(), 16), 0, -len - 0.03, 0));
  const b = lathe([[0, -0.15], [0.02, -0.148], [0.055, -0.11], [0.06, -0.08], [0.03, -0.02], [0.018, 0]], M.lamp('#ffb866', 3.5, 1.1), 24); b.position.y = -len - 0.06; b.castShadow = false; g.add(b);
  return g;
}
function cageSconce() {
  const g = new THREE.Group(), m = M.black();
  const ro = cyl(0.04, 0.04, 0.015, m, 20); ro.rotation.x = PI / 2; ro.position.z = 0.008; g.add(ro);
  g.add(rod([0, 0, 0], [0, 0, 0.12], 0.008, m));
  const bulb = sph(0.04, M.lamp('#ffb866', 3.5, 1.0), 16); bulb.position.set(0, -0.02, 0.15); bulb.castShadow = false; g.add(bulb);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * PI * 2; g.add(rod([0, 0.04, 0.15], [Math.cos(a) * 0.055, -0.04, 0.15 + Math.sin(a) * 0.055], 0.0025, m, 6)); }
  g.add(mesh(new THREE.TorusGeometry(0.055, 0.003, 6, 24), m).translateY(-0.04).translateZ(0.15).rotateX(PI / 2));
  return g;
}
function steelShelf({ w, h, d, boards, steel = M.black(), wood }) { // offenes Stahlregal, Rückseite z=0
  const g = new THREE.Group(), t = 0.02;
  for (const x of [-w / 2 + t / 2, w / 2 - t / 2]) for (const z of [t / 2, d - t / 2]) g.add(slab(x - t / 2, 0, z - t / 2, x + t / 2, h, z + t / 2, steel));
  boards.forEach(y => { g.add(slab(-w / 2, y, 0, w / 2, y + 0.03, d, wood)); g.add(slab(-w / 2, y - 0.02, 0, -w / 2 + t, y, d, steel), slab(w / 2 - t, y - 0.02, 0, w / 2, y, d, steel)); });
  return g;
}
function crittallPanel({ len, h, frame = M.black(), rows = 4, cols = 1 }) { // Glaswand mit Stahlsprossen, entlang +z
  const g = new THREE.Group(), f = 0.03;
  g.add(slab(-0.004, 0, 0, 0.004, h, len, M.glass(), { cast: false }));
  g.add(slab(-0.012, 0, 0, 0.012, h, f, frame), slab(-0.012, 0, len - f, 0.012, h, len, frame), slab(-0.012, 0, 0, 0.012, f, len, frame), slab(-0.012, h - f, 0, 0.012, h, len, frame));
  for (let i = 1; i < rows; i++) { const y = (h * i) / rows; g.add(slab(-0.01, y - 0.009, 0, 0.01, y + 0.009, len, frame)); }
  for (let i = 1; i <= cols; i++) { const z = (len * i) / (cols + 1); g.add(slab(-0.01, 0, z - 0.009, 0.01, h, z + 0.009, frame)); }
  return g;
}
function pipeShower(m) { // Aufputz-Rohrdusche (Industrial), lokal an Wand
  const g = new THREE.Group();
  g.add(rod([-0.16, 1.05, 0.06], [0.16, 1.05, 0.06], 0.02, m));
  for (const x of [-0.16, 0.16]) { g.add(rod([x, 1.05, 0], [x, 1.05, 0.06], 0.018, m)); const hnd = new THREE.Group(); hnd.position.set(x * 0.6, 1.05, 0.085); for (const a of [0, PI / 2]) { const b = rod([-0.035, 0, 0], [0.035, 0, 0], 0.006, m); b.rotation.z = a; hnd.add(b); } hnd.add(at(sph(0.014, m, 12), 0, 0, 0)); g.add(hnd); }
  g.add(rod([0, 1.05, 0.06], [0, 2.08, 0.06], 0.016, m), rod([0, 2.08, 0.06], [0, 2.1, 0.38], 0.014, m));
  g.add(at(cyl(0.13, 0.13, 0.025, m, 40), 0, 2.08, 0.38));
  g.add(rod([0, 1.75, 0.06], [0, 1.75, 0.1], 0.01, m)); const hh = cyl(0.018, 0.022, 0.22, m); hh.position.set(0, 1.62, 0.1); g.add(hh);
  return g;
}
function oliveTree(seed = 21) {
  const g = new THREE.Group(), r = rng(seed), bark = M.paint('#6b5a49');
  g.add(lathe([[0, 0], [0.13, 0], [0.16, 0.3], [0.14, 0.3], [0.12, 0.04], [0, 0.04]], M.paint('#b8673f'), 32));
  g.add(at(cyl(0.135, 0.135, 0.01, M.paint('#4a3a2c'), 24), 0, 0.27, 0));
  g.add(tube([[0, 0.27, 0], [0.02, 0.6, 0.01], [-0.02, 0.9, 0], [0.01, 1.05, 0.02]], 0.022, bark, 24));
  const mats = [];
  for (let k = 0; k < 7; k++) {
    const a = r() * PI * 2, o = new V3(0.01, 0.95 + r() * 0.12, 0.02), tip = new V3(Math.cos(a) * (0.2 + r() * 0.15), 1.05 + r() * 0.35, Math.sin(a) * (0.2 + r() * 0.15));
    g.add(tube([[o.x, o.y, o.z], [(o.x + tip.x) / 2, (o.y + tip.y) / 2 + 0.05, (o.z + tip.z) / 2], [tip.x, tip.y, tip.z]], 0.007, bark, 12));
    for (let i = 0; i < 26; i++) {
      const t = 0.3 + r() * 0.7, p = o.clone().lerp(tip, t).add(new V3((r() - 0.5) * 0.14, (r() - 0.5) * 0.12, (r() - 0.5) * 0.14));
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * PI, r() * PI * 2, r() * PI));
      mats.push([new THREE.Matrix4().compose(p, q, new V3(0.022, 0.07, 0.022)), ['#7d8c6a', '#91a07c', '#6b7a5a', '#a5b08f'][Math.floor(r() * 4)]]);
    }
  }
  const im = new THREE.InstancedMesh(leafGeo('lance'), M.plant('#ffffff'), mats.length);
  mats.forEach(([m4, c], i) => { im.setMatrixAt(i, m4); im.setColorAt(i, new THREE.Color(c)); }); im.castShadow = true; g.add(im);
  return g;
}
function monstera(seed = 31) {
  const g = new THREE.Group(), r = rng(seed);
  g.add(pot({ r: 0.13, h: 0.3, m: M.ceramicMatte('#2f3133') }));
  const lm = mat('monst', () => std({ color: '#2f6a3a', roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 0.6 }));
  const lg = (() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.55, 0.05, 0.6, 0.75, 0, 1); s.bezierCurveTo(-0.6, 0.75, -0.55, 0.05, 0, 0); for (const [x, y] of [[0.22, 0.35], [-0.22, 0.4], [0.2, 0.65], [-0.18, 0.62]]) { const h = new THREE.Path(); h.absellipse(x, y, 0.06, 0.035, 0, PI * 2); s.holes.push(h); } const ge = new THREE.ShapeGeometry(s, 8); const p = ge.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, -x * x * 0.6 - Math.sin(y * PI) * 0.1); } ge.computeVertexNormals(); return ge; })();
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * PI * 2 + r(), L = 0.35 + r() * 0.4, tip = new V3(Math.cos(a) * L * 0.6, 0.28 + L, Math.sin(a) * L * 0.6);
    g.add(tube([[0, 0.28, 0], [tip.x * 0.4, 0.28 + L * 0.7, tip.z * 0.4], [tip.x, tip.y, tip.z]], 0.005, M.plant('#4f7d3a'), 14));
    const lf = mesh(lg, lm); const s = 0.22 + r() * 0.12; lf.scale.setScalar(s); lf.position.copy(tip); lf.rotation.set(-0.9 + r() * 0.4, a + PI / 2, 0); lf.rotateX(-0.6); g.add(lf);
  }
  return g;
}
function duckboard(w, d, m) { const g = new THREE.Group(); const n = Math.floor(d / 0.06); for (let i = 0; i < n; i++) g.add(slab(-w / 2, 0.012, -d / 2 + i * 0.06, w / 2, 0.03, -d / 2 + i * 0.06 + 0.045, m)); for (const x of [-w / 2 + 0.04, w / 2 - 0.04]) g.add(slab(x - 0.02, 0, -d / 2, x + 0.02, 0.012, d / 2, m)); return g; }
