#!/usr/bin/env node

/**
 * KMS Track Traffic Collector for Observatory
 * Collects website traffic data from MongoDB kmstrack collection
 * Queries for host: "mrohadiz.github.io" and aggregates metrics
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || 'kms_track';
const MONGO_COLLECTION = process.env.MONGO_COLLECTION || 'kmstrack';
const TARGET_HOST = 'mrohadiz.github.io';

const OUTPUT_DIR = path.join(__dirname, '../../data/observatory');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'traffic.json');

// Known bot/crawler user-agent signals. Matched case-insensitively against
// user_agent. Only *named* bots and high-precision generic terms are listed:
// broad words (checker/audit/monitoring) add no coverage but risk false
// positives, and in-app browsers (e.g. BytedanceWebview, TikTok, WhatsApp
// WebView — a real reading channel in Indonesia) must stay untouched.
// Note: "yandexbot" not "yandex" so the real Yandex Browser is not filtered.
const BOT_UA_RE = /googlebot|google-inspectiontool|googleother|google-read-aloud|google-site-verification|mediapartners|adsbot|bingbot|bingpreview|slurp|duckduckbot|yandexbot|baiduspider|sogou|exabot|ia_archiver|archive\.org|semrush|ahrefs|mj12bot|dotbot|petalbot|ccbot|gptbot|claudebot|anthropic-ai|bytespider|amazonbot|facebookexternalhit|facebot|twitterbot|linkedinbot|pinterestbot|telegrambot|discordbot|slackbot|headlesschrome|phantomjs|seositecheckup|sitecheckerpro|uptimerobot|pingdom|newrelic|datadog|statuscake|curl\/|wget\/|python-requests|python-urllib|python-httpx|okhttp|go-http-client|libwww-perl|scrapy|feedfetcher|feedburner|rss\/|feedparser|spider|crawler|bot\/|_bot/i;

// Sessions whose completed page_depth >= 10 are treated as automated crawls.
// Reading 10+ pages in a single session is physically implausible for a human
// on a content site; real sessions in this dataset never exceed ~5 pages.
const AUTOMATED_PAGE_DEPTH = 10;

function isBotUserAgent(userAgent) {
  return BOT_UA_RE.test(String(userAgent || ''));
}

// Collect session ids flagged as automated (from session_end page_depth).
function findAutomatedSessionIds(documents) {
  const automated = new Set();
  documents.forEach(doc => {
    if (doc.event_type === 'session_end' && doc.session &&
        typeof doc.session.page_depth === 'number' &&
        doc.session.page_depth >= AUTOMATED_PAGE_DEPTH) {
      if (doc.session_id) automated.add(doc.session_id);
    }
  });
  return automated;
}

// Remove bot/crawler traffic before aggregation so metrics (sessions, engagement,
// pages/session, peak hours) reflect real visitors only.
function filterTrafficDocuments(documents) {
  const stats = {
    total_docs: documents.length,
    bot_ua_events: 0,
    bot_ua_sessions: 0,
    automated_sessions: 0,
    automated_session_events: 0,
    sessions_removed: 0,
    docs_after_filter: 0
  };

  const botUaDocs = documents.filter(d => isBotUserAgent(d.user_agent));
  const botUaSessionIds = new Set(botUaDocs.map(d => d.session_id).filter(Boolean));
  const automatedSessionIds = findAutomatedSessionIds(documents);
  const removedSessionIds = new Set([...botUaSessionIds, ...automatedSessionIds]);

  stats.bot_ua_events = botUaDocs.length;
  stats.bot_ua_sessions = botUaSessionIds.size;
  stats.automated_sessions = automatedSessionIds.size;
  stats.automated_session_events = documents.filter(d => automatedSessionIds.has(d.session_id)).length;
  stats.sessions_removed = removedSessionIds.size;

  const clean = documents.filter(d =>
    !removedSessionIds.has(d.session_id) &&
    // events without a session id can't be session-filtered; drop them when UA is bot-like
    !(!d.session_id && isBotUserAgent(d.user_agent))
  );
  stats.docs_after_filter = clean.length;

  return { clean, stats };
}

async function collectTrafficData() {
  if (!MONGO_URI) {
    console.error('Error: MONGO_URI not set in .env');
    process.exit(1);
  }

  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGO_URI, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });

    await client.connect();
    console.log(`Connected to ${MONGO_DB}.${MONGO_COLLECTION}`);

    const db = client.db(MONGO_DB);
    const collection = db.collection(MONGO_COLLECTION);

    // Get all documents for the target host (sorted by date, newest first)
    const documents = await collection
      .find({ host: TARGET_HOST })
      .sort({ event_time: -1 })
      .limit(10000) // Limit to recent data
      .toArray();

    console.log(`Found ${documents.length} records for ${TARGET_HOST}`);
    
    // Debug: show sample documents
    if (documents.length > 0) {
      console.log(`Sample doc: user=${documents[0].user}, session=${documents[0].session_id}, time=${documents[0].event_time}`);
    }

    if (documents.length === 0) {
      console.warn(`No data found for host ${TARGET_HOST} in ${MONGO_DB}.${MONGO_COLLECTION}`);
      // Never overwrite the last good dataset with empty/mock data.
      if (fs.existsSync(OUTPUT_FILE)) {
        try {
          const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
          if (existing.summary && existing.summary.total_sessions > 0) {
            console.warn('Preserving existing traffic.json (last good data) instead of overwriting with empty data.');
            if (existing.collected_at) {
              const ageDays = (Date.now() - new Date(existing.collected_at).getTime()) / 86400000;
              if (ageDays > 7) {
                console.warn(`NOTE: preserved traffic.json is ${Math.round(ageDays)} days old — ingestion may be down.`);
              }
            }
            return null;
          }
        } catch (e) {
          console.warn('Existing traffic.json unreadable, will regenerate mock structure.');
        }
      }
      return generateMockTrafficData();
    }

    // Aggregate traffic metrics
    const trafficData = aggregateTrafficData(documents);

    if (trafficData.filter_stats) {
      const s = trafficData.filter_stats;
      console.log(`  Filter: removed ${s.total_docs - s.docs_after_filter} bot/crawler events ` +
        `(bot_ua_events=${s.bot_ua_events}, automated_sessions=${s.automated_sessions}, ` +
        `sessions_removed=${s.sessions_removed})`);
    }
    
    return trafficData;
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

function aggregateTrafficData(documents) {
  // Strip bot/crawler traffic first so every metric below is human-only.
  const { clean: filteredDocuments, stats: filterStats } = filterTrafficDocuments(documents);
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Current period (last 30 days)
  const currentPeriodDocs = filteredDocuments.filter(doc => {
    const docTime = new Date(doc.event_time);
    return docTime >= thirtyDaysAgo;
  });

  // Previous period (30-60 days ago)
  const previousPeriodDocs = filteredDocuments.filter(doc => {
    const docTime = new Date(doc.event_time);
    return docTime >= sixtyDaysAgo && docTime < thirtyDaysAgo;
  });

  // Calculate metrics for current period
  const currentMetrics = calculateMetrics(currentPeriodDocs);
  const previousMetrics = calculateMetrics(previousPeriodDocs);

  // Calculate trend
  const trend = {
    users_change: previousMetrics.unique_users > 0 
      ? (currentMetrics.unique_users - previousMetrics.unique_users) / previousMetrics.unique_users 
      : 0,
    sessions_change: previousMetrics.sessions > 0
      ? (currentMetrics.sessions - previousMetrics.sessions) / previousMetrics.sessions
      : 0,
    engagement_time_change: previousMetrics.avg_engagement_time > 0
      ? (currentMetrics.avg_engagement_time - previousMetrics.avg_engagement_time) / previousMetrics.avg_engagement_time
      : 0,
    bounce_rate_change: previousMetrics.bounce_rate > 0
      ? (currentMetrics.bounce_rate - previousMetrics.bounce_rate) / previousMetrics.bounce_rate
      : 0
  };

  // Extract top landing pages
  const pageMetrics = aggregatePageMetrics(currentPeriodDocs);
  const topPages = pageMetrics
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 8);

  // Extract traffic sources
  const sourceMetrics = aggregateSourceMetrics(currentPeriodDocs);
  const totalSessions = currentMetrics.sessions;
  const trafficSources = sourceMetrics
    .map(source => ({
      source: formatSourceName(source.source),
      sessions: source.sessions,
      percentage: totalSessions > 0 ? source.sessions / totalSessions : 0
    }))
    .sort((a, b) => b.sessions - a.sessions);

  // Extract country distribution
  const countryMetrics = aggregateCountryMetrics(currentPeriodDocs);
  const countryDistribution = countryMetrics
    .map(country => ({
      country: country.country,
      sessions: country.sessions,
      percentage: totalSessions > 0 ? country.sessions / totalSessions : 0
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);

  // Extract device distribution
  const deviceMetrics = aggregateDeviceMetrics(currentPeriodDocs);
  const deviceDistribution = deviceMetrics
    .map(device => ({
      device: device.device || 'Unknown',
      sessions: device.sessions,
      avg_engagement_time: device.avg_engagement_time || 0,
      percentage: totalSessions > 0 ? device.sessions / totalSessions : 0
    }))
    .sort((a, b) => b.sessions - a.sessions);

  // Reading depth (scroll behavior)
  const reading = aggregateReadingMetrics(currentPeriodDocs);

  // Top clicked elements (unique sessions per element)
  const topClicks = aggregateClickMetrics(currentPeriodDocs);

  // Views by hour of day (UTC)
  const viewsByHour = aggregateHourlyViews(currentPeriodDocs);

  return {
    collected_at: new Date().toISOString(),
    period: {
      start: formatDate(thirtyDaysAgo),
      end: formatDate(now)
    },
    daily_trend: aggregateDailyTrend(currentPeriodDocs),
    summary: {
      total_users: currentMetrics.unique_users,
      total_sessions: currentMetrics.sessions,
      avg_engagement_time: Math.round(currentMetrics.avg_engagement_time),
      bounce_rate: currentMetrics.bounce_rate,
      returning_users: currentMetrics.returning_users,
      avg_pages_per_session: currentMetrics.avg_pages_per_session
    },
    previous_period: {
      total_users: previousMetrics.unique_users,
      total_sessions: previousMetrics.sessions,
      avg_engagement_time: Math.round(previousMetrics.avg_engagement_time),
      bounce_rate: previousMetrics.bounce_rate
    },
    trend,
    traffic_sources: trafficSources,
    top_landing_pages: topPages,
    country_distribution: countryDistribution,
    device_distribution: deviceDistribution,
    reading,
    top_clicks: topClicks,
    views_by_hour: viewsByHour,
    filter_stats: filterStats
  };
}

function calculateMetrics(documents) {
  if (documents.length === 0) {
    return {
      unique_users: 0,
      sessions: 0,
      avg_engagement_time: 0,
      bounce_rate: 0,
      returning_users: 0,
      avg_pages_per_session: 0
    };
  }

  const users = new Set();
  const sessions = new Set();
  const userSessionMap = new Map(); // user -> Set of sessions
  const sessionEvents = new Map(); // session_id -> list of events
  
  let totalEngagementTime = 0;
  let legacyBounceCount = 0; // fallback bounce: sessions with <= 1 event
  let sessionEndCount = 0;   // real bounce source: session_end events
  let bounceCount = 0;       // session_end with duration < 30s AND page_depth <= 1
  let pageDepthSum = 0;
  let pageDepthSessions = 0;
  let processedDocs = 0;

  // Process documents
  documents.forEach(doc => {
    const userId = doc.user;
    const sessionId = doc.session_id;
    
    if (userId) {
      users.add(userId);
      processedDocs++;
      
      // Track sessions per user
      if (!userSessionMap.has(userId)) {
        userSessionMap.set(userId, new Set());
      }
      userSessionMap.get(userId).add(sessionId);
    }

    if (sessionId) {
      sessions.add(sessionId);
      
      // Track events per session for engagement calculation
      if (!sessionEvents.has(sessionId)) {
        sessionEvents.set(sessionId, []);
      }
      sessionEvents.get(sessionId).push(doc);
    }

    // Real session signals from session_end events (duration, page depth)
    if (doc.event_type === 'session_end' && doc.session) {
      const duration = doc.session.duration;
      const pageDepth = doc.session.page_depth;
      if (typeof duration === 'number') {
        sessionEndCount++;
        if (duration < 30 && typeof pageDepth === 'number' && pageDepth <= 1) {
          bounceCount++;
        }
      }
      if (typeof pageDepth === 'number') {
        pageDepthSum += pageDepth;
        pageDepthSessions++;
      }
    }
  });

  // Calculate engagement time and bounce rate per session
  sessionEvents.forEach((events, sessionId) => {
    if (events.length === 0) return;

    // Calculate session engagement time (time span from first to last event)
    const eventTimes = events
      .map(e => new Date(e.event_time).getTime())
      .filter(t => !isNaN(t));
    
    if (eventTimes.length > 0) {
      const minTime = Math.min(...eventTimes);
      const maxTime = Math.max(...eventTimes);
      const engagementMs = maxTime - minTime;
      totalEngagementTime += engagementMs / 1000; // Convert to seconds
    }

    // Legacy bounce fallback (sessions with only 1 event)
    if (events.length <= 1) {
      legacyBounceCount++;
    }
  });

  // Count returning users (users with more than 1 session)
  let returningUsers = 0;
  userSessionMap.forEach(userSessions => {
    if (userSessions.size > 1) {
      returningUsers++;
    }
  });

  // Prefer the real session_end based bounce rate; fall back to legacy definition.
  // Note: the denominator is completed sessions only (session_end events), so sessions
  // that never fire session_end (e.g. short abandons) are not counted — slight understatement.
  const bounceRate = sessionEndCount > 0
    ? bounceCount / sessionEndCount
    : (sessions.size > 0 ? legacyBounceCount / sessions.size : 0);

  console.log(`  Metrics: processed=${processedDocs}, users=${users.size}, sessions=${sessions.size}, session_ends=${sessionEndCount}, bounces=${bounceCount}`);

  return {
    unique_users: users.size,
    sessions: sessions.size,
    avg_engagement_time: sessions.size > 0 ? totalEngagementTime / sessions.size : 0,
    bounce_rate: bounceRate,
    returning_users: returningUsers,
    avg_pages_per_session: pageDepthSessions > 0 ? Math.round((pageDepthSum / pageDepthSessions) * 10) / 10 : 0
  };
}

function aggregatePageMetrics(documents) {
  const pageMap = new Map();

  documents.forEach(doc => {
    const page = doc.page_path || doc.page || '/';
    // Normalize page path (remove domain)
    const normalizedPage = page.replace(/^https?:\/\/[^\/]+/, '') || '/';
    
    if (!pageMap.has(normalizedPage)) {
      pageMap.set(normalizedPage, {
        page: normalizedPage,
        sessions: new Set(),
        total_engagement_time: 0,
        count: 0
      });
    }

    const metric = pageMap.get(normalizedPage);
    metric.sessions.add(doc.session_id);
    metric.total_engagement_time += 0; // Engagement time calculated per session
    metric.count++;
  });

  // Calculate per-session engagement time for pages
  const pageEngagementMap = new Map();
  documents.forEach(doc => {
    const normalizedPage = (doc.page_path || doc.page || '/').replace(/^https?:\/\/[^\/]+/, '') || '/';
    const sessionId = doc.session_id;
    const key = `${normalizedPage}|${sessionId}`;
    
    if (!pageEngagementMap.has(key)) {
      pageEngagementMap.set(key, []);
    }
    pageEngagementMap.get(key).push(new Date(doc.event_time).getTime());
  });

  return Array.from(pageMap.values()).map(m => {
    // Calculate avg engagement per session on this page
    let totalEngagement = 0;
    m.sessions.forEach(sessionId => {
      for (const [key, times] of pageEngagementMap) {
        if (key.startsWith(m.page + '|' + sessionId)) {
          const minTime = Math.min(...times);
          const maxTime = Math.max(...times);
          totalEngagement += (maxTime - minTime) / 1000; // seconds
        }
      }
    });

    return {
      page: m.page,
      sessions: m.sessions.size,
      avg_engagement_time: m.sessions.size > 0 ? Math.round(totalEngagement / m.sessions.size) : 0
    };
  });
}

function aggregateSourceMetrics(documents) {
  const sourceMap = new Map();
  const sessionSources = new Map(); // Track unique sessions per source

  documents.forEach(doc => {
    // Use attribution first_touch for more accurate source attribution
    let source = doc.utm_source || (doc.attribution?.first_touch?.source);
    
    // Normalize source names
    if (!source || source === 'none' || source === '' || source === 'direct' || source === '(direct)') {
      source = 'Direct';
    } else if (source.toLowerCase().includes('google')) {
      source = 'Google Organic';
    } else if (source.toLowerCase().includes('github')) {
      source = 'GitHub';
    } else if (source.toLowerCase().includes('twitter') || source.toLowerCase().includes('x.com') || source === 'x') {
      source = 'Twitter/X';
    } else if (source.toLowerCase().includes('linkedin')) {
      source = 'LinkedIn';
    } else {
      // Capitalize first letter
      source = source.charAt(0).toUpperCase() + source.slice(1).toLowerCase();
    }

    if (!sourceMap.has(source)) {
      sourceMap.set(source, new Set());
    }
    // Track unique sessions for this source
    sourceMap.get(source).add(doc.session_id);
  });

  // Convert to session counts
  const results = Array.from(sourceMap.entries())
    .map(([source, sessions]) => ({ source, sessions: sessions.size }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);

  return results;
}

function aggregateCountryMetrics(documents) {
  const countryMap = new Map();
  const sessionCountries = new Map(); // Track unique sessions per country

  documents.forEach(doc => {
    const countryCode = doc.user_country_code || 'Unknown';
    const countryName = getCountryName(countryCode);
    
    if (!countryMap.has(countryName)) {
      countryMap.set(countryName, new Set());
    }
    // Track unique sessions for this country
    countryMap.get(countryName).add(doc.session_id);
  });

  // Convert to session counts
  return Array.from(countryMap.entries())
    .map(([country, sessions]) => ({ country, sessions: sessions.size }))
    .sort((a, b) => b.sessions - a.sessions);
}

// Country code to name mapping
function getCountryName(code) {
  const countryMap = {
    'ID': 'Indonesia',
    'US': 'United States',
    'SG': 'Singapore',
    'DE': 'Germany',
    'JP': 'Japan',
    'IN': 'India',
    'CN': 'China',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'PH': 'Philippines',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'GB': 'United Kingdom',
    'FR': 'France',
    'AU': 'Australia',
    'NZ': 'New Zealand',
    'CA': 'Canada',
    'KR': 'South Korea',
    'SG': 'Singapore'
  };

  return countryMap[code?.toUpperCase()] || code || 'Unknown';
}

function aggregateDeviceMetrics(documents) {
  const deviceMap = new Map(); // device -> Set(session_id)
  const sessionTimes = new Map(); // session_id -> [event timestamps]

  documents.forEach(doc => {
    let device = 'Unknown';
    if (doc.device_type) {
      // Normalize device type
      const type = doc.device_type.toLowerCase();
      if (type.includes('mobile')) device = 'Mobile';
      else if (type.includes('tablet')) device = 'Tablet';
      else if (type.includes('desktop')) device = 'Desktop';
      else device = doc.device_type.charAt(0).toUpperCase() + doc.device_type.slice(1);
    }

    if (!deviceMap.has(device)) {
      deviceMap.set(device, new Set());
    }
    // Track unique sessions for this device
    if (doc.session_id) {
      deviceMap.get(device).add(doc.session_id);
      if (!sessionTimes.has(doc.session_id)) {
        sessionTimes.set(doc.session_id, []);
      }
      const t = new Date(doc.event_time).getTime();
      if (!isNaN(t)) sessionTimes.get(doc.session_id).push(t);
    }
  });

  // Convert to per-device session counts + real avg engagement time
  return Array.from(deviceMap.entries())
    .map(([device, sessions]) => {
      let totalEngagement = 0;
      sessions.forEach(sessionId => {
        const times = sessionTimes.get(sessionId) || [];
        if (times.length > 1) {
          totalEngagement += (Math.max(...times) - Math.min(...times)) / 1000;
        }
      });
      return {
        device,
        sessions: sessions.size,
        avg_engagement_time: sessions.size > 0 ? Math.round(totalEngagement / sessions.size) : 0
      };
    })
    .sort((a, b) => b.sessions - a.sessions);
}

function aggregateReadingMetrics(documents) {
  // Global reading depth from session_end (one max_scroll per completed session)
  const sessionScrolls = [];
  // Per-page reading depth from scroll_depth events (max depth per session+page)
  const pageScrolls = new Map(); // page -> Map(session -> max depth)

  documents.forEach(doc => {
    if (doc.event_type === 'session_end' && doc.session && typeof doc.session.max_scroll === 'number') {
      sessionScrolls.push(doc.session.max_scroll);
    }
    if (doc.event_type === 'scroll_depth' && doc.scroll && typeof doc.scroll.depth === 'number') {
      const page = (doc.page_path || doc.page || '/').replace(/^https?:\/\/[^\/]+/, '') || '/';
      const sessionId = doc.session_id || 'unknown';
      if (!pageScrolls.has(page)) pageScrolls.set(page, new Map());
      const sessionMap = pageScrolls.get(page);
      sessionMap.set(sessionId, Math.max(sessionMap.get(sessionId) || 0, doc.scroll.depth));
    }
  });

  const n = sessionScrolls.length;
  const avgMaxScroll = n > 0 ? sessionScrolls.reduce((a, b) => a + b, 0) / n : 0;
  const deepReadPct = n > 0 ? sessionScrolls.filter(d => d >= 75).length / n : 0;

  // Depth buckets: share of sessions whose max scroll fell in each band.
  // "75-100%" uses >= 75 so it matches deep_read_pct exactly (no gap at the boundary).
  const depthBuckets = [
    { label: '0-25%', pct: 0 },
    { label: '25-50%', pct: 0 },
    { label: '50-75%', pct: 0 },
    { label: '75-100%', pct: 0 }
  ];
  if (n > 0) {
    depthBuckets[0].pct = sessionScrolls.filter(d => d <= 25).length / n;
    depthBuckets[1].pct = sessionScrolls.filter(d => d > 25 && d <= 50).length / n;
    depthBuckets[2].pct = sessionScrolls.filter(d => d > 50 && d < 75).length / n;
    depthBuckets[3].pct = sessionScrolls.filter(d => d >= 75).length / n;
  }

  // Top pages by reading depth (pages with the most scrolling sessions)
  const topPages = Array.from(pageScrolls.entries())
    .map(([page, sessionMap]) => {
      const depths = Array.from(sessionMap.values());
      const count = depths.length;
      return {
        page,
        sessions: count,
        avg_max_scroll: Math.round(depths.reduce((a, b) => a + b, 0) / count),
        deep_read_pct: depths.filter(d => d >= 75).length / count
      };
    })
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 8);

  return {
    avg_max_scroll: Math.round(avgMaxScroll),
    deep_read_pct: Math.round(deepReadPct * 1000) / 1000,
    sessions: n,
    depth_buckets: depthBuckets,
    top_pages: topPages
  };
}

function aggregateClickMetrics(documents) {
  const elementSessions = new Map(); // click_text -> Set(session_id)

  documents.forEach(doc => {
    if (doc.event_type !== 'click') return;
    const text = (doc.click_text || '').trim();
    if (!text || !doc.session_id) return;
    if (!elementSessions.has(text)) elementSessions.set(text, new Set());
    elementSessions.get(text).add(doc.session_id);
  });

  return Array.from(elementSessions.entries())
    .map(([element, sessions]) => ({ element, sessions: sessions.size }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10);
}

// event_time is stored as UTC (no timezone suffix). Parse it explicitly as UTC so
// bucketing is identical no matter which timezone the collector runs in.
function parseEventTime(value) {
  if (!value) return null;
  const raw = String(value);
  return new Date(raw.endsWith('Z') || raw.includes('+') ? raw : raw + 'Z');
}

function aggregateHourlyViews(documents) {
  const hours = new Array(24).fill(0);

  documents.forEach(doc => {
    if (doc.event_type !== 'view' || !doc.event_time) return;
    const t = parseEventTime(doc.event_time);
    const h = t ? t.getUTCHours() : NaN;
    if (!isNaN(h)) hours[h]++;
  });

  return hours.map((views, hour) => ({ hour, views }));
}

function aggregateDailyTrend(documents) {
  const dayMap = new Map();

  documents.forEach(doc => {
    if (!doc.event_time) return;
    const t = parseEventTime(doc.event_time);
    if (!t || isNaN(t.getTime())) return;
    const day = t.toISOString().split('T')[0];
    if (!dayMap.has(day)) dayMap.set(day, { users: new Set(), sessions: new Set() });
    const entry = dayMap.get(day);
    if (doc.user) entry.users.add(doc.user);
    if (doc.session_id) entry.sessions.add(doc.session_id);
  });

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({
      date,
      users: d.users.size,
      sessions: d.sessions.size
    }));
}

function formatSourceName(source) {
  const nameMap = {
    'google': 'Google Organic',
    'direct': 'Direct',
    'github': 'GitHub',
    'twitter': 'Twitter/X',
    'x': 'Twitter/X',
    'linkedin': 'LinkedIn'
  };

  const key = source.toLowerCase();
  return nameMap[key] || source;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function generateMockTrafficData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    collected_at: now.toISOString(),
    period: {
      start: formatDate(thirtyDaysAgo),
      end: formatDate(now)
    },
    daily_trend: [],
    summary: {
      total_users: 0,
      total_sessions: 0,
      avg_engagement_time: 0,
      bounce_rate: 0,
      returning_users: 0,
      avg_pages_per_session: 0
    },
    previous_period: {
      total_users: 0,
      total_sessions: 0,
      avg_engagement_time: 0,
      bounce_rate: 0
    },
    trend: {
      users_change: 0,
      sessions_change: 0,
      engagement_time_change: 0,
      bounce_rate_change: 0
    },
    traffic_sources: [],
    top_landing_pages: [],
    country_distribution: [],
    device_distribution: [],
    reading: {
      avg_max_scroll: 0,
      deep_read_pct: 0,
      sessions: 0,
      depth_buckets: [
        { label: '0-25%', pct: 0 },
        { label: '25-50%', pct: 0 },
        { label: '50-75%', pct: 0 },
        { label: '75-100%', pct: 0 }
      ],
      top_pages: []
    },
    top_clicks: [],
    views_by_hour: Array.from({ length: 24 }, (_, hour) => ({ hour, views: 0 })),
    filter_stats: {
      total_docs: 0,
      bot_ua_events: 0,
      bot_ua_sessions: 0,
      automated_sessions: 0,
      automated_session_events: 0,
      sessions_removed: 0,
      docs_after_filter: 0
    }
  };
}

async function main() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log(`Collecting traffic data from kmstrack for ${TARGET_HOST}...`);
    const trafficData = await collectTrafficData();

    if (trafficData === null) {
      console.log('⚠ Skipped writing traffic.json (no new data, previous dataset preserved).');
      process.exit(0);
    }

    // Write to file
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(trafficData, null, 2),
      'utf-8'
    );

    console.log(`✓ Traffic data saved to ${OUTPUT_FILE}`);
    console.log(`  Summary: ${trafficData.summary.total_users} users, ${trafficData.summary.total_sessions} sessions`);

  } catch (error) {
    console.error('Error collecting traffic data:', error.message);
    process.exit(1);
  }
}

main();
