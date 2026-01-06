---
layout: page
icon: fas fa-info-circle
order: 4
title: About  # 这里可以保持英文，或者用 Liquid 动态标题（如果主题支持）
---

{% if page.url contains '/en/' %}
  ## About Me
  Hi, I'm Wayne, a Multi-media developer.
{% else %}
  ## 关于我
  你好，我是 Wayne，一名多媒体开发。
{% endif %}
