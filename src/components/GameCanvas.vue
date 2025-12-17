<template>
  <div class="game-container">
    <canvas ref="canvasRef"></canvas>
    <HudOverlay
      v-if="gameInstance"
      :hp="uiState.hp"
      :score="uiState.score"
      :bulletLevel="uiState.bulletLevel"
      :rateLevel="uiState.rateLevel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { Game } from '../game/Game';
import HudOverlay from './HudOverlay.vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const gameInstance = ref<Game | null>(null);

// Reactive state for UI
const uiState = reactive({
  hp: 3,
  score: 0,
  bulletLevel: 1,
  rateLevel: 1
});

let uiLoopId: number;

const updateUI = () => {
  if (gameInstance.value && gameInstance.value.player) {
    uiState.hp = gameInstance.value.player.hp;
    uiState.score = gameInstance.value.score;
    uiState.bulletLevel = gameInstance.value.player.bulletSpeedLevel;
    uiState.rateLevel = gameInstance.value.player.fireRateLevel;
  }
  uiLoopId = requestAnimationFrame(updateUI);
};

onMounted(() => {
  if (canvasRef.value) {
    const game = new Game(canvasRef.value);
    gameInstance.value = game;
    game.start();

    // Start UI sync loop
    updateUI();
  }
});

onUnmounted(() => {
  if (gameInstance.value) {
    gameInstance.value.stop();
  }
  cancelAnimationFrame(uiLoopId);
});
</script>

<style scoped>
.game-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #222;
}

canvas {
  image-rendering: pixelated; /* Crucial for pixel art */
  width: 100%;
  height: 100%;
  max-width: 1280px; /* Max display size, preserves aspect ratio */
  max-height: 720px;
  background: #000;
  aspect-ratio: 16/9;
}
</style>
