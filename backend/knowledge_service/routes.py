"""
Knowledge Service - API Routes
REST API endpoints for knowledge management
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
import time

from models import get_db
from . import crud, schemas


# ============================================================================
# Routers
# ============================================================================

products_router = APIRouter()
knowledge_router = APIRouter()
search_router = APIRouter()
stats_router = APIRouter()


# ============================================================================
# Product Endpoints
# ============================================================================

@products_router.post(
    "/",
    response_model=schemas.ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product"
)
async def create_product(
    product: schemas.ProductCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new product in the catalog

    - **sku**: Unique product SKU
    - **model**: Product model name
    - **category**: Product category (earbuds, headphones, speakers, accessories)
    - **name**: Product display name
    - **price**: Product price (optional)
    """
    # Check if SKU already exists
    existing = await crud.get_product_by_sku(db, product.sku)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with SKU '{product.sku}' already exists"
        )

    return await crud.create_product(db, product)


@products_router.get(
    "/{product_id}",
    response_model=schemas.ProductResponse,
    summary="Get product by ID"
)
async def get_product(
    product_id: int = Path(..., description="Product ID"),
    db: AsyncSession = Depends(get_db)
):
    """Get a single product by ID"""
    product = await crud.get_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product


@products_router.get(
    "/",
    response_model=schemas.PaginatedResponse[schemas.ProductResponse],
    summary="List products"
)
async def list_products(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    category: str | None = Query(None, description="Filter by category"),
    is_active: bool | None = Query(None, description="Filter by active status"),
    db: AsyncSession = Depends(get_db)
):
    """
    List products with pagination and filters

    - **page**: Page number (starts at 1)
    - **page_size**: Number of items per page (max 100)
    - **category**: Filter by category
    - **is_active**: Filter by active status
    """
    skip = (page - 1) * page_size
    products, total = await crud.get_products(
        db,
        skip=skip,
        limit=page_size,
        category=category,
        is_active=is_active
    )

    return schemas.PaginatedResponse[schemas.ProductResponse].create(
        items=products,
        total=total,
        page=page,
        page_size=page_size
    )


@products_router.put(
    "/{product_id}",
    response_model=schemas.ProductResponse,
    summary="Update product"
)
async def update_product(
    product_id: int = Path(..., description="Product ID"),
    product_update: schemas.ProductUpdate = ...,
    db: AsyncSession = Depends(get_db)
):
    """Update a product's information"""
    product = await crud.update_product(db, product_id, product_update)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product


@products_router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete product"
)
async def delete_product(
    product_id: int = Path(..., description="Product ID"),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a product (sets is_active=False)"""
    success = await crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return None


# ============================================================================
# Knowledge Item Endpoints
# ============================================================================

@knowledge_router.post(
    "/",
    response_model=schemas.KnowledgeItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create knowledge item"
)
async def create_knowledge_item(
    item: schemas.KnowledgeItemCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new knowledge item

    - **title**: Knowledge item title
    - **content**: Full content (markdown supported)
    - **type**: Knowledge type (faq, guide, tutorial, review, spec, comparison, troubleshooting)
    - **product_id**: Associated product ID (optional)
    """
    # Validate product exists if provided
    if item.product_id:
        product = await crud.get_product(db, item.product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID {item.product_id} not found"
            )

    return await crud.create_knowledge_item(db, item)


@knowledge_router.get(
    "/{item_id}",
    response_model=schemas.KnowledgeItemResponse,
    summary="Get knowledge item"
)
async def get_knowledge_item(
    item_id: int = Path(..., description="Knowledge item ID"),
    increment_view: bool = Query(True, description="Increment view count"),
    db: AsyncSession = Depends(get_db)
):
    """Get a single knowledge item by ID"""
    item = await crud.get_knowledge_item(db, item_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Knowledge item with ID {item_id} not found"
        )

    # Increment view count if requested
    if increment_view:
        await crud.increment_view_count(db, item_id)

    return item


@knowledge_router.get(
    "/",
    response_model=schemas.PaginatedResponse[schemas.KnowledgeItemResponse],
    summary="List knowledge items"
)
async def list_knowledge_items(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    types: List[schemas.KnowledgeTypeEnum] | None = Query(None, description="Filter by types"),
    product_ids: List[int] | None = Query(None, description="Filter by product IDs"),
    tags: List[str] | None = Query(None, description="Filter by tags"),
    language: str | None = Query(None, description="Filter by language"),
    min_quality_score: float | None = Query(None, ge=0, le=100, description="Min quality score"),
    status: List[schemas.KnowledgeStatusEnum] | None = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db)
):
    """
    List knowledge items with pagination and filters

    Supports filtering by:
    - Types (faq, guide, tutorial, etc.)
    - Product IDs
    - Tags
    - Language
    - Quality score
    - Status
    """
    skip = (page - 1) * page_size

    filters = schemas.SearchFilters(
        types=types,
        product_ids=product_ids,
        tags=tags,
        language=language,
        min_quality_score=min_quality_score,
        status=status
    )

    items, total = await crud.get_knowledge_items(db, skip=skip, limit=page_size, filters=filters)

    return schemas.PaginatedResponse[schemas.KnowledgeItemResponse].create(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )


@knowledge_router.put(
    "/{item_id}",
    response_model=schemas.KnowledgeItemResponse,
    summary="Update knowledge item"
)
async def update_knowledge_item(
    item_id: int = Path(..., description="Knowledge item ID"),
    item_update: schemas.KnowledgeItemUpdate = ...,
    db: AsyncSession = Depends(get_db)
):
    """Update a knowledge item's information"""
    item = await crud.update_knowledge_item(db, item_id, item_update)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Knowledge item with ID {item_id} not found"
        )
    return item


@knowledge_router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete knowledge item"
)
async def delete_knowledge_item(
    item_id: int = Path(..., description="Knowledge item ID"),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a knowledge item (archives it)"""
    success = await crud.delete_knowledge_item(db, item_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Knowledge item with ID {item_id} not found"
        )
    return None


@knowledge_router.post(
    "/{item_id}/like",
    status_code=status.HTTP_200_OK,
    summary="Like knowledge item"
)
async def like_knowledge_item(
    item_id: int = Path(..., description="Knowledge item ID"),
    unlike: bool = Query(False, description="Unlike instead of like"),
    db: AsyncSession = Depends(get_db)
):
    """Like or unlike a knowledge item"""
    success = await crud.toggle_like(db, item_id, increment=not unlike)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Knowledge item with ID {item_id} not found"
        )
    return {"success": True, "action": "unliked" if unlike else "liked"}


# ============================================================================
# Search Endpoints
# ============================================================================

@search_router.post(
    "/",
    response_model=schemas.SearchResponse,
    summary="Search knowledge base"
)
async def search_knowledge(
    search_request: schemas.SearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Search knowledge base using semantic, keyword, or hybrid search

    - **query**: Search query text
    - **search_type**: semantic, keyword, or hybrid
    - **top_k**: Number of results to return (1-100)
    - **filters**: Optional filters (types, products, tags, etc.)
    - **rerank**: Enable result reranking
    """
    start_time = time.time()

    # For now, use keyword search
    # TODO: Implement semantic and hybrid search with Pinecone
    results = await crud.keyword_search(
        db,
        query=search_request.query,
        top_k=search_request.top_k,
        filters=search_request.filters
    )

    # Convert to response format
    search_results = [
        schemas.SearchResultItem(
            knowledge_id=item.id,
            title=item.title,
            summary=item.summary,
            type=item.type.value,
            score=item.quality_score / 100.0,  # Normalize to 0-1
            highlights=None,  # TODO: Add text highlighting
            product_id=item.product_id,
            tags=item.tags
        )
        for item in results
    ]

    search_time_ms = int((time.time() - start_time) * 1000)

    # Log search query
    await crud.log_search_query(
        db,
        query_text=search_request.query,
        search_type=search_request.search_type.value,
        result_count=len(search_results),
        search_time_ms=search_time_ms
    )

    return schemas.SearchResponse(
        query=search_request.query,
        total_results=len(search_results),
        search_time_ms=search_time_ms,
        results=search_results
    )


@search_router.post(
    "/rag",
    response_model=schemas.RAGResponse,
    summary="RAG Query"
)
async def rag_query(
    rag_request: schemas.RAGRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieval-Augmented Generation (RAG) query

    Retrieves relevant knowledge and generates an answer using LLM

    - **query**: User question
    - **context_length**: Number of knowledge items to use as context (1-10)
    - **max_tokens**: Maximum response length
    - **temperature**: Generation temperature (0-1)
    - **stream**: Enable streaming response (not implemented yet)
    """
    # TODO: Implement RAG with LangChain + Pinecone + OpenAI/Anthropic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="RAG endpoint not yet implemented. Coming in Phase 2.2+"
    )


# ============================================================================
# Statistics Endpoints
# ============================================================================

@stats_router.get(
    "/",
    response_model=schemas.KnowledgeStats,
    summary="Get knowledge base statistics"
)
async def get_stats(db: AsyncSession = Depends(get_db)):
    """
    Get comprehensive knowledge base statistics

    Returns:
    - Total items count
    - Published vs draft items
    - Average quality score
    - Total views and likes
    - Items breakdown by type and language
    """
    stats = await crud.get_knowledge_stats(db)
    return schemas.KnowledgeStats(**stats)


# ============================================================================
# Batch Operations
# ============================================================================

@knowledge_router.post(
    "/batch",
    response_model=schemas.BatchOperationResponse,
    summary="Batch create knowledge items"
)
async def batch_create_knowledge(
    batch_request: schemas.BatchKnowledgeCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create multiple knowledge items in a single request

    Max 100 items per batch
    """
    success_count = 0
    failure_count = 0
    errors = []

    for idx, item in enumerate(batch_request.items):
        try:
            await crud.create_knowledge_item(db, item)
            success_count += 1
        except Exception as e:
            failure_count += 1
            errors.append({
                "index": idx,
                "title": item.title,
                "error": str(e)
            })

    return schemas.BatchOperationResponse(
        success_count=success_count,
        failure_count=failure_count,
        errors=errors
    )


# ============================================================================
# Exports
# ============================================================================

__all__ = [
    "products_router",
    "knowledge_router",
    "search_router",
    "stats_router",
]
