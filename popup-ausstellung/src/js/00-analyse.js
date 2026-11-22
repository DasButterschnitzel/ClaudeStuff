/* =====================================================================
   ANALYSE: Besucherfluss und Sicht. Reine Rechenfunktionen ohne Browser,
   laufen in der Seite (Heatmaps) und im Werkzeug tools/layout-score.mjs.
   Raster 10 cm. x = Breite ab Natursteinwand, z = Tiefe ab Rückwand.
   ===================================================================== */
export const A_ROOM = [[0, 0], [5.55, 0], [5.55, 3.1], [8.15, 3.1], [8.15, 5.2], [11.4, 5.2], [11.4, 0], [19.45, 0], [19.45, 9.35], [16.55, 9.35], [16.55, 10.2], [0, 10.2]];
/* Fest: [Name, Rechteck, versperrt den Weg, versperrt die Sicht in Augenhöhe] */
export const A_FEST = [
  ['Wohnzimmer', [0.05, 0.02, 4.45, 2.92], 1, 0], ['Theke', [1.0, 3.12, 4.2, 3.78], 1, 0],
  ['Stütze', [2.59, 4.78, 2.89, 5.08], 1, 1], ['Stütze', [5.37, 4.78, 5.67, 5.08], 1, 1], ['Stütze', [13.79, 4.94, 14.05, 5.2], 1, 1], ['Stütze', [16.6, 4.9, 16.86, 5.16], 1, 1],
  ['Stellwand am Wohnzimmer', [4.46, 0.1, 4.58, 2.3], 1, 1],
];
/* Beweglich: Grundfläche, sichtversperrende Teile, „Gesichter“ [x, z, Seite] (Seite 1 = nur von vorn zu sehen, -1 = nur von hinten, 0 = egal), Halt davor */
export const A_ITEMS = {
  s2: { rect: [-1.55, -1.18, 1.55, 1.18], sicht: [[-1.55, -1.18, 1.55, -1.0], [-1.55, -1.18, -1.45, 0.4], [1.45, -1.18, 1.55, 0.4]], gesicht: [[0, 1.22, 1], [-0.9, 1.22, 1], [0.9, 1.22, 1], [0, -1.22, -1]], halt: [0, 1.9] },
  s3: { rect: [-1.15, -1.05, 1.27, 1.05], sicht: [[-1.27, -1.05, 1.27, -0.98], [1.2, -1.05, 1.27, 1.05]], gesicht: [[0, 0.5, 0], [-0.5, -0.2, 0]], halt: [0, 1.7] },
  s4: { rect: [-1.35, -0.47, 1.35, 0.6], sicht: [[-1.35, -0.47, 1.35, -0.38]], gesicht: [[0, -0.34, 1], [-0.8, -0.34, 1], [0.8, -0.34, 1]], halt: [0, 1.5] },
  s5: { rect: [-0.6, -0.6, 0.6, 0.6], sicht: [[-0.5, -0.5, 0.5, 0.5]], gesicht: [[0, 0.68, 0], [0.68, 0, 0], [-0.68, 0, 0], [0, -0.68, 0]], halt: 'rund' },
  s7: { rect: [-1.4, -0.3, 1.4, 1.6], sicht: [[-1.3, -0.3, 1.3, 0.06]], gesicht: [[0, 0.1, 1], [-0.95, 0.1, 1], [0.95, 0.1, 1]], halt: [0, 2.1] },
  s8: { rect: [-1.3, -0.62, 1.3, 0.85], sicht: [[-1.25, -0.62, 1.25, -0.55]], gesicht: [[0, -0.5, 1], [-0.8, -0.5, 1], [0.8, -0.5, 1]], halt: [0, 1.45] },
  fahne: { rect: [-0.65, -0.1, 0.65, 0.1], sicht: [[-0.6, -0.04, 0.6, 0.04]] },
  wand2: { rect: [-1.1, -0.06, 1.1, 0.06], sicht: [[-1.1, -0.06, 1.1, 0.06]] },
  wand3: { rect: [-1.1, -0.06, 1.1, 0.06], sicht: [[-1.1, -0.06, 1.1, 0.06]] },
};
/* Feste Inseln: Gesichter und Halte in Raumkoordinaten */
export const A_FIX = {
  s1: { gesicht: [[3.4, 1.5], [2.2, 1.6], [1.2, 1.4]], halt: [[0.55, 3.45]] },
  s6: { gesicht: [[19.4, 1.5], [19.4, 3.5], [19.4, 5.5], [19.4, 7.5]], halt: [[18.75, 7.0], [18.75, 4.6], [18.75, 2.2]] },
};
export const A_EINGANG = [17.7, 8.6];
export const A_OVALE = [['lang', 1.9], ['lang', 5.9], ['lang', 9.8], ['lang', 13.4], ['kurz', 5.3], ['kurz', 8.8]];   // Mitte der klaren Ovale in der Folierung
export const A_NAMEN = { s1: 'Wohnzimmer', s2: 'Mero-System', s3: 'Selfie-Station', s4: 'Statistik', s5: 'Litfaß-Säule', s6: 'Gebietsreform', s7: 'Slide-Show', s8: 'Zukunft & Lieblingsplatz' };

export function analyse(layout, opt = {}) {
  const S = 0.1, W = 196, H = 104, N = W * H, pos = layout.pos || {}, rundgang = layout.rundgang || ['s6', 's5', 's7', 's8', 's4', 's3', 's1', 's2'];
  const idx = (x, z) => Math.min(H - 1, Math.max(0, Math.floor(z / S))) * W + Math.min(W - 1, Math.max(0, Math.floor(x / S)));
  const inPoly = (x, z) => { let c = false; for (let i = 0, j = A_ROOM.length - 1; i < A_ROOM.length; j = i++) { const [xi, zi] = A_ROOM[i], [xj, zj] = A_ROOM[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
  const toWorld = (p, x, z) => { const a = (p.r || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [p.x + x * c + z * s, p.z - x * s + z * c]; };
  const wand = new Uint8Array(N), dicht = new Uint8Array(N);       // wand: Weg versperrt · dicht: Sicht versperrt
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) if (!inPoly((i + 0.5) * S, (j + 0.5) * S)) { wand[j * W + i] = 1; dicht[j * W + i] = 1; }
  const fillRect = (g, [x0, z0, x1, z1]) => { for (let j = Math.max(0, Math.floor(z0 / S)); j <= Math.min(H - 1, Math.floor(z1 / S)); j++) for (let i = Math.max(0, Math.floor(x0 / S)); i <= Math.min(W - 1, Math.floor(x1 / S)); i++) { const x = (i + 0.5) * S, z = (j + 0.5) * S; if (x >= x0 && x <= x1 && z >= z0 && z <= z1) g[j * W + i] = 1; } };
  const fillRot = (g, p, [x0, z0, x1, z1], pad = 0) => {     // gedrehtes Rechteck: Zellen in lokale Koordinaten zurückrechnen
    const cs = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(q => toWorld(p, q[0], q[1])), a = (p.r || 0) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const bx0 = Math.min(...cs.map(q => q[0])) - pad, bx1 = Math.max(...cs.map(q => q[0])) + pad, bz0 = Math.min(...cs.map(q => q[1])) - pad, bz1 = Math.max(...cs.map(q => q[1])) + pad;
    for (let j = Math.max(0, Math.floor(bz0 / S)); j <= Math.min(H - 1, Math.floor(bz1 / S)); j++) for (let i = Math.max(0, Math.floor(bx0 / S)); i <= Math.min(W - 1, Math.floor(bx1 / S)); i++) {
      const dx = (i + 0.5) * S - p.x, dz = (j + 0.5) * S - p.z, lx = dx * c - dz * s, lz = dx * s + dz * c;
      if (lx >= x0 - pad && lx <= x1 + pad && lz >= z0 - pad && lz <= z1 + pad) g[j * W + i] = 1;
    }
  };
  const sw = layout.stellwandX;   // Wohnzimmer schmaler: Stellwand weiter links
  for (const [n, r0, w, d] of A_FEST) { const r = !sw ? r0 : n === 'Wohnzimmer' ? [0.05, 0.02, sw - 0.07, 2.92] : n === 'Stellwand am Wohnzimmer' ? [sw - 0.06, 0.1, sw + 0.06, 2.3] : r0; if (w) fillRect(wand, r); if (d) fillRect(dicht, r); }
  for (const r of Object.values(layout.fest || {})) { fillRect(wand, r); fillRect(dicht, r); }
  for (const r of Object.values(layout.niedrig || {})) fillRect(wand, r);   // niedrige Einbauten: Weg versperrt, Sicht frei
  for (const [id, it] of Object.entries(A_ITEMS)) { const p = pos[id]; if (!p) continue; fillRot(wand, p, it.rect); for (const r of it.sicht) fillRot(dicht, p, r, 0.03); }

  /* Abstand zur nächsten Kante (für Engstellen und angenehme Wegführung) */
  const frei = new Float32Array(N).fill(1e9), q = new Int32Array(N); let qh = 0, qt = 0;
  const NB = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.4142], [1, -1, 1.4142], [-1, 1, 1.4142], [-1, -1, 1.4142]];
  for (let k = 0; k < N; k++) if (wand[k]) frei[k] = 0;
  const lockern = (i, j, di, dj, w) => { const a = i + di, b = j + dj; const d = (a < 0 || b < 0 || a >= W || b >= H) ? 0 : frei[b * W + a]; if (d + w * S < frei[j * W + i]) frei[j * W + i] = d + w * S; };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { lockern(i, j, -1, 0, 1); lockern(i, j, 0, -1, 1); lockern(i, j, -1, -1, 1.4142); lockern(i, j, 1, -1, 1.4142); }
  for (let j = H - 1; j >= 0; j--) for (let i = W - 1; i >= 0; i--) { lockern(i, j, 1, 0, 1); lockern(i, j, 0, 1, 1); lockern(i, j, 1, 1, 1.4142); lockern(i, j, -1, 1, 1.4142); }
  const R_KOERPER = 0.38, geht = k => frei[k] >= R_KOERPER;
  const naechsteFreie = (x, z) => { let best = -1, bd = 1e9; const ci = Math.floor(x / S), cj = Math.floor(z / S); for (let dj = -14; dj <= 14; dj++) for (let di = -14; di <= 14; di++) { const a = ci + di, b = cj + dj; if (a < 0 || b < 0 || a >= W || b >= H) continue; const k = b * W + a, d = di * di + dj * dj - Math.min(frei[k], 0.8) * 20; if (geht(k) && d < bd) { bd = d; best = k; } } return best; };

  /* Halte je Insel */
  const halte = [];   // { id, k }
  const addHalt = (id, x, z) => { const k = naechsteFreie(x, z); if (k >= 0) halte.push({ id, k, x: (k % W + 0.5) * S, z: (Math.floor(k / W) + 0.5) * S }); };
  const start = naechsteFreie(A_EINGANG[0], A_EINGANG[1]);
  for (const id of rundgang) {
    if (A_FIX[id]) { for (const [x, z] of A_FIX[id].halt) addHalt(id, x, z); continue; }
    const it = A_ITEMS[id], p = pos[id]; if (!it || !p) continue;
    if (it.halt === 'rund') { let best = null; for (const [dx, dz] of [[0, 1.15], [1.15, 0], [-1.15, 0], [0, -1.15]]) { const k = naechsteFreie(p.x + dx, p.z + dz); if (k >= 0 && (!best || frei[k] > frei[best.k])) best = { k, x: p.x + dx, z: p.z + dz }; } if (best) addHalt(id, best.x, best.z); }
    else { const [x, z] = toWorld(p, it.halt[0], it.halt[1]); addHalt(id, x, z); }
  }

  /* Kürzeste Wege (Dijkstra), enge Stellen kosten mehr, damit die Wege mittig laufen */
  const dijkstra = src => {
    const D = new Float64Array(N).fill(1e9), P = new Int32Array(N).fill(-1), heap = [[0, src]]; D[src] = 0;   // Float64: sonst verwirft der Vergleich d > D[k] gerundete Einträge
    const push = e => { let i = heap.push(e) - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const t = heap[0], l = heap.pop(); if (heap.length) { heap[0] = l; let i = 0; for (;;) { const a = 2 * i + 1, b = a + 1; let m = i; if (a < heap.length && heap[a][0] < heap[m][0]) m = a; if (b < heap.length && heap[b][0] < heap[m][0]) m = b; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return t; };
    while (heap.length) { const [d, k] = pop(); if (d > D[k]) continue; const i = k % W, j = (k - i) / W;
      for (const [di, dj, w] of NB) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= W || b >= H) continue; const n = b * W + a; if (!geht(n)) continue; const nd = d + w * S * (1 + 2.2 * Math.max(0, 0.95 - frei[n])); if (nd < D[n]) { D[n] = nd; P[n] = k; push([nd, n]); } } }
    return { D, P };
  };
  const feld = new Map(); const von = k => { if (!feld.has(k)) feld.set(k, dijkstra(k)); return feld.get(k); };
  const weg = (a, b) => { const { D, P } = von(a); if (D[b] > 1e8) return null; const out = []; for (let k = b; k !== -1; k = P[k]) out.push(k); return out.reverse(); };
  const laenge = w => { let l = 0; for (let i = 1; i < w.length; i++) l += (Math.abs(w[i] % W - w[i - 1] % W) + Math.abs(Math.floor(w[i] / W) - Math.floor(w[i - 1] / W)) === 2 ? 1.4142 : 1) * S; return l; };

  /* s6 hat drei Halte an der Wand: in Laufrichtung sortieren */
  const reihenfolge = []; { let cur = start, i = 0; while (i < halte.length) { let j = i; while (j < halte.length && halte[j].id === halte[i].id) j++; const grp = halte.slice(i, j); if (grp.length > 1) { const D = von(cur).D; grp.sort((a, b) => D[a.k] - D[b.k]); if (D[grp[grp.length - 1].k] < D[grp[0].k]) grp.reverse(); } for (const h of grp) { reihenfolge.push(h); cur = h.k; } i = j; } }
  const beine = []; { let cur = start; for (const h of reihenfolge) { const w = weg(cur, h.k); if (w) { beine.push({ nach: h.id, w }); cur = h.k; } } const heim = weg(cur, start); if (heim) beine.push({ nach: 'ausgang', w: heim }); }
  const unerreichbar = rundgang.filter(id => !reihenfolge.some(h => h.id === id) || !beine.some(b => b.nach === id));

  /* Lauf-Heatmap: Rundgänger, Stöberer (immer zur nächsten Insel), Kurzbesucher */
  const lauf = new Float32Array(N), add = (w, g) => { for (const k of w) lauf[k] += g; };
  for (const b of beine) add(b.w, 0.6);
  { let cur = start; const offen = new Map(); for (const h of reihenfolge) if (!offen.has(h.id)) offen.set(h.id, h); while (offen.size) { const D = von(cur).D; let best = null; for (const h of offen.values()) if (!best || D[h.k] < D[best.k]) best = h; const w = weg(cur, best.k); if (w) add(w, 0.25); cur = best.k; offen.delete(best.id); } const w = weg(cur, start); if (w) add(w, 0.25); }
  { const D = von(start).D, nah = [...new Map(reihenfolge.map(h => [h.id, h])).values()].sort((a, b) => D[a.k] - D[b.k]).slice(0, 3); let cur = start; for (const h of nah) { const w = weg(cur, h.k); if (w) add(w, 0.15); cur = h.k; } const w = weg(cur, start); if (w) add(w, 0.15); }
  for (const h of reihenfolge) lauf[h.k] += 2.5;     // Verweilen am Halt
  const weich = (g, r, n) => { const t = new Float32Array(N); for (let pass = 0; pass < n; pass++) { for (let j = 0; j < H; j++) { let s = 0; for (let i = -r; i < W + r; i++) { if (i + r < W) s += g[j * W + i + r] || 0; if (i - r - 1 >= 0) s -= g[j * W + i - r - 1]; if (i >= 0 && i < W) t[j * W + i] = s / (2 * r + 1); } } for (let i = 0; i < W; i++) { let s = 0; for (let j = -r; j < H + r; j++) { if (j + r < H) s += t[(j + r) * W + i] || 0; if (j - r - 1 >= 0) s -= t[(j - r - 1) * W + i]; if (j >= 0 && j < H) g[j * W + i] = s / (2 * r + 1); } } } };
  weich(lauf, 3, 2); for (let k = 0; k < N; k++) if (wand[k]) lauf[k] = 0;
  const norm = g => { const v = Array.from(g).filter(x => x > 0).sort((a, b) => a - b), m = v.length ? v[Math.floor(v.length * 0.985)] || v[v.length - 1] : 1; for (let k = 0; k < N; k++) g[k] = Math.min(1, g[k] / (m || 1)); };
  norm(lauf);

  /* Sicht: von jedem Punkt des Rundgangs aus Strahlen in alle Richtungen, nach vorn stärker gewichtet */
  const los = (x0, z0, x1, z1, stopp = 0.14) => { const d = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(d / (S * 0.5)); for (let i = 1; i < n; i++) { const t = i / n; if ((1 - t) * d < stopp) break; if (dicht[idx(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t)]) return false; } return true; };
  const gesichter = {};
  for (const id of Object.keys(A_NAMEN)) { if (A_FIX[id]) gesichter[id] = A_FIX[id].gesicht.map(([x, z]) => ({ x, z, seite: 0 })); else if (pos[id]) gesichter[id] = A_ITEMS[id].gesicht.map(([x, z, seite]) => { const [wx, wz] = toWorld(pos[id], x, z); return { x: wx, z: wz, seite, lz: z }; }); }
  const sieht = (id, x, z, weit = 14) => (gesichter[id] || []).some(g => { const d = Math.hypot(g.x - x, g.z - z); if (d > weit || d < 0.3) return false; if (g.seite && !A_FIX[id]) { const p = pos[id], a = (p.r || 0) * Math.PI / 180, lz = (x - p.x) * Math.sin(a) + (z - p.z) * Math.cos(a); if (g.seite > 0 ? lz < g.lz + 0.1 : lz > g.lz - 0.1) return false; } return los(x, z, g.x, g.z); });
  const sicht = new Float32Array(N), proben = []; let gelaufen = 0;
  for (const b of beine) for (let i = 0; i < b.w.length; i++) { if (i > 0) gelaufen += (Math.abs(b.w[i] % W - b.w[i - 1] % W) + Math.abs(Math.floor(b.w[i] / W) - Math.floor(b.w[i - 1] / W)) === 2 ? 1.4142 : 1) * S; if (i % 3) continue; const k = b.w[i], n = b.w[Math.min(b.w.length - 1, i + 6)]; proben.push({ x: (k % W + 0.5) * S, z: (Math.floor(k / W) + 0.5) * S, h: Math.atan2(Math.floor(n / W) - Math.floor(k / W), n % W - k % W), m: gelaufen, g: 1 }); }
  for (const h of reihenfolge) proben.push({ x: h.x, z: h.z, h: 0, m: -1, g: 4, rund: 1 });
  if (!opt.ohneSichtkarte) for (const p of proben) for (let a = 0; a < 120; a++) { const w = a * Math.PI / 60, dx = Math.cos(w), dz = Math.sin(w), g = p.g * (p.rund ? 0.7 : 0.3 + 0.7 * Math.max(0, Math.cos(w - p.h)));
    for (let d = S; d < 14; d += S) { const x = p.x + dx * d, z = p.z + dz * d; if (x < 0 || z < 0 || x >= 19.6 || z >= 10.4) break; const k = idx(x, z); sicht[k] += g / (1 + d / 5); if (dicht[k]) { sicht[k] += g * 1.5 / (1 + d / 5); break; } } }
  weich(sicht, 1, 1); norm(sicht);

  /* Kennzahlen je Insel */
  const unterwegs = proben.filter(p => p.m >= 0), inseln = {};
  for (const id of Object.keys(A_NAMEN)) { if (!gesichter[id]) continue; const ges = unterwegs.filter(p => sieht(id, p.x, p.z)), erst = ges.length ? Math.min(...ges.map(p => p.m)) : null;
    let ovale = 0; for (const [front, c] of A_OVALE) { let ok = false; for (let t = -1.3; t <= 1.3 && !ok; t += 0.26) { const [x, z] = front === 'lang' ? [c + t, 10.15] : [0.05, c + t]; if (sieht(id, x, z, 8)) ok = true; } if (ok) ovale++; }   // durch ein Oval zählt nur, was höchstens 8 m entfernt ist
    inseln[id] = { name: A_NAMEN[id], sichtAnteil: +(ges.length / Math.max(1, unterwegs.length)).toFixed(2), erstkontakt_m: erst === null ? null : +erst.toFixed(1), vomEingang: sieht(id, A_EINGANG[0], A_EINGANG[1]), ovale }; }

  /* Kennzahlen zum Weg */
  const routeLen = beine.reduce((a, b) => a + laenge(b.w), 0), zaehl = new Uint8Array(N), nahHalt = new Uint8Array(N);
  for (const h of [...reihenfolge, { k: start }]) { const i0 = h.k % W, j0 = Math.floor(h.k / W); for (let dj = -9; dj <= 9; dj++) for (let di = -9; di <= 9; di++) { const a = i0 + di, b = j0 + dj; if (a >= 0 && b >= 0 && a < W && b < H) nahHalt[b * W + a] = 1; } }
  let zellen = 0, doppelt = 0; for (const b of beine) { const set = new Set(); for (const k of b.w) for (const [di, dj] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = k + di + dj * W; if (n >= 0 && n < N) set.add(n); } for (const k of set) zaehl[k]++; }
  for (let k = 0; k < N; k++) if (zaehl[k] && !nahHalt[k]) { zellen++; if (zaehl[k] > 1) doppelt++; }
  const fern = new Float32Array(N).fill(1e9); qh = qt = 0; for (const b of beine) for (const k of b.w) if (fern[k] > 0) { fern[k] = 0; q[qt++] = k; }
  while (qh < qt) { const k = q[qh++], i = k % W, j = (k - i) / W; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= W || b >= H) continue; const n = b * W + a; if (wand[n] || fern[n] <= fern[k] + S) continue; fern[n] = fern[k] + S; if (qt < N) q[qt++] = n; } }
  let freiZ = 0, abseits = 0; for (let k = 0; k < N; k++) if (!wand[k]) { freiZ++; if (fern[k] > 3) abseits++; }
  const eng = new Map(); for (const b of beine) for (const k of b.w) if (frei[k] < 0.6 && !nahHalt[k]) { const key = Math.round((k % W) * S) + ',' + Math.round(Math.floor(k / W) * S); const e = eng.get(key); if (!e || frei[k] < e.f) eng.set(key, { x: +((k % W + 0.5) * S).toFixed(1), z: +((Math.floor(k / W) + 0.5) * S).toFixed(1), f: frei[k] }); }
  const engstellen = [...eng.values()].sort((a, b) => a.f - b.f).slice(0, 6).map(e => ({ x: e.x, z: e.z, breite_m: +(e.f * 2).toFixed(2) }));
  const ins = Object.values(inseln), mSicht = ins.reduce((a, i) => a + i.sichtAnteil, 0) / Math.max(1, ins.length), strasse = ins.filter(i => i.ovale > 0).length / Math.max(1, ins.length), doppelAnteil = zellen ? doppelt / zellen : 0, abseitsAnteil = freiZ ? abseits / freiZ : 0;
  const wert = unerreichbar.length ? 0 : Math.round(100 * (0.32 * Math.min(1, mSicht / 0.45) + 0.2 * (1 - doppelAnteil) + 0.13 * (1 - Math.min(1, abseitsAnteil * 3)) + 0.15 * strasse + 0.1 * (1 - Math.min(1, engstellen.length / 6)) + 0.1 * (ins.filter(i => i.vomEingang).length >= 3 ? 1 : ins.filter(i => i.vomEingang).length / 3)));
  const pfad = beine.map(b => ({ nach: b.nach, punkte: b.w.filter((_, i) => i % 2 === 0 || i === b.w.length - 1).map(k => [+((k % W + 0.5) * S).toFixed(2), +((Math.floor(k / W) + 0.5) * S).toFixed(2)]) }));
  return {
    W, H, S, lauf, sicht, pfad, halte: reihenfolge.map(h => ({ id: h.id, x: +h.x.toFixed(2), z: +h.z.toFixed(2) })),
    kennzahlen: { gesamtwert: wert, rundgang_m: +routeLen.toFixed(1), doppelwegAnteil: +doppelAnteil.toFixed(2), abseitsAnteil: +abseitsAnteil.toFixed(2), mittlereSicht: +mSicht.toFixed(2), inselnVonDerStrasse: ins.filter(i => i.ovale > 0).length, inselnVomEingang: ins.filter(i => i.vomEingang).length, engstellen, unerreichbar },
    inseln,
  };
}
