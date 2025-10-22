# API Documentation Guide - Soundcore KCP

## 📋 Overview

本指南说明如何为 Soundcore KCP 后端微服务生成和维护 API 文档。系统使用 FastAPI 内置的 OpenAPI 3.0 支持，自动生成交互式 API 文档。

**支持的文档格式**:
- 🌐 **Swagger UI** - 交互式 API 测试界面
- 📗 **Redoc** - 清晰易读的 API 文档
- 📄 **Markdown** - 适合 Git 版本控制的文档
- 📋 **OpenAPI JSON** - 标准化的 API 规范文件

---

## 🎯 文档目标

### 自动化文档生成
- ✅ 从运行中的 FastAPI 服务自动提取 OpenAPI 规范
- ✅ 生成多种格式的文档（Swagger UI, Redoc, Markdown）
- ✅ 创建统一的多服务 API 文档门户
- ✅ 支持独立服务文档生成

### 文档覆盖范围
- **5 个微服务**: Knowledge, Content, Support, Analytics, Auth
- **所有 API 端点**: 完整的路由、参数、响应文档
- **数据模型**: Pydantic 模型定义和字段说明
- **认证方式**: JWT、OAuth 2.0 认证说明
- **错误代码**: 标准化的错误响应格式

---

## 🛠️ 环境准备

### 1. 安装 Python 依赖

```bash
cd /Users/cavin/Desktop/dev/ankersckcp/backend/docs

# 安装文档生成依赖
pip install -r requirements-docs.txt
```

**依赖说明**:
- `requests` - 用于从 FastAPI 服务获取 OpenAPI 规范
- `python-dotenv` - 环境变量管理（可选）

### 2. 确保后端服务运行

API 文档生成需要从运行中的服务获取 OpenAPI 规范：

```bash
# 检查服务状态
curl http://localhost:8001/health  # Knowledge Service
curl http://localhost:8002/health  # Content Service
curl http://localhost:8003/health  # Support Service
curl http://localhost:8004/health  # Analytics Service
curl http://localhost:8005/health  # Auth Service
```

**启动服务**（如果未运行）:

```bash
# 使用 Docker Compose 启动所有服务
cd /Users/cavin/Desktop/dev/ankersckcp/backend
docker-compose up -d

# 或单独启动服务
uvicorn knowledge_service.main:app --host 0.0.0.0 --port 8001
uvicorn content_service.main:app --host 0.0.0.0 --port 8002
# ... 其他服务
```

---

## 🚀 生成 API 文档

### 文档生成器脚本

主脚本: `generate_api_docs.py`

**功能特性**:
- ✅ 自动从 FastAPI 获取 OpenAPI 3.0 规范
- ✅ 生成 Swagger UI 交互式文档
- ✅ 生成 Redoc 美观文档
- ✅ 生成 Markdown 格式文档（适合 Git）
- ✅ 创建统一的多服务 API 门户
- ✅ 支持自定义输出目录

### 1. 生成所有服务文档

```bash
python generate_api_docs.py
```

**输出内容**:
- `api-docs/index.html` - 统一 API 门户
- `api-docs/{service}-swagger.html` - Swagger UI 文档（每个服务）
- `api-docs/{service}-redoc.html` - Redoc 文档（每个服务）
- `api-docs/{service}-api.md` - Markdown 文档（每个服务）
- `api-docs/{service}-openapi.json` - OpenAPI JSON 规范（每个服务）

**生成的服务**:
1. `knowledge` - Knowledge Service
2. `content` - Content Service
3. `support` - Support Service
4. `analytics` - Analytics Service
5. `auth` - Auth Service

### 2. 生成特定服务文档

```bash
# 仅生成 Knowledge Service 文档
python generate_api_docs.py --service knowledge

# 仅生成 Content Service 文档
python generate_api_docs.py --service content

# 仅生成 Auth Service 文档
python generate_api_docs.py --service auth
```

### 3. 自定义输出目录

```bash
# 输出到自定义目录
python generate_api_docs.py --output ./custom-api-docs

# 输出到项目根目录的 docs 文件夹
python generate_api_docs.py --output ../../docs/api
```

### 4. 仅生成统一门户

```bash
# 只生成 API 门户（不重新生成各服务文档）
python generate_api_docs.py --portal
```

---

## 📊 查看 API 文档

### 方法 1: 直接打开 HTML 文件

```bash
# 打开统一 API 门户
open api-docs/index.html

# 打开特定服务的 Swagger UI
open api-docs/knowledge-swagger.html

# 打开特定服务的 Redoc
open api-docs/analytics-redoc.html
```

### 方法 2: 使用 HTTP 服务器

推荐使用 HTTP 服务器查看文档，避免跨域问题：

```bash
cd api-docs

# 使用 Python 内置 HTTP 服务器
python -m http.server 8080

# 或使用 Node.js http-server
npx http-server -p 8080

# 然后在浏览器访问
# http://localhost:8080          - 统一门户
# http://localhost:8080/knowledge-swagger.html  - Knowledge Service Swagger
# http://localhost:8080/content-redoc.html      - Content Service Redoc
```

### 方法 3: 使用 FastAPI 内置文档

FastAPI 服务自带交互式文档（需要服务运行）：

```bash
# Swagger UI
http://localhost:8001/docs  # Knowledge Service
http://localhost:8002/docs  # Content Service
http://localhost:8003/docs  # Support Service
http://localhost:8004/docs  # Analytics Service
http://localhost:8005/docs  # Auth Service

# Redoc
http://localhost:8001/redoc  # Knowledge Service
http://localhost:8002/redoc  # Content Service
# ... 其他服务
```

---

## 📖 文档格式详解

### 1. Swagger UI (`{service}-swagger.html`)

**特点**:
- ✅ 交互式 API 测试界面
- ✅ 可直接在浏览器中测试 API
- ✅ 支持认证配置（Bearer Token, OAuth）
- ✅ 实时查看请求/响应数据
- ✅ 支持参数过滤和搜索

**适用场景**:
- API 开发和调试
- 前端开发对接 API
- QA 测试 API 功能

**使用方法**:
1. 打开 Swagger UI 页面
2. 选择要测试的 API 端点
3. 点击 "Try it out"
4. 填写参数（如需认证，点击 "Authorize" 添加 Token）
5. 点击 "Execute" 执行请求
6. 查看响应结果

### 2. Redoc (`{service}-redoc.html`)

**特点**:
- ✅ 清晰美观的三栏布局
- ✅ 完整的 API 文档展示
- ✅ 响应式设计，移动端友好
- ✅ 支持深度链接（直接跳转到特定端点）
- ✅ 自动生成侧边栏目录

**适用场景**:
- API 文档阅读和学习
- 生成 PDF 文档（打印）
- 分享给外部合作伙伴

**优势**:
- 比 Swagger UI 更适合文档阅读
- 页面加载速度快
- 展示更多详细信息

### 3. Markdown (`{service}-api.md`)

**特点**:
- ✅ 纯文本格式，适合 Git 版本控制
- ✅ 可在 GitHub/GitLab 直接预览
- ✅ 易于集成到 Wiki 或文档系统
- ✅ 支持全文搜索
- ✅ 可导出为 HTML/PDF

**适用场景**:
- 代码仓库文档
- Wiki 集成
- 离线文档
- CI/CD 文档生成

**内容结构**:
```markdown
# {Service Name} - API Documentation

## Overview
- Description
- Base URL
- Version

## Endpoints
### {Tag Name}
#### `{METHOD} {PATH}`
- Summary
- Parameters
- Request Body
- Responses

## Data Models
### {Schema Name}
- Field descriptions
- Required fields
```

### 4. OpenAPI JSON (`{service}-openapi.json`)

**特点**:
- ✅ 标准化的 OpenAPI 3.0 规范
- ✅ 可被工具自动解析
- ✅ 支持代码生成（SDK、客户端）
- ✅ 适合 API 网关集成

**适用场景**:
- 自动生成客户端 SDK
- API 网关配置（Kong, AWS API Gateway）
- 第三方工具集成（Postman, Insomnia）
- 自动化测试

**使用示例**:
```bash
# 使用 Postman 导入
# File -> Import -> Upload Files -> 选择 openapi.json

# 生成 Python 客户端
openapi-generator-cli generate -i knowledge-openapi.json -g python -o ./sdk/python

# 生成 TypeScript 客户端
openapi-generator-cli generate -i content-openapi.json -g typescript-axios -o ./sdk/typescript
```

---

## 🌐 统一 API 门户

### 功能特性

**文件**: `api-docs/index.html`

**包含内容**:
1. **服务卡片**: 展示所有 5 个微服务
   - 服务名称和描述
   - 标签（知识、搜索、内容生成等）
   - 快速链接（Swagger UI, Redoc, Markdown, JSON）

2. **统计信息**:
   - 微服务数量: 5
   - QPS 目标: 10,000
   - SLA: 99.9%
   - API 版本: v1.0

3. **美观设计**:
   - 渐变背景
   - 响应式布局
   - 悬停动画效果
   - 统一品牌风格

### 访问方式

```bash
# 打开统一门户
open api-docs/index.html

# 或使用 HTTP 服务器
cd api-docs && python -m http.server 8080
# 访问: http://localhost:8080
```

---

## 🔧 高级用法

### 1. 集成到 CI/CD 流程

在 GitLab CI/CD 中自动生成 API 文档：

```yaml
# .gitlab-ci.yml
stages:
  - docs

generate_api_docs:
  stage: docs
  image: python:3.11
  services:
    - name: soundcore/knowledge-service:latest
      alias: knowledge
    - name: soundcore/content-service:latest
      alias: content
    # ... 其他服务
  script:
    - cd backend/docs
    - pip install -r requirements-docs.txt
    - python generate_api_docs.py --output ../../public/api-docs
  artifacts:
    paths:
      - public/api-docs
    expire_in: 30 days
  only:
    - main
    - develop
```

### 2. 定时更新文档

使用 cron 定时生成最新文档：

```bash
# 添加到 crontab
crontab -e

# 每天凌晨 2 点生成文档
0 2 * * * cd /path/to/backend/docs && python generate_api_docs.py
```

### 3. 自定义 OpenAPI 规范

在 FastAPI 服务中自定义 OpenAPI 规范：

```python
# knowledge_service/main.py
from fastapi import FastAPI

app = FastAPI(
    title="Knowledge Service",
    description="Knowledge base management, RAG engine, semantic search",
    version="1.0.0",
    openapi_tags=[
        {
            "name": "knowledge",
            "description": "Knowledge item management operations"
        },
        {
            "name": "search",
            "description": "Semantic search and retrieval"
        }
    ],
    servers=[
        {
            "url": "http://localhost:8001",
            "description": "Development server"
        },
        {
            "url": "https://api.soundcore-kcp.com",
            "description": "Production server"
        }
    ]
)

# 自定义 OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Knowledge Service",
        version="1.0.0",
        description="Comprehensive knowledge management API",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://soundcore.com/logo.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

### 4. 生成客户端 SDK

使用 OpenAPI Generator 生成多语言客户端：

```bash
# 安装 OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# 生成 Python SDK
openapi-generator-cli generate \
  -i api-docs/knowledge-openapi.json \
  -g python \
  -o ./sdk/python-knowledge-client \
  --additional-properties=packageName=soundcore_knowledge

# 生成 TypeScript SDK
openapi-generator-cli generate \
  -i api-docs/content-openapi.json \
  -g typescript-axios \
  -o ./sdk/ts-content-client

# 生成 Java SDK
openapi-generator-cli generate \
  -i api-docs/analytics-openapi.json \
  -g java \
  -o ./sdk/java-analytics-client \
  --additional-properties=groupId=com.soundcore,artifactId=analytics-client
```

---

## 📋 最佳实践

### 1. API 端点文档

**在 FastAPI 路由中添加详细文档**:

```python
@app.get(
    "/api/v1/knowledge/items",
    summary="List knowledge items",
    description="Retrieve a paginated list of knowledge items with optional filtering",
    response_description="List of knowledge items with pagination metadata",
    tags=["knowledge"]
)
async def list_knowledge_items(
    page: int = Query(1, description="Page number (starting from 1)", ge=1),
    page_size: int = Query(10, description="Number of items per page", ge=1, le=100),
    type: Optional[str] = Query(None, description="Filter by knowledge type (FAQ, GUIDE, etc.)"),
    product_id: Optional[str] = Query(None, description="Filter by product ID"),
    language: str = Query("EN", description="Language code (EN, CN, JP, DE)"),
):
    """
    Retrieve a paginated list of knowledge items.

    This endpoint supports filtering by type, product, and language.
    Results are sorted by quality score (descending) by default.

    **Permissions**: Requires authentication

    **Rate Limit**: 1000 requests per minute

    **Example**:
    ```
    GET /api/v1/knowledge/items?page=1&page_size=20&type=FAQ&language=EN
    ```
    """
    ...
```

### 2. 数据模型文档

**使用 Pydantic 模型添加字段说明**:

```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class KnowledgeItem(BaseModel):
    """Knowledge item model with comprehensive metadata"""

    id: str = Field(..., description="Unique identifier (UUID)", example="123e4567-e89b-12d3-a456-426614174000")
    title: str = Field(..., description="Knowledge item title", min_length=1, max_length=200, example="How to connect Bluetooth headphones")
    content: str = Field(..., description="Full knowledge content in Markdown format", example="# Bluetooth Connection\n\n1. Turn on Bluetooth...")
    type: str = Field(..., description="Knowledge type", example="FAQ")
    product_id: Optional[str] = Field(None, description="Associated product ID", example="SOUNDCORE-LIFE-Q30")
    language: str = Field("EN", description="Language code (ISO 639-1)", example="EN")
    tags: List[str] = Field(default_factory=list, description="Searchable tags", example=["bluetooth", "connectivity", "troubleshooting"])
    quality_score: float = Field(0.0, description="Content quality score (0-100)", ge=0, le=100, example=95.5)
    created_at: datetime = Field(..., description="Creation timestamp (ISO 8601)", example="2025-10-22T10:30:00Z")
    updated_at: datetime = Field(..., description="Last update timestamp (ISO 8601)", example="2025-10-22T15:45:00Z")

    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "title": "How to connect Bluetooth headphones",
                "content": "# Bluetooth Connection\n\n1. Turn on Bluetooth...",
                "type": "FAQ",
                "product_id": "SOUNDCORE-LIFE-Q30",
                "language": "EN",
                "tags": ["bluetooth", "connectivity"],
                "quality_score": 95.5,
                "created_at": "2025-10-22T10:30:00Z",
                "updated_at": "2025-10-22T15:45:00Z"
            }
        }
```

### 3. 错误响应文档

**统一错误响应格式**:

```python
from fastapi import HTTPException, status
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    """Standard error response format"""
    error: str = Field(..., description="Error type", example="ValidationError")
    message: str = Field(..., description="Human-readable error message", example="Invalid page parameter")
    detail: Optional[dict] = Field(None, description="Additional error details", example={"page": "must be >= 1"})
    request_id: str = Field(..., description="Unique request ID for tracking", example="req_abc123")

# 在路由中使用
@app.get("/api/v1/knowledge/items/{item_id}", responses={
    200: {"description": "Knowledge item found"},
    404: {"model": ErrorResponse, "description": "Knowledge item not found"},
    422: {"model": ErrorResponse, "description": "Validation error"}
})
async def get_knowledge_item(item_id: str):
    if not item_exists(item_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "NotFound",
                "message": f"Knowledge item '{item_id}' not found",
                "request_id": get_request_id()
            }
        )
    ...
```

### 4. 认证文档

**添加认证说明**:

```python
from fastapi.security import HTTPBearer, OAuth2PasswordBearer

# JWT Bearer Token
security = HTTPBearer()

# OAuth 2.0
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/token",
    scopes={
        "knowledge:read": "Read knowledge items",
        "knowledge:write": "Create and update knowledge items",
        "knowledge:delete": "Delete knowledge items",
        "admin": "Full administrative access"
    }
)

# 在路由中使用
@app.get("/api/v1/knowledge/items", dependencies=[Depends(security)])
async def list_knowledge_items():
    """
    **Authentication**: Requires Bearer Token

    **Scopes**: knowledge:read

    **Example**:
    ```
    curl -H "Authorization: Bearer YOUR_TOKEN" \
      http://localhost:8001/api/v1/knowledge/items
    ```
    """
    ...
```

---

## 🐛 故障排查

### 问题 1: 无法获取 OpenAPI 规范

**错误**:
```
❌ Knowledge Service not available at http://localhost:8001
```

**解决方案**:
1. 检查服务是否运行:
```bash
curl http://localhost:8001/health
```

2. 检查服务日志:
```bash
docker logs knowledge-service
```

3. 确认端口正确:
```bash
netstat -an | grep 8001
# 或
lsof -i :8001
```

4. 重启服务:
```bash
docker-compose restart knowledge-service
```

### 问题 2: 生成的文档为空

**原因**: FastAPI 服务可能没有正确配置 OpenAPI

**解决方案**:
1. 确认 FastAPI 应用配置:
```python
app = FastAPI(
    title="Service Name",
    description="Service description",
    version="1.0.0"
)
```

2. 检查路由是否有文档:
```python
# ✅ 正确 - 有文档
@app.get("/items", summary="List items")
async def list_items():
    ...

# ❌ 错误 - 无文档
@app.get("/items")
async def list_items():
    ...
```

3. 直接访问 OpenAPI JSON 验证:
```bash
curl http://localhost:8001/openapi.json | jq
```

### 问题 3: Swagger UI 无法加载

**原因**: 跨域问题或 CDN 加载失败

**解决方案**:
1. 使用 HTTP 服务器查看文档:
```bash
cd api-docs && python -m http.server 8080
```

2. 检查浏览器控制台错误

3. 确认网络连接（Swagger UI 使用 CDN）

### 问题 4: Markdown 文档格式错误

**原因**: OpenAPI 规范中包含特殊字符

**解决方案**:
1. 检查生成的 Markdown 文件
2. 手动修正格式问题
3. 在 FastAPI 中使用纯文本描述（避免特殊 Markdown 字符）

---

## 📊 文档示例

### 完整的 API 端点文档示例

```python
from fastapi import FastAPI, Query, Path, Body, status
from pydantic import BaseModel, Field
from typing import List, Optional

app = FastAPI(
    title="Knowledge Service API",
    description="Comprehensive knowledge management system",
    version="1.0.0"
)

class KnowledgeItemCreate(BaseModel):
    """Request model for creating a knowledge item"""
    title: str = Field(..., description="Item title", min_length=1, max_length=200)
    content: str = Field(..., description="Item content in Markdown")
    type: str = Field(..., description="Item type (FAQ, GUIDE, etc.)")
    product_id: Optional[str] = Field(None, description="Related product ID")
    language: str = Field("EN", description="Language code")
    tags: List[str] = Field(default_factory=list, description="Search tags")

class KnowledgeItemResponse(KnowledgeItemCreate):
    """Response model for knowledge item"""
    id: str = Field(..., description="Unique item ID")
    quality_score: float = Field(..., description="Content quality score")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Update timestamp")

@app.post(
    "/api/v1/knowledge/items",
    response_model=KnowledgeItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new knowledge item",
    description="Create a new knowledge item with automatic quality scoring and vectorization",
    response_description="Created knowledge item with metadata",
    tags=["knowledge"],
    responses={
        201: {
            "description": "Knowledge item created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "title": "How to pair Bluetooth",
                        "content": "# Pairing Instructions...",
                        "type": "FAQ",
                        "product_id": "SOUNDCORE-LIFE-Q30",
                        "language": "EN",
                        "tags": ["bluetooth", "pairing"],
                        "quality_score": 92.5,
                        "created_at": "2025-10-22T10:30:00Z",
                        "updated_at": "2025-10-22T10:30:00Z"
                    }
                }
            }
        },
        422: {"description": "Validation error"},
        500: {"description": "Internal server error"}
    }
)
async def create_knowledge_item(
    item: KnowledgeItemCreate = Body(
        ...,
        description="Knowledge item data",
        example={
            "title": "How to pair Bluetooth",
            "content": "# Pairing Instructions\n\n1. Turn on Bluetooth...",
            "type": "FAQ",
            "product_id": "SOUNDCORE-LIFE-Q30",
            "language": "EN",
            "tags": ["bluetooth", "pairing"]
        }
    )
):
    """
    Create a new knowledge item.

    **Process**:
    1. Validate input data
    2. Generate content embedding (1536 dimensions)
    3. Calculate quality score (readability, completeness)
    4. Store in database and vector index
    5. Return created item with metadata

    **Quality Score Calculation**:
    - Content length and structure: 30%
    - Grammar and readability: 30%
    - Keyword relevance: 20%
    - Completeness: 20%

    **Automatic Processing**:
    - ✅ Text embedding generation
    - ✅ Quality scoring
    - ✅ Duplicate detection
    - ✅ Search index update

    **Example**:
    ```bash
    curl -X POST http://localhost:8001/api/v1/knowledge/items \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer YOUR_TOKEN" \
      -d '{
        "title": "How to pair Bluetooth",
        "content": "# Pairing Instructions...",
        "type": "FAQ",
        "product_id": "SOUNDCORE-LIFE-Q30",
        "language": "EN",
        "tags": ["bluetooth", "pairing"]
      }'
    ```
    """
    # Implementation
    ...
```

---

## 🔗 相关文档

- **API 集成测试**: `../tests/test_api_integration.py` - API 端点测试
- **负载测试指南**: `../tests/LOAD_TEST_GUIDE.md` - K6 负载测试
- **数据库性能测试**: `../tests/DATABASE_PERFORMANCE_GUIDE.md` - 数据库测试
- **项目开发文档**: `../../soundcore-kcp-dev.md` - 完整开发指南

---

## ✅ 检查清单

### 文档生成前
- [ ] 所有后端服务运行正常
- [ ] 已安装 `requirements-docs.txt` 依赖
- [ ] 服务健康检查通过 (`/health` 端点)
- [ ] 可访问 OpenAPI 规范 (`/openapi.json`)

### 文档质量检查
- [ ] 所有 API 端点有 `summary` 和 `description`
- [ ] Pydantic 模型字段有 `description`
- [ ] 包含示例数据 (`example` 参数)
- [ ] 错误响应有文档 (`responses` 参数)
- [ ] 认证方式已说明
- [ ] 标签（tags）正确分组

### 文档发布检查
- [ ] Swagger UI 可正常访问
- [ ] Redoc 可正常访问
- [ ] Markdown 文档格式正确
- [ ] OpenAPI JSON 有效（可被工具解析）
- [ ] 统一门户正常显示所有服务

---

## 📞 获取帮助

遇到问题时:

1. **查看脚本帮助**:
```bash
python generate_api_docs.py --help
```

2. **检查服务状态**:
```bash
curl http://localhost:8001/health
curl http://localhost:8001/openapi.json | jq
```

3. **查看服务日志**:
```bash
docker logs knowledge-service
docker logs content-service
```

4. **参考文档**:
- FastAPI 官方文档: https://fastapi.tiangolo.com
- OpenAPI 规范: https://swagger.io/specification/
- Swagger UI: https://swagger.io/tools/swagger-ui/
- Redoc: https://redocly.com/redoc/

---

**最后更新**: 2025-10-22
**版本**: 1.0.0
**维护团队**: Soundcore KCP 开发团队
