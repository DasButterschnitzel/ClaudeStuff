/* =====================================================================
   APP: Zustand, Szene, Kamera, Verschieben, Begehen, Rundgang, Akte
   ===================================================================== */
const LS = 'popup3-plan-v1';
const DEF_CALC = { litfass: { d: 100, h: 190, gap: 0 }, kreise: 11 };
const state = { tab: 'ueber', view: 'iso', expo: true, dims: false, people: true, move: false, walk: false, tour: -1, sel: null, filter: 'alle', done: {}, layout: 'a', moves: {}, calc: JSON.parse(JSON.stringify(DEF_CALC)), open: new Set() };
const mergeCalc = c => { state.calc = { kreise: clamp(Number(c.kreise) || DEF_CALC.kreise, 6, 16), litfass: { ...DEF_CALC.litfass, ...(c.litfass || {}) } }; };
try { const s = JSON.parse(localStorage.getItem(LS) || 'null'); if (s) { state.done = s.done || {}; state.moves = s.moves || {}; if (LAYOUTS.some(l => l.key === s.layout)) state.layout = s.layout; if (s.calc) mergeCalc(s.calc); } } catch (e) { /* ohne Speicher weiter */ }
const saveLocal = () => { try { localStorage.setItem(LS, JSON.stringify({ done: state.done, moves: state.moves, layout: state.layout, calc: state.calc })); } catch (e) { /* egal */ } };

function litfassParams() {
  const { d, h, gap } = state.calc.litfass, U = PI * d;
  const n = Math.floor(U / (42 + gap)), rows = Math.floor(h / (59.4 + gap));
  return { d: d / 100, h: h / 100, gap: gap / 100, U, n, rows, total: n * rows, hoehe: (22 + h + 28) / 100 };
}

/* ---------- Szene ---------- */
const room = buildRoom(); scene.add(room.g);
const expo = new THREE.Group(); scene.add(expo);
const kissen = buildKissen(); expo.add(kissen);
const figuren = new THREE.Group(); scene.add(figuren);
FIGUREN.forEach(([x, z, r, col]) => { const f = buildFigur(col); f.position.set(x, 0, z); f.rotation.y = r; figuren.add(f); });

const items = {}, proxies = [];
const defOf = id => items[id].def;
const defPose = d => ({ x: d.pos[0], z: d.pos[1], r: d.rot });
const curLayout = () => LAYOUTS.find(l => l.key === state.layout) || LAYOUTS[0];
/* Stellung eines Teils in einem Layout: von Hand verschoben > Layout > Ausgangslage */
const poseIn = (l, id) => (state.moves[l.key] || {})[id] || l.pos[id] || (DEFS[id].optional ? null : defPose(DEFS[id]));
const fullPlan = () => ({ moves: state.moves, calc: state.calc });
function mount(def) {
  const group = new THREE.Group(); let inner = def.make(); group.add(inner);
  const [sx, sz, sy] = def.size, off = def.off || [0, 0];
  const proxy = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz)); proxy.visible = false; proxy.userData.id = def.id;
  const rect = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => new V3(a * (sx / 2 + 0.08) + off[0], 0.025, b * (sz / 2 + 0.08) + off[1]));
  const outline = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(rect), new THREE.LineBasicMaterial({ color: def.color })); outline.visible = false;
  if (def.fixed) { proxy.position.set(def.pos[0] - sx / 2, sy / 2, def.pos[1]); outline.position.set(def.pos[0] - sx / 2, 0, def.pos[1]); }
  else proxy.position.set(off[0], sy / 2, off[1]);
  group.add(proxy, outline); proxies.push(proxy);
  (def.bestand ? scene : expo).add(group);
  items[def.id] = { def, group, proxy, outline, remake() { group.remove(inner); inner = def.make(); group.add(inner); touch(); } };
  place(def.id);
}
function place(id) {
  const { def, group } = items[id]; if (def.fixed) return;
  const p = poseIn(curLayout(), id); group.visible = !!p; if (!p) return;
  group.position.set(p.x, 0, p.z); group.rotation.y = (p.r || 0) * PI / 180;
}
[...ST, ...EXTRA].forEach(mount);
placeFiguren();
/* Figuren ausblenden, die im gewählten Layout in einer Insel stünden */
function placeFiguren() {
  const l = curLayout();
  figuren.children.forEach(f => {
    f.visible = !Object.keys(RECTS).some(id => { const p = poseIn(l, id); if (!p) return false; const r = RECTS[id], c = Math.cos(p.r * PI / 180), sn = Math.sin(p.r * PI / 180), dx = f.position.x - p.x, dz = f.position.z - p.z, lx = dx * c - dz * sn, lz = dx * sn + dz * c; return lx > r[0] - 0.35 && lx < r[2] + 0.35 && lz > r[1] - 0.35 && lz < r[3] + 0.35; });
  });
}
const applyLayout = () => { Object.keys(items).forEach(place); placeFiguren(); touch(); updateInspect(); };

/* ---------- Marken über dem Modell ---------- */
const labelsEl = $('#labels'), labels = [], tmp = new V3();
ST.forEach(def => {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'chip3d'; b.dataset.id = def.id;
  b.innerHTML = `<b style="background:${def.color}">${def.n}</b><span>${esc(def.name)}</span>`;
  b.addEventListener('click', () => select(def.id, { fly: !state.move, tab: true }));
  labelsEl.append(b);
  labels.push({ el: b, expo: true, at: v => (def.anchor ? v.set(...def.anchor) : v.copy(items[def.id].group.position).setY(def.size[2] + 0.3)) });
});
const addTag = (text, at, isExpo, high) => { const s = document.createElement('span'); s.className = 'tag3d'; s.textContent = text; labelsEl.append(s); labels.push({ el: s, expo: isExpo, at, high }); };
EXTRA.forEach(def => { addTag(def.name, v => items[def.id].group.localToWorld(v.set((def.off || [0, 0])[0], def.size[2] + 0.18, (def.off || [0, 0])[1])), !def.bestand); labels[labels.length - 1].id = def.id; });
room.tags.forEach(t => addTag(t.t, v => v.set(...t.p), false, true));
function updateLabels() {
  const w = stageEl.clientWidth, h = stageEl.clientHeight;
  for (const l of labels) {
    l.at(tmp).project(camera);
    const vis = tmp.z < 1 && tmp.z > -1 && Math.abs(tmp.x) < 1.02 && Math.abs(tmp.y) < 1.02 && (!l.expo || state.expo) && (!l.high || camera.position.y > 4) && (!l.id || items[l.id].group.visible);
    l.el.hidden = !vis;
    if (vis) l.el.style.transform = `translate(${((tmp.x * 0.5 + 0.5) * w).toFixed(1)}px,${((-tmp.y * 0.5 + 0.5) * h).toFixed(1)}px)`;
  }
}

/* ---------- Kamera ---------- */
function fitPos(tgt, dir, ew, eh, fov = 40) {
  const vf = fov * PI / 360, hf = Math.atan(Math.tan(vf) * camera.aspect);
  return tgt.clone().addScaledVector(dir.normalize(), Math.max(ew / 2 / Math.tan(hf), eh / 2 / Math.tan(vf)));
}
const POSES = {
  iso: () => { const t = new V3(9.5, 0.4, 5.5); return [fitPos(t, new V3(-0.3, 0.8, 0.72), 24, 13.5), t]; },
  plan: () => { const t = new V3(9.6, 0, 5.4); return [fitPos(t, new V3(0, 1, 0.002), 25.5, 15, 16), t, 16]; },
  eingang: () => [new V3(17.75, 1.62, 8.95), new V3(11.0, 1.15, 5.2), 56],
  fenster: () => [new V3(-5.4, 1.75, 15.4), new V3(6.5, 1.1, 6.2)],
};
let tween = null;
function flyTo(pos, tgt, ms = 950, fov = 40) {
  if (!controls) return;
  if (REDUCED || ms === 0) { camera.position.copy(pos); controls.target.copy(tgt); camera.fov = fov; camera.updateProjectionMatrix(); controls.update(); invalidate(3); return; }
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: tgt, f0: camera.fov, f1: fov, s: performance.now(), ms };
  invalidate();
}
function setView(name, ms) {
  state.view = name; $$('#views button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === name)));
  const [p, t, fov] = POSES[name](); flyTo(p, t, ms, fov);
}
function stationPose(id) {
  const { def, group } = items[id]; group.updateMatrixWorld();
  return [group.localToWorld(new V3(...def.eye)), group.localToWorld(new V3(...def.look))];
}

/* ---------- Auswahl ---------- */
function select(id, { fly = false, tab = false } = {}) {
  state.sel = id;
  $$('.chip3d').forEach(c => c.classList.toggle('sel', c.dataset.id === id));
  Object.values(items).forEach(it => { it.outline.visible = state.move || it.def.id === id; });
  if (id && defOf(id).n) {
    state.open.add(id);
    if (tab) { setTab('inseln'); const card = $(`#card-${id}`); if (card) { card.open = true; if (stageEl.clientWidth > 0 && matchMedia('(min-width: 901px)').matches) card.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' }); } }
    $$('.st').forEach(c => c.classList.toggle('sel', c.id === `card-${id}`));
    if (fly && !state.walk) { const [p, t] = stationPose(id); state.view = ''; $$('#views button').forEach(b => b.setAttribute('aria-pressed', 'false')); flyTo(p, t, 950, 52); }
  }
  updateInspect(); invalidate();
}

/* ---------- Verschieben ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), ground = new THREE.Plane(new V3(0, 1, 0), 0);
function setRay(e) { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); }
const floorPoint = e => { setRay(e); return ray.ray.intersectPlane(ground, new V3()); };
function pick(e) {
  setRay(e); scene.updateMatrixWorld();
  const hit = ray.intersectObjects(proxies.filter(p => items[p.userData.id].group.visible && (state.expo || items[p.userData.id].def.bestand)), false)[0];
  return hit ? hit.object.userData.id : null;
}
function setMove(on) {
  state.move = on; $('#b-move').setAttribute('aria-pressed', String(on));
  if (on) { setWalk(false); stopTour(); setView('plan'); }
  if (controls) { controls.enableRotate = !on; controls.mouseButtons.LEFT = on ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE; controls.touches.ONE = on ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE; }
  Object.values(items).forEach(it => { it.outline.visible = on || it.def.id === state.sel; });
  hint(on ? 'Insel anfassen und ziehen. Unter „Themeninseln“ steht, warum sie im Vorschlag dort steht. Insel 6 hängt an der Wand und bleibt fest.' : null);
  updateInspect(); invalidate();
}
const curPose = id => { const g = items[id].group; return { x: +g.position.x.toFixed(2), z: +g.position.z.toFixed(2), r: Math.round(g.rotation.y * 180 / PI) }; };
function moveSet(id, p) { (state.moves[state.layout] = state.moves[state.layout] || {})[id] = p; write('plan', { moves: { [state.layout]: { [id]: p } } }, fullPlan); }
function commitPose(id) { moveSet(id, curPose(id)); updateInspect(); renderLayouts(); }
function rotateSel(deg) { const id = state.sel; if (!id || defOf(id).fixed) return; const g = items[id].group; g.rotation.y = ((Math.round(g.rotation.y * 180 / PI) + deg + 360) % 360) * PI / 180; commitPose(id); touch(); }
function resetPose(id) { delete (state.moves[state.layout] || {})[id]; const p = poseIn(curLayout(), id); if (p) moveSet(id, p); place(id); updateInspect(); touch(); renderLayouts(); }
function resetAll() {
  const l = curLayout(), m = {}; state.moves[l.key] = {};
  for (const id of Object.keys(items)) { if (defOf(id).fixed) continue; const p = poseIn(l, id); if (p) m[id] = p; }
  state.moves[l.key] = m; applyLayout(); write('plan', { moves: { [l.key]: m } }, fullPlan); renderLayouts();
}
function setLayout(key) {
  if (!LAYOUTS.some(l => l.key === key)) return;
  state.layout = key; saveLocal(); stopTour(); select(null); applyLayout(); renderLayouts(); renderInseln();
  $('#layout-sel').value = key; if (!state.walk && !state.move) setView(state.view || 'iso');
}
function updateInspect() {
  const el = $('#inspect'), id = state.sel;
  if (!state.move) { el.hidden = true; return; }
  el.hidden = false;
  if (!id) { el.innerHTML = `<h3>Verschieben</h3><p class="mono">Noch keine Insel gewählt.</p><div class="row"><button type="button" class="mini" data-act="all">Alles auf Vorschlag zurück</button></div>`; return; }
  const d = defOf(id), p = curPose(id);
  el.innerHTML = `<h3>${d.n ? d.n + ' · ' : ''}${esc(d.name)}</h3>` + (d.fixed ? `<p class="mono">Fest an der Brandmauer.</p>` :
    `<p class="mono">x ${de(p.x)} m · Tiefe ${de(p.z)} m · ${p.r}°</p><div class="row"><button type="button" class="mini" data-act="l">↺ 15°</button><button type="button" class="mini" data-act="r">↻ 15°</button><button type="button" class="mini" data-act="one">Zurück</button></div>`) +
    `<div class="row"><button type="button" class="mini" data-act="all">Alles auf Vorschlag zurück</button></div>`;
}
$('#inspect').addEventListener('click', e => {
  const a = e.target.closest('[data-act]')?.dataset.act; if (!a) return;
  if (a === 'l') rotateSel(15); else if (a === 'r') rotateSel(-15); else if (a === 'one') resetPose(state.sel); else if (a === 'all') resetAll();
});

/* ---------- Begehen ---------- */
const walk = { x: 17.7, z: 8.6, yaw: 1.04, pitch: -0.04, to: null, keys: new Set() };
function setWalk(on) {
  if (state.walk === on) return;
  state.walk = on; $('#b-walk').setAttribute('aria-pressed', String(on));
  if (on) { setMove(false); stopTour(); tween = null; camera.fov = 62; camera.updateProjectionMatrix(); if (controls) controls.enabled = false; Object.assign(walk, { x: 17.7, z: 8.6, yaw: 1.04, pitch: -0.04, to: null }); hint('Ziehen: umsehen · Klick auf den Boden: hingehen · Pfeiltasten oder WASD: laufen'); canvas.focus({ preventScroll: true }); applyWalk(); }
  else { if (controls) controls.enabled = true; hint(null); walk.keys.clear(); setView('iso'); }
}
function applyWalk() { camera.rotation.order = 'YXZ'; camera.position.set(walk.x, 1.62, walk.z); camera.rotation.set(walk.pitch, walk.yaw, 0); invalidate(); }
function stepWalk(dt) {
  let mv = false; const k = walk.keys, f = (k.has('w') || k.has('arrowup') ? 1 : 0) - (k.has('s') || k.has('arrowdown') ? 1 : 0), s = (k.has('d') ? 1 : 0) - (k.has('a') ? 1 : 0), t = (k.has('arrowleft') ? 1 : 0) - (k.has('arrowright') ? 1 : 0);
  if (t) { walk.yaw += t * dt * 1.6; mv = true; }
  if (f || s) { walk.to = null; const sp = 2.4 * dt; walk.x += (-Math.sin(walk.yaw) * f + Math.cos(walk.yaw) * s) * sp; walk.z += (-Math.cos(walk.yaw) * f - Math.sin(walk.yaw) * s) * sp; mv = true; }
  if (walk.to) { const dx = walk.to.x - walk.x, dz = walk.to.z - walk.z, d = Math.hypot(dx, dz), sp = 3 * dt; if (d <= sp) { walk.x = walk.to.x; walk.z = walk.to.z; walk.to = null; } else { walk.x += dx / d * sp; walk.z += dz / d * sp; } mv = true; }
  if (mv) { walk.x = clamp(walk.x, 0.45, R.W - 0.4); walk.z = clamp(walk.z, 0.4, R.zG - 0.95); applyWalk(); }
}

/* ---------- Rundgang ---------- */
let tourTimer = 0;
function tourGo(i) {
  const list = curLayout().rundgang.map(id => DEFS[id]).filter(Boolean);
  state.tour = (i + list.length) % list.length; const d = list[state.tour];
  $('#tourbar').hidden = false; $('#tour-n').textContent = `${state.tour + 1}/${list.length}`; $('#tour-name').textContent = `${d.n} · ${d.name}`;
  select(d.id, { fly: true, tab: true });
  clearTimeout(tourTimer); if (!REDUCED) tourTimer = setTimeout(() => tourGo(state.tour + 1), 7000);
}
function stopTour() { if (state.tour < 0) return; state.tour = -1; clearTimeout(tourTimer); $('#tourbar').hidden = true; $('#b-tour').setAttribute('aria-pressed', 'false'); }
function startTour() { setWalk(false); setMove(false); if (!state.expo) toggleExpo(true); $('#b-tour').setAttribute('aria-pressed', 'true'); tourGo(0); }
function hint(t) { const el = $('#hint'); el.hidden = !t; el.textContent = t || ''; }
function toggleExpo(on) {
  state.expo = on; expo.visible = on; $('#t-expo').setAttribute('aria-pressed', String(on));
  items.theke.remake(); if (!on) { stopTour(); select(null); } touch();
}

/* ---------- Zeiger & Tasten ---------- */
let pd = null, drag = null;
canvas.addEventListener('pointerdown', e => {
  pd = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY };
  if (state.tour >= 0) clearTimeout(tourTimer);
  if (state.walk) { canvas.setPointerCapture(e.pointerId); return; }
  if (state.move) {
    const id = pick(e), p = id && floorPoint(e);
    if (id) select(id);
    if (id && p && !defOf(id).fixed) { const g = items[id].group; drag = { id, ox: g.position.x - p.x, oz: g.position.z - p.z }; controls.enabled = false; canvas.setPointerCapture(e.pointerId); }
  }
});
canvas.addEventListener('pointermove', e => {
  if (!pd) return;
  if (state.walk) { walk.yaw += (e.clientX - pd.lx) * 0.0042; walk.pitch = clamp(walk.pitch + (e.clientY - pd.ly) * 0.0042, -0.7, 0.6); pd.lx = e.clientX; pd.ly = e.clientY; applyWalk(); return; }
  if (drag) {
    const p = floorPoint(e); if (!p) return;
    const g = items[drag.id].group;
    g.position.x = clamp(Math.round((p.x + drag.ox) * 20) / 20, R.xG + 0.3, R.W - 0.2); g.position.z = clamp(Math.round((p.z + drag.oz) * 20) / 20, 0.15, R.zG - 0.3);
    updateInspect(); touch();
  }
});
const pointerEnd = e => {
  if (!pd) return;
  const still = Math.hypot(e.clientX - pd.x, e.clientY - pd.y) < 6; pd = null;
  if (drag) { commitPose(drag.id); drag = null; controls.enabled = true; return; }
  if (!still || e.type === 'pointercancel') return;
  if (state.walk) { const p = floorPoint(e); if (p && p.distanceTo(camera.position) < 40) walk.to = { x: clamp(p.x, 0.45, R.W - 0.4), z: clamp(p.z, 0.4, R.zG - 0.95) }; invalidate(); return; }
  if (!state.move) { const id = pick(e); if (id && defOf(id).n) select(id, { tab: true }); }
};
canvas.addEventListener('pointerup', pointerEnd); canvas.addEventListener('pointercancel', pointerEnd);
canvas.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (state.walk && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { walk.keys.add(k); e.preventDefault(); invalidate(); }
  if (state.move && k === 'r') rotateSel(e.shiftKey ? 15 : -15);
  if (k === 'escape') { setWalk(false); setMove(false); stopTour(); }
});
canvas.addEventListener('keyup', e => walk.keys.delete(e.key.toLowerCase()));
canvas.addEventListener('blur', () => walk.keys.clear());

$('#views').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; setWalk(false); stopTour(); if (state.move && b.dataset.view !== 'plan') setMove(false); setView(b.dataset.view); });
$('#t-expo').addEventListener('click', () => toggleExpo(!state.expo));
$('#t-dims').addEventListener('click', e => { state.dims = !state.dims; room.dims.visible = state.dims; e.currentTarget.setAttribute('aria-pressed', String(state.dims)); if (state.dims && !state.walk) setView('plan'); invalidate(); });
$('#t-people').addEventListener('click', e => { state.people = !state.people; figuren.visible = state.people; e.currentTarget.setAttribute('aria-pressed', String(state.people)); touch(); });
$('#b-tour').addEventListener('click', () => (state.tour >= 0 ? stopTour() : startTour()));
$('#b-walk').addEventListener('click', () => setWalk(!state.walk));
$('#b-move').addEventListener('click', () => setMove(!state.move));
$('#tour-prev').addEventListener('click', () => tourGo(state.tour - 1));
$('#tour-next').addEventListener('click', () => tourGo(state.tour + 1));
$('#tour-stop').addEventListener('click', stopTour);

/* ---------- Gemeinsamer Speicher ---------- */
const store = { docs: {}, exists: {}, q: {}, ro: false };
function setSync(s) {
  const el = $('#sync'); el.dataset.s = s;
  el.querySelector('span').textContent = { wait: 'Verbinde …', shared: 'Für alle gespeichert', local: 'Nur in diesem Browser gespeichert', readonly: 'Nur Lesen – Änderungen bleiben in diesem Browser' }[s];
}
async function initStore() {
  let db = null;
  try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
  if (!db) return setSync('local');
  let got = false; const timer = setTimeout(() => { if (!got) setSync('local'); }, 10000);
  const sub = (name, apply) => {
    const ref = db.doc('state/' + name); store.docs[name] = ref; store.q[name] = Promise.resolve();
    ref.onSnapshot(s => {
      got = true; clearTimeout(timer); store.exists[name] = s.exists; setSync(store.ro ? 'readonly' : 'shared');
      if (s.exists && !s.metadata.hasPendingWrites) apply(JSON.parse(JSON.stringify(s.data() || {})));
    }, () => { delete store.docs[name]; setSync('local'); });
  };
  sub('todos', d => { state.done = d.done || {}; saveLocal(); renderTodoViews(); });
  sub('plan', d => { if (drag) return; state.moves = d.moves || {}; if (d.calc) mergeCalc(d.calc); saveLocal(); applyLayout(); syncCalc(true); renderLayouts(); });
}
function write(name, patch, full) {
  saveLocal(); const ref = store.docs[name]; if (!ref || store.ro) return;
  store.q[name] = store.q[name].then(async () => {
    try { if (store.exists[name]) await ref.update(patch); else { await ref.set(full()); store.exists[name] = true; } }
    catch (e) { if (e && e.code === 'invalid_argument') { store.ro = true; setSync('readonly'); } }
  });
}

/* ---------- Akte: Reiter ---------- */
function setTab(t) {
  state.tab = t;
  $$('#tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
  for (const k of ['ueber', 'layouts', 'inseln', 'todos', 'rechner']) $(`#tab-${k}`).hidden = k !== t;
}
$('#tabs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setTab(b.dataset.tab); if (matchMedia('(min-width: 901px)').matches) $('#tabbody').scrollTop = 0; } });

const isDone = t => !!state.done[t.id];
const stats = () => ({ all: TODOS.length, open: TODOS.filter(t => !isDone(t)).length, check: TODOS.filter(t => !isDone(t) && t.kind === 'check').length, nobody: TODOS.filter(t => !isDone(t) && !t.who.length).length });
function todoRow(t, pre) {
  const pills = [
    ...t.who.map(w => `<span class="pill">${esc(WHO[w])}</span>`),
    t.who.length ? '' : '<span class="pill open">Zuständigkeit offen</span>',
    t.kind === 'check' ? '<span class="pill warn">erst klären</span>' : '',
    t.due ? `<span class="pill warn">${esc(t.due)}</span>` : '',
    t.wirkt ? `<span class="pill">hängt daran: ${esc(t.wirkt)}</span>` : '',
    `<span class="pill" title="Quelle: Protokoll">${esc(t.src)}</span>`,
  ].join('');
  return `<div class="todo${isDone(t) ? ' done' : ''}"><input type="checkbox" id="${pre}-${t.id}" data-todo="${t.id}"${isDone(t) ? ' checked' : ''}><div><label for="${pre}-${t.id}">${esc(t.text)}</label><div class="meta">${pills}</div></div></div>`;
}
function renderUeber() {
  const s = stats(), lp = litfassParams();
  $('#tab-ueber').innerHTML = `
  <div class="blk"><span class="eyebrow">Zusammenfassung · Protokoll 1 + 2</span>
    <p class="lead">Im Pop-up-Store entsteht die Ausstellung „50 Jahre Dreieich“ mit <b>acht Themeninseln</b>. Leitlinie: informativ, fröhlich, bunt, niederschwellig, mit Mitmachstationen. Ein Titel steht noch nicht fest.</p></div>
  <div class="tiles">
    <div class="tile o"><b>${s.open}</b><span>von ${s.all} Aufgaben offen</span></div>
    <div class="tile w"><b>${s.check}</b><span>davon erst zu klären</span></div>
    <div class="tile o"><b>${s.nobody}</b><span>ohne Zuständigkeit</span></div>
  </div>
  <div class="blk"><h2>Stand nach Besprechung 1 (10.11.)</h2><ul class="plain">
    <li>Die acht Inseln stehen fest: Wohnzimmer, Mero-System, Selfie-Station, Statistik, Litfaß-Säule, Gebietsreform, Slide-Show, Zukunft/Lieblingsplatz.</li>
    <li>Die meisten Inhalte liegen bei Corinna Molitor (Einrichtung, Mero-System, Litfaß-Säule, Texte Gebietsreform, Anfrage Heinsius).</li>
    <li>Kim Lehnert klärt Rechte (Fernsehbilder, Prilblume), Statistiken und Medienstelen. Claudia Scheibel und Kim Lehnert klären, was im Raum erlaubt ist: Deckenhaken, Streichen, Tapezieren.</li>
    <li>Ein Beamer scheidet aus, der Raum ist zu hell. Alle Grafiken richten sich nach der Farbwelt des Mero-Systems.</li>
    <li>Dazu kommen Begleitprogramm und ein Pubquiz, erste Veranstaltung beim GHV.</li></ul></div>
  <div class="blk"><h2>Neu in Besprechung 2 (17.11.)</h2><ul class="plain">
    <li><b>Fernseher:</b> Sascha Becker haust einen Monitor mit bedruckten Forexplatten ein, damit er wie ein Gerät der 1970er aussieht.</li>
    <li><b>Selfie-Koje:</b> soll von einer Dreieicher Firma gestrichen oder mit 70er-Tapete tapeziert werden, als Sponsoring.</li>
    <li><b>Gebietsreform:</b> Die lange Wand am Eingang wird orange, darauf runde Forexplatten (Ø 50/60 cm) mit kurzen, in sich abgeschlossenen Texten. Texte Corinna Molitor, Grafik Sascha Becker, Produktion Vorschlag MSK.</li>
    <li><b>Hessentag</b> als Ausweichthema, falls Insel 7 oder 8 nicht zustande kommt.</li>
    <li><b>Raum:</b> Theke orange folieren, orangene und lila Sitzkissen an der Fensterfront, Willkommens-Fahne im Eingang.</li></ul>
    <p class="note">Für die fünf neuen Punkte aus Besprechung 2 – Malerfirma anfragen (zweimal), Theke, Sitzkissen, Fahne – ist noch niemand eingetragen. Das wäre ein Punkt für den 24.11.</p></div>
  <div class="blk"><h2>Termine</h2><div class="dates">
    <div><time>10.11.2026</time><span>Besprechung 1 – Scheibel, Lehnert, Perkovic, Molitor</span></div>
    <div><time>17.11.2026</time><span>Besprechung 2 – Becker, Molitor</span></div>
    <div><time>24.11., 10 Uhr</time><span><b>Nächstes Treffen</b></span></div>
    <div><span class="when">bis Ende 2026</span><span>Texte für die Litfaß-Säule an Sascha Becker</span></div>
    <div><span class="when">bis März</span><span>Einrichtung fürs Wohnzimmer muss untergestellt werden</span></div></div></div>
  <div class="blk"><h2>Der Raum</h2>
    <table class="kv"><tbody>
      <tr><td>Adresse</td><td>Offenbacher Straße 1</td></tr>
      <tr><td>Ladenfläche</td><td>173,3 m²</td></tr>
      <tr><td>Lager · Nebenräume · WC</td><td>6,3 · 42,5 · 6,5 m²</td></tr>
      <tr><td>Gesamt Erdgeschoss</td><td>228,6 m²</td></tr>
      <tr><td>Raumhöhe</td><td>ca. 2,50 m</td></tr>
      <tr><td>Fensterfront</td><td>24,65 m · rund 2,08 m hoch</td></tr>
      <tr><td>Schaufenster</td><td>dauerhaft foliert · klar nur die Ovale</td></tr>
      <tr><td>Fensterbreiten</td><td>3,25 · 3,61 · 4,33 · 3,91 · 3,57 · 3,63 · 2,35 m</td></tr>
      <tr><td>Brandmauer am Eingang</td><td>≈ 9,3 m frei</td></tr>
    </tbody></table>
    <p class="note">Quelle: <a href="https://www.dreieich.de/zukunft-leben/wirtschaft/citymanagement/pop-up-dreieich/" target="_blank" rel="noopener">Exposé der Stadt Dreieich</a> mit Bestandsplan M 1:100 (Planstand 15.04.2025). Das Modell ist aus dem gescannten Plan abgegriffen, Genauigkeit etwa ±15 cm. Vor dem Bestellen nachmessen.</p></div>
  <div class="blk"><h2>Was im Modell Annahme ist</h2><ul class="plain">
    <li>Fest vorgegeben sind: das Wohnzimmer in der Ecke an der Natursteinwand, Insel 6 an der langen Wand am Eingang, eine Stellwand zwischen 1 und 3, Insel 7/8 in der Nähe von 6, Fahne im Eingang, Kissen an der Fensterfront. Die Stellung aller übrigen Inseln ist ein Vorschlag.</li>
    <li>Die Lage der Theke ist nach einem Foto aus dem Exposé geschätzt, im Modell steht sie vor dem Wohnzimmer. Die Stellwand schirmt das Wohnzimmer zum Gang mit Hoftür und Lager ab.</li>
    <li>Größen von Mero-System, Medienstelen und Litfaß-Säule (im Modell Ø ${de(lp.d, 2)} m) sind angenommen.</li>
    <li>Die Schaufensterfolierung stammt aus deiner Vorlage. Wie sie auf die einzelnen Scheiben verteilt ist, habe ich angenommen: je ein Motiv auf den vier Scheiben der langen und den zwei Scheiben der kurzen Front.</li>
    <li>Orange und Lila stammen aus dem Protokoll. Die Farbwelt des Mero-Systems fehlt noch.</li>
    <li>Im Modell gibt es keine Prilblume, solange die Freigabe von Henkel offen ist.</li></ul>
    <div class="row"><button type="button" class="btn" data-jump="layouts">Fünf Layouts vergleichen</button><button type="button" class="btn ghost" data-go="move">Inseln selbst verschieben</button></div></div>`;
}
function renderInseln() {
  $('#tab-inseln').innerHTML = `<p class="note">Eine Insel antippen, um sie im Raum zu zeigen. Stellung und Maße sind ein Vorschlag und lassen sich über „Inseln verschieben“ ändern.</p>` + ST.map(d => {
    const mine = TODOS.filter(t => t.st === d.id), open = mine.filter(t => !isDone(t)), nob = open.filter(t => !t.who.length).length;
    return `<details class="st${state.sel === d.id ? ' sel' : ''}" id="card-${d.id}"${state.open.has(d.id) ? ' open' : ''}>
      <summary><span class="num" style="background:${d.color}">${d.n}</span><span><span class="nm">${esc(d.name)}</span><br><span class="sub">${open.length ? `${open.length} von ${mine.length} offen` : 'alles erledigt'}</span></span>
        <span>${nob ? `<span class="pill open">${nob} ohne Zuständigkeit</span>` : open.length ? '' : '<span class="pill ok">fertig</span>'}</span></summary>
      <div class="body"><p>${esc(d.kurz)}</p>
        <div class="blk"><span class="eyebrow">Platz im Raum · Layout ${esc(curLayout().name)}</span><p>${esc((curLayout().gruende || {})[d.id] || d.ort)}</p><button type="button" class="btn ghost" data-show="${d.id}">Im Raum zeigen</button></div>
        <ul class="plain">${d.punkte.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
        <div class="grp">${mine.map(t => todoRow(t, 'i')).join('')}</div></div></details>`;
  }).join('');
}
function renderTodos() {
  const f = state.filter, people = Object.keys(WHO).filter(k => k !== 'ALLE');
  const match = t => f === 'alle' || (f === 'offen' ? !t.who.length : f === 'check' ? t.kind === 'check' : t.who.includes(f) || t.who.includes('ALLE'));
  const chip = (k, label) => `<button type="button" data-filter="${k}" aria-pressed="${f === k}">${esc(label)}</button>`;
  const list = TODOS.filter(match), open = list.filter(t => !isDone(t)).length;
  $('#tab-todos').innerHTML = `<div class="filters" role="group" aria-label="Filter">${chip('alle', 'Alle')}${people.map(p => chip(p, WHO[p])).join('')}${chip('offen', 'Ohne Zuständigkeit')}${chip('check', 'Erst klären')}</div>
    <p class="note">${open} von ${list.length} offen. Ein Haken gilt für alle, die diese Seite öffnen.</p>` +
    (list.length ? GRUPPEN.map(g => { const rows = list.filter(t => t.st === g.id); return rows.length ? `<div class="grp"><h3><i style="background:${g.color}"></i>${esc(g.name)}</h3>${rows.map(t => todoRow(t, 't')).join('')}</div>` : ''; }).join('') : '<p class="empty">Keine Aufgaben in dieser Auswahl.</p>');
}
function renderCounts() { const s = stats(); $('#cnt-open').textContent = s.open; }
/* ---------- Layouts ---------- */
function miniPlan(l) {
  const P = id => poseIn(l, id), col = id => DEFS[id].color, f2 = v => +v.toFixed(2);
  const item = id => { const p = P(id); if (!p) return ''; const r = RECTS[id], thin = id === 'fahne' || id.startsWith('wand');
    const shape = id === 's5' ? `<circle r="0.6" fill="${col(id)}"/>` : `<rect x="${r[0]}" y="${r[1]}" width="${r[2] - r[0]}" height="${r[3] - r[1]}" rx="0.1" fill="${thin ? 'var(--ink-2)' : col(id)}"/>` + (thin ? '' : `<rect x="${r[0] + 0.2}" y="${r[3] - 0.16}" width="${r[2] - r[0] - 0.4}" height="0.16" fill="#fff" opacity=".65"/>`);
    return `<g transform="translate(${f2(p.x)} ${f2(p.z)}) rotate(${f2(-p.r)})">${shape}</g>` + (DEFS[id].n ? `<text x="${f2(p.x)}" y="${f2(p.z + 0.32)}" class="mn">${DEFS[id].n}</text>` : ''); };
  const ov = [1.9, 5.9, 9.8, 13.4].map(x => `<line x1="${x - 1.4}" y1="10.75" x2="${x + 1.4}" y2="10.75" class="ov"/>`).join('') + [5.3, 8.8].map(z => `<line x1="-0.55" y1="${z - 1.4}" x2="-0.55" y2="${z + 1.4}" class="ov"/>`).join('');
  return `<svg viewBox="-1 -0.7 21.2 12.6" role="img" aria-label="Grundriss Layout ${esc(l.name)}">
    <path d="M-0.5 0H19.45V9.35H16.55V10.7H-0.5Z" class="rm"/><path d="M5.55 0H11.4V5.2H8.15V3.1H5.55Z" class="blk"/>
    <rect x="0.05" y="0.02" width="4.4" height="2.9" rx="0.1" fill="${col('s1')}"/><text x="2.25" y="1.8" class="mn">1</text>
    <rect x="1" y="3.12" width="3.2" height="0.66" class="th"/><rect x="19.05" y="0.1" width="0.4" height="9.1" fill="${col('s6')}"/><text x="18.55" y="4.95" class="mn dk">6</text>
    <line x1="4.52" y1="0.1" x2="4.52" y2="2.3" class="sw"/>${ov}${['s2', 's3', 's4', 's5', 's7', 's8', 'wand2', 'wand3', 'fahne'].map(item).join('')}
    <path d="M17.72 10.1l0.55 1h-1.1z" class="in"/></svg>`;
}
function renderLayouts() {
  const el = $('#tab-layouts'); if (!el) return;
  el.innerHTML = `<p class="note">Fünf Layouts zum Vergleichen. A ist die Ausgangslage, B bis E haben vier Gestalter-Agenten entworfen; je eine zweite Instanz hat Wege, Engstellen und Vorgaben nachgemessen und korrigiert. Fest sind überall das Wohnzimmer in der Ecke, die Theke und die orange Wand. Welches Layout du ansiehst, gilt nur für dich; verschobene Inseln gelten für alle.</p>` + LAYOUTS.map((l, i) => {
    const act = l.key === state.layout, moved = Object.keys(state.moves[l.key] || {}).some(id => { const m = state.moves[l.key][id], d = l.pos[id] || (DEFS[id].optional ? null : defPose(DEFS[id])); return !d || Math.abs(m.x - d.x) > 0.01 || Math.abs(m.z - d.z) > 0.01 || Math.abs(m.r - d.r) > 0.5; });
    return `<article class="lay${act ? ' act' : ''}" id="lay-${l.key}">
      <header><span class="lk">${String.fromCharCode(65 + i)}</span><div><h3>${esc(l.name)}</h3><p>${esc(l.leitidee)}</p></div></header>
      <div class="mini">${miniPlan(l)}</div>
      <div class="route"><span class="eyebrow">Rundgang</span>${l.rundgang.map(id => `<b style="background:${DEFS[id].color}" title="${esc(DEFS[id].name)}">${DEFS[id].n}</b>`).join('<i>›</i>')}</div>
      <p class="sm"><b>Theke:</b> ${esc((l.gruende || {}).theke || '–')}</p>
      <details class="more"><summary>Weg, Stärken, Schwächen, Prüfung</summary>
        <p>${esc(l.weg)}</p>
        <ul class="pm">${l.staerken.map(t => `<li class="plus">${esc(t)}</li>`).join('')}${l.schwaechen.map(t => `<li class="minus">${esc(t)}</li>`).join('')}</ul>
        <p class="sm"><b>Frei begehbar:</b> ${de(l.freieFlaeche, 0)} m² bei 90 cm Durchgang (nachgemessen mit dem Prüfwerkzeug, 0 Fehler).</p>
        ${l.pruefung ? `<p class="sm"><b>Was die Prüfung geändert hat:</b> ${esc(l.pruefung)}</p>` : ''}
        ${l.warnungen && l.warnungen.length ? `<p class="sm"><b>Bewusst in Kauf genommen:</b></p><ul class="plain sm">${l.warnungen.map(w => `<li>${esc(w)}</li>`).join('')}</ul>` : ''}
      </details>
      <div class="row">${act ? '<span class="pill ok">wird gezeigt</span>' : `<button type="button" class="btn" data-layout="${l.key}">Dieses Layout zeigen</button>`}${moved ? '<span class="pill warn">von Hand verändert</span>' : ''}</div>
    </article>`; }).join('');
}
function renderTodoViews() { renderUeber(); renderInseln(); renderTodos(); renderCounts(); }
$('#tabbody').addEventListener('change', e => {
  const id = e.target.dataset.todo; if (!id) return;
  const v = e.target.checked; if (v) state.done[id] = true; else delete state.done[id];
  write('todos', { done: { [id]: v } }, () => ({ done: state.done }));
  const keep = e.target.id; renderTodoViews(); $('#' + keep)?.focus({ preventScroll: true });
});
$('#tabbody').addEventListener('click', e => {
  const f = e.target.closest('[data-filter]'); if (f) { state.filter = f.dataset.filter; renderTodos(); return; }
  const s = e.target.closest('[data-show]'); if (s) { if (!state.expo) toggleExpo(true); select(s.dataset.show, { fly: true }); if (!matchMedia('(min-width: 901px)').matches) stageEl.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); return; }
  const jp = e.target.closest('[data-jump]'); if (jp) { setTab(jp.dataset.jump); $('#tabbody').scrollTop = 0; return; }
  const lb = e.target.closest('[data-layout]'); if (lb) { setLayout(lb.dataset.layout); if (!matchMedia('(min-width: 901px)').matches) stageEl.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); return; }
  const g = e.target.closest('[data-go]'); if (g) { setMove(true); if (!matchMedia('(min-width: 901px)').matches) stageEl.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); }
});
$('#tabbody').addEventListener('toggle', e => { const d = e.target; if (d.classList?.contains('st')) { const id = d.id.slice(5); if (d.open) state.open.add(id); else state.open.delete(id); } }, true);

/* ---------- Rechner & Material ---------- */
function renderRechner() {
  $('#tab-rechner').innerHTML = `
  <div class="blk"><h2>Litfaß-Säule: Wie viele DIN-A2-Plakate passen?</h2>
    <p>Die Frage aus Protokoll 1. DIN A2 hochkant ist 42 × 59,4 cm. Sobald Corinna Molitor Durchmesser und Höhe kennt, hier einstellen – die Säule im Modell ändert sich mit.</p>
    <div class="calc">
      <div class="ctl"><label for="lf-d">Durchmesser der Säule</label><input type="range" id="lf-d" min="60" max="140" step="5"><output id="lf-d-o"></output></div>
      <div class="ctl"><label for="lf-h">Nutzbare Höhe für Plakate</label><input type="range" id="lf-h" min="120" max="200" step="5"><output id="lf-h-o"></output></div>
      <div class="ctl"><label for="lf-g">Abstand zwischen den Plakaten</label><input type="range" id="lf-g" min="0" max="6" step="1"><output id="lf-g-o"></output></div>
      <div class="result"><div><b id="lf-n"></b><span>Plakate pro Ring</span></div><div><b id="lf-r"></b><span>Ringe übereinander</span></div><div><b id="lf-t"></b><span>Plakate gesamt</span></div></div>
      <p class="note" id="lf-note"></p>
    </div></div>
  <div class="blk"><h2>Gebietsreform: runde Forexplatten</h2>
    <p>Die Wand ist rund 9,3 m lang und 2,50 m hoch. Jede dritte Platte hat im Modell Ø 60 cm, die übrigen Ø 50 cm.</p>
    <div class="calc">
      <div class="ctl"><label for="kr-n">Anzahl der Platten</label><input type="range" id="kr-n" min="6" max="16" step="1"><output id="kr-n-o"></output></div>
      <p class="note" id="kr-note"></p>
    </div></div>
  <div class="blk"><h2>Material und Sponsoring</h2>
    <p>Alles, was in den beiden Protokollen an Anschaffungen und Leihgaben genannt ist. Mengen mit „im Modell“ sind aus dem Vorschlag abgelesen.</p>
    <div class="tw"><table class="mat"><thead><tr><th>Was</th><th>Menge / Maß</th><th>Woher · Stand</th></tr></thead><tbody id="mat-body"></tbody></table></div></div>`;
  for (const [id, key] of [['lf-d', 'd'], ['lf-h', 'h'], ['lf-g', 'gap']]) $('#' + id).addEventListener('input', e => { state.calc.litfass[key] = Number(e.target.value); calcChanged('s5'); });
  $('#kr-n').addEventListener('input', e => { state.calc.kreise = Number(e.target.value); calcChanged('s6'); });
  syncCalc(true);
}
let calcT = 0, saveT = 0;
function calcChanged(id) {
  syncCalc(false);
  clearTimeout(calcT); calcT = setTimeout(() => items[id].remake(), 90);
  clearTimeout(saveT); saveT = setTimeout(() => write('plan', { calc: state.calc }, fullPlan), 500);
}
function syncCalc(remake) {
  if (!$('#lf-d')) return;
  const c = state.calc, p = litfassParams();
  $('#lf-d').value = c.litfass.d; $('#lf-h').value = c.litfass.h; $('#lf-g').value = c.litfass.gap; $('#kr-n').value = c.kreise;
  $('#lf-d-o').textContent = `${c.litfass.d} cm`; $('#lf-h-o').textContent = `${c.litfass.h} cm`; $('#lf-g-o').textContent = `${c.litfass.gap} cm`; $('#kr-n-o').textContent = `${c.kreise} Stück`;
  $('#lf-n').textContent = p.n; $('#lf-r').textContent = p.rows; $('#lf-t').textContent = p.total;
  $('#lf-note').textContent = `Umfang ${de(p.U / 100)} m. Mit Sockel und Haube wird die Säule im Modell rund ${de(p.hoehe)} m hoch` + (p.hoehe > 2.45 ? ' – das passt nicht unter die Decke von ca. 2,50 m.' : ', die Decke liegt bei ca. 2,50 m.');
  const ks = kreisLayout(c.kreise), n60 = ks.filter(k => k.rad === 0.3).length, area = ks.reduce((a, k) => a + PI * k.rad * k.rad, 0);
  $('#kr-note').textContent = `${ks.length} Platten: ${n60} × Ø 60 cm, ${ks.length - n60} × Ø 50 cm. Zusammen ${de(area, 1)} m² Forex, das sind ${Math.round(area / (9.3 * 2.5) * 100)} % der Wand.` + (ks.length < c.kreise ? ' Mehr passen mit Abstand nicht an die Wand.' : '');
  const rows = [
    ['Sofa und Teppich', '1 + 1', 'Neukauf XXL Lutz, Sponsoring anfragen (Scheibel, Lehnert)'],
    ['Einrichtung Wohnzimmer', '–', 'über Anjali Göbel (Molitor); Lagerplatz bis März offen'],
    ['Monitor mit Forex-Einhausung', '1', 'Sascha Becker'],
    ['Stellwand', '1 · im Modell 2,2 m breit', 'Bürgerhäuser (Molitor)'],
    ['70er-Tapete und Malerarbeit Koje', '≈ 11 m² im Modell', 'Malergeschäft aus Dreieich, Sponsoring – Anfrage offen'],
    ['70er-Tapete Wohnzimmer, Rückwand', '≈ 9 m² im Modell', 'erst klären, ob tapeziert werden darf'],
    ['Perücken, Kleider, Accessoires', '–', 'Faschingsbedarf; Bestellweg offen'],
    ['Mero-System mit Exponaten', 'im Modell 3,0 × 2,25 m', 'Corinna Molitor'],
    ['Litfaß-Säule', `im Modell Ø ${c.litfass.d} cm`, 'stellt Corinna Molitor'],
    ['Plakate DIN A2 hochkant', `${p.total} lt. Rechner`, 'Texte Gleichstellungsreferat → Gestaltung Sascha Becker'],
    ['Wandfarbe Orange', '≈ 23 m² (9,3 × 2,5 m)', 'Dreieicher Malerfirma, Sponsoring – Anfrage offen'],
    ['Runde Forexplatten', `${ks.length} · Ø 50/60 cm`, 'Grafik Sascha Becker, Produktion Vorschlag MSK'],
    ['Medienstelen', '3 im Modell', 'Stadt – Bestellung prüft Kim Lehnert'],
    ['Sitzkissen orange und lila', `${kissen.userData.count} im Modell`, 'Zuständigkeit offen'],
    ['Orange Folie für die Theke', 'Theke vor Ort messen', 'erst klären, ob Folieren möglich ist'],
    ['Willkommens-Fahne', '1 · im Modell 1,2 × 1,9 m', 'Zuständigkeit offen; Deckenhaken erst klären'],
  ];
  $('#mat-body').innerHTML = rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
  if (remake) { items.s5.remake(); items.s6.remake(); }
}

/* ---------- Start ---------- */
function resize() {
  const w = stageEl.clientWidth, h = stageEl.clientHeight; if (!w || !h) return;
  if (renderer) renderer.setSize(w, h, false);
  if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); }
  camera.aspect = w / h; camera.updateProjectionMatrix();
  stageEl.classList.toggle('compact', w < 640);
  invalidate(3);
}
new ResizeObserver(resize).observe(stageEl);
resize();
renderTodoViews(); renderRechner(); renderLayouts(); setTab('ueber');
$('#layout-sel').innerHTML = LAYOUTS.map((l, i) => `<option value="${l.key}">${String.fromCharCode(65 + i)} · ${esc(l.name)}</option>`).join(''); $('#layout-sel').value = state.layout;
$('#layout-sel').addEventListener('change', e => setLayout(e.target.value));
if (controls) { const [p, t] = POSES.iso(); camera.position.copy(p); controls.target.copy(t); controls.update(); }
let last = performance.now(), tvNext = 0; const tvPos = new V3();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (tween) {
    const k = clamp((now - tween.s) / tween.ms, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    camera.position.lerpVectors(tween.p0, tween.p1, e); controls.target.lerpVectors(tween.t0, tween.t1, e);
    if (tween.f0 !== tween.f1) { camera.fov = tween.f0 + (tween.f1 - tween.f0) * e; camera.updateProjectionMatrix(); }
    if (k >= 1) tween = null; invalidate();
  }
  if (state.walk) stepWalk(dt); else if (controls) controls.update();
  /* Fernsehprogramm: nur weiterzeichnen, solange der Bildschirm im Bild ist; aus der Ferne seltener */
  if (!REDUCED && state.expo && TV.mesh && now > tvNext) {
    TV.mesh.getWorldPosition(tvPos); const dist = tvPos.distanceTo(camera.position); tvPos.project(camera);
    if (tvPos.z < 1 && Math.abs(tvPos.x) < 1.1 && Math.abs(tvPos.y) < 1.1) { TV.draw(now / 1000); tvNext = now + (dist < 10 ? 100 : 240); invalidate(1); } else tvNext = now + 500;
  }
  if (dirty > 0 && renderer) {
    dirty--; if (shadowDirty) { renderer.shadowMap.needsUpdate = true; shadowDirty = false; }
    room.foil.opacity = clamp((6.5 - camera.position.y) / 3.5, 0.1, 1);   // von oben wird die Folierung blass, damit man hineinsieht
    if (composer) composer.render(); else renderer.render(scene, camera);
    updateLabels();
  }
}
requestAnimationFrame(frame);
initStore();
window.__popup = { state, items, setView, select, setMove, setWalk, startTour, setTab, setLayout, camera, controls, invalidate };
