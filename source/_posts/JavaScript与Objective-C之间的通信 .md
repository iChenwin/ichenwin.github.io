title:  JavaScript与Objective-C之间的通信 
date: 2016-08-31 20:14
tags: iOS
category: 技术笔记
---

转自 [ 老谭的博客 ](http://www.tanhao.me) ： [ JavaScript与Objective-C之间的通信
](http://www.tanhao.me/pieces/1607.html/)  
1、JS中变量在OC中的类型  
通过OC-JS Bridge，变量的类型会自动进行转换，基本类型都会自动转换，如JS中的number、boolean都会转换成OC中的NSNumber类型，
而String类型会自动转换成NSString类型，JS中的对象会转换成WebScriptObject对象，而相关的属性信息可以通过Key-
Value的方法读取和写入，本文后面可看到相关的代码。  
2、实现在OC中调用JS方法  
在OC中调用JS方法是非常方便的，WebView有一个windowScriptObject属性，可以直接获得脚本对象，然后便可以调用callWebScrip
tMethod:withArguments将消息转发给JS中对象的方法和参数，对于简单的方法调用你也可以直接通过WebView的方法stringByEval
<!--more-->uatingJavaScriptFromString去执行一段JS代码，并返回字符串。示例代码：

    
    
    //在OC中的调用
    - (void)ocAction:(id)sender
    {
        NSArray *args = @[@"Hello,JS!"];
        id result = [[webView windowScriptObject] callWebScriptMethod:@"JSFunction" withArguments:args];
        NSLog(@"%@",result);
    }
    //在JS中对应的方法
    function JSFunction(parameter)
    {
        //显示OC返回的值
        alert(parameter);
    
        //返回成功的消息
        return 'Web程序已经收到消息！';
    }

3、实现JS调用OC的方法  
通过设置webView的frameLoadDelegate，在– webView:didClearWindowObject:forFrame:回调方法中，指
定一个本地对象（该对象实现WebScripting协议），然后JS中就可以直接调用该对象的相关方法。  
OC中的代码如下：

    
    
    //该方法用于JS中调用
    - (WebScriptObject *)status:(WebScriptObject *)jsObject
    {
        //将JS发过来的信息显示出来
        NSString *message = [jsObject valueForKey:@"message"];
        NSLog(@"%@",message);
    
        //返回成功的信息(WebScriptObject对象不能自己创建，所以此处复用了传入的参数)
        [jsObject setValue:@"本地端已经收到消息啦！" forKey:@"message"];
        return jsObject;
    }
    
    #pragma mark -
    #pragma mark WebFrameLoadDelegate
    
    //通过此回调，将self传递给JS环境
    - (void)webView:(WebView *)sender didClearWindowObject:(WebScriptObject *)windowObject forFrame:(WebFrame *)frame
    {
        [windowObject setValue:self forKey:@"native"];
    }
    
    #pragma mark -
    #pragma mark WebScriptingProtocol
    
    /*
     返回是否阻止响应该方法,
     返回NO即能响应该方法
     */
    + (BOOL)isSelectorExcludedFromWebScript:(SEL)selector
    {
        if (selector == @selector(status:))
        {
            return NO;
        }
        return YES;
    }
    
    /*
     返回本地方法在JS中的名称(不实现此方法，则JS中方法名与OC中相同)
     */
    + (NSString *)webScriptNameForSelector:(SEL)sel
    {
        if (sel == @selector(status:))
        {
            return @"ocMethod";
        }
        return nil;
    }

JS中代码如下：

    
    
    function CallNative()
    {
        if (native)
        {
            //将消息组装成对象发给OC
            var parameter = {'message':'Hello,Objective-C!'};
            var result = native.ocMethod(parameter);
    
            //显示OC返回的结果
            alert(result['message']);
        }
    }

