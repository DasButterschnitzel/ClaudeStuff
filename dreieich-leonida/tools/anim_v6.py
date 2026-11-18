"""V6 'Leonida Plate' — vanity plate on a hot-pink 80s sports car (9:16, 8 s).

Rack focus from soft to sharp, dappled palm shadows drifting over the glossy
paint, a specular sweep running along the embossed DREIEICH characters, a
holographic shimmer on the triangle registration sticker, glints on the
bolts, a shine across the LEONIDA script, heat haze over the four exhaust
tips, warm flare and a slow push-in.
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

IMG = fx.load_plate(L('raw', 'v6_plate_a_916.png'))
src45 = fx.imread_rgb(L('raw', 'v6_plate_a_916.png'))[270:1550]
hsv45 = cv2.cvtColor(cv2.cvtColor(src45, cv2.COLOR_RGB2BGR), cv2.COLOR_BGR2HSV).astype(np.int32)
V45 = hsv45[..., 2]
yy45, xx45 = np.mgrid[0:1280, 0:1024]
PLATE45 = fx.load_mask45(L('tools', 'masks', 'v6_plate.png'))

chars45 = ((V45 < 100) & (PLATE45 > 0.5) & (xx45 > 180) & (xx45 < 875) & (yy45 > 512) & (yy45 < 785)).astype(np.uint8)
chars45 = cv2.morphologyEx(chars45, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
rim45 = cv2.morphologyEx(chars45, cv2.MORPH_GRADIENT, np.ones((5, 5), np.uint8)).astype(np.float32)
CHARS = fx.gblur(fx.mask45_to_out(chars45.astype(np.float32)), 1.0)
RIM = fx.gblur(fx.mask45_to_out(rim45), 1.2)
PLATE = fx.gblur(fx.mask45_to_out(PLATE45), 1.0)
sticker45 = np.zeros((1280, 1024), np.float32)
cv2.fillPoly(sticker45, [np.array([(122, 384), (240, 392), (182, 505)], np.int32)], 1.0)
STICKER = fx.gblur(fx.mask45_to_out(sticker45), 2.0)
script45 = np.zeros((1280, 1024), np.float32)
script45[405:518, 345:712] = 1
SCRIPT = fx.mask45_to_out(script45) * (fx.lum(IMG) < 0.75) * PLATE
BOLTS = [P(278, 396), P(782, 466), P(278, 886), P(802, 876)]
PIPES = [((105 + 560) / 2, (1645 + 1877) / 2, 260, 140), ((770 + 1080) / 2, (1508 + 1698) / 2, 190, 110)]
PLATE_C = P(500, 640)
STAR = fx.star_sprite(301)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
PIPE_M = np.zeros((H, W), np.float32)
for cx, cy, rx, ry in PIPES:
    PIPE_M = np.maximum(PIPE_M, np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)))

_rn = np.random.default_rng(5)
_N1 = cv2.GaussianBlur(_rn.standard_normal((H // 4 + 160, W // 4 + 160)).astype(np.float32), (0, 0), 7)
_N1 /= _N1.std()
_HZ = cv2.GaussianBlur(_rn.standard_normal((H // 2 + 400, W // 2)).astype(np.float32), (0, 0), 7)
_HZ /= _HZ.std()


def shadows(t):
    ox, oy = 80 + 40 * math.sin(t * 0.8), 80 + 25 * math.cos(t * 0.6)
    n = _N1[int(oy):int(oy) + H // 4, int(ox):int(ox) + W // 4]
    n = np.clip(n - 0.3, 0, 2.5) / 2.5
    return cv2.resize(n, (W, H), interpolation=cv2.INTER_CUBIC)


def frame(t):
    rng = np.random.default_rng(int(t * 1000) + 61)
    f = IMG.copy()

    # holographic shimmer on the sticker
    hue_shift = 0.5 + 0.5 * math.sin(t * 2.4)
    holo = np.stack([0.6 + 0.4 * np.sin(xx * 0.05 + t * 3), 0.6 + 0.4 * np.sin(yy * 0.05 + t * 2.3 + 2),
                     0.6 + 0.4 * np.sin((xx + yy) * 0.04 + t * 2.7 + 4)], -1)
    f = fx.screen(f, np.clip(holo * STICKER[..., None] * 0.22 * hue_shift, 0, 1))

    # specular sweep along the embossed characters
    for t0, dur in ((1.7, 0.9), (5.2, 0.9)):
        if t0 < t < t0 + dur:
            u = fx.ease_in_out_cubic((t - t0) / dur)
            x0, x1 = P(170, 0)[0], P(890, 0)[0]
            pos = x0 - 120 + (x1 - x0 + 240) * u
            d = (xx - pos) + (yy - PLATE_C[1]) * 0.45
            b = np.exp(-(d / 30.0) ** 2)
            hl = (RIM * 1.0 + CHARS * 0.35) * b
            f = fx.screen(f, np.clip((fx.gblur(hl, 1.5) * 1.3 + fx.gblur(hl, 10) * 0.8)[..., None]
                                     * np.array([1.0, 0.95, 1.0]), 0, 1))
    # shine across the LEONIDA script
    if 3.0 < t < 3.7:
        u = (t - 3.0) / 0.7
        pos = P(330, 0)[0] + (P(730, 0)[0] - P(330, 0)[0]) * u
        b = np.exp(-(((xx - pos) + (yy - P(0, 460)[1]) * 0.5) / 24.0) ** 2) * SCRIPT
        f = fx.screen(f, np.clip(b[..., None] * np.array([1.0, 0.8, 0.6]) * 0.8, 0, 1))

    # dappled palm shadows over car + plate
    f = f * (1 - 0.30 * shadows(t)[..., None])

    # heat haze over the exhaust tips
    off = int((t * 160) % 400)
    hz = _HZ[400 - off:400 - off + H // 2, :]
    hz = cv2.resize(hz, (W, H), interpolation=cv2.INTER_LINEAR)
    dx = hz * 1.1 * PIPE_M
    dy = np.roll(hz, 9, axis=1) * 0.8 * PIPE_M
    f = cv2.remap(f, xx + dx, yy + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT101)

    # glints on the bolts
    for (bx, by), t0 in zip(BOLTS, (2.5, 2.75, 4.2, 6.6)):
        if t0 < t < t0 + 0.5:
            v = math.sin(math.pi * (t - t0) / 0.5) ** 2
            fx.add_sprite(f, STAR, bx, by, (1.0, 0.95, 0.9), v, scale=0.55)

    # warm flare top-right
    fl = 0.22 + 0.06 * math.sin(t * 1.7)
    f = fx.screen(f, np.clip((fx.radial(W * 0.95, H * 0.06, 420) * fl)[..., None] * np.array([1.0, 0.7, 0.4]), 0, 1))

    # rack focus + push-in + handheld
    foc = 1 - fx.ease_out_cubic(fx.prog(t, 0.0, 1.5))
    if foc > 0.01:
        f = fx.gblur(f, 16 * foc) * (1 - 0.15 * foc)
    push = 1.10 - 0.10 * fx.ease_out_cubic(fx.prog(t, 0.0, 1.6)) + 0.07 * fx.ease_in_out_cubic(fx.prog(t, 1.6, 8.0))
    f = fx.affine(f, scale=push, cx=PLATE_C[0], cy=PLATE_C[1],
                  tx=2.5 * math.sin(t * 1.1), ty=1.8 * math.cos(t * 0.9))
    f = f * fx.ease_out_cubic(fx.prog(t, 0.0, 0.3))
    return fx.finish(f, rng, grain_amt=0.02, vig=0.22)


if __name__ == '__main__':
    os.environ.setdefault('SP', '/tmp')
    main(frame, 'v6_leonida_plate', 8.0, [0.1, 0.5, 1.0, 1.5, 2.0, 2.3, 2.6, 3.3, 4.3, 5.6, 6.7, 7.9], poster_t=7.5)
