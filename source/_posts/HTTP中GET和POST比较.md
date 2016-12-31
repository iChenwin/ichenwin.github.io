title: HTTP中GET和POST区别
date: 2016-4-11 21:36:08
tag: [HTTP，GET/POST]
category: [Web开发]
---
|  特性     |  GET  |   POST   |
| :--------: | :--------:| :------: |
| 后退按钮/刷新    |   无害 |  数据会被重新提交（浏览器应该告知用户数据会被重新提交）。  |
| 书签      |   可收藏为书签  |   不可收藏为书签   |
| 编码类型    |   application/x-www-form-urlencoded |  application/x-www-form-urlencoded 或 multipart/form-data。为二进制数据使用多重编码。  |
| 历史      |     参数保留在浏览器历史中。 |   参数不会保存在浏览器历史中。   |
| 对数据长度的限制    |   是的。当发送数据时，GET 方法向 URL 添加数据；URL 的长度是受限制的（URL 的最大长度是 2048 个字符）。 |  无限制。  |
| 对数据类型的限制      |     只允许 ASCII 字符。 |   没有限制。也允许二进制数据。   |
| 安全性    |   与 POST 相比，GET 的安全性较差，因为所发送的数据是 URL 的一部分.在发送密码或其他敏感信息时绝不要使用 GET ！ |  POST 比 GET 更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中。  |
|  可见性      |     数据在 URL 中对所有人都是可见的。 |   数据不会显示在 URL 中。   |
HTTP定义了与服务器交互的不同方法，最基本的方法有4种，分别是GET，POST，PUT，DELETE。
URL全称是资源描述符，我们可以这样认 为：一个URL地址，它用于描述一个网络上的资源，而HTTP中的GET，POST，PUT，DELETE就对应着对这个资源的查 ，改 ，增 ，删 4个操作。
GET一般用于获取/查询资源信息，而POST一般用于更新资源信息。
<!--more-->
##### 1.HTTP请求
```
HTTP请求一般格式：
<request line>
<headers>
<blank line>
[<request-body>]
```
```
GET方法实例：
GET /books/?sex=man&name=Professional HTTP/1.1
Host: www.wrox.com
User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
Gecko/20050225 Firefox/1.0.1
Connection: Keep-Alive
（----此处空一行，可略----）
（body，可略）
```
而对于POST，
```
POST方法实例：
POST / HTTP/1.1
Host: www.wrox.com
User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
Gecko/20050225 Firefox/1.0.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 40
Connection: Keep-Alive
     （----此处空一行----）
name=Professional%20Ajax&publisher=Wiley
```
###### (1). 提交过程比较
GET提交，请求的数据会附在URL之后（就是把数据放置在请求行（request line）中），以?分割URL和传输数据，多个参数用&连接；例如：login.action?name=hyddd&password=idontknow&verify=%E4%BD%A0 %E5%A5%BD。Url的编码格式采用的是ASCII码，而不是Unicode，这也就是说你不能在Url中包含任何非ASCII字符，所有非ASCII字符均需要编码再传输。
POST提交：把提交的数据放置在是HTTP包的包体中。
     因此，GET提交的数据会在地址栏中显示出来，而POST提交，地址栏不会改变。
###### (2). HTTP中get,post,soap比较
1).get：请求参数是作为一个key/value对的序列（查询字符串）附加到URL上的
        查询字符串的长度受到web浏览器和web服务器的限制（如IE最多支持2083个字符），不适合传输大型数据集同时，它很不安全
2).post：请求参数是在http标题的一个不同部分（名为entity body）传输的，这一部分用来传输表单信息，因此必须将Content-type设置为:application/x-www-form-urlencoded。post设计用来支持web窗体上的用户字段，其参数也是作为key/value对传输。
      但是：它不支持复杂数据类型，因为post没有定义传输数据结构的语义和规则。
3).soap：是http post的一个专用版本，遵循一种特殊的xml消息格式
       Content-type设置为: text/xml   任何数据都可以xml化
##### 2.HTTP响应格式：
```
<status line>
<headers>
<blank line>
[<response-body>]
```
```
HTTP响应实例：
HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8
Content-Length: length

<?xml version="1.0" encoding="utf-8"?>
<objPlaceOrderResponse xmlns="https://api.efxnow.com/webservices2.3">
<Success>boolean</Success>
<ErrorDescription>string</ErrorDescription>
<ErrorNumber>int</ErrorNumber>
<CustomerOrderReference>long</CustomerOrderReference>
<OrderConfirmation>string</OrderConfirmation>
<CustomerDealRef>string</CustomerDealRef>
</objPlaceOrderResponse>
```
最常用的状态码有：
◆200 (OK): 找到了该资源，并且一切正常。
◆304 (NOT MODIFIED): 该资源在上次请求之后没有任何修改。这通常用于浏览器的缓存机制。
◆401 (UNAUTHORIZED): 客户端无权访问该资源。这通常会使得浏览器要求用户输入用户名和密码，以登录到服务器。
◆403 (FORBIDDEN): 客户端未能获得授权。这通常是在401之后输入了不正确的用户名或密码。
◆404 (NOT FOUND): 在指定的位置不存在所申请的资源。

本文参考以下博文：[HTTP POST GET 本质区别详解](http://blog.csdn.net/gideal_wang/article/details/4316691)

