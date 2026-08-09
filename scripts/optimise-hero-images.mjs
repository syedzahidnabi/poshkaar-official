import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const HERO_IMAGES = [
  ['public/images/tillamain.jpg', 'public/images/home/hero-sozni-atelier.webp'],
  ['public/images/home/hero-weaver.png', 'public/images/home/hero-weaver.webp'],
  ['public/images/home/hero-dal-lake.png', 'public/images/home/hero-dal-lake.webp'],
  ['public/images/home/hero-traditional-pheran.jpeg', 'public/images/home/hero-traditional-pheran.webp'],
  ['public/images/home/hero-pheran.jpeg', 'public/images/home/hero-pheran.webp'],
];

for (const [source, destination] of HERO_IMAGES) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing hero source: ${source}`);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(destination);

  console.log(`Optimised ${destination}`);
}
