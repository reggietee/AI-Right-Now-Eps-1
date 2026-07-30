import './fonts.css';
import './style.css';
import './scenes.css';
import { scenes } from './scenes';
import { Camera } from './camera';
import { Nav } from './nav';
import { overviewCamera } from './overview';
import { buildBackground, buildForeground } from './background';
import { zigguratFrame, svg } from './svg/primitives';
import { CONTENT } from './content';
import { renderScene } from './render';
import { prep, enter, fadeContentOut, drawBackground } from './animate';
import { hydratePricing, hydrateHub } from './interactive';
import { prefersReduced } from './reduced';
import QRCode from 'qrcode';
import type { Scene } from './types';

// Mark the document when motion is off (OS setting or the safety build) so
// purely-decorative CSS animations opt out too.
if (prefersReduced()) document.body.classList.add('reduced');

const world = document.getElementById('world')!;
const segName = document.getElementById('segName')!;
const counter = document.getElementById('counter')!;
const notes = document.getElementById('notes')!;
const notesTitle = notes.querySelector('h3')!;
const notesBody = notes.querySelector('p')!;

// --- Three parallax layers --------------------------------------------------
const layerBg = document.createElement('div');
layerBg.className = 'layer layer--bg';
layerBg.innerHTML = buildBackground();
const layerContent = document.createElement('div');
layerContent.className = 'layer layer--content';
const layerFg = document.createElement('div');
layerFg.className = 'layer layer--fg';
layerFg.innerHTML = buildForeground();
world.append(layerBg, layerContent, layerFg);

// A stepped ziggurat frame + midpoint-diamond rule, shared by every scene box.
const sceneFrame = svg({
  viewBox: '0 0 1280 800',
  className: 'scene__frame',
  style: 'position:absolute; inset:0; width:100%; height:100%;',
  // Just the stepped frame — no fixed interior rule (it collided with the
  // footer text on the taller left-aligned scenes).
  // Two steps only (outer + middle) — the inner third line sat too close to
  // content and overlapped text.
  content: zigguratFrame({ x: 18, y: 18, w: 1244, h: 764, steps: 2, inset: 26, opacity: 0.5, draw: false }),
});

// The constellation node: how a scene reads when zoomed out — a point of
// interest (a sparkle star) with a label, instead of a boring boxed screenshot.
// It counter-scales with the camera (transform: scale(var(--k))) so it holds a
// constant, readable size at every zoom. The full panel/frame/content only
// materialize when a scene becomes active (see .is-active in CSS).
const nodeStar = svg({
  viewBox: '-50 -50 100 100',
  className: 'node__glyph',
  style: 'width:100%; height:100%; overflow:visible',
  content:
    '<path class="node__star" d="M0,-46 C6,-14 14,-6 46,0 C14,6 6,14 0,46 C-6,14 -14,6 -46,0 C-14,-6 -6,-14 0,-46 Z"/>' +
    '<circle class="node__dot" r="7"/>',
});
const sceneNode = (label: string) =>
  `<div class="scene__node"><span class="node__mark">${nodeStar}</span>` +
  `<span class="node__label">${label}</span></div>`;

// Only titles and dividers hold their segment's dramatic tilt; every content
// scene reads level (rotate 0) so nobody has to tilt their head. Rotation still
// happens only during transitions, when text is hidden, and lands level.
const TILTED_KINDS = new Set(['divider', 'title', 'finale']);
for (const s of scenes) {
  const kind = CONTENT[s.id]?.kind;
  if (kind && !TILTED_KINDS.has(kind)) s.rotate = 0;
}

// --- Build scene boxes into the world ---------------------------------------
const sceneEls: HTMLElement[] = [];
scenes.forEach((s, i) => {
  const el = document.createElement('div');
  el.className = 'scene';
  el.style.left = `${s.x}px`;
  el.style.top = `${s.y}px`;
  el.dataset.index = String(i);
  const content = CONTENT[s.id];
  // Dividers are the "bright stars" (segment anchors) of the constellation.
  if (content?.kind === 'divider') el.classList.add('scene--anchor');
  el.innerHTML =
    `<div class="scene__panel"></div>` +
    sceneFrame +
    `<div class="scene__content" data-kind="${content?.kind ?? 'blank'}">` +
    renderScene(s, content) +
    `</div>` +
    sceneNode(s.title ?? s.id);
  el.addEventListener('click', () => {
    if (inOverview) exitOverview(i);
  });
  layerContent.appendChild(el);
  sceneEls.push(el);
});

// --- Interactive moments ----------------------------------------------------
hydratePricing();
hydrateHub();

// --- Hydrate QR codes (bundled qrcode; renders offline) ---------------------
(async () => {
  const slots = document.querySelectorAll<HTMLElement>('.qr__code[data-qr]');
  for (const el of slots) {
    const url = el.dataset.qr!;
    el.innerHTML = await QRCode.toString(url, {
      type: 'svg',
      margin: 0,
      color: { dark: '#c9a84c', light: '#00000000' },
    });
  }
})();

// --- Wire camera + nav ------------------------------------------------------
const camera = new Camera(
  [
    { el: layerBg, factor: 0.4 },
    { el: layerContent, factor: 1.0 },
    { el: layerFg, factor: 1.15 },
  ],
  world,
);

function updateUI(scene: Scene, index: number): void {
  segName.textContent = scene.segmentName;
  counter.textContent = `${index + 1} / ${scenes.length}`;
  notesTitle.textContent = `${scene.segmentName} · ${scene.id}`;
  notesBody.textContent = (CONTENT[scene.id]?.notes as string) ?? scene.notes ?? '';
}

const nav = new Nav(scenes, camera, updateUI);

// Entry-animation orchestration. Only the scene being navigated to is hidden
// then animated in; every other scene stays at its final, visible state (so
// overview always shows the full poster). `pending` is a scene prepped-hidden
// but not yet entered; finalize it if we move on before it plays.
// LOD model: only the active scene shows its full panel + content; every other
// scene reads as a constellation node. Flying to a scene activates it (content
// fades in on arrival); leaving it deactivates (content fades back to a node).
let active: HTMLElement | null = null;
let inOverview = false;

function deactivate(): void {
  if (!active) return;
  active.classList.remove('is-active');
  fadeContentOut(active);
  active = null;
}

nav.onPrep = (_s, i) => {
  deactivate();       // the scene we're leaving returns to a node
  prep(sceneEls[i]);  // hide the target's content while it flies in
};
nav.onArrive = (_s, i) => {
  const el = sceneEls[i];
  el.classList.add('is-active'); // panel + frame crossfade in
  active = el;
  enter(el);                     // content draws / fades in
};

// The app opens on the constellation, not a scene. The background sunburst
// draws itself on; the first advance or click flies into the talk at scene 0.
nav.index = 0;
updateUI(scenes[0], 0);
drawBackground();
enterOverview();

// --- Overview mode ----------------------------------------------------------
function enterOverview(): void {
  inOverview = true;
  document.body.classList.add('overview');
  deactivate();       // nothing is active in the constellation
  segName.textContent = 'Overview';
  counter.textContent = `${scenes.length} scenes`;
  camera.cut(overviewCamera(scenes, window.innerWidth, window.innerHeight));
}

function exitOverview(index: number): void {
  inOverview = false;
  document.body.classList.remove('overview');
  nav.go(index);
}

function toggleOverview(): void {
  if (inOverview) exitOverview(nav.index);
  else enterOverview();
}

// --- Keyboard ---------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  const k = e.key;

  if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') {
    e.preventDefault();
    if (inOverview) exitOverview(nav.index);
    else nav.next();
  } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
    e.preventDefault();
    if (inOverview) exitOverview(nav.index);
    else nav.prev();
  } else if (k >= '1' && k <= '7') {
    if (inOverview) {
      inOverview = false;
      document.body.classList.remove('overview');
    }
    nav.jumpToSegment(Number(k));
  } else if (k === 'n' || k === 'N') {
    notes.classList.toggle('open');
  } else if (k === 'o' || k === 'O') {
    toggleOverview();
  } else if (k === 'Escape') {
    if (inOverview) exitOverview(nav.index);
    else notes.classList.remove('open');
  }
});
