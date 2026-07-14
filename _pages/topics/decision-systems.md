---
layout: page
title: "Decision Systems"
description: "Kerangka observasi, analitik, dan otomatisasi pengambilan keputusan berbasis data."
permalink: /topics/decision-systems/
badge: Decision Systems
badge-class: badge-success
---

{% assign topic_posts = site.posts | where_exp: "p", "p.categories contains 'Decision Systems' or p.tags contains 'decision'" %}

**Decision Systems** memfokuskan diri pada bagaimana manusia dan mesin berkolaborasi untuk merespons informasi. 

### Why it Matters
Keputusan yang baik lahir dari observasi yang baik. Tanpa sistem yang dirancang memetakan kausalitas (*causality*), perusahaan hanya mengumpulkan tumpukan metrik tanpa wawasan (*insight*). Sistem ini mengeliminasi kebisingan (*noise*).

### Related Concepts
<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
  <a href="/topics/ai-engineering/" class="badge badge-primary" style="text-decoration:none;">AI Engineering</a>
  <a href="/topics/software-architecture/" class="badge badge-outline" style="text-decoration:none;">Software Architecture</a>
  <span class="badge badge-outline">Measurement</span>
  <span class="badge badge-outline">OODA Loop</span>
  <span class="badge badge-outline">Analytics</span>
</div>

### Recommended Learning Path
Ikuti alur bacaan ini untuk membangun fondasi pemahaman secara bertahap:
<div style="padding: 16px; background: var(--color-bg-alt); border-left: 4px solid var(--color-success); margin-bottom: 32px;">
{% assign sorted = topic_posts | sort: "date" %}
{% for p in sorted %}
  <div style="margin-bottom: 8px;"><a href="{{ p.url | relative_url }}" style="text-decoration:none; font-weight:500;">&darr; {{ p.title }}</a></div>
{% else %}
  <div>Belum ada artikel di jalur ini.</div>
{% endfor %}
</div>

### Glossary Terms
Beberapa istilah inti yang sering muncul:
- **Decision Intelligence:** Disiplin merekayasa kerangka kerja keputusan. [Lihat Glosarium &rarr;](/glossary/)
- **OODA Loop:** Observe, Orient, Decide, Act. [Lihat Glosarium &rarr;](/glossary/)
