import { defineCollection, z } from "astro:content";

const pageContentSchema = z.object({
  intro: z.object({
    mockupImage: z.string(),
    mockupAlt: z.string(),
    problemHeading: z.string(),
    problemDescription: z.string(),
    solutionHeading: z.string(),
    solutionDescription: z.string(),
  }),
  process: z.object({
    heading: z.string(),
    description: z.string(),
    steps: z.array(z.object({
      label: z.string(),
      description: z.string(),
    })),
  }),
  features: z.object({
    heading: z.string(),
    description: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
      imageAlt: z.string(),
    })),
  }),
  externalLinks: z.array(z.object({
    type: z.enum(['figma', 'github', 'web']),
    url: z.string(),
    label: z.string(),
    ariaLabel: z.string(),
  })),
  additionalSection: z.object({
    heading: z.string(),
    description: z.string(),
    image: z.string(),
    imageAlt: z.string(),
  }).optional(),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    thumbnail: z.string(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    category: z.string(),
    slug: z.string().optional(),
    pageContent: pageContentSchema.optional(),
  }),
});

const experience = defineCollection({
  type: "data",
  schema: z.object({
    experience: z.array(
      z.object({
        company: z.string(),
        activity: z.string(),
        url: z.string(),
        position: z.string(),
        period: z.string(),
        description: z.string(),
      })
    ),
  }),
});

export const collections = { projects, experience };
