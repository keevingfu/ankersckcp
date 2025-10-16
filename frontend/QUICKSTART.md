# KCP Frontend 快速启动指南

## 🚀 快速开始（5分钟）

### 步骤1：安装依赖

在项目根目录执行：

```bash
cd /Users/cavin/Desktop/dev/ankersckcp/frontend

# 使用 npm
npm install

# 或使用 pnpm (推荐，更快)
pnpm install

# 或使用 yarn
yarn install
```

### 步骤2：启动开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

### 步骤3：访问应用

打开浏览器访问：

```
http://localhost:3000/dashboard
```

你应该能看到完整的KCP仪表板页面！🎉

---

## 📋 必需的配置文件

在启动前，请确保创建以下配置文件：

### 1. package.json

```json
{
  "name": "kcp-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### 2. next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

### 3. postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🎯 可用的页面

### 1. Dashboard (仪表板)
```
http://localhost:3000/dashboard
```

**功能特性：**
- 4个关键指标卡片
- 趋势分析
- 最近活动
- Top知识内容
- 快速操作

### 2. Knowledge Base (知识库)
```
http://localhost:3000/knowledge
```

**功能特性：**
- 知识搜索
- 分类筛选
- 状态筛选
- 网格/列表视图
- 添加知识

### 3. 其他页面 (开发中)
```
http://localhost:3000/graph      # 知识图谱
http://localhost:3000/generator  # 内容生成器
http://localhost:3000/chat       # 智能客服
http://localhost:3000/analytics  # 数据分析
```

---

## 🎨 组件使用示例

### Button组件

```tsx
import Button from '@/components/ui/Button';

// 主按钮
<Button variant="primary" size="medium">
  确认
</Button>

// 带加载状态
<Button variant="primary" loading={true}>
  提交中...
</Button>

// 带图标
<Button variant="primary">
  <PlusIcon />
  添加知识
</Button>
```

### Input组件

```tsx
import Input from '@/components/ui/Input';

// 基础输入框
<Input
  label="标题"
  placeholder="请输入标题"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// 搜索框
<Input
  variant="search"
  placeholder="搜索..."
  clearable
/>

// 密码输入
<Input
  variant="password"
  label="密码"
  helperText="至少8位字符"
/>
```

### Card组件

```tsx
import Card, { StatCard } from '@/components/ui/Card';

// 基础卡片
<Card variant="hoverable">
  <h3>标题</h3>
  <p>内容</p>
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
import Modal from '@/components/ui/Modal';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="编辑知识"
  footer={
    <div className="flex space-x-2">
      <Button variant="outline" onClick={handleCancel}>
        取消
      </Button>
      <Button variant="primary" onClick={handleSave}>
        保存
      </Button>
    </div>
  }
>
  <p>模态框内容</p>
</Modal>
```

---

## 🛠️ 常见问题解决

### Q: 端口3000已被占用
```bash
# 使用其他端口
PORT=3001 npm run dev
```

### Q: 找不到模块
```bash
# 重新安装依赖
rm -rf node_modules
npm install
```

### Q: TypeScript错误
```bash
# 运行类型检查
npm run type-check

# 修复后重启开发服务器
```

### Q: 样式不生效
```bash
# 确保Tailwind配置正确
# 检查 tailwind.config.ts 和 globals.css
```

---

## 📱 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

---

## 🐛 调试技巧

### 1. React DevTools
安装Chrome扩展：[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)

### 2. 查看组件状态
```tsx
// 在组件中添加
console.log('Component state:', state);
```

### 3. 检查网络请求
打开Chrome DevTools → Network标签

### 4. 性能分析
打开Chrome DevTools → Performance标签

---

## 📚 学习资源

### Next.js
- [官方文档](https://nextjs.org/docs)
- [学习课程](https://nextjs.org/learn)

### React
- [官方文档](https://react.dev)
- [Hooks指南](https://react.dev/reference/react)

### Tailwind CSS
- [官方文档](https://tailwindcss.com/docs)
- [Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)

### TypeScript
- [官方文档](https://www.typescriptlang.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🤝 开发流程

### 1. 创建新组件

```bash
# 在 components/ui/ 创建新组件
touch components/ui/NewComponent.tsx
```

```tsx
// 组件模板
import React from 'react';

export interface NewComponentProps {
  // 定义Props类型
}

const NewComponent: React.FC<NewComponentProps> = (props) => {
  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
};

export default NewComponent;
```

### 2. 创建新页面

```bash
# 在 app/ 创建新页面
mkdir app/new-page
touch app/new-page/page.tsx
```

```tsx
// 页面模板
'use client';

import React from 'react';
import MainLayout from '@/components/ui/MainLayout';

const NewPage: React.FC = () => {
  return (
    <MainLayout>
      {/* 页面内容 */}
    </MainLayout>
  );
};

export default NewPage;
```

### 3. 使用设计系统

```tsx
import { colors, typography, spacing } from '@/styles/design-system';

// 使用Token
const styles = {
  color: colors.primary[500],
  fontSize: typography.fontSize.lg,
  padding: spacing[4],
};
```

---

## 🎁 项目特色

✨ **完整的设计系统** - 基于Figma设计100%实现
🚀 **现代技术栈** - Next.js 14 + TypeScript + Tailwind
📱 **响应式设计** - 支持桌面、平板、移动端
🎨 **精美UI** - 科技紫罗兰主题
⚡ **高性能** - 优化的加载速度
♿ **无障碍** - 符合WCAG标准
📖 **完整文档** - 详细的使用说明

---

## 💡 下一步建议

1. **熟悉项目结构**
   - 浏览所有组件
   - 查看设计系统Token
   - 理解文件组织

2. **尝试修改**
   - 调整颜色主题
   - 修改文本内容
   - 添加新功能

3. **开发新页面**
   - 参考现有页面
   - 使用现有组件
   - 遵循设计规范

4. **集成后端**
   - 配置API客户端
   - 实现数据获取
   - 添加错误处理

---

## 📞 获取帮助

遇到问题？

1. 查看 [README.md](./README.md)
2. 查看 [PROJECT_SETUP.md](./PROJECT_SETUP.md)
3. 查看 [DEVELOPMENT_SUMMARY.md](./DEVELOPMENT_SUMMARY.md)
4. 查看设计规范文档
5. 联系开发团队

---

**祝你开发愉快！🎉**

---

**最后更新**: 2024-10-15  
**版本**: v1.0.0
