import { randomUUID } from 'crypto';
import type { GameData } from '../GameData';
import type { Player } from '../Player';
import type { IClientTile } from './IClientTile';
import type { ITile } from './ITile';
import { TileType } from './TileType';

export class DistrictTile implements ITile {
  id: string;
  owner: Player | null;
  buildingCount: number = 0;
  skyscraper: boolean = false;
  buyable: boolean = true;
  mortgaged: boolean = false;
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
    this.owner = null;
  }

  entranceFee(gameData: GameData) {
    return this.entranceFees[this.buildingCount + (this.skyscraper ? 1 : 0)];
  }

  onLanded(gameData: GameData): void {
    if (this.owner != null && this.owner !== gameData.currentPlayer) {
      gameData.currentPlayer.money -= this.entranceFee(gameData);
      this.owner.money += this.entranceFee(gameData);
    }
  }

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>{
      ...this,
      rent: this.entranceFee(gameData),
    };
  }
}
