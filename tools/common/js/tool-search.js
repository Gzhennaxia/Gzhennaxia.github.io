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