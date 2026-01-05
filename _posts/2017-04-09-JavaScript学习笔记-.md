title:  JavaScript学习笔记 
date: 2017-04-09 15:51
tags: JavaScript
category: 技术笔记
---

  
引自廖雪峰老师的教程： [ JavaScript教程 ](http://www.liaoxuefeng.com/wiki/001434446689867b2
7157e896e74d51a89c25cc8b43bdb3000)

####  1\. 基本语法

#####  (1).JavaScript代码

通常放在 ` <head> ` 标签中，可以直接放在 ` <script> ` 标签里：
<!--more-->
    
    
    <html>
    <head>
        <script>
            alert('Hello, world');
        </script>
    </head>
    <body>
      ...
    </body>
    </html>

或者把JavaScript代码单独放在 ` .js ` 文件，然后HTML引用：

    
    
    <html>
    <head>
        <script src="/static/js/abc.js"></script>
    </head>
    <body>
      ...
    </body>
    </html>

####  2.数据类型

#####  (1).JavaScript不区分整型和浮点型，统一用Number表示。

    
    
    123; // 整数123
    0.456; // 浮点数0.456
    1.2345e3; // 科学计数法表示1.2345x1000，等同于1234.5
    -99; // 负数
    NaN; // NaN表示Not a Number，当无法计算结果时用NaN表示
    Infinity; // Infinity表示无限大，当数值超过了JavaScript的Number所能表示的最大值时，就表示为Infinity

#####  (2).比较运算符

相等运算符==。JavaScript在设计时，有两种比较运算符：

> 第一种是 ` == ` 比较，它会自动转换数据类型再比较，很多时候，会得到非常诡异的结果；  
第二种是 ` === ` 比较，它不会自动转换数据类型，如果数据类型不一致，返回false，如果一致，再比较。

由于JavaScript这个设计缺陷， _ 不要  _ 使用 ` == ` 比较，始终坚持使用 ` === ` 比较。

另一个例外是NaN这个特殊的Number与所有其他值都不相等，包括它自己：

    
    
    NaN === NaN; // false

唯一能判断NaN的方法是通过isNaN()函数：

    
    
    isNaN(NaN); // true

最后要注意浮点数的相等比较：

    
    
    1 / 3 === (1 - 2 / 3); // false

这不是JavaScript的设计缺陷。浮点数在运算过程中会产生误差，因为计算机无法精确表示无限循环小数。要比较两个浮点数是否相等，只能计算它们之差的绝对值，
看是否小于某个阈值：

    
    
    Math.abs(1 / 3 - (1 - 2 / 3)) < 0.0000001; // true

#####  (3).对象

JavaScript的对象是一组由键-值组成的无序集合，例如：

    
    
    var person = {
        name: 'Bob',
        age: 20,
        tags: ['js', 'web', 'mobile'],
        city: 'Beijing',
        hasCar: true,
        zipcode: null
    };

JavaScript对象的键都是字符串类型，值可以是任意数据类型。上述person对象一共定义了6个键值对，其中每个键又称为对象的属性，例如，person的
name属性为’Bob’，zipcode属性为null。  
要获取一个对象的属性，我们用对象变量.属性名的方式：

    
    
    person.name; // 'Bob'
    person.zipcode; // null

#####  (4).数组

数组是一组按顺序排列的集合，集合的每个值称为元素。JavaScript的数组可以包括任意数据类型。例如：

    
    
    [1, 2, 3.14, 'Hello', null, true];

上述数组包含6个元素。数组用[]表示，元素之间用,分隔。  
另一种创建数组的方法是通过Array()函数实现：

    
    
    new Array(1, 2, 3); // 创建了数组[1, 2, 3]

然而，出于代码的可读性考虑，强烈建议直接使用[]。

####  3.变量

#####  (1).变量赋值

可以把任意数据类型赋值给变量，同一个变量可以反复赋值，而且可以是不同类型的变量，但是要注意只能用var申明一次，例如：

    
    
    var a = 123; // a的值是整数123
    a = 'ABC'; // a变为字符串

这种变量本身类型不固定的语言称之为动态语言，与之对应的是静态语言。静态语言在定义变量时必须指定变量类型，如果赋值的时候类型不匹配，就会报错。

#####  (2).strict模式

JavaScript在设计之初，为了方便初学者学习，并不强制要求用var申明变量。这个设计错误带来了严重的后果：如果一个变量没有通过var申明就被使用，那么
该变量就自动被申明为全局变量：

    
    
    i = 10; // i现在是全局变量

在同一个页面的不同的JavaScript文件中，如果都不用var申明，恰好都使用了变量i，将造成变量i互相影响，产生难以调试的错误结果。  
使用var申明的变量则不是全局变量，它的范围被限制在该变量被申明的函数体内，同名变量在不同的函数体内互不冲突。  
启用strict模式的方法是在JavaScript代码的第一行写上：

    
    
    'use strict';

