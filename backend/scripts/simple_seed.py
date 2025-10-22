#!/usr/bin/env python3
"""
Simple Database Seeding Script
Uses direct SQL commands to insert test data
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from config.settings import settings
import psycopg2
from psycopg2.extras import execute_values

# Sample products (category values must be uppercase enum values)
# Format: (sku, model, series, category, name, slug, description, price, is_active)
PRODUCTS = [
    ("A3951011", "Liberty 4 Pro", "Liberty", "EARBUDS", "Liberty 4 Pro Wireless Earbuds", "liberty-4-pro", "Premium wireless earbuds", 129.99, True),
    ("A3926011", "Space A40", "Space", "EARBUDS", "Space A40 Adaptive ANC Earbuds", "space-a40", "Affordable ANC earbuds", 79.99, True),
    ("A3040011", "Life Q30", "Life", "HEADPHONES", "Life Q30 Hybrid ANC Headphones", "life-q30", "Over-ear ANC headphones", 79.99, True),
]

# Sample knowledge items (type values must be uppercase enum values)
# Tags are stored as PostgreSQL arrays
# Valid KnowledgeType: FAQ, GUIDE, TUTORIAL, REVIEW, SPEC, COMPARISON, TROUBLESHOOTING
# Valid KnowledgeStatus: DRAFT, PUBLISHED, ARCHIVED, UNDER_REVIEW
KNOWLEDGE = [
    ("How to pair Liberty 4 Pro with your device", "Pairing guide for Liberty 4 Pro...", "GUIDE", "PUBLISHED", ["pairing", "bluetooth", "setup"]),
    ("Liberty 4 Pro ANC Modes", "Understanding ANC modes...", "TUTORIAL", "PUBLISHED", ["anc", "features"]),
    ("Battery optimization tips", "Maximize battery life...", "GUIDE", "PUBLISHED", ["battery", "maintenance", "tips"]),
    ("Space A40 vs Liberty 4 Pro", "Product comparison guide...", "COMPARISON", "PUBLISHED", ["comparison", "buying-guide"]),
    ("Warranty information", "Soundcore warranty policy...", "FAQ", "PUBLISHED", ["warranty", "support"]),
]

def seed_data():
    """Seed the database with test data"""
    print("🌱 Starting database seeding...")

    # Connect to database
    conn_str = f"postgresql://{settings.postgres_user}:{settings.postgres_password}@{settings.postgres_host}:{settings.postgres_port}/{settings.postgres_db}"

    try:
        conn = psycopg2.connect(conn_str)
        cur = conn.cursor()

        # Check if data exists
        cur.execute("SELECT COUNT(*) FROM products")
        count = cur.fetchone()[0]

        if count > 0:
            print(f"⚠️  Database already has {count} products. Skipping seeding.")
            return

        print("\n📦 Inserting products...")
        for product in PRODUCTS:
            cur.execute("""
                INSERT INTO products (sku, model, series, category, name, slug, description, price, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """, product)
            print(f"   ✓ Added: {product[4]}")

        print("\n📚 Inserting knowledge items...")
        for knowledge in KNOWLEDGE:
            cur.execute("""
                INSERT INTO knowledge_items (title, content, type, status, tags, quality_score, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, 90.0, NOW(), NOW())
            """, knowledge)
            print(f"   ✓ Added: {knowledge[0]}")

        conn.commit()

        # Print summary
        cur.execute("SELECT COUNT(*) FROM products")
        product_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM knowledge_items")
        knowledge_count = cur.fetchone()[0]

        print("\n✅ Database seeding completed!")
        print(f"   📦 Products: {product_count}")
        print(f"   📚 Knowledge items: {knowledge_count}")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise

if __name__ == "__main__":
    seed_data()
