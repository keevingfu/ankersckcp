# Figma Implementation Guide for KCP System
## Step-by-Step Design Creation in Figma

**Document Purpose:** Guide you through creating the complete KCP design system in Figma  
**Prerequisites:** Figma Dev Mode MCP Server enabled ✅  
**Estimated Time:** 2-3 hours for complete system  

---

## 🎯 Quick Start Workflow

### Phase 1: Setup (15 minutes)
1. Create Figma file
2. Set up design tokens
3. Create component library structure

### Phase 2: Foundation (30 minutes)
4. Create color styles
5. Create text styles
6. Create effect styles

### Phase 3: Components (60 minutes)
7. Build base components
8. Build business components
9. Add variants and states

### Phase 4: Pages (45 minutes)
10. Design core pages
11. Create responsive variants
12. Add interactions

---

## 📐 Detailed Steps

### Step 1: Create New Figma File

```
1. Open Figma Desktop App
2. Click "New design file"
3. Rename: "KCP System Design"
4. Set canvas: 1440px width (Desktop)
```

**Initial Frame Setup:**
- Create Frame: 1440 x 1024px
- Name: "Desktop - Dashboard"
- Background: #ffffff

---

### Step 2: Enable 8-Point Grid

```
1. View → Layout Grids
2. Add Grid:
   - Type: Grid
   - Size: 8px
   - Color: rgba(102, 126, 234, 0.1) (Light purple)
3. Save as layout style: "8pt Grid"
```

---

### Step 3: Create Color Styles

#### Create Each Color as a Style:

**Purple Primary Colors:**
```
1. Select any shape
2. Fill → Create Style
3. Name format: "Primary/500" for #667eea
4. Repeat for all shades:
   - Primary/50:  #f3f1ff
   - Primary/100: #ebe5ff
   - Primary/500: #667eea ⭐
   - Primary/600: #5a67d8
   - Primary/700: #4c51bf
   - Primary/900: #3730a3
```

**Functional Colors:**
```
Success/500: #10b981
Warning/500: #f59e0b
Error/500:   #ef4444
Info/500:    #3b82f6
```

**Neutral Grays:**
```
Gray/50:  #f9fafb
Gray/100: #f3f4f6
Gray/200: #e5e7eb
Gray/500: #6b7280
Gray/700: #374151
Gray/900: #111827
```

**Special - Gradient:**
```
1. Create rectangle
2. Fill → Linear gradient
3. Color stops:
   - 0%:   #667eea
   - 100%: #764ba2
4. Angle: 135°
5. Save as style: "Gradient/Purple"
```

---

### Step 4: Create Text Styles

#### Heading Styles

**H1 - Page Title:**
```
Font: Inter
Size: 30px
Weight: Bold (700)
Line Height: 38px (1.27)
Color: Gray/900
Name: "H1/Page Title"
```

**H2 - Section:**
```
Font: Inter
Size: 24px
Weight: Semibold (600)
Line Height: 32px
Color: Gray/900
Name: "H2/Section"
```

**H3 - Subsection:**
```
Font: Inter
Size: 20px
Weight: Semibold (600)
Line Height: 28px
Color: Gray/700
Name: "H3/Subsection"
```

#### Body Text Styles

**Body/Default:**
```
Font: Inter
Size: 16px
Weight: Regular (400)
Line Height: 24px (1.5)
Color: Gray/700
Name: "Body/Default" ⭐
```

**Body/Small:**
```
Font: Inter
Size: 14px
Weight: Regular (400)
Line Height: 20px
Color: Gray/500
Name: "Body/Small"
```

**Caption:**
```
Font: Inter
Size: 12px
Weight: Regular (400)
Line Height: 16px
Color: Gray/500
Name: "Caption"
```

#### Button Text Style

**Button/Medium:**
```
Font: Inter
Size: 16px
Weight: Semibold (600)
Line Height: 24px
Color: White
Name: "Button/Medium"
```

---

### Step 5: Create Effect Styles (Shadows)

**Shadow SM:**
```
Type: Drop Shadow
X: 0, Y: 1
Blur: 2
Color: rgba(0, 0, 0, 0.05)
Name: "Shadow/SM"
```

**Shadow MD:** ⭐
```
Type: Drop Shadow
X: 0, Y: 4
Blur: 6
Spread: -1
Color: rgba(0, 0, 0, 0.1)
Name: "Shadow/MD"
```

**Shadow LG:**
```
Type: Drop Shadow
X: 0, Y: 10
Blur: 15
Spread: -3
Color: rgba(0, 0, 0, 0.1)
Name: "Shadow/LG"
```

**Glow (Special):**
```
Type: Drop Shadow
X: 0, Y: 0
Blur: 20
Color: rgba(102, 126, 234, 0.4)
Name: "Effect/Glow"
```

---

### Step 6: Build Button Component

#### Create Base Button

1. **Create Frame:**
   ```
   Width: Auto
   Height: 36px
   Padding: 16px horizontal, auto vertical
   Corner radius: 8px
   Name: "Button"
   ```

2. **Add Text:**
   ```
   Text: "Button"
   Style: Button/Medium
   Color: White
   ```

3. **Add Auto Layout:**
   ```
   Direction: Horizontal
   Spacing: 8px
   Padding: 0px 24px
   Alignment: Center
   ```

#### Create Variants

**Add Component Properties:**
```
1. Right-click component → Add Variant
2. Create property "Variant":
   - Primary
   - Secondary
   - Outline
   - Ghost
   - Danger

3. Create property "Size":
   - Small (28px height, 12px 16px padding)
   - Medium (36px height, 16px 24px padding)
   - Large (44px height, 20px 32px padding)

4. Create property "State":
   - Default
   - Hover
   - Active
   - Disabled
```

**Style Each Variant:**

**Primary:**
```
Fill: Gradient/Purple
Text: White
Shadow: Shadow/SM
```

**Secondary:**
```
Fill: Primary/100
Text: Primary/600
Shadow: None
```

**Outline:**
```
Fill: Transparent
Border: 1px Primary/500
Text: Primary/500
```

---

### Step 7: Build Input Component

1. **Create Frame:**
   ```
   Width: 320px (or stretch)
   Height: 40px
   Corner radius: 8px
   Border: 1px Gray/200
   Name: "Input"
   ```

2. **Add Auto Layout:**
   ```
   Padding: 12px 16px
   ```

3. **Add Text:**
   ```
   Text: "Placeholder text..."
   Style: Body/Default
   Color: Gray/500
   ```

4. **Add Variants for States:**
   ```
   - Default (Gray border)
   - Focus (Purple border + glow)
   - Error (Red border)
   - Disabled (Gray background)
   ```

5. **Add Prefix/Suffix Icon Slots:**
   ```
   - Add icon frame (20x20px) before text
   - Add icon frame after text
   - Both optional (show/hide variants)
   ```

---

### Step 8: Build Card Component

1. **Create Frame:**
   ```
   Width: 320px (or auto)
   Height: Auto
   Corner radius: 12px
   Fill: White
   Shadow: Shadow/MD
   Name: "Card"
   ```

2. **Add Auto Layout:**
   ```
   Direction: Vertical
   Spacing: 16px
   Padding: 24px
   ```

3. **Create Card Anatomy:**
   ```
   Header Section:
   - Title (H3 style)
   - Action menu icon

   Body Section:
   - Content area (flexible)

   Footer Section:
   - Metadata or actions
   ```

4. **Create Hover Variant:**
   ```
   Shadow: Shadow/LG
   Transform: translateY(-2px)
   ```

---

### Step 9: Build Table Component

This is complex - create it in stages:

**Stage 1: Table Header**
```
1. Create row frame (auto width, 48px height)
2. Add cells with text (H3 style, Semibold)
3. Background: Gray/50
4. Add sort icons (optional)
```

**Stage 2: Table Row**
```
1. Create row frame
2. Height: 56px
3. Add cells aligned to header
4. Background: White
5. Border bottom: 1px Gray/200
```

**Stage 3: States**
```
- Normal: White background
- Hover: Gray/50 background
- Selected: Primary/50 background
```

---

### Step 10: Build Business Components

#### KnowledgeCard

```
Based on: Card component
Additional elements:
- Badge for type (FAQ/Guide)
- Product tags
- Quality progress bar
- Date stamp
```

Create as:
```
1. Instance of Card component
2. Add specific elements inside
3. Detach if needed for customization
4. Save as new component: "KnowledgeCard"
```

#### StatCard

```
Layout:
- Icon (32x32px, Primary/500)
- Metric name (Body/Small)
- Large number (3xl, Bold)
- Trend indicator (% change)
- Mini sparkline chart
```

---

### Step 11: Design Dashboard Page

1. **Create main frame:** 1440 x 1024px

2. **Add top navigation:**
   ```
   Height: 64px
   Elements: Logo, Breadcrumb, Search, Avatar
   Background: White
   Shadow: Shadow/SM
   ```

3. **Add sidebar:**
   ```
   Width: 280px
   Background: Gray/50
   Navigation items with icons
   ```

4. **Add content area:**
   ```
   Width: Remaining space
   Padding: 40px
   ```

5. **Place components:**
   ```
   Row 1: 4 StatCards (equal width)
   Row 2: Large chart area
   Row 3: Activity feed + Recent table
   ```

---

### Step 12: Create Responsive Variants

#### Tablet (768px)

```
Changes from desktop:
- Sidebar collapses to icons only (64px)
- Stat cards: 2 columns instead of 4
- Table columns hide less important data
```

#### Mobile (375px)

```
Changes:
- Sidebar hidden (hamburger menu)
- Stat cards: 1 column
- Table converts to stacked cards
- Larger touch targets (44x44px minimum)
```

**Create separate frames for each:**
- "Desktop - Dashboard" (1440px)
- "Tablet - Dashboard" (768px)
- "Mobile - Dashboard" (375px)

---

### Step 13: Add Interactions (Prototype)

1. **Switch to Prototype mode**

2. **Add button click:**
   ```
   Select button → Prototype tab
   On Click → Navigate to → [Target frame]
   Transition: Smart Animate
   Duration: 300ms
   Easing: Ease Out
   ```

3. **Add hover states:**
   ```
   Select button → Change to → Hover variant
   Transition: Instant
   ```

4. **Add modal:**
   ```
   Button → Open Modal
   Overlay: Background dimmed
   Animation: Fade + Scale in
   ```

---

### Step 14: Organize Layers

Use Figma naming conventions:

```
Structure:
📁 Design System
  📁 Foundation
    📄 Colors
    📄 Typography
    📄 Spacing
    📄 Shadows
  📁 Components
    📁 Base
      🔷 Button
      🔷 Input
      🔷 Card
      🔷 Table
      🔷 Modal
    📁 Business
      🔷 KnowledgeCard
      🔷 StatCard
      🔷 ChatMessage
  📁 Pages
    📄 Dashboard
    📄 Knowledge Base
    📄 Analytics
```

---

## 🔧 Working with Dev Mode

Once Dev Mode MCP Server is enabled:

### 1. Get Component Metadata

```
Claude will execute:
get_metadata(nodeId: "component-id")

Returns: XML structure with all properties
```

### 2. Generate Code

```
Claude will execute:
get_code(nodeId: "component-id")

Returns: React/CSS code for the component
```

### 3. Create Screenshot

```
Claude will execute:
get_screenshot(nodeId: "component-id")

Returns: PNG image of the component
```

### 4. Export Design Tokens

```
Claude will execute:
get_variable_defs(nodeId: "page-id")

Returns: JSON with all design variables
```

---

## ✅ Design Checklist

### Foundation Complete
- [ ] All color styles created (Primary, Secondary, Functional, Neutrals)
- [ ] All text styles created (Headings, Body, Buttons, Captions)
- [ ] All shadow styles created
- [ ] 8-point grid system applied
- [ ] Border radius system documented

### Components Complete
- [ ] Button (5 variants, 3 sizes, 4 states)
- [ ] Input (4 types, 3 states)
- [ ] Card (4 variants)
- [ ] Table (with all features)
- [ ] Modal (4 sizes)
- [ ] Select (3 variants)
- [ ] Badge (3 variants)
- [ ] Toast (4 types)

### Business Components
- [ ] KnowledgeCard
- [ ] ContentPreview
- [ ] ChatMessage
- [ ] StatCard

### Pages Designed
- [ ] Dashboard Overview
- [ ] Knowledge Base
- [ ] Knowledge Graph
- [ ] Content Generator
- [ ] Smart Chat
- [ ] Analytics

### Responsive Done
- [ ] Desktop (1440px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### Dev Handoff Ready
- [ ] Dev Mode enabled
- [ ] All components documented
- [ ] Spacing annotated
- [ ] States shown
- [ ] Prototype functional

---

## 🎨 Pro Tips

### Speed Up Your Workflow

1. **Use plugins:**
   - Iconify (for icons)
   - Unsplash (for placeholder images)
   - Content Reel (for dummy content)

2. **Keyboard shortcuts:**
   - `Cmd + D`: Duplicate
   - `Cmd + G`: Group
   - `Cmd + Shift + K`: Create component
   - `Option + Drag`: Duplicate while dragging
   - `Shift + A`: Auto layout

3. **Components best practices:**
   - Name clearly: "Button/Primary/Medium/Default"
   - Use auto-layout everywhere possible
   - Create variants for all states
   - Add descriptions in component panel

4. **Color and text styles:**
   - Always use styles, never direct colors
   - Name with hierarchy: "Primary/500"
   - Document in component descriptions

---

## 🚀 Next Steps After Design

Once your Figma design is complete and Dev Mode is enabled:

1. **Claude will be able to:**
   - Read your component structure
   - Generate React code
   - Export design tokens as JSON
   - Create implementation documentation

2. **Frontend development:**
   - Code will be auto-generated
   - Styles will match exactly
   - Components will be consistent

3. **Collaboration:**
   - Share Figma link with team
   - Use commenting for feedback
   - Track changes with version history

---

**Ready to Design! 🎨**

*Follow these steps and you'll have a production-ready design system.*

**Questions?** Ask Claude once Dev Mode is enabled! 🤖
