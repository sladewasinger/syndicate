import * as PIXI from 'pixi.js';
import { BOARD_WIDTH, TILE_HEIGHT, TILE_WIDTH } from '../models/BoardPositions';
import type { IClientGameData } from '../models/shared/IClientGameData';
import type { RenderData } from './RenderData';

export class GameLogRender {
  container: PIXI.Container;
  gameLogText: PIXI.Text | undefined;

  constructor(public parentContainer: PIXI.Container) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);
  }

  update(gameData: IClientGameData, renderData: RenderData) {
    if (!gameData || !renderData) {
      return;
    }
    if (!this.gameLogText) {
      return;
    }

    this.gameLogText.text = ([...gameData.log] || [])
      .reverse()
      .slice(0, 5)
      .map((x) => `>${x}`)
      .join('\n');
  }

  drawInitial() {
    const gameLogBorder = new PIXI.Graphics();
    // gameLogBorder.lineStyle(2, 0x000000, 1);
    // gameLogBorder.drawRect(
    //   BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 3 - 10,
    //   TILE_HEIGHT + 10,
    //   TILE_WIDTH * 3,
    //   TILE_WIDTH * 3
    // );
    // gameLogBorder.endFill();

    const gameLogText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 32,
      wordWrap: true,
      breakWords: true,
      wordWrapWidth: TILE_WIDTH * 3,
      fill: 0x000000,
      align: 'left',
    });
    gameLogText.x = BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 3 - 5;
    gameLogText.y = TILE_HEIGHT + 5;
    this.gameLogText = gameLogText;

    this.container.addChild(gameLogText);
  }
}
