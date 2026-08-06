#!/usr/bin/env node

/**
 * Insights Generator for Observatory
 * Analyzes collected data and generates observations.
 *
 * Sources (real data only):
 *   - traffic.json    → KMS Track (kmstrack) visitor behavior
 *   - publishing.json → GitHub repository activity
 *   - knowledge.json  → local _posts content scan
 *
 * search.json (Google Search Console) is intentionally NOT used:
 * the GSC collector is disabled, so that file only holds stale/mock data.
 */

const fs = require('fs');
const path = require('path');

function loadData(filename) {
  const filePath = path.join(process.cwd(), 'data', 'observatory', filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function formatDuration(seconds) {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  return `${Math.round(seconds)}s`;
}

function analyzeTrafficData(trafficData) {
  const insights = [];

  if (!trafficData) return insights;

  const { trend, traffic_sources, device_distribution, top_landing_pages, summary, previous_period } = trafficData;

  // Users growth (only meaningful when a previous period exists with a real sample;
  // a couple of leftover sessions would otherwise produce a wild % change)
  if (trend.users_change > 0.1 && previous_period && previous_period.total_users >= 5) {
    insights.push({
      type: 'positive',
      category: 'traffic',
      title: `Site visitors increased ${Math.round(trend.users_change * 100)}%`,
      description: `From ${previous_period.total_users.toLocaleString()} to ${summary.total_users.toLocaleString()} users this period.`,
      metric: `+${Math.round(trend.users_change * 100)}%`,
      metric_label: 'Users Growth',
      icon: 'users',
      priority: 'high'
    });
  } else if (trend.users_change < -0.1 && previous_period && previous_period.total_users >= 5) {
    insights.push({
      type: 'warning',
      category: 'traffic',
      title: `Site visitors dropped ${Math.round(Math.abs(trend.users_change) * 100)}%`,
      description: `From ${previous_period.total_users.toLocaleString()} to ${summary.total_users.toLocaleString()} users this period.`,
      metric: `-${Math.round(Math.abs(trend.users_change) * 100)}%`,
      metric_label: 'Users Change',
      icon: 'trending-down',
      priority: 'high'
    });
  }

  // Engagement summary (real kmstrack data)
  if (summary.avg_engagement_time > 0) {
    insights.push({
      type: 'neutral',
      category: 'traffic',
      title: `Average engagement is ${formatDuration(summary.avg_engagement_time)} per session`,
      description: `Across ${summary.total_sessions.toLocaleString()} sessions from ${summary.total_users.toLocaleString()} users this period.`,
      metric: formatDuration(summary.avg_engagement_time),
      metric_label: 'Engagement',
      icon: 'clock',
      priority: 'high'
    });
  }

  // Device comparison — real per-device engagement computed by the kmstrack collector.
  // Requires a minimum sample per device: with a handful of sessions a single long
  // "tab left open" session skews the mean into nonsense (e.g. +2028%).
  const MIN_DEVICE_SESSIONS = 15;
  if (device_distribution) {
    const desktop = device_distribution.find(d => d.device === 'Desktop');
    const mobile = device_distribution.find(d => d.device === 'Mobile');
    if (desktop && mobile &&
        desktop.sessions >= MIN_DEVICE_SESSIONS && mobile.sessions >= MIN_DEVICE_SESSIONS &&
        desktop.avg_engagement_time > 0 && mobile.avg_engagement_time > 0) {
      const diff = Math.round((1 - mobile.avg_engagement_time / desktop.avg_engagement_time) * 100);
      if (diff >= 15) {
        insights.push({
          type: 'warning',
          category: 'traffic',
          title: `Mobile engagement is ${diff}% lower than desktop`,
          description: `${formatDuration(mobile.avg_engagement_time)} on mobile vs ${formatDuration(desktop.avg_engagement_time)} on desktop. Consider improving the mobile reading experience.`,
          metric: `-${diff}%`,
          metric_label: 'Mobile vs Desktop',
          icon: 'smartphone',
          priority: 'medium'
        });
      } else if (diff <= -15) {
        insights.push({
          type: 'positive',
          category: 'traffic',
          title: `Mobile engagement is ${Math.abs(diff)}% higher than desktop`,
          description: `${formatDuration(mobile.avg_engagement_time)} on mobile vs ${formatDuration(desktop.avg_engagement_time)} on desktop.`,
          metric: `+${Math.abs(diff)}%`,
          metric_label: 'Mobile vs Desktop',
          icon: 'smartphone',
          priority: 'medium'
        });
      }
    }
  }

  // Top landing page
  if (top_landing_pages && top_landing_pages.length > 0) {
    const top = top_landing_pages[0];
    insights.push({
      type: 'neutral',
      category: 'traffic',
      title: `${top.page} is your top landing page`,
      description: `${top.sessions.toLocaleString()} sessions with an average engagement of ${formatDuration(top.avg_engagement_time)}.`,
      metric: top.sessions.toLocaleString(),
      metric_label: 'Sessions',
      icon: 'eye',
      priority: 'medium'
    });
  }

  // Search engine referral share (kmstrack referrer data, not GSC queries)
  if (traffic_sources && traffic_sources.length > 0 && summary.total_sessions > 0) {
    const organic = traffic_sources.filter(s => /google|bing|yahoo|duckduckgo|organic/i.test(s.source));
    const organicSessions = organic.reduce((acc, s) => acc + s.sessions, 0);
    const organicShare = Math.round((organicSessions / summary.total_sessions) * 100);
    if (organicSessions >= 5 && organicShare >= 1) {
      insights.push({
        type: 'neutral',
        category: 'traffic',
        title: `Search engines drive ${organicShare}% of sessions`,
        description: `${organicSessions.toLocaleString()} sessions from ${organic.map(s => s.source).join(', ')} this period.`,
        metric: `${organicShare}%`,
        metric_label: 'Search Referrals',
        icon: 'search',
        priority: 'medium'
      });
    }
  }

  // Top traffic source (skipped when one source dominates — low signal)
  if (traffic_sources && traffic_sources.length > 0) {
    const topSource = traffic_sources[0];
    const topShare = Math.round(topSource.percentage * 100);
    if (topShare < 95) {
      insights.push({
        type: 'neutral',
        category: 'traffic',
        title: `${topSource.source} drives ${topShare}% of traffic`,
        description: `${topSource.sessions.toLocaleString()} sessions from ${topSource.source} this period.`,
        metric: `${topShare}%`,
        metric_label: 'Traffic Share',
        icon: 'globe',
        priority: 'low'
      });
    }
  }

  // Returning users
  if (summary.returning_users > 0 && summary.total_users > 0) {
    const pct = Math.round((summary.returning_users / summary.total_users) * 100);
    insights.push({
      type: 'neutral',
      category: 'traffic',
      title: `${summary.returning_users} returning users (${pct}% of visitors)`,
      description: `${pct}% of this period's visitors came back for another session.`,
      metric: summary.returning_users.toLocaleString(),
      metric_label: 'Returning Users',
      icon: 'users',
      priority: 'low'
    });
  }

  return insights;
}

function analyzePublishingData(publishingData) {
  const insights = [];

  if (!publishingData) return insights;

  const { contribution_streak, recent_commits, summary } = publishingData;

  // Streak insight
  if (contribution_streak && contribution_streak.current_streak > 0) {
    insights.push({
      type: 'neutral',
      category: 'publishing',
      title: `${contribution_streak.current_streak} consecutive days of commits`,
      description: `Active publishing streak with ${summary.commits_in_current_period || recent_commits?.length || 0} commits in the last 30 days.`,
      metric: `${contribution_streak.current_streak} days`,
      metric_label: 'Current Streak',
      icon: 'calendar',
      priority: 'low'
    });
  }

  // Recent activity
  if (recent_commits && recent_commits.length > 0) {
    const latestCommit = recent_commits[0];
    insights.push({
      type: 'neutral',
      category: 'publishing',
      title: 'Latest commit: ' + latestCommit.message.substring(0, 50),
      description: `Committed ${new Date(latestCommit.date).toLocaleDateString()}.`,
      metric: recent_commits.length.toString(),
      metric_label: 'Recent Commits',
      icon: 'git-commit',
      priority: 'low'
    });
  }

  return insights;
}

function analyzeKnowledgeData(knowledgeData) {
  const insights = [];

  if (!knowledgeData) return insights;

  const { summary, categories } = knowledgeData;

  // Content growth
  if (summary.total_articles > 0) {
    insights.push({
      type: 'positive',
      category: 'knowledge',
      title: `Digital garden contains ${summary.total_articles} articles`,
      description: `Across ${summary.total_categories} categories with ${summary.total_tags} unique tags. Total word count: ${summary.total_word_count.toLocaleString()}.`,
      metric: summary.total_articles.toString(),
      metric_label: 'Articles',
      icon: 'book-open',
      priority: 'low'
    });
  }

  // Top category
  if (categories && categories.length > 0) {
    const topCategory = categories[0];
    insights.push({
      type: 'positive',
      category: 'knowledge',
      title: `${topCategory.name} is the most content-rich category`,
      description: `With ${topCategory.count} articles, representing ${Math.round(topCategory.percentage * 100)}% of all content.`,
      metric: topCategory.count.toString(),
      metric_label: 'Articles',
      icon: 'folder',
      priority: 'low'
    });
  }

  // Internal linking
  if (summary.total_internal_links > 0 && summary.total_articles > 0) {
    const linksPerArticle = Math.round(summary.total_internal_links / summary.total_articles * 10) / 10;
    insights.push({
      type: 'positive',
      category: 'knowledge',
      title: `${summary.total_internal_links} internal links connecting content`,
      description: `Average of ${linksPerArticle} links per article, creating a well-connected knowledge graph.`,
      metric: summary.total_internal_links.toString(),
      metric_label: 'Internal Links',
      icon: 'link',
      priority: 'medium'
    });
  }

  return insights;
}

async function main() {
  try {
    console.log('Starting insights generation...');

    const trafficData = loadData('traffic.json');
    const publishingData = loadData('publishing.json');
    const knowledgeData = loadData('knowledge.json');

    const allInsights = [
      ...analyzeTrafficData(trafficData),
      ...analyzePublishingData(publishingData),
      ...analyzeKnowledgeData(knowledgeData)
    ];

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    allInsights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    const data = {
      collected_at: new Date().toISOString(),
      insights: allInsights.slice(0, 10), // Top 10 insights
      generated_at: new Date().toISOString(),
      analysis_period: {
        current: trafficData?.period || { start: 'N/A', end: 'N/A' }
      }
    };

    const outputPath = path.join(process.cwd(), 'data', 'observatory', 'insights.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`Insights generated successfully. Found ${allInsights.length} insights. Saved to ${outputPath}`);

  } catch (error) {
    console.error('Error generating insights:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeTrafficData, analyzePublishingData, analyzeKnowledgeData };
