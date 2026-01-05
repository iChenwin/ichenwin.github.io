title:  CentOS 6.5设置 
date: 2014-04-12 05:10
tags: Linux
category: 技术笔记
---

编辑sudoers文件,先备份/etc/sudoers，之后使用su切换到root下，在sudoers中，找到

root ALL=(ALL) ALL后，加入下面一行username ALL=(ALL) ALL

**   
**

** 1.Chrome的安装  **

<!--more-->先下载自动安装脚本：http://chrome.richardlloyd.org.uk/install_chrome.sh

然后使用gedit编辑install—chrome.sh，使用find功能查找并将  
其中的http://omahaproxy.appspot.com改为https://dl.google.com/linux/direct  
  
/google-chrome-stable_current_x86_64.rpm。  
  
打开终端，依次执行  
  
chmod u+x install_chrome.sh  
./install_chrome.sh  

它会自动下载并安装最新版谷歌浏览器及相关依赖包。在终端下执行google-chrome就可以打开浏览器了。（注：须在非root用户下执行
，若是在root登陆情况下指定其他用户执行带图形的google-chrome，要执行“xhost
用户名”命令，授予该用户访问权限，这是因为Xserver默认情况下不允许别的用户的图形程序的图形显示在当前屏幕上。）

** 2.挂载NTFS分区 **

1、下载、编译安装ntfs-3g：  
#./configure  
#make  
#make install  （得是root权限才能执行）  
2、查看USB设备点：  
#fdisk -l   （得是root权限才能执行）  
Disk /dev/sdb: 60.0 GB, 60011642880 bytes  
255 heads, 63 sectors/track, 7296 cylinders  
Units = cylinders of 16065 * 512 = 8225280 bytes  
Device Boot Start End Blocks Id System  
/dev/sdb1 * 1 653 5245191 b W95 FAT32  
/dev/sdb2 654 7295 53351865 f W95 Ext'd (LBA)  
/dev/sdb5 654 1958 10482381 b W95 FAT32  
/dev/sdb6 1959 7295 42869421 7 HPFS/NTFS  
3、挂载NTFS分区：  
#mount -t ntfs-3g /dev/sda5 /mnt/win  
4、自启动  
如果想开机启动 就挂载上的话，编辑/etc/fstab 文件  如下：  
/dev/sda5     /mnt/win    ntfs-3g        defaults 0 0  

**   
**

** 3  .Error: Cannot find a valid baseurl for repo:问题解决可参考  :  **

** 默  读自我空间    
**

  

**   
**

** 4.sudo权限的赋予 **

sudo功能的配置文件一般在这里：/etc/sudoers，可以使用visudo编辑，好处是如果规则写的不符合要求能提示你，坏处是调出的是nano编辑器，甚
为不顺手。而且/etc/sudoers的配置文件的注释里也说明了，不建议直接修改/etc/sudoers，而是通过在/etc/sudoers.d/文件夹中新
增文件来完成配置。

Please consider adding local content in /etc/sudoers.d/ instead of directly
modifying this file.

新增的文件就用vi编辑就可以了，比如说要为mantou增加sudo权限，就增加一个文件，文件名无所谓，内容是：

mantou ALL=(ALL) ALL

保存，退出vi

然后需要把这个文件权限设置为400：chmod 400 mantou

再用mantou用户登录后就可以使用sudo权限了。

** 5.rar和unrar安装  **   

首先

    
    
    vim /etc/yum.repos.d/dag.repo

添加如下内容：

    
    
    [dag]
    
    name=Dag RPM Repository for Red Hat Enterprise Linux
    
    baseurl=http://apt.sw.be/redhat/el$releasever/en/$basearch/dag
    
    gpgcheck=1
    
    enabled=1
    
    gpgkey=http://dag.wieers.com/rpm/packages/RPM-GPG-KEY.dag.txt

然后yum install rar unrar即可。

  
  

