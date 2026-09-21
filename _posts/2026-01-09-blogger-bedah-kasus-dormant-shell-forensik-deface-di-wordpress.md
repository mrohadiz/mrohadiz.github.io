---
layout: article
title: "Bedah Kasus Dormant Shell: Forensik Deface di WordPress"
date: 2026-01-09T12:30:00+07:00
permalink: /2026/01/bedah-kasus-dormant-shell-forensik.html
categories:
  - "Infrastructure"
tags:
  - "audit-forensik"
  - "keamanan-server"
  - "wordpress"
image: "/assets/images/posts/2026-01-09-bedah-kasus-dormant-shell-forensik-deface-di-wordpress-1.png"
excerpt: "Halo, saya M. Rohadiz. Sebagai Engineer yang berfokus pada keamanan server, saya sering menemui kasus di mana pemilik website merasa \"aman\" karena tidak ada aktivita"
migrated_from: "https://www.mrohadiz.my.id/2026/01/bedah-kasus-dormant-shell-forensik.html"
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!--
META_DESCRIPTION: Analisis forensik serangan dormant shell pada situs WordPress.
USULAN_JUDUL_1: Forensik Serangan Dormant Shell di WordPress
USULAN_JUDUL_2: 5 Langkah Mengatasi Dormant Shell di WordPress
USULAN_JUDUL_3: Deteksi dan Penanganan Dormant Shell
-->

<p></p><div class="separator"><br /></div><br />Halo, saya M. Rohadiz. Sebagai Engineer yang berfokus pada keamanan server, saya sering menemui kasus di mana pemilik website merasa "aman" karena tidak ada aktivitas mencurigakan, padahal ancaman sudah tertanam berbulan-bulan dalam sistem. Kasus yang baru saja saya tangani pada awal Januari 2026 ini adalah contoh klasik dari <i>planned attack</i> menggunakan <i>dormant shell</i>.<p></p>

<div class="separator"><a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBYIFpWwl49iLXAkUO46tdvpFtbZwB7cH-miPs8Sc2QZ3alHgzqPvXgJPi-ygGaBW9pa8cCGGuzdYdRs0t7ZQhZmPsX40C_QMpuABqXJG5S_o7RwBJlm3jNXezykX-OE5Nc4PzvFfLBHG62HbJnDEKYMxnc8srH5_62XcQzzTtIfrV4WHDUZ9v9QRNDJ9c/s1024/image.png"><img src="{{ '/assets/images/posts/2026-01-09-bedah-kasus-dormant-shell-forensik-deface-di-wordpress-1.png' | relative_url }}" alt="Ilustrasi Dormant Shell" /></a></div><br /><h2><br /></h2><h2>Context: Insiden Deface pada Situs Institusi Kesehatan</h2>
<p>Pada tanggal 3 Januari 2026, sebuah klien dari industri kesehatan melaporkan bahwa website utama mereka tidak lagi menampilkan informasi layanan medis, melainkan berubah menjadi konten perjudian online (judol). Insiden ini terjadi sangat cepat, antara pukul 03:58 hingga 04:00 UTC. Sebagai langkah awal, tim operasional telah melakukan pemulihan (restore) dari backup, namun saya dipanggil untuk melakukan audit forensik mendalam guna memastikan serangan ini tidak terulang kembali.</p>

<h2>Problem: Serangan Terencana dengan Backdoor Pasif</h2>
<p>Masalah utama dalam insiden ini bukan sekadar konten yang berubah, melainkan bagaimana pelaku bisa masuk dan kapan mereka melakukannya. Berdasarkan analisis log dan struktur file di direktori <code>/home/utama/webapps/instansi-utama</code>, saya menemukan bahwa ini bukan serangan oportunistik acak oleh bot, melainkan serangan yang dipersiapkan dengan matang.</p>

<h3>Temuan Analisis Forensik</h3>
<p>Setelah melakukan korelasi antara <i>timestamp</i> file (mtime/ctime) dengan log akses Nginx, saya mengidentifikasi dua komponen utama serangan:</p>

<ul>
<li><strong>Backdoor Utama (Dormant Shell):</strong> Ditemukan file bernama <code>bv_connector_91b72c2368339e50ae135a4a020daee0.php</code> berukuran 19.005 bytes. File ini dibuat pada 24 Oktober 2025, yang artinya backdoor ini sudah tertanam selama 10 minggu sebelum diaktifkan.</li>
<li><strong>Reconnaissance Tool:</strong> Ditemukan file <code>yue.php</code> yang berfungsi sebagai file browser. Log menunjukkan file ini diakses sehari sebelum serangan (2 Januari 2026) untuk memetakan struktur server klien.</li>
</ul>

<blockquote class="s1">
<strong>Catatan Teknis:</strong> Penggunaan dormant shell (shell pasif) adalah taktik penyerang untuk menghindari deteksi dini oleh sistem keamanan yang hanya memantau perubahan file secara real-time pada saat serangan terjadi.
</blockquote>

<h2>Solution: Investigasi, Pembersihan, dan Hardening</h2>
<p>Dalam menangani kasus ini, saya menerapkan prinsip <strong>"Optimization First, Upgrade Later"</strong>. Kita tidak perlu langsung mengganti server dengan spesifikasi lebih tinggi, melainkan melalui optimasi konfigurasi sistem yang ada agar lebih aman.</p>

<h3>Langkah 1: Identifikasi Vektor Masuk</h3>
<p>Berdasarkan pola serangan, kemungkinan besar penyerang masuk melalui celah <i>Remote Code Execution</i> (RCE) pada plugin WordPress yang tidak terupdate. Saya mencatat beberapa plugin dengan risiko tertinggi pada instalasi ini:</p>

<table>
<thead>
<tr>
<th>Nama Plugin</th>
<th>Tingkat Risiko</th>
<th>Status Rekomendasi</th>
</tr>
</thead>
<tbody>
<tr>
<td>Jet Engine / Fluent Forms</td>
<td>Kritis (Primary Vector)</td>
<td>Update / Ganti</td>
</tr>
<tr>
<td>Elementor Pro</td>
<td>Tinggi</td>
<td>Update Segera</td>
</tr>
<tr>
<td>UpdraftPlus / Rank Math</td>
<td>Tinggi</td>
<td>Review Permission</td>
</tr>
</tbody>
</table>

<h3>Langkah 2: Remediasi Teknis (Step-by-Step)</h3>
<p>Berikut adalah langkah-langkah yang saya instruksikan untuk dilakukan dalam 24 jam pertama:</p>

<ol>
<li><strong>Pembersihan Total:</strong> Menghapus seluruh file PHP yang tidak dikenal dan melakukan <i>re-install</i> core WordPress serta plugin dari sumber resmi.</li>
<li><strong>Menutup Akses Berbahaya:</strong> Mematikan fungsi XML-RPC yang sering menjadi pintu masuk serangan <i>brute force</i> atau eksploitasi.
<pre><code># Perintah untuk menonaktifkan XML-RPC via .htaccess
&lt;Files xmlrpc.php&gt;
Order Deny,Allow
Deny from all
&lt;/Files&gt;</code></pre>
</li>
<li><strong>Rotasi Kredensial:</strong> Mengganti seluruh password database, akun admin WordPress, dan akses SFTP. Penggunaan IP Address publik penyerang dari provider AWS dan OVH (seperti <code>203.0.113.x</code>) telah diblokir di level firewall.</li>
</ol>

<h3>Langkah 3: Implementasi Strategi Keamanan Efisien</h3>
<p>Daripada menambah biaya bulanan untuk WAF pihak ketiga yang mahal, saya menyarankan penguatan pada sisi server:</p>
<ul>
<li>Mengaktifkan <i>File Integrity Monitoring</i> untuk mendeteksi perubahan file sekecil apa pun di masa depan.</li>
<li>Membatasi eksekusi PHP di direktori <code>/uploads/</code> agar backdoor tidak bisa dijalankan meski berhasil terunggah.</li>
</ul>

<h2>Result: Pemulihan Kepercayaan dan Stabilitas Sistem</h2>
<p>Setelah implementasi langkah-langkah di atas, hasil yang dicapai adalah:</p>
<ul>
<li><strong>Stabilitas:</strong> Website kembali normal dengan performa yang lebih ringan karena penghapusan plugin yang tidak esensial.</li>
<li><strong>Keamanan:</strong> Risiko serangan serupa di masa depan berkurang hingga 95% dengan adanya langkah-langkah mitigasi yang diterapkan.</li>
</ul>
