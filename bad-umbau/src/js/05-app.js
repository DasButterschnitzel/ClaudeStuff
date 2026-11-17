/* =====================================================================
   APP: Szenen, Kamera, Overlays, UI
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const NF = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NF0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const eur = (n) => NF0.format(n) + ' €';
const m2 = (n) => NF.format(n) + ' m²';
const DEF_D = { W: 1.7, L: 2.55, H: 2.4 };
const state = { v: 'bestand', light: 'day', view: 'overview', compare: false, dims: false, zones: false, hot: true, spin: false, split: 0.5, D: { ...DEF_D }, card: null };
const builds = new Map();
const isMobile = () => matchMedia('(max-width: 860px)').matches;

/* ---------- Overlays im 3D (Zonen, Maßketten) ---------- */
function zoneTex(kind) {
  return cached('zone' + kind, () => {
    const c = mkCanvas(256, 256), x = c.getContext('2d'), col = kind === 'ok' ? '62,150,96' : '214,140,40';
    x.fillStyle = `rgba(${col},0.2)`; x.fillRect(0, 0, 256, 256);
    x.strokeStyle = `rgba(${col},0.95)`; x.lineWidth = 6; x.setLineDash([16, 10]); x.strokeRect(4, 4, 248, 248);
    x.strokeStyle = `rgba(${col},0.22)`; x.lineWidth = 3; x.setLineDash([]);
    for (let i = -256; i < 256; i += 22) { x.beginPath(); x.moveTo(i, 256); x.lineTo(i + 256, 0); x.stroke(); }
    return new THREE.CanvasTexture(c);
  });
}
function buildOverlays(B) {
  const { W, L, H } = B.D;
  B.zoneG = new THREE.Group(); B.dimG = new THREE.Group(); B.scene.add(B.zoneG, B.dimG);
  B.zoneG.visible = state.zones; B.dimG.visible = state.dims;
  B.zoneLabels = B.zones.map(z => {
    z.state = zoneState(B, z);
    const p = mesh(new THREE.PlaneGeometry(z.x1 - z.x0, z.z1 - z.z0), new THREE.MeshBasicMaterial({ map: zoneTex(z.state), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), { cast: false, recv: false });
    p.rotation.x = -PI / 2; p.position.set((z.x0 + z.x1) / 2, 0.012 + B.zoneG.children.length * 0.0015, (z.z0 + z.z1) / 2); p.renderOrder = 2;
    B.zoneG.add(p);
    return { pos: new V3((z.x0 + z.x1) / 2, 0.03, (z.z0 + z.z1) / 2), text: `${z.label} ${Math.round((z.x1 - z.x0) * 100)}×${Math.round((z.z1 - z.z0) * 100)} ${z.state === 'ok' ? '✓' : '· eng'}`, cls: 'zone ' + z.state };
  });
  const lm = new THREE.LineBasicMaterial({ color: 0x3a4a44, transparent: true, opacity: 0.85, depthTest: false });
  const line = (a, b, tick = new V3(0, 0.06, 0)) => {
    const pts = [a, b, a.clone().sub(tick), a.clone().add(tick), b.clone().sub(tick), b.clone().add(tick)];
    const g = new THREE.BufferGeometry().setFromPoints(pts); g.setIndex([0, 1, 2, 3, 4, 5]);
    const l = new THREE.LineSegments(g, lm); l.renderOrder = 5; B.dimG.add(l);
  };
  const o = 0.32;
  const room = [
    [new V3(0, 0, L + o), new V3(W, 0, L + o), NF.format(W) + ' m', new V3(0, 0, 0.07)],
    [new V3(W + o, 0, 0), new V3(W + o, 0, L), NF.format(L) + ' m', new V3(0.07, 0, 0)],
    [new V3(W + o, 0, L + o), new V3(W + o, H, L + o), NF.format(H) + ' m', new V3(0.07, 0, 0)],
  ];
  B.dimLabels = [];
  room.forEach(([a, b, t, tick]) => { line(a, b, tick); B.dimLabels.push({ pos: a.clone().add(b).multiplyScalar(0.5), text: t, cls: '' }); });
  B.dims.forEach(d => { line(d.a, d.b, new V3(0, 0.05, 0)); B.dimLabels.push({ pos: d.a.clone().add(d.b).multiplyScalar(0.5), text: d.label + ' cm', cls: '' }); });
}

/* ---------- Szenen verwalten ---------- */
function getBuild(key) {
  if (!builds.has(key)) {
    const V = VARIANTS.find(v => v.key === key), B = new Build(key, { ...state.D });
    V.build(B);
    prepareTall(B);
    B.free = freeArea(B);
    buildOverlays(B);
    B.furn.children.forEach(c => { c.userData.p0 = c.position.clone(); });
    applyLightMode(B, state.light);
    builds.set(key, B);
  }
  return builds.get(key);
}
const cur = () => getBuild(state.v);
function disposeAll() {
  for (const B of builds.values()) {
    B.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.isMesh && o.material && o.material.isMeshBasicMaterial && !o.material.map) o.material.dispose(); });
    B.mirrors.forEach(m => m.dispose && m.dispose());
    if (B.main.shadow.map) B.main.shadow.map.dispose();
  }
  builds.clear();
}

/* ---------- Kamera ---------- */
const camera = new THREE.PerspectiveCamera(40, 1, 0.03, 80);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.085; controls.screenSpacePanning = true; controls.autoRotateSpeed = 0.9;
const VIEWS = {
  overview: (D) => { const k = innerWidth < innerHeight ? 2.05 : 1; return { pos: [D.W + 2.0 * k, D.H + 2.2 * k, D.L + 2.5 * k], tgt: [D.W * 0.47, 0.75, D.L * 0.47], fov: 40 }; },
  plan: (D) => ({ pos: [D.W / 2, Math.max(D.W, D.L) * (innerWidth < innerHeight ? 3.6 : 2.7), D.L / 2 + 0.001], tgt: [D.W / 2, 0, D.L / 2], fov: 38 }),
  throne: (D) => ({ inside: true, pos: [0.45, 1.13, 0.3], tgt: [0.95, 0.88, D.L], fov: 80 }),
  door: (D) => ({ inside: true, pos: [0.84, 1.6, D.L - 0.08], tgt: [0.98, 1.05, 0], fov: 76 }),
  mirror: (D, B) => ({ inside: true, pos: [1.15, 1.62, (B.vz ?? D.L - 0.4) - 0.26], tgt: [0, 1.28, (B.vz ?? D.L - 0.4) + 0.06], fov: 66 }),
};
function lookPoint() { const d = new V3(); camera.getWorldDirection(d); return camera.position.clone().addScaledVector(d, controls.target.distanceTo(camera.position) > 0.2 ? controls.target.distanceTo(camera.position) : 2); }
function setControlsFor(v, p1, t1) {
  if (v.inside) {
    const dir = t1.clone().sub(p1).normalize();
    controls.target.copy(p1).addScaledVector(dir, 0.04);
    Object.assign(controls, { minDistance: 0.04, maxDistance: 0.04, enableZoom: false, enablePan: false, rotateSpeed: -0.32, minPolarAngle: 0.25, maxPolarAngle: PI - 0.25, autoRotate: false });
  } else {
    controls.target.copy(t1);
    Object.assign(controls, { minDistance: 1.2, maxDistance: 16, enableZoom: true, enablePan: true, rotateSpeed: 0.8, minPolarAngle: 0, maxPolarAngle: PI * 0.495, autoRotate: state.spin });
  }
}
let flying = false;
function flyTo(key, dur = 1150) {
  state.view = key; updateDock();
  const v = VIEWS[key](state.D, cur());
  const p0 = camera.position.clone(), l0 = lookPoint(), f0 = camera.fov;
  const p1 = new V3(...v.pos), t1 = new V3(...v.tgt);
  controls.enabled = false; flying = true;
  return tween(k => {
    camera.position.lerpVectors(p0, p1, k);
    camera.lookAt(l0.clone().lerp(t1, k));
    camera.fov = lerp(f0, v.fov, k); camera.updateProjectionMatrix(); req();
  }, dur).then(() => { setControlsFor(v, p1, t1); controls.enabled = true; flying = false; controls.update(); req(); });
}
renderer.domElement.addEventListener('wheel', (e) => {
  if (!VIEWS[state.view](state.D, cur()).inside) return;
  e.preventDefault(); camera.fov = clamp(camera.fov + Math.sign(e.deltaY) * 3, 35, 95); camera.updateProjectionMatrix(); req();
}, { passive: false });
controls.addEventListener('change', () => req());
controls.addEventListener('start', () => { $('#hint').classList.add('gone'); });

/* ---------- Rendering ---------- */
let needs = 3;
function req(n = 2) { needs = Math.max(needs, n); }
function cutaway(B) {
  const c = camera.position, { W, L, H } = B.D, m = 0.01;
  B.walls.back.visible = c.z > -m; B.walls.front.visible = c.z < L + m;
  B.walls.left.visible = c.x > -m; B.walls.right.visible = c.x < W + m;
  B.ceil.visible = c.y < H - 0.02;
  for (const w of WALLS) B.clip[w].constant = B.walls[w].visible ? 1e4 : 1.15;
}
function viewport() {
  const w = stageEl.clientWidth, h = stageEl.clientHeight;
  return { w, h };
}
function layoutCamera() {
  const { w, h } = viewport();
  renderer.setSize(w, h, false);
  // freien Bereich (zwischen Kopf, Dock und Panel) als Bildmitte nutzen
  const top = $('.top').getBoundingClientRect().bottom + 8;
  const bottom = isMobile() ? $('#dock').getBoundingClientRect().top - 8 : h - 20;
  const right = isMobile() ? w : $('#panel').getBoundingClientRect().left - 8;
  const dx = Math.max(0, w / 2 - right / 2), dy = Math.max(0, h / 2 - (top + bottom) / 2);
  const fw = w + 2 * dx, fh = h + 2 * dy;
  camera.aspect = fw / fh;
  camera.setViewOffset(fw, fh, 2 * dx, 2 * dy, w, h);
  camera.updateProjectionMatrix(); req();
}
function render() {
  const B = cur(), { w, h } = viewport();
  if (state.compare && state.v !== 'bestand') {
    const A = getBuild('bestand'); cutaway(A); cutaway(B);
    const sx = Math.round(w * state.split);
    renderer.setScissorTest(true);
    renderer.setScissor(0, 0, sx, h); renderer.render(A.scene, camera);
    renderer.setScissor(sx, 0, w - sx, h); renderer.render(B.scene, camera);
    renderer.setScissorTest(false);
  } else { cutaway(B); renderer.render(B.scene, camera); }
}

/* ---------- DOM-Overlays ---------- */
const ovl = $('#overlay');
let hsEls = [], lblEls = [], frame = 0;
function syncOverlay() {
  ovl.innerHTML = ''; const B = cur();
  hsEls = B.hotspots.map(h => {
    const b = document.createElement('button'); b.className = 'hs ' + h.kind; b.textContent = h.n; b.setAttribute('aria-label', h.title);
    b.addEventListener('click', (e) => { e.stopPropagation(); openCard(h); });
    ovl.appendChild(b); return { h, el: b, occ: false };
  });
  const mk = (it, kind) => { const s = document.createElement('span'); s.className = 'lbl ' + it.cls; s.textContent = it.text; ovl.appendChild(s); return { it, el: s, kind }; };
  lblEls = [...B.dimLabels.map(it => mk(it, 'dim')), ...B.zoneLabels.map(it => mk(it, 'zone'))];
}
const tmpV = new V3();
function project(p) {
  tmpV.copy(p).project(camera); const { w, h } = viewport();
  return { x: (tmpV.x * 0.5 + 0.5) * w, y: (-tmpV.y * 0.5 + 0.5) * h, vis: tmpV.z < 1 && tmpV.z > -1 };
}
const occRay = new THREE.Raycaster();
function visibleDeep(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
function updateOverlay() {
  frame++;
  const B = cur(), showHot = state.hot && !state.compare;
  hsEls.forEach(o => {
    const p = project(o.h.pos);
    o.el.classList.toggle('off', !showHot || !p.vis);
    o.el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
    if (frame % 8 === 0 && showHot && p.vis) {
      const dir = o.h.pos.clone().sub(camera.position), dist = dir.length(); occRay.set(camera.position, dir.normalize()); occRay.far = dist;
      const hit = occRay.intersectObject(B.root, true).find(h => visibleDeep(h.object) && !(h.object.material && h.object.material.transparent));
      o.occ = !!hit && hit.distance < dist - 0.12;
    }
    o.el.classList.toggle('occ', o.occ);
    o.el.classList.toggle('on', state.card === o.h);
  });
  lblEls.forEach(o => {
    const show = (o.kind === 'dim' ? state.dims : state.zones) && !state.compare, p = project(o.it.pos);
    o.el.classList.toggle('off', !show || !p.vis);
    o.el.style.transform = `translate(calc(${p.x.toFixed(1)}px - 50%), calc(${p.y.toFixed(1)}px - 50%))`;
  });
  if (state.card) placeCard();
  if (state.compare) { const x = viewport().w * state.split; $('#splitLine').style.left = x + 'px'; $('#splitKnob').style.left = x + 'px'; $('#tagL').style.left = Math.max(8, x - 110) + 'px'; $('#tagR').style.left = (x + 12) + 'px'; }
}
const cardEl = $('#card');
function openCard(h) {
  state.card = h;
  cardEl.innerHTML = `<div class="eyebrow"><span>${h.kind === 'issue' ? 'Problem ' + h.n : h.kind === 'plus' ? 'Pluspunkt' : 'Idee ' + h.n}</span><button class="x" aria-label="Schließen">×</button></div><h5></h5><p></p>`;
  cardEl.querySelector('h5').textContent = h.title; cardEl.querySelector('p').textContent = h.text;
  cardEl.querySelector('.x').onclick = closeCard;
  cardEl.hidden = false;
  document.querySelectorAll('.hs-item').forEach(el => el.classList.toggle('on', el.dataset.n === String(h.n)));
  placeCard(); req();
}
function closeCard() { state.card = null; cardEl.hidden = true; document.querySelectorAll('.hs-item.on').forEach(el => el.classList.remove('on')); req(); }
function placeCard() {
  if (isMobile()) return;
  const p = project(state.card.pos), { w, h } = viewport(), cw = cardEl.offsetWidth, ch = cardEl.offsetHeight;
  const maxX = w - $('#panel').offsetWidth - 40 - cw;
  let x = p.x + 22, y = p.y - ch / 2;
  if (x > maxX) x = p.x - cw - 22;
  x = clamp(x, 16, Math.max(16, maxX)); y = clamp(y, 90, h - ch - 100);
  cardEl.style.transform = `translate(${x}px, ${y}px)`;
}

/* ---------- Tooltip & Klicks ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tip = $('#tip');
function pick(cx, cy) {
  const r = renderer.domElement.getBoundingClientRect(), x = cx - r.left, y = cy - r.top;
  ndc.set((x / r.width) * 2 - 1, -(y / r.height) * 2 + 1);
  const B = state.compare && state.v !== 'bestand' && x < r.width * state.split ? getBuild('bestand') : cur();
  ray.setFromCamera(ndc, camera);
  for (const h of ray.intersectObject(B.root, true)) {
    if (!visibleDeep(h.object)) continue;
    let o = h.object; while (o && !o.userData.name && !o.userData.click) o = o.parent;
    return o && o !== B.root ? o : null;
  }
  return null;
}
let down = null, lastMove = 0;
const cv = renderer.domElement;
cv.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
cv.addEventListener('pointerup', (e) => {
  if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null;
  if (moved > 6) return;
  const o = pick(e.clientX, e.clientY);
  if (o) { let c = o; while (c && !c.userData.click) c = c.parent; if (c) { c.userData.click(); req(); tip.hidden = true; return; } }
  if (state.card) closeCard();
});
cv.addEventListener('pointermove', (e) => {
  if (IS_TOUCH || e.buttons) { tip.hidden = true; return; }
  const now = performance.now(); if (now - lastMove < 60) return; lastMove = now;
  const o = pick(e.clientX, e.clientY);
  if (o && o.userData.name) {
    let c = o, clickable = false; while (c) { if (c.userData.click) { clickable = true; break; } c = c.parent; }
    tip.textContent = o.userData.name; tip.hidden = false;
    tip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 16}px)`; cv.style.cursor = clickable ? 'pointer' : 'default';
  } else { tip.hidden = true; cv.style.cursor = 'grab'; }
});
cv.addEventListener('pointerleave', () => { tip.hidden = true; });

/* ---------- Variante wechseln ---------- */
function dropIn(B) {
  if (REDUCED) return;
  const kids = B.furn.children.slice().sort((a, b) => a.userData.p0.y - b.userData.p0.y);
  kids.forEach((c, i) => {
    const p = c.userData.p0; c.position.y = p.y + 1.4;
    tween(k => { c.position.y = p.y + (1 - k) * 1.4; }, 620, ease.out, i * 14);
  });
}
function setVariant(key, { anim = true, fly = false } = {}) {
  if (state.compare && key === 'bestand') toggleCompare(false);
  state.v = key; document.body.dataset.variant = key;
  const B = getBuild(key); applyLightMode(B, state.light);
  B.zoneG.visible = state.zones; B.dimG.visible = state.dims;
  closeCard(); renderTabs(); renderPanel(); syncOverlay();
  if (anim) dropIn(B);
  const V = VARIANTS.find(v => v.key === key);
  try { if (location.hash.slice(1) !== V.hash) history.replaceState(null, '', '#' + V.hash); } catch (e) { /* Hash nicht verfügbar */ }
  $('#tCompare').disabled = key === 'bestand';
  if (fly || (VIEWS[state.view](state.D, B).inside && state.view === 'mirror')) flyTo(state.view, 700);
  req(4);
}

/* ---------- UI: Tabs ---------- */
function swatchHTML(sw) {
  return `<span class="sw" style="background:${sw[0]}"><i style="left:50%;top:0;right:0;bottom:50%;background:${sw[1]}"></i><i style="left:0;top:50%;right:50%;bottom:0;background:${sw[2]}"></i></span>`;
}
function renderTabs() {
  $('#tabs').innerHTML = VARIANTS.map((v, i) => `<button class="tab" role="tab" data-v="${v.key}" aria-selected="${state.v === v.key}">${swatchHTML(v.sw)}<span><b>${v.label} <kbd>${i + 1}</kbd></b><small>${v.sub}</small></span></button>`).join('');
  $('#tabs').querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => setVariant(b.dataset.v)));
  const tb = $('#tabs'), act = tb.querySelector('[aria-selected="true"]');
  if (act && tb.scrollWidth > tb.clientWidth) tb.scrollLeft = act.offsetLeft - (tb.clientWidth - act.offsetWidth) / 2;
}

/* ---------- UI: Datenblatt ---------- */
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function renderPanel() {
  const V = VARIANTS.find(v => v.key === state.v), I = V.info, B = cur(), B0 = getBuild('bestand');
  const dF = B.free - B0.free, s0 = VARIANTS[0].info.storage;
  const kp = [
    ['Budget', I.budget ? '≈ ' + eur(I.budget) : 'Status quo', I.budget ? 'Richtwert inkl. MwSt.' : 'nichts investiert', false],
    ['Aufwand', I.effort, V.key === 'bestand' ? '' : 'Bauzeit', true],
    ['Stauraum', '≈ ' + I.storage + ' L', V.key === 'bestand' ? 'geschätzt' : '+' + Math.round((I.storage / s0 - 1) * 100) + ' % ggü. heute', false, V.key !== 'bestand'],
    ['Freie Lauffläche', m2(B.free), V.key === 'bestand' ? 'von ' + m2(B.D.W * B.D.L) : (dF >= 0 ? '+' : '−') + NF.format(Math.abs(dF)) + ' m² ggü. heute', false, dF > 0.01],
  ];
  const hs = B.hotspots;
  const list = `<ol class="hs-list">${hs.map(h => `<li><button class="hs-item ${h.kind}" data-n="${esc(h.n)}"><span class="n">${esc(h.n)}</span><span><strong>${esc(h.title)}</strong><small>${esc(h.text)}</small></span></button></li>`).join('')}</ol>`;
  let html = `<div class="p-head"><div class="eyebrow">${esc(I.eyebrow)}</div><h2>${esc(I.title)}</h2><p class="pitch">${esc(I.pitch)}</p>${I.tenant ? `<span class="pill ${I.tenant.ok ? 'ok' : 'no'}">${esc(I.tenant.text)}</span>` : ''}</div>`;
  html += `<div class="kpis">${kp.map(([l, v, s, small, up]) => `<div class="kpi"><span>${l}</span><b class="${small ? 'sm' : ''}">${esc(v)}</b>${s ? `<em class="${up ? 'up' : ''}">${esc(s)}</em>` : ''}</div>`).join('')}</div>`;
  if (V.key === 'bestand') {
    html += `<section class="sec"><h3><span>Was nervt</span><span>${hs.filter(h => h.kind === 'issue').length} Punkte</span></h3>${list}</section>`;
    html += `<section class="sec"><h3>Was gut ist</h3><ul class="good">${I.good.map(g => `<li>${esc(g)}</li>`).join('')}</ul></section>`;
    html += `<section class="sec"><h3>Weiter</h3><div class="compare-cta">${VARIANTS.slice(1).map(v => `<button class="btn" data-go="${v.key}">${swatchHTML(v.sw).replace('class="sw"', 'class="sw" style="width:16px;height:16px;border-radius:4px;position:relative;overflow:hidden;display:inline-block;background:' + v.sw[0] + '"')}${esc(v.label)}</button>`).join('')}</div></section>`;
  } else {
    const max = Math.max(...VARIANTS.filter(v => v.info.budget).map(v => v.info.budget));
    html += `<section class="sec"><h3><span>Was sich ändert</span><span>${hs.length} Ideen</span></h3>${list}</section>`;
    html += `<section class="sec"><h3><span>Kostenrahmen</span><span>${eur(I.budget)}</span></h3><div class="bar"><i style="width:${(I.budget / max * 100).toFixed(1)}%"></i></div><table class="costs"><tbody>${I.costs.map(([t, p]) => `<tr><td>${esc(t)}</td><td>${eur(p)}</td></tr>`).join('')}</tbody><tfoot><tr><td>Summe</td><td>${eur(I.budget)}</td></tr></tfoot></table><p class="fine">Richtwerte inkl. MwSt., Stand 2026. Vor dem Kauf echte Angebote einholen; Maße vor Ort nachmessen.</p></section>`;
    html += `<section class="sec"><h3>Vorher / Nachher</h3><div class="compare-cta"><button class="btn" id="ctaCompare"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 2v20"/></svg>Mit Bestand vergleichen</button></div></section>`;
  }
  html += `<section class="sec"><h3>Material &amp; Farbe</h3><div class="swatches">${I.palette.map(([n, c]) => `<div class="swatch"><i style="background:${c}"></i><span>${esc(n)}</span></div>`).join('')}</div></section>`;
  html += `<p class="fine">Modell aus 13 Handyfotos rekonstruiert, Maße geschätzt (anpassbar unter „Raummaß“). DIN-Flächen nach DIN 18022 als Orientierung.</p>`;
  $('#panelBody').innerHTML = html;
  $('#panelBody').querySelectorAll('.hs-item').forEach(el => el.addEventListener('click', () => { const h = hs.find(x => String(x.n) === el.dataset.n); if (h) openCard(h); if (isMobile()) setSheet(false); }));
  $('#panelBody').querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => setVariant(el.dataset.go)));
  const cc = $('#ctaCompare'); if (cc) cc.addEventListener('click', () => toggleCompare(true));
}

/* ---------- UI: Dock ---------- */
function updateDock() {
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
  $('#tLight').setAttribute('aria-pressed', String(state.light === 'night')); $('#tLight span').textContent = state.light === 'night' ? 'Tag' : 'Abend';
  $('#tLight svg').innerHTML = state.light === 'night' ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' : '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>';
  $('#tCompare').setAttribute('aria-pressed', String(state.compare));
  $('#tDims').setAttribute('aria-pressed', String(state.dims)); $('#tZones').setAttribute('aria-pressed', String(state.zones));
  $('#tHot').setAttribute('aria-pressed', String(state.hot)); $('#tSpin').setAttribute('aria-pressed', String(state.spin));
  $('#tRoom').setAttribute('aria-pressed', String(!$('#roomPop').hidden));
}
document.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => { if (b.dataset.view !== 'overview') setSpin(false); flyTo(b.dataset.view); }));
function setLight(mode) {
  state.light = mode; document.body.dataset.light = mode;
  for (const B of builds.values()) applyLightMode(B, mode);
  renderer.toneMappingExposure = mode === 'night' ? 1.15 : 1.05;
  updateDock(); req(3);
}
$('#tLight').addEventListener('click', () => setLight(state.light === 'night' ? 'day' : 'night'));
function toggleCompare(on = !state.compare) {
  if (on && state.v === 'bestand') return;
  state.compare = on; $('#split').hidden = !on;
  if (on) { getBuild('bestand'); applyLightMode(getBuild('bestand'), state.light); $('#tagR').textContent = VARIANTS.find(v => v.key === state.v).label; closeCard(); }
  updateDock(); req(3);
}
$('#tCompare').addEventListener('click', () => toggleCompare());
$('#tDims').addEventListener('click', () => { state.dims = !state.dims; for (const B of builds.values()) B.dimG.visible = state.dims; updateDock(); req(); });
$('#tZones').addEventListener('click', () => { state.zones = !state.zones; for (const B of builds.values()) B.zoneG.visible = state.zones; if (state.zones && state.view !== 'plan' && state.view !== 'overview') flyTo('overview'); updateDock(); req(); });
$('#tHot').addEventListener('click', () => { state.hot = !state.hot; if (!state.hot) closeCard(); updateDock(); req(); });
function setSpin(on) { state.spin = on; controls.autoRotate = on && !VIEWS[state.view](state.D, cur()).inside; updateDock(); req(); }
$('#tSpin').addEventListener('click', () => { const on = !state.spin; if (on && state.view !== 'overview') flyTo('overview').then(() => setSpin(true)); else setSpin(on); });
$('#tRoom').addEventListener('click', () => { $('#roomPop').hidden = !$('#roomPop').hidden; updateDock(); });
$('#roomClose').addEventListener('click', () => { $('#roomPop').hidden = true; updateDock(); });

/* ---------- Vergleich: Teiler ---------- */
(() => {
  const knob = $('#splitKnob'); let drag = false;
  knob.addEventListener('pointerdown', (e) => { drag = true; knob.setPointerCapture(e.pointerId); });
  knob.addEventListener('pointermove', (e) => { if (!drag) return; const r = stageEl.getBoundingClientRect(); state.split = clamp((e.clientX - r.left) / r.width, 0.05, 0.95); req(); });
  knob.addEventListener('pointerup', () => { drag = false; });
  knob.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') state.split = clamp(state.split - 0.03, 0.05, 0.95); if (e.key === 'ArrowRight') state.split = clamp(state.split + 0.03, 0.05, 0.95); req(); });
})();

/* ---------- Raummaße ---------- */
function roomMeta() { const { W, L, H } = state.D; $('#roomMeta').textContent = `${NF.format(W)} × ${NF.format(L)} m · ${NF.format(W * L)} m² · Höhe ${NF.format(H)} m`; }
let rebuildT = null;
function setDims(D) {
  state.D = { ...D }; roomMeta();
  for (const k of ['W', 'L', 'H']) { $('#in' + k).value = D[k]; $('#out' + k).textContent = NF.format(D[k]) + ' m'; }
  clearTimeout(rebuildT);
  rebuildT = setTimeout(() => { disposeAll(); setVariant(state.v, { anim: false }); if (state.compare) toggleCompare(true); flyTo(state.view, 500); }, 220);
}
['W', 'L', 'H'].forEach(k => $('#in' + k).addEventListener('input', (e) => setDims({ ...state.D, [k]: parseFloat(e.target.value) })));
$('#roomReset').addEventListener('click', () => setDims(DEF_D));

/* ---------- Bottom-Sheet (mobil) ---------- */
function setSheet(open) { document.body.classList.toggle('sheet-open', open); $('#sheetHandle').setAttribute('aria-expanded', String(open)); setTimeout(layoutCamera, 380); }
$('#sheetHandle').addEventListener('click', () => setSheet(!document.body.classList.contains('sheet-open')));
$('#panel').addEventListener('click', (e) => { if (isMobile() && !document.body.classList.contains('sheet-open') && !e.target.closest('button')) setSheet(true); });

/* ---------- Tastatur ---------- */
addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return;
  const n = parseInt(e.key, 10); if (n >= 1 && n <= VARIANTS.length) setVariant(VARIANTS[n - 1].key);
  if (e.key === 'l' || e.key === 'L') setLight(state.light === 'night' ? 'day' : 'night');
  if (e.key === 'v' || e.key === 'V') toggleCompare();
  if (e.key === 'Escape') { closeCard(); $('#roomPop').hidden = true; updateDock(); }
});
addEventListener('hashchange', () => { const v = VARIANTS.find(v => v.hash === location.hash.slice(1)); if (v && v.key !== state.v) setVariant(v.key); });
addEventListener('resize', () => { layoutCamera(); });

/* ---------- Loop & Start ---------- */
function loop(now) {
  requestAnimationFrame(loop);
  const tw = stepTweens(now);
  const ch = controls.enabled ? controls.update() : false;
  if (tw || ch || (controls.autoRotate && controls.enabled)) needs = Math.max(needs, 1);
  if (needs <= 0) return;
  needs--;
  render(); updateOverlay();
}
function start() {
  const fromHash = VARIANTS.find(v => v.hash === location.hash.slice(1));
  state.v = fromHash ? fromHash.key : 'bestand';
  document.body.dataset.variant = state.v; document.body.dataset.light = state.light;
  roomMeta(); renderTabs();
  getBuild('bestand'); setVariant(state.v, { anim: false });
  layoutCamera();
  const v = VIEWS.overview(state.D);
  camera.position.set(v.pos[0] + 2.5, v.pos[1] + 1.8, v.pos[2] + 1.2); camera.fov = v.fov; camera.lookAt(...v.tgt);
  setControlsFor(v, new V3(...v.pos), new V3(...v.tgt));
  updateDock();
  requestAnimationFrame(loop);
  requestAnimationFrame(() => { $('#loader').classList.add('done'); setTimeout(() => { $('#loader').hidden = true; }, 600); dropIn(cur()); flyTo('overview', 1600); });
  setTimeout(() => $('#hint').classList.add('gone'), 7000);
}
window.__bad = { builds, state, VARIANTS, setVariant, flyTo, setLight, toggleCompare, camera, controls };
start();
