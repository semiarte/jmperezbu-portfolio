import type { Locale, TranslationStrings } from './types';
import { en } from './translations/en';
import { es } from './translations/es';

const translations: Record<Locale, TranslationStrings> = { en, es };
const defaultLocale: Locale = 'en';

export function getTranslations(locale: Locale): TranslationStrings {
  if (locale === 'en' || locale === 'es') {
    return translations[locale];
  }
  return translations[defaultLocale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang === 'es') return 'es';
  return 'en';
}

export function getLocalePath(locale: Locale, path: string = ''): string {
  if (locale === 'en') return `/${path}`;
  return `/${locale}/${path}`;
}
