title:  解除嵌套UIScrollView之间的联动 
date: 2016-08-02 20:29
tags: iOS
category: 技术笔记
---

一般情况下，在两个嵌套UIScrollView中，innerView滑到顶的时候，会联动outterView开始滚动，为了解除滚动，可以在innerView
的 ` .m ` 文件添加以下代码：(代码来自 [ iwevon
](http://www.jianshu.com/users/b3e1f67c3afd/latest_articles) 在简书的博客 [
ScrollView包含TableView解除联动 ](http://www.jianshu.com/p/420f9dc78c04) )

    
    
    /**************************************************
        question:
<!--more-->            当tableView被 父控件(scrollView或其子类) 所包含时,当tableView滑动到顶部时,
     再次下拉滑动tableView时,scrollView会其联动
     --------------------------------------------------
        answer:
            通过响应者链,获取父控件(scrollView或其子类)对象,修改其'scrollEnabled'属性,解除联动
     */
    - (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
        UIView *view = [super hitTest:point withEvent:event];
        //使用响应者链解决
        UIResponder *responder = [self nextResponder];
        UIScrollView *scrollView = nil;
        //responder==nil:说明tableView未被scrollView包含 scrollView!=nil:说明按照条件获取到父控件(scrollView或其子类)对象
        while (responder && scrollView == nil)
        {
            //如果是父控件(scrollView或其子类)就返回,说明tableview被scrollView包含关系
            if ([responder isKindOfClass:[UIScrollView class]]) {
                scrollView = (UIScrollView *)responder;
            } else {
                //根据响应者链去获取下一个响应者对象
                responder = [responder nextResponder];
            }
        }
        //scrollView为空时不会发送消息
        if (view) { //当view!=nil时,(view类型为UITableViewCellContentView)需要关闭响应者链中scrollView滑动手势
            scrollView.scrollEnabled = NO;
        } else { //当view==nil时,说明手势操作不是tableView发出的
            scrollView.scrollEnabled = YES;
        }
        return view;
    }

