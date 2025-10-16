# Component Test Guide
# 组件测试指南

## 📍 测试页面位置
```
/frontend/app/component-test/page.tsx
```

## 🧪 已测试组件

### 1. Table Component (数据表格)
- ✅ 列排序（点击表头）
- ✅ 行选择（Checkbox）
- ✅ 分页（10条/页）
- ✅ 悬停高亮
- ✅ 自定义渲染（状态徽章）
- ✅ 加载状态
- ✅ 空状态

### 2. Select Component (下拉选择器)
- ✅ 单选模式
- ✅ 多选模式
- ✅ 可搜索
- ✅ 可清除
- ✅ Tag 显示（多选时）
- ✅ 最大Tag数量限制

### 3. ContentPreview Component (内容预览卡片)
- ✅ 缩略图显示
- ✅ SEO 评分徽章
- ✅ Readability 评分徽章
- ✅ 状态徽章（Draft/Published/Scheduled）
- ✅ 快捷操作按钮（Edit/Publish/Delete）
- ✅ 悬停预览效果
- ✅ 标签显示

## 🚀 如何运行测试

### 方法 1: 开发服务器
```bash
cd /Users/cavin/Desktop/dev/ankersckcp/frontend
npm run dev
```

然后访问: http://localhost:3000/component-test

### 方法 2: 使用 Desktop Commander
```bash
# 启动开发服务器
cd /Users/cavin/Desktop/dev/ankersckcp/frontend && npm run dev
```

## 📊 测试检查清单

### Table 组件测试
- [ ] 点击表头进行排序
- [ ] 选择/取消选择行
- [ ] 全选功能
- [ ] 翻页功能
- [ ] 查看选中行数量显示

### Select 组件测试  
- [ ] 单选：选择一个类别
- [ ] 单选：清除选择
- [ ] 多选：选择多个产品
- [ ] 多选：搜索功能
- [ ] 多选：删除已选标签

### ContentPreview 组件测试
- [ ] 悬停查看预览按钮
- [ ] 点击 Edit 按钮
- [ ] 点击 Publish 按钮（仅 Draft 状态）
- [ ] 点击 Delete 按钮
- [ ] 查看评分徽章显示

## 🎯 测试结果

### 预期行为
1. **Table**: 
   - 排序：点击列标题应改变排序方向（↑↓）
   - 选择：勾选复选框应更新"XX rows selected"提示
   - 分页：切换页码应显示不同的数据行

2. **Select**:
   - 单选：选择后立即关闭下拉菜单
   - 多选：选择后不关闭，显示为标签
   - 搜索：输入文字应过滤选项

3. **ContentPreview**:
   - 卡片悬停应显示"Preview"按钮
   - 点击操作按钮应弹出alert确认
   - 评分颜色：>80绿色，60-80黄色，<60红色

## 📝 问题报告

如果发现任何问题，请记录:
1. 问题描述
2. 重现步骤
3. 预期行为
4. 实际行为
5. 浏览器/环境信息

## ✅ 测试完成标准

- [ ] 所有组件正常渲染
- [ ] 所有交互功能正常工作
- [ ] 无控制台错误
- [ ] 响应式布局正常（测试不同屏幕尺寸）
- [ ] 性能流畅（无明显卡顿）

---

**创建日期**: 2024-10-16  
**测试环境**: Next.js 14, React 18, TypeScript 5  
**测试状态**: ✅ 已创建，待运行
