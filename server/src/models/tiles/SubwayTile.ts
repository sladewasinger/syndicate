import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../shared/Player';
import { TileType } from '../shared/TileType';
import { IBuyableTile } from './ITile';

export class SubwayTile implements IBuyableTile {
  id: string;
  owner: Player | undefined;
  buildingCount: number = 0;
  skyscraper: boolean = false;
  buyable: boolean = true;
  mortgaged: boolean = false;
  type: TileType = TileType.Subway;

  constructor(public name: string, public price: number) {
    this.id = randomUUID();
  }

  entranceFee(gameData: GameData) {
    const subwayCount = gameData.tiles
      .filter((tile) => tile.type === TileType.Subway)
      .filter((tile) => tile.owner === this.owner).length;
    const fees = [100, 200, 400, 800];
    const fee = 2 ** subwayCount * 100;
    return fees[subwayCount - 1];
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
      color: 0x000000,
      buyable: this.buyable,
      type: this.type,
      price: this.price,
      ownerId: this.owner?.id,
      entranceFees: undefined,
      buildingPrice: undefined,
      skyscraperPrice: undefined,
      skyscraper: this.skyscraper,
      rent: this.entranceFee(gameData),
    };
    return clientTile;
  }
}
