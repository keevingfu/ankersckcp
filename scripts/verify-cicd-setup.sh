#!/bin/bash

# CI/CD Setup Verification Script
# Purpose: Verify all CI/CD configurations are correct

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Counters
PASS=0
FAIL=0
WARN=0

check_pass() {
  echo -e "${GREEN}  ✅ $1${NC}"
  ((PASS++))
}

check_fail() {
  echo -e "${RED}  ❌ $1${NC}"
  ((FAIL++))
}

check_warn() {
  echo -e "${YELLOW}  ⚠️  $1${NC}"
  ((WARN++))
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 CI/CD Setup Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# Section 1: Design System Files
# ============================================
echo -e "${BLUE}📦 Section 1: Design System Files${NC}"

if [ -d "frontend/styles/design-system" ]; then
  check_pass "Design system directory exists"

  for file in colors.ts typography.ts spacing.ts effects.ts index.ts; do
    if [ -f "frontend/styles/design-system/$file" ]; then
      check_pass "$file exists"
    else
      check_fail "$file missing"
    fi
  done
else
  check_fail "Design system directory not found"
fi

echo ""

# ============================================
# Section 2: Automation Scripts
# ============================================
echo -e "${BLUE}🤖 Section 2: Automation Scripts${NC}"

SCRIPTS=(
  "figma-sync-design-system.sh"
  "figma-sync-and-commit.sh"
  "figma-webhook-handler.sh"
  "setup-figma-cron.sh"
  "figma-sync-monitor.sh"
  "setup-gitlab-ci.sh"
  "test-slack-webhook.sh"
)

for script in "${SCRIPTS[@]}"; do
  if [ -f "scripts/$script" ]; then
    if [ -x "scripts/$script" ]; then
      check_pass "$script (executable)"
    else
      check_warn "$script exists but not executable"
      echo -e "    ${YELLOW}Fix: chmod +x scripts/$script${NC}"
    fi
  else
    check_fail "$script not found"
  fi
done

echo ""

# ============================================
# Section 3: GitLab CI/CD
# ============================================
echo -e "${BLUE}🦊 Section 3: GitLab CI/CD${NC}"

if [ -f ".gitlab-ci-figma-sync.yml" ]; then
  check_pass ".gitlab-ci-figma-sync.yml exists"

  # Check file size
  SIZE=$(wc -c < .gitlab-ci-figma-sync.yml)
  if [ "$SIZE" -gt 5000 ]; then
    check_pass "File size OK ($SIZE bytes)"
  else
    check_warn "File seems small ($SIZE bytes)"
  fi
else
  check_fail ".gitlab-ci-figma-sync.yml not found"
fi

if [ -f ".gitlab-ci.yml" ]; then
  if grep -q "gitlab-ci-figma-sync.yml" .gitlab-ci.yml; then
    check_pass ".gitlab-ci.yml includes figma-sync"
  else
    check_warn ".gitlab-ci.yml exists but doesn't include figma-sync"
    echo -e "    ${YELLOW}Run: ./scripts/setup-gitlab-ci.sh${NC}"
  fi
else
  check_warn ".gitlab-ci.yml not found"
  echo -e "    ${YELLOW}Run: ./scripts/setup-gitlab-ci.sh${NC}"
fi

echo ""

# ============================================
# Section 4: GitHub Actions
# ============================================
echo -e "${BLUE}🐙 Section 4: GitHub Actions${NC}"

if [ -d ".github/workflows" ]; then
  check_pass ".github/workflows directory exists"

  if [ -f ".github/workflows/figma-sync.yml" ]; then
    check_pass "figma-sync.yml exists"

    # Check file size
    SIZE=$(wc -c < .github/workflows/figma-sync.yml)
    if [ "$SIZE" -gt 10000 ]; then
      check_pass "File size OK ($SIZE bytes)"
    else
      check_warn "File seems small ($SIZE bytes)"
    fi

    # Check for required triggers
    if grep -q "workflow_dispatch" .github/workflows/figma-sync.yml; then
      check_pass "Manual trigger configured"
    else
      check_fail "Manual trigger not found"
    fi

    if grep -q "schedule" .github/workflows/figma-sync.yml; then
      check_pass "Scheduled trigger configured"
    else
      check_warn "Scheduled trigger not found"
    fi
  else
    check_fail "figma-sync.yml not found"
  fi
else
  check_fail ".github/workflows directory not found"
fi

echo ""

# ============================================
# Section 5: Webhook Server
# ============================================
echo -e "${BLUE}🔔 Section 5: Webhook Server${NC}"

if [ -f "figma-webhook-server.js" ]; then
  check_pass "figma-webhook-server.js exists"
else
  check_fail "figma-webhook-server.js not found"
fi

if [ -f "ecosystem.config.js" ]; then
  check_pass "ecosystem.config.js (PM2) exists"
else
  check_warn "ecosystem.config.js not found"
fi

if [ -f "figma-webhook.service" ]; then
  check_pass "figma-webhook.service (Systemd) exists"
else
  check_warn "figma-webhook.service not found"
fi

echo ""

# ============================================
# Section 6: Testing
# ============================================
echo -e "${BLUE}🧪 Section 6: Visual Regression Testing${NC}"

if [ -d "frontend/tests/visual-regression" ]; then
  check_pass "Visual regression tests directory exists"

  if [ -f "frontend/tests/visual-regression/components.spec.ts" ]; then
    check_pass "components.spec.ts exists"
  else
    check_fail "components.spec.ts not found"
  fi

  if [ -f "frontend/playwright.config.ts" ]; then
    check_pass "playwright.config.ts exists"
  else
    check_fail "playwright.config.ts not found"
  fi
else
  check_fail "Visual regression tests directory not found"
fi

echo ""

# ============================================
# Section 7: Documentation
# ============================================
echo -e "${BLUE}📚 Section 7: Documentation${NC}"

DOCS=(
  "FIGMA-AUTOMATION-COMPLETE.md"
  "FIGMA-WEBHOOK-SETUP.md"
  "FIGMA-INTEGRATION-COMPLETE-SUMMARY.md"
  "CI-CD-SETUP-GUIDE.md"
  "frontend/COMPONENT-LIBRARY.md"
  "frontend/tests/visual-regression/README.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    check_pass "$doc"
  else
    check_warn "$doc not found"
  fi
done

echo ""

# ============================================
# Section 8: Git Status
# ============================================
echo -e "${BLUE}🔧 Section 8: Git Status${NC}"

if git rev-parse --git-dir > /dev/null 2>&1; then
  check_pass "Git repository initialized"

  # Check for uncommitted changes
  if git diff --quiet; then
    check_pass "No uncommitted changes"
  else
    check_warn "Uncommitted changes detected"
    echo -e "    ${YELLOW}Files with changes:${NC}"
    git status --short | head -5 | sed 's/^/    /'
  fi

  # Check remote
  if git remote get-url origin > /dev/null 2>&1; then
    REMOTE=$(git remote get-url origin)
    check_pass "Git remote configured: $REMOTE"
  else
    check_warn "No Git remote configured"
  fi
else
  check_fail "Not a Git repository"
fi

echo ""

# ============================================
# Section 9: Environment Check
# ============================================
echo -e "${BLUE}🌍 Section 9: Environment Check${NC}"

# Check Node.js
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  check_pass "Node.js installed ($NODE_VERSION)"
else
  check_warn "Node.js not found (needed for webhook server)"
fi

# Check npm
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  check_pass "npm installed ($NPM_VERSION)"
else
  check_warn "npm not found"
fi

# Check Git
if command -v git &> /dev/null; then
  GIT_VERSION=$(git --version)
  check_pass "Git installed ($GIT_VERSION)"
else
  check_fail "Git not found"
fi

# Check curl
if command -v curl &> /dev/null; then
  check_pass "curl installed (needed for webhooks)"
else
  check_fail "curl not found"
fi

# Check PM2 (optional)
if command -v pm2 &> /dev/null; then
  PM2_VERSION=$(pm2 --version)
  check_pass "PM2 installed ($PM2_VERSION)"
else
  check_warn "PM2 not installed (optional, for webhook server)"
  echo -e "    ${YELLOW}Install: npm install -g pm2${NC}"
fi

echo ""

# ============================================
# Summary
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✅ Passed: $PASS${NC}"
echo -e "  ${YELLOW}⚠️  Warnings: $WARN${NC}"
echo -e "  ${RED}❌ Failed: $FAIL${NC}"
echo ""

TOTAL=$((PASS + WARN + FAIL))
SCORE=$((PASS * 100 / TOTAL))

echo -e "  Score: ${BLUE}$SCORE%${NC} ($PASS/$TOTAL)"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}🎉 All critical checks passed!${NC}"
  echo ""
  echo -e "${YELLOW}Next steps:${NC}"
  echo ""
  echo "1. Configure GitLab Schedule:"
  echo "   Visit: https://gitlab.com/[username]/[repo]/-/pipeline_schedules"
  echo ""
  echo "2. Test GitHub Actions:"
  echo "   Visit: https://github.com/[username]/[repo]/actions"
  echo "   Click 'Figma Design System Sync' → 'Run workflow'"
  echo ""
  echo "3. Configure Slack notifications:"
  echo "   Run: ./scripts/test-slack-webhook.sh [webhook-url]"
  echo ""
  echo "📚 Full guide: CI-CD-SETUP-GUIDE.md"
else
  echo -e "${RED}⚠️  Some critical checks failed${NC}"
  echo ""
  echo "Please fix the failed items before proceeding."
  echo "Run this script again after fixes."
  exit 1
fi

echo ""
