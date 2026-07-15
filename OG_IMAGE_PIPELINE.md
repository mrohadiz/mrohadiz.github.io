# Automated Open Graph Image Pipeline

## Arsitektur & Strategi
Pipeline ini mengotomatiskan pembuatan *Open Graph* (OG) image atau *thumbnail* untuk setiap artikel secara mandiri (100% *self-hosted*) tanpa melibatkan API pihak ketiga seperti Cloudinary, menjaga kerahasiaan dan kemandirian repositori.

### Komponen Utama
1. **Engine Generator:** `scripts/generate_og_images.py` yang ditulis dalam Python menggunakan *library* **Pillow** (PIL).
2. **Tipografi & Desain:** Menggunakan *font* Roboto statis di `assets/fonts/` (Bold & Regular) dengan palet gelap hangat, aksen brass, dan struktur editorial *Field Observatory* yang selaras dengan identitas Digital Garden terbaru. Teks melakukan *auto-wrap* agar tidak terpotong.
3. **Automasi CI/CD:** Terintegrasi langsung dalam siklus `Quality Gate` milik GitHub Actions.

---

## Alur Kerja GitHub Actions (Workflow)
Sistem ini dipicu secara alami sebelum proses *Jekyll Build*:
1. Saat Anda `git push` ke cabang `main`, GitHub Actions memulai pekerjaannya.
2. Lingkungan virtual memasang Python dan dependensi terkait (`Pillow`).
3. Skrip dijalankan. Jika ada perubahan yang terdeteksi, ia melukis PNG berukuran 1200x630px.
4. Gambar diletakkan di `/assets/images/og/`.
5. Skrip memodifikasi baris `image:` pada *frontmatter* `.md` artikel tersebut secara *inline*.
6. GitHub Actions secara diam-diam melakukan `git commit` dan `git push` kembali ke repositori Anda menggunakan tag `[skip ci]` agar tidak memicu putaran aksi berulang.
7. Rantai *build* Jekyll diteruskan dan mem- *publish* situs ke web.

---

## Strategi Cache
Untuk meminimalkan beban komputasi dan mencegah pembengkakan *history commit*:
- Sistem memelihara berkas `.og-cache.json` di *root* direktori. Berkas ini mencatat pasangan *slug* dan *title* artikel.
- **Pengecekan:** 
  - Jika artikel lama (judul tidak diubah) → **Lewati.**
  - Jika `image:` sudah diisi gambar kustom oleh Anda sebelumnya → **Lewati.**
  - Jika artikel baru atau judul berganti → **Buat ulang dan perbarui.**

---

## Panduan Perawatan (Maintenance Guide)
Sistem ini dibuat *maintenance-free*, namun ada beberapa hal yang bisa Anda atur secara leluasa:
1. **Merubah Warna/Desain:** Buka `scripts/generate_og_images.py`. Variabel warna seperti `BG_COLOR`, `ACCENT_COLOR`, dan tata letak frame editorial dapat diubah di `scripts/generate_og_images.py`.
2. **Memaksa Regenerasi:** Apabila Anda merubah desain dan ingin semua artikel di-*generate* ulang dengan desain baru, cukup hapus file `.og-cache.json` lalu *commit*. Pipeline akan me-*rebuild* seluruh *thumbnail* dari nol.
3. **Mengganti Gambar Artikel:** Jika Anda kebetulan mendesain infografis sendiri untuk sebuah artikel, cukup ubah variabel `image:` pada *frontmatter* artikel tersebut secara manual. Pipeline tidak akan pernah menimpa gambar khusus Anda.

---

## Dampak SEO (Search Engine Optimization)
Thumbnail ini mengomunikasikan konteks visual ke mesin pencari dan pengguna:
- **Terintegrasi Otomatis:** Baris `image: /assets/images/og/...png` akan ditarik oleh tag `<meta property="og:image">`, `twitter:image`, serta skema terstruktur JSON-LD tanpa usaha ekstra.
- **Standar Sosial Media:** Gambar ini dipotong pada rasio aman `1.91:1` (1200×630px) untuk memastikannya tidak terpotong saat dipratinjau di LinkedIn, Twitter, Slack, maupun iMessage.
