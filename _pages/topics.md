---
layout: page
title: "Topics"
description: "Jelajahi artikel berdasarkan topik — Decision Systems, AI Engineering, Business Intelligence, Infrastructure, dan lainnya."
permalink: /topics/
badge: Topics
badge-class: badge-outline
---

Pilih topik di bawah untuk menjelajahi artikel yang relevan.

<style>
.knowledge-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-top: var(--space-8);
}
@media(min-width: 768px) {
  .knowledge-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.knowledge-node {
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-alt);
}
.knowledge-node h3 {
  margin-top: 0;
  margin-bottom: var(--space-2);
}
.knowledge-node h3 a {
  text-decoration: none;
  color: var(--color-primary);
}
.knowledge-node h3 a:hover {
  text-decoration: underline;
}
</style>

<div class="knowledge-grid">
  {% assign categories = site.posts | map: 'categories' | flatten | uniq | sort %}
  {% for category in categories %}
    <div class="knowledge-node">
      <h3><a href="/topics/{{ category | slugify }}/">{{ category }}</a></h3>
      {% assign cat_posts = site.posts | where_exp: "item", "item.categories contains category" %}
      <p style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 0;">
        <strong>{{ cat_posts | size }}</strong> artikel
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3);">
        {% assign cat_tags = cat_posts | map: 'tags' | flatten | uniq | sort %}
        {% for t in cat_tags limit: 4 %}
          <span class="badge badge-outline">{{ t }}</span>
        {% endfor %}
      </div>
    </div>
  {% endfor %}
</div>
