import * as PIXI from 'pixi.js';
import type { BoardCallbacks } from '../models/BoardCallbacks';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { StateName } from '../models/shared/StateNames';
import { GameDataHelpers } from '../Utils/GameDataHelpers';
import { ButtonRender } from './ButtonRender';
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
  createTradeButton: ButtonRender | undefined;
  seeTradesButton: ButtonRender | undefined;
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
    // this.openTradesButtonn?.disable();
    this.seeTradesButton?.disable();
    this.bankruptcyButton?.disable();

    switch (gameData.state) {
      case StateName.TurnEnd:
        this.endTurnButton?.enable();
        this.createTradeButton?.enable();
        this.seeTradesButton?.enable();
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
    this.createTradeButton = new ButtonRender(this.container, 'Create Trade', 0xb14e00, this.callbacks.createTrade);
    this.createTradeButton.x = 800;

    this.seeTradesButton = new ButtonRender(this.container, 'Trades (0)', 0xb14e00, this.callbacks.openTrades);
    this.seeTradesButton.x = this.createTradeButton.x;
    this.seeTradesButton.y = this.createTradeButton.y + this.createTradeButton.height + 10;

    this.container.x = position.x - this.container.width / 2;
    this.container.y = position.y + 100;
  }
}
