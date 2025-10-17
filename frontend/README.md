# Soundcore KCP Frontend

AI-driven enterprise knowledge operating system for Anker Soundcore.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom design system
- **Icons**: Lucide React
- **Testing**: Playwright (Visual Regression)

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run Jest tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:visual` | Run visual regression tests |
| `npm run format` | Format code with Prettier |

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── knowledge-graph/      # Knowledge graph visualization
│   ├── content-generator/    # AI content generation
│   ├── smart-chat/           # Intelligent customer service
│   ├── analytics/            # Data analytics dashboard
│   ├── knowledge/            # Knowledge base
│   ├── dashboard/            # Overview dashboard
│   ├── component-test/       # Component testing page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # Base UI components (11)
│   └── business/             # Business components (3)
├── styles/
│   ├── design-system/        # Design tokens
│   └── globals.css           # Global styles
├── lib/                      # Utilities
├── tests/                    # Test files
│   └── visual-regression/    # Playwright visual tests
└── public/                   # Static assets
```

## Design System

The project uses a custom design system based on Figma designs:

- **Colors**: Purple/Violet theme (`colors.ts`)
- **Typography**: Inter font family (`typography.ts`)
- **Spacing**: 8-point grid system (`spacing.ts`)
- **Effects**: Shadows and animations (`effects.ts`)

All design tokens are exported from `styles/design-system/` and integrated with Tailwind CSS.

## Pages Overview

### 1. Knowledge Graph (`/knowledge-graph`)
- Interactive network visualization
- Canvas-based rendering
- Force-directed layout algorithm
- Node filtering and search

### 2. Content Generator (`/content-generator`)
- AI-powered content creation
- Real-time preview
- Quality scoring (SEO, readability, engagement)
- Multiple content types support

### 3. Smart Chat (`/smart-chat`)
- Intelligent customer service interface
- Message streaming
- Context-aware responses
- Conversation history

### 4. Analytics (`/analytics`)
- Custom SVG charts
- Performance metrics
- User engagement stats
- Revenue tracking

### 5. Knowledge Base (`/knowledge`)
- Searchable knowledge repository
- Category filtering
- Card-based layout
- Quick access actions

### 6. Dashboard (`/dashboard`)
- System overview
- Key performance indicators
- Quick navigation
- Recent activities

### 7. Component Test (`/component-test`)
- All UI components showcase
- Interactive examples
- Visual testing reference

## Development Guidelines

### Code Style

- Follow TypeScript strict mode
- No `any` types allowed
- Use functional components with hooks
- Implement proper TypeScript interfaces

### Naming Conventions

- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.tsx` or `PascalCase.tsx` for components

### Import Order

1. React/Next.js imports
2. Third-party libraries
3. Internal components
4. Utilities and types

### Component Pattern

```typescript
interface ComponentProps {
  // Props definition
}

export default function Component({ prop }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

## Testing

### Visual Regression Testing

```bash
# Run visual regression tests
npm run test:visual

# Update snapshots
npx playwright test --update-snapshots
```

Tests are located in `tests/visual-regression/components.spec.ts`.

## Deployment

The application can be deployed to:

- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **Netlify**
- **Self-hosted** with Docker

### Environment Variables

Create `.env.local` file for local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Soundcore KCP
```

## Performance

- **Lighthouse Score**: Target 90+
- **Bundle Size**: Optimized with code splitting
- **Images**: Next.js Image optimization
- **Fonts**: Google Fonts with `font-display: swap`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Known Limitations

1. **Mobile Responsiveness**: Not fully optimized (planned for Phase 5)
2. **Unit Tests**: No Jest test coverage yet (planned for Phase 5)
3. **Bundle Size**: Can be optimized further with lazy loading
4. **Images**: Lazy loading not implemented

## Future Enhancements

### Phase 5: Optimization (Planned)

- [ ] Mobile-first responsive design
- [ ] Component lazy loading
- [ ] Unit test coverage (Jest + RTL)
- [ ] E2E test suite expansion
- [ ] Performance optimization
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Internationalization (i18n)

## Documentation

- **Component Library**: `COMPONENT-LIBRARY.md`
- **Development Summary**: `DEVELOPMENT_SUMMARY.md`
- **Figma Design Guide**: `FIGMA_DESIGN_GUIDE.md`
- **Project Setup**: `PROJECT_SETUP.md`
- **Testing Guide**: `COMPONENT_TEST_GUIDE.md`

## Contributing

1. Follow the code style guidelines
2. Write TypeScript with strict typing
3. Test components in `/component-test` page
4. Run linting before committing
5. Update documentation as needed

## Support

For issues or questions, refer to the project documentation in the root directory.

## License

Private - Anker Soundcore Internal Project

---

**Version**: 1.0.0
**Last Updated**: 2024-10-16
**Status**: Production Ready (90% complete)
