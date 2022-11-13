import { TILE_WIDTH, TILE_HEIGHT } from '@/typescript/models/BoardPositions';
import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import type { IClientTile } from '@/typescript/models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs } from './ITileRender';
import { TileRenderUtils } from './TileRenderUtils';

export class InternetTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  container: PIXI.Container;
  static internetTexture: any;

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  update(gameData: IClientGameData, renderData: RenderData) {}

  async drawInitial(args: ITileRenderArgs, container: PIXI.Container) {
    if (!InternetTileRender.internetTexture) {
      InternetTileRender.internetTexture = await Assets.load('internet.png');
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

    // pixi sprite from texture
    const internetIcon = new PIXI.Sprite(InternetTileRender.internetTexture);
    const scale = Math.min(this.width / internetIcon.width, this.height / internetIcon.height) * 0.6;
    internetIcon.scale = new PIXI.Point(scale, scale);
    internetIcon.x = (this.width - internetIcon.width) / 2;
    internetIcon.y = this.height * 0.5 - internetIcon.height * 0.5 + 20;

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
    tileContainer.addChild(tileBackground, internetIcon, price, tileText);
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