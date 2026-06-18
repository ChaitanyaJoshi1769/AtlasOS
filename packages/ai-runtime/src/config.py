"""Configuration management for AI Runtime"""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # Server
    environment: str = "development"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS
    cors_origins: List[str] = ["*"]

    # Logging
    log_level: str = "INFO"

    # Backends
    database_url: str = "postgresql://atlas:password@localhost:5432/atlas"
    redis_url: str = "redis://localhost:6379"

    # Vector database
    qdrant_url: str = "http://localhost:6333"

    # LLM APIs
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # LangGraph
    langgraph_debug: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
