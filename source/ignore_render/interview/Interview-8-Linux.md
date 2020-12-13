## Linux

### 命令

#### lsof

查看端口对应的进程ID

`lsof -i:80`

```bash
iMacDev110:~ libo$ lsof -i:80
COMMAND     PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
Google      596 libo   66u  IPv4 0x71a3fffb3c30abf9      0t0  TCP 192.168.0.158:58179->sfo07s17-in-f3.1e100.net:http (ESTABLISHED)
```



#### ps

查看所有Java进程

`ps -ef | grep java`

```bash
iMacDev110:~ libo$ ps -ef | grep java
  504   584   385   0  91120  ??         6:58.10 /Applications/IntelliJ IDEA.app/Contents/jdk/Contents/Home/jre/bin/java
```



#### top

**top命令**可以实时动态地查看系统的整体运行情况。

```bash
Processes: 438 total, 2 running, 436 sleeping, 2376 threads            11:18:31
Load Avg: 1.90, 1.72, 1.81  CPU usage: 1.44% user, 3.0% sys, 95.55% idle
SharedLibs: 240M resident, 66M data, 109M linkedit.
MemRegions: 173647 total, 5152M resident, 101M private, 1590M shared.
PhysMem: 15G used (2721M wired), 1106M unused.
VM: 2484G vsize, 1372M framework vsize, 665337(0) swapins, 1212872(0) swapouts.
Networks: packets: 15111834/11G in, 13503646/5025M out.
Disks: 5491545/66G read, 6948210/98G written.

PID    COMMAND      %CPU TIME     #TH   #WQ  #PORTS MEM    PURG   CMPRS  PGRP
99644  MTLCompilerS 0.0  00:00.05 2     2    24     6572K  0B     6556K  99644
99642  com.apple.We 0.0  00:02.86 4     1    95     4404K  0B     3160K  99642
99641  com.apple.We 0.0  00:01.17 4     1    117    49M    0B     10M    99641
99640  IINA         0.0  01:14.36 11    2    426    107M   0B     55M    99640
99591  PIPAgent     0.0  00:01.52 2     1    68     2664K  0B     1456K  99591
99558  com.apple.pr 0.0  00:01.86 3     1    317    28M    0B     18M    99558
99551  System Prefe 0.0  00:01.84 3     1    288    28M    0B     14M    99551
99520  MTLCompilerS 0.0  00:00.03 2     2    24     4932K  0B     4920K  99520
99519  IMRemoteURLC 0.0  00:00.19 3     1    71     2864K  0B     1804K  99519
```

查看某个进程的内存占用情况

`top -p pid`

#### stat

**stat命令**用于显示文件的状态信息。stat命令的输出信息比[ls](http://man.linuxde.net/ls)命令的输出信息要更详细。

#### grep

日志文件中根据关键词搜索，并加上颜色

`grep "orderId" info.log --color=auto`

```bash
[tomcat8@3f037c3314ba sst-mobile]$ grep "orderId" info.20201117.txt 
2020-11-17 00:00:00,854 -- com.sst.service.impl.AutoOrderCombinedServiceImpl            [135] -- Auto order combination for user Id:[2],whId:[10],orderId:[217292]
```





#### vim

#### cat

#### tail

#### netstat

**netstat命令**用来打印Linux中网络系统的状态信息，可让你得知整个Linux系统的网络情况。

