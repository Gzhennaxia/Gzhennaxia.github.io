---
title: Schedule
description: 日程安排
date: 2020-03-01 08:38:52
categories:
- Score System
- Schedule
mathjax: true
tags:
password: schedule
abstract: 'Warning: This content is personal, please skip it.'
message: 'Warning again: This content is personal, please skip it.'
wrong_pass_message: 'Third warning: This content is personal, please skip it.'
wrong_hash_message: 'Fourth warning: This content is personal, please skip it.'
---

<img src="https://c4.wallpaperflare.com/wallpaper/23/174/351/spongebob-squarepants-patrick-star-cartoon-humor-wallpaper-preview.jpg" width="100%"/>

<!-- more -->

# 日程

## 今日日程评分

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

#### 拖延程度

$$
DD=ddm/ddm+om
$$

- DD：Delay Degree 拖延程度

- ddm：delayed minutes 推迟时长(分钟)

- om：original minutes 原本计划的时长(分钟)

### 得分公式


$$
S=CD * E * (1-DD)
$$

- S：Score 分数
- CD：Completion Degree 完成度
- E：Effectiveness 效率
- DD：Delay Degree 拖延程度

## 明日日程安排

### 添加日程

原则：有了想法就尽快把日程添加上！

### 安排日程始末时间

基本时间：22:45～23:00

## 今日评分记录归档

寻找更高效的方法，比如用程序获取日历数据，再导入Excel，减少手动导入的体力劳动。

## 日报

# 情况处理

## 情况一：未按时完成

安排的日程未完成

### 原因一：忘记浏览日程表而错过了开始时间

- 当日及时调整日程后最终完成了：扣除应得分数的 <mark>5%</mark>
- 当日内未能补完推迟到第二天：罚应得分数的 <mark>10%</mark>
- 当日内未能补完且无法推迟处理：罚应得分数的 <mark>100%</mark>
- 造成经济损失：罚损失经济的 <mark>200%</mark>

### 原因二：偶遇突发事件

- 当日及时调整日程后最终完成了：正常得分
- 当日内未能补完推迟到第二天：罚应得分数的 <mark>(1-FD)*10%</mark> FD 指的是中断事件的被迫程度
- 当日内未能补完且无法推迟处理：罚应得分数的 <mark>(1-FD)</mark>
- 造成经济损失：罚损失经济的 <mark>(1-FD)*2</mark>

# 附录

## 突发事件被迫程度表

| 事件               | FD(Forced degree 被迫程度) |
| ------------------ | -------------------------- |
| 微信聊天(普通好友) | 10%                        |
| 微信聊天(普通同学) | 10%                        |
| 微信聊天(普通朋友) | 20%                        |
| 微信聊天(亲密朋友) | 60%                        |
| 微信聊天(家人)     | 80%                        |

