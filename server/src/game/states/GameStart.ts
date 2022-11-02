import type { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class GameStart implements IGameState {
  name: StateName = StateName.GameStart;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): StateName {
    return this.name;
  }
}
