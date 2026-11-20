"""V5b 'Greetings from Dreieich' (Dreieich edition): fill the chroma-key letter faces of the
AI postcard with real photos of Dreieich, graded like a hand-tinted linen postcard.

Inputs : raw/v5b_card_key.png (AI lettering + painted Dreieich background, letter faces = #00FF00)
         raw/photos/*.jpg     (Dreieichenhain Fachwerk, Dreieichbahn, Buchschlag aerial, 360° panorama)
Outputs: raw/v5b_postcard.png, tools/layers/v5b_letters.png (label map 1..8), tools/layers/v5b_script.png
"""
import math
import os

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)
os.makedirs(L('tools', 'layers'), exist_ok=True)

card = cv2.cvtColor(cv2.imread(L('raw', 'v5b_card_key.png')), cv2.COLOR_BGR2RGB).astype(np.float32) / 255
H, W = card.shape[:2]
R, G, B = card[..., 0], card[..., 1], card[..., 2]

# ------------------------------------------------------------------ key matte + letter labels
g = G - np.maximum(R, B)
alpha = np.clip((g - 0.16) / (0.80 - 0.16), 0, 1)
hard = (alpha > 0.5).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(hard)
comps = sorted([k for k in range(1, n) if st[k, cv2.CC_STAT_AREA] > 2000], key=lambda k: st[k, 0])
assert len(comps) == 8, f'expected 8 letter faces, got {len(comps)}'
labels = np.zeros((H, W), np.uint8)
for i, k in enumerate(comps):
    labels[lab == k] = i + 1
# give the soft edge pixels the label of the nearest face
dist_stack = [cv2.distanceTransform((labels != i + 1).astype(np.uint8), cv2.DIST_L2, 5) for i in range(8)]
nearest = np.argmin(np.stack(dist_stack, 0), 0) + 1
edge = (alpha > 0.01) & (labels == 0)
labels[edge] = nearest[edge].astype(np.uint8)
KEY = np.array([8, 251, 8], np.float32) / 255

# ------------------------------------------------------------------ photo sources
rd = lambda p: cv2.cvtColor(cv2.imread(L('raw', 'photos', p)), cv2.COLOR_BGR2RGB)
fach = rd('dreieichenhain_fachwerk.jpg')      # 2000x1333
train = rd('dreieichbahn_painting.jpg')        # 1500x2000
buch = rd('buchschlag_aerial.jpg')             # 1500x844
pano = rd('panorama_360.jpg')                  # 2000x1000 equirectangular


def persp(yaw, pitch, fov_h, w, h):
    """Rectilinear view out of the equirectangular panorama (yaw/pitch in degrees, pitch<0 looks down)."""
    Hs, Ws = pano.shape[:2]
    f = (w / 2) / math.tan(math.radians(fov_h) / 2)
    u, v = np.meshgrid(np.arange(w) - w / 2 + 0.5, np.arange(h) - h / 2 + 0.5)
    x, y, z = u / f, v / f, np.ones_like(u)
    p = math.radians(pitch)
    y2, z2 = y * math.cos(p) - z * math.sin(p), y * math.sin(p) + z * math.cos(p)
    yw = math.radians(yaw)
    x3, z3 = x * math.cos(yw) + z2 * math.sin(yw), -x * math.sin(yw) + z2 * math.cos(yw)
    lon = np.arctan2(x3, z3)
    lat = np.arctan2(-y2, np.sqrt(x3 ** 2 + z3 ** 2))
    mx = ((lon / (2 * math.pi)) + 0.5) * Ws - 0.5
    my = (0.5 - lat / math.pi) * Hs - 0.5
    return cv2.remap(pano, mx.astype(np.float32), my.astype(np.float32), cv2.INTER_CUBIC,
                     borderMode=cv2.BORDER_WRAP)


def crop(img, cx, cy, h_src, aspect):
    """Crop with given centre/height in source pixels and target aspect (w/h)."""
    w_src = h_src * aspect
    x0, y0 = int(round(cx - w_src / 2)), int(round(cy - h_src / 2))
    x0 = max(0, min(img.shape[1] - int(w_src), x0))
    y0 = max(0, min(img.shape[0] - int(h_src), y0))
    return img[y0:y0 + int(h_src), x0:x0 + int(w_src)]


# one scene per letter: D R E I E I C H
def scene(i, w, h):
    a = w / h
    if i == 0:   # D  – Dreieichenhain: Fahrgasse with the red half-timbered house and "Alte Burg"
        return crop(fach, 1010, 600, 1060, a)
    if i == 1:   # R  – the Dreieichbahn in the forest (painting)
        return crop(train, 730, 1080, 1700, a)
    if i == 2:   # E  – Buchschlag villa colony, forest and the Frankfurt skyline
        return crop(buch, 770, 422, 844, a)
    if i == 3:   # I  – sunset over the fields (360° drone panorama)
        return persp(-12, -16, 26, 160, int(160 / a))
    if i == 4:   # E  – the big half-timbered house with green windows
        return crop(fach, 1600, 560, 1200, a)
    if i == 5:   # I  – patchwork fields seen from the drone
        return persp(68, -38, 26, 160, int(160 / a))
    if i == 6:   # C  – town, fields and forest at golden hour
        return persp(142, -24, 44, 300, int(300 / a))
    return crop(fach, 360, 640, 1300, a)  # H – half-timbered house with green shutters + picket fence


rng = np.random.default_rng(1977)


def linen(h, w):
    n1 = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), sigmaX=2.2, sigmaY=0.45)
    n2 = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), sigmaX=0.45, sigmaY=2.2)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    weave = np.sin(xx * 2 * math.pi / 3.3) * np.sin(yy * 2 * math.pi / 3.3)
    t = 0.55 * n1 / n1.std() + 0.55 * n2 / n2.std() + 0.5 * weave
    return t / t.std()


def handtint(img):
    f = img.astype(np.float32) / 255
    f = np.clip((f - 0.5) * 1.12 + 0.52, 0, 1)
    hsv = cv2.cvtColor(f, cv2.COLOR_RGB2HSV)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.38, 0, 1)
    f = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    f = f * np.array([1.08, 1.0, 0.86], np.float32)          # warm, golden-hour like the card
    f = 0.045 + 0.94 * np.clip(f, 0, 1)                         # lifted blacks like offset print
    f = cv2.GaussianBlur(f, (0, 0), 0.55)
    return np.clip(f, 0, 1)


out = card.copy()
fills = np.zeros_like(card)
for i in range(8):
    ys, xs = np.nonzero(labels == i + 1)
    x0, x1, y0, y1 = xs.min() - 4, xs.max() + 5, ys.min() - 4, ys.max() + 5
    w, h = x1 - x0, y1 - y0
    sc = scene(i, w, h)
    sc = cv2.resize(sc, (w, h), interpolation=cv2.INTER_AREA if sc.shape[1] > w else cv2.INTER_CUBIC)
    fills[y0:y1, x0:x1] = handtint(sc)

tex = linen(H, W)
fills = np.clip(fills * (1 + 0.035 * tex[..., None]) + rng.standard_normal((H, W, 1)).astype(np.float32) * 0.012, 0, 1)

# raised-letter lighting: inner shadow at the top-left inner edge + soft gloss towards the top
face = (labels > 0).astype(np.float32) * alpha
outside = 1 - face
sh = cv2.GaussianBlur(np.roll(np.roll(outside, 3, 0), 3, 1), (0, 0), 2.6) * face
fills = fills * (1 - 0.42 * sh[..., None])
yy = np.mgrid[0:H, 0:W][0].astype(np.float32)
gloss = np.zeros((H, W), np.float32)
for i in range(8):
    ys, xs = np.nonzero(labels == i + 1)
    top, bot = ys.min(), ys.max()
    u = np.clip((yy - top) / max(1, bot - top), 0, 1)
    gloss = np.where(labels == i + 1, np.exp(-((u - 0.18) / 0.16) ** 2) * 0.10, gloss)
fills = 1 - (1 - fills) * (1 - gloss[..., None])

# composite: exact un-mixing of the key colour at the anti-aliased edges
a3 = alpha[..., None] * (labels > 0)[..., None]
out = np.clip(card - a3 * KEY + a3 * fills, 0, 1)
# kill any residual green spill in the cream outline ring
ring = (cv2.dilate((labels > 0).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0) & (alpha < 0.5)
o = out[ring]
spill = np.clip(o[:, 1] - np.maximum(o[:, 0], o[:, 2]), 0, None)
o[:, 1] -= spill * 0.9
out[ring] = o

cv2.imwrite(L('raw', 'v5b_postcard.png'), cv2.cvtColor((out * 255 + 0.5).astype(np.uint8), cv2.COLOR_RGB2BGR))
cv2.imwrite(L('tools', 'layers', 'v5b_letters.png'), labels)

# "Greetings from" script mask (hot pink), for the glitter pass in the animation
hsv8 = cv2.cvtColor((card * 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.int32)
script = ((hsv8[..., 0] >= 155) | (hsv8[..., 0] <= 5)) & (hsv8[..., 1] > 120) & (hsv8[..., 2] > 120)
script &= (np.mgrid[0:H, 0:W][0] < 300)
cv2.imwrite(L('tools', 'layers', 'v5b_script.png'), script.astype(np.uint8) * 255)
print('v5b card built; letter boxes:',
      [(int(np.nonzero(labels == i + 1)[1].min()), int(np.nonzero(labels == i + 1)[1].max())) for i in range(8)])
