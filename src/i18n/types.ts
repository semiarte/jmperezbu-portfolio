export type Locale = 'en' | 'es';

export interface ProjectPageTranslations {
  pageTitle: string;
  introAriaLabel: string;
  problemHeading: string;
  problemDescription: string;
  solutionHeading: string;
  solutionDescription: string;
  mockupAlt: string;
  processAriaLabel: string;
  processHeading: string;
  processDescription: string;
  processSteps: {
    research: { label: string; description: string };
    prototyping: { label: string; description: string };
    design: { label: string; description: string };
    development: { label: string; description: string };
  };
  projectAriaLabel: string;
  projectHeading: string;
  projectDescription: string;
  features: {
    feature1: { title: string; description: string; imageAlt: string };
    feature2: { title: string; description: string; imageAlt: string };
  };
  budgetManager: {
    heading: string;
    description: string;
    imageAlt: string;
  };
  moreInfoAriaLabel: string;
  externalLinks: {
    figmaLabel: string;
    figmaAriaLabel: string;
    githubLabel: string;
    githubAriaLabel: string;
  };
}

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
    linkText: string;
  };
  meta: {
    title: string;
    description: string;
  };
  site: {
    authorTitle: string;
    authorIntro: string;
  };
  donarApp: ProjectPageTranslations;
  split4meApp: ProjectPageTranslations;
}
