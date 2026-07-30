import { sunburstFan, arcSet, svg } from './svg/primitives';

// Faint radial guides behind the constellation: a whisper of the Deco sunburst
// (a dozen hairline rays that leave the centre clear for the HAVEN wordmark) and
// a single soft ring. Minimal by design — no dense ray field, no core burst, no
// stepped frame.
export function buildBackground(): string {
  const rays = sunburstFan({ rInner: 900, rOuter: 9000, rays: 12, width: 1, opacity: 0.07, draw: false });
  const ring = arcSet({ radii: [7000], width: 1, opacity: 0.1, draw: false });
  return svg({
    content: rays + ring,
    viewBox: '-11000 -11000 22000 22000',
    className: 'bg-ornament',
    style: 'position:absolute; left:-11000px; top:-11000px; width:22000px; height:22000px;',
  });
}

// Foreground parallax layer — intentionally empty now (the edge motifs added
// clutter). Kept so the three-layer parallax structure is preserved.
export function buildForeground(): string {
  return svg({
    content: '',
    viewBox: '-13000 -13000 26000 26000',
    className: 'fg-ornament',
    style: 'position:absolute; left:-13000px; top:-13000px; width:26000px; height:26000px;',
  });
}
