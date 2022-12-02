import { TILE_HEIGHT } from '@/typescript/models/BoardPositions';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import * as PIXI from 'pixi.js';
import type { IClientTile } from '../../models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs, TileMode } from './ITileRender';
import { TileRenderUtils } from './TileRenderUtils';

export class PrisonTileRender implements ITileRender {
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

    const tileText = new PIXI.Text('Fast Lane', {
      fill: 0x000000,
      fontSize: this.height * 0.15,
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    tileText.pivot.x = tileText.width / 2;
    tileText.pivot.y = tileText.height / 2;
    tileText.x = this.width / 2;
    tileText.y = this.height - tileText.height / 2;

    const prisonBox = new PIXI.Graphics();
    prisonBox.lineStyle(1, 0x000000, 1);
    prisonBox.beginFill(0xffa500, 1);
    prisonBox.drawRect(0, 0, this.width * 0.65, this.height * 0.65);
    prisonBox.endFill();
    prisonBox.x = this.width - prisonBox.width;
    prisonBox.y = 0;

    const prisonText = new PIXI.Text('Traffic', {
      fill: 0x000000,
      fontSize: this.height * 0.15,
    });
    prisonText.pivot.x = prisonText.width / 2;
    prisonText.pivot.y = prisonText.height / 2;
    prisonText.x = prisonBox.x + prisonBox.width / 2;
    prisonText.y = prisonBox.y + prisonBox.height / 2;

    const tileContainer = this.container;
    tileContainer.addChild(tileBackground, prisonBox, prisonText, tileText);
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
