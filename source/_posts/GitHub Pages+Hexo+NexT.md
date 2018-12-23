---
title: GitHub Pages+Hexo+NexT
categories:
 - Blog
tags:
 - GitHub Pages
 - Hexo
 - NexT
---

# GitHub Pages+Hexo+NexT

> node.js	10.14.2
>
> npm 	6.4.1
>
> hexo	3.8.0
>
> NexT	6.6.0

<!-- more -->

## Hexo常用命令

> [Hexo 最常用的几个命令](http://moxfive.xyz/2015/12/21/common-hexo-commands/)
>
> [Hexo命令速记](http://tietang.wang/2016/02/21/%E6%8A%80%E6%9C%AF/Hexo/Hexo%E5%91%BD%E4%BB%A4%E9%80%9F%E8%AE%B0/)

`hexo clean && hexo g && hexo s -s`

## NexT 主题的使用

> [hexo-theme-next](https://github.com/theme-next/hexo-theme-next)
>
> [Theme NexT](https://theme-next.org/)

推荐新入坑的兄弟使用[第一种方式](https://theme-next.org/docs/getting-started/installation/#download-next-3)来获取NexT主题。

### 主题配置文件

[Data Files](https://theme-next.org/docs/getting-started/data-files/)

为了以后平滑升级，使用Hexo3.0的Data Files方式

#### [NexT-Way](https://theme-next.org/docs/getting-started/data-files/#option-2)

1. 在`hexo/source/_data`目录（没有的话新建一个）下新建`next.yml`文件。
2. 把**主题配置文件**中的选项全部 copy 到`next.yml`中。
3. 在`next.yml`文件中设置`override`选项为`true`。
4. 在**站点配置文件**中修改`theme`选项为`next`

### 主题设置

> [开始使用](https://theme-next.iissnan.com/getting-started.html)

### 主题优化

#### 文章底部带#号的标签

> [文章底部带#号的标签](https://blog.csdn.net/qq_32454537/article/details/79482896#t11)

修改模板`/themes/next/layout/_macro/post.swig`，搜索 `rel="tag">#`，将`#`换成`<i class="fa fa-tag"></i>`

#### 在每篇文章末尾统一添加“本文结束”标记

> [在每篇文章末尾统一添加“本文结束](https://blog.csdn.net/qq_32454537/article/details/79482896#t12)

1. 在路径` \themes\next\layout\_macro `中新建` passage-end-tag.swig `文件,并添加以下内容：

```html
<div>
{% if not is_index %}
    <div style="text-align:center;color: #ccc;font-size:14px;">-------------本文结束<i class="fa fa-paw"></i>感谢您的阅读-------------</div>
{% endif %}
</div>
```

2. 打开`\themes\next\layout\_macro\post.swig`文件，在`post-body `之后， 添加以下代码：

```html
<div>
	{% if not is_index %}
		{% include 'passage-end-tag.swig' %}
	{% endif %}
</div>
```

3. 打开**主题配置文件**`next.yml`,在末尾添加：

```yaml
# 文章末尾添加“本文结束”标记
passage_end_tag:
  enabled: true
```

#### 主页文章加阴影

>  [主页文章加阴影](https://blog.csdn.net/qq_32454537/article/details/79482896#t14)

打开`\themes\next\source\css\_custom\custom.styl`,向里面加入：

```css
// 主页文章添加阴影效果
.post {
margin-top: 60px;
margin-bottom: 60px;
padding: 25px;
-webkit-box-shadow: 0 0 5px rgba(202, 203, 203, .5);
-moz-box-shadow: 0 0 5px rgba(202, 203, 204, .5);
}
```

#### 显示文章更新时间

修改**主题配置文件**的

```yaml
post_meta:
  updated_at:
    enabled: true
```

要想具体显示到时分秒,则修改**站点配置文件**的

```yaml
date_format: YYYY-MM-DD HH:mm:ss
```

#### 代码添加复制按钮

> [Hexo NexT主题代码块添加复制功能](http://www.missfli.com/2018/06/19/github-hexo-next-08.html)

1. [下载](https://clipboardjs.com/)`clipboard.js`

2. 保存文件`clipboard.min.js` 到目录`\themes\next\source\js\src`

3. 在`.\themes\next\source\js\src`目录下，创建`clipboard-use.js`，文件内容如下：

   ```js
   /*页面载入完成后，创建复制按钮*/
   !function (e, t, a) { 
     /* code */
     var initCopyCode = function(){
       var copyHtml = '';
       copyHtml += '<button class="btn-copy" data-clipboard-snippet="">';
       copyHtml += '  <i class="fa fa-globe"></i><span>copy</span>';
       copyHtml += '</button>';
       $(".highlight .code pre").before(copyHtml);
       new ClipboardJS('.btn-copy', {
           target: function(trigger) {
               return trigger.nextElementSibling;
           }
       });
     }
     initCopyCode();
   }(window, document);
   ```

4. 在`.\themes\next\source\css\_custom\custom.styl`样式文件中添加下面代码：

   ```stylus
   //代码块复制按钮
   .highlight{
     //方便copy代码按钮（btn-copy）的定位
     position: relative;
   }
   .btn-copy {
       display: inline-block;
       cursor: pointer;
       background-color: #eee;
       background-image: linear-gradient(#fcfcfc,#eee);
       border: 1px solid #d5d5d5;
       border-radius: 3px;
       -webkit-user-select: none;
       -moz-user-select: none;
       -ms-user-select: none;
       user-select: none;
       -webkit-appearance: none;
       font-size: 13px;
       font-weight: 700;
       line-height: 20px;
       color: #333;
       -webkit-transition: opacity .3s ease-in-out;
       -o-transition: opacity .3s ease-in-out;
       transition: opacity .3s ease-in-out;
       padding: 2px 6px;
       position: absolute;
       right: 5px;
       top: 5px;
       opacity: 0;
   }
   .btn-copy span {
       margin-left: 5px;
   }
   .highlight:hover .btn-copy{
     opacity: 1;
   }
   ```

5. 在`.\themes\next\layout\_layout.swig`文件中，添加引用（注：在 swig 末尾或 body 结束标签（`</body>`）之前添加）：

   ```js
   <!-- 代码块复制功能 -->
   <script type="text/javascript" src="/js/src/clipboard.min.js"></script>  
   <script type="text/javascript" src="/js/src/clipboard-use.js"></script>
   ```

#### 文章加密

> [hexo-blog-encrypt](https://github.com/MikeCoder/hexo-blog-encrypt/blob/master/ReadMe.zh.md)

1. `npm install --save hexo-blog-encrypt`

2. 在**站点配置文件**下添加如下配置：

   ```yaml
   encrypt:
       enable: true
   ```

3. 在需要加密的文章的头部添加上对应的字段，如 password, abstract, message

   ```yaml
   ---
   password: Mike
   abstract: Welcome to my blog, enter password to read.
   message: Welcome to my blog, enter password to read.
   ---
   ```

#### 二次元看板娘

> [hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d/blob/master/README.zh-CN.md)

1. `npm install --save hexo-helper-live2d`

2. `npm install --save live2d-widget-model-wanko`

3. 向**站点配置文件**中添加如下配置：

   ```yaml
   live2d:
     enable: true
     scriptFrom: local
     pluginRootPath: live2dw/
     pluginJsPath: lib/
     pluginModelPath: assets/
     tagMode: false
     debug: false
     model:
       use: live2d-widget-model-wanko
     display:
       position: right
       width: 150
       height: 300
     mobile:
       show: true
   ```

   注：在`next.yml`中配置时，`width, height`等参数不起作用。

#### 加载条

> [Load bar at the top for NexT](https://github.com/theme-next/theme-next-pace)

1. 将`theme-next-pace`克隆到本地一个空目录里。
2. 删掉`pace`目录下的`.git`文件夹
3. 将`pace`目录 copy 到`themes/next/source/lib`目录下
4. 修改**主题配置文件**`next.yml`的`pace`属性值为`true`

#### 显示文章浏览进度百分比

在**主题配置文件**中修改属性`sidebar`下`scrollpercent`的值为`true`

#### 文章预览

在文章中使用截断标记`<!-- more -->`手动指定文章预览的内容。

#### 评论系统

##### Gitalk

> [在hexo next主题上使用gitalk](https://github.com/gitalk/gitalk/wiki/%E5%9C%A8hexo-next%E4%B8%BB%E9%A2%98%E4%B8%8A%E4%BD%BF%E7%94%A8gitalk)
>
> [Hexo NexT主题中集成gitalk评论系统](https://asdfv1929.github.io/2018/01/20/gitalk/)

1. Click here to sign up for a [new OAuth Application](https://github.com/settings/applications/new)

   Application name： # 应用名称，随意，如`gitalk`
   Homepage URL： # 网站URL，如`https://username.github.io`,`username`是 GitHub 账户名
   Application description # 描述，随意，如`Comment System for Blog`
   Authorization callback URL：# 网站URL，`https://username.github.io`,`username`是 GitHub 账户名

2. 修改**主题配置文件**中的如下属性

   ```yaml
   # Gitalk 
   # Demo: https://gitalk.github.io
   # Reference: https://asdfv1929.github.io/2018/01/20/gitalk/, https://liujunzhou.cn/2018/8/10/gitalk-error/#more
   gitalk:
     enable: true
     github_id: username # Github repo owner
     repo: gitalk # Repository name to store issues.
     client_id: ****** # Github Application Client ID
     client_secret: ****** # Github Application Client Secret
     admin_user: gzhennaxia # GitHub repo owner and collaborators, only these guys can initialize github issues
     distraction_free_mode: true # Facebook-like distraction free mode
   ```

##### Valine

> [Comment Systems Valine](https://theme-next.org/docs/third-party-services/comments-and-widgets/#Valine)

1. Create an account or log into [LeanCloud](https://leancloud.cn/dashboard/login.html#/signin), and then click on the bottom left corner to [create the application](https://leancloud.cn/dashboard/applist.html#/newapp) in [dashboard](https://leancloud.cn/dashboard/applist.html#/apps).

2. Go to the application you just created, select `Settings -> Apply Key` in the lower left corner, and you will see your `APP ID` and `APP Key`.

3. Set the value `enable` to `true`, add the obtained APP ID (`appid`) and APP Key (`appkey`), and edit other configurations in `valine` section in the theme config file as following:

   ```yaml
   # Valine.
   # You can get your appid and appkey from https://leancloud.cn
   # more info please open https://valine.js.org
   valine:
     enable: true # When enable is set to be true, leancloud_visitors is recommended to be closed for the re-initialization problem within different leancloud adk version.
     appid: ****** # your leancloud application appid
     appkey: ****** # your leancloud application appkey
     notify: false # mail notifier , https://github.com/xCss/Valine/wiki
     verify: false # Verification code
     placeholder: Just go go # comment box placeholder
     avatar: mm # gravatar style
     guest_info: nick,mail,link # custom comment header
     pageSize: 10 # pagination size
     visitor: false # leancloud-counter-security is not supported for now. When visitor is set to be true, appid and appkey are recommended to be the same as leancloud_visitors' for counter compatibility. Article reading statistic https://valine.js.org/visitor.html
   ```

##### Gitalk + Valine双评论系统

在完成各自配置后对`themes\next\layout\_partials\comments.swig`做如下修改：

**Before**

```html
{% elseif theme.valine.enable and theme.valine.appid and theme.valine.appkey %}
	<div class="comments" id="comments">
	</div>

{% elseif theme.gitalk.enable %}
	<div id="gitalk-container">
	</div>
```

**After**

```html
{% elseif theme.gitalk.enable %}
    <div id="gitalk-container">
    </div>
	{% if theme.valine.enable and theme.valine.appid and theme.valine.appkey %}
		<div class="comments" id="comments">
		</div>
	{% endif %}
```

#### 自动部署

> [Continuous Integration](https://theme-next.org/docs/getting-started/deployment/#Continuous-Integration)



## 踩坑记录

### npm install warnings

> [npm install warnings](https://github.com/Zulko/eagle.js/issues/35)

```shell
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.3 (node_modules/hexo-cli/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
```

#### 解决方法

忽略就好

### Hexo g error

```shell
ERROR ENOENT: no such file or directory, open 'F:\Hexo\themes\next\layout\menu.swig'
Error: ENOENT: no such file or directory, open 'F:\Hexo\themes\next\layout\menu.swig'
    at Object.openSync (fs.js:439:3)
    at Object.readFileSync (fs.js:344:35)
    at Object.ret.load (F:\Hexo\node_modules\swig-templates\lib\loaders\filesystem.js:59:15)
    at exports.Swig.compileFile (F:\Hexo\node_modules\swig-templates\lib\swig.js:740:31)
    at Object.eval [as tpl] (eval at precompile (F:\Hexo\node_modules\swig-templates\lib\swig.js:537:13), <anonymous>:7:18)
    at compiled (F:\Hexo\node_modules\swig-templates\lib\swig.js:664:18)
    at Theme._View.View._compiled.locals [as _compiled] (F:\Hexo\node_modules\hexo\lib\theme\view.js:125:48)
    at Theme._View.View.View.render (F:\Hexo\node_modules\hexo\lib\theme\view.js:30:15)
    at route.set (F:\Hexo\node_modules\hexo\lib\hexo\index.js:394:29)
    at tryCatcher (F:\Hexo\node_modules\bluebird\js\release\util.js:16:23)
    at F:\Hexo\node_modules\bluebird\js\release\method.js:15:34
    at RouteStream._read (F:\Hexo\node_modules\hexo\lib\hexo\router.js:134:3)
    at RouteStream.Readable.read (_stream_readable.js:452:10)
    at resume_ (_stream_readable.js:899:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
```

#### 场景再现

从[releases](https://github.com/theme-next/hexo-theme-next/releases/tag/v6.6.0)下载的 NexT 主题，然后再通过修改目录名为`next`的方式使用该主题的时候，生成文件的时候报的错。

#### 报错原因

未知

#### 解决方法

换用[命令行](https://theme-next.org/docs/getting-started/installation/#download-next-3)下载的方式就不会报这个错了。