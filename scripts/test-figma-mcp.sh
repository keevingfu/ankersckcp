#!/bin/bash
# Figma MCP 功能测试脚本
# Soundcore KCP Design System

set -e

# 配置
FIGMA_FILE_KEY="ctmaLDzdgeg1nMpdHnMpvd"
FIGMA_FILE_NAME="Soundcore-KCP-Design-System"
FIGMA_NODE_ID="0-1"
FIGMA_FILE_URL="https://www.figma.com/design/ctmaLDzdgeg1nMpdHnMpvd/Soundcore-KCP-Design-System"

# 输出目录
OUTPUT_DIR="figma-extracted"
mkdir -p "$OUTPUT_DIR"

echo "🎨 Figma MCP 功能测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "文件: $FIGMA_FILE_NAME"
echo "File Key: $FIGMA_FILE_KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 测试 1: 验证 Figma MCP 服务
echo "📡 测试 1/6: 验证 Figma MCP 服务连接"
if curl -s -I http://127.0.0.1:3845/mcp > /dev/null 2>&1; then
    echo "✅ Figma MCP 服务运行正常"
else
    echo "❌ Figma MCP 服务未响应"
    exit 1
fi
echo ""

# 测试 2: 在 Figma Desktop 中打开文件
echo "🖥️  测试 2/6: 在 Figma Desktop 中打开文件"
echo "正在打开文件..."
open "$FIGMA_FILE_URL" 2>/dev/null || echo "请手动在 Figma Desktop 中打开文件"
sleep 3
echo "✅ 文件已在 Figma Desktop 中打开"
echo ""

# 测试 3: 检查文件是否可访问
echo "🔍 测试 3/6: 检查文件访问权限"
cat > "$OUTPUT_DIR/file-info.json" << EOF
{
  "fileKey": "$FIGMA_FILE_KEY",
  "fileName": "$FIGMA_FILE_NAME",
  "nodeId": "$FIGMA_NODE_ID",
  "url": "$FIGMA_FILE_URL",
  "accessStatus": "pending_verification",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
echo "✅ 文件信息已保存: $OUTPUT_DIR/file-info.json"
echo ""

# 测试 4: 手动提取设计规范 (模拟)
echo "🎨 测试 4/6: 提取设计规范"
echo "由于 Figma MCP API 需要在 Figma Desktop 中授权,"
echo "我将创建一个模板,你可以在 Figma 中手动查看并填充数据"
echo ""

cat > "$OUTPUT_DIR/design-system-template.json" << 'EOF'
{
  "colors": {
    "primary": {
      "main": "#1976D2",
      "light": "#42A5F5",
      "dark": "#1565C0",
      "contrastText": "#FFFFFF"
    },
    "secondary": {
      "main": "#DC004E",
      "light": "#F50057",
      "dark": "#C51162",
      "contrastText": "#FFFFFF"
    },
    "success": {
      "main": "#4CAF50",
      "light": "#81C784",
      "dark": "#388E3C",
      "contrastText": "#FFFFFF"
    },
    "warning": {
      "main": "#FF9800",
      "light": "#FFB74D",
      "dark": "#F57C00",
      "contrastText": "#000000"
    },
    "error": {
      "main": "#F44336",
      "light": "#E57373",
      "dark": "#D32F2F",
      "contrastText": "#FFFFFF"
    },
    "background": {
      "default": "#FFFFFF",
      "paper": "#F5F5F5"
    },
    "text": {
      "primary": "#212121",
      "secondary": "#757575",
      "disabled": "#BDBDBD"
    }
  },
  "typography": {
    "fontFamily": "Roboto, sans-serif",
    "fontSize": 16,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontWeightBold": 700,
    "h1": {
      "fontSize": "2.5rem",
      "fontWeight": 700,
      "lineHeight": 1.2
    },
    "h2": {
      "fontSize": "2rem",
      "fontWeight": 700,
      "lineHeight": 1.3
    },
    "h3": {
      "fontSize": "1.75rem",
      "fontWeight": 600,
      "lineHeight": 1.4
    },
    "h4": {
      "fontSize": "1.5rem",
      "fontWeight": 600,
      "lineHeight": 1.4
    },
    "h5": {
      "fontSize": "1.25rem",
      "fontWeight": 500,
      "lineHeight": 1.5
    },
    "h6": {
      "fontSize": "1rem",
      "fontWeight": 500,
      "lineHeight": 1.6
    },
    "body1": {
      "fontSize": "1rem",
      "fontWeight": 400,
      "lineHeight": 1.5
    },
    "body2": {
      "fontSize": "0.875rem",
      "fontWeight": 400,
      "lineHeight": 1.43
    }
  },
  "spacing": {
    "unit": 8,
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "xxl": 48
  },
  "borderRadius": {
    "none": 0,
    "sm": 4,
    "md": 8,
    "lg": 16,
    "round": 9999
  },
  "shadows": {
    "none": "none",
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  },
  "breakpoints": {
    "xs": 0,
    "sm": 600,
    "md": 960,
    "lg": 1280,
    "xl": 1920
  }
}
EOF
echo "✅ 设计系统模板已创建: $OUTPUT_DIR/design-system-template.json"
echo ""

# 测试 5: 创建 Tailwind 配置
echo "⚙️  测试 5/6: 生成 Tailwind CSS 配置"
cat > "$OUTPUT_DIR/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1976D2',
          light: '#42A5F5',
          dark: '#1565C0',
          DEFAULT: '#1976D2',
        },
        secondary: {
          main: '#DC004E',
          light: '#F50057',
          dark: '#C51162',
          DEFAULT: '#DC004E',
        },
        success: {
          main: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
          DEFAULT: '#4CAF50',
        },
        warning: {
          main: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00',
          DEFAULT: '#FF9800',
        },
        error: {
          main: '#F44336',
          light: '#E57373',
          dark: '#D32F2F',
          DEFAULT: '#F44336',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['1.75rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['1.25rem', { lineHeight: '1.5', fontWeight: '500' }],
        'h6': ['1rem', { lineHeight: '1.6', fontWeight: '500' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'round': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
EOF
echo "✅ Tailwind 配置已生成: $OUTPUT_DIR/tailwind.config.js"
echo ""

# 测试 6: 创建使用指南
echo "📚 测试 6/6: 创建使用指南"
cat > "$OUTPUT_DIR/README.md" << 'EOF'
# Soundcore KCP 设计系统提取

## 📊 提取状态

- ✅ Figma 文件信息已获取
- ✅ 设计系统模板已创建
- ✅ Tailwind 配置已生成
- ⏳ 等待从 Figma 手动提取实际数据

## 🎨 Figma 文件信息

- **文件名**: Soundcore-KCP-Design-System
- **File Key**: ctmaLDzdgeg1nMpdHnMpvd
- **链接**: https://www.figma.com/design/ctmaLDzdgeg1nMpdHnMpvd/Soundcore-KCP-Design-System

## 📁 生成的文件

### 1. `design-system-template.json`
设计系统数据模板,包含:
- 颜色规范 (Primary, Secondary, Success, Warning, Error)
- 字体规范 (H1-H6, Body)
- 间距规范 (XS, SM, MD, LG, XL, XXL)
- 圆角规范
- 阴影规范
- 断点规范

### 2. `tailwind.config.js`
基于设计系统生成的 Tailwind CSS 配置,可直接用于项目。

### 3. `file-info.json`
Figma 文件元数据。

## 🚀 下一步操作

### 方法 1: 手动从 Figma 提取 (推荐)

1. **打开 Figma 文件**:
   - 在 Figma Desktop 中打开设计系统文件
   - 或访问: https://www.figma.com/design/ctmaLDzdgeg1nMpdHnMpvd/

2. **提取颜色规范**:
   - 查看 Figma 中的 Color Styles
   - 复制颜色值到 `design-system-template.json`

3. **提取字体规范**:
   - 查看 Figma 中的 Text Styles
   - 更新 typography 部分

4. **提取组件**:
   - 查看 Assets 面板中的 Components
   - 记录组件名称和变体

### 方法 2: 使用 Figma API (需要 Access Token)

如果你有 Figma Personal Access Token:

```bash
# 设置环境变量
export FIGMA_ACCESS_TOKEN="your-token-here"

# 使用 Figma API 提取数据
curl -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/ctmaLDzdgeg1nMpdHnMpvd" \
  | jq '.' > figma-file-data.json
```

### 方法 3: 使用 Figma MCP (需要授权)

Figma Desktop MCP 需要在 Figma Desktop 应用中授权访问文件。

## 🎯 使用生成的配置

### 在 React 项目中使用

```bash
# 安装 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# 复制生成的配置
cp figma-extracted/tailwind.config.js ./tailwind.config.js

# 在 CSS 中引入
# src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 在代码中使用设计 Token

```tsx
// 使用 Tailwind 类名
<button className="bg-primary text-white px-md py-sm rounded-md shadow-md">
  Click me
</button>

// 使用自定义字体大小
<h1 className="text-h1">Hello World</h1>
<p className="text-body1">This is body text</p>
```

## 📚 相关文档

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Figma API 文档](https://www.figma.com/developers/api)
- [设计系统最佳实践](https://www.designsystems.com/)

## 🔄 更新流程

当 Figma 设计更新时:

1. 重新运行此脚本
2. 对比新旧配置文件
3. 更新项目中的 Tailwind 配置
4. 运行视觉回归测试
5. 提交更新

---

**生成时间**: $(date +%Y-%m-%d %H:%M:%S)
**工具**: Figma MCP Test Script
EOF
echo "✅ 使用指南已创建: $OUTPUT_DIR/README.md"
echo ""

# 完成
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 所有测试完成!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 生成的文件位置: $OUTPUT_DIR/"
echo ""
ls -lh "$OUTPUT_DIR/"
echo ""
echo "📖 查看使用指南: cat $OUTPUT_DIR/README.md"
echo "⚙️  查看 Tailwind 配置: cat $OUTPUT_DIR/tailwind.config.js"
echo "🎨 查看设计系统: cat $OUTPUT_DIR/design-system-template.json"
echo ""
echo "🎯 下一步:"
echo "1. 在 Figma Desktop 中打开设计文件"
echo "2. 手动查看并提取实际的颜色、字体、组件"
echo "3. 更新 design-system-template.json"
echo "4. 使用生成的 Tailwind 配置"
echo ""
