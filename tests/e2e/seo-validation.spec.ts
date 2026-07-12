import { test, expect } from '@playwright/test';

const BASE_URL = 'https://mrohadiz.github.io';

// All pages to validate SEO on
const PAGES = [
  { path: '/', name: 'Homepage', hasArticleSEO: false },
  { path: '/about/', name: 'About', hasArticleSEO: false },
  { path: '/now/', name: 'Now', hasArticleSEO: false },
  { path: '/notes/', name: 'Notes', hasArticleSEO: false },
  { path: '/projects/', name: 'Projects', hasArticleSEO: false },
];

test.describe('Global SEO Validation', () => {
  test('robots.txt should be accessible and well-formed', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/robots.txt`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('User-agent');
    expect(body).toContain('Sitemap');
  });

  test('sitemap.xml should be accessible and valid', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
    expect(body).toContain('<url>');
    expect(body).toContain('<loc>');
  });

  test('feed.xml (RSS) should be accessible', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/feed.xml`);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<feed');
  });
});

test.describe('Per-Page SEO Validation', () => {
  for (const page of PAGES) {
    test(`SEO audit for ${page.name} (${page.path})`, async ({ page: pwPage }) => {
      const response = await pwPage.goto(`${BASE_URL}${page.path}`, {
        waitUntil: 'networkidle',
      });
      expect(response?.status()).toBe(200);

      // --- Title ---
      const title = await pwPage.title();
      expect(title, 'Page must have a <title> tag').toBeTruthy();
      expect(title.length, 'Title must be > 5 chars').toBeGreaterThan(5);
      expect(title.length, 'Title should be < 70 chars').toBeLessThan(70);

      // --- Meta Description ---
      const metaDesc = await pwPage.$eval(
        'meta[name="description"]',
        el => el.getAttribute('content') || ''
      );
      expect(metaDesc, 'Page must have meta description').toBeTruthy();
      expect(metaDesc.length, 'Meta description must be > 20 chars').toBeGreaterThan(20);
      expect(metaDesc.length, 'Meta description should be < 165 chars').toBeLessThan(165);

      // --- Canonical ---
      const canonical = await pwPage.$eval(
        'link[rel="canonical"]',
        el => el.getAttribute('href') || ''
      ).catch(() => '');
      // For GitHub Pages, canonical might be implicit via OG url
      // Check og:url as fallback
      const ogUrl = await pwPage.$eval(
        'meta[property="og:url"]',
        el => el.getAttribute('content') || ''
      ).catch(() => '');
      const hasCanonical = canonical || ogUrl;
      expect(hasCanonical, 'Page must have canonical or og:url').toBeTruthy();

      // --- Open Graph ---
      const ogTitle = await pwPage.$eval(
        'meta[property="og:title"]',
        el => el.getAttribute('content') || ''
      ).catch(() => '');
      expect(ogTitle, 'Page must have og:title').toBeTruthy();

      const ogDesc = await pwPage.$eval(
        'meta[property="og:description"]',
        el => el.getAttribute('content') || ''
      ).catch(() => '');
      expect(ogDesc, 'Page must have og:description').toBeTruthy();

      const ogType = await pwPage.$eval(
        'meta[property="og:type"]',
        el => el.getAttribute('content') || ''
      ).catch(() => '');
      expect(ogType, 'Page must have og:type').toBeTruthy();

      const ogImage = await pwPage.$eval(
        'meta[property="og:image"]',
        el => el.getAttribute('content') || ''
      ).catch(() => '');
      // og:image recommended but not strictly required for all pages
      if (!ogImage) {
        console.warn(`⚠️  ${page.name}: Missing og:image`);
      }

      // --- Twitter Card ---
      const twitterCard = await pwPage.$eval(
        'meta[name="twitter:card"]',
        el => el.getAttribute('content') || ''
      ).catch(() => '');
      expect(twitterCard, 'Page must have twitter:card').toBeTruthy();

      const twitterTitle = await pwPage.$eval(
        'meta[name="twitter:title"]',
        el => el.getAttribute('content') || ''
      ).catch(() => '');
      expect(twitterTitle, 'Page must have twitter:title').toBeTruthy();

      // --- Structured Data (JSON-LD) ---
      const jsonLd = await pwPage.$$eval('script[type="application/ld+json"]', scripts =>
        scripts.map(s => {
          try {
            return JSON.parse(s.textContent || '{}');
          } catch {
            return null;
          }
        })
      );
      // At least homepage should have structured data
      if (page.path === '/') {
        expect(
          jsonLd.filter(Boolean).length,
          'Homepage should have at least one JSON-LD structured data block'
        ).toBeGreaterThan(0);
      }

      // --- HTML lang attribute ---
      const lang = await pwPage.$eval('html', el => el.getAttribute('lang') || '');
      expect(lang, 'HTML element must have lang attribute').toBeTruthy();

      console.log(`✅ SEO audit passed for ${page.name}`);
    });
  }
});
