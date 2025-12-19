import { Vector2, Rectangle } from '../types';

export class Camera {
  position: Vector2 = { x: 0, y: 0 };
  viewport: Rectangle;
  bounds: Rectangle; // Level bounds

  constructor(width: number, height: number, levelWidth: number, levelHeight: number) {
    this.viewport = { x: 0, y: 0, width, height };
    this.bounds = { x: 0, y: 0, width: levelWidth, height: levelHeight };
  }

  follow(target: Vector2) {
    // Center camera on target
    this.position.x = target.x - this.viewport.width / 2;
    // this.position.y = target.y - this.viewport.height / 2; // Usually side-scrollers lock Y or follow loosely

    // Clamp to bounds
    this.position.x = Math.max(this.bounds.x, Math.min(this.position.x, this.bounds.width - this.viewport.width));
    // this.position.y = Math.max(this.bounds.y, Math.min(this.position.y, this.bounds.height - this.viewport.height));

    // For this simple Contra clone, let's keep Y fixed for now unless the level is tall
    this.position.y = 0;
  }
}
