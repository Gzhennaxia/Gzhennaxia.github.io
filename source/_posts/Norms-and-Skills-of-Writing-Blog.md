---
title: Norms and Skills of Writing Blog
description: 博客写作的规范与技巧
date: 2020-02-16 11:31:57
categories: 
- Norms and Skills
- Blog Writing
tags:
- Blog Writing
- Norms and Skills
---

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTIMyfLJHWfokz5hrXfdFZMpwxNe39khM5R4U99ZQqesqZi-uIT" width="100%"/>

<!-- more -->

## 图片

### 引用

#### 本地图片

> [Hexo博客搭建之在文章中插入图片](https://yanyinhong.github.io/2017/05/02/How-to-insert-image-in-hexo-post/)

将图片统一放在 `source/post_image` 文件夹中，通过以下地址引用。

```markdown
![](source/post_image/xxx.jpg)
```

### 缩放、截取

{% note %}

博客中经常要用到网络上的一些图片，但又需要在此基础上进行一些改动，而且并不想通过图片编辑软件进行编辑再上传图片服务器这种复杂耗时的方式。

{% endnote %}

```html
<div style="width: 100%;
            height: 300px;
            background-image: url(http://xxxx/xxx.xxx.jpg);
            background-size: 703px 756px;
            background-position: 0px 0px;"></div>
```

通过调整相应属性即可

- background-size

  作用：控制缩放，尽量等比数列缩放

  取值：[x 坐标，y 坐标]

  ![](/post_image/background-size-x-y.jpg)

- background-position

  作用：背景图片的初始位置

  取值：[x 坐标，y 坐标]

### 默认图片

{% note %}

博客中的图片如果加载失败则使用默认图片代替。

{% endnote %}

> https://blog.csdn.net/HaHa_Sir/article/details/78667659
> 
