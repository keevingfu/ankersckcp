# Soundcore KCP - API Documentation

## 📚 Overview

This directory contains tools and documentation for generating comprehensive API documentation for all Soundcore KCP backend microservices.

**Supported Documentation Formats**:
- 🌐 **Swagger UI** - Interactive API testing interface
- 📗 **Redoc** - Clean, responsive API documentation
- 📄 **Markdown** - Git-friendly documentation format
- 📋 **OpenAPI JSON** - Standard API specification

**Covered Services**:
1. **Knowledge Service** (`:8001`) - Knowledge base, RAG engine, semantic search
2. **Content Service** (`:8002`) - AI content generation, multi-channel publishing
3. **Support Service** (`:8003`) - Customer support, conversation management
4. **Analytics Service** (`:8004`) - Analytics, metrics, reporting
5. **Auth Service** (`:8005`) - Authentication, authorization, user management

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements-docs.txt
```

### 2. Ensure Services are Running

```bash
# Check service health
curl http://localhost:8001/health  # Knowledge Service
curl http://localhost:8002/health  # Content Service
curl http://localhost:8003/health  # Support Service
curl http://localhost:8004/health  # Analytics Service
curl http://localhost:8005/health  # Auth Service
```

### 3. Generate Documentation

```bash
# Generate docs for all services
python generate_api_docs.py

# Generate docs for specific service
python generate_api_docs.py --service knowledge

# Custom output directory
python generate_api_docs.py --output ./custom-docs
```

### 4. View Documentation

```bash
# Serve with HTTP server
cd api-docs
python -m http.server 8080

# Open in browser
open http://localhost:8080
```

**Generated Files**:
- `api-docs/index.html` - Unified API portal (start here!)
- `api-docs/{service}-swagger.html` - Swagger UI for each service
- `api-docs/{service}-redoc.html` - Redoc for each service
- `api-docs/{service}-api.md` - Markdown documentation
- `api-docs/{service}-openapi.json` - OpenAPI 3.0 specification

---

## 📁 Directory Structure

```
backend/docs/
├── README.md                       # This file
├── generate_api_docs.py            # Main documentation generator script
├── requirements-docs.txt           # Python dependencies
├── API_DOCUMENTATION_GUIDE.md      # Comprehensive usage guide
└── api-docs/                       # Generated documentation (after running script)
    ├── index.html                  # Unified API portal
    ├── knowledge-swagger.html      # Knowledge Service Swagger UI
    ├── knowledge-redoc.html        # Knowledge Service Redoc
    ├── knowledge-api.md            # Knowledge Service Markdown
    ├── knowledge-openapi.json      # Knowledge Service OpenAPI spec
    ├── content-swagger.html        # Content Service docs
    ├── content-redoc.html
    ├── content-api.md
    ├── content-openapi.json
    └── ... (similar for other services)
```

---

## 🔧 Features

### Automated Documentation Generation
- ✅ Extracts OpenAPI 3.0 specs from running FastAPI services
- ✅ Generates multiple documentation formats
- ✅ Creates unified multi-service API portal
- ✅ Supports selective service documentation
- ✅ Customizable output directory

### Documentation Formats

#### 1. Swagger UI (`{service}-swagger.html`)
- Interactive API testing
- Try API endpoints directly in browser
- Authentication support (Bearer Token, OAuth)
- Real-time request/response inspection

#### 2. Redoc (`{service}-redoc.html`)
- Clean three-column layout
- Responsive design
- Complete API reference
- Deep linking support

#### 3. Markdown (`{service}-api.md`)
- Git-friendly format
- GitHub/GitLab preview support
- Full-text searchable
- Easy to integrate into wikis

#### 4. OpenAPI JSON (`{service}-openapi.json`)
- Standard OpenAPI 3.0 specification
- Tool integration (Postman, Insomnia)
- SDK generation support
- API gateway configuration

### Unified API Portal
- Beautiful, responsive design
- All services in one place
- Service statistics dashboard
- Quick links to all documentation formats

---

## 📖 Usage Examples

### Example 1: Generate All Documentation

```bash
python generate_api_docs.py
```

**Output**:
```
======================================================================
📚 Soundcore KCP - API Documentation Generator
======================================================================
Output directory: /Users/cavin/Desktop/dev/ankersckcp/backend/docs/api-docs

======================================================================
📚 Generating documentation for Knowledge Service
======================================================================
✅ Fetched OpenAPI spec for Knowledge Service
📄 Saved OpenAPI JSON: api-docs/knowledge-openapi.json
📄 Generated Swagger UI: api-docs/knowledge-swagger.html
📄 Generated Redoc: api-docs/knowledge-redoc.html
📄 Generated Markdown docs: api-docs/knowledge-api.md
✅ Documentation generated for knowledge

... (similar for other services)

======================================================================
🌐 Generating Unified API Portal
======================================================================
📄 Generated unified portal: api-docs/index.html
🌐 Open in browser: file:///Users/cavin/Desktop/dev/ankersckcp/backend/docs/api-docs/index.html

======================================================================
✅ Documentation generation complete!
📊 Generated docs for 5 service(s)
📂 Output directory: /Users/cavin/Desktop/dev/ankersckcp/backend/docs/api-docs
======================================================================
```

### Example 2: Generate Documentation for Specific Service

```bash
# Only Knowledge Service
python generate_api_docs.py --service knowledge

# Only Content Service
python generate_api_docs.py --service content
```

### Example 3: Custom Output Directory

```bash
# Output to project root docs folder
python generate_api_docs.py --output ../../docs/api

# Output to custom directory
python generate_api_docs.py --output /path/to/custom/docs
```

### Example 4: View Documentation

```bash
# Method 1: Direct file open
open api-docs/index.html

# Method 2: HTTP server (recommended)
cd api-docs
python -m http.server 8080

# Then visit:
# http://localhost:8080                     - Unified portal
# http://localhost:8080/knowledge-swagger.html  - Knowledge Service Swagger
# http://localhost:8080/content-redoc.html      - Content Service Redoc
```

---

## 🔗 Quick Links

### Documentation Files
- **Comprehensive Guide**: [`API_DOCUMENTATION_GUIDE.md`](./API_DOCUMENTATION_GUIDE.md) - Full usage guide
- **Generator Script**: [`generate_api_docs.py`](./generate_api_docs.py) - Main script
- **Dependencies**: [`requirements-docs.txt`](./requirements-docs.txt) - Python dependencies

### Related Testing Documentation
- **API Integration Tests**: [`../tests/test_api_integration.py`](../tests/test_api_integration.py)
- **Load Testing Guide**: [`../tests/LOAD_TEST_GUIDE.md`](../tests/LOAD_TEST_GUIDE.md)
- **Database Performance**: [`../tests/DATABASE_PERFORMANCE_GUIDE.md`](../tests/DATABASE_PERFORMANCE_GUIDE.md)

### External Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com) - FastAPI framework
- [OpenAPI Specification](https://swagger.io/specification/) - OpenAPI 3.0 spec
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive docs
- [Redoc](https://redocly.com/redoc/) - Clean API docs

---

## 🎯 Best Practices

### 1. Keep Documentation Up-to-Date
```bash
# Run after API changes
python generate_api_docs.py

# Add to git pre-commit hook
#!/bin/bash
cd backend/docs
python generate_api_docs.py
git add api-docs/
```

### 2. Document API Endpoints Thoroughly
```python
@app.get(
    "/api/v1/items",
    summary="List items",  # ✅ Always add summary
    description="Detailed description...",  # ✅ Add description
    response_description="List of items",  # ✅ Document response
    tags=["items"]  # ✅ Group with tags
)
async def list_items():
    """
    Detailed docstring with:
    - Usage examples
    - Authentication requirements
    - Rate limiting info
    """
    ...
```

### 3. Use Pydantic Models with Field Descriptions
```python
class Item(BaseModel):
    id: str = Field(..., description="Unique identifier")
    name: str = Field(..., description="Item name", example="Sample Item")
    price: float = Field(..., description="Price in USD", ge=0, example=19.99)
```

### 4. Include Example Data
```python
class Config:
    schema_extra = {
        "example": {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "name": "Sample Item",
            "price": 19.99
        }
    }
```

### 5. Document Error Responses
```python
@app.get("/items/{item_id}", responses={
    200: {"description": "Item found"},
    404: {"description": "Item not found"},
    422: {"description": "Validation error"}
})
```

---

## 🐛 Troubleshooting

### Service Not Available
```bash
# Check if service is running
curl http://localhost:8001/health

# Check service logs
docker logs knowledge-service

# Restart service
docker-compose restart knowledge-service
```

### Empty Documentation
```bash
# Verify OpenAPI spec is accessible
curl http://localhost:8001/openapi.json | jq

# Check FastAPI configuration
# Ensure app has title, description, and version
```

### Swagger UI Not Loading
```bash
# Use HTTP server instead of file:// protocol
cd api-docs && python -m http.server 8080

# Check browser console for errors
```

For more troubleshooting tips, see [`API_DOCUMENTATION_GUIDE.md`](./API_DOCUMENTATION_GUIDE.md).

---

## 📊 Service Endpoints Summary

### Knowledge Service (`:8001`)
- `GET /api/v1/knowledge/items` - List knowledge items
- `POST /api/v1/knowledge/items` - Create knowledge item
- `GET /api/v1/knowledge/items/{id}` - Get knowledge item
- `PUT /api/v1/knowledge/items/{id}` - Update knowledge item
- `DELETE /api/v1/knowledge/items/{id}` - Delete knowledge item
- `GET /api/v1/knowledge/search` - Semantic search
- `GET /api/v1/knowledge/stats` - Knowledge statistics

### Content Service (`:8002`)
- `POST /api/v1/content/generate` - Generate content
- `GET /api/v1/content/generation/{id}` - Get generation status
- `POST /api/v1/content/generate/comparison` - Generate comparison
- `POST /api/v1/content/publish` - Publish content

### Support Service (`:8003`)
- `GET /api/v1/support/conversations` - List conversations
- `POST /api/v1/support/conversations` - Create conversation
- `GET /api/v1/support/conversations/{id}` - Get conversation
- `POST /api/v1/support/conversations/{id}/messages` - Add message

### Analytics Service (`:8004`)
- `GET /api/v1/analytics/overview` - Get overview
- `GET /api/v1/analytics/content` - Get content metrics
- `GET /api/v1/analytics/search` - Get search metrics
- `GET /api/v1/analytics/support` - Get support metrics

### Auth Service (`:8005`)
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/token` - Get access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

---

## 🔄 Integration with CI/CD

### GitLab CI Example
```yaml
# .gitlab-ci.yml
generate_api_docs:
  stage: docs
  image: python:3.11
  script:
    - cd backend/docs
    - pip install -r requirements-docs.txt
    - python generate_api_docs.py --output ../../public/api-docs
  artifacts:
    paths:
      - public/api-docs
    expire_in: 30 days
  only:
    - main
```

### GitHub Actions Example
```yaml
# .github/workflows/docs.yml
name: Generate API Docs

on:
  push:
    branches: [main]

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r backend/docs/requirements-docs.txt
      - name: Generate docs
        run: |
          cd backend/docs
          python generate_api_docs.py
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./backend/docs/api-docs
```

---

## ✅ Checklist

Before generating documentation:
- [ ] All backend services are running
- [ ] Dependencies installed (`pip install -r requirements-docs.txt`)
- [ ] Services pass health checks (`/health` endpoints)
- [ ] OpenAPI specs are accessible (`/openapi.json` endpoints)

Documentation quality:
- [ ] All endpoints have `summary` and `description`
- [ ] Pydantic models have field descriptions
- [ ] Example data included
- [ ] Error responses documented
- [ ] Authentication methods explained
- [ ] Tags properly organized

After generation:
- [ ] Swagger UI loads correctly
- [ ] Redoc loads correctly
- [ ] Markdown files render properly
- [ ] OpenAPI JSON is valid
- [ ] Unified portal displays all services

---

## 📞 Support

For questions or issues:

1. **Check the comprehensive guide**: [`API_DOCUMENTATION_GUIDE.md`](./API_DOCUMENTATION_GUIDE.md)
2. **View script help**: `python generate_api_docs.py --help`
3. **Check service logs**: `docker logs [service-name]`
4. **Verify service health**: `curl http://localhost:8001/health`

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Maintainer**: Soundcore KCP Development Team
