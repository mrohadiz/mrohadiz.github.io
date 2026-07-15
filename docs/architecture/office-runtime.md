# Office Runtime Architecture

> Decision Freshness over Real-Time.

## Overview

The Digital Garden Observatory uses an **Office Runtime** architecture for data collection. Instead of running on servers or CI/CD pipelines, collectors run on the developer's laptop during business hours.

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Office Runtime (Laptop)           │
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  GSC    │  │  GA4    │  │ GitHub  │    │
│  │Collector│  │Collector│  │Collector│    │
│  └────┬────┘  └────┬────┘  └────┬────┘    │
│       │            │            │          │
│  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐    │
│  │Knowledge│  │KMS Track│  │ Health  │    │
│  │Collector│  │Collector│  │ Monitor │    │
│  └────┬────┘  └────┬────┘  └────┬────┘    │
│       │            │            │          │
│       └────────────┼────────────┘          │
│                    ↓                       │
│            ┌──────────────┐                │
│            │  Publisher   │                │
│            └──────┬───────┘                │
│                   ↓                        │
│         collectors/output/*.json           │
└──────────────────┬──────────────────────────┘
                   ↓
         assets/data/*.json
                   ↓
            Git Commit & Push
                   ↓
┌─────────────────────────────────────────────┐
│            GitHub Pages (Static)            │
│                                             │
│         Observatory Dashboard              │
│         consumes JSON files                │
└─────────────────────────────────────────────┘
```

## Why Office Runtime?

### Decision Freshness vs Real-Time

Traditional monitoring systems emphasize **real-time** data:

| Aspect | Real-Time | Decision Freshness |
|--------|-----------|-------------------|
| Update frequency | Seconds/minutes | 30 minutes |
| Data source | Streaming/batch | Batch collection |
| Infrastructure | Servers, queues, databases | Developer laptop |
| Complexity | High (distributed systems) | Low (single process) |
| Reliability | Depends on uptime SLA | Depends on routine |
| Cost | Infrastructure costs | Free (uses existing laptop) |
| Maintenance | DevOps overhead | Developer runs it |

### Why 30 Minutes?

The Digital Garden evolves on a **daily** timescale, not a **second** timescale:

1. **Articles are published daily** - Not multiple times per minute
2. **Decisions are made daily** - Morning standup, afternoon review
3. **Search trends shift weekly** - Google doesn't update rankings every second
4. **Traffic patterns are hourly** - Diurnal cycles matter, not per-second spikes

30 minutes provides:
- **Fresh enough**: Data is always less than 30 minutes old
- **Batch efficient**: Collect all sources in one run
- **Developer friendly**: Aligns with natural work rhythms

### Why Not GitHub Actions?

GitHub Actions could run collectors on a schedule. We chose not to because:

1. **API credentials**: Service accounts on developer laptop are simpler than GitHub Secrets
2. **MongoDB access**: Office network may require VPN for KMS Track
3. **Iterative development**: Easier to debug, modify, and test locally
4. **No CI minutes**: Free forever, no GitHub Actions billing

## Collector Lifecycle

Every collector follows the same lifecycle:

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ collect() │ → │normalize()│ → │validate()│ → │  save()  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
    ↑                                                    │
    │              ┌──────────────┐                      │
    └──────────────│  Scheduler   │←─────────────────────┘
                   │ (30 min)     │
                   └──────────────┘
```

1. **collect()**: Fetch raw data from external source
   - GSC: Query Search Analytics API
   - GA4: Query GA4 Data API
   - GitHub: Fetch commits, repo info
   - Knowledge: Scan `_posts/` directory
   - KMS Track: Query MongoDB

2. **normalize()**: Transform to standard schema
   - Convert API responses to consistent JSON structure
   - Map field names to observatory schema
   - Handle missing data gracefully

3. **validate()**: Check data integrity
   - Required fields present
   - Values in expected ranges
   - No obvious errors or anomalies

4. **save()**: Write to output directory
   - Write to `collectors/output/{name}.json`
   - Atomic write (temp file + rename)
   - Include `collected_at` timestamp

## Runtime Lifecycle

The Office Runtime manages the overall collection process:

```
┌─────────────────────────────────────────────────┐
│                 Office Runtime                  │
│                                                 │
│  1. Load config.yaml                            │
│  2. Check: Is it working hours?                 │
│     - Monday-Friday                             │
│     - 08:00 - 16:40                             │
│  3. Initialize enabled collectors               │
│  4. For each collector:                         │
│     a. Run lifecycle (collect → save)           │
│     b. Record health status                     │
│  5. Run Insights Generator                      │
│  6. Publish: Copy to assets/data/               │
│  7. Commit & Push to GitHub                     │
│  8. Wait 30 minutes, repeat from step 2         │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Collection Phase

```
External APIs                Office Runtime
─────────────                ──────────────
Search Console API  ──────→  GSC Collector
GA4 Data API       ──────→  GA4 Collector
GitHub REST API    ──────→  GitHub Collector
_posts/ filesystem ──────→  Knowledge Collector
MongoDB            ──────→  KMS Track Collector
                              │
                              ↓
                        collectors/output/
                        ├── search.json
                        ├── traffic.json
                        ├── github.json
                        ├── knowledge.json
                        ├── kmstrack.json
                        └── collector-health.json
```

### Publish Phase

```
collectors/output/         GitHub Pages
─────────────────          ────────────
search.json      ──────→  assets/data/search.json
traffic.json     ──────→  assets/data/traffic.json
github.json      ──────→  assets/data/github.json
knowledge.json   ──────→  assets/data/knowledge.json
insight.json     ──────→  assets/data/insight.json
                         │
                         ↓
                   Git Commit & Push
                         │
                         ↓
                   GitHub Pages Build
                         │
                         ↓
                   Observatory Dashboard
```

## Configuration

Configuration lives in `collectors/config/config.yaml`:

```yaml
collector:
  mode: office
  interval_minutes: 30
  working_days: [monday, tuesday, wednesday, thursday, friday]
  working_hours:
    start: "08:00"
    end: "16:40"

google:
  service_account: "service-account.json"
  search_console:
    site_url: "https://mrohadiz.github.io"
  analytics:
    property_id: ""

mongodb:
  uri: ""
  database: ""

github:
  repository: "mrohadiz.github.io"
```

**Never commit `config.yaml`** - it contains credentials.
Use `config.example.yaml` as a template.

## Error Handling

### Collector Errors

If a collector fails:
1. Log the error with full context
2. Mark collector as unhealthy in `collector-health.json`
3. Continue with other collectors (don't abort the entire run)
4. Generate insight about the failure

### Network Errors

If external APIs are unreachable:
1. Retry with exponential backoff (3 attempts)
2. If still failing, skip this collection cycle
3. Log warning for manual investigation
4. Previous data remains valid until next successful run

### Data Validation Errors

If collected data fails validation:
1. Log validation error details
2. Skip saving this collector's output
3. Previous valid data remains available
4. Alert via health status

## Security

### Credentials

- **Google Service Account JSON**: Stored on developer laptop only
- **MongoDB URI**: Stored in `config.yaml` (gitignored)
- **GitHub Token**: Read from `GITHUB_TOKEN` env var or config

### What's Committed

- `config.example.yaml` (template, no credentials)
- `assets/data/*.json` (public data for GitHub Pages)
- All Python source files

### What's Never Committed

- `config.yaml` (contains credentials)
- `service-account.json` (Google credentials)
- `collectors/cache/` (cached API responses)
- `collectors/logs/` (may contain sensitive info)
- `*.sqlite`, `*.db` (local databases)

## Philosophy

### Decision Freshness

> "Keputusan yang baik lahir dari observasi yang baik."
> (Good decisions are born from good observations.)

The observatory exists to support **human decisions**, not to provide real-time monitoring. This shapes every architectural choice:

- **30-minute intervals**: Fresh enough for daily decisions
- **Batch collection**: Complete data, not streaming fragments
- **Developer laptop**: Simple, reliable, free
- **JSON output**: Static, cacheable, no server needed
- **Observations, not predictions**: What happened, not what will happen

### Minimal Infrastructure

The fewer moving parts, the more reliable the system:

- No servers to maintain
- No databases to backup
- No queues to monitor
- No API gateways to configure
- Just Python scripts on a laptop pushing JSON to GitHub Pages
