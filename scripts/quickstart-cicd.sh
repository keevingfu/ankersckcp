#!/bin/bash

# CI/CD Quick Start Script
# Purpose: One-click setup for CI/CD automation

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Figma Design System CI/CD Quick Start               ║
║                                                            ║
║   自动化设计系统同步 - 一键配置向导                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${BLUE}欢迎使用 CI/CD 快速配置向导！${NC}"
echo ""
echo "这个脚本将帮助你完成:"
echo "  ✅ GitLab CI/CD 配置"
echo "  ✅ GitHub Actions 配置"
echo "  ✅ Slack 通知配置"
echo ""

read -p "按回车键开始配置，或 Ctrl+C 取消..."

echo ""

# ============================================
# Step 1: GitLab CI/CD
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Step 1/3: GitLab CI/CD 配置${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "是否配置 GitLab CI/CD? (Y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
  echo ""
  echo -e "${YELLOW}运行 GitLab CI setup...${NC}"
  ./scripts/setup-gitlab-ci.sh

  echo ""
  echo -e "${GREEN}✅ GitLab CI 配置完成${NC}"
  echo ""
  echo -e "${YELLOW}下一步需要在 GitLab Web UI 中操作:${NC}"
  echo ""
  echo "1. 访问: https://gitlab.com/[username]/[repo]/-/pipeline_schedules"
  echo "2. 点击 'New schedule'"
  echo "3. 配置:"
  echo "   - Description: Daily Figma Design System Sync"
  echo "   - Interval: 0 9 * * *"
  echo "   - Target: main"
  echo "   - Activated: ✅"
  echo "4. 保存并点击 'Play' 测试"
  echo ""

  read -p "完成 GitLab Schedule 配置后，按回车继续..."
else
  echo -e "${BLUE}⏩ 跳过 GitLab CI 配置${NC}"
fi

echo ""

# ============================================
# Step 2: GitHub Actions
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Step 2/3: GitHub Actions 配置${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "是否配置 GitHub Actions? (Y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
  echo ""

  # Check if workflow file exists
  if [ -f ".github/workflows/figma-sync.yml" ]; then
    echo -e "${GREEN}✅ GitHub Actions workflow 文件已存在${NC}"

    # Check if pushed
    if git ls-remote --exit-code --heads origin main > /dev/null 2>&1; then
      echo -e "${YELLOW}检查是否已推送到远程...${NC}"

      # Check if file is in remote
      if git ls-tree -r origin/main --name-only | grep -q "^.github/workflows/figma-sync.yml$"; then
        echo -e "${GREEN}✅ Workflow 文件已在远程仓库${NC}"
      else
        echo -e "${YELLOW}📤 需要推送到远程...${NC}"
        read -p "现在推送? (Y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
          git add .github/workflows/figma-sync.yml
          git commit -m "chore: add GitHub Actions workflow for Figma sync" || true
          git push origin main
          echo -e "${GREEN}✅ 已推送到远程${NC}"
        fi
      fi
    fi
  else
    echo -e "${RED}❌ .github/workflows/figma-sync.yml 未找到${NC}"
  fi

  echo ""
  echo -e "${YELLOW}下一步需要在 GitHub Web UI 中操作:${NC}"
  echo ""
  echo "1. 访问: https://github.com/[username]/[repo]/actions"
  echo "2. 找到 'Figma Design System Sync'"
  echo "3. 点击 'Run workflow'"
  echo "4. 选择 branch: main"
  echo "5. 点击绿色的 'Run workflow' 按钮"
  echo "6. 等待完成并检查结果"
  echo ""

  read -p "完成 GitHub Actions 测试后，按回车继续..."
else
  echo -e "${BLUE}⏩ 跳过 GitHub Actions 配置${NC}"
fi

echo ""

# ============================================
# Step 3: Slack Notifications
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Step 3/3: Slack 通知配置${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "是否配置 Slack 通知? (Y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
  echo ""
  echo -e "${YELLOW}Slack Webhook 配置步骤:${NC}"
  echo ""
  echo "1. 访问: https://api.slack.com/apps"
  echo "2. 创建新 App:"
  echo "   - Create New App → From scratch"
  echo "   - Name: Figma Design System Sync"
  echo "   - Workspace: [选择你的工作区]"
  echo ""
  echo "3. 启用 Incoming Webhooks:"
  echo "   - 左侧菜单 → Incoming Webhooks"
  echo "   - 右上角切换到 'On'"
  echo "   - 点击 'Add New Webhook to Workspace'"
  echo "   - 选择频道 (如 #dev-notifications)"
  echo "   - 点击 'Allow'"
  echo ""
  echo "4. 复制 Webhook URL"
  echo "   格式: https://hooks.slack.com/services/..."
  echo ""

  read -p "已完成上述步骤? (y/N) " -n 1 -r
  echo

  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}请输入你的 Slack Webhook URL:${NC}"
    read -p "Webhook URL: " SLACK_WEBHOOK_URL

    if [ -n "$SLACK_WEBHOOK_URL" ]; then
      # Test webhook
      echo ""
      echo -e "${YELLOW}测试 Slack Webhook...${NC}"

      if ./scripts/test-slack-webhook.sh "$SLACK_WEBHOOK_URL"; then
        echo ""
        echo -e "${GREEN}✅ Slack Webhook 测试成功!${NC}"
        echo ""
        echo -e "${YELLOW}请在以下位置配置 SLACK_WEBHOOK_URL:${NC}"
        echo ""
        echo "GitLab:"
        echo "  https://gitlab.com/[username]/[repo]/-/settings/ci_cd"
        echo "  Variables → Add variable"
        echo "  Key: SLACK_WEBHOOK_URL"
        echo "  Value: $SLACK_WEBHOOK_URL"
        echo "  Masked: ✅"
        echo ""
        echo "GitHub:"
        echo "  https://github.com/[username]/[repo]/settings/secrets/actions"
        echo "  Variables → New repository variable"
        echo "  Name: SLACK_WEBHOOK_URL"
        echo "  Value: $SLACK_WEBHOOK_URL"
        echo ""

        read -p "完成 Slack 配置后，按回车继续..."
      else
        echo ""
        echo -e "${RED}❌ Slack Webhook 测试失败${NC}"
        echo "请检查 URL 是否正确"
      fi
    fi
  fi
else
  echo -e "${BLUE}⏩ 跳过 Slack 配置${NC}"
fi

echo ""

# ============================================
# Summary
# ============================================
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎉 配置完成！                                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${GREEN}✅ CI/CD 自动化配置完成!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 配置总结${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "你现在可以实现:"
echo ""
echo "  ✅ 全自动设计系统同步"
echo "     • 每天自动从 Figma 同步"
echo "     • 自动提交到 Git"
echo "     • 自动运行测试"
echo "     • 自动发送通知"
echo ""
echo "  ✅ 零人工干预"
echo "     • 设计师更新 Figma"
echo "     • 系统自动同步"
echo "     • 自动测试验证"
echo "     • 失败自动通知"
echo ""
echo "  ✅ 完整的可观测性"
echo "     • Pipeline 实时状态"
echo "     • Slack 实时通知"
echo "     • 详细日志记录"
echo "     • 测试报告生成"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}🚀 下一步:${NC}"
echo ""
echo "1. 验证所有配置:"
echo "   ${CYAN}./scripts/verify-cicd-setup.sh${NC}"
echo ""
echo "2. 手动触发测试:"
echo "   • GitLab: CI/CD → Schedules → Play"
echo "   • GitHub: Actions → Run workflow"
echo ""
echo "3. 等待第一次自动运行:"
echo "   • 时间: 每天 9:00 AM"
echo "   • 检查 Slack 通知"
echo "   • 验证 Git commits"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📚 相关文档:${NC}"
echo "  • QUICK-CICD-SETUP.md - 快速配置指南"
echo "  • CI-CD-SETUP-GUIDE.md - 完整设置指南"
echo "  • FIGMA-AUTOMATION-COMPLETE.md - 自动化文档"
echo ""
echo -e "${GREEN}🎊 恭喜！你已完成所有配置！${NC}"
echo ""
