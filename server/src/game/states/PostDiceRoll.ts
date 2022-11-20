import type { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class PostDiceRoll implements IGameState {
  name: StateName = StateName.PostDiceRoll;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    if (gameData.currentPlayer.position == gameData.currentPlayer.targetPosition) {
      return StateName.LandedOnTile;
    }

    gameData.currentPlayer.position += 1; // Move one tile at a time
    if (gameData.currentPlayer.position >= gameData.tiles.length) {
      gameData.currentPlayer.position = 0; // Wrap around
    }

    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData): void {}
}
