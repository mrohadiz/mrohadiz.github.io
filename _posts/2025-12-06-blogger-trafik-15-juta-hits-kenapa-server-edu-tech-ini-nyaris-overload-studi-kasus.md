---
layout: article
title: "Trafik 15 Juta Hits: Kenapa Server Edu-Tech Ini Nyaris Overload? (Studi Kasus)"
date: 2025-12-06T18:18:00+07:00
permalink: /2025/12/trafik-15-juta-hits-kenapa-server-edu.html
categories:
  - "Infrastructure"
tags:
  - "case-study"
  - "devops"
  - "server-optimization"
image: "/assets/images/posts/2025-12-06-trafik-15-juta-hits-kenapa-server-edu-tech-ini-nyaris-overload-studi-kasus-1.png"
excerpt: "Menghadapi skala trafik nasional memerlukan ketenangan dalam pengambilan keputusan teknis. Seringkali, solusi instan yang muncul saat performa menurun adalah melakuk"
migrated_from: "https://www.mrohadiz.my.id/2025/12/trafik-15-juta-hits-kenapa-server-edu.html"
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!--
META_DESCRIPTION: Analisis teknis trafik tinggi pada server Edu-Tech dan langkah optimasi yang diterapkan.
USULAN_JUDUL_1: Mengatasi Trafik 15 Juta Hits pada Server Edu-Tech
USULAN_JUDUL_2: Optimasi Server Edu-Tech untuk 15 Juta Hits: Solusi Tanpa Upgrade
USULAN_JUDUL_3: Stabilitas Server Edu-Tech di Tengah Lalu Lintas Tinggi
-->

<p>Menghadapi skala trafik nasional memerlukan ketenangan dalam pengambilan keputusan teknis. Seringkali, solusi instan yang muncul saat performa menurun adalah melakukan <i>upgrade hardware</i>. Namun, dalam praktik yang saya jalani, optimasi konfigurasi dan audit mendalam terhadap sistem yang ada merupakan langkah pertama yang jauh lebih efisien sebelum memutuskan untuk menambah biaya langganan server.</p>
<div class="separator"><a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXUGLLGg-qaOEoTHW6yb8rcGRIOIsuI2NDn7M0x8J8IN2aWviC9HwG4uQl3pBYHnMzj_24zq_zQKqFro5IkFiHMuIMA4pj1P5OpvtLB8_P9URG5Nc6rWgbN2eObMzyj5Y-mNQYonJBEhINhr7SMhCXwTu8cCoxQUYWmCv4OHAmw20poLp5_og0-mMy2VDY/s1040/image.png"><img src="{{ '/assets/images/posts/2025-12-06-trafik-15-juta-hits-kenapa-server-edu-tech-ini-nyaris-overload-studi-kasus-1.png' | relative_url }}" alt="Server Edu-Tech" /></a></div><br /><p><br /></p>

<p>Baru-baru ini, saya melakukan audit dan pemeliharaan pada sebuah infrastruktur platform <i>Edu-Tech</i>. Trafik yang tinggi, penggunaan memori yang mulai kritis, dan laporan kegagalan pada fungsi-fungsi penting di sisi pengguna menjadi fokus utama.</p>

<h2>Context &amp; Problem: Tekanan Trafik dan Risiko Downtime</h2>

<p>Setelah melakukan inspeksi pada terminal <code>Server-Prod-Main</code> di IP 203.0.113.x, saya menemukan statistik penggunaan yang cukup intensif. Dalam kurun waktu 30 hari, satu <i>node</i> server ini harus melayani beban kerja yang signifikan:</p>

<ul>
<li><strong>Aplikasi Pembelajaran Inti:</strong> 6.3 Juta Request</li>
<li><strong>Sistem Ujian Penempatan:</strong> 4.45 Juta Request</li>
<li><strong>Web Utama:</strong> 3.33 Juta Request</li>
</ul>

<p>Secara akumulatif, server menangani lebih dari 15 juta <i>hits</i> per bulan. Dengan spesifikasi 32 GB RAM, penggunaan memori sudah menyentuh angka 22.6 GB (70%). Secara teknis, ini adalah zona kuning. Jika terjadi lonjakan trafik sebesar 50% saja—misalnya saat musim pendaftaran siswa baru—proyeksi penggunaan memori akan melampaui kapasitas fisik (105%) yang berujung pada kondisi <i>Out of Memory</i> (OOM) dan <i>crash</i> sistem.</p>

<p>Gejala awal sudah mulai terlihat dengan munculnya ribuan log <i>Error 5xx</i> pada aplikasi pendaftaran, yang secara langsung mengganggu alur konversi pengguna.</p>

<h2>Deep Analysis: Akar Masalah di Balik Resource yang Menipis</h2>

<p>Melalui pemantauan internal, saya mengidentifikasi beberapa faktor yang menyebabkan degradasi performa ini bukan semata-mata karena kurangnya spesifikasi, melainkan masalah manajemen <i>resource</i>:</p>

<h3>1. Akumulasi Log dan Cache</h3>
<p>Server ini memiliki waktu aktif (<i>uptime</i>) selama 77 hari tanpa pembersihan rutin. Log sistem keamanan seperti CrowdSec membengkak hingga ratusan MB, ditambah dengan file log lama yang tidak terkompresi, menghabiskan ruang disk dan membebani proses I/O.</p>

<h3>2. Keberadaan "Zombie Service"</h3>
<p>Saya menemukan beberapa layanan internal seperti <i>db-admin</i> dan <i>docker-manager</i> yang mengalami miskonfigurasi. Meskipun tidak aktif digunakan, layanan ini terus mencoba menjalankan proses yang gagal, mengonsumsi siklus CPU dan RAM hanya untuk menghasilkan log error.</p>

<h3>3. Konsumsi Memori Database</h3>
<p>Layanan database mengonsumsi sekitar 14 GB RAM. Meski wajar untuk trafik tinggi, terdapat indikasi memori yang "tersangkut" pada proses PHP-FPM yang tidak menutup dengan sempurna (<i>memory leak</i>), sehingga ruang kosong tidak segera kembali ke sistem.</p>

<h2>The Solution: Langkah Optimasi Bertahap</h2>

<p>Alih-alih menyarankan penambahan RAM, saya memilih pendekatan "Deep Clean" dan tuning performa. Berikut adalah langkah-langkah teknis yang saya implementasikan:</p>

<h3>1. Pembersihan Log dan Journal</h3>
<p>Langkah pertama adalah membebaskan ruang dan mengurangi beban kerja sistem manajemen log dengan melakukan rotasi dan pembersihan manual pada <i>systemd journal</i>:</p>

<pre><code># Membersihkan journal log yang lebih lama dari 2 hari
journalctl --vacuum-time=2d

# Menjalankan logrotate secara paksa untuk mengompresi log lama

logrotate -f /etc/logrotate.conf</code></pre>

<h3>2. Eliminasi Layanan Tidak Efisien</h3>
<p>Saya menonaktifkan layanan yang tidak memberikan kontribusi pada operasional produksi namun membebani sistem. Hal ini secara instan menghentikan banjir log <i>Error 5xx</i> internal.</p>

<h3>3. Tuning PHP-FPM dan Memory Management</h3>
<p>Untuk menangani memori yang tersangkut, saya melakukan optimasi pada konfigurasi PHP-FPM dan melakukan <i>restart</i> terukur pada layanan terkait. Hal ini bertujuan untuk membebaskan <i>buffer</i> yang tidak lagi diperlukan oleh sistem tanpa mengganggu koneksi pengguna yang sedang aktif.</p>

<blockquote class="s1">
<strong>Catatan Teknis:</strong> Melakukan restart service pada trafik tinggi memerlukan parameter <i>graceful reload</i> agar tidak memutus sesi transaksi database yang sedang berjalan.
</blockquote>

<h3>4. Penguatan Keamanan Sistem</h3>
<p>Optimasi tidak lengkap tanpa penguatan benteng pertahanan. Dari log audit, tercatat ada 642 serangan SSH <i>brute force</i> dan 3.501 serangan <i>bot scanner</i> pada protokol HTTP. Saya memperbarui <i>ruleset</i> pada <i>firewall</i> dan sistem keamanan untuk memastikan <i>resource</i> tidak habis digunakan oleh trafik ilegal.</p>

<h2>The Result: Stabilitas Tanpa Biaya Tambahan</h2>

<p>Proses pemeliharaan ini memakan waktu kurang lebih satu jam tanpa menyebabkan <i>downtime</i> pada layanan. Hasilnya cukup signifikan:</p>

<ul>
<li><strong>Efisiensi Resource:</strong> Penggunaan memori turun secara stabil. Buffer/Cache berhasil dibebaskan sebesar 2.4 GB, memberikan ruang yang cukup untuk
