# 🔐 TLS 1.3 Configuration Guide
# TLS 1.3 加密传输配置指南

**版本**: 1.0.0
**更新日期**: 2025-10-22

---

## 📋 目录

1. [TLS 1.3 概述](#tls-13-概述)
2. [SSL 证书获取](#ssl-证书获取)
3. [Nginx 配置](#nginx-配置)
4. [Kubernetes Ingress 配置](#kubernetes-ingress-配置)
5. [应用层配置](#应用层配置)
6. [测试验证](#测试验证)

---

## 1. TLS 1.3 概述

### 1.1 为什么使用 TLS 1.3

- ✅ **更快**: 握手延迟减少（1-RTT 或 0-RTT）
- ✅ **更安全**: 移除不安全的加密算法
- ✅ **隐私保护**: 握手过程加密
- ✅ **前向保密**: 即使密钥泄露，历史通信仍安全

### 1.2 Soundcore KCP TLS 要求

| 组件 | TLS 版本 | 证书类型 | 自动续期 |
|------|---------|---------|---------|
| **Frontend** | TLS 1.3 | Let's Encrypt | ✅ |
| **API Gateway** | TLS 1.3 | Let's Encrypt | ✅ |
| **数据库连接** | TLS 1.2+ | 自签名 | ❌ |
| **微服务通信** | mTLS | cert-manager | ✅ |

---

## 2. SSL 证书获取

### 2.1 Let's Encrypt (推荐)

**使用 cert-manager 自动管理证书**

#### 安装 cert-manager

```bash
# 添加 Helm 仓库
helm repo add jetstack https://charts.jetstack.io
helm repo update

# 安装 cert-manager
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --version v1.13.0 \
    --set installCRDs=true
```

#### 配置 Let's Encrypt Issuer

**创建**: `k8s/cert-manager/letsencrypt-issuer.yaml`

```yaml
# 生产环境 Issuer
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@soundcore.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
      # HTTP-01 Challenge
      - http01:
          ingress:
            class: nginx

      # DNS-01 Challenge (适用于通配符证书)
      - dns01:
          route53:
            region: us-west-2
            hostedZoneID: Z1234567890ABC
            accessKeyID: AKIA...
            secretAccessKeySecretRef:
              name: route53-credentials
              key: secret-access-key

---
# 测试环境 Issuer
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: ops@soundcore.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

#### 创建 Certificate 资源

**创建**: `k8s/cert-manager/certificates.yaml`

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: soundcore-kcp-tls
  namespace: soundcore-kcp-prod
spec:
  secretName: soundcore-kcp-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  commonName: kcp.soundcore.com
  dnsNames:
    - kcp.soundcore.com
    - api.soundcore.com
    - www.kcp.soundcore.com
  duration: 2160h  # 90 days
  renewBefore: 720h  # 30 days before expiry
```

#### 应用配置

```bash
# 应用 Issuer
kubectl apply -f k8s/cert-manager/letsencrypt-issuer.yaml

# 应用 Certificate
kubectl apply -f k8s/cert-manager/certificates.yaml

# 查看证书状态
kubectl get certificate -n soundcore-kcp-prod
kubectl describe certificate soundcore-kcp-tls -n soundcore-kcp-prod

# 查看自动创建的 Secret
kubectl get secret soundcore-kcp-tls-secret -n soundcore-kcp-prod
```

---

### 2.2 自签名证书（开发/测试）

```bash
# 生成私钥
openssl genrsa -out server.key 2048

# 生成证书签名请求
openssl req -new -key server.key -out server.csr \
    -subj "/C=US/ST=California/L=San Francisco/O=Soundcore/CN=kcp.local"

# 生成自签名证书（10年有效）
openssl x509 -req -days 3650 \
    -in server.csr \
    -signkey server.key \
    -out server.crt

# 创建 Kubernetes Secret
kubectl create secret tls kcp-tls-secret \
    --cert=server.crt \
    --key=server.key \
    -n soundcore-kcp-prod
```

---

## 3. Nginx 配置

### 3.1 Nginx TLS 1.3 配置

**创建**: `/etc/nginx/conf.d/kcp-tls.conf`

```nginx
# TLS 1.3 配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name kcp.soundcore.com api.soundcore.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/soundcore.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/soundcore.com/privkey.pem;

    # TLS 协议版本（仅允许 TLS 1.2 和 1.3）
    ssl_protocols TLSv1.2 TLSv1.3;

    # TLS 1.3 加密套件（按优先级排序）
    ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;

    # ECDHE 曲线
    ssl_ecdh_curve X25519:secp384r1:prime256v1;

    # SSL 会话配置
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/soundcore.com/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # 安全头
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    # TLS 1.3 早期数据（0-RTT）- 可选
    ssl_early_data on;
    proxy_set_header Early-Data $ssl_early_data;

    # 代理配置
    location / {
        proxy_pass http://frontend-service:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://api-gateway:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name kcp.soundcore.com api.soundcore.com;

    # ACME Challenge（Let's Encrypt 验证）
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # 重定向到 HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

### 3.2 测试 Nginx 配置

```bash
# 测试配置文件语法
nginx -t

# 重新加载配置
nginx -s reload

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

---

## 4. Kubernetes Ingress 配置

### 4.1 Nginx Ingress TLS 1.3

**创建**: `k8s/ingress/tls-ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kcp-tls-ingress
  namespace: soundcore-kcp-prod
  annotations:
    # cert-manager 自动签发证书
    cert-manager.io/cluster-issuer: "letsencrypt-prod"

    # TLS 配置
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2 TLSv1.3"
    nginx.ingress.kubernetes.io/ssl-ciphers: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256"
    nginx.ingress.kubernetes.io/ssl-prefer-server-ciphers: "true"

    # HSTS
    nginx.ingress.kubernetes.io/hsts: "true"
    nginx.ingress.kubernetes.io/hsts-max-age: "63072000"
    nginx.ingress.kubernetes.io/hsts-include-subdomains: "true"
    nginx.ingress.kubernetes.io/hsts-preload: "true"

    # HTTP to HTTPS 重定向
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"

    # 安全头
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: SAMEORIGIN";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "X-XSS-Protection: 1; mode=block";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";

spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - kcp.soundcore.com
        - api.soundcore.com
      secretName: soundcore-kcp-tls-secret  # cert-manager 自动创建
  rules:
    - host: kcp.soundcore.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 3000

    - host: api.soundcore.com
      http:
        paths:
          - path: /api/v1
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 8000
```

---

## 5. 应用层配置

### 5.1 Next.js 前端配置

**更新**: `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产环境强制 HTTPS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.soundcore.com;",
          },
        ],
      },
    ];
  },

  // 重定向 HTTP 到 HTTPS
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://kcp.soundcore.com/:path*',
          permanent: true,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
```

### 5.2 FastAPI 后端 TLS 配置

**更新**: `backend/main.py`

```python
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app = FastAPI()

# 生产环境添加 HTTPS 重定向
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# 信任的主机
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["kcp.soundcore.com", "api.soundcore.com", "*.soundcore.com"],
)

if __name__ == "__main__":
    # 生产环境使用 HTTPS
    if os.getenv("ENVIRONMENT") == "production":
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8001,
            ssl_keyfile="/etc/ssl/private/server.key",
            ssl_certfile="/etc/ssl/certs/server.crt",
            ssl_ca_certs="/etc/ssl/certs/ca-bundle.crt",
        )
    else:
        uvicorn.run("main:app", host="0.0.0.0", port=8001)
```

---

## 6. 测试验证

### 6.1 SSL 配置测试

```bash
# 1. 测试 TLS 连接
openssl s_client -connect kcp.soundcore.com:443 -tls1_3

# 2. 查看证书信息
openssl s_client -connect kcp.soundcore.com:443 -showcerts

# 3. 检查 TLS 协议支持
nmap --script ssl-enum-ciphers -p 443 kcp.soundcore.com

# 4. 测试 HSTS
curl -I https://kcp.soundcore.com | grep -i strict

# 5. SSL Labs 评分
# 访问: https://www.ssllabs.com/ssltest/analyze.html?d=kcp.soundcore.com
```

### 6.2 自动化测试脚本

**创建**: `scripts/test-tls.sh`

```bash
#!/bin/bash
# TLS 配置验证脚本

DOMAIN="kcp.soundcore.com"

echo "🔍 Testing TLS configuration for $DOMAIN..."

# 1. HTTP 重定向测试
echo -e "\n1️⃣ HTTP to HTTPS redirect..."
HTTP_REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN")
if [ "$HTTP_REDIRECT" = "301" ] || [ "$HTTP_REDIRECT" = "308" ]; then
    echo "✅ PASS: HTTP redirects to HTTPS ($HTTP_REDIRECT)"
else
    echo "❌ FAIL: HTTP does not redirect properly ($HTTP_REDIRECT)"
fi

# 2. TLS 1.3 支持测试
echo -e "\n2️⃣ TLS 1.3 support..."
TLS13_SUPPORT=$(openssl s_client -connect "$DOMAIN:443" -tls1_3 < /dev/null 2>&1 | grep "Protocol.*TLSv1.3")
if [ -n "$TLS13_SUPPORT" ]; then
    echo "✅ PASS: TLS 1.3 is supported"
else
    echo "⚠️  WARNING: TLS 1.3 not detected"
fi

# 3. HSTS 头测试
echo -e "\n3️⃣ HSTS header..."
HSTS_HEADER=$(curl -sI "https://$DOMAIN" | grep -i "strict-transport-security")
if [ -n "$HSTS_HEADER" ]; then
    echo "✅ PASS: HSTS header present"
    echo "   $HSTS_HEADER"
else
    echo "❌ FAIL: HSTS header missing"
fi

# 4. 证书有效期测试
echo -e "\n4️⃣ Certificate validity..."
CERT_EXPIRY=$(echo | openssl s_client -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -dates)
echo "$CERT_EXPIRY"

# 5. 安全头测试
echo -e "\n5️⃣ Security headers..."
HEADERS=$(curl -sI "https://$DOMAIN")
echo "$HEADERS" | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Referrer-Policy|Content-Security-Policy"

echo -e "\n✅ TLS configuration test completed"
```

---

## 7. 故障排查

### 常见问题

**问题 1: Let's Encrypt 证书签发失败**
```bash
# 查看 cert-manager 日志
kubectl logs -n cert-manager -l app=cert-manager

# 查看 Certificate 状态
kubectl describe certificate soundcore-kcp-tls -n soundcore-kcp-prod

# 手动触发证书签发
kubectl delete certificate soundcore-kcp-tls -n soundcore-kcp-prod
kubectl apply -f k8s/cert-manager/certificates.yaml
```

**问题 2: Nginx TLS 握手失败**
```bash
# 检查 Nginx 错误日志
kubectl logs -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx | grep -i ssl

# 测试 TLS 配置
openssl s_client -connect kcp.soundcore.com:443 -tls1_3 -debug
```

**问题 3: 证书链不完整**
```bash
# 检查证书链
openssl s_client -connect kcp.soundcore.com:443 -showcerts | openssl x509 -text -noout
```

---

## 8. 最佳实践

1. **启用 HSTS**: 防止降级攻击
2. **禁用 TLS 1.0/1.1**: 仅允许 TLS 1.2 和 1.3
3. **使用强加密套件**: 优先 AEAD 加密算法
4. **定期更新证书**: Let's Encrypt 自动续期
5. **监控证书过期**: 提前 30 天告警
6. **测试所有浏览器**: 确保兼容性

---

**文档版本**: 1.0.0
**维护团队**: Soundcore KCP DevOps Team
**下次审查**: 2025-11-22
