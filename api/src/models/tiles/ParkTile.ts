import { Player } from 'models/Player';
import { GameData } from '../GameData';
import { IClientTile } from './IClientTile';
import { ITile } from './ITile';
import { TileType } from './TileType';

export class ParkTile implements ITile {
  id: string;
  name = 'Public Park';
  buyable = false;
  type: TileType = TileType.Park;
  owner: Player | undefined;
  mortgaged = false;

  constructor() {
    this.id = 'park';
  }

  onLanded(gameData: GameData): void {}

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>(<unknown>{
      ...this,
    });
  }
}
