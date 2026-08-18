#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
LOG_DIR="data/observatory/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/collect-$(date +%Y%m%d-%H%M).log"

# Ensure node is available under cron (non-login shells don't source nvm)
if ! command -v node >/dev/null 2>&1; then
  for NVM_CANDIDATE in "${NVM_DIR:-$HOME/.config/nvm}" "$HOME/.nvm"; do
    if [ -s "$NVM_CANDIDATE/nvm.sh" ]; then
      # nvm.sh references unset vars; guard against `set -u` aborting the source
      set +u
      . "$NVM_CANDIDATE/nvm.sh"
      set -u
      break
    fi
  done
fi
if ! command -v node >/dev/null 2>&1; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: node not found. Cannot run collectors." >&2
  exit 1
fi

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
  # Integrate remote changes before pushing — otherwise push is rejected whenever
  # the remote has commits we don't have (e.g. articles pushed from another device).
  #
  # Conflict handling for cron: this script only commits generated files under
  # data/observatory/, so on conflict we resolve in favor of the freshly
  # regenerated local data (-X theirs during rebase = local wins). Manual fixes
  # live in the collector scripts (also rebased in), so local data is still
  # regenerated correctly on the next run.
  if ! git pull --rebase --autostash -X theirs origin main 2>&1; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: rebase onto origin/main failed (network or unresolvable conflict)." >&2
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Local commit kept. Resolve manually, then run: git pull --rebase && git push" >&2
    git rebase --abort 2>/dev/null || true
    exit 1
  fi
  git push
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Done."
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] === Observatory Collection Complete ==="
