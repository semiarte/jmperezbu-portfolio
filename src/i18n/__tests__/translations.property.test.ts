import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getTranslations } from '../utils';
import type { Locale } from '../types';

/**
 * Property 1: Translation fallback always returns a non-empty string
 *
 * For any arbitrary locale input (valid or invalid), getTranslations
 * never returns undefined and all leaf string values are non-empty.
 *
 * **Validates: Requirements 2.5, 6.5**
 */

/** Recursively collects all leaf string values from a nested object */
function getAllLeafStrings(obj: unknown, path = ''): { path: string; value: unknown }[] {
  const results: { path: string; value: unknown }[] = [];
  if (obj === null || obj === undefined) {
    results.push({ path, value: obj });
    return results;
  }
  if (typeof obj === 'string') {
    results.push({ path, value: obj });
    return results;
  }
  if (typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      const currentPath = path ? `${path}.${key}` : key;
      results.push(...getAllLeafStrings(val, currentPath));
    }
  }
  return results;
}

describe('Property 1: Translation fallback always returns a non-empty string', () => {
  it('getTranslations returns a defined, non-null object for any valid locale', () => {
    const validLocales: Locale[] = ['en', 'es'];

    fc.assert(
      fc.property(
        fc.constantFrom(...validLocales),
        (locale) => {
          const translations = getTranslations(locale);
          expect(translations).toBeDefined();
          expect(translations).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('getTranslations returns a defined, non-null object for any arbitrary string (fallback)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 50 }),
        (arbitraryLocale) => {
          // Cast to Locale to test fallback behavior with invalid inputs
          const translations = getTranslations(arbitraryLocale as unknown as Locale);
          expect(translations).toBeDefined();
          expect(translations).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all leaf values in the returned translations are non-empty strings for valid locales', () => {
    const validLocales: Locale[] = ['en', 'es'];

    fc.assert(
      fc.property(
        fc.constantFrom(...validLocales),
        (locale) => {
          const translations = getTranslations(locale);
          const leaves = getAllLeafStrings(translations);

          expect(leaves.length).toBeGreaterThan(0);

          for (const leaf of leaves) {
            expect(typeof leaf.value).toBe('string');
            expect((leaf.value as string).length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all leaf values in the returned translations are non-empty strings for arbitrary locale inputs (fallback)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 50 }),
        (arbitraryLocale) => {
          const translations = getTranslations(arbitraryLocale as unknown as Locale);
          const leaves = getAllLeafStrings(translations);

          expect(leaves.length).toBeGreaterThan(0);

          for (const leaf of leaves) {
            expect(typeof leaf.value).toBe('string');
            expect((leaf.value as string).length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
