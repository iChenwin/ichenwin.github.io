title: 用MBRFix卸载Linux
date: 2015-04-18 8:17:25
tags: Linux
category: 技术笔记
---

Win7和Linux双系统的情况下，卸载Linux，需修改MBR，方法有二：
1. 将Windows的安装盘放入计算机以后，重启计算机，进入Windows安装程序，随后，进入恢复控制台，输入命令fixmbr即可。
2. 如果没有Windows安装盘，就可以用MBRFix工具进行修复。MBRFix工具修复MBR很方便，先进入cmd命令窗口，然后进入mbrfix工具所在的目录（用cd命令），然后输入命令 MbrFix /drive 0 fixmbr ，再确认一下即可。重启以后你会发现，没有了Linux，直接可以进入Windows了。

附一：MbrFix命令
```
MbrFix /drive <num> driveinfo              Display drive information
MbrFix /drive <num> listpartitions         Display partition information
MbrFix /drive <num> savembr <file>         Save MBR and partitions to file
MbrFix /drive <num> restorembr <file>      Restore MBR and partitions from file
MbrFix /drive <num> fixmbr                 Update MBR code to W2K/XP/2003
MbrFix /drive <num> clean                  Delete partitions in MBR
MbrFix /drive <num> readsignature {/byte}  Read disk signature from MBR
MbrFix /drive <num> generatesignature      Generate disk signature in MBR
MbrFix /drive <num> readstate              Read state from byte 0x1b0 in MBR
MbrFix /drive <num> writestate <state>     Write state to byte 0x1b0 in MBR
```
<!--more-->
附件二：MBRFix下载：
链接: [http://pan.baidu.com/s/1bn6O78r](http://pan.baidu.com/s/1bn6O78r)
密码: y3mk
