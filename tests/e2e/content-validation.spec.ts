import { test, expect } from '@playwright/test';

const BASE_URL = 'https://mrohadiz.github.io';

const PAGES = [
  { path: '/', name: 'Homepage', layout: 'home' },
  { path: '/about/', name: 'About', layout: 'page' },
  { path: '/now/', name: 'Now', layout: 'page' },
  { path: '/notes/', name: 'Notes', layout: 'page' },
  { path: '/projects/', name: 'Projects', layout: 'page' },
];

test.describe('Content Validation', () => {
  for (const pg of PAGES) {
    test(`${pg.name} — structure and content integrity`, async ({ page }) => {
      const response = await page.goto(`${BASE_URL}${pg.path}`, {
        waitUntil: 'networkidle',
      });
      expect(response?.status()).toBe(200);

      // --- Navbar visible ---
      const navbar = page.locator('.navbar, nav.navbar, #navbar');
      await expect(navbar.first()).toBeVisible();

      // --- Footer visible ---
      const footer = page.locator('.footer, footer.footer, footer');
      await expect(footer.first()).toBeVisible();

      // --- Title / heading present ---
      const h1 = page.locator('h1').first();
      await expect(h1, 'Page must have an h1 heading').toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text?.trim().length, 'h1 must not be empty').toBeGreaterThan(0);

      // --- No empty sections ---
      const sections = page.locator('section');
      const sectionCount = await sections.count();
      for (let i = 0; i < sectionCount; i++) {
        const section = sections.nth(i);
        const innerText = await section.textContent();
        const trimmed = (innerText || '').trim();
        // Allow empty sections if they only contain hidden elements
        const isVisible = await section.isVisible();
        if (isVisible && trimmed.length === 0) {
          // Check if it has images or other non-text content
          const hasChildren = await section.evaluate(el => el.children.length > 0);
          if (!hasChildren) {
            expect.fail(`Section ${i} on ${pg.name} is completely empty`);
          }
        }
      }

      // --- No broken images ---
      const images = page.locator('img');
      const imgCount = await images.count();
      const brokenImages: string[] = [];
      for (let i = 0; i < imgCount; i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        if (!src || src.startsWith('data:')) continue;

        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );
        if (naturalWidth === 0) {
          brokenImages.push(src);
        }
      }
      expect(
        brokenImages,
        `Broken images on ${pg.name}: ${brokenImages.join(', ')}`
      ).toEqual([]);
    });
  }

  test('Homepage — Hero section validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    const hero = page.locator('.hero, section.hero, .hero-section').first();
    await expect(hero, 'Homepage must have a hero section').toBeVisible();

    const heroTitle = page.locator('.hero-title, .hero h1').first();
    await expect(heroTitle, 'Hero must have a title').toBeVisible();
    const titleText = await heroTitle.textContent();
    expect(titleText).toContain('Rohadiz');

    const heroSubtitle = page.locator('.hero-subtitle, .hero .lead').first();
    await expect(heroSubtitle, 'Hero must have a subtitle').toBeVisible();

    // CTA buttons
    const ctaButtons = page.locator('.hero-actions .btn, .hero .btn');
    const ctaCount = await ctaButtons.count();
    expect(ctaCount, 'Hero must have at least one CTA button').toBeGreaterThan(0);

    // Featured sections on homepage
    const domains = page.locator('#domains, .domains-section').first();
    await expect(domains, 'Homepage must have Knowledge Domains section').toBeVisible();

    const articles = page.locator('#articles, .articles-section').first();
    await expect(articles, 'Homepage must have Featured Articles section').toBeVisible();

    const projects = page.locator('#projects, .projects-section').first();
    await expect(projects, 'Homepage must have Projects section').toBeVisible();
  });

  test('Every internal link on homepage should return 200', async ({ page }) => {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    const hrefs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]'))
        .map(a => {
          try {
            return new URL(a.getAttribute('href')!, window.location.href).href;
          } catch {
            return null;
          }
        })
        .filter(
          (h): h is string =>
            !!h &&
            h.startsWith('https://mrohadiz.github.io') &&
            !h.includes('#') &&
            !h.includes('mailto:')
        );
    });

    const uniqueHrefs = [...new Set(hrefs)];
    const brokenLinks: string[] = [];

    // Test a sample of links (up to 30 to keep test fast)
    const sample = uniqueHrefs.slice(0, 30);

    for (const href of sample) {
      try {
        const resp = await page.request.get(href, {
          timeout: 10000,
        });
        if (resp.status() >= 400) {
          brokenLinks.push(`${href} (${resp.status()})`);
        }
      } catch {
        brokenLinks.push(`${href} (request failed)`);
      }
    }

    expect(
      brokenLinks,
      `Broken internal links on homepage:\n${brokenLinks.join('\n')}`
    ).toEqual([]);
  });
});
