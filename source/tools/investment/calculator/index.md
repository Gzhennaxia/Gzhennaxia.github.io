---
title: 投资资金配置与收益计算器
date: 2025-10-20 10:00:00
layout: page
comments: false
sidebar: false
---


<div class="page-container">
    <!-- 页面标题 -->
    <h1 class="page-title">投资资金配置与综合收益计算器</h1>
    <!-- 核心网格布局 -->
    <div class="grid-container">
        <!-- 左侧：账户参数输入区 -->
        <div class="card">
            <h2 class="card-subtitle">账户参数配置</h2>
            <!-- 稳钱账户输入 -->
            <div class="input-group">
                <label class="input-label">稳钱账户</label>
                <div class="input-grid">
                    <div>
                        <span class="input-desc">年化收益率 (%)</span>
                        <input type="number" step="0.01" value="4.87" class="form-input" id="stableRate">
                    </div>
                    <div>
                        <span class="input-desc">投资占比 (%)</span>
                        <input type="number" step="1" value="30" max="100" min="0" class="form-input" id="stableRatio">
                    </div>
                </div>
            </div>
            <!-- 长钱账户输入 -->
            <div class="input-group">
                <label class="input-label">长钱账户</label>
                <div class="input-grid">
                    <div>
                        <span class="input-desc">年化收益率 (%)</span>
                        <input type="number" step="0.01" value="3.96" class="form-input" id="longRate">
                    </div>
                    <div>
                        <span class="input-desc">投资占比 (%)</span>
                        <input type="number" step="1" value="50" max="100" min="0" class="form-input" id="longRatio">
                    </div>
                </div>
            </div>
            <!-- 海外账户输入 -->
            <div class="input-group">
                <label class="input-label">海外账户</label>
                <div class="input-grid">
                    <div>
                        <span class="input-desc">年化收益率 (%)</span>
                        <input type="number" step="0.01" value="11.94" class="form-input" id="overseasRate">
                    </div>
                    <div>
                        <span class="input-desc">投资占比 (%)</span>
                        <input type="number" step="1" value="20" max="100" min="0" class="form-input" id="overseasRatio">
                    </div>
                </div>
            </div>
            <!-- 占比校验提示 -->
            <div class="ratio-tip" id="ratioTip">
                ⚠️ 三个账户占比总和需为100%，当前总和：<span id="totalRatio">100</span>%
            </div>
        </div>
        <!-- 右侧：实时综合收益展示区 -->
        <div class="card">
            <h2 class="card-subtitle">实时综合收益计算结果</h2>
            <!-- 核心收益结果卡片 -->
            <div class="result-card">
                <div class="result-header">
                    <div class="total-return-wrap">
                        <p class="return-label">当前综合年化收益率</p>
                        <p class="total-return-value" id="totalReturn">5.83%</p>
                    </div>
                    <div class="contribution-grid">
                        <div class="contribution-card">
                            <p class="contribution-label">稳钱账户贡献</p>
                            <p class="contribution-value" id="stableContribution">1.46%</p>
                        </div>
                        <div class="contribution-card">
                            <p class="contribution-label">长钱账户贡献</p>
                            <p class="contribution-value" id="longContribution">1.98%</p>
                        </div>
                        <div class="contribution-card">
                            <p class="contribution-label">海外账户贡献</p>
                            <p class="contribution-value" id="overseasContribution">2.39%</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 风险偏好-配置对应表 -->
            <h3 class="table-title">风险偏好-资金配置-综合收益参照表</h3>
            <div class="table-container">
                <table class="reference-table">
                    <thead>
                        <tr>
                            <th>风险偏好</th>
                            <th>稳钱账户占比</th>
                            <th>长钱账户占比</th>
                            <th>海外账户占比</th>
                            <th>综合年化收益</th>
                            <th>适用人群</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-row">
                            <td>保守型</td>
                            <td>70%</td>
                            <td>30%</td>
                            <td>0%</td>
                            <td class="return-highlight" id="conservativeReturn">4.56%</td>
                            <td class="user-desc">风险厌恶者、临近退休人群</td>
                        </tr>
                        <tr class="table-row">
                            <td>稳健型</td>
                            <td>50%</td>
                            <td>30%</td>
                            <td>20%</td>
                            <td class="return-highlight" id="stableReturn">5.83%</td>
                            <td class="user-desc">普通上班族、不愿承担高风险用户</td>
                        </tr>
                        <tr class="table-row">
                            <td>平衡型</td>
                            <td>30%</td>
                            <td>20%</td>
                            <td>50%</td>
                            <td class="return-highlight" id="balancedReturn">8.30%</td>
                            <td class="user-desc">有3-5年投资周期、能接受短期波动</td>
                        </tr>
                        <tr class="table-row">
                            <td>进取型</td>
                            <td>20%</td>
                            <td>0%</td>
                            <td>80%</td>
                            <td class="return-highlight" id="aggressiveReturn">10.52%</td>
                            <td class="user-desc">年轻投资者、风险承受能力强</td>
                        </tr>
                        <tr class="table-row">
                            <td>激进型</td>
                            <td>0%</td>
                            <td>0%</td>
                            <td>100%</td>
                            <td class="return-highlight" id="extremeReturn">11.94%</td>
                            <td class="user-desc">专业投资者、有海外市场经验</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
    // 获取所有输入元素
    const stableRate = document.getElementById('stableRate');
    const stableRatio = document.getElementById('stableRatio');
    const longRate = document.getElementById('longRate');
    const longRatio = document.getElementById('longRatio');
    const overseasRate = document.getElementById('overseasRate');
    const overseasRatio = document.getElementById('overseasRatio');
    const totalReturn = document.getElementById('totalReturn');
    const stableContribution = document.getElementById('stableContribution');
    const longContribution = document.getElementById('longContribution');
    const overseasContribution = document.getElementById('overseasContribution');
    const ratioTip = document.getElementById('ratioTip');
    const totalRatio = document.getElementById('totalRatio');        
    // 获取参照表收益展示元素
    const conservativeReturn = document.getElementById('conservativeReturn');
    const stableReturn = document.getElementById('stableReturn');
    const balancedReturn = document.getElementById('balancedReturn');
    const aggressiveReturn = document.getElementById('aggressiveReturn');
    const extremeReturn = document.getElementById('extremeReturn');
    // 实时计算函数
    function calculateReturn() {
        // 转换为数值（默认值兜底）
        const sRate = parseFloat(stableRate.value) || 0;
        const sRatio = parseFloat(stableRatio.value) || 0;
        const lRate = parseFloat(longRate.value) || 0;
        const lRatio = parseFloat(longRatio.value) || 0;
        const oRate = parseFloat(overseasRate.value) || 0;
        const oRatio = parseFloat(overseasRatio.value) || 0;            
        // 计算占比总和
        const ratioSum = sRatio + lRatio + oRatio;
        totalRatio.textContent = ratioSum.toFixed(0);            
        // 占比校验（非100%时提示）
        if (ratioSum !== 100) {
            ratioTip.classList.remove('hidden');
        } else {
            ratioTip.classList.add('hidden');
        }
        // 计算各账户收益贡献
        const sContribution = (sRate * sRatio / 100).toFixed(2);
        const lContribution = (lRate * lRatio / 100).toFixed(2);
        const oContribution = (oRate * oRatio / 100).toFixed(2);
        // 计算综合收益
        const total = (parseFloat(sContribution) + parseFloat(lContribution) + parseFloat(oContribution)).toFixed(2);
        // 更新实时结果展示
        stableContribution.textContent = `${sContribution}%`;
        longContribution.textContent = `${lContribution}%`;
        overseasContribution.textContent = `${oContribution}%`;
        totalReturn.textContent = `${total}%`;
        // 更新参照表收益（基于当前账户收益率，固定占比）
        conservativeReturn.textContent = `${(sRate*0.7 + lRate*0.3 + oRate*0).toFixed(2)}%`;
        stableReturn.textContent = `${(sRate*0.5 + lRate*0.3 + oRate*0.2).toFixed(2)}%`;
        balancedReturn.textContent = `${(sRate*0.3 + lRate*0.2 + oRate*0.5).toFixed(2)}%`;
        aggressiveReturn.textContent = `${(sRate*0.2 + lRate*0 + oRate*0.8).toFixed(2)}%`;
        extremeReturn.textContent = `${(sRate*0 + lRate*0 + oRate*1).toFixed(2)}%`;
    }
    // 为所有输入框添加实时监听
    [stableRate, stableRatio, longRate, longRatio, overseasRate, overseasRatio].forEach(input => {
        input.addEventListener('input', calculateReturn);
    });
    // 初始加载时计算一次
    calculateReturn();
</script>

<style>
    /* 页面容器：控制最大宽度并居中 */
    .page-container {
        max-width: 1600px;
        margin: 0 auto;
    }
    /* 页面标题样式 */
    .page-title {
        font-size: 24px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 32px;
        text-align: center;
    }
    /* 核心网格布局：响应式分栏 */
    .grid-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
        margin-bottom: 32px;
    }
    /* 大屏适配：3列布局 */
    @media (min-width: 1024px) {
        .grid-container {
            grid-template-columns: 1fr 2fr;
        }
        .page-title {
            font-size: 36px;
        }
    }
    /* 卡片通用样式（输入区+结果区） */
    .card {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    /* 子标题样式（账户配置/收益结果） */
    .card-subtitle {
        font-size: 20px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 16px;
    }
    /* 输入项组样式 */
    .input-group {
        margin-bottom: 20px;
    }
    .input-label {
        display: block;
        color: #4b5563;
        font-weight: 500;
        margin-bottom: 4px;
    }
    /* 输入项双列布局 */
    .input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    .input-desc {
        display: block;
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 4px;
    }
    /* 输入框样式 */
    .form-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 16px;
    }
    .form-input:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 1px;
    }
    /* 占比校验提示 */
    .ratio-tip {
        font-size: 14px;
        color: #ef4444;
        margin-top: 8px;
        display: none;
    }
    /* 结果卡片样式 */
    .result-card {
        background-color: #eff6ff;
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    /* 结果卡片内部布局 */
    .result-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }
    .total-return-wrap {
        text-align: center;
        margin-bottom: 16px;
    }
    .return-label {
        font-size: 18px;
        color: #4b5563;
    }
    .total-return-value {
        font-size: 36px;
        font-weight: 700;
        color: #2563eb;
        margin-top: 8px;
    }
    /* 各账户贡献布局 */
    .contribution-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        width: 100%;
    }
    .contribution-card {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
    }
    .contribution-label {
        font-size: 14px;
        color: #6b7280;
    }
    .contribution-value {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin-top: 4px;
    }
    /* 大屏适配：结果卡片横向布局 */
    @media (min-width: 768px) {
        .result-header {
            flex-direction: row;
        }
        .total-return-wrap {
            text-align: left;
            margin-bottom: 0;
        }
        .total-return-value {
            font-size: 48px;
        }
        .contribution-grid {
            width: auto;
        }
    }
    /* 参照表标题 */
    .table-title {
        font-size: 18px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 12px;
    }
    /* 表格容器：横向滚动适配 */
    .table-container {
        overflow-x: auto;
    }
    /* 表格样式 */
    .reference-table {
        width: 100%;
        border-collapse: collapse;
    }
    .reference-table thead {
        background-color: #f3f4f6;
    }
    .reference-table th,
    .reference-table td {
        border: 1px solid #d1d5db;
        padding: 12px 16px;
        text-align: left;
        color: #374151;
    }
    .reference-table th {
        font-weight: 600;
    }
    .reference-table .table-row {
        border-bottom: 1px solid #e5e7eb;
    }
    .reference-table .table-row:hover {
        background-color: rgba(59,130,246,0.05);
    }
    .return-highlight {
        font-weight: 500;
    }
    .user-desc {
        font-size: 14px;
    }
</style>