import { CONSTANTS } from '../types';
import { Camera } from './Camera';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  public camera: Camera;

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    this.camera = camera;

    // Set low resolution
    this.canvas.width = CONSTANTS.CANVAS_WIDTH;
    this.canvas.height = CONSTANTS.CANVAS_HEIGHT;

    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    this.ctx.fillStyle = '#111'; // Dark background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawSprite(sprite: HTMLCanvasElement, x: number, y: number, flipX: boolean = false) {
    const drawX = Math.floor(x - this.camera.position.x);
    const drawY = Math.floor(y - this.camera.position.y);

    // Culling
    if (drawX + sprite.width < 0 || drawX > this.canvas.width ||
        drawY + sprite.height < 0 || drawY > this.canvas.height) {
      return;
    }

    if (flipX) {
      this.ctx.save();
      this.ctx.translate(drawX + sprite.width, drawY);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(sprite, 0, 0);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(sprite, drawX, drawY);
    }
  }

  drawRect(x: number, y: number, w: number, h: number, color: string) {
      const drawX = Math.floor(x - this.camera.position.x);
      const drawY = Math.floor(y - this.camera.position.y);
      this.ctx.fillStyle = color;
      this.ctx.fillRect(drawX, drawY, w, h);
  }

  // Draw tilemap
  drawTilemap(map: number[][], tileSize: number) {
    // Determine visible range
    const startCol = Math.floor(this.camera.position.x / tileSize);
    const endCol = startCol + (this.canvas.width / tileSize) + 1;
    const startRow = Math.floor(this.camera.position.y / tileSize);
    const endRow = startRow + (this.canvas.height / tileSize) + 1;

    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
          const tile = map[y][x];
          if (tile !== 0) {
            const color = tile === 1 ? '#664422' : tile === 2 ? '#888888' : '#000000'; // 1: Ground, 2: Platform
            this.drawRect(x * tileSize, y * tileSize, tileSize, tileSize, color);
            // Add some detail
            if (tile === 1) { // Ground Grass
                 this.drawRect(x * tileSize, y * tileSize, tileSize, 2, '#44aa22');
            }
          }
        }
      }
    }
  }
}
