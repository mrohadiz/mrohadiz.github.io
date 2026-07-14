---
layout: page
title: "Decision Systems"
description: >-
  Catatan tentang Decision Systems dan Decision Intelligence oleh M. Rohadiz — framework
  pengambilan keputusan berbasis data, OODA Loop, mental models, dan rekayasa sistem keputusan.
permalink: /topics/decision-systems/
badge: Decision Systems
badge-class: badge-success
---

Kumpulan catatan, artikel, dan framework tentang **Decision Systems** dan **Decision Intelligence** — bagaimana membangun sistem dan kebiasaan berpikir yang menghasilkan keputusan yang lebih baik.

**Decision Intelligence** adalah perpaduan antara data science, behavioral economics, dan systems thinking untuk merancang proses pengambilan keputusan yang lebih robust dan transparan.

## Area yang Saya Eksplorasi

- **OODA Loop** — Observe-Orient-Decide-Act framework untuk keputusan adaptif
- **Mental Models** — Framework berpikir yang membantu melihat masalah dengan lebih jelas
- **Trade-off Analysis** — Metodologi untuk mengevaluasi pilihan secara sistematis
- **Decision Frameworks** — Struktur untuk keputusan berulang dan organisasional
- **Cognitive Biases** — Memahami dan memitigasi bias dalam pengambilan keputusan
- **Quantitative Decision Making** — Data-driven approach untuk mendukung judgment

## Catatan Terbaru

{% assign decision_posts = site.posts | where_exp: "post", "post.categories contains 'Decision Systems' or post.tags contains 'decision-making' or post.tags contains 'framework' or post.tags contains 'mental-model'" %}
{% for post in decision_posts limit:10 %}
- [{{ post.title }}]({{ post.url | relative_url }}) — <small>{{ post.date | date: "%b %d, %Y" }}</small>
{% endfor %}
{% if decision_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
