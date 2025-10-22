#!/usr/bin/env python3
"""
Database Performance Testing Suite for Soundcore KCP Backend

This script performs comprehensive performance testing on:
- PostgreSQL (Relational Database)
- MongoDB (Document Database)
- Redis (Cache)

Requirements:
    pip install -r requirements-db-test.txt

Usage:
    # Test all databases
    python test_database_performance.py

    # Test specific database
    python test_database_performance.py --db postgres
    python test_database_performance.py --db mongodb
    python test_database_performance.py --db redis

    # Run with custom parameters
    python test_database_performance.py --iterations 10000 --connections 50

    # Generate report
    python test_database_performance.py --report --output db-performance-report.json
"""

import argparse
import json
import time
import statistics
from datetime import datetime
from typing import Dict, List, Any
import sys

# Database drivers
try:
    import psycopg2
    from psycopg2 import pool
    POSTGRES_AVAILABLE = True
except ImportError:
    POSTGRES_AVAILABLE = False
    print("⚠️  psycopg2 not installed. PostgreSQL tests will be skipped.")

try:
    from pymongo import MongoClient
    MONGODB_AVAILABLE = True
except ImportError:
    MONGODB_AVAILABLE = False
    print("⚠️  pymongo not installed. MongoDB tests will be skipped.")

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    print("⚠️  redis not installed. Redis tests will be skipped.")


# Database configurations
POSTGRES_CONFIG = {
    "host": "localhost",
    "port": 5437,
    "database": "soundcore_kcp",
    "user": "user",
    "password": "password"
}

MONGODB_CONFIG = {
    "host": "localhost",
    "port": 27018,
    "database": "soundcore_kcp",
    "username": "user",
    "password": "password"
}

REDIS_CONFIG = {
    "host": "localhost",
    "port": 6382,
    "password": None,
    "db": 0
}


class PerformanceMetrics:
    """Store and calculate performance metrics"""

    def __init__(self, test_name: str):
        self.test_name = test_name
        self.response_times: List[float] = []
        self.errors: List[str] = []
        self.start_time = None
        self.end_time = None

    def add_response_time(self, time_ms: float):
        """Add a response time measurement"""
        self.response_times.append(time_ms)

    def add_error(self, error: str):
        """Add an error message"""
        self.errors.append(error)

    def start(self):
        """Mark test start time"""
        self.start_time = time.time()

    def end(self):
        """Mark test end time"""
        self.end_time = time.time()

    def get_summary(self) -> Dict[str, Any]:
        """Calculate and return performance summary"""
        if not self.response_times:
            return {
                "test_name": self.test_name,
                "status": "failed",
                "error": "No response times recorded",
                "error_count": len(self.errors)
            }

        total_time = self.end_time - self.start_time if self.end_time and self.start_time else 0

        return {
            "test_name": self.test_name,
            "status": "passed" if not self.errors else "passed_with_errors",
            "total_operations": len(self.response_times),
            "total_time_seconds": round(total_time, 3),
            "operations_per_second": round(len(self.response_times) / total_time, 2) if total_time > 0 else 0,
            "response_times_ms": {
                "min": round(min(self.response_times), 3),
                "max": round(max(self.response_times), 3),
                "mean": round(statistics.mean(self.response_times), 3),
                "median": round(statistics.median(self.response_times), 3),
                "p95": round(statistics.quantiles(self.response_times, n=20)[18], 3) if len(self.response_times) > 20 else None,
                "p99": round(statistics.quantiles(self.response_times, n=100)[98], 3) if len(self.response_times) > 100 else None,
            },
            "error_count": len(self.errors),
            "error_rate_percent": round((len(self.errors) / (len(self.response_times) + len(self.errors))) * 100, 2) if self.response_times or self.errors else 0
        }


class PostgreSQLPerformanceTest:
    """PostgreSQL performance testing"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.connection_pool = None

    def setup(self):
        """Initialize connection pool"""
        try:
            self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                minconn=1,
                maxconn=20,
                **self.config
            )
            print("✅ PostgreSQL connection pool initialized")
            return True
        except Exception as e:
            print(f"❌ PostgreSQL connection failed: {e}")
            return False

    def test_simple_select(self, iterations: int = 1000) -> PerformanceMetrics:
        """Test simple SELECT query performance"""
        metrics = PerformanceMetrics("PostgreSQL - Simple SELECT")
        metrics.start()

        for i in range(iterations):
            conn = None
            try:
                start = time.time()
                conn = self.connection_pool.getconn()
                cursor = conn.cursor()
                cursor.execute("SELECT 1")
                cursor.fetchone()
                cursor.close()
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))
            finally:
                if conn:
                    self.connection_pool.putconn(conn)

        metrics.end()
        return metrics

    def test_complex_query(self, iterations: int = 500) -> PerformanceMetrics:
        """Test complex JOIN query performance"""
        metrics = PerformanceMetrics("PostgreSQL - Complex Query")
        metrics.start()

        query = """
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
        """

        for i in range(iterations):
            conn = None
            try:
                start = time.time()
                conn = self.connection_pool.getconn()
                cursor = conn.cursor()
                cursor.execute(query)
                cursor.fetchall()
                cursor.close()
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))
            finally:
                if conn:
                    self.connection_pool.putconn(conn)

        metrics.end()
        return metrics

    def test_insert_performance(self, iterations: int = 1000) -> PerformanceMetrics:
        """Test INSERT performance"""
        metrics = PerformanceMetrics("PostgreSQL - INSERT")
        metrics.start()

        for i in range(iterations):
            conn = None
            try:
                start = time.time()
                conn = self.connection_pool.getconn()
                cursor = conn.cursor()
                cursor.execute(
                    """
                    INSERT INTO search_queries (query, language, user_id, results_count, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    """,
                    (f"test query {i}", "EN", "test-user", 10)
                )
                conn.commit()
                cursor.close()
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))
            finally:
                if conn:
                    self.connection_pool.putconn(conn)

        metrics.end()
        return metrics

    def test_index_performance(self, iterations: int = 1000) -> PerformanceMetrics:
        """Test indexed vs non-indexed query performance"""
        metrics = PerformanceMetrics("PostgreSQL - Index Performance")
        metrics.start()

        for i in range(iterations):
            conn = None
            try:
                start = time.time()
                conn = self.connection_pool.getconn()
                cursor = conn.cursor()
                # Query using indexed column
                cursor.execute(
                    "SELECT * FROM knowledge_items WHERE type = %s LIMIT 10",
                    ("FAQ",)
                )
                cursor.fetchall()
                cursor.close()
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))
            finally:
                if conn:
                    self.connection_pool.putconn(conn)

        metrics.end()
        return metrics

    def test_connection_pool_performance(self, iterations: int = 1000) -> PerformanceMetrics:
        """Test connection pool performance"""
        metrics = PerformanceMetrics("PostgreSQL - Connection Pool")
        metrics.start()

        for i in range(iterations):
            conn = None
            try:
                start = time.time()
                conn = self.connection_pool.getconn()
                cursor = conn.cursor()
                cursor.execute("SELECT version()")
                cursor.fetchone()
                cursor.close()
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))
            finally:
                if conn:
                    self.connection_pool.putconn(conn)

        metrics.end()
        return metrics

    def teardown(self):
        """Close connection pool"""
        if self.connection_pool:
            self.connection_pool.closeall()
            print("✅ PostgreSQL connection pool closed")


class MongoDBPerformanceTest:
    """MongoDB performance testing"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.client = None
        self.db = None

    def setup(self):
        """Initialize MongoDB connection"""
        try:
            connection_string = f"mongodb://{self.config['username']}:{self.config['password']}@{self.config['host']}:{self.config['port']}/{self.config['database']}?authSource=admin"
            self.client = MongoClient(connection_string, maxPoolSize=50)
            self.db = self.client[self.config['database']]
            # Test connection
            self.client.server_info()
            print("✅ MongoDB connection established")
            return True
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            return False

    def test_simple_find(self, iterations: int = 1000) -> PerformanceMetrics:
        """Test simple find query performance"""
        metrics = PerformanceMetrics("MongoDB - Simple Find")
        metrics.start()

        collection = self.db['knowledge_items']

        for i in range(iterations):
            try:
                start = time.time()
                result = collection.find_one({"type": "FAQ"})
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_aggregation(self, iterations: int = 500) -> PerformanceMetrics:
        """Test aggregation pipeline performance"""
        metrics = PerformanceMetrics("MongoDB - Aggregation")
        metrics.start()

        collection = self.db['knowledge_items']
        pipeline = [
            {"$match": {"type": "FAQ"}},
            {"$group": {
                "_id": "$product_id",
                "count": {"$sum": 1},
                "avg_quality": {"$avg": "$quality_score"}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]

        for i in range(iterations):
            try:
                start = time.time()
                results = list(collection.aggregate(pipeline))
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_insert_performance(self, iterations: int = 1000) -> PerformanceMetrics:
        """Test INSERT performance"""
        metrics = PerformanceMetrics("MongoDB - INSERT")
        metrics.start()

        collection = self.db['test_performance']

        for i in range(iterations):
            try:
                start = time.time()
                collection.insert_one({
                    "test_id": i,
                    "timestamp": datetime.utcnow(),
                    "data": f"test data {i}",
                    "value": i * 10
                })
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_bulk_insert(self, batch_size: int = 1000) -> PerformanceMetrics:
        """Test bulk INSERT performance"""
        metrics = PerformanceMetrics("MongoDB - Bulk INSERT")
        metrics.start()

        collection = self.db['test_performance']
        documents = [
            {
                "test_id": i,
                "timestamp": datetime.utcnow(),
                "data": f"bulk test data {i}",
                "value": i * 10
            }
            for i in range(batch_size)
        ]

        try:
            start = time.time()
            collection.insert_many(documents)
            end = time.time()
            metrics.add_response_time((end - start) * 1000)
        except Exception as e:
            metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_index_performance(self, iterations: int = 1000) -> PerformanceMetrics:
        """Test indexed query performance"""
        metrics = PerformanceMetrics("MongoDB - Index Performance")
        metrics.start()

        collection = self.db['knowledge_items']

        for i in range(iterations):
            try:
                start = time.time()
                # Query using indexed field
                result = collection.find({"product_id": "test-product"}).limit(10)
                list(result)
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def teardown(self):
        """Close MongoDB connection and cleanup"""
        if self.client:
            # Clean up test data
            try:
                self.db['test_performance'].drop()
            except:
                pass
            self.client.close()
            print("✅ MongoDB connection closed")


class RedisPerformanceTest:
    """Redis performance testing"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.client = None

    def setup(self):
        """Initialize Redis connection"""
        try:
            self.client = redis.Redis(
                host=self.config['host'],
                port=self.config['port'],
                password=self.config.get('password'),
                db=self.config['db'],
                decode_responses=True,
                max_connections=50
            )
            # Test connection
            self.client.ping()
            print("✅ Redis connection established")
            return True
        except Exception as e:
            print(f"❌ Redis connection failed: {e}")
            return False

    def test_get_set(self, iterations: int = 10000) -> PerformanceMetrics:
        """Test GET/SET performance"""
        metrics = PerformanceMetrics("Redis - GET/SET")
        metrics.start()

        for i in range(iterations):
            try:
                start = time.time()
                self.client.set(f"test:key:{i}", f"value_{i}")
                self.client.get(f"test:key:{i}")
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_hash_operations(self, iterations: int = 5000) -> PerformanceMetrics:
        """Test HASH operations performance"""
        metrics = PerformanceMetrics("Redis - HASH Operations")
        metrics.start()

        for i in range(iterations):
            try:
                start = time.time()
                self.client.hset(f"test:hash:{i}", mapping={
                    "field1": f"value1_{i}",
                    "field2": f"value2_{i}",
                    "field3": f"value3_{i}"
                })
                self.client.hgetall(f"test:hash:{i}")
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_list_operations(self, iterations: int = 5000) -> PerformanceMetrics:
        """Test LIST operations performance"""
        metrics = PerformanceMetrics("Redis - LIST Operations")
        metrics.start()

        for i in range(iterations):
            try:
                start = time.time()
                self.client.lpush(f"test:list:{i}", f"item1_{i}", f"item2_{i}", f"item3_{i}")
                self.client.lrange(f"test:list:{i}", 0, -1)
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_sorted_set(self, iterations: int = 5000) -> PerformanceMetrics:
        """Test SORTED SET operations performance"""
        metrics = PerformanceMetrics("Redis - Sorted Set")
        metrics.start()

        for i in range(iterations):
            try:
                start = time.time()
                self.client.zadd(f"test:zset:{i}", {
                    f"member1_{i}": i,
                    f"member2_{i}": i + 1,
                    f"member3_{i}": i + 2
                })
                self.client.zrange(f"test:zset:{i}", 0, -1, withscores=True)
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def test_pipeline(self, iterations: int = 5000) -> PerformanceMetrics:
        """Test pipeline performance"""
        metrics = PerformanceMetrics("Redis - Pipeline")
        metrics.start()

        for i in range(iterations):
            try:
                start = time.time()
                pipe = self.client.pipeline()
                pipe.set(f"test:pipe:{i}:1", f"value1_{i}")
                pipe.set(f"test:pipe:{i}:2", f"value2_{i}")
                pipe.set(f"test:pipe:{i}:3", f"value3_{i}")
                pipe.get(f"test:pipe:{i}:1")
                pipe.get(f"test:pipe:{i}:2")
                pipe.get(f"test:pipe:{i}:3")
                pipe.execute()
                end = time.time()
                metrics.add_response_time((end - start) * 1000)
            except Exception as e:
                metrics.add_error(str(e))

        metrics.end()
        return metrics

    def teardown(self):
        """Close Redis connection and cleanup"""
        if self.client:
            # Clean up test keys
            try:
                for pattern in ["test:*"]:
                    keys = self.client.keys(pattern)
                    if keys:
                        self.client.delete(*keys)
            except:
                pass
            self.client.close()
            print("✅ Redis connection closed")


def print_metric_summary(metrics: PerformanceMetrics):
    """Print formatted metric summary"""
    summary = metrics.get_summary()

    print(f"\n{'=' * 70}")
    print(f"Test: {summary['test_name']}")
    print(f"{'=' * 70}")

    if summary['status'] == 'failed':
        print(f"❌ Status: FAILED")
        print(f"   Error: {summary.get('error', 'Unknown error')}")
        return

    print(f"✅ Status: {summary['status'].upper()}")
    print(f"   Total Operations: {summary['total_operations']:,}")
    print(f"   Total Time: {summary['total_time_seconds']}s")
    print(f"   Operations/Second: {summary['operations_per_second']:,}")

    print(f"\n📊 Response Times (ms):")
    print(f"   Min:    {summary['response_times_ms']['min']}")
    print(f"   Max:    {summary['response_times_ms']['max']}")
    print(f"   Mean:   {summary['response_times_ms']['mean']}")
    print(f"   Median: {summary['response_times_ms']['median']}")
    if summary['response_times_ms']['p95']:
        print(f"   P95:    {summary['response_times_ms']['p95']}")
    if summary['response_times_ms']['p99']:
        print(f"   P99:    {summary['response_times_ms']['p99']}")

    if summary['error_count'] > 0:
        print(f"\n⚠️  Errors: {summary['error_count']} ({summary['error_rate_percent']}%)")


def run_postgres_tests(iterations: int) -> List[Dict[str, Any]]:
    """Run all PostgreSQL performance tests"""
    if not POSTGRES_AVAILABLE:
        print("⏭️  Skipping PostgreSQL tests (psycopg2 not installed)")
        return []

    print("\n" + "=" * 70)
    print("🐘 PostgreSQL Performance Tests")
    print("=" * 70)

    test = PostgreSQLPerformanceTest(POSTGRES_CONFIG)
    if not test.setup():
        return []

    results = []

    # Simple SELECT
    print("\n1️⃣  Running Simple SELECT test...")
    metrics = test.test_simple_select(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Complex Query
    print("\n2️⃣  Running Complex Query test...")
    metrics = test.test_complex_query(iterations // 2)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # INSERT
    print("\n3️⃣  Running INSERT test...")
    metrics = test.test_insert_performance(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Index Performance
    print("\n4️⃣  Running Index Performance test...")
    metrics = test.test_index_performance(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Connection Pool
    print("\n5️⃣  Running Connection Pool test...")
    metrics = test.test_connection_pool_performance(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    test.teardown()
    return results


def run_mongodb_tests(iterations: int) -> List[Dict[str, Any]]:
    """Run all MongoDB performance tests"""
    if not MONGODB_AVAILABLE:
        print("⏭️  Skipping MongoDB tests (pymongo not installed)")
        return []

    print("\n" + "=" * 70)
    print("🍃 MongoDB Performance Tests")
    print("=" * 70)

    test = MongoDBPerformanceTest(MONGODB_CONFIG)
    if not test.setup():
        return []

    results = []

    # Simple Find
    print("\n1️⃣  Running Simple Find test...")
    metrics = test.test_simple_find(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Aggregation
    print("\n2️⃣  Running Aggregation test...")
    metrics = test.test_aggregation(iterations // 2)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # INSERT
    print("\n3️⃣  Running INSERT test...")
    metrics = test.test_insert_performance(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Bulk INSERT
    print("\n4️⃣  Running Bulk INSERT test...")
    metrics = test.test_bulk_insert(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Index Performance
    print("\n5️⃣  Running Index Performance test...")
    metrics = test.test_index_performance(iterations)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    test.teardown()
    return results


def run_redis_tests(iterations: int) -> List[Dict[str, Any]]:
    """Run all Redis performance tests"""
    if not REDIS_AVAILABLE:
        print("⏭️  Skipping Redis tests (redis not installed)")
        return []

    print("\n" + "=" * 70)
    print("🔴 Redis Performance Tests")
    print("=" * 70)

    test = RedisPerformanceTest(REDIS_CONFIG)
    if not test.setup():
        return []

    results = []

    # GET/SET
    print("\n1️⃣  Running GET/SET test...")
    metrics = test.test_get_set(iterations * 10)  # Redis is fast, more iterations
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # HASH Operations
    print("\n2️⃣  Running HASH Operations test...")
    metrics = test.test_hash_operations(iterations * 5)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # LIST Operations
    print("\n3️⃣  Running LIST Operations test...")
    metrics = test.test_list_operations(iterations * 5)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Sorted Set
    print("\n4️⃣  Running Sorted Set test...")
    metrics = test.test_sorted_set(iterations * 5)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    # Pipeline
    print("\n5️⃣  Running Pipeline test...")
    metrics = test.test_pipeline(iterations * 5)
    print_metric_summary(metrics)
    results.append(metrics.get_summary())

    test.teardown()
    return results


def generate_report(all_results: Dict[str, List[Dict[str, Any]]], output_file: str):
    """Generate JSON performance report"""
    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "summary": {
            "postgres_tests": len(all_results.get('postgres', [])),
            "mongodb_tests": len(all_results.get('mongodb', [])),
            "redis_tests": len(all_results.get('redis', [])),
        },
        "results": all_results
    }

    with open(output_file, 'w') as f:
        json.dump(report, f, indent=2)

    print(f"\n📄 Performance report saved to: {output_file}")


def main():
    parser = argparse.ArgumentParser(description='Database Performance Testing Suite')
    parser.add_argument('--db', choices=['all', 'postgres', 'mongodb', 'redis'], default='all',
                        help='Database to test (default: all)')
    parser.add_argument('--iterations', type=int, default=1000,
                        help='Number of iterations per test (default: 1000)')
    parser.add_argument('--report', action='store_true',
                        help='Generate JSON report')
    parser.add_argument('--output', type=str, default='db-performance-report.json',
                        help='Output file for report (default: db-performance-report.json)')

    args = parser.parse_args()

    print("\n" + "=" * 70)
    print("🚀 Soundcore KCP - Database Performance Testing Suite")
    print("=" * 70)
    print(f"Configuration:")
    print(f"  - Target: {args.db}")
    print(f"  - Iterations: {args.iterations}")
    print(f"  - Report: {'Yes' if args.report else 'No'}")

    all_results = {}

    # Run tests based on selection
    if args.db in ['all', 'postgres']:
        all_results['postgres'] = run_postgres_tests(args.iterations)

    if args.db in ['all', 'mongodb']:
        all_results['mongodb'] = run_mongodb_tests(args.iterations)

    if args.db in ['all', 'redis']:
        all_results['redis'] = run_redis_tests(args.iterations)

    # Generate report if requested
    if args.report:
        generate_report(all_results, args.output)

    print("\n" + "=" * 70)
    print("✅ All tests completed!")
    print("=" * 70)


if __name__ == "__main__":
    main()
