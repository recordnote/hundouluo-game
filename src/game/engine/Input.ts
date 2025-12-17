export class Input {
  private static keys: Set<string> = new Set();
  private static previousKeys: Set<string> = new Set();

  static init() {
    window.addEventListener('keydown', (e) => {
      Input.keys.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      Input.keys.delete(e.code);
    });
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
