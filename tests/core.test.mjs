import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentMode, withMode, pathAtBase, canonicalURL } from '../src/lib/urls.mjs';
import { publicPosts, validateReferences, chaosTreatment, makeRSS, validateWeeklyPicks } from '../src/lib/content.mjs';
import { readContent } from '../scripts/read-content.mjs';

test('mode changes retain the route, query context, and section at either deployment base', () => {
  for (const base of ['/', '/personal-website/']) {
    const path = pathAtBase('/projects/aqmod/', base);
    const chaos = withMode(`${path}?from=graph#approach`, 'chaos');
    assert.equal(chaos, `${path}?from=graph&mode=chaos#approach`);
    assert.equal(withMode(chaos, 'order'), `${path}?from=graph#approach`);
    assert.equal(currentMode('?mode=chaos'), 'chaos');
    assert.equal(currentMode('?mode=anything-else'), 'order');
    assert.equal(currentMode(''), 'order');
    assert.equal(canonicalURL('/blog/', 'https://example.org', base), `https://example.org${pathAtBase('/blog/', base)}`);
  }
  assert.equal(withMode('mailto:hello@example.org', 'chaos'), 'mailto:hello@example.org');
  assert.equal(withMode('https://github.com/daniilnahl', 'chaos'), 'https://github.com/daniilnahl');
});

test('published and draft fixtures are separated in feed and public catalog', () => {
  const posts = [
    { id: 'draft-secret', data: { title: 'Unpublished', summary: 'Private', published: '2026-02-01', draft: true } },
    { id: 'published-fixture', data: { title: 'Signals & systems', summary: 'A <small> note', published: '2026-01-01', draft: false } },
  ];
  assert.deepEqual(publicPosts(posts).map(p => p.id), ['published-fixture']);
  const rss = makeRSS(posts, { title: 'Writing', description: 'Notes', url: 'https://example.org/blog/' }, id => `https://example.org/blog/${id}/`);
  assert.match(rss, /Signals &amp; systems/);
  assert.match(rss, /A &lt;small&gt; note/);
  assert.match(rss, /published-fixture/);
  assert.doesNotMatch(rss, /draft-secret|Unpublished/);
  const empty = makeRSS([], { title: 'Writing', description: 'Notes', url: 'https://example.org/blog/' }, id => id);
  assert.match(empty, /<channel>.*<\/channel>/);
  assert.doesNotMatch(empty, /<item>/);
});

test('references reject missing destinations, drafts, and duplicates', () => {
  const entries = [{ ref: 'project:test', data: { tags: ['embedded'] } }];
  const topics = [{ id: 'embedded' }];
  const edge = { source: 'project:test', target: 'topic:embedded', label: 'uses' };
  assert.equal(validateReferences(entries, topics, [edge]), true);
  assert.throws(() => validateReferences(entries, topics, [{ ...edge, target: 'post:draft' }]), /Unresolved/);
  assert.throws(() => validateReferences(entries, topics, [edge, edge]), /Duplicate/);
  assert.throws(() => validateReferences([...entries, ...entries], topics, []), /Duplicate/);
  assert.throws(() => validateReferences([{ ref: 'experience:test', data: { relatedProjects: ['project:absent'] } }], [], []), /Unresolved/);
});

test('new content receives a deterministic Chaos treatment without layout edits', () => {
  assert.deepEqual(chaosTreatment({}, 4), chaosTreatment({}, 4));
  assert.equal(chaosTreatment({}, 4).geometry, 'band');
  assert.equal(chaosTreatment({ chaos: { scale: 'large' } }, 0).scale, 'large');
});

test('manual weekly music accepts an empty list or five dated, valid song links', () => {
  assert.equal(validateWeeklyPicks({ weekOf: null, tracks: [] }), true);
  const tracks = Array.from({ length: 5 }, (_, index) => ({ title: `Test track ${index + 1}`, artist: 'Test artist', url: `https://example.org/track/${index + 1}` }));
  const picks = { weekOf: '2026-11-16', tracks };
  assert.equal(validateWeeklyPicks(picks), true);
  assert.throws(() => validateWeeklyPicks({ ...picks, tracks: tracks.slice(0, 4) }), /exactly five/);
  assert.throws(() => validateWeeklyPicks({ ...picks, tracks: [...tracks, tracks[0]] }), /exactly five/);
  assert.throws(() => validateWeeklyPicks({ ...picks, weekOf: null }), /weekOf date/);
  assert.throws(() => validateWeeklyPicks({ ...picks, weekOf: '2026-02-30' }), /valid YYYY-MM-DD/);
  assert.throws(() => validateWeeklyPicks({ ...picks, tracks: [tracks[0], ...tracks.slice(0, 4)] }), /duplicate/);
  assert.throws(() => validateWeeklyPicks({ ...picks, tracks: [{ ...tracks[0], url: 'javascript:alert(1)' }, ...tracks.slice(1)] }), /HTTP/);
});

test('launch content has no posts and retains personal placeholders as unpublished source', async () => {
  const entries = await readContent();
  assert.equal(entries.filter(e => e.collection === 'posts').length, 0);
  assert.equal(entries.filter(e => e.collection === 'projects' && e.data.featured).length, 3);
  for (const entry of entries.filter(e => e.collection === 'personal')) assert.equal(entry.data.placeholder, true);
  const collaborative = entries.find(e => e.id === 'djr-trail-finder');
  assert.match(collaborative.data.role, /contributor/);
});
