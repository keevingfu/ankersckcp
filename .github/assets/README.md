# Project Assets

This directory contains visual assets for the Soundcore KCP project.

## Directory Structure

```
assets/
├── logos/          # Project logos and branding
│   ├── kcp-logo.svg
│   ├── kcp-logo.png
│   ├── kcp-icon.svg
│   └── kcp-icon.png
│
└── screenshots/    # UI screenshots and demos
    ├── dashboard.png
    ├── knowledge-base.png
    ├── content-generator.png
    ├── chat-interface.png
    ├── analytics.png
    └── mobile/
        ├── mobile-home.png
        ├── mobile-search.png
        └── mobile-chat.png
```

## Logos

### KCP Logo
The main Soundcore KCP logo represents the Knowledge Control Plane concept.

**Design Guidelines:**
- **Primary Color**: #0066FF (Soundcore Blue)
- **Secondary Color**: #00D4FF (Light Blue)
- **Accent**: #FF6B00 (Orange)
- **Typography**: Modern sans-serif (e.g., Inter, SF Pro)

**Logo Variants:**
- **Full Logo**: With text "Soundcore KCP" - Use in headers, documentation
- **Icon Only**: Simplified symbol - Use in favicons, app icons
- **Monochrome**: Black/white versions - Use on varied backgrounds
- **Horizontal**: Wide format - Use in wide layouts
- **Vertical**: Stacked format - Use in narrow spaces

**Usage:**
```markdown
<!-- In README.md -->
![KCP Logo](.github/assets/logos/kcp-logo.svg)

<!-- As HTML -->
<img src=".github/assets/logos/kcp-logo.png" alt="KCP Logo" width="200">
```

### Logo Files to Add

Create these logo files:
1. **kcp-logo.svg** - Full vector logo (scalable)
2. **kcp-logo.png** - Raster version (1000x300px)
3. **kcp-icon.svg** - Icon only vector
4. **kcp-icon.png** - Icon raster (512x512px)
5. **kcp-logo-white.svg** - White version for dark backgrounds
6. **kcp-favicon.ico** - Website favicon (32x32, 16x16)

## Screenshots

### Desktop Screenshots

Capture these key pages:

1. **Dashboard** (`dashboard.png`)
   - Overview metrics and KPIs
   - Chart visualizations
   - Quick action buttons
   - Size: 1920x1080px

2. **Knowledge Base** (`knowledge-base.png`)
   - Search interface
   - Knowledge card grid
   - Filters and sorting
   - Size: 1920x1080px

3. **Content Generator** (`content-generator.png`)
   - Content creation form
   - AI generation in progress
   - Generated content preview
   - Size: 1920x1080px

4. **Chat Interface** (`chat-interface.png`)
   - Smart chat UI
   - Message history
   - Suggested responses
   - Size: 1920x1080px

5. **Analytics Dashboard** (`analytics.png`)
   - Performance charts
   - User journey tracking
   - Content metrics
   - Size: 1920x1080px

6. **Knowledge Graph** (`knowledge-graph.png`)
   - Interactive graph visualization
   - Node relationships
   - Zoom and pan controls
   - Size: 1920x1080px

### Mobile Screenshots

Capture mobile views:

1. **Mobile Home** (`mobile/mobile-home.png`)
   - Size: 375x812px (iPhone 13)

2. **Mobile Search** (`mobile/mobile-search.png`)
   - Size: 375x812px

3. **Mobile Chat** (`mobile/mobile-chat.png`)
   - Size: 375x812px

### Screenshot Guidelines

**General Rules:**
- Use clean, realistic data (no Lorem Ipsum)
- Hide sensitive information
- Use consistent theme (light/dark mode)
- Capture at standard resolutions
- Include browser frame when relevant
- Optimize file size (use PNG or WebP)

**Taking Screenshots:**

```bash
# Using Playwright for consistent screenshots
npx playwright test tests/visual-regression/ --update-snapshots

# Manual screenshots (macOS)
# Cmd + Shift + 4 (select area)
# Cmd + Shift + 3 (full screen)

# Browser DevTools
# F12 → Device Mode → Select device → Capture screenshot
```

**Optimization:**

```bash
# Optimize PNG files
pngquant --quality=80-90 screenshot.png

# Convert to WebP for smaller size
cwebp -q 80 screenshot.png -o screenshot.webp
```

### Usage in Documentation

```markdown
## Dashboard Overview

![Dashboard](.github/assets/screenshots/dashboard.png)

*The main dashboard showing real-time metrics and analytics*

## Mobile Experience

<div align="center">
  <img src=".github/assets/screenshots/mobile/mobile-home.png" width="250">
  <img src=".github/assets/screenshots/mobile/mobile-search.png" width="250">
  <img src=".github/assets/screenshots/mobile/mobile-chat.png" width="250">
</div>

*Mobile interface showing home, search, and chat screens*
```

## Demo GIFs

For interactive features, create animated GIFs:

1. **Search Demo** (`demo-search.gif`)
   - Show search input → results → click item
   - Max 10 seconds, 15fps, <5MB

2. **Content Generation** (`demo-content-gen.gif`)
   - Show form input → generate → preview
   - Max 15 seconds, 15fps, <8MB

3. **Chat Interaction** (`demo-chat.gif`)
   - Show message send → AI response
   - Max 10 seconds, 15fps, <5MB

**Creating GIFs:**

```bash
# Using ScreenToGif (Windows)
# or Kap (macOS)
# or Peek (Linux)

# Optimize GIF size
gifsicle -O3 --colors 256 demo.gif -o demo-optimized.gif
```

## Video Demos

For comprehensive demos, create short videos:

- **Product Tour**: 2-minute overview
- **Feature Demos**: 30-second clips per feature
- **Tutorial Videos**: Step-by-step guides

Host videos on:
- YouTube (link in README)
- GitHub Releases (as attachments)
- Project website

## Asset Checklist

### Logos
- [ ] kcp-logo.svg
- [ ] kcp-logo.png
- [ ] kcp-icon.svg
- [ ] kcp-icon.png
- [ ] kcp-logo-white.svg
- [ ] kcp-favicon.ico

### Screenshots - Desktop
- [ ] dashboard.png
- [ ] knowledge-base.png
- [ ] content-generator.png
- [ ] chat-interface.png
- [ ] analytics.png
- [ ] knowledge-graph.png

### Screenshots - Mobile
- [ ] mobile/mobile-home.png
- [ ] mobile/mobile-search.png
- [ ] mobile/mobile-chat.png

### Demo GIFs
- [ ] demo-search.gif
- [ ] demo-content-gen.gif
- [ ] demo-chat.gif

## Contributing Assets

When adding new assets:

1. **Follow naming conventions**: Use kebab-case
2. **Optimize file size**: Compress images before committing
3. **Update this README**: Document new assets
4. **Add to .gitignore**: Exclude raw/source files (PSD, AI, etc.)
5. **Provide context**: Include descriptions and use cases

## Design Resources

**Logos & Branding:**
- Use Figma, Adobe Illustrator, or Inkscape
- Export as SVG (vector) and PNG (raster)
- Follow brand guidelines

**Screenshots:**
- Use Playwright for automated screenshots
- Use Cmd+Shift+4 (macOS) or Snipping Tool (Windows)
- Maintain aspect ratios

**GIFs:**
- [ScreenToGif](https://www.screentogif.com/) (Windows)
- [Kap](https://getkap.co/) (macOS)
- [Peek](https://github.com/phw/peek) (Linux)

---

**Need help?** Open an issue or reach out in Discussions.
