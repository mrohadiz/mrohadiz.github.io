---
layout: page
title: "AI Engineering"
description: "Membangun sistem AI yang reliable, observable, dan maintainable di lingkungan production."
permalink: /topics/ai-engineering/
badge: AI Engineering
badge-class: badge-primary
---

{% assign topic_posts = site.posts | where_exp: "p", "p.categories contains 'AI Engineering' or p.tags contains 'ai'" %}

**AI Engineering** adalah disiplin yang menjembatani research AI dengan rekayasa perangkat lunak nyata. 

### Why it Matters
Dalam transisi dari *Proof of Concept* ke *Production*, sistem AI sering rapuh. Disiplin ini memastikan arsitektur dapat mentolerir halusinasi, melakukan *multi-step reasoning*, dan diskalakan dengan aman di skala enterprise.

### Related Concepts
<div class="concepts-container">
  <a href="/topics/decision-systems/" class="badge badge-success">Decision Systems</a>
  <a href="/topics/infrastructure/" class="badge badge-warning">Infrastructure</a>
  <span class="badge badge-outline">LLM</span>
  <span class="badge badge-outline">RAG</span>
  <span class="badge badge-outline">Reasoning</span>
</div>

### Recommended Learning Path
Ikuti alur bacaan ini untuk membangun fondasi pemahaman secara bertahap:
<div class="learning-path-container">
{% assign sorted = topic_posts | sort: "date" %}
{% for p in sorted %}
  <div class="learning-path-item"><a href="{{ p.url | relative_url }}" class="learning-path-link">{{ p.title }}</a></div>
{% else %}
  <div>Belum ada artikel di jalur ini.</div>
{% endfor %}
</div>

### Glossary Terms
Beberapa istilah inti yang sering muncul:
- **RAG:** Pola arsitektur untuk memberikan konteks eksternal pada LLM. [Lihat Glosarium &rarr;](/glossary/)
- **Reasoning Engine:** Sistem AI yang dirancang memecah masalah kompleks. [Lihat Glosarium &rarr;](/glossary/)
