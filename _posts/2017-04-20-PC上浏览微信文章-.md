title:  PC上浏览微信文章 
date: 2017-04-20 07:53
tags: Web
category: 技术笔记
---

电脑上有时会有打不开微信文章的问题，提示“请在微信客户端打开链接。”。  
在chrome中，F12打开调试窗口，切换至手机版，新添加一手机模拟器，在 ` User Agent String ` 框里面填写以下信息 ：

    
    
    "Mozilla/5.0 (linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255"

<!--more-->