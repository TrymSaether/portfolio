# Trym Saether Personal Portfolio

A modern personal portfolio website showcasing technical work, research, and writing in mathematics and engineering. Built with Next.js 15, React Three Fiber, and MDX.

## Overview

This portfolio is designed as an immersive digital experience featuring:

- **Interactive 3D Map**: A React Three Fiber scene with terrain, stations, and rover navigation on the homepage
- **Technical Writing**: MDX-based notes on numerical methods, finite elements, PDEs, and engineering practices
- **Project Showcase**: Detailed case studies of numerical solvers, simulations, and research projects
- **Work & Personal**: Professional timeline and personal perspective sections
- **Responsive Design**: Mobile-optimized interface with theme support

The portfolio emphasizes clarity and substance—presenting a mathematician's thinking and an engineer's work through both interactive visualization and thoughtful technical writing.

## Tech Stack

### Core Framework

- **Next.js** 15 (App Router)
- **React** 19
- **TypeScript** 5.6 (strict mode)
- **Tailwind CSS** v4

### Content & Rendering

- **MDX** with `@next/mdx` for technical writing
- **KaTeX** (`rehype-katex`, `remark-math`) for mathematical notation
- **Shiki** with `rehype-pretty-code` for syntax-highlighted code blocks

### 3D Graphics

- **Three.js** 0.169
- **@react-three/fiber** 9.0 (React abstraction for Three.js)
- **@react-three/drei** 10.0 (reusable helpers)
- **@react-three/postprocessing** 3.0 (effects)

### Animation & Motion

- **Motion** 11.11 (animation primitives)

### Styling & UI

- **clsx** for conditional classes
- Custom design tokens (CSS variables for colors, spacing)
- Consistent component library in `components/ui/`

## Project Structure

```
portfolio/
├── app/                      # Next.js App Router pages & layouts
│   ├── page.tsx             # Homepage with map dispatcher
│   ├── layout.tsx           # Root layout
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── notes/               # Notes listing and individual note pages
│   │   └── [slug]/          # Dynamic note routes
│   ├── projects/            # Projects listing
│   │   └── [slug]/          # Dynamic project routes
│   ├── work/                # Work/timeline page
│   ├── personal/            # Personal section
│   ├── (metadata)           # Sitemap, robots, icons, social images
│   └── globals.css          # Global styles
│
├── components/              # Reusable React components
│   ├── home/                # Homepage-specific components
│   │   └── HeroOverlay.tsx  # Hero text overlay on map
│   ├── layout/              # Layout components
│   │   ├── Nav.tsx          # Navigation bar
│   │   └── Footer.tsx       # Footer
│   ├── map/                 # Map dispatcher & mobile fallback
│   │   ├── MapDispatcher.tsx
│   │   ├── MobileMap.tsx
│   │   └── TopoSVG.tsx
│   └── ui/                  # UI primitives
│       ├── Button.tsx
│       ├── Reveal.tsx       # Animation wrapper
│       ├── Section.tsx      # Page section component
│       └── ThemeToggle.tsx  # Dark/light mode toggle
│
├── content/                 # Typed, structured content
│   ├── notes.ts            # Notes metadata & interface
│   ├── projects.ts         # Projects metadata & interface
│   ├── stations.ts         # Map stations (navigation points)
│   ├── timeline.ts         # Work timeline
│   └── notes/              # MDX note files
│       └── why-implicit-methods-feel-magic.mdx
│
├── scenes/map/             # Three.js / React Three Fiber scene
│   ├── MapScene.tsx        # Main scene component
│   ├── Terrain.tsx         # Terrain mesh
│   ├── CameraRig.tsx       # Camera controller
│   ├── Rover.tsx           # Interactive rover model
│   ├── Stations.tsx        # Station markers
│   ├── RoutePaths.tsx      # Navigation paths
│   ├── Sky.tsx             # Sky/atmosphere
│   ├── Atmosphere.tsx      # Atmospheric effects
│   ├── topography.ts       # Terrain data generation
│   └── sceneStore.ts       # Scene state management
│
├── lib/                    # Shared utilities
│   ├── cn.ts              # Class merging helper
│   ├── fonts.ts           # Font configuration
│   └── useThemeColors.ts  # Theme color hook
│
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS v4 config
├── postcss.config.mjs     # PostCSS plugins
├── next.config.mjs        # Next.js configuration
├── mdx-components.tsx     # MDX component overrides
├── vercel.json            # Vercel deployment config
└── AGENT.md              # Agent/developer guidelines
```

## Features

### 🗺️ Interactive 3D Map

- Procedurally generated terrain with topographic styling
- Real-time camera controls and smooth navigation
- Six "stations" representing different areas of expertise
- Rover character that guides exploration
- Mobile fallback with SVG topographic map

### 📝 Technical Writing

- MDX-based notes with full markdown support
- Mathematical expressions via KaTeX
- Syntax-highlighted code blocks with Shiki
- Organized by tags (PDEs, FEM, stability, etc.)
- Draft, published, and chapter status tracking

### 🚀 Project Showcase

- Detailed case studies with technical depth
- Project metadata: year, stack, domain, status
- Links and source code references
- Projects span numerical methods, simulation, tooling, and research

### 🎨 Design System

- Consistent spacing and typography via Tailwind
- Dark/light theme support with CSS variables
- Smooth animations and motion primitives
- Responsive grid layouts
- Accessibility-first UI components

## Installation & Setup

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm** 9+

### Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/TrymSaether/trym-saether-personal-portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

- **`npm run dev`** — Start development server with hot reload
- **`npm run build`** — Build for production
- **`npm start`** — Start production server
- **`npm run lint`** — Run ESLint
- **`npm run typecheck`** — Run TypeScript compiler (no emit)

## Development Guide

### Adding a New Note

1. Create an MDX file in `content/notes/` with the slug name:

   ```
   content/notes/my-note-title.mdx
   ```

2. Add metadata to `content/notes.ts`:

   ```typescript
   {
     slug: "my-note-title",
     title: "My Note Title",
     date: "2026-05-09",
     reading: "12 min",
     kicker: "Category · Topic",
     excerpt: "Brief summary of the note...",
     tags: ["tag1", "tag2"],
     status: "published", // draft, published, or chapter
   }
   ```

3. Write your MDX with:
   - Markdown for formatting
   - `$...$` for inline math (KaTeX)
   - ` ``` ` code blocks with language specification for syntax highlighting
   - Standard MDX component overrides as needed

### Adding a New Project

1. Add to `content/projects.ts`:

   ```typescript
   {
     slug: "project-slug",
     title: "Project Title",
     kicker: "Technical Category · Focus Area",
     year: "2025",
     blurb: "One-line summary",
     longBlurb: "Detailed description...",
     stack: ["Tech1", "Tech2"],
     domain: "Numerical", // Numerical, Simulation, Tooling, Research, Visualization
     status: "shipped", // shipped, research, or ongoing
     glyph: "✦", // Unicode glyph for visual distinction
   }
   ```

2. Create `app/projects/[slug]/page.tsx` to render the project detail page.

### Styling Best Practices

- Use Tailwind classes for layout and spacing
- Leverage `@/*` path alias for imports
- Define global colors in `app/globals.css` as CSS variables
- Use the `cn()` utility from `lib/cn.ts` for conditional classes
- Keep components server-rendered; use `"use client"` only for interactivity

### TypeScript Guidelines

- Enable strict mode—avoid `any` without documented justification
- Use proper type annotations for props and return values
- Leverage React 19's improved type inference
- Define interfaces for content in `content/` rather than inline types

### Server vs. Client Components

- Components are **server-rendered by default**
- Add `"use client"` only when needed for:
  - React hooks (`useState`, `useEffect`, etc.)
  - Browser APIs (`localStorage`, `window`, etc.)
  - Animations with Motion
  - Three.js interactivity and React Three Fiber canvas

## Quality Assurance

Before committing or pushing code:

1. **Type check:**

   ```bash
   npm run typecheck
   ```

2. **Lint:**

   ```bash
   npm run lint
   ```

3. **For changes affecting rendering, routing, MDX, or 3D scene:**
   ```bash
   npm run build
   ```

## Deployment

The site is deployed on **Vercel** with:

- **Region**: `fra1` (Frankfurt, EU)
- **Build Command**: `next build`
- **Dev Command**: `next dev`

### Security Headers

All responses include:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Caching

Static assets (`/_next/static/*`) are cached with:

```
Cache-Control: public, max-age=31536000, immutable
```

Deploy configuration is in `vercel.json`.

## Browser Support

- Modern browsers with ES2020+ support
- WebGL support required for 3D map (fallback SVG on mobile)
- Mobile-optimized responsive design

## Performance Considerations

- Images are automatically optimized via Next.js
- Code splitting via dynamic imports
- Efficient rendering of the Three.js scene with memoization
- MDX content is pre-compiled at build time
- CSS variables for theme switching (no full rerender needed)

## Customization

### Theming

Edit `app/globals.css` to customize:

- `--bg` — background color
- `--fg` — foreground/text color
- `--accent` — accent color
- `--muted` — muted text color
- Font families and sizes

### Typography

Font configuration is in `lib/fonts.ts`. Tailwind includes custom font families:

- `font-display` — display typeface
- `font-display-italic` — italic variant
- `font-mono` — monospace for code

## Contributing

This is a personal portfolio, but if you have suggestions or spot issues:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run typecheck` and `npm run lint`
5. Submit a pull request

## License

© 2025 Trym Saether. All rights reserved.

---

For more information, visit the [portfolio site](https://trym-saether.com) or reach out via the contact page.
