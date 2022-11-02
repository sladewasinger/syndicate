import { Player } from '../../models/Player';
import type { GameData } from '../GameData';
import type { IClientTile } from './IClientTile';
import type { ITile } from './ITile';
import { TileType } from 'src/../../shared/models/Tiles/TileType';

export class PrisonTile implements ITile {
  id: string;
  name = 'Prison';
  buyable = false;
  type: TileType = TileType.Prison;
  owner: Player | undefined;
  mortgaged = false;

  constructor() {
    this.id = 'prison';
  }

  onLanded(gameData: GameData): void {}

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>(<unknown>{
      ...this,
    });
  }
}
