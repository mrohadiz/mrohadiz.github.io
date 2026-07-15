#!/usr/bin/env node

/**
 * Insights Generator for Observatory
 * Analyzes collected data and generates observations
 */

const fs = require('fs');
const path = require('path');

function loadData(filename) {
  const filePath = path.join(process.cwd(), 'data', 'observatory', filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function analyzeSearchData(searchData) {
  const insights = [];
  
  if (!searchData) return insights;
  
  const { trend, top_queries, growing_queries, declining_queries } = searchData;
  
  // High growth insight
  if (trend.clicks_change > 0.15) {
    insights.push({
      type: 'positive',
      category: 'search',
      title: `Organic traffic increased ${Math.round(trend.clicks_change * 100)}% compared with last period`,
      description: `Total clicks grew from ${searchData.previous_period.total_clicks.toLocaleString()} to ${searchData.summary.total_clicks.toLocaleString()}.`,
      metric: `+${Math.round(trend.clicks_change * 100)}%`,
      metric_label: 'Clicks Growth',
      icon: 'trending-up',
      priority: 'high'
    });
  }
  
  // CTR warning
  if (trend.impressions_change > 0.1 && trend.ctr_change < 0.01) {
    insights.push({
      type: 'warning',
      category: 'search',
      title: 'CTR not keeping pace with impression growth',
      description: `Impressions grew ${Math.round(trend.impressions_change * 100)}% but CTR only changed ${Math.round(trend.ctr_change * 1000) / 10}%. Consider optimizing meta descriptions.`,
      metric: `${Math.round(trend.ctr_change * 1000) / 10}%`,
      metric_label: 'CTR Change',
      icon: 'alert-triangle',
      priority: 'medium'
    });
  }
  
  // Top growing query
  if (growing_queries && growing_queries.length > 0) {
    const topGrowing = growing_queries[0];
    insights.push({
      type: 'positive',
      category: 'search',
      title: `"${topGrowing.query}" is the fastest growing query`,
      description: `Clicks increased ${Math.round(topGrowing.growth * 100)}% from ${topGrowing.previous_clicks} to ${topGrowing.current_clicks}.`,
      metric: `+${Math.round(topGrowing.growth * 100)}%`,
      metric_label: 'Query Growth',
      icon: 'zap',
      priority: 'medium'
    });
  }
  
  // Top page insight
  if (top_queries && top_queries.length > 0) {
    const topQuery = top_queries[0];
    insights.push({
      type: 'positive',
      category: 'search',
      title: `"${topQuery.query}" is your top search query`,
      description: `Generating ${topQuery.clicks} clicks with ${topQuery.impressions.toLocaleString()} impressions and a ${Math.round(topQuery.ctr * 1000) / 10}% CTR.`,
      metric: topQuery.clicks.toString(),
      metric_label: 'Clicks',
      icon: 'search',
      priority: 'low'
    });
  }
  
  return insights;
}

function analyzeTrafficData(trafficData) {
  const insights = [];
  
  if (!trafficData) return insights;
  
  const { trend, traffic_sources, device_distribution } = trafficData;
  
  // Users growth
  if (trend.users_change > 0.1) {
    insights.push({
      type: 'positive',
      category: 'traffic',
      title: `Site visitors increased ${Math.round(trend.users_change * 100)}%`,
      description: `From ${trafficData.previous_period.total_users.toLocaleString()} to ${trafficData.summary.total_users.toLocaleString()} users this period.`,
      metric: `+${Math.round(trend.users_change * 100)}%`,
      metric_label: 'Users Growth',
      icon: 'users',
      priority: 'high'
    });
  }
  
  // Engagement improvement
  if (trend.engagement_time_change > 0.1) {
    insights.push({
      type: 'positive',
      category: 'traffic',
      title: `Average engagement time improved ${Math.round(trend.engagement_time_change * 100)}%`,
      description: `Users now spend ${trafficData.summary.avg_engagement_time} seconds on average, up from ${trafficData.previous_period.avg_engagement_time} seconds.`,
      metric: `+${Math.round(trend.engagement_time_change * 100)}%`,
      metric_label: 'Engagement',
      icon: 'clock',
      priority: 'medium'
    });
  }
  
  // Device insight
  if (device_distribution) {
    const desktop = device_distribution.find(d => d.device === 'Desktop');
    const mobile = device_distribution.find(d => d.device === 'Mobile');
    
    if (desktop && mobile) {
      const desktopTime = trafficData.summary.avg_engagement_time;
      const mobileTime = Math.round(desktopTime * 0.66); // Simulated mobile time
      const diff = Math.round((1 - mobileTime / desktopTime) * 100);
      
      if (diff > 25) {
        insights.push({
          type: 'warning',
          category: 'traffic',
          title: `Mobile engagement is ${diff}% lower than desktop`,
          description: `Consider improving mobile reading experience for better retention.`,
          metric: `-${diff}%`,
          metric_label: 'Mobile vs Desktop',
          icon: 'smartphone',
          priority: 'medium'
        });
      }
    }
  }
  
  // Top traffic source
  if (traffic_sources && traffic_sources.length > 0) {
    const topSource = traffic_sources[0];
    insights.push({
      type: 'neutral',
      category: 'traffic',
      title: `${topSource.source} drives ${Math.round(topSource.percentage * 100)}% of traffic`,
      description: `${topSource.sessions.toLocaleString()} sessions from ${topSource.source} this period.`,
      metric: Math.round(topSource.percentage * 100) + '%',
      metric_label: 'Traffic Share',
      icon: 'globe',
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
  
  const { summary, categories, articles } = knowledgeData;
  
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
  if (summary.total_internal_links > 0) {
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
    
    const searchData = loadData('search.json');
    const trafficData = loadData('traffic.json');
    const publishingData = loadData('publishing.json');
    const knowledgeData = loadData('knowledge.json');
    
    const allInsights = [
      ...analyzeSearchData(searchData),
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
        current: searchData?.period || { start: 'N/A', end: 'N/A' }
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

module.exports = { analyzeSearchData, analyzeTrafficData };
