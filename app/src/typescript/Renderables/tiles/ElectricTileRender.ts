import { TILE_WIDTH, TILE_HEIGHT, BOARD_HEIGHT, BOARD_WIDTH } from '@/typescript/models/BoardPositions';
import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import type { IClientTile } from '@/typescript/models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs, TileMode } from './ITileRender';
import { TileRenderUtils } from './TileRenderUtils';
import { Textures } from '../Textures';

export class ElectricTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  container: PIXI.Container;
  static electricTexture: any;
  tileBackground: PIXI.Graphics | undefined;
  gameData: IClientGameData | undefined;
  renderData: RenderData | undefined;
  mortgagedSymbol: PIXI.Sprite | undefined;
  mode: TileMode = 'normal';
  infoCardContainer: PIXI.Container | undefined;

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  update(gameData: IClientGameData, renderData: RenderData) {
    this.gameData = gameData;
    this.renderData = renderData;

    const gameTile = gameData.tiles.find((t) => t.id === this.tile.id);
    if (gameTile === undefined) {
      throw new Error(`Tile with id '${this.tile.id}' not found`);
    }
    const owner = gameData.players.find((p) => p.id === gameTile.ownerId);
    if (owner) {
      this.tileBackground?.clear();
      this.tileBackground?.lineStyle(2, 0x000000, 1);
      this.tileBackground?.beginFill(owner.color, 1);
      this.tileBackground?.drawRect(0, 0, this.width, this.height);
      this.tileBackground?.endFill();
    } else {
      this.tileBackground?.clear();
      this.tileBackground?.lineStyle(2, 0x000000, 1);
      this.tileBackground?.beginFill(0xffffff, 1);
      this.tileBackground?.drawRect(0, 0, this.width, this.height);
      this.tileBackground?.endFill();
    }

    if (this.mortgagedSymbol) {
      if (gameTile.mortgaged) {
        this.mortgagedSymbol.visible = true;
      } else {
        this.mortgagedSymbol.visible = false;
      }
    }
  }

  async drawInitial(args: ITileRenderArgs, parentContainer: PIXI.Container) {
    if (!ElectricTileRender.electricTexture) {
      ElectricTileRender.electricTexture = await Assets.load('electric.png');
    }

    const tileBackground = new PIXI.Graphics();
    tileBackground.lineStyle(2, 0x000000, 1);
    tileBackground.beginFill(0xffffff, 1);
    tileBackground.drawRect(0, 0, this.width, this.height);
    tileBackground.endFill();
    this.tileBackground = tileBackground;

    const price = new PIXI.Text(`$${this.tile.price}`, {
      fill: 0x000000,
      fontSize: this.height * 0.14,
    });
    price.pivot.x = price.width / 2;
    price.x = this.width / 2;
    price.y = this.height - price.height;

    // pixi sprite from texture
    const electricIcon = new PIXI.Sprite(ElectricTileRender.electricTexture);
    const scale = Math.min(this.width / electricIcon.width, this.height / electricIcon.height) * 0.6;
    electricIcon.scale = new PIXI.Point(scale, scale);
    electricIcon.x = (this.width - electricIcon.width) / 2;
    electricIcon.y = this.height - electricIcon.height - price.height - 5;

    const tileText = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      fontSize: this.height * 0.12,
      wordWrap: true,
      wordWrapWidth: this.width * 0.9,
      align: 'center',
    });
    tileText.pivot.x = tileText.width / 2;
    tileText.pivot.y = tileText.height / 2;
    tileText.x = this.width / 2;
    tileText.y = this.height * 0.2;

    const mortgagedSymbol = new PIXI.Sprite(Textures.mortgagedTexture);
    const mortgageScale =
      Math.min(tileBackground.width, tileBackground.height) / Math.max(mortgagedSymbol.width, mortgagedSymbol.height);
    mortgagedSymbol.width = mortgagedSymbol.width * mortgageScale;
    mortgagedSymbol.height = mortgagedSymbol.height * mortgageScale;
    mortgagedSymbol.x = tileBackground.width - mortgagedSymbol.width;
    mortgagedSymbol.y = tileBackground.height - mortgagedSymbol.height;
    mortgagedSymbol.visible = false;
    this.mortgagedSymbol = mortgagedSymbol;

    this.drawInfoCard(parentContainer);

    const tileContainer = this.container;
    tileContainer.addChild(tileBackground, electricIcon, price, tileText, mortgagedSymbol);
    tileContainer.x = args.x;
    tileContainer.y = args.y;
    tileContainer.pivot.x = this.width / 2;
    tileContainer.pivot.y = this.height / 2;
    tileContainer.rotation = args.rotation;
    tileContainer.interactive = true;
    tileContainer.buttonMode = false;
    tileContainer.on('mouseover', () => {
      this.infoCardContainer!.visible = true;
    });
    tileContainer.on('mouseout', () => {
      this.infoCardContainer!.visible = false;
    });
    parentContainer.addChild(tileContainer);
  }

  private drawInfoCard(parentContainer: PIXI.Container) {
    if (!this.tile) {
      console.error('Cannot draw info card for undefined tile');
      return;
    }

    const infoCardContainer = new PIXI.Container();
    infoCardContainer.x = BOARD_WIDTH * 0.5 - this.width;
    infoCardContainer.y = BOARD_HEIGHT * 0.5 - this.height;
    infoCardContainer.visible = false;
    this.infoCardContainer = infoCardContainer;

    const cardBackground = new PIXI.Graphics();
    cardBackground.lineStyle(2, 0x000000, 1);
    cardBackground.beginFill(0xffffff, 1);
    cardBackground.drawRoundedRect(0, 0, this.width * 2, this.height * 2, 15);
    cardBackground.endFill();

    const colorBar = new PIXI.Graphics();
    colorBar.lineStyle(2, 0x000000, 1);
    colorBar.beginFill(0xffffff, 1);
    colorBar.drawRect(0, 0, this.width * 2, this.height * 0.2);
    colorBar.endFill();

    const title = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      stroke: 0xffffff99,
      strokeThickness: 4,
      fontSize: this.height * 0.14,
    });
    title.pivot.x = title.width / 2;
    title.x = this.width;
    title.y = colorBar.height * 0.5 - title.height * 0.5;

    const text = `Electric: 10 x dice\n\nElectric and Internet: 20 x dice\n
 Mortgage: $${this.tile.mortgageValue}
  Buyback: $${Math.floor(this.tile.mortgageValue! * 1.1)}`;
    const infoText = new PIXI.Text(text, {
      fontFamily: 'monospace',
      fill: 0x000000,
      fontSize: 28,
      align: 'left',
      wordWrap: true,
      wordWrapWidth: cardBackground.width,
    });
    infoText.x = cardBackground.width * 0.5 - infoText.width * 0.5;
    infoText.y = colorBar.height;

    infoCardContainer.addChild(cardBackground, colorBar, title, infoText);
    parentContainer.addChild(infoCardContainer);
  }

  fade(): void {
    TileRenderUtils.fade(this.container);
  }
  unfade(): void {
    TileRenderUtils.unfade(this.container);
  }
}
