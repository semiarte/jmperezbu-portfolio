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

/**
 * Strips the locale prefix (if any) from a URL pathname, returning the
 * locale-agnostic path fragment (no leading/trailing slash) so it can be
 * fed back into getLocalePath() for the current or any other locale.
 */
export function getPathFragment(locale: Locale, pathname: string): string {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  if (locale === 'es') {
    if (trimmed === 'es') return '';
    if (trimmed.startsWith('es/')) return trimmed.slice('es/'.length);
  }
  return trimmed;
}
