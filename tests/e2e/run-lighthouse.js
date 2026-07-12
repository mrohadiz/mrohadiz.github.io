const { execSync } = require('child_process');
const fs = require('fs');

const url = 'https://mrohadiz.github.io/';
console.log(`Running Lighthouse for ${url}...`);

try {
  execSync(`npx lighthouse ${url} --output=json --output-path=./lh-report.json --chrome-flags="--headless"`, { stdio: 'inherit' });
  const report = JSON.parse(fs.readFileSync('./lh-report.json', 'utf8'));

  const scores = {
    Performance: report.categories.performance.score * 100,
    Accessibility: report.categories.accessibility.score * 100,
    'Best Practices': report.categories['best-practices'].score * 100,
    SEO: report.categories.seo.score * 100
  };

  console.log('\n--- Lighthouse Results ---');
  for (const [category, score] of Object.entries(scores)) {
    console.log(`${category}: ${score.toFixed(0)}`);
  }

  fs.writeFileSync('./lh-summary.json', JSON.stringify(scores, null, 2));

} catch (error) {
  console.error('Lighthouse failed:', error.message);
}
