# 项目列表与成员管理 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将设置页从单项目配置表单改为多项目列表管理，支持新建项目（最多5个）、查看配置（只读）、成员管理（添加/移除）。

**Architecture:** 在 `app.html` 的 `#panel-settings` 内部新增四个子视图（列表/新建/查看配置/成员管理），通过 JS 函数切换显示/隐藏。数据结构在现有 localStorage 的 `userProjects` 数组中新增 `members` 字段。所有改动集中在 `app.html`（HTML 结构 + 内联 JS）和 `app.css`（新增样式）两个文件中。

**Tech Stack:** 纯 HTML + CSS + 原生 JavaScript + localStorage

**Design Spec:** `docs/superpowers/specs/2026-05-07-goc-project-list-member-management-design.md`

---

### Task 1: 重构 #panel-settings HTML 结构 — 添加四个子视图容器

**Files:**
- Modify: `site/app.html:160-384` (替换 `#panel-settings` 的内部 HTML)

- [ ] **Step 1: 替换 `#panel-settings` 的内部 HTML**

将 `#panel-settings` 内部（从 `<div class="settings-subtabs">` 到 `</div><!-- settings-step-init -->` 结束）替换为四个子视图。保留现有的项目配置表单代码，将其包裹在新建视图容器中。

在 `site/app.html` 中找到：

```html
<div id="panel-settings" class="panel" hidden>
```

将其整个内部内容替换为：

```html
<div id="panel-settings" class="panel" hidden>
  <!-- 视图1: 项目列表 -->
  <div id="settings-view-list" class="settings-view">
    <div class="project-list-header">
      <h1 class="project-list-title">我的项目</h1>
      <div class="project-list-header-right">
        <span class="project-quota" id="project-quota">0/5</span>
        <button type="button" class="btn-create-project" id="btn-create-project">+ 新建项目</button>
      </div>
    </div>
    <div class="project-cards-grid" id="project-cards-grid">
      <!-- JS 动态渲染 -->
    </div>
    <div class="project-list-empty" id="project-list-empty" hidden>
      <p>您还没有项目，点击上方按钮创建第一个项目</p>
    </div>
  </div>

  <!-- 视图2: 新建项目 -->
  <div id="settings-view-create" class="settings-view" hidden>
    <div class="settings-breadcrumb">
      <button type="button" class="btn-breadcrumb-back" id="btn-back-from-create">← 返回</button>
      <span class="breadcrumb-text">我的项目 &gt; 新建项目</span>
    </div>
    <div class="config-shell" id="settings-step-config">
      <div class="config-card">
        <h1 class="config-title">项目配置</h1>
        <form class="form-stack" action="#" method="get" id="project-config-form">
          <div class="form-group">
            <label for="cfg-project-name">项目名称<span class="req" aria-hidden="true">*</span></label>
            <p class="hint">通常以品牌-站点进行命名，例如 Apple</p>
            <input id="cfg-project-name" name="projectName" type="text" class="config-input" maxlength="256" placeholder="请填写品牌名称" autocomplete="organization" required>
          </div>
          <div class="form-group">
            <label for="cfg-region">项目区域</label>
            <p class="hint">品牌站点，例如 US</p>
            <input id="cfg-region" name="region" type="text" class="config-input" maxlength="256" placeholder="请填写该项目服务的站点，建议与后续接入的 BQ 数据一致，若无需区分站点则默认使用 all">
          </div>
          <div class="form-group">
            <label for="cfg-product-line">产品线</label>
            <p class="hint">当前项目集的产品名称，若不需要区分品线则默认为 all</p>
            <input id="cfg-product-line" name="productLine" type="text" class="config-input" maxlength="256" placeholder="请填写产品线名称，建议与后续接入的 BQ 数据一致，若无需区分站点则默认认为 all">
          </div>

          <section class="form-google-block" aria-labelledby="google-block-title">
            <div class="google-auth-panel" id="google-auth-panel">
              <h2 id="google-block-title" class="google-block-title">Google 数据源</h2>
              <p class="google-auth-intro">
                以下 GA4、GTM（账号与容器）、Google BigQuery 与 Google Ads 均依赖<strong>同一 Google 邮箱</strong>完成首次「一键授权」。授权后，各模块右侧的<strong>「重新授权」</strong>可单独针对 GA4、GTM 账号、GTM 容器、BigQuery 或 Ads 再次发起授权（原型示意）。下拉框<strong>不会自动选中</strong>，请逐项手动选择；GTM 与 BigQuery 可勾选「允许 GOC 代为创建」以跳过对应下拉。若自行在 GCP 配置 BigQuery，请参阅 BigQuery 卡片内<strong>手动授权说明</strong>链接。
              </p>
              <div class="google-auth-actions">
                <button type="button" class="btn-google-auth-once" id="btn-google-auth-once">使用 Google 账号一键授权</button>
              </div>
              <p class="google-auth-status" id="google-auth-status" role="status">尚未连接 Google 账号。</p>
            </div>

            <div class="google-resources" aria-label="各 Google 产品账号与资源">
              <div class="google-resource-card">
                <div class="form-group google-field-compact">
                  <div class="label-row">
                    <label for="cfg-ga4">GA4 账号<span class="req" aria-hidden="true">*</span></label>
                    <button type="button" class="link-reauth" id="reauth-ga4" aria-label="GA4 账号，单独重新授权 Google">重新授权</button>
                  </div>
                  <select id="cfg-ga4" name="ga4" class="config-select google-select google-sync-select" disabled aria-describedby="google-auth-status">
                    <option value="" disabled selected hidden>请先完成上方一键授权</option>
                    <option value="demo-ga4-1">GA4 · 示例账号 A</option>
                    <option value="demo-ga4-2">GA4 · 示例账号 B</option>
                  </select>
                </div>
              </div>

              <div id="google-gtm-section" class="google-resource-card google-gtm-section" role="group" aria-labelledby="google-gtm-card-title">
                <div class="label-row label-row-bq-header google-gtm-card-header">
                  <span id="google-gtm-card-title" class="google-subsection-title">Google Tag Manager</span>
                  <a class="link-bq-doc" href="https://developers.google.com/tag-platform/tag-manager/api/v2/devguide" target="_blank" rel="noopener noreferrer">授权说明</a>
                </div>
                <div class="form-group google-field-compact">
                  <div class="label-row">
                    <label for="cfg-gtm">GTM 账号 / Workspace<span class="req" id="gtm-account-req" aria-hidden="true" hidden>*</span></label>
                    <button type="button" class="link-reauth" id="reauth-gtm" aria-label="GTM 账号 / Workspace，单独重新授权 Google">重新授权</button>
                  </div>
                  <label class="google-delegate-check google-delegate-check--inline">
                    <input type="checkbox" id="cfg-gtm-delegate" name="gtmDelegateCreate" value="1" />
                    允许 GOC 代为创建
                  </label>
                  <select id="cfg-gtm" name="gtm" class="config-select google-select google-sync-select" disabled aria-describedby="google-auth-status">
                    <option value="" selected disabled hidden>请先完成上方一键授权</option>
                    <option value="__goc_delegate__">GOC 将代为创建（无需手动选择）</option>
                    <option value="gtm-1">GTM · workspace-示例</option>
                  </select>
                </div>
                <div class="google-field-sep" aria-hidden="true"></div>
                <div class="form-group google-field-compact">
                  <div class="label-row">
                    <label for="cfg-gtm-public">GTM 容器（PublicId）<span class="req" id="gtm-public-req" aria-hidden="true" hidden>*</span></label>
                    <button type="button" class="link-reauth" id="reauth-gtm-public" aria-label="GTM 容器（PublicId），单独重新授权 Google">重新授权</button>
                  </div>
                  <label class="google-delegate-check google-delegate-check--inline">
                    <input type="checkbox" id="cfg-gtm-public-delegate" name="gtmPublicDelegateCreate" value="1" />
                    允许 GOC 代为创建
                  </label>
                  <select id="cfg-gtm-public" name="gtmPublicId" class="config-select google-select google-sync-select" disabled aria-describedby="google-auth-status">
                    <option value="" selected disabled hidden>请先完成上方一键授权</option>
                    <option value="__goc_delegate__">GOC 将代为创建（无需手动选择）</option>
                    <option value="pub-1">GTM-XXXX · publicId-示例</option>
                  </select>
                </div>
              </div>

              <div class="google-resource-card google-bq-block">
                <div class="label-row label-row-bq-header">
                  <span class="google-subsection-title" id="google-bq-title">Google BigQuery</span>
                  <a class="link-bq-doc" href="https://cloud.google.com/bigquery/docs/access-control" target="_blank" rel="noopener noreferrer">手动授权说明</a>
                </div>
                <p class="hint google-bq-hint">
                  数据仓库与导出表。勾选代为创建并连接后无需选手动数据集；否则授权后在下方选择已有数据集，或先在 GCP 按文档完成手动授权。
                </p>
                <label class="google-delegate-check google-delegate-check--inline">
                  <input type="checkbox" id="cfg-bq-delegate" name="bqDelegateCreate" value="1" />
                  允许 GOC 代为创建并连接 BigQuery
                </label>
                <div class="form-group google-field-compact">
                  <div class="label-row">
                    <label for="cfg-bq-dataset">数据集<span class="req" id="bq-dataset-req" aria-hidden="true" hidden>*</span></label>
                    <button type="button" class="link-reauth" id="reauth-bq" aria-label="BigQuery 数据集，单独重新授权 Google">重新授权</button>
                  </div>
                  <select id="cfg-bq-dataset" name="bqDataset" class="config-select google-select google-sync-select" disabled aria-describedby="google-auth-status">
                    <option value="" selected disabled hidden>请先完成上方一键授权</option>
                    <option value="__goc_delegate__">GOC 将代为创建并连接（无需手动选择）</option>
                    <option value="bq-demo-1">BigQuery · 示例数据集 demo_project.goc_warehouse</option>
                  </select>
                </div>
              </div>

              <div class="google-resource-card">
                <div class="form-group google-field-compact">
                  <div class="label-row">
                    <label for="cfg-google-ads">Google Ads 账号</label>
                    <button type="button" class="link-reauth" id="reauth-google-ads" aria-label="Google Ads 账号，单独重新授权 Google">重新授权</button>
                  </div>
                  <select id="cfg-google-ads" name="googleAds" class="config-select google-select google-sync-select" disabled aria-describedby="google-auth-status">
                    <option value="" selected disabled hidden>请先完成上方一键授权</option>
                    <option value="ads-1">Google Ads · 示例 MCC</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
          <div class="form-actions">
            <button type="button" class="btn-config-confirm" id="btn-project-config-confirm">确定</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- 视图3: 查看配置（只读） -->
  <div id="settings-view-detail" class="settings-view" hidden>
    <div class="settings-breadcrumb">
      <button type="button" class="btn-breadcrumb-back" id="btn-back-from-detail">← 返回</button>
      <span class="breadcrumb-text" id="detail-breadcrumb">我的项目 &gt; 项目名称</span>
    </div>
    <div class="config-shell">
      <div class="config-card">
        <h1 class="config-title">项目配置详情</h1>
        <div class="detail-section">
          <h2 class="detail-section-title">基本信息</h2>
          <div class="detail-row">
            <span class="detail-label">项目名称</span>
            <span class="detail-value" id="detail-project-name">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">项目区域</span>
            <span class="detail-value" id="detail-region">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">产品线</span>
            <span class="detail-value" id="detail-product-line">—</span>
          </div>
        </div>
        <div class="detail-section">
          <h2 class="detail-section-title">Google 数据源</h2>
          <div class="detail-row">
            <span class="detail-label">Google 授权状态</span>
            <span class="detail-value" id="detail-google-status">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">GA4 账号</span>
            <span class="detail-value" id="detail-ga4">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">GTM 账号 / Workspace</span>
            <span class="detail-value" id="detail-gtm">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">GTM 容器（PublicId）</span>
            <span class="detail-value" id="detail-gtm-public">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">BigQuery 数据集</span>
            <span class="detail-value" id="detail-bq">—</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Google Ads 账号</span>
            <span class="detail-value" id="detail-ads">—</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 视图4: 成员管理 -->
  <div id="settings-view-members" class="settings-view" hidden>
    <div class="settings-breadcrumb">
      <button type="button" class="btn-breadcrumb-back" id="btn-back-from-members">← 返回</button>
      <span class="breadcrumb-text" id="members-breadcrumb">我的项目 &gt; 项目名称 &gt; 成员管理</span>
    </div>
    <div class="config-shell">
      <div class="config-card">
        <h1 class="config-title">成员管理</h1>
        <div class="member-add-row">
          <input type="email" class="config-input member-email-input" id="member-email-input" placeholder="输入邮箱地址" />
          <button type="button" class="btn-add-member" id="btn-add-member">添加</button>
        </div>
        <table class="member-table" id="member-table">
          <thead>
            <tr>
              <th>用户账号</th>
              <th>角色</th>
              <th>添加时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody id="member-table-body">
            <!-- JS 动态渲染 -->
          </tbody>
        </table>
        <p class="member-hint" id="member-hint" hidden>添加其他成员来协作管理此项目</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 验证 HTML 结构正确**

在浏览器中打开 `site/app.html`，点击侧边栏"设置"，应该能看到项目列表视图的骨架（此时样式还未添加，内容为空，但不应报 JS 错误）。

- [ ] **Step 3: Commit**

```bash
git add site/app.html
git commit -m "refactor: 重构 #panel-settings 为四视图容器结构"
```

---

### Task 2: 添加新视图的 CSS 样式

**Files:**
- Modify: `site/app.css` (在文件末尾追加新样式)

- [ ] **Step 1: 在 app.css 末尾追加项目列表和新视图的样式**

在 `site/app.css` 文件末尾（`.fab-mascot` 规则之后）追加：

```css
/* —— 设置页 · 四视图切换 —— */
.settings-view[hidden] {
  display: none !important;
}

.settings-breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.btn-breadcrumb-back {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  color: var(--text);
}

.btn-breadcrumb-back:hover {
  background: #f3f4f6;
}

.breadcrumb-text {
  font-size: 14px;
  color: var(--text-secondary);
}

/* —— 项目列表视图 —— */
.project-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.project-list-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.project-list-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-quota {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.btn-create-project {
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: var(--purple);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

.btn-create-project:hover {
  background: var(--purple-hover);
}

.btn-create-project:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.project-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
}

.project-card-name {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.project-card-meta {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 8px;
}

.project-card-status {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 16px;
}

.project-card-status.is-connected {
  background: #d1fae5;
  color: #065f46;
}

.project-card-status.is-disconnected {
  background: #fee2e2;
  color: #991b1b;
}

.project-card-actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--border);
  padding-top: 14px;
}

.btn-card-action {
  flex: 1;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  color: var(--text);
}

.btn-card-action:hover {
  background: #f3f4f6;
}

.btn-card-action.is-primary {
  border-color: var(--purple);
  color: var(--purple);
}

.btn-card-action.is-primary:hover {
  background: var(--purple-light);
}

.project-list-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  font-size: 15px;
}

/* —— 配置详情（只读） —— */
.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section-title {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.detail-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  flex: 0 0 180px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

/* —— 成员管理 —— */
.member-add-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.member-email-input {
  flex: 1;
  max-width: 360px;
}

.btn-add-member {
  height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: var(--purple);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

.btn-add-member:hover {
  background: var(--purple-hover);
}

.member-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.member-table th {
  text-align: left;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 2px solid var(--border);
  background: #f9fafb;
}

.member-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.member-role-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--purple-light);
  color: var(--purple);
}

.member-role-badge.is-member {
  background: #f3f4f6;
  color: var(--text-secondary);
}

.btn-remove-member {
  border: 1px solid #fca5a5;
  border-radius: 6px;
  background: #fff;
  color: #dc2626;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  padding: 4px 12px;
  cursor: pointer;
}

.btn-remove-member:hover {
  background: #fef2f2;
}

.btn-remove-member:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.member-hint {
  text-align: center;
  padding: 16px;
  color: var(--text-secondary);
  font-size: 13px;
}
```

- [ ] **Step 2: 在浏览器中验证样式生效**

打开 `site/app.html`，点击"设置"，应看到项目列表标题栏、"新建项目"按钮有正确的样式。

- [ ] **Step 3: Commit**

```bash
git add site/app.css
git commit -m "style: 添加项目列表、配置详情、成员管理视图样式"
```

---

### Task 3: 重写内联 JS — 视图切换与项目列表渲染

**Files:**
- Modify: `site/app.html:389-807` (替换 `<script>` 标签内的全部 JS)

- [ ] **Step 1: 替换 `<script>` 标签内的全部 JavaScript**

将 `site/app.html` 中 `<script>` 到 `</script>` 之间的所有内容替换为：

```javascript
(function () {
  var STORAGE_KEY = 'goc01_dashboard_projects_demo';
  var MAX_PROJECTS = 5;
  var GOC_DELEGATE_VALUE = '__goc_delegate__';
  var DEMO_CREATOR_EMAIL = 'admin@goc01.com';

  var BUILTIN_PROJECTS = [
    { id: 'builtin-demo', label: 'GOC Demo Dashboard' },
    { id: 'builtin-na', label: '北美站 · 品牌 A' },
    { id: 'builtin-eu', label: '欧洲站 · 品牌 B' }
  ];

  // DOM refs
  var dash = document.getElementById('panel-dashboard');
  var sett = document.getElementById('panel-settings');
  var navLinks = document.querySelectorAll('.sidebar-nav a[data-panel]');
  var projectListSelect = document.getElementById('project-list');

  // 视图容器
  var viewList = document.getElementById('settings-view-list');
  var viewCreate = document.getElementById('settings-view-create');
  var viewDetail = document.getElementById('settings-view-detail');
  var viewMembers = document.getElementById('settings-view-members');
  var allViews = [viewList, viewCreate, viewDetail, viewMembers];

  // 项目列表视图元素
  var projectCardsGrid = document.getElementById('project-cards-grid');
  var projectListEmpty = document.getElementById('project-list-empty');
  var projectQuota = document.getElementById('project-quota');
  var btnCreateProject = document.getElementById('btn-create-project');

  // 新建项目视图元素
  var cfgForm = document.getElementById('project-config-form');
  var btnConfirm = document.getElementById('btn-project-config-confirm');
  var btnBackFromCreate = document.getElementById('btn-back-from-create');

  // 配置详情视图元素
  var btnBackFromDetail = document.getElementById('btn-back-from-detail');

  // 成员管理视图元素
  var btnBackFromMembers = document.getElementById('btn-back-from-members');
  var memberEmailInput = document.getElementById('member-email-input');
  var btnAddMember = document.getElementById('btn-add-member');
  var memberTableBody = document.getElementById('member-table-body');
  var memberHint = document.getElementById('member-hint');

  // Google 授权相关
  var googleAuthPanel = document.getElementById('google-auth-panel');
  var googleAuthBtn = document.getElementById('btn-google-auth-once');
  var googleAuthStatus = document.getElementById('google-auth-status');
  var googleSelects = document.querySelectorAll('select.google-sync-select');

  // 当前操作的项目 ID（查看详情/成员管理时用）
  var currentViewProjectId = null;

  // --- State ---
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { userProjects: [], selectedId: BUILTIN_PROJECTS[0].id };
    } catch (e) {
      return { userProjects: [], selectedId: BUILTIN_PROJECTS[0].id };
    }
  }

  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function allProjects(state) {
    return BUILTIN_PROJECTS.concat(state.userProjects || []);
  }

  function findProject(state, id) {
    var list = allProjects(state);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function findUserProject(state, id) {
    var list = state.userProjects || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  var appState = loadState();

  // --- 顶栏项目下拉 ---
  function renderProjectSelect(state) {
    if (!projectListSelect) return;
    var current = state.selectedId;
    projectListSelect.innerHTML = '';
    allProjects(state).forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.label;
      projectListSelect.appendChild(opt);
    });
    if (findProject(state, current)) {
      projectListSelect.value = current;
    } else {
      projectListSelect.value = BUILTIN_PROJECTS[0].id;
      state.selectedId = BUILTIN_PROJECTS[0].id;
      saveState(state);
    }
  }

  if (projectListSelect) {
    projectListSelect.addEventListener('change', function () {
      appState.selectedId = projectListSelect.value;
      saveState(appState);
    });
  }

  renderProjectSelect(appState);

  // --- 面板切换（侧边栏） ---
  function setView(panel) {
    var isSettings = panel === 'settings';
    if (dash) dash.hidden = isSettings;
    if (sett) sett.hidden = !isSettings;
    navLinks.forEach(function (a) {
      var match = a.getAttribute('data-panel') === panel;
      a.classList.toggle('is-active', match);
    });
    if (isSettings) showSettingsView('list');
  }

  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      setView(a.getAttribute('data-panel') || 'dashboard');
    });
  });

  // --- 设置页内四视图切换 ---
  function showSettingsView(viewName) {
    allViews.forEach(function (v) { if (v) v.hidden = true; });
    switch (viewName) {
      case 'list': if (viewList) viewList.hidden = false; renderProjectCards(); break;
      case 'create': if (viewCreate) viewCreate.hidden = false; resetCreateForm(); break;
      case 'detail': if (viewDetail) viewDetail.hidden = false; break;
      case 'members': if (viewMembers) viewMembers.hidden = false; break;
    }
  }

  // --- 项目列表渲染 ---
  function renderProjectCards() {
    if (!projectCardsGrid) return;
    var projects = appState.userProjects || [];
    projectCardsGrid.innerHTML = '';

    if (projects.length === 0) {
      if (projectListEmpty) projectListEmpty.hidden = false;
    } else {
      if (projectListEmpty) projectListEmpty.hidden = true;
      projects.forEach(function (p) {
        var card = document.createElement('div');
        card.className = 'project-card';
        var cfg = p.config || {};
        var connected = !!cfg.googleConnected;
        card.innerHTML =
          '<h3 class="project-card-name">' + escapeHtml(cfg.projectName || '未命名项目') + '</h3>' +
          '<p class="project-card-meta">' + escapeHtml((cfg.region || '—') + ' · ' + (cfg.productLine || '—')) + '</p>' +
          '<span class="project-card-status ' + (connected ? 'is-connected' : 'is-disconnected') + '">' +
            (connected ? 'Google 已连接' : 'Google 未连接') +
          '</span>' +
          '<div class="project-card-actions">' +
            '<button type="button" class="btn-card-action" data-action="detail" data-id="' + p.id + '">查看配置</button>' +
            '<button type="button" class="btn-card-action is-primary" data-action="members" data-id="' + p.id + '">成员管理</button>' +
          '</div>';
        projectCardsGrid.appendChild(card);
      });
    }

    // 更新额度
    if (projectQuota) projectQuota.textContent = projects.length + '/' + MAX_PROJECTS;
    if (btnCreateProject) {
      btnCreateProject.disabled = projects.length >= MAX_PROJECTS;
      btnCreateProject.title = projects.length >= MAX_PROJECTS ? '已达到项目数量上限（' + MAX_PROJECTS + '/' + MAX_PROJECTS + '）' : '';
    }
  }

  // 卡片按钮事件委托
  if (projectCardsGrid) {
    projectCardsGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      var id = btn.getAttribute('data-id');
      currentViewProjectId = id;
      if (action === 'detail') openDetailView(id);
      else if (action === 'members') openMembersView(id);
    });
  }

  // --- 新建项目 ---
  if (btnCreateProject) {
    btnCreateProject.addEventListener('click', function () {
      if ((appState.userProjects || []).length >= MAX_PROJECTS) return;
      showSettingsView('create');
    });
  }

  function resetCreateForm() {
    if (!cfgForm) return;
    cfgForm.reset();
    setGoogleConnected(false);
  }

  if (btnBackFromCreate) {
    btnBackFromCreate.addEventListener('click', function () {
      showSettingsView('list');
    });
  }

  // 确认创建项目
  function saveNewProjectFromForm() {
    if (!cfgForm) return;
    if ((appState.userProjects || []).length >= MAX_PROJECTS) return;

    // 校验 GA4
    var ga4El = document.getElementById('cfg-ga4');
    if (googleAuthPanel && googleAuthPanel.classList.contains('is-connected')) {
      if (ga4El && !ga4El.value) {
        ga4El.setCustomValidity('请选择 GA4 账号');
        ga4El.reportValidity();
        ga4El.setCustomValidity('');
        return;
      }
    }
    if (!cfgForm.reportValidity()) return;

    var cfg = readFullConfigFromForm();
    var id = 'user-' + Date.now();
    var region = cfg.region.trim() || '未命名区域';
    var pname = cfg.projectName.trim() || '未命名项目';
    var label = region + ' · ' + pname;
    var today = new Date().toISOString().slice(0, 10);
    var proj = {
      id: id,
      label: label,
      config: cfg,
      members: [
        { email: DEMO_CREATOR_EMAIL, role: 'creator', addedAt: today }
      ]
    };

    if (!appState.userProjects) appState.userProjects = [];
    appState.userProjects.push(proj);
    appState.selectedId = id;
    saveState(appState);
    renderProjectSelect(appState);
    if (projectListSelect) projectListSelect.value = id;
    showSettingsView('list');
  }

  if (btnConfirm) {
    btnConfirm.addEventListener('click', saveNewProjectFromForm);
  }
  if (cfgForm) {
    cfgForm.addEventListener('submit', function (e) {
      e.preventDefault();
      saveNewProjectFromForm();
    });
  }

  // --- 查看配置详情（只读） ---
  function openDetailView(projectId) {
    var proj = findUserProject(appState, projectId);
    if (!proj) return;
    var cfg = proj.config || {};
    var breadcrumb = document.getElementById('detail-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = '我的项目 > ' + (cfg.projectName || '未命名');

    setText('detail-project-name', cfg.projectName || '—');
    setText('detail-region', cfg.region || '—');
    setText('detail-product-line', cfg.productLine || '—');
    setText('detail-google-status', cfg.googleConnected ? '已连接' : '未连接');
    setText('detail-ga4', formatSelectValue(cfg.ga4));
    setText('detail-gtm', formatSelectValue(cfg.gtm));
    setText('detail-gtm-public', formatSelectValue(cfg.gtmPublicId));
    setText('detail-bq', formatSelectValue(cfg.bqDataset));
    setText('detail-ads', formatSelectValue(cfg.googleAds));

    showSettingsView('detail');
  }

  function formatSelectValue(val) {
    if (!val) return '—';
    if (val === GOC_DELEGATE_VALUE) return 'GOC 代为创建';
    return val;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  if (btnBackFromDetail) {
    btnBackFromDetail.addEventListener('click', function () {
      showSettingsView('list');
    });
  }

  // --- 成员管理 ---
  function openMembersView(projectId) {
    currentViewProjectId = projectId;
    var proj = findUserProject(appState, projectId);
    if (!proj) return;
    var cfg = proj.config || {};
    var breadcrumb = document.getElementById('members-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = '我的项目 > ' + (cfg.projectName || '未命名') + ' > 成员管理';
    renderMemberTable(proj);
    showSettingsView('members');
  }

  function renderMemberTable(proj) {
    if (!memberTableBody) return;
    var members = proj.members || [];
    memberTableBody.innerHTML = '';
    members.forEach(function (m) {
      var tr = document.createElement('tr');
      var isCreator = m.role === 'creator';
      tr.innerHTML =
        '<td>' + escapeHtml(m.email) + '</td>' +
        '<td><span class="member-role-badge ' + (isCreator ? '' : 'is-member') + '">' + (isCreator ? '创建者' : '成员') + '</span></td>' +
        '<td>' + escapeHtml(m.addedAt || '—') + '</td>' +
        '<td>' +
          '<button type="button" class="btn-remove-member" data-email="' + escapeHtml(m.email) + '"' +
            (isCreator ? ' disabled title="创建者不可移除"' : '') +
          '>' + (isCreator ? '—' : '移除') + '</button>' +
        '</td>';
      memberTableBody.appendChild(tr);
    });
    if (memberHint) memberHint.hidden = members.length > 1;
    if (memberEmailInput) memberEmailInput.value = '';
  }

  if (btnAddMember) {
    btnAddMember.addEventListener('click', function () {
      addMember();
    });
  }
  if (memberEmailInput) {
    memberEmailInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); addMember(); }
    });
  }

  function addMember() {
    if (!memberEmailInput) return;
    var email = memberEmailInput.value.trim();
    if (!email) return;

    var proj = findUserProject(appState, currentViewProjectId);
    if (!proj) return;
    if (!proj.members) proj.members = [];

    for (var i = 0; i < proj.members.length; i++) {
      if (proj.members[i].email === email) {
        alert('该成员已存在');
        return;
      }
    }

    var today = new Date().toISOString().slice(0, 10);
    proj.members.push({ email: email, role: 'member', addedAt: today });
    saveState(appState);
    renderMemberTable(proj);
  }

  if (memberTableBody) {
    memberTableBody.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-remove-member');
      if (!btn || btn.disabled) return;
      var email = btn.getAttribute('data-email');
      if (!confirm('确定要移除成员 ' + email + ' 吗？')) return;

      var proj = findUserProject(appState, currentViewProjectId);
      if (!proj || !proj.members) return;
      proj.members = proj.members.filter(function (m) { return m.email !== email; });
      saveState(appState);
      renderMemberTable(proj);
    });
  }

  if (btnBackFromMembers) {
    btnBackFromMembers.addEventListener('click', function () {
      showSettingsView('list');
    });
  }

  // --- Google 授权逻辑（复用现有逻辑） ---
  var PLACEHOLDER_OPEN = {
    'cfg-ga4': '请选择 GA4 账号（归因与指标）…',
    'cfg-google-ads': '请选择 Google Ads 账号…',
    'cfg-bq-dataset': '请选择数据集，或勾选上方「代为创建」…',
    'cfg-gtm': '请选择 GTM 账号 / Workspace…',
    'cfg-gtm-public': '请选择 GTM 容器（PublicId）…'
  };
  var PLACEHOLDER_LOCKED = '请先完成上方一键授权';

  function syncGoogleDelegateFields() {
    var connected = googleAuthPanel && googleAuthPanel.classList.contains('is-connected');
    function applyPair(cbId, selId, reqId) {
      var cb = document.getElementById(cbId);
      var sel = document.getElementById(selId);
      var reqEl = reqId ? document.getElementById(reqId) : null;
      if (!cb || !sel) return;
      if (!connected) { if (reqEl) reqEl.setAttribute('hidden', ''); return; }
      if (cb.checked) {
        if (sel.querySelector('option[value="' + GOC_DELEGATE_VALUE + '"]')) sel.value = GOC_DELEGATE_VALUE;
        sel.disabled = true;
        if (reqEl) reqEl.setAttribute('hidden', '');
      } else {
        sel.disabled = false;
        if (sel.value === GOC_DELEGATE_VALUE) sel.selectedIndex = 0;
        if (reqEl) reqEl.removeAttribute('hidden');
      }
    }
    applyPair('cfg-gtm-delegate', 'cfg-gtm', 'gtm-account-req');
    applyPair('cfg-gtm-public-delegate', 'cfg-gtm-public', 'gtm-public-req');
    applyPair('cfg-bq-delegate', 'cfg-bq-dataset', 'bq-dataset-req');
  }

  ;['cfg-gtm-delegate', 'cfg-gtm-public-delegate', 'cfg-bq-delegate'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', syncGoogleDelegateFields);
  });

  function setGoogleConnected(connected) {
    googleSelects.forEach(function (sel) {
      sel.disabled = !connected;
      sel.classList.toggle('is-locked', !connected);
      var optEmpty = sel.querySelector('option[value=""]');
      if (optEmpty) optEmpty.textContent = connected ? (PLACEHOLDER_OPEN[sel.id] || '') : PLACEHOLDER_LOCKED;
      sel.selectedIndex = 0;
    });
    if (googleAuthStatus) {
      googleAuthStatus.textContent = connected
        ? '已连接（原型）：demo.user@gmail.com · 请在下拉框中逐项选择账号（不会自动选中）。'
        : '尚未连接 Google 账号。';
    }
    if (googleAuthPanel) googleAuthPanel.classList.toggle('is-connected', connected);
    syncGoogleDelegateFields();
  }

  if (googleAuthBtn) {
    googleAuthBtn.addEventListener('click', function () {
      if (googleAuthPanel && googleAuthPanel.classList.contains('is-connected')) {
        if (googleAuthStatus) googleAuthStatus.textContent = '已模拟重新完成 Google 全局授权（原型）。';
        return;
      }
      setGoogleConnected(true);
    });
  }

  [['reauth-ga4','GA4'],['reauth-google-ads','Google Ads'],['reauth-bq','BigQuery'],['reauth-gtm','GTM 账号'],['reauth-gtm-public','GTM 容器']].forEach(function(pair){
    var b = document.getElementById(pair[0]);
    if (!b) return;
    b.addEventListener('click', function(){
      if (googleAuthStatus) {
        googleAuthStatus.textContent = googleAuthPanel && googleAuthPanel.classList.contains('is-connected')
          ? '已模拟对「' + pair[1] + '」重新授权（原型）。'
          : '请先点击上方「使用 Google 账号一键授权」。';
      }
    });
  });

  function readFullConfigFromForm() {
    var cbGtm = document.getElementById('cfg-gtm-delegate');
    var cbPub = document.getElementById('cfg-gtm-public-delegate');
    var cbBq = document.getElementById('cfg-bq-delegate');
    return {
      projectName: (document.getElementById('cfg-project-name') || {}).value || '',
      region: (document.getElementById('cfg-region') || {}).value || '',
      productLine: (document.getElementById('cfg-product-line') || {}).value || '',
      googleConnected: !!(googleAuthPanel && googleAuthPanel.classList.contains('is-connected')),
      ga4: (document.getElementById('cfg-ga4') || {}).value || '',
      googleAds: (document.getElementById('cfg-google-ads') || {}).value || '',
      bqDataset: (document.getElementById('cfg-bq-dataset') || {}).value || '',
      gtm: (document.getElementById('cfg-gtm') || {}).value || '',
      gtmPublicId: (document.getElementById('cfg-gtm-public') || {}).value || '',
      gtmDelegateCreate: !!(cbGtm && cbGtm.checked),
      gtmPublicDelegateCreate: !!(cbPub && cbPub.checked),
      bqDelegateCreate: !!(cbBq && cbBq.checked)
    };
  }

  // --- 工具函数 ---
  function escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }
})();
```

- [ ] **Step 2: 在浏览器中完整测试所有流程**

1. 打开 `site/app.html`，点击侧边栏"设置" → 应看到空的项目列表 + "新建项目"按钮 + "0/5"
2. 点击"新建项目" → 进入项目配置表单
3. 填写项目名、区域、产品线，点击"确定" → 回到列表，看到新项目卡片
4. 点击卡片上"查看配置" → 看到只读配置信息
5. 点击"返回" → 回到列表
6. 点击"成员管理" → 看到创建者在列表中
7. 输入邮箱点击"添加" → 新成员出现在列表
8. 点击"移除" → 确认后成员被删除
9. 创建 5 个项目后 → "新建项目"按钮变灰

- [ ] **Step 3: Commit**

```bash
git add site/app.html
git commit -m "feat: 实现项目列表、查看配置、成员管理四视图切换"
```

---

### Task 4: 移除页面刷新时清空 localStorage 的逻辑

**Files:**
- Modify: `site/app.html` (内联 JS 中)

当前代码在页面刷新时会清空 localStorage 并跳转回首页，这在原型演示时方便重置，但现在有了多项目管理，刷新不应丢失数据。

- [ ] **Step 1: 确认新 JS 中已不包含刷新重定向逻辑**

在 Task 3 的替换中，旧的 `performance.getEntriesByType('navigation')` 检测和 `localStorage.removeItem` + `location.replace('index.html')` 逻辑已经被移除。验证 `site/app.html` 的 `<script>` 中不再包含这些代码。

Expected: 搜索 `performance.getEntriesByType` 和 `location.replace('index.html')` 应无结果。

- [ ] **Step 2: 在浏览器中测试**

创建一个项目，刷新页面，重新进入设置页 → 项目应仍然存在。

- [ ] **Step 3: Commit（如有改动）**

如果 Task 3 中已经完成了这个改动（新 JS 不含刷新逻辑），则不需要额外 commit。否则：

```bash
git add site/app.html
git commit -m "fix: 移除刷新时清空 localStorage 的演示逻辑"
```
