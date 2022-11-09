import type { IClientPlayer } from '../models/shared/IClientPlayer';
import * as PIXI from 'pixi.js';
import type { IClientGameData } from '../models/shared/IClientGameData';
import type { RenderData } from './RenderData';
import { Assets } from '@pixi/assets';

export interface ILeaderboardRenderArgs {
  position: PIXI.Point;
  gameData: IClientGameData;
}

export class ILeaderboardPlayerRender {
  container: PIXI.Container;

  constructor(
    public player: IClientPlayer,
    public position: PIXI.Point,
    public name: PIXI.Text,
    public money: PIXI.Text
  ) {
    this.container = new PIXI.Container();
    this.container.x = position.x;
    this.container.y = position.y;

    this.container.addChild(name, money);
  }
}

export class Leaderboard {
  container: PIXI.Container;
  leaderboardEntries: ILeaderboardPlayerRender[] = [];
  currentPlayerIndicator1: PIXI.Sprite | undefined;

  static indicatorTexture: any;

  constructor(public parentContainer: PIXI.Container) {
    this.container = new PIXI.Container();
  }

  async update(gameData: IClientGameData, prevGameData: IClientGameData, renderData: RenderData) {
    const currentPlayerRender = this.leaderboardEntries.find((l) => l.player.id === gameData.currentPlayer?.id);

    if (!this.currentPlayerIndicator1 || !currentPlayerRender) {
      return;
    }

    this.currentPlayerIndicator1.y = currentPlayerRender?.container.y;
    this.currentPlayerIndicator1.x =
      currentPlayerRender.money.x +
      currentPlayerRender.money.width +
      this.currentPlayerIndicator1.width +
      25 +
      Math.cos(renderData.frame * 0.05) * 25;
    const extraPlayers = this.leaderboardEntries.filter((l) => !gameData.players.find((p) => p.id === l.player.id));
    for (const extraPlayer of extraPlayers) {
      console.log('Removing extra player from leaderboard: ', extraPlayer.player.name);
      this.removePlayer(extraPlayer.player);
    }
    const missingPlayers = gameData.players.filter((p) => !this.leaderboardEntries.find((l) => l.player.id === p.id));
    if (missingPlayers.length > 0) {
      this.container.removeChildren();
      await this.drawInitial({ position: this.container.position, gameData });
    }

    this.updateMoneyText(gameData, prevGameData);
  }

  private updateMoneyText(gameData: IClientGameData, prevGameData: IClientGameData) {
    for (const player of gameData.players) {
      const prevPlayer = prevGameData.players.find((p) => p.id === player.id);
      const leaderboardEntry = this.leaderboardEntries.find((l) => l.player.id === player.id);
      if (leaderboardEntry) {
        leaderboardEntry.name.text = player.name;
        leaderboardEntry.money.text = `$${player.money}`;

        if (prevPlayer && prevPlayer.money !== player.money) {
          console.log('Updating money text for player: ', player.name);
          const diff = player.money - prevPlayer.money;
          const sign = diff > 0 ? '+' : '-';
          const moneyLossGain = new PIXI.Text(`${sign}${Math.abs(diff)}`, {
            fontSize: 40,
            fontFamily: 'monospace',
            fill: diff > 0 ? 0x00dd00 : 0xdd0000,
          });
          moneyLossGain.x = leaderboardEntry.money.x + leaderboardEntry.money.width + 10;
          moneyLossGain.y = leaderboardEntry.container.y + 5;
          this.container.addChild(moneyLossGain);

          let alpha = 5;
          const fadeInterval = setInterval(() => {
            alpha -= 0.1;
            moneyLossGain.alpha = alpha;
            moneyLossGain.x *= 1.01;
            moneyLossGain.scale.y *= 1.005;
            if (moneyLossGain.alpha <= 0) {
              this.container.removeChild(moneyLossGain);
              clearInterval(fadeInterval);
            }
          }, 100);
        }
      }
    }
  }

  removePlayer(player: IClientPlayer) {
    const render = this.leaderboardEntries.find((pr) => pr.player.id === player.id);
    if (render) {
      this.container.removeChild(render.container);
      this.leaderboardEntries = this.leaderboardEntries.filter((pr) => pr.player.id !== player.id);

      this.setPositionsOfRenders();
    }
  }

  async drawInitial(args: ILeaderboardRenderArgs) {
    if (!Leaderboard.indicatorTexture) {
      Leaderboard.indicatorTexture = await Assets.load('indicator.png');
    }

    this.parentContainer.addChild(this.container);
    this.container.x = args.position.x;
    this.container.y = args.position.y;

    this.currentPlayerIndicator1 = new PIXI.Sprite(Leaderboard.indicatorTexture);
    this.currentPlayerIndicator1.rotation = Math.PI / 2;
    this.currentPlayerIndicator1.width = 50;
    this.currentPlayerIndicator1.height = 50;
    this.currentPlayerIndicator1.x = 0;
    this.currentPlayerIndicator1.y = 0;
    this.currentPlayerIndicator1.alpha = 0.75;
    this.container.addChild(this.currentPlayerIndicator1);

    const players = args.gameData.players.sort((a, b) => a.turnOrder - b.turnOrder);
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const color = player.color;
      const strokeColor = 0x000000;

      const name = new PIXI.Text(player.name, {
        fontFamily: 'Arial',
        fontSize: 40,
        fill: color,
        stroke: strokeColor,
        strokeThickness: 4,
        letterSpacing: 4,
        align: 'right',
      });

      const money = new PIXI.Text(`$${player.money}`.toString(), {
        fontFamily: 'Arial',
        fontSize: 40,
        fill: color,
        stroke: strokeColor,
        strokeThickness: 4,
        letterSpacing: 4,
        align: 'left',
      });

      const render = new ILeaderboardPlayerRender(players[i], new PIXI.Point(0, i * 20), name, money);

      this.container.addChild(render.container);
      this.leaderboardEntries.push(render);
    }

    this.setPositionsOfRenders();
  }

  setPositionsOfRenders() {
    const longestNameRender = this.leaderboardEntries.reduce((a, b) =>
      (a.name?.width || 0) > (b.name?.width || 0) ? a : b
    );

    for (let i = 0; i < this.leaderboardEntries.length; i++) {
      const render = this.leaderboardEntries[i];
      render.container.y = i * 45;
      render.name!.x = (longestNameRender.name!.width || 0) - render.name!.width;
      render.money!.x = render.name!.x + render.name!.width + 50;
    }

    this.currentPlayerIndicator1!.x =
      longestNameRender.money.x + longestNameRender.money.width + this.currentPlayerIndicator1!.width;
  }
}
