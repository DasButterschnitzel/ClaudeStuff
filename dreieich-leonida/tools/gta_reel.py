"""'Dreieich III' reels, cut to the beat grid of the song (126.05 BPM, drop at 47.775 s).

  trailer   41.9 s  intro card -> two calm location cards in the breakdown -> drop: eight location cards on
                    the bar lines (2.5-D parallax, title stamps, per-shot gags) -> the cover assembles panel by
                    panel on the beats, emblem slam, tagline
  reveal    13.3 s  count-in I, II, III -> cover assembles -> emblem slam -> tagline
  loading   15.4 s  loading-screen parody: slow artwork, HUD stars, rotating tips

Every frame is a pure function of time, so chunks can be rendered in parallel:
  python3 gta_reel.py trailer preview            contact sheet to $SP
  python3 gta_reel.py trailer render 0 4         chunk 0 of 4 -> $SP/master/gta_trailer_part0.mp4
"""
import math
import os
import sys

import cv2
import numpy as np

import fx
import gta_cover
from gta_common import CACHE, CREAM, H, POSTERS, PURPLE, W, font, imread, text_layer

FPS = 30
BEAT = 0.476
BAR = 4 * BEAT
DROP = 47.775                                    # song time of the drop (first kick)
LIME = np.array([0.80, 0.89, 0.16], np.float32)
PINK = np.array([1.0, 0.24, 0.65], np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
STAR = fx.star_sprite(301)
SMALLSTAR = fx.star_sprite(121, ray_len=0.46, ray_w=0.9, core=0.05)

# ----------------------------------------------------------------- poster layers (lazy)
_layers = {}


def layers(name):
    if name not in _layers:
        def f(s):
            im = imread(os.path.join(CACHE, f'{name}_{s}'))
            return im[..., 0] if (im.ndim == 3 and s in ('fg.png', 'title.png')) else im
        d = dict(bg=f('bg.jpg').astype(np.float32) / 255, art=f('art.jpg').astype(np.float32) / 255,
                 full=f('full.png').astype(np.float32) / 255, fg=f('fg.png').astype(np.float32) / 255,
                 title=f('title.png').astype(np.float32) / 255)
        d['fg_rgb'] = d['art'] * d['fg'][..., None]
        d['title_rgb'] = d['full'] * d['title'][..., None]
        ys, xs = np.nonzero(d['title'] > 0.3)
        d['tbox'] = (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else None
        if name == 'einflugschneise':            # the jet gets its own layer
            n, lab = cv2.connectedComponents((d['fg'] > 0.5).astype(np.uint8))
            jl = lab[int(0.12 * H), int(0.62 * W)]
            jm = cv2.dilate((lab == jl).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(np.float32)
            d['jet'] = d['fg'] * jm
            d['jet_rgb'] = d['art'] * d['jet'][..., None]
            d['fg'] = d['fg'] * (1 - jm)
            d['fg_rgb'] = d['art'] * d['fg'][..., None]
        _layers[name] = d
    return _layers[name]


def sim(scale, cx, cy, tx=0.0, ty=0.0, rot=0.0):
    M = cv2.getRotationMatrix2D((cx, cy), rot, scale)
    M[0, 2] += tx
    M[1, 2] += ty
    return M


def warp(img, M, border=cv2.BORDER_CONSTANT):
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=border)


# ----------------------------------------------------------------- per-shot extras
_rng = np.random.default_rng(23)
RAIN = dict(x=_rng.uniform(-100, W + 100, 260), y=_rng.uniform(0, H + 200, 260), sp=_rng.uniform(1500, 2300, 260),
            ln=_rng.uniform(30, 80, 260), a=_rng.uniform(0.25, 0.8, 260))
LEAVES = dict(x=_rng.uniform(-200, W, 80), y=_rng.uniform(0.25 * H, H, 80), vx=_rng.uniform(260, 620, 80),
              vy=_rng.uniform(-260, 60, 80), r=_rng.uniform(9, 22, 80), w=_rng.uniform(3, 9, 80),
              ph=_rng.uniform(0, 6.28, 80), c=_rng.integers(0, 4, 80))
LEAF_COL = [(0.95, 0.45, 0.10), (0.85, 0.22, 0.10), (0.98, 0.70, 0.18), (0.70, 0.25, 0.12)]


def rain(f, t):
    layer = np.zeros((H, W), np.float32)
    ang = math.radians(9)
    for i in range(len(RAIN['x'])):
        y = (RAIN['y'][i] + RAIN['sp'][i] * t) % (H + 200) - 100
        x = RAIN['x'][i] + y * math.tan(ang) * 0.4
        cv2.line(layer, (int(x), int(y)), (int(x + RAIN['ln'][i] * math.sin(ang)), int(y + RAIN['ln'][i])),
                 float(RAIN['a'][i]), 1, cv2.LINE_AA)
    layer = fx.gblur(layer, 0.8)
    light = fx.gblur(fx.lum(f), 25)
    return fx.screen(f, np.clip((layer * (0.15 + 1.4 * light))[..., None] * np.array([0.95, 0.92, 1.0]) * 0.8, 0, 1))


def leaves(f, t):
    rgb = np.zeros((H, W, 3), np.float32)
    a = np.zeros((H, W), np.float32)
    for i in range(len(LEAVES['x'])):
        x = (LEAVES['x'][i] + LEAVES['vx'][i] * t) % (W + 300) - 150
        y = LEAVES['y'][i] + LEAVES['vy'][i] * t + 40 * math.sin(LEAVES['ph'][i] + t * 5)
        y = (y - 0.2 * H) % (0.85 * H) + 0.2 * H
        ang = math.degrees(LEAVES['ph'][i] + t * 9)
        ax = (int(LEAVES['r'][i]), int(max(2, LEAVES['r'][i] * 0.5 * abs(math.cos(LEAVES['ph'][i] + t * 7)) + 2)))
        cv2.ellipse(rgb, (int(x), int(y)), ax, ang, 0, 360, LEAF_COL[LEAVES['c'][i]], -1, cv2.LINE_AA)
        cv2.ellipse(a, (int(x), int(y)), ax, ang, 0, 360, 1.0, -1, cv2.LINE_AA)
    k = np.zeros((1, 15), np.float32)
    k[0, :] = 1 / 15                                           # horizontal motion blur
    rgb, a = cv2.filter2D(rgb, -1, k), cv2.filter2D(a, -1, k)
    return f * (1 - a[..., None]) + rgb


def glow(f, x, y, sigma, col, inten):
    if inten <= 0.003:
        return f
    return fx.screen(f, np.clip(fx.radial(x, y, sigma)[..., None] * np.array(col, np.float32) * inten, 0, 1))


# ----------------------------------------------------------------- one location card
def shot(name, tl, dur, t_abs, kick, fast, mode='in', title_mode='stamp'):
    """tl: time inside the shot, kick: 0..1 pulse of the bass drum, fast: after the drop."""
    Ld = layers(name)
    cfg = POSTERS[name]
    fxp, fyp = cfg['focus'][0] * W, cfg['focus'][1] * H
    e = tl / dur
    e = e if mode == 'in' else 1 - e
    punch = 0.07 * math.exp(-tl / 0.13) if fast else 0.0
    bump = 0.010 * kick
    s_bg = 1.03 + 0.045 * e + punch * 0.6 + bump
    s_fg = 1.03 + 0.105 * e + punch + bump * 1.6
    f_tx = f_ty = f_rot = 0.0
    piv = (fxp, fyp)
    if name == 'burg_hayn':                                    # the swan trembles with rage
        f_tx, f_ty = 4.5 * math.sin(2 * math.pi * 11 * t_abs), 3.0 * math.cos(2 * math.pi * 13 * t_abs)
    if name == 'fahrgasse':                                    # wheelie: the bike rocks about the rear wheel
        piv = (0.40 * W, 0.74 * H)
        f_rot = 2.2 * math.sin(2 * math.pi * t_abs / (2 * BEAT))
    Mb = sim(s_bg, fxp, fyp)
    Mf = sim(s_fg, piv[0], piv[1], f_tx, f_ty, f_rot)
    f = warp(Ld['bg'], Mb, cv2.BORDER_REFLECT101)

    if name == 'einflugschneise':                              # jet: straight approach, scaling about its VP
        vp = (0.585 * W, 0.50 * H)
        sj = 1.0 / (1.0 - (tl - 0.55 * dur) / (dur * 2.6))
        Mj = sim(sj, vp[0], vp[1])
        Mj = np.vstack([Mb, [0, 0, 1]]) @ np.vstack([Mj, [0, 0, 1]])
        ja = warp(Ld['jet'], Mj[:2])
        f = f * (1 - ja[..., None]) + warp(Ld['jet_rgb'], Mj[:2])
        for lx, ly in ((0.617, 0.062), (0.602, 0.105), (0.640, 0.105)):       # landing lights flare on the kick
            p = Mj @ np.array([lx * W, ly * H, 1.0])
            fx.add_sprite(f, SMALLSTAR, p[0], p[1], (1.0, 0.95, 0.8), 0.35 + 0.6 * kick, scale=0.8 + 0.5 * kick)

    fa = warp(Ld['fg'], Mf)
    f = f * (1 - fa[..., None]) + warp(Ld['fg_rgb'], Mf)

    # --- gags and light
    if name == 'villenkolonie':
        f = rain(f, t_abs)
    if name == 'sprendlingen':
        f = leaves(f, t_abs)
    if name == 'burgfestspiele':
        p = Mb @ np.array([0.058 * W, 0.175 * H, 1.0])
        f = glow(f, p[0], p[1], 150, (1.0, 0.25, 0.95), 0.25 + 0.55 * kick)
    if name == 'goetzenhain':
        for lx, ly in ((0.530, 0.556), (0.616, 0.603)):
            p = Mf @ np.array([lx * W, ly * H, 1.0])
            fx.add_sprite(f, STAR, p[0], p[1], (1.0, 0.92, 0.65), 0.45 + 0.5 * kick, scale=0.8 + 0.4 * kick)
    if name == 'ebbelwoi':
        p = Mf @ np.array([0.735 * W, 0.385 * H, 1.0])
        v = math.sin(math.pi * fx.clamp01((tl - 0.25) / 0.6)) ** 2
        fx.add_sprite(f, STAR, p[0], p[1], (1.0, 0.95, 0.8), v, scale=0.9)
    if name == 'bahnhof':
        p = Mb @ np.array([0.835 * W, 0.558 * H, 1.0])
        f = glow(f, p[0], p[1], 120, (1.0, 0.75, 0.4), 0.30 + 0.25 * kick)
    if name == 'offenthal':
        p = Mb @ np.array([0.278 * W, 0.353 * H, 1.0])
        f = glow(f, p[0], p[1], 140, (1.0, 0.85, 0.6), 0.22 + 0.06 * math.sin(t_abs * 2))

    # --- title lettering
    if Ld['tbox'] is not None:
        x0, y0, x1, y1 = Ld['tbox']
        tcx, tcy = (x0 + x1) / 2, (y0 + y1) / 2
        if title_mode == 'write':                              # handwriting wipe, capitals fade in afterwards
            p = fx.ease_in_out_cubic(fx.prog(tl, 0.45, 1.55))
            cut = x0 - 40 + (x1 - x0 + 120) * p
            wipe = np.clip((cut - xx) / 45.0, 0, 1)
            ycap = y0 + (0.78 if cfg['title'][0] < 0.5 else 0.80) * (y1 - y0)
            caps = np.clip((yy - ycap) / 6.0, 0, 1)
            am = wipe * (1 - caps) + caps * fx.prog(tl, 1.45, 2.0)
            Mt = sim(1.0 + 0.015 * e, tcx, tcy)
            ta = warp(Ld['title'] * am, Mt)
            f = f * (1 - ta[..., None]) + warp(Ld['title_rgb'] * am[..., None], Mt)
        else:                                                  # stamp on the beat
            u = fx.prog(tl, 0.04, 0.20)
            if u > 0:
                st = 1.0 + 0.38 * (1 - fx.ease_out_expo(u)) + 0.015 * e
                Mt = sim(st, tcx, tcy)
                ta = warp(Ld['title'], Mt) * min(1.0, u * 2.5)
                f = f * (1 - ta[..., None]) + warp(Ld['title_rgb'], Mt) * min(1.0, u * 2.5)

    if kick > 0.02:                                            # bloom breathes with the kick
        f = fx.screen(f, np.clip(fx.gblur(f, 28) * 0.16 * kick, 0, 1))
    if fast:
        c = math.exp(-tl / 0.065)
        if c > 0.02:
            f = fx.screen(f, np.clip(np.ones(3, np.float32) * np.array([1.0, 0.86, 0.95]) * 0.6 * c, 0, 1))
            f = fx.chroma_aberration(f, 12 * c)
    return f


# ----------------------------------------------------------------- cover assembly (finale)
PARTS = None
ORDER = [(0, 0), (2, 2), (1, 0), (0, 2), (3, 0), (1, 1), (2, 0), (0, 1), (3, 1), (2, 1)]
LAND_BEAT = [0, 1, 2, 3, 4, 5, 6, 6.5, 7, 7.5]
_ribbon = None


def ribbon():
    global _ribbon
    if _ribbon is None:
        rgb, a = text_layer('JETZT VERFÜGBAR. SEIT 1977.', font('Anton-Regular.ttf', 74), fill=(38, 14, 62), spacing=3)
        th, tw = a.shape
        rh, rw = th + 26, W + 200
        R = np.zeros((rh, rw, 4), np.float32)
        R[..., :3] = LIME
        R[..., 3] = 1.0
        x0, y0 = (rw - tw) // 2, (rh - th) // 2 - 4
        R[y0:y0 + th, x0:x0 + tw, :3] = R[y0:y0 + th, x0:x0 + tw, :3] * (1 - a[..., None]) + rgb * a[..., None]
        R[:5, :, :3] = np.array([1, 1, 1], np.float32)
        R[-5:, :, :3] = PURPLE
        _ribbon = R
    return _ribbon


def finale(tl, t_abs, kick, hold_extra=0.0):
    """tl = 0 at the first panel landing (a bar line)."""
    global PARTS
    if PARTS is None:
        PARTS = gta_cover.build(W, H, 'story')
    P = PARTS
    f = np.ones((H, W, 3), np.float32) * PURPLE
    f = glow(f, W / 2, H * 0.42, 620, (0.55, 0.12, 0.6), 0.5)
    shake = 0.0
    byrc = {(p['row'], p['col']): p for p in P['panels']}
    for (rc, lb) in zip(ORDER, LAND_BEAT):
        p = byrc[rc]
        dt = tl - lb * BEAT
        if dt < -0.20:
            continue
        x0, y0, x1, y1 = p['box']
        u = fx.prog(dt, -0.20, 0.0)
        if u >= 1.0:
            a = p['a'][..., None]
            f[y0:y1, x0:x1] = f[y0:y1, x0:x1] * (1 - a) + p['rgb'] * a
            fl = math.exp(-dt / 0.09)
            if fl > 0.02:
                f[y0:y1, x0:x1] = fx.screen(f[y0:y1, x0:x1], np.clip(a * 0.75 * fl, 0, 1))
                shake = max(shake, fl * 0.5)
        else:
            ee = fx.ease_in_cubic(u)
            d = np.array(p['centre']) - np.array([W / 2, H * 0.45])
            d = d / (np.linalg.norm(d) + 1e-6)
            off = d * 900 * (1 - ee)
            sc = 1.0 + 0.5 * (1 - ee)
            M = sim(sc, (x1 - x0) / 2, (y1 - y0) / 2)
            M[0, 2] += x0 + off[0]
            M[1, 2] += y0 + off[1]
            a = cv2.warpAffine(p['a'], M, (W, H), flags=cv2.INTER_LINEAR)[..., None] * min(1.0, u * 3)
            rgb = cv2.warpAffine(p['rgb'] * p['a'][..., None], M, (W, H), flags=cv2.INTER_LINEAR) * min(1.0, u * 3)
            f = f * (1 - a) + rgb

    # --- emblem slam on beat 8
    te = tl - 8 * BEAT
    ecx, ecy = P['emblem']['centre']
    if te > -0.30:
        if te < 0:
            sc = 1.0 + 2.2 * (1 - fx.ease_in_cubic(fx.prog(te, -0.30, 0.0)))
            op = fx.prog(te, -0.30, -0.12)
        else:
            u = fx.prog(te, 0.0, 0.34)
            sc = 1.0 - 0.045 * math.sin(math.pi * u) * (1 - u) + 0.012 * kick
            op = 1.0
        gta_cover.paste(f, P['emblem']['rgba'], ecx, ecy, scale=sc, opacity=op, shadow=0.55 * op)
        if te >= 0:
            d = math.exp(-te / 0.08)
            if d > 0.01:
                f = fx.screen(f, np.clip(fx.radial(ecx, ecy, 520)[..., None] * np.array([1.0, 0.85, 0.95]) * 0.8 * d, 0, 1))
            u = fx.prog(te, 0.0, 0.6)
            if u < 1:
                rr = np.sqrt((xx - ecx) ** 2 + (yy - ecy) ** 2)
                ring = np.exp(-((rr - (80 + 1400 * fx.ease_out_cubic(u))) / (12 + 36 * u)) ** 2) * (1 - u) ** 1.5
                f = fx.screen(f, np.clip(ring[..., None] * np.array([1.0, 0.6, 0.9]) * 0.7, 0, 1))
            shake = max(shake, math.exp(-te / 0.12) * 1.6)
            # shine sweeps over the emblem
            for t0 in (2 * BEAT, 10 * BEAT):
                if t0 < te < t0 + 0.7:
                    em = P['emblem']['rgba']
                    eh, ew = em.shape[:2]
                    pos = -ew * 0.7 + ew * 1.6 * fx.ease_in_out_cubic((te - t0) / 0.7)
                    ex0, ey0 = int(ecx - ew / 2), int(ecy - eh / 2)
                    gy, gx = np.mgrid[0:eh, 0:ew].astype(np.float32)
                    b = np.exp(-(((gx - ew / 2 - pos) + (gy - eh / 2) * 0.5) / 40.0) ** 2) * em[..., 3]
                    reg = f[ey0:ey0 + eh, ex0:ex0 + ew]
                    f[ey0:ey0 + eh, ex0:ex0 + ew] = fx.screen(reg, np.clip(b[..., None] * 0.6, 0, 1))
    # --- badge pops on beat 9
    tb = tl - 9 * BEAT
    if tb > 0:
        sc = fx.ease_out_back(fx.prog(tb, 0.0, 0.28), 2.2)
        gta_cover.paste(f, P['badge']['rgba'], *P['badge']['centre'], scale=max(0.05, sc))
    # --- tagline ribbon on beat 12
    tr = tl - 12 * BEAT
    if tr > -0.05:
        R = ribbon()
        u = fx.ease_out_expo(fx.prog(tr, 0.0, 0.38))
        ang = -2.6
        M = cv2.getRotationMatrix2D((R.shape[1] / 2, R.shape[0] / 2), ang, 1.0)
        M[0, 2] += W / 2 - R.shape[1] / 2 - (W + 300) * (1 - u)
        M[1, 2] += 1476 - R.shape[0] / 2
        Rw = cv2.warpAffine(R, M, (W, H), flags=cv2.INTER_LINEAR)
        sh = fx.gblur(np.roll(Rw[..., 3], 12, axis=0), 10) * 0.5
        f = f * (1 - sh[..., None])
        f = f * (1 - Rw[..., 3:4]) + Rw[..., :3] * Rw[..., 3:4]
        fl = math.exp(-tr / 0.1) if tr > 0 else 0
        if fl > 0.02:
            f = fx.screen(f, np.clip(Rw[..., 3:4] * 0.5 * fl, 0, 1))

    if kick > 0.02 and tl > 8 * BEAT:
        f = fx.screen(f, np.clip(fx.gblur(f, 28) * 0.10 * kick, 0, 1))
    push = 1.0 + 0.03 * fx.prog(tl, 8 * BEAT, 8 * BEAT + 6.0 + hold_extra)
    dx = 14 * shake * math.sin(t_abs * 97)
    dy = 11 * shake * math.cos(t_abs * 83)
    f = fx.affine(f, scale=push, cx=W / 2, cy=H * 0.44, tx=dx, ty=dy, border=cv2.BORDER_REFLECT101)
    if shake > 0.5:
        f = fx.chroma_aberration(f, 6 * (shake - 0.5))
    return f


# ----------------------------------------------------------------- small text helpers
_txt = {}


def txt(key, text, fname, size, fill, spacing=0):
    if key not in _txt:
        rgb, a = text_layer(text, font(fname, size), fill=fill, spacing=spacing)
        _txt[key] = np.dstack([rgb, a])
    return _txt[key]


def kick_pulse(t_song):
    """0..1 pulse of the bass drum (every second beat after the drop)."""
    if t_song < DROP:
        return 0.0
    dt = (t_song - DROP) % (2 * BEAT)
    return math.exp(-dt / 0.11)


# ----------------------------------------------------------------- reel: trailer
TR_T0 = DROP - 6 * BAR
TR_SHOTS = [  # (start bar, bars, name, zoom mode)
    (2, 2, 'offenthal', 'in'), (4, 2, 'villenkolonie', 'in'),
    (6, 2, 'bahnhof', 'in'), (8, 2, 'burgfestspiele', 'out'), (10, 1, 'sprendlingen', 'in'),
    (11, 1, 'burg_hayn', 'in'), (12, 2, 'einflugschneise', 'in'), (14, 1, 'ebbelwoi', 'in'),
    (15, 1, 'goetzenhain', 'out'), (16, 2, 'fahrgasse', 'in'),
]
TR_FINALE = 18
TR_DUR = 22 * BAR


_plate = None


def intro_card(t):
    f = np.ones((H, W, 3), np.float32) * PURPLE * 0.75
    f = glow(f, W / 2, H * 0.46, 560, (0.6, 0.12, 0.62), 0.55)
    a = fx.ease_out_cubic(fx.prog(t, 0.25, 1.1)) * (1 - fx.prog(t, 2 * BAR - 0.55, 2 * BAR - 0.05))
    global _plate
    if _plate is None:
        _plate = gta_cover.logo_plate(860)
    sc = 0.94 + 0.06 * fx.ease_out_cubic(fx.prog(t, 0.25, 2 * BAR))
    gta_cover.paste(f, _plate, W / 2, H * 0.42, scale=sc, opacity=a, shadow=0.45 * a)
    t2 = txt('pres2', 'PRÄSENTIERT', 'BebasNeue-Regular.ttf', 84, (200, 224, 42), spacing=26)
    gta_cover.paste(f, t2, W / 2, H * 0.42 + 250, opacity=a * fx.prog(t, 0.8, 1.5))
    return f


def trailer(t):
    ts = TR_T0 + t
    kick = kick_pulse(ts)
    bar = t / BAR
    if bar < 2:
        f = intro_card(t)
    elif bar >= TR_FINALE:
        f = finale(t - TR_FINALE * BAR, t, kick)
    else:
        f = None
        for i, (b0, nb, name, mode) in enumerate(TR_SHOTS):
            if b0 <= bar < b0 + nb:
                fast = b0 >= 6
                tl = t - b0 * BAR
                # shots run a little past their cut so the calm ones can cross-fade
                f = shot(name, tl, nb * BAR + 0.6, t, kick, fast, mode, 'stamp' if fast else 'write')
                if not fast and tl < 0.6:
                    if i == 0:
                        f = f * fx.prog(tl, 0.0, 0.6)
                    else:
                        pb0, pnb, pname, pmode = TR_SHOTS[i - 1]
                        prev = shot(pname, t - pb0 * BAR, pnb * BAR + 0.6, t, kick, False, pmode, 'write')
                        w_ = fx.ease_in_out_cubic(tl / 0.6)
                        f = prev * (1 - w_) + f * w_
                break
    f = f * (1 - 0.0)                                             # (no fade-out: the cover holds for the loop)
    return fx.finish(f, np.random.default_rng(int(t * 1000) + 7), grain_amt=0.018, vig=0.20)


# ----------------------------------------------------------------- reel: cover reveal
RV_T0 = DROP - 1 * BAR
RV_DUR = 7 * BAR


def reveal(t):
    ts = RV_T0 + t
    kick = kick_pulse(ts)
    if t < BAR:
        f = np.ones((H, W, 3), np.float32) * PURPLE * 0.7
        f = glow(f, W / 2, H * 0.45, 560, (0.6, 0.12, 0.62), 0.45)
        for k, label in enumerate(('I', 'II', 'III')):            # count-in on the last three beats
            t0 = (k + 1) * BEAT
            if t0 <= t < t0 + BEAT or (k == 2 and t >= t0):
                tl = t - t0
                g = txt('cnt' + label, label, 'Anton-Regular.ttf', 520, (250, 240, 204), spacing=26)
                sc = 1.0 + 0.5 * (1 - fx.ease_out_expo(fx.prog(tl, 0.0, 0.16)))
                gta_cover.paste(f, g, W / 2, H * 0.44, scale=sc, opacity=min(1.0, tl * 14))
                fl = math.exp(-tl / 0.08)
                f = fx.screen(f, np.clip(np.array([1.0, 0.5, 0.85], np.float32) * 0.28 * fl, 0, 1))
    else:
        f = finale(t - BAR, t, kick, hold_extra=2.0)
        c = math.exp(-(t - BAR) / 0.07)
        if c > 0.02:
            f = fx.screen(f, np.clip(np.array([1.0, 0.86, 0.95], np.float32) * 0.5 * c, 0, 1))
    return fx.finish(f, np.random.default_rng(int(t * 1000) + 9), grain_amt=0.018, vig=0.20)


# ----------------------------------------------------------------- reel: loading screen parody
LD_T0 = 0.0
LD_PHASE = 0.16                                                  # first beat of the song
LD_SHOTS = [('burg_hayn', 'TIPP', 'Schwäne am Burgweiher sind keine Nebenmission. Abstand halten.'),
            ('ebbelwoi', 'TIPP', 'Ein Gerippter Ebbelwoi füllt die Lebensenergie vollständig auf.'),
            ('bahnhof', 'TIPP', 'Die Dreieichbahn bringt dich ganz ohne Verfolgungsjagd nach Frankfurt.'),
            ('goetzenhain', 'TIPP', 'Fünf Stadtteile, null Fahndungssterne. Erkunde sie alle.')]
LD_SEG = 2 * BAR
LD_DUR = LD_PHASE + 4 * LD_SEG


def wrap(text, fnt, maxw):
    words, lines, cur = text.split(), [], ''
    for w_ in words:
        test = (cur + ' ' + w_).strip()
        if fnt.getlength(test) <= maxw:
            cur = test
        else:
            lines.append(cur)
            cur = w_
    lines.append(cur)
    return lines


_tips = {}


def tip_sprite(i):
    if i not in _tips:
        _, label, text = LD_SHOTS[i]
        fnt = font('BebasNeue-Regular.ttf', 60)
        lines = wrap(text.upper(), fnt, 590)
        rows = [np.dstack(text_layer(label, font('Anton-Regular.ttf', 44), fill=(200, 224, 42), spacing=6))]
        rows += [np.dstack(text_layer(l, fnt, fill=(250, 244, 226), spacing=2)) for l in lines]
        wmax = max(r.shape[1] for r in rows)
        hsum = sum(r.shape[0] - 26 for r in rows) + 26
        S = np.zeros((hsum, wmax, 4), np.float32)
        y = 0
        for r in rows:
            reg = S[y:y + r.shape[0], :r.shape[1]]
            a = r[..., 3:4]
            reg[..., :3] = reg[..., :3] * (1 - a) + r[..., :3] * a
            reg[..., 3] = np.maximum(reg[..., 3], r[..., 3])
            y += r.shape[0] - 26
        _tips[i] = S
    return _tips[i]


_small_emblem = None


def loading(t):
    global _small_emblem
    seg = (t - LD_PHASE) / LD_SEG
    i = int(np.clip(math.floor(seg), 0, len(LD_SHOTS) - 1))
    tl = t - LD_PHASE - i * LD_SEG

    def card(k, tloc):
        name = LD_SHOTS[k][0]
        Ld = layers(name)
        cfg = POSTERS[name]
        fxp, fyp = cfg['focus'][0] * W, cfg['focus'][1] * H
        e = tloc / (LD_SEG + 0.8)
        pan = 26 * (1 if k % 2 else -1) * (e - 0.5)
        Mb = sim(1.05 + 0.03 * e, fxp, fyp, tx=pan)
        Mf = sim(1.05 + 0.075 * e, fxp, fyp, tx=pan * 1.6)
        g = warp(Ld['bg'], Mb, cv2.BORDER_REFLECT101)
        fa = warp(Ld['fg'], Mf)
        return g * (1 - fa[..., None]) + warp(Ld['fg_rgb'], Mf)

    f = card(i, tl)
    if i > 0 and tl < 0.7:
        w_ = fx.ease_in_out_cubic(fx.clamp01(tl / 0.7))
        f = card(i - 1, tl + LD_SEG) * (1 - w_) + f * w_
    # HUD: darken top and bottom
    top = np.clip(1 - yy / 420.0, 0, 1) ** 1.5
    bot = np.clip((yy - 1150) / 520.0, 0, 1) ** 1.3
    f = f * (1 - 0.55 * top[..., None]) * (1 - 0.78 * bot[..., None])
    # stars (top right) + label
    for k in range(5):
        cx = W - 86 - k * 62
        v = 0.75 + 0.25 * math.sin(t * 3 + k)
        pts = []
        for j in range(10):
            r = 26 if j % 2 == 0 else 11
            ang = -math.pi / 2 + j * math.pi / 5
            pts.append((cx + r * math.cos(ang), 268 + r * math.sin(ang)))
        layer = np.zeros((H, W), np.uint8)
        cv2.fillPoly(layer, [np.array(pts, np.int32)], 255, cv2.LINE_AA)
        a = (layer / 255.0)[..., None] * v
        f = f * (1 - a) + LIME * a
    lab = txt('gemuet', 'GEMÜTLICHKEITSLEVEL', 'BebasNeue-Regular.ttf', 40, (250, 244, 226), spacing=5)
    gta_cover.paste(f, lab, W - 60 - lab.shape[1] / 2 + 12, 330)
    # spinner + label (top left)
    ang = (t * 300) % 360
    ring = np.zeros((H, W), np.uint8)
    cv2.ellipse(ring, (92, 276), (26, 26), 0, ang, ang + 270, 255, 7, cv2.LINE_AA)
    a = (ring / 255.0)[..., None]
    f = f * (1 - a) + CREAM * a
    dots = '.' * (1 + int(t * 2.2) % 3)
    lt = txt('lade' + dots, 'LADE DREIEICH ' + dots, 'BebasNeue-Regular.ttf', 52, (250, 244, 226), spacing=5)
    gta_cover.paste(f, lt, 140 + lt.shape[1] / 2, 280)
    # emblem + tip (lower third, inside the app-safe zone)
    if _small_emblem is None:
        em = imread(os.path.join(CACHE, 'emblem.png')).astype(np.float32) / 255
        _small_emblem = cv2.resize(em, (270, int(270 * em.shape[0] / em.shape[1])), interpolation=cv2.INTER_AREA)
    gta_cover.paste(f, _small_emblem, 60 + 135, 1440, shadow=0.4)
    tip = tip_sprite(i)
    a_in = fx.ease_out_cubic(fx.prog(tl, 0.25, 0.7)) * (1 - fx.prog(tl, LD_SEG - 0.3, LD_SEG - 0.02) * (i < len(LD_SHOTS) - 1))
    gta_cover.paste(f, tip, 370 + tip.shape[1] / 2 + 30 * (1 - a_in), 1440, opacity=a_in)
    f = f * fx.ease_out_cubic(fx.prog(t, 0.0, 0.5))
    return fx.finish(f, np.random.default_rng(int(t * 1000) + 11), grain_amt=0.018, vig=0.18)


REELS = {
    'trailer': dict(fn=trailer, dur=TR_DUR, t0=TR_T0, name='gta_trailer',
                    preview=[1.2, 5.0, 9.0, 11.45, 12.5, 16.0, 19.2, 21.2, 23.5, 27.2, 29.0, 31.5, 34.6, 35.6, 37.0, 38.2,
                             39.3, 40.2, 41.0, 41.8]),
    'reveal': dict(fn=reveal, dur=RV_DUR, t0=RV_T0, name='gta_cover_reveal',
                   preview=[0.6, 1.1, 1.6, 1.93, 2.4, 3.4, 4.6, 5.55, 5.75, 6.2, 8.0, 12.9]),
    'loading': dict(fn=loading, dur=LD_DUR, t0=LD_T0, name='gta_loading',
                    preview=[0.3, 1.5, 3.6, 4.2, 6.0, 8.0, 10.0, 12.0, 14.0, 15.2]),
}

if __name__ == '__main__':
    reel = REELS[sys.argv[1]]
    mode = sys.argv[2]
    SP = os.environ.get('SP', '/tmp')
    if mode == 'preview':
        from runner import contact_sheet
        times = [float(x) for x in sys.argv[3:]] or reel['preview']
        contact_sheet(reel['fn'], times, os.path.join(SP, reel['name'] + '_sheet.png'), cols=5, thumb_w=216)
        print('sheet ->', os.path.join(SP, reel['name'] + '_sheet.png'))
    elif mode == 'frame':
        fx.save_png(os.path.join(SP, f"{reel['name']}_{float(sys.argv[3]):.2f}.png"), reel['fn'](float(sys.argv[3])))
    elif mode == 'render':
        i, n = int(sys.argv[3]), int(sys.argv[4])
        total = int(round(reel['dur'] * FPS))
        f0, f1 = total * i // n, total * (i + 1) // n
        os.makedirs(os.path.join(SP, 'master'), exist_ok=True)
        w = fx.Writer(os.path.join(SP, 'master', f"{reel['name']}_part{i}.mp4"), crf=16)
        for k in range(f0, f1):
            w.write(reel['fn'](k / FPS))
            if (k - f0) % 60 == 0:
                print(f"{reel['name']} part {i}: {k - f0}/{f1 - f0}", flush=True)
        w.close()
        print('done part', i)
