title: Effective Objective-C 2.0  编写高质量iOS与OS X代码的52个有效方法
date: 2017-01-11 08:34:08
tags: [Objective-C, iOS, 技术笔记]
---
#### 一、熟悉Objective-C

1.使用消息结构的语言，其运行时执行的代码由运行环境决定，而函数调用型语言，由编译器决定。消息机制的这种方式，叫“动态绑定”（dynamic binding）。对象创建在堆(heap)上，而不是栈(stack)
2.在类的头文件中尽量少引用其他头文件。
　　a.如果可以，优先使用向前声明forward declaration `@class xxxx`代替  
　　b.`@class xxxx`还能避免两个类相互引用的问题——“循环引用 chicken-and-egg situation”，虽然`#import xxxx`不会像`#include xxxx`那样导致死循环，但它会导致一个类无法正确编译。 
　　c.有时无法使用向前声明，比如声明某个类遵循一项协议，这种情况，尽量把“协议”的这条声明移至“class-continuation category"中。如果不行，把协议单独放在一个头文件中，然后引入。

<!--more-->

#### 二、对象，消息，运行时