# KCP Design System 组件库

基于 Figma 设计系统的完整 React 组件库，支持 TypeScript 类型安全和完整的设计 Token 系统。

**版本**: 1.0.0
**更新时间**: 2025-10-16
**设计系统同步**: 自动同步自 Figma (ctmaLDzdgeg1nMpdHnMpvd)

---

## 📦 组件清单

### 基础组件 (UI Components)

| 组件 | 状态 | 说明 |
|------|------|------|
| Button | ✅ 完成 | 按钮组件 (6 variants, 3 sizes) |
| Input | ✅ 完成 | 输入框组件 (多种类型和状态) |
| Card | ✅ 完成 | 卡片组件 (含 StatCard 统计卡片) |
| Modal | ✅ 完成 | 模态框组件 (含 ConfirmModal 确认对话框) |
| Table | ✅ 完成 | 表格组件 (排序、筛选、分页) |
| Select | ✅ 完成 | 选择器组件 (单选/多选、搜索) |
| **Tabs** | ✅ **新增** | 标签页组件 (3 variants: line, card, pill) |
| **Dropdown** | ✅ **新增** | 下拉菜单组件 (键盘导航、分组) |

### 布局组件 (Layout Components)

| 组件 | 状态 | 说明 |
|------|------|------|
| MainLayout | ✅ 完成 | 主布局容器 |
| Sidebar | ✅ 完成 | 侧边栏导航 |
| TopBar | ✅ 完成 | 顶部导航栏 |

### 业务组件 (Business Components)

| 组件 | 状态 | 说明 |
|------|------|------|
| KnowledgeCard | ✅ 完成 | 知识卡片 |
| 更多... | ⏳ 计划中 | 待补充 |

---

## 🎨 设计系统集成

所有组件完全基于同步的设计系统 Token，确保 100% 设计一致性。

### 颜色系统

组件使用 Tailwind CSS 类名，自动映射到设计系统颜色：

```tsx
// 主色调
<Button variant="primary">   // bg-primary-500
<Button variant="secondary">  // bg-secondary-100

// 功能色
<Button variant="danger">     // bg-error-500

// 文本颜色
className="text-primary-700"  // 主色文本
className="text-gray-600"     // 次要文本
```

**可用颜色**:
- `primary-*`: 主色 (蓝色系)
- `secondary-*`: 次要色 (粉色系)
- `success-*`: 成功色 (绿色系)
- `warning-*`: 警告色 (橙色系)
- `error-*`: 错误色 (红色系)
- `info-*`: 信息色 (蓝色系)
- `gray-*`: 灰色系

每个颜色有 50-900 的色阶，如 `primary-50`, `primary-100`, ..., `primary-900`。

### 间距系统

```tsx
// Tailwind 间距类名 → 设计系统 Token
className="p-4"   // padding: 1rem (16px)
className="gap-2" // gap: 0.5rem (8px)
className="m-6"   // margin: 1.5rem (24px)
```

### 字体系统

```tsx
// 字号
className="text-sm"    // 14px
className="text-base"  // 16px
className="text-lg"    // 18px
className="text-xl"    // 20px
className="text-2xl"   // 24px

// 字重
className="font-medium"    // 500
className="font-semibold"  // 600
className="font-bold"      // 700
```

### 圆角和阴影

```tsx
// 圆角
className="rounded-md"  // 6px
className="rounded-lg"  // 8px
className="rounded-xl"  // 12px

// 阴影
className="shadow-sm"  // 小阴影
className="shadow-md"  // 中阴影
className="shadow-lg"  // 大阴影
```

---

## 📚 组件使用指南

### Button 按钮

**Props**:
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}
```

**示例**:
```tsx
import { Button } from '@/components/ui';

// 基础用法
<Button variant="primary">确认</Button>
<Button variant="secondary">取消</Button>
<Button variant="outline">更多</Button>

// 尺寸
<Button size="small">小按钮</Button>
<Button size="medium">中按钮</Button>
<Button size="large">大按钮</Button>

// 加载状态
<Button loading={isLoading}>提交中...</Button>

// 带图标
<Button icon={<PlusIcon />} iconPosition="left">
  添加知识
</Button>

// 全宽按钮
<Button fullWidth>确认操作</Button>

// 危险操作
<Button variant="danger" onClick={handleDelete}>
  删除
</Button>
```

---

### Input 输入框

**Props**:
```tsx
interface InputProps {
  variant?: 'default' | 'search' | 'password';
  size?: 'small' | 'medium' | 'large';
  status?: 'default' | 'error' | 'warning' | 'success';
  label?: string;
  helperText?: string;
  clearable?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}
```

**示例**:
```tsx
import { Input } from '@/components/ui';

// 基础用法
<Input
  label="标题"
  placeholder="请输入标题"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

// 搜索框
<Input
  variant="search"
  placeholder="搜索知识..."
  clearable
  prefixIcon={<SearchIcon />}
/>

// 密码输入
<Input
  variant="password"
  label="密码"
  placeholder="请输入密码"
/>

// 错误状态
<Input
  status="error"
  label="邮箱"
  value={email}
  helperText="邮箱格式不正确"
/>

// 成功状态
<Input
  status="success"
  label="用户名"
  value={username}
  helperText="用户名可用"
/>
```

---

### Card 卡片

**Props**:
```tsx
interface CardProps {
  variant?: 'default' | 'bordered' | 'hoverable' | 'interactive';
  padding?: 'none' | 'small' | 'medium' | 'large';
  header?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  icon?: ReactNode;
  description?: string;
}
```

**示例**:
```tsx
import { Card, StatCard } from '@/components/ui';

// 基础卡片
<Card variant="hoverable">
  <h3 className="text-lg font-semibold">卡片标题</h3>
  <p className="mt-2 text-gray-600">卡片内容</p>
</Card>

// 带头部和底部
<Card
  header={
    <h3 className="text-lg font-semibold">知识详情</h3>
  }
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="ghost">取消</Button>
      <Button variant="primary">保存</Button>
    </div>
  }
>
  <p>卡片内容区域</p>
</Card>

// 统计卡片
<StatCard
  title="总知识量"
  value="2,847"
  trend={{ value: 12.5, isPositive: true }}
  icon={<BookIcon />}
  description="较上月增长"
/>

<StatCard
  title="响应时间"
  value="245ms"
  trend={{ value: -8.2, isPositive: true }}
  icon={<ClockIcon />}
  description="较上月优化"
/>
```

---

### Modal 模态框

**Props**:
```tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  variant?: 'default' | 'centered';
  footer?: ReactNode;
  maskClosable?: boolean;
  closeIcon?: boolean;
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  type?: 'info' | 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}
```

**示例**:
```tsx
import { Modal, ConfirmModal } from '@/components/ui';

// 基础模态框
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="编辑知识"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        取消
      </Button>
      <Button variant="primary" onClick={handleSave}>
        保存
      </Button>
    </div>
  }
>
  <form>
    <Input label="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
    <Input label="描述" value={desc} onChange={(e) => setDesc(e.target.value)} />
  </form>
</Modal>

// 确认对话框
<ConfirmModal
  open={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="确认删除"
  description="此操作不可撤销，确定要删除这条知识吗？"
  type="danger"
  confirmText="确认删除"
  cancelText="取消"
/>

// 大尺寸模态框
<Modal open={isOpen} onClose={() => setIsOpen(false)} size="large" title="详细信息">
  {/* 内容 */}
</Modal>
```

---

### Table 表格

**Props**:
```tsx
interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  rowSelection?: RowSelectionConfig;
  onRowClick?: (record: T) => void;
  emptyText?: string;
}

interface Column<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  sorter?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}
```

**示例**:
```tsx
import { Table } from '@/components/ui';

const columns = [
  { key: 'id', title: 'ID', dataIndex: 'id', width: 80, sorter: true },
  { key: 'title', title: '标题', dataIndex: 'title', sorter: true },
  { key: 'category', title: '分类', dataIndex: 'category' },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: (status) => (
      <span className={status === 'active' ? 'text-success-600' : 'text-gray-500'}>
        {status === 'active' ? '活跃' : '归档'}
      </span>
    ),
  },
  {
    key: 'actions',
    title: '操作',
    render: (_, record) => (
      <div className="flex gap-2">
        <Button size="small" variant="ghost" onClick={() => handleEdit(record.id)}>
          编辑
        </Button>
        <Button size="small" variant="ghost" onClick={() => handleDelete(record.id)}>
          删除
        </Button>
      </div>
    ),
  },
];

<Table
  columns={columns}
  dataSource={knowledgeList}
  loading={isLoading}
  pagination={{
    current: page,
    pageSize: 10,
    total: totalCount,
    onChange: setPage,
  }}
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: setSelectedKeys,
  }}
  onRowClick={(record) => router.push(`/knowledge/${record.id}`)}
/>
```

---

### Select 选择器

**Props**:
```tsx
interface SelectProps {
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  size?: 'small' | 'medium' | 'large';
}
```

**示例**:
```tsx
import { Select } from '@/components/ui';

// 单选
<Select
  options={[
    { label: '全部分类', value: 'all' },
    { label: '产品知识', value: 'product' },
    { label: '技术支持', value: 'support' },
    { label: '市场营销', value: 'marketing' },
  ]}
  value={category}
  onChange={setCategory}
  placeholder="选择分类"
/>

// 多选
<Select
  multiple
  options={tagOptions}
  value={selectedTags}
  onChange={setSelectedTags}
  placeholder="选择标签"
/>

// 可搜索
<Select
  searchable
  options={userOptions}
  value={assignee}
  onChange={setAssignee}
  placeholder="分配给..."
/>

// 可清除
<Select
  clearable
  options={statusOptions}
  value={status}
  onChange={setStatus}
  placeholder="筛选状态"
/>
```

---

### Tabs 标签页 ⭐ 新增

**Props**:
```tsx
interface TabsProps {
  tabs: Tab[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  variant?: 'line' | 'card' | 'pill';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}
```

**示例**:
```tsx
import { Tabs } from '@/components/ui';

// 线条式标签页 (默认)
<Tabs
  variant="line"
  tabs={[
    {
      key: 'overview',
      label: '概览',
      icon: <DashboardIcon />,
      content: <DashboardContent />,
    },
    {
      key: 'knowledge',
      label: '知识库',
      icon: <BookIcon />,
      content: <KnowledgeList />,
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingsIcon />,
      content: <Settings />,
    },
  ]}
/>

// 卡片式标签页
<Tabs
  variant="card"
  tabs={[
    { key: 'tab1', label: '标签1', content: <div>内容1</div> },
    { key: 'tab2', label: '标签2', content: <div>内容2</div> },
  ]}
/>

// 胶囊式标签页
<Tabs
  variant="pill"
  size="small"
  tabs={[
    { key: 'all', label: '全部', content: <AllItems /> },
    { key: 'active', label: '活跃', content: <ActiveItems /> },
    { key: 'archived', label: '归档', content: <ArchivedItems /> },
  ]}
/>

// 受控模式
<Tabs
  activeKey={activeTab}
  onChange={setActiveTab}
  tabs={tabs}
/>

// 禁用某个标签
<Tabs
  tabs={[
    { key: 'tab1', label: '可用', content: <div>内容</div> },
    { key: 'tab2', label: '禁用', disabled: true, content: <div>内容</div> },
  ]}
/>
```

---

### Dropdown 下拉菜单 ⭐ 新增

**Props**:
```tsx
interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  disabled?: boolean;
  onItemClick?: (key: string) => void;
}

interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick?: () => void;
}
```

**示例**:
```tsx
import { Dropdown } from '@/components/ui';

// 基础用法
<Dropdown
  items={[
    { key: 'edit', label: '编辑', icon: <EditIcon /> },
    { key: 'copy', label: '复制', icon: <CopyIcon /> },
    { key: 'divider-1', label: '', divider: true },
    { key: 'delete', label: '删除', icon: <DeleteIcon />, danger: true },
  ]}
  onItemClick={(key) => {
    if (key === 'edit') handleEdit();
    if (key === 'copy') handleCopy();
    if (key === 'delete') handleDelete();
  }}
/>

// 自定义触发器
<Dropdown
  trigger={
    <Button variant="ghost" icon={<MoreVerticalIcon />}>
      更多操作
    </Button>
  }
  items={menuItems}
/>

// 不同位置
<Dropdown placement="bottom-end" items={items} />
<Dropdown placement="top-start" items={items} />

// 禁用某个选项
<Dropdown
  items={[
    { key: 'action1', label: '操作1' },
    { key: 'action2', label: '操作2（禁用）', disabled: true },
    { key: 'action3', label: '操作3' },
  ]}
/>

// 危险操作样式
<Dropdown
  items={[
    { key: 'rename', label: '重命名' },
    { key: 'move', label: '移动' },
    { key: 'divider', label: '', divider: true },
    { key: 'delete', label: '永久删除', danger: true },
  ]}
/>
```

---

## 🎯 完整示例：Dashboard 页面

结合多个组件创建完整的 Dashboard：

```tsx
import {
  Button,
  Input,
  Card,
  StatCard,
  Modal,
  Table,
  Select,
  Tabs,
  Dropdown,
} from '@/components/ui';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="总知识量"
          value="2,847"
          trend={{ value: 12.5, isPositive: true }}
          icon={<BookIcon />}
        />
        <StatCard
          title="今日查询"
          value="1,234"
          trend={{ value: 8.3, isPositive: true }}
          icon={<SearchIcon />}
        />
        <StatCard
          title="响应时间"
          value="245ms"
          trend={{ value: -8.2, isPositive: true }}
          icon={<ClockIcon />}
        />
        <StatCard
          title="满意度"
          value="96.5%"
          trend={{ value: 2.1, isPositive: true }}
          icon={<SmileIcon />}
        />
      </div>

      {/* 过滤和搜索 */}
      <Card>
        <div className="flex items-center gap-4">
          <Input
            variant="search"
            placeholder="搜索知识..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            clearable
            className="flex-1"
          />
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="分类"
          />
          <Button
            variant="primary"
            icon={<PlusIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            添加知识
          </Button>
        </div>
      </Card>

      {/* 标签页内容 */}
      <Tabs
        variant="line"
        tabs={[
          {
            key: 'all',
            label: '全部知识',
            icon: <ListIcon />,
            content: <KnowledgeTable />,
          },
          {
            key: 'recent',
            label: '最近更新',
            icon: <ClockIcon />,
            content: <RecentKnowledgeTable />,
          },
          {
            key: 'popular',
            label: '热门知识',
            icon: <TrendingIcon />,
            content: <PopularKnowledgeTable />,
          },
        ]}
      />

      {/* 添加知识模态框 */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="添加新知识"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={handleSave}>
              保存
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <Input label="标题" placeholder="请输入知识标题" required />
          <Select label="分类" options={categoryOptions} placeholder="选择分类" />
          <Input label="描述" placeholder="简要描述" />
        </form>
      </Modal>
    </div>
  );
}
```

---

## 🔧 TypeScript 类型支持

所有组件都提供完整的 TypeScript 类型定义：

```tsx
import type {
  ButtonProps,
  InputProps,
  CardProps,
  StatCardProps,
  ModalProps,
  ConfirmModalProps,
  TableProps,
  Column,
  SelectProps,
  TabsProps,
  Tab,
  DropdownProps,
  DropdownItem,
} from '@/components/ui';

// 类型安全的组件使用
const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};

// 扩展组件 Props
interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}
```

---

## 🎨 自定义主题

所有组件颜色通过 Tailwind 配置，可以在 `tailwind.config.ts` 中自定义：

```typescript
// tailwind.config.ts
import { colors } from './styles/design-system';

export default {
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
      },
    },
  },
};
```

设计系统自动同步会更新这些颜色定义。

---

## 📖 最佳实践

### 1. 使用设计 Token

❌ 不要硬编码颜色和间距：
```tsx
<div style={{ color: '#667eea', padding: '16px' }}>
```

✅ 使用 Tailwind 类名：
```tsx
<div className="text-primary-500 p-4">
```

### 2. 组件组合

优先使用组合而不是创建新组件：

```tsx
// ✅ 组合现有组件
function KnowledgeCard({ knowledge }) {
  return (
    <Card variant="hoverable">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{knowledge.title}</h3>
        <Dropdown
          items={[
            { key: 'edit', label: '编辑' },
            { key: 'delete', label: '删除', danger: true },
          ]}
        />
      </div>
      <p className="mt-2 text-gray-600">{knowledge.description}</p>
    </Card>
  );
}
```

### 3. 响应式设计

使用 Tailwind 响应式类名：

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard {...stats1} />
  <StatCard {...stats2} />
  <StatCard {...stats3} />
  <StatCard {...stats4} />
</div>
```

### 4. 可访问性

所有组件都支持基本的可访问性：

```tsx
// 自动处理 ARIA 属性
<Button aria-label="删除知识" icon={<DeleteIcon />} />

// Tabs 组件自动添加 role="tab" 和 aria-selected
<Tabs tabs={tabs} />

// Modal 组件自动添加 role="dialog" 和焦点管理
<Modal open={isOpen} onClose={handleClose}>
```

---

## 🚀 性能优化

### 1. 懒加载

对于大型表格和列表，使用虚拟滚动：

```tsx
import { Table } from '@/components/ui';

<Table
  columns={columns}
  dataSource={largeDataset}
  virtual  // 启用虚拟滚动
/>
```

### 2. 防抖和节流

对于搜索输入，使用防抖：

```tsx
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebouncedValue(searchQuery, 300);

<Input
  variant="search"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

### 3. Memo 优化

对于复杂组件，使用 React.memo：

```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <Card>{/* 复杂渲染 */}</Card>;
});
```

---

## 📝 更新日志

### v1.0.0 (2025-10-16)

**新增**:
- ✅ 添加 Tabs 组件 (line, card, pill 三种样式)
- ✅ 添加 Dropdown 组件 (支持键盘导航)
- ✅ 更新 Button 组件使用设计系统 Token

**改进**:
- ✅ 所有组件统一使用 Tailwind 类名
- ✅ 完整的 TypeScript 类型支持
- ✅ 自动化设计系统同步

**修复**:
- ✅ 修复 Table 排序问题
- ✅ 修复 Select 多选清除功能

---

## 🤝 贡献指南

### 添加新组件

1. 在 `components/ui/` 创建组件文件
2. 使用设计系统 Token
3. 添加 TypeScript 类型定义
4. 在 `components/ui/index.ts` 导出
5. 更新本文档

### 组件模板

```tsx
import React from 'react';

export interface MyComponentProps {
  variant?: 'default' | 'primary';
  size?: 'small' | 'medium' | 'large';
  // ... 其他 props
}

const MyComponent: React.FC<MyComponentProps> = ({
  variant = 'default',
  size = 'medium',
  ...props
}) => {
  // 使用设计系统 Token
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-500 text-white',
  };

  const sizeStyles = {
    small: 'text-sm p-2',
    medium: 'text-base p-3',
    large: 'text-lg p-4',
  };

  return (
    <div className={`${variantStyles[variant]} ${sizeStyles[size]}`}>
      {/* 组件内容 */}
    </div>
  );
};

export default MyComponent;
```

---

## 📞 支持

- **文档**: 本文件
- **设计规范**: `frontend/styles/design-system/`
- **问题反馈**: GitHub Issues
- **设计同步**: 自动从 Figma 同步 (每日 9:00 AM)

---

**最后更新**: 2025-10-16
**版本**: 1.0.0
**设计系统**: Soundcore-KCP-Design-System (ctmaLDzdgeg1nMpdHnMpvd)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
