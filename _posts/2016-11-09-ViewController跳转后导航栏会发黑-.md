title:  ViewController跳转后导航栏会发黑 
date: 2016-11-09 22:33
tags: iOS
category: 技术笔记
---

视图控制器之间跳转，在加载新视图控制器时，导航栏底色会闪一下，是黑色一闪而过。  
可以通过：  
` self.navigationController.view.backgroundColor = [UIColor whiteColor]; `  
或  
` self.navigationController.navigationBar.translucent = NO; `  
解决。

栈溢出的讨论： [ stackoverflow ](http://stackoverflow.com/questions/22413193/dark-
shadow-on-navigation-bar-during-segue-transition-after-upgrading-to-xcode-5)
<!--more-->
