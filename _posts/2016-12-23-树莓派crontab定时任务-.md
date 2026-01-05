title:  树莓派crontab定时任务 
date: 2016-12-23 22:48
tags: 树莓派
category: 技术笔记
---

  
1\. crontab编辑命令： ` crontab -e `

    
    
    # min  hour  day month dayofweek           cmd
    */3   *     *    *       *       /usr/share/nginx/www/pi-pull.sh

（其中 ` */3 ` 表示每隔3分钟）  
<!--more-->2\. 树莓派中crontab命令： ` cron start/stop/restart/status `

