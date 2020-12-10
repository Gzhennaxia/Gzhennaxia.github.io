## 服务器

### Tomcat

### Nginx

#### 负载均衡的6种策略

1. 轮询（默认）

   ```
   upstream backserver {
   	server 192.168.0.14;
   	server 192.168.0.15;
   }
   ```

2. 指定权重
    指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况。

   ```
   upstream backserver {
   	server 192.168.0.14 weight=8;
   	server 192.168.0.15 weight=10;
   }
   ```

   权重越高，访问概率越大。

3. ip_hash

   每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session共享问题。

   ```
   upstream backserver {
   	ip_hash;
   	server 192.168.0.14:88;
   	server 192.168.0.15:80;
   }
   ```

4. 最少连接

   ```
   upstream item { # item名字可以自定义
   	least_conn;
   	server 192.168.101.60:81;
   	server 192.168.101.77:80;
   }
   ```

5. fair（第三方）
   按后端服务器的响应时间来分配请求，响应时间短的优先分配。

   ```
   upstream backserver {
   	server server1;
   	server server2;
   	fair;
   }
   ```

6. url_hash（第三方）
    按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。

   ```
   upstream backserver {
   	server squid1:3128;
   	server squid2:3128;
   	hash $request_uri;
   	hash_method crc32;
   }
   ```

最后需要在server.location中指定上面定义的upstream

```
server{
	listen: 80
	location: {
		proxy_pass http://backserver
	}
}
```

#### 负载均衡参数

```
下面的参数可同时配置，使用空格分开即可
'配置方式 server ip:端口 参数'

- 'weight 权重'
# weight = 数值 (值越高被选中的概率也就越高)

- 'max_fails 失败多少次踢出队列'
# max_fails = 数值

- 'fail_timeout 踢出队列后重新探测时间'
# fail_timeout = 60s (s = 秒)

- 'max_conns 最大连接数'
# max_conns = 800 为防止单机性能过载可以根据实际情况设置
```

