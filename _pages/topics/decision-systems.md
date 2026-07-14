---
layout: page
title: "Decision Systems"
description: "Catatan M. Rohadiz tentang Decision Systems dan Decision Intelligence: framework keputusan berbasis data, OODA Loop, mental models, dan trade-off analysis untuk pengambilan keputusan yang lebih robust."
permalink: /topics/decision-systems/
badge: Decision Systems
badge-class: badge-success
---

{% assign decision_posts = site.posts | where_exp: "p", "p.categories contains 'Decision Systems' or p.tags contains 'decision-making' or p.tags contains 'framework' or p.tags contains 'mental-model' or p.tags contains 'ooda-loop'" %}

**Decision Intelligence** adalah perpaduan antara data science, behavioral economics, dan systems thinking untuk merancang proses pengambilan keputusan yang lebih robust dan transparan. Saya percaya bahwa keputusan yang baik lahir dari observasi yang baik — dan observasi yang baik membutuhkan sistem yang dirancang untuk mengungkap realitas, bukan menyembunyikannya.

📚 **{{ decision_posts | size }} artikel** tersedia di topik ini.

## Area yang Saya Eksplorasi

- **OODA Loop** — Observe-Orient-Decide-Act framework untuk keputusan adaptif
- **Mental Models** — Framework berpikir yang membantu melihat masalah dengan lebih jelas
- **Trade-off Analysis** — Metodologi untuk mengevaluasi pilihan secara sistematis
- **Decision Frameworks** — Struktur untuk keputusan berulang dan organisasional
- **Cognitive Biases** — Memahami dan memitigasi bias dalam pengambilan keputusan
- **KPI & Measurement** — Mengukur apa yang benar-benar penting, bukan yang mudah diukur

## Artikel Terbaru

{% for post in decision_posts limit:5 %}
- **[{{ post.title }}]({{ post.url | relative_url }})** — <small>{{ post.date | date: "%d %b %Y" }}</small>
  <br><small>{{ post.excerpt | strip_html | strip_newlines | truncatewords: 20 }}</small>
{% endfor %}
{% if decision_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

## Topik Terkait

[AI Engineering](/topics/ai-engineering/) · [Software Architecture](/topics/software-architecture/) · [Infrastructure](/topics/infrastructure/) · [Crypto Observation](/topics/crypto-observation/)

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
