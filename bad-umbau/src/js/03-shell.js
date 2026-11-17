/* =====================================================================
   RAUM-SHELL, BUILDER, LICHT, TWEENS
   ===================================================================== */
const WALLS = ['back', 'front', 'left', 'right'];

/* ---------- Tweens & Toggles ---------- */
const tweens = new Set();
const ease = {
  inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: t => 1 - Math.pow(1 - t, 3),
  back: t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
};
function tween(fn, dur, e = ease.inOut, delay = 0) {
  return new Promise(res => tweens.add({ t0: performance.now() + delay, dur: REDUCED ? 1 : dur, fn, e, res }));
}
function stepTweens(now) {
  let active = false;
  for (const tw of tweens) {
    const k = clamp((now - tw.t0) / tw.dur, 0, 1);
    if (now < tw.t0) { active = true; continue; }
    tw.fn(tw.e(k)); active = true;
    if (k >= 1) { tweens.delete(tw); tw.res(); }
  }
  return active;
}
function setPath(obj, path, v) { const ks = path.split('.'); let o = obj; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = v; }
function toggle(obj, key, { prop, a, b, dur = 700, fn }) {
  const st = obj.userData;
  const open = !st['open_' + key];
  st['open_' + key] = open;
  const from = st['val_' + key] ?? a, to = open ? b : a;
  return tween(k => { const v = lerp(from, to, k); st['val_' + key] = v; if (fn) fn(v); else setPath(obj, prop, v); }, dur);
}

/* ---------- Builder ---------- */
class Build {
  constructor(key, D) {
    this.key = key; this.D = D; this.T = 0.14;
    this.scene = new THREE.Scene(); this.scene.environment = ENV;
    this.root = new THREE.Group(); this.scene.add(this.root);
    this.walls = {}; WALLS.forEach(w => { this.walls[w] = new THREE.Group(); this.walls[w].userData.wall = w; this.root.add(this.walls[w]); });
    this.ceil = new THREE.Group(); this.root.add(this.ceil);
    this.base = new THREE.Group(); this.root.add(this.base);
    this.furn = new THREE.Group(); this.root.add(this.furn);
    this.clip = {}; WALLS.forEach(w => { this.clip[w] = new THREE.Plane(new V3(0, -1, 0), 1e4); });
    this.tall = [];
    this.hotspots = []; this.zones = []; this.dims = []; this.feet = []; this.mirrors = []; this.leds = []; this.accent = []; this.frosted = [];
    this.door = { a0: 0.4, a1: 1.28, h: 2.01 };
    this.win = { a0: D.W - 1.0, a1: D.W - 0.4, v0: 1.05, v1: 1.95 };
  }
  // Wand-Montage: along = Weltkoordinate entlang Wand (x bei back/front, z bei left/right)
  mount(o, wall, along, v, d = 0) {
    const { W, L } = this.D;
    const pos = { back: [along, v, d], front: [along, v, L - d], left: [d, v, along], right: [W - d, v, along] }[wall];
    o.position.set(...pos);
    o.rotation.y = { back: 0, front: PI, left: PI / 2, right: -PI / 2 }[wall];
    return o;
  }
  add(o, { wall = null, ceil = false, base = false, name, info, click, tall } = {}) {
    if (tall) this.tall.push([o, tall]);
    if (name) o.userData.name = name;
    if (info) o.userData.info = info;
    if (click) o.userData.click = click;
    (wall ? this.walls[wall] : ceil ? this.ceil : base ? this.base : this.furn).add(o);
    return o;
  }
  foot(x0, z0, x1, z1, label) { this.feet.push({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), label }); }
  hot(n, pos, title, text, kind = 'feature') { this.hotspots.push({ n, pos: new V3(...pos), title, text, kind }); }
  zone(label, x0, z0, x1, z1) { this.zones.push({ label, x0, z0, x1, z1 }); }
  dim(a, b, label, side = 'out') { this.dims.push({ a: new V3(...a), b: new V3(...b), label, side }); }
  led(o, light) { o.traverse(c => { if (c.isMesh) c.userData.led = true; }); this.leds.push(o); if (light) { this.accent.push(light); this.scene.add(light); } }
}

/* ---------- Wände ---------- */
function subtractRect(r, h) {
  if (h.a1 <= r.a0 || h.a0 >= r.a1 || h.v1 <= r.v0 || h.v0 >= r.v1) return [r];
  const out = [];
  if (h.a0 > r.a0) out.push({ ...r, a1: h.a0 });
  if (h.a1 < r.a1) out.push({ ...r, a0: h.a1 });
  const ma0 = Math.max(r.a0, h.a0), ma1 = Math.min(r.a1, h.a1);
  if (h.v0 > r.v0) out.push({ ...r, a0: ma0, a1: ma1, v1: h.v0 });
  if (h.v1 < r.v1) out.push({ ...r, a0: ma0, a1: ma1, v0: h.v1 });
  return out;
}
function wallFrame(id, D) {
  const { W, L } = D;
  return {
    back: { len: W, n: new V3(0, 0, 1), p: (a, v, d = 0) => new V3(a, v, d) },
    front: { len: W, n: new V3(0, 0, -1), p: (a, v, d = 0) => new V3(a, v, L - d) },
    left: { len: L, n: new V3(1, 0, 0), p: (a, v, d = 0) => new V3(d, v, a) },
    right: { len: L, n: new V3(-1, 0, 0), p: (a, v, d = 0) => new V3(W - d, v, a) },
  }[id];
}
function wallSurface(B, id, piece, m) {
  const f = wallFrame(id, B.D), e = 0.0006;
  const P = [f.p(piece.a0, piece.v0, e), f.p(piece.a1, piece.v0, e), f.p(piece.a1, piece.v1, e), f.p(piece.a0, piece.v1, e)];
  const UV = [[piece.a0, piece.v0], [piece.a1, piece.v0], [piece.a1, piece.v1], [piece.a0, piece.v1]].map(([u, v]) => [u + (piece.uo || 0), v + (piece.vo || 0)]);
  return mesh(quadGeo(P, UV, f.n), m, { cast: false });
}
function wallBody(B, id, r, mats) {
  const { W, L, H } = B.D, T = B.T;
  let a0 = r.a0, a1 = r.a1;
  if (id === 'back' || id === 'front') { if (a0 <= 1e-4) a0 = -T; if (a1 >= W - 1e-4) a1 = W + T; }
  const topM = r.v1 >= H - 1e-4 ? mats.cut : mats.reveal;
  const m = [mats.reveal, mats.reveal, topM, mats.reveal, mats.reveal, mats.reveal];
  const h = r.v1 - r.v0, cy = (r.v0 + r.v1) / 2;
  let o;
  if (id === 'back' || id === 'front') { o = new THREE.Mesh(new THREE.BoxGeometry(a1 - a0, h, T), m); o.position.set((a0 + a1) / 2, cy, id === 'back' ? -T / 2 : L + T / 2); }
  else { o = new THREE.Mesh(new THREE.BoxGeometry(T, h, a1 - a0), m); o.position.set(id === 'left' ? -T / 2 : W + T / 2, cy, (a0 + a1) / 2); }
  o.castShadow = true; o.receiveShadow = true;
  return o;
}
function nicheRecess(B, id, op, m, ledColor = '#ffe2b8') {
  const f = wallFrame(id, B.D), dp = op.depth || 0.09, g = new THREE.Group();
  const P = (a, v, d) => f.p(a, v, d);
  const faces = [
    [[P(op.a0, op.v0, -dp), P(op.a1, op.v0, -dp), P(op.a1, op.v1, -dp), P(op.a0, op.v1, -dp)], f.n.clone()],
    [[P(op.a0, op.v0, 0), P(op.a1, op.v0, 0), P(op.a1, op.v0, -dp), P(op.a0, op.v0, -dp)], new V3(0, 1, 0)],
    [[P(op.a0, op.v1, -dp), P(op.a1, op.v1, -dp), P(op.a1, op.v1, 0), P(op.a0, op.v1, 0)], new V3(0, -1, 0)],
  ];
  const along = f.p(1, 0, 0).sub(f.p(0, 0, 0)).normalize();
  faces.push([[P(op.a0, op.v0, -dp), P(op.a0, op.v1, -dp), P(op.a0, op.v1, 0), P(op.a0, op.v0, 0)], along.clone()]);
  faces.push([[P(op.a1, op.v0, 0), P(op.a1, op.v1, 0), P(op.a1, op.v1, -dp), P(op.a1, op.v0, -dp)], along.clone().negate()]);
  faces.forEach(([pts, n]) => {
    const uv = pts.map(p => { const a = id === 'left' || id === 'right' ? p.z : p.x; return [a + p.y * 0.0 + (Math.abs(n.y) > 0.5 ? 0 : 0), p.y + (Math.abs(n.y) > 0.5 ? (id === 'left' || id === 'right' ? p.x : p.z) : 0)]; });
    g.add(mesh(quadGeo(pts, uv, n), m, { cast: false }));
  });
  // LED-Streifen oben
  const mid = P((op.a0 + op.a1) / 2, op.v1 - 0.008, -dp * 0.35);
  const led = box(Math.abs(op.a1 - op.a0) - 0.02, 0.006, 0.012, M.lamp(ledColor, 2.6, 0.1), { cast: false });
  led.position.copy(mid); led.rotation.y = { back: 0, front: PI, left: PI / 2, right: -PI / 2 }[id];
  g.add(led);
  const pl = new THREE.PointLight(ledColor, 0.0, 0.9, 2); pl.position.copy(P((op.a0 + op.a1) / 2, op.v1 - 0.04, -dp * 0.2)); pl.userData.on = 0.35;
  B.led(led, pl);
  return g;
}
// spec: walls(id,len) → [{a0,a1,v0,v1,mat,uo,vo}], floor, ceiling, reveal, niches[], skirting{mat,h}
function buildShell(B, spec) {
  const { W, L, H } = B.D, T = B.T;
  const ops = { back: [], front: [], left: [], right: [] };
  ops.front.push({ a0: B.door.a0, a1: B.door.a1, v0: 0, v1: B.door.h, kind: 'door' });
  ops.back.push({ a0: B.win.a0, a1: B.win.a1, v0: B.win.v0, v1: B.win.v1, kind: 'window' });
  (spec.niches || []).forEach(n => ops[n.wall].push({ ...n, kind: 'niche' }));
  const reveal = spec.reveal || M.plaster();
  for (const id of WALLS) {
    const f = wallFrame(id, B.D);
    let pieces = spec.walls(id, f.len, H);
    for (const op of ops[id]) pieces = pieces.flatMap(p => subtractRect(p, op));
    pieces.forEach(p => { if (p.a1 - p.a0 > 1e-4 && p.v1 - p.v0 > 1e-4) B.walls[id].add(wallSurface(B, id, p, p.mat)); });
    let body = [{ a0: 0, a1: f.len, v0: 0, v1: H }];
    for (const op of ops[id]) body = body.flatMap(p => subtractRect(p, op));
    body.forEach(p => B.walls[id].add(wallBody(B, id, p, { cut: M.cut(), reveal })));
    for (const op of ops[id]) if (op.kind === 'niche') B.walls[id].add(nicheRecess(B, id, op, op.mat || reveal));
    if (spec.skirting) {
      let sk = [{ a0: 0, a1: f.len, v0: 0, v1: spec.skirting.h }];
      for (const op of ops[id]) if (op.kind === 'door') sk = sk.flatMap(p => subtractRect(p, { ...op, v1: 1 }));
      sk.forEach(p => {
        const q = wallFrame(id, B.D), a = q.p(p.a0, 0, 0), b = q.p(p.a1, spec.skirting.h, 0.009);
        B.walls[id].add(slabW(Math.min(a.x, b.x), 0, Math.min(a.z, b.z), Math.max(a.x, b.x), spec.skirting.h, Math.max(a.z, b.z), spec.skirting.mat));
      });
    }
  }
  // Boden
  const fl = mesh(quadGeo([new V3(0, 0, 0), new V3(W, 0, 0), new V3(W, 0, L), new V3(0, 0, L)], [[0, 0], [W, 0], [W, L], [0, L]], new V3(0, 1, 0)), spec.floor, { cast: false });
  B.base.add(fl);
  B.base.add(slab(-T, -0.1, -T, W + T, -0.0015, L + T, mat('plinth', () => std({ color: 0x737c77, roughness: 0.9, envMapIntensity: 0.3 })), { cast: false }));
  // Türschwelle
  B.base.add(slab(B.door.a0, 0, L, B.door.a1, 0.004, L + T, spec.threshold || M.cut()));
  // Kontaktschatten unter Modell
  const sh = mesh(new THREE.PlaneGeometry(W + 3.2, L + 3.2), new THREE.MeshBasicMaterial({ map: radialTex('shadow', 'rgba(0,0,0,0.38)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }), { cast: false, recv: false });
  sh.rotation.x = -PI / 2; sh.position.set(W / 2, -0.102, L / 2); B.base.add(sh);
  // Kanten-AO am Boden
  const aoM = mat('aoFloor', () => new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: edgeAOTex(), transparent: true, opacity: 0.32, depthWrite: false }));
  const ao = (x, z, w, d, rot) => { const p = mesh(new THREE.PlaneGeometry(w, d), aoM, { cast: false, recv: false }); p.rotation.set(-PI / 2, 0, rot); p.position.set(x, 0.0012, z); B.base.add(p); };
  const s = 0.16;
  ao(W / 2, s / 2, W, s, PI); ao(W / 2, L - s / 2, W, s, 0); ao(s / 2, L / 2, L, s, -PI / 2); ao(W - s / 2, L / 2, L, s, PI / 2);
  // Decke
  B.ceil.add(mesh(quadGeo([new V3(0, H, 0), new V3(W, H, 0), new V3(W, H, L), new V3(0, H, L)], [[0, 0], [W, 0], [W, L], [0, L]], new V3(0, -1, 0)), spec.ceiling || M.plaster('#f4f3ef'), { cast: false }));
  B.ceil.add(slab(-T, H + 0.003, -T, W + T, H + 0.14, L + T, M.cut(), { cast: false }));
  // Tür + Fenster
  B.add(doorUnit(B, { ...B.door, ...(spec.door || {}) }), { wall: 'front' });
  const wu = windowUnit(B, { ...B.win, ...(spec.window || {}) }); B.add(wu, { wall: 'back' });
  wu.traverse(c => { if (c.userData.frosted) B.frosted.push(c); });
}

/* ---------- Licht ---------- */
function addLights(B, o = {}) {
  const { W, L, H } = B.D, s = B.scene;
  B.hemi = new THREE.HemisphereLight(0xffffff, 0xd9d0c4, 0.55); s.add(B.hemi);
  B.main = new THREE.PointLight(o.mainColor || 0xfff0dc, 5.5, 0, 2);
  B.main.position.set(o.mainX ?? W / 2, H - 0.18, o.mainZ ?? L / 2);
  B.main.castShadow = true; B.main.shadow.mapSize.set(LOWQ ? 512 : 1024, LOWQ ? 512 : 1024);
  B.main.shadow.bias = -0.002; B.main.shadow.normalBias = 0.025; B.main.shadow.radius = 3; B.main.shadow.camera.near = 0.05; B.main.shadow.camera.far = 8;
  s.add(B.main);
  const { a0, a1, v0, v1 } = B.win;
  B.winLight = new THREE.RectAreaLight(0xe6efff, 7, a1 - a0 - 0.1, v1 - v0 - 0.1);
  B.winLight.position.set((a0 + a1) / 2, (v0 + v1) / 2, 0.02); B.winLight.lookAt((a0 + a1) / 2, (v0 + v1) / 2, 2);
  s.add(B.winLight);
  // weiches Fülllicht von oben (für Draufsicht/Dollhouse)
  B.fill = new THREE.DirectionalLight(0xfff7ee, 0.6); B.fill.position.set(W * 0.3, 6, L * 0.8); B.fill.target.position.set(W / 2, 0, L / 2); s.add(B.fill, B.fill.target);
}
function applyLightMode(B, mode) {
  const night = mode === 'night';
  B.hemi.intensity = night ? 0.06 : 0.5;
  B.main.intensity = night ? 2.2 : 3.6;
  B.main.color.set(night ? 0xffd9a8 : 0xfff3e4);
  B.winLight.intensity = night ? 0 : 8;
  B.fill.intensity = night ? 0.03 : 0.55;
  B.accent.forEach(l => { l.intensity = night ? (l.userData.on ?? 1) : (l.userData.day ?? 0); });
  B.frosted.forEach(c => { c.material.emissive.set(night ? 0x1b2433 : 0xdde8f2); c.material.emissiveIntensity = night ? 0.25 : 1.0; });
  MIRROR_BG.set(night ? 0x3a3f45 : 0xd3d5d0);
  const envF = night ? 0.22 : 1;
  B.scene.traverse(c => {
    if (!c.isMesh) return;
    const ms = Array.isArray(c.material) ? c.material : [c.material];
    ms.forEach(m => { if (m && 'envMapIntensity' in m) m.envMapIntensity = (m.userData.env ?? 1) * envF; if (m && m.userData && m.userData.lampOn !== undefined) m.emissiveIntensity = night ? m.userData.lampOn : m.userData.lampOff; });
  });
}

function prepareTall(B) { // hohe Möbel an einer ausgeblendeten Wand werden auf 1,15 m geschnitten
  for (const [o, w] of B.tall) o.traverse(c => {
    if (!c.isMesh || !c.material || c.material.isShaderMaterial) return;
    const cl = (m) => { const n = m.clone(); n.clippingPlanes = [B.clip[w]]; n.clipShadows = true; n.userData = { ...m.userData }; return n; };
    c.material = Array.isArray(c.material) ? c.material.map(cl) : cl(c.material);
  });
}

/* ---------- Freie Fläche (Raster) ---------- */
function freeArea(B) {
  const { W, L } = B.D, st = 0.02; let free = 0;
  for (let x = st / 2; x < W; x += st) for (let z = st / 2; z < L; z += st) {
    if (!B.feet.some(f => x >= f.x0 && x <= f.x1 && z >= f.z0 && z <= f.z1)) free++;
  }
  return free * st * st;
}
function zoneState(B, z) {
  const ov = B.feet.some(f => Math.min(f.x1, z.x1) - Math.max(f.x0, z.x0) > 0.03 && Math.min(f.z1, z.z1) - Math.max(f.z0, z.z0) > 0.03);
  return ov ? 'warn' : 'ok';
}
