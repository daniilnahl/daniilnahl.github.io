import { writeFile, rm, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const astroManifest = new URL('../node_modules/astro/package.json', import.meta.url);
const astroPackage = JSON.parse(await readFile(astroManifest, 'utf8'));
const astroCLI = fileURLToPath(new URL(astroPackage.bin.astro, astroManifest));
const published = 'src/content/posts/verification-published.md';
const draft = 'src/content/posts/verification-draft.md';
const build = () => {
  const result = spawnSync(process.execPath, [astroCLI, 'build'], { stdio: 'inherit', env: process.env });
  if (result.status !== 0) throw new Error('Fixture build failed');
  const verify = spawnSync(process.execPath, ['scripts/verify-output.mjs'], { stdio: 'inherit', env: process.env });
  if (verify.status !== 0) throw new Error('Fixture output verification failed');
};
let createdPublished = false;
let createdDraft = false;
try {
  const make = isDraft => `---\n${JSON.stringify({ title: isDraft ? 'Draft verification fixture' : 'Published verification fixture', summary: 'Temporary verification content.', tags: ['software'], draft: isDraft, published: '2026-01-01' }, null, 2)}\n---\n\nTemporary post body.\n`;
  await writeFile(published, make(false), { flag: 'wx' }); createdPublished = true;
  await writeFile(draft, make(true), { flag: 'wx' }); createdDraft = true;
  build();
  for (const path of ['dist/blog/index.html', 'dist/rss.xml', 'dist/sitemap.xml', 'dist/index.html']) {
    const text = await readFile(path, 'utf8');
    if (!text.includes('verification-published') || text.includes('verification-draft') || text.includes('Draft verification fixture')) throw new Error(`Incorrect fixture inclusion in ${path}`);
  }
  console.log('Published fixture appears in the index, homepage, route, sitemap, and RSS; draft is excluded.');
} finally {
  if (createdPublished) await rm(published);
  if (createdDraft) await rm(draft);
  // Restore output to the real, empty-blog launch state even when assertions fail.
  if (createdPublished || createdDraft) {
    build();
    for (const path of ['dist/index.html', 'dist/blog/index.html', 'dist/rss.xml', 'dist/sitemap.xml']) {
      const text = await readFile(path, 'utf8');
      if (text.includes('verification-published') || text.includes('verification-draft')) throw new Error(`Fixture remained after cleanup: ${path}`);
    }
  }
}
