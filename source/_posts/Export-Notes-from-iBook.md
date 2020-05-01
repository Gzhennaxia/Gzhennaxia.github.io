---
title: Export Notes from iBook
description: 导出 iBook 笔记
comments: false
top: false
reward_settings:
  enable: false
  comment: null
date: 2020-03-07 15:58:52
categories:
tags:
---

<img src="https://pepaless.com/column/191009_01/3.png" width="100%"/>

<!-- more -->

## 数据库

### ZAEANNOTATION 笔记表

> `/Users/username/Library/Containers/com.apple.iBooksX/Data/Documents/AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite`

| Field | Type | Not Null | Default Value| Desc |
| ----- | ---- | -------- | ------------- | ------------- |
|Z_PK| INTEGER|   |   | 主键 |
|Z_ENT| INTEGER|   |   |   |
|Z_OPT| INTEGER|   |   |   |
|ZANNOTATIONDELETED| INTEGER|   |   | 删除标志 |
|ZANNOTATIONISUNDERLINE| INTEGER|   |   | 是不是下划线(iBook中下划线表示重点) |
|ZANNOTATIONSTYLE| INTEGER|   |   | 笔记类型<br />3: 黄色 <i class="fa fa-circle" style="color: #FECF0B"></i><br />1: 绿色 <i class="fa fa-circle" style="color: #33D42D"></i><br />2: 蓝色 <i class="fa fa-circle" style="color: #3CA3FF"></i> |
|ZANNOTATIONTYPE| INTEGER|   |   | 类型 |
|ZPLABSOLUTEPHYSICALLOCATION| INTEGER|   |   | 绝对物理位置 |
|ZPLLOCATIONRANGEEND| INTEGER|   |   | 位置范围结束 |
|ZPLLOCATIONRANGESTART| INTEGER|   |   | 位置范围开始 |
|ZANNOTATIONCREATIONDATE| TIMESTAMP|   |   | 标注创建日期<br />类型：Timestamp<br />注意：这里的时间戳是相对于 2001-01-01 08:00:00 |
|ZANNOTATIONMODIFICATIONDATE| TIMESTAMP|   |   | 标注修改日期 |
|ZANNOTATIONASSETID| VARCHAR|   |   | 对应书库表中的 ZASSERTID 字段 |
|ZANNOTATIONCREATORIDENTIFIER| VARCHAR|   |   | 标注创建者标识符 |
|ZANNOTATIONLOCATION| VARCHAR|   |   | 标注位置 |
|ZANNOTATIONNOTE| VARCHAR|||笔记|
|ZANNOTATIONREPRESENTATIVETEXT| VARCHAR|||笔记所代表的文本|
|ZANNOTATIONSELECTEDTEXT| VARCHAR|  |   | 笔记所选中的文本 |
|ZANNOTATIONUUID| VARCHAR|  |   | 标记的UUID |
|ZFUTUREPROOFING1| VARCHAR|  |   | 未来验证 |
|ZFUTUREPROOFING10| VARCHAR|  |   |   |
|ZFUTUREPROOFING11| VARCHAR|  |   |   |
|ZFUTUREPROOFING12| VARCHAR|  |   |   |
|ZFUTUREPROOFING2| VARCHAR|  |   |   |
|ZFUTUREPROOFING3| VARCHAR|  |   |   |
|ZFUTUREPROOFING4| VARCHAR|  |   |   |
|ZFUTUREPROOFING5| VARCHAR|  |   |   |
|ZFUTUREPROOFING6| VARCHAR|  |   |   |
|ZFUTUREPROOFING7| VARCHAR|  |   |   |
|ZFUTUREPROOFING8| VARCHAR|  |   |   |
|ZFUTUREPROOFING9| VARCHAR|  |   |   |
|ZPLSTORAGEUUID| VARCHAR|  |   | 存储器UUID |
|ZPLUSERDATA | BLOB| | | 用户数据 |

### ZBKLIBRARYASSET 书库表

> `/Users/gzhennaxia/Library/Containers/com.apple.iBooksX/Data/Documents/BKSeriesDatabase/BKSeries-1-012820141020.sqlite`

| Field | Type    | Not Null | Default Value | Desc |
| ----- | ------- | -------- | ------------- | ---- |
| Z_PK  | INTEGER |          |               | 主键 |
| Z_ENT | INTEGER |          |               |     |
| Z_OPT | INTEGER |          |               |     |
| ZCANREDOWNLOAD | INTEGER |          |               |     |
| ZCOMPUTEDRATING | INTEGER |          |               |     |
| ZCONTENTTYPE | INTEGER |          |               |     |
| ZDESKTOPSUPPORTLEVEL | INTEGER |          |               |     |
| ZDIDRUNFORYOUENDOFBOOKEXPERIENCE | INTEGER |          |               |     |
| ZDIDWARNABOUTDESKTOPSUPPORT | INTEGER |          |               |     |
| ZFILESIZE | INTEGER |          |               |     |
| ZGENERATION | INTEGER |          |               |     |
| ZISDEVELOPMENT | INTEGER |          |               |     |
| ZISEPHEMERAL | INTEGER |          |               |     |
| ZISEXPLICIT | INTEGER |          |               |     |
| ZISFINISHED | INTEGER |          |               |     |
| ZISHIDDEN | INTEGER |          |               |     |
| ZISLOCKED | INTEGER |          |               |     |
| ZISNEW | INTEGER |          |               |     |
| ZISPROOF | INTEGER |          |               |     |
| ZISSAMPLE | INTEGER |          |               |     |
| ZISSTOREAUDIOBOOK | INTEGER |          |               |     |
| ZISTRACKEDASRECENT | INTEGER |          |               |     |
| ZMETADATAMIGRATIONVERSION | INTEGER |          |               |     |
| ZNOTFINISHED | INTEGER |          |               |     |
| ZPAGECOUNT | INTEGER |          |               |     |
| ZRATING | INTEGER |          |               |     |
| ZSERIESISCLOUDONLY | INTEGER |          |               |     |
| ZSERIESISHIDDEN | INTEGER |          |               |     |
| ZSERIESNEXTFLAG | INTEGER |          |               |     |
| ZSERIESSORTKEY | INTEGER |          |               |     |
| ZSORTKEY | INTEGER |          |               |     |
| ZSTATE | INTEGER |          |               |     |
| ZTASTE | INTEGER |          |               |     |
| ZTASTESYNCEDTOSTORE | INTEGER |          |               |     |
| ZLOCALONLYSERIESITEMSPARENT | INTEGER |          |               |     |
| ZPURCHASEDANDLOCALPARENT | INTEGER |          |               |     |
| ZSERIESCONTAINER | INTEGER |          |               |     |
| ZASSETDETAILSMODIFICATIONDATE | TIMESTAMP |          |               |    |
| ZBOOKHIGHWATERMARKPROGRESS | FLOAT |          |               |   |
| ZBOOKMARKSSERVERMAXMODIFICATIONDATE | TIMESTAMP |          |               |    |
| ZCREATIONDATE | TIMESTAMP |          |               |    |
| ZDATEFINISHED | TIMESTAMP |          |               |    |
| ZDURATION | FLOAT |          |               |   |
| ZEXPECTEDDATE | TIMESTAMP |          |               |    |
| ZFILEONDISKLASTTOUCHDATE | TIMESTAMP |          |               |    |
| ZLASTENGAGEDDATE | TIMESTAMP |          |               |    |
| ZLASTOPENDATE | TIMESTAMP |          |               |    |
| ZLOCATIONSERVERMAXMODIFICATIONDATE | TIMESTAMP |          |               |    |
| ZMODIFICATIONDATE | TIMESTAMP |          |               |    |
| ZPURCHASEDATE | TIMESTAMP |          |               |    |
| ZREADINGPROGRESS | FLOAT |          |               |   |
| ZRELEASEDATE | TIMESTAMP |          |               |    |
| ZUPDATEDATE | TIMESTAMP |          |               |    |
| ZVERSIONNUMBER | FLOAT |          |               |   |
| ZACCOUNTID | VARCHAR |          |               |  |
| ZASSETID | VARCHAR |          |               | 对应笔记本中的 ZANNOTATIONASSETID 字段 |
| ZAUTHOR | VARCHAR |          |               | 作者 |
| ZBOOKDESCRIPTION | VARCHAR |          |               |  |
| ZBOOKMARKSSERVERVERSION | VARCHAR |          |               |  |
| ZCOMMENTS | VARCHAR |          |               |  |
| ZCOVERURL | VARCHAR |          |               |  |
| ZCOVERWRITINGMODE | VARCHAR |          |               |  |
| ZDATASOURCEIDENTIFIER | VARCHAR |          |               |  |
| ZDOWNLOADEDDSID | VARCHAR |          |               |  |
| ZEPUBID | VARCHAR |          |               |  |
| ZFAMILYID | VARCHAR |          |               |  |
| ZGENRE | VARCHAR |          |               |  |
| ZGROUPING | VARCHAR |          |               |  |
| ZKIND | VARCHAR |          |               |  |
| ZLANGUAGE | VARCHAR |          |               |  |
| ZLOCATIONSERVERVERSION | VARCHAR |          |               |  |
| ZPAGEPROGRESSIONDIRECTION | VARCHAR |          |               |  |
| ZPATH | VARCHAR |          |               | 文件位置 |
| ZPERMLINK | VARCHAR |          |               |  |
| ZPURCHASEDDSID | VARCHAR |          |               |  |
| ZSEQUENCEDISPLAYNAME | VARCHAR |          |               |  |
| ZSERIESID | VARCHAR |          |               |  |
| ZSORTAUTHOR | VARCHAR |          |               |  |
| ZSORTTITLE | VARCHAR |          |               |  |
| ZSTOREID | VARCHAR |          |               |  |
| ZTEMPORARYASSETID | VARCHAR |          |               |  |
| ZTITLE | VARCHAR |          |               | 书名 |
| ZVERSIONNUMBERHUMANREADABLE | VARCHAR |          |               |  |
| ZYEAR | VARCHAR |          |               |  |

将内联样式提取出来，结合 NexT 自定义样式，添加到 Post 页面 Body 中。