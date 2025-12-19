import { Entity } from './Entity';
import { EntityType, CONSTANTS } from '../types';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Renderer } from '../engine/Renderer';
import { Physics } from '../systems/Physics';

export class Pickup extends Entity {
  pickupType: 'S' | 'R'; // S: Speed (Move/Fire?), R: Rapid (Fire Rate)
  sprite: HTMLCanvasElement;
  lifeTime: number = 600; // 10 seconds

  constructor(x: number, y: number, type: 'S' | 'R') {
    super(EntityType.Pickup, x, y, 12, 12);
    this.pickupType = type;
    this.sprite = SpriteGenerator.createPickupSprite(type);
    this.velocity.y = -2; // Pop up
  }

  update(map: number[][]): void {
     this.velocity.y += CONSTANTS.GRAVITY;

     const result = Physics.resolveMapCollision(
         this.position, this.width, this.height, this.velocity, map, CONSTANTS.TILE_SIZE
     );

     this.position = result.pos;
     this.velocity = result.vel;

     this.lifeTime--;
     if (this.lifeTime <= 0) this.active = false;
  }

  draw(renderer: Renderer): void {
      // Bobbing effect
      const yOffset = Math.sin(Date.now() / 200) * 2;
      renderer.drawSprite(this.sprite, this.position.x, this.position.y + yOffset);
  }
}
