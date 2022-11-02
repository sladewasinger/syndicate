import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../shared/Player';
import { TileType } from '../shared/TileType';
import { ITile } from './ITile';

export class TaxTile implements ITile {
  name: string = 'Tax';
  id: string;
  owner: Player | undefined;
  buyable: boolean = false;
  type: TileType = TileType.Tax;

  constructor() {
    this.id = randomUUID();
  }

  onLanded(gameData: GameData): void {}

  getClientTile(gameData: GameData): IClientTile {
    const clientTile: IClientTile = {
      id: this.id,
      name: this.name,
      color: 0x000000,
      buyable: this.buyable,
      type: this.type,
      owner: this.owner?.id,
      price: undefined,
      skyscraper: undefined,
      rent: undefined,
      entranceFees: undefined,
      buildingPrice: undefined,
      skyscraperPrice: undefined,
    };
    return clientTile;
  }
}