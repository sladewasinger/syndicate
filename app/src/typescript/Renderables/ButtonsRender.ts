import * as PIXI from 'pixi.js';
import type { BoardCallbacks } from '../models/BoardCallbacks';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { StateName } from '../models/shared/StateNames';
import { GameDataHelpers } from '../Utils/GameDataHelpers';
import { ButtonRender } from './ButtonRender';
import type { RenderData } from './RenderData';

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
  buttons: ButtonRender[] = [];
  gameData: IClientGameData | undefined;
  renderData: RenderData | undefined;

  constructor(public parentContainer: PIXI.Container, public callbacks: BoardCallbacks) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);
  }

  disableAllButtonsExcept(button: ButtonRender) {
    this.buttons.forEach((b) => {
      if (b !== button) {
        b.disable();
      }
    });
  }

  update(gameData: IClientGameData, prevGameData: IClientGameData, renderData: RenderData) {
    this.gameData = gameData;
    this.renderData = renderData;

    this.endTurnButton?.disable();
    this.buyPropertyButton?.disable();
    this.auctionPropertyButton?.disable();
    this.mortgageButton?.disable();
    this.unmortgageButton?.disable();
    this.buyBuildingButton?.disable();
    this.sellBuildingButton?.disable();
    this.createTradeButton?.disable();
    this.seeTradesButton?.disable();
    this.bankruptcyButton?.disable();

    if (gameData.myId === gameData.currentPlayer.id) {
      switch (gameData.state) {
        case StateName.TurnEnd:
          if (renderData.renderMode == 'game') {
            if (gameData.currentPlayer.id == gameData.myId) {
              this.endTurnButton?.enable();
            }
            this.createTradeButton?.enable();
            if (GameDataHelpers.playerCanMortgage(gameData.currentPlayer!, gameData)) {
              this.mortgageButton?.enable();
            }
            if (GameDataHelpers.playerCanUnmortgage(gameData.currentPlayer!, gameData)) {
              this.unmortgageButton?.enable();
            }
            if (GameDataHelpers.playerCanBuyBuilding(gameData.currentPlayer!, gameData)) {
              this.buyBuildingButton?.enable();
            }
            if (GameDataHelpers.playerCanSellBuilding(gameData.currentPlayer!, gameData)) {
              this.sellBuildingButton?.enable();
            }
          } else if (renderData.renderMode == 'buyBuilding') {
            this.buyBuildingButton?.enable();
          } else if (renderData.renderMode == 'sellBuilding') {
            this.sellBuildingButton?.enable();
          } else if (renderData.renderMode == 'mortgage') {
            this.mortgageButton?.enable();
          } else if (renderData.renderMode == 'unmortgage') {
            this.unmortgageButton?.enable();
          }
          break;
        case StateName.LandedOnTile:
          this.buyPropertyButton?.enable();
          this.auctionPropertyButton?.enable();
          break;
      }
    }

    if (this.seeTradesButton) {
      const myTrades = gameData.tradeOffers.filter((trade) => trade.targetPlayerId === gameData.myId);
      this.seeTradesButton!.buttonText.text = `Trades (${myTrades.length})`;
      if (myTrades.length > 0 && renderData.renderMode == 'game') {
        this.seeTradesButton.enable();
      }
    }

    switch (renderData.renderMode) {
      case 'buyBuilding':
        this.buyBuildingMode();
        break;
      case 'sellBuilding':
        this.sellBuildingMode();
        break;
      case 'mortgage':
        this.mortgageMode();
        break;
      case 'unmortgage':
        this.unmortgageMode();
        break;
      case 'game':
        for (let i = 0; i < this.renderData.renderTiles.length; i++) {
          this.renderData.renderTiles[i].container.buttonMode = false;
          this.renderData.renderTiles[i].container.off('pointerdown');
          this.renderData.renderTiles[i].unfade();
        }
        break;
    }
  }

  buyBuildingMode() {
    if (!this.gameData || !this.renderData) {
      return;
    }

    for (let i = 0; i < this.renderData.renderTiles.length; i++) {
      const tile = this.renderData.renderTiles[i];
      const gameTile = this.gameData.tiles.find((t) => t.id === tile.tile.id);
      if (!gameTile) {
        continue;
      }
      if (
        gameTile.buildingCount !== undefined &&
        gameTile.ownerId === this.gameData.myId &&
        gameTile.buildingCount < 5
      ) {
        tile.container.buttonMode = true;
        tile.container.on('pointerdown', () => {
          this.callbacks.buyBuilding(i);
        });
        tile.unfade();
      } else {
        tile.container.buttonMode = false;
        tile.container.off('pointerdown');
        tile.fade();
      }
    }
  }

  sellBuildingMode() {
    if (!this.gameData || !this.renderData) {
      return;
    }

    for (let i = 0; i < this.renderData.renderTiles.length; i++) {
      const tile = this.renderData.renderTiles[i];
      const gameTile = this.gameData.tiles.find((t) => t.id === tile.tile.id);
      if (!gameTile) {
        continue;
      }
      if ((gameTile.ownerId === this.gameData.myId && gameTile.buildingCount) || 0 > 0) {
        tile.container.buttonMode = true;
        tile.container.off('pointerdown');
        tile.container.on('pointerdown', () => {
          this.callbacks.sellBuilding(i);
        });
        tile.unfade();
      } else {
        tile.container.buttonMode = false;
        tile.container.off('pointerdown');
        tile.fade();
      }
    }
  }

  mortgageMode() {
    if (!this.gameData || !this.renderData) {
      return;
    }

    for (let i = 0; i < this.renderData.renderTiles.length; i++) {
      const tile = this.renderData.renderTiles[i];
      const gameTile = this.gameData.tiles.find((t) => t.id === tile.tile.id);
      if (!gameTile) {
        continue;
      }
      if (gameTile.ownerId === this.gameData.myId && !gameTile.mortgaged) {
        tile.container.buttonMode = true;
        tile.container.off('pointerdown');
        tile.container.on('pointerdown', () => {
          this.callbacks.mortgageProperty(i);
        });
        tile.unfade();
      } else {
        tile.container.buttonMode = false;
        tile.container.off('pointerdown');
        tile.fade();
      }
    }
  }

  unmortgageMode() {
    if (!this.gameData || !this.renderData) {
      return;
    }

    for (let i = 0; i < this.renderData.renderTiles.length; i++) {
      const tile = this.renderData.renderTiles[i];
      const gameTile = this.gameData.tiles.find((t) => t.id === tile.tile.id);
      if (!gameTile) {
        continue;
      }
      if (gameTile.ownerId === this.gameData.myId && gameTile.mortgaged) {
        tile.container.buttonMode = true;
        tile.container.off('pointerdown');
        tile.container.on('pointerdown', () => {
          this.callbacks.unmortgageProperty(i);
        });
        tile.unfade();
      } else {
        tile.container.buttonMode = false;
        tile.container.off('pointerdown');
        tile.fade();
      }
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
      if (!this.renderData) {
        return;
      }
      if (this.renderData.renderMode === 'mortgage') {
        this.renderData.renderMode = 'game';
      } else {
        this.renderData.renderMode = 'mortgage';
      }
    });
    this.mortgageButton.x = 400;

    this.unmortgageButton = new ButtonRender(this.container, 'Buy Back', 0xbb9700, () => {
      if (!this.renderData) {
        return;
      }
      if (this.renderData.renderMode === 'unmortgage') {
        this.renderData.renderMode = 'game';
      } else {
        this.renderData.renderMode = 'unmortgage';
      }
    });
    this.unmortgageButton.x = this.mortgageButton.x;
    this.unmortgageButton.y = this.mortgageButton.y + this.mortgageButton.height + 10;

    // Column 4:
    this.buyBuildingButton = new ButtonRender(this.container, 'Buy Building', 0xbb9700, () => {
      if (this.renderData) {
        if (this.renderData.renderMode === 'buyBuilding') {
          this.renderData.renderMode = 'game';
        } else {
          this.renderData.renderMode = 'buyBuilding';
        }
      }
    });
    this.buyBuildingButton.x = 600;
    this.buyBuildingButton.y = 0;

    this.sellBuildingButton = new ButtonRender(this.container, 'Sell Building', 0x67bd00, () => {
      if (this.renderData) {
        if (this.renderData.renderMode === 'sellBuilding') {
          this.renderData.renderMode = 'game';
        } else {
          this.renderData.renderMode = 'sellBuilding';
        }
      }
    });
    this.sellBuildingButton.x = this.buyBuildingButton.x;
    this.sellBuildingButton.y = this.buyBuildingButton.y + this.buyBuildingButton.height + 10;

    // Column 5:
    this.createTradeButton = new ButtonRender(this.container, 'Create Trade', 0xb14e00, this.callbacks.openCreateTrade);
    this.createTradeButton.x = 800;

    this.seeTradesButton = new ButtonRender(this.container, 'Trades (0)', 0xb14e00, this.callbacks.openTrades);
    this.seeTradesButton.x = this.createTradeButton.x;
    this.seeTradesButton.y = this.createTradeButton.y + this.createTradeButton.height + 10;

    this.container.x = position.x - this.container.width / 2;
    this.container.y = position.y + 100;
  }
}
