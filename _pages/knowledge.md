---
layout: page
title: Knowledge Map
description: "Peta struktur pengetahuan dari seluruh artikel dan observasi."
permalink: /knowledge/
---

Peta ini memvisualisasikan arsitektur pengetahuan situs ini. Anda tidak lagi sekadar menelusuri artikel secara kronologis, melainkan menjelajahi keterkaitan antar konsep (*node*). Pilih domain di bawah ini untuk memulai.

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

## Domain Pengetahuan

<div class="knowledge-grid">
  {% assign categories = site.posts | map: 'categories' | flatten | uniq | sort %}
  {% for category in categories %}
    <div class="knowledge-node">
      <h3><a href="/topics/{{ category | slugify }}/">{{ category }}</a></h3>
      {% assign cat_posts = site.posts | where_exp: "item", "item.categories contains category" %}
      
      <p style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: var(--space-4);">
        <strong>{{ cat_posts | size }}</strong> observasi terekam dalam node ini.
      </p>
      
      <h5 style="margin-bottom: var(--space-2); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; color: var(--color-text-secondary);">Start Here (Pillar Articles)</h5>
      <ul style="list-style: none; padding: 0; margin-bottom: var(--space-4);">
        {% assign count = 0 %}
        {% for post in cat_posts %}
          {% if post.tags contains 'pillar' or post.title contains category or count < 2 %}
            <li><a href="{{ post.url | relative_url }}" style="font-size: 0.95rem; font-weight: 500; color: var(--color-text-primary); text-decoration: none;">&rarr; {{ post.title }}</a></li>
            {% assign count = count | plus: 1 %}
          {% endif %}
        {% endfor %}
      </ul>
      
      <h5 style="margin-bottom: var(--space-2); text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; color: var(--color-text-secondary);">Key Concepts</h5>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
        {% assign cat_tags = cat_posts | map: 'tags' | flatten | uniq | sort %}
        {% for t in cat_tags limit: 5 %}
          <span class="badge badge-outline">{{ t }}</span>
        {% endfor %}
        {% if cat_tags.size > 5 %}
          <span class="badge badge-outline">...</span>
        {% endif %}
      </div>
    </div>
  {% endfor %}
</div>

<div style="text-align: center; margin-top: var(--space-10);">
  <p style="margin-bottom: var(--space-4);">Ingin melihat daftar definisi dari konsep-konsep di atas?</p>
  <a href="/glossary/" class="btn btn-primary">Lihat Glosarium Lengkap</a>
</div>
