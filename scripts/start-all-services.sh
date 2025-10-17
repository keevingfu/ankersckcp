#!/bin/bash

# KCP项目 - 一键启动所有服务
# 作者: Claude + Cavin
# 日期: 2025-10-16

set -e

echo "🚀 Starting KCP Development Environment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# 1. 启动数据库服务
echo ""
echo "📦 Starting database services..."
echo "   - PostgreSQL (port 5437)"
echo "   - Neo4j (ports 7688, 7475)"
echo "   - MongoDB (port 27018)"
echo "   - Redis (port 6382)"
echo "   - MinIO (ports 9000, 9001)"

# 检查容器是否已存在
containers=("postgres-claude-mcp" "neo4j-claude-mcp" "mongodb-claude-mcp" "redis-claude-mcp" "minio-server")
for container in "${containers[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
        echo "   ✓ Starting ${container}..."
        docker start ${container} > /dev/null 2>&1 || echo "   ⚠️  ${container} already running"
    else
        echo "   ⚠️  ${container} not found. Please check Docker setup."
    fi
done

# 2. 等待服务就绪
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# 检查服务健康状态
echo ""
echo "🔍 Checking service health..."

# PostgreSQL
if docker exec postgres-claude-mcp pg_isready -U claude > /dev/null 2>&1; then
    echo "   ✓ PostgreSQL is ready"
else
    echo "   ⚠️  PostgreSQL is not ready"
fi

# Neo4j
if curl -s http://localhost:7474 > /dev/null 2>&1; then
    echo "   ✓ Neo4j is ready"
else
    echo "   ⚠️  Neo4j is starting (may take a few more seconds)"
fi

# MongoDB
if docker exec mongodb-claude-mcp mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "   ✓ MongoDB is ready"
else
    echo "   ⚠️  MongoDB is not ready"
fi

# Redis
if docker exec redis-claude-mcp redis-cli -a claude_redis_2025 PING > /dev/null 2>&1; then
    echo "   ✓ Redis is ready"
else
    echo "   ⚠️  Redis is not ready"
fi

# MinIO
if curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    echo "   ✓ MinIO is ready"
else
    echo "   ⚠️  MinIO is not ready"
fi

# 3. 显示访问信息
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Services started successfully!"
echo ""
echo "📊 Service URLs:"
echo "   • Frontend:     http://localhost:3000"
echo "   • Neo4j Browser: http://localhost:7475"
echo "   • MinIO Console: http://localhost:9001"
echo ""
echo "🔑 Connection Info:"
echo "   • Neo4j:      neo4j://localhost:7688 (neo4j/claude_neo4j_2025)"
echo "   • PostgreSQL: localhost:5437 (claude/claude_dev_2025)"
echo "   • MongoDB:    localhost:27018 (claude/claude_mongo_2025)"
echo "   • Redis:      localhost:6382 (password: claude_redis_2025)"
echo "   • MinIO:      localhost:9000 (admin/SecretPass123456)"
echo ""

# 4. 询问是否启动前端
read -p "🎨 Start frontend development server? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Installing dependencies..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        npm install
    fi

    echo "🚀 Starting Next.js dev server..."
    npm run dev &

    sleep 3
    echo ""
    echo "✅ Frontend started at http://localhost:3000"
fi

# 5. 询问是否打开浏览器
echo ""
read -p "🌐 Open services in browser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌐 Opening browsers..."
    sleep 1
    open http://localhost:3000 2>/dev/null || echo "Please open http://localhost:3000 manually"
    open http://localhost:7475 2>/dev/null || echo "Please open http://localhost:7475 manually"
    open http://localhost:9001 2>/dev/null || echo "Please open http://localhost:9001 manually"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 KCP Development Environment is ready!"
echo ""
echo "📚 Next steps:"
echo "   1. Read QUICK-AUTOMATION-GUIDE.md"
echo "   2. Try: /sc:implement \"your feature\""
echo "   3. Or use Context Engineering workflow"
echo ""
echo "💡 To stop all services:"
echo "   docker stop postgres-claude-mcp neo4j-claude-mcp mongodb-claude-mcp redis-claude-mcp minio-server"
echo ""
