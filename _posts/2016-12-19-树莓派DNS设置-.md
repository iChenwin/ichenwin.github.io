title:  树莓派DNS设置 
date: 2016-12-19 22:43
tags: 树莓派
category: 技术笔记
---

  
一早起来，发现花生壳掉线了， ` ping www.baidu.com ` 也得到 ` Unkonwn host ` 的报错。试着访问网关 ` ping
192.168.1.1 ` ，没问题。然后检查DNS配置，网上说配置 ` /etc/resolv.conf `
，然而发现配置这个文件，重启后，DNS会失效。  
DNS配置还是应该在 ` /etc/network/interfaces ` 里完成：

    
    
    auto lo wlan0 wlan1
<!--more-->    
    iface lo inet loopback
    
    auto eth0
    allow-hotplug eth0
    iface eth0 inet dhcp
    
    allow-hotplug wlan0 wlan1
    
    #iface wlan0 inet dhcp
    iface wlan0 inet static
    address 192.168.1.112
    netmask 255.255.255.0
    gateway 192.168.1.1
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
    
    iface wlan1 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
    
    #DNS配置
    dns-nameservers 8.8.8.8 223.5.5.5
    

