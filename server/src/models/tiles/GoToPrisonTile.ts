import { Player } from '../../models/Player';
import { GameData } from '../GameData';
import { IClientTile } from './IClientTile';
import { ITile } from './ITile';
import { TileType } from '~shared/models/Tiles/TileType';

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
