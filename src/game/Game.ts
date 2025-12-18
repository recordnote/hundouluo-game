import { Input } from './engine/Input';
import { Renderer } from './engine/Renderer';
import { Camera } from './engine/Camera';
import { Entity } from './entities/Entity';
import { Player } from './entities/Player';
import { WalkerEnemy, TurretEnemy } from './entities/Enemy';
import { CollisionSystem } from './systems/CollisionSystem';
import { LEVEL_1_MAP } from './levels/LevelData';
import { CONSTANTS } from './types';

export class Game {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  camera: Camera;
  entities: Entity[] = [];
  player: Player | null = null;
  map: number[][] = LEVEL_1_MAP;

  lastTime: number = 0;
  accumulator: number = 0;
  readonly TIMESTEP: number = 1000 / 60; // 60 FPS

  isRunning: boolean = false;
  score: number = 0;
  isGameOver: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Setup Camera & Renderer
    const levelWidth = this.map[0].length * CONSTANTS.TILE_SIZE;
    const levelHeight = this.map.length * CONSTANTS.TILE_SIZE;
    this.camera = new Camera(CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT, levelWidth, levelHeight);
    this.renderer = new Renderer(canvas, this.camera);

    // Setup Input
    Input.init();

    this.initLevel();
  }

  initLevel() {
    this.entities = [];
    this.player = new Player(32, 100);
    this.entities.push(this.player);
    this.score = 0;
    this.isGameOver = false;

    // Spawn some enemies
    this.spawnEnemies();
  }

  spawnEnemies() {
      // Simple hardcoded spawns for MVP
      this.entities.push(new WalkerEnemy(200, 100));
      this.entities.push(new WalkerEnemy(300, 100));
      this.entities.push(new TurretEnemy(400, 100)); // Will be on ground
      this.entities.push(new WalkerEnemy(500, 50));

      // More random spawns
      for(let i=0; i<5; i++) {
          this.entities.push(new WalkerEnemy(600 + i*100, 100));
      }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    Input.cleanup();
  }

  loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.TIMESTEP) {
      this.update();
      this.accumulator -= this.TIMESTEP;
    }

    this.draw();
    requestAnimationFrame(this.loop);
  }

  update() {
    // Reset?
    if (Input.isKeyPressed('KeyR')) {
        this.initLevel();
        return;
    }

    if (this.isGameOver) return;

    Input.update();

    // Entity Updates
    for (const entity of this.entities) {
      if (entity.active) {
        entity.update(this.map, this.entities);
      }
    }

    // Cleanup inactive
    this.entities = this.entities.filter(e => e.active);

    // Collisions
    const scoreGained = CollisionSystem.update(this.entities);
    this.score += scoreGained;

    // Check Player Death
    if (this.player && this.player.hp <= 0) {
        this.player.active = false;
        this.isGameOver = true;
    }

    // Camera Follow
    if (this.player && this.player.active) {
        this.camera.follow(this.player.position);
    }
  }

  draw() {
    this.renderer.clear();
    this.renderer.drawTilemap(this.map, CONSTANTS.TILE_SIZE);

    for (const entity of this.entities) {
      entity.draw(this.renderer);
    }

    // Game Over Overlay
    if (this.isGameOver) {
        // Simple overlay
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '20px monospace';
            ctx.textAlign = 'center';
            ctx.fillText("GAME OVER", this.canvas.width/2, this.canvas.height/2);
            ctx.font = '10px monospace';
            ctx.fillText("Press R to Restart", this.canvas.width/2, this.canvas.height/2 + 20);
        }
    }
  }
}
