import { randomUUID } from 'crypto';
import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { ITile } from './ITile';
import { StateName } from '../shared/StateNames';

export class TaxTile implements ITile {
  name: string = 'Tax';
  id: string;
  owner: Player | undefined;
  buyable: boolean = false;
  type: TileType = TileType.Tax;
  price: number = 200;

  constructor() {
    this.id = randomUUID();
  }

  onLanded(gameData: GameData, currentState: StateName): StateName {
    gameData.currentPlayer.money -= this.price;
    return StateName.TurnEnd;
  }

  getClientTile(gameData: GameData): IClientTile {
    const clientTile: IClientTile = {
      id: this.id,
      name: this.name,
      color: 0x000000,
      buyable: this.buyable,
      type: this.type,
      ownerId: this.owner?.id,
      price: this.price,
      mortgageValue: undefined,
      mortgaged: false,
      skyscraper: undefined,
      rent: undefined,
      entranceFees: undefined,
      buildingCost: undefined,
      skyscraperPrice: undefined,
      buildingCount: undefined,
    };
    return clientTile;
  }
}
