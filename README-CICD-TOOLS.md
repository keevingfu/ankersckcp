# 🛠️ CI/CD 配置工具使用指南

已为你准备好所有 CI/CD 配置工具！

---

## 🎯 快速开始 (推荐)

### 方法 1: 一键配置向导 ⭐

```bash
./scripts/quickstart-cicd.sh
```

**这个脚本会引导你完成**:
- ✅ GitLab CI/CD 配置
- ✅ GitHub Actions 配置
- ✅ Slack 通知配置

**特点**:
- 交互式向导
- 自动检测配置状态
- 提供清晰的下一步指示
- 自动测试 Slack webhook

---

### 方法 2: 分步配置

#### Step 1: 配置 GitLab CI

```bash
# 自动配置 .gitlab-ci.yml
./scripts/setup-gitlab-ci.sh

# 然后在 GitLab Web UI 中:
# 1. 创建 Pipeline Schedule
# 2. 配置定时触发
```

#### Step 2: 测试 GitHub Actions

```bash
# 确保文件已推送
git add .github/workflows/figma-sync.yml
git commit -m "chore: add GitHub Actions workflow"
git push origin main

# 然后在 GitHub Web UI 中:
# 1. 访问 Actions 页面
# 2. 手动触发 workflow
```

#### Step 3: 配置 Slack 通知

```bash
# 测试 Slack Webhook
./scripts/test-slack-webhook.sh 'your-webhook-url'

# 如果测试成功，在 GitLab/GitHub 中配置环境变量:
# SLACK_WEBHOOK_URL = your-webhook-url
```

---

## 📋 可用工具清单

### 配置脚本

| 脚本 | 功能 | 使用场景 |
|------|------|----------|
| `quickstart-cicd.sh` | 一键配置向导 | ⭐ 首次配置 (推荐) |
| `setup-gitlab-ci.sh` | GitLab CI 配置 | 单独配置 GitLab |
| `test-slack-webhook.sh` | 测试 Slack Webhook | 验证 Slack 配置 |
| `verify-cicd-setup.sh` | 验证所有配置 | 检查配置完整性 |

### 文档

| 文档 | 内容 | 适用场景 |
|------|------|----------|
| `QUICK-CICD-SETUP.md` | 快速配置指南 (5 分钟) | ⭐ 快速上手 |
| `CI-CD-SETUP-GUIDE.md` | 完整设置指南 (详细) | 深入了解 |
| `FIGMA-AUTOMATION-COMPLETE.md` | 自动化完整文档 | 了解架构 |
| `FIGMA-WEBHOOK-SETUP.md` | Webhook 设置指南 | Webhook 配置 |

---

## 🚀 使用示例

### 示例 1: 全新项目配置

```bash
# 1. 运行一键配置向导
./scripts/quickstart-cicd.sh

# 2. 按提示完成各步骤
# 3. 验证配置
./scripts/verify-cicd-setup.sh
```

**预计时间**: 15 分钟

---

### 示例 2: 仅配置 GitLab

```bash
# 1. 配置 GitLab CI
./scripts/setup-gitlab-ci.sh

# 2. 在 GitLab 中创建 Schedule
# 访问: https://gitlab.com/[username]/[repo]/-/pipeline_schedules

# 3. (可选) 配置 Slack
./scripts/test-slack-webhook.sh 'webhook-url'
```

**预计时间**: 5 分钟

---

### 示例 3: 仅配置 Slack 通知

```bash
# 1. 测试 Webhook
./scripts/test-slack-webhook.sh 'your-webhook-url'

# 2. 配置环境变量
# GitLab: Settings → CI/CD → Variables
# GitHub: Settings → Secrets and variables → Actions

# 3. 触发 pipeline 测试通知
```

**预计时间**: 5 分钟

---

## 🔍 验证配置

### 快速验证

```bash
./scripts/verify-cicd-setup.sh
```

**输出示例**:
```
🔍 CI/CD Setup Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Section 1: Design System Files
  ✅ Design system directory exists
  ✅ colors.ts exists
  ✅ typography.ts exists
  ...

📊 Verification Summary
  ✅ Passed: 45
  ⚠️  Warnings: 2
  ❌ Failed: 0

Score: 96% (45/47)

🎉 All critical checks passed!
```

### 手动验证检查清单

**GitLab**:
- [ ] `.gitlab-ci.yml` 存在且包含 figma-sync
- [ ] Pipeline Schedule 已创建
- [ ] Schedule 显示正确的 cron 时间
- [ ] 手动触发 Schedule 成功
- [ ] SLACK_WEBHOOK_URL 变量已配置

**GitHub**:
- [ ] `.github/workflows/figma-sync.yml` 存在
- [ ] Workflow 在 Actions 页面可见
- [ ] 手动触发 workflow 成功
- [ ] 所有 jobs 通过
- [ ] SLACK_WEBHOOK_URL 变量已配置

**Slack**:
- [ ] Incoming Webhook 已创建
- [ ] 测试消息发送成功
- [ ] 接收到 CI/CD 通知

---

## 📊 工具使用流程图

```
开始配置
    ↓
┌─────────────────────────┐
│ 方法选择                │
├─────────────────────────┤
│ A. 一键配置 (推荐)      │ → ./scripts/quickstart-cicd.sh
│ B. 分步配置             │ → 按需运行各脚本
│ C. 手动配置             │ → 查阅文档
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ GitLab CI/CD 配置       │
├─────────────────────────┤
│ • 运行 setup-gitlab-ci  │
│ • 创建 Schedule         │
│ • 测试触发              │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ GitHub Actions 配置     │
├─────────────────────────┤
│ • 推送 workflow 文件    │
│ • 手动触发测试          │
│ • 验证 jobs 通过        │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ Slack 通知配置          │
├─────────────────────────┤
│ • 创建 Webhook          │
│ • 测试 Webhook          │
│ • 配置环境变量          │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 验证配置                │
├─────────────────────────┤
│ • verify-cicd-setup.sh  │
│ • 手动测试触发          │
│ • 检查 Slack 通知       │
└─────────────────────────┘
    ↓
✅ 配置完成！
```

---

## 🎓 学习路径

### 初学者路径

1. **阅读快速指南** (10 分钟)
   ```bash
   cat QUICK-CICD-SETUP.md
   ```

2. **运行一键配置** (15 分钟)
   ```bash
   ./scripts/quickstart-cicd.sh
   ```

3. **验证配置** (5 分钟)
   ```bash
   ./scripts/verify-cicd-setup.sh
   ```

4. **测试第一次运行** (等待自动触发或手动触发)

**总时间**: ~30 分钟

---

### 进阶路径

1. **深入了解架构** (30 分钟)
   ```bash
   cat FIGMA-AUTOMATION-COMPLETE.md
   cat CI-CD-SETUP-GUIDE.md
   ```

2. **自定义配置** (根据需求)
   - 修改 cron 时间
   - 自定义 Slack 消息
   - 添加更多测试

3. **配置 Webhook 实时同步** (30 分钟)
   ```bash
   cat FIGMA-WEBHOOK-SETUP.md
   ./scripts/figma-webhook-handler.sh
   ```

**总时间**: 1-2 小时

---

## 💡 最佳实践

### 1. 首次配置

✅ **推荐**:
```bash
# 使用一键配置向导
./scripts/quickstart-cicd.sh
```

❌ **不推荐**:
- 跳过验证步骤
- 不测试 Slack webhook
- 手动编辑所有配置文件

---

### 2. 定期维护

```bash
# 每月运行一次验证
./scripts/verify-cicd-setup.sh

# 检查自动化运行状态
# GitLab: CI/CD → Pipelines
# GitHub: Actions

# 检查 Slack 通知历史
# Slack → #dev-notifications
```

---

### 3. 故障排查

```bash
# 1. 运行验证脚本
./scripts/verify-cicd-setup.sh

# 2. 检查失败项
# 根据输出修复问题

# 3. 重新测试
# GitLab: 手动触发 Schedule
# GitHub: 手动触发 Workflow

# 4. 查看详细日志
# 在 Web UI 中查看 job 日志
```

---

## 🔗 相关资源

### 内部文档

- `QUICK-CICD-SETUP.md` - ⭐ 快速配置指南
- `CI-CD-SETUP-GUIDE.md` - 完整设置指南
- `FIGMA-AUTOMATION-COMPLETE.md` - 自动化文档
- `FIGMA-WEBHOOK-SETUP.md` - Webhook 设置
- `FIGMA-INTEGRATION-COMPLETE-SUMMARY.md` - 完整总结

### 脚本

- `scripts/quickstart-cicd.sh` - ⭐ 一键配置
- `scripts/setup-gitlab-ci.sh` - GitLab 配置
- `scripts/test-slack-webhook.sh` - Slack 测试
- `scripts/verify-cicd-setup.sh` - 配置验证

### 外部资源

- [GitLab CI/CD 文档](https://docs.gitlab.com/ee/ci/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Slack Webhooks 文档](https://api.slack.com/messaging/webhooks)
- [Playwright 文档](https://playwright.dev)

---

## 🆘 获取帮助

### 问题排查优先级

1. **运行验证脚本**
   ```bash
   ./scripts/verify-cicd-setup.sh
   ```

2. **查阅相关文档**
   - `QUICK-CICD-SETUP.md` - 常见问题
   - `CI-CD-SETUP-GUIDE.md` - 故障排查

3. **检查日志**
   - GitLab: CI/CD → Pipelines → 点击 job
   - GitHub: Actions → 点击 workflow run → 点击 job

4. **测试单个组件**
   ```bash
   # 测试 Slack
   ./scripts/test-slack-webhook.sh 'webhook-url'

   # 测试设计系统同步
   ./scripts/figma-sync-design-system.sh
   ```

---

## 🎉 快速开始

**现在就开始配置吧！**

```bash
# 一键配置所有内容
./scripts/quickstart-cicd.sh
```

**或者阅读快速指南**:

```bash
cat QUICK-CICD-SETUP.md | less
```

---

## 📞 支持

- **文档**: 查看上述相关文档
- **验证**: 运行 `./scripts/verify-cicd-setup.sh`
- **测试**: 运行各个测试脚本

---

**最后更新**: 2025-10-16
**版本**: 1.0.0
**状态**: ✅ Ready to use

🚀 **祝配置顺利！**
