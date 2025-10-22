#!/usr/bin/env python3
"""
API Documentation Generator for Soundcore KCP Backend Services

This script generates OpenAPI 3.0 specification files for all backend microservices
and creates a unified API documentation portal.

Features:
- Extracts OpenAPI specs from running FastAPI services
- Generates Swagger UI HTML documentation
- Creates Redoc HTML documentation
- Generates markdown documentation
- Creates unified multi-service API portal

Requirements:
    pip install -r requirements-docs.txt

Usage:
    # Generate docs for all services
    python generate_api_docs.py

    # Generate docs for specific service
    python generate_api_docs.py --service knowledge

    # Generate unified portal
    python generate_api_docs.py --portal

    # Save to custom output directory
    python generate_api_docs.py --output ./api-docs
"""

import argparse
import json
import os
import sys
from typing import Dict, Any, Optional
import requests
from datetime import datetime
from pathlib import Path

# Service configurations
SERVICES = {
    "knowledge": {
        "name": "Knowledge Service",
        "url": "http://localhost:8001",
        "description": "Knowledge base management, RAG engine, semantic search",
        "version": "v1",
        "tags": ["knowledge", "search", "rag"]
    },
    "content": {
        "name": "Content Service",
        "url": "http://localhost:8002",
        "description": "AI content generation, multi-channel publishing",
        "version": "v1",
        "tags": ["content", "generation", "publishing"]
    },
    "support": {
        "name": "Support Service",
        "url": "http://localhost:8003",
        "description": "Customer support, conversation management, ticket system",
        "version": "v1",
        "tags": ["support", "conversation", "tickets"]
    },
    "analytics": {
        "name": "Analytics Service",
        "url": "http://localhost:8004",
        "description": "Analytics, metrics, reporting, dashboards",
        "version": "v1",
        "tags": ["analytics", "metrics", "reporting"]
    },
    "auth": {
        "name": "Auth Service",
        "url": "http://localhost:8005",
        "description": "Authentication, authorization, user management",
        "version": "v1",
        "tags": ["auth", "security", "users"]
    }
}


class APIDocGenerator:
    """Generate API documentation from FastAPI services"""

    def __init__(self, output_dir: str = "./api-docs"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def fetch_openapi_spec(self, service_name: str, service_url: str) -> Optional[Dict[str, Any]]:
        """Fetch OpenAPI specification from a FastAPI service"""
        try:
            response = requests.get(f"{service_url}/openapi.json", timeout=5)
            response.raise_for_status()
            spec = response.json()
            print(f"✅ Fetched OpenAPI spec for {service_name}")
            return spec
        except requests.exceptions.ConnectionError:
            print(f"❌ {service_name} not available at {service_url}")
            return None
        except Exception as e:
            print(f"❌ Error fetching {service_name} spec: {e}")
            return None

    def save_openapi_json(self, service_name: str, spec: Dict[str, Any]):
        """Save OpenAPI specification as JSON"""
        output_file = self.output_dir / f"{service_name}-openapi.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(spec, f, indent=2, ensure_ascii=False)
        print(f"📄 Saved OpenAPI JSON: {output_file}")

    def generate_swagger_ui(self, service_name: str, service_config: Dict[str, Any]):
        """Generate Swagger UI HTML page"""
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{service_config['name']} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui.css">
    <style>
        body {{
            margin: 0;
            padding: 0;
        }}
        .topbar {{
            display: none;
        }}
        .info {{
            margin: 20px 0;
        }}
        .info .title {{
            font-size: 36px;
            color: #3b4151;
        }}
        .info .description {{
            font-size: 14px;
            color: #3b4151;
            margin-top: 10px;
        }}
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {{
            const ui = SwaggerUIBundle({{
                url: "./{service_name}-openapi.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 1,
                docExpansion: "list",
                filter: true,
                showExtensions: true,
                showCommonExtensions: true
            }});
            window.ui = ui;
        }};
    </script>
</body>
</html>
"""
        output_file = self.output_dir / f"{service_name}-swagger.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"📄 Generated Swagger UI: {output_file}")

    def generate_redoc(self, service_name: str, service_config: Dict[str, Any]):
        """Generate Redoc HTML page"""
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{service_config['name']} - API Documentation (Redoc)</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
        }}
    </style>
</head>
<body>
    <redoc spec-url="./{service_name}-openapi.json"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
</body>
</html>
"""
        output_file = self.output_dir / f"{service_name}-redoc.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"📄 Generated Redoc: {output_file}")

    def generate_markdown_docs(self, service_name: str, spec: Dict[str, Any], service_config: Dict[str, Any]):
        """Generate Markdown documentation from OpenAPI spec"""
        info = spec.get('info', {})
        paths = spec.get('paths', {})
        components = spec.get('components', {})
        schemas = components.get('schemas', {})

        md_content = f"""# {service_config['name']} - API Documentation

## Overview

**Description**: {service_config['description']}

**Base URL**: `{service_config['url']}`

**Version**: {info.get('version', service_config['version'])}

**OpenAPI Version**: {spec.get('openapi', '3.0.0')}

---

## Endpoints

"""

        # Group endpoints by tags
        endpoints_by_tag = {}
        for path, methods in paths.items():
            for method, details in methods.items():
                if method in ['get', 'post', 'put', 'patch', 'delete']:
                    tags = details.get('tags', ['default'])
                    tag = tags[0] if tags else 'default'
                    if tag not in endpoints_by_tag:
                        endpoints_by_tag[tag] = []
                    endpoints_by_tag[tag].append({
                        'path': path,
                        'method': method.upper(),
                        'details': details
                    })

        # Write endpoints by tag
        for tag, endpoints in sorted(endpoints_by_tag.items()):
            md_content += f"### {tag.replace('_', ' ').title()}\n\n"

            for endpoint in endpoints:
                path = endpoint['path']
                method = endpoint['method']
                details = endpoint['details']
                summary = details.get('summary', 'No summary')
                description = details.get('description', '')

                md_content += f"#### `{method} {path}`\n\n"
                md_content += f"**Summary**: {summary}\n\n"
                if description:
                    md_content += f"{description}\n\n"

                # Parameters
                parameters = details.get('parameters', [])
                if parameters:
                    md_content += "**Parameters**:\n\n"
                    md_content += "| Name | Type | Location | Required | Description |\n"
                    md_content += "|------|------|----------|----------|-------------|\n"
                    for param in parameters:
                        name = param.get('name', '')
                        param_type = param.get('schema', {}).get('type', 'string')
                        location = param.get('in', '')
                        required = '✅' if param.get('required', False) else '❌'
                        param_desc = param.get('description', '')
                        md_content += f"| `{name}` | `{param_type}` | {location} | {required} | {param_desc} |\n"
                    md_content += "\n"

                # Request body
                request_body = details.get('requestBody', {})
                if request_body:
                    content = request_body.get('content', {})
                    if 'application/json' in content:
                        schema_ref = content['application/json'].get('schema', {}).get('$ref', '')
                        if schema_ref:
                            schema_name = schema_ref.split('/')[-1]
                            md_content += f"**Request Body**: `{schema_name}` (application/json)\n\n"

                # Responses
                responses = details.get('responses', {})
                if responses:
                    md_content += "**Responses**:\n\n"
                    for status_code, response_details in responses.items():
                        response_desc = response_details.get('description', '')
                        md_content += f"- **{status_code}**: {response_desc}\n"
                    md_content += "\n"

                md_content += "---\n\n"

        # Schemas
        if schemas:
            md_content += "## Data Models\n\n"
            for schema_name, schema_details in sorted(schemas.items()):
                md_content += f"### {schema_name}\n\n"
                description = schema_details.get('description', '')
                if description:
                    md_content += f"{description}\n\n"

                properties = schema_details.get('properties', {})
                required_fields = schema_details.get('required', [])

                if properties:
                    md_content += "| Field | Type | Required | Description |\n"
                    md_content += "|-------|------|----------|-------------|\n"
                    for prop_name, prop_details in properties.items():
                        prop_type = prop_details.get('type', 'object')
                        is_required = '✅' if prop_name in required_fields else '❌'
                        prop_desc = prop_details.get('description', '')
                        md_content += f"| `{prop_name}` | `{prop_type}` | {is_required} | {prop_desc} |\n"
                    md_content += "\n"

                md_content += "---\n\n"

        # Footer
        md_content += f"""---

## Quick Links

- [Swagger UI](./{service_name}-swagger.html) - Interactive API explorer
- [Redoc](./{service_name}-redoc.html) - Clean API documentation
- [OpenAPI JSON](./{service_name}-openapi.json) - Raw OpenAPI specification

---

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Service**: {service_config['name']}
**Base URL**: {service_config['url']}
"""

        output_file = self.output_dir / f"{service_name}-api.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"📄 Generated Markdown docs: {output_file}")

    def generate_service_docs(self, service_name: str, service_config: Dict[str, Any]):
        """Generate all documentation formats for a service"""
        print(f"\n{'=' * 70}")
        print(f"📚 Generating documentation for {service_config['name']}")
        print(f"{'=' * 70}")

        # Fetch OpenAPI spec
        spec = self.fetch_openapi_spec(service_config['name'], service_config['url'])
        if not spec:
            print(f"⏭️  Skipping {service_name} (service not available)")
            return False

        # Enhance spec with service metadata
        if 'info' not in spec:
            spec['info'] = {}
        spec['info']['title'] = service_config['name']
        spec['info']['description'] = service_config['description']
        spec['info']['version'] = service_config['version']

        # Generate all formats
        self.save_openapi_json(service_name, spec)
        self.generate_swagger_ui(service_name, service_config)
        self.generate_redoc(service_name, service_config)
        self.generate_markdown_docs(service_name, spec, service_config)

        print(f"✅ Documentation generated for {service_name}\n")
        return True

    def generate_unified_portal(self):
        """Generate unified API documentation portal for all services"""
        print(f"\n{'=' * 70}")
        print("🌐 Generating Unified API Portal")
        print(f"{'=' * 70}")

        html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soundcore KCP - API Documentation Portal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 60px;
        }
        .header h1 {
            font-size: 48px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p {
            font-size: 20px;
            opacity: 0.9;
        }
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 60px;
        }
        .service-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        .service-card h2 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #667eea;
        }
        .service-card p {
            color: #666;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .service-card .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        .service-card .tag {
            background: #f0f0f0;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            color: #666;
        }
        .service-card .links {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .service-card .links a {
            display: block;
            padding: 10px 15px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            text-align: center;
            transition: background 0.3s ease;
        }
        .service-card .links a:hover {
            background: #5568d3;
        }
        .service-card .links a.secondary {
            background: #e0e0e0;
            color: #333;
        }
        .service-card .links a.secondary:hover {
            background: #d0d0d0;
        }
        .footer {
            text-align: center;
            color: white;
            padding: 40px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer p {
            opacity: 0.8;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 60px;
        }
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            color: white;
        }
        .stat-card .number {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-card .label {
            font-size: 14px;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Soundcore KCP</h1>
            <p>API Documentation Portal</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="number">5</div>
                <div class="label">Microservices</div>
            </div>
            <div class="stat-card">
                <div class="number">10,000</div>
                <div class="label">QPS Target</div>
            </div>
            <div class="stat-card">
                <div class="number">99.9%</div>
                <div class="label">SLA</div>
            </div>
            <div class="stat-card">
                <div class="number">v1.0</div>
                <div class="label">API Version</div>
            </div>
        </div>

        <div class="services-grid">
"""

        # Add service cards
        for service_name, config in SERVICES.items():
            html_content += f"""
            <div class="service-card">
                <h2>{config['name']}</h2>
                <p>{config['description']}</p>
                <div class="tags">
"""
            for tag in config['tags']:
                html_content += f'                    <span class="tag">{tag}</span>\n'

            html_content += f"""                </div>
                <div class="links">
                    <a href="./{service_name}-swagger.html">📘 Swagger UI</a>
                    <a href="./{service_name}-redoc.html">📗 Redoc</a>
                    <a href="./{service_name}-api.md" class="secondary">📄 Markdown</a>
                    <a href="./{service_name}-openapi.json" class="secondary">📋 OpenAPI JSON</a>
                </div>
            </div>
"""

        html_content += f"""
        </div>

        <div class="footer">
            <p><strong>Soundcore KCP - Knowledge Control Plane</strong></p>
            <p>AI-driven Enterprise Knowledge Operating System</p>
            <p style="margin-top: 20px; font-size: 14px;">
                Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            </p>
        </div>
    </div>
</body>
</html>
"""

        output_file = self.output_dir / "index.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"📄 Generated unified portal: {output_file}")
        print(f"🌐 Open in browser: file://{output_file.absolute()}")


def main():
    parser = argparse.ArgumentParser(description='Generate API documentation for Soundcore KCP services')
    parser.add_argument('--service', choices=list(SERVICES.keys()) + ['all'], default='all',
                        help='Service to generate docs for (default: all)')
    parser.add_argument('--output', type=str, default='./api-docs',
                        help='Output directory for generated docs (default: ./api-docs)')
    parser.add_argument('--portal', action='store_true',
                        help='Generate unified API portal (HTML)')

    args = parser.parse_args()

    generator = APIDocGenerator(output_dir=args.output)

    print("\n" + "=" * 70)
    print("📚 Soundcore KCP - API Documentation Generator")
    print("=" * 70)
    print(f"Output directory: {generator.output_dir.absolute()}")

    generated_count = 0

    if args.service == 'all':
        # Generate docs for all services
        for service_name, service_config in SERVICES.items():
            if generator.generate_service_docs(service_name, service_config):
                generated_count += 1
    else:
        # Generate docs for specific service
        service_config = SERVICES[args.service]
        if generator.generate_service_docs(args.service, service_config):
            generated_count += 1

    # Generate unified portal
    if args.portal or args.service == 'all':
        generator.generate_unified_portal()

    print("\n" + "=" * 70)
    print(f"✅ Documentation generation complete!")
    print(f"📊 Generated docs for {generated_count} service(s)")
    print(f"📂 Output directory: {generator.output_dir.absolute()}")
    print("=" * 70)

    # Print instructions
    print("\n📖 How to view the documentation:")
    print(f"\n1. Open unified portal:")
    print(f"   file://{(generator.output_dir / 'index.html').absolute()}")
    print(f"\n2. Or open individual service docs:")
    for service_name in SERVICES.keys():
        print(f"   - {SERVICES[service_name]['name']}: ./{service_name}-swagger.html")
    print("\n3. Serve with HTTP server:")
    print(f"   cd {generator.output_dir.absolute()} && python -m http.server 8080")
    print("   Then visit: http://localhost:8080")


if __name__ == "__main__":
    main()
