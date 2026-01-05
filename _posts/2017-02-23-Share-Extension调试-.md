title:  Share Extension调试 
date: 2017-02-23 20:59
tags: iOS
category: 技术笔记
---

  
最近添加原生扩展功能，如图：  
![这里写图片描述](http://img.blog.csdn.net/20170223205310963?watermark/2/text/aHR0cDo
vL2Jsb2cuY3Nkbi5uZXQvaWNoZW53aW4=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==
/dissolve/70/gravity/SouthEast)

而在当前Xcode8.2.1中，扩展的NSlog无法显示在Xcode中，最后从Stackoverflow得知，可以打开Mac的 ` console.app
` 查看在手机上的打印。

<!--more-->另：

    
    
    - (void)didSelectPost {
    }

中必须以 ` [self.extensionContext completeRequestReturningItems:@[]
completionHandler:nil]; ` 结束。

