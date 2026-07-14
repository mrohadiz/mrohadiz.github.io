---
layout: page
title: "Glossary"
description: "Kamus istilah yang sering digunakan M. Rohadiz: Decision Intelligence, Convergence Signal, Observability, OODA Loop, KXE, dan istilah teknis lainnya dalam konteks AI Engineering dan Decision Systems."
permalink: /glossary/
badge: Reference
badge-class: badge-outline
---

Kumpulan definisi untuk istilah-istilah yang sering muncul di catatan ini. Definisi ini adalah cara saya menggunakan istilah-istilah tersebut — bukan definisi universal, tapi cukup untuk memahami konteks dalam catatan ini.

---

## Architectural Decision Record (ADR)

Dokumen pendek yang mencatat sebuah keputusan arsitektural signifikan: konteks (mengapa keputusan ini perlu dibuat), keputusan yang diambil, dan konsekuensinya (apa yang diterima dan ditolak). ADR membuat reasoning di balik keputusan visible untuk masa depan.

---

## Convergence Signal

Dalam konteks analisis pasar, convergence signal adalah kondisi di mana beberapa indikator atau timeframe berbeda menunjukkan arah yang sama secara bersamaan. Convergence meningkatkan confidence, tapi tidak mengeliminasi ketidakpastian.

---

## Decision Intelligence

Perpaduan antara data science, behavioral economics, dan systems thinking untuk merancang proses pengambilan keputusan yang lebih robust, transparan, dan dapat dipertanggungjawabkan. Berbeda dari "business intelligence" yang berfokus pada reporting — decision intelligence berfokus pada *kualitas keputusan* itu sendiri.

---

## Digital Garden

Pendekatan terhadap personal knowledge management di mana catatan diperlakukan seperti tanaman yang tumbuh — tidak harus sempurna saat pertama kali ditulis, terus berkembang seiring pemahaman bertambah, dan saling terhubung satu sama lain. Berbeda dari blog konvensional yang bersifat linear dan final.

---

## Event-Driven Architecture (EDA)

Pola arsitektur di mana komponen sistem berkomunikasi melalui events (kejadian yang terjadi) daripada direct calls. Memungkinkan loose coupling, scalability, dan audit trail yang natural — tapi menambah kompleksitas debugging dan eventual consistency.

---

## KXE (Knowledge Extraction Engine)

Singkatan internal untuk sistem yang saya bangun untuk mengekstrak, mengorganisasi, dan menghubungkan pengetahuan dari berbagai sumber. KXE adalah fondasi dari sistem Knowledge Repository.

---

## Observability

Kemampuan untuk memahami state internal sebuah sistem hanya dari outputnya (logs, metrics, traces) — tanpa perlu mengubah sistem atau menambahkan instrumentasi baru. Sistem yang observable dapat didiagnosis dari luar; sistem yang hanya "monitored" hanya tahu *apakah* sesuatu salah, bukan *mengapa*.

---

## OODA Loop

Framework pengambilan keputusan dari John Boyd: **O**bserve → **O**rient → **D**ecide → **A**ct. Awalnya untuk strategi militer udara, sangat applicable untuk keputusan bisnis dan teknis. Kunci dari OODA bukan kecepatan siklus, tapi kualitas fase *Orient* — di mana mental model diperbarui berdasarkan observasi baru.

---

## Pre-mortem

Teknik evaluasi keputusan di mana Anda *membayangkan keputusan sudah gagal* dan kemudian bertanya: "Apa yang menyebabkannya gagal?" Berbeda dari post-mortem (dilakukan setelah kegagalan), pre-mortem dilakukan sebelum implementasi untuk mengidentifikasi risiko yang mungkin terlewat.

---

## RADAR

Nama sistem market intelligence yang saya bangun: Real-time Aggregation, Detection, Analysis, dan Reporting. Sistem ini mengumpulkan data pasar kripto dari berbagai sumber secara real-time untuk mendukung decision support.

---

## Root Cause Analysis (RCA)

Proses sistematis untuk mengidentifikasi penyebab fundamental dari sebuah masalah — bukan hanya gejalanya. Metode yang sering saya gunakan: 5 Whys (menanya "mengapa?" berulang kali hingga mencapai akar masalah) dan fishbone diagram.

---

## Second-Order Effects

Dampak tidak langsung dari sebuah keputusan atau perubahan. Jika A menyebabkan B (first-order), dan B menyebabkan C (second-order), maka C adalah second-order effect dari A. Banyak keputusan teknis yang terlihat baik di tingkat pertama memiliki second-order effects yang merugikan.

---

## Signal-to-Noise Ratio

Dalam konteks analisis data dan monitoring: rasio antara informasi yang benar-benar berguna (signal) versus data yang tidak relevan atau menyesatkan (noise). Meningkatkan signal-to-noise adalah inti dari membangun observability yang efektif.

---

## SMART (Storage)

**S**elf-**M**onitoring, **A**nalysis, and **R**eporting **T**echnology — sistem built-in dalam hard disk dan SSD untuk memonitor kondisi hardware. Status "SMART PASSED" tidak berarti storage bebas masalah; SMART mengukur kesehatan media, bukan kualitas komunikasi antara drive dan host.

---

## Systems Thinking

Pendekatan untuk memahami masalah dengan melihat sistem secara keseluruhan — bukan bagian-bagiannya secara terpisah. Systems thinking memperhatikan: feedback loops, time delays, dan bagaimana perubahan pada satu bagian mempengaruhi keseluruhan sistem.

---

## Technical Debt

Biaya tersembunyi dari keputusan teknis yang mengutamakan kecepatan jangka pendek di atas kualitas jangka panjang. Seperti utang finansial, technical debt perlu "dibayar" — dan biasanya dengan bunga berupa complexity yang bertambah dan velocity yang melambat.

---

## Working Memory (Eksternal)

Metafora untuk fungsi digital garden: memindahkan informasi dari working memory (pikiran) ke media eksternal yang persistent dan searchable. Otak manusia memiliki kapasitas working memory yang terbatas — sistem eksternal memperluasnya.

---

*Lihat juga: [Principles](/principles/) · [Methodology](/methodology/) · [How I Work](/how-i-work/)*
