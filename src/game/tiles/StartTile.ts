import { ITile } from './ITile';
import { IClientTile } from './IClientTile';
import crypto from 'crypto';
import { GameData } from '../models/GameData';

export class StartTile implements ITile {
  id: string;
  buyable: boolean = false;
  type: string = 'start';
  owner = null;
  mortgaged = false;

  constructor(public name: string) {
    this.id = crypto.randomUUID();
  }

  onLanded(gameData: GameData): void {
    gameData.currentPlayer.money += 200;
  }

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>(<unknown>{
      ...this,
    });
  }
}
