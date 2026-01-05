title:  移除字符串NSString中的特定字符 
date: 2017-02-03 22:24
tags: iOS
category: 技术笔记
---

如果要移除NSString ` ni'hao shi'jie ` 中的单引号，那么可以使用这条语句：

    
    
    NSString *stringWithoutQuotation = [myString 
       stringByReplacingOccurrencesOfString:@"'" withString:@""];

也可以使用这条语句：

<!--more-->    
    
       NSString* noQuotation =
        [[myString componentsSeparatedByCharactersInSet:@"'"]
                               componentsJoinedByString:@""];

