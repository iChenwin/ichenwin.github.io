title:  改变PageControl指示点的颜色 
date: 2016-08-08 15:51
tags: iOS
category: 技术笔记
---

PageControl指示点的颜色默认是白色，此时若背景也是白色，就完全看不到PageControl控件。那么需要更改指示点的颜色：

    
    
    _pageCtrl.numberOfPages = ceil([dataArr count] / 3.0);    //设置指示点个数
    _pageCtrl.currentPage = 0;      //设置当前页指示点
    _pageCtrl.pageIndicatorTintColor = [UIColor lightGrayColor];        //设置未激活的指示点颜色
    _pageCtrl.currentPageIndicatorTintColor = [UIColor blackColor];     //设置当前页指示点颜色

<!--more-->至于PageControl的其他用法，下面是它的点击事件：

    
    
    [page addTarget:self action:@selector(mypageclick:) forControlEvents:UIControlEventValueChanged];
    
    #prag mark - 点击事件执行方法
    - (void)mypageclick:(UIPageControl*)page{
        //你的代码
    }

