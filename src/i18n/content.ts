import { getCollection } from 'astro:content';
import type { Locale } from './types';

export async function getLocalizedExperience(locale: Locale) {
  const allExperience = await getCollection('experience');
  // Try locale-specific file first, fall back to English
  const localeEntry = allExperience.find(e => e.id === `${locale}`);
  const fallbackEntry = allExperience.find(e => e.id === 'en');
  return (localeEntry ?? fallbackEntry)?.data.experience ?? [];
}

export async function getLocalizedProjects(locale: Locale) {
  const allProjects = await getCollection('projects');
  // Filter by locale prefix in the ID
  const localeProjects = allProjects.filter(p => p.id.startsWith(`${locale}/`));
  const fallbackProjects = allProjects.filter(p => p.id.startsWith('en/'));

  if (localeProjects.length > 0) return localeProjects;
  return fallbackProjects;
}
