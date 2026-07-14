---
layout: article
title: "Measurement Bukan Tujuan: Mendesain Sistem Tracking Berdasarkan Keputusan Bisnis"
image: /assets/images/og/2026-07-13-measurement-bukan-tujuan.png
date: 2026-07-13
last_modified_at: 2026-07-13
categories:
  - Decision Intelligence
tags:
  - measurement
  - analytics
  - tracking
  - observability
  - business-intelligence
  - digital-garden
excerpt: "Sistem tracking tidak dinilai dari seberapa banyak data yang berhasil dikumpulkan, tetapi dari seberapa besar ia membantu organisasi mengambil keputusan yang lebih baik."
---



Selama bertahun-tahun saya menganggap bahwa semakin lengkap sebuah sistem tracking, maka semakin baik kualitasnya.

Namun setelah beberapa kali membangun sistem tracking enterprise untuk berbagai bisnis, saya mulai menyadari bahwa asumsi tersebut tidak selalu benar.

Pertanyaan yang seharusnya muncul bukanlah:

> **"Apakah tracking kita sudah lengkap?"**

Tetapi:

> **"Tracking ini membantu keputusan apa?"**

Perubahan cara berpikir ini mengubah cara saya mendesain sistem analytics.

---

## Kesalahan yang Sering Terjadi

Banyak organisasi memulai dari teknologi.

```text
GA4

↓

Meta Pixel

↓

Dashboard

↓

Insight
```

Akibatnya seluruh energi dihabiskan untuk mengejar:

- Event sebanyak mungkin.
- Dashboard sebanyak mungkin.
- Attribution sedetail mungkin.

Padahal belum tentu seluruh data tersebut digunakan dalam pengambilan keputusan.

---

## Measurement Harus Dimulai dari Bisnis

Menurut saya urutan yang lebih sehat adalah:

```text
Business Goal

↓

Decision

↓

Information Needed

↓

Measurement

↓

Tracking
```

Tracking bukan tujuan.

Tracking hanyalah implementasi dari kebutuhan informasi.

---

## Contoh Sederhana

Misalnya sebuah perusahaan memiliki target:

> Revenue Rp5 Miliar per bulan.

Pertanyaannya:

Apakah perusahaan membutuhkan tracking yang mampu mengatribusikan 100% revenue ke setiap channel?

Belum tentu.

Jika target tercapai secara konsisten dan tidak ada keputusan yang membutuhkan attribution lebih detail, maka investasi besar pada tracking mungkin tidak memberikan nilai bisnis yang sebanding.

Sebaliknya, apabila perusahaan ingin:

- mengoptimalkan alokasi budget,
- mengetahui channel paling profitable,
- menghitung Customer Acquisition Cost secara akurat,
- melakukan forecasting,

maka sistem measurement menjadi jauh lebih penting.

---

## Tracking Tidak Pernah 100%

Ini juga menjadi pelajaran penting.

Banyak orang menganggap bahwa GA4, Meta Pixel, atau Conversions API mampu menangkap seluruh aktivitas pengguna.

Kenyataannya tidak demikian.

Ada banyak faktor yang menyebabkan sebagian data tidak pernah bisa diamati:

- Browser privacy.
- Ad blocker.
- Cookie consent.
- Cross-device.
- Offline interaction.
- WhatsApp.
- Sales manual.
- Transfer bank.
- Marketplace.
- Human behavior.

Artinya, seluruh platform analytics modern bekerja dalam batas observasi tertentu.

Mereka membantu kita melihat sebagian realitas, bukan seluruh realitas.

---

## Ketika 40% Sudah Menjadi Maksimal

Saya pernah membangun sistem tracking yang hanya mampu mengatribusikan sekitar 40% revenue.

Awalnya saya menganggap sistem tersebut gagal.

Namun setelah memahami workflow bisnis secara menyeluruh, saya menyadari bahwa:

- sebagian besar transaksi terjadi secara offline,
- proses closing dilakukan melalui berbagai channel,
- banyak keputusan pembelian dipengaruhi interaksi yang tidak dapat diamati secara digital.

Dalam konteks tersebut, 40% bukan berarti buruk.

40% adalah batas observasi yang memang dimungkinkan oleh desain bisnis saat ini.

Apabila ingin meningkatkan angka tersebut, maka yang harus berubah bukan sekadar tracking, tetapi workflow bisnisnya sendiri.

---

## Measurement Boundary

Setiap sistem measurement memiliki batas.

Saya menyebutnya sebagai **Measurement Boundary**.

Sebelum membangun dashboard, organisasi seharusnya memahami:

- Apa yang memang bisa diukur?
- Apa yang hanya bisa diperkirakan?
- Apa yang sama sekali tidak bisa diamati?

Tanpa memahami batas ini, organisasi sering terjebak mengejar akurasi yang secara praktis mustahil dicapai.

---

## Business Measurement Capability

Daripada bertanya:

> "Apakah tracking kita sudah benar?"

Saya lebih memilih bertanya:

> "Seberapa besar kemampuan organisasi mengukur proses bisnisnya?"

Misalnya:

| Area | Status |
|-------|--------|
| Revenue | ✔ Terukur |
| Channel Attribution | ⚠ Sebagian |
| Offline Sales | ⚠ Sebagian |
| Repeat Customer | ✔ Terukur |
| Word of Mouth | ✖ Tidak Terukur |
| WhatsApp Organik | ✖ Sangat Terbatas |

Dokumen seperti ini jauh lebih berguna daripada sekadar mengejar persentase tracking.

---

## Nilai Measurement Ditentukan oleh Keputusan

Sebuah sistem measurement tidak boleh dinilai dari jumlah event yang berhasil dikumpulkan.

Yang lebih penting adalah:

**Apakah keputusan organisasi menjadi lebih baik?**

Misalnya:

- Apakah budget marketing dapat dialokasikan lebih tepat?
- Apakah bottleneck bisnis lebih cepat ditemukan?
- Apakah diskusi manajemen menjadi lebih objektif?
- Apakah eksperimen marketing menjadi lebih terukur?

Jika jawabannya "ya", maka measurement tersebut memberikan nilai.

---

## Cost of Measurement

Measurement juga memiliki biaya.

Semakin kompleks tracking yang dibangun, semakin besar biaya:

- development,
- maintenance,
- validasi data,
- monitoring,
- perubahan workflow,
- pelatihan tim.

Karena itu saya mulai menggunakan prinsip sederhana:

> **Biaya membangun sistem measurement tidak boleh lebih besar daripada nilai keputusan yang dihasilkannya.**

---

## Dari Dashboard Menuju Decision Intelligence

Banyak dashboard berhenti pada visualisasi data.

Padahal tujuan sebenarnya adalah membantu organisasi mengambil keputusan.

Bagi saya urutannya sekarang menjadi seperti ini:

```text
Business Goal

↓

Business Question

↓

Decision

↓

Measurement

↓

Tracking

↓

Dashboard

↓

Action
```

Dashboard bukan akhir perjalanan.

Dashboard hanyalah salah satu alat dalam proses pengambilan keputusan.

---

## Catatan Penutup

Saya tidak lagi bertanya:

> "Apakah tracking ini sudah lengkap?"

Saya lebih memilih bertanya:

> "Keputusan apa yang menjadi lebih baik karena tracking ini ada?"

Jika tidak ada keputusan yang berubah, mungkin yang perlu dikurangi bukan datanya, melainkan kompleksitas sistemnya.

Karena pada akhirnya, **measurement bukan tentang mengumpulkan data sebanyak mungkin, melainkan menyediakan informasi yang benar-benar dibutuhkan organisasi untuk mengambil keputusan yang lebih baik.**
