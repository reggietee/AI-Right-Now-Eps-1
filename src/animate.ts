import gsap from 'gsap';
import { prefersReduced as REDUCED } from './reduced';

// Stroke paths in a scene: the ziggurat frame, double rule, chevrons, hub rays.
const scenePaths = (el: HTMLElement): SVGPathElement[] =>
  Array.from(el.querySelectorAll<SVGPathElement>('.scene__frame path, .scene__content svg path'));

const numParts = (s: string) => {
  const m = s.match(/^(\D*)(\d+)(\D*)$/);
  return m ? { pre: m[1], num: +m[2], suf: m[3] } : null;
};

/** Hide a scene's content while its incoming camera move is running. */
export function prep(el: HTMLElement): void {
  if (REDUCED()) return;
  const content = el.querySelector('.scene__content');
  if (content) gsap.set(content, { autoAlpha: 0, y: 18 });
  for (const p of scenePaths(el)) {
    const L = p.getTotalLength();
    p.style.strokeDasharray = `${L}`;
    p.style.strokeDashoffset = `${L}`;
  }
  const kc = el.querySelectorAll('.kchar');
  if (kc.length) gsap.set(kc, { autoAlpha: 0, y: 40 });
  const fig = el.querySelector<HTMLElement>('.stat__fig');
  if (fig) {
    const parts = numParts(fig.dataset.final || fig.textContent || '');
    if (parts) fig.textContent = `${parts.pre}0${parts.suf}`;
  }
}

/** Play the scene's entry once the camera has settled. */
export function enter(el: HTMLElement, onDone?: () => void): void {
  if (REDUCED()) {
    finalize(el);
    onDone?.();
    return;
  }
  const tl = gsap.timeline({ onComplete: onDone });
  const content = el.querySelector('.scene__content');
  const kc = el.querySelectorAll('.kchar');
  const fig = el.querySelector<HTMLElement>('.stat__fig');

  // Signature: gold lines draw themselves on.
  tl.to(scenePaths(el), { strokeDashoffset: 0, duration: 0.7, stagger: 0.02, ease: 'power2.out' }, 0);

  if (content) gsap.set(content, { autoAlpha: 1, y: 0 });
  if (kc.length) {
    if (content) tl.from(content, { autoAlpha: 0, y: 16, duration: 0.4, ease: 'expo.out' }, 0.1);
    // Kinetic type: per character, y+40, 30ms stagger.
    tl.to(kc, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'expo.out' }, 0.2);
  } else if (content) {
    // Editorial staggered reveal: each block rises in on its own beat.
    tl.from(content.children, { autoAlpha: 0, y: 26, duration: 0.55, stagger: 0.09, ease: 'expo.out' }, 0.12);
  }

  // Number counting on statistics.
  if (fig) {
    const parts = numParts(fig.dataset.final || '');
    if (parts) {
      const o = { v: 0 };
      tl.to(o, {
        v: parts.num,
        duration: 1.0,
        ease: 'power2.out',
        snap: { v: 1 },
        onUpdate: () => { fig.textContent = `${parts.pre}${Math.round(o.v)}${parts.suf}`; },
      }, 0.2);
    }
  }
}

/** Fade a scene's content back out (it returns to a constellation node). */
export function fadeContentOut(el: HTMLElement): void {
  const content = el.querySelector('.scene__content');
  if (!content) return;
  if (REDUCED()) gsap.set(content, { autoAlpha: 0 });
  else gsap.to(content, { autoAlpha: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
}

/** Force a scene to its final, fully-visible state (kills any running entry). */
export function finalize(el: HTMLElement): void {
  gsap.killTweensOf(el.querySelectorAll('*'));
  const content = el.querySelector('.scene__content');
  if (content) gsap.set(content, { autoAlpha: 1, y: 0 });
  for (const p of scenePaths(el)) p.style.strokeDashoffset = '0';
  const kc = el.querySelectorAll('.kchar');
  if (kc.length) gsap.set(kc, { autoAlpha: 1, y: 0 });
  const fig = el.querySelector<HTMLElement>('.stat__fig');
  if (fig && fig.dataset.final) fig.textContent = fig.dataset.final;
}

/** Opening flourish: the canvas-wide sunburst draws itself on, once. */
export function drawBackground(): void {
  if (REDUCED()) return;
  const ps = Array.from(document.querySelectorAll<SVGPathElement>('.bg-ornament path'));
  for (const p of ps) {
    const L = p.getTotalLength();
    p.style.strokeDasharray = `${L}`;
    p.style.strokeDashoffset = `${L}`;
  }
  gsap.to(ps, { strokeDashoffset: 0, duration: 1.6, stagger: 0.004, ease: 'power1.out' });
}
