import { Tile } from './ITile';
import crypto from 'crypto';
import { GameData } from '../models/GameData';

export class StartTile implements Tile {
  id: string;
  buyable: boolean = false;

  constructor(public name: string) {
    this.id = crypto.randomUUID();
  }

  onLanded(gameData: GameData): void {
    gameData.currentPlayer.money += 200;
  }
}
