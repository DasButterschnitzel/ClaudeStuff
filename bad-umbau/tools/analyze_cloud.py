import pycolmap, numpy as np, sys, json
rec = pycolmap.Reconstruction(sys.argv[1])
P = np.array([p.xyz for p in rec.points3D.values()]); C = np.array([p.color for p in rec.points3D.values()]).astype(float)
err = np.array([p.error for p in rec.points3D.values()]); tl = np.array([p.track.length() for p in rec.points3D.values()])
keep = (err < 2.0) & (tl >= 3); P, C = P[keep], C[keep]
print('points', len(P))
cams = []; ups = []
for im in rec.images.values():
    if not im.has_pose: continue
    T = im.cam_from_world() if callable(im.cam_from_world) else im.cam_from_world
    R = T.rotation.matrix(); t = T.translation
    cams.append(-R.T @ t); ups.append(R.T @ np.array([0, -1, 0]))
cams = np.array(cams); up = np.mean(ups, 0); up /= np.linalg.norm(up)
print('cams', len(cams), 'up', up.round(3))
# Höhe entlang up
h = P @ up
# Boden: RANSAC Ebene nahe up-Richtung, untere Punkte
def ransac_plane(X, n0, iters=3000, thr=0.02, maxang=20):
    best = None; rng = np.random.default_rng(0)
    for _ in range(iters):
        s = X[rng.choice(len(X), 3, replace=False)]
        n = np.cross(s[1]-s[0], s[2]-s[0]); nn = np.linalg.norm(n)
        if nn < 1e-9: continue
        n /= nn
        if n0 is not None and abs(n @ n0) < np.cos(np.radians(maxang)): continue
        d = -n @ s[0]; inl = np.abs(X @ n + d) < thr
        if best is None or inl.sum() > best[2].sum(): best = (n, d, inl)
    return best
scale_guess = np.ptp(h)
lo = h < np.percentile(h, 25)
n_f, d_f, inl = ransac_plane(P[lo], up, thr=scale_guess*0.008)
if n_f @ up < 0: n_f, d_f = -n_f, -d_f
print('floor inliers', inl.sum(), 'normal·up', round(float(n_f@up),3))
up2 = n_f
hh = P @ up2 + d_f   # Höhe über Boden (Modelleinheiten)
print('height pct 1/50/99', np.percentile(hh,[1,50,99]).round(3))
# horizontale Basis
a = np.cross(up2, [1,0,0]); a /= np.linalg.norm(a); b = np.cross(up2, a)
XY = np.stack([P @ a, P @ b], 1)
# dominante Wandrichtung: Winkelhistogramm der Punkt-Nachbarschaften -> einfacher: PCA über Punkte mittlerer Höhe
mid = (hh > np.percentile(hh, 30)) & (hh < np.percentile(hh, 90))
best = None
for ang in np.radians(np.arange(0, 90, 0.5)):
    u = np.array([np.cos(ang), np.sin(ang)]); v = np.array([-np.sin(ang), np.cos(ang)])
    pu, pv = XY[mid] @ u, XY[mid] @ v
    sc = np.histogram(pu, 200)[0].max() + np.histogram(pv, 200)[0].max()
    if best is None or sc > best[0]: best = (sc, ang)
ang = best[1]; u = np.array([np.cos(ang), np.sin(ang)]); v = np.array([-np.sin(ang), np.cos(ang)])
pu, pv = XY @ u, XY @ v
for nm, q in [('u', pu[mid]), ('v', pv[mid])]:
    print(nm, 'pct 1/2/98/99', np.percentile(q,[1,2,98,99]).round(3))
np.savez(sys.argv[2], P=P, C=C, up=up2, d=d_f, a=a, b=b, u=u, v=v, cams=cams)
