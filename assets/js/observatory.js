/**
 * Digital Garden Observatory Dashboard
 * Loads JSON data and renders interactive charts and tables
 */

(function() {
  'use strict';

  // ============================================================
  // Configuration
  // ============================================================
  // Calculate base path relative to the current page
  // Jekyll outputs observatory/index.html, so ../data/observatory/ is correct
  const DATA_BASE_PATH = (() => {
    const path = window.location.pathname;
    if (path.includes('/observatory/')) {
      return '../data/observatory/';
    }
    return 'data/observatory/';
  })();

  // ============================================================
  // Utility Functions
  // ============================================================
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  }

  function formatPercent(num) {
    return (num * 100).toFixed(1) + '%';
  }

  function formatDuration(seconds) {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
    return `${seconds}s`;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function truncateUrl(url, maxLen) {
    if (url.length <= maxLen) return escapeHtml(url);
    return escapeHtml(url.substring(0, maxLen)) + '...';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // Data Loading with Cache
  // ============================================================
  const dataCache = {};

  async function loadJSON(filename) {
    if (dataCache[filename]) return dataCache[filename];
    try {
      const response = await fetch(DATA_BASE_PATH + filename);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      dataCache[filename] = data;
      return data;
    } catch (error) {
      console.error(`Failed to load ${filename}:`, error);
      return null;
    }
  }

  // ============================================================
  // Tab Navigation
  // ============================================================
  function initTabs() {
    const tabs = document.querySelectorAll('.observatory-tab');
    const contents = document.querySelectorAll('.observatory-tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Update active tab
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Show/hide content
        contents.forEach(content => {
          if (content.id === `tab-${targetTab}`) {
            content.style.display = '';
            content.classList.add('active');
          } else {
            content.style.display = 'none';
            content.classList.remove('active');
          }
        });
      });
    });
  }

  // ============================================================
  // Chart.js Configuration
  // ============================================================
  function getChartDefaults() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      color: isDark ? '#F5F7FA' : '#0F172A',
      gridColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      primaryColor: '#4F8CFF',
      successColor: '#22C55E',
      warningColor: '#F59E0B',
      dangerColor: '#EF4444',
      surfaceColor: isDark ? '#1B2435' : '#FFFFFF'
    };
  }

  function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  // ============================================================
  // Insights Renderer
  // ============================================================
  function renderInsights(insightsData) {
    const grid = document.getElementById('insights-grid');
    if (!grid || !insightsData || !insightsData.insights) return;

    const insights = insightsData.insights;
    grid.innerHTML = insights.map(insight => `
      <div class="insight-card insight-${insight.type}">
        <div class="insight-icon insight-icon-${insight.type}">
          ${getInsightIcon(insight.icon)}
        </div>
        <div class="insight-content">
          <div class="insight-metric">${insight.metric}</div>
          <div class="insight-label">${insight.metric_label}</div>
          <h4 class="insight-title">${insight.title}</h4>
          <p class="insight-description">${insight.description}</p>
        </div>
      </div>
    `).join('');
  }

  function getInsightIcon(icon) {
    const icons = {
      'trending-up': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
      'trending-down': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>',
      'zap': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      'alert-triangle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      'eye': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      'users': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
      'calendar': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
      'link': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
      'smartphone': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>',
      'search': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
      'clock': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
      'globe': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
      'git-commit': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line></svg>',
      'book-open': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
      'folder': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>'
    };
    return icons[icon] || icons['zap'];
  }

  // ============================================================
  // KPI Renderer
  // ============================================================
  function renderKPICard(container, value, label, trend, trendValue) {
    const card = document.createElement('div');
    card.className = 'observatory-kpi-card';
    
    let trendHtml = '';
    if (trend !== undefined && trendValue) {
      const trendClass = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
      const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
      trendHtml = `
        <div class="observatory-kpi-trend ${trendClass}">
          <span>${trendIcon}</span>
          <span>${trendValue}</span>
        </div>
      `;
    }
    
    card.innerHTML = `
      <div class="observatory-kpi-value">${value}</div>
      <div class="observatory-kpi-label">${label}</div>
      ${trendHtml}
    `;
    container.appendChild(card);
  }

  // ============================================================
  // Table Renderer
  // ============================================================
  function renderTable(tableId, data, columns) {
    const table = document.getElementById(tableId);
    if (!table || !data) return;
    
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = data.map(row => `
      <tr>
        ${columns.map(col => `<td>${col.render ? col.render(row[col.key], row) : row[col.key]}</td>`).join('')}
      </tr>
    `).join('');
  }

  // ============================================================
  // Overview Tab
  // ============================================================
  async function renderOverview() {
    const [searchData, trafficData, knowledgeData] = await Promise.all([
      loadJSON('search.json'),
      loadJSON('traffic.json'),
      loadJSON('knowledge.json')
    ]);

    // KPIs
    const kpiContainer = document.getElementById('overview-kpi');
    if (kpiContainer) {
      kpiContainer.innerHTML = '';
      
      if (searchData) {
        renderKPICard(kpiContainer, formatNumber(searchData.summary.total_clicks), 'Total Clicks', searchData.trend.clicks_change, `+${Math.round(searchData.trend.clicks_change * 100)}%`);
        renderKPICard(kpiContainer, formatNumber(searchData.summary.total_impressions), 'Impressions', searchData.trend.impressions_change, `+${Math.round(searchData.trend.impressions_change * 100)}%`);
      }
      
      if (trafficData) {
        renderKPICard(kpiContainer, formatNumber(trafficData.summary.total_users), 'Total Users', trafficData.trend.users_change, `+${Math.round(trafficData.trend.users_change * 100)}%`);
        renderKPICard(kpiContainer, formatNumber(trafficData.summary.total_sessions), 'Sessions');
      }
      
      if (knowledgeData) {
        renderKPICard(kpiContainer, knowledgeData.summary.total_articles, 'Articles');
        renderKPICard(kpiContainer, knowledgeData.summary.total_word_count.toLocaleString(), 'Words');
      }
    }

    // Charts
    if (searchData) renderSearchTrendChart(searchData);
    if (trafficData) renderTrafficTrendChart(trafficData);
    if (knowledgeData) renderCategoriesChart(knowledgeData);
    if (trafficData) renderTrafficSourcesChart(trafficData);
  }

  // ============================================================
  // Search Tab
  // ============================================================
  async function renderSearch() {
    const searchData = await loadJSON('search.json');
    if (!searchData) return;

    // KPIs
    const kpiContainer = document.getElementById('search-kpi');
    if (kpiContainer) {
      kpiContainer.innerHTML = '';
      renderKPICard(kpiContainer, formatNumber(searchData.summary.total_clicks), 'Total Clicks', searchData.trend.clicks_change, `+${Math.round(searchData.trend.clicks_change * 100)}%`);
      renderKPICard(kpiContainer, formatNumber(searchData.summary.total_impressions), 'Impressions', searchData.trend.impressions_change, `+${Math.round(searchData.trend.impressions_change * 100)}%`);
      renderKPICard(kpiContainer, formatPercent(searchData.summary.ctr), 'CTR', searchData.trend.ctr_change, `${searchData.trend.ctr_change > 0 ? '+' : ''}${Math.round(searchData.trend.ctr_change * 1000) / 10}%`);
      renderKPICard(kpiContainer, searchData.summary.avg_position.toFixed(1), 'Avg. Position', searchData.trend.position_change, `${searchData.trend.position_change > 0 ? '+' : ''}${Math.round(searchData.trend.position_change * 10)}%`);
      renderKPICard(kpiContainer, searchData.summary.indexed_pages, 'Indexed Pages');
    }

    // Search Performance Chart
    renderSearchPerformanceChart(searchData);

    // Tables
    renderTable('top-queries-table', searchData.top_queries, [
      { key: 'query', render: (v) => `<span class="observatory-text-primary">${v}</span>` },
      { key: 'clicks', render: (v) => formatNumber(v) },
      { key: 'impressions', render: (v) => formatNumber(v) },
      { key: 'ctr', render: (v) => formatPercent(v) },
      { key: 'position', render: (v) => v.toFixed(1) }
    ]);

    renderTable('top-pages-table', searchData.top_pages, [
      { key: 'page', render: (v) => `<span class="observatory-text-primary" title="${v}">${truncateUrl(v, 40)}</span>` },
      { key: 'clicks', render: (v) => formatNumber(v) },
      { key: 'impressions', render: (v) => formatNumber(v) },
      { key: 'ctr', render: (v) => formatPercent(v) },
      { key: 'position', render: (v) => v.toFixed(1) }
    ]);

    renderTable('growing-queries-table', searchData.growing_queries, [
      { key: 'query', render: (v) => `<span class="observatory-text-primary">${v}</span>` },
      { key: 'current_clicks', render: (v) => formatNumber(v) },
      { key: 'previous_clicks', render: (v) => formatNumber(v) },
      { key: 'growth', render: (v) => `<span class="observatory-text-success">+${Math.round(v * 100)}%</span>` }
    ]);

    renderTable('declining-queries-table', searchData.declining_queries, [
      { key: 'query', render: (v) => `<span class="observatory-text-primary">${v}</span>` },
      { key: 'current_clicks', render: (v) => formatNumber(v) },
      { key: 'previous_clicks', render: (v) => formatNumber(v) },
      { key: 'growth', render: (v) => `<span class="observatory-text-danger">${Math.round(v * 100)}%</span>` }
    ]);
  }

  // ============================================================
  // Traffic Tab
  // ============================================================
  async function renderTraffic() {
    const trafficData = await loadJSON('traffic.json');
    if (!trafficData) return;

    // KPIs
    const kpiContainer = document.getElementById('traffic-kpi');
    if (kpiContainer) {
      kpiContainer.innerHTML = '';
      renderKPICard(kpiContainer, formatNumber(trafficData.summary.total_users), 'Total Users', trafficData.trend.users_change, `+${Math.round(trafficData.trend.users_change * 100)}%`);
      renderKPICard(kpiContainer, formatNumber(trafficData.summary.total_sessions), 'Sessions', trafficData.trend.sessions_change, `+${Math.round(trafficData.trend.sessions_change * 100)}%`);
      renderKPICard(kpiContainer, formatDuration(trafficData.summary.avg_engagement_time), 'Avg. Engagement', trafficData.trend.engagement_time_change, `+${Math.round(trafficData.trend.engagement_time_change * 100)}%`);
      renderKPICard(kpiContainer, formatPercent(trafficData.summary.bounce_rate), 'Bounce Rate', trafficData.trend.bounce_rate_change, `${Math.round(trafficData.trend.bounce_rate_change * 100)}%`);
      renderKPICard(kpiContainer, formatNumber(trafficData.summary.returning_users), 'Returning Users');
    }

    // Charts
    renderTrafficSessionsChart(trafficData);
    renderDeviceChart(trafficData);
    renderCountryChart(trafficData);

    // Table
    renderTable('landing-pages-table', trafficData.top_landing_pages, [
      { key: 'page', render: (v) => `<span class="observatory-text-primary" title="${v}">${truncateUrl(v, 50)}</span>` },
      { key: 'sessions', render: (v) => formatNumber(v) },
      { key: 'avg_engagement_time', render: (v) => formatDuration(v) }
    ]);
  }

  // ============================================================
  // Publishing Tab
  // ============================================================
  async function renderPublishing() {
    const publishingData = await loadJSON('publishing.json');
    if (!publishingData) return;

    // KPIs
    const kpiContainer = document.getElementById('publishing-kpi');
    if (kpiContainer) {
      kpiContainer.innerHTML = '';
      renderKPICard(kpiContainer, publishingData.summary.total_commits, 'Total Commits');
      renderKPICard(kpiContainer, publishingData.contribution_streak.current_streak, 'Day Streak');
      renderKPICard(kpiContainer, publishingData.contribution_streak.longest_streak, 'Longest Streak');
      renderKPICard(kpiContainer, publishingData.summary.active_days, 'Active Days');
      renderKPICard(kpiContainer, publishingData.repository_health.open_issues, 'Open Issues');
    }

    // Publishing Timeline Chart
    renderPublishingTimelineChart(publishingData);

    // Recent Commits Table
    renderTable('commits-table', publishingData.recent_commits, [
      { key: 'sha', render: (v) => `<code class="observatory-code">${v}</code>` },
      { key: 'message', render: (v) => `<span class="observatory-text-primary">${truncateUrl(v, 60)}</span>` },
      { key: 'date', render: (v) => formatDate(v) },
      { key: 'author' }
    ]);

    // Repository Health
    const healthContainer = document.getElementById('repo-health');
    if (healthContainer) {
      const health = publishingData.repository_health;
      healthContainer.innerHTML = `
        <div class="observatory-health-item">
          <span class="observatory-health-label">Status</span>
          <span class="observatory-badge observatory-badge-success">${health.deployment_status}</span>
        </div>
        <div class="observatory-health-item">
          <span class="observatory-health-label">Open Issues</span>
          <span class="observatory-health-value">${health.open_issues}</span>
        </div>
        <div class="observatory-health-item">
          <span class="observatory-health-label">Open PRs</span>
          <span class="observatory-health-value">${health.open_pull_requests}</span>
        </div>
        <div class="observatory-health-item">
          <span class="observatory-health-label">Branches</span>
          <span class="observatory-health-value">${health.branches}</span>
        </div>
        <div class="observatory-health-item">
          <span class="observatory-health-label">Last Deployment</span>
          <span class="observatory-health-value">${formatDate(health.last_deployment)}</span>
        </div>
      `;
    }

    // Streak Info
    const streakContainer = document.getElementById('streak-info');
    if (streakContainer) {
      const streak = publishingData.contribution_streak;
      streakContainer.innerHTML = `
        <div class="observatory-streak-visual">
          <div class="observatory-streak-circle">
            <span class="observatory-streak-number">${streak.current_streak}</span>
            <span class="observatory-streak-label">Days</span>
          </div>
        </div>
        <div class="observatory-streak-details">
          <div class="observatory-health-item">
            <span class="observatory-health-label">Current Streak</span>
            <span class="observatory-health-value observatory-text-success">${streak.current_streak} days</span>
          </div>
          <div class="observatory-health-item">
            <span class="observatory-health-label">Longest Streak</span>
            <span class="observatory-health-value">${streak.longest_streak} days</span>
          </div>
          <div class="observatory-health-item">
            <span class="observatory-health-label">Commits (30d)</span>
            <span class="observatory-health-value">${publishingData.recent_commits.length}</span>
          </div>
        </div>
      `;
    }
  }

  // ============================================================
  // Knowledge Tab
  // ============================================================
  async function renderKnowledge() {
    const knowledgeData = await loadJSON('knowledge.json');
    if (!knowledgeData) return;

    // KPIs
    const kpiContainer = document.getElementById('knowledge-kpi');
    if (kpiContainer) {
      kpiContainer.innerHTML = '';
      renderKPICard(kpiContainer, knowledgeData.summary.total_articles, 'Articles');
      renderKPICard(kpiContainer, knowledgeData.summary.total_categories, 'Categories');
      renderKPICard(kpiContainer, knowledgeData.summary.total_tags, 'Tags');
      renderKPICard(kpiContainer, knowledgeData.summary.total_internal_links, 'Internal Links');
      renderKPICard(kpiContainer, knowledgeData.summary.avg_reading_time + ' min', 'Avg. Read Time');
      renderKPICard(kpiContainer, knowledgeData.summary.total_word_count.toLocaleString(), 'Total Words');
    }

    // Charts
    renderKnowledgeCategoriesChart(knowledgeData);
    renderKnowledgeTagsChart(knowledgeData);

    // Articles Table
    renderTable('articles-table', knowledgeData.articles, [
      { key: 'title', render: (v, row) => `<a href="${row.url}" class="observatory-text-primary observatory-link">${v}</a>` },
      { key: 'category', render: (v) => `<span class="observatory-badge observatory-badge-outline">${v}</span>` },
      { key: 'date', render: (v) => formatDate(v) },
      { key: 'word_count', render: (v) => v.toLocaleString() },
      { key: 'reading_time', render: (v) => `${v} min` },
      { key: 'internal_links' }
    ]);

    // Newest Articles
    renderTable('newest-articles-table', knowledgeData.newest_articles, [
      { key: 'title', render: (v) => `<span class="observatory-text-primary">${v}</span>` },
      { key: 'date', render: (v) => formatDate(v) },
      { key: 'category', render: (v) => `<span class="observatory-badge observatory-badge-outline">${v}</span>` }
    ]);

    // Most Updated
    renderTable('most-updated-table', knowledgeData.most_updated, [
      { key: 'title', render: (v) => `<span class="observatory-text-primary">${v}</span>` },
      { key: 'updates' },
      { key: 'last_updated', render: (v) => formatDate(v) }
    ]);
  }

  // ============================================================
  // Chart Renderers
  // ============================================================
  let charts = {};

  function destroyChart(id) {
    if (charts[id]) {
      charts[id].destroy();
      delete charts[id];
    }
  }

  function renderSearchTrendChart(data) {
    destroyChart('searchTrend');
    const ctx = document.getElementById('search-trend-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const gradient = createGradient(ctx.getContext('2d'), 'rgba(79, 140, 255, 0.3)', 'rgba(79, 140, 255, 0)');
    
    charts.searchTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.daily_trend.map(d => d.date.split('-').slice(1).join('/')),
        datasets: [{
          label: 'Clicks',
          data: data.daily_trend.map(d => d.clicks),
          borderColor: defaults.primaryColor,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color, maxTicksLimit: 10 }
          },
          y: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color }
          }
        }
      }
    });
  }

  function renderTrafficTrendChart(data) {
    destroyChart('trafficTrend');
    const ctx = document.getElementById('traffic-trend-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const gradient = createGradient(ctx.getContext('2d'), 'rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0)');
    
    charts.trafficTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.daily_trend.map(d => d.date.split('-').slice(1).join('/')),
        datasets: [{
          label: 'Users',
          data: data.daily_trend.map(d => d.users),
          borderColor: defaults.successColor,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color, maxTicksLimit: 10 }
          },
          y: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color }
          }
        }
      }
    });
  }

  function renderCategoriesChart(data) {
    destroyChart('categories');
    const ctx = document.getElementById('categories-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const colors = [defaults.primaryColor, defaults.successColor, defaults.warningColor, defaults.dangerColor, '#8B5CF6', '#EC4899'];
    
    charts.categories = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.categories.map(c => c.name),
        datasets: [{
          data: data.categories.map(c => c.count),
          backgroundColor: colors.slice(0, data.categories.length),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: defaults.color, padding: 12, usePointStyle: true }
          }
        },
        cutout: '60%'
      }
    });
  }

  function renderTrafficSourcesChart(data) {
    destroyChart('trafficSources');
    const ctx = document.getElementById('traffic-sources-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const colors = [defaults.primaryColor, defaults.successColor, defaults.warningColor, defaults.dangerColor, '#8B5CF6', '#EC4899'];
    
    charts.trafficSources = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.traffic_sources.map(s => s.source),
        datasets: [{
          data: data.traffic_sources.map(s => s.sessions),
          backgroundColor: colors.slice(0, data.traffic_sources.length),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: defaults.color, padding: 12, usePointStyle: true }
          }
        },
        cutout: '60%'
      }
    });
  }

  function renderSearchPerformanceChart(data) {
    destroyChart('searchPerformance');
    const ctx = document.getElementById('search-performance-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const gradient = createGradient(ctx.getContext('2d'), 'rgba(79, 140, 255, 0.3)', 'rgba(79, 140, 255, 0)');
    
    charts.searchPerformance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.daily_trend.map(d => d.date.split('-').slice(1).join('/')),
        datasets: [
          {
            label: 'Clicks',
            data: data.daily_trend.map(d => d.clicks),
            borderColor: defaults.primaryColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          },
          {
            label: 'Impressions',
            data: data.daily_trend.map(d => d.impressions / 10),
            borderColor: defaults.warningColor,
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: defaults.color, usePointStyle: true }
          }
        },
        scales: {
          x: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color, maxTicksLimit: 15 }
          },
          y: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color }
          }
        }
      }
    });
  }

  function renderTrafficSessionsChart(data) {
    destroyChart('trafficSessions');
    const ctx = document.getElementById('traffic-sessions-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const gradient = createGradient(ctx.getContext('2d'), 'rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0)');
    
    charts.trafficSessions = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.daily_trend.map(d => d.date.split('-').slice(1).join('/')),
        datasets: [{
          label: 'Sessions',
          data: data.daily_trend.map(d => d.sessions),
          borderColor: defaults.successColor,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color, maxTicksLimit: 15 }
          },
          y: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color }
          }
        }
      }
    });
  }

  function renderDeviceChart(data) {
    destroyChart('device');
    const ctx = document.getElementById('device-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const colors = [defaults.primaryColor, defaults.successColor, defaults.warningColor];
    
    charts.device = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.device_distribution.map(d => d.device),
        datasets: [{
          data: data.device_distribution.map(d => d.sessions),
          backgroundColor: colors.slice(0, data.device_distribution.length),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: defaults.color, padding: 12, usePointStyle: true }
          }
        },
        cutout: '60%'
      }
    });
  }

  function renderCountryChart(data) {
    destroyChart('country');
    const ctx = document.getElementById('country-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const colors = [defaults.primaryColor, defaults.successColor, defaults.warningColor, defaults.dangerColor, '#8B5CF6', '#EC4899', '#6B7280'];
    
    charts.country = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.country_distribution.map(c => c.country),
        datasets: [{
          label: 'Sessions',
          data: data.country_distribution.map(c => c.sessions),
          backgroundColor: colors.slice(0, data.country_distribution.length),
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color }
          },
          y: {
            grid: { display: false },
            ticks: { color: defaults.color }
          }
        }
      }
    });
  }

  function renderPublishingTimelineChart(data) {
    destroyChart('publishingTimeline');
    const ctx = document.getElementById('publishing-timeline-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    
    charts.publishingTimeline = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.publishing_timeline.map(t => t.month),
        datasets: [{
          label: 'Commits',
          data: data.publishing_timeline.map(t => t.commits),
          backgroundColor: defaults.primaryColor,
          borderRadius: 4,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: defaults.color, maxRotation: 45 }
          },
          y: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color, stepSize: 5 }
          }
        }
      }
    });
  }

  function renderKnowledgeCategoriesChart(data) {
    destroyChart('knowledgeCategories');
    const ctx = document.getElementById('knowledge-categories-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const colors = [defaults.primaryColor, defaults.successColor, defaults.warningColor, defaults.dangerColor, '#8B5CF6', '#EC4899'];
    
    charts.knowledgeCategories = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.categories.map(c => c.name),
        datasets: [{
          data: data.categories.map(c => c.count),
          backgroundColor: colors.slice(0, data.categories.length),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: defaults.color, padding: 12, usePointStyle: true }
          }
        },
        cutout: '60%'
      }
    });
  }

  function renderKnowledgeTagsChart(data) {
    destroyChart('knowledgeTags');
    const ctx = document.getElementById('knowledge-tags-chart');
    if (!ctx) return;
    
    const defaults = getChartDefaults();
    const topTags = data.tags.slice(0, 10);
    
    charts.knowledgeTags = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topTags.map(t => t.name),
        datasets: [{
          label: 'Articles',
          data: topTags.map(t => t.count),
          backgroundColor: defaults.primaryColor,
          borderRadius: 4,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: defaults.gridColor },
            ticks: { color: defaults.color, stepSize: 1 }
          },
          y: {
            grid: { display: false },
            ticks: { color: defaults.color }
          }
        }
      }
    });
  }

  // ============================================================
  // Update Last Updated Timestamp
  // ============================================================
  async function updateLastUpdated() {
    const searchData = await loadJSON('search.json');
    const el = document.getElementById('last-updated');
    if (el && searchData && searchData.collected_at) {
      el.textContent = formatDate(searchData.collected_at);
    }
  }

  // ============================================================
  // Initialize
  // ============================================================
  async function init() {
    // Initialize tabs
    initTabs();
    
    // Load and render all data
    await Promise.all([
      renderOverview(),
      renderInsights(await loadJSON('insights.json')),
      updateLastUpdated()
    ]);
    
    // Pre-load tab data
    renderSearch();
    renderTraffic();
    renderPublishing();
    renderKnowledge();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
