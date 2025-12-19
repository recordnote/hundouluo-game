# Contra-style Shooter
> A pixel-art side-scrolling shooter built with Vue 3, Vite, and TypeScript.

This project is a technical implementation of a retro-style game engine running on HTML5 Canvas, strictly avoiding external assets by procedurally generating graphics.

## 🚀 Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build**
    ```bash
    npm run build
    ```

## 🎮 Controls

*   **Move**: `A` / `D` or `Left Arrow` / `Right Arrow`
*   **Jump**: `Space` or `W`
*   **Shoot**: `J` or `K`
*   **Restart**: `R`

## 🏗️ Project Structure

The project follows a modular game architecture under `src/game/`:

*   **engine/**: Core systems agnostic to specific game logic.
    *   `Input.ts`: Keyboard state management.
    *   `Renderer.ts`: Handles Canvas 2D context, scaling, and camera.
    *   `Camera.ts`: Viewport management.
*   **entities/**: Game objects.
    *   `Player.ts`: Movement, physics, and weapon logic.
    *   `Enemy.ts`: AI behaviors (Walker, Turret).
    *   `Bullet.ts` & `Pickup.ts`.
*   **systems/**: Logic that operates on entities.
    *   `Physics.ts`: AABB vs Tilemap collision resolution.
    *   `CollisionSystem.ts`: Entity vs Entity interaction (Bullets, Damage, Scoring).
*   **levels/**: Data definitions for maps (2D arrays).
*   **assets/**: Runtime generation of pixel art sprites (`SpriteGenerator.ts`).

## 🛠️ Technical Features

*   **Vue 3 Integration**: The game loop runs imperatively for performance, but syncs state (HP, Score) to Vue's reactive system for the HUD overlay.
*   **Fixed Timestep**: Uses an accumulator loop to ensure consistent physics calculation regardless of frame rate.
*   **Pixel Art Pipeline**:
    *   `image-rendering: pixelated` CSS.
    *   `imageSmoothingEnabled = false` Canvas context.
    *   Low logical resolution (320x180) scaled to fit the screen.
*   **Physics**: Custom implementation of platformer physics including gravity, velocity, friction, and solid/platform tile collisions.
