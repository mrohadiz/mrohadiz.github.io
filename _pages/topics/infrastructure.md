---
layout: page
title: "Infrastructure"
description: "Arsitektur cloud, server, dan infrastruktur foundational untuk aplikasi modern."
permalink: /topics/infrastructure/
badge: Infrastructure
badge-class: badge-warning
---

{% assign topic_posts = site.posts | where_exp: "p", "p.categories contains 'Infrastructure' or p.tags contains 'infrastructure'" %}

**Infrastructure** membahas pondasi keras yang menopang logika perangkat lunak. 

### Why it Matters
Kode terbaik tidak akan bertahan tanpa fondasi yang bisa mengukur (*scale*) dan memulihkan diri (*heal*). Infrastruktur modern mengubah *ops* menjadi kode (*Infrastructure as Code*) sehingga deployment dapat direplikasi dan diotomatisasi secara pasti.

### Related Concepts
<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
  <a href="/topics/software-architecture/" class="badge badge-outline" style="text-decoration:none;">Software Architecture</a>
  <span class="badge badge-outline">Terraform</span>
  <span class="badge badge-outline">Linux</span>
  <span class="badge badge-outline">Observability</span>
</div>

### Recommended Learning Path
Ikuti alur bacaan ini untuk membangun fondasi pemahaman secara bertahap:
<div style="padding: 16px; background: var(--color-bg-alt); border-left: 4px solid var(--color-warning); margin-bottom: 32px;">
{% assign sorted = topic_posts | sort: "date" %}
{% for p in sorted %}
  <div style="margin-bottom: 8px;"><a href="{{ p.url | relative_url }}" style="text-decoration:none; font-weight:500;">&darr; {{ p.title }}</a></div>
{% else %}
  <div>Belum ada artikel di jalur ini.</div>
{% endfor %}
</div>

### Glossary Terms
Beberapa istilah inti yang sering muncul:
- **IaC (Infrastructure as Code):** Pendekatan mengelola infrastruktur via script. [Lihat Glosarium &rarr;](/glossary/)
- **Observability:** Kemampuan memantau status internal sistem. [Lihat Glosarium &rarr;](/glossary/)
