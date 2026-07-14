---
layout: article
title: "KPI Tidak Pernah Menyelesaikan Perdebatan"
image: /assets/images/default-thumbnail.svg
date: 2026-07-13
last_modified_at: 2026-07-13
categories:
  - Business Architecture
tags:
  - business-glossary
  - kpi
  - ownership
  - semantic-layer
  - decision-making
excerpt: "Semakin banyak saya merancang dashboard, semakin saya menyadari bahwa akar perdebatan bukan terletak pada KPI, tetapi pada definisi yang berbeda terhadap istilah bisnis."
---

Semakin banyak saya membangun dashboard, semakin saya menyadari bahwa masalah terbesar organisasi bukan kekurangan data.

Masalahnya adalah setiap orang menggunakan **bahasa yang berbeda untuk mendeskripsikan bisnis yang sama**.

Misalnya satu pertanyaan sederhana:

> Berapa jumlah Lead bulan ini?

Ternyata jawabannya bisa berbeda.

Marketing menganggap Lead adalah orang yang mengisi form.

Sales menganggap Lead adalah orang yang berhasil dihubungi.

CRM menganggap Lead adalah nomor WhatsApp baru.

Developer menganggap Lead adalah event `form_submit`.

Keempatnya benar.

Namun organisasi tidak mungkin mengambil keputusan dari empat definisi yang berbeda.

## Saya Mengira KPI Adalah Langkah Pertama

Awalnya saya menyusun daftar KPI.

Kemudian formula.

Lalu dashboard.

Namun semakin jauh diskusi berjalan, semakin sering muncul pertanyaan yang tidak bisa dijawab oleh dashboard.

- Apa itu Lead?
- Kapan seseorang menjadi Qualified Lead?
- Siapa yang menentukan definisi tersebut?
- Siapa yang boleh mengubahnya?

Saya akhirnya menyadari bahwa KPI bukan fondasi.

KPI hanya menghitung sesuatu yang sudah didefinisikan sebelumnya.

## Business Glossary Bukan Kamus

Selama ini saya menganggap Business Glossary hanyalah daftar istilah.

Sekarang saya melihatnya sebagai **kontrak bahasa organisasi**.

Business Glossary memastikan bahwa ketika seseorang mengatakan "Lead", semua orang memahami objek yang sama.

Glossary bukan hanya mendefinisikan arti sebuah istilah, tetapi juga menjelaskan:

- kapan istilah tersebut berlaku,
- kapan tidak lagi berlaku,
- siapa pemilik definisinya,
- proses bisnis yang menggunakannya,
- dan metrik apa saja yang bergantung padanya.

Tanpa kesepakatan ini, dashboard hanya mempercepat perdebatan.

## Dashboard Tidak Pernah Lebih Pintar dari Definisi

Semakin saya mengerjakan platform analytics, semakin saya percaya bahwa dashboard hanyalah lapisan visual.

Fondasi sebenarnya berada jauh di bawahnya.

```text
Business Strategy
        ↓
Business Process
        ↓
Business Glossary
        ↓
Metric Registry
        ↓
Dashboard
```

Jika Business Glossary belum disepakati, maka Metric Registry akan berbeda-beda.

Jika Metric Registry berbeda, maka dashboard hanya akan menghasilkan angka yang diperdebatkan.

## Catatan

Sebelum membuat KPI, sepakati dulu bahasa bisnis.

Sebelum menunjuk owner, sepakati dulu definisinya.

Karena organisasi tidak mengambil keputusan berdasarkan dashboard.

Organisasi mengambil keputusan berdasarkan makna yang mereka berikan terhadap angka di dashboard.
