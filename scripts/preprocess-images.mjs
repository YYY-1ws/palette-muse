// Phase 0 image preprocessing.
//
// Reads from raw-images/, writes to public/paintings/.
// - Resizes long edge to 1600px (preserves aspect ratio)
// - JPEG/JPG -> JPEG q80 (mozjpeg)
// - PNG -> WebP q82
// - .jpeg extension preserved
// - Idempotent: skips if output exists and is newer than source
// - Warns if any output is >= 500KB

import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, basename } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, "raw-images");
const OUT_DIR = join(ROOT, "public", "paintings");
const MAX_LONG_EDGE = 1600;
const SIZE_WARN_BYTES = 500 * 1024;

// Non-ASCII source names get an ASCII name first, then the extension rules
// apply (簪花仕女图.png -> Court_Ladies.png -> Court_Ladies.webp).
const RENAME_MAP = {
  "簪花仕女图.png": "Court_Ladies.png",
};

function outputName(srcName) {
  const renamed = RENAME_MAP[srcName] ?? srcName;
  const ext = extname(renamed).toLowerCase();
  const stem = basename(renamed, extname(renamed));
  if (ext === ".png") return `${stem}.webp`;
  if (ext === ".jpeg") return `${stem}.jpeg`;
  return `${stem}.jpg`;
}

async function isUpToDate(srcPath, outPath) {
  if (!existsSync(outPath)) return false;
  const [s, o] = await Promise.all([stat(srcPath), stat(outPath)]);
  return o.mtimeMs >= s.mtimeMs;
}

async function processOne(srcName) {
  const srcPath = join(SRC_DIR, srcName);
  const outName = outputName(srcName);
  const outPath = join(OUT_DIR, outName);

  if (await isUpToDate(srcPath, outPath)) {
    return { srcName, outName, skipped: true };
  }

  const ext = extname(srcName).toLowerCase();
  let pipeline = sharp(srcPath).resize({
    width: MAX_LONG_EDGE,
    height: MAX_LONG_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    pipeline = pipeline.webp({ quality: 82 });
  } else {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  }

  await pipeline.toFile(outPath);
  const { size } = await stat(outPath);
  return { srcName, outName, size, skipped: false };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const all = await readdir(SRC_DIR);
  const targets = all.filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();

  console.log(`Found ${targets.length} source images.`);

  const results = [];
  for (const name of targets) {
    try {
      const r = await processOne(name);
      results.push(r);
      if (r.skipped) {
        console.log(`  [skip] ${name} -> ${r.outName} (up to date)`);
      } else {
        const kb = (r.size / 1024).toFixed(1);
        const warn = r.size >= SIZE_WARN_BYTES ? "  ⚠ over 500KB" : "";
        console.log(`  [done] ${name} -> ${r.outName}  ${kb}KB${warn}`);
      }
    } catch (err) {
      console.error(`  [fail] ${name}:`, err.message);
      process.exitCode = 1;
    }
  }

  const oversized = results.filter((r) => !r.skipped && r.size >= SIZE_WARN_BYTES);
  if (oversized.length) {
    console.log(`\n⚠ ${oversized.length} file(s) over 500KB — consider lowering quality or shrinking further.`);
  } else {
    console.log(`\n✓ All processed images under 500KB.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
