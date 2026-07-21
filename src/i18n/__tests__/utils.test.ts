import { describe, it, expect } from 'vitest';
import { getLocaleFromUrl, getLocalePath, getPathFragment, getTranslations } from '../utils';

describe('getLocaleFromUrl', () => {
  it('returns "en" for root path', () => {
    expect(getLocaleFromUrl(new URL('http://localhost/'))).toBe('en');
  });

  it('returns "es" for /es/ path', () => {
    expect(getLocaleFromUrl(new URL('http://localhost/es/'))).toBe('es');
  });

  it('returns "es" for /es/some-page path', () => {
    expect(getLocaleFromUrl(new URL('http://localhost/es/some-page'))).toBe('es');
  });

  it('returns "en" for unknown locale path like /fr/', () => {
    expect(getLocaleFromUrl(new URL('http://localhost/fr/'))).toBe('en');
  });

  it('returns "en" for non-locale path like /about', () => {
    expect(getLocaleFromUrl(new URL('http://localhost/about'))).toBe('en');
  });
});

describe('getLocalePath', () => {
  it('returns "/" for locale "en" with no path', () => {
    expect(getLocalePath('en')).toBe('/');
  });

  it('returns "/es/" for locale "es" with no path', () => {
    expect(getLocalePath('es', '')).toBe('/es/');
  });

  it('returns "/about" for locale "en" with path "about"', () => {
    expect(getLocalePath('en', 'about')).toBe('/about');
  });

  it('returns "/es/about" for locale "es" with path "about"', () => {
    expect(getLocalePath('es', 'about')).toBe('/es/about');
  });
});

describe('getPathFragment', () => {
  it('returns "" for locale "en" root path "/"', () => {
    expect(getPathFragment('en', '/')).toBe('');
  });

  it('returns "" for locale "es" root path "/es/"', () => {
    expect(getPathFragment('es', '/es/')).toBe('');
  });

  it('returns "projects/foo" for locale "en" path "/projects/foo"', () => {
    expect(getPathFragment('en', '/projects/foo')).toBe('projects/foo');
  });

  it('returns "projects/foo" for locale "es" path "/es/projects/foo"', () => {
    expect(getPathFragment('es', '/es/projects/foo')).toBe('projects/foo');
  });

  it('round-trips with getLocalePath for the same locale', () => {
    const fragment = getPathFragment('es', '/es/projects/foo');
    expect(getLocalePath('es', fragment)).toBe('/es/projects/foo');
  });
});

describe('getTranslations', () => {
  it('returns English translations for locale "en"', () => {
    const t = getTranslations('en');
    expect(t.nav.experience).toBe('Experience');
  });

  it('returns Spanish translations for locale "es"', () => {
    const t = getTranslations('es');
    expect(t.nav.experience).toBe('Experiencia');
  });

  it('returns English translations for invalid locale (fallback)', () => {
    const t = getTranslations('fr' as any);
    expect(t.nav.experience).toBe('Experience');
  });

  it('returns English translations for undefined locale (fallback)', () => {
    const t = getTranslations(undefined as any);
    expect(t.nav.experience).toBe('Experience');
  });
});
