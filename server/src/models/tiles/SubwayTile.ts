import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { IBuyableTile } from './ITile';
import { StateName } from '../shared/StateNames';

export class SubwayTile implements IBuyableTile {
  id: string;
  owner: Player | undefined;
  buildingCount: number = 0;
  skyscraper: boolean = false;
  buyable: boolean = true;
  mortgaged: boolean = false;
  type: TileType = TileType.Subway;
  mortgageValue: number;

  constructor(public name: string, public price: number) {
    this.id = randomUUID();
    this.mortgageValue = Math.floor(this.price * 0.5);
  }

  entranceFee(gameData: GameData) {
    const subwayCount = gameData.tiles
      .filter((tile) => tile.type === TileType.Subway)
      .filter((tile) => tile.owner === this.owner).length;
    const fees = [100, 200, 400, 800];
    return fees[subwayCount - 1];
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

  getClientTile(gameData: GameData): IClientTile {
    const clientTile: IClientTile = {
      id: this.id,
      name: this.name,
      color: 0x000000,
      buyable: this.buyable,
      type: this.type,
      price: this.price,
      mortgageValue: this.mortgageValue,
      mortgaged: this.mortgaged,
      ownerId: this.owner?.id,
      entranceFees: undefined,
      buildingCost: undefined,
      skyscraperPrice: undefined,
      skyscraper: this.skyscraper,
      rent: this.entranceFee(gameData),
      buildingCount: undefined,
    };
    return clientTile;
  }
}
