import * as PIXI from 'pixi.js';
import { DistrictTileRender } from './tiles/DistrictTileRender';
import { PrisonTileRender } from './tiles/PrisonTileRender';
import { StartTileRender } from './tiles/StartTileRender';
import { boardPositions, BOARD_WIDTH, BOARD_HEIGHT, TILE_HEIGHT } from '../models/BoardPositions';
import { ParkTileRender } from './tiles/ParkTileRender';
import { GoToPrisonTileRender } from './tiles/GoToPrisonTileRender';
import type { IClientGameData } from '../models/shared/IClientGameData';
import type { IClientTile } from '../models/shared/IClientTile';
import { TileType } from '../models/shared/TileType';
import { EventTileRender } from './tiles/EventTileRender';
import { TaxTileRender } from './tiles/TaxTileRender';
import { SubwayTileRender } from './tiles/SubwayTileRender';
import { ElectricTileRender } from './tiles/ElectricTileRender';
import { PlayersRender } from './PlayersRender';
import { RenderData } from './RenderData';
import { InteractionManager } from '@pixi/interaction';
import { extensions } from '@pixi/core';
import { Leaderboard } from './Leaderboard';
import { InternetTileRender } from './tiles/InternetTileRender';
import { DiceRender } from './DiceRender';
import type { BoardCallbacks } from '../models/BoardCallbacks';

export class Board {
  canvas: HTMLCanvasElement;
  app: PIXI.Application;
  width: number;
  height: number;
  container: PIXI.Container;
  resizeTimer: number | undefined;
  playersRender: PlayersRender | undefined;
  renderData: RenderData;
  prevGameData: IClientGameData;
  leaderboard: Leaderboard | undefined;
  diceRender: DiceRender | undefined;

  constructor(gameData: IClientGameData, public callbacks: BoardCallbacks) {
    this.prevGameData = gameData;

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      throw new Error('No canvas found');
    }
    this.canvas = canvas as HTMLCanvasElement;
    this.width = BOARD_WIDTH;
    this.height = BOARD_HEIGHT;
    this.app = new PIXI.Application({
      view: this.canvas,
      width: this.width,
      height: this.height,
      backgroundColor: 0x222222,
      antialias: true,
      resolution: 1, // window.devicePixelRatio || 1,\
    });

    extensions.add(InteractionManager);

    console.log(this.app);

    this.container = this.app.stage;

    window.addEventListener('resize', () => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(this.resize.bind(this), 250);
    });
    this.resize();

    this.renderData = new RenderData();
    this.renderData.renderTiles = [];
  }

  resize() {
    const browserZoomLevel = window.devicePixelRatio;
    const scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height) * browserZoomLevel;
    this.canvas.width = Math.min(this.width, this.width * scale);
    this.canvas.height = Math.min(this.height, this.height * scale);
    this.container.scale.set(scale);
  }

  update(gameData: IClientGameData) {
    for (const tile of this.renderData.renderTiles) {
      tile.update(gameData, this.renderData);
    }
    this.playersRender?.update(gameData, this.renderData);
    this.leaderboard?.update(gameData, this.prevGameData);
    this.diceRender?.update(gameData, this.prevGameData, this.renderData);

    this.prevGameData = gameData;
  }

  async drawBoardInitial(gameData: IClientGameData) {
    console.log('drawBoardInitial');
    const board = new PIXI.Graphics();
    board.lineStyle(1, 0x000000, 1);
    board.beginFill(0xffffff, 1);
    board.drawRect(0, 0, this.width, this.height);
    board.endFill();
    this.container.addChild(board);

    this.diceRender = new DiceRender(this.container, this.callbacks.rollDice);
    await this.diceRender.drawInitial(gameData, new PIXI.Point(BOARD_WIDTH / 2, BOARD_HEIGHT / 2));

    const renderTiles = gameData.tiles.map(this.getTileRenderFromTile);
    for (let i = 0; i < boardPositions.length; i++) {
      const renderTile = renderTiles[i];
      if (!renderTile) {
        continue;
      }
      const pos = boardPositions[i];
      await renderTile.drawInitial(
        {
          x: pos.x - renderTile.width / 2,
          y: pos.y - renderTile.height / 2,
          rotation: pos.rotation,
        },
        this.container
      );
      this.renderData.renderTiles.push(renderTile);
    }

    this.playersRender = new PlayersRender(gameData.players);
    this.renderData.playersRender = this.playersRender;
    this.playersRender.drawInitial({}, this.container);

    this.leaderboard = new Leaderboard(this.container);
    this.leaderboard.drawInitial({
      gameData: gameData,
      position: new PIXI.Point(TILE_HEIGHT + 30, TILE_HEIGHT + 30),
    });
  }

  getTileRenderFromTile(tile: IClientTile) {
    switch (tile.type) {
      case TileType.Start:
        return new StartTileRender(tile);
      case TileType.District:
        return new DistrictTileRender(tile);
      case TileType.Prison:
        return new PrisonTileRender(tile);
      case TileType.Park:
        return new ParkTileRender(tile);
      case TileType.GoToPrison:
        return new GoToPrisonTileRender(tile);
      case TileType.Event:
        return new EventTileRender(tile);
      case TileType.Tax:
        return new TaxTileRender(tile);
      case TileType.Subway:
        return new SubwayTileRender(tile);
      case TileType.Electric:
        return new ElectricTileRender(tile);
      case TileType.Internet:
        return new InternetTileRender(tile);
      default:
        return undefined;
    }
  }
}
