title:  添加和移除子视图控制器（child ViewController） 
date: 2016-11-08 11:30
tags: iOS
category: 技术笔记
---


    // add child viewController
        UIViewController* controller = [self.storyboard instantiateViewControllerWithIdentifier:@"test"];
        [self addChildViewController:controller];
        controller.view.frame = CGRectMake(0, 44, 320, 320);
        [self.view addSubview:controller.view];
        [controller didMoveToParentViewController:self];
    
    // remove child viewController
<!--more-->        UIViewController *vc = [self.childViewControllers lastObject];
        [vc.view removeFromSuperview];
        [vc removeFromParentViewController];

