# 🚀 KCP项目快速启动指南
## Quick Start Guide for Every Chat Session

---

## 📌 每次Chat开始时执行

### Step 1: 启动会话管理器
```bash
cd /Users/cavin/Desktop/dev/ankersckcp
python3 .cicd/chat-session.py
```

**这个脚本会自动:**
- ✅ 读取上次保存的状态
- ✅ 显示当前进度和检查点
- ✅ 建议下一步行动
- ✅ 恢复完整上下文

---

## 🎯 根据当前阶段继续开发

### 如果在"初始化阶段" (initialization)
```bash
# 已完成! 可以进入下一阶段
python3 .cicd/controller.py
# 或者手动进入设计系统阶段
```

### 如果在"设计系统阶段" (design-system)
```python
# 继续开发组件库
# 1. 让Claude生成UI组件
# 2. 配置Storybook
# 3. 编写单元测试
```

### 如果在"知识中枢阶段" (knowledge-hub)
```python
# 开发知识管理功能
# 1. 知识库界面
# 2. 知识图谱
# 3. 智能检索
```

---

## 💾 完成工作后保存

### 自动保存机制
系统会自动保存:
- 每完成一个任务
- 每创建一个检查点  
- 每隔5分钟
- Chat结束前

### 手动创建检查点
```python
from .cicd.controller import CICDController

controller = CICDController('/Users/cavin/Desktop/dev/ankersckcp')
controller.create_checkpoint('完成了XX功能')
controller.auto_save_files()
```

---

## 📊 查看进度

### 实时监控
```bash
# 查看状态
cat .cicd/state-manager.json | python3 -m json.tool

# 查看日志
tail -f .cicd/automation.log

# 查看进度
cat .cicd/STATUS-REPORT.md
```

---

## 🔄 Chat会话流程图

```
┌─────────────────────────────────────────┐
│         新的Chat会话开始               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Step 1: 运行 chat-session.py         │
│   → 加载上次状态                        │
│   → 显示当前进度                        │
│   → 恢复上下文                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Step 2: 继续开发                      │
│   → 根据当前阶段执行任务                │
│   → 使用Claude自动生成代码              │
│   → 运行测试验证                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Step 3: 保存进度                      │
│   → 自动保存文件                        │
│   → 更新state-manager.json             │
│   → 创建检查点                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Chat会话结束                    │
│   准备好下次从这里继续!                 │
└─────────────────────────────────────────┘
```

---

## ⚡ 常用命令速查

### 状态查询
```bash
# 当前状态
cat .cicd/state-manager.json | jq '.currentState'

# 所有检查点
cat .cicd/state-manager.json | jq '.checkpoints'

# 进度指标
cat .cicd/state-manager.json | jq '.metrics'
```

### 开发操作
```bash
# 启动新会话
python3 .cicd/chat-session.py

# 运行自动化控制器
python3 .cicd/controller.py

# 查看实时日志
tail -f .cicd/automation.log

# 查看项目结构
tree -L 3 -I 'node_modules|.git'
```

### 测试与验证
```bash
# 运行测试 (待实现)
npm run test

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

---

## 🎓 最佳实践

### 1. 每次Chat开始
```bash
# 第一件事: 了解当前状态
python3 .cicd/chat-session.py
```

### 2. 开发过程中
```python
# 完成重要功能后创建检查点
controller.create_checkpoint('完成XX模块')
```

### 3. Chat结束前
```bash
# 确认状态已保存
cat .cicd/state-manager.json | jq '.currentState'
```

---

## 🐛 故障排查

### 状态文件丢失?
```bash
# 备份文件位置
ls .cicd/backups/
# 从Git恢复
git checkout .cicd/state-manager.json
```

### 进度不一致?
```bash
# 重置到最后检查点
# 编辑 state-manager.json
# 修改 currentState
```

### Chat超时?
```bash
# 不用担心!
# 下次Chat启动时会自动恢复
python3 .cicd/chat-session.py
```

---

## 📞 需要帮助?

### 文档资源
- [CI/CD系统说明](.cicd/README.md)
- [系统状态报告](.cicd/STATUS-REPORT.md)
- [开发计划](FRONTEND-AUTO-DEV-PLAN.md)

### 系统文件
- **状态管理:** `.cicd/state-manager.json`
- **自动化控制:** `.cicd/controller.py`
- **会话启动:** `.cicd/chat-session.py`
- **系统日志:** `.cicd/automation.log`

---

## ✅ 检查清单

每次Chat会话:
- [ ] 运行`chat-session.py`了解当前状态
- [ ] 根据建议执行下一步任务
- [ ] 定期创建检查点
- [ ] 确认文件已自动保存
- [ ] Chat结束前查看最新状态

---

**祝开发顺利!** 🎉

这个系统会确保每个Chat会话都能**无缝衔接**,让你的开发**持续推进**!
