export type Locale = 'en' | 'es';

export interface TranslationStrings {
  nav: {
    experience: string;
    projects: string;
    contact: string;
    resume: string;
  };
  hero: {
    scrollToExplore: string;
  };
  experience: {
    heading: string;
  };
  projects: {
    heading: string;
  };
  contact: {
    heading: string;
    badge: string;
    emailIntro: string;
    socialIntro: string;
  };
  footer: {
    description: string;
  };
  meta: {
    title: string;
    description: string;
  };
  site: {
    authorTitle: string;
    authorIntro: string;
  };
}
