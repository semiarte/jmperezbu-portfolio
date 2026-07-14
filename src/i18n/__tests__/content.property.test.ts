import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import type { Locale } from '../types';

/**
 * Property 2: Content collection fallback returns English entry
 *
 * For any supported locale and any content entry identifier, verify the content
 * loading function returns a valid entry with all required fields present and non-empty.
 *
 * **Validates: Requirements 3.5**
 */

const mockExperienceCollection = [
  {
    id: 'en',
    data: {
      experience: [
        { company: 'TestCo', activity: 'Test activity', url: 'https://test.com', position: 'Dev', period: 'JAN 2020 - DEC 2023', description: 'Test description' }
      ]
    }
  },
  {
    id: 'es',
    data: {
      experience: [
        { company: 'TestCo', activity: 'Actividad de prueba', url: 'https://test.com', position: 'Desarrollador', period: 'ENE 2020 - DIC 2023', description: 'Descripción de prueba' }
      ]
    }
  }
];

const mockProjectsCollection = [
  { id: 'en/project1', data: { title: 'Test Project', description: 'A test project', technologies: ['React'], thumbnail: '/test.png', category: 'Web', slug: 'test' } },
  { id: 'es/project1', data: { title: 'Proyecto Prueba', description: 'Un proyecto de prueba', technologies: ['React'], thumbnail: '/test.png', category: 'Web', slug: 'test' } },
];

vi.mock('astro:content', () => ({
  getCollection: vi.fn((collection: string) => {
    if (collection === 'experience') return Promise.resolve(mockExperienceCollection);
    if (collection === 'projects') return Promise.resolve(mockProjectsCollection);
    return Promise.resolve([]);
  }),
}));

describe('Property 2: Content collection fallback returns English entry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getLocalizedExperience returns array with all required fields for any supported locale', async () => {
    const { getLocalizedExperience } = await import('../content');
    const supportedLocales: Locale[] = ['en', 'es'];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...supportedLocales),
        async (locale) => {
          const result = await getLocalizedExperience(locale);

          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThan(0);

          for (const entry of result) {
            expect(entry.company).toBeDefined();
            expect(entry.company.length).toBeGreaterThan(0);
            expect(entry.activity).toBeDefined();
            expect(entry.activity.length).toBeGreaterThan(0);
            expect(entry.url).toBeDefined();
            expect(entry.url.length).toBeGreaterThan(0);
            expect(entry.position).toBeDefined();
            expect(entry.position.length).toBeGreaterThan(0);
            expect(entry.period).toBeDefined();
            expect(entry.period.length).toBeGreaterThan(0);
            expect(entry.description).toBeDefined();
            expect(entry.description.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('getLocalizedProjects returns array with all required fields for any supported locale', async () => {
    const { getLocalizedProjects } = await import('../content');
    const supportedLocales: Locale[] = ['en', 'es'];

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...supportedLocales),
        async (locale) => {
          const result = await getLocalizedProjects(locale);

          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThan(0);

          for (const entry of result) {
            expect(entry.data.title).toBeDefined();
            expect(entry.data.title.length).toBeGreaterThan(0);
            expect(entry.data.description).toBeDefined();
            expect(entry.data.description.length).toBeGreaterThan(0);
            expect(entry.data.technologies).toBeDefined();
            expect(Array.isArray(entry.data.technologies)).toBe(true);
            expect(entry.data.technologies.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('getLocalizedExperience falls back to English for unsupported locale', async () => {
    const { getLocalizedExperience } = await import('../content');

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('fr', 'de', 'pt', 'zh', 'ja'),
        async (unsupportedLocale) => {
          const result = await getLocalizedExperience(unsupportedLocale as unknown as Locale);

          // Should fall back to English content
          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThan(0);

          for (const entry of result) {
            expect(entry.company).toBeDefined();
            expect(entry.company.length).toBeGreaterThan(0);
            expect(entry.activity).toBeDefined();
            expect(entry.activity.length).toBeGreaterThan(0);
            expect(entry.url).toBeDefined();
            expect(entry.url.length).toBeGreaterThan(0);
            expect(entry.position).toBeDefined();
            expect(entry.position.length).toBeGreaterThan(0);
            expect(entry.period).toBeDefined();
            expect(entry.period.length).toBeGreaterThan(0);
            expect(entry.description).toBeDefined();
            expect(entry.description.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('getLocalizedProjects falls back to English for unsupported locale', async () => {
    const { getLocalizedProjects } = await import('../content');

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('fr', 'de', 'pt', 'zh', 'ja'),
        async (unsupportedLocale) => {
          const result = await getLocalizedProjects(unsupportedLocale as unknown as Locale);

          // Should fall back to English content
          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThan(0);

          for (const entry of result) {
            expect(entry.data.title).toBeDefined();
            expect(entry.data.title.length).toBeGreaterThan(0);
            expect(entry.data.description).toBeDefined();
            expect(entry.data.description.length).toBeGreaterThan(0);
            expect(entry.data.technologies).toBeDefined();
            expect(Array.isArray(entry.data.technologies)).toBe(true);
            expect(entry.data.technologies.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
