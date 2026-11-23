export function normalizeBase(base = '/') {
  return '/' + base.split('/').filter(Boolean).join('/') + (base.split('/').filter(Boolean).length ? '/' : '');
}
export function pathAtBase(path = '/', base = '/') {
  return normalizeBase(base) + path.replace(/^\/+/, '');
}
export function withMode(href, mode, origin = 'https://local.invalid') {
  const url = new URL(href, origin);
  if (url.origin !== new URL(origin).origin || !['https:', 'http:'].includes(url.protocol)) return href;
  if (mode === 'chaos') url.searchParams.set('mode', 'chaos');
  else url.searchParams.delete('mode');
  return url.pathname + url.search + url.hash;
}
export function currentMode(search) {
  return new URLSearchParams(search).get('mode') === 'chaos' ? 'chaos' : 'order';
}
export function canonicalURL(path, siteURL, base) {
  return new URL(pathAtBase(path, base), siteURL).href;
}
