"""V3 'Welcome to Dreieich' — golden-hour Googie sign (9:16, 8 s).

2.5D parallax push-in (sign layer from an ISNet cutout grows faster than the
background), the neon outline on the triangle stutters on, the marquee bulbs
switch on left-to-right and then chase, an all-bulb flash, animated sun flare
with lens ghosts and floating golden dust.

The jet flies a physically consistent final approach: a straight line at
constant speed, nose first, descending on a ~3° glide path towards (and over)
the camera.  For straight-line motion the projected position and the apparent
size scale together about the path's vanishing point VP:
    p(t) = VP + s(t) * (p_ref - VP),   s(t) = Z_ref / Z(t) = 1 / (1 - (t - t_ref) / T_c)
VP is where the fuselage axis, extended backwards past the tail, meets the
glide-path elevation just above the horizon.  The jet emerges from behind the
sign, grows and accelerates in screen space, and passes overhead out of frame.
It carries real aircraft lighting (steady landing lights with glare, red/green
wing-tip navigation lights on the correct sides, double-flash white strobes,
red belly beacon), atmospheric haze while far away, occlusion by the sign and
trees, and 180°-shutter motion blur.
"""
import math
import os

import cv2
import numpy as np

import fx
from fx import H, W, P
from runner import main

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)

IMG = fx.load_plate(L('raw', 'v3_welcome_a_916.png'))
src45 = fx.imread_rgb(L('raw', 'v3_welcome_a_916.png'))[270:1550]
hsv45 = cv2.cvtColor(cv2.cvtColor(src45, cv2.COLOR_RGB2BGR), cv2.COLOR_BGR2HSV).astype(np.int32)
Hh, Ss, Vv = hsv45[..., 0], hsv45[..., 1], hsv45[..., 2]
yy45, xx45 = np.mgrid[0:1280, 0:1024].astype(np.float32)

# ------------------------------------------------------------------ masks
SIGN = fx.gblur(fx.mask45_to_out(fx.load_mask45(L('tools', 'cut', 'v3_welcome_a_isnet_mask.png'))), 0.8)
PLANE45 = fx.load_mask45(L('tools', 'masks', 'v3_plane.png'))
PLANE = fx.gblur(fx.mask45_to_out(PLANE45), 0.8)

# marquee bulbs: explicit centres (4:5 coords), each with its own id for the chase
BULBS45 = [(127, 182), (175, 199), (218, 213), (262, 228), (303, 242), (343, 256), (381, 269), (418, 281),
           (513, 320), (547, 334), (578, 348), (607, 362), (638, 375), (662, 391), (689, 407), (712, 424),
           (730, 443), (755, 457)]
NB = len(BULBS45)
core45 = np.zeros((1280, 1024), np.float32)
halo_id45 = np.zeros((1280, 1024), np.uint8)
for k, (bx, by) in enumerate(BULBS45):
    cv2.circle(halo_id45, (bx, by), 24, k + 1, -1)
for k, (bx, by) in enumerate(BULBS45):
    disc = np.zeros((1280, 1024), np.uint8)
    cv2.circle(disc, (bx, by), 12, 1, -1)
    bright = (disc > 0) & (Vv > 170)
    small = np.zeros((1280, 1024), np.uint8)
    cv2.circle(small, (bx, by), 7, 1, -1)
    core45 = np.maximum(core45, ((bright | (small > 0))).astype(np.float32))
canvas = np.zeros((1820, 1024), np.uint8)
canvas[270:1550] = halo_id45
BULB_ID = cv2.resize(canvas, (W, H), interpolation=cv2.INTER_NEAREST).astype(np.int32)
BULB = fx.mask45_to_out(core45)
BULB_CORE = np.clip(fx.gblur(BULB, 1.0) * 1.2, 0, 1)
BULB_HALO = np.clip(fx.gblur(BULB, 8) * 3.0, 0, 1) * (1 - BULB_CORE) * (BULB_ID > 0)
BULB_GLOW = np.maximum(BULB_CORE, BULB_HALO)

# neon outline of the triangle crown (bright lime/yellow-white on the edges)
crown = (xx45 > 340) & (xx45 < 610) & (yy45 > 40) & (yy45 < 350)
neon45 = crown & (Vv > 225) & (((Hh > 25) & (Hh < 60)) | (Ss < 90))
neon45 = neon45.astype(np.float32)
NEON = fx.mask45_to_out(neon45)
NEON_GLOW = np.maximum(cv2.dilate(NEON, np.ones((3, 3), np.uint8)), np.clip(fx.gblur(NEON, 6) * 2.4, 0, 1))

# background plate without the plane: Poisson-clone real cloud texture from 200 px above into the
# plane's silhouette (gradient-domain blending matches the tones at the boundary, no smudge)
src916 = cv2.imread(L('raw', 'v3_welcome_a_916.png'))
pm916 = np.zeros((1820, 1024), np.uint8)
pm916[270:1550] = (PLANE45 * 255).astype(np.uint8)
hole916 = (cv2.dilate((pm916 > 60).astype(np.uint8), np.ones((13, 13), np.uint8)) * 255).astype(np.uint8)
hole916[:, 1018:] = 0
_ys, _xs = np.nonzero(hole916)
clean916 = cv2.seamlessClone(np.roll(src916, 200, axis=0), src916, hole916,
                             (int((_xs.min() + _xs.max()) // 2), int((_ys.min() + _ys.max()) // 2)), cv2.NORMAL_CLONE)
BG = fx.to_float(cv2.resize(cv2.cvtColor(clean916, cv2.COLOR_BGR2RGB), (W, H), interpolation=cv2.INTER_LANCZOS4))

# off states (relative to the plane-free background plate)
BASE = BG
bulb_off = BASE * 0.20 + np.array([0.17, 0.13, 0.10], np.float32) * 0.55
OFF = BASE * (1 - BULB_CORE[..., None]) + bulb_off * BULB_CORE[..., None]
OFF = OFF * (1 - 0.38 * BULB_HALO[..., None])
neon_off = BASE * 0.42 + np.array([0.05, 0.07, 0.04], np.float32)
OFF = OFF * (1 - NEON_GLOW[..., None]) + neon_off * NEON_GLOW[..., None]
DB = BASE - OFF                                    # light added by bulbs + neon

SIGN_C = P(430, 480)
SUN = P(632, 935)

# ------------------------------------------------------------------ jet: sprite, path, lights
_pys, _pxs = np.nonzero(PLANE > 0.02)
PX0, PX1, PY0, PY1 = _pxs.min() - 4, _pxs.max() + 5, _pys.min() - 4, _pys.max() + 5
PLANE_A = PLANE[PY0:PY1, PX0:PX1].copy()
PLANE_RGB = (IMG * PLANE[..., None])[PY0:PY1, PX0:PX1].copy()          # premultiplied
VP = P(308, 900)            # fuselage axis (nose (901,203) -> tail (765,363)) meets the glide path elevation
T_REF, T_C = 5.4, 4.8       # at T_REF the jet is exactly where it is in the photo; T_C = Z_ref / |Vz|
HAZE = BG[PY0:PY1, PX0:PX1].reshape(-1, 3).mean(0)
NAV_GREEN, NAV_RED = P(599, 279), P(1009, 313)        # aircraft right wing is on image left (it faces us)
TAIL = P(765, 363)
BEACON = P(817, 303)
LANDING = [P(877, 250), P(802, 310), P(855, 315)]
LSTAR = fx.star_sprite(121, ray_len=0.46, ray_w=0.9, core=0.05)
TREES = np.clip((0.30 - fx.lum(BG)) / 0.08, 0, 1) * (np.mgrid[0:H, 0:W][0] > 1000)   # dark foliage occludes


def jet_scale(t):
    return 1.0 / (1.0 - (t - T_REF) / T_C)


def jet_xform(t, s_bg, cx, cy):
    """Sprite-local -> output affine for time t (path scaling about VP, then the camera zoom)."""
    s = jet_scale(t)
    k = s_bg * s
    tx = cx + s_bg * (VP[0] + s * (PX0 - VP[0]) - cx)
    ty = cy + s_bg * (VP[1] + s * (PY0 - VP[1]) - cy)
    return s, np.float32([[k, 0, tx], [0, k, ty]])


def jet_point(p, t, s_bg, cx, cy):
    s = jet_scale(t)
    return (cx + s_bg * (VP[0] + s * (p[0] - VP[0]) - cx), cy + s_bg * (VP[1] + s * (p[1] - VP[1]) - cy))


def jet_layer(t, s_bg, cx, cy):
    """Motion-blurred (180° shutter) premultiplied RGB + alpha of the jet."""
    s0 = jet_scale(t)
    speed = np.hypot(*(np.array(VP) - np.array(P(803, 278)))) * s0 * s0 / T_C / fx.FPS   # px per frame
    n = int(np.clip(np.ceil(speed / 1.5), 1, 12))
    acc_rgb = np.zeros((H, W, 3), np.float32)
    acc_a = np.zeros((H, W), np.float32)
    for i in range(n):
        ts = t - (0.5 / fx.FPS) * (i / max(1, n - 1)) if n > 1 else t
        s, M = jet_xform(ts, s_bg, cx, cy)
        rgb, a = PLANE_RGB, PLANE_A
        if s * s_bg < 0.85:                                  # pre-filter before minifying
            sig = 0.5 * (1 / (s * s_bg) - 1)
            rgb, a = cv2.GaussianBlur(rgb, (0, 0), sig), cv2.GaussianBlur(a, (0, 0), sig)
        acc_rgb += cv2.warpAffine(rgb, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
        acc_a += cv2.warpAffine(a, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    rgb, a = acc_rgb / n, acc_a / n
    haze = float(np.clip(0.32 * (1 - s0), 0, 0.25))          # aerial perspective while far away
    rgb = rgb * (1 - haze) + HAZE * a[..., None] * haze
    return rgb, a


def jet_lights(t):
    """(position, colour, intensity, size) of every aircraft light at time t."""
    out = []
    s = jet_scale(t)
    near = float(np.clip(s, 0.3, 2.2))
    out.append(('nav', NAV_GREEN, (0.35, 1.0, 0.45), 0.55, 0.30 * near ** 0.5))
    out.append(('nav', NAV_RED, (1.0, 0.22, 0.18), 0.55, 0.30 * near ** 0.5))
    ph = (t + 0.37) % 1.0                                       # Airbus-style double-flash strobes, 1 s cycle
    strobe = 1.0 if (ph < 0.045 or 0.12 < ph < 0.165) else 0.0
    if strobe:
        for p_ in (NAV_GREEN, NAV_RED, TAIL):
            out.append(('strobe', p_, (1.0, 1.0, 1.0), 1.0, 0.55 * near ** 0.5))
    if ((t + 0.81) % 1.1) < 0.09:                               # red anti-collision beacon, belly
        out.append(('beacon', BEACON, (1.0, 0.15, 0.10), 0.95, 0.42 * near ** 0.5))
    land = float(np.clip(0.25 + 0.35 * (s - 0.5), 0.15, 0.95))  # landing lights point at us: brighter as it nears
    for p_ in LANDING:
        out.append(('landing', p_, (1.0, 0.93, 0.80), land, 0.42 * near ** 0.6))
    return out
STAR = fx.star_sprite(401, rays=6, ray_len=0.5, ray_w=1.5, rot=8)
PARTS = fx.bokeh_field(np.random.default_rng(9), 60, rmin=2, rmax=7)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def bulb_level(t):
    """Per-bulb levels mapped to a per-pixel field via the bulb id map."""
    lv = np.zeros(NB + 1, np.float32)
    for k in range(NB):
        t_on = 1.0 + 0.85 * k / (NB - 1)
        if t < t_on:
            v = 0.0
        elif t < t_on + 0.08:
            v = 0.6 if int((t - t_on) * 100) % 2 else 0.15
        else:
            v = 1.0
        if t >= 2.0:
            ph = (k / 3.0 - 1.7 * (t - 2.0)) * 2 * math.pi
            chase = 0.32 + 0.68 * ((1 + math.cos(ph)) / 2) ** 3
            w = fx.prog(t, 2.0, 2.4)
            v = v * (1 - w) + chase * w
        if k == 3:                      # one tired bulb, like in the original render
            v *= 0.35
        flash = math.exp(-((t - 4.75) / 0.12) ** 2) + math.exp(-((t - 5.05) / 0.12) ** 2)
        lv[k + 1] = max(v, min(1.0, flash))
    return lv[BULB_ID]


def neon_level(t):
    pat = [(0.55, 0.60, 0.8), (0.60, 0.66, 0.05), (0.66, 0.70, 0.6), (0.70, 0.80, 0.1), (0.80, 0.86, 1.0),
           (0.86, 0.89, 0.3)]
    if t < 0.55:
        return 0.0
    for a, b, v in pat:
        if a <= t < b:
            return v
    return 0.96 + 0.04 * math.sin(t * 37.0)


def frame(t):
    rng = np.random.default_rng(int(t * 1000) + 31)
    bl = bulb_level(t)
    nl = neon_level(t)
    lv = (BULB_GLOW * bl + NEON_GLOW * nl) / np.maximum(BULB_GLOW + NEON_GLOW, 1e-4)
    lit = OFF + DB * lv[..., None]
    # bulbs that are on also throw a soft warm halo onto the sign
    lit = fx.screen(lit, np.clip(fx.gblur(BULB_CORE * bl, 10)[..., None] * np.array([1.0, 0.8, 0.5]) * 1.4, 0, 1))
    # extra bloom when the bulbs flash
    flash = math.exp(-((t - 4.75) / 0.12) ** 2) + math.exp(-((t - 5.05) / 0.12) ** 2)
    if flash > 0.02:
        lit = fx.screen(lit, np.clip(fx.gblur(DB * BULB_GLOW[..., None], 14) * 2.5 * flash, 0, 1))

    # parallax camera: background grows slower than the sign
    u = fx.ease_in_out_cubic(fx.prog(t, 0.0, 8.0))
    s_bg = 1.0 + 0.045 * u
    s_sign = 1.0 + 0.095 * u
    cx, cy = SIGN_C
    bg = fx.affine(lit, scale=s_bg, cx=cx, cy=cy)
    f = bg
    # the jet: straight-line approach, drawn between sky and sign, hidden by foreground foliage
    if jet_scale(t) > 0.3:
        jrgb, ja = jet_layer(t, s_bg, cx, cy)
        vis = 1 - TREES
        f = f * (1 - (ja * vis)[..., None]) + jrgb * vis[..., None]
        sa_now = fx.affine(SIGN, scale=s_sign, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT)
        for kind, p_, col, inten, size in jet_lights(t):
            lx, ly = jet_point(p_, t, s_bg, cx, cy)
            if not (0 <= lx < W and 0 <= ly < H):
                continue
            occl = max(float(sa_now[int(ly), int(lx)]), float(TREES[int(ly), int(lx)]))
            if occl > 0.5:
                continue
            fx.add_sprite(f, LSTAR, lx, ly, col, inten * (1 - occl), scale=size)
    sa = fx.affine(SIGN, scale=s_sign, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT)
    srgb = fx.affine(lit * SIGN[..., None], scale=s_sign, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT)
    f = f * (1 - sa[..., None]) + srgb

    # sun flare (follows the background) + lens ghosts
    sx = cx + (SUN[0] - cx) * s_bg
    sy = cy + (SUN[1] - cy) * s_bg
    pulse = 0.75 + 0.25 * math.sin(t * 2.1)
    glow = fx.radial(sx, sy, 120) * 0.55 + fx.radial(sx, sy, 380) * 0.25
    f = fx.screen(f, np.clip(glow[..., None] * np.array([1.0, 0.72, 0.38]) * pulse, 0, 1))
    rot = fx.affine(STAR, scale=1.0, cx=STAR.shape[1] / 2, cy=STAR.shape[0] / 2, rot=t * 6,
                    border=cv2.BORDER_CONSTANT)
    fx.add_sprite(f, rot, sx, sy, (1.0, 0.85, 0.6), 0.55 * pulse, scale=1.5)
    for k, (fac, rad, col) in enumerate(((0.55, 40, (0.6, 1.0, 0.8)), (0.25, 70, (1.0, 0.5, 0.9)),
                                          (-0.35, 26, (0.7, 0.8, 1.0)), (-0.75, 90, (1.0, 0.8, 0.5)))):
        gx = W / 2 + (sx - W / 2) * fac
        gy = H / 2 + (sy - H / 2) * fac
        ring = fx.radial(gx, gy, rad) - 0.65 * fx.radial(gx, gy, rad * 0.7)
        f = fx.screen(f, np.clip(np.clip(ring, 0, 1)[..., None] * np.array(col) * 0.10, 0, 1))
    f = fx.draw_bokeh(f, PARTS, t, color=(1.0, 0.82, 0.5), opacity=0.35)

    # intro: fade up from warm black
    fade = fx.ease_out_cubic(fx.prog(t, 0.0, 0.6))
    f = f * fade
    return fx.finish(f, rng, grain_amt=0.022, vig=0.25)


if __name__ == '__main__':
    os.environ.setdefault('SP', '/tmp')
    main(frame, 'v3_welcome_sign', 8.0, [0.3, 0.9, 1.6, 2.6, 3.4, 4.0, 4.6, 5.4, 6.0, 6.6, 7.1, 7.7], poster_t=5.4)
