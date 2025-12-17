export class SpriteGenerator {
  static createRect(width: number, height: number, color: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    }
    return canvas;
  }

  // Create a simple "Contra" guy placeholder
  static createPlayerSprite(color: string): HTMLCanvasElement {
    const w = 16;
    const h = 24;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Body
      ctx.fillStyle = color;
      ctx.fillRect(4, 8, 8, 10);
      // Head
      ctx.fillStyle = '#ffccaa'; // Skin tone
      ctx.fillRect(5, 2, 6, 6);
      // Bandana
      ctx.fillStyle = 'red';
      ctx.fillRect(4, 2, 8, 2);
      // Legs
      ctx.fillStyle = '#3344dd'; // Pants
      ctx.fillRect(4, 18, 3, 6);
      ctx.fillRect(9, 18, 3, 6);
      // Gun
      ctx.fillStyle = '#888';
      ctx.fillRect(10, 10, 8, 4);
    }
    return canvas;
  }

  static createEnemySprite(type: 'walker' | 'turret'): HTMLCanvasElement {
    const w = 16;
    const h = 16;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (type === 'walker') {
        ctx.fillStyle = '#00aa00';
        ctx.fillRect(2, 2, 12, 12);
        // Eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(4, 5, 2, 2);
        ctx.fillRect(10, 5, 2, 2);
      } else if (type === 'turret') {
        ctx.fillStyle = '#aa0000';
        ctx.fillRect(4, 8, 8, 8); // Base
        ctx.fillStyle = '#dd0000';
        ctx.fillRect(2, 4, 12, 4); // Head
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 5, 4, 2); // Barrel
      }
    }
    return canvas;
  }

  static createBulletSprite(isPlayer: boolean): HTMLCanvasElement {
    const size = 4;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = isPlayer ? 'yellow' : 'pink';
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas;
  }

  static createPickupSprite(type: 'S' | 'R'): HTMLCanvasElement {
    const size = 12;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#444';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#ccc';
      ctx.strokeRect(0, 0, size, size);

      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(type, size/2, size/2 + 1);
    }
    return canvas;
  }
}
