---
title: TenSquare
description: 十次方项目
comments: true
date: 2019-01-03 22:23:57
---

<img src="http://cdn3.img.sputniknews.cn/images/101711/57/1017115745.jpg" width="100%"/>

<!-- more -->

## 什么是微服务

### 架构

> [软件开发中对架构、构架、结构、框架的理解](https://www.cnblogs.com/mike-mei/p/7707915.html)

**架构 Architecture**

​    架构不是软件，而是关于软件如何设计的重要**策略**。软件架构决策涉及到如何将软件系统分解成不同的部分、各部分之间的静态结构关系和动态交互关系等。经过完整的开发过程之后，这些架构决策将体现在最终开发出的软件系统中。

​	软件架构是指构成一个软件系统核心（主体、基础）结构的**组成元素**，以及这些核心组成元素之间的相互依赖、交互、协作等**关系**。一个软件架构（模型）是**动静结合**的，既包含了核心元素之间的静态结构（static structural）关系，也包含了它们之间的动态行为（dynamic behavioral）关系。

**框架 Framework**

​	框架是半成品。典型地，框架是系统或子系统的半成品。

**小节**

​	框架技术和架构技术的出现，都是为了解决软件系统日益复杂所带来的困难而采取“分而治之”思维的结果-----先大局后局部，就出现了**架构**；先通用后专用，就出现了**框架**。

​	架构是问题的抽象解决方案，它关注大局而忽略细节；而框架是通用半成品，还必须根据具体需求进一步定制开发才能变成应用系统。

### 微服务

**微服务是一种架构风格**

微服务的目的是有效的拆分应用，实现敏捷开发和部署 。

把需要搭建成服务的功能制作成镜像，然后把镜像做成容器，微服务就是同类容器的集合。

spring cloud实现微服务之间的通信。

## UML

> [统一建模语言简介](https://www.ibm.com/developerworks/cn/rational/r-uml/)
>
> [UML建模的要点总结(一）](https://www.cnblogs.com/downmoon/archive/2009/02/18/1393047.html)
>
> [UML用例建模解析](https://alleniverson.gitbooks.io/java-design-patterns/content/Chapter%2030%20UML/UML%E5%BB%BA%E6%A8%A1%E6%8A%80%E6%9C%AF.html)
>
> [UML教程_w3cschool](https://www.w3cschool.cn/uml_tutorial/)

### 介绍

​	UML（Unified Modeling Language），也称**统一建模语言**或**标准建模语言**。是用来做软件建模的。用于表达软件的操作，对象等信息。

UML 是一种 Language（语言）
UML 是一种 Modeling（建模）Language
UML 是 Unified（统一）Modeling Language

### PowerDesigner

> [PowerDesigner - 维基百科，自由的百科全书](https://zh.wikipedia.org/zh-hans/PowerDesigner)

为传统的**软件开发周期管理**提供**业务分析**和规范的**数据库设计**解决方案。

## RESTful

> [理解RESTful架构](http://www.ruanyifeng.com/blog/2011/09/restful.html)
>
> [RESTful API 最佳实践](http://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html)
>
> [restcookbook.com](http://restcookbook.com/)

​	REST，即 Representational State Transfer 的缩写。阮大大对这个词组的翻译是"**表现层状态转化**"。

​	一种软件架构风格、设计风格，而**不是**标准，只是提供了一组设计原则和约束条件。它主要用于客户端和服务器交互类的软件。基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存等机制。

### 安全性和幂等性

> [HTTP方法的幂等性与安全性](https://icbd.github.io/wiki/notes/2018/01/16/http-safe-idempotent.html)

​	RestFul service 架构是基于 http 协议的。Http 有两个非常重要的特性，安全性和幂等性。

安全，幂等

安全性: 请求一次或多次, 不会改变实例的表现形式. 重点强调无副作用. 

幂等性: 请求一次或多次, 响应结果相同. 重点强调副作用的一致性.

增删改查，三个不安全，三个幂等

| Function | idempotent | safe | description        |
| -------- | ---------- | ---- | ------------------ |
| GET      | YES        | YES  | 获取实例           |
| HEAD     | YES        | YES  | 获取响应头         |
| OPTIONS  | YES        | YES  | 获取支持的请求方式 |
| TRACE    | YES        | YES  | 追踪查看最终的请求 |
| PUT      | YES        | NO   | 全量覆盖某个实例   |
| POST     | NO         | NO   | 创建新实例         |
| PATCH    | NO         | NO   | 修改实例的某些属性 |
| DELETE   | YES        | NO   | 删除某个实例       |

## Docker

### 命令

1. docker images
2. systemctl start docker
3. docker run -di --name=tensquare_mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root centos/mysql-57-centos7
4. docker ps -a

## 分布式ID生成器

Twitter 的 SnowFlake（雪花）算法。

> [snowflake](https://github.com/twitter-archive/snowflake)
>
> [Twitter-Snowflake，64位自增ID算法详解](https://www.lanindex.com/twitter-snowflake%EF%BC%8C64%E4%BD%8D%E8%87%AA%E5%A2%9Eid%E7%AE%97%E6%B3%95%E8%AF%A6%E8%A7%A3/)
>
> [Twitter Snowflake算法详解](https://blog.csdn.net/yangding_/article/details/52768906)





sql语句

in 最怕嵌套，嵌套后效率立马降低。所以一般都使用连接，而不适用子查询



select null+1  = null



service层没有加@Transactional jpa会报错：

Executing an update/delete query



jpa 原生sql 语句

```java
@Query(value = "SELECT * FROM tb_problem, tb_pl WHERE id = problemid AND labelid = ? AND reply = 0 ORDER BY createtime DESC", nativeQuery = true)
public List<Problem> waitlist(String labelid, Pageable pageable);
```



  jpa  @Modifying



### spring boot data redis

80% 都用的是 redisTemplate.opsForValue()



### Spring Cache

1. @EnableCaching
2. @Cacheable(value = "gathering", key = "#id")
3. @CacheEvict(value = "gathering", key = "#id")



需要过期时间使用redis，不需要过期时间使用spring cache



## 单点登录

并没有共享session，分布式的单点登录最流行的是JWT（GWT?），CAS也是一种，但是是有状态的（服务的要存储登录信息）

qq登录后，qq音乐等都默认也是登录的，这就是单点登录

## MongoDB

为大数据而生

非关系型数据库中最像关系型数据库的数据库

关系型数据库与非关系型数据库的区别：关系型数据库就是表与表之间有关系（1：1 ，（靠主外键）1：n，（靠主外键）n:n（靠中间表））。



数据库选型原因：



mongodb的客户端与服务器是二合一的。

默认端口是27017

逐渐名必须为 _id

emp表，树形结构

_id 一般都是手动指定，不要用自动生成。



## IDEA

ctrl + alt + v



Java原生操作mogodb

```java
public static void main(String[] args){
    // 连接服务器
    MongoClient client = new MongoClient("192.168.235.128");
    // 得到要操作的数据库
    MongoDatebase spitdb = client.getDatabase("spitdb");
    // 得到要操作的集合
    MongoCollection spit = spitdb.getCollection("spit");
    // 得到集合中所有的文档
    FindIterable<Document> documents = spit.find();
    // 遍历数据
    for(Document document:documents){
        System.out.println("内容："+document.getString("content"));
        System.out.println("用户ID："+document.getString("userid"));
        System.out.println("访问量："+document.getString("visits"));
    }
}
```



## 相关账号

### 虚拟机

账号：root

密码：itcast

### 数据库

账号：root

密码：root