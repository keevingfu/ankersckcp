#!/bin/bash

# GitLab CI Setup Helper
# Purpose: Automate GitLab CI configuration

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🦊 GitLab CI Setup Helper${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Check if .gitlab-ci.yml exists
echo -e "${YELLOW}Step 1: Checking .gitlab-ci.yml...${NC}"

if [ ! -f .gitlab-ci.yml ]; then
  echo -e "${YELLOW}Creating .gitlab-ci.yml...${NC}"
  cat > .gitlab-ci.yml << 'EOF'
# GitLab CI/CD Configuration
# Project: Anker Soundcore KCP

stages:
  - sync
  - validate
  - test
  - deploy

# Figma Design System Sync
include:
  - local: '.gitlab-ci-figma-sync.yml'
EOF
  echo -e "${GREEN}✅ .gitlab-ci.yml created${NC}"
else
  # Check if figma-sync is already included
  if grep -q "gitlab-ci-figma-sync.yml" .gitlab-ci.yml; then
    echo -e "${GREEN}✅ Figma sync already configured${NC}"
  else
    echo -e "${YELLOW}Adding Figma sync to .gitlab-ci.yml...${NC}"
    cat >> .gitlab-ci.yml << 'EOF'

# Figma Design System Sync
include:
  - local: '.gitlab-ci-figma-sync.yml'
EOF
    echo -e "${GREEN}✅ Figma sync configuration added${NC}"
  fi
fi

echo ""

# Step 2: Verify .gitlab-ci-figma-sync.yml exists
echo -e "${YELLOW}Step 2: Verifying figma-sync configuration...${NC}"

if [ ! -f .gitlab-ci-figma-sync.yml ]; then
  echo -e "${RED}❌ .gitlab-ci-figma-sync.yml not found${NC}"
  echo -e "${YELLOW}Please ensure the file exists before continuing${NC}"
  exit 1
else
  echo -e "${GREEN}✅ .gitlab-ci-figma-sync.yml found${NC}"
  # Validate YAML syntax
  if command -v yamllint &> /dev/null; then
    if yamllint -d relaxed .gitlab-ci-figma-sync.yml; then
      echo -e "${GREEN}✅ YAML syntax valid${NC}"
    else
      echo -e "${YELLOW}⚠️  YAML has warnings (non-critical)${NC}"
    fi
  fi
fi

echo ""

# Step 3: Check Git status
echo -e "${YELLOW}Step 3: Checking Git status...${NC}"

if git diff --quiet .gitlab-ci.yml .gitlab-ci-figma-sync.yml; then
  echo -e "${BLUE}ℹ️  No changes to commit${NC}"
  NEEDS_COMMIT=false
else
  echo -e "${YELLOW}📝 Changes detected${NC}"
  git status --short .gitlab-ci.yml .gitlab-ci-figma-sync.yml
  NEEDS_COMMIT=true
fi

echo ""

# Step 4: Commit and push
if [ "$NEEDS_COMMIT" = true ]; then
  echo -e "${YELLOW}Step 4: Commit and push changes?${NC}"
  read -p "Commit changes? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .gitlab-ci.yml .gitlab-ci-figma-sync.yml
    git commit -m "chore: configure GitLab CI for Figma design system sync"
    echo -e "${GREEN}✅ Changes committed${NC}"

    echo ""
    read -p "Push to remote? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      CURRENT_BRANCH=$(git branch --show-current)
      git push origin "$CURRENT_BRANCH"
      echo -e "${GREEN}✅ Pushed to origin/$CURRENT_BRANCH${NC}"
    fi
  fi
else
  echo -e "${YELLOW}Step 4: Skipped (no changes)${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ GitLab CI Setup Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Create GitLab Pipeline Schedule:"
echo "   ${BLUE}https://gitlab.com/[username]/[repo]/-/pipeline_schedules${NC}"
echo ""
echo "2. Configuration:"
echo "   - Description: Daily Figma Design System Sync"
echo "   - Interval: 0 9 * * *  (Every day at 9:00 AM)"
echo "   - Target: main"
echo "   - Activated: ✅"
echo ""
echo "3. (Optional) Configure Slack notifications:"
echo "   ${BLUE}https://gitlab.com/[username]/[repo]/-/settings/ci_cd${NC}"
echo "   Add variable: SLACK_WEBHOOK_URL"
echo ""
echo "4. Test the pipeline:"
echo "   ${BLUE}https://gitlab.com/[username]/[repo]/-/pipelines${NC}"
echo "   Click 'Run pipeline'"
echo ""
echo "📚 Full guide: CI-CD-SETUP-GUIDE.md"
echo ""
