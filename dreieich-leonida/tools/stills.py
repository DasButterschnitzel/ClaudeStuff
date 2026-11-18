"""Final stills: 4:5 feed (1080x1350), 9:16 story (1080x1920), transparent logo PNGs, overview sheets."""
import json
import os
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fx  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)
os.makedirs(L('final'), exist_ok=True)
os.makedirs(L('logos'), exist_ok=True)

VARIANTS = [
    ('v1', 'sunset_triangle', 'v1_sunset_b'),
    ('v2', 'neon_nights', 'v2_neon_a'),
    ('v3', 'welcome_sign', 'v3_welcome_a'),
    ('v4', 'chrome_nights', 'v4_chrome_b'),
    ('v5', 'greetings_postcard', 'v5_postcard_a'),
    ('v5b', 'greetings_dreieich', 'v5b_postcard'),
    ('v6', 'leonida_plate', 'v6_plate_a'),
]


def rd(p):
    return fx.imread_rgb(p)


def wr(p, rgb):
    if p.endswith('.jpg'):
        cv2.imwrite(p, cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 95])
        return
    if rgb.shape[2] == 4:
        cv2.imwrite(p, cv2.cvtColor(rgb, cv2.COLOR_RGBA2BGRA))
    else:
        cv2.imwrite(p, cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))


def sharpen(img8, amount=0.35, sigma=1.1):
    f = img8.astype(np.float32)
    bl = cv2.GaussianBlur(f, (0, 0), sigma)
    return np.clip(f + (f - bl) * amount, 0, 255).astype(np.uint8)


def resize(img, size):
    return cv2.resize(img, size, interpolation=cv2.INTER_LANCZOS4)


def cut(img_rgb, alpha01, pad=24):
    a = (np.clip(alpha01, 0, 1) * 255).astype(np.uint8)
    ys, xs = np.nonzero(a > 8)
    y0, y1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(a.shape[1], xs.max() + pad)
    rgba = np.dstack([img_rgb, a])[y0:y1, x0:x1]
    return rgba


def mask(p):
    return fx.load_mask45(p)


# ------------------------------------------------------------------ feed + story stills
for vid, name, raw in VARIANTS:
    src = rd(L('raw', f'{raw}.png'))[..., :3]
    wr(L('final', f'{vid}_{name}_4x5.jpg'), sharpen(resize(src, (1080, 1350))))
    if vid in ('v5', 'v5b'):
        continue
    s916 = rd(L('raw', f'{raw}_916.png'))[..., :3]
    wr(L('final', f'{vid}_{name}_9x16.jpg'), sharpen(resize(s916, (1080, 1920))))

# V5 / V5b story stills: the postcard resting on its flat-lay (same composite as the animation, no camera move)
def rounded_alpha(CH, CW, r=16):
    ca = np.zeros((CH, CW), np.uint8)
    cv2.rectangle(ca, (r, 0), (CW - 1 - r, CH - 1), 255, -1)
    cv2.rectangle(ca, (0, r), (CW - 1, CH - 1 - r), 255, -1)
    for cx, cy in ((r, r), (CW - 1 - r, r), (r, CH - 1 - r), (CW - 1 - r, CH - 1 - r)):
        cv2.circle(ca, (cx, cy), r, 255, -1, cv2.LINE_AA)
    return cv2.GaussianBlur(ca, (0, 0), 0.8).astype(np.float32) / 255


def card_on_table(card_png, bg_png, rot, scale, center, out_jpg):
    bg = resize(rd(L('raw', bg_png))[..., :3], (1080, 1920)).astype(np.float32) / 255
    card = rd(L('raw', card_png))[..., :3].astype(np.float32) / 255
    CH, CW = card.shape[:2]
    ca = rounded_alpha(CH, CW)
    M = cv2.getRotationMatrix2D((CW / 2, CH / 2), rot, scale)
    M[0, 2] += center[0] - CW / 2
    M[1, 2] += center[1] - CH / 2
    a = cv2.warpAffine(ca, M, (1080, 1920))
    rgb = cv2.warpAffine(card * ca[..., None], M, (1080, 1920))
    sh = cv2.GaussianBlur(cv2.warpAffine(a, np.float32([[1, 0, 14], [0, 1, 18]]), (1080, 1920)), (0, 0), 14)
    comp = bg * (1 - 0.42 * sh[..., None]) * (1 - 0.25 * cv2.GaussianBlur(a, (0, 0), 3)[..., None])
    comp = comp * (1 - a[..., None]) + rgb
    wr(L('final', out_jpg), sharpen((np.clip(comp, 0, 1) * 255 + .5).astype(np.uint8)))
    return ca


ca = card_on_table('v5_postcard_a.png', 'v5_flatlay_bg.png', -3.5, 0.84, (1080 / 2 + 4, 1920 * 0.485),
                   'v5_greetings_postcard_9x16.jpg')
ca_b = card_on_table('v5b_postcard.png', 'v5b_flatlay_bg.png', 2.0, 0.74, (660, 870),
                     'v5b_greetings_dreieich_9x16.jpg')

# ------------------------------------------------------------------ transparent logos
# V1: ISNet subject mask + filled triangle polygon (scene inside the triangle must be opaque)
src = rd(L('raw', 'v1_sunset_b.png'))[..., :3]
m = mask(L('tools', 'cut', 'v1_sunset_b_isnet_mask.png'))
tri = mask(L('tools', 'layers', 'v1_tri45.png'))
txt = mask(L('tools', 'layers', 'v1_text45.png'))
tag = mask(L('tools', 'layers', 'v1_tag45.png'))
alpha = np.maximum.reduce([m, cv2.erode(tri, np.ones((3, 3), np.uint8)), txt, tag])
wr(L('logos', 'v1_sunset_triangle_logo.png'), cut(src, alpha))

# V2: neon on black (for screen/add blending) + unmultiplied transparent version
src = rd(L('raw', 'v2_neon_a.png'))[..., :3].astype(np.float32) / 255
nm = mask(L('tools', 'masks', 'v2_neon.png'))
core = cv2.GaussianBlur(cv2.dilate(nm, np.ones((5, 5), np.uint8)), (0, 0), 1.5)
glow = cv2.GaussianBlur(src * core[..., None], (0, 0), 9) * 1.4 + cv2.GaussianBlur(src * core[..., None], (0, 0), 28) * 0.9
neon = np.clip(src * core[..., None] + glow * (1 - core[..., None]), 0, 1)
ys, xs = np.nonzero(core > 0.05)
y0, y1, x0, x1 = max(0, ys.min() - 90), min(1280, ys.max() + 90), max(0, xs.min() - 90), min(1024, xs.max() + 90)
nb = neon[y0:y1, x0:x1]
wr(L('logos', 'v2_neon_nights_on_black.png'), (nb * 255 + .5).astype(np.uint8))
al = nb.max(-1)
un = np.where(al[..., None] > 1e-3, nb / np.maximum(al[..., None], 1e-3), 0)
wr(L('logos', 'v2_neon_nights_logo.png'), np.dstack([(un * 255 + .5).astype(np.uint8), (al * 255 + .5).astype(np.uint8)]))

# V3: the sign (ISNet cutout)
src = rd(L('raw', 'v3_welcome_a.png'))[..., :3]
m = mask(L('tools', 'cut', 'v3_welcome_a_isnet_mask.png'))
wr(L('logos', 'v3_welcome_sign_logo.png'), cut(src, m))

# V4: chrome letters + glass triangle + swoosh + Nights (geometric + colour masks)
src916 = rd(L('raw', 'v4_chrome_b_916.png'))[..., :3]
src = src916[270:1550]
hsv = cv2.cvtColor(cv2.cvtColor(src, cv2.COLOR_RGB2BGR), cv2.COLOR_BGR2HSV).astype(np.int32)
h, s_, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
yy, xx = np.mgrid[0:1280, 0:1024]
band = np.zeros((1280, 1024), np.uint8)
band[494:708, 52:1002] = 1
green = (h >= 35) & (h <= 90) & (s_ > 90)
pink = (h >= 140) & (s_ > 80) & (v > 120) & (yy > 600) & (xx > 520)
let_ = ((v > 75) & ~green & ~pink & (band > 0)).astype(np.uint8)
let_ = np.maximum(let_, ((mask(L('tools', 'masks', 'v4_letters.png')) > 0.5) & (band > 0)).astype(np.uint8))
let_ = cv2.morphologyEx(let_, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 9)))
# italic parallelogram around the wordmark removes background slabs
para = (yy >= 500) & (yy <= 706) & (xx >= 52 + (706 - yy) * 0.27) & (xx <= 958 + (706 - yy) * 0.21)
let_ = (let_ & para).astype(np.uint8)
nreg = (xx > 520) & (xx < 1010) & (yy > 600) & (yy < 846)
nights = (nreg & (((h >= 140) & (s_ > 80) & (v > 150)) | ((v > 235) & (s_ < 70)))).astype(np.uint8)
nights = cv2.morphologyEx(nights, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
nights = cv2.dilate(nights, np.ones((5, 5), np.uint8))
tri = np.zeros((1280, 1024), np.uint8)
cv2.fillPoly(tri, [np.array([(221, 363), (789, 363), (507, 893)], np.int32)], 1)
swreg = (xx > 545) & (xx < 845) & (yy > 300) & (yy < 492)
sw = (swreg & ((((h >= 95) & (h <= 140) & (s_ > 50) & (v > 60))) | ((v > 200) & (s_ < 80)))).astype(np.uint8)
sw = cv2.morphologyEx(sw, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
logo = np.maximum.reduce([let_, nights, tri, sw])
logo = cv2.morphologyEx(logo, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
nlab, lab, st, _ = cv2.connectedComponentsWithStats(logo)
keep = np.zeros_like(logo)
for k in range(1, nlab):
    if st[k, cv2.CC_STAT_AREA] > 900:
        keep[lab == k] = 1
alpha = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.0)
wr(L('logos', 'v4_chrome_nights_logo.png'), cut(src, alpha))

# V5 / V5b: the postcards with rounded corners
card8 = rd(L('raw', 'v5_postcard_a.png'))[..., :3]
wr(L('logos', 'v5_greetings_postcard_card.png'), np.dstack([card8, (ca * 255 + .5).astype(np.uint8)]))
card8 = rd(L('raw', 'v5b_postcard.png'))[..., :3]
wr(L('logos', 'v5b_greetings_dreieich_card.png'), np.dstack([card8, (ca_b * 255 + .5).astype(np.uint8)]))

# V6: plate cutout + perspective-rectified front view
src = rd(L('raw', 'v6_plate_a.png'))[..., :3]
pm = mask(L('tools', 'masks', 'v6_plate.png'))
wr(L('logos', 'v6_leonida_plate_cutout.png'), cut(src, cv2.GaussianBlur(pm, (0, 0), 0.8)))
quad = np.float32([[89, 337], [882, 433], [918, 915], [99, 948]])   # TL, TR, BR, BL (outer frame)
dst = np.float32([[0, 0], [1200, 0], [1200, 600], [0, 600]])
Hm = cv2.getPerspectiveTransform(quad, dst)
flat = cv2.warpPerspective(src, Hm, (1200, 600), flags=cv2.INTER_LANCZOS4)
fa = np.zeros((600, 1200), np.uint8)
cv2.rectangle(fa, (6, 6), (1193, 593), 255, -1)
fa = cv2.GaussianBlur(fa, (0, 0), 1.2)
wr(L('logos', 'v6_leonida_plate_front.png'), np.dstack([flat, fa]))

# ------------------------------------------------------------------ overview sheets
def sheet(files, tile_w, tile_h, cols, out, gap=18, bgc=(14, 8, 24)):
    rows = (len(files) + cols - 1) // cols
    Wt = cols * tile_w + (cols + 1) * gap
    Ht = rows * tile_h + (rows + 1) * gap
    canvas = np.zeros((Ht, Wt, 3), np.uint8)
    canvas[:] = bgc
    for i, f in enumerate(files):
        im = resize(rd(f)[..., :3], (tile_w, tile_h))
        r_, c_ = divmod(i, cols)
        in_row = min(cols, len(files) - r_ * cols)
        x_off = (cols - in_row) * (tile_w + gap) // 2          # centre an incomplete last row
        y = gap + r_ * (tile_h + gap)
        x = gap + c_ * (tile_w + gap) + x_off
        canvas[y:y + tile_h, x:x + tile_w] = im
    wr(out, canvas)


os.makedirs(L('board'), exist_ok=True)
sheet([L('final', f'{v}_{n}_4x5.jpg') for v, n, _ in VARIANTS], 540, 675, 4, L('board', 'overview_4x5.jpg'))
sheet([L('final', f'{v}_{n}_9x16.jpg') for v, n, _ in VARIANTS], 360, 640, 7, L('board', 'overview_9x16.jpg'))
print('stills done')
