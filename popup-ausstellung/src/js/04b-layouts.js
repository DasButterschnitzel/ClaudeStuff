/* =====================================================================
   LAYOUTS: A ist die Ausgangslage, B–E stammen aus dem Gestalter-Workflow
   (je ein Entwurf plus unabhängige Prüfung, nachgemessen mit tools/layout-check.mjs).
   ===================================================================== */
const DEFS = Object.fromEntries([...ST, ...EXTRA].map(d => [d.id, d]));
/* Grundflächen lokal [x0, z0, x1, z1], vorn = +z – dieselben wie im Prüfwerkzeug */
const RECTS = { s2: [-1.55, -1.18, 1.55, 1.18], s3: [-1.15, -1.05, 1.27, 1.05], s4: [-1.35, -0.47, 1.35, 0.6], s5: [-0.6, -0.6, 0.6, 0.6], s7: [-1.4, -0.3, 1.4, 1.6], s8: [-1.3, -0.62, 1.3, 0.85], fahne: [-0.65, -0.06, 0.65, 0.06], wand2: [-1.1, -0.06, 1.1, 0.06], wand3: [-1.1, -0.06, 1.1, 0.06] };
const LAYOUT_A = { ...A_DATA, key: 'a' };   // Ausgangslage, aus src/a.json
/* Empfehlung der Museumsleitung: das Originalkonzept, mit Messwerkzeug optimiert und gegengeprüft */
const LAYOUT_EMPF = EMPF_DATA ? { ...EMPF_DATA, key: 'empf', empf: true } : null;
const LAYOUTS = [...(LAYOUT_EMPF ? [LAYOUT_EMPF] : []), LAYOUT_A, ...LAYOUT_DATA, ...RADIKAL_DATA, ...IDEEN_DATA];   // F–I radikale Konzepte, J–M neue Ideen: Experimente
for (const l of LAYOUTS) l.key += '-2';   // Stand 2: Theke am richtigen Ort. Der neue Schlüssel lässt alte, von Hand gespeicherte Stellungen verfallen.
const LBL = l => (l.empf ? '★' : String.fromCharCode(65 + LAYOUTS.filter(x => !x.empf).indexOf(l)));
