title:  设置NavigationBar导航栏中返回按钮(BackBarButtonItem)和BarButtonItem文字
date: 2016-10-20 17:13
tags: iOS
category: 技术笔记
---

####  1\. 后退按钮BackBarButtonItem的title设置

想要导航栏中后退按钮(带箭头，BackBarButtonItem)和BarButtonItem的文字，折腾了一会，试了几种方法都不奏效，最终找到了个解决办法
。

> 如果APP通过navigationController从A视图跳转至B视图，导航的返回按钮的加载原理是这样的：  
1、如果B视图有一个自定义的左侧按钮（leftBarButtonItem），则会显示这个自定义按钮（没有后退箭头）；  
2、如果B没有自定义按钮，但是A视图的backBarButtonItem属性有自定义项，则显示这个自定义项；  
3、如果前2条都没有，则默认显示一个后退按钮，后退按钮的标题是A视图的标题（没有标题，则显示“back”）。
<!--more-->
（摘自博客： [ iOS 修改导航栏的返回按钮的内容 ](http://www.gowhich.com/blog/167) ）

所以我的实现方法是，在A视图跳转至B视图之前修改A视图的backBarButtonItem的title：

    
    
    - (IBAction)jumpAction:(id)sender {
        SecondViewController *secondVC = [[SecondViewController alloc] initWith];
        [self setHidesBottomBarWhenPushed:YES];
        UIBarButtonItem *backBtn = [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStylePlain target:nil action:nil];
        self.navigationItem.backBarButtonItem = backBtn;
        [self.navigationController pushViewController:secondVC animated:YES];
    }

效果如图：  
![后退按钮](http://img.blog.csdn.net/20161020170954443)  
  
  

####  2\. 右侧按钮BarButtonItem的title设置

这个实现比较简单，只需往B视图中的rightBarButtonItem添加一个BarButtonItem就可以，有两种样式（系统自带或自定义）。

#####  2.1 系统自带：

    
    
    UIBarButtonItem *editBtn = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemEdit target:self action:@selector(editAction:)];
            self.navigationItem.rightBarButtonItem = editBtn;

#####  2.2 自定义：

    
    
    UIBarButtonItem *doneBtn = [[UIBarButtonItem alloc] initWithTitle:@"保存" style:UIBarButtonItemStyleDone target:self action:@selector(saveAction:)];
            self.navigationItem.rightBarButtonItem = doneBtn;

