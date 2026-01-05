title:  Fedora 20配置 
date: 2014-03-11 23:43
tags: Linux
category: 技术笔记
---

** 转载自 [ 51运维网 ](http://www.51ou.com/browse/fedora/33174.html) 、 [ 苏若年 ](http://www.cnblogs.com/dennisit/archive/2012/12/27/2835089.html) （ffmpeg未成功） [ 51CTO ](http://os.51cto.com/art/201312/426047_all.htm)   
**

**   
**

** 字体渲染Freetype： [ http://www.it165.net/os/html/201308/6103.html ](http://www.it165.net/os/html/201308/6103.html) **

** Goagent: [ http://linux.chinaitlab.com/administer/938694_2.html ](http://linux.chinaitlab.com/administer/938694_2.html) **
<!--more-->
[ http://blog.dimpurr.com/ubuntu-gae/ ](http://blog.dimpurr.com/ubuntu-gae/)

  

** 1.加入第三方源  **

版权(nonfree)和专利(free)  

    
    
    sudo rpm -Uvh http://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-stable.noarch.rpm
    
    sudo rpm -Uvh http://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-stable.noarch.rpm
    
    sudo yum makecache
    

  

** 2.安装自动选择最快镜像插件 **

yum管理器自动搜索最快源下载  

    
    
    sudo yum -y install yum-fastestmirror
    

(  yum -y install yum-plugin-fastestmirror  )

更多YUM插件可以运行$

    
    
    sudo yum info yum-plugin-*

  
来查看

** 3.更新系统 **
    
    
    sudo yum update

  
** 4.安装gnome管理工具 **
    
    
    sudo yum install gnome-tweak-tool

如果使用了浏览器你可能发现firefox标题栏只有关闭按钮

标题栏添加“最大化/最小化/关闭”按钮

打开gnome-tweak-tool( super+space --> utilitis --> 优化工具，或者直接从终端启动)，

选择 shell --> 管理标题栏上的按钮 --> 全部

  

** 5.安装wget : **
    
    
    sudo yum install wget

  
** 6.安装flash plugin: **
    
    
     wget http://linuxdownload.adobe.com/adobe-release/adobe-release-x86_64-1.0-1.noarch.rpm
    
    sudo rpm -ivh adobe-release-x86_64-1.0-1.noarch.rpm
    
    sudo yum -y install flash-plugin

  

** 7.将输入法改为fcitx **

(1).首先,删除ibus  

    
    
    sudo yum remove ibus
    gsettings set org.gnome.settings-daemon.plugins.keyboard active false

  
  
(2).之后安装fcitx  

    
    
    sudo yum install fcitx*

  
  
(3).配置fcitx  
在~/.bashrc中添加:  

    
    
    export GTK_IM_MODULE=fcitx  
    export QT_IM_MODULE=fcitx  
    export XMODIFIERS="@im=fcitx" 

  
  

