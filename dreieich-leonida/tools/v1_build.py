"""V1 'Sunset Triangle': build animation layers (clean plate + masks) in 4:5 space.

The clean plate removes the "drei/eich" wordmark and tagline so the text can
slam in during the animation.  The triangle border behind the text is
re-created by interpolating the real border cross-section measured above and
below the text; the lake is continued as a mirrored reflection; the
background is filled with normalized convolution.
"""
import json
import os

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'layers')
os.makedirs(OUT, exist_ok=True)

full916 = cv2.imread(os.path.join(ROOT, 'raw', 'v1_sunset_b_916.png'))[:, :, ::-1]
src = full916[270:270 + 1280].copy()           # 4:5 crop, consistent with the 9:16 file
H, W = src.shape[:2]
I = src.astype(np.int32)
R, G, B = I[..., 0], I[..., 1], I[..., 2]
mx, mn = I.max(-1), I.min(-1)

# ------------------------------------------------------------------ text masks
white = (mn > 196) & ((mx - mn) < 50)
reg = np.zeros_like(white)
reg[590:1005, 215:805] = True
white &= reg
w8 = white.astype(np.uint8) * 255
w8 = cv2.morphologyEx(w8, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
letters = w8.copy()                                   # white faces only (for light sweeps)

# tagline = white pixels in the tagline rows
tag = np.zeros_like(w8)
tag[968:1002] = w8[968:1002]
words = w8.copy()
words[968:1002] = 0


def fill_holes(m):
    ff = m.copy()
    msk = np.zeros((m.shape[0] + 2, m.shape[1] + 2), np.uint8)
    cv2.floodFill(ff, msk, (0, 0), 255)
    return m | cv2.bitwise_not(ff)


ell = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
text_layer = fill_holes(cv2.dilate(words, ell(17)))   # letters + plum outline
tag_layer = cv2.dilate(tag, ell(6))
fill_region = cv2.dilate(text_layer | tag_layer, ell(10))

# ------------------------------------------------------------------ triangle geometry
TL0, TR0, TIP0 = np.array([33, 180.]), np.array([935, 182.]), np.array([512, 1150.])
green = (G > 115) & (B < 115) & (G > 0.72 * R)


def edge_samples(side, rows):
    pts_o, pts_i = [], []
    for y in rows:
        if side == 'L':
            xe = TL0[0] + (y - TL0[1]) * (TIP0[0] - TL0[0]) / (TIP0[1] - TL0[1])
            a, b = int(xe - 30), int(xe + 60)
        else:
            xe = TR0[0] + (y - TR0[1]) * (TIP0[0] - TR0[0]) / (TIP0[1] - TR0[1])
            a, b = int(xe - 60), int(xe + 30)
        a, b = max(0, a), min(W, b)
        xs = np.nonzero(green[y, a:b])[0]
        if len(xs) < 6:
            continue
        xs = xs + a
        if side == 'L':
            pts_o.append((y, xs.min()))
            pts_i.append((y, xs.max()))
        else:
            pts_o.append((y, xs.max()))
            pts_i.append((y, xs.min()))
    return np.array(pts_o, float), np.array(pts_i, float)


def robust_line(P):
    a, b = np.polyfit(P[:, 0], P[:, 1], 1)
    for _ in range(3):
        res = np.abs(P[:, 1] - (a * P[:, 0] + b))
        keep = res < max(2.0, np.percentile(res, 75))
        a, b = np.polyfit(P[keep, 0], P[keep, 1], 1)
    return float(a), float(b)


rowsL = list(range(300, 470)) + list(range(545, 592)) + list(range(1008, 1120))
rowsR = list(range(345, 592)) + list(range(1008, 1120))
oL, iL = edge_samples('L', rowsL)
oR, iR = edge_samples('R', rowsR)
lines = {k: robust_line(v) for k, v in dict(oL=oL, iL=iL, oR=oR, iR=iR).items()}
X = lambda k, y: lines[k][0] * y + lines[k][1]

# outer triangle polygon from the outer edge lines + top edge (y=180)
ytop = 179.0
aL, bL = lines['oL']
aR, bR = lines['oR']
ytip = (bR - bL) / (aL - aR)
TL = (X('oL', ytop), ytop)
TR = (X('oR', ytop), ytop)
TIP = (X('oL', ytip), ytip)
print('triangle', TL, TR, TIP)
tri = np.zeros((H, W), np.uint8)
cv2.fillPoly(tri, [np.round(np.array([TL, TR, TIP])).astype(np.int32)], 255)
# inner polygon (interior scene)
aLi, bLi = lines['iL']
aRi, bRi = lines['iR']
yitop = 214.0
ytipi = (bRi - bLi) / (aLi - aRi)
inner = np.zeros((H, W), np.uint8)
cv2.fillPoly(inner, [np.round(np.array([(X('iL', yitop), yitop), (X('iR', yitop), yitop),
                                         (X('iL', ytipi), ytipi)])).astype(np.int32)], 255)

# ------------------------------------------------------------------ plate: background fill
srcf = src.astype(np.float32) / 255.0
known_bg = ((fill_region == 0) & (cv2.dilate(tri, ell(14)) == 0)).astype(np.float32)
num1 = cv2.GaussianBlur(srcf * known_bg[..., None], (0, 0), 12)
den1 = cv2.GaussianBlur(known_bg, (0, 0), 12)[..., None]
num2 = cv2.GaussianBlur(srcf * known_bg[..., None], (0, 0), 55)
den2 = cv2.GaussianBlur(known_bg, (0, 0), 55)[..., None]
bgfill = np.where(den1 > 0.08, num1 / np.maximum(den1, 1e-4), num2 / np.maximum(den2, 1e-4))

# ------------------------------------------------------------------ plate: lake reflection
y_w = 588.0                                              # shoreline / water line
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
ysrc = np.where(yy > y_w, np.maximum(255.0, y_w - (yy - y_w) * 0.6), yy)
ripple = 2.2 * np.sin(yy * 0.55) + 1.4 * np.sin(yy * 1.31 + 1.3)
refl = cv2.remap(srcf, xx + ripple, ysrc, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT101)
refl = cv2.GaussianBlur(refl, (0, 0), sigmaX=1.2, sigmaY=2.6)
depth = np.clip((yy - y_w) / 520.0, 0, 1)[..., None]
tint = np.array([0.32, 0.10, 0.36], np.float32)
refl = refl * (0.62 - 0.35 * depth) + tint * 0.10 * (1 - depth)
# the original triangle interior is dark below the wordmark -> fade the lake into it
dark = np.median(srcf[1002:1016, 492:532].reshape(-1, 3), axis=0)
fade = np.clip((yy - 790.0) / 170.0, 0, 1)[..., None] ** 1.3
refl = refl * (1 - fade) + dark * fade
water = refl

plate = srcf.copy()
inner_f = (inner > 0).astype(np.float32)
tri_f = (tri > 0).astype(np.float32)
regf = (fill_region > 0).astype(np.float32)
# outside triangle -> bg fill, inside inner triangle -> water, ring -> border painting below
plate = np.where(((regf > 0) & (tri_f == 0))[..., None], bgfill, plate)
plate = np.where(((regf > 0) & (inner_f > 0))[..., None], water, plate)

# ------------------------------------------------------------------ plate: border strips
N = 96


def side_profiles(side):
    o, i = ('oL', 'iL') if side == 'L' else ('oR', 'iR')
    rows = [y for y in range(560, 1060) if fill_region[y, int(np.clip((X(o, y) + X(i, y)) / 2, 0, W - 1))]]
    ya, yb = min(rows) - 3, max(rows) + 3

    def window(y):
        xo, xi = X(o, y), X(i, y)
        if side == 'L':
            return xo - 18, xi + 13
        return xi - 13, xo + 18

    def profile(y0, y1):
        acc = np.zeros((N, 3), np.float32)
        n = 0
        for y in range(y0, y1):
            a, b = window(y)
            xs = np.linspace(a, b, N).astype(np.float32)
            samp = cv2.remap(srcf, xs[None, :], np.full((1, N), y, np.float32), cv2.INTER_LINEAR)[0]
            acc += samp
            n += 1
        return acc / n

    Pa = profile(ya - 22, ya - 2)
    Pb = profile(yb + 2, yb + 22)
    return ya, yb, window, Pa, Pb


for side in 'LR':
    ya, yb, window, Pa, Pb = side_profiles(side)
    for y in range(ya - 2, yb + 3):
        t = np.clip((y - ya) / max(1, (yb - ya)), 0, 1)
        prof = Pa * (1 - t) + Pb * t
        a, b = window(y)
        x0, x1 = int(np.floor(a)), int(np.ceil(b))
        for x in range(max(0, x0), min(W, x1 + 1)):
            if not fill_region[y, x]:
                continue
            u = (x - a) / (b - a)
            if u < 0 or u > 1:
                continue
            k = u * (N - 1)
            k0 = int(k)
            k1 = min(N - 1, k0 + 1)
            c = prof[k0] * (1 - (k - k0)) + prof[k1] * (k - k0)
            # feather the strip into the surrounding fill at both window ends
            e = min(u, 1 - u) * 6.0
            wgt = min(1.0, e)
            plate[y, x] = plate[y, x] * (1 - wgt) + c * wgt

# match the film grain of the original inside the reconstructed area
hp = srcf - cv2.GaussianBlur(srcf, (0, 0), 2.0)
gstd = float(hp[(known_bg > 0)].std())
rng = np.random.default_rng(7)
noise = rng.standard_normal((H, W, 1)).astype(np.float32) * min(gstd, 0.02) * 0.55
plate = np.where((regf > 0)[..., None], plate + noise, plate)
print('grain std', gstd)
# soften the seam between reconstructed region and the original
seam = cv2.GaussianBlur(cv2.dilate(regf, np.ones((7, 7), np.uint8)), (0, 0), 7.0)[..., None]
plate = srcf * (1 - seam) + plate * seam
# keep the original wherever the fill region is zero (exact pixels)
plate = np.where((regf == 0)[..., None] & (seam[..., 0] < 0.01)[..., None], srcf, plate)

# ------------------------------------------------------------------ swoosh / glint points
blue = ((B > R + 15) & (B > G + 25) & (B > 70)) | ((mx > 200) & (np.abs(R - B) < 60) & (G > 150))
sw = (blue & (tri == 0) & (fill_region == 0)).astype(np.uint8) * 255
sw = cv2.morphologyEx(sw, cv2.MORPH_OPEN, ell(1))
n, lab, stats, _ = cv2.connectedComponentsWithStats(sw)
keep = np.zeros_like(sw)
for k in range(1, n):
    if stats[k, cv2.CC_STAT_AREA] > 900:
        keep[lab == k] = 255
sw = cv2.dilate(keep, ell(4))

geo = dict(TL=TL, TR=TR, TIP=TIP, inner_top=yitop, lines=lines,
           centroid=((TL[0] + TR[0] + TIP[0]) / 3, (TL[1] + TR[1] + TIP[1]) / 3),
           sun=(556, 522), text_center=(512, 785), tag_center=(512, 985))
json.dump(geo, open(os.path.join(OUT, 'v1_geo.json'), 'w'), indent=1)

save = lambda name, a: cv2.imwrite(os.path.join(OUT, name), a)
save('v1_plate45.png', cv2.cvtColor((np.clip(plate, 0, 1) * 255 + .5).astype(np.uint8), cv2.COLOR_RGB2BGR))
save('v1_text45.png', cv2.GaussianBlur(text_layer, (0, 0), 1.2))
save('v1_tag45.png', cv2.GaussianBlur(tag_layer, (0, 0), 1.0))
save('v1_letters45.png', letters)
save('v1_tri45.png', tri)
save('v1_inner45.png', inner)
save('v1_swoosh45.png', sw)
print('done', {k: [round(v[0], 4), round(v[1], 2)] for k, v in lines.items()})
