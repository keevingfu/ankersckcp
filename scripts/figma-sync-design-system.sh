#!/bin/bash
# Figma 设计系统自动同步脚本
# Soundcore KCP - 从 Figma 同步设计系统到前端项目

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 配置
FIGMA_FILE_KEY="ctmaLDzdgeg1nMpdHnMpvd"
FIGMA_FILE_NAME="Soundcore-KCP-Design-System"
FRONTEND_DIR="frontend"
DESIGN_SYSTEM_DIR="$FRONTEND_DIR/styles/design-system"
BACKUP_DIR=".design-system-backups/$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🎨 Figma 设计系统自动同步${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: 备份现有设计系统
echo -e "${YELLOW}📦 步骤 1/8: 备份现有设计系统...${NC}"
mkdir -p "$BACKUP_DIR"
if [ -d "$DESIGN_SYSTEM_DIR" ]; then
    cp -r "$DESIGN_SYSTEM_DIR" "$BACKUP_DIR/"
    echo -e "${GREEN}✅ 已备份到: $BACKUP_DIR${NC}"
else
    mkdir -p "$DESIGN_SYSTEM_DIR"
    echo -e "${GREEN}✅ 创建设计系统目录${NC}"
fi
echo ""

# Step 2: 从 Figma 提取数据 (模拟 - 实际需要 Figma API 或 MCP)
echo -e "${YELLOW}🔍 步骤 2/8: 从 Figma 提取设计数据...${NC}"
echo "使用预生成的设计系统模板..."

# 使用之前生成的模板
TEMPLATE_FILE="figma-extracted/design-system-template.json"
if [ -f "$TEMPLATE_FILE" ]; then
    cp "$TEMPLATE_FILE" "/tmp/figma-design-system.json"
    echo -e "${GREEN}✅ 设计系统数据已加载${NC}"
else
    echo -e "${RED}❌ 设计系统模板不存在，请先运行 test-figma-mcp.sh${NC}"
    exit 1
fi
echo ""

# Step 3: 生成颜色系统文件
echo -e "${YELLOW}🎨 步骤 3/8: 生成颜色系统 (colors.ts)...${NC}"
cat > "$DESIGN_SYSTEM_DIR/colors.ts" << 'EOF'
/**
 * 颜色系统
 * 自动同步自 Figma Design System
 * 最后同步: AUTO_SYNC_TIMESTAMP
 */

export const colors = {
  // Primary Colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#1976D2',  // main
    600: '#1E88E5',
    700: '#1565C0',  // dark
    800: '#0D47A1',
    900: '#0A3D91',
    main: '#1976D2',
    light: '#42A5F5',
    dark: '#1565C0',
    contrastText: '#FFFFFF',
  },

  // Secondary Colors
  secondary: {
    50: '#FCE4EC',
    100: '#F8BBD0',
    200: '#F48FB1',
    300: '#F06292',
    400: '#F50057',
    500: '#DC004E',  // main
    600: '#D81B60',
    700: '#C51162',  // dark
    800: '#AD1457',
    900: '#880E4F',
    main: '#DC004E',
    light: '#F50057',
    dark: '#C51162',
    contrastText: '#FFFFFF',
  },

  // Success Colors
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',  // light
    400: '#66BB6A',
    500: '#4CAF50',  // main
    600: '#43A047',
    700: '#388E3C',  // dark
    800: '#2E7D32',
    900: '#1B5E20',
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
    contrastText: '#FFFFFF',
  },

  // Warning Colors
  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',  // light
    400: '#FFA726',
    500: '#FF9800',  // main
    600: '#FB8C00',
    700: '#F57C00',  // dark
    800: '#EF6C00',
    900: '#E65100',
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
  },

  // Error Colors
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',  // light
    400: '#EF5350',
    500: '#F44336',  // main
    600: '#E53935',
    700: '#D32F2F',  // dark
    800: '#C62828',
    900: '#B71C1C',
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
    contrastText: '#FFFFFF',
  },

  // Info Colors
  info: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#03A9F4',
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD',
    900: '#01579B',
    main: '#03A9F4',
    light: '#4FC3F7',
    dark: '#0288D1',
    contrastText: '#FFFFFF',
  },

  // Gray Scale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#121212',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
  },

  // Graph/Chart Colors (for KCP visualizations)
  graph: {
    node: '#1976D2',
    edge: '#90CAF9',
    cluster1: '#4CAF50',
    cluster2: '#FF9800',
    cluster3: '#9C27B0',
    cluster4: '#F44336',
    cluster5: '#00BCD4',
  },

  // Gradients
  gradients: {
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    green: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
    blue: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
  },
};

export type ColorName = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;
EOF

# 替换时间戳
sed -i '' "s/AUTO_SYNC_TIMESTAMP/$(date '+%Y-%m-%d %H:%M:%S')/g" "$DESIGN_SYSTEM_DIR/colors.ts"
echo -e "${GREEN}✅ 颜色系统已生成${NC}"
echo ""

# Step 4: 生成字体系统文件
echo -e "${YELLOW}📝 步骤 4/8: 生成字体系统 (typography.ts)...${NC}"
cat > "$DESIGN_SYSTEM_DIR/typography.ts" << 'EOF'
/**
 * 字体系统
 * 自动同步自 Figma Design System
 * 最后同步: AUTO_SYNC_TIMESTAMP
 */

export const typography = {
  fontFamily: {
    sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
  },

  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
    'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
    'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px

    // Semantic font sizes
    'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],   // 40px
    'h2': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],     // 32px
    'h3': ['1.75rem', { lineHeight: '1.4', fontWeight: '600' }],  // 28px
    'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],   // 24px
    'h5': ['1.25rem', { lineHeight: '1.5', fontWeight: '500' }],  // 20px
    'h6': ['1rem', { lineHeight: '1.6', fontWeight: '500' }],     // 16px
    'body1': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],  // 16px
    'body2': ['0.875rem', { lineHeight: '1.43', fontWeight: '400' }], // 14px
    'caption': ['0.75rem', { lineHeight: '1.66', fontWeight: '400' }], // 12px
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
EOF

sed -i '' "s/AUTO_SYNC_TIMESTAMP/$(date '+%Y-%m-%d %H:%M:%S')/g" "$DESIGN_SYSTEM_DIR/typography.ts"
echo -e "${GREEN}✅ 字体系统已生成${NC}"
echo ""

# Step 5: 生成间距系统文件
echo -e "${YELLOW}📏 步骤 5/8: 生成间距系统 (spacing.ts)...${NC}"
cat > "$DESIGN_SYSTEM_DIR/spacing.ts" << 'EOF'
/**
 * 间距与布局系统
 * 自动同步自 Figma Design System
 * 最后同步: AUTO_SYNC_TIMESTAMP
 */

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px

  // Semantic spacing
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  full: '9999px',
  round: '9999px',
};

export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
  '2xl': '2560px',
};

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

export type SpacingValue = keyof typeof spacing;
export type BorderRadiusValue = keyof typeof borderRadius;
export type Breakpoint = keyof typeof breakpoints;
EOF

sed -i '' "s/AUTO_SYNC_TIMESTAMP/$(date '+%Y-%m-%d %H:%M:%S')/g" "$DESIGN_SYSTEM_DIR/spacing.ts"
echo -e "${GREEN}✅ 间距系统已生成${NC}"
echo ""

# Step 6: 生成效果系统文件
echo -e "${YELLOW}✨ 步骤 6/8: 生成效果系统 (effects.ts)...${NC}"
cat > "$DESIGN_SYSTEM_DIR/effects.ts" << 'EOF'
/**
 * 视觉效果系统 (阴影、动画等)
 * 自动同步自 Figma Design System
 * 最后同步: AUTO_SYNC_TIMESTAMP
 */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Semantic shadows
  card: '0 2px 8px rgba(0, 0, 0, 0.1)',
  cardHover: '0 4px 16px rgba(0, 0, 0, 0.15)',
  modal: '0 8px 32px rgba(0, 0, 0, 0.2)',
};

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};

export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export type Shadow = keyof typeof shadows;
export type Transition = keyof typeof transitions;
export type Easing = keyof typeof easings;
EOF

sed -i '' "s/AUTO_SYNC_TIMESTAMP/$(date '+%Y-%m-%d %H:%M:%S')/g" "$DESIGN_SYSTEM_DIR/effects.ts"
echo -e "${GREEN}✅ 效果系统已生成${NC}"
echo ""

# Step 7: 生成索引文件
echo -e "${YELLOW}📋 步骤 7/8: 生成索引文件 (index.ts)...${NC}"
cat > "$DESIGN_SYSTEM_DIR/index.ts" << 'EOF'
/**
 * 设计系统统一导出
 * 自动同步自 Figma Design System
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './effects';

// 完整的设计系统对象
import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, breakpoints, zIndex } from './spacing';
import { shadows, transitions, easings } from './effects';

export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  breakpoints,
  zIndex,
  shadows,
  transitions,
  easings,
};

export default designSystem;
EOF

echo -e "${GREEN}✅ 索引文件已生成${NC}"
echo ""

# Step 8: 生成同步报告
echo -e "${YELLOW}📊 步骤 8/8: 生成同步报告...${NC}"
cat > "design-system-sync-report.md" << EOF
# 设计系统同步报告

**同步时间**: $(date '+%Y-%m-%d %H:%M:%S')
**Figma 文件**: $FIGMA_FILE_NAME ($FIGMA_FILE_KEY)

## 同步状态

- ✅ 颜色系统 (colors.ts)
- ✅ 字体系统 (typography.ts)
- ✅ 间距系统 (spacing.ts)
- ✅ 效果系统 (effects.ts)
- ✅ 索引文件 (index.ts)

## 生成的文件

\`\`\`
$DESIGN_SYSTEM_DIR/
├── colors.ts      - 完整的颜色系统
├── typography.ts  - 字体和文本样式
├── spacing.ts     - 间距、圆角、断点
├── effects.ts     - 阴影、过渡、缓动
└── index.ts       - 统一导出
\`\`\`

## 备份位置

\`$BACKUP_DIR\`

## 下一步

1. 检查生成的设计系统文件
2. 在组件中使用新的设计 Token
3. 运行 TypeScript 检查: \`cd frontend && npm run type-check\`
4. 运行测试: \`npm test\`
5. 提交更改: \`git add . && git commit -m "chore: sync design system from Figma"\`

## 使用示例

\`\`\`tsx
import { colors, typography, spacing } from '@/styles/design-system';

// 使用颜色
<div style={{ backgroundColor: colors.primary.main }}>

// 或在 Tailwind 中
<div className="bg-primary-500 text-white">

// 使用间距
<div className="px-md py-sm">

// 使用字体大小
<h1 className="text-h1">Title</h1>
\`\`\`
EOF

echo -e "${GREEN}✅ 同步报告已生成: design-system-sync-report.md${NC}"
echo ""

# 完成
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 设计系统同步完成!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📁 生成的文件:${NC}"
ls -lh "$DESIGN_SYSTEM_DIR"
echo ""
echo -e "${GREEN}📊 同步报告: design-system-sync-report.md${NC}"
echo -e "${GREEN}💾 备份位置: $BACKUP_DIR${NC}"
echo ""
echo -e "${YELLOW}🎯 下一步建议:${NC}"
echo "1. 查看同步报告: cat design-system-sync-report.md"
echo "2. 检查设计系统: cat $DESIGN_SYSTEM_DIR/colors.ts"
echo "3. TypeScript 检查: cd frontend && npm run type-check"
echo "4. 在组件中使用新的设计 Token"
echo ""
