import type { GameData } from '../GameData';
import type { Player } from '../Player';
import type { IClientTile } from './IClientTile';
import { TileType } from 'src/../../shared/models/Tiles/TileType';

export interface ITile {
  name: string;
  id: string;
  buyable: boolean;
  type: TileType;
  owner: Player | undefined;
  onLanded(gameData: GameData): void;
  getClientTile(gameData: GameData): IClientTile;
}

export interface IBuyableTile extends ITile {
  mortgaged: boolean;
}
