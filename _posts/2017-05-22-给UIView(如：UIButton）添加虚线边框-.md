title:  给UIView（如：UIButton）添加虚线边框 
date: 2017-05-22 14:34
tags: iOS
category: 技术笔记
---

要给 ` UIButton ` 等视图加一圈虚线边框，这里是其中一种方法，就是在原来的视图的 ` layer ` 上再添加一层 ` CAShapeLayer
` ，在这一层中使用贝塞尔曲线 ` UIBezierPath ` 的 ` lineDashPattern ` 创建虚线边框。

    
    
    UIView *view          = [[UIView alloc] init];
    CAShapeLayer *layer   = [[CAShapeLayer alloc] init];
    layer.frame            = CGRectMake(0, 0 , view.frame.size.width, view.frame.size.height);
    layer.backgroundColor   = [UIColor clearColor].CGColor;
    
    UIBezierPath *path    = [UIBezierPath bezierPathWithRoundedRect:layer.frame cornerRadius:4.0f];
    layer.path             = path.CGPath;
    layer.lineWidth         = 4.0f;
    layer.lineDashPattern    = @[@4, @4];
    layer.fillColor          = [UIColor clearColor].CGColor;
    layer.strokeColor       = [UIColor whiteColor].CGColor;
    
    [view.layer addSublayer:layer];

