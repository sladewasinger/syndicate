import { TILE_WIDTH, TILE_HEIGHT } from '@/typescript/models/BoardPositions';
import * as PIXI from 'pixi.js';
import type { IClientTile } from '../shared/IClientTile';
import type { ITileRender, ITileRenderArgs } from './ITileRender';

export class TaxTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  constructor(public tile: IClientTile) {}

  drawInitial(args: ITileRenderArgs, container: PIXI.Container) {
    const tileBackground = new PIXI.Graphics();
    tileBackground.lineStyle(2, 0x000000, 1);
    tileBackground.beginFill(0xffffff, 1);
    tileBackground.drawRect(0, 0, this.width, this.height);
    tileBackground.endFill();

    const tileText = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      fontSize: this.height * 0.14,
      wordWrap: true,
      wordWrapWidth: this.width,
      align: 'center',
    });
    tileText.pivot.x = tileText.width / 2;
    tileText.pivot.y = tileText.height / 2;
    tileText.x = this.width / 2;
    tileText.y = this.height / 2;

    const tileContainer = new PIXI.Container();
    tileContainer.addChild(tileBackground, tileText);
    tileContainer.x = args.x;
    tileContainer.y = args.y;
    tileContainer.pivot.x = this.width / 2;
    tileContainer.pivot.y = this.height / 2;
    tileContainer.rotation = args.rotation;
    container.addChild(tileContainer);
  }
}
