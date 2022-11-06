import { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
import { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class GameOver implements IGameState {
  name: StateName = StateName.GameOver;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): StateName {
    return this.name;
  }
}
