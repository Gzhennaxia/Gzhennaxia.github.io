---
title: Hexo 多分类综合工具合集方案与使用手册
description: Hexo 多分类综合工具合集方案与使用手册
comments: false
top: false
reward_settings:
  enable: false
  comment: null
date: 2025-10-20 10:27:28
categories:
tags:
---

# Hexo 多分类综合工具合集方案与使用手册

## 一、方案设计核心思路

### 1.1 核心目标

打破单一理财工具局限，构建支持**多分类、可扩展**的综合工具库，实现 “分类导航 - 工具筛选 - 快速使用” 的完整流程，同时保持页面美观与操作便捷性。

### 1.2 方案亮点

<!-- more -->

* **三级结构设计**：「工具首页（总入口）→ 分类页（如投资类）→ 工具详情页」，层级清晰；

* **分类灵活配置**：支持新增 / 删除分类（如后续添加 “生活类”“设计类” 工具）；

* **多类型工具适配**：无论是 HTML 静态工具（如计算器）、在线工具链接（如代码格式化工具），还是文档类工具（如学习模板），均能统一管理；

* **用户体验优化**：添加分类筛选、工具搜索功能，方便快速找到目标工具。

## 二、多分类工具合集方案（落地架构）

### 2.1 目录结构设计（核心）

采用 “分类目录 + 工具子目录” 的层级结构，每个分类独立管理所属工具，后续新增分类 / 工具只需按此结构扩展：



```
hexo-blog/

└── source/

&#x20;   └── tools/                # 工具合集总目录（总入口）

&#x20;       ├── index.md          # 工具首页（分类导航+搜索+推荐工具）

&#x20;       ├── common/           # 公共资源目录（共用CSS/JS/图标）

&#x20;       │   ├── css/tool-common.css  # 所有页面共用样式

&#x20;       │   └── js/tool-search.js    # 工具搜索功能脚本

&#x20;       ├── investment/       # 分类1：投资类工具

&#x20;       │   ├── index.md      # 投资类分类页（展示该类下所有工具）

&#x20;       │   ├── calculator/   # 工具1：投资资金配置计算器

&#x20;       │   │   └── index.html

&#x20;       │   └── compound/     # 工具2：复利收益分析器

&#x20;       │       └── index.html

&#x20;       ├── study/            # 分类2：学习类工具

&#x20;       │   ├── index.md      # 学习类分类页

&#x20;       │   ├── note-template/ # 工具1：笔记模板生成器

&#x20;       │   │   └── index.html

&#x20;       │   └── flashcard/    # 工具2：单词卡片制作工具

&#x20;       │       └── index.html

&#x20;       └── coding/           # 分类3：编程类工具

&#x20;           ├── index.md      # 编程类分类页

&#x20;           ├── formatter/    # 工具1：代码格式化工具（静态HTML）

&#x20;           │   └── index.html

&#x20;           └── json-parser/  # 工具2：JSON解析器（跳转外部链接）

&#x20;               └── index.md  # 用Markdown配置跳转链接
```

### 2.2 核心页面功能设计



| 页面类型      | 核心功能                                              | 示例访问路径                                                                                                                                                                                                                                                                                                                                                                               |
| --------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 工具首页      | 1. 分类导航栏（投资 / 学习 / 编程）；2. 工具搜索框；3. 热门工具推荐；4. 分类简介 | [http://xxx.com/t](http://xxx.com/tools/)[ools/](http://xxx.com/tools/)                                                                                                                                                                                                                                                                                                              |
| 分类页（如投资类） | 1. 展示该分类下所有工具卡片；2. 工具排序（热门 / 最新）；3. 返回首页按钮        | [http://xxx.co](http://xxx.com/tools/investment/)[m/too](http://xxx.com/tools/investment/)[ls/in](http://xxx.com/tools/investment/)[vestm](http://xxx.com/tools/investment/)[ent/](http://xxx.com/tools/investment/)                                                                                                                                                                 |
| 工具详情页     | 1. 工具主体功能；2. 工具说明（用途 / 使用方法）；3. 返回分类页按钮           | [http://xxx.com/to](http://xxx.com/tools/investment/calculator/)[ols/i](http://xxx.com/tools/investment/calculator/)[nvest](http://xxx.com/tools/investment/calculator/)[ment/](http://xxx.com/tools/investment/calculator/)[calcu](http://xxx.com/tools/investment/calculator/)[lator](http://xxx.com/tools/investment/calculator/)[/](http://xxx.com/tools/investment/calculator/) |

## 三、使用手册（分步落地指南）

### 3.1 准备工作

#### 3.1.1 环境要求

同原方案（Hexo ≥5.0、现代浏览器、文本编辑器），新增：若需实现搜索功能，需确保博客支持引入 JavaScript 脚本（默认支持）。

#### 3.1.2 依赖资源



* Font Awesome 图标库（分类图标、工具图标）；

* 公共 CSS/JS：`tool-common.css`（统一样式）、`tool-search.js`（搜索功能），后续会提供模板；

* 各类型工具资源：静态 HTML 工具、外部工具链接、文档模板等。

### 3.2 第一步：搭建工具首页（总入口，`tools/``index.md`）

工具首页是用户进入工具库的第一站，核心是 “分类导航” 与 “快速搜索”，模板如下：



```
\---

title: 综合工具合集

date: 2025-10-21 10:00:00

layout: page

comments: false

sidebar: false

\---

\<!-- 搜索框 -->

\<div class="tool-search">

&#x20; \<input type="text" id="searchInput" placeholder="搜索工具（如“代码格式化”“复利计算”）...">

&#x20; \<button id="searchBtn">\<i class="fas fa-search">\</i>\</button>

&#x20; \<div id="searchResult" class="search-result hidden">\</div> \<!-- 搜索结果展示区 -->

\</div>

\<!-- 分类导航 -->

\<div class="category-nav">

&#x20; \<h2 class="nav-title">工具分类\</h2>

&#x20; \<div class="category-cards">

&#x20;   \<!-- 投资类分类卡片 -->

&#x20;   \<a href="/tools/investment/" class="category-card">

&#x20;     \<div class="category-icon bg-blue-100 text-blue-600">

&#x20;       \<i class="fas fa-chart-pie fa-2x">\</i>

&#x20;     \</div>

&#x20;     \<h3 class="category-name">投资类工具\</h3>

&#x20;     \<p class="category-desc">10+ 投资计算、收益分析、风险评估工具\</p>

&#x20;   \</a>

&#x20;   \<!-- 学习类分类卡片 -->

&#x20;   \<a href="/tools/study/" class="category-card">

&#x20;     \<div class="category-icon bg-green-100 text-green-600">

&#x20;       \<i class="fas fa-book-open fa-2x">\</i>

&#x20;     \</div>

&#x20;     \<h3 class="category-name">学习类工具\</h3>

&#x20;     \<p class="category-desc">8+ 笔记模板、单词卡片、学习计划生成工具\</p>

&#x20;   \</a>

&#x20;   \<!-- 编程类分类卡片 -->

&#x20;   \<a href="/tools/coding/" class="category-card">

&#x20;     \<div class="category-icon bg-purple-100 text-purple-600">

&#x20;       \<i class="fas fa-code fa-2x">\</i>

&#x20;     \</div>

&#x20;     \<h3 class="category-name">编程类工具\</h3>

&#x20;     \<p class="category-desc">12+ 代码格式化、JSON解析、语法检查工具\</p>

&#x20;   \</a>

&#x20;   \<!-- 新增分类只需复制上方卡片，修改图标、名称、链接 -->

&#x20; \</div>

\</div>

\<!-- 热门工具推荐 -->

\<div class="hot-tools">

&#x20; \<h2 class="section-title">热门工具\</h2>

&#x20; \<div class="tool-list">

&#x20;   \<!-- 热门工具1：投资计算器 -->

&#x20;   \<a href="/tools/investment/calculator/" class="hot-tool-card">

&#x20;     \<i class="fas fa-calculator">\</i>

&#x20;     \<h4>投资资金配置计算器\</h4>

&#x20;     \<span class="tool-category">投资类\</span>

&#x20;   \</a>

&#x20;   \<!-- 热门工具2：代码格式化工具 -->

&#x20;   \<a href="/tools/coding/formatter/" class="hot-tool-card">

&#x20;     \<i class="fas fa-code">\</i>

&#x20;     \<h4>代码格式化工具\</h4>

&#x20;     \<span class="tool-category">编程类\</span>

&#x20;   \</a>

&#x20; \</div>

\</div>

\<!-- 引入公共样式与脚本 -->

\<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

\<link rel="stylesheet" href="/tools/common/css/tool-common.css">

\<script src="/tools/common/js/tool-search.js">\</script>
```

### 3.3 第二步：搭建分类页（如投资类，`tools/investment/``index.md`）

分类页展示该类下所有工具，结构统一，方便用户浏览，模板如下：



```
\---

title: 投资类工具

date: 2025-10-21 10:30:00

layout: page

comments: false

sidebar: false

\---

\<!-- 分类头部：返回首页+分类简介 -->

\<div class="category-header">

&#x20; \<a href="/tools/" class="back-home">\<i class="fas fa-arrow-left">\</i> 返回工具合集\</a>

&#x20; \<h1 class="category-title">投资类工具\</h1>

&#x20; \<p class="category-intro">专注于投资决策辅助，包含收益计算、风险分析、资金配置等工具，助力科学投资。\</p>

\</div>

\<!-- 工具列表 -->

\<div class="tool-container">

&#x20; \<!-- 工具1：投资资金配置计算器 -->

&#x20; \<div class="tool-card">

&#x20;   \<div class="tool-icon bg-blue-100 text-blue-600">

&#x20;     \<i class="fas fa-calculator fa-xl">\</i>

&#x20;   \</div>

&#x20;   \<h3 class="tool-name">投资资金配置计算器\</h3>

&#x20;   \<p class="tool-desc">输入稳钱、长钱、海外账户的年化收益和占比，实时计算综合收益，生成风险偏好配置表。\</p>

&#x20;   \<div class="tool-tags">

&#x20;     \<span class="tag">收益计算\</span>

&#x20;     \<span class="tag">资金配置\</span>

&#x20;   \</div>

&#x20;   \<a href="/tools/investment/calculator/" class="tool-btn">立即使用 →\</a>

&#x20; \</div>

&#x20; \<!-- 工具2：复利收益分析器 -->

&#x20; \<div class="tool-card">

&#x20;   \<div class="tool-icon bg-blue-100 text-blue-600">

&#x20;     \<i class="fas fa-chart-line fa-xl">\</i>

&#x20;   \</div>

&#x20;   \<h3 class="tool-name">复利收益分析器\</h3>

&#x20;   \<p class="tool-desc">输入本金、年化收益、投资期限，计算复利终值，生成收益趋势图，直观展示“滚雪球”效果。\</p>

&#x20;   \<div class="tool-tags">

&#x20;     \<span class="tag">复利计算\</span>

&#x20;     \<span class="tag">趋势分析\</span>

&#x20;   \</div>

&#x20;   \<a href="/tools/investment/compound/" class="tool-btn">立即使用 →\</a>

&#x20; \</div>

\</div>

\<!-- 引入公共样式 -->

\<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

\<link rel="stylesheet" href="/tools/common/css/tool-common.css">
```

### 3.4 第三步：添加工具详情页（分两种类型）

#### 3.4.1 类型 1：静态 HTML 工具（如计算器，`tools/investment/calculator/index.html`）

直接放入静态 HTML 文件，注意资源路径引用（根路径）：



```
\<!DOCTYPE html>

\<html lang="zh-CN">

\<head>

&#x20; \<meta charset="UTF-8">

&#x20; \<meta name="viewport" content="width=device-width, initial-scale=1.0">

&#x20; \<title>投资资金配置计算器\</title>

&#x20; \<link rel="stylesheet" href="/tools/common/css/tool-common.css"> \<!-- 引用公共样式 -->

&#x20; \<style>

&#x20;   /\* 工具专属样式 \*/

&#x20;   .calculator-container { padding: 20px; }

&#x20;   /\* ... 其他样式 ... \*/

&#x20; \</style>

\</head>

\<body>

&#x20; \<!-- 返回分类页 -->

&#x20; \<a href="/tools/investment/" class="back-category">\<i class="fas fa-arrow-left">\</i> 返回投资类工具\</a>

&#x20;&#x20;

&#x20; \<!-- 工具主体 -->

&#x20; \<div class="calculator-container">

&#x20;   \<h1>投资资金配置计算器\</h1>

&#x20;   \<!-- 工具功能代码（如输入框、计算逻辑） -->

&#x20;   \<!-- ... 省略具体代码 ... -->

&#x20; \</div>

&#x20; \<script src="/tools/investment/calculator/js/script.js">\</script>

\</body>

\</html>
```

#### 3.4.2 类型 2：外部链接工具（如在线 JSON 解析器，`tools/coding/json-parser/``index.md`）

用 Markdown 配置跳转链接，无需开发静态页面：



```
\---

title: JSON解析器（在线工具）

date: 2025-10-21 11:00:00

layout: page

comments: false

sidebar: false

\---

\<div class="external-tool">

&#x20; \<a href="/tools/coding/" class="back-category">\<i class="fas fa-arrow-left">\</i> 返回编程类工具\</a>

&#x20; \<h1>JSON解析器（在线工具）\</h1>

&#x20; \<p class="tool-desc">推荐一款稳定的在线JSON解析工具，支持格式化、校验、压缩功能，无需下载安装。\</p>

&#x20; \<a href="https://www.json.cn/" target="\_blank" class="external-btn">前往在线工具 →\</a>

&#x20; \<p class="tip">提示：点击按钮将跳转到外部网站，若无法访问请检查网络。\</p>

\</div>

\<link rel="stylesheet" href="/tools/common/css/tool-common.css">
```

### 3.5 第四步：配置公共资源（统一样式与功能）

#### 3.5.1 公共 CSS（`tools/common/css/tool-common.css`）

统一所有页面的样式，避免重复编写：



```
/\* 基础重置 \*/

\* { margin: 0; padding: 0; box-sizing: border-box; }

body { font-family: "Microsoft YaHei", sans-serif; background: #f9fafb; color: #374151; }

/\* 搜索框样式 \*/

.tool-search { max-width: 800px; margin: 0 auto 40px; position: relative; }

\#searchInput { width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 16px; }

\#searchBtn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #6b7280; cursor: pointer; }

.search-result { position: absolute; top: 100%; left: 0; width: 100%; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); z-index: 10; padding: 16px; margin-top: 8px; }

/\* 分类卡片样式 \*/

.category-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1200px; margin: 0 auto; }

.category-card { background: #fff; border-radius: 12px; padding: 24px; text-decoration: none; color: inherit; transition: transform 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }

.category-card:hover { transform: translateY(-5px); }

.category-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }

/\* 工具卡片样式 \*/

.tool-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 1200px; margin: 30px auto 0; padding: 0 20px; }

.tool-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }

.tool-btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 500; }

/\* 返回按钮样式 \*/

.back-home, .back-category { display: inline-block; margin-bottom: 20px; color: #3b82f6; text-decoration: none; font-size: 14px; }

/\* 响应式适配 \*/

@media (max-width: 768px) {

&#x20; .category-cards, .tool-container { grid-template-columns: 1fr; gap: 16px; padding: 0 16px; }

&#x20; .tool-search { padding: 0 16px; }

}
```

## 四、功能扩展与进阶配置

### 4.1 搜索功能完善（`tool-search.js` 实现）

搜索功能需支持跨分类检索工具，匹配工具名称、描述及标签，实现代码如下：

```javascript
// tools/common/js/tool-search.js
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const searchResult = document.getElementById('searchResult');
  
  // 工具数据索引（需手动维护，新增工具时同步更新）
  const toolIndex = [
    {
      name: '投资资金配置计算器',
      desc: '输入稳钱、长钱、海外账户的年化收益和占比，实时计算综合收益',
      category: '投资类',
      tags: ['收益计算', '资金配置'],
      url: '/tools/investment/calculator/'
    },
    {
      name: '复利收益分析器',
      desc: '输入本金、年化收益、投资期限，计算复利终值并生成趋势图',
      category: '投资类',
      tags: ['复利计算', '趋势分析'],
      url: '/tools/investment/compound/'
    },
    {
      name: '代码格式化工具',
      desc: '支持多语言代码格式化，自动调整缩进和语法结构',
      category: '编程类',
      tags: ['代码处理', '格式化'],
      url: '/tools/coding/formatter/'
    },
    {
      name: 'JSON解析器（在线工具）',
      desc: '在线解析JSON数据，支持格式化、校验和压缩',
      category: '编程类',
      tags: ['数据处理', 'JSON'],
      url: '/tools/coding/json-parser/'
    }
    // 新增工具需在此处添加对应数据
  ];

  // 搜索逻辑
  const searchTools = (keyword) => {
    if (!keyword.trim()) {
      searchResult.classList.add('hidden');
      return;
    }
    
    const lowerKeyword = keyword.toLowerCase();
    const results = toolIndex.filter(tool => 
      tool.name.toLowerCase().includes(lowerKeyword) || 
      tool.desc.toLowerCase().includes(lowerKeyword) ||
      tool.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
    
    renderResults(results);
  };

  // 渲染搜索结果
  const renderResults = (results) => {
    if (results.length === 0) {
      searchResult.innerHTML = '<p class="no-result">未找到匹配的工具，请尝试其他关键词</p>';
      searchResult.classList.remove('hidden');
      return;
    }
    
    let html = '<ul class="result-list">';
    results.forEach(tool => {
      html += `
        <li class="result-item">
          <a href="${tool.url}" class="result-link">
            <h4>${tool.name}</h4>
            <p class="result-desc">${tool.desc}</p>
            <span class="result-category">${tool.category}</span>
          </a>
        </li>
      `;
    });
    html += '</ul>';
    
    searchResult.innerHTML = html;
    searchResult.classList.remove('hidden');
  };

  // 事件绑定
  searchBtn.addEventListener('click', () => searchTools(searchInput.value));
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchTools(searchInput.value);
  });
  
  // 点击页面其他区域关闭搜索结果
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResult.contains(e.target) && !searchBtn.contains(e.target)) {
      searchResult.classList.add('hidden');
    }
  });
});
```

### 4.2 工具排序功能实现（分类页扩展）

在分类页添加排序功能，支持按「热门程度」和「最新添加」排序：

```html
<!-- 在分类页（如investment/index.md）的category-header中添加 -->
<div class="sort-controls">
  <span>排序方式：</span>
  <button class="sort-btn active" data-sort="hot">热门程度</button>
  <button class="sort-btn" data-sort="new">最新添加</button>
</div>

<!-- 对应CSS（添加到tool-common.css） -->
.sort-controls { margin: 16px 0; }
.sort-btn { 
  background: #f3f4f6; 
  border: none; 
  padding: 6px 12px; 
  border-radius: 4px; 
  margin-left: 8px; 
  cursor: pointer;
}
.sort-btn.active { 
  background: #3b82f6; 
  color: white; 
}

<!-- 排序功能脚本（可单独创建tool-sort.js或添加到现有脚本） -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const sortBtns = document.querySelectorAll('.sort-btn');
  const toolContainer = document.querySelector('.tool-container');
  const toolCards = Array.from(toolContainer.children);
  
  // 为工具卡片添加数据属性（实际使用时根据工具真实信息设置）
  toolCards[0].setAttribute('data-hot', '98'); // 热门指数
  toolCards[0].setAttribute('data-date', '2025-10-15'); // 创建日期
  toolCards[1].setAttribute('data-hot', '85');
  toolCards[1].setAttribute('data-date', '2025-10-20');
  
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 更新按钮状态
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const sortType = btn.getAttribute('data-sort');
      let sortedCards;
      
      if (sortType === 'hot') {
        // 按热门指数降序
        sortedCards = [...toolCards].sort((a, b) => 
          b.getAttribute('data-hot') - a.getAttribute('data-hot')
        );
      } else {
        // 按日期降序（最新在前）
        sortedCards = [...toolCards].sort((a, b) => 
          new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'))
        );
      }
      
      // 重新渲染排序后的卡片
      sortedCards.forEach(card => toolContainer.appendChild(card));
    });
  });
});
</script>
```

## 五、新增分类与工具的规范流程

### 5.1 新增分类步骤

1. **创建目录结构**
   ```bash
   # 以新增"生活类"工具为例
   cd hexo-blog/source/tools
   mkdir -p life  # 创建分类目录
   touch life/index.md  # 创建分类页
   ```

2. **配置分类页**  
   复制现有分类页（如`investment/index.md`）内容，修改以下字段：
    - `title`：分类名称（如"生活类工具"）
    - `category-title`：同分类名称
    - `category-intro`：分类描述
    - 工具卡片区域清空，后续添加该分类下的工具

3. **在工具首页添加分类导航**  
   在`tools/index.md`的`category-cards`区域复制现有分类卡片，修改：
    - `href`：指向新分类目录（如"/tools/life/"）
    - `category-icon`：更换图标（参考Font Awesome图标库）
    - `category-name`和`category-desc`：更新为新分类信息

### 5.2 新增工具步骤

根据工具类型选择对应方式：

#### 5.2.1 新增静态HTML工具
1. 创建工具目录：
   ```bash
   mkdir -p tools/life/weather-forecast  # 以生活类的"天气预报工具"为例
   ```
2. 在目录中创建`index.html`，参考3.4.1的模板格式
3. 在对应分类页（`life/index.md`）添加工具卡片
4. 在`tool-search.js`的`toolIndex`中添加工具索引数据

#### 5.2.2 新增外部链接工具
1. 创建工具目录及配置文件：
   ```bash
   mkdir -p tools/life/map-tools
   touch tools/life/map-tools/index.md
   ```
2. 参考3.4.2的模板配置`index.md`，修改链接和描述
3. 在对应分类页添加工具卡片
4. 在`tool-search.js`的`toolIndex`中添加工具索引数据

## 六、常见问题与解决方案

### 6.1 路径引用问题
- **现象**：CSS/JS资源加载失败，工具页面样式错乱
- **解决方案**：
    - 确保所有资源引用使用根路径（以`/`开头），如`/tools/common/css/tool-common.css`
    - 本地调试时使用`hexo server`命令启动服务，避免直接打开HTML文件

### 6.2 搜索功能不生效
- **现象**：搜索关键词无结果或结果错误
- **解决方案**：
    - 检查`tool-search.js`中的`toolIndex`是否包含对应工具数据
    - 确保关键词匹配逻辑正确（名称、描述、标签均需检查）
    - 清除浏览器缓存后重新测试

### 6.3 响应式适配问题
- **现象**：移动端页面布局错乱
- **解决方案**：
    - 检查CSS中`@media (max-width: 768px)`的响应式配置
    - 确保工具卡片使用`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`实现自适应

## 七、版本迭代记录

| 版本 | 日期       | 更新内容                          |
|------|------------|-----------------------------------|
| v1.0 | 2025-10-21 | 基础框架搭建，支持3大分类共6个工具 |
| v1.1 | 2025-10-28 | 新增搜索功能和工具排序功能        |
| v1.2 | 2025-11-05 | 完善响应式适配，添加生活类分类    |

## 八、未来扩展方向

1. **自动化索引生成**：通过Hexo插件自动扫描工具目录生成`toolIndex`数据，避免手动维护
2. **用户反馈功能**：为每个工具添加评分和评论功能，提升工具质量
3. **工具收藏夹**：通过本地存储实现用户个性化工具收藏
4. **多语言支持**：添加中英文切换功能，适配国际化需求

通过以上完善，该方案不仅实现了基础的工具分类与管理功能，还通过搜索、排序等增强功能提升了用户体验，同时提供了清晰的扩展规范，方便后续持续迭代升级。