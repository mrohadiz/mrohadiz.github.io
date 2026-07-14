---
layout: page
title: "Software Architecture"
description: "Desain dan struktur makro sistem perangkat lunak skala besar."
permalink: /topics/software-architecture/
badge: Software Architecture
badge-class: badge-outline
---

{% assign topic_posts = site.posts | where_exp: "p", "p.categories contains 'Software Architecture' or p.tags contains 'architecture'" %}

**Software Architecture** adalah soal membuat keputusan struktural penting yang sulit atau mahal untuk diubah setelah diimplementasikan.

### Why it Matters
Arsitektur bukan hanya sekadar membuat sistem bekerja, tetapi tentang memastikan ia dapat berevolusi bersama bisnis. Pola seperti *Event-Driven* atau *Microservices* memberikan keluwesan sekaligus kompleksitas tersendiri.

### Related Concepts
<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
  <a href="/topics/infrastructure/" class="badge badge-warning" style="text-decoration:none;">Infrastructure</a>
  <a href="/topics/decision-systems/" class="badge badge-success" style="text-decoration:none;">Decision Systems</a>
  <span class="badge badge-outline">Event-Driven</span>
  <span class="badge badge-outline">Microservices</span>
  <span class="badge badge-outline">Patterns</span>
</div>

### Recommended Learning Path
Ikuti alur bacaan ini untuk membangun fondasi pemahaman secara bertahap:
<div style="padding: 16px; background: var(--color-bg-alt); border-left: 4px solid var(--color-text-secondary); margin-bottom: 32px;">
{% assign sorted = topic_posts | sort: "date" %}
{% for p in sorted %}
  <div style="margin-bottom: 8px;"><a href="{{ p.url | relative_url }}" style="text-decoration:none; font-weight:500;">&darr; {{ p.title }}</a></div>
{% else %}
  <div>Belum ada artikel di jalur ini.</div>
{% endfor %}
</div>

### Glossary Terms
Beberapa istilah inti yang sering muncul:
- **Event-Driven:** Paradigma komunikasi asinkron berbasis *event*. [Lihat Glosarium &rarr;](/glossary/)
- **Coupling & Cohesion:** Metrik keterikatan antar komponen. [Lihat Glosarium &rarr;](/glossary/)
