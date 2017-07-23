title:  Linux磁盘命令及分区 
date: 2014-03-14 21:21
tags: Linux
category: 技术笔记
---

Linux分区  
1.挂载命令  

    
    
    mount 【-参数】 【设备名】 【挂载点】

  
  
<!--more-->2.卸载命令  

    
    
    umount 【设备名称】

  
  
3.查看磁盘使用情况  

    
    
    df 【-参数】
    比如：	df -l
    	df -h

  
  
4.查看某个目录在那个分区  

    
    
    df 【目录全路径】

  
  
5.查看Linux系统分区具体情况  

    
    
    fdisk -l

  
  
6.分区  
/boot  200M  
/swap  物理内存的两倍(<=256M）  
/  
/home  
/usr

