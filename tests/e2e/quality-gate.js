#!/usr/bin/env node

/**
 * Quality Gate Orchestrator
 *
 * Runs all validation stages in sequence:
 *   1. Unit Test (Jekyll build validation)
 *   2. Playwright E2E (Content Validation)
 *   3. Accessibility Audit
 *   4. SEO Validation
 *   5. Visual Regression
 *   6. Broken Link Audit (Dynamic Crawl)
 *
 * If any stage fails, the pipeline exits with code 1.
 * Usage: node tests/e2e/quality-gate.js [--stages stage1,stage2]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const STAGES = [
  {
    name: 'Content Validation',
    spec: 'content-validation.spec.ts',
    emoji: '📋',
  },
  {
    name: 'Accessibility Audit',
    spec: 'regression.spec.ts', // The accessibility portion
    grep: 'Accessibility Audit',
    emoji: '♿',
  },
  {
    name: 'SEO Validation',
    spec: 'seo-validation.spec.ts',
    emoji: '🔍',
  },
  {
    name: 'Visual Regression',
    spec: 'regression.spec.ts', // The visual regression portion
    grep: 'Visual Regression',
    emoji: '📸',
  },
  {
    name: 'Error Monitoring',
    spec: 'regression.spec.ts', // The error monitoring portion
    grep: 'Error Monitoring',
    emoji: '🛡️',
  },
  {
    name: 'Dynamic Crawl & Broken Link Audit',
    spec: 'crawler.spec.ts',
    emoji: '🕷️',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function header(msg) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}═══════════════════════════════════════════════════${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}  ${msg}${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}═══════════════════════════════════════════════════${COLORS.reset}\n`);
}

function stageStart(emoji, name) {
  console.log(`${emoji}  ${COLORS.bright}Running: ${name}${COLORS.reset}`);
  console.log(`${COLORS.blue}───────────────────────────────────────────────────${COLORS.reset}`);
}

function stagePass(name, duration) {
  console.log(`${COLORS.green}  ✅ PASSED${COLORS.reset} — ${name} ${COLORS.dim}(${duration}s)${COLORS.reset}\n`);
}

function stageFail(name, duration) {
  console.log(`${COLORS.red}  ❌ FAILED${COLORS.reset} — ${name} ${COLORS.dim}(${duration}s)${COLORS.reset}\n`);
}

// ─── Parse CLI args ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let filterStages = null;
const stageIdx = args.indexOf('--stages');
if (stageIdx !== -1 && args[stageIdx + 1]) {
  filterStages = args[stageIdx + 1].split(',').map(s => s.trim().toLowerCase());
}

// ─── Ensure reports dir ──────────────────────────────────────────────────────

const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// ─── Run Pipeline ────────────────────────────────────────────────────────────

header('🚀 QUALITY GATE PIPELINE — mrohadiz.github.io');

const results = [];
let allPassed = true;

for (const stage of STAGES) {
  // Filter stages if --stages flag is used
  if (filterStages) {
    const matchesFilter = filterStages.some(
      f => stage.name.toLowerCase().includes(f) || stage.spec.toLowerCase().includes(f)
    );
    if (!matchesFilter) continue;
  }

  stageStart(stage.emoji, stage.name);
  const startTime = Date.now();

  try {
    let cmd = `npx playwright test "${stage.spec}" --project=firefox`;
    if (stage.grep) {
      cmd += ` --grep "${stage.grep}"`;
    }

    execSync(cmd, {
      stdio: 'inherit',
      timeout: 120_000,
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    stagePass(stage.name, duration);
    results.push({ stage: stage.name, status: 'PASSED', duration });
  } catch (e) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    stageFail(stage.name, duration);
    results.push({ stage: stage.name, status: 'FAILED', duration });
    allPassed = false;

    // Stop pipeline on first failure
    console.log(`${COLORS.red}${COLORS.bright}⛔ Pipeline stopped — ${stage.name} failed.${COLORS.reset}`);
    break;
  }
}

// ─── Summary Report ──────────────────────────────────────────────────────────

header('📊 QUALITY GATE SUMMARY');

const summary = {
  timestamp: new Date().toISOString(),
  overall: allPassed ? 'PASSED' : 'FAILED',
  stages: results,
};

// Write JSON report
fs.writeFileSync(
  path.join(reportsDir, 'quality-gate-report.json'),
  JSON.stringify(summary, null, 2)
);

// Print table
console.log(`${COLORS.bright}  Stage${COLORS.reset}                                  ${COLORS.bright}Status${COLORS.reset}    ${COLORS.bright}Duration${COLORS.reset}`);
console.log(`${COLORS.blue}  ───────────────────────────────────────────── ─────── ─────────${COLORS.reset}`);

for (const r of results) {
  const statusColor = r.status === 'PASSED' ? COLORS.green : COLORS.red;
  const paddedName = r.stage.padEnd(46);
  const paddedStatus = `${statusColor}${r.status}${COLORS.reset}`.padEnd(20);
  console.log(`  ${paddedName} ${paddedStatus} ${r.duration}s`);
}

console.log('');

if (allPassed) {
  console.log(`${COLORS.green}${COLORS.bright}  🎉 ALL STAGES PASSED — Ready to deploy!${COLORS.reset}`);
  process.exit(0);
} else {
  console.log(`${COLORS.red}${COLORS.bright}  💥 QUALITY GATE FAILED — Deploy blocked.${COLORS.reset}`);
  console.log(`${COLORS.yellow}  Check reports/quality-gate-report.json for details.${COLORS.reset}`);
  process.exit(1);
}
