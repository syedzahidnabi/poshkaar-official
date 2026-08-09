import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPresentationPreset,
  getProductPresentation,
} from './catalogPresentation.js';

test('matches a missing product image to the recorded craft', () => {
  const product = getProductPresentation({
    id: 'tilla-01',
    title: 'Ruby Tilla Work Shawl',
    embroidery_type: 'Tilla',
    images: [],
  });

  assert.equal(product.images[0], '/images/product-tilla-ivory.jpg');
  assert.equal(product.image_is_studio_preview, true);
  assert.match(product.image_disclosure, /Studio visualisation/);
});

test('keeps supplied product photography unchanged', () => {
  const product = getProductPresentation({
    id: 'verified-01',
    title: 'Verified piece',
    images: ['/images/products/aari/aari1-main.jpg'],
    photography_status: 'approved',
  });

  assert.deepEqual(product.images, ['/images/products/aari/aari1-main.jpg']);
  assert.equal(product.image_is_studio_preview, false);
});

test('labels supplied studio visuals while exact-piece photography is pending', () => {
  const product = getProductPresentation({
    id: 'willow-01',
    title: 'Crescent Willow Carry Basket',
    images: ['https://example.com/willow1-main.jpg'],
    photography_status: 'pending',
  });

  assert.deepEqual(product.images, ['https://example.com/willow1-main.jpg']);
  assert.equal(product.image_is_studio_preview, true);
  assert.match(product.image_disclosure, /Studio visualisation/);
});

test('does not assign an unrelated studio visual without a craft match', () => {
  const product = getProductPresentation({
    id: 'unknown-01',
    title: 'Unnamed object',
    images: [],
  });

  assert.equal(product.images[0], '/images/product-placeholder.svg');
  assert.equal(product.image_is_studio_preview, false);
  assert.equal(getPresentationPreset(product), null);
});
