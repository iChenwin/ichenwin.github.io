title: JSON创建和解析的Java实现
date: 2016-4-14 20:36:08
tag: [JSON,Java]
category: [Web开发]
---
##### JSON概述
JSON即JavaScript Object Notation，是JavaScript对象表示法的子集。具有以下特点：
1. 数据放在键值对中；
2. 数据由逗号分隔；
3. 花括号表示对象；
4. 方括号表示数组。

JSON的值可以是：
1. 数字（整数或浮点数）
2. 字符串（在双引号中）
3. 逻辑值（true或false）
4. 数组（方括号内）
5. 对象（花括号内）
6. null

<!--more-->
##### JSON的基本语法
###### JSON对象
JSON对象在花括号中书写，对象可以包含多个键值对，例如：
```json
{
    "firstName":"John",
    "lastName":"Doe"
}
```
###### JSON数组
JSON数组在方括号中书写，数组中可以包含多个对象，例如：
```json
{
    "employees":[
        {"firstName":"John","lastName":"Doe"},
        {"firstName":"Anna","lastName":"Smith"},
        {"firstName":"Peter","lastName":"Jones"}
    ]
}
```
在以上的实例中，根部的花括号表示这是一个JSON对象，该对象的键是employees，值是一个JSON数组，在这个数组中有3个JSON对象，每个JSON对象之间也使用逗号分隔。
##### 使用Java读取JSON数据
在[JSON官网](http://json.org/)我们可以查看到各个语法对JSON的支持，对于Java来说比较成熟的是google-gson。

其maven依赖如下：
```java
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.2.4</version>
</dependency>
```
现在编写程序解析以下的test.json:
```json
{
    "cat":"it",
    "languages":[
        {"id":1,"ide":"Eclipse","name":"Java"},
        {"id":2,"ide":"Xcode","name":"Swift"},
        {"id":3,"ide":"Visual Studio","name":"C#"}
    ],
    "pop":true
}
```
##### 使用Java生成JSON数据
生成JSON数据的关键是JSON对象中的add和addProperty两个方法。前者用于向JSON对象中添加数组或者另一个JSON对象，后者用于为JSON对象添加属性。
以下的代码将生成上面例子中的test.json。
```java
public void createJSON() throws IOException{

    JsonObject object = new JsonObject();  // 创建一个JSON对象
    object.addProperty("cat", "it");       // 为JSON对象添加属性   

    JsonArray languages = new JsonArray(); // 创建JSON数组
    JsonObject language = new JsonObject();
    language.addProperty("id", 1);
    language.addProperty("ide", "Eclipse");
    language.addProperty("name", "java");
    languages.add(language);               // 将JSON对象添加到数组  

    language = new JsonObject();
    language.addProperty("id", 2);
    language.addProperty("ide", "XCode");
    language.addProperty("name", "Swift");
    languages.add(language);

    language = new JsonObject();
    language.addProperty("id", 3);
    language.addProperty("ide", "Visual Studio");
    language.addProperty("name", "C#");
    languages.add(language);

    object.add("languages", languages);   // 将数组添加到JSON对象   
    object.addProperty("pop", true);

    String jsonStr = object.toString();   // 将JSON对象转化成JSON字符串
    PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter("data.json")));
    pw.print(jsonStr);
    pw.flush();
    pw.close();
}
```
以下的代码将解析以上的JSON数据：
```java
public void readJSON() throws Exception{

    // 创建JSON解析器
    JsonParser parser = new JsonParser(); 
    // 使用解析器解析JSON数据，返回值是JsonElement，强制转化为其子类JsonObject类型
    JsonObject object =  (JsonObject) parser.parse(new FileReader("test.json"));

    // 使用JsonObject的get(String memeberName)方法返回JsonElement，再使用JsonElement的getAsXXX方法得到真实类型
    System.out.println("cat = " + object.get("cat").getAsString());

    // 遍历JSON数组
    JsonArray languages = object.getAsJsonArray("languages");
    for (JsonElement jsonElement : languages) {
        JsonObject language = jsonElement.getAsJsonObject();
        System.out.println("id = " + language.get("id").getAsInt() + ",ide = " + language.get("ide").getAsString() + ",name = " + language.get("name").getAsString());
    }

    System.out.println("pop = " + object.get("pop").getAsString());
}
```


转自：[segmentfault](https://segmentfault.com/a/1190000003089746)