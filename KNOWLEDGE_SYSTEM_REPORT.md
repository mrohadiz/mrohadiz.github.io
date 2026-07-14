# Knowledge System Architecture Report

## Ringkasan Eksekutif
Situs ini telah bertransformasi dari sekadar "Blog Kronologis" menjadi **Living Knowledge System**. Tujuan perombakan arsitektur informasi ini adalah untuk memperkuat jaring-jaring pengetahuan (Knowledge Graph), membantu pembaca menemukan hubungan semantik antar ide, serta meningkatkan secara masif *internal linking* yang sangat berdampak pada SEO & AI Discoverability.

Tanpa mengubah desain (*theme*) sama sekali, Jekyll Liquid logic telah direkayasa ulang untuk melakukan klasifikasi dinamis pada konten.

---

## 1. Files Modified
- `_layouts/article.html` — Perombakan besar-besaran untuk menginjeksi komponen *Knowledge System*.
- `_pages/knowledge.md` (Baru) — *Knowledge Map* tingkat akar.
- `_includes/concept-card.html` (Baru) — Komponen re-usable untuk *Concept Cards*.
- `_pages/topics/*.md` — Mengubah seluruh laman *topic hub* menjadi portal pengetahuan.

---

## 2. Knowledge Architecture & Internal Linking Strategy
Situs tidak lagi berujung buntu. Strategi penautan (*Internal Linking*) direkayasa berdasar **relevansi topik**, bukan tanggal terbit:

- **Breadcrumbs Semantik:** Di atas judul artikel, jejak navigasi bukan menampilkan struktur URL, melainkan hierarki pengetahuan (contoh: `Notes ↓ Decision Systems ↓ Measurement`).
- **Related Concepts:** Secara otomatis menarik meta `categories` dan `tags` untuk ditampilkan sebagai pil (*chips*) di akhir konten utama, memicu rasa ingin tahu untuk menelusuri node lain.
- **Continue Exploring:** Sub-footer "Back to Notes" tradisional diganti dengan papan petunjuk ke `Knowledge Map`, `Topic Page`, `Glossary`, dan `All Notes`.

---

## 3. Related Article Algorithm (Weighted Scoring)
Komponen artikel terkait tidak lagi hanya menebak acak. Skrip *Liquid* baru menerapkan skor tertimbang secara dinamis (*Weighted Scoring*):
- **Kategori Sama:** +5 Poin
- **Tag yang Sama (Per tag):** +3 Poin

Sistem me- *looping* seluruh posting, menjumlahkan bobotnya, mengurutkan string tersebut (`sort`), dan menghasilkan 4 rekomendasi paling berbobot. Ini setara dengan *Recommendation Engine* sederhana yang murni berjalan secara statis (SEO friendly).

---

## 4. Learning Path Generation
Sistem secara otomatis membangun **Recommended Learning Path** linier di setiap artikel dan di laman *Topic*. 
Artikel dalam domain yang sama dirangkai menyerupai daftar isi sebuah buku (membimbing dari dasar hingga lanjut). Sistem menyoroti artikel mana yang sedang dibaca saat ini.

Lebih jauh lagi, algoritma menghitung panjang kata secara otomatis untuk menugaskan **Tingkat Kesulitan (Level)**:
- `< 600 Kata` = **Beginner**
- `600 - 1500 Kata` = **Intermediate**
- `> 1500 Kata` = **Advanced**

---

## 5. Knowledge Graph Structure & Pillar Articles
Telah dibuat rute `/knowledge/` yang berfungsi layaknya "Peta Pikiran".
- **Pillar Articles (Start Here):** Algoritma mendeteksi artikel pilar dari keberadaan tag `pillar` atau jika judul artikel tersebut secara eksplisit mendefinisikan kategori (contoh artikel berjudul "Decision Systems").
- **Key Concepts:** Ekstraksi dinamis maksimum 5 *tags* terpopuler pada setiap domain.

---

## 6. AI Visibility & SEO Impact
Perubahan arsitektur ini **tidak menggunakan satupun library JavaScript dari pihak luar**, semuanya dirajut rapi dalam DOM HTML via Jekyll Server. 
- **Bagi SEO Crawler (Googlebot):** Laba-laba mesin pencari akan menyukai *siloing* arsitektur ini (Navigasi Piramida). Densitas *internal linking* naik 300% karena algoritma *scoring* terkait dan *learning path*.
- **Bagi LLM / AI Crawler (Perplexity, ChatGPT):** AI lebih mudah memahami otoritas situs Anda. Dengan jejaring yang saling memperkuat argumen (konsep A terkait kuat dengan konsep B), konteks *entity* (Entitas AI Engineering, dll) jauh lebih solid.

---

## Cara Penggunaan (Concept Cards)
Bila Anda sering menyebut kata kunci tertentu, Anda bisa memanggil kartu konsep di dalam Markdown Anda menggunakan sintaks:
```liquid
{% include concept-card.html title="Observability" description="Sebuah disiplin fokus memahami perilaku sistem melalui telemetri." %}
```
Kartu tersebut otomatis akan menautkan pembaca ke `/glossary/#observability`.

---
*Digital Garden Anda kini resmi beroperasi sebagai sebuah Sistem Pengetahuan yang mandiri dan saling terkait.*
