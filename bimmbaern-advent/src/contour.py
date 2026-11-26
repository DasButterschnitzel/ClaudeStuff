# einheitliche Tuschekontur um die freigestellte Figur
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
src, dst, px = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert('RGBA'); a = np.asarray(im)
alpha = a[:, :, 3] > 128
yy, xx = np.ogrid[-px:px + 1, -px:px + 1]
grown = ndi.binary_dilation(alpha, structure=(xx * xx + yy * yy <= px * px))
ga = Image.fromarray((grown * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.9))
ink = Image.new('RGBA', im.size, (30, 20, 18, 255)); ink.putalpha(ga)
ink.alpha_composite(im)
# keep the cut-off bottom edge clean (no contour line along the image border)
ink.save(dst)
