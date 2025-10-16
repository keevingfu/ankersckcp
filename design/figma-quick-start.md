# Figma Quick Start Guide
## KCP System Design - Step-by-Step Tutorial

---

## 🚀 Getting Started (5 minutes)

### Step 1: Create New File
1. Open Figma Desktop App
2. Click **"New Design File"**
3. Name it: **"Soundcore KCP Design System"**
4. Set canvas to **1440px width** (Desktop)

---

### Step 2: Enable Dev Mode MCP Server ⭐
1. Click **Figma menu** (top-left)
2. Go to **Preferences**
3. Find **"Enable Dev Mode MCP Server"**
4. Check the box
5. **Restart Claude Desktop App**

---

## 🎨 Phase 1: Setup Design System (30 minutes)

### Create Color Styles

1. **Create a new frame**: Press `F` or click Frame tool
2. Name it: `🎨 Colors`
3. Create rectangles for each color
4. Select a rectangle → Right sidebar → **Color** → **Style icon** → **Create Style**

**Create these styles:**

#### Primary Colors
```
Primary/50   → #f3f1ff
Primary/100  → #ebe5ff
Primary/500  → #667eea  ⭐ (Main)
Primary/600  → #5a67d8
Primary/700  → #4c51bf
Primary/900  → #3730a3
```

#### Functional Colors
```
Success/500  → #10b981
Warning/500  → #f59e0b
Error/500    → #ef4444
Info/500     → #3b82f6
```

#### Gray Scale
```
Gray/50   → #f9fafb
Gray/100  → #f3f4f6
Gray/200  → #e5e7eb
Gray/500  → #6b7280
Gray/700  → #374151
Gray/900  → #111827
```

**Pro Tip:** Hold `Option` (Mac) while dragging to duplicate

---

### Create Text Styles

1. Press `T` for text tool
2. Create text samples for each size
3. Select text → Right sidebar → **Text** section → **Style icon** → **Create Style**

**Create these styles:**

```
Heading/4XL  → Inter, 36px, Bold (700)
Heading/3XL  → Inter, 30px, Bold (700)
Heading/2XL  → Inter, 24px, Semibold (600)
Heading/XL   → Inter, 20px, Semibold (600)

Body/LG      → Inter, 18px, Regular (400)
Body/Base    → Inter, 16px, Regular (400)  ⭐ (Default)
Body/SM      → Inter, 14px, Regular (400)
Body/XS      → Inter, 12px, Regular (400)
```

**Apply Line Heights:**
- Headings: 1.25
- Body: 1.5

---

### Create Effect Styles (Shadows)

1. Select any object
2. Right sidebar → **Effects** → **+** button → **Drop Shadow**
3. Configure shadow → **Style icon** → **Create Style**

**Shadow Styles:**

```
Shadow/SM
  - Y: 1px, Blur: 2px, Color: #000000 @ 5%

Shadow/MD  ⭐ (Cards)
  - Y: 4px, Blur: 6px, Color: #000000 @ 10%

Shadow/LG  (Modals)
  - Y: 10px, Blur: 15px, Color: #000000 @ 10%

Shadow/XL  (Floating)
  - Y: 20px, Blur: 25px, Color: #000000 @ 10%

Glow/Purple  (Special)
  - Spread: 20px, Color: #667eea @ 40%
```

---

### Setup Grid System

1. Select canvas/frame
2. Right sidebar → **Layout Grid** → **+**
3. Type: **Grid**
4. Size: **8px**
5. Color: Choose subtle purple

**Or use Columns:**
- Count: 12 columns
- Gutter: 24px
- Margin: 48px

---

## 🧩 Phase 2: Build Base Components (1-2 hours)

### Component: Button (Primary)

**Step-by-step:**

1. **Create frame** (`F`): Name it `Base / Button / Primary`
2. **Add Auto Layout** (`Shift + A`)
   - Horizontal direction
   - Padding: 12px (top/bottom), 24px (left/right)
   - Gap: 8px (between icon and text)
   - Corner radius: 8px
3. **Add Text**: Type "Button Text"
   - Apply style: `Body/Base`
   - Color: White
4. **Add Background**: 
   - Apply color style: `Primary/500`
5. **Make Component** (`Option + Cmd + K`)

**Create Variants:**

1. Select component
2. Right sidebar → **Create Variant**
3. Add variant for each state:
   - `state=hover` → Change background to `Primary/600`
   - `state=active` → Change background to `Primary/700`
   - `state=disabled` → Opacity 50%
4. Add property: `size` with values: `small`, `medium`, `large`

**Properties:**
```
variant: primary, secondary, outline, ghost, danger
size: small, medium, large
state: default, hover, active, disabled
```

---

### Component: Input (Text)

1. **Create frame**: `Form / Input / Text`
2. **Add layers:**
   ```
   Container (Auto Layout, Horizontal)
   ├─ Icon (Optional)
   ├─ Input Text (Placeholder)
   └─ Clear Button (Optional)
   ```
3. **Styling:**
   - Height: 40px
   - Padding: 12px 16px
   - Border: 1px, Gray/200
   - Corner radius: 8px
   - Background: White
4. **Make Component** and add variants:
   - `state=focus` → Border: `Primary/500`, Add glow effect
   - `state=error` → Border: `Error/500`
   - `state=disabled` → Background: Gray/50

---

### Component: Card

1. **Create frame**: `Base / Card / Basic`
2. **Add Auto Layout** (Vertical)
   - Padding: 24px
   - Gap: 16px
   - Corner radius: 12px
   - Fill: White
   - Effect: Shadow/MD
3. **Add sections:**
   ```
   ├─ Header (Auto Layout, Horizontal)
   │  ├─ Icon
   │  ├─ Title
   │  └─ Actions (...)
   ├─ Body (Content area)
   └─ Footer (Meta info)
   ```
4. **Make Component** and variants:
   - `type=basic, hoverable, bordered, stats`

---

## 📱 Phase 3: Design Core Pages (2-3 hours)

### Page: Dashboard

1. **Create new page**: `📱 Pages`
2. **Create frame**: `📱 Dashboard - Desktop` (1440px width)
3. **Add layout structure:**

```
Dashboard Frame
├─ 📦 Header
│  ├─ Page Title (Heading/3XL)
│  └─ Date Range Selector
│
├─ 📦 Stats Row (4 StatCards)
│  ├─ Total Knowledge Items
│  ├─ Content Generated
│  ├─ Tickets Resolved
│  └─ User Engagement
│
├─ 📦 Main Content (2 columns)
│  ├─ Activity Feed (Left, 30%)
│  └─ Main Chart (Right, 70%)
│
└─ 📦 Recent Activities
   └─ Data Table
```

**Quick Layout:**
- Use **Auto Layout** (`Shift + A`) for everything
- Set gaps: 32px between sections
- Page padding: 40px

---

### Page: Knowledge Base

```
Knowledge Base Frame
├─ 📦 Header
│  ├─ Search Bar
│  ├─ Filters
│  └─ Create Button
│
├─ 📦 Content (2 columns)
│  ├─ Sidebar Filters (20%)
│  └─ KnowledgeCard Grid (80%)
│     ├─ Card 1
│     ├─ Card 2
│     └─ ... (Grid: 3 columns)
│
└─ 📦 Pagination
```

---

## 🎯 Phase 4: Add Interactivity (30 minutes)

### Create Prototype

1. **Switch to Prototype tab** (top-right)
2. **Connect pages:**
   - Select a button/link
   - Drag connection to target frame
   - Set transition: **Smart Animate**
   - Duration: 300ms
3. **Add interactions:**
   - Hover states for buttons
   - Click to navigate
   - Modal open/close

**Common Flows:**
```
Dashboard → Click "View All" → Knowledge Base
Knowledge Base → Click card → Detail view
Any page → Click "Create" → Modal opens
```

---

## 🎨 Phase 5: Responsive Design (1-2 hours)

### Create Tablet Version (768px)

1. **Duplicate Desktop frame**
2. **Resize to 768px width**
3. **Adjust layout:**
   - Collapse sidebar
   - 2-column → 2-column (adjust widths)
   - Reduce padding: 32px → 24px

### Create Mobile Version (375px)

1. **Duplicate Tablet frame**
2. **Resize to 375px width**
3. **Adjust layout:**
   - Hide sidebar → Hamburger menu
   - Multi-column → Single column
   - Add bottom tab bar
   - Increase touch targets: min 44x44px

---

## 🚀 Phase 6: Dev Mode Handoff

### Once Dev Mode MCP Server is enabled:

1. **Switch to Dev Mode** (top-right toggle)
2. **Select any component**
3. **Claude can now:**
   - Read your design with `get_metadata`
   - Generate code with `get_code`
   - Create screenshots with `get_screenshot`

### In Claude, you can say:
```
"Get the metadata for the Button component"
"Generate React code for the Dashboard page"
"Create a screenshot of the Knowledge Base design"
"Export all icons as SVG"
```

---

## ⌨️ Keyboard Shortcuts

### Essential Shortcuts
```
F           - Frame tool
T           - Text tool
R           - Rectangle
O           - Ellipse
L           - Line
V           - Move tool
K           - Scale tool
Cmd + D     - Duplicate
Cmd + G     - Group
Shift + A   - Add Auto Layout
Cmd + /     - Search
Cmd + C     - Copy properties
Cmd + V     - Paste properties
Option + Cmd + K - Create component
Cmd + Option + B - Create component set
```

### Navigation
```
Space + Drag - Pan
Cmd + 0      - Zoom to fit
Cmd + 1      - Zoom to 100%
Cmd + 2      - Zoom to selection
```

---

## 💡 Pro Tips

1. **Use Auto Layout everywhere** - Makes responsive design easy
2. **Name layers properly** - Future you will thank you
3. **Create components early** - Easier to update globally
4. **Use consistent spacing** - Stick to 8pt grid
5. **Test on multiple screens** - Desktop, tablet, mobile
6. **Organize pages** - Use emojis for easy scanning
7. **Document decisions** - Add comments for complex logic
8. **Version control** - Save versions before big changes

---

## 📚 Resources

### Figma Learning
- [Figma Best Practices](https://www.figma.com/best-practices/)
- [Auto Layout Guide](https://www.figma.com/auto-layout/)
- [Components Basics](https://www.figma.com/components/)

### Design Inspiration
- [Dribbble](https://dribbble.com) - UI inspiration
- [Behance](https://behance.net) - Design portfolios
- [UI8](https://ui8.net) - Design systems

### Icon Libraries
- [Lucide Icons](https://lucide.dev) - Clean, consistent
- [Heroicons](https://heroicons.com) - Tailwind official
- [Iconoir](https://iconoir.com) - Modern, open-source

---

## 🆘 Troubleshooting

### Dev Mode MCP Server not working?
1. Check Figma is latest version
2. Restart Figma app
3. Restart Claude Desktop
4. Check if a design file is open

### Components not updating?
1. Make sure you're editing the main component
2. Check if instances are detached
3. Use "Reset changes" on instances

### Auto Layout not working?
1. Select all layers first
2. Use `Shift + A`
3. Check nesting structure
4. Ensure no absolute positioning

---

## ✅ Checklist Before Handoff

- [ ] All colors use Figma color styles
- [ ] All text uses Figma text styles
- [ ] Components have proper names
- [ ] Pages are organized logically
- [ ] Responsive designs are complete
- [ ] Prototype flows work correctly
- [ ] Dev Mode is enabled
- [ ] Comments added where needed
- [ ] Exported assets folder ready

---

**Now you're ready to design! 🎨**

Once you've enabled Dev Mode MCP Server and created some designs, tell Claude:

**"Get the metadata for my Dashboard design"**

And the magic begins! ✨

---

**Version**: 1.0  
**Last Updated**: 2025-10-15  
**Author**: Claude + KCP Team 🚀
