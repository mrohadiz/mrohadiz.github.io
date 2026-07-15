---
layout: default
title: Observatory
description: Digital Garden Observatory - Analytics & insights for the knowledge garden
---

<!-- Observatory Hero -->
<section class="observatory-hero">
  <div class="observatory-hero-bg" aria-hidden="true"></div>
  <div class="container">
    <div class="observatory-hero-inner">
      <div class="observatory-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Live Dashboard
      </div>
      <h1 class="observatory-title">Digital Garden Observatory</h1>
      <p class="observatory-subtitle">Observing the evolution of knowledge, search visibility, and publishing activity.</p>
      <div class="observatory-meta">
        <span class="observatory-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Last updated: <span id="last-updated">Loading...</span>
        </span>
        <span class="observatory-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path d="M9 12l2 2 4-4"></path></svg>
          Data refreshes daily at 06:00 UTC
        </span>
      </div>
    </div>
  </div>
</section>

<!-- Observatory Navigation Tabs -->
<section class="observatory-nav">
  <div class="container">
    <div class="observatory-tabs" role="tablist">
      <button class="observatory-tab active" role="tab" data-tab="overview" aria-selected="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        Overview
      </button>
      <button class="observatory-tab" role="tab" data-tab="search" aria-selected="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Search
      </button>
      <button class="observatory-tab" role="tab" data-tab="traffic" aria-selected="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
        Traffic
      </button>
      <button class="observatory-tab" role="tab" data-tab="publishing" aria-selected="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line></svg>
        Publishing
      </button>
      <button class="observatory-tab" role="tab" data-tab="knowledge" aria-selected="false">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>
        Knowledge
      </button>
    </div>
  </div>
</section>

<!-- Insights Section -->
<section class="observatory-section" id="insights-section">
  <div class="container">
    <div class="observatory-section-header">
      <h2 class="observatory-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Insight Engine
      </h2>
      <p class="observatory-section-subtitle">Automatic observations from your garden data</p>
    </div>
    <div class="insights-grid" id="insights-grid">
      <!-- Insights will be loaded here -->
      <div class="observatory-loading">
        <div class="observatory-spinner"></div>
        <span>Loading insights...</span>
      </div>
    </div>
  </div>
</section>

<!-- Overview Tab Content -->
<section class="observatory-section observatory-tab-content active" id="tab-overview">
  <div class="container">
    <div class="observatory-section-header">
      <h2 class="observatory-section-title">Overview</h2>
      <p class="observatory-section-subtitle">Key metrics across all observatories</p>
    </div>
    
    <!-- KPI Cards -->
    <div class="observatory-kpi-grid" id="overview-kpi">
      <!-- KPIs will be loaded here -->
    </div>
    
    <!-- Charts Row -->
    <div class="observatory-charts-row">
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Search Trend (30d)</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="search-trend-chart"></canvas>
        </div>
      </div>
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Traffic Trend (30d)</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="traffic-trend-chart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Content Distribution -->
    <div class="observatory-charts-row">
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Top Categories</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="categories-chart"></canvas>
        </div>
      </div>
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Traffic Sources</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="traffic-sources-chart"></canvas>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Search Observatory Tab -->
<section class="observatory-section observatory-tab-content" id="tab-search" style="display: none;">
  <div class="container">
    <div class="observatory-section-header">
      <h2 class="observatory-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Search Observatory
      </h2>
      <p class="observatory-section-subtitle">Google Search Console insights</p>
    </div>
    
    <!-- Search KPIs -->
    <div class="observatory-kpi-grid" id="search-kpi">
      <!-- KPIs will be loaded here -->
    </div>
    
    <!-- Search Charts -->
    <div class="observatory-charts-row">
      <div class="observatory-chart-card observatory-chart-full">
        <div class="observatory-chart-header">
          <h3>Search Performance (30d)</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="search-performance-chart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Search Tables -->
    <div class="observatory-tables-row">
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>Top Queries</h3>
        </div>
        <div class="observatory-table-body">
          <table class="observatory-table" id="top-queries-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>Top Pages</h3>
        </div>
        <div class="observatory-table-body">
          <table class="observatory-table" id="top-pages-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Growing/Declining -->
    <div class="observatory-charts-row">
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            Growing Queries
          </h3>
        </div>
        <div class="observatory-table-body">
          <table class="observatory-table" id="growing-queries-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Current</th>
                <th>Previous</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
            Declining Queries
          </h3>
        </div>
        <div class="observatory-table-body">
          <table class="observatory-table" id="declining-queries-table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Current</th>
                <th>Previous</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Traffic Observatory Tab -->
<section class="observatory-section observatory-tab-content" id="tab-traffic" style="display: none;">
  <div class="container">
    <div class="observatory-section-header">
      <h2 class="observatory-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
        Traffic Observatory
      </h2>
      <p class="observatory-section-subtitle">Google Analytics 4 insights</p>
    </div>
    
    <!-- Traffic KPIs -->
    <div class="observatory-kpi-grid" id="traffic-kpi">
      <!-- KPIs will be loaded here -->
    </div>
    
    <!-- Traffic Charts -->
    <div class="observatory-charts-row">
      <div class="observatory-chart-card observatory-chart-full">
        <div class="observatory-chart-header">
          <h3>User Sessions (30d)</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="traffic-sessions-chart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="observatory-charts-row">
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Device Distribution</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="device-chart"></canvas>
        </div>
      </div>
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Country Distribution</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="country-chart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Traffic Tables -->
    <div class="observatory-table-card observatory-table-full">
      <div class="observatory-table-header">
        <h3>Top Landing Pages</h3>
      </div>
      <div class="observatory-table-body">
        <table class="observatory-table" id="landing-pages-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Sessions</th>
              <th>Avg. Engagement Time</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<!-- Publishing Observatory Tab -->
<section class="observatory-section observatory-tab-content" id="tab-publishing" style="display: none;">
  <div class="container">
    <div class="observatory-section-header">
      <h2 class="observatory-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line></svg>
        Publishing Observatory
      </h2>
      <p class="observatory-section-subtitle">GitHub repository activity and publishing metrics</p>
    </div>
    
    <!-- Publishing KPIs -->
    <div class="observatory-kpi-grid" id="publishing-kpi">
      <!-- KPIs will be loaded here -->
    </div>
    
    <!-- Publishing Charts -->
    <div class="observatory-charts-row">
      <div class="observatory-chart-card observatory-chart-full">
        <div class="observatory-chart-header">
          <h3>Publishing Timeline</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="publishing-timeline-chart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="observatory-table-card observatory-table-full">
      <div class="observatory-table-header">
        <h3>Recent Commits</h3>
      </div>
      <div class="observatory-table-body">
        <table class="observatory-table" id="commits-table">
          <thead>
            <tr>
              <th>SHA</th>
              <th>Message</th>
              <th>Date</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
    
    <!-- Repository Health -->
    <div class="observatory-charts-row">
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>Repository Health</h3>
        </div>
        <div class="observatory-table-body" id="repo-health">
          <!-- Health indicators will be loaded here -->
        </div>
      </div>
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>Contribution Streak</h3>
        </div>
        <div class="observatory-table-body" id="streak-info">
          <!-- Streak info will be loaded here -->
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Knowledge Observatory Tab -->
<section class="observatory-section observatory-tab-content" id="tab-knowledge" style="display: none;">
  <div class="container">
    <div class="observatory-section-header">
      <h2 class="observatory-section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>
        Knowledge Observatory
      </h2>
      <p class="observatory-section-subtitle">Content index and knowledge graph insights</p>
    </div>
    
    <!-- Knowledge KPIs -->
    <div class="observatory-kpi-grid" id="knowledge-kpi">
      <!-- KPIs will be loaded here -->
    </div>
    
    <!-- Knowledge Charts -->
    <div class="observatory-charts-row">
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Content by Category</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="knowledge-categories-chart"></canvas>
        </div>
      </div>
      <div class="observatory-chart-card">
        <div class="observatory-chart-header">
          <h3>Top Tags</h3>
        </div>
        <div class="observatory-chart-body">
          <canvas id="knowledge-tags-chart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Knowledge Tables -->
    <div class="observatory-table-card observatory-table-full">
      <div class="observatory-table-header">
        <h3>All Articles</h3>
      </div>
      <div class="observatory-table-body">
        <table class="observatory-table" id="articles-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Words</th>
              <th>Read Time</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
    
    <!-- Newest & Most Updated -->
    <div class="observatory-charts-row">
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>Newest Articles</h3>
        </div>
        <div class="observatory-table-body">
          <table class="observatory-table" id="newest-articles-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="observatory-table-card">
        <div class="observatory-table-header">
          <h3>Most Updated</h3>
        </div>
        <div class="observatory-table-body">
          <table class="observatory-table" id="most-updated-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Updates</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Footer Spacer -->
<div style="height: var(--space-16);"></div>

<!-- Chart.js from CDN -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"></script>

<!-- Observatory Script -->
<script src="{{ '/assets/js/observatory.js' | relative_url }}?v={{ site.time | date: '%Y%m%d%H%M' }}" defer></script>
