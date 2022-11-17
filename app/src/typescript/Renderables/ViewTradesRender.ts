import * as PIXI from 'pixi.js';
import type { BoardCallbacks } from '../models/BoardCallbacks';
import { TILE_HEIGHT, BOARD_WIDTH, BOARD_HEIGHT } from '../models/BoardPositions';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { RenderHelpers } from '../Utils/RenderHelpers';
import { ButtonRender } from './ButtonRender';
import { Checkbox } from './Checkbox';
import type { RenderData } from './RenderData';

export class ViewTradesRender {
  container: PIXI.Container;
  playerCheckboxes: Checkbox[] = [];
  renderData: RenderData | undefined;
  gameData: IClientGameData | undefined;
  playerCheckboxesContainer: PIXI.Container = new PIXI.Container();
  youGiveTextLabel: PIXI.Text | undefined;
  youGetTextLabel: PIXI.Text | undefined;
  youGiveText: PIXI.Text | undefined;
  youGetText: PIXI.Text | undefined;
  acceptTradeButton: ButtonRender | undefined;
  selectedTradeId: string | undefined = undefined;

  constructor(public parentContainer: PIXI.Container, public callbacks: BoardCallbacks) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);
  }

  open() {
    if (!this.renderData || !this.gameData) {
      return;
    }

    this.container.visible = true;
    this.playerCheckboxesContainer.x = TILE_HEIGHT + 10;
    this.playerCheckboxesContainer.y = TILE_HEIGHT + 100;

    this.playerCheckboxes = [];
    const players = this.gameData.players
      .filter((p) => p.id !== this.gameData!.myId)
      .filter((p) => this.gameData?.tradeOffers.some((t) => t.authorPlayerId === p.id));
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const tradesForPlayer = this.gameData.tradeOffers.filter((t) => t.authorPlayerId === player.id);
      let text = `${player.name} $${player.money}`;
      if (tradesForPlayer.length > 0) {
        text += ' -> (1)';
      }
      const checkbox = new Checkbox(
        player.id,
        this.playerCheckboxesContainer,
        text,
        (checkbox: Checkbox) => {
          this.playerCheckboxes.filter((c) => c !== checkbox).forEach((c) => c.setChecked(false));
          if (!checkbox.checked) {
            this.resetViewTrade();
            this.selectedTradeId = undefined;
          }
        },
        player.color
      );
      checkbox.container.x = 0;
      checkbox.container.y = i * 50;
      this.playerCheckboxes.push(checkbox);
    }
    this.renderData.renderMode = 'viewTrade';
  }

  resetViewTrade() {
    if (!this.renderData || !this.gameData) {
      return;
    }
    for (const tile of this.renderData.renderTiles) {
      tile.unfade();
    }
    if (this.youGiveText && this.youGetText) {
      this.youGiveText.text = '';
      this.youGetText.text = '';
    }
  }

  close() {
    if (!this.renderData || !this.gameData) {
      return;
    }
    this.renderData.renderMode = 'game';

    this.container.visible = false;
    this.playerCheckboxes.forEach((c) => {
      this.playerCheckboxesContainer.removeChild(c.container);
      c.container.destroy();
    });

    for (const tile of this.renderData.renderTiles) {
      tile.unfade();
    }

    this.playerCheckboxes = [];

    this.resetViewTrade();
    this.playerCheckboxes.forEach((c) => {
      c.setChecked(false);
    });
  }

  update(gameData: IClientGameData, renderData: RenderData) {
    this.gameData = gameData;
    this.renderData = renderData;

    if (!this.youGetTextLabel || !this.youGiveTextLabel || !this.youGetText || !this.youGiveText) {
      return;
    }

    if (this.renderData.renderMode !== 'viewTrade') {
      return;
    }

    if (this.selectedTradeId != undefined) {
      this.acceptTradeButton?.enable();
    } else {
      this.acceptTradeButton?.disable();
    }

    const selectedCheckbox = this.playerCheckboxes.find((c) => c.checked);
    if (!selectedCheckbox) {
      return;
    }

    const selectedPlayer = this.gameData.players.find((p) => p.id === selectedCheckbox.id);
    if (!selectedPlayer) {
      return;
    }

    const trade = gameData.tradeOffers.find((t) => t.authorPlayerId == selectedPlayer.id);
    if (!trade) {
      return;
    }

    this.selectedTradeId = trade.id;

    this.youGiveTextLabel.y = this.playerCheckboxesContainer.y + this.playerCheckboxesContainer.height + 25;
    this.youGetTextLabel.y = this.youGiveTextLabel.y;
    this.youGiveText.y = this.youGiveTextLabel.y + 50;
    this.youGetText.y = this.youGetTextLabel.y + 50;

    this.youGiveText.text = `$${trade.targetOfferMoney}\n\n${trade.targetOfferProperties
      .map((p) => p.name)
      .join('\n')}`;
    this.youGetText.text = `$${trade.authorOfferMoney}\n\n${trade.authorOfferProperties.map((p) => p.name).join('\n')}`;

    for (const tile of this.renderData.renderTiles) {
      const gameTile = this.gameData.tiles.find((t) => t.id === tile.tile.id);
      if (!gameTile) {
        continue;
      }
      if (
        trade?.authorOfferProperties.map((t) => t.id).includes(tile.tile.id) ||
        trade?.targetOfferProperties.map((t) => t.id).includes(tile.tile.id)
      ) {
        tile.unfade();
        RenderHelpers.highlight(tile);
      } else {
        tile.fade();
      }
    }
  }

  async drawInitial() {
    const background = new PIXI.Graphics();
    background.lineStyle(8, 0x000000, 1);
    background.beginFill(0xffff99);
    background.drawRect(TILE_HEIGHT, TILE_HEIGHT, BOARD_WIDTH - TILE_HEIGHT * 2, BOARD_HEIGHT - TILE_HEIGHT * 2);
    background.endFill();
    this.container.addChild(background);

    const closeButton = new ButtonRender(this.container, 'Close', 0x000000, () => this.close());
    closeButton.x = TILE_HEIGHT + background.width - closeButton.width - 8;
    closeButton.y = TILE_HEIGHT;
    this.container.addChild(closeButton.container);

    const title = new PIXI.Text('View Trades', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0x000000,
      align: 'center',
    });
    title.x = TILE_HEIGHT + background.width / 2 - title.width / 2;
    title.y = TILE_HEIGHT + 8;
    this.container.addChild(title);

    const youGiveTextLabel = new PIXI.Text('You Give', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'left',
    });
    youGiveTextLabel.x = TILE_HEIGHT + 8;
    youGiveTextLabel.y = this.playerCheckboxesContainer.y + this.playerCheckboxesContainer.height + 25;
    this.container.addChild(youGiveTextLabel);
    this.youGiveTextLabel = youGiveTextLabel;

    const youGetTextLabel = new PIXI.Text('You Get', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'left',
    });
    youGetTextLabel.x = youGiveTextLabel.x + 700;
    youGetTextLabel.y = youGiveTextLabel.y;
    this.container.addChild(youGetTextLabel);
    this.youGetTextLabel = youGetTextLabel;

    this.youGiveText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'left',
    });
    this.youGiveText.x = youGiveTextLabel.x;
    this.youGiveText.y = youGiveTextLabel.y + 50;
    this.container.addChild(this.youGiveText);

    this.youGetText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'left',
    });
    this.youGetText.x = youGetTextLabel.x;
    this.youGetText.y = youGetTextLabel.y + 50;
    this.container.addChild(this.youGetText);

    this.container.addChild(this.playerCheckboxesContainer);

    this.acceptTradeButton = new ButtonRender(this.container, 'Accept Trade', 0x00aa00, () => {
      if (this.selectedTradeId) {
        console.log('Accept trade');
        this.callbacks.acceptTrade(this.selectedTradeId);
      } else {
        console.log('No trade selected');
      }
      this.close();
    });
    this.acceptTradeButton.x = TILE_HEIGHT + background.width / 2 - this.acceptTradeButton.width / 2;
    this.acceptTradeButton.y = TILE_HEIGHT + background.height - this.acceptTradeButton.height - 8;
    this.container.addChild(this.acceptTradeButton.container);

    this.container.visible = false;
  }
}
