title:  AFNetworking等待网络请求，继续同步操作 
date: 2016-11-09 23:04
tags: iOS
category: 技术笔记
---

  
在发出网络请求后，需要拿到网络返回的数据才能继续后续操作，这时可以用 ` dispatch_semaphore_wait() `

    
    
    - (id)sendForUrl:(NSURL *)url {
        AFHTTPRequestOperationManager *manager = [AFHTTPRequestOperationManager manager];
    
        manager.completionQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
<!--more-->        dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
    
        __block id response;
    
        [manager GET:url.absoluteString parameters:nil success: ^(AFHTTPRequestOperation *operation, id responseObject) {
            response = responseObject;
            NSLog(@"JSON: %@", responseObject);
            dispatch_semaphore_signal(semaphore);
        } failure: ^(AFHTTPRequestOperation *operation, NSError *error) {
            NSLog(@"Error: %@", error);
            dispatch_semaphore_signal(semaphore);
        }];
    
        dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    
        return response;
    }

栈溢出上的讨论： [ StackOverFlow ](http://stackoverflow.com/questions/28976144/wait-
for-afnetworking-completion-block-before-continuing-i-e-synchronous)

