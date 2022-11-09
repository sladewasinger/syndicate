import { GameData } from '../GameData';
import { IClientTile } from '../shared/IClientTile';
import { Player } from '../Player';
import { TileType } from '../shared/TileType';
import { ITile } from './ITile';
import { StateName } from '../shared/StateNames';

export class GoToPrisonTile implements ITile {
  id: string;
  name = 'Enter Traffic';
  buyable = false;
  type: TileType = TileType.GoToPrison;
  owner: Player | undefined;
  mortgaged = false;

  constructor() {
    this.id = 'goToPrison';
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
