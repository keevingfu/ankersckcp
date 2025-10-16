#!/bin/bash

# Figma Design System Sync and Auto-Commit
# Purpose: Sync design system from Figma and auto-commit changes with smart commit message
# Usage: ./scripts/figma-sync-and-commit.sh [--push] [--pr]

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Options
PUSH_TO_REMOTE=false
CREATE_PR=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --push)
      PUSH_TO_REMOTE=true
      shift
      ;;
    --pr)
      CREATE_PR=true
      PUSH_TO_REMOTE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--push] [--pr]"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🎨 Figma Design System Auto-Sync${NC}"
echo "========================================"

# Step 1: Run design system sync
echo -e "\n${YELLOW}Step 1: Syncing design system from Figma...${NC}"
if ! ./scripts/figma-sync-design-system.sh; then
  echo -e "${RED}❌ Design system sync failed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Design system synced${NC}"

# Step 2: Check for changes
echo -e "\n${YELLOW}Step 2: Detecting changes...${NC}"
DESIGN_SYSTEM_DIR="frontend/styles/design-system"

if ! git diff --quiet "$DESIGN_SYSTEM_DIR" 2>/dev/null; then
  CHANGES_DETECTED=true
  echo -e "${GREEN}✅ Changes detected in design system${NC}"
else
  CHANGES_DETECTED=false
  echo -e "${BLUE}ℹ️  No changes detected${NC}"
fi

if [ "$CHANGES_DETECTED" = false ]; then
  echo -e "\n${BLUE}No design system changes to commit${NC}"
  exit 0
fi

# Step 3: Analyze changes
echo -e "\n${YELLOW}Step 3: Analyzing changes...${NC}"

CHANGED_FILES=$(git diff --name-only "$DESIGN_SYSTEM_DIR")
CHANGE_SUMMARY=""

if echo "$CHANGED_FILES" | grep -q "colors.ts"; then
  COLOR_CHANGES=$(git diff "$DESIGN_SYSTEM_DIR/colors.ts" | grep -E "^\+.*:\s*'#" | wc -l | tr -d ' ')
  if [ "$COLOR_CHANGES" -gt 0 ]; then
    CHANGE_SUMMARY="${CHANGE_SUMMARY}- Updated $COLOR_CHANGES color tokens\n"
  fi
fi

if echo "$CHANGED_FILES" | grep -q "typography.ts"; then
  CHANGE_SUMMARY="${CHANGE_SUMMARY}- Updated typography system\n"
fi

if echo "$CHANGED_FILES" | grep -q "spacing.ts"; then
  CHANGE_SUMMARY="${CHANGE_SUMMARY}- Updated spacing and layout tokens\n"
fi

if echo "$CHANGED_FILES" | grep -q "effects.ts"; then
  CHANGE_SUMMARY="${CHANGE_SUMMARY}- Updated visual effects (shadows, transitions)\n"
fi

# Count total lines changed
LINES_ADDED=$(git diff --numstat "$DESIGN_SYSTEM_DIR" | awk '{sum+=$1} END {print sum}')
LINES_REMOVED=$(git diff --numstat "$DESIGN_SYSTEM_DIR" | awk '{sum+=$2} END {print sum}')

echo -e "${GREEN}Changes detected:${NC}"
echo -e "$CHANGE_SUMMARY"
echo -e "Lines: ${GREEN}+$LINES_ADDED${NC} ${RED}-$LINES_REMOVED${NC}"

# Step 4: Create commit message
COMMIT_MESSAGE=$(cat <<EOF
chore(design): sync design system from Figma

$(echo -e "$CHANGE_SUMMARY" | sed 's/^/  /')
Synced from: Soundcore-KCP-Design-System (ctmaLDzdgeg1nMpdHnMpvd)
Timestamp: $(date +"%Y-%m-%d %H:%M:%S")

Changes: +$LINES_ADDED -$LINES_REMOVED lines
Affected files:
$(echo "$CHANGED_FILES" | sed 's/^/  - /')

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)

# Step 5: Stage changes
echo -e "\n${YELLOW}Step 4: Staging changes...${NC}"
git add "$DESIGN_SYSTEM_DIR"
git add design-system-sync-report.md 2>/dev/null || true

echo -e "${GREEN}✅ Changes staged${NC}"

# Step 6: Commit
echo -e "\n${YELLOW}Step 5: Creating commit...${NC}"
echo -e "${BLUE}Commit message:${NC}"
echo "----------------------------------------"
echo "$COMMIT_MESSAGE"
echo "----------------------------------------"

if git commit -m "$COMMIT_MESSAGE"; then
  echo -e "${GREEN}✅ Commit created${NC}"
  COMMIT_HASH=$(git rev-parse --short HEAD)
  echo -e "Commit: ${BLUE}$COMMIT_HASH${NC}"
else
  echo -e "${RED}❌ Commit failed${NC}"
  exit 1
fi

# Step 7: Push to remote (if requested)
if [ "$PUSH_TO_REMOTE" = true ]; then
  echo -e "\n${YELLOW}Step 6: Pushing to remote...${NC}"

  CURRENT_BRANCH=$(git branch --show-current)

  if git push origin "$CURRENT_BRANCH"; then
    echo -e "${GREEN}✅ Pushed to origin/$CURRENT_BRANCH${NC}"
  else
    echo -e "${RED}❌ Push failed${NC}"
    exit 1
  fi
fi

# Step 8: Create PR (if requested)
if [ "$CREATE_PR" = true ]; then
  echo -e "\n${YELLOW}Step 7: Creating pull request...${NC}"

  # Check if gh CLI is available
  if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) not found${NC}"
    echo "Install: brew install gh"
    exit 1
  fi

  PR_TITLE="chore(design): sync design system from Figma"
  PR_BODY=$(cat <<EOF
## Design System Sync

This PR contains automated design system updates synced from Figma.

### Changes Summary
$(echo -e "$CHANGE_SUMMARY")

### Figma Source
- **File**: Soundcore-KCP-Design-System
- **File Key**: ctmaLDzdgeg1nMpdHnMpvd
- **Timestamp**: $(date +"%Y-%m-%d %H:%M:%S")

### Statistics
- Lines added: $LINES_ADDED
- Lines removed: $LINES_REMOVED

### Affected Files
$(echo "$CHANGED_FILES" | sed 's/^/- /')

### Test Plan
- [ ] Type check: \`cd frontend && npm run type-check\`
- [ ] Build: \`cd frontend && npm run build\`
- [ ] Visual regression tests pass
- [ ] Design tokens work in components

### Next Steps
1. Review design token changes
2. Update components using new tokens
3. Run visual regression tests
4. Merge after approval

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)

  if gh pr create --title "$PR_TITLE" --body "$PR_BODY" --label "design-system,automated"; then
    echo -e "${GREEN}✅ Pull request created${NC}"
  else
    echo -e "${RED}❌ PR creation failed${NC}"
    exit 1
  fi
fi

# Step 9: Notify via Slack (if webhook configured)
if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
  echo -e "\n${YELLOW}Step 8: Sending Slack notification...${NC}"

  SLACK_MESSAGE=$(cat <<EOF
{
  "text": "🎨 Design System Sync Completed",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🎨 Design System Synced from Figma"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Changes:*\n$(echo -e "$CHANGE_SUMMARY" | sed 's/^/• /')"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Commit:*\n\`$COMMIT_HASH\`"
        },
        {
          "type": "mrkdwn",
          "text": "*Changes:*\n+$LINES_ADDED -$LINES_REMOVED"
        }
      ]
    }
  ]
}
EOF
)

  if curl -X POST -H 'Content-type: application/json' --data "$SLACK_MESSAGE" "$SLACK_WEBHOOK_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Slack notification sent${NC}"
  else
    echo -e "${YELLOW}⚠️  Slack notification failed (non-critical)${NC}"
  fi
fi

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Design System Sync Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Commit: ${BLUE}$COMMIT_HASH${NC}"
echo -e "Changed files: ${BLUE}$(echo "$CHANGED_FILES" | wc -l | tr -d ' ')${NC}"
echo -e "Changes: ${GREEN}+$LINES_ADDED${NC} ${RED}-$LINES_REMOVED${NC}"

if [ "$PUSH_TO_REMOTE" = true ]; then
  echo -e "Pushed to: ${BLUE}origin/$(git branch --show-current)${NC}"
fi

if [ "$CREATE_PR" = true ]; then
  echo -e "PR: ${BLUE}$(gh pr view --json url -q .url 2>/dev/null || echo 'Created')${NC}"
fi

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. cd frontend && npm run type-check"
echo "  2. npm run build"
echo "  3. Test components with new design tokens"
echo ""
