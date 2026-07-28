#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collecting traffic data from kmstrack..."
node scripts/collectors/kmstrack-collector.js

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Generating insights..."
node scripts/collectors/insights-generator.js

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Staging changes..."
git add data/observatory/traffic.json data/observatory/insights.json

if git diff --staged --quiet; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] No changes to commit."
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Committing and pushing..."
  git commit -m "chore: update observatory data $(date +%Y-%m-%d)"
  git push
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Done."
fi
