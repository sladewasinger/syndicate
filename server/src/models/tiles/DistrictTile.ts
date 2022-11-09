import { randomUUID } from 'crypto';
import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import type { IBuyableTile } from './ITile';
import { StateName } from '../../game/states/StateNames';

export class DistrictTile implements IBuyableTile {
  id: string;
  owner: Player | undefined;
  buildingCount: number = 0;
  skyscraper: boolean = false;
  buyable: boolean = true;
  mortgaged: boolean = false;
  mortgageValue: number;
  type: TileType = TileType.District;

  constructor(
    public name: string,
    public price: number,
    public color: number,
    public entranceFees: number[],
    public buildingPrice: number,
    public skyscraperPrice: number
  ) {
    if (entranceFees.length !== 6) {
      throw new Error('entranceFees array must have 6 elements');
    }
    this.id = randomUUID();
    this.mortgageValue = Math.floor(this.price * 0.5);
  }

  entranceFee(gameData: GameData) {
    return this.entranceFees[this.buildingCount + (this.skyscraper ? 1 : 0)];
  }

  onLanded(gameData: GameData, currentState: StateName): StateName {
    if (this.owner != null && this.owner !== gameData.currentPlayer) {
      gameData.currentPlayer.money -= this.entranceFee(gameData);
      this.owner.money += this.entranceFee(gameData);
      return StateName.TurnEnd;
    }

    return currentState;
  }

  getClientTile(gameData: GameData): IClientTile {
    const clientTile: IClientTile = {
      id: this.id,
      name: this.name,
      color: this.color,
      buyable: this.buyable,
      type: this.type,
      price: this.price,
      mortgageValue: this.mortgageValue,
      ownerId: this.owner?.id,
      entranceFees: this.entranceFees,
      buildingPrice: this.buildingPrice,
      skyscraperPrice: this.skyscraperPrice,
      skyscraper: this.skyscraper,
      rent: this.entranceFee(gameData),
    };
    return clientTile;
  }
}
