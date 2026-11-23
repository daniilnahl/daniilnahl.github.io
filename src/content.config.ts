import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const postLoader = glob({ pattern: '**/*.md', base: './src/content/posts' });
const shared = z.object({
  title: z.string().min(1), summary: z.string().min(1), tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false), placeholder: z.boolean().default(false),
  image: z.object({ src: z.string(), alt: z.string().min(1), width: z.number().positive(), height: z.number().positive() }).optional(),
  chaos: z.object({
    geometry: z.enum(['block', 'band', 'cylinder']).optional(),
    palette: z.enum(['electric-blue', 'azure', 'ice-blue', 'sand']).optional(),
    scale: z.enum(['small', 'medium', 'large']).optional(),
    rotation: z.number().min(-12).max(12).optional(), artwork: z.string().regex(/^\/images\//).optional(),
  }).optional(),
});
export const collections = {
  projects: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/projects' }), schema: shared.extend({ role: z.string().optional(), technologies: z.array(z.string()), repository: z.url().optional(), demo: z.url().optional(), dates: z.string().optional(), dateLabel: z.string().optional() }) }),
  experiences: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/experiences' }), schema: shared.extend({ organization: z.string(), role: z.string(), location: z.string().optional(), period: z.string().optional(), status: z.enum(['incoming', 'current', 'completed']).optional(), start: z.string().regex(/^\d{4}-\d{2}$/).optional(), end: z.string().regex(/^\d{4}-\d{2}$/).optional(), relatedProjects: z.array(z.string()).default([]) }) }),
  posts: defineCollection({ loader: { ...postLoader, load: async (context) => {
    // Astro 5's glob loader returns early for empty folders; discard removed posts first.
    context.store.clear();
    await postLoader.load(context);
  } }, schema: shared.extend({ published: z.coerce.date(), updated: z.coerce.date().optional(), draft: z.boolean().default(true) }) }),
  personal: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/personal' }), schema: shared.extend({ kind: z.enum(['place', 'history', 'music', 'interest']), external: z.url().optional() }) }),
};
