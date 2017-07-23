title:  Python批处理删除和重命名文件夹 
date: 2016-12-11 23:11
tags: Python
category: 技术笔记
---

#  1\. 删除当前目录下不含有指定文件类型的文件夹

    
    
    #!/usr/bin/python
    # -*- coding: UTF-8 -*-
    
    import sys
    import os
<!--more-->    import shutil
    
    pwd = os.getcwd()
    L = os.listdir(".")
    f = open("out.txt", "w")
    for dirname in L:
        if os.path.isdir(dirname):
            print("dir name:" + dirname)
            os.chdir(dirname)
            files = os.listdir(".")
            filePreName = "filename"
            extName = "ext name"
            delete = True
            for filename in files:
                print filename
                print >> f, "%s" % filename
                filePreName, extName = os.path.splitext(filename)
                if extName.lower() == ".zip" or extName.lower() == ".jpg" or extName.lower() == ".doc" or extName.lower() == ".pdf" or extName.lower() == ".xls" or extName.lower() == ".gif" or extName.lower() == ".ppt" or extName.lower() == ".iso" or extName.lower() == ".mp3" or extName.lower() == ".wav" or extName.lower() == ".rar" or extName.lower() == ".mkv" or extName.lower() == ".mp4" or extName.lower() == ".bmp" or extName.lower() == ".exe" or extName.lower() == ".docx" or extName.lower() == ".png" or extName.lower() == ".txt":
                    delete = False
            os.chdir("..")
            if delete:
                shutil.rmtree(dirname)
                print dirname + " deleted!!!"
                print >> f, "%s" %  dirname + " deleted!!!"
            print "--------------------------"
            print >> f, "%s" % "--------------------------"
    f.close()

#  2\. 遍历目录下每个子文件夹，并列出子文件夹下的文件，默认删除含指定类型的文件夹，不包含指定文件类型的，则提示，是否删除或者重命名文件夹

    
    
    #!/usr/bin/python
    # -*- coding: UTF-8 -*-
    
    import sys
    import os
    import shutil
    
    pwd = os.getcwd()
    L = os.listdir(".")
    f = open("out.txt", "w")
    for dirname in L:
        if os.path.isdir(dirname):
            print("dir name:" + dirname)
            os.chdir(dirname)
            files = os.listdir(".")
            i = 0
            filePreName = "filename"
            extName = "ext name"
            for filename in files:
                print filename
                print >> f, "%s" % filename
                filePreName, extName = os.path.splitext(filename)
                if extName == ".java" or extName == ".js" or extName == ".yml" or extName == ".ejs" or extName == ".svg" or extName == ".sample" or extName == ".styl" or extName == ".class" or extName == ".xml" or extName == ".html" or extName == ".so" or extName == ".OPA" or extName == ".pig" or extName == ".obj" or extName == ".sdb" or extName == ".dll":
                    i += 1
            os.chdir("..")
            #整理杂乱的硬盘时，包含这些文件类型的无关文件夹直接删除
            if i >= 3 or filePreName == "HEAD" or filePreName == "master" or extName == "" or (filePreName == "index" and extName == ".html") or extName == ".java" or extName == ".pyc" or extName == ".py" or extName == ".html" or extName == ".HTM" or extName == ".ini" or extName == ".css" or extName == ".so" or extName == ".xml" or extName == ".bin":
                    shutil.rmtree(dirname)
                    print(dirname + " deleted!!!")
                    print "--------------------------"
                    continue
            deleteOrNot = raw_input("delete " + dirname + "?(y/n)")
            #除了无关文件夹，其余由“我”决定是删除还是直径重命名文件夹
            if deleteOrNot == 'y':
                shutil.rmtree(dirname)
                print dirname + " deleted!!!"
                print >> f, "%s" %  dirname + " deleted!!!"         
            else:
                if deleteOrNot == "":
                    print "no change" + dirname
                else:
                    os.rename(dirname, deleteOrNot)
            print "--------------------------"
            print >> f, "%s" % "--------------------------"
    f.close()

#  3\. 使用子文件夹中第一个文件的文件名作为该子文件夹的名字

    
    
    #!/usr/bin/python
    # -*- coding: UTF-8 -*-
    
    import sys
    import os
    import shutil
    import random
    
    pwd = os.getcwd()
    L = os.listdir(".")
    f = open("rename.txt", "w")
    for dirname in L:
        if os.path.isdir(dirname):
            os.chdir(dirname)
            files = os.listdir(".")
            filePreName = "filename"
            extName = "ext name"
            filename = files[0]
            filePreName, extName = os.path.splitext(filename)
            os.chdir("..")
            os.rename(dirname, filePreName + str(random.randint(1,999)))
            print dirname + "->" + filePreName  + str(random.randint(1,999))
            print >> f, "%s" %  dirname + "->" + filePreName + str(random.randint(1,999))
    f.close()

