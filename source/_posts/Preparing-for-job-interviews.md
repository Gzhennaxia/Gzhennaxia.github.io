---
title: Preparing for job interviews
description: 面试准备资料
date: 2019-03-06 16:55:09
top: true
---

<img src="https://www.insperity.com/wp-content/uploads/stay_interview_questions_640x302.jpg" width="100%"/>

<!-- more -->

## 数据类型

1. int 和 Integer 的区别

   > [java面试题之int和Integer的区别](https://www.cnblogs.com/guodongdidi/p/6953217.html)

   - Integer是int的包装类，int则是java的一种基本数据类型 

   - Integer变量必须实例化后才能使用，而int变量不需要 

   - Integer实际是对象的引用，当new一个Integer时，实际上是生成一个指针指向此对象；而int则是直接存储数据值 

   - Integer 的默认值是 null，int 的默认值是 0

   - 由于Integer变量实际上是对一个Integer对象的引用，所以两个通过new生成的Integer变量永远是不相等的（因为new生成的是两个对象，其内存地址不同）。

   - Integer变量和int变量比较时，只要两个变量的值是向等的，则结果为true（因为包装类Integer和基本数据类型int比较时，java会自动拆包装为int，然后进行比较，实际上就变为两个int变量的比较）

   - 非new生成的Integer变量和new Integer()生成的变量比较时，结果为false。（因为非new生成的Integer变量指向的是java常量池中的对象，而new Integer()生成的变量指向堆中新建的对象，两者在内存中的地址不同）

     ```java
     Integer i = new Integer(100);
     Integer j = 100;
     System.out.print(i == j); //false
     ```

   - 对于两个非new生成的Integer对象，进行比较时，如果两个变量的值在区间-128到127之间，则比较结果为true，如果两个变量的值不在此区间，则比较结果为false

     ```
     Integer i = 100;
     Integer j = 100;
     System.out.print(i == j); //true
     Integer i = 128;
     Integer j = 128;
     System.out.print(i == j); //false
     ```

     对于第4条的原因： 
     **java在编译Integer i = 100 ;时，会翻译成为Integer i = Integer.valueOf(100)；这就是自动装箱**，而java API中对Integer类型的valueOf的定义如下：

     ```
     public static Integer valueOf(int i){
         assert IntegerCache.high >= 127;
         if (i >= IntegerCache.low && i <= IntegerCache.high){
             return IntegerCache.cache[i + (-IntegerCache.low)];
         }
         return new Integer(i);
     }
     ```

     **java对于-128到127之间的数，会进行缓存，Integer i = 127时，会将127进行缓存，下次再写Integer j = 127时，就会直接从缓存中取，就不会new了**，简要的说就是在Integer类中有一个静态内部类IntegerCache，在IntegerCache类中有一个Integer数组，用以缓存当数值范围为-128~127时的Integer对象。

   - 简单来讲：自动装箱就是`Integer.valueOf(int i);`自动拆箱就是` i.intValue();`

   - 在java中包装类，比较多的用途是用在于各种数据类型的转化中。

2. byte

   两个byte类型相加，结果是int，也就是需要使用int接收。

## 接口

### 接口设计规范

1. 字段类型统一使用 String 类型，参数和返回值都使用 String 类型。Boolean类型一律使用1/0来表示。

   使用此接口的用户，对方可能是Java，也可能是VB6，也可能是C#，不要使用某种编程语言的特定类型，比较好的一种方式是，参数和返回值都使用string类型，这样基本上的编程语言都能支持。

2. 响应数据统一格式：code、msg、data。

3. 接口路径中需要加入版本号信息（使用 v1、v2 依次递推）

4. 分页数据中必须包含：

   recordCount: 当前页记录数
   totalCount: 总记录数
   pageNo: 当前页码
   pageSize: 每页大小
   totalPage: 总页数

### 支付接口的设计

> [支付网关的设计](https://www.cnblogs.com/vianzhang/p/7603184.html)
>
> [聚合支付系统设计](https://blog.csdn.net/think2017/article/details/79820786)

聚合支付平台的核心，就是怎么合理的去管理接入的各种支付SDK，从官网下载的 SDK，不做任何逻辑修改，就直接放到项目的目录中使用，这样做虽然开发成本很低，但弊端颇多：

1. 首先要说的就是不易维护，各支付SDK代码结构、风格不一样，后期维护成本高；
2. 代码各自为政，没有统一的调用方法；
3. 配置分散，无法集中维护系统配置项；
4. 无法提供统一有效的日志数据等

因此，首先定义一个Interface，然后每次接入新的支付方式的过程，其实就是实现该Interface的过程。

通常情况下，一种支付方式有一个class来实现，但面对一种支付方式提供了多种支付场景，比如微信（提供了公众号支付、APP支付、扫码支付、H5支付、小程序支付、微信免密代扣等）、中国银联（提供了PC网关支付、WAP支付、APP支付、银联云闪付等），建议针对每种不同的支付场景，都有单独的class来实现，理由如下：

- 不同的支付场景，程序执行的流程也不一样，比如中国银联PC网关支付，是需要将支付报文通过客户端浏览器表单POST给银联支付网关，跳转至银联支付网页进行支付，而银联APP支付则是通过curl将支付报文提交给银联支付网关，再将其返回的tn码返回给商户APP，商户APP凭该tn码发起支付交易；
- 对订单系统的订单支付方式展示更加准确，分配给商户不同购物平台（PC端、H5端、APP）的支付方式id是唯一的。如果商户系统不同支付场景所申请的商户号不一样，则需要在推送至财务系统的支付方式也不能重复，否则无法对账；
- 支付类的代码逻辑只关注于自身的支付逻辑处理，不引入额外的判断流程。

那么这时候就有一个很头疼的问题，代码冗余。大部分第三方支付，虽然提供了不同支付场景，但基础接口都是一样的，只是部分参数不同，或支付流程上面的少许差别。这时候就要考虑好以第三方支付平台为单位来封装一个支付抽象类，实现对第三方支付平台的所有api对接，不涉及到商户系统的业务流程，比如微信支付，创建一个WechatDriver抽象类

有了支付抽象类，针对每一种支付方法，都可以继承该抽象类，并拥有自己的独立的支付流程，比如：微信app支付，可以创建一个 WechatAppDriver 支付子类，支付子类调用抽象类提供的各种底层api，来实现支付、查询、退款等功能。

支付Interface、支付抽象类、支付子类三种支付类，它们之间的关系如下：

![](https://img-blog.csdn.net/20180404181515932)

对上图做简要说明，PaymentHandlerInterface是所有支付类的接口，WechatPayment是所有微信支付类的基类，WechatAPPPayment、WechatJSAPIPayment、WechatNativePayment都是提供支付服务的支付类，都需要继承WechatPayment并实现PaymentHandlerInterface接口。同理，系统如果需要接入银联在线支付，那么就需要按照开发文档实现一个ChinaPayPayment做为银联在线支付的基类，然后分别开发出具体支付场景的支付类，比如ChinaPayAPPPayment(银联app支付)、ChinaPayWAPPayment(银联wap支付)、ChinaPayPCPayment(银联pc支付)，这三个支付类需要继承ChinaPayPayment并实现PaymentHandlerInterface接口。





## 数据库

### 数据库设计

#### 无限级数据库设计

> [mysql（多级分销）无限极数据库设计方法](https://www.phpbloger.com/index.php/article/50.html)
>
> [数据库表设计-邻接表、路径枚举、嵌套集、闭包表](http://www.php.cn/mysql-tutorials-369214.html)

##### 采用**邻接表**的设计方式

```sql
create table user(
    id int primary key auto_increment COMMENT '自增ID',
    parentid int COMMENT '父节点ID',
    username varchar(20) COMMENT '用户名',
    password varchar(20) COMMENT '密码'
    ……
);
```

- 查询一个节点的所有后代

  方式一：定义 SQL 函数递归查询

  > [MySQL递归查询树状表的子节点、父节点](https://www.cnblogs.com/franson-2016/p/6873233.html)

  ```sql
  CREATE FUNCTION `getChildList`(rootId INT)
  RETURNS VARCHAR(1000)
  BEGIN
    DECLARE idList VARCHAR(1000);
    DECLARE idTemp VARCHAR(1000);
    SET idTemp = CAST(rootId AS CHAR);
    WHILE idTemp IS NOT NULL DO
  	IF (idList IS NOT NULL) THEN
  	  SET idList = CONCAT(idList,',',idTemp);
  	ELSE
  	  SET idList = CONCAT(idTemp);
  	END IF;
  	SELECT GROUP_CONCAT(id) INTO idTemp FROM `user` WHERE FIND_IN_SET(parentid,idTemp)>0;
    END WHILE;
    RETURN idList;
  END;
  ```

  注意：

  > [mysql之使用find_in_set和group_concat组合递归函数时数据不全](https://blog.csdn.net/dream_broken/article/details/69554303)

  group_concat 是有长度限制的，超过限制时会导致数据不全。

  方式二：使用共用表表达式递归查询（8.0 的版本才支持 WITH）

  > [WITH语法（公用表表达式）](https://dev.mysql.com/doc/refman/8.0/en/with.html)

  ```sql
  WITH RECURSIVE cte(id, parentid, username, `level`) AS (
      SELECT id, parentid, username, 0 AS `level` FROM `user` WHERE parentid = 4
      UNION ALL
      SELECT u.id, u.parentid, u.username, ce.`level` + 1 FROM `user` AS u 
      INNER JOIN cte AS ce
      ON u.parentid = ce.id
  )SELECT * FROM cte；
  ```

- 查询一个节点的祖先节点

  方式一：定义 SQL 函数递归查询

  ```sql
  CREATE FUNCTION `getParentList`(rootId INT)
  	RETURNS varchar(1000)
  	BEGIN
  		DECLARE idList varchar(1000);
  		DECLARE idTemp varchar(1000);
  		SET idTemp = CAST(rootId as CHAR);
  		WHILE idTemp is not null DO
  			IF (idList is not null) THEN
  				SET idList = concat(idTemp,',',idList);
  			ELSE
  				SET idList = concat(idTemp);
  			END IF;
  			SELECT group_concat(parentid) INTO idTemp FROM user_role where FIND_IN_SET(id,idTemp)>0;
  		END WHILE;
  	  RETURN idList;
  	END;
  ```

  方式二：使用共用表表达式递归查询（8.0 的版本才支持 WITH）

  > [WITH语法（公用表表达式）](https://dev.mysql.com/doc/refman/8.0/en/with.html)

  ```sql
  WITH RECURSIVE RECURSIVE cte(id, parentid, username, `level`) AS (
      SELECT id, parentid, username, 0 AS `level` FROM `user` WHERE id = 6
      UNION ALL
      SELECT u.id, u.parentid, u.username, ce.`level` - 1  FROM `user` AS u 
      INNER JOIN COMMENT_CTE AS ce　　
  	ON ce.parentid = u.id where ce.id <> ce.parentid
  )SELECT * FROM cte;
  ```


##### 路径枚举

路径枚举是一个由连续的直接层级关系组成的完整路径。如"1/4/7",其中 1 是 4 的直接父亲，这也就意味着 1 是 7 的祖先。

```sql
create table user(
    id int primary key auto_increment COMMENT '自增ID',
    path int COMMENT '节点路径',
    username varchar(20) COMMENT '用户名',
    password varchar(20) COMMENT '密码'
    ……
);
```

- 查询一个节点的所有后代

  ```sql
  SELECT * FROM `user` AS u WHERE u.path LIKE '1/%';
  ```

- 查询一个节点的祖先节点

  ```sql
  SELECT * FROM `user` AS u WHERE '1/3/5/7/' LIKE u.path + '%';
  ```

**路径枚举的缺点:**

　　1、数据库不能确保路径的格式总是正确或者路径中的节点确实存在(中间节点被删除的情况，没外键约束)。

　　2、要依赖高级程序来维护路径中的字符串，并且验证字符串的正确性的开销很大。

　　3、VARCHAR的长度很难确定。无论VARCHAR的长度设为多大，都存在不能够无限扩展的情况。

**路径枚举的优点:**

​	1、 查询父子节点的 SQL 语句简单

​	2、 能够很方便地根据节点的层级排序，因为通过比较字符串长度就能知道层级的深浅

##### 嵌套集

嵌套集解决方案是存储子孙节点的信息，而不是节点的直接祖先。我们使用两个数字来编码每个节点，表示这个信息。可以将这两个数字称为nsleft和nsright。这些数字和 当前节点的主键ID 的值并没有任何关联。

nsleft值的确定：nsleft 的数值小于该节点所有后代的nsleft和nsright。

nsright值的确定：nsright 的值大于该节点所有后代的nsleft和nsright。

也就是当前节点的（nsleft，nsright）要包含其所有子孙节点的（nsleft，nsright）

确定值的方式是对树进行一次深度优先遍历，在逐层深入的过程中依次递增地分配nsleft的值，并在返回时依次递增地分配nsright的值。

- 查询一个节点的所有后代

  ```mysql
  SELECT u2.* FROM `user` AS u1 JOIN `user` AS u2 ON u2.neleft BETWEEN u1.nsleft AND u1.nsright WHERE u1.id = 1;
  ```

- 查询一个节点的祖先节点

  ```mysql
  SELECT u2.* FROM `user` AS u1 JOIN `user` AS u2 ON u1.nsleft BETWEEN u2.nsleft AND u2.nsright WHERE u1.id = 7;
  ```

**嵌套集的优点:**

​	1、 查询父子节点的 SQL 语句简单

​	2、 当删除一个节点造成数值不连续时，并不会对树的结构产生任何影响。

**嵌套集的缺点:**

　　1、插入操作比较麻烦

##### 闭包表

闭包表是解决分层存储一个简单而又优雅的解决方案，它记录了表中所有的节点关系，并不仅仅是直接的父子关系。在闭包表的设计中，额外创建了一张tree_paths的表(空间换取时间)，它包含祖先，后代两列。

可以优化闭包表来使它更方便地查询直接父亲节点或者子节点： 在 tree_paths 表中添加一个 path_length 字段。一个节点的自我引用的path_length 为0，到它直接子节点的path_length 为1，再下一层为2，以此类推。

```mysql
create table tree_paths (
	ancestor    int COMMENT '祖先ID',
　　descendant int COMMENT '后代ID',
	path_length int COMMENT '代际层数'
    ……
);
```

- 查询一个节点的所有后代

  ```mysql
  SELECT u.* FROM `user` AS u INNER JOIN tree_paths t on c.id = t.descendant WHERE t.ancestor = 4;
  ```

- 查询一个节点的祖先节点

  ```mysql
  SELECT u.* FROM `user` AS u INNER JOIN tree_paths t on c.id = t.ancestor WHERE t.descendant = 4;
  ```

- 插入新节点

  要插入一个新的叶子节点，比如 6 的一个子节点，应首先插入一条自己到自己的关系，然后搜索 tree_paths 表中后代是 6 的节点，增加这些节点和新插入节点的“祖先一后代”关系（假设新节点 ID 为8）。

  ```mysql
  INSERT INTO tree_paths (ancestor, descendant) SELECT t.ancestor, 8 FROM tree_paths AS t WHERE t.descendant = 6 UNION ALL SELECT 8, 8;
  ```

  要删除一颗完整的子树，比如 4 和它所有的后代，可删除所有在 tree_paths 表中后代为 4 的行，以及那些以4 的后代为后代的行。

##### 总结

| 设计     | 表数量 | 查询子 | 查询树 | 插入 | 删除 | 引用完整性 |
| -------- | ------ | ------ | ------ | ---- | ---- | ---------- |
| 邻接表   | 1      | 简单   | 简单   | 简单 | 简单 | 是         |
| 枚举路径 | 1      | 简单   | 简单   | 简单 | 简单 | 否         |
| 嵌套集   | 1      | 困难   | 简单   | 困难 | 困难 | 否         |
| 闭包表   | 2      | 简单   | 简单   | 简单 | 简单 | 是         |

　　1、邻接表是最方便的设计，并且很多软件开发者都了解它。并且在递归查询的帮助下，使得邻接表的查询更加高效。

　　2、枚举路径能够很直观地展示出祖先到后代之间的路径，但由于不能确保引用完整性，使得这个设计比较脆弱。枚举路径也使得数据的存储变得冗余。

　　3、嵌套集是一个聪明的解决方案，但不能确保引用完整性，并且只能使用于查询性能要求较高，而其他要求一般的场合使用它。

　　4、闭包表是最通用的设计，并且最灵活，易扩展，并且一个节点能属于多棵树，能减少冗余的计算时间。但它要求一张额外的表来存储关系，是一个空间换取时间的方案。

### MySQL中派生表、临时表、公共表、子查询的区别

1. 公用表表达式CTE(Common Table Expression)是一个命名的临时结果集，仅在单个SQL语句(例如SELECT，INSERT，UPDATE或DELETE)的执行范围内存在。

   ```sql
   WITH customers_in_usa AS (
       SELECT 
           customerName, state
       FROM
           customers
       WHERE
           country = 'USA'
   ) SELECT 
       customerName
    FROM
       customers_in_usa
    WHERE
       state = 'CA';
   ```

2. 派生表是从SELECT语句返回的虚拟表。与子查询不同，派生表必须具有别名，以便稍后在查询中引用其名称。

   ```sql
   SELECT 
       customerName
   FROM
       (SELECT 
           customerName, state
       FROM
           user
   	WHERE country = 'USA') customers_in_usa
   WHERE state = 'CA';
   ```

3. 临时表是一种特殊类型的表，它允许您存储一个临时结果集，可以在单个会话中多次重用。

   ```sql
   CREATE TEMPORARY TABLE customers_in_usa
   SELECT 
   	customerName, state
   FROM
   	user
   WHERE country = 'USA';
   
   DROP TEMPORARY TABLE customers_in_usa;
   ```

4. 子查询是嵌套在另一个查询(如SELECT，INSERT，UPDATE或DELETE)中的查询。

   ```sql
   SELECT 
       customerName
   FROM
   	customers
   WHERE state = 'CA' AND id IN (
   SELECT 
   	id
   FROM
   	customers
   WHERE country = 'USA');
   ```


### 事务

1. 什么是事务

   **事务是**数据库中的**一个**单独的**执行单元**。是指作为单个逻辑工作单元执行的一系列操作，要么完全地执行，要么完全地不执行。

2. 事务的四大特性 ACID

   - **原子性（Atomicity）**

     原子性是指**事务是一个不可分割的工作单位**，事务中的操作要么都发生，要么都不发生。

   - **一致性（Consistency）**

     > [怎么理解数据库事务的一致性](https://blog.csdn.net/qq_37997523/article/details/83188003)

     事务执行前后，数据库系统保持一致性状态。即系统从一个一致的状态转换到另一个一致状态。

     一致性是指**数据处于一种语义上的有意义且正确的状态**。一致性是对数据**可见性**的约束，保证在一个事务中的多次操作的数据中间状态对其他事务是不可见的。

     原子性和一致性的的侧重点不同：**原子性关注状态**，要么全部成功，要么全部失败，不存在部分成功的状态。而一致性**关注数据的可见性**，中间状态的数据对外部不可见，只有最初状态和最终状态的数据对外可见。

     在未提交读的隔离级别下，会造成脏读，这就是因为一个事务读到了另一个事务操作内部的数据。ACID中的一致性描述的是一个最理想的事务应该是怎样的，是一个强一致性状态，如果要做到这点，需要使用排它锁把事务排成一队，即 Serializable 的隔离级别，这样性能就大大降低了。现实是骨感的，所以使用不同隔离级别来破坏一致性，以获取更好的性能。

   - **隔离性（Isolation）**

     多个事务并发访问时，事务之间是隔离的，一个事务不影响其它事务的执行。

   - **持久性（Durability）**

     事务一旦提交，对数据库数据的修改便是永久性的。即使系统或介质发生故障时，其修改也将持久化保存在数据库中。

3. 事务的并发问题

   > [MySQL高并发事务问题及解决方案](https://segmentfault.com/a/1190000012626590)

   1. **赃读**（Dirty Read）

      一个事务读取到了另外一个事务没有提交的数据。

   2. **不可重复读**（Nonrepeatable Read）

      在同一事务中，两次读取同一数据，得到不同内容。

   3. **幻读**（Phantom Read）

      同一事务中，用同样的操作读取两次，得到的记录数不相同。

   4. **丢失更新**（Lost Update）

      1. 第一类丢失更新: A事务撤销时, 把已经提交的B事务的更新数据覆盖了。
      2. 第二类丢失更新: A事务覆盖B事务已经提交的数据，造成B事务所做跟新丢失。

   [不可重复读与幻读的区别](https://segmentfault.com/a/1190000012669504)：

   - 不可重复读主要是说多次读取一条记录, 发现该记录中某些列值被修改过。

   - 幻读主要是说多次读取一个范围内的记录(包括直接查询所有记录结果或者做聚合统计), 发现结果不一致(标准档案一般指记录增多, 记录的减少应该也算是幻读)。(可以参考[MySQL官方文档对 Phantom Rows 的介绍](https://dev.mysql.com/doc/refman/5.7/en/innodb-next-key-locking.html))

4. 事务的隔离级别

   > [数据库并发事务中的问题与解决方案](https://blog.csdn.net/u012739535/article/details/76855728)
   >
   > [数据库并发事务详解](https://blog.csdn.net/qq_21993785/article/details/81077318)

   1. READ_UNCOMMITTED**（读未提交）**

      - 读事务不阻塞其他读事务和写事务，未提交的写事务阻塞其他写事务但不阻塞读事务。

      - 可以防止更新丢失，但不能防止脏读、不可重复读、幻读。
      - 可以通过“排他写锁”实现。

   2. READ_COMMITTED **（读已提交）**

      - 读事务不阻塞其他读事务和写事务，未提交的写事务阻塞其他读事务和写事务。
      - 可以防止更新丢失、脏读，但不能防止不可重复读、幻读。
      - 可以通过“瞬间共享读锁”和“排他写锁”实现。

   3. REPEATABLE_READ**（可重复读）**

      - 以操作同一行数据为前提，读事务阻塞其他写事务但不阻塞读事务，未提交的写事务阻塞其他读事务和写事务。
      - 可以防止更新丢失、脏读、不可重复读，但不能防止幻读。
      - 可以通过“共享读锁”和“排他写锁”实现。

   4. SERIALIZABLE**（可序列化）**

      - 事务序列化执行，只能一个接着一个地执行，不能并发执行。
      - 可以防止更新丢失、脏读、不可重复读、幻读。
      - 如果仅仅通过“行级锁”是无法实现事务序列化的，需使用“表级锁”。

   | 事务隔离级别 | 回滚覆盖 | 脏读     | 不可重复读 | 提交覆盖 | 幻读     |
   | ------------ | -------- | -------- | ---------- | -------- | -------- |
   | 读未提交     | x        | 可能发生 | 可能发生   | 可能发生 | 可能发生 |
   | 读已提交     | x        | x        | 可能发生   | 可能发生 | 可能发生 |
   | 可重复读     | x        | x        | x          | x        | 可能发生 |
   | 串行化       | x        | x        | x          | x        | x        |

   隔离级别越高，越能保证数据的完整性和一致性，但是对并发性能的影响也越大。对于多数应用程序，可以优先考虑把数据库系统的隔离级别设为Read Committed。它能够避免脏读，而且具有较好的并发性能。尽管它会导致不可重复读、幻读和第二类丢失更新这些并发问题，在可能出现这类问题的个别场合，可以由应用程序采用悲观锁或乐观锁来控制。

   大多数数据库的默认级别就是Read committed，比如Sql Server , Oracle。

   MySQL 默认的事务隔离级别为 REPEATABLE_READ

### 数据库的锁机制

> [MySqL 事务与锁的深入学习笔记](https://blog.csdn.net/canot/article/details/53815294)

**分类**

按锁类型划分，可分为共享锁、排他锁
按锁的粒度划分，可分为表级锁、行级锁、页级锁
按使用机制划分，可分为乐观锁、悲观锁

**共享锁与排他锁**

共享锁（Shared locks, S-locks）
也叫读锁、S锁。在没有检测到排他锁时才可以加共享锁，其他事务可以并发读取该数据，但任何事务都不能对数据进行修改（获取数据上的排他锁），直到已释放所有共享锁。
用法：`SELECT ... LOCK IN SHARE MODE;`

排他锁（Exclusive locks, X-locks）
也叫写锁、X锁。在没有加任何锁时才可以加排他锁，加上排他锁后，其他事务不能再加任何类型的锁，直到已释放该排他锁。
用法：`SELECT ... FOR UPDATE;`

InnoDB还有两个表锁：
意向共享锁（IS）：表示事务准备给数据行加入共享锁，也就是说一个数据行加共享锁前必须先取得该表的IS锁。
意向排他锁（IX）：表示事务准备给数据行加入排他锁，事务在一个数据行加排他锁前必须先取得该表的IX锁。
意向锁是InnoDB自动加的，不需要用户干预。

**级锁、行级锁、页级锁**   

表级锁：直接锁定整张表，在锁定期间，其他进程无法对该表进行写操作。如果你是写锁，则其他进程读也不允许。特点是：开销小、加锁快，不会出现死锁。锁定粒度最大，发生锁冲突的概率最高，并发度最低。
MYISAM存储引擎采用的就是表级锁。

行级锁：仅对指定的记录进行加锁，这样其他进程还是可以对同一个表中的其他记录进行操作。特点：开销大，加锁慢，会出现死锁。锁定的粒度最小，发生锁冲突的概率最低，并发度也最高。
InnoDB存储引擎既支持行级锁，也支持表级锁，但默认情况下是采用行级锁。

页级锁：一次锁定相邻的一组记录。开销和加锁时间介于表级锁和行级锁之间；会出现死锁；锁定粒度也介于表级锁和行级锁之间，并发度一般。

**乐观锁、悲观锁**

无论是悲观锁还是乐观锁，都是人们定义出来的概念，可以认为是一种思想。不要把乐观并发控制和悲观并发控制狭义的理解为DBMS中的概念，更不要把他们和数据中提供的锁机制（行锁、表锁、排他锁、共享锁）混为一谈。其实，在DBMS中，悲观锁正是利用数据库本身提供的锁机制来实现的。

悲观并发控制（又名“悲观锁”，Pessimistic Concurrency Control，缩写“PCC”）是一种并发控制的方法。锁如其名，它指的是对数据被外界修改持悲观态度，即假定当前事务操纵数据资源时，肯定还会有其他事务同时访问该数据资源。因此，为了避免当前事务的操作受到干扰，先锁定资源。悲观锁需使用数据库的锁机制实现，如使用行级排他锁或表级排它锁。

悲观并发控制实际上是“先取锁再访问”的保守策略，为数据处理的安全提供了保证。但是在效率方面，处理加锁的机制会让数据库产生额外的开销，增加产生死锁的机会；另外，在只读型事务处理中由于不会产生冲突，也没必要使用锁，这样做只能增加系统负载；还会降低了并行性。

乐观并发控制（又名“乐观锁”，Optimistic Concurrency Control，缩写“OCC”）是一种并发控制的方法。它对数据被外界修改持乐观态度，即假定当前事务操纵数据资源时，不会有其他事务同时访问该数据资源，因此不在数据库层次上锁定，乐观锁使用由程序逻辑控制的技术来避免可能出现的并发问题。

乐观锁的实现方式有两种，第一种是使用版本号，第二种是使用时间戳。

基于**数据版本记录机制**的实现：即每行数据多一个版本字段，当读取数据时，将版本标识的值一同读出，数据每更新一次，同时对版本标识进行更新。当我们提交更新的时候，将数据库表对应记录的当前版本信息与第一次取出来的版本标识进行比对，如果数据库表当前版本号与第一次取出来的版本标识值相等，则予以更新，否则认为是过期数据。 

使用时间戳的实现：依然是为每条数据增加一个时间戳字段，在更新提交的时候，将当前数据库中数据的时间戳与第一次读取的时间戳进行比对，如果一致则更新，否则认为是过期数据。

乐观锁不能解决脏读的问题，因此仍需要数据库至少启用“读已提交”的事务隔离级别。

#### MVCC

MySQL InnoDB存储引擎，实现的是基于**多版本的并发控制协议**——MVCC (Multi-Version Concurrency Control) (注：与MVCC相对的，是基于锁的并发控制，Lock-Based Concurrency Control)。MVCC最大的好处，相信也是耳熟能详：读不加锁，读写不冲突。在读多写少的应用中，读写不冲突是非常重要的，极大的增加了系统的并发性能，这也是为什么现阶段，几乎所有的RDBMS，都支持了MVCC。

在MVCC并发控制中，读操作可以分成两类：快照读 (snapshot read)与当前读 (current read)。快照读，读取的是记录的可见版本 (有可能是历史版本)，不用加锁。当前读，读取的是记录的最新版本，并且，当前读返回的记录，都会加上锁，保证其他事务不会再并发修改这条记录。

在一个支持MVCC并发控制的系统中，哪些读操作是快照读？哪些操作又是当前读呢？以MySQL InnoDB为例：

快照读：简单的select操作，属于快照读，不加锁。

`select * from table where ?;`

当前读：特殊的读操作，插入/更新/删除操作，属于当前读，需要加锁。

```mysql
select * from table where ? lock in share mode;
select * from table where ? for update;
insert into table values (…);
update table set ? where ?;
delete from table where ?;
```

除了第一条语句，对读取记录加S锁 (共享锁)外，其他的操作，都加的是X锁 (排它锁)。

#### 三级加锁协议、两段锁协议

> [数据库并发事务中的问题与解决方案](https://blog.csdn.net/u012739535/article/details/76855728)

三级加锁协议也称为三级封锁协议，是为了保证正确的调度事务的并发操作，事务在对数据库对象加锁、解锁时必须遵守的一种规则。在运用X锁和S锁对数据对象加锁时，还需要约定一些规则 ，例如何时申请X锁或S锁、持锁时间、何时释放等。称这些规则为封锁协议（Locking Protocol）。对封锁方式规定不同的规则，就形成了各种不同的封锁协议。

**一级封锁协议**
事务T在修改数据R之前必须先对其加X锁，直到事务结束才释放。事务结束包括正常结束（COMMIT）和非正常结束（ROLLBACK）。
一级封锁协议可以防止丢失修改，并保证事务T是可恢复的。使用一级封锁协议可以解决丢失修改问题。
在一级封锁协议中，如果仅仅是读数据不对其进行修改，是不需要加锁的，它不能保证可重复读和不读“脏”数据。

**二级封锁协议**
一级封锁协议加上事务T在读取数据R之前必须先对其加S锁，读完后方可释放S锁。
二级封锁协议除防止了丢失修改，还可以进一步防止读“脏”数据。但在二级封锁协议中，由于读完数据后即可释放S锁，所以它不能保证可重复读。

**三级封锁协议**
一级封锁协议加上事务T在读取数据R之前必须先对其加S锁，直到事务结束才释放。
三级封锁协议除防止了丢失修改和不读“脏”数据外，还进一步防止了不可重复读。

上述三级协议的主要区别在于什么操作需要申请封锁，以及何时释放。

**两段锁协议**

可串行化调度是指，通过并发控制，使得并发执行的事务结果与某个串行执行的事务结果相同。

两段锁协议规定在对任何数据进行读写操作之前，事务首先要获得对该数据的封锁；而且在释放一个封锁之后，事务不再获得任何其他封锁。就是说加锁和解锁分为两个阶段进行。

> 事务遵循两段锁协议是保证可串行化调度的充分条件。例如以下操作满足两段锁协议，它是可串行化调度。
> Xlock(A)…Slock(B)…Slock(C)…unlock(A)…unlock(C)…unlock(B) 
> 但不是必要条件，例如以下操作不满足两段锁协议，但是它还是可串行化调度: 
> Xlock(A)…unlock(A)…Slock(B)…unlock(B)…Slock(C)…unlock(C)

| 事务隔离级别 | 加锁协议     |
| ------------ | ------------ |
| 读未提交     | 一级加锁协议 |
| 读已提交     | 二级加锁协议 |
| 可重复读     | 三级加锁协议 |
| 串行化       | 两段锁协议   |

注：封锁协议和隔离级别并不是严格对应的。

MySQL 的 InnoDB 存储引擎采用两段锁协议，会根据隔离级别在需要的时候自动加锁，并且所有的锁都是在同一时刻被释放，这被称为隐式锁定。

#### 死锁

**产生死锁的四个必要条件：**

（1） 互斥条件：一个资源每次只能被一个进程使用。
（2） 请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放。
（3） 不剥夺条件:进程已获得的资源，在末使用完之前，不能强行剥夺。
（4） 循环等待条件:若干进程之间形成一种头尾相接的循环等待资源关系。

**避免死锁**

（1） 按同一顺序访问对象。(注：避免出现循环)
（2） 避免事务中的用户交互。(注：减少持有资源的时间，较少锁竞争)
（3） 保持事务简短并处于一个批处理中。(注：减少持有资源的时间)
（4） 使用较低的隔离级别。(注：使用较低的隔离级别比使用较高的隔离级别持有共享锁的时间更短)
（5） 使用基于行版本控制的隔离级别。
（6） 使用绑定连接。