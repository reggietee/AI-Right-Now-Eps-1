// Art Deco vector language. Every primitive returns SVG markup made of
// stroke-only gold paths. Paths carry:
//   - style="--sw:<n>"   -> base stroke width in px. Actual width is
//        calc(--sw * --k), where the camera writes --k = 1/scale onto #world,
//        so lines stay ~1-2px on screen at any camera zoom (see style.css).
//   - class="draw"        -> the animation pass draws it on via stroke-dashoffset
// Compose them with svg() into a positioned <svg>, or drop the markup into
// an existing SVG group.

export const GOLD = '#c9a84c';
export const CREAM = '#f5f0e8';

const rad = (deg: number) => (deg * Math.PI) / 180;
/** point on a circle; bearing in degrees clockwise from up (12 o'clock). */
const pt = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + Math.sin(rad(deg)) * r,
  cy - Math.cos(rad(deg)) * r,
];
const n = (v: number) => Math.round(v * 100) / 100;

interface Stroke {
  stroke?: string;
  width?: number;
  /** false to opt a path out of the draw-on animation */
  draw?: boolean;
  /** extra stroke opacity 0..1 */
  opacity?: number;
}

function path(d: string, o: Stroke = {}): string {
  const { stroke = GOLD, width = 1.5, draw = true, opacity = 1 } = o;
  return (
    `<path d="${d}" fill="none" stroke="${stroke}" ` +
    `stroke-linecap="round" stroke-linejoin="round" style="--sw:${width}" ` +
    `${opacity !== 1 ? `stroke-opacity="${opacity}" ` : ''}${draw ? 'class="draw"' : ''}/>`
  );
}

const line = (x1: number, y1: number, x2: number, y2: number, o?: Stroke) =>
  path(`M ${n(x1)} ${n(y1)} L ${n(x2)} ${n(y2)}`, o);

// --- Primitives -------------------------------------------------------------

/** Radiating rays from a center, across an angular span. The signature shape. */
export function sunburstFan(opts: {
  cx?: number; cy?: number;
  rInner: number; rOuter: number;
  rays: number;
  from?: number; to?: number; // bearings, default full circle
  stroke?: string; width?: number; opacity?: number; draw?: boolean;
}): string {
  const { cx = 0, cy = 0, rInner, rOuter, rays, from = 0, to = 360 } = opts;
  const full = Math.abs(to - from) >= 360;
  const span = to - from;
  const denom = full ? rays : rays - 1;
  let out = '';
  for (let i = 0; i < rays; i++) {
    const a = from + (span * i) / denom;
    const [x1, y1] = pt(cx, cy, rInner, a);
    const [x2, y2] = pt(cx, cy, rOuter, a);
    out += line(x1, y1, x2, y2, opts);
  }
  return out;
}

/** Concentric arcs (or full circles) sharing a center. */
export function arcSet(opts: {
  cx?: number; cy?: number;
  radii: number[];
  from?: number; to?: number;
  stroke?: string; width?: number; opacity?: number; draw?: boolean;
}): string {
  const { cx = 0, cy = 0, radii, from = 0, to = 360 } = opts;
  const full = Math.abs(to - from) >= 360;
  let out = '';
  for (const r of radii) {
    if (full) {
      // two half-arcs so a single circle still draws on cleanly
      const [tx, ty] = pt(cx, cy, r, 0);
      const [bx, by] = pt(cx, cy, r, 180);
      out += path(
        `M ${n(tx)} ${n(ty)} A ${n(r)} ${n(r)} 0 0 1 ${n(bx)} ${n(by)} ` +
          `A ${n(r)} ${n(r)} 0 0 1 ${n(tx)} ${n(ty)}`,
        opts,
      );
    } else {
      const [sx, sy] = pt(cx, cy, r, from);
      const [ex, ey] = pt(cx, cy, r, to);
      const large = Math.abs(to - from) > 180 ? 1 : 0;
      out += path(`M ${n(sx)} ${n(sy)} A ${n(r)} ${n(r)} 0 ${large} 1 ${n(ex)} ${n(ey)}`, opts);
    }
  }
  return out;
}

/** Nested stepped rectangles — the Art Deco setback / ziggurat frame. */
export function zigguratFrame(opts: {
  x: number; y: number; w: number; h: number;
  steps?: number; inset?: number;
  stroke?: string; width?: number; opacity?: number; draw?: boolean;
}): string {
  const { x, y, w, h, steps = 3, inset = 34 } = opts;
  let out = '';
  for (let i = 0; i < steps; i++) {
    const d = i * inset;
    const rx = x + d, ry = y + d, rw = w - d * 2, rh = h - d * 2;
    if (rw <= 0 || rh <= 0) break;
    out += path(
      `M ${n(rx)} ${n(ry)} H ${n(rx + rw)} V ${n(ry + rh)} H ${n(rx)} Z`,
      opts,
    );
  }
  return out;
}

/** Two thin parallel rules with a diamond at the midpoint. */
export function doubleRule(opts: {
  x1: number; y1: number; x2: number; y2: number;
  gap?: number; diamond?: number;
  stroke?: string; width?: number; opacity?: number; draw?: boolean;
}): string {
  const { x1, y1, x2, y2, gap = 14, diamond = 22 } = opts;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len; // unit normal
  const g = gap / 2;
  let out = '';
  out += line(x1 + nx * g, y1 + ny * g, x2 + nx * g, y2 + ny * g, opts);
  out += line(x1 - nx * g, y1 - ny * g, x2 - nx * g, y2 - ny * g, opts);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const ux = dx / len, uy = dy / len; // unit along
  const d = diamond / 2;
  out += path(
    `M ${n(mx + ux * d)} ${n(my + uy * d)} ` +
      `L ${n(mx + nx * d)} ${n(my + ny * d)} ` +
      `L ${n(mx - ux * d)} ${n(my - uy * d)} ` +
      `L ${n(mx - nx * d)} ${n(my - ny * d)} Z`,
    opts,
  );
  return out;
}

/** A vertical stack of chevrons pointing up (or down with dir = -1). */
export function chevronStack(opts: {
  cx?: number; cy?: number;
  count?: number; width?: number; halfSpan?: number; height?: number; spacing?: number;
  dir?: 1 | -1;
  stroke?: string; opacity?: number; draw?: boolean;
}): string {
  const { cx = 0, cy = 0, count = 3, halfSpan = 60, height = 34, spacing = 30, dir = 1 } = opts;
  let out = '';
  for (let i = 0; i < count; i++) {
    const yTop = cy + i * spacing;
    out += path(
      `M ${n(cx - halfSpan)} ${n(yTop + dir * height)} ` +
        `L ${n(cx)} ${n(yTop)} L ${n(cx + halfSpan)} ${n(yTop + dir * height)}`,
      opts,
    );
  }
  return out;
}

// --- Wrapper ----------------------------------------------------------------

/** Wrap primitive markup in a positioned <svg> with an explicit viewBox. */
export function svg(opts: {
  content: string;
  viewBox: string;
  className?: string;
  style?: string;
}): string {
  const { content, viewBox, className = '', style = '' } = opts;
  return (
    `<svg class="${className}" viewBox="${viewBox}" style="${style}" ` +
    `xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" ` +
    `aria-hidden="true">${content}</svg>`
  );
}
