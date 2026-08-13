import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CATALOG_PRODUCTS, CATALOG_PRODUCT_COUNT } from './catalogProducts.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('publishes the complete 51-product local catalogue', () => {
  assert.equal(CATALOG_PRODUCT_COUNT, 51);
  assert.equal(new Set(CATALOG_PRODUCTS.map((product) => product.id)).size, 51);
});

test('publishes six complete walnut-wood products', () => {
  const walnutWood = CATALOG_PRODUCTS.filter((product) => product.category === 'Walnut Wood');
  assert.equal(walnutWood.length, 6);
  assert.deepEqual(
    walnutWood.map((product) => product.id),
    ['walnut-01', 'walnut-02', 'walnut-03', 'walnut-04', 'walnut-05', 'walnut-06'],
  );
});

test('publishes six complete papier-mache products', () => {
  const papierMache = CATALOG_PRODUCTS.filter((product) => product.category === 'Papier Mache');
  assert.equal(papierMache.length, 6);
  assert.deepEqual(
    papierMache.map((product) => product.id),
    ['papier-01', 'papier-02', 'papier-03', 'papier-04', 'papier-05', 'papier-06'],
  );
});

test('publishes five complete willow-wicker products', () => {
  const willowWicker = CATALOG_PRODUCTS.filter((product) => product.category === 'Willow Wicker');
  assert.equal(willowWicker.length, 5);
  assert.deepEqual(
    willowWicker.map((product) => product.id),
    ['willow-01', 'willow-02', 'willow-03', 'willow-04', 'willow-05'],
  );
});

test('publishes five complete copperware products', () => {
  const copperware = CATALOG_PRODUCTS.filter((product) => product.category === 'Copperware');
  assert.equal(copperware.length, 5);
  assert.deepEqual(
    copperware.map((product) => product.id),
    ['copper-01', 'copper-02', 'copper-03', 'copper-04', 'copper-05'],
  );
});

test('every catalogue product has checkout and merchandising data', () => {
  for (const product of CATALOG_PRODUCTS) {
    assert.ok(product.id);
    assert.ok(product.sku);
    assert.ok(product.title);
    assert.ok(Number(product.price) > 0, `${product.id} needs a price`);
    assert.ok(Number(product.stock) > 0, `${product.id} needs stock`);
    assert.ok(product.published, `${product.id} must be published`);
    assert.equal(product.status, 'active');
    assert.ok(product.material);
    assert.ok(product.origin);
    assert.ok(product.description);
    assert.ok(product.care_instructions);
    assert.ok(product.images.length > 0);
  }
});

test('every catalogue image and responsive primary image exists', () => {
  for (const product of CATALOG_PRODUCTS) {
    for (const image of product.images) {
      assert.ok(
        fs.existsSync(path.join(projectRoot, 'public', image.replace(/^\//, ''))),
        `${product.id} is missing ${image}`,
      );
    }

    const relativePrimary = product.image
      .replace(/^\/images\//, '')
      .replace(/\.(?:jpe?g|png)$/i, '');
    for (const width of [480, 800, 1200]) {
      const webp = path.join(projectRoot, 'public', 'images', 'webp', `${relativePrimary}-${width}.webp`);
      assert.ok(fs.existsSync(webp), `${product.id} is missing ${width}px WebP`);
    }
  }
});

