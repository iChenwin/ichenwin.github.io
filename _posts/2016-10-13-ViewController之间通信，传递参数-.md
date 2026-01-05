title:  ViewController之间通信，传递参数 
date: 2016-10-13 11:38
tags: iOS
category: 技术笔记
---

从 ` FirstViewController ` 跳转到 ` SecondViewController ` ，当从 `
SecondViewController ` 返回时，如果想把数据回传给 ` FirstViewController ` ，可以用代理的方法， `
FirstViewController ` 中这样使用：

    
    
    FirstViewController.h
    @interface FirstViewController : UIViewController <SecondViewControllerDelegate>
    
<!--more-->    FirstViewController.m
    - (void)pushNextViewControl:(UIBarButtonItem *)button{
        SecondViewController * showVC = [[SecondViewController alloc]init];
        showVC.text = _textField.text;
        // 将代理对象设置成SecondViewController
        showVC.delegate = self;
        [self.navigationController pushViewController:showVC animated:YES];
        [showVC release];
    }
    
    // FirstViewController实现协议里面的方法
    - (void)showViewGiveValue:(NSString *)text{
        _inputLabel.text = text;
    }

` SecondViewController ` 需要这样设置代理：

    
    
    SecondViewController.h
    @protocol SecondViewControllerDelegate <NSObject>
    
    @optional
    - (void)showViewGiveValue:(NSString *)text;
    @end
    
    @interface SecondViewController : UIViewController
    
    @property (nonatomic,copy)NSString * text;
    // 定义一个代理
    @property (nonatomic,assign)id<SecondViewControllerDelegate> delegate;
    
    @end
    
    SecondViewController.m
    - (void)popPerView:(UIBarButtonItem *)barButton{
        // 在页面跳转前将参数传出去
        if ([self.delegate respondsToSelector:@selector(showViewGiveValue:)]) {
            [self.delegate showViewGiveValue:_showTextField.text];
        }
        [self.navigationController popViewControllerAnimated:YES];
    
    }

