# FEATURE: Neo4j Backend for Knowledge Graph

## 需求描述

将当前基于 Canvas 的前端知识图谱升级为 Neo4j 图数据库支持的完整系统，实现真实的图数据存储、查询和可视化。

### 核心功能
1. 使用 Neo4j 存储节点和关系
2. 提供 RESTful API 进行 CRUD 操作
3. 前端从 API 获取数据并渲染
4. 支持复杂的图查询（最短路径、社区发现等）
5. 保持原有的交互体验

---

## EXAMPLES

### 现有实现参考
```typescript
// 现有Canvas实现
File: frontend/app/knowledge-graph/page.tsx

当前使用mock数据:
const mockNodes = [
  { id: '1', label: 'Liberty 3 Pro', type: 'product' },
  { id: '2', label: 'Active Noise Cancelling', type: 'feature' },
  // ...
];

需要替换为:
const { data: graphData } = useSWR('/api/knowledge-graph', fetcher);
```

### Neo4j 数据模型示例
```cypher
// 产品节点
CREATE (p:Product {
  id: 'soundcore-liberty-3-pro',
  name: 'Liberty 3 Pro',
  category: 'TWS Earbuds',
  price: 169.99,
  releaseDate: '2021-09-28'
})

// 特性节点
CREATE (f:Feature {
  id: 'anc-advanced',
  name: 'Advanced Active Noise Cancelling',
  description: 'Hybrid ANC with multiple modes'
})

// 关系
CREATE (p)-[:HAS_FEATURE {
  importance: 'high',
  version: '3.0'
}]->(f)

// 使用场景
CREATE (u:UseCase {
  id: 'commuting',
  name: 'Daily Commute',
  description: 'Using earbuds on public transport'
})

CREATE (f)-[:SOLVES]->(u)

// 问题节点
CREATE (prob:Problem {
  id: 'wind-noise',
  name: 'Wind Noise Issue',
  severity: 'medium'
})

CREATE (prob)-[:RELATED_TO]->(p)
```

---

## DOCUMENTATION

### 必读文档
1. **Neo4j JavaScript Driver**
   - URL: https://neo4j.com/docs/javascript-manual/current/
   - 重点: Connection, Sessions, Transactions

2. **Neo4j Cypher查询语言**
   - URL: https://neo4j.com/docs/cypher-manual/current/
   - 重点: MATCH, CREATE, MERGE, Pattern matching

3. **Next.js API Routes**
   - URL: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
   - 重点: GET, POST, PUT, DELETE handlers

4. **SWR (数据获取)**
   - URL: https://swr.vercel.app/
   - 重点: useSWR hook, revalidation, error handling

5. **Neo4j MCP Server (全局配置)**
   - Package: `@alanse/mcp-neo4j-server`
   - 连接信息:
     ```
     URI: neo4j://localhost:7688
     Username: neo4j
     Password: claude_neo4j_2025
     ```

---

## IMPLEMENTATION PLAN

### Phase 1: Neo4j连接和数据模型

#### 1.1 创建 Neo4j 连接器
```typescript
// File: frontend/lib/neo4j.ts

import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      process.env.NEO4J_URI || 'neo4j://localhost:7688',
      neo4j.auth.basic(
        process.env.NEO4J_USERNAME || 'neo4j',
        process.env.NEO4J_PASSWORD || 'claude_neo4j_2025'
      ),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2000
      }
    );
  }
  return driver;
}

export async function runQuery<T = any>(
  cypher: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const driver = getNeo4jDriver();
  const session: Session = driver.session();

  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => record.toObject() as T);
  } finally {
    await session.close();
  }
}

export async function closeNeo4jDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
```

#### 1.2 定义 TypeScript 类型
```typescript
// File: frontend/types/knowledge-graph.ts

export type NodeType = 'product' | 'feature' | 'usecase' | 'problem';
export type RelationType = 'HAS_FEATURE' | 'SOLVES' | 'RELATED_TO' | 'USED_IN';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  properties: Record<string, any>;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  properties: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

export interface CreateNodeInput {
  label: string;
  type: NodeType;
  properties: Record<string, any>;
}

export interface CreateRelationshipInput {
  sourceId: string;
  targetId: string;
  type: RelationType;
  properties?: Record<string, any>;
}
```

---

### Phase 2: API Routes 实现

#### 2.1 GET /api/knowledge-graph (查询图谱)
```typescript
// File: frontend/app/api/knowledge-graph/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';
import { GraphNode, GraphRelationship, GraphData } from '@/types/knowledge-graph';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nodeType = searchParams.get('type'); // 可选的类型过滤
    const limit = parseInt(searchParams.get('limit') || '50');

    // 构建Cypher查询
    let cypher = `
      MATCH (n)
      ${nodeType ? `WHERE n:${nodeType}` : ''}
      OPTIONAL MATCH (n)-[r]->(m)
      RETURN
        n as node,
        collect(DISTINCT {
          id: id(r),
          type: type(r),
          source: id(n),
          target: id(m),
          properties: properties(r)
        }) as relationships,
        collect(DISTINCT {
          id: id(m),
          label: m.name,
          type: labels(m)[0],
          properties: properties(m)
        }) as connectedNodes
      LIMIT $limit
    `;

    const result = await runQuery(cypher, { limit });

    // 转换为前端格式
    const nodes: GraphNode[] = [];
    const relationships: GraphRelationship[] = [];
    const nodeMap = new Map<string, boolean>();

    for (const record of result) {
      const node = record.node;
      const nodeId = node.identity.toString();

      if (!nodeMap.has(nodeId)) {
        nodes.push({
          id: nodeId,
          label: node.properties.name || node.properties.label,
          type: node.labels[0].toLowerCase(),
          properties: node.properties
        });
        nodeMap.set(nodeId, true);
      }

      // 添加关系和连接的节点
      if (record.relationships) {
        for (const rel of record.relationships) {
          if (rel.id) {
            relationships.push({
              id: rel.id.toString(),
              source: rel.source.toString(),
              target: rel.target.toString(),
              type: rel.type,
              properties: rel.properties || {}
            });
          }
        }
      }

      if (record.connectedNodes) {
        for (const connNode of record.connectedNodes) {
          if (connNode.id && !nodeMap.has(connNode.id.toString())) {
            nodes.push({
              id: connNode.id.toString(),
              label: connNode.properties.name || connNode.label,
              type: connNode.type.toLowerCase(),
              properties: connNode.properties
            });
            nodeMap.set(connNode.id.toString(), true);
          }
        }
      }
    }

    const graphData: GraphData = { nodes, relationships };

    return NextResponse.json(graphData, { status: 200 });
  } catch (error) {
    console.error('Error fetching knowledge graph:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge graph' },
      { status: 500 }
    );
  }
}
```

#### 2.2 POST /api/knowledge-graph/node (创建节点)
```typescript
// 同文件续
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, type, properties } = body;

    if (!label || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: label, type' },
        { status: 400 }
      );
    }

    const cypher = `
      CREATE (n:${type.charAt(0).toUpperCase() + type.slice(1)} {
        name: $label,
        createdAt: datetime()
      })
      SET n += $properties
      RETURN
        id(n) as id,
        n.name as label,
        labels(n)[0] as type,
        properties(n) as properties
    `;

    const result = await runQuery(cypher, { label, properties: properties || {} });

    if (result.length === 0) {
      throw new Error('Failed to create node');
    }

    const node = result[0];
    return NextResponse.json({
      id: node.id.toString(),
      label: node.label,
      type: node.type.toLowerCase(),
      properties: node.properties
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json(
      { error: 'Failed to create node' },
      { status: 500 }
    );
  }
}
```

#### 2.3 创建关系 API
```typescript
// File: frontend/app/api/knowledge-graph/relationship/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function POST(request: NextRequest) {
  try {
    const { sourceId, targetId, type, properties } = await request.json();

    if (!sourceId || !targetId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cypher = `
      MATCH (source) WHERE id(source) = $sourceId
      MATCH (target) WHERE id(target) = $targetId
      CREATE (source)-[r:${type}]->(target)
      SET r += $properties
      RETURN
        id(r) as id,
        type(r) as type,
        id(source) as source,
        id(target) as target,
        properties(r) as properties
    `;

    const result = await runQuery(cypher, {
      sourceId: parseInt(sourceId),
      targetId: parseInt(targetId),
      properties: properties || {}
    });

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating relationship:', error);
    return NextResponse.json(
      { error: 'Failed to create relationship' },
      { status: 500 }
    );
  }
}
```

---

### Phase 3: 前端集成

#### 3.1 更新知识图谱页面
```typescript
// File: frontend/app/knowledge-graph/page.tsx (修改)

'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { GraphData, GraphNode, GraphRelationship } from '@/types/knowledge-graph';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function KnowledgeGraphPage() {
  // 使用 SWR 获取数据
  const { data, error, isLoading, mutate } = useSWR<GraphData>(
    '/api/knowledge-graph',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  // Canvas相关状态 (保持原有实现)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 渲染逻辑 (使用真实数据)
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 渲染节点和边 (使用data.nodes和data.relationships)
    renderGraph(ctx, data);
  }, [data]);

  // 渲染图谱函数 (保持原有Canvas实现)
  function renderGraph(ctx: CanvasRenderingContext2D, graphData: GraphData) {
    // ... 原有的Canvas渲染逻辑
    // 使用 graphData.nodes 和 graphData.relationships
  }

  // 创建节点
  async function handleCreateNode(nodeData: any) {
    try {
      const response = await fetch('/api/knowledge-graph/node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nodeData)
      });

      if (!response.ok) throw new Error('Failed to create node');

      // 重新验证数据
      mutate();
    } catch (error) {
      console.error('Error creating node:', error);
    }
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">
          Failed to load knowledge graph. Please try again.
        </div>
      </div>
    );
  }

  // 原有的JSX返回 (保持不变)
  return (
    <div className="h-screen flex flex-col">
      {/* 工具栏 */}
      <div className="bg-white border-b p-4">
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-64"
        />
        <button
          onClick={() => handleCreateNode({
            label: 'New Node',
            type: 'product',
            properties: {}
          })}
          className="ml-4 bg-purple-600 text-white px-4 py-2 rounded"
        >
          Add Node
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="w-full h-full"
        />
      </div>

      {/* 详情面板 */}
      {selectedNode && (
        <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{selectedNode.label}</h3>
          <div className="space-y-2">
            <p><strong>Type:</strong> {selectedNode.type}</p>
            <p><strong>ID:</strong> {selectedNode.id}</p>
            <div>
              <strong>Properties:</strong>
              <pre className="mt-2 text-sm bg-gray-50 p-2 rounded">
                {JSON.stringify(selectedNode.properties, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Phase 4: 环境变量配置

```bash
# File: frontend/.env.local (创建)

NEO4J_URI=neo4j://localhost:7688
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=claude_neo4j_2025
```

---

### Phase 5: 初始化示例数据

```typescript
// File: scripts/init-neo4j-data.ts

import { runQuery, closeNeo4jDriver } from '../lib/neo4j';

async function initializeKnowledgeGraph() {
  try {
    console.log('Initializing Neo4j knowledge graph...');

    // 清空现有数据
    await runQuery('MATCH (n) DETACH DELETE n');

    // 创建产品节点
    await runQuery(`
      CREATE (p1:Product {
        name: 'Soundcore Liberty 3 Pro',
        category: 'TWS Earbuds',
        price: 169.99,
        releaseDate: '2021-09-28'
      })
      CREATE (p2:Product {
        name: 'Soundcore Space Q45',
        category: 'Over-Ear Headphones',
        price: 149.99,
        releaseDate: '2022-10-15'
      })
    `);

    // 创建特性节点
    await runQuery(`
      CREATE (f1:Feature {
        name: 'Active Noise Cancelling',
        description: 'Advanced ANC technology'
      })
      CREATE (f2:Feature {
        name: 'Transparency Mode',
        description: 'Hear your surroundings'
      })
      CREATE (f3:Feature {
        name: 'Wireless Charging',
        description: 'Qi wireless charging support'
      })
    `);

    // 创建关系
    await runQuery(`
      MATCH (p:Product {name: 'Soundcore Liberty 3 Pro'})
      MATCH (f:Feature {name: 'Active Noise Cancelling'})
      CREATE (p)-[:HAS_FEATURE {importance: 'high', version: '3.0'}]->(f)
    `);

    console.log('Knowledge graph initialized successfully!');
  } catch (error) {
    console.error('Error initializing knowledge graph:', error);
  } finally {
    await closeNeo4jDriver();
  }
}

initializeKnowledgeGraph();
```

运行脚本:
```bash
npx ts-node scripts/init-neo4j-data.ts
```

---

## VALIDATION GATES

### 必须通过的检查

- [ ] **连接测试**: Neo4j连接成功，无错误日志
- [ ] **数据模型**: 所有节点类型和关系类型正确创建
- [ ] **API测试**:
  - [ ] GET /api/knowledge-graph 返回正确的图数据
  - [ ] POST /api/knowledge-graph/node 成功创建节点
  - [ ] POST /api/knowledge-graph/relationship 成功创建关系
- [ ] **前端渲染**: Canvas正确显示从API获取的数据
- [ ] **交互功能**:
  - [ ] 节点可拖拽
  - [ ] 缩放平移正常
  - [ ] 搜索功能工作
  - [ ] 创建节点功能正常
- [ ] **性能测试**:
  - [ ] API响应时间 < 500ms
  - [ ] 渲染50个节点流畅 (60fps)
  - [ ] 内存使用正常
- [ ] **错误处理**:
  - [ ] 数据库连接失败时显示友好错误
  - [ ] API错误时不崩溃
  - [ ] 加载状态正确显示
- [ ] **代码质量**:
  - [ ] TypeScript无类型错误
  - [ ] ESLint无警告
  - [ ] 所有函数有注释

---

## OTHER CONSIDERATIONS

### 性能优化
- 使用连接池管理Neo4j连接
- 添加查询结果缓存 (Redis)
- 限制返回的节点数量
- 使用分页加载大型图谱

### 安全性
- API路由添加身份验证
- 防止Cypher注入攻击
- 限制查询复杂度
- 添加速率限制

### 可扩展性
- 支持更多节点类型
- 添加图算法 (最短路径、中心性分析)
- 实现社区发现功能
- 添加时间序列查询

### 测试
- 单元测试: Neo4j连接器函数
- 集成测试: API路由
- E2E测试: 完整的创建-查询-删除流程

---

## 预期时间

- Phase 1 (连接和数据模型): 2小时
- Phase 2 (API实现): 4小时
- Phase 3 (前端集成): 3小时
- Phase 4-5 (配置和数据): 1小时
- 测试和优化: 2小时

**总计**: 12小时

---

## 成功标准

✅ Neo4j成功存储和查询图数据
✅ 前端完全替换mock数据为真实API
✅ 所有现有交互功能保持不变
✅ 性能达标 (< 500ms响应)
✅ 代码通过所有质量检查
