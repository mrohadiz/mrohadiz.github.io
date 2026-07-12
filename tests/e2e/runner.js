const { execSync } = require('child_process');

console.log('--- STARTING E2E TEST RUN ---');

let playwrightPassed = true;
try {
  execSync('npx playwright test', { stdio: 'inherit' });
} catch (e) {
  playwrightPassed = false;
  console.log('Playwright tests failed!');
}

console.log('\n--- RUNNING CRAWLER ---');
let crawlerPassed = true;
try {
  execSync('npx playwright test tests/e2e/crawler.spec.ts', { stdio: 'inherit' });
} catch (e) {
  crawlerPassed = false;
  console.log('Crawler failed!');
}

console.log('\n--- RUNNING LIGHTHOUSE ---');
try {
  execSync('node tests/e2e/run-lighthouse.js', { stdio: 'inherit' });
} catch (e) {
  console.log('Lighthouse failed to run.');
}

if (!playwrightPassed || !crawlerPassed) {
  process.exit(1);
} else {
  console.log('All tests passed.');
}
