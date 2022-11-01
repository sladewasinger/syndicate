import { TILE_HEIGHT } from '@/typescript/BoardPositions';
import * as PIXI from 'pixi.js';
import type { IClientTile } from './IClientTile';
import type { ITileRender } from './ITileRender';

export class StartTileRender implements ITileRender {
  width: number = TILE_HEIGHT;
  height: number = TILE_HEIGHT;
  constructor(public tile: IClientTile) {}

  drawInitial(x: number, y: number, rotation: number, container: PIXI.Container) {
    const tileBackground = new PIXI.Graphics();
    tileBackground.lineStyle(1, 0x000000, 1);
    tileBackground.beginFill(0xffffff, 1);
    tileBackground.drawRect(0, 0, this.width, this.height);
    tileBackground.endFill();

    const tileText = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      fontSize: this.height * 0.15,
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    tileText.pivot.x = tileText.width / 2;
    tileText.pivot.y = tileText.height / 2;
    tileText.x = this.width / 2;
    tileText.y = this.height / 2;

    const tileContainer = new PIXI.Container();
    tileContainer.addChild(tileBackground, tileText);
    tileContainer.pivot.x = tileContainer.width / 2;
    tileContainer.pivot.y = tileContainer.height / 2;
    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
