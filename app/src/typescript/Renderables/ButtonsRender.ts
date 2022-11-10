import * as PIXI from 'pixi.js';
import type { BoardCallbacks } from '../models/BoardCallbacks';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { StateName } from '../models/shared/StateNames';
import { GameDataHelpers } from '../Utils/GameDataHelpers';
import type { RenderData } from './RenderData';

// export interface ButtonCallbacks {
//   endTurn: () => void;
//   buyProperty(): void;
//   auctionProperty(): void;
//   mortgageProperty(tileId: number): void;
//   unmortgageProperty(tileId: number): void;
//   openTrades(): void;
//   createTrade(): void;
//   declareBankruptcy(): void;
// }

export class ButtonsRender {
  container: PIXI.Container;
  endTurnButton: ButtonRender | undefined;
  buyPropertyButton: ButtonRender | undefined;
  auctionPropertyButton: ButtonRender | undefined;
  mortgageButton: ButtonRender | undefined;
  unmortgageButton: ButtonRender | undefined;
  buyBuildingButton: ButtonRender | undefined;
  sellBuildingButton: ButtonRender | undefined;
  openTradesButtonn: ButtonRender | undefined;
  createTradeButton: ButtonRender | undefined;
  bankruptcyButton: ButtonRender | undefined;

  constructor(public parentContainer: PIXI.Container, public callbacks: BoardCallbacks) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);
  }

  update(gameData: IClientGameData, prevGameData: IClientGameData, renderData: RenderData) {
    this.endTurnButton?.disable();
    this.buyPropertyButton?.disable();
    this.auctionPropertyButton?.disable();
    this.mortgageButton?.disable();
    this.unmortgageButton?.disable();
    this.buyBuildingButton?.disable();
    this.sellBuildingButton?.disable();
    this.openTradesButtonn?.disable();
    this.createTradeButton?.disable();
    this.bankruptcyButton?.disable();

    switch (gameData.state) {
      case StateName.TurnEnd:
        this.endTurnButton?.enable();
        this.openTradesButtonn?.enable();
        this.createTradeButton?.enable();
        if (GameDataHelpers.playerCanMortgage(gameData.currentPlayer!, gameData)) {
          this.mortgageButton?.enable();
        }
        break;
      case StateName.LandedOnTile:
        this.buyPropertyButton?.enable();
        this.auctionPropertyButton?.enable();
        break;
    }
  }

  async drawInitial(gameData: IClientGameData, position: PIXI.Point) {
    // Column 1:
    this.endTurnButton = new ButtonRender(this.container, 'End Turn', 0x8b4513, this.callbacks.endTurn);

    this.bankruptcyButton = new ButtonRender(
      this.container,
      'Declare Bankruptcy',
      0xff0000,
      this.callbacks.declareBankruptcy
    );
    this.bankruptcyButton.y = this.endTurnButton.y + this.endTurnButton.height + 10;

    // Column 2:
    this.buyPropertyButton = new ButtonRender(this.container, 'Buy Property', 0x00aa00, this.callbacks.buyProperty);
    this.buyPropertyButton.x = 200;

    this.auctionPropertyButton = new ButtonRender(
      this.container,
      'Auction Property',
      0x0000aa,
      this.callbacks.auctionProperty
    );
    this.auctionPropertyButton.x = this.buyPropertyButton.x;
    this.auctionPropertyButton.y = this.buyPropertyButton.height + 10;

    // Column 3:
    this.mortgageButton = new ButtonRender(this.container, 'Mortgage', 0x67bd00, () => {
      this.callbacks.mortgageProperty(gameData.currentPlayer!.position);
    });
    this.mortgageButton.x = 400;

    this.unmortgageButton = new ButtonRender(this.container, 'Buy Back', 0xbb9700, () => {
      this.callbacks.unmortgageProperty(gameData.currentPlayer!.position);
    });
    this.unmortgageButton.x = this.mortgageButton.x;
    this.unmortgageButton.y = this.mortgageButton.y + this.mortgageButton.height + 10;

    // Column 4:
    this.buyBuildingButton = new ButtonRender(this.container, 'Buy Building', 0xbb9700, () => {
      this.callbacks.buyBuilding(gameData.currentPlayer!.position);
    });
    this.buyBuildingButton.x = 600;
    this.buyBuildingButton.y = 0;

    this.sellBuildingButton = new ButtonRender(this.container, 'Sell Building', 0x67bd00, () => {
      this.callbacks.sellBuilding(gameData.currentPlayer!.position);
    });
    this.sellBuildingButton.x = this.buyBuildingButton.x;
    this.sellBuildingButton.y = this.buyBuildingButton.y + this.buyBuildingButton.height + 10;

    // Column 5:
    this.openTradesButtonn = new ButtonRender(this.container, 'Open Trades', 0xb14e00, this.callbacks.openTrades);
    this.openTradesButtonn.x = 800;

    this.createTradeButton = new ButtonRender(this.container, 'Trades (0)', 0xb14e00, this.callbacks.createTrade);
    this.createTradeButton.x = this.openTradesButtonn.x;
    this.createTradeButton.y = this.openTradesButtonn.y + this.openTradesButtonn.height + 10;

    this.container.x = position.x - this.container.width / 2;
    this.container.y = position.y + 100;
  }
}

export class ButtonRender {
  container: PIXI.Container;

  constructor(
    public parentContainer: PIXI.Container,
    public text: string,
    public color: number,
    public callback: () => void
  ) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);

    const button = new PIXI.Graphics();
    button.beginFill(this.color);
    button.lineStyle(2, 0x000000);
    button.drawRoundedRect(0, 0, 150, 100, 10);
    button.endFill();

    let fontSize = 34;
    if (this.text.split(' ').some((word) => word.length > 8)) {
      fontSize = 28;
    }
    const buttonText = new PIXI.Text(this.text, {
      fontFamily: 'Arial',
      fontSize: fontSize,
      wordWrap: true,
      wordWrapWidth: button.width,
      fill: 0xffffff,
      align: 'center',
    });
    buttonText.x = button.width / 2 - buttonText.width / 2;
    buttonText.y = button.height / 2 - buttonText.height / 2;

    this.container.addChild(button, buttonText);
    this.container.buttonMode = true;
    this.container.interactive = true;
    this.container.on('pointerup', this.callback);
  }

  get x() {
    return this.container.x;
  }

  set x(value) {
    this.container.x = value;
  }

  get y() {
    return this.container.y;
  }

  set y(value) {
    this.container.y = value;
  }

  get width() {
    return this.container.width;
  }

  set width(value) {
    this.container.width = value;
  }

  get height() {
    return this.container.height;
  }

  set height(value) {
    this.container.height = value;
  }

  disable() {
    const darkenFilter = new PIXI.filters.ColorMatrixFilter();
    darkenFilter.matrix = [0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 1, 0];

    this.container.filters = [new PIXI.filters.BlurFilter(2), darkenFilter];
    this.container.interactive = false;
    this.container.buttonMode = false;
  }

  enable() {
    this.container.filters = [];
    this.container.interactive = true;
    this.container.buttonMode = true;
  }
}
