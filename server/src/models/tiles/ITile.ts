import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';

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
  price: number;
}
