import { TILE_WIDTH, TILE_HEIGHT } from '@/typescript/BoardPositions';
import * as PIXI from 'pixi.js';
import type { IClientTile } from './IClientTile';
import type { ITileRender } from './ITileRender';

export class DistrictTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  constructor(public tile: IClientTile) {}

  drawInitial(x: number, y: number, rotation: number, container: PIXI.Container) {
    const tileBackground = new PIXI.Graphics();
    tileBackground.lineStyle(2, 0x000000, 1);
    tileBackground.beginFill(0xffffff, 1);
    tileBackground.drawRect(0, 0, this.width, this.height);
    tileBackground.endFill();

    const colorBar = new PIXI.Graphics();
    colorBar.lineStyle(2, 0x000000, 1);
    colorBar.beginFill(this.tile.color, 1);
    colorBar.drawRect(0, 0, this.width, this.height * 0.2);
    colorBar.endFill();

    const tileText = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      fontSize: this.height * 0.14,
      wordWrap: true,
      wordWrapWidth: this.width,
      align: 'center',
    });
    tileText.pivot.x = tileText.width / 2;
    tileText.x = this.width / 2;
    tileText.y = colorBar.height;

    const tileContainer = new PIXI.Container();
    tileContainer.addChild(tileBackground, colorBar, tileText);
    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.pivot.x = this.width / 2;
    tileContainer.pivot.y = this.height / 2;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
