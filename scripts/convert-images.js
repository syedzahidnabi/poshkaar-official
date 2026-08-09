// scripts/convert-images.js
// Usage: npm run convert-images
// This script converts images under public/images to WebP and creates responsive sizes.
// Requires: npm install --save-dev sharp

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const INPUT_DIR = path.join(process.cwd(), 'public', 'images');
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'webp');
const SIZES = [480, 800, 1200, 1600];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  const name = path.basename(file, ext);
  const inputPath = path.join(INPUT_DIR, file);
  const relativeDirectory = path.dirname(file);
  const outputDirectory = path.join(OUT_DIR, relativeDirectory === '.' ? '' : relativeDirectory);
  await ensureDir(outputDirectory);

  for (const w of SIZES) {
    const outName = `${name}-${w}.webp`;
    const outPath = path.join(outputDirectory, outName);
    await sharp(inputPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
    console.log('wrote', outPath);
  }
}

function listImages(directory, relativeDirectory = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'webp') return [];
    const relativePath = path.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? listImages(absolutePath, relativePath)
      : [relativePath];
  });
}

async function run() {
  await ensureDir(OUT_DIR);
  const files = listImages(INPUT_DIR);
  for (const f of files) {
    try {
      await processFile(f);
    } catch (err) {
      console.error('failed', f, err.message);
    }
  }
  console.log('done');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
