"""Shared config for the 'Dreieich III' cover-style pieces (posters, cover collage, reels)."""
import os

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = lambda *p: os.path.join(ROOT, *p)
CACHE = L('tools', 'cache', 'gta')
W, H = 1080, 1920
PURPLE = np.array([0.105, 0.043, 0.180], np.float32)       # cover frame colour (dark violet)
CREAM = np.array([0.98, 0.94, 0.80], np.float32)

# name -> file, title band (y0, y1 as fractions, None = no separate title), focus point of the subject
POSTERS = {
    'offenthal':       dict(file='u_offenthal.png',          title=(0.035, 0.235), focus=(0.52, 0.46)),
    # the Burgfestspiele take place in the castle in Dreieichenhain -> the capitals line is re-set ('caps')
    'burgfestspiele':  dict(file='u_burgfestspiele.png',     title=(0.035, 0.225), focus=(0.24, 0.34),
                            caps='DREIEICHENHAIN'),
    'villenkolonie':   dict(file='u_villenkolonie.png',      title=(0.765, 0.960), focus=(0.27, 0.30)),
    'bahnhof':         dict(file='u_bahnhof_buchschlag.png', title=None,           focus=(0.27, 0.40)),
    'sprendlingen':    dict(file='n_sprendlingen.png',       title=(0.015, 0.185), focus=(0.42, 0.42)),
    'burg_hayn':       dict(file='n_burg_hayn.png',          title=(0.015, 0.185), focus=(0.58, 0.55)),
    'hirschsprung':    dict(file='n_hirschsprung.png',       title=(0.015, 0.215), focus=(0.50, 0.40)),
    'parkschwimmbad':  dict(file='n_parkschwimmbad.png',     title=(0.015, 0.175), focus=(0.50, 0.62)),
    'ebbelwoi':        dict(file='n_ebbelwoi.png',           title=(0.015, 0.215), focus=(0.42, 0.40)),
    'goetzenhain':     dict(file='n_goetzenhain.png',        title=(0.020, 0.215), focus=(0.55, 0.62)),
    'fahrgasse':       dict(file='n_fahrgasse.png',          title=(0.015, 0.210), focus=(0.44, 0.42)),
}


def font(name, size):
    return ImageFont.truetype(L('tools', 'fonts', name), size)


def text_layer(text, fnt, fill=(255, 255, 255), spacing=0, pad=12):
    """Render a single line to an RGBA float array (premultiplied-free: rgb, alpha)."""
    widths = [fnt.getlength(ch) for ch in text]
    asc, desc = fnt.getmetrics()
    w = int(sum(widths) + spacing * (len(text) - 1)) + 2 * pad
    h = asc + desc + 2 * pad
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    x = pad
    for ch, cw in zip(text, widths):
        d.text((x, pad), ch, font=fnt, fill=255)
        x += cw + spacing
    a = np.asarray(im).astype(np.float32) / 255
    rgb = np.ones((h, w, 3), np.float32) * (np.array(fill, np.float32) / 255)
    return rgb, a


def imread(path):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None:
        raise FileNotFoundError(path)
    if im.ndim == 2:
        return im
    if im.shape[2] == 4:
        return cv2.cvtColor(im, cv2.COLOR_BGRA2RGBA)
    return cv2.cvtColor(im, cv2.COLOR_BGR2RGB)


def imwrite(path, rgb):
    if rgb.dtype != np.uint8:
        rgb = (np.clip(rgb, 0, 1) * 255 + 0.5).astype(np.uint8)
    if rgb.ndim == 2:
        cv2.imwrite(path, rgb)
    elif rgb.shape[2] == 4:
        cv2.imwrite(path, cv2.cvtColor(rgb, cv2.COLOR_RGBA2BGRA))
    elif path.endswith('.jpg'):
        cv2.imwrite(path, cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 95])
    else:
        cv2.imwrite(path, cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))


# ----------------------------------------------------------------- cover layout (slanted panel grid)
def cover_layout(w, h, rows, margin=30, gutter=16, slope=0.035, skew=0.06):
    """rows: list of (height_fraction, [column width fractions]).  Returns list of (row, col, polygon)."""
    x0, x1 = margin, w - margin
    y0, y1 = margin, h - margin
    hs = np.array([r[0] for r in rows], np.float64)
    ys = y0 + np.concatenate([[0], np.cumsum(hs / hs.sum())]) * (y1 - y0)
    xc = (x0 + x1) / 2
    # row boundary k:  y = ys[k] + sl[k] * (x - xc); outer edges are straight
    sl = [0.0] + [slope * (1 if k % 2 else -1) for k in range(1, len(rows))] + [0.0]
    line_y = lambda k, x: ys[k] + sl[k] * (x - xc)
    polys = []
    for r, (_, cols) in enumerate(rows):
        cs = np.array(cols, np.float64)
        xs = x0 + np.concatenate([[0], np.cumsum(cs / cs.sum())]) * (x1 - x0)
        ym = (ys[r] + ys[r + 1]) / 2
        sk = [0.0] + [skew * (1 if (j + r) % 2 else -1) for j in range(1, len(cols))] + [0.0]

        def corner(j, k):
            # intersection of column line x = xs[j] + sk[j]*(y - ym) with row line k (two fixed-point steps)
            x = xs[j]
            for _ in range(4):
                y = line_y(k, x)
                x = xs[j] + sk[j] * (y - ym)
            return (x, line_y(k, x))

        for c in range(len(cols)):
            polys.append((r, c, np.array([corner(c, r), corner(c + 1, r), corner(c + 1, r + 1), corner(c, r + 1)],
                                         np.float32)))
    return polys, gutter


def poly_mask(poly, w, h, gutter):
    m = np.zeros((h * 2, w * 2), np.uint8)
    cv2.fillPoly(m, [np.round(poly * 2).astype(np.int32)], 255)
    k = int(gutter)                                         # erode by gutter/2 at 2x supersampling
    m = cv2.erode(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * k + 1, 2 * k + 1)))
    return cv2.resize(m, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
