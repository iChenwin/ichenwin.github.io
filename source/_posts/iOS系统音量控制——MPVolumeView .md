title:  iOS系统音量控制——MPVolumeView 
date: 2017-05-15 17:39
tags: iOS
category: 技术笔记
---

iOS的音量控制接口在 ` MediaPlayer ` 库中，  
1\. 首先要将该库导入：  
![MediaPlayer](http://img.blog.csdn.net/20170515172210316?watermark/2/text/aHR
0cDovL2Jsb2cuY3Nkbi5uZXQvaWNoZW53aW4=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFC
MA==/dissolve/70/gravity/SouthEast)  
2\. 然后在用到的地方引入 ` MPVolumeView ` 的头文件：  
` #import <MediaPlayer/MPVolumeView.h> `  
3\. 而 ` MPVolumeView ` 中负责控制音量的是它的子视图 ` MPVolumeSlider `
，而这个类并未对外公开，所以要去控制它，需要遍历 ` volumeView ` 的子视图，把它找出来，并赋值：
<!--more-->
    
    
    MPVolumeView *volumeView   = [{MPVolumeView alloc] init];
    UISlider *volumeViewSlider = nil;
    for (UIView *view in [volumeView subviews]) {
        if ([view.class.description isEqualToString:@"MPVolumeSlider"]) {
            volumeViewSlider = (UISlider *)view;
            break;
        }
    }
    
    // change system volume, the value is between 0.0f and 1.0f
    [volumeViewSlider setValue:0.3f animated:NO];
    
    // send UI control event to make the change effect right now. 立即生效
    [volumeViewSlider sendActionsForControlEvents:UIControlEventTouchUpInside];

然后就可以通过控制 ` volumeViewSlider ` 去控制系统音量了。  
这种情况下，调节音量时会显示系统音量提示框，若要关掉，需将 ` volumeView ` 添加至当前视图，如不需要 ` volumeView `
，可以将它设置到视图外，隐藏掉它：

    
    
    [volumeView setFrame:CGRectMake(-1000, -100, 100, 100)];
    [self.view addSubview:volumeView];

demo地址： [ VolumePanel ](https://github.com/iChenwin/Objective-
C_Programming/tree/master/challenges/VolumePanel) (未隐藏 ` volumeView ` )

