export interface Scene {
  id: string;
  /** 1-7 */
  segment: number;
  segmentName: string;
  /** canvas-space center of the scene */
  x: number;
  y: number;
  /** camera zoom when this scene is focused */
  scale: number;
  /** camera roll in degrees when this scene is focused */
  rotate: number;
  title?: string;
  subtitle?: string;
  notes?: string;
}

export interface CameraState {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}
