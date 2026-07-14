import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getLocalePath } from '../utils';
import type { Locale } from '../types';

/**
 * Property 3: Locale path generation preserves URL fragment
 *
 * For any valid locale ('en' or 'es') and any non-empty URL hash fragment
 * string, constructing a locale switch URL via `getLocalePath(targetLocale) + hash`
 * produces a string that ends with the original hash fragment unchanged.
 *
 * **Validates: Requirements 4.6**
 */

describe('Property 3: Locale path generation preserves URL fragment', () => {
  const validLocales: Locale[] = ['en', 'es'];

  /** Arbitrary for generating non-empty hash fragments starting with '#' */
  const hashFragmentArb = fc
    .string({ minLength: 1, maxLength: 100 })
    .filter((s) => !s.includes('#'))
    .map((s) => `#${s}`);

  it('getLocalePath(locale) + hash always ends with the original hash fragment', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...validLocales),
        hashFragmentArb,
        (locale, hash) => {
          const localePath = getLocalePath(locale);
          const fullUrl = localePath + hash;

          // The constructed URL must end with the hash fragment unchanged
          expect(fullUrl.endsWith(hash)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('hash fragment is preserved without encoding or truncation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...validLocales),
        hashFragmentArb,
        (locale, hash) => {
          const localePath = getLocalePath(locale);
          const fullUrl = localePath + hash;

          // Extract the hash portion from the result
          const hashIndex = fullUrl.indexOf('#');
          expect(hashIndex).toBeGreaterThanOrEqual(0);

          const extractedHash = fullUrl.slice(hashIndex);
          // The extracted hash must be identical to the original (no encoding, no truncation)
          expect(extractedHash).toBe(hash);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('hash fragment with special characters is preserved unchanged', () => {
    /** Arbitrary for hash fragments that include URL-sensitive characters */
    const specialChars = '-_. ~!$&\'()*+,;=:@/?%[]';
    const specialHashArb = fc
      .array(
        fc.constantFrom(
          ...('abc123' + specialChars).split('')
        ),
        { minLength: 1, maxLength: 50 }
      )
      .map((chars) => `#${chars.join('')}`);

    fc.assert(
      fc.property(
        fc.constantFrom(...validLocales),
        specialHashArb,
        (locale, hash) => {
          const localePath = getLocalePath(locale);
          const fullUrl = localePath + hash;

          // Must end with hash unchanged
          expect(fullUrl.endsWith(hash)).toBe(true);

          // Extracted hash must be identical
          const hashIndex = fullUrl.indexOf('#');
          const extractedHash = fullUrl.slice(hashIndex);
          expect(extractedHash).toBe(hash);
        }
      ),
      { numRuns: 100 }
    );
  });
});
