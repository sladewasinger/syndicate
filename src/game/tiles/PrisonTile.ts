import { GameData } from '../models/GameData';
import { Tile } from './ITile';

export class PrisonTile implements Tile {
  id: string;
  name = 'Prison';
  buyable = false;

  constructor() {
    this.id = 'prison';
  }

  onLanded(gameData: GameData): void {}
}
