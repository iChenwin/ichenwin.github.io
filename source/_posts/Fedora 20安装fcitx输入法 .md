title:  Fedora 20安装fcitx输入法 
date: 2015-03-18 20:01
tags: Linux
category: 技术笔记
---

转自： [ http://yanue.net/post-140.html ](http://yanue.net/post-140.html)

[ ](http://yanue.net/post-140.html)

为方便操作，先以用root账户登录系统

##  1、先卸载系统自带的Ibus输入法

    
<!--more-->          1. sudo yum remove ibus
    
      2. gsettings set org.gnome.settings-daemon.plugins.keyboard active false

##  2、安装Fcitx输入法

a. 全部安装

    
          1. sudo yum install fcitx*

b. 当然，其实没必要全部安装：

    
          1. yum list '*fcitx*'

装上fcitx fcitx-devel fcitx-configtool 就可以了

    
          1. yum install fcitx fcitx-devel fcitx-configtool

##  3、配置一下Fcitx、在~/.bashrc中添加:如下内容

    
          1. export GTK_IM_MODULE=fcitx  
    
      2. export QT_IM_MODULE=fcitx  
    
      3. export XMODIFIERS="@im=fcitx"

##  4、注销或重启后完成安装

上面步骤完成之后其实就可以使用Fcitx输入法

  

