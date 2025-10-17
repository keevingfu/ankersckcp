# CLAUDE.md

这个文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 语言标准

**重要**: 这些语言规则必须始终遵循:

### 用户交互
- **语言**: 中文 (Chinese)
- 与用户的所有沟通使用中文
- 错误消息和状态更新使用中文

### 代码生成
- **语言**: 仅英文
- 所有变量名使用英文
- 所有函数名使用英文
- 所有代码注释使用英文
- 遵循标准英文命名约定 (camelCase, PascalCase, snake_case)

### UI 元素
- **语言**: 仅英文
- 所有标签使用英文
- 所有按钮使用英文
- 所有UI消息使用英文

## 项目概览

**项目**: Anker Soundcore KCP (Knowledge Control Plane) 知识管理平台
**技术栈**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
**当前状态**: 核心功能完成 (90%), 进入优化阶段

### 架构结构

```
ankersckcp/
├── frontend/                    # Next.js 应用
│   ├── app/                     # App Router 页面
│   │   ├── knowledge-graph/     # 知识图谱 (Canvas可视化)
│   │   ├── content-generator/   # 内容生成器 (AI生成)
│   │   ├── smart-chat/          # 智能客服 (聊天界面)
│   │   └── analytics/           # 数据分析 (SVG图表)
│   ├── components/
│   │   ├── ui/                  # 基础组件 (Table, Select, Button等)
│   │   └── business/            # 业务组件 (ContentPreview, ChatMessage)
│   └── styles/design-system/    # 设计系统Token
├── design/                      # Figma设计文档
└── .github/workflows/           # CI/CD (Figma同步)
```

## 常用命令

### 开发
```bash
# 进入前端目录
cd frontend

# 安装依赖 (首次)
npm install

# 启动开发服务器
npm run dev
# 访问: http://localhost:3000

# 构建生产版本
npm run build
npm start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 测试
```bash
# 运行单元测试
npm run test

# 视觉回归测试 (Playwright)
cd frontend
npx playwright test
```

### Git 工作流
```bash
# 已配置 GitHub Actions 自动化
# - Figma设计同步
# - 代码检查和测试
# - 自动部署
```

## 核心架构概念

### 1. 设计系统 (Design System)
所有样式从 `frontend/styles/design-system/` 导出:

```typescript
import { colors, typography, spacing } from '@/styles/design-system';

// 色彩: 紫罗兰主题
colors.primary[500]  // #667eea (主紫色)
colors.secondary[600] // #764ba2 (辅助紫罗兰)

// 排版: Inter字体
typography.fontSizes.base // 16px

// 间距: 8点网格
spacing[4] // 16px
```

**重要**: 使用 Tailwind 类名时遵循设计系统:
- 主色: `bg-purple-600`, `text-purple-600`
- 间距: `p-4`, `gap-6`, `space-y-8` (8的倍数)
- 字体: `font-inter`, `text-base`, `font-semibold`

### 2. 页面架构 (App Router)

每个页面使用 Next.js 14 App Router:

```typescript
// app/[feature]/page.tsx
export default function FeaturePage() {
  return (
    <MainLayout>
      {/* 页面内容 */}
    </MainLayout>
  );
}
```

**关键页面**:
- `knowledge-graph/page.tsx` - Canvas 渲染 + Force-directed 布局
- `content-generator/page.tsx` - 表单 + 实时预览 + 质量评分
- `smart-chat/page.tsx` - 流式消息 + WebSocket ready
- `analytics/page.tsx` - SVG 图表 + 数据表格

### 3. 组件模式

**基础组件** (`components/ui/`):
- 高度可复用
- 完整 TypeScript 类型
- 支持多种变体 (variant, size)
- 包含详细 JSDoc 注释

```typescript
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  variant?: 'default' | 'bordered' | 'striped';
  // ... 详见组件定义
}
```

**业务组件** (`components/business/`):
- 封装复杂业务逻辑
- 可配置但不过度抽象
- 示例: ContentPreview, ChatMessage

### 4. 状态管理

当前使用 React Hooks (useState, useEffect):

```typescript
// 简单状态
const [data, setData] = useState<DataType[]>([]);

// 复杂状态 (未来可迁移至 Zustand)
// 全局状态 (未来可使用 Context API)
```

### 5. 性能考虑

**Knowledge Graph**:
- 使用原生 Canvas API (非库依赖)
- 手动优化渲染循环
- 节点数 < 100 时性能最佳

**Analytics Charts**:
- 自定义 SVG 实现 (避免重依赖)
- 响应式缩放

**代码分割**:
- 路由级自动分割 (Next.js)
- 组件级懒加载待实现

## Figma 集成

项目配置了自动化 Figma 同步:

```bash
# GitHub Actions: .github/workflows/figma-sync.yml
# 自动同步设计Token到 frontend/styles/design-system/
```

**设计文件**:
- `design/DESIGN_SYSTEM_SPEC.md` - 完整设计规范
- `figma-extracted/` - Figma导出的设计Token

## 技术决策记录

### TypeScript 严格模式
- 启用 `strict: true`
- 禁止 `any` 类型 (0个使用)
- 所有组件都有完整类型定义

### CSS 方案
- **主要**: Tailwind CSS 3.4 (JIT模式)
- **设计Token**: TypeScript常量导出
- **避免**: CSS Modules, styled-components

### 图表库
- **选择**: 自定义SVG实现
- **原因**: 避免重依赖, 精确控制样式
- **未来**: 可迁移至 D3.js 如需高级图表

### Canvas 渲染
- **Library**: 无 (原生 Canvas API)
- **布局算法**: 自定义 Force-directed 实现
- **原因**: 最小bundle size, 完全控制

## 待办任务

### Phase 5: 优化增强 (预计8小时)

**响应式设计** (3小时):
- 移动端布局 (< 640px)
- 平板端优化 (640px-1024px)
- 触摸手势支持

**性能优化** (2小时):
- 路由级代码分割
- 组件懒加载
- 图片优化 (Next.js Image)
- Bundle size 优化

**测试覆盖** (3小时):
- 单元测试 (Jest + RTL)
- E2E测试 (Playwright)
- 视觉回归测试

## 代码规范

### 命名约定
```typescript
// 组件: PascalCase
function ContentPreview() {}

// 函数: camelCase
function calculateScore() {}

// 常量: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 类型: PascalCase
interface UserData {}
type StatusType = 'pending' | 'completed';
```

### 文件组织
```
feature-name/
├── page.tsx          # 页面主组件
├── components/       # 页面专用组件 (如需要)
└── utils.ts          # 辅助函数 (如需要)
```

### 导入顺序
```typescript
// 1. React/Next.js
import { useState } from 'react';
import Image from 'next/image';

// 2. 第三方库
import { LucideIcon } from 'lucide-react';

// 3. 内部组件
import Button from '@/components/ui/Button';

// 4. 工具/类型
import { colors } from '@/styles/design-system';
import type { User } from '@/types';
```

## 已知限制

1. **移动端**: 布局未优化 (待Phase 5)
2. **测试**: 无单元测试覆盖 (待Phase 5)
3. **Bundle Size**: 偏大, 需代码分割 (待Phase 5)
4. **图片**: 未启用懒加载 (待Phase 5)

## 参考文档

**项目内部**:
- `DEVELOPMENT_COMPLETE_SUMMARY.md` - 完整开发总结
- `frontend/README.md` - 前端快速开始指南
- `design/DESIGN_SYSTEM_SPEC.md` - 设计规范

**外部资源**:
- [Next.js 14 文档](https://nextjs.org/docs)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 项目状态

**完成度**: 90% (核心功能完成)
**最后更新**: 2025-10-16
**下一步**: Phase 5 优化增强 (响应式 + 性能 + 测试)
