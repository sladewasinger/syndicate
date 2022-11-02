import type { TileType } from './TileType';

export interface IClientTile {
  name: string;
  id: string;
  color: number;
  buyable: boolean;
  type: TileType;
  price: number | undefined;
  owner: string | undefined;
  entranceFees: number[] | undefined;
  buildingPrice: number | undefined;
  skyscraperPrice: number | undefined;
  skyscraper: boolean | undefined;
  rent: number | undefined;
}
