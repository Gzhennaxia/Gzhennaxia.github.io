---
title: Schedule
description: 日程安排
date: 2020-03-01 08:38:52
categories:
- Score System
- Schedule
tags:
mathjax: true
hidden: true
password: schedule
abstract: 'Warning: This content is personal, please skip it.'
message: 'Warning again: This content is personal, please skip it.'
wrong_pass_message: 'Third warning: This content is personal, please skip it.'
wrong_hash_message: 'Fourth warning: This content is personal, please skip it.'
---

<img src="https://c4.wallpaperflare.com/wallpaper/23/174/351/spongebob-squarepants-patrick-star-cartoon-humor-wallpaper-preview.jpg" width="100%"/>

<!-- more -->

# 日程

## 6:00 早起

## 6:00 - 6:10 刷牙洗脸

## 6:10 - 7:10 阅读

## 7:10 - 7:40 做早餐

## 7:40 - 8:00 吃早餐

## 8:00 - 8:15 整理着装准备出门

## 12:30 - 13:00 吃午饭

## 18:00 - 18:30 吃晚饭

## 21:00 - 22:00 锻炼

## 22:00 - 22:30 洗澡

## 22:30 - 22:40 今日日程评分

### 评分指标

#### 完成度

自行评判

#### 效率

$$
E=om/am
$$

- E：Effectiveness 效率

- om：original minutes 原本计划的时长(分钟)

- at：actual time 实际完成所用时长

<span id="1"></span>

#### 拖延程度

$$
DD=ddm/ddm+om
$$

- DD：Delay Degree 拖延程度

- ddm：delayed minutes 推迟时长(分钟)

- om：original minutes 原本计划的时长(分钟)

<span id="2"></span>

### 得分公式


$$
S=OS * CD * E * (1-DD)
$$

- S：Score 分数
- OS：Original Score 原本应得的分数
- CD：Completion Degree 完成度
- E：Effectiveness 效率
- DD：Delay Degree 拖延程度

## 22:40 - 22:50 明日日程安排

### 添加日程

原则：有了想法就尽快把日程添加上！

### 安排日程始末时间

基本时间：22:45～23:00

## 22:50 - 22:55 今日评分记录归档

寻找更高效的方法，比如用程序获取日历数据，再导入Excel，减少手动导入的体力劳动。

## 22:55 - 23:00 日报

# 情况处理

{% note info %}

这里的情况处理是指一般的日程遇到这些情况该怎么处理，如果是特殊的日程(附有自身规则)，则按其自身规则处理。

{% endnote %}

## 情况一：完成度为零

安排的日程未完成

### 原因一：忘记浏览日程表而错过了时间

- 未造成经济损失：罚应得分数的 <mark>10%</mark>
- 造成经济损失：罚损失经济的 <mark>110%</mark>

### 原因二：偶遇突发事件

- 未造成经济损失：罚应得分数的 <mark>(1-FD)</mark>，FD 指突发事件的[被迫程度](#1)
- 造成经济损失：罚损失经济的 <mark>(1-FD)</mark>

### 原因三：日程安排不合理

当开始时间/结束时间/时长等安排的不合理时，不得分也不扣分，但要分析不合理的原因，并重新安排。

## 情况二：推迟完成

在{% label info@当天内 %}推迟完成！

### 原因一：偶遇突发事件

- 未造成经济损失：罚应得分数的 <mark>(1-FD)</mark>，FD 指突发事件的被迫程度
- 造成经济损失：罚损失经济的 <mark>(1-FD)*2</mark>

### 原因二：拖延症

- 未造成经济损失：计算[拖延程度](#1)，按[得分公式](#2)计算

- 造成经济损失：

  得分公式
  $$
  S = (OS * CD * E - LE) * (1-DD)
  $$

  - S：Score 分数
  - OS：Original Score 原本应得的分数
  - CD：Completion Degree 完成度
  - E：Effectiveness 效率
  - LE：Lost Economy 损失的经济
  - DD：Delay Degree 拖延程度

# 附录

## 突发事件被迫程度表

| 事件               | FD(Forced degree 被迫程度) |
| ------------------ | -------------------------- |
| 微信聊天(普通好友) | 10%                        |
| 微信聊天(普通同学) | 10%                        |
| 微信聊天(普通朋友) | 20%                        |
| 微信聊天(亲密朋友) | 60%                        |
| 微信聊天(家人)     | 80%                        |

