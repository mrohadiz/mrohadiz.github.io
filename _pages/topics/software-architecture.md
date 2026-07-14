---
layout: page
title: "Software Architecture"
description: >-
  Catatan tentang Software Architecture oleh M. Rohadiz — system design, microservices,
  event-driven architecture, design patterns, dan architectural decision making.
permalink: /topics/software-architecture/
badge: Software Architecture
badge-class: badge-primary
---

Kumpulan catatan dan artikel tentang **Software Architecture** — bagaimana merancang sistem yang dapat bertahan dan berkembang seiring waktu.

Arsitektur perangkat lunak yang baik bukan tentang memilih teknologi terbaru. Ini tentang memahami trade-off dan membuat keputusan yang dapat dipertanggungjawabkan. Sistem yang paling baik adalah sistem yang paling *mudah dipahami* oleh tim yang mengelolanya.

## Area yang Saya Eksplorasi

- **System Design** — Merancang sistem yang scalable dan maintainable
- **Microservices** — Decomposisi layanan, service mesh, inter-service communication
- **Event-Driven Architecture** — Event sourcing, CQRS, message queues
- **Design Patterns** — Creational, structural, behavioral patterns dalam konteks nyata
- **API Design** — REST, gRPC, GraphQL design principles
- **Domain-Driven Design** — Bounded contexts, aggregates, ubiquitous language
- **Architectural Decision Records** — Mendokumentasikan keputusan arsitektural

## Catatan Terbaru

{% assign arch_posts = site.posts | where_exp: "post", "post.categories contains 'Software Architecture' or post.tags contains 'architecture' or post.tags contains 'system-design' or post.tags contains 'microservices' or post.tags contains 'event-driven'" %}
{% for post in arch_posts limit:10 %}
- [{{ post.title }}]({{ post.url | relative_url }}) — <small>{{ post.date | date: "%b %d, %Y" }}</small>
{% endfor %}
{% if arch_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
