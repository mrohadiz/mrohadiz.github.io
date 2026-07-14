---
layout: page
title: "Crypto Observation"
description: "Catatan M. Rohadiz tentang Crypto Observation: analisis pasar kripto, on-chain data, market microstructure, DeFi protocols, dan data-driven approach untuk memahami crypto market dynamics."
permalink: /topics/crypto-observation/
badge: Crypto Observation
badge-class: badge-danger
---

{% assign crypto_posts = site.posts | where_exp: "p", "p.categories contains 'Crypto' or p.categories contains 'Crypto Observation' or p.tags contains 'crypto' or p.tags contains 'defi' or p.tags contains 'on-chain' or p.tags contains 'trading' or p.tags contains 'market'" %}

Saya mendekati pasar kripto sebagai **sistem yang kompleks**, bukan sebagai instrumen spekulasi. **Market microstructure**, **on-chain data**, dan behavioral patterns memberikan sinyal yang lebih kaya daripada harga semata. Observasi yang sistematis — bukan intuisi — adalah fondasi dari setiap keputusan. Catatan ini mendokumentasikan metodologi dan temuan dari proses observasi tersebut.

📚 **{{ crypto_posts | size }} artikel** tersedia di topik ini.

## Area yang Saya Amati

- **Market Microstructure** — Order flow, liquidity dynamics, bid-ask spread behavior
- **On-Chain Analytics** — Blockchain data, wallet clustering, protocol metrics
- **DeFi Protocols** — AMM mechanics, liquidity provision, protocol risk assessment
- **Convergence Signals** — Multi-timeframe signal analysis dan confluence detection
- **Market Intelligence** — RADAR system untuk real-time market monitoring
- **Sentiment & Macro** — Social signals, fear/greed cycles, macro correlation

## Artikel Terbaru

{% for post in crypto_posts limit:5 %}
- **[{{ post.title }}]({{ post.url | relative_url }})** — <small>{{ post.date | date: "%d %b %Y" }}</small>
  <br><small>{{ post.excerpt | strip_html | strip_newlines | truncatewords: 20 }}</small>
{% endfor %}
{% if crypto_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

## Topik Terkait

[Decision Systems](/topics/decision-systems/) · [AI Engineering](/topics/ai-engineering/) · [Software Architecture](/topics/software-architecture/) · [Infrastructure](/topics/infrastructure/)

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
