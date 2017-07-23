title: CSDN文章导出，Python批处理更改文件名，添加文件描述
date: 2017-06-03 10:04:08
tag: 博客
category: 博客建设
---

想把`CSDN`博客同步到拿`GitHub Page`搭的独立博客上去，找了下，发现有人用`Python`写了个工具，可以将博客导出为`Markdown`和`HTML`格式：[csdn-blog-export](https://github.com/gaocegege/csdn-blog-export)

把它搬到了百度盘，链接: [http://pan.baidu.com/s/1o8fpxGI](http://pan.baidu.com/s/1o8fpxGI) 密码: `pgbb`

用法很简单（注意：博客主题需切回“碧海蓝”，我的“极客世界”主题失效）：
`./main.py -u CSDN用户名 -f markdown`或`./main.py -u CSDN用户名 -f markdown`

<!--more-->

便能得到我们博客的所有博文。
拿到博文后，我想把它改为`Hexo`接受的格式，主要是在`.md`格式文件头添加一段文件描述，像这样：
```
title: Hello World
date: 2014-05-27 10:04:08
tag: 博客
category: 博客建设
---
```
顺便把文件名该为博文名。于是自己写了个`Python`脚本：
```python
#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os
import re
#解析博文HTML，获取博文时间、标题标签
from bs4 import BeautifulSoup
#解决中文编码问题
import codecs

mdPath = '/Users/wayne/blogposts/'
htmlPath = '/Users/wayne/blogposts/html/'
mdPosts = os.listdir(mdPath)

for postName in mdPosts:
    if postName.endswith('.md'):
        #备份工具得到的文件名像这样：21049457.md，对当前文件夹中.md文件进行操作
        #获取文件名中8位数字，存于prefix中，用于匹配和它对应的HTML文件
        #然后从HTML文件中挖出博文发布时间，保存在timeStamp中
        prefix = postName[:8]
        html = open(htmlPath + prefix + '.html', 'r')
        soup = BeautifulSoup(html)
        tag = soup.find_all('span', class_="link_postdate")
        timeStamp = tag[0].string
        print timeStamp

        #从HTML中获取博客标题，用于重命名.md文件
        title = soup.title
        temp = title.string
        pos = temp.index(" - ")
        newFileName = temp[:pos]
        print newFileName

        #弃用！
        #.md文件中第一行大致长这样：#  [ Objective-C常用宏定义 ](/ichenwin/article/details/52813659)
        #方括号中就是博文名，下面这段代码负责从.md文件第一行获取文章名
        # mdFile = codecs.open(mdPath + postName, "r", 'utf-8')
        # contents = mdFile.readlines()
        # firstLine = contents.pop(0)
        # print "firstline:" + firstLine
        # newFileName = re.compile('\[([^]]+)\]').findall(firstLine)[0]
        # mdFile.close()

        #将.md中博文读入contents，往contents插入Hexo头部
        #然后写回.md文件
        mdFile = codecs.open(mdPath + postName, "r", 'utf-8')
        contents = mdFile.readlines()
        mdFile.close()
        contents.insert(0, "---\n")
        contents.insert(0, u"category: 技术笔记\n")
        contents.insert(0, "tags: iOS\n")
        contents.insert(0, "date: " + timeStamp + "\n")
        contents.insert(0, "title: " + newFileName + "\n")

        mdFile = codecs.open(postName, "w", 'utf-8')
        newContents = "".join(contents)
        mdFile.write(newContents)
        mdFile.close()

        html.close()

        #重命名.md文件
        os.rename(os.path.join(mdPath, postName), os.path.join(mdPath, newFileName + ".md"))
```