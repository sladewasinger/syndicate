import type { GameData } from '../../models/GameData';
import { StateName } from './StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class RollDice implements IGameState {
  name: StateName = StateName.RollDice;
  nextState: StateName = this.name;

  onEnter(gameData: GameData): void {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    gameData.dice = gameData.diceOverride || [dice1, dice2];
    gameData.currentPlayer.targetPosition =
      gameData.currentPlayer.position + gameData.dice.reduce((cur, next) => cur + next, 0);

    if (gameData.currentPlayer.targetPosition > gameData.tiles.length) {
      gameData.currentPlayer.targetPosition = gameData.currentPlayer.position % gameData.tiles.length;
    }
  }

  onExit(gameData: GameData): void {}

  update(gameData: GameData): StateName {
    return StateName.PostDiceRoll;
  }

  event(eventName: StateEvent, gameData: GameData) {}
}
