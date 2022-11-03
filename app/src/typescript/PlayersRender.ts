import type { IClientPlayer } from './models/shared/IClientPlayer';
import * as PIXI from 'pixi.js';
import type { IClientGameData } from './models/shared/IClientGameData';
import type { RenderData } from './RenderData';
import { boardPositions } from './BoardPositions';

export class PlayerRender {
  container: PIXI.Container;

  constructor(public player: IClientPlayer, public position: PIXI.Point) {
    this.container = new PIXI.Container();
    this.container.x = position.x;
    this.container.y = position.y;
  }
}

export class PlayersRender {
  playerRenders: PlayerRender[] = [];

  constructor(public players: IClientPlayer[]) {
    for (const player of players) {
      const playerRender = new PlayerRender(player, new PIXI.Point(0, 0));
      this.playerRenders.push(playerRender);
    }
  }

  update(gameData: IClientGameData, renderData: RenderData) {
    for (const playerRender of this.playerRenders) {
      const player = gameData.players.find((p) => p.id === playerRender.player.id);
      if (player) {
        playerRender.container.x = renderData.renderTiles[player.position].container.x;
        playerRender.container.y = renderData.renderTiles[player.position].container.y;
      }
    }
  }

  drawInitial(args: IPlayersRenderArgs, container: PIXI.Container) {
    for (const playerRender of this.playerRenders) {
      const token = new PIXI.Graphics();
      token.lineStyle(5, 0x000000, 1);
      token.beginFill(playerRender.player.color, 1);
      token.drawCircle(0, 0, 20);
      token.endFill();
      playerRender.container.addChild(token);
      container.addChild(playerRender.container);
    }
  }

  addPlayer(player: IClientPlayer) {
    const playerRender = new PlayerRender(player, new PIXI.Point(0, 0));
    this.playerRenders.push(playerRender);
  }

  removePlayer(player: IClientPlayer) {
    const playerRender = this.playerRenders.find((pr) => pr.player.id === player.id);
    if (playerRender) {
      this.playerRenders.splice(this.playerRenders.indexOf(playerRender), 1);
    }
  }
}

export interface IPlayersRenderArgs {
  // ...
}
