import type { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class PreDiceRoll implements IGameState {
  name: StateName = StateName.PreDiceRoll;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {
    this.nextState = this.name;
  }

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {
    switch (eventName) {
      case StateEvent.RollDice:
        this.nextState = StateName.RollDice;
        break;
      default:
        this.nextState = this.name;
        break;
    }
  }
}
