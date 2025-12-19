import { Entity } from '../entities/Entity';
import { EntityType } from '../types';
import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Pickup } from '../entities/Pickup';
import { Physics } from './Physics';

export class CollisionSystem {
  // Returns total score gained this frame
  static update(entities: Entity[]): number {
    let scoreGained = 0;

    // Separate entities by type for O(N*M) instead of O(N^2)
    const player = entities.find(e => e.type === EntityType.Player) as Player;
    const enemies = entities.filter(e => e.type === EntityType.Enemy && e.active) as Enemy[];
    const bullets = entities.filter(e => e.type === EntityType.Bullet && e.active) as Bullet[];
    const pickups = entities.filter(e => e.type === EntityType.Pickup && e.active) as Pickup[];

    if (!player || !player.active) return 0; // Game over or not spawned

    // 1. Player vs Enemy (Body Collision)
    for (const enemy of enemies) {
      if (Physics.checkCollision(player.bounds, enemy.bounds)) {
        player.takeDamage(1);
      }
    }

    // 2. Bullets
    for (const bullet of bullets) {
      // Player Bullet vs Enemies
      if (bullet.isPlayerBullet) {
        for (const enemy of enemies) {
          if (Physics.checkCollision(bullet.bounds, enemy.bounds)) {
            bullet.active = false;
            enemy.takeDamage(1);
            if (!enemy.active) {
                // Enemy Killed
                scoreGained += enemy.scoreValue;

                // Drop chance
                if (Math.random() < 0.3) { // 30%
                    const type = Math.random() < 0.5 ? 'S' : 'R';
                    entities.push(new Pickup(enemy.position.x, enemy.position.y, type));
                }
            }
            break; // Bullet hits one enemy
          }
        }
      }
      // Enemy Bullet vs Player
      else {
        if (Physics.checkCollision(bullet.bounds, player.bounds)) {
          bullet.active = false;
          player.takeDamage(1);
        }
      }
    }

    // 3. Player vs Pickups
    for (const pickup of pickups) {
      if (Physics.checkCollision(player.bounds, pickup.bounds)) {
        pickup.active = false;
        if (pickup.pickupType === 'S') {
            player.bulletSpeedLevel++;
        } else if (pickup.pickupType === 'R') {
            player.fireRateLevel++;
        }
      }
    }

    return scoreGained;
  }
}
