"""
Quick import test to verify code structure
Tests that all modules can be imported without runtime errors
"""

import sys
print("Testing imports...")

try:
    # Test config
    print("✓ Testing config...")
    from config import settings
    print(f"  - App name: {settings.app_name}")
    print(f"  - Environment: {settings.app_env}")

    # Test models (without database connection)
    print("✓ Testing models...")
    from models.knowledge import (
        KnowledgeType, KnowledgeStatus, ProductCategory,
        Product, KnowledgeItem
    )
    print("  - All model classes imported")

    # Test Knowledge Service
    print("✓ Testing knowledge_service...")
    from knowledge_service import schemas, crud
    print("  - Schemas imported")
    print("  - CRUD operations imported")

    # Test schemas
    print("✓ Testing schemas...")
    test_product = schemas.ProductBase(
        sku="TEST001",
        model="Test Model",
        category=schemas.ProductCategoryEnum.EARBUDS,
        name="Test Product",
        slug="test-product"
    )
    print(f"  - Created test product: {test_product.model}")

    test_knowledge = schemas.KnowledgeItemBase(
        title="Test Knowledge",
        content="Test content",
        type=schemas.KnowledgeTypeEnum.GUIDE
    )
    print(f"  - Created test knowledge: {test_knowledge.title}")

    print("\n✅ All imports successful! Code structure is valid.")
    print("\nNext steps:")
    print("1. Start Docker services: docker-compose up -d")
    print("2. Wait for services to be healthy")
    print("3. Test API: curl http://localhost:8001/health")

except ImportError as e:
    print(f"\n❌ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
