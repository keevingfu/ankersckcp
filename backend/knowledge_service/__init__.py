"""
Knowledge Service Module
Handles knowledge base management, semantic search, and RAG operations
"""

from .main import app
from . import schemas, crud, routes

__all__ = ["app", "schemas", "crud", "routes"]
