---
title: Git
description: Git是目前世界上最先进的分布式版本控制系统
categories:
 - Version Control
tags:
 - Git
---

<img src="https://git-scm.com/images/logos/2color-lightbg@2x.png" width="100%"/>

<!-- more -->

> [Pro Git](https://git-scm.com/book/zh/v2)

## 下载

[官网](https://git-scm.com/)

由于众所周知的原因，从上面的链接下载git for windows最好挂上一个代理，否则下载速度十分缓慢。推荐从 [Git for Windows 国内下载站](https://github.com/waylau/git-for-win) 下载。

## 安装

根据安装程序一步步安装即可。

注意一下几个地方：

1. Adjusting your PATH environment

   勾选第一个选项：Use Git from Git Bash only

   因为这种方式最安全。

2. Choosing HTTPS transport backend

   勾选第一个选项：Use the OpenSSL library

3. Configuring the terminal emulator to use with Git Bash

   勾选第一个选项：Use MinTTY

其他的配置使用默认的即可。

## 配置

> [初次运行 Git 前的配置](https://git-scm.com/book/zh/v1/%E8%B5%B7%E6%AD%A5-%E5%88%9D%E6%AC%A1%E8%BF%90%E8%A1%8C-Git-%E5%89%8D%E7%9A%84%E9%85%8D%E7%BD%AE)

## 命令

### `git reset`

> [git reset 命令详解](https://www.jianshu.com/p/9fc1b6b354f8)
>
> [git reset 命令详解（一）—— Git 学习笔记 07](https://blog.csdn.net/longintchar/article/details/81843048)
>
> [5.2 代码回滚：Reset、Checkout、Revert 的选择· geeeeeeeeek ...](https://github.com/geeeeeeeeek/git-recipes/wiki/5.2-代码回滚：Reset、Checkout、Revert-的选择)

### `git reflog`



## 命令场景

### 克隆指定分支

` git clone -b branch_name repo_url`

### 克隆到指定目录

`git clone repo_url dir_path`



##  实操

### 恢复 `git reset -hard` 的误操作

> [恢复 git reset -hard 的误操作](https://www.cnblogs.com/mliudong/archive/2013/04/08/3007303.html)

#### 场景描述

Git 本地 Add、Commit 后没有 Push 到远程，然后 reset 到了某个版本，想要恢复到刚才到 Commit 版本。

#### 方法

1. 执行 `git reflog` 查看所有提交记录

   ```shell
   $ git reflog
   00a3483b HEAD@{1}: reset: moving to 00a3483bd0bf4a53de63bcdd1a17b394a542618e
   c9b9d236 HEAD@{2}: commit: update
   ```

2. 执行 `git reset c9b9d236` 恢复到上一次的提交

