---
layout: article
title: "CPU 12%, RAM 11%, Tapi Error Ribuan. Masalahnya Bukan di Server"
date: 2025-12-22T09:34:00+07:00
permalink: /2025/12/cpu-12-ram-11-tapi-error-ribuan.html
categories:
  - "Infrastructure"
tags:
  - "case-study"
  - "devops"
  - "server-management"
image: "/assets/images/posts/2025-12-22-cpu-12-ram-11-tapi-error-ribuan-masalahnya-bukan-di-server-1.png"
excerpt: "Hari ini saya melakukan audit dan maintenance rutin pada server milik salah satu platform Edu-Tech nasional. Sekilas, jika hanya melihat dashboard monitoring, semuan"
migrated_from: "https://www.mrohadiz.my.id/2025/12/cpu-12-ram-11-tapi-error-ribuan.html"
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!--
META_DESCRIPTION: Audit dan optimasi server untuk mengatasi error meski CPU dan RAM dalam batas normal.
USULAN_JUDUL_1: Mengatasi Error Ribuan pada Server Edu-Tech dengan Optimasi
USULAN_JUDUL_2: CPU 12%, RAM 11%, Tapi Error Ribuan: Solusi Optimasi
USULAN_JUDUL_3: Optimasi Server: Mengatasi Error Tanpa Upgrade
-->

<div class="post-container">
<p>Hari ini saya melakukan audit dan maintenance rutin pada server milik salah satu platform Edu-Tech nasional. Sekilas, jika hanya melihat <i>dashboard</i> monitoring, semuanya tampak "hijau royo-royo".</p>
<div class="separator">
<a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhXyWwMaRfzrN6SHzAQ6V6mDYjWIpJDAFpBAFeUYytDjle2t8weNd4ErI_IqNVDst0d78tTGcsxEDa0tj2bqgZ1bjCp1wqGRrxK8UVCLNynsvrAh1B3BeQ5QosPPMi29rNxqn8IjXbSSE8lQ-k4o2-jYW357qHHyeNVKsuytIgyNnhSaidOTU7gBgYegQS/s2752/trafik%20analis%20-mrohadiz.my.id.png">
<img src="{{ '/assets/images/posts/2025-12-22-cpu-12-ram-11-tapi-error-ribuan-masalahnya-bukan-di-server-1.png' | relative_url }}" alt="Monitoring Server Edu-Tech" />
</a>
</div>
<br />
<div class="highlight-box">
<strong>Data Statistik Server:</strong>
<ul>
<li>Trafik: Ratusan ribu request per bulan</li>
<li>CPU Usage: ~12%</li>
<li>RAM Usage: ~11%</li>
<li>Disk Space: Masih sangat lega</li>
</ul>
</div>

<p>Di atas kertas, server ini terlihat sangat sehat. Namun, ketika saya masuk ke dalam dan membuka log Nginx, saya menemukan <strong>puluhan ribu error 4xx</strong> dan <strong>ribuan error 5xx</strong>. Ini adalah titik krusial yang sering dilupakan: <strong>Server Sehat ≠ Akses Stabil.</strong></p>

<p>Setiap error yang muncul di log adalah potensi kehilangan akses bagi pengguna. Pengguna gagal mengakses, biaya iklan terbuang sia-sia, dan skor SEO pelan-pelan merosot karena Google menganggap situs tidak stabil.</p>

<h2>Diagnosa: Akar Masalah Bukan di Hardware</h2>
<p>Banyak orang memiliki refleks yang salah saat melihat error: <i>"Upgrade server saja, mungkin tidak kuat."</i> Padahal, setelah saya teliti lebih dalam, masalahnya sama sekali bukan karena kurangnya <i>resource</i>. Berikut adalah temuan teknis utamanya:</p>
<ul>
<li><strong>Dominasi Error 4xx:</strong> Banyak request ke endpoint tidak valid, serangan bot scanner, dan URL lama yang sudah tidak relevan tetapi masih diakses.</li>
<li><strong>Munculnya Error 5xx:</strong> Bukan karena RAM penuh, tetapi masalah di <i>PHP-FPM handling</i> dan request abnormal yang lolos ke backend.</li>
<li><strong>Log Sistem Menumpuk:</strong> Journal log mencapai ratusan MB. Tidak fatal, tetapi membuat proses troubleshooting menjadi lambat dan berat.</li>
</ul>

<blockquote class='s1'>
"Masalah ada di layer konfigurasi dan aplikasi, bukan di spesifikasi hardware."
</blockquote>

<h2>Optimasi Pertama, Upgrade Kemudian 🛠️</h2>
<p>Sesuai dengan filosofi kerja saya, saya lebih memilih untuk mengoptimalkan apa yang sudah ada. Berikut adalah langkah-langkah implementasinya:</p>

<h3>1. Pemeliharaan Sistem &amp; Paket</h3>
<p>Perbarui paket OS dan security patch untuk memastikan tidak ada celah keamanan yang terbuka. Server yang rapi adalah server yang <i>predictable</i>.</p>

<h3>2. Pembersihan Log &amp; Kebersihan Disk</h3>
<p>Saya membersihkan <pre><code>/var/log</code></pre> dan journal logs untuk mengurangi ukuran file log yang berlebihan dan mempercepat proses troubleshooting.</p>

<h3>3. Analisis dan Penanganan Error</h3>
<p>Melakukan analisis lebih lanjut terhadap error 4xx dan 5xx untuk mengidentifikasi pola dan sumber masalah. Implementasi <a href="http://www.mrohadiz.my.id/2026/01/arsitektur-raw-tracking-strategi.html">strategi deteksi bot</a> dapat membantu mengurangi error yang disebabkan oleh bot scanner.</p>

<h3>4. Optimasi Konfigurasi PHP-FPM</h3>
<p>Melakukan penyesuaian pada konfigurasi <i>PHP-FPM</i> untuk menangani request dengan lebih efisien, termasuk pengaturan <a href="http://www.mrohadiz.my.id/2026/01/studi-kasus-audit-maintenance-server.html">pool size</a> dan <a href="http://www.mrohadiz.my.id/2026/01/upgrade-server-bukan-solusi-misteri.html">timeout settings</a>.</p>

<h3>5. Monitoring Berkelanjutan</h3>
<p>Implementasi sistem monitoring yang lebih baik untuk memantau performa server secara real-time dan mendeteksi potensi masalah sebelum menjadi kritis.</p>

<p>Dengan langkah-langkah ini, server dapat beroperasi dengan lebih stabil dan mengurangi jumlah error yang terjadi, tanpa perlu melakukan upgrade hardware.</p>
</div>
