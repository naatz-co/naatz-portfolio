// Downloads every image/video the site references from Framer's CDN (one time),
// converts PNG/JPG to optimized WebP and records their dimensions in src/data/images.json.
// Files that already exist in public/ are skipped, so after the first run the site
// no longer depends on Framer at all.
//
//   node scripts/fetch-assets.mjs          -> fails on any download error
//   node scripts/fetch-assets.mjs --soft   -> warns and continues (used by `npm run build`)
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const SOFT = process.argv.includes('--soft');
const ROOT = new URL('..', import.meta.url).pathname;
const IMG_DIR = join(ROOT, 'public/images');
const VID_DIR = join(ROOT, 'public/videos');
const META = join(ROOT, 'src/data/images.json');
const MAX_W = 2400;
// Kept in their original format too (used for social previews / favicon)
const KEEP_ORIGINAL = new Set([
  'VADMgL6TToEMrbOoqLbcalVBQ.png', '8KNtFvAE2KUSBYdS1cNZMu1xDI.png',
  'SildzOslWjiuO13oOeWwRFskBM.jpg', '3sLqHDmGspqv6PivTjk42OWr6PE.png', 'EScmyVYqkBI3MVOC1Kbxv7Crkbo.jpg',
  'G2joQblLhM9kaxit9uwfQMCk90.png', 'gjEPCHWLFUEst3PqSsXGK3bQiy4.png', 'upmcNRHRx1EQ4VtCQqUh92JZvA.png',
]);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(html|astro|ts|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = [...(await walk(join(ROOT, 'raw'))), ...(await walk(join(ROOT, 'src')))];
const images = new Set(KEEP_ORIGINAL);
const videos = new Set();
for (const f of files) {
  const txt = await readFile(f, 'utf8');
  for (const m of txt.matchAll(/\b([A-Za-z0-9]{12,})\.(png|jpe?g|gif|svg)\b/g)) images.add(`${m[1]}.${m[2]}`);
  for (const m of txt.matchAll(/\b([A-Za-z0-9]{12,})\.(mp4|webm|mov)\b/g)) videos.add(`${m[1]}.${m[2]}`);
}

await mkdir(IMG_DIR, { recursive: true });
await mkdir(VID_DIR, { recursive: true });
const meta = existsSync(META) ? JSON.parse(await readFile(META, 'utf8')) : {};

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

let failed = 0, fetched = 0;
for (const file of images) {
  const ext = extname(file).toLowerCase();
  const raster = ['.png', '.jpg', '.jpeg'].includes(ext);
  const webpName = file.replace(/\.(png|jpe?g)$/i, '.webp');
  const target = join(IMG_DIR, raster ? webpName : file);
  const needOriginal = KEEP_ORIGINAL.has(file) && !existsSync(join(IMG_DIR, file));
  if (existsSync(target) && meta[file] && !needOriginal) continue;
  try {
    const buf = await download(`https://framerusercontent.com/images/${file}`);
    fetched++;
    if (raster) {
      const img = sharp(buf).rotate();
      const { width } = await img.metadata();
      const out = await img.resize({ width: Math.min(width, MAX_W), withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
      await writeFile(target, out.data);
      meta[file] = { w: out.info.width, h: out.info.height, webp: true };
      if (KEEP_ORIGINAL.has(file)) {
        const og = await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).toBuffer();
        await writeFile(join(IMG_DIR, file), og);
      }
    } else {
      await writeFile(target, buf);
      try {
        const m = await sharp(buf).metadata();
        meta[file] = { w: m.width, h: m.pageHeight || m.height };
      } catch { meta[file] = {}; }
    }
    console.log('✓', file);
  } catch (e) {
    failed++;
    console.warn('✗', file, e.message);
  }
}

for (const file of videos) {
  const target = join(VID_DIR, file);
  if (existsSync(target) && (await stat(target)).size > 0) continue;
  try {
    await writeFile(target, await download(`https://framerusercontent.com/assets/${file}`));
    fetched++;
    console.log('✓', file);
  } catch (e) {
    failed++;
    console.warn('✗', file, e.message);
  }
}

await writeFile(META, JSON.stringify(Object.fromEntries(Object.entries(meta).sort()), null, 1) + '\n');
console.log(`\n${images.size} images, ${videos.size} videos referenced · ${fetched} downloaded · ${failed} failed`);
if (failed && !SOFT) process.exit(1);
