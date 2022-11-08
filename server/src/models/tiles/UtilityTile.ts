import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { IBuyableTile } from './ITile';

export class UtilityTile implements IBuyableTile {
  id: string;
  name: string;
  type: TileType;
  price: number;
  owner: Player | undefined;
  buyable: boolean = true;
  mortgageValue: number;
  mortgaged: boolean = false;

  constructor(name: string, price: number) {
    this.id = randomUUID();
    this.name = name;
    this.type = TileType.Utility;
    this.price = price;
    this.mortgageValue = Math.floor(price * 0.5);
  }

  entranceFee(gameData: GameData): number {
    if (this.owner == null) {
      return 0;
    }
    const utilityCount = gameData.tiles
      .filter((tile) => tile.owner?.id == this.owner?.id)
      .filter((tile) => tile.type === TileType.Utility).length;
    const dice = gameData.dice;
    const diceSum = dice[0] + dice[1];
    if (utilityCount === 1) {
      return diceSum * 10;
    } else {
      return diceSum * 20;
    }
  }

  onLanded(gameData: GameData): void {}

  getOwner(): Player | undefined {
    return this.owner;
  }

  setOwner(player: Player | undefined): void {
    this.owner = player;
  }

  getClientTile(gameData: GameData): IClientTile {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      color: 0x000000,
      price: this.price,
      ownerId: this.owner?.id,
      buyable: this.buyable,
      mortgageValue: this.mortgageValue,
      entranceFees: [],
      buildingPrice: undefined,
      skyscraper: undefined,
      skyscraperPrice: undefined,
      rent: this.entranceFee(gameData),
    };
  }
}
