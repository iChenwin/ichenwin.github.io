title:  根据字符串长度动态计算UILabelView的高度 
date: 2016-08-28 15:39
tags: iOS
category: 技术笔记
---

在调用 ` UILabelView ` 时， ` Label ` 的高度最好根据字符串长度动态设置，为了实现这一点，我们可以用 `
NSAttributedString ` 的 ` \- (CGRect)boundingRectWithSize: options: context: `
方法，实现方法：

    
    
    if (labelText){
                NSMutableAttributedString *attrStr = [[NSMutableAttributedString alloc] initWithString:labelText];
                NSRange allRange = [labelText rangeOfString:labelText];
<!--more-->                [attrStr addAttribute:NSFontAttributeName
                                value:[UIFont systemFontOfSize:13.0]
                                range:allRange];
                //根据字符串长度计算所需的矩形框大小，其中需要指定“MAX_WIDTH”，根据这一宽度约束和字符串长度动态计算得到矩形框高度
                CGRect rect = [attrStr boundingRectWithSize:CGSizeMake(MAX_WIDTH, MAX_HEIGHT)
                                                    options:NSStringDrawingUsesLineFragmentOrigin | 
            NSStringDrawingTruncatesLastVisibleLine
                                                    context:nil];
    
                //adjust the label the the new height.
                CGRect newFrame = myLabel.frame;
                newFrame.size.height = ceil(rect.size.height);
                myLabel.frame = newFrame;
            }

