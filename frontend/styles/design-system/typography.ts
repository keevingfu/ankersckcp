/**
 * 字体系统
 * 自动同步自 Figma Design System
 * 最后同步: 2025-10-16 01:33:35
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
