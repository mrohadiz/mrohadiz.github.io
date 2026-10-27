# Baseline Review: SEO, GEO, Google Discover & Core Web Vitals
**Tanggal Baseline:** 28 Oktober 2026  
**Domain Target:** `https://www.mrohadiz.my.id`  
**Periode Evaluasi Mendatang:** 
- **Check-in 1 (Minggu ke-2):** ~11 November 2026  
- **Check-in 2 (Minggu ke-4):** ~25 November 2026  

---

## 1. Status Baseline Teknis Hari Ini (28 Oktober 2026)

### A. Core Web Vitals & Lighthouse (Mobile Mode)
Audit dijalankan via Lighthouse CLI emulasi Moto G Power (Chrome headless):
- **Performance:** `98` (sebelumnya ~85)
- **Accessibility:** `100` (sebelumnya 96)
- **Best Practices:** `100`
- **SEO:** `100`
- **First Contentful Paint (FCP):** `1.9s`
- **Largest Contentful Paint (LCP):** `2.0s`
- **Total Blocking Time (TBT):** `0 ms`
- **Cumulative Layout Shift (CLS):** `0.001`
- **Speed Index:** `1.9s`

### B. Indexing & Google Search Console
- **Sitemap XML:** `https://www.mrohadiz.my.id/sitemap.xml` terdaftar di GSC (`isPending: true`, `errors: 0`).
- **Google Indexing API v3:** 196 URL dalam sitemap telah disubmit massal via Service Account dengan status respons HTTP `200 [OK]`.
- **Peta Situs HTML:** `/p/sitemap.html` telah dibuat dan aktif dengan status HTTP `200 [OK]`, menyelesaikan isu 404 pada tautan sitemap lama.
- **Robot Directive:** `<meta name="robots" content="index, follow, max-image-preview:large">` aktif di seluruh halaman publik.

### C. Generative Engine Optimization (GEO) & AI Visibility
- **Machine Context:** File `/llms.txt` berisi 38 referensi lengkap artikel dan topik domain berformat Markdown ringkas.
- **Structured Data (Schema.org):** 
  - `Person` (`M. Rohadiz`, `Software Architect`, `knowsAbout`).
  - `WebSite` dengan `SearchAction`.
  - `BlogPosting` pada seluruh artikel dengan atribusi tanggal, word count, dan tags.
  - `CollectionPage` pada `/notes/`, `/projects/`, dan `/topics/*`.
- **E-E-A-T Hubs:** Halaman `/methodology/`, `/principles/`, `/how-i-work/`, dan `/glossary/` aktif dan terhubung.

### D. Google Discover Readiness
- **Ukuran Thumbnail:** Seluruh postingan memiliki thumbnail Open Graph beresolusi `1200 × 630 px` di `/assets/images/og/`.
- **Meta Image Preview:** Directive `max-image-preview:large` aktif, memenuhi syarat mutlak Google Discover untuk kartu visual besar.

### E. Layout & Visual Stability
- **Static Pages:** Kelas `.page-layout` (max-width `780px`, margin auto) terpasang di `_layouts/page.html` untuk memastikan konsistensi tampilan widescreen pada `/about/`, `/now/`, `/principles/`, `/how-i-work/`, `/methodology/`, `/glossary/`, `/knowledge/`, `/topics/`, dan `/p/sitemap.html`.

---

## 2. Checklist Target Evaluasi 2 Minggu (~11 November 2026)

Tujuan: Mengamati pergerakan crawling Googlebot menjadi pengindeksan aktif.

| Indikator | Metrik Baseline (28 Okt) | Target Minggu ke-2 (11 Nov) | Status Evaluasi |
| :--- | :--- | :--- | :--- |
| **GSC: Halaman Diindeks** | Sedikit (data lama Blogger) | > 100 URL (dari 196 URL) | [ ] Pending |
| **GSC: Status Sitemap** | `isPending: true` | `Sukses` / Terbaca | [ ] Pending |
| **GSC: Kueri Impresi Pertama** | 0 kueri | Muncul minimal 5–15 kueri | [ ] Pending |
| **Google Search: Brand Check** | Hanya homepage / parsial | `site:mrohadiz.my.id` menampilkan >50 halaman | [ ] Pending |
| **404 Monitoring** | `/p/sitemap.html` teratasi | Error 404 baru = 0 | [ ] Pending |

---

## 3. Checklist Target Evaluasi 4 Minggu (~25 November 2026)

Tujuan: Mengamati awal munculnya sinyal trafik organik dan peluang feed Discover.

| Indikator | Metrik Baseline (28 Okt) | Target Minggu ke-4 (25 Nov) | Status Evaluasi |
| :--- | :--- | :--- | :--- |
| **GSC: Total Klik Organik** | 0 klik | > 20 klik organik / bulan | [ ] Pending |
| **GSC: Total Impresi** | 0 impresi | > 500 impresi / bulan | [ ] Pending |
| **Topik Dominan di GSC** | Belum terbaca | Muncul impresi di kueri AI Engineering / Architecture | [ ] Pending |
| **Google Discover** | Belum ada tab Discover di GSC | Tab Discover muncul di GSC (jika artikel mendapat engagement) | [ ] Pending |
| **Sinyal Referral Luar** | 0 referral | Trafik referral dari LinkedIn / GitHub profil | [ ] Pending |

---

## 4. Troubleshooting Guide Jika Target Belum Tercapai

Jika pada evaluasi Minggu ke-2 atau ke-4 sinyal masih stagnan:

1. **Jika status di GSC "Dirayapi - saat ini tidak diindeks":**
   - Bukan masalah domain `.my.id` atau teknis hosting.
   - Pemicu utama adalah Googlebot menilai konten butuh diferensiasi lebih tajam. Solusi: perkuat *unique insight* atau kasus nyata di lead artikel.
2. **Jika status "Ditemukan - saat ini tidak diindeks":**
   - Crawl budget Googlebot masih antre.
   - Solusi: submit ulang URL spesifik via fitur "Inspeksi URL" di GSC atau tambahkan internal link dari homepage ke artikel tersebut.
3. **Jika Discover belum aktif:**
   - Discover membutuhkan sinyal awal (*seed traffic*). Bagikan artikel ke LinkedIn/komunitas untuk menghasilkan 20–50 pembaca organik pertama agar Chrome mendeteksi *dwell time* positif.
