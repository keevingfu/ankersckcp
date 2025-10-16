#!/bin/bash

# Slack Webhook Test Script
# Purpose: Test Slack webhook configuration

set -euo pipefail

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔔 Slack Webhook Test${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if webhook URL is provided
if [ -z "${SLACK_WEBHOOK_URL:-}" ]; then
  echo -e "${YELLOW}Please provide your Slack Webhook URL:${NC}"
  echo ""
  echo "You can:"
  echo "1. Set environment variable: export SLACK_WEBHOOK_URL='your-url'"
  echo "2. Or pass as argument: $0 'your-url'"
  echo ""

  if [ $# -gt 0 ]; then
    SLACK_WEBHOOK_URL="$1"
    echo -e "${GREEN}✅ Using webhook URL from argument${NC}"
  else
    read -p "Enter Slack Webhook URL: " SLACK_WEBHOOK_URL
  fi
fi

# Validate URL format
if [[ ! $SLACK_WEBHOOK_URL =~ ^https://hooks\.slack\.com/services/ ]]; then
  echo -e "${RED}❌ Invalid Slack Webhook URL format${NC}"
  echo "Expected format: https://hooks.slack.com/services/T.../B.../..."
  exit 1
fi

echo -e "${GREEN}✅ Webhook URL format valid${NC}"
echo ""

# Test 1: Simple text message
echo -e "${YELLOW}Test 1: Sending simple text message...${NC}"

RESPONSE=$(curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🧪 Test message from Figma Design System Sync"}' \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s \
  "$SLACK_WEBHOOK_URL")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Test 1 passed - Simple message sent${NC}"
else
  echo -e "${RED}❌ Test 1 failed - HTTP status: $HTTP_STATUS${NC}"
  echo "Response: $RESPONSE"
  exit 1
fi

sleep 2

# Test 2: Rich block message
echo ""
echo -e "${YELLOW}Test 2: Sending rich block message...${NC}"

RESPONSE=$(curl -X POST -H 'Content-type: application/json' \
  --data '{
    "text": "🎨 Design System Sync Test",
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "🎨 Figma Design System Sync Test"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Status:*\n✅ Test Successful"
          },
          {
            "type": "mrkdwn",
            "text": "*Time:*\n'"$(date '+%Y-%m-%d %H:%M:%S')"'"
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "This is a test message from your Figma Design System automation. If you see this, your Slack webhook is configured correctly!"
        }
      }
    ]
  }' \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s \
  "$SLACK_WEBHOOK_URL")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Test 2 passed - Rich message sent${NC}"
else
  echo -e "${RED}❌ Test 2 failed - HTTP status: $HTTP_STATUS${NC}"
  echo "Response: $RESPONSE"
  exit 1
fi

sleep 2

# Test 3: Design sync simulation message
echo ""
echo -e "${YELLOW}Test 3: Sending design sync simulation message...${NC}"

RESPONSE=$(curl -X POST -H 'Content-type: application/json' \
  --data '{
    "text": "🎨 Design System Sync Completed (Test)",
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "🎨 Design System Synced from Figma (Test)"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Repository:*\nankersckcp"
          },
          {
            "type": "mrkdwn",
            "text": "*Branch:*\nmain"
          },
          {
            "type": "mrkdwn",
            "text": "*Status:*\n✅ Success"
          },
          {
            "type": "mrkdwn",
            "text": "*Time:*\n'"$(date '+%Y-%m-%d %H:%M:%S')"'"
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Changes:*\n• Updated 15 color tokens\n• Updated typography system\n• Updated spacing tokens"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "🤖 This is a test message"
          }
        ]
      }
    ]
  }' \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s \
  "$SLACK_WEBHOOK_URL")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Test 3 passed - Design sync message sent${NC}"
else
  echo -e "${RED}❌ Test 3 failed - HTTP status: $HTTP_STATUS${NC}"
  echo "Response: $RESPONSE"
  exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All Tests Passed!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Your Slack webhook is configured correctly!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Configure in GitLab:"
echo "   GitLab → Settings → CI/CD → Variables"
echo "   Add: SLACK_WEBHOOK_URL = $SLACK_WEBHOOK_URL"
echo ""
echo "2. Configure in GitHub:"
echo "   GitHub → Settings → Secrets and variables → Actions"
echo "   Add variable: SLACK_WEBHOOK_URL = $SLACK_WEBHOOK_URL"
echo ""
echo "3. Check your Slack channel for the test messages!"
echo ""
