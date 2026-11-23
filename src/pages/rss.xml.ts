import type { APIRoute } from 'astro';
import { catalog } from '../lib/catalog';
import { makeRSS } from '../lib/content.mjs';
import { canonicalURL } from '../lib/urls.mjs';
import site from '../data/site.json';
export const GET: APIRoute = async ({ site: origin }) => {
  const { posts } = await catalog();
  const url = (path: string) => canonicalURL(path, origin!.href, import.meta.env.BASE_URL);
  return new Response(makeRSS(posts, { title: `${site.name}’s writing`, description: site.description, url: url('/blog/') }, (id: string) => url(`/blog/${id}/`)), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
