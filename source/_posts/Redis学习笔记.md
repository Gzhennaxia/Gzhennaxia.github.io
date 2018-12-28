---
title: Redis学习笔记
tags:
  - Redis
categories:
  - Cache
  - Redis
date: 2018-12-25 23:27:15
---


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

## GEO

