# Figma Component Naming Convention
## KCP System Design Library - Naming Standards

---

## 📋 General Naming Format

```
[Category] / [Component] / [Variant] / [State]
```

**Example:**
```
Button / Primary / Default
Button / Primary / Hover
Button / Secondary / Large / Disabled
Input / Search / Focus / Error
```

---

## 🗂️ Category Structure

### 1. **Foundation** (Design Tokens)
```
Foundation / Colors / Primary / 500
Foundation / Typography / Heading / 3XL
Foundation / Spacing / MD
Foundation / Shadow / LG
Foundation / Radius / MD
```

### 2. **Base** (Atomic Components)
```
Base / Button
Base / Input
Base / Card
Base / Badge
Base / Avatar
Base / Icon
Base / Divider
Base / Tag
```

### 3. **Form** (Form Elements)
```
Form / Input / Text
Form / Input / Password
Form / Input / Search
Form / Select / Single
Form / Select / Multiple
Form / Checkbox
Form / Radio
Form / Switch
Form / TextArea
```

### 4. **Navigation**
```
Navigation / Sidebar
Navigation / TopBar
Navigation / Breadcrumb
Navigation / Tabs
Navigation / Pagination
Navigation / Menu
```

### 5. **Data Display**
```
Data / Table
Data / Card / Stat
Data / Card / Knowledge
Data / List
Data / Badge
Data / Progress
Data / Chart / Line
Data / Chart / Bar
Data / Chart / Pie
```

### 6. **Feedback**
```
Feedback / Modal
Feedback / Toast
Feedback / Alert
Feedback / Tooltip
Feedback / Popover
Feedback / Loading
Feedback / Empty State
```

### 7. **Business** (Domain-Specific)
```
Business / KnowledgeCard
Business / ContentPreview
Business / ChatMessage
Business / StatCard
Business / KnowledgeGraph / Node
Business / MetricsChart
```

---

## 🎯 Component Naming Rules

### Button Component
```
Base / Button / Primary / Default
Base / Button / Primary / Hover
Base / Button / Primary / Active
Base / Button / Primary / Disabled
Base / Button / Primary / Loading

Base / Button / Secondary / Default
Base / Button / Outline / Default
Base / Button / Ghost / Default
Base / Button / Danger / Default

Base / Button / Primary / Small / Default
Base / Button / Primary / Medium / Default
Base / Button / Primary / Large / Default
```

**Properties (Auto Layout):**
- `variant`: Primary, Secondary, Outline, Ghost, Danger
- `size`: Small, Medium, Large
- `state`: Default, Hover, Active, Disabled, Loading
- `icon`: Boolean (with/without icon)

---

### Input Component
```
Form / Input / Text / Default
Form / Input / Text / Focus
Form / Input / Text / Error
Form / Input / Text / Disabled
Form / Input / Text / Success

Form / Input / Password / Default
Form / Input / Search / Default
Form / Input / TextArea / Default

Form / Input / Text / Small / Default
Form / Input / Text / Medium / Default
Form / Input / Text / Large / Default
```

**Properties:**
- `type`: Text, Password, Search, TextArea
- `size`: Small, Medium, Large
- `state`: Default, Focus, Error, Disabled, Success
- `hasIcon`: Boolean
- `hasClearButton`: Boolean

---

### Card Component
```
Base / Card / Basic / Default
Base / Card / Basic / Hover
Base / Card / Basic / Selected

Base / Card / Bordered / Default
Base / Card / Interactive / Default
```

**Sections:**
```
Base / Card / Header
Base / Card / Body
Base / Card / Footer
```

---

### Table Component
```
Data / Table / Default
Data / Table / Row / Default
Data / Table / Row / Hover
Data / Table / Row / Selected
Data / Table / Header / Cell
Data / Table / Body / Cell
```

---

### Modal Component
```
Feedback / Modal / Small / Default
Feedback / Modal / Medium / Default
Feedback / Modal / Large / Default
Feedback / Modal / Full / Default

Feedback / Modal / Header
Feedback / Modal / Body
Feedback / Modal / Footer
```

---

## 📱 Responsive Variants

### Desktop (Default)
```
ComponentName / Desktop / [Variant] / [State]
```

### Tablet
```
ComponentName / Tablet / [Variant] / [State]
```

### Mobile
```
ComponentName / Mobile / [Variant] / [State]
```

**Example:**
```
Navigation / Sidebar / Desktop / Default
Navigation / Sidebar / Tablet / Collapsed
Navigation / Sidebar / Mobile / Hidden
```

---

## 🎨 Page Naming Convention

### Format
```
Pages / [PageName] / [Breakpoint]
```

### Examples
```
Pages / Dashboard / Desktop
Pages / Dashboard / Tablet
Pages / Dashboard / Mobile

Pages / Knowledge Base / Desktop
Pages / Knowledge Graph / Desktop
Pages / Content Generator / Desktop
Pages / Smart Chat / Desktop
Pages / Analytics / Desktop
```

---

## 🖼️ Frame Naming

### Page Frames
```
📱 [PageName] - [Breakpoint]
```
Example: `📱 Dashboard - Desktop`

### Section Frames
```
📦 [SectionName]
```
Example: `📦 Header`, `📦 Stats Row`, `📦 Main Content`

### Component Frames
```
🧩 [ComponentName]
```
Example: `🧩 Button Variants`, `🧩 Card Types`

---

## 🎯 Layer Naming

### Common Layers
```
Background
Container
Content
Icon
Label
Badge
Divider
Overlay
Shadow
```

### Auto Layout Frames
```
Container / Horizontal
Container / Vertical
Row
Column
Stack
Grid
```

---

## 🏷️ Instance Naming

When using component instances:
```
[ComponentName] / [Description]
```

**Examples:**
```
Button / Save Changes
Button / Cancel
Input / Email Address
Card / Product Stats
Modal / Confirm Delete
```

---

## 📂 Page Organization

```
🎨 Cover
├─ 📄 Design System
│  ├─ 🎨 Colors
│  ├─ 📝 Typography
│  ├─ 📏 Spacing
│  ├─ ✨ Effects
│  └─ 🔷 Icons
│
├─ 🧩 Components
│  ├─ Foundation
│  ├─ Base
│  ├─ Form
│  ├─ Navigation
│  ├─ Data Display
│  ├─ Feedback
│  └─ Business
│
├─ 📐 Layouts
│  ├─ Desktop Layout
│  ├─ Tablet Layout
│  └─ Mobile Layout
│
├─ 📱 Pages
│  ├─ Dashboard
│  ├─ Knowledge Base
│  ├─ Knowledge Graph
│  ├─ Content Generator
│  ├─ Smart Chat
│  └─ Analytics
│
└─ 🔗 Prototypes
   ├─ Desktop Flow
   ├─ Tablet Flow
   └─ Mobile Flow
```

---

## ✅ Naming Best Practices

### Do's ✓
- Use consistent naming patterns
- Use forward slashes `/` for hierarchy
- Use descriptive names
- Use title case
- Include variant and state information
- Group related components together
- Use emojis for easy visual scanning

### Don'ts ✗
- Don't use spaces excessively
- Don't use unclear abbreviations
- Don't mix naming conventions
- Don't create deep hierarchies (max 4 levels)
- Don't forget to rename default instances
- Don't use special characters (except `/`, `-`, `_`)

---

## 🔍 Search Tips

### Quick Find Components
```
"Button Pri"        → Button / Primary variants
"Input Tex"         → Input / Text variants
"Card Bas"          → Card / Basic variants
"Modal Med"         → Modal / Medium size
```

### Find by State
```
"Hover"             → All hover states
"Disabled"          → All disabled states
"Error"             → All error states
```

---

## 📝 Component Documentation Template

For each major component, include:
```
Component Name: [Name]
Category: [Category]
Description: [Brief description]
Variants: [List variants]
States: [List states]
Properties: [List configurable properties]
Usage: [When to use this component]
Examples: [Link to examples]
```

---

**Version**: 1.0  
**Last Updated**: 2025-10-15  
**Status**: Active Standard 📐
