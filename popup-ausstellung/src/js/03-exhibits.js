/* =====================================================================
   THEMENINSELN: Bausteine. Jede Insel entsteht um ihren Mittelpunkt,
   Rückseite bei −z, Besucherseite bei +z. Alles Vorschlag, nichts ist fest.
   ===================================================================== */
const repTex = (t, rx, ry) => { const c = t.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); c.needsUpdate = true; return c; };
const mChrome = new THREE.MeshStandardMaterial({ color: '#d5d9de', metalness: 0.9, roughness: 0.25 });
const mDark = M('#26222c', { roughness: 0.6 });
const mVitrine = new THREE.MeshStandardMaterial({ color: '#cfe6f2', transparent: true, opacity: 0.22, roughness: 0.05, depthWrite: false });
const textPanel = (bg, fg, head) => (g, w, h) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg;
  wrapText(g, head, w / 2, h * 0.2, w * 0.84, h * 0.085, FD, 700);
  g.globalAlpha = 0.45; for (let i = 0; i < 9; i++) g.fillRect(w * 0.1, h * (0.36 + i * 0.062), w * (i % 3 === 2 ? 0.5 : 0.8), h * 0.022); g.globalAlpha = 1;
};

/* ---- 1 · Wohnzimmer (3,2 × 3,0 m) ---- */
function buildWohnzimmer() {
  const g = new THREE.Group();
  const cord = M('#8a5a33', { roughness: 1 }), cord2 = M('#9b6a3f', { roughness: 1 }), teak = M(C.teak, { roughness: 0.55 }), white = M('#f4f1ea', { roughness: 0.4 });
  g.add(box(3.2, 2.4, 0.05, M('#ffffff', { map: repTex(TEX.tapeteA, 6, 4.5) }), 0, 0, -1.46));
  g.add(box(2.5, 0.02, 1.8, M('#ffffff', { map: TEX.teppich, roughness: 1 }), 0, 0, -0.1, false));
  /* Sofa, Rücken zur Fensterfront */
  g.add(box(2.0, 0.2, 0.85, cord, 0, 0.12, 0.85), box(2.0, 0.5, 0.22, cord, 0, 0.32, 1.17), box(0.2, 0.5, 0.85, cord, -1.1, 0.12, 0.85), box(0.2, 0.5, 0.85, cord, 1.1, 0.12, 0.85));
  g.add(box(0.96, 0.14, 0.62, cord2, -0.5, 0.32, 0.74), box(0.96, 0.14, 0.62, cord2, 0.5, 0.32, 0.74));
  const p1 = box(0.36, 0.36, 0.12, M(C.orange, { roughness: 1 }), -0.62, 0.46, 1.0); p1.rotation.x = 0.25; const p2 = box(0.36, 0.36, 0.12, M(C.lila, { roughness: 1 }), 0.6, 0.46, 1.0); p2.rotation.x = 0.25; g.add(p1, p2);
  /* Sideboard mit Fernseher: Monitor in bedruckter Forex-Einhausung */
  g.add(box(1.5, 0.4, 0.42, teak, -0.3, 0.14, -1.18));
  for (const x of [-0.95, 0.35]) for (const z of [-1.33, -1.03]) g.add(cyl(0.02, 0.14, mDark, x, 0, z, 8));
  g.add(box(0.74, 0.52, 0.4, M('#6e4a2c', { roughness: 0.5 }), -0.3, 0.54, -1.18));
  const scr = sign(0.44, 0.34, (c, w, h) => {
    ['#e8e8e8', '#e6d21c', '#22c7c7', '#2bbf3a', '#c531c5', '#d22a2a', '#2a3fd2'].forEach((col, i) => { c.fillStyle = col; c.fillRect(i * w / 7, 0, w / 7 + 1, h * 0.72); });
    c.fillStyle = '#111'; c.fillRect(0, h * 0.72, w, h * 0.28); c.fillStyle = '#eee'; wrapText(c, 'SENDEPAUSE', w / 2, h * 0.86, w, h * 0.13, FB, 700);
  }, { emissive: true });
  scr.position.set(-0.41, 0.8, -0.975); g.add(scr);
  g.add(box(0.17, 0.36, 0.01, M('#cfc8ba', { roughness: 0.4 }), -0.04, 0.62, -0.978, false));
  for (const y of [0.9, 0.78]) { const k = cyl(0.028, 0.03, mDark, -0.04, 0, 0, 16); k.rotation.x = PI / 2; k.position.set(-0.04, y, -0.965); g.add(k); }
  for (const s of [-1, 1]) { const a = cyl(0.006, 0.5, mChrome, 0, 0, 0, 6); a.position.set(-0.3 + s * 0.12, 1.28, -1.2); a.rotation.z = -s * 0.5; g.add(a); }
  /* Stehlampe, Beistelltisch, Gummibaum */
  g.add(cyl(0.16, 0.03, mDark, 1.32, 0, -0.95), cyl(0.014, 1.5, mChrome, 1.32, 0.03, -0.95, 8));
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 12, 0, PI * 2, 0, PI / 2), M(C.orange, { side: THREE.DoubleSide, roughness: 0.4 })); sh.position.set(1.32, 1.45, -0.95); sh.castShadow = true; g.add(sh);
  g.add(cyl(0.2, 0.025, white, 1.4, 0.45, 0.45), cyl(0.03, 0.45, white, 1.4, 0, 0.45, 12), cyl(0.14, 0.02, white, 1.4, 0, 0.45));
  g.add(cyl(0.15, 0.3, M(C.orange, { roughness: 0.5 }), -1.33, 0, -1.02, 20, 0.18), cyl(0.012, 0.9, M('#5b4a2a'), -1.33, 0.3, -1.02, 6));
  const leaf = M('#2f6b3a', { roughness: 0.6 }), rr = rng(5);
  for (let i = 0; i < 9; i++) { const l = ball(0.13, leaf, -1.33 + (rr() - 0.5) * 0.4, 0.55 + i * 0.085, -1.02 + (rr() - 0.5) * 0.4); l.scale.set(1, 0.35, 0.6); l.rotation.set(rr(), rr() * 6, rr()); g.add(l); }
  return g;
}

/* ---- 2 · Mero-System (3 × 2 m, 2 m hoch) ---- */
function buildMero() {
  const g = new THREE.Group(), nx = 3, nz = 2, m = 1.0, ys = [0.06, 1.03, 2.0], ox = -nx * m / 2, oz = -nz * m / 2;
  const P = (i, j, k) => new V3(ox + i * m, ys[j], oz + k * m);
  const struts = [], nodes = [];
  for (let i = 0; i <= nx; i++) for (let j = 0; j < 3; j++) for (let k = 0; k <= nz; k++) {
    nodes.push(P(i, j, k));
    if (i < nx) struts.push([P(i, j, k), P(i + 1, j, k)]);
    if (k < nz) struts.push([P(i, j, k), P(i, j, k + 1)]);
    if (j < 2) struts.push([P(i, j, k), P(i, j + 1, k)]);
  }
  const d = new THREE.Object3D(), up = new V3(0, 1, 0);
  const sm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.014, 0.014, 1, 8), mChrome, struts.length);
  struts.forEach(([a, b], n) => { d.position.copy(a).add(b).multiplyScalar(0.5); d.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize()); d.scale.set(1, a.distanceTo(b), 1); d.updateMatrix(); sm.setMatrixAt(n, d.matrix); });
  const nm = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 14, 10), mChrome, nodes.length);
  d.quaternion.identity(); d.scale.set(1, 1, 1);
  nodes.forEach((p, n) => { d.position.copy(p); d.updateMatrix(); nm.setMatrixAt(n, d.matrix); });
  sm.castShadow = nm.castShadow = true; g.add(sm, nm);
  const txt = (head, bg = '#f6f3ee', fg = '#2b2533') => new THREE.MeshStandardMaterial({ map: ctex(256, 256, textPanel(bg, fg, head)), roughness: 0.8 });
  const panelZ = (i, j, k, mat) => g.add(box(0.93, 0.9, 0.02, mat, ox + i * m + 0.5, ys[j] + 0.035, oz + k * m));
  const panelX = (i, j, k, mat) => g.add(box(0.02, 0.9, 0.93, mat, ox + i * m, ys[j] + 0.035, oz + k * m + 0.5));
  panelZ(0, 0, 0, M(C.orange)); panelZ(1, 0, 0, txt('Exponate')); panelZ(2, 0, 0, M(C.lila));
  panelZ(0, 1, 0, txt('Dreieich um 1977')); panelZ(1, 1, 0, M(C.gelb)); panelZ(2, 1, 0, txt('Stadt im Wandel'));
  panelX(0, 1, 0, M(C.lila)); panelX(0, 0, 1, txt('Texte', C.orange, '#fff')); panelX(3, 0, 0, M(C.orange)); panelX(3, 1, 1, txt('Objekte'));
  const white = M('#f4f1ea', { roughness: 0.5 });
  [[0.5, 1.45, C.gelb], [1.5, 1.45, C.pink], [2.5, 0.5, C.tuerkis]].forEach(([x, z, col], i) => {
    g.add(box(0.5, 0.9, 0.5, white, ox + x, 0, oz + z), box(0.5, 0.42, 0.5, mVitrine, ox + x, 0.9, oz + z, false));
    g.add(i === 1 ? ball(0.1, M(col, { roughness: 0.3 }), ox + x, 1.02, oz + z) : box(0.16, 0.2, 0.12, M(col, { roughness: 0.4 }), ox + x, 0.9, oz + z));
  });
  return g;
}

/* ---- 3 · Selfie-Station als Koje (2,5 × 2,1 m), zwei tapezierte Wände ---- */
function buildSelfie() {
  const g = new THREE.Group();
  g.add(box(2.5, 2.4, 0.04, M('#ffffff', { map: repTex(TEX.tapeteB, 5, 4.8) }), 0, 0, -1.03));
  g.add(box(0.04, 2.4, 2.1, M('#ffffff', { map: repTex(TEX.tapeteB, 4.2, 4.8) }), 1.23, 0, 0));
  g.add(cyl(0.78, 0.015, M(C.pink, { roughness: 1 }), 0.05, 0, 0.1, 48));
  /* Kleiderständer mit Kostümen */
  g.add(cyl(0.015, 1.55, mChrome, -0.9, 0, -0.65, 8), cyl(0.015, 1.55, mChrome, -0.9, 0, 0.55, 8), box(0.025, 0.025, 1.24, mChrome, -0.9, 1.53, -0.05));
  [C.orange, C.gelb, C.tuerkis, C.pink, C.oliv, C.lila, '#f3ead7'].forEach((col, i) => g.add(box(0.42, 0.78 + (i % 3) * 0.08, 0.035, M(col, { roughness: 1 }), -0.9, 0.62 - (i % 3) * 0.08, -0.56 + i * 0.165)));
  /* Perücken auf Köpfen */
  g.add(box(0.75, 0.78, 0.3, M('#f4f1ea', { roughness: 0.5 }), 0.62, 0, -0.84));
  [C.orange, C.dunkel, C.gelb].forEach((col, i) => {
    const x = 0.38 + i * 0.24;
    g.add(cyl(0.025, 0.08, mDark, x, 0.78, -0.84, 8), ball(0.085, M('#e9d3bd'), x, 0.94, -0.84));
    const w = ball(0.115, M(col, { roughness: 1 }), x, 0.975, -0.85); w.scale.set(1, 0.9, 1.05); g.add(w);
  });
  /* Discokugel, Ringlicht auf Stativ, Schild */
  const disco = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 2), new THREE.MeshStandardMaterial({ color: '#e8ecf2', metalness: 1, roughness: 0.12, flatShading: true }));
  disco.position.set(0.1, 2.08, 0.05); disco.castShadow = true; g.add(disco, box(0.006, 0.26, 0.006, mDark, 0.1, 2.24, 0.05, false));
  g.add(cyl(0.012, 1.35, mDark, 0.35, 0, 0.92, 8));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 10, 32), new THREE.MeshBasicMaterial({ color: '#fff6e0' })); ring.position.set(0.35, 1.5, 0.92); g.add(ring);
  const s = sign(1.3, 0.3, (c, w, h) => { c.fillStyle = C.gelb; c.fillRect(0, 0, w, h); c.fillStyle = '#3b1d57'; wrapText(c, 'SELFIE 1977', w / 2, h / 2, w, h * 0.5, FD, 800); });
  s.position.set(-0.1, 2.12, -1.005); g.add(s);
  return g;
}
function buildStellwand() {
  const g = new THREE.Group(), m = M('#e9e6ef', { roughness: 0.9 });
  g.add(box(2.2, 1.95, 0.05, m, 0, 0.08, 0), box(2.2, 0.12, 0.054, M(C.orange), 0, 1.75, 0, false));
  for (const x of [-0.95, 0.95]) g.add(box(0.06, 0.08, 0.5, mDark, x, 0, 0));
  return g;
}

/* ---- 4 · Statistik: Drehwürfel „1970 / heute“ (2,3 × 0,5 m) ---- */
function buildStatistik() {
  const g = new THREE.Group(), r = rng(21);
  const face = (bg, fg, t, size) => new THREE.MeshStandardMaterial({ roughness: 0.6, map: ctex(256, 256, (c, w) => { c.fillStyle = bg; c.fillRect(0, 0, w, w); c.fillStyle = fg; wrapText(c, t, w / 2, w / 2, w * 0.9, size, FD, 800); }) });
  const mats = [face(C.lila, '#fff', '1970', 70), face(C.orange, '#fff', 'heute', 60), face(C.gelb, '#3b1d57', '?', 150)];
  [-0.9, -0.3, 0.3, 0.9].forEach((x, i) => {
    const outer = i === 0 || i === 3;
    g.add(cyl(0.17, 0.03, mDark, x, 0, 0), cyl(0.018, outer ? 1.9 : 1.6, mChrome, x, 0.03, 0, 8));
    for (let j = 0; j < 3; j++) { const c = box(0.3, 0.3, 0.3, mats[(i + j) % 3], x, 0.5 + j * 0.34, 0); c.rotation.y = Math.round(r() * 4) * PI / 8 - PI / 4; g.add(c); }
  });
  const draw = (c, w, h) => { c.fillStyle = '#2b2533'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; wrapText(c, 'Wie gut kennst du Dreieich?', w / 2, h / 2, w * 0.95, h * 0.36, FD, 700); };
  const a = sign(2.1, 0.26, draw), b = sign(2.1, 0.26, draw);
  a.position.set(0, 1.78, 0.012); b.position.set(0, 1.78, -0.012); b.rotation.y = PI; g.add(a, b);
  return g;
}

/* ---- 5 · Litfaßsäule: Größe kommt aus dem Rechner ---- */
function buildLitfass({ d, h, n, rows, gap }) {
  const g = new THREE.Group(), r = d / 2, U = PI * d, rr = rng(9);
  const pal = [C.orange, C.lila, C.gelb, C.pink, C.tuerkis, C.oliv, '#f3ead7', '#d22a2a'];
  const tex = ctex(2048, 1024, (c, w, hh) => {
    c.fillStyle = '#b9b2a4'; c.fillRect(0, 0, w, hh);
    const pw = 0.42 / U * w, ph = 0.594 / h * hh, cw = w / Math.max(n, 1), top = (hh - rows * (ph + gap / h * hh)) / 2;
    for (let i = 0; i < n; i++) for (let j = 0; j < rows; j++) {
      const x = i * cw + (cw - pw) / 2, y = top + j * (ph + gap / h * hh) + gap / h * hh / 2, bg = pal[Math.floor(rr() * pal.length)], fg = pal[Math.floor(rr() * pal.length)];
      c.fillStyle = bg; c.fillRect(x, y, pw, ph);
      c.fillStyle = fg === bg ? '#2b2533' : fg; c.beginPath(); c.arc(x + pw / 2, y + ph * 0.38, pw * 0.28, 0, 7); c.fill();
      c.fillStyle = bg === '#f3ead7' || bg === C.gelb ? '#2b2533' : '#fff';
      c.fillRect(x + pw * 0.12, y + ph * 0.68, pw * 0.76, ph * 0.06); c.fillRect(x + pw * 0.12, y + ph * 0.79, pw * 0.5, ph * 0.035); c.fillRect(x + pw * 0.12, y + ph * 0.86, pw * 0.62, ph * 0.035);
    }
  });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 56), [new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }), mDark, mDark]);
  body.position.y = 0.22 + h / 2; shade(body); g.add(body);
  g.add(cyl(r + 0.035, 0.22, mDark, 0, 0, 0, 48), cyl(r + 0.06, 0.07, mDark, 0, 0.22 + h, 0, 48), cyl(r + 0.03, 0.13, M('#3d6b4f', { roughness: 0.5 }), 0, 0.29 + h, 0, 48, 0.06), ball(0.05, mDark, 0, 0.45 + h, 0));
  return g;
}

/* ---- 6 · Gebietsreform: orange Wand an der Brandmauer, runde Forexplatten Ø 50/60 ---- */
const KREIS_TITEL = ['Gebietsreform', '1. Januar 1977', 'Sprendlingen', 'Dreieichenhain', 'Götzenhain', 'Offenthal', 'Buchschlag', 'Der Name Dreieich', 'Vorher', 'Nachher', 'Stimmen'];
function kreisLayout(n) {
  const r = rng(11), out = [];
  for (let i = 0; i < n; i++) {
    const rad = i % 3 === 0 ? 0.3 : 0.25;
    for (let t = 0; t < 600; t++) {
      const z = 0.55 + r() * 7.55, y = 0.72 + r() * 1.38;
      if (out.every(o => Math.hypot(o.z - z, o.y - y) > o.rad + rad + 0.1)) { out.push({ z, y, rad }); break; }
    }
  }
  return out;
}
function buildGebietsreform(n) {
  const g = new THREE.Group(), x = R.W - 0.012;
  g.add(wall(x, 0.02, x, R.door.z - 0.02, M('#f2690d', { roughness: 0.95 })));
  const styles = [['#ffffff', '#3b1d57'], ['#f5b70a', '#3b1d57'], ['#5f2b84', '#ffffff'], ['#f3ead7', '#b8430a']];
  kreisLayout(n).forEach((k, i) => {
    const [bg, fg] = styles[i % styles.length], title = KREIS_TITEL[i] || `Text ${i + 1}`;
    const t = ctex(256, 256, (c, w) => {
      c.fillStyle = bg; c.beginPath(); c.arc(w / 2, w / 2, w / 2, 0, 7); c.fill(); c.fillStyle = fg;
      wrapText(c, title, w / 2, w * 0.36, w * 0.74, 27, FD, 700);
      c.globalAlpha = 0.4; for (let j = 0; j < 4; j++) c.fillRect(w * 0.26, w * (0.56 + j * 0.065), w * (j === 3 ? 0.3 : 0.48), w * 0.022);
    });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(k.rad, k.rad, 0.012, 48), [M(bg), new THREE.MeshStandardMaterial({ map: t, roughness: 0.75 }), M(bg)]);
    m.rotation.z = PI / 2; m.position.set(R.W - 0.03, k.y, k.z); g.add(m);   // Deckfläche zeigt in den Raum
  });
  return g;
}

/* ---- 7 · Slide-Show auf Medienstelen (2,8 × 0,7 m) ---- */
function buildStelen() {
  const g = new THREE.Group();
  const shot = (label, sky, land, tint) => (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = land; const rr = rng(label.length * 13);
    for (let i = 0; i < 9; i++) { const x = i * w / 8 - 20, bw = w / 7, bh = h * (0.12 + rr() * 0.16); c.fillRect(x, h * 0.72 - bh, bw, bh + h * 0.3); c.beginPath(); c.moveTo(x - 4, h * 0.72 - bh); c.lineTo(x + bw / 2, h * 0.72 - bh - bw * 0.42); c.lineTo(x + bw + 4, h * 0.72 - bh); c.fill(); }
    c.fillStyle = tint; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; wrapText(c, label, w / 2, h * 0.88, w, h * 0.075, FD, 700);
  };
  const scr = [shot('1977', ['#d9c9a3', '#f1e6c9'], '#7a644a', 'rgba(120,80,30,.18)'), shot('2000', ['#9fc3e0', '#e7eef2'], '#5c6b78', 'rgba(0,0,0,0)'), shot('heute', ['#5aa7e6', '#dff1ff'], '#3f7a58', 'rgba(0,0,0,0)')];
  [-0.95, 0, 0.95].forEach((x, i) => {
    g.add(box(0.56, 0.03, 0.44, mDark, x, 0, 0), box(0.64, 1.85, 0.08, mDark, x, 0.03, 0));
    const s = sign(0.56, 1.0, scr[i], { emissive: true }); s.position.set(x, 1.3, 0.042); g.add(s);
  });
  g.add(cyl(0.2, 0.42, M(C.orange, { roughness: 0.7 }), -0.5, 0, 1.25), cyl(0.2, 0.42, M(C.lila, { roughness: 0.7 }), 0.5, 0, 1.25));
  return g;
}

/* ---- 8 · Zukunft / Lieblingsplatz: Pinnwand mit Stadtplan + Kartentisch (2,6 × 1,4 m) ---- */
function buildZukunft() {
  const g = new THREE.Group(), white = M('#f4f1ea', { roughness: 0.5 });
  g.add(box(2.5, 1.5, 0.04, white, 0, 0.55, -0.4), box(0.05, 0.55, 0.4, mDark, -1.1, 0, -0.4), box(0.05, 0.55, 0.4, mDark, 1.1, 0, -0.4));
  const map = sign(2.42, 1.42, (c, w, h) => {
    c.fillStyle = '#f3ead7'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#3b1d57'; c.textAlign = 'left'; c.font = `700 ${h * 0.085}px ${FD}`; c.textBaseline = 'top'; c.fillText('Mein Lieblingsplatz', w * 0.03, h * 0.05);
    const blob = (x, y, rx, ry, col, name) => { c.fillStyle = col; c.beginPath(); c.ellipse(w * x, h * y, w * rx, h * ry, 0.3, 0, 7); c.fill(); c.fillStyle = '#2b2533'; c.font = `600 ${h * 0.043}px ${FB}`; c.textAlign = 'center'; c.fillText(name, w * x, h * y - h * 0.025); };
    blob(0.1, 0.56, 0.075, 0.12, '#cfe3b4', 'Buchschlag'); blob(0.3, 0.36, 0.11, 0.15, '#f6c9a0', 'Sprendlingen'); blob(0.3, 0.76, 0.1, 0.13, '#d9c4ec', 'Dreieichenhain');
    blob(0.52, 0.52, 0.085, 0.14, '#f7e0a0', 'Götzenhain'); blob(0.54, 0.87, 0.07, 0.085, '#bfe1e4', 'Offenthal');
    c.fillStyle = '#5f2b84'; c.fillRect(w * 0.66, 0, w * 0.34, h); c.fillStyle = '#fff'; wrapText(c, 'Dreieich 2077', w * 0.83, h * 0.14, w * 0.3, h * 0.075, FD, 700); wrapText(c, 'Was wünschst du dir?', w * 0.83, h * 0.3, w * 0.3, h * 0.055, FB, 600);
    const rr = rng(4); [C.gelb, '#fff', C.orange, '#fff', C.gelb, C.pink].forEach((col, i) => { c.fillStyle = col; c.save(); c.translate(w * (0.71 + (i % 2) * 0.15), h * (0.44 + Math.floor(i / 2) * 0.18)); c.rotate((rr() - 0.5) * 0.3); c.fillRect(0, 0, w * 0.11, h * 0.13); c.restore(); });
  });
  map.position.set(0, 1.3, -0.378); g.add(map);
  const rr = rng(8), pins = [C.orange, C.pink, C.lila, C.tuerkis];
  for (let i = 0; i < 18; i++) g.add(ball(0.022, M(pins[i % 4], { roughness: 0.3 }), -1.1 + rr() * 1.45, 0.85 + rr() * 0.95, -0.37));
  g.add(cyl(0.38, 0.03, white, 0, 1.05, 0.45), cyl(0.035, 1.05, mChrome, 0, 0, 0.45, 12), cyl(0.26, 0.02, mDark, 0, 0, 0.45));
  g.add(box(0.16, 0.035, 0.11, M(C.gelb), -0.14, 1.08, 0.4), box(0.16, 0.025, 0.11, M('#fff'), 0.02, 1.08, 0.58), box(0.22, 0.22, 0.22, M(C.lila, { roughness: 0.5 }), 0.17, 1.08, 0.36), box(0.14, 0.004, 0.02, mDark, 0.17, 1.3, 0.36, false));
  return g;
}

/* ---- Bestand & Ausstattung ---- */
function buildTheke(orange) {
  const g = new THREE.Group(), front = M(orange ? C.orange : '#2f3b4f', { roughness: 0.45 }), top = M('#f4f2ee', { roughness: 0.35 });
  g.add(box(3.2, 0.86, 0.65, front, 0, 0, 0), box(3.28, 0.04, 0.73, top, 0, 0.86, 0));
  g.add(box(0.65, 0.86, 1.9, front, -1.275, 0, -1.275), box(0.73, 0.04, 1.94, top, -1.275, 0.86, -1.255));
  if (orange) { const s = sign(1.7, 0.36, (c, w, h) => { c.fillStyle = '#fff'; wrapText(c, '50 Jahre Dreieich', w / 2, h / 2, w, h * 0.42, FD, 700); c.globalCompositeOperation = 'destination-over'; c.fillStyle = C.orange; c.fillRect(0, 0, w, h); }); s.position.set(0.3, 0.46, 0.327); g.add(s); }
  return g;
}
function buildFahne() {
  const g = new THREE.Group();
  const t = ctex(480, 760, (c, w, h) => {
    c.fillStyle = C.orange; c.fillRect(0, 0, w, h); c.fillStyle = '#5f2b84'; c.beginPath(); c.arc(w / 2, h * 0.5, w * 0.36, 0, 7); c.fill();
    c.fillStyle = '#fff'; wrapText(c, 'Willkommen', w / 2, h * 0.14, w * 0.94, w * 0.105, FD, 700);
    c.fillStyle = C.gelb; wrapText(c, '50', w / 2, h * 0.5, w, w * 0.34, FD, 800);
    c.fillStyle = '#fff'; wrapText(c, 'Jahre Dreieich', w / 2, h * 0.86, w * 0.9, w * 0.095, FB, 700);
  });
  const fm = new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.9), fm), f2 = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.9), fm);
  f.position.set(0, 1.4, 0.004); f2.position.set(0, 1.4, -0.004); f2.rotation.y = PI; f.castShadow = true; g.add(f, f2);
  g.add(box(1.26, 0.025, 0.025, mDark, 0, 2.35, 0, false), box(0.005, 0.13, 0.005, mDark, -0.55, 2.37, 0, false), box(0.005, 0.13, 0.005, mDark, 0.55, 2.37, 0, false));
  return g;
}
function buildKissen() {
  const g = new THREE.Group(), mo = M(C.orange, { roughness: 1 }), ml = M(C.lila, { roughness: 1 }), r = rng(2); let n = 0;
  const put = (x, z, ry) => { const k = box(0.48, 0.09, 0.34, n % 2 ? ml : mo, x, R.SILL, z); k.rotation.y = ry + (r() - 0.5) * 0.2; g.add(k); n++; };
  for (let x = 0.75; x < R.xRet - 0.4; x += 1.2) if ([R.colX, ...R.frontX].every(c => Math.abs(c - x) > 0.42)) put(x, R.zG - 0.2, 0);
  for (let z = R.zWW + 0.6; z < R.zG - 0.8; z += 1.2) if (R.westZ.every(c => Math.abs(c - z) > 0.42)) put(R.xG + 0.2, z, PI / 2);
  g.userData.count = n;
  return g;
}
function buildFigur(col = '#8f879c', h = 1.72) {
  const g = new THREE.Group(), m = M(col, { roughness: 0.9 });
  g.add(cyl(0.13, 0.84, m, 0, 0, 0, 14, 0.16), cyl(0.2, h - 0.84 - 0.3, m, 0, 0.84, 0, 14, 0.15), ball(0.115, m, 0, h - 0.115, 0));
  return g;
}
