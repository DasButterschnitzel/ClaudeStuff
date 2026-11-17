/* =====================================================================
   APP: Szenen, Kamera, Tour, Begehen, Scan, Galerie, Datenblatt
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const NF = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NF0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const eur = (n) => NF0.format(n) + ' €';
const keur = (n) => n ? (n / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' T€' : 'heute';
const m2 = (n) => NF.format(n) + ' m²';
const DEF_D = { W: 1.45, L: 2.45, H: 2.4 };
const ACC = { bestand: ['#2a7184', '#74bccd'], p: ['#4b7651', '#a3c7a6'], a: ['#4b7651', '#a3c7a6'], k: ['#c2456e', '#f2a6bf'], i: ['#2f6b47', '#7fb97a'], d: ['#a0522d', '#e09a6c'], m: ['#1f4a7a', '#7fa6d6'], l: ['#8a5a2b', '#d6b383'], h: ['#8b1e25', '#e07a7f'], o: ['#b5561f', '#e8a060'], c: ['#1d5a45', '#d3ae64'], g: ['#6b4f2a', '#e2c49a'], n: ['#b0249f', '#ff6ef5'], j: ['#8a6a2a', '#d6b56a'], b: ['#86602f', '#d8b07f'], e: ['#4a4d50', '#c3c1ba'], f: ['#2c6aa0', '#8ec5ff'] };
const state = { v: 'bestand', light: 'day', view: 'overview', compare: false, dims: false, zones: false, hot: true, spin: false, scan: false, split: 0.5, D: { ...DEF_D }, idea: 0, tab: 'ideas', filter: 'alle' };
const builds = new Map();
const isMobile = () => matchMedia('(max-width: 860px)').matches;
const V_ = (k = state.v) => VARIANTS.find(v => v.key === k);

/* ---------- 3D-Overlays (Zonen, Maßketten) ---------- */
function zoneTex(kind) {
  return cached('zone' + kind, () => {
    const c = mkCanvas(256, 256), x = c.getContext('2d'), col = kind === 'ok' ? '62,150,96' : '214,140,40';
    x.fillStyle = `rgba(${col},0.2)`; x.fillRect(0, 0, 256, 256); x.strokeStyle = `rgba(${col},0.95)`; x.lineWidth = 6; x.setLineDash([16, 10]); x.strokeRect(4, 4, 248, 248);
    x.strokeStyle = `rgba(${col},0.22)`; x.lineWidth = 3; x.setLineDash([]); for (let i = -256; i < 256; i += 22) { x.beginPath(); x.moveTo(i, 256); x.lineTo(i + 256, 0); x.stroke(); }
    return new THREE.CanvasTexture(c);
  });
}
function buildOverlays(B) {
  const { W, L, H } = B.D;
  B.zoneG = new THREE.Group(); B.dimG = new THREE.Group(); B.scene.add(B.zoneG, B.dimG); B.zoneG.visible = state.zones; B.dimG.visible = state.dims;
  B.zoneLabels = B.zones.map((z, i) => {
    z.state = zoneState(B, z);
    const p = mesh(new THREE.PlaneGeometry(z.x1 - z.x0, z.z1 - z.z0), new THREE.MeshBasicMaterial({ map: zoneTex(z.state), transparent: true, depthWrite: false }), { cast: false, recv: false });
    p.rotation.x = -PI / 2; p.position.set((z.x0 + z.x1) / 2, 0.014 + i * 0.002, (z.z0 + z.z1) / 2); p.renderOrder = 2; B.zoneG.add(p);
    return { pos: new V3((z.x0 + z.x1) / 2, 0.03, (z.z0 + z.z1) / 2), text: `${z.label} ${z.state === 'ok' ? '✓' : '· eng'}`, cls: 'zone ' + z.state };
  });
  const lm = new THREE.LineBasicMaterial({ color: 0x3a4a44, transparent: true, opacity: 0.85, depthTest: false });
  const line = (a, b, tick) => { const g = new THREE.BufferGeometry().setFromPoints([a, b, a.clone().sub(tick), a.clone().add(tick), b.clone().sub(tick), b.clone().add(tick)]); g.setIndex([0, 1, 2, 3, 4, 5]); const l = new THREE.LineSegments(g, lm); l.renderOrder = 5; B.dimG.add(l); };
  const o = 0.3; B.dimLabels = [];
  [[new V3(0, 0, L + o), new V3(W, 0, L + o), W, new V3(0, 0, 0.07)], [new V3(W + o, 0, 0), new V3(W + o, 0, L), L, new V3(0.07, 0, 0)], [new V3(W + o, 0, L + o), new V3(W + o, H, L + o), H, new V3(0.07, 0, 0)]].forEach(([a, b, v, t]) => { line(a, b, t); B.dimLabels.push({ pos: a.clone().add(b).multiplyScalar(0.5), text: NF.format(v) + ' m', cls: '' }); });
  if (!B.walkin && B.key !== 'g') { const s = B.lay.tray; line(new V3(W - s, 0.55, s + 0.05), new V3(W, 0.55, s + 0.05), new V3(0, 0.05, 0)); B.dimLabels.push({ pos: new V3(W - s / 2, 0.55, s + 0.05), text: Math.round(s * 100) + ' cm', cls: '' }); }
}
function getBuild(key) {
  if (!builds.has(key)) {
    const B = new Build(key, { ...state.D }); V_(key).build(B); prepareTall(B);
    B.free = freeArea(B); buildOverlays(B);
    B.furn.children.forEach(c => { c.userData.p0 = c.position.clone(); });
    applyLightMode(B, state.light); builds.set(key, B);
  }
  return builds.get(key);
}
const cur = () => getBuild(state.v);
function disposeAll() {
  for (const B of builds.values()) { B.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }); B.mirrors.forEach(m => m.dispose && m.dispose()); if (B.main.shadow.map) B.main.shadow.map.dispose(); }
  builds.clear(); scanPts = null;
}
function trimCache() { // nur aktuelle + Bestand-Szene im Speicher halten
  for (const [k, B] of builds) if (k !== state.v && k !== 'bestand') { B.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }); B.mirrors.forEach(m => m.dispose && m.dispose()); builds.delete(k); }
}

/* ---------- Kamera ---------- */
const camera = new THREE.PerspectiveCamera(40, 1, 0.03, 80);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.085; controls.screenSpacePanning = true; controls.autoRotateSpeed = 0.9;
const VIEWS = {
  overview: (D) => { const k = innerWidth < innerHeight ? 2.1 : 1; return { pos: [D.W + 1.9 * k, D.H + 2.1 * k, D.L + 2.3 * k], tgt: [D.W * 0.47, 0.75, D.L * 0.47], fov: 40 }; },
  plan: (D) => ({ pos: [D.W / 2, Math.max(D.W, D.L) * (innerWidth < innerHeight ? 3.6 : 2.8), D.L / 2 + 0.001], tgt: [D.W / 2, 0, D.L / 2], fov: 38 }),
  door: (D) => ({ inside: true, pos: [(0.42 + Math.min(D.W - 0.27, 1.18)) / 2, 1.62, D.L - 0.08], tgt: [D.W * 0.6, 1.0, 0], fov: 80 }),
  throne: (D) => ({ inside: true, pos: [0.32, 1.13, 0.3], tgt: [D.W * 0.62, 0.85, D.L], fov: 84 }),
  mirror: (D, B) => ({ inside: true, pos: [1.0, 1.62, (B.lay.vz) - 0.24], tgt: [0, 1.32, B.lay.vz + 0.05], fov: 70 }),
};
function lookPoint() { const d = new V3(); camera.getWorldDirection(d); const t = controls.target.distanceTo(camera.position); return camera.position.clone().addScaledVector(d, t > 0.2 ? t : 2); }
function setControlsFor(v, p1, t1) {
  if (v.inside) { const dir = t1.clone().sub(p1).normalize(); controls.target.copy(p1).addScaledVector(dir, 0.04); Object.assign(controls, { minDistance: 0.04, maxDistance: 0.04, enableZoom: false, enablePan: false, rotateSpeed: -0.32, minPolarAngle: 0.25, maxPolarAngle: PI - 0.25, autoRotate: false }); }
  else { controls.target.copy(t1); Object.assign(controls, { minDistance: 1.2, maxDistance: 16, enableZoom: true, enablePan: true, rotateSpeed: 0.8, minPolarAngle: 0, maxPolarAngle: PI * 0.495, autoRotate: state.spin }); }
}
function flyToDef(v, dur = 1100) {
  const p0 = camera.position.clone(), l0 = lookPoint(), f0 = camera.fov, p1 = v.pos instanceof V3 ? v.pos.clone() : new V3(...v.pos), t1 = v.tgt instanceof V3 ? v.tgt.clone() : new V3(...v.tgt);
  controls.enabled = false;
  return tween(k => { camera.position.lerpVectors(p0, p1, k); camera.lookAt(l0.clone().lerp(t1, k)); camera.fov = lerp(f0, v.fov, k); camera.updateProjectionMatrix(); req(); }, dur).then(() => { setControlsFor(v, p1, t1); controls.enabled = !walk.on; controls.update(); req(); });
}
function flyTo(key, dur) { if (walk.on) stopWalk(); state.view = key; updateDock(); return flyToDef(VIEWS[key](state.D, cur()), dur); }
function focusView(pos) { // Blickpunkt für eine Idee: von der gegenüberliegenden Raumseite, auf Augenhöhe
  const { W, L } = state.D, c = new V3(W / 2, 0, L / 2), dir = new V3(pos.x - c.x, 0, pos.z - c.z);
  if (dir.length() < 0.15) dir.set(0, 0, -1); dir.normalize();
  const p = pos.clone().addScaledVector(dir, -1.7); p.x = clamp(p.x, 0.22, W - 0.22); p.z = clamp(p.z, 0.3, L - 0.2); p.y = pos.y < 0.3 ? 1.75 : clamp(pos.y + 0.25, 1.25, 1.75);
  return { inside: true, pos: p, tgt: pos.clone(), fov: 76 };
}
renderer.domElement.addEventListener('wheel', (e) => { if (!((VIEWS[state.view]?.(state.D, cur()) || {}).inside || walk.on || state.view === 'focus')) return; e.preventDefault(); camera.fov = clamp(camera.fov + Math.sign(e.deltaY) * 3, 35, 95); camera.updateProjectionMatrix(); req(); }, { passive: false });
controls.addEventListener('change', () => req());

/* ---------- Begehen (First Person) ---------- */
const walk = { on: false, yaw: 0, pitch: 0, keys: {}, joy: { x: 0, y: 0 }, last: 0 };
function startWalk() {
  stopTour(); if (state.compare) toggleCompare(false);
  const { W, L } = state.D; walk.on = true; state.view = 'walk'; controls.enabled = false; controls.autoRotate = false;
  camera.position.set(Math.min(0.8, W * 0.55), 1.62, L - 0.3); walk.yaw = 0.05; walk.pitch = -0.12; camera.fov = 78; camera.updateProjectionMatrix();
  $('#walkhud').hidden = false; $('#joy').hidden = !IS_TOUCH; updateDock(); req(3); toast('Begehen: WASD oder Pfeiltasten, ziehen zum Umsehen');
}
function stopWalk() { if (!walk.on) return; walk.on = false; $('#walkhud').hidden = true; $('#joy').hidden = true; controls.enabled = true; walk.keys = {}; updateDock(); }
function stepWalk(now) {
  if (!walk.on) return false;
  const dt = Math.min(0.05, (now - (walk.last || now)) / 1000); walk.last = now;
  const k = walk.keys, f = (k.w || k.arrowup ? 1 : 0) - (k.s || k.arrowdown ? 1 : 0) + -walk.joy.y, s = (k.d ? 1 : 0) - (k.a ? 1 : 0) + walk.joy.x, turn = (k.arrowleft ? 1 : 0) - (k.arrowright ? 1 : 0);
  walk.yaw += turn * dt * 1.6;
  const sp = 1.1 * dt, fx = -Math.sin(walk.yaw), fz = -Math.cos(walk.yaw);
  if (f || s) { camera.position.x += (fx * f + -fz * s) * sp; camera.position.z += (fz * f + fx * s) * sp; }
  const { W, L } = state.D; camera.position.x = clamp(camera.position.x, 0.16, W - 0.16); camera.position.z = clamp(camera.position.z, 0.2, L - 0.16);
  camera.rotation.set(walk.pitch, walk.yaw, 0, 'YXZ');
  return !!(f || s || turn) || now - walk.lastLook < 120;
}
addEventListener('keydown', (e) => { if (walk.on && !e.target.matches('input')) { walk.keys[e.key.toLowerCase()] = true; if (e.key.startsWith('Arrow')) e.preventDefault(); req(); } });
addEventListener('keyup', (e) => { walk.keys[e.key.toLowerCase()] = false; });
(() => {
  const joy = $('#joy'), knob = $('#joyKnob'); let id = null;
  const mv = (e) => { const r = joy.getBoundingClientRect(), x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2), l = Math.hypot(x, y), q = l > 1 ? 1 / l : 1; walk.joy = { x: x * q, y: y * q }; knob.style.transform = `translate(${x * q * 34}px, ${y * q * 34}px)`; req(); };
  joy.addEventListener('pointerdown', (e) => { id = e.pointerId; joy.setPointerCapture(id); mv(e); });
  joy.addEventListener('pointermove', (e) => { if (e.pointerId === id) mv(e); });
  const end = () => { id = null; walk.joy = { x: 0, y: 0 }; knob.style.transform = ''; };
  joy.addEventListener('pointerup', end); joy.addEventListener('pointercancel', end);
})();

/* ---------- Roomtour ---------- */
const tour = { on: false, i: 0, paused: false, t0: 0, dur: 6500, steps: [] };
function tourSteps() { const B = cur(); return [{ intro: true, title: V_().info.title, text: V_().info.pitch }, ...B.hotspots.map(h => ({ h, title: h.title, text: h.text }))]; }
function startTour() { stopWalk(); if (state.compare) toggleCompare(false); tour.on = true; tour.paused = false; tour.steps = tourSteps(); tour.i = 0; $('#tourbar').hidden = false; setSpin(false); showTourStep(); updateDock(); }
function stopTour() { if (!tour.on) return; tour.on = false; $('#tourbar').hidden = true; updateDock(); }
function showTourStep() {
  const s = tour.steps[tour.i]; tour.t0 = performance.now();
  $('#tbEye').textContent = s.intro ? `Roomtour · ${V_().label}` : `Idee ${tour.i} von ${tour.steps.length - 1}`;
  $('#tbTitle').textContent = s.title; $('#tbText').textContent = s.intro ? 'Rundgang durch alle Ideen dieser Variante.' : s.text;
  if (s.intro) { state.view = 'overview'; flyToDef(VIEWS.overview(state.D), 1300).then(() => { if (tour.on && tour.i === 0) { controls.autoRotate = true; } }); }
  else { controls.autoRotate = false; state.view = 'focus'; state.idea = tour.i - 1; renderIdeas(); flyToDef(focusView(s.h.pos), 1300); }
  updateDock(); req();
}
function tourNext(d = 1) { tour.i = (tour.i + d + tour.steps.length) % tour.steps.length; if (tour.i === 0 && d > 0) { stopTour(); flyTo('overview'); toast('Tour fertig. Pfeil rechts oben zeigt das nächste Bad.'); return; } showTourStep(); }
function stepTour(now) {
  if (!tour.on) return false;
  const k = tour.paused ? (tour.pk ?? 0) : clamp((now - tour.t0) / tour.dur, 0, 1); if (!tour.paused) tour.pk = k;
  $('#tbProg').style.width = (k * 100).toFixed(1) + '%';
  if (!tour.paused && k >= 1) tourNext(1);
  return true;
}
$('#tTour').addEventListener('click', () => tour.on ? stopTour() : startTour());
$('#tbStop').addEventListener('click', () => { stopTour(); flyTo('overview'); });
$('#tbNext').addEventListener('click', () => tourNext(1));
$('#tbPrev').addEventListener('click', () => tourNext(-1));
$('#tbPlay').addEventListener('click', () => { tour.paused = !tour.paused; if (!tour.paused) tour.t0 = performance.now() - (tour.pk || 0) * tour.dur; $('#tbPlay').innerHTML = tour.paused ? '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>'; });

/* ---------- Video-Scan (Punktwolke) ---------- */
let scanPts = null;
function scanObject() {
  if (scanPts) return scanPts;
  const S = SCAN, raw = Uint8Array.from(atob(S.b64), c => c.charCodeAt(0)), n = S.n;
  const q = new Uint16Array(raw.buffer, 0, n * 3), col = raw.subarray(n * 6, n * 9), pos = new Float32Array(n * 3);
  const sx = state.D.W / S.dims[0], sz = state.D.L / S.dims[1], sy = state.D.H / S.dims[2];
  const boost = (v) => Math.min(1, Math.pow(v / 255, 0.8) * 1.15);
  for (let i = 0; i < n; i++) { pos[i * 3] = (S.lo[0] + (q[i * 3] / 65535) * S.span[0]) * sx; pos[i * 3 + 1] = (S.lo[1] + (q[i * 3 + 1] / 65535) * S.span[1]) * sy; pos[i * 3 + 2] = (S.lo[2] + (q[i * 3 + 2] / 65535) * S.span[2]) * sz; }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(Array.from(col, boost)), 3));
  const m = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, sizeAttenuation: true, map: radialTex('splat2', 'rgba(255,255,255,1)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, alphaTest: 0.05, toneMapped: false });
  scanPts = new THREE.Group(); const pts = new THREE.Points(g, m); pts.renderOrder = 4; scanPts.add(pts);
  const { W, L, H } = state.D, bx = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, L)), new THREE.LineBasicMaterial({ color: 0x2a7184, transparent: true, opacity: 0.55 })); bx.position.set(W / 2, H / 2, L / 2); scanPts.add(bx);
  const fl = mesh(new THREE.PlaneGeometry(W, L), new THREE.MeshBasicMaterial({ color: 0x9aa59f, transparent: true, opacity: 0.18, depthWrite: false }), { cast: false, recv: false }); fl.rotation.x = -PI / 2; fl.position.set(W / 2, 0.001, L / 2); scanPts.add(fl);
  return scanPts;
}
function setScan(on) {
  state.scan = on; const B = cur(), pts = scanObject();
  for (const b of builds.values()) { b.root.visible = true; if (pts.parent === b.scene) b.scene.remove(pts); }
  if (on) { B.scene.add(pts); B.root.visible = false; toast(`Video-Scan: ${NF0.format(SCAN.n)} echte 3D-Punkte aus deinem Rundgang`); if (state.view !== 'overview' && state.view !== 'plan') flyTo('overview'); }
  updateDock(); req(3);
}

/* ---------- Rendering ---------- */
let needs = 3; function req(n = 2) { needs = Math.max(needs, n); }
function cutaway(B) {
  const c = camera.position, { W, L, H } = B.D, m = 0.01;
  B.walls.back.visible = c.z > -m; B.walls.front.visible = c.z < L + m; B.walls.left.visible = c.x > -m; B.walls.right.visible = c.x < W + m; B.ceil.visible = c.y < H - 0.02;
  for (const w of WALLS) B.clip[w].constant = B.walls[w].visible ? 1e4 : 1.15;
}
const viewport = () => ({ w: stageEl.clientWidth, h: stageEl.clientHeight });
function layoutCamera() {
  const { w, h } = viewport(); renderer.setSize(w, h, false);
  if (document.body.classList.contains('thumbmode')) { camera.aspect = w / h; camera.clearViewOffset(); camera.updateProjectionMatrix(); req(); return; }
  const mob = isMobile(), top = $('.top').getBoundingClientRect().bottom + 8;
  const bottom = mob ? $('#dock').getBoundingClientRect().top - 8 : $('#dock').getBoundingClientRect().top - 8, right = mob ? w : $('#panel').getBoundingClientRect().left - 8;
  const dx = w / 2 - right / 2, dy = h / 2 - (top + bottom) / 2, fw = w + 2 * Math.abs(dx), fh = h + 2 * Math.abs(dy);
  camera.aspect = fw / fh; camera.setViewOffset(fw, fh, dx > 0 ? 2 * dx : 0, dy > 0 ? 2 * dy : 0, w, h); camera.updateProjectionMatrix(); req();
}
function render() {
  const B = cur(), { w, h } = viewport();
  if (state.compare && state.v !== 'bestand') {
    const A = getBuild('bestand'); cutaway(A); cutaway(B); const sx = Math.round(w * state.split);
    renderer.setScissorTest(true); renderer.setScissor(0, 0, sx, h); renderer.render(A.scene, camera); renderer.setScissor(sx, 0, w - sx, h); renderer.render(B.scene, camera); renderer.setScissorTest(false);
  } else { cutaway(B); renderer.render(B.scene, camera); }
}

/* ---------- DOM-Overlays ---------- */
const ovl = $('#overlay'); let hsEls = [], lblEls = [], frame = 0;
function syncOverlay() {
  ovl.innerHTML = ''; const B = cur();
  hsEls = B.hotspots.map((h, i) => { const b = document.createElement('button'); b.className = 'hs ' + h.kind; b.textContent = h.n; b.setAttribute('aria-label', h.title); b.addEventListener('click', (e) => { e.stopPropagation(); selectIdea(i, true); }); ovl.appendChild(b); return { h, i, el: b, occ: false }; });
  const mk = (it, kind) => { const s = document.createElement('span'); s.className = 'lbl ' + it.cls; s.textContent = it.text; ovl.appendChild(s); return { it, el: s, kind }; };
  lblEls = [...B.dimLabels.map(it => mk(it, 'dim')), ...B.zoneLabels.map(it => mk(it, 'zone'))];
}
const tmpV = new V3();
function project(p) { tmpV.copy(p).project(camera); const { w, h } = viewport(); return { x: (tmpV.x * 0.5 + 0.5) * w, y: (-tmpV.y * 0.5 + 0.5) * h, vis: tmpV.z < 1 && tmpV.z > -1 }; }
const occRay = new THREE.Raycaster();
function visibleDeep(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
function updateOverlay() {
  frame++; const B = cur(), show = state.hot && !state.compare && !state.scan && !walk.on;
  hsEls.forEach(o => {
    const p = project(o.h.pos); o.el.classList.toggle('off', !show || !p.vis); o.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
    if (frame % 8 === 0 && show && p.vis) { const dir = o.h.pos.clone().sub(camera.position), dist = dir.length(); occRay.set(camera.position, dir.normalize()); occRay.far = dist; const hit = occRay.intersectObject(B.root, true).find(h => visibleDeep(h.object) && !(h.object.material && h.object.material.transparent)); o.occ = !!hit && hit.distance < dist - 0.12; }
    o.el.classList.toggle('occ', o.occ); o.el.classList.toggle('on', o.i === state.idea && state.tab === 'ideas');
  });
  lblEls.forEach(o => { const show2 = (o.kind === 'dim' ? state.dims : state.zones) && !state.compare && !state.scan, p = project(o.it.pos); o.el.classList.toggle('off', !show2 || !p.vis); o.el.style.transform = `translate(calc(${p.x.toFixed(1)}px - 50%), calc(${p.y.toFixed(1)}px - 50%))`; });
  if (state.compare) { const x = viewport().w * state.split; $('#splitLine').style.left = x + 'px'; $('#splitKnob').style.left = x + 'px'; $('#tagL').style.left = Math.max(8, x - 110) + 'px'; $('#tagR').style.left = (x + 12) + 'px'; }
}
let toastT; function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.remove('gone'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('gone'), 3200); }

/* ---------- Tooltip & Klicks im 3D ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tip = $('#tip'), cv = renderer.domElement;
function pick(cx, cy) {
  const r = cv.getBoundingClientRect(), x = cx - r.left, y = cy - r.top; ndc.set((x / r.width) * 2 - 1, -(y / r.height) * 2 + 1);
  const B = state.compare && state.v !== 'bestand' && x < r.width * state.split ? getBuild('bestand') : cur(); ray.setFromCamera(ndc, camera);
  for (const h of ray.intersectObject(B.root, true)) { if (!visibleDeep(h.object)) continue; let o = h.object; while (o && !o.userData.name && !o.userData.click) o = o.parent; return o && o !== B.root ? o : null; }
  return null;
}
let down = null, lastMove = 0;
cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; if (walk.on) { cv.setPointerCapture(e.pointerId); walk.drag = { x: e.clientX, y: e.clientY }; } });
cv.addEventListener('pointerup', (e) => {
  walk.drag = null; if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null; if (moved > 6) return;
  const o = pick(e.clientX, e.clientY); if (o) { let c = o; while (c && !c.userData.click) c = c.parent; if (c) { c.userData.click(); req(); tip.hidden = true; } }
});
cv.addEventListener('pointermove', (e) => {
  if (walk.on && walk.drag) { walk.yaw -= (e.clientX - walk.drag.x) * 0.0045; walk.pitch = clamp(walk.pitch - (e.clientY - walk.drag.y) * 0.0035, -1.2, 1.2); walk.drag = { x: e.clientX, y: e.clientY }; walk.lastLook = performance.now(); req(); return; }
  if (IS_TOUCH || e.buttons) { tip.hidden = true; return; }
  const now = performance.now(); if (now - lastMove < 60) return; lastMove = now; const o = pick(e.clientX, e.clientY);
  if (o && o.userData.name) { let c = o, click = false; while (c) { if (c.userData.click) { click = true; break; } c = c.parent; } tip.textContent = o.userData.name; tip.hidden = false; tip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 16}px)`; cv.style.cursor = click ? 'pointer' : 'default'; }
  else { tip.hidden = true; cv.style.cursor = walk.on ? 'grab' : 'grab'; }
});
cv.addEventListener('pointerleave', () => { tip.hidden = true; });

/* ---------- Variante wechseln ---------- */
function dropIn(B) { if (REDUCED) return; B.furn.children.slice().sort((a, b) => a.userData.p0.y - b.userData.p0.y).forEach((c, i) => { const p = c.userData.p0; c.position.y = p.y + 1.3; tween(k => { c.position.y = p.y + (1 - k) * 1.3; }, 600, ease.out, i * 12); }); }
function setVariant(key, { anim = true } = {}) {
  if (!V_(key)) return;
  stopTour(); if (state.compare && key === 'bestand') toggleCompare(false);
  const wasScan = state.scan; if (wasScan) setScan(false);
  state.v = key; state.idea = 0; const acc = ACC[key] || ACC.bestand; document.body.style.setProperty('--al', acc[0]); document.body.style.setProperty('--ad', acc[1]);
  const B = getBuild(key); applyLightMode(B, state.light); B.zoneG.visible = state.zones; B.dimG.visible = state.dims;
  renderSwitch(); renderPanel(); syncOverlay(); if (anim) dropIn(B); trimCache();
  try { if (location.hash.slice(1) !== V_().hash) history.replaceState(null, '', '#' + V_().hash); } catch (e) { /* Hash nicht verfügbar */ }
  $('#tCompare').disabled = key === 'bestand'; if (state.compare) $('#tagR').textContent = V_().label;
  if (wasScan) setScan(true);
  if (state.view === 'mirror' || state.view === 'focus') flyTo(state.view === 'focus' ? 'overview' : 'mirror', 700);
  req(4);
}
function stepVariant(d) { const i = VARIANTS.findIndex(v => v.key === state.v); setVariant(VARIANTS[(i + d + VARIANTS.length) % VARIANTS.length].key); }
const sw3 = (sw, s = 34) => `<span class="swatch3" style="width:${s}px;height:${s}px;background:${sw[0]}"><i style="left:50%;top:0;right:0;bottom:50%;background:${sw[1]}"></i><i style="left:0;top:50%;right:50%;bottom:0;background:${sw[2]}"></i></span>`;
function renderSwitch() {
  const V = V_(), i = VARIANTS.indexOf(V);
  $('#curV').innerHTML = `${sw3(V.sw)}<span style="min-width:0"><b>${V.label}<span class="cnt">${i + 1}/${VARIANTS.length}</span></b><small>${V.sub} · ${V.info.budget ? '≈ ' + keur(V.info.budget) : 'Ausgangslage'}</small></span>`;
}
$('#prevV').addEventListener('click', () => stepVariant(-1)); $('#nextV').addEventListener('click', () => stepVariant(1));
$('#curV').addEventListener('click', () => openGallery()); $('#openGal').addEventListener('click', () => openGallery());

/* ---------- Galerie ---------- */
const FILTERS = [['alle', 'Alle'], ['miete', 'Mietwohnung'], ['budget', 'Unter 2.000 €'], ['walkin', 'Walk-in-Dusche'], ['mutig', 'Mutig'], ['ruhig', 'Ruhig & hell']];
function matchF(v, f) { if (f === 'alle') return true; if (f === 'miete') return !!v.info.tenant?.ok || v.key === 'bestand'; if (f === 'budget') return (v.info.budget || 0) < 2000; if (f === 'ruhig') return ['a', 'b', 'f', 'c', 'm', 'p'].includes(v.key); return (v.tags || []).includes(f); }
function openGallery() {
  stopTour(); $('#gallery').hidden = false;
  $('#gChips').innerHTML = FILTERS.map(([k, t]) => `<button class="chip" data-f="${k}" aria-pressed="${state.filter === k}">${t}</button>`).join('');
  $('#gChips').querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => { state.filter = b.dataset.f; openGallery(); }));
  const list = VARIANTS.filter(v => matchF(v, state.filter));
  $('#gTitle').textContent = `${list.length} ${list.length === 1 ? 'Bad' : 'Bäder'} für dein Bad`;
  $('#gGrid').innerHTML = list.map(v => { const th = (typeof THUMBS !== 'undefined' && THUMBS[v.key]) || ''; return `<button class="card ${v.key === state.v ? 'cur' : ''}" data-v="${v.key}"><div class="thumb" style="${th ? `background-image:url(${th})` : `background:linear-gradient(135deg, ${v.sw[0]}, ${v.sw[1]})`}"><span class="pal">${v.info.palette.slice(0, 4).map(p => `<i style="background:${p[1]}"></i>`).join('')}</span></div><div class="cb"><b>${esc(v.label)}<span>${v.info.budget ? '≈ ' + keur(v.info.budget) : 'heute'}</span></b><small>${esc(v.sub)}</small><div class="tags">${v.info.tenant?.ok ? '<span class="ok">Mietwohnung ✓</span>' : ''}${(v.tags || []).includes('walkin') ? '<span>Walk-in</span>' : v.key === 'g' ? '<span>Ofuro</span>' : v.key !== 'bestand' ? '<span>Duschtasse bleibt</span>' : ''}<span>${esc(v.info.effort.split('·')[0].trim())}</span></div></div></button>`; }).join('');
  $('#gGrid').querySelectorAll('.card').forEach(b => b.addEventListener('click', () => { $('#gallery').hidden = true; setVariant(b.dataset.v); if (state.view !== 'overview') flyTo('overview', 800); }));
}
$('#closeGal').addEventListener('click', () => { $('#gallery').hidden = true; });

/* ---------- Datenblatt ---------- */
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function renderPanel() {
  const V = V_(), I = V.info;
  $('#pHead').innerHTML = `<div class="eyebrow">${esc(I.eyebrow)}</div><h2>${esc(I.title)}</h2>${I.tenant ? `<span class="pill ${I.tenant.ok ? 'ok' : 'no'}">${esc(I.tenant.text)}</span>` : ''}`;
  document.querySelectorAll('.ptab').forEach(t => { t.setAttribute('aria-selected', String(t.dataset.tab === state.tab)); if (t.dataset.tab === 'ideas') t.textContent = (V.key === 'bestand' ? 'Probleme' : 'Ideen') + ` (${cur().hotspots.length})`; if (t.dataset.tab === 'cost') t.hidden = !I.costs; });
  if (state.tab === 'cost' && !I.costs) state.tab = 'ideas';
  if (state.tab === 'ideas') renderIdeas(); else if (state.tab === 'info') renderInfo(); else renderCosts();
}
function renderIdeas() {
  if (state.tab !== 'ideas') return;
  const B = cur(), hs = B.hotspots, i = clamp(state.idea, 0, hs.length - 1), h = hs[i]; if (!h) return;
  $('#pBody').innerHTML = `<div class="step"><div class="step-top"><span class="step-n"><i class="${h.kind}">${esc(h.n)}</i>${i + 1} / ${hs.length}</span><div class="dots">${hs.map((_, k) => `<button aria-label="Idee ${k + 1}" data-k="${k}" aria-current="${k === i}"></button>`).join('')}</div></div><h4>${esc(h.title)}</h4><p>${esc(h.text)}</p><div class="step-nav"><button class="btn" id="iPrev" aria-label="Vorherige Idee"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><button class="btn" id="iShow"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/></svg>Im Raum zeigen</button><button class="btn" id="iNext" aria-label="Nächste Idee"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button></div></div>
  <button class="btn pri" id="iTour"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>Roomtour durch alle ${hs.length} ${V_().key === 'bestand' ? 'Punkte' : 'Ideen'}</button>
  <section class="sec"><h3><span>Alle auf einen Blick</span></h3><div class="idx">${hs.map((x, k) => `<button data-k="${k}" aria-current="${k === i}"><i>${esc(x.n)}</i>${esc(x.title)}</button>`).join('')}</div></section>
  ${V_().key === 'bestand' ? `<section class="sec"><h3>Was gut ist</h3><ul class="good">${V_().info.good.map(g => `<li>${esc(g)}</li>`).join('')}</ul></section>` : ''}`;
  $('#iPrev').onclick = () => selectIdea((i - 1 + hs.length) % hs.length, true); $('#iNext').onclick = () => selectIdea((i + 1) % hs.length, true);
  $('#iShow').onclick = () => selectIdea(i, true); $('#iTour').onclick = startTour;
  $('#pBody').querySelectorAll('[data-k]').forEach(b => b.onclick = () => selectIdea(+b.dataset.k, true));
}
function selectIdea(i, fly) { state.idea = i; if (state.tab !== 'ideas') { state.tab = 'ideas'; renderPanel(); } else renderIdeas(); if (fly && !tour.on) { stopWalk(); state.view = 'focus'; updateDock(); flyToDef(focusView(cur().hotspots[i].pos), 1000); } if (isMobile()) toast(cur().hotspots[i].title); req(); }
function renderInfo() {
  const V = V_(), I = V.info, B = cur(), B0 = getBuild('bestand'), dF = B.free - B0.free, s0 = VARIANTS[0].info.storage;
  const kp = [['Budget', I.budget ? '≈ ' + eur(I.budget) : 'Status quo', I.budget ? 'Richtwert inkl. MwSt.' : 'nichts investiert'], ['Aufwand', I.effort, '', true], ['Stauraum', '≈ ' + I.storage + ' L', V.key === 'bestand' ? 'geschätzt' : '+' + Math.round((I.storage / s0 - 1) * 100) + ' % ggü. heute', false, V.key !== 'bestand'], ['Freie Lauffläche', m2(B.free), V.key === 'bestand' ? 'von ' + m2(B.D.W * B.D.L) : (dF >= 0 ? '+' : '−') + NF.format(Math.abs(dF)) + ' m² ggü. heute', false, dF > 0.01]];
  const maxB = Math.max(...VARIANTS.map(v => v.info.budget || 0));
  $('#pBody').innerHTML = `<p class="pitch">${esc(I.pitch)}</p><div class="kpis">${kp.map(([l, v, s, sm, up]) => `<div class="kpi"><span>${l}</span><b class="${sm ? 'sm' : ''}">${esc(v)}</b>${s ? `<em class="${up ? 'up' : ''}">${esc(s)}</em>` : ''}</div>`).join('')}</div>
  ${V.key !== 'bestand' ? `<button class="btn" id="cmpBtn"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 2v20"/></svg>Mit Bestand vergleichen</button>` : ''}
  <section class="sec"><h3>Material &amp; Farbe</h3><div class="swatches">${I.palette.map(([n, c]) => `<div><i style="background:${c}"></i><span>${esc(n)}</span></div>`).join('')}</div></section>
  <section class="sec"><h3><span>Alle Bäder nach Budget</span></h3><div class="cmp">${VARIANTS.slice().sort((a, b) => (a.info.budget || 0) - (b.info.budget || 0)).map(v => `<button data-go="${v.key}" class="${v.key === V.key ? 'on' : ''}"><span>${esc(v.label)}</span><span class="tr"><i style="width:${((v.info.budget || 0) / maxB * 100).toFixed(1)}%"></i></span><em>${v.info.budget ? keur(v.info.budget) : '—'}</em></button>`).join('')}</div></section>
  <p class="fine">Raum aus deinem Rundgang-Video per Structure-from-Motion vermessen (194 Kamerapositionen, ${NF0.format(SCAN.n)} Punkte, Maßstab über die Raumhöhe). DIN-Flächen nach DIN 18022 als Orientierung.</p>`;
  const cb = $('#cmpBtn'); if (cb) cb.onclick = () => toggleCompare(true);
  $('#pBody').querySelectorAll('[data-go]').forEach(b => b.onclick = () => setVariant(b.dataset.go));
}
function renderCosts() {
  const I = V_().info;
  $('#pBody').innerHTML = `<div class="kpis"><div class="kpi"><span>Summe</span><b>≈ ${eur(I.budget)}</b><em>Richtwert inkl. MwSt.</em></div><div class="kpi"><span>Aufwand</span><b class="sm">${esc(I.effort)}</b></div></div><table class="costs"><tbody>${I.costs.map(([t, p]) => `<tr><td>${esc(t)}</td><td>${eur(p)}</td></tr>`).join('')}</tbody><tfoot><tr><td>Summe</td><td>${eur(I.budget)}</td></tr></tfoot></table><p class="fine">Richtwerte Stand 2026. Vor dem Kauf echte Angebote einholen und vor Ort nachmessen.</p>`;
}
document.querySelectorAll('.ptab').forEach(t => t.addEventListener('click', () => { state.tab = t.dataset.tab; renderPanel(); req(); }));

/* ---------- Dock ---------- */
function updateDock() {
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view && !walk.on)));
  $('#tLight').setAttribute('aria-pressed', String(state.light === 'night')); $('#tLight span').textContent = state.light === 'night' ? 'Tag' : 'Abend';
  $('#tCompare').setAttribute('aria-pressed', String(state.compare)); $('#tDims').setAttribute('aria-pressed', String(state.dims)); $('#tZones').setAttribute('aria-pressed', String(state.zones));
  $('#tHot').setAttribute('aria-pressed', String(state.hot)); $('#tSpin').setAttribute('aria-pressed', String(state.spin)); $('#tScan').setAttribute('aria-pressed', String(state.scan));
  $('#tWalk').setAttribute('aria-pressed', String(walk.on)); $('#tRoom').setAttribute('aria-pressed', String(!$('#roomPop').hidden));
  $('#tTour').innerHTML = tour.on ? '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>Tour stoppen' : '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></svg>Roomtour';
}
document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { stopTour(); if (state.scan && b.dataset.view !== 'overview' && b.dataset.view !== 'plan') setScan(false); if (b.dataset.view !== 'overview') setSpin(false); flyTo(b.dataset.view); }));
function setLight(mode) { state.light = mode; document.body.dataset.light = mode; for (const B of builds.values()) applyLightMode(B, mode); renderer.toneMappingExposure = mode === 'night' ? 1.15 : 1.05; updateDock(); req(3); }
$('#tLight').addEventListener('click', () => setLight(state.light === 'night' ? 'day' : 'night'));
function toggleCompare(on = !state.compare) { if (on && state.v === 'bestand') return; if (on) { stopWalk(); stopTour(); if (state.scan) setScan(false); } state.compare = on; $('#split').hidden = !on; if (on) { applyLightMode(getBuild('bestand'), state.light); $('#tagR').textContent = V_().label; } updateDock(); req(3); }
$('#tCompare').addEventListener('click', () => toggleCompare());
$('#tScan').addEventListener('click', () => setScan(!state.scan));
$('#tWalk').addEventListener('click', () => walk.on ? (stopWalk(), flyTo('overview')) : startWalk());
$('#walkExit').addEventListener('click', () => { stopWalk(); flyTo('overview'); });
$('#tDims').addEventListener('click', () => { state.dims = !state.dims; for (const B of builds.values()) B.dimG.visible = state.dims; updateDock(); req(); });
$('#tZones').addEventListener('click', () => { state.zones = !state.zones; for (const B of builds.values()) B.zoneG.visible = state.zones; if (state.zones && state.view !== 'plan') flyTo('plan'); updateDock(); req(); });
$('#tHot').addEventListener('click', () => { state.hot = !state.hot; updateDock(); req(); });
function setSpin(on) { state.spin = on; controls.autoRotate = on && !(VIEWS[state.view]?.(state.D, cur()) || {}).inside; updateDock(); req(); }
$('#tSpin').addEventListener('click', () => { const on = !state.spin; if (on && state.view !== 'overview') flyTo('overview').then(() => setSpin(true)); else setSpin(on); });
$('#tRoom').addEventListener('click', () => { $('#roomPop').hidden = !$('#roomPop').hidden; updateDock(); });
$('#roomClose').addEventListener('click', () => { $('#roomPop').hidden = true; updateDock(); });
(() => { const knob = $('#splitKnob'); let drag = false; knob.addEventListener('pointerdown', (e) => { drag = true; knob.setPointerCapture(e.pointerId); }); knob.addEventListener('pointermove', (e) => { if (!drag) return; const r = stageEl.getBoundingClientRect(); state.split = clamp((e.clientX - r.left) / r.width, 0.05, 0.95); req(); }); knob.addEventListener('pointerup', () => { drag = false; }); })();

/* ---------- Raummaße ---------- */
function roomMeta() { const { W, L, H } = state.D; $('#roomMeta').textContent = `${NF.format(W)} × ${NF.format(L)} m · ${NF.format(W * L)} m² · Höhe ${NF.format(H)} m`; }
let rebuildT = null;
function setDims(D) {
  state.D = { ...D }; roomMeta(); for (const k of ['W', 'L', 'H']) { $('#in' + k).value = D[k]; $('#out' + k).textContent = NF.format(D[k]) + ' m'; }
  clearTimeout(rebuildT); rebuildT = setTimeout(() => { const sc = state.scan; disposeAll(); state.scan = false; setVariant(state.v, { anim: false }); if (sc) setScan(true); if (state.compare) toggleCompare(true); if (!walk.on) flyTo(state.view === 'focus' ? 'overview' : state.view, 500); }, 220);
}
['W', 'L', 'H'].forEach(k => $('#in' + k).addEventListener('input', (e) => setDims({ ...state.D, [k]: parseFloat(e.target.value) })));
$('#roomReset').addEventListener('click', () => setDims(DEF_D));

/* ---------- Bottom-Sheet, Tastatur, Hash ---------- */
function setSheet(open) { document.body.classList.toggle('sheet-open', open); $('#sheetHandle').setAttribute('aria-expanded', String(open)); setTimeout(layoutCamera, 380); }
$('#sheetHandle').addEventListener('click', () => setSheet(!document.body.classList.contains('sheet-open')));
$('#pHead').addEventListener('click', () => { if (isMobile()) setSheet(!document.body.classList.contains('sheet-open')); });
addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea') || walk.on && /^[wasd]$|^arrow/i.test(e.key)) { if (e.key === 'Escape') { stopWalk(); flyTo('overview'); } return; }
  if (!$('#gallery').hidden) { if (e.key === 'Escape') $('#gallery').hidden = true; return; }
  if (e.key === 'ArrowRight') { tour.on ? tourNext(1) : stepVariant(1); } if (e.key === 'ArrowLeft') { tour.on ? tourNext(-1) : stepVariant(-1); }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { const n = cur().hotspots.length; selectIdea((state.idea + (e.key === 'ArrowDown' ? 1 : -1) + n) % n, true); e.preventDefault(); }
  if (e.key === ' ' && tour.on) { $('#tbPlay').click(); e.preventDefault(); }
  if (e.key === 't' || e.key === 'T') tour.on ? stopTour() : startTour();
  if (e.key === 'g' || e.key === 'G') openGallery();
  if (e.key === 'l' || e.key === 'L') setLight(state.light === 'night' ? 'day' : 'night');
  if (e.key === 'v' || e.key === 'V') toggleCompare();
  if (e.key === 'b' || e.key === 'B') walk.on ? stopWalk() : startWalk();
  if (e.key === 'Escape') { stopTour(); $('#roomPop').hidden = true; updateDock(); }
});
addEventListener('hashchange', () => { const v = VARIANTS.find(v => v.hash === location.hash.slice(1)); if (v && v.key !== state.v) setVariant(v.key); });
addEventListener('resize', () => layoutCamera());

/* ---------- Loop & Start ---------- */
function loop(now) {
  requestAnimationFrame(loop);
  const tw = stepTweens(now), wk = stepWalk(now), tr = stepTour(now), ch = controls.enabled ? controls.update() : false;
  if (tw || ch || wk || (controls.autoRotate && controls.enabled)) needs = Math.max(needs, 1);
  if (tr) updateOverlay();
  if (needs <= 0) return; needs--; render(); updateOverlay();
}
window.__bad = { builds, state, VARIANTS, setVariant, flyTo, setLight, toggleCompare, camera, controls, setScan, startTour, startWalk, layoutCamera };
function start() {
  const fromHash = VARIANTS.find(v => v.hash === location.hash.slice(1)); state.v = fromHash ? fromHash.key : 'bestand';
  document.body.dataset.light = state.light; roomMeta(); for (const k of ['W', 'L', 'H']) $('#out' + k).textContent = NF.format(state.D[k]) + ' m';
  getBuild('bestand'); setVariant(state.v, { anim: false }); layoutCamera();
  const v = VIEWS.overview(state.D); camera.position.set(v.pos[0] + 2.5, v.pos[1] + 1.8, v.pos[2] + 1.2); camera.fov = v.fov; camera.lookAt(...v.tgt); setControlsFor(v, new V3(...v.pos), new V3(...v.tgt));
  updateDock(); requestAnimationFrame(loop);
  requestAnimationFrame(() => { $('#loader').classList.add('done'); setTimeout(() => { $('#loader').hidden = true; }, 600); dropIn(cur()); flyTo('overview', 1600).then(() => toast('Tipp: Roomtour starten oder mit ← → durch die Bäder blättern')); });
}
start();
