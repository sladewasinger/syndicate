import { TILE_WIDTH, TILE_HEIGHT } from '@/typescript/models/BoardPositions';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import { Assets } from '@pixi/assets';
import * as PIXI from 'pixi.js';
import type { IClientTile } from '../../models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs, TileMode } from './ITileRender';
import { TileRenderUtils } from './TileRenderUtils';

export class TaxTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  container: PIXI.Container;
  static taxTexture: any;
  mode: TileMode = 'normal';

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(gameData: IClientGameData, renderData: RenderData) {}

  async drawInitial(args: ITileRenderArgs, container: PIXI.Container) {
    if (!TaxTileRender.taxTexture) {
      TaxTileRender.taxTexture = await Assets.load('tax.png');
    }
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

    const taxIcon = new PIXI.Sprite(TaxTileRender.taxTexture);
    const scale = Math.min(this.width / taxIcon.width, this.height / taxIcon.height) * 0.5;
    taxIcon.scale = new PIXI.Point(scale, scale);
    taxIcon.x = (this.width - taxIcon.width) / 2;
    taxIcon.y = this.height * 0.5 - taxIcon.height * 0.5 + 10;

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
    tileText.y = this.height * 0.2;

    const tileContainer = this.container;
    tileContainer.addChild(tileBackground, taxIcon, price, tileText);
    tileContainer.x = args.x;
    tileContainer.y = args.y;
    tileContainer.pivot.x = this.width / 2;
    tileContainer.pivot.y = this.height / 2;
    tileContainer.rotation = args.rotation;
    container.addChild(tileContainer);
  }

  fade(): void {
    TileRenderUtils.fade(this.container);
  }

  unfade(): void {
    TileRenderUtils.unfade(this.container);
  }
}
