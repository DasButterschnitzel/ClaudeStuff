/* =====================================================================
   THEMENINSELN: Bausteine. Jede Insel entsteht um ihren Mittelpunkt,
   Rückseite bei −z, Besucherseite bei +z. Alles Vorschlag, nichts ist fest.
   ===================================================================== */
const repTex = (t, rx, ry) => { const c = t.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); c.needsUpdate = true; return c; };
const mChrome = new THREE.MeshStandardMaterial({ color: '#dfe3e8', metalness: 1, roughness: 0.16 });
const mDark = M('#26222c', { roughness: 0.6 });
const mWhite = M('#f4f1ea', { roughness: 0.45 });
const mVitrine = new THREE.MeshPhysicalMaterial({ color: '#d8ecf5', transparent: true, opacity: 0.18, roughness: 0.03, metalness: 0, depthWrite: false, side: THREE.DoubleSide });
const glassBox = (w, h, d, x, y, z) => { const o = box(w, h, d, mVitrine, x, y, z, false); o.userData.noAO = true; o.receiveShadow = false; return o; };
const textPanel = (bg, fg, head) => (g, w, h) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg;
  wrapText(g, head, w / 2, h * 0.2, w * 0.84, h * 0.095, FD, 700);
  g.globalAlpha = 0.45; for (let i = 0; i < 9; i++) g.fillRect(w * 0.1, h * (0.36 + i * 0.062), w * (i % 3 === 2 ? 0.5 : 0.8), h * 0.022); g.globalAlpha = 1;
};
/* Platzhalter für ein historisches Foto: Dächer im Raster, Passepartout, Bildzeile */
const photoPanel = (seed, sky, land) => (g, w, h) => {
  const r = rng(seed); g.fillStyle = '#f6f3ee'; g.fillRect(0, 0, w, h);
  const x0 = w * 0.07, y0 = h * 0.07, pw = w * 0.86, ph = h * 0.68;
  const gr = g.createLinearGradient(0, y0, 0, y0 + ph); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); g.fillStyle = gr; g.fillRect(x0, y0, pw, ph);
  g.save(); g.beginPath(); g.rect(x0, y0, pw, ph); g.clip(); g.fillStyle = land;
  for (let i = 0; i < 7; i++) { const x = x0 + i * pw / 6 - 14, bw = pw / 5, bh = ph * (0.18 + r() * 0.26); g.fillRect(x, y0 + ph - bh, bw, bh); g.beginPath(); g.moveTo(x - 3, y0 + ph - bh); g.lineTo(x + bw / 2, y0 + ph - bh - bw * 0.45); g.lineTo(x + bw + 3, y0 + ph - bh); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.16)'; for (let y = y0; y < y0 + ph; y += 6) for (let x = x0 + (y % 12 ? 3 : 0); x < x0 + pw; x += 6) g.fillRect(x, y, 2, 2);
  g.restore(); g.fillStyle = '#2b2533'; g.globalAlpha = 0.55; g.fillRect(x0, h * 0.82, pw * 0.7, h * 0.025); g.fillRect(x0, h * 0.875, pw * 0.45, h * 0.02); g.globalAlpha = 1;
};
const numPanel = (bg, fg, t) => (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; wrapText(g, t, w / 2, h * 0.52, w, h * 0.3, FD, 800); };
const texMat = (draw, res = 256) => new THREE.MeshStandardMaterial({ map: ctex(res, res, draw), roughness: 0.75 });

/* ---- Kleine Exponate der 1970er ---- */
function exTelefon(col) {
  const g = new THREE.Group(), m = M(col, { roughness: 0.3 });
  g.add(rbox(0.2, 0.07, 0.17, m, 0, 0, 0, 0.025));
  const dial = cyl(0.052, 0.012, mWhite, 0, 0, 0, 24); dial.rotation.x = 0.5; dial.position.set(0, 0.075, 0.035); g.add(dial);
  g.add(rbox(0.24, 0.035, 0.045, m, 0, 0.085, -0.04, 0.016), rbox(0.05, 0.05, 0.055, m, -0.095, 0.065, -0.04, 0.02), rbox(0.05, 0.05, 0.055, m, 0.095, 0.065, -0.04, 0.02));
  return g;
}
function exPlatte(col) {
  const g = new THREE.Group();
  const d = cyl(0.15, 0.004, M('#141218', { roughness: 0.35 }), 0, 0, 0, 40), l = cyl(0.05, 0.006, M(col, { roughness: 0.6 }), 0, 0, 0, 24);
  for (const o of [d, l]) { o.rotation.x = PI / 2 - 0.22; o.position.set(0, 0.155, 0); g.add(o); }
  g.add(box(0.2, 0.012, 0.07, mWhite, 0, 0, 0.02));
  return g;
}
function exKamera() {
  const g = new THREE.Group(); g.add(rbox(0.15, 0.09, 0.055, mDark, 0, 0, 0, 0.012), box(0.06, 0.02, 0.04, mChrome, -0.02, 0.09, 0));
  const lens = cyl(0.032, 0.05, mChrome, 0, 0, 0, 20); lens.rotation.x = PI / 2; lens.position.set(0.01, 0.045, 0.05); g.add(lens);
  return g;
}
function exRadio() {
  const g = new THREE.Group(); g.add(rbox(0.32, 0.19, 0.1, M(C.teak, { roughness: 0.5 }), 0, 0, 0, 0.02));
  const f = sign(0.27, 0.14, (c, w, h) => { c.fillStyle = '#d9cfbd'; c.fillRect(0, 0, w, h); c.fillStyle = '#5b4a36'; for (let y = 4; y < h; y += 5) c.fillRect(3, y, w * 0.58, 2); c.fillStyle = '#f3ead7'; c.fillRect(w * 0.66, h * 0.15, w * 0.3, h * 0.28); c.fillStyle = C.orange; c.fillRect(w * 0.8, h * 0.15, 2, h * 0.28); }, { res: 320 });
  f.position.set(0, 0.095, 0.0505); g.add(f);
  const k = cyl(0.018, 0.014, mChrome, 0, 0, 0, 14); k.rotation.x = PI / 2; k.position.set(0.1, 0.045, 0.055); g.add(k);
  return g;
}
function exKanne(col) {
  const g = new THREE.Group(), m = M(col, { roughness: 0.25 });
  g.add(cyl(0.06, 0.17, m, 0, 0, 0, 24, 0.045), cyl(0.047, 0.012, mDark, 0, 0.17, 0, 24), ball(0.015, mDark, 0, 0.195, 0));
  const sp = cyl(0.012, 0.1, m, 0, 0, 0, 10, 0.008); sp.rotation.z = -0.7; sp.position.set(0.075, 0.11, 0); g.add(sp);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 8, 16, PI), mDark); h.rotation.z = PI / 2; h.position.set(-0.06, 0.09, 0); g.add(h);
  return g;
}
function exPokal() { const g = new THREE.Group(); g.add(cyl(0.05, 0.02, mDark, 0, 0, 0, 20), cyl(0.012, 0.09, mChrome, 0, 0.02, 0, 10), cyl(0.03, 0.1, mChrome, 0, 0.11, 0, 20, 0.06)); return g; }
function exOrtsschild() {
  return sign(0.56, 0.36, (c, w, h) => { c.fillStyle = '#f5cf1c'; c.fillRect(0, 0, w, h); c.strokeStyle = '#17141b'; c.lineWidth = h * 0.045; c.strokeRect(h * 0.05, h * 0.05, w - h * 0.1, h * 0.9); c.fillStyle = '#17141b'; wrapText(c, 'Dreieich', w / 2, h * 0.42, w * 0.9, h * 0.3, FB, 700); wrapText(c, 'Kreis Offenbach', w / 2, h * 0.74, w * 0.9, h * 0.12, FB, 600); }, { res: 400 });
}

/* ---- 1 · Wohnzimmer (3,2 × 3,0 m) ---- */
function buildWohnzimmer() {
  const g = new THREE.Group();
  const cord = M('#8a5a33', { roughness: 1 }), cord2 = M('#a06c40', { roughness: 1 }), teak = M(C.teak, { roughness: 0.5 }), brass = new THREE.MeshStandardMaterial({ color: '#c9a24a', metalness: 0.9, roughness: 0.3 });
  g.add(box(3.2, 2.4, 0.05, M('#ffffff', { map: repTex(TEX.tapeteA, 6, 4.5) }), 0, 0, -1.46));
  g.add(box(2.5, 0.025, 1.8, M('#ffffff', { map: TEX.teppich, roughness: 1 }), 0, 0, -0.1, false));
  /* Sofa, Rücken zur Fensterfront */
  g.add(rbox(2.0, 0.22, 0.86, cord, 0, 0.1, 0.85, 0.06), rbox(2.0, 0.52, 0.24, cord, 0, 0.3, 1.16, 0.09), rbox(0.22, 0.5, 0.86, cord, -1.1, 0.1, 0.85, 0.09), rbox(0.22, 0.5, 0.86, cord, 1.1, 0.1, 0.85, 0.09));
  g.add(rbox(0.97, 0.16, 0.62, cord2, -0.495, 0.3, 0.74, 0.06), rbox(0.97, 0.16, 0.62, cord2, 0.495, 0.3, 0.74, 0.06));
  for (const [x, col, rz] of [[-0.66, C.orange, 0.12], [0.62, C.lila, -0.1], [0.28, C.gelb, 0.06]]) { const p = rbox(0.36, 0.34, 0.13, M(col, { roughness: 1 }), x, 0.46, 0.99, 0.06); p.rotation.set(0.28, 0, rz); g.add(p); }
  for (const x of [-1.05, 1.05]) for (const z of [0.5, 1.2]) g.add(cyl(0.025, 0.1, mDark, x, 0, z, 10));
  /* Couchtisch: Rauchglas auf Chrom */
  const top = cyl(0.42, 0.016, new THREE.MeshPhysicalMaterial({ color: '#5a4636', transparent: true, opacity: 0.55, roughness: 0.05 }), 0, 0.36, -0.12, 40); top.scale.z = 0.62; top.userData.noAO = true; g.add(top);
  for (const [x, z] of [[-0.26, -0.26], [0.26, -0.26], [-0.26, 0.02], [0.26, 0.02]]) g.add(cyl(0.012, 0.36, mChrome, x, 0, z, 8));
  g.add(cyl(0.085, 0.045, M(C.orange, { roughness: 0.3 }), -0.12, 0.376, -0.1, 20, 0.11), box(0.2, 0.012, 0.27, M('#f3ead7'), 0.16, 0.376, -0.14));
  /* Sideboard mit Fernseher: Monitor in bedruckter Forex-Einhausung */
  g.add(rbox(1.5, 0.4, 0.42, teak, -0.3, 0.14, -1.18, 0.015), box(0.48, 0.34, 0.01, M('#8d5c33', { roughness: 0.5 }), -0.78, 0.17, -0.966, false), box(0.48, 0.34, 0.01, M('#8d5c33', { roughness: 0.5 }), -0.27, 0.17, -0.966, false));
  for (const x of [-0.95, 0.35]) for (const z of [-1.33, -1.03]) g.add(cyl(0.022, 0.14, mDark, x, 0, z, 8, 0.014));
  g.add(rbox(0.76, 0.54, 0.4, M('#6e4a2c', { roughness: 0.45 }), -0.3, 0.54, -1.18, 0.05));
  const scr = sign(0.44, 0.34, (c, w, h) => {
    ['#e8e8e8', '#e6d21c', '#22c7c7', '#2bbf3a', '#c531c5', '#d22a2a', '#2a3fd2'].forEach((col, i) => { c.fillStyle = col; c.fillRect(i * w / 7, 0, w / 7 + 1, h * 0.72); });
    c.fillStyle = '#111'; c.fillRect(0, h * 0.72, w, h * 0.28); c.fillStyle = '#eee'; wrapText(c, 'SENDEPAUSE', w / 2, h * 0.86, w, h * 0.13, FB, 700);
  }, { emissive: true });
  scr.position.set(-0.42, 0.81, -0.977); g.add(scr);
  g.add(box(0.5, 0.4, 0.012, mDark, -0.42, 0.61, -0.985, false), box(0.17, 0.4, 0.01, M('#cfc8ba', { roughness: 0.4 }), -0.045, 0.61, -0.978, false));
  for (const y of [0.92, 0.82, 0.72]) { const k = cyl(0.026, 0.03, mChrome, 0, 0, 0, 16); k.rotation.x = PI / 2; k.position.set(-0.045, y, -0.962); g.add(k); }
  for (const s of [-1, 1]) { const a = cyl(0.005, 0.5, mChrome, 0, 0, 0, 6); a.position.set(-0.3 + s * 0.12, 1.3, -1.2); a.rotation.z = -s * 0.5; g.add(a); }
  /* Sonnenuhr an der Wand, Bild im Rahmen */
  const clock = new THREE.Group(); clock.position.set(0.95, 1.75, -1.425);
  for (let i = 0; i < 12; i++) { const ray = box(0.012, i % 2 ? 0.2 : 0.3, 0.01, brass, 0, 0.1, 0, false); const p = new THREE.Group(); p.add(ray); p.rotation.z = i * PI / 6; clock.add(p); }
  const face = cyl(0.11, 0.02, M('#3a2a1c'), 0, 0, 0, 24); face.rotation.x = PI / 2; face.position.set(0, 0, 0.01); clock.add(face); g.add(clock);
  const pic = sign(0.5, 0.38, (c, w, h) => { c.fillStyle = '#f3ead7'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9861f'; c.beginPath(); c.arc(w / 2, h * 0.62, h * 0.3, PI, 0); c.fill(); c.fillStyle = '#7a3f17'; c.fillRect(0, h * 0.62, w, h * 0.38); });
  pic.position.set(-0.35, 1.72, -1.428); g.add(pic, box(0.56, 0.44, 0.02, teak, -0.35, 1.5, -1.442, false));
  /* Bogenlampe, Beistelltisch, Gummibaum */
  g.add(cyl(0.17, 0.035, mWhite, 1.32, 0, -0.95, 28), cyl(0.014, 1.55, mChrome, 1.32, 0.035, -0.95, 8));
  const arm = cyl(0.012, 0.75, mChrome, 0, 0, 0, 8); arm.rotation.z = 1.05; arm.position.set(0.99, 1.74, -0.95); g.add(arm);
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 12, 0, PI * 2, 0, PI / 2), M(C.orange, { side: THREE.DoubleSide, roughness: 0.35 })); sh.position.set(0.66, 1.75, -0.95); sh.castShadow = true; g.add(sh);
  g.add(ball(0.05, new THREE.MeshBasicMaterial({ color: '#fff3d6' }), 0.66, 1.8, -0.95));
  g.add(cyl(0.2, 0.025, mWhite, 1.4, 0.45, 0.45, 28), cyl(0.03, 0.45, mWhite, 1.4, 0, 0.45, 12, 0.02), cyl(0.15, 0.02, mWhite, 1.4, 0, 0.45, 28));
  g.add(cyl(0.15, 0.3, M(C.orange, { roughness: 0.4 }), -1.33, 0, -1.02, 24, 0.19), cyl(0.012, 0.95, M('#5b4a2a'), -1.33, 0.3, -1.02, 6));
  const leaf = M('#2f6b3a', { roughness: 0.5 }), rr = rng(5);
  for (let i = 0; i < 11; i++) { const l = ball(0.14, leaf, -1.33 + (rr() - 0.5) * 0.42, 0.55 + i * 0.075, -1.02 + (rr() - 0.5) * 0.42); l.scale.set(1, 0.3, 0.55); l.rotation.set(rr() * 0.8, rr() * 6, rr() * 0.8); g.add(l); }
  return g;
}

/* ---- 2 · Mero-System: Raumfachwerk aus Kugelknoten und Stäben, Raster 75 cm ---- */
const MERO = { m: 0.75, y0: 0.07, h: [[3, 3, 2], [3, 1, 1], [2, 0, 0], [3, 2, 1]] };   // h[i][k] = Felder übereinander; 0 = offen, hier geht man hinein
function buildMero() {
  const g = new THREE.Group(), { m, y0, h } = MERO, nx = h.length, nz = h[0].length, ox = -nx * m / 2, oz = -nz * m / 2;
  const P = (i, j, k) => new V3(ox + i * m, y0 + j * m, oz + k * m);
  /* Knoten und Stäbe aus den belegten Feldern ableiten, doppelte nur einmal */
  const nodes = new Map(), edges = new Map(), nk = (i, j, k) => `${i},${j},${k}`;
  for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) for (let j = 0; j < h[i][k]; j++)
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) {
      const p = [i + a, j + b, k + c]; nodes.set(nk(...p), p);
      for (let ax = 0; ax < 3; ax++) if (p[ax] === [i, j, k][ax]) { const q = [...p]; q[ax]++; edges.set(nk(...p) + '|' + ax, [p, q]); }
    }
  /* Stab mit konischen Enden und Schlüsselhülse */
  const rn = 0.03, a = m / 2 - rn + 0.004, prof = [[0.0045, -a], [0.0045, -a + 0.012], [0.0098, -a + 0.012], [0.0098, -a + 0.04], [0.0065, -a + 0.042], [0.0125, -a + 0.11], [0.0125, a - 0.11], [0.0065, a - 0.042], [0.0098, a - 0.04], [0.0098, a - 0.012], [0.0045, a - 0.012], [0.0045, a]];
  const sm = new THREE.InstancedMesh(new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 10), mChrome, edges.size);
  const d = new THREE.Object3D(), up = new V3(0, 1, 0); let n = 0;
  for (const [p, q] of edges.values()) { const A = P(...p), B = P(...q); d.position.copy(A).add(B).multiplyScalar(0.5); d.quaternion.setFromUnitVectors(up, B.sub(A).normalize()); d.updateMatrix(); sm.setMatrixAt(n++, d.matrix); }
  /* Knoten: Kugel mit 18 abgeflachten Anschlussflächen (Rhombenkuboktaeder) */
  const s2 = 1 + Math.SQRT2, kv = [];
  for (const sa of [-1, 1]) for (const sb of [-1, 1]) for (const sc of [-1, 1]) kv.push(new V3(sa, sb, sc * s2), new V3(sa, sb * s2, sc), new V3(sa * s2, sb, sc));
  kv.forEach(v => v.multiplyScalar(rn / Math.hypot(1, 1, s2)));
  const nm = new THREE.InstancedMesh(new ConvexGeometry(kv), mChrome, nodes.size);
  const foot = [...nodes.values()].filter(p => p[1] === 0);
  const fm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.032, 0.036, 0.012, 16), mDark, foot.length), fs = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.006, 0.006, y0 - 0.02, 8), mChrome, foot.length);
  d.quaternion.identity(); n = 0; let f = 0;
  for (const p of nodes.values()) {
    d.position.copy(P(...p)); d.updateMatrix(); nm.setMatrixAt(n++, d.matrix);
    if (p[1] === 0) { d.position.y = 0.006; d.updateMatrix(); fm.setMatrixAt(f, d.matrix); d.position.y = y0 / 2; d.updateMatrix(); fs.setMatrixAt(f++, d.matrix); }
  }
  for (const im of [sm, nm, fm, fs]) { im.castShadow = true; im.receiveShadow = true; g.add(im); }

  /* Füllungen: Farbtafeln, Texte, Fotos, Zahlen */
  const s = m - 0.075, cy = j => y0 + j * m + 0.0375;
  const pz = (i, j, k, mat) => g.add(box(s, s, 0.012, mat, ox + (i + 0.5) * m, cy(j), oz + k * m));
  const px = (i, j, k, mat) => g.add(box(0.012, s, s, mat, ox + i * m, cy(j), oz + (k + 0.5) * m));
  const txt = (head, bg = '#f6f3ee', fg = '#2b2533') => texMat(textPanel(bg, fg, head));
  const foto = (seed, old) => texMat(photoPanel(seed, old ? ['#d9c9a3', '#f1e6c9'] : ['#8fbfe6', '#e6f2fb'], old ? '#7a644a' : '#4c6a58'));
  pz(0, 0, 0, M(C.orange)); pz(0, 1, 0, foto(3, true)); pz(0, 2, 0, texMat(numPanel('#5f2b84', C.gelb, '1977')));
  pz(1, 0, 0, txt('Exponate')); pz(1, 1, 0, M(C.lila)); pz(1, 2, 0, foto(8, true));
  pz(2, 0, 0, foto(12, false)); pz(2, 1, 0, mWhite);
  pz(3, 0, 0, M(C.lila)); pz(3, 1, 0, txt('Objekte')); pz(3, 2, 0, texMat(numPanel(C.orange, '#fff', '2027')));
  px(0, 0, 0, txt('Texte')); px(0, 2, 0, M(C.orange)); px(0, 1, 1, foto(21, true)); px(0, 2, 1, M(C.gelb));
  px(4, 1, 0, M(C.orange)); px(4, 2, 0, foto(5, false)); px(4, 0, 1, txt('Fotos', '#5f2b84', '#fff'));
  pz(0, 2, 2, txt('Dreieich um 1977')); pz(3, 1, 2, M(C.pink));
  /* Böden, Vitrinen, Exponate */
  const plate = (i, j, k, mat = mWhite) => { const o = box(s + 0.03, 0.014, s + 0.03, mat, ox + (i + 0.5) * m, y0 + j * m + 0.012, oz + (k + 0.5) * m); if (mat === mVitrine) o.userData.noAO = true; g.add(o); };
  const at = (o, i, j, k, dx = 0, dz = 0, ry = 0) => { o.position.set(ox + (i + 0.5) * m + dx, y0 + j * m + 0.026, oz + (k + 0.5) * m + dz); o.rotation.y = ry; g.add(o); };
  const haube = (i, j, k, hh = 0.36) => g.add(glassBox(s - 0.02, hh, s - 0.02, ox + (i + 0.5) * m, y0 + j * m + 0.026, oz + (k + 0.5) * m));
  plate(1, 1, 2); at(exPlatte(C.orange), 1, 1, 2, -0.14, 0); at(exKamera(), 1, 1, 2, 0.16, 0.08, -0.4); haube(1, 1, 2);
  plate(1, 1, 1); at(exRadio(), 1, 1, 1, 0, 0, 0.3); haube(1, 1, 1);
  plate(3, 1, 2); at(exKanne(C.orange), 3, 1, 2, -0.12, 0.05); at(exKanne(C.gelb), 3, 1, 2, 0.1, -0.08, 0.8); haube(3, 1, 2);
  plate(0, 1, 2); at(exTelefon(C.orange), 0, 1, 2, 0, 0.05, -0.3); plate(0, 2, 2, mVitrine);
  plate(3, 1, 1); at(exPokal(), 3, 1, 1, -0.15, 0); at(exTelefon('#2f6b3a'), 3, 1, 1, 0.12, 0.08, 0.5);
  plate(0, 2, 1); at(exPokal(), 0, 2, 1, 0.1, 0.1); at(exPlatte(C.lila), 0, 2, 1, -0.12, -0.05, 0.3);
  const os = exOrtsschild(); os.position.set(ox + 2.5 * m, y0 + 1.5 * m, oz + 0.012); g.add(os);
  /* Klemmstrahler an den oberen Knoten */
  for (const [i, j, k] of [[0, 3, 1], [1, 3, 1], [3, 3, 1], [0, 2, 3], [4, 2, 2]]) {
    const sp = cyl(0.028, 0.08, mDark, 0, 0, 0, 14, 0.02); const p = P(i, j, k); sp.position.set(p.x, p.y - 0.085, p.z + 0.04); sp.rotation.x = 0.5; g.add(sp);
    const l = new THREE.Mesh(new THREE.CircleGeometry(0.024, 14), new THREE.MeshBasicMaterial({ color: '#fff4d6' })); l.position.set(p.x, p.y - 0.122, p.z + 0.061); l.rotation.x = PI / 2 + 0.5; g.add(l);
  }
  return g;
}

/* ---- 3 · Selfie-Station als Koje (2,5 × 2,1 m), zwei tapezierte Wände ---- */
function buildSelfie() {
  const g = new THREE.Group();
  g.add(box(2.5, 2.4, 0.04, M('#ffffff', { map: repTex(TEX.tapeteB, 5, 4.8) }), 0, 0, -1.03));
  g.add(box(0.04, 2.4, 2.1, M('#ffffff', { map: repTex(TEX.tapeteB, 4.2, 4.8) }), 1.23, 0, 0));
  g.add(cyl(0.78, 0.018, M(C.pink, { roughness: 1 }), 0.05, 0, 0.1, 48), cyl(0.5, 0.02, M(C.orange, { roughness: 1 }), 0.05, 0, 0.1, 48));
  /* Kleiderständer mit Kostümen */
  g.add(cyl(0.015, 1.55, mChrome, -0.9, 0, -0.65, 8), cyl(0.015, 1.55, mChrome, -0.9, 0, 0.55, 8), box(0.025, 0.025, 1.24, mChrome, -0.9, 1.53, -0.05), box(0.4, 0.02, 0.03, mChrome, -0.9, 0, -0.65), box(0.4, 0.02, 0.03, mChrome, -0.9, 0, 0.55));
  [C.orange, C.gelb, C.tuerkis, C.pink, C.oliv, C.lila, '#f3ead7'].forEach((col, i) => g.add(rbox(0.44, 0.78 + (i % 3) * 0.08, 0.04, M(col, { roughness: 1 }), -0.9, 0.62 - (i % 3) * 0.08, -0.56 + i * 0.165, 0.018)));
  /* Perücken auf Köpfen */
  g.add(rbox(0.75, 0.78, 0.3, mWhite, 0.62, 0, -0.84, 0.02));
  [C.orange, C.dunkel, C.gelb].forEach((col, i) => {
    const x = 0.38 + i * 0.24;
    g.add(cyl(0.025, 0.08, mDark, x, 0.78, -0.84, 8), ball(0.085, M('#e9d3bd'), x, 0.94, -0.84));
    const w = ball(0.118, M(col, { roughness: 1 }), x, 0.975, -0.855); w.scale.set(1, 0.9, 1.05); g.add(w);
  });
  /* Ovaler Spiegel, Discokugel, Ringlicht auf Stativ, Schild */
  const mir = cyl(0.3, 0.015, new THREE.MeshStandardMaterial({ color: '#eef2f6', metalness: 1, roughness: 0.04 }), 0, 0, 0, 40); mir.rotation.z = PI / 2; mir.scale.x = 1.45; mir.position.set(1.2, 1.45, 0.25); g.add(mir);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.022, 10, 40), M(C.gelb, { roughness: 0.4 })); rim.rotation.y = PI / 2; rim.scale.y = 1.45; rim.position.set(1.2, 1.45, 0.25); g.add(rim);
  const disco = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 2), new THREE.MeshStandardMaterial({ color: '#e8ecf2', metalness: 1, roughness: 0.1, flatShading: true }));
  disco.position.set(0.1, 2.08, 0.05); disco.castShadow = true; g.add(disco, box(0.006, 0.26, 0.006, mDark, 0.1, 2.24, 0.05, false));
  for (const a of [0, 2.1, 4.2]) { const leg = cyl(0.008, 0.6, mDark, 0, 0, 0, 6); leg.position.set(0.35 + Math.cos(a) * 0.13, 0.28, 0.92 + Math.sin(a) * 0.13); leg.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45); g.add(leg); }
  g.add(cyl(0.01, 0.9, mDark, 0.35, 0.5, 0.92, 8));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 10, 32), new THREE.MeshBasicMaterial({ color: '#fff6e0' })); ring.position.set(0.35, 1.52, 0.92); g.add(ring);
  const s = sign(1.3, 0.3, (c, w, h) => { c.fillStyle = C.gelb; c.fillRect(0, 0, w, h); c.fillStyle = '#3b1d57'; wrapText(c, 'SELFIE 1977', w / 2, h / 2, w, h * 0.5, FD, 800); });
  s.position.set(-0.1, 2.12, -1.005); g.add(s);
  return g;
}
function buildStellwand() {
  const g = new THREE.Group(), m = M('#e9e6ef', { roughness: 0.9 });
  g.add(rbox(2.2, 1.95, 0.05, m, 0, 0.08, 0, 0.012), box(2.2, 0.12, 0.054, M(C.orange), 0, 1.75, 0, false));
  for (const x of [-0.95, 0.95]) g.add(rbox(0.06, 0.08, 0.5, mDark, x, 0, 0, 0.015));
  return g;
}

/* ---- 4 · Statistik: Drehwürfel „1970 / heute“ (2,3 × 0,5 m) ---- */
function buildStatistik() {
  const g = new THREE.Group(), r = rng(21);
  const face = (bg, fg, t, size) => new THREE.MeshStandardMaterial({ roughness: 0.55, map: ctex(256, 256, (c, w) => { c.fillStyle = bg; c.fillRect(0, 0, w, w); c.fillStyle = fg; wrapText(c, t, w / 2, w / 2, w * 0.9, size, FD, 800); }) });
  const mats = [face(C.lila, '#fff', '1970', 70), face(C.orange, '#fff', 'heute', 60), face(C.gelb, '#3b1d57', '?', 150)];
  [-0.9, -0.3, 0.3, 0.9].forEach((x, i) => {
    const outer = i === 0 || i === 3;
    g.add(cyl(0.18, 0.03, mDark, x, 0, 0, 28), cyl(0.018, outer ? 1.9 : 1.6, mChrome, x, 0.03, 0, 8));
    for (let j = 0; j < 3; j++) { const c = rbox(0.3, 0.3, 0.3, mats[(i + j) % 3], x, 0.5 + j * 0.34, 0, 0.02); c.rotation.y = Math.round(r() * 4) * PI / 8 - PI / 4; g.add(c); }
  });
  const draw = (c, w, h) => { c.fillStyle = '#2b2533'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; wrapText(c, 'Wie gut kennst du Dreieich?', w / 2, h / 2, w * 0.95, h * 0.36, FD, 700); };
  const a = sign(2.1, 0.26, draw), b = sign(2.1, 0.26, draw);
  a.position.set(0, 1.78, 0.012); b.position.set(0, 1.78, -0.012); b.rotation.y = PI; g.add(a, b, box(2.12, 0.28, 0.02, mDark, 0, 1.64, 0, false));
  return g;
}

/* ---- 5 · Litfaßsäule: Größe kommt aus dem Rechner ---- */
function buildLitfass({ d, h, n, rows, gap }) {
  const g = new THREE.Group(), r = d / 2, U = PI * d, rr = rng(9);
  const pal = [C.orange, C.lila, C.gelb, C.pink, C.tuerkis, C.oliv, '#f3ead7', '#d22a2a'];
  const tex = ctex(2048, 1024, (c, w, hh) => {
    c.fillStyle = '#b9b2a4'; c.fillRect(0, 0, w, hh);
    const pw = 0.42 / U * w, ph = 0.594 / h * hh, cw = w / Math.max(n, 1), gp = gap / h * hh, top = (hh - rows * (ph + gp)) / 2;
    for (let i = 0; i < n; i++) for (let j = 0; j < rows; j++) {
      const x = i * cw + (cw - pw) / 2, y = top + j * (ph + gp) + gp / 2, bg = pal[Math.floor(rr() * pal.length)], fg = pal[Math.floor(rr() * pal.length)], kind = Math.floor(rr() * 3);
      c.fillStyle = bg; c.fillRect(x, y, pw, ph);
      c.fillStyle = fg === bg ? '#2b2533' : fg;
      if (kind === 0) { c.beginPath(); c.arc(x + pw / 2, y + ph * 0.38, pw * 0.28, 0, 7); c.fill(); }
      else if (kind === 1) { for (let s = 0; s < 4; s++) c.fillRect(x + pw * 0.12, y + ph * (0.12 + s * 0.12), pw * 0.76, ph * 0.06); }
      else { c.beginPath(); c.moveTo(x + pw * 0.15, y + ph * 0.58); c.lineTo(x + pw * 0.5, y + ph * 0.12); c.lineTo(x + pw * 0.85, y + ph * 0.58); c.fill(); }
      c.fillStyle = bg === '#f3ead7' || bg === C.gelb ? '#2b2533' : '#fff';
      c.fillRect(x + pw * 0.12, y + ph * 0.68, pw * 0.76, ph * 0.06); c.fillRect(x + pw * 0.12, y + ph * 0.79, pw * 0.5, ph * 0.035); c.fillRect(x + pw * 0.12, y + ph * 0.86, pw * 0.62, ph * 0.035);
    }
  });
  const green = M('#35614a', { roughness: 0.45, metalness: 0.2 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64), [new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }), mDark, mDark]);
  body.position.y = 0.22 + h / 2; shade(body); g.add(body);
  g.add(cyl(r + 0.06, 0.07, green, 0, 0, 0, 56), cyl(r + 0.035, 0.15, green, 0, 0.07, 0, 56, r + 0.02));
  g.add(cyl(r + 0.02, 0.03, green, 0, 0.22 + h, 0, 56, r + 0.075), cyl(r + 0.075, 0.035, green, 0, 0.25 + h, 0, 56), cyl(r + 0.05, 0.15, green, 0, 0.285 + h, 0, 56, 0.07), cyl(0.07, 0.03, green, 0, 0.435 + h, 0, 20, 0.03), ball(0.04, green, 0, 0.495 + h, 0));
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
    const t = ctex(320, 320, (c, w) => {
      c.fillStyle = bg; c.beginPath(); c.arc(w / 2, w / 2, w / 2, 0, 7); c.fill(); c.fillStyle = fg;
      wrapText(c, title, w / 2, w * 0.36, w * 0.74, 34, FD, 700);
      c.globalAlpha = 0.4; for (let j = 0; j < 4; j++) c.fillRect(w * 0.26, w * (0.56 + j * 0.065), w * (j === 3 ? 0.3 : 0.48), w * 0.022);
    });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(k.rad, k.rad, 0.014, 56), [M(bg), new THREE.MeshStandardMaterial({ map: t, roughness: 0.75 }), M(bg)]);
    m.rotation.z = PI / 2; m.position.set(R.W - 0.035, k.y, k.z); m.castShadow = true; g.add(m);   // Deckfläche zeigt in den Raum, 2 cm Abstand zur Wand
  });
  return g;
}

/* ---- 7 · Slide-Show auf Medienstelen (2,8 × 0,7 m) ---- */
function buildStelen() {
  const g = new THREE.Group(), body = M('#1c1920', { roughness: 0.35, metalness: 0.4 });
  const shot = (label, sky, land, tint) => (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, sky[0]); gr.addColorStop(1, sky[1]); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = land; const rr = rng(label.length * 13);
    for (let i = 0; i < 9; i++) { const x = i * w / 8 - 20, bw = w / 7, bh = h * (0.12 + rr() * 0.16); c.fillRect(x, h * 0.72 - bh, bw, bh + h * 0.3); c.beginPath(); c.moveTo(x - 4, h * 0.72 - bh); c.lineTo(x + bw / 2, h * 0.72 - bh - bw * 0.42); c.lineTo(x + bw + 4, h * 0.72 - bh); c.fill(); }
    c.fillStyle = tint; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; wrapText(c, label, w / 2, h * 0.88, w, h * 0.075, FD, 700);
  };
  const scr = [shot('1977', ['#d9c9a3', '#f1e6c9'], '#7a644a', 'rgba(120,80,30,.18)'), shot('2000', ['#9fc3e0', '#e7eef2'], '#5c6b78', 'rgba(0,0,0,0)'), shot('heute', ['#5aa7e6', '#dff1ff'], '#3f7a58', 'rgba(0,0,0,0)')];
  [-0.95, 0, 0.95].forEach((x, i) => {
    g.add(rbox(0.58, 0.035, 0.46, body, x, 0, 0, 0.012), rbox(0.64, 1.86, 0.075, body, x, 0.03, 0, 0.02));
    const s = sign(0.56, 1.0, scr[i], { emissive: true }); s.position.set(x, 1.3, 0.039); g.add(s);
  });
  g.add(rbox(1.5, 0.4, 0.42, M(C.orange, { roughness: 0.8 }), -0.2, 0, 1.35, 0.06), cyl(0.2, 0.42, M(C.lila, { roughness: 0.7 }), 1.0, 0, 1.3, 28));
  return g;
}

/* ---- 8 · Zukunft / Lieblingsplatz: Pinnwand mit Stadtplan + Kartentisch (2,6 × 1,4 m) ---- */
function buildZukunft() {
  const g = new THREE.Group();
  g.add(rbox(2.5, 1.5, 0.04, mWhite, 0, 0.55, -0.4, 0.012), rbox(0.05, 0.55, 0.4, mDark, -1.1, 0, -0.4, 0.012), rbox(0.05, 0.55, 0.4, mDark, 1.1, 0, -0.4, 0.012));
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
  g.add(cyl(0.38, 0.03, mWhite, 0, 1.05, 0.45, 36), cyl(0.035, 1.05, mChrome, 0, 0, 0.45, 12), cyl(0.26, 0.02, mDark, 0, 0, 0.45, 28));
  g.add(box(0.16, 0.035, 0.11, M(C.gelb), -0.14, 1.08, 0.4), box(0.16, 0.025, 0.11, M('#fff'), 0.02, 1.08, 0.58), rbox(0.22, 0.22, 0.22, M(C.lila, { roughness: 0.5 }), 0.17, 1.08, 0.36, 0.02), box(0.14, 0.004, 0.02, mDark, 0.17, 1.3, 0.36, false));
  return g;
}

/* ---- Bestand & Ausstattung ---- */
function buildTheke(orange) {
  const g = new THREE.Group(), front = M(orange ? C.orange : '#2f3b4f', { roughness: 0.4 }), top = M('#f4f2ee', { roughness: 0.3 });
  g.add(box(3.1, 0.08, 0.55, mDark, 0, 0, 0), rbox(3.2, 0.78, 0.65, front, 0, 0.08, 0, 0.012), rbox(3.28, 0.04, 0.73, top, 0, 0.86, 0, 0.012));
  g.add(box(0.55, 0.08, 1.85, mDark, -1.275, 0, -1.275), rbox(0.65, 0.78, 1.9, front, -1.275, 0.08, -1.275, 0.012), rbox(0.73, 0.04, 1.94, top, -1.275, 0.86, -1.255, 0.012));
  if (orange) { const s = sign(1.7, 0.36, (c, w, h) => { c.fillStyle = C.orange; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; wrapText(c, '50 Jahre Dreieich', w / 2, h / 2, w, h * 0.42, FD, 700); }); s.position.set(0.3, 0.48, 0.327); g.add(s); }
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
  g.add(box(1.26, 0.025, 0.025, mDark, 0, 2.35, 0, false), box(1.26, 0.02, 0.02, mDark, 0, 0.44, 0, false), box(0.005, 0.13, 0.005, mDark, -0.55, 2.37, 0, false), box(0.005, 0.13, 0.005, mDark, 0.55, 2.37, 0, false));
  return g;
}
function buildKissen() {
  const g = new THREE.Group(), mo = M(C.orange, { roughness: 1 }), ml = M(C.lila, { roughness: 1 }), r = rng(2); let n = 0;
  const put = (x, z, ry) => { const k = rbox(0.48, 0.1, 0.34, n % 2 ? ml : mo, x, R.SILL, z, 0.045); k.rotation.y = ry + (r() - 0.5) * 0.2; g.add(k); n++; };
  for (let x = 0.75; x < R.xRet - 0.4; x += 1.2) if ([R.colX, ...R.frontX].every(c => Math.abs(c - x) > 0.42)) put(x, R.zG - 0.2, 0);
  for (let z = R.zWW + 0.6; z < R.zG - 0.8; z += 1.2) if (R.westZ.every(c => Math.abs(c - z) > 0.42)) put(R.xG + 0.2, z, PI / 2);
  g.userData.count = n;
  return g;
}
function buildFigur(col = '#8f879c') {
  const g = new THREE.Group(), m = M(col, { roughness: 0.85 });
  const cap = (r, len, x, y, z, rz = 0) => { const o = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), m); o.position.set(x, y, z); o.rotation.z = rz; return shade(o); };
  g.add(cap(0.072, 0.68, -0.09, 0.41, 0), cap(0.072, 0.68, 0.09, 0.41, 0));
  const torso = cap(0.155, 0.36, 0, 1.13, 0); torso.scale.z = 0.68; g.add(torso);
  g.add(cap(0.046, 0.5, -0.215, 1.08, 0, -0.08), cap(0.046, 0.5, 0.215, 1.08, 0, 0.08), cyl(0.045, 0.08, m, 0, 1.44, 0, 12), ball(0.105, m, 0, 1.61, 0));
  return g;
}
