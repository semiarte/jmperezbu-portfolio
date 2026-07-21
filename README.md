# Portfolio — José Miguel Pérez

Personal portfolio site built with [Astro](https://astro.build), showcasing experience, projects, and contact information. Deployed as a fully static site at [jmperezbu.netlify.app](https://jmperezbu.netlify.app).

## Tech Stack

- **[Astro 5](https://astro.build)** — static site generator, `output: 'static'`
- **[Tailwind CSS 4](https://tailwindcss.com)** — via `@tailwindcss/vite`
- **TypeScript**
- **[Vitest](https://vitest.dev)** + **[fast-check](https://fast-check.dev)** — unit and property-based testing
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** — sitemap generation

## Features

- **i18n**: English (default) and Spanish, using Astro's built-in routing (`en` unprefixed, `es` prefixed, with fallback to English)
- **Content collections**: `projects` and `experience` are defined as typed content collections (`src/content/config.ts`), with per-locale YAML data under `src/content/projects/{en,es}` and `src/content/experience/`
- **SEO**: canonical/hreflang tags, structured data (JSON-LD), sitemap, optimized images

## Project Structure

```
src/
├── assets/images/      # Project screenshots and images
├── components/         # Astro components (Hero, Header, Projects, Contact, icons, ...)
├── content/            # Content collections (projects, experience) per locale
├── data/site.ts        # Site-wide config (author info, nav, theme)
├── i18n/                # Translations, locale utilities, and tests
├── layouts/             # BaseLayout.astro
├── pages/               # Routes (index, projects/[slug], es/ locale variants)
├── scripts/             # Client-side scripts (scroll reveal)
└── styles/global.css    # Global styles / Tailwind entry
```

## Development

```bash
npm install
npm run dev       # start dev server at localhost:4321
npm run build     # build production site to ./dist
npm run preview   # preview the production build locally
npm run astro     # run the Astro CLI
```

## Testing

```bash
npx vitest         # run tests (i18n/content/translation property tests, etc.)
```
