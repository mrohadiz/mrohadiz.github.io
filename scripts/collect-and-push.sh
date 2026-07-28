#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
LOG_DIR="data/observatory/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/collect-$(date +%Y%m%d-%H%M).log"

exec 1> >(tee -a "$LOG_FILE") 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] === Observatory Collection Start ==="

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collecting traffic data from kmstrack..."
node scripts/collectors/kmstrack-collector.js

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collecting GitHub data..."
node scripts/collectors/github-collector.js

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collecting knowledge data..."
node scripts/collectors/knowledge-collector.js

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Generating insights..."
node scripts/collectors/insights-generator.js

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Staging changes..."
git add data/observatory/

if git diff --staged --quiet; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] No changes to commit."
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Committing and pushing..."
  git commit -m "chore: update observatory data $(date +%Y-%m-%d)"
  git push
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Done."
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] === Observatory Collection Complete ==="
