import { currentMode, withMode } from '../lib/urls.mjs';
const root = document.documentElement;
const control = document.querySelector<HTMLButtonElement>('#mode-control')!;
const announcement = document.querySelector<HTMLElement>('#mode-announcement')!;
let transitioning = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const originalLinks = new WeakMap<HTMLAnchorElement, string>();
function apply(mode: string, focus = false) {
  root.dataset.mode = mode;
  document.querySelectorAll<HTMLElement>('[data-mode-shell]').forEach(shell => {
    const inactive = shell.dataset.modeShell !== mode;
    // Move focus out before hiding a shell when history changes modes.
    if (inactive && shell.contains(document.activeElement)) control.focus({ preventScroll: true });
    shell.hidden = inactive;
    shell.inert = inactive;
  });
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
    if (!originalLinks.has(link)) originalLinks.set(link, link.getAttribute('href')!);
    const original = originalLinks.get(link)!;
    if (link.hasAttribute('data-no-mode') || original.startsWith('#')) return;
    const url = new URL(original, location.href);
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
    if (/\.(xml|svg|png|jpe?g|webp|pdf)$/.test(url.pathname)) return;
    link.setAttribute('href', withMode(url.href, mode, location.origin));
  });
  control.setAttribute('aria-pressed', String(mode === 'chaos'));
  control.querySelector('[data-mode-label]')!.textContent = mode === 'chaos' ? 'Back to order' : 'i wonder what this button does?';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'chaos' ? '#F2EBE2' : '#F7F8FA');
  if (focus) {
    control.focus({ preventScroll: true });
    announcement.textContent = mode === 'chaos' ? 'Chaos mode. Follow your curiosity.' : 'Order mode.';
  }
}
apply(currentMode(location.search));
control.hidden = false;
control.addEventListener('click', () => {
  if (transitioning) return;
  const target = root.dataset.mode === 'chaos' ? 'order' : 'chaos';
  const change = () => {
    history.pushState({}, '', withMode(location.href, target, location.origin));
    apply(target, true);
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { change(); return; }
  transitioning = true;
  root.classList.add('mode-breaking');
  timer = setTimeout(() => {
    change();
    root.classList.remove('mode-breaking');
    root.classList.add('mode-resolving');
    timer = setTimeout(() => { root.classList.remove('mode-resolving'); transitioning = false; }, 300);
  }, 250);
});
addEventListener('popstate', () => {
  clearTimeout(timer);
  root.classList.remove('mode-breaking', 'mode-resolving');
  transitioning = false;
  apply(currentMode(location.search), true);
});
