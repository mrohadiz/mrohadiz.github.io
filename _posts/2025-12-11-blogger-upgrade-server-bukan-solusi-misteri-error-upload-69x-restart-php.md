---
layout: article
title: "Upgrade Server Bukan Solusi: Misteri Error Upload & 69x Restart PHP"
date: 2025-12-11T13:25:00+07:00
permalink: /2025/12/upgrade-server-bukan-solusi-misteri.html
categories:
  - "Infrastructure"
tags:
  - "cost-efficiency"
  - "devops"
  - "php-fpm"
  - "server-audit"
  - "studi-kasus"
  - "troubleshooting"
image: "/assets/images/blogger/2025-12-11-blogger-upgrade-server-bukan-solusi-misteri-error-upload-69x-restart-php-1.png"
excerpt: "Anda mengelola Platform Layanan Kesehatan Digital dengan ribuan pengguna aktif. Tim marketing sedang beriklan, namun fitur penting—upload gambar/dokumen—mengalami ga"
migrated_from: "https://www.mrohadiz.my.id/2025/12/upgrade-server-bukan-solusi-misteri.html"
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!--
META_DESCRIPTION: Upgrade server tidak menyelesaikan masalah upload. Temukan penyebab dan solusinya di sini.
USULAN_JUDUL_1: Mengatasi Error Upload Tanpa Upgrade Server
USULAN_JUDUL_2: Solusi Error Upload: 69x Restart PHP
USULAN_JUDUL_3: Diagnosa Error Upload di Server
-->

<div class="konten-blog">

<p>Anda mengelola <strong>Platform Layanan Kesehatan Digital</strong> dengan ribuan pengguna aktif. Tim marketing sedang beriklan, namun fitur penting—upload gambar/dokumen—mengalami gangguan.</p>

<div class="separator">
<a href="{{ '/assets/images/blogger/2025-12-11-blogger-upgrade-server-bukan-solusi-misteri-error-upload-69x-restart-php-1.png' | relative_url }}">
<img alt="Grafik Error Upload" src="{{ '/assets/images/blogger/2025-12-11-blogger-upgrade-server-bukan-solusi-misteri-error-upload-69x-restart-php-1.png' | relative_url }}" />
</a>
</div>

<div class="box-alert">
"File upload error - unable to create a temporary file in Unknown on line 0"
</div>

<p>Reaksi pertama banyak orang adalah panik. Reaksi kedua adalah menganggap <em>"Servernya penuh, harus upgrade!"</em> atau <em>"Ganti versi PHP sekarang!"</em></p>

<p>Minggu ini, saya melakukan audit mendalam pada server produksi klien yang mengalami masalah ini. Spesifikasinya adalah <strong>4 Core CPU, 8GB RAM, SSD NVMe</strong>. Namun, saat saya masuk ke terminal, saya menemukan bahwa masalahnya bukan karena spesifikasi server, melainkan karena "kepanikan" yang memicu reaksi berantai di level sistem operasi.</p>

<p>Berikut penjelasannya.</p>

<div class="separator">
<a href="{{ '/assets/images/blogger/2025-12-11-blogger-upgrade-server-bukan-solusi-misteri-error-upload-69x-restart-php-2.png' | relative_url }}">
<img alt="Log Analisis" src="{{ '/assets/images/blogger/2025-12-11-blogger-upgrade-server-bukan-solusi-misteri-error-upload-69x-restart-php-2.png' | relative_url }}" />
</a>
</div>

<hr />

<h2>🕵️ Diagnosis: Jejak Digital Kepanikan</h2>

<p>Selama audit logs (<code>journalctl</code> dan <code>nginx error log</code>), server menunjukkan tanda-tanda masalah. Berikut data mentah yang ditemukan:</p>

<ul>
<li><strong>Swap Membengkak:</strong> Dari total 8GB RAM, <strong>Swap Used mencapai 2.8GB</strong>. Ini menunjukkan server sedang <em>swapping</em> parah, yang berdampak pada performa.</li>
<li><strong>Slow Queries Menumpuk:</strong> Terdapat <strong>696.604 slow queries</strong> di database, mengindikasikan antrian yang tidak efisien.</li>
<li><strong>The Smoking Gun (Penyebab Utama):</strong> Di log PHP-FPM, terdapat pola <em>switching</em> versi PHP yang tidak wajar.</li>
</ul>

<blockquote class='s1'>
<p><em>Tercatat pada tanggal 9 Desember, ada <strong>69 kali percobaan start PHP 7.4 dalam waktu 2 jam</strong>.</em></p>
</blockquote>

<p>Tim teknis internal mungkin mencoba memperbaiki masalah dengan bergonta-ganti versi PHP secara cepat (Rapid Switching). Meskipun niatnya baik, eksekusi yang terlalu agresif tanpa memberi jeda pada <code>systemd</code> menyebabkan masalah.</p>

<p>Akibatnya, terjadi <strong>Race Condition</strong>. Sistem operasi belum selesai mematikan proses lama dan membersihkan <em>temporary directory</em>, namun sudah dipaksa menyalakan proses baru. Hal ini mengakibatkan direktori <code>/tmp</code> yang digunakan oleh PHP menjadi <em>corrupt</em> atau "hilang" dari pandangan service PHP.</p>

<hr />

<h2>🛠️ Tindakan: Tenang, Jangan Asal Upgrade</h2>

<p>Klien hampir memutuskan untuk upgrade server karena mengira <em>disk space</em> penuh. Namun, upgrade server <strong>TIDAK AKAN</strong> menyelesaikan masalah konfigurasi systemd yang rusak.</p>

<p>Berikut langkah-langkah yang saya lakukan:</p>

<h3>1. Analisis PrivateTmp=yes</h3>
<p>Service PHP-FPM di server modern menggunakan fitur keamanan <code>PrivateTmp=yes</code>. Artinya, PHP tidak menggunakan <code>/tmp</code> umum, melainkan membuat folder rahasia sendiri (isolated). Karena <em>switching</em> yang tidak teratur, folder rahasia ini gagal dibuat ulang dengan benar.</p>

<h3>2. The Clean Restart (Bukan Reload)</h3>
<p>Saya melakukan <em>graceful restart</em> pada service PHP 8.1, memastikan proses lama benar-benar mati, dan membiarkan systemd membuat ulang struktur direktori temporary yang bersih.</p>

<pre><code>root@server:~# systemctl restart php81rc-fpm
# Command yang menyelamatkan situasi</code></pre>

<h3>3. Audit Resource (Bonus Optimisasi)</h3>
<p>Saya juga menemukan <strong>VSCode Server</strong> memakan 10% memori dan 3 instance layanan notifikasi WA berjalan bersamaan. Saya memberikan rekomendasi limitasi memori agar server dapat beroperasi lebih efisien.</p>

<hr />

<h2>📊 Hasil: Sebelum vs Sesudah</h2>

<p>Hanya dalam hitungan menit setelah diagnosis yang tepat:</p>

<ul>
<li>❌ <strong>Sebelum:</strong> Upload file gagal 100%, tim admin mengalami tekanan, antrian komplain user menumpuk.</li>
<li>✅ <strong>Sesudah:</strong> Fitur upload berfungsi dengan baik. Direktori temporary kembali bersih.</li>
<li>💰 <strong>Efisiensi:</strong> Klien <strong>TIDAK PERLU</strong> mengeluarkan biaya untuk upgrade server bulan ini.</li>
</ul>

<p><strong>Status Akhir:</strong><br />
✅ <strong>RESOLVED</strong> - Upload berfungsi normal.<br />
⚠️ <strong>MONITORING</strong> - Perlu optimalisasi Query Database (690k slow queries menjadi perhatian selanjutnya).</p>

<hr />

<h2>💡 Kesimpulan: Sabar itu Bagian dari Skill Teknis</h2>

<p>Pelajaran dari kasus ini:</p>
<ol>
<li><strong>Jangan Spam Restart:</strong> Saat mengubah konfigurasi server (terutama versi PHP), beri jeda 30-60 detik. Biarkan server "tarik napas".</li>
<li><strong>Upgrade Server itu Opsi Terakhir:</strong> Masalah <em>permission</em> tidak akan teratasi dengan menambah RAM.</li>
<li><strong>Audit Log adalah Kunci:</strong> Jangan menebak-nebak. Data di log tidak pernah berbohong.</li>
</ol>

<p>Jika Anda memiliki server dengan trafik tinggi namun sering mengalami gangguan tanpa alasan jelas, pertimbangkan untuk melakukan audit konfigurasi sebelum memutuskan untuk upgrade server. Untuk informasi lebih lanjut tentang audit server, Anda dapat membaca artikel <a href="http://www.mrohadiz.my.id/2026/01/studi-kasus-audit-maintenance-server.html">ini</a> dan <a href="http://www.mrohadiz.my.id/2025/12/cpu-12-ram-11-tapi-error-ribuan.html">artikel ini</a>.</p>

<div class="box-cta">
<strong>🔥 Butuh Audit Server & Strategi Efisiensi Biaya</strong>
</div>

</div>
