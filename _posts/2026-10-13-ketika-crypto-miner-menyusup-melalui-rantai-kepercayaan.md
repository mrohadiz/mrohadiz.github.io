---
layout: article
title: "Ketika Crypto Miner Menyusup melalui Rantai Kepercayaan Metabase dan PostgreSQL"
date: 2026-10-13
categories:
  - Infrastructure
tags:
  - cybersecurity
  - incident-response
  - postgresql
  - docker
  - least-privilege
excerpt: "Investigasi crypto miner memperlihatkan bagaimana hak superuser database dan rantai kepercayaan aplikasi dapat mengubah query SQL menjadi eksekusi perintah sistem."
image: /assets/images/og/2026-10-13-ketika-crypto-miner-menyusup-melalui-rantai-kepercayaan.png
---

# Ketika Crypto Miner Menyusup melalui Rantai Kepercayaan Metabase dan PostgreSQL

Crypto miner yang menghabiskan CPU sering kali hanya gejala yang terlihat. Dalam sebuah investigasi infrastruktur, jejak penting justru ditemukan pada hubungan antara aplikasi analitik, akun database dengan hak istimewa berlebihan, dan container tempat database berjalan.

Pelajaran utamanya bukan hanya cara menghapus miner. Kita perlu memahami bagaimana akses diperoleh, batas mana yang gagal melindungi sistem, dan bukti apa yang diperlukan sebelum menyimpulkan skala serangan.

> Catatan: tulisan ini merupakan studi kasus yang telah disamarkan untuk pembelajaran keamanan. Detail identitas, alamat, dan konfigurasi sensitif tidak disertakan. Kesimpulan mengikuti bukti yang tersedia pada saat investigasi dan tidak boleh dianggap sebagai indikator bahwa setiap lingkungan Metabase atau PostgreSQL rentan dengan cara yang sama.

## Ringkasan

Investigasi menemukan query SQL berbahaya yang dikirim melalui aplikasi analitik dan dieksekusi oleh PostgreSQL. Log database mencatat metadata query dari aplikasi, sementara statement yang ditemukan menunjukkan penggunaan kemampuan database untuk menjalankan perintah sistem operasi. Aktivitas berikutnya memasang XMRig, miner Monero, disertai skrip watchdog yang mencoba menjalankannya kembali ketika proses berhenti.

Rantai ini menunjukkan bagaimana beberapa kelemahan dapat saling memperbesar dampak:

1. Akses ke akun aplikasi yang mampu menjalankan native query.
2. Kredensial database dengan hak superuser yang tidak diperlukan untuk kebutuhan aplikasi.
3. Database yang terekspos lebih luas daripada yang dibutuhkan.
4. Container yang menjalankan proses berbahaya dengan hak pengguna database.

Masing-masing temuan perlu dilihat dalam konteks bukti dan konfigurasi aktual, bukan sebagai asumsi universal.

## Rekonstruksi kronologi berbasis bukti

Kronologi berikut merangkum urutan yang tercatat dalam laporan investigasi. Waktu dan detail infrastruktur internal sengaja disederhanakan untuk publikasi.

| Periode | Fakta yang diamati | Makna forensik |
|---|---|---|
| Agustus 2025 | Konfigurasi service database memublikasikan port database ke jaringan publik. | Eksposur yang tidak diperlukan memperbesar permukaan serangan. |
| 8 September 2026 | Log database mencatat probing koneksi dan query native dari aplikasi analitik yang mencoba menulis lalu membaca artefak uji di filesystem container. | Ada indikasi kuat pengujian kemampuan eksekusi sebelum miner dipasang. |
| 17 September 2026 | Riwayat login administrator aplikasi menunjukkan sesi dari IP eksternal. Pada hari yang sama, artefak dropper dan konfigurasi miner dibuat, lalu proses miner dan watchdog mulai berjalan. | Urutan waktunya relevan, tetapi belum membuktikan siapa yang mengendalikan sesi tersebut atau bagaimana akses awal diperoleh. |
| 26 September 2026 | Query native yang tercatat mencoba menginventarisasi arsitektur, jumlah CPU, identitas proses, dan utilitas yang tersedia. | Aktivitas konsisten dengan reconnaissance di dalam container. |
| 12–13 Oktober 2026 | Audit menemukan miner masih berjalan, dengan penggunaan sekitar empat core CPU. Proses dihentikan dan publikasi port database dicabut dari konfigurasi service serta platform deployment. | Containment proses dan jaringan berhasil dilakukan menurut hasil verifikasi dalam laporan. |

Perbedaan penting: **jalur eksekusi di database didukung bukti langsung**, sedangkan **cara sesi administrator Metabase pertama kali dikuasai belum dipastikan sepenuhnya**. Log native query mengidentifikasi akun aplikasi yang tercatat menjalankan statement, bukan identitas manusia di balik setiap sesi. Laporan juga menyebut log HTTP yang sudah ter-rotate dan logging query yang parsial sebagai keterbatasan.

## Cakupan dampak: bedakan kompromi dan eksposur

Laporan menilai aset berdasarkan bukti yang tersedia, bukan menganggap seluruh layanan di jaringan yang sama telah terkompromi.

| Kategori | Penilaian | Interpretasi |
|---|---|---|
| Container database komersial | **Terkonfirmasi terdampak** | Proses miner, watchdog, artefak, dan query eksploitasi ditemukan. |
| Aplikasi analitik | **Kemungkinan terdampak** | Akun administrator aplikasi tercatat pada query eksploitasi. Status ini tidak dengan sendirinya membuktikan seluruh container aplikasi telah menjalankan malware. |
| Database aplikasi analitik dan layanan bisnis yang memakai superuser | **Berpotensi terekspos** | Kredensial dan hak akses lintas layanan menciptakan jalur risiko yang harus diputus; bukti kompromi langsung belum ditunjukkan untuk aset ini. |
| Host Linux | **Tidak ditemukan bukti kompromi dalam cakupan audit** | Pemeriksaan yang dilaporkan tidak menemukan persistence host atau container escape. Ini bukan jaminan mutlak di luar cakupan dan periode log yang diperiksa. |
| Container lain dan worker mining pool eksternal | **Tidak ditemukan bukti / belum diketahui** | Pemeriksaan lokal tidak menemukan artefak yang dicari pada layanan tertentu. Worker pool eksternal tidak dapat dipetakan menjadi korban terverifikasi tanpa telemetri independen. |

## Apa yang sudah selesai dan apa yang masih terbuka

Menurut laporan, tindakan containment yang telah diverifikasi mencakup penghentian proses miner dan watchdog, penghapusan artefak di direktori sementara container, pencabutan port database yang dipublikasikan, serta sinkronisasi konfigurasi deployment agar port tersebut tidak muncul kembali saat redeploy.

Namun, beberapa tindakan penting masih berstatus terbuka pada checklist laporan:

- Rotasi password role database berprivilege tinggi dan kredensial administrator aplikasi.
- Penurunan role koneksi aplikasi dari superuser ke hak minimum yang diperlukan.
- Pengakhiran sesi aplikasi yang masih aktif, audit native query, dan penguatan autentikasi administrator.
- Aktivasi firewall host serta verifikasi aturan firewall pada jalur trafik Docker.
- Audit kredensial dan akses pada layanan lain yang berbagi jaringan atau akun database.

Status “miner sudah mati” berarti aktivitas yang diketahui telah dihentikan; itu tidak sama dengan seluruh akar risiko sudah ditutup. Remediasi dianggap tuntas setelah kredensial, privilege, eksposur jaringan, dan jalur eksekusi diuji ulang.

## Insight utama

### 1. Cari jalur eksekusi, bukan hanya file malware

Nama proses yang menyerupai proses sistem dan penggunaan CPU tinggi merupakan petunjuk awal, tetapi tidak menjelaskan bagaimana kompromi terjadi. File miner, script peluncur, dan watchdog menjelaskan bagaimana malware berjalan serta bertahan. Untuk menemukan initial access, penyelidik perlu menelusuri log aplikasi, autentikasi, query database, dan urutan waktu sebelum file tersebut muncul.

Dalam kasus ini, log PostgreSQL mencatat statement yang dikaitkan dengan native query dari aplikasi analitik. Beberapa statement menggunakan fitur yang memungkinkan operasi file atau eksekusi program. Ini menjadi bukti penting tentang jalur eksekusi di database. Atribusi terhadap pengguna atau pelaku tertentu tetap harus dikonfirmasi melalui korelasi sesi, log login, serta konteks akses aplikasi.

**Prinsip:** indikator kompromi menjelaskan apa yang terjadi; rantai bukti membantu menjelaskan bagaimana hal itu terjadi.

### 2. Hak superuser pada akun aplikasi memperbesar blast radius

Akun yang dipakai aplikasi untuk menjalankan query seharusnya memperoleh hak minimum yang dibutuhkan. Jika akun tersebut berstatus superuser, kompromi aplikasi atau penyalahgunaan fitur query dapat berdampak jauh melampaui operasi membaca dan menulis data yang semestinya.

Pada PostgreSQL, kemampuan superuser memungkinkan operasi administratif yang sangat kuat, termasuk sejumlah mekanisme yang dapat memicu interaksi dengan sistem operasi. Karena itu, menghubungkan aplikasi analitik ke database menggunakan akun superuser adalah risiko arsitektural yang serius.

Perbaikannya bukan sekadar mengganti password. Buat role khusus dengan hak minimum, pisahkan akses baca dan tulis, batasi schema yang bisa diakses, dan pastikan fitur native query hanya diberikan kepada pihak yang memang membutuhkannya. Uji perubahan hak akses di lingkungan staging sebelum diterapkan ke produksi.

### 3. Eksposur jaringan memperbesar kesempatan, tetapi tidak otomatis menjelaskan initial access

Port database yang dapat dijangkau dari internet meningkatkan peluang pemindaian dan percobaan akses. Namun, port terbuka saja tidak membuktikan bahwa port tersebut merupakan jalur masuk yang benar-benar dipakai.

Investigasi yang disiplin memisahkan:
- **Fakta:** layanan dapat dijangkau dari jaringan tertentu pada waktu pemeriksaan.
- **Korelasi:** terdapat aktivitas mencurigakan di sekitar periode insiden.
- **Kesimpulan:** log atau bukti lain menunjukkan jalur akses yang digunakan.

Pemisahan ini mencegah laporan mengubah konfigurasi yang buruk menjadi root cause tanpa bukti.

### 4. Persistence di container tidak sama dengan persistence di host

Skrip watchdog yang memeriksa proses dan menjalankan ulang miner menunjukkan upaya mempertahankan aktivitas di dalam container. Dalam kasus ini, artefak yang ditemukan berada di lapisan writable container dan tidak ditemukan pada volume data database yang diperiksa.

Hal tersebut membantu menentukan lokasi pembersihan, tetapi tidak boleh diartikan sebagai jaminan bahwa container selalu menjadi batas keamanan yang sempurna. Kesimpulan tentang host harus dibatasi pada area dan log yang benar-benar diperiksa. Tidak ditemukannya indikator bukan bukti mutlak bahwa kompromi tidak pernah terjadi.

Redeploy dapat menghilangkan file di lapisan container yang tidak persisten, tetapi redeploy saja bukan pengganti investigasi, rotasi kredensial, perbaikan hak akses, atau validasi image. Jika akar masalah masih ada, kompromi dapat berulang.

### 5. Jumlah worker mining pool bukan hitungan korban yang pasti

Data mining pool dapat membantu menghubungkan wallet, nama worker, dan aktivitas mining. Namun, jumlah worker bukan jumlah server korban yang terverifikasi. Nama worker dapat dikendalikan pihak yang mengirimkannya, satu sistem dapat memakai banyak nama, dan sebuah wallet dapat menggabungkan sumber daya yang berbeda.

Korelasi menjadi lebih kuat jika ditopang bukti independen, misalnya hash binary yang sama, pola script, waktu aktivitas yang sesuai, alamat jaringan, atau log eksploitasi yang sejenis.

Gunakan klasifikasi yang jelas:
- **Terkonfirmasi terdampak:** terdapat bukti langsung eksekusi atau kompromi.
- **Kemungkinan terdampak:** sejumlah indikator independen saling menguatkan.
- **Berpotensi terekspos:** jalur akses relevan ada, tetapi kompromi belum terbukti.
- **Tidak ditemukan bukti:** pemeriksaan tidak menemukan indikator yang dicari dalam cakupan yang ditentukan.
- **Belum diketahui:** data yang tersedia tidak cukup.

Bahasa yang presisi meningkatkan kredibilitas laporan sekaligus membantu pengambilan keputusan.

## Model berpikir: dari gejala ke akar masalah

Saat menemukan miner, susun investigasi sebagai rangkaian:

1. **Observed symptom** — CPU tinggi, proses tidak dikenal, koneksi mining pool.
2. **Execution** — binary, script, parent process, dan konteks pengguna.
3. **Persistence** — mekanisme yang menjaga proses tetap berjalan atau memulihkannya.
4. **Initial access** — bukti autentikasi, query, eksploitasi, atau perubahan konfigurasi yang mendahului eksekusi.
5. **Blast radius** — aset yang terkonfirmasi, berpotensi terdampak, serta aset yang belum dapat dinilai.
6. **Remediation and validation** — menutup jalur masuk dan memastikan indikator tidak muncul kembali.

Urutan ini menghindari kesalahan umum: terlalu cepat menghapus file berbahaya sebelum bukti penting dikumpulkan.

## Checklist pencegahan

### Identitas dan hak akses database
- [ ] Pastikan akun aplikasi bukan superuser.
- [ ] Gunakan role terpisah sesuai kebutuhan baca/tulis.
- [ ] Audit hak istimewa, membership role, dan akses schema secara berkala.
- [ ] Rotasi kredensial yang terlibat dalam insiden.
- [ ] Batasi siapa yang dapat menjalankan native query di aplikasi analitik.

### Aplikasi dan jaringan
- [ ] Tinjau log autentikasi, sesi, dan aktivitas administrator aplikasi.
- [ ] Batasi konektivitas database hanya ke sumber yang diperlukan.
- [ ] Terapkan firewall dengan aturan eksplisit dan verifikasi aturan yang benar-benar berlaku pada host serta lapisan container.
- [ ] Tinjau penggunaan port publik dan hapus eksposur yang tidak diperlukan.
- [ ] Perbarui aplikasi dan dependency berdasarkan versi yang benar-benar digunakan.

### Container dan respons insiden
- [ ] Gunakan image dari sumber tepercaya dan pin versi atau digest image.
- [ ] Hindari privilege dan mount yang tidak dibutuhkan.
- [ ] Simpan log aplikasi, database, autentikasi, dan runtime container dengan retensi memadai.
- [ ] Kumpulkan bukti sebelum menghapus atau meredeploy container.
- [ ] Validasi host dan aset lain berdasarkan cakupan pemeriksaan yang terdokumentasi.
- [ ] Uji ulang setelah remediation dan pantau kemungkinan reinfeksi.

## Penutup

Kasus ini mengingatkan bahwa keamanan infrastruktur tidak ditentukan oleh satu kontrol saja. Aplikasi yang memiliki akses query, database dengan hak superuser, dan layanan yang terlalu terbuka dapat membentuk jalur risiko yang dampaknya lebih besar daripada kelemahan individualnya.

Respons yang matang menggabungkan forensik, prinsip least privilege, segmentasi jaringan, pengamanan container, dan verifikasi setelah perbaikan. Yang terpenting, kesimpulan harus mengikuti bukti: bedakan fakta dari hipotesis, dan jangan mengubah indikator korelasi menjadi klaim yang lebih luas daripada yang dapat dibuktikan.

Dengan cara itu, investigasi insiden tidak berhenti pada penghapusan malware, tetapi menghasilkan perbaikan arsitektur dan praktik operasional yang dapat digunakan kembali.
