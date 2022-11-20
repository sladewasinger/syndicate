<script lang="ts">
import { Engine } from '@/typescript/Engine';
import { EngineTester } from '@/typescript/EngineTester';
import type { IClientPlayer } from '@/typescript/models/shared/IClientPlayer';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'GameView',
  data() {
    return {
      RUN_TESTS: true,
      engine: undefined as Engine | undefined,
      engineVueProperties: ref<any | undefined>(undefined),
      loaded: false,
      lobbyId: ref<string | undefined>(undefined),
      playerName: ref<string | undefined>(undefined),
      myPlayer: ref<IClientPlayer | null>(null),
    };
  },
  setup() {},
  mounted() {
    const vueForceUpdateCallback = () => {
      console.log('vueForceUpdateCallback', this.engine?.engineVueProperties);
      this.engineVueProperties = this.engine?.engineVueProperties;
      this.$forceUpdate();
    };

    if (this.RUN_TESTS) {
      const engineTester = new EngineTester(vueForceUpdateCallback);
      engineTester.test_doubles(); // CHANGE THIS TO THE TEST METHOD YOU WANT
    } else {
      this.engine = new Engine(vueForceUpdateCallback);
      this.engineVueProperties = this.engine.engineVueProperties;
    }
  },
  computed: {
    connected() {
      return this.engineVueProperties?.connected;
    },
    gameRunning() {
      return this.engineVueProperties?.gameRunning;
    },
    myLobby() {
      const myLobby = this.engineVueProperties?.lobbyData?.find(
        (lobby: any) => lobby.id === this.engineVueProperties?.lobbyId
      );
      return myLobby;
    },
  },
  methods: {
    startGame() {
      this.engine?.startGame();
    },
    registerName() {
      if (this.playerName) {
        this.engine?.registerName(this.playerName);
      }
    },
    createLobby() {
      this.engine?.createLobby();
    },
    joinLobby() {
      if (this.lobbyId) {
        this.engine?.joinLobby(this.lobbyId);
      }
    },
  },
});
</script>

<template>
  <div class="container" v-if="!connected && !RUN_TESTS">LOADING...</div>
  <div :hidden="!connected && !RUN_TESTS">
    <div :class="{ hidden: gameRunning || RUN_TESTS }">
      <div class="container" v-if="!myLobby">
        <form @submit.prevent="registerName" v-if="!engineVueProperties?.myUser">
          <input type="text" v-model="playerName" maxlength="15" />
          <input type="submit" value="Register Name" />
        </form>
        <form @submit.prevent="joinLobby" v-if="engineVueProperties?.myUser && !myLobby" style="text-align: center">
          <input type="text" v-model="lobbyId" maxlength="15" />
          <input type="submit" value="Join Lobby" />
          <div><strong>OR</strong></div>
          <input type="button" value="Create Lobby" @click="createLobby" />
        </form>
      </div>
      <div v-if="myLobby">
        <button @click="startGame">Start Game</button>
        <div>
          <strong>Lobby ID:</strong> {{ myLobby?.id }}
          <div>
            <strong>Players:</strong>
            <ol>
              <li v-for="player in myLobby?.users" :key="player.id">
                {{ player.name }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div :class="{ hidden: !gameRunning && !RUN_TESTS }">
      <canvas id="gameCanvas" width="900" height="900"></canvas>
    </div>
  </div>
</template>

<style lang="scss">
.container {
  width: 100vw;
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

.hidden {
  display: none;
}
</style>
