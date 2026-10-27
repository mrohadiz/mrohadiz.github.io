#!/usr/bin/env python3
"""
Submit URLs to Google Indexing API
"""

import sys
import xml.etree.ElementTree as ET
import requests
from google.oauth2 import service_account
import google.auth.transport.requests

CREDENTIALS_FILE = "collectors/credentials/true-velocity-248506-dae46f740e7f.json"
SITEMAP_URL = "https://www.mrohadiz.my.id/sitemap.xml"
API_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

def get_access_token():
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE,
        scopes=["https://www.googleapis.com/auth/indexing"]
    )
    auth_req = google.auth.transport.requests.Request()
    creds.refresh(auth_req)
    return creds.token

def get_sitemap_urls():
    print(f"Fetching sitemap from {SITEMAP_URL}...")
    resp = requests.get(SITEMAP_URL, timeout=15)
    resp.raise_for_status()
    root = ET.fromstring(resp.content)
    # XML namespace for sitemaps
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [loc.text for loc in root.findall(".//sm:loc", ns) if loc.text]
    print(f"Found {len(urls)} URLs in sitemap.")
    return urls

def submit_url(token, url):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    body = {
        "url": url,
        "type": "URL_UPDATED"
    }
    resp = requests.post(API_ENDPOINT, headers=headers, json=body, timeout=10)
    return resp.status_code, resp.json() if resp.status_code == 200 else resp.text

def main():
    try:
        token = get_access_token()
    except Exception as e:
        print(f"Error loading credentials: {e}")
        sys.exit(1)

    urls = get_sitemap_urls()
    max_urls = 100  # Daily quota is typically 200 URLs
    success = 0
    failed = 0

    print(f"Submitting up to {max_urls} URLs to Google Indexing API...\n")
    for i, url in enumerate(urls[:max_urls], 1):
        status, res = submit_url(token, url)
        if status == 200:
            success += 1
            print(f"[{i}/{len(urls[:max_urls])}] [OK] {url}")
        else:
            failed += 1
            print(f"[{i}/{len(urls[:max_urls])}] [FAIL {status}] {url} -> {res}")
            if "Permission denied" in str(res):
                print("\n[!] Service account requires 'Owner' (Pemilik) permission in Google Search Console.")
                break

    print(f"\nDone: {success} succeeded, {failed} failed.")

if __name__ == "__main__":
    main()
