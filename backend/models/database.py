"""
Database Connection Management
Handles connections to PostgreSQL, MongoDB, Neo4j, and Redis
"""

from typing import AsyncGenerator, Optional
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from motor.motor_asyncio import AsyncIOMotorClient
from neo4j import AsyncGraphDatabase
from redis.asyncio import Redis
import logging

from config import settings

logger = logging.getLogger(__name__)

# ============================================================================
# PostgreSQL (SQLAlchemy)
# ============================================================================

# Convert sync URL to async URL
ASYNC_DATABASE_URL = settings.database_url.replace("postgresql://", "postgresql+asyncpg://")

# Create async engine
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=settings.debug,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Base class for SQLAlchemy models
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for FastAPI routes to get database session

    Usage:
        @app.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized")


async def close_db():
    """Close database connections"""
    await engine.dispose()
    logger.info("Database connections closed")


# ============================================================================
# MongoDB
# ============================================================================

class MongoDBConnection:
    """MongoDB Connection Manager"""

    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None

    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(settings.mongodb_url)
            self.db = self.client[settings.mongodb_db]
            # Verify connection
            await self.client.admin.command("ping")
            logger.info(f"Connected to MongoDB: {settings.mongodb_db}")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise

    async def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    def get_collection(self, collection_name: str):
        """Get MongoDB collection"""
        if not self.db:
            raise RuntimeError("MongoDB not connected")
        return self.db[collection_name]


# Global MongoDB instance
mongodb = MongoDBConnection()


# ============================================================================
# Neo4j (Knowledge Graph)
# ============================================================================

class Neo4jConnection:
    """Neo4j Connection Manager"""

    def __init__(self):
        self.driver = None

    async def connect(self):
        """Connect to Neo4j"""
        try:
            self.driver = AsyncGraphDatabase.driver(
                settings.neo4j_uri,
                auth=(settings.neo4j_user, settings.neo4j_password)
            )
            # Verify connection
            async with self.driver.session() as session:
                await session.run("RETURN 1")
            logger.info("Connected to Neo4j knowledge graph")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise

    async def close(self):
        """Close Neo4j connection"""
        if self.driver:
            await self.driver.close()
            logger.info("Neo4j connection closed")

    def get_session(self):
        """Get Neo4j session"""
        if not self.driver:
            raise RuntimeError("Neo4j not connected")
        return self.driver.session()


# Global Neo4j instance
neo4j_db = Neo4jConnection()


# ============================================================================
# Redis Cache
# ============================================================================

class RedisConnection:
    """Redis Connection Manager"""

    def __init__(self):
        self.client: Optional[Redis] = None

    async def connect(self):
        """Connect to Redis"""
        try:
            self.client = Redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
                max_connections=50
            )
            # Verify connection
            await self.client.ping()
            logger.info("Connected to Redis cache")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            raise

    async def close(self):
        """Close Redis connection"""
        if self.client:
            await self.client.close()
            logger.info("Redis connection closed")

    async def get(self, key: str) -> Optional[str]:
        """Get value from Redis"""
        if not self.client:
            raise RuntimeError("Redis not connected")
        return await self.client.get(key)

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        """Set value in Redis with optional expiration"""
        if not self.client:
            raise RuntimeError("Redis not connected")
        return await self.client.set(key, value, ex=ex)

    async def delete(self, key: str) -> bool:
        """Delete key from Redis"""
        if not self.client:
            raise RuntimeError("Redis not connected")
        return bool(await self.client.delete(key))

    async def exists(self, key: str) -> bool:
        """Check if key exists in Redis"""
        if not self.client:
            raise RuntimeError("Redis not connected")
        return bool(await self.client.exists(key))


# Global Redis instance
redis_cache = RedisConnection()


# ============================================================================
# Startup and Shutdown Handlers
# ============================================================================

async def connect_to_databases():
    """Connect to all databases on startup"""
    logger.info("Connecting to databases...")
    await init_db()  # PostgreSQL
    await mongodb.connect()  # MongoDB
    if settings.enable_knowledge_graph:
        await neo4j_db.connect()  # Neo4j
    await redis_cache.connect()  # Redis
    logger.info("All databases connected successfully")


async def close_database_connections():
    """Close all database connections on shutdown"""
    logger.info("Closing database connections...")
    await close_db()  # PostgreSQL
    await mongodb.close()  # MongoDB
    if settings.enable_knowledge_graph:
        await neo4j_db.close()  # Neo4j
    await redis_cache.close()  # Redis
    logger.info("All database connections closed")


# ============================================================================
# Exports
# ============================================================================

__all__ = [
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
]
