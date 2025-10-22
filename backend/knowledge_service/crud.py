"""
Knowledge Service - CRUD Operations
Database operations for knowledge management
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
from datetime import datetime

from models.knowledge import (
    Product,
    KnowledgeItem,
    KnowledgeType,
    KnowledgeStatus,
    SearchQuery
)
from .schemas import (
    ProductCreate,
    ProductUpdate,
    KnowledgeItemCreate,
    KnowledgeItemUpdate,
    SearchFilters
)


# ============================================================================
# Product CRUD
# ============================================================================

async def create_product(db: AsyncSession, product: ProductCreate) -> Product:
    """Create a new product"""
    db_product = Product(
        **product.model_dump(exclude_unset=True)
    )
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product


async def get_product(db: AsyncSession, product_id: int) -> Optional[Product]:
    """Get product by ID"""
    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )
    return result.scalar_one_or_none()


async def get_product_by_sku(db: AsyncSession, sku: str) -> Optional[Product]:
    """Get product by SKU"""
    result = await db.execute(
        select(Product).where(Product.sku == sku)
    )
    return result.scalar_one_or_none()


async def get_products(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    is_active: Optional[bool] = None
) -> tuple[List[Product], int]:
    """Get products with filters and pagination"""
    query = select(Product)

    # Apply filters
    conditions = []
    if category:
        conditions.append(Product.category == category)
    if is_active is not None:
        conditions.append(Product.is_active == is_active)

    if conditions:
        query = query.where(and_(*conditions))

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()

    return list(products), total


async def update_product(
    db: AsyncSession,
    product_id: int,
    product_update: ProductUpdate
) -> Optional[Product]:
    """Update a product"""
    db_product = await get_product(db, product_id)
    if not db_product:
        return None

    update_data = product_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)

    db_product.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_product)
    return db_product


async def delete_product(db: AsyncSession, product_id: int) -> bool:
    """Delete a product (soft delete by setting is_active=False)"""
    db_product = await get_product(db, product_id)
    if not db_product:
        return False

    db_product.is_active = False
    db_product.discontinued_date = datetime.utcnow()
    await db.commit()
    return True


# ============================================================================
# Knowledge Item CRUD
# ============================================================================

async def create_knowledge_item(
    db: AsyncSession,
    item: KnowledgeItemCreate
) -> KnowledgeItem:
    """Create a new knowledge item"""
    db_item = KnowledgeItem(
        **item.model_dump(exclude_unset=True)
    )
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item


async def get_knowledge_item(
    db: AsyncSession,
    item_id: int
) -> Optional[KnowledgeItem]:
    """Get knowledge item by ID"""
    result = await db.execute(
        select(KnowledgeItem)
        .options(selectinload(KnowledgeItem.product))
        .where(KnowledgeItem.id == item_id)
    )
    return result.scalar_one_or_none()


async def get_knowledge_items(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    filters: Optional[SearchFilters] = None
) -> tuple[List[KnowledgeItem], int]:
    """Get knowledge items with filters and pagination"""
    query = select(KnowledgeItem).options(selectinload(KnowledgeItem.product))

    # Apply filters
    conditions = []

    if filters:
        if filters.types:
            conditions.append(KnowledgeItem.type.in_([t.value for t in filters.types]))

        if filters.product_ids:
            conditions.append(KnowledgeItem.product_id.in_(filters.product_ids))

        if filters.tags:
            # Check if any tag matches (PostgreSQL array overlap)
            conditions.append(KnowledgeItem.tags.overlap(filters.tags))

        if filters.language:
            conditions.append(KnowledgeItem.language == filters.language)

        if filters.min_quality_score is not None:
            conditions.append(KnowledgeItem.quality_score >= filters.min_quality_score)

        if filters.status:
            conditions.append(KnowledgeItem.status.in_([s.value for s in filters.status]))

    if conditions:
        query = query.where(and_(*conditions))

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply pagination and ordering
    query = query.order_by(KnowledgeItem.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()

    return list(items), total


async def update_knowledge_item(
    db: AsyncSession,
    item_id: int,
    item_update: KnowledgeItemUpdate
) -> Optional[KnowledgeItem]:
    """Update a knowledge item"""
    db_item = await get_knowledge_item(db, item_id)
    if not db_item:
        return None

    update_data = item_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)

    db_item.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(db_item)
    return db_item


async def delete_knowledge_item(db: AsyncSession, item_id: int) -> bool:
    """Delete a knowledge item (soft delete by archiving)"""
    db_item = await get_knowledge_item(db, item_id)
    if not db_item:
        return False

    db_item.status = KnowledgeStatus.ARCHIVED
    await db.commit()
    return True


async def increment_view_count(db: AsyncSession, item_id: int) -> bool:
    """Increment view count for a knowledge item"""
    db_item = await get_knowledge_item(db, item_id)
    if not db_item:
        return False

    db_item.view_count += 1
    await db.commit()
    return True


async def toggle_like(db: AsyncSession, item_id: int, increment: bool = True) -> bool:
    """Toggle like count for a knowledge item"""
    db_item = await get_knowledge_item(db, item_id)
    if not db_item:
        return False

    if increment:
        db_item.like_count += 1
    else:
        db_item.like_count = max(0, db_item.like_count - 1)

    await db.commit()
    return True


# ============================================================================
# Search Operations
# ============================================================================

async def keyword_search(
    db: AsyncSession,
    query: str,
    top_k: int = 10,
    filters: Optional[SearchFilters] = None
) -> List[KnowledgeItem]:
    """
    Keyword-based search
    Uses PostgreSQL full-text search (to be enhanced with tsvector)
    """
    search_query = select(KnowledgeItem).options(selectinload(KnowledgeItem.product))

    # Build search conditions
    conditions = [
        or_(
            KnowledgeItem.title.ilike(f"%{query}%"),
            KnowledgeItem.content.ilike(f"%{query}%"),
            KnowledgeItem.summary.ilike(f"%{query}%")
        )
    ]

    # Apply additional filters
    if filters:
        if filters.types:
            conditions.append(KnowledgeItem.type.in_([t.value for t in filters.types]))
        if filters.product_ids:
            conditions.append(KnowledgeItem.product_id.in_(filters.product_ids))
        if filters.status:
            conditions.append(KnowledgeItem.status.in_([s.value for s in filters.status]))

    search_query = search_query.where(and_(*conditions))
    search_query = search_query.order_by(KnowledgeItem.quality_score.desc()).limit(top_k)

    result = await db.execute(search_query)
    return list(result.scalars().all())


async def log_search_query(
    db: AsyncSession,
    query_text: str,
    search_type: str,
    result_count: int,
    search_time_ms: int,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None
) -> SearchQuery:
    """Log search query for analytics"""
    db_query = SearchQuery(
        query_text=query_text,
        normalized_query=query_text.lower().strip(),
        search_type=search_type,
        result_count=result_count,
        search_time_ms=search_time_ms,
        user_id=user_id,
        session_id=session_id
    )
    db.add(db_query)
    await db.commit()
    await db.refresh(db_query)
    return db_query


# ============================================================================
# Statistics
# ============================================================================

async def get_knowledge_stats(db: AsyncSession) -> Dict[str, Any]:
    """Get knowledge base statistics"""
    # Total items
    total_result = await db.execute(select(func.count(KnowledgeItem.id)))
    total_items = total_result.scalar() or 0

    # Published items
    published_result = await db.execute(
        select(func.count(KnowledgeItem.id))
        .where(KnowledgeItem.status == KnowledgeStatus.PUBLISHED)
    )
    published_items = published_result.scalar() or 0

    # Draft items
    draft_result = await db.execute(
        select(func.count(KnowledgeItem.id))
        .where(KnowledgeItem.status == KnowledgeStatus.DRAFT)
    )
    draft_items = draft_result.scalar() or 0

    # Average quality score
    avg_quality_result = await db.execute(
        select(func.avg(KnowledgeItem.quality_score))
    )
    avg_quality = avg_quality_result.scalar() or 0.0

    # Total views
    total_views_result = await db.execute(
        select(func.sum(KnowledgeItem.view_count))
    )
    total_views = total_views_result.scalar() or 0

    # Total likes
    total_likes_result = await db.execute(
        select(func.sum(KnowledgeItem.like_count))
    )
    total_likes = total_likes_result.scalar() or 0

    # Items by type
    items_by_type_result = await db.execute(
        select(KnowledgeItem.type, func.count(KnowledgeItem.id))
        .group_by(KnowledgeItem.type)
    )
    items_by_type = {str(row[0]): row[1] for row in items_by_type_result}

    # Items by language
    items_by_language_result = await db.execute(
        select(KnowledgeItem.language, func.count(KnowledgeItem.id))
        .group_by(KnowledgeItem.language)
    )
    items_by_language = {
        (row[0] or "unknown"): row[1]
        for row in items_by_language_result
    }

    return {
        "total_items": total_items,
        "published_items": published_items,
        "draft_items": draft_items,
        "avg_quality_score": float(avg_quality),
        "total_views": total_views,
        "total_likes": total_likes,
        "items_by_type": items_by_type,
        "items_by_language": items_by_language
    }


# ============================================================================
# Exports
# ============================================================================

__all__ = [
    "create_product",
    "get_product",
    "get_product_by_sku",
    "get_products",
    "update_product",
    "delete_product",
    "create_knowledge_item",
    "get_knowledge_item",
    "get_knowledge_items",
    "update_knowledge_item",
    "delete_knowledge_item",
    "increment_view_count",
    "toggle_like",
    "keyword_search",
    "log_search_query",
    "get_knowledge_stats",
]
