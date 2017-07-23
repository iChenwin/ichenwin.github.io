title:  Linux常用指令（1） 
date: 2014-03-13 22:44
tags: Linux
category: 技术笔记
---

一、系统操作

    
    
    <span style="font-size:18px;">shutdown -h now【立刻关机】</span>

shutdown -r now 【立刻重启】

reboot  【立刻重启】
<!--more-->
logout  【注销】

  

二、root用户（su -)

login：root

password：

  

Ctrl+Alt+F1  【命令行界面】

Alt+F7 【返回桌面】

startx 【开启图形界面】

  

三、vi编辑器

1.vi Hello.java

2.i  【insert插入模式】

3.esc 【返回命令模式】

4.:

(1).wq 【退出并保存】

(2).q! 【退出但不保存】

5.ls (-l) 【文件列表（详细）】

6.编译Java

javac Hello.java

java Hello

  

四、C语言程序

1.编译gcc Hello.cpp  自动生成a.out文件

2.运行./a.out

3.也可指定生成文件名：gcc -o [filename] Hello.cpp

  

五、文件管理

ls (-l) 【列写目录下文件名（详细信息）】

pwd 【显示当前路径】

  

六、用户管理（管理员才有权限）

useradd chen 【添加用户"chen"】

passwd chen【设置"chen"的密码（一定要跟用户名"chen"，否则，单单"passwd"修改的是管理员的密码）】

userdel chen  【删除用户"chen"】

userdel -r chen 【删除用户及用户主目录】

  

一、linux常用命令（1）

1.指定运行级别

命令：init [0123456]

0:关机

1：单用户

2：多用户状态没有网络服务

3：多用户、有网络

4：保留

5：图形界面

6：系统重启

3和5常最用，在/etc/inittab的id:5:initdefault:这行中的数字

systemctl set-default multi-user.target      设定默认为字符界面，也就是3  
systemctl set-default graphical.target        图形界面   5  

2.解决修改错误配置的方法

在进入grub时，输入e

移至第二行，再输入e

再最后输入1 [单用户级别]

  

pwd 显示当前工作目录

cd 更改目录

ls 列出文件或目录

ls -l 详细信息

-a 显示隐藏文件 

mkdir 新建目录

rmdir 删除空目录

touch 建立空文件

cp 复制

cp -r dir1 dir2 递归复制其目录中的所有内容

mv 移动文件和改文件名

  

rm 删除文件和目录

rm -rf 强制递归删除目录中的所有内容

  

ln 建立符号链接

more 显示文件内容，带分页

less 显示文件内容，带分页

grep -n "shunping" aaa.java  文本中查询内容（-n显示行数）

| 管道命令（把上一个命令的结果交给|后面的命令处理）

find / -name aaa.java 根目录下查找aaa.java

> [filename] 管道定向命令，将结果写入指定文件（覆盖写）

如：ls -l > aaa.txt

>> [filename] 功能同上，追加写入

<</div>

  

ls -ahl 查看文件所有组

chown 用户名 文件名 修改文件所有者

chgrp 组名 文件名 修改文件所在组

groupadd 组名 添加组

cat /etc/group 查看所有组，cat只能查看不能修改

vi /etc/group 可以修改

useradd -g 组名 用户名  创建用户，并分配到某组

vi/cat /etc/passwd 查看所有用户

who am i 查看当前用户

usermod -g 组名 用户名  修改用户所在组

usermod -d 目录 用户名  更改该用户登录的初始目录

  

-rw-r--r-- 

"-" 文件类型

“rw-” 文件所有者对该文件的权限

“r--” 文件所在组对该文件的权限

“r--” 其他组的用户对该文件的权限

r 可读（用4表示）

w 可写（用2表示）

x 可执行（用1表示）

  

修改文件访问权限

chmod 775 aa  
  
运行指令末尾加：&              后台运行  

