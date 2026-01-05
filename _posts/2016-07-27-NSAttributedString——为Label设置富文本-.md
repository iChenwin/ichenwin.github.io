title:  NSAttributedString——为Label设置富文本 
date: 2016-07-27 19:29
tags: iOS
category: 技术笔记
---

为了在同一个Label中显示两种颜色的字符，如下图（浅灰和黑色）：  
![富文本](http://img.blog.csdn.net/20160727192037886)  
这里用到了 ` NSMutableAttributedString ` ，它可以创建自定义属性的富文本。和它同类的还有 `
NSAttributedString ` 。  
要实现上面一个Label中含两种颜色字符的效果，将汉字颜色设置成浅灰色，用了下面简单的代码实现：

    
    
        _followerLabel.text = @"关注 11";
<!--more-->        NSRange followerRange = [_followerLabel.text rangeOfString:@"关注"];
        NSMutableAttributedString *followerText = [[NSMutableAttributedString alloc] initWithString:_followerLabel.text];
        [followerText beginEditing];
        [followerText setAttributes:@{NSForegroundColorAttributeName: [UIColor colorWithRed:36.0f/255.0f green:36.0f/255.0f blue:36.0f/255.0f alpha:0.6]} range:followerRange];
        [followerText endEditing];
        _followerLabel.attributedText = followerText;

