---
layout: article
title: "Cara Menemukan Alamat IP Server DNS di Linux Secara Praktis"
date: 2025-12-08T01:10:45+07:00
permalink: /2025/12/cara-menemukan-alamat-ip-server-dns-di.html
categories:
  - "Infrastructure"
tags:
  - "dns"
  - "linux"
  - "server-management"
excerpt: "Cara Mudah Menemukan Alamat IP Server DNS di Linux DNS berfungsi untuk menerjemahkan nama domain ke alamat IP, memungkinkan sistem terhubung dengan benar. Artikel in"
migrated_from: "https://www.mrohadiz.my.id/2025/12/cara-menemukan-alamat-ip-server-dns-di.html"
image: /assets/images/og/2025-12-08-cara-menemukan-alamat-ip-server-dns-di-linux-secara-praktis.png
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!-- META_DESCRIPTION: Temukan alamat IP server DNS di Linux dengan mudah melalui terminal atau GNOME. -->
<!-- USULAN_JUDUL_1: Panduan Praktis Menemukan Alamat IP Server DNS di Linux -->
<!-- USULAN_JUDUL_2: 2 Metode Menemukan Alamat IP Server DNS di Linux -->
<!-- USULAN_JUDUL_3: Temukan Alamat IP DNS di Linux dengan Mudah -->

<h2>Cara Mudah Menemukan Alamat IP Server DNS di Linux</h2>

<p>DNS berfungsi untuk menerjemahkan nama domain ke alamat IP, memungkinkan sistem terhubung dengan benar. Artikel ini menjelaskan cara mengecek server DNS yang digunakan pada mesin Linux, baik melalui terminal maupun antarmuka GNOME, serta cara cepat untuk melakukan query ke server DNS tertentu.</p>

<h2>Bagaimana Menemukan Server DNS Saat Ini di Linux</h2>

Ada dua metode untuk melihat pengaturan server DNS di Linux. Berikut adalah penjelasan untuk masing-masing metode.

<h3>Metode 1: Cek Server DNS Menggunakan Terminal</h3>

Terminal Linux adalah alat yang efektif untuk mendapatkan informasi ini dengan cepat. Berikut adalah langkah-langkahnya:

<ol>
<li><strong>Buka Terminal</strong><br />
Buka aplikasi terminal melalui menu aplikasi atau gunakan shortcut keyboard Ctrl + Alt + T. Jika terhubung ke server melalui SSH, langsung ketik perintah di shell.</li>

<li><strong>Cek File resolv.conf</strong><br />
Gunakan perintah <pre><code>cat</code></pre> untuk membaca dan menampilkan isi file. Ketik perintah berikut di terminal dan tekan Enter:
<pre><code>cat /etc/resolv.conf</code></pre>
Output yang muncul akan menunjukkan konfigurasi DNS.</li>

<img alt="Contoh output resolv.conf" decoding="async" src="https://blog.runcloud.io/wp-content/uploads/2025/11/a4d0fa19-1541-4c8e-a540-e403a1341ed1_How-to-Easily-Find-Your-DNS-Server-IP-Address-in-Linux.png" />

<li><strong>Cari Baris yang Dimulai dengan nameserver</strong><br />
Perhatikan baris yang dimulai dengan <pre><code>nameserver</code></pre>. Alamat IP yang mengikuti adalah server DNS yang telah dikonfigurasi. Contohnya, jika terlihat 192.168.0.1, berarti sistem menggunakan router untuk DNS yang meneruskan permintaan ke ISP.</li>

<li><strong>Jika Kamu Sudah Menentukan Server DNS Secara Eksplisit</strong><br />
Jika server DNS telah didefinisikan secara eksplisit dalam konfigurasi jaringan, output mungkin menunjukkan beberapa alamat IP seperti berikut:</li>

<img alt="Contoh output resolv.conf dengan beberapa DNS" decoding="async" src="https://blog.runcloud.io/wp-content/uploads/2025/11/5ab34da1-0879-4809-90c1-225eaf7df816_How-to-Easily-Find-Your-DNS-Server-IP-Address-in-Linux.png" />

<li>Pada contoh di atas, komputer menggunakan tiga server DNS dengan alamat IP: 1.1.1.1, 8.8.8.8, dan 9.9.9.9, yang masing-masing milik Cloudflare, Google, dan Quad9.</li>
</ol>

<h3>Metode 2: Temukan Server DNS di Linux Menggunakan Antarmuka Grafis GNOME</h3>

Jika lebih memilih antarmuka grafis, GNOME menyediakan cara yang mudah untuk melihat pengaturan jaringan.

<ol>
<li><strong>Buka Pengaturan Sistem</strong><br />
Klik area tray sistem di sudut kanan atas layar, kemudian klik ikon gear (⚙️) untuk membuka jendela Pengaturan.</li>

<li><strong>Masuk ke Pengaturan Jaringan</strong><br />
Di jendela Pengaturan, pilih Wi-Fi atau Wired sesuai dengan metode koneksi yang digunakan.</li>

<li><strong>Buka Detail Koneksi Aktif Kamu</strong><br />
Temukan jaringan yang sedang terhubung dan klik ikon gear (⚙️) di sebelah kanan namanya untuk membuka pengaturan spesifik.</li>

<li><strong>Cari Entri DNS Kamu</strong><br />
Jendela baru akan muncul dengan beberapa tab. Di tab Detail, cari entri DNS untuk menemukan alamat IP server yang digunakan.</li>

<img alt="Pengaturan DNS di GNOME" decoding="async" src="https://blog.runcloud.io/wp-content/uploads/2025/11/183b376b-aa78-4261-a4f5-139c4aecd3a8_How-to-Easily-Find-Your-DNS-Server-IP-Address-in-Linux.png" />

<li><strong>Memahami Pengaturan "Otomatis"</strong><br />
Klik tab IPv4 untuk melihat pengaturan DNS. Jika pengaturan DNS diatur ke Otomatis, komputer akan menerima pengaturan jaringan dari router secara otomatis.</li>

<li><strong>Jika Kamu Ingin Mengatur Server DNS Sendiri</strong><br />
Untuk mengatur server DNS secara manual, matikan saklar Otomatis dan masukkan alamat IP baru ke dalam bidang yang tersedia.</li>

<img alt="Mengatur DNS Manual di GNOME" decoding="async" src="https://blog.runcloud.io/wp-content/uploads/2025/11/441653a6-6e60-42cd-b183-bca91c1d222a_How-to-Easily-Find-Your-DNS-Server-IP-Address-in-Linux.png" />
</ol>

<h3>Bonus: Query Situs Menggunakan Server DNS Apa Pun</h3>

Setelah mengetahui server DNS, Anda dapat melakukan query ke server DNS publik untuk mendapatkan alamat IP situs tertentu.

Gunakan perintah berikut untuk melakukan query:

<pre><code>dig @<DNS-SERVER-IP> <WEBSITE-TO-LOOKUP></code></pre>

Penjelasan perintah ini adalah sebagai berikut:

<ul>
<li><pre><code>dig</code></pre>: Perintah untuk menjalankan alat ini.</li>
<li><pre><code>@<DNS-SERVER-IP></code></pre>: Simbol @ menunjukkan bahwa pertanyaan diarahkan ke server tertentu. Ganti <pre><code><DNS-SERVER-IP></code></pre> dengan alamat IP server yang ingin diquery, seperti <pre><code>@8.8.8.8</code></pre> untuk Google.</li>
<li><pre><code><WEBSITE-TO-LOOKUP></code></pre>: Nama domain yang ingin dicari alamat IP-nya, seperti <pre><code>runcloud.io</code></pre>.</li>
</ul>

Sebagai contoh, untuk menanyakan server DNS publik Google (8.8.8.8) mengenai alamat IP dari <pre><code>runcloud.io</code></pre>, jalankan perintah berikut di terminal:

<pre><code>dig @8.8.8.8 runcloud.io</code></pre>

Terminal akan menampilkan output yang menunjukkan informasi DNS.

<img alt="Contoh output query DNS" decoding="async" src="https://blog.runcloud.io/wp-content/uploads/2025/11/ec4ce5c1-8a7a-4631-a4a9-44114e365d28_How-to-Easily-Find-Your-DNS-Server-IP-Address-in-Linux.png" />

Gulir ke bawah untuk menemukan bagian <pre><code>;; ANSWER SECTION:</code></pre>, yang berisi respons dari server DNS.

<pre><code>runcloud.io.                300        IN        A        104.26.10.235
runcloud.io.                300        IN        A        104.26.11.235
runcloud.io.                300        IN        A        172.67.68.114</code></pre>

Ini menunjukkan bahwa, menurut DNS Google, <pre><code>runcloud.io</code></pre> memiliki tiga alamat IP: 104.26.10.235, 104.26.11.235, dan 172.67.68.114.

Jika lebih memilih antarmuka grafis, Google juga menyediakan alat web untuk melakukan fungsi serupa. Kunjungi <a href="https://dns.google/">https://dns.google/</a> untuk melihat hasil query dalam format JSON, yang memudahkan pencarian alamat IP.

<img alt="Alat web DNS Google" decoding="async" src="https://blog.runcloud.io/wp-content/uploads/2025/11/8c3fa383-3840-441c-8ee4-fedb592d7b37_How-to-Easily-Find-Your-DNS-Server-IP-Address-in-Linux.png" />

<h2>Ketika Aplikasi Mengabaikan DNS Sistem Kamu</h2>

Alamat IP yang ditemukan menggunakan metode di atas adalah server DNS default untuk sistem. Namun, beberapa aplikasi mungkin menggunakan DNS mereka sendiri. Beberapa pengabaian umum meliputi:

<ul>
<li><strong>DNS-over-HTTPS (DoH)</strong>: Browser modern dapat menggunakan DNS-over-HTTPS, yang melewati DNS sistem untuk privasi. VPN juga dapat mengoverride DNS untuk menjaga keamanan lalu lintas.</li>
<li><strong>Jaringan Pribadi Virtual (VPN)</strong>: Saat terhubung ke VPN, komputer biasanya menggunakan server DNS privatnya sendiri. Ini adalah fitur keamanan penting.</li>
</ul>

<h2>Langkah Selanjutnya untuk Manajemen DNS</h2>

Setelah mengetahui cara memeriksa <a href="http://www.mrohadiz.my.id/2026/01/studi-kasus-audit-maintenance-server.html">server DNS</a>, penting untuk mempertimbangkan pengaturan dan optimasi lebih lanjut untuk memastikan performa yang optimal.
