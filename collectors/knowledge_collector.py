#!/usr/bin/env python3
"""
Knowledge Collector for Digital Garden Observatory

Scans Jekyll posts and generates content knowledge index.

Data collected:
- Total Articles, Categories, Tags, Series
- Internal Links count
- Average Reading Time
- Total Word Count
- Newest Articles (by date)
- Most Updated Articles (by last_modified_at)
- Per-article metadata (title, url, date, category, tags, word_count)

No authentication required - reads local _posts/ directory.

Output: collectors/output/knowledge.json

TODO: Implement in Phase 2
"""

import logging
from pathlib import Path
from typing import Any, Dict, List

from collectors.runtime.base_collector import BaseCollector

logger = logging.getLogger(__name__)


class KnowledgeCollector(BaseCollector):
    """
    Knowledge Scanner Collector

    Scans Jekyll _posts/ directory and extracts article metadata.
    Parses YAML frontmatter, counts words, tracks internal links.

    No external API calls required - reads local filesystem only.

    Config keys: None required (uses project root paths)

    Output files:
        collectors/output/knowledge.json
    """

    def __init__(self, config: dict = None):
        super().__init__("knowledge_collector", config)
        self.posts_dir = Path("_posts")
        self.notes_dir = Path("notes")

    def collect(self) -> Any:
        """
        Scan _posts/ directory and read all markdown files.

        Returns list of (filename, content) tuples.
        """
        # TODO: Implement file scanning in Phase 2
        # Walk _posts/ directory
        # Read each .md file
        # Parse frontmatter
        pass

    def normalize(self, raw_data: Any) -> dict:
        """
        Transform scanned posts to standard knowledge schema.

        Output schema:
        {
            "collected_at": "ISO datetime",
            "summary": {
                "total_articles": int,
                "total_categories": int,
                "total_tags": int,
                "total_series": int,
                "total_internal_links": int,
                "avg_reading_time": int,
                "total_word_count": int
            },
            "categories": [...],
            "tags": [...],
            "articles": [...],
            "newest_articles": [...],
            "most_updated": [...]
        }
        """
        # TODO: Implement normalization in Phase 2
        pass

    def validate(self, data: dict) -> bool:
        """Validate knowledge data integrity."""
        # TODO: Implement validation in Phase 2
        pass

    def _parse_frontmatter(self, content: str) -> dict:
        """Parse YAML frontmatter from markdown content."""
        # TODO: Implement frontmatter parsing in Phase 2
        pass

    def _count_words(self, content: str) -> int:
        """Count words in markdown content (excluding code blocks)."""
        # TODO: Implement word counting in Phase 2
        pass

    def _count_internal_links(self, content: str) -> int:
        """Count internal links in markdown content."""
        # TODO: Implement link counting in Phase 2
        pass
