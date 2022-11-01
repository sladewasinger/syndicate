import type { GameData } from '../GameData';
import type { Player } from '../Player';
import type { IClientTile } from './IClientTile';
import type { TileType } from './TileType';

export interface ITile {
  name: string;
  id: string;
  buyable: boolean;
  type: TileType;
  owner: Player | undefined;
  mortgaged: boolean;
  onLanded(gameData: GameData): void;
  getClientTile(gameData: GameData): IClientTile;
}
