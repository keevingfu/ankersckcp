#!/bin/bash

# API Integration Test Runner Script
# This script runs all API integration tests and generates reports

set -e

echo "========================================"
echo "API Integration Test Runner"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${GREEN}Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${GREEN}Installing test dependencies...${NC}"
pip install -q -r requirements.txt

echo ""
echo "========================================"
echo "Running API Integration Tests"
echo "========================================"
echo ""

# Run tests with different configurations
case "${1:-all}" in
    "quick")
        echo "Running quick health checks only..."
        pytest test_api_integration.py::TestHealthChecks -v
        ;;

    "knowledge")
        echo "Running Knowledge Service tests..."
        pytest test_api_integration.py::TestKnowledgeService -v
        ;;

    "content")
        echo "Running Content Service tests..."
        pytest test_api_integration.py::TestContentService -v
        ;;

    "analytics")
        echo "Running Analytics Service tests..."
        pytest test_api_integration.py::TestAnalyticsService -v
        ;;

    "support")
        echo "Running Support Service tests..."
        pytest test_api_integration.py::TestSupportService -v
        ;;

    "auth")
        echo "Running Auth Service tests..."
        pytest test_api_integration.py::TestAuthService -v
        ;;

    "performance")
        echo "Running Performance tests..."
        pytest test_api_integration.py::TestPerformance -v
        ;;

    "all")
        echo "Running all tests with coverage..."
        pytest test_api_integration.py \
            -v \
            --cov=../ \
            --cov-report=html \
            --cov-report=term \
            --html=report.html \
            --self-contained-html
        ;;

    "ci")
        echo "Running tests for CI/CD..."
        pytest test_api_integration.py \
            -v \
            --tb=short \
            --junit-xml=junit.xml \
            --html=report.html \
            --self-contained-html
        ;;

    *)
        echo -e "${RED}Unknown test suite: $1${NC}"
        echo "Available options: quick, knowledge, content, analytics, support, auth, performance, all, ci"
        exit 1
        ;;
esac

EXIT_CODE=$?

echo ""
echo "========================================"
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed!${NC}"
fi
echo "========================================"

# Deactivate virtual environment
deactivate

exit $EXIT_CODE
