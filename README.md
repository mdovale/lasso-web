# LASSO — Group Website

Website of the **Laboratory of Space Systems and Optomechanics (LASSO)** at the
University of Arizona, Wyant College of Optical Sciences.

Built with [Next.js](https://nextjs.org) (App Router, TypeScript),
[Tailwind CSS](https://tailwindcss.com), [Framer Motion](https://motion.dev),
and a YAML content layer validated with [Zod](https://zod.dev). Every page is
statically pre-rendered at build time.

> **Editing content?** If you just want to update people, projects,
> publications, news, or photos, read **[MAINTAINERS.md](./MAINTAINERS.md)** —
> it is written for non-technical editors and covers everything you need.

## Quick start

Requires **Node.js 20+** (22 recommended) and npm.

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:3000
```

## Scripts

| Command                     | What it does                                            |
| --------------------------- | ------------------------------------------------------- |
| `npm run dev`               | Local development server with hot reload                |
| `npm run build`             | Validate content, then produce a production build       |
| `npm run start`             | Serve the production build                              |
| `npm run preview`           | `build` + `start` in one step                           |
| `npm run validate:content`  | Check every file in `content/` against its schema       |
| `npm run typecheck`         | TypeScript type checking                                |
| `npm run lint`              | ESLint                                                  |
| `npm run format`            | Format the codebase with Prettier                       |
| `npm run check`             | Everything CI runs: validate + typecheck + lint + build |
| `npm run generate:graphics` | Regenerate the SVG artwork and Open Graph card          |
| `npm run clean`             | Delete build artifacts                                  |

GitHub Actions (`.github/workflows/ci.yml`) runs `validate → typecheck → lint →
build` on every push and pull request.

## How the site is organized

```
content/          ← ALL editable content (YAML). The only folder editors touch.
public/           ← images, videos, PDFs referenced from content/
  images/people/      headshots
  images/projects/    project photos
  images/news/        news images
  media/              gallery photos and .mp4 clips
  generated/          computer-generated artwork (from scripts/generate-graphics.ts)
  publications/       locally hosted paper PDFs
app/              ← one folder per page (Next.js App Router)
components/
  ui/                 design primitives (buttons, tags, headers, reveals…)
  cards/              project / person / publication / news / media cards
  sections/           larger page sections (hero, gallery, callout…)
  site/               header and footer
  graphics/           the generative hero canvas
lib/
  schemas/            Zod schemas — the source of truth for content shape
  content/            typed loaders + cross-reference validation
scripts/          ← validate-content.ts, generate-graphics.ts
docs/             ← reference material (publication PDFs); not published
```

**Design rule:** components never contain research content. Everything a
visitor reads comes from `content/*.yaml` through the typed loaders in
`lib/content/`. If you find yourself writing prose inside a component, put it
in `content/pages.yaml` instead.

## Editing content

Each file in `content/` starts with a comment explaining exactly how to edit
it. In short:

- **People** → `content/people.yaml` (headshots in `public/images/people/`)
- **Projects** → `content/projects.yaml` (each entry becomes `/research/<slug>`)
- **Publications** → `content/publications.yaml`
- **News** → `content/news.yaml` (each entry becomes `/news/<slug>`)
- **Media / gallery** → `content/media.yaml` (files in `public/media/`)
- **Page text & headlines** → `content/pages.yaml`
- **Name, contact, footer** → `content/site.yaml`
- **Menus** → `content/navigation.yaml`

After any edit, run:

```bash
npm run validate:content
```

Validation fails with a human-readable message pointing at the exact field
when something is missing or malformed (and checks that cross-references and
referenced files actually exist). The production build runs the same check, so
broken content can never be deployed silently.

### Adding images and videos

1. Copy the file into the right folder under `public/` (see the tree above).
   Prefer web-friendly sizes: JPEG around 1600 px wide for photos, MP4 (H.264)
   for clips.
2. Reference it from the YAML entry, e.g. `headshot: /images/people/jane-doe.jpg`.
3. YouTube/Vimeo links in `content/media.yaml` (type `video`) embed
   automatically; local `.mp4` files get a native player.
4. Missing images degrade gracefully — cards render an elegant placeholder —
   but validation warns when a referenced local file does not exist.

## Deployment

### GitHub Pages (default)

Pushes to `main` deploy automatically via
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) after
CI passes. Enable **Settings → Pages → Build and deployment → GitHub Actions**
on the repository the first time.

Live site: **https://mdovale.github.io/lasso-web**

The build sets `NEXT_PUBLIC_BASE_PATH=/lasso-web` so assets resolve under the
project URL. To preview that layout locally:

```bash
NEXT_PUBLIC_BASE_PATH=/lasso-web npm run preview
```

### Custom domain

For a root domain (e.g. `lasso.optics.arizona.edu`), add it under **Settings →
Pages → Custom domain**, build without `NEXT_PUBLIC_BASE_PATH`, and set `url:` in
`content/site.yaml` to match.

### Other hosts

The build is a static export in `out/`. Serve it with any static host, or use
[Vercel](https://vercel.com) (import the repo, build command `npm run build`).

```bash
npm run build
npm run start   # serves `out/` on port 3000
```

Keep `url:` in `content/site.yaml` aligned with the public domain so the
sitemap and social previews point at the right place.

## Files non-technical maintainers should not touch

Everything outside `content/` and `public/` is application code:
`app/`, `components/`, `lib/`, `scripts/`, and the configuration files in the
repository root. Changing them requires a developer. Editing `content/` and
adding files under `public/` is always safe — validation has your back.

## Placeholder content

Entries marked `PLACEHOLDER` (some people, news posts, media captions, and
openings) are realistic examples meant to be replaced. Search the `content/`
folder for the word `PLACEHOLDER` and for `# EDIT:` comments to find
everything that needs real data.
