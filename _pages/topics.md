---
layout: page
title: "Topics"
description: "Jelajahi artikel berdasarkan topik — Decision Systems, AI Engineering, Business Intelligence, Infrastructure, dan lainnya."
permalink: /topics/
badge: Topics
badge-class: badge-outline
---

Pilih topik di bawah untuk menjelajahi artikel yang relevan.

{% assign categories = site.posts | map: 'categories' | flatten | uniq | sort %}

<div class="topics-grid">
  {% for category in categories %}
    {% assign cat_posts = site.posts | where_exp: "item", "item.categories contains category" %}
    {% if cat_posts.size >= 5 %}
      <div class="topic-card">
        <h3 class="topic-card-title"><a href="/topics/{{ category | slugify }}/">{{ category }}</a></h3>
        <p class="topic-card-count"><strong>{{ cat_posts.size }}</strong> artikel</p>
        <div class="topic-card-tags">
          {% assign cat_tags = cat_posts | map: 'tags' | flatten | uniq | sort %}
          {% for t in cat_tags limit: 4 %}
            <span class="badge badge-outline">{{ t }}</span>
          {% endfor %}
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>
