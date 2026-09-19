---

layout: article
title: "Server Tidak Dibangun Berdasarkan Jumlah Visitor"
date: 2026-09-19
categories:

- Infrastructure
  tags:
- capacity-planning
- observability
- infrastructure
- cloudflare
- server
- website
  excerpt: "Jumlah visitor sering digunakan sebagai dasar memilih hosting atau server. Padahal kebutuhan infrastruktur lebih dipengaruhi oleh jenis traffic, pola akses, filtering layer, dan request yang benar-benar mencapai origin server."

---

Ringkasan

Saat merencanakan infrastruktur website, banyak orang menggunakan jumlah visitor sebagai dasar perhitungan.

Pendekatan ini terlihat sederhana, tetapi sering menghasilkan keputusan yang kurang tepat.

Server tidak bekerja berdasarkan jumlah visitor. Server bekerja berdasarkan request yang harus diproses. Karena itu, dua website dengan jumlah visitor yang sama dapat menghasilkan beban infrastruktur yang sangat berbeda.

Kesalahan Umum dalam Capacity Planning

Model yang sering digunakan:

Jumlah Visitor
↓
Pilih Hosting

Masalahnya, visitor hanyalah salah satu variabel yang mempengaruhi beban sistem.

Dua website dengan 100.000 visitor dapat menghasilkan jumlah request, konsumsi CPU, penggunaan database, dan kebutuhan bandwidth yang sangat berbeda.

Visitor Bukan Satu-Satunya Sumber Load

Ketika sebuah website semakin populer, traffic yang datang tidak hanya berasal dari manusia.

Beberapa sumber load yang perlu diperhitungkan:

Human Traffic

Traffic yang memang diharapkan oleh bisnis.

Contoh:

- SEO
- Ads
- Email Marketing
- Social Media
- Affiliate

Discovery Traffic

Traffic yang muncul karena website semakin terlihat.

Contoh:

- Googlebot
- Bingbot
- GPTBot
- ClaudeBot
- AhrefsBot
- SemrushBot

Semakin tinggi visibilitas sebuah website, semakin aktif proses crawling yang terjadi.

Infrastructure Traffic

Traffic yang dihasilkan oleh arsitektur aplikasi.

Contoh:

- API Request
- AJAX Request
- Asset Loading
- Websocket Connection
- Background Process

Satu visitor dapat menghasilkan puluhan hingga ratusan request.

Adversarial Traffic

Traffic yang tidak memberikan nilai bisnis tetapi tetap mengonsumsi resource.

Contoh:

- Scraper
- Scanner
- Credential Stuffing
- Aggressive Bot
- Layer 7 Flood

Traffic jenis ini sering diabaikan saat melakukan proyeksi kapasitas.

Filtering Lebih Penting daripada Menambah Resource

Tidak semua request harus sampai ke origin server.

Lapisan filtering dapat mengurangi beban yang harus diproses oleh aplikasi.

Contoh:

Visitor
↓
CDN
↓
Cache
↓
WAF
↓
Bot Management
↓
Origin Server

Tujuan utama filtering adalah mengurangi request yang benar-benar mencapai origin.

Karena itu, peningkatan kapasitas tidak selalu berarti menambah CPU atau RAM.

Dalam banyak kasus, memperbaiki filtering menghasilkan dampak yang lebih besar.

Framework Capacity Planning yang Lebih Praktis

Sebelum memilih provider atau menentukan spesifikasi server, lakukan evaluasi berikut:

1. Identifikasi aktivitas bisnis yang akan menghasilkan traffic.
2. Estimasi pola akses dan waktu terjadinya traffic.
3. Petakan jenis traffic yang mungkin muncul.
4. Identifikasi traffic yang perlu difilter.
5. Estimasikan request yang benar-benar mencapai origin.
6. Hitung kebutuhan resource berdasarkan origin load.

Model sederhananya:

Aktivitas Bisnis
↓
Traffic Source
↓
Traffic Type
↓
Filtering Layer
↓
Origin Load
↓
Infrastructure Capacity

Mengapa Ini Penting

Kesalahan dalam capacity planning sering bukan karena estimasi visitor yang salah.

Kesalahan terjadi karena organisasi menggunakan metrik yang kurang tepat untuk mengambil keputusan.

Visitor menunjukkan demand.

Origin load menunjukkan pekerjaan yang harus dilakukan sistem.

Keduanya tidak selalu bergerak dengan angka yang sama.

Checklist

Sebelum memilih hosting atau provider:

- Apakah sumber traffic sudah dipetakan?
- Apakah crawler dan bot sudah diperhitungkan?
- Apakah ada kemungkinan traffic tidak diinginkan?
- Apakah filtering layer sudah direncanakan?
- Apakah cache strategy sudah ditentukan?
- Apakah origin load sudah diproyeksikan?
- Apakah kebutuhan resource dihitung berdasarkan origin load?

Penutup

Jumlah visitor adalah indikator bisnis.

Origin load adalah indikator infrastruktur.

Saat melakukan capacity planning, fokus utama seharusnya bukan berapa banyak visitor yang datang, tetapi berapa banyak request yang benar-benar harus diproses oleh sistem.
