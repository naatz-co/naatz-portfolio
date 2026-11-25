# naatz.co

Portfolio of **Nathalia Garcia**, Product Designer. Static site built with [Astro](https://astro.build), hosted on Vercel.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Where things live

| What | Where |
| --- | --- |
| Home page (hero, project cards, cal.com booking) | `src/pages/index.astro` |
| Project list (titles, card text, SEO title/description, cover image) | `src/data/projects.ts` |
| Case study content | `raw/<project>.html` |
| About page text | `raw/about.html` |
| Header, footer, SEO tags, structured data | `src/layouts/Base.astro` |
| Styles | `src/styles/global.css` |
| Images and videos | `public/images`, `public/videos` |
| Redirects (old `/projects/...` URLs) | `vercel.json` |

### Adding a new project

1. Add an entry to `src/data/projects.ts` (the `slug` becomes the URL: `naatz.co/<slug>`).
2. Create `raw/<name>.html` with the case content and map it in `src/pages/[slug].astro`.
3. Put images in `public/images` (WebP preferred) and reference them as `/images/<file>`.

Sitemap (`/sitemap-index.xml`) and canonical URLs are generated automatically on build.

## Assets

`scripts/fetch-assets.mjs` downloaded every image and video from the original Framer site, converted
PNG/JPG to WebP and stored their sizes in `src/data/images.json` (used to set `width`/`height` and avoid
layout shift). The GitHub Action in `.github/workflows/fetch-assets.yml` runs it automatically.
