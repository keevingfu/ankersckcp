# Load Testing Guide for Soundcore KCP

## 📋 Overview

This guide explains how to perform load testing on the Soundcore KCP backend to ensure it can handle the target **10,000 QPS** (Queries Per Second) under various scenarios.

---

## 🛠️ Prerequisites

### Install K6

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```powershell
choco install k6
```

### Ensure Services are Running

```bash
cd /Users/cavin/Desktop/dev/ankersckcp/backend
docker-compose up -d
```

Verify services:
```bash
curl http://localhost:8001/health  # Knowledge Service
curl http://localhost:8002/health  # Content Service
curl http://localhost:8003/health  # Support Service
curl http://localhost:8004/health  # Analytics Service
curl http://localhost:8005/health  # Auth Service
```

---

## 🚀 Running Load Tests

### 1. Smoke Test (Quick Health Check)

**Purpose**: Quick validation that services work under minimal load

```bash
k6 run load_test.js
```

**Configuration:**
- Virtual Users: 10
- Duration: 1 minute
- Expected Result: 0% error rate, all checks pass

---

### 2. Load Test (Normal Traffic Simulation)

**Purpose**: Test system behavior under expected production load

```bash
k6 run load_test.js -e TEST=load
```

**Configuration:**
- Ramp up: 0 → 100 users (2 min)
- Sustain: 100 users (5 min)
- Increase: 100 → 200 users (2 min)
- Sustain: 200 users (5 min)
- Ramp down: 200 → 0 users (2 min)
- Total Duration: ~16 minutes

**Success Criteria:**
- Error rate < 1%
- P95 response time < 500ms
- P99 response time < 1000ms

---

### 3. Stress Test (Breaking Point)

**Purpose**: Find the system's breaking point

```bash
k6 run load_test.js -e TEST=stress
```

**Configuration:**
- Gradual increase: 100 → 200 → 300 → 400 users
- Sustain at each level for 5 minutes
- Total Duration: ~39 minutes

**What to observe:**
- At what load does the system start showing degradation?
- Does the system recover after load decreases?
- Are there any memory leaks or resource exhaustion?

---

### 4. Spike Test (Sudden Traffic Surge)

**Purpose**: Test system behavior during sudden traffic spikes

```bash
k6 run load_test.js -e TEST=spike
```

**Configuration:**
- Normal load: 100 users
- Sudden spike: 100 → 1000 users (10 seconds)
- Sustain spike: 1000 users (3 minutes)
- Quick recovery: 1000 → 100 users (10 seconds)

**Success Criteria:**
- System doesn't crash during spike
- Graceful degradation (slower but still responsive)
- Quick recovery after spike

---

### 5. 10,000 QPS Test (Target Performance)

**Purpose**: Validate the system can handle 10,000 requests per second

```bash
k6 run load_test.js -e TEST=qps_10k
```

**Configuration:**
- Target: 10,000 requests/second
- Duration: 5 minutes
- Virtual Users: 500-1000 (auto-scaled)

**Success Criteria:**
- Maintain 10,000 QPS for 5 minutes
- Error rate < 1%
- P95 response time < 500ms

⚠️ **Warning**: This test requires significant system resources. Run on production-like infrastructure.

---

## 📊 Analyzing Results

### Real-time Monitoring

K6 displays real-time metrics during test execution:
- **VUs**: Current number of virtual users
- **RPS**: Requests per second
- **HTTP Req Duration**: Response time percentiles
- **HTTP Req Failed**: Error rate

### JSON Report

Generate detailed JSON report:
```bash
k6 run --out json=results.json load_test.js -e TEST=load
```

### HTML Report (using k6-reporter)

```bash
npm install -g k6-to-junit
k6 run --out json=results.json load_test.js -e TEST=load
k6-to-junit results.json > results.xml
```

### Cloud Results (K6 Cloud)

```bash
k6 login cloud
k6 run --out cloud load_test.js -e TEST=load
```

---

## 🎯 Performance Thresholds

The test is configured with the following thresholds:

| Metric | Threshold | Description |
|--------|-----------|-------------|
| http_req_duration | p(95) < 500ms | 95% of requests complete in < 500ms |
| http_req_failed | rate < 0.01 | Error rate < 1% |
| knowledge service | p(95) < 300ms | Knowledge API responds in < 300ms |
| analytics service | p(95) < 500ms | Analytics API responds in < 500ms |

**If thresholds are breached:**
- 🔴 Test fails
- Investigate bottlenecks
- Optimize and re-test

---

## 🔍 Common Bottlenecks & Solutions

### 1. Database Connection Pool Exhaustion

**Symptoms:**
- Error: "Too many connections"
- Sudden spike in errors

**Solutions:**
- Increase connection pool size
- Implement connection pooling
- Use read replicas for read-heavy queries

### 2. Memory Leaks

**Symptoms:**
- Memory usage increases over time
- OOM (Out of Memory) errors
- Slow response times

**Solutions:**
- Profile memory usage
- Fix memory leaks in code
- Implement proper garbage collection

### 3. CPU Saturation

**Symptoms:**
- High CPU usage (> 80%)
- Slow response times
- Request queuing

**Solutions:**
- Optimize hot code paths
- Implement caching
- Scale horizontally (add more instances)

### 4. Network Bandwidth

**Symptoms:**
- High network I/O
- Timeouts
- Slow data transfer

**Solutions:**
- Optimize payload sizes
- Enable compression (gzip)
- Use CDN for static assets

---

## 📈 Expected Performance Targets

Based on the project requirements:

| Service | Target RPS | P95 Latency | Error Rate |
|---------|-----------|-------------|------------|
| Knowledge Service | 5,000 | < 300ms | < 0.1% |
| Analytics Service | 2,000 | < 500ms | < 0.5% |
| Content Service | 1,000 | < 1000ms | < 1% |
| Support Service | 1,500 | < 400ms | < 0.1% |
| Auth Service | 500 | < 200ms | < 0.01% |
| **Total** | **10,000** | **< 500ms** | **< 1%** |

---

## 🧪 Test Scenarios

### Scenario 1: Read-Heavy Workload
```javascript
// 80% reads, 20% writes
if (Math.random() < 0.8) {
    testKnowledgeServiceList();
} else {
    testCreateKnowledgeItem();
}
```

### Scenario 2: Search-Intensive
```javascript
// Simulate user search behavior
testKnowledgeServiceSearch();
sleep(2);
testKnowledgeServiceList();
```

### Scenario 3: Analytics Dashboard
```javascript
// Simulate dashboard loading
testAnalyticsServiceOverview();
testAnalyticsServiceContent();
testAnalyticsServiceSearch();
```

---

## 🛡️ Production Load Test Best Practices

1. **Test in Staging First**
   - Never run stress tests in production
   - Use production-like data and infrastructure

2. **Monitor System Resources**
   - CPU, Memory, Disk I/O
   - Database connections
   - Network bandwidth

3. **Gradual Ramp-up**
   - Start with smoke test
   - Increase load gradually
   - Monitor for degradation

4. **Test at Different Times**
   - Peak hours vs off-peak
   - Weekday vs weekend
   - Different geographic regions

5. **Document Results**
   - Baseline performance
   - Bottlenecks discovered
   - Optimizations applied
   - Re-test results

---

## 📝 Test Checklist

Before running load tests:

- [ ] All services are running (`docker-compose ps`)
- [ ] Database has representative data
- [ ] Monitoring is enabled (Prometheus/Grafana)
- [ ] Logs are being collected
- [ ] Resource limits are appropriate
- [ ] Backups are recent (in case of issues)

After load tests:

- [ ] Review error logs
- [ ] Analyze performance metrics
- [ ] Check for resource leaks
- [ ] Document findings
- [ ] Create optimization tickets
- [ ] Re-test after optimizations

---

## 🔗 Related Documentation

- **K6 Official Docs**: https://k6.io/docs/
- **Performance Testing Best Practices**: https://k6.io/docs/testing-guides/
- **Prometheus Monitoring**: `../k8s/base/prometheus-config.yml`
- **Grafana Dashboards**: `../k8s/base/grafana-dashboard.json`

---

## 💡 Tips

- **Start small**: Begin with smoke tests before running full load tests
- **Monitor continuously**: Watch metrics during tests to catch issues early
- **Test one service at a time**: Isolate bottlenecks
- **Compare results**: Keep baseline metrics for comparison
- **Automate**: Integrate load tests into CI/CD pipeline

---

## ⚠️ Warnings

- Running 10,000 QPS tests requires **significant resources**
- May impact other services on the same infrastructure
- Database may need **tuning** for high concurrency
- Network bandwidth may become a bottleneck
- Consider using **dedicated load testing environment**

---

## 📞 Support

If load tests reveal performance issues:

1. Check logs: `docker-compose logs -f [service-name]`
2. Review metrics: http://localhost:9090 (Prometheus)
3. Analyze database queries: Enable slow query log
4. Profile application: Use Python profilers (cProfile, py-spy)
5. Consult documentation: `../CICD-DEPLOYMENT-GUIDE.md`
