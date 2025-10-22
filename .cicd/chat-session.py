#!/usr/bin/env python3
"""
Chat会话启动脚本
确保每个Chat会话都能自动恢复上下文并继续开发
"""

import json
import os
from datetime import datetime
from pathlib import Path

class ChatSessionManager:
    """Chat会话管理器"""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.cicd_dir = self.project_root / ".cicd"
        self.state_file = self.cicd_dir / "state-manager.json"
        self.session_log = self.cicd_dir / "session-log.json"
        
    def start_new_session(self) -> dict:
        """启动新的Chat会话"""
        print("=" * 60)
        print("🚀 KCP CI/CD - Chat会话启动")
        print("=" * 60)
        
        # 读取当前状态
        state = self.load_state()
        
        # 创建会话记录
        session = {
            "session_id": f"chat_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "start_time": datetime.now().isoformat(),
            "resumed_from": state.get('currentState', {})
        }
        
        # 保存会话记录
        self.save_session(session)
        
        # 显示上下文信息
        self.display_context(state)
        
        return session
    
    def load_state(self) -> dict:
        """加载当前状态"""
        if self.state_file.exists():
            with open(self.state_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def save_session(self, session: dict):
        """保存会话记录"""
        sessions = []
        if self.session_log.exists():
            with open(self.session_log, 'r', encoding='utf-8') as f:
                sessions = json.load(f)
        
        sessions.append(session)
        
        with open(self.session_log, 'w', encoding='utf-8') as f:
            json.dump(sessions, f, indent=2, ensure_ascii=False)
    
    def display_context(self, state: dict):
        """显示当前上下文"""
        print("\n📊 当前项目状态:")
        print("-" * 60)
        
        current = state.get('currentState', {})
        print(f"当前阶段: {current.get('phase', 'unknown')}")
        print(f"当前任务: {current.get('task', 'unknown')}")
        print(f"状态: {current.get('status', 'unknown')}")
        print(f"最后检查点: {current.get('lastCheckpoint', 'none')}")
        
        metrics = state.get('metrics', {})
        if metrics:
            print("\n📈 进度指标:")
            print(f"  总任务: {metrics.get('totalTasks', 0)}")
            print(f"  已完成: {metrics.get('completedTasks', 0)}")
            print(f"  进行中: {metrics.get('inProgressTasks', 0)}")
            print(f"  完成率: {metrics.get('completedTasks', 0) / metrics.get('totalTasks', 1) * 100:.1f}%")
        
        checkpoints = state.get('checkpoints', [])
        if checkpoints:
            last_cp = checkpoints[-1]
            print("\n🎯 最近检查点:")
            print(f"  ID: {last_cp.get('id')}")
            print(f"  描述: {last_cp.get('description')}")
            print(f"  时间: {last_cp.get('timestamp')}")
        
        print("\n" + "=" * 60)
        print("✅ 上下文已加载,可以继续开发!")
        print("=" * 60)
        
        # 提供下一步建议
        self.suggest_next_actions(state)
    
    def suggest_next_actions(self, state: dict):
        """建议下一步行动"""
        print("\n💡 建议的下一步行动:")
        print("-" * 60)
        
        current_phase = state.get('currentState', {}).get('phase', '')
        
        actions = {
            "initialization": [
                "✓ 初始化已完成",
                "→ 建议进入设计系统阶段",
                "→ 执行: controller.run_phase('design-system')"
            ],
            "design-system": [
                "→ 继续开发组件库",
                "→ 配置Storybook文档",
                "→ 实施单元测试"
            ],
            "knowledge-hub": [
                "→ 开发知识库管理界面",
                "→ 集成知识图谱可视化",
                "→ 实现智能检索功能"
            ]
        }
        
        if current_phase in actions:
            for action in actions[current_phase]:
                print(f"  {action}")
        else:
            print("  → 查看开发计划文档")
            print("  → 运行: python .cicd/controller.py")
        
        print("")


def main():
    """主函数"""
    project_root = "/Users/cavin/Desktop/dev/ankersckcp"
    manager = ChatSessionManager(project_root)
    manager.start_new_session()


if __name__ == "__main__":
    main()
