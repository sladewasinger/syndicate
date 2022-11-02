import { randomUUID } from 'crypto';
import type { GameData } from '../GameData';
import type { Player } from '../Player';
import type { IClientTile } from '~shared/models/tiles/IClientTile';
import type { IBuyableTile, ITile } from './ITile';
import { TileType } from '~shared/models/tiles/TileType';

export class DistrictTile implements IBuyableTile {
  id: string;
  owner: Player | undefined;
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
    const clientTile: IClientTile = {
      id: this.id,
      name: this.name,
      color: this.color,
      buyable: this.buyable,
      type: this.type,
      price: this.price,
      owner: this.owner?.id,
      entranceFees: this.entranceFees,
      buildingPrice: this.buildingPrice,
      skyscraperPrice: this.skyscraperPrice,
      skyscraper: this.skyscraper,
      rent: this.entranceFee(gameData),
    };
    return clientTile;
  }
}
