#!/bin/bash

# Setup Scheduled Figma Design System Sync
# Purpose: Configure automated daily/hourly sync via cron
# Usage: ./scripts/setup-figma-cron.sh [hourly|daily|weekly]

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYNC_SCRIPT="$PROJECT_ROOT/scripts/figma-sync-and-commit.sh"
LOG_DIR="$PROJECT_ROOT/logs"

# Parse schedule argument
SCHEDULE="${1:-daily}"

if [[ ! "$SCHEDULE" =~ ^(hourly|daily|weekly|custom)$ ]]; then
  echo -e "${RED}Invalid schedule: $SCHEDULE${NC}"
  echo "Usage: $0 [hourly|daily|weekly|custom]"
  exit 1
fi

echo -e "${BLUE}🕐 Setting up Figma Design System Scheduled Sync${NC}"
echo "=========================================="
echo "Schedule: $SCHEDULE"
echo "Project: $PROJECT_ROOT"

# Create logs directory
mkdir -p "$LOG_DIR"
echo -e "${GREEN}✅ Logs directory: $LOG_DIR${NC}"

# Define cron schedules
case $SCHEDULE in
  hourly)
    CRON_SCHEDULE="0 * * * *"
    DESCRIPTION="Every hour at minute 0"
    ;;
  daily)
    CRON_SCHEDULE="0 9 * * *"
    DESCRIPTION="Every day at 9:00 AM"
    ;;
  weekly)
    CRON_SCHEDULE="0 9 * * 1"
    DESCRIPTION="Every Monday at 9:00 AM"
    ;;
  custom)
    echo -e "${YELLOW}Enter custom cron schedule (e.g., '0 */4 * * *'):${NC}"
    read -r CRON_SCHEDULE
    DESCRIPTION="Custom schedule: $CRON_SCHEDULE"
    ;;
esac

# Create wrapper script for cron
CRON_WRAPPER="$PROJECT_ROOT/scripts/figma-sync-cron-wrapper.sh"

cat > "$CRON_WRAPPER" << EOF
#!/bin/bash

# Figma Sync Cron Wrapper
# Auto-generated on $(date)

# Set up environment
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="$HOME"

# Load environment variables if .env exists
if [ -f "$PROJECT_ROOT/.env" ]; then
  set -a
  source "$PROJECT_ROOT/.env"
  set +a
fi

# Log file with timestamp
LOG_FILE="$LOG_DIR/figma-sync-\$(date +%Y%m%d-%H%M%S).log"

# Execute sync
cd "$PROJECT_ROOT"

echo "=========================================" >> "\$LOG_FILE" 2>&1
echo "Figma Design System Scheduled Sync" >> "\$LOG_FILE" 2>&1
echo "Started: \$(date)" >> "\$LOG_FILE" 2>&1
echo "=========================================" >> "\$LOG_FILE" 2>&1

if "$SYNC_SCRIPT" --push >> "\$LOG_FILE" 2>&1; then
  echo "✅ Sync completed successfully" >> "\$LOG_FILE" 2>&1
  EXIT_CODE=0
else
  echo "❌ Sync failed" >> "\$LOG_FILE" 2>&1
  EXIT_CODE=1
fi

echo "Finished: \$(date)" >> "\$LOG_FILE" 2>&1
echo "Exit code: \$EXIT_CODE" >> "\$LOG_FILE" 2>&1

# Clean up old logs (keep last 30 days)
find "$LOG_DIR" -name "figma-sync-*.log" -mtime +30 -delete

exit \$EXIT_CODE
EOF

chmod +x "$CRON_WRAPPER"
echo -e "${GREEN}✅ Cron wrapper created: $CRON_WRAPPER${NC}"

# Create cron entry
CRON_ENTRY="$CRON_SCHEDULE $CRON_WRAPPER"

echo ""
echo -e "${YELLOW}Cron Configuration:${NC}"
echo "  Schedule: $DESCRIPTION"
echo "  Command: $CRON_WRAPPER"
echo "  Logs: $LOG_DIR/figma-sync-*.log"
echo ""

# Check if cron entry already exists
if crontab -l 2>/dev/null | grep -q "$CRON_WRAPPER"; then
  echo -e "${YELLOW}⚠️  Cron entry already exists${NC}"
  echo ""
  echo "Current crontab:"
  crontab -l | grep "$CRON_WRAPPER"
  echo ""
  read -p "Replace existing entry? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted"
    exit 0
  fi

  # Remove old entry
  crontab -l | grep -v "$CRON_WRAPPER" | crontab -
fi

# Add new cron entry
(crontab -l 2>/dev/null; echo "# Figma Design System Scheduled Sync - $DESCRIPTION"; echo "$CRON_ENTRY") | crontab -

echo -e "${GREEN}✅ Cron entry added${NC}"

# Create monitoring script
MONITOR_SCRIPT="$PROJECT_ROOT/scripts/figma-sync-monitor.sh"

cat > "$MONITOR_SCRIPT" << 'MONEOF'
#!/bin/bash

# Figma Sync Monitor
# View sync history and logs

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📊 Figma Sync Monitor${NC}"
echo "=========================================="

# Show recent syncs
echo -e "\n${YELLOW}Recent Syncs:${NC}"
echo ""

if [ ! -d "$LOG_DIR" ] || [ -z "$(ls -A "$LOG_DIR"/figma-sync-*.log 2>/dev/null)" ]; then
  echo "No sync logs found"
  exit 0
fi

# Parse logs
for log in $(ls -t "$LOG_DIR"/figma-sync-*.log | head -10); do
  FILENAME=$(basename "$log")
  TIMESTAMP=$(echo "$FILENAME" | sed 's/figma-sync-\(.*\)\.log/\1/')
  DATE_FORMATTED=$(date -j -f "%Y%m%d-%H%M%S" "$TIMESTAMP" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "$TIMESTAMP")

  if grep -q "✅ Sync completed successfully" "$log"; then
    STATUS="${GREEN}✅ Success${NC}"
  else
    STATUS="${RED}❌ Failed${NC}"
  fi

  CHANGES=$(grep "Changes:" "$log" | tail -1 || echo "Unknown")

  echo -e "  $DATE_FORMATTED - $STATUS - $CHANGES"
done

# Statistics
echo -e "\n${YELLOW}Statistics:${NC}"
TOTAL=$(ls "$LOG_DIR"/figma-sync-*.log 2>/dev/null | wc -l | tr -d ' ')
SUCCESS=$(grep -l "✅ Sync completed successfully" "$LOG_DIR"/figma-sync-*.log 2>/dev/null | wc -l | tr -d ' ')
FAILED=$((TOTAL - SUCCESS))

if [ $TOTAL -gt 0 ]; then
  SUCCESS_RATE=$((SUCCESS * 100 / TOTAL))
else
  SUCCESS_RATE=0
fi

echo "  Total syncs: $TOTAL"
echo -e "  Successful: ${GREEN}$SUCCESS${NC}"
echo -e "  Failed: ${RED}$FAILED${NC}"
echo "  Success rate: $SUCCESS_RATE%"

# Latest log
echo -e "\n${YELLOW}Latest Log:${NC}"
echo "  $(ls -t "$LOG_DIR"/figma-sync-*.log | head -1)"

echo -e "\n${BLUE}Commands:${NC}"
echo "  View latest log: tail -f \$(ls -t $LOG_DIR/figma-sync-*.log | head -1)"
echo "  View all logs: ls -lh $LOG_DIR/figma-sync-*.log"
echo "  Clean old logs: find $LOG_DIR -name 'figma-sync-*.log' -mtime +30 -delete"
echo ""
MONEOF

chmod +x "$MONITOR_SCRIPT"
echo -e "${GREEN}✅ Monitor script created: $MONITOR_SCRIPT${NC}"

# Create uninstall script
UNINSTALL_SCRIPT="$PROJECT_ROOT/scripts/uninstall-figma-cron.sh"

cat > "$UNINSTALL_SCRIPT" << EOF
#!/bin/bash

# Uninstall Figma Sync Cron

set -euo pipefail

echo "🗑️  Uninstalling Figma Sync Cron..."

# Remove cron entry
if crontab -l 2>/dev/null | grep -q "$CRON_WRAPPER"; then
  crontab -l | grep -v "$CRON_WRAPPER" | grep -v "# Figma Design System Scheduled Sync" | crontab -
  echo "✅ Cron entry removed"
else
  echo "ℹ️  No cron entry found"
fi

# Remove wrapper script
if [ -f "$CRON_WRAPPER" ]; then
  rm "$CRON_WRAPPER"
  echo "✅ Wrapper script removed"
fi

echo "✅ Uninstall complete"
echo ""
echo "Note: Log files in $LOG_DIR were preserved"
EOF

chmod +x "$UNINSTALL_SCRIPT"
echo -e "${GREEN}✅ Uninstall script created: $UNINSTALL_SCRIPT${NC}"

# Test cron job
echo ""
echo -e "${YELLOW}Testing cron job...${NC}"
if "$CRON_WRAPPER"; then
  echo -e "${GREEN}✅ Test run successful${NC}"
  echo "  Check log: $(ls -t "$LOG_DIR"/figma-sync-*.log | head -1)"
else
  echo -e "${RED}❌ Test run failed${NC}"
  echo "  Check log for errors"
fi

# Summary
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Scheduled Sync Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Schedule: $DESCRIPTION"
echo "Cron entry: $CRON_SCHEDULE $CRON_WRAPPER"
echo ""
echo "Management commands:"
echo "  View schedule: crontab -l | grep figma"
echo "  Monitor syncs: $MONITOR_SCRIPT"
echo "  View logs: tail -f $LOG_DIR/figma-sync-*.log"
echo "  Uninstall: $UNINSTALL_SCRIPT"
echo ""
echo "Next automatic sync: $(date -v+1d '+%Y-%m-%d 09:00:00' 2>/dev/null || date)"
echo ""
