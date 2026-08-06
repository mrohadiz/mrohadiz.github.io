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
    
    return trafficData;
  } finally {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

function aggregateTrafficData(documents) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Current period (last 30 days)
  const currentPeriodDocs = documents.filter(doc => {
    const docTime = new Date(doc.event_time);
    return docTime >= thirtyDaysAgo;
  });

  // Previous period (30-60 days ago)
  const previousPeriodDocs = documents.filter(doc => {
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
      percentage: totalSessions > 0 ? device.sessions / totalSessions : 0
    }))
    .sort((a, b) => b.sessions - a.sessions);

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
      returning_users: currentMetrics.returning_users
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
    device_distribution: deviceDistribution
  };
}

function calculateMetrics(documents) {
  if (documents.length === 0) {
    return {
      unique_users: 0,
      sessions: 0,
      avg_engagement_time: 0,
      bounce_rate: 0,
      returning_users: 0
    };
  }

  const users = new Set();
  const sessions = new Set();
  const userSessionMap = new Map(); // user -> Set of sessions
  const sessionEvents = new Map(); // session_id -> list of events
  
  let totalEngagementTime = 0;
  let bounceCount = 0;
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

    // Count bounces (sessions with only 1 or 2 events)
    if (events.length <= 1) {
      bounceCount++;
    }
  });

  // Count returning users (users with more than 1 session)
  let returningUsers = 0;
  userSessionMap.forEach(userSessions => {
    if (userSessions.size > 1) {
      returningUsers++;
    }
  });

  console.log(`  Metrics: processed=${processedDocs}, users=${users.size}, sessions=${sessions.size}`);

  return {
    unique_users: users.size,
    sessions: sessions.size,
    avg_engagement_time: sessions.size > 0 ? totalEngagementTime / sessions.size : 0,
    bounce_rate: sessions.size > 0 ? bounceCount / sessions.size : 0,
    returning_users: returningUsers
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
  const deviceMap = new Map();
  const sessionDevices = new Map(); // Track unique sessions per device

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
    deviceMap.get(device).add(doc.session_id);
  });

  // Convert to session counts
  return Array.from(deviceMap.entries())
    .map(([device, sessions]) => ({ device, sessions: sessions.size }))
    .sort((a, b) => b.sessions - a.sessions);
}

function aggregateDailyTrend(documents) {
  const dayMap = new Map();

  documents.forEach(doc => {
    if (!doc.event_time) return;
    const day = new Date(doc.event_time).toISOString().split('T')[0];
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
      returning_users: 0
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
    device_distribution: []
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
