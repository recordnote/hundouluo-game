export class Input {
  private static keys: Set<string> = new Set();
  private static previousKeys: Set<string> = new Set();

  private static onKeyDown = (e: KeyboardEvent) => Input.keys.add(e.code);
  private static onKeyUp = (e: KeyboardEvent) => Input.keys.delete(e.code);

  static init() {
    window.addEventListener('keydown', Input.onKeyDown);
    window.addEventListener('keyup', Input.onKeyUp);
  }

  static cleanup() {
    window.removeEventListener('keydown', Input.onKeyDown);
    window.removeEventListener('keyup', Input.onKeyUp);
    Input.keys.clear();
    Input.previousKeys.clear();
  }

  static update() {
    Input.previousKeys = new Set(Input.keys);
  }

  static isKeyDown(code: string): boolean {
    return Input.keys.has(code);
  }

  static isKeyPressed(code: string): boolean {
    return Input.keys.has(code) && !Input.previousKeys.has(code);
  }

  // Helper for directions
  static getAxisX(): number {
    let x = 0;
    if (Input.isKeyDown('KeyA') || Input.isKeyDown('ArrowLeft')) x -= 1;
    if (Input.isKeyDown('KeyD') || Input.isKeyDown('ArrowRight')) x += 1;
    return x;
  }
}
