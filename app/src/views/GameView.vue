<script mounted lang="ts">
// import { Engine } from '@/typescript/Engine';
import { EngineTester } from '@/typescript/EngineTester';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'GameView',
  data() {
    return {
      engine: ref<Engine | null>(null),
    };
  },
  setup() {},
  mounted() {
    // this.engine = new Engine();
    // this.engine.start();
    const engineTester = new EngineTester();
    engineTester.test_5_players_join();
  },
});
</script>

<template>
  <div class="container">
    <canvas id="gameCanvas" width="900" height="900"></canvas>
  </div>
</template>

<style lang="scss">
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#gameCanvas {
  background-color: #000;
  width: 900;
  height: 900;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -o-crisp-edges;
}
</style>
