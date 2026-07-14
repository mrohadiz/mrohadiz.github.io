---
layout: page
title: "Software Architecture"
description: "Catatan M. Rohadiz tentang Software Architecture: system design, microservices, event-driven architecture, architectural decision records, dan membangun sistem yang maintainable dan extensible."
permalink: /topics/software-architecture/
badge: Software Architecture
badge-class: badge-primary
---

{% assign arch_posts = site.posts | where_exp: "p", "p.categories contains 'Software Architecture' or p.tags contains 'architecture' or p.tags contains 'system-design' or p.tags contains 'microservices' or p.tags contains 'event-driven' or p.tags contains 'design-patterns'" %}

Arsitektur perangkat lunak yang baik bukan tentang memilih teknologi terbaru. Ini tentang **memahami trade-off** dan membuat keputusan yang dapat dipertanggungjawabkan. Sistem yang paling baik adalah sistem yang paling mudah dipahami oleh tim yang mengelolanya — dan yang paling mudah diubah ketika kebutuhan berubah. Saya menulis tentang keputusan arsitektural dari pengalaman nyata membangun sistem di production.

📚 **{{ arch_posts | size }} artikel** tersedia di topik ini.

## Area yang Saya Eksplorasi

- **System Design** — Merancang sistem yang scalable dan maintainable dari awal
- **Microservices** — Decomposisi layanan, service mesh, inter-service communication
- **Event-Driven Architecture** — Event sourcing, CQRS, message queues, eventual consistency
- **Design Patterns** — Creational, structural, behavioral patterns dalam konteks nyata
- **API Design** — REST, gRPC, GraphQL design principles dan trade-off
- **Architectural Decision Records** — Mendokumentasikan keputusan arsitektural dengan konteks

## Artikel Terbaru

{% for post in arch_posts limit:5 %}
- **[{{ post.title }}]({{ post.url | relative_url }})** — <small>{{ post.date | date: "%d %b %Y" }}</small>
  <br><small>{{ post.excerpt | strip_html | strip_newlines | truncatewords: 20 }}</small>
{% endfor %}
{% if arch_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

## Topik Terkait

[Infrastructure](/topics/infrastructure/) · [AI Engineering](/topics/ai-engineering/) · [Decision Systems](/topics/decision-systems/) · [Crypto Observation](/topics/crypto-observation/)

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
