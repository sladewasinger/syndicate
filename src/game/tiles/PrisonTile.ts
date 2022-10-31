import { GameData } from '../models/GameData';
import { ITile } from './ITile';
import { IClientTile } from './IClientTile';

export class PrisonTile implements ITile {
  id: string;
  name = 'Prison';
  buyable = false;
  type: string = 'prison';
  owner = null;
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
