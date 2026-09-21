#!/usr/bin/env python3
"""Import approved Blogger posts into the Jekyll digital garden.

The script is deliberately conservative: it skips News and out-of-scope posts,
does not overwrite files, preserves the legacy permalink, localizes Blogger
images, and keeps the original body intact except for Blogger-specific markup.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build


ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / "_posts"
IMAGES_DIR = ROOT / "assets" / "images" / "posts"
BLOG_ID = "2985126992586668234"
EXCLUDED_PATHS = {
    "/2024/02/menjelajahi-dunia-pns-panduan-lengkap.html",
    "/2024/02/cara-mengecek-nomor-indosat-mudahnya.html",
}
DUPLICATES = {
    "/2026/01/website-terlihat-error-padahal-server.html": (
        "/2026/07/31/website-terlihat-bermasalah-padahal-website-sehat-studi-kasus-gangguan-akses-device-internal/"
    )
}


def legacy_path(url: str) -> str:
    return urlparse(url).path


def slugify(value: str) -> str:
    value = html.unescape(value).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "post"


def plain_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", html.unescape(value).replace("\xa0", " ")).strip()


def yaml_quote(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def category(labels: list[str], title: str) -> str:
    source = " ".join(labels + [title]).lower()
    if any(term in source for term in (
        "server", "devops", "infrastruktur", "security", "linux", "hosting",
        "docker", "proxmox", "cloudflare", "uptime", "wordpress",
    )):
        return "Infrastructure"
    if any(term in source for term in (
        "digital marketing", "seo", "marketing", "google ads", "iklan", "adtech",
        "cro", "analytics", "tracking", "attribution", "customer",
    )):
        return "Business Intelligence"
    if any(term in source for term in ("ai", "kecerdasan buatan", "llm", "chatgpt", "gemini", "claude")):
        return "AI Engineering"
    return "Software Architecture"


def approved(post: dict, include_review: bool) -> tuple[bool, str]:
    path = legacy_path(post["url"])
    if path in EXCLUDED_PATHS:
        return False, "out-of-scope archive"
    if path in DUPLICATES:
        return False, f"duplicate; redirect to {DUPLICATES[path]}"
    if "News" in post.get("labels", []) and not include_review:
        return False, "News requires editorial review"
    return True, "approved"


def fetch_posts(service) -> list[dict]:
    posts: list[dict] = []
    token = None
    while True:
        response = service.posts().list(
            blogId=BLOG_ID,
            maxResults=500,
            fetchBodies=True,
            status="LIVE",
            pageToken=token,
        ).execute()
        posts.extend(response.get("items", []))
        token = response.get("nextPageToken")
        if not token:
            return posts


def remove_blogger_markup(body: str, title: str) -> str:
    """Keep semantic article HTML while removing Blogger-only clutter."""
    body = re.sub(r"<(script|style|noscript|iframe)\b[^>]*>.*?</\1>", "", body, flags=re.I | re.S)
    body = re.sub(
        r"<a\b(?=[^>]*https?://www\.google\.com/search\?)[^>]*>(.*?)</a>",
        r"\1",
        body,
        flags=re.I | re.S,
    )
    body = re.sub(r"\s(?:data-[\w-]+|style|border|height|width|imageanchor)=(['\"]).*?\1", "", body, flags=re.I | re.S)
    body = body.replace("&nbsp;", " ")
    first = re.match(r"^\s*<p[^>]*>(.*?)</p>\s*(?:<p[^>]*>\s*(?:<br\s*/?>)?\s*</p>\s*)?", body, flags=re.I | re.S)
    if first and plain_text(first.group(1)).casefold() == plain_text(title).casefold():
        body = body[first.end():]
    return body.strip()


def image_urls(body: str) -> list[str]:
    urls: list[str] = []
    for match in re.finditer(r"<img\b[^>]*\bsrc=(['\"])(.*?)\1[^>]*>", body, flags=re.I | re.S):
        url = html.unescape(match.group(2))
        if url.startswith("https://blogger.googleusercontent.com/"):
            urls.append(url)
    return list(dict.fromkeys(urls))


def extension(url: str, content_type: str) -> str:
    guess = Path(urlparse(url).path).suffix.lower()
    if guess in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        return ".jpg" if guess == ".jpeg" else guess
    return {"image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}.get(content_type.split(";", 1)[0], ".jpg")


def localize_images(body: str, slug: str, enabled: bool, dry_run: bool) -> tuple[str, list[str]]:
    local_paths: list[str] = []
    if not enabled:
        return body, local_paths
    if not dry_run:
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    replacements: dict[str, str] = {}
    for index, url in enumerate(image_urls(body), start=1):
        try:
            request = Request(url, headers={"User-Agent": "mrohadiz-jekyll-migration/1.0"})
            with urlopen(request, timeout=30) as response:
                suffix = extension(url, response.headers.get_content_type())
                filename = f"{slug}-{index}{suffix}"
                target = IMAGES_DIR / filename
                if not dry_run:
                    with target.open("wb") as destination:
                        shutil.copyfileobj(response, destination)
                local_url = f"/assets/images/posts/{filename}"
                replacements[url] = "{{ '" + local_url + "' | relative_url }}"
                local_paths.append(local_url)
        except Exception as exc:  # Keep the source URL when an asset cannot be retrieved.
            print(f"WARN image not localized: {url} ({exc})", file=sys.stderr)
    for source, local in replacements.items():
        body = body.replace(source, local)
    return body, local_paths


def front_matter(post: dict, body: str, images: list[str]) -> str:
    labels = [slugify(label) for label in post.get("labels", [])]
    description = plain_text(body)[:165].rstrip(" ,.;:")
    lines = [
        "---",
        "layout: article",
        f"title: {yaml_quote(post['title'])}",
        f"date: {post['published']}",
        f"permalink: {legacy_path(post['url'])}",
        "categories:",
        f"  - {yaml_quote(category(post.get('labels', []), post['title']))}",
        "tags:",
    ]
    lines.extend(f"  - {yaml_quote(label)}" for label in labels)
    if images:
        lines.append(f"image: {yaml_quote(images[0])}")
    lines.extend([
        f"excerpt: {yaml_quote(description)}",
        f"migrated_from: {yaml_quote(post['url'])}",
        "---",
        "",
        "<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->",
        "",
    ])
    return "\n".join(lines)


def destination(post: dict) -> Path:
    published = datetime.fromisoformat(post["published"])
    return POSTS_DIR / f"{published:%Y-%m-%d}-blogger-{slugify(post['title'])}.md"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--token-path", type=Path, required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--include-review", action="store_true", help="also import posts tagged News")
    parser.add_argument("--no-download-images", action="store_true")
    args = parser.parse_args()

    token = json.loads(args.token_path.read_text())
    credentials = Credentials.from_authorized_user_info(token)
    service = build("blogger", "v3", credentials=credentials)
    report = {"created": [], "skipped": [], "existing": []}
    for post in sorted(fetch_posts(service), key=lambda item: item["published"]):
        ok, reason = approved(post, args.include_review)
        if not ok:
            report["skipped"].append({"url": post["url"], "reason": reason})
            continue
        target = destination(post)
        if target.exists():
            report["existing"].append(str(target.relative_to(ROOT)))
            continue
        clean = remove_blogger_markup(post.get("content", ""), post["title"])
        clean, images = localize_images(clean, target.stem, not args.no_download_images, args.dry_run)
        rendered = front_matter(post, clean, images) + clean + "\n"
        if not args.dry_run:
            target.write_text(rendered)
        report["created"].append(str(target.relative_to(ROOT)))
        print(("WOULD CREATE" if args.dry_run else "CREATED") + f" {target.relative_to(ROOT)}")

    report_path = ROOT / "migration-blogger-report.json"
    if not args.dry_run:
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({key: len(value) for key, value in report.items()}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
