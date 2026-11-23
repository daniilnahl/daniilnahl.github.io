import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
const singular = { projects: 'project', experiences: 'experience', posts: 'post', personal: 'personal' };
export async function readContent(root = process.cwd()) {
  const entries = [];
  for (const [collection, kind] of Object.entries(singular)) {
    const dir = join(root, 'src/content', collection);
    for (const file of (await readdir(dir, { recursive: true })).filter(file => file.endsWith('.md'))) {
      const path = join(dir, file);
      const source = await readFile(path, 'utf8');
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!match) throw new Error(`Missing frontmatter: ${path}`);
      // JSON is a YAML subset. Keeping frontmatter as JSON lets this validator run without dependencies.
      let data;
      try { data = JSON.parse(match[1]); } catch { throw new Error(`Use JSON-formatted YAML frontmatter in ${relative(root, path)}; see README.`); }
      const id = file.replace(/\.md$/, '').replaceAll('\\', '/');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`Use a lowercase kebab-case filename: ${file}`);
      entries.push({ collection, id, ref: `${kind}:${id}`, data, body: source.slice(match[0].length), file: path });
    }
  }
  return entries;
}
