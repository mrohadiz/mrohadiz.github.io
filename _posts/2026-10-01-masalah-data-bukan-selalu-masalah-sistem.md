---
layout: article
title: "Masalah Data Bukan Selalu Masalah Sistem"
date: 2026-10-01
categories:
  - Decision Systems
tags:
  - observability
  - data-quality
  - root-cause-analysis
  - systems-thinking
excerpt: "Ketika sebuah metrik terlihat buruk, penyebabnya tidak selalu ada pada sistem yang menjalankannya. Sering kali akar masalah berada pada asumsi, klasifikasi, atau proses evaluasi yang tidak pernah diperbarui."
---

# Ringkasan

Ketika sebuah organisasi menemukan kualitas data yang rendah, reaksi pertama sering kali adalah menyalahkan sistem operasional yang berjalan di belakangnya.

Padahal, dalam banyak kasus, sistem bekerja sesuai desain. Yang bermasalah justru aturan klasifikasi, proses evaluasi, atau asumsi yang sudah tidak sesuai dengan kondisi aktual.

Perbedaan ini penting karena solusi yang diambil akan sangat berbeda.

# Insight Utama

## 1. Gejala dan akar masalah sering berada di tempat yang berbeda

Sebuah backlog besar dapat terlihat seperti kegagalan proses.

Namun setelah diaudit lebih dalam, akar masalahnya bisa berupa:

- status yang hanya dihitung sekali lalu tidak pernah diperbarui
- klasifikasi lama yang tidak lagi sesuai dengan standar saat ini
- data valid yang tertahan karena aturan validasi yang sudah usang

Jika diagnosis salah, organisasi akan memperbaiki komponen yang sebenarnya tidak rusak.

## 2. Evaluasi sekali bukan berarti benar selamanya

Banyak sistem menetapkan status pada saat objek dibuat.

Masalah muncul ketika kondisi objek berubah, tetapi status tersebut tidak pernah dievaluasi ulang.

Prinsip yang lebih aman:

- keputusan boleh dibuat sekali
- validitas keputusan harus bisa diperiksa ulang

Status seharusnya diperlakukan sebagai sesuatu yang dapat berevolusi ketika bukti baru tersedia.

## 3. Taksonomi yang buruk dapat menyembunyikan data bernilai

Kategori seperti:

- UNKNOWN
- OTHER
- MISC
- UNCLASSIFIED

sering dianggap tidak berbahaya.

Padahal kategori-kategori tersebut dapat menjadi tempat berkumpulnya data valid yang gagal dikenali oleh sistem.

Sebelum membangun fitur baru, audit terlebih dahulu kategori-kategori tersebut.

## 4. Integritas lebih penting daripada volume

Meningkatkan jumlah data tidak selalu berarti meningkatkan kualitas pembelajaran.

Data tambahan hanya bernilai jika:

- memiliki identitas yang jelas
- memiliki jejak asal yang dapat ditelusuri
- memiliki hasil yang terverifikasi
- tidak tercampur dengan data ambigu

Lebih baik memiliki dataset kecil yang terpercaya daripada dataset besar yang tidak dapat diaudit.

# Mengapa Ini Penting

Banyak organisasi menghabiskan waktu untuk mengoptimalkan proses operasional, padahal hambatan utamanya berada pada kualitas klasifikasi dan tata kelola data.

Ketika observabilitas meningkat, tim dapat membedakan:

- masalah operasional
- masalah data
- masalah tata kelola
- masalah definisi bisnis

Pemisahan ini membuat perbaikan menjadi jauh lebih efektif.

# Checklist Audit

Sebelum menyimpulkan bahwa sebuah sistem gagal, periksa:

- Apakah status dievaluasi ulang setelah kondisi berubah?
- Apakah ada kategori UNKNOWN atau sejenisnya yang terus bertambah?
- Apakah data memiliki identitas yang konsisten dari awal hingga akhir proses?
- Apakah hasil dapat ditelusuri kembali ke sumber asalnya?
- Apakah ada data valid yang tertahan oleh aturan lama?
- Apakah metrik buruk berasal dari proses atau dari klasifikasi?

# Penutup

Perbaikan terbesar sering kali tidak datang dari mengganti sistem, melainkan dari memahami bagaimana data bergerak, diklasifikasikan, dan dievaluasi sepanjang siklus hidupnya.

Observabilitas yang baik membantu organisasi berhenti menebak dan mulai memperbaiki akar masalah yang sebenarnya.