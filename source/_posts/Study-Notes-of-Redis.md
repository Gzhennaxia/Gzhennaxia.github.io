---
title: Redis学习笔记
tags:
  - Redis
categories:
  - Cache
  - Redis
date: 2018-12-25 23:27:15
---

<img src="https://guides.wp-bullet.com/wp-content/uploads/2016/09/redis-unix-socket-object-cache-wordpress.png" width="100%"/>

<!-- more -->

# 简介

> [Redis-GitHbu](https://github.com/antirez/redis)

## 什么是Redis

## 有哪些公司在使用Redis

GitHub, Twitter, Stackoverflow, Alibaba, 百度，微博，美团，搜狐

## Redis的八大特性

1. 速度快
2. 支持持久化
3. 存在多种数据结构
4. 支持多种语言
5. 功能丰富
6. 简单（代码量小，使用方便）
7. 主从复制
8. 高可用，分布式

### 速度快

官方给的指标是10w OPS（每秒十万次读写）

这么快的原因：

- 数据存放在内存中
- 使用C语言编写（大约五万行代码），C语言离操作系统较近

- 线程模型为单线程

### 持久化

Redis所有数据保存在内存中，对数据的更新将异步的保存到磁盘上。

### 多种数据结构

五大数据结构：

1. Strings
2. Hash Tables
3. Linked Lists
4. Sets
5. Sorted Sets

其他新结构：

6. BitMaps: 位图（本质是字符串，可以实现类似[布隆过滤器](https://china.googleblog.com/2007/07/bloom-filter_7469.html)的功能）
7. HyperLogLog：超小内存唯一值计数（本质是字符串）
8. GEO：地理信息定位（本质是有序集合，Redis-3.2后提供）

### 支持多种客户端语言

Java，PHP，python，Ruby，Lua，nodejs

### 功能丰富

1. 发布订阅模式
2. Lua脚本
3. 事务
4. pipeline（提高客户端并发效率）

## 典型应用场景

- 缓存系统
- 计数器（微博的转发数，评论数以及视频网站的播放数等）
- 消息队列系统 
- 排行榜
- 社交网络（粉丝数，关注数，共同关注数）
- 实时系统（垃圾邮件处理系统，布隆过滤器）

# 安装Redis

## Redis安装

### Linux系统下安装Redis

```shell
# 1. 下载
$ wget http://download.redis.io/releases/redis-5.0.3.tar.gz
# 2. 解压缩
$ tar xzf redis-5.0.3.tar.gz
# 3. 建立一个软连接
$ In -s redis-5.0.3 redis
$ cd redis-5.0.3
# 4. 编译
$ make
# 5. 安装
$ make install
```



## 可执行文件说明

| 可执行文件       | 说明                      |
| ---------------- | ------------------------- |
| redis-server     | Redis服务器               |
| redis-cli        | Redis命令行客户端         |
| redis-benchmark  | Redis性能测试工具         |
| redis-check-aof  | AOF文件修复工具           |
| redis-check-dump | RDB文件修复工具           |
| redis-sentinel   | Sentinel服务器（2.8以后） |



## 三种启动方法

### 最简启动

直接使用`redis-server`

### 动态参数启动

```shell
redis-server --port 6380 # 默认端口是6379
```

### 配置文件启动

```shell
redis-server configPath
```

### 验证方法

```shell
ps -ef|grep redis
netstat -antpl|grep redis
redis-cli -h ip -p port ping
```

### 比较

- 生产环境推荐配置启动
- 单机多实例配置文件可以用端口区分开

## 简单的客户端连接

### 连接

```shell
redis-cli -h 10.10.79.150 -p 6384
ping
set hello world
get hello
```

### 返回值

1. 状态回复（如`ping`返回`PONG`）
2. 错误回复（如`(error) WRONGTYPE Operation against`）
3. 整数回复（如`incr hello`回复`(integer) 1`）
4. 字符串回复（如`get hello`回复`"world"`）
5. 多行字符串回复（如`mget hello foo`返回`"world" "bar"`）

## Redis常用配置

| 属性      | 说明                                                         |
| --------- | ------------------------------------------------------------ |
| daemonize | 是否是守护进程（no默认\|yes推荐）                            |
| port      | Redis对外端口号，默认为6379<br />7379对应手机按键上MERZ对应的号码，MERZ取自意大利歌女Alessia Merz的名字 |
| logfile   | Redis系统日志                                                |
| dir       | Redis工作目录                                                |

# Redis API

## 通用命令

1. keys

   eg：`keys *` 遍历所有的key

   怎么用：

   ​	热备从节点

   ​	scan

2. dbsize

   计算key的总数

3. exists key

   检查key是否存在，存在返回1，否则返回0

4. del key [key ...]

   删除指定key-value，成功返回1，否则返回0

5. expire key seconds

   `ttl key`查看key剩余的过期时间

   `persist key`去掉key的过期时间

6. type key

   返回key的类型（string，hash，list，set，zset，none）

| 命令   | 时间复杂度 |
| ------ | ---------- |
| keys   | O(n)       |
| dbsize | O(1)       |
| del    | O(1)       |
| exists | O(1)       |
| expire | O(1)       |
| type   | O(1)       |

## 数据结构和内部编码

### 内部编码

![Redis 内部编码](https://i.loli.net/2018/12/25/5c2240654f22b.png)

### 字符串键值结构

| key     | value                                                        |
| ------- | ------------------------------------------------------------ |
| hello   | world                                                        |
| counter | 1                                                            |
| bits    | \|1\|0\|1\|1\|1\|0\|1\|                                      |
|         | {<br />"prodduct":{<br />"id": "3242"<br />"name": "test423"<br />}<br />} |

Value up to 512MB，up to 100k is recommended

#### 场景

- 缓存
- 计数器
- 分布式锁

#### 命令

```shell
# 1. 获取key对应的value O(1)
get key
# 2. 设置key-value O(1)
set key value
# 3. 删除key-value O(1)
del key
```

```shell
# 1. key自增1，如果key不存在，自增后get（key）=1 O(1)
incr key
# 2. key自减1，如果key不存在，自减后get（key）=-1 O(1)
decr key
# 3. key自增k，如果key不存在，自增后get（key）=k O(1)
incrby key k
# 4. key自减k，如果key不存在，自减后get（key）=-k O(1)
decrby key k
```

```shell
# 1. 不管key是否存在，都设置 O(1)
set key value
# 2. key不存在，才设置 O(1)
setnx key value
# 3. key存在，才设置 O(1)
set key value xx
```

```shell
# 1. 批量获取key，原子操作 O(n)
mget key1 key2 key3...
# 2. 批量设置key-value O(n)
mset key1 value1 key2 vlaue2 key3 value3
```

n次get = n次网络时间 + n次命令时间

1次mget = 1次网络时间 + n次命令时间

```shell
# 1. set key newvalue并返回旧的value O(1)
getset key newvalue
# 2. 将value追加到旧的value O(1)
append key value
# 3. 返回字符串的长度（注意中文） O(1)
strlen key
```

```shell
# 1. 增加key对应的值3.5 O(1)
incrbyfloat key 3.5
# 2. 获取字符串指定下标范围内的值 O(1)
getrange key start end
# 3. 设置指定下标范围内对应的值 O(1)
setrange key index value
```

##### 复杂度总结

| 命令          | 含义                         | 复杂度 |
| ------------- | ---------------------------- | ------ |
| set key value | 是指key-value                | O(1)   |
| get key       | 获取key-value                | O(1)   |
| del key       | 删除key-value                | O(1)   |
| setnx setxx   | 根据key是否存在设置key-value | O(1)   |
| Incr decr     | 计数                         | O(1)   |
| mget mset     | 批量操作key-value            | O(n)   |



#### 实战

1. 记录网站每个用户个人主页的访问量？

   ```shell
   incr userid:pageview
   ```

2. 缓存视频的基本信息（数据源在MySQL中）伪代码

   ```java
   public VideoInfo get(long id){
       String redisKey = redisPrefix + id;
       VideoInfo videoInfo = redis.get(redisKey);
       if(videoInfo == null){
           videoInfo = mysql.get(id);
           if(videoInfo != null){
               //序列化
               redis.set(redisKey, serialize(videoInfo));
           }
       }
       return videoInfo;
   }
   ```

3. 分布式计数器

   incr id (原子操作)

### Hash键值结构

| key         | field                   | value                    |
| ----------- | ----------------------- | ------------------------ |
| user:1:info | name<br />age<br />Date | Ronaldo<br />32<br />239 |

#### 特点

1. 是一个`value`为`Map`的`Map`

2. `field`不能相同，`value`可以相同

#### API

所有以哈希为结构的命令都是以`H`开头的。

```shell
# 1. 获取hash key对应的field的value O(1)
hget key field
# 2. 设置hash key对应field的value O(1)
hset key field value
# 3. 删除hash key对应field的value O(1)
hdel key field
```

```shell
# 1. 判断hash key是否有field O(1)
hexists key field
# 2. 获取hash key field的数量 O(1)
hlen key
```

```shell
# 1. 批量获取hash key的一批field对应的值 O(n)
hmget key field1 field2... fieldN
# 2. 批量设置hash key的一批field value O(n)
hmset key field1 value1 field2 value2...fieldN valueN
```

```shell
# 1. 返回hash key对应所有的field和value O(n)
hgetall key
# 2. 返回hash key对应所有field的value O(n)
hvals key
# 3. 返回hash key对应多有field O(n)
hkeys key
```

```shell
# 1. 设置hash key对应field的value（若field已存在，则失败） O(1)
hsetnx key field value
# 2. hash key对应的filed的value自增intCounter O(1)
hincrby key field intCounter
# 3. hincrby浮点数版 O(1)
hincrbyfloat key field floatCounter
```

##### 复杂度总结

| 命令                | 复杂度 |
| ------------------- | ------ |
| hget hset hdel      | O(1)   |
| hexists             | O(1)   |
| hincrby             | O(1)   |
| hgetall hvals hkeys | O(n)   |
| hmget hmset         | O(n)   |

### 列表

#### 特点

1. 有序（根据插入顺序得到遍历顺序）
2. 可以重复
3. 左右两边都可以插入和弹出

#### API

列表的API都以`L`开头

##### 增

```shell
# 1. 从列表右端插入值 O(1)
rpush key value1 value2 ... valueN
# 2. 从列表左端插入值 O(1)
lpush key value1 value2 ... valueN
# 3. 在list指定的值前|后插入newValue O(n)
linsert key before|after value newValue
```

##### 删

```shell
# 1. 从列表左侧弹出一个item O(1)
lpop key
# 2. 从列表右侧弹出一个item O(1)
rpop key
```

```shell
# 3. 根据count值，从列表中删除所有value相等的项 O(n)
# （1）count>0，从左到右，删除最多count个value相等的项
# （2）count<0，从右到左，删除最多Math。abs（count）个value相等的项
# （3）count=0，删除所有value相等的项
lrem key count value
```

```shell
# 4. 按照索引范围修剪列表 O(n)
# 	 如ltrime listkey 1 4 是指删除除了下标为1-4（包括1和4）其他项
ltrim key start end
```

##### 查

```shell
# 1. 获取列表指定索引范围所有item O(n)
#  	 如lrange listKey 0 2获取的是下标0-2（包括0和2）的项
#  	 再如lrange listKey 1 -1获取的是下标1-（len-1）的项
lrange key start end
```

```shell
# 2. 获取列表指定索引的item O(n)
#    如lindex listkye -1 取到的是最后一个元素
lindex key index
```

```shell
# 3. 获取列表长度 O(1)
llen key
```

##### 改

```shell
# 1. 设置列表指定索引值为newValue O(n)
lset key index newValue
```

##### 其他

```shell
# 1. lpop阻塞版本，timeout是阻塞超时时间，timeout=0为永远不阻塞 O(1)
blpop key timeout
# 2. rpop阻塞版本，timeout是阻塞超时时间，timeout=0为永远不阻塞 O(1)
brpop key timeout
```

##### TIPS

1. LPUSH + LPOP = Stack
2. LPUSH + RPOP = Queue
3. LPUSH + LTRIM = Capped Collection
4. LPUSH + BRPOP = Message Queue

#### 实战

1. TimeLine

#### 实战

1. 记录网站每个用户个人主页的访问量

   ```shell
   hincrby user:1:info pageview count
   ```

2. 缓存视频的基本信息（数据源在mysql中）伪代码

   ```java
   public VideoInfo get(long id){
       String redisKey = redisPrefix + id;
       Map<String, String> hashMap = redis.hgetAll(redisKey);
       VideoInfo videoInfo = transferMapToVideo(hashMap);
       if(videoInfo == null){
           videoInfo = mysql.get(id);
           if(videoInfo != null){
               redis.hmset(redisKey, transferVideoToMap(videoInfo));
           }
       }
       return videoInfo;
   }
   ```


## 单线程架构

Redis在同一时刻只会执行一条命令

### 单线程为什么这么快

1. 纯内存

2. 非阻塞IO

3. 避免线程切换和竞态消耗

4. 拒绝长（慢）命令

   ​	keys, flushall, flushdb, slow lua script, mutil/exec, operate big value(collection)

5. 其实不是单线程

   fysnc file descriptor

   close file descriptor

# Redis客户端

## Java客户端：Jedis

### 获取Jedis

1. 添加`Maven`依赖

```xml
<!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.9.0</version>
</dependency>
```

2. Jedis直连（TCP连接）

   ```java
   Jedis jedis = new Jedis("127.0.0.1", 6379);
   jedis.set("hello","world");
   String value = jedis.get("hello");
   ```

   `Jedis(String host, int port, int connectionTimeout, int soTimeout)`

   - host : Redis节点所在机器的IP
   - port : Redis节点的端口
   - connectionTimeout : 客户端连接超时时间（内部使用socket技术）
   - soTimeout : 客户端读写超时时间

### Jedis基本使用

### Jedis连接池使用

#### 简单使用

```java
// 初始化Jedis连接池，通常来讲JedisPool是单例的。
GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
JedisPool jedisPool = new JedisPool(poolConfig, "127.0.0.1", 6379);

Jedis jedis = null;
try{
    // 1. 从连接池获取jedis对象
    jedis = jedisPool.getResource();
    // 2. 执行操作
    jedis.set("hello", "world");
} catch (Exception e){
    e.printStackTrance();
} finally {
    if(jedis != null){
        // 如果使用JedisPool，close操作不是关闭连接，二十代表归还连接池。
        jedis.close();
    }
}
```



|        | 优点                                                         | 缺点                                                         |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 直连   | - 简单方便<br />- 适用于少量长期连接的场景                   | - 存在每次新建/关闭TCP开销<br />- 资源无法控制，存在连接泄露的可能<br />- Jedis对象线程不安全 |
| 连接池 | - Jedis预先生成，降低开销使用<br />- 连接池的形式保护和控制资源的使用 | 相对于直连，使用相对麻烦，尤其在资源的管理上需要很多参数来保证，一旦规划不合理也会出现问题。 |



## python客户端：redis-py

### 源码安装

> [Redis-clients-python](https://redis.io/clients#python)

```shell
wget https://github.com/andymccurdy/redis-py/archive/3.0.0.zip
unzip redis-3.0.0.zip
cd redis-3.0.0
# 安装redis-py
sudo python setup.py install
```

### 简单使用

```python
import redis
client = redis.StrictRedis(host='127.0.0.1', port=6379)
key = "hello"
setResult = client.set(key, "python-redis")
print setResult
value = client.get(key)
print "key:" + key + ", value:" + value
```

## Go客户端

 ```go
c,err := redis.Dial("tcp", "127.0.0.1:6379")
if err != nil{
    fmt.Println(err)
    return
}
defer c.Close()
v, err := c.Do("SET", "hello", "world")
if err != nil{
    fmt.Println(err)
    return
}
fmt.Println(v)
v, err = redis.String(c.Do("GET", "hello"))
if err != nil {
    fmt.Println(err)
    return
}
 ```

# 瑞士军刀Redis

## 慢查询

### 生命周期

![](https://i.loli.net/2018/12/27/5c2419d644e00.png)

1. 慢查询发生在第三阶段
2. 客户端超时不一定是慢查询导致的，慢查询只是导致客户端超时的一个可能因素

### 两个配置

#### slowlog-max-len

1. 先进先出队列
2. 固定长度
3. 保存在内存内

#### slowlog-log-slower-than

1. 慢查询阈值（单位：微妙，1毫秒等于1000微秒）
2. slowlog-log-slower-than=0，记录所有命令
3. slowlog-log-slower-than<0，不记录任何命令

#### 配置方法

1. 默认值
   - config get slowlog-max-len = 128
   - config get slowlog-log-slower-than = 10000
2. 修改配置文件后重启（适用于未启动时）
3. 动态配置
   - config set slowlog-max-len 1000
   - config set slowlog-log-slower-than 1000

### 三个命令

1. slowlog get [n] ：获取慢查询队列
2. slowlog len ：获取慢查询队列长度
3. slowlog reset ：清空慢查询队列

### 运维经验

1. slowlog-max-len不要是指过大，默认10ms，通常是指1ms
2. slowlog-log-slower-than不要设置太小，通常设置1000左右
3. 理解命令生命周期
4. 定期持久化慢查询

## pipeline

### 什么是流水线

流水线就是一次网络连接里传输一批命令，节省网络传输时间

| 命令   | N个命令操作       | 1次pipeline       |
| ------ | ----------------- | ----------------- |
| 时间   | n次网络 + n次命令 | 1次网络 + n次命令 |
| 数据量 | 1条命令           | n条命令           |

注意：

1. Redis的命令时间是微秒级别。
2. pipeline每次条数要控制（网络）。

### 客户端实现 pipeline-Jedis

```java
// before pipeline
Jedis jedis = new jedis("127.0.0.1", 6379);
for (int i = 0; i < 10000; i++){
    jedis.hset("hashkey:" + i, "field" + i, "value" + i);
}
```

```java
// after pipeline
Jedis jedis = new jedis("127.0.0.1", 6379);
for (int i = 0; i < 100; i++){
    Pipeline pipeline = jedis.pipelined();
    for(int j = i*100; j < (i+1)*100; j++){
        pipeline.hset("hashkey:" + j, "field" + j, "value" + j);
    }
    pipeline.syncAndReturnAll();
}
```



### 与原生M操作做对比

M操作是原子操作，pipeline是非原子操作。

### 使用建议

1. 注意每次pipeline携带数据量
2. pipeline每次只能作用在一个Redis节点上
3. M操作与pipeline区别

## 发布订阅

### 角色

- 发布者（publisher）
- 订阅者（subscriber）
- 频道（channel）

### 模型 

Redis server中有各个频道。

发布者向频道中发布消息

订阅者收到其所订阅频道的消息，只能收到订阅时刻之后的消息，之前的收不到。

![](https://upload-images.jianshu.io/upload_images/7432257-f91184b81f782b4f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)

需要注意的是，redis没有消息堆积的能力。

### API

#### publish

```shell
publish channel message
```

eg:

```shell
redis> publish sohu:tv "hello world"
(integer) 3 # 订阅者个数
```

#### subscribe

```shell
subscribe [channel] # 一个或多个
```

#### unsubscribe

```shell
unsubcribe [channle] # 一个或多个
```

#### 其他

 ```shell
# 1. 订阅模式
psubscribe [pattern]
# 2. 推定指定的模式
punsubscribe [pattern]
# 3. 列出至少有一个订阅者的频道
pubsub channels
# 4. 列出给定频道的订阅者数量
pubsub numsub [channel]
# 5. 列出被订阅模式的数量
pubsub numpat
 ```

### 发布订阅与消息队列   

发布订阅是所有订阅者可以收到所有的消息

消息队列是订阅者要进行消息抢夺，一条消息只有一个订阅者能够抢到。

## Bitmap

### 位图

| b        | i        | g        |
| -------- | -------- | -------- |
| 01100010 | 01101001 | 01100111 |

### 相关命令

```shell
# 1. 给位图指定索引设置值
setbit key offset value
# 2. 获取位图指定索引的值
getbit key offset
# 3. 获取位图指定范围（start到end，单位为字节，如果不指定就是获取全部）位值为1的个数
bitcount key [start end]
# 4. 做多个Bitmap的and（交集）、or（并集）、not（非）、xor（抑或）操作并将结果保存在destkey中
bitop op destkey key [key...]
# 5. 计算位图指定范围（start到end，单位为字节，如果不指定就是取全部）第一个偏移量对应的值等于targetBit的位置
bitpos key targetBit [start][end]
```

### 独立用户统计

1. 使用set和Bitmap
2. 总共1亿用户，每日5千万独立访问。

| 数据类型 | 每个userid只用空间                                           | 需要存储的用户量 | 全部内存量              |
| -------- | ------------------------------------------------------------ | ---------------- | ----------------------- |
| set      | 32位<br />（假设userid用的是整型，<br />实际很多网站用的是长整型） | 50，000，000     | 32位*50，000，000=100MB |
| Bitmap   | 1位                                                          | 100，000，000    | 12.5MB                  |

|        | 一天  | 一个月 | 一年 |
| ------ | ----- | ------ | ---- |
| set    | 200M  | 6G     | 72G  |
| Bitmap | 12.5M | 375M   | 4.5G |

如果只有10万对立用户：
| 数据类型 | 每个userid占用空间 | 需要存储的用户量 | 全部内存量             |
| -------- | ------------------ | ---------------- | ---------------------- |
| set      | 32位               | 1,000,000        | 32位*1,000,000=4MB     |
| Bitmap   | 1位                | 100,000,000      | 1位*100,000,000=12.5MB |

### 使用经验

1. type=string，最大512MB
2. 注意setbit时的偏移量，可能有较大耗时
3. 位图不是绝对好。

## HyperLogLog

### 是否是新的数据结构

1. 基于 HyperLogLog 算法：极小空间完成独立数量统计。
2. 本质还是字符串

### 三个命令

1. 向 hyperloglog 添加元素

   ```shell
   pfadd key element [element ...]
   ```

2. 计算 hyperloglog 的独立总数

   ```shell
   pfcount key [key ...]
   ```

3. 合并多个 hyperloglog

   ```shell
   pfmerge destkey sourcekey [sourcekey ...]
   ```

### 内存消耗

### 使用经验

1. 存在错误率（0.81%）
2. 无法取出单条数据

## GEO

### GEO是什么

GEO(地理信息定位)：存储经纬度，计算两地距离，范围计算等。

### 5个城市经纬度

| 城市   | 经度   | 纬度  |
| ------ | ------ | ----- |
| 北京   | 116.28 | 39.55 |
| 天津   | 117.12 | 39.08 |
| 石家庄 | 114.29 | 38.02 |
| 唐山   | 118.01 | 39.38 |
| 保定   | 115.29 | 38.51 |

### 相关命令

```shell
# 1. 添加地理位置信息
geo key longitude latitude member [longitude latitude member ...]
# 2. 获取地理位置信息
geopos key member [member ...]
# 3. 获取两个地理位置的距离
#    unit: m(米)、km(千米)、mi(英里)、ft(尺)
geodist key member1 member2 [unit]
# 4. 获取指定位置范围内的地理位置信息集合
georadius
```

### 相关说明

1. since 3.2+
2. type geoKey = zset
3. 没有删除 API：zrem key member

## 持久化

## 持久化的作用

（1）什么是持久化

redis 所有数据保存在内存中，对数据的更新将异步的保存到磁盘上。

（2）持久化的实现方式

1. 快照
   - MySQL Dump
   - Redis RDB
2. 写日志
   - MySQL Binlog
   - Hbase Hlog
   - Redis AOF

## RDB

（1）什么是RDB

​	redis 通过命令创建 RDB 文件（二进制）保存在硬盘中。当 redis 重启时通过命令将 RDB 文件载入到内存。实质是一个复制媒介。

（2）触发机制-主要三种方式

 1. save（同步）

    - 新文件将会替换老文件
    - 复杂度位 O(n)

 2. bgsave（异步）

    - 利用 Linux fork() 异步执行

    - 文件策略及复杂度与 save 相同

      | 命令   | save             | bgsave              |
      | ------ | ---------------- | ------------------- |
      | IO类型 | 同步             | 异步                |
      | 阻塞   | 是               | 是（阻塞发生在fork) |
      | 复杂度 | O(n)             | O(n)                |
      | 优点   | 不会消耗额外内存 | 不阻塞客户端命令    |
      | 缺点   | 阻塞客户端命令   | 需要fork，消耗内存  |

 3. 自动

    redis 提供了 save 配置

    | 配置 | seconds | changes |
    | ---- | ------- | ------- |
    | save | 900     | 1       |
    | save | 300     | 10      |
    | save | 60      | 10000   |

    满足任意一个条件，redis 会自动创建（bgsave）RDB 文件

    默认配置：

    ```shell
    save 900 1
    save 300 10
    save 60 10000
    dbfiename dump.rdb
    dir ./
    stop-writes-on-bgsave-error yes
    rdbcompression yes
    rdbcheksum yes
    ```

    最佳配置：

    ```shell
    dbfilename dump-${port}.rdb
    dir /bigdiskpath
    stop-writes-on-bgsave-error yes
    rdbcompression yes
    rdbcheksum yes
    ```

（3）触发机制-不容忽视方式

 	1. 全量复制
 	2. debug reload
 	3. shutdown 

（4）总结

 	1. RDB是 Redis 内存到硬盘的快照，用于持久化。
 	2. save 通常会阻塞 Redis
 	3. bgsave 不会阻塞 Redis，但是会 fork 新进程。
 	4. save 自动配置满足任意一个条件就会被执行。

## AOF

### RDB 现存问题

- 耗时，耗性能

  - O(n): 耗时

  - fork(): 消耗内存，copy-on-write 策略
  - Disk I/O: IO 性能

- 不可控，丢失数据

### 什么是 AOF

每执行一条命令，就将该命令写入到 AOF 日志文件中。

### AOF 三种策略

（1）always

​	每条写命令都会出发刷新，将缓冲区的命令日志刷新到 AOF 文件中。

（2）everysec

​	每秒（默认值）刷新一次

（3）no

​	由操作系统决定什么时候刷新。

| 命令 | always                                  | everysec                          | no     |
| ---- | --------------------------------------- | --------------------------------- | ------ |
| 优点 | 不丢失数据                              | 每秒一次 fsync <br />丢失一秒数据 | 不用管 |
| 缺点 | IO 开销较大，一般的 sata 盘只有几百 TPS | 丢失1秒数据                       | 不可控 |

### AOF 重写

| 原生 AOF                                                     | AOF 重写                                                  |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| set hello world<br />set hello java<br />set hello hehe<br />incr counter<br />incr counter<br />rpush mylist a<br />rpush mylist b<br />rpush mylist c<br />过期数据 | set hello hehe<br />set counter 2<br />rpush mylist a b c |

AOF 重写的作用：

1. 减少磁盘占用量
2. 加速恢复速度

AOF 重写的两种实现方式

1. berewriteaof

2. AOF 重写配置

   | 配置名                      | 含义                   |
   | --------------------------- | ---------------------- |
   | autoaof-rewrite-min-size    | AOF 文件重写需要的尺寸 |
   | auto-aof-rewrite-percentage | AOF 文件增长率         |

   | 统计名           | 含义                                   |
   | ---------------- | -------------------------------------- |
   | aof_current_size | AOF 当前尺寸（单位：字节）             |
   | aof_base_size    | AOF 上次启动和重写的尺寸（单位：字节） |

   自动触发时机：

   - aof_current_size > auto-aof-rewrite-min-size
   - aof_current_size - aof_base_size / aof_base_size > auto-aof-rewrite-percentage

   AOF 重写流程

   ![](data:image/jpeg;base64,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)

   常用配置：

   ```shell
   appendonly yes
   appendfilename "appendonly-${port}.aof"
   appendfsync everysec
   dir /bigdiskpath
   no-appendfsync-on-rewrite yes
   auto-aof-rewrite-percentage 100
   auto-aof-rewrite-min-size 64mb
   ```

## RDB 和 AOF 的抉择

### RDB 和 AOF 比较

| 命令       | RDB    | AOF          |
| ---------- | ------ | ------------ |
| 启动优先级 | 低     | 高           |
| 体积       | 小     | 大           |
| 恢复速度   | 快     | 慢           |
| 数据安全性 | 丢数据 | 根据策略决定 |
| 轻重       | 重     | 轻           |

### RDB 最佳策略

1. “关”
2. 集中管理
3. 主从，从开

### AOF 最佳策略

1. ”开“：缓存和存储
2. AOF 重写集中管理
3. everysec

### 最佳策略

1. 小分片
2. 缓存或者存储
3. 监控（硬盘、内存、负载、网络）
4. 足够的内存

## 开发运维常见问题

### fork 操作

1. 同步操作
2. 与内存量息息相关：内存越大，耗时越长（与机器类型有关）
3. info: latest_fork_usec 查询上一次 fork 的时间

如何改善fork

1. 优先使用物理机或者高效支持 fork 操作的虚拟化技术
2. 控制 Redis 实例最大可用内存：maxmemory
3. 合理配置 Linux 内存分配策略：vm.overcommit_memory = 1
4. 降低 fork 频率：例如放宽 AOF 重写自动触发时机，不必要的全量复制

### 进程外开销

子进程开销和优化

1. CPU：
   - 开销：RDB 和 AOF 文件生成，属于 CPU 密集型
   - 优化：不做 CPU 绑定，不和 CPU 密集型部署
2. 内存：
   - 开销：fork 内存开销，copy-on-write。
   - 优化：echo never > /sys/kernel/mm/transparent_hugepage/enabled
3. 硬盘
   - 开销：AOF 和 RDB 文件写入，可以结合 iostat，iotop 分析
   - 优化：
     - 不要和高硬盘负责服务部署在一起：存储服务、消息队列等
     - no-appendfsync-on-rewrite = yes
     - 根据写入量决定磁盘类型：例如 ssd
     - 单机多实例持久化文件目录可以考虑分盘

### AOF追加阻塞

![](https://upload-images.jianshu.io/upload_images/12588973-ed80e9c29a4d1ef2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)

AOF 阻塞定位

​	Reids 日志：

​	Asynchronous AOF fsync is taking too long (disk is busy?).

​	Writing the AOF buffer without waiting for fsync to complete,this may slow down Redis.

​	info Persistence:

​	...

​	aof_delayed_fsync: 100

​	...

### 单机多实例部署

## Redis 复制的原理与优化

### 什么是主从复制

（1）单机有什么问题？

​	机器故障

​	容量瓶颈

​	QPS 瓶颈

（2）作用

​	数据副本

​	扩展读性能

### 复制的配置

两种实现方式

1. slaveof 命令

2. 配置

   ```shell
   slaveof ip port
   slave-read-only yes
   ```

### 全量复制和部分复制

查看 run_id

```shell
redis-cli -p 6379 info server | grep run
```

查看偏移量

```shell
redis-cli -p 6379 info replication
```

全量复制开销：

1. bgsave 时间
2. RDB文件网络传输时间
3. 从节点清空数据时间
4. 从节点加载 RDB 的时间
5. 可能的 AOF 重写时间

### 故障处理

### 开发运维常见问题

1. 读写分离

   将读流量分摊到从节点

   可能遇到的问题：

   - 复制数据延迟
   - 读到过期数据
   - 从节点故障

2. 主从配置不一致

3. 规避全量复制

   - 第一次不可避免
   - 系欸但运行 ID  不匹配
     - 主节点重启
     - 故障转移
   - 复制积压缓冲区不足
     - 网络中断，部分复制无法满足
     - 增大复制缓冲区配置 rel_backlog_size，网络“增强”。

4. 规避复制风暴

   - 单主节点复制风暴
     - 问题：主节点重启，多从节点复制
     - 解决：更换复制拓扑
   - 单机器复制风暴
     - 机器宕机后，大量全量复制
     - 主节点分散多机器

## Redis Sentinel

### 主从复制高可用存在的问题

1. 手动故障转移
2. 写能力和存储能力受限

### 架构说明

客户端不直接访问 redis，而是通过 sentinel 来访问。由 sentinel 来负责主从节点的管理。

### 安装配置

sentinel 的默认端口为 26379

1. 配置开启主从节点
2. 配置开启 sentinel 监控主节点（sentinel 是特殊的 redis）

### 客户端连接

请求相应流程

jedis

```shell
JedisSentinelPool sentinelPool = new JedisSentinelPool(masterName, sentinelSet, poolConfig, timeout);
Jedis jedis = null;
try {
    jedis = redisSentinelPool.getResource();
    // jedis command
} catch (Exception e){
    logger.error(e.getMessage(), e);
} finally {
    if (jedis != null){
        jedis.close();
    }
}
```



redis-py

### 实现原理

### 常见开发运维问题

## Redis Cluster

### 呼唤集群

1. 超高并发量需求
2. 超大数据量需求

### 数据分布

顺序分布

哈希分布

- 节点取余
  - 使用多倍扩容降低迁移率
- 一致性哈希
  - 顺时针取余
  - 只影响邻近节点
  - 扩容后会存在负载不均衡的情况
- 虚拟槽
  - 每个槽映射一个数据子集
  - 良好的哈希函数：例如 CRC16
  - 服务端管理节点、槽、数据：例如 Redis Cluster

| 分布方式 | 特点                                                         | 典型产品                                     |
| -------- | ------------------------------------------------------------ | -------------------------------------------- |
| 哈希分布 | 数据分散度高<br />键值分布业务无关<br />无法顺序访问<br />支持批量操作 | 一致性哈希 Memcache<br />Redis Cluster<br /> |
| 顺序分布 | 数据分散度易倾斜<br />键值业务相关<br />可顺序访问<br />不支持批量操作 | BigTable<br />HBase                          |

### 搭建集群

### 集群伸缩

### 客户端路由

### 集群原理

### 开发运维常见问题

### Redis Cluster 架构

1. 节点
2. meet
3. 指派槽
4. 复制

### Redis Cluster 特性

1. 复制
2. 高可用
3. 分片

### 两种安装方式

#### 原生命令安装

1. 配置开启节点

   ```shell
   port ${port}
   daemonize yes
   dir "/opt/redis/data"
   dbfilename "dump-${port}.rdb"
   logfile "${port}.log"
   cluster-enabled yes
   cluster-config-file nodes-${port}.conf
   ```

2. meet

   ```shell
   cluster meet ip port
   ```

3. 指派槽

   ```shell
   cluster addslots slot [slot ...]
   ```

4. 分配主从关系

   ```shell
   cluster replicate node-id
   ```

####  官方工具安装



> 链接：https://pan.baidu.com/s/1Y0_Aq8UOzIDoqluORSuCww 
> 提取码：5r0v

