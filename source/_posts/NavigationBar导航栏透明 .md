title:  NavigationBar导航栏透明 
date: 2016-08-12 18:49
tags: iOS
category: 技术笔记
---

想要得到导航栏透明的视图控制器(ViewController)，效果如下图：  
![透明导航栏](http://img.blog.csdn.net/20160812183631732)  
  
  
而默认情况下，导航栏是这样的：  
![不透明](http://img.blog.csdn.net/20160812183714872)  
  
  
想要让导航栏透明，可以这样实现：  
<!--more-->在视图控制器(ViewController) ` -(void)viewWillAppear: ` 中进行以下设置：

    
    
    -(void)viewWillAppear:(BOOL)animated {
        [super viewWillAppear:animated];
        [self.navigationController.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];  //设置一张空白图片
        self.navigationController.navigationBar.shadowImage = [UIImage new];  //导航栏的下底边也是一张图片，也许要设置成空白图片
    }

这样就把导航栏透明设置好了，不过导航控制器(navigationController)是多个视图控制器共用的，这样设置之后，其他视图控制器的导航栏也会变透明
，所以要在当前视图控制器退出的时候(viewWillDisappear)将导航栏复原：

    
    
    -(void)viewWillDisappear:(BOOL)animated {
        [super viewWillDisappear:animated];
        [self.navigationController.navigationBar setBackgroundImage:nil forBarMetrics:UIBarMetricsDefault];
        [self.navigationController.navigationBar setShadowImage:nil];
    }

不过设置完透明，导航栏下的 ` tableView ` 并没有置顶，而是留了块白条：  
![白条](http://img.blog.csdn.net/20160812184734214)  
  
  
这里还需要设置当前视图控制器的另外一属性 ` automaticallyAdjustsScrollViewInsets `

    
    
    - (void)viewDidLoad {
        [super viewDidLoad];
        self.automaticallyAdjustsScrollViewInsets = NO;
    }

这样就能达到我们预期的效果了。

