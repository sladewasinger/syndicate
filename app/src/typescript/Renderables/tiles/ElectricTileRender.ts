import { TILE_WIDTH, TILE_HEIGHT } from '@/typescript/models/BoardPositions';
import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import type { IClientTile } from '@/typescript/models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs } from './ITileRender';
import { TileRenderUtils } from './TileRenderUtils';

export class ElectricTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  container: PIXI.Container;
  static electricTexture: any;
  tileBackground: PIXI.Graphics | undefined;
  gameData: IClientGameData | undefined;
  renderData: RenderData | undefined;

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  update(gameData: IClientGameData, renderData: RenderData) {
    this.gameData = gameData;
    this.renderData = renderData;

    const gameTile = gameData.tiles.find((t) => t.id === this.tile.id);
    if (gameTile === undefined) {
      throw new Error(`Tile with id '${this.tile.id}' not found`);
    }
    const owner = gameData.players.find((p) => p.id === gameTile.ownerId);
    if (owner) {
      this.tileBackground?.clear();
      this.tileBackground?.lineStyle(2, 0x000000, 1);
      this.tileBackground?.beginFill(owner.color, 1);
      this.tileBackground?.drawRect(0, 0, this.width, this.height);
      this.tileBackground?.endFill();
    } else {
      this.tileBackground?.clear();
      this.tileBackground?.lineStyle(2, 0x000000, 1);
      this.tileBackground?.beginFill(0xffffff, 1);
      this.tileBackground?.drawRect(0, 0, this.width, this.height);
      this.tileBackground?.endFill();
    }
  }

  async drawInitial(args: ITileRenderArgs, container: PIXI.Container) {
    if (!ElectricTileRender.electricTexture) {
      ElectricTileRender.electricTexture = await Assets.load('electric.png');
    }

    const tileBackground = new PIXI.Graphics();
    tileBackground.lineStyle(2, 0x000000, 1);
    tileBackground.beginFill(0xffffff, 1);
    tileBackground.drawRect(0, 0, this.width, this.height);
    tileBackground.endFill();
    this.tileBackground = tileBackground;

    const price = new PIXI.Text(`$${this.tile.price}`, {
      fill: 0x000000,
      fontSize: this.height * 0.14,
    });
    price.pivot.x = price.width / 2;
    price.x = this.width / 2;
    price.y = this.height - price.height;

    // pixi sprite from texture
    const electricIcon = new PIXI.Sprite(ElectricTileRender.electricTexture);
    const scale = Math.min(this.width / electricIcon.width, this.height / electricIcon.height) * 0.6;
    electricIcon.scale = new PIXI.Point(scale, scale);
    electricIcon.x = (this.width - electricIcon.width) / 2;
    electricIcon.y = this.height - electricIcon.height - price.height - 5;

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
    tileContainer.addChild(tileBackground, electricIcon, price, tileText);
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
