title: iOS扫描二维码
date: 2017-06-17 10:04:08
tag: iOS
category: 技术笔记
---

![扫码器所用AVFoundation模块图](http://ichenwin.qiniudn.com/avfoundation.png)

<!-- more -->

1. 导入AVFoundation库，并将它加入`.pch`预编译文件

2. 给相机预览控制器`DTCameraPreviewController`添加四个私有成员，获取`AVFoundation`的“终端”、“输入”、“输出”、“管理员”对象：

```objectivec

@implementation DTCameraPreviewController

{

    AVCaptureDevice *_camera;

    AVCaptureDeviceInput *_videoInput;

    AVCaptureStillImageOutput *_imageOutput;

    AVCaptureSession *_captureSession;

}

```

3. 选取录制设备（摄像头或麦克风）

`AVCaptureDevice`提供了一个类方法，指定一种媒体类型（`AVMediaTypeVideo` or `AVMediaTypeAudio`）它便能返回对应的录制设备。其他媒体类型可以在`AVMediaFormat.h`中找到，不过它们不需要录制设备（如文本、字幕等）。

在`DTCameraPreviewController.m`中实现`_setupCamera`方法，用来初始化若干个`AVFoundation`中用于录制的对象，

```objectivec

- (void)_setupCamera {

    //获取到一个录制设备（摄像头）

    _camera = [AVCaptureDevice defaultDeviceWithMediaType: AVMediaTypeVideo];



    //创建摄像头的输入，initWithDevice:方法自动为设备分配了一个端口，每个端口只能传输一路媒体数据

    NSError *error;

    _videoInput = [[AVCaptureDeviceInput alloc] initWithDevice:_camera error:&error];

    if (!_videoInput) {

        NSLog(@"Error connecting video input: %@", [error localizedDescription]);

        return;

    }

}

```

4. 媒体录制“管理进程”

`AVCaptureSession`是媒体录制进程的的管理员。控制着设备的输入输出。将输入添加至设备（`_setupCamera`方法）：

```objectivec

    //创建录制“管理进程”，将输入添加至设备

    _captureSession = [[AVCaptureSession alloc] init];

    if (![_captureSession canAddInput:_videoInput]) {

        NSLog(@"Unable to add video input to capture session");

        return;

    }

    [_captureSession addInput:_videoInput];

```

5. 显示实时视频预览

苹果提供了预览层`AVCaptureVideoPreviewLayer`，它可以提供摄像头画面的实时预览。因为它是CALayer的子类，将它封装至`UIView`，方便使用。所以新建一个继承自`UIView`的`DTVideoPreviewView`类。头文件中，定义一个属性以获取视频预览层：

```objectivec

@interface DTVideoPreviewView : UIView

@property (readonly) AVCaptureVideoPreviewLayer *previewLayer;

@end

```

实现文件：

```objectivec

@implementation DTVideoPreviewView

//代码创建实例时调用

- (id)initWithFrame:(CGRect)frame {

   self = [super initWithFrame:frame];

   if (self)

   {

      [self _commonSetup];

   }

   return self;

}



//通过Nib创建

- (void)awakeFromNib {

    [self _commonSetup];

}



//替代默认的CALayer

+ (Class)layerClass {

    return [AVCaptureVideoPreviewLayer class];

}



- (void)_commonSetup {

    self.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;

    self.backgroundColor = [UIColor blackColor];

    [self.previewLayer setVideoGravity:AVLayerVideoGravityResizeAspectFill]; 

}

//类型转换

- (AVCaptureVideoPreviewLayer *)previewLayer {

    return (AVCaptureVideoPreviewLayer *)self.layer;

}

@end

```

将storyboard中的根视图类型改为`DTVideoPreviewView`。

在`DTCameraPreviewController`中添加以下`viewDidLoad`方法：

```objectivec

- (void)viewDidLoad {

    [super viewDidLoad];

    NSAssert([self.view isKindOfClass:[DTVideoPreviewView class]], @"Wrong root view class %@ in %@", NSStringFromClass([self.view class]), NSStringFromClass([self class]));

    _videoPreview = (DTVideoPreviewView *)self.view; 

    [self _setupCamera];

}

```

以及在`_setupCamera`最后将预览图层添加至管理进程中：

```objectivec

_videoPreview.previewLayer.session = _captureSession;

```

至此，我们已将流程图中的`AVCaptureDeviceInput`连至预览图层。

启动摄像头需调用`-startRunning`

```objectivec

- (void)viewWillAppear:(BOOL)animated {

   [super viewWillAppear:animated];

   [_captureSession startRunning];

}



- (void)viewDidDisappear:(BOOL)animated {

    [super viewDidDisappear:animated];

    [_captureSession stopRunning];

}

```

6. 设置闪光灯

```objectivec

- (void)_setupTorchToggleButton {

    if ([_camera hasTorch]) {

        self.toggleTorchButton.hidden = NO;

    } else {

        self.toggleTorchButton.hidden = YES;

    }

}

- (IBAction)toggleTorch:(id)sender {

    if ([_camera hasTorch]) {

        BOOL torchActive = [_camera isTorchActive];

        

        if ([_camera lockForConfiguration:nil]) {

            if (torchActive) {

                if ([_camera isTorchModeSupported:AVCaptureTorchModeOff]) {

                    [_camera setTorchMode:AVCaptureTorchModeOff];

                }

            } else {

                if ([_camera isTorchModeSupported:AVCaptureTorchModeOn]) {

                    [_camera setTorchMode:AVCaptureTorchModeOn];

                }

            }

            

            [_camera unlockForConfiguration];

        }

    }

}

```

6. 抓取照片

完整的`_setupCamera`：

```objectivec

- (void)_setupCamera {

    _camera = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];

    

    if (!_camera) {

        [self.snapButton setTitle:@"No Camera Found" forState:UIControlStateNormal];

        self.snapButton.enabled = NO;

        [self _informUserAboutNoCam];

        return;

    }

    

    NSError *error;

    _videoInput = [[AVCaptureDeviceInput alloc] initWithDevice:_camera error:&error];

    

    if(!_videoInput) {

        NSLog(@"error connectiong video input: %@", [error localizedDescription]);

        return;

    }

    

    _captureSession = [[AVCaptureSession alloc] init];

    if (![_captureSession canAddInput:_videoInput]) {

        NSLog(@"Unable to add video input to capture session");

        return;

    }

    [_captureSession addInput:_videoInput];

    

//    [self _configureCurrentCamera];

    _imageOutput = [AVCapturePhotoOutput new];

    

    if (![_captureSession canAddOutput:_imageOutput]) {

        NSLog(@"Unable to add still image output to capture session");

        return;

    }

    

    [_captureSession addOutput:_imageOutput];

    

    _videoPreview.previewLayer.session = _captureSession;

}

```

获取当前链路：

```objectivec

- (AVCaptureConnection *)_captureConnection {

    for (AVCaptureConnection *connection in _imageOutput.connections) {

        for (AVCaptureInputPort *port in [connection inputPorts]) {

            if ([port.mediaType isEqual:AVMediaTypeVideo]) {

                return connection;

            }

        } 

    }

    return nil; 

}

```

拍照：

```objectivec

- (IBAction)snap:(id)sender {

    if (!_camera) {

        return;

    }

    

    AVCaptureConnection *videoConnection = [self _captureConnection];

    

    if (!videoConnection) {

        NSLog(@"Error:No Video connection found on still image output");

    }

    

    [_imageOutput captureStillImageAsynchronouslyFromConnection:videoConnection completionHandler:^(CMSampleBufferRef imageSampleBuffer, NSError *error) {

        if (error) {

            NSLog(@"Error capturing still image: %@", [error localizedDescription]);

            return;

        }

        NSData *imageData = [AVCaptureStillImageOutput jpegStillImageNSDataRepresentation: imageSampleBuffer];

        UIImage *image = [UIImage imageWithData:imageData];

        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil);

     }];

}

```

7. 对焦

iOS有三种对焦模式：

```objectivec

AVCaptureFocusModeContinuousAutoFocus

AVCaptureFocusModeAutoFocus

AVCaptureFocusModeLocked

```

监测扫描区域的变化：

```objectivec

- (void)_configureCurrentCamera {

    if ([_camera isFocusModeSupported:AVCaptureFocusModeLocked]) {

        if ([_camera lockForConfiguration:nil]) {

            _camera.subjectAreaChangeMonitoringEnabled = YES;

            

            [_camera unlockForConfiguration];

        }

    }

}

```

一旦画面有变化，iOS系统就会发出`AVCaptureDeviceSubjectAreaDidChangeNotification`通知，我们可以再`-viewDidLoad`中订阅这一通知：

```objectivec 

- (void)viewDidLoad {

    [super viewDidLoad];

    // Do any additional setup after loading the view, typically from a nib.

    NSAssert([self.view isKindOfClass:[CWVideoPreviewView class]],

             @"Wrong root view class %@ in %@",

             NSStringFromClass([self.view class]),

             NSStringFromClass([self class]));

    

    _videoPreview = (CWVideoPreviewView *)self.view;

    [self _setupCamera];

    _videoPreview.previewLayer.session = _captureSession;

    

    [self _setupCameraAfterCheckingAuthorization];

    

    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTap:)];

    [self.view addGestureRecognizer:tap];

    

    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];

    [center addObserver:self

               selector:@selector(subjectChanged:)

                   name:AVCaptureDeviceSubjectAreaDidChangeNotification

                 object:nil];

}

```