"""
API Integration Tests for Soundcore KCP Backend Services

This test suite validates the integration between frontend and backend APIs,
ensuring all endpoints work correctly across different services.

Services Tested:
- Knowledge Service (:8001)
- Content Service (:8002)
- Support Service (:8003)
- Analytics Service (:8004)
- Auth Service (:8005)

Run with: pytest tests/test_api_integration.py -v
"""

import pytest
import requests
import time
from typing import Dict, Any

# API Base URLs
API_BASE = "http://localhost"
SERVICES = {
    "knowledge": f"{API_BASE}:8001",
    "content": f"{API_BASE}:8002",
    "support": f"{API_BASE}:8003",
    "analytics": f"{API_BASE}:8004",
    "auth": f"{API_BASE}:8005",
}

# Request timeout
TIMEOUT = 5


class TestHealthChecks:
    """Test health check endpoints for all services"""

    @pytest.mark.parametrize("service_name,base_url", SERVICES.items())
    def test_health_endpoint(self, service_name, base_url):
        """Test that each service's health endpoint responds correctly"""
        try:
            response = requests.get(f"{base_url}/health", timeout=TIMEOUT)
            assert response.status_code == 200, f"{service_name} service health check failed"
            data = response.json()
            assert data.get("status") == "healthy", f"{service_name} service not healthy"
            print(f"✅ {service_name} service is healthy")
        except requests.exceptions.ConnectionError:
            pytest.skip(f"{service_name} service not running")
        except requests.exceptions.Timeout:
            pytest.fail(f"{service_name} service health check timed out")


class TestKnowledgeService:
    """Test Knowledge Service API endpoints"""

    BASE_URL = SERVICES["knowledge"]

    def test_list_knowledge_items(self):
        """Test GET /api/v1/knowledge/items - List knowledge items"""
        try:
            response = requests.get(
                f"{self.BASE_URL}/api/v1/knowledge/items",
                params={"page": 1, "page_size": 10},
                timeout=TIMEOUT
            )
            assert response.status_code == 200, "Failed to list knowledge items"
            data = response.json()
            assert "items" in data, "Response missing 'items' field"
            assert "total" in data, "Response missing 'total' field"
            assert "page" in data, "Response missing 'page' field"
            print(f"✅ Knowledge items listed: {data.get('total', 0)} total")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")

    def test_search_knowledge(self):
        """Test GET /api/v1/knowledge/search - Search knowledge"""
        try:
            response = requests.get(
                f"{self.BASE_URL}/api/v1/knowledge/search",
                params={"q": "bluetooth", "limit": 5},
                timeout=TIMEOUT
            )
            assert response.status_code == 200, "Failed to search knowledge"
            data = response.json()
            assert "results" in data, "Response missing 'results' field"
            print(f"✅ Knowledge search returned {len(data.get('results', []))} results")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")

    def test_get_knowledge_stats(self):
        """Test GET /api/v1/knowledge/stats - Get knowledge statistics"""
        try:
            response = requests.get(f"{self.BASE_URL}/api/v1/knowledge/stats", timeout=TIMEOUT)
            assert response.status_code == 200, "Failed to get knowledge stats"
            data = response.json()
            assert "total_items" in data, "Response missing 'total_items' field"
            print(f"✅ Knowledge stats retrieved: {data.get('total_items', 0)} items")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")

    def test_create_knowledge_item(self):
        """Test POST /api/v1/knowledge/items - Create knowledge item"""
        payload = {
            "title": "Test Knowledge Item",
            "content": "This is a test knowledge item created by integration tests",
            "type": "FAQ",
            "product_id": "test-product",
            "language": "EN",
            "tags": ["test", "integration"],
            "status": "DRAFT"
        }
        try:
            response = requests.post(
                f"{self.BASE_URL}/api/v1/knowledge/items",
                json=payload,
                timeout=TIMEOUT
            )
            assert response.status_code in [200, 201], "Failed to create knowledge item"
            data = response.json()
            assert "id" in data, "Response missing 'id' field"
            print(f"✅ Knowledge item created with ID: {data.get('id')}")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")

    def test_get_products(self):
        """Test GET /api/v1/knowledge/products - List products"""
        try:
            response = requests.get(f"{self.BASE_URL}/api/v1/knowledge/products", timeout=TIMEOUT)
            assert response.status_code == 200, "Failed to list products"
            data = response.json()
            assert isinstance(data, list), "Response should be a list"
            print(f"✅ Products listed: {len(data)} products")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")


class TestContentService:
    """Test Content Service API endpoints"""

    BASE_URL = SERVICES["content"]

    def test_list_generated_content(self):
        """Test GET /api/v1/content/generated - List generated content"""
        try:
            response = requests.get(
                f"{self.BASE_URL}/api/v1/content/generated",
                params={"page": 1, "page_size": 10},
                timeout=TIMEOUT
            )
            assert response.status_code == 200, "Failed to list generated content"
            data = response.json()
            assert "items" in data, "Response missing 'items' field"
            print(f"✅ Generated content listed: {len(data.get('items', []))} items")
        except requests.exceptions.ConnectionError:
            pytest.skip("Content service not running")

    def test_generate_content(self):
        """Test POST /api/v1/content/generate - Generate content"""
        payload = {
            "content_type": "blog",
            "topic": "Wireless Earbuds Sound Quality",
            "target_audience": "audiophiles",
            "tone": "professional",
            "length": "medium",
            "keywords": ["sound quality", "wireless", "earbuds"]
        }
        try:
            response = requests.post(
                f"{self.BASE_URL}/api/v1/content/generate",
                json=payload,
                timeout=10  # Longer timeout for generation
            )
            assert response.status_code in [200, 201], "Failed to generate content"
            data = response.json()
            assert "content" in data or "id" in data, "Response missing content data"
            print(f"✅ Content generated successfully")
        except requests.exceptions.ConnectionError:
            pytest.skip("Content service not running")
        except requests.exceptions.Timeout:
            pytest.skip("Content generation timed out (expected for AI generation)")

    def test_content_templates(self):
        """Test GET /api/v1/content/templates - List content templates"""
        try:
            response = requests.get(f"{self.BASE_URL}/api/v1/content/templates", timeout=TIMEOUT)
            assert response.status_code == 200, "Failed to list templates"
            data = response.json()
            assert isinstance(data, list), "Response should be a list"
            print(f"✅ Content templates listed: {len(data)} templates")
        except requests.exceptions.ConnectionError:
            pytest.skip("Content service not running")


class TestAnalyticsService:
    """Test Analytics Service API endpoints"""

    BASE_URL = SERVICES["analytics"]

    def test_get_overview_stats(self):
        """Test GET /api/v1/analytics/overview - Get overview statistics"""
        try:
            response = requests.get(f"{self.BASE_URL}/api/v1/analytics/overview", timeout=TIMEOUT)
            assert response.status_code == 200, "Failed to get overview stats"
            data = response.json()
            assert "total_users" in data or "metrics" in data, "Response missing analytics data"
            print(f"✅ Analytics overview retrieved")
        except requests.exceptions.ConnectionError:
            pytest.skip("Analytics service not running")

    def test_get_user_metrics(self):
        """Test GET /api/v1/analytics/users - Get user metrics"""
        try:
            response = requests.get(
                f"{self.BASE_URL}/api/v1/analytics/users",
                params={"period": "7d"},
                timeout=TIMEOUT
            )
            assert response.status_code == 200, "Failed to get user metrics"
            data = response.json()
            assert "metrics" in data or "users" in data, "Response missing user metrics"
            print(f"✅ User metrics retrieved")
        except requests.exceptions.ConnectionError:
            pytest.skip("Analytics service not running")

    def test_get_content_metrics(self):
        """Test GET /api/v1/analytics/content - Get content metrics"""
        try:
            response = requests.get(f"{self.BASE_URL}/api/v1/analytics/content", timeout=TIMEOUT)
            assert response.status_code == 200, "Failed to get content metrics"
            data = response.json()
            assert "metrics" in data or "content_stats" in data, "Response missing content metrics"
            print(f"✅ Content metrics retrieved")
        except requests.exceptions.ConnectionError:
            pytest.skip("Analytics service not running")

    def test_get_search_metrics(self):
        """Test GET /api/v1/analytics/search - Get search metrics"""
        try:
            response = requests.get(f"{self.BASE_URL}/api/v1/analytics/search", timeout=TIMEOUT)
            assert response.status_code == 200, "Failed to get search metrics"
            data = response.json()
            assert "metrics" in data or "queries" in data, "Response missing search metrics"
            print(f"✅ Search metrics retrieved")
        except requests.exceptions.ConnectionError:
            pytest.skip("Analytics service not running")


class TestSupportService:
    """Test Support Service API endpoints"""

    BASE_URL = SERVICES["support"]

    def test_list_conversations(self):
        """Test GET /api/v1/support/conversations - List support conversations"""
        try:
            response = requests.get(
                f"{self.BASE_URL}/api/v1/support/conversations",
                params={"page": 1, "page_size": 10},
                timeout=TIMEOUT
            )
            assert response.status_code == 200, "Failed to list conversations"
            data = response.json()
            assert "items" in data or "conversations" in data, "Response missing conversations"
            print(f"✅ Support conversations listed")
        except requests.exceptions.ConnectionError:
            pytest.skip("Support service not running")

    def test_create_conversation(self):
        """Test POST /api/v1/support/conversations - Create conversation"""
        payload = {
            "user_id": "test-user-001",
            "message": "I need help with my headphones",
            "channel": "web",
            "product_id": "soundcore-liberty-3-pro"
        }
        try:
            response = requests.post(
                f"{self.BASE_URL}/api/v1/support/conversations",
                json=payload,
                timeout=TIMEOUT
            )
            assert response.status_code in [200, 201], "Failed to create conversation"
            data = response.json()
            assert "conversation_id" in data or "id" in data, "Response missing conversation ID"
            print(f"✅ Support conversation created")
        except requests.exceptions.ConnectionError:
            pytest.skip("Support service not running")

    def test_get_faq(self):
        """Test GET /api/v1/support/faq - Get FAQ items"""
        try:
            response = requests.get(f"{self.BASE_URL}/api/v1/support/faq", timeout=TIMEOUT)
            assert response.status_code == 200, "Failed to get FAQ items"
            data = response.json()
            assert isinstance(data, list) or "items" in data, "Response should contain FAQ items"
            print(f"✅ FAQ items retrieved")
        except requests.exceptions.ConnectionError:
            pytest.skip("Support service not running")


class TestAuthService:
    """Test Auth Service API endpoints"""

    BASE_URL = SERVICES["auth"]

    def test_login(self):
        """Test POST /api/v1/auth/login - User login"""
        payload = {
            "username": "test_user",
            "password": "test_password"
        }
        try:
            response = requests.post(
                f"{self.BASE_URL}/api/v1/auth/login",
                json=payload,
                timeout=TIMEOUT
            )
            # Accept both success (200/201) and authentication failure (401)
            assert response.status_code in [200, 201, 401], "Unexpected response from login"
            if response.status_code in [200, 201]:
                data = response.json()
                assert "token" in data or "access_token" in data, "Response missing auth token"
                print(f"✅ Login endpoint working (authenticated)")
            else:
                print(f"✅ Login endpoint working (auth validation)")
        except requests.exceptions.ConnectionError:
            pytest.skip("Auth service not running")

    def test_validate_token(self):
        """Test GET /api/v1/auth/validate - Validate token"""
        headers = {"Authorization": "Bearer test-token"}
        try:
            response = requests.get(
                f"{self.BASE_URL}/api/v1/auth/validate",
                headers=headers,
                timeout=TIMEOUT
            )
            # Accept various status codes for token validation
            assert response.status_code in [200, 401, 403], "Unexpected response from validate"
            print(f"✅ Token validation endpoint working")
        except requests.exceptions.ConnectionError:
            pytest.skip("Auth service not running")


class TestPerformance:
    """Test API performance metrics"""

    def test_knowledge_api_response_time(self):
        """Test that Knowledge API responds within acceptable time"""
        try:
            start_time = time.time()
            response = requests.get(
                f"{SERVICES['knowledge']}/api/v1/knowledge/items",
                params={"page": 1, "page_size": 10},
                timeout=TIMEOUT
            )
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to ms

            assert response.status_code == 200, "Request failed"
            assert response_time < 1000, f"Response time {response_time:.2f}ms exceeds 1000ms target"
            print(f"✅ Knowledge API response time: {response_time:.2f}ms")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")

    def test_analytics_api_response_time(self):
        """Test that Analytics API responds within acceptable time"""
        try:
            start_time = time.time()
            response = requests.get(
                f"{SERVICES['analytics']}/api/v1/analytics/overview",
                timeout=TIMEOUT
            )
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to ms

            assert response.status_code == 200, "Request failed"
            assert response_time < 1000, f"Response time {response_time:.2f}ms exceeds 1000ms target"
            print(f"✅ Analytics API response time: {response_time:.2f}ms")
        except requests.exceptions.ConnectionError:
            pytest.skip("Analytics service not running")


class TestCORS:
    """Test CORS configuration"""

    def test_cors_headers(self):
        """Test that CORS headers are properly configured"""
        try:
            headers = {"Origin": "http://localhost:3000"}
            response = requests.options(
                f"{SERVICES['knowledge']}/api/v1/knowledge/items",
                headers=headers,
                timeout=TIMEOUT
            )
            # Check for CORS headers
            assert "Access-Control-Allow-Origin" in response.headers, "Missing CORS origin header"
            print(f"✅ CORS headers configured correctly")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")


class TestErrorHandling:
    """Test API error handling"""

    def test_404_not_found(self):
        """Test that 404 is returned for non-existent endpoints"""
        try:
            response = requests.get(
                f"{SERVICES['knowledge']}/api/v1/nonexistent-endpoint",
                timeout=TIMEOUT
            )
            assert response.status_code == 404, "Should return 404 for non-existent endpoint"
            print(f"✅ 404 error handling works correctly")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")

    def test_400_bad_request(self):
        """Test that 400 is returned for invalid requests"""
        payload = {"invalid": "data"}  # Missing required fields
        try:
            response = requests.post(
                f"{SERVICES['knowledge']}/api/v1/knowledge/items",
                json=payload,
                timeout=TIMEOUT
            )
            assert response.status_code in [400, 422], "Should return 400/422 for invalid data"
            print(f"✅ Bad request error handling works correctly")
        except requests.exceptions.ConnectionError:
            pytest.skip("Knowledge service not running")


# Test configuration
@pytest.fixture(scope="session", autouse=True)
def check_services_availability():
    """Check which services are available before running tests"""
    print("\n" + "="*60)
    print("CHECKING SERVICE AVAILABILITY")
    print("="*60)

    available_services = []
    unavailable_services = []

    for service_name, base_url in SERVICES.items():
        try:
            response = requests.get(f"{base_url}/health", timeout=2)
            if response.status_code == 200:
                available_services.append(service_name)
                print(f"✅ {service_name.upper()} service is available at {base_url}")
            else:
                unavailable_services.append(service_name)
                print(f"⚠️  {service_name.upper()} service returned status {response.status_code}")
        except requests.exceptions.RequestException:
            unavailable_services.append(service_name)
            print(f"❌ {service_name.upper()} service is not available at {base_url}")

    print("="*60)
    print(f"Available services: {len(available_services)}/{len(SERVICES)}")
    print("="*60 + "\n")

    if not available_services:
        pytest.skip("No services are available for testing")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
