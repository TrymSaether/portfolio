# Trym Saether Portfolio

Personal portfolio showcasing technical work, research, and writing in mathematics and engineering. Features an interactive 3D map, technical notes, and project case studies.

## Features

- **Interactive 3D Map** — React Three Fiber terrain with navigation
- **Technical Notes** — MDX with KaTeX math and syntax highlighting
- **Projects** — Detailed case studies of numerical solvers and simulations
- **Work & Personal** — Timeline and reflection sections

## Stack

Next.js 15 • React 19 • TypeScript • Tailwind CSS v4 • Three.js • MDX

## Quick Start

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run lint` — Lint check
- `npm run typecheck` — TypeScript check

## Adding Content

**New Note:**

1. Create `content/notes/my-title.mdx`
2. Add metadata to `content/notes.ts`

**New Project:**

1. Update `content/projects.ts`
2. Create `app/projects/[slug]/page.tsx`

## Development

- TypeScript strict mode
- Components server-rendered by default
- Use `"use client"` only for hooks/browser APIs/3D
- `@/*` path alias for imports
- See [AGENT.md](AGENT.md) for detailed guidelines

## Deployment

Deployed on Vercel (Frankfurt region). See `vercel.json` for config.

## License

© 2025 Trym Saether. All rights reserved.
