#!/bin/bash

# Figma Webhook Handler
# Purpose: Listen for Figma file update events and trigger design system sync
# Usage: ./scripts/figma-webhook-handler.sh
# Requires: Node.js for webhook server

set -euo pipefail

WEBHOOK_PORT="${FIGMA_WEBHOOK_PORT:-3001}"
WEBHOOK_SECRET="${FIGMA_WEBHOOK_SECRET:-change_me_in_production}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🔧 Setting up Figma Webhook Handler..."
echo "Port: $WEBHOOK_PORT"
echo "Project: $PROJECT_ROOT"

# Create webhook server with Node.js
cat > "$PROJECT_ROOT/figma-webhook-server.js" << 'EOF'
const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = process.env.FIGMA_WEBHOOK_PORT || 3001;
const SECRET = process.env.FIGMA_WEBHOOK_SECRET || 'change_me_in_production';
const SYNC_SCRIPT = process.env.SYNC_SCRIPT || './scripts/figma-sync-and-commit.sh';

// Verify webhook signature
function verifySignature(payload, signature) {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payload);
  const expectedSignature = 'sha256=' + hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Execute sync script
function runSync(options = {}) {
  return new Promise((resolve, reject) => {
    const args = [];
    if (options.push) args.push('--push');
    if (options.pr) args.push('--pr');

    const command = `${SYNC_SCRIPT} ${args.join(' ')}`;

    console.log(`\n🔄 Running: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Sync failed:', error);
        reject(error);
        return;
      }

      console.log(stdout);
      if (stderr) console.error(stderr);

      console.log('✅ Sync completed');
      resolve(stdout);
    });
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'figma-webhook-handler',
      uptime: process.uptime()
    }));
    return;
  }

  // Webhook endpoint
  if (req.method === 'POST' && req.url === '/webhook/figma') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        // Verify signature
        const signature = req.headers['x-figma-signature'];
        if (!verifySignature(body, signature)) {
          console.error('❌ Invalid webhook signature');
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid signature' }));
          return;
        }

        // Parse webhook payload
        const payload = JSON.parse(body);
        console.log('\n📨 Figma webhook received:');
        console.log('  Event:', payload.event_type);
        console.log('  File:', payload.file_key);
        console.log('  Timestamp:', payload.timestamp);

        // Check if it's our design system file
        const DESIGN_SYSTEM_FILE_KEY = 'ctmaLDzdgeg1nMpdHnMpvd';
        if (payload.file_key !== DESIGN_SYSTEM_FILE_KEY) {
          console.log('ℹ️  Not our design system file, ignoring');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'ignored',
            reason: 'Not design system file'
          }));
          return;
        }

        // Check event type
        const relevantEvents = [
          'FILE_UPDATE',
          'FILE_VERSION_UPDATE',
          'LIBRARY_PUBLISH'
        ];

        if (!relevantEvents.includes(payload.event_type)) {
          console.log('ℹ️  Event type not relevant, ignoring');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'ignored',
            reason: 'Event type not relevant'
          }));
          return;
        }

        // Respond immediately to Figma
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'accepted',
          message: 'Sync started'
        }));

        // Run sync asynchronously
        try {
          await runSync({ push: true, pr: false });
        } catch (error) {
          console.error('❌ Sync error:', error);
        }

      } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });

    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Start server
server.listen(PORT, () => {
  console.log(`\n🚀 Figma Webhook Handler running on port ${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  http://localhost:${PORT}/health`);
  console.log(`  POST http://localhost:${PORT}/webhook/figma`);
  console.log(`\nWebhook URL for Figma:`);
  console.log(`  https://your-domain.com/webhook/figma`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down webhook handler...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down webhook handler...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
EOF

echo "✅ Webhook server created: figma-webhook-server.js"

# Create systemd service file (for Linux servers)
cat > "$PROJECT_ROOT/figma-webhook.service" << EOF
[Unit]
Description=Figma Webhook Handler
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_ROOT
Environment="FIGMA_WEBHOOK_PORT=$WEBHOOK_PORT"
Environment="FIGMA_WEBHOOK_SECRET=$WEBHOOK_SECRET"
Environment="SYNC_SCRIPT=$PROJECT_ROOT/scripts/figma-sync-and-commit.sh"
ExecStart=/usr/bin/node $PROJECT_ROOT/figma-webhook-server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Systemd service file created: figma-webhook.service"

# Create PM2 ecosystem file (for Node.js process management)
cat > "$PROJECT_ROOT/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: 'figma-webhook',
    script: './figma-webhook-server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      FIGMA_WEBHOOK_PORT: $WEBHOOK_PORT,
      FIGMA_WEBHOOK_SECRET: '$WEBHOOK_SECRET',
      SYNC_SCRIPT: '$PROJECT_ROOT/scripts/figma-sync-and-commit.sh'
    }
  }]
};
EOF

echo "✅ PM2 ecosystem file created: ecosystem.config.js"

# Create startup instructions
cat > "$PROJECT_ROOT/FIGMA-WEBHOOK-SETUP.md" << 'MDEOF'
# Figma Webhook Handler Setup

## Overview

This webhook handler listens for Figma file update events and automatically triggers design system synchronization.

## Architecture

```
Figma File Update
    ↓
Figma Webhook POST → http://your-server/webhook/figma
    ↓
Webhook Handler (Node.js server)
    ↓
Verify HMAC signature
    ↓
Trigger figma-sync-and-commit.sh
    ↓
Auto-commit + Push + Notify
```

## Setup Instructions

### 1. Configure Environment Variables

```bash
# Create .env file
cat > .env << EOF
FIGMA_WEBHOOK_PORT=3001
FIGMA_WEBHOOK_SECRET=$(openssl rand -hex 32)
SYNC_SCRIPT=./scripts/figma-sync-and-commit.sh
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
EOF

# Load environment
source .env
```

### 2. Start Webhook Server

**Option A: Direct Node.js (Development)**

```bash
# Start server
FIGMA_WEBHOOK_PORT=3001 \
FIGMA_WEBHOOK_SECRET=your_secret \
node figma-webhook-server.js

# Test health check
curl http://localhost:3001/health
```

**Option B: PM2 (Production)**

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs figma-webhook

# Monitor
pm2 monit

# Auto-start on reboot
pm2 startup
pm2 save
```

**Option C: Systemd (Linux Server)**

```bash
# Copy service file
sudo cp figma-webhook.service /etc/systemd/system/

# Enable and start
sudo systemctl enable figma-webhook
sudo systemctl start figma-webhook

# Check status
sudo systemctl status figma-webhook

# View logs
sudo journalctl -u figma-webhook -f
```

### 3. Expose Webhook to Internet

**Option A: ngrok (Development/Testing)**

```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 3001

# Use the HTTPS URL provided by ngrok
# Example: https://abc123.ngrok.io
```

**Option B: Reverse Proxy (Production)**

**Nginx Configuration:**

```nginx
server {
    listen 443 ssl;
    server_name webhooks.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /webhook/figma {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Configure Figma Webhook

1. **Open Figma File**
   - Go to: https://www.figma.com/design/ctmaLDzdgeg1nMpdHnMpvd/Soundcore-KCP-Design-System

2. **Access Webhooks Settings**
   - Click `...` menu → `Webhooks` → `New webhook`

3. **Configure Webhook**
   - **Endpoint URL**: `https://your-domain.com/webhook/figma`
   - **Events**: Select `FILE_UPDATE`, `FILE_VERSION_UPDATE`, `LIBRARY_PUBLISH`
   - **Secret**: Use the same secret from your `.env` file

4. **Test Webhook**
   - Figma will send a test event
   - Check webhook handler logs for confirmation

### 5. Test End-to-End

```bash
# Make a change in Figma design system
# (e.g., update a color value)

# Watch webhook logs
pm2 logs figma-webhook --lines 100

# Expected flow:
# 1. Figma sends webhook
# 2. Handler verifies signature
# 3. Triggers sync script
# 4. Creates commit
# 5. Pushes to Git
# 6. Sends Slack notification
```

## Webhook Payload Example

```json
{
  "event_type": "FILE_UPDATE",
  "file_key": "ctmaLDzdgeg1nMpdHnMpvd",
  "file_name": "Soundcore-KCP-Design-System",
  "timestamp": "2024-10-16T10:30:00Z",
  "triggered_by": {
    "id": "123456",
    "handle": "designer@company.com"
  }
}
```

## Security Considerations

1. **HMAC Signature Verification**
   - All webhooks must include valid `X-Figma-Signature` header
   - Uses SHA-256 HMAC with shared secret

2. **File Key Validation**
   - Only processes webhooks for specific design system file
   - Ignores webhooks from other Figma files

3. **HTTPS Only**
   - Use HTTPS for webhook endpoint in production
   - ngrok provides HTTPS for testing

4. **Rate Limiting**
   - Consider adding rate limiting for production
   - Prevents webhook spam attacks

5. **Secret Management**
   - Store secrets in environment variables
   - Never commit secrets to Git
   - Rotate secrets periodically

## Monitoring

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Logs:**
```bash
# PM2
pm2 logs figma-webhook

# Systemd
sudo journalctl -u figma-webhook -f

# Direct
# Check console output
```

**Metrics:**
- Webhook requests received
- Successful syncs
- Failed syncs
- Response times

## Troubleshooting

### Webhook Not Triggering

1. **Check Figma webhook configuration**
   ```bash
   # Verify webhook is active in Figma settings
   ```

2. **Verify server is reachable**
   ```bash
   curl https://your-domain.com/webhook/figma
   # Should return 404 (GET not allowed)
   ```

3. **Check firewall rules**
   ```bash
   # Ensure port 3001 is open
   sudo ufw status
   ```

### Signature Verification Fails

1. **Verify secret matches**
   ```bash
   # Check environment variable
   echo $FIGMA_WEBHOOK_SECRET

   # Compare with Figma webhook settings
   ```

2. **Check header name**
   - Header: `X-Figma-Signature`
   - Format: `sha256=<hex_digest>`

### Sync Script Fails

1. **Check script permissions**
   ```bash
   ls -la scripts/figma-sync-and-commit.sh
   # Should be executable (-rwxr-xr-x)
   ```

2. **Test script manually**
   ```bash
   ./scripts/figma-sync-and-commit.sh --push
   ```

3. **Check Git credentials**
   ```bash
   git config user.name
   git config user.email
   ```

## Advanced Configuration

### Rate Limiting

Add to webhook server:

```javascript
const rateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const limit = 10; // requests per minute
  const window = 60000; // 1 minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip).filter(t => now - t < window);

  if (requests.length >= limit) {
    return false;
  }

  requests.push(now);
  rateLimit.set(ip, requests);
  return true;
}
```

### Retry Logic

Add retry mechanism for failed syncs:

```javascript
async function runSyncWithRetry(options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await runSync(options);
      return;
    } catch (error) {
      console.error(`Retry ${i + 1}/${maxRetries} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
    }
  }
}
```

### Notification Enhancements

Send to multiple channels:

```javascript
async function notify(message) {
  // Slack
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({ text: message })
    });
  }

  // Email (using Notion MCP or other service)
  // Discord
  // Feishu
}
```

## References

- [Figma Webhooks Documentation](https://www.figma.com/developers/api#webhooks)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Systemd Service Documentation](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [ngrok Documentation](https://ngrok.com/docs)
MDEOF

echo "✅ Setup documentation created: FIGMA-WEBHOOK-SETUP.md"

echo ""
echo "========================================="
echo "✅ Figma Webhook Handler Setup Complete!"
echo "========================================="
echo ""
echo "Files created:"
echo "  - figma-webhook-server.js"
echo "  - figma-webhook.service (systemd)"
echo "  - ecosystem.config.js (PM2)"
echo "  - FIGMA-WEBHOOK-SETUP.md (documentation)"
echo ""
echo "Next steps:"
echo "  1. Review FIGMA-WEBHOOK-SETUP.md"
echo "  2. Configure environment variables"
echo "  3. Start webhook server"
echo "  4. Expose to internet (ngrok or reverse proxy)"
echo "  5. Configure webhook in Figma"
echo ""
