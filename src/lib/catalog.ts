import { getCollection } from 'astro:content';
import topics from '../data/topics.json';
import presentation from '../data/presentation.json';
import relationshipData from '../data/relationships.json';
interface Relationship { source: string; target: string; label: string; }
const relationships: Relationship[] = relationshipData;
import { publicPosts, validateReferences } from './content.mjs';
export async function catalog() {
  const [projects, experiences, allPosts, allPersonal] = await Promise.all([getCollection('projects'), getCollection('experiences'), getCollection('posts'), getCollection('personal')]);
  projects.sort((a, b) => {
    const rank = (id: string) => { const i = presentation.projectOrder.indexOf(id); return i < 0 ? 999 : i; };
    return rank(a.id) - rank(b.id) || a.data.title.localeCompare(b.data.title);
  });
  experiences.sort((a, b) => {
    const rank = (id: string) => { const i = presentation.experienceOrder.indexOf(id); return i < 0 ? 999 : i; };
    return rank(a.id) - rank(b.id) || (b.data.start ?? '').localeCompare(a.data.start ?? '') || a.data.title.localeCompare(b.data.title);
  });
  const personal = allPersonal.filter(entry => !entry.data.placeholder);
  const posts = publicPosts(allPosts) as typeof allPosts;
  const entries = [
    ...projects.map(e => ({ ...e, ref: `project:${e.id}`, type: 'Project' as const, path: `/projects/${e.id}/` })),
    ...experiences.map(e => ({ ...e, ref: `experience:${e.id}`, type: 'Experience' as const, path: `/experience/#${e.id}` })),
    ...posts.map(e => ({ ...e, ref: `post:${e.id}`, type: 'Writing' as const, path: `/blog/${e.id}/` })),
    ...personal.map(e => ({ ...e, ref: `personal:${e.id}`, type: 'Personal' as const, path: `/about/#${e.id}` })),
  ];
  validateReferences(entries, topics, relationships);
  return { projects, experiences, posts, personal, entries, topics, relationships };
}
