import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* =====================================================================
   CORE: utils, renderer, procedural textures, materials, geometry
   Koordinaten: x = Breite (0 = Waschtisch-Wand, W = Wannen-Wand)
                z = Länge  (0 = Fenster-Wand,   L = Tür-Wand)
                y = Höhe. Einheiten: Meter.
   ===================================================================== */
const V3 = THREE.Vector3, PI = Math.PI, SQ2 = Math.SQRT2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOWQ = IS_TOUCH || (navigator.hardwareConcurrency || 8) <= 4;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- renderer ---------- */
const stageEl = document.getElementById('stage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) {
  document.getElementById('nogl').hidden = false;
  document.getElementById('loader').hidden = true;
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, LOWQ ? 1.6 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x000000, 0);
renderer.localClippingEnabled = true;
stageEl.appendChild(renderer.domElement);
RectAreaLightUniformsLib.init();
const MAX_ANISO = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const pmrem = new THREE.PMREMGenerator(renderer);
const ENV = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;

/* ---------- canvas helpers ---------- */
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function hex2rgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const gray = (v) => { const g = clamp(Math.round(v * 255), 0, 255); return `rgb(${g},${g},${g})`; };
function vary(hex, r, amt = 0.05, warm = 0) {
  const c = hex2rgb(hex); const f = 1 + (r() - 0.5) * 2 * amt; const t = (r() - 0.5) * 2 * warm * 255;
  return [clamp(c[0] * f + t, 0, 255), clamp(c[1] * f + t * 0.3, 0, 255), clamp(c[2] * f - t, 0, 255)];
}
function mixHex(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return [lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]; }

let NOISE;
function noiseCv() {
  if (NOISE) return NOISE;
  const n = 256, c = mkCanvas(n, n), x = c.getContext('2d'), d = x.createImageData(n, n), r = rng(7);
  for (let i = 0; i < n * n; i++) { const v = (r() * 255) | 0; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; }
  x.putImageData(d, 0, 0);
  return (NOISE = c);
}
function grain(ctx, w, h, alpha = 0.05, mode = 'overlay') {
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = mode;
  ctx.fillStyle = ctx.createPattern(noiseCv(), 'repeat'); ctx.fillRect(0, 0, w, h); ctx.restore();
}
function toTex(cv, { srgb = true, ww = 1, wh = 1 } = {}) {
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / ww, 1 / wh);
  t.anisotropy = MAX_ANISO;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const TEXC = new Map();
const cached = (k, fn) => { if (!TEXC.has(k)) TEXC.set(k, fn()); return TEXC.get(k); };
// draw something on a wrapped canvas (repeats across edges)
function wrapDraw(W, H, x, y, pad, fn) {
  const xs = [x], ys = [y];
  if (x < pad) xs.push(x + W); if (x > W - pad) xs.push(x - W);
  if (y < pad) ys.push(y + H); if (y > H - pad) ys.push(y - H);
  for (const xx of xs) for (const yy of ys) fn(xx, yy);
}

/* ---------- tiles ---------- */
// o: key,tw,th,cols,rows,base|colors,vary,grout,gw,layout(grid|brick|diag),bevel,zellige,rt,rg,seed
function tileSet(o) {
  return cached('tile:' + o.key, () => {
    const diag = o.layout === 'diag';
    const worldW = diag ? 2 * o.tw * SQ2 : o.cols * o.tw;
    const worldH = diag ? worldW : o.rows * o.th;
    const W = o.px || 1024, s = W / worldW, H = Math.round(worldH * s);
    const col = mkCanvas(W, H), bmp = mkCanvas(W, H), rgh = mkCanvas(W, H);
    const c = col.getContext('2d'), b = bmp.getContext('2d'), g = rgh.getContext('2d');
    c.fillStyle = o.grout; c.fillRect(0, 0, W, H);
    b.fillStyle = '#000'; b.fillRect(0, 0, W, H);
    g.fillStyle = gray(o.rg ?? 0.85); g.fillRect(0, 0, W, H);
    const gw = Math.max(1, o.gw * s), bev = (o.bevel ?? 0.004) * s;
    const colors = o.colors || [o.base];
    const palette = new Map();
    const pick = (key) => {
      if (!palette.has(key)) { const r = rng(hashKey(key) + (o.seed || 1)); palette.set(key, { c: vary(colors[Math.floor(r() * colors.length)], r, o.vary ?? 0.03, o.warm ?? 0), r }); }
      return palette.get(key);
    };
    const drawTile = (x, y, w, h, key) => {
      const P = pick(key), r = rng(hashKey(key) * 7 + 3);
      const x0 = x + gw / 2, y0 = y + gw / 2, tw = w - gw, th = h - gw;
      // color
      c.fillStyle = css(P.c); c.fillRect(x0, y0, tw, th);
      if (o.zellige) {
        for (let k = 0; k < 5; k++) {
          const rx = x0 + r() * tw, ry = y0 + r() * th, rr = (0.3 + r() * 0.7) * Math.max(tw, th);
          const gr = c.createRadialGradient(rx, ry, 0, rx, ry, rr);
          const lighter = r() < 0.5;
          gr.addColorStop(0, lighter ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.18)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          c.fillStyle = gr; c.fillRect(x0, y0, tw, th);
        }
        c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = Math.max(1, gw * 0.6); c.strokeRect(x0 + 1, y0 + 1, tw - 2, th - 2);
      } else {
        const lg = c.createLinearGradient(x0, y0, x0 + tw, y0 + th);
        lg.addColorStop(0, 'rgba(255,255,255,0.05)'); lg.addColorStop(1, 'rgba(0,0,0,0.04)');
        c.fillStyle = lg; c.fillRect(x0, y0, tw, th);
      }
      // bump: soft pillow edge
      const steps = 4;
      for (let k = 0; k <= steps; k++) {
        const inset = (bev * k) / steps; b.fillStyle = gray(0.55 + 0.45 * (k / steps));
        b.fillRect(x0 + inset, y0 + inset, tw - inset * 2, th - inset * 2);
      }
      if (o.zellige) {
        for (let k = 0; k < 6; k++) {
          const rx = x0 + r() * tw, ry = y0 + r() * th, rr = (0.2 + r() * 0.5) * tw;
          const gr = b.createRadialGradient(rx, ry, 0, rx, ry, rr);
          gr.addColorStop(0, r() < 0.5 ? 'rgba(255,255,255,0.0)' : 'rgba(0,0,0,0.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          b.fillStyle = gr; b.fillRect(x0 + bev, y0 + bev, tw - 2 * bev, th - 2 * bev);
        }
      }
      // roughness
      g.fillStyle = gray((o.rt ?? 0.14) + (r() - 0.5) * 0.05); g.fillRect(x0, y0, tw, th);
    };
    if (diag) {
      const t = o.tw * s;
      for (const ctx of [c, b, g]) { ctx.save(); ctx.rotate(PI / 4); }
      const save = [c, b, g];
      for (let i = -6; i < 10; i++) for (let j = -10; j < 10; j++) {
        const key = 'd' + (((i + j) % 4 + 4) % 4) + '_' + (((i - j) % 4 + 4) % 4);
        drawTile(i * t, j * t, t, t, key);
      }
      save.forEach(ctx => ctx.restore());
    } else {
      const tw = o.tw * s, th = o.th * s;
      for (let j = 0; j < o.rows; j++) {
        const off = o.layout === 'brick' && j % 2 ? tw / 2 : 0;
        for (let i = -1; i <= o.cols; i++) {
          const ii = ((i % o.cols) + o.cols) % o.cols;
          drawTile(i * tw + off, j * th, tw, th, ii + '_' + j);
        }
      }
    }
    grain(c, W, H, o.grainA ?? 0.06);
    const map = toTex(col, { ww: worldW, wh: worldH });
    const bump = toTex(bmp, { srgb: false, ww: worldW, wh: worldH });
    const rough = toTex(rgh, { srgb: false, ww: worldW, wh: worldH });
    return { map, bump, rough, worldW, worldH };
  });
}
function hashKey(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/* ---------- wood ---------- */
function woodCanvas(o) {
  const W = o.w || 512, H = o.h || 1024, cv = mkCanvas(W, H), c = cv.getContext('2d'), r = rng(o.seed || 3);
  c.fillStyle = o.base; c.fillRect(0, 0, W, H);
  const dk = hex2rgb(o.dark), lt = hex2rgb(o.light);
  for (let i = 0; i < 16; i++) {
    const x = r() * W, bw = 16 + r() * 80, colr = r() < 0.55 ? dk : lt;
    const gr = c.createLinearGradient(x - bw, 0, x + bw, 0);
    gr.addColorStop(0, css(colr, 0)); gr.addColorStop(0.5, css(colr, 0.08 + r() * 0.12)); gr.addColorStop(1, css(colr, 0));
    c.fillStyle = gr; c.fillRect(x - bw, 0, bw * 2, H);
  }
  const n = o.density || 150;
  for (let i = 0; i < n; i++) {
    const x = r() * W, a = 0.04 + r() * (o.contrast || 0.16), f2 = r() * 6, amp = 1 + r() * 4, f1 = 0.004 + r() * 0.01;
    c.strokeStyle = css(dk, a); c.lineWidth = 0.5 + r() * 1.6; c.beginPath();
    for (let y = -8; y <= H + 8; y += 8) { const xx = x + Math.sin(y * f1 + f2) * amp + Math.sin(y * 0.0025 + f2) * amp * 2.5; y < 0 ? c.moveTo(xx, y) : c.lineTo(xx, y); }
    c.stroke();
  }
  if (o.figure) {
    for (let k = 0; k < 3; k++) {
      const cx = W * (0.15 + r() * 0.7), cy = H * (0.15 + r() * 0.6);
      for (let j = 0; j < 9; j++) {
        const rad = 8 + j * (7 + r() * 3);
        c.strokeStyle = css(dk, 0.08 + r() * 0.08); c.lineWidth = 0.8 + r() * 1.4; c.beginPath();
        for (let t = -1; t <= 1.0001; t += 0.05) { const xx = cx + t * rad; const yy = cy + j * 5 - (1 - t * t) * rad * 2.4; t <= -1 ? c.moveTo(xx, yy) : c.lineTo(xx, yy); }
        c.stroke();
      }
    }
  }
  c.fillStyle = css(dk, 0.22);
  for (let i = 0; i < (o.pores ?? 1200); i++) c.fillRect(r() * W, r() * H, 1, 2 + r() * 5);
  grain(c, W, H, 0.07);
  return cv;
}
function woodTex(key, o) { return cached('wood:' + key, () => { const t = toTex(woodCanvas(o)); t.repeat.set(o.rx || 1, o.ry || 1); return t; }); }

function herringboneSet(key, o) {
  return cached('hb:' + key, () => {
    const pw = o.w, pl = o.l;
    const worldW = pw * SQ2 * 4, worldH = pl * SQ2 * 3;
    const W = 1024, s = W / worldW, H = Math.round(worldH * s);
    const col = mkCanvas(W, H), bmp = mkCanvas(W, H), c = col.getContext('2d'), b = bmp.getContext('2d');
    c.fillStyle = o.gap || '#5d4a36'; c.fillRect(0, 0, W, H); b.fillStyle = '#000'; b.fillRect(0, 0, W, H);
    const a = s / SQ2;
    for (const ctx of [c, b]) ctx.setTransform(a, -a, a, a, 0, 0);
    const gapM = 0.0012;
    const dk = hex2rgb(o.dark);
    const plank = (x, y, w, h, key, horiz) => {
      const r = rng(hashKey(key)); const cc = vary(r() < 0.5 ? o.base : o.alt || o.base, r, 0.07, 0.02);
      c.fillStyle = css(cc); c.fillRect(x + gapM, y + gapM, w - 2 * gapM, h - 2 * gapM);
      b.fillStyle = '#fff'; b.fillRect(x + gapM, y + gapM, w - 2 * gapM, h - 2 * gapM);
      c.save(); c.beginPath(); c.rect(x + gapM, y + gapM, w - 2 * gapM, h - 2 * gapM); c.clip();
      const lines = 9;
      for (let k = 0; k < lines; k++) {
        c.strokeStyle = css(dk, 0.05 + r() * 0.14); c.lineWidth = (0.6 + r() * 1.2) / s; c.beginPath();
        const off = r(), ph = r() * 6, amp = (0.0015 + r() * 0.003);
        for (let t = 0; t <= 1.0001; t += 0.05) {
          if (horiz) { const xx = x + t * w, yy = y + off * h + Math.sin(t * 7 + ph) * amp; t ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
          else { const yy = y + t * h, xx = x + off * w + Math.sin(t * 7 + ph) * amp; t ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
        }
        c.stroke();
      }
      c.restore();
    };
    for (let k = -9; k < 13; k++) for (let j = -6; j < 4; j++) {
      const bx = k * pw + j * pl, by = k * pw - j * pl;
      const key = (((k % 4) + 4) % 4) + '_' + (((j % 3) + 3) % 3);
      plank(bx, by, pl, pw, 'h' + key + key, true);
      plank(bx, by + pw, pw, pl, 'v' + key + key, false);
    }
    for (const ctx of [c, b]) ctx.setTransform(1, 0, 0, 1, 0, 0);
    grain(c, W, H, 0.08);
    return { map: toTex(col, { ww: worldW, wh: worldH }), bump: toTex(bmp, { srgb: false, ww: worldW, wh: worldH }) };
  });
}

/* ---------- stone, plaster, terrazzo, marble ---------- */
function cloudSet(key, o) { // microcement / limewash
  return cached('cloud:' + key, () => {
    const worldW = o.world || 2, W = 1024, H = 1024, s = W / worldW;
    const col = mkCanvas(W, H), bmp = mkCanvas(W, H), rgh = mkCanvas(W, H);
    const c = col.getContext('2d'), b = bmp.getContext('2d'), g = rgh.getContext('2d');
    const r = rng(hashKey(key));
    c.fillStyle = o.base; c.fillRect(0, 0, W, H); b.fillStyle = gray(0.5); b.fillRect(0, 0, W, H); g.fillStyle = gray(o.rough ?? 0.5); g.fillRect(0, 0, W, H);
    const lt = hex2rgb(o.light || '#ffffff'), dk = hex2rgb(o.dark || '#000000');
    for (let i = 0; i < (o.blobs || 260); i++) {
      const x = r() * W, y = r() * H, rr = (0.05 + r() * 0.35) * s, light = r() < 0.5;
      const a = (o.contrast || 0.07) * (0.4 + r());
      wrapDraw(W, H, x, y, rr, (xx, yy) => {
        const gr = c.createRadialGradient(xx, yy, 0, xx, yy, rr);
        gr.addColorStop(0, css(light ? lt : dk, a)); gr.addColorStop(1, css(light ? lt : dk, 0));
        c.fillStyle = gr; c.fillRect(xx - rr, yy - rr, rr * 2, rr * 2);
        const gb = b.createRadialGradient(xx, yy, 0, xx, yy, rr);
        gb.addColorStop(0, light ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'); gb.addColorStop(1, 'rgba(0,0,0,0)');
        b.fillStyle = gb; b.fillRect(xx - rr, yy - rr, rr * 2, rr * 2);
        const gg = g.createRadialGradient(xx, yy, 0, xx, yy, rr);
        gg.addColorStop(0, light ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)'); gg.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gg; g.fillRect(xx - rr, yy - rr, rr * 2, rr * 2);
      });
    }
    // trowel / brush strokes
    for (let i = 0; i < (o.strokes || 70); i++) {
      const x = r() * W, y = r() * H, len = (0.15 + r() * 0.4) * s, ang = r() * PI, wdt = (0.02 + r() * 0.06) * s;
      wrapDraw(W, H, x, y, len, (xx, yy) => {
        c.save(); c.translate(xx, yy); c.rotate(ang);
        c.strokeStyle = css(r() < 0.5 ? lt : dk, (o.contrast || 0.07) * 0.6); c.lineWidth = wdt; c.lineCap = 'round';
        c.beginPath(); c.moveTo(-len / 2, 0); c.quadraticCurveTo(0, (r() - 0.5) * len * 0.5, len / 2, 0); c.stroke(); c.restore();
      });
    }
    grain(c, W, H, o.grainA ?? 0.08); grain(b, W, H, 0.25, 'source-over');
    return { map: toTex(col, { ww: worldW, wh: worldW }), bump: toTex(bmp, { srgb: false, ww: worldW, wh: worldW }), rough: toTex(rgh, { srgb: false, ww: worldW, wh: worldW }) };
  });
}
function terrazzoSet(key, o) {
  return cached('tz:' + key, () => {
    const worldW = 1.2, W = 1024, H = 1024, s = W / worldW;
    const col = mkCanvas(W, H), rgh = mkCanvas(W, H), c = col.getContext('2d'), g = rgh.getContext('2d');
    const r = rng(41);
    c.fillStyle = o.base; c.fillRect(0, 0, W, H); g.fillStyle = gray(0.28); g.fillRect(0, 0, W, H);
    const chips = o.chips; // [[hex, weight, maxSize]]
    const total = chips.reduce((a, ch) => a + ch[1], 0);
    for (let i = 0; i < 2400; i++) {
      let pickv = r() * total, ch = chips[0];
      for (const cc of chips) { if ((pickv -= cc[1]) <= 0) { ch = cc; break; } }
      const size = (0.002 + Math.pow(r(), 2.4) * ch[2]) * s, x = r() * W, y = r() * H, n = 5 + Math.floor(r() * 3), rot = r() * PI * 2;
      const pts = []; for (let k = 0; k < n; k++) { const a = rot + (k / n) * PI * 2, rr = size * (0.55 + r() * 0.5); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
      const cc = vary(ch[0], r, 0.08);
      wrapDraw(W, H, x, y, size, (xx, yy) => {
        c.fillStyle = css(cc); c.beginPath(); pts.forEach(([px, py], k) => k ? c.lineTo(xx + px, yy + py) : c.moveTo(xx + px, yy + py)); c.closePath(); c.fill();
      });
    }
    // 60er Fliesenfugen
    c.fillStyle = o.grout || 'rgba(120,110,100,0.35)'; g.fillStyle = gray(0.8);
    for (const p of [0, W / 2]) { c.fillRect(p, 0, 1.5, H); c.fillRect(0, p, W, 1.5); g.fillRect(p, 0, 1.5, H); g.fillRect(0, p, W, 1.5); }
    grain(c, W, H, 0.06);
    return { map: toTex(col, { ww: worldW, wh: worldW }), rough: toTex(rgh, { srgb: false, ww: worldW, wh: worldW }) };
  });
}
function marbleTex(key) {
  return cached('marble:' + key, () => {
    const W = 1024, H = 512, cv = mkCanvas(W, H), c = cv.getContext('2d'), r = rng(12);
    c.fillStyle = '#f1efea'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H, rr = 40 + r() * 160; const gr = c.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, 'rgba(160,155,148,0.08)'); gr.addColorStop(1, 'rgba(160,155,148,0)'); c.fillStyle = gr; c.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
    const vein = (col, wmax, alpha) => {
      let x = r() * W, y = r() * H, a = r() * PI * 2; c.strokeStyle = col; c.globalAlpha = alpha; c.lineCap = 'round';
      for (let k = 0; k < 140; k++) { const nx = x + Math.cos(a) * 9, ny = y + Math.sin(a) * 9; c.lineWidth = 0.4 + r() * wmax; c.beginPath(); c.moveTo(x, y); c.lineTo(nx, ny); c.stroke(); x = nx; y = ny; a += (r() - 0.5) * 0.6; }
      c.globalAlpha = 1;
    };
    c.filter = 'blur(1.2px)'; for (let i = 0; i < 7; i++) vein('#8d8780', 3.5, 0.45); c.filter = 'none';
    for (let i = 0; i < 10; i++) vein('#9f988f', 1.2, 0.5);
    for (let i = 0; i < 4; i++) vein('#b39f74', 1.6, 0.45);
    grain(c, W, H, 0.04);
    const t = toTex(cv); t.repeat.set(1, 1); return t;
  });
}

/* ---------- textiles & prints ---------- */
function terryTex(key, hex, stripe) {
  return cached('terry:' + key, () => {
    const W = 256, H = 512, cv = mkCanvas(W, H), c = cv.getContext('2d'), r = rng(hashKey(key));
    c.fillStyle = hex; c.fillRect(0, 0, W, H);
    const base = hex2rgb(hex);
    for (let i = 0; i < 9000; i++) { const f = 0.75 + r() * 0.5; c.fillStyle = css([base[0] * f, base[1] * f, base[2] * f], 0.55); c.fillRect(r() * W, r() * H, 2, 2); }
    if (stripe) {
      c.fillStyle = stripe;
      for (const v of [0.07, 0.1, 0.9, 0.93]) c.fillRect(0, v * H, W, H * 0.012);
      c.fillRect(0, 0.115 * H, W, H * 0.02); c.fillRect(0, 0.865 * H, W, H * 0.02);
    }
    grain(c, W, H, 0.18);
    const t = toTex(cv); t.repeat.set(1, 1); return t;
  });
}
function furTex(key, hex) {
  return cached('fur:' + key, () => {
    const W = 512, cv = mkCanvas(W, W), c = cv.getContext('2d'), r = rng(5), base = hex2rgb(hex);
    c.fillStyle = hex; c.fillRect(0, 0, W, W);
    c.lineCap = 'round';
    for (let i = 0; i < 9000; i++) {
      const x = r() * W, y = r() * W, a = r() * PI * 2, l = 4 + r() * 10, f = 0.65 + r() * 0.7;
      c.strokeStyle = css([base[0] * f, base[1] * f, base[2] * f], 0.5); c.lineWidth = 1 + r() * 1.5;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
    }
    const t = toTex(cv); t.repeat.set(2, 2); return t;
  });
}
function rugTex(key, o) { // flat-woven / tufted rug with border
  return cached('rug:' + key, () => {
    const W = 512, H = 1024, cv = mkCanvas(W, H), c = cv.getContext('2d'), r = rng(hashKey(key));
    c.fillStyle = o.base; c.fillRect(0, 0, W, H);
    if (o.kilim) {
      const cols = o.kilim;
      c.fillStyle = cols[1]; c.fillRect(24, 24, W - 48, H - 48);
      c.fillStyle = cols[0]; c.fillRect(48, 48, W - 96, H - 96);
      for (let y = 90; y < H - 90; y += 120) {
        for (let k = 0; k < 3; k++) {
          const s = 70 - k * 22; c.fillStyle = cols[(k + 1) % cols.length];
          c.beginPath(); c.moveTo(W / 2, y + 60 - s); c.lineTo(W / 2 + s * 1.4, y + 60); c.lineTo(W / 2, y + 60 + s); c.lineTo(W / 2 - s * 1.4, y + 60); c.closePath(); c.fill();
        }
        c.fillStyle = cols[2];
        for (const sx of [90, W - 90]) { c.beginPath(); c.moveTo(sx, y + 35); c.lineTo(sx + 22, y + 60); c.lineTo(sx, y + 85); c.lineTo(sx - 22, y + 60); c.closePath(); c.fill(); }
      }
      c.strokeStyle = cols[3]; c.lineWidth = 6; c.setLineDash([14, 10]); c.strokeRect(36, 36, W - 72, H - 72); c.setLineDash([]);
    } else {
      c.strokeStyle = o.border || 'rgba(255,255,255,0.4)'; c.lineWidth = 10; c.strokeRect(26, 26, W - 52, H - 52);
    }
    const base = hex2rgb(o.base);
    for (let i = 0; i < 16000; i++) { const f = 0.8 + r() * 0.4; c.fillStyle = `rgba(0,0,0,${0.04 + r() * 0.06})`; c.fillRect(r() * W, r() * H, 2, 2); c.fillStyle = css([base[0] * f, base[1] * f, base[2] * f], 0.12); c.fillRect(r() * W, r() * H, 2, 3); }
    grain(c, W, H, 0.2);
    const t = toTex(cv); t.repeat.set(1, 1); return t;
  });
}
function curtainTex() {
  return cached('curtain', () => {
    const W = 1024, H = 1024, cv = mkCanvas(W, H), c = cv.getContext('2d'), r = rng(19);
    c.fillStyle = '#f4f4f1'; c.fillRect(0, 0, W, H);
    const cols = ['#0f2f3a', '#1e5466', '#2f7d90', '#5aa6b6', '#94cad2', '#163a47'];
    const cell = 22;
    for (let y = 0; y < H; y += cell) for (let x = 0; x < W; x += cell) {
      const t = y / H; // 0 top → 1 bottom
      if (r() > Math.pow(t, 1.4) * 1.05 + 0.03) continue;
      const sz = cell * (0.55 + r() * 0.35); c.save(); c.translate(x + cell / 2 + (r() - 0.5) * 4, y + cell / 2 + (r() - 0.5) * 4); c.rotate((r() - 0.5) * 0.5);
      c.fillStyle = cols[Math.floor(r() * cols.length)]; c.globalAlpha = 0.6 + r() * 0.4;
      const rr = 3; c.beginPath(); c.roundRect ? c.roundRect(-sz / 2, -sz / 2, sz, sz * (0.8 + r() * 0.4), rr) : c.rect(-sz / 2, -sz / 2, sz, sz); c.fill(); c.restore();
    }
    grain(c, W, H, 0.05);
    const t = toTex(cv); t.repeat.set(1, 1); return t;
  });
}
function printTex() { // botanischer Kunstdruck
  return cached('print', () => {
    const W = 400, H = 560, cv = mkCanvas(W, H), c = cv.getContext('2d'), r = rng(23);
    c.fillStyle = '#efe8da'; c.fillRect(0, 0, W, H);
    c.strokeStyle = '#2f4f3f'; c.fillStyle = 'rgba(47,79,63,0.85)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(W / 2, H - 110); c.bezierCurveTo(W / 2 - 10, H - 260, W / 2 + 20, 200, W / 2, 70); c.stroke();
    for (let i = 0; i < 9; i++) {
      const t = i / 9, y = H - 130 - t * (H - 230), side = i % 2 ? 1 : -1, len = 90 - t * 45;
      c.save(); c.translate(W / 2 + side * 4, y); c.rotate(side * (0.9 - t * 0.3));
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * 0.5, -len * 0.32, len, 0); c.quadraticCurveTo(len * 0.5, len * 0.32, 0, 0); c.fill(); c.restore();
    }
    c.fillStyle = '#7a6a52'; c.font = '600 15px Georgia, serif'; c.textAlign = 'center';
    c.fillText('MONSTERA · TAB. IV', W / 2, H - 52);
    c.fillStyle = 'rgba(122,106,82,0.6)'; c.fillRect(W / 2 - 60, H - 40, 120, 2);
    grain(c, W, H, 0.1);
    const t = toTex(cv); t.repeat.set(1, 1); return t;
  });
}
function flutedBump(key, period) {
  return cached('flute:' + key, () => {
    const W = 128, cv = mkCanvas(W, 8), c = cv.getContext('2d');
    for (let x = 0; x < W; x++) { const v = 0.5 + 0.5 * Math.cos((x / W) * PI * 2); c.fillStyle = gray(Math.pow(v, 0.6)); c.fillRect(x, 0, 1, 8); }
    const t = toTex(cv, { srgb: false }); t.repeat.set(period, 1); return t;
  });
}
function radialTex(key, inner, outer) { // weicher Schatten / Glow
  return cached('rad:' + key, () => {
    const W = 256, cv = mkCanvas(W, W), c = cv.getContext('2d');
    const gr = c.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    gr.addColorStop(0, inner); gr.addColorStop(1, outer); c.fillStyle = gr; c.fillRect(0, 0, W, W);
    const t = new THREE.CanvasTexture(cv); return t;
  });
}
function edgeAOTex() {
  return cached('ao', () => {
    const cv = mkCanvas(8, 128), c = cv.getContext('2d');
    const gr = c.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.35, 'rgba(0,0,0,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = gr; c.fillRect(0, 0, 8, 128);
    return new THREE.CanvasTexture(cv);
  });
}

/* ---------- materials ---------- */
const MATC = new Map();
const mat = (k, fn) => { if (!MATC.has(k)) { const m = fn(); m.userData.env = m.envMapIntensity ?? 1; MATC.set(k, m); } return MATC.get(k); };
const std = (p) => new THREE.MeshStandardMaterial({ envMapIntensity: 0.7, ...p });
const phys = (p) => new THREE.MeshPhysicalMaterial({ envMapIntensity: 0.8, ...p });
const M = {
  cut: () => mat('cut', () => std({ color: 0x2b3230, roughness: 0.92, envMapIntensity: 0.2 })),
  plaster: (c = '#f3f1ec') => mat('plaster' + c, () => std({ color: c, roughness: 0.92, envMapIntensity: 0.35 })),
  ceramic: (c = '#f7f7f4') => mat('ceramic' + c, () => phys({ color: c, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.9, side: THREE.DoubleSide })),
  ceramicMatte: (c = '#f1f0ec') => mat('cerm' + c, () => phys({ color: c, roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.4, envMapIntensity: 0.6, side: THREE.DoubleSide })),
  chrome: () => mat('chrome', () => std({ color: 0xe9edf0, metalness: 1, roughness: 0.07, envMapIntensity: 1.25 })),
  steel: () => mat('steel', () => std({ color: 0xc9cdd0, metalness: 1, roughness: 0.3, envMapIntensity: 1.1 })),
  brass: () => mat('brass', () => std({ color: 0xc8a052, metalness: 1, roughness: 0.27, envMapIntensity: 1.25 })),
  black: () => mat('black', () => std({ color: 0x1e1f21, metalness: 0.55, roughness: 0.42, envMapIntensity: 0.8 })),
  blackPlastic: () => mat('blackp', () => std({ color: 0x18191b, roughness: 0.35, envMapIntensity: 0.6 })),
  whitePlastic: () => mat('whitep', () => std({ color: 0xf2f2ef, roughness: 0.32, envMapIntensity: 0.6 })),
  paint: (c) => mat('paint' + c, () => std({ color: c, roughness: 0.45, envMapIntensity: 0.6 })),
  lacquer: (c) => mat('lacq' + c, () => phys({ color: c, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.12, envMapIntensity: 0.8 })),
  glass: () => mat('glass', () => phys({ color: 0xe6f2f1, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.14, envMapIntensity: 2.2, depthWrite: false, side: THREE.DoubleSide })),
  glassTint: (c) => mat('glasst' + c, () => phys({ color: c, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.55, envMapIntensity: 1.5 })),
  frosted: () => mat('frosted', () => phys({ color: 0xf2f5f5, roughness: 0.45, transparent: true, opacity: 0.94, emissive: new THREE.Color(0xdde8f2), emissiveIntensity: 1.0, envMapIntensity: 0.6 })),
  lamp: (c, on = 2.5, off = 0.15) => mat('lamp' + c + on + off, () => { const m = std({ color: c, emissive: new THREE.Color(c), emissiveIntensity: off, roughness: 0.5, envMapIntensity: 0.3 }); m.userData.lampOn = on; m.userData.lampOff = off; return m; }),
  emit: (c, i = 2) => mat('emit' + c + i, () => std({ color: c, emissive: new THREE.Color(c), emissiveIntensity: i, roughness: 0.5 })),
  water: () => mat('water', () => phys({ color: 0xbfd8dc, roughness: 0.02, transparent: true, opacity: 0.6, envMapIntensity: 1.5 })),
  fabric: (key, hex, stripe) => mat('fab' + key, () => std({ color: 0xffffff, map: terryTex(key, hex, stripe), roughness: 0.95, envMapIntensity: 0.25, side: THREE.DoubleSide })),
  plant: (c) => mat('plant' + c, () => std({ color: c, roughness: 0.55, envMapIntensity: 0.5, side: THREE.DoubleSide })),
  wood: (key, o) => mat('wood' + key, () => std({ map: woodTex(key, o), roughness: o.rough ?? 0.55, envMapIntensity: 0.55 })),
  flutedWood: (key, o, period) => mat('fw' + key + period, () => {
    const map = woodTex(key, o);
    return std({ map, bumpMap: flutedBump(key + period, period), bumpScale: 3.2, roughness: o.rough ?? 0.5, envMapIntensity: 0.55 });
  }),
  tile: (key, o, extra = {}) => mat('tile' + key, () => {
    const T = tileSet({ key, ...o });
    return std({ map: T.map, bumpMap: T.bump, bumpScale: o.bumpScale ?? 1.6, roughnessMap: T.rough, roughness: 1, envMapIntensity: o.env ?? 0.85, ...extra });
  }),
  cloud: (key, o) => mat('cloud' + key, () => {
    const T = cloudSet(key, o);
    return std({ map: T.map, bumpMap: T.bump, bumpScale: o.bumpScale ?? 0.6, roughnessMap: T.rough, roughness: 1, envMapIntensity: o.env ?? 0.5 });
  }),
};

/* ---------- geometry helpers ---------- */
function mesh(geo, m, { cast = true, recv = true } = {}) { const o = new THREE.Mesh(geo, m); o.castShadow = cast; o.receiveShadow = recv; return o; }
function box(w, h, d, m, o) { return mesh(new THREE.BoxGeometry(w, h, d), m, o); }
function rbox(w, h, d, r, m, o) { const rr = Math.max(0.0005, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4)); return mesh(new RoundedBoxGeometry(w, h, d, 3, rr), m, o); }
function cyl(rt, rb, h, m, seg = 28, o) { return mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m, o); }
function sph(r, m, seg = 24) { return mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75)), m); }
function at(o, x, y, z) { o.position.set(x, y, z); return o; }
function grp(...ch) { const g = new THREE.Group(); ch.forEach(c => c && g.add(c)); return g; }
// Box zwischen zwei Ecken
function slab(x0, y0, z0, x1, y1, z1, m, o) { return at(box(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0), m, o), (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); }
function rslab(x0, y0, z0, x1, y1, z1, r, m, o) { return at(rbox(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0), r, m, o), (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); }
// Box mit Welt-UVs (Fliesen laufen maßstäblich weiter)
function boxWUV(w, h, d) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0], uv.getY(i) * dims[f][1]); }
  return g;
}
function slabW(x0, y0, z0, x1, y1, z1, m, o) { return at(mesh(boxWUV(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)), m, o), (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); }
function tube(pts, r, m, segs = 64, closed = false, tension = 0.5) {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new V3(p[0], p[1], p[2])), closed, 'catmullrom', tension);
  return mesh(new THREE.TubeGeometry(curve, segs, r, 10, closed), m);
}
// Stange zwischen zwei Punkten
function rod(a, b, r, m, seg = 16) {
  const A = new V3(...a), B = new V3(...b), len = A.distanceTo(B);
  const o = cyl(r, r, len, m, seg); o.position.copy(A).add(B).multiplyScalar(0.5);
  o.quaternion.setFromUnitVectors(new V3(0, 1, 0), B.clone().sub(A).normalize()); return o;
}
function rrectShape(w, h, r, cx = 0, cy = 0) {
  r = Math.max(0.0005, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4));
  const s = new THREE.Shape(), x = cx - w / 2, y = cy - h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -PI / 2, 0, false);
  s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, PI / 2, false);
  s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, PI / 2, PI, false);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, PI, PI * 1.5, false);
  return s;
}
// liegende Platte (XZ), y von 0..t; optional mit Loch (hz = Versatz Loch in +z)
function plateGeo(w, d, r, t, hole = null, bevel = 0.003) {
  const s = rrectShape(w, d, r);
  if (hole) s.holes.push(rrectShape(hole.w, hole.d, hole.r, 0, -(hole.z || 0)));
  const b = Math.min(bevel, t / 3);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.0005, t - 2 * b), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 14 });
  g.rotateX(-PI / 2); g.translate(0, b, 0); return g;
}
function rrectPts(w, d, r, n = 7) {
  r = Math.max(0.0005, Math.min(r, w / 2 - 1e-4, d / 2 - 1e-4));
  const pts = [], cs = [[w / 2 - r, d / 2 - r, 0], [-w / 2 + r, d / 2 - r, PI / 2], [-w / 2 + r, -d / 2 + r, PI], [w / 2 - r, -d / 2 + r, PI * 1.5]];
  for (const [cx, cz, a0] of cs) for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * PI / 2; pts.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]); }
  return pts;
}
// Loft über abgerundete Rechtecke (Wanne, Becken, WC)
function loftGeo(levels, { capBottom = false, capTop = false, n = 7 } = {}) {
  const rings = levels.map(L => rrectPts(L.w, L.d, L.r, n).map(([x, z]) => [x + (L.x || 0), L.y, z + (L.z || 0)]));
  const M_ = rings[0].length, pos = [], idx = [];
  rings.forEach(ring => ring.forEach(p => pos.push(...p)));
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < M_; j++) {
    const a = i * M_ + j, b = i * M_ + ((j + 1) % M_), c = (i + 1) * M_ + j, d = (i + 1) * M_ + ((j + 1) % M_);
    idx.push(a, c, b, b, c, d);
  }
  const cap = (ri) => {
    const L = levels[ri], ci = pos.length / 3; pos.push(L.x || 0, L.y, L.z || 0);
    for (let j = 0; j < M_; j++) idx.push(ci, ri * M_ + j, ri * M_ + ((j + 1) % M_));
  };
  if (capBottom) cap(rings.length - 1);
  if (capTop) cap(0);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function lathe(profile, m, seg = 40) { return mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg), m); }
function quadGeo(P, UV, n) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap(p => [p.x, p.y, p.z]), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(UV.flat(), 2));
  g.setAttribute('normal', new THREE.Float32BufferAttribute([n, n, n, n].flatMap(v => [v.x, v.y, v.z]), 3));
  const fn = P[1].clone().sub(P[0]).cross(P[2].clone().sub(P[0]));
  g.setIndex(fn.dot(n) >= 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
  return g;
}
function mergeInto(meshes, m) { // gleiche Materialien zusammenführen (Performance)
  const geos = meshes.map(o => { o.updateMatrix(); const g = o.geometry.clone(); g.applyMatrix4(o.matrix); return g.index ? g.toNonIndexed() : g; });
  geos.forEach(g => { if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); });
  return mesh(mergeGeometries(geos, false), m);
}
function shadowOff(o) { o.traverse(c => { if (c.isMesh) c.castShadow = false; }); return o; }
function named(o, name, extra) { o.userData.name = name; if (extra) Object.assign(o.userData, extra); return o; }
