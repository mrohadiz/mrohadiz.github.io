---
layout: page
title: "Crypto Observation"
description: >-
  Catatan tentang Crypto Observation oleh M. Rohadiz — analisis pasar kripto, on-chain data,
  DeFi protocols, market microstructure, dan data-driven approach untuk memahami market dynamics.
permalink: /topics/crypto-observation/
badge: Crypto Observation
badge-class: badge-danger
---

Kumpulan catatan dan observasi tentang **Crypto Observation** — menggunakan data-driven approach untuk memahami market dynamics, on-chain metrics, dan DeFi ecosystem.

Saya mendekati pasar kripto sebagai sistem yang kompleks, bukan sebagai instrumen spekulasi. **Market microstructure**, **on-chain data**, dan **behavioral patterns** memberikan sinyal yang lebih kaya daripada harga semata.

## Area yang Saya Amati

- **Market Microstructure** — Order flow, liquidity, bid-ask dynamics
- **On-Chain Analytics** — Blockchain data, wallet analysis, protocol metrics
- **DeFi Protocols** — AMM mechanics, yield strategies, protocol risks
- **Sentiment Analysis** — Social signals, fear/greed indicators
- **Trading Systems** — Algorithmic approaches, backtest methodology
- **Market Intelligence** — RADAR system untuk real-time monitoring

## Catatan Terbaru

{% assign crypto_posts = site.posts | where_exp: "post", "post.categories contains 'Crypto' or post.tags contains 'crypto' or post.tags contains 'defi' or post.tags contains 'on-chain' or post.tags contains 'trading'" %}
{% for post in crypto_posts limit:10 %}
- [{{ post.title }}]({{ post.url | relative_url }}) — <small>{{ post.date | date: "%b %d, %Y" }}</small>
{% endfor %}
{% if crypto_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
