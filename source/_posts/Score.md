---
title: Score
description: 得分情况
date: 2020-02-24 07:53:23
mathjax: true
categories:
- Encrypt
- Conclusion
tags:
password: score
abstract: 'Warning: This content is personal, please skip it.'
message: 'Warning again: This content is personal, please skip it.'
wrong_pass_message: 'Third warning: This content is personal, please skip it.'
wrong_hash_message: 'Fourth warning: This content is personal, please skip it.'
---

<img src="https://api.tunespeak.com/media/W1siZiIsImNvbnRlc3RfdGVtcGxhdGVzLzVjYTNhN2ZkZjZmOTY0MzZjMmY3MDliMi0xNTU0MjMwNTE2LWhlYWRlciJdXQ" width="100%"/>

<!-- more -->

> [Get Up Early](/2020/02/24/Get-Up-Early/)
>
> [Reading](/2020/02/24/Reading/)
> 
> [Exercise](/2020/02/23/Exercise/)
> 
> [Bath](/2020/02/23/Bath/)

## 总分

<div style="height: 100px; line-height: 100px;font-weight: bolder; font-size: 50px;text-align: center;font-family: 'Ma Shan Zheng';color: lightgreen">
    +4.56
</div>


## 每日得分

| 日期       | 早起 | 阅读 | 早餐 | 锻炼 | 洗澡 | 日报 | 明日计划 |其他| 总分 |
| ---------- | ---- | ---- | ---- | -------- | ---- | ---- | ---- | ---- | ---- |
| 2020-02-23 | -0.1 | -0.1 | -0.1 | +0.1 | +0.1 | +0.1 | +0.08   | 0 |+0.98|
| 2020-02-24 | -0.2 | -0.2 | -0.2 | +0.1 | +0.1 | +0.1 | +0.1     | 0.04+0.05+0.09=0.18 |-0.02|
| 2020-02-25 | +0.1 | +0.1 | +0.1 | +0.2 | +0.2 | +0.2 | +0.2 | 0.1+0.1+0.1+0.1+0.1+0.1=0.6 |1.7|
| 2020-02-25 | +0.1 | +0.1 | +0.1 | +0.2 | +0.2 | +0.2 | +0.2 | 0.8+0.9=1.7                 | 2.8   |

## 奖惩制度

### 奖励规则

#### 规则一

每天增长的金额从 0.1 元开始，每坚持三天涨 0.1 元，每坚持一周涨 0.2 元，每坚持一个月涨 0.5 元，均在当前已经累计的金额上增长。

### 惩罚规则

#### 规则一

如果中断一次则扣除当天应增加的金额，并将奖励金额和惩罚金额同时重置为 0.1元/天，连续中断，则每日惩罚金额以 2 的指数次幂增长。

#### 规则二

1. 中断时将奖励金额重置为初始金额
2. 第一次中断时将惩罚金额=当天应得的奖励金额*2
3. 每多一次中断，惩罚金额=上一次中断时惩罚金额*2

### 被迫中断规则

#### 规则一

1. 连续天数归零
2. 根据被迫程度(百分比)扣除相应罚金。

##### 罚金公式

$ p*(1-f) $

- p：punish，当日罚金
- f：force，被迫程度(百分比)

