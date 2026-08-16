#!/usr/bin/env python3
"""
Generate responsive, optimized WebP variants for every product photo.

Why this exists (V32.7 performance fix):
Real product photos were being served to the browser at their original
camera resolution (some over 5000x5000px, 2-3MB each) even though the
product card and detail gallery only ever display them at a few hundred
pixels wide. This script is the fix for spec item 6 (image/file size)
and item 9 (responsive images) — it does NOT touch item 7/8 (lazy
loading, video preload), which app.js already handles on its own.

What it does, for every images/products/<slug>/*.webp file:
  1. Leaves the original filename and path untouched (no code/DB
     changes required elsewhere — same "images/products/x/y.webp"
     paths keep working exactly as before).
  2. If the original is larger than MASTER_MAX px on its longest edge,
     it is resized DOWN to MASTER_MAX and re-saved in place. Nothing
     on a phone or desktop screen benefits from a 5000px source image,
     so this alone cuts most files by 90%+ with no visible difference.
  3. Generates two smaller sibling files for use in <img srcset>:
       <name>-400w.webp   (max 400px  - phones / thumbnails)
       <name>-800w.webp   (max 800px  - tablets / cards)
     (the resized master itself doubles as the ~1600w "desktop" tier)

Safe to re-run any time new product photos are added — it only ever
processes images/products/**/*.webp and skips any file that doesn't
need resizing. This should become a normal step of "add a new product
photo", alongside dropping the file into its products/<slug>/ folder.
"""
import os
import sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "images", "products")

MASTER_MAX = 1600   # "desktop" tier - also becomes the resized original
TIERS = [
    (400, 72, "-400w"),
    (800, 78, "-800w"),
]
MASTER_QUALITY = 84


def resize_to(im, max_dim):
    w, h = im.size
    if max(w, h) <= max_dim:
        return im.copy()
    scale = max_dim / float(max(w, h))
    return im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)


def is_variant_file(filename):
    stem, _ = os.path.splitext(filename)
    return stem.endswith("-400w") or stem.endswith("-800w")


def process_file(path):
    stem, ext = os.path.splitext(path)
    if ext.lower() != ".webp":
        return None
    if is_variant_file(path):
        return None  # don't re-process a previously generated variant

    before_size = os.path.getsize(path)
    im = Image.open(path).convert("RGB")
    orig_dims = im.size

    changed_master = False
    if max(im.size) > MASTER_MAX:
        im = resize_to(im, MASTER_MAX)
        im.save(path, "WEBP", quality=MASTER_QUALITY, method=6)
        changed_master = True

    generated = []
    for max_dim, quality, suffix in TIERS:
        out_path = f"{stem}{suffix}.webp"
        variant = resize_to(im, max_dim)
        variant.save(out_path, "WEBP", quality=quality, method=6)
        generated.append((out_path, os.path.getsize(out_path)))

    after_size = os.path.getsize(path)
    return {
        "path": path,
        "orig_dims": orig_dims,
        "new_dims": im.size,
        "before": before_size,
        "after": after_size,
        "changed_master": changed_master,
        "generated": generated,
    }


def human(n):
    for unit in ("B", "KB", "MB"):
        if n < 1024:
            return f"{n:.0f}{unit}"
        n /= 1024
    return f"{n:.1f}GB"


def main():
    if not os.path.isdir(ROOT):
        print(f"No such directory: {ROOT}")
        sys.exit(1)

    total_before = 0
    total_after = 0
    rows = []
    for dirpath, _dirs, files in os.walk(ROOT):
        for fn in sorted(files):
            if not fn.lower().endswith(".webp"):
                continue
            full = os.path.join(dirpath, fn)
            result = process_file(full)
            if not result:
                continue
            rows.append(result)
            total_before += result["before"]
            total_after += result["after"]
            for _gp, gsize in result["generated"]:
                total_after += gsize

    print(f"{'file':50} {'orig px':>12} {'new px':>10} {'before':>8} {'after (all tiers)':>18}")
    for r in rows:
        gen_total = r["after"] + sum(s for _p, s in r["generated"])
        rel = os.path.relpath(r["path"], ROOT)
        print(f"{rel:50} {str(r['orig_dims']):>12} {str(r['new_dims']):>10} {human(r['before']):>8} {human(gen_total):>18}")

    print()
    print(f"Total (masters + generated tiers): {human(total_before)} -> {human(total_after)}")
    print(f"Files processed: {len(rows)}")


if __name__ == "__main__":
    main()
