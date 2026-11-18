"""V2 'Neon Nights' — the neon sign on the half-timbered house ignites (9:16, 8 s).

The un-lit state is derived from the render itself: neon-coloured light
(pink / violet / blue / lime) is removed from wall, plants and wet
cobblestones; the tubes become dark glass.  The neon contribution D is then
re-added per segment (8 letters, underline, triangle, crescent, EST. 1977)
with spatial weights, so the light on the wall and the puddle reflections
follow whichever letters are lit.  Plus procedural rain and rippling puddles.
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

IMG = fx.load_plate(L('raw', 'v2_neon_a_916.png'))
M45 = fx.load_mask45(L('tools', 'masks', 'v2_neon.png'))
src45 = cv2.cvtColor(fx.imread_rgb(L('raw', 'v2_neon_a_916.png'))[270:1550], cv2.COLOR_RGB2BGR)
hsv45 = cv2.cvtColor(src45, cv2.COLOR_BGR2HSV)
Hh, Ss, Vv = (hsv45[..., i].astype(np.int32) for i in range(3))
on = M45 > 0.5

# ------------------------------------------------------------------ segment classes (4:5 space)
yy45, xx45 = np.mgrid[0:1280, 0:1024]
lime = on & (Hh >= 30) & (Hh <= 85) & (Ss > 80)
blue = on & (Hh >= 98) & (Hh < 142) & (Ss > 80)
pink = on & ((Hh >= 142) | (Hh < 8)) & (Ss > 80)
est_box = (xx45 >= 505) & (xx45 <= 685) & (yy45 >= 432) & (yy45 <= 500)
crescent = blue & (xx45 > 772)
underline = blue & (xx45 <= 772)
est = on & est_box & ~pink & ~blue
classes = dict(tri=lime, cres=crescent, under=underline, est=est)
# letters: slanted bins over the pink script
shear = xx45 + (yy45 - 360) * 0.36
edges = [250, 412, 460, 510, 536, 584, 609, 654, 800]
for k in range(8):
    classes[f'L{k}'] = pink & (shear >= edges[k]) & (shear < edges[k + 1])
# unassigned tube pixels (white-hot cores etc.) -> nearest class
assigned = np.zeros_like(on)
for v in classes.values():
    assigned |= v
rest = on & ~assigned
names = list(classes.keys())
dist_stack = []
for n in names:
    m = (~classes[n]).astype(np.uint8)
    dist_stack.append(cv2.distanceTransform(m, cv2.DIST_L2, 5))
nearest = np.argmin(np.stack(dist_stack, 0), 0)
for i, n in enumerate(names):
    classes[n] = classes[n] | (rest & (nearest == i))

SEG = {n: fx.mask45_to_out(cv2.dilate(classes[n].astype(np.float32), np.ones((3, 3), np.uint8))) for n in names}
MOUT = fx.mask45_to_out(M45)

# ------------------------------------------------------------------ un-lit plate
hsv = cv2.cvtColor((IMG * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
h, s, v = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
hue_w = np.zeros_like(h)
hue_w += ((h >= 138) | (h < 6)) * 1.0            # pink / magenta
hue_w += ((h >= 100) & (h < 138)) * 1.0          # violet / blue
hue_w += ((h >= 34) & (h < 86)) * 0.9            # lime / green
hue_w += ((h >= 86) & (h < 100)) * 0.6           # cyan
neon_amt = np.clip(2.7 * (s ** 0.7) * hue_w * (v ** 0.4), 0, 1)
lum = fx.lum(IMG)
dim = (lum * 0.30)[..., None] * np.array([0.82, 0.84, 1.0], np.float32)
U = IMG * (1 - neon_amt[..., None] * 0.92) + dim * (neon_amt[..., None] * 0.92)
tube = np.clip(fx.gblur(MOUT, 1.2) * 1.15, 0, 1)
glass = (lum * 0.10)[..., None] * np.array([0.9, 0.75, 0.95], np.float32) + 0.012
U = U * (1 - tube[..., None]) + glass * tube[..., None]
D = np.clip(IMG - U, 0, None)

# ------------------------------------------------------------------ spatial weights per segment
ground = P(0, 1010)[1]
weights = {}
for n, mk in SEG.items():
    mir = cv2.flip(mk, 0)
    shift = int(round(2 * ground - H))
    M_ = np.float32([[1, 0, 0], [0, 1, shift]])
    mir = cv2.warpAffine(mir, M_, (W, H))
    weights[n] = (mk * 2.0 + fx.gblur(mk, 22) * 3 + fx.gblur(mk, 90) * 6 + fx.gblur(mk, 300) * 4
                  + fx.gblur(mir, 40) * 6 + fx.gblur(mir, 160) * 3 + 1e-6)
tot = sum(weights.values())
for n in weights:
    weights[n] = weights[n] / tot
# inside the tubes each segment only lights itself (hard ownership)
SEG_SUM = sum(SEG.values()) + 1e-6
TUBE_OWN = np.clip(fx.gblur(cv2.dilate(MOUT, np.ones((7, 7), np.uint8)), 2.0), 0, 1)
for n in weights:
    weights[n] = weights[n] * (1 - TUBE_OWN) + (SEG[n] / SEG_SUM) * TUBE_OWN

# ------------------------------------------------------------------ timing
ign = {f'L{k}': 0.95 + 0.12 * k for k in range(8)}
ign.update(under=2.05, tri=2.45, cres=2.62, est=3.0)
FLICK = [(0.00, 0.045, 0.85), (0.045, 0.09, 0.0), (0.09, 0.12, 0.55), (0.12, 0.19, 0.04),
         (0.19, 0.23, 1.0), (0.23, 0.26, 0.25), (0.26, 0.30, 0.9)]


def level(name, t):
    t0 = ign[name]
    if t < t0:
        # a teaser stutter of the "D" before the sequence starts
        if name == 'L0' and 0.42 < t < 0.52:
            return 0.35 if (int(t * 60) % 2) else 0.0
        return 0.0
    dt = t - t0
    seed = sum(map(ord, name))
    stretch = 0.8 + 0.4 * ((seed * 37) % 10) / 10
    for a, b, vv in FLICK:
        if a * stretch <= dt < b * stretch:
            lv = vv
            break
    else:
        lv = 1.0
    if name == 'under':                       # the underline sweeps on left -> right
        lv = min(lv, 1.0)
    if name == 'L6' and 5.25 < t < 5.6:       # one tired tube
        lv *= 0.25 if (int(t * 40) % 3 == 0) else 1.0
    buzz = 0.975 + 0.025 * math.sin(t * 2 * math.pi * 7.3 + seed)
    return lv * buzz


yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
UNDER_X0, UNDER_X1 = P(290, 0)[0], P(772, 0)[0]
CRES_C = P(820, 300)
CRES_ANG = np.degrees(np.arctan2(yy - CRES_C[1], xx - CRES_C[0]))
SIGN_C = P(590, 360)
rng0 = np.random.default_rng(5)
NDROP = 320
DROPS = dict(x=rng0.uniform(-100, W + 100, NDROP), y=rng0.uniform(0, H + 200, NDROP),
             sp=rng0.uniform(1700, 2500, NDROP), ln=rng0.uniform(35, 95, NDROP),
             a=rng0.uniform(0.25, 0.8, NDROP))
STREET_Y = int(P(0, 1040)[1])


def rain(t):
    layer = np.zeros((H, W), np.float32)
    ang = math.radians(8)
    for i in range(NDROP):
        y = (DROPS['y'][i] + DROPS['sp'][i] * t) % (H + 200) - 100
        x = DROPS['x'][i] + (y * math.tan(ang)) % 60
        l = DROPS['ln'][i]
        cv2.line(layer, (int(x), int(y)), (int(x + l * math.sin(ang)), int(y + l)), float(DROPS['a'][i]), 1, cv2.LINE_AA)
    return fx.gblur(layer, 0.8)


def frame(t):
    rng = np.random.default_rng(int(t * 1000) + 21)
    I = np.zeros((H, W), np.float32)
    for n in names:
        lv = level(n, t)
        if n == 'under' and lv > 0:
            u = fx.ease_out_cubic(fx.prog(t, ign['under'], ign['under'] + 0.45))
            xcut = UNDER_X0 + (UNDER_X1 - UNDER_X0 + 40) * u
            I += weights[n] * lv * np.clip((xcut - xx) / 30, 0, 1)
        elif n == 'cres' and lv > 0:
            u = fx.ease_out_cubic(fx.prog(t, ign['cres'], ign['cres'] + 0.4))
            th = -120 + 260 * u
            I += weights[n] * lv * np.clip((th - CRES_ANG) / 12, 0, 1)
        elif lv > 0:
            I += weights[n] * lv
    f = U + D * I[..., None]
    # ignition bloom kick for the whole sign
    kick = sum(fx.decay(t, ign[n] + 0.19, 0.12) for n in ('L0', 'L7', 'tri', 'est')) * 0.25
    if kick > 0.01:
        f = fx.screen(f, np.clip(fx.gblur(D * I[..., None], 30) * kick, 0, 1))

    # puddle ripple on the street
    yb = STREET_Y
    sub = f[yb:]
    sy, sx = np.mgrid[yb:H, 0:W].astype(np.float32)
    amp = 1.0 + 2.6 * np.clip((sy - yb) / 300, 0, 1)
    dx = amp * np.sin(sy * 0.11 + t * 7.0) + 0.8 * np.sin(sx * 0.05 - t * 3.1)
    f[yb:] = cv2.remap(sub, sx + dx, sy - yb, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT101)

    # rain lit by the scene
    r = rain(t)
    light = fx.gblur(fx.lum(f), 25)
    f = fx.screen(f, np.clip((r * (0.12 + 1.6 * light))[..., None] * np.array([0.92, 0.95, 1.0]) * 0.9, 0, 1))

    # camera: slow push-in towards the sign + gentle handheld drift
    push = 1.0 + 0.075 * fx.ease_in_out_cubic(fx.prog(t, 0.0, 8.0))
    dx = 3.0 * math.sin(t * 0.9) + 1.5 * math.sin(t * 2.3)
    dy = 2.0 * math.cos(t * 0.7)
    f = fx.affine(f, scale=push, cx=SIGN_C[0], cy=SIGN_C[1], tx=dx, ty=dy)
    return fx.finish(f, rng, grain_amt=0.024, vig=0.30)


if __name__ == '__main__':
    os.environ.setdefault('SP', '/tmp')
    main(frame, 'v2_neon_nights', 8.0, [0.2, 0.47, 1.0, 1.25, 1.55, 1.9, 2.2, 2.5, 2.7, 3.1, 5.4, 7.9], poster_t=7.6)
