#!/usr/bin/env node

/**
 * Knowledge Data Collector for Observatory
 * Scans Jekyll posts and generates content index
 */

const fs = require('fs');
const path = require('path');

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

function countWords(content) {
  const text = content.replace(/---[\s\S]*?---/, '').replace(/<[^>]+>/g, '').replace(/```[\s\S]*?```/g, '');
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function countInternalLinks(content) {
  const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  return links.filter(link => !link.includes('http')).length;
}

function calculateReadingTime(wordCount) {
  return Math.ceil(wordCount / 180);
}

async function main() {
  try {
    console.log('Starting knowledge data collection...');
    
    const postsDir = path.join(process.cwd(), '_posts');
    const posts = [];
    
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.markdown'));
      
      for (const file of files) {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const frontmatter = parseFrontmatter(content);
        const wordCount = countWords(content);
        const internalLinks = countInternalLinks(content);
        
        // Generate Jekyll-compatible URL: /notes/YYYY/MM/DD/slug/
        const dateMatch = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(?:md|markdown)$/);
        let url = `/notes/${file.replace(/\.\w+$/, '/')}`;
        if (dateMatch) {
          const [, year, month, day, slug] = dateMatch;
          url = `/notes/${year}/${month}/${day}/${slug}/`;
        }
        
        posts.push({
          title: frontmatter.title || file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.\w+$/, ''),
          url: url,
          date: frontmatter.date || file.substring(0, 10),
          category: frontmatter.categories?.[0] || 'Uncategorized',
          tags: frontmatter.tags || [],
          word_count: wordCount,
          reading_time: calculateReadingTime(wordCount),
          internal_links: internalLinks,
          last_updated: frontmatter.last_modified_at || frontmatter.date || file.substring(0, 10)
        });
      }
    }
    
    // Calculate statistics
    const totalWords = posts.reduce((sum, p) => sum + p.word_count, 0);
    const avgReadingTime = posts.length > 0 ? Math.round(totalWords / posts.length / 180) : 0;
    
    // Category distribution
    const categoryMap = {};
    posts.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    
    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count, percentage: count / posts.length }))
      .sort((a, b) => b.count - a.count);
    
    // Tag distribution
    const tagMap = {};
    posts.forEach(p => {
      p.tags.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    
    const tags = Object.entries(tagMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // Newest articles
    const newestArticles = [...posts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(p => ({ title: p.title, date: p.date, category: p.category }));
    
    // Most updated articles
    const mostUpdated = [...posts]
      .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))
      .slice(0, 5)
      .map(p => ({ title: p.title, updates: 1, last_updated: p.last_updated }));
    
    const now = new Date().toISOString();
    
    const data = {
      collected_at: now,
      summary: {
        total_articles: posts.length,
        total_categories: categories.length,
        total_tags: tags.length,
        total_series: 0,
        total_internal_links: posts.reduce((sum, p) => sum + p.internal_links, 0),
        avg_reading_time: avgReadingTime,
        total_word_count: totalWords
      },
      categories,
      tags,
      articles: posts.sort((a, b) => new Date(b.date) - new Date(a.date)),
      newest_articles: newestArticles,
      most_updated: mostUpdated
    };
    
    const outputPath = path.join(process.cwd(), 'data', 'observatory', 'knowledge.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`Knowledge data collected successfully. Found ${posts.length} articles. Saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error collecting knowledge data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseFrontmatter, countWords };
