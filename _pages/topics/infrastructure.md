---
layout: page
title: "Infrastructure"
description: "Catatan M. Rohadiz tentang Infrastructure dan DevOps: cloud architecture, containerization, observability, storage engineering, dan membangun sistem yang reliable, scalable, dan mudah didiagnosis."
permalink: /topics/infrastructure/
badge: Infrastructure
badge-class: badge-warning
---

{% assign infra_posts = site.posts | where_exp: "p", "p.categories contains 'Infrastructure' or p.tags contains 'devops' or p.tags contains 'linux' or p.tags contains 'kubernetes' or p.tags contains 'docker' or p.tags contains 'storage' or p.tags contains 'sata' or p.tags contains 'ssd'" %}

Infrastruktur yang baik adalah infrastruktur yang tidak terlihat saat berjalan normal, tapi memberikan **visibilitas penuh** saat ada masalah. **Observability** bukan sekadar monitoring — ini adalah kemampuan untuk memahami sistem dari outputnya, mendiagnosis masalah tanpa perlu menebak-nebak. Saya menulis tentang pengalaman nyata membangun, mengelola, dan memperbaiki sistem infrastructure.

📚 **{{ infra_posts | size }} artikel** tersedia di topik ini.

## Area yang Saya Eksplorasi

- **Cloud Architecture** — AWS, GCP, dan desain arsitektur cloud-native
- **DevOps & GitOps** — CI/CD pipelines, deployment strategies, Infrastructure as Code
- **Containerization** — Docker, Kubernetes, dan container orchestration
- **Observability** — Logging, tracing, metrics, dan alerting
- **Storage & Database** — Disk health, SMART data, replication, performance tuning
- **Linux Systems** — Kernel, networking, security hardening, troubleshooting

## Artikel Terbaru

{% for post in infra_posts limit:5 %}
- **[{{ post.title }}]({{ post.url | relative_url }})** — <small>{{ post.date | date: "%d %b %Y" }}</small>
  <br><small>{{ post.excerpt | strip_html | strip_newlines | truncatewords: 20 }}</small>
{% endfor %}
{% if infra_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

## Topik Terkait

[Software Architecture](/topics/software-architecture/) · [AI Engineering](/topics/ai-engineering/) · [Decision Systems](/topics/decision-systems/) · [Crypto Observation](/topics/crypto-observation/)

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
