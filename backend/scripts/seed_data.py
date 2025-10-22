#!/usr/bin/env python3
"""
Seed Database with Test Data
Populates the database with sample products and knowledge items
"""

import asyncio
import sys
from pathlib import Path

# Add backend to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models.database import Base, get_db_url
from models.knowledge import Product, KnowledgeItem, KnowledgeType, KnowledgeStatus
from datetime import datetime, timezone

# Sample data
SAMPLE_PRODUCTS = [
    {
        "sku": "A3951011",
        "model": "Liberty 4 Pro",
        "series": "Liberty",
        "category": "Earbuds",
        "name": "Liberty 4 Pro Wireless Earbuds",
        "description": "Premium wireless earbuds with advanced ANC and spatial audio",
        "price": 129.99,
        "features": ["Active Noise Cancellation", "LDAC Hi-Res Audio", "Spatial Audio", "10mm Drivers"],
        "specs": {
            "battery_life": "10 hours (earbuds) + 40 hours (case)",
            "charging": "USB-C + Wireless",
            "water_resistance": "IPX5",
            "bluetooth": "5.3",
        },
        "is_active": True,
    },
    {
        "sku": "A3926011",
        "model": "Space A40",
        "series": "Space",
        "category": "Earbuds",
        "name": "Space A40 Adaptive ANC Earbuds",
        "description": "Affordable earbuds with adaptive noise cancellation",
        "price": 79.99,
        "features": ["Adaptive ANC", "50-Hour Playtime", "Multipoint Connection", "LDAC"],
        "specs": {
            "battery_life": "10 hours (earbuds) + 40 hours (case)",
            "charging": "USB-C + Wireless",
            "water_resistance": "IPX4",
            "bluetooth": "5.3",
        },
        "is_active": True,
    },
    {
        "sku": "A3040011",
        "model": "Life Q30",
        "series": "Life",
        "category": "Headphones",
        "name": "Life Q30 Hybrid ANC Headphones",
        "description": "Over-ear headphones with hybrid active noise cancellation",
        "price": 79.99,
        "features": ["Hybrid Active Noise Cancellation", "40mm Drivers", "Multi-Mode ANC", "Hi-Res Audio"],
        "specs": {
            "battery_life": "40 hours (ANC on) / 60 hours (ANC off)",
            "charging": "USB-C",
            "water_resistance": "N/A",
            "bluetooth": "5.0",
        },
        "is_active": True,
    },
]

SAMPLE_KNOWLEDGE = [
    {
        "title": "How to pair Liberty 4 Pro with your device",
        "content": """# Pairing Liberty 4 Pro with Your Device

## First Time Pairing

1. Remove the earbuds from the charging case
2. Open your device's Bluetooth settings
3. Select "Soundcore Liberty 4 Pro" from the list
4. Wait for the connection confirmation

## Troubleshooting

If you experience pairing issues:
- Make sure the earbuds are charged
- Reset the earbuds by holding the button for 10 seconds
- Clear the Bluetooth cache on your device
- Try pairing in a different location""",
        "type": KnowledgeType.GUIDE,
        "status": KnowledgeStatus.PUBLISHED,
        "tags": ["pairing", "bluetooth", "setup", "liberty-4-pro"],
        "source": "internal",
        "quality_score": 95.0,
        "view_count": 0,
        "like_count": 0,
        "metadata": {
            "author": "Product Team",
            "reviewed": True,
            "difficulty": "beginner",
        },
    },
    {
        "title": "Liberty 4 Pro Active Noise Cancellation Modes",
        "content": """# Understanding ANC Modes on Liberty 4 Pro

## Adaptive Mode
Automatically adjusts noise cancellation based on your environment. Perfect for everyday use.

## Transport Mode
Optimized for travel - blocks low-frequency engine noise effectively.

## Indoor Mode
Reduces background chatter and ambient noise in offices and quiet spaces.

## Outdoor Mode
Balances noise cancellation with environmental awareness for safety.

## Switching Modes
- Use the Soundcore app to select your preferred mode
- Or press and hold the left earbud for 2 seconds to cycle through modes""",
        "type": KnowledgeType.TECHNICAL,
        "status": KnowledgeStatus.PUBLISHED,
        "tags": ["anc", "noise-cancellation", "features", "liberty-4-pro"],
        "source": "internal",
        "quality_score": 92.0,
        "view_count": 0,
        "like_count": 0,
        "metadata": {
            "author": "Technical Team",
            "reviewed": True,
            "difficulty": "intermediate",
        },
    },
    {
        "title": "Battery optimization tips for Soundcore earbuds",
        "content": """# Maximizing Battery Life on Your Soundcore Earbuds

## Charging Best Practices
- Charge earbuds when they drop to 20-30%
- Avoid leaving earbuds at 100% for extended periods
- Use the official charging cable and adapter

## Usage Tips
- Lower volume when possible (high volume drains battery faster)
- Disable ANC when not needed
- Turn off unused features like Transparency Mode
- Keep firmware updated for battery optimization

## Storage
- Store at 40-60% charge if not using for extended periods
- Avoid extreme temperatures
- Clean charging contacts regularly""",
        "type": KnowledgeType.GUIDE,
        "status": KnowledgeStatus.PUBLISHED,
        "tags": ["battery", "maintenance", "tips", "optimization"],
        "source": "internal",
        "quality_score": 88.0,
        "view_count": 0,
        "like_count": 0,
        "metadata": {
            "author": "Support Team",
            "reviewed": True,
            "difficulty": "beginner",
        },
    },
    {
        "title": "Space A40 vs Liberty 4 Pro comparison",
        "content": """# Space A40 vs Liberty 4 Pro: Which Should You Choose?

## Liberty 4 Pro
**Best for**: Audiophiles and premium features
- Superior sound quality with LDAC
- More advanced ANC with Spatial Audio
- Premium build quality
- Higher price point ($129.99)

## Space A40
**Best for**: Value seekers and long battery life
- Excellent battery life (50 hours total)
- Adaptive ANC that's good enough for most
- Great value for money ($79.99)
- Lighter and more comfortable for extended wear

## Key Differences
| Feature | Liberty 4 Pro | Space A40 |
|---------|--------------|-----------|
| Price | $129.99 | $79.99 |
| ANC Type | Advanced Multi-Mode | Adaptive |
| Battery | 50 hours total | 50 hours total |
| Audio Quality | LDAC + Spatial | LDAC |

## Recommendation
- Choose Liberty 4 Pro if you want the best audio quality
- Choose Space A40 if you want great value with solid features""",
        "type": KnowledgeType.REVIEW,
        "status": KnowledgeStatus.PUBLISHED,
        "tags": ["comparison", "liberty-4-pro", "space-a40", "buying-guide"],
        "source": "internal",
        "quality_score": 94.0,
        "view_count": 0,
        "like_count": 0,
        "metadata": {
            "author": "Product Team",
            "reviewed": True,
            "difficulty": "beginner",
        },
    },
    {
        "title": "Warranty and support information",
        "content": """# Soundcore Warranty & Support

## Warranty Coverage
- 18-month warranty on all products
- Extended to 24 months when you register your product
- Covers manufacturing defects and hardware failures

## What's Not Covered
- Physical damage from misuse
- Water damage (unless product is IP-rated and damage is within rating)
- Normal wear and tear
- Third-party accessories

## How to Claim Warranty
1. Visit support.soundcore.com
2. Select your product
3. Describe the issue
4. Provide proof of purchase
5. Follow the instructions provided

## Contact Support
- Email: support@soundcore.com
- Phone: 1-800-988-7973 (Mon-Fri 9AM-5PM PST)
- Live Chat: Available on our website""",
        "type": KnowledgeType.FAQ,
        "status": KnowledgeStatus.PUBLISHED,
        "tags": ["warranty", "support", "policy", "contact"],
        "source": "internal",
        "quality_score": 90.0,
        "view_count": 0,
        "like_count": 0,
        "metadata": {
            "author": "Legal Team",
            "reviewed": True,
            "difficulty": "beginner",
        },
    },
]


def seed_database():
    """Seed the database with sample data"""
    print("🌱 Starting database seeding...")

    # Create database engine
    engine = create_engine(get_db_url())

    # Create all tables
    print("📋 Creating database tables...")
    Base.metadata.create_all(bind=engine)

    # Create session
    db = Session(engine)

    try:
        # Check if data already exists
        existing_products = db.query(Product).count()
        if existing_products > 0:
            print(f"⚠️  Database already has {existing_products} products. Skipping seeding.")
            print("   To re-seed, please clear the database first.")
            return

        # Insert products
        print("\n📦 Inserting products...")
        product_objects = []
        for product_data in SAMPLE_PRODUCTS:
            product = Product(**product_data)
            db.add(product)
            product_objects.append(product)
            print(f"   ✓ Added: {product.name}")

        db.flush()  # Flush to get IDs

        # Insert knowledge items
        print("\n📚 Inserting knowledge items...")
        for i, knowledge_data in enumerate(SAMPLE_KNOWLEDGE):
            # Associate first 2 knowledge items with Liberty 4 Pro
            if i < 2:
                knowledge_data["product_id"] = product_objects[0].id

            knowledge = KnowledgeItem(**knowledge_data)
            db.add(knowledge)
            print(f"   ✓ Added: {knowledge.title}")

        # Commit all changes
        db.commit()

        # Print summary
        print("\n✅ Database seeding completed successfully!")
        print(f"   📦 Products: {len(SAMPLE_PRODUCTS)}")
        print(f"   📚 Knowledge items: {len(SAMPLE_KNOWLEDGE)}")

    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
