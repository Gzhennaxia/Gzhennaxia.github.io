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

![](https://i.loli.net/2018/12/25/5c2240654f22b.png)

## 单线程架构

Redis在同一时刻只会执行一条命令

### 单线程为什么这么快

1. 纯内存
2. 非阻塞IO
3. 避免线程切换和竞态消耗