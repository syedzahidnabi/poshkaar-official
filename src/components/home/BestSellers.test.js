import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ensureCraftCoverage,
  getCraftGroup,
  selectApprovedPhotography,
} from './BestSellers.jsx';
import { LOCAL_PRODUCTS } from '../../lib/static-products.js';

test('homepage edit includes the main Poshkaar craft categories', () => {
  const selected = ensureCraftCoverage(
    selectApprovedPhotography(LOCAL_PRODUCTS),
    LOCAL_PRODUCTS,
    8,
  );

  const groups = new Set(selected.map((product) => getCraftGroup(product)));

  for (const group of ['Aari', 'Tilla', 'Dabka', 'Zari', 'Walnut Wood', 'Papier Mâché', 'Copperware', 'Willow Wicker']) {
    assert.equal(groups.has(group), true, `${group} should appear in the homepage edit`);
  }
});
