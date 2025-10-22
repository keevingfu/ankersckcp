# 🚦 API Rate Limiting Implementation Guide
# API 速率限制实施指南

**版本**: 1.0.0
**更新日期**: 2025-10-22

---

## 📋 目录

1. [概述](#概述)
2. [速率限制策略](#速率限制策略)
3. [FastAPI 实现](#fastapi-实现)
4. [Kubernetes Ingress 限制](#kubernetes-ingress-限制)
5. [监控与告警](#监控与告警)
6. [测试验证](#测试验证)

---

## 1. 概述

### 1.1 为什么需要速率限制

- **保护系统资源**: 防止恶意请求耗尽系统资源
- **确保服务质量**: 保证所有用户都能获得合理的服务
- **防止 DDoS 攻击**: 限制单个来源的请求频率
- **成本控制**: 控制外部 API 调用成本（OpenAI, Claude）

### 1.2 限制层级

```
┌─────────────────────────────────┐
│   CDN/WAF 层（Cloudflare）      │  ← 第一道防线
├─────────────────────────────────┤
│   Ingress 层（Nginx/Kong）      │  ← 基础限制
├─────────────────────────────────┤
│   应用层（FastAPI）             │  ← 细粒度控制
├─────────────────────────────────┤
│   用户层（账户级别）             │  ← 业务限制
└─────────────────────────────────┘
```

---

## 2. 速率限制策略

### 2.1 限流策略表

| 服务 | 端点类型 | 匿名用户 | 已认证用户 | 高级用户 |
|------|---------|---------|-----------|---------|
| **Knowledge Service** | | | | |
| - 搜索 | 10/min | 100/min | 1000/min |
| - 列表查询 | 20/min | 200/min | 2000/min |
| - 详情查询 | 50/min | 500/min | 5000/min |
| **Content Service** | | | | |
| - 内容生成 | 1/min | 10/min | 100/min |
| - 发布内容 | 5/min | 50/min | 500/min |
| **Support Service** | | | | |
| - 创建对话 | 5/min | 50/min | 500/min |
| - 发送消息 | 10/min | 100/min | 1000/min |
| **Analytics Service** | | | | |
| - 概览数据 | 10/min | 100/min | 1000/min |
| - 详细报告 | 5/min | 50/min | 500/min |
| **Auth Service** | | | | |
| - 登录 | 5/min | N/A | N/A |
| - 注册 | 3/min | N/A | N/A |
| - 刷新 Token | 10/min | 100/min | 1000/min |

### 2.2 算法选择

#### 令牌桶算法（Token Bucket）
- **特点**: 允许短时间突发流量
- **适用场景**: 内容生成、文件上传

#### 滑动窗口算法（Sliding Window）
- **特点**: 精确限流，平滑流量
- **适用场景**: API 查询、搜索

#### 固定窗口算法（Fixed Window）
- **特点**: 实现简单，性能高
- **适用场景**: 低频操作、认证

---

## 3. FastAPI 实现

### 3.1 依赖安装

```bash
# backend/requirements.txt
fastapi>=0.109.0
slowapi>=0.1.9      # 速率限制库
redis>=5.0.1        # Redis 存储
python-jose>=3.3.0  # JWT 处理
```

### 3.2 速率限制中间件

**创建**: `backend/middleware/rate_limiter.py`

```python
"""
API Rate Limiting Middleware for Soundcore KCP
使用 Redis 实现分布式速率限制
"""

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis.asyncio as redis
from typing import Callable, Optional
import time
import hashlib
import json

# Redis 客户端
redis_client: Optional[redis.Redis] = None

# 速率限制器
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000/hour"],  # 默认限制
    storage_uri="redis://localhost:6379",
    enabled=True,
)


def init_rate_limiter(app: FastAPI, redis_url: str = "redis://localhost:6379"):
    """初始化速率限制器"""
    global redis_client

    # 连接 Redis
    redis_client = redis.from_url(redis_url, decode_responses=True)

    # 注册速率限制器
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # 添加自定义速率限制响应
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "error": "RateLimitExceeded",
                "message": "Too many requests. Please try again later.",
                "retry_after": exc.detail,
            },
            headers={"Retry-After": str(exc.detail)},
        )

    print("✅ Rate limiter initialized with Redis backend")


# 自定义速率限制键函数
def get_user_identifier(request: Request) -> str:
    """
    获取用户标识符用于速率限制
    优先级: User ID > API Key > IP Address
    """
    # 1. 检查 JWT Token
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        try:
            # 解析 JWT 获取用户 ID
            # payload = decode_jwt(token)
            # return f"user:{payload['sub']}"
            return f"user:{hashlib.md5(token.encode()).hexdigest()[:16]}"
        except:
            pass

    # 2. 检查 API Key
    api_key = request.headers.get("X-API-Key", "")
    if api_key:
        return f"apikey:{hashlib.md5(api_key.encode()).hexdigest()[:16]}"

    # 3. 使用 IP 地址
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    if forwarded_for:
        return f"ip:{forwarded_for.split(',')[0].strip()}"

    return f"ip:{request.client.host}"


def get_user_tier(request: Request) -> str:
    """
    获取用户等级
    - anonymous: 匿名用户
    - authenticated: 已认证用户
    - premium: 高级用户
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header:
        return "anonymous"

    # 从 JWT 或数据库获取用户等级
    # 这里简化为示例
    # user = get_user_from_token(auth_header)
    # return user.tier

    return "authenticated"  # 默认已认证


# 分层速率限制装饰器
def tiered_rate_limit(
    anonymous: str = "10/minute",
    authenticated: str = "100/minute",
    premium: str = "1000/minute",
):
    """
    根据用户等级应用不同的速率限制

    Usage:
        @app.get("/api/v1/items")
        @tiered_rate_limit(anonymous="10/min", authenticated="100/min")
        async def list_items():
            ...
    """

    def decorator(func: Callable):
        async def wrapper(request: Request, *args, **kwargs):
            user_tier = get_user_tier(request)
            user_id = get_user_identifier(request)

            # 选择对应的限制
            rate_limits = {
                "anonymous": anonymous,
                "authenticated": authenticated,
                "premium": premium,
            }
            limit = rate_limits.get(user_tier, anonymous)

            # 检查速率限制
            is_allowed = await check_rate_limit(user_id, limit, func.__name__)

            if not is_allowed:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again later.",
                    headers={"Retry-After": "60"},
                )

            return await func(request, *args, **kwargs)

        return wrapper

    return decorator


async def check_rate_limit(
    identifier: str, limit: str, endpoint: str
) -> bool:
    """
    检查速率限制（滑动窗口算法）

    Args:
        identifier: 用户标识符
        limit: 限制格式 "10/minute" 或 "100/hour"
        endpoint: API 端点名称

    Returns:
        bool: True 表示允许请求，False 表示超过限制
    """
    if not redis_client:
        return True  # Redis 不可用时跳过限制

    # 解析限制
    count, period = limit.split("/")
    count = int(count)

    # 时间窗口（秒）
    window_seconds = {
        "second": 1,
        "minute": 60,
        "hour": 3600,
        "day": 86400,
    }[period.rstrip("s")]

    # Redis 键
    key = f"ratelimit:{endpoint}:{identifier}:{int(time.time() // window_seconds)}"

    try:
        # 增加计数
        current = await redis_client.incr(key)

        # 首次请求设置过期时间
        if current == 1:
            await redis_client.expire(key, window_seconds)

        # 检查是否超限
        return current <= count

    except Exception as e:
        print(f"Rate limit check error: {e}")
        return True  # 出错时允许请求


# 滑动窗口计数器（更精确）
async def sliding_window_rate_limit(
    identifier: str, max_requests: int, window_seconds: int, endpoint: str
) -> bool:
    """
    滑动窗口速率限制（更精确但更复杂）
    """
    if not redis_client:
        return True

    key = f"ratelimit:sliding:{endpoint}:{identifier}"
    now = time.time()
    window_start = now - window_seconds

    try:
        # 使用 Redis Sorted Set
        pipe = redis_client.pipeline()

        # 1. 删除窗口外的旧记录
        pipe.zremrangebyscore(key, 0, window_start)

        # 2. 统计当前窗口内的请求数
        pipe.zcard(key)

        # 3. 添加当前请求
        pipe.zadd(key, {str(now): now})

        # 4. 设置过期时间
        pipe.expire(key, window_seconds)

        results = await pipe.execute()

        # 检查是否超限（results[1] 是 zcard 的结果）
        current_count = results[1]
        return current_count < max_requests

    except Exception as e:
        print(f"Sliding window rate limit error: {e}")
        return True


# 令牌桶算法
class TokenBucket:
    """令牌桶速率限制"""

    def __init__(
        self, capacity: int, refill_rate: float, redis_client: redis.Redis
    ):
        self.capacity = capacity  # 桶容量
        self.refill_rate = refill_rate  # 每秒补充速率
        self.redis = redis_client

    async def consume(self, identifier: str, tokens: int = 1) -> bool:
        """
        消费令牌

        Args:
            identifier: 用户标识符
            tokens: 需要消费的令牌数

        Returns:
            bool: True 表示成功消费，False 表示令牌不足
        """
        key = f"ratelimit:bucket:{identifier}"
        now = time.time()

        try:
            # 获取当前桶状态
            bucket_data = await self.redis.get(key)

            if bucket_data:
                data = json.loads(bucket_data)
                last_refill = data["last_refill"]
                current_tokens = data["tokens"]

                # 计算应补充的令牌
                time_passed = now - last_refill
                refill_tokens = time_passed * self.refill_rate
                current_tokens = min(self.capacity, current_tokens + refill_tokens)
            else:
                # 首次请求，桶满
                current_tokens = self.capacity
                last_refill = now

            # 尝试消费令牌
            if current_tokens >= tokens:
                new_tokens = current_tokens - tokens
                await self.redis.setex(
                    key,
                    3600,  # 1小时过期
                    json.dumps({"tokens": new_tokens, "last_refill": now}),
                )
                return True
            else:
                return False

        except Exception as e:
            print(f"Token bucket error: {e}")
            return True  # 出错时允许请求
```

---

### 3.3 FastAPI 应用集成

**更新**: `backend/knowledge_service/main.py`

```python
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from middleware.rate_limiter import (
    init_rate_limiter,
    tiered_rate_limit,
    limiter,
)

app = FastAPI(
    title="Knowledge Service",
    description="Knowledge base management with rate limiting",
    version="1.0.0",
)

# 初始化速率限制器
init_rate_limiter(app, redis_url="redis://localhost:6379")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# 示例：使用基础速率限制
@app.get("/api/v1/knowledge/items")
@limiter.limit("100/minute")  # 所有用户 100 req/min
async def list_knowledge_items(request: Request):
    """列表查询 - 基础速率限制"""
    return {"items": [], "total": 0}


# 示例：使用分层速率限制
@app.get("/api/v1/knowledge/search")
@tiered_rate_limit(
    anonymous="10/minute",
    authenticated="100/minute",
    premium="1000/minute",
)
async def search_knowledge(request: Request, q: str):
    """搜索 - 分层速率限制"""
    return {"query": q, "results": []}


# 示例：高成本操作的严格限制
@app.post("/api/v1/content/generate")
@tiered_rate_limit(
    anonymous="1/minute",
    authenticated="10/minute",
    premium="100/minute",
)
async def generate_content(request: Request):
    """内容生成 - 严格速率限制"""
    return {"task_id": "xxx", "status": "processing"}


# 健康检查（不限流）
@app.get("/health")
@limiter.exempt
async def health_check():
    """健康检查端点不受速率限制"""
    return {"status": "healthy"}


# 监控端点（不限流）
@app.get("/metrics")
@limiter.exempt
async def metrics():
    """Prometheus 监控端点不受速率限制"""
    return {"metrics": "..."}
```

---

## 4. Kubernetes Ingress 限制

### 4.1 Nginx Ingress 配置

**创建**: `k8s/ingress/rate-limiting-ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kcp-ingress-rate-limited
  namespace: soundcore-kcp-prod
  annotations:
    # 基础速率限制（全局）
    nginx.ingress.kubernetes.io/limit-rps: "1000"        # 1000 req/s
    nginx.ingress.kubernetes.io/limit-connections: "100" # 100 并发连接

    # 白名单（不限流）
    nginx.ingress.kubernetes.io/whitelist-source-range: "10.0.0.0/8,192.168.0.0/16"

    # 速率限制区域配置
    nginx.ingress.kubernetes.io/configuration-snippet: |
      # 基于 IP 的速率限制
      limit_req_zone $binary_remote_addr zone=ip_limit:10m rate=100r/s;

      # 基于 API Key 的速率限制
      limit_req_zone $http_x_api_key zone=apikey_limit:10m rate=1000r/s;

      # 应用速率限制
      limit_req zone=ip_limit burst=200 nodelay;

      # 超限时的响应
      limit_req_status 429;

      # 设置 Retry-After 头
      add_header Retry-After "60" always;

    # 连接超时
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "30"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"

spec:
  ingressClassName: nginx
  rules:
    - host: api.soundcore-kcp.com
      http:
        paths:
          # Knowledge Service
          - path: /api/v1/knowledge
            pathType: Prefix
            backend:
              service:
                name: knowledge-service
                port:
                  number: 8001

          # Content Service（更严格限制）
          - path: /api/v1/content
            pathType: Prefix
            backend:
              service:
                name: content-service
                port:
                  number: 8002

  tls:
    - hosts:
        - api.soundcore-kcp.com
      secretName: kcp-tls-cert
```

### 4.2 Kong API Gateway 配置

**创建**: `k8s/kong/rate-limiting-plugin.yaml`

```yaml
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: rate-limiting-global
  namespace: soundcore-kcp-prod
plugin: rate-limiting
config:
  minute: 100
  hour: 6000
  policy: redis
  redis_host: redis-service
  redis_port: 6379
  fault_tolerant: true
  hide_client_headers: false

---
apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: rate-limiting-premium
  namespace: soundcore-kcp-prod
plugin: rate-limiting
config:
  minute: 1000
  hour: 60000
  policy: redis
  redis_host: redis-service
  redis_port: 6379

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kcp-kong-ingress
  namespace: soundcore-kcp-prod
  annotations:
    konghq.com/plugins: rate-limiting-global
    konghq.com/strip-path: "true"
spec:
  ingressClassName: kong
  rules:
    - host: api.soundcore-kcp.com
      http:
        paths:
          - path: /api/v1/knowledge
            pathType: Prefix
            backend:
              service:
                name: knowledge-service
                port:
                  number: 8001
```

---

## 5. 监控与告警

### 5.1 Prometheus 指标

**在 FastAPI 中添加监控**:

```python
from prometheus_client import Counter, Histogram

# 定义指标
rate_limit_exceeded = Counter(
    'rate_limit_exceeded_total',
    'Total number of rate limit exceeded errors',
    ['service', 'endpoint', 'user_tier']
)

request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['service', 'endpoint', 'method', 'status']
)


@app.middleware("http")
async def monitor_rate_limits(request: Request, call_next):
    """监控速率限制"""
    try:
        response = await call_next(request)

        # 记录 429 错误
        if response.status_code == 429:
            rate_limit_exceeded.labels(
                service='knowledge-service',
                endpoint=request.url.path,
                user_tier=get_user_tier(request)
            ).inc()

        return response
    except RateLimitExceeded:
        rate_limit_exceeded.labels(
            service='knowledge-service',
            endpoint=request.url.path,
            user_tier=get_user_tier(request)
        ).inc()
        raise
```

### 5.2 Grafana 仪表板

**关键面板**:

1. **速率限制触发次数**
```promql
rate(rate_limit_exceeded_total[5m])
```

2. **按用户等级分类的限流**
```promql
sum by (user_tier) (rate_limit_exceeded_total)
```

3. **429 错误率**
```promql
rate(http_requests_total{status="429"}[5m]) / rate(http_requests_total[5m])
```

---

## 6. 测试验证

### 6.1 压力测试脚本

**创建**: `tests/test_rate_limiting.py`

```python
import asyncio
import aiohttp
import time

API_URL = "http://localhost:8001/api/v1/knowledge/search"
RATE_LIMIT = 100  # 每分钟 100 次


async def make_request(session, index):
    """发送单个请求"""
    try:
        async with session.get(f"{API_URL}?q=test") as response:
            return {
                "index": index,
                "status": response.status,
                "time": time.time(),
            }
    except Exception as e:
        return {"index": index, "error": str(e)}


async def test_rate_limit():
    """测试速率限制"""
    requests_count = 150  # 超过限制
    start_time = time.time()

    async with aiohttp.ClientSession() as session:
        tasks = [make_request(session, i) for i in range(requests_count)]
        results = await asyncio.gather(*tasks)

    # 统计结果
    success = sum(1 for r in results if r.get("status") == 200)
    rate_limited = sum(1 for r in results if r.get("status") == 429)
    errors = sum(1 for r in results if "error" in r)

    elapsed = time.time() - start_time

    print(f"\n{'='*60}")
    print(f"速率限制测试结果")
    print(f"{'='*60}")
    print(f"总请求数: {requests_count}")
    print(f"成功: {success}")
    print(f"被限流 (429): {rate_limited}")
    print(f"错误: {errors}")
    print(f"耗时: {elapsed:.2f}s")
    print(f"{'='*60}\n")

    # 验证速率限制是否生效
    assert rate_limited > 0, "速率限制未生效！"
    assert success <= RATE_LIMIT, f"超过限制！允许了 {success} 个请求"

    print("✅ 速率限制测试通过")


if __name__ == "__main__":
    asyncio.run(test_rate_limit())
```

### 6.2 手动测试

```bash
# 测试匿名用户限制
for i in {1..15}; do
    curl -w "\n%{http_code}\n" http://localhost:8001/api/v1/knowledge/search?q=test
    sleep 0.5
done

# 测试已认证用户限制
TOKEN="your-jwt-token"
for i in {1..150}; do
    curl -H "Authorization: Bearer $TOKEN" \
        -w "\n%{http_code}\n" \
        http://localhost:8001/api/v1/knowledge/search?q=test
    sleep 0.1
done
```

---

## 7. 最佳实践

### 7.1 设置合理的限制

- **过严**: 影响正常用户体验
- **过松**: 无法有效保护系统
- **建议**: 基于实际流量数据的 1.5-2 倍设置

### 7.2 提供清晰的错误信息

```json
{
  "error": "RateLimitExceeded",
  "message": "You have exceeded your rate limit of 100 requests per minute",
  "retry_after": 60,
  "current_limit": {
    "limit": 100,
    "remaining": 0,
    "reset": 1698765432
  },
  "upgrade_info": {
    "tier": "premium",
    "limit": 1000,
    "url": "https://soundcore.com/upgrade"
  }
}
```

### 7.3 监控与调整

- 定期审查速率限制触发日志
- 根据业务增长调整限制
- 为重要客户提供白名单

---

## 8. 故障排查

### 常见问题

**问题 1: Redis 连接失败导致速率限制失效**
```python
# 解决方案：添加降级逻辑
if not redis_client:
    logger.warning("Redis unavailable, rate limiting disabled")
    return True  # 允许请求通过
```

**问题 2: 429 错误过多**
```bash
# 检查限制配置是否过严
kubectl logs -l app=knowledge-service | grep "Rate limit exceeded" | wc -l

# 临时增加限制
kubectl set env deployment/knowledge-service RATE_LIMIT_MULTIPLIER=2
```

**问题 3: 分布式环境下计数不准确**
- 确保使用 Redis 作为共享存储
- 使用滑动窗口算法提高精确度

---

## 附录

### A. 完整配置示例

**环境变量**: `.env`
```bash
# Rate Limiting Configuration
REDIS_URL=redis://redis:6379
RATE_LIMIT_ENABLED=true
RATE_LIMIT_ALGORITHM=sliding_window  # fixed_window, sliding_window, token_bucket

# Default Limits
RATE_LIMIT_ANONYMOUS=10/minute
RATE_LIMIT_AUTHENTICATED=100/minute
RATE_LIMIT_PREMIUM=1000/minute

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=
```

---

**文档版本**: 1.0.0
**维护团队**: Soundcore KCP Backend Team
**下次审查**: 2025-11-22
