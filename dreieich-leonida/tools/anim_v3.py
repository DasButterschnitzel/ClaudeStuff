"""V3 'Welcome to Dreieich' — golden-hour Googie sign (9:16, 8 s).

2.5D parallax push-in (sign layer from an ISNet cutout grows faster than the
background), the neon outline on the triangle stutters on, the marquee bulbs
switch on left-to-right and then chase, an all-bulb flash, the jet drifts on
its approach, animated sun flare with lens ghosts and floating golden dust.
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

# background plate without the plane (sky inpaint)
img8 = (IMG * 255).astype(np.uint8)
hole = (cv2.dilate((PLANE > 0.2).astype(np.uint8), np.ones((15, 15), np.uint8)) * 255)
BG = fx.to_float(cv2.inpaint(img8, hole, 12, cv2.INPAINT_TELEA))
BG = fx.gblur(BG, 0.6) * (hole[..., None] / 255.0) + IMG * (1 - hole[..., None] / 255.0)

# off states (relative to the plane-free background plate)
BASE = BG
bulb_off = BASE * 0.20 + np.array([0.17, 0.13, 0.10], np.float32) * 0.55
OFF = BASE * (1 - BULB_CORE[..., None]) + bulb_off * BULB_CORE[..., None]
OFF = OFF * (1 - 0.38 * BULB_HALO[..., None])
neon_off = BASE * 0.42 + np.array([0.05, 0.07, 0.04], np.float32)
OFF = OFF * (1 - NEON_GLOW[..., None]) + neon_off * NEON_GLOW[..., None]
DB = BASE - OFF                                    # light added by bulbs + neon

SIGN_C = P(430, 480)
PLANE_C = P(800, 275)
SUN = P(632, 935)
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
    # plane drifts on approach (left/up, slightly growing), drawn over the sky
    pm = fx.affine(PLANE, scale=1.0 + 0.07 * u, cx=PLANE_C[0], cy=PLANE_C[1], tx=-95 * u, ty=-30 * u,
                   border=cv2.BORDER_CONSTANT)
    prgb = fx.affine(IMG * PLANE[..., None], scale=1.0 + 0.07 * u, cx=PLANE_C[0], cy=PLANE_C[1], tx=-95 * u,
                     ty=-30 * u, border=cv2.BORDER_CONSTANT)
    pm = fx.affine(pm, scale=s_bg, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT)
    prgb = fx.affine(prgb, scale=s_bg, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT)
    f = bg * (1 - pm[..., None]) + prgb
    sa = fx.affine(SIGN, scale=s_sign, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT)
    srgb = fx.affine(lit * SIGN[..., None], scale=s_sign, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT)
    f = f * (1 - sa[..., None]) + srgb

    # sun flare (follows the background) + lens ghosts
    sx = cx + (SUN[0] - cx) * s_bg
    sy = cy + (SUN[1] - cy) * s_bg
    pulse = 0.75 + 0.25 * math.sin(t * 2.1)
    glow = fx.radial(sx, sy, 120) * 0.55 + fx.radial(sx, sy, 380) * 0.25
    f = fx.screen(f, np.clip(glow[..., None] * np.array([1.0, 0.72, 0.38]) * pulse, 0, 1))
    star_rot = STAR if True else None
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
    main(frame, 'v3_welcome_sign', 8.0, [0.3, 0.62, 0.9, 1.3, 1.6, 1.95, 2.5, 3.2, 4.75, 5.3, 6.5, 7.9], poster_t=7.4)
