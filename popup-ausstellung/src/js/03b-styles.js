/* =====================================================================
   STILE: Die radikalen Konzepte ändern Boden, Wände, Licht und Farbwelt
   und bringen eigene Bühnenelemente mit (BUEHNE).
   ===================================================================== */
const C_BASE = { ...C };
const STIL_STANDARD = { palette: {}, boden: { color: '#efe9de', tex: 'holz' }, wand: '#f3f1ed', decke: '#f7f6f3', licht: { hemi: ['#ffffff', '#cfc6ba', 0.62], sonne: ['#fff0d8', 2.5], exp: 1.08 } };
const TEX_BETON = ctex(512, 512, (c, w) => {
  const r = rng(31); c.fillStyle = '#c9c9c9'; c.fillRect(0, 0, w, w);
  for (let i = 0; i < 2600; i++) { c.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '60,60,60'},${0.03 + r() * 0.06})`; c.beginPath(); c.arc(r() * w, r() * w, 1 + r() * 9, 0, 7); c.fill(); }
  c.strokeStyle = 'rgba(70,70,70,.35)'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, w - 2);
}, [1 / 3, 1 / 3]);

/* Stadtplan als Bodenbild: stilisiert, nicht maßstäblich. Norden (Rückwand) ist oben. */
const ORTE = [['Buchschlag', 2.6, 6.2, 2.3, 1.6, '#cfe3b4'], ['Sprendlingen', 7.0, 7.7, 3.3, 2.0, '#f6c9a0'], ['Dreieichenhain', 10.9, 8.9, 2.5, 1.25, '#d9c4ec'], ['Götzenhain', 14.6, 3.6, 2.9, 1.9, '#f7e0a0'], ['Offenthal', 16.0, 7.7, 2.5, 1.5, '#bfe1e4']];
let _karte = null;
function texKarte() {
  if (_karte) return _karte;
  const BW = R.W - R.xG, BH = R.zG, K = 2048 / BW, px = x => (x - R.xG) * K, pz = z => z * K;
  _karte = ctex(2048, Math.round(BH * K), (c, w, h) => {
    c.fillStyle = '#eef1e4'; c.fillRect(0, 0, w, h);
    const r = rng(77); c.fillStyle = '#d5e6c4';
    for (let i = 0; i < 26; i++) { c.beginPath(); c.ellipse(r() * w, r() * h, 60 + r() * 150, 40 + r() * 110, r() * 3, 0, 7); c.fill(); }
    /* Straßen und Dreieichbahn verbinden die Orte */
    const line = (pts, col, lw, dash) => { c.strokeStyle = col; c.lineWidth = lw; c.setLineDash(dash || []); c.lineJoin = 'round'; c.beginPath(); pts.forEach(([x, z], i) => (i ? c.lineTo(px(x), pz(z)) : c.moveTo(px(x), pz(z)))); c.stroke(); c.setLineDash([]); };
    const mitte = ORTE.map(o => [o[1], o[2]]);
    line([[-0.5, 6.6], mitte[0], mitte[1], mitte[2], [13.2, 6.4], mitte[3]], '#ffffff', 34); line([mitte[2], mitte[4], [19.45, 8.4]], '#ffffff', 34); line([mitte[1], [9.0, 5.6], [12.6, 4.2], mitte[3]], '#ffffff', 22);
    for (const [name, x, z, rx, rz, col] of ORTE) {
      c.fillStyle = col; c.strokeStyle = '#ffffff'; c.lineWidth = 10; c.beginPath();
      for (let a = 0; a <= 36; a++) { const t = a / 36 * PI * 2, k = 1 + 0.13 * Math.sin(t * 3 + x) + 0.08 * Math.cos(t * 5 + z); const X = px(x + Math.cos(t) * rx * k), Z = pz(z + Math.sin(t) * rz * k); a ? c.lineTo(X, Z) : c.moveTo(X, Z); }
      c.closePath(); c.fill(); c.stroke();
      c.fillStyle = 'rgba(43,37,51,.16)'; const rr = rng(name.length * 9);
      for (let i = 0; i < 22; i++) c.fillRect(px(x + (rr() - 0.5) * rx * 1.2), pz(z + (rr() - 0.5) * rz * 1.1), 14 + rr() * 22, 12 + rr() * 16);
      c.fillStyle = '#2b2533'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 ${Math.round(0.44 * K)}px ${FD}`; c.fillText(name, px(x), pz(z));
    }
    line([[-0.5, 7.4], [2.2, 7.2], [6.4, 8.9], [10.6, 9.75], [14.0, 9.3], [16.6, 8.8], [19.45, 9.2]], '#3b3344', 6, [26, 16]);
    c.fillStyle = '#3b3344'; c.font = `600 ${Math.round(0.2 * K)}px ${FB}`; c.textAlign = 'left'; c.fillText('Dreieichbahn', px(11.6), pz(9.98));
    c.font = `600 ${Math.round(0.22 * K)}px ${FB}`; c.fillText('Stadtplan zum Begehen · nicht maßstäblich', px(11.9), pz(6.15));
  });
  _karte.wrapS = _karte.wrapT = THREE.RepeatWrapping; _karte.repeat.set(1 / BW, 1 / BH); _karte.offset.set(-R.xG / BW, 0);
  return _karte;
}

/* Hilfen für Bühnenteile, die einer Insel folgen */
const amPlatz = (l, id, make) => { const p = poseIn(l, id); if (!p) return null; const g = new THREE.Group(); g.position.set(p.x, 0, p.z); g.rotation.y = p.r * PI / 180; make(g, RECTS[id]); return g; };
const schild = (text, w, h, bg, fg, font = FD) => sign(w, h, (c, cw, ch) => { c.fillStyle = bg; c.fillRect(0, 0, cw, ch); c.fillStyle = fg; wrapText(c, text, cw / 2, ch / 2, cw * 0.92, ch * 0.34, font, 700); });

const BUEHNE = {
  /* F · Begehbarer Stadtplan: Ortsschilder auf Ständern und geklebte Lieblingsplatz-Punkte */
  karte(l) {
    const g = new THREE.Group(), r = rng(12), cols = [C.orange, C.pink, C.lila, C.tuerkis, C.gelb];
    Object.entries(l.fest || {}).forEach(([name, [x0, z0, x1, z1]]) => {
      const x = (x0 + x1) / 2, z = (z0 + z1) / 2, ort = name.replace('Ortsschild ', '');
      g.add(cyl(0.16, 0.03, mDark, x, 0, z, 20), cyl(0.02, 1.75, mChrome, x, 0.03, z, 8));
      for (const s of [1, -1]) { const t = sign(0.62, 0.34, (c, w, h) => { c.fillStyle = '#f5cf1c'; c.fillRect(0, 0, w, h); c.strokeStyle = '#17141b'; c.lineWidth = h * 0.05; c.strokeRect(h * 0.05, h * 0.05, w - h * 0.1, h * 0.9); c.fillStyle = '#17141b'; wrapText(c, ort, w / 2, h / 2, w * 0.9, h * (ort.length > 10 ? 0.22 : 0.3), FB, 700); }, { res: 300 }); t.position.set(x, 1.62, z + s * 0.012); if (s < 0) t.rotation.y = PI; g.add(t); }
    });
    for (const [, x, z, rx, rz] of ORTE) for (let i = 0; i < 11; i++) { const d = cyl(0.05, 0.005, new THREE.MeshBasicMaterial({ color: cols[Math.floor(r() * cols.length)] }), x + (r() - 0.5) * rx * 1.3, 0.012, z + (r() - 0.5) * rz * 1.2, 14); d.castShadow = false; g.add(d); }
    return g;
  },
  /* G · Tag und Nacht: schwarzer Raum hinter Molton, Neon, Leuchtboden unter der Koje */
  nacht(l) {
    const g = new THREE.Group(), stoff = M('#15111b', { roughness: 1 }), H = R.H;
    const neon = col => new THREE.MeshBasicMaterial({ color: col });
    g.add(box(6.6, 0.014, 5.2, M('#1b1622', { roughness: 1 }), 14.7, 0, 2.6, false));
    g.add(box(5.0, H, 0.08, stoff, 15.5, 0, 5.2), box(1.6, 0.42, 0.08, stoff, 12.2, H - 0.42, 5.2, false));          // Vorhang vorn, Sturz über dem Durchgang
    g.add(box(0.08, H, 3.5, stoff, 18.0, 0, 3.45), box(0.08, 0.42, 1.7, stoff, 18.0, H - 0.42, 0.85, false));          // Vorhang seitlich, hinterer Durchgang
    g.add(box(5.6, H, 0.03, stoff, 14.2, 0, 0.02, false), box(0.03, H, 5.2, stoff, 11.42, 0, 2.6, false));              // Rückwand und Treppenhauswand abgehängt
    const decke = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 5.2), stoff); decke.rotation.x = PI / 2; decke.position.set(14.7, H - 0.006, 2.6); g.add(decke);
    g.add(box(5.4, 0.03, 0.03, neon('#ff4fa3'), 14.2, 2.28, 0.07, false), box(0.03, 0.03, 4.6, neon('#35d6e6'), 11.47, 2.28, 2.6, false), box(0.03, 0.03, 3.2, neon('#ff4fa3'), 17.93, 2.28, 3.5, false));
    const titel = sign(2.9, 0.8, (c, w, h) => { c.fillStyle = '#15111b'; c.fillRect(0, 0, w, h); c.shadowColor = '#ff4fa3'; c.shadowBlur = h * 0.12; c.fillStyle = '#ff7cc0'; wrapText(c, 'NACHT', w * 0.44, h / 2, w, h * 0.56, FD, 800); c.beginPath(); c.arc(w * 0.86, h * 0.5, h * 0.22, 0.6, 5.7); c.lineWidth = h * 0.07; c.strokeStyle = '#7fe9f5'; c.shadowColor = '#35d6e6'; c.stroke(); }, { emissive: true });
    titel.position.set(15.5, 1.55, 5.245); g.add(titel);
    const pfeil = schild('← Hier hinein', 1.4, 0.3, '#15111b', '#7fe9f5', FB); pfeil.material = new THREE.MeshBasicMaterial({ map: pfeil.material.map }); pfeil.position.set(13.75, 1.0, 5.245); g.add(pfeil);
    const boden = amPlatz(l, 's3', (s, rc) => { const cols = ['#ff4fa3', '#35d6e6', '#ffd23c', '#b46bff'], n = 5, m = 4, tw = (rc[2] - rc[0] - 0.1) / n, td = (rc[3] - rc[1] - 0.1) / m;
      for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const t = box(tw - 0.03, 0.006, td - 0.03, neon(cols[(i * 3 + j * 5) % 4]), rc[0] + 0.05 + (i + 0.5) * tw, 0.024, rc[1] + 0.05 + (j + 0.5) * td, false); s.add(t); } });
    if (boden) g.add(boden);
    return g;
  },
  /* H · Alles Orange: runde Teppiche unter den Inseln, Farbstreifen an den Wänden, Kugelleuchten */
  orange(l) {
    const g = new THREE.Group(), ringe = ['#7a2e0a', '#b8430a', '#ffb066'];
    ['s2', 's4', 's5', 's7', 's8'].forEach((id, n) => { const t = amPlatz(l, id, (s, rc) => { const rad = Math.max(rc[2] - rc[0], rc[3] - rc[1]) / 2 + 0.45, cx = (rc[0] + rc[2]) / 2, cz = (rc[1] + rc[3]) / 2;
      ringe.forEach((col, i) => { const k = cyl(rad * (1 - i * 0.24), 0.008, M(col, { roughness: 1 }), cx, 0.004 + i * 0.004, cz, 56); k.castShadow = false; s.add(k); }); }); if (t) g.add(t); });
    const streifen = [['#7a2e0a', 0.35, 0.16], ['#fff1e0', 0.51, 0.22], ['#ffc078', 0.73, 0.2]];
    const band = (x0, z0, x1, z1) => streifen.forEach(([col, y, h]) => { const horiz = Math.abs(x1 - x0) > Math.abs(z1 - z0); g.add(box(horiz ? Math.abs(x1 - x0) : 0.012, h, horiz ? 0.012 : Math.abs(z1 - z0), M(col, { roughness: 0.9 }), (x0 + x1) / 2, y, (z0 + z1) / 2, false)); });
    band(5.55, 3.112, 8.15, 3.112); band(8.138, 3.1, 8.138, 5.2); band(8.15, 5.212, 11.4, 5.212); band(11.412, 0, 11.412, 5.2); band(11.4, 0.012, 19.4, 0.012);
    const kugel = new THREE.MeshBasicMaterial({ color: '#fff6e6' });
    for (const [x, z, y] of [[2.6, 6.2, 2.0], [5.4, 8.6, 1.85], [8.6, 8.2, 2.05], [12.6, 4.6, 1.9], [14.6, 7.4, 2.05], [16.6, 3.2, 1.95], [10.2, 9.2, 1.9]]) g.add(ball(0.24, kugel, x, y, z), box(0.008, R.H - y - 0.2, 0.008, mDark, x, y + 0.2, z, false));
    return g;
  },
  /* I · Baustelle Dreieich: Bauzaun mit Bauschild, OSB-Podeste, Markierungsband, Leitkegel */
  baustelle(l) {
    const g = new THREE.Group(), osb = M('#c8a26a', { roughness: 0.9, map: ctex(128, 128, (c, w) => { const r = rng(5); c.fillStyle = '#c8a26a'; c.fillRect(0, 0, w, w); for (let i = 0; i < 260; i++) { c.fillStyle = `hsl(${30 + r() * 12},${40 + r() * 20}%,${52 + r() * 22}%)`; c.save(); c.translate(r() * w, r() * w); c.rotate(r() * 3); c.fillRect(0, 0, 8 + r() * 16, 2 + r() * 4); c.restore(); } }, [3, 3]) });
    ['s2', 's4', 's5', 's7', 's8'].forEach(id => { const t = amPlatz(l, id, (s, rc) => s.add(box(rc[2] - rc[0] + 0.3, 0.045, rc[3] - rc[1] + 0.3, osb, (rc[0] + rc[2]) / 2, 0, (rc[1] + rc[3]) / 2))); if (t) g.add(t); });
    /* Bauzaun zwischen den Rundstützen */
    const [x0, , x1] = l.fest.Bauzaun, z = 5.05, stahl = M('#aeb4bb', { metalness: 0.7, roughness: 0.4 });
    const gitter = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 - 0.3, 1.75), new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false, map: ctex(256, 256, (c, w) => { c.strokeStyle = 'rgba(120,128,136,.9)'; c.lineWidth = 2; for (let i = 0; i <= 16; i++) { c.beginPath(); c.moveTo(i * 16, 0); c.lineTo(i * 16, w); c.stroke(); } for (let j = 0; j <= 5; j++) { c.beginPath(); c.moveTo(0, j * 51); c.lineTo(w, j * 51); c.stroke(); } }, [3, 1]) }));
    gitter.position.set((x0 + x1) / 2, 1.05, z); gitter.userData.noAO = true; g.add(gitter);
    for (const x of [x0 + 0.15, x1 - 0.15]) g.add(cyl(0.02, 1.95, stahl, x, 0.1, z, 10), box(0.7, 0.12, 0.24, M('#9a9a9a', { roughness: 1 }), x, 0, z));
    for (const y of [0.18, 1.93]) { const rr = cyl(0.016, x1 - x0 - 0.3, stahl, 0, 0, 0, 8); rr.rotation.z = PI / 2; rr.position.set((x0 + x1) / 2, y, z); g.add(rr); }
    const bs = sign(2.0, 0.9, (c, w, h) => { c.fillStyle = '#ffd400'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; c.fillRect(0, 0, w, h * 0.16); wrapText(c, 'Hier entsteht Dreieich', w / 2, h * 0.46, w * 0.92, h * 0.19, FD, 800); wrapText(c, 'Baubeginn 1. Januar 1977 · Fertigstellung offen', w / 2, h * 0.8, w * 0.92, h * 0.09, FB, 700); c.fillStyle = '#ffd400'; wrapText(c, 'BAUSCHILD', w / 2, h * 0.08, w, h * 0.09, FB, 700); });
    bs.position.set((x0 + x1) / 2, 1.3, z + 0.03); g.add(bs);
    /* Markierungsband am Boden entlang des Rundgangs */
    const band = ctex(64, 16, (c, w, h) => { c.fillStyle = '#ffd400'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; for (let i = -1; i < 5; i++) { c.beginPath(); c.moveTo(i * 16, h); c.lineTo(i * 16 + 8, h); c.lineTo(i * 16 + 20, 0); c.lineTo(i * 16 + 12, 0); c.fill(); } });
    const pfad = [[17.7, 8.4], [17.7, 4.2], [12.5, 4.2], [12.5, 6.75], [6.6, 6.75], [6.6, 5.65], [0.55, 5.65], [0.55, 3.6]];
    for (let i = 0; i < pfad.length - 1; i++) { const [ax, az] = pfad[i], [bx, bz] = pfad[i + 1], len = Math.hypot(bx - ax, bz - az), t = band.clone(); t.wrapS = THREE.RepeatWrapping; t.repeat.set(len / 0.4, 1); t.needsUpdate = true;
      const geo = new THREE.PlaneGeometry(len, 0.1); geo.rotateX(-PI / 2); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: t })); m.position.set((ax + bx) / 2, 0.012, (az + bz) / 2); m.rotation.y = -Math.atan2(bz - az, bx - ax); m.userData.noAO = true; g.add(m); }
    for (const [x, zz] of [[16.9, 7.5], [13.4, 4.6], [11.9, 6.9], [1.4, 5.3]]) g.add(cyl(0.16, 0.03, mDark, x, 0, zz, 4), cyl(0.12, 0.42, M('#ff6a00', { roughness: 0.6 }), x, 0.03, zz, 20, 0.025), cyl(0.085, 0.09, M('#ffffff'), x, 0.2, zz, 20, 0.066));
    return g;
  },
};

/* =====================================================================
   NEUE IDEEN zum Jubiläum: Drei Eichen, Endstation 1977, Geburtstagstafel, Fünf Häuser
   ===================================================================== */
const mitte = ([x0, z0, x1, z1]) => [(x0 + x1) / 2, (z0 + z1) / 2];
const farbInst = (geo, n, mat) => { const im = new THREE.InstancedMesh(geo, mat, n); im.castShadow = true; im.receiveShadow = true; return im; };

/* J · Drei Eichen: Stamm mit Rundbank, Krone unter der Decke, Blattkarten der Besucher */
BUEHNE.eichen = l => {
  const g = new THREE.Group(), rinde = M('#8a6a44', { roughness: 1 }), holz = M('#c8a26a', { roughness: 0.8 }), r = rng(41);
  const krone = col => new THREE.MeshStandardMaterial({ color: col, roughness: 1, transparent: true, opacity: 0.62, depthWrite: false });
  const blatt = ['#f5b70a', '#f2690d', '#8fbf7a', '#ffffff', '#d9772b'];
  Object.entries(l.fest).forEach(([name, rc]) => {
    const [x, z] = mitte(rc), jahr = name.replace('Eiche ', '');
    g.add(cyl(0.24, 2.44, rinde, x, 0, z, 12, 0.17), cyl(0.78, 0.4, holz, x, 0, z, 40), cyl(0.8, 0.05, M(C.oliv, { roughness: 1 }), x, 0.4, z, 40));
    [[1.9, 2.26, '#2f6b3a'], [1.45, 2.34, '#4d8a4f'], [0.95, 2.42, '#8fbf7a']].forEach(([rad, y, col]) => { const k = cyl(rad, 0.04, krone(col), x, y, z, 11); k.castShadow = false; k.userData.noAO = true; k.rotation.y = r() * 3; g.add(k); });
    for (const s of [1, -1]) { const t = schild(jahr, 0.56, 0.26, '#f7f5ef', '#1f3a26'); t.position.set(x, 1.55, z + s * 0.235); if (s < 0) t.rotation.y = PI; g.add(t); }
    for (let i = 0; i < 26; i++) { const a = r() * PI * 2, d = 0.45 + r() * 1.25, y = 1.55 + r() * 0.55, k = box(0.1, 0.14, 0.004, new THREE.MeshStandardMaterial({ color: blatt[i % 5], side: THREE.DoubleSide, roughness: 0.9 }), x + Math.cos(a) * d, y, z + Math.sin(a) * d, false); k.rotation.y = r() * 3; g.add(k, box(0.003, 2.26 - y - 0.14, 0.003, mDark, x + Math.cos(a) * d, y + 0.14, z + Math.sin(a) * d, false)); }
  });
  return g;
};

/* K · Endstation 1977: Gleis als Bodenbild, Haltepunkte mit Stempel, Abfahrtstafel, Zugabteil um die Medienstelen */
BUEHNE.bahn = l => {
  const g = new THREE.Group(), pfad = [[17.7, 8.3], [17.7, 4.1], [12.6, 4.1], [12.6, 6.9], [7.0, 6.9], [7.0, 5.8], [0.6, 5.8], [0.6, 3.7]];
  const schiene = new THREE.MeshBasicMaterial({ color: '#4b4f55' }), sw = [];
  for (let i = 0; i < pfad.length - 1; i++) {
    const [ax, az] = pfad[i], [bx, bz] = pfad[i + 1], len = Math.hypot(bx - ax, bz - az), horiz = Math.abs(bx - ax) > Math.abs(bz - az);
    for (const o of [-0.19, 0.19]) { const s = box(horiz ? len + 0.42 : 0.045, 0.006, horiz ? 0.045 : len + 0.42, schiene, (ax + bx) / 2 + (horiz ? 0 : o), 0.014, (az + bz) / 2 + (horiz ? o : 0), false); s.userData.noAO = true; g.add(s); }
    for (let d = 0.2; d < len; d += 0.42) sw.push([ax + (bx - ax) * d / len, az + (bz - az) * d / len, horiz]);
  }
  const im = farbInst(new THREE.BoxGeometry(0.6, 0.004, 0.11), sw.length, new THREE.MeshBasicMaterial({ color: '#8a6f55' })), o = new THREE.Object3D(); im.castShadow = false;
  sw.forEach(([x, z, horiz], i) => { o.position.set(x, 0.011, z); o.rotation.y = horiz ? PI / 2 : 0; o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); im.userData.noAO = true; g.add(im);
  const ziel = flatText('Endstation 1977', { size: 0.34, color: '#14253d', weight: 700 }); ziel.position.set(1.9, 0.02, 5.25); g.add(ziel);
  Object.entries(l.fest).forEach(([name, rc]) => {
    const [x, z] = mitte(rc);
    if (name === 'Abfahrtstafel') {
      const zeilen = l.rundgang.map((id, i) => `${String(i + 1).padStart(2, '0')}   ${DEFS[id].name}`);
      const t = sign(1.8, 1.25, (c, w, h) => { c.fillStyle = '#14253d'; c.fillRect(0, 0, w, h); c.fillStyle = '#f5c518'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = `700 ${h * 0.085}px ${FD}`; c.fillText('Abfahrt', w * 0.06, h * 0.09); c.font = `600 ${h * 0.05}px ${FB}`; c.fillText('50 Jahre Dreieich · Gleis 1', w * 0.42, h * 0.095);
        zeilen.forEach((zl, i) => { c.fillStyle = i % 2 ? '#1f3a5f' : '#1a3152'; c.fillRect(w * 0.04, h * (0.17 + i * 0.098), w * 0.92, h * 0.085); c.fillStyle = '#ffffff'; c.font = `600 ${h * 0.058}px ${FB}`; c.fillText(zl, w * 0.07, h * (0.215 + i * 0.098)); }); }, { res: 220 });
      t.position.set(x, 1.45, z + 0.045); g.add(t, box(1.86, 1.31, 0.06, mDark, x, 0.8, z, false), box(0.06, 0.8, 0.06, mDark, x - 0.8, 0, z), box(0.06, 0.8, 0.06, mDark, x + 0.8, 0, z), box(0.5, 0.03, 0.5, mDark, x - 0.8, 0, z), box(0.5, 0.03, 0.5, mDark, x + 0.8, 0, z));
      return;
    }
    const ort = name.replace('Haltepunkt ', '');
    g.add(cyl(0.15, 0.03, mDark, x, 0, z, 20), cyl(0.022, 2.0, mDark, x, 0.03, z, 8), rbox(0.14, 0.18, 0.12, M('#d6332a', { roughness: 0.4 }), x, 0.95, z + 0.08, 0.02));
    for (const s of [1, -1]) { const t = sign(0.86, 0.3, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1f3a5f'; c.fillRect(0, 0, w, h * 0.16); c.fillRect(0, h * 0.84, w, h * 0.16); wrapText(c, ort, w / 2, h / 2, w * 0.94, h * (ort.length > 10 ? 0.3 : 0.38), FB, 700); }, { res: 300 }); t.position.set(x, 1.85, z + s * 0.014); if (s < 0) t.rotation.y = PI; g.add(t); }
  });
  /* Zugabteil: Rückwand, Stirnwände, Dach und Zielanzeige um die drei Bildschirme */
  const abteil = amPlatz(l, 's7', s => {
    const rot = M('#d6332a', { roughness: 0.5 }), hell = M('#f6f2e8', { roughness: 0.6 }), dach = M('#8a9099', { roughness: 0.5, metalness: 0.3 });
    s.add(box(3.4, 0.9, 0.05, rot, 0, 0, -0.34, false), box(3.4, 1.2, 0.05, hell, 0, 0.9, -0.34, false), box(3.4, 0.06, 0.05, M('#f5c518'), 0, 0.84, -0.31, false));
    for (const x of [-1.68, 1.68]) s.add(box(0.05, 0.9, 2.0, rot, x, 0, 0.65), box(0.05, 1.2, 2.0, hell, x, 0.9, 0.65), box(0.052, 1.5, 0.7, M('#cfd6dc', { roughness: 0.2 }), x, 0.35, 1.0, false));
    s.add(rbox(3.5, 0.08, 2.1, dach, 0, 2.1, 0.65, 0.03), box(3.4, 0.05, 2.0, M('#5a5248', { roughness: 1 }), 0, 0, 0.65, false));
    const zielanzeige = sign(1.7, 0.2, (c, w, h) => { c.fillStyle = '#17141b'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff9a2e'; wrapText(c, 'Dreieich 1977 – 2027', w / 2, h / 2, w, h * 0.6, FB, 700); }, { emissive: true, res: 300 }); zielanzeige.position.set(0, 2.03, 1.705); s.add(zielanzeige, box(3.4, 0.24, 0.05, dach, 0, 1.9, 1.68, false));
  });
  if (abteil) g.add(abteil);
  /* Bahnhofsuhr am Eingang */
  const uhr = new THREE.Group(); uhr.position.set(16.1, 2.05, 5.0);
  for (const s of [1, -1]) { const zb = sign(0.56, 0.56, (c, w) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, w / 2, w / 2, 0, 7); c.fill(); c.strokeStyle = '#17141b'; c.lineWidth = w * 0.045; c.beginPath(); c.arc(w / 2, w / 2, w * 0.46, 0, 7); c.stroke(); for (let i = 0; i < 12; i++) { c.save(); c.translate(w / 2, w / 2); c.rotate(i * PI / 6); c.fillStyle = '#17141b'; c.fillRect(-w * 0.015, -w * 0.42, w * 0.03, w * 0.1); c.restore(); } c.lineCap = 'round'; c.lineWidth = w * 0.05; c.beginPath(); c.moveTo(w / 2, w / 2); c.lineTo(w * 0.5, w * 0.22); c.moveTo(w / 2, w / 2); c.lineTo(w * 0.7, w * 0.6); c.stroke(); }, { res: 300 }); zb.material.transparent = true; zb.position.z = s * 0.04; if (s < 0) zb.rotation.y = PI; uhr.add(zb); }
  const ring = cyl(0.3, 0.075, mDark, 0, 0, 0, 32); ring.rotation.x = PI / 2; ring.position.set(0, 0, 0); uhr.add(ring, box(0.02, 0.2, 0.02, mDark, 0, 0.28, 0, false)); g.add(uhr);
  return g;
};

/* L · Geburtstagstafel: 50 Gedecke für 50 Jahre, Tischläufer als Zeitstrahl, Torte mit 50 Kerzen, Wimpel und Ballons */
BUEHNE.tafel = l => {
  const g = new THREE.Group(), [x0, , x1] = l.fest.Geburtstagstafel, len = x1 - x0, cx = (x0 + x1) / 2, tz = 9.55, r = rng(50), bunt = [C.orange, C.lila, C.gelb, C.pink, C.tuerkis], col = new THREE.Color(), o = new THREE.Object3D();
  g.add(box(len, 0.3, 0.74, M('#ffffff', { roughness: 0.9 }), cx, 0.44, tz), box(len - 0.3, 0.7, 0.06, mDark, cx, 0, tz, false));
  const laeufer = sign(len - 0.1, 0.2, (c, w, h) => { c.fillStyle = C.orange; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 ${h * 0.5}px ${FD}`; for (let i = 0; i < 50; i++) c.fillText(String(1977 + i), (i + 0.5) * w / 50, h * 0.54); }, { res: 180 });
  laeufer.rotation.x = -PI / 2; laeufer.position.set(cx, 0.742, tz); g.add(laeufer);
  /* 23 Gedecke je Längsseite, je 2 an den Enden = 50 */
  const platz = []; for (let i = 0; i < 23; i++) { const x = x0 + 0.3 + i * (len - 0.6) / 22; platz.push([x, tz - 0.24, 0], [x, tz + 0.24, PI]); }
  for (const s of [-1, 1]) platz.push([s < 0 ? x0 + 0.16 : x1 - 0.16, tz - 0.13, s * PI / 2], [s < 0 ? x0 + 0.16 : x1 - 0.16, tz + 0.13, s * PI / 2]);
  const teller = farbInst(new THREE.CylinderGeometry(0.1, 0.085, 0.012, 20), platz.length, M('#ffffff', { roughness: 0.3 })), karte = farbInst(new THREE.BoxGeometry(0.1, 0.075, 0.006), platz.length, M('#ffffff', { roughness: 0.8 })); teller.castShadow = karte.castShadow = false;
  platz.forEach(([x, z, ry], i) => { o.rotation.set(0, 0, 0); o.position.set(x, 0.748, z); o.updateMatrix(); teller.setMatrixAt(i, o.matrix); o.position.set(x + 0.14, 0.78, z); o.rotation.y = ry + 0.2; o.updateMatrix(); karte.setMatrixAt(i, o.matrix); karte.setColorAt(i, col.set(bunt[i % 5])); });
  g.add(teller, karte);
  /* 25 Stühle auf der Raumseite; die Fensterbank mit den Sitzkissen ist die andere Bank */
  const sitz = farbInst(new THREE.BoxGeometry(0.4, 0.04, 0.4), 25, M('#ffffff', { roughness: 0.7 })), lehne = farbInst(new THREE.BoxGeometry(0.4, 0.42, 0.035), 25, M('#ffffff', { roughness: 0.7 })), bein = farbInst(new THREE.BoxGeometry(0.03, 0.44, 0.03), 100, mDark);
  for (let i = 0; i < 25; i++) {
    const x = x0 + 0.26 + i * (len - 0.52) / 24; o.rotation.set(0, 0, 0);
    o.position.set(x, 0.46, 8.98); o.updateMatrix(); sitz.setMatrixAt(i, o.matrix); sitz.setColorAt(i, col.set(bunt[i % 5]));
    o.position.set(x, 0.69, 8.79); o.updateMatrix(); lehne.setMatrixAt(i, o.matrix); lehne.setColorAt(i, col.set(bunt[i % 5]));
    [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].forEach(([dx, dz], k) => { o.position.set(x + dx, 0.22, 8.98 + dz); o.updateMatrix(); bein.setMatrixAt(i * 4 + k, o.matrix); });
  }
  g.add(sitz, lehne, bein);
  /* Torte: das Jahr 2027 */
  const [kx, kz] = mitte(l.fest.Torte), creme = M('#fff3e0', { roughness: 0.6 }), rosa = M(C.pink, { roughness: 0.5 });
  g.add(cyl(0.8, 0.72, M('#ffffff', { roughness: 0.9 }), kx, 0, kz, 40), cyl(0.56, 0.28, creme, kx, 0.72, kz, 40), cyl(0.41, 0.24, rosa, kx, 1.0, kz, 40), cyl(0.27, 0.2, creme, kx, 1.24, kz, 40));
  for (const [rad, y] of [[0.56, 1.0], [0.41, 1.24], [0.27, 1.44]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(rad - 0.02, 0.028, 8, 40), M(C.orange, { roughness: 0.4 })); t.rotation.x = PI / 2; t.position.set(kx, y, kz); g.add(t); }
  const kerzen = [[0.49, 1.0, 24], [0.34, 1.24, 16], [0.18, 1.44, 10]], kz50 = farbInst(new THREE.CylinderGeometry(0.008, 0.008, 0.11, 6), 50, M('#ffffff')), fl = new THREE.InstancedMesh(new THREE.SphereGeometry(0.014, 6, 5), new THREE.MeshBasicMaterial({ color: '#ffd23c' }), 50); let n = 0; kz50.castShadow = false;
  for (const [rad, y, cnt] of kerzen) for (let i = 0; i < cnt; i++) { const a = i / cnt * PI * 2; o.rotation.set(0, 0, 0); o.position.set(kx + Math.cos(a) * rad, y + 0.055, kz + Math.sin(a) * rad); o.updateMatrix(); kz50.setMatrixAt(n, o.matrix); kz50.setColorAt(n, col.set(bunt[n % 5])); o.position.y = y + 0.125; o.updateMatrix(); fl.setMatrixAt(n++, o.matrix); }
  g.add(kz50, fl); const topper = schild('50', 0.3, 0.22, C.tief, C.gelb); topper.position.set(kx, 1.68, kz); const topper2 = topper.clone(); topper2.rotation.y = PI; topper2.position.z -= 0.004; g.add(topper, topper2, box(0.012, 0.14, 0.012, mDark, kx, 1.44, kz, false));
  /* Wimpelketten, Ballons, Konfetti */
  const tri = new THREE.Shape(); tri.moveTo(-0.09, 0); tri.lineTo(0.09, 0); tri.lineTo(0, -0.2); tri.closePath();
  const ketten = [[[0.4, 5.6], [11.2, 5.5]], [[11.6, 0.4], [19.2, 5.4]], [[11.6, 5.6], [19.2, 0.6]], [[1.0, 10.0], [13.4, 8.4]]], wim = new THREE.InstancedMesh(new THREE.ShapeGeometry(tri), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), ketten.length * 26); n = 0;
  for (const [[ax, az], [bx, bz]] of ketten) for (let i = 0; i < 26; i++) { const t = (i + 0.5) / 26; o.position.set(ax + (bx - ax) * t, 2.42 - Math.sin(t * PI) * 0.28, az + (bz - az) * t); o.rotation.set(0, -Math.atan2(bz - az, bx - ax), 0); o.updateMatrix(); wim.setMatrixAt(n, o.matrix); wim.setColorAt(n++, col.set(bunt[i % 5])); }
  wim.userData.noAO = true; g.add(wim);
  for (const [bx, bz] of [[15.9, 5.3], [13.6, 6.0], [1.2, 8.2], [8.8, 7.6], [12.4, 0.8]]) for (let i = 0; i < 3; i++) { const x = bx + (r() - 0.5) * 0.5, z = bz + (r() - 0.5) * 0.5, y = 1.95 + r() * 0.3, b = ball(0.17, M(bunt[Math.floor(r() * 5)], { roughness: 0.25 }), x, y, z); b.scale.y = 1.18; g.add(b, box(0.004, y - 0.2, 0.004, mDark, x, 0, z, false)); }
  const konf = new THREE.InstancedMesh(new THREE.CircleGeometry(0.03, 8), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), 220);
  for (let i = 0; i < 220; i++) { o.position.set(0.5 + r() * 18.5, 0.013 + (i % 3) * 0.001, 5.4 + r() * 3.2); o.rotation.set(-PI / 2, 0, 0); o.updateMatrix(); konf.setMatrixAt(i, o.matrix); konf.setColorAt(i, col.set(bunt[i % 5])); }
  konf.userData.noAO = true; g.add(konf);
  return g;
};

/* M · Fünf Häuser: offene Hausgerüste in fünf Farben, je eines pro Stadtteil, Dorfplatz um die Litfaß-Säule */
BUEHNE.haeuser = l => {
  const g = new THREE.Group();
  const HAUS = [['s1', 'Sprendlingen', '#f2690d', [-2.2, -1.45, 2.2, 1.45], false], ['s3', 'Dreieichenhain', '#7b3fa0', null, false], ['s4', 'Buchschlag', '#7fb069', null, true], ['s7', 'Götzenhain', '#f5b70a', [-1.5, -0.3, 1.5, 1.6], false], ['s8', 'Offenthal', '#1d9aa6', null, true]];
  for (const [id, ort, col, eigen, rueck] of HAUS) {
    const h = amPlatz(l, id, (s, rcStd) => {
      const rc = eigen || rcStd, m = M(col, { roughness: 0.6 }), x0 = rc[0] - 0.1, x1 = rc[2] + 0.1, z0 = rc[1] - 0.06, z1 = rc[3] + 0.1, w = x1 - x0, d = z1 - z0, e = 1.98, first = 2.44, zc = (z0 + z1) / 2, B = 0.07;
      for (const x of [x0, x1]) for (const z of [z0, z1]) s.add(box(B, e, B, m, x, 0, z));
      s.add(box(w + B, B, B, m, (x0 + x1) / 2, e, z0), box(w + B, B, B, m, (x0 + x1) / 2, e, z1), box(w + 0.3, B, B, m, (x0 + x1) / 2, first, zc));
      for (const x of [x0, x1]) { s.add(box(B, B, d, m, x, e, zc)); for (const sgn of [-1, 1]) { const len = Math.hypot(d / 2, first - e), b = box(B, B, len, m, x, 0, 0); b.position.set(x, (e + first) / 2 + B / 2, zc + sgn * d / 4); b.rotation.x = sgn * Math.atan2(first - e, d / 2); s.add(b); } }
      const name = schild(ort, Math.min(w - 0.3, 1.9), 0.3, col, '#ffffff', FB); name.position.set((x0 + x1) / 2, e - 0.2, z1 + B / 2 + 0.004); s.add(name);
      if (rueck) { s.add(box(w, e, 0.03, m, (x0 + x1) / 2, 0, z0 - 0.02)); const hinten = schild(ort, Math.min(w - 0.3, 1.9), 0.42, col, '#ffffff', FB); hinten.rotation.y = PI; hinten.position.set((x0 + x1) / 2, 1.3, z0 - 0.04); s.add(hinten); }
    });
    if (h) g.add(h);
  }
  const platz = amPlatz(l, 's5', s => { [['#d9cdb4', 2.3], ['#efe6d2', 2.05], ['#d9cdb4', 0.95]].forEach(([c, rad], i) => { const k = cyl(rad, 0.006, M(c, { roughness: 1 }), 0, 0.004 + i * 0.003, 0, 64); k.castShadow = false; s.add(k); }); });
  if (platz) g.add(platz);
  const t = flatText('Dorfplatz', { size: 0.3, color: '#6b5d45', weight: 700 }); const p5 = poseIn(l, 's5'); if (p5) { t.position.set(p5.x, 0.02, p5.z + 1.55); g.add(t); }
  return g;
};
