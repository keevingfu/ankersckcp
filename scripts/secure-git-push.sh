#!/bin/bash

# Secure Git Push Script
# This script safely pushes code to GitHub/GitLab using tokens from .env file
# It ensures tokens are never exposed in Git history or command line

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🔒 Secure Git Push                                      ║
║                                                            ║
║   Safely push code using tokens from .env file            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ============================================
# Step 1: Security Checks
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 Step 1: Security Checks${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo -e "${RED}❌ Error: .env file not found${NC}"
  echo ""
  echo "Please create .env file first:"
  echo "  1. Copy .env.template to .env"
  echo "  2. Fill in your tokens"
  echo ""
  echo -e "${YELLOW}Command:${NC}"
  echo "  cp .env.template .env"
  echo "  nano .env  # or use your preferred editor"
  exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"

# Check if .env is in .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
  echo -e "${RED}❌ Error: .env is not in .gitignore${NC}"
  echo "Adding .env to .gitignore for safety..."
  echo ".env" >> .gitignore
  echo -e "${GREEN}✅ .env added to .gitignore${NC}"
else
  echo -e "${GREEN}✅ .env is in .gitignore${NC}"
fi

# Check if .env is staged for commit
if git diff --cached --name-only | grep -q "^\.env$" 2>/dev/null; then
  echo -e "${RED}❌ CRITICAL: .env file is staged for commit!${NC}"
  echo "Unstaging .env file..."
  git reset HEAD .env 2>/dev/null || true
  echo -e "${GREEN}✅ .env unstaged${NC}"
fi

# Verify .env is not tracked
if git ls-files | grep -q "^\.env$" 2>/dev/null; then
  echo -e "${RED}❌ CRITICAL: .env file is tracked by Git!${NC}"
  echo "Removing .env from Git tracking..."
  git rm --cached .env 2>/dev/null || true
  echo -e "${GREEN}✅ .env removed from Git tracking${NC}"
fi

echo -e "${GREEN}✅ All security checks passed${NC}"
echo ""

# ============================================
# Step 2: Load Environment Variables
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📂 Step 2: Load Environment Variables${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Source .env file
set -a
source .env
set +a

# Validate tokens
GITHUB_CONFIGURED=false
GITLAB_CONFIGURED=false

if [ -n "${GITHUB_TOKEN:-}" ] && [ -n "${GITHUB_REPO_URL:-}" ]; then
  GITHUB_CONFIGURED=true
  echo -e "${GREEN}✅ GitHub configuration found${NC}"
  echo "   Repository: ${GITHUB_REPO_URL}"
else
  echo -e "${YELLOW}⏩ GitHub not configured (skipping)${NC}"
fi

if [ -n "${GITLAB_TOKEN:-}" ] && [ -n "${GITLAB_REPO_URL:-}" ]; then
  GITLAB_CONFIGURED=true
  echo -e "${GREEN}✅ GitLab configuration found${NC}"
  echo "   Repository: ${GITLAB_REPO_URL}"
else
  echo -e "${YELLOW}⏩ GitLab not configured (skipping)${NC}"
fi

if [ "$GITHUB_CONFIGURED" = false ] && [ "$GITLAB_CONFIGURED" = false ]; then
  echo -e "${RED}❌ Error: No repository configured${NC}"
  echo ""
  echo "Please configure at least one repository in .env:"
  echo "  - GITHUB_TOKEN and GITHUB_REPO_URL"
  echo "  - GITLAB_TOKEN and GITLAB_REPO_URL"
  exit 1
fi

echo ""

# ============================================
# Step 3: Configure Git Remotes
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 Step 3: Configure Git Remotes${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to configure remote with token
configure_remote() {
  local remote_name=$1
  local token=$2
  local repo_url=$3

  # Extract username and repo from URL
  local url_with_token
  if [[ $repo_url == https://github.com/* ]]; then
    # GitHub format: https://TOKEN@github.com/username/repo.git
    url_with_token="https://${token}@${repo_url#https://}"
  elif [[ $repo_url == https://gitlab.com/* ]]; then
    # GitLab format: https://oauth2:TOKEN@gitlab.com/username/repo.git
    url_with_token="https://oauth2:${token}@${repo_url#https://}"
  else
    echo -e "${RED}❌ Unsupported repository URL format${NC}"
    return 1
  fi

  # Check if remote exists
  if git remote get-url "$remote_name" &>/dev/null; then
    echo "Updating existing remote: $remote_name"
    git remote set-url "$remote_name" "$url_with_token"
  else
    echo "Adding new remote: $remote_name"
    git remote add "$remote_name" "$url_with_token"
  fi

  echo -e "${GREEN}✅ Remote '$remote_name' configured${NC}"
}

# Configure GitHub
if [ "$GITHUB_CONFIGURED" = true ]; then
  configure_remote "github" "$GITHUB_TOKEN" "$GITHUB_REPO_URL"
fi

# Configure GitLab
if [ "$GITLAB_CONFIGURED" = true ]; then
  configure_remote "origin" "$GITLAB_TOKEN" "$GITLAB_REPO_URL"
fi

echo ""

# ============================================
# Step 4: Git Status Check
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Step 4: Git Status Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: ${CYAN}${CURRENT_BRANCH}${NC}"

# Count commits
COMMIT_COUNT=$(git rev-list --count HEAD)
echo "Total commits: ${CYAN}${COMMIT_COUNT}${NC}"

# Show recent commits
echo ""
echo "Recent commits:"
git log --oneline -3 | sed 's/^/  /'

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo ""
  echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
  echo ""
  git status --short | head -5 | sed 's/^/  /'
  echo ""
  read -p "Do you want to commit these changes first? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter commit message: " COMMIT_MSG
    git add .
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}✅ Changes committed${NC}"
  fi
fi

echo ""

# ============================================
# Step 5: Push to Remote Repositories
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Step 5: Push to Remote Repositories${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PUSH_SUCCESS=0
PUSH_FAILED=0

# Push to GitHub
if [ "$GITHUB_CONFIGURED" = true ]; then
  echo -e "${YELLOW}Pushing to GitHub...${NC}"
  if git push -u github "$CURRENT_BRANCH" 2>&1; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub${NC}"
    ((PUSH_SUCCESS++))
  else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    ((PUSH_FAILED++))
  fi
  echo ""
fi

# Push to GitLab
if [ "$GITLAB_CONFIGURED" = true ]; then
  echo -e "${YELLOW}Pushing to GitLab...${NC}"
  if git push -u origin "$CURRENT_BRANCH" 2>&1; then
    echo -e "${GREEN}✅ Successfully pushed to GitLab${NC}"
    ((PUSH_SUCCESS++))
  else
    echo -e "${RED}❌ Failed to push to GitLab${NC}"
    ((PUSH_FAILED++))
  fi
  echo ""
fi

# ============================================
# Step 6: Clean Up (Remove Tokens from Remote URLs)
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧹 Step 6: Security Cleanup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Remove tokens from remote URLs for security
cleanup_remote() {
  local remote_name=$1
  local repo_url=$2

  if git remote get-url "$remote_name" &>/dev/null; then
    git remote set-url "$remote_name" "$repo_url"
    echo -e "${GREEN}✅ Cleaned up remote: $remote_name${NC}"
  fi
}

if [ "$GITHUB_CONFIGURED" = true ]; then
  cleanup_remote "github" "$GITHUB_REPO_URL"
fi

if [ "$GITLAB_CONFIGURED" = true ]; then
  cleanup_remote "origin" "$GITLAB_REPO_URL"
fi

echo ""

# ============================================
# Summary
# ============================================
echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ Push Complete!                                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✅ Successful pushes: $PUSH_SUCCESS${NC}"
if [ $PUSH_FAILED -gt 0 ]; then
  echo -e "  ${RED}❌ Failed pushes: $PUSH_FAILED${NC}"
fi
echo ""

# Display repository links
if [ "$GITHUB_CONFIGURED" = true ]; then
  GITHUB_WEB_URL="${GITHUB_REPO_URL%.git}"
  echo -e "${CYAN}GitHub Repository:${NC}"
  echo "  $GITHUB_WEB_URL"
  echo ""
fi

if [ "$GITLAB_CONFIGURED" = true ]; then
  GITLAB_WEB_URL="${GITLAB_REPO_URL%.git}"
  echo -e "${CYAN}GitLab Repository:${NC}"
  echo "  $GITLAB_WEB_URL"
  echo ""
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}🔒 Security Note:${NC}"
echo "  • Tokens are stored in .env (not committed to Git)"
echo "  • Remote URLs have been cleaned (tokens removed)"
echo "  • Your credentials are safe"
echo ""
echo -e "${GREEN}✅ All done! Your code is now in the cloud.${NC}"
echo ""
