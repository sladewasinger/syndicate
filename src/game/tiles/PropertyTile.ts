import crypto from 'crypto';
import { GameData } from '../models/GameData';
import { Player } from '../models/Player';
import { Tile as ITile } from './ITile';

export class PropertyTile implements ITile {
  id: string;
  owner: Player | null;
  houseCount: number = 0;
  hotel: boolean = false;
  buyable: boolean = true;

  constructor(
    public name: string,
    public price: number,
    public rents: number[],
    public housePrice: number,
    public hotelPrice: number
  ) {
    if (rents.length !== 6) {
      throw new Error('Rent array must have 6 elements');
    }
    this.id = crypto.randomUUID();
    this.owner = null;
  }

  rent(gameData: GameData) {
    return this.rents[this.houseCount + (this.hotel ? 1 : 0)];
  }

  onLanded(gameData: GameData): void {
    if (this.owner != null && this.owner !== gameData.currentPlayer) {
      gameData.currentPlayer.money -= this.rent(gameData);
      this.owner.money += this.rent(gameData);
    }
  }
}
