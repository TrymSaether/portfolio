# Public Assets

Files in this directory are served from `/assets/...` by Next.js.

## Structure

- `documents/` - PDFs and other documents intended for download or direct linking.
  - `trym-saether-cv.pdf` and `trym-saether-resume.pdf` are synced from the
    `vendor/trym-saether-resume` submodule with `npm run resume:sync`.
  - `documents/old-portfolio/` - document assets imported from the previous portfolio.
- `images/` - general raster images used across pages.
  - `images/personal/` - personal photographs imported from the previous portfolio.
  - `images/signatures/` - signature image assets imported from the previous portfolio.
  - `images/backgrounds/` - background images from the previous portfolio.
  - `images/brand/` - old logo, favicon, and small icon assets.
- `downloads/` - packaged files that are not documents, such as archives or datasets.
- `media/` - audio, video, animation, and other heavier media.
- `og/` - Open Graph and social preview image assets.
- `projects/` - project-specific screenshots, diagrams, and previews.
- `notes/` - note-specific diagrams, figures, and supporting media.

Prefer lowercase, hyphenated filenames. Use stable public paths in code, for example:

```tsx
<a href="/assets/documents/trym-saether-cv.pdf">CV</a>
```
