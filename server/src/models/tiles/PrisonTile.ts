import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../shared/Player';
import { TileType } from '../shared/TileType';
import type { ITile } from './ITile';

export class PrisonTile implements ITile {
  id: string;
  name = 'Traffic';
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
