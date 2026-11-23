#!/usr/bin/env node
// Prüft ein Ausstellungs-Layout für den Pop-up-Store: liegt alles im Raum, überschneidet sich nichts,
// bleiben Türen frei, kommt man mit 90 cm (und mit 1,20 m) Durchgang überall hin?
// Aufruf: node layout-check.mjs layout.json      (oder JSON direkt als Argument)
// Optional: "fest": { Name: [x0, z0, x1, z1] } zusätzliche hohe Einbauten · "niedrig": dasselbe für Niedriges (versperrt den Weg, nicht die Sicht).
// Optional: "stellwandX": 4.25 – Stellwand am Wohnzimmer weiter links (Standard 4,52), das Wohnzimmer wird entsprechend schmaler.
// Eingabe: { "pos": { "s2": {"x":3.4,"z":7.5,"r":0}, "s3": …, "s4": …, "s5": …, "s7": …, "s8": …, "fahne": …, optional "wand2", "wand3" } }
// x = Breite ab Natursteinwand (0 … 19,45), z = Tiefe ab Rückwand (0 … 10,2), r = Drehung in Grad.
// r = 0: Besucherseite zeigt zur langen Fensterfront (+z) · 90: zur Brandmauer (+x) · 180: zur Rückwand · 270: zur Natursteinwand.
import { readFileSync, existsSync } from 'node:fs';
import { A_THEKE } from '../src/js/00-analyse.js';

export const ROOM = [[0, 0], [5.55, 0], [5.55, 3.1], [8.15, 3.1], [8.15, 5.2], [11.4, 5.2], [11.4, 0], [19.45, 0], [19.45, 9.35], [16.55, 9.35], [16.55, 10.2], [0, 10.2]];
// Feste Dinge als Rechtecke [x0, z0, x1, z1]
export const FIXED = {
  'Wohnzimmer (Insel 1)': [0.05, 0.02, 4.45, 2.92],
  'Theke (langer Schenkel)': A_THEKE[0], 'Theke (kurzer Schenkel)': A_THEKE[1],   // fest eingebaut, L um die linke Stütze der rechten Halle
  'Stütze 1 (links)': [2.59, 4.78, 2.89, 5.08], 'Stütze 2': [5.37, 4.78, 5.67, 5.08],
  'Stütze 3 (an der Theke)': [13.79, 4.94, 14.05, 5.2], 'Stütze 4 (am Eingang)': [16.6, 4.9, 16.86, 5.16],
  'Gebietsreform-Wand (Insel 6)': [19.4, 0, 19.45, 9.35],
  'Stellwand am Wohnzimmer': [4.46, 0.1, 4.58, 2.3],
};
// Flächen, die frei bleiben müssen
export const KEEP_STD = {
  'Eingang': [16.5, 7.7, 19.0, 9.35], 'Gang zu Hoftür und Lager': [4.6, 0, 5.55, 3.1], 'Tür zu den Nebenräumen': [16.9, 0, 18.15, 1.2],
  'Zugang Wohnzimmer': [0.4, 2.92, 4.1, 3.9], 'Kundenseite der Theke': [13.9, 5.4, 15.6, 6.2], 'Personalplatz hinter der Theke': [13.8, 3.7, 15.7, 4.75], 'Betrachtungsstreifen vor der Gebietsreform-Wand': [18.2, 0.3, 19.4, 7.6],
};
// Bewegliche Dinge: Rechteck lokal [x0, z0, x1, z1] um den Mittelpunkt, vorn = +z; view = freie Tiefe vor der Besucherseite
export const ITEMS = {
  s2: { name: 'Mero-System', rect: [-1.55, -1.18, 1.55, 1.18], view: 1.2 },
  s3: { name: 'Selfie-Koje', rect: [-1.15, -1.05, 1.27, 1.05], view: 1.2 },
  s4: { name: 'Statistik', rect: [-1.35, -0.47, 1.35, 0.6], view: 1.4 },
  s5: { name: 'Litfaß-Säule', rect: [-0.6, -0.6, 0.6, 0.6], view: 0 },
  s7: { name: 'Medienstelen mit Bank', rect: [-1.4, -0.3, 1.4, 1.6], view: 0.6 },
  s8: { name: 'Zukunft/Lieblingsplatz', rect: [-1.3, -0.62, 1.3, 0.85], view: 1.0 },
  fahne: { name: 'Willkommens-Fahne', rect: [-0.65, -0.1, 0.65, 0.1], view: 0 },
  wand2: { name: 'Zusätzliche Stellwand 2', rect: [-1.1, -0.06, 1.1, 0.06], view: 0, optional: true },
  wand3: { name: 'Zusätzliche Stellwand 3', rect: [-1.1, -0.06, 1.1, 0.06], view: 0, optional: true },
};
const ENTRY = [17.7, 8.5];
const ACCESS = { 'Hoftür': [5.05, 0.7], 'Lagertür': [5.1, 1.2], 'Nebenraum-Tür': [17.5, 0.7], 'Wohnzimmer': [2.2, 3.6], 'Theke (Kundenseite)': [14.75, 6.0], 'Theke (Personalseite)': [14.8, 4.2], 'Gebietsreform-Wand': [18.7, 4.5] };

const rad = d => d * Math.PI / 180;
const toWorld = (p, [x, z]) => { const c = Math.cos(rad(p.r || 0)), s = Math.sin(rad(p.r || 0)); return [p.x + x * c + z * s, p.z - x * s + z * c]; };
const corners = (p, [x0, z0, x1, z1]) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(q => toWorld(p, q));
const rectPoly = ([x0, z0, x1, z1]) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
function inPoly([x, z], poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, zi] = poly[i], [xj, zj] = poly[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; }
function overlap(a, b) {   // Trennachsen-Test für konvexe Vielecke; Berühren zählt nicht
  for (const poly of [a, b]) for (let i = 0; i < poly.length; i++) {
    const [x0, z0] = poly[i], [x1, z1] = poly[(i + 1) % poly.length], nx = z1 - z0, nz = x0 - x1;
    const pr = P => P.map(([x, z]) => x * nx + z * nz), pa = pr(a), pb = pr(b);
    if (Math.max(...pa) <= Math.min(...pb) + 1e-6 || Math.max(...pb) <= Math.min(...pa) + 1e-6) return false;
  }
  return true;
}

export function check(layout) {
  const errors = [], warnings = [], pos = layout.pos || {}, polys = {};
  const FIXED_ALL = { ...FIXED, ...(layout.fest || {}), ...(layout.niedrig || {}) };   // fest: zusätzliche Einbauten eines Konzepts, z. B. Vorhang oder Bauzaun
  const KEEP = { ...KEEP_STD };
  if (layout.stellwandX) {   // Wohnzimmer schmaler bauen: Stellwand rückt nach links, der Gang zur Hoftür wird breiter
    const w = layout.stellwandX;
    FIXED_ALL['Wohnzimmer (Insel 1)'] = [0.05, 0.02, w - 0.07, 2.92]; FIXED_ALL['Stellwand am Wohnzimmer'] = [w - 0.06, 0.1, w + 0.06, 2.3]; KEEP['Gang zu Hoftür und Lager'] = [w + 0.08, 0, 5.55, 3.1];
  }
  for (const id of Object.keys(ITEMS)) {
    const p = pos[id];
    if (!p && ITEMS[id].optional) continue;
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.z)) { errors.push(`${ITEMS[id].name} (${id}): Stellung fehlt`); continue; }
    const [a0, b0, a1, b1] = ITEMS[id].rect, T = 0.03;   // 3 cm Toleranz, damit „an der Wand“ nicht als Überschneidung zählt
    polys[id] = corners(p, [a0 + T, b0 + T, a1 - T, b1 - T]);
    if (!polys[id].every(q => inPoly(q, ROOM))) errors.push(`${ITEMS[id].name} (${id}) ragt aus dem Raum oder in Lager/Treppenhaus/Fensterbank`);
    for (const [n, r] of Object.entries(FIXED_ALL)) if (overlap(polys[id], rectPoly(r))) errors.push(`${ITEMS[id].name} (${id}) steht in: ${n}`);
    for (const [n, r] of Object.entries(KEEP)) if (overlap(polys[id], rectPoly(r))) errors.push(`${ITEMS[id].name} (${id}) verstellt: ${n}`);
  }
  const ids = Object.keys(polys);
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if (overlap(polys[ids[i]], polys[ids[j]])) errors.push(`${ITEMS[ids[i]].name} und ${ITEMS[ids[j]].name} überschneiden sich`);
  // Betrachtungsraum vor der Besucherseite
  for (const id of ids) {
    const it = ITEMS[id]; if (!it.view) continue;
    const [x0, , x1, z1] = it.rect, v = corners(pos[id], [x0 + 0.2, z1, x1 - 0.2, z1 + it.view]);
    if (!v.every(q => inPoly(q, ROOM))) warnings.push(`${it.name}: vor der Besucherseite sind keine ${it.view} m frei (Wand, Bank oder Raumkante)`);
    for (const o of ids) if (o !== id && overlap(v, polys[o])) warnings.push(`${it.name}: ${ITEMS[o].name} steht im Betrachtungsraum`);
    for (const [n, r] of Object.entries(FIXED_ALL)) if (overlap(v, rectPoly(r))) warnings.push(`${it.name}: ${n} liegt im Betrachtungsraum`);
  }
  // Medienstelen: Bildschirme nicht zur Fensterfront drehen
  if (pos.s7) { const r = (((pos.s7.r || 0) % 360) + 360) % 360; if (r < 45 || r > 315) warnings.push('Medienstelen: Bildschirme zeigen zur langen Fensterfront, Betrachter stehen im Gegenlicht davor'); if (r > 225 && r < 315 && pos.s7.x < 6) warnings.push('Medienstelen: Bildschirme zeigen zur kurzen Fensterfront'); }
  // Erreichbarkeit auf einem 10-cm-Raster, einmal mit 90 cm und einmal mit 1,20 m Durchgang
  const S = 0.1, W = Math.ceil(19.6 / S), H = Math.ceil(10.4 / S), solid = new Uint8Array(W * H);
  const blockers = [...Object.values(FIXED_ALL).map(rectPoly), ...Object.values(polys)];
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const q = [(i + 0.5) * S, (j + 0.5) * S]; if (!inPoly(q, ROOM) || blockers.some(b => inPoly(q, b))) solid[j * W + i] = 1; }
  const reach = (clear) => {
    const k = Math.floor(clear / 2 / S + 1e-9), free = new Uint8Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { let ok = 1; for (let dj = -k; dj <= k && ok; dj++) for (let di = -k; di <= k; di++) { if (di * di + dj * dj > k * k) continue; const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= W || b >= H || solid[b * W + a]) { ok = 0; break; } } free[j * W + i] = ok; }
    const seen = new Uint8Array(W * H), st = [[Math.floor(ENTRY[0] / S), Math.floor(ENTRY[1] / S)]];
    while (st.length) { const [i, j] = st.pop(); if (i < 0 || j < 0 || i >= W || j >= H || seen[j * W + i] || !free[j * W + i]) continue; seen[j * W + i] = 1; st.push([i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]); }
    const near = ([x, z]) => { const ci = Math.floor(x / S), cj = Math.floor(z / S); for (let dj = -4; dj <= 4; dj++) for (let di = -4; di <= 4; di++) { const a = ci + di, b = cj + dj; if (a >= 0 && b >= 0 && a < W && b < H && seen[b * W + a]) return true; } return false; };
    return { near, area: seen.reduce((a, v) => a + v, 0) * S * S };
  };
  const r90 = reach(0.9), r120 = reach(1.2), targets = { ...ACCESS };
  for (const id of ids) { const it = ITEMS[id]; if (id.startsWith('wand') || id === 'fahne') continue; targets[it.name] = id === 's5' ? null : toWorld(pos[id], [(it.rect[0] + it.rect[2]) / 2, it.rect[3] + 0.6]); }
  for (const [n, q] of Object.entries(targets)) {
    const pts = q ? [q] : [[0.95, 0], [-0.95, 0], [0, 0.95], [0, -0.95]].map(d => [pos.s5.x + d[0], pos.s5.z + d[1]]);
    if (!pts.some(r90.near)) errors.push(`${n}: mit 90 cm Durchgang vom Eingang aus nicht erreichbar`);
    else if (!pts.some(r120.near)) warnings.push(`${n}: nur über eine Engstelle unter 1,20 m erreichbar (Rollstuhl, Kinderwagen)`);
  }
  return { ok: errors.length === 0, errors, warnings: [...new Set(warnings)], kennzahlen: { freieLaufflaeche90cm_m2: +r90.area.toFixed(1), freieLaufflaeche120cm_m2: +r120.area.toFixed(1) } };
}

if (process.argv[1] && process.argv[1].endsWith('layout-check.mjs')) {
  const a = process.argv[2];
  if (!a) { console.error('Aufruf: node layout-check.mjs layout.json'); process.exit(2); }
  const res = check(JSON.parse(existsSync(a) ? readFileSync(a, 'utf8') : a));
  console.log(JSON.stringify(res, null, 2)); process.exit(res.ok ? 0 : 1);
}
