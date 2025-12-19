export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum EntityType {
  Player = 'Player',
  Enemy = 'Enemy',
  Bullet = 'Bullet',
  Pickup = 'Pickup',
  Effect = 'Effect'
}

export enum Direction {
  Left = -1,
  Right = 1
}

export interface GameConfig {
  width: number;
  height: number;
  scale: number;
  gravity: number;
}

export const CONSTANTS = {
  GRAVITY: 0.25,
  TERMINAL_VELOCITY: 6,
  TILE_SIZE: 16,
  CANVAS_WIDTH: 320,
  CANVAS_HEIGHT: 180,
};
