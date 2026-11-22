/* =====================================================================
   LAYOUTS: A ist die Ausgangslage, B–E stammen aus dem Gestalter-Workflow
   (je ein Entwurf plus unabhängige Prüfung, nachgemessen mit tools/layout-check.mjs).
   ===================================================================== */
const DEFS = Object.fromEntries([...ST, ...EXTRA].map(d => [d.id, d]));
/* Grundflächen lokal [x0, z0, x1, z1], vorn = +z – dieselben wie im Prüfwerkzeug */
const RECTS = { s2: [-1.55, -1.18, 1.55, 1.18], s3: [-1.15, -1.05, 1.27, 1.05], s4: [-1.35, -0.47, 1.35, 0.6], s5: [-0.6, -0.6, 0.6, 0.6], s7: [-1.4, -0.3, 1.4, 1.6], s8: [-1.3, -0.62, 1.3, 0.85], fahne: [-0.65, -0.06, 0.65, 0.06], wand2: [-1.1, -0.06, 1.1, 0.06], wand3: [-1.1, -0.06, 1.1, 0.06] };
const LAYOUT_A = {
  key: 'a', name: 'Erster Vorschlag',
  leitidee: 'Die Ausgangslage aus den bisherigen Runden: Jede Insel steht an der nächstliegenden Wand, die Mitte bleibt Durchgang.',
  rundgang: ['s6', 's5', 's7', 's8', 's4', 's3', 's1', 's2'],
  weg: 'Rechts an der orangen Wand entlang nach hinten, dann an Treppenhaus und Selfie-Koje vorbei zum Wohnzimmer und über das Mero-System an der Fensterfront zurück.',
  pos: {}, gruende: { theke: 'Die Theke schließt das Wohnzimmer nach vorn ab und dient als Infotheke.' },
  staerken: ['Jede Insel hat eine Wand im Rücken, der Aufbau ist einfach.', 'Statistik und Mero-System sind durch die Ovale von der Straße zu sehen.'],
  schwaechen: ['Kein eindeutiger Rundweg, die Reihenfolge ergibt sich zufällig.', 'Die Zukunftsinsel steht im Betrachtungsraum der Medienstelen.', 'Wohnzimmer und Hoftür sind nur über Durchgänge unter 1,20 m erreichbar.'],
  freieFlaeche: 86.1, warnungen: [], pruefung: '',
};
const LAYOUTS = [LAYOUT_A, ...LAYOUT_DATA, ...RADIKAL_DATA, ...IDEEN_DATA];   // J–M: ganz neue Ideen zum Jubiläum   // F–I: radikale Konzepte mit eigenem Stil
