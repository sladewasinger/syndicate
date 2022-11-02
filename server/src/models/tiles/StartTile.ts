import { randomUUID } from 'crypto';
import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../shared/Player';
import { TileType } from '../shared/TileType';
import type { ITile } from './ITile';

export class StartTile implements ITile {
  id: string;
  name: string = 'Start';
  buyable: boolean = false;
  type: TileType = TileType.Start;
  owner: Player | undefined;
  mortgaged = false;

  constructor() {
    this.id = randomUUID();
  }

  onLanded(gameData: GameData): void {
    gameData.currentPlayer.money += 200;
  }

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>{
      ...this,
      type: this.type,
      name: this.name,
      id: this.id,
      color: 0x000000,
      buyable: this.buyable,
      price: 0,
      owner: this.owner?.id,
      entranceFees: undefined,
      buildingPrice: undefined,
      skyscraperPrice: undefined,
      skyscraper: undefined,
      rent: undefined,
      buba: null,
    };
  }
}
