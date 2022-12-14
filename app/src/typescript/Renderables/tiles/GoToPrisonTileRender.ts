import { TILE_HEIGHT } from '@/typescript/models/BoardPositions';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import * as PIXI from 'pixi.js';
import type { IClientTile } from '../../models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs, TileMode } from './ITileRender';
import { TileRenderUtils } from './TileRenderUtils';

export class GoToPrisonTileRender implements ITileRender {
  width: number = TILE_HEIGHT;
  height: number = TILE_HEIGHT;
  container: PIXI.Container;
  mode: TileMode = 'normal';

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  update(gameData: IClientGameData, renderData: RenderData) {}

  drawInitial(args: ITileRenderArgs, container: PIXI.Container) {
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

    const tileContainer = this.container;
    tileContainer.addChild(tileBackground, tileText);
    tileContainer.pivot.x = tileContainer.width / 2;
    tileContainer.pivot.y = tileContainer.height / 2;
    tileContainer.x = args.x;
    tileContainer.y = args.y;
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
