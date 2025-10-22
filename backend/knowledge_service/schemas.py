"""
Knowledge Service - Pydantic Schemas
Request and response models for API validation
"""

from datetime import datetime
from typing import Optional, List, Dict, Any, TypeVar, Generic
from pydantic import BaseModel, Field, field_validator, ConfigDict
from enum import Enum

# Generic type for pagination
T = TypeVar('T')


# ============================================================================
# Enums
# ============================================================================

class KnowledgeTypeEnum(str, Enum):
    """Knowledge item types"""
    FAQ = "faq"
    GUIDE = "guide"
    TUTORIAL = "tutorial"
    REVIEW = "review"
    SPEC = "spec"
    COMPARISON = "comparison"
    TROUBLESHOOTING = "troubleshooting"


class KnowledgeStatusEnum(str, Enum):
    """Knowledge item status"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    UNDER_REVIEW = "under_review"


class ProductCategoryEnum(str, Enum):
    """Product categories"""
    EARBUDS = "earbuds"
    HEADPHONES = "headphones"
    SPEAKERS = "speakers"
    ACCESSORIES = "accessories"


class SearchTypeEnum(str, Enum):
    """Search types"""
    SEMANTIC = "semantic"
    KEYWORD = "keyword"
    HYBRID = "hybrid"


# ============================================================================
# Product Schemas
# ============================================================================

class ProductBase(BaseModel):
    """Base product schema"""
    sku: str = Field(..., description="Product SKU", max_length=100)
    model: str = Field(..., description="Product model name", max_length=200)
    series: Optional[str] = Field(None, description="Product series", max_length=100)
    category: ProductCategoryEnum = Field(..., description="Product category")
    name: str = Field(..., description="Product name", max_length=300)
    description: Optional[str] = Field(None, description="Product description")
    price: Optional[float] = Field(None, description="Product price", ge=0)
    currency: Optional[str] = Field(default="USD", description="Currency code", max_length=10)
    features: Optional[List[str]] = Field(None, description="Product features")
    specs: Optional[Dict[str, Any]] = Field(None, description="Technical specifications")
    colors: Optional[List[str]] = Field(None, description="Available colors")
    slug: str = Field(..., description="URL slug", max_length=300)
    keywords: Optional[List[str]] = Field(None, description="SEO keywords")
    is_active: bool = Field(default=True, description="Is product active")


class ProductCreate(ProductBase):
    """Schema for creating a product"""
    release_date: Optional[datetime] = Field(None, description="Release date")


class ProductUpdate(BaseModel):
    """Schema for updating a product"""
    model: Optional[str] = None
    series: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    features: Optional[List[str]] = None
    specs: Optional[Dict[str, Any]] = None
    colors: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    """Schema for product response"""
    id: int
    created_at: datetime
    updated_at: datetime
    release_date: Optional[datetime] = None
    discontinued_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================================
# Knowledge Item Schemas
# ============================================================================

class KnowledgeItemBase(BaseModel):
    """Base knowledge item schema"""
    title: str = Field(..., description="Knowledge item title", max_length=500)
    content: str = Field(..., description="Full content")
    summary: Optional[str] = Field(None, description="Brief summary")
    type: KnowledgeTypeEnum = Field(..., description="Knowledge type")
    status: KnowledgeStatusEnum = Field(default=KnowledgeStatusEnum.DRAFT, description="Status")
    product_id: Optional[int] = Field(None, description="Associated product ID")
    tags: Optional[List[str]] = Field(None, description="Tags")
    language: Optional[str] = Field(default="en", description="Language code", max_length=10)
    source: Optional[str] = Field(None, description="Content source", max_length=200)
    author: Optional[str] = Field(None, description="Author name", max_length=200)


class KnowledgeItemCreate(KnowledgeItemBase):
    """Schema for creating a knowledge item"""
    pass


class KnowledgeItemUpdate(BaseModel):
    """Schema for updating a knowledge item"""
    title: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = None
    summary: Optional[str] = None
    type: Optional[KnowledgeTypeEnum] = None
    status: Optional[KnowledgeStatusEnum] = None
    product_id: Optional[int] = None
    tags: Optional[List[str]] = None
    language: Optional[str] = Field(None, max_length=10)
    source: Optional[str] = Field(None, max_length=200)
    author: Optional[str] = Field(None, max_length=200)


class KnowledgeItemResponse(KnowledgeItemBase):
    """Schema for knowledge item response"""
    id: int
    embedding_id: Optional[str] = None
    vector_dimension: Optional[int] = Field(default=1536)
    quality_score: Optional[float] = Field(default=0.0)
    readability_score: Optional[float] = None
    seo_score: Optional[float] = None
    view_count: Optional[int] = Field(default=0)
    like_count: Optional[int] = Field(default=0)
    share_count: Optional[int] = Field(default=0)
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================================
# Search Schemas
# ============================================================================

class SearchFilters(BaseModel):
    """Search filter options"""
    types: Optional[List[KnowledgeTypeEnum]] = Field(None, description="Filter by types")
    product_ids: Optional[List[int]] = Field(None, description="Filter by product IDs")
    tags: Optional[List[str]] = Field(None, description="Filter by tags")
    language: Optional[str] = Field(None, description="Filter by language")
    min_quality_score: Optional[float] = Field(None, description="Minimum quality score", ge=0, le=100)
    status: Optional[List[KnowledgeStatusEnum]] = Field(None, description="Filter by status")


class SearchRequest(BaseModel):
    """Semantic search request"""
    query: str = Field(..., description="Search query", min_length=1, max_length=500)
    search_type: SearchTypeEnum = Field(default=SearchTypeEnum.HYBRID, description="Search type")
    top_k: int = Field(default=10, description="Number of results", ge=1, le=100)
    filters: Optional[SearchFilters] = Field(None, description="Search filters")
    rerank: bool = Field(default=True, description="Enable reranking")


class SearchResultItem(BaseModel):
    """Single search result"""
    knowledge_id: int
    title: str
    summary: Optional[str]
    type: str
    score: float = Field(..., description="Relevance score", ge=0, le=1)
    highlights: Optional[List[str]] = Field(None, description="Matching text snippets")
    product_id: Optional[int] = None
    tags: Optional[List[str]] = None


class SearchResponse(BaseModel):
    """Search response"""
    query: str
    total_results: int
    search_time_ms: int
    results: List[SearchResultItem]


# ============================================================================
# RAG Schemas
# ============================================================================

class RAGRequest(BaseModel):
    """RAG (Retrieval-Augmented Generation) request"""
    query: str = Field(..., description="User query", min_length=1, max_length=1000)
    context_length: int = Field(default=5, description="Number of context documents", ge=1, le=10)
    max_tokens: int = Field(default=500, description="Max response tokens", ge=100, le=2000)
    temperature: float = Field(default=0.7, description="Generation temperature", ge=0, le=1)
    stream: bool = Field(default=False, description="Enable streaming response")


class RAGResponse(BaseModel):
    """RAG response"""
    query: str
    answer: str
    sources: List[SearchResultItem]
    confidence: float = Field(..., description="Answer confidence", ge=0, le=1)
    model_used: str


# ============================================================================
# Analytics Schemas
# ============================================================================

class KnowledgeStats(BaseModel):
    """Knowledge base statistics"""
    total_items: int
    published_items: int
    draft_items: int
    avg_quality_score: float
    total_views: int
    total_likes: int
    items_by_type: Dict[str, int]
    items_by_language: Dict[str, int]


# ============================================================================
# Batch Operation Schemas
# ============================================================================

class BatchKnowledgeCreate(BaseModel):
    """Batch create knowledge items"""
    items: List[KnowledgeItemCreate] = Field(..., description="Knowledge items to create")

    @field_validator("items")
    @classmethod
    def validate_items_count(cls, v: List[KnowledgeItemCreate]) -> List[KnowledgeItemCreate]:
        """Validate batch size"""
        if len(v) > 100:
            raise ValueError("Cannot create more than 100 items at once")
        return v


class BatchOperationResponse(BaseModel):
    """Batch operation response"""
    success_count: int
    failure_count: int
    errors: List[Dict[str, Any]] = Field(default_factory=list)


# ============================================================================
# Error Schemas
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    message: str
    path: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============================================================================
# Pagination Schemas
# ============================================================================

class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = Field(default=1, description="Page number", ge=1)
    page_size: int = Field(default=20, description="Items per page", ge=1, le=100)


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper"""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def create(cls, items: List[T], total: int, page: int, page_size: int):
        """Create paginated response"""
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size
        )


# ============================================================================
# Exports
# ============================================================================

__all__ = [
    "KnowledgeTypeEnum",
    "KnowledgeStatusEnum",
    "ProductCategoryEnum",
    "SearchTypeEnum",
    "ProductBase",
    "ProductCreate",
    "ProductUpdate",
    "ProductResponse",
    "KnowledgeItemBase",
    "KnowledgeItemCreate",
    "KnowledgeItemUpdate",
    "KnowledgeItemResponse",
    "SearchFilters",
    "SearchRequest",
    "SearchResultItem",
    "SearchResponse",
    "RAGRequest",
    "RAGResponse",
    "KnowledgeStats",
    "BatchKnowledgeCreate",
    "BatchOperationResponse",
    "ErrorResponse",
    "PaginationParams",
    "PaginatedResponse",
]
