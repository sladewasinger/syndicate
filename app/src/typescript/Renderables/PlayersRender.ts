import type { IClientPlayer } from '../models/shared/IClientPlayer';
import * as PIXI from 'pixi.js';
import type { IClientGameData } from '../models/shared/IClientGameData';
import type { RenderData } from './RenderData';

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
  container: PIXI.Container;

  constructor(public players: IClientPlayer[]) {
    this.container = new PIXI.Container();

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
        this.distributePlayersOnSameTile(gameData, player, renderData);
      } else {
        this.removePlayer(playerRender.player);
      }
    }
  }

  private distributePlayersOnSameTile(gameData: IClientGameData, player: IClientPlayer, renderData: RenderData) {
    const playersOnSameTile = gameData.players.filter((p) => p.position === player.position);
    if (playersOnSameTile.length > 1) {
      const tilePosition = renderData.renderTiles[player.position].container.position;
      const radius = 25;
      const angle = (2 * Math.PI) / playersOnSameTile.length;
      for (let i = 0; i < playersOnSameTile.length; i++) {
        const player = playersOnSameTile[i];
        const playerRender = this.playerRenders.find((pr) => pr.player.id === player.id);
        if (playerRender) {
          playerRender.container.x = tilePosition.x + radius * Math.cos(i * angle - Math.PI / 2);
          playerRender.container.y = tilePosition.y + radius * Math.sin(i * angle - Math.PI / 2);
        }
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
      this.container.addChild(playerRender.container);

      container.addChild(this.container);
    }
  }

  addPlayer(player: IClientPlayer) {
    const playerRender = new PlayerRender(player, new PIXI.Point(0, 0));
    this.playerRenders.push(playerRender);
  }

  removePlayer(player: IClientPlayer) {
    const playerRender = this.playerRenders.find((pr) => pr.player.id === player.id);
    if (playerRender) {
      const splicedRenders = this.playerRenders.splice(this.playerRenders.indexOf(playerRender), 1);
      for (const splicedRender of splicedRenders) {
        this.container.removeChild(splicedRender.container);
      }
    }
  }
}

export interface IPlayersRenderArgs {
  // ...
}
