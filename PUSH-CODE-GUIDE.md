# 🚀 推送代码到远程仓库指南

## 📋 快速开始（推荐方式）

### 步骤 1：配置环境变量（一次性设置）

运行交互式配置向导：

```bash
./scripts/setup-env.sh
```

**脚本会引导你完成**：
- ✅ 创建 `.env` 文件
- ✅ 配置 GitHub Personal Access Token
- ✅ 配置 GitLab Personal Access Token
- ✅ 设置仓库 URLs
- ✅ 验证安全配置

**期望输出**：
```
╔════════════════════════════════════════════════════════════╗
║   ✅ Setup Complete!                                      ║
╚════════════════════════════════════════════════════════════╝

📊 Configuration Summary
  ✅ GitHub configured
  ✅ GitLab configured

🚀 Next Steps:
1. Push your code to remote repository:
   ./scripts/secure-git-push.sh
```

---

### 步骤 2：推送代码

运行安全推送脚本：

```bash
./scripts/secure-git-push.sh
```

**脚本会自动完成**：
1. 🔒 安全检查（确保 `.env` 不会被提交）
2. 📂 加载环境变量
3. 🔧 配置 Git remotes（使用 tokens）
4. 📊 显示 Git 状态
5. 🚀 推送到 GitHub/GitLab
6. 🧹 清理 tokens（从 remote URLs 移除）

**期望输出**：
```
╔════════════════════════════════════════════════════════════╗
║   ✅ Push Complete!                                       ║
╚════════════════════════════════════════════════════════════╝

📊 Summary
  ✅ Successful pushes: 2

GitHub Repository:
  https://github.com/yourusername/ankersckcp

GitLab Repository:
  https://gitlab.com/yourusername/ankersckcp

🔒 Security Note:
  • Tokens are stored in .env (not committed to Git)
  • Remote URLs have been cleaned (tokens removed)
  • Your credentials are safe
```

---

## 🔑 创建 Personal Access Tokens

### GitHub Token

1. **访问** https://github.com/settings/tokens
2. **点击** "Generate new token" → "Generate new token (classic)"
3. **配置 Token**：
   ```
   Note: Anker Soundcore KCP - CI/CD Access
   Expiration: 90 days

   Scopes:
   ✅ repo
   ✅ workflow
   ```
4. **生成并复制** token（格式：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

### GitLab Token

1. **访问** https://gitlab.com/-/profile/personal_access_tokens
2. **点击** "Add new token"
3. **配置 Token**：
   ```
   Token name: Anker Soundcore KCP - CI/CD Access
   Expiration date: 90 days

   Scopes:
   ✅ api
   ✅ read_repository
   ✅ write_repository
   ```
4. **生成并复制** token（格式：`glpat-xxxxxxxxxxxxxxxxxxxx`）

---

## 🔒 安全保障

### 多层保护机制

我们实施了多层安全机制来保护你的 tokens：

1. **`.gitignore` 保护**
   - `.env` 已添加到 `.gitignore`
   - 即使执行 `git add .`，也不会被添加

2. **自动检测与修复**
   - 检测 `.env` 是否被 staged（如果是，自动 unstage）
   - 检测 `.env` 是否被追踪（如果是，自动移除追踪）
   - 验证 `.env` 在 `.gitignore` 中

3. **Token 使用安全**
   - Tokens 仅在脚本内存中使用
   - 不会写入 Git 配置文件
   - 推送后自动从 remote URLs 清除

4. **文件权限**
   - `.env` 文件权限设置为 `600`（仅所有者可读写）
   - 其他用户无法读取

### 验证安全性

运行以下命令验证配置安全：

```bash
# 1. 检查 .env 不在 Git 追踪中
git ls-files | grep .env
# 应该没有输出

# 2. 检查 .env 在 .gitignore 中
grep "\.env" .gitignore
# 应该看到 .env 相关规则

# 3. 检查 Git 状态
git status
# 不应该看到 .env 文件

# 4. 检查 remote URLs（tokens 应该已被清除）
git remote -v
# 应该看到干净的 HTTPS URLs，不含 tokens
```

---

## 🛠️ 手动推送（高级用户）

如果你更喜欢手动配置，可以按照以下步骤操作：

### 方式 1：使用 HTTPS + Token

```bash
# 1. 创建 .env 文件
cp .env.template .env
nano .env  # 填写 tokens 和 URLs

# 2. 加载环境变量
source .env

# 3. 配置 remotes（GitHub）
git remote add github "https://${GITHUB_TOKEN}@github.com/yourusername/ankersckcp.git"

# 4. 配置 remotes（GitLab）
git remote add origin "https://oauth2:${GITLAB_TOKEN}@gitlab.com/yourusername/ankersckcp.git"

# 5. 推送代码
git push -u github main
git push -u origin main

# 6. 清理 tokens（重要！）
git remote set-url github "https://github.com/yourusername/ankersckcp.git"
git remote set-url origin "https://gitlab.com/yourusername/ankersckcp.git"
```

### 方式 2：使用 SSH（更安全，推荐）

```bash
# 1. 生成 SSH key（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 添加 SSH key 到 ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 3. 复制公钥到剪贴板
pbcopy < ~/.ssh/id_ed25519.pub  # macOS
# 或
cat ~/.ssh/id_ed25519.pub       # 手动复制

# 4. 添加 SSH key 到 GitHub
# 访问: https://github.com/settings/keys
# 点击 "New SSH key"，粘贴公钥

# 5. 添加 SSH key 到 GitLab
# 访问: https://gitlab.com/-/profile/keys
# 点击 "Add new key"，粘贴公钥

# 6. 配置 remotes（SSH）
git remote add github git@github.com:yourusername/ankersckcp.git
git remote add origin git@gitlab.com:yourusername/ankersckcp.git

# 7. 推送代码
git push -u github main
git push -u origin main
```

---

## 📊 当前代码状态

查看当前提交状态：

```bash
# 查看提交历史
git log --oneline -5

# 当前应该有的提交：
# a862720 security: add comprehensive token protection system
# fbe5183 docs: add project documentation and configuration files
# 6c6d606 feat: complete CI/CD automation setup with Figma integration
# 49ee9c9 chore: add GitHub Actions workflow for Figma sync
# 9ff5571 chore: add GitLab CI configuration for Figma sync automation
```

```bash
# 查看文件统计
git ls-files | wc -l
# 应该显示约 91 个文件
```

---

## ✅ 推送后验证

### 在 GitHub 验证

1. **访问** `https://github.com/yourusername/ankersckcp`
2. **检查**：
   - ✅ 所有文件已上传
   - ✅ `.env` 文件**不在**仓库中
   - ✅ `.env.template` 在仓库中
   - ✅ `.gitignore` 包含 `.env`
3. **查看** 提交历史（应该有 5 个提交）

### 在 GitLab 验证

1. **访问** `https://gitlab.com/yourusername/ankersckcp`
2. **检查**：
   - ✅ 所有文件已上传
   - ✅ `.env` 文件**不在**仓库中
   - ✅ `.env.template` 在仓库中
   - ✅ `.gitignore` 包含 `.env`
3. **查看** 提交历史（应该有 5 个提交）

---

## 🐛 故障排查

### 问题 1：推送失败 "authentication failed"

**可能原因**：
- Token 无效或过期
- Token 权限不足
- 仓库不存在

**解决方案**：

1. **验证 Token**：
   ```bash
   # GitHub
   curl -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user
   # 应该返回你的用户信息

   # GitLab
   curl -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" https://gitlab.com/api/v4/user
   # 应该返回你的用户信息
   ```

2. **重新生成 Token**（如果需要）

3. **更新 .env 文件**：
   ```bash
   nano .env  # 更新 token
   ```

4. **重新推送**：
   ```bash
   ./scripts/secure-git-push.sh
   ```

---

### 问题 2：".env file not found"

**原因**：还没有创建 `.env` 文件

**解决方案**：
```bash
./scripts/setup-env.sh
```

---

### 问题 3：".env is tracked by Git"

**原因**：`.env` 文件已被 Git 追踪

**解决方案**：
```bash
# 运行安全推送脚本会自动修复
./scripts/secure-git-push.sh

# 或手动修复
git rm --cached .env
git commit -m "security: remove .env from tracking"
```

---

### 问题 4：推送到错误的仓库

**解决方案**：

1. **检查 remote URLs**：
   ```bash
   git remote -v
   ```

2. **更新 remote URL**：
   ```bash
   # GitHub
   git remote set-url github https://github.com/correct-username/correct-repo.git

   # GitLab
   git remote set-url origin https://gitlab.com/correct-username/correct-repo.git
   ```

3. **更新 .env 文件**：
   ```bash
   nano .env  # 更新 GITHUB_REPO_URL 和 GITLAB_REPO_URL
   ```

---

## 📚 相关文档

- **安全指南**：`SECURITY-GUIDE.md` - 完整的安全最佳实践
- **脚本源码**：
  - `scripts/setup-env.sh` - 交互式环境配置
  - `scripts/secure-git-push.sh` - 安全推送脚本
- **环境变量模板**：`.env.template` - 配置参考

---

## 🎯 总结

### 推荐流程（最简单、最安全）

```bash
# 1. 运行配置向导（一次性）
./scripts/setup-env.sh

# 2. 推送代码（每次需要推送时）
./scripts/secure-git-push.sh
```

### 安全保障

- ✅ Token 永远不会被提交到 Git
- ✅ 自动检测并修复安全问题
- ✅ 多层验证机制
- ✅ 推送后自动清理

### 下一步

推送成功后，继续完成其他任务：
1. 在 GitLab 创建 Pipeline Schedule
2. 测试 GitHub Actions 手动触发
3. 配置 Slack 通知

参考：`QUICK-CICD-SETUP.md`

---

**最后更新**: 2025-10-16
**版本**: 1.0.0
**状态**: ✅ 生产就绪

🔒 **记住：永远不要在命令行或代码中暴露 tokens！**
