title:  让SVProgressHUD提示框自动消失 
date: 2016-09-13 00:05
tags: iOS
category: 技术笔记
---

[ SVProgressHUD ](https://github.com/SVProgressHUD/SVProgressHUD)
是一个第三方提示器框架。现在想实现提示框2秒后自动消失的效果，便有了以下尝试：

    
    
    // 可以自动消失的三种提示框
    [SVProgressHUD showInfoWithStatus:@"数据加载完毕！"];
    [SVProgressHUD showSuccessWithStatus:@"成功加载到4条新数据！"];
    [SVProgressHUD showErrorWithStatus:@"网络错误，请稍等！"];
<!--more-->    // 设置四周阴影
    [SVProgressHUD showWithMaskType:SVProgressHUDMaskTypeBlack];

使用上面的方法，它要过四五秒才消失。要实现2秒后自动消失的效果，有两种方法：  
第一种（SVProgressHUD版本必须2.0.4以后）：

    
    
        [SVProgressHUD showSuccessWithStatus:@"Done!"];
        [SVProgressHUD dismissWithDelay:2.0f];

第二种：

    
    
    // 延迟2秒后消失
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [SVProgressHUD dismiss];
    });

在第二种方法中用到的 ` dispatch_after ` 是一种 ` GCD ` ，关于GCD，详见 [ 唐巧博客
](http://blog.devtang.com/2012/02/22/use-gcd/) ：

    
    
        Grand Central Dispatch (GCD) 是 Apple 开发的一个多核编程的解决方法。该方法在 Mac OS X 10.6 雪豹中首次推出，并随后被引入到了 iOS4.0 中。GCD 是一个替代诸如 NSThread, NSOperationQueue, NSInvocationOperation 等技术的很高效和强大的技术。
    GCD 和 block 的配合使用，可以方便地进行多线程编程。

而 ` dispatch_after ` ：

    
    
    dispatch_after
    功能：延迟一段时间把一项任务提交到队列中执行，返回之后就不能取消
         常用来在在主队列上延迟执行一项任务
    函数原型:func dispatch_after(dispatch_time_t when,
                                dispatch_queue_t queue,
                                dispatch_block_t block);
    参数：when   过了多久执行的时间间隔  
         queue 提交到的队列  
         block   执行的任务 

