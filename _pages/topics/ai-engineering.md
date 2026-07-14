---
layout: page
title: "AI Engineering"
description: "Catatan M. Rohadiz tentang AI Engineering: LLM integration, reasoning engines, RAG systems, dan AI infrastructure untuk production. Membangun sistem AI yang reliable dan observable."
permalink: /topics/ai-engineering/
badge: AI Engineering
badge-class: badge-primary
---

{% assign ai_posts = site.posts | where_exp: "p", "p.categories contains 'AI Engineering' or p.tags contains 'ai' or p.tags contains 'llm' or p.tags contains 'reasoning' or p.tags contains 'rag'" %}

**AI Engineering** adalah disiplin yang menjembatani research AI dengan rekayasa perangkat lunak nyata. Tantangannya bukan hanya membuat model yang akurat, tapi membangun sistem yang *reliable*, *observable*, dan *maintainable* di lingkungan production. Saya mendokumentasikan pola, arsitektur, dan keputusan teknis dari membangun sistem AI yang benar-benar bekerja.

📚 **{{ ai_posts | size }} artikel** tersedia di topik ini.

## Area yang Saya Eksplorasi

- **LLM Integration** — Mengintegrasikan Large Language Models ke dalam workflow yang ada
- **Reasoning Engines** — Membangun sistem yang mampu melakukan chain-of-thought dan multi-step reasoning
- **AI Infrastructure** — Deployment, monitoring, dan scaling sistem AI
- **RAG Systems** — Retrieval-Augmented Generation untuk knowledge-intensive tasks
- **Agent Frameworks** — Desain sistem agen otonom yang dapat mengambil aksi

## Artikel Terbaru

{% for post in ai_posts limit:5 %}
- **[{{ post.title }}]({{ post.url | relative_url }})** — <small>{{ post.date | date: "%d %b %Y" }}</small>
  <br><small>{{ post.excerpt | strip_html | strip_newlines | truncatewords: 20 }}</small>
{% endfor %}
{% if ai_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

## Topik Terkait

[Decision Systems](/topics/decision-systems/) · [Infrastructure](/topics/infrastructure/) · [Software Architecture](/topics/software-architecture/) · [Crypto Observation](/topics/crypto-observation/)

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
