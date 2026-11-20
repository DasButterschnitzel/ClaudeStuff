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
    [('burg_hayn', 0.55, 0.43, 1.05), ('einflugschneise', 0.50, 0.30, 1.0), ('offenthal', 0.50, 0.50, 1.35)],
    [('burgfestspiele', 0.42, 0.37, 1.45), ('ebbelwoi', 0.27, 0.36, 2.0)],
    [('sprendlingen', 0.45, 0.41, 1.25), ('villenkolonie', 0.31, 0.33, 1.65), ('fahrgasse', 0.48, 0.42, 1.30)],
    [('goetzenhain', 0.50, 0.62, 1.0), ('bahnhof', 0.50, 0.31, 1.0)],
]
ROWS = {
    'story': [(0.23, [1, 1.08, 1]), (0.30, [1, 1]), (0.25, [1, 1.05, 1]), (0.22, [1.05, 1])],
    'feed':  [(0.25, [1, 1.08, 1]), (0.31, [1, 1]), (0.25, [1, 1.05, 1]), (0.19, [1.05, 1])],
}
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


def badge(size=120):
    """Own little mark for the corner: lime tile with the Dreieich triangle and swoosh."""
    s = size * 4
    im = np.zeros((s, s, 4), np.float32)
    tile = np.zeros((s, s), np.uint8)
    r = s // 7
    cv2.rectangle(tile, (r, 0), (s - r, s), 255, -1)
    cv2.rectangle(tile, (0, r), (s, s - r), 255, -1)
    for c in ((r, r), (s - r, r), (r, s - r), (s - r, s - r)):
        cv2.circle(tile, c, r, 255, -1)
    im[..., :3] = np.array([0.80, 0.89, 0.16], np.float32)
    im[..., 3] = tile / 255
    ink = np.zeros((s, s), np.uint8)
    cv2.fillPoly(ink, [np.array([(0.20 * s, 0.26 * s), (0.72 * s, 0.26 * s), (0.46 * s, 0.76 * s)], np.int32)], 255)
    sw = np.zeros((s, s), np.uint8)
    cv2.ellipse(sw, (int(0.50 * s), int(0.47 * s)), (int(0.36 * s), int(0.33 * s)), 0, -62, 58, 255, int(0.075 * s),
                cv2.LINE_AA)
    navy = np.array([0.04, 0.11, 0.22], np.float32)
    for m, col in ((ink, np.array([1, 1, 1], np.float32)), (sw, navy)):
        a = (m / 255.0)[..., None]
        im[..., :3] = im[..., :3] * (1 - a) + col * a
    return cv2.resize(im, (size, size), interpolation=cv2.INTER_AREA)


def build(w, h, kind):
    polys, gutter = cover_layout(w, h, ROWS[kind], margin=int(0.026 * w), gutter=int(0.0145 * w))
    panels = []
    for (r, c, poly) in polys:
        name, cx, cy, zoom = PANELS[r][c]
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
    bsz = int(0.105 * w)
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
