import { test, expect } from '@playwright/test';
import { basePath as base } from '../environment.mjs';
test('Order, Chaos, history, route context, and active shell isolation', async ({ page }) => {
  await page.goto(base);
  const control = page.getByRole('button', { name: 'i wonder what this button does?' });
  await expect(control).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'order');
  await control.click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'chaos');
  await expect(page.locator('[data-mode-shell="order"]')).toHaveAttribute('inert', '');
  await expect(page.getByRole('button', { name: 'Back to order' })).toBeFocused();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${base}projects/\\?mode=chaos$`));
  await page.locator('.collection-entry').first().click();
  const path = new URL(page.url()).pathname;
  await page.getByRole('button', { name: 'Back to order' }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await page.goBack();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'chaos');
  await page.reload();
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'chaos');
  await expect(page.locator('link[rel="canonical"]')).not.toHaveAttribute('href', /mode=/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('work index links navigate directly to content', async ({ page }) => {
  await page.goto(base);
  await page.locator('[data-index="project:aqmod"]').click();
  await expect(page.getByRole('heading', { level: 1, name: 'AQMod' })).toBeVisible();
});
test('reduced motion changes mode immediately and keeps empty writing available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}blog/`);
  await page.getByRole('button', { name: 'i wonder what this button does?' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'chaos');
  await expect(page.locator('html')).not.toHaveClass(/mode-breaking|mode-resolving/);
  await expect(page.getByRole('heading', { name: 'Nothing published yet.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Email', exact: true })).toHaveAttribute('href', 'mailto:daniil.nahliuk1@gmail.com');
});
test('complete Order content works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${base}`);
  await expect(page.locator('#mode-control')).toBeHidden();
  await page.locator('[data-index="project:aqmod"]').click();
  await expect(page.getByRole('heading', { level: 1, name: 'AQMod' })).toBeVisible();
  await context.close();
});


test('review: spelling, experience ordering, plain work index, and removed network', async ({ page }) => {
  await page.goto(base);
  await expect(page.locator('.wordmark')).toContainText('Daniil');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').first()).toHaveText('Experience');
  await expect(page.locator('.index-group h3').first()).toHaveText('Experiences');
  expect(await page.locator('.home-experience').evaluate(element => Boolean(element.compareDocumentPosition(document.querySelector('.selected-work')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(page.locator('.graph, .react-flow, [data-node], #node-preview, .graph-legend')).toHaveCount(0);
  await expect(page.locator('[data-index^="project:"]')).not.toHaveCount(0);
  await expect(page.locator('[data-index^="experience:"]')).not.toHaveCount(0);
  await expect(page.locator('[data-index^="personal:"], [data-index^="post:"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Blog feed (RSS)' })).toHaveAttribute('title', /feed reader/);
  await page.goto(`${base}projects/`);
  await expect(page.getByRole('heading', { name: 'Explore a thread' })).toBeVisible();
  await expect(page.locator('#embedded-systems')).toContainText('AQMod');
});
