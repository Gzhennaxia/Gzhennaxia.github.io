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

# 下载

[官网](https://git-scm.com/)

由于众所周知的原因，从上面的链接下载git for windows最好挂上一个代理，否则下载速度十分缓慢。推荐从 [Git for Windows 国内下载站](https://github.com/waylau/git-for-win) 下载。

# 安装

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

# 配置

> [初次运行 Git 前的配置](https://git-scm.com/book/zh/v1/%E8%B5%B7%E6%AD%A5-%E5%88%9D%E6%AC%A1%E8%BF%90%E8%A1%8C-Git-%E5%89%8D%E7%9A%84%E9%85%8D%E7%BD%AE)

# 常用命令

## 克隆指定分支

` git clone -b branch_name repo_url`

## 克隆到指定目录

`git clone repo_url dir_path`

