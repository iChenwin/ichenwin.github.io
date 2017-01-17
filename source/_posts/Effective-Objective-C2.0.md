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
3.多用字面量语法，  少用与之等价的方法。 使用字面量创建字符串、数组、字典，可以缩短源代码长度，使其更加简明扼要。通过取下标访问数组或字典元素。字面量中含有`nil`会抛出异常，更加安全。
　　a.字面数值(NSNumber)
　　　原本需要使用`NSNumber *someNumber = [NSNumber numberWithInt:1];`, 而使用字面量只需：
　　　`NSNumber *intNumber = @1;`
　　　`NSNumber *floatNumber = @2.5f;`
　　　`NSNumber *boolNumber = YES;`
　　　`NSNumber *charNumber = @'a';`
　　　`int x = 5; float y = 5.12f; NSNumber *number = @{x * y};`
　　b.字面量数组(NSArray)
　　　原本需要使用`NSArray *animal = [NSArray arrayWithObjects:@"cat", @"dog", @"mouse", @"badger", nil];`, 而使用字面量只需：
　　　`NSArray *animal = @[@"cat", @"dog", @"mouse", @"badger"]`;
　　　如果数组元素中有`nil`，使用字面量会抛出异常：
　　　`id object1 = /* ... */;`
　　　`id object2 = nil;`
　　　`id object3 = /* ... */;`
　　　`NSArray arrayA = [NSArray arrayWithObjects:object1, object2, object3, nil];`
　　　`NSArray arrayB = @[object1, object2, object3];`
　　　那么`arrayA`会得到一个仅含`object1`的数组，因为方法`arrayWithObjects`会在第一个`nil`处终止。
　　　而`arrayB`会抛出异常，所以使用字面量更加安全，可以更快发现错误。
　　c.字面量字典(NSDictionary)
　　　一般的创建方法:`NSDictionary *personData = [NSDictionary dictionaryWithObjectsAndKeys:@"Matt", @"firstName", @"Galloway", @"lastName", [NSNumber numberWithInt:28], @"age", nil];`
　　　其顺序是<对象>,<键>，这与通常的顺序相反，我们一般认为是把“键”映射到“对象”，所以此方法不容易读懂。使用字面量就清晰多了：
　　　`NSDictionary *personData = @{@"firstName" : @"Matt", @"lastName" : @"Galloway", @"age" : @28};`
　　　此写法还说明了一点:字典对象和键必须是Objective-C对象，所以不能直接将数字28放入，必须封装在NSNumber实例才行，而是用字面量又很容易做到，只需在数字前加`@`
　　　与数组一样，当碰到有`nil`的情况，也会抛出异常。
　　d.局限：字符串、数组、字典的自定义子类必须采用“非字面量语法”；字面量创建出的对象是不可变的，若要可变，需要复制一份：`NSMutableArray *mutable = [@[@1, @2, @3, @4, @5] mutableCopy];`
4.多用类型常量(const)，少用#define预处理命令
　　a.宏定义#define定义的常量不包含数据类型信息，编译器只是做了简单的查找和替换。并且若用#define重复定义了某个常量，编译器也不会发出警告，这使得程序中的这一常量值不一致。
　　b.实现文件`.m`用`static const`定义“只在编译单元内可见的常量”。由于此类常量不在全局变量表中，所以无须为其名称添加前缀。
　　c.头文件`.h`中使用`extern`来声明全局常量，并在与之对应的实现文件中定义常量的值。这种常量出现在全局常量表中，所以通常用与之相关的类名做前缀用于区分。
5.用枚举表示状态、选项、状态码
　　
#### 二、对象，消息，运行时