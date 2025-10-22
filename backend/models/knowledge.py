"""
Knowledge Base Models
SQLAlchemy models for knowledge management
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime,
    JSON, ForeignKey, Index, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
import enum

from .database import Base


# ============================================================================
# Enums
# ============================================================================

class KnowledgeType(str, enum.Enum):
    """Knowledge item types"""
    FAQ = "faq"
    GUIDE = "guide"
    TUTORIAL = "tutorial"
    REVIEW = "review"
    SPEC = "spec"
    COMPARISON = "comparison"
    TROUBLESHOOTING = "troubleshooting"


class KnowledgeStatus(str, enum.Enum):
    """Knowledge item status"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    UNDER_REVIEW = "under_review"


class ProductCategory(str, enum.Enum):
    """Product categories"""
    EARBUDS = "earbuds"
    HEADPHONES = "headphones"
    SPEAKERS = "speakers"
    ACCESSORIES = "accessories"


# ============================================================================
# Product Models
# ============================================================================

class Product(Base):
    """
    Product Catalog
    Stores all Soundcore product information
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), unique=True, nullable=False, index=True)
    model = Column(String(200), nullable=False, index=True)
    series = Column(String(100), nullable=True, index=True)
    category = Column(SQLEnum(ProductCategory), nullable=False, index=True)

    # Basic Info
    name = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    currency = Column(String(10), default="USD")

    # Technical Specifications (JSON)
    features = Column(JSON, nullable=True)  # ["ANC", "LDAC", "Wireless Charging"]
    specs = Column(JSON, nullable=True)  # {"battery_life": "50h", "driver": "11mm"}
    colors = Column(ARRAY(String), nullable=True)  # ["Black", "White", "Blue"]

    # SEO & Marketing
    slug = Column(String(300), unique=True, nullable=False, index=True)
    keywords = Column(ARRAY(String), nullable=True)

    # Status
    is_active = Column(Boolean, default=True, index=True)
    release_date = Column(DateTime, nullable=True)
    discontinued_date = Column(DateTime, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    knowledge_items = relationship("KnowledgeItem", back_populates="product")

    def __repr__(self):
        return f"<Product(sku={self.sku}, model={self.model})>"


# ============================================================================
# Knowledge Base Models
# ============================================================================

class KnowledgeItem(Base):
    """
    Knowledge Base Items
    Stores all knowledge content with vector embeddings
    """
    __tablename__ = "knowledge_items"

    id = Column(Integer, primary_key=True, index=True)

    # Content
    title = Column(String(500), nullable=False, index=True)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)

    # Classification
    type = Column(SQLEnum(KnowledgeType), nullable=False, index=True)
    status = Column(SQLEnum(KnowledgeStatus), default=KnowledgeStatus.DRAFT, index=True)

    # Product Association
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)
    product = relationship("Product", back_populates="knowledge_items")

    # Metadata
    tags = Column(ARRAY(String), nullable=True, index=True)
    language = Column(String(10), default="en", index=True)
    source = Column(String(200), nullable=True)  # Source URL or document
    author = Column(String(200), nullable=True)

    # Vector Embeddings (stored in Pinecone, reference here)
    embedding_id = Column(String(100), unique=True, nullable=True, index=True)
    vector_dimension = Column(Integer, default=1536)

    # Quality Metrics
    quality_score = Column(Float, default=0.0, index=True)
    readability_score = Column(Float, nullable=True)
    seo_score = Column(Float, nullable=True)

    # Analytics
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    published_at = Column(DateTime, nullable=True, index=True)

    def __repr__(self):
        return f"<KnowledgeItem(id={self.id}, title={self.title[:50]}, type={self.type})>"


# Create composite indexes for common queries
Index("idx_knowledge_type_status", KnowledgeItem.type, KnowledgeItem.status)
Index("idx_knowledge_product_type", KnowledgeItem.product_id, KnowledgeItem.type)
Index("idx_knowledge_quality", KnowledgeItem.quality_score.desc())


# ============================================================================
# Content Generation Models
# ============================================================================

class ContentGeneration(Base):
    """
    Content Generation Tracking
    Tracks AI-generated content and its performance
    """
    __tablename__ = "content_generation"

    id = Column(Integer, primary_key=True, index=True)

    # Content
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(100), nullable=False, index=True)  # "blog", "social", "email"

    # Generation Parameters
    model_used = Column(String(100), nullable=False)  # "gpt-4", "claude-3-5"
    prompt = Column(Text, nullable=True)
    temperature = Column(Float, nullable=True)
    max_tokens = Column(Integer, nullable=True)

    # Product Association
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)

    # SEO & Quality
    seo_score = Column(Float, nullable=True)
    readability_score = Column(Float, nullable=True)
    originality_score = Column(Float, nullable=True)

    # Publishing
    status = Column(String(50), default="draft", index=True)
    published_url = Column(String(500), nullable=True)
    published_at = Column(DateTime, nullable=True, index=True)

    # Performance Metrics
    view_count = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    conversion_rate = Column(Float, default=0.0)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<ContentGeneration(id={self.id}, type={self.content_type}, status={self.status})>"


# ============================================================================
# Support Conversation Models
# ============================================================================

class SupportConversation(Base):
    """
    Customer Support Conversations
    Tracks support interactions and AI responses
    """
    __tablename__ = "support_conversations"

    id = Column(Integer, primary_key=True, index=True)

    # User Info
    user_id = Column(String(100), nullable=True, index=True)
    user_email = Column(String(200), nullable=True)
    session_id = Column(String(100), nullable=False, index=True)

    # Conversation
    user_query = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)

    # Classification
    intent = Column(String(100), nullable=True, index=True)  # "product_inquiry", "troubleshooting"
    sentiment = Column(String(50), nullable=True)  # "positive", "neutral", "negative"

    # Product Association
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)

    # Knowledge References
    knowledge_ids = Column(ARRAY(Integer), nullable=True)  # Referenced knowledge items

    # Quality & Feedback
    was_helpful = Column(Boolean, nullable=True)
    user_rating = Column(Integer, nullable=True)  # 1-5 stars
    escalated_to_human = Column(Boolean, default=False, index=True)

    # Response Metadata
    response_time_ms = Column(Integer, nullable=True)
    model_used = Column(String(100), nullable=True)
    confidence_score = Column(Float, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<SupportConversation(id={self.id}, session={self.session_id}, intent={self.intent})>"


# ============================================================================
# Competitor Tracking Models
# ============================================================================

class CompetitorTracking(Base):
    """
    Competitor Data Tracking
    Monitors competitor products and content
    """
    __tablename__ = "competitor_tracking"

    id = Column(Integer, primary_key=True, index=True)

    # Competitor Info
    competitor_name = Column(String(200), nullable=False, index=True)
    product_name = Column(String(300), nullable=False)
    product_url = Column(String(500), nullable=True)

    # Product Details
    category = Column(String(100), nullable=True, index=True)
    price = Column(Float, nullable=True)
    currency = Column(String(10), default="USD")
    features = Column(JSON, nullable=True)
    specs = Column(JSON, nullable=True)

    # Market Position
    rating = Column(Float, nullable=True)
    review_count = Column(Integer, nullable=True)
    market_rank = Column(Integer, nullable=True)

    # Content Analysis
    content_keywords = Column(ARRAY(String), nullable=True)
    seo_ranking = Column(JSON, nullable=True)  # {"keyword": rank}

    # Soundcore Product Comparison
    soundcore_product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)

    # Timestamps
    scraped_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<CompetitorTracking(competitor={self.competitor_name}, product={self.product_name})>"


# ============================================================================
# Search Query Models
# ============================================================================

class SearchQuery(Base):
    """
    Search Query Logs
    Tracks user searches for analytics and optimization
    """
    __tablename__ = "search_queries"

    id = Column(Integer, primary_key=True, index=True)

    # Query Info
    query_text = Column(String(500), nullable=False, index=True)
    normalized_query = Column(String(500), nullable=True, index=True)

    # User Info
    user_id = Column(String(100), nullable=True, index=True)
    session_id = Column(String(100), nullable=True, index=True)

    # Search Context
    search_type = Column(String(50), nullable=False, index=True)  # "semantic", "keyword", "hybrid"
    filters = Column(JSON, nullable=True)  # Applied filters

    # Results
    result_count = Column(Integer, default=0)
    top_results = Column(JSON, nullable=True)  # Top 5 result IDs

    # User Interaction
    clicked_result_id = Column(Integer, nullable=True)
    click_position = Column(Integer, nullable=True)
    time_to_click_ms = Column(Integer, nullable=True)

    # Performance
    search_time_ms = Column(Integer, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<SearchQuery(id={self.id}, query={self.query_text[:50]})>"


# Create indexes for common queries
Index("idx_search_query_date", SearchQuery.query_text, SearchQuery.created_at.desc())
Index("idx_search_normalized", SearchQuery.normalized_query, SearchQuery.created_at.desc())


# ============================================================================
# Exports
# ============================================================================

__all__ = [
    "KnowledgeType",
    "KnowledgeStatus",
    "ProductCategory",
    "Product",
    "KnowledgeItem",
    "ContentGeneration",
    "SupportConversation",
    "CompetitorTracking",
    "SearchQuery",
]
