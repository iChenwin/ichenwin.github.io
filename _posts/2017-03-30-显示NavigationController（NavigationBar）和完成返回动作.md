title:  显示NavigationController（NavigationBar）和完成返回动作
date: 2017-03-30 16:37
tags: iOS
category: 技术笔记
---

  
在要跳转至下一个 ` ViewController ` 处，创建一个 ` NavigationController ` ，并将下一个 ` VC `
作为它的根 ` VC ` ，然后显示 ` NavigationController ` （ ` NavigationController ` 中只有一个 `
VC ` ，所以也就是显示下一个 ` VC ` ）：

    
    
        NextViewController *vc = [[NextNViewController alloc] init];
        UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:vc];
<!--more-->        [self presentViewController:navigationController animated:YES completion:^{
        }];

接着，在 ` NextViewController ` 添加返回按钮，并返回父视图：

    
    
    - (void)viewWillAppear:(BOOL)animated {
        UIBarButtonItem *backItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone target:self action:@selector(goBack)];
        [self.navigationItem setLeftBarButtonItem:backItem];
    }
    
    - (void)goBack {
        [self.navigationController dismissViewControllerAnimated:YES completion:^{
        }];
    }

