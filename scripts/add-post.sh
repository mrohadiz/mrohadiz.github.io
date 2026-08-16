#!/usr/bin/env bash
#
# add-post.sh — Create a new Jekyll post for Digital Garden
#
# Usage:
#   ./scripts/add-post.sh                           # Interactive mode
#   ./scripts/add-post.sh -t "Judul Artikel" -c "AI Engineering"
#   ./scripts/add-post.sh --help
#
# Options:
#   -t, --title     Post title (required if not interactive)
#   -c, --category  Category name (required if not interactive)
#   --tags          Comma-separated tags, e.g. "ai, architecture, governance"
#   -e, --excerpt   Short description for listing pages
#   -d, --date      Date in YYYY-MM-DD format (default: today)
#   --series        Series name (e.g. "goal-setting")
#   --slug          Custom slug (default: auto-generated from title)
#   --no-og         Skip OG image generation prompt
#   --open          Open file with $EDITOR after creation
#   --stdout        Print file content to stdout instead of writing
#   -h, --help      Show this help message
#
# Examples:
#   ./scripts/add-post.sh
#   ./scripts/add-post.sh -t "Pola Arsitektur Microservices" -c "Software Architecture" --tags "microservices,architecture,pattern"
#   ./scripts/add-post.sh -t "Event Sourcing Pattern" -c "Software Architecture" --series "architecture-patterns" --open
#

set -euo pipefail

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POSTS_DIR="${PROJECT_ROOT}/_posts"

# Known categories for validation
KNOWN_CATEGORIES=(
  "AI Engineering"
  "Business Intelligence"
  "Decision Systems"
  "Infrastructure"
  "Software Architecture"
)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ──────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────
usage() {
  sed -n '/^# Usage:/,/^$/p' "${BASH_SOURCE[0]}" | sed 's/^# //g; s/^#$//g'
  exit 0
}

log_info()  { echo -e "${BLUE}ℹ${NC} $*"; }
log_ok()    { echo -e "${GREEN}✓${NC} $*"; }
log_warn()  { echo -e "${YELLOW}⚠${NC} $*"; }
log_error() { echo -e "${RED}✗${NC} $*" >&2; }

# Generate a URL-friendly slug from a title string
slugify() {
  local input="$1"
  # Lowercase, replace non-alphanumeric with hyphens, collapse multiple hyphens, trim
  echo "$input" \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/[^a-z0-9 ]//g' \
    | tr ' ' '-' \
    | sed 's/--*/-/g; s/^-//; s/-$//'
}

# Validate YYYY-MM-DD date format
validate_date() {
  [[ "$1" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || return 1
  date -d "$1" +%Y-%m-%d >/dev/null 2>&1 || return 1
}

# Validate category name
validate_category() {
  local cat="$1"
  for known in "${KNOWN_CATEGORIES[@]}"; do
    [[ "$known" == "$cat" ]] && return 0
  done
  return 1
}

# List known categories with numbers
list_categories() {
  echo ""
  echo "Pilih kategori (masukkan nomor):"
  for i in "${!KNOWN_CATEGORIES[@]}"; do
    printf "  %2d) %s\n" $((i + 1)) "${KNOWN_CATEGORIES[$i]}"
  done
  echo "  0)  Custom (ketik manual)"
  echo ""
}

# Prompt for a value with optional default
prompt() {
  local label="$1"
  local default="${2:-}"
  local hint="${3:-}"

  if [[ -n "$default" ]]; then
    echo -e "${CYAN}${label}${NC} [${default}]${hint}: " >&2
  else
    echo -e "${CYAN}${label}${NC}${hint}: " >&2
  fi
  read -r value
  echo "${value:-$default}"
}

# Generate frontmatter YAML
generate_frontmatter() {
  local title="$1"
  local date="$2"
  local category="$3"
  local tags="$4"
  local excerpt="$5"
  local series="$6"
  local slug="$7"

  cat <<FRONTMATTER
---
layout: article
title: "${title}"
date: ${date}
categories:      - ${category}
$(if [[ -n "$tags" ]]; then
  echo "tags:"
  echo "$tags" | tr ',' '\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | sed 's/^/  - /'
fi)
FRONTMATTER

  if [[ -n "$series" ]]; then
    echo "series: ${series}"
  fi

  if [[ -n "$excerpt" ]]; then
    echo "excerpt: \"${excerpt}\""
  fi

  echo "image: /assets/images/og/${slug}.png"
  echo "---"
  echo ""
  echo "# ${title}"
}

# ──────────────────────────────────────────────
# Argument Parsing
# ──────────────────────────────────────────────
TITLE=""
CATEGORY=""
TAGS=""
EXCERPT=""
DATE=""
SERIES=""
SLUG=""
NO_OG=false
OPEN_EDITOR=false
STDOUT_ONLY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -t|--title)     TITLE="$2";   shift 2 ;;
    -c|--category)  CATEGORY="$2"; shift 2 ;;
    --tags)         TAGS="$2";    shift 2 ;;
    -e|--excerpt)   EXCERPT="$2"; shift 2 ;;
    -d|--date)      DATE="$2";    shift 2 ;;
    --series)       SERIES="$2";  shift 2 ;;
    --slug)         SLUG="$2";    shift 2 ;;
    --no-og)        NO_OG=true;   shift ;;
    --open)         OPEN_EDITOR=true; shift ;;
    --stdout)       STDOUT_ONLY=true; shift ;;
    -h|--help)      usage ;;
    *) log_error "Unknown option: $1"; usage ;;
  esac
done

# ──────────────────────────────────────────────
# Interactive Prompts (if not provided via args)
# ──────────────────────────────────────────────

# Title
if [[ -z "$TITLE" ]]; then
  TITLE=$(prompt "Judul artikel" "" " (wajib)")
  if [[ -z "$TITLE" ]]; then
    log_error "Judul wajib diisi."
    exit 1
  fi
fi

# Date
if [[ -z "$DATE" ]]; then
  DATE=$(prompt "Tanggal" "$(date +%Y-%m-%d)" " (YYYY-MM-DD)")
  if ! validate_date "$DATE" 2>/dev/null; then
    log_warn "Format tanggal tidak valid, menggunakan hari ini."
    DATE=$(date +%Y-%m-%d)
  fi
elif ! validate_date "$DATE" 2>/dev/null; then
  log_error "Format tanggal tidak valid: ${DATE}. Gunakan YYYY-MM-DD."
  exit 1
fi

# Slug
if [[ -z "$SLUG" ]]; then
  auto_slug=$(slugify "$TITLE")
  SLUG=$(prompt "Slug" "$auto_slug" " (URL-friendly name)")
fi
# Re-slugify in case user typed spaces
SLUG=$(slugify "$SLUG")

# Category
if [[ -z "$CATEGORY" ]]; then
  list_categories
  cat_choice=$(prompt "Pilihan" "" " (nomor atau custom)")
  if [[ "$cat_choice" =~ ^[0-9]+$ ]] && (( cat_choice >= 1 && cat_choice <= ${#KNOWN_CATEGORIES[@]} )); then
    CATEGORY="${KNOWN_CATEGORIES[$((cat_choice - 1))]}"
  elif [[ "$cat_choice" == "0" ]]; then
    CATEGORY=$(prompt "Kategori custom" "")
  else
    log_error "Pilihan tidak valid."
    exit 1
  fi
elif ! validate_category "$CATEGORY"; then
  log_warn "Kategori '${CATEGORY}' tidak dikenal. Melanjutkan dengan kategori baru."
fi

# Tags
if [[ -z "$TAGS" ]]; then
  TAGS=$(prompt "Tags" "" " (dipisah koma, misal: ai, architecture, governance)")
fi

# Excerpt
if [[ -z "$EXCERPT" ]]; then
  EXCERPT=$(prompt "Excerpt" "" " (deskripsi singkat)")
fi

# Series
if [[ -z "$SERIES" ]]; then
  SERIES=$(prompt "Series (opsional)" "" " (kosongkan jika tidak series)")
fi

# ──────────────────────────────────────────────
# Build the Post
# ──────────────────────────────────────────────
FILENAME="${DATE}-${SLUG}.md"
FILEPATH="${POSTS_DIR}/${FILENAME}"

# Check if file already exists
if [[ -f "$FILEPATH" ]] && [[ "$STDOUT_ONLY" == false ]]; then
  log_error "File already exists: ${FILENAME}"
  exit 1
fi

CONTENT=$(generate_frontmatter "$TITLE" "$DATE" "$CATEGORY" "$TAGS" "$EXCERPT" "$SERIES" "$SLUG")

# Output or write
if [[ "$STDOUT_ONLY" == true ]]; then
  echo "$CONTENT"
  exit 0
fi

echo "$CONTENT" > "$FILEPATH"
log_ok "Post created: ${FILEPATH}"

# ──────────────────────────────────────────────
# Post-creation Info
# ──────────────────────────────────────────────
echo ""
echo "───────────────────────────────────────────"
echo -e "  ${GREEN}File:${NC}    _posts/${FILENAME}"
echo -e "  ${GREEN}Title:${NC}   ${TITLE}"
echo -e "  ${GREEN}Category:${NC} ${CATEGORY}"
echo -e "  ${GREEN}Tags:${NC}    ${TAGS}"
echo -e "  ${GREEN}Permalink:${NC} /${DATE//-/\/}/${SLUG}/"
echo "───────────────────────────────────────────"
echo ""

# ──────────────────────────────────────────────
# Optional: Generate OG Image
# ──────────────────────────────────────────────
if [[ "$NO_OG" == false ]] && [[ -f "${PROJECT_ROOT}/scripts/generate_og_images.py" ]]; then
  log_info "Menjalankan OG image generator..."
  (cd "$PROJECT_ROOT" && python3 scripts/generate_og_images.py 2>&1) && \
    log_ok "OG image generated: /assets/images/og/${SLUG}.png" || \
    log_warn "OG image generation gagal (mungkin Python environment tidak lengkap)."
fi

# ──────────────────────────────────────────────
# Optional: Update knowledge data
# ──────────────────────────────────────────────
if [[ -f "${PROJECT_ROOT}/scripts/collectors/knowledge-collector.js" ]]; then
  echo ""
  log_info "Update data observatory? (y/n): "
  read -r update_choice
  if [[ "$update_choice" =~ ^[Yy] ]]; then
    log_info "Menjalankan knowledge-collector..."
    (cd "$PROJECT_ROOT" && node scripts/collectors/knowledge-collector.js 2>&1) && \
      log_ok "Knowledge data updated." || \
      log_warn "Knowledge collector gagal."
  fi
fi

# ──────────────────────────────────────────────
# Open in editor
# ──────────────────────────────────────────────
if [[ "$OPEN_EDITOR" == true ]] && [[ -n "${EDITOR:-}" ]]; then
  log_info "Membuka ${FILENAME} dengan ${EDITOR}..."
  $EDITOR "$FILEPATH"
elif [[ "$OPEN_EDITOR" == true ]]; then
  log_info "Setelah selesai, edit file dengan: nano ${FILEPATH}"
fi

echo ""
log_ok "Selesai! Jangan lupa commit dan push."
