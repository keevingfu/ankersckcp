# KCP项目自动化开发 - 快速参考指南

> 📋 本指南提供快速命令和常用工作流，详细策略请参考 `AUTOMATION-STRATEGY.md`

---

## 🚀 一键启动命令

### 1. 启动所有数据库服务
```bash
# 启动PostgreSQL, Neo4j, MongoDB, Redis, MinIO
cd /Users/cavin/Desktop/dev/ankersckcp
docker compose up -d postgres neo4j mongodb redis minio

# 验证服务状态
docker ps | grep -E "postgres|neo4j|mongo|redis|minio"
```

### 2. 快速开发环境
```bash
# 进入前端目录并启动
cd frontend
npm install
npm run dev

# 在新终端中启动数据库GUI
open http://localhost:7475  # Neo4j Browser
open http://localhost:9001  # MinIO Console
```

---

## 💡 核心资源速查

### 🎯 最常用资源 (Top 5)

| 资源 | 快速访问 | 用途 |
|------|---------|------|
| **Neo4j** | `localhost:7688` / `localhost:7475` | 知识图谱存储 |
| **PostgreSQL** | `localhost:5437` | 业务数据 |
| **Redis** | `localhost:6382` | 缓存 |
| **MinIO** | `localhost:9000` (API) / `9001` (Console) | 文件存储 |
| **InfraNodus** | MCP Server | SEO分析 |

### 🔑 连接信息

```bash
# Neo4j
URI: neo4j://localhost:7688
Username: neo4j
Password: claude_neo4j_2025

# PostgreSQL
Host: localhost:5437
User: claude
Password: claude_dev_2025
Database: claude_dev

# Redis
Host: localhost:6382
Password: claude_redis_2025

# MongoDB
Host: localhost:27018
User: claude
Password: claude_mongo_2025
Database: claude_dev

# MinIO
Endpoint: http://localhost:9000
Access Key: (在 ~/minio-setup/.env)
Secret Key: (在 ~/minio-setup/.env)
Console: http://localhost:9001
Admin: admin / SecretPass123456
```

---

## 🎨 常用自动化命令

### Context Engineering 工作流

```bash
# 1. 创建功能需求文档
cat > docs/features/my-feature.md << EOF
# FEATURE: 功能名称
具体需求描述...

# EXAMPLES
参考代码和文件路径...

# DOCUMENTATION
相关文档链接...

# VALIDATION
- [ ] 成功标准1
- [ ] 成功标准2
EOF

# 2. 生成实现计划 (PRP)
cd /Users/cavin/Context-Engineering-Intro
/generate-prp ../ankersckcp/docs/features/my-feature.md

# 3. 执行实现
/execute-prp PRPs/my-feature.md
```

### BMAD SuperClaude 命令

```bash
# 实现新功能
/sc:implement "功能描述和技术要求"

# 运行测试
/sc:test "测试类型和覆盖范围"

# 代码分析
/sc:analyze "分析重点(性能/安全/质量)"

# 构建部署
/sc:build "构建目标和环境"

# 故障排查
/sc:troubleshoot "问题描述"

# 创建文档
/sc:document "文档范围"

# 复杂任务分解
/sc:spawn "主任务及子任务列表"

# 执行工作流
/sc:workflow "从PRD生成实施计划"
```

---

## 📦 常见场景速查

### 场景 1: 添加Neo4j后端到知识图谱

```bash
# 快速实现
/sc:implement "Neo4j Backend for Knowledge Graph

Requirements:
- Connect to Neo4j at localhost:7688
- Create API routes for CRUD operations
- Update frontend to use real data API
- Add loading and error states

Files to modify:
- app/api/knowledge-graph/route.ts (create)
- lib/neo4j.ts (create)
- app/knowledge-graph/page.tsx (update)

Validation:
- Neo4j queries return correct data
- Frontend displays graph correctly
- Performance < 500ms
"

# 或使用Context Engineering
cd /Users/cavin/Context-Engineering-Intro
/generate-prp ../ankersckcp/docs/features/neo4j-knowledge-graph.md
/execute-prp PRPs/neo4j-knowledge-graph.md
```

### 场景 2: 增强内容生成器(InfraNodus分析)

```bash
/sc:implement "Content Generator with InfraNodus Analysis

Features:
1. 接入InfraNodus MCP服务器
2. 实时SEO分析
3. 关键词密度检测
4. 可读性评分
5. 内容优化建议

API Design:
POST /api/content/analyze
{
  \"text\": \"生成的内容\",
  \"type\": \"blog\" | \"product\" | \"social\"
}

Response:
{
  \"seoScore\": 85,
  \"readabilityScore\": 92,
  \"keywords\": [...],
  \"suggestions\": [...]
}
"
```

### 场景 3: 构建智能客服知识库

```bash
/sc:task "Smart Chat Knowledge Base

Subtasks:
1. PostgreSQL FAQ表设计
   - Create schema with Prisma
   - Add full-text search
   - Create indexes

2. 实现知识检索API
   - Semantic search
   - Category filtering
   - Relevance ranking

3. 集成Memory MCP
   - 记忆对话上下文
   - 个性化推荐

4. Redis缓存热门问题
   - Cache strategy
   - TTL设置

Timeline: 2 days
Priority: P1
"
```

### 场景 4: 添加实时Analytics

```bash
/sc:implement "Real-time Analytics System

Architecture:
User Action → API → Redis (real-time) → PostgreSQL (persist)

Components:
1. Event Tracking API
   - POST /api/analytics/track
   - Types: page_view, content_generate, chat_message

2. Metrics API
   - GET /api/analytics/metrics
   - Returns: active_users, page_views, chat_count

3. Data Aggregation Job
   - Cron: every 5 minutes
   - Redis → PostgreSQL batch insert

4. Frontend Integration
   - Update Analytics dashboard
   - Real-time updates via polling/SSE

Tech Stack:
- Redis for real-time data
- PostgreSQL for historical data
- Next.js API Routes
- React Query for data fetching
"
```

### 场景 5: 设置CI/CD Pipeline

```bash
/sc:build "Complete CI/CD Setup

Pipeline Stages:
1. Analyze (lint, type-check)
2. Test (unit, integration, e2e)
3. Build (production bundle)
4. Deploy (staging → production)
5. Monitor (health check, alerts)

Tools:
- GitLab CI/CD
- Playwright for E2E
- Sentry for monitoring
- Slack for notifications

Configuration Files:
- .gitlab-ci.yml
- playwright.config.ts
- sentry.config.js
"
```

---

## 🔄 典型开发流程

### 完整功能开发流程

```
1. 需求分析
   ↓
   /sc:analyze "分析需求可行性"

2. 设计方案
   ↓
   /sc:design "设计系统架构和API"

3. 创建PRP
   ↓
   /generate-prp docs/features/my-feature.md

4. 实现功能
   ↓
   /execute-prp PRPs/my-feature.md
   或
   /sc:implement "实现描述"

5. 编写测试
   ↓
   /sc:test "测试范围"

6. 代码审查
   ↓
   /sc:analyze "代码质量分析"

7. 构建部署
   ↓
   /sc:build "部署到staging"

8. 监控验证
   ↓
   检查Sentry + Slack通知
```

---

## 📊 数据库操作速查

### Neo4j (知识图谱)

```cypher
// 创建产品节点
CREATE (p:Product {
  id: 'soundcore-liberty-3-pro',
  name: 'Liberty 3 Pro',
  category: 'earbuds'
})

// 创建关系
MATCH (p:Product {id: 'soundcore-liberty-3-pro'})
MATCH (f:Feature {id: 'anc'})
CREATE (p)-[:HAS_FEATURE]->(f)

// 查询图谱
MATCH (p:Product)-[r]->(n)
RETURN p, r, n
LIMIT 50
```

### PostgreSQL (业务数据)

```sql
-- 查看FAQ表
SELECT * FROM faqs
WHERE category = 'troubleshooting'
ORDER BY views DESC
LIMIT 10;

-- 全文搜索
SELECT * FROM faqs
WHERE to_tsvector('english', question || ' ' || answer)
@@ to_tsquery('english', 'noise cancelling');
```

### Redis (缓存)

```bash
# 查看所有键
redis-cli -h localhost -p 6382 -a claude_redis_2025 KEYS "*"

# 获取统计数据
redis-cli -h localhost -p 6382 -a claude_redis_2025 GET "analytics:page_view:count"

# 查看活跃用户
redis-cli -h localhost -p 6382 -a claude_redis_2025 SMEMBERS "analytics:active_users"
```

### MongoDB (内容存储)

```javascript
// 连接
mongosh "mongodb://claude:claude_mongo_2025@localhost:27018/claude_dev"

// 查询内容历史
db.content_history.find({
  contentType: "blog"
}).sort({ createdAt: -1 }).limit(10)

// 聚合统计
db.content_history.aggregate([
  { $group: { _id: "$contentType", count: { $sum: 1 } } }
])
```

### MinIO (对象存储)

```bash
# 配置mc客户端
mc alias set local http://localhost:9000 admin SecretPass123456

# 列出所有buckets
mc ls local/

# 上传文件
mc cp generated-content.json local/content-archive/2025/10/

# 下载文件
mc cp local/content-archive/2025/10/file.json ./downloads/
```

---

## 🧪 测试命令速查

```bash
# 单元测试
cd frontend
npm run test:unit

# 监视模式
npm run test:watch

# 测试覆盖率
npm run test:coverage

# E2E测试
npx playwright test

# 特定测试文件
npx playwright test knowledge-graph.spec.ts

# UI模式调试
npx playwright test --ui

# 视觉回归测试
npm run test:visual
```

---

## 🔍 调试命令

```bash
# 查看容器日志
docker logs postgres-claude-mcp -f
docker logs neo4j-claude-mcp -f
docker logs mongodb-claude-mcp -f

# 检查数据库连接
# PostgreSQL
psql -h localhost -p 5437 -U claude -d claude_dev

# Neo4j (浏览器)
open http://localhost:7475

# 检查Redis
redis-cli -h localhost -p 6382 -a claude_redis_2025 PING

# 检查MinIO
curl http://localhost:9000/minio/health/live
```

---

## 📚 文档链接

### 项目文档
- [完整自动化策略](./AUTOMATION-STRATEGY.md)
- [项目CLAUDE.md](./CLAUDE.md)
- [开发总结](./DEVELOPMENT_COMPLETE_SUMMARY.md)

### MCP服务器文档
- [Neo4j MCP](https://github.com/alanse/mcp-neo4j-server)
- [InfraNodus MCP](https://infranodus.com/mcp)
- [Memory MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)
- [Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking)

### 技术文档
- [Next.js API Routes](https://nextjs.org/docs/api-routes)
- [Prisma](https://www.prisma.io/docs)
- [Neo4j JavaScript Driver](https://neo4j.com/docs/javascript-manual/)
- [Redis Node.js](https://redis.io/docs/clients/nodejs/)

---

## 💡 提示和技巧

### 1. 使用并行代理加速开发
```bash
/sc:spawn "
Task 1: Implement Neo4j API (backend)
Task 2: Update frontend components (frontend)
Task 3: Write integration tests (qa)
"
```

### 2. 利用Memory MCP记住上下文
```bash
# Memory会自动记住你的开发偏好和决策
# 在新会话中可以快速恢复上下文
```

### 3. 使用InfraNodus进行内容优化
```bash
# 不仅用于SEO，还可以:
# - 分析代码注释质量
# - 检查文档完整性
# - 优化用户界面文案
```

### 4. 定期运行自动化检查
```bash
# 设置cron任务
0 */6 * * * cd /path/to/ankersckcp && npm run check:all
```

### 5. 监控关键指标
```bash
# 使用Sentry Dashboard
# 设置Slack告警阈值
# 定期查看GitLab CI/CD报告
```

---

## 🚨 常见问题

**Q: 数据库连接失败?**
```bash
# 检查容器状态
docker ps

# 重启容器
docker restart postgres-claude-mcp neo4j-claude-mcp
```

**Q: MCP服务器无响应?**
```bash
# 检查环境变量
source ~/.mcp-load-env.sh
echo $NEO4J_URI

# 重启Claude Code
```

**Q: 测试失败?**
```bash
# 清除缓存
rm -rf .next node_modules/.cache

# 重新安装依赖
npm install

# 运行特定测试
npm run test -- --testPathPattern=my-test
```

**Q: 构建体积过大?**
```bash
# 分析bundle
npm run build:analyze

# 使用动态导入
const Component = dynamic(() => import('./Component'))
```

---

**最后更新**: 2025-10-16
**维护**: Claude + Cavin
**快速帮助**: 查看 `AUTOMATION-STRATEGY.md` 获取详细说明
