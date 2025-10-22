#!/usr/bin/env python3
"""
Mock数据生成器
为KCP项目生成各种Mock数据
"""

import json
import random
from datetime import datetime, timedelta
from pathlib import Path


class MockDataGenerator:
    """Mock数据生成器"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.mock_dir = self.project_root / "frontend" / "mocks"
        self.mock_dir.mkdir(parents=True, exist_ok=True)
    
    def generate_knowledge_items(self, count: int = 10000):
        """生成知识库条目"""
        print(f"\n📚 生成 {count} 条知识库数据...")
        
        types = ['faq', 'guide', 'tutorial', 'troubleshooting', 'specification']
        products = ['Liberty 4', 'Liberty 4 NC', 'Space A40', 'Q30', 'Q35', 'Life P3']
        categories = ['Features', 'Setup', 'Troubleshooting', 'Specifications', 'Usage']
        languages = ['en', 'zh', 'de', 'fr', 'es', 'ja']
        
        items = []
        for i in range(count):
            item = {
                'id': f'kb_{i:06d}',
                'title': self._generate_title(random.choice(types)),
                'content': self._generate_content(),
                'type': random.choice(types),
                'product': random.choice(products),
                'category': random.choice(categories),
                'language': random.choice(languages),
                'quality_score': round(random.uniform(0.7, 1.0), 2),
                'views': random.randint(0, 10000),
                'helpful_count': random.randint(0, 500),
                'not_helpful_count': random.randint(0, 50),
                'created_at': self._random_datetime().isoformat(),
                'updated_at': self._random_datetime().isoformat(),
                'tags': self._generate_tags(),
                'status': random.choice(['published', 'draft', 'archived'])
            }
            items.append(item)
        
        output_file = self.mock_dir / "knowledge-items.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        
        print(f"✅ 知识库数据已保存: {output_file}\n")
        return items
    
    def generate_content_items(self, count: int = 500):
        """生成内容条目"""
        print(f"\n📝 生成 {count} 条内容数据...")
        
        content_types = ['seo_blog', 'social_post', 'email', 'video_script', 'product_desc']
        platforms = ['Website', 'Facebook', 'Twitter', 'Instagram', 'YouTube', 'LinkedIn']
        
        items = []
        for i in range(count):
            content_type = random.choice(content_types)
            item = {
                'id': f'content_{i:05d}',
                'title': self._generate_content_title(content_type),
                'type': content_type,
                'platform': random.choice(platforms),
                'status': random.choice(['draft', 'published', 'scheduled', 'archived']),
                'target_keyword': self._generate_keyword(),
                'seo_score': random.randint(60, 100) if content_type == 'seo_blog' else None,
                'word_count': random.randint(300, 2000),
                'engagement_rate': round(random.uniform(0.01, 0.15), 3),
                'views': random.randint(100, 50000),
                'likes': random.randint(10, 1000),
                'shares': random.randint(5, 500),
                'created_at': self._random_datetime().isoformat(),
                'published_at': self._random_datetime().isoformat() if random.random() > 0.3 else None,
                'created_by': f'user_{random.randint(1, 10)}'
            }
            items.append(item)
        
        output_file = self.mock_dir / "content-items.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
        
        print(f"✅ 内容数据已保存: {output_file}\n")
        return items
    
    def generate_conversations(self, count: int = 1000):
        """生成客服对话"""
        print(f"\n💬 生成 {count} 条对话数据...")
        
        topics = ['Battery', 'Connectivity', 'Sound Quality', 'Pairing', 'Features', 'Warranty']
        sentiments = ['positive', 'neutral', 'negative']
        
        conversations = []
        for i in range(count):
            conversation = {
                'id': f'conv_{i:05d}',
                'customer_id': f'cust_{random.randint(1000, 9999)}',
                'topic': random.choice(topics),
                'sentiment': random.choice(sentiments),
                'status': random.choice(['open', 'in_progress', 'resolved', 'closed']),
                'priority': random.choice(['low', 'medium', 'high', 'urgent']),
                'messages': self._generate_messages(random.randint(2, 10)),
                'satisfaction_score': random.randint(1, 5) if random.random() > 0.3 else None,
                'resolution_time_minutes': random.randint(5, 120) if random.random() > 0.5 else None,
                'auto_resolved': random.choice([True, False]),
                'created_at': self._random_datetime().isoformat(),
                'updated_at': self._random_datetime().isoformat()
            }
            conversations.append(conversation)
        
        output_file = self.mock_dir / "conversations.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(conversations, f, indent=2, ensure_ascii=False)
        
        print(f"✅ 对话数据已保存: {output_file}\n")
        return conversations
    
    def generate_analytics_data(self):
        """生成分析数据"""
        print(f"\n📊 生成分析数据...")
        
        # 30天的数据
        days = 30
        end_date = datetime.now()
        
        daily_stats = []
        for i in range(days):
            date = end_date - timedelta(days=days - i - 1)
            stat = {
                'date': date.strftime('%Y-%m-%d'),
                'knowledge_items_created': random.randint(10, 50),
                'content_generated': random.randint(5, 30),
                'conversations_handled': random.randint(50, 200),
                'auto_resolution_rate': round(random.uniform(0.75, 0.95), 2),
                'avg_satisfaction_score': round(random.uniform(3.5, 4.8), 1),
                'total_views': random.randint(1000, 5000),
                'api_calls': random.randint(5000, 20000)
            }
            daily_stats.append(stat)
        
        output_file = self.mock_dir / "analytics-daily.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(daily_stats, f, indent=2)
        
        print(f"✅ 分析数据已保存: {output_file}\n")
        return daily_stats
    
    def generate_all(self):
        """生成所有Mock数据"""
        print("\n" + "="*60)
        print("开始生成所有Mock数据")
        print("="*60)
        
        self.generate_knowledge_items(10000)
        self.generate_content_items(500)
        self.generate_conversations(1000)
        self.generate_analytics_data()
        
        print("="*60)
        print("✅ 所有Mock数据生成完成!")
        print(f"输出目录: {self.mock_dir}")
        print("="*60 + "\n")
    
    # Helper methods
    def _generate_title(self, item_type: str) -> str:
        """生成标题"""
        templates = {
            'faq': [
                'How to {} with {}?',
                'Why is {} not {}?',
                'Can I {} with {}?',
                'What is {} for {}?'
            ],
            'guide': [
                'Complete Guide to {}',
                'Getting Started with {}',
                'How to Set Up {}',
                'Mastering {}'
            ],
            'tutorial': [
                'Step-by-Step: {}',
                'Learn to {}',
                'Tutorial: {}',
                '{} in 5 Minutes'
            ],
            'troubleshooting': [
                'Fixing {} Issue',
                'Troubleshooting {} Problem',
                'Solving {} Error',
                'How to Fix {}'
            ]
        }
        
        topics = ['pairing', 'charging', 'connectivity', 'sound quality', 'features']
        devices = ['Liberty 4', 'Space A40', 'Q30', 'your device']
        
        template = random.choice(templates.get(item_type, templates['faq']))
        return template.format(random.choice(topics), random.choice(devices))
    
    def _generate_content(self) -> str:
        """生成内容"""
        paragraphs = [
            "This feature allows you to customize your listening experience.",
            "For optimal performance, please ensure your device is fully charged.",
            "Follow these steps to complete the setup process.",
            "If you experience any issues, try resetting your device.",
            "Our products are designed with quality and durability in mind."
        ]
        return " ".join(random.sample(paragraphs, random.randint(2, 4)))
    
    def _generate_content_title(self, content_type: str) -> str:
        """生成内容标题"""
        templates = {
            'seo_blog': 'Best {} for {} in 2024',
            'social_post': 'Check out our amazing {}!',
            'email': 'Exclusive offer on {}',
            'video_script': 'How to get the most from your {}',
            'product_desc': '{} - Premium Audio Experience'
        }
        products = ['Wireless Earbuds', 'Noise-Cancelling Headphones', 'Liberty 4']
        template = templates.get(content_type, 'About {}')
        return template.format(random.choice(products))
    
    def _generate_keyword(self) -> str:
        """生成关键词"""
        keywords = [
            'best wireless earbuds',
            'noise cancelling headphones',
            'bluetooth earbuds review',
            'soundcore liberty',
            'anc headphones'
        ]
        return random.choice(keywords)
    
    def _generate_messages(self, count: int) -> list:
        """生成消息"""
        messages = []
        for i in range(count):
            is_customer = i % 2 == 0
            messages.append({
                'id': f'msg_{i}',
                'sender': 'customer' if is_customer else 'agent',
                'content': self._generate_message_content(is_customer),
                'timestamp': self._random_datetime().isoformat()
            })
        return messages
    
    def _generate_message_content(self, is_customer: bool) -> str:
        """生成消息内容"""
        if is_customer:
            questions = [
                "My earbuds won't pair with my phone",
                "How do I reset my device?",
                "The battery drains very quickly",
                "Can I use these for sports?",
                "Is there a warranty?"
            ]
            return random.choice(questions)
        else:
            responses = [
                "Thank you for contacting us. Let me help you with that.",
                "Please try the following steps...",
                "I understand your concern. Here's what you can do:",
                "The warranty period is 18 months from purchase date.",
                "Is there anything else I can help you with?"
            ]
            return random.choice(responses)
    
    def _generate_tags(self) -> list:
        """生成标签"""
        all_tags = [
            'setup', 'troubleshooting', 'features', 'battery',
            'connectivity', 'sound', 'pairing', 'warranty'
        ]
        return random.sample(all_tags, random.randint(2, 4))
    
    def _random_datetime(self) -> datetime:
        """生成随机时间"""
        days_ago = random.randint(0, 365)
        return datetime.now() - timedelta(days=days_ago)


def main():
    """主函数"""
    project_root = "/Users/cavin/Desktop/dev/ankersckcp"
    generator = MockDataGenerator(project_root)
    
    print("\n🎲 Mock数据生成器")
    print("选择要生成的数据类型:")
    print("1. 知识库数据 (10000条)")
    print("2. 内容数据 (500条)")
    print("3. 对话数据 (1000条)")
    print("4. 分析数据 (30天)")
    print("5. 全部生成")
    print("0. 退出")
    
    choice = input("\n请选择 (0-5): ").strip()
    
    if choice == '1':
        generator.generate_knowledge_items()
    elif choice == '2':
        generator.generate_content_items()
    elif choice == '3':
        generator.generate_conversations()
    elif choice == '4':
        generator.generate_analytics_data()
    elif choice == '5':
        generator.generate_all()
    elif choice == '0':
        print("退出")
    else:
        print("无效选择")


if __name__ == "__main__":
    main()
