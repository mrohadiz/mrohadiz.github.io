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
<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
  <a href="/topics/decision-systems/" class="badge badge-success" style="text-decoration:none;">Decision Systems</a>
  <a href="/topics/infrastructure/" class="badge badge-warning" style="text-decoration:none;">Infrastructure</a>
  <span class="badge badge-outline">LLM</span>
  <span class="badge badge-outline">RAG</span>
  <span class="badge badge-outline">Reasoning</span>
</div>

### Recommended Learning Path
Ikuti alur bacaan ini untuk membangun fondasi pemahaman secara bertahap:
<div style="padding: 16px; background: var(--color-bg-alt); border-left: 4px solid var(--color-primary); margin-bottom: 32px;">
{% assign sorted = topic_posts | sort: "date" %}
{% for p in sorted %}
  <div style="margin-bottom: 8px;"><a href="{{ p.url | relative_url }}" style="text-decoration:none; font-weight:500;">&darr; {{ p.title }}</a></div>
{% else %}
  <div>Belum ada artikel di jalur ini.</div>
{% endfor %}
</div>

### Glossary Terms
Beberapa istilah inti yang sering muncul:
- **RAG:** Pola arsitektur untuk memberikan konteks eksternal pada LLM. [Lihat Glosarium &rarr;](/glossary/)
- **Reasoning Engine:** Sistem AI yang dirancang memecah masalah kompleks. [Lihat Glosarium &rarr;](/glossary/)
