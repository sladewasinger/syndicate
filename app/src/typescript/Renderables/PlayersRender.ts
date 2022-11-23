import type { IClientPlayer } from '../models/shared/IClientPlayer';
import * as PIXI from 'pixi.js';
import type { IClientGameData } from '../models/shared/IClientGameData';
import type { RenderData } from './RenderData';
import { Leaderboard } from './Leaderboard';
import { Utils } from '../Utils/Utils';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../models/BoardPositions';

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
  currentPlayerIndicator: PIXI.Sprite | undefined;

  constructor(public players: IClientPlayer[]) {
    this.container = new PIXI.Container();

    for (const player of players) {
      this.addPlayer(player);
    }
  }

  update(gameData: IClientGameData, renderData: RenderData) {
    for (const playerRender of this.playerRenders) {
      const player = gameData.players.find((p) => p.id === playerRender.player.id);
      if (player) {
        // ease player to new position
        const tilePosition = renderData.renderTiles[player.position].container.position;

        const playersOnSameTile = gameData.players
          .sort((a, b) => a.turnOrder - b.turnOrder)
          .filter((p) => p.position === player.position);

        if (playersOnSameTile.length <= 1) {
          const maxSpeed = 10;
          playerRender.container.x += Utils.clamp(
            (tilePosition.x - playerRender.container.x) * 0.05,
            -maxSpeed,
            maxSpeed
          );
          playerRender.container.y += Utils.clamp(
            (tilePosition.y - playerRender.container.y) * 0.05,
            -maxSpeed,
            maxSpeed
          );
        } else {
          this.distributePlayersOnSameTile(gameData, player.position, playersOnSameTile, renderData);
        }
      } else {
        this.removePlayer(playerRender.player);
      }
    }

    const currentPlayerRender = this.playerRenders.find((pr) => pr.player.id === gameData.currentPlayer?.id);
    if (currentPlayerRender && this.currentPlayerIndicator) {
      this.currentPlayerIndicator.x = currentPlayerRender.container.x;
      this.currentPlayerIndicator.y =
        currentPlayerRender.container.y -
        this.currentPlayerIndicator.height -
        40 -
        Math.sin(renderData.frame * 0.05) * 40;
    }
  }

  private distributePlayersOnSameTile(
    gameData: IClientGameData,
    position: number,
    playersOnSameTile: IClientPlayer[],
    renderData: RenderData
  ) {
    const tilePosition = renderData.renderTiles[position].container.position;
    const radius = 25;
    const angle = (2 * Math.PI) / playersOnSameTile.length;
    for (let i = 0; i < playersOnSameTile.length; i++) {
      const player = playersOnSameTile[i];
      const playerRender = this.playerRenders.find((pr) => pr.player.id === player.id);
      if (playerRender) {
        playerRender.container.x +=
          (tilePosition.x + radius * Math.cos(i * angle + Math.PI + Math.PI / 6) - playerRender.container.x) * 0.05;
        playerRender.container.y +=
          (tilePosition.y + radius * Math.sin(i * angle + Math.PI + Math.PI / 6) - playerRender.container.y) * 0.05;
      }
    }
  }

  async drawInitial(args: IPlayersRenderArgs, container: PIXI.Container) {
    this.currentPlayerIndicator = new PIXI.Sprite(Leaderboard.indicatorTexture);
    this.currentPlayerIndicator.x = 50;
    this.currentPlayerIndicator.y = 50;
    this.currentPlayerIndicator.scale.set(0.5);
    this.currentPlayerIndicator.alpha = 0.75;
    this.currentPlayerIndicator.anchor.set(0.5, 0.5);
    this.container.addChild(this.currentPlayerIndicator);

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
    const playerRender = new PlayerRender(player, new PIXI.Point(BOARD_WIDTH, BOARD_HEIGHT));
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
