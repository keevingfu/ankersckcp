# CI/CD 设置交互式指南

**目标**: 完成 GitLab Schedule、GitHub Actions 测试、Slack 通知配置

---

## 🎯 任务清单

- [ ] 任务 1: 创建 GitLab Schedule (5 分钟)
- [ ] 任务 2: 测试 GitHub Actions 手动触发 (3 分钟)
- [ ] 任务 3: 配置 Slack 通知 (10 分钟)

---

## 📋 任务 1: 创建 GitLab Schedule

### 前提条件

- ✅ 已有 GitLab 项目
- ✅ `.gitlab-ci-figma-sync.yml` 已创建
- ✅ 已在主 `.gitlab-ci.yml` 中引入配置

### 步骤 1.1: 引入 Figma Sync 配置

如果还没有引入，运行：

```bash
# 检查是否已有 .gitlab-ci.yml
if [ ! -f .gitlab-ci.yml ]; then
  echo "创建 .gitlab-ci.yml..."
  cat > .gitlab-ci.yml << 'EOF'
# GitLab CI/CD Configuration
# Project: Anker Soundcore KCP

stages:
  - sync
  - validate
  - test
  - deploy

# Figma Design System Sync
include:
  - local: '.gitlab-ci-figma-sync.yml'
EOF
  echo "✅ .gitlab-ci.yml 已创建"
else
  # 检查是否已包含 figma-sync 配置
  if grep -q "gitlab-ci-figma-sync.yml" .gitlab-ci.yml; then
    echo "✅ 已引入 Figma sync 配置"
  else
    echo "添加 Figma sync 配置..."
    cat >> .gitlab-ci.yml << 'EOF'

# Figma Design System Sync
include:
  - local: '.gitlab-ci-figma-sync.yml'
EOF
    echo "✅ 已添加 Figma sync 配置"
  fi
fi
```

### 步骤 1.2: 提交配置到 GitLab

```bash
git add .gitlab-ci.yml
git add .gitlab-ci-figma-sync.yml
git commit -m "chore: add Figma design system sync to CI/CD"
git push origin main
```

### 步骤 1.3: 在 GitLab Web UI 中创建 Schedule

**操作步骤**:

1. **访问 GitLab 项目**:
   - 打开浏览器
   - 访问你的 GitLab 项目页面
   - 例如: `https://gitlab.com/your-username/ankersckcp`

2. **导航到 Schedules**:
   ```
   侧边栏 → CI/CD → Schedules
   或直接访问: https://gitlab.com/your-username/ankersckcp/-/pipeline_schedules
   ```

3. **点击 "New schedule"**

4. **填写表单**:

   | 字段 | 值 | 说明 |
   |------|-----|------|
   | Description | `Daily Figma Design System Sync` | 描述 |
   | Interval Pattern | `0 9 * * *` | 每天上午 9:00 |
   | Cron timezone | `(GMT+08:00) Beijing` | 选择你的时区 |
   | Target Branch | `main` | 或你的主分支名 |
   | Activated | ✅ | 勾选启用 |

   **Cron 表达式参考**:
   - `0 9 * * *` - 每天 9:00 AM
   - `0 */4 * * *` - 每 4 小时
   - `0 9 * * 1` - 每周一 9:00 AM
   - `0 9 1 * *` - 每月 1 号 9:00 AM

5. **点击 "Save pipeline schedule"**

6. **测试 Schedule (可选)**:
   - 在 Schedule 列表中找到刚创建的
   - 点击右侧的 "▶️ Play" 按钮
   - 立即触发一次运行

### 步骤 1.4: 验证 Pipeline

```
1. GitLab → CI/CD → Pipelines
2. 应该看到新的 pipeline 正在运行
3. 检查各个 stage 的状态:
   - sync ✓
   - validate ✓
   - test ✓
   - deploy ✓
```

### 步骤 1.5: 查看 Schedule 列表

```
GitLab → CI/CD → Schedules

应该看到:
┌────────────────────────────────────────────────┐
│ Daily Figma Design System Sync                 │
│ 0 9 * * * (每天 9:00 AM)                       │
│ Target: main                                   │
│ Next run: 明天 09:00                           │
│ Owner: [你的用户名]                            │
│ ✅ Active                                      │
│ [Edit] [Delete] [▶️ Play]                     │
└────────────────────────────────────────────────┘
```

### 故障排查

**问题 1: Schedule 未显示**
```
解决方案:
1. 检查是否有 Master/Maintainer 权限
2. 确认 .gitlab-ci.yml 文件语法正确
3. 查看 CI/CD 设置是否启用
```

**问题 2: Pipeline 失败**
```
解决方案:
1. 点击失败的 job 查看日志
2. 检查 Runner 是否可用
3. 验证环境变量配置
```

---

## 🚀 任务 2: 测试 GitHub Actions 手动触发

### 前提条件

- ✅ 已有 GitHub 仓库
- ✅ `.github/workflows/figma-sync.yml` 已创建
- ✅ 文件已推送到 GitHub

### 步骤 2.1: 推送 Workflow 到 GitHub

```bash
# 确认文件存在
ls -la .github/workflows/figma-sync.yml

# 提交并推送
git add .github/workflows/figma-sync.yml
git commit -m "chore: add GitHub Actions workflow for Figma sync"
git push origin main
```

### 步骤 2.2: 在 GitHub Web UI 中手动触发

**操作步骤**:

1. **访问 GitHub 仓库**:
   - 打开浏览器
   - 访问你的 GitHub 仓库
   - 例如: `https://github.com/your-username/ankersckcp`

2. **导航到 Actions**:
   ```
   顶部菜单 → Actions
   或直接访问: https://github.com/your-username/ankersckcp/actions
   ```

3. **找到 Workflow**:
   ```
   左侧边栏 → Workflows
   找到: "Figma Design System Sync"
   ```

4. **手动触发**:
   ```
   1. 点击 "Figma Design System Sync"
   2. 右侧点击 "Run workflow" 下拉按钮
   3. 选择 Branch: main
   4. (可选) 勾选 "Create Pull Request"
   5. 点击绿色的 "Run workflow" 按钮
   ```

5. **查看运行状态**:
   ```
   等待几秒后刷新页面
   应该看到新的 workflow run 出现在列表顶部
   状态: 🟡 In progress
   ```

6. **监控执行过程**:
   ```
   点击 workflow run 进入详情页
   可以看到 6 个 jobs:
   ┌─────────────────────────────────────┐
   │ ✓ sync                              │
   │ ⏳ validate (依赖 sync)             │
   │ ⏳ visual-regression (依赖 sync)    │
   │ ⏳ consistency-check (依赖 sync)    │
   │ ⏳ create-pr (可选)                 │
   │ ⏳ notify (依赖所有)                │
   └─────────────────────────────────────┘
   ```

7. **查看日志**:
   ```
   点击任意 job 名称查看详细日志
   例如点击 "sync" 查看同步过程
   ```

### 步骤 2.3: 验证结果

**方法 1: 检查 Commits**
```bash
# 本地拉取最新更改
git pull origin main

# 查看最近的 commits
git log -3 --oneline

# 应该看到类似:
# abc1234 chore(design): sync design system from Figma
```

**方法 2: 检查 Artifacts**
```
GitHub → Actions → [刚运行的 workflow]
滚动到底部 → Artifacts
应该看到:
- design-system (包含同步的文件)
- visual-regression-results (测试结果)
```

**方法 3: 检查 Pull Request (如果选择创建)**
```
GitHub → Pull requests
应该看到新的 PR:
"chore(design): sync design system from Figma"
```

### 步骤 2.4: 设置定时触发 (已自动配置)

无需额外操作，workflow 已配置为每天 9:00 AM UTC 自动运行：

```yaml
on:
  schedule:
    - cron: '0 9 * * *'  # 每天 9:00 AM UTC
```

**转换为你的时区**:
- UTC 09:00 = 北京时间 17:00 (UTC+8)
- UTC 01:00 = 北京时间 09:00 (UTC+8)

如需修改时间，编辑 `.github/workflows/figma-sync.yml`:

```yaml
schedule:
  - cron: '0 1 * * *'  # 北京时间 9:00 AM
```

### 故障排查

**问题 1: "Run workflow" 按钮不可见**
```
原因: Workflow 必须在默认分支上才能手动触发
解决方案:
1. 确认已推送到 main 分支
2. 确认 workflow 文件没有语法错误
3. 等待几分钟让 GitHub 索引 workflow
```

**问题 2: Workflow 运行失败**
```
常见原因:
1. 权限问题: 检查 GITHUB_TOKEN 权限
2. 依赖安装失败: 检查 package.json
3. 测试失败: 查看详细日志

解决方案:
1. 点击失败的 job
2. 查看错误日志
3. 根据错误信息修复
4. 重新触发 workflow
```

---

## 🔔 任务 3: 配置 Slack 通知

### 前提条件

- ✅ 有 Slack 工作区访问权限
- ✅ 能创建 Incoming Webhooks

### 步骤 3.1: 创建 Slack Incoming Webhook

**操作步骤**:

1. **访问 Slack App Directory**:
   ```
   打开浏览器访问:
   https://api.slack.com/apps
   ```

2. **创建新 App**:
   ```
   1. 点击 "Create New App"
   2. 选择 "From scratch"
   3. App Name: "Figma Design System Sync"
   4. Workspace: 选择你的工作区
   5. 点击 "Create App"
   ```

3. **启用 Incoming Webhooks**:
   ```
   1. 左侧菜单 → "Incoming Webhooks"
   2. 右上角 → 切换开关到 "On"
   3. 滚动到底部 → 点击 "Add New Webhook to Workspace"
   4. 选择要发送通知的频道 (例如 #dev-notifications)
   5. 点击 "Allow"
   ```

4. **复制 Webhook URL**:
   ```
   复制显示的 Webhook URL
   格式类似: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX

   ⚠️ 注意: 这个 URL 是敏感信息，不要公开分享
   ```

### 步骤 3.2: 配置 GitLab Slack 通知

**方法 1: 通过 Web UI 配置**

1. **访问项目设置**:
   ```
   GitLab 项目 → Settings → CI/CD → Variables
   或访问: https://gitlab.com/your-username/ankersckcp/-/settings/ci_cd
   ```

2. **添加变量**:
   ```
   点击 "Add variable"

   填写:
   - Key: SLACK_WEBHOOK_URL
   - Value: [粘贴你的 Slack Webhook URL]
   - Type: Variable (默认)
   - Environment scope: All (默认)
   - Protect variable: ☐ (不勾选)
   - Mask variable: ✅ (勾选，隐藏日志中的值)

   点击 "Add variable"
   ```

**方法 2: 使用 GitLab API (高级)**

```bash
# 设置变量
PROJECT_ID="your-project-id"  # 在 GitLab 项目设置中查看
GITLAB_TOKEN="your-gitlab-token"  # Personal Access Token
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

curl --request POST \
  --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  "https://gitlab.com/api/v4/projects/$PROJECT_ID/variables" \
  --form "key=SLACK_WEBHOOK_URL" \
  --form "value=$SLACK_WEBHOOK" \
  --form "masked=true"
```

### 步骤 3.3: 配置 GitHub Slack 通知

**方法 1: 通过 Web UI 配置**

1. **访问仓库设置**:
   ```
   GitHub 仓库 → Settings → Secrets and variables → Actions
   或访问: https://github.com/your-username/ankersckcp/settings/secrets/actions
   ```

2. **添加 Variable**:
   ```
   切换到 "Variables" 标签
   点击 "New repository variable"

   填写:
   - Name: SLACK_WEBHOOK_URL
   - Value: [粘贴你的 Slack Webhook URL]

   点击 "Add variable"
   ```

**方法 2: 使用 GitHub CLI**

```bash
# 安装 GitHub CLI (如果未安装)
# macOS: brew install gh
# 其他: https://cli.github.com/

# 登录
gh auth login

# 设置变量
gh variable set SLACK_WEBHOOK_URL \
  --body "https://hooks.slack.com/services/YOUR/WEBHOOK/URL" \
  --repo your-username/ankersckcp
```

### 步骤 3.4: 测试 Slack 通知

**测试 GitLab 通知**:

1. **触发 Pipeline**:
   ```
   GitLab → CI/CD → Pipelines → Run pipeline
   或使用 Schedule 的 Play 按钮
   ```

2. **等待完成**:
   ```
   等待 pipeline 完成 (成功或失败)
   ```

3. **检查 Slack**:
   ```
   打开 Slack，查看配置的频道
   应该收到类似消息:

   ┌────────────────────────────────────────┐
   │ 🎨 Design System Sync Completed        │
   │                                        │
   │ Repository: your-username/ankersckcp   │
   │ Branch: main                           │
   │ Workflow: View Run                     │
   │ Status: ✅ Success                     │
   └────────────────────────────────────────┘
   ```

**测试 GitHub 通知**:

1. **触发 Workflow**:
   ```
   GitHub → Actions → Figma Design System Sync
   点击 "Run workflow"
   ```

2. **等待完成**:
   ```
   等待所有 jobs 完成
   ```

3. **检查 Slack**:
   ```
   应该收到 GitHub Actions 的通知消息
   ```

### 步骤 3.5: 自定义通知格式 (可选)

**编辑通知消息**:

编辑 `.gitlab-ci-figma-sync.yml` 或 `.github/workflows/figma-sync.yml`

**GitLab 示例**:

```yaml
figma:notify:
  script:
    - |
      curl -X POST -H 'Content-type: application/json' \
        --data "{
          \"text\": \"🎨 Design System Sync Completed\",
          \"blocks\": [{
            \"type\": \"header\",
            \"text\": {
              \"type\": \"plain_text\",
              \"text\": \"🎨 Figma 设计系统已同步\"
            }
          }, {
            \"type\": \"section\",
            \"fields\": [{
              \"type\": \"mrkdwn\",
              \"text\": \"*项目:*\n${CI_PROJECT_NAME}\"
            }, {
              \"type\": \"mrkdwn\",
              \"text\": \"*分支:*\n${CI_COMMIT_REF_NAME}\"
            }]
          }]
        }" \
        "${SLACK_WEBHOOK_URL}"
```

**GitHub 示例**:

```yaml
- name: Send Slack notification
  run: |
    curl -X POST -H 'Content-type: application/json' \
      --data '{
        "text": "🎨 Design System Sync Completed",
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "🎨 Figma 设计系统已同步"
            }
          }
        ]
      }' \
      "${{ vars.SLACK_WEBHOOK_URL }}"
```

### 步骤 3.6: Slack 消息示例

**成功通知**:
```
🎨 Design System Sync Completed

Repository: your-username/ankersckcp
Branch: main
Workflow: #123
Status: ✅ Success

Changes:
• Updated 15 color tokens
• Updated typography system
• Updated spacing tokens

View Details →
```

**失败通知**:
```
❌ Design System Sync Failed

Repository: your-username/ankersckcp
Branch: main
Workflow: #124
Status: ❌ Failed

Failed Job: visual-regression
Error: Screenshot mismatch detected

View Logs →
```

### 故障排查

**问题 1: 没有收到 Slack 消息**
```
检查清单:
☐ Webhook URL 是否正确配置
☐ 变量名是否正确 (SLACK_WEBHOOK_URL)
☐ 变量是否在正确的环境 scope
☐ Pipeline/Workflow 是否成功执行到 notify job
☐ Slack App 是否有权限发送消息到频道

解决方案:
1. 测试 Webhook URL:
   curl -X POST -H 'Content-type: application/json' \
     --data '{"text":"Test message"}' \
     YOUR_WEBHOOK_URL

2. 查看 CI/CD 日志中的 notify job
3. 检查是否有错误信息
```

**问题 2: Webhook URL 泄露**
```
如果不小心暴露了 Webhook URL:
1. 立即访问 Slack App 设置
2. 删除旧的 Webhook
3. 创建新的 Webhook
4. 更新 CI/CD 变量
```

---

## ✅ 完成检查清单

完成后，确认以下内容：

### GitLab
- [ ] `.gitlab-ci.yml` 已引入 figma-sync 配置
- [ ] Schedule 已创建并激活
- [ ] Schedule 显示正确的 cron 时间
- [ ] 手动触发 Schedule 成功
- [ ] Pipeline 各 stage 都通过
- [ ] Slack 通知正常接收

### GitHub
- [ ] `.github/workflows/figma-sync.yml` 已推送
- [ ] Workflow 在 Actions 页面可见
- [ ] 手动触发 workflow 成功
- [ ] 所有 jobs 都通过
- [ ] Artifacts 正确生成
- [ ] Slack 通知正常接收

### Slack
- [ ] Incoming Webhook 已创建
- [ ] Webhook URL 已安全保存
- [ ] GitLab SLACK_WEBHOOK_URL 变量已配置
- [ ] GitHub SLACK_WEBHOOK_URL 变量已配置
- [ ] 收到测试通知消息
- [ ] 消息格式正确显示

---

## 🎉 完成！

恭喜！你已经完成了完整的 CI/CD 自动化配置。

### 现在可以实现

✅ **全自动设计系统同步**:
- 每天自动从 Figma 同步设计系统
- 自动提交和推送到 Git
- 自动运行视觉回归测试
- 自动发送 Slack 通知

✅ **零人工干预**:
- 设计师更新 Figma
- 系统自动同步
- 自动测试验证
- 失败自动通知

✅ **完整的可观测性**:
- GitLab/GitHub Pipeline 状态
- Slack 实时通知
- 详细的日志记录
- 测试报告和 Artifacts

---

## 📞 需要帮助？

查看相关文档:
- `FIGMA-AUTOMATION-COMPLETE.md` - 自动化完整文档
- `FIGMA-WEBHOOK-SETUP.md` - Webhook 设置
- `.gitlab-ci-figma-sync.yml` - GitLab 配置
- `.github/workflows/figma-sync.yml` - GitHub 配置

---

**最后更新**: 2025-10-16
**状态**: 🚀 Ready to use!
