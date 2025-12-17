import { Entity } from './Entity';
import { EntityType, CONSTANTS, Direction } from '../types';
import { Renderer } from '../engine/Renderer';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Physics } from '../systems/Physics';

export class Bullet extends Entity {
  direction: Direction;
  speed: number;
  isPlayerBullet: boolean;
  sprite: HTMLCanvasElement;
  lifetime: number = 120; // frames

  constructor(x: number, y: number, direction: Direction, isPlayerBullet: boolean, speedMultiplier: number = 1) {
    super(EntityType.Bullet, x, y, 4, 4);
    this.direction = direction;
    this.speed = 4 * speedMultiplier;
    this.isPlayerBullet = isPlayerBullet;
    this.velocity.x = this.direction * this.speed;
    this.sprite = SpriteGenerator.createBulletSprite(isPlayerBullet);
  }

  update(map: number[][]): void {
    this.position.x += this.velocity.x;
    this.lifetime--;

    // Bounds check
    if (this.lifetime <= 0) {
      this.active = false;
      return;
    }

    // Wall collision
    const tile = Physics.getTileAt(this.position.x + this.width/2, this.position.y + this.height/2, map, CONSTANTS.TILE_SIZE);
    if (tile === 1) {
      this.active = false;
    }
  }

  draw(renderer: Renderer): void {
    renderer.drawSprite(this.sprite, this.position.x, this.position.y);
  }
}
