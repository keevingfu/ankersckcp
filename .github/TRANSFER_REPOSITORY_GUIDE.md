# 将仓库转移到 leapunion Organizations 指南

本指南将帮助您将 `ankersckcp` 仓库从个人账户 `keevingfu` 转移到 `leapunion` Organizations。

---

## 📋 前置条件

在转移仓库之前，请确认：

1. ✅ **您是仓库的所有者**（当前是 `keevingfu/ankersckcp`）
2. ✅ **您是 `leapunion` Organizations 的成员**（且有仓库创建权限）
3. ✅ **Organizations 允许从外部转移仓库**
4. ✅ **所有重要更改已提交并推送**

---

## 🔄 转移方法

### 方法 1: 通过 GitHub 网页界面（推荐）

这是最简单、最安全的方法。

#### 步骤 1: 打开仓库设置

1. 访问仓库页面：https://github.com/keevingfu/ankersckcp
2. 点击 **Settings**（设置）标签页
3. 滚动到页面底部，找到 **Danger Zone**（危险区域）

#### 步骤 2: 转移仓库

1. 在 Danger Zone 中，找到 **Transfer ownership** 选项
2. 点击 **Transfer** 按钮
3. 在弹出的对话框中：
   - 输入新的所有者：`leapunion`
   - 输入仓库名确认：`ankersckcp`
   - 点击 **I understand, transfer this repository**

#### 步骤 3: 确认转移

1. GitHub 可能会发送确认邮件到 Organizations 的管理员
2. Organizations 管理员需要接受转移请求
3. 转移完成后，仓库 URL 将变为：`https://github.com/leapunion/ankersckcp`

---

### 方法 2: 使用 GitHub CLI（gh）

如果您安装了 GitHub CLI，可以使用命令行完成转移。

#### 安装 GitHub CLI

```bash
# macOS
brew install gh

# Windows (using Chocolatey)
choco install gh

# Linux (Debian/Ubuntu)
sudo apt install gh
```

#### 认证

```bash
gh auth login
# 选择：GitHub.com
# 选择：HTTPS
# 使用您的个人 access token 或 web browser 认证
```

#### 转移仓库

```bash
# 确保您在仓库目录中
cd /Users/cavin/Desktop/dev/ankersckcp

# 转移仓库到 Organizations
gh repo transfer leapunion --yes
```

**注意：** `--yes` 标志会跳过确认提示。

---

### 方法 3: 使用 GitHub API

如果您需要自动化转移过程，可以使用 GitHub API。

#### API 请求

```bash
# 使用 curl 调用 API
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/keevingfu/ankersckcp/transfer \
  -d '{
    "new_owner":"leapunion",
    "team_ids":[]
  }'
```

**替换：**
- `YOUR_GITHUB_TOKEN` - 您的 GitHub Personal Access Token（需要 `repo` 权限）

---

## 🔒 转移后的影响

### 自动更新的内容

✅ **GitHub 自动处理的重定向：**
- 旧 URL：`https://github.com/keevingfu/ankersckcp`
- 新 URL：`https://github.com/leapunion/ankersckcp`
- GitHub 会自动创建重定向（90天内有效）

✅ **保留的内容：**
- 所有 commit 历史
- Issues 和 Pull Requests
- Branches 和 Tags
- GitHub Actions workflows
- Discussions
- Wiki（如果有）
- Stars 和 Watchers

### 需要手动更新的内容

#### 1. 更新本地 Git Remote

转移后，需要更新所有本地克隆的 remote URL：

```bash
# 在本地仓库目录中
cd /Users/cavin/Desktop/dev/ankersckcp

# 查看当前 remote
git remote -v

# 更新 origin 到新的 Organizations URL
git remote set-url origin https://github.com/leapunion/ankersckcp.git

# 验证更新
git remote -v

# 测试连接
git fetch origin
git pull origin main
```

#### 2. 更新 README.md 中的链接

转移后，更新 README.md 中的所有链接：

```bash
# 使用 sed 批量替换（macOS）
sed -i '' 's/keevingfu\/ankersckcp/leapunion\/ankersckcp/g' README.md

# Linux
sed -i 's/keevingfu\/ankersckcp/leapunion\/ankersckcp/g' README.md

# 提交更改
git add README.md
git commit -m "docs: update repository links after transfer to leapunion org"
git push origin main
```

#### 3. 更新 GitHub Actions 中的引用

检查 `.github/workflows/` 中是否有硬编码的仓库路径：

```bash
# 搜索需要更新的引用
grep -r "keevingfu/ankersckcp" .github/workflows/

# 批量替换
find .github/workflows -type f -name "*.yml" -exec sed -i '' 's/keevingfu\/ankersckcp/leapunion\/ankersckcp/g' {} +
```

#### 4. 更新 package.json（如果有）

```bash
cd frontend

# 更新 repository 字段
# 编辑 package.json，将：
# "repository": "github:keevingfu/ankersckcp"
# 改为：
# "repository": "github:leapunion/ankersckcp"

# 或使用命令
npm pkg set repository.url="git+https://github.com/leapunion/ankersckcp.git"
```

#### 5. 更新文档中的链接

检查并更新以下文件中的链接：
- `CONTRIBUTING.md`
- `CLAUDE.md`
- `docs/` 目录下的所有 Markdown 文件
- 任何 `.md` 文件

```bash
# 批量搜索所有 Markdown 文件中的旧链接
find . -name "*.md" -exec grep -l "keevingfu/ankersckcp" {} \;

# 批量替换（小心使用）
find . -name "*.md" -exec sed -i '' 's/keevingfu\/ankersckcp/leapunion\/ankersckcp/g' {} +
```

#### 6. 更新 Clone Commands

如果有文档提到克隆命令，需要更新：

```bash
# 旧的
git clone https://github.com/keevingfu/ankersckcp.git

# 新的
git clone https://github.com/leapunion/ankersckcp.git
```

---

## 🛡️ 安全和权限

### Organizations 权限设置

转移后，您需要在 Organizations 中配置：

1. **Team 权限**
   - 创建 Teams（如 `developers`, `maintainers`）
   - 分配适当的仓库访问权限

2. **Branch 保护规则**
   - 保护 `main` 分支
   - 要求 Pull Request reviews
   - 要求状态检查通过

3. **GitHub Actions 密钥**
   - 在 Organizations Settings → Secrets 中添加必要的密钥
   - 或在仓库 Settings → Secrets 中添加

4. **Webhooks 和 Integrations**
   - 检查并重新配置 webhooks
   - 更新第三方集成（CI/CD, 监控等）

---

## ✅ 转移后检查清单

转移完成后，请确认以下内容：

### GitHub 网页检查

- [ ] 访问新 URL：`https://github.com/leapunion/ankersckcp`
- [ ] 检查所有 tabs（Code, Issues, Pull Requests, Actions 等）
- [ ] 验证 GitHub Actions 正常运行
- [ ] 确认 Discussions 和 Wiki 已转移
- [ ] 检查 Settings → Manage access（团队权限）

### 本地仓库检查

- [ ] 更新本地 git remote URL
- [ ] `git fetch origin` 成功
- [ ] `git pull origin main` 成功
- [ ] `git push origin main` 成功（测试）

### 文档更新检查

- [ ] README.md 中的链接已更新
- [ ] CONTRIBUTING.md 中的链接已更新
- [ ] package.json 的 repository 字段已更新
- [ ] GitHub Actions workflows 中的引用已更新
- [ ] 所有 `.md` 文件中的链接已更新

### CI/CD 检查

- [ ] GitHub Actions workflows 正常运行
- [ ] Secrets 和环境变量已配置
- [ ] Branch 保护规则已设置
- [ ] Webhooks 已重新配置（如有）

---

## 🚨 常见问题

### Q: 转移会丢失什么吗？

**A:** 不会！转移是安全的，以下内容都会保留：
- 所有 commit 历史和 Git 对象
- Issues、Pull Requests、Discussions
- Stars、Forks、Watchers
- GitHub Actions workflows
- Wiki 页面
- Release 和 Tags

### Q: 旧的 URL 还能访问吗？

**A:** 是的，GitHub 会自动创建从旧 URL 到新 URL 的重定向，持续 90 天。但建议立即更新所有引用。

### Q: 协作者会怎样？

**A:** 个人协作者权限不会自动转移。需要在 Organizations 中通过 Teams 重新分配权限。

### Q: Fork 会受影响吗？

**A:** Fork 不会自动更新，但 GitHub 会处理 Pull Request 的重定向。Fork 的用户需要手动更新上游 URL：

```bash
git remote set-url upstream https://github.com/leapunion/ankersckcp.git
```

### Q: 可以撤销转移吗？

**A:** 可以，但需要 Organizations 管理员将仓库转移回您的个人账户。

---

## 📞 需要帮助？

如果转移过程中遇到问题：

1. **检查 GitHub 文档**
   - [Transfer a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)

2. **联系 Organizations 管理员**
   - 确认您有转移权限
   - 确认 Organizations 配置正确

3. **GitHub Support**
   - 访问：https://support.github.com
   - 如果是付费 Organizations，可以获得优先支持

---

## 🎯 快速命令汇总

```bash
# 1. 转移仓库（GitHub CLI）
gh repo transfer leapunion --yes

# 2. 更新本地 remote
git remote set-url origin https://github.com/leapunion/ankersckcp.git

# 3. 批量更新文档链接
find . -name "*.md" -exec sed -i '' 's/keevingfu\/ankersckcp/leapunion\/ankersckcp/g' {} +

# 4. 更新 package.json
cd frontend && npm pkg set repository.url="git+https://github.com/leapunion/ankersckcp.git"

# 5. 提交更新
git add -A
git commit -m "docs: update repository links after org transfer"
git push origin main

# 6. 验证
git remote -v
git fetch origin
git pull origin main
```

---

**祝转移顺利！如有问题，请随时咨询。** 🚀
