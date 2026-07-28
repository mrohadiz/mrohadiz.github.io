#!/usr/bin/env node

/**
 * Topic Coverage Audit
 * 
 * Validates that:
 * - Categories with ≥5 articles have topic pages
 * - All topic pages have corresponding category articles
 * - Category naming is consistent
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = './_posts';
const TOPICS_DIR = './_pages/topics';
const MIN_ARTICLES_FOR_TOPIC = 5;

class TopicAudit {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.topicCoverage = new Map();
  }

  run() {
    console.log('🔍 Starting Topic Coverage Audit...\n');
    this.scanPostCategories();
    this.checkTopicPages();
    this.generateReport();
    return this.errors.length > 0 ? 1 : 0;
  }

  scanPostCategories() {
    console.log('📄 Scanning posts...');
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const categories = this.extractCategories(content);
      
      categories.forEach(category => {
        if (!this.topicCoverage.has(category)) {
          this.topicCoverage.set(category, []);
        }
        this.topicCoverage.get(category).push(file);
      });
    });
    
    console.log(`✓ Found ${this.topicCoverage.size} categories\n`);
  }

  extractCategories(content) {
    const match = content.match(/^categories:\s*\n([\s\S]*?)^[a-z]/m);
    if (!match) return [];
    
    const categories = [];
    match[1].split('\n').forEach(line => {
      const m = line.match(/^\s*-\s*(.+)$/);
      if (m) categories.push(m[1].trim());
    });
    return categories;
  }

  checkTopicPages() {
    console.log('📋 Checking topic pages...\n');
    
    const topicFiles = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.md'));
    
    // Build slug -> category mapping from actual posts
    const slugToCategory = new Map();
    this.topicCoverage.forEach((articles, category) => {
      slugToCategory.set(this.slugify(category), category);
    });
    
    console.log('📌 Rule 1: Categories with ≥5 articles must have topic pages');
    let issues = 0;
    
    this.topicCoverage.forEach((articles, category) => {
      const slug = this.slugify(category);
      const hasPage = topicFiles.includes(`${slug}.md`);
      
      if (articles.length >= MIN_ARTICLES_FOR_TOPIC && !hasPage) {
        this.errors.push(
          `❌ "${category}" has ${articles.length} articles but no topic page`
        );
        issues++;
      } else if (articles.length >= MIN_ARTICLES_FOR_TOPIC && hasPage) {
        console.log(`  ✓ "${category}" (${articles.length}) → topic page exists`);
      }
    });
    
    if (issues === 0) console.log(`  ✓ All checks passed\n`);
    else console.log(`  Found ${issues} issues\n`);
    
    console.log('📌 Rule 2: Topic pages must have corresponding articles');
    let orphans = 0;
    
    topicFiles.forEach(file => {
      const slug = file.replace('.md', '');
      const category = slugToCategory.get(slug);
      
      if (!category) {
        this.warnings.push(`⚠️  "${file}" has no corresponding category`);
        orphans++;
      } else {
        const count = this.topicCoverage.get(category).length;
        console.log(`  ✓ "${slug}" → ${count} articles`);
      }
    });
    
    if (orphans === 0) console.log(`  ✓ No orphan pages\n`);
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUDIT REPORT');
    console.log('='.repeat(60) + '\n');
    
    const total = Array.from(this.topicCoverage.values())
      .reduce((sum, arr) => sum + arr.length, 0);
    const withPages = Array.from(this.topicCoverage.entries())
      .filter(([cat]) => {
        const slug = this.slugify(cat);
        return fs.existsSync(path.join(TOPICS_DIR, `${slug}.md`));
      }).length;
    
    console.log(`📈 SUMMARY`);
    console.log(`  Total Articles: ${total}`);
    console.log(`  Total Categories: ${this.topicCoverage.size}`);
    console.log(`  Topics with Pages: ${withPages}`);
    console.log(`  Coverage: ${((withPages / this.topicCoverage.size) * 100).toFixed(1)}%\n`);
    
    console.log('📋 CATEGORIES');
    console.log('─'.repeat(60));
    
    Array.from(this.topicCoverage.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([cat, articles]) => {
        const slug = this.slugify(cat);
        const hasPage = fs.existsSync(path.join(TOPICS_DIR, `${slug}.md`));
        const status = hasPage ? '✓' : (articles.length >= MIN_ARTICLES_FOR_TOPIC ? '⚠️' : '○');
        const badge = hasPage ? '(page)' : '';
        console.log(`  ${status} ${cat.padEnd(30)} ${articles.length.toString().padStart(2)} ${badge}`);
      });
    
    console.log('\n');
    
    if (this.errors.length > 0) {
      console.log('❌ ERRORS');
      console.log('─'.repeat(60));
      this.errors.forEach(err => console.log(`  ${err}`));
      console.log('\n');
    }
    
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS');
      console.log('─'.repeat(60));
      this.warnings.forEach(warn => console.log(`  ${warn}`));
      console.log('\n');
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ AUDIT PASSED\n');
    } else if (this.errors.length === 0) {
      console.log('⚠️  AUDIT PASSED WITH WARNINGS\n');
    } else {
      console.log('❌ AUDIT FAILED\n');
    }
  }

  slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }

  unslugify(str) {
    return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
}

new TopicAudit().run() && process.exit(1) || process.exit(0);
