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
<div class="concepts-container">
  <a href="/topics/ai-engineering/" class="badge badge-primary">AI Engineering</a>
  <a href="/topics/software-architecture/" class="badge badge-outline">Software Architecture</a>
  <span class="badge badge-outline">Measurement</span>
  <span class="badge badge-outline">OODA Loop</span>
  <span class="badge badge-outline">Analytics</span>
</div>

### Series
Artikel yang tergabung dalam satu alur pembahasan:
{% assign series_posts = topic_posts | where_exp: "p", "p.series" %}
{% assign all_series = series_posts | map: "series" | uniq | sort %}
<div class="series-container">
{% for s in all_series %}
  {% assign group = series_posts | where: "series", s | sort: "date" %}
  <div class="series-group">
    <h4 class="series-title">{{ s | replace: "-", " " }}</h4>
    {% for p in group %}
      <a href="{{ p.url | relative_url }}" class="series-link">{{ p.title }}</a>
    {% endfor %}
  </div>
{% else %}
  <p class="series-empty">Belum ada series di node ini.</p>
{% endfor %}
</div>

### Recommended Learning Path
Ikuti alur bacaan ini untuk membangun fondasi pemahaman secara bertahap:
<div class="learning-path-container success">
{% assign sorted = topic_posts | sort: "date" %}
{% for p in sorted %}
  <div class="learning-path-item"><a href="{{ p.url | relative_url }}" class="learning-path-link">{{ p.title }}</a></div>
{% else %}
  <div>Belum ada artikel di jalur ini.</div>
{% endfor %}
</div>

### Glossary Terms
Beberapa istilah inti yang sering muncul:
- **Decision Intelligence:** Disiplin merekayasa kerangka kerja keputusan. [Lihat Glosarium &rarr;](/glossary/)
- **OODA Loop:** Observe, Orient, Decide, Act. [Lihat Glosarium &rarr;](/glossary/)
