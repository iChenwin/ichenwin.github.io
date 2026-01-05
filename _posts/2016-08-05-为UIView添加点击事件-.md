title:  为UIView添加点击事件 
date: 2016-08-05 17:25
tags: iOS
category: 技术笔记
---

最近经常碰到要将UIImageView和UILabel看成整体的情况，我于是就将他俩用UIView包起来，那么怎么给一个UIView添加点击事件，可以这么实
现：

    
    
    //将UIView设为可交互的：
    view.userInteractionEnabled = YES;
    //添加tap手势
    UITapGestureRecognizer* singleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleSingleTap:)];
<!--more-->    //给触发事件传参
    [view setTag:i];
    //默认为单击触发，也可通过以下方法设置双击，三击...
    [handleSingleTap setNumberOfTapsRequired:1];
    //设置手指个数：
    [handleSingleTap setNumberOfTouchesRequired:1];
    //将手势添加至UIView中
    [view addGestureRecognizer:singleTap];

执行触发的方法：

    
    
    -(void)handleSingleTap:(UITapGestureRecognizer *)sender{
        //获得参数
        NSInteger index = sender.view.tag;
        //在这里写触发事件
    }

