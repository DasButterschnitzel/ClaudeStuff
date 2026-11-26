import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
Image.MAX_IMAGE_PIXELS = None
src, dst, W = sys.argv[1], sys.argv[2], int(sys.argv[3])
thr = int(sys.argv[4]) if len(sys.argv) > 4 else 243
im = Image.open(src).convert('RGB')
im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
a = np.asarray(im).astype(np.int16)
mn, mx = a.min(2), a.max(2)
white = (mn >= thr) & ((mx - mn) <= 8)
# pad top/left/right with white so border-connected regions join; bottom not padded differently
pad = np.pad(white, 1, constant_values=True)
lab, n = ndi.label(pad)
bg = (lab == lab[0, 0])[1:-1, 1:-1]
print(src, 'bg frac', bg.mean().round(3), 'white-not-bg frac', (white & ~bg).mean().round(4))
fg = ~bg
fg = ndi.binary_opening(fg, iterations=2)
# drop small specks
lab2, n2 = ndi.label(fg)
if n2 > 1:
    sizes = ndi.sum(fg, lab2, range(1, n2 + 1))
    keep = np.isin(lab2, [i + 1 for i, s in enumerate(sizes) if s > 0.002 * fg.sum()])
    fg = keep
fg = ndi.binary_fill_holes(fg) if len(sys.argv) > 5 and sys.argv[5] == 'fill' else fg
fg = ndi.binary_erosion(fg, iterations=2)
alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
out = im.convert('RGBA'); out.putalpha(alpha)
bb = out.getbbox(); print('bbox', bb, 'size', out.size)
out.save(dst)
