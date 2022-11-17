import type { TileType } from './TileType';

export interface IClientTile {
  name: string;
  id: string;
  color: number;
  buyable: boolean;
  type: TileType;
  price: number | undefined;
  mortgageValue: number | undefined;
  mortgaged: boolean;
  ownerId: string | undefined;
  entranceFees: number[] | undefined;
  buildingCost: number | undefined;
  skyscraperPrice: number | undefined;
  skyscraper: boolean | undefined;
  rent: number | undefined;
  buildingCount: number | undefined;
}
