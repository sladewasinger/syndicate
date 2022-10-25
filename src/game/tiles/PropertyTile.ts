import crypto from 'crypto';
import { GameData } from '../models/GameData';
import { Player } from '../models/Player';
import { Tile as ITile } from './ITile';

export class DistrictTile implements ITile {
  id: string;
  owner: Player | null;
  buildingCount: number = 0;
  skyscraper: boolean = false;
  buyable: boolean = true;

  constructor(
    public name: string,
    public price: number,
    public entranceFees: number[],
    public housePrice: number,
    public hotelPrice: number
  ) {
    if (entranceFees.length !== 6) {
      throw new Error('entranceFees array must have 6 elements');
    }
    this.id = crypto.randomUUID();
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
}