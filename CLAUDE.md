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

**整体完成度**: 93% (Phases 1-4 完成, Phase 5 进行中 70%)
**最后更新**: 2025-10-22 20:45
**当前阶段**: Phase 5 - 前端性能优化与测试（70% 完成）
**下一阶段**: Phase 5 - 后端测试、文档与安全

### 开发阶段规划

| 阶段 | 状态 | 完成度 | 说明 |
|------|------|--------|------|
| Phase 0: 项目初始化 | ✅ 完成 | 100% | Git仓库、CI/CD、配置文件 |
| Phase 1: 前端开发 | ✅ 完成 | 100% | 7个页面、14个组件、完整UI |
| Phase 2: 后端开发 | ✅ 完成 | 100% | 5个微服务、4个数据库、Docker |
| Phase 3: 前后端集成 | ✅ 完成 | 100% | API集成、测试数据、Mock降级 |
| Phase 4: CI/CD & 部署 | ✅ 完成 | 100% | GitLab CI、K8s、监控配置 |
| Phase 5: 优化与测试 | 🔄 进行中 | 70% | 前端优化✅、测试覆盖✅、响应式设计✅、监控集成✅ |

### Phase 1: 前端开发 (✅ 已完成)

**目标**: 确保所有前端页面可以正常运行

**已完成任务**:
1. ✅ 安装前端依赖 (`npm install`)
2. ✅ 启动开发服务器 (`npm run dev`) - 运行在 http://localhost:3000
3. ✅ 测试所有 7 个页面功能
4. ✅ 修复运行时错误 (组件导出、Mock数据)
5. ✅ 代码质量检查
6. ✅ 前端 API 层实现 (useApi, mock fallback)

**交付成果**:
- ✅ 7 个核心页面代码 (2,906 行)
- ✅ 14 个组件 (11 UI + 3 业务)
- ✅ 所有配置文件 (package.json, tsconfig.json 等)
- ✅ 设计系统集成
- ✅ API 客户端层 with 自动 Mock 降级
- ✅ Git 提交和推送

### Phase 2: 后端开发 (✅ 已完成)

**目标**: 实现所有后端微服务和数据库

**已完成任务**:
1. ✅ 设计 API 架构和数据库 schema
2. ✅ 实现 5 个微服务:
   - Knowledge Service (:8001) - 知识管理、产品信息、搜索
   - Content Service (:8002) - 内容生成
   - Support Service (:8003) - 客服支持
   - Analytics Service (:8004) - 数据分析
   - Auth Service (:8005) - 用户认证
3. ✅ 配置数据库 (PostgreSQL, MongoDB, Redis, Neo4j)
4. ✅ Docker Compose 编排
5. ✅ 数据库迁移和 ORM (SQLAlchemy)
6. ✅ API 文档生成 (FastAPI 自动生成)

**技术栈**:
- Python 3.11 + FastAPI
- PostgreSQL 16 (关系数据) - 端口 5433
- MongoDB 7 (文档数据) - 端口 27019
- Neo4j 5.15 (知识图谱) - 端口 7477/7690
- Redis 7 (缓存) - 端口 6383
- Docker + Docker Compose

**交付成果**:
- ✅ 5 个完整的 FastAPI 微服务
- ✅ 完整的数据库 schema 定义
- ✅ Docker 容器化配置
- ✅ API 健康检查端点
- ✅ CORS 配置和中间件

### Phase 3: 前后端集成 (✅ 已完成)

**目标**: 将前端连接到后端API，实现完整功能

**已完成任务**:
1. ✅ 前端 API 调用层实现 (`lib/api/`)
2. ✅ 数据流集成测试 (Knowledge, Analytics APIs)
3. ✅ 错误处理和 Mock 降级机制
4. ✅ 测试数据添加 (3个产品，5个知识条目)
5. ✅ 修复 Pydantic 序列化问题
6. ✅ 修复数据库 schema 兼容性

**交付成果**:
- ✅ API 客户端完整实现
- ✅ 自动 Mock 数据降级
- ✅ 测试数据种子脚本
- ✅ 所有 API 端点验证通过
- ✅ 前端成功展示后端数据

**解决的关键问题**:
- Docker 端口冲突 (重新分配端口)
- MongoDB 认证 (添加 authSource=admin)
- CORS 配置格式 (JSON 数组)
- API 307 重定向 (统一 trailing slashes)
- 数据库枚举大小写 (统一大写)
- Pydantic Optional 字段

### Phase 4: CI/CD & 部署 (✅ 已完成)

**目标**: 实现自动化部署和监控

**已完成任务**:
1. ✅ Docker 容器化 (所有服务)
2. ✅ Kubernetes 部署配置 (k8s/base/)
3. ✅ GitLab CI 完整流程 (.gitlab-ci-complete.yml)
4. ✅ Blue-Green 生产部署策略
5. ✅ 监控和日志系统配置 (Prometheus + Grafana)
6. ✅ 自动回滚机制

**交付成果**:
- ✅ 完整的 GitLab CI/CD pipeline (7个阶段)
- ✅ Kubernetes manifests (namespace, deployments, services)
- ✅ 完整部署文档 (CICD-DEPLOYMENT-GUIDE.md, 599行)
- ✅ 健康检查和监控配置
- ✅ Staging + Production 环境配置

**CI/CD 流程**:
1. **Lint** → 代码质量检查
2. **Test** → 单元测试 + 集成测试
3. **Build** → Docker 镜像构建
4. **Deploy Staging** → 部署到 staging 环境
5. **E2E Test** → 端到端测试
6. **Deploy Production** → Blue-Green 生产部署
7. **Monitor** → 健康检查 + 通知

### Phase 5: 优化与测试 (🔄 进行中 - 70% 完成)

**目标**: 性能优化、完整测试覆盖、响应式设计、生产就绪

**已完成任务** (2025-10-22):
1. ✅ **前端性能优化 - SWR 数据缓存**
   - ✅ 安装和配置 SWR 库（静态、实时、分析三种策略）
   - ✅ 创建自定义 Hooks（Knowledge、Analytics、Dashboard）
   - ✅ 重构 Knowledge 页面使用 SWR（缓存失效、乐观更新）
   - ✅ 重构 Dashboard 页面使用 SWR（Loading Skeleton）
   - ✅ 重构 Analytics 页面使用 SWR（批量刷新）

2. ✅ **测试框架 - Jest + React Testing Library**
   - ✅ 安装和配置 Jest（Next.js 集成、覆盖率阈值）
   - ✅ 配置 Jest 环境（jsdom、mocks）
   - ✅ 编写 Button 组件测试（49 tests, 100% 覆盖）
   - ✅ 编写 Card 组件测试（52 tests, 100% 覆盖）
   - ✅ 编写 Input 组件测试（44 tests, 100% 覆盖）
   - ✅ 编写 KnowledgeCard 业务组件测试（15 tests, 100% 覆盖）
   - ✅ 运行测试并验证覆盖率（160 个测试全部通过）

3. ✅ **E2E 测试 - Playwright**
   - ✅ Playwright 已预配置（多浏览器、多设备）
   - ✅ 创建 Homepage E2E 测试（8 个测试）
   - ✅ 创建 Dashboard E2E 测试（8 个测试）
   - ✅ 创建 Knowledge E2E 测试（10 个测试）
   - ✅ 创建 Responsive 响应式测试（114 个测试）
   - ✅ 性能预算验证（页面加载 < 3 秒）

4. ✅ **性能监控 - Web Vitals**
   - ✅ 安装 web-vitals 库
   - ✅ 创建 Web Vitals 监控模块（LCP、FID、CLS、FCP、TTFB、INP）
   - ✅ 集成到应用根布局
   - ✅ 开发环境控制台日志（带性能评级）
   - ✅ 生产环境自动上报分析端点

5. ✅ **响应式设计优化**
   - ✅ Dashboard 页面移动端优化（头部、按钮组、网格布局）
   - ✅ Knowledge 页面移动端优化（侧边栏折叠、搜索栏、过滤器）
   - ✅ 触摸目标优化（最小 44px，符合 WCAG 2.1）
   - ✅ 触摸反馈动画（active:scale 效果）
   - ✅ 响应式排版（移动端 text-2xl，桌面端 sm:text-3xl）
   - ✅ 响应式间距（移动端 px-4，平板端 sm:px-6）
   - ✅ Button 组件触摸优化（min-h-[44px]，touch-manipulation）
   - ✅ KnowledgeCard 菜单触摸优化（44x44px 触摸目标）

**测试覆盖总结**:
```
✅ 单元测试: 160 个测试全部通过
✅ E2E 测试: 140 个测试（Homepage、Dashboard、Knowledge、Responsive）
✅ 代码覆盖率: 核心组件 100%（Button、Card、Input、KnowledgeCard）
✅ 性能监控: Web Vitals 实时追踪
✅ 响应式测试: 101/114 通过 (88.6%)
```

**响应式设计覆盖**:
```
✅ 移动端 (< 640px): iPhone SE, iPhone 14 Pro Max
✅ 平板端 (640-1024px): iPad, iPad Air
✅ 桌面端 (> 1024px): Desktop, iPad Pro landscape
✅ 触摸目标: 最小 44x44px (WCAG 2.1 Level AAA)
✅ 测试浏览器: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari, Tablet Chrome
```

**待完成任务**:
1. ⏹️ 后端测试完善
   - API 集成测试
   - 负载测试
   - 数据库性能测试
2. ⏹️ 文档完善
   - API 使用文档
   - 部署运维手册
   - 用户使用指南
3. ⏹️ 安全加固
   - 依赖安全扫描
   - API 速率限制
   - 数据加密传输

## 开发日志

详细的开发进度和问题追踪请查看: `DEVELOPMENT-LOG.md`

## 自动化 CI/CD

项目已配置自动化流程:

### GitHub Actions
- **Figma Sync**: 自动同步设计系统
- **位置**: `.github/workflows/figma-sync.yml`
- **触发**: 手动触发 / 定时任务 (每天9:00 AM)

### GitLab CI
- **配置**: `.gitlab-ci.yml` + `.gitlab-ci-figma-sync.yml`
- **功能**: 同步、验证、测试、通知

### 安全管理
- Token 安全存储在 `.env` 文件
- 使用 `scripts/secure-git-push.sh` 安全推送
- 详见 `SECURITY-GUIDE.md`

## 下一步操作

**立即行动** (Phase 1):
```bash
cd frontend
npm install
npm run dev
```

**测试清单**:
1. 访问 http://localhost:3000
2. 测试所有页面链接和功能
3. 查看控制台错误日志
4. 修复发现的问题
5. 运行 `npm run lint` 和 `npm run type-check`

**完成 Phase 1 后**:
- 更新 `DEVELOPMENT-LOG.md`
- Git 提交和推送
- 开始 Phase 2 后端开发
