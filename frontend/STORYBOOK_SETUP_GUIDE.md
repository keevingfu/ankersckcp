# 📚 Storybook Component Documentation Guide
# Storybook 组件文档配置指南

**版本**: 1.0.0
**更新日期**: 2025-10-22

---

## 📋 目录

1. [Storybook 简介](#storybook-简介)
2. [安装与配置](#安装与配置)
3. [编写 Stories](#编写-stories)
4. [构建与部署](#构建与部署)
5. [最佳实践](#最佳实践)

---

## 1. Storybook 简介

### 1.1 什么是 Storybook

Storybook 是一个开源的 UI 组件开发和文档工具，用于：
- 📖 **组件文档化**: 展示组件的各种状态和用法
- 🧪 **独立开发**: 在隔离环境中开发组件
- ♻️ **组件复用**: 构建可复用的组件库
- 🎨 **设计系统**: 维护统一的设计规范

### 1.2 Soundcore KCP 使用场景

由于前端组件相对简洁，Storybook 主要用于：
- Dashboard 仪表板组件
- 数据可视化图表
- 表单和输入组件
- 通用 UI 组件

---

## 2. 安装与配置

### 2.1 安装 Storybook

```bash
cd frontend

# 自动安装（推荐）
npx storybook@latest init

# 手动安装
npm install --save-dev @storybook/react @storybook/react-vite @storybook/addon-essentials
```

### 2.2 配置文件

**创建**: `.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',  // 可访问性测试
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    // 添加路径别名
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': path.resolve(__dirname, '../src'),
      },
    };
    return config;
  },
};

export default config;
```

**创建**: `.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
import '../src/app/globals.css';  // 导入全局样式

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
};

export default preview;
```

---

## 3. 编写 Stories

### 3.1 Story 示例

**创建**: `src/components/Button/Button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 主要按钮
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// 次要按钮
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// 轮廓按钮
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

// 大尺寸
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

// 交互示例
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </>
    ),
  },
};
```

### 3.2 Dashboard 卡片组件示例

**创建**: `src/components/DashboardCard/DashboardCard.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { DashboardCard } from './DashboardCard';

const meta = {
  title: 'Dashboard/DashboardCard',
  component: DashboardCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KnowledgeItemsCard: Story = {
  args: {
    title: 'Knowledge Items',
    value: '1,234',
    change: '+12.5%',
    changeType: 'positive',
    icon: 'knowledge',
  },
};

export const ContentGeneratedCard: Story = {
  args: {
    title: 'Content Generated',
    value: '456',
    change: '+8.3%',
    changeType: 'positive',
    icon: 'content',
  },
};

export const SupportConversationsCard: Story = {
  args: {
    title: 'Support Conversations',
    value: '789',
    change: '-3.2%',
    changeType: 'negative',
    icon: 'support',
  },
};
```

### 3.3 表单组件示例

**创建**: `src/components/SearchBar/SearchBar.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    onSearch: { action: 'searched' },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search knowledge items...',
    onSearch: fn(),
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'bluetooth headphones',
    placeholder: 'Search...',
    onSearch: fn(),
  },
};
```

---

## 4. 构建与部署

### 4.1 本地运行

```bash
# 启动 Storybook 开发服务器
npm run storybook

# 访问
# http://localhost:6006
```

### 4.2 构建静态站点

```bash
# 构建 Storybook 静态文件
npm run build-storybook

# 输出目录: storybook-static/
```

### 4.3 部署到 GitHub Pages

**添加脚本**: `package.json`

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "deploy-storybook": "npm run build-storybook && npx http-server storybook-static"
  }
}
```

**GitHub Actions 自动部署**:

```yaml
# .github/workflows/storybook.yml
name: Deploy Storybook

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build-storybook
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./storybook-static
```

---

## 5. 最佳实践

### 5.1 Story 命名规范

```typescript
// ✅ 好的命名
export const Primary: Story = { ... };
export const WithIcon: Story = { ... };
export const LoadingState: Story = { ... };

// ❌ 避免的命名
export const story1: Story = { ... };
export const test: Story = { ... };
```

### 5.2 组织结构

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx    # Story 文件
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── DashboardCard/
│   │   ├── DashboardCard.tsx
│   │   ├── DashboardCard.stories.tsx
│   │   └── index.ts
│   └── SearchBar/
│       ├── SearchBar.tsx
│       ├── SearchBar.stories.tsx
│       └── index.ts
└── stories/
    ├── Introduction.mdx
    └── DesignTokens.mdx
```

### 5.3 使用 Controls

```typescript
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    // 文本输入
    label: { control: 'text' },

    // 选择器
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
    },

    // 范围滑块
    size: {
      control: { type: 'range', min: 12, max: 24, step: 2 },
    },

    // 布尔值
    disabled: { control: 'boolean' },

    // 颜色选择器
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>;
```

### 5.4 交互测试

```typescript
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export const ClickTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // 模拟点击
    await userEvent.click(button);

    // 验证结果
    await expect(button).toHaveTextContent('Clicked');
  },
};
```

---

## 6. 常用 Addons

### 6.1 可访问性测试

```bash
npm install --save-dev @storybook/addon-a11y
```

```typescript
// .storybook/main.ts
export default {
  addons: ['@storybook/addon-a11y'],
};
```

### 6.2 响应式视图

```bash
npm install --save-dev @storybook/addon-viewport
```

```typescript
// .storybook/preview.ts
export const parameters = {
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: { width: '375px', height: '667px' },
      },
      tablet: {
        name: 'Tablet',
        styles: { width: '768px', height: '1024px' },
      },
      desktop: {
        name: 'Desktop',
        styles: { width: '1920px', height: '1080px' },
      },
    },
  },
};
```

---

## 7. 完整示例

**创建**: `src/components/KnowledgeCard/KnowledgeCard.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { KnowledgeCard } from './KnowledgeCard';

const meta = {
  title: 'Knowledge/KnowledgeCard',
  component: KnowledgeCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '知识库卡片组件，用于展示知识条目摘要。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['FAQ', 'GUIDE', 'ARTICLE'],
      description: '知识类型',
    },
    qualityScore: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '质量评分（0-100）',
    },
  },
} satisfies Meta<typeof KnowledgeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 默认展示
export const Default: Story = {
  args: {
    id: '123',
    title: 'How to connect Bluetooth headphones',
    content: 'Step-by-step guide to connecting your Bluetooth headphones...',
    type: 'FAQ',
    language: 'EN',
    qualityScore: 95.5,
    tags: ['bluetooth', 'connectivity', 'troubleshooting'],
    createdAt: '2025-10-22T10:30:00Z',
  },
};

// 低质量内容
export const LowQuality: Story = {
  args: {
    ...Default.args,
    qualityScore: 45.2,
  },
};

// 多语言
export const Chinese: Story = {
  args: {
    id: '124',
    title: '如何连接蓝牙耳机',
    content: '蓝牙耳机连接的详细步骤...',
    type: 'GUIDE',
    language: 'CN',
    qualityScore: 88.3,
    tags: ['蓝牙', '连接', '故障排除'],
    createdAt: '2025-10-22T11:00:00Z',
  },
};

// 长内容
export const LongContent: Story = {
  args: {
    ...Default.args,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20),
  },
};
```

---

## 8. 快速参考

### 常用命令

```bash
# 启动 Storybook
npm run storybook

# 构建静态站点
npm run build-storybook

# 运行交互测试
npm run test-storybook
```

### 文件结构

```
.storybook/
  ├── main.ts           # Storybook 主配置
  ├── preview.ts        # 预览配置（全局装饰器、参数）
  └── manager.ts        # UI 定制

src/components/
  └── Button/
      ├── Button.tsx
      ├── Button.stories.tsx
      └── Button.test.tsx

storybook-static/      # 构建输出目录
```

---

**文档版本**: 1.0.0
**维护团队**: Soundcore KCP Frontend Team
**下次审查**: 2025-11-22

**Storybook 官方文档**: https://storybook.js.org/docs/react/get-started/introduction
