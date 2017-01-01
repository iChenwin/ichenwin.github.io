title: VMware虚拟机NAT设置
date: 2016-3-14 16:36:08
tag: [Linux,虚拟机,NAT]
category: [网络配置]
---
#### VMware虚拟机NAT模式设置
##### 1.1 查看虚拟机的网络参数
###### (1). 打开VMware，选择菜单“编辑” 》“虚拟网络编辑器”，如下图：
![](http://7i7io5.com1.z0.glb.clouddn.com/nat1.png)
<!--more-->
###### (2). 选中列表中的“VMnet8 NAT”，点击左下角“恢复默认”按钮，恢复默认参数设置。然后点击“NAT设置”按钮，如下图：
![](http://7i7io5.com1.z0.glb.clouddn.com/nat2.png)
###### (3). 记录虚拟网络的子网IP：`192.168.58.0`、网关IP：`192.168.58.2`
##### 1.2 设置物理主机的虚拟网络参数
###### (1). 打开物理主机的网络连接，找到“VMware Network Adapter VMnet8”，设置属性：
![物理机网络参数](http://7i7io5.com1.z0.glb.clouddn.com/nat3.png)
###### (2). 设置物理主机的虚拟网络IP地址：`192.168.58.X`，X在0~255之间，但不可与上面的虚拟网络的子网IP重复。子网掩码、默认网关与上面获取到的虚拟网络的子网掩码、网关保持一致。DNS可设成google的免费DNS：`8.8.8.8`和`8.8.4.4`或者阿里的DNS（`223.5.5.5`和`223.6.6.6`）。
##### 1.3 设置虚拟机CentOS的网络参数（su模式）
###### (1). 配置DNS ```vi /etc/resolv.conf```，也可以使用阿里的DNS（`223.5.5.5`和`223.6.6.6`）：
![CentOS DNS](http://7i7io5.com1.z0.glb.clouddn.com/nat%EF%BC%94.png)
###### (2). 配置网关 ```vi /etc/sysconfig/network```，加入`GATEWAY=192.168.58.2`：
![网关](http://7i7io5.com1.z0.glb.clouddn.com/nat%EF%BC%95.png)
###### (3). 配置ip地址 ```vi /etc/sysconfig/network-scripts/ifcfg-eth0```，设置`IPADDR`（IP地址：`192.168.58.X`，X在0~255之间，但不可与上面的虚拟网络的子网IP、物理机中VMnet8的IP重复）、子网掩码`NETMASK`、网关`GATEWAY`：
![IP、网关、子网掩码](http://7i7io5.com1.z0.glb.clouddn.com/nat%EF%BC%96.png)
###### (4). 重启网络服务 `service network restart`