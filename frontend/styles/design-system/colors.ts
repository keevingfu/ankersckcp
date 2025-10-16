/**
 * 颜色系统
 * 自动同步自 Figma Design System
 * 最后同步: 2025-10-16 01:33:35
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
