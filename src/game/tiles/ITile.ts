import crypto from 'crypto';
import { GameData } from '../models/GameData';

export interface ITile {
  name: string;
  id: string;
  buyable: boolean;
  type: string;
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
