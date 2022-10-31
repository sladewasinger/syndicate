import type { IClientTile } from '@/shared/models/tiles/IClientTile';
import * as PIXI from 'pixi.js';

export class StartTileRender {
  public width: number = 115;
  public height: number = 115;

  constructor(public x: number, public y: number, public container: PIXI.Container, public tile: IClientTile) {
    this.drawInitial(x, y);
  }

  private drawInitial(x: number, y: number) {
    const districtTileContainer = new PIXI.Container();
    districtTileContainer.x = x;
    districtTileContainer.y = y;

    const districtTile = new PIXI.Graphics();
    districtTile.lineStyle(1, 0x000000, 1);
    districtTile.beginFill(0xffffff, 1);
    districtTile.drawRect(0, 0, this.width, this.height);
    districtTile.endFill();
    districtTileContainer.addChild(districtTile);

    const indexText = new PIXI.Text(`${this.tile.name}`, {
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    indexText.x = 0;
    indexText.y = 0;
    districtTileContainer.addChild(indexText);

    this.container.addChild(districtTileContainer);
  }
}
