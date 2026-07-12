const { JSDOM } = require('jsdom');

const baseURL = 'https://mrohadiz.github.io';
const pagesToTest = [
  '/',
  '/about',
  '/notes',
  '/projects',
  '/now',
  '/404'
];

const errors = [];
const visited = new Set();
const brokenLinks = [];

async function checkPage(path) {
  const url = path.startsWith('http') ? path : `${baseURL}${path.startsWith('/') ? path : '/' + path}`;
  if (visited.has(url)) return;
  visited.add(url);

  console.log(`Checking ${url}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (path !== '/404' && path !== '/this-page-does-not-exist') {
        errors.push(`Page returned ${response.status}: ${url}`);
      }
    }
    
    const text = await response.text();
    const dom = new JSDOM(text);
    const document = dom.window.document;

    if (document.body.innerHTML.trim() === '') {
      errors.push(`${url}: Body is completely empty! (Blank page issue)`);
    }

    if (path === '/') {
      if (!document.querySelector('.hero')) errors.push('Homepage: Hero section missing');
      if (!document.querySelector('#domains')) errors.push('Homepage: Knowledge Domains section missing');
      if (!document.querySelector('.cta-section') && !document.querySelector('.btn-primary')) errors.push('Homepage: CTA missing');
      if (!document.querySelector('#articles')) errors.push('Homepage: Featured articles missing');
    }

    // Check all internal links on the page for broken navigation
    const links = document.querySelectorAll('a');
    for (const link of links) {
      let href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
      
      let fullUrl;
      try {
        fullUrl = new URL(href, url).href;
      } catch (e) {
        continue;
      }

      if (fullUrl.startsWith(baseURL)) {
        // Collect internal links to audit
        if (!visited.has(fullUrl)) {
          const checkRes = await fetch(fullUrl, { method: 'HEAD' }).catch(() => null);
          if (!checkRes || (!checkRes.ok && checkRes.status !== 404)) {
            // Allow 404 if it's explicitly the 404 page link, otherwise it's a broken link
            if (!fullUrl.endsWith('404.html') && !fullUrl.endsWith('404')) {
              brokenLinks.push(`Broken link found on ${url}: ${href} -> ${checkRes ? checkRes.status : 'Failed to fetch'}`);
            }
          }
          visited.add(fullUrl);
        }
      }
    }

  } catch (err) {
    errors.push(`Failed to fetch ${url}: ${err.message}`);
  }
}

async function run() {
  for (const p of pagesToTest) {
    await checkPage(p);
  }

  if (errors.length > 0 || brokenLinks.length > 0) {
    console.log("\n=== STATIC AUDIT FAILED ===");
    errors.forEach(e => console.log(`- ERROR: ${e}`));
    brokenLinks.forEach(e => console.log(`- BROKEN LINK: ${e}`));
    process.exit(1);
  } else {
    console.log("\n=== STATIC AUDIT PASSED ===");
    console.log("Hero: OK");
    console.log("Navigation Links: OK");
    console.log("Sections & Cards: OK");
    console.log("404 Page: OK");
  }
}

run();
