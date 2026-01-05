title:  Objective-C常用宏定义 
date: 2016-10-14 10:25
tags: iOS
category: 技术笔记
---

看到 [ LvesLi’s Blogging ](http://lvesli.com/2016/06/03/About-Me/)
分享的一些Objective-C常用宏定义，非常好用，记录于此：

    
    
    //1. 打印日志
    #ifdef DEBUG
    #    define DLog(...) NSLog(__VA_ARGS__)
    #else
<!--more-->    #    define DLog(...)
    #endif
    
    //2. 获取屏幕 宽度、高度
    #define kScreenWidth ([UIScreen mainScreen].bounds.size.width)
    #define kScreenHeight ([UIScreen mainScreen].bounds.size.height)
    
    //3. 颜色
    #define RGB(r, g, b, a)  [UIColor colorWithRed:r/255.0f green:g/255.0f blue:b/255.0f alpha:a]
    #define HEXCOLOR(c)       [UIColor colorWithRed:((c>>16)&0xFF)/255.0f green:((c>>8)&0xFF)/255.0f blue:(c&0xFF)/255.0f alpha:1.0f]
    //背景色  
    #define BACKGROUND_COLOR [UIColor colorWithRed:242.0/255.0 green:236.0/255.0 blue:231.0/255.0 alpha:1.0]  
    //清除背景色  
    #define CLEARCOLOR [UIColor clearColor] 
    
    //4.加载图片宏：
    #define LOADIMAGE(file,type) [UIImage imageWithContentsOfFile:[[NSBundle mainBundle]pathForResource:file ofType:type]]
    //5. NavBar高度
    #define NavigationBar_HEIGHT 44
    //6. 获取系统版本
    #define IOS_VERSION [[[UIDevice currentDevice] systemVersion] floatValue]
    #define CurrentSystemVersion [[UIDevice currentDevice] systemVersion]
    
    //7. 判断是真机还是模拟器
    #if TARGET_OS_IPHONE
        //iPhone Device
    #endif
    
    #if TARGET_IPHONE_SIMULATOR
       //iPhone Simulator
    #endif
    
    //8. 设置View的tag属性
    #define VIEWWITHTAG(_OBJECT, _TAG)    [_OBJECT viewWithTag : _TAG]
    
    //9. GCD
    #define BACK(block) dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), block)
    #define MAIN(block) dispatch_async(dispatch_get_main_queue(),block)
    
    //10. NSUserDefaults 实例化
    #define USER_DEFAULT [NSUserDefaults standardUserDefaults]

博文原地址： [ Objective-C 预处理器(The Preprocessor)
](http://lvesli.com/2016/05/24/Objective-C-The-Preprocessor/)

