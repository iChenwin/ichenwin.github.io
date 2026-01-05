title:  给ViewController添加BarButton 
date: 2016-10-13 11:06
tags: iOS
category: 技术笔记
---

用代码给UIViewController(self)添加BarButton时，下面的代码不起作用：

    
    
    self.navigationController.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"xyz" style:UIBarButtonItemStyleDone target:self action:@selector(xyz)];

而这样就可以：

    
<!--more-->    
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"xyz" style:UIBarButtonItemStyleDone target:self action:@selector(xyz)];

关于 ` UINavigationItem ` ，苹果官网文档：

> This is a unique instance of UINavigationItem created to represent the view
controller when it is pushed onto a navigation controller. The first time the
property is accessed, the UINavigationItem object is created. Therefore, you
should not access this property if you are not using a navigation controller
to display the view controller. To ensure the navigation item is configured,
you can either override this property and add code to create the bar button
items when first accessed or create the items in your view controller’€™s
initialization code.  
Avoid tying the creation of bar button items in your navigation item to the
creation of your view controller’€™s view. The navigation item of a view
controller may be retrieved independently of the view controller’€™s view. For
example, when pushing two view controllers onto a navigation stack, the
topmost view controller becomes visible, but the other view controller’€™s
navigation item may be retrieved in order to present its back button.  
The default behavior is to create a navigation item that displays the view
controller’€™s title.

[ 刘大帅 ](http://www.jianshu.com/users/09e77d340dcf/latest_articles) 在他的博客 [
【iOS】导航栏那些事儿 ](http://www.jianshu.com/p/f797793d683f#) 详细解释了原因：

> 事实上，UINavigationController并没有navigationItem这样一个直接的属性，由于UINavigationControlle
r继承于UIViewController,而UIViewController是有navigationItem这个属性的，所以才会出现如图所示的情况。  
文／刘大帅（简书作者）  
原文链接： [ http://www.jianshu.com/p/f797793d683f#
](http://www.jianshu.com/p/f797793d683f#)  
著作权归作者所有，转载请联系作者获得授权，并标注“简书作者”。

还举了个很形象的栗子：

> 如果把导航控制器比作一个剧院，那导航栏就相当于舞台，舞台必然是属于剧院的，所以，导航栏是导航控制器的一个属性。视图控制器（UIViewControlle
r）就相当于一个个剧团，而导航项（navigation item）就相当于每个剧团的负责人，负责与剧院的人接洽沟通。显然，导航项应该是视图控制器的一个属性。
虽然导航栏和导航项都在做与导航相关的事情，但是它们的从属是不同的。  
我想，这个类比应该能解决以上的疑惑吧。导航栏相当于负责剧院舞台的布景配置，导航项则相当于协调每个在舞台上表演的演员（bar button
item,title 等等），每个视图控制器的导航项可能都是不同的，可能一个右边有一个选择照片的bar button
item,而另一个视图控制器的右边有两个bar button item。  
文／刘大帅（简书作者）  
原文链接： [ http://www.jianshu.com/p/f797793d683f#
](http://www.jianshu.com/p/f797793d683f#)  
著作权归作者所有，转载请联系作者获得授权，并标注“简书作者”。

