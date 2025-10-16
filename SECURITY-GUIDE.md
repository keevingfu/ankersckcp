# 🔒 安全配置指南

## ⚠️ 重要：Token 安全防护

本项目使用 `.env` 文件来安全地存储敏感信息（如 GitHub/GitLab tokens）。**绝对不要将 tokens 提交到 Git 仓库！**

---

## 🛡️ 安全机制

### 已实现的保护措施

1. **`.env` 文件已加入 `.gitignore`**
   - 确保 `.env` 永远不会被 Git 追踪
   - 即使意外执行 `git add .`，也不会被添加

2. **`.env.template` 提供配置模板**
   - 不包含实际的 token 值
   - 安全地提交到 Git 作为参考

3. **`scripts/secure-git-push.sh` 安全推送脚本**
   - 自动检查 `.env` 不会被提交
   - 使用 token 但不暴露在命令历史中
   - 推送后自动清理 remote URL 中的 token

4. **多重检查机制**
   - 启动前验证 `.env` 在 `.gitignore` 中
   - 检测 `.env` 是否被 staged
   - 自动 unstage 和移除追踪

---

## 📋 配置步骤

### 步骤 1：创建 Personal Access Token

#### GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 填写信息：
   ```
   Note: Anker Soundcore KCP - CI/CD Access
   Expiration: 90 days (或根据需要选择)

   Select scopes:
   ✅ repo (完整仓库访问权限)
      ✅ repo:status
      ✅ repo_deployment
      ✅ public_repo
      ✅ repo:invite
      ✅ security_events
   ✅ workflow (更新 GitHub Actions workflows)
   ```
4. 点击 **"Generate token"**
5. **立即复制 token**（只显示一次！）

#### GitLab Token

1. 访问 https://gitlab.com/-/profile/personal_access_tokens
2. 点击 **"Add new token"**
3. 填写信息：
   ```
   Token name: Anker Soundcore KCP - CI/CD Access
   Expiration date: 90 days (或根据需要选择)

   Select scopes:
   ✅ api (完整 API 访问权限)
   ✅ read_repository (读取仓库)
   ✅ write_repository (写入仓库)
   ```
4. 点击 **"Create personal access token"**
5. **立即复制 token**（只显示一次！）

---

### 步骤 2：配置 .env 文件

```bash
# 1. 复制模板文件
cp .env.template .env

# 2. 编辑 .env 文件（使用你喜欢的编辑器）
nano .env
# 或
vim .env
# 或
code .env
```

**填写 .env 文件内容：**

```bash
# ============================================
# Git Repository Access Tokens
# ============================================

# GitHub Personal Access Token (必填，如果使用 GitHub)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# GitLab Personal Access Token (必填，如果使用 GitLab)
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx

# ============================================
# Repository URLs
# ============================================

# GitHub repository URL
GITHUB_REPO_URL=https://github.com/yourusername/ankersckcp.git

# GitLab repository URL
GITLAB_REPO_URL=https://gitlab.com/yourusername/ankersckcp.git

# ============================================
# CI/CD Integrations (可选，稍后配置)
# ============================================

SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**重要提示**：
- 将 `yourusername` 替换为你的实际用户名
- 将 `ghp_xxx` 和 `glpat-xxx` 替换为你复制的实际 token
- 不要在 token 前后添加引号或空格

---

### 步骤 3：验证配置

运行安全检查：

```bash
# 验证 .env 文件不会被 Git 追踪
git status

# 应该看不到 .env 文件在 untracked files 中
# 如果看到了，请确保 .gitignore 中有 .env
```

---

## 🚀 使用安全推送脚本

### 基本使用

```bash
# 运行安全推送脚本
./scripts/secure-git-push.sh
```

### 脚本功能

脚本会自动完成以下操作：

1. **安全检查** ✅
   - 验证 `.env` 文件存在
   - 确认 `.env` 在 `.gitignore` 中
   - 检测 `.env` 是否被 staged（如果是，自动 unstage）
   - 检测 `.env` 是否被 Git 追踪（如果是，自动移除追踪）

2. **加载环境变量** 📂
   - 从 `.env` 读取 tokens
   - 验证配置完整性

3. **配置 Git Remotes** 🔧
   - 使用 token 配置 GitHub/GitLab remote
   - Token 仅在内存中使用，不写入文件

4. **Git 状态检查** 📊
   - 显示当前分支和提交历史
   - 检测未提交的更改
   - 可选：提交更改

5. **推送到远程仓库** 🚀
   - 推送到 GitHub（如果配置）
   - 推送到 GitLab（如果配置）
   - 显示推送结果

6. **安全清理** 🧹
   - 从 remote URLs 中移除 tokens
   - 确保 Git 配置中不残留敏感信息

---

## 🔍 故障排查

### 问题 1：".env file not found"

**原因**：没有创建 `.env` 文件

**解决方案**：
```bash
cp .env.template .env
nano .env  # 填写你的 tokens
```

---

### 问题 2：推送失败 "authentication failed"

**可能原因**：
1. Token 无效或已过期
2. Token 权限不足
3. 仓库 URL 错误

**解决方案**：

1. **验证 Token 有效性**：
   ```bash
   # GitHub
   curl -H "Authorization: token YOUR_GITHUB_TOKEN" https://api.github.com/user

   # GitLab
   curl -H "PRIVATE-TOKEN: YOUR_GITLAB_TOKEN" https://gitlab.com/api/v4/user
   ```

2. **检查 Token 权限**：
   - GitHub: 需要 `repo` 和 `workflow` scopes
   - GitLab: 需要 `api`, `read_repository`, `write_repository` scopes

3. **验证仓库 URL**：
   - 确保 URL 格式正确
   - 确保你对仓库有写权限

---

### 问题 3：".env is tracked by Git"

**原因**：`.env` 文件已经被 Git 追踪了

**解决方案**：
```bash
# 移除 Git 追踪（但保留本地文件）
git rm --cached .env

# 确保 .env 在 .gitignore 中
echo ".env" >> .gitignore

# 提交更改
git add .gitignore
git commit -m "chore: remove .env from Git tracking"
```

---

### 问题 4：Token 泄漏怎么办？

**如果不小心将 token 提交到了 Git**：

1. **立即撤销 Token**：
   - GitHub: https://github.com/settings/tokens
   - GitLab: https://gitlab.com/-/profile/personal_access_tokens

2. **创建新的 Token**（按照上面的步骤）

3. **从 Git 历史中删除 Token**：
   ```bash
   # 使用 BFG Repo-Cleaner 或 git-filter-branch
   # 警告：这会重写 Git 历史！

   # 推荐使用 BFG（更快、更安全）
   brew install bfg  # macOS
   bfg --replace-text passwords.txt  # 包含要替换的 tokens
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

4. **如果仓库是公开的**：
   - GitHub 会自动检测 tokens 并撤销
   - 但你仍需要手动清理历史

---

## ✅ 最佳实践

### 1. Token 管理

- ✅ **使用短期 Token**（30-90天）
- ✅ **定期轮换 Token**
- ✅ **为不同项目使用不同 Token**
- ✅ **使用最小权限原则**（只授予必要的 scopes）
- ❌ **不要在多个项目间共享 Token**
- ❌ **不要将 Token 写在代码注释中**
- ❌ **不要通过聊天/邮件发送 Token**

### 2. .env 文件

- ✅ **始终使用 `.env.template` 作为参考**
- ✅ **在 `.env` 中添加注释说明**
- ✅ **定期检查 `.env` 没有被 Git 追踪**
- ✅ **备份 `.env` 到安全的位置**（如密码管理器）
- ❌ **不要将 `.env` 放在公开的云存储**
- ❌ **不要将 `.env` 发送给其他人**

### 3. Git 操作

- ✅ **使用 `scripts/secure-git-push.sh` 推送代码**
- ✅ **推送前检查 `git status`**
- ✅ **使用 SSH keys 代替 HTTPS（如果可能）**
- ❌ **不要在命令行中直接输入 token**
- ❌ **不要使用 `git config credential.helper store`**

### 4. CI/CD 配置

- ✅ **使用 GitLab/GitHub 的 Secrets 功能**
- ✅ **启用 "Mask variable" 隐藏日志中的敏感信息**
- ✅ **限制 Secrets 的作用域**（只在特定环境使用）
- ❌ **不要在 CI/CD 脚本中 echo secrets**
- ❌ **不要将 secrets 写入文件**

---

## 📚 相关资源

### 官方文档

- [GitHub: Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitLab: Personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
- [Git Credential Storage](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)

### 安全工具

- [git-secrets](https://github.com/awslabs/git-secrets) - 防止提交 secrets 到 Git
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - 从 Git 历史中删除敏感数据
- [TruffleHog](https://github.com/trufflesecurity/truffleHog) - 扫描 Git 历史中的 secrets

---

## 🆘 需要帮助？

如果遇到任何安全相关的问题：

1. **不要** panic 并将问题公开讨论（可能暴露更多信息）
2. **立即** 撤销可能泄漏的 tokens
3. **查阅** 本文档的故障排查部分
4. **运行** 验证脚本检查配置

---

**最后更新**: 2025-10-16
**版本**: 1.0.0
**状态**: ✅ 生产就绪

🔒 **记住：安全第一！保护好你的 tokens，就像保护你的密码一样。**
