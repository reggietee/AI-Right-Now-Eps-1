import { sunburstFan, arcSet, zigguratFrame, svg, GOLD } from './svg/primitives';

// The canvas-wide ornament that fuses the seven petals into one Art Deco
// sunburst poster: a radiant core, a full fan of rays, concentric rings that
// echo the composition, and a stepped ziggurat border framing the whole thing.
// Drawn statically here (draw: false); the opening draw-on is added at the
// animation pass.
export function buildBackground(): string {
  const frame = zigguratFrame({
    x: -10600, y: -10600, w: 21200, h: 21200, steps: 3, inset: 320,
    width: 1.5, opacity: 0.3, draw: false,
  });
  const rays = sunburstFan({ rInner: 1650, rOuter: 10000, rays: 60, width: 1, opacity: 0.14, draw: false });
  const rings = arcSet({ radii: [2300, 4000, 7600, 9300], width: 1, opacity: 0.2, draw: false });
  const coreBurst = sunburstFan({ rInner: 0, rOuter: 1480, rays: 36, width: 1, opacity: 0.42, draw: false });
  return svg({
    content: frame + rays + rings + coreBurst,
    viewBox: '-11000 -11000 22000 22000',
    className: 'bg-ornament',
    style: 'position:absolute; left:-11000px; top:-11000px; width:22000px; height:22000px;',
  });
}

// The foreground parallax layer (rate 1.15): small Deco motifs in the outer
// ring, *beyond* every petal (r ~10200) and inside the frame (~10600). They
// drift a touch faster than the scenes for depth, but sit far outside any
// focused scene, so they never cross readable text. Mostly felt in overview
// and on wide segment moves.
export function buildForeground(): string {
  const rad = (d: number) => (d * Math.PI) / 180;
  const R = 10200;
  const s = 130;
  let content = '';
  for (let i = 0; i < 8; i++) {
    const a = rad(22.5 + i * 45);
    const cx = Math.round(Math.sin(a) * R);
    const cy = Math.round(-Math.cos(a) * R);
    // a small diamond with a short cross tick
    content +=
      `<path d="M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z" ` +
      `fill="none" stroke="${GOLD}" style="--sw:1" stroke-opacity="0.16"/>` +
      `<path d="M ${cx - s * 1.7} ${cy} L ${cx + s * 1.7} ${cy}" fill="none" stroke="${GOLD}" ` +
      `stroke-linecap="round" style="--sw:1" stroke-opacity="0.1"/>`;
  }
  return svg({
    content,
    viewBox: '-13000 -13000 26000 26000',
    className: 'fg-ornament',
    style: 'position:absolute; left:-13000px; top:-13000px; width:26000px; height:26000px;',
  });
}
