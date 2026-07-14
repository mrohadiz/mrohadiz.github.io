---
layout: article
title: "SMART PASSED Bukan Berarti Storage Sehat: Memahami Perbedaan Media Error dan SATA CRC Error"
date: 2026-07-14
last_modified_at: 2026-07-14
categories:
  - Infrastructure
tags:
  - linux
  - storage
  - smart
  - ssd
  - sata
  - troubleshooting
excerpt: "Status SMART PASSED tidak selalu berarti sistem penyimpanan bebas masalah. Memahami perbedaan antara kesehatan media SSD dan kualitas komunikasi SATA dapat mempercepat proses root cause analysis."
---



Ketika sebuah server mulai terasa lambat atau sesekali *freeze*, salah satu langkah pertama yang sering dilakukan adalah memeriksa SMART disk.

Jika hasilnya menunjukkan:

> **SMART overall-health self-assessment: PASSED**

banyak orang langsung menyimpulkan bahwa SSD atau HDD dalam kondisi baik.

Padahal, kesimpulan tersebut belum tentu benar.

## SMART Hanya Menceritakan Sebagian Cerita

SMART menyimpan banyak informasi tentang kondisi perangkat penyimpanan, tetapi tidak semua atribut memiliki makna yang sama.

Secara sederhana, atribut SMART dapat dikelompokkan menjadi dua kategori:

1. **Kesehatan media penyimpanan**
2. **Kesehatan jalur komunikasi**

Sering kali kita hanya memperhatikan kategori pertama.

---

## Media Error vs SATA CRC Error

### Media Error

Atribut seperti berikut menggambarkan kondisi media penyimpanan:

- Reallocated Sector Count
- Pending Sector
- Offline Uncorrectable
- Reported Uncorrectable
- Program/Erase Fail

Jika nilai-nilai tersebut mulai meningkat, kemungkinan besar media SSD atau HDD memang mulai mengalami kerusakan.

### SATA CRC Error

Berbeda dengan Media Error.

`SATA_CRC_Error_Count` menunjukkan bahwa data mengalami kegagalan integritas saat dikirim melalui jalur SATA.

Masalah ini biasanya berkaitan dengan:

- kabel SATA
- konektor
- port SATA
- backplane
- kualitas sinyal antara motherboard dan storage

Artinya, media penyimpanan bisa saja masih sehat, tetapi komunikasi menuju perangkat mengalami gangguan.

---

## Mengapa Benchmark Bisa Tetap Normal?

Ini sering membingungkan.

Benchmark sederhana mungkin menunjukkan kecepatan baca dan tulis yang masih tinggi.

Namun ketika server menerima beban nyata, kernel mulai mencatat:

- interface fatal error
- WRITE FPDMA QUEUED
- link reset

Setiap kali komunikasi gagal, sistem operasi akan mencoba mengulang transaksi dan melakukan reset koneksi.

Akibatnya:

- latensi meningkat
- proses I/O tertahan
- aplikasi terasa lambat
- server terlihat seperti *freeze* beberapa detik

Masalahnya bukan throughput, tetapi kualitas komunikasi.

---

## Framework Membaca SMART

Daripada hanya melihat status **PASSED**, periksa atribut berikut:

### Kesehatan Media

- Reallocated Sector Count
- Pending Sector
- Offline Uncorrectable
- Reported Uncorrectable
- Wear Level / Percentage Used

Jika atribut ini bersih, media kemungkinan masih sehat.

### Kesehatan Komunikasi

- SATA_CRC_Error_Count
- SATA_Phy_Error_Count

Jika nilainya terus bertambah, fokus investigasi sebaiknya bergeser ke jalur komunikasi hardware.

---

## Jangan Langsung Menyalahkan Disk

Dalam banyak kasus, SSD bukan penyebab utamanya.

Urutan investigasi yang lebih sistematis adalah:

1. Pastikan tidak ada bottleneck aplikasi.
2. Periksa database dan aktivitas I/O.
3. Analisis log kernel.
4. Evaluasi atribut SMART.
5. Baru lakukan inspeksi fisik terhadap kabel, konektor, atau port SATA.

Pendekatan ini membantu menghindari penggantian SSD yang sebenarnya masih sehat.

---

## Checklist Singkat

Sebelum memutuskan mengganti storage, pastikan hal berikut telah diperiksa:

- SMART Overall Health
- Reallocated Sector Count
- Pending Sector
- Reported Uncorrectable
- SATA_CRC_Error_Count
- SATA_Phy_Error_Count
- Log kernel (`dmesg` atau `journalctl -k`)
- Aktivitas I/O aplikasi
- Riwayat pertambahan nilai SMART dari waktu ke waktu

---

## Penutup

Status **SMART PASSED** bukan berarti seluruh subsistem storage bebas masalah.

Media penyimpanan mungkin masih sehat, sementara jalur komunikasi mengalami gangguan yang menyebabkan server terasa lambat atau tidak responsif.

Troubleshooting yang baik bukan hanya membaca satu indikator, tetapi menghubungkan informasi dari SMART, log kernel, dan perilaku sistem secara keseluruhan. Dengan pendekatan tersebut, keputusan penggantian hardware menjadi lebih akurat dan didasarkan pada bukti, bukan asumsi.
