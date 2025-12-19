import { Entity } from './Entity';
import { EntityType, CONSTANTS, Direction } from '../types';
import { Input } from '../engine/Input';
import { Physics } from '../systems/Physics';
import { Renderer } from '../engine/Renderer';
import { SpriteGenerator } from '../assets/SpriteGenerator';
import { Bullet } from './Bullet';

export class Player extends Entity {
  grounded: boolean = false;
  direction: Direction = Direction.Right;
  sprite: HTMLCanvasElement;

  // Gameplay stats
  hp: number = 3;
  maxHp: number = 3;
  invincibleTimer: number = 0;

  // Weapon stats
  fireRate: number = 15; // frames between shots
  fireCooldown: number = 0;
  bulletSpeedLevel: number = 1;
  fireRateLevel: number = 1;

  constructor(x: number, y: number) {
    super(EntityType.Player, x, y, 16, 24);
    this.sprite = SpriteGenerator.createPlayerSprite('#22ccdd');
  }

  update(map: number[][], entities: Entity[]): void {
    if (this.invincibleTimer > 0) this.invincibleTimer--;

    // 1. Input Handling
    const inputX = Input.getAxisX();

    // Horizontal Movement
    if (inputX !== 0) {
      this.velocity.x = inputX * 2; // Speed
      this.direction = inputX > 0 ? Direction.Right : Direction.Left;
    } else {
      this.velocity.x = 0;
    }

    // Jumping
    if ((Input.isKeyPressed('Space') || Input.isKeyPressed('KeyW')) && this.grounded) {
      this.velocity.y = -5.5; // Jump force
      this.grounded = false;

      // Fall through platform? (Optional: Down + Jump)
      if (Input.isKeyDown('KeyS') || Input.isKeyDown('ArrowDown')) {
          // Logic to disable platform collision momentarily could go here
          // For now, regular jump
      }
    }

    // Shooting
    if (this.fireCooldown > 0) this.fireCooldown--;
    if (Input.isKeyDown('KeyJ') || Input.isKeyDown('KeyK')) {
      if (this.fireCooldown <= 0) {
        this.shoot(entities);
        this.fireCooldown = Math.max(5, this.fireRate - (this.fireRateLevel * 2));
      }
    }

    // 2. Physics
    this.velocity.y += CONSTANTS.GRAVITY;
    if (this.velocity.y > CONSTANTS.TERMINAL_VELOCITY) this.velocity.y = CONSTANTS.TERMINAL_VELOCITY;

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
    this.grounded = result.grounded;

    // Bottom of map death
    if (this.position.y > map.length * CONSTANTS.TILE_SIZE) {
        this.takeDamage(999);
    }
  }

  shoot(entities: Entity[]) {
    // Spawn bullet slightly in front
    const bx = this.direction === Direction.Right ? this.position.x + this.width : this.position.x - 4;
    const by = this.position.y + 8;
    const bullet = new Bullet(bx, by, this.direction, true, this.bulletSpeedLevel);
    entities.push(bullet);

    // console.log('Pew!'); // Sound placeholder
  }

  takeDamage(amount: number) {
    if (this.invincibleTimer > 0) return;
    this.hp -= amount;
    this.invincibleTimer = 60; // 1 second invincibility
  }

  draw(renderer: Renderer): void {
    if (this.invincibleTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
      return; // Flicker
    }
    renderer.drawSprite(this.sprite, this.position.x, this.position.y, this.direction === Direction.Left);
  }
}
