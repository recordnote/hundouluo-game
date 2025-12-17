import { Rectangle, Vector2 } from '../types';

export class Physics {
  static checkCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  static getTileAt(x: number, y: number, map: number[][], tileSize: number): number {
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);

    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
      return 0; // Out of bounds is air, or make it solid if you want boundaries
    }
    return map[row][col];
  }

  // Resolve map collision for an entity
  // This is a simplified AABB vs Tilemap approach
  static resolveMapCollision(
    pos: Vector2,
    width: number,
    height: number,
    velocity: Vector2,
    map: number[][],
    tileSize: number
  ): { pos: Vector2, vel: Vector2, grounded: boolean } {

    let newPos = { ...pos };
    let newVel = { ...velocity };
    let grounded = false;

    // Horizontal Collision
    newPos.x += newVel.x;

    const startRow = Math.floor(newPos.y / tileSize);
    const endRow = Math.floor((newPos.y + height - 0.1) / tileSize);
    const startCol = Math.floor(newPos.x / tileSize);
    const endCol = Math.floor((newPos.x + width - 0.1) / tileSize);

    // Check walls (Tile type 1 is solid)
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const tile = Physics.getTileAt(col * tileSize, row * tileSize, map, tileSize);
        if (tile === 1) {
          if (newVel.x > 0) { // Moving Right
            newPos.x = col * tileSize - width;
            newVel.x = 0;
          } else if (newVel.x < 0) { // Moving Left
            newPos.x = (col + 1) * tileSize;
            newVel.x = 0;
          }
        }
      }
    }

    // Vertical Collision
    newPos.y += newVel.y;

    const startRowY = Math.floor(newPos.y / tileSize);
    const endRowY = Math.floor((newPos.y + height - 0.1) / tileSize);
    const startColY = Math.floor(newPos.x / tileSize);
    const endColY = Math.floor((newPos.x + width - 0.1) / tileSize);

    for (let row = startRowY; row <= endRowY; row++) {
      for (let col = startColY; col <= endColY; col++) {
        const tile = Physics.getTileAt(col * tileSize, row * tileSize, map, tileSize);

        // Solid Ground (1)
        if (tile === 1) {
          if (newVel.y > 0) { // Falling
             // Check if we were previously above this tile
             const prevBottom = pos.y + height;
             if (prevBottom <= row * tileSize + 0.1) { // Tolerance
                newPos.y = row * tileSize - height;
                newVel.y = 0;
                grounded = true;
             } else {
                 // Inside block, push out? Or ignore if coming from side?
                 // Simple physics engine: if we are moving down and hit a solid, stop.
                 // But we already moved X.
                 // If we are deep inside, we might need to push up.
                 // For now, simple "floor" logic.
                 newPos.y = row * tileSize - height;
                 newVel.y = 0;
                 grounded = true;
             }
          } else if (newVel.y < 0) { // Jumping up
             newPos.y = (row + 1) * tileSize;
             newVel.y = 0;
          }
        }

        // One-way Platform (2)
        if (tile === 2) {
            if (newVel.y > 0) { // Falling
                 const prevBottom = pos.y + height;
                 // Only collide if we were strictly above the platform before this frame
                 if (prevBottom <= row * tileSize + Math.max(newVel.y, 1)) {
                     newPos.y = row * tileSize - height;
                     newVel.y = 0;
                     grounded = true;
                 }
            }
        }
      }
    }

    return { pos: newPos, vel: newVel, grounded };
  }
}
