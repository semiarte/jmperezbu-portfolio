import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://jmperezbu.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true,
    },
    fallback: {
      es: 'en',
    },
  },
});
