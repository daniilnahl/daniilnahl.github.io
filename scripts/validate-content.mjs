import { readFile } from 'node:fs/promises';
import { readContent } from './read-content.mjs';
import { validateReferences, validateWeeklyPicks } from '../src/lib/content.mjs';
const readJSON = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [entries, topics, relationships, listening] = await Promise.all([readContent(), readJSON('../src/data/topics.json'), readJSON('../src/data/relationships.json'), readJSON('../src/data/listening.json')]);
const requireText = (data, key, ref) => { if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${ref}: ${key} is required`); };
const safeURL = (value, ref) => { if (!['https:', 'http:'].includes(new URL(value).protocol)) throw new Error(`${ref}: invalid URL`); };
for (const entry of entries) {
  const { data, ref, collection } = entry;
  requireText(data, 'title', ref);
  requireText(data, 'summary', ref);
  if (!Array.isArray(data.tags ?? [])) throw new Error(`${ref}: tags must be an array`);
  for (const flag of ['featured', 'placeholder', 'draft']) if (data[flag] !== undefined && typeof data[flag] !== 'boolean') throw new Error(`${ref}: ${flag} must be boolean`);
  for (const key of ['repository', 'demo', 'external']) if (data[key]) safeURL(data[key], ref);
  if (!entry.body.trim()) throw new Error(`${ref}: empty body`);
  if (data.image) {
    requireText(data.image, 'alt', ref);
    if (!data.image.src?.startsWith('/images/') || !(data.image.width > 0 && data.image.height > 0)) throw new Error(`${ref}: images need local /images/ paths and positive dimensions`);
  }
  if (data.chaos?.artwork && !data.chaos.artwork.startsWith('/images/')) throw new Error(`${ref}: artwork must use a local /images/ path`);
  if (data.chaos?.rotation !== undefined && Math.abs(data.chaos.rotation) > 12) throw new Error(`${ref}: Chaos rotation must be within ±12 degrees`);
  if (collection === 'projects' && !Array.isArray(data.technologies)) throw new Error(`${ref}: technologies must be an array`);
  if (collection === 'experiences') {
    requireText(data, 'role', ref); requireText(data, 'organization', ref);
    if (data.status && !['incoming', 'current', 'completed'].includes(data.status)) throw new Error(`${ref}: invalid experience status`);
    if (data.period !== undefined) requireText(data, 'period', ref);
    if (data.status === 'incoming' && !data.start && !data.period) throw new Error(`${ref}: incoming work needs a start date or a period label`);
    for (const key of ['start', 'end']) if (data[key] && !/^\d{4}-(0[1-9]|1[0-2])$/.test(data[key])) throw new Error(`${ref}: invalid ${key} month`);
    if (data.end && (!data.start || data.end < data.start)) throw new Error(`${ref}: invalid date range`);
  }
  if (collection === 'posts') {
    if (!data.published || !Number.isFinite(Date.parse(data.published))) throw new Error(`${ref}: published date is required`);
    if (typeof data.draft !== 'boolean') throw new Error(`${ref}: explicitly set draft to true or false`);
  }
  if (collection === 'personal' && !['place', 'history', 'music', 'interest'].includes(data.kind)) throw new Error(`${ref}: invalid personal kind`);
}
const visible = entries.filter(e => (e.collection !== 'posts' || !e.data.draft) && (e.collection !== 'personal' || !e.data.placeholder));
validateReferences(visible, topics, relationships);
validateWeeklyPicks(listening);
console.log(`Validated ${visible.length} public entries, ${topics.length} topics, ${relationships.length} relationships, and the weekly music picks.`);
