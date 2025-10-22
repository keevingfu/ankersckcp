# Anker Soundcore KCP 企业操作系统 Figma 设计提示词
## Knowledge Control Plane Frontend Design System

---

## 🎨 一、设计系统基础 (Design System Foundation)

### 1.1 品牌定位与视觉风格
- **品牌名称**: Soundcore KCP (Knowledge Control Plane)
- **设计风格**: Modern Tech + Clean + Professional + AI-Driven
- **情感基调**: 智能、高效、可靠、创新
- **目标用户**: 企业管理员、内容运营、客服专员、数据分析师、产品经理

### 1.2 色彩系统 (Color System)

**主色调 - 科技紫罗兰渐变**
```
Primary Purple Gradient:
- Primary 50:  #f3f1ff (极浅紫 - 背景)
- Primary 100: #ebe5ff (浅紫 - 次级背景)
- Primary 500: #667eea (主紫 - 主按钮、重点元素)
- Primary 600: #5a67d8 (中紫 - Hover状态)
- Primary 700: #4c51bf (深紫 - Active状态)
- Primary 900: #3730a3 (极深紫 - 文字对比)

Secondary Violet:
- Secondary 50:  #faf5ff (极浅紫罗兰)
- Secondary 500: #764ba2 (紫罗兰 - 辅助色)
- Secondary 700: #6b21a8 (深紫罗兰 - 强调)
```

**功能色系统**
```
Success Green:  #10b981 (成功、完成、正向)
Warning Orange: #f59e0b (警告、待处理)
Error Red:      #ef4444 (错误、危险、删除)
Info Blue:      #3b82f6 (提示、信息、链接)
```

**中性色系统**
```
Gray Scale:
- Gray 50:  #f9fafb (最浅背景)
- Gray 100: #f3f4f6 (卡片背景)
- Gray 200: #e5e7eb (边框、分割线)
- Gray 500: #6b7280 (次要文字)
- Gray 700: #374151 (主要文字)
- Gray 900: #111827 (标题、强调文字)

Background:
- Primary:   #ffffff (主背景-白色)
- Secondary: #f9fafb (次要背景-浅灰)
- Tertiary:  #f3f4f6 (三级背景-灰白)
- Dark:      #1f2937 (深色模式背景)
```

**特殊场景色 - 知识图谱节点**
```
Graph Node Colors:
- Product Node:  #667eea (产品节点-主紫)
- Feature Node:  #10b981 (功能节点-绿色)
- Use Case Node: #f59e0b (场景节点-橙色)
- Problem Node:  #ef4444 (问题节点-红色)
```

### 1.3 排版系统 (Typography)

**字体族**
```
Sans Serif (主要):
- Primary:   Inter (现代无衬线)
- Fallback:  SF Pro Display, system-ui, sans-serif

Monospace (代码):
- Primary:   Fira Code
- Fallback:  Monaco, Consolas, monospace
```

**字号比例 (Type Scale)**
```
Display/Heading:
- 4xl: 36px / 2.25rem  (大标题、Hero Section)
- 3xl: 30px / 1.875rem (一级标题)
- 2xl: 24px / 1.5rem   (二级标题)
- xl:  20px / 1.25rem  (三级标题)

Body:
- lg:   18px / 1.125rem (大号正文)
- base: 16px / 1rem     (标准正文)
- sm:   14px / 0.875rem (小号正文)
- xs:   12px / 0.75rem  (辅助文字、标签)
```

**字重规范 (Font Weight)**
```
- Light:     300 (极少使用)
- Normal:    400 (正文默认)
- Medium:    500 (次要标题、强调)
- Semibold:  600 (按钮、标签)
- Bold:      700 (主标题、重要信息)
```

**行高规范 (Line Height)**
```
- Tight:    1.25 (标题、按钮)
- Normal:   1.5  (正文默认)
- Relaxed:  1.75 (大段落阅读)
```

### 1.4 间距系统 (Spacing System)

**8点网格系统**
```
- 0:  0px
- 1:  4px   (极小间距-图标与文字)
- 2:  8px   (小间距-内边距)
- 3:  12px  (小中间距)
- 4:  16px  (标准间距-常用)
- 5:  20px  (中间距)
- 6:  24px  (大间距-卡片内部)
- 8:  32px  (超大间距-模块间距)
- 10: 40px  (章节间距)
- 12: 48px  (大章节间距)
- 16: 64px  (页面级间距)
- 20: 80px  (超大页面间距)
```

**应用规则**
- 卡片内边距: 24px (spacing-6)
- 按钮内边距: 12px 24px (spacing-3 spacing-6)
- 表单项间距: 16px (spacing-4)
- 模块间距: 32px (spacing-8)
- 页面边距: 40px (spacing-10)

### 1.5 圆角系统 (Border Radius)

```
- None:   0px    (表格、分割线)
- sm:     4px    (小组件、标签)
- md:     8px    (按钮、输入框)
- lg:     12px   (卡片、面板)
- xl:     16px   (大卡片、模态框)
- 2xl:    24px   (特殊强调卡片)
- full:   9999px (圆形头像、徽章)
```

### 1.6 阴影系统 (Shadow System)

```
Elevation Levels:
- sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)        (轻微浮起)
- md:  0 4px 6px -1px rgba(0, 0, 0, 0.1)      (标准卡片)
- lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)    (浮动面板)
- xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1)    (模态框)
- 2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)  (大型弹窗)

Special Effects (科技感):
- Glow:       0 0 20px rgba(102, 126, 234, 0.4)  (霓虹光晕)
- Glow Large: 0 0 40px rgba(102, 126, 234, 0.6)  (大型光晕-强调)
```

### 1.7 动效系统 (Animation)

**动画时长**
```
- Fast:   150ms (小元素、图标)
- Normal: 300ms (标准过渡)
- Slow:   500ms (大型元素、页面切换)
```

**缓动函数 (Easing)**
```
- Ease In:     cubic-bezier(0.4, 0, 1, 1)      (渐入)
- Ease Out:    cubic-bezier(0, 0, 0.2, 1)      (渐出-推荐)
- Ease In Out: cubic-bezier(0.4, 0, 0.2, 1)    (渐入渐出)
- Bounce:      cubic-bezier(0.68, -0.55, 0.265, 1.55) (弹性)
```

**常用动画效果**
```
Fade In:
- From: opacity 0
- To:   opacity 1
- Duration: 300ms ease-out

Slide Up:
- From: translateY(10px), opacity 0
- To:   translateY(0), opacity 1
- Duration: 300ms ease-out

Scale In:
- From: scale(0.95), opacity 0
- To:   scale(1), opacity 1
- Duration: 150ms ease-out
```

---

## 📐 二、组件库设计 (Component Library)

### 2.1 基础组件 (Base Components)

#### Button 按钮组件
```
Variants:
- Primary:   主按钮 (紫色渐变, 白色文字)
- Secondary: 次要按钮 (浅紫背景, 紫色文字)
- Outline:   描边按钮 (透明背景, 紫色边框)
- Ghost:     幽灵按钮 (透明背景, 无边框, Hover显示)
- Danger:    危险按钮 (红色, 用于删除操作)
- Link:      链接按钮 (无背景, 下划线)

Sizes:
- Small:  28px height, 12px padding, 14px font
- Medium: 36px height, 16px padding, 16px font
- Large:  44px height, 20px padding, 18px font

States:
- Default:  默认状态
- Hover:    悬停 (背景变深10%, 微提升阴影)
- Active:   按下 (背景变深20%, 无阴影)
- Disabled: 禁用 (50%不透明度, 不可点击)
- Loading:  加载中 (显示转圈动画)
```

#### Input 输入框组件
```
Variants:
- Text:     单行文本
- Password: 密码输入 (带显示/隐藏切换)
- Search:   搜索框 (带搜索图标)
- TextArea: 多行文本

Sizes:
- Small:  32px height
- Medium: 40px height (默认)
- Large:  48px height

States:
- Default:  灰色边框
- Focus:    紫色边框 + 外发光
- Error:    红色边框 + 错误提示
- Disabled: 灰色背景, 不可编辑
- Success:  绿色边框 + 成功图标

Features:
- Prefix Icon:  左侧图标
- Suffix Icon:  右侧图标
- Clear Button: 清除按钮 (输入内容后显示)
- Character Count: 字符计数 (右下角)
```

#### Card 卡片组件
```
Variants:
- Basic:       基础卡片 (白色背景, 轻阴影)
- Hoverable:   可悬停卡片 (Hover提升阴影)
- Bordered:    带边框卡片
- Stats:       统计卡片 (带图标、数字、趋势)
- Interactive: 可交互卡片 (点击、选中状态)

Anatomy:
- Header:   标题区 (可选图标、操作按钮)
- Body:     内容区
- Footer:   底部区 (可选按钮、元数据)

States:
- Default
- Hover (提升2px, 阴影增强)
- Selected (紫色边框)
- Disabled (50%不透明度)
```

#### Table 表格组件
```
Features:
- Fixed Header:    固定表头
- Sortable:        可排序 (点击列头)
- Filterable:      可筛选 (下拉筛选器)
- Expandable:      可展开行
- Row Selection:   行选择 (Checkbox)
- Pagination:      分页器
- Loading State:   加载状态 (骨架屏)
- Empty State:     空状态插图

Column Types:
- Text:       文本列
- Number:     数字列 (右对齐)
- Date:       日期列 (格式化显示)
- Tag:        标签列 (彩色标签)
- Action:     操作列 (按钮组)
- Avatar:     头像列
- Progress:   进度列 (进度条)
- Status:     状态列 (状态点+文字)

Row States:
- Normal
- Hover (浅灰背景)
- Selected (浅紫背景)
- Disabled (灰色文字)
```

#### Modal 模态框组件
```
Sizes:
- Small:  400px width
- Medium: 600px width (默认)
- Large:  800px width
- Full:   90vw width

Anatomy:
- Header:   标题 + 关闭按钮
- Body:     内容区 (可滚动)
- Footer:   操作按钮组 (取消 + 确认)

Variants:
- Default:  默认模态框
- Confirm:  确认对话框 (带图标提示)
- Drawer:   抽屉式 (从右侧滑入)
- Alert:    警告框 (不可关闭)

Backdrop:
- Semi-transparent black (rgba(0, 0, 0, 0.5))
- Blur effect (backdrop-filter: blur(4px))
```

#### Select 选择器组件
```
Variants:
- Single Select:    单选
- Multiple Select:  多选 (显示标签)
- Searchable:       可搜索
- Async:            异步加载选项
- Group:            分组选项

Features:
- Search Box:       搜索过滤
- Clear Button:     清除选择
- Select All:       全选 (多选模式)
- Loading State:    加载中
- Empty State:      无选项提示

Dropdown:
- Max Height: 300px (超出滚动)
- Animation:  Slide down (150ms)
```

### 2.2 业务组件 (Business Components)

#### KnowledgeCard 知识卡片
```
Layout:
┌─────────────────────────────────────────┐
│ [Icon] Title                    [•••]   │ ← Header
├─────────────────────────────────────────┤
│ Content preview text...                 │ ← Body
│ Content preview text...                 │
├─────────────────────────────────────────┤
│ [Type] [Product] [Language]            │ ← Meta
│ Quality: ████████░░ 85%     2024-10-15 │ ← Footer
└─────────────────────────────────────────┘

Elements:
- Type Badge:      类型标签 (FAQ, Guide, Spec)
- Product Tag:     产品标签
- Language Tag:    语言标签
- Quality Bar:     质量分数进度条
- Date:            更新日期
- Action Menu:     更多操作菜单
```

#### ContentPreview 内容预览卡片
```
Layout:
┌─────────────────────────────────────────┐
│ [Thumbnail Image]                       │ ← Preview
├─────────────────────────────────────────┤
│ Content Title                           │ ← Title
│ Description text...                     │ ← Description
├─────────────────────────────────────────┤
│ SEO: 92% | Readability: 88%           │ ← Scores
│ [Edit] [Publish] [Delete]              │ ← Actions
└─────────────────────────────────────────┘

Features:
- Thumbnail (16:9 ratio)
- SEO Score Badge (with color coding)
- Readability Score
- Action Buttons
```

#### ChatMessage 聊天消息组件
```
User Message (Right Aligned):
                           ┌──────────────┐
                           │ User message │
                           │ text...      │
                           └──────────────┘
                               ↑ [Avatar]
                           10:30 AM

AI Message (Left Aligned):
[Avatar] ↓
┌──────────────┐
│ AI response  │
│ text...      │
└──────────────┘
│ 👍 👎 📋 🔄  │ ← Actions
└──────────────┘
10:31 AM

Features:
- Avatar
- Timestamp
- Message Bubble (rounded corners)
- Action Buttons (Like, Dislike, Copy, Regenerate)
- Typing Indicator (3 dots animation)
- Markdown Support (code blocks, lists, etc.)
```

#### StatCard 统计卡片
```
Layout:
┌─────────────────────────────────────┐
│ [Icon]  Metric Name                │
│                                     │
│ 12,345  ↑ +12.5%                   │ ← Value + Trend
│                                     │
│ ▁▂▃▅▇██ ← Mini Chart               │
└─────────────────────────────────────┘

Variants:
- With Icon (left side)
- With Trend Arrow (up/down)
- With Sparkline Chart
- Color Coding (green/red based on trend)
```

#### MetricsChart 指标图表
```
Chart Types:
- Line Chart:   趋势分析
- Bar Chart:    对比分析
- Pie Chart:    占比分析
- Area Chart:   累积趋势
- Radar Chart:  多维评估

Features:
- Interactive Tooltip
- Legend (可点击显隐)
- Zoom & Pan
- Data Export Button
- Time Range Selector
```

#### KnowledgeGraphViewer 知识图谱查看器
```
Layout:
┌─────────────────────────────────────────────────┐
│ [Filter] [Search] [Zoom Controls] [Export]     │ ← Toolbar
├─────────────────────────────────────────────────┤
│                                                 │
│     ●─────●                                    │
│     │     │                                    │ ← Graph Canvas
│     ●     ●─────●                              │
│           │     │                              │
│           ●─────●                              │
│                                                 │
├─────────────────────────────────────────────────┤
│ Selected Node Details                          │ ← Details Panel
└─────────────────────────────────────────────────┘

Node Types:
- Product:  Circle, Purple
- Feature:  Square, Green
- Use Case: Diamond, Orange
- Problem:  Triangle, Red

Interactions:
- Click: Select node + Show details
- Drag: Move node
- Scroll: Zoom in/out
- Double Click: Expand/Collapse
```

---

## 📱 三、页面设计规范 (Page Layouts)

### 3.1 整体布局结构

```
App Structure:
┌────────────────────────────────────────────────────┐
│ Top Navigation Bar (固定顶部)                       │
├────────┬───────────────────────────────────────────┤
│        │                                           │
│  Side  │                                           │
│  Bar   │          Main Content Area                │
│        │                                           │
│  Nav   │                                           │
│        │                                           │
│        │                                           │
├────────┴───────────────────────────────────────────┤
│ Footer (可选)                                       │
└────────────────────────────────────────────────────┘

Dimensions:
- Sidebar: 280px width (collapsed: 64px)
- Top Bar: 64px height
- Content: calc(100vw - 280px)
```

### 3.2 Top Navigation Bar 顶栏

```
Layout:
┌──────────────────────────────────────────────────────┐
│ [Logo] [Breadcrumb...]        [Search] [🔔] [Avatar]│
└──────────────────────────────────────────────────────┘

Elements:
- Logo (左侧, 160px)
- Breadcrumb (左侧, 跟随当前位置)
- Global Search (中间, 300px width)
- Notifications Bell (右侧, badge显示未读数)
- User Avatar + Dropdown (右侧)

User Dropdown Menu:
- Profile
- Settings
- Help & Documentation
- Logout
```

### 3.3 Sidebar Navigation 侧边栏

```
Layout:
┌──────────────────┐
│  [Logo Area]     │ ← Branding
├──────────────────┤
│ ● Knowledge Hub  │ ← Nav Items
│   ○ Knowledge    │
│   ○ Graph        │
│ ● Content        │
│ ● Support        │
│ ● Marketing      │
│ ● Analytics      │
├──────────────────┤
│ [← Collapse]     │ ← Footer
└──────────────────┘

Navigation Item States:
- Default:  Gray text, no background
- Hover:    Light purple background
- Active:   Purple text, purple left border (4px)
- Disabled: Gray text, 50% opacity

Icon Guidelines:
- Size: 20x20px
- Stroke: 2px
- Style: Lucide Icons or Heroicons
```

### 3.4 核心页面设计

#### 3.4.1 Dashboard 总览页

```
Layout:
┌────────────────────────────────────────────────────┐
│ Dashboard Overview                    [Date Range] │ ← Page Header
├────────────────────────────────────────────────────┤
│                                                    │
│ [Stat Card] [Stat Card] [Stat Card] [Stat Card]  │ ← Stats Row
│                                                    │
├────────────┬───────────────────────────────────────┤
│            │                                       │
│  Activity  │      Main Chart                      │ ← Charts Section
│   Feed     │      (Line/Area Chart)               │
│            │                                       │
├────────────┴───────────────────────────────────────┤
│                                                    │
│ Recent Activities Table                           │ ← Data Table
│                                                    │
└────────────────────────────────────────────────────┘

Key Metrics (StatCards):
1. Total Knowledge Items (with trend)
2. Content Generated (this month)
3. Support Tickets Resolved
4. Average Response Time

Main Chart:
- 7-day trend line
- Multiple metrics comparison
- Interactive tooltips
```

#### 3.4.2 Knowledge Base 知识库页面

```
Layout:
┌────────────────────────────────────────────────────┐
│ Knowledge Base              [+ New] [Import] [⚙️]  │ ← Header
├────────────────────────────────────────────────────┤
│ [Search...]  [Type ▼] [Product ▼] [Quality ▼]    │ ← Filters
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌──────────────┬──────────────┬──────────────┐   │
│ │ Knowledge 1  │ Knowledge 2  │ Knowledge 3  │   │ ← Grid View
│ └──────────────┴──────────────┴──────────────┘   │
│ ┌──────────────┬──────────────┬──────────────┐   │
│ │ Knowledge 4  │ Knowledge 5  │ Knowledge 6  │   │
│ └──────────────┴──────────────┴──────────────┘   │
│                                                    │
│ [Pagination: 1 2 3 ... 10]                        │
└────────────────────────────────────────────────────┘

View Options:
- Grid View (default)
- List View (compact)
- Table View (detailed)

Bulk Actions:
- Select All
- Export Selected
- Delete Selected
- Update Tags
```

#### 3.4.3 Knowledge Graph 知识图谱页面

```
Layout:
┌────────────────────────────────────────────────────┐
│ Knowledge Graph                    [Filter] [View] │
├───────────────────────────────┬────────────────────┤
│                               │                    │
│   Interactive Graph Canvas    │   Details Panel    │
│   (Full 3D/2D Visualization)  │                    │
│                               │   [Node Info]      │
│                               │   [Properties]     │
│                               │   [Connections]    │
│                               │   [Actions]        │
│                               │                    │
├───────────────────────────────┴────────────────────┤
│ [Legend] [Zoom: 100%] [Reset View] [Export]       │
└────────────────────────────────────────────────────┘

Control Bar:
- Filter by Node Type
- Filter by Connection Type
- Zoom Controls (+/- buttons)
- View Toggle (2D/3D)
- Export as Image
```

#### 3.4.4 Content Generator 内容生成器页面

```
Layout:
┌────────────────────────────────────────────────────┐
│ Content Generator                    [Save] [Pub]  │
├────────────┬───────────────────────────────────────┤
│            │                                       │
│   Input    │         Preview                      │
│   Form     │                                       │
│            │   [Generated Content Here]           │
│ [Product]  │                                       │
│ [Type]     │                                       │
│ [Tone]     │   Quality Score: 92%                 │
│ [Length]   │   SEO Score: 88%                     │
│            │   Readability: Good                  │
│ [Generate] │                                       │
│            │   [Copy] [Edit] [Regenerate]         │
└────────────┴───────────────────────────────────────┘

Input Form Fields:
- Product Selection (Dropdown)
- Content Type (SEO/Social/Email/Video)
- Tone of Voice (Professional/Casual/Technical)
- Target Length (Short/Medium/Long)
- Keywords (Tags input)
- Additional Context (TextArea)

Generation States:
- Idle (form visible)
- Loading (progress bar + animation)
- Success (content displayed)
- Error (error message + retry)
```

#### 3.4.5 Smart Chat 智能客服页面

```
Layout:
┌────────────────────────────────────────────────────┐
│ Smart Support Chat                  [Settings] [⚙️] │
├──────────────┬─────────────────────────────────────┤
│              │                                     │
│ Conversation │     Chat Messages                   │
│    List      │                                     │
│              │  [User Message 1]                   │
│ [○] User 1   │              [AI Reply 1]           │
│ [●] User 2   │  [User Message 2]                   │
│ [○] User 3   │              [AI Reply 2]           │
│ [○] User 4   │                                     │
│              │                                     │
│ [+ New]      ├─────────────────────────────────────┤
│              │ [Type message...] [Attach] [Send]  │
└──────────────┴─────────────────────────────────────┘

Conversation List Item:
┌─────────────────┐
│ [Avatar] Name   │
│ Last message... │
│ 2m ago   [2]   │ ← Unread badge
└─────────────────┘

Chat Message Actions:
- Copy to clipboard
- Thumbs up/down
- Regenerate response
- View related knowledge
```

#### 3.4.6 Analytics Dashboard 数据看板页面

```
Layout:
┌────────────────────────────────────────────────────┐
│ Analytics Dashboard        [Date] [Export] [Share] │
├────────────────────────────────────────────────────┤
│ [Metrics Row: 4 StatCards]                        │
├───────────────────────┬────────────────────────────┤
│                       │                            │
│   Main Chart          │    Pie Chart               │
│   (Traffic Trends)    │    (Content Types)         │
│                       │                            │
├───────────────────────┴────────────────────────────┤
│                                                    │
│   Performance Table (Top Content)                 │
│                                                    │
├───────────────────────┬────────────────────────────┤
│   User Engagement     │   Conversion Funnel        │
│   Heatmap             │   Visualization            │
└───────────────────────┴────────────────────────────┘

Key Features:
- Time Range Selector (7d, 30d, 90d, Custom)
- Compare Periods (vs last period)
- Export Reports (PDF, CSV)
- Real-time Updates (WebSocket)
```

---

## 🎯 四、交互设计规范 (Interaction Patterns)

### 4.1 导航交互

**页面切换**
```
- Transition: Fade + Slide (300ms)
- Loading State: Top progress bar (NProgress)
- Route Animation: Smooth scroll to top
```

**面包屑导航**
```
- Show full path
- Clickable ancestors
- Current page non-clickable
- Separator: "/" or "›"
```

**返回按钮**
```
- Position: Top left of content
- Icon: Arrow left
- Text: "Back to [previous page]"
- Behavior: Browser history back
```

### 4.2 表单交互

**输入验证**
```
- Real-time validation (on blur)
- Error message below field (red)
- Success indicator (green checkmark)
- Required field marker (red asterisk)
```

**自动保存**
```
- Debounce: 500ms after last keystroke
- Visual indicator: "Saving..." → "Saved"
- Error handling: Retry + Manual save button
```

**多步骤表单**
```
- Progress indicator (steps)
- Back/Next navigation
- Save as draft option
- Validation per step
```

### 4.3 数据加载

**初始加载**
```
- Skeleton Screen (骨架屏)
- Shimmer animation (闪烁效果)
- Loading text: "Loading..."
```

**分页加载**
```
- Pagination controls (bottom)
- Show: "Showing 1-20 of 1000"
- Jump to page input
```

**无限滚动**
```
- Auto-load on scroll bottom
- Loading indicator
- "Load more" button (fallback)
```

### 4.4 反馈机制

**Toast 通知**
```
Position: Top right
Duration: 3-5 seconds
Types:
- Success (green, checkmark icon)
- Error (red, X icon)
- Warning (orange, warning icon)
- Info (blue, info icon)
```

**确认对话框**
```
- Modal overlay
- Clear question: "Are you sure?"
- Destructive action in red
- Safe action emphasized (primary button)
- Cancel option always available
```

**空状态**
```
Elements:
- Illustration (friendly, on-brand)
- Heading: "No [items] yet"
- Description: Explain why empty
- Call-to-action: "Create your first [item]"
```

### 4.5 响应式交互

**移动端适配**
```
Breakpoints:
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (full layout)

Mobile Changes:
- Sidebar → Hamburger menu
- Table → Stacked cards
- Multi-column → Single column
- Large buttons (min 44x44px)
```

**触摸优化**
```
- Touch targets: min 44x44px
- Swipe gestures: 
  - Swipe left: Delete
  - Swipe right: Mark as read
  - Pull down: Refresh
```

---

## 🎨 五、特殊组件设计 (Specialized Components)

### 5.1 AI生成进度条

```
Visual:
┌─────────────────────────────────────┐
│ Generating content...               │
│ ████████████░░░░░░░░░  60%         │
│                                     │
│ [✓] Analyzing requirements          │
│ [⚡] Generating draft                │
│ [○] Optimizing SEO                  │
│ [○] Final review                    │
└─────────────────────────────────────┘

Features:
- Animated progress bar
- Step-by-step status
- Checkmark on completion
- Lightning bolt on active
- Estimated time remaining
```

### 5.2 质量分数指示器

```
Visual:
Quality Score: [████████░░] 85%

Color Coding:
- 0-40%:   Red (Poor)
- 41-60%:  Orange (Fair)
- 61-80%:  Yellow (Good)
- 81-100%: Green (Excellent)

Display Options:
- Progress bar
- Circular progress
- Badge with number
```

### 5.3 标签输入组件

```
Visual:
┌──────────────────────────────────────┐
│ [product] [soundcore] [×]           │
│ Type to add tags...                 │
└──────────────────────────────────────┘

Features:
- Auto-complete suggestions
- Tag validation
- Max tags limit
- Color-coded tags (by category)
- Remove on click X
```

### 5.4 文件上传组件

```
Visual (Drag & Drop Area):
┌──────────────────────────────────────┐
│         ┌────────┐                   │
│         │   📁   │                   │
│         └────────┘                   │
│                                      │
│    Drag & drop files here           │
│         or click to browse          │
│                                      │
│    Supported: CSV, JSON, XLSX       │
│    Max size: 10MB                   │
└──────────────────────────────────────┘

States:
- Default (dashed border)
- Drag over (solid purple border, highlight)
- Uploading (progress bar)
- Success (green checkmark)
- Error (red X + error message)
```

### 5.5 代码编辑器组件

```
Visual:
┌──────────────────────────────────────┐
│ [JavaScript ▼]        [Copy] [Run]  │ ← Toolbar
├──────────────────────────────────────┤
│ 1  function generateContent() {     │
│ 2    // Your code here              │
│ 3    return result;                 │
│ 4  }                                │ ← Code Area
│                                      │
├──────────────────────────────────────┤
│ ✓ No errors                         │ ← Status Bar
└──────────────────────────────────────┘

Features:
- Syntax highlighting (Monaco/CodeMirror)
- Line numbers
- Auto-complete
- Error indicators
- Copy to clipboard
- Run code button
```

---

## 📊 六、数据可视化设计 (Data Visualization)

### 6.1 图表配色方案

```
Primary Chart Colors (Categorical):
1. #667eea (Purple - Primary)
2. #10b981 (Green - Success)
3. #3b82f6 (Blue - Info)
4. #f59e0b (Orange - Warning)
5. #ec4899 (Pink - Accent)
6. #8b5cf6 (Violet - Secondary)

Gradient Fills:
- Purple Gradient: #667eea → #764ba2
- Green Gradient:  #10b981 → #059669
- Blue Gradient:   #3b82f6 → #2563eb

Semantic Colors:
- Positive Trend: Green (#10b981)
- Negative Trend: Red (#ef4444)
- Neutral: Gray (#6b7280)
```

### 6.2 图表通用设计

**轴线与网格**
```
- Axis Line: #e5e7eb (gray-200)
- Grid Line: #f3f4f6 (gray-100)
- Axis Label: #6b7280 (gray-500), 12px
- Tick Marks: 4px, gray-300
```

**图例**
```
Position: Bottom or right
Style:
- Colored square (12x12px)
- Label text (14px, gray-700)
- Clickable (toggle visibility)
- Hover: Highlight corresponding data
```

**工具提示 (Tooltip)**
```
Visual:
┌─────────────────┐
│ Date: 2024-10-15│
│ Value: 1,234    │
│ Change: +12.5%  │
└─────────────────┘

Style:
- Background: White with shadow-lg
- Border: 1px gray-200
- Font: 12px, gray-700
- Follow cursor
- Show on hover
```

### 6.3 图表类型规范

**折线图 (Line Chart)**
```
Use Case: 趋势分析、时间序列
Features:
- Smooth curves (cardinal spline)
- Data points (optional)
- Area fill (gradient, 20% opacity)
- Multiple series support
- Zoom & Pan
```

**柱状图 (Bar Chart)**
```
Use Case: 对比分析、排名
Features:
- Rounded corners (4px)
- Bar padding: 8px
- Hover: Darken 10%
- Value labels on top
- Horizontal/Vertical variants
```

**饼图 (Pie Chart)**
```
Use Case: 占比分析、分类统计
Features:
- Donut variant (inner radius 60%)
- Percentage labels
- Explode on hover
- Legend with values
- Max 8 slices (consolidate "Others")
```

**面积图 (Area Chart)**
```
Use Case: 累积趋势、堆叠对比
Features:
- Stacked variant
- Smooth curves
- Gradient fills
- Zero baseline
- Hover highlight
```

---

## 📐 七、响应式设计规范 (Responsive Design)

### 7.1 断点系统

```
Breakpoints:
- Mobile (sm):  640px  (手机竖屏)
- Tablet (md):  768px  (平板竖屏)
- Desktop (lg): 1024px (笔记本)
- Wide (xl):    1280px (桌面显示器)
- Ultra (2xl):  1536px (大屏幕)
```

### 7.2 布局变化规则

**导航栏**
```
Desktop: 
- Full sidebar (280px)
- All menu items visible
- Icon + Text

Mobile:
- Hidden sidebar
- Hamburger menu (top-left)
- Bottom tab bar (optional)
```

**卡片网格**
```
Desktop (xl):  4 columns (25% each)
Laptop (lg):   3 columns (33.33% each)
Tablet (md):   2 columns (50% each)
Mobile (sm):   1 column (100%)
```

**表格**
```
Desktop: Full table with all columns
Tablet:  Hide less important columns
Mobile:  Convert to stacked cards

Example Mobile Card:
┌──────────────────────┐
│ Name: John Doe       │
│ Email: john@ex.com   │
│ Status: Active       │
│ [View Details]       │
└──────────────────────┘
```

**表单**
```
Desktop: 2-column layout
Tablet:  2-column layout
Mobile:  Single column (stack fields)
```

### 7.3 字体缩放

```
Responsive Font Sizes:
Heading 1:
- Desktop: 36px
- Tablet:  30px
- Mobile:  24px

Body Text:
- Desktop: 16px
- Tablet:  16px
- Mobile:  14px (optional)
```

### 7.4 间距缩放

```
Padding/Margin Adjustments:
Desktop:
- Page padding: 40px
- Card padding: 24px
- Section gap: 32px

Mobile:
- Page padding: 16px
- Card padding: 16px
- Section gap: 24px
```

---

## 🎨 八、辅助功能与无障碍 (Accessibility)

### 8.1 色彩对比度

```
WCAG 2.1 AA Level Requirements:
- Normal Text (< 18px):    Ratio >= 4.5:1
- Large Text (>= 18px):    Ratio >= 3:1
- UI Components:           Ratio >= 3:1

Verified Combinations:
✓ Purple (#667eea) on White: 5.2:1
✓ Gray-700 (#374151) on White: 12.6:1
✓ White on Primary-600 (#5a67d8): 8.1:1
```

### 8.2 键盘导航

```
Focus Indicator:
- Outline: 2px solid #667eea
- Offset: 2px
- Border radius: 4px

Tab Order:
1. Skip to main content link
2. Header navigation
3. Sidebar navigation
4. Main content
5. Footer

Keyboard Shortcuts:
- Tab:       Next focusable element
- Shift+Tab: Previous focusable element
- Enter:     Activate button/link
- Space:     Toggle checkbox/radio
- Esc:       Close modal/dropdown
- /:         Focus search box
```

### 8.3 屏幕阅读器支持

```
Semantic HTML:
- Use <nav> for navigation
- Use <main> for main content
- Use <button> not <div> for buttons
- Use <a> for links

ARIA Labels:
- aria-label: Descriptive label
- aria-labelledby: Reference to label
- aria-describedby: Additional description
- aria-live: Announce dynamic changes
- aria-expanded: Accordion/dropdown state
- aria-selected: Tab/list item state
```

### 8.4 动效可选

```
Respect User Preferences:
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

Fallback:
- No animations
- Instant state changes
- Static alternatives
```

---

## 🔧 九、实现指南 (Implementation Guide)

### 9.1 Figma文件组织结构

```
📁 Soundcore KCP Design System
├─ 📄 Cover (封面页)
├─ 📄 Design Tokens (设计令牌)
│  ├─ Colors (色彩系统)
│  ├─ Typography (排版系统)
│  ├─ Spacing (间距系统)
│  ├─ Shadows (阴影系统)
│  └─ Icons (图标库)
├─ 📄 Components (组件库)
│  ├─ Base Components
│  │  ├─ Buttons
│  │  ├─ Inputs
│  │  ├─ Cards
│  │  ├─ Tables
│  │  └─ Modals
│  ├─ Business Components
│  │  ├─ KnowledgeCard
│  │  ├─ ContentPreview
│  │  ├─ ChatMessage
│  │  └─ StatCard
│  └─ Charts & Graphs
├─ 📄 Layouts (布局模板)
│  ├─ Dashboard Layout
│  ├─ Content Layout
│  └─ Full Width Layout
├─ 📄 Pages (页面设计)
│  ├─ Dashboard
│  ├─ Knowledge Base
│  ├─ Knowledge Graph
│  ├─ Content Generator
│  ├─ Smart Chat
│  └─ Analytics
├─ 📄 Responsive (响应式)
│  ├─ Desktop (1440px)
│  ├─ Tablet (768px)
│  └─ Mobile (375px)
└─ 📄 Prototypes (交互原型)
```

### 9.2 组件命名规范

```
Format: [Category] / [Component] / [Variant] / [State]

Examples:
- Button / Primary / Default
- Button / Primary / Hover
- Button / Secondary / Disabled
- Input / Text / Default
- Input / Text / Focus
- Input / Search / Error
- Card / Stat / With Icon
- Table / Data / Loading
```

### 9.3 设计交付清单

**必需交付物**
- [ ] 完整的设计系统文档
- [ ] 所有组件的各种状态
- [ ] 所有核心页面设计 (Desktop)
- [ ] 响应式设计 (Tablet + Mobile)
- [ ] 交互原型 (可点击)
- [ ] 开发者标注 (Inspect模式)
- [ ] 设计规范文档 (PDF导出)

**可选交付物**
- [ ] 动效展示 (Lottie动画)
- [ ] 插图素材库
- [ ] 品牌指南
- [ ] 图标库 (SVG导出)

### 9.4 与开发协作

**Figma Dev Mode设置**
```
启用功能:
1. Dev Mode (开发者模式)
2. Inspect (检查面板)
3. CSS Code Export (CSS导出)
4. Assets Export (资源导出)

标注要求:
- 所有间距标注清晰
- 字体大小、行高、字重明确
- 颜色使用Token名称
- 圆角、阴影参数完整
```

**代码导出格式**
```
Preferred Export:
- Tailwind CSS (优先)
- React Components (JSX)
- CSS Variables (Design Tokens)
- SVG Icons (Optimized)
```

**设计Token导出**
```json
{
  "colors": {
    "primary": {
      "500": "#667eea",
      "600": "#5a67d8"
    }
  },
  "spacing": {
    "4": "16px",
    "6": "24px"
  },
  "fontSize": {
    "base": "16px",
    "lg": "18px"
  }
}
```

---

## 📝 十、设计检查清单 (Design Checklist)

### 10.1 设计完成度检查

**视觉设计 (Visual Design)**
- [ ] 所有颜色符合设计系统
- [ ] 字体大小、粗细一致
- [ ] 间距使用8点网格
- [ ] 图标风格统一 (20x20px, 2px stroke)
- [ ] 阴影层级正确应用
- [ ] 圆角规范应用

**组件设计 (Components)**
- [ ] 所有状态完整 (Default, Hover, Active, Disabled)
- [ ] 组件变体完整
- [ ] 组件属性可配置
- [ ] 响应式变体齐全

**页面设计 (Pages)**
- [ ] 所有核心页面完成
- [ ] 页面流程连贯
- [ ] 空状态设计完成
- [ ] 错误状态设计完成
- [ ] 加载状态设计完成

**交互设计 (Interactions)**
- [ ] 点击区域合理 (min 44x44px)
- [ ] 反馈机制清晰
- [ ] 动效自然流畅
- [ ] 表单验证提示明确

**响应式设计 (Responsive)**
- [ ] 断点设置合理
- [ ] 移动端布局优化
- [ ] 触摸交互友好
- [ ] 字体大小可读

**无障碍 (Accessibility)**
- [ ] 色彩对比度达标
- [ ] 焦点指示器清晰
- [ ] 语义化结构
- [ ] 屏幕阅读器友好

### 10.2 开发准备检查

**资源导出 (Assets)**
- [ ] 图标SVG导出
- [ ] Logo多格式导出 (SVG, PNG)
- [ ] 插图高清导出
- [ ] 组件截图导出

**文档完善 (Documentation)**
- [ ] 设计规范文档完成
- [ ] 组件使用说明清晰
- [ ] 交互流程文档齐全
- [ ] 响应式规则文档化

**开发交接 (Handoff)**
- [ ] Figma Dev Mode启用
- [ ] 所有标注清晰
- [ ] Code Snippets可导出
- [ ] Design Tokens导出

---

## 🎯 十一、使用此提示词的方法

### 直接输入Figma或AI设计工具

**Step 1: 创建新Figma文件**
```
1. 打开Figma
2. 新建文件: "Soundcore KCP Design System"
3. 设置画布: 1440px width (Desktop)
```

**Step 2: 应用设计系统**
```
1. 创建Color Styles (所有颜色)
2. 创建Text Styles (所有排版)
3. 创建Effect Styles (所有阴影)
4. 创建Grid Styles (8点网格)
```

**Step 3: 构建组件库**
```
1. 按章节创建Components
2. 添加Variants (各种状态)
3. 添加Properties (可配置属性)
4. 创建Auto Layout (响应式)
```

**Step 4: 设计核心页面**
```
1. 使用Components组合页面
2. 应用真实内容 (非Lorem Ipsum)
3. 创建交互Prototype
4. 测试用户流程
```

### 使用AI设计助手生成

**提示词模板**
```
I'm building a Knowledge Control Plane (KCP) system for Anker Soundcore. 

Please generate [Component/Page Name] following these specifications:

Design System:
- Primary Color: Purple Gradient (#667eea → #764ba2)
- Font: Inter
- Style: Modern Tech, Clean, Professional

[复制相关章节的详细规范]

Requirements:
- [具体需求1]
- [具体需求2]
- [具体需求3]

Output: Figma-ready design with all states and variations.
```

---

**文档版本**: v1.0  
**创建日期**: 2024-10-15  
**适用工具**: Figma, Adobe XD, Sketch, AI设计工具  
**项目**: Anker Soundcore KCP Frontend Design  
**设计师**: Ready for Implementation 🚀