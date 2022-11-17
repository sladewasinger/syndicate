import * as PIXI from 'pixi.js';
import type { BoardCallbacks } from '../models/BoardCallbacks';
import { BOARD_HEIGHT, BOARD_WIDTH, TILE_HEIGHT, TILE_WIDTH } from '../models/BoardPositions';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { ButtonRender } from './ButtonRender';
import { Slider } from './CreateTradeRender';
import type { RenderData } from './RenderData';
import { TileRenderUtils } from './tiles/TileRenderUtils';

export class AuctionBidRender {
  container: PIXI.Container;
  gameData: IClientGameData | undefined;
  renderData: RenderData | undefined;
  bidAmountSlider: Slider | undefined;
  dialogOpen: boolean = false;
  tileNameLabel: PIXI.Text | undefined;

  constructor(public parentContainer: PIXI.Container, public callbacks: BoardCallbacks) {
    this.container = new PIXI.Container();
    parentContainer.addChild(this.container);
  }

  async open() {
    this.dialogOpen = true;

    if (!this.gameData || !this.renderData) {
      return;
    }

    for (let i = 0; i < this.renderData.renderTiles.length; i++) {
      const gameTile = this.gameData.tiles[i];
      const renderTile = this.renderData.renderTiles[i];
      if (!gameTile || !renderTile) {
        continue;
      }

      if (i != this.gameData.currentPlayer.position) {
        TileRenderUtils.darken(renderTile.container);
      } else {
        TileRenderUtils.undarken(renderTile.container);
      }
    }

    this.renderData.renderMode = 'auctionBid';
    this.container.visible = true;
    const gameTile = this.gameData.tiles[this.gameData.currentPlayer.position];
    if (gameTile && gameTile.price) {
      this.bidAmountSlider?.setValue(Math.floor(gameTile.price / 2));
    }
  }

  async close() {
    this.dialogOpen = false;

    if (!this.gameData || !this.renderData) {
      return;
    }

    this.renderData.renderMode = 'game';
    this.container.visible = false;
  }

  async update(gameData: IClientGameData, prevGameData: IClientGameData, renderData: RenderData) {
    this.gameData = gameData;
    this.renderData = renderData;

    if (gameData.state !== 'AuctionProperty') {
      this.close();
      return;
    }

    const myPlayer = gameData.players.find((p) => p.id === gameData.myId);
    if (myPlayer) {
      this.bidAmountSlider?.setMax(myPlayer.money);

      const myAuctionParticipant = gameData.auctionParticipants.find((p) => p.id === gameData.myId);
      if (
        gameData.state == 'AuctionProperty' &&
        myAuctionParticipant &&
        !myAuctionParticipant.hasBid &&
        !this.dialogOpen
      ) {
        if (!myAuctionParticipant.hasBid) {
          this.open();
        } else {
          this.close();
        }
      }
    }

    const auctionTile = gameData.tiles[gameData.currentPlayer.position];
    if (auctionTile && this.tileNameLabel) {
      this.tileNameLabel.text = auctionTile.name;
    }
  }

  async drawInitial() {
    const background = new PIXI.Graphics();
    background.lineStyle(8, 0x000000, 1);
    background.beginFill(0xffff99);
    background.drawRect(0, 0, BOARD_WIDTH - TILE_HEIGHT * 2, TILE_WIDTH * 4);
    background.endFill();
    background.y = BOARD_HEIGHT - TILE_HEIGHT - TILE_WIDTH * 4;
    background.x = TILE_HEIGHT;
    this.container.addChild(background);

    const text = new PIXI.Text('Blind Auction - Place Your Bid', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0x000000,
      align: 'center',
    });
    text.x = BOARD_WIDTH / 2 - text.width / 2;
    text.y = background.y + 10;
    this.container.addChild(text);

    const tileName = new PIXI.Text('Tile Name', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    tileName.x = BOARD_WIDTH / 2 - tileName.width / 2;
    tileName.y = background.y + 60;
    this.tileNameLabel = tileName;
    this.container.addChild(tileName);

    const bidAmountSlider = new Slider(this.container, 'Bid:', 0, 9999, 5);
    bidAmountSlider.container.pivot.x = bidAmountSlider.width / 2;
    bidAmountSlider.container.x = BOARD_WIDTH / 2;
    bidAmountSlider.container.y = TILE_HEIGHT + 100;
    bidAmountSlider.container.y = text.y + text.height + 150;
    this.container.addChild(bidAmountSlider.container);
    this.bidAmountSlider = bidAmountSlider;

    const bidButton = new ButtonRender(
      this.container,
      'Bid',
      0x00dd00,
      () => {
        if (this.bidAmountSlider) {
          this.callbacks.auctionBid(this.bidAmountSlider.value);
          this.close();
        }
      },
      0x000000
    );
    bidButton.container.x = BOARD_WIDTH / 2 - bidButton.container.width / 2;
    bidButton.container.y = BOARD_HEIGHT - TILE_HEIGHT - 10 - bidButton.container.height;

    this.container.visible = false;
  }
}
