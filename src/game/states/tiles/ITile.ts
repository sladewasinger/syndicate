import crypto from 'crypto';
import { GameData } from '../../models/GameData';

export interface Tile {
  name: string;
  id: string;
  buyable: boolean;
  onLanded(gameData: GameData): void;
}
