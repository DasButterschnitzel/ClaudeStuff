"""Small compositing / motion toolkit for the Dreieich x Leonida logo animations.

Everything works on float32 RGB frames in [0, 1] at the output resolution
(1080x1920, 9:16).  Source artwork is 1024x1280 (4:5) and was expanded by
Adobe Firefly to 1024x1820 (9:16) with 270 px added on top and bottom.
"""
import math
import subprocess

import cv2
import numpy as np

W, H, FPS = 1080, 1920, 30
SRC_W, SRC_H, TOP = 1024, 1280, 270          # 4:5 source and its offset in the 9:16 canvas
S = W / SRC_W                                 # source px -> output px


# ----------------------------------------------------------------- io / coords
def P(x, y):
    """Map 4:5 source coordinates to output (9:16) coordinates."""
    return (x * S, (y + TOP) * S)


def imread_rgb(path):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None:
        raise FileNotFoundError(path)
    if im.ndim == 2:
        return im
    if im.shape[2] == 4:
        return cv2.cvtColor(im, cv2.COLOR_BGRA2RGBA)
    return cv2.cvtColor(im, cv2.COLOR_BGR2RGB)


def to_float(im):
    return np.clip(im.astype(np.float32) / 255.0, 0, 1)


def load_plate(path, size=(W, H)):
    im = imread_rgb(path)[..., :3]
    if (im.shape[1], im.shape[0]) != size:
        im = cv2.resize(im, size, interpolation=cv2.INTER_LANCZOS4)
    return to_float(im)


def mask45_to_out(m45):
    """Place a 1280x1024 (4:5) mask into the 9:16 canvas and scale to output."""
    c = np.zeros((SRC_H + 2 * TOP, SRC_W), np.float32)
    c[TOP:TOP + SRC_H] = m45
    return cv2.resize(c, (W, H), interpolation=cv2.INTER_LINEAR)


def img45_to_out(img45):
    c = np.zeros((SRC_H + 2 * TOP, SRC_W, img45.shape[2]), np.float32)
    c[TOP:TOP + SRC_H] = img45
    return cv2.resize(c, (W, H), interpolation=cv2.INTER_LANCZOS4)


def load_mask45(path):
    m = imread_rgb(path)
    if m.ndim == 3:
        m = m[..., 0]
    return m.astype(np.float32) / 255.0


def save_png(path, f):
    cv2.imwrite(path, cv2.cvtColor((np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8), cv2.COLOR_RGB2BGR))


# ----------------------------------------------------------------- math / easing
def clamp01(x):
    return min(1.0, max(0.0, x))


def prog(t, t0, t1):
    return clamp01((t - t0) / (t1 - t0))


def smoothstep(a, b, x):
    x = clamp01((x - a) / (b - a))
    return x * x * (3 - 2 * x)


def ease_out_expo(t):
    t = clamp01(t)
    return 1.0 if t >= 1 else 1 - 2 ** (-10 * t)


def ease_in_expo(t):
    t = clamp01(t)
    return 0.0 if t <= 0 else 2 ** (10 * t - 10)


def ease_out_cubic(t):
    t = clamp01(t)
    return 1 - (1 - t) ** 3


def ease_in_cubic(t):
    t = clamp01(t)
    return t ** 3


def ease_in_out_cubic(t):
    t = clamp01(t)
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def ease_out_back(t, s=1.70158):
    t = clamp01(t) - 1
    return 1 + (s + 1) * t ** 3 + s * t ** 2


def decay(t, t0, tau):
    """Exponential decay pulse starting at t0."""
    if t < t0:
        return 0.0
    return math.exp(-(t - t0) / tau)


# ----------------------------------------------------------------- image ops
def gblur(img, sigma):
    """Gaussian blur; large radii are computed on a downsampled copy (fast glows)."""
    if sigma <= 0.3:
        return img
    if sigma > 6:
        f = 4 if sigma > 24 else 2
        h, w = img.shape[:2]
        small = cv2.resize(img, (max(1, w // f), max(1, h // f)), interpolation=cv2.INTER_AREA)
        small = cv2.GaussianBlur(small, (0, 0), sigma / f)
        return cv2.resize(small, (w, h), interpolation=cv2.INTER_LINEAR)
    return cv2.GaussianBlur(img, (0, 0), sigma)


def screen(a, b):
    return 1 - (1 - a) * (1 - b)


def affine(img, scale=1.0, cx=W / 2, cy=H / 2, tx=0.0, ty=0.0, rot=0.0,
           border=cv2.BORDER_REFLECT101, interp=cv2.INTER_LINEAR):
    if abs(scale - 1) < 1e-5 and abs(tx) < 1e-3 and abs(ty) < 1e-3 and abs(rot) < 1e-4:
        return img
    M = cv2.getRotationMatrix2D((cx, cy), rot, scale)
    M[0, 2] += tx
    M[1, 2] += ty
    return cv2.warpAffine(img, M, (img.shape[1], img.shape[0]), flags=interp, borderMode=border)


def over(dst, src_rgb, alpha):
    a = alpha[..., None] if alpha.ndim == 2 else alpha
    return dst * (1 - a) + src_rgb * a


def lum(img):
    return img[..., 0] * 0.2126 + img[..., 1] * 0.7152 + img[..., 2] * 0.0722


def chroma_aberration(img, amount_px, cx=W / 2, cy=H / 2):
    if amount_px < 0.3:
        return img
    out = img.copy()
    k = amount_px / (W / 2)
    out[..., 0] = affine(img[..., 0], scale=1 + k, cx=cx, cy=cy)
    out[..., 2] = affine(img[..., 2], scale=1 - k, cx=cx, cy=cy)
    return out


def radial(cx, cy, sigma, shape=(H, W)):
    yy, xx = np.mgrid[0:shape[0], 0:shape[1]].astype(np.float32)
    return np.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * sigma ** 2))


_VIG = None


def vignette(img, strength=0.28):
    global _VIG
    if _VIG is None or _VIG.shape[:2] != img.shape[:2]:
        h, w = img.shape[:2]
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) / math.sqrt(2)
        _VIG = (1 - np.clip(r, 0, 1) ** 2.2)[..., None]
    return img * (1 - strength + strength * _VIG)


def grain(img, rng, amount=0.028):
    h, w = img.shape[:2]
    n = rng.standard_normal((h // 2, w // 2)).astype(np.float32)
    n = cv2.resize(n, (w, h), interpolation=cv2.INTER_LINEAR)
    # grain is stronger in mid-tones
    l = lum(img)
    wgt = 0.6 + 0.4 * (1 - np.abs(l - 0.5) * 2)
    return img + (n * amount * wgt)[..., None]


def band(shape, pos, angle_deg, width, origin=(0.0, 0.0)):
    """Soft straight light band; pos is measured along the band normal (px)."""
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle_deg)
    d = (xx - origin[0]) * math.cos(a) + (yy - origin[1]) * math.sin(a)
    return np.exp(-((d - pos) ** 2) / (2 * width ** 2))


# ----------------------------------------------------------------- sprites
def star_sprite(size=301, ray_len=0.48, ray_w=1.6, core=0.06, rays=4, rot=0.0):
    """4-point (or n-point) lens glint, peak 1.0."""
    c = size // 2
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) - c
    out = np.zeros((size, size), np.float32)
    for i in range(rays):
        a = math.radians(rot + i * 180.0 / rays)
        u = xx * math.cos(a) + yy * math.sin(a)
        v = -xx * math.sin(a) + yy * math.cos(a)
        L = size * ray_len
        ray = np.exp(-(v ** 2) / (2 * ray_w ** 2)) * np.clip(1 - np.abs(u) / L, 0, 1) ** 2.2
        out = np.maximum(out, ray)
    r2 = (xx ** 2 + yy ** 2) / (size * core) ** 2
    out = np.maximum(out, np.exp(-r2))
    out += 0.35 * np.exp(-(xx ** 2 + yy ** 2) / (2 * (size * 0.12) ** 2))
    return np.clip(out, 0, 1.4)


def add_sprite(frame, sprite, cx, cy, color, intensity, scale=1.0):
    if intensity <= 0.002:
        return frame
    sp = sprite
    if abs(scale - 1) > 1e-3:
        n = max(3, int(sprite.shape[0] * scale) | 1)
        sp = cv2.resize(sprite, (n, n), interpolation=cv2.INTER_LINEAR)
    s = sp.shape[0]
    x0, y0 = int(round(cx - s // 2)), int(round(cy - s // 2))
    x1, y1 = x0 + s, y0 + s
    fx0, fy0 = max(0, x0), max(0, y0)
    fx1, fy1 = min(frame.shape[1], x1), min(frame.shape[0], y1)
    if fx0 >= fx1 or fy0 >= fy1:
        return frame
    patch = sp[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0][..., None] * np.array(color, np.float32) * intensity
    frame[fy0:fy1, fx0:fx1] = screen(frame[fy0:fy1, fx0:fx1], np.clip(patch, 0, 1))
    return frame


def bokeh_field(rng, n, w=W, h=H, rmin=2, rmax=9):
    return [dict(x=rng.uniform(0, w), y=rng.uniform(0, h), r=rng.uniform(rmin, rmax),
                 vx=rng.uniform(-6, 6), vy=rng.uniform(-38, -10), ph=rng.uniform(0, 6.28),
                 a=rng.uniform(0.25, 0.9)) for _ in range(n)]


def draw_bokeh(frame, parts, t, color=(1.0, 0.45, 0.8), opacity=0.5):
    layer = np.zeros(frame.shape[:2], np.float32)
    for p in parts:
        x = (p['x'] + p['vx'] * t) % W
        y = (p['y'] + p['vy'] * t) % H
        a = p['a'] * (0.6 + 0.4 * math.sin(p['ph'] + t * 1.7))
        cv2.circle(layer, (int(x), int(y)), int(p['r']), float(a), -1, cv2.LINE_AA)
    layer = gblur(layer, 2.2)
    return screen(frame, np.clip(layer[..., None] * np.array(color, np.float32) * opacity, 0, 1))


# ----------------------------------------------------------------- output
class Writer:
    def __init__(self, path, fps=FPS, crf=17, size=(W, H)):
        self.size = size
        self.p = subprocess.Popen(
            ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
             '-s', f'{size[0]}x{size[1]}', '-r', str(fps), '-i', '-',
             '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-pix_fmt', 'yuv420p',
             '-profile:v', 'high', '-movflags', '+faststart', path],
            stdin=subprocess.PIPE)

    def write(self, f):
        self.p.stdin.write((np.clip(f, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())

    def close(self):
        self.p.stdin.close()
        self.p.wait()


def finish(frame, rng, grain_amt=0.022, vig=0.22):
    out = vignette(frame, vig)
    out = grain(out, rng, grain_amt)
    return np.clip(out, 0, 1)
