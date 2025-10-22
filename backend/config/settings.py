"""
Configuration Settings
Pydantic-based settings management with environment variable loading
"""

from typing import List, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings
    Loads configuration from environment variables and .env file
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Application Settings
    app_name: str = Field(default="Soundcore KCP", description="Application name")
    app_env: str = Field(default="development", description="Environment (development/staging/production)")
    debug: bool = Field(default=True, description="Debug mode")
    api_version: str = Field(default="v1", description="API version")

    # Server Configuration
    host: str = Field(default="0.0.0.0", description="Server host")
    knowledge_service_port: int = Field(default=8001, description="Knowledge Service port")
    content_service_port: int = Field(default=8002, description="Content Service port")
    support_service_port: int = Field(default=8003, description="Support Service port")
    analytics_service_port: int = Field(default=8004, description="Analytics Service port")
    auth_service_port: int = Field(default=8005, description="Auth Service port")
    scheduler_service_port: int = Field(default=8006, description="Scheduler Service port")

    # Database - PostgreSQL
    postgres_host: str = Field(default="localhost", description="PostgreSQL host")
    postgres_port: int = Field(default=5432, description="PostgreSQL port")
    postgres_user: str = Field(default="soundcore_user", description="PostgreSQL user")
    postgres_password: str = Field(default="", description="PostgreSQL password")
    postgres_db: str = Field(default="soundcore_kcp", description="PostgreSQL database name")

    @property
    def database_url(self) -> str:
        """Construct PostgreSQL connection URL"""
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

    # Database - MongoDB
    mongodb_host: str = Field(default="localhost", description="MongoDB host")
    mongodb_port: int = Field(default=27017, description="MongoDB port")
    mongodb_user: str = Field(default="soundcore_user", description="MongoDB user")
    mongodb_password: str = Field(default="", description="MongoDB password")
    mongodb_db: str = Field(default="soundcore_kcp", description="MongoDB database name")

    @property
    def mongodb_url(self) -> str:
        """Construct MongoDB connection URL"""
        return f"mongodb://{self.mongodb_user}:{self.mongodb_password}@{self.mongodb_host}:{self.mongodb_port}/{self.mongodb_db}?authSource=admin"

    # Database - Neo4j
    neo4j_uri: str = Field(default="bolt://localhost:7687", description="Neo4j connection URI")
    neo4j_user: str = Field(default="neo4j", description="Neo4j user")
    neo4j_password: str = Field(default="", description="Neo4j password")

    # Redis Cache
    redis_host: str = Field(default="localhost", description="Redis host")
    redis_port: int = Field(default=6379, description="Redis port")
    redis_password: str = Field(default="", description="Redis password")
    redis_db: int = Field(default=0, description="Redis database number")

    @property
    def redis_url(self) -> str:
        """Construct Redis connection URL"""
        if self.redis_password:
            return f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/{self.redis_db}"
        return f"redis://{self.redis_host}:{self.redis_port}/{self.redis_db}"

    # Vector Database - Pinecone
    pinecone_api_key: str = Field(default="", description="Pinecone API key")
    pinecone_environment: str = Field(default="us-west1-gcp", description="Pinecone environment")
    pinecone_index_name: str = Field(default="soundcore-knowledge", description="Pinecone index name")

    # AI Services - OpenAI
    openai_api_key: str = Field(default="", description="OpenAI API key")
    openai_model: str = Field(default="gpt-4", description="OpenAI model name")
    openai_embedding_model: str = Field(default="text-embedding-3-large", description="OpenAI embedding model")
    openai_max_tokens: int = Field(default=2000, description="Max tokens for generation")
    openai_temperature: float = Field(default=0.7, description="Temperature for generation")

    # AI Services - Anthropic
    anthropic_api_key: str = Field(default="", description="Anthropic API key")
    anthropic_model: str = Field(default="claude-3-5-sonnet-20241022", description="Anthropic model name")

    # Authentication & Security
    jwt_secret_key: str = Field(default="change-me-in-production", description="JWT secret key")
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    jwt_access_token_expire_minutes: int = Field(default=30, description="Access token expiry (minutes)")
    jwt_refresh_token_expire_days: int = Field(default=7, description="Refresh token expiry (days)")
    encryption_key: str = Field(default="change-me-in-production", description="Encryption key")

    # CORS Settings
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        description="Allowed CORS origins"
    )
    cors_allow_credentials: bool = Field(default=True, description="Allow credentials")
    cors_allow_methods: List[str] = Field(default=["*"], description="Allowed HTTP methods")
    cors_allow_headers: List[str] = Field(default=["*"], description="Allowed HTTP headers")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | List[str]) -> List[str]:
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # Rate Limiting
    rate_limit_per_minute: int = Field(default=1000, description="Rate limit per minute")
    rate_limit_per_hour: int = Field(default=10000, description="Rate limit per hour")

    # Kafka Message Queue
    kafka_bootstrap_servers: str = Field(default="localhost:9092", description="Kafka servers")
    kafka_topic_prefix: str = Field(default="soundcore_kcp", description="Kafka topic prefix")

    # Celery Task Queue
    celery_broker_url: str = Field(default="redis://localhost:6379/1", description="Celery broker URL")
    celery_result_backend: str = Field(default="redis://localhost:6379/2", description="Celery result backend")

    # Monitoring & Logging
    log_level: str = Field(default="INFO", description="Logging level")
    prometheus_port: int = Field(default=9090, description="Prometheus metrics port")
    sentry_dsn: Optional[str] = Field(default=None, description="Sentry DSN for error tracking")

    # Feature Flags
    enable_rag_engine: bool = Field(default=True, description="Enable RAG engine")
    enable_content_generation: bool = Field(default=True, description="Enable content generation")
    enable_auto_tagging: bool = Field(default=True, description="Enable auto-tagging")
    enable_knowledge_graph: bool = Field(default=True, description="Enable knowledge graph")

    # Vector Search Configuration
    vector_dimension: int = Field(default=1536, description="Vector embedding dimension")
    vector_similarity_metric: str = Field(default="cosine", description="Similarity metric")
    vector_top_k: int = Field(default=10, description="Top K results for vector search")

    # Content Generation
    content_max_length: int = Field(default=2000, description="Max content length")
    content_min_quality_score: float = Field(default=0.7, description="Min quality score")

    # RAG Configuration
    rag_retrieval_top_k: int = Field(default=5, description="RAG retrieval top K")
    rag_rerank_top_k: int = Field(default=3, description="RAG rerank top K")
    rag_chunk_size: int = Field(default=512, description="RAG chunk size")
    rag_chunk_overlap: int = Field(default=50, description="RAG chunk overlap")


# Global settings instance
settings = Settings()


# Export for easy import
__all__ = ["settings", "Settings"]
