import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../shared/Player';
import { TileType } from '../shared/TileType';
import { ITile } from './ITile';

export class GoToPrisonTile implements ITile {
  id: string;
  name = 'Go to Prison';
  buyable = false;
  type: TileType = TileType.GoToPrison;
  owner: Player | undefined;
  mortgaged = false;

  constructor() {
    this.id = 'goToPrison';
  }

  onLanded(gameData: GameData): void {}

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>(<unknown>{
      ...this,
    });
  }
}
