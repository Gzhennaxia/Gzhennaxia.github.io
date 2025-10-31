---
title: 综合工具合集
date: 2025-10-21 10:00:00
layout: page
comments: false
sidebar: false
---

<!-- 搜索框 -->
<div class="tool-search">
  <input type="text" id="searchInput" placeholder="搜索工具（如“代码格式化”“复利计算”）...">
  <button id="searchBtn"><i class="fas fa-search"></i></button>
  <div id="searchResult" class="search-result hidden"></div> <!-- 搜索结果展示区 -->
</div>

<!-- 分类导航 -->
<div class="category-nav">
  <h2 class="nav-title">工具分类</h2>
  <div class="category-cards">
    <!-- 投资类分类卡片 -->
    <a href="/tools/investment/" class="category-card">
      <div class="category-icon bg-blue-100 text-blue-600">
        <i class="fas fa-chart-pie fa-2x"></i>
      </div>
      <h3 class="category-name">投资类工具</h3>
      <p class="category-desc">10+ 投资计算、收益分析、风险评估工具</p>
    </a>
    <!-- 学习类分类卡片 -->
    <a href="/tools/study/" class="category-card">
      <div class="category-icon bg-green-100 text-green-600">
        <i class="fas fa-book-open fa-2x"></i>
      </div>
      <h3 class="category-name">学习类工具</h3>
      <p class="category-desc">8+ 笔记模板、单词卡片、学习计划生成工具</p>
    </a>
    <!-- 编程类分类卡片 -->
    <a href="/tools/coding/" class="category-card">
      <div class="category-icon bg-purple-100 text-purple-600">
        <i class="fas fa-code fa-2x"></i>
      </div>
      <h3 class="category-name">编程类工具</h3>
      <p class="category-desc">12+ 代码格式化、JSON解析、语法检查工具</p>
    </a>
    <!-- 新增分类只需复制上方卡片，修改图标、名称、链接 -->
  </div>
</div>

<!-- 热门工具推荐 -->
<div class="hot-tools">
  <h2 class="section-title">热门工具</h2>
  <div class="tool-list">
    <!-- 热门工具1：投资计算器 -->
    <a href="/tools/investment/calculator/" class="hot-tool-card">
      <i class="fas fa-calculator"></i>
      <h4>投资资金配置计算器</h4>
      <span class="tool-category">投资类</span>
    </a>
    <!-- 热门工具2：代码格式化工具 -->
    <a href="/tools/coding/formatter/" class="hot-tool-card">
      <i class="fas fa-code"></i>
      <h4>代码格式化工具</h4>
      <span class="tool-category">编程类</span>
    </a>
  </div>
</div>

<!-- 引入公共样式与脚本 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="/tools/common/css/tool-common.css">
<script src="/tools/common/js/tool-search.js"></script>