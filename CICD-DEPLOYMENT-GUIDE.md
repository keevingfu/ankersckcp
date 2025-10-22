# 🚀 CI/CD & Deployment Guide
# Soundcore KCP - Complete Deployment Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [GitLab CI/CD Pipeline](#gitlab-cicd-pipeline)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Environment Configuration](#environment-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

---

## Overview

### Architecture Components
- **Frontend**: Next.js 14 (SSR + Static Generation)
- **Backend**: 5 Microservices (FastAPI Python)
  - Knowledge Service (port 8001)
  - Content Service (port 8002)
  - Support Service (port 8003)
  - Analytics Service (port 8004)
  - Auth Service (port 8005)

### Deployment Strategy
- **Blue-Green Deployment** for zero-downtime
- **Canary Releases** for gradual rollout
- **Automatic Rollback** on failure detection

---

## GitLab CI/CD Pipeline

### Pipeline Stages

```yaml
stages:
  1. lint          # Code quality checks
  2. test          # Unit & integration tests
  3. build         # Docker image builds
  4. deploy-staging # Deploy to staging
  5. test-e2e      # End-to-end tests
  6. deploy-prod   # Production deployment
  7. monitor       # Post-deployment checks
```

### Configuration File
**Location**: `.gitlab-ci-complete.yml`

### Key Features
- ✅ Automated testing (frontend + backend)
- ✅ Docker multi-stage builds
- ✅ Environment-specific deployments
- ✅ Blue-green production deployments
- ✅ Automatic health checks
- ✅ Rollback on failure
- ✅ Slack notifications

### Required GitLab CI/CD Variables

```bash
# Docker Registry
CI_REGISTRY_USER=gitlab-ci-token
CI_REGISTRY_PASSWORD=<your-gitlab-token>

# Kubernetes
KUBE_CONFIG_STAGING=<base64-encoded-kubeconfig>
KUBE_CONFIG_PRODUCTION=<base64-encoded-kubeconfig>

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
MONGODB_URI=mongodb://user:pass@host:27017/db

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PINECONE_API_KEY=...

# Monitoring
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SENTRY_DSN=https://...
```

---

## Kubernetes Deployment

### Cluster Requirements
- **Kubernetes Version**: 1.28+
- **Ingress Controller**: Nginx or Traefik
- **Storage Class**: Dynamic provisioning (AWS EBS / GCP Persistent Disk)
- **Monitoring**: Prometheus + Grafana

### Namespace Structure

```
soundcore-kcp-staging   # Staging environment
soundcore-kcp-prod      # Production environment
```

### Resource Allocation

#### Frontend Deployment
```yaml
replicas: 3
resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 1000m
    memory: 1Gi
```

#### Backend Services (each)
```yaml
replicas: 2
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

### Databases (StatefulSets)

#### PostgreSQL
```yaml
replicas: 1 (with backup replica)
storage: 50Gi
persistence: true
```

#### MongoDB
```yaml
replicas: 3 (replica set)
storage: 100Gi
persistence: true
```

#### Redis
```yaml
replicas: 1 (with sentinel)
storage: 10Gi
persistence: true
```

#### Neo4j
```yaml
replicas: 1
storage: 50Gi
persistence: true
```

### Deployment Commands

```bash
# 1. Create namespace
kubectl apply -f k8s/base/namespace.yaml

# 2. Deploy databases
kubectl apply -f k8s/base/databases/

# 3. Create ConfigMaps and Secrets
kubectl create secret generic kcp-secrets \
  --from-literal=database-password=... \
  --from-literal=openai-api-key=... \
  -n soundcore-kcp

# 4. Deploy backend services
kubectl apply -f k8s/base/backend/

# 5. Deploy frontend
kubectl apply -f k8s/base/frontend/

# 6. Create Ingress
kubectl apply -f k8s/base/ingress.yaml

# 7. Verify deployment
kubectl get pods -n soundcore-kcp
kubectl get svc -n soundcore-kcp
kubectl get ingress -n soundcore-kcp
```

---

## Environment Configuration

### Staging Environment
- **URL**: https://staging-kcp.soundcore.com
- **Purpose**: Pre-production testing
- **Data**: Test data only
- **Monitoring**: Basic metrics

### Production Environment
- **URL**: https://kcp.soundcore.com
- **Purpose**: Live production
- **Data**: Real user data
- **Monitoring**: Full observability stack
- **Backup**: Daily automated backups

### ConfigMap Structure

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kcp-config
data:
  # API URLs
  KNOWLEDGE_SERVICE_URL: "http://knowledge-service:8001"
  ANALYTICS_SERVICE_URL: "http://analytics-service:8004"
  CONTENT_SERVICE_URL: "http://content-service:8002"

  # Feature Flags
  ENABLE_RAG_ENGINE: "true"
  ENABLE_CONTENT_GENERATION: "true"
  ENABLE_KNOWLEDGE_GRAPH: "true"

  # Performance
  RATE_LIMIT_PER_MINUTE: "1000"
  CACHE_TTL: "300"
```

---

## Monitoring & Logging

### Prometheus Metrics
- API request rate
- Response time (P50, P95, P99)
- Error rate
- Database connections
- Memory & CPU usage

### Grafana Dashboards
1. **System Overview**: Health, uptime, resource usage
2. **API Performance**: Request rate, latency, errors
3. **Database Metrics**: Queries, connections, cache hit rate
4. **Business Metrics**: User activity, knowledge searches, content generation

### Logging Stack
- **Collection**: Fluentd / Fluent Bit
- **Storage**: Elasticsearch
- **Visualization**: Kibana

### Log Levels
```
DEBUG   - Development debugging
INFO    - General information
WARNING - Potential issues
ERROR   - Application errors
CRITICAL - System failures
```

### Alerting Rules

```yaml
# High error rate
alert: HighErrorRate
expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
for: 5m
severity: critical

# High latency
alert: HighLatency
expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
for: 10m
severity: warning

# Pod crashes
alert: PodCrashing
expr: rate(kube_pod_container_status_restarts_total[15m]) > 0
severity: critical
```

---

## Deployment Workflows

### 1. Feature Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and test locally
npm run dev          # Frontend
docker-compose up    # Backend

# 3. Run tests
npm run test
pytest

# 4. Create merge request
git push origin feature/new-feature
# CI pipeline runs automatically

# 5. After approval, merge to main
# Triggers staging deployment
```

### 2. Staging Deployment

```bash
# Automatic on merge to main
# 1. Tests run
# 2. Docker images built
# 3. Deployed to staging
# 4. E2E tests run

# Manual verification
curl https://staging-kcp.soundcore.com/health
```

### 3. Production Deployment

```bash
# Create release tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Manual approval required in GitLab
# 1. Blue-green deployment starts
# 2. New (green) deployment created
# 3. Smoke tests run
# 4. Traffic switches to green
# 5. Old (blue) deployment removed
```

### 4. Rollback Procedure

```bash
# Automatic rollback on health check failure
# Manual rollback if needed:

kubectl rollout undo deployment/knowledge-service -n soundcore-kcp-prod
kubectl rollout undo deployment/frontend -n soundcore-kcp-prod

# Or rollback to specific revision
kubectl rollout undo deployment/knowledge-service --to-revision=2 -n soundcore-kcp-prod
```

---

## Troubleshooting

### Common Issues

#### 1. Pod CrashLoopBackOff

```bash
# Check pod logs
kubectl logs <pod-name> -n soundcore-kcp

# Check pod events
kubectl describe pod <pod-name> -n soundcore-kcp

# Common causes:
# - Database connection failure
# - Missing environment variables
# - Port conflicts
```

#### 2. Service Unavailable (503)

```bash
# Check service endpoints
kubectl get endpoints -n soundcore-kcp

# Check pod status
kubectl get pods -n soundcore-kcp -o wide

# Check ingress
kubectl describe ingress kcp-ingress -n soundcore-kcp
```

#### 3. Database Connection Errors

```bash
# Test database connectivity
kubectl run -it --rm debug --image=postgres:16 --restart=Never -- psql <connection-string>

# Check database service
kubectl get svc postgres -n soundcore-kcp

# Check database logs
kubectl logs statefulset/postgres -n soundcore-kcp
```

#### 4. High Memory Usage

```bash
# Check pod resource usage
kubectl top pods -n soundcore-kcp

# Increase resource limits
kubectl edit deployment/knowledge-service -n soundcore-kcp

# Check for memory leaks
kubectl logs <pod-name> -n soundcore-kcp | grep -i "memory"
```

### Health Check Endpoints

```bash
# Frontend
curl https://kcp.soundcore.com/health

# Knowledge Service
curl https://kcp.soundcore.com/api/v1/knowledge/health

# Analytics Service
curl https://kcp.soundcore.com/api/v1/analytics/health

# All services
kubectl get --raw /healthz
```

---

## Performance Optimization

### Caching Strategy
- **Redis**: Session data, API responses (TTL: 5 minutes)
- **CDN**: Static assets (TTL: 30 days)
- **Browser**: Frontend assets (Cache-Control headers)

### Database Optimization
- **Connection Pooling**: Max 20 connections per service
- **Query Optimization**: Index on frequently searched fields
- **Read Replicas**: For analytics queries

### Scaling Strategy

```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## Security Considerations

### Network Policies
- Restrict inter-service communication
- Database access only from backend services
- Ingress only through load balancer

### Secrets Management
- Use Kubernetes Secrets for sensitive data
- Rotate secrets regularly
- Never commit secrets to Git

### Image Security
- Scan images with Trivy before deployment
- Use minimal base images (Alpine)
- Run containers as non-root user

---

## Backup & Disaster Recovery

### Backup Strategy
- **Databases**: Daily automated backups to S3
- **Configuration**: Git repository (version controlled)
- **Secrets**: Encrypted backup in secure vault

### Recovery Procedure
1. Provision new cluster
2. Restore database from backup
3. Deploy applications from Git
4. Restore secrets
5. Update DNS to new cluster

### RPO & RTO
- **RPO (Recovery Point Objective)**: 1 hour
- **RTO (Recovery Time Objective)**: 4 hours

---

## Cost Optimization

### Resource Right-Sizing
- Monitor actual usage with Prometheus
- Adjust resource requests/limits quarterly
- Use node affinity for cost-effective instances

### Auto-Scaling
- Scale down non-production environments off-hours
- Use spot instances for non-critical workloads
- Implement pod disruption budgets

---

## Maintenance Windows

### Scheduled Maintenance
- **Time**: Saturday 02:00-04:00 UTC
- **Frequency**: Monthly
- **Activities**:
  - Kubernetes cluster upgrades
  - Database minor version updates
  - Security patches

### Emergency Maintenance
- Critical security patches: Immediate
- Production incidents: 24/7 response
- Rollback capability: Always available

---

## Contact & Support

### Team Contacts
- **DevOps Lead**: devops@soundcore.com
- **Backend Team**: backend-team@soundcore.com
- **Frontend Team**: frontend-team@soundcore.com
- **On-Call**: oncall@soundcore.com

### Documentation
- **Architecture**: `/docs/architecture.md`
- **API Docs**: `https://kcp.soundcore.com/api/docs`
- **Runbooks**: `/docs/runbooks/`

---

## Appendix

### Quick Reference Commands

```bash
# Check cluster health
kubectl cluster-info

# View all resources
kubectl get all -n soundcore-kcp

# Force restart deployment
kubectl rollout restart deployment/knowledge-service -n soundcore-kcp

# Port forward for debugging
kubectl port-forward svc/knowledge-service 8001:8001 -n soundcore-kcp

# Execute command in pod
kubectl exec -it <pod-name> -n soundcore-kcp -- /bin/sh

# Copy files from/to pod
kubectl cp <pod-name>:/path/to/file ./local-file -n soundcore-kcp

# View resource usage
kubectl top nodes
kubectl top pods -n soundcore-kcp

# Check logs across all pods
kubectl logs -l app=knowledge-service -n soundcore-kcp --tail=100 -f
```

### GitLab CI/CD Quick Reference

```bash
# Trigger pipeline manually
# Navigate to: CI/CD > Pipelines > Run Pipeline

# View pipeline status
# Navigate to: CI/CD > Pipelines

# Download artifacts
# Navigate to: CI/CD > Pipelines > [Pipeline] > Download artifacts

# Retry failed job
# Navigate to: CI/CD > Pipelines > [Pipeline] > [Job] > Retry
```

---

**Last Updated**: 2025-10-17
**Version**: 1.0.0
**Maintained By**: DevOps Team
