import * as PIXI from 'pixi.js';
import type { BoardCallbacks } from '../models/BoardCallbacks';
import { BOARD_HEIGHT, BOARD_WIDTH, TILE_HEIGHT } from '../models/BoardPositions';
import type { IClientGameData } from '../models/shared/IClientGameData';
import type { TradeOffer, TradeOfferProperty } from '../models/shared/TradeOffer';
import { GameDataHelpers } from '../Utils/GameDataHelpers';
import { RenderHelpers } from '../Utils/RenderHelpers';
import { ButtonRender } from './ButtonRender';
import { Checkbox } from './Checkbox';
import type { RenderData } from './RenderData';
import { Slider } from './Slider';

export class CreateTradeRender {
  container: PIXI.Container;
  gameData: IClientGameData | undefined;
  renderData: RenderData | undefined;
  selectedTileIds: string[] = [];
  requestMoneySlider: Slider | undefined;
  playerCheckboxes: Checkbox[] = [];
  giveMoneySlider: Slider | undefined;
  youGiveTilesText: PIXI.Text | undefined;
  youGetTilesText: PIXI.Text | undefined;
  tradeButton: ButtonRender | undefined;
  alreadyCreatedTradeText: PIXI.Text | undefined;
  cancelTradeButton: ButtonRender | undefined;

  constructor(public parentContainer: PIXI.Container, public callbacks: BoardCallbacks) {
    this.container = new PIXI.Container();
    parentContainer.addChild(this.container);
  }

  async open() {
    if (!this.gameData || !this.renderData) {
      return;
    }

    this.renderData.renderMode = 'createTrade';
    this.container.visible = true;
  }

  close() {
    if (!this.gameData || !this.renderData) {
      return;
    }

    this.renderData.renderMode = 'game';
    this.container.visible = false;
    for (const tile of this.renderData.renderTiles) {
      tile.unfade();
      tile.container.interactive = false;
      tile.container.buttonMode = false;
      tile.container.removeListener('pointerdown');
    }

    this.selectedTileIds = [];
  }

  async update(gameData: IClientGameData, renderData: RenderData) {
    this.gameData = gameData;
    this.renderData = renderData;
    if (this.renderData.renderMode !== 'createTrade') {
      return;
    }

    for (const tile of this.renderData.renderTiles) {
      const gameTile = this.gameData.tiles.find((t) => t.id === tile.tile.id);
      if (!gameTile) {
        continue;
      }
      if (
        gameTile.ownerId == undefined ||
        (gameTile.ownerId !== this.gameData.myId && gameTile.ownerId !== this.renderData.tradeTargetPlayerId)
      ) {
        tile.fade();
      } else {
        tile.container.interactive = true;
        tile.container.buttonMode = true;
        tile.unfade();
        tile.container.removeListener('pointerdown');
        tile.container.on('pointerdown', () => {
          console.log('tile clicked');
          if (this.selectedTileIds.includes(tile.tile.id)) {
            this.selectedTileIds = this.selectedTileIds.filter((id) => id !== tile.tile.id);
            RenderHelpers.unhighlight(tile);
          } else {
            this.selectedTileIds.push(tile.tile.id);
          }
        });
      }
    }

    for (const checkbox of this.playerCheckboxes) {
      const player = this.gameData.players.find((p) => p.id === checkbox.id);
      if (!player) {
        continue;
      }
      checkbox.text.text = `${player.name} $${player.money}`;
    }

    const selectedCheckbox = this.playerCheckboxes.find((c) => c.checked);
    const selectedPlayer = this.gameData.players.find((p) => p.id === selectedCheckbox?.id);
    const alreadyHasTrade = this.gameData.tradeOffers.some((t) => t.authorPlayerId === gameData?.myId);
    if (selectedCheckbox && selectedPlayer && this.requestMoneySlider && !alreadyHasTrade) {
      this.tradeButton?.enable();

      this.renderData.tradeTargetPlayerId = selectedPlayer.id;

      this.giveMoneySlider?.enable();
      this.giveMoneySlider?.setMax(this.gameData.currentPlayer?.money || 0);

      this.requestMoneySlider?.enable();
      this.requestMoneySlider?.setMax(selectedPlayer.money);
    } else {
      this.requestMoneySlider?.disable();
      this.giveMoneySlider?.disable();
      this.tradeButton?.disable();
    }

    if (this.alreadyCreatedTradeText && this.cancelTradeButton) {
      if (alreadyHasTrade) {
        this.alreadyCreatedTradeText.visible = true;
        this.cancelTradeButton?.enable();
        this.cancelTradeButton.container.visible = true;
      } else {
        this.alreadyCreatedTradeText.visible = false;
        this.cancelTradeButton.container.visible = false;
      }
    }

    for (const id of this.selectedTileIds) {
      const tile = this.renderData.renderTiles.find((t) => t.tile.id === id);
      if (!tile) {
        continue;
      }
      RenderHelpers.highlight(tile);
    }

    if (this.youGiveTilesText && this.youGetTilesText) {
      const giveTiles = this.gameData.tiles
        .filter((t) => this.selectedTileIds.includes(t.id))
        .filter((t) => t.ownerId === this.gameData?.myId);
      this.youGiveTilesText.text = giveTiles.map((t) => `>${t.name}`).join('\n');

      const getTiles = this.gameData.tiles
        .filter((t) => this.selectedTileIds.includes(t.id))
        .filter((t) => t.ownerId === this.renderData?.tradeTargetPlayerId);
      this.youGetTilesText.text = getTiles.map((t) => `>${t.name}`).join('\n');
    }
  }

  async drawInitial(gameData: IClientGameData, renderData: RenderData) {
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

    const text = new PIXI.Text('Create Trade', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0x000000,
      align: 'center',
    });
    text.x = BOARD_WIDTH / 2 - text.width / 2;
    text.y = TILE_HEIGHT + 10;
    this.container.addChild(text);

    const playerCheckboxesContainer = new PIXI.Container();
    playerCheckboxesContainer.x = TILE_HEIGHT + 10;
    playerCheckboxesContainer.y = TILE_HEIGHT + 100;
    this.container.addChild(playerCheckboxesContainer);

    this.playerCheckboxes = [];
    const players = gameData.players.filter((p) => p.id !== gameData.myId);
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const checkbox = new Checkbox(
        player.id,
        playerCheckboxesContainer,
        `${player.name} $${player.money}`,
        (checkbox: Checkbox) => {
          this.playerCheckboxes.filter((c) => c !== checkbox).forEach((c) => c.setChecked(false));
          this.selectedTileIds = [];
          // this.requestMoneySlider?.setValue(0);
        },
        player.color
      );
      checkbox.container.x = 0;
      checkbox.container.y = i * 50;
      this.playerCheckboxes.push(checkbox);
    }

    const requestMoneySlider = new Slider(this.container, 'Request Money:', 0, 9999, 5);
    requestMoneySlider.container.pivot.x = requestMoneySlider.width / 2;
    requestMoneySlider.container.x = BOARD_WIDTH / 2;
    requestMoneySlider.container.y = TILE_HEIGHT + 100 + this.playerCheckboxes.length * 50 + 10;
    this.container.addChild(requestMoneySlider.container);
    this.requestMoneySlider = requestMoneySlider;

    const giveMoneySlider = new Slider(this.container, 'Give Money:', 0, gameData.currentPlayer?.money || 1500, 5);
    giveMoneySlider.container.pivot.x = giveMoneySlider.width / 2;
    giveMoneySlider.container.x = BOARD_WIDTH / 2;
    giveMoneySlider.container.y = requestMoneySlider.container.y + requestMoneySlider.container.height + 50;
    this.container.addChild(giveMoneySlider.container);
    this.giveMoneySlider = giveMoneySlider;

    const youGiveTilesLabel = new PIXI.Text('You Give:', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    youGiveTilesLabel.x = TILE_HEIGHT + 10;
    youGiveTilesLabel.y = giveMoneySlider.container.y + giveMoneySlider.container.height + 50;
    this.container.addChild(youGiveTilesLabel);

    const youGetTilesLabel = new PIXI.Text('You Get:', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    youGetTilesLabel.x = BOARD_WIDTH - TILE_HEIGHT - 500 - youGetTilesLabel.width;
    youGetTilesLabel.y = giveMoneySlider.container.y + giveMoneySlider.container.height + 50;
    this.container.addChild(youGetTilesLabel);

    const youGiveTilesText = new PIXI.Text('', {
      fontFamily: 'monospace',
      fontSize: 30,
      fill: 0x000000,
      align: 'left',
    });
    youGiveTilesText.x = youGiveTilesLabel.x;
    youGiveTilesText.y = youGiveTilesLabel.y + youGiveTilesLabel.height + 10;
    this.container.addChild(youGiveTilesText);
    this.youGiveTilesText = youGiveTilesText;

    const youGetTilesText = new PIXI.Text('', {
      fontFamily: 'monospace',
      fontSize: 30,
      fill: 0x000000,
      align: 'left',
    });
    youGetTilesText.x = youGetTilesLabel.x;
    youGetTilesText.y = youGetTilesLabel.y + youGetTilesLabel.height + 10;
    this.container.addChild(youGetTilesText);
    this.youGetTilesText = youGetTilesText;

    const alreadyCreatedTradeText = new PIXI.Text('You already have a trade in progress.', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    alreadyCreatedTradeText.x = BOARD_WIDTH / 2 - alreadyCreatedTradeText.width / 2;
    alreadyCreatedTradeText.y = youGiveTilesText.y + youGiveTilesText.height + 50;
    this.container.addChild(alreadyCreatedTradeText);
    this.alreadyCreatedTradeText = alreadyCreatedTradeText;

    const cancelTradeButton = new ButtonRender(this.container, 'Cancel Trade', 0x000000, () => {
      const myTrade = this.gameData?.tradeOffers.find((t) => t.authorPlayerId === gameData.myId);
      if (myTrade) {
        this.callbacks.cancelTrade(myTrade.id);
      }
    });
    cancelTradeButton.x = BOARD_WIDTH / 2 - cancelTradeButton.width / 2;
    cancelTradeButton.y = alreadyCreatedTradeText.y + alreadyCreatedTradeText.height + 10;
    this.container.addChild(cancelTradeButton.container);
    this.cancelTradeButton = cancelTradeButton;

    const tradeButton = new ButtonRender(
      this.container,
      'Trade',
      0xcccc00,
      () => {
        const checkedPlayer = this.playerCheckboxes.find((c) => c.checked);
        if (checkedPlayer && this.gameData) {
          const authorOwnedSelectedTiles = this.gameData.tiles
            .filter((t) => this.selectedTileIds.includes(t.id))
            .filter((t) => t.ownerId === this.gameData!.myId);
          const targetOwnedSelectedTiles = this.gameData.tiles
            .filter((t) => this.selectedTileIds.includes(t.id))
            .filter((t) => t.ownerId === checkedPlayer.id);

          const tradeOffer = <TradeOffer>{
            id: '',
            authorPlayerId: gameData.myId,
            targetPlayerId: checkedPlayer.id,
            authorOfferMoney: this.giveMoneySlider?.value || 0,
            targetOfferMoney: this.requestMoneySlider?.value || 0,
            authorOfferProperties: authorOwnedSelectedTiles.map(
              (t) => <TradeOfferProperty>{ id: t.id, name: t.name, color: t.color }
            ),
            targetOfferProperties: targetOwnedSelectedTiles.map(
              (t) => <TradeOfferProperty>{ id: t.id, name: t.name, color: t.color }
            ),
          };
          this.callbacks.createTrade(tradeOffer);
          this.close();
        }
      },
      0x000000
    );
    tradeButton.container.x = BOARD_WIDTH / 2 - tradeButton.container.width / 2;
    tradeButton.container.y = BOARD_HEIGHT - TILE_HEIGHT - 10 - tradeButton.container.height;
    this.tradeButton = tradeButton;

    this.container.visible = false;
  }
}
