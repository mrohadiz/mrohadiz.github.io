---
layout: page
title: "Infrastructure"
description: >-
  Catatan tentang Infrastructure dan DevOps oleh M. Rohadiz — cloud architecture,
  containerization, observability, scalability engineering, dan sistem yang reliable.
permalink: /topics/infrastructure/
badge: Infrastructure
badge-class: badge-warning
---

Kumpulan catatan dan artikel tentang **Infrastructure** — membangun sistem yang *reliable*, *observable*, dan *scalable*.

Infrastruktur yang baik adalah infrastruktur yang tidak terlihat saat berjalan normal, tapi memberikan visibilitas penuh saat ada masalah. **Observability** bukan sekadar monitoring — ini adalah kemampuan untuk memahami sistem dari outputnya.

## Area yang Saya Eksplorasi

- **Cloud Architecture** — AWS, GCP, desain arsitektur cloud-native
- **DevOps & GitOps** — CI/CD pipelines, deployment strategies, infrastructure as code
- **Containerization** — Docker, Kubernetes, container orchestration
- **Observability** — Logging, tracing, metrics, dan alerting
- **Database Engineering** — Storage systems, replication, performance tuning
- **Linux & Systems** — Kernel, storage, networking, troubleshooting
- **Scalability** — Horizontal/vertical scaling, capacity planning

## Catatan Terbaru

{% assign infra_posts = site.posts | where_exp: "post", "post.categories contains 'Infrastructure' or post.tags contains 'devops' or post.tags contains 'linux' or post.tags contains 'kubernetes' or post.tags contains 'docker' or post.tags contains 'storage'" %}
{% for post in infra_posts limit:10 %}
- [{{ post.title }}]({{ post.url | relative_url }}) — <small>{{ post.date | date: "%b %d, %Y" }}</small>
{% endfor %}
{% if infra_posts.size == 0 %}
- Catatan sedang dipersiapkan. Kunjungi [/notes/](/notes/) untuk semua artikel.
{% endif %}

---

[← Lihat Semua Catatan](/notes/){: .btn .btn-ghost}
