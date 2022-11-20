import type { GameData } from '../../models/GameData';
import { StateName } from '../../models/shared/StateNames';
import type { IGameState } from './IGameState';
import { StateEvent } from './StateEvents';

export class RollDice implements IGameState {
  name: StateName = StateName.RollDice;
  nextState: StateName = StateName.PostDiceRoll;

  onEnter(gameData: GameData): void {
    this.nextState = StateName.PostDiceRoll;

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    gameData.dice = gameData.diceOverride || [dice1, dice2];
    console.log(`Dice rolled: ${gameData.dice[0]} ${gameData.dice[1]}`);

    if (gameData.currentPlayer.isInJail) {
      if (gameData.dice[0] === gameData.dice[1]) {
        gameData.currentPlayer.isInJail = false;
        gameData.currentPlayer.jailTurns = 0;
        gameData.log(`Player ${gameData.currentPlayer.name} rolled doubles and got out of jail!`);
      } else {
        gameData.currentPlayer.jailTurns--;
      }

      if (gameData.currentPlayer.jailTurns <= 0) {
        gameData.currentPlayer.isInJail = false;
        gameData.currentPlayer.money -= 100;
        gameData.log(`Player ${gameData.currentPlayer.name} paid 100 to get out of jail.`);
      }
    }

    if (!gameData.currentPlayer.isInJail) {
      gameData.currentPlayer.targetPosition =
        gameData.currentPlayer.position + gameData.dice.reduce((partialSum, next) => partialSum + next, 0);

      if (gameData.currentPlayer.targetPosition >= gameData.tiles.length) {
        gameData.currentPlayer.targetPosition = gameData.currentPlayer.targetPosition % gameData.tiles.length;
      }

      if (gameData.dice[0] === gameData.dice[1]) {
        gameData.diceDoublesInARow++;
      }

      if (gameData.diceDoublesInARow >= 3) {
        gameData.log(`${gameData.currentPlayer.name} rolled 3 doubles in a row, and just ran into traffic!`);
        this.nextState = StateName.InTraffic;
      } else {
        this.nextState = StateName.PostDiceRoll;
      }
    }
  }

  onExit(gameData: GameData): void {
    this.nextState = StateName.PostDiceRoll;
  }

  update(gameData: GameData): StateName {
    return this.nextState;
  }

  event(eventName: StateEvent, gameData: GameData) {}
}
