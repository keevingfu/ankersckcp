# Soundcore KCP Backend

Backend microservices for the Soundcore Knowledge Control Plane (KCP) system.

## Architecture

Microservices architecture with 6 services:

- **Knowledge Service** (Port 8001) - Knowledge base management, semantic search, RAG
- **Content Service** (Port 8002) - AI content generation (blogs, social, emails)
- **Support Service** (Port 8003) - Customer support chatbot
- **Analytics Service** (Port 8004) - Data analytics and metrics
- **Auth Service** (Port 8005) - Authentication and authorization
- **Scheduler Service** (Port 8006) - Background tasks and scheduling

## Technology Stack

**Framework**: FastAPI + Python 3.11
**Databases**:
- PostgreSQL (relational data)
- MongoDB (document storage)
- Pinecone (vector search)
- Neo4j (knowledge graph)
- Redis (cache)

**AI/ML**:
- OpenAI GPT-4 & Embeddings
- Anthropic Claude 3.5
- LangChain (RAG)

## Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Git

### 1. Clone Repository

```bash
cd backend
```

### 2. Install Dependencies

**Option A: Using pip (local development)**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Option B: Using Docker (recommended)**
```bash
# Docker Compose will handle dependencies
```

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

**Important environment variables:**
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `PINECONE_API_KEY` - Pinecone vector database key
- Database credentials (auto-configured for Docker)

### 4. Start Services with Docker Compose

```bash
# Start all services (databases + Knowledge Service)
docker-compose up -d

# View logs
docker-compose logs -f knowledge-service

# Stop services
docker-compose down
```

This will start:
- PostgreSQL (port 5432)
- MongoDB (port 27017)
- Redis (port 6379)
- Neo4j (port 7474 HTTP, 7687 Bolt)
- Knowledge Service (port 8001)

### 5. Initialize Database

```bash
# Run migrations (inside container or locally)
docker-compose exec knowledge-service alembic upgrade head

# Or run locally
alembic upgrade head
```

### 6. Verify Setup

**Health Check:**
```bash
curl http://localhost:8001/health
```

**API Status:**
```bash
curl http://localhost:8001/api/v1/status
```

**Interactive API Docs:**
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Development

### Run Locally (without Docker)

1. Start databases:
```bash
docker-compose up -d postgres mongodb redis neo4j
```

2. Run Knowledge Service:
```bash
cd backend
source venv/bin/activate
uvicorn knowledge_service.main:app --reload --port 8001
```

### Run Tests

```bash
# All tests
pytest

# With coverage
pytest --cov=knowledge_service --cov-report=html

# Specific test file
pytest tests/test_knowledge_service.py -v
```

### Code Quality

```bash
# Linting
pylint knowledge_service/

# Type checking
mypy knowledge_service/

# Formatting
black knowledge_service/
```

## API Documentation

### Knowledge Service (Port 8001)

#### Base URLs
- Local: `http://localhost:8001`
- Swagger UI: `http://localhost:8001/docs`

#### Key Endpoints

**Health & Status**
```
GET  /health              - Health check
GET  /ready               - Readiness check
GET  /metrics             - Prometheus metrics
GET  /api/v1/status       - API status
```

**Products**
```
POST   /api/v1/products         - Create product
GET    /api/v1/products         - List products (paginated)
GET    /api/v1/products/{id}    - Get product by ID
PUT    /api/v1/products/{id}    - Update product
DELETE /api/v1/products/{id}    - Delete product (soft delete)
```

**Knowledge Base**
```
POST   /api/v1/knowledge              - Create knowledge item
GET    /api/v1/knowledge              - List knowledge items (paginated, filtered)
GET    /api/v1/knowledge/{id}         - Get knowledge item
PUT    /api/v1/knowledge/{id}         - Update knowledge item
DELETE /api/v1/knowledge/{id}         - Archive knowledge item
POST   /api/v1/knowledge/{id}/like    - Like/unlike knowledge item
POST   /api/v1/knowledge/batch        - Batch create (max 100)
```

**Search**
```
POST /api/v1/search      - Semantic/keyword/hybrid search
POST /api/v1/search/rag  - RAG query (coming soon)
```

**Statistics**
```
GET /api/v1/stats        - Knowledge base statistics
```

### Example Requests

**Create a Product:**
```bash
curl -X POST "http://localhost:8001/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "A3947",
    "model": "Liberty 4 NC",
    "series": "Liberty",
    "category": "earbuds",
    "name": "Liberty 4 NC True Wireless Earbuds",
    "price": 99.99,
    "slug": "liberty-4-nc",
    "features": ["ANC", "LDAC", "50h Battery"],
    "colors": ["Black", "White", "Navy"]
  }'
```

**Create Knowledge Item:**
```bash
curl -X POST "http://localhost:8001/api/v1/knowledge" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to pair Liberty 4 NC with iPhone",
    "content": "Step-by-step guide to pair your Liberty 4 NC with iPhone...",
    "summary": "Quick pairing guide for iPhone users",
    "type": "guide",
    "status": "published",
    "product_id": 1,
    "tags": ["pairing", "iphone", "setup"],
    "language": "en"
  }'
```

**Search Knowledge:**
```bash
curl -X POST "http://localhost:8001/api/v1/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "how to connect earbuds",
    "search_type": "hybrid",
    "top_k": 10,
    "filters": {
      "types": ["guide", "faq"],
      "language": "en"
    }
  }'
```

**Get Statistics:**
```bash
curl "http://localhost:8001/api/v1/stats"
```

## Database Schema

### PostgreSQL Tables

**products**
- Product catalog (SKU, model, features, specs)

**knowledge_items**
- Knowledge base entries with embeddings reference

**content_generation**
- Generated content tracking

**support_conversations**
- Customer support conversations

**competitor_tracking**
- Competitor monitoring data

**search_queries**
- Search query logs for analytics

### Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## Monitoring

### Prometheus Metrics

Available at: `http://localhost:8001/metrics`

Key metrics:
- `knowledge_service_requests_total` - Request count by method, endpoint, status
- `knowledge_service_request_duration_seconds` - Request duration histogram

### Logging

Structured JSON logging with levels:
- `DEBUG` - Detailed debugging information
- `INFO` - General information
- `WARNING` - Warning messages
- `ERROR` - Error messages
- `CRITICAL` - Critical errors

## Troubleshooting

### Database Connection Issues

```bash
# Check database containers
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs mongodb

# Restart services
docker-compose restart
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :8001

# Kill process
kill -9 <PID>
```

### Python Dependencies Issues

```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Clear cache
pip cache purge
```

## Project Structure

```
backend/
├── config/                # Configuration management
│   ├── __init__.py
│   └── settings.py       # Pydantic settings
├── models/               # Database models
│   ├── __init__.py
│   ├── database.py       # Database connections
│   └── knowledge.py      # SQLAlchemy models
├── knowledge_service/    # Knowledge Service (port 8001)
│   ├── __init__.py
│   ├── main.py          # FastAPI app
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # Database operations
│   └── routes.py        # API routes
├── content_service/      # Content Service (port 8002) - TODO
├── support_service/      # Support Service (port 8003) - TODO
├── analytics_service/    # Analytics Service (port 8004) - TODO
├── auth_service/         # Auth Service (port 8005) - TODO
├── scheduler_service/    # Scheduler Service (port 8006) - TODO
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── .env.example          # Environment template
├── Dockerfile            # Docker image definition
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # This file
```

## Contributing

1. Follow PEP 8 style guide
2. Write docstrings for all functions
3. Add type hints
4. Write tests for new features
5. Update API documentation

## License

Copyright © 2024 Anker Soundcore
