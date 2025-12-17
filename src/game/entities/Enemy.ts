import { Entity } from './Entity';
import { EntityType, CONSTANTS, Direction } from '../types';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Renderer } from '../engine/Renderer';
import { Physics } from '../systems/Physics';
import { Bullet } from './Bullet';

export abstract class Enemy extends Entity {
  hp: number = 1;
  scoreValue: number = 100;
  sprite: HTMLCanvasElement;

  constructor(x: number, y: number, w: number, h: number, type: 'walker' | 'turret') {
    super(EntityType.Enemy, x, y, w, h);
    this.sprite = SpriteGenerator.createEnemySprite(type);
  }

  takeDamage(amount: number) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.active = false;
    }
  }
}

export class WalkerEnemy extends Enemy {
  direction: Direction = Direction.Left;

  constructor(x: number, y: number) {
    super(x, y, 16, 16, 'walker');
    this.hp = 2;
  }

  update(map: number[][]) {
    // Simple patrol logic
    this.velocity.x = this.direction * 0.5;
    this.velocity.y += CONSTANTS.GRAVITY;

    // Physics
    const result = Physics.resolveMapCollision(
      this.position,
      this.width,
      this.height,
      this.velocity,
      map,
      CONSTANTS.TILE_SIZE
    );

    this.position = result.pos;
    this.velocity = result.vel;

    // Turn around on walls
    if (result.vel.x === 0 && this.velocity.x !== 0) {
       // Collision stopped us
    } else {
       // Check for wall ahead (simple lookahead)
       const nextTileX = this.position.x + (this.direction === Direction.Right ? this.width + 1 : -1);
       const wall = Physics.getTileAt(nextTileX, this.position.y, map, CONSTANTS.TILE_SIZE);
       if (wall === 1) {
           this.direction *= -1;
       }
    }

    // Turn around on edges? (Optional)
    if (result.grounded) {
         const nextGroundX = this.position.x + (this.direction === Direction.Right ? this.width : 0) + (this.direction * 8);
         const ground = Physics.getTileAt(nextGroundX, this.position.y + this.height + 1, map, CONSTANTS.TILE_SIZE);
         if (ground === 0) {
             this.direction *= -1;
         }
    }
  }

  draw(renderer: Renderer) {
      renderer.drawSprite(this.sprite, this.position.x, this.position.y, this.direction === Direction.Right); // Flip logic might be reverse of player
  }
}

export class TurretEnemy extends Enemy {
    fireTimer: number = 0;

    constructor(x: number, y: number) {
        super(x, y, 16, 16, 'turret');
        this.hp = 3;
        this.scoreValue = 200;
    }

    update(_map: number[][], entities: Entity[]) {
        // Find player to aim at
        const player = entities.find(e => e.type === EntityType.Player);
        if (player) {
            const dist = Math.abs(player.position.x - this.position.x);
            if (dist < 200) { // Range
                this.fireTimer++;
                if (this.fireTimer > 120) {
                    this.fire(player, entities);
                    this.fireTimer = 0;
                }
            }
        }
    }

    fire(player: Entity, entities: Entity[]) {
        const dir = player.position.x < this.position.x ? Direction.Left : Direction.Right;
        const bx = dir === Direction.Right ? this.position.x + this.width : this.position.x - 4;
        const by = this.position.y + 4;
        // Enemy bullets slower
        entities.push(new Bullet(bx, by, dir, false, 0.5));
    }

    draw(renderer: Renderer) {
        renderer.drawSprite(this.sprite, this.position.x, this.position.y);
    }
}
