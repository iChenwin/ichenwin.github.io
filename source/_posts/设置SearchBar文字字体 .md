title:  设置SearchBar文字字体 
date: 2016-08-03 16:25
tags: iOS
category: 技术笔记
---

` SearchBar ` 内虽然含有一个 ` UITextField ` ，但是并没有可以直接访问的属性，要想更改 ` TextField `
的字体，可以用以下间接的方法实现：

    
    
    [[UITextField appearanceWhenContainedIn:[UISearchBar class], nil] setDefaultTextAttributes:@{
                NSFontAttributeName: [UIFont fontWithName:@"Helvetica" size:20],
          }];

<!--more-->[ StackOverFlow上的讨论 ](http://stackoverflow.com/questions/4697689/change-the-
font-size-of-uisearchbar)

