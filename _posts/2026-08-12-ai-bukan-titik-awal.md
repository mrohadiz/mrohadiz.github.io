---
layout: article
title: "AI Bukan Titik Awal"
date: 2026-08-12
categories:
  - AI Engineering
tags:
  - ai
  - decision-systems
  - software-architecture
  - observability
excerpt: "Sebelum menambahkan AI ke sebuah sistem, pahami terlebih dahulu masalah yang ingin diselesaikan dan peran AI dalam alur pengambilan keputusan."
image: /assets/images/og/2026-08-12-ai-bukan-titik-awal.png
---

# Ringkasan

Saat membangun produk baru, pertanyaan pertama yang sering muncul adalah model AI apa yang akan digunakan. Padahal pertanyaan tersebut sering muncul sebelum memahami masalah yang ingin diselesaikan.

Fokus akhirnya bergeser dari kebutuhan pengguna menjadi pemilihan teknologi. Dalam banyak kasus, AI ditambahkan terlalu dini sebelum rule, workflow, dan analytics dimanfaatkan secara optimal.

# Insight Utama

## Tidak Semua Masalah Membutuhkan AI

Banyak sistem berkembang melalui tahapan berikut:

```text
Rule
↓
Workflow
↓
Analytics
↓
AI
```

Namun dalam praktiknya urutan tersebut sering dibalik. AI menjadi titik awal, lalu tim berusaha mencari masalah yang cocok untuk dibantu AI.

Pendekatan yang lebih sehat adalah memulai dari solusi paling sederhana yang mampu menyelesaikan masalah.

## AI Sangat Baik Untuk Bahasa

Model bahasa sangat efektif untuk:

- Mengubah bahasa alami menjadi struktur data
- Meringkas informasi
- Mengelompokkan dan mengklasifikasikan data
- Membantu pencarian berbasis makna
- Menjelaskan hasil analisis

Namun model bahasa bukan sumber kebenaran. Kualitas jawaban tetap bergantung pada kualitas konteks dan data yang diberikan.

## Jangan Langsung Melempar Data Mentah Ke LLM

Pola yang sering dibayangkan:

```text
Data
↓
LLM
↓
Insight
```

Padahal pendekatan yang lebih dapat diaudit biasanya:

```text
Raw Data
↓
Metrics
↓
Findings
↓
Evidence
↓
Narrative
```

Pada pola ini, AI berada pada lapisan terakhir untuk membantu manusia memahami temuan yang sudah dihasilkan sistem.

# Mengapa Ini Penting

Dalam Decision Systems, sebuah kesimpulan seharusnya dapat ditelusuri kembali ke sumber datanya.

Jika sistem menyimpulkan:

> Campaign A menyebabkan penurunan konversi.

Maka sistem idealnya mampu menunjukkan:

```text
Conclusion
↓
Finding
↓
Metric
↓
Source Data
```

Tanpa jejak tersebut, pengguna hanya menerima jawaban tanpa memahami dasar yang melahirkannya.

# Checklist

Sebelum menambahkan AI ke sebuah fitur, periksa beberapa hal berikut:

- Apakah masalah ini benar-benar membutuhkan reasoning?
- Apakah rule sederhana dapat menyelesaikannya?
- Apakah workflow sudah cukup jelas?
- Apakah analytics yang diperlukan sudah tersedia?
- Apakah setiap kesimpulan dapat ditelusuri ke evidence?
- Apakah AI digunakan untuk menjelaskan atau menggantikan proses berpikir sistem?

# Penutup

AI dapat menjadi akselerator yang sangat kuat. Namun dalam banyak sistem, nilai terbesar justru berasal dari data yang baik, observability yang jelas, dan kemampuan menelusuri keputusan hingga ke sumber evidence.

Pertanyaan yang sering lebih penting daripada memilih model adalah:

"Bagian mana dari pekerjaan ini yang benar-benar membutuhkan AI?"
