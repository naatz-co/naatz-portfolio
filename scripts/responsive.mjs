// Generates smaller WebP variants (<name>-<w>.webp) next to every raster WebP in public/images,
// so pages can serve the right size per screen via srcset. Idempotent: existing variants are skipped.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

export const WIDTHS = [640, 1080, 1600];
const DIR = 'public/images';
const MANIFEST = 'src/data/variants.json';

const files = (await readdir(DIR)).filter((f) => /^[A-Za-z0-9]{12,}\.webp$/.test(f));
const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
let made = 0;
for (const f of files) {
  const src = join(DIR, f);
  const { width } = await sharp(src).metadata();
  const ws = WIDTHS.filter((w) => w < width - 80);
  for (const w of ws) {
    const out = join(DIR, f.replace(/\.webp$/, `-${w}.webp`));
    if (existsSync(out)) continue;
    await sharp(src).resize({ width: w }).webp({ quality: 82 }).toFile(out);
    made++;
  }
  manifest[f] = { w: width, variants: ws };
}
await writeFile(MANIFEST, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 1) + '\n');
console.log(`responsive: ${made} new variants, ${files.length} images`);
