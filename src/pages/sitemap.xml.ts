import type { APIRoute } from 'astro';
import { catalog } from '../lib/catalog';
import { canonicalURL } from '../lib/urls.mjs';
import { escapeXML } from '../lib/content.mjs';
export const GET: APIRoute = async ({ site }) => {
  const { entries } = await catalog();
  const paths = ['/', '/projects/', '/experience/', '/blog/', '/about/', ...entries.filter(e => e.type === 'Project' || e.type === 'Writing').map(e => e.path)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escapeXML(canonicalURL(path, site!.href, import.meta.env.BASE_URL))}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
