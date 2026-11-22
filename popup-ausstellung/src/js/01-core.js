import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* =====================================================================
   CORE: Hilfen, Renderer, Texturen, Geometrie-Bausteine
   Koordinaten (Meter): x = Breite, 0 = linke Außenwand (Naturstein), W = Brandmauer rechts
                        z = Tiefe,  0 = Rückwand, zG = Glas der langen Fensterfront
                        y = Höhe
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const V3 = THREE.Vector3, PI = Math.PI;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const de = (n, d = 2) => Number(n).toFixed(d).replace('.', ',');
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Renderer ---------- */
const stageEl = $('#stage'), canvas = $('#gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  $('#nogl').hidden = false;
  window.__noGL = true;
}
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);
let controls = null;
let dirty = 3, shadowDirty = true;
const invalidate = (n = 2) => { dirty = Math.max(dirty, n); };
const touch = () => { shadowDirty = true; invalidate(3); };            // etwas hat sich bewegt: Schatten neu rechnen
const COARSE = matchMedia('(pointer: coarse)').matches;
let composer = null;
if (renderer) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.09;
  controls.maxPolarAngle = PI / 2 - 0.03; controls.minDistance = 1.5; controls.maxDistance = 140;
  controls.addEventListener('change', () => invalidate());
  /* Umgebungsverdeckung (weiche Kontaktschatten) – nur auf Geräten mit Maus, sonst zu teuer */
  if (!COARSE) try {
    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));
    composer.addPass(new RenderPass(scene, camera));
    const ao = new GTAOPass(scene, camera, 4, 4);
    ao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 1.6, thickness: 1.3, scale: 1.25, samples: 16 });
    ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 16 });
    ao.blendIntensity = 0.85;
    const hide = ao.overrideVisibility.bind(ao);
    ao.overrideVisibility = () => { hide(); scene.traverse(o => { if (o.userData.noAO) o.visible = false; }); };   // Glas wirft keine Verdeckung
    composer.addPass(ao); composer.addPass(new OutputPass());
  } catch (e) { composer = null; }
}
/* Hintergrund als Verlauf in den Farben der Seite; folgt dem hellen und dunklen Design */
function updateBg() {
  const cs = getComputedStyle(document.documentElement), a = cs.getPropertyValue('--stage-a').trim() || '#f7f6fa', b = cs.getPropertyValue('--stage-b').trim() || '#dcd8e4';
  if (scene.background) scene.background.dispose();
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  scene.background = new THREE.CanvasTexture(c); scene.background.colorSpace = THREE.SRGBColorSpace; invalidate(3);
}
updateBg();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateBg);
new MutationObserver(updateBg).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
const hemi = new THREE.HemisphereLight(0xffffff, 0xcfc6ba, 0.62); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.5);
sun.position.set(-3, 15, 17); sun.target.position.set(9.5, 0, 5);
sun.castShadow = true; sun.shadow.mapSize.set(COARSE ? 2048 : 4096, COARSE ? 2048 : 4096); sun.shadow.radius = 3; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 12, bottom: -12, near: 1, far: 50 });
scene.add(sun, sun.target);

/* ---------- Schrift für Canvas-Texturen abwarten ---------- */
const FD = "'Unbounded', 'Arial Black', sans-serif", FB = "'Figtree', system-ui, sans-serif";
try {
  await Promise.race([
    Promise.all([document.fonts.load("700 40px Unbounded"), document.fonts.load("600 30px Figtree")]),
    new Promise(r => setTimeout(r, 1800)),
  ]);
} catch (e) { /* Ersatzschrift genügt */ }

/* ---------- Materialien & Texturen ---------- */
const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o });
function ctex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
/* Text mit Umbruch, vertikal um cy zentriert; gibt die Blockhöhe zurück */
function wrapText(g, text, cx, cy, maxW, size, font, weight = 700, lh = 1.15) {
  g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const lines = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    lines.push(line);
  }
  const H = lines.length * size * lh;
  lines.forEach((l, i) => g.fillText(l, cx, cy - H / 2 + (i + 0.5) * size * lh));
  return H;
}
const C = { orange: '#f2690d', lila: '#7b3fa0', pink: '#d9457e', gelb: '#f5b70a', braun: '#6b4226', creme: '#f3ead7', teak: '#a06b3c', oliv: '#7d8a2e', tuerkis: '#1d9aa6', weiss: '#f5f3ef', dunkel: '#2b2533', tief: '#5f2b84', tinte: '#3b1d57' };

const TEX = {
  holz: ctex(1024, 1024, (g, w, h) => {
    const r = rng(7); g.fillStyle = '#c8a678'; g.fillRect(0, 0, w, h);
    const ph = h / 8;
    for (let i = 0; i < 8; i++) {
      let x = -r() * 400;
      while (x < w) {
        const len = 380 + r() * 300, l = 62 + r() * 12;
        g.fillStyle = `hsl(${30 + r() * 6}, ${34 + r() * 10}%, ${l}%)`; g.fillRect(x, i * ph, len, ph);
        g.strokeStyle = 'rgba(70,45,20,.10)'; g.lineWidth = 1;
        for (let k = 0; k < 7; k++) { const y = i * ph + r() * ph; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + len * .3, y + r() * 8 - 4, x + len * .6, y + r() * 8 - 4, x + len, y); g.stroke(); }
        g.fillStyle = 'rgba(60,40,20,.28)'; g.fillRect(x + len - 2, i * ph, 2, ph);
        x += len;
      }
      g.fillStyle = 'rgba(60,40,20,.25)'; g.fillRect(0, i * ph, w, 2);
    }
  }, [1 / 2.4, 1 / 2.4]),
  stein: ctex(512, 512, (g, w, h) => {
    const r = rng(3); g.fillStyle = '#6f6253'; g.fillRect(0, 0, w, h);
    const rows = 16, rh = h / rows;
    for (let i = 0; i < rows; i++) {
      let x = -r() * 80;
      while (x < w) { const len = 50 + r() * 90; g.fillStyle = `hsl(${28 + r() * 14}, ${16 + r() * 16}%, ${48 + r() * 24}%)`; g.fillRect(x + 2, i * rh + 2, len - 3, rh - 3); x += len; }
    }
  }, [2, 1.6]),
  lamellen: ctex(64, 256, (g, w, h) => {
    g.fillStyle = '#f2f0ec'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(40,35,45,.28)';
    for (let i = 1; i < 6; i++) g.fillRect(0, i * h / 6 - 3, w, 5);
  }),
  tapeteA: ctex(256, 256, (g, w) => {   // Wohnzimmer: braun-orange, abgerundete Quadrate
    g.fillStyle = '#c4601a'; g.fillRect(0, 0, w, w);
    const rr = (s, col) => { g.fillStyle = col; const o = (w - s) / 2; g.beginPath(); g.roundRect(o, o, s, s, s * 0.32); g.fill(); };
    rr(220, '#5c3317'); rr(170, '#e9a21d'); rr(118, '#f1e2c2'); rr(66, '#c4601a');
  }),
  tapeteB: ctex(256, 256, (g, w) => {   // Selfie-Koje: lila-pink, Kreise
    g.fillStyle = '#5f2b84'; g.fillRect(0, 0, w, w);
    const ci = (x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
    for (const [x, y] of [[64, 64], [192, 192]]) { ci(x, y, 58, '#e0447c'); ci(x, y, 40, '#f5b70a'); ci(x, y, 20, '#5f2b84'); }
    for (const [x, y] of [[192, 64], [64, 192]]) { ci(x, y, 58, '#f2690d'); ci(x, y, 40, '#f3ead7'); ci(x, y, 20, '#e0447c'); }
  }),
  teppich: ctex(512, 512, (g, w) => {
    g.fillStyle = '#7a3f17'; g.fillRect(0, 0, w, w);
    ['#b8531a', '#e9861f', '#f2c14e', '#b8531a', '#7a3f17'].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.ellipse(w / 2, w / 2, 230 - i * 44, 230 - i * 44, 0, 0, 7); g.fill(); });
  }),
  glasbaustein: ctex(128, 128, (g, w) => {
    g.fillStyle = '#a9cfe6'; g.fillRect(0, 0, w, w); g.fillStyle = 'rgba(255,255,255,.55)';
    for (let i = 0; i < 8; i++) g.fillRect(i * 16 + 3, 0, 5, w);
  }),
};

/* ---------- Geometrie-Bausteine (y = Unterkante) ---------- */
function shade(o, cast = true) { o.castShadow = cast; o.receiveShadow = true; return o; }
function box(w, h, d, m, x = 0, y = 0, z = 0, cast = true) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y + h / 2, z); return shade(o, cast); }
function rbox(w, h, d, m, x = 0, y = 0, z = 0, r = 0.03, cast = true) {
  const o = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)), m); o.position.set(x, y + h / 2, z); return shade(o, cast);
}
function cyl(r, h, m, x = 0, y = 0, z = 0, seg = 28, rTop = r) { const o = new THREE.Mesh(new THREE.CylinderGeometry(rTop, r, h, seg), m); o.position.set(x, y + h / 2, z); return shade(o); }
function ball(r, m, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m); o.position.set(x, y, z); return shade(o); }
/* Fläche von (x0,z0) nach (x1,z1); sichtbare Seite liegt in Laufrichtung links */
function wall(x0, z0, x1, z1, m, { h = 2.5, y0 = 0, rep = null } = {}) {
  const L = Math.hypot(x1 - x0, z1 - z0);
  const o = new THREE.Mesh(new THREE.PlaneGeometry(L, h), m);
  o.position.set((x0 + x1) / 2, y0 + h / 2, (z0 + z1) / 2);
  o.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
  o.receiveShadow = true;
  return o;
}
/* Flaches Schild mit Text, liegt auf dem Boden (für Maße und Raumnamen) */
function flatText(text, { size = 0.34, color = '#3a3145', weight = 600, font = FB } = {}) {
  const px = 64; const c = document.createElement('canvas'); let g = c.getContext('2d');
  g.font = `${weight} ${px}px ${font}`; const tw = Math.ceil(g.measureText(text).width) + 24;
  c.width = tw; c.height = px + 24; g = c.getContext('2d');
  g.font = `${weight} ${px}px ${font}`; g.fillStyle = color; g.textBaseline = 'middle'; g.fillText(text, 12, c.height / 2 + 3);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  const geo = new THREE.PlaneGeometry(size * c.width / c.height, size); geo.rotateX(-PI / 2);
  const o = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
  o.renderOrder = 3; o.userData.noAO = true;
  return o;
}
/* Beschriftete Tafel: Canvas-Textur auf einer Fläche */
function sign(w, h, draw, { res = 256, emissive = false } = {}) {
  const t = ctex(Math.round(w * res), Math.round(h * res), draw);
  const m = emissive ? new THREE.MeshBasicMaterial({ map: t }) : new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 });
  const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); o.receiveShadow = !emissive;
  return o;
}
