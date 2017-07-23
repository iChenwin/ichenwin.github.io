title:  NavigationBar返回按钮设置 
date: 2017-05-19 16:25
tags: iOS
category: 技术笔记
---

  1. ` NavigationBar ` 中返回按钮 ` title ` 的设置，要在父视图中完成，假设A视图（AViewController）包裹在导航视图中（NavigationVC），它通过 ` pushViewController ` 将B视图（BViewController）压入栈中，要想更改B视图的返回按钮，需在A视图中添加设置代码： 
    
    
    UIBarButtonItem *backItem = [[UIBarButtonItem alloc] initWithTitle:@"back"          style:UIBarButtonItemStylePlain target:nil action:nil];
    self.navigationItem.backBarButtonItem = backItem;

  1. 返回按钮字体样式设置，这有一种方法（ ** 注意 ** ：一旦运行了这段代码，APP中的 ** 所有导航栏 ** 返回按钮样式都随之改变。如果符合需求，可以这样用。我将它写在 ` AppDelegate.m ` 的 ` didFinishLaunchingWithOptions: ` 里） 
    
    
<!--more-->    //设置“返回”字体的阴影
    NSShadow *shadow = [[NSShadow alloc] init];
    shadow.shadowOffset = CGSizeMake(-1.0, 1.0);
    shadow.shadowColor = [UIColor blackColor];
    
    [[UIBarButtonItem appearanceWhenContainedIn:[UINavigationBar class], nil]
     setTitleTextAttributes:
     @{NSForegroundColorAttributeName:[UIColor colorWithRed:252/255.0 green:242/255.0 blue:237/255.0 alpha:1.0],
       NSShadowAttributeName:shadow,
       NSFontAttributeName:[UIFont systemFontOfSize:20.0]
       }
     forState:UIControlStateNormal];

