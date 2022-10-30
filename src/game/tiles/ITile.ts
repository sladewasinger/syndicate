import crypto from 'crypto';
import { GameData } from '../models/GameData';
import { Player } from '../models/Player';

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

export interface IClientTile {
  name: string;
  id: string;
  buyable: boolean;
  type: string;
  price: number;
  owner: string | null;
  entranceFees: number[] | null;
  buildingPrice: number | null;
  skyscraperPrice: number | null;
  skyscraper: boolean | null;
  rent: number | null;
}
