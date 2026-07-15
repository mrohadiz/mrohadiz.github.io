#!/usr/bin/env python3
"""
Base Collector for Digital Garden Observatory

Abstract base class for all collectors.
Defines the interface and common functionality.

Each collector must implement:
- collect(): Fetch data from source
- normalize(): Transform to standard schema
- validate(): Check data integrity
- save(): Write to output directory

TODO: Implement in Phase 2
"""

import logging
from abc import ABC, abstractmethod
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class BaseCollector(ABC):
    """
    Abstract base class for all observatory collectors.

    Each collector follows this lifecycle:
    1. collect()    - Fetch raw data from external source
    2. normalize()  - Transform to standard observatory schema
    3. validate()   - Check data integrity and completeness
    4. save()       - Write JSON to collectors/output/

    Usage:
        class MyCollector(BaseCollector):
            def collect(self):
                # Fetch data
                pass
            def normalize(self, raw_data):
                # Transform data
                pass
    """

    def __init__(self, name: str, config: dict = None):
        self.name = name
        self.config = config or {}
        self.output_dir = Path("collectors/output")
        self.cache_dir = Path("collectors/cache")
        self.last_run: Optional[datetime] = None
        self.last_error: Optional[str] = None
        self.logger = logging.getLogger(f"collector.{name}")

    @abstractmethod
    def collect(self) -> Any:
        """Fetch raw data from the external source."""
        pass

    @abstractmethod
    def normalize(self, raw_data: Any) -> dict:
        """Transform raw data to standard observatory schema."""
        pass

    @abstractmethod
    def validate(self, data: dict) -> bool:
        """Validate the collected data for integrity."""
        pass

    def save(self, data: dict, filename: str):
        """Save normalized data as JSON to output directory."""
        # TODO: Implement in Phase 2
        pass

    def run(self) -> bool:
        """Execute the full collector lifecycle."""
        # TODO: Implement in Phase 2
        pass

    def get_status(self) -> dict:
        """Return current collector status."""
        return {
            "name": self.name,
            "last_run": self.last_run.isoformat() if self.last_run else None,
            "last_error": self.last_error,
            "status": "error" if self.last_error else "healthy",
        }
