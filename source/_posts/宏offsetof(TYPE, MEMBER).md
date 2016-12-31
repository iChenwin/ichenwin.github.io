title: 宏offsetof(TYPE, MEMBER)解释
date: 2016-1-9 10:42:25
tags: C/C++
category: 技术笔记
---
最近看代码，看到一处宏，
```#define offsetof(TYPE, MEMBER) ((size_t) &((TYPE *)0)->MEMBER)```
一眼没看出原理，搜索一番，再仔细分析才看懂，
该宏的作用就是求出`MEMBER`在`TYPE`中的偏移量。也就是成员变量`MEMBER`的入口地址
先分析一下这个宏的运行机理，一共4步：
1. ```((TYPE *)0)``` 将零转型为TYPE类型指针; 
2. ```((TYPE *)0)->MEMBER``` 访问结构中的数据成员; 
3. ```&(((TYPE *)0)->MEMBER)```取出数据成员的地址; 这个实现相当于获取到了 MEMBER 成员相对于其所在结构体的偏移，也就是其在对应结构体中的什么位置。
4. ```(size_t)(&(((TYPE*)0)->MEMBER))```结果转换类型。巧妙之处在于将0转 换成```(TYPE*)```，结构以内存空间首地址0作为起始地址，则成员地址自然为偏移地址；
`&`操作如果是对一个表达式，而不是一个标识符，会取消操作，而不是添加。
比如`&*a`，会直接把a的地址求出来，不会访问`*a`。
`&a->member`，会把访问`a->member`的操作取消，只会计算出`a->member`的地址

<!--more-->
转自[宏offsetof(TYPE, MEMBER)解释](http://blog.sina.com.cn/s/blog_4c2e13ff0102uznz.html)