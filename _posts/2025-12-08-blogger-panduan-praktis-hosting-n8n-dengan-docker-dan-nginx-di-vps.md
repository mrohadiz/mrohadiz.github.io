---
layout: article
title: "Panduan Praktis Hosting n8n dengan Docker dan NGINX di VPS"
date: 2025-12-08T03:45:55+07:00
permalink: /2025/12/panduan-praktis-hosting-n8n-dengan.html
categories:
  - "Infrastructure"
tags:
  - "devops"
  - "infrastruktur"
  - "server-management"
image: "/assets/images/blogger/2025-12-08-blogger-panduan-praktis-hosting-n8n-dengan-docker-dan-nginx-di-vps-1.png"
excerpt: "Mengelola Hosting n8n dengan RunCloud, Docker, dan NGINX Secara Mudah n8n adalah platform otomatisasi open-source yang menghubungkan aplikasi dan layanan untuk menye"
migrated_from: "https://www.mrohadiz.my.id/2025/12/panduan-praktis-hosting-n8n-dengan.html"
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!--
META_DESCRIPTION: Panduan teknis untuk hosting n8n menggunakan Docker dan NGINX di VPS dengan RunCloud.
USULAN_JUDUL_1: Hosting n8n dengan Docker dan NGINX di VPS: Panduan Lengkap
USULAN_JUDUL_2: Langkah-langkah Praktis Hosting n8n di VPS dengan Docker dan NGINX
USULAN_JUDUL_3: Hosting n8n di VPS: Panduan Teknikal
-->

<div class="separator"><br /></div>
<div class="separator">
<a href="https://blogger.googleusercontent.com/img/a/AVvXsEgLc368Uqtt7oGbpb8sPpqdQhnAqN0fUxXlG6NPgeyxGQrE05ekLDRcqWASdiR2CHGi5hljLEbrx5IHoWDcqfu-jVz3RMk_sfwSXO7iU0E6q53xsjECnOi1Z02SMiMwNxvPf2ErYQTTee-OlOucqp2XObWbch7c7p2wpS1V5U4DJa6lCgR-KTVlMTK_yCBn">
<img alt="Hosting n8n dengan Docker dan NGINX" src="{{ '/assets/images/blogger/2025-12-08-blogger-panduan-praktis-hosting-n8n-dengan-docker-dan-nginx-di-vps-1.png' | relative_url }}" />
</a>
</div><br /><br />
<h2>Mengelola Hosting n8n dengan RunCloud, Docker, dan NGINX Secara Mudah</h2>

<p>n8n adalah platform otomatisasi open-source yang menghubungkan aplikasi dan layanan untuk menyederhanakan tugas-tugas repetitif. Mengelola infrastruktur sendiri untuk n8n memberikan kontrol penuh atas pengaturan. Panduan ini menjelaskan langkah-langkah teknis untuk menerapkan n8n menggunakan Docker, mengonfigurasinya dengan aman menggunakan NGINX dan SSL, serta memanfaatkan RunCloud untuk pengelolaan server.</p>

<h2>Kenapa Menghosting n8n dengan RunCloud &amp; Docker?</h2>

<ul>
<li><strong>Kontrol penuh</strong> – Menyimpan data dan alur kerja sesuai keinginan.</li>
<li><strong>Manajemen yang disederhanakan</strong> – RunCloud mengelola domain, SSL, dan konfigurasi NGINX.</li>
<li><strong>Pemasangan yang efisien</strong> – Docker menjaga n8n terisolasi dan memudahkan pembaruan.</li>
<li><strong>Dukungan multi-aplikasi</strong> – Menjalankan beberapa aplikasi di satu server dengan mudah.</li>
</ul>

<h2>Instruksi Langkah demi Langkah untuk Menginstal n8n</h2>

<p>Langkah-langkah berikut akan membantu dalam membuat instance n8n di server:</p>

<p>Persyaratan:</p>
<ul>
<li>Server cloud (misalnya, DigitalOcean, Vultr) yang terhubung ke RunCloud.</li>
<li>Domain atau subdomain yang diarahkan ke IP server.</li>
</ul>

<p>Jika menggunakan integrasi Cloudflare dari RunCloud, pengaturan DNS dapat dilakukan dengan beberapa klik saat membuat aplikasi web.</p>

<h3>Langkah 1: Buat Aplikasi Web Baru di RunCloud</h3>

<p>RunCloud memudahkan pengelolaan nama domain, sertifikat SSL, dan backup untuk aplikasi web. Untuk memulai, buat aplikasi web khusus untuk n8n:</p>

<ol>
<li>Login ke dashboard RunCloud, navigasikan ke “Web Applications”, dan klik “Create Web Application”.</li>
<li><strong>Nama Aplikasi:</strong> Berikan nama deskriptif, misalnya, “n8n-app”.</li>
<li><strong>Pemilik Aplikasi Web:</strong> Pilih pengguna sistem. Disarankan untuk membuat akun pengguna baru untuk setiap aplikasi web demi keamanan.</li>
<li><strong>Nama Domain:</strong> Masukkan domain kustom untuk n8n (misalnya, n8n.example.com). Jika menggunakan integrasi Cloudflare, catatan DNS dapat diperbarui dengan satu klik.</li>
<li><strong>Versi PHP:</strong> Pilih versi PHP; n8n tidak menggunakannya secara langsung karena tercontainerisasi, tetapi RunCloud memerlukan satu untuk diatur. Pengaturan default sudah memadai.</li>
<li><strong>Stack Aplikasi Web:</strong> Pilih “Native NGINX + custom config” karena akan digunakan sebagai proxy untuk menghubungkan ke container Docker n8n.</li>
</ol>

<p>Setelah mengonfigurasi semua pengaturan, klik “Create Web Application” untuk menerapkan aplikasi web.</p>

<h3>SSL/TLS:</h3>
<p>Setelah aplikasi dibuat, pergi ke bagian SSL/TLS di RunCloud. Gunakan Let’s Encrypt untuk mendapatkan sertifikat SSL gratis. Melewatkan langkah ini dapat menyebabkan kesalahan di kemudian hari.</p>

<h3>Langkah 2: SSH ke Server dan Navigasi ke Direktori Aplikasi Web</h3>

<p>Setelah membuat aplikasi web, hubungkan ke server melalui SSH. Jika tidak tahu cara melakukannya, baca dokumentasi tentang Cara Menghubungkan ke Server Anda melalui SSH.</p>

<p>Setelah terhubung, navigasikan ke direktori root aplikasi web yang baru dibuat di RunCloud menggunakan perintah ‘cd’. Ganti jalur di perintah berikut dengan jalur root aktual aplikasi web:</p>

<pre><code>cd /home/runcloud/webapps/&lt;app-name&gt;</code></pre>

<h3>Langkah 3: Buat Direktori local-files</h3>

<p>Di direktori ini, buat direktori baru yang akan dipetakan ke container Docker. Ini akan menyimpan data aplikasi web dari instance n8n. Jalankan perintah berikut untuk membuat direktori:</p>

<pre><code>mkdir n8n_data
sudo chown -R 1000:1000 n8n_data</code></pre>

<p>Ini akan menyimpan data n8n dan menetapkan izin kepemilikan yang benar agar dapat diakses dari container Docker.</p>

<h3>Langkah 4: Buat Aplikasi Docker</h3>

<p>Definisikan dan luncurkan aplikasi n8n menggunakan Docker. Untuk memulai dengan cepat, gunakan perintah Docker run berikut:</p>

<pre><code>docker run -d --rm \
--name n8n \
-p 5678:5678 \
-e GENERIC_TIMEZONE="UTC" \
-e TZ="UTC" \
-e N8N_HOST="app-n8n.EXAMPLE.com" \
-e N8N_EDITOR_BASE_URL="https://app-n8n.EXAMPLE.com/" \
-e N8N_PROTOCOL="https" \
-e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
-e N8N_RUNNERS_ENABLED=true \
-e N8N_LICENSE_ACTIVATION_KEY="EXAMPLE" \
-e N8N_EMAIL_MODE="smtp" \
-e N8N_SMTP_HOST="smtp.EXAMPLE.com" \
-e N8N_SMTP_PORT="25" \
-e N8N_SMTP_USER="EXAMPLE" \
-e N8N_SMTP_PASS="EXAMPLE" \
-e N8N_SMTP_SENDER="N8N &lt;n8n@EXAMPLE.com&gt;" \
-e N8N_SMTP_SSL=true \
-e N8N_SMTP_STARTTLS=true \
-v ./n8n_data:/home/node/.n8n \
docker.n8n.io/n8nio/n8n</code></pre>

<p>Setelah menjalankan perintah di atas, Docker akan mengunduh dan menjalankan container yang diperlukan untuk aplikasi.</p>

<p>Untuk fleksibilitas lebih (pengaturan env kustom, zona waktu), gunakan Docker Compose sebagai alternatif. Lihat dokumentasi Docker n8n untuk pengaturan lanjutan.</p>

<h3>Langkah 5: Konfigurasi NGINX Reverse Proxy melalui RunCloud</h3>

<p>Setelah mengaktifkan container Docker, konfigurasi reverse proxy untuk mengarahkan lalu lintas ke container:</p>

<p>Di RunCloud, pergi ke n8n-app:</p>

<ul>
<li>Di bawah “NGINX Config”, klik “Create NGINX Config”.</li>
<li>Pilih: Proxy – Ubah NGINX menjadi server proxy.</li>
<li>Beri nama n8n-proxy.</li>
</ul>

<p>Di kotak Konten, tempelkan konfigurasi NGINX berikut:</p>

<pre><code>proxy_pass http://host:5678;
# &gt; uncomment below line if you want to disable proxy buffering
# proxy_buffering off;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-Host $host;
# &</code></pre>
