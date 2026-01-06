---
layout: page
title: Archives
permalink: /en/archives/
---

{% assign en_posts = site.posts | where: "lang", "en" %}

<div id="archives" class="pl-xl-3">
  {% for post in en_posts %}
    {% capture cur_year %}{{ post.date | date: "%Y" }}{% endcapture %}
    {% if cur_year != last_year %}
      <time class="year d-block mb-3 mt-4 fw-bold">{{ cur_year }}</time>
      {% assign last_year = cur_year %}
    {% endif %}

    <div class="d-flex justify-content-between mb-2">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span class="text-muted small">{{ post.date | date: "%m-%d" }}</span>
    </div>
  {% endfor %}
</div>
