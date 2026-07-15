#!/usr/bin/env python3
"""
GitHub Collector for Digital Garden Observatory

Collects repository statistics and commit history from GitHub API.

Data collected:
- Total Commits, Contributors
- Publishing Timeline (monthly commit counts)
- Article Publish History (feat: commits)
- Contribution Streak (current, longest, active days)
- Repository Health (issues, PRs, branches, last deployment)

Authentication:
- Uses GITHUB_TOKEN (automatically available in GitHub Actions)
- Or personal access token for local runs
- Config: github.repository

Output: collectors/output/github.json

TODO: Implement in Phase 2
"""

import logging
from typing import Any, Dict

from collectors.runtime.base_collector import BaseCollector

logger = logging.getLogger(__name__)


class GitHubCollector(BaseCollector):
    """
    GitHub Repository Collector

    Fetches repository data using the GitHub REST API.
    Can use GITHUB_TOKEN for authenticated requests (higher rate limits).

    API Reference:
    - Repos: https://docs.github.com/en/rest/repos
    - Commits: https://docs.github.com/en/rest/commits
    - Activity: https://docs.github.com/en/rest/activity

    Config keys:
        github.repository: "owner/repo" format
        github.token: Personal access token (optional for local runs)
    """

    def __init__(self, config: dict = None):
        super().__init__("github_collector", config)
        self.repository = self.config.get("github", {}).get("repository", "")
        self.token = self.config.get("github", {}).get("token", "")

    def collect(self) -> Any:
        """
        Fetch repository data from GitHub API.

        Returns commits, repo info, and activity data.
        """
        # TODO: Implement API call in Phase 2
        # Use requests or httpx
        # Fetch /repos/{owner}/{repo}
        # Fetch /repos/{owner}/{repo}/commits with pagination
        pass

    def normalize(self, raw_data: Any) -> dict:
        """
        Transform GitHub API response to standard publishing schema.

        Output schema:
        {
            "collected_at": "ISO datetime",
            "repository": "owner/repo",
            "summary": {
                "total_commits": int,
                "total_contributors": int,
                "first_commit_date": "ISO date",
                "last_commit_date": "ISO date",
                "active_days": int
            },
            "recent_commits": [...],
            "publishing_timeline": [...],
            "article_history": [...],
            "contribution_streak": {...},
            "repository_health": {...}
        }
        """
        # TODO: Implement normalization in Phase 2
        pass

    def validate(self, data: dict) -> bool:
        """Validate GitHub data has required fields."""
        # TODO: Implement validation in Phase 2
        pass
