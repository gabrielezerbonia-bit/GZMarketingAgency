import { test, expect } from '@playwright/test';

test.describe('GZ Marketing Agency — Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Dismiss cookie banner if present
    const acceptBtn = page.locator('.cookie-accept').first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
    }
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/GZ Marketing Agency/);
  });

  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
  });

  test('hero headline contains key words', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text.toLowerCase()).toMatch(/profitto|brand|risultati/i);
  });

  test('navigation links are present', async ({ page }) => {
    await expect(page.locator('.nav-links a[href="#servizi"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#portfolio"]')).toBeVisible();
    await expect(page.locator('.nav-links a[href="#contatti"]')).toBeVisible();
  });

  test('services section has 6 cards', async ({ page }) => {
    await page.locator('#servizi').scrollIntoViewIfNeeded();
    const cards = page.locator('#servizi .card');
    await expect(cards).toHaveCount(6);
  });

  test('about section is present', async ({ page }) => {
    await page.locator('#chi-siamo').scrollIntoViewIfNeeded();
    await expect(page.locator('#chi-siamo')).toBeVisible();
    await expect(page.locator('.profile-photo')).toBeVisible();
  });

  test('portfolio has 6 cases', async ({ page }) => {
    await page.locator('#portfolio').scrollIntoViewIfNeeded();
    const cards = page.locator('.portfolio-card');
    await expect(cards).toHaveCount(6);
  });

  test('portfolio expand/collapse works', async ({ page }) => {
    await page.locator('#portfolio').scrollIntoViewIfNeeded();
    const expandBtn = page.locator('.btn-expand').first();
    await expandBtn.click();
    await expect(page.locator('.portfolio-full.open').first()).toBeVisible();
    const collapseBtn = page.locator('.btn-collapse').first();
    await collapseBtn.click();
    await expect(page.locator('.portfolio-full.open').first()).toBeHidden();
  });

  test('video production section is visible', async ({ page }) => {
    await page.locator('#video').scrollIntoViewIfNeeded();
    await expect(page.locator('#video')).toBeVisible();
    const features = page.locator('.video-feature');
    await expect(features).toHaveCount(4);
  });

  test('partner section is visible', async ({ page }) => {
    await page.locator('#partner').scrollIntoViewIfNeeded();
    await expect(page.locator('#partner')).toBeVisible();
    await expect(page.locator('.partner-card')).toBeVisible();
  });

  test('contact section has WhatsApp CTA', async ({ page }) => {
    await page.locator('#contatti').scrollIntoViewIfNeeded();
    await expect(page.locator('.btn-wa-big')).toBeVisible();
  });

  test('contact form is present and has all fields', async ({ page }) => {
    await page.locator('#contatti').scrollIntoViewIfNeeded();
    await expect(page.locator('input[name="nome"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="messaggio"]')).toBeVisible();
  });

  test('footer is present with legal links', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('privacy page shows and hides', async ({ page }) => {
    await page.evaluate(() => showPage('privacy'));
    await expect(page.locator('#privacyPage')).toBeVisible();
    await expect(page.locator('#mainContent')).toBeHidden();
    await page.evaluate(() => showPage('home'));
    await expect(page.locator('#mainContent')).toBeVisible();
  });
});

test.describe('GZ Marketing Agency — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const acceptBtn = page.locator('.cookie-accept').first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
    }
  });

  test('hero is visible on mobile', async ({ page }) => {
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('hamburger menu is visible on mobile', async ({ page }) => {
    await expect(page.locator('.hamburger')).toBeVisible();
    await expect(page.locator('.nav-links')).toBeHidden();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.locator('.hamburger').click();
    await expect(page.locator('.mobile-menu')).toHaveClass(/open/);
    await page.locator('.mobile-close').click();
    await expect(page.locator('.mobile-menu')).not.toHaveClass(/open/);
  });

  test('no horizontal overflow on mobile', async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 390;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('all sections visible on mobile scroll', async ({ page }) => {
    for (const id of ['servizi', 'chi-siamo', 'portfolio', 'video', 'contatti']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('WhatsApp float button visible on mobile', async ({ page }) => {
    await expect(page.locator('.whatsapp-float')).toBeVisible();
  });
});
