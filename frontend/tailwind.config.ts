/**
 * Tailwind CSS Configuration
 * 基于KCP设计系统的配置
 */

import type { Config } from 'tailwindcss';
import { colors } from './styles/design-system/colors';
import { typography } from './styles/design-system/typography';
import { spacing, borderRadius, breakpoints } from './styles/design-system/spacing';
import { shadows } from './styles/design-system/effects';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        gray: colors.gray,
        graph: colors.graph,
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
        mono: typography.fontFamily.mono,
      },
      // @ts-expect-error - Tailwind fontSize type is too strict for our design system
      fontSize: {
        ...typography.fontSize,
      },
      fontWeight: {
        ...typography.fontWeight,
      },
      lineHeight: {
        ...typography.lineHeight,
      },
      spacing: {
        ...spacing,
      },
      borderRadius: {
        ...borderRadius,
      },
      boxShadow: {
        ...shadows,
      },
      screens: {
        ...breakpoints,
      },
      backgroundImage: {
        'gradient-purple': colors.gradients.purple,
        'gradient-green': colors.gradients.green,
        'gradient-blue': colors.gradients.blue,
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
