---
layout: article
title: "Anatomi Auth Outage pada E-Commerce Skala Besar: Strategi Decoupled Session & Failover"
date: 2025-12-02T14:30:00+07:00
permalink: /2025/12/shopify-hit-by-login-outage-on-major.html
categories:
  - "Software Architecture"
tags:
  - "software-architecture"
  - "authentication"
  - "distributed-systems"
  - "failover"
  - "e-commerce"
excerpt: "Ketika layer autentikasi terpusat lumpuh saat peak season e-commerce, seluruh funnel transaksi terhenti. Bedah prinsip arsitektur decoupled authentication, stateless token failover, dan isolasi kegagalan sistem terdistribusi."
migrated_from: "https://www.mrohadiz.my.id/2025/12/shopify-hit-by-login-outage-on-major.html"
image: /assets/images/og/2025-12-02-blogger-shopify-hit-by-login-outage-on-major.png
---

<!-- Migrated from Blogger; rewritten as an evergreen architectural analysis for the digital garden. -->

## Masalah Sistemik: Auth sebagai Single Point of Failure (SPOF)

Dalam arsitektur e-commerce terdistribusi, layer autentikasi sering kali diposisikan sebagai gerbang sentral (*central gatekeeper*). Ketika lonjakan trafik masif terjadi—seperti saat Black Friday atau peluncuran produk kilat—kegagalan pada subsistem otentikasi (IDP, token verification, atau database session) dapat memicu efek domino yang melumpuhkan seluruh transaksi, meskipun database produk dan payment gateway berstatus sehat.

Insiden tumbangnya portal login pada platform multi-tenant raksasa membuktikan bahwa autentikasi tidak boleh menjadi *hard dependency* yang mematikan alur *browsing* dan *guest checkout*.

---

## Pola Arsitektur: Decoupling Auth dari Alur Transaksi

Untuk mencegah pemadaman total akibat gangguan auth, sistem harus menerapkan prinsip isolasi kegagalan (*fault isolation*):

```
                     ┌───────────────────────────────┐
                     │         API Gateway           │
                     └───────────────┬───────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│       Identity Provider       │               │      Storefront / Catalog     │
│   (Central OAuth/SSO Pod)     │               │        (Stateless Edge)       │
└──────────────┬────────────────┘               └───────────────┬───────────────┘
               │                                                │
   [ OUTAGE / HIGH LATENCY ]                                    │
               │                                                │
               ▼                                                ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│   Degraded Mode: Allow Guest  │──────────────>│ Checkout Pipeline (Stateless) │
│ Token & Session Edge Caching  │               │   (Cart ID + Cryptographic)   │
└───────────────────────────────┘               └───────────────────────────────┘
```

### 1. Stateless Verification vs Centralized Session Lookups
Menggantungkan verifikasi setiap request ke database sesi terpusat (misal Redis cluster sentral) adalah jebakan skalabilitas. Penggunaan asymmetric cryptography (seperti JWT dengan validasi public key lokal via JWKS cache di edge gateway) memastikan bahwa API service dapat memverifikasi identitas pengguna tanpa melakukan query jaringan ke auth service utama.

### 2. Graceful Degradation & Guest Checkout Fallback
Sistem e-commerce yang tangguh harus memiliki *circuit breaker* otomatis:
- Jika service login mengalami peningkatan latensi di atas batas ambang (misal p99 > 800ms) atau error rate > 2%, antarmuka secara otomatis mengalihkan pengguna ke mode **Guest Checkout**.
- Keranjang belanja diikat pada *ephemeral signed cart cookie* di sisi klien, bukan pada user ID di database pusat. Data transaksi direkonsiliasi belakangan (*eventual reconciliation*) setelah pesanan berhasil dibuat.

---

## Mitigasi Thundering Herd saat Pemulihan (Recovery)

Ketika auth service pulih setelah outage, gelombang *retry* jutaan klien yang melakukan login ulang secara simultan dapat menumbangkan service tersebut kembali (*thundering herd problem*).

Teknik mitigasi esensial meliputi:
- **Exponential Backoff dengan Full Jitter:** Klien aplikasi dan SDK autentikasi wajib menerapkan jitter acak pada rentang interval retry untuk meratakan kurva beban.
- **Adaptive Rate Limiting di Edge Layer:** Membatasi request login per IP dan per tenant menggunakan algoritma Token Bucket terdistribusi (misalnya pada Cloudflare Workers atau Envoy proxy) sebelum paket mencapai application server.
- **Staggered Session Expiry:** Hindari masa kedaluwarsa token yang seragam pada batch pengguna untuk mencegah lonjakan refresh token pada detik yang sama.

---

## Checklist Audit Ketahanan Autentikasi

1. [ ] Apakah katalog produk dan checkout dapat beroperasi tanpa ketergantungan langsung ke auth database?
2. [ ] Apakah JWKS (JSON Web Key Set) di-cache secara lokal di reverse proxy dengan fallback TTL yang cukup panjang?
3. [ ] Apakah terdapat circuit breaker otomatis yang membuka opsi guest checkout ketika auth latency melonjak?
4. [ ] Apakah monitoring p99 latency dan connection pool exhaustion pada database session terhubung ke alert otomatis?

---

## Kesimpulan

Keandalan sistem berskala besar tidak dinilai dari ketiadaan kegagalan, melainkan dari seberapa terisolasi kegagalan tersebut. Dengan memisahkan layer autentikasi dari alur konversi utama, downtime auth tidak akan berubah menjadi bencana finansial bagi bisnis.
