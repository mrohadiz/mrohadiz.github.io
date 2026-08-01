---
layout: article
title: "Jangan Membangun Fitur, Bangunlah Capability"
date: 2026-08-02
categories:
  - Software Architecture
tags:
  - capability
  - architecture
  - systems-thinking
  - decision-systems
  - software-design
excerpt: "Banyak sistem gagal bukan karena teknologinya buruk, melainkan karena organisasi mencoba membangun fitur sebelum memahami capability yang sebenarnya dibutuhkan."
image: /assets/images/og/2026-08-02-capability-sebelum-fitur.png
---

# Jangan Membangun Fitur, Bangunlah Capability

## Ringkasan

Dalam banyak proyek, diskusi sering dimulai dengan pertanyaan:

> "Fitur apa yang perlu dibuat?"

Padahal pertanyaan tersebut biasanya datang terlalu cepat.

Fitur hanyalah implementasi. Yang lebih penting adalah memahami capability apa yang sebenarnya ingin dimiliki oleh sistem.

Ketika capability sudah jelas, pilihan fitur biasanya menjadi jauh lebih sederhana.

---

# Feature Bersifat Sementara

Framework berubah.

Bahasa pemrograman berubah.

Platform berubah.

Teknologi berubah.

Namun capability yang ingin dimiliki sebuah sistem sering kali bertahan jauh lebih lama.

Sebagai contoh:

- mampu melakukan observasi;
- mampu melakukan evaluasi;
- mampu memberikan umpan balik;
- mampu mengambil keputusan berdasarkan evidence;
- mampu melakukan audit.

Capability tersebut tetap relevan meskipun implementasinya berganti berkali-kali.

---

# Capability Lebih Penting daripada Implementasi

Sebelum membangun sesuatu, cobalah bertanya:

- Kemampuan apa yang ingin dimiliki?
- Siapa yang akan menggunakan capability tersebut?
- Keputusan apa yang akan menjadi lebih baik setelah capability tersedia?
- Apakah capability tersebut benar-benar dibutuhkan saat ini?

Sering kali jawaban atas pertanyaan tersebut justru mengubah implementasi yang akan dipilih.

---

# Mental Model

```text
Masalah
    ↓
Capability
    ↓
Implementasi
    ↓
Fitur
```

Fitur bukan tujuan.

Fitur hanyalah salah satu bentuk implementasi dari sebuah capability.

---

# Kesalahan yang Sering Terjadi

## Menganggap Fitur Sebagai Tujuan

Permintaan fitur muncul tanpa menjelaskan perubahan apa yang ingin dicapai.

Akibatnya, sistem semakin kompleks tetapi tidak benar-benar meningkatkan kualitas keputusan.

---

## Mengganti Teknologi untuk Menyelesaikan Masalah

Tidak semua masalah dapat diselesaikan dengan platform baru.

Jika workflow, ownership, atau proses belum jelas, teknologi baru sering kali hanya memindahkan kompleksitas ke tempat lain.

---

## Capability Tidak Memiliki Owner

Capability yang baik selalu memiliki pemilik yang bertanggung jawab terhadap kualitasnya.

Tanpa ownership, capability perlahan akan kehilangan arah meskipun implementasinya terus berkembang.

---

# Checklist Sebelum Menambahkan Fitur Baru

Sebelum menyetujui pembangunan sebuah fitur, tanyakan beberapa hal berikut.

- Capability apa yang ingin dibangun?
- Masalah apa yang sedang diselesaikan?
- Keputusan apa yang akan berubah?
- Apakah capability tersebut sudah memiliki owner?
- Apakah implementasi ini benar-benar cara terbaik untuk membangun capability tersebut?
- Apakah kompleksitas yang ditambahkan sebanding dengan manfaatnya?

Jika pertanyaan-pertanyaan tersebut belum dapat dijawab, kemungkinan organisasi belum membutuhkan fitur baru.

---

# Mengapa Cara Berpikir Ini Penting?

Ketika diskusi dimulai dari capability, organisasi menjadi lebih mudah beradaptasi terhadap perubahan teknologi.

Implementasi boleh berubah.

Framework boleh berganti.

Platform boleh diganti.

Namun capability yang menjadi fondasi sistem tetap dapat dipertahankan.

Dengan cara ini, sistem berkembang melalui peningkatan kemampuan, bukan sekadar penambahan fitur.

---

# Penutup

Teknologi adalah alat.

Fitur adalah implementasi.

Capability adalah tujuan yang ingin dicapai.

Semakin jelas capability yang ingin dibangun, semakin mudah memilih teknologi, merancang arsitektur, dan mengevaluasi apakah sebuah fitur benar-benar memberikan nilai.

Pada akhirnya, sistem yang bertahan lama bukanlah sistem dengan fitur terbanyak, melainkan sistem yang terus memperkuat capability yang dimilikinya.
