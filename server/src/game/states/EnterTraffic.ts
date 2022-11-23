import { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class EnterTraffic implements IGameState {
  name: StateName = StateName.EnterTraffic;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
