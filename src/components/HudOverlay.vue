<template>
  <div class="hud">
    <div class="hud-row">
      <span>HP:</span>
      <div class="bars">
        <div v-for="i in 3" :key="i" class="hp-pip" :class="{ filled: i <= hp }"></div>
      </div>
    </div>
    <div class="hud-row">
      <span>SCORE: {{ score }}</span>
    </div>
    <div class="hud-row">
      <span>WPN LVL: {{ bulletLevel }}</span>
      <span>RATE: {{ rateLevel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hp: number;
  score: number;
  bulletLevel: number;
  rateLevel: number;
}>();
</script>

<style scoped>
.hud {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-family: monospace;
  font-size: 16px;
  text-shadow: 1px 1px 0 #000;
  pointer-events: none;
}

.hud-row {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}

.bars {
  display: flex;
  gap: 2px;
}

.hp-pip {
  width: 10px;
  height: 10px;
  border: 1px solid white;
  background: transparent;
}

.hp-pip.filled {
  background: red;
}
</style>
