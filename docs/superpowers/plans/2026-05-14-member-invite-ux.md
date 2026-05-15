# 成员邀请 UX 闭环 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为成员管理页实现完整的邀请状态机（待加入 → 接受 → 已加入），并用内联反馈替换所有 `alert()`。

**Architecture:** 纯前端 localStorage Demo。新增 `status: 'pending' | 'active'` 字段到 `members[]` 数据结构；`renderMemberTable()` 按状态渲染不同 badge 和操作按钮；`addMember()` 写入 pending 状态并触发内联 toast；新增 `acceptInvite()` 函数将 pending 改为 active。

**Tech Stack:** 原生 HTML / CSS / Vanilla JS，localStorage，无构建工具。

---

## 文件修改范围

- **修改：** `app.html`
  - HTML（约 641-652 行）：在邮箱输入行下方增加 toast 占位 DOM
  - CSS（文件末尾 `<style>` 块）：新增 `.role-pending` badge、`.invite-toast`、新操作按钮样式
  - JS `renderMemberTable()`（约 1537-1585 行）：按 `status` 字段渲染
  - JS `addMember()`（约 1587-1609 行）：写 `status:'pending'`，触发 toast
  - JS 新增 `acceptInvite(email)`：状态改为 active
  - JS 复制邀请链接按钮回调（约 1683-1704 行）：改为按钮文字切换
- **修改：** `register.html`（约 323-327 行，382 行）：注册写入成员时加 `status:'active'`

---

## Task 1：HTML —— 添加 toast 占位 DOM

**Files:**
- Modify: `app.html:641-644`

- [ ] **Step 1: 在邮箱输入行（`member-add-row-wrap`）后面紧接插入 toast 占位**

找到：
```html
                <div class="member-add-row" id="member-add-row-wrap">
                  <input type="email" class="config-input member-email-input" id="member-email-input" placeholder="输入邮箱地址" />
                  <button type="button" class="btn-add-member" id="btn-add-member">添加</button>
                </div>
```
替换为：
```html
                <div class="member-add-row" id="member-add-row-wrap">
                  <input type="email" class="config-input member-email-input" id="member-email-input" placeholder="输入邮箱地址" />
                  <button type="button" class="btn-add-member" id="btn-add-member">添加</button>
                </div>
                <p class="invite-toast" id="invite-toast" hidden></p>
```

- [ ] **Step 2: 目视确认 HTML 结构正确，保存文件**

---

## Task 2：CSS —— 新增 pending badge、toast、操作按钮样式

**Files:**
- Modify: `app.html`（在现有 `<style>` 块中找到 `.member-role-badge` 附近，追加新规则）

- [ ] **Step 1: 搜索现有的 `.member-role-badge` CSS 规则**

在 `app.html` 中搜索 `.role-admin` 找到 badge 样式块所在位置。

- [ ] **Step 2: 在该块后面追加以下 CSS**

```css
/* ---- pending badge ---- */
.role-pending {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

/* ---- invite toast ---- */
.invite-toast {
  margin: 4px 0 8px;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: opacity 0.3s;
}
.invite-toast.toast-success {
  background: #d1fae5;
  color: #065f46;
}
.invite-toast.toast-error {
  background: #fee2e2;
  color: #991b1b;
}

/* ---- pending action buttons ---- */
.btn-simulate-accept {
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 3px 10px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 4px;
}
.btn-simulate-accept:hover { background: #6d28d9; }
.btn-revoke-invite {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 5px;
  padding: 3px 10px;
  font-size: 12px;
  cursor: pointer;
}
.btn-revoke-invite:hover { background: #fee2e2; }
```

- [ ] **Step 3: 保存，在浏览器开发者工具确认样式无报错**

---

## Task 3：JS —— 更新 `renderMemberTable()` 支持 pending 状态

**Files:**
- Modify: `app.html:1537-1585`

- [ ] **Step 1: 找到 `renderMemberTable` 函数，定位 badge 渲染逻辑**

当前逻辑（约 1552-1576 行）：
```js
members.forEach(function (m, i) {
  var isAdmin = m.role === 'admin';
  var isCreatorPerson = normalizeEmail(m.email) === creatorEm;
  var badgeClass = isAdmin ? 'member-role-badge role-admin' : 'member-role-badge role-member-plain';
  var label = isAdmin ? '管理员' : '普通成员';
  if (isCreatorPerson) {
    label = isAdmin ? '管理员（项目负责人）' : '普通成员（项目负责人）';
  }
  var ops = '—';
  if (isAdmin) {
    ops = normalizeEmail(m.email) === sess ? '<span class="member-op-muted">当前帐号</span>' : '—';
  } else if (getProjectRole(proj, sess) === 'admin') {
    ops =
      '<button type="button" class="btn-transfer-admin" data-email="' +
      escapeHtml(m.email) +
      '">设为管理员</button>' +
      '<button type="button" class="btn-remove-member" data-email="' +
      escapeHtml(m.email) +
      '">移除</button>';
  }
  html += '<tr>'
    + '<td>' + escapeHtml(m.email) + '</td>'
    + '<td><span class="' + badgeClass + '">' + escapeHtml(label) + '</span></td>'
    + '<td>' + escapeHtml(m.addedAt || '—') + '</td>'
    + '<td>' + ops + '</td>'
    + '</tr>';
});
```

- [ ] **Step 2: 将上述代码块替换为以下新版本**

```js
members.forEach(function (m, i) {
  var isPending = m.status === 'pending';
  var isAdmin = m.role === 'admin';
  var isCreatorPerson = normalizeEmail(m.email) === creatorEm;
  var isCurrentUser = normalizeEmail(m.email) === sess;
  var badgeClass, label, ops;

  if (isPending) {
    badgeClass = 'member-role-badge role-pending';
    label = '待加入';
    ops = getProjectRole(proj, sess) === 'admin'
      ? '<button type="button" class="btn-simulate-accept" data-email="' + escapeHtml(m.email) + '">模拟接受邀请</button>'
        + '<button type="button" class="btn-revoke-invite" data-email="' + escapeHtml(m.email) + '">撤销邀请</button>'
      : '—';
  } else if (isAdmin) {
    badgeClass = 'member-role-badge role-admin';
    label = isCreatorPerson ? '管理员（项目负责人）' : '管理员';
    ops = isCurrentUser ? '<span class="member-op-muted">当前帐号</span>' : '—';
  } else {
    badgeClass = 'member-role-badge role-member-plain';
    label = isCreatorPerson ? '普通成员（项目负责人）' : '普通成员';
    ops = getProjectRole(proj, sess) === 'admin'
      ? '<button type="button" class="btn-transfer-admin" data-email="' + escapeHtml(m.email) + '">设为管理员</button>'
        + '<button type="button" class="btn-remove-member" data-email="' + escapeHtml(m.email) + '">移除</button>'
      : '—';
  }

  html += '<tr>'
    + '<td>' + escapeHtml(m.email) + '</td>'
    + '<td><span class="' + badgeClass + '">' + escapeHtml(label) + '</span></td>'
    + '<td>' + escapeHtml(m.addedAt || '—') + '</td>'
    + '<td>' + ops + '</td>'
    + '</tr>';
});
```

- [ ] **Step 3: 在事件绑定区（`memberTableBody.querySelectorAll` 之后）追加 pending 按钮事件**

找到（约 1579-1584 行）：
```js
        memberTableBody.querySelectorAll('.btn-remove-member').forEach(function (b) {
          b.addEventListener('click', function () { removeMember(b.getAttribute('data-email')); });
        });
        memberTableBody.querySelectorAll('.btn-transfer-admin').forEach(function (b) {
          b.addEventListener('click', function () { transferAdminTo(b.getAttribute('data-email')); });
        });
```
替换为：
```js
        memberTableBody.querySelectorAll('.btn-remove-member').forEach(function (b) {
          b.addEventListener('click', function () { removeMember(b.getAttribute('data-email')); });
        });
        memberTableBody.querySelectorAll('.btn-transfer-admin').forEach(function (b) {
          b.addEventListener('click', function () { transferAdminTo(b.getAttribute('data-email')); });
        });
        memberTableBody.querySelectorAll('.btn-simulate-accept').forEach(function (b) {
          b.addEventListener('click', function () { acceptInvite(b.getAttribute('data-email')); });
        });
        memberTableBody.querySelectorAll('.btn-revoke-invite').forEach(function (b) {
          b.addEventListener('click', function () { removeMember(b.getAttribute('data-email')); });
        });
```

- [ ] **Step 4: 打开浏览器，进入成员管理页，确认现有 active 成员显示正常（badge、操作按钮无变化）**

---

## Task 4：JS —— 新增 `acceptInvite()` 函数

**Files:**
- Modify: `app.html`（在 `removeMember` 函数定义之后，约 1637 行后插入）

- [ ] **Step 1: 在 `removeMember` 函数结束后紧接插入以下函数**

找到 `removeMember` 函数末尾 `}` 后（约 1637 行），插入：

```js
      function acceptInvite(targetEmailRaw) {
        if (currentMemberProjectId == null) return;
        var targetEmail = normalizeEmail(targetEmailRaw);
        var d = loadData();
        var p = null;
        d.projects.forEach(function (x) { if (x.id === currentMemberProjectId) p = x; });
        if (!p || !p.members) return;
        if (getProjectRole(p, normalizeEmail(getSession().email)) !== 'admin') {
          return;
        }
        p.members.forEach(function (m) {
          if (normalizeEmail(m.email) === targetEmail) m.status = 'active';
        });
        saveData(d);
        renderMemberTable(p);
      }
```

- [ ] **Step 2: 保存，在浏览器控制台执行 `typeof acceptInvite` 确认函数已定义，输出应为 `"function"`**

---

## Task 5：JS —— 更新 `addMember()` 写入 pending 状态并显示 toast

**Files:**
- Modify: `app.html:1587-1609`

- [ ] **Step 1: 在 JS 变量声明区（约 1074-1082 行）补充 toast DOM 引用**

找到：
```js
      var memberInviteBlock = document.getElementById('member-invite-block');
```
在其后插入：
```js
      var inviteToast      = document.getElementById('invite-toast');
```

- [ ] **Step 2: 在 `addMember` 函数之前，插入 toast 辅助函数**

找到 `function addMember()` 声明（约 1587 行），在其前一行插入：

```js
      function showInviteToast(msg, type) {
        if (!inviteToast) return;
        inviteToast.textContent = msg;
        inviteToast.className = 'invite-toast toast-' + type;
        inviteToast.hidden = false;
        if (type === 'success') {
          clearTimeout(inviteToast._timer);
          inviteToast._timer = setTimeout(function () {
            inviteToast.hidden = true;
          }, 2000);
        }
      }
```

- [ ] **Step 3: 替换 `addMember()` 函数体**

找到整个 `addMember` 函数（约 1587-1609 行）：
```js
      function addMember() {
        if (!memberInput || !currentMemberProjectId) return;
        var email = normalizeEmail(memberInput.value);
        if (!email) { alert('请输入邮箱地址'); return; }
        var d = loadData();
        var p = null;
        d.projects.forEach(function (x) { if (x.id === currentMemberProjectId) p = x; });
        if (!p) return;
        if (getProjectRole(p, normalizeEmail(getSession().email)) !== 'admin') {
          alert('仅管理员可添加成员。');
          return;
        }
        if (!p.members) p.members = [];
        var exists = false;
        p.members.forEach(function (m) { if (normalizeEmail(m.email) === email) exists = true; });
        if (exists) { alert('该成员已存在'); return; }
        var now = new Date();
        var ts = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        p.members.push({ email: email, role: 'member', addedAt: ts });
        saveData(d);
        memberInput.value = '';
        renderMemberTable(p);
      }
```
替换为：
```js
      function addMember() {
        if (!memberInput || !currentMemberProjectId) return;
        var email = normalizeEmail(memberInput.value);
        if (!email) {
          showInviteToast('请输入邮箱地址', 'error');
          return;
        }
        var d = loadData();
        var p = null;
        d.projects.forEach(function (x) { if (x.id === currentMemberProjectId) p = x; });
        if (!p) return;
        if (getProjectRole(p, normalizeEmail(getSession().email)) !== 'admin') return;
        if (!p.members) p.members = [];
        var exists = p.members.some(function (m) { return normalizeEmail(m.email) === email; });
        if (exists) {
          showInviteToast('该成员已存在', 'error');
          return;
        }
        var now = new Date();
        var ts = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        p.members.push({ email: email, role: 'member', status: 'pending', addedAt: ts });
        saveData(d);
        memberInput.value = '';
        if (inviteToast) inviteToast.hidden = true;
        renderMemberTable(p);
        showInviteToast('已发送邀请：' + email, 'success');
      }
```

- [ ] **Step 4: 验证**

打开浏览器进入成员管理页：
1. 输入一个新邮箱（如 `test@demo.com`），点「添加」
2. 预期：成员表出现新行，badge 显示黄色「待加入」，操作列显示「模拟接受邀请」「撤销邀请」
3. 预期：输入框下方显示绿色提示「已发送邀请：test@demo.com」，约 2 秒后消失
4. 点「模拟接受邀请」→ 预期：badge 变为灰色「普通成员」，操作列变为「设为管理员」「移除」
5. 再添加一个邮箱，点「撤销邀请」→ 预期：该行直接消失

---

## Task 6：JS —— 复制邀请链接改为按钮文字切换

**Files:**
- Modify: `app.html:1683-1704`

- [ ] **Step 1: 找到复制邀请链接按钮回调，替换整个回调函数**

找到（约 1683-1704 行）：
```js
      if (btnCopyInvite && memberInviteUrl) {
        btnCopyInvite.addEventListener('click', function () {
          var v = memberInviteUrl.value || '';
          if (!v) return;
          var done = function () { alert('邀请链接已复制，可粘贴给新同事。'); };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(v).then(done).catch(function () {
              memberInviteUrl.select();
              try {
                document.execCommand('copy');
                done();
              } catch (err) {}
            });
          } else {
            memberInviteUrl.select();
            try {
              document.execCommand('copy');
              done();
            } catch (err) {}
          }
        });
      }
```
替换为：
```js
      if (btnCopyInvite && memberInviteUrl) {
        btnCopyInvite.addEventListener('click', function () {
          var v = memberInviteUrl.value || '';
          if (!v) return;
          var done = function () {
            var original = '复制链接';
            btnCopyInvite.textContent = '已复制 ✓';
            btnCopyInvite.disabled = true;
            setTimeout(function () {
              btnCopyInvite.textContent = original;
              btnCopyInvite.disabled = false;
            }, 2000);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(v).then(done).catch(function () {
              memberInviteUrl.select();
              try { document.execCommand('copy'); done(); } catch (err) {}
            });
          } else {
            memberInviteUrl.select();
            try { document.execCommand('copy'); done(); } catch (err) {}
          }
        });
      }
```

- [ ] **Step 2: 验证**

点击「复制链接」按钮：
- 预期：按钮文字立即变为「已复制 ✓」且变灰（disabled）
- 预期：约 2 秒后恢复「复制链接」，可再次点击
- 无任何 alert 弹窗出现

---

## Task 7：register.html —— 注册写入成员时加 `status: 'active'`

**Files:**
- Modify: `register.html:323-327`（邮箱注册成功写入成员）
- Modify: `register.html:382`（Google 登录注册写入成员）

- [ ] **Step 1: 修改邮箱注册成员写入（约 323-327 行）**

找到：
```js
                proj.members.push({
                  email: email,
                  role: 'member',
                  addedAt: ts
                });
```
替换为：
```js
                proj.members.push({
                  email: email,
                  role: 'member',
                  status: 'active',
                  addedAt: ts
                });
```

- [ ] **Step 2: 修改 Google 登录注册写入（约 382 行）**

找到：
```js
                  proj.members.push({ email: mockEmail, role: 'member', addedAt: ts });
```
替换为：
```js
                  proj.members.push({ email: mockEmail, role: 'member', status: 'active', addedAt: ts });
```

- [ ] **Step 3: 验证**

在另一个浏览器标签页打开邀请链接（从成员管理页复制），完成注册流程。回到管理员视角刷新成员管理页，确认新注册用户以「普通成员」（active，非 pending）状态出现。

---

## Task 8：提交

- [ ] **Step 1: 全流程验证**

完整演示路径：
1. 管理员页进入成员管理
2. 邮箱添加 `alice@demo.com` → 显示「待加入」
3. 点「模拟接受邀请」→ 变为「普通成员」
4. 点「复制链接」→ 按钮变「已复制 ✓」，无 alert
5. 打开邀请链接 → 注册 → 回到成员表确认直接为「普通成员」

- [ ] **Step 2: 提交**

```bash
git add app.html register.html
git commit -m "feat: member invite UX — pending state, accept/revoke, inline toasts"
```
