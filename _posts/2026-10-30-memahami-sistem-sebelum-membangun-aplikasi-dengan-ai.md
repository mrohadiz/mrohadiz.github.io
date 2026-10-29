---
layout: article
title: "Memahami Sistem Sebelum Membangun Aplikasi dengan AI"
date: 2026-10-30
categories:
  - AI Engineering
  - Software Architecture
tags:
  - vibe-coding
  - system-design
  - systems-thinking
  - ai-assisted-development
series: vibe-coding-beyond-prompting
excerpt: "Sebelum meminta AI menulis kode, pahami dulu masalah, pengguna, proses, dan data dari sistem yang ingin dibangun."
---

# Memahami Sistem Sebelum Membangun Aplikasi dengan AI

Sekarang, membuat aplikasi dengan bantuan AI semakin mudah.

Kita bisa menjelaskan ide kepada AI, meminta dibuatkan halaman, menambahkan fitur, bahkan membangun aplikasi yang sebelumnya membutuhkan bantuan seorang developer.

Namun, ada satu hal yang sering terlewat: **apakah kita benar-benar memahami sistem yang sedang kita bangun?**

Bayangkan seseorang ingin membuat aplikasi pemesanan makanan. Ia langsung meminta AI membuat halaman login, daftar menu, keranjang belanja, dan halaman pembayaran.

AI mungkin bisa menghasilkan semua halaman tersebut.

Tetapi, apakah aplikasi itu sudah benar-benar bisa digunakan?

Bagaimana pesanan masuk ke dapur? Siapa yang mengubah status pesanan? Dari mana informasi pembayaran berasal? Siapa yang boleh mengubah harga menu?

Pertanyaan-pertanyaan tersebut bukan sekadar persoalan coding. Itu adalah bagian dari pemahaman sistem.

Sebelum membangun aplikasi, kita perlu memahami lingkungan tempat aplikasi akan digunakan, siapa saja yang terlibat, bagaimana proses berlangsung, dan informasi apa yang harus dikelola.

## 1. Aplikasi Selalu Memiliki Tujuan Penggunaan

Aplikasi bukan sekadar kumpulan halaman dan tombol.

Sebuah aplikasi dibuat untuk membantu seseorang melakukan pekerjaan, menyelesaikan masalah, atau menjalankan suatu proses.

Karena itu, langkah pertama bukan menentukan fitur, melainkan memahami masalah yang ingin diselesaikan.

Misalnya, kita ingin membuat aplikasi pemesanan makanan.

Sebelum memikirkan tampilan aplikasi, coba pahami bagaimana proses pemesanan berlangsung saat ini.

- Pelanggan melihat daftar makanan.
- Pelanggan memilih makanan.
- Pesanan dicatat oleh kasir.
- Dapur menerima informasi pesanan.
- Makanan disiapkan.
- Pesanan diserahkan kepada pelanggan.

Dari proses sederhana tersebut, kita mulai melihat kebutuhan aplikasi.

Aplikasi perlu membantu pelanggan memilih makanan, membantu kasir memantau pesanan, dan membantu dapur mengetahui apa yang harus disiapkan.

Artinya, satu aplikasi bisa digunakan oleh beberapa pihak dengan kebutuhan yang berbeda.

## 2. Pahami Siapa Saja yang Terlibat dalam Sistem

Setiap sistem memiliki pihak yang berinteraksi di dalamnya. Dalam pengembangan perangkat lunak, pihak-pihak ini sering disebut sebagai *aktor* atau pengguna sistem.

Pada contoh aplikasi pemesanan makanan, setidaknya ada tiga aktor:

- **Pelanggan:** memilih makanan dan membuat pesanan.
- **Kasir atau admin:** mengelola menu dan memantau pesanan.
- **Dapur:** menerima pesanan dan memperbarui proses persiapan makanan.

Ketiganya menggunakan aplikasi untuk tujuan yang berbeda.

Pelanggan membutuhkan informasi menu dan kemudahan memesan. Kasir membutuhkan informasi pesanan dan pembayaran. Dapur membutuhkan daftar pesanan yang harus disiapkan.

Perbedaan kebutuhan ini akan memengaruhi fitur, hak akses, dan alur kerja aplikasi.

Karena itu, sebelum meminta AI membuat aplikasi, kita perlu mengetahui siapa saja yang akan menggunakannya dan apa yang mereka lakukan.

## 3. Pahami Proses Sebelum Menentukan Fitur

Setelah mengetahui siapa saja yang terlibat, langkah berikutnya adalah memahami proses yang mereka jalankan.

Jangan langsung bertanya, "Fitur apa yang harus dibuat?"

Coba mulai dari pertanyaan, "Apa yang sebenarnya dilakukan pengguna dari awal sampai selesai?"

Contohnya, proses pemesanan makanan:

1. Pelanggan membuka aplikasi.
2. Pelanggan melihat daftar menu.
3. Pelanggan memilih makanan.
4. Makanan dimasukkan ke keranjang.
5. Pelanggan melakukan checkout.
6. Sistem mencatat pesanan.
7. Pembayaran diproses.
8. Dapur menerima informasi pesanan.
9. Dapur menyiapkan makanan.
10. Status pesanan diperbarui hingga selesai.

Dari alur tersebut, kita mulai bisa mengidentifikasi kebutuhan aplikasi.

Ada proses untuk melihat menu, membuat pesanan, memproses pembayaran, dan memperbarui status pesanan.

Fitur seharusnya muncul sebagai kebutuhan untuk mendukung proses tersebut, bukan dibuat hanya karena terlihat menarik.

## 4. Pahami Siapa Mengelola Data dan Proses Apa yang Menghasilkan Data

Ini adalah bagian yang sangat penting dalam memahami sistem.

Setiap proses dalam aplikasi biasanya menghasilkan informasi baru atau mengubah informasi yang sudah ada.

Namun, kita perlu memahami bahwa **orang yang menjalankan proses belum tentu menjadi pihak yang menyimpan atau mengelola data secara teknis.**

Mari gunakan contoh aplikasi pemesanan makanan.

| Pelaku | Proses | Data yang dihasilkan atau diubah |
|---|---|---|
| Pelanggan | Mendaftar akun | Data pelanggan |
| Admin | Menambahkan menu | Data menu dan harga |
| Pelanggan | Membuat pesanan | Data pesanan |
| Pelanggan | Memilih makanan | Detail pesanan |
| Penyedia pembayaran | Memproses pembayaran | Hasil transaksi pembayaran |
| Dapur | Memperbarui proses memasak | Status persiapan pesanan |
| Kasir | Memeriksa pesanan | Informasi pesanan dan pembayaran yang dibaca |

Dari tabel tersebut, kita bisa melihat hubungan antara pelaku, proses, dan data.

Misalnya, ketika pelanggan membuat pesanan:

- Pelanggan memulai proses pemesanan.
- Pelanggan menentukan makanan yang ingin dibeli.
- Sistem membuat catatan pesanan.
- Sistem menyimpan informasi pesanan dan detail makanan yang dipilih.
- Kasir dan dapur dapat melihat informasi sesuai hak akses masing-masing.

Perhatikan bahwa pelanggan bukan pihak yang secara teknis menyimpan data pesanan ke database. Pelanggan hanya melakukan aktivitas yang memicu proses tersebut. Aplikasi bertanggung jawab mencatat dan menyimpan hasilnya.

Hal yang sama terjadi pada pembayaran.

Penyedia pembayaran memproses transaksi dan memberikan hasilnya. Aplikasi kemudian mencatat informasi transaksi serta status pembayaran agar dapat digunakan oleh bagian lain.

### Ada beberapa pertanyaan yang perlu dijawab

Ketika mempelajari data dalam sebuah sistem, jangan hanya bertanya data apa yang dibutuhkan.

Tanyakan juga:

1. Siapa yang menghasilkan atau memasukkan data?
2. Proses apa yang menyebabkan data tersebut dibuat?
3. Siapa yang boleh melihat data?
4. Siapa yang boleh mengubah data?
5. Siapa atau sistem apa yang bertanggung jawab menyimpan data?
6. Kapan data tersebut berubah?

Pertanyaan ini membantu kita memahami asal-usul data dan bagaimana data digunakan oleh berbagai bagian aplikasi.

### Data tidak selalu dibuat sekali lalu selesai

Data dalam aplikasi dapat berubah mengikuti proses bisnis.

Contohnya, sebuah pesanan makanan mungkin mengalami beberapa kondisi:

- Pesanan dibuat.
- Pembayaran berhasil.
- Pesanan sedang disiapkan.
- Pesanan selesai.

Informasi pesanan yang sama terus diperbarui selama proses berlangsung.

Artinya, kita tidak cukup hanya mengetahui data apa yang disimpan. Kita juga perlu memahami bagaimana data tersebut berubah dan siapa yang berhak mengubahnya.

Inilah salah satu dasar untuk memahami bagaimana sebuah sistem bekerja.

## 5. Di Mana Posisi AI dalam Proses Ini?

Setelah memahami pengguna, proses, dan data, barulah kita bisa mulai melibatkan AI untuk membantu membangun aplikasi.

AI dapat membantu banyak pekerjaan, seperti:

- Membuat rancangan antarmuka.
- Menyusun struktur database.
- Membuat kode program.
- Menghubungkan halaman dengan backend.
- Membantu membuat pengujian.
- Menemukan dan memperbaiki kesalahan.

Namun, AI membutuhkan konteks agar hasilnya sesuai dengan kebutuhan.

Jika kita hanya meminta AI membuat aplikasi pemesanan makanan, AI harus menebak banyak hal.

Apakah pelanggan harus membayar sebelum pesanan masuk ke dapur? Apakah kasir boleh mengubah pesanan? Apakah dapur boleh melihat informasi pembayaran? Bagaimana jika pembayaran gagal?

AI bisa memberikan jawaban atas pertanyaan tersebut, tetapi belum tentu sesuai dengan proses bisnis yang sebenarnya.

Karena itu, tugas kita bukan hanya memberikan prompt yang bagus. Kita perlu memberikan informasi dan aturan yang benar.

**AI membantu mengerjakan implementasi. Manusia tetap bertanggung jawab memahami kebutuhan dan menentukan bagaimana sistem seharusnya bekerja.**

## 6. Cara Berpikir Sebelum Melakukan Vibe Coding

Sebelum meminta AI membangun aplikasi, coba jawab lima pertanyaan berikut:

**1. Masalah apa yang ingin diselesaikan?**

Jelaskan kondisi yang sedang terjadi dan mengapa aplikasi dibutuhkan.

**2. Siapa saja yang akan menggunakan aplikasi?**

Identifikasi setiap pengguna dan tanggung jawabnya.

**3. Proses apa saja yang akan dijalankan?**

Gambarkan aktivitas pengguna dari awal sampai akhir.

**4. Data apa yang dibutuhkan?**

Identifikasi data yang dibuat, dari proses mana data berasal, siapa yang mengelola, dan siapa yang boleh mengaksesnya.

**5. Aturan apa yang harus dipatuhi sistem?**

Tentukan batasan dan kondisi yang harus berlaku. Misalnya, pesanan tidak boleh diteruskan ke dapur sebelum pembayaran berhasil, jika memang itu aturan bisnis yang digunakan.

Jawaban dari lima pertanyaan tersebut menjadi bekal awal untuk berkomunikasi dengan AI.

Kita tidak harus langsung mengetahui seluruh detail teknisnya. Namun, kita perlu memiliki gambaran yang cukup jelas tentang apa yang ingin dibangun dan bagaimana aplikasi tersebut seharusnya bekerja.

## Penutup

Membangun aplikasi dengan AI memang bisa mempercepat proses pengembangan.

Tetapi kecepatan membuat kode tidak selalu berarti kita sedang membangun sistem yang benar.

Sebuah aplikasi perlu memahami siapa penggunanya, bagaimana proses berlangsung, informasi apa yang dihasilkan, siapa yang mengelola informasi tersebut, dan aturan apa yang harus dijalankan.

Semakin jelas pemahaman kita terhadap sistem, semakin kecil ruang bagi AI untuk menebak kebutuhan.

Jadi, sebelum mulai melakukan Vibe Coding, jangan terburu-buru meminta AI membuat aplikasi.

**Pahami dulu sistem yang ingin dibangun.**

---

*Pada materi berikutnya, kita akan membahas lebih dalam tentang data: bagaimana mengenali jenis data, hubungan antar-data, dan bagaimana informasi tersebut membentuk struktur sebuah aplikasi.*
