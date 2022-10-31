import type { DistrictTile } from '@/shared/models/tiles/DistrictTile';
import { TileType } from '@/shared/models/tiles/TileType';
import * as PIXI from 'pixi.js';
import type { IClientGameData } from '../../shared/models/IClientGameData';
import { DistrictTileRender } from './models/tiles/DistrictTileRender';
import { StartTileRender } from './models/tiles/StartTileRender';

export class Board {
  canvas: HTMLCanvasElement;
  app: PIXI.Application;
  width: number;
  height: number;
  container: PIXI.Container;
  resizeTimer: NodeJS.Timeout | undefined;

  constructor() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      throw new Error('No canvas found');
    }
    this.canvas = canvas as HTMLCanvasElement;
    this.width = 927;
    this.height = 927;
    this.app = new PIXI.Application({
      view: this.canvas,
      width: 927,
      height: 927,
      backgroundColor: 0x222222,
      resolution: window.devicePixelRatio || 1,
    });
    this.container = this.app.stage;
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(this.resize.bind(this), 250);
    });
  }

  resize() {
    const scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height);
    this.canvas.width = Math.min(this.width, this.width * scale);
    this.canvas.height = Math.min(this.height, this.height * scale);
    this.container.scale.set(scale);
  }

  drawBoardInitial(gameData: IClientGameData) {
    const blackBackground = new PIXI.Graphics();
    blackBackground.lineStyle(1, 0x000000, 1);
    blackBackground.beginFill(0x000000, 1);
    blackBackground.drawRect(0, 0, this.width, this.height);
    blackBackground.endFill();
    this.container.addChild(blackBackground);

    const tileWidth = 77;
    const tileHeight = 115;
    const boardPositions = [
      {
        index: 0,
        x: this.width - tileHeight,
        y: this.height - tileHeight,
      },
      {
        index: 1,
        x: this.width - tileHeight - tileWidth,
        y: this.height - tileHeight,
      },
      {
        index: 2,
        x: this.width - tileHeight - tileWidth * 2,
        y: this.height - tileHeight,
      },
      {
        index: 3,
        x: this.width - tileHeight - tileWidth * 3,
        y: this.height - tileHeight,
      },
      {
        index: 4,
        x: this.width - tileHeight - tileWidth * 4,
        y: this.height - tileHeight,
      },
      {
        index: 5,
        x: this.width - tileHeight - tileWidth * 5,
        y: this.height - tileHeight,
      },
      {
        index: 6,
        x: this.width - tileHeight - tileWidth * 6,
        y: this.height - tileHeight,
      },
      {
        index: 7,
        x: this.width - tileHeight - tileWidth * 7,
        y: this.height - tileHeight,
      },
      {
        index: 8,
        x: this.width - tileHeight - tileWidth * 8,
        y: this.height - tileHeight,
      },
      {
        index: 9,
        x: this.width - tileHeight - tileWidth * 9,
        y: this.height - tileHeight,
      },
      {
        index: 10,
        x: 0,
        y: this.height - tileHeight,
      },
    ];

    for (let i = 0; i < boardPositions.length; i++) {
      const tile = gameData.tiles[i];
      if (tile.type == TileType.Start) {
        const startTile = new StartTileRender(boardPositions[i].x, boardPositions[i].y, this.container, tile);
      } else if (tile.type == TileType.District) {
        const tileRender = new DistrictTileRender(
          boardPositions[i].x,
          boardPositions[i].y,
          this.container,
          <DistrictTile>(<unknown>tile)
        );
      } else if (tile.type == TileType.Prison) {
        const prisonTile = new StartTileRender(boardPositions[i].x, boardPositions[i].y, this.container, tile);
      }
    }
  }
}
