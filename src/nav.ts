import type { Scene, CameraState } from './types';
import { Camera } from './camera';

export function sceneCamera(scene: Scene): CameraState {
  return { x: scene.x, y: scene.y, scale: scene.scale, rotate: scene.rotate };
}

const DEFAULT_MS = 0.9;
const BOUNDARY_MS = 1.4;

/** Linear scene navigation with segment-boundary awareness and entry hooks. */
export class Nav {
  index = 0;
  /** hide the target scene as its move begins */
  onPrep?: (scene: Scene, index: number) => void;
  /** play the target scene's entry once the camera settles */
  onArrive?: (scene: Scene, index: number) => void;

  constructor(
    private scenes: Scene[],
    private camera: Camera,
    private onChange: (scene: Scene, index: number) => void,
  ) {}

  get current(): Scene {
    return this.scenes[this.index];
  }

  go(index: number): void {
    const clamped = Math.max(0, Math.min(this.scenes.length - 1, index));
    const prev = this.scenes[this.index];
    const scene = this.scenes[clamped];
    const boundary = prev.segment !== scene.segment;
    // The one dramatic roll: entering New Opportunities (3) from Macroview (2).
    const spin = prev.segment === 2 && scene.segment === 3;

    this.index = clamped;
    this.onPrep?.(scene, clamped);
    this.camera.moveTo(sceneCamera(scene), {
      duration: boundary ? BOUNDARY_MS : DEFAULT_MS,
      spin,
      onComplete: () => this.onArrive?.(scene, clamped),
    });
    this.onChange(scene, clamped);
  }

  next(): void {
    if (this.index < this.scenes.length - 1) this.go(this.index + 1);
  }

  prev(): void {
    if (this.index > 0) this.go(this.index - 1);
  }

  jumpToSegment(seg: number): void {
    const i = this.scenes.findIndex((s) => s.segment === seg);
    if (i >= 0) this.go(i);
  }
}
