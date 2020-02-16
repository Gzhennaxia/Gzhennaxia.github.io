---
title: Search Services For Blog
description: 博客站内搜索功能
date: 2020-02-16 00:49:29
categories: Blog
tags: Blog

---

<img src="https://codecamp.vn/blog/wp-content/uploads/2019/12/67e4f643-6b12-49a5-9f08-d2e3fef18633-760x400.jpeg" width="100%"/>

<!-- more -->

## 站内搜索服务

NexT 7 提供了 Algolia/Local/Swiftype 三种集成方式。

{% note info %}

目前博文数量并不多，搜索时长还在可接受范围内，所以选择最简单的本地搜索方式。

{% endnote %}

{% tabs search-services, 2 %}

<!-- tab Algolia -->

还没用过

<!-- endtab -->

<!-- tab Local -->

{% note %}

原理是通过 hexo-generator-search 插件在本地生成一个 search.xml 文件，通过这个文件实现搜索功能。

{% endnote %}

<div style="width: 100%;
            height: 300px;
            background-image: url(http://qn.mintools.net/mts/20180418/3853306637468672);
            background-repeat: no-repeat;
            background-size: 703px 756px;
            background-position: 0px 0px;"></div>

1. 安装 `hexo-generator-searchdb` 插件

   项目根目录下执行以下命令

   ```shell
   $ npm install hexo-generator-searchdb
   ```

2. 站点配置文件中添加以下内容

   ```yaml _config.yml
   search:
     path: search.xml
     field: post
     format: html
     limit: 10000
   ```

3. 主题配置文件中打开本地搜索

   ```yaml themes/next/_config.yml
   # Local Search
   # Dependencies: https://github.com/theme-next/hexo-generator-searchdb
   local_search:
     enable: true
     # If auto, trigger search by changing input.
     # If manual, trigger search by pressing enter key or search button.
     trigger: auto
     # Show top n results per article, show all results by setting to -1
     top_n_per_article: 1
     # Unescape html strings to the readable one. 将 html 字符转义为可读性字符
     unescape: false
     # Preload the search data when the page loads.
     preload: false
   ```

   

<!-- endtab -->

<!-- tab Swiftype -->

只对企业邮箱开放注册，只能试用 14 天，之后收费！

<!-- endtab -->

{% endtabs %}