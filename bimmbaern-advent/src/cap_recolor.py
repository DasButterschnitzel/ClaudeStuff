# Narrenkappe des Elferrats-Bären: Neonfarben -> satte Wappenfarben, grellgrüne Kontur -> Tuschelinie
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS = None
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.float32)
H, W = a.shape[:2]
y0, y1, x0, x1 = 0, int(H * .46), int(W * .36), int(W * .88)       # region that contains the cap
reg = a[y0:y1, x0:x1].copy()
SRC = np.array([[254, 0, 0], [1, 102, 255], [255, 255, 1], [194, 210, 23], [255, 255, 255]], np.float32)   # red, blue, yellow, lime, white
TGT = np.array([[214, 34, 30], [36, 62, 190], [255, 205, 46], [30, 20, 18], [255, 255, 255]], np.float32)  # crest red, crest blue, gold, ink, white
d = np.linalg.norm(reg[:, :, None, :] - SRC[None, None], axis=3)
core = d[:, :, :4].min(2) < 42
idx = d[:, :, :4].argmin(2)
hat = ndi.binary_dilation(core, iterations=6)
# soft shading across the cap so the panels are not dead flat
yy, xx = np.mgrid[0:reg.shape[0], 0:reg.shape[1]].astype(np.float32)
shade = 1.07 - .20 * ((xx / reg.shape[1]) * .45 + (yy / reg.shape[0]) * .55)
out = reg.copy()
for i in range(4):
    m = core & (idx == i)
    f = shade[m][:, None] if i < 3 else 1.0
    out[m] = np.clip(TGT[i] * f, 0, 255)
# anti-aliased edge pixels: unmix as blend of two palette colours
edge = hat & ~core
p = reg[edge]; best = np.full(len(p), 1e9, np.float32); res = p.copy(); sh = shade[edge][:, None]
for i in range(5):
    for j in range(i + 1, 5):
        v = SRC[i] - SRC[j]; t = np.clip(((p - SRC[j]) @ v) / (v @ v), 0, 1)[:, None]
        r = np.linalg.norm(p - (t * SRC[i] + (1 - t) * SRC[j]), axis=1)
        ti = TGT[i] * (sh if i < 3 else 1); tj = TGT[j] * (sh if j < 3 else 1)
        cand = t * ti + (1 - t) * tj
        better = r < best; best[better] = r[better]; res[better] = cand[better]
ok = best < 46
pe = out[edge]; pe[ok] = np.clip(res[ok], 0, 255); out[edge] = pe
a[y0:y1, x0:x1] = out
Image.fromarray(a.astype(np.uint8)).save(dst, quality=96)
print('core px', int(core.sum()), 'edge px', int(edge.sum()), 'unmixed', int(ok.sum()))
