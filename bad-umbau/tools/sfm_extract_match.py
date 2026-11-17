import pycolmap, sys, os, time
root = sys.argv[1]
img = os.path.join(root, 'images'); db = os.path.join(root, 'db.db'); out = os.path.join(root, 'sparse')
os.makedirs(out, exist_ok=True)
t = time.time()
ro = pycolmap.ImageReaderOptions(); ro.camera_model = 'OPENCV'
eo = pycolmap.FeatureExtractionOptions(); eo.sift.max_num_features = 6000
try: eo.max_image_size = 1600
except Exception as e: print('max_image_size', e)
if not os.path.exists(db):
    pycolmap.extract_features(db, img, camera_mode=pycolmap.CameraMode.SINGLE, reader_options=ro, extraction_options=eo)
    print('features', round(time.time() - t), flush=True)
po = pycolmap.SequentialPairingOptions(); po.overlap = 12
try: po.quadratic_overlap = True
except Exception: pass
try: po.loop_detection = False
except Exception: pass
pycolmap.match_sequential(db, pairing_options=po)
print('matched', round(time.time() - t), flush=True)
opts = pycolmap.IncrementalPipelineOptions()
maps = pycolmap.incremental_mapping(db, img, out, options=opts)
print('mapped', round(time.time() - t), {k: (m.num_reg_images(), m.num_points3D()) for k, m in maps.items()}, flush=True)
