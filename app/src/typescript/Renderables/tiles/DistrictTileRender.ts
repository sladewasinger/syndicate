import { TILE_WIDTH, TILE_HEIGHT, BOARD_WIDTH, BOARD_HEIGHT } from '@/typescript/models/BoardPositions';
import type { IClientGameData } from '@/typescript/models/shared/IClientGameData';
import * as PIXI from 'pixi.js';
import type { IClientTile } from '../../models/shared/IClientTile';
import type { RenderData } from '../RenderData';
import type { ITileRender, ITileRenderArgs } from './ITileRender';
import { TileRenderUtils } from './TileRenderUtils';

export class DistrictTileRender implements ITileRender {
  width: number = TILE_WIDTH;
  height: number = TILE_HEIGHT;
  container: PIXI.Container<PIXI.DisplayObject>;
  tileBackground: PIXI.Graphics | undefined = undefined;
  infoCardContainer: PIXI.Container | undefined;
  colorBar: PIXI.Graphics | undefined = undefined;
  building1: PIXI.Graphics | undefined;
  building2: PIXI.Graphics | undefined;
  building3: PIXI.Graphics | undefined;
  building4: PIXI.Graphics | undefined;
  skyscraper: PIXI.Graphics | undefined;
  faded: boolean = false;

  constructor(public tile: IClientTile) {
    this.container = new PIXI.Container();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    } else {
      this.tileBackground?.clear();
      this.tileBackground?.lineStyle(2, 0x000000, 1);
      this.tileBackground?.beginFill(0xffffff, 1);
      this.tileBackground?.drawRect(0, 0, this.width, this.height);
      this.tileBackground?.endFill();
    }

    if (gameTile.buildingCount === 1 && this.building1 !== undefined) {
      this.building1.visible = true;
      const targetPosY = this.colorBar!.height * 0.5 - this.building1.height * 0.5;
      this.building1.y += (targetPosY - this.building1.y) * 0.01;
    }
    if (gameTile.buildingCount === 2 && this.building2 !== undefined) {
      this.building2.visible = true;
    }
    if (gameTile.buildingCount === 3 && this.building3 !== undefined) {
      this.building3.visible = true;
    }
    if (gameTile.buildingCount === 4 && this.building4 !== undefined) {
      this.building4.visible = true;
    }
    if (gameTile.buildingCount === 5 && this.skyscraper !== undefined) {
      this.skyscraper.visible = true;
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
    this.colorBar = colorBar;

    const building1 = HouseFactory.createHouse();
    building1.x = 10;
    building1.y = colorBar.height * 0.5 - building1.height * 0.5 - 200;
    building1.visible = false;
    this.building1 = building1;

    const building2 = new PIXI.Graphics(building1.geometry);
    building2.x = building1.x + 14 * 2;
    building2.y = colorBar.height * 0.5 - building1.height * 0.5;
    building2.visible = false;
    this.building2 = building2;

    const building3 = new PIXI.Graphics(building1.geometry);
    building3.x = building1.x + 14 * 4;
    building3.y = colorBar.height * 0.5 - building1.height * 0.5;
    building3.visible = false;
    this.building3 = building3;

    const building4 = new PIXI.Graphics(building1.geometry);
    building4.x = building1.x + 14 * 6;
    building4.y = colorBar.height * 0.5 - building1.height * 0.5;
    building4.visible = false;
    this.building4 = building4;

    const skyscraper = new PIXI.Graphics();
    skyscraper.lineStyle(3, 0x000000, 1);
    skyscraper.beginFill(0xee0000, 1);
    skyscraper.drawRect(0, 0, this.width * 0.15, this.width * 0.3);
    skyscraper.endFill();
    skyscraper.x = building1.x + 14 * 8;
    skyscraper.y = colorBar.height * 0.5 - skyscraper.height * 0.8;
    skyscraper.visible = false;
    this.skyscraper = skyscraper;

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
    tileContainer.addChild(
      tileBackground,
      colorBar,
      building1,
      building2,
      building3,
      building4,
      skyscraper,
      priceText,
      tileText
    );
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
    cardBackground.drawRoundedRect(0, 0, this.width * 2, this.height * 2, 15);
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
\nBuildings:   $${this.tile.buildingCost}
\nMortgage:    $${this.tile.mortgageValue}
Buyback:     $${Math.floor(this.tile.mortgageValue! * 1.1)}`;
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

class HouseFactory {
  static createHouse() {
    const housePoints = [0, 4, 8, -4, 16, 4, 16, 20, 0, 20];
    housePoints.forEach((x) => (x = x + 4));

    const building1 = new PIXI.Graphics();
    building1.beginFill(0x00ff00, 1);
    building1.lineStyle(3, 0x000000, 1);
    building1.drawPolygon(housePoints);
    building1.endFill();

    return building1;
  }
}
