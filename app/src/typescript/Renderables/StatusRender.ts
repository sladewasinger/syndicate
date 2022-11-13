import * as PIXI from 'pixi.js';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../models/BoardPositions';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { StateName } from '../models/shared/StateNames';
import type { RenderData } from './RenderData';

export class StatusRender {
  container: PIXI.Container;
  gameOver: boolean = false;

  constructor(public parentContainer: PIXI.Container) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);
  }

  update(gameData: IClientGameData, prevGameData: IClientGameData, renderData: RenderData) {
    if (!gameData || !prevGameData || !renderData) {
      return;
    }

    if (gameData.state == StateName.GameOver && !this.gameOver) {
      console.log('Game Over');
      this.gameOver = true;
      const text = new PIXI.Text('Game Over', {
        fontFamily: 'Arial',
        fontSize: 200,
        fill: 0x000000,
        align: 'center',
      });
      text.pivot.x = text.width / 2;
      text.pivot.y = text.height / 2;
      text.x = BOARD_WIDTH / 2;
      text.y = BOARD_HEIGHT / 2 - 200;
      this.container.addChild(text);
    }
  }

  async drawInitial() {}
}
