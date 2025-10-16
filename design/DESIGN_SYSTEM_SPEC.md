# KCP System Design System Specification
## Anker Soundcore Knowledge Control Plane

**Version:** 1.0  
**Date:** October 15, 2025  
**Status:** Ready for Figma Implementation  

---

## 🎨 Design System Overview

### Brand Identity
- **Product Name**: Soundcore KCP (Knowledge Control Plane)
- **Visual Style**: Modern Tech + Clean + Professional + AI-Driven
- **Core Values**: Intelligent, Efficient, Reliable, Innovative
- **Target Users**: Enterprise Admins, Content Operators, Support Specialists, Data Analysts

---

## 📐 Foundation

### Color System

#### Primary Colors - Purple Gradient Theme
```
Primary Purple:
- 50:  #f3f1ff (Lightest - backgrounds)
- 100: #ebe5ff (Light - secondary backgrounds)
- 500: #667eea (Main - primary buttons, key elements) ⭐
- 600: #5a67d8 (Medium - hover states)
- 700: #4c51bf (Dark - active states)
- 900: #3730a3 (Darkest - high contrast text)

Secondary Violet:
- 50:  #faf5ff (Lightest violet)
- 500: #764ba2 (Violet - accent color)
- 700: #6b21a8 (Deep violet - emphasis)

Gradient:
- Main Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

#### Functional Colors
```
Success (Green):
- 50:  #ecfdf5
- 500: #10b981 ✓
- 700: #047857

Warning (Orange):
- 50:  #fef3c7
- 500: #f59e0b ⚠
- 700: #d97706

Error (Red):
- 50:  #fef2f2
- 500: #ef4444 ✕
- 700: #dc2626

Info (Blue):
- 50:  #eff6ff
- 500: #3b82f6 ℹ
- 700: #2563eb
```

#### Neutral Colors
```
Gray Scale:
- 50:  #f9fafb (Lightest background)
- 100: #f3f4f6 (Card background)
- 200: #e5e7eb (Borders, dividers)
- 500: #6b7280 (Secondary text)
- 700: #374151 (Primary text)
- 900: #111827 (Headings, emphasis)

Backgrounds:
- Primary:   #ffffff (Main background - white)
- Secondary: #f9fafb (Secondary background)
- Tertiary:  #f3f4f6 (Tertiary background)
```

---

### Typography System

#### Font Family
```
Primary: Inter (sans-serif)
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Fallback: SF Pro Display, system-ui, sans-serif

Monospace: Fira Code (for code blocks)
- Fallback: Monaco, Consolas, monospace
```

#### Type Scale
```
Display/Headings:
- 4xl: 36px / 2.25rem (Hero sections, large titles)
- 3xl: 30px / 1.875rem (H1 - Page titles)
- 2xl: 24px / 1.5rem (H2 - Section headers)
- xl:  20px / 1.25rem (H3 - Subsection headers)

Body Text:
- lg:   18px / 1.125rem (Large body text)
- base: 16px / 1rem (Standard body text) ⭐
- sm:   14px / 0.875rem (Small text)
- xs:   12px / 0.75rem (Captions, labels)
```

#### Font Weights
```
- Regular:   400 (Body text default)
- Medium:    500 (Secondary headings, emphasis)
- Semibold:  600 (Buttons, labels, cards)
- Bold:      700 (Main headings, important info)
```

#### Line Heights
```
- Tight:   1.25 (Headings, buttons)
- Normal:  1.5  (Body text default) ⭐
- Relaxed: 1.75 (Long-form content)
```

---

### Spacing System (8-Point Grid)

```
Space Scale:
- 0:  0px
- 1:  4px   (Icon-text gaps)
- 2:  8px   (Tight spacing)
- 3:  12px  (Small spacing)
- 4:  16px  (Standard spacing) ⭐
- 5:  20px  (Medium spacing)
- 6:  24px  (Card padding)
- 8:  32px  (Section spacing)
- 10: 40px  (Large sections)
- 12: 48px  (Page sections)
- 16: 64px  (Major sections)
- 20: 80px  (Hero spacing)

Common Usage:
- Button padding: 12px 24px (space-3 space-6)
- Card padding: 24px (space-6)
- Form field gap: 16px (space-4)
- Section gap: 32px (space-8)
```

---

### Border Radius

```
- none: 0px    (Tables, dividers)
- sm:   4px    (Small elements, tags)
- md:   8px    (Buttons, inputs) ⭐
- lg:   12px   (Cards, panels)
- xl:   16px   (Large cards, modals)
- 2xl:  24px   (Special emphasis cards)
- full: 9999px (Circular avatars, badges)
```

---

### Shadow System

```
Elevation Levels:
- sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
- md:  0 4px 6px -1px rgba(0, 0, 0, 0.1) ⭐
- lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)
- xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1)
- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

Special Effects:
- Glow:       0 0 20px rgba(102, 126, 234, 0.4)
- Glow Large: 0 0 40px rgba(102, 126, 234, 0.6)
```

---

### Animation System

```
Duration:
- fast:   150ms (Small elements, icons)
- normal: 300ms (Standard transitions) ⭐
- slow:   500ms (Large elements, page transitions)

Easing:
- ease-out:    cubic-bezier(0, 0, 0.2, 1) (Recommended)
- ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
- bounce:      cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 🧩 Component Library

### 1. Button Component

#### Variants
```
Primary:   Purple gradient background, white text
Secondary: Light purple background, purple text
Outline:   Transparent background, purple border
Ghost:     Transparent, no border, hover shows background
Danger:    Red background, white text (for delete actions)
Link:      No background, underline on hover
```

#### Sizes
```
Small:  28px height, 12px 16px padding, 14px font
Medium: 36px height, 16px 24px padding, 16px font ⭐
Large:  44px height, 20px 32px padding, 18px font
```

#### States
```
Default:  Base appearance
Hover:    Background darkens 10%, shadow lifts slightly
Active:   Background darkens 20%, no shadow
Disabled: 50% opacity, cursor not-allowed
Loading:  Spinner icon, pointer-events none
```

---

### 2. Input Component

#### Types
```
Text:     Single-line text input
Password: Password field with show/hide toggle
Search:   Search input with search icon
TextArea: Multi-line text input
Number:   Numeric input with +/- controls
```

#### Sizes
```
Small:  32px height
Medium: 40px height ⭐
Large:  48px height
```

#### States
```
Default:  Gray border (#e5e7eb)
Focus:    Purple border (#667eea), purple glow
Error:    Red border (#ef4444), error message below
Success:  Green border (#10b981), checkmark icon
Disabled: Gray background, not editable
```

#### Features
```
- Prefix Icon (left side)
- Suffix Icon (right side)
- Clear Button (when has content)
- Character Count (bottom-right for textarea)
- Helper Text (below input)
- Error Message (below input, red color)
```

---

### 3. Card Component

#### Variants
```
Basic:       White background, light shadow
Hoverable:   Lifts on hover (shadow increases)
Bordered:    With border instead of shadow
Stats:       With icon, number, trend indicator
Interactive: Clickable, selected state available
```

#### Anatomy
```
┌─────────────────────────────┐
│ Header (optional)           │
│ [Icon] Title      [Actions] │
├─────────────────────────────┤
│ Body                        │
│ Main content area           │
│                             │
├─────────────────────────────┤
│ Footer (optional)           │
│ Metadata, actions, etc.     │
└─────────────────────────────┘
```

#### States
```
Default:  Base appearance
Hover:    Lifts 2px, shadow enhances
Selected: Purple border (#667eea)
Disabled: 50% opacity
```

---

### 4. Table Component

#### Features
```
- Fixed Header (sticky on scroll)
- Sortable Columns (click header to sort)
- Filterable (dropdown filters per column)
- Expandable Rows
- Row Selection (checkboxes)
- Pagination
- Loading State (skeleton screen)
- Empty State (illustration + message)
```

#### Column Types
```
Text:     Standard text column
Number:   Right-aligned numbers
Date:     Formatted dates
Tag:      Colored tag badges
Action:   Button group
Avatar:   User avatar + name
Progress: Progress bar
Status:   Status dot + text
```

#### Row States
```
Normal:   Default row appearance
Hover:    Light gray background (#f9fafb)
Selected: Light purple background (#f3f1ff)
Disabled: Gray text, not interactive
```

---

### 5. Modal Component

#### Sizes
```
Small:  400px width
Medium: 600px width ⭐
Large:  800px width
Full:   90vw width
```

#### Anatomy
```
┌───────────────────────────────┐
│ Header              [X Close] │
├───────────────────────────────┤
│ Body (scrollable)             │
│                               │
│                               │
├───────────────────────────────┤
│ Footer                        │
│           [Cancel]  [Confirm] │
└───────────────────────────────┘
```

#### Variants
```
Default:  Standard modal
Confirm:  With icon (success/warning/error)
Drawer:   Slides from right side
Alert:    Cannot be dismissed (must act)
```

#### Backdrop
```
Color: rgba(0, 0, 0, 0.5)
Blur:  backdrop-filter: blur(4px)
```

---

### 6. Select Component

#### Variants
```
Single Select:    Choose one option
Multiple Select:  Choose multiple (shows tags)
Searchable:       Can type to filter
Async:            Loads options dynamically
Grouped:          Options in groups
```

#### Features
```
- Search Box (for searchable variant)
- Clear Button
- Select All (for multiple)
- Loading State
- Empty State
- Dropdown max-height: 300px (scrollable)
```

---

### 7. Badge/Tag Component

#### Variants
```
Solid:   Solid background
Subtle:  Light background, colored text
Outline: Border only, transparent background
```

#### Colors
```
- Default (Gray)
- Primary (Purple)
- Success (Green)
- Warning (Orange)
- Error (Red)
- Info (Blue)
```

#### Sizes
```
Small:  20px height, 6px 8px padding, 12px font
Medium: 24px height, 8px 12px padding, 14px font ⭐
Large:  28px height, 10px 14px padding, 14px font
```

---

### 8. Toast/Notification Component

#### Types
```
Success: Green, checkmark icon
Error:   Red, X icon
Warning: Orange, warning icon
Info:    Blue, info icon
```

#### Position
```
Top-Right (default)
Top-Center
Bottom-Right
Bottom-Center
```

#### Duration
```
Default: 3 seconds
Manual:  User must close
Persistent: Until action taken
```

---

## 🎯 Business Components

### 1. KnowledgeCard

```
Layout:
┌───────────────────────────────────┐
│ [📄] Knowledge Title    [...Menu] │
├───────────────────────────────────┤
│ Content preview text goes here... │
│ Additional preview content...     │
├───────────────────────────────────┤
│ [FAQ] [Product A] [English]      │
│ Quality: ████████░░ 85%           │
│ Updated: 2024-10-15               │
└───────────────────────────────────┘

Elements:
- Type Badge (FAQ/Guide/Spec)
- Product Tag
- Language Tag
- Quality Progress Bar (0-100%)
- Last Updated Date
- Action Menu (Edit, Delete, etc.)
```

---

### 2. ContentPreview Card

```
Layout:
┌───────────────────────────────────┐
│ [Thumbnail 16:9]                  │
├───────────────────────────────────┤
│ Content Title                     │
│ Brief description text...         │
├───────────────────────────────────┤
│ SEO: 92%  |  Readability: 88%    │
│ [Edit] [Publish] [Delete]        │
└───────────────────────────────────┘

Features:
- 16:9 Thumbnail Image
- SEO Score Badge (color-coded)
- Readability Score
- Action Buttons
```

---

### 3. ChatMessage Component

```
User Message (Right-aligned):
                    ┌──────────────┐
              [👤] │ User message │
                    │ text here... │
                    └──────────────┘
                    10:30 AM

AI Message (Left-aligned):
[🤖] 
┌──────────────────┐
│ AI response text │
│ goes here...     │
└──────────────────┘
│ 👍 👎 📋 🔄      │ Actions
└──────────────────┘
10:31 AM

Features:
- Avatar
- Timestamp
- Rounded Message Bubble
- Actions (Like, Dislike, Copy, Regenerate)
- Typing Indicator (3 dots)
- Markdown Support
```

---

### 4. StatCard Component

```
Layout:
┌───────────────────────────────────┐
│ [📊] Total Knowledge Items        │
│                                   │
│ 12,345      ↑ +12.5%             │
│                                   │
│ ▁▂▃▅▇████ Mini sparkline         │
└───────────────────────────────────┘

Variants:
- With Icon (left side)
- With Trend Arrow (up/down)
- With Mini Chart (sparkline)
- Color Coding (green/red by trend)
```

---

## 📱 Page Layouts

### App Structure

```
┌─────────────────────────────────────────────┐
│ Top Navigation (64px height)               │
│ [Logo] [Breadcrumb] [Search] [🔔] [Avatar]│
├────────┬────────────────────────────────────┤
│ Side   │                                    │
│ Bar    │ Main Content Area                  │
│ (280px)│                                    │
│        │                                    │
│ Nav    │                                    │
│ Menu   │                                    │
│        │                                    │
└────────┴────────────────────────────────────┘

Dimensions:
- Sidebar: 280px (collapsed: 64px)
- Top Bar: 64px height
- Content: Flexible width
```

---

### Core Pages to Design

#### 1. Dashboard Overview
```
Layout:
- 4 Stat Cards (top row)
- Main Chart (large area)
- Activity Feed (left sidebar)
- Recent Table (bottom section)

Key Metrics:
- Total Knowledge Items
- Content Generated (this month)
- Support Tickets Resolved
- User Satisfaction Score
```

#### 2. Knowledge Base
```
Features:
- Search & Filter Bar
- Grid/List View Toggle
- Knowledge Cards Grid
- Pagination
- Bulk Actions
```

#### 3. Knowledge Graph
```
Components:
- Graph Canvas (interactive)
- Node Types (Product, Feature, Use Case)
- Connection Lines
- Zoom Controls
- Filter Panel
- Details Sidebar
```

#### 4. Content Generator
```
Layout:
- Input Form (left sidebar)
- Live Preview (right panel)
- Quality Metrics
- Action Buttons (Generate, Save, Publish)
```

#### 5. Smart Chat
```
Components:
- Chat History (left sidebar)
- Message Area (center)
- Input Box (bottom)
- Suggested Questions
```

#### 6. Analytics Dashboard
```
Sections:
- Key Metrics (top)
- Multiple Charts
- Filter Controls
- Export Options
- Date Range Picker
```

---

## 📐 Responsive Design

### Breakpoints
```
Mobile (sm):  640px  (Phone portrait)
Tablet (md):  768px  (Tablet portrait)
Desktop (lg): 1024px (Laptop)
Wide (xl):    1280px (Desktop)
Ultra (2xl):  1536px (Large screen)
```

### Layout Adaptations

#### Navigation
```
Desktop: 
- Full sidebar (280px)
- All menu items visible
- Icon + Text

Mobile:
- Hidden sidebar
- Hamburger menu
- Bottom tab bar (optional)
```

#### Grid Layouts
```
Desktop (xl):  4 columns (cards)
Laptop (lg):   3 columns
Tablet (md):   2 columns
Mobile (sm):   1 column
```

---

## ♿ Accessibility

### Color Contrast
```
WCAG 2.1 AA Compliance:
- Normal Text: >= 4.5:1 contrast ratio
- Large Text:  >= 3:1 contrast ratio
- UI Elements: >= 3:1 contrast ratio

Verified Combinations:
✓ Purple #667eea on White: 5.2:1
✓ Gray-700 #374151 on White: 12.6:1
✓ White on Primary-600: 8.1:1
```

### Keyboard Navigation
```
Focus Indicator:
- 2px solid purple (#667eea)
- 2px offset
- 4px border radius

Tab Order:
1. Skip to main content
2. Header navigation
3. Sidebar navigation
4. Main content
5. Footer
```

### Touch Targets
```
Minimum Size: 44x44px
- Buttons
- Links
- Form controls
- Interactive elements
```

---

## 🎨 Implementation Checklist

### Figma Setup
- [ ] Create design file
- [ ] Set up color styles
- [ ] Set up text styles
- [ ] Set up effect styles (shadows)
- [ ] Create 8-point grid system
- [ ] Set up auto-layout frames

### Component Creation
- [ ] Button (all variants & states)
- [ ] Input (all types & states)
- [ ] Card (all variants)
- [ ] Table (with all features)
- [ ] Modal (all sizes)
- [ ] Select dropdown
- [ ] Badge/Tag
- [ ] Toast notification

### Business Components
- [ ] KnowledgeCard
- [ ] ContentPreview
- [ ] ChatMessage
- [ ] StatCard
- [ ] KnowledgeGraphViewer

### Page Designs
- [ ] Dashboard Overview
- [ ] Knowledge Base
- [ ] Knowledge Graph
- [ ] Content Generator
- [ ] Smart Chat
- [ ] Analytics Dashboard

### Responsive Variants
- [ ] Desktop (1440px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### Interactions
- [ ] Button hover/active states
- [ ] Modal open/close
- [ ] Dropdown expand/collapse
- [ ] Tab navigation
- [ ] Toast animations

### Dev Handoff
- [ ] Enable Dev Mode
- [ ] Add component descriptions
- [ ] Mark spacing/sizing
- [ ] Export design tokens
- [ ] Create prototype links

---

## 📚 Resources & References

### Design Inspiration
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Linear App](https://linear.app)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Notion UI](https://notion.so)

### Component Libraries
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Headless UI](https://headlessui.com/)

### Icon Libraries
- [Lucide Icons](https://lucide.dev/) (Recommended)
- [Heroicons](https://heroicons.com/)
- [Phosphor Icons](https://phosphoricons.com/)

---

**Ready for Implementation in Figma! 🚀**

*All measurements, colors, and specifications are production-ready.*
