"""Builds the layers for the 'Dreieich III' pieces (cached in tools/cache/gta, not committed):

  per poster:  <name>_full.png   1080x1920 poster
               <name>_fg.png     subject alpha (ISNet)
               <name>_title.png  title lettering alpha (cream script + caps), if the poster has one
               <name>_bg.jpg     clean background plate (subject + title inpainted) for parallax
               <name>_art.jpg    poster without the title (title inpainted) -> subject layer / cover crops
  emblem.png   the 'III / drei eich' emblem, un-mixed from its chroma-key green background (RGBA)
"""
import os

import cv2
import numpy as np
from rembg import new_session, remove
from PIL import Image

from gta_common import CACHE, H, L, POSTERS, W, font, imread, imwrite, text_layer

os.makedirs(CACHE, exist_ok=True)
sess = new_session('isnet-general-use')
sess_alt = new_session('u2net')
ALT_MODEL = {'burg_hayn'}
DIM_CAPS = {'burgfestspiele', 'goetzenhain', 'parkschwimmbad'}      # posters whose small capitals are dimmer than the script
ell = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))


def inpaint(img8, mask8, radius=7, scale=0.5, shiftmap=False):
    """Inpaint at reduced resolution, pasted back only inside the hole.
    Telea for thin lettering; shift-map (copies real texture patches) for the big subject holes."""
    h, w = img8.shape[:2]
    small = cv2.resize(img8, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    ms = cv2.resize(mask8, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_NEAREST)
    if shiftmap:
        lab = cv2.cvtColor(small, cv2.COLOR_RGB2Lab)
        dst = np.zeros_like(lab)
        cv2.xphoto.inpaint(lab, (ms == 0).astype(np.uint8), dst, cv2.xphoto.INPAINT_SHIFTMAP)
        res = cv2.cvtColor(dst, cv2.COLOR_Lab2RGB)
        left = ((dst.astype(np.int32).sum(-1) == 0) & (ms > 0)).astype(np.uint8)   # pixels shift-map left empty
        if left.any():
            left = cv2.dilate(left, ell(2)) * 255
            res = cv2.cvtColor(cv2.inpaint(cv2.cvtColor(res, cv2.COLOR_RGB2BGR), left, 5, cv2.INPAINT_TELEA),
                               cv2.COLOR_BGR2RGB)
        res = cv2.resize(res, (w, h), interpolation=cv2.INTER_CUBIC)
    else:
        res = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), ms, radius, cv2.INPAINT_TELEA)
        res = cv2.resize(cv2.cvtColor(res, cv2.COLOR_BGR2RGB), (w, h), interpolation=cv2.INTER_CUBIC)
    a = cv2.GaussianBlur(mask8.astype(np.float32) / 255, (0, 0), 2.0)[..., None]
    a = np.clip(a * 1.6, 0, 1)
    return (img8 * (1 - a) + res * a).astype(np.uint8)


def recaption(full, art, m, text):
    """Replace the small capitals line under the script title (keeps the original script pixels)."""
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    ybot = np.nonzero(m.any(1))[0].max()
    caps = np.zeros_like(m)
    for k in range(1, n):
        if st[k, cv2.CC_STAT_HEIGHT] < 70 and st[k, cv2.CC_STAT_TOP] > ybot - 80 and st[k, cv2.CC_STAT_AREA] > 30:
            caps[lab == k] = 1
    ys, xs = np.nonzero(caps)
    hc, cx, cy = ys.max() - ys.min() + 1, (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    script = m & (1 - caps)
    col = np.median(full[cv2.erode(script, ell(2)) > 0].reshape(-1, 3), axis=0)
    fnt = font('Inter-SemiBold.otf', int(round(hc / 0.727)))
    target = 0.70 * W
    spacing = (target - sum(fnt.getlength(c) for c in text)) / (len(text) - 1)
    rgb, a = text_layer(text, fnt, fill=tuple(int(v) for v in col), spacing=spacing)
    iy, ix = np.nonzero(a > 0.05)
    rgb, a = rgb[iy.min():iy.max() + 1, ix.min():ix.max() + 1], a[iy.min():iy.max() + 1, ix.min():ix.max() + 1]
    x0 = int(np.clip(round(cx - a.shape[1] / 2), 40, W - 40 - a.shape[1]))
    y0 = int(round(cy - a.shape[0] / 2))
    sa = cv2.GaussianBlur(cv2.dilate(script, ell(1)) * 255, (0, 0), 0.8).astype(np.float32) / 255
    out = art.astype(np.float32) * (1 - sa[..., None]) + full.astype(np.float32) * sa[..., None]
    ca = np.zeros((H, W), np.float32)
    ca[y0:y0 + a.shape[0], x0:x0 + a.shape[1]] = a
    crgb = np.zeros((H, W, 3), np.float32)
    crgb[y0:y0 + a.shape[0], x0:x0 + a.shape[1]] = rgb * 255
    out = out * (1 - ca[..., None]) + crgb * ca[..., None]
    return out.clip(0, 255).astype(np.uint8), (np.maximum(sa, ca) * 255).astype(np.uint8)


import sys
ONLY = set(sys.argv[1:])
for name, cfg in POSTERS.items():
    if ONLY and name not in ONLY:
        continue
    src = imread(L('raw', 'gta', cfg['file']))[..., :3]
    full = cv2.resize(src, (W, H), interpolation=cv2.INTER_LANCZOS4)
    imwrite(os.path.join(CACHE, f'{name}_full.png'), full)

    # --- title lettering: cream pixels inside the title band
    title = np.zeros((H, W), np.uint8)
    if cfg['title']:
        y0, y1 = int(cfg['title'][0] * H), int(cfg['title'][1] * H)
        f = full.astype(np.int32)
        r, g, b = f[..., 0], f[..., 1], f[..., 2]
        cream = (r > 185) & (g > 172) & (b > 135) & (r - b < 100) & (np.abs(r - g) < 42) & (g - b > -5)
        band = np.zeros((H, W), bool)
        band[y0:y1] = True
        # the small spaced capitals are sometimes dimmer than the script: thin bright strokes (white top-hat)
        # in the lower part of the band
        lum = cv2.cvtColor(full, cv2.COLOR_RGB2GRAY)
        th = cv2.morphologyEx(lum, cv2.MORPH_TOPHAT, ell(9)).astype(np.int32)
        sat = f.max(-1) - f.min(-1)
        caps = np.zeros((H, W), bool)
        if cfg['title'][0] < 0.5:                         # title at the top: caps are the last line
            caps[int(y0 + 0.60 * (y1 - y0)):y1, int(0.14 * W):int(0.90 * W)] = True
        else:
            caps[int(y0 + 0.72 * (y1 - y0)):y1, int(0.10 * W):int(0.92 * W)] = True
        lo = name in DIM_CAPS
        thin = (th > (20 if lo else 38)) & (sat < (90 if lo else 70)) & (lum > (85 if lo else 120)) & caps
        m = (cream & band).astype(np.uint8)
        # keep the cream components that belong to the lettering block (drop isolated specks)
        blob = cv2.dilate(m, ell(22))
        n, lab, st, _ = cv2.connectedComponentsWithStats(blob)
        if n > 1:
            big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))
            keep = np.zeros_like(m)
            for k in range(1, n):
                if st[k, cv2.CC_STAT_AREA] > 0.12 * st[big, cv2.CC_STAT_AREA]:
                    keep[lab == k] = 1
            m = m & keep
        # the capitals sit centred under the script: accept thin strokes within +-0.30 W of its centre
        xs_ = np.nonzero(m.any(0))[0]
        cx_ = (xs_.min() + xs_.max()) / 2 if len(xs_) else W / 2
        xx_ = np.arange(W)[None, :]
        m = m | (thin & (np.abs(xx_ - cx_) < 0.30 * W)).astype(np.uint8)
        title = cv2.GaussianBlur(cv2.dilate(m, ell(1)) * 255, (0, 0), 0.8)
    imwrite(os.path.join(CACHE, f'{name}_title.png'), title)

    # --- art without title
    art = inpaint(full, cv2.dilate((title > 30).astype(np.uint8), ell(7)) * 255) if cfg['title'] else full
    imwrite(os.path.join(CACHE, f'{name}_art.jpg'), art)
    if cfg.get('caps'):
        full, title = recaption(full, art, m, cfg['caps'])
        imwrite(os.path.join(CACHE, f'{name}_full.png'), full)
        imwrite(os.path.join(CACHE, f'{name}_title.png'), title)

    # --- subject alpha
    fg = np.asarray(remove(Image.fromarray(art), session=sess_alt if name in ALT_MODEL else sess,
                           only_mask=True)).copy()
    yy, xx = np.mgrid[0:H, 0:W]
    if name == 'hirschsprung':
        # only the leaping stag is the foreground layer: segment it on a crop where it stands against the sky
        cy0, cy1, cx0, cx1 = int(0.225 * H), int(0.50 * H), int(0.16 * W), int(0.90 * W)
        part = np.asarray(remove(Image.fromarray(art[cy0:cy1, cx0:cx1]), session=sess, only_mask=True))
        fg = np.zeros((H, W), np.uint8)
        fg[cy0:cy1, cx0:cx1] = part
        n_, lab_, st_, _ = cv2.connectedComponentsWithStats((fg > 100).astype(np.uint8))
        if n_ > 1:
            fg = fg * (lab_ == 1 + int(np.argmax(st_[1:, cv2.CC_STAT_AREA])))
        # thin antler tips the model misses: dark pixels right next to the mask, against the bright sky
        near = cv2.dilate((fg > 100).astype(np.uint8), ell(22)) > 0
        dark = cv2.cvtColor(art, cv2.COLOR_RGB2GRAY) < 95
        fg = np.maximum(fg, ((near & dark & (yy < 0.36 * H)) * 255).astype(np.uint8))
    if name == 'bahnhof':
        # the segmentation models miss the cropped figure: rough hand-drawn outline, refined with GrabCut
        pts = np.array([(0, 95), (40, 92), (85, 105), (105, 130), (113, 150), (118, 170), (121, 190), (112, 205),
                        (108, 225), (92, 240), (80, 262), (88, 290), (92, 330), (90, 370), (105, 385), (135, 395),
                        (140, 430), (125, 455), (128, 480), (0, 480)], np.float32) * 4
        poly = np.zeros((H, W), np.uint8)
        cv2.fillPoly(poly, [pts.astype(np.int32)], 1)
        gc = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
        gc[cv2.dilate(poly, ell(28)) == 0] = cv2.GC_BGD
        gc[poly > 0] = cv2.GC_PR_FGD
        gc[cv2.erode(poly, ell(30)) > 0] = cv2.GC_FGD
        bgm, fgm = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
        cv2.grabCut(cv2.cvtColor(art, cv2.COLOR_RGB2BGR), gc, None, bgm, fgm, 4, cv2.GC_INIT_WITH_MASK)
        fg = (((gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)) * 255).astype(np.uint8)
        fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, ell(3))
    if name == 'burg_hayn':
        # white swan + splash by colour, plus head from the model, plus the near water with a soft edge
        hsv = cv2.cvtColor(art, cv2.COLOR_RGB2HSV).astype(np.int32)
        wm = ((hsv[..., 2] > 150) & (hsv[..., 1] < 75) & (yy > 0.30 * H)).astype(np.uint8)
        wm = cv2.morphologyEx(wm, cv2.MORPH_CLOSE, ell(15))
        n_, lab_, st_, _ = cv2.connectedComponentsWithStats(wm)
        swan = (lab_ == 1 + int(np.argmax(st_[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)
        head = ((fg > 100) & (yy > 0.40 * H)).astype(np.uint8)
        swan = cv2.morphologyEx(swan | head, cv2.MORPH_CLOSE, ell(40))
        near = np.clip((yy - 0.64 * H) / (0.07 * H), 0, 1)
        fg = (np.maximum(swan.astype(np.float32), near) * 255).astype(np.uint8)
    fg = cv2.GaussianBlur(fg, (0, 0), 1.0)
    imwrite(os.path.join(CACHE, f'{name}_fg.png'), fg)

    # --- clean background plate
    hole = cv2.dilate((fg > 40).astype(np.uint8), ell(9)) * 255
    bg = inpaint(art, hole, shiftmap=True)
    imwrite(os.path.join(CACHE, f'{name}_bg.jpg'), bg)
    print(name, 'fg coverage %.2f' % (fg > 128).mean(), 'title px', int((title > 128).sum()))

# ------------------------------------------------------------------ emblem: exact un-mix of the key colour
e = imread(L('raw', 'gta', 'emblem_key.png'))[..., :3].astype(np.float32) / 255
g = e[..., 1] - np.maximum(e[..., 0], e[..., 2])
key = np.clip((g - 0.15) / (0.75 - 0.15), 0, 1)                    # 1 = pure key colour
alpha = 1 - key
KEYC = np.median(e[key > 0.98].reshape(-1, 3), axis=0)
rgb = np.where(alpha[..., None] > 1e-3, (e - key[..., None] * KEYC) / np.maximum(alpha[..., None], 1e-3), 0)
rgb = np.clip(rgb, 0, 1)
# remove residual green spill on the outline
spill = np.clip(rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2]), 0, None)
rgb[..., 1] -= spill
ys, xs = np.nonzero(alpha > 0.02)
x0, x1, y0, y1 = xs.min() - 6, xs.max() + 7, ys.min() - 6, ys.max() + 7
rgba = np.dstack([rgb, alpha])[y0:y1, x0:x1]
imwrite(os.path.join(CACHE, 'emblem.png'), rgba)
os.makedirs(L('logos'), exist_ok=True)
imwrite(L('logos', 'gta_dreieich_III_emblem.png'), rgba)
print('emblem', rgba.shape)
