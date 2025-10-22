# KCP CI/CD自动化系统使用指南

## 📚 系统概述

这是一个智能的持续集成/持续开发(CI/CD)自动化系统,专为Soundcore KCP项目设计。

### 核心特性

✅ **智能状态管理** - 自动追踪开发进度和状态  
✅ **自动化检查点** - 每个阶段完成自动创建检查点  
✅ **文件自动保存** - 所有文件实时保存到本地  
✅ **阶段验证** - 每完成一阶段自动验证后再进入下一阶段  
✅ **Chat承上启下** - 自动记录上下文,支持跨会话开发  
✅ **错误恢复** - 从任意检查点恢复开发  

---

## 🚀 快速开始

### 1. 系统初始化

```bash
# 进入项目目录
cd /Users/cavin/Desktop/dev/ankersckcp

# 运行自动化控制器
python .cicd/controller.py
```

### 2. 查看当前状态

```bash
# 查看状态文件
cat .cicd/state-manager.json
```

### 3. 查看日志

```bash
# 实时查看日志
tail -f .cicd/automation.log
```

---

## 📋 开发流程

### 阶段1: 初始化 (Phase: initialization)

**任务列表:**
- [x] 创建项目结构
- [x] 初始化Git仓库  
- [x] 安装依赖
- [x] 配置环境变量

**检查点:** cp001 - "Project structure created"

### 阶段2: 设计系统 (Phase: design-system)

**任务列表:**
- [x] 生成设计规范
- [ ] 创建组件库
- [ ] 配置Storybook
- [ ] 视觉回归测试

**预计时间:** 5天  
**当前进度:** 45%

### 阶段3: 知识中枢 (Phase: knowledge-hub)

**任务列表:**
- [ ] 知识库管理界面
- [ ] 知识图谱可视化
- [ ] 智能检索功能
- [ ] 质量控制面板

**预计时间:** 4天

### 阶段4: 内容工厂 (Phase: content-factory)

**任务列表:**
- [ ] SEO内容生成器
- [ ] 社交媒体内容
- [ ] 营销邮件生成
- [ ] 内容日历

**预计时间:** 4天

---

## 🔧 命令使用

### Python控制器命令

```python
from pathlib import Path
from controller import CICDController

# 初始化控制器
controller = CICDController("/Users/cavin/Desktop/dev/ankersckcp")

# 查看当前状态
state = controller.load_state()
print(state['currentState'])

# 创建检查点
checkpoint_id = controller.create_checkpoint("完成XX功能")

# 执行阶段
controller.run_phase("design-system")

# 验证阶段
is_valid = controller.validate_phase()

# 自动保存
controller.auto_save_files()

# 运行测试
controller.run_tests()
```

---

## 📊 状态文件结构

```json
{
  "projectInfo": {
    "name": "项目名称",
    "version": "版本号",
    "startDate": "开始日期"
  },
  "currentState": {
    "phase": "当前阶段",
    "task": "当前任务",
    "status": "状态",
    "lastCheckpoint": "最后检查点",
    "lastSave": "最后保存时间"
  },
  "phases": {
    "阶段名": {
      "status": "completed|in-progress|pending",
      "progress": 0-100,
      "tasks": {}
    }
  },
  "checkpoints": [
    {
      "id": "检查点ID",
      "timestamp": "时间戳",
      "phase": "所属阶段",
      "description": "描述",
      "status": "状态"
    }
  ],
  "metrics": {
    "totalTasks": 总任务数,
    "completedTasks": 完成数,
    "filesSaved": 保存文件数,
    "testsRun": 测试运行数
  }
}
```

---

## 🔄 Chat承上启下机制

### 原理

每次Chat会话:
1. **读取状态** - 从`state-manager.json`读取当前进度
2. **执行任务** - 根据当前阶段执行开发任务
3. **保存状态** - 完成后更新状态文件
4. **创建检查点** - 重要节点创建检查点
5. **下次恢复** - 新Chat自动从上次状态继续

### 示例

```
Chat 1: 完成初始化 → 保存cp001
Chat 2: 读取cp001 → 开始设计系统 → 保存cp002
Chat 3: 读取cp002 → 继续组件开发 → 保存cp003
```

---

## ✅ 验证机制

### 阶段验证规则

每个阶段完成后自动验证:

1. **文件检查** - 必需文件是否存在
2. **代码检查** - 语法和类型检查
3. **测试检查** - 单元测试是否通过
4. **构建检查** - 项目是否能成功构建

验证通过才能进入下一阶段!

---

## 💾 自动保存策略

### 触发条件

- ✅ 每完成一个任务
- ✅ 每创建一个检查点
- ✅ 每隔5分钟
- ✅ Chat会话结束前

### 保存位置

```
/Users/cavin/Desktop/dev/ankersckcp/
├── .cicd/
│   ├── state-manager.json      # 状态文件
│   ├── automation.log           # 日志文件
│   └── checkpoints/             # 检查点备份
├── frontend/                     # 前端代码
├── backend/                      # 后端代码
└── docs/                         # 文档
```

---

## 🐛 故障恢复

### 从检查点恢复

```python
# 列出所有检查点
controller = CICDController("/Users/cavin/Desktop/dev/ankersckcp")
state = controller.load_state()
for cp in state['checkpoints']:
    print(f"{cp['id']}: {cp['description']}")

# 恢复到指定检查点
# (通过读取该检查点的状态文件)
```

### 常见问题

**Q: Chat超时怎么办?**  
A: 系统会自动保存状态,新Chat启动时自动恢复

**Q: 如何跳过某个阶段?**  
A: 修改state-manager.json中的phase字段

**Q: 如何重新执行某个阶段?**  
A: 调用`controller.run_phase("阶段名")`

---

## 📈 进度监控

### 实时监控

```bash
# 监控日志
tail -f .cicd/automation.log

# 查看进度
watch -n 5 'cat .cicd/state-manager.json | jq .metrics'
```

### 指标说明

- `totalTasks`: 总任务数
- `completedTasks`: 已完成任务
- `inProgressTasks`: 进行中任务  
- `filesSaved`: 已保存文件数
- `testsRun`: 已运行测试数
- `codeCoverage`: 代码覆盖率

---

## 🎯 最佳实践

### 1. 频繁创建检查点

```python
# 每完成重要功能就创建检查点
controller.create_checkpoint("完成用户认证模块")
controller.create_checkpoint("知识图谱可视化完成")
```

### 2. 验证后再继续

```python
# 验证当前阶段
if controller.validate_phase():
    controller.run_phase("next-phase")
else:
    print("验证失败,请检查错误")
```

### 3. 定期查看状态

```python
# 每小时查看一次进度
state = controller.load_state()
print(f"当前进度: {state['metrics']['completedTasks']}/{state['metrics']['totalTasks']}")
```

---

## 🔗 相关文档

- [项目需求文档](../soundcore-kcp-requirements.md)
- [开发指南](../soundcore-kcp-dev.md)
- [前端开发计划](../FRONTEND-AUTO-DEV-PLAN.md)

---

## 📞 支持

如有问题,请:
1. 查看日志文件`.cicd/automation.log`
2. 检查状态文件`.cicd/state-manager.json`
3. 从最近的检查点恢复

---

**最后更新:** 2024-10-15  
**系统版本:** v1.0.0  
**自动化率:** 67%
