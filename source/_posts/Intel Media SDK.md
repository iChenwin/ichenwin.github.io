title: Intel Media SDK使用
date: 2016-1-17 14:44:08
tag: [编解码,视频]
category: [媒体控制,技术笔记]
---
这是一篇来自Intel官方的博文，介绍了Intel Media SDK使用方法：[Framework for developing applications using Media SDK](https://software.intel.com/zh-cn/articles/framework-for-developing-applications-using-media-sdk#Query)
This article is geared towards beginner developers in of the Media SDK, which can be found in [Intel(R) Media Server Studio](https://software.intel.com/en-us/intel-media-server-studio/try-buy) or [Intel(R) Media SDK](https://software.intel.com/en-us/media-sdk) for Client. The SDK component in these products is essentially the same and the article below applies to both.

Often times, we use the existing samples and tutorials to understand how to develop applications in Media SDK, and modify these samples/tutorials to plug in our own code. Sometimes, it works. But when it is time to add more features to the code or optimize the code, we have to invest a lot more time understanding and re-writing our code. My belief is that if we understand the basic steps that are required to develop an application in Media SDK, the actual time to code itself collapses to simply understanding and using select APIs, and not on coding/debugging the setup part. Enough motivation, let's begin!
<!--more-->
Media SDK is a framework that enables developing applications in media by providing APIs for ease of development. These APIs are optimized for the underlying hardware/accelerators and provide good abstractions for most of the heavy-duty media algorithm implementations. So, as a developer, we need to understand the sequence these APIs should be called in to set-up the media pipeline and say go. Much of this article will focus on the former, and also provide some details into the different options available to the developer to add more features. Shown below are the basic structure of a Media SDK application. We will discuss each of these stages in more detail in this article. Now, let us get into details of each of these stages.
![flowchart_MSDK](http://7i7io5.com1.z0.glb.clouddn.com/flowchart_MSDK.png)
##### Initialize Session
The first part of the set-up stage is initializing the Media SDK session, within which the media pipeline we will define will execute. Sessions use the dispatcher to map function calls to their DLL implementation.
```
MFXVideoSession session;
sts = MFXInit(mfxIMPL impl, mfxVersion ver, MFXVideoSession *session);
```
The `MFXInit()` function initializes the media session for the implementation specified and for the version available.
`"mfxIMPL impl"` -> Use software, or hardware or best available implementation. We recommend using `MFX_IMPL_HARDWARE`, or `MFX_IMPL_AUTO` if you are unsure of the underlying driver support.
`"mfxVersion ver"` -> If you specify 0, it uses the API version from the SDK release with which an application is built. Alternately, you can use `MFXQueryVersion` function to query for the version.
##### Set Parameters
In this stage, we will specify all the video parameters required for the decode/encode/vpp processing. For each pipeline stage (decode/encode/vpp) in your application, we will populate the `mfxVideoParam` structure with the appropriate values. We will illustrate this with the following example use-case:
```
Use-case: Input YUV stream -> Pre-processing using VPP -> Encode to H264-> Decode the h264 stream
Input Resolution: 352x288
Output Resolution: 176x144
Required bitrate for encode: 3000 Kbps, Constant Bitrate
Frame rate: 30 fps
Pre-processing: Resize and Denoise filter with window size of 5
Video formats: YUV420p and H264
```
In the table below, the fields filled in are the mandated fields based on the use-case we defined above.
![parameters_0](http://7i7io5.com1.z0.glb.clouddn.com/parameters_0.png)
In the code snippet below, we show it for generic stage and will point out specifics:
```
mfxVideoParam Params;    // Require one each for decode/encode/vpp
memset(&Params, 0, sizeof(Params));
```
For encode/decode/transcode, the `mfxVideoParam::mfxInfoMFX` structure needs to be filled in, as it contains variables that define the video properties (for input and output), and variables to control the properties of the encode/decode process. For VPP, the `mfxVideoParam::mfxInfoVPP` is the main structure that specifies the properties of the input and output VPP frames. Note that the properties specified for the output frames are queried later for validity and support.
**NOTE**: For decoder, you can call the function DecodeHeader that parses the input bit stream and fills the `mfxVideoParam` structure with appropriate values, such as resolution and frame rate. The application can then pass the resulting `mfxVideoParam`structure to the `MFXVideoDECODE_Init` function for decoder initialization. You can call this function at any time before or after decoder initialization.
```
sts = mfxDEC.DecodeHeader(mfxBitstream* mfxBS, mfxVideoParam* Params);
MSDK_IGNORE_MFX_STS(sts, MFX_WRN_PARTIAL_ACCELERATION);    //Ignore this warning message. Indicates SW implementation will be used instead of the HW implementation.
MSDK_CHECK_RESULT(sts, MFX_ERR_NONE, sts);
```
Apart from these, some common properties for encode/decode/transcode/VPP in the `mfxVideoParam` structure are `IOPattern`, `AsyncDepth`, `NumExtParam` and `ExtParam`. `IOPattern` is a mandated field for decode, encode and VPP. This parameter itemizes memory access patterns for SDK functions. For example, is the (input,output) access pattern in video memory, system memory or opaque. When using the hardware implementation, it is suggested to use the video memory. `AsyncDepth` parameter specifies how many asynchronous operations can be performed before the application explicitly synchronizes.
**External Buffers for added features**
The `NumExtBuffer` and `ExtParam` parameters specify the number of extra configuration structures attached, and the pointer to these configurations respectively. For example, in the use-case above, we want to resize and denoise the input stream before we encode. We use the external buffers to specify these operations, and attach them to the videoParams structure for processing. The `ExtendedBufferID` enumerator lists the possible operations that can be attached to this structure. simple_4_vpp_resize_denoise_vmem tutorial gives an example of using this structure for de-noising operation.
```
// Initialize extended buffer for frame processing
// - Denoise           VPP denoise filter
// - mfxExtVPPDoUse:   Define the processing algorithm to be used
// - mfxExtVPPDenoise: Denoise configuration
// - mfxExtBuffer:     Add extended buffers to VPP parameter configuration
mfxExtVPPDoUse extDoUse;
memset(&extDoUse, 0, sizeof(extDoUse));
mfxU32 tabDoUseAlg[1];
extDoUse.Header.BufferId = MFX_EXTBUFF_VPP_DOUSE;
extDoUse.Header.BufferSz = sizeof(mfxExtVPPDoUse);
extDoUse.NumAlg = 1;
extDoUse.AlgList = tabDoUseAlg;
tabDoUseAlg[0] = MFX_EXTBUFF_VPP_DENOISE;
mfxExtVPPDenoise denoiseConfig;
memset(&denoiseConfig, 0, sizeof(denoiseConfig));
denoiseConfig.Header.BufferId = MFX_EXTBUFF_VPP_DENOISE;
denoiseConfig.Header.BufferSz = sizeof(mfxExtVPPDenoise);
denoiseConfig.DenoiseFactor = 5;        // can be 1-100
mfxExtBuffer* ExtBuffer[2];
ExtBuffer[0] = (mfxExtBuffer*) &extDoUse;
ExtBuffer[1] = (mfxExtBuffer*) &denoiseConfig;
VPPParams.NumExtParam = 2;
VPPParams.ExtParam = (mfxExtBuffer**) &ExtBuffer[0];
// Initialize Media SDK VPP
sts = mfxVPP.Init(&VPPParams);
```
With this, we have finished setting the parameters for the media pipeline. You can find more details about the control options and properties in the documentation for Media SDK. Until now, the developer has specified what he wants to achieve with the media pipeline. The SDK may or may not support all the transformations, thus, querying is an important and often ignored step that should follow the set-up.
##### Query
Once the video parameters are specified in the `mfxVideoParam` structure, you can Query to check for the validity and SDK support of these parameters. The Query functionality provided by Media SDK is powerful and very useful. 
The Query functions can be used to check: the implementation supported by the platform - software or hardware (`MFXQueryIMPL`), version of the SDK (`MFXQueryVersion`), if the required transformations are supported by the SDK, if not, what are the minimum that can be (`Encode_Query`. `Decode_Query`, `VPP_query`), the number of surfaces required for the transformations (`Encode_QueryIOSurf`, `Decode_QueryIOSurf`, `VPP_QueryIOSurf`).
```
MFXQueryIMPL(session, &impl); // returns the actual implementation of the session
MFXQueryVersion(session, &version); //returns the version of the SDK implementation
sts = mfxVPP.Query(&Params_in, &Params_out); //*Params_in points to the requested out features, *Param_out points to the features that can be best achieved. If sts is MFX_ERR_NONE, it means requested features can be met. If the status returns warnings for incompatible video parameters, the *param_out is filled with best achievable parameters.
```
Now that we have initialized the session, set the parameters and queried their support, we have to allocate the surface buffers that will be used by the SDK pipeline.
##### Allocate Surfaces
Once we have set the video parameters, our next step is to allocate surfaces for these operations. The `QueryIOSurf` function returns the minimum and suggested numbers of frame surfaces required for encoding/decoding/VPP initialization and their type. This number depends on multiple parameters such as number of asynchronous operations before synchronization, number of operations in the pipeline stage and buffer sizes. As mentioned above, AsyncDepth is a good parameter to constrain the number of surfaces.
```
mfxFrameAllocRequest Request;
memset(&Request, 0, sizeof(Request));
sts = QueryIOSurf(session, &Params, &Request);
mfxU16 numSurfaces = Request.NumFrameSuggested;
```
Now, we proceed with allocation of the surface buffers for the suggested number of surfaces.
Allocation of surfaces is very important for performance - The SDK's best performance comes from using the underlying hardware. Thus, allocating the buffers the SDK operates on in the video memory is highly desirable since this eliminates copying them from the system memory to the video memory. During the session initialization, please use video memory for IO for input and output to specify the usage. And during allocation, use SDK provided alloc functions instead of `memset()` or `new()` that would allocate the buffers in the system memory.
```
/* Using system memory for allocation - NOT RECOMMENDED, since lowers performance
mfxU32 surfaceSize = width * height * bitsPerPixel / 8;
mfxU8* surfaceBuffers = (mfxU8*) new mfxU8[surfaceSize * numSurfaces];
*/
/* Using video memory for allocation - RECOMMENDED */
mfxFrameAllocResponse DecResponse;
sts = mfxAllocator.Alloc(mfxAllocator.pthis, &frameAllocRequested, &frameAllocGiven);
mfxFrameSurface1** pmfxSurfacesDec = new mfxFrameSurface1 *[numSurfaces];
MSDK_CHECK_POINTER(pmfxSurfacesDec, MFX_ERR_MEMORY_ALLOC);
for (int i = 0; i < numSurfaces; i++) {
    pmfxSurfaces[i] = new mfxFrameSurface1;
    memset(pmfxSurfaces[i], 0, sizeof(mfxFrameSurface1));
    memcpy(&(pmfxSurfaces[i]->Info), &(mfxParams.mfx.FrameInfo), sizeof(mfxFrameInfo));
    pmfxSurfaces[i]->Data.MemId = DecResponse.mids[i];   // MID (memory id) represent one D3D NV12 surface
    }
```
After the surface allocation, we can now proceed with initializing the encoder/decoder/VPP. **NOTE about opaque surfaces**: Opaque surfaces, as the name suggests, are managed by the SDK and are not visible or controllable by the developer. These surfaces are best used when the functionality required is basic and concrete (like decoding or encoding) and will not be expanded upon later. As a thumb rule, we always recommend using hardware implementation with video surfaces.
##### Find Free Surface
With allocation of surfaces, the set-up part is complete. Yes, it looks tedious, but once you get a hang of it, it is quite intuitive - start the dialogue (initialize session), tell the SDK what you want (set parameters), ask if SDK can do it (query), allocate resources (allocate surfaces) to start doing it! In the following sections, we will touch upon how to start the processing stage and clean-up afterwards.
The SDK uses the surfaces allocated and initialized to do the processing. So, to begin processing, use the `GetFreeSurface()` function to get an input and output surface that is free (not locked by other process) and can be used for the processing. This functionality is as simple as find an unlocked surface for use.
```
nIndex = GetFreeSurfaceIndex(pmfxSurfaces, numSurfaces);        // Find free frame surface
```
After finding the free surface, read the bit stream (for decoder), or the frame (for encoder) into the surface and pass the surface for processing.
##### Processing Loop
The Media SDK provides the developer with synchronous and asynchronous function calls for the processing - be it encode, decode or VPP. As the name suggests, if the function call is synchronous, it is required to wait on sync after every processing function call. In essence, you cannot fire multiple frame processing in parallel.

As a rule of thumb, we recommend the use of asynchronous calls to process frames. In a loop that terminates when the input is empty, fire asynchronous functions for either decode/encode/VPP. You can specify the number of asynchronous operations you'd like to perform before synchronizing using the **AsyncDepth** parameter. This way, you are processing multiple frames in parallel thus improving the performance significantly.
```
while (MFX_ERR_NONE <= sts || MFX_ERR_MORE_DATA == sts || MFX_ERR_MORE_SURFACE == sts)
{
    /** Asynchronous call handling **/
    nTaskIdx = GetFreeTaskIndex(*taskPool, poolSize=AsyncDepth);    //Find free taskID
    if(nTaskIdx == NULL){
        sts = session.SyncOperation(pTasks[nFirstSyncTask].syncp, 60000);   // Synchronize. Wait until processed frame is ready
        pTasks[nFirstSyncTask].syncp = NULL;
        nFirstSyncTask = (nFirstSyncTask + 1) % taskPoolSize;
    }
    nIndex = GetFreeSurfaceIndex(pmfxSurfaces, numSurfaces);        // Find free frame surface
    sts = {Decode|Encode|VPP}FrameAsync;
    /** Synchronous call handling */
    if (MFX_ERR_NONE == sts)
        sts = session.SyncOperation(syncp, 60000);      // Synchronize. Wait until processed frame is ready
}
```
##### Drain and Cleanup
This stage is similar to the previous Processing Loop, with the exception that the input parameter to the **FrameAsync** function is **NULL**, and we are draining the pipeline at this stage. For pseudo-code, all you need to do is replace the first parameter for FrameAsync function with NULL in the while loop above. Once the pipeline draining is done, we deallocate all the buffers used and close the file handles if any.
With this we conclude the basic steps for developing using Media SDK. Hope this was helpful. I will add more information as and when I find it.