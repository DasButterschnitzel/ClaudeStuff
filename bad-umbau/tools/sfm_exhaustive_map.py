import pycolmap, sys, os, time, shutil
root = sys.argv[1]; img = os.path.join(root, 'images'); db = os.path.join(root, 'db.db'); out = os.path.join(root, 'sparse2')
shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
t = time.time()
pycolmap.match_exhaustive(db)
print('exhaustive matched', round(time.time() - t), flush=True)
o = pycolmap.IncrementalPipelineOptions()
for k, v in [('min_model_size', 5), ('init_num_trials', 400)]:
    try: setattr(o, k, v)
    except Exception as e: print('opt', k, e)
m = o.mapper
for k, v in [('abs_pose_min_num_inliers', 12), ('init_min_num_inliers', 40), ('abs_pose_min_inlier_ratio', 0.15), ('init_max_error', 6.0)]:
    try: setattr(m, k, v)
    except Exception as e: print('mapper', k, e)
maps = pycolmap.incremental_mapping(db, img, out, options=o)
print('mapped', round(time.time() - t), {k: (r.num_reg_images(), r.num_points3D()) for k, r in maps.items()}, flush=True)
