# AGENT.md

Guidance for agents working in this repository.

## Project Overview

This is a personal portfolio site built with Next.js App Router, React, TypeScript, Tailwind CSS v4, MDX, and a React Three Fiber map scene.

Primary areas:

- `app/`: Next.js routes, metadata, sitemap, robots, generated icons/images.
- `components/`: shared layout, UI primitives, homepage and map dispatch components.
- `content/`: typed content data and MDX notes.
- `scenes/map/`: Three.js / React Three Fiber terrain, camera, stations, paths, and scene store.
- `lib/`: small shared helpers such as class merging and font setup.

## Commands

Use these scripts from the repository root:

```sh
npm run dev
npm run build
npm run lint
npm run typecheck
```

Before handing off code changes, run at least:

```sh
npm run typecheck
npm run lint
```

For changes affecting routing, rendering, MDX, metadata, or the 3D scene, also run:

```sh
npm run build
```

## Development Notes

- Use TypeScript with strict types. Avoid `any` unless there is a narrow, documented reason.
- Use the `@/*` path alias for project imports.
- Keep React components server-rendered by default. Add `"use client"` only when hooks, browser APIs, motion, or Three.js interactivity require it.
- Preserve the App Router conventions already used in `app/`.
- Keep content changes in `content/` structured and typed rather than scattering content literals through page components.
- MDX notes are first-class content. Keep math and code blocks compatible with the configured `remark-math`, `rehype-katex`, and `rehype-pretty-code` pipeline.

## Styling

- Tailwind CSS v4 is configured through `app/globals.css`; prefer existing theme tokens and CSS variables.
- Preserve the dark editorial visual language: ink background, cream text, warm gold accents, subtle aurora/terrain details.
- Use existing UI primitives in `components/ui/` before adding new primitives.
- Keep typography aligned with the configured fonts: Fraunces for display, Inter Tight for sans text, JetBrains Mono for code.
- Avoid broad visual rewrites unless the task explicitly asks for redesign work.
- Check responsive layouts carefully, especially pages with large display type, map overlays, and project cards.

## 3D Map Scene

- The map experience lives in `components/map/` and `scenes/map/`.
- Keep Three.js/R3F code isolated to client components.
- Be conservative with per-frame work in `useFrame`; avoid unnecessary allocations in render loops.
- When changing terrain, camera, stations, or route paths, verify the scene still renders on desktop and mobile sizes.
- Prefer deterministic scene data and typed structures over ad hoc runtime parsing.

## Quality Bar

- Make focused changes. Do not reformat unrelated files.
- Preserve existing user-facing copy and metadata unless the request involves content changes.
- Do not introduce new runtime dependencies without a clear reason.
- For frontend changes, verify visually in a browser when practical.
- For generated metadata routes and icon/image routes, check build output rather than relying on dev-only behavior.

## Git Hygiene

- The working tree may contain user changes. Do not revert or overwrite changes you did not make.
- Keep commits, if requested, scoped to the task.
- Do not include `.next/`, `node_modules/`, or other generated artifacts in commits.
