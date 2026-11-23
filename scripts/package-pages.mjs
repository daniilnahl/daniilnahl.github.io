import { access, copyFile, lstat, mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(join(tmpdir(), 'daniil-pages-'));
const source = join(output, 'source');
await mkdir(source);
const selected = [
  '.gitignore', '.env.example', 'README.md', 'package.json', 'package-lock.json',
  'astro.config.mjs', 'tsconfig.json', 'playwright.config.ts',
  'docs/PUBLISHING.md', 'docs/WEEKLY-MUSIC.md', 'docs/SOURCES.md',
];
async function collect(directory) {
  for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Source package refuses symlinks: ${path}`);
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) selected.push(path);
    else throw new Error(`Unsupported source entry: ${path}`);
  }
}
for (const directory of ['.github', 'src', 'public', 'scripts', 'tests']) await collect(directory);
const files = [];
for (const path of selected.sort()) {
  const origin = join(root, path);
  if (!(await lstat(origin)).isFile()) throw new Error(`Expected a regular file: ${path}`);
  const destination = join(source, path);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(origin, destination);
  const bytes = await readFile(destination);
  files.push({ path: relative(source, destination).split('\\').join('/'), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
const manifest = join(output, 'manifest.json');
await writeFile(manifest, JSON.stringify({ repository: 'daniilnahl/daniilnahl.github.io', url: 'https://daniilnahl.github.io/', files }, null, 2) + '\n');
const archive = join(output, 'daniil-pages-source.tar.gz');
// Use an explicit file list so only the reviewed source enters the archive.
const fileList = join(output, 'files.list');
await writeFile(fileList, files.map(file => file.path).join('\0') + '\0');
const packed = spawnSync('tar', ['-czf', archive, '-C', source, '--null', '-T', fileList], {
  encoding: 'utf8', timeout: 30000,
});
if (packed.status !== 0) throw new Error(packed.stderr || 'Could not create source archive');
await access(archive);
const artifacts = join(root, 'artifacts');
await mkdir(artifacts, { recursive: true });
const savedArchive = join(artifacts, 'profile-pages-source.tar.gz');
const savedManifest = join(artifacts, 'profile-pages-manifest.json');
await copyFile(archive, savedArchive);
await copyFile(manifest, savedManifest);
console.log(JSON.stringify({ directory: source, archive: savedArchive, manifest: savedManifest, files: files.length }, null, 2));
