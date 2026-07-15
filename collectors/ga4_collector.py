#!/usr/bin/env python3
"""
Google Analytics 4 Collector for Digital Garden Observatory

Collects traffic and engagement data from GA4 Data API.

Data collected:
- Users, Sessions, Engagement Time, Bounce Rate
- Traffic Sources (organic, direct, referral, social)
- Top Landing Pages
- Country Distribution
- Device Distribution (Desktop, Mobile, Tablet)
- Returning Users

Authentication:
- Uses Google Service Account JSON
- Service account must have Viewer access in GA4 Property
- Config: google.service_account, google.analytics.property_id

Output: collectors/output/traffic.json, collectors/output/ga4.json

TODO: Implement in Phase 2
"""

import logging
from typing import Any, Dict

from collectors.runtime.base_collector import BaseCollector

logger = logging.getLogger(__name__)


class GA4Collector(BaseCollector):
    """
    Google Analytics 4 Collector

    Fetches traffic and engagement data using the GA4 Data API.
    Requires a Google Cloud Service Account with GA4 Data API enabled.

    API Reference:
    - GA4 Data API: https://developers.google.com/analytics/devguides/reporting/data/v1

    Config keys:
        google.service_account: Path to service account JSON
        google.analytics.property_id: GA4 Property ID
    """

    def __init__(self, config: dict = None):
        super().__init__("ga4_collector", config)
        self.property_id = self.config.get("google", {}).get("analytics", {}).get("property_id", "")
        self.service_account_path = self.config.get("google", {}).get("service_account", "")

    def collect(self) -> Any:
        """
        Fetch analytics data from GA4 Data API.

        Returns raw API response with metrics and dimensions.
        """
        # TODO: Implement API call in Phase 2
        # Use google-analytics-data package
        # Authenticate with service account
        # Query runReport for metrics and dimensions
        pass

    def normalize(self, raw_data: Any) -> dict:
        """
        Transform GA4 API response to standard traffic schema.

        Output schema:
        {
            "collected_at": "ISO datetime",
            "summary": {
                "total_users": int,
                "total_sessions": int,
                "avg_engagement_time": int,
                "bounce_rate": float
            },
            "traffic_sources": [...],
            "top_landing_pages": [...],
            "country_distribution": [...],
            "device_distribution": [...],
            "trend": {...}
        }
        """
        # TODO: Implement normalization in Phase 2
        pass

    def validate(self, data: dict) -> bool:
        """Validate traffic data has required fields and reasonable values."""
        # TODO: Implement validation in Phase 2
        pass
