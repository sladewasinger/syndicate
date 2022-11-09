import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import { AnimatedSprite } from 'pixi.js';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { StateName } from '../models/shared/StateNames';
import { getTransitionRawChildren } from 'vue';
import type { RenderData } from './RenderData';

export class DiceRender {
  container: PIXI.Container;
  static diceSpriteSheet: any;
  hoverAnimationInterval: number | undefined;
  rollAnimationInterval: number | undefined;
  dice1: AnimatedSprite | undefined;
  dice2: AnimatedSprite | undefined;

  constructor(public parentContainer: PIXI.Container, public rollDice: () => void) {
    this.container = new PIXI.Container();
  }

  update(gameData: IClientGameData, prevGameData: IClientGameData, renderData: RenderData) {
    if (gameData.state === StateName.RollDice) {
      this.dice1?.gotoAndStop(Math.random() * 6);
      this.dice2?.gotoAndStop(Math.random() * 6);
    } else {
      this.dice1?.gotoAndStop((gameData.dice[0] || 1) - 1);
      this.dice2?.gotoAndStop((gameData.dice[1] || 1) - 1);
    }
  }

  async drawInitial(gameData: IClientGameData, position: PIXI.Point) {
    if (!DiceRender.diceSpriteSheet) {
      DiceRender.diceSpriteSheet = await Assets.load('dice_sheet.json');
    }

    this.parentContainer.addChild(this.container);

    const diceContainer = new PIXI.Container();

    const dice1 = new AnimatedSprite(DiceRender.diceSpriteSheet.animations['roll']);
    dice1.gotoAndStop(gameData.dice[0] || 1 - 1);
    dice1.animationSpeed = 0.1;
    dice1.x = -dice1.width / 2 - 5;
    dice1.y = 0;
    this.dice1 = dice1;

    const dice2 = new AnimatedSprite(DiceRender.diceSpriteSheet.animations['roll']);
    dice2.gotoAndStop(gameData.dice[1] || 1 - 1);
    dice2.animationSpeed = 0.1;
    dice2.x = dice2.width / 2 + 5;
    dice2.y = 0;
    this.dice2 = dice2;

    diceContainer.addChild(dice1, dice2);
    diceContainer.pivot.x = diceContainer.width / 2;
    diceContainer.pivot.y = diceContainer.height / 2;
    diceContainer.x = position.x + diceContainer.width / 2;
    diceContainer.y = position.y + diceContainer.height / 2;
    diceContainer.interactive = true;
    diceContainer.buttonMode = true;

    diceContainer.on('mouseover', () => {
      this.hoverAnimationInterval = setInterval(() => {
        dice1.rotation += Math.PI * 0.1;
        dice2.rotation += Math.PI * 0.1;
      }, 50);
    });
    diceContainer.on('mouseout', () => {
      if (this.hoverAnimationInterval) {
        clearInterval(this.hoverAnimationInterval);
        dice1.rotation = 0;
        dice2.rotation = 0;
      }
    });

    diceContainer.on('click', () => {
      this.rollDice();
    });

    this.container.addChild(diceContainer);
  }
}
