# GOC01 新项目创建向导与进度展示 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 GOC01 的新项目创建细分向导（Onboarding Modal）以及项目创建后的“数据初始化中”状态页（Status Page）。

**Architecture:** 
当前项目是一个基于原生 HTML/CSS/JS 的前端项目（没有使用 React/Vue 等框架，主要文件为 `app.html`, `app.css`, `goc-settings-surface.css`）。
我们将采用原生 DOM 操作和 CSS 类切换来实现向导的步骤切换（Step 1 -> Step 2 -> Step 3）和状态页展示。
- **向导模块 (Onboarding Modal)**: 包含在 `app.html` 中的一个弹窗覆盖层，通过 JavaScript 控制显示隐藏和步骤切换。
- **状态页模块 (Status Page)**: 当用户点击处于“准备中”状态的项目时，隐藏主 Dashboard，显示状态页容器。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript

---

### Task 1: 搭建创建向导 (Onboarding Modal) 的 HTML 骨架

**Files:**
- Modify: `app.html`

- [ ] **Step 1: 在 `app.html` 中添加向导弹窗的 HTML 结构**
在 `<body>` 标签的末尾（或其他模态框附近）添加向导的 HTML 结构。包含遮罩层、弹窗容器、顶部步骤指示器、帮助文档链接、内容区（分 3 个 step 容器）和底部按钮区。

```html
<!-- 新建项目向导弹窗 -->
<div id="onboarding-modal" class="modal-overlay" style="display: none;">
  <div class="modal-container onboarding-container">
    <div class="modal-header">
      <h2>新建项目</h2>
      <a href="#" class="help-link" target="_blank">查看新建项目配置指南</a>
      <button class="close-btn" id="close-onboarding-btn">&times;</button>
    </div>
    
    <!-- 步骤指示器 -->
    <div class="stepper-indicator">
      <div class="step active" data-step="1">1. 基础信息</div>
      <div class="step-line"></div>
      <div class="step" data-step="2">2. 核心授权</div>
      <div class="step-line"></div>
      <div class="step" data-step="3">3. 附加配置</div>
    </div>

    <!-- 步骤内容区 -->
    <div class="modal-body">
      <!-- Step 1: 基础信息 -->
      <div class="step-content active" id="step-1-content">
        <p class="step-desc">此步骤用于定义项目的基础档案，配置后方便在项目列表中识别和管理。</p>
        <div class="form-group">
          <label>项目名称 <span class="required">*</span></label>
          <input type="text" id="ob-project-name" placeholder="建议使用“品牌名-站点”格式，例如 Apple-US">
        </div>
        <div class="form-group">
          <label>项目区域 <span class="required">*</span></label>
          <input type="text" id="ob-project-region" value="all" placeholder="填写品牌站点区域，无明确区分可保持默认 all">
        </div>
        <div class="form-group">
          <label>产品线 <span class="required">*</span></label>
          <input type="text" id="ob-project-product" value="all" placeholder="填写当前项目内的产品线名称，无明确区分可保持默认 all">
        </div>
      </div>

      <!-- Step 2: 核心数据源授权 -->
      <div class="step-content" id="step-2-content" style="display: none;">
        <p class="step-desc">系统需要 GA4 和 BigQuery 权限以拉取网站行为数据并进行 AI 模型训练。授权后系统将自动检测或创建所需的数据集，无需人工干预 GCP 后台。</p>
        <div class="auth-box">
          <button class="btn-primary auth-btn" id="ob-google-auth-btn">
            <img src="./assets/google-icon.svg" alt="Google" class="btn-icon" onerror="this.style.display='none'"> 
            使用 Google 账号一键授权
          </button>
          <div class="auth-status" id="ob-core-auth-status" style="display: none;">
            <div class="status-item"><span class="status-icon success">✓</span> GA4 授权成功</div>
            <div class="status-item"><span class="status-icon success">✓</span> BigQuery 授权成功</div>
          </div>
        </div>
      </div>

      <!-- Step 3: 附加配置 -->
      <div class="step-content" id="step-3-content" style="display: none;">
        <p class="step-desc">Google Ads 用于同步广告投放成本数据，GTM 用于后续 AI 人群推送功能的埋点。这些是可选配置，跳过不影响基础数据看板的使用，但配置后能解锁更高级的 ROI 分析和推送功能。</p>
        
        <div class="config-section">
          <h4>Google Ads 授权 (可选)</h4>
          <p class="config-question">您的品牌是否投放 Google Ads？</p>
          <div class="radio-group">
            <label><input type="radio" name="has-ads" value="yes"> 是</label>
            <label><input type="radio" name="has-ads" value="no" checked> 否</label>
          </div>
          <div class="auth-action" id="ads-auth-action" style="display: none;">
            <button class="btn-secondary auth-btn">授权 Google Ads</button>
          </div>
        </div>

        <div class="config-section">
          <h4>GTM 配置 (可选)</h4>
          <p class="config-question">是否需要配置 Google Tag Manager 自动埋点？</p>
          <div class="radio-group">
            <label><input type="radio" name="need-gtm" value="yes"> 是</label>
            <label><input type="radio" name="need-gtm" value="no" checked> 否</label>
          </div>
          <div class="auth-action" id="gtm-auth-action" style="display: none;">
            <button class="btn-secondary auth-btn">授权 GTM</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮区 -->
    <div class="modal-footer">
      <button class="btn-secondary" id="ob-prev-btn" style="display: none;">上一步</button>
      <button class="btn-primary" id="ob-next-btn">下一步</button>
      <button class="btn-primary" id="ob-submit-btn" style="display: none;">提交并创建项目</button>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 验证 HTML 结构是否已成功添加**
Run: `grep -n "onboarding-modal" app.html`
Expected: 输出包含 `id="onboarding-modal"` 的行号。

### Task 2: 编写向导组件的样式 (CSS)

**Files:**
- Modify: `app.css`

- [ ] **Step 1: 在 `app.css` 中添加向导组件的样式**
在文件末尾添加以下样式，确保与现有 UI 风格统一（使用现有的主色调、圆角等）。

```css
/* Onboarding Modal Styles */
.onboarding-container {
  width: 600px;
  max-width: 90%;
}

.modal-header .help-link {
  font-size: 14px;
  color: var(--primary-color, #1456f0);
  text-decoration: none;
  margin-left: 16px;
  font-weight: normal;
}

.modal-header .help-link:hover {
  text-decoration: underline;
}

.stepper-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
}

.stepper-indicator .step {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

.stepper-indicator .step.active {
  color: var(--primary-color, #1456f0);
}

.stepper-indicator .step-line {
  flex: 1;
  height: 2px;
  background-color: #e8e8e8;
  margin: 0 15px;
}

.step-desc {
  font-size: 14px;
  color: #595959;
  margin-bottom: 24px;
  line-height: 1.5;
  background-color: #e6f7ff;
  padding: 12px 16px;
  border-radius: 4px;
  border-left: 4px solid var(--primary-color, #1456f0);
}

.auth-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  font-size: 16px;
}

.auth-status {
  margin-top: 24px;
  width: 100%;
  max-width: 300px;
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.status-icon.success {
  color: #52c41a;
  margin-right: 8px;
  font-weight: bold;
}

.config-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.config-section h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 16px;
}

.config-question {
  margin-bottom: 12px;
  font-size: 14px;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
```

- [ ] **Step 2: 验证 CSS 是否已成功添加**
Run: `grep -n "onboarding-container" app.css`
Expected: 输出包含 `.onboarding-container` 的行号。

### Task 3: 实现向导逻辑 (JavaScript)

**Files:**
- Modify: `app.html` (在 `<script>` 标签中添加逻辑)

- [ ] **Step 1: 在 `app.html` 的 script 区域添加向导交互逻辑**
找到处理页面逻辑的 `<script>` 标签（通常在文件末尾），添加步骤切换和单选框联动的逻辑。

```javascript
// Onboarding Logic
document.addEventListener('DOMContentLoaded', function() {
  let currentStep = 1;
  const totalSteps = 3;
  
  const modal = document.getElementById('onboarding-modal');
  const closeBtn = document.getElementById('close-onboarding-btn');
  const prevBtn = document.getElementById('ob-prev-btn');
  const nextBtn = document.getElementById('ob-next-btn');
  const submitBtn = document.getElementById('ob-submit-btn');
  
  // 假设有一个触发新建项目的按钮，这里绑定事件（如果是现有按钮，请替换ID）
  // const createProjectBtn = document.getElementById('create-project-btn');
  // if(createProjectBtn) {
  //   createProjectBtn.addEventListener('click', () => {
  //     modal.style.display = 'flex';
  //     currentStep = 1;
  //     updateStepView();
  //   });
  // }
  
  if(closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  if(prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  }
  
  if(nextBtn) {
    nextBtn.addEventListener('click', () => {
      // Step 1 校验
      if (currentStep === 1) {
        const name = document.getElementById('ob-project-name').value.trim();
        if (!name) {
          alert('请输入项目名称');
          return;
        }
      }
      
      // Step 2 模拟授权校验 (实际需对接后端)
      if (currentStep === 2) {
        // 模拟已授权
        document.getElementById('ob-core-auth-status').style.display = 'block';
      }
      
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepView();
      }
    });
  }
  
  if(submitBtn) {
    submitBtn.addEventListener('click', () => {
      // 模拟提交并进入准备中状态
      modal.style.display = 'none';
      alert('项目创建成功，正在初始化数据...');
      // 实际应用中这里会刷新项目列表，或直接跳转到该项目的状态页
      showStatusPage(); // 见 Task 5
    });
  }
  
  // 监听单选框变化
  const adsRadios = document.querySelectorAll('input[name="has-ads"]');
  adsRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('ads-auth-action').style.display = e.target.value === 'yes' ? 'block' : 'none';
    });
  });
  
  const gtmRadios = document.querySelectorAll('input[name="need-gtm"]');
  gtmRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.getElementById('gtm-auth-action').style.display = e.target.value === 'yes' ? 'block' : 'none';
    });
  });
  
  function updateStepView() {
    // 更新步骤指示器
    document.querySelectorAll('.stepper-indicator .step').forEach(el => {
      const stepNum = parseInt(el.getAttribute('data-step'));
      if (stepNum <= currentStep) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    
    // 更新内容区
    for (let i = 1; i <= totalSteps; i++) {
      const content = document.getElementById(`step-${i}-content`);
      if (content) {
        content.style.display = i === currentStep ? 'block' : 'none';
      }
    }
    
    // 更新按钮
    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    
    if (currentStep === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-block';
    } else {
      nextBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
    }
  }
});
```

- [ ] **Step 2: 验证 JS 是否已成功添加**
Run: `grep -n "updateStepView" app.html`
Expected: 输出包含 `function updateStepView()` 的行号。

### Task 4: 搭建“项目准备中”状态页 HTML 骨架

**Files:**
- Modify: `app.html`

- [ ] **Step 1: 在 `app.html` 的主内容区添加状态页容器**
找到主 Dashboard 的容器（可能是 `<main>` 或特定的 wrapper），在同级添加一个状态页容器。默认隐藏。

```html
<!-- 项目准备中状态页 -->
<div id="preparation-status-page" class="status-page-container" style="display: none;">
  <div class="status-banner">
    🚀 您的项目正在努力准备中。数据积累和 AI 模型训练通常需要 7 天左右，完成后我们将通过邮件通知您。
  </div>
  
  <div class="status-content">
    <h2 class="status-title" id="status-project-name">项目名称 - 数据初始化中</h2>
    
    <div class="vertical-stepper">
      <!-- 节点 1 -->
      <div class="v-step completed">
        <div class="v-step-icon">✓</div>
        <div class="v-step-content">
          <div class="v-step-title">项目与数据集初始化</div>
          <div class="v-step-desc">项目配置已保存，BigQuery 数据集 (PIGOC) 初始化成功。</div>
        </div>
      </div>
      
      <!-- 节点 2 -->
      <div class="v-step in-progress">
        <div class="v-step-icon">⏳</div>
        <div class="v-step-content">
          <div class="v-step-title">数据同步与积累</div>
          <div class="v-step-desc" id="data-sync-desc">已同步 3 / 7 天数据</div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: 42%;"></div>
          </div>
        </div>
      </div>
      
      <!-- 节点 3 -->
      <div class="v-step pending">
        <div class="v-step-icon">3</div>
        <div class="v-step-content">
          <div class="v-step-title">AI 模型训练</div>
          <div class="v-step-desc">启动 2.0 / 3.0 算法双轨训练，生成浓度预测模型。</div>
          <div class="v-step-hint" style="display: none;">正在自动调整参数进行深度训练...</div>
        </div>
      </div>
      
      <!-- 节点 4 -->
      <div class="v-step pending">
        <div class="v-step-icon">4</div>
        <div class="v-step-content">
          <div class="v-step-title">生成浓度报告</div>
          <div class="v-step-desc">模型训练完成，即将为您呈现完整数据看板。</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 验证 HTML 结构是否已成功添加**
Run: `grep -n "preparation-status-page" app.html`
Expected: 输出包含 `id="preparation-status-page"` 的行号。

### Task 5: 编写状态页样式及切换逻辑

**Files:**
- Modify: `app.css`
- Modify: `app.html`

- [ ] **Step 1: 在 `app.css` 中添加状态页样式**

```css
/* Preparation Status Page Styles */
.status-page-container {
  padding: 24px;
  background-color: #fff;
  min-height: calc(100vh - 64px);
}

.status-banner {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  padding: 12px 24px;
  border-radius: 4px;
  color: #0050b3;
  margin-bottom: 32px;
  font-size: 14px;
}

.status-title {
  font-size: 20px;
  margin-bottom: 40px;
  color: #262626;
}

.vertical-stepper {
  max-width: 600px;
  margin: 0 auto;
}

.v-step {
  display: flex;
  margin-bottom: 32px;
  position: relative;
}

.v-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 15px;
  top: 36px;
  bottom: -24px;
  width: 2px;
  background-color: #e8e8e8;
}

.v-step.completed:not(:last-child)::after {
  background-color: var(--primary-color, #1456f0);
}

.v-step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #00000040;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-right: 16px;
  z-index: 1;
}

.v-step.completed .v-step-icon {
  background-color: #fff;
  border-color: var(--primary-color, #1456f0);
  color: var(--primary-color, #1456f0);
}

.v-step.in-progress .v-step-icon {
  background-color: var(--primary-color, #1456f0);
  border-color: var(--primary-color, #1456f0);
  color: #fff;
}

.v-step-content {
  flex: 1;
  padding-top: 4px;
}

.v-step-title {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
}

.v-step.pending .v-step-title {
  color: #8c8c8c;
}

.v-step-desc {
  font-size: 14px;
  color: #595959;
}

.v-step.pending .v-step-desc {
  color: #bfbfbf;
}

.progress-bar-container {
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-top: 12px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--primary-color, #1456f0);
  transition: width 0.3s ease;
}

.v-step-hint {
  font-size: 12px;
  color: #fa8c16;
  margin-top: 8px;
}
```

- [ ] **Step 2: 在 `app.html` 中添加显示状态页的逻辑**
在 Task 3 的 JS 代码中，补充 `showStatusPage` 函数。

```javascript
// 在之前的 script 块中添加
function showStatusPage(projectName = '新项目') {
  // 隐藏主看板区域 (假设主看板 ID 为 main-dashboard，请根据实际情况调整)
  const dashboard = document.querySelector('.dashboard-container') || document.querySelector('.main-content');
  if (dashboard) {
    dashboard.style.display = 'none';
  }
  
  // 显示状态页
  const statusPage = document.getElementById('preparation-status-page');
  if (statusPage) {
    statusPage.style.display = 'block';
    document.getElementById('status-project-name').innerText = `${projectName} - 数据初始化中`;
  }
  
  // 禁用左侧菜单
  const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
  menuItems.forEach(item => {
    item.style.opacity = '0.5';
    item.style.pointerEvents = 'none';
  });
}
```

- [ ] **Step 3: 验证 CSS 和 JS 是否已成功添加**
Run: `grep -n "status-page-container" app.css`
Expected: 输出包含 `.status-page-container` 的行号。
Run: `grep -n "function showStatusPage" app.html`
Expected: 输出包含 `function showStatusPage` 的行号。