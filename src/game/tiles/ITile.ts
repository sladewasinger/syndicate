import crypto from 'crypto';
import { GameData } from '../models/GameData';
import { Player } from '../models/Player';
import { IClientTile } from './IClientTile';

export interface ITile {
  name: string;
  id: string;
  buyable: boolean;
  type: string;
  owner: Player | null;
  mortgaged: boolean;
  onLanded(gameData: GameData): void;
  getClientTile(gameData: GameData): IClientTile;
}
