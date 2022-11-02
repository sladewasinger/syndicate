import type { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class PostDiceRoll implements IGameState {
  name: StateName = StateName.PostDiceRoll;

  onEnter(gameData: GameData): void {}

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    gameData.currentPlayer.position += 1; // Move one tile at a time
    if (gameData.currentPlayer.position >= gameData.tiles.length) {
      gameData.currentPlayer.position = 0; // Wrap around
    }
    if (gameData.currentPlayer.position == gameData.currentPlayer.targetPosition) {
      return StateName.LandedOnTile;
    }
    return this.name;
  }

  event(eventName: StateEvent, gameData: GameData): StateName {
    return this.name;
  }
}
