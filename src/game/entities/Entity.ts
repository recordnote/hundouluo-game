import { Vector2, Rectangle, EntityType } from '../types';
import { Renderer } from '../engine/Renderer';

export abstract class Entity {
  id: number;
  type: EntityType;
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  active: boolean = true;

  static nextId = 0;

  constructor(type: EntityType, x: number, y: number, w: number, h: number) {
    this.id = Entity.nextId++;
    this.type = type;
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.width = w;
    this.height = h;
  }

  get bounds(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
  }

  abstract update(map: number[][], entities: Entity[]): void;
  abstract draw(renderer: Renderer): void;
}
