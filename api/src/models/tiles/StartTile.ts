import { randomUUID } from 'crypto';
import type { GameData } from '../GameData';
import type { IClientTile } from './IClientTile';
import type { ITile } from './ITile';
import { TileType } from './TileType';

export class StartTile implements ITile {
  id: string;
  buyable: boolean = false;
  type: TileType = TileType.Start;
  owner = null;
  mortgaged = false;

  constructor(public name: string) {
    this.id = randomUUID();
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
