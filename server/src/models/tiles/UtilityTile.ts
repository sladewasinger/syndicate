import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { IBuyableTile } from './ITile';
import { StateName } from '../shared/StateNames';

export class UtilityTile implements IBuyableTile {
  id: string;
  name: string;
  type: TileType;
  price: number;
  owner: Player | undefined;
  buyable: boolean = true;
  mortgageValue: number;
  mortgaged: boolean = false;

  constructor(name: string, price: number, type: TileType.Internet | TileType.Electric) {
    this.id = randomUUID();
    this.name = name;
    this.type = type;
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

  onLanded(gameData: GameData, currentState: StateName): StateName {
    if (this.owner != null) {
      if (this.owner !== gameData.currentPlayer && !this.mortgaged) {
        gameData.currentPlayer.money -= this.entranceFee(gameData);
        this.owner.money += this.entranceFee(gameData);
      }
      return StateName.TurnEnd;
    }

    return currentState;
  }

  getOwner(): Player | undefined {
    return this.owner;
  }

  setOwner(player: Player | undefined): void {
    this.owner = player;
  }

  getClientTile(gameData: GameData): IClientTile {
    const tile: IClientTile = {
      id: this.id,
      name: this.name,
      type: this.type,
      color: 0x000000,
      price: this.price,
      ownerId: this.owner?.id,
      buyable: this.buyable,
      mortgageValue: this.mortgageValue,
      mortgaged: this.mortgaged,
      entranceFees: [],
      buildingCost: undefined,
      skyscraper: undefined,
      skyscraperPrice: undefined,
      rent: this.entranceFee(gameData),
      buildingCount: undefined,
    };
    return tile;
  }
}
