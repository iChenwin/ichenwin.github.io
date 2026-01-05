title:  NSTableView的背景色设置 
date: 2016-09-08 13:24
tags: iOS
category: 技术笔记
---

在设置 ` NSTableView ` 背景色时，发现它其实包含三层 ` view ` ： ` NSScrollView ` 、 ` NSClipView
` 、 ` NSTableView ` 。  
![这里写图片描述](http://img.blog.csdn.net/20160908131606529)  
与之对应的视图：  
![这里写图片描述](http://img.blog.csdn.net/20160908131852329)  
所以想要设置 ` NSTableView ` 为透明的话，除了  
` [tableView setBackgroundColor:[NSColor clearColor]]; `  
以外，还需要设置  
` [tableView enclosingScrollView] setDrawsBackground:NO]; `  
<!--more-->让围绕它的 ` ScrollView ` 不要填涂背景色。  
这样才真正做到 ` TableView ` 的透明  
![这里写图片描述](http://img.blog.csdn.net/20160908132312398)

