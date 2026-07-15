# Digital Garden Observatory - Collectors

> Keputusan yang baik lahir dari observasi yang baik.

## Architecture

```
Office Runtime (Developer Laptop)
    ↓
Collectors (GSC, GA4, GitHub, Knowledge, KMS Track)
    ↓
Normalize (Standard Schema)
    ↓
JSON Output (collectors/output/)
    ↓
Publish (assets/data/)
    ↓
Git Commit & Push
    ↓
GitHub Pages (Fully Static)
```

### Why Office Runtime?

The Digital Garden Observatory uses **Decision Freshness** instead of Real-Time.

Data doesn't need to be instant. It needs to be:
- **Reliable**: Collected from authenticated APIs
- **Complete**: All sources normalized to standard schema
- **Actionable**: Fresh enough for daily decisions

Office Runtime runs on the developer's laptop during business hours:
- Monday-Friday, 08:00-16:40
- Every 30 minutes
- When laptop is on and connected

This is intentional. The observatory is a thinking tool, not a monitoring system.

## Collector Lifecycle

Each collector follows a strict lifecycle:

```
1. collect()    → Fetch raw data from external source
2. normalize()  → Transform to standard observatory schema
3. validate()   → Check data integrity and completeness
4. save()       → Write JSON to collectors/output/
```

This ensures:
- Each collector is independently testable
- Data validation catches issues early
- Output is always valid JSON for GitHub Pages

## Runtime Lifecycle

```
1. Load config       → collectors/config/config.yaml
2. Check schedule    → Is it working hours?
3. Initialize        → Create enabled collectors
4. Run collectors    → Execute lifecycle for each
5. Publish           → Copy JSON to assets/data/
6. Commit            → Stage and commit changes
7. Push              → Push to GitHub repository
8. Wait              → Sleep until next 30-min interval
```

## Output JSON

All collectors write to `collectors/output/`:

| File | Source | Description |
|------|--------|-------------|
| `search.json` | GSC Collector | Search Console performance data |
| `traffic.json` | GA4 Collector | Traffic and engagement metrics |
| `ga4.json` | GA4 Collector | Additional GA4 detailed data |
| `github.json` | GitHub Collector | Repository and commit statistics |
| `knowledge.json` | Knowledge Collector | Article metadata and content index |
| `insight.json` | Insight Engine | Auto-generated observations |
| `collector-health.json` | Health Monitor | Collector status and health |

These files are copied to `assets/data/` for GitHub Pages consumption.

## Collectors

### Google Search Console Collector (`gsc_collector.py`)

**Status**: Placeholder (Phase 2)

Collects:
- Total Clicks, Impressions, CTR, Average Position
- Top Queries and Pages
- Growing/Declining Queries
- Search Trend (30-day rolling)

Requires:
- Google Cloud Service Account
- Search Console API enabled
- Service account added as User in Search Console

### Google Analytics 4 Collector (`ga4_collector.py`)

**Status**: Placeholder (Phase 2)

Collects:
- Users, Sessions, Engagement Time
- Traffic Sources, Device Distribution
- Top Landing Pages, Country Distribution

Requires:
- Google Cloud Service Account (same as GSC)
- GA4 Data API enabled
- Service account added as Viewer in GA4 Property

### GitHub Collector (`github_collector.py`)

**Status**: Placeholder (Phase 2)

Collects:
- Total Commits, Contributors
- Publishing Timeline
- Article Publish History
- Contribution Streak
- Repository Health

Requires:
- GitHub Personal Access Token (for local runs)
- Or GITHUB_TOKEN (in GitHub Actions)

### Knowledge Collector (`knowledge_collector.py`)

**Status**: Placeholder (Phase 2)

Collects:
- Total Articles, Categories, Tags
- Internal Links, Word Count
- Reading Time estimates
- Article metadata

Requires:
- Nothing - reads local `_posts/` directory

### KMS Track Collector (`kmstrack_collector.py`)

**Status**: Placeholder (Phase 2)

Collects:
- Decision logs
- Knowledge entries
- Activity tracking

Requires:
- MongoDB connection URI
- KMS Track database access

## Configuration

Copy `config/config.example.yaml` to `config/config.yaml`:

```bash
cp collectors/config/config.example.yaml collectors/config/config.yaml
```

Edit `config.yaml` with your credentials. **Never commit this file.**

## Setup

### Prerequisites

- Python 3.10+
- pip
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/mrohadiz/mrohadiz.github.io.git
cd mrohadiz.github.io

# Install Python dependencies
pip install -r collectors/requirements.txt  # Phase 2

# Copy configuration
cp collectors/config/config.example.yaml collectors/config/config.yaml

# Edit configuration with your credentials
nano collectors/config/config.yaml
```

### Running Collectors

```bash
# Run all collectors manually
python -m collectors.runtime.runtime

# Run individual collector
python -m collectors.gsc_collector
python -m collectors.ga4_collector
python -m collectors.github_collector
python -m collectors.knowledge_collector
```

## Decision Freshness Philosophy

Traditional monitoring emphasizes **real-time** data.

The Digital Garden Observatory emphasizes **decision freshness**:

| Concept | Real-Time | Decision Freshness |
|---------|-----------|-------------------|
| Update frequency | Seconds/minutes | 30 minutes |
| Data source | Streaming | Batch collection |
| Infrastructure | Servers, queues | Developer laptop |
| Complexity | High | Low |
| Reliability | Depends on uptime | Depends on routine |

Decision Freshness works because:
1. Digital gardens evolve slowly (days/weeks, not seconds)
2. Decisions are made daily, not continuously
3. Batch collection is simpler and more reliable
4. The developer is already working during office hours

## Future Phases

### Phase 2: Collector Implementation
- Implement all collector classes
- Add API authentication
- Add data normalization
- Add data validation

### Phase 3: Insight Engine
- Implement insight generation
- Add trend analysis
- Add anomaly detection
- Add natural language observations

### Phase 4: Dashboard Enhancement
- Add Chart.js visualizations
- Add real-time data binding
- Add responsive improvements
- Add accessibility audit
