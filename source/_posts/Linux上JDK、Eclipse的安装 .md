title:  Linux上JDK、Eclipse的安装 
date: 2014-03-13 22:46
tags: Linux
category: 技术笔记
---

一、jdk安装

1.package.iso挂载

mount /mnt/cdrom/ [卸载：umount /mnt/cdrom/]

2.cp 文件名 /home/

3.cd /home
<!--more-->
4.安装

./j2sdk-****.bin

5./etc/profile  [环境配置文件]

JAVA_HOME=/home/j2sdk***

PATH=$PATH:/home/j2sdk***/bin

CLASSPATH=.:/home/j2sdkjre/lib/rt.jar

export JAVA_HOME PATH CLASSPATH

  

二、eclipse安装

1.cp eclipse-SDK-****.tar.gz /home

2.安装

tar -zxvf ???.tar.gz

3.启动eclipse[进入图形界面]

./eclipse

  

三、Myeclipse安装

./****.bin

  

Java服务器：tomcat、jboss、weblogic、websphere、resin

  

四、tomcat安装

./****.bin

