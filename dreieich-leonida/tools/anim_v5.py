"""V5 'Greetings from Dreieich' — the postcard lands on a Leonida beach towel (9:16, 8 s).

The card drops in with spin and settles with a bounce and a growing contact
shadow, palm-frond shadows sway over the whole flat-lay, glitter runs along
the "Greetings from" script, each of the eight big letters gets a glossy
shine in sequence while the camera pushes in, glints on sunglasses and glass.
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

BGIMG = fx.load_plate(L('raw', 'v5_flatlay_bg.png'))
CARD = fx.to_float(fx.imread_rgb(L('raw', 'v5_postcard_a.png'))[..., :3])
CH, CW = CARD.shape[:2]
# rounded-corner alpha for the card
ca = np.zeros((CH, CW), np.uint8)
r = 16
cv2.rectangle(ca, (r, 0), (CW - 1 - r, CH - 1), 255, -1)
cv2.rectangle(ca, (0, r), (CW - 1, CH - 1 - r), 255, -1)
for cx, cy in ((r, r), (CW - 1 - r, r), (r, CH - 1 - r), (CW - 1 - r, CH - 1 - r)):
    cv2.circle(ca, (cx, cy), r, 255, -1, cv2.LINE_AA)
CARD_A = cv2.GaussianBlur(ca, (0, 0), 0.8).astype(np.float32) / 255.0
cyy, cxx = np.mgrid[0:CH, 0:CW].astype(np.float32)

REST_SCALE = 0.84
REST_POS = (W / 2 + 4, H * 0.485)
REST_ROT = -3.5
LETTER_BINS = [(15, 150), (150, 290), (290, 420), (420, 520), (520, 650), (650, 760), (760, 880), (880, 1010)]
STAR = fx.star_sprite(301)
rngp = np.random.default_rng(12)
GLITTER = [(rngp.uniform(70, 760), rngp.uniform(90, 330), rngp.uniform(0, 1)) for _ in range(46)]


def card_matrix(t):
    """Affine card->output for time t (drop, spin, settle)."""
    u = fx.prog(t, 0.15, 1.15)
    e = fx.ease_out_back(u, 1.25)
    y = REST_POS[1] - 1500 * (1 - e)
    x = REST_POS[0] + 160 * (1 - e)
    rot = REST_ROT - 24 * (1 - fx.ease_out_cubic(u))
    sc = REST_SCALE * (1.18 - 0.18 * fx.ease_out_cubic(u))
    # landing bounce (a small squash in scale)
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


def palm_shadow(t):
    """Dappled light through palm leaves: two drifting smooth-noise octaves, strongest top-left."""
    ox1, oy1 = 60 + 18 * math.sin(t * 0.9), 60 + 12 * math.cos(t * 0.7)
    ox2, oy2 = 60 + 30 * math.sin(t * 1.7 + 1), 60 + 22 * math.cos(t * 1.3)
    n1 = _N1[int(oy1):int(oy1) + H // 4, int(ox1):int(ox1) + W // 4]
    n2 = _N2[int(oy2):int(oy2) + H // 4, int(ox2):int(ox2) + W // 4]
    n = np.clip(0.65 * n1 + 0.45 * n2 - 0.2, 0, 2) / 2
    n = cv2.resize(n, (W, H), interpolation=cv2.INTER_CUBIC)
    yy_, xx_ = np.ogrid[0:H, 0:W]
    falloff = np.clip(1.25 - (xx_ / W) * 0.6 - (yy_ / H) * 0.9, 0.15, 1.0)
    return n * falloff


def frame(t):
    rng = np.random.default_rng(int(t * 1000) + 51)
    card = CARD.copy()

    # glitter along the script
    if 1.3 < t < 2.6:
        for gx, gy, ph in GLITTER:
            tt = (t - 1.3 - ph * 0.9) / 0.35
            if 0 < tt < 1:
                fx.add_sprite(card, STAR, gx, gy, (1.0, 0.9, 1.0), math.sin(math.pi * tt) ** 2 * 0.9, scale=0.22)
    # sequential glossy shine over the eight letters
    for k, (x0, x1) in enumerate(LETTER_BINS):
        t0 = 2.2 + 0.28 * k
        if t0 < t < t0 + 0.55:
            u = (t - t0) / 0.55
            pos = x0 - 80 + (x1 - x0 + 160) * fx.ease_in_out_cubic(u)
            d = (cxx - pos) + (cyy - 620) * 0.35
            bandm = np.exp(-(d / 22.0) ** 2) * ((cxx > x0) & (cxx < x1) & (cyy > 390) & (cyy < 850))
            card = fx.screen(card, np.clip(bandm[..., None] * 0.55, 0, 1))
    # all-letter pulse at the end of the sequence
    if 4.6 < t < 5.4:
        p = math.sin(math.pi * (t - 4.6) / 0.8) ** 2
        card = fx.screen(card, np.clip((((cyy > 390) & (cyy < 850)).astype(np.float32) * 0.10 * p)[..., None], 0, 1))

    M, air = card_matrix(t)
    warp = lambda img, bv=0: cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR,
                                            borderMode=cv2.BORDER_CONSTANT, borderValue=bv)
    a = warp(CARD_A)
    rgb = warp(card * CARD_A[..., None])

    # shadow: higher in the air = softer, further away, lighter
    off = 18 + 120 * air
    soft = 14 + 60 * air
    sh = fx.gblur(fx.affine(a, tx=off * 0.8, ty=off, border=cv2.BORDER_CONSTANT), soft)
    contact = fx.gblur(a, 3) * (1 - min(1, air * 4))
    f = BGIMG * (1 - (0.42 * (1 - 0.6 * air) * sh)[..., None]) * (1 - 0.25 * contact[..., None])
    f = f * (1 - a[..., None]) + rgb

    # palm shadows sway over everything
    f = f * (1 - 0.32 * palm_shadow(t)[..., None])
    # glints on props
    for (gx, gy), t0 in (((765, 150), 2.0), ((995, 390), 3.6), ((95, 1290), 5.0), ((150, 1480), 6.4)):
        if t0 < t < t0 + 0.6:
            v = math.sin(math.pi * (t - t0) / 0.6) ** 2
            fx.add_sprite(f, STAR, gx, gy, (1.0, 0.95, 0.85), v, scale=0.8)

    # warm sun gradient + camera push-in onto the letters
    f = fx.screen(f, np.clip(fx.radial(W * 0.9, H * 0.05, 700)[..., None] * np.array([1.0, 0.75, 0.4]) * 0.18, 0, 1))
    push = 1.0 + 0.16 * fx.ease_in_out_cubic(fx.prog(t, 1.3, 8.0))
    f = fx.affine(f, scale=push, cx=W / 2, cy=H * 0.47)
    f = f * fx.ease_out_cubic(fx.prog(t, 0.0, 0.35))
    return fx.finish(f, rng, grain_amt=0.018, vig=0.18)


if __name__ == '__main__':
    os.environ.setdefault('SP', '/tmp')
    main(frame, 'v5_greetings_postcard', 8.0, [0.2, 0.5, 0.8, 1.05, 1.25, 1.7, 2.4, 3.0, 3.8, 4.9, 6.5, 7.9], poster_t=4.4)
