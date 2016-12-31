title: 给hexo博客添加背景音乐
date: 2015-11-1 10:04:08
tag: 博客 CSS
category: 博客建设
---
1. 获取外链

![歌曲详情](http://7i7io5.com1.z0.glb.clouddn.com/1.png)
<!--more-->
![获取外链](http://7i7io5.com1.z0.glb.clouddn.com/2.png)
获取到的外链长这样：
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 
src="http://music.163.com/outchain/player?type=2&id=1993765&auto=1&height=66">
</iframe>
```
将它稍作修改：
```
<% if (theme.background_music.enable){ %>
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=200 height=86 
src=<%= theme.background_music.src %>>
</iframe>
<% } %>
```
其中的`width`、`height`都可以根据自己需求修改播放器宽高。`src`部分被改为了主题`jacman`配置文件中的变量名，并且在`iframe`外面套了一层`if`判断。同时将`src`后的链接提取出来：
```
"http://music.163.com/outchain/player?type=2&id=1993765&auto=1&height=66"
```
2. 修改`E:\Hexo\themes\jacman\_config.yml`，在文件末尾加入如下部分，其中` src`后面部分就是上一步`src`后的链接，以后要换背景音乐只需替换这一链接就行了。
```
background_music:
 enable: true
 src: "http://music.163.com/outchain/player?type=2&id=1993765&auto=1&height=66"
```
![E:\Hexo\themes\jacman\_config.yml](http://7i7io5.com1.z0.glb.clouddn.com/3.png)
3. 修改`E:\Hexo\themes\jacman\layout\_partial\sidebar.ejs`，在`<div id="asidepart">`后面插入第一步修改后的代码：
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 
src="http://music.163.com/outchain/player?type=2&id=1993765&auto=1&height=66">
</iframe>
```
![E:\Hexo\themes\jacman\layout\_partial\sidebar.ejs](http://7i7io5.com1.z0.glb.clouddn.com/5.png)