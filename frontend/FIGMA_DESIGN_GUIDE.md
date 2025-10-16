# Soundcore KCP Design System - Figma Implementation Guide

## 📋 Overview
This guide helps you implement the KCP (Knowledge Control Plane) design system in Figma.

## 🎨 Design System Setup

### Step 1: Create Color Styles

**Primary Colors:**
- Primary/50: #f3f1ff (Background)
- Primary/100: #ebe5ff (Secondary BG)
- Primary/500: #667eea (Main Purple - Primary actions)
- Primary/600: #5a67d8 (Hover state)
- Primary/700: #4c51bf (Active state)
- Primary/900: #3730a3 (Text contrast)

**Functional Colors:**
- Success/500: #10b981 (Positive actions)
- Warning/500: #f59e0b (Caution states)
- Error/500: #ef4444 (Danger actions)
- Info/500: #3b82f6 (Information)

**Gray Scale:**
- Gray/50: #f9fafb (Lightest background)
- Gray/100: #f3f4f6 (Card background)
- Gray/200: #e5e7eb (Borders, dividers)
- Gray/500: #6b7280 (Secondary text)
- Gray/700: #374151 (Primary text)
- Gray/900: #111827 (Headings)

### Step 2: Create Text Styles

**Font Family:** Inter (install from Google Fonts)

**Headings:**
- H1/Display: 36px, Bold (700)
- H2/Large: 30px, Bold (700)
- H3/Medium: 24px, Semibold (600)
- H4/Small: 20px, Semibold (600)

**Body:**
- Body/Large: 18px, Regular (400)
- Body/Base: 16px, Regular (400)
- Body/Small: 14px, Regular (400)
- Caption: 12px, Regular (400)

**Line Height:** 1.5 for body text, 1.25 for headings

### Step 3: Create Effect Styles (Shadows)

**Elevation Levels:**
- Shadow/SM: 0 1px 2px rgba(0,0,0,0.05)
- Shadow/MD: 0 4px 6px -1px rgba(0,0,0,0.1)
- Shadow/LG: 0 10px 15px -3px rgba(0,0,0,0.1)
- Shadow/XL: 0 20px 25px -5px rgba(0,0,0,0.1)
- Shadow/Glow: 0 0 20px rgba(102,126,234,0.4) (for emphasis)

### Step 4: Create Grid System

**Layout Grid:** 8-point grid
- Columns: 12 (Desktop), 8 (Tablet), 4 (Mobile)
- Gutter: 24px
- Margin: 40px (Desktop), 24px (Tablet), 16px (Mobile)

## 📐 Component Creation

### Button Component

**Variants:**
- Primary: Purple gradient background, white text
- Secondary: Light purple background, purple text
- Outline: Transparent background, purple border
- Ghost: Transparent background, purple text on hover

**Sizes:**
- Small: 28px height, 12px padding, 14px text
- Medium: 36px height, 16px padding, 16px text
- Large: 44px height, 20px padding, 18px text

**States:**
- Default
- Hover (background 10% darker, lift shadow)
- Active (background 20% darker)
- Disabled (50% opacity)
- Loading (spinner animation)

**Radius:** 8px (medium), 6px (small), 10px (large)

### Input Component

**Variants:**
- Text input
- Password input (with show/hide toggle)
- Search input (with search icon)
- Textarea

**Sizes:**
- Small: 32px height
- Medium: 40px height
- Large: 48px height

**States:**
- Default: Gray border
- Focus: Purple border + ring
- Error: Red border + error message
- Success: Green border + checkmark
- Disabled: Gray background

**Features:**
- Prefix icon (left)
- Suffix icon (right)
- Clear button
- Character counter

### Card Component

**Base Properties:**
- Background: White
- Border Radius: 12px
- Shadow: Medium (default)
- Padding: 24px

**Variants:**
- Basic card
- Hoverable card (lift on hover)
- Bordered card
- Interactive card (clickable)

**Anatomy:**
- Header (optional icon + title + actions)
- Body (main content)
- Footer (optional metadata + buttons)

## 📱 Page Templates

### Dashboard Layout

**Structure:**
```
┌─────────────────────────────────────────┐
│ Header (64px)                           │
├───────┬─────────────────────────────────┤
│       │ Stats Grid (4 columns)          │
│ Side  ├─────────────────────────────────┤
│ bar   │ Chart Area                      │
│ 280px │                                 │
│       ├─────────────────────────────────┤
│       │ Recent Items (3 columns)        │
└───────┴─────────────────────────────────┘
```

**Spacing:**
- Between sections: 32px
- Between cards: 24px
- Card internal padding: 24px

### Knowledge Base Page

**Structure:**
```
┌─────────────────────────────────────────┐
│ Page Header + Actions                   │
├─────────────────────────────────────────┤
│ [Search Bar] [Filters] [Sort]          │
├─────────────────────────────────────────┤
│ Knowledge Cards Grid (3 columns)        │
│ ┌────┐ ┌────┐ ┌────┐                  │
│ │    │ │    │ │    │                  │
│ └────┘ └────┘ └────┘                  │
└─────────────────────────────────────────┘
```

## 🎯 Design Tokens for Export

### Tailwind Config Format:
```javascript
colors: {
  primary: {
    50: '#f3f1ff',
    500: '#667eea',
    600: '#5a67d8',
  },
  // ... more colors
}

fontSize: {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  // ... more sizes
}

spacing: {
  1: '4px',
  2: '8px',
  4: '16px',
  // ... more spacing
}
```

## 📊 Icons

**Icon Set:** Lucide Icons or Heroicons
**Size:** 20x20px standard, 16x16px small, 24x24px large
**Stroke Width:** 2px
**Style:** Outline (line-based)

**Common Icons:**
- Home: house
- Knowledge: book-open
- Search: magnifying-glass
- User: user-circle
- Settings: cog
- Plus: plus
- Edit: pencil
- Delete: trash
- Check: check
- Close: x-mark

## 🌐 Responsive Breakpoints

**Desktop:** 1440px (default)
**Laptop:** 1024px
**Tablet:** 768px
**Mobile:** 375px

**Layout Changes:**
- Sidebar collapses to hamburger on mobile
- Grid columns reduce: 4 → 3 → 2 → 1
- Font sizes scale down 10% on mobile

## ✅ Pre-flight Checklist

Before exporting designs:
- [ ] All colors use design tokens
- [ ] All text uses text styles
- [ ] All shadows use effect styles
- [ ] Components have all states (default, hover, active, disabled)
- [ ] Spacing follows 8-point grid
- [ ] All icons are 20x20px
- [ ] Mobile variants are created
- [ ] Prototypes are linked
- [ ] Design is annotated for developers

## 🚀 Export Settings

**For Development:**
- Enable Dev Mode
- Add code snippets (CSS/Tailwind)
- Mark all components as "Ready for development"
- Export icons as SVG
- Export images as PNG @2x

**File Organization:**
```
📁 KCP Design System
├─ 📄 Cover & Documentation
├─ 📄 Design Tokens (Colors, Typography, Spacing)
├─ 📄 Components (Buttons, Inputs, Cards, etc.)
├─ 📄 Business Components (KnowledgeCard, etc.)
├─ 📄 Pages (Dashboard, Knowledge Base, etc.)
├─ 📄 Mobile Variants
└─ 📄 Prototypes
```

## 📞 Support

For questions about the design system:
- Check component documentation in Figma
- Review code examples in `/frontend/components`
- Refer to design system preview at `/dashboard`

---

**Version:** 1.0
**Last Updated:** 2024-10-15
**Designer:** Ready for implementation
**Framework:** React + Tailwind CSS + Next.js
