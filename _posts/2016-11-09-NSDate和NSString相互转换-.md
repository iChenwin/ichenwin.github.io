title:  NSDate和NSString相互转换 
date: 2016-11-09 23:09
tags: iOS
category: 技术笔记
---

  
NSDate到NSString的转换：

    
    
    //获取系统当前时间
    NSDate *currentDate = [NSDate date];
    //用于格式化NSDate对象
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
<!--more-->    //设置格式：zzz表示时区
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss zzz"];
    //NSDate转NSString
    NSString *currentDateString = [dateFormatter stringFromDate:currentDate];
    //输出currentDateString
    NSLog(@"%@",currentDateString);

NSString到NSDate的转换：

    
    
    //需要转换的字符串
    NSString *dateString = @"2015-06-26 08:08:08";
     //设置转换格式
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init] ;
    [formatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    //NSString转NSDate
    NSDate *date=[formatter dateFromString:dateString];

[ 刚刚在线 ](http://www.superqq.com/) 上的介绍： [ http://www.superqq.com/
](http://www.superqq.com/blog/2015/06/26/nsdatehe-nsstringxiang-hu-zhuan-
huan/)

