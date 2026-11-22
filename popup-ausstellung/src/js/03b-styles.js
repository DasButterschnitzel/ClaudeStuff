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
