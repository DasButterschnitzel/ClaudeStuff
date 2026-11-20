"""'Dreieich III' cover: slanted panel collage in the manner of an open-world game cover.

`build(w, h)` returns the parts (panel sprites, emblem, badge) so the reels can animate them;
running the file writes the stills final/gta_cover_4x5.jpg and final/gta_cover_9x16.jpg.
"""
import os

import cv2
import numpy as np

from gta_common import CACHE, L, PURPLE, cover_layout, imread, imwrite, poly_mask

# (poster, crop centre x, y in the poster, zoom)  — row by row
PANELS = [
    [('burg_hayn', 0.55, 0.43, 1.05), ('parkschwimmbad', 0.47, 0.62, 1.15), ('offenthal', 0.50, 0.50, 1.35)],
    [('burgfestspiele', 0.42, 0.37, 1.45), ('ebbelwoi', 0.27, 0.36, 2.0)],
    [('sprendlingen', 0.45, 0.41, 1.25), ('villenkolonie', 0.31, 0.33, 1.65), ('fahrgasse', 0.48, 0.42, 1.30)],
    [('goetzenhain', 0.50, 0.62, 1.0), ('hirschsprung', 0.60, 0.40, 1.22)],
]
ROWS = {
    'story': [(0.23, [1, 1.08, 1]), (0.30, [1, 1]), (0.25, [1, 1.05, 1]), (0.22, [1.05, 1])],
    'feed':  [(0.24, [1, 1.08, 1]), (0.31, [1, 1]), (0.24, [1, 1.05, 1]), (0.21, [1.05, 1])],
}
FEED_CROP = {'hirschsprung': (0.50, 0.365, 1.0)}        # the 4:5 bottom row is flatter: show the whole leap
_art = {}


def art(name):
    if name not in _art:
        _art[name] = imread(os.path.join(CACHE, f'{name}_art.jpg')).astype(np.float32) / 255
    return _art[name]


def crop_fit(img, cx, cy, zoom, bw, bh):
    h, w = img.shape[:2]
    a = bw / bh
    ch = min(h, w / a) / zoom
    cw = ch * a
    x0 = float(np.clip(cx * w - cw / 2, 0, w - cw))
    y0 = float(np.clip(cy * h - ch / 2, 0, h - ch))
    M = np.float32([[bw / cw, 0, -x0 * bw / cw], [0, bh / ch, -y0 * bh / ch]])
    return cv2.warpAffine(img, M, (bw, bh), flags=cv2.INTER_AREA if bw < cw else cv2.INTER_CUBIC)


def _rounded(w, h, r):
    m = np.zeros((h, w), np.uint8)
    cv2.rectangle(m, (r, 0), (w - r, h), 255, -1)
    cv2.rectangle(m, (0, r), (w, h - r), 255, -1)
    for c in ((r, r), (w - r - 1, r), (r, h - r - 1), (w - r - 1, h - r - 1)):
        cv2.circle(m, c, r, 255, -1, cv2.LINE_AA)
    return m.astype(np.float32) / 255


def _on_plate(logo_rgba, w, h, pad, radius):
    """Official artwork, unmodified, centred on a white rounded plate (the logo is the 'positiv' version)."""
    s = 4
    W4, H4 = w * s, h * s
    im = np.ones((H4, W4, 4), np.float32)
    im[..., 3] = _rounded(W4, H4, int(radius * s))
    ys, xs = np.nonzero(logo_rgba[..., 3] > 0.02)
    lg = logo_rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    k = min((W4 - 2 * pad * s) / lg.shape[1], (H4 - 2 * pad * s) / lg.shape[0])
    lg = cv2.resize(lg, (int(lg.shape[1] * k), int(lg.shape[0] * k)),
                    interpolation=cv2.INTER_AREA if k < 1 else cv2.INTER_CUBIC)
    y0, x0 = (H4 - lg.shape[0]) // 2, (W4 - lg.shape[1]) // 2
    reg = im[y0:y0 + lg.shape[0], x0:x0 + lg.shape[1]]
    a = lg[..., 3:4]
    reg[..., :3] = reg[..., :3] * (1 - a) + lg[..., :3] * a
    return cv2.resize(im, (w, h), interpolation=cv2.INTER_AREA)


def badge(size=120):
    """Corner tile: the official Dreieich mark (triangle + arc) on a white rounded tile."""
    mark = imread(L('raw', 'brand', 'Dreieich_Bildmarke.png')).astype(np.float32) / 255
    return _on_plate(mark, size, size, pad=size * 0.07, radius=size * 0.16)


def logo_plate(width=860):
    """The full official logo (word mark + mark) on a white plate, for the intro card."""
    logo = imread(L('raw', 'brand', 'logo_full.png')).astype(np.float32) / 255
    h = int(width * 0.34)
    return _on_plate(logo, width, h, pad=width * 0.06, radius=width * 0.035)


def build(w, h, kind):
    polys, gutter = cover_layout(w, h, ROWS[kind], margin=int(0.026 * w), gutter=int(0.0145 * w))
    panels = []
    for (r, c, poly) in polys:
        name, cx, cy, zoom = PANELS[r][c]
        if kind == 'feed' and name in FEED_CROP:
            cx, cy, zoom = FEED_CROP[name]
        x0, y0 = np.floor(poly.min(0)).astype(int)
        x1, y1 = np.ceil(poly.max(0)).astype(int)
        x0, y0, x1, y1 = max(0, x0), max(0, y0), min(w, x1), min(h, y1)
        m = poly_mask(poly, w, h, gutter)[y0:y1, x0:x1]
        rgb = crop_fit(art(name), cx, cy, zoom, x1 - x0, y1 - y0)
        # a thin lighter inner edge like printed panel borders
        panels.append(dict(name=name, row=r, col=c, box=(x0, y0, x1, y1), rgb=rgb, a=m,
                           centre=((x0 + x1) / 2, (y0 + y1) / 2)))
    em = imread(os.path.join(CACHE, 'emblem.png')).astype(np.float32) / 255
    ew = int(w * (0.62 if kind == 'story' else 0.56))
    eh = int(ew * em.shape[0] / em.shape[1])
    em = cv2.resize(em, (ew, eh), interpolation=cv2.INTER_AREA)
    rows = ROWS[kind]
    tot = sum(r[0] for r in rows)
    yc = h * (rows[0][0] + rows[1][0] / 2) / tot + 0.012 * h
    emblem = dict(rgba=em, centre=(w / 2, yc))
    bsz = int(0.125 * w)
    bd = dict(rgba=badge(bsz), centre=(w - int(0.026 * w) - int(0.0145 * w) - bsz / 2 - 14,
                                       h - int(0.026 * w) - int(0.0145 * w) - bsz / 2 - 14))
    return dict(panels=panels, emblem=emblem, badge=bd, w=w, h=h)


def paste(canvas, rgba, cx, cy, scale=1.0, opacity=1.0, shadow=0.0):
    """Alpha-composite an RGBA sprite centred at (cx, cy)."""
    sp = rgba
    if abs(scale - 1) > 1e-3:
        sp = cv2.resize(rgba, (max(2, int(rgba.shape[1] * scale)), max(2, int(rgba.shape[0] * scale))),
                        interpolation=cv2.INTER_LINEAR)
    sh, sw = sp.shape[:2]
    x0, y0 = int(round(cx - sw / 2)), int(round(cy - sh / 2))
    fx0, fy0, fx1, fy1 = max(0, x0), max(0, y0), min(canvas.shape[1], x0 + sw), min(canvas.shape[0], y0 + sh)
    if fx0 >= fx1 or fy0 >= fy1:
        return canvas
    s = sp[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0]
    a = s[..., 3:4] * opacity
    if shadow > 0:
        sa = cv2.GaussianBlur(s[..., 3], (0, 0), 14)[..., None] * shadow
        off = 16
        reg = canvas[fy0 + off:fy1 + off, fx0 + off:fx1 + off]
        reg *= (1 - sa[:reg.shape[0], :reg.shape[1]])
    canvas[fy0:fy1, fx0:fx1] = canvas[fy0:fy1, fx0:fx1] * (1 - a) + s[..., :3] * a
    return canvas


def compose(parts):
    w, h = parts['w'], parts['h']
    f = np.ones((h, w, 3), np.float32) * PURPLE
    for p in parts['panels']:
        x0, y0, x1, y1 = p['box']
        a = p['a'][..., None]
        f[y0:y1, x0:x1] = f[y0:y1, x0:x1] * (1 - a) + p['rgb'] * a
    paste(f, parts['emblem']['rgba'], *parts['emblem']['centre'], shadow=0.55)
    paste(f, parts['badge']['rgba'], *parts['badge']['centre'])
    return f


if __name__ == '__main__':
    for kind, (w, h) in (('feed', (1080, 1350)), ('story', (1080, 1920))):
        f = compose(build(w, h, kind))
        out = L('final', f'gta_cover_{"4x5" if kind == "feed" else "9x16"}.jpg')
        imwrite(out, f)
        print('->', out)
    # the ten location posters as story stills
    from gta_common import POSTERS
    for name in POSTERS:
        imwrite(L('final', f'gta_poster_{name}_9x16.jpg'), imread(os.path.join(CACHE, f'{name}_full.png')))
    print('posters ->', len(POSTERS))
