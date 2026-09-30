---
layout: article
title: "Bahaya Root Cause yang Terlalu Berhasil"
date: 2026-10-01
categories:
  - Decision Systems
tags:
  - observability
  - root-cause-analysis
  - decision-making
  - systems-thinking
excerpt: "Diagnosis yang pernah terbukti benar dapat berubah menjadi bias ketika kita menggunakannya sebagai jawaban sebelum memeriksa bukti baru."
---

# Ringkasan

Menemukan root cause adalah keberhasilan dalam troubleshooting.

Tetapi ada sisi lain yang jarang dibicarakan:

**root cause yang pernah terbukti benar dapat menjadi bias untuk insiden berikutnya.**

Ketika sebuah penjelasan berhasil menjawab masalah sebelumnya, kita cenderung menggunakannya sebagai template.

Padahal gejala yang sama belum tentu memiliki penyebab yang sama.

# Sebuah Kesalahan yang Pernah Saya Buat

Saya pernah mengalami lonjakan Packet Per Second (PPS) yang sangat tinggi hingga IP server dikarantina oleh NOC.

Setelah investigasi, penyebabnya adalah aktivitas XMRig miner.

Karena pengalaman itu, saya kemudian membangun monitoring PPS sendiri.

Tujuannya sederhana:

> Jangan sampai kejadian seperti itu terulang tanpa saya sadari.

Beberapa waktu kemudian alert yang sama muncul lagi.

PPS tinggi.

Outbound tinggi.

Pola grafiknya terlihat familiar.

Reaksi pertama saya juga familiar:

> Apakah ini XMRig lagi?

Ternyata tidak.

Pada investigasi berikutnya, lonjakan tersebut berkaitan dengan aktivitas backup yang saya desain sendiri.

Di situlah saya menyadari sesuatu yang lebih penting daripada sekadar menemukan penyebab sebuah insiden.

**Jawaban yang pernah benar bisa menjadi sumber kesalahan berikutnya.**

# Ketika Pengalaman Berubah Menjadi Template

Pengalaman sangat berguna.

Masalahnya muncul ketika pengalaman berubah dari:

> "Ini pernah terjadi."

menjadi:

> "Ini pasti terjadi lagi."

Polanya terlihat sederhana:

```
Insiden
↓
Investigasi
↓
Root cause ditemukan
↓
Solusi berhasil
↓
Pola tersimpan di kepala
↓
Gejala serupa muncul
↓
Root cause lama menjadi dugaan utama
```

Tidak ada yang salah dengan membuat hipotesis berdasarkan pengalaman.

Yang berbahaya adalah ketika hipotesis itu diam-diam berubah menjadi fakta.

# Root Cause Bukan Label Permanen

Root cause selalu menjelaskan **kejadian tertentu dalam konteks tertentu**.

Misalnya:

```
PPS tinggi
+
proses tertentu
+
tujuan trafik tertentu
+
waktu tertentu
=
root cause tertentu
```

Kalau pada kejadian berikutnya hanya gejalanya yang sama:

```
PPS tinggi
```

maka kita belum memiliki cukup alasan untuk menggunakan root cause lama sebagai kesimpulan.

Yang berubah bukan hanya sistem.

**Konteksnya juga berubah.**

# Dari Diagnosis ke Bias

Ada perbedaan antara:

> "Kasus sebelumnya disebabkan X."

dan:

> "Kasus ini juga disebabkan X."

Kalimat pertama adalah fakta historis.

Kalimat kedua adalah hipotesis.

Masalah muncul ketika operator melewati langkah pembuktian:

```
Gejala
↓
Ingatan
↓
Diagnosis
```

Padahal alur yang lebih sehat adalah:

```
Gejala
↓
Observasi
↓
Kumpulkan bukti
↓
Buat beberapa hipotesis
↓
Uji hipotesis
↓
Kesimpulan
```

Pengalaman tetap digunakan, tetapi ditempatkan sebagai **prior**, bukan **vonis**.

# Bukti Baru Harus Mengalahkan Cerita Lama

Saat investigasi baru dimulai, pertanyaan yang berguna bukan:

> "Apakah ini kejadian yang sama?"

Pertanyaan yang lebih baik:

> "Apa bukti bahwa kejadian ini sama?"

Keduanya terdengar mirip.

Tetapi arah berpikirnya berbeda.

Yang pertama mencari kemiripan.

Yang kedua mencari bukti.

Contohnya:

```
PPS tinggi
+
Outbound tinggi
```

belum menjawab:

```
Malware?
Backup?
Aplikasi?
Sinkronisasi?
Misconfiguration?
```

Karena itu investigasi perlu membuka kembali ruang kemungkinan.

# Fakta, Inferensi, Hipotesis

Saya sekarang melihat tiga lapisan ini sebagai pagar sederhana terhadap bias.

### Fakta

Apa yang benar-benar terukur.

Contoh:

- PPS meningkat.
- Volume outbound meningkat.
- Ada koneksi ke tujuan tertentu.

### Inferensi

Apa yang kemungkinan terjadi berdasarkan beberapa fakta.

Contoh:

- Trafik kemungkinan berasal dari proses backup.

### Hipotesis

Penjelasan yang masih harus dibuktikan.

Contoh:

- Aktivitas tersebut mungkin merupakan bagian dari serangan.

Urutannya penting.

```
Fakta
↓
Inferensi
↓
Hipotesis
↓
Verifikasi
```

Bukan:

```
Hipotesis
↓
Cari fakta yang mendukung
↓
Anggap selesai
```

# Cara Mencegah Root Cause Lama Menjadi Bias

Ketika gejala lama muncul kembali, saya lebih suka memperlakukan investigasi sebagai kasus baru.

Bukan berarti pengalaman dibuang.

Pengalaman justru dipakai untuk mempercepat pencarian:

```
Pengalaman lama
=
sumber hipotesis
```

bukan:

```
Pengalaman lama
=
jawaban
```

Beberapa pertanyaan sederhana membantu:

- Apa yang benar-benar sama dengan insiden sebelumnya?
- Apa yang berbeda?
- Bukti apa yang baru?
- Apakah ada proses atau aktivitas yang sedang berjalan?
- Hipotesis apa yang belum diperiksa?
- Bukti apa yang akan membantah dugaan saya?

Pertanyaan terakhir sering menjadi yang paling penting.

Karena investigasi yang sehat tidak hanya mencari alasan bahwa kita benar.

Ia juga mencari kemungkinan bahwa kita salah.

# Pelajaran yang Lebih Luas

Pola ini tidak hanya berlaku pada server.

### Analytics

```
Conversion turun
↓
Iklan bermasalah
```

Belum tentu.

Bisa saja tracking berubah, landing page bermasalah, atau kualitas traffic berubah.

### Security

```
Login gagal meningkat
↓
Brute force
```

Belum tentu.

Bisa saja ada perubahan konfigurasi, integrasi yang gagal, atau aplikasi yang melakukan retry.

### Business Intelligence

```
Revenue turun
↓
Demand turun
```

Belum tentu.

Masalah bisa berada pada harga, kapasitas, distribusi, atau proses penjualan.

Gejalanya penting.

Tetapi gejala bukan root cause.

# Root Cause yang Baik Harus Tetap Bisa Ditantang

Sebuah diagnosis tidak menjadi kuat karena kita sudah pernah membuktikannya.

Diagnosis menjadi kuat ketika ia tetap mampu bertahan terhadap bukti baru.

Karena itu saya semakin melihat root cause bukan sebagai label akhir, tetapi sebagai:

> **penjelasan terbaik yang tersedia berdasarkan bukti yang ada.**

Saat bukti berubah, penjelasannya juga harus siap berubah.

# Penutup

Investigasi pertama mengajarkan saya cara menemukan root cause.

Investigasi berikutnya mengajarkan saya untuk tidak terlalu cepat mempercayainya.

Root cause yang ditemukan kemarin adalah aset.

Tetapi root cause yang dipercaya tanpa verifikasi hari ini bisa menjadi risiko.

Karena itu, saat gejala lama muncul kembali, jangan hanya bertanya:

> "Apa penyebabnya dulu?"

Tanyakan juga:

> **"Apa bukti bahwa penyebabnya masih sama?"**

**Observe First. Interpret Second. Decide Last.**
