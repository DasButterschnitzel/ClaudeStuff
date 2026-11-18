"""V4 'Dreieich Nights' — 80s chrome logo over a synthwave grid (9:16, 8 s).

The horizontal grid lines are removed from the floor (inpainted) and redrawn
procedurally with correct perspective so the floor rushes towards the viewer
in a seamless loop while the reflections stay put.  Chrome letters are
revealed by a light sweep, the glass triangle powers up, "Nights" writes on
in neon, stars twinkle, glints pop, slow push-in.
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

IMG = fx.load_plate(L('raw', 'v4_chrome_b_916.png'))
src916 = fx.imread_rgb(L('raw', 'v4_chrome_b_916.png'))           # 1024x1820 RGB uint8
hsv916 = cv2.cvtColor(cv2.cvtColor(src916, cv2.COLOR_RGB2BGR), cv2.COLOR_BGR2HSV).astype(np.int32)
Hh, Ss, Vv = hsv916[..., 0], hsv916[..., 1], hsv916[..., 2]
R, G, B = (src916[..., i].astype(np.int32) for i in range(3))
yy9, xx9 = np.mgrid[0:1820, 0:1024].astype(np.float32)

# ------------------------------------------------------------------ floor model (fitted on the 9:16 source)
YH, U0, DU = 1044.0, 0.008571180623474952, 0.0009467797217169024
FLOOR_TOP = 1124
magenta = (R > 140) & (B > 100) & (G < 130) & (R > G + 55)
hmask = np.zeros((1820, 1024), np.uint8)
for n in range(-8, 9):
    u = U0 - n * DU
    if u <= 0:
        continue
    y = YH + 1 / u
    if y < FLOOR_TOP or y > 1830:
        continue
    th = max(2.0, (y - YH) * 0.0125) + 4
    band = (np.abs(yy9 - y) <= th) & magenta
    hmask |= band.astype(np.uint8)
hmask = cv2.dilate(hmask, np.ones((3, 3), np.uint8))
line_col = np.median(src916[hmask > 0].reshape(-1, 3), axis=0) / 255.0
floor916 = cv2.inpaint(cv2.cvtColor(src916, cv2.COLOR_RGB2BGR), hmask * 255, 5, cv2.INPAINT_TELEA)
floor916 = cv2.cvtColor(floor916, cv2.COLOR_BGR2RGB)
NOLINES = fx.to_float(cv2.resize(floor916, (W, H), interpolation=cv2.INTER_LANCZOS4))
FLOOR_M = np.zeros((H, W), np.float32)
FLOOR_M[int(FLOOR_TOP * fx.S):] = 1
FLOOR_M = fx.gblur(FLOOR_M, 2)
BASE = NOLINES * FLOOR_M[..., None] + IMG * (1 - FLOOR_M[..., None])
YH_O, U0_O, DU_O = YH * fx.S, U0 / fx.S, DU / fx.S
CXV = 512 * fx.S

# ------------------------------------------------------------------ logo masks (4:5 source)
src45 = src916[270:1550]
LET45 = fx.load_mask45(L('tools', 'masks', 'v4_letters.png'))
TRI45 = fx.load_mask45(L('tools', 'masks', 'v4_tri.png'))
h45, s45, v45 = Hh[270:1550], Ss[270:1550], Vv[270:1550]
yy45, xx45 = np.mgrid[0:1280, 0:1024]
nreg = (xx45 > 520) & (xx45 < 1010) & (yy45 > 600) & (yy45 < 900)
pinkn = nreg & (((h45 >= 140) & (s45 > 80) & (v45 > 150)) | ((v45 > 235) & (s45 < 70)))
pinkn &= LET45 < 0.5
pinkn = cv2.morphologyEx(pinkn.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
NIGHTS = fx.gblur(fx.mask45_to_out(cv2.dilate(pinkn, np.ones((3, 3), np.uint8)).astype(np.float32)), 1.0)
# chrome letters: colour heuristic inside the text band (the Adobe mask misses E-I-E-I)
band45 = np.zeros((1280, 1024), np.uint8)
band45[478:712, 30:1015] = 1
green45 = (h45 >= 35) & (h45 <= 90) & (s45 > 90)
pink45 = (h45 >= 140) & (s45 > 80) & (v45 > 120) & (yy45 > 600) & (xx45 > 520)
heur = ((v45 > 75) & ~green45 & ~pink45 & (band45 > 0)).astype(np.uint8)
heur = np.maximum(heur, ((LET45 > 0.5) & (band45 > 0)).astype(np.uint8))
heur = cv2.morphologyEx(heur, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 9)))
heur = cv2.morphologyEx(heur, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
nlab, lab, st, _ = cv2.connectedComponentsWithStats(heur)
keep = np.zeros_like(heur)
for k in range(1, nlab):
    if st[k, cv2.CC_STAT_AREA] > 400:
        keep[lab == k] = 1
LET = fx.gblur(fx.mask45_to_out(keep.astype(np.float32)), 1.0)
TRI = np.clip(fx.gblur(fx.mask45_to_out(TRI45), 0.8) - LET - NIGHTS, 0, 1)
NIGHTS_GLOW = np.clip(fx.gblur(NIGHTS, 10) * 2.0, 0, 1)

# stars: small bright isolated points in the sky
sky = (yy9 < 700) & (Vv > 190) & (Ss < 90)
n, lab, st, cen = cv2.connectedComponentsWithStats(sky.astype(np.uint8))
STARS = [(cen[k][0] * fx.S, cen[k][1] * fx.S) for k in range(1, n) if 1 <= st[k, 4] <= 30]
rs = np.random.default_rng(4)
STAR_PH = rs.uniform(0, 6.28, len(STARS))
STAR_SP = rs.uniform(1.2, 3.5, len(STARS))
STAR_SPR = fx.star_sprite(61, ray_len=0.48, ray_w=0.9, core=0.05)
GLINT = fx.star_sprite(301)
LOGO_C = P(512, 600)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def grid_lines(t, intensity):
    """Procedural horizontal floor lines moving towards the camera (seamless)."""
    layer = np.zeros((H, W), np.float32)
    phase = (t / 0.62) % 1.0
    for n in range(-9, 10):
        u = U0_O - (n + phase) * DU_O
        if u <= 0:
            continue
        y = YH_O + 1 / u
        if y < FLOOR_TOP * fx.S + 1 or y > H + 20:
            continue
        th = max(1.4, (y - YH_O) * 0.0118)
        fade = np.clip((y - FLOOR_TOP * fx.S) / 60.0, 0, 1)
        y0, y1 = int(y - th * 3), int(y + th * 3) + 1
        y0c, y1c = max(0, y0), min(H, y1)
        if y0c >= y1c:
            continue
        rows = np.arange(y0c, y1c, dtype=np.float32)
        prof = np.exp(-((rows - y) / th) ** 2 * 1.6)
        layer[y0c:y1c] = np.maximum(layer[y0c:y1c], prof[:, None] * fade)
    glow = fx.gblur(layer, 6) * 0.9 + fx.gblur(layer, 18) * 0.6
    col = np.array([line_col[0], line_col[1], line_col[2]], np.float32)
    core = np.clip(col * 1.35 + 0.12, 0, 1)
    return np.clip((layer[..., None] * core + glow[..., None] * col) * intensity, 0, 1)


def frame(t):
    rng = np.random.default_rng(int(t * 1000) + 41)
    f = BASE.copy()

    # chrome letters: dark until the light sweep passes
    a = math.radians(-68)
    proj = (xx - LOGO_C[0]) * math.cos(a + math.pi / 2) + (yy - LOGO_C[1]) * math.sin(a + math.pi / 2)
    front = -620 + 1300 * fx.ease_in_out_cubic(fx.prog(t, 0.55, 1.35))
    rev = np.clip((front - proj) / 60.0, 0, 1)
    dark = f * 0.10 + fx.lum(f)[..., None] * 0.02
    let_a = LET * (1 - rev)
    f = f * (1 - let_a[..., None]) + dark * let_a[..., None]
    if 0.5 < t < 1.6:
        sweep = LET * np.exp(-((proj - front) / 26.0) ** 2)
        f = fx.screen(f, np.clip((fx.gblur(sweep, 2) * 1.4 + fx.gblur(sweep, 16) * 1.2)[..., None]
                                 * np.array([1.0, 0.9, 1.0]), 0, 1))

    # glass triangle + swoosh power up
    tri_lv = 0.25 + 0.75 * fx.ease_out_cubic(fx.prog(t, 1.25, 1.65))
    f = f * (1 - TRI[..., None] * (1 - tri_lv))
    kick = fx.decay(t, 1.45, 0.25) if t > 1.45 else 0
    if kick > 0.01:
        f = fx.screen(f, np.clip(fx.gblur(IMG * TRI[..., None], 22) * 1.8 * kick, 0, 1))

    # "Nights" neon writes on left -> right with flicker
    nx0, nx1 = P(540, 0)[0], P(1000, 0)[0]
    u = fx.ease_in_out_cubic(fx.prog(t, 1.6, 2.25))
    xcut = nx0 + (nx1 - nx0 + 60) * u
    wipe = np.clip((xcut - xx) / 30.0, 0, 1)
    flick = 1.0
    if 2.25 < t < 2.45:
        flick = 0.35 if int(t * 50) % 2 else 1.0
    if 5.9 < t < 6.05:
        flick = 0.5
    nl = wipe * flick
    off_n = f * 0.18
    na = NIGHTS_GLOW * (1 - nl)
    f = f * (1 - na[..., None]) + off_n * na[..., None]

    # grid floor: redrawn lines rushing towards the viewer
    gi = fx.ease_out_cubic(fx.prog(t, 0.05, 0.6))
    f = fx.screen(f, grid_lines(t, 0.95 * gi) * FLOOR_M[..., None])

    # stars twinkle
    tw = np.zeros_like(f)
    for (sx, sy), ph, sp in zip(STARS, STAR_PH, STAR_SP):
        v = max(0.0, math.sin(ph + t * sp)) ** 6
        if v > 0.05:
            fx.add_sprite(tw, STAR_SPR, sx, sy, (1.0, 0.85, 1.0), v * 0.9)
    f = fx.screen(f, tw)

    # periodic chrome sweeps + glints
    for t0 in (3.3, 5.7):
        if t0 < t < t0 + 0.7:
            fr = -620 + 1300 * fx.ease_in_out_cubic((t - t0) / 0.7)
            sw = LET * np.exp(-((proj - fr) / 22.0) ** 2)
            f = fx.screen(f, np.clip((fx.gblur(sw, 2) * 1.2)[..., None] * np.array([1.0, 0.92, 1.0]), 0, 1))
    for (gx, gy), t0, sc in (((70, 515), 1.0, 1.0), ((955, 515), 1.3, 0.9), ((612, 360), 1.55, 0.8),
                             ((830, 345), 3.7, 0.9), ((70, 515), 4.6, 0.7), ((960, 640), 6.1, 0.8),
                             ((500, 885), 7.0, 0.7)):
        if t0 - 0.05 < t < t0 + 0.55:
            v = math.sin(math.pi * fx.clamp01((t - t0) / 0.5)) ** 1.5
            px, py = P(gx, gy)
            fx.add_sprite(f, GLINT, px, py, (1.0, 0.95, 1.0), v, scale=sc * (0.6 + 0.5 * v))

    # intro fade + push-in
    f = f * fx.ease_out_cubic(fx.prog(t, 0.0, 0.45))
    push = 1.0 + 0.05 * fx.ease_in_out_cubic(fx.prog(t, 0.0, 8.0))
    f = fx.affine(f, scale=push, cx=W / 2, cy=LOGO_C[1], ty=-6 * math.sin(t * 0.8))
    return fx.finish(f, rng, grain_amt=0.02, vig=0.22)


if __name__ == '__main__':
    os.environ.setdefault('SP', '/tmp')
    main(frame, 'v4_chrome_nights', 8.0, [0.2, 0.5, 0.8, 1.05, 1.3, 1.5, 1.8, 2.1, 2.6, 3.6, 5.9, 7.9], poster_t=7.6)
