#!/usr/bin/env node

/**
 * GitHub Data Collector for Observatory
 * Collects repository statistics and commit history
 */

const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'mrohadiz';
const REPO_NAME = process.env.GITHUB_REPOSITORY_NAME || 'mrohadiz.github.io';

const headers = {
  'Accept': 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
};

async function fetchGitHub(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json();
}

async function collectCommits() {
  console.log('Collecting commits...');
  const commits = [];
  let page = 1;
  const perPage = 100;
  
  while (true) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${perPage}&page=${page}`;
    const data = await fetchGitHub(url);
    
    if (data.length === 0) break;
    
    commits.push(...data.map(commit => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0],
      date: commit.commit.author.date,
      author: commit.commit.author.name
    })));
    
    if (data.length < perPage) break;
    page++;
  }
  
  return commits;
}

async function collectRepositoryInfo() {
  console.log('Collecting repository info...');
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
  return fetchGitHub(url);
}

function calculatePublishingTimeline(commits) {
  const timeline = {};
  commits.forEach(commit => {
    const date = new Date(commit.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    timeline[month] = (timeline[month] || 0) + 1;
  });
  
  return Object.entries(timeline)
    .map(([month, commits]) => ({ month, commits }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function calculateContributionStreak(commits) {
  const dates = [...new Set(commits.map(c => new Date(c.date).toISOString().split('T')[0]))].sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Calculate current streak from most recent commit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streakDays = 0;
  let checkDate = new Date(today);
  
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dates.includes(dateStr)) {
      streakDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return {
    current_streak: streakDays,
    longest_streak: longestStreak,
    active_days: dates.length
  };
}

async function main() {
  try {
    console.log('Starting GitHub data collection...');
    
    const [commits, repoInfo] = await Promise.all([
      collectCommits(),
      collectRepositoryInfo()
    ]);
    
    const now = new Date().toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCommits = commits.filter(c => new Date(c.date) >= thirtyDaysAgo);
    
    const streak = calculateContributionStreak(commits);
    
    const publishingTimeline = calculatePublishingTimeline(commits);
    
    const articleHistory = recentCommits
      .filter(c => c.message.startsWith('feat:') || c.message.startsWith('add'))
      .map(c => ({
        title: c.message.replace(/^(feat:|add)\s*/i, ''),
        date: new Date(c.date).toISOString().split('T')[0],
        category: 'Article'
      }));
    
    const data = {
      collected_at: now,
      repository: `${REPO_OWNER}/${REPO_NAME}`,
      summary: {
        total_commits: commits.length,
        total_contributors: 1,
        first_commit_date: commits[commits.length - 1]?.date,
        last_commit_date: commits[0]?.date,
        active_days: streak.active_days
      },
      recent_commits: recentCommits.slice(0, 10),
      publishing_timeline: publishingTimeline,
      article_history: articleHistory,
      contribution_streak: streak,
      repository_health: {
        open_issues: repoInfo.open_issues_count || 0,
        open_pull_requests: 0,
        branches: 2,
        last_deployment: now,
        deployment_status: 'success'
      }
    };
    
    const outputPath = path.join(process.cwd(), 'data', 'observatory', 'publishing.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`GitHub data collected successfully. Saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error collecting GitHub data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { collectCommits, collectRepositoryInfo };
