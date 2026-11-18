"""Render driver: video or contact-sheet preview for a frame function f(t) -> RGB float frame."""
import os
import sys
import time

import cv2
import numpy as np

from fx import FPS, Writer, save_png


def contact_sheet(frame_fn, times, path, cols=4, thumb_w=270):
    tiles = []
    for t in times:
        f = frame_fn(t)
        th = cv2.resize(f, (thumb_w, int(f.shape[0] * thumb_w / f.shape[1])), interpolation=cv2.INTER_AREA)
        th = (np.clip(th, 0, 1) * 255).astype(np.uint8)
        cv2.putText(th, f'{t:.2f}s', (8, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)
        tiles.append(th)
    rows = []
    for i in range(0, len(tiles), cols):
        row = tiles[i:i + cols]
        while len(row) < cols:
            row.append(np.zeros_like(tiles[0]))
        rows.append(np.concatenate(row, 1))
    sheet = np.concatenate(rows, 0)
    cv2.imwrite(path, cv2.cvtColor(sheet, cv2.COLOR_RGB2BGR))


def main(frame_fn, name, duration, preview_times, poster_t=None):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    mode = sys.argv[1] if len(sys.argv) > 1 else 'preview'
    if mode == 'preview':
        sp = os.environ.get('SP', '/tmp')
        out = os.path.join(sp, f'{name}_sheet.png')
        contact_sheet(frame_fn, preview_times, out)
        print('sheet ->', out)
        return
    if mode == 'frame':
        t = float(sys.argv[2])
        sp = os.environ.get('SP', '/tmp')
        out = os.path.join(sp, f'{name}_{t:.2f}.png')
        save_png(out, frame_fn(t))
        print('frame ->', out)
        return
    out = os.path.join(root, 'anim', f'{name}.mp4')
    w = Writer(out)
    n = int(round(duration * FPS))
    t0 = time.time()
    for i in range(n):
        w.write(frame_fn(i / FPS))
        if i % 60 == 0:
            print(f'{name}: {i}/{n}  {time.time() - t0:.1f}s', flush=True)
    w.close()
    if poster_t is not None:
        fr = (np.clip(frame_fn(poster_t), 0, 1) * 255 + 0.5).astype(np.uint8)
        cv2.imwrite(os.path.join(root, 'anim', f'{name}_poster.jpg'), cv2.cvtColor(fr, cv2.COLOR_RGB2BGR),
                    [cv2.IMWRITE_JPEG_QUALITY, 90])
    print('video ->', out, f'{time.time() - t0:.1f}s')
