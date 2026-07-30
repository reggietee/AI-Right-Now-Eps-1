// Whether to skip animation. Honors the OS "reduce motion" setting, with a URL
// override for testing: `?motion=on` forces animation on, `?motion=off` forces
// the reduced (cut-to-position) path.
export function prefersReduced(): boolean {
  // The safety-copy build forces the cut-to-position path regardless of OS/URL.
  if (import.meta.env.VITE_FORCE_REDUCED === '1') return true;
  const q = new URLSearchParams(location.search).get('motion');
  if (q === 'on') return false;
  if (q === 'off') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
