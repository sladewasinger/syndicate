import * as PIXI from 'pixi.js';
import type { BoardCallbacks } from '../models/BoardCallbacks';
import { BOARD_HEIGHT, BOARD_WIDTH, TILE_HEIGHT } from '../models/BoardPositions';
import type { IClientGameData } from '../models/shared/IClientGameData';
import { GameDataHelpers } from '../Utils/GameDataHelpers';
import { RenderHelpers } from '../Utils/RenderHelpers';
import { ButtonRender } from './ButtonRender';
import type { RenderData } from './RenderData';

export class CreateTradeRender {
  container: PIXI.Container;
  gameData: IClientGameData | undefined;
  renderData: RenderData | undefined;
  selectedTileIds: string[] = [];
  requestMoneySlider: Slider | undefined;
  playerCheckboxes: Checkbox[] = [];
  giveMoneySlider: Slider | undefined;

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

    for (const tile of this.renderData.renderTiles) {
      const gameTile = this.gameData.tiles.find((t) => t.id === tile.tile.id);
      if (!gameTile) {
        continue;
      }
      if (
        gameTile.ownerId == undefined ||
        (gameTile.ownerId !== this.gameData.currentPlayer?.id &&
          gameTile.ownerId !== this.renderData.tradeTargetPlayerId)
      ) {
        tile.fade();
      } else {
        tile.container.interactive = true;
        tile.container.buttonMode = true;
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

    for (const checkbox of this.playerCheckboxes) {
      const player = this.gameData.players.find((p) => p.id === checkbox.id);
      if (!player) {
        continue;
      }
      checkbox.text.text = `${player.name} $${player.money}`;
    }

    const selectedCheckbox = this.playerCheckboxes.find((c) => c.checked);
    const selectedPlayer = this.gameData.players.find((p) => p.id === selectedCheckbox?.id);
    if (selectedCheckbox && selectedPlayer && this.requestMoneySlider) {
      this.giveMoneySlider?.enable();
      this.giveMoneySlider?.setMax(this.gameData.currentPlayer?.money || 0);

      this.requestMoneySlider?.enable();
      this.requestMoneySlider?.setMax(selectedPlayer.money);
    } else {
      this.requestMoneySlider?.disable();
      this.giveMoneySlider?.disable();
    }

    for (const id of this.selectedTileIds) {
      const tile = this.renderData.renderTiles.find((t) => t.tile.id === id);
      if (!tile) {
        continue;
      }
      RenderHelpers.highlight(tile);
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

    const tradeButton = new ButtonRender(
      this.container,
      'Trade',
      0xcccc00,
      () => {
        const checkedPlayer = this.playerCheckboxes.find((c) => c.checked);
        if (checkedPlayer) {
          this.callbacks.createTrade();
        }
      },
      0x000000
    );
    tradeButton.container.x = BOARD_WIDTH / 2 - tradeButton.container.width / 2;
    tradeButton.container.y = BOARD_HEIGHT - TILE_HEIGHT - 10 - tradeButton.container.height;

    this.container.visible = false;
  }
}

class Slider {
  container: PIXI.Container;
  value: number;
  width: number;
  dragging: boolean = false;
  label: PIXI.Text;
  moneyValue: PIXI.Text;

  constructor(
    public parentContainer: PIXI.Container,
    public labelText: string,
    public min: number,
    public max: number,
    public step: number
  ) {
    this.container = new PIXI.Container();
    this.value = min;

    this.width = this.parentContainer.width * 0.8;

    const label = new PIXI.Text(labelText, {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    this.container.addChild(label);
    this.label = label;

    const background = new PIXI.Graphics();
    background.lineStyle(2, 0x000000, 1);
    background.beginFill(0xffffff);
    background.drawRect(0, 0, this.width, 20);
    background.endFill();
    background.y = label.height + 5;
    this.container.addChild(background);

    const slider = new PIXI.Graphics();
    slider.lineStyle(2, 0x000000, 1);
    slider.beginFill(0x000000);
    slider.drawRect(0, 0, 10, 20);
    slider.endFill();
    slider.y = label.height + 5;
    this.container.addChild(slider);

    const moneyValue = new PIXI.Text('$0', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x000000,
      align: 'center',
    });
    moneyValue.x = background.width / 2 - moneyValue.width;
    moneyValue.y = 0;
    this.container.addChild(moneyValue);
    this.moneyValue = moneyValue;

    this.container.interactive = true;
    this.container.buttonMode = true;
    this.setMax(max);

    parentContainer.addChild(this.container);
  }

  setMax(max: number) {
    this.max = max;
    if (this.value > max) {
      this.setValue(max);
      this.setSliderPosition(this.value);
    }

    this.container.removeListener('pointerdown');
    this.container.on('pointerdown', (event: PIXI.InteractionEvent) => {
      this.dragging = true;
      this.setSliderPosition(event.data.getLocalPosition(this.container).x);
    });
    this.container.removeListener('pointerup');
    this.container.on('pointerup', (event: PIXI.InteractionEvent) => {
      this.dragging = false;
    });
    this.container.on('mousemove', (event: PIXI.InteractionEvent) => {
      if (this.dragging) {
        this.setSliderPosition(event.data.getLocalPosition(this.container).x);
      }
    });
    this.container.on('pointerupoutside', (event: PIXI.InteractionEvent) => {
      this.dragging = false;
    });
  }

  private setSliderPosition(x: number) {
    let value = Math.round((x / this.width) * (this.max - this.min) + this.min);
    value = Math.round(value / this.step) * this.step;
    value = Math.min(this.max, Math.max(this.min, value));
    this.setValue(value);
  }

  setValue(value: number) {
    this.value = value;
    this.moneyValue.text = `$${this.value}`;
    const slider = this.container.children[2] as PIXI.Graphics;
    slider.x = ((value - this.min) / (this.max - this.min)) * this.width;
  }

  getValue() {
    return this.value;
  }

  disable() {
    this.container.interactive = false;
    this.container.buttonMode = false;
    this.container.alpha = 0.5;
  }

  enable() {
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.alpha = 1;
  }
}

class Checkbox {
  container: PIXI.Container;
  checkbox = new PIXI.Graphics();
  checked: boolean = false;
  text: PIXI.Text;

  constructor(
    public id: string,
    public parentContainer: PIXI.Container,
    public label: string,
    public clickCallback: (checkbox: Checkbox) => void,
    public color: number = 0x000000
  ) {
    this.container = new PIXI.Container();
    this.parentContainer.addChild(this.container);

    const checkbox = new PIXI.Graphics();
    this.container.interactive = true;
    this.container.buttonMode = true;
    this.container.on('pointerdown', () => {
      this.checked = !this.checked;
      this.setChecked(this.checked);
      this.clickCallback(this);
    });
    this.container.addChild(checkbox);

    const text = new PIXI.Text(this.label, {
      fontFamily: 'Arial',
      fontSize: 38,
      stroke: 0x000000,
      strokeThickness: 4,
      letterSpacing: 2,
      fill: this.color,
      align: 'center',
    });
    text.x = 30;
    text.y = checkbox.height / 2 - text.height / 2;
    this.container.addChild(text);

    this.checkbox = checkbox;
    this.text = text;

    this.setChecked(false);
  }

  setChecked(checked: boolean) {
    this.checked = checked;
    if (this.checked) {
      this.checkbox.lineStyle(2, 0x000000, 1);
      this.checkbox.beginFill(0x000000);
      this.checkbox.drawCircle(7.5, 0, 15);
      this.checkbox.endFill();
    } else {
      this.checkbox.lineStyle(2, 0x000000, 1);
      this.checkbox.beginFill(0xffffff);
      this.checkbox.drawCircle(7.5, 0, 15);
      this.checkbox.endFill();
    }
  }
}
