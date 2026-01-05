title:  Objective-C中使用extern引用外部全局变量(如：创建全局可变字符串)
date: 2017-02-03 22:13
tags: iOS
category: 技术笔记
---

使用 ` extern ` 可以创建外部文件可以访问的全局变量。这样我们可以让多个类操控同一变量。通过它可以实现全局可变字符串。 ` extern `
的使用方法：  
1\. 在需要初始化该变量的文件(如:func.m)中，定义变量

    
    
    NSMutableString *globalString;

(注：需定义在 ` @interface ` 和 ` @implementation ` 之外)  
<!--more-->2\. 在需要用到这一变量的另一文件中使用语句：

    
    
    extern NSMutableString *globalString;

声明变量，以表明它已在其他文件中定义。

