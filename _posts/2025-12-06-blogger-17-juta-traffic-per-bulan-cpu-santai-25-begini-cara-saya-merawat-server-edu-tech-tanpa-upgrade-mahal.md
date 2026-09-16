---
layout: article
title: "17 Juta Traffic per Bulan, CPU Santai 25%: Begini Cara Saya Merawat Server Edu-Tech Tanpa Upgrade Mahal"
date: 2025-12-06T17:21:00+07:00
permalink: /2025/12/17-juta-traffic-per-bulan-cpu-santai-25.html
categories:
  - "Infrastructure"
tags:
  - "case-study"
  - "devops"
  - "server-optimization"
image: "/assets/images/blogger/2025-12-06-blogger-17-juta-traffic-per-bulan-cpu-santai-25-begini-cara-saya-merawat-server-edu-tech-tanpa-upgrade-mahal-1.png"
excerpt: "17 Juta Traffic per Bulan, CPU Santai 25%: Begini Cara Saya Merawat Server Edu-Tech Melalui Optimasi Konfigurasi Sistem yang Ada Hari ini saya melakukan maintenance"
migrated_from: "https://www.mrohadiz.my.id/2025/12/17-juta-traffic-per-bulan-cpu-santai-25.html"
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!-- META_DESCRIPTION: Optimasi server Edu-Tech dengan 17 juta traffic bulanan dan CPU 25% melalui konfigurasi sistem yang ada. -->
<!-- USULAN_JUDUL_1: Optimasi Server Edu-Tech: 17 Juta Traffic dan CPU 25% -->
<!-- USULAN_JUDUL_2: 17 Juta Traffic per Bulan, CPU 25%: Optimasi Tanpa Upgrade -->
<!-- USULAN_JUDUL_3: Merawat Server Edu-Tech dengan Optimasi Sistem -->

<div class="separator"><a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZsaYaSilLyh25a1UeyPz85mEa8_BA7dSNbRtcDhf8b6VpW344WQn2utEQ170xNSUevnD9FcjQzuWh1xAKoT6DNPTdvTdKV5cJYj7sp_2eJfR_NY5JMXt0rATWw0d7tKJ2ov13xRKjkjfwqyFj7bY98ErheZB15E-ZeRXbkon14D686gdwU1T0X4fJ5qTg/s1536/ChatGPT%20Image%20Dec%206,%202025,%2005_29_10%20PM.png"><img src="{{ '/assets/images/blogger/2025-12-06-blogger-17-juta-traffic-per-bulan-cpu-santai-25-begini-cara-saya-merawat-server-edu-tech-tanpa-upgrade-mahal-1.png' | relative_url }}" alt="Server Edu-Tech Maintenance" /></a></div><br /><br /><h2>17 Juta Traffic per Bulan, CPU Santai 25%: Begini Cara Saya Merawat Server Edu-Tech Melalui Optimasi Konfigurasi Sistem yang Ada</h2>

<p>Hari ini saya melakukan maintenance rutin pada <b>Server Edu-Tech Nasional</b> yang telah beroperasi (uptime) selama 77 hari tanpa restart. Dalam sebulan terakhir, server ini menerima lebih dari <b>17 juta request</b>, dengan tiga aplikasi utama menyumbang mayoritas trafik.</p>

<p>Menariknya, meskipun trafik sebesar itu, CPU hanya berjalan di rata-rata <b>25%</b>. Setelah audit selesai, saya berhasil mengoptimalkan memori hingga lebih lega 2GB+ melalui optimasi konfigurasi sistem yang ada.</p>

<blockquote class='s1'>Inilah filosofi saya:<br /><strong>Optimasi Dulu, Upgrade Nanti.</strong><br /><br />Kalau bisa diperas konfigurasi lamanya, kenapa harus beli server baru?</blockquote>

<hr />

<h3>🔍 Diagnosis: Masalah Tersembunyi di Balik Kinerja Tinggi</h3>
<p>Dari audit awal, saya menemukan beberapa isu yang tidak terlihat oleh klien, namun berpotensi berbahaya jika dibiarkan:</p>

<ul>
<li>🔴 <b>1. Log berlebih (747MB)</b><br />Termasuk 1 file yang bengkak sampai 171MB. Ini bukan hanya menghabiskan storage, tetapi juga meningkatkan <i>disk I/O</i> dan memperlambat sistem.</li>

<li>🔴 <b>2. Dua service tidak sehat (pgAdmin &amp; Portainer)</b><br />Error rate mencapai 97–99%. Jika dibiarkan, ini dapat menjadi potensi lubang keamanan.</li>

<li>🔴 <b>3. Serangan aktif setiap hari</b><br />Dalam 30 hari terakhir:
<ul>
<li>642 SSH attacks</li>
<li>3.501 HTTP attacks</li>
<li>738 scanning attempts</li>
<li>Total IP diblokir: &gt; 5.200</li>
</ul>
<i>Untungnya, semua serangan berhasil ditahan oleh kombinasi firewall, CDN, dan engine IDS/IPS.</i>
</li>

<li>🔴 <b>4. Cache memory terlalu menumpuk</b><br />Sebelum tuning, Buff/Cache mencapai 6.3GB dengan Free Memory hanya 2.9GB. Hal ini dapat menyebabkan aplikasi terasa “lemot” saat load mendadak.</li>
</ul>

<hr />

<h3>🔧 Action: Ini yang Saya Eksekusi (Zero Downtime)</h3>

<ol>
<li><b>Update Sistem &amp; Security Engine:</b> CrowdSec dan Suricata diperbarui ke versi terbaru. Semua dependency aman tanpa error.</li>
<li><b>Pembersihan 54 File Log Lama:</b> Saya membersihkan Auth log lama, PHP-FPM log, APT logs, dan Oversized log (171MB → 0).</li>
<li><b>Optimasi Memory &amp; Cache:</b> Clear page cache, Refresh PHP-FPM pools, dan bersihkan temporary files. Ini menghasilkan penurunan memory usage yang signifikan.</li>
<li><b>Audit Serangan &amp; Hardening:</b> Review 3.500+ attack patterns. Memastikan firewall bouncer, Nginx bouncer, dan Cloudflare bouncer aktif. Termasuk memblokir satu kasus scanning berbahaya (ALFA shell).</li>
<li><b>Review 17 Juta Request:</b> Identifikasi aplikasi dengan error rate tertinggi dan memisahkan error normal (security blocks) vs error abnormal.</li>
</ol>

<hr />

<h3>📈 Hasil Akhir: Performa Naik, Risiko Turun</h3>

<p><b>💾 Disk &amp; Log</b><br />
Log berkurang dari 747MB menjadi <b>kurang dari 200MB</b>. Disk tetap stabil di 53% setelah 54 file sampah dihapus.</p>

<p><b>🧠 Perbandingan Memori</b></p>
<table>
<thead>
<tr>
<th>Metrik</th>
<th>Sebelum</th>
<th>Sesudah</th>
</tr>
</thead>
<tbody>
<tr>
<td>Free Memory</td>
<td>2.9GB</td>
<td>5.0GB (+72%) 🚀</td>
</tr>
<tr>
<td>Used Memory</td>
<td>70%</td>
<td>68%</td>
</tr>
<tr>
<td>Buff/Cache</td>
<td>6.3GB</td>
<td>4.6GB</td>
</tr>
</tbody>
</table>
<p><i>Trafik ratusan ribu per hari, tetapi memori tetap aman melalui optimasi konfigurasi sistem yang ada. DevOps for Marketing: hasil tetap maksimal.</i></p>

<p><b>🔐 Keamanan</b><br />
4.000+ serangan diblok dalam 30 hari. Root login aman, Firewall multilayer berjalan dengan baik, tidak ada kompromi sistem.</p>

<p><b>📊 Traffic</b><br />
Top aplikasi menembus 6.3 juta, 4.4 juta, dan 3.3 juta request. Semua tetap sehat dengan error rate rendah (0.5–3%).</p>

<hr />

<h3>🧭 Kesimpulan: Optimasi Bukan Upgrade</h3>
<p>Server Edu-Tech ini terbukti sangat stabil meski menerima trafik di atas 17 juta request/bulan. Dengan optimasi yang tepat, saya berhasil:</p>
<ul>
<li>✅ Membersihkan ratusan MB sampah</li>
<li>✅ Menurunkan memory usage</li>
<li>✅ Meningkatkan free memory 72%</li>
<li>✅ Menjaga keamanan dari ribuan serangan</li>
<li>✅ Melakukan semua ini <b>tanpa downtime &amp; melalui optimasi konfigurasi sistem yang ada</b></li>
</ul>

<p>Itu sebabnya filosofi kerja saya selalu sama: <i>“Optimasi Dulu. Upgrade Nanti.”</i> Hasil tetap maksimal.</p>

<div>
<h3>📞 Butuh Audit Server? Saya Bisa Bantu.</h3>
<p>Jika server Anda lambat tanpa sebab, sering error 5xx, mulai sesak memory, atau rawan serangan—dan ingin tetap hemat biaya:</p>
<p><b>Mari konsultasi audit server bersama saya.</b></p>
<p>➡️ <i>Kirimkan akses RunCloud / VPS spec — saya analisa tanpa harus upgrade mahal.</i></p>
</div><br /><br />
