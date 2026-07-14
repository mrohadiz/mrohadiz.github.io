# SEO Audit — mrohadiz.github.io

**Audited:** 2026-07-14  
**Site:** https://mrohadiz.github.io  
**Author:** M. Rohadiz — Software Architect  
**Stack:** Jekyll 4.3 + GitHub Pages

---

## 1. CONFIGURATION (`_config.yml`)

| Item | Status | Notes |
|------|--------|-------|
| `title` | ✅ Set | "M. Rohadiz" |
| `description` | ⚠️ Weak | Present but lacks primary entity keywords |
| `url` | ✅ Set | https://mrohadiz.github.io |
| `baseurl` | ✅ Set | "" (correct for root) |
| `lang` | ✅ Set | "id" |
| `author` block | ❌ Missing | No structured author name/social in config |
| `title_separator` | ❌ Missing | Not defined |
| `google_analytics` / `ga` | ❌ Missing | Referenced in scripts.html but not configured |
| `timezone` | ❌ Missing | Not set |
| `jekyll-seo-tag` config | ⚠️ Partial | Plugin installed but no `twitter:` block in config |
| `social` block | ❌ Missing | Needed for jekyll-seo-tag |

---

## 2. HEAD.HTML — Meta Tags

| Item | Status | Notes |
|------|--------|-------|
| `charset` | ✅ OK | utf-8 |
| `viewport` | ✅ OK | width=device-width |
| `title` | ✅ OK | Conditional page vs site title |
| `meta description` | ⚠️ Weak | Uses `page.excerpt` fallback OK, but no `page.description` check |
| `canonical` | ❌ Missing | No `<link rel="canonical">` tag |
| `og:type` | ✅ OK | article vs website conditional |
| `og:title` | ✅ OK | |
| `og:description` | ✅ OK | |
| `og:url` | ✅ OK | |
| `og:image` | ❌ Missing | No OG image tag |
| `og:locale` | ✅ OK | |
| `og:site_name` | ✅ OK | |
| `twitter:card` | ✅ OK | summary_large_image |
| `twitter:site` | ❌ Missing | No @username |
| `author meta` | ❌ Missing | No `<meta name="author">` |
| `robots meta` | ❌ Missing | No robots tag |
| `keywords meta` | ❌ Missing | No entity/keyword meta |
| `article:published_time` | ❌ Missing | For article pages |
| `article:modified_time` | ❌ Missing | For article pages |
| DNS prefetch / preconnect | ⚠️ Partial | jsDelivr only; Google Fonts missing |
| Structured data (JSON-LD) | ⚠️ Very Basic | Minimal object, no Person/WebSite/BlogPosting |
| Favicon | ✅ OK | SVG emoji favicon |
| RSS feed link | ✅ OK | Conditional |
| google-site-verification | ✅ OK | Present |
| theme-color | ✅ OK | Dark/light variants |

---

## 3. LAYOUTS

### default.html
- ✅ Proper `lang` attribute on `<html>`
- ✅ `<main id="main-content">` for skip-nav
- ❌ No `<link rel="manifest">` for PWA
- ✅ Includes head.html, navbar.html, footer.html, scripts.html

### article.html
- ✅ `<h1>` present (one per page via `article-title`)
- ✅ `<time datetime>` on date
- ✅ Reading time calculation
- ✅ Prev/Next navigation
- ❌ Feature image missing `loading="lazy"` and `width`/`height`
- ❌ No author card / E-E-A-T element
- ❌ No BreadcrumbList structured data
- ❌ No `last_modified_at` frontmatter in posts

### home.html
- ✅ `<h1>` present
- ✅ Stats section
- ⚠️ Knowledge Domain links all point to `/notes/` — not topic-specific pages
- ❌ Article card images missing `loading="lazy"`
- ❌ No `alt` attribute uniqueness on article images

### page.html
- ✅ `<h1>` present
- ✅ Accepts `description` in frontmatter

---

## 4. CONTENT PAGES

### index.md
- ⚠️ Only has `layout: home` and `title: Beranda` — no description

### about.md
- ✅ Has description
- ⚠️ Description is weak: "Software Architect yang membangun sistem decision intelligence"
- ⚠️ Missing explicit entity mentions for AI Visibility

### now.md
- ✅ Has description
- ⚠️ Minimal SEO value

### robots.txt
- ✅ Present with Jekyll frontmatter `layout: none`
- ✅ `Allow: /`
- ⚠️ `Sitemap: {{ site.url }}/sitemap.xml` — using Liquid but may not render in all scenarios

---

## 5. POSTS

| Issue | Affected Files |
|-------|---------------|
| No `last_modified_at` frontmatter | All 16 posts |
| Some posts have `layout: article` redundant (covered by defaults) | Mixed |
| Inline `# H1` inside content body (duplicates layout H1) | 2026-07-14-smart-passed.md and others |
| No `description` field (uses `excerpt`) | Most posts |

---

## 6. COLLECTIONS

- `_notes/` — exists as directory but is empty
- `_projects/` — not examined but configured

---

## 7. INCLUDES

### footer.html
- ⚠️ Knowledge Domain links all go to `/notes/` — no topic pages exist
- ✅ GitHub/LinkedIn social links

### navbar.html
- ✅ Uses `site.data.nav` data file
- ❌ No `aria-label` on `<nav>` element
- ✅ Mobile menu toggle with aria-label

### notes.html
- ✅ Acts as the notes listing page (used as layout)
- ✅ Tag filter cloud
- ⚠️ Intro text weak for SEO
- ❌ No pagination rel=prev/next links
- ❌ Note: this is a layout file incorrectly structured (has frontmatter but is in _includes)

### scripts.html
- ✅ Scripts use `defer`
- ✅ GA conditional on `site.ga`
- ✅ KreasiAds tracking in head.html

---

## 8. STRUCTURED DATA

Current JSON-LD in head.html:
```json
{
  "@context": "https://schema.org",
  "@type": "Article | WebSite",
  "headline": "...",
  "name": "...",
  "url": "..."
}
```
**Issues:**
- ❌ No Person schema
- ❌ No WebSite with SearchAction
- ❌ BlogPosting schema incomplete (no author, datePublished, etc.)
- ❌ No BreadcrumbList on article pages
- ❌ No CollectionPage for notes index

---

## 9. TECHNICAL SEO

| Item | Status |
|------|--------|
| Sitemap | ✅ Generated by jekyll-sitemap |
| RSS Feed | ✅ Generated by jekyll-feed |
| robots.txt | ✅ Present |
| HTTPS | ✅ Via GitHub Pages |
| Mobile-friendly | ✅ Responsive CSS |
| Page speed | ⚠️ No font-display:swap hint |
| `loading="lazy"` on images | ❌ Missing in layouts |
| Manifest / PWA | ❌ No manifest.json |
| Preconnect Google Fonts | ❌ Missing (fonts loaded via jsDelivr) |

---

## 10. AI VISIBILITY

| Item | Status |
|------|--------|
| Primary entities in description | ⚠️ Partial |
| Primary entities in about.md | ⚠️ Present but not semantically rich |
| `keywords` meta tag | ❌ Missing |
| Consistent entity vocabulary | ⚠️ Mixed language (ID/EN) |
| Person schema with `knowsAbout` | ❌ Missing |
| Topic hub pages | ❌ Missing — all domain cards link to /notes/ |

---

## PRIORITY FIXES

1. **Add `<link rel="canonical">`** to head.html
2. **Add Person + WebSite JSON-LD** structured data
3. **Add complete BlogPosting JSON-LD** on article pages
4. **Create topic hub pages** for each domain
5. **Add `keywords` meta** with entity terms
6. **Add `loading="lazy"`** to images in layouts
7. **Add `author`, `twitter:site`** meta tags
8. **Add author card** (E-E-A-T) to article layout
9. **Update _config.yml** with author block, social, timezone
10. **Update about.md** with stronger entity language
