# Public Assets

Files in this directory are served from `/assets/...` by Next.js.

## Structure

- `documents/` - PDFs and other documents intended for download or direct linking.
- `images/` - general raster images used across pages.
- `downloads/` - packaged files that are not documents, such as archives or datasets.
- `media/` - audio, video, animation, and other heavier media.
- `og/` - Open Graph and social preview image assets.
- `projects/` - project-specific screenshots, diagrams, and previews.
- `notes/` - note-specific diagrams, figures, and supporting media.

Prefer lowercase, hyphenated filenames. Use stable public paths in code, for example:

```tsx
<a href="/assets/documents/trym-saether-cv-tech-internships.pdf">CV</a>
```
