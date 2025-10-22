/**
 * K6 Load Testing Script for Soundcore KCP Backend
 *
 * This script performs load testing on the backend services to ensure they can
 * handle the target 10,000 QPS (Queries Per Second) under various load scenarios.
 *
 * Installation:
 *   brew install k6  (macOS)
 *   or download from https://k6.io/docs/getting-started/installation/
 *
 * Run tests:
 *   k6 run load_test.js                    # Default smoke test
 *   k6 run load_test.js -e TEST=load      # Load test
 *   k6 run load_test.js -e TEST=stress    # Stress test
 *   k6 run load_test.js -e TEST=spike     # Spike test
 *
 * View results:
 *   k6 run --out json=results.json load_test.js
 *   k6 run --out influxdb=http://localhost:8086/k6 load_test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const requestDuration = new Trend('request_duration');
const successfulRequests = new Counter('successful_requests');
const failedRequests = new Counter('failed_requests');

// API endpoints configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost';
const SERVICES = {
    knowledge: `${BASE_URL}:8001`,
    content: `${BASE_URL}:8002`,
    support: `${BASE_URL}:8003`,
    analytics: `${BASE_URL}:8004`,
    auth: `${BASE_URL}:8005`,
};

// Test scenarios configuration
const scenarios = {
    smoke: {
        executor: 'constant-vus',
        vus: 10,
        duration: '1m',
    },
    load: {
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [
            { duration: '2m', target: 100 },  // Ramp up to 100 users
            { duration: '5m', target: 100 },  // Stay at 100 users
            { duration: '2m', target: 200 },  // Ramp to 200 users
            { duration: '5m', target: 200 },  // Stay at 200 users
            { duration: '2m', target: 0 },    // Ramp down to 0 users
        ],
    },
    stress: {
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [
            { duration: '2m', target: 100 },   // Below normal load
            { duration: '5m', target: 100 },
            { duration: '2m', target: 200 },   // Normal load
            { duration: '5m', target: 200 },
            { duration: '2m', target: 300 },   // Around breaking point
            { duration: '5m', target: 300 },
            { duration: '2m', target: 400 },   // Beyond breaking point
            { duration: '5m', target: 400 },
            { duration: '10m', target: 0 },    // Recovery
        ],
    },
    spike: {
        executor: 'ramping-vus',
        startVUs: 0,
        stages: [
            { duration: '10s', target: 100 },  // Fast ramp-up to high load
            { duration: '1m', target: 100 },
            { duration: '10s', target: 1000 }, // Spike to very high load
            { duration: '3m', target: 1000 },  // Stay at high load
            { duration: '10s', target: 100 },  // Quick ramp-down
            { duration: '3m', target: 100 },
            { duration: '10s', target: 0 },    // Ramp-down to zero
        ],
    },
    qps_10k: {
        executor: 'constant-arrival-rate',
        rate: 10000,          // 10,000 requests per second
        timeUnit: '1s',
        duration: '5m',
        preAllocatedVUs: 500,
        maxVUs: 1000,
    },
};

// Select test scenario based on environment variable
const testType = __ENV.TEST || 'smoke';
export const options = {
    scenarios: {
        [testType]: scenarios[testType],
    },
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
        'http_req_duration{name:knowledge}': ['p(95)<300'],
        'http_req_duration{name:analytics}': ['p(95)<500'],
    },
};

// Test data
const testKnowledgePayload = {
    title: 'Load Test Knowledge Item',
    content: 'This is a load test knowledge item',
    type: 'FAQ',
    product_id: 'test-product',
    language: 'EN',
    tags: ['test', 'load'],
    status: 'DRAFT',
};

/**
 * Main test function - executed for each virtual user iteration
 */
export default function () {
    const testScenarios = [
        testKnowledgeServiceHealth,
        testKnowledgeServiceList,
        testKnowledgeServiceSearch,
        testKnowledgeServiceStats,
        testAnalyticsServiceOverview,
        testAnalyticsServiceContent,
        testSupportServiceConversations,
    ];

    // Randomly select a test scenario to simulate real-world usage patterns
    const scenario = testScenarios[Math.floor(Math.random() * testScenarios.length)];
    scenario();

    // Sleep between requests to simulate think time
    sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}

/**
 * Test Knowledge Service Health Endpoint
 */
function testKnowledgeServiceHealth() {
    const res = http.get(`${SERVICES.knowledge}/health`, {
        tags: { name: 'knowledge-health' },
    });

    check(res, {
        'knowledge health status 200': (r) => r.status === 200,
        'knowledge health response time < 100ms': (r) => r.timings.duration < 100,
    }) || errorRate.add(1);

    requestDuration.add(res.timings.duration, { endpoint: 'knowledge-health' });
    res.status === 200 ? successfulRequests.add(1) : failedRequests.add(1);
}

/**
 * Test Knowledge Service List Items
 */
function testKnowledgeServiceList() {
    const params = {
        page: 1,
        page_size: 10,
    };

    const res = http.get(`${SERVICES.knowledge}/api/v1/knowledge/items?${http.toQueryString(params)}`, {
        tags: { name: 'knowledge-list' },
    });

    check(res, {
        'knowledge list status 200': (r) => r.status === 200,
        'knowledge list has items': (r) => JSON.parse(r.body).items !== undefined,
        'knowledge list response time < 300ms': (r) => r.timings.duration < 300,
    }) || errorRate.add(1);

    requestDuration.add(res.timings.duration, { endpoint: 'knowledge-list' });
    res.status === 200 ? successfulRequests.add(1) : failedRequests.add(1);
}

/**
 * Test Knowledge Service Search
 */
function testKnowledgeServiceSearch() {
    const params = {
        q: 'bluetooth',
        limit: 5,
    };

    const res = http.get(`${SERVICES.knowledge}/api/v1/knowledge/search?${http.toQueryString(params)}`, {
        tags: { name: 'knowledge-search' },
    });

    check(res, {
        'knowledge search status 200': (r) => r.status === 200,
        'knowledge search has results': (r) => JSON.parse(r.body).results !== undefined,
        'knowledge search response time < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);

    requestDuration.add(res.timings.duration, { endpoint: 'knowledge-search' });
    res.status === 200 ? successfulRequests.add(1) : failedRequests.add(1);
}

/**
 * Test Knowledge Service Statistics
 */
function testKnowledgeServiceStats() {
    const res = http.get(`${SERVICES.knowledge}/api/v1/knowledge/stats`, {
        tags: { name: 'knowledge-stats' },
    });

    check(res, {
        'knowledge stats status 200': (r) => r.status === 200,
        'knowledge stats has total_items': (r) => JSON.parse(r.body).total_items !== undefined,
        'knowledge stats response time < 200ms': (r) => r.timings.duration < 200,
    }) || errorRate.add(1);

    requestDuration.add(res.timings.duration, { endpoint: 'knowledge-stats' });
    res.status === 200 ? successfulRequests.add(1) : failedRequests.add(1);
}

/**
 * Test Analytics Service Overview
 */
function testAnalyticsServiceOverview() {
    const res = http.get(`${SERVICES.analytics}/api/v1/analytics/overview`, {
        tags: { name: 'analytics-overview' },
    });

    check(res, {
        'analytics overview status 200': (r) => r.status === 200,
        'analytics overview response time < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);

    requestDuration.add(res.timings.duration, { endpoint: 'analytics-overview' });
    res.status === 200 ? successfulRequests.add(1) : failedRequests.add(1);
}

/**
 * Test Analytics Service Content Metrics
 */
function testAnalyticsServiceContent() {
    const res = http.get(`${SERVICES.analytics}/api/v1/analytics/content`, {
        tags: { name: 'analytics-content' },
    });

    check(res, {
        'analytics content status 200': (r) => r.status === 200,
        'analytics content response time < 500ms': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);

    requestDuration.add(res.timings.duration, { endpoint: 'analytics-content' });
    res.status === 200 ? successfulRequests.add(1) : failedRequests.add(1);
}

/**
 * Test Support Service Conversations
 */
function testSupportServiceConversations() {
    const params = {
        page: 1,
        page_size: 10,
    };

    const res = http.get(`${SERVICES.support}/api/v1/support/conversations?${http.toQueryString(params)}`, {
        tags: { name: 'support-conversations' },
    });

    check(res, {
        'support conversations status 200': (r) => r.status === 200 || r.status === 404,
        'support conversations response time < 300ms': (r) => r.timings.duration < 300,
    }) || errorRate.add(1);

    requestDuration.add(res.timings.duration, { endpoint: 'support-conversations' });
    res.status === 200 ? successfulRequests.add(1) : failedRequests.add(1);
}

/**
 * Setup function - runs once before the test
 */
export function setup() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Starting ${testType.toUpperCase()} test`);
    console.log(`Target services: ${Object.keys(SERVICES).join(', ')}`);
    console.log(`${'='.repeat(60)}\n`);

    // Warm up services
    Object.entries(SERVICES).forEach(([name, url]) => {
        try {
            http.get(`${url}/health`, { timeout: '5s' });
            console.log(`✅ ${name} service is ready`);
        } catch (e) {
            console.log(`⚠️  ${name} service may not be available`);
        }
    });

    return { startTime: new Date().toISOString() };
}

/**
 * Teardown function - runs once after the test
 */
export function teardown(data) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test completed`);
    console.log(`Started at: ${data.startTime}`);
    console.log(`Ended at: ${new Date().toISOString()}`);
    console.log(`${'='.repeat(60)}\n`);
}

/**
 * Handle summary statistics
 */
export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }),
        'summary.json': JSON.stringify(data, null, 2),
    };
}

/**
 * Text summary helper
 */
function textSummary(data, options = {}) {
    const indent = options.indent || '';
    const enableColors = options.enableColors !== false;

    let summary = '\n' + '='.repeat(60) + '\n';
    summary += 'LOAD TEST SUMMARY\n';
    summary += '='.repeat(60) + '\n\n';

    // VUs and duration
    const metrics = data.metrics;
    summary += `${indent}Virtual Users: ${data.state.testRunDurationMs ? data.options.scenarios[testType].vus || 'variable' : 'N/A'}\n`;
    summary += `${indent}Duration: ${(data.state.testRunDurationMs / 1000 / 60).toFixed(2)} minutes\n\n`;

    // Request metrics
    if (metrics.http_reqs) {
        summary += `${indent}Total Requests: ${metrics.http_reqs.values.count}\n`;
        summary += `${indent}Requests/sec: ${metrics.http_reqs.values.rate.toFixed(2)}\n`;
    }

    if (metrics.http_req_duration) {
        summary += `${indent}Avg Duration: ${metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
        summary += `${indent}P95 Duration: ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;
        summary += `${indent}P99 Duration: ${metrics.http_req_duration.values['p(99)'].toFixed(2)}ms\n`;
    }

    if (metrics.http_req_failed) {
        const failRate = (metrics.http_req_failed.values.rate * 100).toFixed(2);
        summary += `${indent}Failed Requests: ${failRate}%\n`;
    }

    // Custom metrics
    if (metrics.successful_requests) {
        summary += `\n${indent}✅ Successful: ${metrics.successful_requests.values.count}\n`;
    }
    if (metrics.failed_requests && metrics.failed_requests.values.count > 0) {
        summary += `${indent}❌ Failed: ${metrics.failed_requests.values.count}\n`;
    }

    summary += '\n' + '='.repeat(60) + '\n';

    return summary;
}
