import type { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import type { ITile } from './ITile';
import { StateName } from '../shared/StateNames';

export class PrisonTile implements ITile {
  id: string;
  name = 'Traffic';
  buyable = false;
  type: TileType = TileType.Prison;
  owner: Player | undefined;
  mortgaged = false;

  constructor() {
    this.id = 'prison';
  }

  onLanded(gameData: GameData, currentState: StateName): StateName {
    return StateName.TurnEnd;
  }

  getClientTile(gameData: GameData): IClientTile {
    return <IClientTile>(<unknown>{
      ...this,
    });
  }
}
