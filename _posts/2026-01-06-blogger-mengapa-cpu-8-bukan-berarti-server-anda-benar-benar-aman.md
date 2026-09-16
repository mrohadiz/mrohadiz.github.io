---
layout: article
title: "Mengapa CPU 8% Bukan Berarti Server Anda Benar-Benar Aman. 💻"
date: 2026-01-06T10:05:00+07:00
permalink: /2026/01/mengapa-cpu-8-bukan-berarti-server-anda.html
categories:
  - "Infrastructure"
tags:
  - "case-study"
  - "devops"
  - "server-audit"
image: "/assets/images/blogger/2026-01-06-blogger-mengapa-cpu-8-bukan-berarti-server-anda-benar-benar-aman-1.png"
excerpt: "Pada hari ini, saya melakukan audit rutin pada salah satu Server-Prod-01 berbasis Ubuntu 24.04.3 LTS . Server ini merupakan Dell PowerEdge R620 dengan 40 logical cor"
migrated_from: "https://www.mrohadiz.my.id/2026/01/mengapa-cpu-8-bukan-berarti-server-anda.html"
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!--
META_DESCRIPTION: Audit server menemukan malware meski CPU hanya 8%.
USULAN_JUDUL_1: Mengapa CPU Rendah Tidak Menjamin Keamanan Server Anda
USULAN_JUDUL_2: Audit Server: Temuan Malware Meski CPU Hanya 8%
USULAN_JUDUL_3: CPU 8%: Keamanan Server yang Menyimpan Ancaman
-->

<section>
<p>Pada hari ini, saya melakukan audit rutin pada salah satu <strong>Server-Prod-01</strong> berbasis <a href="https://ubuntu.com/" rel="nofollow" target="_blank">Ubuntu 24.04.3 LTS</a>. Server ini merupakan <strong>Dell PowerEdge R620</strong> dengan 40 <em>logical cores</em>. Infrastruktur ini mampu mengelola lebih dari <strong>4,2 juta request</strong> dalam 30 hari terakhir, dengan penggunaan CPU rata-rata hanya <strong>7,99%</strong>.</p>

<div class="separator">
<img alt="Grafik Monitoring Performa Server Dell PowerEdge R620 - CPU Usage 8%" loading="lazy" src="{{ '/assets/images/blogger/2026-01-06-blogger-mengapa-cpu-8-bukan-berarti-server-anda-benar-benar-aman-1.png' | relative_url }}" />
</div>

<p>Namun, di balik angka efisiensi tersebut, ditemukan anomali serius. Setelah melakukan <em>deep-dive</em> pada log sistem, saya menemukan bahwa server ini telah menjadi "inang" bagi malware terenkripsi yang telah aktif selama hampir 1,5 tahun.</p>
</section>

<section>
<h2>🔍 Diagnosis: Malware "Siluman" & Kebocoran Resource</h2>
<p>Berdasarkan investigasi forensik, terdapat tiga temuan kritikal yang mengancam stabilitas sistem:</p>

<ul>
<li>🚀 <strong>Malware WordPress Persisten:</strong> Ditemukan plugin berbahaya <code>uniserviceist-multiinfrastructure</code> pada salah satu aplikasi utama. Malware ini telah aktif sejak <strong>24 Juli 2024</strong> dan terus menerima perintah dari server Command & Control (C2).</li>
<li>🚀 <strong>Aktivitas C2 Botnet:</strong> Tercatat ada <strong>1.082 POST requests</strong> ke endpoint malware dalam periode log terakhir, mayoritas berasal dari IP yang menyamar sebagai Googlebot.</li>
<li>🚀 <strong>Brute Force SSH & Postfix:</strong> Log menunjukkan ribuan upaya akses ilegal dari IP publik luar negeri (seperti <code>165.245.xxx.xxx</code>) yang mencoba melakukan <em>guessing password</em> secara masif.</li>
<li>🚀 <strong>Disk Bloat (Silent Killer):</strong> Ditemukan file backup database MongoDB (.bson) yang tidak terkompresi dengan ukuran mencapai <strong>63GB per file</strong>.</li>
</ul>
</section>

<section>
<h2>🛠️ Tindakan: Optimasi Terlebih Dahulu, Upgrade Nanti</h2>
<p>Langkah-langkah eksekusi yang saya lakukan adalah sebagai berikut:</p>

<ol>
<li><strong>Pembersihan Malware:</strong> Menghapus total direktori malware di <code>wp-content/plugins/</code> dan membersihkan entri <code>active_plugins</code> di database untuk memutus persistensi.</li>
<li><strong>Hardening Keamanan:</strong> Mengoptimalkan <strong>Fail2Ban</strong> dan <strong>CrowdSec</strong> untuk memblokir IP penyerang secara otomatis sebelum mereka mencapai <em>application layer</em>.</li>
<li><strong>Tuning Database:</strong> Mengatur ulang proses <code>mongod</code> yang sebelumnya memakan CPU hingga 77% agar proses indexing berjalan lebih efisien.</li>
<li><strong>Manajemen Storage:</strong> Melakukan rotasi backup yang lebih ketat dan menghapus file sampah di direktori <code>/home/mongo/backup/</code> untuk melegakan kapasitas disk.</li>
</ol>
</section>

<section>
<h2>📊 Hasil: Performa Maksimal, Biaya Minimal</h2>
<p>Setelah tuning selesai, server kembali dalam kondisi prima tanpa perlu upgrade hardware:</p>

<table>
<thead>
<tr>
<th>Metrik</th>
<th>Kondisi Akhir</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Status Malware</strong></td>
<td>🔴 Terhapus & Terblokir</td>
</tr>
<tr>
<td><strong>CPU Load</strong></td>
<td>🟢 Stabil di ~8% (Mampu handle lonjakan)</td>
</tr>
<tr>
<td><strong>Disk Availability</strong></td>
<td>🟢 Tersedia 242GB (Aman)</td>
</tr>
</tbody>
</table>
</section>

<blockquote class='s1'>
"Infrastruktur yang besar tanpa pengawasan keamanan ibarat rumah mewah dengan pintu belakang yang tidak pernah dikunci."
</blockquote>
<p>Banyak sistem mengalami masalah performa yang disebabkan oleh malware. Setiap langkah yang diambil bertujuan untuk memastikan efisiensi dan keamanan sistem tanpa menambah biaya yang tidak perlu. Untuk informasi lebih lanjut tentang audit dan pemeliharaan server, lihat artikel <a href="http://www.mrohadiz.my.id/2026/01/studi-kasus-audit-maintenance-server.html">Studi Kasus Audit & Maintenance Server Linux</a> dan <a href="http://www.mrohadiz.my.id/2026/01/bedah-kasus-dormant-shell-forensik.html">Bedah Kasus Dormant Shell: Forensik Deface di WordPress</a>.</p>
</section>
