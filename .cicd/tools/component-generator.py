#!/usr/bin/env python3
"""
React组件自动生成器
使用Desktop Commander快速生成组件 + 测试 + Storybook
"""

import os
import sys
from pathlib import Path
from datetime import datetime

class ComponentGenerator:
    """组件生成器"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.frontend_root = self.project_root / "frontend"
        
    def generate_component(self, name: str, component_type: str = "ui", 
                          with_props: bool = True):
        """
        生成单个组件
        
        Args:
            name: 组件名称 (e.g., "Button", "Card")
            component_type: 组件类型 ("ui" 或 "business")
            with_props: 是否生成属性接口
        """
        print(f"\n🚀 生成组件: {name}")
        
        base_path = self.frontend_root / "components" / component_type
        base_path.mkdir(parents=True, exist_ok=True)
        
        # 1. 生成组件文件
        component_code = self._generate_component_code(name, with_props)
        component_file = base_path / f"{name}.tsx"
        with open(component_file, 'w', encoding='utf-8') as f:
            f.write(component_code)
        print(f"  ✓ 组件文件: {component_file}")
        
        # 2. 生成测试文件
        test_code = self._generate_test_code(name)
        test_file = base_path / f"{name}.test.tsx"
        with open(test_file, 'w', encoding='utf-8') as f:
            f.write(test_code)
        print(f"  ✓ 测试文件: {test_file}")
        
        # 3. 生成Storybook文件
        story_code = self._generate_story_code(name, component_type)
        story_file = base_path / f"{name}.stories.tsx"
        with open(story_file, 'w', encoding='utf-8') as f:
            f.write(story_code)
        print(f"  ✓ Story文件: {story_file}")
        
        # 4. 生成index.ts导出
        self._update_index_file(base_path, name)
        
        print(f"✅ {name} 组件生成完成!\n")
        
    def _generate_component_code(self, name: str, with_props: bool) -> str:
        """生成组件代码"""
        props_interface = f"""
export interface {name}Props {{
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}}
""" if with_props else ""
        
        props_param = f"props: {name}Props" if with_props else ""
        props_usage = "{ className, children, onClick }" if with_props else ""
        
        return f'''import React from 'react';

{props_interface}
/**
 * {name} 组件
 * 
 * @component
 * @example
 * <{name}>Content</{name}>
 */
export const {name}: React.FC<{{{props_param}}}> = ({props_usage}) => {{
  return (
    <div 
      className={{`{name.lower()} ${{className || ''}}`}}
      onClick={{onClick}}
    >
      {{children || '{name}'}}
    </div>
  );
}};

{name}.displayName = '{name}';
'''
    
    def _generate_test_code(self, name: str) -> str:
        """生成测试代码"""
        return f'''import {{ render, screen, fireEvent }} from '@testing-library/react';
import {{ {name} }} from './{name}';

describe('{name}', () => {{
  it('renders correctly', () => {{
    render(<{name}>Test Content</{name}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  }});

  it('applies custom className', () => {{
    const {{ container }} = render(
      <{name} className="custom-class">Content</{name}>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  }});

  it('handles onClick event', () => {{
    const handleClick = jest.fn();
    render(<{name} onClick={{handleClick}}>Click Me</{name}>);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  }});

  it('renders children', () => {{
    render(
      <{name}>
        <span>Child Element</span>
      </{name}>
    );
    expect(screen.getByText('Child Element')).toBeInTheDocument();
  }});
}});
'''
    
    def _generate_story_code(self, name: str, component_type: str) -> str:
        """生成Storybook代码"""
        return f'''import type {{ Meta, StoryObj }} from '@storybook/react';
import {{ {name} }} from './{name}';

const meta: Meta<typeof {name}> = {{
  title: 'Components/{component_type.title()}/{name}',
  component: {name},
  parameters: {{
    layout: 'centered',
  }},
  tags: ['autodocs'],
  argTypes: {{
    onClick: {{ action: 'clicked' }},
    className: {{
      control: 'text',
      description: 'Custom CSS class',
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {name}>;

export const Default: Story = {{
  args: {{
    children: 'Default {name}',
  }},
}};

export const WithCustomClass: Story = {{
  args: {{
    children: 'Styled {name}',
    className: 'text-blue-600 font-bold',
  }},
}};

export const Interactive: Story = {{
  args: {{
    children: 'Click Me',
    onClick: () => alert('{name} clicked!'),
  }},
}};
'''
    
    def _update_index_file(self, base_path: Path, name: str):
        """更新index.ts导出文件"""
        index_file = base_path / "index.ts"
        export_line = f"export {{ {name} }} from './{name}';\n"
        
        if index_file.exists():
            with open(index_file, 'r', encoding='utf-8') as f:
                content = f.read()
            if export_line not in content:
                with open(index_file, 'a', encoding='utf-8') as f:
                    f.write(export_line)
        else:
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write(export_line)
        
        print(f"  ✓ 更新索引: {index_file}")
    
    def batch_generate(self, components: list, component_type: str = "ui"):
        """批量生成组件"""
        print(f"\n{'='*60}")
        print(f"批量生成 {len(components)} 个组件")
        print(f"{'='*60}\n")
        
        for comp in components:
            self.generate_component(comp, component_type)
        
        print(f"\n{'='*60}")
        print(f"✅ 所有组件生成完成!")
        print(f"{'='*60}\n")


# 预定义组件列表
BASIC_UI_COMPONENTS = [
    'Button',
    'Input',
    'Select',
    'Card',
    'Modal',
    'Drawer',
    'Toast',
    'Badge',
    'Avatar',
    'Tooltip',
    'Dropdown',
    'Tag',
]

BUSINESS_COMPONENTS = [
    'KnowledgeCard',
    'ContentPreview',
    'ChatMessage',
    'StatCard',
    'MetricsChart',
    'UserProfile',
    'SearchBar',
    'FilterPanel',
]


def main():
    """主函数"""
    project_root = "/Users/cavin/Desktop/dev/ankersckcp"
    generator = ComponentGenerator(project_root)
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == '--batch':
            batch_type = sys.argv[2] if len(sys.argv) > 2 else 'basic'
            if batch_type == 'basic':
                generator.batch_generate(BASIC_UI_COMPONENTS, 'ui')
            elif batch_type == 'business':
                generator.batch_generate(BUSINESS_COMPONENTS, 'business')
            else:
                print(f"未知的批量类型: {batch_type}")
                print("可用类型: basic, business")
        
        elif command == '--single':
            if len(sys.argv) < 3:
                print("用法: --single <ComponentName> [ui|business]")
                return
            name = sys.argv[2]
            comp_type = sys.argv[3] if len(sys.argv) > 3 else 'ui'
            generator.generate_component(name, comp_type)
        
        else:
            print(f"未知命令: {command}")
            print_usage()
    else:
        print_usage()


def print_usage():
    """打印使用说明"""
    print("""
React组件生成器 - Desktop Commander工具

用法:
  python component-generator.py --batch [basic|business]
    批量生成预定义组件

  python component-generator.py --single <Name> [ui|business]
    生成单个组件

示例:
  # 生成所有基础UI组件
  python component-generator.py --batch basic

  # 生成所有业务组件
  python component-generator.py --batch business

  # 生成单个组件
  python component-generator.py --single Pagination ui

预定义组件:
  基础UI (basic): Button, Input, Select, Card, Modal...
  业务组件 (business): KnowledgeCard, ContentPreview...
""")


if __name__ == "__main__":
    main()
