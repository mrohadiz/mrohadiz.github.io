---
layout: page
title: "How I Work"
description: "Setup kerja, tools, dan workflow harian M. Rohadiz sebagai Software Architect: cara mendokumentasikan keputusan, digital garden sebagai external brain, dan sistem untuk deep work."
permalink: /how-i-work/
badge: Process
badge-class: badge-success
---

Halaman ini mendokumentasikan cara saya bekerja — bukan sebagai panduan universal, tapi sebagai catatan tentang apa yang berhasil untuk saya dan mengapa. Setup ini terus berevolusi seiring saya memahami lebih baik cara saya berpikir dan belajar.

## Tech Stack

### Bahasa & Framework
- **Go, Python, TypeScript** — bahasa utama untuk membangun sistem
- **PostgreSQL, ClickHouse** — database pilihan untuk analytical dan transactional workloads
- **gRPC + REST** — protocol untuk inter-service communication
- **Docker + Kubernetes** — container orchestration untuk deployment

### Observability
- **Prometheus + Grafana** — metrics dan dashboarding
- **Structured logging** (JSON) — untuk semua service
- **Distributed tracing** — untuk debugging microservices

### AI Tools
- **LLM APIs** (Claude, GPT-4) — untuk drafting, review, dan brainstorming
- **RAG pipelines** — untuk knowledge retrieval dari internal dokumentasi

---

## Cara Mendokumentasikan Keputusan

Setiap keputusan arsitektural atau strategis yang signifikan saya dokumentasikan menggunakan **Architectural Decision Records (ADR)**:

```
# ADR-001: Pilih gRPC untuk inter-service communication

## Status: Accepted

## Context
Service A perlu berkomunikasi dengan Service B dengan latensi rendah.
Volume: ~10k request/detik.

## Decision
Gunakan gRPC dengan Protocol Buffers.

## Consequences
+ Strong typing via protobuf schema
+ Lebih efisien daripada REST untuk high-frequency calls
- Lebih kompleks untuk debugging dibanding REST
- Membutuhkan tooling tambahan untuk browser-based clients
```

Format ini memaksa saya untuk menuliskan **konteks** (mengapa keputusan ini perlu dibuat) dan **konsekuensi** (apa yang diterima dan ditolak) — bukan hanya apa yang diputuskan.

---

## Workflow Harian

### Pagi — Context Loading
Saya memulai hari dengan membaca catatan dari hari sebelumnya dan melihat queue pekerjaan. Ini bukan ritual produktivitas — ini cara saya memuat kembali konteks yang hilang selama tidur.

### Deep Work Blocks
Saya alokasikan 2-3 jam untuk deep work di pagi hari tanpa interruption. Pekerjaan yang membutuhkan konsentrasi tinggi (menulis kode kompleks, merancang arsitektur, analisis data) masuk ke blok ini.

### Capture → Connect → Cultivate
Setiap ide, observasi, atau insight yang muncul saya capture segera (via teks singkat). Kemudian saya connect dengan ide yang sudah ada di dalam digital garden. Cultivate artinya mengembangkan ide tersebut secara bertahap menjadi catatan yang lebih matang.

### Weekly Review
Setiap akhir minggu, saya melakukan review terhadap:
- Keputusan apa yang dibuat minggu ini?
- Asumsi apa yang terbukti salah?
- Apa yang ingin saya pelajari lebih lanjut?

---

## Digital Garden sebagai External Brain

Website ini bukan blog — ini adalah **external brain** saya. Bedanya:

| Blog | Digital Garden |
|------|----------------|
| Linear, berurutan | Non-linear, saling terhubung |
| Artikel selesai baru dipublish | Artikel bisa dalam progress |
| Untuk pembaca | Untuk pembaca *dan* untuk diri sendiri |
| Static | Terus berkembang |

Saya menulis di sini untuk **mengeksternalisasi pemikiran** — memindahkan working memory ke sistem yang persistent dan searchable.

---

*Lihat juga: [Methodology](/methodology/) · [Principles](/principles/) · [About](/about/)*
