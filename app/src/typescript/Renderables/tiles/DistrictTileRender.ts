import { TILE_WIDTH, TILE_HEIGHT, BOARD_WIDTH, BOARD_HEIGHT } from '@/typescript/models/BoardPositions';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import * as PIXI from 'pixi.js';
import type { IClientTile } from '../../models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs } from './ITileRender';

export class DistrictTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  container: PIXI.Container<PIXI.DisplayObject>;
  tileBackground: PIXI.Graphics | undefined = undefined;
  infoCardContainer: PIXI.Container | undefined;

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  update(gameData: IClientGameData, renderData: RenderData) {
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
    }
  }

  drawInitial(args: ITileRenderArgs, parentContainer: PIXI.Container) {
    const tileBackground = new PIXI.Graphics();
    tileBackground.lineStyle(2, 0x000000, 1);
    tileBackground.beginFill(0xffffff, 1);
    tileBackground.drawRect(0, 0, this.width, this.height);
    tileBackground.endFill();
    this.tileBackground = tileBackground;

    const colorBar = new PIXI.Graphics();
    colorBar.lineStyle(2, 0x000000, 1);
    colorBar.beginFill(this.tile.color, 1);
    colorBar.drawRect(0, 0, this.width, this.height * 0.2);
    colorBar.endFill();

    const priceText = new PIXI.Text(`$${this.tile.price}`, {
      fill: 0x000000,
      fontSize: 35,
    });
    priceText.x = this.width * 0.5 - priceText.width * 0.5;
    priceText.y = this.height - priceText.height;

    const tileText = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      stroke: 0xffffff99,
      strokeThickness: 4,
      fontSize: this.height * 0.14,
      wordWrap: true,
      wordWrapWidth: this.width,
      align: 'center',
    });
    tileText.pivot.x = tileText.width / 2;
    tileText.x = this.width / 2;
    tileText.y = colorBar.height;

    this.drawInfoCard(parentContainer);

    const tileContainer = this.container;
    tileContainer.addChild(tileBackground, colorBar, priceText, tileText);
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
    const infoCardContainer = new PIXI.Container();
    infoCardContainer.x = BOARD_WIDTH * 0.5 - this.width;
    infoCardContainer.y = BOARD_HEIGHT * 0.5 - this.height;
    infoCardContainer.visible = false;
    this.infoCardContainer = infoCardContainer;

    const cardBackground = new PIXI.Graphics();
    cardBackground.lineStyle(2, 0x000000, 1);
    cardBackground.beginFill(0xffffff, 1);
    cardBackground.drawRect(0, 0, this.width * 2, this.height * 2);
    cardBackground.endFill();

    const colorBar = new PIXI.Graphics();
    colorBar.lineStyle(2, 0x000000, 1);
    colorBar.beginFill(this.tile.color, 1);
    colorBar.drawRect(0, 0, this.width * 2, this.height * 0.2);
    colorBar.endFill();

    const title = new PIXI.Text(this.tile.name, {
      fill: 0x000000,
      stroke: 0xffffff99,
      strokeThickness: 4,
      fontSize: this.height * 0.14,
    });
    title.x = this.width * 0.5 - title.width * 0.5 + 15;
    title.y = colorBar.height * 0.5 - title.height * 0.5;

    const text = `Entrance Fee: $${this.tile.rent}\n\n 1 Building: $${this.tile.entranceFees![1]}
2 Buildings: $${this.tile.entranceFees![2]}\n3 Buildings: $${this.tile.entranceFees![3]}
4 Buildings: $${this.tile.entranceFees![4]}\n Skyscraper: $${this.tile.entranceFees![5]}
\n\nMortgage\nValue:       $${this.tile.mortgageValue}`;
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
}
