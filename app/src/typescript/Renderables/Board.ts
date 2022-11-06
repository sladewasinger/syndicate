import * as PIXI from 'pixi.js';
import { DistrictTileRender } from '../models/tiles/DistrictTileRender';
import { PrisonTileRender } from '../models/tiles/PrisonTileRender';
import { StartTileRender } from '../models/tiles/StartTileRender';
import { boardPositions, BOARD_WIDTH, BOARD_HEIGHT } from '../models/BoardPositions';
import { ParkTileRender } from '../models/tiles/ParkTileRender';
import { GoToPrisonTileRender } from '../models/tiles/GoToPrisonTileRender';
import type { IClientGameData } from '../models/shared/IClientGameData';
import type { IClientTile } from '../models/shared/IClientTile';
import { TileType } from '../models/shared/TileType';
import { EventTileRender } from '../models/tiles/EventTileRender';
import { TaxTileRender } from '../models/tiles/TaxTileRender';
import { SubwayTileRender } from '../models/tiles/SubwayTileRender';
import { PlayersRender } from './PlayersRender';
import { RenderData } from './RenderData';

export class Board {
  canvas: HTMLCanvasElement;
  app: PIXI.Application;
  width: number;
  height: number;
  container: PIXI.Container;
  resizeTimer: number | undefined;
  playersRender: PlayersRender | undefined;
  renderData: RenderData;

  constructor() {
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
      resolution: 1, // window.devicePixelRatio || 1,
    });
    this.container = this.app.stage;

    window.addEventListener('resize', () => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(this.resize.bind(this), 250);
    });
    this.resize();

    //this.textures['subway'] = PIXI.Texture.from('subway2.png', { width: 100, height: 100 }, true);

    this.renderData = new RenderData();
    this.renderData.renderTiles = [];
  }

  resize() {
    const browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    const scale = (Math.min(window.innerWidth / this.width, window.innerHeight / this.height) * browserZoomLevel) / 100;
    this.canvas.width = Math.min(this.width, this.width * scale);
    this.canvas.height = Math.min(this.height, this.height * scale);
    this.container.scale.set(scale);
  }

  update(gameData: IClientGameData) {
    this.playersRender?.update(gameData, this.renderData);
  }

  async drawBoardInitial(gameState: IClientGameData) {
    console.log('drawBoardInitial');
    const board = new PIXI.Graphics();
    board.lineStyle(1, 0x000000, 1);
    board.beginFill(0x000000, 1);
    board.drawRect(0, 0, this.width, this.height);
    board.endFill();
    this.container.addChild(board);

    const text = new PIXI.Text('Hello World', { fill: 0xffffff, fontSize: 24 });
    text.x = 100;
    text.y = 100;
    this.container.addChild(text);

    const renderTiles = gameState.tiles.map(this.getTileRenderFromTile);
    for (let i = 0; i < boardPositions.length; i++) {
      const renderTile = renderTiles[i];
      if (!renderTile) {
        continue;
      }
      const pos = boardPositions[i];
      renderTile.drawInitial(
        {
          x: pos.x - renderTile.width / 2,
          y: pos.y - renderTile.height / 2,
          rotation: pos.rotation,
        },
        this.container
      );
      this.renderData.renderTiles.push(renderTile);
    }

    this.playersRender = new PlayersRender(gameState.players);
    this.playersRender.drawInitial({}, this.container);
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
      default:
        return undefined;
    }
  }
}
