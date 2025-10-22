# 🔧 Soundcore KCP - Production Operations Manual
# 生产环境运维手册

**版本**: 1.0.0
**最后更新**: 2025-10-22
**维护团队**: Soundcore KCP DevOps Team

---

## 📋 目录

1. [日常运维操作](#日常运维操作)
2. [监控与告警](#监控与告警)
3. [故障恢复流程](#故障恢复流程)
4. [扩容与缩容](#扩容与缩容)
5. [数据备份与恢复](#数据备份与恢复)
6. [性能优化](#性能优化)
7. [安全运维](#安全运维)
8. [应急响应](#应急响应)

---

## 1. 日常运维操作

### 1.1 服务健康检查

#### 自动化健康检查脚本

**创建**: `/scripts/health-check.sh`

```bash
#!/bin/bash
# Soundcore KCP - 服务健康检查脚本

set -e

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 服务端点配置
SERVICES=(
    "frontend:https://kcp.soundcore.com:/"
    "knowledge:https://api.soundcore.com:8001/health"
    "content:https://api.soundcore.com:8002/health"
    "support:https://api.soundcore.com:8003/health"
    "analytics:https://api.soundcore.com:8004/health"
    "auth:https://api.soundcore.com:8005/health"
)

# 数据库检查
DATABASES=(
    "postgres:postgresql://user:pass@db-host:5432/soundcore_kcp"
    "mongodb:mongodb://user:pass@mongo-host:27017/soundcore_kcp"
    "redis:redis://redis-host:6379"
)

echo "=================================="
echo "🔍 Soundcore KCP 健康检查"
echo "$(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================="

# 检查服务
echo -e "\n📊 检查服务状态..."
for service in "${SERVICES[@]}"; do
    IFS=':' read -r name url <<< "$service"

    if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name - OK${NC}"
    else
        echo -e "${RED}❌ $name - FAILED${NC}"
        # 发送告警
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"🚨 Service Down: $name at $(date)\"}"
    fi
done

# 检查数据库
echo -e "\n💾 检查数据库连接..."
# PostgreSQL
if pg_isready -h db-host -p 5432 -U user > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL - OK${NC}"
else
    echo -e "${RED}❌ PostgreSQL - FAILED${NC}"
fi

# MongoDB
if mongosh "mongodb://user:pass@mongo-host:27017/soundcore_kcp?authSource=admin" --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB - OK${NC}"
else
    echo -e "${RED}❌ MongoDB - FAILED${NC}"
fi

# Redis
if redis-cli -h redis-host ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis - OK${NC}"
else
    echo -e "${RED}❌ Redis - FAILED${NC}"
fi

# Kubernetes 资源检查
echo -e "\n☸️  检查 Kubernetes 资源..."
kubectl get pods -n soundcore-kcp-prod --no-headers | while read line; do
    pod_name=$(echo $line | awk '{print $1}')
    pod_status=$(echo $line | awk '{print $3}')

    if [ "$pod_status" = "Running" ]; then
        echo -e "${GREEN}✅ $pod_name - Running${NC}"
    else
        echo -e "${RED}❌ $pod_name - $pod_status${NC}"
    fi
done

echo -e "\n=================================="
echo "✅ 健康检查完成"
echo "=================================="
```

#### 定时执行

```bash
# 添加到 crontab（每 5 分钟执行一次）
crontab -e

# 每 5 分钟执行健康检查
*/5 * * * * /path/to/scripts/health-check.sh >> /var/log/kcp-health-check.log 2>&1
```

---

### 1.2 日志管理

#### 查看实时日志

```bash
# Frontend 日志
kubectl logs -f deployment/frontend -n soundcore-kcp-prod

# Knowledge Service 日志
kubectl logs -f deployment/knowledge-service -n soundcore-kcp-prod

# 查看最近 100 行日志
kubectl logs --tail=100 deployment/content-service -n soundcore-kcp-prod

# 查看特定 Pod 的日志
kubectl logs -f knowledge-service-7d9b8c6f5-abcde -n soundcore-kcp-prod
```

#### 日志聚合查询（使用 ELK/Loki）

```bash
# Loki 查询示例
{namespace="soundcore-kcp-prod", app="knowledge-service"} |= "ERROR"

# 查询特定时间范围
{app="analytics-service"} |= "performance"
  | json
  | response_time > 1000

# 统计错误数量
sum by (service) (rate({namespace="soundcore-kcp-prod"} |= "ERROR" [5m]))
```

#### 日志归档策略

```yaml
# fluentd-config.yaml
<match kcp.**>
  @type file
  path /var/log/kcp/archive/${tag}/%Y%m%d
  compress gzip

  <buffer tag,time>
    timekey 1d
    timekey_wait 10m
    flush_mode interval
    flush_interval 10m
  </buffer>
</match>
```

---

### 1.3 资源使用监控

#### 查看资源使用情况

```bash
# 查看 Pod 资源使用
kubectl top pods -n soundcore-kcp-prod

# 查看 Node 资源使用
kubectl top nodes

# 详细资源信息
kubectl describe node <node-name>
```

#### 资源使用告警阈值

| 资源 | 警告阈值 | 严重阈值 | 操作 |
|------|---------|---------|------|
| CPU | 70% | 85% | 考虑扩容 |
| Memory | 75% | 90% | 立即扩容 |
| Disk | 70% | 85% | 清理日志/扩容 |
| Network | 70% | 85% | 检查流量异常 |

---

### 1.4 数据库维护

#### PostgreSQL 日常维护

```sql
-- 查看数据库大小
SELECT pg_size_pretty(pg_database_size('soundcore_kcp'));

-- 查看表大小
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- 查看慢查询
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- 重建索引（每周执行）
REINDEX DATABASE soundcore_kcp;

-- 清理过期数据（每天执行）
VACUUM ANALYZE;

-- 更新统计信息
ANALYZE;
```

#### MongoDB 日常维护

```javascript
// 查看数据库统计
db.stats()

// 查看集合大小
db.knowledge_items.stats()

// 查看慢查询
db.system.profile.find().sort({ts: -1}).limit(10)

// 重建索引
db.knowledge_items.reIndex()

// 压缩集合（每月执行）
db.runCommand({ compact: 'knowledge_items' })

// 删除过期数据
db.search_queries.deleteMany({
    created_at: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
})
```

#### Redis 日常维护

```bash
# 查看内存使用
redis-cli INFO memory

# 查看键数量
redis-cli DBSIZE

# 查看慢查询
redis-cli SLOWLOG GET 10

# 清理过期键（自动）
# Redis 自动清理，但可以手动触发
redis-cli --scan --pattern "cache:*" | xargs redis-cli DEL

# 持久化检查
redis-cli INFO persistence

# 检查主从同步状态（如果使用主从）
redis-cli INFO replication
```

---

## 2. 监控与告警

### 2.1 Prometheus 监控配置

#### Prometheus 配置文件

**创建**: `k8s/monitoring/prometheus-config.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
      external_labels:
        cluster: 'soundcore-kcp-prod'
        environment: 'production'

    # 告警规则
    rule_files:
      - /etc/prometheus/rules/*.yml

    # Alertmanager 配置
    alerting:
      alertmanagers:
        - static_configs:
            - targets:
                - alertmanager:9093

    # 抓取配置
    scrape_configs:
      # Kubernetes API Server
      - job_name: 'kubernetes-apiservers'
        kubernetes_sd_configs:
          - role: endpoints
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
          - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
            action: keep
            regex: default;kubernetes;https

      # Kubernetes Nodes
      - job_name: 'kubernetes-nodes'
        kubernetes_sd_configs:
          - role: node
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
          - action: labelmap
            regex: __meta_kubernetes_node_label_(.+)

      # Kubernetes Pods
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: $1:$2
            target_label: __address__
          - action: labelmap
            regex: __meta_kubernetes_pod_label_(.+)
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            target_label: kubernetes_pod_name

      # Soundcore KCP Services
      - job_name: 'kcp-services'
        static_configs:
          - targets:
              - 'knowledge-service:8001'
              - 'content-service:8002'
              - 'support-service:8003'
              - 'analytics-service:8004'
              - 'auth-service:8005'
        relabel_configs:
          - source_labels: [__address__]
            target_label: instance
          - source_labels: [__address__]
            regex: '([^:]+):.*'
            target_label: service
            replacement: '$1'

      # PostgreSQL Exporter
      - job_name: 'postgres'
        static_configs:
          - targets: ['postgres-exporter:9187']

      # MongoDB Exporter
      - job_name: 'mongodb'
        static_configs:
          - targets: ['mongodb-exporter:9216']

      # Redis Exporter
      - job_name: 'redis'
        static_configs:
          - targets: ['redis-exporter:9121']

      # Node Exporter
      - job_name: 'node-exporter'
        kubernetes_sd_configs:
          - role: node
        relabel_configs:
          - source_labels: [__address__]
            regex: '(.*):10250'
            replacement: '${1}:9100'
            target_label: __address__
```

#### 告警规则配置

**创建**: `k8s/monitoring/alert-rules.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-alert-rules
  namespace: monitoring
data:
  alerts.yml: |
    groups:
      # 服务可用性告警
      - name: service_availability
        interval: 30s
        rules:
          # 服务宕机
          - alert: ServiceDown
            expr: up{job="kcp-services"} == 0
            for: 1m
            labels:
              severity: critical
              team: backend
            annotations:
              summary: "Service {{ $labels.service }} is down"
              description: "{{ $labels.service }} has been down for more than 1 minute."

          # 健康检查失败
          - alert: HealthCheckFailing
            expr: probe_success{job="blackbox"} == 0
            for: 2m
            labels:
              severity: critical
            annotations:
              summary: "Health check failing for {{ $labels.instance }}"
              description: "Health check has been failing for 2 minutes."

      # 性能告警
      - name: performance
        interval: 30s
        rules:
          # 高响应时间
          - alert: HighResponseTime
            expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "High response time on {{ $labels.service }}"
              description: "P95 response time is {{ $value }}s (threshold: 1s)"

          # 高错误率
          - alert: HighErrorRate
            expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "High error rate on {{ $labels.service }}"
              description: "Error rate is {{ $value | humanizePercentage }} (threshold: 1%)"

          # QPS 异常
          - alert: AbnormalQPS
            expr: rate(http_requests_total[5m]) > 15000 or rate(http_requests_total[5m]) < 100
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Abnormal QPS detected"
              description: "QPS is {{ $value }} (expected: 1000-10000)"

      # 资源使用告警
      - name: resource_usage
        interval: 30s
        rules:
          # 高 CPU 使用率
          - alert: HighCPUUsage
            expr: rate(container_cpu_usage_seconds_total{namespace="soundcore-kcp-prod"}[5m]) * 100 > 85
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "High CPU usage in {{ $labels.pod }}"
              description: "CPU usage is {{ $value }}% (threshold: 85%)"

          # 高内存使用率
          - alert: HighMemoryUsage
            expr: container_memory_usage_bytes{namespace="soundcore-kcp-prod"} / container_spec_memory_limit_bytes * 100 > 90
            for: 5m
            labels:
              severity: critical
            annotations:
              summary: "High memory usage in {{ $labels.pod }}"
              description: "Memory usage is {{ $value }}% (threshold: 90%)"

          # 磁盘空间不足
          - alert: DiskSpaceLow
            expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 15
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Low disk space on {{ $labels.instance }}"
              description: "Available disk space is {{ $value }}% (threshold: 15%)"

      # 数据库告警
      - name: database
        interval: 30s
        rules:
          # PostgreSQL 连接数过高
          - alert: PostgreSQLHighConnections
            expr: pg_stat_database_numbackends{datname="soundcore_kcp"} > 80
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "PostgreSQL high connection count"
              description: "Connection count is {{ $value }} (threshold: 80)"

          # MongoDB 慢查询
          - alert: MongoDBSlowQueries
            expr: rate(mongodb_ss_opcounters_query[5m]) > 1000
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "MongoDB slow queries detected"
              description: "Slow query rate is {{ $value }} ops/s"

          # Redis 内存使用过高
          - alert: RedisHighMemoryUsage
            expr: redis_memory_used_bytes / redis_memory_max_bytes * 100 > 85
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Redis high memory usage"
              description: "Memory usage is {{ $value }}%"

      # Kubernetes 告警
      - name: kubernetes
        interval: 30s
        rules:
          # Pod 重启过多
          - alert: PodRestarting
            expr: rate(kube_pod_container_status_restarts_total{namespace="soundcore-kcp-prod"}[15m]) > 0
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Pod {{ $labels.pod }} is restarting"
              description: "Pod has restarted {{ $value }} times in last 15 minutes"

          # Pod 处于 Pending 状态
          - alert: PodPending
            expr: kube_pod_status_phase{phase="Pending", namespace="soundcore-kcp-prod"} == 1
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Pod {{ $labels.pod }} is pending"
              description: "Pod has been in Pending state for more than 5 minutes"

          # Deployment 副本数不足
          - alert: DeploymentReplicasMismatch
            expr: kube_deployment_spec_replicas{namespace="soundcore-kcp-prod"} != kube_deployment_status_replicas_available{namespace="soundcore-kcp-prod"}
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Deployment {{ $labels.deployment }} replicas mismatch"
              description: "Expected {{ $value }} replicas, but only some are available"
```

---

### 2.2 Grafana 仪表板

#### 创建自定义仪表板

**导出的仪表板 JSON**: `k8s/monitoring/grafana-dashboard-kcp.json`

**关键指标面板**:

1. **系统概览**
   - 总 QPS
   - 平均响应时间
   - 错误率
   - 服务可用性

2. **服务性能**
   - 各服务 QPS
   - P50/P95/P99 响应时间
   - 请求成功率
   - 慢请求数量

3. **资源使用**
   - CPU 使用率（按服务）
   - 内存使用率（按服务）
   - 网络流量
   - 磁盘 I/O

4. **数据库监控**
   - PostgreSQL 连接数
   - MongoDB 操作数
   - Redis 命中率
   - 慢查询数量

5. **业务指标**
   - 知识库查询次数
   - 内容生成请求
   - 客服对话数
   - 用户活跃度

#### Grafana 告警通道配置

```yaml
# grafana-alerting.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-alerting
  namespace: monitoring
data:
  alerting.yaml: |
    notifiers:
      - name: Slack
        type: slack
        uid: slack-kcp
        org_id: 1
        is_default: true
        send_reminder: true
        frequency: 5m
        settings:
          url: ${SLACK_WEBHOOK_URL}
          recipient: '#kcp-alerts'

      - name: Email
        type: email
        uid: email-kcp
        org_id: 1
        settings:
          addresses: 'ops-team@soundcore.com;dev-team@soundcore.com'

      - name: PagerDuty
        type: pagerduty
        uid: pagerduty-kcp
        org_id: 1
        settings:
          integrationKey: ${PAGERDUTY_INTEGRATION_KEY}
          severity: critical
```

---

### 2.3 告警通知配置

#### Alertmanager 配置

**创建**: `k8s/monitoring/alertmanager-config.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: alertmanager-config
  namespace: monitoring
data:
  alertmanager.yml: |
    global:
      resolve_timeout: 5m
      slack_api_url: ${SLACK_WEBHOOK_URL}

    # 路由规则
    route:
      group_by: ['alertname', 'cluster', 'service']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 12h
      receiver: 'default'

      routes:
        # Critical 告警立即发送
        - match:
            severity: critical
          receiver: 'critical-alerts'
          continue: true

        # Warning 告警延迟发送
        - match:
            severity: warning
          receiver: 'warning-alerts'
          group_wait: 30s

        # 数据库告警
        - match_re:
            alertname: '.*Database.*|.*PostgreSQL.*|.*MongoDB.*|.*Redis.*'
          receiver: 'database-team'

        # 前端告警
        - match:
            team: frontend
          receiver: 'frontend-team'

        # 后端告警
        - match:
            team: backend
          receiver: 'backend-team'

    # 抑制规则（避免重复告警）
    inhibit_rules:
      # 如果服务宕机，抑制该服务的其他告警
      - source_match:
          alertname: 'ServiceDown'
        target_match:
          alertname: 'HighResponseTime|HighErrorRate'
        equal: ['service']

      # 如果 Pod 重启，抑制性能告警
      - source_match:
          alertname: 'PodRestarting'
        target_match:
          severity: 'warning'
        equal: ['pod']

    # 接收者配置
    receivers:
      # 默认接收者
      - name: 'default'
        slack_configs:
          - channel: '#kcp-alerts'
            title: '🔔 {{ .GroupLabels.alertname }}'
            text: >-
              {{ range .Alerts }}
                *Alert:* {{ .Labels.alertname }}
                *Severity:* {{ .Labels.severity }}
                *Summary:* {{ .Annotations.summary }}
                *Description:* {{ .Annotations.description }}
              {{ end }}

      # Critical 告警（多渠道通知）
      - name: 'critical-alerts'
        slack_configs:
          - channel: '#kcp-critical'
            title: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
            text: >-
              {{ range .Alerts }}
                *Alert:* {{ .Labels.alertname }}
                *Service:* {{ .Labels.service }}
                *Summary:* {{ .Annotations.summary }}
                *Description:* {{ .Annotations.description }}
              {{ end }}
        email_configs:
          - to: 'ops-team@soundcore.com,cto@soundcore.com'
            from: 'alerts@soundcore.com'
            smarthost: 'smtp.gmail.com:587'
            auth_username: 'alerts@soundcore.com'
            auth_password: ${EMAIL_PASSWORD}
            headers:
              Subject: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
        pagerduty_configs:
          - service_key: ${PAGERDUTY_SERVICE_KEY}
            severity: 'critical'

      # Warning 告警
      - name: 'warning-alerts'
        slack_configs:
          - channel: '#kcp-warnings'
            title: '⚠️ Warning: {{ .GroupLabels.alertname }}'

      # 数据库团队
      - name: 'database-team'
        slack_configs:
          - channel: '#kcp-database'
        email_configs:
          - to: 'database-team@soundcore.com'

      # 前端团队
      - name: 'frontend-team'
        slack_configs:
          - channel: '#kcp-frontend'
        email_configs:
          - to: 'frontend-team@soundcore.com'

      # 后端团队
      - name: 'backend-team'
        slack_configs:
          - channel: '#kcp-backend'
        email_configs:
          - to: 'backend-team@soundcore.com'
```

---

## 3. 故障恢复流程

### 3.1 故障分级

| 级别 | 影响范围 | 响应时间 | 处理团队 |
|------|---------|---------|---------|
| **P0 - 严重** | 服务完全不可用 | 5 分钟内 | 全体 On-call |
| **P1 - 紧急** | 核心功能受影响 | 15 分钟内 | 相关团队 |
| **P2 - 重要** | 部分功能降级 | 1 小时内 | 相关团队 |
| **P3 - 一般** | 非核心功能问题 | 24 小时内 | 排期处理 |

---

### 3.2 P0/P1 故障应急流程

#### 步骤 1: 故障确认（5 分钟内）

```bash
# 1. 检查服务状态
kubectl get pods -n soundcore-kcp-prod
kubectl get svc -n soundcore-kcp-prod

# 2. 检查最近的变更
kubectl rollout history deployment/knowledge-service -n soundcore-kcp-prod

# 3. 查看错误日志
kubectl logs --tail=100 -l app=knowledge-service -n soundcore-kcp-prod | grep ERROR

# 4. 检查监控面板
# 访问 Grafana 查看关键指标异常
```

#### 步骤 2: 紧急止损（10 分钟内）

**选项 A: 回滚到上一个稳定版本**
```bash
# 查看部署历史
kubectl rollout history deployment/knowledge-service -n soundcore-kcp-prod

# 回滚到上一个版本
kubectl rollout undo deployment/knowledge-service -n soundcore-kcp-prod

# 回滚到指定版本
kubectl rollout undo deployment/knowledge-service --to-revision=5 -n soundcore-kcp-prod

# 验证回滚状态
kubectl rollout status deployment/knowledge-service -n soundcore-kcp-prod
```

**选项 B: 扩容以应对流量**
```bash
# 临时扩容
kubectl scale deployment/knowledge-service --replicas=10 -n soundcore-kcp-prod
```

**选项 C: 启用降级模式**
```bash
# 开启缓存降级
kubectl set env deployment/knowledge-service ENABLE_CACHE_FALLBACK=true -n soundcore-kcp-prod

# 关闭非核心功能
kubectl set env deployment/analytics-service DISABLE_REALTIME_STATS=true -n soundcore-kcp-prod
```

#### 步骤 3: 根因分析（30 分钟内）

```bash
# 1. 收集日志
kubectl logs --since=1h -l app=knowledge-service -n soundcore-kcp-prod > /tmp/knowledge-service-logs.txt

# 2. 检查数据库
psql -h db-host -U user -d soundcore_kcp -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# 3. 检查外部依赖
curl -I https://api.openai.com/v1/engines
curl -I https://api.pinecone.io/health

# 4. 检查网络
kubectl exec -it knowledge-service-xxx -n soundcore-kcp-prod -- traceroute mongodb-host
```

#### 步骤 4: 恢复与验证（15 分钟内）

```bash
# 1. 部署修复版本
kubectl set image deployment/knowledge-service knowledge-service=registry.com/knowledge-service:fixed -n soundcore-kcp-prod

# 2. 监控部署进度
kubectl rollout status deployment/knowledge-service -n soundcore-kcp-prod

# 3. 健康检查
for i in {1..10}; do
    curl -s https://api.soundcore.com:8001/health | jq .status
    sleep 2
done

# 4. 烟雾测试
curl -X POST https://api.soundcore.com:8001/api/v1/knowledge/search \
    -H "Content-Type: application/json" \
    -d '{"q": "test query", "limit": 5}'
```

#### 步骤 5: 事后总结

**创建故障报告**: `docs/incidents/YYYY-MM-DD-incident-report.md`

```markdown
# 故障报告 - [故障简述]

## 基本信息
- **故障级别**: P0 / P1 / P2
- **发生时间**: YYYY-MM-DD HH:MM
- **恢复时间**: YYYY-MM-DD HH:MM
- **影响时长**: XX 分钟
- **影响范围**: [具体描述]

## 故障时间线
- **HH:MM** - 告警触发
- **HH:MM** - 开始调查
- **HH:MM** - 确认根因
- **HH:MM** - 执行修复
- **HH:MM** - 服务恢复
- **HH:MM** - 验证完成

## 根因分析
[详细描述故障原因]

## 影响评估
- **用户影响**: XX 个用户
- **请求失败**: XX 次
- **业务损失**: $XXX

## 修复措施
[描述采取的修复措施]

## 预防措施
[未来如何避免类似问题]

## Action Items
- [ ] 完善监控告警
- [ ] 增加自动化测试
- [ ] 更新运维文档
- [ ] 团队培训

## 经验教训
[团队总结]
```

---

### 3.3 常见故障及处理

#### 故障 1: 服务 OOM (Out of Memory)

**症状**:
- Pod 频繁重启
- 日志显示 `OutOfMemory` 错误

**处理**:
```bash
# 1. 临时扩容内存
kubectl set resources deployment/knowledge-service \
    --limits=memory=4Gi \
    --requests=memory=2Gi \
    -n soundcore-kcp-prod

# 2. 检查内存泄漏
kubectl exec -it knowledge-service-xxx -n soundcore-kcp-prod -- \
    python -m memory_profiler app/main.py

# 3. 分析堆内存
kubectl exec -it knowledge-service-xxx -n soundcore-kcp-prod -- \
    python -c "import objgraph; objgraph.show_most_common_types(limit=20)"
```

**根因排查**:
- 检查是否有大量对象未释放
- 查看是否有缓存无限增长
- 分析是否有慢请求占用大量内存

---

#### 故障 2: 数据库连接池耗尽

**症状**:
- 日志显示 `Too many connections`
- 请求响应时间急剧上升

**处理**:
```bash
# 1. 立即释放空闲连接
psql -h db-host -U user -d soundcore_kcp -c "
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = 'soundcore_kcp'
    AND state = 'idle'
    AND state_change < NOW() - INTERVAL '5 minutes';
"

# 2. 增加连接池大小（临时）
kubectl set env deployment/knowledge-service \
    DB_POOL_SIZE=50 \
    -n soundcore-kcp-prod

# 3. 检查慢查询
psql -h db-host -U user -d soundcore_kcp -c "
    SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
    FROM pg_stat_activity
    WHERE state != 'idle'
    ORDER BY duration DESC
    LIMIT 10;
"
```

---

#### 故障 3: Redis 缓存雪崩

**症状**:
- Redis 响应变慢或不可用
- 大量请求直接打到数据库

**处理**:
```bash
# 1. 重启 Redis（慎用，仅在必要时）
kubectl rollout restart statefulset/redis -n soundcore-kcp-prod

# 2. 启用降级模式
kubectl set env deployment/knowledge-service \
    ENABLE_DB_FALLBACK=true \
    DISABLE_CACHE=true \
    -n soundcore-kcp-prod

# 3. 清理 Redis 内存
kubectl exec -it redis-0 -n soundcore-kcp-prod -- \
    redis-cli MEMORY PURGE

# 4. 分析 Redis 慢查询
kubectl exec -it redis-0 -n soundcore-kcp-prod -- \
    redis-cli SLOWLOG GET 20
```

---

#### 故障 4: 外部 API 限流

**症状**:
- OpenAI/Claude API 返回 429 错误
- 内容生成功能不可用

**处理**:
```bash
# 1. 启用请求队列
kubectl set env deployment/content-service \
    ENABLE_REQUEST_QUEUE=true \
    MAX_CONCURRENT_REQUESTS=10 \
    -n soundcore-kcp-prod

# 2. 使用备用 API Key
kubectl set env deployment/content-service \
    OPENAI_API_KEY=${BACKUP_OPENAI_KEY} \
    -n soundcore-kcp-prod

# 3. 启用响应缓存
kubectl set env deployment/content-service \
    ENABLE_RESPONSE_CACHE=true \
    CACHE_TTL=3600 \
    -n soundcore-kcp-prod
```

---

## 4. 扩容与缩容

### 4.1 手动扩缩容

#### 扩容服务

```bash
# 扩容到 10 个副本
kubectl scale deployment/knowledge-service --replicas=10 -n soundcore-kcp-prod

# 验证扩容状态
kubectl get pods -l app=knowledge-service -n soundcore-kcp-prod -w
```

#### 缩容服务

```bash
# 缩容到 3 个副本
kubectl scale deployment/knowledge-service --replicas=3 -n soundcore-kcp-prod

# 优雅缩容（等待请求完成）
kubectl scale deployment/knowledge-service --replicas=3 --timeout=5m -n soundcore-kcp-prod
```

---

### 4.2 水平自动扩缩容 (HPA)

#### HPA 配置

**创建**: `k8s/hpa/knowledge-service-hpa.yaml`

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: knowledge-service-hpa
  namespace: soundcore-kcp-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: knowledge-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
    # CPU 指标
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70

    # 内存指标
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80

    # 自定义指标 - QPS
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"

  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 50
          periodSeconds: 60
        - type: Pods
          value: 2
          periodSeconds: 60
      selectPolicy: Min
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 100
          periodSeconds: 30
        - type: Pods
          value: 4
          periodSeconds: 30
      selectPolicy: Max
```

#### 应用 HPA

```bash
# 应用 HPA 配置
kubectl apply -f k8s/hpa/knowledge-service-hpa.yaml

# 查看 HPA 状态
kubectl get hpa -n soundcore-kcp-prod

# 详细信息
kubectl describe hpa knowledge-service-hpa -n soundcore-kcp-prod

# 查看扩缩容事件
kubectl get events -n soundcore-kcp-prod --field-selector involvedObject.name=knowledge-service-hpa
```

---

### 4.3 垂直自动扩缩容 (VPA)

#### VPA 配置

**创建**: `k8s/vpa/knowledge-service-vpa.yaml`

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: knowledge-service-vpa
  namespace: soundcore-kcp-prod
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: knowledge-service
  updatePolicy:
    updateMode: "Auto"  # Auto / Recreate / Initial / Off
  resourcePolicy:
    containerPolicies:
      - containerName: knowledge-service
        minAllowed:
          cpu: 500m
          memory: 512Mi
        maxAllowed:
          cpu: 4000m
          memory: 8Gi
        controlledResources: ["cpu", "memory"]
```

---

### 4.4 集群节点扩缩容

#### AWS EKS 节点扩容

```bash
# 查看节点组
aws eks list-nodegroups --cluster-name soundcore-kcp-prod

# 更新节点组大小
aws eks update-nodegroup-config \
    --cluster-name soundcore-kcp-prod \
    --nodegroup-name kcp-nodes \
    --scaling-config minSize=3,maxSize=20,desiredSize=10
```

#### GCP GKE 节点扩容

```bash
# 查看节点池
gcloud container node-pools list --cluster=soundcore-kcp-prod

# 调整节点池大小
gcloud container clusters resize soundcore-kcp-prod \
    --node-pool=default-pool \
    --num-nodes=10
```

---

### 4.5 扩容决策矩阵

| 场景 | 扩容类型 | 触发条件 | 目标规模 |
|------|---------|---------|---------|
| 日常流量增长 | HPA | CPU > 70% | 3 → 10 副本 |
| 营销活动 | 手动扩容 | 预期流量 5x | 3 → 15 副本 |
| 突发流量 | HPA + 节点 | QPS > 8000 | 按需扩容 |
| 内存不足 | VPA | Memory > 80% | 调整资源限制 |
| 长期增长 | 集群扩容 | 节点负载高 | 增加节点 |

---

## 5. 数据备份与恢复

### 5.1 PostgreSQL 备份

#### 自动备份脚本

**创建**: `/scripts/backup-postgres.sh`

```bash
#!/bin/bash
# PostgreSQL 自动备份脚本

set -e

# 配置
BACKUP_DIR="/backups/postgres"
RETENTION_DAYS=30
DB_HOST="postgres-host"
DB_USER="backup_user"
DB_NAME="soundcore_kcp"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/soundcore_kcp_$TIMESTAMP.sql.gz"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "[$(date)] Starting PostgreSQL backup..."
PGPASSWORD=$DB_PASSWORD pg_dump \
    -h $DB_HOST \
    -U $DB_USER \
    -d $DB_NAME \
    --format=plain \
    --no-owner \
    --no-acl \
    | gzip > $BACKUP_FILE

# 验证备份文件
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "[$(date)] Backup completed: $BACKUP_FILE"

    # 上传到 S3
    aws s3 cp $BACKUP_FILE s3://soundcore-backups/postgres/ \
        --storage-class STANDARD_IA

    # 清理本地旧备份
    find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

    echo "[$(date)] Backup uploaded to S3 and old files cleaned"
else
    echo "[$(date)] ERROR: Backup failed!"
    # 发送告警
    curl -X POST $SLACK_WEBHOOK_URL \
        -H 'Content-Type: application/json' \
        -d "{\"text\":\"🚨 PostgreSQL backup failed at $(date)\"}"
    exit 1
fi
```

#### 定时备份

```bash
# 添加到 crontab
crontab -e

# 每天凌晨 2 点执行完整备份
0 2 * * * /scripts/backup-postgres.sh >> /var/log/postgres-backup.log 2>&1

# 每 4 小时执行增量备份
0 */4 * * * /scripts/backup-postgres-incremental.sh >> /var/log/postgres-backup-incremental.log 2>&1
```

#### PostgreSQL 恢复

```bash
# 恢复到新数据库
gunzip < soundcore_kcp_20251022_020000.sql.gz | psql -h db-host -U user -d soundcore_kcp_restore

# 点对点恢复 (PITR)
# 1. 恢复基础备份
pg_restore -h db-host -U user -d soundcore_kcp backup.dump

# 2. 恢复到特定时间点
# 编辑 recovery.conf
restore_command = 'cp /archive/%f %p'
recovery_target_time = '2025-10-22 14:30:00'
recovery_target_action = 'promote'

# 3. 启动 PostgreSQL
pg_ctl start -D /var/lib/postgresql/data
```

---

### 5.2 MongoDB 备份

#### 自动备份脚本

**创建**: `/scripts/backup-mongodb.sh`

```bash
#!/bin/bash
# MongoDB 自动备份脚本

set -e

BACKUP_DIR="/backups/mongodb"
RETENTION_DAYS=30
MONGO_HOST="mongodb-host"
MONGO_PORT=27017
MONGO_USER="backup_user"
MONGO_DB="soundcore_kcp"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/soundcore_kcp_$TIMESTAMP"

mkdir -p $BACKUP_DIR

echo "[$(date)] Starting MongoDB backup..."

# 执行备份
mongodump \
    --host=$MONGO_HOST \
    --port=$MONGO_PORT \
    --username=$MONGO_USER \
    --password=$MONGO_PASSWORD \
    --db=$MONGO_DB \
    --out=$BACKUP_PATH \
    --gzip

# 打包备份
tar -czf "$BACKUP_PATH.tar.gz" -C $BACKUP_DIR "soundcore_kcp_$TIMESTAMP"
rm -rf $BACKUP_PATH

# 上传到 S3
aws s3 cp "$BACKUP_PATH.tar.gz" s3://soundcore-backups/mongodb/ \
    --storage-class GLACIER

# 清理旧备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] MongoDB backup completed and uploaded"
```

#### MongoDB 恢复

```bash
# 恢复整个数据库
mongorestore \
    --host=mongodb-host \
    --port=27017 \
    --username=restore_user \
    --password=password \
    --db=soundcore_kcp \
    --gzip \
    --archive=/backups/mongodb/soundcore_kcp_20251022_020000.tar.gz

# 恢复特定集合
mongorestore \
    --host=mongodb-host \
    --db=soundcore_kcp \
    --collection=knowledge_items \
    --gzip \
    /backups/mongodb/soundcore_kcp/knowledge_items.bson.gz
```

---

### 5.3 Redis 持久化

#### RDB 快照配置

```bash
# redis.conf
save 900 1      # 15分钟内至少1个键改变
save 300 10     # 5分钟内至少10个键改变
save 60 10000   # 1分钟内至少10000个键改变

# RDB 文件路径
dir /var/lib/redis
dbfilename dump.rdb

# 压缩
rdbcompression yes
rdbchecksum yes
```

#### AOF 持久化配置

```bash
# 启用 AOF
appendonly yes
appendfilename "appendonly.aof"

# 同步策略
appendfsync everysec  # 每秒同步（推荐）

# AOF 重写
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

#### Redis 备份

```bash
# 手动触发 RDB 快照
redis-cli BGSAVE

# 复制 RDB 文件
cp /var/lib/redis/dump.rdb /backups/redis/dump_$(date +%Y%m%d).rdb

# 上传到 S3
aws s3 cp /backups/redis/dump_$(date +%Y%m%d).rdb s3://soundcore-backups/redis/
```

---

### 5.4 Kubernetes 资源备份

#### Velero 备份配置

```bash
# 安装 Velero
velero install \
    --provider aws \
    --plugins velero/velero-plugin-for-aws:v1.7.0 \
    --bucket soundcore-velero-backups \
    --backup-location-config region=us-west-2 \
    --snapshot-location-config region=us-west-2 \
    --secret-file ./credentials-velero

# 创建定时备份
velero schedule create kcp-daily \
    --schedule="0 2 * * *" \
    --include-namespaces soundcore-kcp-prod \
    --ttl 720h0m0s

# 手动备份
velero backup create kcp-backup-$(date +%Y%m%d) \
    --include-namespaces soundcore-kcp-prod \
    --wait
```

#### Kubernetes 资源恢复

```bash
# 查看可用备份
velero backup get

# 恢复整个命名空间
velero restore create --from-backup kcp-backup-20251022

# 恢复特定资源
velero restore create --from-backup kcp-backup-20251022 \
    --include-resources deployments,services \
    --selector app=knowledge-service
```

---

## 6. 性能优化

### 6.1 数据库性能优化

#### PostgreSQL 优化

```sql
-- 1. 分析慢查询
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT
    query,
    calls,
    total_time,
    mean_time,
    stddev_time,
    rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

-- 2. 创建缺失索引
CREATE INDEX CONCURRENTLY idx_knowledge_product_type
ON knowledge_items(product_id, type)
WHERE status = 'ACTIVE';

-- 3. 优化表结构
ALTER TABLE knowledge_items
SET (autovacuum_vacuum_scale_factor = 0.01,
     autovacuum_analyze_scale_factor = 0.005);

-- 4. 分区表（大表优化）
CREATE TABLE knowledge_items_partitioned (
    id UUID,
    created_at TIMESTAMP,
    ...
) PARTITION BY RANGE (created_at);

CREATE TABLE knowledge_items_2025_10
PARTITION OF knowledge_items_partitioned
FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- 5. 物化视图（复杂查询优化）
CREATE MATERIALIZED VIEW mv_knowledge_stats AS
SELECT
    product_id,
    type,
    COUNT(*) as count,
    AVG(quality_score) as avg_quality
FROM knowledge_items
WHERE status = 'ACTIVE'
GROUP BY product_id, type;

-- 定时刷新
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_knowledge_stats;
```

#### MongoDB 优化

```javascript
// 1. 创建复合索引
db.knowledge_items.createIndex(
    { product_id: 1, type: 1, language: 1 },
    { background: true }
)

// 2. 文本索引（搜索优化）
db.knowledge_items.createIndex(
    { title: "text", content: "text" },
    {
        weights: { title: 10, content: 5 },
        name: "knowledge_text_index"
    }
)

// 3. 部分索引（减少索引大小）
db.knowledge_items.createIndex(
    { created_at: 1 },
    {
        partialFilterExpression: { status: "ACTIVE" },
        background: true
    }
)

// 4. 聚合管道优化
db.knowledge_items.aggregate([
    { $match: { type: "FAQ" } },           // 先过滤
    { $project: { _id: 1, title: 1 } },   // 投影必要字段
    { $limit: 100 },                       // 限制结果集
    { $group: { _id: "$product_id", count: { $sum: 1 } } }
])

// 5. 查看慢查询
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(10)
```

---

### 6.2 应用性能优化

#### FastAPI 性能优化

```python
# 1. 使用异步数据库驱动
from databases import Database

database = Database("postgresql://...")

@app.get("/api/v1/knowledge/items")
async def list_items():
    query = "SELECT * FROM knowledge_items LIMIT 10"
    results = await database.fetch_all(query)
    return results

# 2. 启用响应缓存
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")

@app.get("/api/v1/knowledge/items/{item_id}")
@cache(expire=300)  # 缓存 5 分钟
async def get_item(item_id: str):
    return await get_knowledge_item(item_id)

# 3. 数据库连接池
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    "postgresql://...",
    poolclass=QueuePool,
    pool_size=20,          # 连接池大小
    max_overflow=10,       # 最大溢出连接
    pool_timeout=30,       # 连接超时
    pool_recycle=3600,     # 连接回收时间
)

# 4. 后台任务
from fastapi import BackgroundTasks

@app.post("/api/v1/content/generate")
async def generate_content(request: ContentRequest, background_tasks: BackgroundTasks):
    # 立即返回任务 ID
    task_id = str(uuid.uuid4())

    # 后台执行耗时任务
    background_tasks.add_task(generate_content_task, task_id, request)

    return {"task_id": task_id, "status": "processing"}

# 5. 请求批量处理
from fastapi import Request

@app.middleware("http")
async def batch_requests(request: Request, call_next):
    # 批量处理相似请求
    response = await call_next(request)
    return response
```

#### Next.js 性能优化

```typescript
// 1. 使用 SWR 缓存
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function KnowledgeList() {
  const { data, error } = useSWR('/api/knowledge/items', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,  // 60秒内不重复请求
  })

  if (error) return <div>加载失败</div>
  if (!data) return <div>加载中...</div>

  return <div>{/* 渲染数据 */}</div>
}

// 2. 图片优化
import Image from 'next/image'

export function ProductImage({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      quality={85}
      placeholder="blur"
    />
  )
}

// 3. 动态导入
import dynamic from 'next/dynamic'

const AnalyticsChart = dynamic(() => import('@/components/AnalyticsChart'), {
  loading: () => <p>加载中...</p>,
  ssr: false,  // 仅在客户端加载
})

// 4. API 路由缓存
export async function GET(request: Request) {
  const data = await fetchKnowledgeItems()

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

// 5. 服务端渲染优化
export async function generateStaticParams() {
  const items = await getKnowledgeItems()
  return items.map((item) => ({ id: item.id }))
}

export default async function Page({ params }: { params: { id: string } }) {
  const item = await getKnowledgeItem(params.id)
  return <KnowledgeDetail item={item} />
}
```

---

### 6.3 缓存策略优化

#### 多级缓存架构

```
用户请求
    ↓
CDN 缓存（静态资源）
    ↓
Nginx 缓存（反向代理）
    ↓
应用层缓存（Redis）
    ↓
数据库查询缓存
    ↓
数据库
```

#### Redis 缓存实践

```python
# 缓存配置
CACHE_CONFIG = {
    # 热点数据（1小时）
    "hot_data": 3600,

    # 常规数据（15分钟）
    "normal_data": 900,

    # 实时数据（30秒）
    "realtime_data": 30,
}

# 缓存装饰器
def cache_with_fallback(expire: int = 300):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # 生成缓存键
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"

            # 尝试从缓存获取
            cached = await redis.get(cache_key)
            if cached:
                return json.loads(cached)

            # 执行函数
            result = await func(*args, **kwargs)

            # 写入缓存
            await redis.setex(cache_key, expire, json.dumps(result))

            return result
        return wrapper
    return decorator

# 使用示例
@cache_with_fallback(expire=3600)
async def get_knowledge_item(item_id: str):
    return await database.fetch_one(
        "SELECT * FROM knowledge_items WHERE id = $1",
        item_id
    )

# 缓存预热
async def warmup_cache():
    popular_items = await get_popular_knowledge_items(limit=100)
    for item in popular_items:
        await redis.setex(
            f"knowledge:item:{item.id}",
            3600,
            json.dumps(item.dict())
        )
```

---

## 7. 安全运维

### 7.1 访问控制

#### RBAC 配置

**创建**: `k8s/rbac/kcp-rbac.yaml`

```yaml
# 创建只读用户角色
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kcp-viewer
  namespace: soundcore-kcp-prod
rules:
  - apiGroups: ["", "apps", "batch"]
    resources: ["pods", "deployments", "services", "jobs"]
    verbs: ["get", "list", "watch"]

---
# 创建运维角色
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kcp-operator
  namespace: soundcore-kcp-prod
rules:
  - apiGroups: ["", "apps"]
    resources: ["pods", "deployments", "services"]
    verbs: ["get", "list", "watch", "update", "patch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get", "list"]

---
# 绑定角色到用户
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kcp-operator-binding
  namespace: soundcore-kcp-prod
subjects:
  - kind: User
    name: ops-team@soundcore.com
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: kcp-operator
  apiGroup: rbac.authorization.k8s.io
```

---

### 7.2 Secret 管理

#### 使用 Sealed Secrets

```bash
# 安装 Sealed Secrets Controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# 创建密钥
kubectl create secret generic kcp-db-credentials \
    --from-literal=username=dbuser \
    --from-literal=password='SecurePassword123!' \
    --dry-run=client \
    -o yaml | \
kubeseal -o yaml > sealed-secret.yaml

# 应用加密的密钥
kubectl apply -f sealed-secret.yaml
```

#### 使用 External Secrets Operator

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
  namespace: soundcore-kcp-prod
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-west-2
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa

---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: kcp-database-credentials
  namespace: soundcore-kcp-prod
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: kcp-db-secret
  data:
    - secretKey: username
      remoteRef:
        key: kcp/database
        property: username
    - secretKey: password
      remoteRef:
        key: kcp/database
        property: password
```

---

### 7.3 安全审计

#### 启用 Kubernetes 审计日志

```yaml
# audit-policy.yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # 记录所有密钥访问
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["secrets"]

  # 记录所有删除操作
  - level: Request
    verbs: ["delete"]

  # 记录所有修改操作
  - level: Request
    verbs: ["create", "update", "patch"]
    namespaces: ["soundcore-kcp-prod"]
```

#### 定期安全扫描

```bash
# 使用 Trivy 扫描镜像漏洞
trivy image registry.com/soundcore/knowledge-service:latest

# 扫描 Kubernetes 配置
trivy config k8s/

# 扫描文件系统
trivy fs /path/to/project
```

---

## 8. 应急响应

### 8.1 应急联系人

| 角色 | 姓名 | 手机 | 邮箱 | 备注 |
|------|------|------|------|------|
| **技术负责人** | - | - | - | 最终决策人 |
| **运维主管** | - | - | - | 协调应急响应 |
| **后端负责人** | - | - | - | 后端服务故障 |
| **前端负责人** | - | - | - | 前端应用故障 |
| **DBA** | - | - | - | 数据库问题 |
| **安全负责人** | - | - | - | 安全事件 |

---

### 8.2 应急预案模板

**创建**: `docs/runbooks/emergency-template.md`

```markdown
# 应急预案 - [场景名称]

## 触发条件
[描述什么情况下触发此预案]

## 影响评估
- **用户影响**: [用户无法访问/功能受限/性能下降]
- **业务影响**: [收入损失/品牌影响]
- **持续时间**: [预计影响时长]

## 应急步骤

### 1. 立即响应（5分钟内）
```bash
# 执行命令
```

### 2. 问题诊断（10分钟内）
[诊断步骤]

### 3. 临时措施（15分钟内）
[止损措施]

### 4. 根本修复（30分钟内）
[永久解决方案]

### 5. 验证恢复
[验证步骤]

## 回滚计划
[如果修复失败如何回滚]

## 后续跟进
- [ ] 更新监控告警
- [ ] 完善自动化
- [ ] 团队复盘
```

---

## 附录

### A. 常用命令速查

```bash
# Kubernetes
kubectl get pods -n soundcore-kcp-prod
kubectl logs -f <pod-name> -n soundcore-kcp-prod
kubectl describe pod <pod-name> -n soundcore-kcp-prod
kubectl exec -it <pod-name> -n soundcore-kcp-prod -- /bin/bash
kubectl rollout restart deployment/<name> -n soundcore-kcp-prod
kubectl scale deployment/<name> --replicas=10 -n soundcore-kcp-prod

# Docker
docker ps
docker logs -f <container-id>
docker exec -it <container-id> /bin/bash
docker stats

# Database
psql -h host -U user -d database
mongosh mongodb://host:27017/database
redis-cli -h host -p 6379

# Monitoring
curl http://localhost:9090/api/v1/query?query=up
curl http://localhost:3000/api/health
```

---

**文档版本**: 1.0.0
**最后更新**: 2025-10-22
**维护团队**: Soundcore KCP DevOps Team
**下次审查**: 2025-11-22
