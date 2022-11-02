import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { Player } from '../Player';
import type { IClientTile } from '~shared/models/tiles/IClientTile';
import { ITile } from './ITile';
import { TileType } from '~shared/models/Tiles/TileType';

export class EventTile implements ITile {
  name: string = 'Event';
  id: string;
  owner: Player | undefined;
  buyable: boolean = false;
  type: TileType = TileType.Event;

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
