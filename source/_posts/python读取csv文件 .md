title:  python读取csv文件 
date: 2017-04-18 13:55
tags: Python
category: 技术笔记
---

读取 ` .csv ` 文件，获取Email地址，用逗号串联，存入文本文件。最后统计取得的Email个数：

    
    
    #!/usr/bin/env python
    # -*- coding: utf-8 -*-
    import csv
    
    output = open('out.txt', 'wb')
<!--more-->    with open('contact.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        for row in spamreader:
            for item in row:
                output.write(item + ',')
    output.close()
    
    result = open('out.txt', 'rb')
    data = result.read()
    print data.count('@')
    out.close()

