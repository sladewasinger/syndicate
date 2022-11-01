import type { TileType } from './TileType';

export interface IClientTile {
  name: string;
  id: string;
  buyable: boolean;
  type: TileType;
  price: number;
  owner: string | null;
  entranceFees: number[] | null;
  buildingPrice: number | null;
  skyscraperPrice: number | null;
  skyscraper: boolean | null;
  rent: number | null;
}
