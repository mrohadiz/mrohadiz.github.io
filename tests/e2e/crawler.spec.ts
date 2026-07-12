import { test, expect } from '@playwright/test';

const BASE_URL = 'https://mrohadiz.github.io';

// Seed URLs: homepage, main sections, known categories
const SEED_PATHS = [
  '/',
  '/about/',
  '/now/',
  '/notes/',
  '/projects/',
  '/domains/ai-engineering',
  '/domains/decision-systems',
  '/domains/infrastructure',
  '/domains/crypto-observation',
  '/domains/business-intelligence',
  '/domains/software-architecture',
];

test.describe('Dynamic Crawl & Broken Link Audit', () => {
  const visited = new Set<string>();
  const brokenLinks: { url: string; status: number; referrer: string }[] = [];
  const redirects: { from: string; to: string }[] = [];
  const errors: string[] = [];

  test('Discover and validate all internal links', async ({ page }) => {
    const queue = [...SEED_PATHS.map(p => `${BASE_URL}${p}`)];

    while (queue.length > 0 && visited.size < 200) {
      const url = queue.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);

      try {
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });

        if (!response) {
          brokenLinks.push({ url, status: 0, referrer: 'seed' });
          continue;
        }

        const status = response.status();

        if (status >= 400) {
          brokenLinks.push({ url, status, referrer: 'seed' });
          continue;
        }

        // Track redirects
        const req = response.request();
        if (req.redirectedFrom()) {
          redirects.push({ from: req.redirectedFrom()!.url(), to: url });
        }

        // Discover all internal <a> links
        const hrefs = await page.evaluate((baseUrl: string) => {
          return Array.from(document.querySelectorAll('a[href]'))
            .map(a => {
              try {
                return new URL(a.getAttribute('href')!, window.location.href).href;
              } catch {
                return null;
              }
            })
            .filter(
              (href): href is string =>
                !!href &&
                href.startsWith(baseUrl) &&
                !href.includes('#') &&
                !href.includes('mailto:') &&
                !href.includes('javascript:')
            );
        }, BASE_URL);

        for (const href of hrefs) {
          if (!visited.has(href) && !queue.includes(href)) {
            queue.push(href);
          }
        }
      } catch (e: any) {
        brokenLinks.push({ url, status: 0, referrer: `Error: ${e.message}` });
      }
    }

    // Write report
    const fs = require('fs');
    const report = {
      timestamp: new Date().toISOString(),
      totalDiscovered: visited.size,
      brokenLinks,
      redirects,
      visitedUrls: Array.from(visited),
    };
    fs.writeFileSync('reports/crawler-report.json', JSON.stringify(report, null, 2));

    console.log(`\n=== CRAWL REPORT ===`);
    console.log(`Total URLs discovered: ${visited.size}`);
    console.log(`Broken links: ${brokenLinks.length}`);
    console.log(`Redirects: ${redirects.length}`);

    if (brokenLinks.length > 0) {
      console.log(`\nBroken links:`);
      for (const bl of brokenLinks) {
        console.log(`  - [${bl.status}] ${bl.url} (referrer: ${bl.referrer})`);
      }
    }

    // Assert no broken links
    expect(brokenLinks, `Found ${brokenLinks.length} broken links`).toEqual([]);
  });
});

test.describe('Internal Link Validation on Crawl Results', () => {
  test('Every crawled page should return 200 and have content', async ({ page }) => {
    // Read the crawler report
    const fs = require('fs');
    let report: any;
    try {
      report = JSON.parse(fs.readFileSync('reports/crawler-report.json', 'utf8'));
    } catch {
      test.skip(true, 'Crawler report not found — run crawler first');
      return;
    }

    const failedPages: string[] = [];

    for (const url of report.visitedUrls) {
      try {
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });

        if (!response || response.status() >= 400) {
          failedPages.push(`${url} (status: ${response?.status() || 'no response'})`);
          continue;
        }

        // Verify page has meaningful content (not blank)
        const bodyText = await page.evaluate(() => document.body?.innerText?.trim() || '');
        if (bodyText.length < 10) {
          failedPages.push(`${url} (empty body)`);
        }
      } catch (e: any) {
        failedPages.push(`${url} (error: ${e.message})`);
      }
    }

    expect(failedPages, `Pages with issues:\n${failedPages.join('\n')}`).toEqual([]);
  });
});
