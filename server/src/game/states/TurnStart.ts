import type { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import type { IGameState } from './IGameState';

export class TurnStart implements IGameState {
  name: StateName = StateName.TurnStart;

  onEnter(gameData: GameData): void {
    gameData.diceDoublesInARow = 0;
  }

  onExit(): void {}

  update(gameData: GameData): StateName {
    return StateName.PreDiceRoll;
  }

  event(eventName: string, gameData: GameData): void {}
}
