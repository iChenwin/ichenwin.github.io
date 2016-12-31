title: HTML简介
date: 2015-10-4 22:40:25
tags: HTML
category: 技术笔记

---
##### HTML简介
HTML 是一种标记语言（markup language）。它告诉浏览器如何显示内容。HTML把内容（文字，图片，语言，影片等等）和「presentation」（这个内容是如何显示，比如文字用什么颜色显示等等）分开。HTML使用预先定义的元素集合来识别内容形态。 元素包含一个以上的标记来包含或者表达内容。标记利用尖括号表示，而结束标记（用来指示内容尾端）则在前面加上斜线。
举例来说，段落元素包含起始标记`“<p>”`和结束标记`“</p>”`。下面的例子展示一个包含HTML段落元素的段落
```html
<p>My dog ate all the guacamole.</p>
```
<!--more-->
##### `<abbr>`标签
`<abbr>` 标签指示简称或缩写，比如 "WWW" 或 "NATO"，当鼠标移至该缩写是可以显示其全称。
栗子：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>A tiny document</title>
</head>
<body>
    <h1>Main heading in my document</h1>
    <p>Look Ma,I am coding <abbr title="Hyper Text Markup Language">HTML</abbr>.</p>
</body>
</html>
```
效果：
![abbr](http://7i7io5.com1.z0.glb.clouddn.com/abbr.png)