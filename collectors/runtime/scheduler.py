#!/usr/bin/env python3
"""
Scheduler for Digital Garden Observatory

Manages the 30-minute collection schedule during office hours.

Schedule:
    Monday-Friday
    08:00 - 16:40
    Every 30 minutes

The scheduler ensures collectors only run during business hours
to align with the Decision Freshness philosophy - data needs to be
fresh enough for decisions but doesn't require real-time updates.

TODO: Implement in Phase 2
"""

import logging
from datetime import datetime, time
from typing import Callable, List

logger = logging.getLogger(__name__)

WORKING_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"]
WORKING_HOURS_START = time(8, 0)   # 08:00
WORKING_HOURS_END = time(16, 40)   # 16:40
INTERVAL_MINUTES = 30


class Scheduler:
    """
    Scheduler manages the timing of collector runs.

    Responsibilities:
    - Check if current time is within working hours
    - Determine if it's a working day
    - Schedule next run based on 30-minute intervals
    - Handle manual trigger (workflow_dispatch equivalent)

    Usage:
        scheduler = Scheduler(config)
        if scheduler.should_run_now():
            scheduler.execute(callback)
    """

    def __init__(self, config: dict = None):
        self.config = config or {}
        self.working_days = WORKING_DAYS
        self.start_time = WORKING_HOURS_START
        self.end_time = WORKING_HOURS_END
        self.interval_minutes = INTERVAL_MINUTES
        logger.info("Scheduler initialized: %s-%s every %d min",
                     self.start_time, self.end_time, self.interval_minutes)

    def is_working_day(self, dt: datetime = None) -> bool:
        """Check if the given date is a working day."""
        dt = dt or datetime.now()
        day_name = dt.strftime("%A").lower()
        return day_name in self.working_days

    def is_working_hours(self, dt: datetime = None) -> bool:
        """Check if the current time is within working hours."""
        dt = dt or datetime.now()
        current_time = dt.time()
        return self.start_time <= current_time <= self.end_time

    def should_run_now(self, dt: datetime = None) -> bool:
        """Determine if collectors should run at the current time."""
        dt = dt or datetime.now()
        return self.is_working_day(dt) and self.is_working_hours(dt)

    def get_next_run(self, dt: datetime = None) -> datetime:
        """Calculate the next scheduled run time."""
        # TODO: Implement next run calculation in Phase 2
        pass

    def execute(self, callback: Callable):
        """Execute the callback if it's time to run."""
        # TODO: Implement scheduled execution in Phase 2
        pass
