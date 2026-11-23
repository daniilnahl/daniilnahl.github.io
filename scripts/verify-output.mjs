import { readFile, access, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { readContent } from './read-content.mjs';
import { normalizeBase, pathAtBase } from '../src/lib/urls.mjs';
import site from '../src/data/site.json' with { type: 'json' };
const base = normalizeBase(process.env.BASE_PATH ?? site.base);
const root = join(process.cwd(), 'dist');
for (const file of ['index.html', 'projects/index.html', 'experience/index.html', 'blog/index.html', 'about/index.html', '404.html', 'rss.xml', 'sitemap.xml']) await access(join(root, file));
const entries = await readContent();
for (const entry of entries) {
  if (entry.collection === 'projects' || entry.collection === 'posts') {
    const path = `${entry.collection === 'projects' ? 'projects' : 'blog'}/${entry.id}/index.html`;
    if (entry.data.draft) {
      try { await access(join(root, path)); } catch { continue; }
      throw new Error(`Draft route emitted: ${path}`);
    }
    await access(join(root, path));
  }
}
const htmlFiles = (await readdir(root, { recursive: true })).filter(file => file.endsWith('.html'));
const expectedPosts = new Set(entries.filter(entry => entry.collection === 'posts' && !entry.data.draft).map(entry => `blog/${entry.id}/index.html`));
for (const file of htmlFiles.filter(file => file.startsWith('blog/') && file !== 'blog/index.html')) {
  if (!expectedPosts.has(file)) throw new Error(`Unexpected or stale post route: ${file}`);
}

for (const file of htmlFiles) {
  const html = await readFile(join(root, file), 'utf8');
  if (!html.includes('<main') || !html.includes('rel="canonical"')) throw new Error(`Missing core document structure: ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    const path = value.split(/[?#]/)[0];
    if (!path.startsWith(base)) throw new Error(`Base-path leak in ${file}: ${value}`);
    const relative = path.slice(base.length);
    await access(join(root, relative.endsWith('/') || !relative ? `${relative}index.html` : relative));
  }
}
const rss = await readFile(join(root, 'rss.xml'), 'utf8');
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
if (!rss.includes('<rss version="2.0">') || !rss.includes('<channel>')) throw new Error('Invalid RSS structure');
for (const entry of entries.filter(e => e.collection === 'posts')) {
  const included = rss.includes(`/blog/${entry.id}/`);
  if (included === entry.data.draft) throw new Error(`Incorrect RSS inclusion: ${entry.id}`);
}
if (sitemap.includes('mode=') || /rel="canonical"[^>]*mode=/.test(await readFile(join(root, 'index.html'), 'utf8'))) throw new Error('Mode leaked into canonical metadata');
const home = await readFile(join(root, 'index.html'), 'utf8');
if (!home.includes('i wonder what this button does?') || !home.includes(pathAtBase('/blog/', base))) throw new Error('Missing required homepage entry points');
console.log(`Verified ${htmlFiles.length} static documents and local asset links under ${base}.`);
