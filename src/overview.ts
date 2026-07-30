import type { Scene, CameraState } from './types';

// Nominal footprint of a scene box in canvas units (see .scene in style.css).
const SCENE_W = 1280;
const SCENE_H = 800;

/** Camera state that frames every scene at once, upright, for overview mode. */
export function overviewCamera(
  scenes: Scene[],
  vw: number,
  vh: number,
  pad = 0.82,
): CameraState {
  const halfW = SCENE_W / 2;
  const halfH = SCENE_H / 2;
  const minX = Math.min(...scenes.map((s) => s.x)) - halfW;
  const maxX = Math.max(...scenes.map((s) => s.x)) + halfW;
  const minY = Math.min(...scenes.map((s) => s.y)) - halfH;
  const maxY = Math.max(...scenes.map((s) => s.y)) + halfH;

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const w = Math.max(maxX - minX, 1);
  const h = Math.max(maxY - minY, 1);

  const scale = Math.min(vw / w, vh / h) * pad;
  return { x: cx, y: cy, scale, rotate: 0 };
}
