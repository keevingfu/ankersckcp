# Contributing to Soundcore KCP

First off, thank you for considering contributing to Soundcore KCP! It's people like you that make KCP such a great tool. 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@soundcore-kcp.com.

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Harassment, discrimination, or derogatory comments
- Trolling, insulting comments, or personal attacks
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18+ and npm
- **Python** 3.11+
- **Git**
- **Docker** and Docker Compose
- A **GitHub account**

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Go to https://github.com/leapunion/ankersckcp
   # Click "Fork" button in the top-right corner
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ankersckcp.git
   cd ankersckcp
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/leapunion/ankersckcp.git
   git fetch upstream
   ```

4. **Set Up Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Set Up Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

6. **Start Databases with Docker**
   ```bash
   docker-compose up -d postgres mongodb redis neo4j
   ```

---

## Development Process

### 1. Create a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bugfix
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Frontend tests
cd frontend
npm test                    # Unit tests
npx playwright test         # E2E tests
npm run lint                # Linting
npm run type-check          # Type checking

# Backend tests
cd backend
python -m pytest            # All tests
python -m pytest --cov      # With coverage
python -m pylint app/       # Linting
```

### 4. Commit Your Changes

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git commit -m "feat(knowledge): add semantic search functionality"
git commit -m "fix(api): resolve rate limiting issue"
git commit -m "docs(readme): update installation guide"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(rag): implement hybrid search with vector and keyword matching

- Add Pinecone vector search
- Integrate Elasticsearch keyword search
- Implement result fusion algorithm
- Add unit tests and integration tests

Closes #123
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

---

## Pull Request Process

### Before Submitting

- [ ] Run all tests and ensure they pass
- [ ] Update documentation (README, API docs, etc.)
- [ ] Add/update tests for new functionality
- [ ] Follow coding standards
- [ ] Ensure no merge conflicts with main
- [ ] Rebase on latest upstream/main if needed

### Creating a Pull Request

1. **Go to GitHub**
   - Navigate to your fork
   - Click "Compare & pull request"

2. **Fill Out PR Template**
   ```markdown
   ## Description
   Brief description of what this PR does

   ## Type of Change
   - [ ] Bug fix (non-breaking change)
   - [ ] New feature (non-breaking change)
   - [ ] Breaking change
   - [ ] Documentation update

   ## Changes Made
   - List specific changes
   - Be detailed and clear

   ## Testing
   - How did you test this?
   - What test cases did you add?

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Related Issues
   Closes #123
   Fixes #456
   ```

3. **Request Review**
   - Tag relevant maintainers
   - Respond to feedback promptly
   - Make requested changes

### PR Review Process

- At least one maintainer must approve
- All CI checks must pass
- No merge conflicts
- Up to date with main branch

### After Approval

Your PR will be merged using one of:
- **Squash and merge**: For feature branches (default)
- **Rebase and merge**: For clean linear history
- **Merge commit**: For complex changes

---

## Coding Standards

### Frontend (TypeScript/React)

#### Code Style

```typescript
// Use TypeScript strict mode
// Use functional components with hooks
// Use meaningful variable names

// Good
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUserData);
  }, [userId]);

  return <div>{userData?.name}</div>;
};

// Bad
const UP = ({ id }: any) => {
  const [d, setD] = useState(null);
  useEffect(() => { fetchUser(id).then(setD); }, [id]);
  return <div>{d?.name}</div>;
};
```

#### Naming Conventions

- **Components**: PascalCase (`UserProfile`, `KnowledgeCard`)
- **Functions/Variables**: camelCase (`fetchUser`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase with descriptive names

#### File Structure

```typescript
// Component file structure
import React from 'react';
import { useState } from 'react';

// Types
interface ComponentProps {
  prop1: string;
  prop2: number;
}

// Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleClick = () => {};

  // Render
  return <div></div>;
};
```

#### ESLint Rules

```bash
# Auto-fix linting issues
npm run lint:fix

# Check for issues
npm run lint
```

### Backend (Python/FastAPI)

#### Code Style

```python
# Follow PEP 8
# Use type hints
# Write docstrings

# Good
def get_knowledge_items(
    skip: int = 0,
    limit: int = 20,
    item_type: Optional[str] = None
) -> List[KnowledgeItem]:
    """
    Retrieve knowledge items with pagination.

    Args:
        skip: Number of items to skip
        limit: Maximum number of items to return
        item_type: Filter by type (FAQ, GUIDE, etc.)

    Returns:
        List of KnowledgeItem objects
    """
    query = db.query(KnowledgeItem)
    if item_type:
        query = query.filter(KnowledgeItem.type == item_type)
    return query.offset(skip).limit(limit).all()

# Bad
def get_items(s=0, l=20, t=None):
    q = db.query(KnowledgeItem)
    if t:
        q = q.filter(KnowledgeItem.type == t)
    return q.offset(s).limit(l).all()
```

#### Naming Conventions

- **Functions/Variables**: snake_case (`get_user`, `user_data`)
- **Classes**: PascalCase (`KnowledgeItem`, `ContentGenerator`)
- **Constants**: UPPER_SNAKE_CASE (`API_VERSION`, `MAX_RETRIES`)
- **Private**: Prefix with underscore (`_internal_method`)

#### Code Formatting

```bash
# Format with Black
python -m black app/

# Sort imports with isort
python -m isort app/

# Type check with mypy
python -m mypy app/
```

---

## Testing Guidelines

### Frontend Testing

#### Unit Tests (Jest)

```typescript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### E2E Tests (Playwright)

```typescript
// Example E2E test
import { test, expect } from '@playwright/test';

test('user can search knowledge base', async ({ page }) => {
  await page.goto('/knowledge');

  const searchInput = page.locator('input[type="search"]');
  await searchInput.fill('bluetooth connection');
  await searchInput.press('Enter');

  await expect(page.locator('.search-results')).toBeVisible();
  await expect(page.locator('.knowledge-card')).toHaveCount(5);
});
```

### Backend Testing

#### Unit Tests (pytest)

```python
# Example test
import pytest
from app.crud import get_knowledge_items

def test_get_knowledge_items(db_session):
    """Test retrieving knowledge items."""
    items = get_knowledge_items(db_session, skip=0, limit=10)
    assert len(items) <= 10
    assert all(isinstance(item, KnowledgeItem) for item in items)

@pytest.mark.asyncio
async def test_search_knowledge(client):
    """Test knowledge search endpoint."""
    response = await client.post(
        "/api/v1/knowledge/search",
        json={"query": "bluetooth", "top_k": 5}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) <= 5
```

### Test Coverage Requirements

- **Minimum Coverage**: 80% for frontend, 85% for backend
- **Critical Paths**: 100% coverage for core functionality
- **New Features**: Must include comprehensive tests

---

## Documentation

### Code Documentation

#### Frontend (TypeScript)

```typescript
/**
 * Fetches knowledge items from the API
 *
 * @param params - Search parameters
 * @param params.query - Search query string
 * @param params.page - Page number (default: 1)
 * @param params.pageSize - Items per page (default: 20)
 * @returns Promise resolving to paginated knowledge items
 *
 * @example
 * ```typescript
 * const items = await fetchKnowledgeItems({
 *   query: 'bluetooth',
 *   page: 1,
 *   pageSize: 10
 * });
 * ```
 */
export async function fetchKnowledgeItems(
  params: SearchParams
): Promise<PaginatedResponse<KnowledgeItem>> {
  // Implementation
}
```

#### Backend (Python)

```python
def generate_content(
    topic: str,
    content_type: str,
    language: str = "EN",
    tone: str = "professional"
) -> ContentResult:
    """
    Generate content using AI.

    Args:
        topic: Main topic for content generation
        content_type: Type of content (blog_article, social_post, etc.)
        language: Target language code (default: EN)
        tone: Content tone (professional, casual, technical)

    Returns:
        ContentResult object containing generated content and metadata

    Raises:
        ValueError: If topic is empty or content_type is invalid
        APIError: If AI service is unavailable

    Example:
        >>> result = generate_content(
        ...     topic="Wireless earbuds",
        ...     content_type="blog_article",
        ...     language="EN"
        ... )
        >>> print(result.content)
    """
    # Implementation
```

### Updating Documentation

When making changes, update:
- **README.md**: For user-facing changes
- **API Documentation**: For API changes
- **Code Comments**: For complex logic
- **CHANGELOG.md**: For notable changes

---

## Community

### Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community server (link in README)
- **Email**: support@soundcore-kcp.com

### Reporting Bugs

Use the bug report template:

```markdown
**Describe the bug**
A clear and concise description

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other context
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
A clear description of what you want

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other context or screenshots
```

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor badges

---

## Additional Resources

- **Architecture Documentation**: `/docs/architecture/`
- **API Reference**: https://api.soundcore-kcp.com/docs
- **Development Guides**: `/docs/guides/`
- **Best Practices**: `/docs/best-practices/`

---

## Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in Discord
- Email us at support@soundcore-kcp.com

**Thank you for contributing! 🎉**

---

*This contributing guide is based on best practices from the open-source community.*
