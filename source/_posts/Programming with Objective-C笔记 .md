title:  Programming with Objective-C笔记 
date: 2016-12-24 22:23
tags: iOS
category: 技术笔记
---

####  一、前言

  1. 对象，app是许多种对象构成的。An App Is Built from a Network of Objects 
  2. 类别，用于扩展一个现有类，也可用于隐藏私有方法。Categories Extend Existing Classes 
  3. 协议，定义了类之间的消息机制，delegate。Protocols Define Messaging Contracts 
  4. 值和数组常用Objective-C对象表示，如：NSString用于表示字符串，NSNumber表示各种数字，NSValue用来表示C语言中的结构。而常用数组有：NSArray、 NSSet、 和 NSDictionary。Values and Collections Are Often Represented as Objective-C Objects 
  5. 代码块用于简化日常操作，比如：数组的枚举，查找，校验（collection enumeration, sorting and testing）。它类似于其他语言的“闭包”，也可用于一些同步和异步操作（如：Grand Central Dispatch (GCD)技术）。Blocks Simplify Common Tasks 
  6. ` NSError ` 可以捕获运行时错误，如：存储空间不足、无法连接网络等。Error Objects Are Used for Runtime Problems 

<!--more-->