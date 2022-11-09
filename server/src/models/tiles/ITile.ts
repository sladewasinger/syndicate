import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { StateName } from '../../game/states/StateNames';

export interface ITile {
  name: string;
  id: string;
  buyable: boolean;
  type: TileType;
  owner: Player | undefined;
  onLanded(gameData: GameData, currentState: StateName): StateName;
  getClientTile(gameData: GameData): IClientTile;
}

export interface IBuyableTile extends ITile {
  mortgaged: boolean;
  price: number;
  mortgageValue: number;
}

export interface IBuildableTile extends IBuyableTile {
  buildings: number;
  buildingCost: number;
  skyscraperPrice: number;
}
