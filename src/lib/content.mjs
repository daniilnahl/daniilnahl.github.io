export function publicPosts(posts) {
  return posts.filter(post => !post.data.draft).sort((a, b) => new Date(b.data.published).getTime() - new Date(a.data.published).getTime());
}
export function validateReferences(entries, topics, relationships) {
  const known = new Set(entries.map(entry => entry.ref));
  for (const topic of topics) {
    if (known.has(`topic:${topic.id}`)) throw new Error(`Duplicate reference: topic:${topic.id}`);
    known.add(`topic:${topic.id}`);
  }
  if (known.size !== entries.length + topics.length) throw new Error('Duplicate content references');
  const links = new Set();
  for (const edge of relationships) {
    if (!known.has(edge.source) || !known.has(edge.target)) throw new Error(`Unresolved relationship: ${edge.source} → ${edge.target}`);
    if (!edge.label?.trim() || edge.source === edge.target) throw new Error('Invalid relationship');
    const key = `${edge.source}|${edge.target}`;
    if (links.has(key)) throw new Error(`Duplicate relationship: ${key}`);
    links.add(key);
  }
  for (const entry of entries) {
    for (const project of entry.data.relatedProjects ?? []) {
      if (!known.has(project) || !project.startsWith('project:')) throw new Error(`Unresolved related project: ${project}`);
    }
    for (const tag of entry.data.tags ?? []) {
      if (!topics.some(topic => topic.id === tag)) throw new Error(`Unknown topic: ${tag}`);
    }
  }
  return true;
}
export function chaosTreatment(data, index = 0) {
  return { geometry: ['block', 'band', 'cylinder'][index % 3], palette: ['electric-blue', 'ice-blue', 'sand'][index % 3], scale: 'medium', rotation: 0, ...data.chaos };
}
export function validateWeeklyPicks(picks) {
  if (!picks || !Array.isArray(picks.tracks)) throw new Error('Weekly music needs a tracks array');
  if (picks.tracks.length !== 0 && picks.tracks.length !== 5) throw new Error('Weekly music must contain exactly five tracks, or be empty');
  if (picks.weekOf !== null) {
    const date = typeof picks.weekOf === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(picks.weekOf) ? new Date(`${picks.weekOf}T00:00:00Z`) : null;
    if (!date || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== picks.weekOf) throw new Error('Weekly music weekOf must be a valid YYYY-MM-DD date or null');
  }
  if (picks.tracks.length && !picks.weekOf) throw new Error('Published weekly music needs a weekOf date');
  const links = new Set();
  for (const track of picks.tracks) {
    for (const field of ['title', 'artist', 'url']) if (typeof track[field] !== 'string' || !track[field].trim()) throw new Error(`Weekly track needs ${field}`);
    const url = new URL(track.url);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Weekly track links must be HTTP or HTTPS');
    if (links.has(url.href)) throw new Error('Weekly music contains a duplicate track link');
    links.add(url.href);
  }
  return true;
}
export function escapeXML(value) {
  return String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);
}
export function makeRSS(posts, { title, description, url }, linkFor) {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXML(title)}</title><link>${escapeXML(url)}</link><description>${escapeXML(description)}</description><language>en</language>${publicPosts(posts).map(post => `<item><title>${escapeXML(post.data.title)}</title><link>${escapeXML(linkFor(post.id))}</link><guid isPermaLink="true">${escapeXML(linkFor(post.id))}</guid><description>${escapeXML(post.data.summary)}</description><pubDate>${new Date(post.data.published).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;
}
