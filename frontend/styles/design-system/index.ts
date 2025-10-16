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
