# Soundcore KCP Frontend 前端应用

基于Figma设计系统的企业级知识控制平面(Knowledge Control Plane)前端应用

## 📐 设计系统

本项目完全基于《KCP系统Figma设计完整提示词.md》构建，遵循现代科技风格的设计理念。

### 核心设计特点

- **色彩系统**: 科技紫罗兰渐变主题 (#667eea → #764ba2)
- **排版系统**: Inter字体族 + 清晰的字号层级
- **间距系统**: 8点网格系统
- **组件库**: 完整的基础UI组件 + 业务组件
- **响应式**: 支持移动端、平板、桌面多种设备

## 📂 项目结构

```
frontend/
├── app/                          # Next.js App Router页面
│   ├── dashboard/                # 仪表板页面
│   │   └── page.tsx
│   ├── knowledge/                # 知识库页面 (待创建)
│   ├── graph/                    # 知识图谱页面 (待创建)
│   ├── generator/                # 内容生成器页面 (待创建)
│   └── chat/                     # 智能客服页面 (待创建)
├── components/                   # 组件库
│   ├── ui/                       # 基础UI组件
│   │   ├── Button.tsx           # 按钮组件
│   │   ├── Input.tsx            # 输入框组件
│   │   ├── Card.tsx             # 卡片组件
│   │   ├── Modal.tsx            # 模态框组件
│   │   └── ...                  # 更多基础组件
│   └── business/                 # 业务组件
│       ├── KnowledgeCard.tsx    # 知识卡片
│       └── ...                  # 更多业务组件
├── styles/                       # 样式文件
│   └── design-system/            # 设计系统Token
│       ├── colors.ts             # 色彩系统
│       ├── typography.ts         # 排版系统
│       ├── spacing.ts            # 间距系统
│       ├── effects.ts            # 阴影和动效
│       └── index.ts              # 导出汇总
└── lib/                          # 工具函数
```

## 🎨 设计系统使用指南

### 颜色使用

```tsx
import { colors } from '@/styles/design-system';

// 主色调
colors.primary[500]  // #667eea
colors.primary[600]  // #5a67d8

// 功能色
colors.success[500]  // 成功状态
colors.error[500]    // 错误状态
colors.warning[500]  // 警告状态

// 渐变
colors.gradients.purple  // 紫色渐变
```

### 排版使用

```tsx
import { typography } from '@/styles/design-system';

// 字号
className="text-4xl"  // 36px - 大标题
className="text-base" // 16px - 标准正文

// 字重
className="font-semibold"  // 600 - 按钮、标签
className="font-bold"      // 700 - 主标题
```

### 间距使用

```tsx
import { spacing } from '@/styles/design-system';

// Tailwind类名
className="p-6"   // 24px padding
className="gap-4" // 16px gap
className="space-y-8" // 32px vertical spacing
```

## 🧩 组件使用示例

### Button组件

```tsx
import Button from '@/components/ui/Button';

// 主按钮
<Button variant="primary" size="medium">
  确认
</Button>

// 带图标的按钮
<Button variant="primary" loading={isLoading}>
  <IconPlus />
  添加知识
</Button>

// 危险按钮
<Button variant="danger" onClick={handleDelete}>
  删除
</Button>
```

### Input组件

```tsx
import Input from '@/components/ui/Input';

// 基础输入框
<Input
  label="标题"
  placeholder="请输入标题"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

// 搜索框
<Input
  variant="search"
  placeholder="搜索知识..."
  clearable
  prefixIcon={<SearchIcon />}
/>

// 密码输入
<Input
  variant="password"
  label="密码"
  status="error"
  helperText="密码必须至少8位"
/>
```

### Card组件

```tsx
import Card, { StatCard } from '@/components/ui/Card';

// 基础卡片
<Card variant="hoverable">
  <h3>卡片标题</h3>
  <p>卡片内容</p>
</Card>

// 统计卡片
<StatCard
  title="总知识量"
  value="2,847"
  trend={{ value: 12.5, isPositive: true }}
  icon={<BookIcon />}
/>
```

### Modal组件

```tsx
import Modal, { ConfirmModal } from '@/components/ui/Modal';

// 基础模态框
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="编辑知识"
  footer={
    <div>
      <Button onClick={handleSave}>保存</Button>
    </div>
  }
>
  <p>模态框内容</p>
</Modal>

// 确认对话框
<ConfirmModal
  open={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="确认删除"
  description="此操作不可撤销，确定要删除吗？"
  type="danger"
/>
```

## 📱 页面组件

### Dashboard页面

Dashboard是KCP系统的核心页面，展示关键指标和数据概览。

**功能特点:**
- 📊 4个关键统计卡片(知识量、查询量、响应时间、满意度)
- 📈 趋势指示器(正向/负向)
- 🔔 最近活动时间线
- 🏆 Top知识内容排行
- ⚡ 快速操作面板

**使用:**
```tsx
import Dashboard from '@/app/dashboard/page';

export default Dashboard;
```

## 🚀 开发指南

### 安装依赖

```bash
cd frontend
npm install
# 或
pnpm install
```

### 运行开发服务器

```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:3000` 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📋 待办事项

### 基础组件 (已完成)
- [x] Button - 按钮
- [x] Input - 输入框
- [x] Card - 卡片
- [x] Modal - 模态框
- [ ] Table - 表格
- [ ] Select - 选择器
- [ ] Tabs - 标签页
- [ ] Dropdown - 下拉菜单

### 业务组件
- [x] KnowledgeCard - 知识卡片
- [ ] ContentPreview - 内容预览
- [ ] ChatMessage - 聊天消息
- [ ] GraphNode - 图谱节点

### 页面
- [x] Dashboard - 仪表板
- [ ] Knowledge Base - 知识库
- [ ] Knowledge Graph - 知识图谱
- [ ] Content Generator - 内容生成器
- [ ] Smart Chat - 智能客服
- [ ] Analytics - 数据分析

## 🎯 下一步计划

1. **完善基础组件库**
   - Table表格组件(支持排序、筛选、分页)
   - Select选择器(支持搜索、多选)
   - Tabs标签页组件

2. **创建剩余页面**
   - 知识库页面(列表、详情、编辑)
   - 知识图谱页面(交互式节点图)
   - 内容生成器页面(AI驱动)
   - 智能客服页面(对话界面)

3. **集成后端API**
   - 配置API客户端
   - 实现数据获取和更新
   - 添加加载状态和错误处理

4. **优化和测试**
   - 响应式布局测试
   - 无障碍性测试
   - 性能优化

## 📖 参考资料

- [设计规范文档](../docs/KCP系统Figma设计完整提示词.md)
- [Next.js文档](https://nextjs.org/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [TypeScript文档](https://www.typescriptlang.org/docs)

## 🤝 贡献指南

1. 遵循设计系统规范
2. 使用TypeScript编写类型安全的代码
3. 组件添加必要的注释和文档
4. 保持代码风格一致性

## 📄 License

Copyright © 2024 Anker Soundcore. All rights reserved.
