import { defineCollection, z } from "astro:content";

const pageContentSchema = ({ image }: { image: () => z.ZodType<ImageMetadata> }) => {
  const personaSchema = z.object({
    avatar: image(),
    avatarAlt: z.string(),
    name: z.string(),
    trait: z.string(),
    role: z.string(),
    description: z.string(),
  });

  const processStepExtraSchema = z.discriminatedUnion("type", [
    z.object({
      type: z.literal("personas"),
      items: z.array(personaSchema),
    }),
    z.object({
      type: z.literal("story"),
      heading: z.string(),
      description: z.string(),
      quote: z.string(),
    }),
    z.object({
      type: z.literal("image"),
      image: image(),
      imageAlt: z.string(),
    }),
    z.object({
      type: z.literal("typeSystem"),
      fontName: z.string(),
      baseValue: z.string(),
      scale: z.string(),
      sizes: z.array(z.object({
        label: z.string(),
        px: z.string(),
        rem: z.string(),
      })),
      colorRatio: z.array(z.object({
        value: z.string(),
        colorClass: z.string(),
      })),
      image: image(),
      imageAlt: z.string(),
    }),
  ]);

  return z.object({
  intro: z.object({
    mockupImage: image(),
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
      detail: z.object({
        paragraphs: z.array(z.string()),
        bullets: z.array(z.string()).optional(),
        extra: processStepExtraSchema.optional(),
      }).optional(),
    })),
  }),
  features: z.object({
    heading: z.string(),
    description: z.string(),
    items: z.array(z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
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
    image: image(),
    imageAlt: z.string(),
  }).optional(),
  });
};

const projects = defineCollection({
  type: "data",
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    thumbnail: image(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    category: z.string(),
    slug: z.string().optional(),
    pageContent: pageContentSchema({ image }).optional(),
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

const chatbot = defineCollection({
  type: "data",
  schema: z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        message: z.string(),
        options: z.array(
          z.object({
            label: z.string(),
            next: z.string().optional(),
            action: z.object({
              type: z.enum(['scroll', 'link', 'restart']),
              target: z.string().optional(),
            }).optional(),
          })
        ),
      })
    ),
  }),
});

export const collections = { projects, experience, chatbot };
