#!/usr/bin/env node

/**
 * Generate search-index.json for the Digital Garden
 * Replicates Jekyll plugin _plugins/search_index.rb logic
 * Run when Jekyll build is not available locally
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(process.cwd(), '_posts');
const PAGES_DIR = path.join(process.cwd(), '_pages');
const ROOT_DIR = process.cwd();
const OUTPUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.join(process.cwd(), '_site');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'search-index.json');

// Exclude directories that are already processed separately
const EXCLUDED_DIRS = new Set(['_posts', '_pages', '_site', '_includes', '_layouts', '_sass', '_data', '_plugins', 'assets', 'collectors', 'data', 'docs', 'node_modules', 'scripts', 'tests', '.git', '.github', '.bundle', '.claude']);

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let currentValue = '';
  let inArray = false;

  for (const line of lines) {
    if (line.match(/^(\w+):\s*(.*)$/)) {
      if (currentKey) {
        frontmatter[currentKey] = inArray ? parseArrayValue(currentValue) : currentValue.trim();
      }
      const [, key, value] = line.match(/^(\w+):\s*(.*)$/);
      currentKey = key;
      currentValue = value;
      inArray = value.startsWith('[');
    } else if (currentKey && line.startsWith('  -')) {
      currentValue += '\n' + line;
      inArray = true;
    }
  }

  if (currentKey) {
    frontmatter[currentKey] = inArray ? parseArrayValue(currentValue) : currentValue.trim();
  }

  return frontmatter;
}

function parseArrayValue(value) {
  return value.split('\n')
    .map(line => line.replace(/^\s*-\s*/, '').trim())
    .filter(v => v.length > 0);
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getContentAfterFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n*/, '');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function generatePostUrl(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(?:md|markdown)$/);
  if (match) {
    const [, year, month, day, slug] = match;
    return `/notes/${year}/${month}/${day}/${slug}/`;
  }
  return `/notes/${filename.replace(/\.\w+$/, '/')}`;
}

async function main() {
  console.log('Generating search-index.json...');
  const index = [];

  // Process _posts/
  if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.markdown'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const fm = parseFrontmatter(content);
      const body = getContentAfterFrontmatter(content);
      const title = fm.title || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.\w+$/, '');
      const excerpt = fm.excerpt ? stripHtml(fm.excerpt).substring(0, 200) : '';

      index.push({
        title: title,
        url: generatePostUrl(file),
        date: formatDate(fm.date || file.substring(0, 10)),
        tags: (Array.isArray(fm.tags) ? fm.tags : []).join(', '),
        categories: (Array.isArray(fm.categories) ? fm.categories : [fm.categories]).filter(Boolean).join(', '),
        excerpt: excerpt,
        content: stripHtml(body).substring(0, 500)
      });
    }
    console.log(`  ✓ ${files.length} posts indexed`);
  }

  // Process _pages/
  if (fs.existsSync(PAGES_DIR)) {
    const excludedExts = /\.(json|xml|txt|css|js|png|jpg|gif|svg)$/;
    const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.md') && !excludedExts.test(f));

    for (const file of files) {
      const content = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
      const fm = parseFrontmatter(content);
      const body = getContentAfterFrontmatter(content);
      const permalink = fm.permalink || `/${file.replace(/\.md$/, '/')}`;

      index.push({
        title: fm.title || file.replace(/\.md$/, ''),
        url: permalink,
        date: fm.date ? formatDate(fm.date) : '',
        tags: (Array.isArray(fm.tags) ? fm.tags : []).join(', '),
        content: stripHtml(body).substring(0, 500)
      });
    }
    console.log(`  ✓ ${files.length} pages indexed`);
  }

  // Process root-level .md files that are actual Jekyll pages (have frontmatter with layout)
  const rootMdFiles = fs.readdirSync(ROOT_DIR).filter(f =>
    f.endsWith('.md') && !EXCLUDED_DIRS.has(f.replace(/\.md$/, '')) && !EXCLUDED_DIRS.has(f)
  );
  for (const file of rootMdFiles) {
    const filePath = path.join(ROOT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    // Skip files without valid Jekyll frontmatter (e.g. README, SEO reports)
    if (!content.startsWith('---\n')) continue;
    const fm = parseFrontmatter(content);
    if (!fm.layout) continue;
    const body = getContentAfterFrontmatter(content);
    // index.md serves at /, others at /filename/
    let permalink = fm.permalink;
    if (!permalink) {
      permalink = file === 'index.md' ? '/' : `/${file.replace(/\.md$/, '/')}`;
    }

    index.push({
      title: fm.title || file.replace(/\.md$/, ''),
      url: permalink,
      date: fm.date ? formatDate(fm.date) : '',
      tags: (Array.isArray(fm.tags) ? fm.tags : []).join(', '),
      content: stripHtml(body).substring(0, 500)
    });
    console.log(`  ✓ root page: ${file} → ${permalink}`);
  }

  // Write output
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

  console.log(`\n✅ search-index.json generated: ${OUTPUT_FILE}`);
  console.log(`   Total entries: ${index.length}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
