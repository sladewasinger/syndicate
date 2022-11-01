<script lang="ts"></script>

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
}
</style>
