import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { HOME_IMAGE_ENTRIES, HOME_MEDIA } from './homepageMedia.js';

test('hero carousel uses five distinct supplied photographs', () => {
  assert.equal(HOME_MEDIA.heroSlides.length, 5);
  assert.equal(
    new Set(HOME_MEDIA.heroSlides.map((slide) => slide.src)).size,
    HOME_MEDIA.heroSlides.length,
  );
  assert.ok(HOME_MEDIA.heroSlides.every((slide) => (
    slide.kind === 'photograph'
    && slide.title.length >= 3
    && slide.description.trim().length >= 30
    && slide.mobileObjectPosition
  )));
});

test('each homepage image slot uses a different photograph', () => {
  const paths = HOME_IMAGE_ENTRIES.map(([, media]) => media.src);
  assert.equal(new Set(paths).size, paths.length);
  assert.ok(HOME_IMAGE_ENTRIES.every(([, media]) => media.kind === 'photograph'));

  const hashes = HOME_IMAGE_ENTRIES.map(([, media]) => {
    const localPath = path.join(process.cwd(), 'public', media.src.replace(/^\//, ''));
    return createHash('sha256').update(fs.readFileSync(localPath)).digest('hex');
  });
  assert.equal(new Set(hashes).size, hashes.length, 'homepage slots must not use copied versions of the same photo');
});

test('every homepage photograph exists and has useful alt text', () => {
  for (const [slot, media] of HOME_IMAGE_ENTRIES) {
    const localPath = path.join(process.cwd(), 'public', media.src.replace(/^\//, ''));
    assert.ok(fs.existsSync(localPath), `${slot} is missing ${media.src}`);
    assert.ok(media.alt.trim().length >= 12, `${slot} needs descriptive alt text`);
  }
});

test('known generated visuals cannot return to the homepage map', () => {
  const blocked = [
    /hero-poshkaar-atelier/i,
    /main-banner/i,
    /\/products\/(?:copperware|walnut-wood|papier-mache|willow-wicker)\//i,
    /gemini/i,
    /chatgpt/i,
  ];

  for (const [slot, media] of HOME_IMAGE_ENTRIES) {
    assert.ok(
      blocked.every((pattern) => !pattern.test(media.src)),
      `${slot} uses a blocked generated visual: ${media.src}`,
    );
  }
});
