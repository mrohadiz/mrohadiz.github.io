---
layout: article
title: "Hybrid Query Routing: Optimalisasi Biaya Komputasi & Latensi dalam Search Engine Berbasis LLM"
date: 2025-12-03T16:20:00+07:00
permalink: /2025/12/gemini-3-now-used-for-some-queries-in.html
categories:
  - "AI Engineering"
tags:
  - "ai"
  - "llm"
  - "query-routing"
  - "cost-optimization"
  - "search-architecture"
excerpt: "Mengapa mesin pencari modern tidak menggunakan model AI raksasa untuk semua kueri? Analisis teknik Hybrid Query Routing untuk menyeimbangkan latensi mili-detik dan efisiensi biaya GPU per query."
migrated_from: "https://www.mrohadiz.my.id/2025/12/gemini-3-now-used-for-some-queries-in.html"
image: /assets/images/og/2025-12-03-gemini-3-now-used-for-some-queries-in.png
---

<!-- Migrated from Blogger; rewritten as an evergreen architectural analysis for the digital garden. -->

## Dilema Ekonomi Komputasi LLM dalam Mesin Pencari

Mengoperasikan mesin pencari skala global berarti melayani miliaran kueri setiap hari dengan ekspektasi waktu respons di bawah 500 milidetik. Menjalankan model penalaran masif (*frontier models*) seperti Gemini 3 atau Claude Opus untuk setiap kata kunci sederhana (misalnya *"cuaca hari ini"* atau *"login facebook"*) adalah bunuh diri finansial dan arsitektural.

Biaya komputasi (FLOPs per token) dan konsumsi daya GPU/TPU menuntut strategi komputasi berlapis. Kunci utama keberhasilan integrasi AI ke dalam antarmuka pencarian massal terletak pada **Hybrid Query Routing**.

---

## Mekanika Kerja Hybrid Query Routing

Sistem routing cerdas bertindak sebagai *traffic controller* berkecepatan tinggi yang mengevaluasi kompleksitas kueri sebelum memutuskan model apa yang akan dipanggil:

```
                      [ Kueri Pengguna Masuk ]
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │  Fast Classifier (< 15ms)   │
                   │ (Small BERT / Edge Distill) │
                   └──────────────┬──────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼ (Navigational / Fact)  ▼ (Direct Search)        ▼ (Complex Synthesis)
  ┌──────────────┐         ┌──────────────┐         ┌───────────────────┐
  │ Cache / Zero-│         │ Fast / Nano  │         │ Deep Reasoning    │
  │ Result SERP  │         │ Model Engine │         │ (Frontier LLM)    │
  └──────┬───────┘         └──────┬───────┘         └─────────┬─────────┘
         │ (Latency: ~50ms)       │ (Latency: ~200ms)         │ (Latency: ~800ms)
         │ (Cost: ~$0.00001)      │ (Cost: ~$0.0002)          │ (Cost: ~$0.01)
         └────────────────────────┼───────────────────────────┘
                                  ▼
                     [ Render Hasil Pencarian ]
```

### 1. Zero-Shot Pre-Filter & Cache Layer (Tier 0)
Sebagian besar kueri harian adalah kueri berulang (*navigational queries*). Kueri ini langsung dilayani oleh memori cache edge atau database hasil terstruktur tanpa menyentuh inference engine AI apa pun. Latensi: < 50ms.

### 2. Low-Parameter Distilled Models (Tier 1)
Untuk kueri berbasis informasi faktual tunggal (seperti konversi mata uang, skor pertandingan, atau definisi singkat), sistem memanggil model kecil yang sangat teroptimasi (misal Gemini Flash atau model 1B-3B parameter). Model ini dilatih khusus untuk mengekstrak fakta ringkas dengan throughput tinggi. Latensi: ~150-250ms.

### 3. Frontier Reasoning Models (Tier 2)
Hanya sebagian kecil kueri (diperkirakan 10-20%) yang memerlukan pemikiran sintetis mendalam—seperti perbandingan multi-dimensi, analisis kode pemrograman, atau pemecahan masalah ilmiah yang rumit—yang dialihkan ke model penalaran generasi terbaru (seperti Gemini 3 penuh). Latensi: ~500-1200ms.

---

## 3 Metrik Evaluasi Efisiensi Query Routing

Bagi arsitek sistem yang merancang pipeline AI/RAG internal perusahaan:

1. **Routing Accuracy:** Seberapa tepat classifier mengidentifikasi kueri rumit tanpa membebani model besar dengan kueri remeh.
2. **Cost-Per-Resolved-Query (CPRQ):** Rasio total biaya komputasi dibagi jumlah kueri yang dijawab dengan benar tanpa memicu retry dari pengguna.
3. **P99 Latency SLA:** Menjamin bahwa bahkan kueri yang diarahkan ke model penalaran tetap memiliki batas waktu eksekusi yang manusiawi melalui *speculative decoding* dan *streamed token responses*.

---

## Kesimpulan

Keberhasilan implementasi AI dalam produk skala massal tidak diukur dari seberapa besar parameter model yang Anda gunakan, melainkan seberapa cerdas Anda menyembunyikan beban komputasi tersebut di balik arsitektur routing yang efisien. Memahami kompromi antara biaya, latensi, dan akurasi adalah pembeda antara konsep prototipe dan sistem produksi yang berkelanjutan.
