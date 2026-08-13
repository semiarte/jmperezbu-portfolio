# Sección "Sobre mí" con integración contextual del jardín digital

## Contexto y objetivo

El portfolio enlaza el jardín digital (`https://jmperezbu-garden.forestry.md/`) solo desde el footer, con un texto breve ("mi jardín" / "my garden"). Se valoró promoverlo a la navegación principal como página independiente, pero se descartó: la nav actual (Experience, Projects, Contact, Resume) funciona como embudo de contratación, y el jardín es contenido vivo/heterogéneo (mezcla de notas pulidas y en progreso) que no conviene mostrar con la misma jerarquía que las secciones orientadas a conversión.

En su lugar, el jardín se integra de forma contextual dentro de una nueva sección "Sobre mí", que hoy no existe en el sitio (las secciones actuales son Hero, Experience, Projects, Contact). Esta sección cubre además un hueco real: el sitio no tiene ningún bloque que hable de quién es el autor y cómo trabaja.

## Alcance

- Nueva sección "Sobre mí" / "About" entre Hero y Experience.
- El jardín digital se menciona como cierre natural de esa sección (aprendizaje continuo), con enlace externo.
- Se añade "About" a la navegación principal, ya que la sección tiene contenido propio y sustancial.
- El enlace al jardín en el footer se mantiene sin cambios.
- Fuera de alcance: traducir o modificar el contenido del propio jardín; rediseñar la navegación más allá de añadir este ítem; foto de perfil (se descarta explícitamente, ver Diseño visual).

## Diseño visual

Layout de una sola columna, ancho completo, sin foto — consistente con el resto del sitio (Hero y Experience tampoco usan imagen de perfil):

```
———————————————————————————————
  Sobre mí

  Párrafo 1: quién eres, tu enfoque
  frontend/UX, +10 años de experiencia

  Párrafo 2: cómo trabajas — curiosidad,
  aprendizaje continuo, IA-assisted dev

  🌱 Sigo documentando lo que aprendo
  en mi jardín digital →
———————————————————————————————
```

Sigue el patrón visual de `Experience.astro`: heading `text-4xl font-semibold mb-12`, envuelto en `ScrollReveal`, sección con `py-20 px-8` e `id` propio para anclaje de navegación. Los párrafos usan un ancho máximo legible (similar a `max-w-4xl`/`max-w-3xl` como en Hero) en vez de ocupar el ancho completo del contenedor.

El enlace al jardín reutiliza el estilo ya presente en `Footer.astro` (texto teal-400 con subrayado animado on-hover), para mantener consistencia visual entre ambas apariciones del enlace.

## Componentes y estructura de página

- **Nuevo componente**: `src/components/About.astro`, con la misma forma que `Experience.astro` (recibe `locale` como prop, usa `getTranslations`).
- **`src/pages/index.astro`** y **`src/pages/es/index.astro`**: se inserta `<About locale={locale} />` entre `<Hero locale={locale} />` y `<Experience locale={locale} />`.
- **`src/components/Header.astro`**: se añade un ítem "About" al array `navigationLinks`, como primer elemento (antes de Experience), apuntando a `getNavHref("#about")`.
- **`src/data/site.ts`**: se añade `{ label: "About", path: "#about" }` como primer elemento de `siteConfig.navigation`, por consistencia con el resto de la config (este array no se consume en runtime actualmente, pero se mantiene alineado con el contenido real del sitio).

## Contenido (copy)

Nuevas claves de traducción, en `src/i18n/translations/es.ts` y `en.ts`:

```
nav.about
about.heading
about.paragraph1
about.paragraph2
about.gardenText
about.gardenLinkText
```

**Español:**

- `nav.about`: "Sobre mí"
- `about.heading`: "Sobre mí"
- `about.paragraph1`: "Soy desarrollador frontend y diseñador UX/UI con más de 10 años transformando ideas en productos digitales funcionales. Me muevo con soltura entre React, Laravel y el diseño de interfaces, cuidando tanto el código como la experiencia de quien lo usa."
- `about.paragraph2`: "Trabajo con curiosidad: incorporo herramientas de IA en mi proceso de diseño y desarrollo, y dedico tiempo a aprender constantemente sobre nuevas técnicas de frontend, accesibilidad y patrones de UI."
- `about.gardenText`: "Documento ese aprendizaje en mi jardín digital, una colección viva de notas y experimentos."
- `about.gardenLinkText`: "Explorar el jardín"

**English:**

- `nav.about`: "About"
- `about.heading`: "About me"
- `about.paragraph1`: "I'm a frontend developer and UX/UI designer with 10+ years of experience turning ideas into functional digital products. I move comfortably between React, Laravel, and interface design, caring as much about the code as about the experience of the people who use it."
- `about.paragraph2`: "I work with curiosity: I bring AI tools into my design and development process, and I spend time continuously learning about new frontend techniques, accessibility, and UI patterns."
- `about.gardenText`: "I document that learning in my digital garden, a living collection of notes and experiments."
- `about.gardenLinkText`: "Explore the garden"

El enlace apunta a `https://jmperezbu-garden.forestry.md/` en ambos idiomas, `target="_blank"` y `rel="noopener"`. Se acepta como limitación conocida que el contenido del jardín está mayoritariamente en inglés independientemente del idioma del sitio; no se traduce ni se adapta el jardín en sí, solo el copy que lo enlaza.

## Consideraciones técnicas

- El proyecto tiene tests de propiedad en `src/i18n/__tests__/translations.property.test.ts` que verifican paridad de claves entre `es.ts` y `en.ts`. Las nuevas claves deben añadirse a ambos archivos para que la suite siga pasando.
- El scroll-spy de `Header.astro` (IntersectionObserver sobre `section[id]`) detectará automáticamente la nueva sección `#about` sin cambios adicionales, siempre que el `id` se aplique a la sección igual que en `Experience`/`Projects`/`Contact`.

## Testing

- Verificación visual manual con el servidor de desarrollo, en ambos locales (`/` y `/es/`) y en mobile/desktop, comprobando: la sección se ve correctamente, el enlace del jardín abre en pestaña nueva, el ítem "About" en la nav hace scroll suave y se resalta al entrar en viewport.
- Ejecutar la suite de tests de i18n (`src/i18n/__tests__`) para confirmar que no se rompe la paridad de claves entre idiomas.
