---
title: Build Your Blog with GitHub Pages+Hexo+NexT
description: GitHub Pages+Hexo+NexT 构建博客
top: false
date: 2018-12-15 12:56:23
categories: Blog
tags: Blog
---

<img src="https://i.loli.net/2018/12/26/5c231d3ac8a4c.jpg" width="100%"/>

<!-- more -->

> 环境：
> Windows 10，x64
> node.js v10.14.2
> npm 6.5.0

## GitHub 创建 Github Pages 项目

创建一个名称为`username.github.io`的新仓库。username 为你的 GitHub 用户名。

## 搭建Hexo环境

### 安装node.js

#### 简介

> [Node.js是用来做什么的？ - 知乎](https://www.zhihu.com/question/33578075)

**Node.js**是一个 JavaScript 运行环境。

#### 下载与安装

去[官网](https://nodejs.org/zh-cn/)下载对应版本

下载完后双击傻瓜式安装即可

安装完后**win+R** 输入**cmd**打开终端，然后输入`node -v`即可查看Node版本

### 安装npm

#### 简介

npm是Node.js的包管理工具

> [npm安装 - 安装Node.js和npm - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/00143450141843488beddae2a1044cab5acb5125baf0882000)
>
> 为啥我们需要一个包管理工具呢？因为我们在Node.js上开发时，会用到很多别人写的JavaScript代码。如果我们要使用别人写的某个包，每次都根据名称搜索一下官方网站，下载代码，解压，再使用，非常繁琐。于是一个集中管理的工具应运而生：大家都把自己开发的模块打包后放到npm官网上，如果要使用，直接通过npm安装就可以直接用，不用管代码存在哪，应该从哪下载。
>
> 更重要的是，如果我们要使用模块A，而模块A又依赖于模块B，模块B又依赖于模块X和模块Y，npm可以根据依赖关系，把所有依赖的包都下载下来并管理起来。否则，靠我们自己手动管理，肯定既麻烦又容易出错。

#### 安装

安装完Node.js以后npm已经顺带被安装了。

命令行输入`npm -v`即可查看npm版本信息。

### 安装Hexo

```shell
npm install -g hexo
```

#### 初始化

新建一个空文件夹，在该目录下右键选择`Git Bash Here`（需要安装[Git客户端](https://git-scm.com/book/zh/v2/起步-安装-Git)）

执行命令（需要注意的是该命令必须在空目录下执行）：

```shell
hexo init
```

安装依赖：

```shell
npm install
```

## 自动发布

> Hexo 生成的静态文件统一存放在 public 目录下，其余的文件都是 hexo 用来生成静态网页的。
> 
> 为了能够适应不同环境(不同主机、不同系统、甚至在 GitHub 网页端操作等)，可以利用 Travis-CI/Gitlab-CI 对 Hexo 博客项目进行[持续集成](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)。

{% tabs Continuous Integration %}

<!-- tab NextT 7.7.1 -->

> 

**Travis-CI 的配置文件`.travis.yml`**

{% tabs travis.yml %}

<!-- tab 我的 -->

```yaml .travis.yml
dist: trusty
#sudo: required # 需要 sudo 权限

# addons：插件
addons:
  # 高级打包工具（英語：Advanced Packaging Tools，缩写为APT）是Debian及其衍生的Linux软件包管理器。
  apt:
    packages:
      - nasm # Netwide Assembler （简称 NASM）是一款基于英特尔 x86 架构的汇编与反汇编工具。

# 环境变量
env:
  global:
  - TZ=Asia/Shanghai

language: node_js
node_js: node # node: 指定 Node.js 版本为 latest stable Node.js release

# 只监测 source 分支
branches:
  only:
  - source

git:
  depth: false # 克隆深度
  submodules: false # Travis CI 默认情况下会克隆Git子模块

cache:
  apt: true # 缓存 apt 依赖
  directories:
    - node_modules # 缓存 node_modules 目录

before_install:
  # Git Config
  # 将 Git 子模块中的字符串 'git@github.com:' 替换为 'https://github.com/'
  # https://man.linuxde.net/sed
#  - sed -i 's/git@github.com:/https:\/\/github.com\//' .gitmodules
  # 配置 Git 用户名
- git config --global user.name "gzhennaxia"
  # 配置 Git 邮件
- git config --global user.email "gzhennaxia@163.com"

  # Restore last modified time
- git ls-files -z | while read -d '' path; do touch -d "$(git log -1 --format="@%ct"
  "$path")" "$path"; done

  # Submodules
- git submodule update --recursive --remote --init
- git clone --branch=master --single-branch https://github.com/Gzhennaxia/Gzhennaxia.github.io.git
  .deploy_git


install: npm install

before_script: 

script:
- hexo clean
- hexo g

deploy:
  provider: pages
  skip_cleanup: true
  github_token: $GH_TOKEN  # Set in the settings page of your repository, as a secure variable
  keep_history: true
  on:
    branch: source
  local-dir: public # 要发布到 GitHub Pages 的目录
  target_branch: master
```

<!-- endtab -->

<!-- tab NexT 的 -->

> [Continuous-Integration | NexT](https://theme-next.org/docs/getting-started/deployment#Continuous-Integration)

{% note info %}

根据 NexT 的配置没能成功，所以只是将过程中了解到的配置含义标注了一下

{% endnote %}

```yaml
dist: trusty # Ubuntu 版本代号 https://zh.wikipedia.org/wiki/Ubuntu%E5%8F%91%E8%A1%8C%E7%89%88%E5%88%97%E8%A1%A8
sudo: required # 需要 sudo 权限

# addons：插件
addons:
 # 添加 ssh 主机
 ssh_known_hosts:
   - github.com
   - git.coding.net
 # 高级打包工具（英語：Advanced Packaging Tools，缩写为APT）是Debian及其衍生的Linux软件包管理器。
 apt:
   packages:
     - nasm # Netwide Assembler （简称 NASM）是一款基于英特尔 x86 架构的汇编与反汇编工具。

# 环境变量
env:
 global:
   - TZ=Asia/Tokyo # Tokyo：东京，Asia/Tokyo：日本标准时区

language: node_js
node_js: node # node: 指定 Node.js 版本为 latest stable Node.js release

# 只监测 source 分支
branches:
 only:
   - source

git:
 depth: false # 克隆深度
 submodules: false # Travis CI 默认情况下会克隆Git子模块

cache:
 apt: true # 缓存 apt 依赖
 directories: 
   - node_modules # 缓存 node_modules 目录

before_install:
 # Git Config
 # 将 Git 子模块文件中的字符串 'git@github.com:' 替换为 'https://github.com/'
 # https://man.linuxde.net/sed
 - sed -i 's/git@github.com:/https:\/\/github.com\//' .gitmodules
 # 配置 Git 用户名
 - git config --global user.name "YOUR-GITHUB-NAME"
  # 配置 Git 邮件
 - git config --global user.email "YOUR-EMAIL"

 # Restore last modified time
 - "git ls-files -z | while read -d '' path; do touch -d \"$(git log -1 --format=\"@%ct\" \"$path\")\" \"$path\"; done"

 # Submodules
 - git submodule update --recursive --remote --init

 # Deploy history
 # 将上次部署的内容(master 分支的 top commit)克隆到 .deploy_git
 - git clone --branch=master --single-branch YOUR-BLOG-REPO .deploy_git

 # SSH Setup
 - openssl aes-256-cbc -K $encrypted_693585a97b8c_key -iv $encrypted_693585a97b8c_iv -in deploy_key.enc -out deploy_key -d
 - eval "$(ssh-agent -s)"
 - chmod 600 ./deploy_key
 - ssh-add ./deploy_key

install: npm install

before_script:

script:
 - hexo clean
 - hexo g -d
```

<!-- endtab -->

{% endtabs %}

<!-- endtab -->

<!-- tab NextT 5 -->

**远程仓库创建hexo分支对hexo源码进行版本控制**

1. 将远程仓库clone到本地

   ```shell
   git clone https://github.com/username/username.github.io.git
   ```

2. 创建本地分支hexo并切换到该分支

   ```shell
   git checkout -b hexo
   ```

3. 将本地仓库里的文件清空（除了`.git`文件），替换为hexo源码文件（即`hexo init`生成的那些文件）。

4. 添加并提交到本地仓库

   ```shell
   git add .
   git commit -m "提交信息"
   ```

5. 创建并提交到远程hexo分支

   ```shell
   git push --set-upstream origin hexo
   ```

**GitHub生成Access Token**

头像>Settings>Developer settings>Personal access tokens

点击Generate new token生成一个token

![img](https://i.loli.net/2018/12/15/5c14c217c5fb9.jpg)

注意：token生成后只又一次查看的机会，一定要保存好，否则要删掉重新生成

**设置Travis-CI**

使用GitHub账号登录[Travis-CI](https://travis-ci.org/)

![img](https://i.loli.net/2018/12/15/5c14c08f2392e.jpg)

点击Settings，将GitHub生成的token添加到里面

![img](https://i.loli.net/2018/12/15/5c14c305516b7.jpg)

**hexo源码仓库中添加Travis-CI的配置文件`.travis.yml`**

```yaml
language: node_js  #设置语言

node_js: stable  #设置相应的版本

## 开始构建
before_install:
  - export TZ='Asia/Shanghai'  #统一构建环境和博客配置的时区, 防止文章时间错误
  
install:
  - npm install  #配置Hexo环境

script:
  - hexo cl  #清除
  - hexo g  #生成

after_script:
  - git clone https://${GH_REF} .deploy_git
  - cd .deploy_git
  - git checkout master
  - cd ../
  - mv .deploy_git/.git/ ./public/
  - cd ./public
  - git config user.name "username"  #github用户名
  - git config user.email "email@xxx.com"  #邮箱
  - git add .
  - git commit -m "Travis CI Auto Builder at `date +"%Y-%m-%d %H:%M"`"  #提交时的说明
  - git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master  #GH_TOKEN是在Travis中配置Token的名称
## 结束构建

branches:
  only:
    - hexo  #只监测master之外新增的hexo分支
env:
 global:
   - GH_REF: github.com/username/username.github.io.git  #设置GH_REF

cache:
  directories:  #缓存特定目录, 加快构建速度
    - node_modules
```

> 原理图
>
> ![img](https://i.loli.net/2018/12/25/5c219ecc93bcd.png)

<!-- endtab -->

{% endtabs %}

## 主题升级

> 为了更平滑的升级 NexT 主题，推荐使用 [Hexo-Way](https://theme-next.org/docs/getting-started/data-files)

{% tabs upgrade-theme %}

<!-- tab Developer-Way -->

{% note %}

使用 `Hexo-Way` 的话，每次对站点配置文件的改动，需要重新执行 `Hexo s` 才能预览结果。但 NexT 是有热部署的，启动后直接刷新即可。但是采用 `NexT-Way` 的话，更新主题时，关于自定义的改动（除了主题配置文件以外的文件的改动）还是需要解决合并冲突的。所以还不如就全部通过合并冲突来解决。

{% endnote %}

直接在主题目录下执行 `git pull`，在 `WebStrom` 等 IDE 中解决冲突即可。IDE 对合并冲突都有很好的支持。

<!-- endtab -->

<!-- tab Hexo-Way -->

{%  note info %}

如果使用 `Hexo-Way` 方式，那关于 `favicon` `avatar` 等配置在本地环境中会失效(因为路径问题)，但不影响线上效果。

{% endnote %}

1. 确保不存在 `/source/_data/next.yml` 文件

2. 站点配置文件中添加 `theme_config` 属性

3. 将需要的配置从主题配置文件中 Copy 到该属性下。

   ```yaml _config.yml
   theme_config:
     # Sidebar Avatar
     avatar:
       # Replace the default image and set the url here.
       #  url: #/images/avatar.gif
       url: /images/avatar.jpg
       # If true, the avatar will be dispalyed in circle.
       rounded: true
       # If true, the avatar will be rotated with the cursor.
       rotated: true
   ```

想要升级时，只需在终端里切到 `themes/next` 目录下，执行 `git pull` 命令，并将需要改动的配置 Copy 到站点配置文件中即可。

<!-- endtab -->

<!-- tab NexT-Way -->

> [Date File](https://theme-next.org/docs/getting-started/data-files)

<!-- endtab -->

{% endtabs %}

## 主题优化

> [NexT使用文档](http://theme-next.iissnan.com/)

### 网页图标

> [Configuring Favicon | NexT](https://theme-next.org/docs/getting-started/#Configuring-Favicon)

```yaml themes/next/_config.yml
favicon:
  small: /images/favicon-16x16-next.png
  medium: /images/favicon-32x32-next.png
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  android_manifest: /images/manifest.json
  ms_browserconfig: /images/browserconfig.xml
```

### 头像旋转

{% tabs Avatar %}

<!-- tab NexT 7.7.1 -->

> [Configuring-Avatar | NexT](https://theme-next.org/docs/getting-started/#Configuring-Avatar)

```yaml themes/next/_config.yml
# Sidebar Avatar
avatar:
  # Replace the default image and set the url here.
  url: /images/avatar.jpg
  # If true, the avatar will be dispalyed in circle.
  rounded: true
  # If true, the avatar will be rotated with the cursor.
  rotated: true
```

<!-- endtab -->

<!-- tab NexT 5 -->

> [Hexo Next 头像圆形并旋转](http://www.iooeo.com/2017/07/20/Hexo-Next-头像圆形并旋转/)

注意[stylus中文版参考文档之注释(Comments)](https://www.zhangxinxu.com/jq/stylus/comments.php)

单行注释使用`//`,多行使用`/* */`

修改`/themes/next/source/css/_common/components/sidebar/sidebar-author.styl`如下：

```css
.site-author-image {
  display: block;
  margin: 0 auto;
  padding: $site-author-image-padding;
  max-width: $site-author-image-width;
  height: $site-author-image-height;
  border: $site-author-image-border-width solid $site-author-image-border-color;
  opacity: hexo-config('avatar.opacity') is a 'unit' ? hexo-config('avatar.opacity') : 1;
  // 头像圆形样式
  /* start */
  border-radius: 50%
  webkit-transition: 1.4s all;
  moz-transition: 1.4s all;
  ms-transition: 1.4s all;
  transition: 1.4s all;
  /* end */
}

if hexo-config('avatar.rounded') {
.site-author-image {
  border-radius: 100%;
}
}

if hexo-config('avatar.rotated') {
.site-author-image {
  -webkit-transition: -webkit-transform 1.0s ease-out;
  -moz-transition: -moz-transform 1.0s ease-out;
  -ms-transition: -ms-transform 1.0s ease-out;
  transition: transform 1.0s ease-out;
}

.site-author-image:hover {
  -webkit-transform: rotateZ(360deg);
  -moz-transform: rotateZ(360deg);
  -ms-transform: rotate(360deg);
  transform: rotateZ(360deg);
}
}

.site-author-name {
  margin: $site-author-name-margin;
  text-align: $site-author-name-align;
  color: $site-author-name-color;
  font-weight: $site-author-name-weight;
}

.site-description {
  margin-top: $site-description-margin-top;
  text-align: $site-description-align;
  font-size: $site-description-font-size;
  color: $site-description-color;
}

// 头像旋转事件
/* start */
.site-author-image:hover {
  background-color: #55DAE1;
  webkit-transform: rotate(360deg) scale(1.1);
  moz-transform: rotate(360deg) scale(1.1);
  ms-transform: rotate(360deg) scale(1.1);
  transform: rotate(360deg) scale(1.1);
}
/* end */
```

<!-- endtab -->

{% endtabs %}

### 文章预览

> [如何设置「阅读全文」？](http://theme-next.iissnan.com/faqs.html#read-more)

#### 文章封面

1. 关闭**主体配置文件**中的`Automatically Excerpt`

   ```shell
   # Automatically excerpt description in homepage as preamble text.
   excerpt_description: false
   
   # Automatically Excerpt. Not recommend.
   # Please use <!-- more --> in the post to control excerpt accurately.
   auto_excerpt:
     enable: false
     length: 150
   ```

2. 在`手动截断标签`上只放一张图片即可

   ```shell
   ![NexT](https://i.loli.net/2018/12/26/5c231d3ac8a4c.jpg)
   <!-- more -->
   ```

### 评论系统

> [Hexo-Next 添加 Gitment 评论系统](https://ryanluoxu.github.io/2017/11/27/Hexo-Next-添加-Gitment-评论系统/)
>
> [hexo博客配置-添加评论系统-gitment和valine-需注册](https://xiaotiandi.github.io/publicBlog/2018-09-19-d196c9ad.html)
>
> [为 hexo NexT 添加 Gitment 评论插件](https://meesong.github.io/StaticBlog/2017/NexT+Gitment/)
>
> [在hexo next主题上使用gitalk](https://github.com/gitalk/gitalk/wiki/在hexo-next主题上使用gitalk)
>
> [为你的Hexo加上评论系统-Valine](https://www.bluelzy.com/articles/use_valine_for_your_blog.html)

![img](https://i.loli.net/2018/12/17/5c171d0e2a281.jpg)

![img](https://i.loli.net/2018/12/17/5c171f261cf6c.jpg)

由于gitment长期未维护,所有最后使用gitalk,之后可以增加其他三方的评论插件更加灵活.

如需取消某个 页面/文章 的评论，在 md 文件的 [front-matter ](https://hexo.io/docs/front-matter.html)中增加 `comments: false`

### 自定义内建标签

> [Hexo next博客添加折叠块功能添加折叠代码块](https://blog.rmiao.top/hexo-fold-block/)

### 进度条

> [**theme-next-pace**](https://github.com/theme-next/theme-next-pace)

### 自定义页面样式

> [2017年最新基于hexo搭建个人免费博客——自定义页面样式一](http://www.cduyzh.com/hexo-settings-3/)
>
> [优化 网页样式布局](https://reuixiy.github.io/technology/computer/computer-aided-art/2017/06/09/hexo-next-optimization.html#优化-网页样式布局)

#### 调整文章元信息区域离文章主体的间距

一般文章都会添加`description`和一张图片作为封面，但元信息离正文太远视野上不舒服，故做如下调整。

![Before](https://i.loli.net/2018/12/26/5c23347219069.jpg)

{% tabs posts-expand %}

<!-- tab NexT 7.7.1 -->
修改`themes/next/source/css/_schemes/Mist/_posts-expand.styl`

```css
// before
.posts-expand .home {

  .post-meta {
    margin: 5px 0 20px 0;
  }
}

// before
.posts-expand .home {

  .post-meta {
    margin: 5px 0 10px 0;
  }
}
```

<!-- endtab -->

<!-- tab NexT 5 -->
修改`themes\next\source\css\_common\components\post\post-meta.styl`如下：

```css
// before
.posts-expand .post-meta {
  margin: 3px 0 60px 0;
  ...
}

// after
.posts-expand .post-meta {
  margin: 3px 0 10px 0;
  ...
}
```
<!-- endtab -->
{% endtabs %}



修改`themes\next\source\css\_common\components\post\post-meta.styl`如下：

```css
// before
.posts-expand .post-meta {
  margin: 3px 0 60px 0;
  ...
}

// after
.posts-expand .post-meta {
  margin: 3px 0 10px 0;
  ...
}
```

注意：在 Next.7 中，上述文件及改动如下

`themes/next/source/css/_schemes/Mist/_posts-expand.styl`

```css
// before
.posts-expand .home {

  .post-meta {
    margin: 5px 0 20px 0;
  }
}

// before
.posts-expand .home {

  .post-meta {
    margin: 5px 0 10px 0;
  }
}
```



### 显示文章更新时间

> [hexo添加文章更新时间](https://blog.csdn.net/ganzhilin520/article/details/79053399)

修改主题配置文件的

```yaml
post_meta:
  updated_at: 
    enabled: true
```

要想具体显示到时分秒,则修改站点配置文件的

```yaml
date_format: YYYY-MM-DD HH:mm:ss
```

### 复制代码按钮

> [HEXO优化之（二）----添加复制功能](https://www.ofind.cn/blog/HEXO/HEXO优化之（二）-添加复制功能.html)
>
> [Hexo NexT主题代码块添加复制功能](http://www.missfli.com/2018/06/19/github-hexo-next-08.html)

### 显示当前浏览进度

> [7.浏览页面的时候显示当前浏览进度](https://www.jianshu.com/p/3ff20be8574c)

### 背景图片

> [添加背景图](https://www.simon96.online/2018/10/12/hexo-tutorial/#添加背景图)

### 文章加密

> [hexo-blog-encrypt](https://github.com/MikeCoder/hexo-blog-encrypt/blob/master/ReadMe.zh.md)

注意实在**站点配置文件**中添加

```yaml
# Security
##
encrypt:
    enable: true
```

#### 给文章添加密码：

```yaml
---
title: hello world
date: 2016-03-30 21:18:02
tags:
    - fdsfadsfa
    - fdsafsdaf
password: Mike
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---
```

- password: 是该博客加密使用的密码
- abstract: 是该博客的摘要，会显示在博客的列表页
- message: 这个是博客查看时，密码输入框上面的描述性文字

### 二次元看板娘

> [hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d/blob/master/README.zh-CN.md)

### 站内搜索

> [theme-next/**hexo-generator-searchdb**](https://github.com/theme-next/hexo-generator-searchdb)

1. `npm install hexo-generator-searchdb --save`

2. **站点配置文件**中添加如下配置：

   ```yaml
   search:
     path: search.xml
     field: post
     format: html
     limit: 10000
   ```

3. **主题配置文件**中打开如下配置：

   ```yaml
   # Local search
   # Dependencies: https://github.com/theme-next/hexo-generator-searchdb
   local_search:
     enable: true
   ```

### 文章置顶+置顶标签

> [hexo博客优化之文章置顶+置顶标签](https://blog.csdn.net/qwerty200696/article/details/79010629)
>
> [Swig » 文档 » 注释](https://github.mayuxiao.com/swig.zh-CN/docs/index.html#comments)

1. 使用插件[hexo-generator-index-pin-top](https://github.com/netcan/hexo-generator-index-pin-top)

   ```yaml
   $ npm uninstall hexo-generator-index --save
   $ npm install hexo-generator-index-pin-top --save
   ```

2. 在需要置顶的文章的`Front-matter`中加上`top: true`

3. `/blog/themes/next/layout/_macro` 目录下的`post.swig`文件，定位到``标签下，做如下修改：

   ```html
   <div class="post-meta">
             <span class="post-time">
   
               {% set date_diff = date(post.date) != date(post.updated) %}
               {% set time_diff = time(post.date) != time(post.updated) %}
               {% set datetime_diff = date_diff or time_diff %}
   
               {# 置顶标签 #}
               {% if post.top %}
                 <i class="fa fa-thumb-tack"></i>
                 <font color=FFC0CB>置顶</font>
                 <span class="post-meta-divider">|</span>
               {% endif %}
               {# 置顶标签 #}
               ...
       </span>
   </div>
   ```

### 版权声明

> [“知识共享”（CC协议）简单介绍](https://zhuanlan.zhihu.com/p/20641764)

{% tabs creative-commons %}

<!-- tab NetT 7.7.1 -->

> [Creative Commons | NexT](https://theme-next.org/docs/theme-settings/#Creative-Commons)

<!-- endtab -->

<!-- tab NetT 5 -->

1. 修改**主题配置文件**中如下配置：

   ```yaml \source\_data
   # Creative Commons 4.0 International License.
   # https://creativecommons.org/share-your-work/licensing-types-examples
   # Available: by | by-nc | by-nc-nd | by-nc-sa | by-nd | by-sa | zero
   creative_commons:
     license: by-nc-sa
     sidebar: false
     post: true
   ```

2. 修改**站点配置文件**中如下配置：

   ```yaml _config.yml
   # URL
   ## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
   url: http://username.github.io
   ```

<!-- endtab -->

{% endtabs %}

### 首页隐藏指定文章

> [Hexo 设置首页隐藏指定文章](https://blog.csdn.net/m0_37323771/article/details/80672271)

1. 对主题 index.swig 文件做如下修改

   ```swift Hexo\themes\next\layout
   {% for post in page.posts %}
   	{# 首页隐藏指定文章 #}
   	{% if post.hidden != true %}
           {{ post_template.render(post, true) }}
   	{% endif %}
   	{# 首页隐藏指定文章 #}
   {% endfor %}
   ```

2. 在需要首页隐藏的文章 front-matter 中添加 `hidden: true`

### Emoji 表情

> [Hexo中添加emoji表情](https://chaxiaoniu.oschina.io/2017/07/10/HexoAddEmoji/)
>
> Hexo默认采用 [hexo-renderer-marked](https://github.com/hexojs/hexo-renderer-marked) 这个渲染器，但其不支持插件扩展。还有一个支持插件扩展的是 [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it)，可以使用 [markdwon-it-emoji](https://github.com/markdown-it/markdown-it-emoji) 插件来支持 emoji。

1. 替换渲染器

   ```shell
   npm un hexo-renderer-marked --save
   npm i hexo-renderer-markdown-it --save
   ```

2. 安装`markdown-it-emoji`插件

   ```shell
   npm i markdown-it-emoji --save
   ```

3. 站点配置文件添加 markdown-it 配置

   ```yaml _config.yml
   ## hexo-renderer-markdown-it
   ## Markdown-it config
   ## Docs: https://github.com/celsomiranda/hexo-renderer-markdown-it/wiki
   markdown:
     render:
       html: true
       xhtmlOut: false
       breaks: true
       linkify: true
       typographer: true
       quotes: '“”‘’'
     plugins:
       - markdown-it-abbr
       - markdown-it-footnote
       - markdown-it-ins
       - markdown-it-sub
       - markdown-it-sup
       - markdown-it-emoji  ## add emoji
     anchors:
       level: 2
       collisionSuffix: 'v'
       # If `true`, creates an anchor tag with a permalink besides the heading.
       permalink: false
       permalinkClass: header-anchor
       # The symbol used to make the permalink
       permalinkSymbol: ¶
   ```

4. 使用

   在 [EMOJI CHEAT SHEET](https://www.webfx.com/tools/emoji-cheat-sheet/) 中找你想要的表情，点击即可复制。😄

### 文件下载功能

1. 在 `source` 目录下，新建 `download` 目录
2. 通过诸如 `[点击下载 xxx.pdf](/download/xxx.pdf)` 这样的链接，提供下载功能。

### 标签插件

> [标签插件 ｜ Hexo](https://hexo.io/zh-cn/docs/tag-plugins.html)
>
> [标签插件| NexT](https://theme-next.org/docs/tag-plugins/)
>
> [在hexo-NexT中插入note提示块](https://jinnsjj.github.io/uncategorized/hexo-next-note/)

#### [Note](https://theme-next.org/docs/tag-plugins/note)

{% note default %}
default 提示块标签
{% endnote %}

{% note primary %}
primary 提示块标签
{% endnote %}

{% note success %}
success 提示块标签
{% endnote %}

{% note info %}
info 提示块标签
{% endnote %}

{% note warning %}
warning 提示块标签
{% endnote %}

{% note danger %}
danger 提示块标签
{% endnote %}

主题配置文件中修改风格

```yml
# Note tag (bs-callout)
note:
  # Note tag style values:
  #  - simple    bs-callout old alert style. Default.
  #  - modern    bs-callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: flat
  icons: true
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 0
```

#### [Tabs](https://theme-next.org/docs/tag-plugins/tabs)

{% tabs First unique name %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}

```
{% tabs First unique name %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}
```

## 填坑记录

### 选用主题后页面空白

原因：themes目录下主题相关文件未正确提交到远程仓库

解决：

1. 删除主题目录下的`.git`目录和`.gitignore`文件
2. `git rm --cached 主题目录`
3. `git add 主题目录`
4. `git push`

### 命令 `hexo d` 无反应

原因：站点配置文件中关于部署的部分没有配置

```yaml _config.yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: ''
```

解决方法：补充相关配置

```yaml _config.yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: https://github.com/Gzhennaxia/Gzhennaxia.github.io.git
  branch: master
```

### 命令 `hexo d` 报错：`ERROR Deployer not found: git`

原因：没安装`hexo-deployer-git`插件

解决方法：安装`hexo-deployer-git`插件

```shell
npm install hexo-deployer-git --save
```

## 写作

### 布局

> [布局](https://hexo.io/zh-cn/docs/writing.html)

Hexo 有三种默认布局：`post`、`page` 和 `draft`，它们分别对应不同的路径，而您自定义的其他布局和 `post` 相同，都将储存到 `source/_posts` 文件夹。

| 布局  | 路径           |
| :---- | :------------- |
| post  | source/_posts  |
| page  | source         |
| draft | source/_drafts |

#### 草稿

Hexo 的一种特殊布局：`draft`，这种布局在建立文章时会被保存到 `source/_drafts` 文件夹，您可通过 `publish` 命令将草稿移动到 `source/_posts` 文件夹。

```shell
$ hexo publish [layout] <filename>
```

注意：

1. `hexo new`命令新建文章时会将特殊字符（空格、加号等）转化为`-`

   eg：

   ```shell
   $ hexo new "GitHub Pages+Hexo+NexT"
   INFO  Created: E:\xxx\Hexo\source\_posts\GitHub-Pages-Hexo-NexT.md
   ```

2. 在使用`publish`命令发布草稿时需要用**文件名**，而不是文章标题

   eg：

   ```shell
   $ hexo publish post GitHub-Pages-Hexo-NexT # post可以省略，因为layout默认就是post
   INFO  Published: E:\Github\Hexo\source\_posts\GitHub-Pages-Hexo-NexT.md
   ```

1. 文件名为空时默认发布第一篇草稿

   eg：

    ```shell
    $ hexo publish post .
    # 或者
    $ hexo publish post ""
    ```

### 代码块

[**指定语言，附加说明和网址**](https://hexo.io/zh-cn/docs/tag-plugins.html#代码块)

1. Hexo 格式

   代码：

   ```swift
   {% codeblock lang:java title http://www.baidu.com link test %}
   public static void main(String[] args) {
   	...
   }
   {% endcodeblock %}
   ```

   样式：

   ![img](https://i.loli.net/2019/01/04/5c2ec9c02da97.jpg)

2. Markdown 格式

   代码：

   ```java title http://www.baidu.com link test
   public static void main(String[] args) {
   	...
   }
   ```

   样式：

   ![img](https://i.loli.net/2019/01/04/5c2ec9c02da97.jpg)

### 引用站内文章

> [Hexo引用站内文章](https://www.jibing57.com/2017/10/30/how-to-use-post-link-on-hexo/)

#### 语法：

   ```swift
{% post_link slug [title] %}
   ```

- slug

  _posts 文件夹下需要引用的文章的 markdown 文件的名字，不带后缀

- title

  链接显示的文字

#### eg：

```swift
{% post_link Comments 留言板 %}
```

#### 效果：

[留言板](https://libo9527.github.io/2019/01/03/Comments/)

## 底层原理

> [next主题的模板引擎swig语法介绍](https://www.jianshu.com/p/c5d333e6353c)

```

```