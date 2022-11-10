import { randomUUID } from 'crypto';
import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import type { IBuildableTile, IBuyableTile } from './ITile';
import { StateName } from '../shared/StateNames';

export class DistrictTile implements IBuyableTile, IBuildableTile {
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
    public buildingCost: number,
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
    const clientTile: IClientTile = Object.assign({ ownerId: this.owner?.id, rent: this.entranceFee(gameData) }, this);
    return clientTile;
  }
}
