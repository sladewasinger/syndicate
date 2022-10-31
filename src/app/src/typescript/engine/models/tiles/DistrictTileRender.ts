import type { DistrictTile } from '@/shared/models/tiles/DistrictTile';
import * as PIXI from 'pixi.js';

export class DistrictTileRender {
  public width: number = 77;
  public height: number = 115;

  constructor(public x: number, public y: number, public container: PIXI.Container, public tile: DistrictTile) {
    this.drawInitial(x, y);
  }

  private drawInitial(x: number, y: number) {
    const districtTileContainer = new PIXI.Container();
    districtTileContainer.x = x;
    districtTileContainer.y = y;

    const tile = new PIXI.Graphics();
    tile.lineStyle(1, 0x000000, 1);
    tile.beginFill(0xffffff, 1);
    tile.drawRect(0, 0, this.width, this.height);
    tile.endFill();
    districtTileContainer.addChild(tile);

    const colorBar = new PIXI.Graphics();
    colorBar.lineStyle(1, 0x000000, 1);
    colorBar.beginFill(this.tile.color, 1);
    colorBar.drawRect(0, 0, this.width, 20);
    colorBar.endFill();
    districtTileContainer.addChild(colorBar);

    const nameText = new PIXI.Text(`${this.tile.name}`, {
      fontFamily: 'Arial',
      fontSize: 16,
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    nameText.x = 0;
    nameText.y = colorBar.height;
    districtTileContainer.addChild(nameText);

    this.container.addChild(districtTileContainer);
  }
}
