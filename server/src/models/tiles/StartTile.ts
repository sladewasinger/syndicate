import { randomUUID } from 'crypto';
import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import type { ITile } from './ITile';
import { StateName } from '../shared/StateNames';

export class StartTile implements ITile {
  id: string;
  name: string = 'Start';
  buyable: boolean = false;
  type: TileType = TileType.Start;
  owner: Player | undefined;
  mortgaged = false;

  constructor() {
    this.id = randomUUID();
  }

  onLanded(gameData: GameData, currentState: StateName): StateName {
    return StateName.TurnEnd;
  }

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>{
      ...this,
      type: this.type,
      name: this.name,
      id: this.id,
      color: 0x000000,
      buyable: this.buyable,
      price: 0,
      ownerId: this.owner?.id,
      mortgageValue: undefined,
      entranceFees: undefined,
      buildingCost: undefined,
      skyscraperPrice: undefined,
      skyscraper: undefined,
      rent: undefined,
      buildingCount: undefined,
    };
  }
}
