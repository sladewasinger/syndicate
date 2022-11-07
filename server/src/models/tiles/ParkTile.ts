import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { ITile } from './ITile';

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
