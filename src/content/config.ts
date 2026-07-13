import { defineCollection, z } from "astro:content";

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
