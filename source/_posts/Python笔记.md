title: Python笔记
date: 2015-04-10 14:07:25
tags: Python
category: 技术笔记
---

### 列表
1. BIF，即“Built-in Funcation”，内置函数，比如：
`len()`
`isinstance(movies,list)  #检查movies是否是列表`
2. 多行注释——使用三重引号
```python
"""这是一段python注释，
它可以写成多行。
 like this."""
```
<!--more-->
### 函数模块
3. PyPI(Pie-Pie)——Python Package Index
上传时需在模块目录下创建一文件setup.py，其内容如下：
```python
from distutils.core import setup
setup(
　　name        = 'cw-nester',
　　version     = '1.3.0',
　　py_modules  = ['cw-nester'],
　　author      = 'iChenwin',
　　author_email= 'ichenwin@gmail.com',
　　url         = 'http://ichenwin.github.io',
　　description = 'A simple printer of nested lists',
    )
```
生成模块命令，在模块所在目录下执行：
`D:\python27\python.exe setup.py sdist`
然后要上传到PyPI，第一次使用须填用户密码，命令如下：
`D:\python27\python.exe setup.py register`
最后上传：
`D:\python27\python.exe setup.py upload`
4. 导入模块/函数的方法：
1.`import module`，此方法使用函数是要带上模块名称：如：math.sqrt(4)
2.`from module import function`，此方法可直接调用函数名，但可能覆盖原有函数
5. 主命名空间是：`__main__`
BIF的命名空间是：`__builtins__`，一般会自动包含在Python程序
7. ‘`sys`’模块，其中的‘`stdout`’，“标准输出”，即显示到屏幕上，比如：
‘`print(*obj,sep='',end='\n',file=sys.stdout)`’
6. python2中要想让`print`不换行，可以这样(在末尾加逗号)：
`print '你要打印的字符',`
比如你要打印“1234”，可以这样：
```python
print '12',
print '34'
```
而在python3中，则可以这样实现：
```python
print('12',end='')
print('34')
```
### 异常
1. 异常处理：
```python
try:
  data = open('sketch.txt')
  ...
expect IOError:
  print 'The file is missing'
finally:
  data.close()
```
2. 文件操作BIF：
a. 打开文件，参数是文件路径的字符串：
`data = open('sketch.txt')`
可以用‘`with`’语句，从此无需手动‘`data.close()`’文件，用法：
```python
with open('sketch.txt','r') as myfile:
  myfile.readline()
```
　　其中第二个参数可以是：
　　读——‘`r`’，
　　覆盖写——‘`w`’，
　　追加——‘`a`’，
　　写和读（不清除）——‘`w+`’，
　　二进制读——‘`rb`’，
　　二进制写——‘`wb`’
b. 一次读取一行，光标自动移至下一行：
`data.readline()`
c. 方法，跳至文件某一行：
`data.seek(0)`
d. 关闭文件：
`data.close()`
e. 切割字符串方法，参数一切割标识符，可选参数二切割段数（填1，只认第一个切割符，切为两段）：
`each_line.split(':',1)`
f. 查找指定子字符串的方法，没找到则返回‘-1’，找到则返回所在索引：
`each_line.find(':')`
### 保存数据至文件
1. 保存到文件，print()的‘file'参数：
`print(each_line,file=filename)`
2. 导入`pickle`模块
a.“腌制”，将数据以特有的二进制格式保存到磁盘：
`pickle.dump()`
b.“解除研制”，从磁盘以二进制格式恢复数据：
`pickle.load()`
3. 除去字符串首尾不想要的空格：
`string.strip() `
4. 当前作用域内的变量集合：
`locals()`
用来检验文件是否正常打开：
`if data in locals():`
