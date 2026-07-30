# Internal Linking Principles

> Status: Active
>
> Tujuan dokumen ini adalah menetapkan prinsip internal linking untuk seluruh Digital Garden agar setiap artikel, glossary, methodology, principles, dan project saling terhubung membentuk **knowledge graph**, bukan sekadar kumpulan halaman.

---

# Philosophy

Digital Garden bukan kumpulan artikel yang berdiri sendiri.

Setiap halaman adalah **node pengetahuan** yang memiliki hubungan dengan halaman lain.

Internal link digunakan untuk membantu pembaca memahami konteks, bukan untuk meningkatkan jumlah link.

Setiap link harus memiliki alasan yang jelas.

---

# Objective

Internal linking bertujuan untuk:

- membantu pembaca memperluas pemahaman
- membangun knowledge graph
- menghubungkan konsep dengan implementasi
- menghubungkan teori dengan studi kasus
- mengurangi halaman yang terisolasi (orphan page)
- meningkatkan discoverability

SEO adalah manfaat tambahan, bukan tujuan utama.

---

# Golden Rules

## 1. Link karena relevansi

Jangan membuat link hanya karena sebuah kata muncul.

Link hanya dibuat apabila halaman lain benar-benar membantu memahami topik yang sedang dibahas.

Benar:

> Observability → Root Cause Analysis

Salah:

> Server → semua artikel server

---

## 2. Prioritaskan kualitas

Lebih baik lima link yang relevan daripada dua puluh link acak.

---

## 3. Jangan memaksakan link

Jika memang tidak ada halaman yang relevan, jangan membuat link.

---

## 4. Link harus membantu pembaca

Setelah mengklik link, pembaca harus memperoleh konteks tambahan.

Jika tidak memberikan nilai tambah, jangan dibuat.

---

# Relationship Types

Internal link dapat dibagi menjadi beberapa jenis hubungan.

---

## Concept → Concept

Menghubungkan dua konsep yang saling berkaitan.

Contoh:

Observability

↓

Signal-to-Noise Ratio

↓

Root Cause Analysis

↓

Event-Driven Architecture

---

## Concept → Case Study

Konsep menuju implementasi nyata.

Contoh:

Dormant Shell

↓

Deface Bukan Awal Serangan

---

## Case Study → Concept

Studi kasus menuju teori yang menjelaskan kejadian tersebut.

Contoh:

Artikel audit server

↓

Observability

↓

Root Cause Analysis

↓

Technical Debt

---

## Concept → Methodology

Menghubungkan konsep menuju cara penerapannya.

Contoh:

Decision Intelligence

↓

Methodology

---

## Concept → Principle

Menghubungkan konsep menuju prinsip berpikir.

Contoh:

Systems Thinking

↓

Principles

---

## Case Study → Project

Jika artikel berasal dari implementasi sebuah project.

Contoh:

Market Intelligence

↓

RADAR

---

# Glossary Linking Rules

Glossary bukan kamus.

Glossary adalah pusat referensi konsep.

Setiap glossary minimal memiliki:

- 2 link menuju glossary lain
- 2 link menuju artikel
- 1 link menuju methodology atau principles bila relevan

Contoh:

Observability

Lihat juga:

- Root Cause Analysis
- Signal-to-Noise Ratio
- Event-Driven Architecture

Artikel terkait:

- Website Terlihat Bermasalah, Padahal Website Sehat
- Deface Bukan Awal Serangan

---

# Article Linking Rules

Setiap artikel sebaiknya memiliki minimal:

- 2 link ke glossary
- 2 link ke artikel lain
- 1 link ke methodology atau principles (jika relevan)

Contoh:

Artikel tentang audit server.

Istilah:

- Observability
- Root Cause Analysis
- Dormant Shell

Artikel lain:

- Website Terlihat Bermasalah...
- Menghapus Plugin WordPress...

Methodology:

- Incident Investigation

---

# Bidirectional Linking

Jika halaman A mengarah ke halaman B, evaluasi apakah halaman B juga perlu mengarah kembali ke halaman A.

Contoh:

Observability

↓

Website Terlihat Bermasalah

Halaman Website Terlihat Bermasalah

↓

Observability

Hubungan dua arah membuat knowledge graph menjadi lebih kuat.

---

# Contextual Linking

Link harus berada pada kalimat yang menjelaskan hubungan antar konsep.

Hindari daftar link yang tidak memiliki konteks.

Baik:

> Pendekatan ini berkaitan erat dengan konsep Observability karena investigasi dilakukan melalui logs, metrics, dan traces.

Kurang baik:

Lihat juga:

- Observability
- Root Cause Analysis
- Systems Thinking
- Event-Driven Architecture

tanpa penjelasan apa pun.

---

# Anchor Text

Gunakan nama konsep secara natural.

Baik:

- Observability
- Root Cause Analysis
- Dormant Shell

Hindari:

- klik di sini
- baca artikel ini
- informasi lengkap

---

# Avoid Overlinking

Jangan membuat link pada setiap kemunculan istilah.

Link cukup diberikan pada:

- kemunculan pertama
- bagian yang memang membutuhkan konteks tambahan

---

# Knowledge Graph Priority

Prioritaskan hubungan berikut.

Concept

↓

Methodology

↓

Case Study

↓

Project

↓

Reference

Seorang pembaca ideal dapat berpindah dari definisi konsep hingga implementasi nyata hanya melalui internal link.

---

# Maintenance

Saat membuat artikel baru:

- evaluasi glossary yang perlu ditambahkan link
- evaluasi artikel lama yang perlu mengarah ke artikel baru
- evaluasi methodology yang berkaitan
- evaluasi principles yang berkaitan

Internal linking bukan hanya dilakukan pada artikel baru, tetapi juga memperbarui halaman lama agar knowledge graph terus berkembang.

---

# AI Agent Responsibilities

Setiap kali membuat atau memperbarui halaman, AI Agent wajib:

1. Mengidentifikasi konsep utama.
2. Mencari glossary yang relevan.
3. Menambahkan internal link secara kontekstual.
4. Mencari artikel yang berkaitan.
5. Menambahkan hubungan dua arah bila diperlukan.
6. Menghindari overlinking.
7. Memastikan setiap link memberikan nilai tambah bagi pembaca.
8. Menjaga Digital Garden tetap membentuk knowledge graph yang konsisten.

Agent tidak boleh menambahkan link hanya demi SEO.

Internal linking harus selalu mencerminkan hubungan pengetahuan yang nyata antar halaman.

---

# Guiding Principle

> Setiap halaman harus membantu pembaca menemukan halaman berikutnya yang paling relevan untuk memperdalam pemahamannya.

Internal link bukan navigasi.

Internal link adalah jalur belajar.
