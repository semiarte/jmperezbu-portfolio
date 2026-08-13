# About Section with Digital Garden Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "About me" section to the portfolio (between Hero and Experience) that introduces the author and closes with a contextual link to his digital garden, plus a matching "About" nav item.

**Architecture:** New `About.astro` component follows the exact shape of the existing `Experience.astro` component (locale prop, `getTranslations`, `ScrollReveal`, `section[id]` for scroll-spy). New translation keys are added to both `en.ts` and `es.ts` and to the shared `TranslationStrings` type. The component is wired into both page entry points (`/` and `/es/`) and the nav link list in `Header.astro`.

**Tech Stack:** Astro components, Tailwind CSS utility classes, TypeScript i18n dictionaries, Vitest (fast-check property tests already in the repo).

## Global Constraints

- New translation keys must be added to **both** `src/i18n/translations/en.ts` and `src/i18n/translations/es.ts` — `src/i18n/__tests__/translations.property.test.ts` asserts key parity between locales and will fail otherwise.
- The garden URL is `https://jmperezbu-garden.forestry.md/` in both locales, opened with `target="_blank" rel="noopener"` — do not translate or alter the garden content itself.
- Section markup must carry `id="about"` for the existing `IntersectionObserver` scroll-spy in `Header.astro` to pick it up automatically — no changes needed to the observer logic itself.
- Follow the existing visual pattern from `Experience.astro`: `<ScrollReveal>` wrapper, `text-4xl font-semibold mb-12` heading, `py-20 px-8` section padding.
- No profile photo — single-column, text-only layout (per approved spec).

---

### Task 1: Add `about` and `nav.about` keys to the translation type and both dictionaries

**Files:**
- Modify: `src/i18n/types.ts:41-78` (add `about` block, add `about: string` to `nav`)
- Modify: `src/i18n/translations/en.ts:3-40`
- Modify: `src/i18n/translations/es.ts:3-40`
- Test: `src/i18n/__tests__/translations.property.test.ts` (existing test, no new file)

**Interfaces:**
- Produces: `TranslationStrings.nav.about: string`, `TranslationStrings.about.heading: string`, `TranslationStrings.about.paragraph1: string`, `TranslationStrings.about.paragraph2: string`, `TranslationStrings.about.gardenText: string`, `TranslationStrings.about.gardenLinkText: string` — consumed by Task 2 (`About.astro`) and Task 3 (`Header.astro`).

- [ ] **Step 1: Read the existing property test to confirm what it checks**

Run: `cat src/i18n/__tests__/translations.property.test.ts`
Expected: the test walks both dictionaries and asserts they have the same set of keys (confirms why en/es must stay in lockstep).

- [ ] **Step 2: Add the `about` key and `nav.about` to `TranslationStrings`**

In `src/i18n/types.ts`, inside `export interface TranslationStrings { ... }`:

```typescript
export interface TranslationStrings {
  nav: {
    about: string;
    experience: string;
    projects: string;
    contact: string;
    resume: string;
  };
  // ...existing fields (projectNav, hero, experience, projects, contact) unchanged...
  footer: {
    description: string;
    linkText: string;
  };
  about: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    gardenText: string;
    gardenLinkText: string;
  };
  // ...rest of interface (meta, site, donarApp, ...) unchanged...
}
```

Only add the `about: string` line inside the existing `nav` block and the new top-level `about: { ... }` block — do not reorder or touch unrelated fields.

- [ ] **Step 3: Add the English strings**

In `src/i18n/translations/en.ts`, inside `nav: { ... }` add:

```typescript
  nav: {
    about: 'About',
    experience: 'Experience',
    projects: 'Projects',
    contact: 'Contact',
    resume: 'Resume',
  },
```

Immediately after the existing `footer: { ... }` block, add:

```typescript
  about: {
    heading: 'About me',
    paragraph1: "I'm a frontend developer and UX/UI designer with 10+ years of experience turning ideas into functional digital products. I move comfortably between React, Laravel, and interface design, caring as much about the code as about the experience of the people who use it.",
    paragraph2: 'I work with curiosity: I bring AI tools into my design and development process, and I spend time continuously learning about new frontend techniques, accessibility, and UI patterns.',
    gardenText: 'I document that learning in my digital garden, a living collection of notes and experiments.',
    gardenLinkText: 'Explore the garden',
  },
```

- [ ] **Step 4: Add the Spanish strings**

In `src/i18n/translations/es.ts`, inside `nav: { ... }` add:

```typescript
  nav: {
    about: 'Sobre mí',
    experience: 'Experiencia',
    projects: 'Proyectos',
    contact: 'Contacto',
    resume: 'Currículum',
  },
```

Immediately after the existing `footer: { ... }` block, add:

```typescript
  about: {
    heading: 'Sobre mí',
    paragraph1: 'Soy desarrollador frontend y diseñador UX/UI con más de 10 años transformando ideas en productos digitales funcionales. Me muevo con soltura entre React, Laravel y el diseño de interfaces, cuidando tanto el código como la experiencia de quien lo usa.',
    paragraph2: 'Trabajo con curiosidad: incorporo herramientas de IA en mi proceso de diseño y desarrollo, y dedico tiempo a aprender constantemente sobre nuevas técnicas de frontend, accesibilidad y patrones de UI.',
    gardenText: 'Documento ese aprendizaje en mi jardín digital, una colección viva de notas y experimentos.',
    gardenLinkText: 'Explorar el jardín',
  },
```

- [ ] **Step 5: Run the i18n test suite to verify parity and type-check**

Run: `npx vitest run src/i18n/__tests__`
Expected: all tests pass (including `translations.property.test.ts`), confirming `en.ts` and `es.ts` have matching key sets and both satisfy `TranslationStrings`.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/types.ts src/i18n/translations/en.ts src/i18n/translations/es.ts
git commit -m "feat(i18n): add about section and nav.about translation keys"
```

---

### Task 2: Create the `About.astro` component

**Files:**
- Create: `src/components/About.astro`

**Interfaces:**
- Consumes: `TranslationStrings.about.*` and `Locale` type from Task 1; `ScrollReveal` component (`src/components/ScrollReveal.astro`, already used identically in `Experience.astro`); `getTranslations` from `src/i18n/utils`.
- Produces: default export Astro component accepting `{ locale: Locale }` prop, rendering `<section id="about">` — consumed by Task 3 (page wiring).

- [ ] **Step 1: Read `Experience.astro` as the structural reference**

Run: `cat src/components/Experience.astro`
Expected: confirms the prop pattern (`interface Props { locale: Locale }`), the `ScrollReveal` usage, and the `text-4xl font-semibold mb-12` heading class to mirror.

- [ ] **Step 2: Write `About.astro`**

```astro
---
import type { Locale } from '../i18n/types';
import { getTranslations } from '../i18n/utils';
import ScrollReveal from "./ScrollReveal.astro";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
---

<section id="about" aria-label="About the author" class="py-20 px-8">
  <ScrollReveal>
    <h2 class="text-4xl font-semibold mb-12">{t.about.heading}</h2>
  </ScrollReveal>
  <ScrollReveal delay={100}>
    <div class="max-w-3xl space-y-6 text-base md:text-lg text-slate-300">
      <p>{t.about.paragraph1}</p>
      <p>{t.about.paragraph2}</p>
      <p>
        {t.about.gardenText}{" "}
        <a
          href="https://jmperezbu-garden.forestry.md/"
          target="_blank"
          rel="noopener"
          class="text-teal-400 inline-flex relative items-center after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-teal-400 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
          >{t.about.gardenLinkText}</a
        >
      </p>
    </div>
  </ScrollReveal>
</section>
```

- [ ] **Step 3: Verify the file has no TypeScript errors**

Run: `npx astro check`
Expected: no errors reported for `src/components/About.astro` (pre-existing unrelated errors, if any, are out of scope).

- [ ] **Step 4: Commit**

```bash
git add src/components/About.astro
git commit -m "feat: add About.astro component with digital garden link"
```

---

### Task 3: Wire `About` into both page entry points

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/es/index.astro`

**Interfaces:**
- Consumes: `About` component from Task 2 (`import About from '../components/About.astro'` or `'../../components/About.astro'` depending on nesting).

- [ ] **Step 1: Read both current page files**

Run: `cat src/pages/index.astro src/pages/es/index.astro`
Expected: confirms both files render `<Hero locale={locale} /> <Experience locale={locale} /> ...` in the same shape, so the same edit applies to both (adjust the import path depth for the `es/` file).

- [ ] **Step 2: Edit `src/pages/index.astro`**

Add the import next to the other component imports:

```astro
import About from '../components/About.astro';
```

Insert `<About locale={locale} />` between `<Hero locale={locale} />` and `<Experience locale={locale} />`:

```astro
      <Hero locale={locale} />
      <About locale={locale} />
      <Experience locale={locale} />
```

- [ ] **Step 3: Apply the same edit to `src/pages/es/index.astro`**

Same two changes (import + insertion), using the import path relative to `src/pages/es/index.astro` (one extra `../`).

- [ ] **Step 4: Start the dev server and visually verify both locales**

Run: `npx astro dev` (in background)

Then navigate to `http://localhost:4321/` and `http://localhost:4321/es/`.
Expected: an "About me" / "Sobre mí" section appears between the hero and the experience list, with two paragraphs and a teal "Explore the garden" / "Explorar el jardín" link that opens `https://jmperezbu-garden.forestry.md/` in a new tab.

Stop the dev server afterward.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/pages/es/index.astro
git commit -m "feat: render About section between Hero and Experience"
```

---

### Task 4: Add "About" to the header navigation and scroll-spy verification

**Files:**
- Modify: `src/components/Header.astro:25-29`
- Modify: `src/data/site.ts:12-16`

**Interfaces:**
- Consumes: `t.nav.about` from Task 1; existing `getNavHref` helper already defined in `Header.astro`.

- [ ] **Step 1: Add the About link to `navigationLinks` in `Header.astro`**

In `src/components/Header.astro`, change:

```typescript
const navigationLinks = [
  { label: t.nav.experience, path: getNavHref("#experience") },
  { label: t.nav.projects, path: getNavHref("#projects") },
  { label: t.nav.contact, path: getNavHref("#contact") },
];
```

to:

```typescript
const navigationLinks = [
  { label: t.nav.about, path: getNavHref("#about") },
  { label: t.nav.experience, path: getNavHref("#experience") },
  { label: t.nav.projects, path: getNavHref("#projects") },
  { label: t.nav.contact, path: getNavHref("#contact") },
];
```

This list is mapped in both the desktop nav (`#desktop-nav`) and mobile menu (`#mobile-menu`) blocks already, so both pick up the new item automatically.

- [ ] **Step 2: Update `siteConfig.navigation` in `src/data/site.ts` for consistency**

Change:

```typescript
  navigation: [
    { label: "Experience", path: "#experience" },
    { label: "Projects", path: "#projects" },
    { label: "Contact", path: "#contact" },
  ],
```

to:

```typescript
  navigation: [
    { label: "About", path: "#about" },
    { label: "Experience", path: "#experience" },
    { label: "Projects", path: "#projects" },
    { label: "Contact", path: "#contact" },
  ],
```

- [ ] **Step 3: Start the dev server and manually verify nav behavior**

Run: `npx astro dev` (in background)

On `http://localhost:4321/`:
- Confirm "About" is the first nav link, both in the desktop bar and the mobile hamburger menu.
- Click "About" and confirm the page smooth-scrolls to the About section.
- Scroll manually into the About section and confirm the "About" nav link turns `text-teal-400` (scroll-spy highlight), matching the existing behavior for Experience/Projects/Contact.

Repeat on `http://localhost:4321/es/` confirming the label reads "Sobre mí".

Stop the dev server afterward.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/data/site.ts
git commit -m "feat: add About nav link with scroll-spy support"
```

---

### Task 5: Full regression pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: all tests pass, including `src/i18n/__tests__/translations.property.test.ts`, `content.property.test.ts`, `url-fragment.property.test.ts`, and `utils.test.ts`.

- [ ] **Step 2: Run the Astro type checker**

Run: `npx astro check`
Expected: no new errors introduced by `About.astro`, `Header.astro`, `index.astro`, `es/index.astro`, `site.ts`, or the i18n files.

- [ ] **Step 3: Run a production build**

Run: `npx astro build`
Expected: build completes successfully, producing output for both `/` and `/es/` routes with the About section present.

- [ ] **Step 4: Final commit if any fixes were needed during verification**

Only if Steps 1–3 required fixes:

```bash
git add -A
git commit -m "fix: address regressions found in full verification pass"
```

If no fixes were needed, skip this commit — Task 4's commit is the last one.
