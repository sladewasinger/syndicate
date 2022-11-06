import type { IClientPlayer } from '../models/shared/IClientPlayer';
import * as PIXI from 'pixi.js';
import type { IClientGameData } from '../models/shared/IClientGameData';

export interface ILeaderboardRenderArgs {
  position: PIXI.Point;
  gameData: IClientGameData;
}

export class ILeaderboardPlayerRender {
  container: PIXI.Container;
  name: PIXI.Text | undefined;
  money: PIXI.Text | undefined;

  constructor(public player: IClientPlayer, public position: PIXI.Point) {
    this.container = new PIXI.Container();
    this.container.x = position.x;
    this.container.y = position.y;
  }
}

export class Leaderboard {
  container: PIXI.Container;
  leaderboardEntries: ILeaderboardPlayerRender[] = [];

  constructor(public parentContainer: PIXI.Container) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);
  }

  update(gameData: IClientGameData) {
    const extraPlayers = this.leaderboardEntries.filter((l) => !gameData.players.find((p) => p.id === l.player.id));
    for (const extraPlayer of extraPlayers) {
      console.log('Removing extra player from leaderboard: ', extraPlayer.player.name);
      this.removePlayer(extraPlayer.player);
    }
    const missingPlayers = gameData.players.filter((p) => !this.leaderboardEntries.find((l) => l.player.id === p.id));
    if (missingPlayers.length > 0) {
      this.container.removeChildren();
      this.drawInitial({ position: this.container.position, gameData });
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

  drawInitial(args: ILeaderboardRenderArgs) {
    this.container.x = args.position.x;
    this.container.y = args.position.y;

    const players = args.gameData.players.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < players.length; i++) {
      const render = new ILeaderboardPlayerRender(players[i], new PIXI.Point(0, i * 20));
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
      render.name = name;
      render.container.addChild(name);

      const money = new PIXI.Text(`$${player.money}`.toString(), {
        fontFamily: 'Arial',
        fontSize: 40,
        fill: color,
        stroke: strokeColor,
        strokeThickness: 4,
        letterSpacing: 4,
        align: 'left',
      });
      render.money = money;
      render.container.addChild(money);

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
  }
}
