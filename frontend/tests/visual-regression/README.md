# Visual Regression Testing

使用 Playwright 进行自动化视觉回归测试，确保设计系统更新后 UI 组件的视觉一致性。

## 🎯 目标

- ✅ 检测组件外观变化
- ✅ 防止意外的 UI 破坏
- ✅ 验证设计系统同步后的一致性
- ✅ 跨浏览器视觉一致性
- ✅ 响应式设计验证

## 📦 安装

```bash
# 安装 Playwright
npm install -D @playwright/test

# 安装浏览器
npx playwright install

# 或只安装 Chromium (更快)
npx playwright install chromium
```

## 🚀 运行测试

### 基础运行

```bash
# 运行所有视觉回归测试
npx playwright test tests/visual-regression/

# 运行特定测试
npx playwright test tests/visual-regression/components.spec.ts

# 仅在 Chromium 上运行
npx playwright test --project=chromium

# 运行并更新 baseline 截图
npx playwright test tests/visual-regression/ --update-snapshots
```

### 调试模式

```bash
# 以调试模式运行
npx playwright test tests/visual-regression/ --debug

# 使用 UI 模式
npx playwright test tests/visual-regression/ --ui

# 显示浏览器
npx playwright test tests/visual-regression/ --headed
```

### 查看测试报告

```bash
# 生成并打开 HTML 报告
npx playwright show-report

# 报告位置: playwright-report/index.html
```

## 📸 工作原理

### 1. Baseline 截图

首次运行时，Playwright 会为每个测试创建 baseline 截图：

```bash
npx playwright test tests/visual-regression/ --update-snapshots
```

截图保存在: `tests/visual-regression/*.spec.ts-snapshots/`

### 2. 对比检测

后续运行时，新截图会与 baseline 对比：

```typescript
await expect(element).toHaveScreenshot('button-variants.png', {
  maxDiffPixels: 100,  // 最大像素差异
  threshold: 0.2,      // 颜色差异阈值
});
```

### 3. 失败处理

如果检测到差异：
- ✅ 测试失败
- ✅ 生成差异对比图
- ✅ 保存实际截图和预期截图
- ✅ 在报告中高亮差异

## 📋 测试覆盖

### 组件测试

| 组件 | 测试项 | 状态 |
|------|--------|------|
| Button | Variants, Sizes, States (hover, loading, disabled) | ✅ |
| Input | Variants, States (default, focus, error, success) | ✅ |
| Card | Variants, StatCard, Hover effects | ✅ |
| Modal | Sizes, ConfirmModal | ✅ |
| Table | Layout, Selection, Sorting | ✅ |
| Tabs | Line, Card, Pill variants | ✅ |
| Dropdown | Closed/Open states, Hover, Icons | ✅ |
| Select | Closed/Open, Selected, Multi-select | ✅ |

### 设计系统测试

- ✅ 颜色调色板
- ✅ 字体排版
- ✅ 间距系统
- ✅ 圆角和阴影

### 响应式测试

- ✅ Mobile (375x667)
- ✅ Tablet (768x1024)
- ✅ Desktop (1920x1080)

### 浏览器测试

- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

## 🔧 配置

### Playwright 配置

配置文件: `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
});
```

### 环境变量

创建 `.env.test` 文件：

```bash
BASE_URL=http://localhost:3000
CI=false
```

## 📝 编写测试

### 基础模板

```typescript
import { test, expect } from '@playwright/test';

test.describe('Component Name', () => {
  test('should match visual snapshot', async ({ page }) => {
    await page.goto('/components/component-name');

    const element = page.locator('[data-testid="component"]');
    await expect(element).toHaveScreenshot('component-name.png');
  });

  test('should match hover state', async ({ page }) => {
    await page.goto('/components/component-name');

    const element = page.locator('[data-testid="component"]');
    await element.hover();
    await page.waitForTimeout(300); // Wait for transition

    await expect(element).toHaveScreenshot('component-hover.png');
  });
});
```

### 最佳实践

#### 1. 使用 data-testid

```tsx
// ✅ 推荐
<Button data-testid="primary-button">Click me</Button>

// ❌ 避免
<Button className="some-class">Click me</Button>
```

#### 2. 等待动画完成

```typescript
// 等待过渡动画
await page.waitForTimeout(300);

// 或等待特定状态
await page.waitForSelector('.animation-complete');
```

#### 3. 设置合理的差异阈值

```typescript
await expect(element).toHaveScreenshot('name.png', {
  maxDiffPixels: 100,  // 简单组件: 50-100
  // maxDiffPixels: 200,  // 复杂组件: 200-500
  // maxDiffPixels: 1000, // 整页: 1000-2000
});
```

#### 4. 处理动态内容

```typescript
// 隐藏时间戳或动态内容
await page.evaluate(() => {
  document.querySelectorAll('[data-timestamp]').forEach(el => {
    el.textContent = 'TIMESTAMP';
  });
});

await expect(page).toHaveScreenshot('page.png');
```

#### 5. 测试多种状态

```typescript
test.describe('Button States', () => {
  test('normal state', async ({ page }) => { /* ... */ });
  test('hover state', async ({ page }) => { /* ... */ });
  test('focus state', async ({ page }) => { /* ... */ });
  test('disabled state', async ({ page }) => { /* ... */ });
  test('loading state', async ({ page }) => { /* ... */ });
});
```

## 🔄 CI/CD 集成

### GitLab CI

已在 `.gitlab-ci-figma-sync.yml` 中配置：

```yaml
figma:visual-regression:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - cd frontend
    - npm ci
    - npx playwright install chromium
    - npx playwright test tests/visual-regression/ --project=chromium
  artifacts:
    when: always
    paths:
      - frontend/test-results/
      - frontend/playwright-report/
```

### GitHub Actions

已在 `.github/workflows/figma-sync.yml` 中配置：

```yaml
visual-regression:
  name: Visual Regression Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install --with-deps chromium
    - run: npx playwright test tests/visual-regression/ --project=chromium
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: visual-regression-results
        path: |
          frontend/test-results/
          frontend/playwright-report/
```

### 自动化流程

```
Figma 设计更新
    ↓
Webhook 触发同步
    ↓
设计系统文件更新
    ↓
CI/CD Pipeline 启动
    ↓
视觉回归测试运行
    ↓
检测到差异 → 测试失败 → 通知团队
    ↓
无差异 → 测试通过 → 自动部署
```

## 📊 处理测试失败

### 1. 查看差异

```bash
# 打开测试报告
npx playwright show-report

# 报告中会显示:
# - 预期截图 (Expected)
# - 实际截图 (Actual)
# - 差异对比图 (Diff)
```

### 2. 分析原因

**预期的变更** (设计系统更新):
```bash
# 更新 baseline
npx playwright test tests/visual-regression/ --update-snapshots
```

**非预期的变更** (Bug):
```bash
# 1. 修复代码
# 2. 重新运行测试
npx playwright test tests/visual-regression/
```

### 3. 审查流程

```
1. 设计师确认: 设计变更是否符合预期
2. 开发者确认: 代码变更是否正确实现
3. 更新 baseline: 如果变更符合预期
4. 提交变更: 包含新的 baseline 截图
```

## 🎯 实战示例

### 场景 1: 新增组件测试

```bash
# 1. 创建测试文件
# tests/visual-regression/new-component.spec.ts

# 2. 编写测试
test('should match new component', async ({ page }) => {
  await page.goto('/components/new-component');
  const component = page.locator('[data-testid="new-component"]');
  await expect(component).toHaveScreenshot('new-component.png');
});

# 3. 生成 baseline
npx playwright test tests/visual-regression/new-component.spec.ts --update-snapshots

# 4. 提交测试和 baseline
git add tests/visual-regression/new-component.spec.ts
git add tests/visual-regression/*.spec.ts-snapshots/
git commit -m "test: add visual regression test for new component"
```

### 场景 2: 设计系统更新后验证

```bash
# 1. 设计系统自动同步
./scripts/figma-sync-design-system.sh

# 2. 运行视觉回归测试
npx playwright test tests/visual-regression/

# 3. 如果有差异，查看报告
npx playwright show-report

# 4. 确认变更符合预期后更新 baseline
npx playwright test tests/visual-regression/ --update-snapshots

# 5. 提交更新
git add tests/visual-regression/*.spec.ts-snapshots/
git add frontend/styles/design-system/
git commit -m "chore: update design system and visual regression baselines"
```

### 场景 3: 响应式设计验证

```typescript
test.describe('Responsive Dashboard', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should match ${viewport.name} layout`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`dashboard-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixels: 1000,
      });
    });
  }
});
```

## 🐛 故障排查

### 问题 1: 测试超时

```bash
# 增加超时时间
npx playwright test --timeout=60000

# 或在配置中设置
// playwright.config.ts
timeout: 60 * 1000,
```

### 问题 2: 截图差异过大

```bash
# 检查是否有动态内容
# 1. 隐藏时间戳
# 2. 固定随机数据
# 3. 禁用动画

await page.addStyleTag({
  content: '* { animation: none !important; transition: none !important; }'
});
```

### 问题 3: 跨平台截图差异

```bash
# 使用 Docker 容器运行测试 (确保一致性)
docker run --rm -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.40.0-focal \
  npx playwright test tests/visual-regression/

# 或使用 CI 环境生成 baseline
```

### 问题 4: 字体渲染差异

```typescript
// 使用系统字体或 web fonts
// 确保字体已加载
await page.waitForLoadState('networkidle');
await page.evaluate(() => document.fonts.ready);
```

## 📚 资源

- [Playwright 文档](https://playwright.dev)
- [Visual Comparison Testing Guide](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## 🎉 成果

### 测试覆盖率

- ✅ 8+ UI 组件完整测试
- ✅ 设计系统 Token 验证
- ✅ 3 种响应式布局测试
- ✅ 跨浏览器兼容性测试

### 自动化程度

- ✅ 100% 自动化截图对比
- ✅ CI/CD 自动触发
- ✅ 失败自动通知
- ✅ 报告自动生成

### 质量保证

- ✅ 防止 UI 破坏
- ✅ 设计一致性保证
- ✅ 快速变更验证
- ✅ 回归问题早期发现

---

**最后更新**: 2025-10-16
**测试框架**: Playwright v1.40.0
**覆盖组件**: 8+ 组件, 30+ 测试用例

🤖 Generated with [Claude Code](https://claude.com/claude-code)
