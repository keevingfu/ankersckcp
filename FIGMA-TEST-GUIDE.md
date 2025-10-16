# Figma MCP 测试指南

> 无需自己创建,使用公开资源快速测试 Figma MCP 功能

---

## 🎯 两种测试方案

### 方案 1: 使用 Figma 社区公开文件 (推荐)

**优点**:
- ✅ 无需创建文件
- ✅ 专业的设计系统
- ✅ 包含完整的组件库
- ✅ 可直接复制到你的账号

**推荐的公开设计系统**:

#### 1. Material Design 3 (Google)
- **链接**: https://www.figma.com/community/file/1035203688168086460
- **名称**: Material 3 Design Kit
- **包含**: 完整的 Material Design 组件库、颜色系统、字体规范

#### 2. Ant Design
- **链接**: https://www.figma.com/community/file/831698976089873405
- **名称**: Ant Design System
- **包含**: Ant Design 组件库、设计 Token

#### 3. Apple Design Resources
- **链接**: https://www.figma.com/community/file/928108847914589057
- **名称**: iOS 17 Design Kit
- **包含**: iOS 原生组件、图标、颜色

#### 4. Bootstrap 5
- **链接**: https://www.figma.com/community/file/1108822142891664311
- **名称**: Bootstrap 5 UI Kit
- **包含**: Bootstrap 组件、网格系统

---

### 方案 2: 快速创建简单测试文件

**5 分钟快速创建**:

1. **打开 Figma Desktop** (已经在运行中)

2. **创建新文件**:
   - 点击 `+` 或 `New design file`
   - 命名为: `MCP Test File`

3. **创建简单的设计元素**:

   **添加颜色**:
   - 画一个矩形 (快捷键 `R`)
   - 填充颜色: `#1976D2` (蓝色)
   - 在右侧面板创建颜色样式: `Primary Color`

   **添加文字**:
   - 文字工具 (快捷键 `T`)
   - 输入: "Hello MCP"
   - 字体: Roboto, 32px, Bold
   - 创建文字样式: `Heading 1`

   **创建组件**:
   - 画一个按钮形状
   - 右键 → `Create Component`
   - 命名: `Button/Primary`

4. **获取文件信息**:
   - 点击顶部的 `Share` 按钮
   - 点击 `Copy link`
   - 链接格式: `https://figma.com/file/{FILE_KEY}/MCP-Test-File`

---

## 🚀 快速测试路径 (使用社区文件)

### Step 1: 复制社区文件到你的账号

**操作步骤**:

1. **打开推荐的社区文件** (例如 Material Design 3):
   ```
   https://www.figma.com/community/file/1035203688168086460
   ```

2. **在 Figma Desktop 中打开链接**:
   - 可以在浏览器打开,也可以直接在 Figma Desktop 搜索

3. **复制到草稿**:
   - 点击 `Get a copy` 或 `Duplicate`
   - 文件会自动复制到你的 Drafts

4. **获取 File Key**:
   - 复制的文件会在你的 Drafts 中
   - 打开文件,点击 `Share` → `Copy link`
   - 提取 File Key (链接中 `/file/` 后面的部分)

### Step 2: 提供 File Key 给我

格式:
```
File Key: abc123def456...
```

或者直接发送完整链接:
```
https://figma.com/design/abc123def456/Material-3-Design-Kit
```

### Step 3: 我将测试以下功能

一旦你提供 File Key,我会立即测试:

1. ✅ **提取设计系统**:
   - 颜色规范 (Primary, Secondary, etc.)
   - 字体规范 (Heading, Body, etc.)
   - 间距规范 (4, 8, 16, 24...)

2. ✅ **获取组件列表**:
   - 所有可用组件
   - 组件变体
   - 组件属性

3. ✅ **生成代码**:
   - 从组件自动生成 React 代码 (使用 Magic UI)
   - 生成 Tailwind CSS 配置

4. ✅ **导出资源**:
   - 导出图标 (SVG)
   - 导出设计参考图 (PNG)

---

## 🎨 推荐测试流程

### 最简单的方式 (推荐):

1. **使用 Material Design 3**:
   ```
   1. 访问: https://www.figma.com/community/file/1035203688168086460
   2. 点击 "Get a copy" (获取副本)
   3. 在 Figma Desktop 中打开副本
   4. 复制文件链接发给我
   ```

2. **我会帮你**:
   - 提取完整的设计系统
   - 生成 Tailwind 配置
   - 导出组件代码
   - 创建视觉回归测试基准

---

## 📝 常见问题

### Q1: 我需要 Figma 付费账号吗?
**A**: 不需要! 免费账号就可以:
- 复制社区文件
- 查看和编辑文件
- 使用 Figma MCP 提取数据

### Q2: 复制社区文件会影响原文件吗?
**A**: 不会! 复制的是独立副本,完全属于你的账号。

### Q3: 可以用别人分享给我的文件吗?
**A**: 可以! 只要你有访问权限就行。

### Q4: 测试需要多长时间?
**A**:
- 复制文件: 30 秒
- 提取设计系统: 1 分钟
- 生成代码: 2 分钟
- 总计: **不到 5 分钟**

---

## 🎯 立即开始

### 推荐操作 (30 秒):

1. **在 Figma Desktop 中打开这个链接**:
   ```
   https://www.figma.com/community/file/1035203688168086460
   ```

2. **点击 "Get a copy"** (或 "Duplicate")

3. **复制文件链接发给我**:
   - 打开副本
   - 点击 `Share` → `Copy link`
   - 粘贴发给我

4. **我会立即开始测试!** 🚀

---

## 💡 如果你想自己创建

### 最小可测试文件清单:

创建一个包含以下内容的 Figma 文件即可测试:

- [ ] 至少 1 个颜色样式 (Color Style)
- [ ] 至少 1 个文字样式 (Text Style)
- [ ] 至少 1 个组件 (Component)
- [ ] 可选: 图标 (用于测试导出)

**创建时间**: 5 分钟

**步骤**:
1. Figma Desktop → New design file
2. 创建颜色样式 (矩形 + 右侧面板创建样式)
3. 创建文字样式 (文字 + 右侧面板创建样式)
4. 创建组件 (画个按钮 + 右键 Create Component)
5. Share → Copy link → 发给我

---

**等待你的 Figma 文件链接!** 🎨

无论你选择哪种方式,都只需要:
1. 复制文件链接
2. 发给我
3. 我会立即开始测试 Figma MCP 功能!
