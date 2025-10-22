"""
Database Models Module
Exports all database models and connections
"""

from .database import (
    Base,
    engine,
    AsyncSessionLocal,
    get_db,
    init_db,
    close_db,
    mongodb,
    neo4j_db,
    redis_cache,
    connect_to_databases,
    close_database_connections,
)

from .knowledge import (
    KnowledgeType,
    KnowledgeStatus,
    ProductCategory,
    Product,
    KnowledgeItem,
    ContentGeneration,
    SupportConversation,
    CompetitorTracking,
    SearchQuery,
)

__all__ = [
    # Database
    "Base",
    "engine",
    "AsyncSessionLocal",
    "get_db",
    "init_db",
    "close_db",
    "mongodb",
    "neo4j_db",
    "redis_cache",
    "connect_to_databases",
    "close_database_connections",
    # Models
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
