import { TILE_WIDTH, TILE_HEIGHT } from '@/typescript/models/BoardPositions';
import * as PIXI from 'pixi.js';
import type { IClientTile } from '../../models/shared/IClientTile';
import type { ITileRender, ITileRenderArgs } from './ITileRender';
import { Assets } from '@pixi/assets';

export class SubwayTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  container: PIXI.Container;

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  async drawInitial(args: ITileRenderArgs, container: PIXI.Container) {
    const subwayTexture = await Assets.load('subway.png');

    const tileBackground = new PIXI.Graphics();
    tileBackground.lineStyle(2, 0x000000, 1);
    tileBackground.beginFill(0xffffff, 1);
    tileBackground.drawRect(0, 0, this.width, this.height);
    tileBackground.endFill();

    const price = new PIXI.Text(`$${this.tile.price}`, {
      fill: 0x000000,
      fontSize: this.height * 0.14,
    });
    price.pivot.x = price.width / 2;
    price.x = this.width / 2;
    price.y = this.height - price.height;

    // pixi sprite from texture
    const subwayIcon = new PIXI.Sprite(subwayTexture);
    const scale = Math.min(this.width / subwayIcon.width, this.height / subwayIcon.height) * 0.7;
    subwayIcon.scale = new PIXI.Point(scale, scale);
    subwayIcon.x = (this.width - subwayIcon.width) / 2;
    subwayIcon.y = this.height - subwayIcon.height - price.height - 5;

    const tileText = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      fontSize: this.height * 0.12,
      wordWrap: true,
      wordWrapWidth: this.width * 0.9,
      align: 'center',
    });
    tileText.pivot.x = tileText.width / 2;
    tileText.pivot.y = tileText.height / 2;
    tileText.x = this.width / 2;
    tileText.y = this.height * 0.2;

    const tileContainer = this.container;
    tileContainer.addChild(tileBackground, subwayIcon, price, tileText);
    tileContainer.x = args.x;
    tileContainer.y = args.y;
    tileContainer.pivot.x = this.width / 2;
    tileContainer.pivot.y = this.height / 2;
    tileContainer.rotation = args.rotation;
    container.addChild(tileContainer);
  }
}
