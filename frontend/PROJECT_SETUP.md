# KCP Frontend 项目配置指南

## 📦 package.json 配置

创建或更新 `package.json` 文件，包含以下配置：

```json
{
  "name": "kcp-frontend",
  "version": "1.0.0",
  "description": "Soundcore Knowledge Control Plane Frontend Application",
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
    "typescript": "^5.2.2"
  }
}
```

## ⚙️ tsconfig.json 配置

创建或更新 `tsconfig.json` 文件，配置路径别名：

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
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/styles/*": ["./styles/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## 🎨 PostCSS 配置

创建 `postcss.config.js` 文件：

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 📝 Next.js 配置

创建或更新 `next.config.js` 文件：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      // 添加您的图片域名
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },
  // 实验性特性
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components'],
  },
}

module.exports = nextConfig
```

## 🔧 ESLint 配置 (可选)

创建 `.eslintrc.json` 文件：

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }]
  }
}
```

## 📁 环境变量配置

创建 `.env.local` 文件：

```env
# API配置
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# 功能开关
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false

# 第三方服务
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## 📋 Git 配置

创建 `.gitignore` 文件（如果还没有）：

```gitignore
# 依赖
node_modules/
.pnp
.pnp.js

# 测试
coverage/

# Next.js
.next/
out/
build/
dist/

# 调试
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# 环境变量
.env*.local
.env.production

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm (推荐)
pnpm install

# 或使用 yarn
yarn install
```

### 2. 运行开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

访问 http://localhost:3000 查看应用

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 📚 项目结构说明

### 路径别名
- `@/components` → `./components`
- `@/styles` → `./styles`
- `@/lib` → `./lib`
- `@/app` → `./app`

### 使用示例

```tsx
// ✅ 推荐：使用路径别名
import Button from '@/components/ui/Button';
import { colors } from '@/styles/design-system';
import Dashboard from '@/app/dashboard/page';

// ❌ 不推荐：使用相对路径
import Button from '../../components/ui/Button';
```

## 🎯 开发建议

### 1. 组件开发
- 所有组件使用 TypeScript
- 导出组件类型定义
- 添加必要的注释和文档
- 遵循设计系统规范

### 2. 样式开发
- 优先使用 Tailwind CSS
- 复杂样式使用组件级 CSS Module
- 避免内联样式（除非必要）

### 3. 性能优化
- 使用 Next.js Image 组件
- 实现代码分割和懒加载
- 优化包大小

### 4. 代码质量
- 运行类型检查：`npm run type-check`
- 运行 Lint：`npm run lint`
- 定期更新依赖

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [React 文档](https://react.dev)

## ❓ 常见问题

### Q: 如何添加新的设计系统 Token？
A: 在 `styles/design-system/` 目录下对应文件中添加，然后在 Tailwind 配置中引用。

### Q: 如何创建新的页面？
A: 在 `app/` 目录下创建新文件夹，添加 `page.tsx` 文件。

### Q: 如何优化首屏加载？
A: 使用 Next.js 的动态导入和代码分割功能。

## 📞 技术支持

如有问题，请联系开发团队或查阅项目文档。
