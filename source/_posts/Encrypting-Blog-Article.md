---
title: Encrypting Blog Article
description: 给博客文章加密
comments: false
top: false
reward_settings:
  enable: false
  comment: Donate comment here.
date: 2020-02-23 20:06:26
categories:
- Blog
- Building
tags:
- Blog
- Encrypt
---

<img src="https://dotlayer.com/wp-content/uploads/2018/11/dotlayer.com-how-to-encrypt-decrypt-files-with-openssl-on-ubuntu-and-mac-os-x-1500x750.jpg" width="100%"/>

<!-- more -->

> [hexo-blog-encrypt | GitHub](https://github.com/MikeCoder/hexo-blog-encrypt)

## 使用

1. 安装 `hexo-blog-encrypt` 插件

   ```npm
   npm install --save hexo-blog-encrypt
   ```

2. 博客文章中添加相应配置

   ```yaml
   password: mikemessi
   abstract: Here's something encrypted, password is required to continue reading.
   message: Hey, password is required here.
   wrong_pass_message: Oh, this is an invalid password. Check and try again, please.
   wrong_hash_message: Oh, these decrypted content cannot be verified, but you can still have a look.
   ```

## 影响

1. 加密博文中的代码块样式风格不能正确渲染
2. 加密博文中的代码块超出边界