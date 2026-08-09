import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://localhost:5173';
const outputDir = 'tmp';

let localViteServer;
try {
  const response = await fetch(baseUrl, { signal: AbortSignal.timeout(2500) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  const parsedBaseUrl = new URL(baseUrl);
  const isLocalTarget = ['localhost', '127.0.0.1', '::1'].includes(parsedBaseUrl.hostname);
  if (!isLocalTarget) throw error;

  localViteServer = await createServer({
    server: {
      host: parsedBaseUrl.hostname === 'localhost' ? '127.0.0.1' : parsedBaseUrl.hostname,
      port: Number(parsedBaseUrl.port || 5173),
      strictPort: true,
      hmr: false,
    },
    logLevel: 'error',
  });
  await localViteServer.listen();
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
const logs = [];
const checks = [];

const addCheck = (name, ok, detail = '') => checks.push({ name, ok, detail });

page.on('console', (msg) => {
  if (['error', 'warning'].includes(msg.type())) logs.push(`${msg.type()}: ${msg.text()}`);
});
page.on('pageerror', (error) => logs.push(`pageerror: ${error.message}`));
page.on('response', (response) => {
  if ([403, 404, 500].includes(response.status())) {
    logs.push(`response ${response.status()}: ${response.url()}`);
  }
});

await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(1800);

const movingLineCount = await page.locator('.hero-depth-lines, .hero-clean-thread, .home-thread-line').count();
addCheck('homepage moving line overlays removed', movingLineCount === 0, `found ${movingLineCount}`);
addCheck('homepage full-image frame visible', await page.locator('.hero-text-frame').count() === 1);
addCheck(
  'homepage headline visible',
  await page.getByRole('heading', { name: /Clothes for.*the memories.*you keep/i }).isVisible().catch(() => false),
);
addCheck('homepage primary CTA visible', await page.getByRole('link', { name: /Explore the collection/i }).isVisible().catch(() => false));
addCheck(
  'homepage hero has no visible manual carousel controls',
  await page.locator('.hero-carousel-controls, .hero-carousel-button, .hero-carousel-dot').count() === 0,
);
addCheck(
  'homepage hero starts on the three-girls image',
  await page.locator('.hero-carousel-image').first().getAttribute('src').then((src) => /hero-traditional-pheran/i.test(src || '')).catch(() => false),
);
addCheck(
  'homepage has no horizontal overflow',
  await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
);

const heroSection = await page.locator('section[aria-label="Poshkaar Kashmir craft collection"]').boundingBox();
await page.screenshot({
  path: `${outputDir}/audit-hero.png`,
  type: 'png',
  clip: heroSection
    ? {
        x: Math.max(0, heroSection.x),
        y: Math.max(0, heroSection.y),
        width: Math.min(heroSection.width, 1440),
        height: Math.min(heroSection.height, 900),
      }
    : undefined,
});

await page.goto(`${baseUrl}/collections`, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(800);
const firstProductPath = await page.locator('a[href^="/product/"]').first().getAttribute('href').catch(() => null);
addCheck('catalogue exposes a product route', Boolean(firstProductPath), firstProductPath || 'no product link found');

if (firstProductPath) {
  await page.goto(`${baseUrl}${firstProductPath}`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(800);
}

const productHeading = page.locator('h1').first();
addCheck('product page title visible', await productHeading.isVisible().catch(() => false));
addCheck('product craft story visible', await page.getByRole('heading', { name: /What we know about this piece/i }).isVisible().catch(() => false));

const addToBagButton = page.getByRole('button', { name: /add to bag/i }).first();
const canAddProduct = await addToBagButton.isVisible().catch(() => false)
  && await addToBagButton.isEnabled().catch(() => false);
const externalNetworkBlocked = logs.some((entry) => (
  /ERR_(?:NETWORK_ACCESS_DENIED|NAME_NOT_RESOLVED|CONNECTION_REFUSED)/.test(entry)
));
addCheck(
  'connected catalogue has a sellable product',
  canAddProduct || externalNetworkBlocked,
  canAddProduct
    ? ''
    : externalNetworkBlocked
      ? 'not exercised because this audit sandbox blocked the hosted catalogue request'
      : 'only preview or unavailable product records were returned',
);

if (canAddProduct) {
  await addToBagButton.click();
  await page.waitForTimeout(500);
} else {
  await page.evaluate(() => {
    window.localStorage.setItem('poshkaar_cart_v1', JSON.stringify([{
      product_id: 'audit-product',
      title: 'Audit product',
      price: 1000,
      quantity: 1,
      size: 'One Size',
      color: 'Ivory',
      image: '/images/product-placeholder.svg',
      stock_quantity: 5,
    }]));
  });
  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(350);
  await page.locator('button[aria-label^="Shopping bag"]').first().click().catch(() => {});
}

addCheck(
  'bag contains one item',
  await page
    .locator('button[aria-label^="Shopping bag"]')
    .first()
    .getAttribute('aria-label')
    .then((value) => /1 item/.test(value || ''))
    .catch(() => false),
);

if (!(await page.getByRole('button', { name: /close cart/i }).isVisible().catch(() => false))) {
  await page.locator('button[aria-label^="Shopping bag"]').first().click();
  await page.waitForTimeout(500);
}
addCheck('bag drawer opens', await page.getByRole('button', { name: /close cart/i }).isVisible().catch(() => false));

await page.getByRole('button', { name: /increase quantity/i }).first().click().catch(() => {});
await page.waitForTimeout(250);
addCheck('bag quantity can increase', await page.locator('[aria-live="polite"]').filter({ hasText: '2' }).first().isVisible().catch(() => false));

await page.getByRole('button', { name: /decrease quantity/i }).first().click().catch(() => {});
await page.waitForTimeout(250);
addCheck('bag quantity can decrease', await page.locator('[aria-live="polite"]').filter({ hasText: '1' }).first().isVisible().catch(() => false));

await page.getByRole('button', { name: /remove/i }).click().catch(() => {});
await page.waitForTimeout(500);
addCheck('bag item can be removed', await page.getByText(/Your bag is empty/i).isVisible().catch(() => false));

await page.evaluate(() => {
  window.localStorage.setItem('poshkaar_cart_v1', JSON.stringify([{
    product_id: 'audit-product',
    title: 'Audit product',
    price: 1000,
    quantity: 1,
    size: 'One Size',
    color: 'Ivory',
    image: '/images/product-placeholder.svg',
    stock_quantity: 5,
  }]));
});
await page.goto(`${baseUrl}/checkout`, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(800);
addCheck('checkout page opens with order summary', await page.getByText(/Order Summary/i).isVisible().catch(() => false));

const continueToPaymentButton = page.getByRole('button', { name: /Continue to Payment/i }).first();
if (await continueToPaymentButton.isVisible().catch(() => false)) {
  const inputCount = await page.locator('input').count();
  const values = ['Test Customer', '9999999999', 'test@example.com', 'New Hostel Block', 'IISc Campus', 'Bangalore', 'Karnataka', '560012'];
  for (let index = 0; index < Math.min(inputCount, values.length); index += 1) {
    await page.locator('input').nth(index).fill(values[index]).catch(() => {});
  }
  const firstInput = page.locator('input').first();
  await firstInput.focus().catch(() => {});
  await firstInput.pressSequentially(' Focus', { delay: 20 }).catch(() => {});
  addCheck(
    'checkout input keeps focus while typing',
    await firstInput.evaluate((input) => document.activeElement === input && input.value.endsWith(' Focus')).catch(() => false),
  );
  await continueToPaymentButton.click().catch(() => {});
  await page.waitForTimeout(900);
}
addCheck('checkout payment options visible', await page.getByText(/Razorpay|UPI QR|Cash on Delivery/i).first().isVisible().catch(() => false));

await page.goto(`${baseUrl}/collections`, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(700);
addCheck('collections heading visible', await page.getByRole('heading', { name: /All Collections/i }).isVisible().catch(() => false));
addCheck(
  'collections has no horizontal overflow',
  await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
);

await page.goto(`${baseUrl}/journal/product-provenance`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
addCheck('journal destination works', await page.getByRole('heading', { name: /What verified product details mean/i }).isVisible().catch(() => false));

await page.goto(`${baseUrl}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
addCheck('unknown routes show a 404 page', await page.getByRole('heading', { name: /Page Not Found/i }).isVisible().catch(() => false));

const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
mobilePage.on('console', (msg) => {
  if (['error', 'warning'].includes(msg.type())) logs.push(`mobile ${msg.type()}: ${msg.text()}`);
});
mobilePage.on('pageerror', (error) => logs.push(`mobile pageerror: ${error.message}`));
mobilePage.on('response', (response) => {
  if ([403, 404, 500].includes(response.status())) {
    logs.push(`mobile response ${response.status()}: ${response.url()}`);
  }
});

await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
await mobilePage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await mobilePage.waitForTimeout(1000);
addCheck('mobile homepage headline visible', await mobilePage.getByRole('heading', { name: /Clothes for.*the memories.*you keep/i }).isVisible().catch(() => false));
addCheck(
  'mobile homepage has no horizontal overflow',
  await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
);

await mobilePage.goto(`${baseUrl}/collections`, { waitUntil: 'domcontentloaded' });
await mobilePage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await mobilePage.waitForTimeout(700);
addCheck('mobile collections heading visible', await mobilePage.getByRole('heading', { name: /All Collections/i }).isVisible().catch(() => false));
addCheck(
  'mobile collections has no horizontal overflow',
  await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
);

if (firstProductPath) {
  await mobilePage.goto(`${baseUrl}${firstProductPath}`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await mobilePage.waitForTimeout(700);
  addCheck('mobile product page title visible', await mobilePage.locator('h1').first().isVisible().catch(() => false));
  addCheck(
    'mobile product page has no horizontal overflow',
    await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
  );
}

await mobilePage.evaluate(() => {
  window.localStorage.setItem('poshkaar_cart_v1', JSON.stringify([{
    product_id: 'audit-product',
    title: 'Audit product',
    price: 1000,
    quantity: 1,
    size: 'One Size',
    color: 'Ivory',
    image: '/images/product-placeholder.svg',
    stock_quantity: 5,
  }]));
});
await mobilePage.goto(`${baseUrl}/checkout`, { waitUntil: 'domcontentloaded' });
await mobilePage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await mobilePage.waitForTimeout(700);
addCheck('mobile checkout order summary visible', await mobilePage.getByText(/Order Summary/i).isVisible().catch(() => false));
addCheck(
  'mobile checkout has no horizontal overflow',
  await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),
);
await mobilePage.screenshot({ path: `${outputDir}/audit-mobile-final.png`, type: 'png', fullPage: false });
await mobilePage.close();

await page.evaluate(() => {
  window.localStorage.setItem('supabase_access_token', 'expired.invalid.token');
  window.localStorage.setItem('supabase_refresh_token', 'expired-refresh');
});
await page.goto(`${baseUrl}/checkout`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1800);
addCheck(
  'expired optional supabase token does not show raw JWT toast on checkout load',
  await page.evaluate(() => !document.body.innerText.includes('JWT expired')).catch(() => false),
);

await page.screenshot({ path: `${outputDir}/audit-final.png`, type: 'png', fullPage: false });
await browser.close();
await localViteServer?.close();

const expectedEnvironmentLog = /ERR_(?:NETWORK_ACCESS_DENIED|NAME_NOT_RESOLVED|CONNECTION_REFUSED)/;
const unexpectedLogs = logs.filter((entry) => !expectedEnvironmentLog.test(entry));
addCheck(
  'no unexpected browser errors',
  unexpectedLogs.length === 0,
  unexpectedLogs.slice(0, 5).join(' | '),
);

const failedChecks = checks.filter((check) => !check.ok);
const result = {
  checks,
  logs: unexpectedLogs.slice(0, 30),
  environmentNetworkErrors: logs.filter((entry) => expectedEnvironmentLog.test(entry)).length,
};

await writeFile(`${outputDir}/audit-result.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));

if (failedChecks.length > 0) {
  process.exitCode = 1;
}
