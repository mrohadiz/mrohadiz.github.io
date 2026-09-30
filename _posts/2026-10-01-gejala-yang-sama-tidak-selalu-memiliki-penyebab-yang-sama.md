---
layout: article
title: "Gejala yang Sama Tidak Selalu Memiliki Penyebab yang Sama"
date: 2026-10-01
categories:
  - Decision Systems
tags:
  - observability
  - root-cause-analysis
  - decision-making
  - systems-thinking
excerpt: "Dua kejadian dapat terlihat sama dari metrik jaringan, tetapi memiliki akar masalah yang berbeda. Pelajarannya adalah jangan mengubah gejala menjadi kesimpulan sebelum konteks dan buktinya cukup."
image: /assets/images/og/2026-10-01-gejala-yang-sama-tidak-selalu-memiliki-penyebab-yang-sama.png
---

# Ringkasan

Salah satu jebakan dalam troubleshooting sistem adalah menganggap gejala yang sama selalu memiliki penyebab yang sama.

Dalam sistem yang kompleks, sebuah metrik hanya menjelaskan **apa yang terjadi**, bukan otomatis **mengapa itu terjadi**.

Karena itu, observability yang baik bukan hanya mendeteksi anomali. Ia juga harus membantu menghubungkan gejala dengan sumber, konteks, dan aktivitas yang sedang berlangsung.

# Ketika PPS Tinggi Berarti Hal yang Berbeda

Packet Per Second (PPS) adalah contoh yang menarik.

Lonjakan PPS dapat muncul ketika sebuah server mengalami aktivitas yang tidak diinginkan. Tetapi lonjakan yang sama juga dapat terjadi karena aktivitas operasional yang sah, seperti backup atau sinkronisasi data dalam jumlah besar.

Dari sudut pandang jaringan, keduanya sama-sama terlihat sebagai:

```
PPS ↑
Outbound ↑
```

Namun penyebabnya bisa berbeda:

```
PPS tinggi
    ├── Aktivitas berbahaya
    ├── Proses aplikasi
    ├── Backup
    └── Aktivitas operasional lain
```

Jadi metrik tersebut adalah **gejala**, bukan diagnosis.

# Dari "PPS Tinggi = Serangan" ke "PPS Tinggi = Perilaku Sistem"

Perubahan cara berpikir yang lebih berguna adalah:

```
PPS Tinggi
↓
Perilaku jaringan yang perlu dijelaskan
↓
Cari sumber
↓
Cari proses atau aset
↓
Cari tujuan trafik
↓
Cocokkan dengan aktivitas sistem
↓
Baru tentukan penyebab
```

Dengan pola ini, alert tetap berguna tanpa memaksa operator menerima hipotesis tertentu sejak awal.

# Mengapa Diagnosis Bisa Salah

Kesalahan biasanya terjadi ketika pengalaman sebelumnya dijadikan template untuk kejadian baru.

Misalnya:

> Sebelumnya PPS tinggi disebabkan insiden keamanan.

Kesimpulan berikutnya bisa berubah menjadi:

> PPS tinggi berarti insiden keamanan.

Padahal yang lebih tepat adalah:

> PPS tinggi **pernah** muncul pada insiden keamanan.

Perbedaannya kecil dalam kalimat, tetapi besar dalam pengambilan keputusan.

Yang pertama adalah diagnosis otomatis.

Yang kedua adalah observasi historis.

# Data yang Sama, Konteks yang Berbeda

Satu angka seperti 50.000 PPS tidak cukup menjelaskan apakah sebuah sistem sedang bermasalah.

Perlu ditambahkan konteks seperti:

- proses atau container yang menghasilkan trafik
- aset atau aplikasi yang terkait
- tujuan trafik
- durasi dan pola burst
- hubungan dengan aktivitas yang sedang berjalan
- bukti dari log aplikasi dan sistem

Contohnya:

```
50.000 PPS
+
Google sebagai tujuan dominan
+
proses backup aktif
+
waktu overlap dengan backup
=
indikasi aktivitas operasional
```

Sedangkan pola lain:

```
100.000 PPS
+
tujuan beragam
+
proses tidak dikenal
+
tidak ada aktivitas operasional yang cocok
=
perlu investigasi lebih lanjut
```

Angka awalnya sama-sama tinggi. Interpretasinya berbeda karena konteksnya berbeda.

# Observability Bukan Sekadar Alert

Alert yang hanya berkata:

```
HIGH EGRESS
```

memberi tahu bahwa sesuatu terjadi.

Alert yang lebih berguna memberi konteks:

```
HIGH EGRESS

Asset      : aplikasi X
Process    : proses Y
Destination: layanan Z
Volume     : ...
Pattern    : burst
Related    : backup sedang berjalan
```

Tujuannya bukan menghilangkan alert.

Tujuannya adalah mengurangi jarak antara **deteksi** dan **pemahaman**.

# Fakta, Inferensi, Hipotesis

Salah satu kebiasaan yang berguna dalam investigasi adalah memisahkan tiga lapisan:

### Fakta

Apa yang benar-benar terukur.

Contoh:

- PPS meningkat.
- Trafik keluar meningkat.
- Sebuah proses memiliki koneksi aktif.

### Inferensi

Interpretasi yang cukup kuat berdasarkan beberapa fakta.

Contoh:

- Trafik kemungkinan berasal dari proses tertentu.

### Hipotesis

Penjelasan yang masih perlu dibuktikan.

Contoh:

- Aktivitas tersebut mungkin merupakan serangan.

Pemisahan ini mencegah hipotesis terdengar seperti fakta.

# Checklist Saat Menemukan Anomali

Sebelum mengambil tindakan:

- Apa sebenarnya yang berubah?
- Dari aset mana perubahan berasal?
- Proses apa yang menghasilkan trafik?
- Ke mana trafik tersebut pergi?
- Aktivitas bisnis atau operasional apa yang sedang berjalan?
- Apakah ada bukti yang mendukung hipotesis awal?
- Apakah ada bukti yang justru membantahnya?
- Apa yang masih belum diketahui?

# Penutup

Sistem monitoring yang baik bukan sistem yang paling cepat mengatakan **"serangan"**.

Sistem yang baik membantu kita menjawab:

> **"Apa yang sedang terjadi, dan apa bukti bahwa kita memahami penyebabnya?"**

Gejala yang sama dapat muncul dari penyebab yang berbeda.

Karena itu prinsip yang sederhana tetap relevan:

**Observe First. Interpret Second. Decide Last.**
