import gsap from 'gsap';
import type { CameraState } from './types';
import { prefersReduced as REDUCED } from './reduced';

export interface MoveOpts {
  duration?: number;
  /** the one dramatic 90-degree-plus roll (entering New Opportunities) */
  spin?: boolean;
  onComplete?: () => void;
}

export interface Layer {
  el: HTMLElement;
  /** parallax rate: the layer pans at this fraction of the camera pan */
  factor: number;
}

/**
 * The camera transforms each parallax layer:
 *   translate(vw/2, vh/2) scale(s) rotate(r) translate(-x*f, -y*f)
 * Scale and rotation are shared (layers stay in register at any zoom); only the
 * pan is scaled per layer, so background (0.4) drifts slower and foreground
 * (1.15) faster. All layers coincide at the canvas origin (the MCP hub) and in
 * the fully-zoomed-out overview, keeping the poster reading intact.
 *
 * Every move is interruptible: a new move kills the running one immediately.
 */
export class Camera {
  state: CameraState = { x: 0, y: 0, scale: 1, rotate: 0 };
  private tweens: Array<gsap.core.Tween> = [];

  constructor(private layers: Layer[], private varHost: HTMLElement) {
    window.addEventListener('resize', () => this.apply());
  }

  apply(): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { x, y, scale, rotate } = this.state;
    for (const { el, factor } of this.layers) {
      el.style.transform =
        `translate(${vw / 2}px, ${vh / 2}px) scale(${scale}) rotate(${rotate}deg) ` +
        `translate(${-x * factor}px, ${-y * factor}px)`;
    }
    // Counter-scale stroke widths so gold lines stay ~1-2px on screen at any zoom.
    this.varHost.style.setProperty('--k', String(1 / scale));
  }

  private kill(): void {
    this.tweens.forEach((t) => t.kill());
    this.tweens = [];
  }

  moveTo(target: CameraState, opts: MoveOpts = {}): void {
    this.kill();
    if (REDUCED()) {
      this.cut(target);
      opts.onComplete?.();
      return;
    }
    const d = opts.duration ?? 0.9;
    const up = () => this.apply();

    const pos = gsap.to(this.state, {
      x: target.x, y: target.y, duration: d, ease: 'power3.inOut',
      onUpdate: up, onComplete: opts.onComplete,
    });
    // Exponential deceleration on zoom (no overshoot/bounce — impeccable bans it).
    const scale = gsap.to(this.state, { scale: target.scale, duration: d, ease: 'expo.out', onUpdate: up });
    const rot = opts.spin
      ? gsap.to(this.state, {
          keyframes: [
            { rotate: this.state.rotate + 110, duration: d * 0.55, ease: 'power2.in' },
            { rotate: target.rotate, duration: d * 0.45, ease: 'power2.out' },
          ],
          onUpdate: up,
        })
      : gsap.to(this.state, { rotate: target.rotate, duration: d, ease: 'power3.inOut', onUpdate: up });

    this.tweens = [pos, scale, rot];
  }

  cut(target: CameraState): void {
    this.kill();
    this.state = { ...target };
    this.apply();
  }
}
