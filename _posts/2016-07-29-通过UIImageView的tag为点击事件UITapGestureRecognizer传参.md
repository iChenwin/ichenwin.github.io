title:  通过UIImageView的tag为点击事件UITapGestureRecognizer传参
date: 2016-07-29 16:23
tags: iOS
category: 技术笔记
---

为了点击图片时，知道哪张图片被点击，需要向 ` UITapGestureRecognizer ` 传递一个参数，此处使用了 ` UIImageView `
的 ` tag ` 属性，直接将图片索引写入 ` imageview ` 的 ` tag ` ，然后通过 ` sender.view.tag `
去获取图片索引。

    
    
    UIImageView *imageview = [[UIImageView alloc] initWithImage: [UIImage imageNamed:@"tab-me-plese.png"]];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(processTap:)];
    
<!--more-->    [imageview setTag:i]; //set tag value
    [imageview addGestureRecognizer:tap];
    [imageview setUserInteractionEnabled:YES];
    
    - (void)processTap:(UIGestureRecognizer *)sender
    {
        NSLog(@"点击了第%ld张图片", sender.view.tag);    
    }

