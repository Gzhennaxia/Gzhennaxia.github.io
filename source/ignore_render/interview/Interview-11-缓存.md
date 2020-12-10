## 缓存

### Redis

> [Redis | JavaGuide](https://github.com/Snailclimb/JavaGuide/blob/master/docs/database/Redis/redis-all.md)

#### 数据结构

> [通俗易懂的Redis数据结构基础教程](https://juejin.im/post/6844903644798664712)

Redis有5个基本数据结构，string、list、hash、set和zset。

##### string

Redis的字符串是动态字符串，是可以修改的字符串，内部结构实现上类似于Java的ArrayList，采用预分配冗余空间的方式来减少内存的频繁分配，内部为当前字符串实际分配的空间capacity一般要高于实际字符串长度len。

当字符串长度小于1M时，扩容都是加倍现有的空间，如果超过1M，扩容时一次只会多扩1M的空间。

字符串最大长度为512M。

###### 初始化字符串

需要提供「变量名称」和「变量的内容」

```
> set ireader beijing.zhangyue.keji.gufen.youxian.gongsi
OK
复制代码
```

###### 获取字符串的内容

提供「变量名称」

```
> get ireader
"beijing.zhangyue.keji.gufen.youxian.gongsi"
复制代码
```

###### 获取字符串的长度

提供「变量名称」

```
> strlen ireader
(integer) 42
复制代码
```

###### 获取子串

提供「变量名称」以及开始和结束位置[start, end]

```
> getrange ireader 28 34
"youxian"
复制代码
```

###### 覆盖子串

提供「变量名称」以及开始位置和目标子串

```bash
> setrange ireader 28 wooxian
(integer) 42  # 返回长度
> get ireader
"beijing.zhangyue.keji.gufen.wooxian.gongsi"
```

###### 追加子串

```bash
> append ireader .hao
(integer) 46 # 返回长度
> get ireader
"beijing.zhangyue.keji.gufen.wooxian.gongsi.hao"
```

字符串没有提供子串插入方法和子串删除方法。

###### 计数器

如果字符串的内容是一个整数，那么还可以将字符串当成计数器来使用。

```bash
> set ireader 42
OK
> get ireader
"42"
> incrby ireader 100
(integer) 142
> get ireader
"142"
> decrby ireader 100
(integer) 42
> get ireader
"42"
> incr ireader  # 等价于incrby ireader 1
(integer) 43
> decr ireader  # 等价于decrby ireader 1
(integer) 42
```

计数器是有范围的，它不能超过Long.Max，不能低于Long.MIN

```bash
> set ireader 9223372036854775807
OK
> incr ireader
(error) ERR increment or decrement would overflow
> set ireader -9223372036854775808
OK
> decr ireader
(error) ERR increment or decrement would overflow
```

###### 过期和删除

字符串可以使用del指令进行主动删除，可以使用expire指令设置过期时间，到点会自动删除，这属于被动删除。可以使用ttl指令获取字符串的寿命。

```bash
> expire ireader 60
(integer) 1  # 1表示设置成功，0表示变量ireader不存在
> ttl ireader
(integer) 50  # 还有50秒的寿命，返回-2表示变量不存在，-1表示没有设置过期时间
> del ireader
(integer) 1  # 删除成功返回1
> get ireader
(nil)  # 变量ireader没有了
```

##### list

![](https://user-gold-cdn.xitu.io/2018/7/22/164c25d671d13466)

Redis将列表数据结构命名为list而不是array，是因为列表的存储结构用的是链表而不是数组，而且链表还是双向链表。因为它是链表，所以随机定位性能较弱，首尾插入删除性能较优。

###### 负下标

链表元素的位置使用自然数`0,1,2,....n-1`表示，还可以使用负数`-1,-2,...-n`来表示，`-1`表示「倒数第一」，`-2`表示「倒数第二」，那么`-n`就表示第一个元素，对应的下标为`0`。

###### 队列／堆栈

链表可以从表头和表尾追加和移除元素，结合使用 rpush/rpop/lpush/lpop 四条指令，可以将链表作为队列或堆栈使用，左向右向进行都可以。

```bash
# 右进左出
> rpush ireader go
(integer) 1
> rpush ireader java python
(integer) 3
> lpop ireader
"go"
> lpop ireader
"java"
> lpop ireader
"python"
# 左进右出
> lpush ireader go java python
(integer) 3
> rpop ireader
"go"
...
# 右进右出
> rpush ireader go java python
(integer) 3
> rpop ireader 
"python"
...
# 左进左出
> lpush ireader go java python
(integer) 3
> lpop ireader
"python"
...
```

在日常应用中，列表常用来作为异步队列来使用。

###### 长度

使用llen指令获取链表长度

```bash
> rpush ireader go java python
(integer) 3
> llen ireader
(integer) 3
```

###### 随机读

可以使用 lindex 指令访问指定位置的元素。

使用 lrange 指令来获取链表子元素列表，提供start和end下标参数

```bash
> rpush ireader go java python
(integer) 3
> lindex ireader 1
"java"
> lrange ireader 0 2
1) "go"
2) "java"
3) "python"
> lrange ireader 0 -1  # -1表示倒数第一
1) "go"
2) "java"
3) "python"
```

###### 修改元素

使用lset指令修改指定位置的元素。

```bash
> rpush ireader go java python
(integer) 3
> lset ireader 1 javascript
OK
> lrange ireader 0 -1
1) "go"
2) "javascript"
3) "python"
```

###### 插入元素

使用linsert指令在列表的中间位置插入元素，linsert指令里增加了方向参数before/after来显示指示前置和后置插入。

不过linsert指令并不是通过指定位置来插入，而是通过指定具体的值。这是因为在分布式环境下，列表的元素总是频繁变动的，意味着上一时刻计算的元素下标在下一时刻可能就不是你所期望的下标了。

```bash
> rpush ireader go java python
(integer) 3
> linsert ireader before java ruby
(integer) 4
> lrange ireader 0 -1
1) "go"
2) "ruby"
3) "java"
4) "python"
```

###### 删除元素

列表的删除操作也不是通过指定下标来确定元素的，你需要指定删除的最大个数以及元素的值

```bash
> rpush ireader go java python
(integer) 3
> lrem ireader 1 java
(integer) 1
> lrange ireader 0 -1
1) "go"
2) "python"
```

###### 定长列表

在实际应用场景中，我们有时候会遇到「定长列表」的需求。比如要以走马灯的形式实时显示中奖用户名列表，因为中奖用户实在太多，能显示的数量一般不超过100条，那么这里就会使用到定长列表。维持定长列表的指令是ltrim，需要提供两个参数start和end，表示需要保留列表的下标范围，范围之外的所有元素都将被移除。

```bash
> rpush ireader go java python javascript ruby erlang rust cpp
(integer) 8
> ltrim ireader -3 -1
OK
> lrange ireader 0 -1
1) "erlang"
2) "rust"
3) "cpp"
```

如果指定参数的end对应的真实下标小于start，其效果等价于del指令，因为这样的参数表示需要需要保留列表元素的下标范围为空。

###### 快速列表

![img](https://user-gold-cdn.xitu.io/2018/7/27/164d91746fbe0442)

如果再深入一点，你会发现Redis底层存储的还不是一个简单的linkedlist，而是称之为快速链表quicklist的一个结构。首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是ziplist，也即是压缩列表。它将所有的元素紧挨着一起存储，分配的是一块连续的内存。当数据量比较多的时候才会改成quicklist。因为普通的链表需要的附加指针空间太大，会比较浪费空间。比如这个列表里存的只是int类型的数据，结构上还需要两个额外的指针prev和next。所以Redis将链表和ziplist结合起来组成了quicklist。也就是将多个ziplist使用双向指针串起来使用。这样既满足了快速的插入删除性能，又不会出现太大的冗余空间。

##### hash

![img](https://user-gold-cdn.xitu.io/2018/7/23/164c4eaf9edf608d)

哈希等价于Java语言的HashMap，在实现结构上它使用二维结构，第一维是数组，第二维是链表，hash的内容key和value存放在链表中，数组里存放的是链表的头指针。通过key查找元素时，先计算key的hashcode，然后用hashcode对数组的长度进行取模定位到链表的表头，再对链表进行遍历获取到相应的value值，链表的作用就是用来将产生了「hash碰撞」的元素串起来。Java语言开发者会感到非常熟悉，因为这样的结构和HashMap是没有区别的。哈希的第一维数组的长度也是2^n。

![img](https://user-gold-cdn.xitu.io/2018/7/23/164c4dcd14c00534)

###### 增加元素

可以使用hset一次增加一个键值对，也可以使用hmset一次增加多个键值对

```bash
> hset ireader go fast
(integer) 1
> hmset ireader java fast python slow
OK
```

###### 获取元素

可以通过hget定位具体key对应的value，可以通过hmget获取多个key对应的value，可以使用hgetall获取所有的键值对，可以使用hkeys和hvals分别获取所有的key列表和value列表。这些操作和Java语言的Map接口是类似的。

```bash
> hmset ireader go fast java fast python slow
OK
> hget ireader go
"fast"
> hmget ireader go python
1) "fast"
2) "slow"
> hgetall ireader
1) "go"
2) "fast"
3) "java"
4) "fast"
5) "python"
6) "slow"
> hkeys ireader
1) "go"
2) "java"
3) "python"
> hvals ireader
1) "fast"
2) "fast"
3) "slow"
```

###### 删除元素

可以使用hdel删除指定key，hdel支持同时删除多个key

```bash
> hmset ireader go fast java fast python slow
OK
> hdel ireader go
(integer) 1
> hdel ireader java python
(integer) 2
```

###### 判断元素是否存在

通常我们使用hget获得key对应的value是否为空就直到对应的元素是否存在了，不过如果value的字符串长度特别大，通过这种方式来判断元素存在与否就略显浪费，这时可以使用hexists指令。

```bash
> hmset ireader go fast java fast python slow
OK
> hexists ireader go
(integer) 1
```

###### 计数器

hash结构还可以当成计数器来使用，对于内部的每一个key都可以作为独立的计数器。如果value值不是整数，调用hincrby指令会出错。

```bash
> hincrby ireader go 1
(integer) 1
> hincrby ireader python 4
(integer) 4
> hincrby ireader java 4
(integer) 4
> hgetall ireader
1) "go"
2) "1"
3) "python"
4) "4"
5) "java"
6) "4"
> hset ireader rust good
(integer) 1
> hincrby ireader rust 1
(error) ERR hash value is not an integer
```

###### 扩容

当hash内部的元素比较拥挤时(hash碰撞比较频繁)，就需要进行扩容。扩容需要申请新的两倍大小的数组，然后将所有的键值对重新分配到新的数组下标对应的链表中(rehash)。

如果hash结构很大，比如有上百万个键值对，那么一次完整rehash的过程就会耗时很长。这对于单线程的Redis里来说有点压力山大。所以Redis采用了渐进式rehash的方案。它会同时保留两个新旧hash结构，在后续的定时任务以及hash结构的读写指令中将旧结构的元素逐渐迁移到新的结构中。这样就可以避免因扩容导致的线程卡顿现象。

###### 缩容

Redis的hash结构不但有扩容还有缩容，从这一点出发，它要比Java的HashMap要厉害一些，Java的HashMap只有扩容。缩容的原理和扩容是一致的，只不过新的数组大小要比旧数组小一倍。

##### set

Java 中 HashSet的内部实现使用的是HashMap，只不过所有的value都指向同一个对象。

Redis的set结构也是一样，它的内部也使用hash结构，所有的value都指向同一个内部值。

###### 增加元素

可以一次增加多个元素

```bash
> sadd ireader go java python
(integer) 3
```

###### 读取元素

使用smembers列出所有元素，

使用scard获取集合长度，

使用srandmember随机获取count个元素，如果不提供count参数，默认为1

```bash
> sadd ireader go java python
(integer) 3
> smembers ireader
1) "java"
2) "python"
3) "go"
> scard ireader
(integer) 3
> srandmember ireader
"java"
```

###### 删除元素

使用srem删除一到多个元素，使用spop随机删除一个元素

```bash
> sadd ireader go java python rust erlang
(integer) 5
> srem ireader go java
(integer) 2
> spop ireader
"erlang"
```

###### 判断元素是否存在

使用sismember指令，只能接收单个元素

```bash
> sadd ireader go java python rust erlang
(integer) 5
> sismember ireader rust
(integer) 1
> sismember ireader javascript
(integer) 0
```

##### zset

![img](https://user-gold-cdn.xitu.io/2018/7/23/164c4ec77aac6132)



SortedSet(zset)是Redis提供的一个非常特别的数据结构，一方面它等价于Java的数据结构`Map<String, Double>`，可以给每一个元素value赋予一个权重`score`，另一方面它又类似于`TreeSet`，内部的元素会按照权重score进行排序，可以得到每个元素的名次，还可以通过score的范围来获取元素的列表。

zset底层实现使用了两个数据结构，第一个是hash，第二个是跳跃列表，hash的作用就是关联元素value和权重score，保障元素value的唯一性，可以通过元素value找到相应的score值。跳跃列表的目的在于给元素value排序，根据score的范围获取元素列表。

###### 增加元素

通过zadd指令可以增加一到多个value/score对，score放在前面

```bash
> zadd ireader 4.0 python
(integer) 1
> zadd ireader 4.0 java 1.0 go
(integer) 2
```

###### 长度

通过指令zcard可以得到zset的元素个数

```bash
> zcard ireader
(integer) 3
```

###### 删除元素

通过指令zrem可以删除zset中的元素，可以一次删除多个

```bash
> zrem ireader go python
(integer) 2
```

###### 计数器

同hash结构一样，zset也可以作为计数器使用。

```bash
> zadd ireader 4.0 python 4.0 java 1.0 go
(integer) 3
> zincrby ireader 1.0 python
"5"
```

###### 获取排名和分数

通过zscore指令获取指定元素的权重，通过zrank指令获取指定元素的正向排名，通过zrevrank指令获取指定元素的反向排名[倒数第一名]。正向是由小到大，负向是由大到小。

```bash
> zscore ireader python
"5"
> zrank ireader go  # 分数低的排名考前，rank值小
(integer) 0
> zrank ireader java
(integer) 1
> zrank ireader python
(integer) 2
> zrevrank ireader python
(integer) 0
```

###### 根据排名范围获取元素列表

通过zrange指令指定排名范围参数获取对应的元素列表，携带withscores参数可以一并获取元素的权重。

通过zrevrange指令按负向排名获取元素列表。

```bash
> zrange ireader 0 -1  # 获取所有元素
1) "go"
2) "java"
3) "python"
> zrange ireader 0 -1 withscores
1) "go"
2) "1"
3) "java"
4) "4"
5) "python"
6) "5"
> zrevrange ireader 0 -1 withscores
1) "python"
2) "5"
3) "java"
4) "4"
5) "go"
6) "1"
```

###### 根据score范围获取列表

通过zrangebyscore指令指定score范围获取对应的元素列表。通过zrevrangebyscore指令获取倒排元素列表。

参数`-inf`表示负无穷，`+inf`表示正无穷。

```bash
> zrangebyscore ireader 0 5
1) "go"
2) "java"
3) "python"
> zrangebyscore ireader -inf +inf withscores
1) "go"
2) "1"
3) "java"
4) "4"
5) "python"
6) "5"
> zrevrangebyscore ireader +inf -inf withscores  # 注意正负反过来了
1) "python"
2) "5"
3) "java"
4) "4"
5) "go"
6) "1"
```

###### 根据范围移除元素列表

可以通过排名范围，也可以通过score范围来一次性移除多个元素

```bash
> zremrangebyrank ireader 0 1
(integer) 2  # 删掉了2个元素
> zadd ireader 4.0 java 1.0 go
(integer) 2
> zremrangebyscore ireader -inf 4
(integer) 2
> zrange ireader 0 -1
1) "python"
```

###### 跳跃列表

zset内部的排序功能是通过「跳跃列表」数据结构来实现的。

因为zset要支持随机的插入和删除，所以它不好使用数组来表示。我们先看一个普通的链表结构。

![img](https://user-gold-cdn.xitu.io/2018/7/23/164c5a90442cd51a)

我们需要这个链表按照score值进行排序。这意味着当有新元素需要插入时，需要定位到特定位置的插入点，这样才可以继续保证链表是有序的。通常我们会通过二分查找来找到插入点，但是二分查找的对象必须是数组，只有数组才可以支持快速位置定位，链表做不到，那该怎么办？

跳跃列表就是类似于（公司-部门-组长）这种层级制，最下面一层所有的元素都会串起来。然后每隔几个元素挑选出一个代表来，再将这几个代表使用另外一级指针串起来。然后在这些代表里再挑出二级代表，再串起来。最终就形成了金字塔结构。

![img](https://user-gold-cdn.xitu.io/2018/7/23/164c5bb13c6da230)

「跳跃列表」之所以「跳跃」，是因为内部的元素可能「身兼数职」，比如上图中间的这个元素，同时处于L0、L1和L2层，可以快速在不同层次之间进行「跳跃」。

定位插入点时，先在顶层进行定位，然后下潜到下一级定位，一直下潜到最底层找到合适的位置，将新元素插进去。你也许会问那新插入的元素如何才有机会「身兼数职」呢？

跳跃列表采取一个随机策略来决定新元素可以兼职到第几层，首先L0层肯定是100%了，L1层只有50%的概率，L2层只有25%的概率，L3层只有12.5%的概率，一直随机到最顶层L31层。绝大多数元素都过不了几层，只有极少数元素可以深入到顶层。列表中的元素越多，能够深入的层次就越深，能进入到顶层的概率就会越大。

#### 单线程

虽然说 Redis 是单线程模型，但是， 实际上，Redis 在 4.0 之后的版本中就已经加入了对多线程的支持。

不过，Redis 4.0 增加的多线程主要是针对一些**大键值对的删除操作**的命令，使用这些命令就会使用主处理之外的其他线程来“异步处理”。

大体上来说，Redis 6.0 之前主要还是单线程处理。

Redis6.0 引入多线程主要是为了提高**网络 IO** 读写性能，因为这个算是 Redis 中的一个性能瓶颈（Redis 的瓶颈主要受限于内存和网络）。

##### 为什么 Redis 选择单线程模型

> [为什么 Redis 选择单线程模型](https://draveness.me/whys-the-design-redis-single-thread/)

Redis 选择使用单线程模型处理客户端的请求主要还是因为 **CPU 不是 Redis 服务器的瓶颈**，所以**使用多线程模型带来的性能提升并不能抵消它带来的开发成本和维护成本**，系统的性能瓶颈也主要在网络 I/O 操作上；

而 Redis 引入多线程操作也是出于性能上的考虑，对于一些大键值对的删除操作，通过多线程非阻塞地释放内存空间也能减少对 Redis 主线程阻塞的时间，提高执行的效率。

##### 单线程的Redis为什么这么快

1. 完全基于内存

2. 采用单线程，避免了不必要的上下文切换。

3. 高效的数据结构

4. 使用I/O多路复用模型，非阻塞IO

   I/O多路复用，多路只多个连接，复用指的是复用同一个线程，采用多路 I/O 复用技术可以让单个线程高效的处理多个连接请求。

#### 过期策略

##### Redis是如何判断数据是否过期？

Redis 通过一个叫做**过期字典**（可以看作是hash表）来保存数据过期的时间。过期字典的键指向Redis数据库中的某个key(键)，过期字典的值是一个long long类型的整数，这个整数保存了key所指向的数据库键的过期时间（毫秒精度的UNIX时间戳）。

##### Redis的过期策略

过期策略通常有以下三种：

- 定时过期

  每个设置过期时间的key都需要创建一个定时器，到过期时间就会立即清除。该策略可以立即清除过期的数据，对内存很友好；但是会占用大量的CPU资源去处理过期的数据，从而影响缓存的响应时间和吞吐量。

- 惰性过期

  只有当访问一个key时，才会判断该key是否已过期，过期则清除。该策略可以最大化地节省CPU资源，却对内存非常不友好。极端情况可能出现大量的过期key没有再次被访问，从而不会被清除，占用大量内存。

- 定期过期

  每隔一定的时间，会扫描expires字典中一定数量的key，并清除其中已过期的key。该策略是前两者的一个折中方案。通过调整定时扫描的时间间隔和每次扫描的限定耗时，可以在不同情况下使得CPU和内存资源达到最优的平衡效果。

Redis中同时使用了惰性过期和定期过期两种过期策略。

Redis 每隔 100ms 就随机选择一些设置了过期时间的Key，检查它们是否过期，如果过期的话就删除它们。

每秒 10 次：

1. 随机测试 20 个带有过期时间的key
2. 删除已过期的key
3. 如果超过 25% 的key已过期，从步骤 1 重新开始

#### 内存淘汰机制

Redis 提供 6 种数据淘汰策略：

1. **no-eviction**（默认）

   禁止驱逐数据，也就是说当内存不足以容纳新写入数据时，新写入操作会报错。

2. **volatile-lru（least recently used）**

   从已设置过期时间的数据集中挑选最近最少使用的数据淘汰

   Redis使用的是近似LRU算法。近似LRU算法通过随机采样法淘汰数据，每次随机出5（默认）个key，从里面淘汰掉最近最少使用的key。

3. **volatile-ttl**

   从已设置过期时间的数据集中挑选将要过期的数据淘汰

4. **volatile-random**

   从已设置过期时间的数据集中任意选择数据淘汰

5. **allkeys-lru（least recently used）**

   在键空间中，移除最近最少使用的 key（这个是<span style="color: red">最常用</span>的）

6. **allkeys-random**

   从数据集中任意选择数据淘汰

4.0 版本后增加以下两种：

1. **volatile-lfu（least frequently used）**

   从已设置过期时间的数据集中挑选最不经常使用的数据淘汰

2. **allkeys-lfu（least frequently used）**

   在键空间中，移除最不经常使用的 key

#### 持久化

Redis 有两种持久化：RDB（快照）和 AOF（追加文件）

注：4.0之后增加了混合方式，结合了 RDB 和 AOF 的优点。

区别：

- RDB 是将内存中数据某一时刻的快照写入二进制文件中。
- AOF 是将每条导致数据变动的指令追加到 aof 文件中。

优缺点：

|          | RDB  | AOF  |
| -------- | ---- | ---- |
| 文件大小 | 小   | 大   |
| 重启时间 | 短   | 长   |
| 数据丢失 | 多   | 少   |

#### 事务

Redis 可以通过 MULTI，EXEC，DISCARD 和 WATCH 等命令来实现事务(transaction)功能。

使用 MULTI命令后可以输入多个命令。Redis不会立即执行这些命令，而是将它们放到队列，当调用了EXEC命令将执行所有命令。

但是，Redis 的事务和我们平时理解的关系型数据库的事务不同。

Redis 是**不支持 roll back** 的，因而不满足原子性的（而且不满足持久性）。

#### 缓存穿透

##### 什么是缓存穿透？

缓存穿透说简单点就是大量请求的 key 根本不存在于缓存中，导致请求直接到了数据库上，根本没有经过缓存这一层。

##### 解决办法

1. 参数校验

   一些不合法的参数请求直接抛出异常信息返回给客户端。

2. 缓存无效 key

   如果缓存和数据库都查不到某个 key 的数据就写一个固定值(e.g. null)到 Redis 中去并设置过期时间

3. 布隆过滤器

   把所有可能存在的请求的值都存放在布隆过滤器中，当用户请求过来，先判断用户发来的请求的值是否存在于布隆过滤器中。不存在的话，直接返回请求参数错误信息给客户端，存在的话才会继续走下面的流程。

#### 缓存雪崩

##### 什么是缓存雪崩？

缓存在同一时间大面积的失效，后面的请求都直接落到了数据库上，造成数据库短时间内承受大量请求。

##### 解决办法

**针对 Redis 服务不可用的情况：**

1. 采用 Redis 集群，避免单机出现问题整个缓存服务都没办法使用。
2. 限流，避免同时处理大量的请求。

**针对热点缓存失效的情况：**

1. 合理设置缓存过期时间(e.g. 随机)

2. 分布式缓存

   为了防止缓存服务器宕机出现的缓存雪崩，可以使用分布式缓存，分布式缓存中每一个节点只缓存部分的数据，当某个节点宕机时可以保证其它节点的缓存仍然可用。

3. 缓存预热

   避免在系统刚启动不久由于还未将大量数据进行缓存而导致缓存雪崩。

#### Redis和数据库双写一致性问题

采用 **Cache Aside Pattern**：

1. 读的时候先读缓存，如果缓存不存在的话就读数据库，取出数据库后更新缓存。
2. 写的时候，先更新数据库，再删除缓存。

##### 为什么是删除缓存，而不是更新缓存？

1. 有两个更新请求A、B，A先与B更新的数据库，但由于网络震荡，B先与A更新了缓存，此时缓存的数据就是脏数据。
2. 为了考虑性能。更新了的数据并不一定会立即有新的访问，放在缓存里占内存，还不如直接删除，有新的访问时再放进去就好了，是一种懒加载的思想。

##### 如果删除失败了，导致数据不一致怎么办？

采用延时双删策略，先删除缓存，再更新数据库，更新成功了就延时异步删除缓存。

#### 用 Redis 实现点赞功能



#### Redis 做消息队列

- 基于List的 LPUSH+BRPOP 的实现
- PUB/SUB，订阅/发布模式
- 基于Sorted-Set的实现
- 基于Stream类型的实现

#### Redis 做分布式锁

##### 利用 Redis 的 SETNX 和 EXPIRE 命令

- 加锁命令：`SETNX key value`

  当键不存在时，对键进行设置操作并返回成功，否则返回失败。KEY 是锁的唯一标识，一般按业务来决定命名。

- 解锁命令：`DEL key`

  通过删除键值对释放锁，以便其他线程可以通过 SETNX 命令来获取锁。

- 锁超时：`EXPIRE key timeout`

  设置 key 的超时时间，以保证即使锁没有被显式释放，锁也可以在一定时间后自动释放，避免资源被永远锁住。

###### SETNX 和 EXPIRE 非原子性

如果 SETNX 成功，在设置锁超时时间后，服务器挂掉、重启或网络问题等，导致 EXPIRE 命令没有执行，锁没有设置超时时间变成死锁。

1. 可以通过使用 lua 脚本保证原子性。

2. Redis在 2.6.12 版本开始，为 SET 命令增加一系列选项：

```bash
SET key value[EX seconds][PX milliseconds][NX|XX]
```

- EX seconds: 设定过期时间，单位为秒
- PX milliseconds: 设定过期时间，单位为毫秒
- NX: 仅当key不存在时设置值
- XX: 仅当key存在时设置值

set命令的nx选项，就等同于setnx命令

###### 锁误解除

如果线程 A 成功获取到了锁，并且设置了过期时间 30 秒，但线程 A 执行时间超过了 30 秒，锁过期自动释放，此时线程 B 获取到了锁；随后 A 执行完成，线程 A 使用 DEL 命令来释放锁，但此时线程 B 加的锁还没有执行完成，线程 A 实际释放的线程 B 加的锁。

通过在 value 中设置当前线程的标识，在删除之前验证 key 对应的 value 判断锁是否是当前线程持有。可生成一个 UUID 标识当前线程，使用 lua 脚本做验证标识和解锁操作。

###### 超时解锁导致并发

如果线程 A 成功获取锁并设置过期时间 30 秒，但线程 A 执行时间超过了 30 秒，锁过期自动释放，此时线程 B 获取到了锁，线程 A 和线程 B 并发执行。

A、B 两个线程发生并发显然是不被允许的，一般有两种方式解决该问题：

- 将过期时间设置足够长，确保代码逻辑在锁释放之前能够执行完成。
- 为获取锁的线程增加守护线程，为将要过期但未释放的锁增加有效时间。

###### 不可重入

可通过对锁进行重入计数，加锁时加 1，解锁时减 1，当计数归 0 时释放锁。

在本地记录重入次数，如 Java 中使用 ThreadLocal 进行重入次数统计。

本地记录重入次数虽然高效，但如果考虑到过期时间和本地、Redis 一致性的问题，就会增加代码的复杂性。另一种方式是 Redis hash 数据结构来实现分布式锁，既存锁的标识也对重入次数进行计数。

###### 无法等待锁释放

上述命令执行都是立即返回的，如果客户端可以等待锁释放就无法使用。

- 可以通过客户端轮询的方式解决该问题，当未获取到锁时，等待一段时间重新获取锁，直到成功获取锁或等待超时。这种方式比较消耗服务器资源，当并发量比较大时，会影响服务器的效率。
- 另一种方式是使用 Redis 的发布订阅功能，当获取锁失败时，订阅锁释放消息，获取锁成功后释放时，发送锁释放消息。

###### 主备切换

为了保证 Redis 的可用性，一般采用主从方式部署。主从数据同步有异步和同步两种方式，Redis 将指令记录在本地内存 buffer 中，然后异步将 buffer 中的指令同步到从节点，从节点一边执行同步的指令流来达到和主节点一致的状态，一边向主节点反馈同步情况。

在包含主从模式的集群部署方式中，当主节点挂掉时，从节点会取而代之，但客户端无明显感知。当客户端 A 成功加锁，指令还未同步，此时主节点挂掉，从节点提升为主节点，新的主节点没有锁的数据，当客户端 B 加锁时就会成功。

###### 集群脑裂

集群脑裂指因为网络问题，导致 Redis master 节点跟 slave 节点和 sentinel 集群处于不同的网络分区，因为 sentinel 集群无法感知到 master 的存在，所以将 slave 节点提升为 master 节点，此时存在两个不同的 master 节点。Redis Cluster 集群部署方式同理。

当不同的客户端连接不同的 master 节点时，两个客户端可以同时拥有同一把锁。

##### Redisson 实现简单分布式锁

对于Java用户而言，我们经常使用Jedis，Jedis是Redis的Java客户端，除了Jedis之外，Redisson也是Java的客户端，Jedis是阻塞式I/O，而Redisson底层使用Netty可以实现非阻塞I/O，该客户端是封装了锁的，继承了J.U.C的Lock接口，所以我们可以像使用ReentrantLock一样使用Redisson。

### Guava Cache

使用 CacheBuilder 就可以构建一个缓存对象，CacheBuilder使用build链式构建。

