<script lang="ts">
import { Engine } from '@/typescript/engine/Engine';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {},
  mounted() {
    const engine = new Engine();
    engine.start();
  },
});
</script>
<template>
  <div class="container">
    <canvas id="gameCanvas"></canvas>
  </div>
</template>
<style lang="scss">
#gameCanvas {
  width: 927;
  height: 927;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
