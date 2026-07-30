import type { Scene } from './types';
import type { SceneContent } from './content';
import { chevronStack, doubleRule, arcSet, svg } from './svg/primitives';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Wrap each character in a span for kinetic (per-character) type.
const splitChars = (s: string) =>
  [...s].map((ch) => `<span class="kchar">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');

// A reusable on-brand "screenshot" placeholder panel.
function mockup(label: string, tall = false): string {
  const bars = Array.from({ length: tall ? 6 : 4 })
    .map((_, i) => `<span style="width:${[92, 68, 80, 54, 74, 44][i % 6]}%"></span>`)
    .join('');
  return (
    `<div class="mock ${tall ? 'mock--tall' : ''}">` +
    `<div class="mock__bar"><i></i><i></i><i></i></div>` +
    `<div class="mock__body">${bars}</div>` +
    `<div class="mock__tag">${esc(label)}</div>` +
    `</div>`
  );
}

// A QR slot; filled asynchronously by hydrateQR() after mount.
const qrSlot = (url: string, label?: string) =>
  `<div class="qr"><div class="qr__code" data-qr="${esc(url)}"></div>` +
  (label ? `<div class="qr__label">${esc(label)}</div>` : '') + `</div>`;

const cap = (t: string) => `<p class="cap">${esc(t)}</p>`;
const heading = (t: string) => `<h2 class="scene-h">${esc(t)}</h2>`;

// --- The radial MCP hub (static; hover interaction added at Checkpoint 7) ----
function mcpHub(center: string, nodes: string[]): string {
  const R = 300;
  const rad = (d: number) => (d * Math.PI) / 180;
  let rays = '';
  let dots = '';
  nodes.forEach((label, i) => {
    const a = (360 / nodes.length) * i;
    const sx = Math.sin(rad(a)), cy = -Math.cos(rad(a));
    const x = sx * R, y = cy * R;
    // ray from the core edge to the node edge, tagged so hover can highlight it
    rays +=
      `<path class="hub-ray" data-i="${i}" style="--sw:1.2" ` +
      `d="M ${(sx * 62).toFixed(1)} ${(cy * 62).toFixed(1)} L ${(sx * (R - 46)).toFixed(1)} ${(cy * (R - 46)).toFixed(1)}"/>`;
    dots +=
      `<g class="hub-node" data-i="${i}" data-node="${esc(label)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">` +
      `<circle r="46" class="hub-node__disc"/>` +
      `<text class="hub-node__t" y="6">${esc(label)}</text></g>`;
  });
  const inner =
    arcSet({ radii: [R], width: 1, opacity: 0.25, draw: false }) +
    rays +
    `<circle r="62" class="hub-core"/>` +
    `<text class="hub-core__t" y="7">${esc(center)}</text>` +
    dots;
  return svg({ content: inner, viewBox: '-460 -400 920 800', className: 'hub', style: 'width:100%;height:100%' });
}

// --- Per-kind renderers -----------------------------------------------------
function render(c: SceneContent): string {
  switch (c.kind) {
    case 'title':
    case 'finale': {
      const lines = (c.lines as string[]).map((l) => `<span>${esc(l)}</span>`).join('');
      return (
        `<div class="title">` +
        chevronSvg() +
        `<h1 class="title__main">${lines}</h1>` +
        `<div class="title__ep">${esc(c.episode as string)}</div>` +
        (c.meta ? `<div class="sub">${esc(c.meta as string)}</div>` : '') +
        `</div>`
      );
    }
    case 'divider': {
      const dr = svg({ viewBox: '0 0 420 80', style: 'width:420px;height:80px', className: '', content: doubleRule({ x1: 40, y1: 40, x2: 380, y2: 40, gap: 16, diamond: 26, draw: false }) });
      return (
        `<div class="divider">` +
        chevronSvg() +
        `<div class="divider__num">${String(c.num).padStart(2, '0')}</div>` +
        `<h1 class="divider__word">${esc(c.word as string)}</h1>` +
        dr +
        `</div>`
      );
    }
    case 'statistic': {
      const fig = c.figure as string;
      const size = fig.length > 5 ? 150 : fig.length > 3 ? 210 : 300;
      return (
        `<div class="stat">` +
        `<div class="stat__fig" data-final="${esc(fig)}" style="font-size:${size}px">${esc(fig)}</div>` +
        `<div class="stat__label">${esc(c.label as string)}</div>` +
        `<div class="stat__src">${esc(c.source as string)}</div>` +
        `</div>`
      );
    }
    case 'statement':
      return (
        `<div class="statement">` +
        (c.heading ? `<h2 class="statement__h">${esc(c.heading as string)}</h2>` : '') +
        `<p class="statement__t">${esc(c.text as string)}</p>` +
        (c.sub ? `<p class="statement__sub">${esc(c.sub as string)}</p>` : '') +
        `</div>`
      );
    case 'versus':
      return (
        `<div class="versus">` +
        `<p>${esc(c.a as string)}</p>` +
        `<div class="versus__rule"></div>` +
        `<p>${esc(c.b as string)}</p>` +
        `</div>`
      );
    case 'grid': {
      const items = (c.items as string[]).map((i) => `<li>${esc(i)}</li>`).join('');
      return heading(c.heading as string) + `<ul class="grid">${items}</ul>` + (c.footer ? cap(c.footer as string) : '');
    }
    case 'numbered': {
      const items = (c.items as string[]).map((i, n) => `<li><span class="n">${n + 1}</span>${esc(i)}</li>`).join('');
      return heading(c.heading as string) + `<ol class="numbered">${items}</ol>` + (c.caption ? cap(c.caption as string) : '');
    }
    case 'features': {
      const items = (c.items as string[]).map((i) => `<li>${esc(i)}</li>`).join('');
      return heading(c.heading as string) + `<ul class="features">${items}</ul>` + (c.caption ? cap(c.caption as string) : '');
    }
    case 'moves': {
      const items = (c.items as string[]).map((i, n) => `<li><span class="n">${n + 1}</span>${esc(i)}</li>`).join('');
      return heading(c.heading as string) + `<ol class="moves">${items}</ol>`;
    }
    case 'categories': {
      const items = (c.items as string[]).map((i) => `<li>${esc(i)}</li>`).join('');
      return heading(c.heading as string) + `<ul class="cats cats--${(c.items as string[]).length}">${items}</ul>`;
    }
    case 'calls': {
      const items = (c.items as { title: string; text: string }[])
        .map(
          (it, n) =>
            `<li><span class="call__n">${String(n + 1).padStart(2, '0')}</span>` +
            `<div class="call__body"><span class="call__t">${esc(it.title)}</span>` +
            `<span class="call__d">${esc(it.text)}</span></div></li>`,
        )
        .join('');
      return (
        (c.heading ? heading(c.heading as string) : '') +
        `<ol class="calls">${items}</ol>` +
        (c.caption ? cap(c.caption as string) : '')
      );
    }
    case 'tool':
      return (
        `<div class="tool">` +
        `<div class="tool__cat">${esc(c.category as string)}</div>` +
        `<p class="tool__body">${esc(c.body as string)}</p>` +
        `</div>`
      );
    case 'timeline': {
      const steps = (c.steps as { when: string; what: string }[])
        .map((s) => `<li>${s.when ? `<span class="tl__when">${esc(s.when)}</span>` : ''}<span class="tl__what">${esc(s.what)}</span></li>`)
        .join('');
      return heading(c.heading as string) + `<ol class="timeline">${steps}</ol>` + (c.footer ? cap(c.footer as string) : '');
    }
    case 'features2':
      return '';
    case 'pricing': {
      const rows = (c.tiers as { name: string; in: number; out: number }[])
        .map(
          (t) =>
            `<div class="tier"><span class="tier__n">${esc(t.name)}</span>` +
            `<span class="tier__rate">$${t.in} / $${t.out}</span>` +
            `<span class="tier__cost" data-in="${t.in}" data-out="${t.out}">$0</span></div>`,
        )
        .join('');
      return (
        (c.heading ? `<h2 class="scene-h">${esc(c.heading as string)}</h2>` : '') +
        `<div class="pricing"><div class="tier tier--head"><span></span>` +
        `<span class="tier__rate">$ in / out per M</span><span class="tier__cost">$ / month</span></div>${rows}</div>` +
        `<div class="pslider">` +
        `<input class="pslider__input" type="range" min="1" max="300" step="1" value="20" aria-label="Monthly token volume in millions">` +
        `<div class="pslider__val"><span class="pvol">20</span>M tokens / month <em>&middot; even in/out split</em></div>` +
        `</div>` +
        `<p class="unit">${esc(c.unit as string)}</p>` +
        (c.footer ? cap(c.footer as string) : '')
      );
    }
    case 'brief': {
      const blocks = (c.blocks as string[])
        .map((b, n) => `<div class="brief__b"><span class="n">${n + 1}</span><p>${esc(b)}</p></div>`)
        .join('');
      return `<div class="brief">${blocks}</div>`;
    }
    case 'compare': {
      const lines = (c.lines as string[]).map((l) => `<p>${esc(l)}</p>`).join('');
      return (
        heading(c.heading as string) +
        `<div class="compare">${lines}</div>` +
        `<p class="statement__t compare__st">${esc(c.statement as string)}</p>`
      );
    }
    case 'proof': {
      const skills = (c.skills as string[]).map((s) => `<span>${esc(s)}</span>`).join('');
      return (
        `<div class="proof">${mockup('/receipt skill')}` +
        `<div class="proof__side">` + cap(c.caption as string) + `<div class="skillgrid">${skills}</div></div>` +
        `</div>`
      );
    }
    case 'button':
      return (
        `<div class="btnscene">` +
        (c.heading ? `<h2 class="scene-h btnscene__h">${esc(c.heading as string)}</h2>` : '') +
        `<button class="connect" tabindex="-1"><span class="connect__plug"></span>Connect</button>` +
        cap(c.caption as string) +
        `</div>`
      );
    case 'mcphub':
      return `<div class="hubwrap">${mcpHub(c.center as string, c.nodes as string[])}</div>`;
    case 'demo': {
      const img = c.image as string | undefined;
      const shot = img
        ? `<div class="shot"><img class="shot__img" src="${esc(img)}" alt="${esc(c.title as string)}" ` +
          `onerror="this.closest('.shot').classList.add('shot--fallback')">` +
          mockup('drop screenshot at public/' + img, true) + `</div>`
        : mockup('Play Niagara', true);
      return (
        `<div class="demo">` +
        `<h2 class="scene-h">${esc(c.title as string)}</h2>` +
        `<p class="demo__line">${esc(c.line as string)}</p>` +
        shot +
        `</div>`
      );
    }
    case 'pipeline': {
      const stages = (c.stages as string[])
        .map((s, i) => `${i ? '<span class="arrow">&rarr;</span>' : ''}<span class="stage">${esc(s)}</span>`)
        .join('');
      return (
        heading(c.heading as string) +
        `<div class="pipe">${stages}</div>` +
        `<div class="pipe__shots"><div class="pipe__shot">${mockup('Before')}</div>` +
        `<div class="pipe__shot pipe__shot--after">${mockup('After')}</div></div>` +
        `<div class="pipe__time"><em>Built in</em> ${esc(c.buildTime as string)}</div>`
      );
    }
    case 'redeem':
      return (
        `<div class="redeem">` +
        `<div class="redeem__text"><h2 class="scene-h">${esc(c.title as string)}</h2>` +
        `<p class="redeem__body">${esc(c.body as string)}</p></div>` +
        qrSlot(c.url as string, c.label as string) +
        `</div>`
      );
    case 'recap':
      return `<div class="recap">${qrSlot(c.url as string, c.label as string)}</div>`;
    case 'instruction':
      return (
        `<div class="instruction">` +
        `<p class="instruction__t">${splitChars(c.text as string)}</p>` +
        `<p class="instruction__sub">${esc(c.sub as string)}</p>` +
        `</div>`
      );
    case 'outro': {
      const contacts = (c.contacts as { label: string; value: string }[])
        .map(
          (ct) =>
            `<li><span class="contact__label">${esc(ct.label)}</span>` +
            `<span class="contact__value">${esc(ct.value)}</span></li>`,
        )
        .join('');
      return (
        `<div class="outro">` +
        `<div class="outro__left"><h1 class="outro__q">${esc(c.heading as string)}</h1></div>` +
        `<div class="outro__right"><div class="outro__name">${esc(c.name as string)}</div>` +
        `<ul class="outro__contacts">${contacts}</ul></div>` +
        `</div>`
      );
    }
    default:
      return `<div class="statement"><p class="statement__t">${esc(c.kind)}</p></div>`;
  }
}

function chevronSvg(): string {
  return svg({
    viewBox: '-90 0 180 90',
    style: 'width:120px;height:60px',
    className: 'chev',
    content: chevronStack({ cx: 0, cy: 10, count: 3, halfSpan: 60, height: 26, spacing: 22, draw: false }),
  });
}

/** Full inner HTML for a scene's content area. */
export function renderScene(_scene: Scene, content: SceneContent | undefined): string {
  if (!content) return '';
  return render(content);
}
