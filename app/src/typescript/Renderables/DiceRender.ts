import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import { AnimatedSprite, type PixelExtractOptions } from 'pixi.js';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { StateName } from '../models/shared/StateNames';
import type { RenderData } from './RenderData';
import { Textures } from './Textures';

export class DiceRender {
  container: PIXI.Container;
  static diceSpriteSheet: any;
  hoverAnimationInterval: number | undefined;
  rollAnimationInterval: number | undefined;
  dice1: AnimatedSprite | undefined;
  dice2: AnimatedSprite | undefined;
  diceContainer: PIXI.Container | undefined;
  arrow: PIXI.Sprite | undefined;

  constructor(public parentContainer: PIXI.Container, public rollDice: () => void) {
    this.container = new PIXI.Container();
  }

  update(gameData: IClientGameData, prevGameData: IClientGameData, renderData: RenderData) {
    this.disableDice();
    if (gameData.state === StateName.PreDiceRoll && gameData.currentPlayer?.id === gameData.myId) {
      this.enableDice();
    }

    if (gameData.state === StateName.RollDice) {
      this.dice1?.gotoAndStop(Math.random() * 6);
      this.dice2?.gotoAndStop(Math.random() * 6);
    } else {
      this.dice1?.gotoAndStop((gameData.dice[0] || 1) - 1);
      this.dice2?.gotoAndStop((gameData.dice[1] || 1) - 1);
    }

    if (this.diceContainer && this.arrow) {
      this.arrow.x = this.diceContainer.x + this.diceContainer.width / 2 + 25 + Math.cos(renderData.frame * 0.07) * 25;
    }
  }

  disableDice() {
    if (!this.diceContainer || !this.arrow) {
      return;
    }
    this.arrow.visible = false;

    this.diceContainer.buttonMode = false;
    this.diceContainer.interactive = false;
    this.diceContainer.filters = [new PIXI.filters.AlphaFilter(0.5)];
  }

  enableDice() {
    if (!this.diceContainer || !this.arrow) {
      return;
    }
    this.arrow.visible = true;

    this.diceContainer.buttonMode = true;
    this.diceContainer.interactive = true;
    this.diceContainer.filters = [];
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

    // diceContainer.on('mouseover', () => {
    //   this.hoverAnimationInterval = setInterval(() => {
    //     dice1.rotation += Math.PI * 0.1;
    //     dice2.rotation += Math.PI * 0.1;
    //   }, 50);
    // });
    // diceContainer.on('mouseout', () => {
    //   if (this.hoverAnimationInterval) {
    //     clearInterval(this.hoverAnimationInterval);
    //     dice1.rotation = 0;
    //     dice2.rotation = 0;
    //   }
    // });

    diceContainer.on('click', () => {
      this.rollDice();
    });

    this.diceContainer = diceContainer;

    this.arrow = new PIXI.Sprite(Textures.arrowTexture);
    this.arrow.anchor.set(0.5, 0.5);
    this.arrow.x = diceContainer.x + diceContainer.width / 2;
    this.arrow.y = diceContainer.y - diceContainer.height / 2;

    this.container.addChild(diceContainer, this.arrow);
  }
}
