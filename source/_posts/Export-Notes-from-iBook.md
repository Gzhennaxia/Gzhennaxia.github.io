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

### 位置

### ZAEANNOTATION

| Field | Type | Not Null | Default Value| Desc |
| ----- | ---- | -------- | ------------- | ------------- |
|Z_PK| INTEGER|   |   | 主键 |
|Z_ENT| INTEGER|   |   |   |
|Z_OPT| INTEGER|   |   |   |
|ZANNOTATIONDELETED| INTEGER|   |   | 删除标志 |
|ZANNOTATIONISUNDERLINE| INTEGER|   |   |   |
|ZANNOTATIONSTYLE| INTEGER|   |   | 笔记类型<br />3: 黄色 <i class="fa fa-circle" style="color: #FECF0B"></i><br />1: 绿色 <i class="fa fa-circle" style="color: #33D42D"></i><br />2: 蓝色 <i class="fa fa-circle" style="color: #3CA3FF"></i> |
|ZANNOTATIONTYPE| INTEGER|   |   | 类型 |
|ZPLABSOLUTEPHYSICALLOCATION| INTEGER|   |   | 绝对物理位置 |
|ZPLLOCATIONRANGEEND| INTEGER|   |   | 位置范围结束 |
|ZPLLOCATIONRANGESTART| INTEGER|   |   | 位置范围开始 |
|ZANNOTATIONCREATIONDATE| TIMESTAMP|   |   | 标注创建日期 |
|ZANNOTATIONMODIFICATIONDATE| TIMESTAMP|   |   | 标注修改日期 |
|ZANNOTATIONASSETID| VARCHAR|   |   |   |
|ZANNOTATIONCREATORIDENTIFIER| VARCHAR|   |   | 标注创建者标识符 |
|ZANNOTATIONLOCATION| VARCHAR|   |   | 标注位置 |
|ZANNOTATIONNOTE| VARCHAR||||
|ZANNOTATIONREPRESENTATIVETEXT| VARCHAR||||
|ZANNOTATIONSELECTEDTEXT| VARCHAR|  |   |   |
|ZANNOTATIONUUID| VARCHAR|  |   |   |
|ZFUTUREPROOFING1| VARCHAR|  |   |   |
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
|ZPLSTORAGEUUID| VARCHAR|  |   |   |
|ZPLUSERDATA | BLOB| | | |


