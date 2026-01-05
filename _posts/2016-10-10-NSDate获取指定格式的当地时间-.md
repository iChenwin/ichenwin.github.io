title:  NSDate获取指定格式的当地时间 
date: 2016-10-10 09:14
tags: iOS
category: 技术笔记
---

  
方法 ` [NSDate date] ` 默认获得的是0时区的时间，想要得到当前的北京时间需要手动指定时区：

    
    
    NSDate *currentDate=[NSDate date];
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];       //指定输出格式
    [formatter setTimeZone:[NSTimeZone timeZoneWithName:@"Asia/Beijing"]];      //设置当地时区
<!--more-->    NSString *currentDateString = [formatter stringFromDate:currentDate];

