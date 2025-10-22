#!/bin/bash

# ============================================================================
# Test All Backend Services
# Validates Python syntax for all microservices
# ============================================================================

echo "🧪 Testing Soundcore KCP Backend Services..."
echo "============================================="
echo ""

# Color codes
RED='\033[0:31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test a service
test_service() {
    local service_name=$1
    local service_path=$2

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -n "Testing $service_name... "

    if python3 -m py_compile "$service_path/main.py" 2>/dev/null; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        python3 -m py_compile "$service_path/main.py"
    fi
}

# Test core modules
echo "📦 Core Modules:"
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -n "Testing Config Module... "
if python3 -m py_compile config/settings.py 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -n "Testing Database Models... "
if python3 -m py_compile models/database.py models/knowledge.py 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAILED${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
echo ""

# Test microservices
echo "🚀 Microservices:"
test_service "Knowledge Service (8001)" "knowledge_service"
test_service "Content Service (8002)" "content_service"
test_service "Support Service (8003)" "support_service"
test_service "Analytics Service (8004)" "analytics_service"
test_service "Auth Service (8005)" "auth_service"
echo ""

# Summary
echo "============================================="
echo "📊 Test Summary:"
echo "   Total: $TOTAL_TESTS"
echo -e "   ${GREEN}Passed: $PASSED_TESTS${NC}"
if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "   ${RED}Failed: $FAILED_TESTS${NC}"
else
    echo -e "   ${GREEN}Failed: 0${NC}"
fi
echo "============================================="

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start Docker services: docker-compose up -d"
    echo "2. Wait for services to be healthy (2-3 minutes)"
    echo "3. Test endpoints:"
    echo "   - Knowledge:  curl http://localhost:8001/health"
    echo "   - Content:    curl http://localhost:8002/health"
    echo "   - Support:    curl http://localhost:8003/health"
    echo "   - Analytics:  curl http://localhost:8004/health"
    echo "   - Auth:       curl http://localhost:8005/health"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi
