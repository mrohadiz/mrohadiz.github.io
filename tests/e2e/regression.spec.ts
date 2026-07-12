import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'https://mrohadiz.github.io';

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/about/', name: 'about' },
  { path: '/now/', name: 'now' },
  { path: '/notes/', name: 'notes' },
  { path: '/projects/', name: 'projects' },
  { path: '/this-page-does-not-exist', name: '404', expectStatus: 404 },
];

test.describe('Visual Regression', () => {
  for (const pg of PAGES) {
    test(`Screenshot baseline for ${pg.name}`, async ({ page }, testInfo) => {
      const response = await page.goto(`${BASE_URL}${pg.path}`, {
        waitUntil: 'networkidle',
      });

      const expectedStatus = pg.expectStatus || 200;
      expect(response?.status()).toBe(expectedStatus);

      // Wait for animations and fonts
      await page.waitForTimeout(1000);

      const snapshotName = `${pg.name}-${testInfo.project.name}.png`;
      await expect(page).toHaveScreenshot(snapshotName, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      });
    });
  }
});

test.describe('Accessibility Audit', () => {
  let a11yErrors: string[] = [];

  test.beforeEach(async () => {
    a11yErrors = [];
  });

  for (const pg of PAGES) {
    if (pg.expectStatus === 404) continue; // Skip 404 for a11y

    test(`Accessibility check for ${pg.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'networkidle' });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      if (results.violations.length > 0) {
        for (const violation of results.violations) {
          a11yErrors.push(
            `[${violation.impact}] ${violation.id}: ${violation.description} (${violation.nodes.length} elements)`
          );
        }
      }

      expect(
        a11yErrors,
        `Accessibility violations on ${pg.name}:\n${a11yErrors.join('\n')}`
      ).toEqual([]);
    });
  }
});

test.describe('Error Monitoring', () => {
  let consoleErrors: string[] = [];
  let pageErrors: string[] = [];
  let networkErrors: string[] = [];

  test.beforeEach(async () => {
    consoleErrors = [];
    pageErrors = [];
    networkErrors = [];
  });

  test('No critical errors across all pages', async ({ page }) => {
    page.on('pageerror', err => {
      pageErrors.push(err.message);
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', response => {
      if (
        response.status() >= 500 &&
        !response.url().includes('google-analytics') &&
        !response.url().includes('favicon')
      ) {
        networkErrors.push(`${response.url()} (${response.status()})`);
      }
    });

    // Visit key pages
    for (const pg of ['/', '/about/', '/now/', '/notes/', '/projects/']) {
      await page.goto(`${BASE_URL}${pg}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
    }

    // Filter out known non-critical errors
    const criticalConsoleErrors = consoleErrors.filter(
      e => !e.includes('favicon') && !e.includes('service-worker')
    );

    const allErrors = [
      ...pageErrors.map(e => `Page error: ${e}`),
      ...criticalConsoleErrors.map(e => `Console error: ${e}`),
      ...networkErrors.map(e => `Network error: ${e}`),
    ];

    expect(allErrors, `Errors found:\n${allErrors.join('\n')}`).toEqual([]);
  });
});
