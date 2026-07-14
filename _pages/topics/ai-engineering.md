---
layout: page
title: "AI Engineering"
description: >-
  Catatan dan artikel tentang AI Engineering oleh M. Rohadiz — meliputi LLM integration,
  reasoning engines, AI infrastructure, machine learning systems, dan produksi sistem AI.
permalink: /topics/ai-engineering/
badge: AI Engineering
badge-class: badge-primary
---

Kumpulan catatan, artikel, dan observasi tentang **AI Engineering** — dari ide hingga sistem yang berjalan di production.

AI Engineering adalah disiplin yang menjembatani research AI dengan rekayasa perangkat lunak nyata. Tantangannya bukan hanya membuat model yang akurat, tapi membangun sistem yang *reliable*, *observable*, dan *maintainable* di lingkungan production.

## Area yang Saya Eksplorasi

- **LLM Integration** — Mengintegrasikan Large Language Models ke dalam workflow yang ada
- **Reasoning Engines** — Membangun sistem yang mampu melakukan chain-of-thought dan multi-step reasoning
- **AI Infrastructure** — Deployment, monitoring, dan scaling sistem AI
- **RAG Systems** — Retrieval-Augmented Generation untuk knowledge-intensive tasks
- **Agent Frameworks** — Desain sistem agen otonom yang dapat mengambil aksi
- **Prompt Engineering** — Teknik lanjutan untuk mengarahkan behavior model

## Catatan Terbaru

{% assign ai_posts = site.posts | where_exp: "post", "post.categories contains 'AI Engineering' or post.tags contains 'ai' or post.tags contains 'llm' or post.tags contains 'reasoning'" %}
{% for post in ai_posts limit:10 %}
- [{{ post.title }}]({{ post.url | relative_url }}) — <small>{{ post.date | date: "%b %d, %Y" }}</small>
{% endfor %}
{% if ai_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
