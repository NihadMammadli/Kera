#!/usr/bin/env node
/**
 * Cuts and resizes every picture in scripts/images.config.mjs.
 *
 *   npm run images
 *
 * Writes public/img/<name>-<width>.webp for each width that the original is
 * large enough to fill (and always the original's own width as the largest),
 * then content/images.json, which records the widths that exist and the
 * shape of each picture. Nothing is ever enlarged.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { RECIPES, WIDTHS } from './images.config.mjs';

const OUT = 'public/img';
const MANIFEST = 'content/images.json';
const QUALITY = 74;

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
let total = 0;

for (const r of RECIPES) {
  if (!fs.existsSync(r.src)) {
    console.error(`images — ${r.name}: the original ${r.src} is not there.`);
    process.exit(1);
  }

  const meta = await sharp(r.src).metadata();
  const [W, H] = [meta.width, meta.height];
  let [left, top, width, height] = [0, 0, W, H];

  if (r.box) {
    [left, top, width, height] = r.box;
  } else if (r.aspect) {
    const [fx, fy] = r.focus ?? [0.5, 0.5];
    if (W / H > r.aspect) {
      width = Math.round(H * r.aspect);
      left = Math.round(Math.min(Math.max(fx * W - width / 2, 0), W - width));
    } else {
      height = Math.round(W / r.aspect);
      top = Math.round(Math.min(Math.max(fy * H - height / 2, 0), H - height));
    }
  }

  const widths = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS.at(-1))])];
  for (const old of fs.readdirSync(OUT)) {
    if (old.startsWith(`${r.name}-`) && old.endsWith('.webp')) fs.unlinkSync(path.join(OUT, old));
  }

  const sizes = [];
  for (const w of widths) {
    const file = path.join(OUT, `${r.name}-${w}.webp`);
    await sharp(r.src)
      .extract({ left, top, width, height })
      .resize({ width: w })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(file);
    const bytes = fs.statSync(file).size;
    total += bytes;
    sizes.push(`${w}w ${Math.round(bytes / 1024)}K`);
  }

  const top_w = widths.at(-1);
  manifest[r.name] = { widths, width: top_w, height: Math.round((top_w * height) / width) };
  console.log(`  ✓ ${r.name.padEnd(15)} ${String(width).padStart(4)}×${String(height).padEnd(4)}  ${sizes.join(' · ')}`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nimages — ✓ ${RECIPES.length} pictures, ${Math.round(total / 1024)} KB in all. ${MANIFEST} written.`);
