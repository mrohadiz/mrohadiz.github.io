#!/usr/bin/env python3
"""
Google Search Console Collector for Digital Garden Observatory

Collects search performance data from Google Search Console API.

Data collected:
- Total Clicks, Impressions, CTR, Average Position
- Top Queries (by clicks)
- Top Pages (by clicks)
- Growing/Declining Queries (period comparison)
- Search Trend (28-day daily)
- Indexed Pages count (approximation: distinct pages with impressions)

Authentication:
- Uses Google Service Account JSON
- Service account must be added as User in Search Console
- Config: google.service_account, google.search_console.site_url

Output: data/observatory/search.json (live observatory data dir)
"""

import json
import logging
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List

from google.oauth2 import service_account
from googleapiclient.discovery import build

from collectors.runtime.base_collector import BaseCollector

logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]


class GSCCollector(BaseCollector):
    """
    Google Search Console Collector

    Fetches search performance data using the Search Console API.
    Requires a Google Cloud Service Account with Search Console API enabled.

    API Reference:
    - Search Analytics: https://developers.google.com/webmaster-tools/search-console-api-original/v3/searchanalytics/query

    Config keys:
        google.service_account: Path to service account JSON
        google.search_console.site_url: Site URL in Search Console
        google.search_console.output_dir: Output dir (default data/observatory)
        google.search_console.output_file: Output filename (default search.json)
    """

    def __init__(self, config: dict = None):
        super().__init__("gsc_collector", config)
        sc = self.config.get("google", {}).get("search_console", {})
        self.site_url = sc.get("site_url", "")
        self.service_account_path = self.config.get("google", {}).get("service_account", "")
        # Output ke data observatory live (dikonsumsi situs via assets/js/observatory.js)
        self.output_dir = Path(sc.get("output_dir", "data/observatory"))
        self.output_filename = sc.get("output_file", "search.json")

    def collect(self) -> dict:
        """
        Fetch search analytics data from Google Search Console.

        Returns raw dict with summary, top queries/pages, growing/declining
        queries, daily trend, and indexed-pages approximation.
        """
        if not self.site_url:
            raise RuntimeError("google.search_console.site_url tidak dikonfigurasi")
        sa_path = Path(self.service_account_path)
        if not self.service_account_path or not sa_path.exists():
            raise RuntimeError(f"Service account tidak ditemukan: {self.service_account_path}")

        credentials = service_account.Credentials.from_service_account_file(
            str(sa_path), scopes=SCOPES
        )
        service = build("searchconsole", "v1", credentials=credentials)

        today = date.today()
        current_start = today - timedelta(days=27)
        current_end = today
        prev_start = today - timedelta(days=55)
        prev_end = today - timedelta(days=28)

        def query(dimensions=None, start=current_start, end=current_end, row_limit=10):
            body = {
                "startDate": start.isoformat(),
                "endDate": end.isoformat(),
                "rowLimit": row_limit,
            }
            if dimensions:
                body["dimensions"] = dimensions
            resp = service.searchanalytics().query(siteUrl=self.site_url, body=body).execute()
            return resp.get("rows", [])

        return {
            "period": {"start": current_start.isoformat(), "end": current_end.isoformat()},
            "current_summary": query(None, current_start, current_end, 1),
            "previous_summary": query(None, prev_start, prev_end, 1),
            "top_queries": query(["query"], current_start, current_end, 10),
            "top_pages": query(["page"], current_start, current_end, 10),
            "current_queries": query(["query"], current_start, current_end, 100),
            "previous_queries": query(["query"], prev_start, prev_end, 100),
            "daily_trend": query(["date"], current_start, current_end, 28),
            "indexed_pages": len(query(["page"], current_start, current_end, 1000)),
        }

    def normalize(self, raw_data: dict) -> dict:
        """
        Transform GSC API response to standard search schema.

        Output schema (match data/observatory/search.json):
        {
            "collected_at": "ISO datetime",
            "period": {"start", "end"},
            "summary": {total_clicks, total_impressions, ctr, avg_position, indexed_pages},
            "previous_period": {total_clicks, total_impressions, ctr, avg_position},
            "trend": {clicks_change, impressions_change, ctr_change, position_change},
            "top_queries": [{query, clicks, impressions, ctr, position}],
            "top_pages": [{page, clicks, impressions, ctr, position}],
            "growing_queries": [{query, current_clicks, previous_clicks, growth}],
            "declining_queries": [{query, current_clicks, previous_clicks, growth}],
            "daily_trend": [{date, clicks, impressions}]
        }
        """
        def metrics(row: dict) -> dict:
            return {
                "clicks": row.get("clicks", 0),
                "impressions": row.get("impressions", 0),
                "ctr": round(row.get("ctr", 0.0), 4),
                "position": round(row.get("position", 0.0), 1),
            }

        def summary(rows: List[dict]) -> dict:
            if not rows:
                return {"total_clicks": 0, "total_impressions": 0, "ctr": 0.0, "avg_position": 0.0}
            row = rows[0]
            return {
                "total_clicks": row.get("clicks", 0),
                "total_impressions": row.get("impressions", 0),
                "ctr": round(row.get("ctr", 0.0), 4),
                "avg_position": round(row.get("position", 0.0), 1),
            }

        def pct(cur, prev):
            return round((cur - prev) / prev, 4) if prev else 0.0

        current = summary(raw_data.get("current_summary", []))
        previous = summary(raw_data.get("previous_summary", []))

        current_q = {r["keys"][0]: r.get("clicks", 0) for r in raw_data.get("current_queries", []) if r.get("keys")}
        previous_q = {r["keys"][0]: r.get("clicks", 0) for r in raw_data.get("previous_queries", []) if r.get("keys")}
        growing, declining = [], []
        for q, cur in current_q.items():
            prev = previous_q.get(q, 0)
            if prev > 0 and cur != prev:
                item = {
                    "query": q,
                    "current_clicks": cur,
                    "previous_clicks": prev,
                    "growth": round((cur - prev) / prev, 4),
                }
                (growing if cur > prev else declining).append(item)
        growing.sort(key=lambda x: x["growth"], reverse=True)
        declining.sort(key=lambda x: x["growth"])

        return {
            "collected_at": datetime.now(timezone.utc).isoformat(),
            "period": raw_data.get("period", {}),
            "summary": {**current, "indexed_pages": raw_data.get("indexed_pages", 0)},
            "previous_period": previous,
            "trend": {
                "clicks_change": pct(current["total_clicks"], previous["total_clicks"]),
                "impressions_change": pct(current["total_impressions"], previous["total_impressions"]),
                "ctr_change": pct(current["ctr"], previous["ctr"]),
                "position_change": pct(current["avg_position"], previous["avg_position"]),
            },
            "top_queries": [
                {"query": r["keys"][0], **metrics(r)} for r in raw_data.get("top_queries", []) if r.get("keys")
            ],
            "top_pages": [
                {"page": r["keys"][0], **metrics(r)} for r in raw_data.get("top_pages", []) if r.get("keys")
            ],
            "growing_queries": growing[:5],
            "declining_queries": declining[:5],
            "daily_trend": [
                {"date": r["keys"][0], "clicks": r.get("clicks", 0), "impressions": r.get("impressions", 0)}
                for r in raw_data.get("daily_trend", [])
                if r.get("keys")
            ],
        }

    def validate(self, data: dict) -> bool:
        """Validate search data has required fields and reasonable values."""
        required = [
            "collected_at", "period", "summary", "previous_period", "trend",
            "top_queries", "top_pages", "growing_queries", "declining_queries", "daily_trend",
        ]
        missing = [k for k in required if k not in data]
        if missing:
            self.logger.error("Field wajib hilang: %s", missing)
            return False
        summary = data.get("summary", {})
        if summary.get("total_clicks", -1) < 0 or summary.get("total_impressions", -1) < 0:
            self.logger.error("Summary bernilai negatif: %s", summary)
            return False
        if not isinstance(data.get("top_queries"), list) or not isinstance(data.get("top_pages"), list):
            self.logger.error("top_queries/top_pages bukan list")
            return False
        return True


def load_config(path: str = "collectors/config/config.yaml") -> dict:
    """Load YAML config from repo root."""
    import yaml

    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    cfg = load_config()
    collector = GSCCollector(cfg)
    ok = collector.run()
    print(json.dumps(collector.get_status(), indent=2))
    sys.exit(0 if ok else 1)
