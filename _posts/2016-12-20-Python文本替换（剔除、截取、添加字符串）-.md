title:  Python文本替换（剔除、截取、添加字符串） 
date: 2016-12-20 17:36
tags: Python
category: 技术笔记
---

  
1\. 删除字符串中的数字  
要将以下文件中的数字和描述删除，只留下单词，并且转存为Objective-C的数组格式，第一步，先将数字全部剔除：  
![这里写图片描述](http://img.blog.csdn.net/20161220171456040?watermark/2/text/aHR0cDo
vL2Jsb2cuY3Nkbi5uZXQvaWNoZW53aW4=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==
/dissolve/70/gravity/SouthEast)

    
    
<!--more-->    #!/usr/bin/python
    # -*- coding: UTF-8 -*-
    
    import re
    
    file = open("words.txt")
    output = open("out.txt", 'wb')
    
    for line in file.readlines():
        #删除字母、‘,’、‘()’、‘tab’以外的字符，即数字
        newline = filter(lambda ch: ch in ' abcdefghijklmnopqrstuvwxyz,() ', line)
        print newline
        output.write('@"' + newline + '\n')
    file.close()
    output.close()

处理完之后，得到一下文本文件：  
![这里写图片描述](http://img.blog.csdn.net/20161220171940529?watermark/2/text/aHR0cDo
vL2Jsb2cuY3Nkbi5uZXQvaWNoZW53aW4=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==
/dissolve/70/gravity/SouthEast)  
2\. 剔除单词后边所有字符串

    
    
    #!/usr/bin/python
    # -*- coding: UTF-8 -*-
    
    file = open("out.txt", 'r')
    output = open("dict.txt", "wb")
    
    for line in file.readlines():
        #查找单词后头的tab，记录偏移量
        pos = line.find("   ", 0)
        print line[0:pos] + '", '
        #将tab之前的字符串，加上引号、逗号和换行符，写入数出文件
        output.write(line[0:pos] + '", \n')
    file.close()
    out.close()

得到最终我们需要的 ` Objective-C ` 单词数组的文本形式：  
![这里写图片描述](http://img.blog.csdn.net/20161220172521874?watermark/2/text/aHR0cDo
vL2Jsb2cuY3Nkbi5uZXQvaWNoZW53aW4=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==
/dissolve/70/gravity/SouthEast)

