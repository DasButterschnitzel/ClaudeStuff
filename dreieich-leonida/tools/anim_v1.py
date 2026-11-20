"""V1 'Sunset Triangle' — flagship logo reveal (9:16, 8 s).

Beats: anamorphic power-on streak -> triangle opens with the sunset zooming
in -> chrome swoosh orbits in (comet head) -> "drei/eich" slams in with flash,
shockwave, shake and chromatic split -> tagline wipes open -> living hold
(sun pulse, light sweeps over the letters, glints, rising bokeh, slow push-in).
"""
import json
import math
import os

import cv2
import numpy as np

import fx
from fx import H, W, P
from runner import main

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)

F = fx.load_plate(L('raw', 'v1_sunset_b_916.png'))
full916 = fx.imread_rgb(L('raw', 'v1_sunset_b_916.png'))
plate45 = fx.imread_rgb(L('tools', 'layers', 'v1_plate45.png'))
pl916 = full916.copy()
pl916[270:270 + 1280] = plate45
PL = fx.to_float(cv2.resize(pl916, (W, H), interpolation=cv2.INTER_LANCZOS4))

m = lambda n: fx.mask45_to_out(fx.load_mask45(L('tools', 'layers', n)))
TXT = m('v1_text45.png')
TAG = m('v1_tag45.png')
LET = fx.gblur(m('v1_letters45.png'), 1.0)
TRI = fx.gblur(m('v1_tri45.png'), 1.5)
INNER = m('v1_inner45.png')
SW0 = m('v1_swoosh45.png')
SW = fx.gblur(cv2.dilate(SW0, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (37, 37))), 3.0) * (1 - fx.gblur(TXT, 4))
geo = json.load(open(L('tools', 'layers', 'v1_geo.json')))
CX, CY = P(*geo['centroid'])
TXC = P(512, 785)
TGC = P(512, 985)
SUN = P(*geo['sun'])

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
ANG = np.degrees(np.arctan2(yy - CY, xx - CX))           # -180..180, clockwise in image coords
ANG = np.where(ANG < -120, ANG + 360, ANG)                # unwrap so the sweep runs -120 .. 240
OUTSIDE = 1 - TRI
# background-only plate: the dark purple field with the triangle/swoosh/text areas filled smoothly
_known = (OUTSIDE * (1 - SW) * (1 - TXT)).astype(np.float32)
_num = fx.gblur(PL * _known[..., None], 40)
_den = fx.gblur(_known, 40)[..., None]
_fill = _num / np.maximum(_den, 1e-3)
BG_ONLY = PL * _known[..., None] + _fill * (1 - _known[..., None])
STAR = fx.star_sprite(301)
STAR6 = fx.star_sprite(401, rays=3, ray_len=0.5, ray_w=1.3, rot=15)
rng_parts = np.random.default_rng(3)
PARTS = fx.bokeh_field(rng_parts, 46)
SUN_GLOW = fx.radial(SUN[0], SUN[1], 70) * INNER
TEXT_RGB = F * TXT[..., None]
TAG_RGB = F * TAG[..., None]
T_IMP = 1.80


def tri_mask_scaled(s):
    if s >= 0.999:
        return TRI
    return fx.affine(TRI, scale=max(s, 1e-3), cx=CX, cy=CY, border=cv2.BORDER_CONSTANT)


def layer_at_scale(rgb_premul, alpha, s, cx, cy):
    return (fx.affine(rgb_premul, scale=s, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT),
            fx.affine(alpha, scale=s, cx=cx, cy=cy, border=cv2.BORDER_CONSTANT))


def text_scale(t):
    if t < T_IMP:
        u = fx.prog(t, 1.42, T_IMP)
        return 2.35 - 1.35 * fx.ease_in_cubic(u)
    u = fx.prog(t, T_IMP, T_IMP + 0.32)
    return 1.0 - 0.035 * math.sin(math.pi * u) * (1 - u)


def frame(t):
    rng = np.random.default_rng(int(t * 1000) + 11)
    f = np.zeros((H, W, 3), np.float32)

    # --- background + bloom fade in
    bg_a = fx.ease_out_cubic(fx.prog(t, 0.15, 1.1))
    f += BG_ONLY * bg_a

    # --- triangle opens: mask scales up, the sunset settles from a zoom
    s_tri = fx.ease_out_expo(fx.prog(t, 0.30, 1.15))
    if s_tri > 0:
        tm = tri_mask_scaled(s_tri)
        zoom = 1.22 - 0.22 * fx.ease_out_cubic(fx.prog(t, 0.30, 1.75))
        content = fx.affine(PL, scale=zoom, cx=CX, cy=CY)
        f = f * (1 - tm[..., None]) + content * tm[..., None]
        # glowing lime rim on the opening edge
        rim = np.clip(tm - fx.gblur(tm, 5), 0, 1)
        rim_i = 2.2 * (1 - fx.prog(t, 0.9, 1.6)) * (1 if t > 0.3 else 0)
        if rim_i > 0.01:
            rim_g = fx.gblur(rim, 3) + 0.6 * fx.gblur(rim, 14)
            f = fx.screen(f, np.clip(rim_g[..., None] * np.array([0.78, 1.0, 0.35]) * rim_i, 0, 1))

    # --- swoosh orbits in (polar wipe around the centroid) with a comet head
    th = -125 + 365 * fx.ease_in_out_cubic(fx.prog(t, 0.72, 1.55))
    wipe = np.clip((th - ANG) / 9.0, 0, 1)
    swa = SW * OUTSIDE * wipe
    f = f * (1 - swa[..., None]) + PL * swa[..., None]
    if 0.72 < t < 1.75:
        head = SW * np.exp(-((ANG - th) / 7.0) ** 2) * (1 - fx.prog(t, 1.5, 1.75))
        hg = fx.gblur(head, 4) * 1.6 + fx.gblur(head, 22) * 2.4
        f = fx.screen(f, np.clip(hg[..., None] * np.array([0.75, 0.88, 1.0]), 0, 1))

    # --- wordmark slam
    if t >= 1.42:
        a_in = fx.ease_out_cubic(fx.prog(t, 1.42, 1.58))
        if t < T_IMP:                             # motion blur on the approach
            acc_rgb = np.zeros_like(f)
            acc_a = np.zeros((H, W), np.float32)
            subs = 4
            for k in range(subs):
                ts = t - k * (1 / fx.FPS) / subs
                s = text_scale(max(ts, 1.42))
                r_, a_ = layer_at_scale(TEXT_RGB, TXT, s, *TXC)
                acc_rgb += r_
                acc_a += a_
            rgb, a = acc_rgb / subs, acc_a / subs
        else:
            rgb, a = layer_at_scale(TEXT_RGB, TXT, text_scale(t), *TXC)
        f = f * (1 - (a * a_in)[..., None]) + rgb * a_in

    # --- tagline wipes open from the centre
    if t >= 2.05:
        u = fx.ease_out_cubic(fx.prog(t, 2.05, 2.6))
        half = 20 + 300 * u
        wm = np.clip((half - np.abs(xx - TGC[0])) / 18.0, 0, 1)
        ta = TAG * wm
        f = f * (1 - ta[..., None]) + TAG_RGB * wm[..., None]
        edge = TAG * np.exp(-((np.abs(xx - TGC[0]) - half) / 10.0) ** 2) * (1 - u)
        f = fx.screen(f, np.clip(fx.gblur(edge, 3)[..., None] * 2.0, 0, 1))

    # --- living hold
    if t > 1.0:
        pulse = 0.10 + 0.06 * math.sin(2 * math.pi * (t - 1.0) / 2.4)
        f = fx.screen(f, np.clip(SUN_GLOW[..., None] * np.array([1.0, 0.75, 0.35]) * pulse * min(1, (t - 1.0) * 2), 0, 1))
    for t0, dur in ((3.05, 0.65), (6.05, 0.65)):
        if t0 <= t <= t0 + dur:
            u = fx.ease_in_out_cubic((t - t0) / dur)
            pos = -500 + 1500 * u
            b = fx.band((H, W), pos, -62, 34, origin=(TXC[0] - 420, TXC[1]))
            sweep = b * LET
            f = fx.screen(f, np.clip(sweep[..., None] * np.array([1.0, 0.92, 1.0]) * 0.85, 0, 1))
    if t > 1.8:
        f = fx.draw_bokeh(f, PARTS, t, color=(1.0, 0.42, 0.85), opacity=0.32 * fx.prog(t, 1.8, 2.6))

    # glints
    for (gx, gy), t0, sc in (((528, 158), 2.55, 1.0), ((990, 252), 4.45, 0.8), ((62, 640), 5.35, 0.75),
                             ((512, 1150), 6.9, 0.9), ((528, 158), 7.55, 0.7)):
        if t0 - 0.05 < t < t0 + 0.6:
            u = (t - t0) / 0.55
            inten = math.sin(math.pi * fx.clamp01(u)) ** 1.5
            px, py = P(gx, gy)
            fx.add_sprite(f, STAR, px, py, (1.0, 0.95, 1.0), inten, scale=sc * (0.7 + 0.5 * inten))

    # --- impact: flash, ring, glint, split, shake
    if t >= T_IMP:
        d = fx.decay(t, T_IMP, 0.07)
        if d > 0.01:
            f = fx.screen(f, np.clip(fx.radial(TXC[0], TXC[1], 360)[..., None] * np.array([1.0, 0.8, 0.95]) * 0.55 * d, 0, 1))
        u = fx.prog(t, T_IMP, T_IMP + 0.55)
        if u < 1:
            r = 60 + 1250 * fx.ease_out_cubic(u)
            rr = np.sqrt((xx - TXC[0]) ** 2 + (yy - TXC[1]) ** 2)
            ring = np.exp(-((rr - r) / (10 + 30 * u)) ** 2) * (1 - u) ** 1.6
            f = fx.screen(f, np.clip(ring[..., None] * np.array([1.0, 0.55, 0.9]) * 0.65, 0, 1))
        gl = fx.decay(t, T_IMP, 0.16)
        fx.add_sprite(f, STAR6, TXC[0] + 250, TXC[1] - 150, (1.0, 0.9, 1.0), 0.9 * gl, scale=1.6)

    # --- opening streak
    if t < 0.75:
        u = fx.prog(t, 0.0, 0.5)
        wid = 40 + 1100 * fx.ease_out_expo(u)
        streak = np.exp(-((yy - CY) / (2.5 + 5 * u)) ** 2) * np.clip(1 - np.abs(xx - CX) / wid, 0, 1)
        streak_i = math.sin(math.pi * fx.prog(t, 0.0, 0.75))
        f = fx.screen(f, np.clip((fx.gblur(streak, 2) * 1.2 + fx.gblur(streak, 16) * 1.5)[..., None]
                                 * np.array([1.0, 0.45, 0.95]) * streak_i, 0, 1))

    # --- camera: push-in, impact shake + chromatic split
    push = 1.0 + 0.045 * fx.ease_in_out_cubic(fx.prog(t, 2.0, 8.0))
    sh = fx.decay(t, T_IMP, 0.11) if t >= T_IMP else 0
    dx = 16 * sh * math.sin(t * 93.0)
    dy = 12 * sh * math.cos(t * 71.0)
    f = fx.affine(f, scale=push, cx=W / 2, cy=H * 0.47, tx=dx, ty=dy)
    if sh > 0.02:
        f = fx.chroma_aberration(f, 9 * sh)
    return fx.finish(f, rng, grain_amt=0.02, vig=0.25)


if __name__ == '__main__':
    os.environ.setdefault('SP', '/tmp')
    main(frame, 'v1_sunset_triangle', 8.0,
         [0.1, 0.4, 0.7, 0.95, 1.2, 1.5, 1.7, 1.83, 1.95, 2.3, 3.3, 7.9], poster_t=7.9)
