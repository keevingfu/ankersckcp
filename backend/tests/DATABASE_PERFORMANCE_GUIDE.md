# Database Performance Testing Guide - Soundcore KCP

## 📋 Overview

This guide explains how to perform comprehensive performance testing on the three core databases used in the Soundcore KCP backend:

1. **PostgreSQL** - Relational database for structured data
2. **MongoDB** - Document database for flexible schema data
3. **Redis** - In-memory cache for high-performance data access

---

## 🎯 Performance Targets

Based on the Soundcore KCP requirements, the target performance metrics are:

| Database | Metric | Target | Critical Threshold |
|----------|--------|--------|-------------------|
| **PostgreSQL** | Simple SELECT | < 5ms | < 10ms |
| PostgreSQL | Complex JOIN | < 50ms | < 100ms |
| PostgreSQL | INSERT | < 10ms | < 20ms |
| PostgreSQL | Connection Pool | < 3ms | < 5ms |
| **MongoDB** | Simple Find | < 5ms | < 10ms |
| MongoDB | Aggregation | < 50ms | < 100ms |
| MongoDB | INSERT | < 5ms | < 10ms |
| MongoDB | Bulk INSERT (1000) | < 100ms | < 200ms |
| **Redis** | GET/SET | < 1ms | < 2ms |
| Redis | HASH Operations | < 1ms | < 2ms |
| Redis | LIST Operations | < 1ms | < 2ms |
| Redis | Sorted Set | < 2ms | < 5ms |
| Redis | Pipeline (6 ops) | < 2ms | < 5ms |

---

## 🛠️ Prerequisites

### 1. Install Python Dependencies

```bash
cd /Users/cavin/Desktop/dev/ankersckcp/backend/tests

# Install testing dependencies
pip install -r requirements-db-test.txt
```

**Required packages:**
- `psycopg2-binary` - PostgreSQL driver
- `pymongo` - MongoDB driver
- `redis` - Redis driver
- `python-dotenv` - Environment variable management

### 2. Ensure Database Services are Running

All databases should be running in Docker containers:

```bash
# Check Docker containers
docker ps

# Expected containers:
# - postgres-claude-mcp (port 5437)
# - mongodb-claude-mcp (port 27018)
# - redis-claude-mcp (port 6382)
```

#### Start Databases if Not Running

**PostgreSQL:**
```bash
docker run -d \
  --name postgres-claude-mcp \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=soundcore_kcp \
  -p 5437:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15
```

**MongoDB:**
```bash
docker run -d \
  --name mongodb-claude-mcp \
  -e MONGO_INITDB_ROOT_USERNAME=user \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=soundcore_kcp \
  -p 27018:27017 \
  -v mongodb-claude-data:/data/db \
  mongo:7
```

**Redis:**
```bash
docker run -d \
  --name redis-claude-mcp \
  -p 6382:6379 \
  -v redis-claude-data:/data \
  redis:7-alpine redis-server --appendonly yes
```

### 3. Verify Database Connections

```bash
# PostgreSQL
docker exec -it postgres-claude-mcp psql -U user -d soundcore_kcp -c "SELECT version();"

# MongoDB
docker exec -it mongodb-claude-mcp mongosh -u user -p password --authenticationDatabase admin --eval "db.version()"

# Redis
docker exec -it redis-claude-mcp redis-cli ping
```

---

## 🚀 Running Performance Tests

### Test Script Overview

The performance testing script (`test_database_performance.py`) provides comprehensive performance testing capabilities:

**Features:**
- ✅ Automated performance benchmarking
- ✅ Detailed metrics (min, max, mean, median, P95, P99)
- ✅ Error tracking and reporting
- ✅ Connection pool performance testing
- ✅ JSON report generation
- ✅ Configurable iterations

### 1. Run All Database Tests

Test all three databases with default settings (1000 iterations):

```bash
python test_database_performance.py
```

**Output includes:**
- PostgreSQL: 5 tests (Simple SELECT, Complex Query, INSERT, Index Performance, Connection Pool)
- MongoDB: 5 tests (Simple Find, Aggregation, INSERT, Bulk INSERT, Index Performance)
- Redis: 5 tests (GET/SET, HASH, LIST, Sorted Set, Pipeline)

### 2. Test Specific Database

```bash
# Test PostgreSQL only
python test_database_performance.py --db postgres

# Test MongoDB only
python test_database_performance.py --db mongodb

# Test Redis only
python test_database_performance.py --db redis
```

### 3. Custom Iterations

Increase or decrease the number of iterations:

```bash
# Light test (fast)
python test_database_performance.py --iterations 100

# Standard test
python test_database_performance.py --iterations 1000

# Heavy test (comprehensive)
python test_database_performance.py --iterations 10000
```

### 4. Generate Performance Report

Create a JSON report for documentation and analysis:

```bash
python test_database_performance.py --report --output db-performance-report.json
```

**Report includes:**
- Timestamp
- Summary statistics
- Detailed results for all tests
- Response time percentiles (P95, P99)
- Error rates

### 5. Combined Examples

```bash
# Test only Redis with 5000 iterations and generate report
python test_database_performance.py \
  --db redis \
  --iterations 5000 \
  --report \
  --output redis-performance-report.json

# Comprehensive test of all databases with high iteration count
python test_database_performance.py \
  --iterations 10000 \
  --report \
  --output comprehensive-db-report.json
```

---

## 📊 Understanding Test Results

### Sample Output Format

```
======================================================================
Test: PostgreSQL - Simple SELECT
======================================================================
✅ Status: PASSED
   Total Operations: 1,000
   Total Time: 2.5s
   Operations/Second: 400

📊 Response Times (ms):
   Min:    0.823
   Max:    15.234
   Mean:   2.501
   Median: 2.234
   P95:    4.567
   P99:    8.123

⚠️  Errors: 0 (0.0%)
```

### Key Metrics Explained

| Metric | Description | Importance |
|--------|-------------|------------|
| **Operations/Second** | Throughput capacity | Higher is better |
| **Min** | Fastest response time | Best case scenario |
| **Max** | Slowest response time | Worst case scenario |
| **Mean** | Average response time | Typical performance |
| **Median** | Middle value (50th percentile) | More resistant to outliers than mean |
| **P95** | 95th percentile | 95% of requests complete within this time |
| **P99** | 99th percentile | 99% of requests complete within this time |
| **Error Rate** | Percentage of failed operations | Should be 0% or near 0% |

### Performance Evaluation

**Excellent Performance:**
- PostgreSQL Simple SELECT: < 5ms mean, > 300 ops/sec
- MongoDB Simple Find: < 5ms mean, > 300 ops/sec
- Redis GET/SET: < 1ms mean, > 5000 ops/sec

**Good Performance:**
- PostgreSQL: 5-10ms mean
- MongoDB: 5-10ms mean
- Redis: 1-2ms mean

**Needs Optimization:**
- PostgreSQL: > 10ms mean
- MongoDB: > 10ms mean
- Redis: > 2ms mean

---

## 🔍 PostgreSQL Performance Tests

### Test 1: Simple SELECT
**Purpose:** Measure basic query performance

**Query:** `SELECT 1`

**Expected Performance:**
- Mean: < 5ms
- P95: < 10ms
- Throughput: > 300 ops/sec

### Test 2: Complex Query (JOIN + GROUP BY)
**Purpose:** Test performance of realistic business queries

**Query:**
```sql
SELECT
    p.id, p.name, p.sku,
    COUNT(k.id) as knowledge_count,
    AVG(k.quality_score) as avg_quality
FROM products p
LEFT JOIN knowledge_items k ON p.id = k.product_id
WHERE p.status = 'ACTIVE'
GROUP BY p.id, p.name, p.sku
ORDER BY knowledge_count DESC
LIMIT 10
```

**Expected Performance:**
- Mean: < 50ms
- P95: < 100ms

### Test 3: INSERT Performance
**Purpose:** Measure write performance

**Operation:** Insert search query logs

**Expected Performance:**
- Mean: < 10ms
- P95: < 20ms
- Throughput: > 100 ops/sec

### Test 4: Index Performance
**Purpose:** Validate index effectiveness

**Query:** `SELECT * FROM knowledge_items WHERE type = 'FAQ' LIMIT 10`

**Expected Performance:**
- Mean: < 5ms (with index)
- Performance degradation: < 10x compared to simple SELECT

### Test 5: Connection Pool Performance
**Purpose:** Test connection pooling efficiency

**Expected Performance:**
- Mean: < 3ms
- Overhead vs direct query: < 1ms

---

## 🍃 MongoDB Performance Tests

### Test 1: Simple Find
**Purpose:** Measure basic document retrieval

**Query:** `collection.find_one({"type": "FAQ"})`

**Expected Performance:**
- Mean: < 5ms
- P95: < 10ms
- Throughput: > 300 ops/sec

### Test 2: Aggregation Pipeline
**Purpose:** Test complex aggregation performance

**Pipeline:**
```javascript
[
  {$match: {type: "FAQ"}},
  {$group: {
    _id: "$product_id",
    count: {$sum: 1},
    avg_quality: {$avg: "$quality_score"}
  }},
  {$sort: {count: -1}},
  {$limit: 10}
]
```

**Expected Performance:**
- Mean: < 50ms
- P95: < 100ms

### Test 3: INSERT Performance
**Purpose:** Measure single document insert speed

**Expected Performance:**
- Mean: < 5ms
- P95: < 10ms
- Throughput: > 200 ops/sec

### Test 4: Bulk INSERT
**Purpose:** Test batch insert efficiency

**Operation:** Insert 1000 documents in one operation

**Expected Performance:**
- Total time: < 100ms
- Per-document: < 0.1ms

### Test 5: Index Performance
**Purpose:** Validate index effectiveness

**Query:** `collection.find({"product_id": "test-product"}).limit(10)`

**Expected Performance:**
- Mean: < 5ms (with index)
- Performance improvement: > 10x vs no index

---

## 🔴 Redis Performance Tests

### Test 1: GET/SET Operations
**Purpose:** Measure basic cache operations

**Operations:**
```python
redis.set("test:key:1", "value_1")
redis.get("test:key:1")
```

**Expected Performance:**
- Mean: < 1ms
- P95: < 2ms
- Throughput: > 5000 ops/sec

### Test 2: HASH Operations
**Purpose:** Test hash data structure performance

**Operations:**
```python
redis.hset("test:hash", mapping={"field1": "value1", "field2": "value2"})
redis.hgetall("test:hash")
```

**Expected Performance:**
- Mean: < 1ms
- Throughput: > 3000 ops/sec

### Test 3: LIST Operations
**Purpose:** Test list data structure performance

**Operations:**
```python
redis.lpush("test:list", "item1", "item2", "item3")
redis.lrange("test:list", 0, -1)
```

**Expected Performance:**
- Mean: < 1ms
- Throughput: > 3000 ops/sec

### Test 4: Sorted Set Operations
**Purpose:** Test sorted set performance (for rankings, leaderboards)

**Operations:**
```python
redis.zadd("test:zset", {"member1": 1, "member2": 2, "member3": 3})
redis.zrange("test:zset", 0, -1, withscores=True)
```

**Expected Performance:**
- Mean: < 2ms
- Throughput: > 2000 ops/sec

### Test 5: Pipeline Performance
**Purpose:** Test batch operation efficiency

**Operations:** 6 operations in one pipeline (3 SET + 3 GET)

**Expected Performance:**
- Mean: < 2ms (for all 6 operations)
- Throughput: > 2000 pipelines/sec
- Efficiency: > 3x faster than individual operations

---

## 🐛 Troubleshooting

### Connection Errors

**PostgreSQL Connection Failed:**
```
❌ PostgreSQL connection failed: could not connect to server
```

**Solutions:**
1. Check if container is running: `docker ps | grep postgres`
2. Verify port mapping: `docker port postgres-claude-mcp`
3. Check credentials: `docker logs postgres-claude-mcp`
4. Restart container: `docker restart postgres-claude-mcp`

**MongoDB Connection Failed:**
```
❌ MongoDB connection failed: ServerSelectionTimeoutError
```

**Solutions:**
1. Check container: `docker ps | grep mongodb`
2. Verify authentication: `docker exec mongodb-claude-mcp mongosh --eval "db.version()"`
3. Check logs: `docker logs mongodb-claude-mcp`

**Redis Connection Failed:**
```
❌ Redis connection failed: Connection refused
```

**Solutions:**
1. Check container: `docker ps | grep redis`
2. Test connection: `docker exec redis-claude-mcp redis-cli ping`
3. Verify port: `docker port redis-claude-mcp`

### Performance Issues

**Slow PostgreSQL Queries:**
1. Check for missing indexes:
```sql
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';
```

2. Analyze query performance:
```sql
EXPLAIN ANALYZE SELECT * FROM knowledge_items WHERE type = 'FAQ';
```

3. Check connection pool size (may need to increase)

**Slow MongoDB Queries:**
1. Check indexes:
```javascript
db.knowledge_items.getIndexes()
```

2. Create missing indexes:
```javascript
db.knowledge_items.createIndex({ type: 1 })
db.knowledge_items.createIndex({ product_id: 1 })
```

3. Analyze query performance:
```javascript
db.knowledge_items.find({ type: "FAQ" }).explain("executionStats")
```

**Slow Redis Operations:**
1. Check memory usage:
```bash
docker exec redis-claude-mcp redis-cli INFO memory
```

2. Check slow operations:
```bash
docker exec redis-claude-mcp redis-cli SLOWLOG GET 10
```

3. Monitor real-time commands:
```bash
docker exec -it redis-claude-mcp redis-cli MONITOR
```

### High Error Rates

**If tests show > 1% error rate:**

1. **Check database logs:**
```bash
# PostgreSQL
docker logs postgres-claude-mcp --tail 50

# MongoDB
docker logs mongodb-claude-mcp --tail 50

# Redis
docker logs redis-claude-mcp --tail 50
```

2. **Verify database health:**
```bash
# PostgreSQL
docker exec postgres-claude-mcp pg_isready

# MongoDB
docker exec mongodb-claude-mcp mongosh --eval "db.serverStatus().ok"

# Redis
docker exec redis-claude-mcp redis-cli ping
```

3. **Check system resources:**
```bash
# CPU and memory usage
docker stats --no-stream
```

---

## 📈 Performance Optimization Tips

### PostgreSQL Optimization

1. **Connection Pooling:**
   - Use connection pooling (already implemented in test script)
   - Recommended pool size: 10-20 connections
   - Max connections: Set based on available memory

2. **Indexing:**
```sql
-- Create indexes on frequently queried columns
CREATE INDEX idx_knowledge_type ON knowledge_items(type);
CREATE INDEX idx_knowledge_product ON knowledge_items(product_id);
CREATE INDEX idx_knowledge_quality ON knowledge_items(quality_score DESC);
```

3. **Query Optimization:**
   - Use `EXPLAIN ANALYZE` to identify slow queries
   - Avoid `SELECT *`, specify columns
   - Use `LIMIT` for large result sets

4. **Configuration Tuning:**
```sql
-- Increase shared_buffers (25% of RAM)
ALTER SYSTEM SET shared_buffers = '256MB';

-- Increase work_mem for complex queries
ALTER SYSTEM SET work_mem = '16MB';

-- Enable query caching
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
```

### MongoDB Optimization

1. **Indexing:**
```javascript
// Create compound indexes
db.knowledge_items.createIndex({ type: 1, product_id: 1 });

// Create text index for search
db.knowledge_items.createIndex({ title: "text", content: "text" });
```

2. **Aggregation Optimization:**
   - Use `$match` early in pipeline
   - Use `$project` to reduce document size
   - Use `$limit` to reduce result set

3. **Connection Pooling:**
   - Default pool size: 100
   - Adjust based on application needs

4. **Write Concern:**
```javascript
// For high-throughput writes, use w:1
db.collection.insertOne(doc, { writeConcern: { w: 1 } });
```

### Redis Optimization

1. **Use Pipelining:**
```python
# Batch operations for 10x+ performance improvement
pipe = redis.pipeline()
for i in range(1000):
    pipe.set(f"key:{i}", f"value_{i}")
pipe.execute()
```

2. **Choose Right Data Structure:**
   - Simple key-value: GET/SET
   - Structured data: HASH
   - Ordered data: SORTED SET
   - Lists: LIST

3. **Set Expiration:**
```python
# Prevent memory bloat
redis.setex("key", 3600, "value")  # Expires in 1 hour
```

4. **Memory Management:**
```bash
# Set max memory and eviction policy
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

---

## 📊 Benchmarking Best Practices

1. **Warm-up Phase:**
   - Run a small number of operations before actual testing
   - Ensures connection pools are initialized
   - Caches are populated

2. **Consistent Environment:**
   - Run tests on same hardware
   - Minimize other processes
   - Test at same time of day

3. **Multiple Runs:**
   - Run tests 3-5 times
   - Average results
   - Look for consistency

4. **Realistic Data:**
   - Use production-like data volume
   - Test with representative queries
   - Include edge cases

5. **Document Results:**
   - Save reports with timestamps
   - Note system configuration
   - Track changes over time

---

## 📋 Performance Testing Checklist

### Before Testing
- [ ] All database containers running
- [ ] Database connections verified
- [ ] Test dependencies installed (`pip install -r requirements-db-test.txt`)
- [ ] Representative data loaded (if testing with real data)
- [ ] System resources available (CPU < 50%, Memory < 70%)

### During Testing
- [ ] Monitor system resources (`docker stats`)
- [ ] Check database logs for errors
- [ ] Note any anomalies or unusual behavior
- [ ] Record environmental conditions

### After Testing
- [ ] Review all metrics (mean, P95, P99)
- [ ] Compare against target thresholds
- [ ] Identify bottlenecks
- [ ] Document findings
- [ ] Generate JSON report
- [ ] Create optimization plan if needed

---

## 🎯 Expected Results Summary

Based on 1000 iterations with default configuration:

### PostgreSQL
```
✅ Simple SELECT: ~2-5ms mean, 200-400 ops/sec
✅ Complex Query: ~20-50ms mean, 20-50 ops/sec
✅ INSERT: ~5-10ms mean, 100-200 ops/sec
✅ Index Query: ~2-5ms mean, 200-400 ops/sec
✅ Connection Pool: ~2-4ms mean, 250-500 ops/sec
```

### MongoDB
```
✅ Simple Find: ~2-5ms mean, 200-400 ops/sec
✅ Aggregation: ~20-50ms mean, 20-50 ops/sec
✅ INSERT: ~2-5ms mean, 200-400 ops/sec
✅ Bulk INSERT: ~50-100ms total, 10-20 inserts/ms
✅ Index Query: ~2-5ms mean, 200-400 ops/sec
```

### Redis
```
✅ GET/SET: ~0.5-1ms mean, 1000-2000 ops/sec
✅ HASH: ~0.5-1ms mean, 1000-2000 ops/sec
✅ LIST: ~0.5-1ms mean, 1000-2000 ops/sec
✅ Sorted Set: ~1-2ms mean, 500-1000 ops/sec
✅ Pipeline: ~1-2ms mean, 500-1000 pipelines/sec
```

---

## 🔗 Related Documentation

- **Load Testing Guide**: `LOAD_TEST_GUIDE.md` - API/service load testing with K6
- **API Integration Tests**: `test_api_integration.py` - API endpoint testing
- **Deployment Guide**: `../CICD-DEPLOYMENT-GUIDE.md` - Production deployment
- **Project Documentation**: `../../soundcore-kcp-dev.md` - Full development guide

---

## 📞 Support

If you encounter issues:

1. **Check Docker containers**: `docker ps -a`
2. **Review database logs**: `docker logs [container-name]`
3. **Verify network connectivity**: `docker network inspect bridge`
4. **Check system resources**: `docker stats`
5. **Consult documentation**: See related docs above

---

**Last Updated**: 2025-10-22
**Version**: 1.0.0
**Maintainer**: Soundcore KCP Development Team
