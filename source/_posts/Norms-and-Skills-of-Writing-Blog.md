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
#password: 12345
#abstract: Here's something encrypted, password is required to continue reading.
#message: Hey, password is required here.
#wrong_pass_message: Oh, this is an invalid password. Check and try again, please.
#wrong_hash_message: Oh, these decrypted content cannot be verified, but you can still have a look.
---

<img src="https://blog.hubspot.com/hubfs/blog-writing-for-SEO.jpg" width="100%"/>

<!-- more -->

## 文字

### 纯色背景填充

> [Label | NexT](https://theme-next.org/docs/tag-plugins/label)

| Code                               | Result                         |
| ---------------------------------- | ------------------------------ |
| { % label @示例 1 % } |      {% label @示例 1 %} |
| { % label default@示例 2 % }      |{% label default@示例 2 %} |
| { % label primary@示例 3 % }      |{% label primary@示例 3 %} |
| { % label success@示例 4 % }      |{% label success@示例 4 %} |
| { % label info@示例 5 % }   |   {% label info@示例 5 %} |
| { % label warning@示例 6 % }      |{% label warning@示例 6 %} |
| { % label danger@示例 7 % }     | {% label danger@示例 7 %} |
| \~\~{ % label default @示例8 % }\~\~ | ~~{% label default @示例8 %}~~ |
| \<mark\>esse\</mark\> | <mark>esse</mark> |

### 中心引用

> [Centered Quote ｜ NexT](https://theme-next.org/docs/tag-plugins/#Centered-Quote)

#### 格式

```
{% centerquote %}文字{% endcenterquote %}
<!-- Tag Alias -->
{% cq %}文字{% endcq %}
```

#### 效果

{% cq %}文字{% endcq %}

### 页面内跳转链接

1. 页面内定义一个锚，及要跳转到的位置

   `<span id="1">XXX</span>`

2. 使用如下格式定义链接即可

   `[跳转到XXX](#1)`

## 图片

### 引用

#### 本地图片

> [Hexo博客搭建之在文章中插入图片](https://yanyinhong.github.io/2017/05/02/How-to-insert-image-in-hexo-post/)

将图片统一放在 `source/post_image` 文件夹中，通过以下地址引用。

```markdown
![](/post_image/xxx.jpg)
```

### 缩放、截取

{% note %}

博客中经常要用到网络上的一些图片，但又需要在此基础上进行一些改动，而且并不想通过图片编辑软件进行编辑再上传图片服务器这种复杂耗时的方式。

{% endnote %}

```html
<div style="width: 100%;
            height: 300px;
            background-image: url(http://xxxx/xxx.xxx.jpg);
            background-size: 727px 248px;
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

### 分组

> [Group Pictures | NexT](https://theme-next.org/docs/tag-plugins/group-pictures)
>
> ```
> {% grouppicture [group]-[layout] %}{% endgrouppicture %}
> {% gp [group]-[layout] %}{% endgp %}
> 
> [group]  : Total number of pictures to add in the group.
> [layout] : Default picture under the group to show.
> ```

**例如**

{% tabs group-pictures %}

<!-- tab Code -->

```swift
{% grouppicture 5-3 %}
  ![](/post_image/background-size-x-y.jpg)
  ![](/post_image/background-size-x-y.jpg)
  ![](/post_image/background-size-x-y.jpg)
  ![](/post_image/background-size-x-y.jpg)
  ![](/post_image/background-size-x-y.jpg)		
{% endgrouppicture %}
```



<!-- endtab -->

<!-- tab Result -->

{% grouppicture 5-3 %}
![](/post_image/background-size-x-y.jpg)
![](/post_image/background-size-x-y.jpg)
![](/post_image/background-size-x-y.jpg)
![](/post_image/background-size-x-y.jpg)
![](/post_image/background-size-x-y.jpg)
{% endgrouppicture %}



<!-- endtab -->

{% endtabs %}

## PDF

> [PDF | NexT](https://theme-next.org/docs/tag-plugins/pdf)

1. 将 pdf 文件统一放在 `source/pdf` 目录中

2. 文章里使用如下方式引用

   ```swift
   {% pdf xxx.pdf %}
   ```

## 效果展示

{% note success no-icon %}

在写博客搭建的文章时，不知道如何能够更好的表现需要配置内容和配置后的效果。一次偶然看到 [mermaid|GitHub](https://github.com/mermaid-js/mermaid) 的README 得到启发，使用 table 布局就可以了。

{% endnote %}

<table>
<tr>
    <td><pre>
graph TD
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]</pre></td>
    <td align="center">
        <img src="https://raw.githubusercontent.com/mermaid-js/mermaid/master/img/gray-flow.png" />
    </td>
</tr>
</table>

## Mermaid

> [mermaid|GitHub](https://github.com/mermaid-js/mermaid)

{% cq %}

Generation of diagram and flowchart from text in a similar manner as markdown.

{% endcq %}

### 流程图



## 视频

| Code              | Result                                     |
| ----------------- | ------------------------------------------ |
| { % video url % } | {% video https://example.com/sample.mp4 %} |

## 按钮

> [Button | NexT](https://theme-next.org/docs/tag-plugins/button)
>
> ```
> {% button url, text, icon [class], [title] %}
> <!-- Tag Alias -->
> {% btn url, text, icon [class], [title] %}
> 
> url     : Absolute or relative path to URL.
> text    : Button text. Required if no icon specified.
> icon    : FontAwesome icon name (without 'fa-' at the begining). Required if no text specified.
> [class] : FontAwesome class(es): fa-fw | fa-lg | fa-2x | fa-3x | fa-4x | fa-5x
>           Optional parameter.
> [title] : Tooltip at mouseover.
>           Optional parameter.
> ```

| Code                             | Result                          |
| -------------------------------- | ------------------------------- |
| { % button #, 按钮文字 % }       | {% button #, 按钮文字 %}        |
| { % button #, 带图标的按钮, home % } | {% button #, 带图标的按钮, home %} |
| { % button #, 带间隙的图标按钮, home fa-fw % } | {% button #, 带间隙的图标按钮, home fa-fw %} |
| { % button #, 带标题的按钮, , 标题 % } | {% button #, 带标题的按钮, , 标题 %} |
| 文字文字{ % button #, 文字围绕的按钮 % }文字文字 | 文字文字{% button #, 文字围绕的按钮 %}文字文字 |
| { % note info no-icon % }<br/>{ % btn #, 嵌入note中的按钮 % }<br/>{ % endnote % } |{% note info no-icon %}	{% btn #, 嵌入note中的按钮 %}	{% endnote %} |

## 数学公式

- 需要在博文的 [Front-matter](https://hexo.io/zh-cn/docs/front-matter#JSON-Front-matter) 中开启 `mathjax`
- 公式里的运算符号两侧尽量加上空格，否则可能会导致渲染失败的情况

## 报错

### Error: expected end of comment, got end of file

#### 日志

```
Unhandled rejection Template render error: (unknown path)
  Error: expected end of comment, got end of file
    at Object._prettifyError (/Users/gzhennaxia/Documents/GitHub/libo9527.github.io/node_modules/nunjucks/src/lib.js:36:11)
    at Template.render (/Users/gzhennaxia/Documents/GitHub/libo9527.github.io/node_modules/nunjucks/src/environment.js:542:21)
```

#### 原因

博文中出现 `{` 和 `#` 连在一起时报这个错。

#### 解决

用 `<span>` 标签将其分开即可，即 `<span>{</span><span>#</span>`。

