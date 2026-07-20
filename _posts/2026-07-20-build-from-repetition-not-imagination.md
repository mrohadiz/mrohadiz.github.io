---
layout: article
title: "Build From Repetition, Not Imagination"
date: 2026-07-20
categories:
  - Software Architecture
tags:
  - internal-tools
  - automation
  - engineering-thinking
excerpt: "Otomatisasi paling bernilai lahir dari pekerjaan yang berulang, bukan dari ide yang terasa berguna."
image: /assets/images/og/2026-07-20-build-from-repetition-not-imagination.png
---

# Build From Repetition, Not Imagination

Salah satu kesalahan paling umum saat membangun internal tools adalah memulai dari ide, bukan dari pengulangan.

Sebuah command terasa berguna, jadi kita membuatnya. Lalu muncul command lain. Lalu dashboard. Lalu integrasi tambahan. Lama-lama, tool yang awalnya dimaksudkan untuk menyederhanakan kerja malah menjadi proyek baru yang harus dirawat.

## Ringkasan

Automation yang baik biasanya lahir dari kebiasaan yang berulang. Jika suatu langkah terus dilakukan berkali-kali, besar kemungkinan langkah itu layak dipindahkan ke tool. Kalau belum berulang, kemungkinan besar itu masih terlalu dini untuk diotomatisasi.

## Insight utama

Pertanyaan yang paling membantu bukan "apa yang bisa dibuat?", melainkan "apa yang terus diulang?"

Itu menggeser fokus dari kreativitas ke kebutuhan nyata. Kita berhenti membangun berdasarkan asumsi dan mulai membangun berdasarkan pola kerja yang benar-benar terjadi.

## Mengapa ini penting

Banyak internal tool tumbuh terlalu cepat karena setiap ide terlihat masuk akal. Masalahnya, tidak semua ide adalah masalah yang berulang. Ketika otomatisasi dibuat terlalu cepat, hasilnya sering menambah beban baru: maintenance, konfigurasi, dokumentasi, dan refactor yang tidak perlu.

Dengan memulai dari repetisi, kita bisa membatasi scope sejak awal. Tool menjadi lebih kecil, lebih stabil, dan lebih mudah dipakai karena ia menyelesaikan hal yang memang sudah terbukti muncul berkali-kali.

## Checklist

- Catat pekerjaan yang sering diulang.
- Tunggu sampai pola terlihat jelas.
- Otomatiskan langkah yang paling sering dipakai.
- Hindari membangun fitur dari kemungkinan masa depan.
- Tinjau ulang apakah tool tersebut benar-benar menghemat waktu.

## Penutup

Automation bukan kemenangan atas ide, tetapi jawaban atas pengulangan.

Kalau suatu proses belum berulang, biasanya belum waktunya dibangun. Kalau proses itu terus muncul, barulah ada alasan yang kuat untuk membuat tool.
