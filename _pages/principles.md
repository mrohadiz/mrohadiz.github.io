---
layout: page
title: "Principles"
description: "Prinsip-prinsip kerja dan berpikir M. Rohadiz: dari observation before interpretation hingga state uncertainty explicitly. Fondasi dari setiap keputusan teknis dan strategis."
permalink: /principles/
badge: Principles
badge-class: badge-primary
---

Ini adalah prinsip-prinsip yang membentuk cara saya berpikir dan bekerja. Bukan aturan kaku — ini adalah heuristik yang terus saya uji terhadap realitas. Ketika sebuah prinsip gagal menjelaskan situasi, itu sinyal untuk direvisi, bukan diabaikan.

---

## 1. Observation Before Interpretation

Pisahkan antara *apa yang terjadi* dan *mengapa hal itu terjadi*. Banyak kesalahan diagnosa dimulai dari lompatan prematur ke interpretasi sebelum observasi selesai.

Dalam praktik: ketika sebuah sistem bermasalah, saya mengumpulkan log, metrics, dan timeline terlebih dahulu — sebelum berhipotesis tentang root cause.

---

## 2. State Uncertainty Explicitly

Tidak mengetahui sesuatu bukan kelemahan — itu informasi yang berguna. Saya terbiasa menuliskan level konfiden secara eksplisit: *"Hipotesis ini 60% reliable"* atau *"Asumsi yang belum diverifikasi: ..."*

Ini membantu orang lain (dan diri saya sendiri di masa depan) memahami batas-batas dari sebuah analisis.

---

## 3. Make It Observable First

Sebelum mengoptimasi sistem, pastikan sistem tersebut dapat diobservasi. Sistem yang tidak dapat di-debug tidak dapat diperbaiki dengan andal — hanya bisa ditebak.

*"You can't improve what you can't measure — but you also can't improve what you can't understand."*

---

## 4. Cheap-to-Reverse Before Expensive-to-Reverse

Untuk keputusan dengan konsekuensi besar, selalu cari versi reversible-nya terlebih dahulu. Experiment sebelum commit. Spike sebelum implementasi penuh. Prototype sebelum production.

Ini bukan kehati-hatian berlebihan — ini adalah cara untuk belajar lebih cepat dengan biaya yang lebih rendah.

---

## 5. The Best System Is the One You Can Understand

Kompleksitas yang tidak diperlukan adalah utang yang akan ditagih. Setiap abstraksi, setiap layer, setiap generalisasi harus menghasilkan value yang melebihi cognitive overhead yang ditambahkannya.

Lebih baik solusi sederhana yang dipahami tim, daripada solusi elegan yang tidak ada yang mengerti.

---

## 6. Feedback Loops Are Infrastructure

Sebuah sistem tanpa feedback adalah sistem yang berjalan buta. Feedback bukan hanya tentang monitoring teknis — ini tentang mekanisme untuk tahu apakah keputusan yang dibuat menghasilkan output yang diharapkan.

Dalam software: unit test, observability, staging environment.  
Dalam keputusan: pre-mortem, retrospective, decision log.

---

## 7. Separate Signal from Noise Deliberately

Tidak semua data adalah informasi. Tidak semua informasi adalah signal. Kemampuan untuk memilah mana yang perlu diperhatikan dan mana yang bisa diabaikan adalah skill yang underrated.

Ini berlaku untuk monitoring dashboard, analisis pasar, maupun feedback dari pengguna.

---

## 8. Write to Think, Not to Report

Menulis bukan output dari pemikiran — menulis *adalah* pemikiran itu sendiri. Saya tidak menulis karena saya sudah paham sesuatu; saya menulis untuk *mencapai* pemahaman.

Inilah mengapa catatan di website ini sering tidak sempurna — karena itu adalah proses, bukan hasil akhir.

---

## 9. Context Is Part of the Answer

Solusi tanpa konteks adalah solusi yang setengah jadi. Setiap rekomendasi teknis, setiap keputusan arsitektural, setiap analisis pasar hanya valid dalam konteks tertentu. Saat menerima advice, selalu tanyakan: *"Konteks apa yang membuat advice ini berlaku?"*

---

## 10. Systems Have Second-Order Effects

Mengoptimasi satu bagian sistem sering berdampak negatif pada bagian lain. Sebelum mengimplementasikan perubahan, saya mencoba memodelkan second-order effects: *"Jika kita melakukan X, apa yang akan berubah secara tidak langsung?"*

Ini tidak selalu bisa diprediksi dengan akurat — tapi menanyakannya secara eksplisit membantu menghindari surprise yang tidak perlu.

---

*Lihat juga: [Methodology](/methodology/) · [How I Work](/how-i-work/) · [Glossary](/glossary/)*
