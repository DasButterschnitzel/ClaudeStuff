"""V5b 'Greetings from Dreieich' (Dreieich edition) — the photo postcard lands on an
apple-wine garden table (9:16, 8 s).

Same choreography as V5: the card drops in with spin, settles with a bounce and a
growing contact shadow, leaf shadows drift over the table, glitter runs along the
"Greetings from" script, each of the eight photo letters gets a glossy shine in
sequence (masked by the real letter shapes), glints on Bembel, glass and sunglasses,
slow push-in onto the letters.
"""
import math
import os

import cv2
import numpy as np

import fx
from fx import H, W
from runner import main

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)

BGIMG = fx.load_plate(L('raw', 'v5b_flatlay_bg.png'))
CARD = fx.to_float(fx.imread_rgb(L('raw', 'v5b_postcard.png'))[..., :3])
CH, CW = CARD.shape[:2]
LABELS = cv2.imread(L('tools', 'layers', 'v5b_letters.png'), cv2.IMREAD_GRAYSCALE)
SCRIPT = cv2.imread(L('tools', 'layers', 'v5b_script.png'), cv2.IMREAD_GRAYSCALE) > 0

ca = np.zeros((CH, CW), np.uint8)
r = 16
cv2.rectangle(ca, (r, 0), (CW - 1 - r, CH - 1), 255, -1)
cv2.rectangle(ca, (0, r), (CW - 1, CH - 1 - r), 255, -1)
for cx, cy in ((r, r), (CW - 1 - r, r), (r, CH - 1 - r), (CW - 1 - r, CH - 1 - r)):
    cv2.circle(ca, (cx, cy), r, 255, -1, cv2.LINE_AA)
CARD_A = cv2.GaussianBlur(ca, (0, 0), 0.8).astype(np.float32) / 255.0
cyy, cxx = np.mgrid[0:CH, 0:CW].astype(np.float32)

LETTERS = []
for k in range(1, 9):
    m = cv2.GaussianBlur((LABELS == k).astype(np.float32), (0, 0), 1.0)
    ys, xs = np.nonzero(LABELS == k)
    LETTERS.append((m, xs.min(), xs.max(), ys.mean()))
ALL_LETTERS = cv2.GaussianBlur((LABELS > 0).astype(np.float32), (0, 0), 1.0)

# resting place found by a search for the largest card that does not overlap the 3D props
# (Bembel, glass, pretzel, sunglasses) — a card dropped on the table cannot end up under them
REST_SCALE = 0.74
REST_POS = (660, 870)
REST_ROT = 2.0
STAR = fx.star_sprite(301)
rngp = np.random.default_rng(12)
_sy, _sx = np.nonzero(SCRIPT)
_pick = rngp.choice(len(_sx), 52, replace=False)
GLITTER = [(float(_sx[i]), float(_sy[i]), rngp.uniform(0, 1)) for i in _pick]
# glints on the props (output coordinates; flat-lay 864 px wide -> 1080)
PROP_GLINTS = [((812, 112), 2.0), ((372, 1392), 3.4), ((70, 1255), 4.8), ((186, 140), 5.9), ((950, 1690), 6.8)]


def card_matrix(t):
    """Affine card->output for time t (drop, spin, settle)."""
    u = fx.prog(t, 0.15, 1.15)
    e = fx.ease_out_back(u, 1.25)
    y = REST_POS[1] - 1500 * (1 - e)
    x = REST_POS[0] + 160 * (1 - e)
    rot = REST_ROT - 24 * (1 - fx.ease_out_cubic(u))
    sc = REST_SCALE * (1.18 - 0.18 * fx.ease_out_cubic(u))
    b = fx.decay(t, 1.15, 0.12) * math.sin((t - 1.15) * 40) if t > 1.15 else 0
    sc *= 1 - 0.012 * b
    M = cv2.getRotationMatrix2D((CW / 2, CH / 2), rot, sc)
    M[0, 2] += x - CW / 2
    M[1, 2] += y - CH / 2
    return M, 1 - e


_rn = np.random.default_rng(77)
_N1 = cv2.GaussianBlur(_rn.standard_normal((H // 4 + 120, W // 4 + 120)).astype(np.float32), (0, 0), 9)
_N2 = cv2.GaussianBlur(_rn.standard_normal((H // 4 + 120, W // 4 + 120)).astype(np.float32), (0, 0), 4)
_N1 /= _N1.std()
_N2 /= _N2.std()


def leaf_shadow(t):
    """Dappled light through the chestnut leaves above the table: two drifting noise octaves."""
    ox1, oy1 = 60 + 18 * math.sin(t * 0.9), 60 + 12 * math.cos(t * 0.7)
    ox2, oy2 = 60 + 30 * math.sin(t * 1.7 + 1), 60 + 22 * math.cos(t * 1.3)
    n1 = _N1[int(oy1):int(oy1) + H // 4, int(ox1):int(ox1) + W // 4]
    n2 = _N2[int(oy2):int(oy2) + H // 4, int(ox2):int(ox2) + W // 4]
    n = np.clip(0.65 * n1 + 0.45 * n2 - 0.2, 0, 2) / 2
    n = cv2.resize(n, (W, H), interpolation=cv2.INTER_CUBIC)
    yy_, xx_ = np.ogrid[0:H, 0:W]
    falloff = np.clip(1.2 - (xx_ / W) * 0.5 - (yy_ / H) * 0.7, 0.2, 1.0)
    return n * falloff


def frame(t):
    rng = np.random.default_rng(int(t * 1000) + 57)
    card = CARD.copy()

    if 1.3 < t < 2.7:                                   # glitter runs along the script
        for gx, gy, ph in GLITTER:
            tt = (t - 1.3 - ph * 1.0) / 0.35
            if 0 < tt < 1:
                fx.add_sprite(card, STAR, gx, gy, (1.0, 0.9, 1.0), math.sin(math.pi * tt) ** 2 * 0.9, scale=0.22)
    for k, (m, x0, x1, ycen) in enumerate(LETTERS):     # each photo letter gets its own shine
        t0 = 2.2 + 0.28 * k
        if t0 < t < t0 + 0.55:
            u = (t - t0) / 0.55
            pos = x0 - 80 + (x1 - x0 + 160) * fx.ease_in_out_cubic(u)
            d = (cxx - pos) + (cyy - ycen) * 0.35
            card = fx.screen(card, np.clip((np.exp(-(d / 20.0) ** 2) * m)[..., None] * 0.6, 0, 1))
    if 4.6 < t < 5.4:
        p = math.sin(math.pi * (t - 4.6) / 0.8) ** 2
        card = fx.screen(card, np.clip((ALL_LETTERS * 0.12 * p)[..., None], 0, 1))

    M, air = card_matrix(t)
    warp = lambda img: cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    a = warp(CARD_A)
    rgb = warp(card * CARD_A[..., None])

    off = 18 + 120 * air
    soft = 14 + 60 * air
    sh = fx.gblur(fx.affine(a, tx=off * 0.8, ty=off, border=cv2.BORDER_CONSTANT), soft)
    contact = fx.gblur(a, 3) * (1 - min(1, air * 4))
    f = BGIMG * (1 - (0.45 * (1 - 0.6 * air) * sh)[..., None]) * (1 - 0.25 * contact[..., None])
    f = f * (1 - a[..., None]) + rgb

    f = f * (1 - 0.28 * leaf_shadow(t)[..., None])
    for (gx, gy), t0 in PROP_GLINTS:
        if t0 < t < t0 + 0.6:
            v = math.sin(math.pi * (t - t0) / 0.6) ** 2
            fx.add_sprite(f, STAR, gx, gy, (1.0, 0.95, 0.85), v, scale=0.8)

    f = fx.screen(f, np.clip(fx.radial(W * 0.9, H * 0.05, 700)[..., None] * np.array([1.0, 0.75, 0.4]) * 0.16, 0, 1))
    push = 1.0 + 0.16 * fx.ease_in_out_cubic(fx.prog(t, 1.3, 8.0))
    f = fx.affine(f, scale=push, cx=650, cy=720)
    f = f * fx.ease_out_cubic(fx.prog(t, 0.0, 0.35))
    return fx.finish(f, rng, grain_amt=0.018, vig=0.18)


if __name__ == '__main__':
    os.environ.setdefault('SP', '/tmp')
    main(frame, 'v5b_greetings_dreieich', 8.0, [0.2, 0.5, 0.8, 1.05, 1.25, 1.7, 2.4, 3.0, 3.8, 4.9, 6.5, 7.9],
         poster_t=4.4)
